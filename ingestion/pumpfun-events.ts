import { PublicKey } from "@solana/web3.js";

/**
 * Official pump.fun program ID
 */
const PUMP_FUN_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);

export type PumpfunLaunchEvent = {
  tokenMint: string;
  curvePDA: string;
  launchTs: number;
};

/**
 * Attempt to extract pump.fun launch info from logs
 * This is intentionally conservative.
 */
export function parsePumpfunLaunch(
  msg: any
): PumpfunLaunchEvent | null {
  if (!msg?.params?.result?.value) return null;

  const logs: string[] =
    msg.params.result.value.logs ?? [];

  const accountKeys: string[] =
    msg.params.result.value.accountKeys ?? [];

  // Heuristic: pump.fun create instruction emits identifiable logs
  const isPumpfun =
    accountKeys.includes(PUMP_FUN_PROGRAM_ID.toBase58());

  if (!isPumpfun) return null;

  // Heuristic: mint is usually the first writable account
  const tokenMint = accountKeys.find(
    (k) => k !== PUMP_FUN_PROGRAM_ID.toBase58()
  );

  if (!tokenMint) return null;

  // Derive bonding curve PDA
  const [curvePDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("bonding-curve"),
      new PublicKey(tokenMint).toBuffer()
    ],
    PUMP_FUN_PROGRAM_ID
  );

  return {
    tokenMint,
    curvePDA: curvePDA.toBase58(),
    launchTs: Date.now()
  };
}
