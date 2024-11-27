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
import {
  getConnection,
  RAYDIUM_PROGRAM_IDS,
  parseTokenTransfers,
  formatAddress,
  fetchRaydiumTransactions,
  fetchRaydiumTransactionsRange,
  RaydiumTransactionData,
  TokenTransfer,
} from "./utils";

const RaydiumTransactionFilter: React.FC = () => {
  const [blockNumber, setBlockNumber] = useState("");
  const [endBlockNumber, setEndBlockNumber] = useState("");
  const [transactions, setTransactions] = useState<RaydiumTransactionData[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRaydiumTransactions = async () => {
    setLoading(true);
    setError(null);
    setTransactions([]);

    try {
      let result;
      if (endBlockNumber) {
        const startBlock = parseInt(blockNumber);
        const endBlock = parseInt(endBlockNumber);

        if (endBlock < startBlock) {
          throw new Error("End block must be greater than or equal to start block");
        }

        if (endBlock - startBlock > 10) {
          throw new Error("Maximum block range is 10 blocks");
        }

        result = await fetchRaydiumTransactionsRange(startBlock, endBlock);
      } else {
        result = await fetchRaydiumTransactions(blockNumber);
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch transactions");
      }

      setTransactions(result.data);
      if (result.data.length === 0) {
        setError("No Raydium transactions found in this block range");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderTransferInfo = (transfers: TokenTransfer[]) => {
    if (transfers.length === 0) {
      return null;
    }

    // Group transfers by type (in/out)
    const inTransfer = transfers.filter(
      (t) => t.type === "in" && RAYDIUM_PROGRAM_IDS.includes(t.from)
    )[0];
    const outTransfer = transfers.filter(
      (t) => t.type === "out" && RAYDIUM_PROGRAM_IDS.includes(t.from)
    )[0];

    const swaps = // the transfer is for raydium, so swap the in / out transfers
      inTransfer && outTransfer
        ? [
            {
              in: outTransfer,
              out: inTransfer,
            },
          ]
        : [];

    const owner = transfers.filter(
      (t) => !RAYDIUM_PROGRAM_IDS.includes(t.from)
    )[0]?.from;

    return (
      <div style={{ marginTop: "8px" }}>
        {swaps.map((swap, index) => (
          <div
            key={index}
            style={{
              padding: "8px 12px",
              background: "rgba(76, 175, 80, 0.05)",
              borderRadius: "6px",
              border: "1px solid rgba(76, 175, 80, 0.2)",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#4A5568", fontWeight: "500" }}>Swap:</span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#e53e3e",
                }}
              >
                {swap.out.amount.toFixed(6)} {swap.out.token}
              </span>
              <span style={{ color: "#4A5568" }}>→</span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#38a169",
                }}
              >
                {swap.in.amount.toFixed(6)} {swap.in.token}
              </span>
              <div style={{ flex: "1" }} />

              {owner && (
                <>
                  by:
                  <a
                    href={`https://solscan.io/account/${owner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3B82F6",
                      textDecoration: "none",
                      fontFamily: "monospace",
                    }}
                  >
                    {formatAddress(owner)}
                  </a>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Section
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h2
        style={{
          color: "#111827",
          marginBottom: "24px",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        Raydium Transaction Filter
      </h2>

      <Label
        style={{
          color: "#4B5563",
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "8px",
        }}
      >
        Block Number
      </Label>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Input
          type="number"
          value={blockNumber}
          onChange={(e) => setBlockNumber(e.target.value)}
          placeholder="Enter block number"
          style={{
            width: endBlockNumber ? "120px" : "100%",
            padding: "10px",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />
        {endBlockNumber && <span>to</span>}
        <Input
          type="number"
          value={endBlockNumber}
          onChange={(e) => setEndBlockNumber(e.target.value)}
          placeholder="End block (optional)"
          style={{
            width: "120px",
            padding: "10px",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            fontSize: "14px",
            display: endBlockNumber ? "block" : "none",
          }}
        />
        <Button
          as={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setEndBlockNumber(endBlockNumber ? "" : blockNumber)}
          style={{
            background: "transparent",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            padding: "10px",
            fontSize: "12px",
            color: "#374151",
          }}
        >
          {endBlockNumber ? "Single Block" : "Block Range"}
        </Button>
      </div>

      <Button
        as={motion.button}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={getRaydiumTransactions}
        disabled={!blockNumber || loading}
        style={{
          background: "linear-gradient(45deg, #3B82F6, #2563EB)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          padding: "12px 24px",
          fontSize: "14px",
          fontWeight: "500",
          opacity: !blockNumber || loading ? 0.7 : 1,
          cursor: !blockNumber || loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <LoadingSpinner
            as={motion.div}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderTop: "2px solid #fff",
              borderRadius: "50%",
            }}
          />
        ) : (
          "Get Raydium Transactions"
        )}
      </Button>

      {error && (
        <Result
          error
          style={{
            background: "#FEF2F2",
            border: "1px solid #FCA5A5",
            borderRadius: "8px",
            color: "#DC2626",
            padding: "16px",
            marginTop: "16px",
            fontSize: "14px",
          }}
        >
          {error}
        </Result>
      )}

      {transactions.length > 0 && (
        <>
          <span
            style={{
              color: "#111827",
              fontWeight: "500",
              fontSize: "13px",
            }}
          >
            <span>length: {transactions.length} </span>
            {new Date(
              (transactions?.[0]?.transaction?.blockTime || 0) * 1000
            ).toLocaleString()}
          </span>
          <TransactionList style={{ marginTop: "24px" }}>
            {transactions.map((tx, index) => (
              <TransactionItem
                key={tx.transaction.transaction.signatures[0]}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                  marginBottom: "16px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    background: "#FFFFFF",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: tx.transaction.meta?.err
                            ? "#DC2626"
                            : "#059669",
                          boxShadow: tx.transaction.meta?.err
                            ? "0 0 6px rgba(220, 38, 38, 0.3)"
                            : "0 0 6px rgba(5, 150, 105, 0.3)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        color: "#6B7280",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Signature:
                      <a
                        href={`https://solscan.io/tx/${tx.transaction.transaction.signatures[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#3B82F6",
                          textDecoration: "none",
                          fontFamily: "monospace",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        {formatAddress(
                          tx.transaction.transaction.signatures[0]
                        )}
                      </a>
                    </div>
                  </div>

                  <div style={{ color: "#111827", fontSize: "13px" }}>
                    {renderTransferInfo(tx.transfers)}
                  </div>
                </div>
              </TransactionItem>
            ))}
          </TransactionList>
        </>
      )}
    </Section>
  );
};

export default RaydiumTransactionFilter;
