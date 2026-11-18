/**
 * Read-only: the open flags on the animated solutions (all items or one), with step, line, time and comment,
 * and their pictures pulled into --out so a session can look at them. Never writes to the database.
 *
 *   KEYSTONE_MONGODB_URI=… npx tsx apps/marketing/scripts/keystone-animated-flags.ts [--item <id>] [--out <dir>] \
 *     [--host root@85.239.239.134] [--local]
 *
 * Pictures come from the box over scp (default) or, with --local, from this machine's KEYSTONE_DATA_DIR.
 * Without --out no picture is fetched; the list says where each one is.
 */
import { execFileSync } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { explicitTarget } from "../src/lib/keystone/dbtarget";

process.env.KEYSTONE_READONLY = "1"; // before the first connection: no index build, every write refused

const BOX = "root@85.239.239.134";
const BOX_DATA = "/root/keystone-data";
const argv = process.argv.slice(2);
const arg = (n: string) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

async function main() {
  const { KEYSTONE_DB } = await import("../src/lib/keystone/config");
  const target = explicitTarget(process.env, KEYSTONE_DB);
  const item = arg("item");
  if (item !== undefined && !/^\d+$/.test(item)) throw new Error("--item must be a numeric item id");
  const out = arg("out");
  const local = argv.includes("--local");
  const host = arg("host") ?? BOX;
  const { closeKs, ks } = await import("../src/lib/keystone/db");
  const { openFlags } = await import("../src/lib/keystone/animreview/store");
  const { clock, where } = await import("../src/lib/keystone/animreview/pure");
  const { DATA_DIR } = await import("../src/lib/keystone/assets");
  try {
    console.log(target.line);
    const flags = await openFlags(item);
    const { AnimFlag } = await ks();
    if (!flags.length) console.log(item ? `No open flag on item ${item}.` : "No open flag.");
    let lastItem = "";
    for (const f of flags) {
      if (f.itemId !== lastItem) console.log(`\nItem ${(lastItem = f.itemId)}`);
      console.log(`  ${f.id}  v${f.version}  ${where(f.step, f.line)}  ${clock(f.timeMs)}${f.spoken ? "  (spoken)" : ""}`);
      for (const l of (f.comment || "(no comment)").split("\n")) console.log(`      ${l}`);
      if (f.reopenOf) {
        const old = await AnimFlag.findById(f.reopenOf).lean();
        if (old) console.log(`      reopens ${f.reopenOf} (v${old.version}): ${old.comment.replace(/\s+/g, " ").slice(0, 160)}${old.reply ? ` — fix was: ${old.reply}` : ""}`);
      }
      if (!f.shots.length) continue;
      if (!out) {
        console.log(`      pictures: ${f.shots.map((s) => `animflags/${f.id}/${s}`).join(", ")} (use --out to fetch)`);
        continue;
      }
      const dir = path.join(out, f.itemId, f.id);
      await mkdir(dir, { recursive: true });
      for (const s of f.shots) {
        const to = path.join(dir, s);
        try {
          if (local) await copyFile(path.join(DATA_DIR, "animflags", f.id, s), to);
          else execFileSync("scp", ["-q", `${host}:${BOX_DATA}/animflags/${f.id}/${s}`, to], { stdio: "inherit" });
          console.log(`      picture: ${path.resolve(to)}`);
        } catch (e) {
          console.log(`      picture ${s}: could not fetch (${(e as Error).message.split("\n")[0]})`);
        }
      }
    }
  } finally {
    await closeKs();
  }
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
