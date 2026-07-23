/**
 * Render↔speech synchronization — pure flush-decision core.
 *
 * The brain orchestrator buffers each whiteboard render (instead of
 * dispatching it to the board the instant the tool-call SSE frame is
 * parsed) and flushes it when the sentence that introduces it has been
 * spoken. A render's introducing sentence is the one emitted immediately
 * BEFORE it in the stream (`anchorM` = number of sentences dispatched to
 * TTS at buffer time). It becomes flushable when that sentence COMPLETES —
 * i.e. when the NEXT sentence starts playing, so playback-start count
 * reaches `anchorM + 1` — or via the max-hold cap (`capExpired`), or when
 * the whole turn's audio drains (`drainAll`).
 *
 * This module is the deterministic, side-effect-free decision used by
 * VoiceTutorRealtime's buffer and exercised by `npm run test:render-sync`.
 * See project_tutor_render_speech_sync for the full grilled design.
 */

export interface RenderSyncEntry {
  /** Number of sentences dispatched to TTS at the moment this render was
   *  buffered = the index of its introducing (preceding) sentence. */
  anchorM: number;
  /** True once a per-render max-hold has fired (optional — the orchestrator
   *  uses a shared stall timer + `drainAll`, but the pure decision still
   *  honors a per-entry override when set). Defaults to false. */
  capExpired?: boolean;
  /** Board-anchor assist (re-anchor): a turn-opening equation/figure held until
   *  the later sentence that NAMES it plays. While pending it is NOT anchor-
   *  flushable (its `anchorM` is the stale 0); the orchestrator clears this and
   *  bumps `anchorM` to the introducing sentence on match. Fail-safe: drainAll /
   *  capExpired still release it (it surfaces at turn-end, never at the front).
   *  See board-anchor-assist + project_tutor_board_anchored_speech. */
  pendingReanchor?: boolean;
  /** Async-content placeholder (show_sketch): the doodler is still generating
   *  this render's `primitives`, so it has NO content yet. It holds its FIFO
   *  slot (preserving stream order) but is NEVER flushable — not even on
   *  drainAll/cap — until the orchestrator either resolves it (clears this flag
   *  + fills content) or splices it out (fail/timeout = fail-to-nothing). That
   *  bounds how long it can block later renders to the doodler's hard cap.
   *  See project_tutor_sketch_capability. */
  pendingAsync?: boolean;
  /** Task 3.2 (humanlike-latency): word-level anchor WITHIN the introducing
   *  sentence. Sentence identity uses the same 1-based numbering as
   *  `anchorM` itself (= the playback-started count while that sentence
   *  plays — anchorM IS the introducing sentence's number, see the module
   *  doc). `anchorWord` indexes the referring word in the REWRITTEN
   *  transcript (the words the WS TTS timestamps — see sonic-ws.ts).
   *  Strictly an ACCELERATOR: with a live word clock the entry becomes
   *  flushable the moment the referring word is spoken — mid-introducer,
   *  instead of waiting for the introducer to complete. The sentence rule
   *  still releases on its own, so a stale/absent clock (HTTP TTS path)
   *  degrades to exactly today's timing, never later. */
  anchorWord?: number;
}

/** How many sentences past its stale anchor a pending-reanchor entry may
 *  hold out for a naming sentence before releasing anyway. 2 ≈ the window
 *  in which a narrated introduction actually arrives when it's coming at
 *  all (observed across the board-anchor-assist live rounds); beyond it
 *  the turn has moved on and the hold only delays the paint to drain. */
export const REANCHOR_MAX_HOLD_SENTENCES = 2;

export interface FlushOpts {
  /** Turn audio fully drained — every dispatched sentence has finished
   *  playing, so all currently-buffered renders are flushable. */
  drainAll?: boolean;
  /** Buffer is paused (a perception cancel is mid-flight, verdict pending)
   *  — flush nothing until the verdict resolves. */
  paused?: boolean;
  /** Task 3.2: current playback word position from the word clock ('word'
   *  playback-progress events). `sentenceIdx` is the playback-started
   *  COUNT while that sentence plays (1-based, directly comparable to
   *  anchorM). Absent on the HTTP TTS path. */
  wordPos?: { sentenceIdx: number; wordIdx: number };
}

/**
 * How many entries from the FRONT of the buffer are ready to flush right
 * now, given how many sentences have started playing this turn.
 *
 * Returns a FIFO prefix length: we stop at the first not-ready entry so
 * renders always reach the board in stream order (a later render is never
 * shown before an earlier one). Because `anchorM` is monotonically
 * non-decreasing across the buffer and cap timers fire in buffer order,
 * stopping at the first gap never strands a ready entry behind an unready
 * one in practice.
 */
export function flushableCount(
  buffer: readonly RenderSyncEntry[],
  playbackStartedCount: number,
  opts: FlushOpts = {},
): number {
  if (opts.paused) return 0;
  let n = 0;
  for (const e of buffer) {
    // An async placeholder has no content yet — never flushable (even on
    // drainAll/cap). It blocks its slot until the orchestrator resolves it
    // (clears pendingAsync) or splices it out. Stop the prefix here.
    if (e.pendingAsync) break;
    // A pending-reanchor entry is held against its (stale) anchor — the
    // turn-end drain, the cap, or the sentence-count hold-cap below may
    // release it until it's been re-anchored.
    //
    // Hold-cap (Phase-3 live round 3, session-1784768779243): when the
    // naming sentence NEVER comes (the brain front-loads a worked-solution
    // card, says "Exactly. 5 kg." and pivots straight to the next problem),
    // the entry used to ride all the way to drain — 12–18s holds, painting
    // the solution together with the NEXT question's render after the
    // whole narration. The shared stall timer can't catch this (word/
    // sentence ticks keep resetting it — that IS progress). If no naming
    // sentence matched within REANCHOR_MAX_HOLD_SENTENCES past the stale
    // anchor, the front-load hold has failed its purpose — release now;
    // mid-turn is strictly better than turn-end.
    const reanchorExpired =
      e.pendingReanchor === true &&
      playbackStartedCount >= e.anchorM + 1 + REANCHOR_MAX_HOLD_SENTENCES;
    const anchorReady =
      (!e.pendingReanchor && playbackStartedCount >= e.anchorM + 1) || reanchorExpired;
    // Task 3.2 word-anchored ACCELERATOR: the referring word inside the
    // introducing sentence has been spoken (or the clock is already past
    // that sentence) — paint now instead of waiting for the introducer to
    // complete. Purely additive beside anchorReady: a stale/absent word
    // clock can only fall back to sentence timing, never delay past it.
    const wordReady =
      !e.pendingReanchor &&
      e.anchorWord !== undefined &&
      opts.wordPos !== undefined &&
      (opts.wordPos.sentenceIdx > e.anchorM ||
        (opts.wordPos.sentenceIdx === e.anchorM && opts.wordPos.wordIdx >= e.anchorWord));
    if (opts.drainAll || anchorReady || wordReady || e.capExpired) n++;
    else break;
  }
  return n;
}
