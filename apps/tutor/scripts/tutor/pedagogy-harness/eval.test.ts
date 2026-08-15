/**
 * Deterministic unit tests for Task H5 — Layer-1 gates (assertions.ts),
 * Layer-2 advisory Sonnet judge (judge.ts), and the markdown report
 * generator (report.ts). No framework — matches student-simulator.test.ts /
 * run-harness.test.ts / fixtures/personas/personas.test.ts: node:assert +
 * a tiny test() harness, PASS/FAIL counters, non-zero exit on failure.
 *
 * ALL CANNED — hand-built `Bundle` fixtures, no live run, no browser. The
 * judge test injects a STUB `complete` (opts.complete) so NO network call
 * is ever made here.
 *
 * Run: npm run test:pedagogy-gates
 */

import { strict as assert } from 'node:assert';
import type { Bundle, BundleTurn } from './run-harness';
import { runGates, BANNED_SELL_PHRASES } from './assertions';
import { judgeBundle, type RubricItem, type JudgeScore } from './judge';
import { renderReport, type ScenarioResult } from './report';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void | Promise<void>): void | Promise<void> {
  try {
    const r = fn();
    if (r instanceof Promise) {
      return r
        .then(() => { console.log(`  ✓ ${name}`); passed++; })
        .catch((err) => { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; });
    }
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

/** Minimal Bundle builder — fills in only what a test cares about. */
function makeBundle(overrides: Partial<Bundle> & { turns?: Array<Partial<BundleTurn>> } = {}): Bundle {
  const turns: BundleTurn[] = (overrides.turns ?? []).map((t, index) => ({
    index,
    tutorText: '',
    toolCalls: [],
    studentReply: '',
    ended: false,
    ...t,
  }));
  return {
    persona: { id: 'maya', mode: 'demo' },
    meta: { baseUrl: 'http://localhost:3006', maxTurns: 3 },
    ...overrides,
    turns,
  };
}

async function main() {
  // ── runGates: framework ──────────────────────────────────────────────
  await test('runGates: unknown taskId returns an empty array', () => {
    const bundle = makeBundle({ turns: [{ tutorText: 'hi', toolCalls: [{}] }] });
    assert.deepEqual(runGates(bundle, 'does-not-exist'), []);
  });

  // ── proactive-opener (B2) ────────────────────────────────────────────
  await test('proactive-opener: bundle with a non-empty opener turn PASSES', () => {
    const bundle = makeBundle({ turns: [{ tutorText: 'Hi Maya! Check this out...', toolCalls: [{}] }] });
    const results = runGates(bundle, 'B2');
    const gate = results.find((g) => g.id === 'proactive-opener');
    assert.ok(gate, 'proactive-opener gate present for B2');
    assert.equal(gate!.ok, true);
  });

  await test('proactive-opener: bundle with an empty turns[] FAILS', () => {
    const bundle = makeBundle({ turns: [] });
    const results = runGates(bundle, 'B2');
    const gate = results.find((g) => g.id === 'proactive-opener');
    assert.ok(gate);
    assert.equal(gate!.ok, false);
  });

  await test('proactive-opener: bundle whose turns[0].tutorText is empty/whitespace FAILS', () => {
    const bundle = makeBundle({ turns: [{ tutorText: '   ', toolCalls: [{}] }] });
    const results = runGates(bundle, 'B2');
    const gate = results.find((g) => g.id === 'proactive-opener');
    assert.equal(gate!.ok, false);
  });

  // ── board-not-blank (B3) ─────────────────────────────────────────────
  await test('board-not-blank: opener turn with tool calls PASSES', () => {
    const bundle = makeBundle({ turns: [{ tutorText: 'hi', toolCalls: [{ message: 'show_diagram' }] }] });
    const results = runGates(bundle, 'B3');
    const gate = results.find((g) => g.id === 'board-not-blank');
    assert.ok(gate);
    assert.equal(gate!.ok, true);
  });

  await test('board-not-blank: opener turn with zero tool calls FAILS', () => {
    const bundle = makeBundle({ turns: [{ tutorText: 'hi', toolCalls: [] }] });
    const results = runGates(bundle, 'B3');
    const gate = results.find((g) => g.id === 'board-not-blank');
    assert.equal(gate!.ok, false);
  });

  // ── no-sell-phrase (E2) ──────────────────────────────────────────────
  await test('no-sell-phrase: banned phrase list is exported and non-empty', () => {
    assert.ok(Array.isArray(BANNED_SELL_PHRASES) && BANNED_SELL_PHRASES.length > 0);
  });

  await test('no-sell-phrase: a tutorText that says "sign up now" FAILS', () => {
    const bundle = makeBundle({
      turns: [
        { tutorText: 'Great work today!', toolCalls: [{}] },
        { tutorText: "You're doing great — sign up now to keep going!", toolCalls: [{}] },
      ],
    });
    const results = runGates(bundle, 'E2');
    const gate = results.find((g) => g.id === 'no-sell-phrase');
    assert.ok(gate);
    assert.equal(gate!.ok, false);
    assert.ok(/turn 1/i.test(gate!.detail), 'detail names the offending turn');
  });

  await test('no-sell-phrase: clean transcript with no sell phrases PASSES', () => {
    const bundle = makeBundle({
      turns: [
        { tutorText: 'Great work today!', toolCalls: [{}] },
        { tutorText: 'You really nailed factoring — nice job.', toolCalls: [{}] },
      ],
    });
    const results = runGates(bundle, 'E2');
    const gate = results.find((g) => g.id === 'no-sell-phrase');
    assert.equal(gate!.ok, true);
  });

  await test('no-sell-phrase: "subscribe", "enroll now", and "upgrade" are each individually banned', () => {
    for (const phrase of ['please subscribe to continue', 'enroll now for more', 'upgrade your plan today']) {
      const bundle = makeBundle({ turns: [{ tutorText: phrase, toolCalls: [{}] }] });
      const gate = runGates(bundle, 'E2').find((g) => g.id === 'no-sell-phrase');
      assert.equal(gate!.ok, false, `"${phrase}" should fail the gate`);
    }
  });

  // ── zero-persistence-demo (privacy) ──────────────────────────────────
  await test('zero-persistence-demo: demo bundle with NO sessionResult PASSES', () => {
    const bundle = makeBundle({ turns: [{ tutorText: 'hi', toolCalls: [{}] }] });
    const gate = runGates(bundle, 'D3').find((g) => g.id === 'zero-persistence-demo');
    assert.ok(gate);
    assert.equal(gate!.ok, true);
  });

  await test('zero-persistence-demo: demo bundle whose sessionResult has EMPTY deltas PASSES', () => {
    const bundle = makeBundle({
      turns: [{ tutorText: 'hi', toolCalls: [{}] }],
      sessionResult: {
        learningStateDelta: { gaps: { new: [], promoted: [], resolved: [] }, mastery: [] },
        socialMemoryDelta: { new: [], referenced: [] },
      },
    });
    const gate = runGates(bundle, 'D3').find((g) => g.id === 'zero-persistence-demo');
    assert.equal(gate!.ok, true);
  });

  await test('zero-persistence-demo: demo bundle with a populated sessionResult delta FAILS', () => {
    const bundle = makeBundle({
      turns: [{ tutorText: 'hi', toolCalls: [{}] }],
      sessionResult: {
        learningStateDelta: { gaps: { new: [], promoted: [], resolved: [] }, mastery: [] },
        socialMemoryDelta: { new: [{ id: 'thread-1', kind: 'interest' }], referenced: [] },
      },
    });
    const gate = runGates(bundle, 'D3').find((g) => g.id === 'zero-persistence-demo');
    assert.ok(gate);
    assert.equal(gate!.ok, false);
  });

  await test('zero-persistence-demo: a populated learningStateDelta.mastery also FAILS', () => {
    const bundle = makeBundle({
      turns: [{ tutorText: 'hi', toolCalls: [{}] }],
      sessionResult: {
        learningStateDelta: { gaps: { new: [], promoted: [], resolved: [] }, mastery: [{ loId: 'lo-1', level: 'proficient' }] },
      },
    });
    const gate = runGates(bundle, 'D3').find((g) => g.id === 'zero-persistence-demo');
    assert.equal(gate!.ok, false);
  });

  // ── judgeBundle: injectable, advisory, structured scores ────────────
  await test('judgeBundle: stub complete returning canned JSON parses scores, flagged = score < 4, no network', async () => {
    const rubric: RubricItem[] = [
      { id: 'opener-warmth', question: 'Does the opener feel warm and intentional?' },
      { id: 'no-quiz-feel', question: 'Does calibration avoid feeling like a quiz?' },
    ];
    const bundle = makeBundle({
      turns: [{ tutorText: 'Hi! Check this out.', toolCalls: [{}], studentReply: 'cool' }],
    });
    const canned: JudgeScore[] = [
      { id: 'opener-warmth', score: 5, rationale: 'Warm and specific greeting.' },
      { id: 'no-quiz-feel', score: 2, rationale: 'Reads like a rapid-fire quiz.' },
    ];
    let calls = 0;
    const stubComplete = async () => { calls++; return JSON.stringify(canned); };
    const result = await judgeBundle(bundle, rubric, { complete: stubComplete });
    assert.equal(calls, 1, 'exactly one LLM call made (the injected stub, never the network)');
    assert.equal(result.scores.length, 2);
    assert.deepEqual(result.scores, canned);
    assert.equal(result.flagged.length, 1);
    assert.equal(result.flagged[0].id, 'no-quiz-feel');
  });

  await test('judgeBundle: low scores never throw (advisory, not a killer)', async () => {
    const rubric: RubricItem[] = [{ id: 'x', question: 'q' }];
    const bundle = makeBundle({ turns: [{ tutorText: 'hi', toolCalls: [{}] }] });
    const stubComplete = async () => JSON.stringify([{ id: 'x', score: 1, rationale: 'bad' }]);
    const result = await judgeBundle(bundle, rubric, { complete: stubComplete });
    assert.equal(result.flagged.length, 1);
    assert.equal(result.scores[0].score, 1);
  });

  await test('judgeBundle: prompt passed to complete carries the transcript and every rubric question', async () => {
    const rubric: RubricItem[] = [{ id: 'q1', question: 'Is the pacing appropriate?' }];
    const bundle = makeBundle({
      turns: [{ tutorText: 'Let\'s look at quadratics.', toolCalls: [{}], studentReply: 'ok cool' }],
    });
    let seenUser = '';
    const stubComplete = async (_system: string, messages: { role: 'user' | 'assistant'; content: string }[]) => {
      seenUser = messages.map((m) => m.content).join('\n');
      return JSON.stringify([{ id: 'q1', score: 4, rationale: 'fine' }]);
    };
    await judgeBundle(bundle, rubric, { complete: stubComplete });
    assert.ok(seenUser.includes('quadratics'), 'transcript tutorText present in the prompt');
    assert.ok(seenUser.includes('ok cool'), 'transcript studentReply present in the prompt');
    assert.ok(seenUser.includes('Is the pacing appropriate?'), 'rubric question present in the prompt');
  });

  await test('judgeBundle: unparseable JSON from complete does not throw (falls back to empty/advisory result)', async () => {
    const rubric: RubricItem[] = [{ id: 'x', question: 'q' }];
    const bundle = makeBundle({ turns: [{ tutorText: 'hi', toolCalls: [{}] }] });
    const stubComplete = async () => 'not json at all';
    const result = await judgeBundle(bundle, rubric, { complete: stubComplete });
    assert.deepEqual(result.scores, []);
    assert.deepEqual(result.flagged, []);
  });

  // ── renderReport: pure markdown, deterministic ───────────────────────
  await test('renderReport: contains a roll-up table with L1 pass/fail and L2 flagged counts', () => {
    const results: ScenarioResult[] = [
      {
        taskId: 'B2',
        persona: 'maya',
        gates: [
          { id: 'proactive-opener', ok: true, detail: 'turn 0 has text' },
          { id: 'board-not-blank', ok: false, detail: 'no tool calls' },
        ],
        judge: {
          scores: [
            { id: 'opener-warmth', score: 5, rationale: 'great' },
            { id: 'no-quiz-feel', score: 2, rationale: 'quizzy' },
          ],
          flagged: [{ id: 'no-quiz-feel', score: 2, rationale: 'quizzy' }],
        },
        anomalies: ['tutor repeated itself once'],
      },
    ];
    const md = renderReport(results);
    assert.ok(md.includes('B2'), 'roll-up mentions the task id');
    assert.ok(md.includes('maya'), 'roll-up mentions the persona');
    assert.ok(md.includes('1/2'), 'roll-up shows L1 pass/fail count (1 of 2 gates passed)');
    assert.ok(md.includes('1'), 'roll-up shows L2 flagged count');
    assert.ok(md.includes('proactive-opener'), 'per-scenario detail lists each gate id');
    assert.ok(md.includes('turn 0 has text'), 'per-scenario detail includes gate detail');
    assert.ok(md.includes('board-not-blank'), 'per-scenario detail lists the failing gate too');
    assert.ok(md.includes('opener-warmth'), 'per-scenario detail lists each judge score id');
    assert.ok(md.includes('quizzy'), 'per-scenario detail includes judge rationale');
    assert.ok(md.includes('tutor repeated itself once'), 'per-scenario detail includes anomalies');
  });

  await test('renderReport: multiple scenarios each get their own roll-up row and detail section', () => {
    const results: ScenarioResult[] = [
      { taskId: 'B2', persona: 'maya', gates: [{ id: 'proactive-opener', ok: true, detail: 'ok' }] },
      { taskId: 'B3', persona: 'leo', gates: [{ id: 'board-not-blank', ok: true, detail: 'ok' }] },
    ];
    const md = renderReport(results);
    assert.ok(md.includes('B2') && md.includes('maya'));
    assert.ok(md.includes('B3') && md.includes('leo'));
  });

  await test('renderReport: a scenario with no judge/anomalies still renders cleanly (both optional)', () => {
    const results: ScenarioResult[] = [
      { taskId: 'B2', persona: 'maya', gates: [{ id: 'proactive-opener', ok: true, detail: 'ok' }] },
    ];
    const md = renderReport(results);
    assert.ok(md.includes('B2'));
    assert.ok(typeof md === 'string' && md.length > 0);
  });

  await test('renderReport: is pure — calling it twice with the same input yields identical output', () => {
    const results: ScenarioResult[] = [
      { taskId: 'B2', persona: 'maya', gates: [{ id: 'proactive-opener', ok: true, detail: 'ok' }] },
    ];
    assert.equal(renderReport(results), renderReport(results));
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
