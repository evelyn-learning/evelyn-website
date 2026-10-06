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

// ── Answer-revealing kills (2026-10-06) ─────────────────────────────────────
//
// Live, portal-897212b5 @229s. The tutor asked "solid or dashed?"; the student
// said "Yes."; the attempt answered "Right. Dashed line…" and was killed
// (bare_assent_praise). Its show_equation — "⇒ dashed boundary line" — arrived
// after the kill, was dispatched anyway ("renders deliberately still
// dispatch"), kept by the rule above (a non-figure render has a unique slot,
// so it is ALWAYS kept), and painted while the retry was asking "Which do you
// mean — solid, or dashed?". The board gave the answer away.
//
// Keep-validated exists for a different failure: validated content that was
// merely COLLATERAL to a later tool's rejection (a wolfram-correct equation
// in the same turn as a failed figure). It never asked WHY the attempt died.
// When an attempt is killed because its SPEECH asserted a verdict, an assent
// or an answer the student had not earned, its board content belongs to that
// same assertion — it is the conclusion, written down. Those renders are
// discarded unless the retry re-emits them (the confirm path removes a
// re-emitted render from the candidate set before this decision runs).

/** Rejection kinds that mean "the attempt asserted a verdict / answer the
 *  student had not earned". Content and structure kills (a false arithmetic
 *  claim, a narration that disagrees with its own card, a missing required
 *  phrase, an incomplete turn) are NOT here: their collateral renders keep
 *  today's keep-validated treatment. */
export const ANSWER_REVEALING_KILL_ACTIONS: ReadonlySet<string> = new Set([
  'bare_assent_praise',
  'nonanswer_praise',
  'verdict_opener',
  'false_praise_opener',
  'praise_contradiction',
  'praise_echo_mismatch',
  'precheck_verdict_contradiction',
  'contradiction_inversion',
  'denied_answer_reversal',
  'inverse_verdict_false_denial',
  'false_simplification_denial',
  'false_final_assertion',
  'try_yourself_answer_reveal',
]);

/** True when any of the attempt's rejections is a verdict / assent kill. */
export function isAnswerRevealingKill(rejections: ReadonlyArray<{ action: string }> | null | undefined): boolean {
  return !!rejections && rejections.some((r) => ANSWER_REVEALING_KILL_ACTIONS.has(r?.action ?? ''));
}

/** Tools whose output is board CONTENT (as opposed to lesson state, marks on
 *  existing content, or bookkeeping). Only these are withheld / swept. */
export function isAnswerBearingRenderTool(toolName: string): boolean {
  const n = toolName ?? '';
  if (!n.startsWith('show_')) return n === 'tutor_handwrite';
  return true;
}

/**
 * Split the end-of-call kill-recovery candidates: ids rendered by an attempt
 * that died of an answer-revealing kill are swept outright; the rest go to
 * `decideKillKeep` as before.
 */
export function splitAnswerRevealingKilled(
  staleIds: ReadonlyArray<string>,
  answerRevealKilledIds: ReadonlySet<string>,
): { discard: string[]; rest: string[] } {
  const discard: string[] = [];
  const rest: string[] = [];
  for (const id of staleIds) (answerRevealKilledIds.has(id) ? discard : rest).push(id);
  return { discard, rest };
}
