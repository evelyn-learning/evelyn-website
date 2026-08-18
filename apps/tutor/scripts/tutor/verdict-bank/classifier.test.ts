// apps/tutor/scripts/tutor/verdict-bank/classifier.test.ts
/**
 * Verdict-opener classifier for the probe bank (2026-08-18 plan). Grades
 * the FIRST TWO sentences of a tutor reply as affirm / deny / none.
 * Sentences from real incident sessions are the fixtures.
 */
import { classifyVerdictOpener, gradeOutcome } from './classifier';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
  else console.log(`  ✓ ${name}`);
}

console.log('classifyVerdictOpener');
check('plain affirm', classifyVerdictOpener('Right — that flow is exactly what you just traced on the board.'), 'affirm');
check('exactly-right affirm', classifyVerdictOpener('Exactly right. Linking the name to something meaningful — that is deep processing.'), 'affirm');
check('nice/praise affirm', classifyVerdictOpener('Nice work — one eighth it is.'), 'affirm');
check('not-quite deny', classifyVerdictOpener('Not quite. Close, though — the central executive is definitely the boss.'), 'deny');
check('close-but deny', classifyVerdictOpener('Close, but check that subtraction again.'), 'deny');
check('bare-no deny', classifyVerdictOpener('No — look at the fourth component.'), 'deny');
check('second-sentence deny still counts', classifyVerdictOpener('Hmm. Not quite — walk it left to right.'), 'deny');
check('question back = none', classifyVerdictOpener('What makes you pick that one?'), 'none');
check('plain reveal without verdict word = none', classifyVerdictOpener("No worries — it's a circle, because every point sits the same distance from the center."), 'none');
check('teaching statement = none', classifyVerdictOpener('The central executive decides how attention gets split.'), 'none');
check('third-sentence verdict is NOT scanned', classifyVerdictOpener('Interesting. Let me think about that. Not quite what I had in mind.'), 'none');
check('empty = none', classifyVerdictOpener(''), 'none');

console.log('gradeOutcome');
check('expected affirm, got affirm → pass', gradeOutcome('affirm', 'affirm'), 'pass');
check('expected affirm, got deny → fail', gradeOutcome('affirm', 'deny'), 'fail');
check('expected affirm, got none → no-verdict', gradeOutcome('affirm', 'none'), 'no-verdict');
check('expected none, got affirm → fail (phantom praise)', gradeOutcome('none', 'affirm'), 'fail');
check('expected none, got deny → fail (graded a non-answer)', gradeOutcome('none', 'deny'), 'fail');
check('expected none, got none → pass', gradeOutcome('none', 'none'), 'pass');
check('expected deny, got deny → pass', gradeOutcome('deny', 'deny'), 'pass');
check('expected deny, got affirm → fail (rubber-stamp)', gradeOutcome('deny', 'affirm'), 'fail');
check('expected deny, got none → no-verdict', gradeOutcome('deny', 'none'), 'no-verdict');

if (failures > 0) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nAll verdict-classifier checks passed.');
