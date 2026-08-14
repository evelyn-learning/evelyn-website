import { strict as assert } from "node:assert";
import { findInboundMessage, isBounceSender } from "./reply-detect";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
const self = "praveen@evelynlearning.com";
const msg = (id: string, from: string, labelIds: string[] = [], snippet = "s", internalDate = 1) =>
  ({ id, from, labelIds, snippet, internalDate });

await test("no reply when only self messages", () => {
  assert.equal(findInboundMessage([msg("1", `Praveen <${self}>`, ["SENT"])], self), null);
});
await test("detects external reply", () => {
  const r = findInboundMessage(
    [msg("1", `Praveen <${self}>`, ["SENT"]), msg("2", "Dana <dana@acme.edu>", ["INBOX"])], self);
  assert.equal(r?.gmailMessageId, "2");
  assert.equal(r?.kind, "reply");
});
await test("ignores drafts", () => {
  assert.equal(findInboundMessage([msg("1", "Dana <dana@acme.edu>", ["DRAFT"])], self), null);
});
await test("self-match is case-insensitive", () => {
  assert.equal(findInboundMessage([msg("1", "PRAVEEN@EVELYNLEARNING.COM", ["SENT"])], self), null);
});

await test("isBounceSender matches Gmail's NDR sender", () => {
  assert.equal(isBounceSender("Mail Delivery Subsystem <mailer-daemon@googlemail.com>"), true);
  assert.equal(isBounceSender("<MAILER-DAEMON@google.com>"), true);
  assert.equal(isBounceSender("postmaster@ccri.edu"), true);
});
await test("isBounceSender does not match a real person", () => {
  assert.equal(isBounceSender("Dr. Carr <carr7@ccri.edu>"), false);
  assert.equal(isBounceSender("Postmaster General <pg@example.com>"), false);
  assert.equal(isBounceSender(""), false);
});

await test("findInboundMessage tags a bounce as kind=bounce", () => {
  const out = findInboundMessage(
    [msg("b1", "Mail Delivery Subsystem <mailer-daemon@googlemail.com>", [], "Address not found")],
    self,
  );
  assert.equal(out?.kind, "bounce");
  assert.equal(out?.gmailMessageId, "b1");
});
await test("findInboundMessage tags a human message as kind=reply", () => {
  const out = findInboundMessage([msg("r1", "Dr. Carr <carr7@ccri.edu>")], self);
  assert.equal(out?.kind, "reply");
});
await test("a bounce takes precedence over a later human message in the same thread", () => {
  // Order matters: a thread can contain the NDR and then a forwarded note.
  const out = findInboundMessage(
    [
      msg("b1", "mailer-daemon@googlemail.com", [], "s", 1),
      msg("r1", "someone@else.com", [], "s", 2),
    ],
    self,
  );
  assert.equal(out?.kind, "bounce");
});
await test("a bounce is found even when a human message comes first", () => {
  const out = findInboundMessage(
    [
      msg("r1", "someone@else.com", [], "s", 1),
      msg("b1", "mailer-daemon@googlemail.com", [], "s", 2),
    ],
    self,
  );
  assert.equal(out?.kind, "bounce");
  assert.equal(out?.gmailMessageId, "b1");
});

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
})();
