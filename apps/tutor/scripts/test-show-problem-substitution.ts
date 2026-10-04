/**
 * portal-704e3e01: the show_problem → show_segment_card substitution twice
 * chose a card the orchestrator then rejected, turning the brain's correct
 * tool choice into a self-inflicted validator retry.
 *
 * Usage: npx tsx scripts/test-show-problem-substitution.ts  (npm run test:show-problem-substitution)
 */
import {
  shouldSubstituteShowProblem,
  shouldAutoCardAfterOwnProblem,
  refuseSilentDedupDrop,
} from '../src/lib/tutor/orchestrator/show-problem-substitution';
import { sameProblemStatement, statementsReadIdentically } from '../src/lib/tutor/whiteboard/soft-rejections';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const BASE = {
  targetsDiverge: false,
  newPageInTurn: false,
  generateProblemInTurn: false,
  segmentComplete: false,
  studentAskedForAnother: false,
  // Substitute-same-only round: the brain's statement IS the authored problem
  // and the authored card is not on the board — the case substitution is for.
  sameOnly: true,
  sameProblem: true,
  authoredOnBoard: false,
};

// ─── the behaviour that must not change ───
{
  const r = shouldSubstituteShowProblem({ ...BASE });
  check('plain matching-target case still substitutes', r.substitute === true, JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, targetsDiverge: true });
  check('diverging targets never substitute', r.substitute === false && r.skipReason === 'targets-diverge', JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, newPageInTurn: true });
  check('new_page in turn = fresh context, no substitute',
    r.substitute === false && r.skipReason === 'new-page-in-turn', JSON.stringify(r));
}
{
  const r = shouldSubstituteShowProblem({ ...BASE, generateProblemInTurn: true });
  check('generate_problem in turn, no substitute',
    r.substitute === false && r.skipReason === 'generate-problem-in-turn', JSON.stringify(r));
}

// ─── portal-704e3e01 @1111.7s ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, segmentComplete: true });
  check('completed segment is never substituted into (would be killed anyway)',
    r.substitute === false && r.skipReason === 'segment-complete', JSON.stringify(r));
}

// ─── portal-704e3e01 @1021.1s ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, studentAskedForAnother: true });
  check('student asked for a different problem — the brain\'s own card stands',
    r.substitute === false && r.skipReason === 'student-asked-for-another', JSON.stringify(r));
}

// ─── precedence: the pre-existing reasons still win, so telemetry stays stable ───
{
  const r = shouldSubstituteShowProblem({ ...BASE, targetsDiverge: true, segmentComplete: true });
  check('targets-diverge outranks segment-complete', r.skipReason === 'targets-diverge', JSON.stringify(r));
}

// ─── substitute only when it is the SAME problem ───
// Production: the brain posed a ticket-resale problem ("15n + 80 < 500"); the
// board showed the authored "Solve and graph: 4x + 9 ≤ 33" while the speech
// described tickets — three times in one session.
const AUTHORED = 'Solve and graph: 4x + 9 ≤ 33';
const TICKETS = 'A reseller pays an $80 fee plus $15 per ticket and must spend less than $500: 15n + 80 < 500. How many tickets can she buy?';
const REWORDED = 'Solve 4x + 9 ≤ 33 and graph the solution';
const decide = (brain: string, opts: { active?: string; sameOnly?: boolean } & Partial<typeof BASE> = {}) => {
  const { active, ...rest } = opts;
  return shouldSubstituteShowProblem({
    ...BASE,
    ...rest,
    sameProblem: sameProblemStatement(brain, AUTHORED),
    authoredOnBoard: statementsReadIdentically(active ?? '', AUTHORED),
  });
};
{
  const r = decide(TICKETS);
  check('ticket problem vs authored inequality → different-problem, brain\'s own card stands',
    r.substitute === false && r.skipReason === 'different-problem' && !r.drop, JSON.stringify(r));
}
{
  const r = decide(REWORDED);
  check('light rewording, authored card not on board → substitute', r.substitute === true && !r.skipReason && !r.drop, JSON.stringify(r));
}
{
  const r = decide(REWORDED, { active: AUTHORED });
  check('same problem, authored card is the active card → dropped quietly',
    r.substitute === false && r.skipReason === 'authored-already-on-board' && r.drop === true, JSON.stringify(r));
}
{
  // Resumed session: the tracked statement is the emphasis-stripped render.
  const r = shouldSubstituteShowProblem({ ...BASE, sameProblem: true,
    authoredOnBoard: statementsReadIdentically('Solve and graph: 4x + 9 ≤ 33', 'Solve and *graph*: 4x + 9 ≤ 33') });
  check('authored card with emphasis markup is recognised on the board', r.skipReason === 'authored-already-on-board' && r.drop === true, JSON.stringify(r));
}
{
  const r = decide(TICKETS, { active: AUTHORED });
  check('different problem while the authored card is on the board → still different-problem (never dropped)',
    r.skipReason === 'different-problem' && !r.drop, JSON.stringify(r));
}
{
  const r = decide('');
  check('empty brain statement → different-problem', r.substitute === false && r.skipReason === 'different-problem', JSON.stringify(r));
}
{
  const r = decide(AUTHORED, { active: 'Some improvised card about 7 apples' });
  check('same problem, a DIFFERENT card is active → substitute', r.substitute === true, JSON.stringify(r));
}

