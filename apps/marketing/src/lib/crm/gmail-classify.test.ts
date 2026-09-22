import { strict as assert } from "node:assert";
import { classifyThread } from "./gmail-classify";
import type { FullMessage } from "@/lib/outreach/gmail";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
const acct = "info@evelynlearning.com";
const m = (o: Partial<FullMessage>): FullMessage => ({ id: "x", threadId: "t", from: "", to: "", subject: "", date: 1, labelIds: [], text: "", messageIdHeader: "", ...o });
(async () => {
await test("auto-reply only is skipped", () => {
  const v = classifyThread([m({ id: "1", from: acct, to: "p@x.org", subject: "Thank you for contacting Evelyn Learning", labelIds: ["SENT"] })], acct);
  assert.deepEqual(v, { keep: false, reason: "auto_reply_only" });
});
await test("auto-reply followed by a human reply is kept", () => {
  const v = classifyThread([
    m({ id: "1", from: acct, to: "p@x.org", subject: "Thank you for contacting Evelyn Learning", labelIds: ["SENT"], date: 1 }),
    m({ id: "2", from: "Pat <p@x.org>", to: acct, subject: "Re: Thank you", text: "Great, when can we talk?", date: 2 }),
    m({ id: "3", from: "hello@evelynlearning.com", to: "p@x.org", subject: "Re: Thank you", text: "Tomorrow?", labelIds: ["SENT"], date: 3 }),
  ], acct);
  assert.ok(v.keep);
  if (v.keep) {
    assert.equal(v.flagReview, false);
    assert.equal(v.identity.email, "p@x.org"); assert.equal(v.identity.name, "Pat");
    assert.deepEqual(v.touches.map((t) => t.direction), ["outbound", "inbound", "outbound"]);
    assert.equal(v.touches[1].body, "Great, when can we talk?");
    assert.equal(v.touches[0].externalId, "gmail:1");
    assert.equal(v.touches[0].account, acct);
  }
});
await test("self notification skipped", () => {
  assert.equal(classifyThread([m({ from: acct, to: "praveen@evelynlearning.com", subject: "New Contact Form Submission: Demo" })], acct).keep, false);
});
await test("internal-only skipped", () => {
  assert.deepEqual(classifyThread([m({ from: acct, to: "praveen@evelynlearning.com", subject: "sync" })], acct), { keep: false, reason: "internal" });
});
await test("machine senders skipped", () => {
  assert.deepEqual(classifyThread([m({ from: "no-reply@calendar.google.com", to: acct, subject: "Invite" })], acct), { keep: false, reason: "machine" });
  assert.deepEqual(classifyThread([m({ from: acct, to: "billing@apollo.io", subject: "x", labelIds: ["SENT"] })], acct), { keep: false, reason: "machine" });
});
await test("single outbound with no reply is kept but flagged", () => {
  const v = classifyThread([m({ id: "9", from: "Praveen <praveen@evelynlearning.com>", to: "Dean <dean@school.edu>", subject: "Quick idea", text: "…", labelIds: ["SENT"] })], "praveen@evelynlearning.com");
  assert.ok(v.keep && v.flagReview);
  if (v.keep) { assert.equal(v.identity.email, "dean@school.edu"); assert.equal(v.identity.name, "Dean"); }
});
await test("drafts are ignored", () => {
  assert.equal(classifyThread([m({ from: acct, to: "p@x.org", labelIds: ["DRAFT"] })], acct).keep, false);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
