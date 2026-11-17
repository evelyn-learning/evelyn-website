/**
 * One-off backfill for "hidden until released" (2026-11-17): everything that
 * existed before counts as released. Sets releasedAt = createdAt on every
 * solution version that has none, and releasedVersion = version on every item
 * that has none. Prints counts; safe to run twice (the second run changes 0).
 *
 *   KEYSTONE_MONGODB_URI=mongodb://… npx tsx apps/marketing/scripts/keystone-backfill-released.ts
 */
import { closeKs, ks } from "../src/lib/keystone/db";
import { KEYSTONE_DB } from "../src/lib/keystone/config";

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error(`Set KEYSTONE_MONGODB_URI explicitly (database is always ${KEYSTONE_DB}).`);
  const { Item, Solution } = await ks();
  const sols = await Solution.updateMany({ releasedAt: { $exists: false } }, [{ $set: { releasedAt: "$createdAt" } }]);
  const items = await Item.updateMany({ releasedVersion: { $exists: false } }, [{ $set: { releasedVersion: "$version" } }]);
  console.log(`solutions: ${sols.modifiedCount} given releasedAt (${await Solution.countDocuments()} in all)`);
  console.log(`items: ${items.modifiedCount} given releasedVersion (${await Item.countDocuments()} in all)`);
  await closeKs();
}

main().catch(async (e) => {
  console.error((e as Error).message);
  await closeKs();
  process.exit(1);
});
