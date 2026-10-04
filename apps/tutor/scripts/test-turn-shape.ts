// scripts/test-turn-shape.ts
// Run: npx tsx scripts/test-turn-shape.ts
//
// Opener turns that announce the agenda and stop (15-minute trial, student
// left): one sentence, zero tool calls, no question, then 59 s of silence.
import { strict as assert } from 'node:assert';
import {
  assessTurnShape,
  countSentences,
  decideTurnContinuation,
  describeIncompleteTurn,
  resolvePlannedFirstItem,
  continuationAttemptCap,
  appendContinuationText,
  ANNOUNCE_ONLY_MAX_SENTENCES,
  MAX_CONTINUATIONS_PER_SESSION,
} from '../src/lib/tutor/orchestrator/turn-shape';
import {
  resolveOpeningDirectiveMode,
  OPENING_FOLLOWUP_DIRECTIVE,
  OPENING_DIRECTIVE_MAX_BRAIN_TURNS,
} from '../src/lib/tutor/ai/opening-behavior';
import {
  isOpenerFallbackCommand,
  boardHoldsOnlyOpenerFallback,
  boardFallbackOnlyAfterRollback,
  shouldPaintFirstRenderNow,
} from '../src/lib/tutor/whiteboard/fallback-board';
import { buildOpenerFallbackCommand } from '../src/lib/tutor/ai/opener-fallback';

let n = 0;
const ok = (name: string, cond: boolean) => { assert.ok(cond, name); n++; };

// ── the three real turns ───────────────────────────────────────────────────
// Verbatim from the production transcript excerpts ("…" is where the excerpt
// elided the agenda items — the rule is structural, so the elision is moot).
const REAL_OPENER =
  "Alright, let's dive in. We'll tackle two things today — … — starting with the definition first.";
const REAL_SECOND =
  "Loud and clear on my end. Let's get moving. Today we're covering what makes a reaction SN2, and then the backside attack mechanism that drives it — let's start with the definition.";
const REAL_NUDGE =
  "We've got two objectives lined up … Ready to start with the definition?";

{
  const s = assessTurnShape({ text: REAL_OPENER, boardWrites: 0 });
  ok('real opener: incomplete', s.complete === false && s.why === 'announce-only');
  ok('real opener: 2 sentences, no question', s.sentenceCount === 2 && s.hasQuestion === false);
}
{
  const s = assessTurnShape({ text: REAL_SECOND, boardWrites: 0 });
  ok('real second turn: incomplete', s.complete === false && s.why === 'announce-only');
  ok('real second turn: 3 sentences', s.sentenceCount === 3);
}
{
  // Ends with a question ⇒ complete BY THE RULE. (It was an idle nudge that
  // re-recited the agenda; reported, deliberately not chased here.)
  const s = assessTurnShape({ text: REAL_NUDGE, boardWrites: 0 });
  ok('real nudge: complete (question)', s.complete === true && s.why === 'question');
}

// ── structure, not meaning ─────────────────────────────────────────────────
ok('a board write completes the turn',
  assessTurnShape({ text: REAL_OPENER, boardWrites: 1 }).why === 'board-write');
ok('a question anywhere completes the turn',
  assessTurnShape({ text: 'What do you already know about this? Take your time.', boardWrites: 0 }).complete);
{
  // Longer than an announcement and no board: it delivered spoken content —
  // conservative: not this rule's business.
  const long = 'One. Two. Three. Four.';
  const s = assessTurnShape({ text: long, boardWrites: 0 });
  ok('more than the announce-only ceiling is complete', s.complete && s.why === 'substantive-length' && s.sentenceCount === ANNOUNCE_ONLY_MAX_SENTENCES + 1);
}
ok('empty turn is not "incomplete" (a different failure, other guards own it)',
  assessTurnShape({ text: '   ', boardWrites: 0 }).why === 'empty' && assessTurnShape({ text: '', boardWrites: 0 }).complete);

// sentence counting is punctuation-structural
ok('decimals do not split', countSentences('The value is 3.5 metres. Next.') === 2);
ok('ellipsis / stacked marks count once', countSentences('Well... okay!! Go.') === 3);
ok('unterminated tail counts', countSentences('First. and then the rest') === 2);
ok('empty', countSentences('') === 0);

