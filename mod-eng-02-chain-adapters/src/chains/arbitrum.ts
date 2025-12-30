import { ethers } from "ethers";
import {
  CanonicalLiquiditySnapshot,
  CanonicalLiquidityLevel,
  UniswapV3AdapterConfig
} from "../types";
import { UNISWAP_V3_POOL_ABI } from "../uniswap/abi";
import { tickToPrice } from "../uniswap/math";

const TICK_WINDOW_MULTIPLIER = 10;

/**
 * Fetch a deterministic Uniswap V3 liquidity snapshot on Arbitrum.
 *
 * This answers one question only:
 * "What is the on-chain liquidity state right now?"
 */
export async function fetchArbitrumUniswapV3Snapshot(
  config: UniswapV3AdapterConfig
): Promise<CanonicalLiquiditySnapshot> {
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);

  const pool = new ethers.Contract(
    config.poolAddress,
    UNISWAP_V3_POOL_ABI,
    provider
  );

  // --- Timestamp (from chain, not wall clock)
  const block = await provider.getBlock("latest");
  if (!block || block.timestamp == null) {
    throw new Error("Failed to fetch block timestamp");
  }

  const ts = block.timestamp * 1000;

  // --- Core pool state
  const [slot0, liquidity, tickSpacing] = await Promise.all([
    pool.slot0(),
    pool.liquidity(),
    pool.tickSpacing()
  ]);

  const currentTick = Number(slot0.tick);
  const spacing = Number(tickSpacing);

  const lowerTick = currentTick - spacing * TICK_WINDOW_MULTIPLIER;
  const upperTick = currentTick + spacing * TICK_WINDOW_MULTIPLIER;

  let activeLiquidity = BigInt(liquidity.toString());
  const levels: CanonicalLiquidityLevel[] = [];

  // --- Walk ticks deterministically
  for (let tick = lowerTick; tick <= upperTick; tick += spacing) {
    const tickData = await pool.ticks(tick);

    activeLiquidity += BigInt(tickData.liquidityNet.toString());

    levels.push({
      price: tickToPrice(tick),
      liquidity: activeLiquidity
    });
  }

  return {
    chain: "arbitrum",
    venue: "uniswap-v3",
    asset: config.asset,
    ts,
    levels
  };
}
