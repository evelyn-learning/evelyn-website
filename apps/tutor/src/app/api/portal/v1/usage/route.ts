/**
 * GET /api/portal/v1/usage — a partner reads its own tutoring minute pool.
 *
 * HMAC-signed like every portal call; the pool is keyed by the verified
 * partner id, so a partner can only ever see itself. A partner without a
 * pool answers { pooled: false }. Minutes are wall clock per sitting (see
 * lib/tutor/portal/partner-pool.ts); `session_ended.duration` stays ACTIVE
 * seconds. Partners should cache this for ~60 s server-side.
 * Spec: docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md §4.7
 */
import { NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { usageResponse } from '@/lib/tutor/portal/partner-pool';
import { readPoolSnapshot } from '@/lib/tutor/portal/partner-pool-store';

export const dynamic = 'force-dynamic';

export const GET = withPortalAuth(async (_req, auth) => {
  await connectDB();
  const snap = await readPoolSnapshot(auth.partnerId);
  return NextResponse.json(usageResponse(snap, auth.partnerId));
});
