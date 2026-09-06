import { strict as assert } from 'node:assert';
import { homeworkPinText } from '../src/lib/tutor/action-pin-text';

assert.equal(
  homeworkPinText({ los: [{ loId: 'a', title: 'Classifying solutions', count: 4 }], locator: 'Unit 2 · Practice' }),
  'Homework · Unit 2 · Practice — 4 questions on Classifying solutions'
);
assert.equal(
  homeworkPinText({ los: [{ loId: 'a', title: 'A', count: 1 }, { loId: 'b', title: 'B', count: 3 }], locator: 'Unit 1 · Practice' }),
  'Homework · Unit 1 · Practice — 4 questions on A and B'
);
assert.equal(homeworkPinText({ los: [], locator: 'Unit 1 · Practice' }), null);
assert.equal(homeworkPinText({ los: [{ loId: 'a', title: 'A', count: 2 }] }), null); // no locator ⇒ never surfaced

console.log('action-pin-text: all assertions passed');
