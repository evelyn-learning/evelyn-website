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

/** Actions that render nothing new by themselves — bookkeeping/markers, not
 *  teaching content. Mirrors WhiteboardCanvas's own META set. */
const DEFAULT_META_ACTIONS = new Set([
  'newPage', 'clear', 'goToPage', 'removeItems', 'reviseItems', 'scribble', 'link', 'scrollTo', 'handwrite',
]);
const DEFAULT_NAV_ACTIONS = new Set(['goToPage', 'scrollTo']);

/**
 * Does this batch of newly-added command actions end on an explicit nav
 * (goToPage / scrollTo) that lands AFTER the newest teaching render in the
 * SAME batch? If so, the scrollTo/goToPage-handling effects already
 * positioned the view to the nav's target — following the render too would
 * fight that explicit, more-recent intent (2026-07-08 session
 * portal-9549e3af: a turn shaped [scrollTo(earlier figure) … scribble …
 * NEW render] used to leave the view parked on the earlier page).
 *
 * Order-only: whichever of {newest nav, newest render} occurs LATER in
 * `addedActions` wins. A nav that precedes the render (or isn't present at
 * all) never suppresses.
 *
 * Task X5 fix-wave (Finding 1): this function must only ever be called
 * with the SLICE of actions added since the caller's own last-processed
 * watermark (see WhiteboardCanvas's `prevFollowCountRef`) — never the full
 * command log. A batch containing only a fresh render (no nav in THIS
 * slice) can never be suppressed here, by construction: a stale nav from
 * an earlier, already-processed turn is not part of `addedActions` and so
 * cannot silently pin a later turn's brand-new reveal (the user's
 * incident: a try-yourself ANSWER revealed on page 3 while the student's
 * view stayed parked on page 2, with nothing in that turn navigating
 * anywhere). Scoping the watermark correctly is the caller's job; this
 * function is the pure "given this slice, does the trailing nav win" call,
 * kept separate so the order logic is script-testable without mounting
 * React.
 */
export function trailingNavSuppressesFollow(
  addedActions: readonly string[],
  navActions: ReadonlySet<string> = DEFAULT_NAV_ACTIONS,
  metaActions: ReadonlySet<string> = DEFAULT_META_ACTIONS,
): boolean {
  let lastNav = -1;
  let lastRender = -1;
  for (let k = addedActions.length - 1; k >= 0; k--) {
    const a = addedActions[k];
    if (lastNav < 0 && navActions.has(a)) lastNav = k;
    if (lastRender < 0 && !metaActions.has(a)) lastRender = k;
    if (lastNav >= 0 && lastRender >= 0) break;
  }
  return lastNav >= 0 && lastNav > lastRender;
}
