import {
  PublicKey,
  Connection,
  ParsedAccountData,
  AccountInfo,
} from "@solana/web3.js";
import dotenv from "dotenv";
import { SOLANA_TOKENPROGRAM_ID } from "./consts";
import { TokensObject } from "./types";
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
    const accounts = await getTokenAccounts(
      publicKeyOfWalletToQuery,
      connection
    );
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

export async function getTokenAccounts(
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
  connection: Connection,
  publicKeyOfWalletToQuery: string = process.env.WALLET_PUBLIC_KEY!
): Promise<number> => {
  try {
    if (!publicKeyOfWalletToQuery) {
      throw new Error("No wallet to query");
    }
    const balance = await connection.getBalance(
      new PublicKey(publicKeyOfWalletToQuery)
    );
    return balance / 10 ** 9;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Gets all tokens in wallet
 * @param publicKeyOfWalletToQuery 
 * @param connection 
 * @returns Promise<TokensObject>
 */
export const getAccountTokens = async (
  publicKeyOfWalletToQuery: string,
  connection: Connection
) => {
  try {
    if (!publicKeyOfWalletToQuery) {
      throw new Error("No wallet to query");
    }
    const accounts = await getTokenAccounts(
      publicKeyOfWalletToQuery,
      connection
    );

    let tokensObject: TokensObject = {};

    for (let i = 0; i < accounts.length; i++) {
      const token = accounts[i];
      if (token.account.data instanceof Buffer) {
        throw new Error("relevantAccount is a buffer");
      }
      if (token.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"] <= 0) {
        continue;
      }
      const tokenAddress: string =
        token.account.data["parsed"]["info"]["mint"].toString();
      const tokenBalance: number =
        token.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"];
      const tokenName: string = await getTokenName(tokenAddress);

      tokensObject[tokenAddress] = {
        symbol: tokenName,
        balance: tokenBalance,
      };
    }

    return tokensObject;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Gets token name
 * @param tokenAddressesArray
 * @returns Promise<string>
 */
const getTokenName = async (tokenAddress: string): Promise<string> => {
  // TODO: cache this. Horrible.

  const tokenList = await fetch("https://token.jup.ag/all");
  const tokenListJson = await tokenList.json();
  const token = tokenListJson.find(
    (token: any) => token.address === tokenAddress
  );
  if (!token) {
    return "";
  }
  return token.name.toString();
};
