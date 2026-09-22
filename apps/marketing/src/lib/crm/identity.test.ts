import { strict as assert } from "node:assert";
import { normalizeEmail, emailDomain, isFreeMailDomain, isSelfAddress, normalizeLinkedinUrl, websiteDomain } from "./identity";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
await test("normalizeEmail strips display name and case", () => {
  assert.equal(normalizeEmail("Dana Smith <Dana@Acme.EDU>"), "dana@acme.edu");
  assert.equal(normalizeEmail("  x@y.com "), "x@y.com");
});
await test("emailDomain", () => assert.equal(emailDomain("dana@acme.edu"), "acme.edu"));
await test("free mail domains are not org identities", () => {
  assert.equal(isFreeMailDomain("gmail.com"), true);
  assert.equal(isFreeMailDomain("acme.edu"), false);
});
await test("self addresses include info@ aliases and all self domains", () => {
  assert.equal(isSelfAddress("Praveen <praveen@evelynlearning.com>"), true);
  assert.equal(isSelfAddress("hello@evelynlearning.com"), true);
  assert.equal(isSelfAddress("support@evelyntutor.com"), true);
  assert.equal(isSelfAddress("dana@acme.edu"), false);
});
await test("normalizeLinkedinUrl canonicalises", () => {
  assert.equal(normalizeLinkedinUrl("https://linkedin.com/in/Skyler-Scarlett/?trk=x"), "https://www.linkedin.com/in/skyler-scarlett");
  assert.equal(normalizeLinkedinUrl("www.linkedin.com/in/jane/"), "https://www.linkedin.com/in/jane");
  assert.equal(normalizeLinkedinUrl("not a url"), "");
});
await test("websiteDomain drops scheme and www", () => {
  assert.equal(websiteDomain("https://www.tvs.org/about"), "tvs.org");
  assert.equal(websiteDomain(""), "");
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
