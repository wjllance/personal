import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// API Configuration
const API_KEYS = {
  ALPHA_VANTAGE: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'your_alpha_vantage_key',
  FMP: process.env.REACT_APP_FMP_API_KEY || 'your_fmp_key'
};

const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  FMP: 'https://financialmodelingprep.com/api/v3'
};

interface Asset {
  name: string;
  marketCap: number;
  symbol: string;
  priceChange24h?: number;
  type?: 'crypto' | 'stock' | 'commodity';
}

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(10, 25, 47, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(100, 255, 218, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  color: #64ffda;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, rgba(100, 255, 218, 0), rgba(100, 255, 218, 0.8), rgba(100, 255, 218, 0));
  }
`;

const AssetColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const AssetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AssetItem = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(100, 255, 218, 0) 0%,
      rgba(100, 255, 218, 0.03) 50%,
      rgba(100, 255, 218, 0) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateX(4px);
    background: rgba(255, 255, 255, 0.03);
    
    &::before {
      opacity: 1;
      animation: ${shimmer} 2s infinite linear;
    }
  }
`;

const Rank = styled.div`
  color: #64ffda;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.9;
  font-family: 'Monaco', monospace;
`;

const AssetInfo = styled.div`
  min-width: 0;
  position: relative;
`;

const AssetName = styled.div`
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AssetSymbol = styled.div`
  color: #8892b0;
  font-size: 0.75rem;
  font-family: 'Monaco', monospace;
  margin-top: 2px;
  opacity: 0.8;
`;

const MarketCap = styled.div`
  color: #ffffff;
  font-size: 0.85rem;
  text-align: right;
  font-family: 'Monaco', monospace;
  position: relative;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(100, 255, 218, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
    border: 1px solid rgba(100, 255, 218, 0.1);
    transition: all 0.3s ease;
  }
  
  ${AssetItem}:hover & {
    &::before {
      border-color: rgba(100, 255, 218, 0.2);
    }
  }
`;

const PriceChange = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? '#00ff9d' : '#ff4d4d'};
  font-size: 0.75rem;
  margin-left: 8px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 25, 47, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  border-radius: 12px;
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(100, 255, 218, 0.1);
  border-top-color: #64ffda;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Cache configuration
const CACHE_CONFIG = {
  KEY: 'topAssetsCache',
  TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
};

interface CacheData {
  timestamp: number;
  data: Asset[];
}

// Cache utilities
const getCache = (): CacheData | null => {
  try {
    const cached = localStorage.getItem(CACHE_CONFIG.KEY);
    if (!cached) return null;
    
    const parsedCache = JSON.parse(cached) as CacheData;
    const now = Date.now();
    
    // Check if cache is expired
    if (now - parsedCache.timestamp > CACHE_CONFIG.TTL) {
      localStorage.removeItem(CACHE_CONFIG.KEY);
      return null;
    }
    
    return parsedCache;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

const setCache = (data: Asset[]) => {
  try {
    const cacheData: CacheData = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_CONFIG.KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

const TopAssets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cryptocurrency data from CoinGecko
  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.COINGECKO}/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 3,
            page: 1,
            sparkline: false
          }
        }
      );

      return response.data.map((coin: any) => ({
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        marketCap: coin.market_cap,
        priceChange24h: coin.price_change_percentage_24h,
        type: 'crypto' as const
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  };

  // Fetch stock data using Financial Modeling Prep
  const fetchStockDataFMP = async () => {
    try {
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', '2222.SR'];
      const response = await axios.get(
        `${API_ENDPOINTS.FMP}/quote/${symbols.join(',')}`,
        {
          params: {
            apikey: API_KEYS.FMP
          }
        }
      );

      return response.data.map((stock: any) => ({
        name: stock.name,
        symbol: stock.symbol,
        marketCap: stock.marketCap,
        priceChange24h: stock.changesPercentage,
        type: 'stock' as const
      }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  };

  // Fetch stock data using Alpha Vantage
  const fetchStockDataAV = async (symbol: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.ALPHA_VANTAGE, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: API_KEYS.ALPHA_VANTAGE
        }
      });

      const quote = response.data['Global Quote'];
      return {
        name: symbol,
        symbol: symbol,
        marketCap: parseFloat(quote['05. price']) * parseFloat(quote['06. volume']),
        priceChange24h: parseFloat(quote['10. change percent'].replace('%', '')),
        type: 'stock' as const
      };
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return null;
    }
  };

  // Fetch commodity data (Gold & Silver) using Alpha Vantage
  const fetchCommodityData = async () => {
    try {
      const commodities = [
        { symbol: 'XAU', name: 'Gold' },
        { symbol: 'XAG', name: 'Silver' }
      ];

      const responses = await Promise.all(
        commodities.map(async (commodity) => {
          const response = await axios.get(API_ENDPOINTS.ALPHA_VANTAGE, {
            params: {
              function: 'CURRENCY_EXCHANGE_RATE',
              from_currency: commodity.symbol,
              to_currency: 'USD',
              apikey: API_KEYS.ALPHA_VANTAGE
            }
          });

          const data = response.data['Realtime Currency Exchange Rate'];
          return {
            name: commodity.name,
            symbol: commodity.symbol,
            marketCap: parseFloat(data['5. Exchange Rate']) * 1e12, // Approximate market cap
            priceChange24h: 0, // Alpha Vantage doesn't provide 24h change for commodities
            type: 'commodity' as const
          };
        })
      );

      return responses;
    } catch (error) {
      console.error('Error fetching commodity data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Check cache first
        const cachedData = getCache();
        if (cachedData) {
          setAssets(cachedData.data);
          setLoading(false);
          setError(null);
          return;
        }

        setLoading(true);

        // Fetch data from all sources
        const [cryptoAssets, stockAssets, commodityAssets] = await Promise.all([
          fetchCryptoData(),
          fetchStockDataFMP(), // or fetchStockDataAV() if using Alpha Vantage
          fetchCommodityData()
        ]);

        // Combine and sort all assets by market cap
        const allAssets = [...cryptoAssets, ...stockAssets, ...commodityAssets]
          .filter(asset => asset !== null)
          .sort((a, b) => b.marketCap - a.marketCap)
          .slice(0, 10);

        setAssets(allAssets);
        // Cache the fetched data
        setCache(allAssets);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch market data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAllData, CACHE_CONFIG.TTL);
    return () => clearInterval(interval);
  }, []);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    }
    return `$${(marketCap / 1e6).toFixed(1)}M`;
  };

  const formatPriceChange = (change: number | undefined) => {
    if (change === undefined) return null;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const splitIntoColumns = (items: Asset[]) => {
    const midpoint = Math.ceil(items.length / 2);
    return [items.slice(0, midpoint), items.slice(midpoint)];
  };

  const [leftColumn, rightColumn] = splitIntoColumns(assets);

  return (
    <Container>
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      <Title>Top Market Assets</Title>
      {error ? (
        <div style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</div>
      ) : (
        <AssetColumns>
          <AssetList>
            {leftColumn.map((asset, index) => (
              <AssetItem key={index}>
                <Rank>#{index + 1}</Rank>
                <AssetInfo>
                  <AssetName>{asset.name}</AssetName>
                  <AssetSymbol>
                    {asset.symbol}
                    {asset.priceChange24h !== undefined && (
                      <PriceChange isPositive={asset.priceChange24h >= 0}>
                        {formatPriceChange(asset.priceChange24h)}
                      </PriceChange>
                    )}
                  </AssetSymbol>
                </AssetInfo>
                <MarketCap>{formatMarketCap(asset.marketCap)}</MarketCap>
              </AssetItem>
            ))}
          </AssetList>
          <AssetList>
            {rightColumn.map((asset, index) => (
              <AssetItem key={index}>
                <Rank>#{index + 6}</Rank>
                <AssetInfo>
                  <AssetName>{asset.name}</AssetName>
                  <AssetSymbol>
                    {asset.symbol}
                    {asset.priceChange24h !== undefined && (
                      <PriceChange isPositive={asset.priceChange24h >= 0}>
                        {formatPriceChange(asset.priceChange24h)}
                      </PriceChange>
                    )}
                  </AssetSymbol>
                </AssetInfo>
                <MarketCap>{formatMarketCap(asset.marketCap)}</MarketCap>
              </AssetItem>
            ))}
          </AssetList>
        </AssetColumns>
      )}
    </Container>
  );
};

export default TopAssets;
