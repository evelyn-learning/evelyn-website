/**
 * Student replay token (crimsora v2 — student past-sessions).
 *
 * The portal mints an HS256 JWT signed with the SAME per-partner secret used
 * for the HMAC portal API, so no new secret distribution is needed. Which
 * secrets are LIVE for a partner is `partner-token-secrets.ts`'s job (M1c
 * registry first, env map as fallback) — read that file's header for the
 * production outage that moved this lookup off `getPartnerSecret`.
 * Unlike the live-embed token (whose
 * parse is still a dev stub — the partner chose the student, so the trust
 * story differs), a replay token unlocks a STORED recording, so this verifier
 * is strict: signature, expiry, mode, and the session/student binding are all
 * required. Dependency-free (node:crypto) — the engine has no jsonwebtoken.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { getPartnerSecret } from './auth';
import { resolvePartnerTokenSecrets } from './partner-token-secrets';

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

export type ReplayVerdict =
  | { ok: true; payload: ReplayTokenPayload }
  | { ok: false; reason: string };

/**
 * Everything about verification EXCEPT resolving the partner's secrets, which
 * is the only step that needs to reach the registry (and therefore the only
 * step that has to be async). Split out so the sync and async entry points
 * below cannot drift in their claim checks — the shape of the bug this file
 * was just fixed for.
 *
 * Returns either a final verdict (the token failed a structural/claim check,
 * which needs no secret at all) or the pieces `finishReplayVerification` needs
 * once the caller has resolved the partner's secrets.
 */
function verifyReplayTokenParts(
  token: string | null,
): ReplayVerdict | { pending: { headerB64: string; payloadB64: string; sigB64: string; payload: ReplayTokenPayload; partnerId: string } } {
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
  return {
    pending: {
      headerB64,
      payloadB64,
      sigB64,
      payload: payload as ReplayTokenPayload,
      partnerId: payload.partner_id,
    },
  };
}

/** Signature + expiry, given the candidate secrets. Pure. */
function finishReplayVerification(
  pending: { headerB64: string; payloadB64: string; sigB64: string; payload: ReplayTokenPayload },
  secrets: string[],
  nowMs: number,
): ReplayVerdict {
  if (secrets.length === 0) return { ok: false, reason: 'unknown partner' };

  const actual = b64urlDecode(pending.sigB64);
  const signed = `${pending.headerB64}.${pending.payloadB64}`;
  const matched = secrets.some((secret) => {
    const expected = createHmac('sha256', secret).update(signed).digest();
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  });
  if (!matched) return { ok: false, reason: 'bad signature' };

  if (typeof pending.payload.exp !== 'number' || pending.payload.exp * 1000 < nowMs) {
    return { ok: false, reason: 'expired' };
  }
  return { ok: true, payload: pending.payload };
}

/**
 * Verify an HS256 replay JWT against the ENV map only.
 *
 * Retained for callers that cannot await and for the existing hermetic tests.
 * ⚠ This path cannot see M1c registry partners — `verifyReplayTokenAsync` is
 * the one to use in new code, and every production caller now does.
 */
export function verifyReplayToken(token: string | null, nowMs: number = Date.now()): ReplayVerdict {
  const step = verifyReplayTokenParts(token);
  if (!('pending' in step)) return step;
  const secret = getPartnerSecret(step.pending.partnerId);
  return finishReplayVerification(step.pending, secret ? [secret] : [], nowMs);
}

/**
 * Verify an HS256 replay JWT against the partner's LIVE secrets — the M1c
 * registry first, with the env map as the fallback `getPartner` already
 * applies. This is what makes a registry-created partner (evelyntutor) able
 * to open its own students' recordings.
 */
export async function verifyReplayTokenAsync(
  token: string | null,
  nowMs: number = Date.now(),
): Promise<ReplayVerdict> {
  const step = verifyReplayTokenParts(token);
  if (!('pending' in step)) return step;
  const secrets = await resolvePartnerTokenSecrets(step.pending.partnerId);
  return finishReplayVerification(step.pending, secrets, nowMs);
}
