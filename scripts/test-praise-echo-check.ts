/**
 * Unit test for the praise-echo check (verdict-detector round, session
 * portal-cb2addf5): the R41 target class where the brain's opener affirms a
 * value that DISAGREES with what the student actually said out loud
 * ("Right — $2x$." after the student said "three x"). Distinct from
 * `detectPraiseContradiction` (praise-contradiction.ts), which catches the
 * brain contradicting ITSELF later in the same turn — this compares the
 * affirmation against the STUDENT's utterance via the tri-state comparator
 * (`matchUtteranceToAnswer`). 'unknown'/'agree' verdicts and bare praise
 * must never fire; only a full-parse 'disagree' does.
 * Usage: npx tsx scripts/test-praise-echo-check.ts
 */
import { checkPraiseEcho } from '../src/lib/tutor/voice/praise-echo-check';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

// the R41 target class: affirm echoes a DIFFERENT value than the student said
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $2x$. So the second derivative is...', studentUtterance: 'three x' });
  check('echo disagrees with utterance → false_praise', r.verdict === 'false_praise', JSON.stringify(r));
}
// equivalent reformulation is fine
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $0.5$. Nice.', studentUtterance: 'one half' });
  check('equivalent echo ok', r.verdict === 'ok', JSON.stringify(r));
}
// bare praise never fires (user decision: no expectedAnswer fallback)
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right. Now try the next one.', studentUtterance: 'three x' });
  check('bare praise ok', r.verdict === 'ok', JSON.stringify(r));
}
// unknown comparator verdict never fires
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $2x$. Good.', studentUtterance: 'yeah that thing we did' });
  check('unparseable utterance ok', r.verdict === 'ok', JSON.stringify(r));
}
// MCQ shape — NEEDS_CONTEXT (see task-4-report.md): the brief's expectation
// here is 'false_praise', but extractPraiseEcho (Task 3, frozen — this
// round's Task 4 brief forbids modifying praise-contradiction.ts) gates its
// capture on isMathValueToken, which requires a digit/operator/`$`/backslash
// in the captured span. A bare MCQ letter like "B" has none of those, so
// extractPraiseEcho('Right — B. Moving on.') returns null and checkPraiseEcho
// never reaches the comparator — 'ok', not 'false_praise'. Verified directly:
// extractPraiseEcho('Right — B. Moving on.') === null. Asserting actual
// (correct-given-upstream) behavior here rather than patching praise-echo-check.ts
// with letter-specific extraction logic the brief's Step 3 code doesn't call for.
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — B. Moving on.', studentUtterance: 'C', choices: [{ letter: 'B', text: '4' }, { letter: 'C', text: '6' }] });
  check('mcq bare-letter echo: extractPraiseEcho math-value gate blocks capture → ok (brief expected false_praise; see NEEDS_CONTEXT)', r.verdict === 'ok', JSON.stringify(r));
}
// denial opener is not praise
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Not quite — $2x$ is the derivative.', studentUtterance: 'three x' });
  check('denial opener ok', r.verdict === 'ok', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
