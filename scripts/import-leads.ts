/**
 * Import Claude-researched leads into the outreach pipeline (status: staged).
 * Thin CLI over src/lib/outreach/import-leads.ts (also used by the console
 * import route and the research pipeline).
 *
 * Usage:
 *   npx tsx scripts/import-leads.ts <file.json>                          # dry-run
 *   MONGODB_URI=... npx tsx scripts/import-leads.ts <file.json> --apply  # write
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import { validateLeadRows, insertLeads } from "../src/lib/outreach/import-leads";

const APPLY = process.argv.includes("--apply");
const file = process.argv[2];
if (!file || file.startsWith("--")) {
  console.error("Usage: npx tsx scripts/import-leads.ts <file.json> [--apply]");
  process.exit(1);
}

let rows: unknown[];
try {
  rows = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`Cannot read ${file}: ${(e as Error).message}`);
  process.exit(1);
}
if (!Array.isArray(rows)) { console.error("Input must be a JSON array"); process.exit(1); }

async function main() {
  const { docs, counts } = validateLeadRows(rows);

  if (!APPLY) {
    console.log("[DRY RUN] no writes. Re-run with --apply to insert.");
    console.log(counts);
    process.exit(counts.invalid > 0 ? 1 : 0);
  }

  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  await mongoose.connect(process.env.MONGODB_URI);
  const inserted = await insertLeads(docs);
  await mongoose.disconnect();
  console.log({ ...counts, inserted: inserted.inserted, skippedDupes: inserted.skippedDupes });
}

main().catch((e) => { console.error(e); process.exit(1); });
