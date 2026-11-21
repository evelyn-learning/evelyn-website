/**
 * Writes Evelyn's solution for an item that is already in Keystone and sends
 * it for review. The item's history (reviews, notes, versions) is kept.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:2710 [KEYSTONE_DATA_DIR=<local dir>] \
 *   npx tsx apps/marketing/scripts/keystone-solve.ts <itemId>.md [more.md …] [--revise] [--note "what changed"]
 *
 * The file is an item file (docs/whitelabel/castle-rock/keystone/FORMAT.md):
 * front matter with itemId and evelynAnswer (optional: topic, course, subject,
 * reviewNote) + the solution sections.
 *   - No "## Question": the question, options and key stay as they are (QTI items).
 *   - With "## Question" (+ "## Options"): the question is replaced too. For an
 *     item that reached us incomplete and was completed from the reviewer's
 *     note. Its images are copied into KEYSTONE_DATA_DIR (rsync to the box).
 * Refuses when our answer differs from their key, and when the item already
 * has a solution unless --revise (adds a new version).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { closeKs, ks } from "../src/lib/keystone/db";
import { parseItemFile } from "../src/lib/keystone/item-file";
import { saveSolution, type Actor } from "../src/lib/keystone/store";
import { saveAsset } from "../src/lib/keystone/assets";
import { renderInline, renderMarkdown } from "../src/lib/keystone/render";
import { KEYSTONE_DB } from "../src/lib/keystone/config";

const EVELYN: Actor = { username: "praveen", name: "Evelyn Learning", role: "evelyn" };
const norm = (s: string) => s.replace(/\s+/g, "").toUpperCase();

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error(`Set KEYSTONE_MONGODB_URI explicitly (database is always ${KEYSTONE_DB}).`);
  const noteAt = process.argv.indexOf("--note");
  const note = noteAt > 0 ? process.argv[noteAt + 1] : undefined;
  const files = process.argv.slice(2).filter((a, i) => !a.startsWith("--") && i + 2 !== noteAt + 1);
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
    if (parsed.questionMd) {
      const all = [parsed.questionMd, ...parsed.options.map((o) => o.md), ...parsed.sections.map((x) => x.md)].join("\n");
      const refs = new Set([...all.matchAll(/\]\((images\/[^)\s]+)\)/g)].map((x) => x[1]));
      if (refs.size && !process.env.KEYSTONE_DATA_DIR) throw new Error(`${m.itemId}: the question has images — set KEYSTONE_DATA_DIR and rsync it to the box afterwards.`);
      for (const ref of refs) await saveAsset(m.itemId, path.basename(ref), new Uint8Array(await readFile(path.join(path.dirname(file), ref))));
      const resolveImage = (src: string) => (/^(https?:|\/)/.test(src) ? src : `/api/keystone/asset/${m.itemId}/${path.basename(src)}`);
      set.questionMd = parsed.questionMd;
      set.questionHtml = renderMarkdown(parsed.questionMd, { resolveImage });
      set.options = parsed.options.map((o) => ({ label: o.label, md: o.md, html: renderInline(o.md, { resolveImage }) }));
    }
    await Item.updateOne({ itemId: m.itemId }, { $set: set });
    const version = await saveSolution(m.itemId, parsed.sections, EVELYN, {
      submit: true,
      note: note ?? (item.version ? undefined : "Solution written in the five-section layout."),
    });
    console.log(`${m.itemId}: version ${version} in review (${parsed.sections.map((s) => s.kind).join("/")})${parsed.questionMd ? " — question replaced" : ""}`);
  }
  await closeKs();
}

main().catch(async (e) => {
  console.error((e as Error).message);
  await closeKs();
  process.exit(1);
});
