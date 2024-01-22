import { Connection, VersionedTransaction } from "@solana/web3.js";
import fetch from "cross-fetch";
import { Route, SwapResponse} from "./types";
import { Wallet } from "@project-serum/anchor";

/**
 * Get quote for the swap
 * @param {string} addressOfTokenOut The token that we are selling
 * @param {string} addressOfTokenIn The token that we are buying
 * @param {number} convertedAmountOfTokenOut The amount of tokens that we are selling
 * @param {number} slippage
 * @returns Promise<QuoteResponse>
 */
export const getQuote = async (
  addressOfTokenOut: string,
  addressOfTokenIn: string,
  convertedAmountOfTokenOut: number,
  slippage: number
) => {
  slippage *= 100;
  const resp = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${addressOfTokenOut}\&outputMint=${addressOfTokenIn}\&amount=${convertedAmountOfTokenOut}\&slippageBps=${slippage}`
  );
  const quoteResponse: Route = await resp.json();
  return quoteResponse;
};

/**
 * Get serialized transactions for the swap
 * @returns {Promise<string>} swapTransaction
 */
export const getSwapTransaction = async (quoteResponse: Route, walletPublicKey: string): Promise<string> => {
  try {
    const resp = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: walletPublicKey,
        wrapAndUnwrapSol: true,
        restrictIntermediateTokens: false,
        prioritizationFeeLamports: "auto",
        dynamicComputeUnitLimit: true,
        autoMultiplier: 2,
      }),
    });
    const swapResponse: SwapResponse = await resp.json();
    return swapResponse.swapTransaction;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const convertToInteger = (amount:number, decimals:number) => {
  return Math.floor(amount * 10 ** decimals);
};

/**
 * @param {*} swapTransaction
 * @param {*} wallet
 * @param {*} connection
 * @returns Promise<string> txid
 */
export const finalizeTransaction = async (
  swapTransaction: string,
  wallet: Wallet,
  connection: Connection
): Promise<string> => {
  try {
    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    let transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // sign the transaction
    transaction.sign([wallet.payer]);

    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 3,
    });
    await connection.confirmTransaction(txid);
    return txid;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const withRetries = async (
  func: () => Promise<any>,
  maxRetries = 3,
  delayBetweenRetries = 1000
) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await func();
      console.log(
        `${func.name} successful after ${
          retries + 1
        } attempts with TxId: ${result}`
      );
      return result;
    } catch (error) {
      console.error(
        `Error during ${func.name} attempt ${retries + 1}: ${error}`
      );
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
      retries++;
    }
  }

  throw new Error(`${func.name} failed after ${maxRetries} attempts`);
};

/**
 * Create connection to Solana RPC endpoint
 * @returns {Connection} connection
 */
export const createConnection = (RPC_ENDPOINT: string) => {
  try {
    const connection = new Connection(RPC_ENDPOINT);
    return connection;
  } catch (error: any) {
    throw new Error(error);
  }
};
