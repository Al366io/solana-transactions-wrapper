import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import fetch from "cross-fetch";
import { Route, SwapResponse } from "./types";
import { Wallet } from "@project-serum/anchor";

/**
 * Get quote for the swap
 * @param {string} addressOfTokenOut The token that we are selling
 * @param {string} addressOfTokenIn The token that we are buying
 * @param {number} convertedAmountOfTokenOut The amount of tokens that we are selling
 * @param {number} slippage The slippage percentage
 * @param {boolean} buy If true, it's a buy transaction
 * @returns Promise<QuoteResponse>
 */
export const getQuote = async (
  addressOfTokenOut: string,
  addressOfTokenIn: string,
  convertedAmountOfTokenOut: number,
  slippage: number
) => {
  slippage *= 100;
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=${addressOfTokenOut}\&outputMint=${addressOfTokenIn}\&amount=${convertedAmountOfTokenOut}\&slippageBps=${slippage}`;
  const resp = await fetch(url);
  const quoteResponse: Route = await resp.json();
  return quoteResponse;
};

/**
 * Get serialized transactions for the swap
 * @returns {Promise<string>} swapTransaction
 */
export const getSwapTransaction = async (
  quoteResponse: Route,
  walletPublicKey: string,
  buy: boolean,
  addr_mint: string = ""
): Promise<string> => {
  try {
    let body: any;
    body = {
      quoteResponse,
      userPublicKey: walletPublicKey,
      wrapAndUnwrapSol: true,
      restrictIntermediateTokens: false,
      prioritizationFeeLamports: "auto",
      autoMultiplier: 2,
    };
    const resp = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const swapResponse: SwapResponse = await resp.json();
    return swapResponse.swapTransaction;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const convertToInteger = (amount: number, decimals: number) => {
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
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });
    console.log(`Transaction sent with txid: ${txid}`);
    return txid;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Create connection to Solana RPC endpoint
 * @returns {Connection} connection
 */
export const createConnection = (RPC_ENDPOINT: string): Connection => {
  try {
    const connection = new Connection(RPC_ENDPOINT);
    return connection;
  } catch (error: any) {
    throw new Error(error);
  }
};
