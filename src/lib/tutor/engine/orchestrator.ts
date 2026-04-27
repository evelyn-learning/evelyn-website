/**
 * Tutor engine orchestrator (Track 1 — first stone).
 *
 * The goal of this module is to expose the brain-call as a clean,
 * frontend-agnostic async iterator: caller passes the per-turn input
 * (system prompt, history, what the student said, board state, plan
 * context), iterates the result. Same shape works for the React
 * VoiceTutorRealtime client and for a future HTTP/B2B endpoint.
 *
 * Today this is a thin wrapper around `streamBrainTurn` from
 * claude-brain.ts plus a small post-event hook for engine-side
 * concerns (lesson plan progression, mastery tracking — Track 4).
 * Future commits move more of VoiceTutorRealtime's per-turn dispatch
 * into this module so the React component stops being the engine.
 *
 * Why a separate module instead of using streamBrainTurn directly:
 *   - the engine has cross-cutting concerns the brain shouldn't know
 *     about (catalog state, plan progression, validator-feedback retry,
 *     telemetry). Adding them to claude-brain.ts would couple the brain
 *     to product-specific orchestration.
 *   - downstream consumers (B2B HTTP API, CLI tools, evals) want one
 *     entry point that takes structured input and yields structured
 *     events; not the brain's raw output and not the React component's
 *     Realtime-coupled flow.
 */

import {
  streamBrainTurn,
  type BrainTurnInput,
  type BrainStreamEvent,
} from '@/lib/tutor/voice/claude-brain';
import { getGradeProfile } from '@/lib/tutor/pedagogy/grade-profile';

export interface OrchestratorTurnInput extends BrainTurnInput {
  /** Configured grade for the session. Drives the pacing multiplier
   *  applied to comprehension pauses and the band-specific behavior
   *  rendered into the system prompt block. */
  grade?: string;
}

// Baseline pause durations the brain hints at via sentence.pauseAfter
// or that the engine inserts automatically after a tool call (the
// student needs time to read the new visual). Tuned for grade 6-8;
// the grade profile multiplier scales these for younger / older.
const PAUSE_BASELINE_MS = { small: 600, medium: 1200, large: 2000 } as const;
const POST_TOOL_PAUSE_MS = 1100;     // baseline beat after any show_* tool

/**
 * Run one brain turn, yielding events as they arrive.
 *
 * Caller is responsible for:
 *   - voicing `sentence` events (typically via Realtime speakText queue)
 *   - dispatching `tool-call` events to the whiteboard catalog
 *   - finalizing transcripts on `done`
 *   - honoring `pause` directives (wait the indicated ms; cancel on
 *     student speech)
 *   - handling engine-side tool calls (advance_lesson,
 *     mark_segment_complete) which arrive as tool-call events.
 *
 * The orchestrator augments the brain's raw stream with:
 *   - a comprehension `pause` event after every show_* tool call,
 *     scaled by the configured grade band.
 *   - a `pause` event when the brain emits a sentence with a pauseAfter
 *     hint.
 */
export async function* runTutorTurn(input: OrchestratorTurnInput): AsyncIterable<BrainStreamEvent> {
  const profile = getGradeProfile(input.grade);
  const scale = profile.pacingMultiplier;

  for await (const ev of streamBrainTurn(input)) {
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

/** Heuristic: which tool names produce a board change worth pausing for.
 *  Engine-side tools (advance_lesson, mark_segment_complete) and
 *  zero-render tools (list_whiteboard_features) shouldn't trigger pauses. */
function isVisualTool(name: string): boolean {
  if (name.startsWith('show_') || name === 'highlight' || name === 'annotate' || name === 'draw_vector' || name === 'tutor_scribble') return true;
  return false;
}

export type { BrainStreamEvent, BrainTurnInput };
