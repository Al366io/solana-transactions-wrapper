import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import * as Swapper from "./swapper-helper.js";

export const buyToken = async (
  addressOfTokenIn: string,
  amountOfTokenOut: number,
  slippage: number,
  connection: Connection,
  wallet: Wallet
) => {
  try {
    // const wallet = new Wallet(
    //   Keypair.fromSecretKey(bs58.decode(process.env.WALLET_PRIVATE_KEY))
    // );
    const SOLANA_ADDRESS = "So11111111111111111111111111111111111111112";

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

// USAGE:
// Swapper.withRetries(async () => {
//   return await buyToken(
//     "CQSPU12VppGZB7LeRkEaKzrRBzvo1LyA9mR2ydiwKHaL",
//     0.001,
//     1
//   );
// });
