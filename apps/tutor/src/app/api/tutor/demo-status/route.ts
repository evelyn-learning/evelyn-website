/**
 * GET /api/tutor/demo-status — read-only quota status for the demo surfaces
 * (demo-gate follow-up, 2026-08-30). Lets the UI tell a visitor they've used
 * their last free demo AT THE END OF IT — proactively steering them to the
 * production sites — instead of letting them fill the form again and learn it
 * from a 429.
 *
 * Identity comes from the VERIFIED grant cookie (email) + device cookie + IP;
 * nothing client-supplied is trusted. Read-only: never reserves or increments
 * anything. Always 200 and fails open to { exhausted: false } — this endpoint
 * only ever gates MESSAGING; demo-start remains the enforcement point.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { TutorDemoCounter } from '@/models/TutorDemoCounter';
import { TutorDemoLead } from '@/models/TutorDemoLead';
import {
  demoGateLimits,
  demoGateMode,
  demoGateSecret,
  gateClientIp,
  isAllowlistedIp,
} from '@/lib/tutor/demo-gate/gate';
import { DEMO_DEVICE_COOKIE, DEMO_GRANT_COOKIE, verifyDemoGrant } from '@/lib/tutor/demo-gate/grant';
import { utcDateKey } from '@/lib/tutor/demo-gate/counter';

const OPEN = { exhausted: false as const, remaining: null };

export async function GET(req: NextRequest) {
  try {
    if (demoGateMode() === 'off') return NextResponse.json(OPEN);
    const ip = gateClientIp(req.headers);
    if (isAllowlistedIp(ip)) return NextResponse.json(OPEN);

    const grant = verifyDemoGrant(req.cookies.get(DEMO_GRANT_COOKIE)?.value, demoGateSecret());
    const deviceId = req.cookies.get(DEMO_DEVICE_COOKIE)?.value?.slice(0, 64);
    const limits = demoGateLimits();
    const day = utcDateKey();

    await connectDB();
    const remainings: number[] = [];
    if (grant && limits.perEmailLifetime > 0) {
      const lead = await TutorDemoLead.findOne({ email: grant.email }).lean<{ startCount?: number } | null>();
      remainings.push(Math.max(0, limits.perEmailLifetime - (lead?.startCount ?? 0)));
    }
    if (ip && limits.perIpPerDay > 0) {
      const c = await TutorDemoCounter.findOne({ key: `demo:ip:${ip}:${day}` }).lean<{ count?: number } | null>();
      remainings.push(Math.max(0, limits.perIpPerDay - (c?.count ?? 0)));
    }
    if (deviceId && limits.perDevicePerDay > 0) {
      const c = await TutorDemoCounter.findOne({ key: `demo:device:${deviceId}:${day}` }).lean<{ count?: number } | null>();
      remainings.push(Math.max(0, limits.perDevicePerDay - (c?.count ?? 0)));
    }
    if (remainings.length === 0) return NextResponse.json(OPEN);

    const remaining = Math.min(...remainings);
    return NextResponse.json({ exhausted: remaining <= 0, remaining });
  } catch (err) {
    console.warn('[demo-gate] demo-status failed open:', err);
    return NextResponse.json(OPEN);
  }
}
