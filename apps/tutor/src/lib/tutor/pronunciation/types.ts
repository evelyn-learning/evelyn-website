// src/lib/tutor/pronunciation/types.ts
// One result shape for every pronunciation-assessment vendor (Azure AI Speech
// Pronunciation Assessment, Speechace). The bake-off harness compares vendors
// on it; the tutor's pronunciation tool will hand it to the brain.

export type PronunciationVendor = 'azure' | 'speechace';

export type PronunciationErrorType = 'none' | 'mispronunciation' | 'omission' | 'insertion';

export interface PronunciationResult {
  vendor: 'azure' | 'speechace';
  /** 0–100 overall pronunciation score (Azure PronScore, Speechace speechace_score.pronunciation). */
  overall: number;
  words: Array<{
    word: string;
    /** 0–100 word accuracy. */
    score: number;
    errorType: 'none' | 'mispronunciation' | 'omission' | 'insertion';
    /** IPA phonemes with 0–100 scores, in spoken order. */
    phonemes: Array<{ ipa: string; score: number }>;
    /** Lexical (syllable) stress verdict — only vendors that measure it, only multi-syllable words. */
    stress?: 'ok' | 'wrong';
  }>;
  /** 0–100 prosody score (Azure only, prosody assessment on). */
  prosody?: number;
  /** 0–100 fluency score, when the vendor returned one. */
  fluency?: number;
  /** 0–100 share of the reference text actually spoken (Azure CompletenessScore), when returned. */
  completeness?: number;
  /** Wall-clock ms for the vendor call (0 when the result came from a stored JSON). */
  latencyMs: number;
}
