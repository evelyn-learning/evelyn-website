/** POST /api/tutor-portal/dashboard/keys/rotate: a new secret, shown once here. The old one keeps working for
 *  24 hours so the partner's servers can be switched without an outage. Owners only. */
import { NextResponse, type NextRequest } from 'next/server';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';
import { rotateSecret } from '@/lib/tutor/partner-dashboard/service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  const r = await rotateSecret(a.store, a.account);
  if (!r.ok) return json({ error: r.error }, 403);
  return json({ partnerId: a.account.partnerId, secret: r.secret, oldValidUntil: r.oldValidUntil.toISOString() });
}
