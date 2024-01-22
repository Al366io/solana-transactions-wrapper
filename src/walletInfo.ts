import {
  PublicKey,
  Connection,
  ParsedAccountData,
  AccountInfo,
} from "@solana/web3.js";
import dotenv from "dotenv";
import { SOLANA_TOKENPROGRAM_ID } from "./consts";
dotenv.config();

/**
 * Gets amount of tokens in wallet for given addressToken
 * @param {string} addressOfToken
 * @returns {Promise<number> || Promise<boolean>} amountOfToken
 */
export const getBalanceOfToken = async (
  publicKeyOfWalletToQuery: string,
  addressOfToken: string,
  connection: Connection
): Promise<number> => {
  try {
    if (!publicKeyOfWalletToQuery) {
      throw new Error("No wallet to query");
    }
    const accounts = await getTokenAccounts(publicKeyOfWalletToQuery, connection);
    const relevantAccount = accounts.find((account) => {
      const parsedAccountInfo = account.account.data;
      if (parsedAccountInfo instanceof Buffer) {
        console.log("parsedAccountInfo is a buffer");
        return false; // Skip this account
      }
      const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
      if (mintAddress === addressOfToken) {
        return true; // This account is relevant
      }
      return false; // Skip this account
    });
    if (!relevantAccount) {
      return 0;
    }
    if (relevantAccount.account.data instanceof Buffer) {
      throw new Error("relevantAccount is a buffer");
    }

    const tokenBalance =
      relevantAccount.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"];

    return tokenBalance;
  } catch (error: any) {
    throw new Error(error);
  }
};

async function getTokenAccounts(
  wallet: string,
  solanaConnection: Connection
): Promise<
  {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData | Buffer>;
  }[]
> {
  const filters = [
    {
      dataSize: 165, // size of account (bytes)
    },
    {
      memcmp: {
        offset: 32, // location of our query in the account (bytes)
        bytes: wallet, // our search criteria, a base58 encoded string
      },
    },
  ];
  const TOKEN_PROGRAM_ID = new PublicKey(SOLANA_TOKENPROGRAM_ID);
  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    { filters: filters }
  );
  return accounts;
}

/**
 * Gets balance of SOL in wallet
 * @param {*} connection
 * @returns balance of SOL in correct format
 */
export const getSOLBalance = async (
  connection: Connection
): Promise<number> => {
  try {
    const WALLET_TO_QUERY = process.env.WALLET_PUBLIC_KEY;
    if (!WALLET_TO_QUERY) {
      throw new Error("No wallet to query");
    }
    const balance = await connection.getBalance(new PublicKey(WALLET_TO_QUERY));
    return balance / 10 ** 9;
  } catch (error: any) {
    throw new Error(error);
  }
};

// USAGE:
// const RPC_ENDPOINT =
// "https://wiser-old-gadget.solana-mainnet.quiknode.pro/cf30ae8c5cef48ec15b829ab71429671dc0aa47b/";

// const connection = new Connection(RPC_ENDPOINT);
// console.log(
// await getBalanceOfToken(
//   "CQSPU12VppGZB7LeRkEaKzrRBzvo1LyA9mR2ydiwKHaL",
//   connection
// )
// await getSOLBalance(connection)
// );
