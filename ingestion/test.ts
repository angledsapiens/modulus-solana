import { startPumpfunLogIngestion } from "./solana-logs";

startPumpfunLogIngestion({
  rpcUrl: "https://api.mainnet-beta.solana.com",
  onTx: (e) => {
    console.log("🔥 pump.fun activity", e);
  }
});
