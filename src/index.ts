import { Connection, Keypair } from "@solana/web3.js";
import { buyToken } from "./buy-helper";
import { createConnection, withRetries } from "./swapper-helper";
import { Wallet } from "@project-serum/anchor";
import bs58 from "bs58";
import { sellToken } from "./sell-helper";
import { getAccountTokens } from "./walletInfo";
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
    console.log("Trying to buy token with 3 retries and 60 seconds timeout...");
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
 * @param RPC_ENDPOINT Your RPC endpoint to connect to
 * @param WALLET_PRIVATE_KEY The private key of the wallet you want to sell from
 * @param ADDRESS_OF_TOKEN_TO_SELL The address of the token you want to sell
 * @param SLIPPAGE The slippage you want to use (default 1%)
 * @param SELL_ALL Whether or not you want to sell all of the token in your wallet (TODO: implement)
 * @returns Promise<string> The txid
 */
export const sell_token = async (
  RPC_ENDPOINT: string,
  WALLET_PRIVATE_KEY: string,
  ADDRESS_OF_TOKEN_TO_SELL: string,
  SLIPPAGE: number = 1,
  SELL_ALL: boolean = true
): Promise<string> => {
  const connection: Connection = createConnection(RPC_ENDPOINT);
  console.log("Connection established 🚀");
  const wallet = new Wallet(
    Keypair.fromSecretKey(bs58.decode(WALLET_PRIVATE_KEY))
  );
  console.log("Wallet fetched ✅");
  console.log("Trying to sell token with 3 retries and 60 seconds timeout...");
  const sellTokenFunction = async () => {
    return await sellToken(
      ADDRESS_OF_TOKEN_TO_SELL,
      SLIPPAGE,
      connection,
      wallet,
      wallet.publicKey.toString(),
      SELL_ALL
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
export const get_tokens = async (
  RPC_ENDPOINT: string,
  WALLET_PUBLIC_KEY: string
): Promise<TokensObject> => {
  const connection: Connection = createConnection(RPC_ENDPOINT);
  console.log("Connection established 🚀");
  console.log("Fetching tokens...");
  const result = await getAccountTokens(WALLET_PUBLIC_KEY, connection);
  return result;
};
