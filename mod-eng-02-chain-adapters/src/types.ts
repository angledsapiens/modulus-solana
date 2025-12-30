/**
 * Unix timestamp in milliseconds
 * (mirrors MOD-ENG-01 exactly)
 */
export type TimestampMs = number;

export interface CanonicalLiquidityLevel {
  price: number;
  liquidity: bigint;
}

export interface CanonicalLiquiditySnapshot {
  chain: string;
  venue: string;
  asset: string;
  ts: TimestampMs;
  levels: CanonicalLiquidityLevel[];
}

export interface UniswapV3AdapterConfig {
  rpcUrl: string;
  poolAddress: string;
  asset: string;
  venue: "uniswap-v3";
  chain: "arbitrum";
}

export type UniswapV3AdapterParams = UniswapV3AdapterConfig;
