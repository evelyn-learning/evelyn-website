/**
 * Extracted verbatim from VoiceTutorRealtime.tsx (seam-extraction slice 1,
 * 2026-07-05). Pure module — no component state.
 */
import type { SpokenCaption } from '@/lib/tutor/voice/caption-sync';
import type { StudentMarkEvent } from '@/lib/tutor/whiteboard/student-marks';
import type { TranscriptEntry } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';

export interface RealtimeHandle {
  sendTextMessage: (text: string) => void;
  /** Speak tutor-side text directly through TTS without routing
   *  through the brain. Used by the in-session lesson picker to
   *  voice its greeting bubble (the picker is a UI element rendered
   *  in the transcript area, not a brain turn, so without this it
   *  appears in the chat but isn't spoken aloud). */
  speakText: (text: string) => void;
  /** Cut off the current TTS bubble + drop queued sentences. Used
   *  when a quick-answer button tap should jump straight to the
   *  next turn instead of waiting for the prior one to finish. */
  stopSpeaking: () => void;
  getSessionSummary: () => {
    topicsCovered: string[];
    weakTopics: Array<{ topic: string; count: number }>;
  };
  /** Phase 3: step the session-level depth preference. Negative =
   *  more depth / slower teaching. Positive = less depth. Clamped
   *  -2..+2. Wired to ⋯ menu Slow down / Speed up items. Verbal
   *  cues like "slow down" / "faster" go through the boredom-cue
   *  regex inside callBrainOnce and call stepPaceBias internally. */
  stepPaceBias: (delta: -1 | 1) => void;
  /** Task W4: set the "Speak slower" TTS toggle. SEPARATE knob from
   *  stepPaceBias above — this only changes HTTP-TTS synthesis speed
   *  (Cartesia/OpenAI-mini), not depth/verbosity. Wired to the ⋯ menu's
   *  "Speak slower" item (sticky ✓ state, mirrors the Humor pattern). */
  setSpeakingRate: (rate: 'slow' | 'normal') => void;
  /** Task Y1: set/clear the starter-chip practiceOverride. `true` durably
   *  forces practiceMode on (ORed with sessionGoal — see
   *  `derivePracticeMode` in practice-mode.ts); `false` clears the override
   *  and returns to token-goal behavior. Persisted in the pacing-v2 blob so
   *  it survives resume. Wired to the "Practice problems" (true) / "Explain
   *  a concept" (false) starter chips in SessionStage.tsx. */
  setPracticeOverride: (active: boolean) => void;
  /** #7 hybrid (2026-07-17): set the STANDING problem-difficulty preference
   *  (-1 easier .. +2 much harder, 0 neutral; clamped). Persisted in the
   *  pacing-v2 blob; surfaces per-turn as `<difficulty_preference>` and
   *  deterministically upgrades a generate_problem difficulty of 'same' at
   *  the stream route. Wired to the Harder/Easier ⋯-menu chips. */
  setDifficultyBias: (bias: number) => void;
  /** Caption word-sync: poll the audio-locked caption reveal. Returns null
   *  when unsupported (non-claude-brain engines) — caller falls back to the
   *  legacy typewriter. live:false = supported but nothing being spoken
   *  (finalized turn / reload) — caller shows the full text instantly. */
  getSpokenCaption: () => SpokenCaption | null;
  /** Resume first-interaction: the gesture that unlocks TTS audio AND kicks
   *  the brain to continue a rehydrated session. Wired to the "Continue
   *  lesson" overlay (and mirrored by the mic dock's resume tap). No-op once
   *  the session has started or when there is no resume snapshot. */
  resumeContinue: () => void;
  /** Student marks (Phase 1): push a resolved-at-capture tap event from the
   *  whiteboard. Resolution + buffering + brain transport happen inside the
   *  engine. No-op when the flag is off or the engine is not claude-brain. */
  pushStudentMark: (ev: StudentMarkEvent) => void;
  /** End/Pause the session with the FULL teardown the dock's own End button
   *  runs (hard-stop TTS, finalize audio recording, final profile commit,
   *  then onEndSession). Added 2026-07-14 for the header End/Pause control —
   *  callers must use this rather than calling onEndSession directly, or the
   *  final transcript commit is skipped. Optional: legacy handle producers
   *  may not implement it; fall back to onEndSession if absent. */
  endSession?: () => void;
}

/** Pedagogical milestones the runtime reports via `onMilestone`, fired once
 *  each as the orchestrator genuinely crosses them (skips do NOT count).
 *  Values map 1:1 to the portal contract's `SessionMilestone` enum — minus
 *  `'none'`, which the consumer uses as the default when nothing fired. */
export type TutorMilestone = 'first_concept_complete' | 'first_try_yourself_success' | 'recap_reached';

/** Prior-session state to rehydrate on a resumed session (contract v1.2.0, E3).
 *  The runtime seeds these on boot so the conversation continues where it left
 *  off — position drives the pills, transcript feeds both the chat UI and the
 *  brain's history, whiteboard restores the board. Resume never auto-opens the
 *  mic; the student speaks/clicks to resume audio. */
export interface TutorResumeState {
  currentSegmentId: string;
  completedSegmentIds: string[];
  transcript: TranscriptEntry[];
  whiteboardCommands: WhiteboardCommand[];
  /** Original persistence stamps for whiteboardCommands (same order), carried
   *  so the resume-seed replay keeps each figure's real draw time instead of
   *  re-stamping to the resume wall-clock (replay-timeline fix, 2026-07-19 —
   *  see WhiteboardBatchMeta.seedStamps). Absent on legacy reads (the
   *  persistence layer then falls back to the resume moment, unchanged). */
  whiteboardCommandStamps?: Array<{ timestamp: string; sourceMessageIndex?: number }>;
}
