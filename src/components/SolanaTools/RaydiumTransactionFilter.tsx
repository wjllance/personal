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
} from "./utils";

const RaydiumTransactionFilter: React.FC = () => {
  const [blockNumber, setBlockNumber] = useState("");
  const [transactions, setTransactions] = useState<
    VersionedTransactionResponse[]
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

      const raydiumTransactions = block.transactions
        .filter((tx) => {
          const programIds = tx.transaction.message.staticAccountKeys?.map(
            (key) => key.toString()
          );
          return programIds?.some((id) => RAYDIUM_PROGRAM_IDS.includes(id));
        })
        .map((tx) => {
          return {
            ...tx,
            slot: block.parentSlot,
            blockTime: block.blockTime,
          } as VersionedTransactionResponse;
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

  const renderTransferInfo = (tx: VersionedTransactionResponse) => {
    const transfers = parseTokenTransfers(tx);
    if (transfers.length === 0) {
      return (
        <div
          style={{
            color: "#718096",
            fontStyle: "italic",
            padding: "12px",
            background: "rgba(160, 174, 192, 0.1)",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          No token transfers found in this transaction
        </div>
      );
    }

    console.log("transfers", transfers);

    // Group transfers by type (in/out)
    const inTransfer = transfers.filter((t) => t.type === "in")[0];
    const outTransfer = transfers.filter((t) => t.type === "out")[0];

    // Only consider the most simple case of a single in/out transfer
    const swaps =
      inTransfer && outTransfer
        ? [
            {
              in: inTransfer,
              out: outTransfer,
            },
          ]
        : [];

    return (
      <div style={{ marginTop: "8px" }}>
        {swaps.map((swap, index) => (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              padding: "12px",
              background: "rgba(76, 175, 80, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(76, 175, 80, 0.2)",
            }}
          >
            <div
              style={{
                fontWeight: "600",
                marginBottom: "8px",
                color: "#2D3748",
              }}
            >
              Token Swap
            </div>
            <div
              style={{
                color: "#e53e3e",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Sent:</span>
              <span style={{ fontWeight: "500" }}>
                {swap.out.amount.toFixed(6)} {swap.out.token}
              </span>
            </div>
            <div
              style={{
                color: "#38a169",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Received:</span>
              <span style={{ fontWeight: "500" }}>
                {swap.in.amount.toFixed(6)} {swap.in.token}
              </span>
            </div>
            {/* <div
              style={{
                fontSize: "13px",
                color: "#718096",
                marginTop: "8px",
              }}
            >
              Rate: 1 {swap.out.token} ={" "}
              {(swap.in.amount / swap.out.amount).toFixed(6)} {swap.in.token}
            </div> */}
          </div>
        ))}

        {/* Show remaining transfers that weren't part of swaps */}
        {transfers
          .filter((t) => !swaps.some((s) => s.in === t || s.out === t))
          .map((transfer, index) => (
            <div
              key={`transfer-${index}`}
              style={{
                marginBottom: "8px",
                padding: "12px",
                background:
                  transfer.type === "in"
                    ? "rgba(56, 161, 105, 0.1)"
                    : "rgba(229, 62, 62, 0.1)",
                borderRadius: "8px",
                border: `1px solid ${
                  transfer.type === "in"
                    ? "rgba(56, 161, 105, 0.2)"
                    : "rgba(229, 62, 62, 0.2)"
                }`,
              }}
            >
              <div
                style={{
                  color: "#2D3748",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "4px",
                }}
              >
                <span>{transfer.type === "in" ? "Received" : "Sent"}</span>
                {transfer.from !== transfer.to && (
                  <>
                    <span>{transfer.type === "in" ? "from" : "to"}</span>
                    <span style={{ fontFamily: "monospace" }}>
                      {formatAddress(
                        transfer.type === "in" ? transfer.from : transfer.to
                      )}
                    </span>
                  </>
                )}
              </div>
              <div
                style={{
                  color: transfer.type === "in" ? "#38a169" : "#e53e3e",
                  fontWeight: "500",
                }}
              >
                {transfer.amount.toFixed(6)} {transfer.token}
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
      <Input
        type="number"
        placeholder="Enter block number"
        value={blockNumber}
        onChange={(e) => setBlockNumber(e.target.value)}
        style={{
          background: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          color: "#111827",
          padding: "10px",
          marginBottom: "16px",
          width: "100%",
          fontSize: "14px",
        }}
      />

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
        <TransactionList style={{ marginTop: "24px" }}>
          {transactions.map((tx, index) => (
            <TransactionItem
              key={tx.transaction.signatures[0]}
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
              <TransactionHeader
                style={{
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: tx.meta?.err ? "#DC2626" : "#059669",
                      boxShadow: tx.meta?.err
                        ? "0 0 8px rgba(220, 38, 38, 0.3)"
                        : "0 0 8px rgba(5, 150, 105, 0.3)",
                    }}
                  />
                  <span
                    style={{
                      color: "#111827",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {new Date((tx.blockTime || 0) * 1000).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#6B7280" }}>Signature: </span>
                  <a
                    href={`https://solscan.io/tx/${tx.transaction.signatures[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3B82F6",
                      textDecoration: "none",
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    {formatAddress(tx.transaction.signatures[0])}
                  </a>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "#F3F4F6",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    color: "#4B5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                  }}
                  onClick={() => {
                    const details = document.getElementById(
                      `tx-details-${tx.transaction.signatures[0]}`
                    );
                    if (details) {
                      details.style.display =
                        details.style.display === "none" ? "block" : "none";
                    }
                  }}
                >
                  <span style={{ fontSize: "16px" }}>↓</span>
                </motion.button>
              </TransactionHeader>
              <TransactionDetails
                id={`tx-details-${tx.transaction.signatures[0]}`}
                style={{
                  display: "none",
                  padding: "16px",
                  background: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "12px 16px",
                    fontSize: "14px",
                  }}
                >
                  <div style={{ color: "#6B7280" }}>Status:</div>
                  <div
                    style={{
                      color: tx.meta?.err ? "#DC2626" : "#059669",
                      fontWeight: "500",
                    }}
                  >
                    {tx.meta?.err ? "Failed" : "Success"}
                  </div>

                  <div style={{ color: "#6B7280" }}>Signer:</div>
                  <a
                    href={`https://solscan.io/account/${tx.transaction.message.staticAccountKeys[0].toString()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3B82F6",
                      textDecoration: "none",
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    {tx.transaction.message.staticAccountKeys[0].toString()}
                  </a>

                  {tx.meta?.fee && (
                    <>
                      <div style={{ color: "#6B7280" }}>Fee:</div>
                      <div style={{ color: "#111827" }}>
                        {(tx.meta.fee / 1e9).toFixed(6)} SOL
                      </div>
                    </>
                  )}
                </div>
                <div style={{ marginTop: "16px", color: "#111827" }}>
                  {renderTransferInfo(tx)}
                </div>
              </TransactionDetails>
            </TransactionItem>
          ))}
        </TransactionList>
      )}
    </Section>
  );
};

export default RaydiumTransactionFilter;
