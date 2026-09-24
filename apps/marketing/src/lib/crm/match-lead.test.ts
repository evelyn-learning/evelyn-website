import { strict as assert } from "node:assert";
import { pickLead, matchQuery, newLeadFields, companyNameFor, type MatchableLead } from "./match-lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
const acme: MatchableLead = { _id: "1", emails: ["dana@acme.edu"], decisionMaker: { email: "dana@acme.edu", linkedinUrl: "https://www.linkedin.com/in/dana" }, website: "https://acme.edu" };
const zed: MatchableLead = { _id: "2", emails: [], decisionMaker: { email: "z@zed.org" }, website: "https://zed.org" };

await test("email wins over everything", () => {
  const r = pickLead({ email: "DANA@acme.edu", linkedinUrl: "https://www.linkedin.com/in/someone-else" }, [zed, acme]);
  assert.equal(r?.lead._id, "1"); assert.equal(r?.by, "email");
});
await test("linkedin url matches when email unknown", () => {
  const r = pickLead({ linkedinUrl: "linkedin.com/in/Dana/" }, [zed, acme]);
  assert.equal(r?.lead._id, "1"); assert.equal(r?.by, "linkedin");
});
await test("domain matches org, but never a free-mail domain", () => {
  assert.equal(pickLead({ email: "bob@acme.edu" }, [zed, acme])?.by, "domain");
  assert.equal(pickLead({ email: "bob@gmail.com" }, [zed, acme]), null);
});
await test("no identity -> null", () => assert.equal(pickLead({ name: "X" }, [acme]), null));
await test("matchQuery builds an $or of the available keys", () => {
  const q = matchQuery({ email: "Bob@Acme.edu", linkedinUrl: "https://linkedin.com/in/bob" }) as { $or: unknown[] };
  assert.ok(Array.isArray(q.$or));
  assert.ok(JSON.stringify(q).includes("bob@acme.edu"));
  assert.ok(JSON.stringify(q).includes("acme.edu"));
  assert.equal(matchQuery({ name: "only" }), null);
});
await test("newLeadFields derives company from domain when absent", () => {
  const f = newLeadFields({ email: "bob@acme.edu", name: "Bob Ray" }, "gmail:info@evelynlearning.com") as Record<string, unknown>;
  assert.equal(f.company, "acme.edu");
  assert.equal(f.segment, "other");
  assert.deepEqual(f.emails, ["bob@acme.edu"]);
  assert.equal((f.decisionMaker as { name: string }).name, "Bob Ray");
  assert.equal(f.source, "gmail:info@evelynlearning.com");
});
await test("website-only identity matches by domain (no email on the identity)", () => {
  const notAcme: MatchableLead = { _id: "3", emails: [], decisionMaker: {}, website: "https://notacme.edu" };
  const r = pickLead({ website: "https://www.acme.edu/x" }, [zed, notAcme, acme]);
  assert.equal(r?.lead._id, "1"); assert.equal(r?.by, "domain");
});
await test("matchQuery website regex is anchored to a host boundary, not a bare substring", () => {
  const q = matchQuery({ website: "https://acme.edu" }) as { $or: Array<Record<string, unknown>> };
  assert.ok(Array.isArray(q.$or));
  const websiteClause = q.$or.find((c) => "website" in c) as { website: RegExp } | undefined;
  assert.ok(websiteClause, "expected an $or clause on website");
  assert.ok(websiteClause!.website.test("https://acme.edu"));
  assert.ok(websiteClause!.website.test("https://www.acme.edu/about"));
  assert.ok(!websiteClause!.website.test("https://notacme.edu"));
});
await test("companyNameFor: an explicit company always wins", () => {
  assert.equal(companyNameFor({ company: "  Acme Nursing  ", email: "bob@acme.edu", name: "Bob" }), "Acme Nursing");
});
await test("companyNameFor: an organisation domain beats the person's name", () => {
  assert.equal(companyNameFor({ email: "bob@acme.edu", name: "Bob Ray" }), "acme.edu");
  assert.equal(companyNameFor({ website: "https://www.tvs.org/about" }), "tvs.org");
});
await test("companyNameFor: gmail.com + a name gives the name, never Unknown", () => {
  assert.equal(companyNameFor({ email: "Bob Ray <bob.ray@gmail.com>", name: "Bob Ray" }), "Bob Ray");
});
await test("companyNameFor: gmail.com with no name gives the address, never Unknown", () => {
  assert.equal(companyNameFor({ email: "Bob.Ray@Gmail.com" }), "bob.ray@gmail.com");
});
await test("companyNameFor: Unknown only when there is nothing at all", () => {
  assert.equal(companyNameFor({}), "Unknown");
  assert.equal(companyNameFor({ company: "   ", name: "  " }), "Unknown");
});
await test("newLeadFields uses companyNameFor for a free-mail contact", () => {
  const f = newLeadFields({ email: "x@gmail.com" }, "gmail:info@evelynlearning.com") as Record<string, unknown>;
  assert.equal(f.company, "x@gmail.com");
  const g = newLeadFields({ email: "y@gmail.com", name: "Yara Qadir" }, "contact-form") as Record<string, unknown>;
  assert.equal(g.company, "Yara Qadir");
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
