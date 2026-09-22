import { strict as assert } from "node:assert";
import { parseLinkedinConversation, linkedinTouches } from "./linkedin-paste";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
const SAMPLE = `Skyler Scarlett 
1st degree connection
· 1st
2x ABC Shark Tank Entrepreneur | AI Patent Holder
Saturday
Praveen Tyagi sent the following message at 1:28 PM
View Praveen’s profilePraveen Tyagi
Praveen Tyagi   1:28 PM
Hi Skyler, I run Evelyn Learning, an AI-first EdTech company.

Skyler Scarlett sent the following messages at 2:22 PM
View Skyler’s profileSkyler Scarlett
Skyler Scarlett   2:22 PM
Very cool

Nice to be connected!

Praveen Tyagi sent the following message at 5:36 PM
View Praveen’s profilePraveen Tyagi
Praveen Tyagi   5:36 PM
Likewise! Up for a 20-minute demo swap sometime?

Skyler Scarlett sent the following messages at 5:37 PM
View Skyler’s profileSkyler Scarlett
Skyler Scarlett   5:37 PM
👏
👍
😊

Thank you!! 

Sure, be great to connect. 
`;
(async () => {
const now = new Date("2026-09-21T12:00:00-07:00"); // Monday
await test("parses messages, direction, participant", () => {
  const r = parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now });
  assert.equal(r.participant, "Skyler Scarlett");
  assert.equal(r.messages.length, 4);
  assert.deepEqual(r.messages.map((m) => m.outbound), [true, false, true, false]);
  assert.equal(r.messages[1].body, "Very cool\n\nNice to be connected!");
  assert.equal(r.messages[3].body, "Thank you!!\n\nSure, be great to connect.");
});
await test("reaction-only lines are dropped", () => {
  const r = parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now });
  assert.ok(!r.messages[3].body.includes("👏"));
});
await test("weekday marker resolves to the most recent such day", () => {
  const r = parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now });
  const d = r.messages[0].at;
  assert.equal(d.getDay(), 6); // Saturday
  assert.ok(d.getTime() < now.getTime());
  assert.equal(d.getHours(), 13); assert.equal(d.getMinutes(), 28);
});
await test("'Today' and 'Sep 18' markers", () => {
  const txt = `Today\nJane Doe   9:05 AM\nhello\nSep 18\nPraveen Tyagi   4:00 PM\nreply`;
  const r = parseLinkedinConversation(txt, { ownerName: "Praveen Tyagi", now });
  assert.equal(r.messages.length, 2);
  assert.equal(r.messages[0].at.toDateString(), now.toDateString());
  assert.equal(r.messages[1].at.getMonth(), 8); assert.equal(r.messages[1].at.getDate(), 18);
  assert.equal(r.participant, "Jane Doe");
});
await test("touches are stable across re-parse (idempotent ids)", () => {
  const a = linkedinTouches(parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now }), "skyler-scarlett");
  const b = linkedinTouches(parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now }), "skyler-scarlett");
  assert.deepEqual(a.map((t) => t.externalId), b.map((t) => t.externalId));
  assert.ok(a[0].externalId.startsWith("li:"));
  assert.equal(a[0].channel, "linkedin"); assert.equal(a[0].origin, "linkedin_paste");
});
await test("a one-word day-named reply is not swallowed as a day marker", () => {
  const txt = "Today\nJane Doe   9:05 AM\nCan you do a call?\nFriday\nWorks for me\nPraveen Tyagi   4:00 PM\nGreat";
  const r = parseLinkedinConversation(txt, { ownerName: "Praveen Tyagi", now });
  assert.equal(r.messages.length, 2);
  assert.equal(r.messages[0].body, "Can you do a call?\nFriday\nWorks for me");
  assert.equal(r.messages[1].at.toDateString(), now.toDateString());
});
await test("timestamps resolve in the browser's timezone, not the server's", () => {
  const browserNow = new Date("2026-09-21T19:00:00Z");
  const r = parseLinkedinConversation("Today\nJane Doe   9:05 AM\nhello", {
    ownerName: "Praveen Tyagi", now: browserNow, tzOffsetMinutes: 420, // PDT
  });
  assert.equal(r.messages[0].at.toISOString(), "2026-09-21T16:05:00.000Z");
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
