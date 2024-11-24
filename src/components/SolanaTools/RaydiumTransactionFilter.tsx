import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  ParsedTransactionWithMeta,
  Message,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import { motion } from "framer-motion";
import {
  Section,
  Result,
  NetworkSelect,
  Label,
  Input,
  Button,
  LoadingSpinner,
  TransactionList,
  TransactionItem,
  TransactionHeader,
  TransactionDetails,
} from "./styles";
import { getConnection, RAYDIUM_PROGRAM_IDS } from "./utils";

const RaydiumTransactionFilter: React.FC = () => {
  const [network, setNetwork] = useState("mainnet-beta");
  const [blockNumber, setBlockNumber] = useState("");
  const [transactions, setTransactions] = useState<
    Omit<VersionedTransactionResponse, "slot">[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRaydiumTransactions = async () => {
    try {
      setError(null);
      setLoading(true);
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
        return programIds?.some((id) => RAYDIUM_PROGRAM_IDS.includes(id));
      });

      setTransactions(raydiumTransactions);
      if (raydiumTransactions.length === 0) {
        setError("No Raydium transactions found in this block");
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <Label>Network</Label>
      <NetworkSelect
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
      >
        <option value="mainnet-beta">Mainnet Beta</option>
        <option value="devnet">Devnet</option>
        <option value="testnet">Testnet</option>
      </NetworkSelect>

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
        disabled={!blockNumber || loading}
      >
        {loading ? (
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ) : (
          "Get Raydium Transactions"
        )}
      </Button>

      {error && <Result error>{error}</Result>}

      {transactions.length > 0 && (
        <TransactionList>
          {transactions.map((tx, index) => (
            <TransactionItem key={index}>
              <TransactionHeader>
                {/* <span>Slot: {tx.slot}</span> */}
                <span>
                  {new Date((tx.blockTime || 0) * 1000).toLocaleString()}
                </span>
              </TransactionHeader>
              <TransactionDetails>
                <div>Signature: {tx.transaction.signatures[0]}</div>
                <div>Program IDs:</div>
                {(tx.transaction.message as Message).accountKeys.map(
                  (key, i) => (
                    <div key={i}>{key.toString()}</div>
                  )
                )}
              </TransactionDetails>
            </TransactionItem>
          ))}
        </TransactionList>
      )}
    </Section>
  );
};

export default RaydiumTransactionFilter;
