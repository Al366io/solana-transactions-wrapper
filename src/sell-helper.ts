import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import * as Swapper from "./swapper-helper.js";
import * as WalletInfo from "./walletInfo.js";

/**
 * Sells ALL tokens in wallet for given addressToken
 * @param {*} addressOfTokenOut 
 * @param {*} slippage 
 * @param {*} connection 
 * @returns TxId
 */
export const sellToken = async (
  addressOfTokenOut: string,
  slippage: number,
  connection: Connection,
  wallet: Wallet,
  publicKeyOfWalletToQuery: string,
  sellAll: boolean = true
) => {
  try {
    // const wallet = new Wallet(
    //   Keypair.fromSecretKey(bs58.decode(process.env.WALLET_PRIVATE_KEY))
    // );
    const SOLANA_ADDRESS = "So11111111111111111111111111111111111111112";

    const amountOfTokenToSell = await WalletInfo.getBalanceOfToken(publicKeyOfWalletToQuery, addressOfTokenOut, connection);
    
    if (!amountOfTokenToSell) {
      throw new Error("No tokens to sell");
    }

    let mint = await connection.getParsedAccountInfo(
      new PublicKey(addressOfTokenOut)
    );

    if (!mint || !mint.value || mint.value.data instanceof Buffer) {
      throw new Error("Could not find mint");
    }

    const decimals = mint.value.data.parsed.info.decimals;
    const convertedAmountOfTokenOut = Swapper.convertToInteger(
      amountOfTokenToSell,
      decimals
    );

    const quoteResponse = await Swapper.getQuote(
      addressOfTokenOut,
      SOLANA_ADDRESS,
      convertedAmountOfTokenOut,
      slippage
    );

    const walletPublicKey = wallet.publicKey.toString();
    const swapTransaction = await Swapper.getSwapTransaction(
      quoteResponse,
      walletPublicKey
    );

    const txid = await Swapper.finalizeTransaction(
      swapTransaction,
      wallet,
      connection
    );
    return txid;
  } catch (error: any) {
    throw new Error(error);
  }
};

// USAGE:
// Swapper.withRetries(async () => {
//   return await sellToken(
//     "CQSPU12VppGZB7LeRkEaKzrRBzvo1LyA9mR2ydiwKHaL",
//     13.88,
//     1
//   );
// });