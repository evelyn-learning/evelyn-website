/**
 * Keep-validated-on-kill decision (robustness track, work-queue #5 + #7).
 *
 * On a content kill / give-up the orchestrator used to roll back EVERY render
 * the killed attempt(s) painted. But a rejected render never paints (it's
 * rejected at validation before dispatch), so what actually got removed was
 * collateral content that had ALREADY PASSED validation — e.g. wolfram-correct
 * tangent equations that were merely in the same turn as a failed figure.
 * (Confirmed empirically 2026-06-20: an e2e give-up rolled back two validated
 * `showEquation` renders.)
 *
 * This module narrows the rollback: a candidate (painted, killed-attempt)
 * render is SWEPT only if a later render SUPERSEDES it — i.e. another render
 * shares its supersession SLOT with a strictly-higher emission order (a
 * later, same-purpose redraw). Otherwise it is KEPT. The slot is computed by
 * the caller:
 *   - figure renders  → `fig:<figure-category>:<pageId>` (two same-category
 *     figures on one page = a retry of the same figure → keep the latest,
 *     sweep the stale; this is what catches the two-BSTs pile-up). Scoped to
 *     same-turn kill-recovery candidates, so "same category + page" reliably
 *     means "the same figure being retried", not two coexisting figures
 *     (page-grouping puts genuinely-distinct figures on distinct pages).
 *   - non-figure renders (equations / text / notes / tables) → a unique slot
 *     (e.g. `uniq:<id>`) so they never collide and are ALWAYS kept; distinct
 *     formulas legitimately coexist.
 *
 * Pure + side-effect-free so it can be unit-tested (test:kill-keep) without
 * the catalog / React refs.
 */

export interface KillRenderDesc {
  /** Catalog itemId of the render. */
  id: string;
  /** Supersession slot (see module doc). Same slot + higher order ⇒ supersede. */
  slot: string;
  /** Emission order this session (higher = later). */
  order: number;
}

export interface KillKeepResult {
  /** Candidate ids to KEEP on the board (validated, not superseded). */
  keep: string[];
  /** Candidate ids to SWEEP (a later same-slot render superseded them). */
  sweep: string[];
}

/**
 * Decide which CANDIDATE killed renders to keep vs sweep.
 *
 * @param candidates the killed-attempt renders eligible for rollback.
 * @param context    all renders to consider as potential superseders — pass
 *                   the full current board (candidates included). A candidate
 *                   is swept iff `context` holds a strictly-higher-order render
 *                   in the same slot. Older board content has a lower order and
 *                   so can never trigger a (false) sweep.
 */
export function decideKillKeep(
  candidates: KillRenderDesc[],
  context: KillRenderDesc[],
): KillKeepResult {
  const maxOrderBySlot = new Map<string, number>();
  for (const r of context) {
    const cur = maxOrderBySlot.get(r.slot);
    if (cur === undefined || r.order > cur) maxOrderBySlot.set(r.slot, r.order);
  }
  const keep: string[] = [];
  const sweep: string[] = [];
  for (const c of candidates) {
    const maxInSlot = maxOrderBySlot.get(c.slot);
    // A strictly-later render shares the slot → this one is stale → sweep.
    if (maxInSlot !== undefined && c.order < maxInSlot) sweep.push(c.id);
    else keep.push(c.id);
  }
  return { keep, sweep };
}
