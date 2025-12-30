import { CanonicalLiquiditySnapshot } from "../../../mod-eng-02-chain-adapters/src/types";

/**
 * Ephemeral in-memory snapshot store.
 * Lifetime: process only.
 * Scope: (chain, venue, asset)
 */
const previousSnapshots = new Map<string, CanonicalLiquiditySnapshot>();

export function makeSnapshotKey(
  snapshot: CanonicalLiquiditySnapshot
): string {
  return `${snapshot.chain}:${snapshot.venue}:${snapshot.asset}`;
}

export function getPreviousSnapshot(
  key: string
): CanonicalLiquiditySnapshot | undefined {
  return previousSnapshots.get(key);
}

export function setPreviousSnapshot(
  key: string,
  snapshot: CanonicalLiquiditySnapshot
): void {
  previousSnapshots.set(key, snapshot);
}
