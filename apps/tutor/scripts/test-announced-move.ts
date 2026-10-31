/**
 * Task 16 (GDI live, embed-1793326847152): a fixed-script tutor turn that
 * announces the move into the NEXT part ("Now let's move on to the open
 * conversation.") moves the pointer — announced-move.ts.
 *
 * Run: npx tsx scripts/test-announced-move.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { announcedMoveTarget, MOVE_PHRASE_RE, segmentKeywords, announcedTurnNeedsContinuation, announcedContinueDecision, ANNOUNCED_CONTINUE_MIN_MS, ANNOUNCED_CONTINUE_MAX_MS, levelAdvanceNeedsContinuation, noAskTurnNeedsContinuation } from '../src/lib/tutor/lesson-plan/announced-move';
import { fixedScriptAnnouncedAdvanceLead, FIXED_SCRIPT_CONTINUE_DIRECTIVE, FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE, FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE } from '../src/lib/tutor/lesson-plan/fixed-script';
import type { LessonPlan, Segment } from '../src/lib/tutor/lesson-plan/types';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const seg = (id: string, kind: string, label: string, ja: string, extra: Record<string, unknown> = {}) =>
  ({ id, kind, metadata: { label, labelLocalized: { ja }, maxTurns: 6, ...extra } }) as unknown as Segment;
const SEGMENTS: Segment[] = [
  seg('overview', 'hook', 'Overview', '概要'),
  seg('level-check', 'misconception_check', 'Level check', 'レベルチェック', { skipWhenLevelKnown: true }),
  seg('topic-intro', 'concept', 'Your job', '仕事について'),
  seg('present-perfect', 'try_yourself', 'Present perfect', '現在完了'),
  seg('past-simple', 'try_yourself', 'Past simple', '過去形'),
  seg('open-conversation', 'extension', 'Conversation', '会話'),
  seg('pronunciation', 'try_yourself', 'Pronunciation', '発音'),
  seg('summary', 'recap', 'Summary', 'まとめ'),
];
const plan = (fixedScript: boolean) =>
  ({ id: 'test.announced', title: 'T', segments: SEGMENTS, metadata: fixedScript ? { fixedScript: true } : {} }) as unknown as LessonPlan;
const FIXED = plan(true);
const at = (tutorText: string, currentSegmentId: string, p: LessonPlan = FIXED, levelKnown = true) =>
  announcedMoveTarget({ tutorText, plan: p, currentSegmentId, levelKnown });

const LIVE = "Yes, that's correct. I went to a trade show last year is a good past simple sentence. Now let's move on to the open conversation.";

test('the live sentence from past-simple ⇒ open-conversation', () => {
  assert.equal(at(LIVE, 'past-simple'), 'open-conversation');
});
test('"Let\'s move on to the present perfect now." from topic-intro ⇒ present-perfect', () => {
  assert.equal(at("Let's move on to the present perfect now.", 'topic-intro'), 'present-perfect');
});
test('the same sentence from past-simple ⇒ null (not the next segment — never a jump)', () => {
  assert.equal(at("Let's move on to the present perfect now.", 'past-simple'), null);
});
test('"Now let\'s move on." ⇒ null (no keyword)', () => {
  assert.equal(at("Now let's move on.", 'past-simple'), null);
});
test('次は会話に進みましょう。 from past-simple ⇒ open-conversation', () => {
  assert.equal(at('次は会話に進みましょう。', 'past-simple'), 'open-conversation');
});
test('a non-fixed-script plan ⇒ null', () => {
  assert.equal(at(LIVE, 'past-simple', plan(false)), null);
});
test('"We\'ll talk about the conversation you had with your customer." ⇒ null (no move phrase)', () => {
  assert.equal(at("We'll talk about the conversation you had with your customer.", 'past-simple'), null);
});
test('a sentence naming another part too ⇒ null', () => {
  assert.equal(at("Now let's move on to the conversation, then pronunciation.", 'past-simple'), null);
});
test('curly apostrophe counts', () => {
  assert.equal(at('Now let’s move on to the open conversation.', 'past-simple'), 'open-conversation');
});
test('the last segment ⇒ null (nothing after it)', () => {
  assert.equal(at("Let's move on to the summary.", 'summary'), null);
});
test('level unknown: from overview the next is level-check', () => {
  assert.equal(at("Now let's move on to the level check.", 'overview', FIXED, false), 'level-check');
  assert.equal(at("Now let's move on to the level check.", 'overview', FIXED, true), null);
});
test('MOVE_PHRASE_RE: EN and JA forms', () => {
  for (const s of ["Let's go to the next part", 'Moving on to grammar', "Let's start the conversation", 'Next up is grammar', 'Time to move on to grammar', '会話に移りましょう', 'ロールプレイを始めましょう']) {
    assert.ok(MOVE_PHRASE_RE.test(s), s);
  }
  for (const s of ['We talked about your job.', 'Tell me about your last trip.']) assert.ok(!MOVE_PHRASE_RE.test(s), s);
});
test('segmentKeywords: label, ja label, id words; stopwords out; open kept', () => {
  const k = segmentKeywords(SEGMENTS[5]);
  assert.ok(k.includes('conversation') && k.includes('open') && k.includes('会話'), k.join(','));
  const j = segmentKeywords(SEGMENTS[2]);
  assert.ok(!j.includes('your') && j.includes('job') && j.includes('topic') && j.includes('intro'), j.join(','));
});
test('the real GDI plan: the live sentence from past-simple ⇒ open-conversation', () => {
  const real = JSON.parse(readFileSync(join(__dirname, '..', '..', '..', 'docs/whitelabel/gdi/plans/gdi-work-projects-v1.json'), 'utf8')) as LessonPlan;
  assert.equal(at(LIVE, 'past-simple', real), 'open-conversation');
});

// ── §B wiring pins ───────────────────────────────────────────────────────
const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const pin = (src: string, re: RegExp) => assert.ok(re.test(src), `missing ${re}`);
const VTR = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
const FLAGS = read('src/lib/tutor/orchestrator/flags.ts');
test('B: flag default ON', () => {
  pin(FLAGS, /export const TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE !== 'off';/);
});
test('B: the announced lead (brief text)', () => {
  assert.equal(
    fixedScriptAnnouncedAdvanceLead('past-simple', 'open-conversation', 'extension'),
    'The "past-simple" part is over — you announced the move yourself — and the lesson pointer has ALREADY moved to segment "open-conversation" (extension).',
  );
});
test('B: VTR — only when the budget rule did not fire, flag on, no advance_lesson, not homework; the NEXT segment only', () => {
  pin(VTR, /const announcedTarget = !autoReason && TUTOR_FIXED_SCRIPT_ANNOUNCED_ADVANCE && !homeworkSession && autoPlan && !opts\?\.prefetchOnly\s*&& !totalToolNamesSeen\.includes\('advance_lesson'\)\s*\? announcedMoveTarget\(\{ tutorText: fullText, plan: autoPlan, currentSegmentId: segIdNow, levelKnown: !!workingLevelRef\.current \}\)/);
  pin(VTR, /\?\? \(announcedTarget && autoPlan && announcedTarget === nextSegmentId\(autoPlan, segIdNow, !!workingLevelRef\.current\) \? 'announced' : null\)/);
  // the same advance path (pron hold, applyResolvedAdvance, FACT note) runs on advanceReason
  pin(VTR, /if \(!advanceReason\) \{ autoAdvancePronHeldRef\.current = 0; autoAdvanceAskHeldRef\.current = 0; \}\n\s*if \(autoPlan && advanceReason\) \{/);
  pin(VTR, /reason=\$\{advanceReason\} turns=/);
});

// ── §C continuation ──────────────────────────────────────────────────────
test('C: the live turn (no question, no ask) needs a continuation', () => {
  assert.equal(announcedTurnNeedsContinuation(LIVE), true);
  assert.equal(announcedTurnNeedsContinuation('次は会話に進みましょう。'), true);
});
test('C: a turn that asks something does not', () => {
  assert.equal(announcedTurnNeedsContinuation("Now let's move on to the open conversation. What did you do last weekend?"), false);
  assert.equal(announcedTurnNeedsContinuation("Now let's move on to the open conversation. Tell me about your last business trip."), false);
  assert.equal(announcedTurnNeedsContinuation('次は会話に進みましょう。週末は何をしましたか？'), false);
  assert.equal(announcedTurnNeedsContinuation(''), false);
});
test('C: decision — waits while speaking/busy/mid-utterance, min wait unseen, drops at the ceiling', () => {
  const d = (o: Partial<Parameters<typeof announcedContinueDecision>[0]>) =>
    announcedContinueDecision({ elapsedMs: 0, sawSpeaking: false, speaking: false, brainBusy: false, studentMidUtterance: false, ...o });
  assert.equal(d({ speaking: true, elapsedMs: 5000 }), 'wait');
  assert.equal(d({ brainBusy: true, elapsedMs: 5000 }), 'wait');
  assert.equal(d({ studentMidUtterance: true, elapsedMs: 5000 }), 'wait');
  assert.equal(d({ elapsedMs: ANNOUNCED_CONTINUE_MIN_MS - 1 }), 'wait');
  assert.equal(d({ elapsedMs: ANNOUNCED_CONTINUE_MIN_MS }), 'fire');
  assert.equal(d({ sawSpeaking: true, elapsedMs: 300 }), 'fire');
  assert.equal(d({ speaking: true, elapsedMs: ANNOUNCED_CONTINUE_MAX_MS }), 'drop');  // review I-1: the idle nudge's guard set
  for (const k of ['speechPending', 'awaitingDispatch', 'studentTyping', 'hold', 'paused', 'hidden'] as const) {
    assert.equal(d({ [k]: true, sawSpeaking: true, elapsedMs: 5000 }), 'wait', k);
    assert.equal(d({ [k]: true, elapsedMs: ANNOUNCED_CONTINUE_MAX_MS }), 'drop', k);
  }
  for (const k of ['standby', 'ending'] as const) assert.equal(d({ [k]: true, sawSpeaking: true, elapsedMs: 5000 }), 'drop', k);
  // review I-2: another brain turn ran since scheduling ⇒ never fires
  assert.equal(d({ turnSeqChanged: true, sawSpeaking: true, elapsedMs: 5000 }), 'drop');
  assert.equal(d({ turnSeqChanged: true, elapsedMs: 0 }), 'drop');
});
test('review I-3: drills are not announcements; 次は + keyword + copula is', () => {
  assert.equal(at("Let's do the same with the present perfect.", 'topic-intro'), null);
  assert.equal(at('次は過去形で言ってみましょう。', 'present-perfect'), null);
  assert.equal(at("Let's do your summary sentence again.", 'pronunciation'), null);
  assert.equal(at('次は会話です。', 'past-simple'), 'open-conversation');
  assert.equal(at('次は会話へ進みます。', 'past-simple'), 'open-conversation');
  assert.equal(at('次は会話への準備をしましょう。', 'past-simple'), null);
  assert.equal(at(LIVE, 'past-simple'), 'open-conversation');
  assert.ok(!MOVE_PHRASE_RE.test("Let's do the next one"));
});
test('C: the directive is the brief text', () => {
  assert.equal(FIXED_SCRIPT_CONTINUE_DIRECTIVE, '[System note: you announced the next part and then stopped without a question. The lesson pointer has moved; begin that part now from its notes — its first question or card — in one or two sentences. Do not repeat the announcement, do not recap.]');
});
test('C: VTR — scheduled once per segment on an announced advance, dispatched silently, cancelled by any other dispatch and on unmount', () => {
  pin(VTR, /if \(advanceReason === 'announced' && announcedTurnNeedsContinuation\(fullText\) && !announcedContinuedSegsRef\.current\.has\(autoNext\)\) \{\s*announcedContinuedSegsRef\.current\.add\(autoNext\);/);
  pin(VTR, /const speaking = productionStateRef\.current === 'speaking';/);
  // Task 23 §C: the scheduler is shared with the level-set advance (event per path).
  pin(VTR, /onDebugEvent\?\.\(via === 'level' \? 'fixed_script_level_continue' : via === 'noask' \? 'fixed_script_noask_continue' : 'fixed_script_announced_continue', `"\$\{contTarget\}" waited=\$\{waitedMs\}ms`\);\s*void handleStudentTranscriptForBrainRef\.current\?\.\(via === 'level' \? FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE : via === 'noask' \? FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE : FIXED_SCRIPT_CONTINUE_DIRECTIVE, \{ silent: true, bypassPerceptionDedupe: true \}\);/);
  pin(VTR, /announcedContinuedSegsRef\.current\.add\(autoNext\);\s*scheduleFixedScriptContinueRef\.current\(autoNext, 'announced'\);/);
  pin(VTR, /if \(announcedContinueTimerRef\.current && transcript !== FIXED_SCRIPT_CONTINUE_DIRECTIVE && transcript !== FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE && transcript !== FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE\) \{\s*clearTimeout\(announcedContinueTimerRef\.current\);/);
  const unmount = VTR.indexOf('// Student marks + tutor reactions: clear armed idle-send timers on unmount.');
  pin(VTR.slice(unmount, unmount + 2000), /clearTimeout\(announcedContinueTimerRef\.current\)/);
  // review I-1/I-2: guard set + turn sequence + drain-loop clear
  pin(VTR, /const contTurnSeq = brainCallSeqRef\.current;/);
  pin(VTR, /turnSeqChanged: brainCallSeqRef\.current !== contTurnSeq,/);
  for (const g of [/awaitingDispatch: awaitingDispatchTimerRef\.current != null,/, /studentTyping: studentTypingRef\.current,/, /hold: TUTOR_STUDENT_HOLD && !!studentHoldRef\.current,/, /standby: standbyRef\.current,/, /ending: endingRef\.current,/, /paused: isPausedRef\.current,/]) pin(VTR, g);
  pin(VTR, /while \(queuedTranscriptsRef\.current\.length > 0\) \{[\s\S]{0,300}clearTimeout\(announcedContinueTimerRef\.current\);/);
  pin(VTR, /productionStateRef\.current === 'disconnected' \|\| lessonClosedRef\.current \|\| farewellSealedRef\.current \|\| currentSegmentIdRef\.current !== contTarget/);
});

test('Task 19 §B: an offer is never an announcement (GDI run 7, 1135 s)', () => {
  assert.equal(at('Your sentence was complete and clear, so that\'s your pronunciation done for this item. Would you like to practise a few single words next, or move on to the summary?', 'pronunciation'), null);
  assert.equal(at('Shall we move on to the summary？', 'pronunciation'), null);
  assert.equal(at('Would you like to move on to the summary now.', 'pronunciation'), null);
  assert.equal(at('Do you want to move on to the summary', 'pronunciation'), null);
  assert.equal(at("Now let's move on to the summary.", 'pronunciation'), 'summary');
});

test('Task 19 fix round 2 (m7): a tag question does not make an offer', () => {
  assert.equal(at("Let's move on to the summary, shall we?", 'pronunciation'), 'summary');
  assert.equal(at("Now let's move on to the summary, okay?", 'pronunciation'), 'summary');
  assert.equal(at('Would you like to move on to the summary?', 'pronunciation'), null);
  assert.equal(at('Shall we move on to the summary, okay?', 'pronunciation'), null);
});

// Task 23 §C (GDI run 11, 130 s): the level-set advance continues silently too.
test('23C: level advance + a turn that asks nothing → continue; a question → no', () => {
  const T130 = "Thank you, that's a clear reason. Your answer to question 3 is good: you explained the skill and why it matters to you. Let me put question 3 on the board so you can see it. That's all three questions done, so the level check is complete.";
  const base = { levelAdvancedTo: 'topic-intro', currentSegmentId: 'topic-intro', tutorText: T130, alreadyContinued: false };
  assert.equal(levelAdvanceNeedsContinuation(base), true);
  assert.equal(levelAdvanceNeedsContinuation({ ...base, tutorText: 'Thank you. The level check is complete. Now, what do you do every day at work?' }), false);
  assert.equal(levelAdvanceNeedsContinuation({ ...base, tutorText: 'The level check is complete. Tell me in one sentence what you do at work.' }), false);
  assert.equal(levelAdvanceNeedsContinuation({ ...base, levelAdvancedTo: '' }), false, 'no level advance');
  assert.equal(levelAdvanceNeedsContinuation({ ...base, currentSegmentId: 'present-perfect' }), false, 'pointer moved on');
  assert.equal(levelAdvanceNeedsContinuation({ ...base, alreadyContinued: true }), false, 'once per part');
});
test('23C: VTR — the level advance records its target and the turn end schedules the shared continuation', () => {
  pin(VTR, /onDebugEvent\?\.\('fixed_script_level_advance', `"\$\{lvFrom\}" → "\$\{lvNext\}"`\);\s*levelAdvanceThisTurnRef\.current = lvNext;/);
  pin(VTR, /announcedContinuedSegsRef\.current\.add\(lvTarget\);\s*scheduleFixedScriptContinueRef\.current\(lvTarget, 'level'\);/);
  pin(VTR, /levelAdvanceThisTurnRef\.current = '';/);
  // the same cancel rules: the shared timer is cleared by any other dispatch
  pin(VTR, /if \(announcedContinueTimerRef\.current && transcript !== FIXED_SCRIPT_CONTINUE_DIRECTIVE && transcript !== FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE && transcript !== FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE\) \{/);
});
test('23 r2 m5: the level-set continuation has its own directive; the announced one is unchanged', () => {
  assert.equal(FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE, '[System note: the level check is complete and the lesson pointer has moved to the next part; begin that part now from its notes — a one-sentence bridge, then its first question or card. Do not recap the level check.]');
  assert.ok(FIXED_SCRIPT_CONTINUE_DIRECTIVE.startsWith('[System note: you announced the next part'));
});

// Task 24 §B2 (GDI run 12, 352 s): a fixed-script turn that asked nothing continues the current part.
test('24B2: the 355 s statement turn (show_sentence only) → continue; advance / ask / runtime → no', () => {
  const base = { text: 'Let me put the correct sentence on the board and move on.', fixedScript: true, runtimeTriggered: false, toolsSeen: ['show_sentence'] as readonly string[], closing: false, pronunciationArmed: false };
  assert.equal(noAskTurnNeedsContinuation(base), true);
  assert.equal(noAskTurnNeedsContinuation({ ...base, toolsSeen: ['advance_lesson'] }), false, 'advance_lesson');
  for (const t of ['show_segment_card', 'show_problem', 'generate_problem']) assert.equal(noAskTurnNeedsContinuation({ ...base, toolsSeen: [t] }), false, t);
  assert.equal(noAskTurnNeedsContinuation({ ...base, text: 'Good. Could you say that once more?' }), false, 'an ask');
  assert.equal(noAskTurnNeedsContinuation({ ...base, runtimeTriggered: true }), false, 'runtime-triggered');
  assert.equal(noAskTurnNeedsContinuation({ ...base, closing: true }), false, 'closing');
  assert.equal(noAskTurnNeedsContinuation({ ...base, pronunciationArmed: true }), false, 'clip armed');
  assert.equal(noAskTurnNeedsContinuation({ ...base, fixedScript: false }), false, 'not a fixed script');
  assert.equal(FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE, '[System note: your last turn ended without a question or an instruction for the student. Continue now with the next question or item of the current part, in one or two sentences. Do not repeat what you just said; do not recap.]');
});
test('24B2: VTR — the turn end schedules the noask continuation on the shared scheduler; the directive does not cancel it', () => {
  pin(VTR, /if \(noaskSeg\) scheduleFixedScriptContinueRef\.current\(noaskSeg, 'noask'\);/);
  pin(VTR, /via === 'noask' \? 'fixed_script_noask_continue_dropped'/);
  pin(VTR, /via === 'noask' \? 'fixed_script_noask_continue' : 'fixed_script_announced_continue'/);
  pin(VTR, /transcript !== FIXED_SCRIPT_LEVEL_CONTINUE_DIRECTIVE && transcript !== FIXED_SCRIPT_NOASK_CONTINUE_DIRECTIVE\) \{/);
  pin(VTR, /closing: lessonClosedRef\.current \|\| farewellSealedRef\.current \|\| fixedScriptCloseRef\.current != null,/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall announced-move tests passed');
