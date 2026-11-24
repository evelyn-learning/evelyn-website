/** POST / DELETE /api/tutor-portal/dashboard/members { email }: give a colleague access, or take it away.
 *  Owners only. A member signs in with their own emailed link. */
import { NextResponse, type NextRequest } from 'next/server';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';
import { serviceEnv } from '@/lib/tutor/partner-dashboard/mongo-store';
import { addMember, removeMember } from '@/lib/tutor/partner-dashboard/service';

export const dynamic = 'force-dynamic';

async function run(req: NextRequest, add: boolean) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  let body: { email?: unknown };
  try { body = (await req.json()) as { email?: unknown }; } catch { return json({ error: 'bad_request' }, 400); }
  const r = add ? await addMember(a.store, serviceEnv(), a.account, body.email) : await removeMember(a.store, a.account, body.email);
  return r.ok ? json({ ok: true }) : json({ error: r.error }, r.error === 'owner_only' ? 403 : 400);
}

export const POST = (req: NextRequest) => run(req, true);
export const DELETE = (req: NextRequest) => run(req, false);
