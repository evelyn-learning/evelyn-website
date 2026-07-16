/**
 * Unit tests for the try-yourself MCQ verdict seam (Task X9).
 *
 * Regression 2026-07: AP Gov MCQ — student picked "Concurrent (both
 * share it)" (the flagged-correct option), the row showed the ✓
 * affordance, but the card printed "Not quite. Expected: Concurrent"
 * and the tutor said "close". Root cause: the verdict compared the
 * submitted CHOICE ID against the free-text `expectedAnswer` string
 * instead of resolving correctness by OPTION IDENTITY
 * (`choices[].correct`, mirroring QuizRenderer.gradeItem).
 *
 * Run: npx tsx scripts/test-tryyourself-mcq-verdict.ts
 */
import {
  resolveMcqCorrectChoice,
  computeTryYourselfVerdict,
  matchesAnswerStrict,
  type Choice,
} from '../src/app/tutor/components/whiteboard/tryYourselfAnswer';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

// The AP Gov repro choice set: flagged correctness lives on the choice,
// expectedAnswer is a bare, separately-authored string.
const apGovChoices: Choice[] = [
  { id: 'A', text: 'Reserved (states only)', correct: false },
  { id: 'B', text: 'Concurrent (both share it)', correct: true },
  { id: 'C', text: 'Enumerated (federal only)', correct: false },
  { id: 'D', text: 'Implied (neither explicitly)', correct: false },
];
const apGovExpected = 'Concurrent';

console.log('\n=== Bug repro: correct pick, label ≠ bare expectedAnswer ===');
{
  const verdict = computeTryYourselfVerdict('B', apGovExpected, 'mcq', apGovChoices);
  check('picking the flagged-correct option (by id) is TRUE', verdict === true, String(verdict));
}
{
  const resolved = resolveMcqCorrectChoice(apGovChoices, apGovExpected);
  check('resolveMcqCorrectChoice finds the flagged choice regardless of expectedAnswer text', resolved?.id === 'B', JSON.stringify(resolved));
}

console.log('\n=== Genuinely wrong option still reads wrong ===');
{
  const verdict = computeTryYourselfVerdict('A', apGovExpected, 'mcq', apGovChoices);
  check('picking a real wrong option is FALSE', verdict === false, String(verdict));
}
{
  const verdict = computeTryYourselfVerdict('D', apGovExpected, 'mcq', apGovChoices);
  check('picking another wrong option is FALSE', verdict === false, String(verdict));
}

console.log('\n=== No correct flags — fall back to label vs expectedAnswer, tolerant of parenthetical ===');
{
  const choices: Choice[] = [
    { id: 'A', text: 'Reserved (states only)' },
    { id: 'B', text: 'Concurrent (both share it)' },
    { id: 'C', text: 'Enumerated (federal only)' },
  ];
  const verdictRight = computeTryYourselfVerdict('B', 'Concurrent', 'mcq', choices);
  check('unflagged: label-contains-expected picked as correct', verdictRight === true, String(verdictRight));
  const verdictWrong = computeTryYourselfVerdict('A', 'Concurrent', 'mcq', choices);
  check('unflagged: a different unrelated option is FALSE', verdictWrong === false, String(verdictWrong));
}
{
  // expected is the SUPERSET, label is the bare word — expected-contains-label direction.
  const choices: Choice[] = [
    { id: 'A', text: 'Concurrent' },
    { id: 'B', text: 'Reserved' },
  ];
  const verdict = computeTryYourselfVerdict('A', 'Concurrent (both federal and state share it)', 'mcq', choices);
  check('unflagged: expected-contains-label direction also resolves correct', verdict === true, String(verdict));
}

console.log('\n=== C1 regression: negated distractor textually contains the expected answer ===');
{
  // Reviewer-reported false positive: a NEGATED distractor ("Not a
  // concurrent power") textually CONTAINS the expected answer
  // ("Concurrent power") and, being earlier in the array, must not beat
  // the true exact match later in the array.
  const choices: Choice[] = [
    { id: 'A', text: 'Not a concurrent power' },
    { id: 'B', text: 'Concurrent power' },
  ];
  const resolved = resolveMcqCorrectChoice(choices, 'Concurrent power');
  check('exact match (B) wins over an earlier negated-containment candidate (A)', resolved?.id === 'B', JSON.stringify(resolved));
  const verdictB = computeTryYourselfVerdict('B', 'Concurrent power', 'mcq', choices);
  check('picking the true exact match (B) is TRUE', verdictB === true, String(verdictB));
  const verdictA = computeTryYourselfVerdict('A', 'Concurrent power', 'mcq', choices);
  check('picking the negated distractor (A) is FALSE, not a false positive', verdictA === false, String(verdictA));
}
{
  // No exact match anywhere — the only containment candidate is negated
  // relative to an expected answer that itself carries no negation. Must
  // NOT be treated as a match; correctness is undecidable (null), not a
  // false "wrong" and not a false "correct".
  const choices: Choice[] = [
    { id: 'A', text: 'Not a concurrent power' },
    { id: 'B', text: 'Judicial review' },
  ];
  const resolved = resolveMcqCorrectChoice(choices, 'Concurrent power');
  check('negated-only containment candidate is excluded when expected has no negation', resolved === undefined, JSON.stringify(resolved));
}
{
  // Negation on BOTH sides: the expected answer itself is a negation
  // ("Not applicable") and a choice is its own exact match — must still
  // resolve via the exact-match pass, unaffected by negation exclusion.
  const choices: Choice[] = [
    { id: 'A', text: 'Not applicable' },
    { id: 'B', text: 'Applicable' },
  ];
  const resolved = resolveMcqCorrectChoice(choices, 'Not applicable');
  check('negation-both-sides: exact match on the negated expected answer still resolves', resolved?.id === 'A', JSON.stringify(resolved));
}

