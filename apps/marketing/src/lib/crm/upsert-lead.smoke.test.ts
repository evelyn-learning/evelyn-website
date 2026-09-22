import { strict as assert } from "node:assert";
import { Lead } from "@/models";
import { newLeadFields } from "./match-lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {

await test("newLeadFields(email identity) validates", () => {
  const doc = new Lead(newLeadFields({ email: "bob@acme.edu", name: "Bob Ray" }, "gmail:info@evelynlearning.com"));
  assert.equal(doc.validateSync(), undefined);
});

await test("newLeadFields(linkedin-only identity) validates", () => {
  const doc = new Lead(newLeadFields({ linkedinUrl: "https://www.linkedin.com/in/jane", name: "Jane" }, "gmail:info@evelynlearning.com"));
  assert.equal(doc.validateSync(), undefined);
});

await test("newLeadFields(bare email identity) validates", () => {
  const doc = new Lead(newLeadFields({ email: "x@gmail.com" }, "gmail:info@evelynlearning.com"));
  assert.equal(doc.validateSync(), undefined);
});

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
})();
