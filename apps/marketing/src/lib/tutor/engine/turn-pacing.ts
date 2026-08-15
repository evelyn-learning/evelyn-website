/**
 * Turn-pacing transform for the tutor engine.
 *
 * Pulled out of orchestrator.ts so the cap/pause logic is unit-testable
 * WITHOUT loading claude-brain.ts (which instantiates an Anthropic client
 * at module load and would force the test to carry an API key + the SDK).
 * Only a type-only import of BrainStreamEvent remains, which erases at
 * runtime — so this module has zero heavy dependencies.
 *
 * `runTutorTurn` is now a thin wrapper: compute the grade scale + skip
 * flag, then pipe streamBrainTurn through `applyTurnPacing`.
 */

import type { BrainStreamEvent } from '@/lib/tutor/voice/claude-brain';

// Baseline pause durations the brain hints at via sentence.pauseAfter
// or that the engine inserts automatically after a tool call (the
// student needs time to read the new visual). Tuned for grade 6-8;
// the grade profile multiplier scales these for younger / older.
export const PAUSE_BASELINE_MS = { small: 600, medium: 1200, large: 2000 } as const;
export const POST_TOOL_PAUSE_MS = 1100;     // baseline beat after any show_* tool

// Skip-turn render cap (2026-06-17). A Skip is brisk navigation, not a
// full re-teach of the next segment — but the brain was observed treating
// a Skip as license to roll out the whole next segment (a JEE/ACT Skip ran
// 48s emitting 15 tool calls, dumping an entire formula sheet). The system
// prompt now tells the brain to keep the render footprint light on a Skip
// (≤1 anchor visual); this is the deterministic backstop for prompt drift.
// On a Skip turn we drop visual (show_*) renders beyond the cap so the
// student never has to sit through the dump. Non-visual tools
// (advance_lesson, generate_problem, flag_prerequisite_gap, add_topic_*)
// are never counted or capped. Cap = prompt's "1 anchor" + 1 slot of slack.
export const SKIP_TURN_RENDER_CAP = 2;

// Matches a Skip-ahead turn in studentTranscript. Two marker shapes
// reach the server: the raw "[Skip-button-clicked: ...]" (non-
// deterministic fallback + end-of-plan path) AND the app-side rewritten
// "[Lesson auto-advanced: the student clicked Skip-ahead ...]" that the
// deterministic Skip path (TUTOR_SKIP_DETERMINISTIC, the live default)
// produces in VoiceTutorRealtime BEFORE the brain call. We must catch
// both, so match on the common "Skip" verb either marker carries.
export const SKIP_MARKER_RE = /\[Skip-button-clicked|clicked Skip-ahead/i;

/** True when this turn was driven by the Skip-ahead button (either marker). */
export function isSkipTurn(studentTranscript: string | null | undefined): boolean {
  return SKIP_MARKER_RE.test(studentTranscript ?? '');
}

/** Heuristic: which tool names produce a board change worth pausing for
 *  (and worth counting against the Skip-turn render cap). Engine-side
 *  tools (advance_lesson, mark_segment_complete) and zero-render tools
 *  (list_whiteboard_features) are neither paused nor capped. */
export function isVisualTool(name: string): boolean {
  if (name.startsWith('show_') || name === 'highlight' || name === 'annotate' || name === 'draw_vector' || name === 'tutor_scribble') return true;
  return false;
}

/**
 * Augment the brain's raw event stream with:
 *   - a comprehension `pause` after every visual tool call, scaled by the
 *     grade band (so the student has time to read what just landed);
 *   - a `pause` when a sentence carries a `pauseAfter` hint;
 *   - the Skip-turn render cap: on a Skip turn, visual renders past
 *     SKIP_TURN_RENDER_CAP are dropped (the event is not yielded, and no
 *     post-tool pause is emitted for it). The brain has already acked
 *     these tool calls internally, so dropping the yield here only stops
 *     the client from rendering them — the model's contract is untouched.
 */
export async function* applyTurnPacing(
  source: AsyncIterable<BrainStreamEvent>,
  opts: { isSkipTurn: boolean; scale: number },
): AsyncGenerator<BrainStreamEvent, void, void> {
  const { isSkipTurn: skip, scale } = opts;
  let skipVisualCount = 0;

  for await (const ev of source) {
    if (skip && ev.type === 'tool-call' && isVisualTool(ev.name)) {
      if (++skipVisualCount > SKIP_TURN_RENDER_CAP) {
        console.warn(
          `[orchestrator] Skip-turn render cap (${SKIP_TURN_RENDER_CAP}) reached — dropping ${ev.name} (visual #${skipVisualCount})`,
        );
        continue;
      }
    }

    yield ev;

    if (ev.type === 'tool-call' && isVisualTool(ev.name)) {
      // Auto-pause after a visual lands so the student has time to
      // read it. Brain doesn't have to remember to ask for this.
      yield { type: 'pause', ms: Math.round(POST_TOOL_PAUSE_MS * scale), reason: `post-${ev.name}` };
    } else if (ev.type === 'sentence' && ev.pauseAfter) {
      const baseline = PAUSE_BASELINE_MS[ev.pauseAfter];
      yield { type: 'pause', ms: Math.round(baseline * scale), reason: `sentence:${ev.pauseAfter}` };
    }
  }
}
