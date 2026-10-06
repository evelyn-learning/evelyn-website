/**
 * Text mode "work it, then match" (src/lib/tutor/voice/work-then-match.ts and
 * its wiring: claude-brain.ts per-turn blocks, the stream route, the client's
 * opener backstop and counting path).
 *
 * No network: the brain's model client is replaced by a scripted stream and
 * the pre-check call is injected (same technique as test-verdict-precheck.ts).
 * The opener cases are the first sentences recorded in
 * artifacts/replay-verdict-turns/levers/results.jsonl.
 *
 * Run: npx tsx scripts/test-work-then-match.ts   (npm run test:work-then-match)
 */
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/test-no-db';
process.env.TUTOR_BRAIN_MODEL = 'claude-sonnet-5';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';
delete process.env.TUTOR_MODEL_BRAIN_FALLBACK;
delete process.env.TUTOR_TEXT_WORK_THEN_MATCH;

import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  applyOpenerBackstop,
  backstopAppliesTo,
  formatWorkThenMatchBlock,
  isNonAnswerShape,
  openerBackstopFeedback,
  readMatchStatement,
  readVerdictOpener,
  resolveMatchCredit,
  textWorkThenMatchEnabled,
} from '../src/lib/tutor/voice/work-then-match';
import { classifyTurnShape, formatTurnShapeBlock } from '../src/lib/tutor/voice/turn-shape-signal';
import { formatAnswerCheckBlock, type PublicVerdictPrecheck } from '../src/lib/tutor/voice/verdict-precheck-shared';
import { formatTextThinkingBlock } from '../src/lib/tutor/voice/text-thinking';
import { VERDICT_PRECHECK_TIMEOUT_MS, verdictPrecheckTimeoutMs } from '../src/lib/tutor/voice/verdict-precheck';
import { inferWrongEvent } from '../src/lib/tutor/orchestrator/answer-attempt';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 4).join('\n      ')}`); }
}
const pc = (o: Partial<PublicVerdictPrecheck>): PublicVerdictPrecheck => ({
  answers: 'open_question', target: 'the step asked', proposed: 'zzz', verdict: 'correct', confidence: 'high', ...o,
});

async function main() {
  console.log('flag');
  await test('text + unset ⇒ on; text + off ⇒ off; voice / no mode ⇒ off', () => {
    assert.equal(textWorkThenMatchEnabled('text', undefined), true);
    assert.equal(textWorkThenMatchEnabled('text', 'on'), true);
    assert.equal(textWorkThenMatchEnabled('text', 'off'), false);
    assert.equal(textWorkThenMatchEnabled('voice', undefined), false);
    assert.equal(textWorkThenMatchEnabled(undefined, undefined), false);
  });

  console.log('opener classifier — recorded openers');
  const ONLY = ['Right.', 'Exactly!', 'Not quite.', 'Close.', 'Nice work.', 'Yes — exactly.', 'Yes, exactly!', 'Correct.', 'Spot on.', 'Well done!', 'That\'s right.', 'Right — that\'s it.', 'Right — that works.', 'Exactly right.', 'Almost.', 'Nope.', 'Good.', 'Perfect!'];
  for (const s of ONLY) {
    await test(`only a verdict: ${JSON.stringify(s)}`, () => assert.equal(readVerdictOpener(s, { answerShaped: true }).kind, 'only'));
  }
  const FUSED: Array<[string, string | null]> = [
    ['Right — the x\'s cancel.', 'The x\'s cancel.'],
    ['Right — $-10 < x < 2$.', '$-10 < x < 2$.'],
    ['Right — 30 m/s.', '30 m/s.'],
    ['Exactly — $f^{-1}(x) = \\dfrac{x-6}{2}$.', '$f^{-1}(x) = \\dfrac{x-6}{2}$.'],
    ['Exactly right — 4 is the limit.', '4 is the limit.'],
    ['Right, exactly — $-10 < x < 2$ is the full solution.', '$-10 < x < 2$ is the full solution.'],
    ['Yes, exactly — it confirms the verification.', 'It confirms the verification.'],
    ['Not quite — check the sign there.', 'Check the sign there.'],
    ['Not quite — that\'s the answer from problem 1.', 'That\'s the answer from problem 1.'],
    ['Close — but double check which level that lands on.', 'Double check which level that lands on.'],
    ['Close, but check your algebra: from $x = \\dfrac{y-1}{3}$, multiplying both sides by 3 gives $3x = y-1$.', 'Check your algebra: from $x = \\dfrac{y-1}{3}$, multiplying both sides by 3 gives $3x = y-1$.'],
    ['Great — so putting both pieces together: $-10 < x < 2$.', 'Putting both pieces together: $-10 < x < 2$.'],
    ['Good — $x < 2$ is one part.', '$x < 2$ is one part.'],
    ['Right — splitting into the lower three and upper three works perfectly for an even data set like this.', 'Splitting into the lower three and upper three works perfectly for an even data set like this.'],
    ['Good start — $x < 2$ is right for one side.', '$x < 2$ is right for one side.'],
    ['Good instinct, and your conclusion—42 isn\'t an outlier—is right.', 'Your conclusion—42 isn\'t an outlier—is right.'],
    ['That\'s exactly right: $-10 < x < 2$.', '$-10 < x < 2$.'],
    ['Not quite what I\'m after — CH2O is the empirical formula itself, not the multiplier.', null],
    ['Not quite for that new one — $x=4$ makes the denominator zero too.', null],
    ['That\'s not quite it — for a ball thrown up at 20 m/s, x = 4 isn\'t the height.', 'For a ball thrown up at 20 m/s, x = 4 isn\'t the height.'],
  ];
  for (const [s, rest] of FUSED) {
    await test(`fused with content: ${JSON.stringify(s.slice(0, 60))}`, () => {
      const r = readVerdictOpener(s, { answerShaped: true });
      assert.equal(r.kind, 'fused');
      assert.equal(r.kind === 'fused' ? r.remainder : undefined, rest);
    });
  }
  const NONE = [
    'Good question.', 'Great question — the fence is a cut-off.', 'Good to know, thank you for telling me.',
    'Here we go.', 'Here we go — problem two is up.', 'Let\'s check: $3(4) + 1 = 13$, and $|13| = 13$.',
    'Plugging in, $g \\cdot t = 10 \\times 3 = 30$ m/s — that is the value you gave.',
    'Right now we are on problem two.', 'Close the bracket first.', 'No worries — it\'s a circle.',
    'Correct to two decimal places, that is 3.14.', 'Right, so the next step is the denominator.',
    'Which one would you like to lead with — nominating someone else, or the recess appointment?',
    'Just to be sure — call it here, or go over something else first?', 'Sure thing — did you want to double check the IQR?',
    'So when the x\'s cancel, what\'s left on top and bottom?', 'Go ahead — cancel the common $x$ factor.',
    'Hmm, I\'m not sure what "400" refers to here.', 'That 400 is right for part (a), the NPP — but that\'s not what I just asked.',
    'Checking $x=4$: $|3(4)+1| = 13$, and $13 \\geq 10$ is true, so $x=4$ works.',
    'Almost every circle question hides a triangle.', 'Good, so now we have both bounds.', 'Nice and simple: $2 + 2 = 4$.',
  ];
  for (const s of NONE) {
    await test(`not a verdict opener: ${JSON.stringify(s.slice(0, 60))}`, () => assert.equal(readVerdictOpener(s, { answerShaped: true }).kind, 'none'));
  }
  await test('praise of the move ("Good catch", "Nice try") is an opener only when the student proposed an answer', () => {
    assert.equal(readVerdictOpener('Good catch on the numerator — $\\sqrt{4}-2=0$.', { answerShaped: true }).kind, 'fused');
    assert.equal(readVerdictOpener('Good catch on the numerator — $\\sqrt{4}-2=0$.', { answerShaped: false }).kind, 'none');
    assert.equal(readVerdictOpener('Good thinking.', { answerShaped: true }).kind, 'only');
    assert.equal(readVerdictOpener('Good thinking.', { answerShaped: false }).kind, 'none');
    assert.equal(readVerdictOpener('Good question.', { answerShaped: true }).kind, 'none');
  });

  console.log('opener backstop — where it applies');
  const shape = (student: string, prior: string) => classifyTurnShape(student, prior);
  await test('answers, hedges, bare tokens, check requests, an assent that settles nothing', () => {
    assert.equal(backstopAppliesTo(shape('I don\'t know, maybe 30 m/s?', 'What speed do you get?')), true);
    assert.equal(backstopAppliesTo(shape('41', 'What does the bottom become?')), true);
    assert.equal(backstopAppliesTo(shape('can you check my answer x = 4', 'What does the bottom become?')), true);
    assert.equal(backstopAppliesTo(shape('yes', 'What does the bottom become?')), true);
    assert.equal(backstopAppliesTo(shape('yes', 'Next problem, or wrap up here?')), true);
  });
  await test('not on consent to an offer / readiness chatter, nor on a runtime turn', () => {
    assert.equal(backstopAppliesTo(shape('yes', 'Ready for the next one?')), false);
    assert.equal(backstopAppliesTo(shape('ok', 'Here is the second problem.')), false);
    assert.equal(backstopAppliesTo(shape('[start lesson]', '')), false);
    assert.equal(backstopAppliesTo(null), false);
  });

  console.log('opener backstop — strip, kill once, never loop');
  await test('a verdict-only first sentence is dropped and the rest shown', () => {
    const r = applyOpenerBackstop(['Not quite.', 'Plugging in gives $30$.', 'What units go with it?'], { answerShaped: true, canKill: true });
    assert.equal(r.action, 'strip');
    assert.deepEqual(r.sentences, ['Plugging in gives $30$.', 'What units go with it?']);
  });
  await test('several verdict-only sentences in a row are all dropped', () => {
    const r = applyOpenerBackstop(['Yes!', 'Exactly.', 'The limit is $\\frac14$.'], { answerShaped: true, canKill: true });
    assert.deepEqual(r.sentences, ['The limit is $\\frac14$.']);
  });
  await test('a reply that is nothing but the verdict is left as it is (the remainder must stand on its own)', () => {
    const r = applyOpenerBackstop(['Exactly.'], { answerShaped: true, canKill: true });
    assert.equal(r.action, 'none');
    assert.deepEqual(r.sentences, ['Exactly.']);
  });
  await test('a fused opener is killed (once) with feedback naming the rule', () => {
    const r = applyOpenerBackstop(['Right — the x\'s cancel.', 'What is left?'], { answerShaped: true, canKill: true });
    assert.equal(r.action, 'kill');
    const fb = openerBackstopFeedback('Right — the x\'s cancel.', 'maybe they cancel?');
    assert.match(fb, /verdict or praise/i);
    assert.match(fb, /work/i);
    assert.match(fb, /match/i);
    assert.doesNotMatch(fb, /\d/, 'feedback carries no value');
  });
  await test('…and on a message that proposed nothing the feedback asks for no working at all', () => {
    const fb = openerBackstopFeedback('Great — let\'s multiply it out.', 'yes', { nonAnswer: true });
    assert.match(fb, /verdict or praise/i);
    assert.match(fb, /without stating the result of your open question/i);
    assert.doesNotMatch(fb, /begin with the working/i);
  });
  await test('the rule gates the working on what the value is an attempt AT, and never supplies the rest of a partial answer', () => {
    const b = formatWorkThenMatchBlock('41');
    assert.match(b, /decide what their value is an attempt AT/);
    assert.match(b, /you do not work that question and you do not state its result/);
    assert.match(b, /Do not supply the rest/);
  });
  await test('on the retry (no kill left) a fused opener loses its verdict phrase — never a second kill', () => {
    const r = applyOpenerBackstop(['Right — the x\'s cancel.', 'What is left?'], { answerShaped: true, canKill: false });
    assert.equal(r.action, 'strip_prefix');
    assert.deepEqual(r.sentences, ['The x\'s cancel.', 'What is left?']);
  });
  await test('a fused opener that cannot be cut cleanly is shown as it is once the kill is spent', () => {
    const r = applyOpenerBackstop(['Not quite what I\'m after — CH2O is the empirical formula.'], { answerShaped: true, canKill: false });
    assert.equal(r.action, 'none');
  });
  await test('a verdict AFTER the working is untouched', () => {
    const s = ['$10 \\times 3 = 30$ m/s.', 'Exactly the value you gave.', 'Nice work.'];
    const r = applyOpenerBackstop(s, { answerShaped: true, canKill: true });
    assert.equal(r.action, 'none');
    assert.deepEqual(r.sentences, s);
  });
  await test('acknowledgement of a non-answer and readiness chatter are untouched', () => {
    assert.equal(applyOpenerBackstop(['Good question.', 'The fence is a cut-off.'], { answerShaped: false, canKill: true }).action, 'none');
    assert.equal(applyOpenerBackstop(['Here we go.', 'Problem two is up.'], { answerShaped: false, canKill: true }).action, 'none');
  });

  console.log('match statement');
  const MATCHES = [
    'Plugging in, $10 \\times 3 = 30$ m/s — that is the value you gave.',
    '$v = gt = 30$ m/s, which matches what you wrote.',
    'The bottom becomes $2 + 2 = 4$, so the limit is $\\frac14$ — the same as your answer, and it is the final answer.',
    'That gives $-10 < x < 2$, exactly what you wrote.',
    'So 42 is below the fence of 45.5, which agrees with your answer.',
  ];
  for (const s of MATCHES) await test(`matches: ${JSON.stringify(s.slice(0, 50))}`, () => assert.equal(readMatchStatement(s), 'matches'));
  const DIFFERS = [
    '$180 \\div 30 = 6$. You wrote 3; the working gives 6 — the difference is in the division.',
    'Substituting gives $13$, which does not match the value you gave.',
    'The working gives $x > -10$ as well, which differs from what you wrote.',
    'That is $15$, not the value you gave.',
    'You wrote $46.25$, but the working gives $45.5$.',
  ];
  for (const s of DIFFERS) await test(`differs: ${JSON.stringify(s.slice(0, 50))}`, () => assert.equal(readMatchStatement(s), 'differs'));
  const NEITHER = [
    'What does the bottom become when $x = 0$?',
    'Your first value matches the working; the second differs from it.',
    'Which one would you like — the next problem, or to wrap up here?',
    'Right. Thirty it is.',
    'Not quite — check the sign.',
    'Does that match what you expected?',
  ];
  for (const s of NEITHER) await test(`no unambiguous statement: ${JSON.stringify(s.slice(0, 50))}`, () => assert.equal(readMatchStatement(s), 'none'));

  // Recorded in the first replay of the mode (arm D): statements the first
  // reader missed or misread.
  const WITH_STUDENT: Array<[string, string, 'matches' | 'differs' | 'none']> = [
    ['Using $v = g t$ gives $v = 10 \\times 3 = 30$ m/s — that\'s different from your 15, the slip is the extra division by 2. Want to try that formula again?', 'For (b): v = g x t / 2 = 10 x 3 / 2 = 15 m/s.', 'differs'],
    ['Empirical mass of $CH_2O$ is 30 g/mol, and $180/30=6$, not 3 — so the multiplier is 6, giving $C_6H_{12}O_6$, not $C_3H_6O_3$. Want to recompute that division?', 'For (b): CH2O is 30 g/mol and 180/30 = 3, so the molecular formula is C3H6O3.', 'differs'],
    ['Substituting: $g(g^{-1}(x)) = \\dfrac{3x}{3} = x$. That\'s not $3x+1$ — it simplifies all the way down to just $x$.', 'I don\'t know, maybe 3x + 1?', 'differs'],
    ['Ten percent of 40 is 4. That\'s where it differs from your answer — want to try that second step?', '10% of 400 is 40', 'differs'],
    ['Swapping gives $y = 3x + 1$. That\'s different from what you wrote — you have $g^{-1}(x) = 3x - 1$, but the last step should be adding 1, not subtracting.', 'g^-1(x) = 3x - 1', 'differs'],
    ['Your $x<2$ matches the first part, but the second gives $x>-10$, so the full solution is $-10<x<2$.', 'x < 2', 'none'],
    ['Plugging $x=0$ gives $0/0$ — that\'s indeterminate, not automatically 0.', 'the limit is 0', 'none'],
    ['The mean is $40 / 8 = 5$ — not $4$.', 'can you check my answer x = 4', 'differs'],
    ['That gives $30$ m/s, not 300.', 'maybe 30 m/s?', 'none'],
    ['$10 \\times 3 = 30$ m/s — that\'s exactly what you got.', 'maybe 30 m/s?', 'matches'],
    ['That gives $\\frac{1}{6}$ — that\'s the final answer, and it\'s exactly what you said.', 'maybe 1/6?', 'matches'],
  ];
  for (const [reply, student, want] of WITH_STUDENT) {
    await test(`${want}: ${JSON.stringify(reply.slice(0, 56))}`, () => assert.equal(readMatchStatement(reply, student), want));
  }

  console.log('counting');
  await test('1. a verified key decides, whatever else is said', () => {
    assert.equal(resolveMatchCredit({ objectiveCorrect: true, precheck: pc({ verdict: 'incorrect' }), match: 'differs' }).credit, 'correct');
    assert.equal(resolveMatchCredit({ verifiedWrong: true, precheck: null, match: 'none' }).credit, 'incorrect');
  });
  await test('2. a HIGH pre-check "correct" credits without any tutor words', () => {
    const r = resolveMatchCredit({ precheck: pc({ verdict: 'correct' }), match: 'none' });
    assert.equal(r.credit, 'correct'); assert.equal(r.source, 'precheck');
  });
  await test('a HIGH pre-check "incorrect" counts wrong ONLY with the tutor\'s match statement agreeing', () => {
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'incorrect' }), match: 'differs' }).credit, 'incorrect');
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'incorrect' }), match: 'none' }).credit, 'none');
  });
  await test('pre-check and match statement disagree ⇒ nothing counted, and it is flagged', () => {
    const a = resolveMatchCredit({ precheck: pc({ verdict: 'incorrect' }), match: 'matches' });
    assert.equal(a.credit, 'none'); assert.equal(a.disagreement, true);
    const b = resolveMatchCredit({ precheck: pc({ verdict: 'correct' }), match: 'differs' });
    assert.equal(b.credit, 'none'); assert.equal(b.disagreement, true);
  });
  await test('a pre-check that found a non-answer, or a right answer to ANOTHER part (an earlier one repeated), counts nothing', () => {
    assert.equal(resolveMatchCredit({ precheck: pc({ answers: 'neither', verdict: 'cannot_determine' }), match: 'matches' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({ answers: 'other_part', verdict: 'correct' }), match: 'matches' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({ answers: 'other_part', verdict: 'correct', confidence: 'medium' }), match: 'matches' }).credit, 'none');
  });
  await test('a WRONG answer to another part is still a wrong answer — with the tutor agreeing', () => {
    assert.equal(resolveMatchCredit({ precheck: pc({ answers: 'other_part', verdict: 'incorrect' }), match: 'differs' }).credit, 'incorrect');
    assert.equal(resolveMatchCredit({ precheck: pc({ answers: 'other_part', verdict: 'incorrect' }), match: 'none' }).credit, 'none');
  });
  await test('a check that says "partly" is neither a correct nor a wrong, whatever the match statement reads', () => {
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'partly_correct' }), match: 'matches' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'partly_correct', confidence: 'medium' }), match: 'differs' }).credit, 'none');
  });
  await test('3. no deciding check: the tutor\'s explicit match statement counts', () => {
    assert.equal(resolveMatchCredit({ precheck: null, match: 'matches' }).credit, 'correct');
    assert.equal(resolveMatchCredit({ precheck: null, match: 'differs' }).credit, 'incorrect');
    assert.equal(resolveMatchCredit({ precheck: null, match: 'matches' }).source, 'match_statement');
  });
  await test('…but not against a medium-confidence check that says otherwise', () => {
    const r = resolveMatchCredit({ precheck: pc({ verdict: 'correct', confidence: 'medium' }), match: 'differs' });
    assert.equal(r.credit, 'none'); assert.equal(r.disagreement, true);
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'incorrect', confidence: 'medium' }), match: 'differs' }).credit, 'incorrect');
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'correct', confidence: 'medium' }), match: 'matches' }).credit, 'correct');
  });
  await test('4. nothing to go on ⇒ nothing counted (a medium check alone never counts)', () => {
    assert.equal(resolveMatchCredit({ precheck: null, match: 'none' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'incorrect', confidence: 'medium' }), match: 'none' }).credit, 'none');
  });
  await test('ledger: with a resolved credit the tutor\'s opener words are not read', () => {
    // "Not quite" in the text, but the resolver counted nothing ⇒ no wrong event.
    assert.equal(inferWrongEvent({ studentText: 'x = 4', tutorText: 'Not quite — check the sign.', objectiveCorrect: false, matchCredit: 'none' }), false);
    assert.equal(inferWrongEvent({ studentText: 'x = 4', tutorText: 'The working gives 6.', objectiveCorrect: false, matchCredit: 'incorrect' }), true);
    assert.equal(inferWrongEvent({ studentText: 'x = 4', tutorText: 'The working gives 6.', objectiveCorrect: false, matchCredit: 'correct' }), false);
    // Not an answer attempt ⇒ never, whatever the credit.
    assert.equal(inferWrongEvent({ studentText: 'can you explain that again?', tutorText: 'x', objectiveCorrect: false, matchCredit: 'incorrect' }), false);
    // Omitted ⇒ the old read.
    assert.equal(inferWrongEvent({ studentText: 'x = 4', tutorText: 'Not quite — check the sign.', objectiveCorrect: false }), true);
  });

  console.log('pre-check cap');
  await test('default cap is 6 s; the env override still works', () => {
    assert.equal(VERDICT_PRECHECK_TIMEOUT_MS, 6000);
    assert.equal(verdictPrecheckTimeoutMs(undefined), 6000);
    assert.equal(verdictPrecheckTimeoutMs('4000'), 4000);
  });

  console.log('prompt blocks under the mode');
  const BANNED_OPEN = /open (?:it )?(?:by|with) (?:a verdict|crediting|telling them it is right|praise)/i;
  await test('the rule block: working first, then a factual match; non-answers get no verdict and no solution; short', () => {
    const b = formatWorkThenMatchBlock('I don\'t know, maybe 30 m/s?');
    assert.match(b, /^<verdict_guard>\n/);
    assert.match(b, /REPLACES/);
    assert.match(b, /do not begin with a verdict or praise/i);
    assert.match(b, /whether (?:that result|it) matches/i);
    assert.match(b, /final answer/i);
    assert.match(b, /does not answer/i);
    assert.match(b, /words/i);
    assert.doesNotMatch(b, /\d\s*(?:m\/s|percent|%)|\$[^$]+\$/, 'no subject content or example values');
  });
  await test('no block for a runtime turn', () => assert.equal(formatWorkThenMatchBlock('[validator feedback]'), ''));
  await test('a message that proposes nothing gets the non-answer rule alone — no instruction to work anything', () => {
    for (const [st, q] of [['yes', 'How would you write the complete solution?'], ['yes', 'Next problem, or wrap up here?'], ['why do we flip the sign?', 'What do you get?'], ['I don\'t know', 'What do you get?']] as Array<[string, string]>) {
      const ts = classifyTurnShape(st, q);
      assert.equal(isNonAnswerShape(ts), true, st);
      const b = formatWorkThenMatchBlock(st, ts);
      assert.match(b, /^<verdict_guard>\n/);
      assert.match(b, /REPLACES/);
      assert.match(b, /does not propose an answer/);
      assert.match(b, /Do NOT work it out for them/);
      assert.doesNotMatch(b, /Begin with the working/);
    }
    for (const [st, q] of [['maybe 5?', 'What do you get?'], ['41', 'What do you get?'], ['yes', 'Is the top zero there?'], ['can you check my answer x = 4', 'What do you get?']] as Array<[string, string]>) {
      const ts = classifyTurnShape(st, q);
      assert.equal(isNonAnswerShape(ts), false, st);
      assert.match(formatWorkThenMatchBlock(st, ts), /Begin with the working/);
    }
    assert.equal(isNonAnswerShape(null), false);
  });
  await test('<answer_check> correct: the checked value is given so the working can be held to it (never for a retry)', () => {
    const on = formatAnswerCheckBlock(pc({}), { correctValue: 'yyy', workThenMatch: true });
    assert.match(on, /The check's own result: "yyy"/);
    assert.doesNotMatch(formatAnswerCheckBlock(pc({}), { workThenMatch: true }), /own result/);
    assert.doesNotMatch(formatAnswerCheckBlock(pc({}), { correctValue: 'yyy' }), /yyy/);
  });
  await test('<private_reasoning> no longer says "open it with a verdict"', () => {
    const off = formatTextThinkingBlock(true, 'maybe 5?');
    const on = formatTextThinkingBlock(true, 'maybe 5?', { workThenMatch: true });
    assert.match(off, /open it with a verdict that matches/);
    assert.doesNotMatch(on, /open it with a verdict/);
    assert.match(on, /working/);
    assert.match(on, /matches? what/i);
  });
  await test('<answer_check>: "your working must reach the checked value and your match statement must agree"', () => {
    for (const p of [pc({}), pc({ answers: 'overall_problem' }), pc({ verdict: 'incorrect' }), pc({ verdict: 'partly_correct' }), pc({ answers: 'other_part' })]) {
      const on = formatAnswerCheckBlock(p, { correctValue: 'yyy', workThenMatch: true });
      assert.doesNotMatch(on, BANNED_OPEN, on);
      assert.doesNotMatch(on, /open by/i, on);
    }
    const c = formatAnswerCheckBlock(pc({}), { workThenMatch: true });
    assert.match(c, /working must reach the checked value/i);
    assert.match(c, /match statement must agree/i);
    const w = formatAnswerCheckBlock(pc({ verdict: 'incorrect' }), { correctValue: 'yyy', workThenMatch: true });
    assert.match(w, /match statement must agree/i);
    // Off ⇒ byte-identical to before.
    assert.equal(formatAnswerCheckBlock(pc({}), { correctValue: 'yyy' }), formatAnswerCheckBlock(pc({}), { correctValue: 'yyy', workThenMatch: false }));
    assert.match(formatAnswerCheckBlock(pc({})), /open by telling them it is right/);
  });
  await test('<turn_shape>: no "say it is right" / "before any verdict word" under the mode; off ⇒ unchanged', () => {
    const cases: Array<[string, string]> = [
      ['I don\'t know, maybe 30 m/s?', 'What does the bottom become?'],
      ['41', 'What does the bottom become?'],
      ['can you check my answer x = 4', 'What does the bottom become?'],
      ['yes', 'Is the top zero there?'],
      ['For (b): 180 / 30 = 3 so it is C3H6O3', 'What is the multiplier?'],
    ];
    for (const [s, q] of cases) {
      const ts = classifyTurnShape(s, q);
      const on = formatTurnShapeBlock(ts, s, { workThenMatch: true });
      const off = formatTurnShapeBlock(ts, s);
      assert.doesNotMatch(on, /say it is right|before any verdict word|do not state its result/i, on);
      assert.equal(off, formatTurnShapeBlock(ts, s, { workThenMatch: false }));
    }
  });

  console.log('wiring — the brain request');
  type Req = Record<string, unknown> & { messages: Array<{ role: string; content: unknown }> };
  const requests: Req[] = [];
  const registry = await import('../src/lib/tutor/ai/model-registry');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = registry.getModelClient('brain').client as any;
  client.messages.stream = (params: Req) => {
    requests.push(JSON.parse(JSON.stringify(params)) as Req);
    const text = 'Thirty.';
    const events = [
      { type: 'message_start' },
      { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text } },
      { type: 'content_block_stop', index: 0 },
      { type: 'message_delta', delta: { stop_reason: 'end_turn' } },
      { type: 'message_stop' },
    ];
    return {
      async *[Symbol.asyncIterator]() { for (const e of events) yield e; },
      finalMessage: async () => ({ content: [{ type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } }),
      abort: () => {}, controller: { abort: () => {} },
    };
  };
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const base = {
    systemPrompt: 'CORE. SESSION.', systemPromptCore: 'CORE. ',
    conversationHistory: [
      { role: 'user' as const, content: 'v = 15 m/s' },
      { role: 'assistant' as const, content: 'With g = 10 and t = 3, what do you get?' },
    ],
    studentTranscript: "I don't know, maybe 30 m/s?",
    whiteboardSnapshot: [], tools: [],
    activeProblem: { statement: 'A ball is dropped. Speed after 3 s? g = 10.', source: 'card' as const },
  };
  const run = async (input: Record<string, unknown>) => {
    requests.length = 0;
    const events: Array<Record<string, unknown>> = [];
    const log = console.log, warn = console.warn; console.log = () => {}; console.warn = () => {};
    try { for await (const ev of brain.streamBrainTurn(input as never)) events.push(ev as unknown as Record<string, unknown>); }
    finally { console.log = log; console.warn = warn; }
    const last = requests[0]?.messages[requests[0].messages.length - 1];
    return { events, user: typeof last?.content === 'string' ? last.content : JSON.stringify(last?.content) };
  };
  const llm = async () => ({ text: JSON.stringify({ proposed_value: '30 m/s', problem_final_answer: '30 m/s', proposed_equals_final_answer: true, answers: 'open_question', target: 'the speed', correct_value: '30 m/s', verdict: 'correct', confidence: 'high' }), model: 'fake', inputTokens: 1, outputTokens: 1 });
  const textAll = { ...base, textThinking: true, textTurnShape: true, textVerdictPrecheck: true, verdictPrecheckDeps: { llm } };

  await test('mode ON: the rule block replaces the old guard; no block asks for a verdict opener; the frame is sent first', async () => {
    const r = await run({ ...textAll, textWorkThenMatch: true });
    assert.match(r.user, /REPLACES/);
    assert.doesNotMatch(r.user, /Open with praise \("Right\."/);
    assert.doesNotMatch(r.user, /open it with a verdict that matches/);
    assert.doesNotMatch(r.user, /open by telling them it is right/);
    assert.match(r.user, /working must reach the checked value/i);
    assert.ok(r.user.trimEnd().endsWith('</student_said>'));
    const types = r.events.map((e) => e.type);
    assert.ok(types.includes('work-then-match'), `events: ${types.join(',')}`);
    assert.ok(types.indexOf('work-then-match') < types.indexOf('sentence'));
  });
  await test('mode OFF: user content and events exactly as at 2ba5ebb8 (same as leaving the field out)', async () => {
    const a = await run({ ...textAll });
    const b = await run({ ...textAll, textWorkThenMatch: false });
    assert.equal(a.user, b.user);
    assert.match(a.user, /Open with praise \("Right\."/);
    assert.match(a.user, /open it with a verdict that matches/);
    assert.ok(!a.events.some((e) => e.type === 'work-then-match'));
  });
  await test('voice: the mode field alone changes nothing unless the route set it (voice never does)', async () => {
    const a = await run({ ...base });
    assert.match(a.user, /Open with praise \("Right\."/);
    assert.ok(!a.events.some((e) => e.type === 'work-then-match'));
  });
  await test('a bare agreement to an offer keeps the continuation guard', async () => {
    const r = await run({ ...textAll, textWorkThenMatch: true, studentTranscript: 'yes', conversationHistory: [{ role: 'assistant' as const, content: 'Ready for the next one?' }] });
    assert.match(r.user, /<continuation_guard>/);
  });

  console.log('wiring — source');
  const read = (p: string) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');
  await test('route: the server flag is read where the per-turn blocks are requested, and the frame is forwarded', () => {
    const route = read('src/app/api/tutor/brain/stream/route.ts');
    assert.match(route, /textWorkThenMatch: textWorkThenMatchEnabled\(body\.inputMode\)/);
    assert.match(route, /ev\.type === 'work-then-match'/);
  });
  await test('client: backstop and counting are gated on text mode, the server frame and their flags (default ON)', () => {
    const flags = read('src/lib/tutor/orchestrator/turn-round-flags.ts');
    assert.match(flags, /TUTOR_TEXT_OPENER_BACKSTOP =\s*process\.env\.NEXT_PUBLIC_TUTOR_TEXT_OPENER_BACKSTOP !== 'off'/);
    assert.match(flags, /TUTOR_TEXT_MATCH_COUNTING =\s*process\.env\.NEXT_PUBLIC_TUTOR_TEXT_MATCH_COUNTING !== 'off'/);
    const vtr = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
    assert.match(vtr, /type\?: string \}\)\.type === 'work-then-match'/);
    assert.match(vtr, /TUTOR_TEXT_OPENER_BACKSTOP && sessionMode === 'text' && workThenMatchTurnRef\.current/);
    // Counting follows the server's frame in either mode (voice since 2026-10-06).
    assert.match(vtr, /TUTOR_TEXT_MATCH_COUNTING && workThenMatchTurnRef\.current/);
    assert.match(vtr, /readVerdictOpener\(/);
    assert.match(vtr, /resolveMatchCredit\(/);
    assert.match(vtr, /counting_disagreement/);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
