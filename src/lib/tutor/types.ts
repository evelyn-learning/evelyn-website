/**
 * AI Tutor Engine Types
 *
 * Types for the voice tutor session, events, and state management.
 */

import type { WhiteboardCommand, Problem, StudentModuleProgress } from '../knowledge/types';

// =============================================================================
// SESSION TYPES
// =============================================================================

export type SessionStatus = 'initializing' | 'active' | 'paused' | 'completed' | 'abandoned' | 'error';

export type SessionGoal = 'homework-help' | 'practice' | 'concept-review' | 'test-prep' | 'catch-up' | 'challenge' | 'general';

export interface TutoringSessionConfig {
  studentId?: string;
  studentName?: string;
  subject: string;
  topic: string;
  level: string;
  goal?: SessionGoal;
  specificTopic?: string; // e.g., "projectile motion"
  maxDurationMinutes?: number; // default 30
  voicePreference?: VoicePreference;
}

export interface TutoringSession {
  id: string;
  config: TutoringSessionConfig;
  status: SessionStatus;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds: number;

  // Conversation
  transcript: TranscriptEntry[];

  // Learning data
  problemsAttempted: ProblemAttempt[];
  conceptsTouched: string[];
  misconceptionsDetected: string[];
  misconceptionsAddressed: string[];

  // Metrics
  metrics: SessionMetrics;
}

export interface TranscriptEntry {
  id: string;
  timestamp: Date;
  role: 'student' | 'tutor' | 'system';

  // Content
  text: string;

  // For tutor messages
  whiteboardCommands?: WhiteboardCommand[];
  pedagogicalIntent?: PedagogicalIntent;

  // For student messages
  sttConfidence?: number;
  detectedIntent?: StudentIntent;
  detectedMisconception?: string;
}

export type PedagogicalIntent =
  | 'greeting'
  | 'question'
  | 'hint'
  | 'explanation'
  | 'encouragement'
  | 'correction'
  | 'summary'
  | 'problem-presentation'
  | 'feedback';

export type StudentIntent =
  | 'answer'
  | 'question'
  | 'confusion'
  | 'agreement'
  | 'disagreement'
  | 'request-help'
  | 'request-hint'
  | 'small-talk';

export interface ProblemAttempt {
  problemId: string;
  startedAt: Date;
  completedAt?: Date;
  hintsUsed: number;
  correct: boolean;
  studentWork?: string; // their verbal explanation
  feedbackGiven?: string;
}

export interface SessionMetrics {
  studentSpeakingTime: number; // seconds
  tutorSpeakingTime: number;
  questionsAskedByTutor: number;
  hintsGiven: number;
  diagramsShown: number;
  problemsCompleted: number;
  problemsCorrect: number;
  averageResponseLatency: number; // ms
}

// =============================================================================
// VOICE TYPES
// =============================================================================

export type VoiceId = 'female-1' | 'female-2' | 'male-1' | 'male-2';

export interface VoicePreference {
  voiceId: VoiceId;
  speed?: number; // 0.5 - 2.0, default 1.0
  pitch?: number; // 0.5 - 2.0, default 1.0
}

export interface VoiceConfig {
  id: VoiceId;
  name: string;
  description: string;
  provider: 'cartesia' | 'elevenlabs';
  providerId: string; // Provider-specific voice ID
}

export const AVAILABLE_VOICES: VoiceConfig[] = [
  {
    id: 'female-1',
    name: 'Sarah',
    description: 'Warm and encouraging female voice',
    provider: 'cartesia',
    providerId: 'a0e99841-438c-4a64-b679-ae501e7d6091', // Placeholder - replace with actual
  },
  {
    id: 'female-2',
    name: 'Emma',
    description: 'Clear and professional female voice',
    provider: 'cartesia',
    providerId: 'b0f99842-438c-4a64-b679-ae501e7d6092', // Placeholder - replace with actual
  },
  {
    id: 'male-1',
    name: 'David',
    description: 'Calm and patient male voice',
    provider: 'cartesia',
    providerId: 'c0g99843-438c-4a64-b679-ae501e7d6093', // Placeholder - replace with actual
  },
  {
    id: 'male-2',
    name: 'Michael',
    description: 'Energetic and enthusiastic male voice',
    provider: 'cartesia',
    providerId: 'd0h99844-438c-4a64-b679-ae501e7d6094', // Placeholder - replace with actual
  },
];

