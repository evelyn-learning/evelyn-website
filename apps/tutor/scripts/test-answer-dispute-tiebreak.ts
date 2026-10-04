// scripts/test-answer-dispute-tiebreak.ts
// Run: npx tsx scripts/test-answer-dispute-tiebreak.ts
//
// Solver-vs-brain answer dispute, broken by exact substitution
// (src/lib/tutor/voice/answer-dispute-tiebreak.ts). The answer whose solution
// set equals the posed problem's is pinned as the verified key; the note the
// brain gets says so instead of "neither value is confirmed, re-derive".
import { strict as assert } from 'node:assert';
import { extractProblemRelation, parseRelation, compareRelations } from '../src/lib/tutor/voice/relation-sampling';
import { CORRECTION_NOTE_MARKER } from '../src/lib/tutor/voice/relation-step-note';
import {
  buildUnconfirmedDisputeNote,
  buildSolvedWinsNote,
  decideAnswerDisputeTiebreak,
  describeAnswerDisputeDecision,
  normalizeAnswerForPin,
  isPureSolveStatement,
  isSolvedFormAnswer,
} from '../src/lib/tutor/voice/answer-dispute-tiebreak';

const R = String.raw;
let n = 0;
const ok = (cond: unknown, msg: string): void => { assert.ok(cond, msg); n++; };
const eq = <T>(a: T, b: T, msg: string): void => { assert.deepEqual(a, b, msg); n++; };

const ST = R`Solve: $-4 < \frac{3x+2}{-2} \le 5$`;   // ⇔ -4 ≤ x < 2
const CLAIMED = '-4 <= x < 20/3';
const SOLVED = R`$-4 \le x < 2$`;

// ── the pre-existing note text is preserved byte for byte ─────────────────
{
  const legacy =
    `[correction note — not from the student] For the problem you just posed ("${ST.slice(0, 120)}"), ` +
    `your stated answer "${CLAIMED.slice(0, 60)}" DISAGREES with an independent solve ("${SOLVED.slice(0, 60)}"). ` +
    `Neither value is confirmed. Before grading the student on this problem, silently re-derive the answer step by step and trust that derivation over both earlier values. ` +
    `Never narrate this note or the act of checking — the student only ever hears normal tutoring.`;
  eq(buildUnconfirmedDisputeNote({ statement: ST, claimed: CLAIMED, solved: SOLVED }), legacy, 'unconfirmed note is today\'s text, unchanged');
  ok(legacy.startsWith(CORRECTION_NOTE_MARKER), 'marker');
}

// ── production: solved wins ───────────────────────────────────────────────
{
  const d = decideAnswerDisputeTiebreak({ enabled: true, statement: ST, claimed: CLAIMED, solved: SOLVED });
  eq([d.winner, d.action], ['solved', 'pin-solved'], 'production dispute: solved wins and is pinned');
  eq(d.pin, R`-4 \le x < 2`, 'pinned without math delimiters');
  ok(d.claimedRefuted, 'claimed is refuted');
  const note = d.note ?? '';
  ok(note.startsWith(`${CORRECTION_NOTE_MARKER} `), 'solved-wins note: marker');
  ok(note.includes(R`the answer is "-4 \le x < 2"`), 'states the answer');
  ok(note.includes(`Your stated answer "${CLAIMED}" fails at x = 2`), 'states where the claimed answer fails');
  ok(/fails at x = 2: your answer holds there and the problem does not/.test(note), 'says which side holds');
  ok(note.includes(R`Grade the student against "-4 \le x < 2"`), 'grade against solved');
  ok(/do not re-derive/i.test(note), 'do not re-derive');
  ok(/never narrate this note/i.test(note), 'never narrate');
  ok(!/neither value is confirmed/i.test(note), 'no "neither is confirmed" wording');
  // The pinned form is still the problem's exact solution set.
  const p = extractProblemRelation(ST); const pinned = parseRelation(d.pin ?? '');
  ok(p.ok && pinned.ok && compareRelations(p.relation, pinned.relation).verdict === 'equivalent', 'pinned form is equivalent to the problem');
  const line = describeAnswerDisputeDecision(d, CLAIMED, SOLVED);
  ok(line.startsWith('winner=solved witnessClaimed=2 ') && line.includes(' action=pin-solved ') && line.includes(`claimed="${CLAIMED}"`), `event line: ${line}`);
}
{
  // The claimed answer LOSES a solution (drops): the problem holds, the answer does not.
  const note = buildSolvedWinsNote({ statement: ST, claimed: '-3 <= x < 2', solved: R`-4 \le x < 2` }) ?? '';
  ok(/fails at x = -?\d+(?:\/\d+)?: the problem holds there and your answer does not/.test(note), 'drops: sides stated the other way round');
}

