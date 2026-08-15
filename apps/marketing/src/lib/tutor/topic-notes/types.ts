/**
 * Topic Notes — per-student dynamic study notes.
 *
 * Two storage tiers:
 *   - **Baseline** (TS seed files in `seeds/`, registered in `store.ts`):
 *     authored once per CED topic, immutable at runtime, version-controlled.
 *     Read live on every render — improvements propagate to all students.
 *
 *   - **Overlay** (Mongo, per student per baseline): additive deltas the
 *     brain emits during sessions via `expand_topic_notes_theory`,
 *     `add_topic_notes_method`, `add_topic_notes_pointer`. Lazy-created
 *     on first session-in-topic or first notes view.
 *
 * `baselineId === planId` (e.g. `evelyn.ap.macro.loanable-funds.v1`).
 *
 * Render = baseline content + overlay deltas merged at read time. See
 * `resolve.ts` for the merge implementation and `RenderedTopicNotes`
 * below for the merged output shape.
 *
 * See `project_topic_notes_initiative.md` for the 11 grilled design
 * decisions. Read it before changing this file.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Provenance reference for a baseline entry or overlay (audit trail).
 *  Free-form; producers populate the fields that apply. */
export interface SourceRef {
  /** Coarse classification — drives UI grouping when rendered. */
  type?: 'plan' | 'textbook' | 'frq' | 'ced' | 'other';
  /** When sourced by extracting from a lesson plan. */
  planId?: string;
  /** When sourced from a specific plan segment. */
  segmentId?: string;
  /** Textbook citation. */
  book?: string;
  chapter?: string;
  page?: number;
  /** Exam reference, e.g. "AP Macro 2023". */
  exam?: string;
  /** FRQ identifier within the exam, e.g. "FRQ 2". */
  frqNumber?: string;
  /** External link when applicable. */
  url?: string;
}

/** Spec for an inline diagram rendered via the existing diagram solver
 *  (`src/lib/tutor/diagrams/`). Type values are the kinds registered in
 *  the diagram catalog, e.g. `'loanable_funds'`, `'money_market'`,
 *  `'aggregate_demand_supply'`. Params shape depends on `type`. */
