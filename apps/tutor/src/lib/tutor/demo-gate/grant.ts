/**
 * Demo-grant cookie — the credential POST /api/tutor/demo-start issues after
 * the name+email form clears the quota gate, and the thing the costly demo
 * routes verify. Pure (node:crypto only) so it's testable without Next.
 *
 * Shape: base64url(JSON payload) + '.' + base64url(HMAC-SHA256(payload)).
 * Not a JWT on purpose — it never leaves first-party cookies, needs no
 * header/alg negotiation, and must not be confusable with the embed JWT.
 *
 * Why a cookie and not a threaded token: the retail /tutor page and the
 * marketing-embed iframe are BOTH served from www.evelynlearning.com (nginx
 * routes /api/tutor/* and /tutor-portal/* to this app), so one httpOnly
 * same-site cookie set at demo-start rides automatically on every subsequent
 * fetch from either surface — including the frozen voice hook's
 * realtime-token fetches — with no client plumbing. Cross-origin PARTNER
 * embeds can't rely on third-party cookies, which is why enforcement also
 * accepts a verified partner embed token (see enforce.ts).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export const DEMO_GRANT_COOKIE = 'evelyn_demo_grant';
export const DEMO_DEVICE_COOKIE = 'evelyn_device';

/** 24h: outlives any session + reload-resume, well under quota windows. */
export const DEMO_GRANT_TTL_MS = 24 * 60 * 60 * 1000;

export interface DemoGrantPayload {
  /** Normalized (lowercase/trimmed) email the grant was issued to. */
  email: string;
  name?: string;
  iat: number;
  exp: number;
}

function b64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

export function signDemoGrant(
  payload: Omit<DemoGrantPayload, 'iat' | 'exp'>,
  secret: string,
  nowMs: number = Date.now(),
): string {
  const full: DemoGrantPayload = {
    ...payload,
    iat: Math.floor(nowMs / 1000),
    exp: Math.floor((nowMs + DEMO_GRANT_TTL_MS) / 1000),
  };
  const body = b64url(JSON.stringify(full));
  const sig = b64url(createHmac('sha256', secret).update(body).digest());
  return `${body}.${sig}`;
}

/** Never throws. null = missing/malformed/tampered/expired. */
export function verifyDemoGrant(
  value: string | null | undefined,
  secret: string,
  nowMs: number = Date.now(),
): DemoGrantPayload | null {
  if (!value || !secret) return null;
  const parts = value.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts as [string, string];
  let expected: Buffer;
  let actual: Buffer;
  try {
    expected = createHmac('sha256', secret).update(body).digest();
    actual = b64urlDecode(sig);
  } catch {
    return null;
  }
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  let payload: DemoGrantPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString('utf8'));
  } catch {
    return null;
  }
  if (typeof payload !== 'object' || payload === null) return null;
  if (typeof payload.email !== 'string' || !payload.email) return null;
  if (typeof payload.exp !== 'number' || payload.exp * 1000 < nowMs) return null;
  return payload;
}
