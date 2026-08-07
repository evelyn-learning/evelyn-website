import { strict as assert } from "node:assert";
import { Lead } from "./Lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
const base = {
  company: "Acme Nursing College",
  segment: "nursing_program",
  about: "200-student ADN program",
  whyFit: "NCLEX pass-rate pressure",
  useCaseHypothesis: "voice tutor for NCLEX drill",
  decisionMaker: { name: "Dana Smith", title: "Program Director", emailVerified: false },
  website: "https://acmenursing.edu",
  source: "claude-research-2026-08",
};

await test("valid staged lead passes validateSync", () => {
  const doc = new Lead({ ...base, status: "staged" });
  assert.equal(doc.validateSync(), undefined);
});
await test("status defaults to staged", () => {
  assert.equal(new Lead(base).status, "staged");
});
await test("bad segment rejected", () => {
  const err = new Lead({ ...base, segment: "hospital" }).validateSync();
  assert.ok(err?.errors["segment"]);
});
await test("bad status rejected", () => {
  const err = new Lead({ ...base, status: "won" }).validateSync();
  assert.ok(err?.errors["status"]);
});
await test("touch requires channel+direction", () => {
  const err = new Lead({ ...base, touches: [{ summary: "x" }] }).validateSync();
  assert.ok(err);
});
await test("channel drafts + provenance fields validate", () => {
  const l = new Lead({
    company: "T", segment: "nursing_program",
    decisionMaker: { name: "A", title: "B", email: "a@t.edu", emailVerified: false, emailSource: "vendor", emailProvider: "apollo", linkedinUrl: "https://linkedin.com/in/a", linkedinSource: "vendor" },
    linkedinDraft: { subject: "Quick question", body: "Hi A... [DEMO_LINK]" },
    contactFormDraft: { body: "Hello... [DEMO_LINK]" },
    contactPageUrl: "https://t.edu/contact",
  });
  assert.equal(l.validateSync(), undefined);
});
await test("bad emailSource / linkedinSource rejected", () => {
  assert.ok(new Lead({ company: "T", segment: "nursing_program", decisionMaker: { name: "A", title: "B", emailSource: "guessed" } }).validateSync());
  assert.ok(new Lead({ company: "T", segment: "nursing_program", decisionMaker: { name: "A", title: "B", linkedinSource: "scraped" } }).validateSync());
});
await test("legacy lead without new fields still validates", () => {
  const l = new Lead({ company: "T", segment: "nursing_program", decisionMaker: { name: "A", title: "B" } });
  assert.equal(l.validateSync(), undefined);
  assert.equal(l.linkedinDraft, null);
  assert.equal(l.contactFormDraft, null);
});

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
})();
