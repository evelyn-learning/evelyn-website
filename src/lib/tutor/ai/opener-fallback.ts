/**
 * Task B3 — fail-to-simple opener render fallback (pure helpers).
 *
 * On the flag-gated proactive-opener path (NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER,
 * see opening-behavior.ts + task-B2/B3 briefs), if the tutor's opening turn
 * produces NO valid whiteboard render, the orchestrator paints ONE clean
 * minimal visual so the student never faces a blank board on their first
 * impression, while the spoken opener still plays.
 *
 * Primitive choice — WhiteboardCommand action 'handwrite':
 *   - `validateToolCall` (src/lib/tutor/whiteboard/validate-tool-call.ts) only
 *     imposes semantic checks on 'showtable' (non-empty rows) and
 *     'showmolecule' (non-empty smiles); every other action — including
 *     'handwrite' — falls through to `{ ok: true }` unconditionally. There is
 *     no dedicated handwrite validator anywhere in src/lib/tutor/whiteboard or
 *     src/lib/tutor/diagrams (grepped both — only geometry/conic/
 *     intersection/circuit/pedigree/reaction-coordinate/flowchart/
 *     spring-mass/collision/manipulative/energy-bars have validators, none
 *     apply to handwrite).
 *   - It needs no spatial anchor, no target resolution against the
 *     WhiteboardCatalog, no existing page/item, and no coordinates — just a
 *     `text` string (WhiteboardCanvas.tsx AnnotationStrip renders it purely
 *     from `h.text`/`h.color`). Even on a completely blank board with zero
 *     prior commands, WhiteboardCanvas's page-grouping (`pages` useMemo)
 *     folds a single handwrite into an implicit first page and the
 *     AnnotationStrip renders it — confirmed by tracing WhiteboardCanvas.tsx
 *     lines ~286-317 (implicit page bucket) and ~700-717 (handwrites filtered
 *     into the strip, not the generic item switch) and line 2563 (`case
 *     'handwrite': return null;` in the generic per-item renderer — it is
 *     deliberately excluded from the "Unknown command type" fallback path
 *     entirely).
 *   - The orchestrator wiring (Part 2) dispatches this command directly via
 *     `onWhiteboardCommand`, the same terminal, fail-to-nothing path the
 *     existing TUTOR_BOARD_ANCHOR_ASSIST transformation-arrow fallback uses —
 *     it never re-enters the brain's tool-call / judge / kill pipeline, so it
 *     cannot be rejected by requiredPhrases, the content judge, or
 *     validateToolCall's per-action checks either.
 *
 * See project_tutor_pedagogy_opener_calibration + .superpowers/sdd/task-B3-brief.md.
 */

import type { WhiteboardCommand } from '../../knowledge/types';

/**
 * True iff the opening turn (openingPhase) produced zero valid whiteboard
 * renders — the trigger condition for emitting the fallback card. Pure;
 * the orchestrator is responsible for computing both inputs.
 */
export function shouldEmitOpenerFallback(input: {
  openingPhase: boolean;
  validRendersThisTurn: number;
}): boolean {
  return input.openingPhase === true && input.validRendersThisTurn === 0;
}

/**
 * Build the single guaranteed-renderable fallback command: a short,
 * tasteful handwrite line (NOT a bold "Today we will learn" banner) —
 * a curiosity/prompt line about the topic when known, or a neutral
 * "I'm listening" line otherwise. Deterministic output shape (no
 * randomness/timestamps) so it's exactly unit-testable.
 */
export function buildOpenerFallbackCommand(opts?: { topic?: string }): WhiteboardCommand {
  const topic = opts?.topic?.trim();
  const text = topic
    ? `Curious about ${topic}? Let's find out together.`
    : "Let's get started — I'm listening.";
  return { action: 'handwrite', text };
}
