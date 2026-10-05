// scripts/test-empty-segment-card.ts
// Run: npx tsx scripts/test-empty-segment-card.ts
//
// "Next up: graphing boundary lines properly, with a problem of your own to
// try." → show_segment_card on a hook with script: null → nothing rendered,
// no question, 48 s of silence.
import { strict as assert } from 'node:assert';
import {
  resolveEmptySegmentCard,
  decideEmptyCardContinuation,
  describeEmptySegmentCardTurn,
  buildObjectiveCardCommand,
  isObjectiveCardCommand,
  EMPTY_CARD_BODY_MAX,
} from '../src/lib/tutor/orchestrator/empty-segment-card';
import { MAX_CONTINUATIONS_PER_SESSION, MAX_CONTINUATIONS_PER_TURN } from '../src/lib/tutor/orchestrator/turn-shape';
import { buildValidatorFeedback, TURN_CONTINUATION_ACTION } from '../src/lib/tutor/orchestrator/validator-feedback';

let n = 0;
const ok = (name: string, cond: boolean) => { assert.ok(cond, name); n++; };

// ── (a) what to show ───────────────────────────────────────────────────────
const LO = 'Graph linear inequalities on a coordinate plane using boundary lines and shading';
{
  const c = resolveEmptySegmentCard({ enabled: true, kind: 'hook', goal: 'Motivate boundary lines.', loDescription: LO });
  ok('LO description preferred', c?.source === 'lo-description' && c.body === LO && c.title === 'Objective');
}
ok('segment title next', resolveEmptySegmentCard({ enabled: true, kind: 'hook', title: 'Boundary lines', goal: 'x' })?.source === 'segment-title');
{
  // CHANGED (review item 2): this block pinned a short `goal` ("Get the
  // student to wonder why we shade one side.") as the expected card. A goal
  // is a note TO the tutor at any length — it is no longer a source at all.
  ok('short goal is NOT a card source', resolveEmptySegmentCard({ enabled: true, kind: 'hook', goal: '  Get the student to wonder why\n we shade one side. ' }) === null);
  ok('short stage-direction goal never reaches the board',
    resolveEmptySegmentCard({ enabled: true, kind: 'hook', goal: 'Get the student curious; do NOT reveal the rule yet. Ask what they notice.' }) === null);
  // Verbatim generated-plan intro goal (generate-from-text.ts) — a stage direction.
  const STAGE = 'Acknowledge the material the student supplied: name how many learning objectives you see, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.';
  ok('long tutor-facing goal never reaches the board', resolveEmptySegmentCard({ enabled: true, kind: 'hook', goal: STAGE }) === null);
  const withTitle = resolveEmptySegmentCard({ enabled: true, kind: 'hook', title: 'Boundary lines', goal: STAGE });
  ok('goal present + title ⇒ the title, never the goal', withTitle?.source === 'segment-title' && withTitle.body === 'Boundary lines');
}
ok('nothing presentable ⇒ null', resolveEmptySegmentCard({ enabled: true, kind: 'hook' }) === null
  && resolveEmptySegmentCard({ enabled: true, kind: 'concept', goal: '   ', title: 42 }) === null);
ok('kill switch ⇒ null', resolveEmptySegmentCard({ enabled: false, kind: 'hook', goal: 'x', loDescription: LO }) === null);
{
  const long = `${'word '.repeat(80)}end`;
  const c = resolveEmptySegmentCard({ enabled: true, kind: 'hook', loDescription: long });
  ok('long LO description is clipped on a word boundary', !!c && c.body.length <= EMPTY_CARD_BODY_MAX + 1 && c.body.endsWith('…') && !c.body.includes('wor…'));
}

