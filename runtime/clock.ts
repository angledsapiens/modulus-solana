import { fetchPumpfunSnapshot } from "../adapters/pumpfun";
import { runMetrics } from "../../modulus-core/mod-int/src/runtime/metrics";
import { evaluateMeltdown } from "../../modulus-core/mod-eng-01-metrics/src/meltdown";
import { insertSnapshot } from "../../modulus-core/storage";

const POLL_INTERVAL_MS = 5_000;

function scalarDepth(d: any): number {
  // LiquidityDepthOutput
  return d?.depth ?? d?.totalDepth ?? NaN;
}

function scalarElasticity(e: any): number {
  // LiquidityElasticityOutput
  return e?.elasticity ?? NaN;
}

function scalarFragmentation(f: any): number {
  // LiquidityFragmentationOutput
  return f?.fragmentation ?? f?.score ?? NaN;
}

function scalarDegradation(d: any): number {
  // LiquidityDegradationTrendOutput
  return d?.trend ?? d?.slope ?? NaN;
}


export function startClock(params: {
  rpcUrl: string;
  curveAddress: string;
  asset: string;
  price: number;
  liquidity: number;
}) {
  console.log("[MOD-SOL] clock started");

  setInterval(async () => {
    try {
      const snapshot = await fetchPumpfunSnapshot(params);

      const metrics = runMetrics(snapshot);

      const meltdown = evaluateMeltdown({
        liquidityDepth: scalarDepth(metrics.depth),
        liquidityElasticity: scalarElasticity(metrics.elasticity),
        liquidityFragmentation: scalarFragmentation(metrics.fragmentation),
        liquidityDegradation: scalarDegradation(metrics.degradation)
      });

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
      console.error("[MOD-SOL] tick error", err);
    }
  }, POLL_INTERVAL_MS);
}
