import { strict as assert } from "node:assert";
import { classifyContact, productFromParam } from "./classify-contact";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
await test("explicit careers reason", () => {
  assert.deepEqual(classifyContact({ reason: "careers", subject: "x", message: "y" }), { reason: "careers", isCareers: true });
});
await test("keyword screen catches a job inquiry with no reason", () => {
  const r = classifyContact({ subject: "Inquiry: Voice Tutor", message: "Please find my resume attached, I am applying for the ML engineer position." });
  assert.equal(r.isCareers, true); assert.equal(r.reason, "careers");
});
await test("demo alias normalises", () => {
  assert.equal(classifyContact({ reason: "demo", subject: "Request a Demo", message: "hi" }).reason, "demo_request");
});
await test("unknown reason -> other; ordinary inquiry not careers", () => {
  const r = classifyContact({ reason: "banana", subject: "Pricing", message: "How much per minute?" });
  assert.equal(r.reason, "other"); assert.equal(r.isCareers, false);
});
await test("productFromParam maps CTA slugs", () => {
  assert.equal(productFromParam("voice-tutor"), "voice_tutor");
  assert.equal(productFromParam("tutor-copilot"), "voice_tutor");
  assert.equal(productFromParam("academy"), "academy");
  assert.equal(productFromParam("mock-exams"), "mock_exams");
  assert.equal(productFromParam("white-label"), "white_label");
  assert.equal(productFromParam("content"), "content_services");
  assert.equal(productFromParam("essay-ai"), "other");
  assert.equal(productFromParam(null), undefined);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
