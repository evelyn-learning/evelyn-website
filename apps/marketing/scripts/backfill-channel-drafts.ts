/**
 * Backfill linkedinDraft/contactFormDraft/contactPageUrl on leads researched
 * before those three-channel fields existed (Outreach v2). Thin CLI over the
 * pure helpers in src/lib/outreach/research/backfill-drafts.ts, using the
 * same call layer (claude.ts) and pricing (cost.ts) as the live pipeline.
 *
 * Usage:
 *   MONGODB_URI=... npx tsx scripts/backfill-channel-drafts.ts             # dry-run: lists leads needing backfill
 *   MONGODB_URI=... npx tsx scripts/backfill-channel-drafts.ts --apply     # calls Claude per lead, saves, prints cost
 */
import mongoose from "mongoose";
import { Lead } from "../src/models/Lead";
import { needsBackfill, backfillParams, mergeBackfill, type BackfillParsed } from "../src/lib/outreach/research/backfill-drafts";
import { realCallModel, callWithToolLoop, extractJson } from "../src/lib/outreach/research/claude";
import { priceUsageUsd } from "../src/lib/outreach/research/cost";

const APPLY = process.argv.includes("--apply");

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  await mongoose.connect(process.env.MONGODB_URI);

  const candidates = await Lead.find({ status: { $in: ["staged", "approved", "contacted"] } });
  const leads = candidates.filter((lead) => needsBackfill(lead));

  if (!APPLY) {
    console.log(`[DRY RUN] ${leads.length} lead(s) need backfill. Re-run with --apply to call Claude and save.`);
    for (const lead of leads) console.log(`  - ${lead.company} (${lead._id})`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const call = realCallModel();
  let totalCostUsd = 0;
  let updated = 0, skipped = 0, errored = 0;

  for (const lead of leads) {
    try {
      const params = backfillParams(lead);
      const msg = await callWithToolLoop(call, params, (u) => { totalCostUsd += priceUsageUsd(u); });
      const parsed = extractJson(msg) as BackfillParsed;
      const changed = mergeBackfill(lead, parsed);
      if (changed) {
        await lead.save();
        updated++;
        console.log(`  ok   - ${lead.company}: backfilled`);
      } else {
        skipped++;
        console.log(`  skip - ${lead.company}: nothing to fill (model returned empty fields)`);
      }
    } catch (e) {
      errored++;
      console.error(`  FAIL - ${lead.company}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  await mongoose.disconnect();
  console.log(`\n${updated} updated, ${skipped} skipped, ${errored} errored. Total cost: $${totalCostUsd.toFixed(4)}`);
  process.exit(errored > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
