/** POST /api/tutor-portal/dashboard/keys/reveal: the partner's current secret in full. A POST so that no cache,
 *  log line or browser history keeps it. */
import { NextResponse, type NextRequest } from 'next/server';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  const secrets = await a.store.partnerSecrets(a.account.partnerId);
  if (!secrets.length) return json({ error: 'no_secret' }, 404);
  return json({ partnerId: a.account.partnerId, secret: secrets[0].secret });
}
