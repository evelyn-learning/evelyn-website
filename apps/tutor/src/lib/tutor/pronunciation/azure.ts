// src/lib/tutor/pronunciation/azure.ts
// Azure AI Speech Pronunciation Assessment — scripted mode (referenceText),
// phoneme granularity, IPA, prosody on, en-US, 16 kHz PCM16 mono push stream.
// Mirrors Azure-Samples/cognitive-services-speech-sdk "pronunciationAssessment.js".
// Server-only (subscription key). The SDK is imported lazily so importing
// this module costs nothing until a call is made.
import { normalizeAzure } from './normalize';
import type { PronunciationResult } from './types';

export { normalizeAzure, azureProsodyFlags } from './normalize';

export const AZURE_LOCALE = 'en-US';
const AZURE_TIMEOUT_MS = 30_000;

export interface AzureRawResult { json: unknown; latencyMs: number }

// The SDK (1.52, Node) hangs silently when the websocket is refused (bad key →
// 401: a ConnectionErrorEvent is logged, but neither recognizeOnceAsync's
// callbacks nor `canceled` fire). So the key is exchanged for a token first —
// a plain HTTPS call that fails loudly on a bad key/region — and the SDK is
// given the token. Tokens live 10 min; cached for 9. Not counted in latencyMs.
const tokenCache = new Map<string, { token: string; until: number }>();
async function azureToken(env: { key: string; region: string }): Promise<string> {
  const cacheKey = `${env.region}:${env.key}`;
  const hit = tokenCache.get(cacheKey);
  if (hit && hit.until > Date.now()) return hit.token;
  const res = await fetch(`https://${encodeURIComponent(env.region)}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': env.key, 'Content-Length': '0' },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`azure: token request failed (HTTP ${res.status}) — check AZURE_SPEECH_KEY / AZURE_SPEECH_REGION. ${body.slice(0, 160)}`.trim());
  tokenCache.set(cacheKey, { token: body, until: Date.now() + 9 * 60_000 });
  return body;
}

/** One scripted assessment; returns Azure's raw JSON + wall-clock latency. */
export async function assessAzureRaw(
  pcm16: Buffer,
  referenceText: string,
  env: { key: string; region: string },
): Promise<AzureRawResult> {
  const sdk = await import('microsoft-cognitiveservices-speech-sdk');
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(await azureToken(env), env.region);
  speechConfig.speechRecognitionLanguage = AZURE_LOCALE;

  const push = sdk.AudioInputStream.createPushStream(sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1));
  push.write(pcm16.buffer.slice(pcm16.byteOffset, pcm16.byteOffset + pcm16.byteLength) as ArrayBuffer);
  push.close();
  const audioConfig = sdk.AudioConfig.fromStreamInput(push);

  const pa = new sdk.PronunciationAssessmentConfig(
    referenceText,
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Phoneme,
    true, // enableMiscue: omissions / insertions against the reference
  );
  pa.phonemeAlphabet = 'IPA';
  pa.enableProsodyAssessment = true;

  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  pa.applyTo(recognizer);

  const t0 = Date.now();
  try {
    // Belt and braces for the hang above: listen on `canceled` too, and keep a
    // hard timeout (it also holds the event loop open so the caller sees an error).
    let timer: NodeJS.Timeout | undefined;
    const result = await new Promise<import('microsoft-cognitiveservices-speech-sdk').SpeechRecognitionResult>((resolve, reject) => {
      timer = setTimeout(() => reject(new Error(`azure: no result after ${AZURE_TIMEOUT_MS} ms`)), AZURE_TIMEOUT_MS);
      recognizer.canceled = (_s, e) => {
        if (e.reason === sdk.CancellationReason.Error) {
          reject(new Error(`azure: canceled (${sdk.CancellationErrorCode[e.errorCode]}) ${e.errorDetails ?? ''}`.trim()));
        }
      };
      recognizer.recognizeOnceAsync(resolve, (e) => reject(new Error(`azure: ${e}`)));
    }).finally(() => clearTimeout(timer));
    const latencyMs = Date.now() - t0;
    if (result.reason === sdk.ResultReason.Canceled) {
      const c = sdk.CancellationDetails.fromResult(result);
      throw new Error(`azure: canceled (${sdk.CancellationErrorCode[c.ErrorCode]}) ${c.errorDetails ?? ''}`.trim());
    }
    if (result.reason !== sdk.ResultReason.RecognizedSpeech) {
      throw new Error(`azure: no speech recognized (reason ${sdk.ResultReason[result.reason]})`);
    }
    const raw = result.properties.getProperty(sdk.PropertyId.SpeechServiceResponse_JsonResult);
    return { json: JSON.parse(raw), latencyMs };
  } finally {
    recognizer.close();
  }
}

export async function assessAzure(
  pcm16: Buffer,
  referenceText: string,
  env: { key: string; region: string },
): Promise<PronunciationResult> {
  const { json, latencyMs } = await assessAzureRaw(pcm16, referenceText, env);
  return { ...normalizeAzure(json), latencyMs };
}
