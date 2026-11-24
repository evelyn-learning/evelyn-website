/**
 * POST /api/tutor-portal/dashboard/start: ask for an emailed link. An email with an account gets a sign-in
 * link; a new email, with a name, a company and the terms accepted, gets a link that creates its sandbox.
 * The answer is the same for both, so the form does not reveal which emails have accounts.
 */
import type { NextRequest } from 'next/server';
import { gateClientIp } from '@/lib/tutor/demo-gate/gate';
import { json, sameOrigin } from '@/lib/tutor/partner-dashboard/http';
import { mongoDashStore, serviceEnv } from '@/lib/tutor/partner-dashboard/mongo-store';
import { requestLink } from '@/lib/tutor/partner-dashboard/service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: 'bad_origin' }, 403);
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return json({ error: 'bad_request' }, 400); }
  // A field no person fills in (hidden on the page): a filled one is a form-filling bot, answered as if it worked.
  if (typeof body.website2 === 'string' && body.website2) return json({ ok: true });
  try {
    const r = await requestLink(mongoDashStore(), serviceEnv(), { email: body.email, name: body.name, company: body.company, useCase: body.useCase, acceptTerms: body.acceptTerms, ip: gateClientIp(req.headers) });
    if (r.ok) return json({ ok: true });
    return json({ error: r.error }, r.error === 'rate_limited' ? 429 : r.error === 'signup_closed' ? 403 : 400);
  } catch (err) {
    console.error('[partner-dashboard] start failed', (err as Error)?.message);
    return json({ error: 'unavailable' }, 503);
  }
}
