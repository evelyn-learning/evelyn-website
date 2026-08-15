// scripts/tutor/voice-harness/wer.test.ts
import assert from 'node:assert';
import { normalizeForWer, wordErrorRate } from './wer';

assert.deepStrictEqual(normalizeForWer('Hello, World!  it’s 3/4.'), ['hello', 'world', "it's", '3/4']);
assert.strictEqual(wordErrorRate('the cat sat', 'the cat sat').wer, 0);
// one substitution over 3 ref words
assert.ok(Math.abs(wordErrorRate('the cat sat', 'the bat sat').wer - 1 / 3) < 1e-9);
// two edits over 4 ref words (a b c d → a x b d) = 0.5
const r = wordErrorRate('a b c d', 'a x b d');
assert.ok(Math.abs(r.wer - 0.5) < 1e-9);
// empty hypothesis = 100% deletions
assert.strictEqual(wordErrorRate('one two', '').wer, 1);
// case/punct insensitivity
assert.strictEqual(wordErrorRate('Hello world.', 'hello world').wer, 0);
console.log('OK — wer');
