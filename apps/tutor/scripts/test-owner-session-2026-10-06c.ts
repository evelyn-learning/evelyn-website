/**
 * The owner's three live TEXT sessions of 2026-10-06 on build
 * ulDXTzMvt9QD6bzQavMsL (= 2b58aacf): portal-818996c1 (inequality system),
 * portal-c301c9ad (removable discontinuity, then a physics problem),
 * portal-308e979f (New Deal thesis). Evidence:
 * docs/whitelabel/greenapple/integration/owner-live-session-2026-10-06c/.
 *
 *   1  a readiness question that names the next part; the "right for another
 *      part" instruction never gives that part away
 *   2  a test point checked in the solved form is right
 *   3  "the tutor correctly denies …" plants no note; the working left after
 *      a stripped opener is never dropped as a re-check
 *   4  "next question: <a problem>" is a new problem, not a pace cue
 *   5  text mode paints a repair frame on arrival
 *   6  a hole is an open point
 *   7  the student's homework card is "Problem N"; no title shows LaTeX source
 *   8  an echo of the question's own options is not credited
 *   9  (safety guard) a typed split that alters a relation is not used
 *
 * Every string marked LIVE is a recorded one.
 *
 * Run: npx tsx scripts/test-owner-session-2026-10-06c.ts
 */
import { strict as assert } from 'node:assert';
import { readOpenQuestion, readinessNamedTask } from '../src/lib/tutor/voice/nonanswer-praise';
import { classifyTurnShape, formatTurnShapeBlock } from '../src/lib/tutor/voice/turn-shape-signal';
import {
  buildVerdictPrecheckUser,
  READINESS_TASK_RULE,
  VERDICT_PRECHECK_SYSTEM,
  verdictPrecheckSystem,
} from '../src/lib/tutor/voice/verdict-precheck';
import { formatAnswerCheckBlock, type PublicVerdictPrecheck } from '../src/lib/tutor/voice/verdict-precheck-shared';
import {
  EITHER_FORM_LINE,
  formatInequalityFactsBlock,
  formatInequalityFactsText,
  inequalityFactLines,
  problemInequalityFacts,
} from '../src/lib/tutor/whiteboard/inequality-facts';
import { decideJudgeIssue, judgeReasonSaysStatementCorrect } from '../src/lib/tutor/voice/judge-issue-decision';
import { isBareArithmeticRecheck, shouldDropBareRecheck } from '../src/lib/tutor/voice/arithmetic-recheck';
import { detectBoredomCue, nextIsFollowedByProblem } from '../src/lib/tutor/orchestrator/boredom-cue';
import { shouldPaintOnArrivalInTextMode } from '../src/lib/tutor/whiteboard/render-sync';
import { WHITEBOARD_TOOLS, mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';
import { graphPointFeatures, isOpenGraphPoint } from '../src/lib/tutor/whiteboard/graph-features';
import { homeworkProblemTitle, newPageTitle, problemPageTitle } from '../src/lib/tutor/whiteboard/page-grouping';
import { echoesTutorQuestion, resolveMatchCredit } from '../src/lib/tutor/voice/work-then-match';
import {
  cardMatchesProblem,
  compactMath,
  mathRuns,
  readableMathText,
  ungroundedRelations,
} from '../src/lib/tutor/lesson-plan/problem-text';
import { groundTypedProblems, homeworkProblemsOf, buildHomeworkPlanFields } from '../src/lib/tutor/lesson-plan/homework';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.error(`  ✗ ${name}\n      ${(err as Error).message.split('\n').slice(0, 4).join(' | ')}`); }
}
const pc = (o: Partial<PublicVerdictPrecheck>): PublicVerdictPrecheck => ({
  answers: 'open_question', target: 'the step asked', proposed: 'zzz', verdict: 'correct', confidence: 'high', ...o,
});

