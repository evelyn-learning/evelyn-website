/**
 * Student replay token (crimsora v2 — student past-sessions).
 *
 * The portal mints an HS256 JWT signed with the SAME per-partner secret used
 * for the HMAC portal API (PORTAL_PARTNER_SECRETS / getPartnerSecret), so no
 * new secret distribution is needed. Unlike the live-embed token (whose
 * parse is still a dev stub — the partner chose the student, so the trust
 * story differs), a replay token unlocks a STORED recording, so this verifier
 * is strict: signature, expiry, mode, and the session/student binding are all
 * required. Dependency-free (node:crypto) — the engine has no jsonwebtoken.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { getPartnerSecret } from './auth';

export interface ReplayTokenPayload {
  mode: 'replay';
  partner_id: string;
  student_id: string;
  session_id: string;
  exp: number;
}

function b64urlDecode(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

/** Verify an HS256 replay JWT. Returns the payload or a rejection reason. */
export function verifyReplayToken(
  token: string | null,
): { ok: true; payload: ReplayTokenPayload } | { ok: false; reason: string } {
  if (!token) return { ok: false, reason: 'missing token' };
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'not a JWT' };
  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];

  let header: { alg?: string };
  let payload: Partial<ReplayTokenPayload>;
  try {
    header = JSON.parse(b64urlDecode(headerB64).toString('utf8'));
    payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed token' };
  }
  if (header.alg !== 'HS256') return { ok: false, reason: 'unsupported alg' };
  if (payload.mode !== 'replay') return { ok: false, reason: 'not a replay token' };
  if (!payload.partner_id || !payload.student_id || !payload.session_id) {
    return { ok: false, reason: 'missing claims' };
  }

  const secret = getPartnerSecret(payload.partner_id);
  if (!secret) return { ok: false, reason: 'unknown partner' };

  const expected = createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest();
  const actual = b64urlDecode(sigB64);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { ok: false, reason: 'bad signature' };
  }

  if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) {
    return { ok: false, reason: 'expired' };
  }
  return { ok: true, payload: payload as ReplayTokenPayload };
}
