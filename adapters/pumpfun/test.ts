import { Connection, PublicKey } from "@solana/web3.js";
import { decodePumpfunTx } from "./decode";
import { readCurveState } from "./curve";
import { buildSnapshot } from "./snapshot";

const PUMP_FUN_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);

const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=a9175697-7b51-4d04-96fb-250f9519f555",
  "confirmed"
);


async function run() {
  console.log("[TEST] Fetching recent pump.fun transactions…");

  const signatures = await connection.getSignaturesForAddress(
    PUMP_FUN_PROGRAM_ID,
    { limit: 50 }
  );

  for (const sig of signatures) {
    console.log("[TEST] Trying tx", sig.signature);

    const ctx = await decodePumpfunTx({
      connection,
      signature: sig.signature
    });

    if (!ctx) continue;

    const curve = await readCurveState({
      connection,
      curvePDA: ctx.curvePDA
    });

    if (!curve) continue;

    const snapshot = buildSnapshot({
      tokenMint: ctx.tokenMint.toBase58(),
      curve
    });

    console.log("🎯 FOUND LAUNCH SNAPSHOT");
    console.log(snapshot);
    return;
  }

  console.error(
    "❌ No pump.fun launch found in recent transactions"
  );
}

run().catch(console.error);