// ── 1. limits: the readiness question named the part ────────────────────────
console.log('\nitem 1 — "Ready to move to part (b), finding f(3)?" → "ok that\'d be 3+3=6"');
/** LIVE, portal-c301c9ad @61.4 s and @77.3 s. */
const C301_TUTOR = "The $x-3$ in the numerator cancels with the $x-3$ in the denominator, leaving $f(x) = x+3$. That's exactly what you found. Ready to move to part (b), finding $f(3)$?";
const C301_STUDENT = "ok that'd be 3+3=6";
test('LIVE: the open question is the readiness question, and it names part (b)', () => {
  const open = readOpenQuestion(C301_TUTOR)!;
  assert.equal(open.question, 'Ready to move to part (b), finding $f(3)$?');
  assert.equal(open.kind, 'readiness');
  assert.equal(open.namedTask, 'part (b), finding $f(3)$');
  assert.equal(readOpenQuestion(C301_TUTOR, { namedTask: false })!.namedTask, undefined, 'switch off: as on the live build');
});
test('only a SPECIFIC part counts — a label with its identifier, or a task verb with its object', () => {
  for (const [q, want] of [
    ['Ready for part (c)?', 'part (c)'],
    ['Ready to move on to Problem 2?', 'Problem 2'],
    ['Shall we move on to finding the limit?', 'finding the limit'],
    ['Want to try solving for $y$ next?', 'solving for $y$ next'],
    ['Ready to find the vertex?', 'find the vertex'],
    ['Ready for the next one?', null],
    ['Ready?', null],
    ['Does that make sense?', null],
    ['Ready to move on, or do you want to stop here?', null],
  ] as Array<[string, string | null]>) {
    assert.equal(readinessNamedTask(q), want, q);
  }
});
test('LIVE: the turn-shape facts say the readiness question introduced part (b), and the value is an attempt at it', () => {
  const ts = classifyTurnShape(C301_STUDENT, C301_TUTOR)!;
  assert.equal(ts.answerShaped, true);
  for (const wtm of [true, false]) {
    const block = formatTurnShapeBlock(ts, C301_STUDENT, wtm ? { workThenMatch: true } : undefined);
    assert.match(block, /a readiness question that introduces the next part/);
    assert.match(block, /The part it introduces: "part \(b\), finding \$f\(3\)\$"/);
    assert.match(block, /the value they gave is their answer to THAT part, so judge it against that part/);
    assert.match(block, /Never state or write the answer to that part yourself, and never write their value as that part's result/);
    assert.match(block, /ask a guiding question/);
  }
  // A bare "ok" is consent, as before: no part-answer rule.
  const ok = formatTurnShapeBlock(classifyTurnShape('ok', C301_TUTOR), 'ok');
  assert.ok(!/introduces the next part/.test(ok));
});
test('LIVE: the pre-check is told which part the readiness question opened', () => {
  const user = buildVerdictPrecheckUser({ history: [], openQuestion: 'Ready to move to part (b), finding $f(3)$?', studentMessage: C301_STUDENT });
  assert.match(user, /<open_question>\nReady to move to part \(b\), finding \$f\(3\)\$\?\n\(This readiness question introduces the next part: "part \(b\), finding \$f\(3\)\$"\. A value or working the student offers now answers that part\.\)\n<\/open_question>/);
  const off = buildVerdictPrecheckUser({ history: [], openQuestion: 'Ready to move to part (b), finding $f(3)$?', studentMessage: C301_STUDENT, readinessTask: false });
  assert.match(off, /<open_question>\nReady to move to part \(b\), finding \$f\(3\)\$\?\n<\/open_question>/);
  const plain = buildVerdictPrecheckUser({ history: [], openQuestion: 'What do you get?', studentMessage: '6' });
  assert.ok(!/introduces the next part/.test(plain));
});
test('the pre-check prompt: one sentence after the open_question definition; both switches off ⇒ the 2026-10-06 prompt', () => {
  const sys = verdictPrecheckSystem({ ambiguousReadingRule: false });
  assert.ok(sys.includes('including when that question itself asks for the final answer).' + READINESS_TASK_RULE + '\n   "overall_problem"'));
  assert.equal(verdictPrecheckSystem({ ambiguousReadingRule: false, readinessTaskRule: false }), VERDICT_PRECHECK_SYSTEM);
  assert.match(verdictPrecheckSystem(), /AMBIGUOUS WRITING OR SPEECH/);
  assert.ok(!/\d/.test(READINESS_TASK_RULE), 'generic: no example values');
});
test('LIVE: the "right for another part" block no longer says "state both as facts"; it forbids the give-away', () => {
  // The recorded check: answers=other_part verdict=correct confidence=medium proposed="6".
  const p = pc({ answers: 'other_part', verdict: 'correct', confidence: 'medium', proposed: '6', target: 'the limit as x approaches 3' });
  for (const wtm of [true, false]) {
    const b = formatAnswerCheckBlock(p, { correctValue: '6', ...(wtm ? { workThenMatch: true } : {}) });
    assert.ok(!/State both as facts/.test(b), 'the instruction that produced the false board equation is gone');
    assert.match(b, /it is right for THAT|the right value for THAT/);
    assert.match(b, /If they offered it for the part you had just introduced or are working on, that part is the one to judge it against/);
    assert.match(b, /Never state or write the answer to the part the student is working on/);
    assert.match(b, /never write their value as that part's result — no equation, board line or sentence/);
    assert.match(b, /Ask one guiding question/);
  }
  const old = formatAnswerCheckBlock(p, { correctValue: '6', workThenMatch: true, otherPartNoGiveaway: false });
  assert.match(old, /State both as facts, briefly/, 'switch off: the wording of 2b58aacf');
});

// ── 2. a test point checked in the solved form ─────────────────────────────
console.log('\nitem 2 — "0<-2/3 false" for x−3y>2 at (0,0) is right');
const SYSTEM = 'Solve the system by graphing: $2x + y < 4$ and $x - 3y > 2$';
test('LIVE: the outside point carries the solved-form evaluation beside the source form', () => {
  const facts = problemInequalityFacts(SYSTEM)!;
  const lines = inequalityFactLines(facts);
  assert.ok(lines.includes('(0, 0) is NOT a solution: 2x + y < 4 gives 0 < 4, true (same as y < -2x + 4: 0 < 4, true); x - 3y > 2 gives 0 > 2, false (same as y < (1/3)x - 2/3: 0 < -2/3, false).'), lines.join('\n'));
  assert.ok(lines.includes('(0, -1) IS a solution: 2x + y < 4 gives -1 < 4, true (same as y < -2x + 4: -1 < 4, true); x - 3y > 2 gives 3 > 2, true (same as y < (1/3)x - 2/3: -1 < -2/3, true).'));
  assert.equal(lines[lines.length - 1], EITHER_FORM_LINE);
  assert.match(EITHER_FORM_LINE, /a check done in either form is equally right/);
  assert.ok(formatInequalityFactsBlock(facts).includes(EITHER_FORM_LINE));
  assert.ok(formatInequalityFactsText(facts).includes('0 < -2/3, false'), 'the pre-check and judge read it too');
});
test('switch off ⇒ the lines of 2b58aacf; an inequality already solved for y gets no "same as"', () => {
  const facts = problemInequalityFacts(SYSTEM)!;
  const off = inequalityFactLines(facts, { bothForms: false });
  assert.ok(off.includes('(0, 0) is NOT a solution: 2x + y < 4 gives 0 < 4, true; x - 3y > 2 gives 0 > 2, false.'));
  assert.ok(!off.includes(EITHER_FORM_LINE));
  const solved = inequalityFactLines(problemInequalityFacts('Graph $y < 2x + 1$ and $y > -x$')!);
  assert.ok(!solved.some((l) => l.includes('same as')));
  assert.ok(!solved.includes(EITHER_FORM_LINE), 'nothing to say when no form differs');
  const vertical = inequalityFactLines(problemInequalityFacts('Graph $2x > 6$ and $y < x$')!);
  assert.ok(vertical.some((l) => /2x > 6 gives 0 > 6, false \(same as x > 3: 0 > 3, false\)/.test(l)), vertical.join('\n'));
});

// ── 3. the judge's "correctly denies", and the working after a stripped opener
console.log('\nitem 3 — a correct answer with nothing shown about it');
/** LIVE, portal-c301c9ad @38.2 s (the judge's reason, as logged). */
const JUDGE_WHY = "The tutor correctly denies the student's answer. The student proposed $(x-3)^2$, which expands to $x^2 - 6x + 9$, not $x";
const JUDGE_CLAIM = '$x^2-9$ is a difference of squares, not a perfect square.';
test('LIVE: the judge\'s reason says the tutor was right ⇒ no note', () => {
  assert.equal(judgeReasonSaysStatementCorrect(JUDGE_WHY), true);
  assert.equal(judgeReasonSaysStatementCorrect(JUDGE_WHY, { correctlyFamily: false }), false, 'the live build planted a note');
  const d = decideJudgeIssue({ enabled: true, severity: 'advisory', issue: { claim: JUDGE_CLAIM, studentAnswerVerdict: 'incorrect', issueKind: 'other', why: JUDGE_WHY } });
  assert.equal(d.plantNote, false);
  assert.equal(d.reason, 'statement-judged-correct');
});
test('the family, and what it does not cover', () => {
  for (const why of [
    'The tutor correctly rejects the answer.',
    'Tutor correctly identifies the error in the second step.',
    'The tutor is correctly pointing out that the sign flips.',
    'The tutor correctly states the rule.',
    'The tutor correctly explains why the value is excluded.',
    'The tutor correctly corrects the student.',
  ]) assert.equal(judgeReasonSaysStatementCorrect(why), true, why);
  for (const why of [
    'The tutor correctly denies the answer, but then states a wrong value.',
    'The tutor incorrectly denies the answer.',
    'The tutor denies a correct answer.',
  ]) assert.equal(judgeReasonSaysStatementCorrect(why), false, why);
});
/** LIVE, portal-c301c9ad @47.5 s: "Exactly. $x^2-9=(x+3)(x-3)$." — the opener
 *  was cut and the remainder dropped as a bare re-check. */
const REMAINDER = '$x^2-9=(x+3)(x-3)$.';
test('LIVE: the remainder after a stripped opener is kept on a note-carrying turn', () => {
  assert.equal(isBareArithmeticRecheck(REMAINDER), true, 'it IS shaped like a bare re-check');
  const base = { sentence: REMAINDER, isFirstSentenceOfTurn: true, correctionNoteThisTurn: true, restoredFrame: false };
  assert.equal(shouldDropBareRecheck({ ...base, openerStripped: true }), false);
  assert.equal(shouldDropBareRecheck({ ...base, openerStripped: true, keepAfterOpenerStrip: false }), true, 'the live build dropped it');
  // Unchanged elsewhere: no opener stripped ⇒ the 2026-09-05 backstop still runs.
  assert.equal(shouldDropBareRecheck({ ...base, openerStripped: false }), true);
  assert.equal(shouldDropBareRecheck({ ...base, openerStripped: false, correctionNoteThisTurn: false }), false);
  assert.equal(shouldDropBareRecheck({ ...base, openerStripped: false, isFirstSentenceOfTurn: false }), false);
  assert.equal(shouldDropBareRecheck({ ...base, openerStripped: false, restoredFrame: true }), false);
});

// ── 4. "next question: <a problem>" ────────────────────────────────────────
console.log('\nitem 4 — a new problem is not a pace cue');
/** LIVE, portal-c301c9ad @222.5 s. */
const NEXT_LIVE = 'next question: A car accelerates from rest at 2.5 m/s² for 8 seconds. How far does it travel, and what is its final speed?';
test('LIVE: no cue', () => {
  assert.deepEqual(detectBoredomCue(NEXT_LIVE, { requestShape: true }), { cue: null, ignored: ['next'] });
  assert.equal(detectBoredomCue(NEXT_LIVE, { requestShape: true, newProblemContent: false }).cue, 'next', 'the live build raised it');
});
test('a request for the next one is still a cue; problem content is not', () => {
  for (const t of ['next question', 'next one please', 'next problem!', 'Next.', 'okay next one', 'can we do the next question']) {
    assert.equal(detectBoredomCue(t, { requestShape: true }).cue?.toLowerCase(), 'next', t);
  }
  for (const t of ['next problem: solve 2x + 3 = 7', 'Next question is 5 + 7', 'next one: find the area of a circle whose radius is given in the figure', 'next question - x^2 = 9']) {
    assert.equal(detectBoredomCue(t, { requestShape: true }).cue, null, t);
  }
  assert.equal(nextIsFollowedByProblem(' question: why'), false, 'a short phrase is not a problem');
});

// ── 5. text mode paints a repair frame on arrival ──────────────────────────
console.log('\nitem 5 — repair frames in text mode');
test('a repair frame paints on arrival; order is kept; voice and the switch are unchanged', () => {
  const base = { enabled: true, isTextMode: true, bufferDepth: 0, hasSketchRequest: false, isRepairFrame: true };
  assert.equal(shouldPaintOnArrivalInTextMode(base), true);
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, paintRepairFrames: false }), false, 'the live build waited 6 s');
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, bufferDepth: 1 }), false, 'never overtakes a waiting render');
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, isTextMode: false }), false);
  assert.equal(shouldPaintOnArrivalInTextMode({ ...base, hasSketchRequest: true }), false);
});

