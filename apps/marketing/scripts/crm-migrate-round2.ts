// One-off round-2 migration (spec §9). Idempotent: safe to re-run.
//   1. copy opportunities[0].product -> product when product is empty
//   2. $unset opportunities on every lead
//   3. drop the leads index opportunities.product_1_opportunities.stage_1
//   4. drop the pipelineconfigs collection
// Dry-run unless --apply.
//
// Usage (run on the host, after the deploy):
//   MONGODB_URI=... npx tsx scripts/crm-migrate-round2.ts            # dry run
//   MONGODB_URI=... npx tsx scripts/crm-migrate-round2.ts --apply    # write
import mongoose from "mongoose";
import { connectDB } from "@core/db";
import { Lead } from "@/models";

const apply = process.argv.includes("--apply");

const DEAD_INDEX = "opportunities.product_1_opportunities.stage_1";
const DEAD_COLLECTION = "pipelineconfigs";

(async () => {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("no mongoose connection database handle");

  // Read through the raw collection: `opportunities` is no longer in the
  // Mongoose schema, so a lean() projection on the model would strip it.
  const leads = db.collection("leads");

  const withOpps = await leads.countDocuments({ opportunities: { $exists: true } });
  const carryable = await leads
    .find(
      {
        "opportunities.0.product": { $exists: true, $nin: ["", null] },
        $or: [{ product: { $exists: false } }, { product: "" }, { product: null }],
      },
      { projection: { _id: 1, company: 1, opportunities: 1 } }
    )
    .toArray();

  console.log(`leads with an opportunities field: ${withOpps}`);
  console.log(`leads whose product can be carried over: ${carryable.length}`);
  for (const l of carryable.slice(0, 20)) {
    const opps = l.opportunities as { product?: string }[] | undefined;
    console.log(`  ${String(l._id)} ${String(l.company)} -> product=${opps?.[0]?.product}`);
  }

  const indexes = await leads.indexes();
  const hasDeadIndex = indexes.some((i) => i.name === DEAD_INDEX);
  const collections = await db.listCollections().toArray();
  const hasDeadCollection = collections.some((c) => c.name === DEAD_COLLECTION);
  console.log(`dead index present: ${hasDeadIndex}`);
  console.log(`${DEAD_COLLECTION} collection present: ${hasDeadCollection}`);

  if (!apply) {
    console.log("DRY RUN — nothing written. Re-run with --apply.");
    await mongoose.connection.close();
    process.exit(0);
  }

  let carried = 0;
  for (const l of carryable) {
    const opps = l.opportunities as { product?: string }[] | undefined;
    const product = opps?.[0]?.product;
    if (!product) continue;
    await leads.updateOne({ _id: l._id }, { $set: { product } });
    carried++;
  }

  const unset = await leads.updateMany(
    { opportunities: { $exists: true } },
    { $unset: { opportunities: "" } }
  );

  if (hasDeadIndex) await leads.dropIndex(DEAD_INDEX);
  if (hasDeadCollection) await db.collection(DEAD_COLLECTION).drop();

  // Prove the end state rather than trusting the writes above.
  const leftover = await leads.countDocuments({ opportunities: { $exists: true } });
  console.log(
    `APPLIED: products carried ${carried}, opportunities unset on ${unset.modifiedCount}, ` +
      `dead index dropped ${hasDeadIndex}, ${DEAD_COLLECTION} dropped ${hasDeadCollection}, ` +
      `leads still carrying opportunities ${leftover}`
  );
  if (leftover !== 0) {
    console.error("FAILED: some leads still carry an opportunities field");
    await mongoose.connection.close();
    process.exit(1);
  }
  // Sanity: how many leads ended up with a product at all.
  console.log(`leads with a non-empty product: ${await Lead.countDocuments({ product: { $nin: ["", null] } })}`);
  await mongoose.connection.close();
  process.exit(0);
})();
