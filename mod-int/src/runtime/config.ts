export type Chain = "arbitrum" | "optimism" | "avalanche";

export const RuntimeConfig = {
  chain: "arbitrum" as Chain,
  pollIntervalMs: 15_000
};
