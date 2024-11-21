import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// API Configuration
const API_KEYS = {
  ALPHA_VANTAGE: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'your_alpha_vantage_key',
  FMP: process.env.REACT_APP_FMP_API_KEY || 'your_fmp_key',
  METAL_PRICE: process.env.REACT_APP_METAL_PRICE_API_KEY || 'your_metal_price_key'
};

const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  FMP: 'https://financialmodelingprep.com/api/v3',
  METAL_PRICE: 'https://api.metalpriceapi.com/v1'
};

interface Asset {
  name: string;
  marketCap: number;
  symbol: string;
  price: number;
  priceChange24h: number;
  type: 'crypto' | 'stock' | 'commodity';
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

      return response.data
        .map((coin: any) => {
          if (!coin.market_cap || !coin.price_change_percentage_24h) {
            console.error(`Missing required data for coin ${coin.name}`);
            return null;
          }

          return {
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            marketCap: coin.market_cap,
            priceChange24h: coin.price_change_percentage_24h,
            type: 'crypto' as const,
            price: coin.current_price
          };
        })
        .filter((coin: Asset | null): coin is Asset => coin !== null);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  };

  // Type guard function to check if response is a stock Asset
  const isStockAsset = (response: any): response is Asset => {
    return response !== null &&
           typeof response.name === 'string' &&
           typeof response.symbol === 'string' &&
           typeof response.marketCap === 'number' &&
           typeof response.priceChange24h === 'number' &&
           response.type === 'stock';
  };

  // Fetch stock data using FMP API
  const fetchStockData = async () => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'META','TSM', '2222.SR'];
    try {
      const response = await axios.get(`${API_ENDPOINTS.FMP}/quote/${symbols.join(',')}`, {
        params: {
          apikey: API_KEYS.FMP
        }
      });

      if (!response.data || response.data.length === 0) {
        console.error('No stock data returned');
        return [];
      }

      const stockData = response.data.map((quote: any) => ({
        name: quote.name,
        symbol: quote.symbol,
        price: quote.price,
        marketCap: quote.marketCap,
        priceChange24h: quote.changesPercentage,
        type: 'stock'
      }));

      return stockData.filter(isStockAsset);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  };


  // Fetch commodity data using Metal Price API
  const fetchCommodityData = async () => {
    try {
      // Constants for market cap calculation
      const GOLD_SUPPLY_TONS = 205238; // metric tons
      const SILVER_SUPPLY_TONS = 1850000; // metric tons
      const METRIC_TON_TO_OUNCES = 35274; // 1 metric ton = 35,274 ounces

      // Get yesterday's date for price change
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 2);

      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      // Calculate market cap using actual supply data
      const calculateMarketCap = (price: number, supplyTons: number) => {
        const supplyOunces = supplyTons * METRIC_TON_TO_OUNCES;
        console.log(`Price per ounce: $${price.toFixed(2)}`);
        console.log(`Total supply in ounces: ${supplyOunces.toLocaleString()}`);
        const marketCap = price * supplyOunces;
        console.log(`Market Cap: $${marketCap.toLocaleString()}`);
        return marketCap;
      };

      // Fetch current prices and price changes
      const [goldPrice, silverPrice, yesterdayGold, yesterdaySilver] = await Promise.all([
        axios.get(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
          params: {
            api_key: API_KEYS.METAL_PRICE,
            currencies: 'XAU'
          }
        }),
        axios.get(`${API_ENDPOINTS.METAL_PRICE}/latest`, {
          params: {
            api_key: API_KEYS.METAL_PRICE,
            currencies: 'XAG'
          }
        }),
        axios.get(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
          params: {
            api_key: API_KEYS.METAL_PRICE,
            currencies: 'XAU',

          }
        }),
        axios.get(`${API_ENDPOINTS.METAL_PRICE}/${formatDate(yesterday)}`, {
          params: {
            api_key: API_KEYS.METAL_PRICE,
            currencies: 'XAG',
          }
        })
      ]);

      const calculatePriceChange = (currentPrice: number, previousPrice: number) => {
        const change = ((currentPrice - previousPrice) / previousPrice) * 100;
        return change;
      };

      const commodityData = [
        {
          name: 'Gold',
          symbol: 'XAU/USD',
          price: goldPrice.data.rates.USDXAU,
          marketCap: calculateMarketCap(goldPrice.data.rates.USDXAU, GOLD_SUPPLY_TONS),
          priceChange24h: calculatePriceChange(goldPrice.data.rates.USDXAU, yesterdayGold.data.rates.USDXAU),
          type: 'commodity' as const
        },
        {
          name: 'Silver',
          symbol: 'XAG/USD',
          price: silverPrice.data.rates.USDXAG,
          marketCap: calculateMarketCap(silverPrice.data.rates.USDXAG, SILVER_SUPPLY_TONS),
          priceChange24h: calculatePriceChange(silverPrice.data.rates.USDXAG, yesterdaySilver.data.rates.USDXAG),
          type: 'commodity' as const
        }
      ];

      return commodityData
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

        console.log("cachedData", cachedData)
        if (cachedData) {
          setAssets(cachedData.data);
          setLoading(false);
          setError(null);
          return;
        }

        setLoading(true);

        // Fetch data from all sources
        const [stockAssets, commodityAssets, cryptoAssets] = await Promise.all([
          fetchStockData(),
          fetchCommodityData(),
          fetchCryptoData()
        ]);

        // Combine and sort all assets by market cap
        const allAssets = [...stockAssets, ...commodityAssets, ...cryptoAssets]
          .filter(asset => asset !== null)
          .sort((a, b) => b.marketCap - a.marketCap)
          .slice(0, 10);

        console.log("allAssets", allAssets)

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
      return `$${(marketCap / 1e12).toFixed(3)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(3)}B`;
    }
    return `$${(marketCap / 1e6).toFixed(3)}M`;
  };

  const formatPrice = (price: number) => {
    if(!price) return '-';
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPriceChange = (change: number) => {
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
                    <PriceChange isPositive={asset.priceChange24h >= 0}>
                      {formatPriceChange(asset.priceChange24h)}
                    </PriceChange>
                  </AssetSymbol>
                </AssetInfo>
                <AssetInfo>
                  <AssetName>{formatPrice(asset.price)}</AssetName>
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
                    <PriceChange isPositive={asset.priceChange24h >= 0}>
                      {formatPriceChange(asset.priceChange24h)}
                    </PriceChange>
                  </AssetSymbol>
                </AssetInfo>
                <AssetInfo>
                  <AssetName>{formatPrice(asset.price)}</AssetName>
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