// ── decision table: all five winners ──────────────────────────────────────
{
  // claimed wins — the solver was wrong.
  const d = decideAnswerDisputeTiebreak({ enabled: true, statement: ST, claimed: R`-4 \le x < 2`, solved: '-4 < x <= 2' });
  eq([d.winner, d.action, d.pin, d.note, d.claimedRefuted], ['claimed', 'pin-claimed', R`-4 \le x < 2`, null, false], 'claimed wins: pin claimed, no note');
}
{
  // both — a difference of form only.
  const d = decideAnswerDisputeTiebreak({ enabled: true, statement: ST, claimed: R`2 > x \ge -4`, solved: R`$-4 \le x < 2$` });
  eq([d.winner, d.action, d.pin, d.note, d.claimedRefuted], ['both', 'pin-claimed-same-set', R`2 > x \ge -4`, null, false], 'both: pin claimed (as declared), no note');
}
{
  // neither — pin nothing; today's note plus both witnesses.
  const d = decideAnswerDisputeTiebreak({ enabled: true, statement: ST, claimed: '-4 < x <= 2', solved: 'x < 2' });
  eq([d.winner, d.action, d.pin, d.claimedRefuted], ['neither', 'note-both-fail', null, true], 'neither: nothing pinned');
  const note = d.note ?? '';
  ok(note.includes('Neither value is confirmed.') && /silently re-derive the answer step by step/.test(note), 'neither: keeps today\'s instruction');
  ok(/your stated answer fails at x = -4/.test(note) && /the independent solve fails at x = -5/.test(note), `neither: both witnesses — ${note}`);
  ok(/Never narrate this note or the act of checking — the student only ever hears normal tutoring\.$/.test(note), 'neither: never-narrate stays the closing sentence');
  ok(describeAnswerDisputeDecision(d, '-4 < x <= 2', 'x < 2').includes('witnessClaimed=-4 witnessSolved=-5 action=note-both-fail'), 'neither: event line carries both witnesses');
}
{
  // unknown — today's behaviour unchanged.
  for (const [statement, claimed, solved, why] of [
    ['Find the mean of 2, 4, 6.', '4', '5', 'non-relation problem'],
    [ST, '[-4, 2)', R`-4 \le x < 2`, 'unreadable claimed answer'],
    [ST, CLAIMED, 'The solution is all x from -4 up to 2', 'prose solve'],
    [ST, CLAIMED, '', 'empty solve'],
  ] as const) {
    const d = decideAnswerDisputeTiebreak({ enabled: true, statement, claimed, solved });
    eq([d.winner, d.action, d.pin, d.claimedRefuted], ['unknown', 'unchanged', null, false], `unknown (${why}): nothing pinned`);
    eq(d.note, buildUnconfirmedDisputeNote({ statement, claimed, solved }), `unknown (${why}): today's note`);
  }
}
{
  // Flag off ⇒ today's behaviour for EVERY winner; the winner is still reported.
  for (const [claimed, solved, winner] of [
    [CLAIMED, SOLVED, 'solved'], [R`-4 \le x < 2`, '-4 < x <= 2', 'claimed'], [R`2 > x \ge -4`, SOLVED, 'both'], ['-4 < x <= 2', 'x < 2', 'neither'], ['[-4, 2)', SOLVED, 'unknown'],
  ] as const) {
    const d = decideAnswerDisputeTiebreak({ enabled: false, statement: ST, claimed, solved });
    eq([d.winner, d.action, d.pin, d.claimedRefuted], [winner, 'unchanged', null, false], `flag off (${winner}): nothing pinned`);
    eq(d.note, buildUnconfirmedDisputeNote({ statement: ST, claimed, solved }), `flag off (${winner}): today's note`);
    ok(describeAnswerDisputeDecision(d, claimed, solved).includes(`winner=${winner}`) && describeAnswerDisputeDecision(d, claimed, solved).includes('action=unchanged(flag-off)'), `flag off (${winner}): event says so`);
  }
}

