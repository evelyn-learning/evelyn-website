/**
 * Keystone seed: creates the three sign-ins and loads the authored items.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:2710 \
 *   KEYSTONE_DATA_DIR=/root/keystone-data \
 *   npx tsx apps/marketing/scripts/keystone-seed.ts --items <dir> [--only 301823,234035] [--replace] [--users]
 *
 * --items    folder of <itemId>.md files (+ images/) — see docs/whitelabel/castle-rock/keystone/FORMAT.md
 * --replace  re-seed items that already exist (deletes their versions + activity first)
 * --users    create any missing users; prints each new password ONCE
 *
 * Refuses to run without KEYSTONE_MONGODB_URI set explicitly (laptop :2710 is the prod tunnel).
 */
import { readdir, readFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import bcrypt from "bcryptjs";
import { closeKs, ks } from "../src/lib/keystone/db";
import { parseItemFile } from "../src/lib/keystone/item-file";
import { saveAsset } from "../src/lib/keystone/assets";
import { renderInline, renderMarkdown } from "../src/lib/keystone/render";
import { log, saveSolution, type Actor } from "../src/lib/keystone/store";
import { KEYSTONE_DB } from "../src/lib/keystone/config";

// The order the 25 sample items came in (Castle Rock PDF, 2026-10-06).
const SAMPLE_ORDER = [
  "303439", "299122", "286312", "301833", "303445", "299378", "286340", "143341", "303448", "301823",
  "304746", "303101", "304631", "93953", "146440", "193246", "239622", "108415", "195885", "196083",
  "234035", "98186", "202286", "135676", "306073",
];

const USERS = [
  { username: "julie", name: "Julie May", role: "reviewer" as const },
  { username: "vance", name: "Vance Schamehorn", role: "tech" as const },
  { username: "praveen", name: "Praveen Tyagi", role: "evelyn" as const },
];

const EVELYN: Actor = { username: "praveen", name: "Evelyn Learning", role: "evelyn" };

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) {
    console.error("Set KEYSTONE_MONGODB_URI explicitly (database is always", KEYSTONE_DB + ").");
    process.exit(1);
  }
  console.log(`Target: ${process.env.KEYSTONE_MONGODB_URI.replace(/\/\/[^@]*@/, "//***@")} db=${KEYSTONE_DB}`);
  const models = await ks();

  if (flag("users")) {
    for (const u of USERS) {
      if (await models.User.exists({ username: u.username })) {
        console.log(`user ${u.username}: exists, unchanged`);
        continue;
      }
      const pw = process.env[`KEYSTONE_PW_${u.username.toUpperCase()}`] || randomBytes(9).toString("base64url");
      await models.User.create({ ...u, passwordHash: await bcrypt.hash(pw, 10) });
      console.log(`user ${u.username} (${u.role}) created — password: ${pw}`);
    }
  }

  const dir = arg("items");
  if (dir) {
    const only = arg("only")?.split(",");
    const files = (await readdir(dir)).filter((f) => /^\d+\.md$/.test(f));
    const ids = files.map((f) => f.replace(/\.md$/, ""));
    const ordered = [...SAMPLE_ORDER.filter((id) => ids.includes(id)), ...ids.filter((id) => !SAMPLE_ORDER.includes(id)).sort()];
    for (const id of ordered) {
      if (only && !only.includes(id)) continue;
      const parsed = parseItemFile(await readFile(path.join(dir, `${id}.md`), "utf8"));
      const m = parsed.meta;
      if (await models.Item.exists({ itemId: m.itemId })) {
        if (!flag("replace")) {
          console.log(`${m.itemId}: exists, skipped (use --replace)`);
          continue;
        }
        await models.Item.deleteOne({ itemId: m.itemId });
        await models.Solution.deleteMany({ itemId: m.itemId });
        await models.Activity.deleteMany({ itemId: m.itemId });
      }

      // Copy every image the item references into the asset store.
      const all = [parsed.questionMd, ...parsed.options.map((o) => o.md), ...parsed.sections.map((s) => s.md)].join("\n");
      for (const ref of new Set([...all.matchAll(/\]\((images\/[^)\s]+)\)/g)].map((x) => x[1]))) {
        const data = await readFile(path.join(dir, ref));
        await saveAsset(m.itemId, path.basename(ref), new Uint8Array(data));
      }
      const resolveImage = (src: string) =>
        /^(https?:|\/)/.test(src) ? src : `/api/keystone/asset/${m.itemId}/${path.basename(src)}`;

      const order = SAMPLE_ORDER.indexOf(m.itemId);
      await models.Item.create({
        itemId: m.itemId,
        subject: m.subject,
        course: m.course,
        grade: m.grade,
        itemType: m.itemType,
        topic: m.topic,
        standards: m.standards,
        key: m.key,
        evelynAnswer: m.evelynAnswer,
        keySource: m.keySource,
        questionMd: parsed.questionMd,
        questionHtml: renderMarkdown(parsed.questionMd, { resolveImage }),
        options: parsed.options.map((o) => ({ label: o.label, md: o.md, html: renderInline(o.md, { resolveImage }) })),
        stage: "received",
        version: 0,
        showcase: false,
        priorStatus: m.priorStatus,
        reviewNote: m.reviewNote,
        source: "sample",
        order: order >= 0 ? order + 1 : 1000,
      });
      await log({ itemId: m.itemId, type: "upload", body: "Question received (sample set of 25, October 2026).", ...EVELYN });

      const approvedBefore = m.priorStatus === "approved";
      await saveSolution(m.itemId, parsed.sections, EVELYN, {
        submit: true,
        stage: approvedBefore ? "approved" : "in_review",
        note: approvedBefore
          ? "Re-cut into the five-section layout from the solution Castle Rock approved on 28 October 2026."
          : "Solution written in the five-section layout.",
      });
      console.log(`${m.itemId}: seeded (${approvedBefore ? "approved" : "in review"}, ${parsed.sections.map((s) => s.kind).join("/")})`);
    }
  }
  await closeKs();
}

main().catch(async (e) => {
  console.error(e);
  await closeKs();
  process.exit(1);
});
