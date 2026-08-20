/**
 * Unit test for the render↔speech-sync flush-decision core
 * (src/lib/tutor/whiteboard/render-sync.ts). Covers anchor-based flushing,
 * the FIFO prefix stop, the max-hold cap (capExpired), the turn-end drain
 * (drainAll), and the perception pause. See project_tutor_render_speech_sync.
 *
 * Run: npm run test:render-sync
 * No framework — matches test:page-grouping / test:conic-primitives. Pure.
 */

import { strict as assert } from 'node:assert';
import { flushableCount, shouldBypassRenderSync, type RenderSyncEntry } from '../src/lib/tutor/whiteboard/render-sync';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

/** Build a buffer of entries with given anchors; capExpired defaults false. */
const buf = (...specs: Array<number | [number, boolean]>): RenderSyncEntry[] =>
  specs.map((s) => Array.isArray(s)
    ? { anchorM: s[0], capExpired: s[1] }
    : { anchorM: s, capExpired: false });

function main() {
  console.log('Render↔speech sync — flushableCount\n');

  test('empty buffer → 0', () => {
    assert.equal(flushableCount([], 5), 0);
  });

  test('anchor M=1 flushes only once playback reaches sentence 2 (count≥2)', () => {
    // Render buffered after sentence 1 (its introducing sentence). Flushes
    // when sentence 1 COMPLETES = sentence 2 STARTS = playbackStarted≥2.
    const b = buf(1);
    assert.equal(flushableCount(b, 0), 0, 'no sentence played yet');
    assert.equal(flushableCount(b, 1), 0, 'sentence 1 only just started — not complete');
    assert.equal(flushableCount(b, 2), 1, 'sentence 2 started → sentence 1 complete → flush');
  });

  test('turn-open render (anchor 0) flushes at first sentence start (count≥1)', () => {
    const b = buf(0);
    assert.equal(flushableCount(b, 0), 0);
    assert.equal(flushableCount(b, 1), 1);
  });

  test('FIFO prefix: stops at first not-ready entry (no reorder)', () => {
    // Anchors 1, 3 — at playbackStarted=2 only the first is ready.
    const b = buf(1, 3);
    assert.equal(flushableCount(b, 2), 1, 'second (anchor 3) not yet ready → stop after first');
    assert.equal(flushableCount(b, 4), 2, 'both ready');
  });

  test('multiple renders sharing one anchor flush together', () => {
    const b = buf(2, 2, 2);
    assert.equal(flushableCount(b, 2), 0, 'anchor-2 needs count≥3');
    assert.equal(flushableCount(b, 3), 3, 'all three release at once');
  });

  test('capExpired forces a flush even if its anchor sentence has not completed', () => {
    // Anchor 5 (sentence 5 not yet done) but the cap fired.
    const b = buf([5, true]);
    assert.equal(flushableCount(b, 1), 1, 'cap overrides the anchor wait');
  });

  test('cap on the FRONT entry lets the contiguous ready prefix through', () => {
    // Front capExpired; second is anchor-ready; third not ready.
    const b = buf([5, true], 1, 9);
    assert.equal(flushableCount(b, 2), 2, 'front via cap, second via anchor, third blocked');
  });

  test('a NON-ready front entry blocks a later cap-expired entry (FIFO)', () => {
    // Front anchor 9 not ready and not capped; second capExpired. FIFO stops
    // at the front so board order is preserved (the second waits its turn —
    // in practice the front cap fires first since it was buffered earlier).
    const b = buf(9, [1, true]);
    assert.equal(flushableCount(b, 2), 0, 'front not ready → nothing flushes, order held');
  });

  test('drainAll flushes the whole buffer regardless of anchors', () => {
    const b = buf(3, 7, 12);
    assert.equal(flushableCount(b, 0, { drainAll: true }), 3);
  });

  test('paused flushes nothing — even with drainAll or capExpired', () => {
    const b = buf([1, true], 0);
    assert.equal(flushableCount(b, 99, { paused: true }), 0);
    assert.equal(flushableCount(b, 99, { paused: true, drainAll: true }), 0);
  });

  test('paused takes precedence over drainAll (cancel window holds the buffer)', () => {
    const b = buf(0);
    assert.equal(flushableCount(b, 5, { paused: true, drainAll: true }), 0);
  });

  // ── Board-anchor re-anchor: pendingReanchor holds against the stale anchor ──
  test('pendingReanchor: holds while the naming window is still open', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingReanchor: true }];
    assert.equal(flushableCount(b, 1), 0, 'count 1 — window open');
    assert.equal(flushableCount(b, 2), 0, 'count 2 — window open (anchorM+1+cap = 3)');
  });
  test('pendingReanchor: hold-cap releases after REANCHOR_MAX_HOLD_SENTENCES (naming never came)', () => {
    // Phase-3 live round 3 (session-1784768779243): front-loaded worked-
    // solution cards were never named by the narration and rode to drain —
    // 12–18s holds, painting with the NEXT question's render. The cap
    // releases them mid-turn instead.
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingReanchor: true }];
    assert.equal(flushableCount(b, 3), 1, 'count 3 = anchorM+1+2 → released');
    assert.equal(flushableCount(b, 9), 1, 'way past → released');
    const b1: RenderSyncEntry[] = [{ anchorM: 1, pendingReanchor: true }];
    assert.equal(flushableCount(b1, 3), 0, 'anchor 1: count 3 still held');
    assert.equal(flushableCount(b1, 4), 1, 'anchor 1: count 4 → released');
  });
  test('pendingReanchor hold-cap: FIFO — expired front also unblocks a ready follower', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingReanchor: true }, { anchorM: 2 }];
    assert.equal(flushableCount(b, 3), 2, 'front expired + follower anchor-ready → both');
  });
  test('pendingReanchor: drainAll still releases it (fail-safe to turn-end)', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingReanchor: true }];
    assert.equal(flushableCount(b, 0, { drainAll: true }), 1);
  });
  test('pendingReanchor: capExpired still releases it (stall backstop)', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingReanchor: true, capExpired: true }];
    assert.equal(flushableCount(b, 0), 1);
  });
  test('pendingReanchor cleared + anchorM bumped → flushes at the new anchor', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 3, pendingReanchor: false }];
    assert.equal(flushableCount(b, 3), 0, 'sentence 4 not started yet');
    assert.equal(flushableCount(b, 4), 1, 'sentence 4 started → flush');
  });
  test('pendingReanchor front entry holds later ready entries (FIFO, within the naming window)', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingReanchor: true }, { anchorM: 1 }];
    assert.equal(flushableCount(b, 2), 0, 'second entry (ready at count 2) held behind the pending front');
  });

  // ── Async doodle: pendingAsync is content-less, NEVER flushable until resolved/removed ──
  test('pendingAsync: never flushable even when anchor satisfied', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingAsync: true }];
    assert.equal(flushableCount(b, 9), 0, 'no content yet');
  });
  test('pendingAsync: drainAll does NOT release it (no content to show)', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingAsync: true }];
    assert.equal(flushableCount(b, 9, { drainAll: true }), 0, 'unlike pendingReanchor, drain cannot show a content-less slot');
  });
  test('pendingAsync: capExpired does NOT release it either', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingAsync: true, capExpired: true }];
    assert.equal(flushableCount(b, 9), 0);
  });
  test('pendingAsync resolved (flag cleared) → flushes at its anchor', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 2, pendingAsync: false }];
    assert.equal(flushableCount(b, 2), 0, 'sentence 3 not started');
    assert.equal(flushableCount(b, 3), 1, 'resolved + anchor satisfied → flush');
  });
  test('pendingAsync front blocks later ready entries until resolved/spliced (bounded by cap)', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingAsync: true }, { anchorM: 0 }];
    assert.equal(flushableCount(b, 9), 0, 'later entry held behind the pending sketch (orchestrator splices on timeout to unblock)');
  });
  test('pendingAsync resolved at front lets the contiguous ready prefix flush', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, pendingAsync: false }, { anchorM: 0 }];
    assert.equal(flushableCount(b, 1), 2, 'both flush once the sketch resolved');
  });

  // ── Task 3.2 (humanlike-latency): word-anchored flush (ACCELERATOR) ─────
  // `anchorWord` = index of the referring word WITHIN the introducing
  // sentence (sentence "number" anchorM — wordPos.sentenceIdx is the
  // playback-started COUNT while a sentence plays, so introducer playing
  // ⟺ sentenceIdx === anchorM ⟺ count === anchorM). With a live word
  // clock the entry flushes the MOMENT the referring word is spoken —
  // mid-introducer, before the sentence rule's count ≥ anchorM+1. Without
  // wordPos (HTTP TTS path) it degrades to sentence semantics, never later.
  test('word anchor: not yet flushable before the referring word (mid-introducer)', () => {
    // Introducer (sentence 2) is playing: count=2, sentence rule needs ≥3.
    const b: RenderSyncEntry[] = [{ anchorM: 2, anchorWord: 4 }];
    assert.equal(flushableCount(b, 2, { wordPos: { sentenceIdx: 2, wordIdx: 3 } }), 0, 'word 3 < anchorWord 4');
  });
  test('word anchor: flushes the moment the referring word is spoken (before sentence completes)', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 2, anchorWord: 4 }];
    assert.equal(flushableCount(b, 2, { wordPos: { sentenceIdx: 2, wordIdx: 4 } }), 1, 'word 4 reached — sentence rule (count≥3) not yet satisfied');
  });
  test('word anchor: clock past the introducing sentence satisfies it', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 2, anchorWord: 4 }];
    assert.equal(flushableCount(b, 3, { wordPos: { sentenceIdx: 3, wordIdx: 0 } }), 1, 'sentence 3 playing > introducer 2 (sentence rule also ready — consistent)');
  });
  test('word anchor: earlier clock position never satisfies it', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 2, anchorWord: 4 }];
    assert.equal(flushableCount(b, 1, { wordPos: { sentenceIdx: 1, wordIdx: 99 } }), 0, 'still on sentence 1 — introducer not begun');
  });
  test('word anchor: without wordPos degrades to sentence semantics exactly', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 2, anchorWord: 4 }];
    assert.equal(flushableCount(b, 2), 0, 'sentence rule: count 2 < anchorM+1');
    assert.equal(flushableCount(b, 3), 1, 'sentence rule: count 3 ≥ anchorM+1');
  });
  test('word anchor: stale clock cannot DELAY past sentence semantics', () => {
    // Introducer had no timestamps (HTTP-path sentence): the clock idles on
    // an older sentence while playback advances. Sentence rule still wins.
    const b: RenderSyncEntry[] = [{ anchorM: 2, anchorWord: 4 }];
    assert.equal(flushableCount(b, 3, { wordPos: { sentenceIdx: 1, wordIdx: 2 } }), 1, 'count 3 ≥ anchorM+1 releases regardless of the stale clock');
  });
  test('word anchor: entries WITHOUT anchorWord ignore wordPos entirely', () => {
    const b = buf(2);
    assert.equal(flushableCount(b, 2, { wordPos: { sentenceIdx: 2, wordIdx: 99 } }), 0, 'sentence 2 not complete; no word anchor to accelerate');
  });
  test('word anchor: pendingReanchor still holds within the naming window (word clock cannot bypass)', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, anchorWord: 2, pendingReanchor: true }];
    assert.equal(flushableCount(b, 2, { wordPos: { sentenceIdx: 2, wordIdx: 9 } }), 0);
  });
  test('word anchor: pendingAsync still never flushable', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 0, anchorWord: 1, pendingAsync: true }];
    assert.equal(flushableCount(b, 9, { wordPos: { sentenceIdx: 2, wordIdx: 9 } }), 0);
  });
  test('word anchor: paused still flushes nothing', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 2, anchorWord: 4 }];
    assert.equal(flushableCount(b, 9, { paused: true, wordPos: { sentenceIdx: 9, wordIdx: 9 } }), 0);
  });
  test('word anchor: FIFO prefix — word-ready front releases, later sentence-anchored entry still blocked', () => {
    const b: RenderSyncEntry[] = [{ anchorM: 2, anchorWord: 4 }, { anchorM: 3 }];
    assert.equal(flushableCount(b, 2, { wordPos: { sentenceIdx: 2, wordIdx: 4 } }), 1, 'front via word (mid-introducer); second needs count≥4');
  });

  // ── R49 opening-turn bypass (2026-08-20) ──────────────────────────────
  // Rule 15 tells the brain to emit a render beside its introducing
  // sentence "even if the board sits bare through the opening sentences",
  // and render-sync then honours that anchor. Correct mid-lesson; on the
  // OPENING turn it guarantees a blank board while the tutor talks —
  // measured 15.5s (embed-1787073582144) and 22.6s (portal-2d53e403) from
  // Start tap to first paint. The bypass releases the opening turn's FIRST
  // render immediately and leaves every later render on normal semantics.
  test('opening bypass: first render of the opening turn goes straight through', () => {
    assert.equal(shouldBypassRenderSync({ enabled: true, isOpeningTurn: true, rendersDispatchedThisTurn: 0 }), true);
  });
  test('opening bypass: only the FIRST render — the second is buffered normally', () => {
    assert.equal(shouldBypassRenderSync({ enabled: true, isOpeningTurn: true, rendersDispatchedThisTurn: 1 }), false);
  });
  test('opening bypass: never applies after the opening turn', () => {
    assert.equal(shouldBypassRenderSync({ enabled: true, isOpeningTurn: false, rendersDispatchedThisTurn: 0 }), false);
  });
  test('opening bypass: flag off ⇒ always false (byte-identical pre-R49 behaviour)', () => {
    assert.equal(shouldBypassRenderSync({ enabled: false, isOpeningTurn: true, rendersDispatchedThisTurn: 0 }), false);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