ok('description names the three structural facts',
  /no whiteboard/i.test(describeIncompleteTurn(assessTurnShape({ text: REAL_OPENER, boardWrites: 0 })))
  && /question/i.test(describeIncompleteTurn(assessTurnShape({ text: REAL_OPENER, boardWrites: 0 }))));

// ── continuation decision ──────────────────────────────────────────────────
const incomplete = assessTurnShape({ text: REAL_OPENER, boardWrites: 0 });
const complete = assessTurnShape({ text: REAL_NUDGE, boardWrites: 0 });
const base = {
  enabled: true,
  shape: incomplete,
  isOpeningTurn: true,
  boardHasRealContent: false,
  boardFallbackOnly: false,
  attemptKilled: false,
  otherRejections: 0,
  retryBudgetLeft: true,
  continuationsThisTurn: 0,
  continuationsThisSession: 0,
  studentInputPending: false,
  // A planned lesson, mid-teaching, nothing else going on.
  toolCallsThisAttempt: 0,
  studentHoldArmed: false,
  hasPlannedFirstItem: true,
  inWrapPhase: false,
};
assert.deepEqual(decideTurnContinuation(base), { continue: true, reason: 'opening-turn' }); n++;

// ── the three production turns, under a planned-lesson context ─────────────
// (same classification as before the extra inputs existed)
assert.deepEqual(
  decideTurnContinuation({ ...base, shape: assessTurnShape({ text: REAL_OPENER, boardWrites: 0 }) }),
  { continue: true, reason: 'opening-turn' },
); n++;
assert.deepEqual(
  decideTurnContinuation({ ...base, isOpeningTurn: false, boardFallbackOnly: true, shape: assessTurnShape({ text: REAL_SECOND, boardWrites: 0 }) }),
  { continue: true, reason: 'fallback-board' },
); n++;
assert.deepEqual(
  decideTurnContinuation({ ...base, isOpeningTurn: false, boardFallbackOnly: true, shape: assessTurnShape({ text: REAL_NUDGE, boardWrites: 0 }) }),
  { continue: false, reason: 'turn-complete' },
); n++;

// ── review finding A: what the turn's shape cannot see ─────────────────────
// ANY tool call in the attempt (generate_problem, advance_lesson, a close /
// wrap tool, hold_for_student …) means the turn DID something — "painted
// nothing" is not "did nothing". The motivating incident had zero tools.
assert.deepEqual(decideTurnContinuation({ ...base, toolCallsThisAttempt: 1 }), { continue: false, reason: 'tool-calls' }); n++;
assert.deepEqual(
  decideTurnContinuation({ ...base, isOpeningTurn: false, boardFallbackOnly: true, toolCallsThisAttempt: 3 }),
  { continue: false, reason: 'tool-calls' },
); n++;
// The student asked for a minute; "Sure, take your time." is the whole,
// correct turn. Continuing would talk over them.
{
  const holdAck = assessTurnShape({ text: 'Sure, take your time.', boardWrites: 0 });
  ok('hold acknowledgement is announce-only by shape', holdAck.complete === false);
  assert.deepEqual(
    decideTurnContinuation({ ...base, isOpeningTurn: false, boardFallbackOnly: true, shape: holdAck, studentHoldArmed: true }),
    { continue: false, reason: 'student-hold' },
  ); n++;
  assert.deepEqual(decideTurnContinuation({ ...base, studentHoldArmed: true }), { continue: false, reason: 'student-hold' }); n++;
}
// Homework-help / open conversation / un-expanded picker: there is no
// authored first item to "teach" — inviting the student IS the turn.
{
  const invite = assessTurnShape({ text: "Hi Sam — send me the problem whenever you're ready.", boardWrites: 0 });
  ok('invitation without a question mark is announce-only by shape', invite.complete === false);
  assert.deepEqual(
    decideTurnContinuation({ ...base, shape: invite, hasPlannedFirstItem: false }),
    { continue: false, reason: 'no-planned-item' },
  ); n++;
  assert.deepEqual(
    decideTurnContinuation({ ...base, isOpeningTurn: false, boardFallbackOnly: true, hasPlannedFirstItem: false }),
    { continue: false, reason: 'no-planned-item' },
  ); n++;
}
// Wrapping up / closing: a short sign-off must not be turned into teaching.
assert.deepEqual(decideTurnContinuation({ ...base, inWrapPhase: true }), { continue: false, reason: 'wrap-phase' }); n++;
assert.deepEqual(
  decideTurnContinuation({ ...base, isOpeningTurn: false, boardFallbackOnly: true, inWrapPhase: true }),
  { continue: false, reason: 'wrap-phase' },
); n++;
// Each skip reason is DISTINCT, and none of them outranks the pre-existing
// "nothing to continue" answers.
assert.deepEqual(decideTurnContinuation({ ...base, enabled: false, toolCallsThisAttempt: 1, studentHoldArmed: true }), { continue: false, reason: 'flag-off' }); n++;
assert.deepEqual(decideTurnContinuation({ ...base, shape: complete, studentHoldArmed: true, inWrapPhase: true }), { continue: false, reason: 'turn-complete' }); n++;
// Precedence among the new reasons is fixed (most specific evidence first).
assert.deepEqual(
  decideTurnContinuation({ ...base, toolCallsThisAttempt: 1, studentHoldArmed: true, inWrapPhase: true, hasPlannedFirstItem: false }),
  { continue: false, reason: 'tool-calls' },
); n++;
assert.deepEqual(
  decideTurnContinuation({ ...base, studentHoldArmed: true, inWrapPhase: true, hasPlannedFirstItem: false }),
  { continue: false, reason: 'student-hold' },
); n++;
assert.deepEqual(
  decideTurnContinuation({ ...base, inWrapPhase: true, hasPlannedFirstItem: false }),
  { continue: false, reason: 'wrap-phase' },
); n++;

