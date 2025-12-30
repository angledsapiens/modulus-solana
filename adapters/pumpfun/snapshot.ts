import { PumpfunCurveState } from "./curve";

export type CanonicalLiquiditySnapshot = {
  ts: number;
  chain: "solana";
  venue: "pump.fun";
  asset: string;
  levels: Array<{
    price: number;
    liquidity: number;
  }>;
};

/**
 * Convert curve state → canonical snapshot
 */
export function buildSnapshot(params: {
  tokenMint: string;
  curve: PumpfunCurveState;
}): CanonicalLiquiditySnapshot {
  const baseLiquidity = params.curve.lamports / 1e9;

  return {
    ts: Date.now(),
    chain: "solana",
    venue: "pump.fun",
    asset: params.tokenMint,
    levels: [
      {
        price: 1,
        liquidity: baseLiquidity
      },
      {
        price: 1.2,
        liquidity: baseLiquidity * 0.6
      },
      {
        price: 1.5,
        liquidity: baseLiquidity * 0.3
      }
    ]
  };
}
