/**
 * Wrong answer to the whole problem — the deterministic reveal guard
 * (src/lib/tutor/voice/whole-answer-reveal.ts) and its seal.
 *
 *   npx tsx scripts/test-whole-answer-reveal.ts
 */
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  boardRevealsWithheldAnswer,
  boardStrings,
  revealsWithheldAnswer,
  wholeAnswerFallbackTail,
  wholeAnswerRevealFeedback,
  wholeAnswerRevealGuardActive,
  WHOLE_ANSWER_FALLBACK_QUESTION,
  WHOLE_ANSWER_FALLBACK_STATEMENT,
  WHOLE_ANSWER_REVEAL_ACTION,
  type WithheldAnswer,
} from '../src/lib/tutor/voice/whole-answer-reveal';
import { openWithheldAnswer, sealWithheldAnswer } from '../src/lib/tutor/voice/whole-answer-seal';
import { readMatchStatement, resolveMatchCredit } from '../src/lib/tutor/voice/work-then-match';
import { isAnswerRevealingKill } from '../src/lib/tutor/whiteboard/kill-keep';
import type { PublicVerdictPrecheck } from '../src/lib/tutor/voice/verdict-precheck-shared';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 4).join('\n      ')}`); }
}
const pc = (o: Partial<PublicVerdictPrecheck>): PublicVerdictPrecheck => ({
  answers: 'overall_problem', target: 'the final answer', proposed: 'zzz', verdict: 'incorrect', confidence: 'high', ...o,
});

// A numeric fixture (the values are test data, not prompt text).
const GIVEN = 'A 10 kg block rests on a ramp inclined at 30 degrees. Take g = 9.8 m/s^2. Find the normal force.';
const A: WithheldAnswer = { value: '84.9 N', studentText: 'I think the normal force is 98 N', givenText: GIVEN };
const hit = (s: string, a: WithheldAnswer = A) => revealsWithheldAnswer(s, a).hit;

console.log('active');
test('HIGH overall_problem/incorrect with a value, flag on — and nothing else', () => {
  assert.equal(wholeAnswerRevealGuardActive(pc({}), '84.9 N'), true);
  assert.equal(wholeAnswerRevealGuardActive(pc({}), '84.9 N', { enabled: false }), false, 'kill switch');
  assert.equal(wholeAnswerRevealGuardActive(pc({}), '  '), false, 'no value');
  assert.equal(wholeAnswerRevealGuardActive(pc({ confidence: 'medium' }), '84.9 N'), false);
  assert.equal(wholeAnswerRevealGuardActive(pc({ answers: 'open_question' }), '84.9 N'), false);
  assert.equal(wholeAnswerRevealGuardActive(pc({ verdict: 'correct' }), '84.9 N'), false);
  assert.equal(wholeAnswerRevealGuardActive(null, '84.9 N'), false);
});

console.log('numbers — the same value however it is written');
test('the two live replies are hits', () => {
  assert.ok(hit('Working it through: on an incline, the normal force only balances the weight component perpendicular to the ramp, so $N = mg\\cos(30°) = 10 \\times 9.8 \\times \\cos(30°) \\approx 84.9\\text{ N}$ — not 98 N.'));
  assert.ok(hit('Working it out: on a ramp, the normal force balances only the weight component perpendicular to the surface, so $N = mg\\cos(30°) ≈ 84.9\\text{ N}$.'));
});
test('rounding, units, LaTeX, powers of ten, spoken', () => {
  for (const s of [
    'That comes to 84.87 N.', 'It is about 84.9 newtons.', 'So $N \\approx 84.870\\,\\text{N}$.', 'You get roughly 85 N.',
    'N = 8.49 \\times 10^{1} N', 'The force is 84.9N.', 'It works out to eighty-four point nine newtons.',
  ]) assert.ok(hit(s), s);
  // The check wrote more digits than the reply, and the other way round.
  assert.ok(hit('About 84.9 N.', { ...A, value: 'N = mg cos 30° = 10 × 9.8 × 0.866 ≈ 84.87 N' }));
  assert.ok(hit('About 84.87 N.', { ...A, value: '≈ 85 N' }));
});
test('never the student\'s own value, never given data, never an unrelated number', () => {
  for (const s of [
    'That answer is not what the problem gives.',
    'You wrote 98 N — which direction does the normal force point?',
    'The block is 10 kg on a 30° ramp, with g = 9.8.',
    'Look at the diagram: is the surface tilted 30 degrees from the horizontal?',
    'There are 2 forces to think about, and step 1 is the diagram.',
    'What is 9.8 times 10?',
    'Is it more or less than 98?',
  ]) assert.equal(hit(s), false, s);
  // Only the result of the check's value counts — not the givens inside it,
  // even when the problem's wording is not available.
  const noGiven: WithheldAnswer = { value: 'N = 10 × 9.8 × cos 30° ≈ 84.9 N', studentText: '98', givenText: '' };
  assert.equal(hit('The ramp is at 30 degrees and the mass is 10 kg.', noGiven), false);
  assert.ok(hit('So N is 84.9.', noGiven));
});
test('a rounded form must still be a distinctive number', () => {
  const a: WithheldAnswer = { value: '2.4', studentText: '7', givenText: '' };
  assert.equal(hit('There are 2 parts to this.', a), false);
  assert.equal(hit('What do the 2 terms have in common?', a), false);
  assert.ok(hit('It is 2.4.', a));
  assert.ok(hit('It is 2.40 exactly.', a));
});
test('a single-digit result: only where a result stands, never a coefficient or an exponent', () => {
  const a: WithheldAnswer = { value: 'x = 3', studentText: 'x = 5', givenText: 'Solve 2x + 1 = 7.' };
  for (const s of ['So $x = 3$.', 'The answer is 3.', 'That gives 3.', 'x equals about 3']) assert.ok(hit(s, a), s);
  for (const s of ['There are 3 steps here.', 'Try $3x$ first.', 'Look at $x^3$.', 'What do you subtract in step 3?', 'Solve $2x + 1 = 7$ again.']) assert.equal(hit(s, a), false, s);
});
test('several results, signs, fractions, percent', () => {
  const two: WithheldAnswer = { value: 'x = 3 or x = -2', studentText: 'x = 6', givenText: 'x^2 - x - 6 = 0' };
  assert.ok(hit('One root is $x = -2$.', two));
  assert.equal(hit('What is 5 - 2 here?', two), false, 'a subtraction is not a negative result');
  const frac: WithheldAnswer = { value: '\\frac{3}{4}', studentText: '1/2', givenText: '' };
  assert.ok(hit('It is 0.75.', frac)); assert.ok(hit('That is $\\frac{3}{4}$.', frac)); assert.ok(hit('So 75% of them.', frac));
  assert.equal(hit('You wrote 1/2.', frac), false);
  const pct: WithheldAnswer = { value: '12.5%', studentText: '20%', givenText: '' };
  assert.ok(hit('It is 0.125.', pct)); assert.ok(hit('So 12.5 percent.', pct));
  const big: WithheldAnswer = { value: '12,500', studentText: '1,250', givenText: '' };
  assert.ok(hit('That is 12500 in all.', big)); assert.ok(hit('It is $1.25 \\times 10^4$.', big));
  assert.equal(hit('You wrote 1,250.', big), false);
});

console.log('values with no number in them');
test('an expression, a word, a choice letter — conservatively', () => {
  const ex: WithheldAnswer = { value: 'y = \\sqrt{x} + c', studentText: 'y = x + c', givenText: '' };
  assert.ok(hit('So $y = \\sqrt{x} + c$.', ex)); assert.ok(hit('It is sqrt(x)+c.', ex));
  assert.equal(hit('Which rule did you use on y?', ex), false);
  const word: WithheldAnswer = { value: 'osmosis', studentText: 'diffusion', givenText: '' };
  assert.ok(hit('That process is osmosis.', word)); assert.equal(hit('Is diffusion the only way across?', word), false);
  assert.equal(hit('That is osmosis.', { ...word, givenText: 'Explain how osmosis differs from active transport.' }), false, 'named by the problem');
  const letter: WithheldAnswer = { value: 'B', studentText: 'C', givenText: '(A) one (B) two (C) three' };
  assert.ok(hit('The answer is B.', letter)); assert.ok(hit('Look at option (B) again.', letter));
  assert.equal(hit('Before you choose, what does the question ask?', letter), false);
  assert.equal(hit('Both A and C look tempting here.', letter), false);
});
test('never throws, and nothing to guard is never a hit', () => {
  assert.equal(revealsWithheldAnswer('It is 84.9.', null).hit, false);
  assert.equal(revealsWithheldAnswer('', A).hit, false);
  assert.equal(revealsWithheldAnswer('It is 84.9.', { ...A, value: '' }).hit, false);
});

console.log('board');
test('equation LaTeX, handwriting, problem / solution fields, nested cells', () => {
  assert.ok(boardRevealsWithheldAnswer({ latex: 'N = mg\\cos 30° \\approx 84.9\\,\\text{N}' }, A).hit);
  assert.ok(boardRevealsWithheldAnswer({ text: 'N ≈ 85 N' }, A).hit);
  assert.ok(boardRevealsWithheldAnswer({ problem: { statement: GIVEN, solution: '84.87' } }, A).hit);
  assert.ok(boardRevealsWithheldAnswer({ rows: [['mass', '10'], ['N', '84.9']] }, A).hit);
  assert.equal(boardRevealsWithheldAnswer({ latex: 'N = ?', text: 'm = 10 kg, θ = 30°' }, A).hit, false);
  assert.equal(boardRevealsWithheldAnswer({ id: 'eq-849', color: '#849849', url: 'https://x.test/84.9' }, A).hit, false);
  assert.deepEqual(boardStrings({ id: 'a', items: [{ text: 'one' }, { label: 'two', color: '#fff' }] }), ['one', 'two']);
  // A lone single digit on the board is the result written down.
  assert.ok(boardRevealsWithheldAnswer({ latex: '3' }, { value: 'x = 3', studentText: 'x = 5', givenText: '2x + 1 = 7' }).hit);
});

console.log('on a hit');
test('retry feedback: no value, no working, statement first', () => {
  const f = wholeAnswerRevealFeedback('I think it is 98 N');
  assert.match(f, /I think it is 98 N/);
  assert.doesNotMatch(f, /84/);
  assert.match(f, /no working at all/);
  assert.ok(f.search(/first sentence/) < f.search(/not what the problem gives/) && f.search(/not what the problem gives/) < f.search(/one question/));
  assert.equal(isAnswerRevealingKill([{ action: WHOLE_ANSWER_REVEAL_ACTION }]), true, 'its board renders are swept with it');
});
test('fallback tail: fixed, generic, and read as a non-match', () => {
  assert.deepEqual(wholeAnswerFallbackTail([]), [WHOLE_ANSWER_FALLBACK_STATEMENT, WHOLE_ANSWER_FALLBACK_QUESTION]);
  assert.deepEqual(wholeAnswerFallbackTail(['Your answer is not what the problem gives.']), [WHOLE_ANSWER_FALLBACK_QUESTION]);
  assert.deepEqual(wholeAnswerFallbackTail(['Your answer is not what the problem gives.', 'Which way does it point?']), []);
  assert.deepEqual(wholeAnswerFallbackTail(['Weight acts straight down.']), [WHOLE_ANSWER_FALLBACK_STATEMENT, WHOLE_ANSWER_FALLBACK_QUESTION]);
  for (const s of [WHOLE_ANSWER_FALLBACK_STATEMENT, WHOLE_ANSWER_FALLBACK_QUESTION]) assert.doesNotMatch(s, /\d|\$/);
  assert.equal(readMatchStatement(`${WHOLE_ANSWER_FALLBACK_STATEMENT} ${WHOLE_ANSWER_FALLBACK_QUESTION}`, '98 N'), 'differs');
  assert.equal(resolveMatchCredit({ precheck: pc({}), match: 'none' }).credit, 'incorrect', 'counted either way');
});

console.log('seal');
test('round trip; tampering, garbage and absence open to null', () => {
  const sealed = sealWithheldAnswer({ value: '84.9 N', studentText: 'is it 98 N?' });
  assert.ok(sealed && !sealed.includes('84.9') && !Buffer.from(sealed, 'base64').toString('latin1').includes('84.9'));
  assert.deepEqual(openWithheldAnswer(sealed), { value: '84.9 N', studentText: 'is it 98 N?' });
  assert.equal(openWithheldAnswer(sealed.slice(0, -4) + 'AAAA'), null);
  assert.equal(openWithheldAnswer('not a seal'), null);
  assert.equal(openWithheldAnswer(undefined), null);
  assert.equal(openWithheldAnswer(42), null);
});

console.log('wiring — source');
const src = (p: string) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');
test('server: every sentence and tool call goes through the guard; the frame carries no value', () => {
  const brain = src('src/lib/tutor/voice/claude-brain.ts');
  // No sentence is yielded past the guard inside the streaming generator.
  const gen = brain.slice(brain.indexOf('export async function* streamBrainTurn'));
  const raw = (gen.match(/yield \{ type: 'sentence'/g) ?? []).length;
  assert.equal(raw, 2, 'only the guard itself yields sentences (the passed sentence and the fixed tail)');
  assert.match(gen, /yield\* guardedSentence\(/);
  assert.match(gen, /boardRevealsWithheldAnswer\(/);
  assert.match(gen, /type: 'answer-reveal', where: /);
  assert.doesNotMatch(gen, /type: 'answer-reveal'[^}]*matched/);
  assert.match(gen, /wholeAnswerRevealGuardActive\(/);
  const route = src('src/app/api/tutor/brain/stream/route.ts');
  assert.match(route, /ev\.type === 'answer-reveal'/);
  assert.match(route, /verdictPrecheckSeal/);
});
test('client: the frame discards the attempt and retries once; the seal rides the retry', () => {
  const vtr = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert.match(vtr, /type === 'answer-reveal'/);
  assert.match(vtr, /wholeAnswerRevealKillUsed/);
  assert.match(vtr, /WHOLE_ANSWER_REVEAL_ACTION, reason: wholeAnswerRevealFeedback\(/);
  assert.match(vtr, /whole_answer_reveal_hit/);
  assert.match(vtr, /whole_answer_reveal_retry/);
  assert.match(vtr, /whole_answer_reveal_fallback/);
  assert.match(vtr, /verdictPrecheckSeal: verdictPrecheckSealRef\.current/);
});

async function generatorTests() {
  console.log('the stream — nothing value-bearing leaves the server');
  type Req = Record<string, unknown> & { messages: Array<{ role: string; content: unknown }> };
  type Block = { text: string } | { tool: string; input: Record<string, unknown> };
  let script: Block[] = [];
  const registry = await import('../src/lib/tutor/ai/model-registry');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = registry.getModelClient('brain').client as any;
  let calls = 0;
  client.messages.stream = (_params: Req) => {
    calls++;
    // Only the first model call of a request speaks; a follow-up after tool results says nothing.
    const blocks = calls === 1 ? script : [];
    const events: unknown[] = [{ type: 'message_start' }];
    const content: unknown[] = [];
    blocks.forEach((b, index) => {
      if ('text' in b) {
        events.push({ type: 'content_block_start', index, content_block: { type: 'text', text: '' } }, { type: 'content_block_delta', index, delta: { type: 'text_delta', text: b.text } }, { type: 'content_block_stop', index });
        content.push({ type: 'text', text: b.text });
      } else {
        events.push({ type: 'content_block_start', index, content_block: { type: 'tool_use', id: `t${index}`, name: b.tool, input: {} } }, { type: 'content_block_delta', index, delta: { type: 'input_json_delta', partial_json: JSON.stringify(b.input) } }, { type: 'content_block_stop', index });
        content.push({ type: 'tool_use', id: `t${index}`, name: b.tool, input: b.input });
      }
    });
    const stop = blocks.some((b) => 'tool' in b) ? 'tool_use' : 'end_turn';
    events.push({ type: 'message_delta', delta: { stop_reason: stop } }, { type: 'message_stop' });
    return {
      async *[Symbol.asyncIterator]() { for (const e of events) yield e; },
      finalMessage: async () => ({ content, stop_reason: stop, usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } }),
      abort: () => {}, controller: { abort: () => {} },
    };
  };
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const { WHITEBOARD_TOOLS } = await import('../src/app/tutor/hooks/toolDefinitions');
  const base = {
    systemPrompt: 'CORE. SESSION.', systemPromptCore: 'CORE. ',
    conversationHistory: [{ role: 'assistant' as const, content: 'What would you like to work on?' }],
    studentTranscript: A.studentText,
    whiteboardSnapshot: [], tools: WHITEBOARD_TOOLS.filter((t: { name: string }) => t.name === 'show_equation'),
    activeProblem: { statement: GIVEN, source: 'student' as const },
    textTurnShape: true, textVerdictPrecheck: true, textWorkThenMatch: true,
  };
  const llm = (o: Record<string, unknown>) => async () => ({ text: JSON.stringify({ proposed_value: '98 N', problem_final_answer: '84.9 N', proposed_equals_final_answer: false, answers: 'overall_problem', target: 'the normal force', correct_value: '84.9 N', verdict: 'incorrect', confidence: 'high', ...o }), model: 'fake', inputTokens: 1, outputTokens: 1 });
  const run = async (blocks: Block[], input: Record<string, unknown> = {}) => {
    script = blocks; calls = 0;
    const events: Array<Record<string, unknown>> = [];
    const log = console.log, warn = console.warn; console.log = () => {}; console.warn = () => {};
    try { for await (const ev of brain.streamBrainTurn({ ...base, verdictPrecheckDeps: { llm: llm({}) }, ...input } as never)) events.push(ev as unknown as Record<string, unknown>); }
    finally { console.log = log; console.warn = warn; }
    return events;
  };
  const sentences = (ev: Array<Record<string, unknown>>) => ev.filter((e) => e.type === 'sentence').map((e) => String(e.text));
  const wire = (ev: Array<Record<string, unknown>>) => JSON.stringify(ev.filter((e) => e.type !== 'verdict-precheck'));
  const atest = async (name: string, fn: () => Promise<void>) => {
    try { await fn(); passed++; console.log(`  ✓ ${name}`); }
    catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 6).join('\n      ')}`); }
  };
  const REVEAL = 'The surface is tilted, so only part of the weight presses into it. That part is $N = mg\\cos(30°) \\approx 84.9\\text{ N}$, which is what the surface pushes back with. Does that make sense?';

  let seal = '';
  await atest('first attempt: the value-bearing sentence is withheld, the frame is sent, the fixed tail closes the reply', async () => {
    const ev = await run([{ text: REVEAL }]);
    const pre = ev.find((e) => e.type === 'verdict-precheck')!;
    seal = String(pre.seal ?? '');
    assert.ok(seal.length > 20 && !seal.includes('84.9'), 'the frame carries a seal, not the value');
    assert.ok(!JSON.stringify(pre).includes('84.9'));
    assert.ok(!wire(ev).includes('84.9'), wire(ev));
    const frame = ev.find((e) => e.type === 'answer-reveal')!;
    assert.deepEqual(frame, { type: 'answer-reveal', where: 'sentence', how: 'number' });
    assert.deepEqual(sentences(ev), ['The surface is tilted, so only part of the weight presses into it.', WHOLE_ANSWER_FALLBACK_STATEMENT, WHOLE_ANSWER_FALLBACK_QUESTION]);
    const done = ev.find((e) => e.type === 'done')!;
    assert.ok(!String(done.fullText).includes('84.9') && String(done.fullText).endsWith(WHOLE_ANSWER_FALLBACK_QUESTION));
  });
  await atest('the retry (no fresh student message): the seal re-arms the guard; a second reveal is withheld again', async () => {
    const carry = { answers: 'overall_problem', target: 'the normal force', proposed: '98 N', verdict: 'incorrect', confidence: 'high' };
    const ev = await run([{ text: 'Your answer is not what the problem gives. Working it out, N comes to about 85 N. Which way does N point?' }],
      { studentTranscript: '[validator feedback — not from the student] …', verdictPrecheckCarry: carry, verdictPrecheckSeal: seal, verdictPrecheckDeps: undefined });
    assert.ok(ev.some((e) => e.type === 'answer-reveal'));
    assert.deepEqual(sentences(ev), ['Your answer is not what the problem gives.', WHOLE_ANSWER_FALLBACK_QUESTION]);
    assert.ok(!wire(ev).includes('85'));
    // Without the seal (or with a foreign one) the retry is unguarded — the prompt rule alone.
    const bare = await run([{ text: 'N comes to about 85 N.' }], { studentTranscript: '[validator feedback] …', verdictPrecheckCarry: carry, verdictPrecheckSeal: 'garbage', verdictPrecheckDeps: undefined });
    assert.ok(!bare.some((e) => e.type === 'answer-reveal'));
  });
  await atest('a clean reply passes untouched', async () => {
    const ev = await run([{ text: 'Your answer of 98 N is not what the problem gives. Which direction does the surface push on the block?' }]);
    assert.ok(!ev.some((e) => e.type === 'answer-reveal'));
    assert.deepEqual(sentences(ev), ['Your answer of 98 N is not what the problem gives.', 'Which direction does the surface push on the block?']);
  });
  await atest('board: an equation that writes the result is not dispatched; nor is anything after the stop', async () => {
    const ev = await run([{ text: 'Your answer is not what the problem gives.' }, { tool: 'show_equation', input: { latex: 'N = mg\\cos 30° \\approx 84.9\\,\\text{N}' } }, { text: 'So N is smaller than the weight.' }, { tool: 'show_equation', input: { latex: 'W = mg' } }]);
    assert.deepEqual(ev.find((e) => e.type === 'answer-reveal'), { type: 'answer-reveal', where: 'board', how: 'number' });
    assert.equal(ev.filter((e) => e.type === 'tool-call').length, 0);
    assert.deepEqual(sentences(ev), ['Your answer is not what the problem gives.', WHOLE_ANSWER_FALLBACK_QUESTION]);
    assert.equal((ev.find((e) => e.type === 'done')!.toolCalls as unknown[]).length, 0);
    // A board item without the result is dispatched as usual.
    const ok = await run([{ text: 'Your answer is not what the problem gives.' }, { tool: 'show_equation', input: { latex: 'W = mg' } }, { text: 'Which component presses into the surface?' }]);
    assert.equal(ok.filter((e) => e.type === 'tool-call').length, 1);
    assert.ok(!ok.some((e) => e.type === 'answer-reveal'));
  });
  await atest('not armed for any other finding: a wrong STEP, medium confidence, a correct answer', async () => {
    for (const o of [{ answers: 'open_question' }, { confidence: 'medium' }, { verdict: 'correct', proposed_equals_final_answer: true }]) {
      const ev = await run([{ text: 'That comes to 84.9 N.' }], { verdictPrecheckDeps: { llm: llm(o) } });
      assert.ok(!ev.some((e) => e.type === 'answer-reveal'), JSON.stringify(o));
      assert.ok(!ev.some((e) => e.type === 'verdict-precheck' && e.seal), JSON.stringify(o));
      assert.deepEqual(sentences(ev), ['That comes to 84.9 N.']);
    }
  });
}

generatorTests().then(() => {
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}).catch((err) => { console.error(err); process.exit(1); });
