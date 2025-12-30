import WebSocket from "ws";

export type HeliusMessageHandler = (msg: any) => void;

const PUMP_FUN_PROGRAM_ID =
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

export function connectHelius(params: {
  apiKey: string;
  onMessage: HeliusMessageHandler;
}) {
  const ws = new WebSocket(
    `wss://mainnet.helius-rpc.com/?api-key=${params.apiKey}`
  );

  ws.on("open", () => {
    console.log("[INGEST] Helius WS connected");

    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "logsSubscribe",
        params: [
          {
            mentions: [PUMP_FUN_PROGRAM_ID]
          },
          {
            commitment: "confirmed"
          }
        ]
      })
    );

    console.log("[INGEST] Sent logsSubscribe");
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    // 🔑 THIS IS CRITICAL — YOU NEVER LOGGED THIS
    if (msg.result && msg.id === 1) {
      console.log("[INGEST] Subscription ACK:", msg);
      return;
    }

    params.onMessage(msg);
  });

  ws.on("error", (err) => {
    console.error("[INGEST] WS error", err);
  });

  return ws;
}
