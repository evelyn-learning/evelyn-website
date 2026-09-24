import { strict as assert } from "node:assert";
import { LeadSuppression } from "./LeadSuppression";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
const base = {
  leadId: "68d0000000000000000000aa",
  company: "Pagevault",
  snapshot: { company: "Pagevault", segment: "publisher", touches: [] },
  deletedAt: new Date(),
};

await test("minimal suppression validates and the key arrays default to []", () => {
  const doc = new LeadSuppression(base);
  assert.equal(doc.validateSync(), undefined);
  assert.deepEqual([...doc.emails], []);
  assert.deepEqual([...doc.linkedinUrls], []);
  assert.deepEqual([...doc.gmailThreadIds], []);
  assert.deepEqual([...doc.conversationKeys], []);
});
await test("leadId, company, snapshot and deletedAt are required", () => {
  const err = new LeadSuppression({}).validateSync();
  assert.ok(err?.errors["leadId"]);
  assert.ok(err?.errors["company"]);
  assert.ok(err?.errors["snapshot"]);
  assert.ok(err?.errors["deletedAt"]);
});
await test("key arrays round-trip", () => {
  const doc = new LeadSuppression({
    ...base,
    emails: ["ops@pagevault.io"],
    linkedinUrls: ["https://www.linkedin.com/in/pv"],
    gmailThreadIds: ["18f0aa"],
    conversationKeys: ["https://www.linkedin.com/in/pv"],
  });
  assert.equal(doc.validateSync(), undefined);
  assert.deepEqual([...doc.emails], ["ops@pagevault.io"]);
  assert.deepEqual([...doc.conversationKeys], ["https://www.linkedin.com/in/pv"]);
});
await test("snapshot keeps an arbitrary nested shape (Mixed)", () => {
  const snapshot = { company: "X", touches: [{ at: new Date(), body: "hi", nested: { a: [1, 2] } }] };
  const doc = new LeadSuppression({ ...base, snapshot });
  assert.equal(doc.validateSync(), undefined);
  assert.equal((doc.snapshot as { touches: { body: string }[] }).touches[0].body, "hi");
});

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
})();
