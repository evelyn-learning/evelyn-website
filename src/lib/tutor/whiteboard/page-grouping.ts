/**
 * page-grouping.ts — the pure, deterministic decision module for cross-turn
 * whiteboard page grouping. Given a batch of whiteboard commands about to be
 * processed plus the active-page context and a handful of orchestrator
 * signals, it decides whether the batch's teaching content should GROUP onto
 * the active page, open a NEW page, open an overflow CONTINUATION page, or
 * (kill-recovery) PIN to a specific page.
 *
 * Design + rationale: project_tutor_page_grouping_design.md (13 grilled
 * decisions, 2026-06-18). This module owns the entire tiered precedence:
 *
 *   Tier 0 — kill-recovery replace ....... pin to the killed render's page
 *   Tier 1 — structural boundaries ....... new page (beat continuation)
 *              H5 explicit reset · H1 brain new_page (already in batch) ·
 *              H2 segment advance · H6 different primary figure
 *   Tier 2 — continuation / keep ......... group (beat heuristic boundary)
 *              G3 continuation utterance · G6 tutor-same-context
 *   Tier 3 — heuristic boundary .......... new page (H4 topic-shift)
 *   Tier 4 — default ..................... group
 *   post   — overflow .................... soft continuation sub-split
 *
 * Deliberately dependency-light (like turn-pacing.ts): it imports only the
 * two pure helpers from catalog.ts (computeAnchorKey / isPrimaryFigure),
 * which themselves have no runtime deps. No refs, no DOM, no catalog
 * instance — the orchestrator gathers inputs and applies the result. This is
 * what makes the whole feature unit-testable without the model or canvas.
 *
 * RETIRED vs. the old per-turn trigger block (intentional, per design):
 *   - justSolved (Final Answer → next-batch new page): DELETED (subsumed +
 *     was the "find T for this" misfire source).
 *   - "new problem ⇒ new page" (H3): collapses into H6 (different figure).
 *   - redraw → new page: redraw is now a dedup-bypass signal handled in the
 *     orchestrator, NOT a page trigger.
 *   - same-type-different-params dual-emit: subsumed by H6 anchorKey compare
 *     (same subject → replace in place; different → split).
 */

import { computeAnchorKey, isPrimaryFigure, extractCommandTitle } from './catalog';

/** A whiteboard command (loosely typed — we only read `action` + pass the
 *  whole object to computeAnchorKey). */
export interface PageGroupingCommand {
  action: string;
  [k: string]: unknown;
}

/** Read-only view of the active page the orchestrator hands in. */
export interface ActivePageView {
  id: string;
  title: string;
  segmentId?: string;
  /** Subject key of the page anchor (H6 compares against this). Undefined
   *  until a primary figure has landed on the page. */
  anchorKey?: string;
  /** Sum of render weights currently on the page (overflow budget). */
  weightedLoad: number;
  /** Turn index of the page's most recent render (staleness backstop). */
  lastRenderTurn: number;
}

export interface PageGroupingSignals {
  /** H4 topic-shift embedding distance, or null if no shift this turn. */
  topicShiftDistance: number | null;
  /** Tier-2 continuation guard (student said "keep going / next / for this"). */
  continuationGuardActive: boolean;
  /** Tier-2 tutor-same-context (detectTutorSameContext decided same). */
  tutorSameContext: boolean;
  /** A segment advance from a PRIOR turn was deferred and is still pending
   *  (the B1 deferred-flush case). Treated as H2 the moment teaching lands. */
  segmentAdvancePending: boolean;
  /** Tier-0: this batch is a kill-recovery replacement pinned to this page. */
  killRecoveryPinPageId: string | null;
  /** The first teaching command is an organizer-kind show_diagram whose
   *  signature already exists → it WILL dedup-drop. Injecting a page break in
   *  front of a guaranteed-dedup leaves a blank page, so we suppress the
   *  break in that case (mirrors the existing organizer-dedup guard). */
  firstTeachingWillDedup: boolean;
}

export interface PageGroupingInput {
  batch: readonly PageGroupingCommand[];
  /** The student's last utterance (explicit-reset detection). */
  studentText: string;
  activePage: ActivePageView | null;
  currentTurn: number;
  /** Page title to prefer when a segment advance opens the page (H2). */
  segmentTitle?: string;
  signals: PageGroupingSignals;
}

export type PageDecision =
  /** Group onto the active page — no synthetic break (also covers "a newPage
   *  is already in the batch" and "meta-only batch"). */
  | { action: 'none'; reason: string }
  /** Kill-recovery: append onto this exact page id (replace-in-place). */
  | { action: 'pin'; pageId: string; reason: string }
  /** Inject a synthetic newPage before the first teaching command. */
  | { action: 'newPage'; title: string; reason: string; event: string; anchorKey: string | null }
  /** Overflow soft-split: a continuation page sharing the active anchorKey. */
  | { action: 'continuation'; title: string; reason: string; event: string; anchorKey: string | null };