// ── "is there a planned first item?" — structural, never wording ───────────
const lesson = { planLoaded: true, currentSegmentInPlan: true, pickerPending: false, sessionGoal: 'general', assessment: false };
assert.deepEqual(resolvePlannedFirstItem(lesson), { planned: true, why: 'planned' }); n++;
// every non-homework goal on a loaded plan is a planned lesson
for (const goal of ['practice', 'concept-review', 'test-prep', 'catch-up', 'challenge', 'mock-review']) {
  ok(`goal ${goal} on a plan is planned`, resolvePlannedFirstItem({ ...lesson, sessionGoal: goal }).planned);
}
// free conversation / open-scope with no plan: lessonPlanRef is null
assert.deepEqual(resolvePlannedFirstItem({ ...lesson, planLoaded: false, currentSegmentInPlan: false }), { planned: false, why: 'no-plan' }); n++;
// plan present but the current segment id does not resolve in it
assert.deepEqual(resolvePlannedFirstItem({ ...lesson, currentSegmentInPlan: false }), { planned: false, why: 'no-current-segment' }); n++;
// a freestyle plan still waiting on the lesson picker has nothing to teach yet
assert.deepEqual(resolvePlannedFirstItem({ ...lesson, pickerPending: true }), { planned: false, why: 'picker-pending' }); n++;
// homework-help is student-led even when a plan is attached
assert.deepEqual(resolvePlannedFirstItem({ ...lesson, sessionGoal: 'homework-help' }), { planned: false, why: 'homework-help' }); n++;
// a diagnostic assesses; it does not teach a first item
assert.deepEqual(resolvePlannedFirstItem({ ...lesson, assessment: true }), { planned: false, why: 'assessment' }); n++;

// ── review finding B: the continuation has its own budget ──────────────────
// The validator-retry cap is raised by the continuations granted this turn,
// so the continued content keeps BOTH correction retries.
ok('no continuation ⇒ the cap is the validator cap', continuationAttemptCap({ maxValidatorRetries: 2, continuationsThisTurn: 0 }) === 2);
ok('one continuation ⇒ one extra attempt', continuationAttemptCap({ maxValidatorRetries: 2, continuationsThisTurn: 1 }) === 3);
ok('never more than one extra attempt per turn', continuationAttemptCap({ maxValidatorRetries: 2, continuationsThisTurn: 5 }) === 3);
ok('garbage is clamped', continuationAttemptCap({ maxValidatorRetries: 2, continuationsThisTurn: -1 }) === 2);

// ── review finding E: the delivered opener stays; the continuation appends ─
ok('continuation text is appended to what was delivered',
  appendContinuationText('Alright, let\'s dive in.', 'Here is the definition.') === 'Alright, let\'s dive in. Here is the definition.');
