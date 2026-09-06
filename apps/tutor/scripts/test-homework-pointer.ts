/**
 * Task 13 fix round 1 — the runtime-spoken homework pointer. The client owns
 * this sentence because the brain never sees the close tool's result on the
 * production path; these are the three cases that decide whether it speaks.
 */
import { strict as assert } from 'node:assert';
import { buildHomeworkPointerSentence } from '../src/lib/tutor/voice/homework-pointer';

// 1. one question, one objective — singular, no "and"
assert.equal(
  buildHomeworkPointerSentence({ los: [{ loId: 'alg1.multi-step', title: 'Variables on both sides', count: 1 }], locator: 'Unit 2 · Practice' }),
  "I've set 1 practice question on Variables on both sides for you — you'll find them under Unit 2 · Practice.",
);

// 2. two objectives — counts summed, titles joined with " and "
assert.equal(
  buildHomeworkPointerSentence({
    los: [
      { loId: 'alg1.multi-step', title: 'Variables on both sides', count: 3 },
      { loId: 'alg1.classify', title: 'Classifying solutions', count: 2 },
    ],
    locator: 'Unit 2 · Practice',
  }),
  "I've set 5 practice questions on Variables on both sides and Classifying solutions for you — you'll find them under Unit 2 · Practice.",
);

// 3. no locator ⇒ nothing may be said
assert.equal(buildHomeworkPointerSentence({ los: [{ loId: 'a', title: 'T', count: 2 }] }), null);
assert.equal(buildHomeworkPointerSentence({ los: [{ loId: 'a', title: 'T', count: 2 }], locator: '   ' }), null);
// …and nothing assigned ⇒ nothing may be said either.
assert.equal(buildHomeworkPointerSentence({ los: [], locator: 'Unit 2 · Practice' }), null);
assert.equal(buildHomeworkPointerSentence({ los: [{ loId: 'a', title: 'T', count: 0 }], locator: 'Unit 2 · Practice' }), null);

console.log('homework-pointer: all assertions passed');
