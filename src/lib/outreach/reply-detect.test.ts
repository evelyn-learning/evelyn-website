import { strict as assert } from "node:assert";
import { findInboundReply, isBounceSender } from "./reply-detect";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
const self = "praveen@evelynlearning.com";
const msg = (id: string, from: string, labelIds: string[] = []) =>
  ({ id, from, labelIds, snippet: "s", internalDate: 1 });

await test("no reply when only self messages", () => {
  assert.equal(findInboundReply([msg("1", `Praveen <${self}>`, ["SENT"])], self), null);
});
await test("detects external reply", () => {
  const r = findInboundReply(
    [msg("1", `Praveen <${self}>`, ["SENT"]), msg("2", "Dana <dana@acme.edu>", ["INBOX"])], self);
  assert.equal(r?.gmailMessageId, "2");
});
await test("ignores drafts", () => {
  assert.equal(findInboundReply([msg("1", "Dana <dana@acme.edu>", ["DRAFT"])], self), null);
});
await test("self-match is case-insensitive", () => {
  assert.equal(findInboundReply([msg("1", "PRAVEEN@EVELYNLEARNING.COM", ["SENT"])], self), null);
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

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
})();
