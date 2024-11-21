import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Asset {
  name: string;
  marketCap: number;
  symbol: string;
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

const TopAssets: React.FC = () => {
  const [assets] = useState<Asset[]>([
    { name: "Gold", marketCap: 13.557e12, symbol: "XAU" },
    { name: "Apple Inc.", marketCap: 2.533e12, symbol: "AAPL" },
    { name: "Microsoft", marketCap: 2.11e12, symbol: "MSFT" },
    { name: "Saudi Aramco", marketCap: 1.926e12, symbol: "2222.SR" },
    { name: "Silver", marketCap: 1.456e12, symbol: "XAG" },
    { name: "Alphabet", marketCap: 1.343e12, symbol: "GOOGL" },
    { name: "Amazon", marketCap: 1.002e12, symbol: "AMZN" },
    { name: "Berkshire", marketCap: 693.72e9, symbol: "BRK.A" },
    { name: "NVIDIA", marketCap: 654.42e9, symbol: "NVDA" },
    { name: "Bitcoin", marketCap: 586.44e9, symbol: "BTC" }
  ]);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    }
    return `$${(marketCap / 1e6).toFixed(1)}M`;
  };

  const splitIntoColumns = (items: Asset[]) => {
    const midpoint = Math.ceil(items.length / 2);
    return [items.slice(0, midpoint), items.slice(midpoint)];
  };

  const [leftColumn, rightColumn] = splitIntoColumns(assets);

  return (
    <Container>
      <Title>Top Market Assets</Title>
      <AssetColumns>
        <AssetList>
          {leftColumn.map((asset, index) => (
            <AssetItem key={index}>
              <Rank>#{index + 1}</Rank>
              <AssetInfo>
                <AssetName>{asset.name}</AssetName>
                <AssetSymbol>{asset.symbol}</AssetSymbol>
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
                <AssetSymbol>{asset.symbol}</AssetSymbol>
              </AssetInfo>
              <MarketCap>{formatMarketCap(asset.marketCap)}</MarketCap>
            </AssetItem>
          ))}
        </AssetList>
      </AssetColumns>
    </Container>
  );
};

export default TopAssets;
