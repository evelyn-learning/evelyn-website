/**
 * 2026-10-19 teaching round (GreenApple T6 + T7): the partner gate, the
 * homework problem ledger, the wrong-answer response policy (no result at any
 * step), the false-claim rule, and their wiring into the pre-check and the
 * brain turn. No network: the pre-check model and the brain stream are fakes.
 *
 * Run: npx tsx scripts/test-no-reveal-ledger.ts
 */
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/test-no-db';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';

import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { noRevealLedgerForPartner, NO_REVEAL_LEDGER_PARTNERS_ENV } from '../src/lib/tutor/voice/no-reveal-ledger-gate';
import {
  formatLedgerProblemLines,
  HOMEWORK_LEDGER_RULES,
  nextOpenPosition,
  recordSolved,
  sanitizeSolvedPositions,
  solvedPositionFromCheck,
} from '../src/lib/tutor/lesson-plan/homework-ledger';
import {
  formatAnswerCheckBlock,
  sanitizePublicPrecheck,
  toPublicPrecheck,
  type PublicVerdictPrecheck,
  type VerdictPrecheckResult,
} from '../src/lib/tutor/voice/verdict-precheck-shared';
import {
  buildVerdictPrecheckUser,
  runVerdictPrecheck,
  verdictPrecheckSystem,
  VERDICT_PRECHECK_SCHEMA,
  type VerdictPrecheckLlm,
} from '../src/lib/tutor/voice/verdict-precheck';
import { wholeAnswerRevealGuardActive } from '../src/lib/tutor/voice/whole-answer-reveal';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 4).join('\n      ')}`); }
}
const pc = (o: Partial<PublicVerdictPrecheck>): PublicVerdictPrecheck => ({
  answers: 'open_question', target: 'the part asked', proposed: 'zzz', verdict: 'incorrect', confidence: 'high', ...o,
});

async function main() {
  console.log('partner gate');
  await test('unset ⇒ GreenApple only', () => {
    assert.equal(noRevealLedgerForPartner('greenapple', {}), true);
    assert.equal(noRevealLedgerForPartner('GreenApple ', {}), true);
    for (const p of ['crimsora', 'evelyntutor', 'gameclass', 'kanzoo', 'academy', '', undefined, null]) assert.equal(noRevealLedgerForPartner(p, {}), false, String(p));
  });
  await test("'off' / '' ⇒ nobody; a list ⇒ those; '*' ⇒ everyone", () => {
    const e = (v: string) => ({ [NO_REVEAL_LEDGER_PARTNERS_ENV]: v });
    assert.equal(noRevealLedgerForPartner('greenapple', e('off')), false);
    assert.equal(noRevealLedgerForPartner('greenapple', e('')), false);
    assert.equal(noRevealLedgerForPartner('kanzoo', e('greenapple, Kanzoo')), true);
    assert.equal(noRevealLedgerForPartner('crimsora', e('greenapple,kanzoo')), false);
    assert.equal(noRevealLedgerForPartner(undefined, e('*')), true);
  });

  console.log('ledger');
  await test('a problem is solved only by a HIGH-confidence CORRECT check that names it', () => {
    assert.equal(solvedPositionFromCheck(pc({ verdict: 'correct', solvedProblem: 2 }), 2), 2);
    assert.equal(solvedPositionFromCheck(pc({ verdict: 'correct', answers: 'overall_problem', solvedProblem: 1 }), 2), 1);
    assert.equal(solvedPositionFromCheck(pc({ verdict: 'correct', confidence: 'medium', solvedProblem: 2 }), 2), null);
    assert.equal(solvedPositionFromCheck(pc({ verdict: 'incorrect', solvedProblem: 2 }), 2), null);
    assert.equal(solvedPositionFromCheck(pc({ verdict: 'partly_correct', solvedProblem: 2 }), 2), null);
    assert.equal(solvedPositionFromCheck(pc({ verdict: 'correct', answers: 'neither', solvedProblem: 2 }), 2), null);
    assert.equal(solvedPositionFromCheck(pc({ verdict: 'correct' }), 2), null);
    assert.equal(solvedPositionFromCheck(pc({ verdict: 'correct', solvedProblem: 3 }), 2), null);
    assert.equal(solvedPositionFromCheck(null, 2), null);
  });
  await test('recording is monotonic, sorted and in range; nothing reopens a problem', () => {
    let s = recordSolved([], 2, 3);
    s = recordSolved(s, 1, 3);
    s = recordSolved(s, 2, 3);
    s = recordSolved(s, null, 3);
    assert.deepEqual(s, [1, 2]);
    assert.deepEqual(recordSolved([0, 4, 2], 9, 3), [2]);
  });
  await test('a wire list is all-valid or dropped', () => {
    assert.deepEqual(sanitizeSolvedPositions([2, 1, 2], 2), [1, 2]);
    assert.equal(sanitizeSolvedPositions([3], 2), undefined);
    assert.equal(sanitizeSolvedPositions(['1'], 2), undefined);
    assert.equal(sanitizeSolvedPositions('1', 2), undefined);
    assert.deepEqual(sanitizeSolvedPositions([], 2), []);
  });
  await test('next open problem wraps; null when all are solved', () => {
    assert.equal(nextOpenPosition(3, [1], 1), 2);
    assert.equal(nextOpenPosition(3, [2, 3], 2), 1);
    assert.equal(nextOpenPosition(2, [1, 2], 1), null);
  });
  await test('problem lines carry the marks; the current line follows the ledger', () => {
    const probs = [{ n: 1, text: 'First.' }, { n: 2, text: 'Second.' }];
    const a = formatLedgerProblemLines(probs, 2, [1]);
    assert.equal(a.lines, '1. [SOLVED] First.\n2. [OPEN] Second.');
    assert.match(a.currentLine, /^Current: Problem 2 \(2 of 2\), \[OPEN\]\.$/);
    const b = formatLedgerProblemLines(probs, 1, [1]);
    assert.match(b.currentLine, /Problem 1 is \[SOLVED\]; the next \[OPEN\] problem is Problem 2/);
    const c = formatLedgerProblemLines(probs, 2, [1, 2]);
    assert.equal(c.currentLine, 'All 2 problems are [SOLVED].');
  });
  await test('the per-turn ledger reminder: absent until something is solved; marks every problem', async () => {
    const { formatProblemLedgerBlock } = await import('../src/lib/tutor/lesson-plan/homework-ledger');
    const probs = [{ n: 1, text: 'First.' }, { n: 2, text: 'Second.' }];
    assert.equal(formatProblemLedgerBlock(probs, []), '');
    assert.match(formatProblemLedgerBlock(probs, [1]), /Problem 1 \[SOLVED\], Problem 2 \[OPEN\]\./);
    assert.match(formatProblemLedgerBlock(probs, [1, 2]), /Every one of the student's problems is solved/);
    assert.doesNotMatch(formatProblemLedgerBlock(probs, [1]).replace(/Problem \d/g, ''), /\d|e\.g\./);
  });
  await test('ledger rules are generic (no digits, no subject words, no quoted examples)', () => {
    assert.doesNotMatch(HOMEWORK_LEDGER_RULES, /\d|e\.g\.|for example|"/i);
  });

  console.log('homework block');
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const hw = { problems: [{ n: 1, text: 'First.' }, { n: 2, text: 'Second.' }], current: 2, solved: [1, 2] };
  await test('without the ledger option the block is byte-identical to before (solved ignored)', () => {
    const plain = brain.formatHomeworkSessionBlock({ problems: hw.problems, current: 2 });
    assert.equal(brain.formatHomeworkSessionBlock(hw), plain);
    assert.equal(brain.formatHomeworkSessionBlock(hw, { ledger: false }), plain);
    assert.doesNotMatch(plain, /\[SOLVED\]|\[OPEN\]/);
  });
  await test('with the ledger: marks, current line and rules; an absent list renders every problem OPEN', () => {
    const b = brain.formatHomeworkSessionBlock(hw, { ledger: true });
    assert.match(b, /1\. \[SOLVED\] First\.\n2\. \[SOLVED\] Second\./);
    assert.match(b, /All 2 problems are \[SOLVED\]\./);
    assert.ok(b.includes(HOMEWORK_LEDGER_RULES));
    const none = brain.formatHomeworkSessionBlock({ problems: hw.problems, current: 1 }, { ledger: true });
    assert.match(none, /1\. \[OPEN\] First\.\n2\. \[OPEN\] Second\./);
  });

  console.log('answer check — wrong answer at any step');
  const wrongStep = pc({});
  const oldBlock = formatAnswerCheckBlock(wrongStep, { correctValue: 'Q-VALUE', workThenMatch: true });
  await test('without the option: the block as before (the value is rendered)', () => {
    assert.match(oldBlock, /Q-VALUE/);
    assert.equal(formatAnswerCheckBlock(wrongStep, { correctValue: 'Q-VALUE', workThenMatch: true, noRevealAnyStep: false }), oldBlock);
  });
  await test('with the option: no value, the step is named without its result, nothing after it stated', () => {
    for (const answers of ['open_question', 'other_part'] as const) {
      for (const workThenMatch of [true, false]) {
        const b = formatAnswerCheckBlock(pc({ answers }), { correctValue: 'Q-VALUE', workThenMatch, noRevealAnyStep: true });
        assert.doesNotMatch(b, /Q-VALUE/, `${answers} wtm=${workThenMatch}`);
        assert.match(b, /INCORRECT/);
        assert.match(b, /without its result/i);
        assert.match(b, /Never state the correct result/);
      }
    }
  });
  await test('the whole-problem branch is unchanged by the option', () => {
    const p = pc({ answers: 'overall_problem', differsAt: 'the stated total' });
    assert.equal(
      formatAnswerCheckBlock(p, { correctValue: 'Q', workThenMatch: true, noRevealAnyStep: true }),
      formatAnswerCheckBlock(p, { correctValue: 'Q', workThenMatch: true }),
    );
  });
  await test('correct / partly-correct checks are unchanged by the option', () => {
    for (const verdict of ['correct', 'partly_correct'] as const) {
      const p = pc({ verdict });
      assert.equal(formatAnswerCheckBlock(p, { correctValue: 'Q', workThenMatch: true, noRevealAnyStep: true }), formatAnswerCheckBlock(p, { correctValue: 'Q', workThenMatch: true }));
    }
  });

  console.log('answer check — a stated false claim');
  const claim = pc({ answers: 'neither', verdict: 'incorrect', confidence: 'medium' });
  await test('without the option: the non-answer block as before', () => {
    assert.equal(formatAnswerCheckBlock(claim, { workThenMatch: true, claimCorrection: false }), formatAnswerCheckBlock(claim, { workThenMatch: true }));
    assert.doesNotMatch(formatAnswerCheckBlock(claim, { workThenMatch: true }), /NOT true/);
  });
  await test('with the option: a false claim is corrected, not passed over (both block forms)', () => {
    for (const workThenMatch of [true, false]) {
      const b = formatAnswerCheckBlock(claim, { workThenMatch, claimCorrection: true });
      assert.match(b, /NOT true/);
      assert.match(b, /do not let it pass/i);
      assert.doesNotMatch(b, /ask the open question again/);
    }
    // A true claim or a non-claim keeps the non-answer rule.
    for (const verdict of ['correct', 'cannot_determine'] as const) {
      const b = formatAnswerCheckBlock(pc({ answers: 'neither', verdict }), { workThenMatch: true, claimCorrection: true });
      assert.equal(b, formatAnswerCheckBlock(pc({ answers: 'neither', verdict }), { workThenMatch: true }));
    }
  });

  console.log('public pre-check carries the solved problem');
  await test('solvedProblem survives toPublic + sanitize; junk is dropped', () => {
    const r = { ...pc({ verdict: 'correct' }), correctValue: 'v', model: 'm', ms: 1, inputTokens: 1, outputTokens: 1, solvedProblem: 2 } as VerdictPrecheckResult;
    const pub = toPublicPrecheck(r);
    assert.equal(pub.solvedProblem, 2);
    assert.equal(sanitizePublicPrecheck(JSON.parse(JSON.stringify(pub)))?.solvedProblem, 2);
    assert.equal(sanitizePublicPrecheck({ ...pub, solvedProblem: 'x' })?.solvedProblem, undefined);
    assert.equal(sanitizePublicPrecheck({ ...pub, solvedProblem: 0 })?.solvedProblem, undefined);
    assert.equal('solvedProblem' in (sanitizePublicPrecheck({ ...pub, solvedProblem: undefined }) ?? {}), false);
  });

  console.log('reveal guard scope');
  await test('any-target: armed for every high-confidence INCORRECT check except a non-answer', () => {
    assert.equal(wholeAnswerRevealGuardActive(pc({}), 'v'), false, 'default: whole problem only');
    assert.equal(wholeAnswerRevealGuardActive(pc({}), 'v', { anyTarget: true }), true);
    assert.equal(wholeAnswerRevealGuardActive(pc({ answers: 'other_part' }), 'v', { anyTarget: true }), true);
    assert.equal(wholeAnswerRevealGuardActive(pc({ answers: 'neither' }), 'v', { anyTarget: true }), false);
    assert.equal(wholeAnswerRevealGuardActive(pc({ confidence: 'medium' }), 'v', { anyTarget: true }), false);
    assert.equal(wholeAnswerRevealGuardActive(pc({ verdict: 'correct' }), 'v', { anyTarget: true }), false);
    assert.equal(wholeAnswerRevealGuardActive(pc({}), '', { anyTarget: true }), false);
  });

  await test('new-number mode: a corrected result line the student never wrote is a hit; their own numbers are not', async () => {
    const { revealsWithheldAnswer, boardRevealsWithheldAnswer } = await import('../src/lib/tutor/voice/whole-answer-reveal');
    const a = { value: 'y = -2', studentText: 'then 7y = -4, so y = -4/7', givenText: 'Solve 5(2y + 1) = 3y - 9.', newNumbers: true };
    assert.equal(revealsWithheldAnswer('From there, subtracting 5 gives 7y = -14, not -4.', a).hit, true);
    assert.equal(boardRevealsWithheldAnswer({ latex: '7y = -14' }, a).hit, true);
    assert.equal(revealsWithheldAnswer('Your step 7y = -4 is where it goes wrong.', a).hit, false);
    assert.equal(revealsWithheldAnswer('What do you get when you subtract 5 from both sides?', a).hit, false);
    assert.equal(revealsWithheldAnswer('From there, subtracting 5 gives 7y = -14, not -4.', { ...a, newNumbers: false }).hit, false, 'off ⇒ as before');
    // A result that is an expression (digits and letters) is matched as an expression in this mode.
    const e = { value: 'g^-1(x) = 3x + 1', studentText: 'so y = 3x - 1. g^-1(x) = 3x - 1.', givenText: 'Find the inverse of g(x) = (x - 1)/3.', newNumbers: true };
    assert.equal(revealsWithheldAnswer('Multiplying by 3 gives $3x = y - 1$, so $y = 3x + 1$.', e).hit, true);
    assert.equal(revealsWithheldAnswer('Multiplying by 3 gives $3x = y - 1$, so $y = 3x + 1$.', { ...e, newNumbers: false }).hit, false, 'off ⇒ as before');
    assert.equal(revealsWithheldAnswer('Look at your step 3x = y - 1: what do you do next?', e).hit, false);
  });

  console.log('pre-check call');
  const input = {
    problems: [{ n: 1, text: 'First.' }, { n: 2, text: 'Second.' }], currentProblem: 1,
    history: [{ role: 'assistant' as const, content: 'Ready for the second one?' }],
    openQuestion: 'Ready for the second one?', studentMessage: 'my answer',
  };
  await test('without the options: system prompt, user content and schema are as before', async () => {
    const seen: Array<{ system: string; user: string }> = [];
    const llm: VerdictPrecheckLlm = async (req) => { seen.push({ system: req.system, user: req.user }); return { text: JSON.stringify({ answers: 'open_question', verdict: 'correct', confidence: 'high', solved_problem: 2 }), model: 'f', inputTokens: 1, outputTokens: 1 }; };
    const r = await runVerdictPrecheck({ ...input, solved: [1] }, { llm, timeoutMs: 1000 });
    assert.equal(seen[0].system, verdictPrecheckSystem());
    assert.equal(seen[0].user, buildVerdictPrecheckUser(input));
    assert.equal(r?.solvedProblem, undefined, 'the field is ignored when the ledger is off');
    assert.ok(!('solved_problem' in (VERDICT_PRECHECK_SCHEMA.properties as Record<string, unknown>)));
  });
  await test('ledger on: the field is asked for, solved problems are listed, the label maps to a position', async () => {
    const seen: Array<{ system: string; user: string }> = [];
    const llm: VerdictPrecheckLlm = async (req) => { seen.push({ system: req.system, user: req.user }); return { text: JSON.stringify({ answers: 'open_question', verdict: 'correct', confidence: 'high', solved_problem: 7 }), model: 'f', inputTokens: 1, outputTokens: 1 }; };
    const labelled = { ...input, problems: [{ n: 3, text: 'First.' }, { n: 7, text: 'Second.' }], solved: [1] };
    const r = await runVerdictPrecheck(labelled, { llm, timeoutMs: 1000, ledger: true });
    assert.match(seen[0].system, /solved_problem/);
    assert.match(seen[0].user, /Already solved, from earlier checks: Problem 3\./);
    assert.equal(r?.solvedProblem, 2);
    const unknown = await runVerdictPrecheck(labelled, { llm: async () => ({ text: JSON.stringify({ answers: 'open_question', verdict: 'correct', confidence: 'high', solved_problem: 5 }), model: 'f', inputTokens: 1, outputTokens: 1 }), timeoutMs: 1000, ledger: true });
    assert.equal(unknown?.solvedProblem, undefined);
  });
  await test('claim judging on: the system prompt asks for a verdict on a stated claim', async () => {
    const seen: string[] = [];
    await runVerdictPrecheck(input, { llm: async (req) => { seen.push(req.system); return { text: '{}', model: 'f', inputTokens: 1, outputTokens: 1 }; }, timeoutMs: 1000, claimVerdict: true });
    assert.match(seen[0], /states a claim/);
    assert.ok(seen[0].startsWith(verdictPrecheckSystem().slice(0, 200)));
  });
  await test('new prompt text is generic (no digits, no quoted examples)', () => {
    const src = fs.readFileSync(path.join(__dirname, '../src/lib/tutor/voice/verdict-precheck.ts'), 'utf8');
    const block = (name: string) => new RegExp(`export const ${name} =([\\s\\S]*?);\\n`).exec(src)?.[1] ?? '';
    for (const n of ['CLAIM_VERDICT_RULE', 'SOLVED_PROBLEM_FIELD_RULE']) {
      const t = block(n);
      assert.ok(t.length > 50, n);
      assert.doesNotMatch(t.replace(/\\'/g, "'"), /\d|e\.g\.|for example/i, n);
    }
  });

  console.log('brain turn wiring');
  const registry = await import('../src/lib/tutor/ai/model-registry');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = registry.getModelClient('brain').client as any;
  let script = '';
  const requests: Array<{ messages: Array<{ content: unknown }> }> = [];
  client.messages.stream = (params: { messages: Array<{ content: unknown }> }) => {
    requests.push(JSON.parse(JSON.stringify(params)));
    const text = requests.length === 1 ? script : '';
    const events = [
      { type: 'message_start' },
      ...(text ? [{ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }, { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text } }, { type: 'content_block_stop', index: 0 }] : []),
      { type: 'message_delta', delta: { stop_reason: 'end_turn' } }, { type: 'message_stop' },
    ];
    return {
      abort() {}, controller: { abort() {} },
      async finalMessage() { return { content: text ? [{ type: 'text', text }] : [], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 } }; },
      async *[Symbol.asyncIterator]() { for (const e of events) yield e; },
    };
  };
  const { WHITEBOARD_TOOLS } = await import('../src/app/tutor/hooks/toolDefinitions');
  const check = (o: Record<string, unknown>) => async () => ({ text: JSON.stringify({ proposed_value: '15', problem_final_answer: '30', proposed_equals_final_answer: false, answers: 'open_question', target: 'the second part', correct_value: '30', verdict: 'incorrect', confidence: 'high', differs_test: '', differs_at: '', ...o }), model: 'fake', inputTokens: 1, outputTokens: 1 });
  const base = {
    systemPrompt: 'CORE. SESSION.', systemPromptCore: 'CORE. ',
    conversationHistory: [{ role: 'assistant' as const, content: 'Ready to move to the second part?' }],
    studentTranscript: 'For the second part: 3 times 10 halved is 15.',
    studentMessage: 'For the second part: 3 times 10 halved is 15.',
    whiteboardSnapshot: [], tools: WHITEBOARD_TOOLS.filter((t: { name: string }) => t.name === 'show_equation'),
    homework: { problems: [{ n: 1, text: 'Find the time when the given height is 45 and the rate is 10.' }, { n: 2, text: 'Find the speed at that time.' }], current: 2, solved: [1] },
    textTurnShape: true, textVerdictPrecheck: true, textWorkThenMatch: true,
  };
  const run = async (reply: string, extra: Record<string, unknown>) => {
    script = reply; requests.length = 0;
    const events: Array<Record<string, unknown>> = [];
    const l = console.log, w = console.warn; console.log = () => {}; console.warn = () => {};
    try { for await (const ev of brain.streamBrainTurn({ ...base, ...extra } as never)) events.push(ev as unknown as Record<string, unknown>); }
    finally { console.log = l; console.warn = w; }
    const content = String(requests[0]?.messages[requests[0].messages.length - 1]?.content ?? '');
    return { events, content, sentences: events.filter((e) => e.type === 'sentence').map((e) => String(e.text)) };
  };
  const REVEAL = 'Multiplying 10 by 3 gives 30, not 15. Why did you halve it?';
  await test('gate off: the wrong-step block carries the value and nothing is withheld (as before)', async () => {
    const r = await run(REVEAL, { verdictPrecheckDeps: { llm: check({}) } });
    assert.match(r.content, /The correct value is "30"/);
    assert.doesNotMatch(r.content, /\[SOLVED\]/);
    assert.ok(!r.events.some((e) => e.type === 'answer-reveal'));
    assert.deepEqual(r.sentences, ['Multiplying 10 by 3 gives 30, not 15.', 'Why did you halve it?']);
  });
  await test('gate on: no value in the block, the guard withholds the sentence that states it', async () => {
    const r = await run(REVEAL, { noRevealLedger: true, verdictPrecheckDeps: { llm: check({}) } });
    assert.doesNotMatch(r.content, /"30"/);
    assert.match(r.content, /Never state the correct result/);
    assert.ok(r.events.some((e) => e.type === 'answer-reveal'));
    assert.ok(!r.sentences.join(' ').includes('30'), r.sentences.join(' | '));
    const pre = r.events.find((e) => e.type === 'verdict-precheck')!;
    assert.ok(typeof pre.seal === 'string' && (pre.seal as string).length > 20);
  });
  await test('gate on: the ledger is rendered and the solved problem is reported in the frame', async () => {
    const r = await run('Yes, that is right.', { noRevealLedger: true, verdictPrecheckDeps: { llm: check({ verdict: 'correct', correct_value: '30', proposed_value: '30', solved_problem: 2 }) } });
    assert.match(r.content, /1\. \[SOLVED\] Find the time/);
    assert.match(r.content, /2\. \[OPEN\] Find the speed/);
    assert.match(r.content, /<problem_ledger>[\s\S]*<\/problem_ledger>\n\n<answer_check>/);
    const pre = r.events.find((e) => e.type === 'verdict-precheck') as { result: PublicVerdictPrecheck };
    assert.equal(pre.result.solvedProblem, 2);
  });
  await test('gate on: a stated false claim gets the correction rule', async () => {
    const r = await run('Not quite.', { noRevealLedger: true, studentTranscript: 'can you check my answer: it gets used up', studentMessage: 'can you check my answer: it gets used up', verdictPrecheckDeps: { llm: check({ answers: 'neither', verdict: 'incorrect', confidence: 'medium', correct_value: '' }) } });
    assert.match(r.content, /NOT true/);
  });

  console.log('route + client wiring (source)');
  const route = fs.readFileSync(path.join(__dirname, '../src/app/api/tutor/brain/stream/route.ts'), 'utf8');
  const vtr = fs.readFileSync(path.join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  await test('route: the gate is text-only and keyed on the embed token partner claim; solved is sanitised', () => {
    assert.match(route, /noRevealLedger: body\.inputMode === 'text' && noRevealLedgerForPartner\(embedTokenPartnerClaim\(req\.headers\.get\('x-embed-token'\)\)\)/);
    assert.match(route, /sanitizeSolvedPositions\(/);
  });
  await test('client: the ledger is recorded from the check frame and sent with homework', () => {
    assert.match(vtr, /solvedPositionFromCheck\(pc, /);
    assert.match(vtr, /homeworkSolvedRef\.current = recordSolved\(/);
    assert.match(vtr, /homework: \{ problems: homeworkProblemsRef\.current, current: homeworkCurrentRef\.current, solved: homeworkSolvedRef\.current \}/);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