export interface DiagramSpec {
  type: string;
  params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Entry shapes (used by baseline content)
// ---------------------------------------------------------------------------

/** Theory entry — concept / formula / definition / law / framework /
 *  shifter-list / identity, anchored to a single LO. `loId: null` is
 *  reserved for cross-LO content (rare in baselines, common in overlays
 *  where prereq-refreshers don't map to an LO of the active plan). */
export interface TheoryEntry {
  /** LO id from the corresponding lesson plan. `null` = cross-LO. */
  loId: string | null;
  /** Free-form classification — drives renderer grouping/styling. Common
   *  values: `'definition' | 'formula' | 'framework' | 'shifter-list' |
   *  'identity' | 'theorem' | 'law'`. */
  kind?: string;
  /** Optional headline shown above content (e.g. "Crowding out"). */
  title?: string;
  /** Markdown body. KaTeX for inline math (`$...$`) and display (`$$...$$`). */
  content: string;
  /** Optional inline diagram via the existing diagram solver. */
  diagram?: DiagramSpec;
  /** Provenance — where this entry came from. */
  sources?: SourceRef[];
}

/** Method entry — a procedural recipe for solving a problem type.
 *  Methods span LOs naturally; `relatedLoIds` is a soft cross-reference. */
export interface MethodEntry {
  /** Headline, e.g. "Analyze a fiscal-policy shock on Loanable Funds". */
  title: string;
  /** Optional condition — when this method applies. */
  when_to_use?: string;
  /** Ordered procedure. ≥2 steps recommended. */
  steps: string[];
  /** Optional short worked example illustrating the method. */
  example?: { problem: string; solution: string };
  /** Optional inline diagram. */
  diagram?: DiagramSpec;
  /** Soft cross-reference to LOs this method engages. */
  relatedLoIds?: string[];
  sources?: SourceRef[];
}

/** Pointer entry — tactical reminder, gotcha, FRQ-vocabulary tip, edge
 *  case, common error. Episodic and append-mostly. */
export interface PointerEntry {
  /** Markdown body, recommended ≤300 chars. */
  content: string;
  /** Free-form classification — drives renderer grouping/styling. Common
   *  values: `'gotcha' | 'frq-vocab' | 'edge-case' | 'common-error' |
   *  'tip'`. */
  kind?: string;
  /** Soft cross-reference to LOs. */
  relatedLoIds?: string[];
  sources?: SourceRef[];
}

// ---------------------------------------------------------------------------
// Baseline (global, TS-seeded, immutable at runtime)
// ---------------------------------------------------------------------------

/** A topic's baseline notes — authored once per CED topic, lives as a
 *  TS seed file in `seeds/`, registered in `store.ts`. Immutable at
 *  runtime; updates ship as code changes. */
export interface TopicNotesBaseline {
  /** Stable id; matches the corresponding lesson plan's id. */
  baselineId: string;
  /** Course name, e.g. "AP Macroeconomics". */
  course: string;
  /** CED unit number (1..N). */
  cedUnit: number;
  /** CED topic identifier, e.g. "4.6". */
  cedTopic: string;
  /** CED topic title, e.g. "The Loanable Funds Market". */
  cedTitle: string;
  /** Lesson plan id (same as `baselineId`, kept explicit for clarity). */
  planId: string;
  theory: TheoryEntry[];
  methods: MethodEntry[];
  pointers: PointerEntry[];
  /** Bumped when content materially changes. Informational in v1; not
   *  used for migration/diffing yet. */
  baselineVersion: number;
  /** ISO date the baseline was last touched in code. */
  lastUpdatedAt: string;
  /** Top-level provenance for the baseline as a whole. Per-entry
   *  `sources` provides finer-grained citation. */
  sources?: SourceRef[];
  /** True when this baseline was derived in-memory from a stored/
   *  generated lesson plan (`derive-baseline.ts`) rather than authored as
   *  a TS seed file. Additive/optional — absent (falsy) for every
   *  authored baseline, so existing consumers are unaffected. Informs
   *  future UI ("auto-generated from your session" framing) without
   *  requiring one today. */
  derived?: boolean;
}

// ---------------------------------------------------------------------------
// Overlay (per-student, mutable, in Mongo)
// ---------------------------------------------------------------------------

/** Theory overlay — fired by the brain via `expand_topic_notes_theory`.
 *  Three kinds:
 *    - `'expansion'`: adds depth to a baseline LO entry; rendered as an
 *      inline callout under the matching baseline entry.
 *    - `'prereq-refresher'`: cross-LO refresher on a prerequisite concept
 *      (paired with `flag_prerequisite_gap` in same turn); `loId` is null
 *      and `conceptLabel` is set; rendered in a dedicated subsection at
 *      the top of theory.
 *    - `'student-add'`: cross-cutting addition that doesn't anchor to one
 *      LO; rendered in a "From your sessions" subsection at the bottom. */
export interface TheoryOverlay {
  /** Stable id for delete operations; assigned at write time. */
  overlayId: string;
  /** Per-plan LO id when `kind === 'expansion'`. `null` for
   *  `prereq-refresher` and `student-add`. */
  loId: string | null;
  kind: 'expansion' | 'prereq-refresher' | 'student-add';
  /** Required when `kind === 'prereq-refresher'`. Free-form English label
   *  the brain emitted (mirrors `flag_prerequisite_gap`'s shape). */
  conceptLabel?: string;
  /** Optional headline shown above content. */
  title?: string;
  /** Markdown body. */
  content: string;
  /** Optional inline diagram. */
  diagram?: DiagramSpec;
  /** Session in which the overlay was first added. */
  addedInSessionId: string;
  /** ISO timestamp of first add. */
  addedAt: string;
  /** Brain's reason for adding (telemetry / future "why is this here?" UI). */
  rationale?: string;
  /** Links to a `GapEntry.id` when the brain fired a gap tool in the
   *  same turn that triggered this overlay. Enables traceability. */
  sourceGapId?: string;
  /** Sessions that re-fired the same content (dedup-collapsed). The
   *  renderer can show "Reinforced: May 5, May 8, May 10". */
  reinforcedInSessionIds?: string[];
  /** ISO timestamp of the most recent reinforcement (or initial add). */
  lastReinforcedAt?: string;
}

/** Method overlay — fired by the brain via `add_topic_notes_method`.
 *  `alternativeTo` (optional) names a baseline method this complements;
 *  the renderer sub-numbers it (e.g. "Method 2a") under the baseline
 *  method when present. */
export interface MethodOverlay {
  overlayId: string;
  title: string;
  when_to_use?: string;
  steps: string[];
  example?: { problem: string; solution: string };
  diagram?: DiagramSpec;
  /** Title of the baseline method this complements. Soft reference (no
   *  schema-level FK); renderer matches by title. */
  alternativeTo?: string;
  relatedLoIds?: string[];
  addedInSessionId: string;
  addedAt: string;
  rationale?: string;
  sourceGapId?: string;
  reinforcedInSessionIds?: string[];
  lastReinforcedAt?: string;
}

/** Pointer overlay — fired by the brain via `add_topic_notes_pointer`. */
export interface PointerOverlay {
  overlayId: string;
  content: string;
  kind?: string;
  relatedLoIds?: string[];
  addedInSessionId: string;
  addedAt: string;
  rationale?: string;
  sourceGapId?: string;
  reinforcedInSessionIds?: string[];
  lastReinforcedAt?: string;
}

/** A student's overlays for one CED topic. Stored in Mongo; one document
 *  per student per baseline. Composite `_id` is `${studentId}::${baselineId}`. */
export interface StudentTopicNotes {
  /** Composite key. */
  id: string;
  studentId: string;
  /** == planId. */
  baselineId: string;
  /** Snapshot of `baselineVersion` at the time the overlay was created.
   *  Informational in v1. */
  baselineVersionAtFork?: number;
  theoryOverlays: TheoryOverlay[];
  methodsAdds: MethodOverlay[];
  pointersAdds: PointerOverlay[];
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export const STUDENT_TOPIC_NOTES_SCHEMA_VERSION = 1;

// ---------------------------------------------------------------------------
// Rendered (output of resolve.ts — baseline + overlays merged for view)
// ---------------------------------------------------------------------------

/** Rendered theory overlay — the storage shape plus renderer hints. */
export type RenderedTheoryOverlay = TheoryOverlay;
export type RenderedMethodOverlay = MethodOverlay;
export type RenderedPointerOverlay = PointerOverlay;

/** Theory section, grouped per the Q8a render layout:
 *    - `prereqRefreshers` (top): cross-LO prereq-refresher overlays
 *    - `perLO` (middle): baseline entries grouped by loId, with their
 *      `expansion` overlays attached
 *    - `studentAdds` (bottom): cross-LO student-add overlays
 *    - `orphans` (bottom-most): overlays anchored to an `loId` no longer
 *      present in the baseline (preserved per Q8f, never deleted) */
export interface RenderedTheorySection {
  prereqRefreshers: RenderedTheoryOverlay[];
  perLO: Array<{
    loId: string;
    /** Baseline entries for this LO (typically 1 but can be multiple). */
    baseline: TheoryEntry[];
    /** `expansion`-kind overlays anchored to this loId. */
    expansions: RenderedTheoryOverlay[];
  }>;
  studentAdds: RenderedTheoryOverlay[];
  orphans: RenderedTheoryOverlay[];
}

/** Methods section — baseline first, then overlays. The renderer is
 *  expected to detect `alternativeTo` and sub-number under the matching
 *  baseline method (e.g. "Method 2a") when present. */
export interface RenderedMethodsSection {
  baseline: MethodEntry[];
  overlays: RenderedMethodOverlay[];
}

/** Pointers section — baseline first, then overlays in a separate
 *  "From your sessions" subsection (per Q8c). */
export interface RenderedPointersSection {
  baseline: PointerEntry[];
  overlays: RenderedPointerOverlay[];
}

/** What `resolveTopicNotes(studentId, baselineId)` returns. */
export interface RenderedTopicNotes {
  baselineId: string;
  course: string;
  cedUnit: number;
  cedTopic: string;
  cedTitle: string;
  baselineVersion: number;
  theory: RenderedTheorySection;
  methods: RenderedMethodsSection;
  pointers: RenderedPointersSection;
}

/** What `resolveUnitTopicNotes(studentId, course, cedUnit)` returns — a whole
 *  CED unit's notes, the per-topic `RenderedTopicNotes` composed in cedTopic
 *  order. Pure composition; each entry is exactly the per-baseline render.
 *  Mirrors the contract's `RenderedUnitNotes` (portal-contract v1.3.0). */
export interface RenderedUnitNotes {
  course: string;
  cedUnit: number;
  /** Human unit title when known (else absent). */
  unitTitle?: string;
  topics: RenderedTopicNotes[];
}
