/**
 * Answer judging in VOICE sessions (src/lib/tutor/voice/voice-judging.ts and
 * its wiring: claude-brain.ts — the parallel pre-check and the voice rule
 * block; the stream route; the browser's hold / cut / continue; counting; the
 * retraction note).
 *
 * No network: the brain's model client is replaced by a scripted stream and
 * the pre-check call is injected (same technique as test-work-then-match.ts).
 * The tutor sentences are the ones recorded in the owner's live voice session
 * of 2026-10-06 (three correct answers told "Not quite", one wrong one
 * praised, two correct denials).
 *
 * NOT covered here, by construction: what a real model writes under the new
 * rule block, and how long a real pre-check takes on a voice turn.
 *
 * Run: npx tsx scripts/test-voice-judging.ts   (npm run test:voice-judging)
 */
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/test-no-db';
process.env.TUTOR_BRAIN_MODEL = 'claude-sonnet-5';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';
delete process.env.TUTOR_MODEL_BRAIN_FALLBACK;
for (const k of ['TUTOR_VOICE_TURN_SHAPE', 'TUTOR_VOICE_WORK_THEN_MATCH', 'TUTOR_VOICE_VERDICT_PRECHECK', 'TUTOR_VOICE_VERDICT_PRECHECK_TIMEOUT_MS', 'TUTOR_VOICE_THINKING']) delete process.env[k];

