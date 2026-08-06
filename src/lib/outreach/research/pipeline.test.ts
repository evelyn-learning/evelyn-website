import { strict as assert } from "node:assert";
import { researchedToLeadRow, runCandidate } from "./pipeline";
import type { ResearchedLead } from "./prompts";
import type { CallModel, ResearchMessage } from "./claude";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const usage = { input_tokens: 10, output_tokens: 5 };
const researched = (over: Partial<ResearchedLead> = {}): ResearchedLead => ({
  company: "Acme Nursing College", website: "https://acme.edu",
  about: "Nursing school", whyFit: "NCLEX pass-rate pressure",
  useCaseHypothesis: "NCLEX drill", source: "https://acme.edu/programs",
  decisionMakerName: "Dana Smith", decisionMakerTitle: "Dean",
  linkedinUrl: "", email: "dsmith@acme.edu",
  emailSourceUrl: "https://acme.edu/staff", nameSourceUrl: "https://acme.edu/staff",
  sourceUrls: ["https://acme.edu/programs", "https://acme.edu/staff"],
  draftSubject: "NCLEX prep at Acme", draftBody: "Hi Dana...\n[DEMO_LINK]\nBest,\nPraveen\nEvelyn Learning",
  ...over,
});
const leadMsg = (r: ResearchedLead): ResearchMessage =>
  ({ stop_reason: "end_turn", content: [{ type: "text", text: JSON.stringify(r) }], usage });

(async () => {
  await test("mapper: verified email kept, emailVerified true", () => {
    const row = researchedToLeadRow(researched(), { segment: "nursing_program", jobId: "j1", emailVerified: true }) as {
      decisionMaker: { email?: string; emailVerified: boolean }; currentDraft: { body: string }; segment: string;
    };
    assert.equal(row.decisionMaker.email, "dsmith@acme.edu");
    assert.equal(row.decisionMaker.emailVerified, true);
    assert.equal(row.segment, "nursing_program");
    assert.ok(row.currentDraft.body.includes("[DEMO_LINK]"));
  });

  await test("mapper: unverified email stripped", () => {
    const row = researchedToLeadRow(researched(), { segment: "nursing_program", jobId: "j1", emailVerified: false }) as {
      decisionMaker: { email?: string; emailVerified: boolean };
    };
    assert.equal(row.decisionMaker.email, undefined);
    assert.equal(row.decisionMaker.emailVerified, false);
  });

  await test("mapper: linkedinUrl kept only when in sourceUrls", () => {
    const kept = researchedToLeadRow(
      researched({ linkedinUrl: "https://linkedin.com/in/dana", sourceUrls: ["https://linkedin.com/in/dana"] }),
      { segment: "nursing_program", jobId: "j1", emailVerified: false }
    ) as { decisionMaker: { linkedinUrl?: string } };
    assert.equal(kept.decisionMaker.linkedinUrl, "https://linkedin.com/in/dana");

    const dropped = researchedToLeadRow(
      researched({ linkedinUrl: "https://linkedin.com/in/dana", sourceUrls: ["https://acme.edu"] }),
      { segment: "nursing_program", jobId: "j1", emailVerified: false }
    ) as { decisionMaker: { linkedinUrl?: string } };
    assert.equal(dropped.decisionMaker.linkedinUrl, undefined);
  });

  await test("runCandidate: published email -> verified lead row", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("Dean Dana Smith — dsmith@acme.edu")) as typeof fetch;
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn }, () => {}
    );
    assert.equal(out.outcome, "inserted");
    const row = out.row as { decisionMaker: { emailVerified: boolean } };
    assert.equal(row.decisionMaker.emailVerified, true);
  });

  await test("runCandidate: email absent from page -> stripped, outcome no_email", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("no emails on this page")) as typeof fetch;
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn }, () => {}
    );
    assert.equal(out.outcome, "no_email");
    const row = out.row as { decisionMaker: { email?: string } };
    assert.equal(row.decisionMaker.email, undefined);
    assert.ok(out.note && /not verified|not found/i.test(out.note));
  });

  await test("runCandidate: model returns no email at all -> no_email, no fetch attempted", async () => {
    const call: CallModel = async () => leadMsg(researched({ email: "", emailSourceUrl: "" }));
    const fetchFn = (async () => { throw new Error("should not fetch"); }) as unknown as typeof fetch;
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn }, () => {}
    );
    assert.equal(out.outcome, "no_email");
  });

  await test("runCandidate: no real person found -> discarded", async () => {
    const call: CallModel = async () =>
      leadMsg(researched({ decisionMakerName: "", decisionMakerTitle: "", email: "", emailSourceUrl: "", nameSourceUrl: "" }));
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn: (async () => new Response("")) as typeof fetch }, () => {}
    );
    assert.equal(out.outcome, "discarded");
  });

  await test("runCandidate: refusal -> error outcome with note, does not throw", async () => {
    const call: CallModel = async () => ({ stop_reason: "refusal", content: [], usage });
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn: (async () => new Response("")) as typeof fetch }, () => {}
    );
    assert.equal(out.outcome, "error");
    assert.ok(out.note?.includes("RESEARCH_REFUSED"));
  });

  await test("runCandidate: reports usage via onUsage", async () => {
    let calls = 0;
    const call: CallModel = async () => leadMsg(researched({ email: "", emailSourceUrl: "" }));
    await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn: (async () => new Response("")) as typeof fetch },
      () => { calls++; }
    );
    assert.equal(calls, 1);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
