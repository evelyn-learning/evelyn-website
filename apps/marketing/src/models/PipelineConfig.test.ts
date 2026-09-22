import { strict as assert } from "node:assert";
import { PipelineConfig, DEFAULT_STAGES } from "./PipelineConfig";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
await test("default stages equal the seven lead statuses", () => {
  assert.deepEqual(DEFAULT_STAGES, ["staged", "approved", "contacted", "replied", "call_booked", "parked", "dead"]);
});
await test("stages default when omitted", () => {
  const doc = new PipelineConfig({ product: "academy" });
  assert.equal(doc.validateSync(), undefined);
  assert.deepEqual([...doc.stages], DEFAULT_STAGES);
});
await test("unknown product rejected", () => {
  assert.ok(new PipelineConfig({ product: "jetpack" }).validateSync()?.errors["product"]);
});
await test("empty stages rejected", () => {
  assert.ok(new PipelineConfig({ product: "academy", stages: [] }).validateSync());
});
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
})();
