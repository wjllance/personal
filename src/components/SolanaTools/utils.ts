import { Connection } from "@solana/web3.js";

export const getConnection = () => {
  return new Connection(
    "https://rpc.shyft.to?api_key=BzmzT6WLtxVaRDLq",
    "confirmed"
  );
};

export const RAYDIUM_PROGRAM_IDS = [
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8", // Raydium Liquidity Pool v4
  "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1", // Raydium Liquidity Pool v3
  "9HzJyW1qZsEiSfMUf6L2jo3CcTKAyBmSyKdwQeYisHrC", // Raydium AMM
];
