/**
 * Embed-session token verifier (learner-model Phase C, Task 1).
 *
 * The portal mints an HS256 JWT signed with the SAME per-partner secret used
 * for the HMAC portal API (PORTAL_PARTNER_SECRETS / getPartnerSecret), so no
 * new secret distribution is needed. This is the AUTH layer for embed
 * sessions — it only verifies signature/partner/expiry claims. The full
 * EmbedConfig (lesson context, curriculum_module, etc.) rides in the same
 * payload untouched; this module never inspects those fields.
 *
 * Unlike the replay token (`replay-token.ts`), there is no `mode` claim to
 * pin, and `student_id` is OPTIONAL — some engine demo/anonymous embeds have
 * no student identity at all. Expiry also gets a grace window
 * (EMBED_TOKEN_EXP_GRACE_MINUTES, default 240min) so a token that goes stale
 * mid-session (long tutor sessions, clock skew) doesn't hard-fail.
 *
 * Enforcement is staged via EMBED_TOKEN_ENFORCE so routes can be gated
 * without a hard cutover:
 *   - 'off' (default): don't even verify; always allow.
 *   - 'log':  verify, but only warn on failure — never block.
 *   - 'on':   verify and block on failure.
 *
 * Dependency-free (node:crypto) — the engine has no jsonwebtoken.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { getPartnerSecret } from './auth';

export type EmbedEnforceMode = 'off' | 'log' | 'on';

/** Reads process.env.EMBED_TOKEN_ENFORCE at CALL time (not cached). */
export function embedEnforceMode(): EmbedEnforceMode {
  const raw = process.env.EMBED_TOKEN_ENFORCE;
  if (raw === 'log' || raw === 'on') return raw;
  return 'off';
}

export interface EmbedTokenPayload {
  partner_id: string;
  /** Optional: engine demo/anonymous embeds may carry no student identity. */
  student_id?: string;
  exp?: number;
  /** The full EmbedConfig rides here; we only verify the auth claims above. */
  [k: string]: unknown;
}

function b64urlDecode(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function b64urlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Verify an HS256 embed JWT. Returns the payload or a rejection reason. Never throws. */
export function verifyEmbedToken(
  token: string | null,
  nowMs: number = Date.now(),
): { ok: true; payload: EmbedTokenPayload } | { ok: false; reason: string } {
  if (!token) return { ok: false, reason: 'missing token' };
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'not a JWT' };
  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];

  let header: { alg?: string };
  let payload: Partial<EmbedTokenPayload>;
  try {
    header = JSON.parse(b64urlDecode(headerB64).toString('utf8'));
    payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed token' };
  }
  // JSON.parse accepts bare `null`/scalars as valid JSON; guard property
  // access below so a token like "bnVsbA.bnVsbA.x" (base64 of "null") can
  // never throw instead of returning a rejection.
  if (typeof header !== 'object' || header === null) {
    return { ok: false, reason: 'malformed token' };
  }
  if (typeof payload !== 'object' || payload === null) {
    return { ok: false, reason: 'malformed token' };
  }
  if (header.alg !== 'HS256') return { ok: false, reason: 'unsupported alg' };
  if (!payload.partner_id) return { ok: false, reason: 'missing claims' };

  const secret = getPartnerSecret(payload.partner_id);
  if (!secret) return { ok: false, reason: 'unknown partner' };

  let expected: Buffer;
  let actual: Buffer;
  try {
    expected = createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest();
    actual = b64urlDecode(sigB64);
  } catch {
    return { ok: false, reason: 'malformed token' };
  }
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { ok: false, reason: 'bad signature' };
  }

  if (payload.exp !== undefined) {
    const graceMs = Number(process.env.EMBED_TOKEN_EXP_GRACE_MINUTES ?? 240) * 60_000;
    if (payload.exp * 1000 + graceMs < nowMs) {
      return { ok: false, reason: 'expired' };
    }
  }

  return { ok: true, payload: payload as EmbedTokenPayload };
}

export interface EmbedAuthDecision {
  allow: boolean;
  reason?: string;
  payload?: EmbedTokenPayload;
}

/**
 * Verify a token and apply the current enforce mode. Never throws.
 *
 * - 'off': allow unconditionally, without attempting verification.
 * - 'log': verify; on failure, console.warn and still allow.
 * - 'on':  verify; on failure, block.
 *
 * A verified token whose student_id doesn't match `expectedStudentId` is
 * treated as a failure with reason 'student_mismatch'.
 */
export function checkEmbedAuth(opts: {
  token: string | null;
  /** When set, a verified token's student_id must equal this. */
  expectedStudentId?: string;
  /** Route label for log lines, e.g. 'student-profile:POST'. */
  route: string;
}): EmbedAuthDecision {
  const mode = embedEnforceMode();
  if (mode === 'off') return { allow: true };

  const verdict = verifyEmbedToken(opts.token);
  let reason: string | undefined;
  let payload: EmbedTokenPayload | undefined;
  if (!verdict.ok) {
    reason = verdict.reason;
  } else if (
    opts.expectedStudentId !== undefined &&
    verdict.payload.student_id !== opts.expectedStudentId
  ) {
    reason = 'student_mismatch';
    payload = verdict.payload;
  } else {
    payload = verdict.payload;
  }

  if (reason === undefined) return { allow: true, payload };

  if (mode === 'log') {
    console.warn('[embed-auth]', opts.route, reason);
    return { allow: true, reason, payload };
  }
  return { allow: false, reason, payload };
}

/**
 * Sign an HS256 embed JWT. Used by first-party minting (Task 5) and tests.
 * Never throws under normal input; caller supplies a valid secret.
 */
export function signEmbedToken(payload: Record<string, unknown>, secret: string): string {
  const headerB64 = b64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest();
  return `${headerB64}.${payloadB64}.${b64urlEncode(sig)}`;
}
