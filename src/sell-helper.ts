import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import * as Swapper from "./swapper-helper";
import * as WalletInfo from "./walletInfo";
import { SOLANA_ADDRESS } from "./consts";

/**
 * Sells ALL tokens in wallet for given addressToken
 * @param {*} addressOfTokenOut 
 * @param {*} slippage 
 * @param {*} connection 
 * @returns TxId
 */
export const sellToken = async (
  sellAll: boolean = true,
  addressOfTokenOut: string,
  slippage: number,
  connection: Connection,
  wallet: Wallet,
  publicKeyOfWalletToQuery: string,
  amountOfTokenToSell: number | undefined,
) => {
  try {
    sellAll ? amountOfTokenToSell = await WalletInfo.getBalanceOfToken(publicKeyOfWalletToQuery, addressOfTokenOut, connection) : amountOfTokenToSell; 
    
    if (!amountOfTokenToSell) {
      throw new Error("No tokens to sell");
    }
    console.log(`Selling ${amountOfTokenToSell} of ${addressOfTokenOut}`);
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
      walletPublicKey,
      false,
    );

    const txid = await Swapper.finalizeTransaction(
      swapTransaction,
      wallet,
      connection
    );

    console.log("Waiting for confirmation... 🕒");
    
    let subscriptionId;
    try {
      subscriptionId = connection.onSignature(txid, (updatedTxInfo, context) => {
        if (updatedTxInfo.err) {
          console.error('Transaction failed:', updatedTxInfo.err);
        } else {
          console.log('Transaction confirmed ✅');
        }
      }, 'finalized');
    } finally {
      if (subscriptionId) {
        connection.removeSignatureListener(subscriptionId);
      }
    }
  } catch (error: any) {
    if (error.message.startsWith("TransactionExpiredTimeoutError")) {
      const match = error.message.match(/Check signature (\w+) using/);
      if (match) {
        const expiredTxid = match[1];
        const status = await connection.getSignatureStatus(expiredTxid);
        if (
          status &&
          status.value &&
          status.value.confirmationStatus === "finalized" && 
          status.value.err === null
        ) {
          return expiredTxid;
        }
      }
      throw new Error("Transaction expired");
    }
    throw new Error(error);
  }
};