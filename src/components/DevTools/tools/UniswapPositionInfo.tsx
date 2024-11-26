import React, { useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { UNISWAP_V3_POSITIONS_ABI } from "@/constants/abis";
import { UNISWAP_V3_POSITIONS_ADDRESS } from "@/constants/addresses";
import { Input, Button, Card } from "@/components/DevTools/styles";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ResultCard = styled(Card)`
  padding: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: #64ffda;
`;

const Value = styled.span`
  color: #fff;
  word-break: break-all;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  margin-top: 10px;
`;

const UniswapPositionInfo: React.FC = () => {
  const [positionId, setPositionId] = useState("");
  const [positionInfo, setPositionInfo] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPositionInfo = async () => {
    setError("");
    setPositionInfo(null);
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

      setPositionInfo(formattedPosition);
    } catch (err: any) {
      setError(err.message || "Failed to fetch position information");
    } finally {
      setLoading(false);
    }
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

      {positionInfo && (
        <ResultCard>
          {Object.entries(positionInfo).map(([key, value]) => (
            <InfoRow key={key}>
              <Label>{key}:</Label>
              <Value>{value as string}</Value>
            </InfoRow>
          ))}
        </ResultCard>
      )}
    </Container>
  );
};

export default UniswapPositionInfo;