// ── 6. a hole is an open point ─────────────────────────────────────────────
console.log('\nitem 6 — open points');
test('the tool schema offers `open`, says to use it for holes, and the command keeps it', () => {
  const def = WHITEBOARD_TOOLS.find((d) => d.name === 'show_function_graph')!;
  const points = (def.parameters as { properties: Record<string, { description?: string; items?: { properties?: Record<string, { type?: string; description?: string }> } }> }).properties.points;
  assert.equal(points.items?.properties?.open?.type, 'boolean');
  assert.match(points.description ?? '', /open points \(`open: true`\) for holes and excluded endpoints/);
  assert.match(points.items?.properties?.open?.description ?? '', /a hole in the graph/);
  // LIVE graph, portal-c301c9ad @160.5 s, with the hole marked open.
  const cmd = mapFunctionCallToCommand('show_function_graph', {
    title: 'Graph of $f(x)=\\frac{x^2-9}{x-3}$', xRange: [-2, 8], yRange: [-2, 10],
    functions: [{ expr: 'x+3', label: 'f(x) = x+3 (with hole at x=3)' }],
    points: [{ x: 3, y: 6, label: 'hole (undefined)', color: 'red', open: true }],
  }) as { data: { points: unknown[] } };
  assert.equal(isOpenGraphPoint(cmd.data.points[0]), true);
});
test('the renderer reads it; the board description says so; off ⇒ filled', () => {
  assert.equal(isOpenGraphPoint({ x: 3, y: 6, open: true }), true);
  assert.equal(isOpenGraphPoint({ x: 3, y: 6 }), false);
  assert.equal(isOpenGraphPoint({ x: 3, y: 6, open: true }, { enabled: false }), false);
  const [f] = graphPointFeatures([{ x: 3, y: 6, label: 'hole', open: true }]);
  assert.equal(f.description, 'open (hollow) point "hole" at (3, 6)');
  assert.equal(graphPointFeatures([{ x: 3, y: 6, label: 'hole' }])[0].description, 'point "hole" at (3, 6)');
});

