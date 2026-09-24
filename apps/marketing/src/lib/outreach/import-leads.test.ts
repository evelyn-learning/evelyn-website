import { strict as assert } from "node:assert";
import { sanitizeLeadRow, validateLeadRows, insertLeads, type InsertLeadsDeps } from "./import-leads";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const goodRow = () => ({
  company: "Acme Nursing College",
  segment: "nursing_program",
  about: "A nursing school",
  whyFit: "NCLEX prep at scale",
  useCaseHypothesis: "Tutor for NCLEX drill",
  decisionMaker: { name: "Dana Smith", title: "Dean", email: "dsmith@acme.edu", emailVerified: true },
  website: "https://acme.edu",
  source: "test",
});

(async () => {
  await test("sanitizeLeadRow strips runtime fields", () => {
    const r = sanitizeLeadRow({
      ...goodRow(),
      status: "contacted", demoToken: "x", gmailThreadIds: ["t"], touches: [{}], demoVisits: [{}],
      currentDraft: { channel: "email", body: "hi", gmailDraftId: "d1", gmailThreadId: "t1" },
    });
    assert.equal(r.status, undefined);
    assert.equal(r.demoToken, undefined);
    assert.equal(r.gmailThreadIds, undefined);
    assert.equal(r.touches, undefined);
    assert.equal(r.demoVisits, undefined);
    const draft = r.currentDraft as Record<string, unknown>;
    assert.equal(draft.body, "hi");
    assert.equal(draft.gmailDraftId, undefined);
    assert.equal(draft.gmailThreadId, undefined);
  });

  await test("validateLeadRows: valid row becomes staged doc", () => {
    const { docs, counts } = validateLeadRows([goodRow()]);
    assert.equal(counts.valid, 1);
    assert.equal(counts.invalid, 0);
    assert.equal(docs[0].status, "staged");
  });

  await test("validateLeadRows: any segment string is accepted — the list is open (round-2 §2)", () => {
    const { docs, counts } = validateLeadRows([{ ...goodRow(), segment: "nope" }]);
    assert.equal(counts.valid, 1);
    assert.equal(counts.invalid, 0);
    assert.equal(docs[0].segment, "nope");
  });

  await test("validateLeadRows: missing company is invalid with row error", () => {
    const row = { ...goodRow() } as Record<string, unknown>;
    delete row.company;
    const { docs, counts } = validateLeadRows([row]);
    assert.equal(counts.valid, 0);
    assert.equal(counts.invalid, 1);
    assert.equal(docs.length, 0);
    assert.ok(counts.errors[0].includes("?"));
  });

  await test("validateLeadRows: input status contacted is overridden to staged", () => {
    const { docs } = validateLeadRows([{ ...goodRow(), status: "contacted" }]);
    assert.equal(docs[0].status, "staged");
  });

  await test("insertLeads: a suppressed email is skipped and counted, not inserted", async () => {
    const { docs } = validateLeadRows([goodRow()]);
    let saved = false;
    let suppressionQueryArg: Record<string, unknown> | undefined;
    // No real Lead/LeadSuppression model calls here — `deps` fakes both, and
    // `.save()` is stubbed on the instance so a wiring mistake can never
    // reach the (production) database this worktree points at.
    (docs[0] as unknown as { save: () => Promise<void> }).save = async () => { saved = true; };
    const deps: InsertLeadsDeps = {
      findDupe: async () => null,
      suppressionExists: async (q) => { suppressionQueryArg = q; return true; },
    };
    const counts = await insertLeads(docs, deps);
    assert.equal(counts.skippedSuppressed, 1);
    assert.equal(counts.inserted, 0);
    assert.equal(counts.skippedDupes, 0);
    assert.equal(saved, false);
    assert.deepEqual(suppressionQueryArg, { $or: [{ emails: "dsmith@acme.edu" }] });
  });

  await test("insertLeads: suppression check falls back to emails[0] when decisionMaker.email is empty (round 2 final fix wave §7)", async () => {
    const row = { ...goodRow(), emails: ["team@acme.edu"] } as Record<string, unknown>;
    (row.decisionMaker as Record<string, unknown>) = { ...(row.decisionMaker as Record<string, unknown>), email: "" };
    const { docs } = validateLeadRows([row]);
    (docs[0] as unknown as { save: () => Promise<void> }).save = async () => {};
    let suppressionQueryArg: Record<string, unknown> | undefined;
    const deps: InsertLeadsDeps = {
      findDupe: async () => null,
      suppressionExists: async (q) => { suppressionQueryArg = q; return true; },
    };
    const counts = await insertLeads(docs, deps);
    assert.equal(counts.skippedSuppressed, 1);
    assert.deepEqual(suppressionQueryArg, { $or: [{ emails: "team@acme.edu" }] });
  });

  await test("insertLeads: not a dupe, not suppressed — inserted normally", async () => {
    const { docs } = validateLeadRows([goodRow()]);
    let saved = false;
    (docs[0] as unknown as { save: () => Promise<void> }).save = async () => { saved = true; };
    const deps: InsertLeadsDeps = {
      findDupe: async () => null,
      suppressionExists: async () => false,
    };
    const counts = await insertLeads(docs, deps);
    assert.equal(counts.inserted, 1);
    assert.equal(counts.skippedSuppressed, 0);
    assert.equal(saved, true);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
