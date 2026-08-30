/**
 * Route-level enforcement for the demo gate. Applied to the routes that
 * actually cost money and previously had NO protection at all:
 * realtime-token (mints OpenAI ephemeral keys), chat, brain/stream,
 * generate-whiteboard, sketch. Every pre-existing limiter on those routes is
 * keyed on the client-supplied sessionId, i.e. defeated by minting a new id.
 *
 * A request is allowed when ANY of:
 *   1. The gate is 'off'.
 *   2. Its IP is allowlisted (internal testing / local dev).
 *   3. It carries a valid demo-grant cookie (set by /api/tutor/demo-start
 *      after the mandatory name+email form cleared the quotas — covers the
 *      retail /tutor page AND the same-origin marketing embed).
 *   4. It carries a fully-verified partner embed token (x-embed-token header
 *      or an explicit body token) — cross-origin partner embeds (crimsora,
 *      evelyntutor) can't rely on third-party cookies, and their students'
 *      quotas are the partner's own business (PartnerCounter limits). An
 *      'evelyn-marketing' token counts ONLY when it carries the demo_gate
 *      claim, which is stamped exclusively by the gated mint routes — an
 *      ungated legacy token (or the widget's old client-side btoa fallback)
 *      must not tunnel through the partner lane.
 *
 * In 'log' mode a would-be denial is logged and allowed.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifyEmbedTokenAsync } from '@/lib/tutor/portal/embed-token';
import { demoGateMode, demoGateSecret, gateClientIp, isAllowlistedIp } from './gate';
import { DEMO_GRANT_COOKIE, verifyDemoGrant, type DemoGrantPayload } from './grant';

export interface DemoAccessDecision {
  allow: boolean;
  reason?: string;
  /** Set when access came via a demo grant — carries the gated email. */
  grant?: DemoGrantPayload;
}

export async function checkDemoAccess(
  req: NextRequest,
  route: string,
  bodyToken?: string | null,
): Promise<DemoAccessDecision> {
  const mode = demoGateMode();
  if (mode === 'off') return { allow: true };

  const secret = demoGateSecret();
  if (!secret) {
    // No secret anywhere = gate inoperable. Fail open, loudly — denying every
    // student over a missing env var is the worse failure.
    console.error(`[demo-gate] ${route}: no TUTOR_DEMO_GATE_SECRET or evelyn-marketing partner secret — failing open`);
    return { allow: true, reason: 'no_secret' };
  }

  const grant = verifyDemoGrant(req.cookies.get(DEMO_GRANT_COOKIE)?.value, secret);
  if (grant) return { allow: true, grant };

  if (isAllowlistedIp(gateClientIp(req.headers))) return { allow: true, reason: 'allowlisted_ip' };

  const token = req.headers.get('x-embed-token') ?? bodyToken ?? null;
  if (token) {
    const verdict = await verifyEmbedTokenAsync(token);
    if (verdict.ok) {
      const p = verdict.payload;
      if (p.partner_id !== 'evelyn-marketing' || p.demo_gate === 1 || p.demo_gate === true) {
        return { allow: true };
      }
    }
  }

  if (mode === 'log') {
    console.warn(`[demo-gate] ${route}: would deny (no grant cookie, no verified token) — log mode, allowing`);
    return { allow: true, reason: 'log_mode' };
  }
  return { allow: false, reason: 'demo_gate_required' };
}

/**
 * Convenience wrapper: returns a ready 401 response to short-circuit with,
 * or null to proceed. The JSON shape gives clients something actionable.
 */
export async function denyIfNoDemoAccess(
  req: NextRequest,
  route: string,
  bodyToken?: string | null,
): Promise<NextResponse | null> {
  const decision = await checkDemoAccess(req, route, bodyToken);
  if (decision.allow) return null;
  return NextResponse.json(
    { error: 'demo_gate_required', message: 'Start a session from the demo page to continue.' },
    { status: 401 },
  );
}