// ---- tunable constants (exported for tests + the orchestrator) ----

/** Weight of a primary figure (graph/diagram/geometry/chart) toward the
 *  per-page overflow budget. */
export const PRIMARY_WEIGHT = 3;
/** Weight of a supporting render (equation/text/card) toward the budget. */
export const SUPPORTING_WEIGHT = 1;
/** Per-page weighted-render budget. ~ one big figure + ~13 light items, or
 *  ~5 figures. Beyond this a grouping batch overflows to a "(cont.)" page.
 *  Pages already scroll, so this is a LAST-RESORT coherence guard against
 *  runaway density, NOT a frequent splitter — the bias is strongly toward
 *  grouping. (Tuned up from 8 after a 2026-06-19 JEE parabola session where a
 *  6-step derivation under a geometry figure hit 8 and orphaned the final-
 *  answer equation onto its own continuation page.) */
export const PAGE_WEIGHT_BUDGET = 16;
/** A page gone this many render-less turns is auto-closed (staleness). */
export const STALE_TURNS = 5;

/** Explicit student board-reset intent (H5). Deliberately narrow so it does
 *  NOT catch "draw a new triangle" / "show me the next problem". */
const RESET_RE =
  /\b(?:clear|wipe|reset|erase)\b[^.?!]{0,20}\b(?:board|whiteboard|page|screen|it|this|that|everything)\b|\bstart\s+(?:over|fresh|a?\s*new\s+page|with\s+a\s+(?:clean|fresh|blank))\b|\b(?:fresh|blank|clean|new)\s+(?:page|board|slate)\b/i;

/** Does this action render teaching content (and therefore warrants a page
 *  decision)? Mirrors the orchestrator's firstTeachingIdx test: any show_*
 *  except the segment card (which is its own thing). */
export function isTeachingRender(action: string): boolean {
  return /^show[A-Z]/.test(action) && action !== 'showSegmentCard';
}

/** Overflow weight of a single teaching command. */
export function weightOfAction(action: string): number {
  return isPrimaryFigure(action) ? PRIMARY_WEIGHT : SUPPORTING_WEIGHT;
}

/** H2 detector: batch contains advance_lesson + a teaching show_* with no
 *  newPage before that show. (Same logic as the old segmentAdvanceWithShow.) */
function segmentAdvanceWithShow(batch: readonly PageGroupingCommand[]): boolean {
  const advanceIdx = batch.findIndex((c) => c.action === 'advanceLesson');
  const firstTeachingIdx = batch.findIndex((c) => isTeachingRender(c.action));
  const newPageIdx = batch.findIndex((c) => c.action === 'newPage');
  return (
    advanceIdx >= 0 &&
    firstTeachingIdx >= 0 &&
    (newPageIdx < 0 || newPageIdx > firstTeachingIdx)
  );
}

/** Title for a freshly-opened page. Priority: segment title (on a segment
 *  advance) > first teaching command's title (via extractCommandTitle, which
 *  handles nested `data.title` etc.) > "Next". */
function pickTitle(
  firstTeaching: PageGroupingCommand | undefined,
  segmentTitle: string | undefined,
  useSegmentTitle: boolean,
): string {
  if (useSegmentTitle && segmentTitle && segmentTitle.trim()) return segmentTitle.trim();
  const extracted = firstTeaching ? extractCommandTitle(firstTeaching) : undefined;
  return (extracted || 'Next').trim() || 'Next';
}

/** "Parabola" → "Parabola (cont.)"; idempotent (won't double-suffix). */
function continuationTitle(title: string): string {
  const base = title.replace(/\s*\(cont\.\)\s*$/i, '').trim();
  return base ? `${base} (cont.)` : '(cont.)';
}

/**
 * The decision. Pure: same inputs → same output.
 */