// ── 7. page titles ─────────────────────────────────────────────────────────
console.log('\nitem 7 — the student\'s homework card is "Problem N"; no LaTeX source in a title');
/** LIVE card, portal-c301c9ad @5.0 s; the brain's own page title was its
 *  statement without the $ delimiters. */
const CARD_C301 = { action: 'showProblem', problem: { statement: 'Simplify $f(x) = \\dfrac{x^2 - 9}{x - 3}$', format: 'short-answer' } };
const BRAIN_TITLE_C301 = 'Simplify f(x) = \\dfrac{x^2 - 9}{x - 3}';
/** The problem as typed (the owner's description: simplify, f(3), limit). */
const HW_C301 = 'f(x) = (x²−9)/(x−3). (a) Simplify f(x). (b) Find f(3). (c) Find the limit as x→3.';
test('LIVE: the card of the student\'s problem is "Problem 1 of 3" — not only on a 24-character prefix match', () => {
  const hw = { n: 1, total: 3, text: HW_C301 };
  assert.equal(problemPageTitle(CARD_C301, hw), 'Problem 1 of 3');
  assert.notEqual(problemPageTitle(CARD_C301, hw, { homeworkCardTitle: false }), 'Problem 1 of 3', 'the live rule missed it');
  assert.equal(homeworkProblemTitle(CARD_C301, hw), 'Problem 1 of 3');
  assert.equal(cardMatchesProblem(CARD_C301.problem.statement, HW_C301), true);
});
test('LIVE: the page it opens is "Problem 1 of 3" whatever the brain titled it', () => {
  const hw = { n: 1, total: 3, text: HW_C301 };
  assert.equal(newPageTitle({ brainHint: BRAIN_TITLE_C301, decisionTitle: 'Next', firstTeaching: CARD_C301, homework: hw }), 'Problem 1 of 3');
  assert.equal(newPageTitle({ brainHint: BRAIN_TITLE_C301, decisionTitle: 'Next', firstTeaching: CARD_C301, homework: hw, enabled: false }), BRAIN_TITLE_C301, 'the live build');
  // Outside homework, the brain's title is kept but made readable.
  assert.equal(newPageTitle({ brainHint: BRAIN_TITLE_C301, decisionTitle: 'Next', firstTeaching: CARD_C301 }), 'Simplify f(x) = (x^2 − 9)/(x − 3)');
  assert.equal(newPageTitle({ brainHint: 'Graph of $f(x)=\\frac{x^2-9}{x-3}$', decisionTitle: 'Next' }), 'Graph of f(x)=(x^2-9)/(x-3)');
  assert.equal(newPageTitle({ brainHint: 'Solve the system by graphing', decisionTitle: 'Next' }), 'Solve the system by graphing');
  assert.equal(newPageTitle({ decisionTitle: 'Next' }), 'Next');
});
test('the fallback title strips LaTeX source', () => {
  assert.equal(problemPageTitle(CARD_C301), 'Simplify f(x) = (x^2 − 9)/(x − 3)');
  assert.equal(problemPageTitle(CARD_C301, undefined, { homeworkCardTitle: false }), 'Simplify f(x) = \\dfrac{x^2 - 9}{x - 3}', 'the live build');
  assert.equal(readableMathText('$\\displaystyle\\lim_{x\\to 3} \\dfrac{x^2-9}{x-3}$'), 'lim(x→ 3) (x^2-9)/(x-3)');
  for (const t of [problemPageTitle(CARD_C301)!, problemPageTitle({ action: 'showProblem', problem: { statement: 'Find $\\displaystyle\\lim_{x\\to 3} f(x)$ for $f(x) = \\dfrac{x^2-9}{x-3}$' } })!]) {
    assert.ok(!/\\[a-z]/i.test(t), t);
  }
});
test('a side example mid-homework is still not "Problem N"; another session\'s cards are unchanged', () => {
  const hw = { n: 1, total: 3, text: HW_C301 };
  const side = { action: 'showProblem', problem: { statement: 'Try this one: simplify $\\dfrac{x^2 - 16}{x - 4}$' } };
  assert.equal(homeworkProblemTitle(side, hw), null);
  assert.notEqual(problemPageTitle(side, hw), 'Problem 1 of 3');
  // LIVE, portal-308e979f: a card with no maths, matched on its words.
  const essay = { action: 'showProblem', problem: { statement: "Write a thesis statement for: 'To what extent was the New Deal a success?'" } };
  assert.equal(problemPageTitle(essay, { n: 1, total: 1, text: "Write a thesis statement for: 'To what extent was the New Deal a success?' I need help structuring it." }), 'Problem 1');
});

