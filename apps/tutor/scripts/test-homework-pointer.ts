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
  "I've set 1 practice question on Variables on both sides for you — it's waiting under Unit 2, Practice.",
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
  "I've set 5 practice questions on Variables on both sides and Classifying solutions for you — they're waiting under Unit 2, Practice.",
);

// 3. no locator ⇒ nothing may be said
assert.equal(buildHomeworkPointerSentence({ los: [{ loId: 'a', title: 'T', count: 2 }] }), null);
assert.equal(buildHomeworkPointerSentence({ los: [{ loId: 'a', title: 'T', count: 2 }], locator: '   ' }), null);
// …and nothing assigned ⇒ nothing may be said either.
assert.equal(buildHomeworkPointerSentence({ los: [], locator: 'Unit 2 · Practice' }), null);
assert.equal(buildHomeworkPointerSentence({ los: [{ loId: 'a', title: 'T', count: 0 }], locator: 'Unit 2 · Practice' }), null);

// 4. SPOKEN-locator normalization (final review 2026-09-07). rewriteForTTS
// turns a middot into " times " unconditionally, so the pointer sentence must
// carry NONE of the separator glyphs — "Unit 2 times Practice" was what the
// student actually heard.
const spoken = buildHomeworkPointerSentence({ los: [{ loId: 'a', title: 'T', count: 2 }], locator: 'Unit 2 · Practice' })!;
assert.ok(spoken, 'expected a sentence');
// Scoped to the LOCATOR tail: the sentence body's own em dash ("for you —
// they're") is deliberate prose punctuation and is not a separator glyph the
// pronunciation table rewrites. What must be glyph-free is the location.
const spokenLocatorTail = spoken.slice(spoken.indexOf('waiting under '));
for (const ch of ['\u00b7', '\u00d7', '\u00f7', '|', '\u203a', '\u00bb', '\u2013', '\u2014']) {
  assert.ok(!spokenLocatorTail.includes(ch), `spoken locator must not contain ${JSON.stringify(ch)} — TTS mangles it: ${spoken}`);
}
assert.match(spoken, /waiting under Unit 2, Practice\.$/);
// other separators normalize the same way
assert.match(
  buildHomeworkPointerSentence({ los: [{ loId: 'a', title: 'T', count: 1 }], locator: 'Algebra 1 › Unit 2 — Practice' })!,
  /waiting under Algebra 1, Unit 2, Practice\.$/,
);

console.log('homework-pointer: all assertions passed');
