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
} from '../styles';
import UNISWAP_V3_POOL_ABI from '../abis/UniswapV3Pool.json';
import ERC20_ABI from '../abis/ERC20.json';

interface PoolInfo {
  token0: {
    address: string;
    symbol: string;
    decimals: number;
  };
  token1: {
    address: string;
    symbol: string;
    decimals: number;
  };
  fee: number;
  price: number;
  sqrtPriceX96: string;
  tick: number;
}

const UniswapPoolInfo: React.FC = () => {
  const [poolAddress, setPoolAddress] = useState('');
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = useMemo(() => {
    const infuraKey = process.env.REACT_APP_INFURA_KEY;
    if (!infuraKey) {
      throw new Error('REACT_APP_INFURA_KEY is not set');
    }
    return new ethers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${infuraKey}`
    );
  }, []);

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
      ] = await Promise.all([
        token0Contract.symbol(),
        token1Contract.symbol(),
        token0Contract.decimals(),
        token1Contract.decimals(),
      ]);

      // Calculate current price
      const sqrtPriceX96 = slot0.sqrtPriceX96;
      // Convert decimals to number since they come as bigint from the contract
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
        },
        token1: {
          address: token1Address,
          symbol: token1Symbol,
          decimals: Number(token1Decimals),
        },
        fee: Number(fee) / 10000, // Convert fee to number before division
        price,
        sqrtPriceX96: sqrtPriceX96.toString(),
        tick: Number(slot0.tick), // Also convert tick to number for consistency
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
                {poolInfo.token0.symbol}/{poolInfo.token1.symbol}
              </ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Fee Tier:</ResultLabel>
              <ResultValue>{poolInfo.fee}%</ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Current Price:</ResultLabel>
              <ResultValue>
                1 {poolInfo.token0.symbol} = {poolInfo.price.toFixed(6)} {poolInfo.token1.symbol}
              </ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Current Tick:</ResultLabel>
              <ResultValue>{poolInfo.tick}</ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Token0 Address:</ResultLabel>
              <ResultValue>{poolInfo.token0.address}</ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Token1 Address:</ResultLabel>
              <ResultValue>{poolInfo.token1.address}</ResultValue>
            </ResultRow>
          </ResultTable>
        </Result>
      )}
    </Tool>
  );
};

export default UniswapPoolInfo;
