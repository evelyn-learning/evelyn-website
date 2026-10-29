// src/lib/tutor/pronunciation/assessor.ts
// One entry point for the tutor's MEASURED pronunciation feedback (GDI trial
// lesson, design §3): the learner's 24 kHz mic clip → vendor assessment →
// a short note the brain reads. When nothing was measured the result says so
// (status 'unavailable') and the note tells the brain not to describe sounds —
// the transcript-only habit pronunciation-claim.ts guards against.
//
// Vendor: TUTOR_PRONUNCIATION_VENDOR = azure | speechace. Keys only from env
// (AZURE_SPEECH_KEY + AZURE_SPEECH_REGION, or SPEECHACE_KEY [+ SPEECHACE_HOST]);
// never logged.
import { assessAzure } from './azure';
import { assessSpeechace } from './speechace';
import { WORD_FLAG_SCORE } from './normalize';
import { resamplePcm16 } from './resample';
import { PRON_SAMPLE_RATE } from './wav';
import type { PronunciationResult } from './types';

export type PronunciationUnavailableReason = 'no_vendor' | 'no_key' | 'clip_too_short' | 'clip_too_long' | 'vendor_error';
export type PronunciationAssessment =
  | { status: 'ok'; result: PronunciationResult }
  | { status: 'unavailable'; reason: PronunciationUnavailableReason };

export const MIN_CLIP_SECONDS = 0.4;
export const MAX_CLIP_SECONDS = 15;

export interface AssessorDeps {
  azure: (pcm16: Buffer, referenceText: string, env: { key: string; region: string }) => Promise<PronunciationResult>;
  speechace: (pcm16: Buffer, referenceText: string, env: { key: string; host?: string }) => Promise<PronunciationResult>;
}
const DEFAULT_DEPS: AssessorDeps = { azure: assessAzure, speechace: assessSpeechace };

type Env = Record<string, string | undefined>;

export async function assessPronunciation(
  input: { pcm16: Buffer; sampleRate: 24000; referenceText: string },
  env: Env = process.env,
  deps: AssessorDeps = DEFAULT_DEPS,
): Promise<PronunciationAssessment> {
  const vendor = env.TUTOR_PRONUNCIATION_VENDOR;
  if (vendor !== 'azure' && vendor !== 'speechace') return { status: 'unavailable', reason: 'no_vendor' };
  const azureKey = env.AZURE_SPEECH_KEY, azureRegion = env.AZURE_SPEECH_REGION, speechaceKey = env.SPEECHACE_KEY;
  if (vendor === 'azure' ? !azureKey || !azureRegion : !speechaceKey) return { status: 'unavailable', reason: 'no_key' };

  // Judged at the capture rate, before resampling.
  const seconds = Math.floor(input.pcm16.length / 2) / input.sampleRate;
  if (seconds < MIN_CLIP_SECONDS) return { status: 'unavailable', reason: 'clip_too_short' };
  if (seconds > MAX_CLIP_SECONDS) return { status: 'unavailable', reason: 'clip_too_long' };

  const pcm16k = resamplePcm16(input.pcm16, input.sampleRate, PRON_SAMPLE_RATE);
  try {
    const result = vendor === 'azure'
      ? await deps.azure(pcm16k, input.referenceText, { key: azureKey!, region: azureRegion! })
      : await deps.speechace(pcm16k, input.referenceText, env.SPEECHACE_HOST ? { key: speechaceKey!, host: env.SPEECHACE_HOST } : { key: speechaceKey! });
    return { status: 'ok', result };
  } catch (e) {
    let msg = e instanceof Error ? e.message : String(e);
    for (const secret of [azureKey, speechaceKey]) if (secret) msg = msg.split(secret).join('***');
    console.warn(`[pronunciation] ${vendor} vendor_error: ${msg.slice(0, 300)}`);
    return { status: 'unavailable', reason: 'vendor_error' };
  }
}

export const PRONUNCIATION_UNAVAILABLE_NOTE =
  'No measured result: coach stress and linking from your model; do not describe sounds.';

/** An 'ok' vendor result for a turn in which the learner did not say the
 *  target (silence, a question, another sentence): most reference words come
 *  back as omissions. Nothing was measured, so the claim guard stays shut. */
export const PRONUNCIATION_NOT_ATTEMPTED_NOTE =
  'The learner did not say the target text; nothing was measured. Ask them to repeat it, or coach from your model.';

/** Below this Azure CompletenessScore the turn was not an attempt. */
export const MIN_COMPLETENESS = 50;

/**
 * Whether the assessment measured an ATTEMPT at the reference text: status ok
 * AND fewer than half the reference words omitted AND (when the vendor gave
 * one) completeness ≥ MIN_COMPLETENESS. Insertions are not reference words.
 */
export function isMeasuredResult(r: PronunciationAssessment): boolean {
  if (r.status !== 'ok') return false;
  const res = r.result;
  if (typeof res.completeness === 'number' && res.completeness < MIN_COMPLETENESS) return false;
  const refWords = res.words.filter((w) => w.errorType !== 'insertion');
  if (refWords.length === 0) return false;
  const omitted = refWords.filter((w) => w.errorType === 'omission').length;
  return omitted * 2 < refWords.length;
}

const MAX_REF_WORDS = 12;
const round = (n: number) => Math.round(n);

/**
 * ≤ 80 words of plain prose for the brain: overall score, up to two weakest
 * words (score < WORD_FLAG_SCORE) with their worst phoneme and stress flag,
 * prosody when measured. Generic on purpose — the brain decides what to say.
 * A non-attempt (see isMeasuredResult) gets PRONUNCIATION_NOT_ATTEMPTED_NOTE.
 */
export function formatPronunciationNote(r: PronunciationAssessment, referenceText: string): string {
  if (r.status !== 'ok') return PRONUNCIATION_UNAVAILABLE_NOTE;
  if (!isMeasuredResult(r)) return PRONUNCIATION_NOT_ATTEMPTED_NOTE;
  const res = r.result;
  const refWords = referenceText.trim().split(/\s+/).filter(Boolean);
  const ref = refWords.length > MAX_REF_WORDS ? `${refWords.slice(0, MAX_REF_WORDS).join(' ')}…` : refWords.join(' ');
  const parts = [`Measured pronunciation of "${ref}": overall ${round(res.overall)}/100.`];

  const weak = res.words
    .filter((w) => w.score < WORD_FLAG_SCORE || w.errorType === 'omission')
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((w) => {
      if (w.errorType === 'omission') return `"${w.word}" omitted`;
      const bits = [`${round(w.score)}`];
      const worst = [...w.phonemes].sort((a, b) => a.score - b.score)[0];
      if (worst) bits.push(`weakest sound /${worst.ipa}/ ${round(worst.score)}`);
      if (w.stress === 'wrong') bits.push('stress wrong');
      return `"${w.word}" ${bits.join(', ')}`;
    });
  parts.push(weak.length ? `Weakest: ${weak.join('; ')}.` : `No word below ${WORD_FLAG_SCORE}.`);
  if (typeof res.prosody === 'number') parts.push(`Prosody ${round(res.prosody)}/100.`);
  parts.push('Feed back only on these measured items.');
  return parts.join(' ');
}
