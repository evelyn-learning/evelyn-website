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

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
})();
