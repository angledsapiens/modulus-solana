import { PublicKey } from "@solana/web3.js";

const PUMP_FUN_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);

const TOKEN_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

const [curvePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("bonding-curve"), TOKEN_MINT.toBuffer()],
  PUMP_FUN_PROGRAM_ID
);

console.log(curvePDA.toBase58());
