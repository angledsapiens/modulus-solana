import { startClock } from "./clock";

startClock({
  rpcUrl: "https://api.mainnet-beta.solana.com",
  curveAddress: "6PiyjiAPkp2KdZtqkyQYzVsD1Prv7t8v4TaYd8ip4YFd",
  asset: "PUMP_TOKEN",
  price: 1,
  liquidity: 1
});
