import React, { useState, useMemo } from 'react';
import { ethers } from 'ethers';
import {
  Tool,
  ToolTitle,
  Input,
  Button,
  Result,
  ErrorMessage,
  ResultTable,
  ResultRow,
  ResultLabel,
  ResultValue,
  LoadingSpinner,
  Select,
} from '../styles';
import UNISWAP_V3_POOL_ABI from '../abis/UniswapV3Pool.json';
import ERC20_ABI from '../abis/ERC20.json';

interface ChainConfig {
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  uniswapInfoUrl: string;
}

const CHAIN_CONFIGS: { [key: string]: ChainConfig } = {
  mainnet: {
    name: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    explorerUrl: 'https://etherscan.io',
    uniswapInfoUrl: 'https://info.uniswap.org/#',
  },
  arbitrum: {
    name: 'Arbitrum One',
    rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    explorerUrl: 'https://arbiscan.io',
    uniswapInfoUrl: 'https://info.uniswap.org/#/?chain=arbitrum',
  },
  optimism: {
    name: 'Optimism',
    rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    explorerUrl: 'https://optimistic.etherscan.io',
    uniswapInfoUrl: 'https://info.uniswap.org/#/?chain=optimism',
  },
  polygon: {
    name: 'Polygon',
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    explorerUrl: 'https://polygonscan.com',
    uniswapInfoUrl: 'https://info.uniswap.org/#/?chain=polygon',
  },
};

interface TokenPrice {
  address: string;
  usdPrice: number | null;
}

interface PoolInfo {
  token0: {
    address: string;
    symbol: string;
    decimals: number;
    usdPrice: number | null;
  };
  token1: {
    address: string;
    symbol: string;
    decimals: number;
    usdPrice: number | null;
  };
  fee: number;
  price: number;
  sqrtPriceX96: string;
  tick: number;
}

const COINGECKO_PLATFORM_IDS: { [key: string]: string } = {
  mainnet: 'ethereum',
  arbitrum: 'arbitrum-one',
  optimism: 'optimistic-ethereum',
  polygon: 'polygon-pos',
};

