import fs from "fs";
import path from "path";

/**
 * Absolute path to the dashboard metrics file.
 * This is the live integration boundary for MOD-ENG-03.
 */
const METRICS_FILE_PATH = path.resolve(
  __dirname,
  "../../../mod-eng-03-dashboard/public/metrics.json"
);

/**
 * Overwrite the dashboard metrics file with the latest snapshot.
 * Called only after successful metric computation.
 */
export function emitMetricsToFile(payload: unknown): void {
  const json = JSON.stringify(payload, null, 2);
  fs.writeFileSync(METRICS_FILE_PATH, json, "utf-8");
}
