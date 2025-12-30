import { Chain } from "./config";
import { CHAIN_CONFIGS } from "./chainConfigs";

import {
  fetchArbitrumUniswapV3Snapshot,
  fetchOptimismUniswapV3Snapshot,
  fetchAvalancheUniswapV3Snapshot
} from "../../../mod-eng-02-chain-adapters/src/index";

export async function fetchSnapshot(chain: Chain) {
  const config = CHAIN_CONFIGS[chain];

  switch (chain) {
    case "arbitrum":
      return fetchArbitrumUniswapV3Snapshot(config);
    case "optimism":
      return fetchOptimismUniswapV3Snapshot(config);
    case "avalanche":
      return fetchAvalancheUniswapV3Snapshot(config);
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
}
