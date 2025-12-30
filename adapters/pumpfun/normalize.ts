/**
 * NOTE:
 * pump.fun bonding curve layouts vary.
 * For v1, we assume price/liquidity levels are derived
 * externally from decoded curve state.
 *
 * This function is intentionally conservative.
 */
export function normalizePumpfunSnapshot(params: {
  asset: string;
  price: number;
  liquidity: number;
}): {
  levels: Array<{ price: number; liquidity: number }>;
} {
  return {
    levels: [
      {
        price: params.price,
        liquidity: params.liquidity
      }
    ]
  };
}
