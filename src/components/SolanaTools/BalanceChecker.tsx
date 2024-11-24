import React, { useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { motion } from "framer-motion";
import {
  Section,
  Result,
  NetworkSelect,
  Label,
  Input,
  Button,
  LoadingSpinner,
} from "./styles";

const BalanceChecker: React.FC = () => {
  const [network, setNetwork] = useState("mainnet-beta");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkBalance = async () => {
    setLoading(true);
    setError(null);
    setBalance(null);

    try {
      const connection = new Connection(clusterApiUrl(network as any));
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (err: any) {
      setError(err.message);
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

      <Label>Wallet Address</Label>
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Solana wallet address"
      />

      <Button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={checkBalance}
        disabled={!address || loading}
      >
        {loading ? <LoadingSpinner animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} /> : "Check Balance"}
      </Button>

      {balance !== null && (
        <Result>Balance: {balance.toFixed(4)} SOL</Result>
      )}
      {error && <Result error>{error}</Result>}
    </Section>
  );
};

export default BalanceChecker;
