/**
 * Denied-answer reversal guard (2026-08-18 live retest, portal-a972c7e9,
 * AP Psychology): the student answered "the central executive"; the tutor
 * said "Not quite" and invented a distinction that doesn't exist, then two
 * turns later asserted "that juggling act belongs to the central executive
 * after all" — and finally revealed "it's the *central executive*" as if
 * fresh, after the student had given up. The judge flagged both bad turns
 * but advisories dead-end for non-math claims, and no deterministic guard
 * covered the cross-turn shape. This one does: deny a short answer X at
 * turn N, assert X as the answer at a later turn → provable
 * self-contradiction → kill + credit the student.
 */
import {
  extractDeniableAnswer,
  checkDeniedAnswerReversal,
} from '../src/lib/tutor/voice/denied-answer-reversal';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

console.log('extractDeniableAnswer');
check('bare concept answer', extractDeniableAnswer('the central executive.'), 'central executive');
check('one-word answer', extractDeniableAnswer('episodic.'), 'episodic');
check('filler-wrapped answer', extractDeniableAnswer('I guess uh the phonological loop?'), 'phonological loop');
check('give-up is not an answer', extractDeniableAnswer("So, I don't know."), null);
check('"not sure" is not an answer', extractDeniableAnswer('um, not sure'), null);
check('a long explanation is not a short answer', extractDeniableAnswer('I guess if the visual only lasts for half a second then maybe the echoic memory is more important and evolution favors it'), null);
check('numeric answers track too', extractDeniableAnswer('13'), '13');

console.log('checkDeniedAnswerReversal');
const denied = [{ phrase: 'central executive', turn: 13 }];

// The verbatim turn-24 sentence — the mid-turn "after all" concession.
check(
  'the portal-a972c7e9 "after all" sentence fires',
  checkDeniedAnswerReversal({
    sentence: 'Think of it like a plate-spinner keeping two plates going at once without either crashing — that juggling act, holding the phone number *and* the apartment picture *simultaneously*, belongs to the central executive after all, since it\'s the one deciding how attention gets split between the loop and the sketchpad in real time.',
    denied, currentTurn: 14,
  }),
  { verdict: 'reversal', phrase: 'central executive', turn: 13 },
);
// The verbatim turn-26 reveal.
check(
  'the "Here\'s the resolution: it\'s the *central executive*" reveal fires',
  checkDeniedAnswerReversal({
    sentence: "Here's the resolution: it's the *central executive*.",
    denied, currentTurn: 15,
  }),
  { verdict: 'reversal', phrase: 'central executive', turn: 13 },
);
check(
  '"the answer is X" fires',
  checkDeniedAnswerReversal({ sentence: 'So the answer is the central executive.', denied, currentTurn: 14 }),
  { verdict: 'reversal', phrase: 'central executive', turn: 13 },
);
check(
  'plain descriptive mention does NOT fire',
  checkDeniedAnswerReversal({
    sentence: 'The central executive decides how attention gets split between the two workers.',
    denied, currentTurn: 14,
  }),
  { verdict: 'ok' },
);
check(
  'negated assertion does NOT fire',
  checkDeniedAnswerReversal({ sentence: "It's not the central executive — look at the fourth component.", denied, currentTurn: 14 }),
  { verdict: 'ok' },
);
check(
  'the denial turn itself is excluded (same turn)',
  checkDeniedAnswerReversal({
    sentence: 'Close, though — the central executive is definitely the boss directing traffic.',
    denied, currentTurn: 13,
  }),
  { verdict: 'ok' },
);
check(
  'stale denials expire (default 6 turns)',
  checkDeniedAnswerReversal({ sentence: "It's the central executive.", denied, currentTurn: 20 }),
  { verdict: 'ok' },
);
check(
  'unrelated sentence with no denied phrase does NOT fire',
  checkDeniedAnswerReversal({ sentence: "It's the phonological loop.", denied, currentTurn: 14 }),
  { verdict: 'ok' },
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll denied-answer-reversal checks passed.');
