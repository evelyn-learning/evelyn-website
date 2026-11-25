/** GET /api/tutor-portal/dashboard/api-log: the partner's last calls to the partner API, newest first (kept two weeks). */
import { NextResponse, type NextRequest } from 'next/server';
import { listApiLog } from '@/lib/tutor/partner-dashboard/api-log';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const a = await requireAccount(req);
  if (a instanceof NextResponse) return a;
  return json({ rows: await listApiLog(a.account.partnerId, 150) });
}
