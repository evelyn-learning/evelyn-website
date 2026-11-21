/**
 * Decides, per item, whether an animated solution is needed (one small model call each) and records it:
 * "no" → the item goes to "No animation needed" with a one-sentence reason Castle Rock sees on the item page;
 * "yes" → it stays on the owner's To animate list, not decided, for him to choose API credits or by hand.
 * The owner can put any item back on the list; an item he put back is never decided again here.
 *
 *   cd apps/marketing && KEYSTONE_PIPELINE_LIVE=1 KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:2710 \
 *   npx tsx --env-file=.env.local scripts/keystone-animated-triage.ts [--undecided | <itemId>…] [--reason-only] [--dry-run]
 *
 * --undecided    every item with a written solution, no animation and no decision yet.
 * --reason-only  for the named items already marked "No animation needed": write (or rewrite) the reason only.
 * --dry-run      prints the decisions; writes nothing. Production writes need Praveen's go.
 */
import { explicitTarget } from "../src/lib/keystone/dbtarget";

const argv = process.argv.slice(2);
const has = (n: string) => argv.includes(`--${n}`);
const given = argv.filter((a) => /^\d+$/.test(a));

async function main() {
  const dry = has("dry-run");
  if (dry) process.env.KEYSTONE_READONLY = "1";
  const { KEYSTONE_DB } = await import("../src/lib/keystone/config");
  console.log(explicitTarget(process.env, KEYSTONE_DB).line);
  const { ks, closeKs } = await import("../src/lib/keystone/db");
  const { triageItem } = await import("../src/lib/keystone/animated/triage");
  const { needsDecision, recordTriage } = await import("../src/lib/keystone/animreview/store");
  try {
    const { Item, Solution } = await ks();
    const ids = has("undecided") ? await needsDecision() : given;
    if (!ids.length) return console.log("Nothing to decide.");
    let total = 0;
    for (const itemId of ids) {
      const item = await Item.findOne({ itemId }).select("itemId subject course itemType questionHtml version animate").lean();
      const sol = item?.version ? await Solution.findOne({ itemId, version: item.version }).select("sections").lean() : null;
      if (!item || !sol) {
        console.log(`${itemId}: skipped (no item or no written solution)`);
        continue;
      }
      const reasonOnly = has("reason-only");
      if (reasonOnly && item.animate?.route !== "none") {
        console.log(`${itemId}: skipped (--reason-only is for items marked "No animation needed")`);
        continue;
      }
      const text = (h: string) => h.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const r = await triageItem(
        { subject: item.subject || "", course: item.course || "", itemType: item.itemType, questionText: text(item.questionHtml || ""), hasImages: /<img/i.test(item.questionHtml || ""), written: sol.sections.map((s) => `## ${s.kind}\n${s.md}`).join("\n\n") },
        {},
        reasonOnly ? "none" : undefined,
      );
      total += r.cost;
      if (!r.ok) {
        console.log(`${itemId}: NOT decided (${r.error})`);
        continue;
      }
      console.log(`${itemId}: ${r.animate ? "ANIMATE" : "no animation"} · ${r.reason}  ($${r.cost.toFixed(4)})`);
      if (!dry) await recordTriage(itemId, r.animate, r.reason, reasonOnly);
    }
    console.log(`\ntotal cost: $${total.toFixed(4)} over ${ids.length} item(s)${dry ? " (dry run: nothing written)" : ""}`);
  } finally {
    await closeKs();
  }
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
