/**
 * Should a dedup-suppressed re-show scroll to the item it matched?
 *
 * When the brain re-emits a `show_*` for a figure already on the board,
 * the signature dedup drops the command so the board doesn't grow a
 * duplicate. But the brain re-showed it for a reason: it is about to
 * narrate that figure. If the item sits on a page the student isn't
 * looking at, the drop leaves them listening to a description of
 * something off-screen (session-1783693044096, 2026-07-10: the tutor
 * described the photosynthesis diagram at length while the student was
 * two pages away on the Calvin-cycle page).
 *
 * Scroll only when the item is on a DIFFERENT page than the current
 * view. Scrolling on same-page duplicates would yank the viewport on
 * every repeat render — worse than the bug. Unknown pages fail safe to
 * the old silent-drop behaviour.
 */
export function shouldScrollToDedupedItem(args: {
  itemPageTitle: string | undefined;
  currentPageTitle: string;
}): boolean {
  const item = (args.itemPageTitle ?? '').trim().toLowerCase();
  const current = args.currentPageTitle.trim().toLowerCase();
  if (!item || !current) return false;
  return item !== current;
}
