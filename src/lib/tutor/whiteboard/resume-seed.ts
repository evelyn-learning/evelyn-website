/**
 * Resume-seed whiteboard batch guard.
 *
 * On a resumed session, VoiceTutorRealtime replays the restored board through
 * `onWhiteboardCommand` so the parent's canvas state + persistence buffers
 * (page.tsx `whiteboardEventsRef` / `whiteboardCommands`, TutorSession state,
 * the embed's mirror) show the prior figures. Those buffers OUTLIVE a
 * VoiceTutorRealtime instance, so an instance-local "seeded once" ref cannot
 * protect them: any VTR remount while `resumeState` is still set (input-mode
 * or engine toggle in the legacy layout, dev fast-refresh, future refactors)
 * re-fires the seed and the parent appends a full duplicate board — on screen
 * AND into the persisted session (observed: session-1783123067235, whiteboard
 * items 0–12 repeated exactly as 13–25, batch-stamped at two resume times with
 * no intervening brain turn).
 *
 * Invariant: a resume-seed batch is accepted exactly once per guard lifetime;
 * live batches always pass. The guard must live WITH the buffer it protects —
 * each parent holds its own guard in a ref, and resets it exactly where it
 * clears/recreates the buffer (new session start, resume boot).
 *
 * Ship-gate: scripts/test-resume-seed-guard.ts (`npm run test:resume-seed`).
 */

/** Optional metadata on an onWhiteboardCommand batch. */
export interface WhiteboardBatchMeta {
  /** True when this batch is the resume-seed replay of the restored board
   *  (VoiceTutorRealtime's mount-time rehydration), not a live turn batch. */
  resumeSeed?: boolean;
}

/** Per-buffer guard state. Hold in a ref next to the buffer it protects;
 *  reset `seedApplied` to false wherever the buffer itself is cleared. */
export interface ResumeSeedGuard {
  seedApplied: boolean;
}

export function createSeedGuard(): ResumeSeedGuard {
  return { seedApplied: false };
}

/**
 * Returns true when the batch should be applied to the caller's buffers.
 * Live batches (no `resumeSeed` meta) always apply; a resume-seed batch
 * applies once and marks the guard, so a replayed seed (VTR remount) is
 * dropped instead of duplicating the board.
 */
export function acceptWhiteboardBatch(
  guard: ResumeSeedGuard,
  meta?: WhiteboardBatchMeta,
): boolean {
  if (!meta?.resumeSeed) return true;
  if (guard.seedApplied) return false;
  guard.seedApplied = true;
  return true;
}
