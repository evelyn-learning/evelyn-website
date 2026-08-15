/**
 * Unit tests for the caption↔TTS word-sync tracker (caption-sync.ts).
 * Run: npm run test:caption-sync
 * Design: docs/superpowers/specs/2026-07-04-caption-tts-word-sync-design.md
 */
import { CaptionSyncTracker, stripMarkdownEmphasis, type SpokenProgress } from '../src/lib/tutor/voice/caption-sync';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}
function prog(sentence: string | null, elapsedSec: number, arrivedTotalSec: number, playing = true): SpokenProgress {
  return { sentence, elapsedSec, arrivedTotalSec, playing };
}

// ── 1. markdown strip ─────────────────────────────────────────────
check('strips **bold** and *italic*',
  stripMarkdownEmphasis('a **big** and *small* word') === 'a big and small word');

// ── 2. pre-begin poll → not live, empty text ──────────────────────
{
  const t = new CaptionSyncTracker();
  const c = t.poll(null);
  check('before any attempt: live=false, empty text', c.live === false && c.text === '');
}

// ── 3. basic proportional reveal, word-clamped ────────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-1-0');
  t.registerSentence('Alright, lets look at slope.', 'Alright, lets look at slope.');
  // half played (arrived total = full sentence duration)
  const c = t.poll(prog('Alright, lets look at slope.', 1.4, 2.8));
  check('mid-sentence reveal is a proper prefix', c.live === true && c.text.length > 0 && c.text.length < 28);
  check('reveal ends on a word boundary', !/\S/.test('Alright, lets look at slope.'.charAt(c.text.length)) || c.text.length === 0);
  const done = t.poll(prog('Alright, lets look at slope.', 2.8, 2.8));
  check('fully played sentence fully revealed', done.text === 'Alright, lets look at slope.');
}

// ── 4. multi-sentence: earlier sentences fully revealed ───────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-2-0');
  t.registerSentence('First one.', 'First one.');
  t.registerSentence('Second sentence here.', 'Second sentence here.');
  t.poll(prog('First one.', 1.0, 1.0));
  const c = t.poll(prog('Second sentence here.', 0.6, 1.2));
  check('sentence 1 fully revealed once sentence 2 plays', c.text.startsWith('First one.'));
  check('sentence 2 partially revealed', c.text.length > 'First one.'.length && c.text.length < 'First one. Second sentence here.'.length);
}

// ── 5. monotonic hold on pause / null progress ────────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-3-0');
  t.registerSentence('A fairly long sentence for the pause test.', 'A fairly long sentence for the pause test.');
  const before = t.poll(prog('A fairly long sentence for the pause test.', 2.0, 4.0));
  const held = t.poll(prog(null, 0, 0, false));       // clearSpeechQueue nulls the sentence
  check('pause holds the reveal (no regress)', held.text === before.text && held.live === true);
  const shrunk = t.poll(prog('A fairly long sentence for the pause test.', 0.5, 4.0));
  check('reveal never moves backward within an attempt', shrunk.text.length >= before.text.length);
}

// ── 6. display ≠ speech (TTS normalization) ───────────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-4-0');
  t.registerSentence('Great work. x bar is 6.', 'Great work! **x̄** is 6.');
  const c = t.poll(prog('Great work. x bar is 6.', 10, 10));
  check('caption shows display form (markdown stripped, punctuation kept)', c.text === 'Great work! x̄ is 6.');
}

// ── 7. clause-tail suffix fallback (resume-from-cut) ──────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-5-0');
  t.registerSentence('The slope tells us the rate, so we rise over run.', 'The slope tells us the rate, so we rise over run.');
  // resume replays only the tail clause
  const c = t.poll(prog('so we rise over run.', 0.1, 1.0));
  check('clause-tail resume maps into the tail range', c.text.length >= 'The slope tells us the rate,'.length - 1);
  check('clause-tail resume still live', c.live === true);
}

