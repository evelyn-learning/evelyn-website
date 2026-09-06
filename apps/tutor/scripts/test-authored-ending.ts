import { strict as assert } from 'node:assert';
import { classifySolutionCount, findAuthoredEndingContradiction, problemMatchesAuthored } from '../src/lib/tutor/voice/authored-ending';

assert.equal(classifySolutionCount('Infinitely many solutions (identity)'), 'infinite');
assert.equal(classifySolutionCount('No solution'), 'none');
assert.equal(classifySolutionCount('x = 11'), null);
assert.equal(classifySolutionCount('one solution, x = 4'), 'one');
assert.equal(classifySolutionCount('no solution or infinitely many'), null); // ambiguous authored text ⇒ guard stays off

// live 17:22:51 — affirmed "no solution" on an identity
const c = findAuthoredEndingContradiction({ sentence: "Right — 105 equals 105 with no g left, so there's no solution.", authoredAnswer: 'Infinitely many solutions (identity)' });
assert.deepEqual(c, { stated: 'none', authored: 'infinite' });
// agreeing verdict ⇒ null
assert.equal(findAuthoredEndingContradiction({ sentence: 'So this one has infinitely many solutions.', authoredAnswer: 'Infinitely many solutions (identity)' }), null);
// explanatory contrast ⇒ null (Task 5 helper)
assert.equal(findAuthoredEndingContradiction({ sentence: 'Unlike a no-solution case, a true statement means every value works.', authoredAnswer: 'Infinitely many solutions' }), null);
// a question is never a verdict
assert.equal(findAuthoredEndingContradiction({ sentence: 'Does that mean no solution, or infinitely many?', authoredAnswer: 'Infinitely many solutions' }), null);
// no authored answer ⇒ null
assert.equal(findAuthoredEndingContradiction({ sentence: "so there's no solution.", authoredAnswer: undefined }), null);

// 2026-09-07 fix round — false-kill exposure: a generalization ABOUT the
// class (not a verdict on THIS problem) must not fire, even when the
// generalization phrase and a verdict-cue word share the same sentence.
assert.equal(findAuthoredEndingContradiction({ sentence: 'Right, remember that an identity always has infinitely many solutions.', authoredAnswer: 'No solution' }), null);
assert.equal(findAuthoredEndingContradiction({ sentence: "So whenever both sides simplify to the same thing, that's an identity with infinitely many solutions.", authoredAnswer: 'No solution' }), null);
assert.equal(findAuthoredEndingContradiction({ sentence: 'Exactly, that\'s what we call an identity, and identities always have infinitely many solutions in general.', authoredAnswer: 'No solution' }), null);
// the live case must still fire after the adjacency tightening
assert.deepEqual(
  findAuthoredEndingContradiction({ sentence: "Right — 105 equals 105 with no g left, so there's no solution.", authoredAnswer: 'Infinitely many solutions (identity)' }),
  { stated: 'none', authored: 'infinite' },
);

// 2026-09-07 fix round — the original "explanatory contrast" case above
// never reached isExplanatoryMention because its class already agreed with
// the authored one. These two exercise MISMATCHED classes: one a genuine
// explanatory mention (null), one a genuine contradiction (still fires).
assert.equal(findAuthoredEndingContradiction({ sentence: 'Unlike infinitely many solutions, this one leaves a false statement.', authoredAnswer: 'No solution' }), null);
assert.deepEqual(
  findAuthoredEndingContradiction({ sentence: 'So the answer is infinitely many solutions.', authoredAnswer: 'No solution' }),
  { stated: 'infinite', authored: 'none' },
);

assert.equal(problemMatchesAuthored('Solve: 3(35 + 4g) = 105 + 12g', 'Solve 3(35+4g) = 105+12g for g'), true);
assert.equal(problemMatchesAuthored('6x - 12 = 4x + 10', 'Solve 3(35+4g) = 105+12g for g'), false);
console.log('authored-ending: all assertions passed');
