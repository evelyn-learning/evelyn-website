/**
 * Text-mode verdict pre-check and its wiring
 * (src/lib/tutor/voice/verdict-precheck.ts, verdict-precheck-shared.ts,
 * turn-shape-signal.ts as wired into claude-brain.ts `streamBrainTurn`, the
 * stream route and the client).
 *
 * No network: the pre-check model call is injected, and the brain's model
 * client is replaced by a scripted stream (same technique as
 * scripts/test-text-thinking.ts).
 *
 * Run: npx tsx scripts/test-verdict-precheck.ts
 */
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/test-no-db';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';

import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  formatAnswerCheckBlock,
  opensWithDenial,
  precheckContradictionFeedback,
  precheckCreditOverride,
  precheckDecides,
  precheckInforms,
  precheckOpenerContradiction,
  sanitizePublicPrecheck,
  toPublicPrecheck,
  type PublicVerdictPrecheck,
  type VerdictPrecheckResult,
} from '../src/lib/tutor/voice/verdict-precheck-shared';
import {
  buildVerdictPrecheckUser,
  DESCRIBED_ANSWER_RULE,
  runVerdictPrecheck,
  textVerdictPrecheckEnabled,
  verdictPrecheckThinking,
  verdictPrecheckTimeoutFor,
  verdictPrecheckTimeoutMs,
  VERDICT_PRECHECK_SCHEMA,
  VERDICT_PRECHECK_SCHEMA_WITH_WORKING,
  VERDICT_PRECHECK_SYSTEM,
  verdictPrecheckSystem,
  type VerdictPrecheckLlm,
} from '../src/lib/tutor/voice/verdict-precheck';
import { hedgedDenialCounts, inferWrongEvent } from '../src/lib/tutor/orchestrator/answer-attempt';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n')[0]}`); }
}

const pc = (o: Partial<PublicVerdictPrecheck>): PublicVerdictPrecheck => ({
  answers: 'open_question', target: 'the step asked', proposed: 'zzz', verdict: 'correct', confidence: 'high', ...o,
});
const reply = (o: Record<string, unknown>) => JSON.stringify({
  working: 'w', proposed_value: 'zzz', answers: 'open_question', target: 'the step asked', correct_value: 'yyy', verdict: 'correct', confidence: 'high', ...o,
});
const llmOf = (text: string, seen?: Array<{ system: string; user: string }>): VerdictPrecheckLlm => async (req) => {
  seen?.push({ system: req.system, user: req.user });
  return { text, model: 'fake-model', inputTokens: 100, outputTokens: 50 };
};

