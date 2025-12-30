import { RuntimeConfig } from "./config";
import { fetchSnapshot } from "./adapterFactory";
import { runMetrics } from "./metrics";
import { emit } from "../outputs/stdout";
import { emitMetricsToFile } from "../outputs/file";
import { annotateTransition } from "../annotate";

/**
 * Ephemeral previous snapshot.
 * This is NOT persisted and resets on restart (v0-correct).
 */
let prevEmittedSnapshot: {
  chain: string;
  venue: string;
  asset: string;
  ts: number;
  metrics: any;
} | null = null;

export function startClock() {
  console.log(
    `[MOD-INT] clock started | chain=${RuntimeConfig.chain} | interval=${RuntimeConfig.pollIntervalMs}ms`
  );

  setInterval(() => {
    tick();
  }, RuntimeConfig.pollIntervalMs);
}

async function tick() {
  console.log(`[MOD-INT] tick @ ${new Date().toISOString()}`);

  try {
    const snapshot = await fetchSnapshot(RuntimeConfig.chain);
    const metrics = runMetrics(snapshot);

    // Build canonical emitted snapshot
    const emittedSnapshot = {
      chain: snapshot.chain,
      venue: snapshot.venue,
      asset: snapshot.asset,
      ts: snapshot.ts,
      metrics
    };

    // 🔑 v0 transition annotation (edge-based, ephemeral)
    const annotation = annotateTransition(
      prevEmittedSnapshot,
      emittedSnapshot
    );

    const annotatedSnapshot = {
      ...emittedSnapshot,
      annotation
    };

    // Emit annotated snapshot
    emit("metrics", annotatedSnapshot);
    emitMetricsToFile(annotatedSnapshot);

    // Advance state AFTER emission (no feedback loops)
    prevEmittedSnapshot = emittedSnapshot;

    console.log("[MOD-INT] metrics emitted successfully");
  } catch (err) {
    console.error("[MOD-INT] runtime error:", err);
  }
}
