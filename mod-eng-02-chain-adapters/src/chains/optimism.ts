import { ethers } from "ethers";
import {
  CanonicalLiquiditySnapshot,
  CanonicalLiquidityLevel,
  UniswapV3AdapterConfig
} from "../types";
import { UNISWAP_V3_POOL_ABI } from "../uniswap/abi";
import { tickToPrice } from "../uniswap/math";

const TICK_WINDOW_MULTIPLIER = 10;

export async function fetchOptimismUniswapV3Snapshot(
  config: UniswapV3AdapterConfig
): Promise<CanonicalLiquiditySnapshot> {
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const pool = new ethers.Contract(
    config.poolAddress,
    UNISWAP_V3_POOL_ABI,
    provider
  );

  const block = await provider.getBlock("latest");
  if (!block?.timestamp) {
    throw new Error("Failed to fetch block timestamp");
  }

  const ts = block.timestamp * 1000;

  const [slot0, liquidity, tickSpacing] = await Promise.all([
    pool.slot0(),
    pool.liquidity(),
    pool.tickSpacing()
  ]);

  const currentTick = Number(slot0.tick);
  const spacing: number = Number(tickSpacing);

  const lowerTick = currentTick - spacing * TICK_WINDOW_MULTIPLIER;
  const upperTick = currentTick + spacing * TICK_WINDOW_MULTIPLIER;

  let activeLiquidity = BigInt(liquidity.toString());
  const levels: CanonicalLiquidityLevel[] = [];

  for (let tick = lowerTick; tick <= upperTick; tick += spacing) {
    const tickData = await pool.ticks(tick);
    activeLiquidity += BigInt(tickData.liquidityNet.toString());

    levels.push({
      price: tickToPrice(tick),
      liquidity: activeLiquidity
    });
  }

  return {
    chain: "optimism",
    venue: "uniswap-v3",
    asset: config.asset,
    ts,
    levels
  };
}
