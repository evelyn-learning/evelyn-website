/**
 * Releases accepted animated solutions to Castle Rock for items whose written solution is already out:
 * the latest version's files become the item's player (the "Play animated solution" button on the item page)
 * and, with --to-review, an approved item goes back to "In review" with a note saying only the animation is new.
 *
 *   KEYSTONE_MONGODB_URI=… npx tsx apps/marketing/scripts/keystone-animated-release.ts --items 1,2,3 \
 *     [--to-review] [--by <username>] [--dry-run] [--host root@85.239.239.134]
 *
 * --dry-run prints what would happen; connects read-only and writes nothing. The copy happens on the box
 * (animated/v<N> → player; the folder it replaces is kept once as player.prev). Production writes need Praveen's go.
 */
import { execFileSync } from "node:child_process";
import { explicitTarget } from "../src/lib/keystone/dbtarget";

const BOX = "root@85.239.239.134";
const BOX_DATA = "/root/keystone-data";
export const ANIMATION_ADDED_NOTE = "An animated version has been added. The written solution is unchanged and was already approved; please review the animation (Play animated solution).";

const argv = process.argv.slice(2);
const has = (n: string) => argv.includes(`--${n}`);
const arg = (n: string) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

async function main() {
  const dry = has("dry-run");
  if (dry) process.env.KEYSTONE_READONLY = "1";
  const { KEYSTONE_DB } = await import("../src/lib/keystone/config");
  const target = explicitTarget(process.env, KEYSTONE_DB);
  const ids = (arg("items") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!ids.length || ids.some((i) => !/^\d+$/.test(i))) throw new Error("Usage: keystone-animated-release.ts --items id,id [--to-review] [--by name] [--dry-run]");
  const host = arg("host") ?? BOX;
  const by = arg("by") ?? "evelyn";
  const { ks, closeKs } = await import("../src/lib/keystone/db");
  const anim = await import("../src/lib/keystone/animreview/store");
  const { setStage } = await import("../src/lib/keystone/store");
  const actor = { username: by, name: "Evelyn Learning", role: "evelyn" as const };
  const onBox: import("../src/lib/keystone/animreview/store").PlayerCopy = async (itemId, version) => {
    const r = `${BOX_DATA}/assets/${itemId}`;
    execFileSync(
      "ssh",
      [host, `set -e; test -f ${r}/animated/v${version}/solution.html; rm -rf ${r}/player.next; cp -a ${r}/animated/v${version} ${r}/player.next; if [ -e ${r}/player ]; then rm -rf ${r}/player.prev; mv ${r}/player ${r}/player.prev; fi; mv ${r}/player.next ${r}/player`],
      { stdio: "inherit" },
    );
  };
  try {
    console.log(target.line);
    const { Animation, Item } = await ks();
    for (const itemId of ids) {
      const item = await Item.findOne({ itemId }).select("stage version releasedVersion player").lean();
      const a = await Animation.findOne({ itemId }).sort({ version: -1 }).lean();
      if (!item || !a) {
        console.log(`${itemId}: skipped (${!item ? "no such item" : "no animation"})`);
        continue;
      }
      const open = await anim.openFlagCount(itemId, a.version);
      const move = has("to-review") && item.stage === "approved";
      console.log(`${itemId}: animation v${a.version} (${a.status}, ${open} open flag(s)); item is ${item.stage}${move ? " → in_review" : ""}`);
      if (a.status !== "accepted" && a.status !== "released") {
        console.log(`  skipped: v${a.version} is not accepted yet`);
        continue;
      }
      if (dry) continue;
      const r = await anim.releaseAnimation(itemId, onBox);
      if ("error" in r) {
        console.log(`  NOT released: ${r.error}`);
        continue;
      }
      if (move) {
        await Item.updateOne({ itemId, stage: "approved" }, { $set: { reviewNote: ANIMATION_ADDED_NOTE } });
        await setStage(itemId, "in_review", actor, ANIMATION_ADDED_NOTE);
      }
      console.log(`  ${r.ok ? `released v${r.ok.version}` : "already released"}${move ? "; now in review" : ""}`);
    }
    if (dry) console.log("Dry run: nothing copied, nothing written.");
  } finally {
    await closeKs();
  }
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
