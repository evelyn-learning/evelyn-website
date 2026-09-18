import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Admin sign-in must happen on ONE host. NEXTAUTH_URL is the apex
 * (https://evelynlearning.com) and next-auth's OAuth state/PKCE cookies are
 * host-only, so a sign-in started on www.evelynlearning.com sets its cookie
 * on www and the Google callback — which Google sends to NEXTAUTH_URL's
 * host — cannot read it: OAUTH_CALLBACK_ERROR (2026-09-18, Praveen).
 * nginx serves both hosts without a redirect, so the fix lives here (Next 16
 * "proxy" file convention, formerly middleware): any
 * /admin or /api/auth request on www is sent to the same path on the apex.
 * Everything else is untouched (www stays the public canonical host).
 */
const APEX_HOST = 'evelynlearning.com';
const WWW_HOST = `www.${APEX_HOST}`;
const SINGLE_HOST_PREFIXES = ['/admin', '/api/auth'];

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').split(':')[0];
  if (hostname !== WWW_HOST) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const pinned = SINGLE_HOST_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!pinned) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.host = APEX_HOST;
  url.protocol = 'https:';
  url.port = '';
  // 308 keeps the method, so a POST to /api/auth/* survives the hop.
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/api/auth/:path*'],
};
