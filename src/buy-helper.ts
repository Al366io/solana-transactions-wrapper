import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import * as Swapper from "./swapper-helper.js";
import { SOLANA_ADDRESS } from "./consts";

export const buyToken = async (
  addressOfTokenIn: string,
  amountOfTokenOut: number,
  slippage: number,
  connection: Connection,
  wallet: Wallet,
) => {
  try {
    let mint = await connection.getParsedAccountInfo(
      new PublicKey(SOLANA_ADDRESS)
    );
    if (!mint || !mint.value || mint.value.data instanceof Buffer) {
      throw new Error("Could not find mint");
    }
    const decimals = mint.value.data.parsed.info.decimals;
    const convertedAmountOfTokenOut = Swapper.convertToInteger(
      amountOfTokenOut,
      decimals
    );

    const quoteResponse = await Swapper.getQuote(
      SOLANA_ADDRESS,
      addressOfTokenIn,
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