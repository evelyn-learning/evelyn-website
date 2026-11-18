// Database test for the outbox. Run: KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test; deletes only suggestions whose batchId starts "dbtest-outbox-".
import assert from "node:assert/strict";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`outbox.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
process.env.KEYSTONE_DB_NAME = "castle_rock_review_test";

(async () => {
  const { ks, closeKs } = await import("../db");
  const { suggest, openSuggestions, markDrafted } = await import("./outbox");
  const { Outbox } = await ks();
  assert.equal(Outbox.db.name, "castle_rock_review_test", "must run against the test database");
  const clean = () => Outbox.deleteMany({ batchId: /^dbtest-outbox-/ });
  const mine = async () => (await openSuggestions()).filter((s) => s.batchId?.startsWith("dbtest-outbox-"));
  const base = { kind: "keys_queried" as const, to: ["julie" as const], subject: "s", bodyMd: "b", itemIds: [] as string[] };
  await clean();
  try {
    await suggest({ ...base, batchId: "dbtest-outbox-1", itemIds: ["1", "2"] });
    await suggest({ ...base, to: ["vance"], subject: "s2", bodyMd: "b2", batchId: "dbtest-outbox-1", itemIds: ["2", "3"] });
    let open = await mine();
    assert.equal(open.length, 1);
    assert.deepEqual(open[0].itemIds, ["1", "2", "3"]);
    assert.deepEqual([...open[0].to].sort(), ["julie", "vance"]);
    assert.equal(open[0].subject, "s2");
    assert.equal(open[0].bodyMd, "b2");
    assert.equal(typeof (open[0] as { id?: string }).id, "string");

    // different batch -> separate
    await suggest({ ...base, batchId: "dbtest-outbox-2", itemIds: ["9"] });
    assert.equal((await mine()).length, 2);

    // drafted is not merged into
    const id = (open[0] as unknown as { id: string }).id;
    await markDrafted(id);
    const first = (await Outbox.findById(id).lean())!.draftedAt!;
    assert.ok(first);
    await new Promise((r) => setTimeout(r, 15));
    await markDrafted(id);
    assert.equal((await Outbox.findById(id).lean())!.draftedAt!.getTime(), first.getTime());
    await suggest({ ...base, batchId: "dbtest-outbox-1", itemIds: ["7"] });
    open = await mine();
    assert.equal(open.length, 2);
    assert.equal(await Outbox.countDocuments({ batchId: "dbtest-outbox-1" }), 2);

    // concurrent
    await Promise.all([
      suggest({ ...base, batchId: "dbtest-outbox-3", itemIds: ["a", "b"] }),
      suggest({ ...base, batchId: "dbtest-outbox-3", itemIds: ["c", "d"] }),
    ]);
    const c = (await mine()).filter((s) => s.batchId === "dbtest-outbox-3");
    assert.equal(c.length, 1);
    assert.deepEqual([...c[0].itemIds].sort(), ["a", "b", "c", "d"]);

    await assert.rejects(() => markDrafted("64b64b64b64b64b64b64b64b"), /suggestion not found/);
    await assert.rejects(() => markDrafted("not-an-id"), /suggestion not found/);
    console.log("outbox.dbtest ok");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => { console.error(e); process.exit(1); });
