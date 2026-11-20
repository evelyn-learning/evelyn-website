/**
 * Publishes a built animated solution as the item's next version for Praveen's review on Keystone:
 * copies the built folder (solution.html + audio/) to <data>/assets/<itemId>/animated/v<N>/ on the box,
 * then inserts the `animations` row (N = last + 1, status "review") and marks the flags it addresses
 * fixed in vN with the fixer's reply.
 *
 *   KEYSTONE_MONGODB_URI=… npx tsx apps/marketing/scripts/keystone-animated-publish.ts <outDir> --item <id> \
 *     [--addresses flagId,flagId] [--reply "flagId=what was changed"]… [--height 1100] [--voice "Mr. Joseph"] \
 *     [--notes "…"] [--by <username>] [--dry-run] [--host root@85.239.239.134] [--local]
 *
 * --dry-run   prints the version, the copy and the flag updates; connects read-only and writes nothing.
 * --local     copies into this machine's KEYSTONE_DATA_DIR (or ~/keystone-data) instead of rsync to the box.
 * KEYSTONE_MONGODB_URI must be set explicitly (MONGODB_URI is never used). Production writes need Praveen's go.
 */
import { execFileSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { explicitTarget } from "../src/lib/keystone/dbtarget";

const BOX = "root@85.239.239.134";
const BOX_DATA = "/root/keystone-data";

const argv = process.argv.slice(2);
const has = (n: string) => argv.includes(`--${n}`);
const arg = (n: string) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const all = (n: string) => argv.flatMap((a, i) => (a === `--${n}` && argv[i + 1] !== undefined ? [argv[i + 1]] : []));
const VALUED = new Set(["item", "addresses", "reply", "height", "voice", "notes", "by", "host"]);
const positional = argv.filter((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--") && VALUED.has(argv[i - 1].slice(2))));

async function main() {
  const dry = has("dry-run");
  if (dry) process.env.KEYSTONE_READONLY = "1"; // before the first connection: no index build, every write refused
  const { KEYSTONE_DB } = await import("../src/lib/keystone/config");
  const target = explicitTarget(process.env, KEYSTONE_DB);
  const outDir = positional[0];
  const itemId = arg("item") ?? "";
  if (!outDir || !/^\d+$/.test(itemId)) throw new Error("Usage: keystone-animated-publish.ts <outDir> --item <id> [--addresses …] [--reply flagId=text]… [--dry-run]");
  const entry = "solution.html";
  if (!(await stat(path.join(outDir, entry)).catch(() => null))?.isFile()) throw new Error(`${outDir}/${entry} not found`);
  const { parseReplies } = await import("../src/lib/keystone/animreview/pure");
  const { replies, errors } = parseReplies(all("reply"));
  if (errors.length) throw new Error(errors.join("\n"));
  const addresses = (arg("addresses") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  // The build being published must be this item's: the folder is named after the item, and its spec (when the
  // build left one beside the page) names the same item. A typo in --item must not publish under another item.
  let builtSpec: { voice?: string; itemId?: string } = {};
  try {
    builtSpec = JSON.parse(await readFile(path.join(outDir, "spec.json"), "utf8"));
  } catch {}
  const folder = path.basename(path.resolve(outDir));
  if (folder !== itemId || (builtSpec.itemId !== undefined && String(builtSpec.itemId) !== itemId)) {
    throw new Error(`Refusing to publish: --item ${itemId} but the build folder is "${folder}"${builtSpec.itemId !== undefined ? ` and its spec says item ${builtSpec.itemId}` : ""}`);
  }
  const voice = arg("voice") ?? builtSpec.voice;
  const height = Number(arg("height") ?? "1100");
  if (!Number.isFinite(height) || height < 200 || height > 6000) throw new Error("--height must be a number of pixels (200–6000)");

  const { closeKs } = await import("../src/lib/keystone/db");
  const store = await import("../src/lib/keystone/animreview/store");
  try {
    console.log(target.line);
    const plan = await store.planPublish({ itemId, addresses, replies });
    if (plan.errors.length) throw new Error(`Refusing to publish:\n  ${plan.errors.join("\n  ")}`);
    const v = plan.version;
    const local = has("local");
    const host = arg("host") ?? BOX;
    const destRel = path.posix.join("assets", itemId, "animated", `v${v}`);
    const { DATA_DIR } = await import("../src/lib/keystone/assets");
    const dest = local ? path.join(DATA_DIR, destRel) : `${host}:${BOX_DATA}/${destRel}/`;
    console.log(`Item ${itemId}: publish as v${v} (status review, height ${height}${voice ? `, voice ${voice}` : ""})`);
    console.log(`Copy ${path.resolve(outDir)}/ → ${dest}`);
    for (const f of plan.addresses) console.log(`Mark fixed in v${v}: ${f.id} (v${f.version}, ${f.comment.slice(0, 80).replace(/\s+/g, " ")})${replies[f.id] ? ` — reply: ${replies[f.id]}` : " — no reply"}`);
    if (dry) {
      console.log("Dry run: nothing copied, nothing written.");
      return;
    }

    if (local) {
      await (await import("../src/lib/keystone/animated/output")).placeBuilt(outDir, dest);
    } else {
      // Copied beside the final folder first (vN.tmp, reused and brought up to date by a retry), and moved into
      // place only after the row is written: a copy that fails part-way never leaves a vN that blocks the next try.
      execFileSync("ssh", [host, `test ! -e ${BOX_DATA}/${destRel} && mkdir -p ${BOX_DATA}/${destRel}.tmp`], { stdio: "inherit" });
      execFileSync("rsync", ["-a", "--no-links", "--delete", "--exclude", "spec.json", "--exclude", "shots/", `${path.resolve(outDir)}/`, `${host}:${BOX_DATA}/${destRel}.tmp/`], { stdio: "inherit" });
    }
    const r = await store.recordPublish({ itemId, entry, height, voice, notes: arg("notes"), addresses, replies, createdBy: arg("by") ?? "evelyn" }, v);
    if ("error" in r) throw new Error(`Files copied${local ? "" : ` to ${destRel}.tmp`} but the row was not written: ${r.error}`);
    if (!local) {
      try {
        execFileSync("ssh", [host, `test ! -e ${BOX_DATA}/${destRel} && mv ${BOX_DATA}/${destRel}.tmp ${BOX_DATA}/${destRel}`], { stdio: "inherit" });
      } catch {
        throw new Error(`The row for v${v} is written but the files are still at ${BOX_DATA}/${destRel}.tmp on ${host}. Move them into place:\n  ssh ${host} 'mv ${BOX_DATA}/${destRel}.tmp ${BOX_DATA}/${destRel}'`);
      }
    }
    console.log(`Published item ${itemId} v${r.ok.version}; ${r.ok.fixed} flag(s) marked fixed.`);
  } finally {
    await closeKs();
  }
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
