import { strict as assert } from "node:assert";
import { mergeOptionValues } from "./console-helpers";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {

await test("seeds come first in seed order, extras follow sorted", () => {
  assert.deepEqual(
    mergeOptionValues(["voice_tutor", "academy", "other"], ["zeta", "academy", "homework_bot"]),
    ["voice_tutor", "academy", "other", "homework_bot", "zeta"]
  );
});
await test("empty, null and whitespace values are dropped", () => {
  assert.deepEqual(mergeOptionValues(["a"], ["", null, undefined, "  ", "b"]), ["a", "b"]);
});
await test("duplicates collapse and values are trimmed", () => {
  assert.deepEqual(mergeOptionValues(["a"], ["  b  ", "b", "a"]), ["a", "b"]);
});
await test("no present values gives exactly the seeds", () => {
  assert.deepEqual(mergeOptionValues(["a", "b"], []), ["a", "b"]);
});

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
