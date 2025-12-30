import { Connection, PublicKey } from "@solana/web3.js";

const PUMP_FUN_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);

export type PumpfunTxContext = {
  signature: string;
  slot: number;
  tokenMint: PublicKey;
  curvePDA: PublicKey;
};

/**
 * Extract token mint and curve PDA from a *pump.fun launch* tx
 *
 * IMPORTANT:
 * - Only returns non-null for CREATE / LAUNCH transactions
 * - Trades and other interactions will correctly return null
 */
export async function decodePumpfunTx(params: {
  connection: Connection;
  signature: string;
}): Promise<PumpfunTxContext | null> {
  const tx = await params.connection.getParsedTransaction(
    params.signature,
    {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0
    }
  );

  if (!tx || !tx.meta) return null;

  /**
   * pump.fun launch txs create a NEW SPL token mint.
   * That mint appears in postTokenBalances with 9 decimals.
   */
  const postTokenBalances = tx.meta.postTokenBalances ?? [];

  const mintBalance = postTokenBalances.find(
    (b) => b.uiTokenAmount?.decimals === 9
  );

  // Not a launch tx
  if (!mintBalance) return null;

  const tokenMint = new PublicKey(mintBalance.mint);

  /**
   * Derive bonding curve PDA (canonical)
   */
  const [curvePDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("bonding-curve"),
      tokenMint.toBuffer()
    ],
    PUMP_FUN_PROGRAM_ID
  );

  return {
    signature: params.signature,
    slot: tx.slot,
    tokenMint,
    curvePDA
  };
}