// ── the fallback is a NON-problem card (review item 2) ─────────────────────
// It was emitted as a plain showProblem, so the generic problem tracker made
// the objective prose the ACTIVE PROBLEM (answer guards, grounding gate) and
// resume rehydrated it as the problem being answered.
{
  const card = resolveEmptySegmentCard({ enabled: true, kind: 'hook', loDescription: LO })!;
  const cmd = buildObjectiveCardCommand(card, card.body);
  ok('objective card still renders through the problem-card renderer', cmd.action === 'showProblem' && cmd.problem.statement === LO && cmd.problem.title === 'Objective');
  ok('objective card command is tagged', isObjectiveCardCommand(cmd) === true);
  ok('tag survives a JSON round trip (session persistence → resume)', isObjectiveCardCommand(JSON.parse(JSON.stringify(cmd))) === true);
  ok('tag survives a spread rebuild', isObjectiveCardCommand({ ...cmd, problem: { ...cmd.problem, statement: 'x' } }) === true);
  ok('an ordinary problem card is not tagged', isObjectiveCardCommand({ action: 'showProblem', problem: { statement: 'Solve 2x = 8', format: 'free-response' } }) === false);
  ok('junk is not tagged', !isObjectiveCardCommand(null) && !isObjectiveCardCommand(undefined) && !isObjectiveCardCommand('x') && !isObjectiveCardCommand({ meta: { objectiveCard: 'yes' } }));
}

// ── (b) continuation ───────────────────────────────────────────────────────
const live = {
  enabled: true, emptyCardRequested: true, turnHasQuestion: false, problemPaintedThisAttempt: false,
  attemptKilled: false, otherRejections: 0, retryBudgetLeft: true,
  continuationsThisTurn: 0, continuationsThisSession: 0,
  studentInputPending: false, studentHoldArmed: false, inWrapPhase: false,
};
const c = (over: Partial<typeof live>) => decideEmptyCardContinuation({ ...live, ...over });
ok('live turn ⇒ continue', c({}).continue === true && c({}).reason === 'empty-segment-card');
ok('no empty card requested ⇒ not this trigger', c({ emptyCardRequested: false }).reason === 'no-empty-card');
ok('turn asked a question ⇒ complete', c({ turnHasQuestion: true }).reason === 'turn-has-question' && !c({ turnHasQuestion: true }).continue);
ok('a problem card went up ⇒ complete', c({ problemPaintedThisAttempt: true }).reason === 'problem-on-board');
ok('killed attempt', c({ attemptKilled: true }).reason === 'attempt-killed');
ok('other rejections own the retry', c({ otherRejections: 1 }).reason === 'other-rejections');
ok('student hold', c({ studentHoldArmed: true }).reason === 'student-hold');
ok('wrap phase', c({ inWrapPhase: true }).reason === 'wrap-phase');
ok('no retry budget', c({ retryBudgetLeft: false }).reason === 'no-retry-budget');
ok('one per turn', c({ continuationsThisTurn: MAX_CONTINUATIONS_PER_TURN }).reason === 'turn-budget-spent');
ok('student input pending', c({ studentInputPending: true }).reason === 'student-input-pending');
ok('two per session (shared counter)', c({ continuationsThisSession: MAX_CONTINUATIONS_PER_SESSION }).reason === 'session-budget-spent'
  && c({ continuationsThisSession: MAX_CONTINUATIONS_PER_SESSION - 1 }).continue === true);
ok('kill switch', c({ enabled: false }).reason === 'flag-off');
ok('caps are the turn-shape caps', MAX_CONTINUATIONS_PER_TURN === 1 && MAX_CONTINUATIONS_PER_SESSION === 2);

// ── feedback text rides the existing continuation message ─────────────────
{
  const reason = describeEmptySegmentCardTurn('lo-2-hook');
  ok('reason names the segment and asks for a concrete question or problem on the board',
    reason.includes('"lo-2-hook"') && /first concrete question or problem/.test(reason) && reason.includes('show_problem'));
  const msg = buildValidatorFeedback({
    rejections: [{ action: TURN_CONTINUATION_ACTION, reason }],
    attemptKilled: false, originalTranscript: 'ok next', includeStudentContext: true,
  });
  ok('uses the continuation wording (delivered in full, continue the same turn)',
    msg.includes('Your last turn stopped too early: you called show_segment_card') && msg.includes('DELIVERED IN FULL') && msg.includes('Continue the SAME turn now'));
  ok('not the tool-rejection wording', !msg.includes('structural validator rejected'));
}

console.log(`empty-segment-card: ${n} cases passed`);