ok('nothing streamed yet ⇒ the delivered text, untouched', appendContinuationText('Alright.', '') === 'Alright.');
ok('whitespace-only stream ⇒ the delivered text, untouched', appendContinuationText('Alright.', '   ') === 'Alright.');
ok('no delivered text ⇒ just the new text', appendContinuationText('', 'Here.') === 'Here.');
// later turn, board still holds only the fallback line
assert.deepEqual(
  decideTurnContinuation({ ...base, isOpeningTurn: false, boardFallbackOnly: true }),
  { continue: true, reason: 'fallback-board' },
); n++;
// later turn on a board with real content ⇒ never
assert.deepEqual(
  decideTurnContinuation({ ...base, isOpeningTurn: false, boardHasRealContent: true }),
  { continue: false, reason: 'not-eligible' },
); n++;
// later turn, blank board that never got a fallback ⇒ not this rule
assert.deepEqual(
  decideTurnContinuation({ ...base, isOpeningTurn: false }),
  { continue: false, reason: 'not-eligible' },
); n++;
// opening turn of a RESUMED session (restored board) ⇒ leave the pickup alone
assert.deepEqual(
  decideTurnContinuation({ ...base, boardHasRealContent: true }),
  { continue: false, reason: 'not-eligible' },
); n++;
assert.deepEqual(decideTurnContinuation({ ...base, shape: complete }), { continue: false, reason: 'turn-complete' }); n++;
assert.deepEqual(decideTurnContinuation({ ...base, enabled: false }), { continue: false, reason: 'flag-off' }); n++;
// bounded to ONE continuation per turn …
assert.deepEqual(decideTurnContinuation({ ...base, continuationsThisTurn: 1 }), { continue: false, reason: 'turn-budget-spent' }); n++;
// … and a small session budget so a brain that never paints cannot loop
assert.deepEqual(
  decideTurnContinuation({ ...base, isOpeningTurn: false, boardFallbackOnly: true, continuationsThisSession: MAX_CONTINUATIONS_PER_SESSION }),
  { continue: false, reason: 'session-budget-spent' },
); n++;
// never stack on a kill / another rejection / an exhausted retry loop
assert.deepEqual(decideTurnContinuation({ ...base, attemptKilled: true }), { continue: false, reason: 'attempt-killed' }); n++;
assert.deepEqual(decideTurnContinuation({ ...base, otherRejections: 1 }), { continue: false, reason: 'other-rejections' }); n++;
assert.deepEqual(decideTurnContinuation({ ...base, retryBudgetLeft: false }), { continue: false, reason: 'no-retry-budget' }); n++;
// the student already has the floor ⇒ answer THEM, do not talk on
assert.deepEqual(decideTurnContinuation({ ...base, studentInputPending: true }), { continue: false, reason: 'student-input-pending' }); n++;

// ── opening directive: full once, then a slim follow-up ────────────────────
assert.equal(resolveOpeningDirectiveMode({ onceEnabled: true, lessonAdvanced: false, brainTurnsCompleted: 0, openerSpoken: false }), 'full'); n++;
// opener attempt failed / was killed before anything was spoken ⇒ full again
assert.equal(resolveOpeningDirectiveMode({ onceEnabled: true, lessonAdvanced: false, brainTurnsCompleted: 1, openerSpoken: false }), 'full'); n++;
// the opener was spoken ⇒ never the full directive again
assert.equal(resolveOpeningDirectiveMode({ onceEnabled: true, lessonAdvanced: false, brainTurnsCompleted: 1, openerSpoken: true }), 'followup'); n++;
assert.equal(resolveOpeningDirectiveMode({ onceEnabled: true, lessonAdvanced: false, brainTurnsCompleted: OPENING_DIRECTIVE_MAX_BRAIN_TURNS - 1, openerSpoken: true }), 'followup'); n++;
// retirement is unchanged: advance or the turn ceiling
assert.equal(resolveOpeningDirectiveMode({ onceEnabled: true, lessonAdvanced: true, brainTurnsCompleted: 1, openerSpoken: true }), 'retire'); n++;
assert.equal(resolveOpeningDirectiveMode({ onceEnabled: true, lessonAdvanced: false, brainTurnsCompleted: OPENING_DIRECTIVE_MAX_BRAIN_TURNS, openerSpoken: true }), 'retire'); n++;
// kill switch off ⇒ the pre-fix behaviour (full directive rides every turn)
assert.equal(resolveOpeningDirectiveMode({ onceEnabled: false, lessonAdvanced: false, brainTurnsCompleted: 2, openerSpoken: true }), 'full'); n++;

