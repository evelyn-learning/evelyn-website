/**
 * The figure that belongs to a homework problem, found again when the tutor
 * moves back to that problem.
 *
 * 2026-10-20 (GAC Geometry upload portal-4cc98574, 23:15:10Z): the tutor
 * went back to problem 2 ("Looking at the figure, (2x+10)° and (3x−5)° sit on
 * the same side…") while the board showed page 4 of 4 — problem 3's working.
 * Problem 2's figure sat on page 2. The student had no figure to look at.
 *
 * The board already knows how to bring an item back into view when the
 * brain re-shows it (dedup → scrollTo, dedup-scroll.ts). A problem move is
 * the same situation without the re-show: find the problem's latest primary
 * figure on the board and let the caller scroll to it when it is off the
 * current page. Pure: the caller passes the catalog's items.
 */

import { isPrimaryFigure } from './catalog';

export interface FigureItemLike {
  itemId: string;
  order: number;
  action: string;
  /** The command's own title ("Problem 2: Parallel Lines Cut by Transversal"). */
  title?: string;
  /** The page it rendered on ("Problem 2 of 8", or the figure's title). */
  pageTitle?: string;
  pageId?: string;
}

/** Does a title name problem `n`? "Problem 2", "Problem 2 of 8",
 *  "Problem 2: …", "Q2", "#2", "Question 2 (b)" — and not "Problem 12" or
 *  "Problem 2.5". */
export function titleNamesProblem(title: string | undefined, n: number): boolean {
  if (!title || !Number.isInteger(n) || n < 1) return false;
  const re = new RegExp(`^\\s*(?:problem|question|q|#|exercise|ex\\.?)\\s*#?${n}(?![\\d.])`, 'i');
  return re.test(title);
}

/** The latest primary figure on the board that names problem `n` — by its
 *  own title first, else by the title of the page it is on. Null when the
 *  board holds no figure for that problem (nothing to scroll to; the tutor
 *  draws one if it needs one). */
export function homeworkFigureFor<T extends FigureItemLike>(items: ReadonlyArray<T>, n: number): T | null {
  let best: T | null = null;
  for (const it of items) {
    if (!isPrimaryFigure(it.action)) continue;
    if (!titleNamesProblem(it.title, n) && !titleNamesProblem(it.pageTitle, n)) continue;
    if (!best || it.order > best.order) best = it;
  }
  return best;
}
