// src/lib/tutor/pronunciation/assess-request.ts
// Pure parts of POST /api/tutor/pronunciation/assess: body validation and the
// tenant gate. The route itself only does I/O (session lookup, vendor call).
import { resolvePartnerSessionOptions } from '@/lib/tutor/portal/partner-session-options';

/** Decoded PCM16 cap (≈ 31 s at 24 kHz; the assessor's own limit is 15 s). */
export const MAX_AUDIO_BYTES = 1.5 * 1024 * 1024;
export const MAX_REFERENCE_CHARS = 500;
/** Base64 length beyond which the decoded audio must exceed MAX_AUDIO_BYTES. */
const MAX_AUDIO_B64_CHARS = Math.ceil(MAX_AUDIO_BYTES / 3) * 4;

export type AssessBody =
  | { ok: true; sessionId: string; referenceText: string; pcm16: Buffer }
  | { ok: false; status: 400 | 413; error: string };

export function parseAssessBody(body: unknown): AssessBody {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, status: 400, error: 'invalid body' };
  const { sessionId, referenceText, audio } = body as Record<string, unknown>;
  if (typeof sessionId !== 'string' || !sessionId.trim() || sessionId.length > 200) return { ok: false, status: 400, error: 'invalid sessionId' };
  const ref = typeof referenceText === 'string' ? referenceText.trim() : '';
  if (!ref || ref.length > MAX_REFERENCE_CHARS) return { ok: false, status: 400, error: 'invalid referenceText' };
  if (typeof audio !== 'string' || !audio) return { ok: false, status: 400, error: 'invalid audio' };
  if (audio.length > MAX_AUDIO_B64_CHARS) return { ok: false, status: 413, error: 'audio too large' };
  const raw = Buffer.from(audio, 'base64');
  if (raw.length > MAX_AUDIO_BYTES) return { ok: false, status: 413, error: 'audio too large' };
  const pcm16 = raw.length % 2 ? raw.subarray(0, raw.length - 1) : raw;
  return { ok: true, sessionId: sessionId.trim(), referenceText: ref, pcm16 };
}

/** Open only when the global flag is on AND the session's partner has `pronunciation`. */
export function pronunciationRouteEnabled(flagOn: boolean, partnerId: string | null | undefined): boolean {
  return flagOn && resolvePartnerSessionOptions({ partnerId }).pronunciation;
}
