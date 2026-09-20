/**
 * portal-704e3e01: the show_problem → show_segment_card substitution twice
 * chose a card the orchestrator then rejected, turning the brain's correct
 * tool choice into a self-inflicted validator retry.
 *
 * Usage: npx tsx scripts/test-show-problem-substitution.ts  (npm run test:show-problem-substitution)
 */
import { shouldSubstituteShowProblem } from '../src/lib/tutor/orchestrator/show-problem-substitution';

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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
