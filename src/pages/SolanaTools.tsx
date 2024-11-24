import React, { useState } from "react";
import {
  Container,
  Title,
  ToolsContainer,
  TabList,
  TabButton,
  ToolContent,
} from "../components/SolanaTools/styles";
import {
  BalanceChecker,
  RaydiumTransactionFilter,
} from "../components/SolanaTools";

const SolanaTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"balance" | "transactions">(
    "transactions"
  );

  return (
    <Container>
      <Title>Solana Tools</Title>
      <ToolsContainer>
        <TabList>
          <TabButton
            active={activeTab === "transactions"}
            onClick={() => setActiveTab("transactions")}
          >
            Raydium Transaction Filter
          </TabButton>
          <TabButton
            active={activeTab === "balance"}
            onClick={() => setActiveTab("balance")}
          >
            SOL Balance Checker
          </TabButton>
        </TabList>
        <ToolContent>
          {activeTab === "balance" ? (
            <BalanceChecker />
          ) : (
            <RaydiumTransactionFilter />
          )}
        </ToolContent>
      </ToolsContainer>
    </Container>
  );
};

export default SolanaTools;