// ── 8. an echo is not an answer ────────────────────────────────────────────
console.log('\nitem 8 — "name one of those two" → an echo');
/** LIVE, portal-308e979f @332.0 s and @357.1 s. */
const T308 = 'Congress blocked some New Deal spending later on, but it was the Supreme Court that struck down major programs — the NIRA and AAA — as unconstitutional in the mid-1930s. Can you name one of those two programs the Court struck down?';
const S308 = 'The Agricultural Adjustment Act';
test('LIVE: the answer repeats what the question named ⇒ no credit', () => {
  assert.equal(echoesTutorQuestion(S308, T308), true);
  assert.equal(echoesTutorQuestion('AAA', T308), true);
  assert.equal(echoesTutorQuestion('the NIRA', T308), true);
  // The recorded check: open_question / correct / high → counted correct live.
  const check = pc({ verdict: 'correct', proposed: S308 });
  assert.deepEqual(resolveMatchCredit({ precheck: check, match: 'none', echo: { studentText: S308, priorTutorTurn: T308 } }), { credit: 'none', source: 'echo', disagreement: false });
  assert.equal(resolveMatchCredit({ precheck: check, match: 'none', echo: { studentText: S308, priorTutorTurn: T308 }, echoNoCredit: false }).credit, 'correct', 'the live build');
  assert.equal(resolveMatchCredit({ precheck: check, match: 'none' }).credit, 'correct', 'no echo input ⇒ as before');
});
test('an answer the question did not hand over is credited as before', () => {
  const check = pc({ verdict: 'correct' });
  // LIVE, portal-c301c9ad @113.9 s → @119.9 s.
  const tq = 'Since the limit only cares about values *near* $x=3$, not at it, what value does the simplified form $x+3$ approach as $x$ gets close to 3?';
  assert.equal(echoesTutorQuestion('3+3=6', tq), false);
  assert.equal(resolveMatchCredit({ precheck: check, match: 'matches', echo: { studentText: '3+3=6', priorTutorTurn: tq } }).credit, 'correct');
  // A back-reference reaches only the one sentence before the question.
  assert.equal(echoesTutorQuestion('Glass-Steagall', 'We covered the FDIC and Glass-Steagall last week. Unemployment stayed high. Which of these programs was struck down?'), false);
  assert.equal(echoesTutorQuestion('yes', 'Is it the NIRA, yes?'), false, 'a bare yes is not an echo');
  assert.equal(echoesTutorQuestion('x+3 and x-3', 'What two factors multiply to give $x^2-3^2$?'), false);
  // A verified key is never overridden.
  assert.equal(resolveMatchCredit({ objectiveCorrect: true, precheck: check, match: 'none', echo: { studentText: S308, priorTutorTurn: T308 } }).credit, 'correct');
});

