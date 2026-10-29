// src/lib/tutor/pronunciation/speechace.ts
// Speechace Score Text v9 (Basic plan: scripted word/sentence scoring), en-us.
// POST {host}/api/scoring/text/v9/json?key=…&dialect=en-us&user_id=…
// multipart: text + user_audio_file (WAV). Server-only (API key in the URL).
// Docs: https://api-docs.speechace.com/api-reference/score-text.md
import { normalizeSpeechace } from './normalize';
import type { PronunciationResult } from './types';
import { pcm16ToWav16k } from './wav';

export { normalizeSpeechace } from './normalize';

/** US West; subscriptions in other regions use their own host (pass env.host). */
export const SPEECHACE_DEFAULT_HOST = 'https://api.speechace.co';
export const SPEECHACE_DIALECT = 'en-us';

export interface SpeechaceRawResult { json: unknown; latencyMs: number }

export async function assessSpeechaceRaw(
  pcm16: Buffer,
  referenceText: string,
  env: { key: string; host?: string; userId?: string },
): Promise<SpeechaceRawResult> {
  const url = new URL('/api/scoring/text/v9/json', env.host || SPEECHACE_DEFAULT_HOST);
  url.searchParams.set('key', env.key);
  url.searchParams.set('dialect', SPEECHACE_DIALECT);
  url.searchParams.set('user_id', env.userId || 'evelyn-pron');
  const form = new FormData();
  form.set('text', referenceText);
  form.set('no_mc', '1');
  form.set('user_audio_file', new Blob([new Uint8Array(pcm16ToWav16k(pcm16))], { type: 'audio/wav' }), 'clip.wav');

  const t0 = Date.now();
  const res = await fetch(url, { method: 'POST', body: form });
  const latencyMs = Date.now() - t0;
  const body = await res.text();
  if (!res.ok) throw new Error(`speechace: HTTP ${res.status} ${body.slice(0, 200)}`);
  let json: unknown;
  try { json = JSON.parse(body); } catch { throw new Error(`speechace: non-JSON response ${body.slice(0, 200)}`); }
  return { json, latencyMs };
}

export async function assessSpeechace(
  pcm16: Buffer,
  referenceText: string,
  env: { key: string; host?: string; userId?: string },
): Promise<PronunciationResult> {
  const { json, latencyMs } = await assessSpeechaceRaw(pcm16, referenceText, env);
  return { ...normalizeSpeechace(json), latencyMs };
}
