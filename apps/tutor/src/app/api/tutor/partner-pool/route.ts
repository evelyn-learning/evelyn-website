/**
 * GET /api/tutor/partner-pool — the embed frame reads its partner's minute pool.
 *
 * Token: `x-embed-token` header or `?token=`. The verified token's
 * `partner_id` names the pool; no token at all (retail /tutor, demo pages)
 * or a partner without a pool row → `{ pooled: false }`, i.e. no behaviour
 * change. A Mongo failure answers `{ pooled: false, error: 'unavailable' }`
 * so the frame starts the session anyway (fail open). 401 only when
 * EMBED_TOKEN_ENFORCE is `on` and a token was sent but is invalid.
 * Spec: docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md §4.3
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { checkEmbedAuthAsync } from '@/lib/tutor/portal/embed-token';
import { poolFlagOn } from '@/lib/tutor/portal/partner-pool';
import { readPoolSnapshot } from '@/lib/tutor/portal/partner-pool-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!poolFlagOn(process.env.TUTOR_PARTNER_POOL)) return NextResponse.json({ pooled: false });

  const token = req.headers.get('x-embed-token') ?? new URL(req.url).searchParams.get('token');
  if (!token) return NextResponse.json({ pooled: false });

  const auth = await checkEmbedAuthAsync({ token, route: 'partner-pool:GET' });
  if (!auth.allow) {
    return NextResponse.json({ error: 'unauthorized', reason: auth.reason }, { status: 401 });
  }
  const partnerId = auth.payload?.partner_id;
  if (!partnerId) return NextResponse.json({ pooled: false });

  try {
    await connectDB();
  } catch (err) {
    console.warn('[partner-pool] partner_pool_unavailable connectDB', (err as Error)?.message);
    return NextResponse.json({ pooled: false, error: 'unavailable' });
  }
  const snap = await readPoolSnapshot(partnerId);
  if (!snap.pooled) return NextResponse.json({ pooled: false });
  return NextResponse.json({
    pooled: true,
    cap_sec: snap.capSec,
    used_sec: snap.usedSec,
    remaining_sec: snap.remainingSec,
    session_max_sec: snap.sessionMaxSec,
    idle_end_sec: snap.idleEndSec,
    exhausted: snap.exhausted,
  });
}
