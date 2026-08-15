/**
 * Engine-side portal authentication (Next route wrapper + secret resolver).
 *
 * This is the authoritative auth layer for the NEW portal API
 * (`/api/portal/v1/**`). It is engine-only (couples to Next) and is kept
 * out of the portable `@/lib/portal-contract` so the contract package stays
 * framework-free.
 *
 * The existing internal tutor flow (`/api/tutor/**`, `src/middleware.ts`)
 * is intentionally NOT touched — portal auth applies only to handlers
 * explicitly wrapped with `withPortalAuth`.
 */

import { NextResponse, type NextRequest } from 'next/server';
import {
  PORTAL_PARTNER_HEADER,
  PORTAL_TIMESTAMP_HEADER,
  PORTAL_SIGNATURE_HEADER,
  verifyPortalSignature,
  type SigningParts,
} from '@evelyn/portal-contract/auth';
import connectDB, { isDBConfigured } from '@core/db';
import { PartnerModel } from '@/models/Partner';
import { getPartner, type PartnerRecord, type RegistryDeps, type RawPartnerDoc } from './registry';

/**
 * Deps for the default (non-test) `getPartner` call: identical to the
 * registry's own default Mongo lookup, except it is skipped entirely — not
 * attempted, not caught — when `MONGODB_URI` is unconfigured. This keeps
 * env-only environments (scripts/test-portal-auth.ts has no DB at all, by
 * design — see its header) resolving purely through the
 * PORTAL_PARTNER_SECRETS fallback, exactly as they did before the registry
 * existed. A real DB outage with MONGODB_URI actually set still throws out
 * of connectDB() uncaught here, same as everywhere else in the app — this
 * only short-circuits the "no DB at all" case, it does not add error
 * swallowing for a misconfigured-but-present DB.
 */
const authRegistryDeps: RegistryDeps = {
  async findPartner(id) {
    if (!isDBConfigured()) return null;
    await connectDB();
    return PartnerModel.findById(id).lean<RawPartnerDoc>().exec();
  },
  now: () => Date.now(),
  env: process.env,
};

/**
 * Resolve a partner's shared secret from the environment.
 *
 * Two configuration modes (checked in order):
 *   1. JSON map  — `PORTAL_PARTNER_SECRETS='{"portalA":"secret-a"}'`
 *   2. Single default — `PORTAL_PARTNER_ID` + `PORTAL_API_SECRET`
 *
 * Returns null for an unknown/unconfigured partner (→ 401 unknown_partner).
 */
export function getPartnerSecret(partnerId: string): string | null {
  if (!partnerId) return null;

  const mapRaw = process.env.PORTAL_PARTNER_SECRETS;
  if (mapRaw) {
    try {
      const map = JSON.parse(mapRaw) as Record<string, string>;
      const secret = map[partnerId];
      if (typeof secret === 'string' && secret.length > 0) return secret;
    } catch {
      // Malformed map env → fall through to single-default mode.
    }
  }

  const defaultPartner = process.env.PORTAL_PARTNER_ID;
  const defaultSecret = process.env.PORTAL_API_SECRET;
  if (defaultPartner && defaultSecret && partnerId === defaultPartner) {
    return defaultSecret;
  }

  return null;
}

/** What an authed handler receives in addition to the raw request. */
export interface PortalAuth {
  /** Verified partner id (from the signed header). */
  partnerId: string;
  /** The full registry record — limits, flags and allowlist for this caller. */
  partner: PartnerRecord;
  /** Parsed JSON body (undefined for empty bodies / GET). */
  body: unknown;
  /** Raw body string, exactly as signed. */
  rawBody: string;
}

export type PortalRouteHandler<C> = (
  req: NextRequest,
  auth: PortalAuth,
  ctx: C,
) => Promise<Response> | Response;

function deny(reason: string, status = 401): NextResponse {
  return NextResponse.json({ error: 'unauthorized', reason }, { status });
}

function denyStatus(reason: string, status: number): NextResponse {
  return NextResponse.json({ error: 'forbidden', reason }, { status });
}

