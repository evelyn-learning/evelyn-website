/**
 * Stale Ink 2 final (src/lib/tutor/voice/stale-ink-final.ts).
 *
 * 2026-10-18, GDI session embed-1792338502233, 16:05: Ink 2 opened a turn while
 * the tutor was speaking (the mic caught the tutor's own "Yes, I have"), the
 * mic was then ducked for the rest of the tutor's turn, so the turn never
 * closed; 42 s later, when the student next spoke, Ink 2 delivered ", Ihave ."
 * as that turn's final. The orchestrator dispatched it as a fresh student turn,
 * the brain started answering it, and the student's real sentence had to cut
 * that reply off (two wasted brain calls, one "テニス、いい" fragment heard).
 * Two tokens in 42 seconds is not speech.
 *
 * Run: npx tsx scripts/test-stale-ink-final.ts
 */
import { strict as assert } from 'node:assert';
import { countSpeechTokens, isStaleInkFinal, STALE_INK_FINAL_MIN_OPEN_MS } from '../src/lib/tutor/voice/stale-ink-final';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

test('token count: Latin words, and each kana/kanji character', () => {
  assert.equal(countSpeechTokens(', Ihave .'), 1);
  assert.equal(countSpeechTokens('I went to Nagoya castle last week .'), 7);
  assert.equal(countSpeechTokens('ゴルフが好きです。'), 8);
  assert.equal(countSpeechTokens('ラストウィーク。I went last week .'), 11);
  assert.equal(countSpeechTokens(''), 0);
});

test('the live case: ", Ihave ." after a 42 s open turn is stale', () => {
  assert.equal(isStaleInkFinal(', Ihave .', 42155), true);
});

test('a short answer in a normally closed turn is kept', () => {
  assert.equal(isStaleInkFinal('Yes', 2911), false);
  assert.equal(isStaleInkFinal('はい', 1800), false);
  assert.equal(isStaleInkFinal(', Ihave .', STALE_INK_FINAL_MIN_OPEN_MS - 1), false);
});

test('a long turn with real speech in it is kept, in English and in Japanese', () => {
  assert.equal(isStaleInkFinal('I went to Nagoya castle last week .', 20000), false);
  assert.equal(isStaleInkFinal('すみません。カラオケはカタカナで書きますよね。英語ではどう言いますか。', 30000), false);
  assert.equal(isStaleInkFinal('I played I played tennis tuesday . Have you ever played tennis ?', 45000), false);
});

test('a whole sentence is never stale, however long the turn was open', () => {
  assert.equal(isStaleInkFinal('I went to Kyoto last year', 90000), false);
  assert.equal(isStaleInkFinal('はい、ハワイに行きました', 90000), false);
});

test('a four-token fragment is stale only once its rate is below talking speed', () => {
  assert.equal(isStaleInkFinal('I went last week', 12000), false);
  assert.equal(isStaleInkFinal('I went last week', 30000), true);
});

test('a long open turn carrying only a fragment is stale, whatever the script', () => {
  assert.equal(isStaleInkFinal('はい', 15000), true);
  assert.equal(isStaleInkFinal('Yes .', 20000), true);
  assert.equal(isStaleInkFinal('', 20000), true);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