const UniswapPoolInfo: React.FC = () => {
  const [poolAddress, setPoolAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('mainnet');
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = useMemo(() => {
    const infuraKey = process.env.REACT_APP_INFURA_KEY;
    if (!infuraKey) {
      throw new Error('REACT_APP_INFURA_KEY is not set');
    }
    return new ethers.JsonRpcProvider(CHAIN_CONFIGS[selectedChain].rpcUrl);
  }, [selectedChain]);

  const calculatePrice = (sqrtPriceX96: bigint, decimals0: number, decimals1: number): number => {
    try {
      const numerator = sqrtPriceX96 * sqrtPriceX96;
      const denominator = 2n ** 192n;
      const decimalDiff = Math.abs(decimals1 - decimals0);
      const scale = 10n ** BigInt(decimalDiff);
      
      let price: number;
      if (decimals1 >= decimals0) {
        const scaledPrice = (numerator * scale) / denominator;
        price = Number(ethers.formatUnits(scaledPrice, decimalDiff));
      } else {
        const scaledPrice = numerator / (denominator * scale);
        price = Number(ethers.formatUnits(scaledPrice, 0)) * (10 ** decimalDiff);
      }
      
      if (isNaN(price) || !isFinite(price)) {
        throw new Error('Invalid price calculation result');
      }
      
      return price;
    } catch (err) {
      console.error('Price calculation error:', err);
      throw new Error('Failed to calculate price');
    }
  };

  const fetchTokenPrice = async (tokenAddress: string): Promise<number | null> => {
    try {
      const platformId = COINGECKO_PLATFORM_IDS[selectedChain];
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${tokenAddress}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch token price');
      }
      
      const data = await response.json();
      return data[tokenAddress.toLowerCase()]?.usd ?? null;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return null;
    }
  };

  const fetchTokenPrices = async (token0Address: string, token1Address: string): Promise<[number | null, number | null]> => {
    try {
      // Fetch prices sequentially to avoid API limits
      const token0Price = await fetchTokenPrice(token0Address);
      // Add a small delay between requests to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 100));
      const token1Price = await fetchTokenPrice(token1Address);
      
      return [token0Price, token1Price];
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return [null, null];
    }
  };

  const fetchPoolInfo = async () => {
    try {
      setError('');
      setLoading(true);
      setPoolInfo(null);
      
      if (!ethers.isAddress(poolAddress)) {
        throw new Error('Invalid pool address');
      }

      const poolContract = new ethers.Contract(
        poolAddress,
        UNISWAP_V3_POOL_ABI,
        provider
      );

      // Fetch pool data
      const [token0Address, token1Address, fee, slot0] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.slot0(),
      ]);

      // Get token details
      const token0Contract = new ethers.Contract(token0Address, ERC20_ABI, provider);
      const token1Contract = new ethers.Contract(token1Address, ERC20_ABI, provider);

      const [
        token0Symbol,
        token1Symbol,
        token0Decimals,
        token1Decimals,
        [token0Price, token1Price],
      ] = await Promise.all([
        token0Contract.symbol(),
        token1Contract.symbol(),
        token0Contract.decimals(),
        token1Contract.decimals(),
        fetchTokenPrices(token0Address, token1Address),
      ]);

      // Calculate current price
      const sqrtPriceX96 = slot0.sqrtPriceX96;
      const price = calculatePrice(
        sqrtPriceX96,
        Number(token0Decimals),
        Number(token1Decimals)
      );

      setPoolInfo({
        token0: {
          address: token0Address,
          symbol: token0Symbol,
          decimals: Number(token0Decimals),
          usdPrice: token0Price,
        },
        token1: {
          address: token1Address,
          symbol: token1Symbol,
          decimals: Number(token1Decimals),
          usdPrice: token1Price,
        },
        fee: Number(fee) / 10000,
        price,
        sqrtPriceX96: sqrtPriceX96.toString(),
        tick: Number(slot0.tick),
      });
    } catch (err: any) {
      console.error('Pool info fetch error:', err);
      setError(err.message || 'Failed to fetch pool information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tool>
      <ToolTitle>Uniswap V3 Pool Info</ToolTitle>
      <Select
        value={selectedChain}
        onChange={(e) => setSelectedChain(e.target.value)}
      >
        {Object.entries(CHAIN_CONFIGS).map(([key, config]) => (
          <option key={key} value={key}>
            {config.name}
          </option>
        ))}
      </Select>
      <Input
        type="text"
        placeholder="Enter Uniswap V3 Pool Address"
        value={poolAddress}
        onChange={(e) => setPoolAddress(e.target.value)}
      />
      <Button onClick={fetchPoolInfo} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Pool Info'}
      </Button>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {poolInfo && (
        <Result>
          <ResultTable>
            <ResultRow>
              <ResultLabel>Token Pair:</ResultLabel>
              <ResultValue>
                <a 
                  href={`${CHAIN_CONFIGS[selectedChain].uniswapInfoUrl}/pools/${poolAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {poolInfo.token0.symbol}/{poolInfo.token1.symbol}
                </a>
              </ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Fee Tier:</ResultLabel>
              <ResultValue>{poolInfo.fee}%</ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Token0 ({poolInfo.token0.symbol}):</ResultLabel>
              <ResultValue>
                <div>
                  <a 
                    href={`${CHAIN_CONFIGS[selectedChain].explorerUrl}/token/${poolInfo.token0.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {poolInfo.token0.address}
                  </a>
                  {poolInfo.token0.usdPrice !== null && (
                    <div>Price: ${poolInfo.token0.usdPrice.toFixed(4)}</div>
                  )}
                </div>
              </ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Token1 ({poolInfo.token1.symbol}):</ResultLabel>
              <ResultValue>
                <div>
                  <a 
                    href={`${CHAIN_CONFIGS[selectedChain].explorerUrl}/token/${poolInfo.token1.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {poolInfo.token1.address}
                  </a>
                  {poolInfo.token1.usdPrice !== null && (
                    <div>Price: ${poolInfo.token1.usdPrice.toFixed(4)}</div>
                  )}
                </div>
              </ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Current Price:</ResultLabel>
              <ResultValue>
                <div>
                  1 {poolInfo.token0.symbol} = {poolInfo.price.toFixed(6)} {poolInfo.token1.symbol}
                  {poolInfo.token0.usdPrice !== null && poolInfo.token1.usdPrice !== null && (
                    <div>
                      (${(poolInfo.token0.usdPrice).toFixed(4)} = ${(poolInfo.token0.usdPrice * poolInfo.price).toFixed(4)})
                    </div>
                  )}
                </div>
              </ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Current Tick:</ResultLabel>
              <ResultValue>{poolInfo.tick}</ResultValue>
            </ResultRow>
          </ResultTable>
        </Result>
      )}
    </Tool>
  );
};

export default UniswapPoolInfo;