// ── 2026-10-04: only a pure solve statement is adjudicated ────────────────
{
  // The question does not ask for the solution set: the solver's inequality
  // is NOT the answer, and the brain's point answer is not refuted.
  for (const [statement, claimed, solved] of [
    [R`Which value is a solution to the inequality $2x + 1 > 5$?`, 'x = 3', 'x > 2'],
    [R`Which value is a solution to the inequality $2x + 1 > 5$?`, 'x = 3', 'x = 4'],
    [R`Find one solution of the inequality $2x + 1 > 5$.`, 'x = 3', 'x > 2'],
    [R`What is the boundary point of the solution to the inequality $2x + 1 > 5$?`, 'x = 2', 'x > 2'],
    [R`Is $x = 3$ a solution of the inequality? Solve to check.`, 'x = 3', 'x > 2'],
    [R`Give an example of a solution to the inequality $2x + 1 > 5$.`, 'x > 3', 'x > 2'],
    [R`Solve the inequality $2x + 1 > 5$. What is the smallest solution?`, 'x > 3', 'x > 2'],
    [R`The inequality $2x + 1 > 5$ has which solution set?`, 'x > 3', 'x > 2'],
    // No "solve" at all (a bare relation, or a different verb).
    [R`$2x + 1 > 5$`, 'x > 3', 'x > 2'],
    [R`Graph the solution of the inequality $2x + 1 > 5$.`, 'x > 3', 'x > 2'],
    // A point claimed for an inequality problem / an inequality for an equation.
    [R`Solve the inequality: $2x + 1 > 5$`, 'x = 3', 'x > 2'],
    [R`Solve the inequality: $2x + 1 > 5$`, 'x = 3', 'x = 4'],
    [R`Solve the equation: $2x + 1 = 5$`, 'x > 2', 'x = 2'],
  ] as const) {
    const d = decideAnswerDisputeTiebreak({ enabled: true, statement, claimed, solved });
    eq([d.winner, d.action, d.pin, d.claimedRefuted], ['unknown', 'unchanged', null, false], `not adjudicated: "${statement}" claimed ${claimed} solved ${solved}`);
    eq(d.note, buildUnconfirmedDisputeNote({ statement, claimed, solved }), 'legacy note, unchanged');
    ok(!/fails at/.test(d.note ?? ''), 'the note never says the claimed answer fails');
  }
  for (const st of ['Solve: 2x < 6', 'Solve for x: $2x < 6$', R`Solve and graph: $4x + 9 \le 33$`, 'Find the solution set of the inequality $2x < 6$', 'Find all solutions of the equation $2x = 6$', 'Solve the inequality $2x<6$.']) {
    ok(isPureSolveStatement(st), `pure solve: ${st}`);
  }
  for (const st of ['', 'Which value solves $2x < 6$?', 'Solve: find one value with $2x < 6$', 'Solve. How many integers satisfy $2x<6$?', 'What is the greatest solution? Solve $2x<6$', 'Is 2 a solution? Solve $2x<6$', 'Simplify $2x < 6$']) {
    ok(!isPureSolveStatement(st), `not a pure solve: ${st}`);
  }
  // A bare "one" / "which" is not a request for one value.
  {
    const oneStep = R`Solve the one-step inequality: $x + 3 > 5$`;
    ok(isPureSolveStatement(oneStep), '"one-step" is a pure solve');
    const d = decideAnswerDisputeTiebreak({ enabled: true, statement: oneStep, claimed: 'x > 8', solved: 'x > 2' });
    eq([d.winner, d.action, d.pin, d.claimedRefuted], ['solved', 'pin-solved', 'x > 2', true], '"one-step" statement is adjudicated');
    const whichWay = R`Solve for x: $x + 3 > 5$. Which way does the sign point?`;
    ok(isPureSolveStatement(whichWay), '"Which way …" is not "which value"');
    const w = decideAnswerDisputeTiebreak({ enabled: true, statement: whichWay, claimed: 'x > 8', solved: 'x > 2' });
    eq([w.winner, w.action, w.pin], ['unknown', 'unchanged', null], 'extra question after the solve: the statement is not pure instruction, so not adjudicated');
    for (const st of ['Solve: which value satisfies $2x < 6$?', 'Solve: which number works in $2x < 6$?', 'Solve: which of these satisfies $2x < 6$?',
      'Solve: find one solution of $2x < 6$', 'Solve: give one example for $2x < 6$', 'Solve: find one value with $2x < 6$']) {
      ok(!isPureSolveStatement(st), `still not a pure solve: ${st}`);
    }
  }
  // Pure solve, same class: still adjudicated — equations too.
  const e = decideAnswerDisputeTiebreak({ enabled: true, statement: 'Solve the equation: $2x + 1 = 5$', claimed: 'x = 3', solved: 'x = 2' });
  eq([e.winner, e.action, e.pin], ['solved', 'pin-solved', 'x = 2'], 'equation problem, both answers equations: solver wins');
}

