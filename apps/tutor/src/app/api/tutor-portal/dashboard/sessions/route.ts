/** GET /api/tutor-portal/dashboard/sessions?page=: the partner's own sessions, newest first. */
import { NextResponse, type NextRequest } from 'next/server';
import { listSessions } from '@/lib/tutor/partner-dashboard/data';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const a = await requireAccount(req);
  if (a instanceof NextResponse) return a;
  return json(await listSessions(a.account.partnerId, Number(req.nextUrl.searchParams.get('page')) || 1));
}
