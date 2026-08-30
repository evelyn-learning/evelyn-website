import { NextRequest, NextResponse } from 'next/server';
import { demoGateMode, demoGateSecret } from '@/lib/tutor/demo-gate/gate';
import { DEMO_GRANT_COOKIE, verifyDemoGrant } from '@/lib/tutor/demo-gate/grant';
import { mintDemoEmbedToken } from '@/lib/tutor/demo-gate/mint';

/**
 * POST /api/tutor-portal/demo-token — first-party signed-token mint for the
 * ENGINE's own marketing demo funnel (learner-model Phase C, Task 5).
 *
 * DEMO GATE (2026-08-29): this route used to be deliberately unauthenticated
 * on the argument that its forced demo-scoped claims WERE the auth guarantee.
 * That argument covered identity but not COST — anyone could mint unlimited
 * demo tokens and run unlimited sessions (one demo student ran 16 from one
 * IP). It now requires a valid demo-grant cookie (issued by
 * /api/tutor/demo-start after the mandatory name+email form clears the
 * per-email/IP/device quotas) when TUTOR_DEMO_GATE is 'on'. New surfaces
 * should call /api/tutor/demo-start directly — it mints the same token; this
 * route remains for the /tutor reload-resume self-mint, whose browser holds
 * the grant cookie from the original start.
 *
 * The forced-claims mint itself lives in demo-gate/mint.ts (shared with
 * demo-start so the two paths cannot drift); it still forces
 * `partner_id: 'evelyn-marketing'`, a fresh `demo-<random>` student_id and a
 * 2h exp onto every response, and now also stamps `demo_gate: 1`, which is
 * what the costly-route enforcement (demo-gate/enforce.ts) checks for on
 * evelyn-marketing tokens.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', reason: 'invalid_json' }, { status: 400 });
  }

  const config = (body as { config?: unknown } | null)?.config;
  if (typeof config !== 'object' || config === null || Array.isArray(config)) {
    return NextResponse.json({ error: 'bad_request', reason: 'missing_config' }, { status: 400 });
  }

  if (demoGateMode() === 'on') {
    const secret = demoGateSecret();
    // No secret = gate inoperable → fail open with a loud log (matches
    // enforce.ts) rather than bricking the funnel over a missing env var.
    if (secret) {
      const grant = verifyDemoGrant(req.cookies.get(DEMO_GRANT_COOKIE)?.value, secret);
      if (!grant) {
        return NextResponse.json({ error: 'demo_gate_required' }, { status: 401 });
      }
    } else {
      console.error('[demo-gate] demo-token: no secret configured — failing open');
    }
  }

  const { token } = mintDemoEmbedToken(config as Record<string, unknown>);
  return NextResponse.json({ token });
}
