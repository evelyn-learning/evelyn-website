/**
 * The API-credits route, end to end, for the items the owner queued on the dashboard ("Build with API credits")
 * or the ids given: author (model calls) → record the voice → build → check at three screen sizes → publish
 * as the next version for the owner's review. An item that fails any step is left for the by-hand route
 * (its draft, if any, is under <animated-src>/_failed/<id>/) and the run goes on to the next item.
 *
 *   cd apps/marketing && KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:2710 \
 *   npx tsx --env-file=.env.local scripts/keystone-animated-run.ts [--queued | <itemId>…] [--by praveen] [--max-cost 6] [--no-voice] [--dry-run]
 *
 * Since the server builds queued items by itself (src/lib/keystone/animated/serverbuild.ts, started by the button
 * and the hourly cron), this laptop run is for when that is switched off (KEYSTONE_ANIM_SERVER_BUILD=off) or for
 * ids given by hand. Do not run it with --queued against a server whose own build is on: both would build.
 *
 * --dry-run   lists the items and what would run; no model call, no recording, no write.
 * --no-voice  stops after the build and the screen check (nothing recorded, nothing published).
 * Spends API credits and voice characters, and writes to the database it is pointed at: production needs Praveen's go.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC = "/Users/luke/Dev/evelynlearning/docs/whitelabel/castle-rock/keystone/animated-src";
const OUT = "/Users/luke/Dev/evelynlearning/docs/whitelabel/castle-rock/keystone/animated-out";
const argv = process.argv.slice(2);
const has = (n: string) => argv.includes(`--${n}`);
const arg = (n: string) => (argv.indexOf(`--${n}`) >= 0 ? argv[argv.indexOf(`--${n}`) + 1] : undefined);
const VALUED = new Set(["by", "max-cost"]);
const given = argv.filter((a, i) => /^\d+$/.test(a) && !(i > 0 && VALUED.has(argv[i - 1].slice(2))));

function step(label: string, script: string, args: string[], env: Record<string, string> = {}): boolean {
  console.log(`  ${label}…`);
  const r = spawnSync("npx", ["tsx", "--env-file=.env.local", `scripts/${script}`, ...args], { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", env: { ...process.env, ...env } });
  const tail = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim().split("\n").slice(-3).join("\n    ");
  console.log(`    ${tail}`);
  return r.status === 0;
}

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error("Set KEYSTONE_MONGODB_URI explicitly.");
  let ids = given;
  if (has("queued")) {
    process.env.KEYSTONE_READONLY = "1";
    const { queuedForApi } = await import("../src/lib/keystone/animreview/store");
    const { closeKs } = await import("../src/lib/keystone/db");
    ids = await queuedForApi();
    await closeKs();
    delete process.env.KEYSTONE_READONLY;
  }
  if (!ids.length) return console.log("Nothing to build: no item is queued for API credits.");
  console.log(`Items: ${ids.join(", ")}`);
  if (has("dry-run")) return console.log("Dry run: author → record → build → check → publish would run for each. Nothing done.");
  const done: string[] = [];
  const failed: string[] = [];
  for (const id of ids) {
    console.log(`Item ${id}`);
    const src = path.join(SRC, id);
    const ok =
      (existsSync(path.join(src, "spec.json")) || step("author", "keystone-animated-author.ts", [id, "--max-cost", arg("max-cost") ?? "6"], { KEYSTONE_PIPELINE_LIVE: "1" })) &&
      existsSync(path.join(src, "spec.json")) &&
      (has("no-voice") || step("record the voice", "keystone-animated-record.ts", [src, "--live"])) &&
      step("build", "keystone-animated-build.ts", [src]) &&
      step("check three screen sizes", "keystone-animated-verify.ts", [path.join(OUT, id)]) &&
      (has("no-voice") || step("publish for review", "keystone-animated-publish.ts", [path.join(OUT, id), "--item", id, "--by", arg("by") ?? "pipeline"]));
    (ok ? done : failed).push(id);
  }
  console.log(`\nBuilt${has("no-voice") ? " (no voice, not published)" : " and published for review"}: ${done.join(", ") || "none"}`);
  if (failed.length) console.log(`Left for the by-hand route: ${failed.join(", ")}`);
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
