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
}

export interface FlushOpts {
  /** Turn audio fully drained — every dispatched sentence has finished
   *  playing, so all currently-buffered renders are flushable. */
  drainAll?: boolean;
  /** Buffer is paused (a perception cancel is mid-flight, verdict pending)
   *  — flush nothing until the verdict resolves. */
  paused?: boolean;
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
    // A pending-reanchor entry is held against its (stale) anchor — only the
    // turn-end drain or the cap may release it until it's been re-anchored.
    const anchorReady = !e.pendingReanchor && playbackStartedCount >= e.anchorM + 1;
    if (opts.drainAll || anchorReady || e.capExpired) n++;
    else break;
  }
  return n;
}