// ── 9. the student's own text ──────────────────────────────────────────────
console.log('\nitem 9 — the problem text is the student\'s, verbatim');
/** The owner confirmed he typed the card's text himself by mistake
 *  (portal-818996c1 @4.6 s) — nothing rewrote it. These cases keep the
 *  splitter held to the typed text anyway (a safety guard): the card's text
 *  stands in for a rewrite, the corrected system for what was typed. */
const TYPED_818 = 'Solve the system by graphing: 2x + y < 4 and x − 3y > 2';
const CARD_818 = 'Solve the system by graphing: $y < -2x + 4$ and $2x + y < 4$';
test('the comparison form sees through typesetting, not through a rewrite', () => {
  assert.equal(compactMath('f(x) = (x²−9)/(x−3)'), compactMath('$f(x) = \\dfrac{x^2 - 9}{x - 3}$'));
  assert.deepEqual(mathRuns(CARD_818), ['y < -2x + 4', '2x + y < 4']);
  assert.deepEqual(ungroundedRelations(CARD_818, TYPED_818), ['y < -2x + 4']);
  assert.deepEqual(ungroundedRelations('Solve the system by graphing: $2x + y < 4$ and $x - 3y > 2$', TYPED_818), []);
  assert.deepEqual(ungroundedRelations(CARD_C301.problem.statement, HW_C301), []);
  assert.deepEqual(ungroundedRelations('Find $\\displaystyle\\lim_{x\\to 3} f(x)$ for $f(x) = \\dfrac{x^2-9}{x-3}$', HW_C301), [], 'a part card that typesets the problem is grounded');
});
test('server: a typed split that rewrote a relation is replaced by the typed text verbatim; the rewrite is kept apart', () => {
  const split = [{ n: 1, text: 'Solve the system by graphing: y < -2x + 4 and 2x + y < 4' }];
  const g = groundTypedProblems(split, `  ${TYPED_818}\n`);
  assert.deepEqual(g.altered, ['y < -2x + 4']);
  assert.deepEqual(g.problems, [{ n: 1, text: TYPED_818, rewritten: '1. Solve the system by graphing: y < -2x + 4 and 2x + y < 4' }]);
  // The rewrite never leaves the server: the plan's problems as read back carry the student's text only.
  const fields = buildHomeworkPlanFields(g.problems, 'Systems', 'gen-test');
  assert.deepEqual(homeworkProblemsOf({ metadata: fields.metadata as unknown as Record<string, unknown> }), [{ n: 1, text: TYPED_818 }]);
  // A faithful split (maths retypeset, parts separated) is untouched.
  const faithful = [{ n: 1, text: 'f(x) = (x^2-9)/(x-3). Simplify f(x).' }, { n: 2, text: 'f(x) = (x^2-9)/(x-3). Find f(3).' }];
  assert.equal(groundTypedProblems(faithful, HW_C301).problems, faithful);
  assert.equal(groundTypedProblems(split, TYPED_818, { enabled: false }).problems, split, 'switch off ⇒ as returned');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
