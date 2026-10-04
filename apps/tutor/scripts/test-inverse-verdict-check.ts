/**
 * Unit test for the inverse-verdict check (verdict-detector round, Task 5):
 * the false-DENIAL counterpart to praise-echo — the tutor's opener DENIES an
 * answer that actually matches the verified expected answer (the "(3x+2)"
 * class: student says "3x + 2", tutor opens "Not quite", but 3x+2 IS the
 * verified answer). Two tiers: KILL when `verifiedExpectedAnswer` is
 * populated (pipeline-verified / plan-authored / improvised-verified only),
 * ADVISORY when only the unverified `unverifiedCardAnswer` is populated — a
 * wrong unverified card + a correct denial must never kill a good turn.
 * `disagree`/`unknown` from the comparator never fire, either tier.
 * Usage: npx tsx scripts/test-inverse-verdict-check.ts
 */
import { checkInverseVerdict } from '../src/lib/tutor/voice/inverse-verdict-check';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

// the (3x+2)-class: verified answer, student says it, tutor denies
{
  const r = checkInverseVerdict({ sentence: 'Not quite — check that again.', studentUtterance: '3x + 2', verifiedExpectedAnswer: '3x+2' });
  check('verified false denial kills', r.verdict === 'false_denial', JSON.stringify(r));
}
{
  const r = checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: 'three x plus two', verifiedExpectedAnswer: '3x+2' });
  check('spoken form matches too', r.verdict === 'false_denial', JSON.stringify(r));
}
{
  const r = checkInverseVerdict({ sentence: "That's not it.", studentUtterance: 'is it 3x + 2?', verifiedExpectedAnswer: '3x+2' });
  check('hedged question form', r.verdict === 'false_denial', JSON.stringify(r));
}
// unverified tier is advisory only
{
  const r = checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '3x + 2', unverifiedCardAnswer: '3x+2' });
  check('unverified → advisory', r.verdict === 'advisory_false_denial', JSON.stringify(r));
}
// verified tier wins when both present
{
  const r = checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '3x + 2', verifiedExpectedAnswer: '3x+2', unverifiedCardAnswer: '99' });
  check('verified beats unverified', r.verdict === 'false_denial', JSON.stringify(r));
}
// wrong student answer: denial is correct, no fire
{
  const r = checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '3x + 7', verifiedExpectedAnswer: '3x+2' });
  check('true denial ok', r.verdict === 'ok', JSON.stringify(r));
}
// comparator unknown never fires
{
  const r = checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: 'hmm let me think', verifiedExpectedAnswer: '3x+2' });
  check('unparseable ok', r.verdict === 'ok', JSON.stringify(r));
}
// non-denial sentence never fires
{
  const r = checkInverseVerdict({ sentence: 'Good — now factor it.', studentUtterance: '3x + 2', verifiedExpectedAnswer: '3x+2' });
  check('no denial opener ok', r.verdict === 'ok', JSON.stringify(r));
}
// no expected answer at all
{
  const r = checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '3x + 2' });
  check('no expected ok', r.verdict === 'ok', JSON.stringify(r));
}
// mcq: student letter matches verified letter, tutor denies
{
  const r = checkInverseVerdict({ sentence: 'Nope.', studentUtterance: 'C', verifiedExpectedAnswer: 'C', choices: [{ letter: 'B', text: 'B' }, { letter: 'C', text: 'C' }] });
  check('mcq false denial', r.verdict === 'false_denial', JSON.stringify(r));
}

// ─── 2026-10-03: inequality keys need the problem statement ───
{
  const base = { sentence: 'Not quite.', studentUtterance: '2x < 10', verifiedExpectedAnswer: 'x < 5' };
  check('inequality key, no problemText → not graded (ok)', checkInverseVerdict(base).verdict === 'ok');
  // 2026-10-04: "2x < 10" is equivalent to the key but NOT solved — the
  // tutor's "Not quite — you still need to isolate x" is a correct denial and
  // must not be killed. Only a solved-form answer makes the denial false.
  check('inequality key + statement → half-solved "2x < 10" denied = ok (denial stands)',
    checkInverseVerdict({ ...base, problemText: 'Solve 2x < 10.' }).verdict === 'ok');
  check('inequality key + statement → the retyped problem denied = ok',
    checkInverseVerdict({ sentence: 'Not quite — you still need to isolate x.', studentUtterance: '2x + 3 < 13', verifiedExpectedAnswer: 'x < 5', problemText: 'Solve the inequality: $2x + 3 < 13$' }).verdict === 'ok');
  check('inequality key + statement → solved-form answer denied = false_denial',
    checkInverseVerdict({ ...base, studentUtterance: 'x < 5', problemText: 'Solve 2x < 10.' }).verdict === 'false_denial');
  check('inequality key + statement → reversed solved form denied = false_denial',
    checkInverseVerdict({ ...base, studentUtterance: '5 > x', problemText: 'Solve 2x < 10.' }).verdict === 'false_denial');
  check('inequality key + statement → wrong answer denied = ok',
    checkInverseVerdict({ ...base, studentUtterance: 'x < 6', problemText: 'Solve 2x < 10.' }).verdict === 'ok');
  check('inequality key + domain-restricted statement, half-solved → ok',
    checkInverseVerdict({ ...base, problemText: 'x is a positive integer. Solve 2x < 10.' }).verdict === 'ok');
  check('problemContext alone (money context) does not enable relation grading',
    checkInverseVerdict({ ...base, problemContext: 'Solve 2x < 10.' }).verdict === 'ok');
  check('numeric behaviour unchanged without problemText',
    checkInverseVerdict({ sentence: 'Not quite.', studentUtterance: '12', verifiedExpectedAnswer: '12' }).verdict === 'false_denial');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