export function decidePageForBatch(input: PageGroupingInput): PageDecision {
  const { batch, studentText, activePage, currentTurn, segmentTitle, signals } = input;

  // Tier 0 — kill-recovery replace pins in place, suppressing ALL boundaries.
  if (signals.killRecoveryPinPageId) {
    return {
      action: 'pin',
      pageId: signals.killRecoveryPinPageId,
      reason: 'kill-recovery replace — pinned to killed render’s page (Tier 0)',
    };
  }

  // Only teaching content drives a page decision. A meta-only batch
  // (scribble / scroll / highlight / removeItems / advance with no show)
  // never breaks or groups — it leaves the active page as-is.
  const firstTeachingIdx = batch.findIndex((c) => isTeachingRender(c.action));
  if (firstTeachingIdx < 0) {
    return { action: 'none', reason: 'meta-only batch — no teaching content, no page decision' };
  }
  const firstTeaching = batch[firstTeachingIdx];

  // H1 — an explicit newPage (brain-emitted, or a synthetic one already
  // prepended) is the page break; don't inject a second one.
  if (batch.some((c) => c.action === 'newPage')) {
    return { action: 'none', reason: 'explicit newPage already present in batch (H1)' };
  }

  // First PRIMARY figure (page-anchor candidate) and its subject key.
  const firstPrimaryCmd = batch.find((c) => isPrimaryFigure(c.action));
  const incomingAnchorKey = firstPrimaryCmd
    ? computeAnchorKey(firstPrimaryCmd.action, firstPrimaryCmd)
    : null;

  const makeNewPage = (event: string, reason: string, useSegmentTitle = false): PageDecision => {
    // Organizer blank-page guard: don't break in front of a guaranteed-dedup.
    if (signals.firstTeachingWillDedup) {
      return {
        action: 'none',
        reason: `${reason} — suppressed (first teaching organizer will dedup; break would leave a blank page)`,
      };
    }
    return {
      action: 'newPage',
      title: pickTitle(firstTeaching, segmentTitle, useSegmentTitle),
      reason,
      event,
      anchorKey: incomingAnchorKey,
    };
  };

  // No active page yet → open the first one.
  if (!activePage) {
    return makeNewPage('auto_new_page_first', 'no active page — opening the first page');
  }

  // Tier 1 — structural boundaries (beat continuation & grouping).
  const explicitReset = RESET_RE.test(studentText);
  const segmentAdvance = signals.segmentAdvancePending || segmentAdvanceWithShow(batch);
  // NOTE: H6 (different-primary-figure split) was REMOVED 2026-06-19 in favor
  // of TOPIC/SEGMENT-level grouping (the user's chosen model): different
  // figures of the same topic — a parabola's graph, its focus-directrix
  // construction, its derivation — all stay on ONE page. Figures NEVER force a
  // page break. Splits happen only on a genuine TOPIC boundary: segment
  // advance (H2), topic-shift (H4), explicit reset (H5), or overflow (H7).
  // Brain new_page is advisory (stripped in the orchestrator), so it's not a
  // boundary here either. (anchorsDiverge / computeAnchorKey are retained in
  // catalog.ts for the page subject anchor + potential Board Map use, but the
  // page-break decision no longer consults them.)
  if (explicitReset) {
    return makeNewPage('auto_new_page_reset', `explicit student reset "${studentText.slice(0, 40)}" (H5)`);
  }
  if (segmentAdvance) {
    return makeNewPage('auto_new_page_segment_advance', 'segment advance with teaching content (H2)', true);
  }

  // Tier 2 — continuation / keep (beat the heuristic boundary below).
  if (signals.continuationGuardActive) {
    return { action: 'none', reason: 'continuation guard — group onto active page (Tier 2)' };
  }
  if (signals.tutorSameContext) {
    return { action: 'none', reason: 'tutor same-context — group onto active page (Tier 2)' };
  }

  // Tier 3 — heuristic boundary: topic-shift.
  if (signals.topicShiftDistance != null) {
    return makeNewPage(
      'auto_new_page',
      `topic shift (dist=${signals.topicShiftDistance.toFixed(3)}) (H4)`,
    );
  }

  // Tier 4 — default group, with staleness then overflow backstops.
  const renderlessTurns = currentTurn - activePage.lastRenderTurn;
  if (renderlessTurns >= STALE_TURNS) {
    return makeNewPage(
      'auto_new_page_stale',
      `active page stale — ${renderlessTurns} render-less turns (≥ ${STALE_TURNS})`,
    );
  }

  // Overflow: would grouping push the page past its weighted budget? If so,
  // soft-split to a continuation page that SHARES the subject anchorKey.
  const batchWeight = batch.reduce(
    (sum, c) => (isTeachingRender(c.action) ? sum + weightOfAction(c.action) : sum),
    0,
  );
  if (activePage.weightedLoad + batchWeight > PAGE_WEIGHT_BUDGET) {
    return {
      action: 'continuation',
      title: continuationTitle(activePage.title),
      reason: `overflow — load ${activePage.weightedLoad} + ${batchWeight} > ${PAGE_WEIGHT_BUDGET}`,
      event: 'auto_new_page_overflow',
      anchorKey: activePage.anchorKey ?? null,
    };
  }

  return { action: 'none', reason: 'default — group onto active page (Tier 4)' };
}
