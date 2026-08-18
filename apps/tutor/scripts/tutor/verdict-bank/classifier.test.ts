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
// NOTE (final review 2026-08-18, MINOR 10): this fixture's expected value
// changed from 'none' to 'deny' when the scan window widened from 2
// sentences to 3 — see the "third-sentence verdict IS scanned" check below,
// which now owns this exact input and asserts the new expected value.
check('empty = none', classifyVerdictOpener(''), 'none');

// Fix round 1 (2026-08-18): em-dash-joined hedge-then-verdict openers.
check('hedge em-dash deny (reported bug)', classifyVerdictOpener('Hmm — not quite, look at the units.'), 'deny');
check('hedge comma deny (still works)', classifyVerdictOpener('Hmm, not quite — check the exponent.'), 'deny');
check('well em-dash deny', classifyVerdictOpener('Well — no, that flips the inequality.'), 'deny');
check('oh em-dash affirm', classifyVerdictOpener('Oh — nice work, that is exactly it.'), 'affirm');
check('well done raw match wins (regression guard)', classifyVerdictOpener('Well done — you carried the negative through.'), 'affirm');
check('no worries survives stripping = none', classifyVerdictOpener('Hmm, no worries — take another run at it.'), 'none');
check('hedge alone does not manufacture verdict = none', classifyVerdictOpener('So the central executive splits attention.'), 'none');
check('hmm+no real denial still fires', classifyVerdictOpener('Hmm, no — the sign flips.'), 'deny');

// Final review (2026-08-18) — CRITICAL 2: contrastive openers false-affirmed.
check('right idea wrong number = deny', classifyVerdictOpener('Right idea, wrong number — the vertex is at 5/2.'), 'deny');
check('right track but = deny', classifyVerdictOpener('Right track, but check the vertex again.'), 'deny');
check('yes and no = deny', classifyVerdictOpener('Yes and no — the roots are right, the vertex is not.'), 'deny');
check('good instinct but = deny', classifyVerdictOpener('Good instinct, but the vertex sits at 5/2.'), 'deny');
check('correct me if I\'m wrong = none (not a verdict)', classifyVerdictOpener("Correct me if I'm wrong, but you meant the change in cost?"), 'none');
check('regression: bare "Right." start still affirms (out of scope not to fix)', classifyVerdictOpener("Right. That's exactly the line through the origin with slope 3."), 'affirm');

// Final review (2026-08-18) — IMPORTANT 3: under-detected affirms/denials.
check('you\'ve got it = affirm', classifyVerdictOpener("You've got it."), 'affirm');
check('you nailed it = affirm', classifyVerdictOpener('You nailed it.'), 'affirm');
check('absolutely = affirm', classifyVerdictOpener('Absolutely — that is the right approach.'), 'affirm');
check('got it in one = affirm', classifyVerdictOpener('Got it in one.'), 'affirm');
check('bang on = affirm', classifyVerdictOpener('Bang on — that is exactly it.'), 'affirm');
check('beautiful = affirm', classifyVerdictOpener('Beautiful — nicely done.'), 'affirm');
check('actually the distance is = deny', classifyVerdictOpener('Actually the distance is 5.'), 'deny');
check('close dash not = deny', classifyVerdictOpener('Close — it is 5, not 7.'), 'deny');
check('almost dash = deny', classifyVerdictOpener('Almost — check your last step.'), 'deny');
check('careful dash = deny', classifyVerdictOpener('Careful — that sign flips.'), 'deny');
check('not so fast dash = deny', classifyVerdictOpener('Not so fast — check the exponent.'), 'deny');
check("that's incorrect = deny", classifyVerdictOpener("That's incorrect."), 'deny');
check('hold on dash = deny', classifyVerdictOpener('Hold on — that is not quite it.'), 'deny');
check('no worries still none (regression)', classifyVerdictOpener("No worries — it's a circle, because every point sits the same distance from the center."), 'none');
check('hmm no worries still none (regression)', classifyVerdictOpener('Hmm, no worries — take another run at it.'), 'none');

// Final review (2026-08-18) — IMPORTANT 4: leading vocative not stripped.
check('vocative + deny', classifyVerdictOpener('Probe Student, not quite — the vertex is 5/2.'), 'deny');
check('vocative + affirm', classifyVerdictOpener('Probe Student, right — that is exactly it.'), 'affirm');

// Final review (2026-08-18) — MINOR 10: run-together sentence split.
check('run-together sentence (real smoke-run opener) still affirms', classifyVerdictOpener("Right. That's exactly the line through the origin with slope 3.Nice instinct converting slope form into that general line shape — very handy for JEE. Ready for the next one?"), 'affirm');

// Final review (2026-08-18) — MINOR 10: 3-sentence window boundary.
check('third-sentence verdict IS scanned in a 3-sentence window (was NOT in the 2-sentence window)', classifyVerdictOpener('Interesting. Let me think about that. Not quite what I had in mind.'), 'deny');
check('fourth-sentence verdict still NOT scanned', classifyVerdictOpener('Interesting. Let me think about that. Anyway. Not quite what I had in mind.'), 'none');

// Final review (2026-08-18) — MINOR 11: "half right" now a real deny.
check('half right = deny', classifyVerdictOpener('Half right — roots yes, vertex no.'), 'deny');

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
