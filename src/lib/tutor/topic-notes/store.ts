/**
 * Topic-notes baseline registry.
 *
 * Mirrors the lesson-plan/store.ts pattern: each baseline is a TS seed
 * module imported here and registered in `SEED_BASELINES`. Adding a
 * baseline = importing the seed file + adding the constant to the array.
 * Updating a baseline = editing the seed file and bumping
 * `baselineVersion` inside it.
 *
 * Baselines are immutable at runtime. Per-student overlays live in
 * Mongo (see `apply-overlay.ts` + `src/models/StudentTopicNotes.ts`).
 *
 * `baselineId === planId` (the corresponding lesson plan id), so callers
 * can resolve from a plan id without an extra mapping.
 */

import type { TopicNotesBaseline } from './types';

// ---------------------------------------------------------------------------
// Baseline imports — registered as they're authored.
//
// Phase 1 (AP Macro U4) — calibration baseline shipped; remaining 6 to
// follow via scripts/extract-topic-notes-baselines.ts + manual review:
//   ✓ BASELINE_AP_MACRO_LOANABLE_FUNDS (calibration)
//   - functions-of-money / banking-money-creation / money-market
//   - monetary-policy / financial-assets / nominal-vs-real-interest-rates
// ---------------------------------------------------------------------------

import { BASELINE_AP_MACRO_LOANABLE_FUNDS } from './seeds/ap-macro-u4-loanable-funds';

export const SEED_BASELINES: TopicNotesBaseline[] = [
  BASELINE_AP_MACRO_LOANABLE_FUNDS,
];

const baselinesById = new Map(SEED_BASELINES.map((b) => [b.baselineId, b]));

/** Look up a topic-notes baseline by id. Returns null when not found.
 *  `baselineId === planId`. */
export function getTopicNotesBaseline(baselineId: string): TopicNotesBaseline | null {
  return baselinesById.get(baselineId) ?? null;
}

/** List all registered baselines (defensive copy). */
export function listTopicNotesBaselines(): TopicNotesBaseline[] {
  return [...SEED_BASELINES];
}

/** List baselines for a course (e.g. `'AP Macroeconomics'`). */
export function listTopicNotesBaselinesForCourse(course: string): TopicNotesBaseline[] {
  return SEED_BASELINES.filter((b) => b.course === course);
}

/** List baselines for a specific course + CED unit. Used for the
 *  per-unit reading view (Phase 2) which composes constituent topic
 *  baselines + each student's overlays into a unit-level rendering. */
export function listTopicNotesBaselinesForUnit(
  course: string,
  cedUnit: number,
): TopicNotesBaseline[] {
  return SEED_BASELINES.filter((b) => b.course === course && b.cedUnit === cedUnit);
}
