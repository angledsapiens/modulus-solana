import { connectHelius } from "./helius";
import { parsePumpfunLaunch } from "./pumpfun-events";

export function startSolanaIngestion(params: {
  heliusApiKey: string;
  onLaunch: (e: {
    tokenMint: string;
    curvePDA: string;
    launchTs: number;
  }) => void;
}) {
  connectHelius({
    apiKey: params.heliusApiKey,
    onMessage: (msg) => {
      if (msg?.params?.result?.value?.accountKeys?.includes(
        "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
      )) {
        console.log("[INGEST] raw pump.fun tx", msg.params.result.value);
      }

      const event = parsePumpfunLaunch(msg);
      if (event) {
        console.log("[INGEST] pump.fun launch detected", event);
        params.onLaunch(event);
      }
    }
  });
}
