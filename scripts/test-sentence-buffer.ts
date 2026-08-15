/**
 * SentenceBuffer — streaming sentence splitter for TTS (claude-brain.ts).
 *
 * Regression under test (2026-07-09, portal-abc8df2d): "Ms. Kiara" was
 * spoken as "Ms <long pause> Kiara" — the boundary regex treats any
 * period after 25 chars as a sentence end, so "…, Ms." was emitted as a
 * complete sentence and Cartesia voiced it with sentence-final falling
 * intonation. Abbreviation periods (Mr./Ms./Dr./e.g./…) must not split.
 *
 * Run: npx tsx scripts/test-sentence-buffer.ts
 */
import { strict as assert } from 'node:assert';
import { SentenceBuffer } from '../apps/marketing/src/lib/tutor/voice/claude-brain';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function split(text: string): string[] {
  const b = new SentenceBuffer();
  const out = b.push(text);
  const tail = b.flush();
  if (tail) out.push(tail);
  return out;
}

test('honorific mid-sentence does not split (the Ms. Kiara pause)', () => {
  const out = split('Great work on that one, Ms. Kiara! Now try the next step yourself. ');
  assert.deepEqual(out, ['Great work on that one, Ms. Kiara!', 'Now try the next step yourself.']);
});

test('Mr./Dr./Mrs. honorifics all protected past the 25-char minimum', () => {
  for (const h of ['Mr', 'Dr', 'Mrs', 'Prof']) {
    const out = split(`That was a good question for ${h}. Praveen to answer today. `);
    assert.equal(out.length, 1, `${h}. must not split (got ${JSON.stringify(out)})`);
  }
});

test('e.g. and i.e. do not split', () => {
  const out = split('Try a simpler case first, e.g. a circle of radius one. Then generalize it. ');
  assert.deepEqual(out, ['Try a simpler case first, e.g. a circle of radius one.', 'Then generalize it.']);
});

test('ordinary sentence ends still split promptly', () => {
  const out = split('That is exactly the right idea. Now apply it to the second row. ');
  assert.deepEqual(out, ['That is exactly the right idea.', 'Now apply it to the second row.']);
});

test('ordinals like 1st. are not mistaken for abbreviations', () => {
  const out = split('You finished that drill in 1st. The next one is timed as well. ');
  assert.equal(out.length, 2);
});

test('abbreviation at buffer end is held for flush, not emitted early', () => {
  const b = new SentenceBuffer();
  const out = b.push('Let me hand this over to Ms. ');
  assert.equal(out.length, 0, 'no premature sentence');
  const rest = b.push('Kiara for the wrap-up now. ');
  assert.deepEqual(rest, ['Let me hand this over to Ms. Kiara for the wrap-up now.']);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
