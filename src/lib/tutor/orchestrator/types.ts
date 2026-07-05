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
}
