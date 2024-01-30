import { Connection, Keypair } from "@solana/web3.js";
import { buyToken } from "./buy-helper";
import { createConnection, withRetries } from "./swapper-helper";
import { Wallet } from "@project-serum/anchor";
import bs58 from "bs58";
import { sellToken } from "./sell-helper";
import { getAccountTokens, getBalanceOfToken } from "./walletInfo";
import { TokensObject } from "./types";

/**
 * Function to buy a token with SOL
 * @param RPC_ENDPOINT Your RPC endpoint to connect to
 * @param WALLET_PRIVATE_KEY The private key of the wallet you want to buy from
 * @param ADDRESS_OF_TOKEN_TO_BUY The address of the token you want to buy
 * @param AMOUNT_OF_SOLANA_TO_SPEND The amount of SOL you want to spend
 * @param SLIPPAGE The slippage you want to use (default 1%)
 * @returns Promise<string> The txid
 */
export const buy_token = async (
  RPC_ENDPOINT: string,
  WALLET_PRIVATE_KEY: string,
  ADDRESS_OF_TOKEN_TO_BUY: string,
  AMOUNT_OF_SOLANA_TO_SPEND: number,
  SLIPPAGE: number = 1
): Promise<string> => {
  try {
    const connection: Connection = createConnection(RPC_ENDPOINT);
    console.log("Connection established 🚀");
    const wallet = new Wallet(
      Keypair.fromSecretKey(bs58.decode(WALLET_PRIVATE_KEY))
    );
    console.log("Wallet fetched ✅");
    console.log(`Trying to buy token using ${AMOUNT_OF_SOLANA_TO_SPEND} SOL with 3 retries and 60 seconds timeout...`);
    const buyTokenFunction = async () => {
      return await buyToken(
        ADDRESS_OF_TOKEN_TO_BUY,
        AMOUNT_OF_SOLANA_TO_SPEND,
        SLIPPAGE,
        connection,
        wallet
      );
    };
    const result = await withRetries(buyTokenFunction);
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Function to sell all of a token in your wallet for SOL
 * @param SELL_ALL Whether or not you want to sell all of the token in your wallet. If false, you need to specify AMOUNT_OF_TOKEN_TO_SELL
 * @param RPC_ENDPOINT Your RPC endpoint to connect to
 * @param WALLET_PRIVATE_KEY The private key of the wallet you want to sell from
 * @param ADDRESS_OF_TOKEN_TO_SELL The address of the token you want to sell
 * @param AMOUNT_OF_TOKEN_TO_SELL The amount of the token you want to sell (optional)
 * @param SLIPPAGE The slippage you want to use (default 1%)
 * @returns Promise<string> The txid
 */
export const sell_token = async (
  SELL_ALL: boolean = true,
  RPC_ENDPOINT: string,
  WALLET_PRIVATE_KEY: string,
  ADDRESS_OF_TOKEN_TO_SELL: string,
  AMOUNT_OF_TOKEN_TO_SELL: number | undefined = undefined,
  SLIPPAGE: number = 1,
): Promise<string> => {
  if (!SELL_ALL && !AMOUNT_OF_TOKEN_TO_SELL) {
    throw new Error("You need to specify AMOUNT_OF_TOKEN_TO_SELL if SELL_ALL is false");
  }
  const connection: Connection = createConnection(RPC_ENDPOINT);
  console.log("Connection established 🚀");
  const wallet = new Wallet(
    Keypair.fromSecretKey(bs58.decode(WALLET_PRIVATE_KEY))
  );
  console.log("Wallet fetched ✅");
  const amount = SELL_ALL ? "ALL" : AMOUNT_OF_TOKEN_TO_SELL;
  console.log(`Trying to sell ${amount} token with 3 retries and 60 seconds timeout...`);
  const sellTokenFunction = async () => {
    return await sellToken(
      SELL_ALL,
      ADDRESS_OF_TOKEN_TO_SELL,
      SLIPPAGE,
      connection,
      wallet,
      wallet.publicKey.toString(),
      AMOUNT_OF_TOKEN_TO_SELL,
    );
  };
  const result = await withRetries(sellTokenFunction);

  return result;
};

/**
 * Function to get all tokens in a wallet
 * @param RPC_ENDPOINT Your RPC endpoint to connect to
 * @param WALLET_PUBLIC_KEY The public key of the wallet you want to get tokens from
 * @returns {Promise<TokensObject>} Promise<TokensObject>
 */
export const get_tokens_balances = async (
  RPC_ENDPOINT: string,
  WALLET_PUBLIC_KEY: string
): Promise<TokensObject> => {
  if (!WALLET_PUBLIC_KEY) {
    throw new Error("No wallet public key specified");
  }
  if (!RPC_ENDPOINT) {
    throw new Error("No RPC endpoint specified");
  }
  const connection: Connection = createConnection(RPC_ENDPOINT);
  console.log("Connection established 🚀");
  console.log("Fetching tokens...");
  const result = await getAccountTokens(WALLET_PUBLIC_KEY, connection);
  return result;
};

/**
 * Gets balance of specified token in wallet
 * @param RPC_ENDPOINT 
 * @param WALLET_PUBLIC_KEY 
 * @param TOKEN_ADDRESS
 * @returns 
 */
export const get_token_balance = async (
  RPC_ENDPOINT: string,
  WALLET_PUBLIC_KEY: string,
  TOKEN_ADDRESS: string
): Promise<number> => {
  if (!TOKEN_ADDRESS) {
    throw new Error("No token address specified");
  }
  if (!WALLET_PUBLIC_KEY) {
    throw new Error("No wallet public key specified");
  }
  if (!RPC_ENDPOINT) {
    throw new Error("No RPC endpoint specified");
  }
  const connection: Connection = createConnection(RPC_ENDPOINT);
  console.log("Connection established 🚀");
  console.log("Fetching token balance...");
  const result = await getBalanceOfToken(WALLET_PUBLIC_KEY, TOKEN_ADDRESS, connection); 
  return result;
}