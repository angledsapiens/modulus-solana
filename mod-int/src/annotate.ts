// annotate.ts

type EmittedSnapshot = {
  chain: string;
  venue: string;
  asset: string;
  ts: number;
  metrics: {
    depth: {
      depth: number;
    };
    elasticity: {
      elasticity: number | null;
    };
    fragmentation: {
      fragmentationIndex: number;
    };
    degradation?: {
      state: string;
    };
  };
};

export function annotateTransition(
  prev: EmittedSnapshot | null,
  curr: EmittedSnapshot
) {
  if (!prev) {
    return {
      type: "INITIAL_SNAPSHOT",
      summary: "Initial observation recorded."
    };
  }

  const dDepth =
    curr.metrics.depth.depth - prev.metrics.depth.depth;

  const dFrag =
    curr.metrics.fragmentation.fragmentationIndex -
    prev.metrics.fragmentation.fragmentationIndex;

  const prevRegime = prev.metrics.degradation?.state;
  const currRegime = curr.metrics.degradation?.state;

  // Regime transition
  if (prevRegime && currRegime && prevRegime !== currRegime) {
    return {
      type: "REGIME_TRANSITION",
      summary: `System transitioned from ${prevRegime} to ${currRegime}.`
    };
  }

  // Absorbed liquidity change
  if (
    Math.abs(dDepth) > 0 &&
    curr.metrics.elasticity.elasticity !== null &&
    currRegime === "STABLE"
  ) {
    return {
      type: "ABSORBED_CHANGE",
      summary: "Liquidity change absorbed without price impact."
    };
  }

  // Structural shift
  if (Math.abs(dFrag) > 1e-4 || Math.abs(dDepth) > 0) {
    return {
      type: "STRUCTURAL_SHIFT",
      summary: "Liquidity structure shifted materially."
    };
  }

  return {
    type: "NO_SIGNIFICANT_CHANGE",
    summary: "No meaningful structural change detected."
  };
}
