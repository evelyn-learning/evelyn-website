// src/lib/tutor/pronunciation/azure.ts
// Azure AI Speech Pronunciation Assessment over the REST short-audio endpoint
// (no Speech SDK: it needs Node >= 22, prod runs 20). Scripted mode
// (ReferenceText), phoneme granularity, IPA, miscue + prosody on, en-US,
// 16 kHz PCM16 mono sent as WAV. Server-only (subscription key).
// Docs: learn.microsoft.com/azure/ai-services/speech-service/rest-speech-to-text-short
import { normalizeAzure } from './normalize';
import type { PronunciationResult } from './types';
import { pcm16ToWav16k } from './wav';

export { normalizeAzure, azureProsodyFlags } from './normalize';

export const AZURE_LOCALE = 'en-US';
export const AZURE_TIMEOUT_MS = 30_000;

export interface AzureRawResult { json: unknown; latencyMs: number }

/** The request, separated out so it is unit-testable without a network call. */
export function buildAzureRequest(
  pcm16: Buffer,
  referenceText: string,
  env: { key: string; region: string },
): { url: string; headers: Record<string, string>; body: Buffer } {
  const params = {
    ReferenceText: referenceText,
    GradingSystem: 'HundredMark',
    Granularity: 'Phoneme',
    PhonemeAlphabet: 'IPA',
    EnableMiscue: true,
    EnableProsodyAssessment: true,
    Dimension: 'Comprehensive',
  };
  return {
    url: `https://${encodeURIComponent(env.region)}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${AZURE_LOCALE}&format=detailed`,
    headers: {
      'Ocp-Apim-Subscription-Key': env.key,
      'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
      Accept: 'application/json',
      'Pronunciation-Assessment': Buffer.from(JSON.stringify(params), 'utf8').toString('base64'),
    },
    body: pcm16ToWav16k(pcm16),
  };
}

/** One scripted assessment; returns Azure's raw JSON + wall-clock latency. Throws on
 *  timeout, non-200, or RecognitionStatus !== 'Success' (Task 6 maps that to vendor_error). */
export async function assessAzureRaw(
  pcm16: Buffer,
  referenceText: string,
  env: { key: string; region: string },
): Promise<AzureRawResult> {
  const req = buildAzureRequest(pcm16, referenceText, env);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), AZURE_TIMEOUT_MS);
  const t0 = Date.now();
  let res: Response;
  let body: string;
  try {
    res = await fetch(req.url, { method: 'POST', headers: req.headers, body: new Uint8Array(req.body), signal: ctrl.signal });
    body = await res.text();
  } catch (e) {
    if (ctrl.signal.aborted) throw new Error(`azure: no result after ${AZURE_TIMEOUT_MS} ms`);
    throw new Error(`azure: request failed — ${String(e)}`);
  } finally {
    clearTimeout(timer);
  }
  const latencyMs = Date.now() - t0;
  if (res.status !== 200) {
    throw new Error(`azure: HTTP ${res.status} ${res.statusText} ${body.slice(0, 200)}`.trim());
  }
  let json: unknown;
  try { json = JSON.parse(body); } catch { throw new Error(`azure: non-JSON response ${body.slice(0, 200)}`); }
  const status = (json as { RecognitionStatus?: unknown } | null)?.RecognitionStatus;
  if (status !== 'Success') throw new Error(`azure: RecognitionStatus ${String(status)}`);
  return { json, latencyMs };
}

export async function assessAzure(
  pcm16: Buffer,
  referenceText: string,
  env: { key: string; region: string },
): Promise<PronunciationResult> {
  const { json, latencyMs } = await assessAzureRaw(pcm16, referenceText, env);
  return { ...normalizeAzure(json), latencyMs };
}
