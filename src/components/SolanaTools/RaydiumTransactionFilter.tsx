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
  const [network, setNetwork] = useState("mainnet-beta");
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
          const programIds = (
            tx.transaction.message as Message
          ).accountKeys?.map((key) => key.toString());
          return programIds?.some((id) => RAYDIUM_PROGRAM_IDS.includes(id));
        })
        .map((tx) => {
          return {
            ...tx,
            slot: block.parentSlot,
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
                <span>
                  {new Date((tx.blockTime || 0) * 1000).toLocaleString()}
                </span>
              </TransactionHeader>
              <TransactionDetails>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Transaction: </strong>
                  <a
                    href={`https://solscan.io/tx/${tx.transaction.signatures[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#4caf50", textDecoration: "none" }}
                  >
                    {formatAddress(tx.transaction.signatures[0])}
                  </a>
                </div>
                <strong>Signer: </strong>
                <a
                  href={`https://solscan.io/account/${(
                    tx.transaction.message as Message
                  ).accountKeys[0].toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4caf50", textDecoration: "none" }}
                >
                  {formatAddress(
                    (
                      tx.transaction.message as Message
                    ).accountKeys[0].toString()
                  )}
                </a>
                {renderTransferInfo(tx)}
              </TransactionDetails>
            </TransactionItem>
          ))}
        </TransactionList>
      )}
    </Section>
  );
};

export default RaydiumTransactionFilter;
