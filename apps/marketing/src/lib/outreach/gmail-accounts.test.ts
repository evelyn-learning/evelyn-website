import { strict as assert } from "node:assert";
process.env.GMAIL_OUTREACH_USER = "praveen@evelynlearning.com";
process.env.GMAIL_OUTREACH_ACCOUNTS = "praveen@evelynlearning.com, Info@EvelynLearning.com";
import { getOutreachAccounts, isAllowedAccount, extractPlainText } from "./gmail";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
await test("accounts parsed, lowercased, primary first", () => {
  assert.deepEqual(getOutreachAccounts(), ["praveen@evelynlearning.com", "info@evelynlearning.com"]);
});
await test("isAllowedAccount is case-insensitive", () => {
  assert.equal(isAllowedAccount("INFO@evelynlearning.com"), true);
  assert.equal(isAllowedAccount("x@evelynlearning.com"), false);
});
await test("extractPlainText prefers text/plain, falls back to stripped html", () => {
  const b64 = (s: string) => Buffer.from(s).toString("base64url");
  assert.equal(extractPlainText({ mimeType: "text/plain", body: { data: b64("hi there") } }), "hi there");
  assert.equal(extractPlainText({ mimeType: "multipart/alternative", parts: [
    { mimeType: "text/html", body: { data: b64("<p>Hello <b>world</b></p>") } },
    { mimeType: "text/plain", body: { data: b64("Hello world") } },
  ] }), "Hello world");
  assert.equal(extractPlainText({ mimeType: "text/html", body: { data: b64("<div>A<br>B</div>") } }), "A\nB");
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
