/**
 * What every dashboard API route does first: find the signed-in account from the session cookie, and for a
 * request that changes something, check it came from our own pages.
 *
 * The cookie is SameSite=Lax, which already keeps another site's form POST from carrying it; the Origin check
 * is the second lock, for the browsers and embeds where Lax is not enforced.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { DASH_SESSION_COOKIE } from './core';
import { mongoDashStore, type MongoDashStore } from './mongo-store';
import { accountForSession, type AccountRow } from './service';

export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // not a browser cross-site request: those always send Origin on a POST
  try {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
    return new URL(origin).host === host;
  } catch { return false; }
}

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export type Authed = { store: MongoDashStore; account: AccountRow; token: string };

/** The signed-in account, or the response to send in its place (401, or 403 for a cross-site write). */
export async function requireAccount(req: NextRequest, opts: { write?: boolean } = {}): Promise<Authed | NextResponse> {
  if (opts.write && !sameOrigin(req)) return json({ error: 'bad_origin' }, 403);
  const token = req.cookies.get(DASH_SESSION_COOKIE)?.value || '';
  const store = mongoDashStore();
  const account = await accountForSession(store, token);
  if (!account) return json({ error: 'signed_out' }, 401);
  return { store, account, token };
}

export function setSessionCookie(res: NextResponse, token: string, expiresAt: Date): void {
  res.cookies.set(DASH_SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires: expiresAt });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(DASH_SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
}

/** The origin the visitor is on, for links that must open on the same host (a replay, a test lesson). */
export function requestOrigin(req: NextRequest): string {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'tutor.evelynlearning.com';
  const proto = req.headers.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') || host.includes('.localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}