// =============================================================================
// SESSION STATE MACHINE
// =============================================================================

export type SessionState =
  | 'idle'
  | 'greeting'
  | 'assessing'
  | 'teaching'
  | 'problem-solving'
  | 'explaining'
  | 'checking-understanding'
  | 'wrapping-up'
  | 'ended';

export interface SessionContext {
  session: TutoringSession;
  moduleId: string;
  studentProgress?: StudentModuleProgress;
  currentProblem?: Problem;
  currentConcept?: string;
  hintsGivenForCurrentProblem: number;
  explanationApproachesUsed: string[];
  lastStudentMessage?: string;
  lastTutorMessage?: string;
  consecutiveIncorrect: number;
  timeRemainingSeconds: number;
}

// =============================================================================
// WEBSOCKET EVENTS
// =============================================================================

// Client → Server events
export interface ClientToServerEvents {
  // Session management
  'session:start': (config: TutoringSessionConfig) => void;
  'session:end': () => void;
  'session:pause': () => void;
  'session:resume': () => void;

  // Voice
  'audio:chunk': (data: { chunk: ArrayBuffer; isFinal: boolean }) => void;
  'audio:cancel': () => void; // Interrupt current playback

  // Text fallback
  'text:message': (data: { text: string }) => void;

  // Whiteboard
  'whiteboard:studentDraw': (data: { strokes: unknown[] }) => void;

  // Problems
  'problem:submit': (data: { problemId: string; answer: string }) => void;
  'problem:requestHint': (data: { problemId: string }) => void;
  'problem:skip': (data: { problemId: string }) => void;

  // Homework upload
  'homework:upload': (data: { imageData: string; mimeType: string }) => void;
}

// Server → Client events
export interface ServerToClientEvents {
  // Session
  'session:started': (data: { sessionId: string; greeting: string }) => void;
  'session:ended': (data: { summary: SessionSummary }) => void;
  'session:error': (data: { error: string; recoverable: boolean }) => void;
  'session:stateChange': (data: { state: SessionState }) => void;

  // Voice
  'transcript:partial': (data: { text: string }) => void;
  'transcript:final': (data: { text: string; confidence: number }) => void;
  'audio:chunk': (data: { chunk: ArrayBuffer }) => void;
  'audio:start': () => void;
  'audio:end': () => void;

  // Tutor response
  'tutor:thinking': () => void;
  'tutor:message': (data: {
    text: string;
    whiteboardCommands?: WhiteboardCommand[];
    pedagogicalIntent?: PedagogicalIntent;
  }) => void;

  // Text mode
  'mode:textFallback': (data: { reason: string }) => void;
  'mode:voiceRestored': () => void;

  // Whiteboard
  'whiteboard:command': (data: { command: WhiteboardCommand }) => void;
  'whiteboard:clear': () => void;

  // Problems
  'problem:show': (data: { problem: Problem }) => void;
  'problem:feedback': (data: {
    correct: boolean;
    feedback: string;
    whiteboardCommands?: WhiteboardCommand[];
  }) => void;
  'problem:hint': (data: {
    level: 1 | 2 | 3;
    hint: string;
    whiteboardCommand?: WhiteboardCommand;
  }) => void;

  // Homework
  'homework:extracted': (data: { problems: Problem[] }) => void;
  'homework:error': (data: { error: string }) => void;

  // Progress
  'progress:update': (data: { conceptId: string; newLevel: number }) => void;
}

export interface SessionSummary {
  sessionId: string;
  duration: number; // seconds
  conceptsCovered: string[];
  problemsAttempted: number;
  problemsCorrect: number;
  misconceptionsAddressed: string[];
  strengths: string[];
  areasForImprovement: string[];
  suggestedNextSteps: string[];
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export type TutorErrorCode =
  | 'STT_FAILED'
  | 'TTS_FAILED'
  | 'LLM_FAILED'
  | 'SESSION_EXPIRED'
  | 'MODULE_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UNKNOWN';

export class TutorError extends Error {
  constructor(
    public code: TutorErrorCode,
    message: string,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'TutorError';
  }
}
