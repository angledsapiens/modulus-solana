import { CanonicalLiquiditySnapshot } from "../../../mod-eng-02-chain-adapters/src/types";

import {
  LiquiditySnapshot,
  LiquidityDepthInput,
  LiquidityElasticityInput,
  LiquidityFragmentationInput,
  LiquidityDegradationTrendInput
} from "../../../mod-eng-01-metrics/src/inputs";

import { MetricContext } from "../../../mod-eng-01-metrics/src/types";

import { computeLiquidityDepth } from "../../../mod-eng-01-metrics/src/metrics/depth";
import { computeLiquidityElasticity } from "../../../mod-eng-01-metrics/src/metrics/elasticity";
import { computeLiquidityFragmentation } from "../../../mod-eng-01-metrics/src/metrics/fragmentation";
import { computeLiquidityDegradationTrend } from "../../../mod-eng-01-metrics/src/metrics/degradation";

import { MetricMeta } from "../../../mod-eng-01-metrics/src/types";

import {
  makeSnapshotKey,
  getPreviousSnapshot,
  setPreviousSnapshot
} from "./state";

function buildMeta(metric: string): MetricMeta {
  return {
    metric,
    version: "v0",
    computedAt: Date.now()
  };
}

function computeMidPrice(snapshot: LiquiditySnapshot): number {
  const levels = snapshot.levels;
  if (levels.length === 0) return NaN;
  const mid = Math.floor(levels.length / 2);
  return levels[mid].price;
}

/**
 * Canonical → Metrics snapshot adapter
 */
function adaptSnapshot(
  snapshot: CanonicalLiquiditySnapshot
): LiquiditySnapshot {
  return {
    ts: snapshot.ts,
    levels: snapshot.levels.map(level => ({
      price: level.price,
      liquidity: Number(level.liquidity)
    }))
  };
}

/**
 * Build MetricContext from snapshot
 */
function buildContext(
  snapshot: CanonicalLiquiditySnapshot
): MetricContext {
  return {
    chain: snapshot.chain,
    venue: snapshot.venue,
    asset: snapshot.asset
  };
}

export function runMetrics(snapshot: CanonicalLiquiditySnapshot) {
  const context = buildContext(snapshot);
  const adapted = adaptSnapshot(snapshot);

  const depthInput: LiquidityDepthInput = {
    context,
    snapshot: adapted,
    priceBandPct: 0.02
  };

  const fragmentationInput: LiquidityFragmentationInput = {
    context,
    snapshot: adapted
  };

  const key = makeSnapshotKey(snapshot);
  const prev = getPreviousSnapshot(key);

  const adaptedCurrent = adapted;
  const adaptedPrev = prev ? adaptSnapshot(prev) : undefined;

  let elasticity;

  if (!adaptedPrev) {
    elasticity = computeLiquidityElasticity(
      {
        context,
        before: adaptedCurrent,
        after: adaptedCurrent,
        priceShockPct: 0
      },
      buildMeta("liquidity_elasticity")
    );
  } else {
    const prevPrice = computeMidPrice(adaptedPrev);
    const currPrice = computeMidPrice(adaptedCurrent);

    const rawShock =
      prevPrice > 0
        ? (currPrice - prevPrice) / prevPrice
        : NaN;

    // Guard: zero or near-zero price movement → undefined elasticity
    const priceShockPct =
      Number.isFinite(rawShock) && Math.abs(rawShock) > 1e-12
        ? rawShock
        : NaN;

    if (!Number.isFinite(priceShockPct)) {
      elasticity = computeLiquidityElasticity(
        {
          context,
          before: adaptedCurrent,
          after: adaptedCurrent,
          priceShockPct: 0
        },
        buildMeta("liquidity_elasticity")
      );
    } else {
      elasticity = computeLiquidityElasticity(
        {
          context,
          before: adaptedPrev,
          after: adaptedCurrent,
          priceShockPct
        },
        buildMeta("liquidity_elasticity")
      );
    }
  }

  const degradationInput: LiquidityDegradationTrendInput = {
    context,
    series: [adapted],
    windowSize: 1
  };

  setPreviousSnapshot(key, snapshot);

  return {
    depth: computeLiquidityDepth(
      depthInput,
      buildMeta("liquidity_depth")
    ),

    elasticity,

    fragmentation: computeLiquidityFragmentation(
      fragmentationInput,
      buildMeta("liquidity_fragmentation")
    ),

    degradation: computeLiquidityDegradationTrend(
      degradationInput,
      buildMeta("liquidity_degradation")
    )
  };
}
