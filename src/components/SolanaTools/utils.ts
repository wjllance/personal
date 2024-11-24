import {
  Connection,
  Message,
  VersionedTransactionResponse,
} from "@solana/web3.js";

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

// Common token addresses
export const TOKEN_ADDRESSES: { [key: string]: string } = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "USDC",
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: "USDT",
  So11111111111111111111111111111111111111112: "SOL",
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: "BONK",
  "7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx": "GMT",
  AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB: "GST",
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: "mSOL",
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": "RAY",
};

interface TokenTransfer {
  from: string;
  to: string;
  amount: number;
  token: string;
  mint: string;
  type: "in" | "out";
}

interface TokenBalance {
  accountIndex: number;
  mint: string;
  amount: number;
  address: string;
}

export const parseTokenTransfers = (
  transaction: VersionedTransactionResponse
): TokenTransfer[] => {
  // check if transaction error
  if (transaction.meta?.err) {
    console.log("Transaction error:", transaction.meta.err);
    return [];
  }

  console.log("parseTokenTransfers:", transaction);
  const transfers: TokenTransfer[] = [];
  const message = transaction.transaction.message as Message;
  const postTokenBalances = transaction.meta?.postTokenBalances || [];
  const preTokenBalances = transaction.meta?.preTokenBalances || [];

  // Get the transaction initiator (first signer)
  const initiator = message.accountKeys[0].toString();

  console.log("Transaction initiator:", initiator);
  console.log("Pre balances:", preTokenBalances);
  console.log("Post balances:", postTokenBalances);

  // Create maps of pre and post balances by account and mint
  const preBalanceMap = new Map<string, (typeof preTokenBalances)[0]>();
  const postBalanceMap = new Map<string, (typeof postTokenBalances)[0]>();

  preTokenBalances.forEach((balance) => {
    const key = `${balance.accountIndex}-${balance.mint}`;
    preBalanceMap.set(key, balance);
  });

  postTokenBalances.forEach((balance) => {
    const key = `${balance.accountIndex}-${balance.mint}`;
    postBalanceMap.set(key, balance);
  });

  // Process all accounts that appear in either pre or post balances
  const processedAccounts = new Set<string>();

  // Process pre balances first
  preTokenBalances.forEach((pre) => {
    const key = `${pre.accountIndex}-${pre.mint}`;
    processedAccounts.add(key);

    const post = postBalanceMap.get(key);
    if (post) {
      const preAmount = pre.uiTokenAmount.uiAmount || 0;
      const postAmount = post.uiTokenAmount.uiAmount || 0;
      const change = postAmount - preAmount;

      if (Math.abs(change) > 0.000001) {
        // Filter out dust
        const address = pre.owner;

        // console.log("Found change", change, pre, post);

        const tokenSymbol =
          TOKEN_ADDRESSES[pre.mint] || pre.mint.slice(0, 8) + "...";

        // Only record if the initiator is involved
        if (address === initiator) {
          transfers.push({
            from: address,
            to: address,
            amount: Math.abs(change),
            token: tokenSymbol,
            mint: pre.mint,
            type: change > 0 ? "in" : "out",
          });

          console.log("Found transfer:", {
            address,
            change,
            token: tokenSymbol,
            type: change > 0 ? "in" : "out",
          });
        }
      }
    }
  });

  // Process new appearances in post balances
  postTokenBalances.forEach((post) => {
    const key = `${post.accountIndex}-${post.mint}`;
    if (!processedAccounts.has(key)) {
      const amount = post.uiTokenAmount.uiAmount || 0;
      if (amount > 0) {
        const address = post.owner;
        const tokenSymbol =
          TOKEN_ADDRESSES[post.mint] || post.mint.slice(0, 8) + "...";

        // Only record if the initiator is involved
        if (address === initiator) {
          transfers.push({
            from: "new",
            to: address,
            amount,
            token: tokenSymbol,
            mint: post.mint,
            type: "in",
          });

          console.log("Found new balance:", {
            address,
            amount,
            token: tokenSymbol,
          });
        }
      }
    }
  });

  const postBalances = transaction.meta?.postBalances || [];
  const preBalances = transaction.meta?.preBalances || [];

  const balance = postBalances[0];
  const preBalance = preBalances[0];
  const fee = transaction.meta?.fee || 0;

  const change = (fee + balance - preBalance) / 1e9;
  if (Math.abs(change) > 0.000001) {
    transfers.push({
      from: initiator,
      to: initiator,
      amount: change,
      token: "SOL",
      mint: "11111111111111111111111111111111",
      type: change > 0 ? "in" : "out",
    });
  }

  console.log("Final transfers:", transfers);
  return transfers;
};

export const formatAddress = (address: string): string => {
  if (address === "new") return "new";
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
};
