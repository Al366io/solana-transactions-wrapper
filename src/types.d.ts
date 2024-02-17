import { Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";

export type Route = {
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  marketInfos: MarketInfo[];
  amount: string;
  slippageBps: number; // minimum: 0, maximum: 10000
  otherAmountThreshold: string; // The threshold for the swap based on the provided slippage: when swapMode is ExactIn the minimum out amount, when swapMode is ExactOut the maximum in amount
  swapMode: string;
  fees?: {
    signatureFee: number; // This indicates the total amount needed for signing transaction(s). Value in lamports.
    openOrdersDeposits: number[]; // This indicates the total amount needed for deposit of serum order account(s). Value in lamports.
    ataDeposits: number[]; // This indicates the total amount needed for deposit of associative token account(s). Value in lamports.
    totalFeeAndDeposits: number; // This indicates the total lamports needed for fees and deposits above.
    minimumSOLForTransaction: number; // This indicates the minimum lamports needed for transaction(s). Might be used to create wrapped SOL and will be returned when the wrapped SOL is closed. Also ensures rent exemption of the wallet.
  };
};

type MarketInfo = {
  id: string;
  label: string;
  inputMint: string;
  outputMint: string;
  notEnoughLiquidity: boolean;
  inAmount: string;
  outAmount: string;
  minInAmount?: string; // Optional property, equivalent to `omitempty` in Go
  minOutAmount?: string; // Optional property, equivalent to `omitempty` in Go
  priceImpactPct: number;
  lpFee: Fee | null;
  platformFee: Fee | null;
};

type Fee = {
  amount: string;
  mint: string;
  pct: number;
};

export type SwapResponse = {
  swapTransaction: string; // base64 encoded transaction string
};

export type TokenInfo = {
  symbol: string;
  balance: number;
};

export type TokensObject = Record<string, TokenInfo>;

export type buyConfig = {
  RPC_ENDPOINT: string;
  WALLET_PRIVATE_KEY: string;
  ADDRESS_OF_TOKEN_TO_BUY: string;
  AMOUNT_OF_SOLANA_TO_SPEND: number;
  SLIPPAGE: number;
};

export type sellConfig = {
  SELL_ALL: boolean;
  RPC_ENDPOINT: string;
  WALLET_PRIVATE_KEY: string;
  ADDRESS_OF_TOKEN_TO_SELL: string;
  AMOUNT_OF_TOKEN_TO_SELL?: number;
  SLIPPAGE: number;
};