console.log('\n=== Case / whitespace variants ===');
{
  const choices: Choice[] = [
    { id: 'A', text: '  CONCURRENT   (both share it)  ', correct: true },
    { id: 'B', text: 'Reserved', correct: false },
  ];
  const verdict = computeTryYourselfVerdict('A', '  concurrent  ', 'mcq', choices);
  check('case/whitespace-insensitive on both the flag path', verdict === true, String(verdict));
}
{
  const choices: Choice[] = [
    { id: 'A', text: '  CONCURRENT   (both share it)  ' },
    { id: 'B', text: 'Reserved' },
  ];
  const verdict = computeTryYourselfVerdict('A', '  Concurrent  ', 'mcq', choices);
  check('case/whitespace-insensitive on the label-fallback path', verdict === true, String(verdict));
}

console.log('\n=== No signal at all — honest null, not a false "wrong" ===');
{
  const choices: Choice[] = [
    { id: 'A', text: 'Judicial review' },
    { id: 'B', text: 'Executive privilege' },
  ];
  const verdict = computeTryYourselfVerdict('A', 'Concurrent powers', 'mcq', choices);
  check('no flags + no label overlap defers to the brain (null), does not assert wrong', verdict === null, String(verdict));
}
{
  const verdict = computeTryYourselfVerdict('A', undefined, 'mcq', [{ id: 'A', text: 'x' }, { id: 'B', text: 'y' }]);
  check('no expectedAnswer + no flags defers to the brain (null)', verdict === null, String(verdict));
}

console.log('\n=== No choices array at all — falls back to legacy id/text vs expectedAnswer ===');
{
  const verdict = computeTryYourselfVerdict('42', '42', 'mcq', undefined);
  check('bare mcq compare still works when there are no choices to resolve identity from', verdict === true, String(verdict));
}

console.log('\n=== Exact match (no parenthetical involved) ===');
{
  const choices: Choice[] = [
    { id: 'A', text: 'Concurrent', correct: true },
    { id: 'B', text: 'Reserved', correct: false },
  ];
  check('exact label match, flagged', computeTryYourselfVerdict('A', 'Concurrent', 'mcq', choices) === true);
}

console.log('\n=== Free-response (frq) behavior is UNTOUCHED by the mcq fix ===');
{
  // The 2026-04-29 pre-calc case from the original comment: algebraically
  // equivalent but textually different — must stay undecidable (null),
  // never a false "wrong".
  const verdict = matchesAnswerStrict(
    'sin 225=cos 225 = - 1/ root 2, quadrant 3, ref angle 45 deg',
    'sin 225° = −√2/2, cos 225° = −√2/2; Q3; reference angle 45°',
    'frq',
  );
  check('frq algebraically-equivalent-but-different-text stays null (undecidable)', verdict === null, String(verdict));
}
{
  check('frq exact match (after normalization) is true', matchesAnswerStrict('Paris', ' paris ', 'frq') === true);
}
{
  // computeTryYourselfVerdict for frq must behave identically to calling
  // matchesAnswerStrict directly — the mcq branch must not leak in.
  const a = computeTryYourselfVerdict('Paris', 'paris', 'frq');
  const b = matchesAnswerStrict('Paris', 'paris', 'frq');
  check('computeTryYourselfVerdict(frq) matches matchesAnswerStrict(frq) directly', a === b && a === true);
}

console.log('\n=== Numeric behavior is UNTOUCHED ===');
{
  check('numeric "024" matches "24"', computeTryYourselfVerdict('024', '24', 'numeric') === true);
  check('numeric "0.5" matches "1/2"', computeTryYourselfVerdict('0.5', '1/2', 'numeric') === true);
  check('numeric mismatch is false', computeTryYourselfVerdict('3', '4', 'numeric') === false);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
