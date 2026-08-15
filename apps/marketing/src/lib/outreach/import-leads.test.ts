import { strict as assert } from "node:assert";
import { sanitizeLeadRow, validateLeadRows } from "./import-leads";

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

  await test("validateLeadRows: bad segment is invalid with row error", () => {
    const { docs, counts } = validateLeadRows([{ ...goodRow(), segment: "nope" }]);
    assert.equal(counts.valid, 0);
    assert.equal(counts.invalid, 1);
    assert.equal(docs.length, 0);
    assert.ok(counts.errors[0].includes("Acme"));
  });

  await test("validateLeadRows: input status contacted is overridden to staged", () => {
    const { docs } = validateLeadRows([{ ...goodRow(), status: "contacted" }]);
    assert.equal(docs[0].status, "staged");
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
