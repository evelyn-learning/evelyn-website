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
  const { suggestFor, resetOutboxInit } = await import("./outbox");
  const { Outbox } = await ks();
  assert.equal(Outbox.db.name, "castle_rock_review_test", "must run against the test database");
  const clean = () => Outbox.deleteMany({ $or: [{ batchId: /^dbtest-outbox-/ }, { openKey: /^[a-z_]+\|-$/, subject: /^dbtest-nobatch/ }, { subject: /^dbtest-nobatch/ }] });
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

    // markDrafted splits late additions into a fresh open suggestion
    await suggest({ ...base, kind: "items_need_data", subject: "x", batchId: "dbtest-outbox-4", itemIds: ["1", "2"], to: ["vance"] });
    const row4 = (await mine()).find((s) => s.batchId === "dbtest-outbox-4")!;
    await suggestFor("items_need_data", { itemIds: ["3"] }, "dbtest-outbox-4");
    const res = await markDrafted(row4.id, ["1", "2"]);
    assert.deepEqual(res, { leftOpen: ["3"] });
    const done = (await Outbox.findById(row4.id).lean())!;
    assert.deepEqual(done.itemIds, ["1", "2"]);
    assert.ok(done.draftedAt);
    const rest = (await mine()).filter((s) => s.batchId === "dbtest-outbox-4");
    assert.equal(rest.length, 1);
    assert.deepEqual(rest[0].itemIds, ["3"]);
    assert.match(rest[0].subject, /^1 item needs/);
    assert.deepEqual(await markDrafted(row4.id, []), { leftOpen: [] });

    // suggestFor: subject describes the full set
    await suggestFor("items_need_data", { itemIds: ["1"] }, "dbtest-outbox-5");
    await suggestFor("items_need_data", { itemIds: ["2"] }, "dbtest-outbox-5");
    let r5 = (await mine()).filter((s) => s.batchId === "dbtest-outbox-5");
    assert.equal(r5.length, 1);
    assert.deepEqual(r5[0].itemIds, ["1", "2"]);
    assert.equal(r5[0].subject, "2 items need their question data re-sent");
    assert.match(r5[0].bodyMd, /1, 2/);
    await Promise.all(["a", "b", "c"].map((i) => suggestFor("items_need_data", { itemIds: [i] }, "dbtest-outbox-6")));
    const r6 = (await mine()).filter((s) => s.batchId === "dbtest-outbox-6");
    assert.equal(r6.length, 1);
    assert.equal(r6[0].itemIds.length, 3);
    assert.equal(r6[0].subject, `${r6[0].itemIds.length} items need their question data re-sent`);
    await assert.rejects(() => suggestFor("keys_queried", { itemIds: [] }, "dbtest-outbox-6"), /no items to mention/);

    // no batchId merges; empty string rejected
    await suggest({ ...base, kind: "sample_requested", subject: "dbtest-nobatch", itemIds: [] });
    await suggest({ ...base, kind: "sample_requested", subject: "dbtest-nobatch", itemIds: [] });
    assert.equal(await Outbox.countDocuments({ kind: "sample_requested", batchId: { $exists: false }, draftedAt: { $exists: false } }), 1);
    await assert.rejects(() => suggest({ ...base, batchId: "" }), /batchId must not be empty/);
    await assert.rejects(() => suggestFor("batch_received", { batchName: "x", count: 1 }, ""), /batchId must not be empty/);

    await assert.rejects(() => markDrafted("64b64b64b64b64b64b64b64b"), /suggestion not found/);
    await assert.rejects(() => markDrafted("not-an-id"), /suggestion not found/);
    console.log("outbox.dbtest ok");
  } finally {
    await clean();
    await closeKs();
    resetOutboxInit();
  }
})().catch((e) => { console.error(e); process.exit(1); });
