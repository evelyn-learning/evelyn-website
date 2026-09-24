import { strict as assert } from "node:assert";
import { mergeOptionValues, sourcePill, leadMatchesQuery, compareLeads, type SortableLead } from "./console-helpers";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {

await test("seeds come first in seed order, extras follow sorted", () => {
  assert.deepEqual(
    mergeOptionValues(["voice_tutor", "academy", "other"], ["zeta", "academy", "homework_bot"]),
    ["voice_tutor", "academy", "other", "homework_bot", "zeta"]
  );
});
await test("empty, null and whitespace values are dropped", () => {
  assert.deepEqual(mergeOptionValues(["a"], ["", null, undefined, "  ", "b"]), ["a", "b"]);
});
await test("duplicates collapse and values are trimmed", () => {
  assert.deepEqual(mergeOptionValues(["a"], ["  b  ", "b", "a"]), ["a", "b"]);
});
await test("no present values gives exactly the seeds", () => {
  assert.deepEqual(mergeOptionValues(["a", "b"], []), ["a", "b"]);
});

await test("sourcePill: gmail sources show the mailbox local part", () => {
  assert.deepEqual(sourcePill("gmail:praveen@evelynlearning.com"), { label: "praveen@", tone: "gmail" });
  assert.deepEqual(sourcePill("gmail:Info@EvelynLearning.com"), { label: "info@", tone: "gmail" });
});
await test("sourcePill: form, linkedin, research", () => {
  assert.deepEqual(sourcePill("contact-form"), { label: "form", tone: "form" });
  assert.deepEqual(sourcePill("linkedin:paste"), { label: "LinkedIn", tone: "linkedin" });
  assert.deepEqual(sourcePill("linkedin:archive"), { label: "LinkedIn", tone: "linkedin" });
  assert.deepEqual(sourcePill("research-job:68d1"), { label: "research", tone: "research" });
});
await test("sourcePill: empty, missing and legacy sources fall back to research", () => {
  assert.deepEqual(sourcePill(undefined), { label: "research", tone: "research" });
  assert.deepEqual(sourcePill(""), { label: "research", tone: "research" });
  assert.deepEqual(sourcePill("claude-research-2026-08"), { label: "research", tone: "research" });
});

const searchable: SortableLead = {
  company: "Pagevault",
  segment: "publisher",
  product: "content_services",
  status: "contacted",
  notes: "Introduced by Dee",
  source: "gmail:info@evelynlearning.com",
  emails: ["ops@pagevault.io"],
  decisionMaker: { name: "Pat Lee", title: "Head of Content", email: "pat@pagevault.io" },
  touches: [
    { at: "2026-09-01T00:00:00.000Z", subject: "Intro", body: "We digitise textbooks", summary: "Sent: Intro", from: "info@evelynlearning.com", to: "ops@pagevault.io" },
  ],
};

await test("leadMatchesQuery: an empty query matches everything", () => {
  assert.equal(leadMatchesQuery(searchable, ""), true);
  assert.equal(leadMatchesQuery(searchable, "   "), true);
});
await test("leadMatchesQuery: matches every documented field, case-insensitively", () => {
  for (const q of ["PAGEVAULT", "publisher", "content_services", "contacted", "Dee", "info@evelyn", "ops@pagevault", "Pat Lee", "Head of Content", "pat@pagevault", "Intro", "digitise"]) {
    assert.equal(leadMatchesQuery(searchable, q), true, q);
  }
});
await test("leadMatchesQuery: touch summary and recipient are searchable", () => {
  assert.equal(leadMatchesQuery(searchable, "Sent: Intro"), true);
  assert.equal(leadMatchesQuery(searchable, "ops@pagevault.io"), true);
});
await test("leadMatchesQuery: a miss is a miss, and a bare lead never throws", () => {
  assert.equal(leadMatchesQuery(searchable, "kanzoo"), false);
  assert.equal(leadMatchesQuery({}, "kanzoo"), false);
  assert.equal(leadMatchesQuery({}, ""), true);
});

const A: SortableLead = { company: "Acme", segment: "library", status: "approved", product: "academy", decisionMaker: { name: "Ann" }, nextActionAt: "2026-09-20T00:00:00.000Z", touches: [{ at: "2026-09-10T00:00:00.000Z" }, { at: "2026-09-18T00:00:00.000Z" }] };
const B: SortableLead = { company: "Zed", segment: "microschool", status: "dead", product: "mock_exams", decisionMaker: { name: "Bo" }, nextActionAt: "2026-09-25T00:00:00.000Z", touches: [{ at: "2026-09-19T00:00:00.000Z" }] };
const E: SortableLead = {};

await test("compareLeads: strings sort by localeCompare and flip with dir", () => {
  for (const k of ["company", "segment", "status", "product", "decisionMaker"] as const) {
    assert.ok(compareLeads(A, B, k, "asc") < 0, `${k} asc`);
    assert.ok(compareLeads(A, B, k, "desc") > 0, `${k} desc`);
    assert.equal(compareLeads(A, A, k, "asc"), 0, `${k} equal`);
  }
});
await test("compareLeads: touch count is numeric, not lexical", () => {
  assert.ok(compareLeads(B, A, "touches", "asc") < 0);
  assert.ok(compareLeads(B, A, "touches", "desc") > 0);
});
await test("compareLeads: nextActionAt and lastTouchAt compare as dates", () => {
  assert.ok(compareLeads(A, B, "nextActionAt", "asc") < 0);
  assert.ok(compareLeads(A, B, "lastTouchAt", "asc") < 0);
  assert.ok(compareLeads(A, B, "lastTouchAt", "desc") > 0);
});
await test("compareLeads: empty values sort LAST in both directions", () => {
  for (const k of ["company", "product", "decisionMaker", "nextActionAt", "lastTouchAt"] as const) {
    assert.ok(compareLeads(E, A, k, "asc") > 0, `${k} asc`);
    assert.ok(compareLeads(E, A, k, "desc") > 0, `${k} desc`);
    assert.equal(compareLeads(E, E, k, "asc"), 0, `${k} both empty`);
  }
});
await test("compareLeads: a lead with zero touches is 0, not empty", () => {
  assert.ok(compareLeads(E, A, "touches", "asc") < 0);
});
await test("compareLeads sorts a list end to end", () => {
  const sorted = [B, E, A].sort((x, y) => compareLeads(x, y, "company", "asc")).map((l) => l.company ?? "—");
  assert.deepEqual(sorted, ["Acme", "Zed", "—"]);
});

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
