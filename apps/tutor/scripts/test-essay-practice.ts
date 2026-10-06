/**
 * Essay-type practice nodes (FRQ / DBQ / LEQ / SAQ) and rubric-shaped keys.
 *
 * Defects this pins (GreenApple app walk 2026-10-05, M8):
 *  (a) an essay-practice skill with no stored items was "filled" by the
 *      on-demand generator with multiple-choice / one-number / short items —
 *      not essays — and those rows were banked and served again. For an
 *      essay node generation never runs, previously generated rows are not
 *      served, and an empty result says `none_available`. AUTHORED essay
 *      items (rubric-graded FRQs, authored bank rows) are served as before.
 *  (b) a generated short-answer item was banked with a RUBRIC sentence as its
 *      key ("Defensible thesis on … + one accurate specific evidence (e.g. …)")
 *      and shown to the student as the "Answer". A key that reads like a
 *      rubric or an instruction is rejected at the generation gate.
 *
 * No database, no model: injected sources throughout.
 * Run: npx tsx scripts/test-essay-practice.ts  (npm run test:essay-practice)
 */
import { strict as assert } from 'node:assert';
import {
  isEssayPracticeLoId,
  isEssayPracticeNode,
  isGeneratedPracticeItemId,
  looksLikeRubricKey,
} from '../src/lib/tutor/portal/essay-practice';
import { retrievePractice, type PracticeSources, type PlanLite, type BankLite } from '../src/lib/tutor/portal/practice';
import {
  generatePracticeItemsDetailed,
  checkGeneratedAnswer,
  type PracticeGenSources,
  type VerifyFn,
  type KeyVerifyFn,
} from '../src/lib/tutor/portal/practice-gen';
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';
import { toPlanLite } from '../src/lib/tutor/portal/adapters';
import type { GenPayload } from '../src/lib/tutor/voice/problem-generator';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}\n      ${(e as Error).message}`); }
}

/** Counts every generator touch — the assertion is that an essay node makes none. */
function countingGen(payload?: GenPayload) {
  const calls = { reserve: 0, generate: 0, persist: 0 };
  const sources: PracticeGenSources = {
    async reserve(_s, _l, n) { calls.reserve++; return n; },
    async generateAndVerify() {
      calls.generate++;
      return payload ? { gen: payload, hash: `h${calls.generate}` } : null;
    },
    async persist() { calls.persist++; },
  };
  return { calls, sources };
}
const MCQ_GEN: GenPayload = {
  problemText: 'Which thesis is most defensible?', finalAnswer: 'B', responseFormat: 'mcq', answerKind: 'mcq',
  choices: ['one', 'two', 'three', 'four'],
};
function sourcesFor(plans: PlanLite[], bank: BankLite[] = []): PracticeSources {
  return {
    async plansForLoId(loId) { return plans.filter((p) => p.los.some((l) => l.id === loId)); },
    async plansForTopic() { return []; },
    async bankForLoId(loId) { return bank.filter((b) => b.loId === loId); },
    async bankForTopic() { return []; },
  };
}
const req = (loId: string, count = 3, excludeIds?: string[]) =>
  ({ studentId: 's1', courseId: 'c1', scope: { loId }, count, ...(excludeIds ? { excludeIds } : {}) });

const ESSAY_LO = 'apgov.u1-frq-argument-essay';
const essayPlan = (withItem: boolean): PlanLite => ({
  id: 'evelyn.ap.apgov.u1-frq-argument-essay.v1', title: 'Unit 1 FRQ Practice — Argument Essay', topic: 'ap-us-government',
  los: [{ id: ESSAY_LO, standard: 'AP-APGOV-1-FRQ' }],
  segments: withItem ? [{ kind: 'try_yourself', id: 'try-full-essay', problem: 'Develop an argument that…', expectedAnswer: 'A full-credit response…', responseFormat: 'frq' }] : [],
});
const LESSON_LO = 'apgov.federalism';
const lessonPlan: PlanLite = {
  id: 'evelyn.ap.apgov.federalism.v1', title: 'Federalism', topic: 'ap-us-government', los: [{ id: LESSON_LO }], segments: [],
};

/** Genuine short-answer keys of generated items (2026-10-05 pre-generation
 *  run) — none of these may be rejected. */
const REAL_KEYS = [
  'No, not differentiable (corner at x = -3)', 'S phase', '(-6.93, 4.00)', '1.0 × 10⁻¹² M', '3P + R → T',
  '61 N horizontal; 43 N vertical', 'Active transport; moves against the gradient, requiring energy.',
  '(x-2)(x+2)(x-5)(x+5)', 'Initiator/DPE elements recognized by TAFs in TFIID, recruiting RNA Pol II', 'X + 2Y → W',
  'x^5 + C', 'a_n = 7n - 2', 'OCl⁻', 'Gene transcription fails to occur; the division genes stay off',
  'The genetically inherited infrared-reflective fur trait', '(x+1)^2 = 8(y-3)', 'Concentration (c) decreases',
  'Initiator (Inr) element', 'Implicit; use chain rule on y³ and product+chain rule on xy', '(0, -1)',
  'As x → +∞, f(x) → +∞; as x → -∞, f(x) → -∞', '(-4, 4√3)', 'aₙ = 5 · 3^(n-1)', "f''(x) = 30x - 12",
  'shifts toward products (forward reaction)', '38% to 46%', '⁷√(m^2)', 'a = 4, b = 6, c = -9', '(x - 10)^2',
  'Continuous at x = 3', 'Phosphate, ribose, adenine', 'C₆H₁₂O₆', '(x-4)/x', 'A(h) = (3/2)h^2', 'm1 (or m2)',
  "Implicit; can't easily solve for y, so use implicit differentiation", '4:9',
  'Converts to thermal energy (heat) and sound', '1s² 2s² 2p⁶ 3s² 3p³', 'Tt', 'a = 2, b = -5, c = 4',
  'Phosphotyrosines recruit relay proteins, activating downstream intracellular signaling pathways',
  'sin(φ)cos(φ)', 'x = 5π/4, 7π/4',
  // shapes that sit close to the rejected ones
  'a valid argument', 'any real number', 'Any integer', 'x + one', '2x + a', 'the point (2, 3)', 'a point mutation',
  'credit', 'The answer is 5', 'the student t-distribution', 'Students', 'It must be positive', 'response to stimuli',
  'accept electrons', 'An example of a decomposer: fungi', 'two points', 'The thesis', 'at least one', 'All real numbers',
  'It varies inversely with distance', 'should', 'the award of contracts to supporters (spoils system)',
];

/** Rubric / instruction text in the key slot. First row is the stored key
 *  from the reported item. */
const RUBRIC_KEYS = [
  'Defensible thesis on filibuster + one accurate specific evidence (e.g., Article I, Section 5 rule-making power)',
  'Student should explain how the two processes differ.', 'Students should identify one cause and one effect',
  'The student must state a claim and support it', 'Answers will vary', 'Answers may vary.', 'Responses will vary',
  'Any valid example that shows the trend', 'Any reasonable explanation of the shift', 'Any two of: A, B, C',
  'Any one of the following causes', 'Award 1 point for a correct claim', 'Award one point for each cause identified',
  '1 point for the thesis, 1 point for evidence', 'Full credit for naming both', 'Earns the point if the claim is defensible',
  'A response that identifies the cause and explains its effect', 'A response which states a claim', 'An answer that names one cause',
  'An essay that takes a clear position', 'Response must include a claim and one piece of evidence',
  'The response should reference the document', 'Must include a claim and evidence', 'Should mention the role of enzymes',
  'Accept any answer that mentions osmosis', 'Accept: mitosis or cell division', 'Acceptable answers include mitosis',
  'A defensible claim with at least one piece of specific evidence', 'Defensible claim + reasoning',
  'Clear thesis and two pieces of supporting evidence', 'A thesis statement that takes a position',
  'Thesis + two specific examples', 'Claim + at least one supporting reason', 'See rubric', 'See the scoring guidelines',
  'Sample response: The filibuster protects minority rights', 'Model answer: energy is conserved', 'Open-ended',
  'No single correct answer', 'Explain in your own words why the rate falls', 'Explanation should connect X to Y',
  'Correct identification of the trend and an accurate explanation', 'One accurate piece of evidence and a line of reasoning',
  'Possible answers include: tariffs, quotas', 'Possible answer: tariffs',
];

async function main() {
  console.log('essay-type practice nodes + rubric-shaped keys');

  // ── which LO is an essay-practice node ────────────────────────────────────
  await test('LO-id convention: unit-level FRQ / DBQ / LEQ / SAQ practice nodes', () => {
    for (const lo of [
      'apgov.u1-frq-argument-essay', 'apgov.u3-frq-concept-application', 'apgov.u5-frq-quantitative', 'apgov.u2-frq-scotus-comparison',
      'apush.u1-dbq-practice', 'apush.u9-leq-practice', 'apush.u3-saq-practice', 'apworld.u4-saq-practice',
      'apstats.u1-frq-practice', 'apcalcbc.u10-frq-practice', 'apenglang.u2-frq-practice', 'apmacro.u5-frq-practice',
    ]) assert.equal(isEssayPracticeLoId(lo), true, lo);
    for (const lo of [
      '', 'apgov.federalism', 'apenglang.timed-writing-strategy', 'apenglang.defensible-thesis', 'ap.test-strategy.frq',
      'alg1.real-numbers-operations', 'apush.u1-native-societies', 'apstats.u1-frequency-tables', 'x.u2-frqs', 'x.u2-leqx',
      'gen-0056dad8-ddbd-40fe-8edb-8f417de9eca0.lo-1', 'rev-1cd3cb42.frq-1', 'frq', 'x.frq-practice', 'x.unit1-dbq-practice',
      'x.u1-practice-frq',
    ]) assert.equal(isEssayPracticeLoId(lo), false, lo);
  });

  await test('every curated plan: the rule catches the 117 essay-practice LOs and nothing else', () => {
    const caught: string[] = [];
    for (const p of SEED_PLANS) for (const lo of p.los) {
      if (isEssayPracticeNode(lo.id, [toPlanLite(p)])) caught.push(`${lo.id}|${p.title}`);
    }
    assert.equal(new Set(caught.map((c) => c.split('|')[0])).size, 117);
    for (const c of caught) {
      assert.match(c.split('|')[1], /\b(FRQ|DBQ|LEQ|SAQ)\b.*\bPractice\b/, `caught a plan that is not an essay-practice plan: ${c}`);
    }
    // …and every curated plan titled as one is caught (no essay-practice plan slips through).
    for (const p of SEED_PLANS) {
      if (!/\b(FRQ|DBQ|LEQ|SAQ) Practice\b/.test(p.title)) continue;
      for (const lo of p.los) assert.equal(isEssayPracticeNode(lo.id, [toPlanLite(p)]), true, `${lo.id} (${p.title})`);
    }
  });

  await test('fallback for an essay plan whose LO id does not follow the convention: title AND all-FRQ items', () => {
    const frqSeg = { kind: 'try_yourself', id: 'try-1', problem: 'Write…', responseFormat: 'frq' as const };
    const mcqSeg = { kind: 'try_yourself', id: 'try-2', problem: 'Pick…', responseFormat: 'mcq' as const };
    const plan = (title: string, segments: PlanLite['segments']): PlanLite => ({ id: 'p', title, los: [{ id: 'custom.essay-node' }], segments });
    assert.equal(isEssayPracticeNode('custom.essay-node', [plan('Unit 4 DBQ Practice — Revolutions', [frqSeg])]), true);
    assert.equal(isEssayPracticeNode('custom.essay-node', [plan('Unit 4 DBQ Practice — Revolutions', [frqSeg, mcqSeg])]), false, 'mixed formats ⇒ ordinary');
    assert.equal(isEssayPracticeNode('custom.essay-node', [plan('Unit 4 DBQ Practice', [])]), false, 'title alone is not enough');
    assert.equal(isEssayPracticeNode('custom.essay-node', [plan('Timed-Writing Strategy for the Three FRQs', [frqSeg])]), false);
    assert.equal(isEssayPracticeNode('custom.essay-node', [plan('The Columbian Exchange', [frqSeg])]), false, 'an all-FRQ ordinary lesson is not an essay node');
    assert.equal(isEssayPracticeNode('custom.essay-node', []), false);
  });

  // ── (a) retrieval: no generation, no generated rows, authored items kept ──
  process.env.PRACTICE_GEN = 'on';

  await test('essay node with nothing stored: no items, emptyReason none_available, generator never touched', async () => {
    const gen = countingGen(MCQ_GEN);
    const res = await retrievePractice(req(ESSAY_LO), sourcesFor([essayPlan(false)]), gen.sources, { partnerId: 'greenapple' });
    assert.deepEqual(res.items, []);
    assert.equal(res.emptyReason, 'none_available');
    assert.deepEqual(gen.calls, { reserve: 0, generate: 0, persist: 0 });
  });

  await test('control: the same request on an ordinary lesson DOES generate (the block is specific)', async () => {
    const gen = countingGen(MCQ_GEN);
    await retrievePractice(req(LESSON_LO), sourcesFor([lessonPlan]), gen.sources, { partnerId: 'greenapple' });
    assert.ok(gen.calls.reserve === 1 && gen.calls.generate >= 1, JSON.stringify(gen.calls));
  });

  await test('essay node: the authored rubric FRQ is still served; the shortfall is not generated', async () => {
    const gen = countingGen(MCQ_GEN);
    const res = await retrievePractice(req(ESSAY_LO), sourcesFor([essayPlan(true)]), gen.sources, { partnerId: 'greenapple' });
    assert.deepEqual(res.items.map((i) => i.id), ['evelyn.ap.apgov.u1-frq-argument-essay.v1::try-full-essay']);
    assert.equal(res.items[0].responseFormat, 'frq');
    assert.equal(res.emptyReason, undefined);
    assert.deepEqual(gen.calls, { reserve: 0, generate: 0, persist: 0 });
  });

  await test('essay node: previously generated bank rows are not served; authored bank rows are', async () => {
    const bank: BankLite[] = [
      { id: `practice-gen.${ESSAY_LO}.4lew7m`, loId: ESSAY_LO, problemText: 'Take a clear position…', answer: 'Defensible thesis on filibuster + one accurate specific evidence (e.g., …)', responseFormat: 'free' },
      { id: `practice-gen.${ESSAY_LO}.1qqptov`, loId: ESSAY_LO, problemText: 'A student is writing…', answer: 'B', responseFormat: 'mcq', choices: ['a', 'b', 'c', 'd'] },
      { id: 'apgov.u1-frq-argument-essay.frq.01', loId: ESSAY_LO, problemText: 'Authored FRQ', answer: 'Model response', responseFormat: 'frq' },
    ];
    const gen = countingGen(MCQ_GEN);
    const res = await retrievePractice(req(ESSAY_LO), sourcesFor([essayPlan(true)], bank), gen.sources, { partnerId: 'greenapple' });
    assert.deepEqual(res.items.map((i) => i.id).sort(), ['apgov.u1-frq-argument-essay.frq.01', 'evelyn.ap.apgov.u1-frq-argument-essay.v1::try-full-essay']);
    assert.deepEqual(gen.calls, { reserve: 0, generate: 0, persist: 0 });
    // Only generated rows banked → the skill reads as empty, not as two MCQs.
    const only = await retrievePractice(req(ESSAY_LO), sourcesFor([essayPlan(false)], bank.slice(0, 2)), gen.sources, { partnerId: 'greenapple' });
    assert.deepEqual(only.items, []);
    assert.equal(only.emptyReason, 'none_available');
  });

  await test('essay node, all authored items already seen: none_available (never "preparing")', async () => {
    const gen = countingGen(MCQ_GEN);
    const res = await retrievePractice(
      req(ESSAY_LO, 3, ['evelyn.ap.apgov.u1-frq-argument-essay.v1::try-full-essay']),
      sourcesFor([essayPlan(true)]), gen.sources, { partnerId: 'greenapple' },
    );
    assert.deepEqual(res.items, []);
    assert.equal(res.emptyReason, 'none_available');
    assert.equal(gen.calls.generate, 0);
  });

  await test('ordinary lesson: generated bank rows are served exactly as before', async () => {
    const bank: BankLite[] = [{ id: `practice-gen.${LESSON_LO}.abc123`, loId: LESSON_LO, problemText: 'Q', answer: 'B', responseFormat: 'mcq', choices: ['a', 'b'] }];
    const res = await retrievePractice(req(LESSON_LO, 1), sourcesFor([lessonPlan], bank), countingGen().sources, { partnerId: 'crimsora' });
    assert.deepEqual(res.items.map((i) => i.id), [`practice-gen.${LESSON_LO}.abc123`]);
  });

  await test('the generator itself refuses an essay LO (covers the assigned-practice top-up path too)', async () => {
    const gen = countingGen(MCQ_GEN);
    const out = await generatePracticeItemsDetailed({ studentId: 's1', loId: 'apush.u2-dbq-practice', topic: 'ap-us-history', topicId: 'ap-us-history', shortfall: 2, anchorItems: [] }, gen.sources);
    assert.deepEqual(out.items, []);
    assert.equal(out.status, 'off');
    assert.deepEqual(gen.calls, { reserve: 0, generate: 0, persist: 0 });
    const flagged = await generatePracticeItemsDetailed({ studentId: 's1', loId: 'custom.essay-node', topic: 't', topicId: 't', shortfall: 2, anchorItems: [], essayNode: true }, gen.sources);
    assert.equal(flagged.status, 'off');
    assert.equal(gen.calls.reserve, 0);
  });

  await test('kill switch TUTOR_PRACTICE_ESSAY_GEN_BLOCK=off restores the previous behaviour', async () => {
    process.env.TUTOR_PRACTICE_ESSAY_GEN_BLOCK = 'off';
    try {
      const gen = countingGen(MCQ_GEN);
      await retrievePractice(req(ESSAY_LO), sourcesFor([essayPlan(false)]), gen.sources, { partnerId: 'greenapple' });
      assert.ok(gen.calls.generate >= 1);
    } finally {
      delete process.env.TUTOR_PRACTICE_ESSAY_GEN_BLOCK;
    }
  });

  await test('generated-item id recogniser', () => {
    assert.equal(isGeneratedPracticeItemId('practice-gen.apush.u1-dbq-practice.1a2nu2p'), true);
    for (const id of ['apush-dbq-001', 'evelyn.ap.apush.u1-dbq-practice.v1::try-1', 'brain-gen.x', '', 'xpractice-gen.a']) {
      assert.equal(isGeneratedPracticeItemId(id), false, id);
    }
  });

  // ── (b) rubric-shaped keys ────────────────────────────────────────────────
  await test('real short-answer keys are never read as rubrics', () => {
    const wrong = REAL_KEYS.filter((k) => looksLikeRubricKey(k));
    assert.deepEqual(wrong, []);
  });

  await test('rubric / instruction text in the key slot is recognised', () => {
    const missed = RUBRIC_KEYS.filter((k) => !looksLikeRubricKey(k));
    assert.deepEqual(missed, []);
  });

  await test('generation gate: a free item with a rubric-shaped key fails "free_rubric_key" before any model call', async () => {
    let verifyCalls = 0;
    const verify: VerifyFn = async () => { verifyCalls++; return { agree: true }; };
    const verifyKey: KeyVerifyFn = async () => { verifyCalls++; return { status: 'verified', model: 'stub' }; };
    const out = await checkGeneratedAnswer(
      { problemText: 'Take a clear position on the following question and defend it with evidence.', finalAnswer: RUBRIC_KEYS[0], answerKind: 'free', expectedAnswer: RUBRIC_KEYS[0] },
      verify, verifyKey,
    );
    assert.deepEqual(out, { ok: false, reason: 'free_rubric_key' });
    assert.equal(verifyCalls, 0);
  });

  await test('generation gate: a genuine free key still passes', async () => {
    const verifyKey: KeyVerifyFn = async () => ({ status: 'verified', model: 'stub' });
    const out = await checkGeneratedAnswer(
      { problemText: 'In which phase of the cell cycle is DNA replicated?', finalAnswer: 'S phase', answerKind: 'free', expectedAnswer: 'S phase' },
      async () => ({ agree: true }), verifyKey,
    );
    assert.equal(out.ok, true);
  });

  delete process.env.PRACTICE_GEN;
  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}
main();
