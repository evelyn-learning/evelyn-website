/** GET /api/tutor-portal/dashboard/export: the partner's sessions as a CSV file (one row a session, newest first). */
import { NextResponse, type NextRequest } from 'next/server';
import { exportSessionRows, sessionsCsv } from '@/lib/tutor/partner-dashboard/data';
import { requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const a = await requireAccount(req);
  if (a instanceof NextResponse) return a;
  const csv = sessionsCsv(await exportSessionRows(a.account.partnerId));
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${a.account.partnerId}-sessions.csv"`, 'Cache-Control': 'no-store' } });
}
