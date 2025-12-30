import { Connection, PublicKey, Logs, Context } from "@solana/web3.js";

const PUMP_FUN_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);

export type PumpfunTxEvent = {
  signature: string;
  slot: number;
};

export function startPumpfunLogIngestion(params: {
  rpcUrl: string;
  onTx: (e: PumpfunTxEvent) => void;
}) {
  const connection = new Connection(params.rpcUrl, "confirmed");

  console.log("[INGEST] Subscribing to pump.fun logs via web3.js");

  connection.onLogs(
    PUMP_FUN_PROGRAM_ID,
    (logs: Logs, ctx: Context) => {
      console.log("[INGEST] pump.fun tx", logs.signature);

      params.onTx({
        signature: logs.signature,
        slot: ctx.slot
      });
    },
    "confirmed"
  );
}
