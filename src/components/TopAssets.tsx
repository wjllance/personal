import React, { useState } from 'react';
import styled from 'styled-components';

interface Asset {
  name: string;
  marketCap: number;
  description: string;
  symbol?: string;
}

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const AssetList = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
`;

const AssetItem = styled.div`
  display: grid;
  grid-template-columns: 50px 2fr 1fr;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Rank = styled.div`
  color: #64ffda;
  font-weight: bold;
`;

const AssetInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssetName = styled.div`
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 4px;
`;

const AssetDescription = styled.div`
  color: #8892b0;
  font-size: 0.9em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MarketCap = styled.div`
  color: #ffffff;
  font-weight: 500;
  text-align: right;
`;

const TopAssets: React.FC = () => {
  const [assets] = useState<Asset[]>([
    {
      name: "Gold",
      marketCap: 13.557e12,
      description: "A traditional safe-haven asset, gold is widely recognized for its value preservation and is often used as a hedge against inflation.",
      symbol: "XAU"
    },
    {
      name: "Apple Inc.",
      marketCap: 2.533e12,
      description: "A leading technology company known for its innovative products, including the iPhone, iPad, and Mac computers.",
      symbol: "AAPL"
    },
    {
      name: "Microsoft Corporation",
      marketCap: 2.11e12,
      description: "A global leader in software development, Microsoft is known for its Windows operating system and Office productivity suite.",
      symbol: "MSFT"
    },
    {
      name: "Saudi Aramco",
      marketCap: 1.926e12,
      description: "The state-owned oil company of Saudi Arabia, it is one of the largest and most valuable companies in the world.",
      symbol: "2222.SR"
    },
    {
      name: "Silver",
      marketCap: 1.456e12,
      description: "Another precious metal, silver is used in various industrial applications as well as jewelry and investment.",
      symbol: "XAG"
    },
    {
      name: "Alphabet Inc.",
      marketCap: 1.343e12,
      description: "The parent company of Google, Alphabet is a major player in online advertising, search engines, and cloud computing.",
      symbol: "GOOGL"
    },
    {
      name: "Amazon.com Inc.",
      marketCap: 1.002e12,
      description: "A leading e-commerce platform that has expanded into cloud computing, streaming services, and artificial intelligence.",
      symbol: "AMZN"
    },
    {
      name: "Berkshire Hathaway Inc.",
      marketCap: 693.72e9,
      description: "A multinational conglomerate holding company led by Warren Buffett, with diverse investments across various industries.",
      symbol: "BRK.A"
    },
    {
      name: "NVIDIA Corporation",
      marketCap: 654.42e9,
      description: "A technology company known for its graphics processing units (GPUs) and advancements in AI and gaming technology.",
      symbol: "NVDA"
    },
    {
      name: "Bitcoin",
      marketCap: 586.44e9,
      description: "The first decentralized cryptocurrency, Bitcoin has gained popularity as a digital asset and store of value.",
      symbol: "BTC"
    }
  ]);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(3)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  };

  return (
    <Container>
      <h2>Top 10 Assets by Market Capitalization</h2>
      <AssetList>
        {assets.map((asset, index) => (
          <AssetItem key={index}>
            <Rank>{index + 1}</Rank>
            <AssetInfo>
              <AssetName>{asset.name}</AssetName>
              <AssetDescription>{asset.description}</AssetDescription>
            </AssetInfo>
            <MarketCap>{formatMarketCap(asset.marketCap)}</MarketCap>
          </AssetItem>
        ))}
      </AssetList>
    </Container>
  );
};

export default TopAssets;