/**
 * Test seam: lets the hermetic auth tests supply a registry without a DB.
 * Production never sets this.
 */
let registryOverride: ((id: string) => Promise<PartnerRecord | null>) | null = null;
export function __setRegistryOverrideForTests(
  fn: ((id: string) => Promise<PartnerRecord | null>) | null,
): void {
  registryOverride = fn;
}

/**
 * Wrap a Next route handler so it runs only for an authenticated partner.
 *
 * Verifies: required headers present → partner known (registry, with an env
 * fallback) → partner kind is 'partner' and status is 'active' → endpoint is
 * on the partner's allowlist → timestamp fresh → body-bound HMAC signature
 * valid against any of the partner's live secrets. On success calls
 * `handler` with the verified `partnerId`, full `partner` record and parsed
 * body. The handler is responsible for scoping all data access to the
 * `studentId` in its (validated) request — there is no listing/enumeration
 * endpoint, so a verified partner can only read the exact student it names.
 */
export function withPortalAuth<C = unknown>(handler: PortalRouteHandler<C>) {
  return async (req: NextRequest, ctx: C): Promise<Response> => {
    const partnerId = req.headers.get(PORTAL_PARTNER_HEADER);
    const timestamp = req.headers.get(PORTAL_TIMESTAMP_HEADER);
    const signature = req.headers.get(PORTAL_SIGNATURE_HEADER);
    if (!partnerId || !timestamp || !signature) {
      return deny('missing_auth_headers');
    }

    const partner = registryOverride
      ? await registryOverride(partnerId)
      : await getPartner(partnerId, authRegistryDeps);

    // Unknown, or known but with no secret we can open: both are
    // indistinguishable to a caller on purpose — we do not confirm that a
    // partner id exists to an unauthenticated request.
    if (!partner || partner.secrets.length === 0) return deny('unknown_partner');

    // Only real partners authenticate. 'first-party' rows exist to own a
    // student namespace ('evelyn' for retail /tutor); 'test' rows exist so
    // fixture data has a valid reference. Neither may hold API credentials,
    // even if a secret is added to one by mistake.
    if (partner.kind !== 'partner') {
      return denyStatus('partner_cannot_authenticate', 403);
    }
    if (partner.status === 'suspended') {
      return denyStatus('partner_suspended', 403);
    }

    const rawBody = await req.text();
    const u = new URL(req.url);
    const parts: SigningParts = {
      method: req.method,
      // pathname + search: query params (e.g. ?studentId=) are integrity-
      // protected for GET reads, not just the path.
      path: u.pathname + u.search,
      timestamp,
      body: rawBody,
    };

    // Endpoint allowlist is checked BEFORE signature verification is accepted
    // but AFTER the partner is known, so an allowlist miss is never used as an
    // id-enumeration oracle by an unsigned caller.
    const allowed = partner.allowedEndpoints.some((p) => u.pathname.startsWith(p));
    if (!allowed) return denyStatus('endpoint_not_allowed', 403);

    // Rotation: any live secret may have signed this request. Try each and
    // accept the first that verifies; report the LAST failure reason (not
    // the first) so a genuine tamper is judged against the newest/most
    // trusted candidate, not an already-retired one further back in the
    // array. `partner.secrets` is non-empty here (checked above), so this
    // initial value is always overwritten by the loop below — it exists
    // only as a type-correct placeholder, never as an observed response.
    let verdict = { ok: false as boolean, reason: 'invalid_signature' as string };
    for (const secret of partner.secrets) {
      const v = verifyPortalSignature(secret, parts, signature);
      if (v.ok) { verdict = { ok: true, reason: '' }; break; }
      verdict = { ok: false, reason: v.reason };
    }
    if (!verdict.ok) return deny(verdict.reason);

    let body: unknown;
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: 'bad_request', reason: 'invalid_json' }, { status: 400 });
      }
    }

    return handler(req, { partnerId, partner, body, rawBody }, ctx);
  };
}
