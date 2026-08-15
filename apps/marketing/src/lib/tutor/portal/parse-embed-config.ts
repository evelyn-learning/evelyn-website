/**
 * Non-authoritative embed-token → config parsing (learner-model Phase C,
 * Task 5 fix round 1).
 *
 * Client-safe: no `node:crypto`, no env reads. This module ONLY decodes —
 * it NEVER verifies a signature. Verification is server-side only, via
 * `verifyEmbedToken` (embed-token.ts), applied at the API routes through
 * `checkEmbedAuth`. The embed page uses this purely to read UI config out
 * of whatever token landed in the query string, whether that's a signed
 * HS256 JWT (Task 1 / Task 5's demo-token mint) or the legacy unsigned
 * base64 blob still used by some existing partner integrations.
 *
 * A signed 3-segment JWT (`header.payload.sig`) was previously rejected
 * outright by the embed page's old `atob(entireToken)` parse (the `.`
 * separators aren't in the base64 alphabet), which broke every signed
 * token's success path. Accepts, in order:
 *   (a) a 3-segment JWT — base64url-decode the MIDDLE (payload) segment
 *       only and JSON.parse it. The header and signature are never
 *       inspected here — that's the verifier's job, not this parser's.
 *   (b) the legacy whole-string base64 (UTF-8-safe).
 *   (c) plain `JSON.parse(decodeURIComponent(...))` (sandbox/manual testing).
 * Returns null if none of the above yield a JSON object.
 */

function decodeBase64Utf8(input: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(input, 'base64').toString('utf8');
  }
  // Browser fallback: atob gives a binary (Latin1) string — recover UTF-8,
  // the inverse of btoa(unescape(encodeURIComponent(...))).
  return decodeURIComponent(escape(atob(input)));
}

function decodeBase64UrlUtf8(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  return decodeBase64Utf8(padded);
}

/**
 * Parse an embed token into its config payload. Never throws — returns
 * null on any decode/parse failure. Generic so callers keep their own
 * (page-local) config type rather than this module owning it.
 */
export function parseEmbedConfig<T = Record<string, unknown>>(
  tokenParam: string | null,
): T | null {
  if (!tokenParam) return null;

  // (a) 3-segment JWT — decode the payload segment only, unverified.
  const parts = tokenParam.split('.');
  if (parts.length === 3 && parts.every((p) => p.length > 0)) {
    try {
      const payload: unknown = JSON.parse(decodeBase64UrlUtf8(parts[1]));
      if (payload && typeof payload === 'object') return payload as T;
    } catch {
      // Not a valid JWT payload — fall through to the legacy paths below.
    }
  }

  // (b) legacy whole-string base64.
  try {
    const decoded: unknown = JSON.parse(decodeBase64Utf8(tokenParam));
    if (decoded && typeof decoded === 'object') return decoded as T;
  } catch {
    // fall through
  }

  // (c) plain JSON (sandbox/manual testing).
  try {
    const decoded: unknown = JSON.parse(decodeURIComponent(tokenParam));
    if (decoded && typeof decoded === 'object') return decoded as T;
  } catch {
    return null;
  }

  return null;
}
