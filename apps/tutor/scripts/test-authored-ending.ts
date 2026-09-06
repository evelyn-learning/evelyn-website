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

assert.equal(problemMatchesAuthored('Solve: 3(35 + 4g) = 105 + 12g', 'Solve 3(35+4g) = 105+12g for g'), true);
assert.equal(problemMatchesAuthored('6x - 12 = 4x + 10', 'Solve 3(35+4g) = 105+12g for g'), false);
console.log('authored-ending: all assertions passed');
