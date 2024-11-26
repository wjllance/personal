import React, { useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { UNISWAP_V3_POSITIONS_ABI } from "@/constants/abis";
import { UNISWAP_V3_POSITIONS_ADDRESS } from "@/constants/addresses";
import { Input, Button, Card, ResultRow, ResultLabel, ResultValue } from "@/components/DevTools/styles";

// Theme colors from styles.tsx
const theme = {
  surface: '#2c2e33',
  surfaceLight: '#3a3d44',
  primary: '#6366f1',
  text: '#e4e6eb',
  textSecondary: '#9ca3af',
  border: '#4b5563',
  error: '#ef4444',
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const ResultCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled(ResultRow)`
  padding: 12px 0;
`;

const Label = styled(ResultLabel)`
  font-weight: 500;
`;

const Value = styled(ResultValue)`
  text-align: right;
  max-width: 60%;
`;

const LinkValue = styled(Value)`
  color: ${theme.primary};
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ExternalLink = styled.a`
  color: inherit;
  text-decoration: none;
`;

const ErrorMessage = styled.div`
  color: white;
  padding: 12px 16px;
  background: ${theme.error}22;
  border: 1px solid ${theme.error};
  border-radius: 8px;
  margin-top: 12px;
`;

const API_KEY = "09b7ae5edba23f469a588221393785ad";

const UniswapPositionInfo: React.FC = () => {
  const [positionId, setPositionId] = useState("");
  const [positionInfo, setPositionInfo] = useState<any>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [mintBlock, setMintBlock] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMintBlock = async (tokenId: string) => {
    const query = `
      query ($tokenId: String!) {
        position(id: $tokenId) {
          transaction {
            blockNumber
          }
        }
      }
    `;

    const response = await fetch(`https://gateway.thegraph.com/api/${API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          tokenId: tokenId.toLowerCase(),
        },
      }),
    });

    const data = await response.json();
    if (data.data?.position?.transaction?.blockNumber) {
      return parseInt(data.data.position.transaction.blockNumber);
    }
    return null;
  };

  const fetchPositionInfo = async () => {
    setError("");
    setPositionInfo(null);
    setOwner(null);
    setMintBlock(null);
    setLoading(true);

    try {
      const provider = new ethers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
      );

      const contract = new ethers.Contract(
        UNISWAP_V3_POSITIONS_ADDRESS,
        UNISWAP_V3_POSITIONS_ABI,
        provider
      );

      // Fetch position details
      const position = await contract.positions(positionId);
      const formattedPosition = {
        nonce: position.nonce.toString(),
        operator: position.operator,
        token0: position.token0,
        token1: position.token1,
        fee: position.fee.toString(),
        tickLower: position.tickLower.toString(),
        tickUpper: position.tickUpper.toString(),
        liquidity: position.liquidity.toString(),
        feeGrowthInside0LastX128: position.feeGrowthInside0LastX128.toString(),
        feeGrowthInside1LastX128: position.feeGrowthInside1LastX128.toString(),
        tokensOwed0: ethers.formatUnits(position.tokensOwed0, 18),
        tokensOwed1: ethers.formatUnits(position.tokensOwed1, 18),
      };

      // Fetch owner
      try {
        const currentOwner = await contract.ownerOf(positionId);
        console.log("Current owner:", currentOwner);
        setOwner(currentOwner);
      } catch (err) {
        console.warn("Failed to fetch owner:", err);
      }

      // Fetch mint block using subgraph
      try {
        const block = await fetchMintBlock(positionId);
        if (block) {
          console.log("Mint block:", block);
          setMintBlock(block);
        }
      } catch (err) {
        console.warn("Failed to fetch mint block:", err);
      }

      setPositionInfo(formattedPosition);
    } catch (err: any) {
      setError(err.message || "Failed to fetch position information");
    } finally {
      setLoading(false);
    }
  };

  const getEtherscanLink = (type: 'address' | 'block' | 'token', value: string) => {
    switch (type) {
      case 'address':
        return `https://etherscan.io/address/${value}`;
      case 'block':
        return `https://etherscan.io/block/${value}`;
      case 'token':
        return `https://app.uniswap.org/#/nfts/asset/${UNISWAP_V3_POSITIONS_ADDRESS}/${value}`;
      default:
        return '';
    }
  };

  const renderValue = (key: string, value: string) => {
    if (key === 'token0' || key === 'token1' || key === 'operator') {
      return (
        <ExternalLink href={getEtherscanLink('address', value)} target="_blank" rel="noopener noreferrer">
          <LinkValue>{value}</LinkValue>
        </ExternalLink>
      );
    }
    return <Value>{value}</Value>;
  };

  return (
    <Container>
      <div>
        <Input
          type="text"
          placeholder="Enter Position ID"
          value={positionId}
          onChange={(e) => setPositionId(e.target.value)}
        />
        <Button onClick={fetchPositionInfo} disabled={!positionId || loading}>
          {loading ? "Loading..." : "Fetch Position Info"}
        </Button>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {(positionInfo || owner || mintBlock) && (
        <ResultCard>
          {owner && (
            <InfoRow>
              <Label>Owner:</Label>
              <ExternalLink href={getEtherscanLink('address', owner)} target="_blank" rel="noopener noreferrer">
                <LinkValue>{owner}</LinkValue>
              </ExternalLink>
            </InfoRow>
          )}
          {mintBlock && (
            <InfoRow>
              <Label>Mint Block:</Label>
              <ExternalLink href={getEtherscanLink('block', mintBlock.toString())} target="_blank" rel="noopener noreferrer">
                <LinkValue>{mintBlock}</LinkValue>
              </ExternalLink>
            </InfoRow>
          )}
          {positionId && (
            <InfoRow>
              <Label>Position on Uniswap:</Label>
              <ExternalLink href={getEtherscanLink('token', positionId)} target="_blank" rel="noopener noreferrer">
                <LinkValue>View on Uniswap ↗</LinkValue>
              </ExternalLink>
            </InfoRow>
          )}
          {positionInfo && Object.entries(positionInfo).map(([key, value]) => (
            <InfoRow key={key}>
              <Label>{key}:</Label>
              {renderValue(key, value as string)}
            </InfoRow>
          ))}
        </ResultCard>
      )}
    </Container>
  );
};

export default UniswapPositionInfo;
