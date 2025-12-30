import { Connection, PublicKey } from "@solana/web3.js";

/**
 * Fetch raw pump.fun bonding curve account state.
 * This is intentionally untyped and unprocessed.
 */
export async function fetchPumpfunRaw(
  rpcUrl: string,
  curveAddress: string
): Promise<Buffer> {
  const connection = new Connection(rpcUrl, "confirmed");
  const pubkey = new PublicKey(curveAddress);

  const accountInfo = await connection.getAccountInfo(pubkey);
  if (!accountInfo) {
    throw new Error("pump.fun curve account not found");
  }

  return accountInfo.data;
}
