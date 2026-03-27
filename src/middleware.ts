import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0]; // Strip port for local dev

  // tutor.evelynlearning.com or tutor.localhost → rewrite to /tutor-portal/*
  if (hostname === 'tutor.evelynlearning.com' || hostname === 'tutor.localhost') {
    const url = request.nextUrl.clone();
    url.pathname = `/tutor-portal${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // tutor-sandbox.evelynlearning.com → same rewrite (sandbox flag added via header)
  if (hostname === 'tutor-sandbox.evelynlearning.com') {
    const url = request.nextUrl.clone();
    url.pathname = `/tutor-portal${url.pathname === '/' ? '' : url.pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-evelyn-sandbox', 'true');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|images/|fonts/).*)',
  ],
};
