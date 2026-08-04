// scripts/import-leads.ts
/**
 * Import Claude-researched leads into the outreach pipeline (status: staged).
 *
 * Usage:
 *   MONGODB_URI=... npx tsx scripts/import-leads.ts <file.json>          # dry-run
 *   MONGODB_URI=... npx tsx scripts/import-leads.ts <file.json> --apply  # write
 *
 * Input: JSON array matching the Lead schema (see src/models/Lead.ts).
 * status/demoToken/gmailThreadIds/touches on input rows are ignored.
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import { Lead } from "../src/models/Lead";

const APPLY = process.argv.includes("--apply");
const file = process.argv[2];
if (!file || file.startsWith("--")) {
  console.error("Usage: npx tsx scripts/import-leads.ts <file.json> [--apply]");
  process.exit(1);
}

const rows: unknown[] = JSON.parse(readFileSync(file, "utf8"));
if (!Array.isArray(rows)) { console.error("Input must be a JSON array"); process.exit(1); }

const results = { valid: 0, invalid: 0, inserted: 0, skippedDupes: 0, errors: [] as string[] };

async function main() {
  const docs: InstanceType<typeof Lead>[] = [];
  rows.forEach((row, i) => {
    const r = row as Record<string, unknown>;
    delete r.status; delete r.demoToken; delete r.gmailThreadIds; delete r.touches; delete r.demoVisits;
    if (r.currentDraft && typeof r.currentDraft === "object") {
      const d = r.currentDraft as Record<string, unknown>;
      delete d.gmailDraftId; delete d.gmailThreadId;
    }
    const doc = new Lead({ ...r, status: "staged" });
    const err = doc.validateSync();
    if (err) {
      results.invalid++;
      results.errors.push(`row ${i} (${r.company ?? "?"}): ${Object.keys(err.errors).join(", ")}`);
    } else {
      results.valid++;
      docs.push(doc);
    }
  });

  if (!APPLY) {
    console.log("[DRY RUN] no writes. Re-run with --apply to insert.");
    console.log(results);
    process.exit(results.invalid > 0 ? 1 : 0);
  }

  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  await mongoose.connect(process.env.MONGODB_URI);
  for (const doc of docs) {
    const dupe = await Lead.findOne({
      company: doc.company,
      "decisionMaker.email": doc.decisionMaker.email ?? null,
    });
    if (dupe) { results.skippedDupes++; continue; }
    await doc.save();
    results.inserted++;
  }
  await mongoose.disconnect();
  console.log(results);
}

main().catch((e) => { console.error(e); process.exit(1); });
