/**
 * POST /api/tutor-portal/dashboard/verify { token }: use an emailed link. Creates the sandbox for a new email,
 * then signs the browser in. A POST from the link's page, never a GET: mail scanners open links, and a GET
 * that signed in would let the scanner use the link up.
 */
import type { NextRequest } from 'next/server';
import { json, sameOrigin, setSessionCookie } from '@/lib/tutor/partner-dashboard/http';
import { mongoDashStore, serviceEnv } from '@/lib/tutor/partner-dashboard/mongo-store';
import { useLink } from '@/lib/tutor/partner-dashboard/service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: 'bad_origin' }, 403);
  let body: { token?: unknown };
  try { body = (await req.json()) as { token?: unknown }; } catch { return json({ error: 'bad_request' }, 400); }
  try {
    const r = await useLink(mongoDashStore(), serviceEnv(), body.token);
    if (!r.ok) return json({ error: r.error }, r.error === 'rate_limited' ? 429 : 400);
    const res = json({ ok: true, created: r.created });
    setSessionCookie(res, r.sessionToken, r.expiresAt);
    return res;
  } catch (err) {
    console.error('[partner-dashboard] verify failed', (err as Error)?.message);
    return json({ error: 'unavailable' }, 503);
  }
}
