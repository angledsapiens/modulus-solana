# MOD-ENG-02 — Chain Adapters

## Module Name

MOD-ENG-02 — Chain Adapters

## Purpose

This module ingests raw on-chain state from supported blockchains and normalizes it into a
canonical, chain-agnostic liquidity snapshot format.

Its sole responsibility is to answer one question deterministically:

**“What is the on-chain liquidity state right now?”**

The output of this module feeds directly into MOD-ENG-01 (Metrics Engine).

## Explicit Scope

### What this module DOES

- Connects to EVM-compatible chains via RPC
- Reads Uniswap V3 pool state
- Constructs bounded, deterministic liquidity curves
- Outputs normalized liquidity snapshots in canonical form

### What this module DOES NOT do

- Compute metrics or analytics
- Interpret results
- Infer prices, volatility, or trends
- Store data
- Trigger alerts
- Perform visualization or dashboards
- Handle orchestration or scheduling

## Supported Chains (v0)

- Arbitrum One
- Optimism
- Avalanche C-Chain

## Supported Venue (v0)

- Uniswap V3 (concentrated liquidity AMM)

## Inputs (Conceptual)

- RPC endpoint
- Uniswap V3 pool address
- Asset identifier
- Chain identifier

## Outputs (Conceptual)

- CanonicalLiquiditySnapshot
  - Timestamp (ms, derived from block timestamp)
  - Ordered liquidity levels (price, liquidity)
  - Chain / venue / asset context

## Determinism Guarantees

- Block timestamp is used (not wall clock time)
- Tick scanning is bounded and deterministic
- No inferred or interpolated data
- Identical inputs produce identical outputs

## Current Status

v0
