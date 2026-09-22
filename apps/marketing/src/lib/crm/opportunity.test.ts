import { strict as assert } from "node:assert";
import { applyOpportunity } from "./opportunity";
import type { IOpportunity } from "@/models/Lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const STAGES = ["staged", "approved", "contacted", "replied", "call_booked", "parked", "dead"];
const NOW = new Date("2026-09-22T00:00:00Z");

(async () => {
await test("rejects an unknown stage with the stage list in the error", () => {
  const opportunities: IOpportunity[] = [];
  const r = applyOpportunity(opportunities, { product: "academy", stage: "banana" }, STAGES, NOW);
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.error, `stage must be one of: ${STAGES.join(", ")}`);
  assert.equal(opportunities.length, 0);
});

await test("creates an entry when absent", () => {
  const opportunities: IOpportunity[] = [];
  const r = applyOpportunity(opportunities, { product: "academy", stage: "approved" }, STAGES, NOW);
  assert.equal(r.ok, true);
  assert.equal(opportunities.length, 1);
  assert.equal(opportunities[0].product, "academy");
  assert.equal(opportunities[0].stage, "approved");
  assert.equal(opportunities[0].updatedAt, NOW);
  assert.equal(opportunities[0].nextActionAt, null);
});

await test("updates stage/updatedAt/notes/nextActionAt when present without duplicating", () => {
  const opportunities: IOpportunity[] = [
    { product: "academy", stage: "approved", notes: "old note", updatedAt: new Date("2026-09-01T00:00:00Z") },
  ];
  const later = new Date("2026-09-22T12:00:00Z");
  const r = applyOpportunity(
    opportunities,
    { product: "academy", stage: "contacted", notes: "new note", nextActionAt: "2026-10-01T00:00:00Z" },
    STAGES,
    later
  );
  assert.equal(r.ok, true);
  assert.equal(opportunities.length, 1);
  assert.equal(opportunities[0].stage, "contacted");
  assert.equal(opportunities[0].notes, "new note");
  assert.equal(opportunities[0].updatedAt, later);
  assert.deepEqual(opportunities[0].nextActionAt, new Date("2026-10-01T00:00:00Z"));
});

await test("nextActionAt: null clears", () => {
  const opportunities: IOpportunity[] = [
    { product: "academy", stage: "approved", nextActionAt: new Date("2026-09-01T00:00:00Z"), updatedAt: new Date("2026-09-01T00:00:00Z") },
  ];
  const r = applyOpportunity(opportunities, { product: "academy", stage: "approved", nextActionAt: null }, STAGES, NOW);
  assert.equal(r.ok, true);
  assert.equal(opportunities[0].nextActionAt, null);
});

await test("omitted notes leaves the old notes", () => {
  const opportunities: IOpportunity[] = [
    { product: "academy", stage: "approved", notes: "keep me", updatedAt: new Date("2026-09-01T00:00:00Z") },
  ];
  const r = applyOpportunity(opportunities, { product: "academy", stage: "contacted" }, STAGES, NOW);
  assert.equal(r.ok, true);
  assert.equal(opportunities[0].notes, "keep me");
});

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
