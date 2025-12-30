import { CanonicalLiquidityLevel } from "../src/types";

/**
 * Type-level regression test.
 *
 * This file is never executed.
 * It exists purely to ensure that liquidity remains `bigint`.
 *
 * If liquidity is ever changed back to `number`,
 * this file MUST fail to compile.
 */

// This assignment must compile
const level: CanonicalLiquidityLevel = {
  price: 1.0,
  liquidity: BigInt("1000000000000000000000000")
};

// This line must fail if liquidity is not bigint
const _liquidityMustBeBigInt: bigint = level.liquidity;

// Uncommenting the following line SHOULD cause a TypeScript error.
// It is intentionally left commented to document the invariant.
//
// const _shouldError: number = level.liquidity;
