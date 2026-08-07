import { strict as assert } from "node:assert";
import { needsBackfill, backfillParams, mergeBackfill, type BackfillLead, type BackfillParsed } from "./backfill-drafts";
import { RESEARCH_MODEL } from "./prompts";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const lead = (over: Partial<BackfillLead> = {}): BackfillLead => ({
  status: "staged",
  company: "Acme Nursing College",
  about: "Nursing school with NCLEX-prep.",
  whyFit: "NCLEX pass-rate pressure",
  useCaseHypothesis: "NCLEX drill practice",
  website: "https://acme.edu",
  decisionMaker: { name: "Dana Smith", title: "Dean of Nursing" },
  linkedinDraft: null,
  contactFormDraft: null,
  contactPageUrl: undefined,
  ...over,
});

(async () => {
  // -------- needsBackfill --------
  await test("needsBackfill: true for staged with no linkedinDraft", () => {
    assert.equal(needsBackfill(lead({ status: "staged" })), true);
  });

  await test("needsBackfill: true for approved/contacted with no linkedinDraft", () => {
    assert.equal(needsBackfill(lead({ status: "approved" })), true);
    assert.equal(needsBackfill(lead({ status: "contacted" })), true);
  });

  await test("needsBackfill: false when linkedinDraft already present", () => {
    assert.equal(
      needsBackfill(lead({ status: "staged", linkedinDraft: { subject: "s", body: "b" } })),
      false
    );
  });

  await test("needsBackfill: false for replied/call_booked/parked/dead", () => {
    for (const status of ["replied", "call_booked", "parked", "dead"]) {
      assert.equal(needsBackfill(lead({ status })), false, `status=${status}`);
    }
  });

  // -------- backfillParams --------
  await test("backfillParams: model, max_tokens, NO tools key", () => {
    const p = backfillParams(lead()) as Record<string, unknown>;
    assert.equal(p.model, RESEARCH_MODEL);
    assert.equal(p.max_tokens, 4096);
    assert.ok(!("tools" in p), "must not include a tools key");
  });

  await test("backfillParams: output_config json_schema shape", () => {
    const p = backfillParams(lead()) as {
      output_config: { format: { type: string; schema: Record<string, unknown> } };
    };
    const schema = p.output_config.format;
    assert.equal(schema.type, "json_schema");
    const s = schema.schema as { properties: Record<string, unknown>; required: string[]; additionalProperties: boolean };
    assert.deepEqual(Object.keys(s.properties).sort(), ["contactFormBody", "contactPageUrl", "inmailBody", "inmailSubject"]);
    assert.deepEqual([...s.required].sort(), ["contactFormBody", "contactPageUrl", "inmailBody", "inmailSubject"]);
    assert.equal(s.additionalProperties, false);
  });

  await test("backfillParams: prompt includes stored fields and matches pipeline drafting rules", () => {
    const p = backfillParams(lead()) as { messages: Array<{ content: string }> };
    const prompt = p.messages[0].content;
    assert.ok(prompt.includes("Acme Nursing College"));
    assert.ok(prompt.includes("NCLEX pass-rate pressure"));
    assert.ok(prompt.includes("Dana Smith"));
    assert.ok(prompt.includes("Dean of Nursing"));
    assert.ok(prompt.includes("https://acme.edu"));
    assert.ok(/under 500 characters/i.test(prompt));
    assert.ok(/100-150 words/.test(prompt));
    assert.ok(prompt.includes("[DEMO_LINK]"));
    assert.ok(prompt.includes("Praveen — Evelyn Learning — praveen@evelynlearning.com"));
  });

  // -------- mergeBackfill --------
  await test("mergeBackfill: fills all three when absent, returns true", () => {
    const l = lead();
    const parsed: BackfillParsed = {
      inmailSubject: "NCLEX prep",
      inmailBody: "Hi Dana — quick note.\n[DEMO_LINK]\n— Praveen, Evelyn Learning",
      contactFormBody: "Hi — reaching out.\n[DEMO_LINK]\nPraveen — Evelyn Learning — praveen@evelynlearning.com",
      contactPageUrl: "https://acme.edu/contact",
    };
    const changed = mergeBackfill(l, parsed);
    assert.equal(changed, true);
    assert.deepEqual(l.linkedinDraft, { subject: parsed.inmailSubject, body: parsed.inmailBody });
    assert.deepEqual(l.contactFormDraft, { body: parsed.contactFormBody });
    assert.equal(l.contactPageUrl, "https://acme.edu/contact");
  });

  await test("mergeBackfill: does not overwrite fields already present", () => {
    const l = lead({
      linkedinDraft: { subject: "existing", body: "existing body" },
      contactFormDraft: { body: "existing form" },
      contactPageUrl: "https://acme.edu/existing",
    });
    const parsed: BackfillParsed = {
      inmailSubject: "new", inmailBody: "new body",
      contactFormBody: "new form", contactPageUrl: "https://acme.edu/new",
    };
    const changed = mergeBackfill(l, parsed);
    assert.equal(changed, false);
    assert.deepEqual(l.linkedinDraft, { subject: "existing", body: "existing body" });
    assert.deepEqual(l.contactFormDraft, { body: "existing form" });
    assert.equal(l.contactPageUrl, "https://acme.edu/existing");
  });

  await test("mergeBackfill: partial fill — only sets what's absent, returns true", () => {
    const l = lead({ contactFormDraft: { body: "existing form" } });
    const parsed: BackfillParsed = {
      inmailSubject: "new", inmailBody: "new body",
      contactFormBody: "new form", contactPageUrl: "https://acme.edu/new",
    };
    const changed = mergeBackfill(l, parsed);
    assert.equal(changed, true);
    assert.deepEqual(l.linkedinDraft, { subject: "new", body: "new body" });
    assert.deepEqual(l.contactFormDraft, { body: "existing form" });
    assert.equal(l.contactPageUrl, "https://acme.edu/new");
  });

  await test("mergeBackfill: empty parsed inmail (no person found) does not set linkedinDraft", () => {
    const l = lead();
    const parsed: BackfillParsed = {
      inmailSubject: "", inmailBody: "",
      contactFormBody: "some form body", contactPageUrl: "",
    };
    const changed = mergeBackfill(l, parsed);
    assert.equal(changed, true);
    assert.equal(l.linkedinDraft, null);
    assert.deepEqual(l.contactFormDraft, { body: "some form body" });
    assert.equal(l.contactPageUrl, undefined);
  });

  await test("mergeBackfill: all-empty parsed changes nothing, returns false", () => {
    const l = lead();
    const parsed: BackfillParsed = { inmailSubject: "", inmailBody: "", contactFormBody: "", contactPageUrl: "" };
    const changed = mergeBackfill(l, parsed);
    assert.equal(changed, false);
    assert.equal(l.linkedinDraft, null);
    assert.equal(l.contactFormDraft, null);
    assert.equal(l.contactPageUrl, undefined);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
