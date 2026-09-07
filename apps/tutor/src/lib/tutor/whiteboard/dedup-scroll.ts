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
  /** Live check 7 (portal-8ed0fb65, 11:00:52Z): the brain re-showed the
   *  problem card to return to it after a long detour ON THE SAME PAGE; the
   *  card sat two screens up and the student kept looking at the detour's
   *  last steps. Items rendered after it on its page = how buried it is;
   *  two or more later items ⇒ scroll. Omitted ⇒ the old same-page rule. */
  itemsAfterOnPage?: number;
}): boolean {
  const item = (args.itemPageTitle ?? '').trim().toLowerCase();
  const current = args.currentPageTitle.trim().toLowerCase();
  if (!item || !current) return false;
  if (item !== current) return true;
  return (args.itemsAfterOnPage ?? 0) >= 2;
}
