/**
 * A scribble must not yank the board to another page.
 *
 * Live 2026-10-06 (portal-897212b5 @1063s and @1160s). The tutor painted a
 * graph on a new page and, in the same turn, called tutor_scribble on
 * "origin". The catalog resolver is board-wide and newest-first; the graph
 * had no "origin" feature, so the match was the origin of a coordinate plane
 * on a page drawn eight minutes earlier. The orchestrator then injected its
 * auto page-switch + scroll before the scribble, and the student — who had
 * just asked to be shown the shaded solution — was moved off the graph to an
 * old page, twice.
 *
 * Rule: a mark lands on what the student is looking at. "Looking at" is the
 * page this turn painted onto (the canvas follows new content) or, when the
 * turn painted nothing, the catalog's active page. When the board-wide match
 * is on a different page:
 *   1. prefer a matching feature on a figure painted THIS turn,
 *   2. else a matching feature anywhere on the page in view,
 *   3. else, if the brain named the page itself (`page: N`) and this turn
 *      painted nothing, let it through — that is deliberate navigation,
 *   4. else drop the scribble and tell the brain why on its next turn.
 *
 * Dropping is silent to the student by design (same as every other scribble
 * miss in the orchestrator): a mark is a soft aid, the narration stands on
 * its own, and a same-turn rejection would start a retry with overlapping
 * audio. The advisory rides the existing `<unrealized_marks>` block.
 *
 * Pure decision over the catalog; exercised by scripts/test-scribble-page-policy.ts.
 */

import type { ResolveResult, ResolveSuccess, WhiteboardCatalog } from './catalog';

export type ScribblePagePlan =
  | { action: 'keep' }
  | { action: 'retarget'; result: ResolveSuccess; why: 'painted_this_turn' | 'page_in_view'; fromItemId: string }
  | { action: 'drop'; advisory: string; detail: string };

/** Actions that are not board content (they never define "the page this turn
 *  painted onto"). */
const NON_CONTENT_ACTIONS: ReadonlySet<string> = new Set(['scribble', 'handwrite', 'link', 'scrollTo', 'newPage']);

export function planScribbleTarget(
  catalog: WhiteboardCatalog,
  raw: string,
  resolved: ResolveResult,
  opts: { explicitPage?: boolean } = {},
): ScribblePagePlan {
  if (!resolved.ok) return { action: 'keep' };
  const target = catalog.getItem(resolved.itemId);
  if (!target?.pageId) return { action: 'keep' };

  const turn = catalog.getCurrentTurn();
  const items = catalog.getItems();
  const paintedThisTurn = items.filter(
    (it) => it.renderedAtTurn === turn && !!it.pageId && !NON_CONTENT_ACTIONS.has(it.action),
  );
  // The page the student will be on when this mark paints: where this turn's
  // newest content landed, else the active page.
  const newestPainted = paintedThisTurn.reduce<typeof paintedThisTurn[number] | null>(
    (best, it) => (!best || it.order > best.order ? it : best), null,
  );
  const homePageId = newestPainted?.pageId ?? catalog.getActivePageId();
  if (!homePageId) return { action: 'keep' };
  if (target.pageId === homePageId) return { action: 'keep' };

  // 1. A figure painted this turn (on the home page) that has the feature.
  const justPainted = new Set(paintedThisTurn.filter((it) => it.pageId === homePageId).map((it) => it.itemId));
  const onJustPainted = justPainted.size > 0 ? catalog.resolveTargetWithin(raw, justPainted) : null;
  if (onJustPainted && onJustPainted.scribbleable) {
    return { action: 'retarget', result: onJustPainted, why: 'painted_this_turn', fromItemId: resolved.itemId };
  }
  // 2. Anything on the page in view.
  const onPage = new Set(items.filter((it) => it.pageId === homePageId).map((it) => it.itemId));
  const inView = onPage.size > 0 ? catalog.resolveTargetWithin(raw, onPage) : null;
  if (inView && inView.scribbleable) {
    return { action: 'retarget', result: inView, why: 'page_in_view', fromItemId: resolved.itemId };
  }
  // 3. Deliberate navigation: the brain named the page and painted nothing.
  if (opts.explicitPage && paintedThisTurn.length === 0) return { action: 'keep' };

  // 4. Drop, with something the brain can act on.
  const pages = catalog.getPageIndex();
  const targetPage = pages.find((p) => p.id === target.pageId);
  const where = targetPage ? `page ${targetPage.number} "${targetPage.title}"` : 'an earlier page';
  return {
    action: 'drop',
    detail: `"${raw}" → ${resolved.itemId} on ${where}`,
    advisory:
      `${raw} (the only match is on ${where}, not on the page the student is looking at — a mark never switches pages by itself, so it was not drawn. ` +
      `Mark a feature of the figure on the current page instead, or pass that page number in \`page\` on a turn where you are not also drawing something new)`,
  };
}

/** A repeat mark: same item, same feature, same shape — whatever its label or
 *  colour. Two ticks on one point with slightly different captions read as
 *  clutter, not as two ideas (portal-897212b5: "test point", then
 *  "test point (0,0)" on the same origin). */
export function isRepeatScribble(
  prior: ReadonlyArray<unknown>,
  next: { targetId?: unknown; targetFeature?: unknown; shape?: unknown },
): boolean {
  if (!next.targetId || !next.targetFeature) return false;
  return prior.some((c) => {
    if (!c || typeof c !== 'object') return false;
    const p = c as { action?: unknown; targetId?: unknown; targetFeature?: unknown; shape?: unknown };
    return p.action === 'scribble'
      && p.targetId === next.targetId
      && p.targetFeature === next.targetFeature
      && (p.shape ?? null) === (next.shape ?? null);
  });
}