// ── 8. unmatched sentence (e.g. kill-bridge) holds ────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-6-0');
  t.registerSentence('Original content.', 'Original content.');
  const before = t.poll(prog('Original content.', 1.0, 1.0));
  const c = t.poll(prog('Let me try that a different way.', 0.5, 1.0));
  check('unmatched sentence holds prior reveal', c.text === before.text);
}

// ── 9. duplicate short sentences resolve in order ─────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-7-0');
  t.registerSentence('Try it.', 'Try it.');
  t.registerSentence('Now expand.', 'Now expand.');
  t.registerSentence('Try it.', 'Try it.');
  t.poll(prog('Try it.', 1, 1));
  t.poll(prog('Now expand.', 1, 1));
  const c = t.poll(prog('Try it.', 1, 1));
  check('second duplicate matches the LATER pair', c.text === 'Try it. Now expand. Try it.');
}

// ── 10. skipped-over pair reveals when a later sentence matches ───
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-8-0');
  t.registerSentence('Held then dropped.', 'Held then dropped.');
  t.registerSentence('Actually spoken.', 'Actually spoken.');
  // elapsed comfortably past the char-rate estimate so frac reaches 1
  const c = t.poll(prog('Actually spoken.', 2, 2));
  check('cursor skips unplayed pair but reveals it (chat parity)', c.text === 'Held then dropped. Actually spoken.');
}

// ── 11. finalization: streamEnd + drain → full text, not live ─────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-9-0');
  t.registerSentence('One.', 'One.');
  t.registerSentence('Two.', 'Two.');
  t.notifyDrain();                       // spurious mid-stream drain must NOT finalize
  const mid = t.poll(prog('One.', 0.2, 0.5));
  check('mid-stream drain does not finalize', mid.live === true);
  t.markStreamEnd();
  t.notifyDrain();
  const done = t.poll(null);
  check('streamEnd+drain finalizes to full text', done.live === false && done.text === 'One. Two.');
}

// ── 12. attempt reset (kill → retry) ──────────────────────────────
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-10-0');
  t.registerSentence('Doomed attempt text.', 'Doomed attempt text.');
  t.poll(prog('Doomed attempt text.', 1, 1));
  t.beginAttempt('turn-10-1');
  const c = t.poll(prog(null, 0, 0, false));
  check('retry attempt starts with a fresh empty reveal', c.text === '' && c.turnKey === 'turn-10-1' && c.live === true);
}

// ── 13. conservative denominator: short arrivedTotal cannot race ──
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-11-0');
  const s = 'A sentence of roughly sixty characters to exercise the estimate.';
  t.registerSentence(s, s);
  // Realtime path early in a sentence: only 0.3s of audio arrived so far.
  const c = t.poll(prog(s, 0.29, 0.3));
  check('char-estimate floor keeps early reveal small', c.text.length < s.length / 2);
}

// ── 14. silent-poll fallback: streamEnd + silence finalizes without drain ──
// (audio can fully drain BEFORE the brain stream ends — e.g. tool-heavy Skip
// turns with calls trailing the last sentence — so the post-stream 'drain'
// never fires; 5 consecutive silent polls after streamEnd must finalize.)
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-12-0');
  t.registerSentence('Short spoken bit.', 'Short spoken bit.');
  t.poll(prog('Short spoken bit.', 2, 2));
  t.markStreamEnd();
  let live4 = true;
  for (let i = 0; i < 4; i++) live4 = t.poll(prog(null, 0, 0, false)).live;
  check('4 silent polls after streamEnd: not yet finalized', live4 === true);
  const fifth = t.poll(prog(null, 0, 0, false));
  check('5th silent poll finalizes to full text', fifth.live === false && fifth.text === 'Short spoken bit.');
}

// ── 15. registration trims the speech key (em-dash-tail normalization) ──
{
  const t = new CaptionSyncTracker();
  t.beginAttempt('turn-14-0');
  t.registerSentence('Watch this, ', 'Watch this —');
  const c = t.poll(prog('Watch this,', 5, 5));
  check('trailing-space speech key still exact-matches the trimmed report', c.text === 'Watch this —');
}

console.log(`\ncaption-sync: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
