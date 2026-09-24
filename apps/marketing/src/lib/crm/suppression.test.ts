import { strict as assert } from "node:assert";
import { suppressionKeysFor, suppressionQuery } from "./suppression";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {

await test("keys are normalised, deduped and empty-free", () => {
  const k = suppressionKeysFor({
    emails: ["Ops@Pagevault.IO", "ops@pagevault.io", "", "  Dana Smith <Dana@Acme.EDU>  "],
    decisionMaker: { email: "OPS@pagevault.io", linkedinUrl: "https://linkedin.com/in/Skyler-Scarlett/?trk=x" },
    gmailThreadIds: ["18f0aa", "", "18f0aa", "18f0bb"],
    linkedinConversationIds: ["https://www.linkedin.com/in/pv", "pat-lee", ""],
  });
  assert.deepEqual(k.emails, ["ops@pagevault.io", "dana@acme.edu"]);
  assert.deepEqual(k.linkedinUrls, ["https://www.linkedin.com/in/skyler-scarlett"]);
  assert.deepEqual(k.gmailThreadIds, ["18f0aa", "18f0bb"]);
  assert.deepEqual(k.conversationKeys, ["https://www.linkedin.com/in/pv", "pat-lee"]);
});

await test("an empty lead yields four empty arrays, not undefined", () => {
  assert.deepEqual(suppressionKeysFor({}), { emails: [], linkedinUrls: [], gmailThreadIds: [], conversationKeys: [] });
});

await test("a junk linkedin url is dropped, not stored raw", () => {
  const k = suppressionKeysFor({ decisionMaker: { linkedinUrl: "not a url" } });
  assert.deepEqual(k.linkedinUrls, []);
});

await test("query keys on email, linkedin url and conversation key", () => {
  const q = suppressionQuery({
    email: "Ops@Pagevault.IO",
    linkedinUrl: "linkedin.com/in/PV/",
    conversationKey: "pat-lee",
  }) as { $or: Record<string, unknown>[] };
  assert.ok(Array.isArray(q.$or));
  assert.deepEqual(q.$or, [
    { emails: "ops@pagevault.io" },
    { linkedinUrls: "https://www.linkedin.com/in/pv" },
    { conversationKeys: "pat-lee" },
  ]);
});

await test("gmail thread id is NOT a query key (round 2 final fix wave §4)", () => {
  // suppressionQuery's type doesn't even accept gmailThreadIds any more —
  // this asserts the behavioural side: an identity with only a conversation
  // key still queries fine, proving thread ids were never load-bearing here.
  const q = suppressionQuery({ conversationKey: "pat-lee" }) as { $or: Record<string, unknown>[] };
  assert.deepEqual(q.$or, [{ conversationKeys: "pat-lee" }]);
});

await test("an identity with no suppressible key gives null (never a match-all)", () => {
  assert.equal(suppressionQuery({}), null);
  assert.equal(suppressionQuery({ name: "Pat", company: "Pagevault" }), null);
});

await test("a domain is NOT a suppression key — deleting one lead must not block a colleague", () => {
  const q = suppressionQuery({ email: "ops@pagevault.io", website: "https://pagevault.io" }) as { $or: Record<string, unknown>[] };
  assert.equal(q.$or.length, 1);
  assert.equal(JSON.stringify(q).includes("website"), false);
});

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
