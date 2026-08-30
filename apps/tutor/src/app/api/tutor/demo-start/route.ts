/**
 * POST /api/tutor/demo-start — THE demo gate (demo-abuse restrictions,
 * 2026-08-29). Both anonymous demo surfaces call this before a session
 * starts: the retail /tutor page and the marketing VoiceTutorLiveDemo embed
 * (both served from www.evelynlearning.com; nginx routes /api/tutor/* here).
 *
 * Body: { name, email, config? } — name and email are now MANDATORY for the
 * demo. `config` is the same embed-config shape the legacy demo-token route
 * accepts; the response token is a drop-in replacement for that route's.
 *
 * Flow (Crimsora's reserve-then-rollback gate, ported):
 *   validate name+email → resolve IP + device cookie →
 *   allowlisted? skip quotas : reserve global-day → email-lifetime →
 *   ip-day → device-day (rolling back everything reserved on any failure) →
 *   record lead → mint gated embed token → set grant + device cookies.
 *
 * Deny responses (mode 'on' only): 429 { error: 'demo_limit', reason } where
 * reason ∈ demo_busy | email_limit | ip_limit. Validation: 400
 * { error: 'invalid_name' | 'invalid_email' }.
 *
 * Mongo unreachable → FAIL OPEN with a loud log: the gate exists to stop
 * freeloaders, not to add a new way for the demo to die.
 */

import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { TutorDemoLead } from '@/models/TutorDemoLead';
import {
  demoGateLimits,
  demoGateMode,
  demoGateSecret,
  gateClientIp,
  isAllowlistedIp,
  normalizeDemoEmail,
  normalizeDemoName,
} from '@/lib/tutor/demo-gate/gate';
import {
  reserveCounter,
  reserveLead,
  rollbackCounter,
  rollbackLead,
  utcDateKey,
} from '@/lib/tutor/demo-gate/counter';
import {
  DEMO_DEVICE_COOKIE,
  DEMO_GRANT_COOKIE,
  DEMO_GRANT_TTL_MS,
  signDemoGrant,
} from '@/lib/tutor/demo-gate/grant';
import { mintDemoEmbedToken } from '@/lib/tutor/demo-gate/mint';

const DEVICE_COOKIE_MAX_AGE_S = 365 * 24 * 60 * 60;

export async function POST(req: NextRequest) {
  let body: { name?: unknown; email?: unknown; config?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', reason: 'invalid_json' }, { status: 400 });
  }

  const name = normalizeDemoName(body.name);
  if (!name) return NextResponse.json({ error: 'invalid_name' }, { status: 400 });
  const email = normalizeDemoEmail(body.email);
  if (!email) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });

  const config =
    typeof body.config === 'object' && body.config !== null && !Array.isArray(body.config)
      ? (body.config as Record<string, unknown>)
      : {};

  const mode = demoGateMode();
  const ip = gateClientIp(req.headers);
  // Reuse the browser's device id or mint one; set on EVERY response
  // (including denials) so a blocked attempt still tags the browser.
  const deviceId = (req.cookies.get(DEMO_DEVICE_COOKIE)?.value || randomUUID()).slice(0, 64);

  let denial: 'demo_busy' | 'email_limit' | 'ip_limit' | null = null;

  if (mode !== 'off' && !isAllowlistedIp(ip)) {
    try {
      await connectDB();
      const limits = demoGateLimits();
      const day = utcDateKey();
      const reserved: Array<() => Promise<void>> = [];
      const reserve = async (
        ok: boolean,
        undo: () => Promise<void>,
        code: 'demo_busy' | 'email_limit' | 'ip_limit',
      ): Promise<boolean> => {
        if (!ok) {
          denial = code;
          await Promise.all(reserved.map((fn) => fn()));
          return false;
        }
        reserved.push(undo);
        return true;
      };

      const globalOk = await reserveCounter(`demo:global:${day}`, limits.globalPerDay);
      if (await reserve(globalOk, () => rollbackCounter(`demo:global:${day}`), 'demo_busy')) {
        const leadOk = await reserveLead({ email, name, cap: limits.perEmailLifetime, ip });
        if (await reserve(leadOk, () => rollbackLead(email), 'email_limit')) {
          const ipOk = ip ? await reserveCounter(`demo:ip:${ip}:${day}`, limits.perIpPerDay) : true;
          if (await reserve(ipOk, () => rollbackCounter(`demo:ip:${ip}:${day}`), 'ip_limit')) {
            const devOk = await reserveCounter(`demo:device:${deviceId}:${day}`, limits.perDevicePerDay);
            await reserve(devOk, () => rollbackCounter(`demo:device:${deviceId}:${day}`), 'ip_limit');
          }
        }
      }
    } catch (err) {
      console.error('[demo-gate] demo-start: Mongo unreachable — failing open', err);
      denial = null;
    }
  }

  if (denial && mode === 'on') {
    const res = NextResponse.json({ error: 'demo_limit', reason: denial }, { status: 429 });
    setDeviceCookie(res, deviceId);
    return res;
  }
  if (denial) {
    console.warn(`[demo-gate] demo-start: would deny (${denial}) — ${mode} mode, allowing`);
  }

  const { token, studentId } = mintDemoEmbedToken(config, name);

  // Stamp the minted student id onto the lead (best-effort, forensics).
  try {
    await TutorDemoLead.updateOne({ email }, { $set: { lastStudentId: studentId } });
  } catch {
    /* non-fatal */
  }

  const res = NextResponse.json({ token });
  const secret = demoGateSecret();
  if (secret) {
    res.cookies.set(DEMO_GRANT_COOKIE, signDemoGrant({ email, name }, secret), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Math.floor(DEMO_GRANT_TTL_MS / 1000),
    });
  } else {
    console.error('[demo-gate] demo-start: no secret configured — grant cookie NOT set');
  }
  setDeviceCookie(res, deviceId);
  return res;
}

function setDeviceCookie(res: NextResponse, deviceId: string): void {
  res.cookies.set(DEMO_DEVICE_COOKIE, deviceId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DEVICE_COOKIE_MAX_AGE_S,
  });
}