ok('follow-up directive forbids re-announcing', /already been spoken/i.test(OPENING_FOLLOWUP_DIRECTIVE) && /agenda/i.test(OPENING_FOLLOWUP_DIRECTIVE));
ok('follow-up directive does not ask for a greeting or an agenda preview',
  !/FIRST, preview/i.test(OPENING_FOLLOWUP_DIRECTIVE) && !/greet them/i.test(OPENING_FOLLOWUP_DIRECTIVE));
ok('follow-up directive is short', OPENING_FOLLOWUP_DIRECTIVE.length < 600);

// ── fallback-only board ────────────────────────────────────────────────────
const fbTopic = buildOpenerFallbackCommand({ topic: 'SN2 reactions' });
const fbBare = buildOpenerFallbackCommand();
ok('recognises the topic fallback', isOpenerFallbackCommand(fbTopic, 'SN2 reactions'));
ok('recognises the no-topic fallback', isOpenerFallbackCommand(fbBare, 'SN2 reactions') && isOpenerFallbackCommand(fbBare));
ok('recognises the topic fallback without knowing the topic', isOpenerFallbackCommand(fbTopic));
ok('another handwrite is not the fallback', !isOpenerFallbackCommand({ action: 'handwrite', text: 'x = 5' }, 'SN2 reactions'));
ok('an equation is not the fallback', !isOpenerFallbackCommand({ action: 'showEquation', latex: 'x=5' }));

ok('board with only the fallback', boardHoldsOnlyOpenerFallback([fbTopic], 'SN2 reactions'));
ok('non-render bookkeeping beside the fallback is ignored', boardHoldsOnlyOpenerFallback([{ action: 'newPage', title: 'Intro' }, fbTopic, { action: 'scrollTo', target: 'top' }], 'SN2 reactions'));
ok('blank board is NOT "fallback only"', !boardHoldsOnlyOpenerFallback([], 'SN2 reactions'));
ok('any real render disqualifies', !boardHoldsOnlyOpenerFallback([fbTopic, { action: 'showEquation', latex: 'x=5' }], 'SN2 reactions'));

// ── review finding C: a rolled-back first render re-arms "fallback only" ───
// Live, the fallback line is painted straight to the canvas and is NOT in the
// orchestrator's command mirror; on resume it is. Both must work.
ok('rollback leaves nothing but the (unmirrored) fallback ⇒ fallback-only again',
  boardFallbackOnlyAfterRollback({ fallbackOnBoard: true, commands: [], topic: 'SN2 reactions' }));
ok('rollback leaves the mirrored (resumed) fallback ⇒ fallback-only again',
  boardFallbackOnlyAfterRollback({ fallbackOnBoard: true, commands: [fbTopic], topic: 'SN2 reactions' }));
ok('bookkeeping left in the mirror does not count as content',
  boardFallbackOnlyAfterRollback({ fallbackOnBoard: true, commands: [{ action: 'newPage', title: 'Intro' }], topic: 'SN2 reactions' }));
ok('a surviving real render keeps it disarmed',
  !boardFallbackOnlyAfterRollback({ fallbackOnBoard: true, commands: [{ action: 'showEquation', latex: 'x=5' }], topic: 'SN2 reactions' }));
ok('no fallback was ever painted ⇒ never "fallback only" (blank board is the opening-turn case)',
  !boardFallbackOnlyAfterRollback({ fallbackOnBoard: false, commands: [], topic: 'SN2 reactions' }));

const paint = { enabled: true, boardFallbackOnly: true, rendersDispatchedThisTurn: 0, hasBoardRender: true, isRepairFrame: false };
ok('first render onto a fallback-only board paints now', shouldPaintFirstRenderNow(paint));
ok('only the FIRST render of the turn', !shouldPaintFirstRenderNow({ ...paint, rendersDispatchedThisTurn: 1 }));
ok('a board with real content keeps full render-sync', !shouldPaintFirstRenderNow({ ...paint, boardFallbackOnly: false }));
ok('meta-only batch never bypasses', !shouldPaintFirstRenderNow({ ...paint, hasBoardRender: false }));
ok('repair frames keep their anchor', !shouldPaintFirstRenderNow({ ...paint, isRepairFrame: true }));
ok('kill switch', !shouldPaintFirstRenderNow({ ...paint, enabled: false }));

console.log(`turn-shape: ${n} cases passed`);
