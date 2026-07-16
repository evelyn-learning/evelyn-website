/**
 * Should a NEW tutor-rendered board item pull the student's view to its page?
 *
 * Task X5 evidence: the tutor revealed a try-yourself ANSWER as a new item
 * on page 3 while the student was shown page 2 — the board never followed,
 * so the student watched blank page 2 while the tutor narrated content it
 * could not see. The honest default is "yes, follow" — the tutor is
 * speaking about whatever it just drew, so leaving the student behind is
 * worse than a jump cut.
 *
 * But an unconditional jump would fight a student who, on their OWN
 * initiative, just flipped back a page to re-read something, tapped an
 * item, or is mid-stroke with the pen — a render landing elsewhere a beat
 * later shouldn't yank the view out from under them. Anti-yank grace: if
 * the student INTERACTED with the board (page flip, pen stroke, panel tap
 * — see WhiteboardCanvas's `markInteraction`) within `graceMs`, hold the
 * current page; otherwise follow the new render.
 *
 * Deliberately silent on WHERE `targetIndex` came from — the caller (the
 * view-follow effect in WhiteboardCanvas.tsx) resolves that by the new
 * command's stable id. This function is the pure "follow or hold" call
 * only, kept separate so it's script-testable without mounting React.
 */
export function shouldFollowNewRender(args: {
  /** Page the new render landed on. */
  targetIndex: number;
  /** Page the student is currently viewing. */
  currentIndex: number;
  /** Epoch ms of the student's last board interaction, or null if none yet
   *  this session. */
  lastInteractionAt: number | null;
  /** Epoch ms "now" — passed in (not read internally) so this stays pure
   *  and testable without faking the clock. */
  now: number;
  /** Anti-yank grace window. Defaults to 10s per the X5 brief. */
  graceMs?: number;
}): boolean {
  const { targetIndex, currentIndex, lastInteractionAt, now } = args;
  const graceMs = args.graceMs ?? 10_000;
  // Already there — nothing to follow (also guards against a false
  // "yank" reading when the new render happens to land on the current page).
  if (targetIndex === currentIndex) return false;
  if (lastInteractionAt != null && now - lastInteractionAt < graceMs) return false;
  return true;
}
