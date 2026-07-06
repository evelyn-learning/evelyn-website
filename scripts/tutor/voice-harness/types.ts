// scripts/tutor/voice-harness/types.ts
export type AccentKey = 'en-us' | 'en-gb' | 'en-in' | 'en-ar-gulf' | 'en-nl' | 'en-de';
export const ACCENTS: AccentKey[] = ['en-us', 'en-gb', 'en-in', 'en-ar-gulf', 'en-nl', 'en-de'];

export type TtsProvider = 'cartesia' | 'openai-realtime';
/** How the accent is achieved (spec decision #2). */
export type AccentTechnique = 'native' | 'localize' | 'carryover' | 'clone' | 'control';

export interface VoiceCandidate {
  provider: TtsProvider;
  voiceId: string;
  label: string;            // human label shown in dashboard, e.g. "Katie (en-US)"
  accent: AccentKey;
  technique: AccentTechnique;
  /** Cartesia `language` param for the TTS call. 'en' for native/localize/clone;
   *  ALSO 'en' for carryover voices (we WANT English text through an L1 voice). */
  language: string;
  enabled: boolean;         // curation switch — edit candidates.json by hand
}

export interface TtsClip {
  clipId: string;           // `${voiceKey}__${utteranceId}`
  provider: TtsProvider;
  voiceId: string;
  label: string;
  accent: AccentKey;
  technique: AccentTechnique;
  utteranceId: string;
  file: string;             // relative to the run dir, e.g. "clips/katie__u01.wav"
  ttfaMs: number;           // request-start → first audio byte
  totalMs: number;
  error?: string;
}

export interface TtsManifest {
  runId: string;
  createdAt: string;
  utterances: { id: string; style: string; raw: string; tts: string }[];
  clips: TtsClip[];
}

export type SttEngine = 'ink2' | 'deepgram' | 'openai';

export interface SttClipResult {
  clipId: string;
  accent: AccentKey;
  engine: SttEngine;
  reference: string;
  transcript: string;
  wer: number;              // 0..1+
  finalLatencyMs: number;   // last audio byte sent → final transcript settled
  eventsFile: string;       // raw event log (jsonl), relative to run dir
  error?: string;
}

export interface SttResults {
  runId: string;
  createdAt: string;
  engines: SttEngine[];
  realtimePaced: boolean;
  clips: SttClipResult[];
}
