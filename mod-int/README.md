# MOD-INT — Integration Runtime

MOD-INT is the integration layer for the Modulus project.

It orchestrates frozen core modules to prove that the system can run end-to-end, continuously, and correctly on supported chains.

This module does NOT implement metrics, adapters, protocol logic, or UI.

---

## Purpose

MOD-INT orchestrates live on-chain data flow across the Modulus stack:

MOD-ENG-02 (Chain Adapters)
↓
MOD-ENG-01 (Metrics Engine)
↓
Runtime Outputs (stdout / downstream consumers)

It validates:

- correct wiring between modules
- deterministic execution
- explicit error surfacing
- clean responsibility boundaries

---

## What MOD-INT Does

- Selects a target chain at runtime
- Invokes the corresponding chain adapter
- Normalizes adapter output at the integration boundary
- Executes all v0 metrics
- Emits metrics to stdout

---

## What MOD-INT Does NOT Do

- Implement metrics or formulas
- Implement or modify adapters
- Interpret protocol semantics
- Provide dashboards or UI
- Hide or mask runtime errors

---

## Chain Support

Arbitrum

- Supported
- Fully tested end-to-end

Optimism

- Supported
- Fully tested end-to-end

Avalanche

- Not supported
- Uniswap V3 is not canonical on Avalanche
- Requires a dedicated Avalanche-native adapter (out of scope for v0)

---

## Metric Notes

Liquidity Elasticity may return NaN in v0.

This is expected when:

- before and after snapshots are identical
- no price shock is applied

Mathematically, this represents division by zero and is not an error.

---

## Precision Boundary

- Chain adapters use bigint for on-chain liquidity
- Metrics engine operates on number for analysis
- MOD-INT performs explicit normalization at the boundary

This tradeoff is intentional and documented.

---

## Runtime Configuration

Chain selection is controlled via src/runtime/config.ts.

Example:

chain: "arbitrum"
pollIntervalMs: 15000

Only one chain runs per process in v0.

---

## Verified Execution

The following command has been verified on Arbitrum and Optimism:

npx ts-node src/index.ts

Metrics are fetched, computed, and emitted deterministically.

---

## Scope Boundary

Out of scope for MOD-INT v0:

- Avalanche concentrated liquidity support
- Temporal modeling for elasticity
- Multi-chain parallel execution
- Interpretation, alerts, or UI layers

---

## Final Statement

MOD-INT demonstrates that Modulus runs end-to-end on supported chains with all limitations explicit and documented.
