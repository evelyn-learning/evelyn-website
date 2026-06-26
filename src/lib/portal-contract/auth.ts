/**
 * Portal Contract — service-to-service request signing (portable).
 *
 * Framework-free HMAC-SHA256 request signing shared by the engine (verify
 * side) and the future portal (sign side). Depends only on `node:crypto`,
 * so it travels into the standalone `@evelyn/portal-contract` package
 * unchanged (assumes a Node runtime on both ends).
 *
 * Wire protocol — the portal sends three headers with every request:
 *   x-evelyn-partner    : partner id (selects the shared secret)
 *   x-evelyn-timestamp  : unix epoch milliseconds (string)
 *   x-evelyn-signature  : hex HMAC-SHA256 over the canonical signing string
 *
 * The signature binds the request to its METHOD + PATH + TIMESTAMP + BODY,
 * so a captured signature cannot be replayed against a different endpoint,
 * and the timestamp window (±5 min) bounds replay of the same request.
 *
 * NOTE: body-bound HMAC cannot be verified in Next.js edge middleware (the
 * body is not readable there), so the engine verifies in an app-level route
 * wrapper (`withPortalAuth`) rather than in `src/middleware.ts`.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export const PORTAL_PARTNER_HEADER = 'x-evelyn-partner';
export const PORTAL_TIMESTAMP_HEADER = 'x-evelyn-timestamp';
export const PORTAL_SIGNATURE_HEADER = 'x-evelyn-signature';

/** Replay window: a request's timestamp must be within ±5 min of now. */
export const PORTAL_SIGNATURE_WINDOW_MS = 5 * 60 * 1000;

export interface SigningParts {
  /** HTTP method, e.g. "POST". Case-insensitive (upper-cased internally). */
  method: string;
  /** URL path INCLUDING the query string (no host), e.g.
   *  "/api/portal/v1/reads/gaps?studentId=p:alice". Query params are part of
   *  the signature so GET read parameters are integrity-protected. */
  path: string;
  /** The exact timestamp header string the client sends. */
  timestamp: string;
  /** Raw request body string ("" for empty / GET). */
  body: string;
}

/** Canonical string that gets HMAC'd. Both ends MUST build it identically. */
export function buildSigningString(parts: SigningParts): string {
  return `${parts.timestamp}.${parts.method.toUpperCase()}.${parts.path}.${parts.body}`;
}

/** Produce the hex signature for a request (portal side; also used in tests). */
export function signPortalRequest(secret: string, parts: SigningParts): string {
  return createHmac('sha256', secret).update(buildSigningString(parts)).digest('hex');
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'bad_timestamp' | 'stale_timestamp' | 'bad_signature' };

/** Verify a signed request (engine side). Constant-time signature compare;
 *  `nowMs` is injectable for deterministic tests. */
export function verifyPortalSignature(
  secret: string,
  parts: SigningParts,
  signature: string,
  nowMs: number = Date.now(),
): VerifyResult {
  const ts = Number(parts.timestamp);
  if (!Number.isFinite(ts)) return { ok: false, reason: 'bad_timestamp' };
  if (Math.abs(nowMs - ts) > PORTAL_SIGNATURE_WINDOW_MS) {
    return { ok: false, reason: 'stale_timestamp' };
  }
  const expected = signPortalRequest(secret, parts);
  // Hex-decode both so timingSafeEqual gets equal-length buffers when the
  // candidate is well-formed; length mismatch → reject without comparing.
  let a: Buffer;
  let b: Buffer;
  try {
    a = Buffer.from(expected, 'hex');
    b = Buffer.from(signature ?? '', 'hex');
  } catch {
    return { ok: false, reason: 'bad_signature' };
  }
  if (a.length === 0 || a.length !== b.length) return { ok: false, reason: 'bad_signature' };
  if (!timingSafeEqual(a, b)) return { ok: false, reason: 'bad_signature' };
  return { ok: true };
}
