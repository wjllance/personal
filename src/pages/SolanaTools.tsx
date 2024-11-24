import React, { useState } from "react";
import styled from "styled-components";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  ParsedTransactionWithMeta,
  VersionedTransactionResponse,
  Message,
} from "@solana/web3.js";
import { motion } from "framer-motion";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Section = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

const Button = styled(motion.button)`
  background: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 0.5rem;
  width: 100%;

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #45a049;
  }
`;

const Result = styled.div<{ error?: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  background: ${(props) => (props.error ? "#fff5f5" : "#f0fff4")};
  border-radius: 6px;
  border: 1px solid ${(props) => (props.error ? "#feb2b2" : "#9ae6b4")};
  color: ${(props) => (props.error ? "#c53030" : "#2f855a")};
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const NetworkSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 14px;
`;

const TransactionList = styled.div`
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
`;

const TransactionItem = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #64ffda;
`;

const TransactionDetails = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(100, 255, 218, 0.1);
  border-top: 2px solid #64ffda;
  border-radius: 50%;
  margin: 1rem auto;
`;

const SolanaTools: React.FC = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [network, setNetwork] = useState("mainnet-beta");
  const [loading, setLoading] = useState(false);

  const [blockNumber, setBlockNumber] = useState("");
  const [transactions, setTransactions] = useState<
    Omit<VersionedTransactionResponse, "slot">[]
  >([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState("");

  const getConnection = () => {
    return new Connection(
      "https://rpc.shyft.to?api_key=BzmzT6WLtxVaRDLq",
      "confirmed"
    );
  };

  const getBalance = async () => {
    try {
      setError("");
      setLoading(true);
      const connection = getConnection();
      const pubKey = new PublicKey(address);
      const balance = await connection.getBalance(pubKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (err) {
      setError("Invalid address or network error");
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const validateAddress = (address: string) => {
    try {
      if (!address) return false;
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const getRaydiumTransactions = async () => {
    try {
      setTransactionError("");
      setTransactionLoading(true);
      setTransactions([]);

      const connection = getConnection();
      const block = await connection.getBlock(parseInt(blockNumber), {
        maxSupportedTransactionVersion: 0,
        rewards: false,
      });

      if (!block) {
        throw new Error("Block not found");
      }

      const raydiumTransactions = block.transactions.filter((tx) => {
        const programIds = (tx.transaction.message as Message).accountKeys?.map(
          (key) => key.toString()
        );
        return programIds?.some((id) =>
          [
            "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
            "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
            "9HzJyW1qZsEiSfMUf6L2jo3CcTKAyBmSyKdwQeYisHrC",
          ].includes(id)
        );
      });

      setTransactions(raydiumTransactions);
    } catch (err) {
      console.error(err);
      setTransactionError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  return (
    <Container>
      <Title>Solana Tools</Title>
      <Grid>
        <Section>
          <SectionTitle>SOL Balance Checker</SectionTitle>
          <Label>Network</Label>
          <NetworkSelect
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            <option value="mainnet-beta">Mainnet Beta</option>
            <option value="testnet">Testnet</option>
            <option value="devnet">Devnet</option>
          </NetworkSelect>

          <Label>Solana Address</Label>
          <Input
            type="text"
            placeholder="Enter Solana address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={getBalance}
            disabled={!validateAddress(address) || loading}
          >
            {loading ? "Checking..." : "Check Balance"}
          </Button>

          {error && <Result error>{error}</Result>}
          {balance !== null && (
            <Result>Balance: {balance.toFixed(4)} SOL</Result>
          )}
        </Section>

        <Section>
          <SectionTitle>Raydium Transaction Filter</SectionTitle>
          <Label>Block Number</Label>
          <Input
            type="number"
            placeholder="Enter block number"
            value={blockNumber}
            onChange={(e) => setBlockNumber(e.target.value)}
          />

          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={getRaydiumTransactions}
            disabled={!blockNumber || transactionLoading}
          >
            {transactionLoading ? "Searching..." : "Search Transactions"}
          </Button>

          {transactionError && <Result error>{transactionError}</Result>}

          {transactionLoading && (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}

          {transactions.length > 0 && (
            <TransactionList>
              {transactions.map((tx, index) => (
                <TransactionItem key={index}>
                  <TransactionHeader>
                    <span>
                      Signature: {tx.transaction.signatures[0].substring(0, 20)}
                      ...
                    </span>
                  </TransactionHeader>
                  <TransactionDetails>
                    <div>Program IDs:</div>
                    {(tx.transaction.message as Message).accountKeys?.map(
                      (key, i) => (
                        <div key={i}>{key.toString()}</div>
                      )
                    )}
                  </TransactionDetails>
                </TransactionItem>
              ))}
            </TransactionList>
          )}

          {!transactionLoading &&
            transactions.length === 0 &&
            blockNumber &&
            !transactionError && (
              <Result>No Raydium transactions found in this block</Result>
            )}
        </Section>

        <Section>
          <SectionTitle>Token Balance Checker</SectionTitle>
          <Label>Coming Soon</Label>
          <Result>This feature will be available in the next update</Result>
        </Section>

        <Section>
          <SectionTitle>NFT Viewer</SectionTitle>
          <Label>Coming Soon</Label>
          <Result>This feature will be available in the next update</Result>
        </Section>
      </Grid>
    </Container>
  );
};

export default SolanaTools;
