import { Connection } from "@solana/web3.js";

import { startPumpfunLogIngestion } from "../ingestion/solana-logs";

import { decodePumpfunTx } from "../adapters/pumpfun/decode";
import { readCurveState } from "../adapters/pumpfun/curve";
import { buildSnapshot } from "../adapters/pumpfun/snapshot";

import { runMetrics } from "../../modulus-core/mod-int/src/runtime/metrics";
import { evaluateMeltdown } from "../../modulus-core/mod-eng-01-metrics/src/meltdown";

import { insertSnapshot } from "../../modulus-core/storage";

export function startModulusSolana(params: {
  rpcUrl: string;
}) {
  const connection = new Connection(params.rpcUrl, "confirmed");

  console.log("[MOD-SOL] Modulus Solana v1.1 started");

  startPumpfunLogIngestion({
    rpcUrl: params.rpcUrl,

    onTx: async ({ signature, slot }) => {
      try {
        // 1️⃣ Decode launch tx
        const ctx = await decodePumpfunTx({
          connection,
          signature
        });

        if (!ctx) return;

        // 2️⃣ Read curve state
        const curve = await readCurveState({
          connection,
          curvePDA: ctx.curvePDA
        });

        if (!curve) return;

        // 3️⃣ Build canonical snapshot
        const snapshot = buildSnapshot({
          tokenMint: ctx.tokenMint.toBase58(),
          curve
        });

        // 4️⃣ Run metrics
        const metrics = runMetrics(snapshot);

        // 5️⃣ Evaluate meltdown
        const meltdown = evaluateMeltdown({
          liquidityDepth: metrics.depth.depth,
          liquidityElasticity: metrics.elasticity.elasticity,
          liquidityFragmentation: metrics.fragmentation.fragmentationIndex,
          liquidityDegradation: metrics.degradation.slope
        });

        // 6️⃣ Persist
        insertSnapshot({
          chain: snapshot.chain,
          venue: snapshot.venue,
          asset: snapshot.asset,
          ts: snapshot.ts,
          metrics,
          meltdownIndex: meltdown.index,
          meltdownState: meltdown.state
        });

        console.log(
          `[MOD-SOL] ${snapshot.asset} | MI=${meltdown.index} | state=${meltdown.state}`
        );
      } catch (err) {
        console.error("[MOD-SOL] integration error", err);
      }
    }
  });
}
