import { Connection, PublicKey } from "@solana/web3.js";

/**
 * Minimal curve state (v1.1)
 * We intentionally keep this coarse.
 */
export type PumpfunCurveState = {
  lamports: number;
  supply: number;
};

/**
 * Read bonding curve account
 */
export async function readCurveState(params: {
  connection: Connection;
  curvePDA: PublicKey;
}): Promise<PumpfunCurveState | null> {
  const info = await params.connection.getAccountInfo(
    params.curvePDA,
    "confirmed"
  );

  if (!info) return null;

  // v1.1 approximation:
  // - lamports = liquidity proxy
  // - data length ≈ supply proxy
  return {
    lamports: info.lamports,
    supply: info.data.length
  };
}
