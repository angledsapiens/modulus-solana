import { UniswapV3AdapterConfig } from "../../../mod-eng-02-chain-adapters/src/types";

export const CHAIN_CONFIGS = {
  arbitrum: {
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    poolAddress: "0xC6962004f452bE9203591991D15f6b388e09E8D0",
    asset: "ETH/USDC",
    venue: "uniswap-v3",
    chain: "arbitrum"
  },

  optimism: {
    rpcUrl: "https://mainnet.optimism.io",
    poolAddress: "0x85149247691df622eaF1a8Bd0CaFd40BC45154a9",
    asset: "ETH/USDC",
    venue: "uniswap-v3",
    chain: "arbitrum" // type workaround (runtime adapter sets real chain)
  },

  avalanche: {
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    poolAddress: "0x0000000000000000000000000000000000000000",
    asset: "ETH/USDC",
    venue: "uniswap-v3",
    chain: "arbitrum"
  }
} as const satisfies Record<
  "arbitrum" | "optimism" | "avalanche",
  UniswapV3AdapterConfig
>;
