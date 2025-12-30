import { fetchPumpfunRaw } from "./fetch";
import { normalizePumpfunSnapshot } from "./normalize";

export async function fetchPumpfunSnapshot(params: {
  rpcUrl: string;
  curveAddress: string;
  asset: string;
  price: number;
  liquidity: number;
}) {
  // Raw fetch for liveness & correctness
  await fetchPumpfunRaw(params.rpcUrl, params.curveAddress);

  const normalized = normalizePumpfunSnapshot({
    asset: params.asset,
    price: params.price,
    liquidity: params.liquidity
  });

  return {
    chain: "solana",
    venue: "pump.fun",
    asset: params.asset,
    ts: Date.now(),
    levels: normalized.levels
  };
}
