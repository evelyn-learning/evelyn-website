/**
 * Removes one Keystone item with its versions, history and asset folder
 * (used to clear end-to-end test items). Not exposed in the UI by design.
 *
 *   KEYSTONE_MONGODB_URI=… [KEYSTONE_DATA_DIR=…] npx tsx apps/marketing/scripts/keystone-remove-item.ts 146799 [--uploads-by praveen]
 */
import { rm } from "node:fs/promises";
import path from "node:path";
import { closeKs, ks } from "../src/lib/keystone/db";
import { DATA_DIR } from "../src/lib/keystone/assets";

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error("Set KEYSTONE_MONGODB_URI explicitly.");
  const id = process.argv[2];
  if (!/^\d+$/.test(id ?? "")) throw new Error("Usage: keystone-remove-item.ts <itemId>");
  const { Item, Solution, Activity, Upload } = await ks();
  const r = await Promise.all([
    Item.deleteOne({ itemId: id }),
    Solution.deleteMany({ itemId: id }),
    Activity.deleteMany({ itemId: id }),
  ]);
  const i = process.argv.indexOf("--uploads-by");
  const up = i > 0 ? await Upload.deleteMany({ username: process.argv[i + 1], itemIds: id }) : { deletedCount: 0 };
  await rm(path.join(DATA_DIR, "assets", id), { recursive: true, force: true });
  console.log(`item ${id}: items ${r[0].deletedCount}, versions ${r[1].deletedCount}, activity ${r[2].deletedCount}, upload rows ${up.deletedCount}`);
  await closeKs();
}

main().catch(async (e) => {
  console.error(e);
  await closeKs();
  process.exit(1);
});