import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  VOICE_VERDICT_HOLD_DEADLINE_MS,
  VOICE_VERDICT_PRECHECK_TIMEOUT_MS,
  VOICE_VERDICT_WITHHELD_ACTION,
  VoiceVerdictGate,
  adjustTurnShapeForSpeech,
  formatVoiceWorkThenMatchBlock,
  isVoiceJudgingRequest,
  sentenceVerdictStance,
  stanceContradictsPrecheck,
  voiceHoldAppliesTo,
  voiceThinkingEnabled,
  voiceTurnShapeEnabled,
  voiceVerdictPrecheckEnabled,
  voiceVerdictPrecheckTimeoutMs,
  voiceVerdictWithheldFeedback,
  voiceWorkThenMatchEnabled,
  type VoiceVerdictCut,
} from '../src/lib/tutor/voice/voice-judging';
import { classifyTurnShape } from '../src/lib/tutor/voice/turn-shape-signal';
import { precheckCreditOverride, type PublicVerdictPrecheck } from '../src/lib/tutor/voice/verdict-precheck-shared';
import { readMatchStatement, resolveMatchCredit } from '../src/lib/tutor/voice/work-then-match';
import { VALIDATOR_FEEDBACK_PREFIX, VERDICT_WITHHELD_ACTION, buildValidatorFeedback } from '../src/lib/tutor/orchestrator/validator-feedback';
import { buildJudgeCorrectionNote } from '../src/lib/tutor/voice/judge-correction-note';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 5).join('\n      ')}`); }
}
const pc = (o: Partial<PublicVerdictPrecheck>): PublicVerdictPrecheck => ({
  answers: 'open_question', target: 'the step asked', proposed: 'zzz', verdict: 'correct', confidence: 'high', ...o,
});
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── the owner's session, 2026-10-06 (voice) ────────────────────────────────
const OWNER = {
  // 11:27 — correct, told "Not quite".
  point: {
    asked: 'With a slope of $\\frac{1}{3}$ — up 1, right 3 — where would the next point land from there?',
    student: 'So up 1 would make it 1 by 3 and right 3 would make it 3. So it should be 3 comma 1 by 3.',
    reply: ['Let\'s check that against the point we started from.', 'Not quite — let\'s track both coordinates together from the start point $(0, -\\frac{2}{3})$.', '"Up 1" changes the $y$-value, so it goes from $-\\frac{2}{3}$ up by 1; "right 3" changes the $x$-value, from 0 to 3.', 'What does $-\\frac{2}{3}$ plus 1 come out to?'],
  },
  // 15:14 — correct, told "Not quite".
  test: {
    asked: 'Want to run that same test-point check on the second inequality, $y < \\frac{1}{3}x - \\frac{2}{3}$, using $(0,0)$ again?',
    student: 'Yeah, so if you put 0 comma 0, it\'ll become 0 is less than -2 by 3, which is false.',
    reply: ['Let\'s check that work.', 'Not quite — let\'s plug the origin into the exact inequality on the board.', '$y < \\frac{1}{3}x - \\frac{2}{3}$ with $x=0,\\ y=0$ gives $0 \\overset{?}{<} \\frac{1}{3}(0) - \\frac{2}{3}$.', 'What does the right-hand side simplify to?'],
  },
  // 16:23 — correct, told "Not quite".
  common: {
    asked: 'With both lines and shading directions figured out, what region would you say is the final solution to the system — the one place both shadings overlap, or something else?',
    student: 'Yeah, definitely 0 comma 0 is not a common solution to both.',
    reply: ['Let\'s check this against the board.', 'Not quite — let\'s look at what we actually found for each test.', 'At $(0,0)$, the *first* inequality came out *true* ($0 < 4$), but the *second* came out *false*.'],
  },
  // 5:12 — wrong for the question asked, praised, and the answer given away.
  intercept: {
    asked: 'Now what\'s standing alone — the $y$-intercept?',
    student: '1 by 3?',
    reply: ['Right, that $\\frac{1}{3}$ is the slope, nicely spotted.', 'Looking at $y < \\frac{1}{3}x - \\frac{2}{3}$, the number standing alone — not multiplying $x$ — is $-\\frac{2}{3}$, so that\'s our $y$-intercept.'],
  },
  // 2:55 and 5:44 — wrong, correctly denied.
  slope: {
    asked: 'For the first one, what\'s the slope and $y$-intercept you\'d use to draw that boundary line?',
    student: 'For the first one, the slope is 4 and the y intercept is -2.',
    reply: ['Let\'s take a quick look at that.', 'Not quite — let\'s check against what\'s actually written on the board.', 'From $y < 4 - 2x$, picture it as $y < -2x + 4$: which number is multiplying $x$ (the slope), and which number stands alone (the $y$-intercept)?'],
  },
  solid: {
    asked: 'Since this one\'s also a strict inequality, what kind of boundary line do we draw this time — solid or dashed?',
    student: 'solid.',
    reply: ['Let\'s check that against what we need here.', 'Not quite — since $y < \\frac{1}{3}x - \\frac{2}{3}$ is a strict inequality, the boundary shouldn\'t be included, so it needs to be dashed, not solid.', 'Does that match the reasoning we used for the first line?'],
  },
  // 3:44 — a bare "Yes." to an either/or question.
  yes: { asked: 'Since this one\'s strict (less than, not less-than-or-equal), what kind of line do we draw for the boundary — solid or dashed?', student: 'Yes.' },
};

// ── a browser in miniature: the gate driven by a scripted stream ───────────

type Step =
  | { at: 'pending' }
  | { at: 'sentence'; text: string }
  | { at: 'precheck'; result: PublicVerdictPrecheck | null }
  | { at: 'deadline' }
  | { at: 'end' };

interface Played { spoken: string[]; cut: VoiceVerdictCut | null; heard: string; shown: string[]; holdsStarted: number; held: string[] }

/** The same calls VoiceTutorRealtime makes, in the same order: every sentence
 *  is announced on arrival and offered to the speaker at once (TTS gate open);
 *  what the gate holds waits in order; a cut trims the attempt to its mark and
 *  mutes everything after it. */
function play(steps: Step[], opts: { enabled?: boolean; student: string }): Played {
  const gate = new VoiceVerdictGate({ enabled: opts.enabled !== false, studentText: opts.student });
  const spoken: string[] = [];
  let held: string[] = [];
  let attemptText = '';
  let sentences: string[] = [];
  let cut: VoiceVerdictCut | null = null;
  let holdsStarted = 0;
  const applyCut = (c: VoiceVerdictCut) => {
    const at = held.indexOf(c.speech);
    for (const h of at >= 0 ? held.slice(0, at) : held) spoken.push(h);
    held = [];
    cut = c;
    attemptText = attemptText.slice(0, c.mark.textLen).trim();
    sentences = sentences.slice(0, c.mark.sentenceIndex);
  };
  for (const st of steps) {
    if (st.at === 'pending') gate.onPending();
    else if (st.at === 'sentence') {
      if (cut) continue;
      gate.onSentence(st.text, st.text, { textLen: attemptText.length, revealLen: attemptText.length, sentenceIndex: sentences.length });
      attemptText += (attemptText ? ' ' : '') + st.text;
      sentences.push(st.text);
      const d = gate.onEmit(st.text);
      if (d.action === 'speak') spoken.push(st.text);
      else if (d.action === 'hold') { if (held.length === 0) holdsStarted++; held.push(st.text); }
      else if (d.action === 'cut') applyCut(d.cut);
    } else {
      const d = st.at === 'precheck' ? gate.onPrecheck(st.result) : st.at === 'deadline' ? gate.onDeadline() : gate.onStreamEnd();
      if (d.action === 'release') { assert.deepEqual(d.sentences, held, 'the gate releases exactly what the browser holds, in order'); spoken.push(...held); held = []; }
      else if (d.action === 'cut') applyCut(d.cut);
    }
  }
  return { spoken, cut, heard: attemptText, shown: sentences, holdsStarted, held };
}
const say = (texts: string[]): Step[] => texts.map((text) => ({ at: 'sentence', text }));
/** Nothing is spoken twice, and nothing is spoken out of order. */
function assertSpokenOnceInOrder(p: Played, arrived: string[]) {
  assert.equal(new Set(p.spoken).size, p.spoken.length, `a sentence was spoken twice: ${JSON.stringify(p.spoken)}`);
  let i = -1;
  for (const s of p.spoken) {
    const j = arrived.indexOf(s, i + 1);
    assert.ok(j > i, `spoken out of order: ${JSON.stringify(p.spoken)}`);
    i = j;
  }
}

async function main() {
  console.log('switches');
  await test('each lever: voice + capable browser + flag not "off" ⇒ on; thinking is OFF unless "on"', () => {
    for (const f of [voiceTurnShapeEnabled, voiceWorkThenMatchEnabled, voiceVerdictPrecheckEnabled]) {
      assert.equal(f(undefined, true, undefined), true);
      assert.equal(f('voice', true, undefined), true);
      assert.equal(f(undefined, true, 'on'), true);
      assert.equal(f(undefined, true, 'off'), false);
    }
    assert.equal(voiceThinkingEnabled(undefined, true, undefined), false);
    assert.equal(voiceThinkingEnabled(undefined, true, 'off'), false);
    assert.equal(voiceThinkingEnabled(undefined, true, 'on'), true);
  });
  await test('never for a text session, never for a browser that did not announce the capability', () => {
    for (const f of [voiceTurnShapeEnabled, voiceWorkThenMatchEnabled, voiceVerdictPrecheckEnabled]) {
      assert.equal(f('text', true, undefined), false);
      assert.equal(f(undefined, undefined, undefined), false);
      assert.equal(f(undefined, 'true', undefined), false);
      assert.equal(f('voice', false, undefined), false);
    }
    assert.equal(voiceThinkingEnabled('text', true, 'on'), false);
    assert.equal(voiceThinkingEnabled(undefined, undefined, 'on'), false);
    assert.equal(isVoiceJudgingRequest('text', true), false);
    assert.equal(isVoiceJudgingRequest(undefined, true), true);
  });
  await test('the pre-check cap is about 3.5 s, and the browser deadline sits just above it', () => {
    assert.equal(VOICE_VERDICT_PRECHECK_TIMEOUT_MS, 3500);
    assert.equal(voiceVerdictPrecheckTimeoutMs(undefined), 3500);
    assert.equal(voiceVerdictPrecheckTimeoutMs('2500'), 2500);
    assert.equal(voiceVerdictPrecheckTimeoutMs('60000'), 3500);
    assert.equal(voiceVerdictPrecheckTimeoutMs('abc'), 3500);
    assert.ok(VOICE_VERDICT_HOLD_DEADLINE_MS > VOICE_VERDICT_PRECHECK_TIMEOUT_MS && VOICE_VERDICT_HOLD_DEADLINE_MS <= VOICE_VERDICT_PRECHECK_TIMEOUT_MS + 1000);
  });

  console.log('the voice rule block');
  const tsPoint = classifyTurnShape(OWNER.point.student, OWNER.point.asked);
  const block = formatVoiceWorkThenMatchBlock(OWNER.point.student, tsPoint);
  await test('replaces the verdict-opener instructions, keeps the opener as a neutral runway, working before match', () => {
    assert.ok(block.startsWith('<verdict_guard>\n') && block.endsWith('</verdict_guard>\n\n'));
    assert.match(block, /VOICE session/);
    assert.match(block, /REPLACES every instruction elsewhere/);
    assert.match(block, /answer-validation gate/);
    assert.match(block, /opener sentence your instructions require[^\n]*stays/);
    assert.match(block, /neutral/);
    assert.match(block, /no verdict, no praise, no denial/);
    assert.ok(block.indexOf('Say the working') < block.indexOf('Only then say whether that result matches'));
  });
  await test('worded for speech: one short sentence of working, never a long expression read aloud, the board carries it', () => {
    assert.match(block, /You are SPEAKING/);
    assert.match(block, /ONE short sentence/);
    assert.match(block, /Never read a long expression aloud/);
    assert.match(block, /board/);
    assert.match(block, /speech recognition/);
    assert.doesNotMatch(block, /\bwrote\b|\btyped\b|TEXT session/);
  });
  await test('generic: no value, no subject content, and no verdict wording is prescribed', () => {
    assert.doesNotMatch(block.replace(/^\d\. /gm, ''), /\d/, 'a digit in the rule block (other than its list numbers)');
    assert.doesNotMatch(block, /"Not quite|let's check that/i);
    assert.doesNotMatch(block, /slope|intercept|inequalit|fraction/i);
  });
  await test('a bare "Yes." to an either/or question gets the non-answer rule alone (3:44)', () => {
    const ts = classifyTurnShape(OWNER.yes.student, OWNER.yes.asked);
    const b = formatVoiceWorkThenMatchBlock(OWNER.yes.student, ts);
    assert.match(b, /does not propose an answer/);
    assert.match(b, /ask which one they mean/);
    assert.doesNotMatch(b, /WORK IT, THEN MATCH/);
    assert.doesNotMatch(b, /\d/);
  });
  await test('empty or runtime turn ⇒ no block', () => {
    assert.equal(formatVoiceWorkThenMatchBlock('', null), '');
    assert.equal(formatVoiceWorkThenMatchBlock('[validator feedback — not from the student] …', null), '');
  });
  await test('a spoken conditional statement is an answer, not a question (6:53 in the session)', () => {
    const said = 'Uh, when it is uh just a less than or a greater than, then it\'s uh dashed. Uh, if it\'s less than equal to or greater than equal to, then it is solid.';
    const raw = classifyTurnShape(said, 'In your own words, when do we use a dashed line versus a solid line for the boundary?');
    assert.equal(raw?.shape, 'question', 'the text sorter reads the "when" lead as a question');
    const adj = adjustTurnShapeForSpeech(raw, said);
    assert.equal(adj?.shape, 'answer');
    assert.equal(adj?.answerShaped, true);
    assert.equal(voiceHoldAppliesTo(raw, said), true);
    // A real question keeps its shape.
    const q = 'when do we flip the sign of an inequality like this one here?';
    assert.equal(adjustTurnShapeForSpeech(classifyTurnShape(q, 'Does that make sense?'), q)?.shape, 'question');
    const shortQ = 'when do we flip it';
    assert.equal(adjustTurnShapeForSpeech(classifyTurnShape(shortQ, 'Does that make sense?'), shortQ)?.shape, classifyTurnShape(shortQ, 'Does that make sense?')?.shape);
  });

  console.log('which sentence carries a verdict');
  await test('the opener and the working never do (they are spoken as they arrive)', () => {
    for (const s of [
      OWNER.point.reply[0], OWNER.test.reply[0], OWNER.common.reply[0], OWNER.slope.reply[0], OWNER.solid.reply[0],
      'Alright, let\'s work through this.', 'Okay, let me take a look.', 'Right, here we go.', 'Good question — let\'s dig in.',
      OWNER.point.reply[2], OWNER.point.reply[3], OWNER.test.reply[2], OWNER.test.reply[3],
      'From zero comma negative two thirds, up one and right three lands at three comma one third.',
      'Nice, that tracks.',
    ]) assert.equal(sentenceVerdictStance(s, OWNER.point.student), null, s);
  });
  await test('the three false denials and the two correct ones read as DENY', () => {
    for (const k of ['point', 'test', 'common', 'slope', 'solid'] as const) {
      assert.equal(sentenceVerdictStance(OWNER[k].reply[1], OWNER[k].student), 'deny', OWNER[k].reply[1]);
    }
    assert.equal(sentenceVerdictStance('Close — let\'s isolate $y$ carefully.'), 'deny');
    assert.equal(sentenceVerdictStance('So that is not quite right.'), 'deny');
    assert.equal(sentenceVerdictStance('That does not match what you said.', 'three'), 'deny');
  });
  await test('affirmations and match statements read as AFFIRM — including the 5:12 praise', () => {
    assert.equal(sentenceVerdictStance(OWNER.intercept.reply[0], OWNER.intercept.student), 'affirm');
    assert.equal(sentenceVerdictStance('That is exactly the point you gave.', 'x'), 'affirm');
    assert.equal(sentenceVerdictStance('So the working lands somewhere else, not the point you gave.', 'x'), 'deny');
    for (const s of ['Right.', 'Exactly right.', 'Right, that\'s it.', 'That\'s correct — setting $y=0$ does give $x=2$.', 'That is exactly what you said.', 'Which is the value you gave.', 'You were right.']) {
      assert.equal(sentenceVerdictStance(s, 'x'), 'affirm', s);
    }
  });
  await test('a sentence that says both, and a plain question, carry none', () => {
    assert.equal(sentenceVerdictStance('Your first part matches what you said, but the second gives something else.', 'x'), null);
    assert.equal(sentenceVerdictStance('Does that match the reasoning we used for the first line?'), null);
  });
  await test('contradiction needs a HIGH-confidence check that says the opposite', () => {
    assert.equal(stanceContradictsPrecheck(pc({}), 'deny'), 'denied_correct');
    assert.equal(stanceContradictsPrecheck(pc({ answers: 'overall_problem' }), 'deny'), 'denied_correct');
    assert.equal(stanceContradictsPrecheck(pc({ answers: 'other_part' }), 'deny'), null);
    assert.equal(stanceContradictsPrecheck(pc({ verdict: 'incorrect' }), 'affirm'), 'praised_incorrect');
    assert.equal(stanceContradictsPrecheck(pc({ answers: 'neither' }), 'affirm'), 'praised_non_answer');
    assert.equal(stanceContradictsPrecheck(pc({ answers: 'neither' }), 'deny'), null);
    assert.equal(stanceContradictsPrecheck(pc({}), 'affirm'), null);
    assert.equal(stanceContradictsPrecheck(pc({ verdict: 'incorrect' }), 'deny'), null);
    assert.equal(stanceContradictsPrecheck(pc({ confidence: 'medium' }), 'deny'), null);
    assert.equal(stanceContradictsPrecheck(pc({ confidence: 'low' }), 'deny'), null);
    assert.equal(stanceContradictsPrecheck(pc({ verdict: 'partly_correct' }), 'deny'), null);
    assert.equal(stanceContradictsPrecheck(null, 'deny'), null);
    assert.equal(stanceContradictsPrecheck(pc({}), null), null);
  });
  await test('the hold is armed only on an answer-shaped turn', () => {
    for (const k of ['point', 'test', 'common', 'intercept', 'slope', 'solid'] as const) {
      assert.equal(voiceHoldAppliesTo(classifyTurnShape(OWNER[k].student, OWNER[k].asked), OWNER[k].student), true, k);
    }
    assert.equal(voiceHoldAppliesTo(classifyTurnShape(OWNER.yes.student, OWNER.yes.asked), OWNER.yes.student), false);
    assert.equal(voiceHoldAppliesTo(classifyTurnShape('I don\'t know, tell me.', 'Where would the next point land?'), ''), false);
    assert.equal(voiceHoldAppliesTo(classifyTurnShape('[start lesson]', ''), ''), false);
    assert.equal(voiceHoldAppliesTo(null), false);
  });

  console.log('hold / release / cut — scripted streams');
  const all: Array<{ p: Played; arrived: string[] }> = [];
  const run = (name: string, steps: Step[], student: string, opts?: { enabled?: boolean }) => {
    const p = play(steps, { student, ...opts });
    all.push({ p, arrived: steps.filter((s): s is { at: 'sentence'; text: string } => s.at === 'sentence').map((s) => s.text) });
    void name;
    return p;
  };
  await test('no check running (flags off, or not an answer): every sentence is spoken as it arrives, nothing held', () => {
    const p = run('none', [...say(OWNER.point.reply), { at: 'end' }], OWNER.point.student);
    assert.deepEqual(p.spoken, OWNER.point.reply);
    assert.equal(p.holdsStarted, 0);
    assert.equal(p.cut, null);
  });
  await test('browser switch off: frames change nothing', () => {
    const p = run('disabled', [{ at: 'pending' }, ...say(OWNER.point.reply), { at: 'precheck', result: pc({}) }, { at: 'end' }], OWNER.point.student, { enabled: false });
    assert.deepEqual(p.spoken, OWNER.point.reply);
    assert.equal(p.cut, null);
  });
  await test('11:27 "(3, 1/3)" — check says CORRECT: the opener is spoken, "Not quite…" and what followed never are', () => {
    const p = run('point', [{ at: 'pending' }, ...say(OWNER.point.reply), { at: 'precheck', result: pc({}) }, { at: 'end' }], OWNER.point.student);
    assert.deepEqual(p.spoken, [OWNER.point.reply[0]], 'only the runway was spoken');
    assert.ok(p.cut);
    assert.equal(p.cut!.kind, 'denied_correct');
    assert.equal(p.cut!.sentence, OWNER.point.reply[1]);
    assert.equal(p.heard, OWNER.point.reply[0], 'the attempt is trimmed to exactly what was heard');
    assert.deepEqual(p.shown, [OWNER.point.reply[0]]);
  });
  await test('15:14 and 16:23 — the same: cut before the denial is spoken', () => {
    for (const k of ['test', 'common'] as const) {
      const p = run(k, [{ at: 'pending' }, ...say(OWNER[k].reply), { at: 'precheck', result: pc({ answers: k === 'common' ? 'overall_problem' : 'open_question' }) }, { at: 'end' }], OWNER[k].student);
      assert.deepEqual(p.spoken, [OWNER[k].reply[0]]);
      assert.equal(p.cut?.kind, 'denied_correct');
    }
  });
  await test('the working is spoken while the check runs; only the verdict sentence waits', () => {
    const reply = ['Okay, let me take a look.', 'From the start point, up one and right three lands at three comma one third.', 'That is exactly the point you gave.', 'Now, which side of each line do we shade?'];
    const steps: Step[] = [{ at: 'pending' }, ...say(reply.slice(0, 3))];
    const mid = play(steps, { student: OWNER.point.student });
    assert.deepEqual(mid.spoken, reply.slice(0, 2), 'opener and working are already out');
    assert.deepEqual(mid.held, [reply[2]]);
    const p = run('work-first', [...steps, ...say(reply.slice(3)), { at: 'precheck', result: pc({}) }, { at: 'end' }], OWNER.point.student);
    assert.deepEqual(p.spoken, reply, 'an agreeing check releases the held sentences in order');
    assert.equal(p.cut, null);
    assert.equal(p.holdsStarted, 1);
  });
  await test('2:55 and 5:44 — a correct denial: the check agrees, the reply is spoken as written', () => {
    for (const k of ['slope', 'solid'] as const) {
      const p = run(k, [{ at: 'pending' }, ...say(OWNER[k].reply), { at: 'precheck', result: pc({ verdict: 'incorrect' }) }, { at: 'end' }], OWNER[k].student);
      assert.deepEqual(p.spoken, OWNER[k].reply);
      assert.equal(p.cut, null);
    }
  });
  await test('5:12 — praise for a wrong answer: cut before the praise, the answer is never given away', () => {
    const p = run('intercept', [{ at: 'pending' }, ...say(OWNER.intercept.reply), { at: 'precheck', result: pc({ verdict: 'incorrect' }) }, { at: 'end' }], OWNER.intercept.student);
    assert.deepEqual(p.spoken, []);
    assert.equal(p.cut?.kind, 'praised_incorrect');
    assert.equal(p.heard, '');
  });
  await test('the check arrives BEFORE the verdict sentence: cut at the moment it would have been spoken', () => {
    const r = OWNER.test.reply;
    const p = run('early', [{ at: 'pending' }, ...say(r.slice(0, 1)), { at: 'precheck', result: pc({}) }, ...say(r.slice(1)), { at: 'end' }], OWNER.test.student);
    assert.deepEqual(p.spoken, [r[0]]);
    assert.equal(p.cut?.kind, 'denied_correct');
    assert.equal(p.holdsStarted, 0, 'nothing was ever held');
  });
  await test('a LATE check: the deadline releases the reply as written; the late finding cuts nothing already spoken', () => {
    const r = OWNER.point.reply;
    const p = run('late', [{ at: 'pending' }, ...say(r.slice(0, 2)), { at: 'deadline' }, ...say(r.slice(2)), { at: 'precheck', result: pc({}) }, { at: 'end' }], OWNER.point.student);
    assert.deepEqual(p.spoken, r, 'current behaviour');
    assert.equal(p.cut, null);
  });
  await test('a FAILED, unsure or medium-confidence check releases what was held, as written', () => {
    for (const result of [null, pc({ confidence: 'medium' }), pc({ confidence: 'low' }), pc({ verdict: 'partly_correct' }), pc({ verdict: 'cannot_determine' })]) {
      const p = run('weak', [{ at: 'pending' }, ...say(OWNER.point.reply), { at: 'precheck', result }, { at: 'end' }], OWNER.point.student);
      assert.deepEqual(p.spoken, OWNER.point.reply);
      assert.equal(p.cut, null);
    }
  });
  await test('no closing frame at all (lost): the end of the stream does not strand a held sentence past the deadline', () => {
    const r = OWNER.point.reply;
    const waiting = play([{ at: 'pending' }, ...say(r), { at: 'end' }], { student: OWNER.point.student });
    assert.deepEqual(waiting.spoken, [r[0]], 'still waiting for the check at stream end');
    const p = run('lost', [{ at: 'pending' }, ...say(r), { at: 'end' }, { at: 'deadline' }], OWNER.point.student);
    assert.deepEqual(p.spoken, r);
  });
  await test('a message that answers nothing, affirmed: cut; a denial of it: left alone', () => {
    const a = run('neither-affirm', [{ at: 'pending' }, ...say(['Okay, let me take a look.', 'Right.', 'So the next step is yours.']), { at: 'precheck', result: pc({ answers: 'neither' }) }, { at: 'end' }], 'forty one');
    assert.equal(a.cut?.kind, 'praised_non_answer');
    assert.deepEqual(a.spoken, ['Okay, let me take a look.']);
    const d = run('neither-deny', [{ at: 'pending' }, ...say(['Okay, let me take a look.', 'Not quite.', 'Try that step again.']), { at: 'precheck', result: pc({ answers: 'neither' }) }, { at: 'end' }], 'forty one');
    assert.equal(d.cut, null);
    assert.equal(d.spoken.length, 3);
  });
  await test('an earlier verdict sentence the check agrees with is spoken; the cut lands on the later one that contradicts', () => {
    const reply = ['Okay, let me take a look.', 'That is exactly what you said.', 'Then the second part.', 'Not quite — look at the sign.', 'What is it?'];
    const p = run('later', [{ at: 'pending' }, ...say(reply), { at: 'precheck', result: pc({}) }, { at: 'end' }], 'x');
    assert.deepEqual(p.spoken, reply.slice(0, 3));
    assert.equal(p.cut?.sentence, reply[3]);
    assert.equal(p.heard, reply.slice(0, 3).join(' '));
  });
  await test('the cut happens at most once, and sentences after it are dropped, not queued', () => {
    const gate = new VoiceVerdictGate({ enabled: true, studentText: 'x' });
    gate.onPending();
    gate.onSentence('Not quite.', 'Not quite.', { textLen: 0, revealLen: 0, sentenceIndex: 0 });
    assert.equal(gate.onEmit('Not quite.').action, 'hold');
    assert.equal(gate.onPrecheck(pc({})).action, 'cut');
    assert.equal(gate.cutDone, true);
    assert.equal(gate.onEmit('Try again.').action, 'drop');
    assert.equal(gate.onPrecheck(pc({})).action, 'none');
    assert.equal(gate.onDeadline().action, 'none');
    assert.equal(gate.onStreamEnd().action, 'none');
  });
  await test('NOTHING IS SPOKEN TWICE, and nothing out of order — across every scripted stream above', () => {
    assert.ok(all.length >= 15);
    for (const { p, arrived } of all) {
      assertSpokenOnceInOrder(p, arrived);
      if (p.cut) assert.ok(!p.spoken.includes(p.cut.sentence), 'the withheld sentence was spoken');
      assert.equal(p.held.length, 0, 'a sentence was left held at the end');
    }
  });

  console.log('the continuation after a cut');
  const cutFeedback = voiceVerdictWithheldFeedback({ kind: 'denied_correct', precheck: pc({ target: 'the next point on the line' }), studentText: OWNER.point.student, heardText: OWNER.point.reply[0], withheldSentence: OWNER.point.reply[1] });
  await test('the feedback: what was heard stays, nothing is repeated, the checked finding is stated, no value', () => {
    assert.match(cutFeedback, /HEARD all of it/);
    assert.match(cutFeedback, /withheld before it was spoken/);
    assert.match(cutFeedback, /found it CORRECT/);
    assert.match(cutFeedback, /Do not repeat or rephrase anything in it/);
    assert.match(cutFeedback, /no new opener phrase/);
    assert.match(cutFeedback, /Do not mention the check/);
    assert.ok(cutFeedback.includes(OWNER.point.student.slice(0, 40)));
    const praised = voiceVerdictWithheldFeedback({ kind: 'praised_incorrect', precheck: pc({ verdict: 'incorrect' }), studentText: 'q', heardText: '', withheldSentence: 'Right.' });
    assert.match(praised, /None of your reply had been spoken yet/);
    assert.match(praised, /found it INCORRECT/);
    assert.match(praised, /without giving its result away/);
    const non = voiceVerdictWithheldFeedback({ kind: 'praised_non_answer', precheck: pc({ answers: 'neither' }), studentText: 'q', heardText: 'Okay.', withheldSentence: 'Right.' });
    assert.match(non, /does NOT answer the question you asked/);
    assert.match(non, /no verdict of any kind/i);
  });
  await test('validator feedback: a withheld-verdict continuation is not worded as a rejected tool call or a cut-off', () => {
    assert.equal(VERDICT_WITHHELD_ACTION, VOICE_VERDICT_WITHHELD_ACTION);
    const msg = buildValidatorFeedback({ rejections: [{ action: VOICE_VERDICT_WITHHELD_ACTION, reason: cutFeedback }], attemptKilled: false, originalTranscript: OWNER.point.student, includeStudentContext: true });
    assert.ok(msg.startsWith(VALIDATOR_FEEDBACK_PREFIX), 'keeps the leading "[" the server guards key on');
    assert.ok(msg.endsWith(cutFeedback));
    assert.doesNotMatch(msg, /structural validator rejected|CUT OFF by a kill bridge|Re-deliver the spoken portion/);
    // With a real tool rejection beside it, the ordinary message is used and
    // still says the speech was delivered in full (never "re-deliver").
    const mixed = buildValidatorFeedback({ rejections: [{ action: 'show_equation', reason: 'bad latex' }, { action: VOICE_VERDICT_WITHHELD_ACTION, reason: cutFeedback }], attemptKilled: false, originalTranscript: 'q', includeStudentContext: true });
    assert.match(mixed, /DELIVERED IN FULL/);
    assert.doesNotMatch(mixed, /Re-deliver the spoken portion/);
  });

  console.log('counting — a correct answer is never counted wrong on the tutor\'s say-so');
  await test('the session\'s three false denials: with a HIGH "correct" check nothing is counted against the student', () => {
    for (const k of ['point', 'test', 'common'] as const) {
      const reply = OWNER[k].reply.join(' ');
      const credit = resolveMatchCredit({ precheck: pc({}), match: readMatchStatement(reply, OWNER[k].student) });
      assert.notEqual(credit.credit, 'incorrect', k);
      assert.equal(precheckCreditOverride(pc({})).suppressIncorrect, true);
    }
  });
  await test('after a cut the turn\'s text is heard part + continuation, and it counts CORRECT from the check', () => {
    const full = `${OWNER.point.reply[0]} From the start point, up one and right three lands at three comma one third. That is exactly the point you gave.`;
    // The shared reader has no word for "the point you gave": the check carries it.
    assert.deepEqual(resolveMatchCredit({ precheck: pc({}), match: readMatchStatement(full, OWNER.point.student) }), { credit: 'correct', source: 'precheck', disagreement: false });
    const plain = `${OWNER.point.reply[0]} Up one and right three lands there. That is exactly what you said.`;
    assert.equal(readMatchStatement(plain, OWNER.point.student), 'matches');
    assert.deepEqual(resolveMatchCredit({ precheck: pc({}), match: 'matches' }), { credit: 'correct', source: 'precheck', disagreement: false });
  });
  await test('a WRONG needs agreement: the check alone, or the tutor\'s words against the check, count nothing', () => {
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'incorrect' }), match: 'none' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'incorrect' }), match: 'matches' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({ verdict: 'incorrect' }), match: 'differs' }).credit, 'incorrect');
    assert.equal(resolveMatchCredit({ precheck: pc({}), match: 'differs' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({}), match: 'differs' }).disagreement, true);
  });
  await test('order: verified key → HIGH check → unambiguous match statement → nothing (late or failed check included)', () => {
    assert.equal(resolveMatchCredit({ objectiveCorrect: true, precheck: pc({ verdict: 'incorrect' }), match: 'differs' }).source, 'verified_key');
    assert.equal(resolveMatchCredit({ verifiedWrong: true, precheck: pc({}), match: 'matches' }).credit, 'incorrect');
    assert.deepEqual(resolveMatchCredit({ precheck: null, match: 'matches' }), { credit: 'correct', source: 'match_statement', disagreement: false });
    assert.equal(resolveMatchCredit({ precheck: null, match: 'none' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({ confidence: 'medium', verdict: 'incorrect' }), match: 'matches' }).credit, 'none');
    assert.equal(resolveMatchCredit({ precheck: pc({ answers: 'neither' }), match: 'matches' }).credit, 'none');
  });

  console.log('wiring — the brain request (scripted model stream, injected check)');
  type Req = Record<string, unknown> & { messages: Array<{ role: string; content: unknown }> };
  const requests: Array<{ at: number; params: Req }> = [];
  let streamScript: Array<{ text: string; delayMs?: number }> = [{ text: 'Okay, let me take a look. ' }, { text: 'Up one and right three lands at three comma one third. ' }, { text: 'That is the point you gave.' }];
  const registry = await import('../src/lib/tutor/ai/model-registry');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = registry.getModelClient('brain').client as any;
  client.messages.stream = (params: Req) => {
    requests.push({ at: Date.now(), params: JSON.parse(JSON.stringify(params)) as Req });
    const script = streamScript;
    const text = script.map((s) => s.text).join('');
    return {
      async *[Symbol.asyncIterator]() {
        yield { type: 'message_start' };
        yield { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } };
        for (const s of script) {
          if (s.delayMs) await sleep(s.delayMs);
          yield { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: s.text } };
        }
        yield { type: 'content_block_stop', index: 0 };
        yield { type: 'message_delta', delta: { stop_reason: 'end_turn' } };
        yield { type: 'message_stop' };
      },
      finalMessage: async () => ({ content: [{ type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } }),
      abort: () => {}, controller: { abort: () => {} },
    };
  };
  const brain = await import('../src/lib/tutor/voice/claude-brain');
  const base = {
    systemPrompt: 'CORE. SESSION.', systemPromptCore: 'CORE. ',
    conversationHistory: [
      { role: 'user' as const, content: '[start lesson]' },
      { role: 'assistant' as const, content: OWNER.point.asked },
    ],
    studentTranscript: OWNER.point.student,
    whiteboardSnapshot: [], tools: [],
    activeProblem: { statement: 'Solve the system of inequalities by graphing.', source: 'card' as const },
  };
  interface Ran { events: Array<Record<string, unknown> & { at: number }>; user: string; params: Req; requestAt: number; startedAt: number }
  const run2 = async (input: Record<string, unknown>): Promise<Ran> => {
    requests.length = 0;
    const events: Ran['events'] = [];
    const startedAt = Date.now();
    const log = console.log, warn = console.warn; console.log = () => {}; console.warn = () => {};
    try { for await (const ev of brain.streamBrainTurn(input as never)) events.push({ ...(ev as unknown as Record<string, unknown>), at: Date.now() }); }
    finally { console.log = log; console.warn = warn; }
    const params = requests[0].params;
    const last = params.messages[params.messages.length - 1];
    return { events, user: typeof last?.content === 'string' ? last.content : JSON.stringify(last?.content), params, requestAt: requests[0].at, startedAt };
  };
  const reply = (o: Record<string, unknown>) => JSON.stringify({ proposed_value: '(3, 1/3)', problem_final_answer: '', proposed_equals_final_answer: false, answers: 'open_question', target: 'the next point', correct_value: '(3, 1/3)', verdict: 'correct', confidence: 'high', ...o });
  let llmCalls = 0;
  const llmAfter = (ms: number, text: string) => async () => { llmCalls++; await sleep(ms); return { text, model: 'fake', inputTokens: 1, outputTokens: 1 }; };
  const types = (r: Ran) => r.events.map((e) => String(e.type));

  const head = await run2({ ...base });
  await test('ALL FOUR OFF ⇒ the model request is the pre-existing voice request, byte for byte, and no new frame', async () => {
    const off = await run2({ ...base, voiceTurnShape: false, voiceWorkThenMatch: false, voiceVerdictPrecheck: false, voiceThinking: false, studentMessage: OWNER.point.student });
    assert.equal(JSON.stringify(off.params), JSON.stringify(head.params));
    assert.deepEqual(types(off), types(head));
    assert.ok(!types(off).some((t) => t.startsWith('verdict-precheck') || t === 'work-then-match' || t === 'thinking'));
    assert.deepEqual(head.params.thinking, { type: 'disabled' });
    assert.match(head.user, /<verdict_guard>/);
    assert.doesNotMatch(head.user, /<turn_shape>|VOICE session/);
  });
  await test('an old browser (no levers set by the route) with a student message attached: still the same request', async () => {
    const r = await run2({ ...base, studentMessage: OWNER.point.student });
    assert.equal(JSON.stringify(r.params), JSON.stringify(head.params));
  });
  await test('turn-shape alone: the facts block is added, the old guard stays, no model call is made for it', async () => {
    llmCalls = 0;
    const r = await run2({ ...base, voiceTurnShape: true, verdictPrecheckDeps: { llm: llmAfter(0, reply({})) } });
    assert.match(r.user, /<turn_shape>/);
    assert.doesNotMatch(r.user, /VOICE session/);
    assert.equal(llmCalls, 0);
    assert.deepEqual(r.params.thinking, { type: 'disabled' });
    assert.equal(JSON.stringify(r.params.system), JSON.stringify(head.params.system), 'the cached prefix is untouched');
  });
  await test('work-then-match alone: the VOICE rule takes the guard\'s place; the frame comes before any sentence', async () => {
    const r = await run2({ ...base, voiceWorkThenMatch: true });
    assert.match(r.user, /This is a VOICE session/);
    assert.match(r.user, /You are SPEAKING/);
    assert.doesNotMatch(r.user, /This is a TEXT session/);
    assert.doesNotMatch(r.user, /Open with praise \("Right\."/);
    assert.ok(r.user.trimEnd().endsWith('</student_said>'));
    assert.ok(types(r).indexOf('work-then-match') >= 0 && types(r).indexOf('work-then-match') < types(r).indexOf('sentence'));
    assert.equal(JSON.stringify(r.params.system), JSON.stringify(head.params.system));
    assert.equal(JSON.stringify(r.params.tools), JSON.stringify(head.params.tools));
  });
  await test('a text session keeps the TEXT rule (the voice fields are never set for it)', async () => {
    const r = await run2({ ...base, textWorkThenMatch: true, textTurnShape: true });
    assert.match(r.user, /This is a TEXT session/);
    assert.doesNotMatch(r.user, /VOICE session/);
  });
  await test('PARALLEL pre-check: the brain request goes out at once — it never waits for the check', async () => {
    llmCalls = 0;
    streamScript = [{ text: 'Okay, let me take a look. ' }, { text: 'Up one and right three lands at three comma one third. ', delayMs: 20 }, { text: 'That is the point you gave.', delayMs: 160 }];
    const r = await run2({ ...base, voiceTurnShape: true, voiceWorkThenMatch: true, voiceVerdictPrecheck: true, verdictPrecheckDeps: { llm: llmAfter(90, reply({})) } });
    assert.equal(llmCalls, 1);
    assert.ok(r.requestAt - r.startedAt < 60, `the brain call started ${r.requestAt - r.startedAt} ms in — it waited for the check`);
    assert.doesNotMatch(r.user, /<answer_check>/, 'the first attempt cannot carry a finding that does not exist yet');
    const t = types(r);
    assert.ok(t.indexOf('verdict-precheck-pending') >= 0 && t.indexOf('verdict-precheck-pending') < t.indexOf('sentence'), t.join(','));
    const firstSentence = r.events.find((e) => e.type === 'sentence')!;
    const frame = r.events.find((e) => e.type === 'verdict-precheck')!;
    assert.ok(frame, t.join(','));
    assert.ok(firstSentence.at < frame.at, 'the first sentence was out before the check reported');
    assert.ok(t.indexOf('verdict-precheck') < t.lastIndexOf('sentence'), `the finding is delivered MID-stream, not at the end: ${t.join(',')}`);
    assert.ok(t.indexOf('verdict-precheck') < t.indexOf('done'));
    const res = (frame as unknown as { result: Record<string, unknown> }).result;
    assert.deepEqual(Object.keys(res).sort(), ['answers', 'confidence', 'proposed', 'target', 'verdict'], 'the correct value never leaves the server');
    assert.equal(t.filter((x) => x === 'verdict-precheck').length, 1);
    assert.deepEqual(r.events.filter((e) => e.type === 'sentence').map((e) => e.text), head.events.filter((e) => e.type === 'sentence').map((e) => e.text), 'the reply itself is untouched');
  });
  await test('a check SLOWER than the reply: its frame still precedes `done`', async () => {
    streamScript = [{ text: 'Okay. ' }, { text: 'That is the point you gave.' }];
    const r = await run2({ ...base, voiceVerdictPrecheck: true, verdictPrecheckDeps: { llm: llmAfter(120, reply({})) } });
    const t = types(r);
    assert.ok(t.indexOf('verdict-precheck') > t.lastIndexOf('sentence') && t.indexOf('verdict-precheck') < t.indexOf('done'), t.join(','));
  });
  await test('a FAILED check, an unusable reply, a low-confidence one: `verdict-precheck-none`, never a finding', async () => {
    const failing = async () => { throw new Error('boom'); };
    for (const llm of [failing, llmAfter(5, 'not json'), llmAfter(5, reply({ confidence: 'low' })), llmAfter(5, reply({ verdict: 'cannot_determine' }))]) {
      const r = await run2({ ...base, voiceVerdictPrecheck: true, verdictPrecheckDeps: { llm } });
      const t = types(r);
      assert.ok(t.includes('verdict-precheck-none'), t.join(','));
      assert.ok(!t.includes('verdict-precheck'));
      assert.ok(t.indexOf('verdict-precheck-none') < t.indexOf('done'));
      assert.ok(t.includes('sentence'), 'the reply is delivered regardless');
    }
  });
  await test('a check that never returns is cut by its cap; the turn ends with `none`, not a hang', async () => {
    const never = () => new Promise<never>(() => {});
    const t0 = Date.now();
    const r = await run2({ ...base, voiceVerdictPrecheck: true, verdictPrecheckDeps: { llm: never, timeoutMs: 80 } });
    assert.ok(Date.now() - t0 < 1500);
    assert.ok(types(r).includes('verdict-precheck-none'));
    assert.equal(types(r)[types(r).length - 1], 'done');
  });
  await test('not answer-shaped (a bare "Yes." to an either/or, a question, a runtime turn): no check, no frame', async () => {
    llmCalls = 0;
    for (const [said, asked] of [[OWNER.yes.student, OWNER.yes.asked], ['why does that work?', OWNER.point.asked], ['[start lesson]', '']]) {
      const r = await run2({ ...base, conversationHistory: [{ role: 'assistant' as const, content: asked }], studentTranscript: said, voiceTurnShape: true, voiceWorkThenMatch: true, voiceVerdictPrecheck: true, verdictPrecheckDeps: { llm: llmAfter(0, reply({})) } });
      assert.ok(!types(r).some((t) => t.startsWith('verdict-precheck')), `${said}: ${types(r).join(',')}`);
    }
    assert.equal(llmCalls, 0);
  });
  await test('the bare "Yes." gets the non-answer rule in its request (3:44)', async () => {
    const r = await run2({ ...base, conversationHistory: [{ role: 'assistant' as const, content: OWNER.yes.asked }], studentTranscript: OWNER.yes.student, voiceTurnShape: true, voiceWorkThenMatch: true });
    assert.match(r.user, /does not propose an answer to your open question/);
    assert.match(r.user, /AMBIGUOUS/);
    assert.doesNotMatch(r.user, /<continuation_guard>/);
  });
  await test('runtime notes in front of the words: the levers read `studentMessage`', async () => {
    llmCalls = 0;
    const r = await run2({ ...base, studentTranscript: `[correction note — not from the student] …\n\n${OWNER.point.student}`, studentMessage: OWNER.point.student, voiceTurnShape: true, voiceVerdictPrecheck: true, verdictPrecheckDeps: { llm: llmAfter(0, reply({})) } });
    assert.equal(llmCalls, 1);
    assert.match(r.user, /<turn_shape>/);
  });
  await test('the continuation after a cut: `<answer_check>` re-rendered from what the browser was sent, no second check', async () => {
    llmCalls = 0;
    const r = await run2({
      ...base,
      conversationHistory: [...base.conversationHistory, { role: 'user' as const, content: OWNER.point.student }, { role: 'assistant' as const, content: OWNER.point.reply[0] }],
      studentTranscript: `${VALIDATOR_FEEDBACK_PREFIX} ${cutFeedback}`,
      voiceTurnShape: true, voiceWorkThenMatch: true, voiceVerdictPrecheck: true,
      verdictPrecheckCarry: pc({ target: 'the next point' }),
      verdictPrecheckDeps: { llm: llmAfter(0, reply({})) },
    });
    assert.equal(llmCalls, 0);
    assert.match(r.user, /<answer_check>/);
    assert.match(r.user, /Checked for that question: CORRECT/);
    assert.match(r.user, /match statement must agree with the check/);
    assert.doesNotMatch(r.user, /<turn_shape>|VOICE session/, 'a runtime turn carries no shape block and no rule block');
    assert.ok(!types(r).some((t) => t.startsWith('verdict-precheck')));
    const msgs = r.params.messages;
    assert.equal(JSON.stringify(msgs[msgs.length - 2].content).includes(OWNER.point.reply[0]), true, 'what was heard is the assistant turn in front of the note');
    assert.equal(JSON.stringify(msgs).includes('Not quite'), true, 'the withheld sentence appears only as a quotation inside the note');
    assert.equal(JSON.stringify(msgs[msgs.length - 2].content).includes('Not quite'), false);
  });
  await test('thinking: off by default; `voiceThinking` sends the same low-effort config a text session sends', async () => {
    assert.deepEqual(head.params.thinking, { type: 'disabled' });
    const v = await run2({ ...base, voiceThinking: true });
    const t = await run2({ ...base, textThinking: true });
    assert.deepEqual(v.params.thinking, { type: 'adaptive' });
    assert.deepEqual(v.params.thinking, t.params.thinking);
    assert.deepEqual(v.params.output_config, t.params.output_config);
    assert.equal(v.params.max_tokens, t.params.max_tokens);
    assert.equal(JSON.stringify(v.params.system), JSON.stringify(t.params.system), 'same prefix + same config ⇒ one cache entry for both modes');
  });

  console.log('wiring — source');
  const read = (p: string) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');
  await test('route: every lever is decided server-side from the mode, the capability and its own variable', () => {
    const route = read('src/app/api/tutor/brain/stream/route.ts');
    assert.match(route, /voiceTurnShapeEnabled\(body\.inputMode, body\.voiceJudging\) \? \{ voiceTurnShape: true \} : \{\}/);
    assert.match(route, /voiceWorkThenMatchEnabled\(body\.inputMode, body\.voiceJudging\) \? \{ voiceWorkThenMatch: true \} : \{\}/);
    assert.match(route, /voiceVerdictPrecheckEnabled\(body\.inputMode, body\.voiceJudging\) \? \{ voiceVerdictPrecheck: true \} : \{\}/);
    assert.match(route, /voiceThinkingEnabled\(body\.inputMode, body\.voiceJudging\)/);
    assert.match(route, /ev\.type === 'verdict-precheck-pending' \|\| ev\.type === 'verdict-precheck-none'/);
    // The text switches are where they were.
    assert.match(route, /textThinking: textThinkingEnabled\(body\.inputMode\)/);
    assert.match(route, /textWorkThenMatch: textWorkThenMatchEnabled\(body\.inputMode\)/);
    const src = read('src/lib/tutor/voice/voice-judging.ts');
    for (const v of ['TUTOR_VOICE_TURN_SHAPE', 'TUTOR_VOICE_WORK_THEN_MATCH', 'TUTOR_VOICE_VERDICT_PRECHECK', 'TUTOR_VOICE_THINKING']) assert.ok(src.includes(`process.env.${v}`), v);
  });
  await test('browser: announces the capability for voice only; the text body is untouched', () => {
    const vtr = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
    assert.match(vtr, /\.\.\.\(sessionMode !== 'text' \? \{ voiceJudging: true as const \} : \{\}\),/);
    assert.match(vtr, /sessionMode !== 'text' && attempt === 0 && transcript[^\n]*\n\s*\? \{ studentMessage: transcript \}/);
    assert.match(vtr, /sessionMode !== 'text' && attempt > 0 && verdictPrecheckRef\.current\s*\n\s*\? \{ verdictPrecheck: verdictPrecheckRef\.current \}/);
    assert.match(vtr, /\.\.\.\(sessionMode === 'text' \? \{ inputMode: 'text' as const \} : \{\}\),/);
  });
  await test('browser: the gate is first attempt + voice + its own switch; frames settle it; a cut mutes the rest and continues', () => {
    const vtr = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
    assert.match(vtr, /enabled: TUTOR_VOICE_VERDICT_HOLD && sessionMode !== 'text' && attempt === 0/);
    assert.match(vtr, /const voiceEmit = voiceGate\.onEmit\(s\);/);
    assert.match(vtr, /voiceGate\.onSentence\(trimmedSentence, sentenceForSpeech,/);
    assert.match(vtr, /type === 'verdict-precheck-pending'\) \{[\s\S]{0,200}voiceGate\.onPending\(\)/);
    assert.match(vtr, /type === 'verdict-precheck-none'\) \{[\s\S]{0,300}settleVoiceGate\(null\)/);
    assert.match(vtr, /settleVoiceGate\(pc\);/);
    assert.match(vtr, /if \(voiceVerdictCut\) continue;/);
    assert.match(vtr, /voice_verdict_cut_tool_skipped/);
    assert.match(vtr, /action: VOICE_VERDICT_WITHHELD_ACTION,/);
    assert.match(vtr, /if \(voiceVerdictCut && !attemptKilled && attempt < attemptCap && aggregatedFullText\.trim\(\)\) \{\s*\n\s*continuationNextAttempt = true;/);
    // The cut never goes through the audio-chopping kill.
    const cutFn = /const applyVoiceVerdictCut = [\s\S]*?\n {8}\};\n/.exec(vtr)?.[0] ?? '';
    assert.ok(cutFn.length > 200);
    assert.doesNotMatch(cutFn, /performKill|clearSpeechQueue|speakKillBridge/);
    const flags = read('src/lib/tutor/orchestrator/turn-round-flags.ts');
    assert.match(flags, /TUTOR_VOICE_VERDICT_HOLD =\s*process\.env\.NEXT_PUBLIC_TUTOR_VOICE_VERDICT_HOLD !== 'off'/);
  });
  await test('browser: counting follows the server\'s frame in voice as in text', () => {
    const vtr = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
    assert.match(vtr, /const matchCounting = TUTOR_TEXT_MATCH_COUNTING && workThenMatchTurnRef\.current;/);
    assert.match(vtr, /\.\.\.\(TUTOR_TEXT_MATCH_COUNTING && workThenMatchTurnRef\.current\s*\n\s*\? \{ matchCredit: resolveMatchCredit\(/);
    assert.match(vtr, /precheckCreditOverride\(verdictPrecheckRef\.current, \{ enabled: TUTOR_PRECHECK_CREDIT \}\)/);
  });
  await test('harness: --print-voice-hash / --print-text-hash exist and make no model call', () => {
    const h = read('scripts/replay-verdict-turns.ts');
    assert.match(h, /flag\('print-voice-hash'\) \|\| flag\('print-text-hash'\)/);
    assert.match(h, /no model call in hash mode/);
  });

  console.log('retraction note (both modes)');
  await test('a wrongly denied correct answer is owned in ONE plain sentence before anything else', () => {
    const note = buildJudgeCorrectionNote(['Not quite.'], OWNER.point.student, { mode: 'retraction', ownIt: true }) ?? '';
    assert.match(note, /^\[correction note — not from the student\]/);
    assert.match(note, /ONE plain sentence/);
    assert.match(note, /"you were right"/);
    assert.match(note, /you were wrong to tell them otherwise/);
    assert.match(note, /before you respond to what they say now/);
    assert.match(note, /then move on with the lesson/);
    assert.match(note, /If on re-checking you stand by what you said/, 'the safety valve stays');
    assert.match(note, /NEVER narrate/);
    assert.doesNotMatch(note, /Actually, hold on/);
    // Generic: the only values in it are the ones quoted from the session.
    const own = /If you did reject a correct answer,[^`]*?then move on with the lesson\./.exec(note)?.[0] ?? '';
    assert.ok(own.length > 100);
    assert.doesNotMatch(own, /\d/);
  });
  await test('default ON; off ⇒ the 2026-10-04 wording; the other note modes are untouched', () => {
    const flags = read('src/lib/tutor/orchestrator/turn-round-flags.ts');
    assert.match(flags, /TUTOR_RETRACTION_OWN_IT =\s*process\.env\.NEXT_PUBLIC_TUTOR_RETRACTION_OWN_IT !== 'off'/);
    assert.match(buildJudgeCorrectionNote(['Not quite.'], 'x', { mode: 'retraction' }) ?? '', /ONE plain sentence/);
    const old = buildJudgeCorrectionNote(['Not quite.'], 'x', { mode: 'retraction', ownIt: false }) ?? '';
    assert.match(old, /open this turn by briefly owning the correction \("Actually, hold on — you were right: …"\)/);
    for (const mode of ['legacy', 'neutral', 'false_praise'] as const) {
      assert.equal(buildJudgeCorrectionNote(['So $x = 11$.'], 'x', { mode, ownIt: true }), buildJudgeCorrectionNote(['So $x = 11$.'], 'x', { mode, ownIt: false }), mode);
    }
  });

  console.log(`\n${failed === 0 ? `All ${passed} voice-judging tests passed.` : `${failed} FAILED, ${passed} passed.`}`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => { console.error(err); process.exit(1); });
