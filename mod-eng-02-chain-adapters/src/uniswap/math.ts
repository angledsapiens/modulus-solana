/**
 * Convert a Uniswap V3 tick to a normalized price.
 *
 * NOTE:
 * - This is a pure mathematical transform
 * - Token decimal normalization is intentionally NOT handled here
 * - MOD-ENG-01 operates on relative curves, not absolute units
 */
export function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}
