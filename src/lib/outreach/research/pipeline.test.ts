import { strict as assert } from "node:assert";
import { researchedToLeadRow, runCandidate } from "./pipeline";
import type { ResearchedLead } from "./prompts";
import type { CallModel, ResearchMessage } from "./claude";
import type { ChainOutcome } from "../enrich/chain";
import type { EnrichInput } from "../enrich/types";

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
  contactPageUrl: "https://acme.edu/contact",
  inmailSubject: "NCLEX prep", inmailBody: "Hi Dana — quick note.\n[DEMO_LINK]\n— Praveen, Evelyn Learning",
  contactFormBody: "Hi — reaching out about NCLEX prep.\n[DEMO_LINK]\nPraveen — Evelyn Learning — praveen@evelynlearning.com",
  ...over,
});
const noResult: ChainOutcome = { result: null, attempts: [] };
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

  await test("mapper: maps three-channel fields; empty strings map to null/undefined", () => {
    const full = researchedToLeadRow(researched(), { segment: "nursing_program", jobId: "j1", emailVerified: true }) as {
      linkedinDraft: { subject: string; body: string } | null;
      contactFormDraft: { body: string } | null;
      contactPageUrl?: string;
    };
    assert.deepEqual(full.linkedinDraft, { subject: "NCLEX prep", body: researched().inmailBody });
    assert.deepEqual(full.contactFormDraft, { body: researched().contactFormBody });
    assert.equal(full.contactPageUrl, "https://acme.edu/contact");

    const empty = researchedToLeadRow(
      researched({ inmailSubject: "", inmailBody: "", contactFormBody: "", contactPageUrl: "" }),
      { segment: "nursing_program", jobId: "j1", emailVerified: true }
    ) as { linkedinDraft: unknown; contactFormDraft: unknown; contactPageUrl?: string };
    assert.equal(empty.linkedinDraft, null);
    assert.equal(empty.contactFormDraft, null);
    assert.equal(empty.contactPageUrl, undefined);
  });

  const noEnrich = { enrich: async () => noResult };

  await test("runCandidate: published email -> verified lead row", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("Dean Dana Smith — dsmith@acme.edu")) as typeof fetch;
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn, ...noEnrich }, () => {}
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
      { call, fetchFn, ...noEnrich }, () => {}
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
      { call, fetchFn, ...noEnrich }, () => {}
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
      { call, fetchFn: (async () => new Response("")) as typeof fetch, ...noEnrich },
      () => { calls++; }
    );
    assert.equal(calls, 1);
  });

  await test("runCandidate: published email + linkedinUrl present -> enrichment skipped", async () => {
    let enrichCalls = 0;
    const call: CallModel = async () =>
      leadMsg(researched({ linkedinUrl: "https://linkedin.com/in/dana", sourceUrls: ["https://acme.edu/programs", "https://acme.edu/staff", "https://linkedin.com/in/dana"] }));
    const fetchFn = (async () => new Response("Dean Dana Smith — dsmith@acme.edu")) as typeof fetch;
    const enrich = async (_input: EnrichInput): Promise<ChainOutcome> => { enrichCalls++; return noResult; };
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn, enrich }, () => {}
    );
    assert.equal(enrichCalls, 0);
    assert.equal(out.outcome, "inserted");
  });

  await test("runCandidate: no-email lead gets vendor email merged, outcome upgraded to inserted", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("no emails on this page")) as typeof fetch;
    const enrich = async (input: EnrichInput): Promise<ChainOutcome> => {
      assert.equal(input.name, "Dana Smith");
      assert.equal(input.company, "Acme Nursing College");
      assert.equal(input.websiteDomain, "acme.edu");
      return { result: { email: "dana@vendor.example", provider: "apollo", creditsUsed: 1 }, attempts: [{ provider: "apollo", status: "hit" }] };
    };
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn, enrich }, () => {}
    );
    assert.equal(out.outcome, "inserted");
    assert.equal(out.note, "email via apollo");
    const row = out.row as { decisionMaker: { email?: string; emailSource?: string; emailVerified: boolean; emailProvider?: string } };
    assert.equal(row.decisionMaker.email, "dana@vendor.example");
    assert.equal(row.decisionMaker.emailSource, "vendor");
    assert.equal(row.decisionMaker.emailVerified, false);
    assert.equal(row.decisionMaker.emailProvider, "apollo");
  });

  await test("runCandidate: vendor never overwrites a published+verified email; linkedin still merges as vendor", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("Dean Dana Smith — dsmith@acme.edu")) as typeof fetch;
    const enrich = async (): Promise<ChainOutcome> =>
      ({ result: { email: "different@vendor.example", linkedinUrl: "https://linkedin.com/in/dana-vendor", provider: "hunter", creditsUsed: 1 }, attempts: [] });
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn, enrich }, () => {}
    );
    assert.equal(out.outcome, "inserted");
    const row = out.row as { decisionMaker: { email?: string; emailSource?: string; linkedinUrl?: string; linkedinSource?: string; linkedinProvider?: string } };
    assert.equal(row.decisionMaker.email, "dsmith@acme.edu");
    assert.equal(row.decisionMaker.emailSource, "published");
    assert.equal(row.decisionMaker.linkedinUrl, "https://linkedin.com/in/dana-vendor");
    assert.equal(row.decisionMaker.linkedinSource, "vendor");
    assert.equal(row.decisionMaker.linkedinProvider, "hunter");
  });

  await test("runCandidate: linkedin-only vendor merge notes \"linkedin via <provider>\"", async () => {
    // Email already published+verified, so only linkedin is missing and
    // eligible to merge.
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("Dean Dana Smith — dsmith@acme.edu")) as typeof fetch;
    const enrich = async (): Promise<ChainOutcome> =>
      ({ result: { linkedinUrl: "https://linkedin.com/in/dana-vendor", provider: "hunter", creditsUsed: 1 }, attempts: [] });
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn, enrich }, () => {}
    );
    assert.equal(out.outcome, "inserted");
    assert.equal(out.note, "linkedin via hunter");
    const row = out.row as { decisionMaker: { linkedinUrl?: string; linkedinProvider?: string } };
    assert.equal(row.decisionMaker.linkedinUrl, "https://linkedin.com/in/dana-vendor");
    assert.equal(row.decisionMaker.linkedinProvider, "hunter");
  });

  await test("runCandidate: email+linkedin both vendor-merge -> combined note", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("no emails on this page")) as typeof fetch;
    const enrich = async (): Promise<ChainOutcome> =>
      ({ result: { email: "dana@vendor.example", linkedinUrl: "https://linkedin.com/in/dana-vendor", provider: "apollo", creditsUsed: 1 }, attempts: [] });
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn, enrich }, () => {}
    );
    assert.equal(out.outcome, "inserted");
    assert.equal(out.note, "email + linkedin via apollo");
  });

  await test("runCandidate: enrich throwing -> outcome falls back to no_email, does not throw", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("no emails on this page")) as typeof fetch;
    const enrich = async (): Promise<ChainOutcome> => { throw new Error("vendor API down"); };
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn, enrich }, () => {}
    );
    assert.equal(out.outcome, "no_email");
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
