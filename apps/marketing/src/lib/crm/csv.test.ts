import { strict as assert } from "node:assert";
import { parseCsv } from "./csv";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
await test("simple rows", () => assert.deepEqual(parseCsv("a,b\n1,2\n"), [["a", "b"], ["1", "2"]]));
await test("quoted commas, doubled quotes, embedded newline, CRLF", () => {
  assert.deepEqual(parseCsv('h1,h2\r\n"x, y","say ""hi""\nline2"\r\n'), [["h1", "h2"], ["x, y", 'say "hi"\nline2']]);
});
await test("trailing empty field", () => assert.deepEqual(parseCsv("a,b,\n"), [["a", "b", ""]]));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