// ── adjudication runs on the NORMALISED answer text ───────────────────────
{
  for (const solved of [R`\(-4 \le x < 2\)`, R`\[-4 \le x < 2\]`, R`$$-4 \le x < 2$$`, R`$-4 \le x < 2$.`, R`\(-4 \le x < 2\).`, R`-4 \le x < 2.`]) {
    const d = decideAnswerDisputeTiebreak({ enabled: true, statement: ST, claimed: CLAIMED, solved });
    eq([d.winner, d.action, d.pin], ['solved', 'pin-solved', R`-4 \le x < 2`], `wrapped solver answer wins: ${solved}`);
  }
  const wrappedClaim = decideAnswerDisputeTiebreak({ enabled: true, statement: ST, claimed: R`$-4 \le x < 2$.`, solved: '-4 < x <= 2' });
  eq([wrappedClaim.winner, wrappedClaim.pin], ['claimed', R`-4 \le x < 2`], 'wrapped claimed answer: adjudicated, pinned without delimiters');
  for (const solved of [R`$-4 \le x < 2$ is the solution set`, R`-4 \le x < 2, so x is small`, R`The answer is $-4 \le x < 2$`]) {
    const d = decideAnswerDisputeTiebreak({ enabled: true, statement: ST, claimed: CLAIMED, solved });
    eq([d.winner, d.pin], ['unknown', null], `trailing / leading prose stays unknown: ${solved}`);
  }
  eq(normalizeAnswerForPin(R`$x < 2$.`), 'x < 2', 'trailing full stop after the delimiters');
  eq(normalizeAnswerForPin(R`\(x < 2.\)`), 'x < 2', 'trailing full stop inside the delimiters');
  eq(normalizeAnswerForPin('x = 2.5'), 'x = 2.5', 'a decimal is not sentence punctuation');
}

