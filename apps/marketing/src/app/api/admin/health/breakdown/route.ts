import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getVpsBreakdown } from '@/lib/ops/vps-collect';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/health/breakdown[?refresh=1]
 * Per-process memory and grouped disk usage for the admin System Health card.
 * Read-only; cached server-side for 15 minutes (a cold disk scan takes ~1 min).
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const refresh = req.nextUrl.searchParams.get('refresh') === '1';
    const data = await getVpsBreakdown({ refresh });
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[HEALTH/BREAKDOWN]', error);
    return NextResponse.json({ error: 'Breakdown failed' }, { status: 500 });
  }
}
