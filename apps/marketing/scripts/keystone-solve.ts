/**
 * Writes Evelyn's solution for an item whose question is already in Keystone
 * (it arrived as a QTI upload) and sends it for review.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:2710 \
 *   npx tsx apps/marketing/scripts/keystone-solve.ts <itemId>.md [more.md …] [--revise]
 *
 * The file is a solution-only item file (docs/whitelabel/castle-rock/keystone/FORMAT.md):
 * front matter with itemId and evelynAnswer (optional: topic, course, subject,
 * reviewNote) + the solution sections, no Question. The question, options and
 * key stay as uploaded. Refuses when our answer differs from their key, and
 * when the item already has a solution unless --revise (adds a new version).
 */
import { readFile } from "node:fs/promises";
import { closeKs, ks } from "../src/lib/keystone/db";
import { parseItemFile } from "../src/lib/keystone/item-file";
import { saveSolution, type Actor } from "../src/lib/keystone/store";
import { KEYSTONE_DB } from "../src/lib/keystone/config";

const EVELYN: Actor = { username: "praveen", name: "Evelyn Learning", role: "evelyn" };
const norm = (s: string) => s.replace(/\s+/g, "").toUpperCase();

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error(`Set KEYSTONE_MONGODB_URI explicitly (database is always ${KEYSTONE_DB}).`);
  const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const revise = process.argv.includes("--revise");
  if (!files.length) throw new Error("Usage: keystone-solve.ts <itemId>.md [more.md …] [--revise]");
  const { Item } = await ks();

  for (const file of files) {
    const parsed = parseItemFile(await readFile(file, "utf8"), { questionOptional: true });
    const m = parsed.meta;
    const item = await Item.findOne({ itemId: m.itemId }).lean();
    if (!item) throw new Error(`${m.itemId}: not in Keystone — upload its QTI zip first.`);
    if (!parsed.sections.length) throw new Error(`${m.itemId}: no solution sections in ${file}`);
    if (!m.evelynAnswer) throw new Error(`${m.itemId}: evelynAnswer missing in front matter`);
    if (item.key && norm(item.key) !== norm(m.evelynAnswer)) {
      throw new Error(`${m.itemId}: our answer ${m.evelynAnswer} differs from their key ${item.key} — resolve before sending for review.`);
    }
    if (item.version > 0 && !revise) {
      console.log(`${m.itemId}: already has version ${item.version}, skipped (use --revise)`);
      continue;
    }
    const set: Record<string, unknown> = { evelynAnswer: m.evelynAnswer, reviewNote: m.reviewNote ?? "" };
    if (m.topic) set.topic = m.topic;
    if (m.course) set.course = m.course;
    if (m.subject) set.subject = m.subject;
    await Item.updateOne({ itemId: m.itemId }, { $set: set });
    const version = await saveSolution(m.itemId, parsed.sections, EVELYN, {
      submit: true,
      note: item.version ? undefined : "Solution written in the five-section layout.",
    });
    console.log(`${m.itemId}: version ${version} in review (${parsed.sections.map((s) => s.kind).join("/")})`);
  }
  await closeKs();
}

main().catch(async (e) => {
  console.error((e as Error).message);
  await closeKs();
  process.exit(1);
});