// ─── the four existing reasons (and targets-diverge) still win, unchanged ───
const EXISTING: Array<[keyof typeof BASE, string]> = [
  ['targetsDiverge', 'targets-diverge'],
  ['newPageInTurn', 'new-page-in-turn'],
  ['generateProblemInTurn', 'generate-problem-in-turn'],
  ['segmentComplete', 'segment-complete'],
  ['studentAskedForAnother', 'student-asked-for-another'],
];
for (const [key, reason] of EXISTING) {
  for (const sameProblem of [true, false]) {
    for (const authoredOnBoard of [true, false]) {
      const r = shouldSubstituteShowProblem({ ...BASE, [key]: true, sameProblem, authoredOnBoard });
      check(`${reason} outranks the new reasons (same=${sameProblem} onBoard=${authoredOnBoard})`,
        r.substitute === false && r.skipReason === reason && !r.drop, JSON.stringify(r));
    }
  }
}

// ─── flag off ⇒ identical to the pre-round decision for EVERY row ───
{
  const legacy = (a: { targetsDiverge: boolean; newPageInTurn: boolean; generateProblemInTurn: boolean; segmentComplete: boolean; studentAskedForAnother: boolean }) =>
    a.targetsDiverge ? { substitute: false, skipReason: 'targets-diverge' }
    : a.newPageInTurn ? { substitute: false, skipReason: 'new-page-in-turn' }
    : a.generateProblemInTurn ? { substitute: false, skipReason: 'generate-problem-in-turn' }
    : a.segmentComplete ? { substitute: false, skipReason: 'segment-complete' }
    : a.studentAskedForAnother ? { substitute: false, skipReason: 'student-asked-for-another' }
    : { substitute: true };
  let rows = 0;
  let same = 0;
  for (let bits = 0; bits < 128; bits++) {
    const b = (i: number) => ((bits >> i) & 1) === 1;
    const row = { targetsDiverge: b(0), newPageInTurn: b(1), generateProblemInTurn: b(2), segmentComplete: b(3), studentAskedForAnother: b(4) };
    const got = shouldSubstituteShowProblem({ ...row, sameOnly: false, sameProblem: b(5), authoredOnBoard: b(6) });
    rows++;
    if (JSON.stringify(got) === JSON.stringify(legacy(row))) same++;
  }
  check(`flag off: all ${rows} input rows decide exactly as before`, same === rows, `${same}/${rows}`);
}

// ─── companion 1: the end-of-turn auto card ───
check('auto card suppressed when this attempt painted the brain\'s own problem',
  shouldAutoCardAfterOwnProblem({ enabled: true, ownProblemPaintedThisAttempt: true }) === false);
check('auto card unaffected when no own problem was painted',
  shouldAutoCardAfterOwnProblem({ enabled: true, ownProblemPaintedThisAttempt: false }) === true);
check('auto card: flag off ⇒ never suppressed',
  shouldAutoCardAfterOwnProblem({ enabled: false, ownProblemPaintedThisAttempt: true }) === true);

// ─── companion 2: the three early silent dedup drops ───
check('a runtime-substituted DIFFERENT problem is never silently dropped',
  refuseSilentDedupDrop({ enabled: true, substitutedBrainStatement: TICKETS, authoredStatement: AUTHORED }) === true);
check('a runtime-substituted SAME problem may be silently dropped',
  refuseSilentDedupDrop({ enabled: true, substitutedBrainStatement: REWORDED, authoredStatement: AUTHORED }) === false);
check('a call the brain emitted itself (not substituted) is not this rule\'s business',
  refuseSilentDedupDrop({ enabled: true, substitutedBrainStatement: null, authoredStatement: AUTHORED }) === false);
check('substituted with an empty brain statement counts as a different problem',
  refuseSilentDedupDrop({ enabled: true, substitutedBrainStatement: '', authoredStatement: AUTHORED }) === true);
check('dedup refusal: flag off ⇒ never refuses',
  refuseSilentDedupDrop({ enabled: false, substitutedBrainStatement: TICKETS, authoredStatement: AUTHORED }) === false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
