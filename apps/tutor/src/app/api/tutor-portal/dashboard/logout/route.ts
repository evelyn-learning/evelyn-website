/** POST /api/tutor-portal/dashboard/logout: end this browser's session on the server and clear its cookie. */
import type { NextRequest } from 'next/server';
import { DASH_SESSION_COOKIE } from '@/lib/tutor/partner-dashboard/core';
import { clearSessionCookie, json, sameOrigin } from '@/lib/tutor/partner-dashboard/http';
import { mongoDashStore } from '@/lib/tutor/partner-dashboard/mongo-store';
import { signOut } from '@/lib/tutor/partner-dashboard/service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: 'bad_origin' }, 403);
  await signOut(mongoDashStore(), req.cookies.get(DASH_SESSION_COOKIE)?.value).catch(() => undefined);
  const res = json({ ok: true });
  clearSessionCookie(res);
  return res;
}
