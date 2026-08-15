import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getPartnerSecret } from '@/lib/tutor/portal/auth';
import { signEmbedToken } from '@/lib/tutor/portal/embed-token';

/**
 * POST /api/tutor-portal/demo-token — first-party signed-token mint for the
 * ENGINE's own marketing demo funnel (learner-model Phase C, Task 5).
 *
 * The demo (`VoiceTutorLiveDemo.tsx`, /products/* and /solutions/[segment])
 * used to build its embed token client-side via a bare `btoa` — fine while
 * embed tokens were unsigned, but Task 1's HS256 verifier means an unsigned
 * token now fails verification once EMBED_TOKEN_ENFORCE is 'on'. Browsers
 * can't hold the HMAC partner secret, so signing has to happen server-side.
 *
 * Deliberately UNAUTHENTICATED (no caller identity check): that's safe here
 * because this route mints ONLY demo-scoped identities. The server — not the
 * client — forces `partner_id: 'evelyn-marketing'` and a fresh
 * `demo-<random>` `student_id` onto every response, overriding anything the
 * caller sent in `config`. There is no way to mint a token for a real
 * partner or a real student through this endpoint; the forced claims ARE
 * the auth guarantee. This mirrors exactly what the old unsigned client-side
 * btoa path already allowed (anyone could hand-craft that base64 token), so
 * this endpoint introduces no new capability — it only lets the funnel keep
 * working once enforcement turns on.
 *
 * If no `evelyn-marketing` partner secret is configured (PORTAL_PARTNER_SECRETS
 * / PORTAL_PARTNER_ID+PORTAL_API_SECRET), this degrades to the legacy
 * unsigned base64 encoding rather than failing — the same shape
 * `verifyEmbedToken` already treats as a no-op in `off`-mode deployments.
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

  // Forced claims spread AFTER the client-supplied config so a spoofed
  // partner_id/student_id/exp in `config` is always overridden, never merged.
  const payload: Record<string, unknown> = {
    ...(config as Record<string, unknown>),
    partner_id: 'evelyn-marketing',
    student_id: `demo-${randomUUID().slice(0, 8)}`,
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
  };

  const secret = getPartnerSecret('evelyn-marketing');
  if (!secret) {
    // Degrade path: no marketing secret configured (e.g. local/dev, or
    // enforcement not yet rolled out) — fall back to the legacy unsigned
    // base64 encoding the demo used before Task 1. UTF-8-safe, matching
    // buildEmbedToken's existing btoa(unescape(encodeURIComponent(...))).
    const token = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    return NextResponse.json({ token });
  }

  const token = signEmbedToken(payload, secret);
  return NextResponse.json({ token });
}