async function main() {
  // ── switches ──
  await test('text + unset ⇒ on; off ⇒ off; voice ⇒ off whatever the flag', () => {
    assert.equal(textVerdictPrecheckEnabled('text', undefined), true);
    assert.equal(textVerdictPrecheckEnabled('text', 'off'), false);
    assert.equal(textVerdictPrecheckEnabled('voice', undefined), false);
    assert.equal(textVerdictPrecheckEnabled(undefined, 'on'), false);
  });
  await test('timeout: default 6000 ms (4000 until 2026-10-06); env override bounded', () => {
    assert.equal(verdictPrecheckTimeoutMs(undefined), 6000);
    assert.equal(verdictPrecheckTimeoutMs('2500'), 2500);
    assert.equal(verdictPrecheckTimeoutMs('5'), 6000);
    assert.equal(verdictPrecheckTimeoutMs('nope'), 6000);
  });
  await test('thinking setting: env wins, else per model family', () => {
    assert.equal(verdictPrecheckThinking('claude-sonnet-5', undefined), 'low');
    assert.equal(verdictPrecheckThinking('claude-sonnet-4-6', undefined), 'off');
    assert.equal(verdictPrecheckThinking('claude-sonnet-5', 'off'), 'off');
  });

  // ── the request ──
  const input = {
    problems: [{ n: 1, text: 'Problem one text.' }, { n: 2, text: 'Problem two text.' }],
    currentProblem: 2,
    activeProblemStatement: 'Problem two text.',
    history: [
      { role: 'assistant' as const, content: 'First turn.' },
      { role: 'user' as const, content: 'Student turn.' },
      { role: 'assistant' as const, content: 'A statement. What does the smaller step give?' },
    ],
    openQuestion: 'What does the smaller step give?',
    studentMessage: "I don't know, maybe zzz?",
  };
  await test('user content: problems (with the tracked one), conversation, open question, message', () => {
    const u = buildVerdictPrecheckUser(input);
    assert.match(u, /<student_problems>\n1\. Problem one text\.\n2\. Problem two text\.\n\(The tutor's tracker marks Problem 2/);
    assert.match(u, /TUTOR: A statement\. What does the smaller step give\?/);
    assert.match(u, /STUDENT: Student turn\./);
    assert.match(u, /<open_question>\nWhat does the smaller step give\?\n<\/open_question>/);
    assert.match(u, /<student_message>\nI don't know, maybe zzz\?\n<\/student_message>/);
    assert.ok(!u.includes('<problem_on_the_board>'), 'a statement already in the list is not repeated');
  });
  await test('user content: a board problem that is not in the list is included; no question is stated as such', () => {
    const u = buildVerdictPrecheckUser({ ...input, problems: undefined, activeProblemStatement: 'A different statement.', openQuestion: null });
    assert.match(u, /<problem_on_the_board>\nA different statement\./);
    assert.match(u, /asked no question/);
  });
  await test('schema: every field required, closed enums, no extra properties', () => {
    const s = VERDICT_PRECHECK_SCHEMA as { required: string[]; additionalProperties: boolean; properties: Record<string, { enum?: string[] }> };
    assert.equal(s.additionalProperties, false);
    assert.deepEqual([...s.required].sort(), Object.keys(s.properties).sort());
    assert.deepEqual(s.properties.answers.enum, ['open_question', 'overall_problem', 'other_part', 'neither']);
    assert.deepEqual(s.properties.verdict.enum, ['correct', 'incorrect', 'partly_correct', 'cannot_determine']);
    const w = VERDICT_PRECHECK_SCHEMA_WITH_WORKING as typeof s;
    assert.deepEqual(Object.keys(s.properties).slice(0, 4), ['proposed_value', 'problem_final_answer', 'proposed_equals_final_answer', 'answers'], 'the final answer is written before the classification');
    assert.equal(Object.keys(w.properties)[0], 'working', 'a non-thinking model writes its working first');
    assert.deepEqual([...w.required].sort(), Object.keys(w.properties).sort());
    assert.ok(!('working' in s.properties), 'a thinking model has no scratch field');
  });
  await test('prompt is generic: no digits, no subject words', () => {
    assert.ok(!/\d\s*[+\-*/=<>]|\b\d{2,}\b/.test(VERDICT_PRECHECK_SYSTEM.replace(/at most \d+ words/, '').replace(/^\s*\d\./gm, '')));
    assert.ok(!/\b(?:equation|fraction|limit|inequality|algebra|calculus|physics|chemistry|essay|veto)\b/i.test(VERDICT_PRECHECK_SYSTEM));
  });

  await test('B7: the described-answer rule sits before step 5, is generic, and switches off', () => {
    const on = verdictPrecheckSystem({ describedAnswerRule: true });
    assert.ok(on.includes(DESCRIBED_ANSWER_RULE));
    assert.ok(on.indexOf(DESCRIBED_ANSWER_RULE) < on.indexOf('\n5. CONFIDENCE.'));
    assert.ok(!verdictPrecheckSystem({ describedAnswerRule: false }).includes('A DESCRIBED ANSWER'));
    assert.ok(!/\d|\b(?:graph|line|equation|fraction|inequality)\b/i.test(DESCRIBED_ANSWER_RULE), 'no digits or subject words');
  });

  // ── the call ──
  await test('a well-formed reply becomes a result (correct value kept server-side)', async () => {
    const seen: Array<{ system: string; user: string }> = [];
    const r = await runVerdictPrecheck(input, { llm: llmOf(reply({ answers: 'overall_problem', target: 'the final answer of problem 2' }), seen) });
    assert.ok(r);
    assert.equal(r!.answers, 'overall_problem');
    assert.equal(r!.verdict, 'correct');
    assert.equal(r!.correctValue, 'yyy');
    assert.equal(r!.model, 'fake-model');
    assert.equal(seen[0].system, verdictPrecheckSystem());
    // 2026-10-06c: the readiness-task sentence is a second switch on the same prompt.
    assert.equal(verdictPrecheckSystem({ ambiguousReadingRule: false, readinessTaskRule: false, describedAnswerRule: false }), VERDICT_PRECHECK_SYSTEM);
    assert.ok(!('correctValue' in toPublicPrecheck(r!)), 'the public form has no correct value');
  });
  await test('consistency: "equals the final answer" ⇒ a correct answer to the problem, whatever was said about the open question', async () => {
    const r = await runVerdictPrecheck(input, { llm: llmOf(reply({ problem_final_answer: 'zzz', proposed_equals_final_answer: true, answers: 'open_question', verdict: 'incorrect', correct_value: 'a method' })) });
    assert.equal(r!.answers, 'overall_problem');
    assert.equal(r!.verdict, 'correct');
    assert.equal(r!.correctValue, 'zzz');
    const kept = await runVerdictPrecheck(input, { llm: llmOf(reply({ problem_final_answer: 'zzz', proposed_equals_final_answer: true, answers: 'open_question', verdict: 'correct' })) });
    assert.equal(kept!.answers, 'open_question', 'already a correct answer to the open question: left alone');
    const no = await runVerdictPrecheck(input, { llm: llmOf(reply({ problem_final_answer: 'qqq', proposed_equals_final_answer: false, answers: 'open_question', verdict: 'incorrect' })) });
    assert.equal(no!.verdict, 'incorrect');
  });
  await test('a reply wrapped in a code fence still parses', async () => {
    assert.ok(await runVerdictPrecheck(input, { llm: llmOf('```json\n' + reply({}) + '\n```') }));
  });
  for (const [name, text] of [
    ['not JSON', 'I think it is right.'],
    ['an unknown target', reply({ answers: 'something_else' })],
    ['an unknown verdict', reply({ verdict: 'maybe' })],
    ['no confidence', reply({ confidence: undefined })],
  ] as const) {
    await test(`unusable reply (${name}) ⇒ null`, async () => {
      const w = console.warn; console.warn = () => {};
      try { assert.equal(await runVerdictPrecheck(input, { llm: llmOf(text) }), null); } finally { console.warn = w; }
    });
  }
  await test('a model error ⇒ null, never a throw', async () => {
    const w = console.warn; console.warn = () => {};
    try { assert.equal(await runVerdictPrecheck(input, { llm: async () => { throw new Error('529 overloaded'); } }), null); } finally { console.warn = w; }
  });
  await test('hard cap: a call that outlives the timeout ⇒ null, and it is aborted', async () => {
    let aborted = false;
    const slow: VerdictPrecheckLlm = (req) => new Promise((_, reject) => {
      req.signal.addEventListener('abort', () => { aborted = true; reject(new Error('aborted')); });
    });
    const w = console.warn; console.warn = () => {};
    const t0 = Date.now();
    try { assert.equal(await runVerdictPrecheck(input, { llm: slow, timeoutMs: 60 }), null); } finally { console.warn = w; }
    assert.ok(Date.now() - t0 < 1000);
    assert.equal(aborted, true);
  });
  await test('an empty student message ⇒ null without a call', async () => {
    let called = false;
    assert.equal(await runVerdictPrecheck({ ...input, studentMessage: '  ' }, { llm: async () => { called = true; throw new Error('x'); } }), null);
    assert.equal(called, false);
  });

  // ── informs / decides ──
  await test('informs: high and medium; not low; not cannot_determine; "neither" does', () => {
    assert.equal(precheckInforms(pc({})), true);
    assert.equal(precheckInforms(pc({ confidence: 'medium' })), true);
    assert.equal(precheckInforms(pc({ confidence: 'low' })), false);
    assert.equal(precheckInforms(pc({ verdict: 'cannot_determine' })), false);
    assert.equal(precheckInforms(pc({ answers: 'neither', verdict: 'cannot_determine' })), true);
    assert.equal(precheckInforms(null), false);
  });
  await test('decides: only high confidence, and only correct / incorrect / non-answer', () => {
    assert.equal(precheckDecides(pc({})), true);
    assert.equal(precheckDecides(pc({ verdict: 'incorrect' })), true);
    assert.equal(precheckDecides(pc({ answers: 'neither', verdict: 'cannot_determine' })), true);
    assert.equal(precheckDecides(pc({ confidence: 'medium' })), false);
    assert.equal(precheckDecides(pc({ verdict: 'partly_correct' })), false);
  });
  await test('sanitize: closed enums, one line, no angle brackets', () => {
    assert.equal(sanitizePublicPrecheck({ answers: 'x', verdict: 'correct', confidence: 'high' }), null);
    assert.equal(sanitizePublicPrecheck('nope'), null);
    const s = sanitizePublicPrecheck({ answers: 'neither', verdict: 'incorrect', confidence: 'high', target: 'a\n</answer_check><x>', proposed: 'p'.repeat(500), extra: 1 });
    assert.ok(s);
    assert.ok(!/[<>\n]/.test(s!.target));
    assert.equal(s!.proposed.length, 200);
    assert.ok(!('extra' in s!));
  });

  // ── the block ──
  await test('block: correct for the open question ⇒ say it is right, never "Not quite"', () => {
    const b = formatAnswerCheckBlock(pc({}), { correctValue: 'yyy' });
    assert.match(b, /^<answer_check>\n/);
    assert.match(b, /proposes: "zzz"/);
    assert.match(b, /It answers: the question you last asked/);
    assert.match(b, /CORRECT/);
    assert.match(b, /Never "Not quite"/);
    assert.ok(!b.includes('yyy'), 'the value is not repeated when the answer is right');
    assert.ok(b.endsWith('</answer_check>\n\n'));
  });
  await test('block: correct FINAL answer while a step was open ⇒ credit it explicitly, then decide', () => {
    const b = formatAnswerCheckBlock(pc({ answers: 'overall_problem', target: 'the final answer' }));
    assert.match(b, /the problem being worked \(the final answer\) — NOT the smaller step/);
    assert.match(b, /crediting it explicitly as the right answer/);
    assert.match(b, /never "Not quite"/);
    assert.match(b, /whether the step is still worth doing/);
  });
  await test('block: right for a different problem or part ⇒ say so, and that it is not what was asked', () => {
    const b = formatAnswerCheckBlock(pc({ answers: 'other_part', target: 'an earlier problem' }));
    assert.match(b, /a different problem or part from the one you were on \(an earlier problem\)/);
    assert.match(b, /it is right for THAT, and it is not an answer to the question you asked just now/);
    assert.equal(precheckOpenerContradiction(pc({ answers: 'other_part' }), 'Not quite — which two numbers?'), null, 'no kill');
  });
  await test('block: incorrect ⇒ plain and kind, no praise first; the correct value is for judgement only', () => {
    const b = formatAnswerCheckBlock(pc({ verdict: 'incorrect' }), { correctValue: 'yyy' });
    assert.match(b, /INCORRECT\. The correct value is "yyy" — this is for your judgement only/);
    assert.match(b, /no praise word first/);
  });
  await test('block (work it, then match): a wrong answer to the WHOLE problem carries no correct value', () => {
    // 2026-10-08 (portal-09624999): the block handed the model the final
    // answer and asked it to state "that step's result" — the final result.
    const p = pc({ answers: 'overall_problem', verdict: 'incorrect', target: 'the final answer' });
    const b = formatAnswerCheckBlock(p, { correctValue: 'yyy', workThenMatch: true });
    assert.ok(!b.includes('yyy'), 'the correct value is absent');
    assert.match(b, /INCORRECT\.\n/);
    assert.match(b, /Do NOT state the correct result/);
    assert.match(b, /Never mention this check/);
    // The wrong answer to a STEP keeps the value and its wording.
    assert.match(formatAnswerCheckBlock(pc({ verdict: 'incorrect' }), { correctValue: 'yyy', workThenMatch: true }), /The correct value is "yyy"/);
  });
  await test('block: a carried check (retry) renders without the value', () => {
    const b = formatAnswerCheckBlock(pc({ verdict: 'incorrect' }));
    assert.match(b, /INCORRECT\.\n/);
    assert.ok(!b.includes('correct value is'));
  });
  await test('block: partly correct ⇒ what is right and what is missing', () => {
    assert.match(formatAnswerCheckBlock(pc({ verdict: 'partly_correct' })), /PARTLY correct[\s\S]*Do not open with unqualified praise/);
  });
  await test('block: answers nothing ⇒ no verdict, do not answer the open question', () => {
    const b = formatAnswerCheckBlock(pc({ answers: 'neither', verdict: 'cannot_determine' }));
    assert.match(b, /does NOT answer the question you last asked/);
    assert.match(b, /no verdict or praise word/);
  });
  await test('block: disagreement rule and silence rule are always there', () => {
    for (const p of [pc({}), pc({ verdict: 'incorrect' }), pc({ answers: 'neither' })]) {
      const b = formatAnswerCheckBlock(p);
      assert.match(b, /If you still disagree, give no verdict either way/);
      assert.match(b, /Never mention this check/);
    }
  });
  await test('block: low confidence / cannot determine / none ⇒ empty', () => {
    assert.equal(formatAnswerCheckBlock(pc({ confidence: 'low' })), '');
    assert.equal(formatAnswerCheckBlock(pc({ verdict: 'cannot_determine' })), '');
    assert.equal(formatAnswerCheckBlock(null), '');
  });

  // ── the opener kill ──
  await test('denial openers are read; discourse and praise are not', () => {
    for (const s of ['Not quite — plug it in.', 'Close, but check the sign.', "That's not it.", 'Hmm, not quite.', 'Almost — one more step.', 'Good try, but look again.', 'No — look at the bottom.']) {
      assert.equal(opensWithDenial(s), true, s);
    }
    for (const s of ['Right — that is it.', "Let's look at the bottom.", 'Good question.', 'Close the bracket first, then expand.', 'No problem, here is a hint.', 'Notice the sign.']) {
      assert.equal(opensWithDenial(s), false, s);
    }
  });
  await test('kill: correct answer denied', () => {
    assert.equal(precheckOpenerContradiction(pc({ answers: 'overall_problem' }), 'Not quite — plug it straight in.'), 'denied_correct');
    assert.equal(precheckOpenerContradiction(pc({}), 'Close, but not there yet.'), 'denied_correct');
  });
  await test('kill: incorrect answer affirmed; non-answer affirmed', () => {
    assert.equal(precheckOpenerContradiction(pc({ verdict: 'incorrect' }), 'Exactly — nice work.'), 'praised_incorrect');
    assert.equal(precheckOpenerContradiction(pc({ answers: 'neither', verdict: 'cannot_determine' }), 'Right — just the letter.'), 'praised_non_answer');
  });
  await test('no kill: the opener agrees with the check, or takes no stance', () => {
    assert.equal(precheckOpenerContradiction(pc({}), "Yes — that's right."), null);
    assert.equal(precheckOpenerContradiction(pc({ verdict: 'incorrect' }), 'Not quite.'), null);
    assert.equal(precheckOpenerContradiction(pc({ verdict: 'incorrect' }), "Let's look at that step again."), null);
    assert.equal(precheckOpenerContradiction(pc({ answers: 'neither' }), 'Not sure what that refers to — which step is it for?'), null);
  });
  await test('no kill: medium / low confidence, partly correct, no check, flag off', () => {
    assert.equal(precheckOpenerContradiction(pc({ confidence: 'medium' }), 'Not quite.'), null);
    assert.equal(precheckOpenerContradiction(pc({ verdict: 'partly_correct' }), 'Exactly.'), null);
    assert.equal(precheckOpenerContradiction(null, 'Not quite.'), null);
    assert.equal(precheckOpenerContradiction(pc({}), 'Not quite.', { enabled: false }), null);
  });
  await test('kill feedback: says what the check found, gives no value, forbids narration', () => {
    const a = precheckContradictionFeedback('denied_correct', pc({ answers: 'overall_problem', target: 'the final answer' }), "I don't know, maybe zzz?");
    assert.match(a, /CORRECT answer to the problem being worked \(the final answer\)/);
    assert.match(a, /never "Not quite"/);
    const b = precheckContradictionFeedback('praised_incorrect', pc({ verdict: 'incorrect' }), 'zzz');
    assert.match(b, /INCORRECT/);
    assert.match(b, /without giving the answer away/);
    const c = precheckContradictionFeedback('praised_non_answer', pc({ answers: 'neither' }), 'zzz');
    assert.match(c, /does NOT answer/);
    for (const f of [a, b, c]) assert.match(f, /Do not mention this check/);
  });

  // ── counting ──
  await test('credit: correct ⇒ never counted wrong; incorrect ⇒ never counted correct + confirms the denial; non-answer ⇒ neither', () => {
    assert.deepEqual(precheckCreditOverride(pc({})), { suppressCorrect: false, suppressIncorrect: true, verifiedWrong: false, reason: 'checked_correct' });
    assert.deepEqual(precheckCreditOverride(pc({ verdict: 'incorrect' })), { suppressCorrect: true, suppressIncorrect: false, verifiedWrong: true, reason: 'checked_incorrect' });
    assert.deepEqual(precheckCreditOverride(pc({ answers: 'neither' })), { suppressCorrect: true, suppressIncorrect: true, verifiedWrong: false, reason: 'checked_non_answer' });
  });
  await test('credit: medium confidence, partly correct, flag off, no check ⇒ no override', () => {
    for (const o of [precheckCreditOverride(pc({ confidence: 'medium' })), precheckCreditOverride(pc({ verdict: 'partly_correct' })), precheckCreditOverride(pc({}), { enabled: false }), precheckCreditOverride(null)]) {
      assert.equal(o.reason, 'none');
      assert.equal(o.suppressCorrect || o.suppressIncorrect || o.verifiedWrong, false);
    }
  });
  await test('counting path: a correct hedged answer the tutor denied is not a ledger `wrong`', () => {
    const base = { studentText: "I don't know, maybe 1/4?", tutorText: 'Not quite — plug it straight into the denominator.', hedgedDenial: { enabled: true, verifiedWrong: false, judgeAgreedWrong: true } };
    assert.equal(inferWrongEvent({ ...base, objectiveCorrect: false }), true, 'without the check the denial counts (judge agreed)');
    assert.equal(inferWrongEvent({ ...base, objectiveCorrect: precheckCreditOverride(pc({ answers: 'overall_problem' })).suppressIncorrect }), false);
  });
  await test('counting path: a check that found a hedged answer wrong confirms the denial', () => {
    const o = precheckCreditOverride(pc({ verdict: 'incorrect' }));
    assert.equal(hedgedDenialCounts({ enabled: true, studentText: "I don't know, maybe 7?", verifiedWrong: false }), false);
    assert.equal(hedgedDenialCounts({ enabled: true, studentText: "I don't know, maybe 7?", verifiedWrong: o.verifiedWrong }), true);
  });

  // ── wiring into the brain turn ──
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const { WHITEBOARD_TOOLS } = await import('../src/app/tutor/hooks/toolDefinitions');
  type Req = { messages: Array<{ role: string; content: unknown }>; [k: string]: unknown };
  const requests: Req[] = [];
  const client = getModelClient('brain').client as unknown as { messages: { stream: (p: Req) => unknown } };
  client.messages.stream = (params: Req) => {
    requests.push(JSON.parse(JSON.stringify(params)) as Req);
    const events = [
      { type: 'message_start' },
      { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Yes — that is right. ' } },
      { type: 'content_block_stop', index: 0 },
    ];
    return {
      abort() {},
      async finalMessage() { return { content: [{ type: 'text', text: 'Yes — that is right.' }], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 } }; },
      [Symbol.asyncIterator]() { let i = 0; return { async next() { return i < events.length ? { done: false as const, value: events[i++] } : { done: true as const, value: undefined }; }, async return() { return { done: true as const, value: undefined }; } }; },
    };
  };
  const baseInput = {
    systemPrompt: 'CORE PROMPT. SESSION PART.',
    systemPromptCore: 'CORE PROMPT. ',
    conversationHistory: [
      { role: 'user' as const, content: 'First answer.' },
      { role: 'assistant' as const, content: 'You said the top becomes zero — what does the bottom become?' },
    ],
    studentTranscript: "I don't know, maybe 1/4?",
    whiteboardSnapshot: [],
    tools: WHITEBOARD_TOOLS.filter((t) => t.name === 'show_equation'),
    activeProblem: { statement: 'Find the limit.', source: 'card' as const },
  };
  type Input = Parameters<typeof brain.streamBrainTurn>[0];
  const run = async (input: Record<string, unknown>) => {
    requests.length = 0;
    const events: Array<Record<string, unknown>> = [];
    const l = console.log, w = console.warn; console.log = () => {}; console.warn = () => {};
    try { for await (const ev of brain.streamBrainTurn(input as unknown as Input)) events.push(ev as unknown as Record<string, unknown>); }
    finally { console.log = l; console.warn = w; }
    const content = String(requests[0]?.messages[requests[0].messages.length - 1]?.content ?? '');
    return { events, requests: [...requests], content };
  };
  const calls: number[] = [];
  const deps = (text: string) => ({ llm: (async (req) => { calls.push(1); return llmOf(text)(req); }) as VerdictPrecheckLlm });

  const voice = await run(baseInput);
  await test('voice / levers absent: no block, no event, no call', () => {
    assert.ok(!voice.content.includes('<turn_shape>') && !voice.content.includes('<answer_check>'));
    assert.ok(!voice.events.some((e) => e.type === 'verdict-precheck' || e.type === 'thinking'));
  });
  await test('levers explicitly false ⇒ request byte-identical to the voice request', async () => {
    const off = await run({ ...baseInput, textTurnShape: false, textVerdictPrecheck: false, verdictPrecheckDeps: deps(reply({})) });
    assert.equal(JSON.stringify(off.requests), JSON.stringify(voice.requests));
    assert.equal(JSON.stringify(off.events), JSON.stringify(voice.events));
    assert.equal(calls.length, 0);
  });
  await test('turn shape on: <turn_shape> sits directly above the verdict guard, nothing else changes', async () => {
    const r = await run({ ...baseInput, textTurnShape: true });
    assert.match(r.content, /<turn_shape>[\s\S]*<\/turn_shape>\n\n<verdict_guard>/);
    assert.match(r.content, /a hedged proposal — they say they are unsure and then propose "1\/4"/);
    assert.equal(r.content.replace(/<turn_shape>[\s\S]*<\/turn_shape>\n\n/, ''), voice.content);
    assert.equal(JSON.stringify(r.requests[0].system), JSON.stringify(voice.requests[0].system));
    assert.equal(JSON.stringify(r.requests[0].tools), JSON.stringify(voice.requests[0].tools));
  });
  await test('pre-check on, answer-shaped turn: one call BEFORE the brain call; block above the guard; event before any sentence', async () => {
    calls.length = 0;
    const order: string[] = [];
    const d = { llm: (async (req) => { order.push(`precheck(requests so far=${requests.length})`); return llmOf(reply({ answers: 'overall_problem', target: 'the limit asked for' }))(req); }) as VerdictPrecheckLlm };
    const r = await run({ ...baseInput, textTurnShape: true, textVerdictPrecheck: true, verdictPrecheckDeps: d });
    assert.deepEqual(order, ['precheck(requests so far=0)']);
    assert.match(r.content, /<\/turn_shape>\n\n<answer_check>[\s\S]*<\/answer_check>\n\n<verdict_guard>/);
    assert.match(r.content, /NOT the smaller step you had just asked about/);
    const types = r.events.map((e) => e.type);
    assert.ok(types.indexOf('thinking') === 0, 'a liveness frame goes out before the wait');
    assert.ok(types.indexOf('verdict-precheck') > 0 && types.indexOf('verdict-precheck') < types.indexOf('sentence'));
    const ev = r.events.find((e) => e.type === 'verdict-precheck') as { result: Record<string, unknown> };
    assert.equal(ev.result.answers, 'overall_problem');
    assert.ok(!('correctValue' in ev.result), 'the correct value never leaves the server');
  });
  await test('pre-check sees the student\'s own problem, the conversation, the open question and the message', async () => {
    const seen: Array<{ system: string; user: string }> = [];
    await run({ ...baseInput, textVerdictPrecheck: true, homework: { problems: [{ n: 1, text: 'Problem one.' }, { n: 2, text: 'Find the limit.' }], current: 2 }, verdictPrecheckDeps: { llm: llmOf(reply({}), seen) } });
    assert.match(seen[0].user, /2\. Find the limit\./);
    assert.match(seen[0].user, /<open_question>\nYou said the top becomes zero — what does the bottom become\?/);
    assert.match(seen[0].user, /<student_message>\nI don't know, maybe 1\/4\?/);
  });
  for (const [name, text] of [['low confidence', reply({ confidence: 'low' })], ['cannot determine', reply({ verdict: 'cannot_determine' })], ['a failed call', '']] as const) {
    await test(`pre-check ${name} ⇒ nothing injected, no event; the turn runs as before`, async () => {
      const r = await run({ ...baseInput, textVerdictPrecheck: true, verdictPrecheckDeps: { llm: llmOf(text) } });
      assert.ok(!r.content.includes('<answer_check>'));
      assert.ok(!r.events.some((e) => e.type === 'verdict-precheck'));
      assert.equal(r.content, voice.content);
      assert.ok(r.events.some((e) => e.type === 'sentence'));
    });
  }
  for (const said of ['yes', 'why does that work?', 'can you give me a hint', "I don't know"]) {
    await test(`pre-check does NOT run on "${said}"`, async () => {
      calls.length = 0;
      const r = await run({ ...baseInput, studentTranscript: said, textTurnShape: true, textVerdictPrecheck: true, verdictPrecheckDeps: deps(reply({})) });
      assert.equal(calls.length, 0);
      assert.ok(!r.content.includes('<answer_check>'));
    });
  }
  await test('nothing to check against (no question, no problem) ⇒ no call', async () => {
    calls.length = 0;
    await run({ ...baseInput, conversationHistory: [{ role: 'assistant', content: 'Hello there.' }], activeProblem: undefined, studentTranscript: '42', textVerdictPrecheck: true, verdictPrecheckDeps: deps(reply({})) });
    assert.equal(calls.length, 0);
  });
  await test('runtime notes in front of the words: the levers read `studentMessage`', async () => {
    calls.length = 0;
    const r = await run({ ...baseInput, studentTranscript: "[correction note — not from the student] …\n\nI don't know, maybe 1/4?", studentMessage: "I don't know, maybe 1/4?", textTurnShape: true, textVerdictPrecheck: true, verdictPrecheckDeps: deps(reply({})) });
    assert.equal(calls.length, 1);
    assert.match(r.content, /<turn_shape>/);
    assert.match(r.content, /<answer_check>/);
  });
  await test('a retry of the turn: no second call; the carried check is re-rendered without the value', async () => {
    calls.length = 0;
    const r = await run({ ...baseInput, studentTranscript: '[validator feedback — not from the student] …', textTurnShape: true, textVerdictPrecheck: true, verdictPrecheckCarry: pc({ verdict: 'incorrect' }), verdictPrecheckDeps: deps(reply({})) });
    assert.equal(calls.length, 0);
    assert.match(r.content, /<answer_check>[\s\S]*INCORRECT\.\n/);
    assert.ok(!r.content.includes('correct value is'));
    assert.ok(!r.content.includes('<turn_shape>'));
    assert.ok(!r.events.some((e) => e.type === 'verdict-precheck'));
  });
  await test('either/or + bare yes: the continuation guard is NOT attached when the turn-shape lever is on', async () => {
    const hist = [{ role: 'assistant' as const, content: 'That is done. Ready to move to the next homework problem, or want to wrap here?' }];
    const before = await run({ ...baseInput, conversationHistory: hist, studentTranscript: 'yes' });
    assert.match(before.content, /<continuation_guard>/, 'as before without the lever');
    const after = await run({ ...baseInput, conversationHistory: hist, studentTranscript: 'yes', textTurnShape: true });
    assert.ok(!after.content.includes('<continuation_guard>'));
    assert.match(after.content, /AMBIGUOUS/);
    assert.match(after.content, /<verdict_guard>/);
  });
  await test('plain readiness question + yes: the continuation guard stays', async () => {
    const r = await run({ ...baseInput, conversationHistory: [{ role: 'assistant' as const, content: 'That is done. Ready for the next one?' }], studentTranscript: 'yes', textTurnShape: true });
    assert.match(r.content, /<continuation_guard>/);
  });

  // ── homework block and time talk ──
  await test('homework block: no early sign-off rule and no time talk rule', () => {
    const b = brain.formatHomeworkSessionBlock({ problems: [{ n: 1, text: 'P one.' }, { n: 2, text: 'P two.' }], current: 1 });
    assert.match(b, /Do not sign off, say goodbye, or say the homework or the session is finished unless the student has asked to stop, or every problem listed above has been worked to its answer/);
    assert.match(b, /Never tell the student how much time has been used or is left/);
  });
  await test('timed session block: the minute figures are for pacing only', () => {
    const b = brain.formatDemoStopBlock({ mode: 'time', budgetMinutes: 30, minutesElapsed: 2 } as Parameters<typeof brain.formatDemoStopBlock>[0]);
    assert.match(b, /about 28 of 30 minutes left/);
    assert.match(b, /never tell the student how much time has been used or is left/);
  });
  await test('partner session prompt: the time-remaining line carries the rule; the retail prompt does not', async () => {
    const { buildSystemPromptParts } = await import('../src/lib/tutor/ai/system-prompt-builder');
    const ctx = { module: null, sessionGoal: 'homework-help', timeRemainingMinutes: 30, subject: 'math', topic: 't', level: 'Grade 9', inputMode: 'text' };
    const partner = buildSystemPromptParts({ ...ctx, partnerEmbed: true } as Parameters<typeof buildSystemPromptParts>[0]);
    const retail = buildSystemPromptParts({ ...ctx } as Parameters<typeof buildSystemPromptParts>[0]);
    assert.match(partner.session, /Time Remaining: 30 minutes\n\(For your pacing only — never tell the student/);
    assert.ok(!retail.session.includes('For your pacing only'));
    assert.equal(partner.core, retail.core, 'the shared cached core is untouched');
  });

  // ── source wiring (route + client) ──
  const SRC = path.resolve(__dirname, '../src');
  const route = fs.readFileSync(path.join(SRC, 'app/api/tutor/brain/stream/route.ts'), 'utf8');
  const clientSrc = fs.readFileSync(path.join(SRC, 'app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  await test('route: both levers are switched by the session\'s input mode; the carry is validated', () => {
    assert.match(route, /textTurnShape: textTurnShapeEnabled\(body\.inputMode\)/);
    assert.match(route, /textVerdictPrecheck: textVerdictPrecheckEnabled\(body\.inputMode\)/);
    assert.match(route, /verdictPrecheckCarry: sanitizePublicPrecheck\(body\.verdictPrecheck\)/);
    assert.match(route, /ev\.type === 'thinking' \|\| ev\.type === 'verdict-precheck'/);
  });
  await test('client: the new body fields are sent for a text session only', () => {
    assert.match(clientSrc, /sessionMode === 'text' && attempt === 0 && transcript[^\n]*\n\s*\? \{ studentMessage: transcript \}/);
    assert.match(clientSrc, /sessionMode === 'text' && attempt > 0 && verdictPrecheckRef\.current/);
  });
  await test('client: pre-check is reset per turn, feeds the kill and the counting path', () => {
    assert.match(clientSrc, /verdictPrecheckRef\.current = null;\n\s*verdictPrecheckKillUsedRef\.current = false;/);
    assert.match(clientSrc, /precheckOpenerContradiction\(verdictPrecheckRef\.current, updatedSentence/);
    assert.match(clientSrc, /const isAffirm = (?:matchCredit \? matchCredit\.credit === 'correct' : )?verdictRead\.isAffirm && !precheckCredit\.suppressCorrect;/);
    assert.match(clientSrc, /const isCorrect = (?:matchCredit \? matchCredit\.credit === 'incorrect' : )?verdictRead\.isCorrection && !precheckCredit\.suppressIncorrect;/);
    assert.match(clientSrc, /hedgedDenialSignalRef\.current\.verifiedWrong = true;\n\s*\}\n\s*onDebugEvent\?\.\('verdict_precheck'/);
    assert.match(clientSrc, /ambiguousAssentKill\(transcript, nonAnswerTextSoFar, bareAssentPriorTutorTurn\)/);
  });

  // ── 2026-10-12: a longer cap for a longer problem ──
  // A multi-step word problem took the check 7–11 s; at 6 s it was cut and
  // the turn ran without it.
  await test('timeout for a turn: 6 s for a short problem, rising with its length to 12 s; the env override and the switch win', () => {
    const of = (n: number) => ({ ...input, problems: [{ n: 1, text: 'x'.repeat(n) }], currentProblem: 1, activeProblemStatement: '' });
    assert.equal(verdictPrecheckTimeoutFor(of(40), {}), 6000);
    assert.equal(verdictPrecheckTimeoutFor(of(150), {}), 6000);
    assert.equal(verdictPrecheckTimeoutFor(of(200), {}), 8000);
    assert.equal(verdictPrecheckTimeoutFor(of(270), {}), 10800);
    assert.equal(verdictPrecheckTimeoutFor(of(300), {}), 12000);
    assert.equal(verdictPrecheckTimeoutFor(of(5000), {}), 12000);
    assert.equal(verdictPrecheckTimeoutFor({ ...input, problems: undefined, activeProblemStatement: 'y'.repeat(300) }, {}), 12000, 'a board problem counts');
    assert.equal(verdictPrecheckTimeoutFor({ ...input, problems: [{ n: 1, text: 'x'.repeat(40) }, { n: 2, text: 'x'.repeat(900) }], currentProblem: 1, activeProblemStatement: '' }, {}), 6000, 'the problem being worked, not the longest on the sheet');
    assert.equal(verdictPrecheckTimeoutFor(of(900), { timeoutEnv: '4000' }), 4000, 'an explicit cap is the cap');
    assert.equal(verdictPrecheckTimeoutFor(of(900), { longProblemFlag: 'off' }), 6000);
  });
  await test('timeout for a turn: the call is given the longer cap', async () => {
    let got = 0;
    const llm: VerdictPrecheckLlm = async (req) => { got = req.timeoutMs; return { text: reply({}), model: 'fake-model', inputTokens: 1, outputTokens: 1 }; };
    await runVerdictPrecheck({ ...input, problems: [{ n: 1, text: 'x'.repeat(300) }], currentProblem: 1, activeProblemStatement: '' }, { llm });
    assert.equal(got, 12000);
    await runVerdictPrecheck({ ...input, problems: [{ n: 1, text: 'x'.repeat(300) }], currentProblem: 1 }, { llm, timeoutMs: 3500 });
    assert.equal(got, 3500, 'a caller that sets its own cap (voice) keeps it');
  });

  // ── 2026-10-12: what a wrong whole answer does not agree with ──
  // portal-2000fd6a @73.3 s: the block said only INCORRECT, the reply had to
  // ask about "the first thing to re-examine", and it named a condition the
  // student's answer satisfied.
  const wrongWhole = { answers: 'overall_problem' as const, verdict: 'incorrect' as const, target: 'the final answer' };
  await test('differs_at: last schema field, described in the prompt, generic', () => {
    const s = VERDICT_PRECHECK_SCHEMA as { required: string[]; properties: Record<string, unknown> };
    const keys = Object.keys(s.properties);
    assert.equal(keys[keys.length - 1], 'differs_at', 'written after the verdict, so nothing before it changes');
    assert.ok(s.required.includes('differs_at'));
    assert.match(VERDICT_PRECHECK_SYSTEM, /differs_at — /);
    assert.equal(keys[keys.length - 2], 'differs_test', 'the test is written before the name');
    assert.match(VERDICT_PRECHECK_SYSTEM, /leave both empty rather than guess/);
    assert.match(VERDICT_PRECHECK_SYSTEM, /never name (?:a|one) (?:condition )?(?:that )?their answer satisfies/i);
    assert.match(VERDICT_PRECHECK_SYSTEM, /no value/i);
  });
  await test('differs_at: kept for a wrong answer, public, one line', async () => {
    const r = await runVerdictPrecheck(input, { llm: llmOf(reply({ ...wrongWhole, differs_at: 'the second condition\n of <Problem two>' })) });
    assert.equal(r!.differsAt, 'the second condition of Problem two');
    const pub = toPublicPrecheck(r!);
    assert.equal(pub.differsAt, 'the second condition of Problem two');
    assert.equal(sanitizePublicPrecheck(JSON.parse(JSON.stringify(pub)))!.differsAt, pub.differsAt, 'survives the round trip to the browser and back');
    assert.ok(!('differsTest' in pub), 'the test behind it carries values and stays on the server');
    assert.ok(!('differsAt' in sanitizePublicPrecheck({ answers: 'overall_problem', verdict: 'incorrect', confidence: 'high' })!), 'absent stays absent');
  });
  await test('differs_at: dropped for a correct verdict, for a wrong step, when empty, and when the flag is off', async () => {
    const ok = await runVerdictPrecheck(input, { llm: llmOf(reply({ differs_at: 'something' })) });
    assert.equal(ok!.differsAt, undefined);
    const step = await runVerdictPrecheck(input, { llm: llmOf(reply({ verdict: 'incorrect', differs_at: 'something' })) });
    assert.equal(step!.differsAt, undefined, 'only for an answer to the whole problem');
    const empty = await runVerdictPrecheck(input, { llm: llmOf(reply({ ...wrongWhole, differs_at: '  ' })) });
    assert.equal(empty!.differsAt, undefined);
    const off = await runVerdictPrecheck(input, { llm: llmOf(reply({ ...wrongWhole, differs_at: 'the second condition' })), differsAt: false });
    assert.equal(off!.differsAt, undefined);
  });
  await test('differs_at: never carries a value — the correct value, or a number that is in neither the problem nor the message', async () => {
    const numbered = { ...input, problems: [{ n: 1, text: 'Problem one text with 50 in it.' }], currentProblem: 1, activeProblemStatement: '', studentMessage: 'maybe 20?' };
    const fromProblem = await runVerdictPrecheck(numbered, { llm: llmOf(reply({ ...wrongWhole, correct_value: '35', differs_at: 'the condition with 50' })) });
    assert.equal(fromProblem!.differsAt, 'the condition with 50', "the problem's own numbers may be used to name a condition");
    const foreign = await runVerdictPrecheck(numbered, { llm: llmOf(reply({ ...wrongWhole, correct_value: '35', differs_at: 'the condition, which gives 480' })) });
    assert.equal(foreign!.differsAt, undefined, 'a computed number is a piece of working');
    const leak = await runVerdictPrecheck(input, { llm: llmOf(reply({ ...wrongWhole, correct_value: 'yyy', differs_at: 'the condition that leads to YYY' })) });
    assert.equal(leak!.differsAt, undefined);
  });
  await test('block: a wrong whole answer names what it does not agree with, and points there only', () => {
    const p = pc({ ...wrongWhole, differsAt: 'the second condition' });
    const b = formatAnswerCheckBlock(p, { correctValue: 'yyy', workThenMatch: true });
    assert.match(b, /- What their answer does not agree with: "the second condition"\.\n/);
    assert.match(b, /points them to THAT/);
    assert.match(b, /already satisfies/);
    assert.ok(!b.includes('yyy'), 'still no correct value');
    assert.ok(b.indexOf('does not agree with') > b.indexOf('INCORRECT') && b.indexOf('does not agree with') < b.indexOf('What to do:'));
  });
  await test('block: without it, and on every other branch, the block is byte for byte what it was', () => {
    const base = pc(wrongWhole);
    const plain = formatAnswerCheckBlock(base, { correctValue: 'yyy', workThenMatch: true });
    assert.ok(!/does not agree with|points them to THAT/.test(plain));
    assert.equal(formatAnswerCheckBlock(pc({ ...wrongWhole, differsAt: 'x' }), { correctValue: 'yyy', workThenMatch: true, differsAt: false }), plain, 'flag off');
    for (const o of [{ answers: 'open_question' as const, verdict: 'incorrect' as const }, { answers: 'other_part' as const, verdict: 'incorrect' as const }, { verdict: 'partly_correct' as const }, { verdict: 'correct' as const }]) {
      for (const workThenMatch of [true, false]) {
        assert.equal(formatAnswerCheckBlock(pc({ ...o, differsAt: 'x' }), { correctValue: 'yyy', workThenMatch }), formatAnswerCheckBlock(pc(o), { correctValue: 'yyy', workThenMatch }));
      }
    }
    assert.equal(formatAnswerCheckBlock(pc({ ...wrongWhole, differsAt: 'x' }), { correctValue: 'yyy' }), formatAnswerCheckBlock(base, { correctValue: 'yyy' }), 'not under the plain block');
  });

  if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
  console.log(`\nAll ${passed} verdict-precheck tests passed.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
