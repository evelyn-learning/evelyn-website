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
await test("careers keyword screen does not false-positive on 'positioning'/'recruitment'", () => {
  const r = classifyContact({ reason: "product_inquiry", subject: "Pricing", message: "How does your market positioning compare? We are positioned to recruitment-heavy sectors." });
  assert.equal(r.isCareers, false); assert.equal(r.reason, "product_inquiry");
});
await test("careers keyword screen still catches whole-word 'position'", () => {
  const r = classifyContact({ subject: "Inquiry", message: "I am applying for the open position." });
  assert.equal(r.isCareers, true); assert.equal(r.reason, "careers");
});
await test("productFromParam maps CTA slugs", () => {
  assert.equal(productFromParam("voice-tutor"), "voice_tutor");
  assert.equal(productFromParam("tutor-copilot"), "voice_tutor");
  assert.equal(productFromParam("academy"), "academy");
  assert.equal(productFromParam("mock-exams"), "mock_exams");
  assert.equal(productFromParam("white-label"), "white_label");
  assert.equal(productFromParam("content"), "content_services");
  assert.equal(productFromParam(null), undefined);
});
await test("productFromParam keeps an unmapped CTA as its own product (round-2 §2)", () => {
  // Was "other" — collapsing every unmapped CTA lost which page the lead
  // came from, and the product list is open now.
  assert.equal(productFromParam("essay-ai"), "essay_ai");
  assert.equal(productFromParam("Virtual Labs"), "virtual_labs");
  assert.equal(productFromParam("proctoring-suite"), "proctoring_suite");
});
await test("productFromParam passes a seed value through unchanged", () => {
  assert.equal(productFromParam("voice_tutor"), "voice_tutor");
  assert.equal(productFromParam("other"), "other");
});
await test("productFromParam returns undefined for empty or punctuation-only params", () => {
  assert.equal(productFromParam(""), undefined);
  assert.equal(productFromParam("   "), undefined);
  assert.equal(productFromParam("---"), undefined);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
