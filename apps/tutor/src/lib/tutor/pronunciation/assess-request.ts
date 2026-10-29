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

/** Content-Length above which the route refuses to parse (base64 cap + JSON slack). */
export const MAX_REQUEST_BYTES = MAX_AUDIO_B64_CHARS + 32 * 1024;

/** A live session only: TutorSession.status 'active' and no endedAt (the
 *  resume path in session-usage re-sets 'active' and unsets endedAt). An ended
 *  sessionId must not stay a working key for vendor calls. */
/**
 * Read a request body of unknown length (chunked, no Content-Length) with a
 * byte cap: the text when it fits in `maxBytes`, null as soon as it would
 * not (the stream is cancelled, so an oversized body is never buffered).
 * A null/absent body reads as ''.
 */
export async function readBodyCapped(body: ReadableStream<Uint8Array> | null | undefined, maxBytes: number): Promise<string | null> {
  if (!body) return '';
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let o = 0;
  for (const c of chunks) { all.set(c, o); o += c.byteLength; }
  return new TextDecoder().decode(all);
}

export function sessionAllowsAssess(s: { status?: string | null; endedAt?: Date | string | null } | null | undefined): boolean {
  return !!s && s.status === 'active' && (s.endedAt === undefined || s.endedAt === null);
}

/** Per-session vendor-call cap, per process (the tutor runs as one pm2 process). */
export const MAX_ASSESS_CALLS_PER_SESSION = 40;
export const CALL_BUDGET_TTL_MS = 2 * 60 * 60 * 1000;

/** In-memory per-key call counter. Entries older than `ttlMs` (from their
 *  first call) are swept on every insert, so the map cannot grow forever. */
export class CallBudget {
  private readonly entries = new Map<string, { count: number; firstAt: number }>();
  constructor(
    private readonly max = MAX_ASSESS_CALLS_PER_SESSION,
    private readonly ttlMs = CALL_BUDGET_TTL_MS,
    private readonly now: () => number = Date.now,
  ) {}

  /** Count one call for `key`; false (and not counted) once the cap is reached. */
  take(key: string): boolean {
    const t = this.now();
    const e = this.entries.get(key);
    if (e && t - e.firstAt <= this.ttlMs) {
      if (e.count >= this.max) return false;
      e.count++;
      return true;
    }
    for (const [k, v] of this.entries) if (t - v.firstAt > this.ttlMs) this.entries.delete(k);
    this.entries.set(key, { count: 1, firstAt: t });
    return true;
  }

  get size(): number { return this.entries.size; }
}
