/**
 * Attaches an animated (voiced) player to a Keystone item: copies a folder
 * (entry html + audio/ etc.) into <data>/assets/<itemId>/player/ and records it
 * on the item. Run where KEYSTONE_DATA_DIR is the box's data dir, or copy the
 * data dir up afterwards (rsync), as with the seed.
 *
 *   KEYSTONE_MONGODB_URI=… KEYSTONE_DATA_DIR=… npx tsx apps/marketing/scripts/keystone-attach-player.ts \
 *     <itemId> <folder> [--entry solution.html] [--voice "Mr. Joseph"] [--height 620] [--note "…"]
 */
import { cp, rm, stat } from "node:fs/promises";
import path from "node:path";
import { closeKs, ks } from "../src/lib/keystone/db";
import { DATA_DIR } from "../src/lib/keystone/assets";

const arg = (n: string, d?: string) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > 0 ? process.argv[i + 1] : d;
};

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error("Set KEYSTONE_MONGODB_URI explicitly.");
  const [itemId, folder] = process.argv.slice(2);
  if (!/^\d+$/.test(itemId ?? "") || !folder) throw new Error("Usage: keystone-attach-player.ts <itemId> <folder> [--entry …]");
  const entry = arg("entry", "solution.html")!;
  await stat(path.join(folder, entry));
  const { Item } = await ks();
  if (!(await Item.exists({ itemId }))) throw new Error(`item ${itemId} not found`);
  const dest = path.join(DATA_DIR, "assets", itemId, "player");
  await rm(dest, { recursive: true, force: true });
  await cp(folder, dest, { recursive: true });
  await Item.updateOne(
    { itemId },
    { $set: { player: { entry, voice: arg("voice"), height: Number(arg("height", "620")), note: arg("note"), attachedAt: new Date() } } },
  );
  console.log(`${itemId}: player attached (${entry}) → ${dest}`);
  await closeKs();
}

main().catch(async (e) => {
  console.error(e);
  await closeKs();
  process.exit(1);
});
