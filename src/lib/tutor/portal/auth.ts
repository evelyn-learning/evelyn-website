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
} from '@/lib/portal-contract/auth';

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

/**
 * Wrap a Next route handler so it runs only for an authenticated partner.
 *
 * Verifies: required headers present → partner known → timestamp fresh →
 * body-bound HMAC signature valid. On success calls `handler` with the
 * verified `partnerId` and parsed body. The handler is responsible for
 * scoping all data access to the `studentId` in its (validated) request —
 * there is no listing/enumeration endpoint, so a verified partner can only
 * read the exact student it names.
 */
export function withPortalAuth<C = unknown>(handler: PortalRouteHandler<C>) {
  return async (req: NextRequest, ctx: C): Promise<Response> => {
    const partnerId = req.headers.get(PORTAL_PARTNER_HEADER);
    const timestamp = req.headers.get(PORTAL_TIMESTAMP_HEADER);
    const signature = req.headers.get(PORTAL_SIGNATURE_HEADER);
    if (!partnerId || !timestamp || !signature) {
      return deny('missing_auth_headers');
    }

    const secret = getPartnerSecret(partnerId);
    if (!secret) return deny('unknown_partner');

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
    const verdict = verifyPortalSignature(secret, parts, signature);
    if (!verdict.ok) return deny(verdict.reason);

    let body: unknown;
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: 'bad_request', reason: 'invalid_json' }, { status: 400 });
      }
    }

    return handler(req, { partnerId, body, rawBody }, ctx);
  };
}
