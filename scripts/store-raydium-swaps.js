const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const { fetchRaydiumTransactionsRange, RAYDIUM_PROGRAM_IDS } = require('./raydium-utils');

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, './docker/.env') });

async function createDatabaseConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "raydium_swaps",
  });
}

async function processSwapTransaction(transaction) {
  const transfers = transaction.transfers;
  if (!transfers || transfers.length === 0) return null;

  // Group transfers by type (in/out)
  const inTransfer = transfers.filter(
    (t) => t.type === "in" && RAYDIUM_PROGRAM_IDS.includes(t.from)
  )[0];
  const outTransfer = transfers.filter(
    (t) => t.type === "out" && RAYDIUM_PROGRAM_IDS.includes(t.from)
  )[0];

  if (!inTransfer || !outTransfer) return null;

  const owner = transfers.filter(
    (t) => !RAYDIUM_PROGRAM_IDS.includes(t.from)
  )[0]?.from;

  if (!owner) return null;

  return {
    signature: transaction.transaction.transaction.signatures[0],
    blockNumber: transaction.transaction.slot,
    blockTime: transaction.transaction.blockTime || 0,
    owner,
    inToken: {
      mint: outTransfer.mint,
      amount: outTransfer.amount,
    },
    outToken: {
      mint: inTransfer.mint,
      amount: inTransfer.amount,
    },
  };
}

async function storeSwaps(connection, swaps) {
  if (swaps.length === 0) return;

  const query = `
    INSERT IGNORE INTO raydium_swaps 
    (transaction_signature, block_number, block_time, owner_address, 
     in_token_mint, in_token_amount, out_token_mint, out_token_amount)
    VALUES ?
  `;

  const values = swaps.map((swap) => [
    swap.signature,
    swap.blockNumber,
    new Date(swap.blockTime * 1000),
    swap.owner,
    swap.inToken.mint,
    swap.inToken.amount,
    swap.outToken.mint,
    swap.outToken.amount,
  ]);

  try {
    await connection.query(query, [values]);
    console.log(`Successfully stored ${swaps.length} swaps`);
  } catch (error) {
    console.error("Error storing swaps:", error);
    throw error;
  }
}

async function main() {
  try {
    const startBlock = parseInt(process.argv[2]);
    const endBlock = parseInt(process.argv[3]);

    if (isNaN(startBlock) || isNaN(endBlock)) {
      console.error("Please provide start and end block numbers");
      process.exit(1);
    }

    if (endBlock < startBlock) {
      console.error("End block must be greater than or equal to start block");
      process.exit(1);
    }

    const connection = await createDatabaseConnection();
    console.log("Connected to database");

    try {
      const result = await fetchRaydiumTransactionsRange(startBlock, endBlock);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch transactions");
      }

      const swaps = await Promise.all(
        result.data.map((tx) => processSwapTransaction(tx))
      );

      const validSwaps = swaps.filter((swap) => swap !== null);
      console.log(`Found ${validSwaps.length} valid swaps`);

      await storeSwaps(connection, validSwaps);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { main, processSwapTransaction, storeSwaps, createDatabaseConnection };
