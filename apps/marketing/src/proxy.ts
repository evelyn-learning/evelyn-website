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

/**
 * Keystone (Castle Rock's review site) lives at /keystone/* in this app and is
 * served on its own host: keystone.evelynlearning.com/x → /keystone/x. API
 * routes and Next assets pass through untouched; /keystone/x on that host is
 * redirected to the short URL.
 */
const KEYSTONE_HOSTS = ['keystone.evelynlearning.com', 'keystone.localhost'];

function keystone(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname === '/favicon.ico' || pathname === '/favicon.png') {
    return NextResponse.next();
  }
  if (pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain' } });
  }
  if (pathname === '/keystone' || pathname.startsWith('/keystone/')) {
    // Build from the Host header: behind nginx nextUrl's host is the upstream (localhost:3001).
    const host = request.headers.get('host') || 'keystone.evelynlearning.com';
    const proto = request.headers.get('x-forwarded-proto') || (host.startsWith('keystone.localhost') ? 'http' : 'https');
    const target = new URL(`${pathname.slice('/keystone'.length) || '/'}${request.nextUrl.search}`, `${proto}://${host}`);
    return NextResponse.redirect(target, 308);
  }
  const url = request.nextUrl.clone();
  url.pathname = `/keystone${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').split(':')[0];
  if (KEYSTONE_HOSTS.includes(hostname)) return keystone(request);
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

// Every page path (Keystone's host needs them all); static files skip the proxy.
export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
