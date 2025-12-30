import { PublicKey } from "@solana/web3.js";

/**
 * IMPORTANT:
 * Node 18+ has global fetch.
 * Do NOT import node-fetch.
 */

const PUMP_FUN_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);

// Your exact coin ID
const PUMP_FUN_COIN_ID =
  "Ew8KqgSitYucieR5KnSAL2SUFspcwA8AgSuZ5xWspump";

async function main() {
  console.log("[resolve] starting…");

  const url = `https://frontend-api.pump.fun/coins/${PUMP_FUN_COIN_ID}`;
  console.log("[resolve] fetching:", url);

  const res = await fetch(url);
  console.log("[resolve] status:", res.status);

  if (!res.ok) {
    throw new Error(`Pump.fun API error: ${res.status}`);
  }

  const coin: any = await res.json();
  console.log("[resolve] raw response keys:", Object.keys(coin));

  const tokenMint =
    coin.mint ||
    coin.mintAddress ||
    coin.tokenMint;

  if (!tokenMint) {
    throw new Error("Could not find token mint in response");
  }

  console.log("✔ Solana token mint:", tokenMint);

  const [curvePDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("bonding-curve"),
      new PublicKey(tokenMint).toBuffer()
    ],
    PUMP_FUN_PROGRAM_ID
  );

  console.log("✔ Bonding curve PDA:", curvePDA.toBase58());
}

main().catch((err) => {
  console.error("[resolve] ERROR:", err);
});
