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
import { applyTurnPacing, isSkipTurn } from './turn-pacing';

export interface OrchestratorTurnInput extends BrainTurnInput {
  /** Configured grade for the session. Drives the pacing multiplier
   *  applied to comprehension pauses and the band-specific behavior
   *  rendered into the system prompt block. */
  grade?: string;
}

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

  yield* applyTurnPacing(streamBrainTurn(input), {
    isSkipTurn: isSkipTurn(input.studentTranscript),
    scale,
  });
}

export type { BrainStreamEvent, BrainTurnInput };