// ── both / claimed: only a SOLVED form is pinned ──────────────────────────
{
  const S2 = R`Solve: $2x + 3 < 13$`;
  ok(isSolvedFormAnswer('x < 5') && isSolvedFormAnswer(R`-4 \le x < 2`) && isSolvedFormAnswer(R`2 > x \ge -4`) && isSolvedFormAnswer(R`t \le \frac{25}{6}`) && isSolvedFormAnswer('5 > x') && isSolvedFormAnswer('x = -3'), 'solved forms');
  ok(!isSolvedFormAnswer('2x < 10') && !isSolvedFormAnswer('2x + 3 < 13') && !isSolvedFormAnswer('x + 1 < 6') && !isSolvedFormAnswer('-x > -5') && !isSolvedFormAnswer('3 < 5') && !isSolvedFormAnswer('prose') && !isSolvedFormAnswer(''), 'not solved forms');
  // both — claimed is not solved, the solver's is.
  const both = decideAnswerDisputeTiebreak({ enabled: true, statement: S2, claimed: '2x < 10', solved: '$x < 5$' });
  eq([both.winner, both.action, both.pin, both.note, both.claimedRefuted], ['both', 'pin-solved-same-set', 'x < 5', null, false], 'both, claimed unsolved: the solver\'s solved form is pinned');
  // both — neither is solved.
  const bothNone = decideAnswerDisputeTiebreak({ enabled: true, statement: S2, claimed: '2x < 10', solved: '4x < 20' });
  eq([bothNone.winner, bothNone.action, bothNone.pin, bothNone.note, bothNone.claimedRefuted], ['both', 'no-pin-unsolved-form', null, null, false], 'both, neither solved: nothing pinned');
  // claimed wins but is not solved — the solver's answer is wrong, nothing to pin.
  const claimedNone = decideAnswerDisputeTiebreak({ enabled: true, statement: S2, claimed: '2x < 10', solved: 'x > 5' });
  eq([claimedNone.winner, claimedNone.action, claimedNone.pin, claimedNone.note, claimedNone.claimedRefuted], ['claimed', 'no-pin-unsolved-form', null, null, false], 'claimed wins, unsolved form: nothing pinned');
  // solved wins but is not in solved form — legacy note, nothing pinned.
  const solvedUnsolved = decideAnswerDisputeTiebreak({ enabled: true, statement: S2, claimed: 'x > 5', solved: '2x < 10' });
  eq([solvedUnsolved.winner, solvedUnsolved.action, solvedUnsolved.pin, solvedUnsolved.claimedRefuted], ['solved', 'unchanged', null, false], 'solver right but unsolved form: nothing pinned');
}

// ── pinned form ───────────────────────────────────────────────────────────
eq(normalizeAnswerForPin(R`$-4 \le x < 2$`), R`-4 \le x < 2`, '$…$ stripped');
eq(normalizeAnswerForPin(R`$$ x < 2 $$`), 'x < 2', '$$…$$ stripped');
eq(normalizeAnswerForPin(R`\( x < 2 \)`), 'x < 2', R`\(…\) stripped`);
eq(normalizeAnswerForPin(R`\[x < 2\]`), 'x < 2', R`\[…\] stripped`);
eq(normalizeAnswerForPin('  x  <  2 \n'), 'x < 2', 'whitespace collapsed');
eq(normalizeAnswerForPin('$x < 2$ or $x > 5$'), '$x < 2$ or $x > 5$', 'two math spans: left as is');
eq(normalizeAnswerForPin('x < 2'), 'x < 2', 'plain answer untouched');

// ── never throws ──────────────────────────────────────────────────────────
for (const junk of [undefined, null, 42, {}, 'x'.repeat(6000)]) {
  assert.doesNotThrow(() => decideAnswerDisputeTiebreak({ enabled: true, statement: junk as unknown as string, claimed: junk as unknown as string, solved: junk as unknown as string })); n++;
  assert.doesNotThrow(() => buildSolvedWinsNote({ statement: junk as unknown as string, claimed: junk as unknown as string, solved: junk as unknown as string })); n++;
  assert.doesNotThrow(() => normalizeAnswerForPin(junk as unknown as string)); n++;
}

console.log(`answer-dispute-tiebreak: ${n} cases passed`);
