import { strict as assert } from "node:assert";
import {
  emailStepFor,
  generateDraftParams,
  applyGeneratedDraft,
  GENERATE_SCHEMA,
  type GenerateLead,
} from "./generate-draft";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const out = (channel: string, summary = "sent") => ({
  at: new Date("2026-08-10T17:00:00Z"), channel, direction: "outbound", summary,
});
const inb = { at: new Date("2026-08-11T17:00:00Z"), channel: "email", direction: "inbound", summary: "reply" };

function lead(touches: GenerateLead["touches"] = []): GenerateLead {
  return {
    company: "Acme Nursing College",
    website: "https://acmenursing.edu",
    about: "200-student ADN program",
    whyFit: "NCLEX pass-rate pressure",
    useCaseHypothesis: "voice tutor for NCLEX drill",
    decisionMaker: { name: "Dana Smith", title: "Program Director" },
    touches,
  };
}

function promptOf(params: Record<string, unknown>): string {
  const messages = params.messages as Array<{ content: string }>;
  return messages[0].content;
}

(async () => {
  await test("emailStepFor: intro until an email has gone out, then slot rules", () => {
  assert.equal(emailStepFor([]), "intro");
  // No email sent yet → always intro, even deep into the sequence: the
  // prospect has never seen an email, so bump/breakup copy would reference
  // a thread that doesn't exist.
  assert.equal(emailStepFor([out("linkedin")]), "intro");
  assert.equal(emailStepFor([out("linkedin"), out("form"), out("form")]), "intro");
  // Skipped-LinkedIn slot is still a bump once an email exists.
  assert.equal(emailStepFor([out("email")]), "bump");
  assert.equal(emailStepFor([out("email"), out("linkedin")]), "bump");
  assert.equal(emailStepFor([out("email"), out("linkedin"), out("email")]), "breakup");
  // Inbound touches ignored.
  assert.equal(emailStepFor([out("email"), inb]), "bump");
});

  await test("intro email prompt: first-touch history line + intro brief", () => {
  const p = promptOf(generateDraftParams(lead(), "email"));
  assert.ok(p.includes("first touch"));
  assert.ok(p.includes("120-180 words"));
  assert.ok(p.includes("[DEMO_LINK]"));
});

  await test("bump prompt at touch 2 includes sent-touch history, not intro brief", () => {
  const p = promptOf(generateDraftParams(lead([out("email", "intro email"), out("linkedin", "li note")]), "email"));
  assert.ok(p.includes("follow-up bump"));
  assert.ok(!p.includes("120-180 words"));
  assert.ok(p.includes("1. 2026-08-10 — email: intro email"));
  assert.ok(p.includes("2. 2026-08-10 — linkedin: li note"));
});

  await test("inbound touches don't count toward the email step", () => {
  const p = promptOf(generateDraftParams(lead([out("email"), inb, out("email"), out("email")]), "email"));
  assert.ok(p.includes("breakup email"));
});

  await test("linkedin + form use the channel briefs regardless of touch count", () => {
  const li = promptOf(generateDraftParams(lead([out("email")]), "linkedin"));
  assert.ok(li.includes("UNDER 500 characters"));
  const form = promptOf(generateDraftParams(lead(), "form"));
  assert.ok(form.includes("100-150 words"));
  assert.ok(form.includes("praveen@evelynlearning.com"));
});

  await test("params carry the structured-output schema and no web tools", () => {
  const params = generateDraftParams(lead(), "email");
  assert.deepEqual(
    (params.output_config as { format: { schema: unknown } }).format.schema,
    GENERATE_SCHEMA
  );
  assert.equal(params.tools, undefined);
});

  await test("applyGeneratedDraft email: sets currentDraft without Gmail ids, resolves demo link", () => {
  const l = lead();
  const changed = applyGeneratedDraft(l, "email", { subject: "S", body: "Hi\n\n[DEMO_LINK]\n\nBest" }, "https://x.com/d/tok");
  assert.equal(changed, true);
  assert.equal(l.currentDraft?.subject, "S");
  assert.equal(l.currentDraft?.body, "Hi\n\nhttps://x.com/d/tok\n\nBest");
  assert.equal(l.currentDraft?.gmailDraftId, undefined);
  assert.equal(l.currentDraft?.gmailThreadId, undefined);
});

  await test("applyGeneratedDraft email: no demo link drops the placeholder line", () => {
  const l = lead();
  applyGeneratedDraft(l, "email", { subject: "S", body: "Hi\n\n[DEMO_LINK]\n\nBest" }, null);
  assert.equal(l.currentDraft?.body, "Hi\n\nBest");
});

  await test("applyGeneratedDraft linkedin: both-or-neither, overwrites existing", () => {
  const l = lead();
  assert.equal(applyGeneratedDraft(l, "linkedin", { subject: "", body: "b" }, null), false);
  assert.equal(l.linkedinDraft, undefined);
  l.linkedinDraft = { subject: "old", body: "old" };
  assert.equal(applyGeneratedDraft(l, "linkedin", { subject: "New", body: "note" }, null), true);
  assert.deepEqual(l.linkedinDraft, { subject: "New", body: "note" });
});

  await test("applyGeneratedDraft form: body only; empty body writes nothing", () => {
  const l = lead();
  assert.equal(applyGeneratedDraft(l, "form", { subject: "", body: "  " }, null), false);
  assert.equal(l.contactFormDraft, undefined);
  assert.equal(applyGeneratedDraft(l, "form", { subject: "ignored", body: "msg" }, null), true);
  assert.deepEqual(l.contactFormDraft, { body: "msg" });
});

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
