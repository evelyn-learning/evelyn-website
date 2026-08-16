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
import { getPartner, type PartnerRecord } from './registry';
import { checkPartnerLimits, type LimitsDeps } from './limits';

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

/**
 * The registry record as a route handler sees it: everything EXCEPT the
 * decrypted `secrets` array.
 *
 * Handlers legitimately need `limits`, `flagOverrides`, `allowedEndpoints`,
 * `kind` and `status`; none of them needs a live HMAC credential. Handing
 * the plaintext array to every wrapped handler put a working secret in
 * scope at ~23 route handlers, one generic `console.error('portal failure',
 * auth)` or telemetry serializer away from being written to logs — and
 * gives away the whole point of sealing the secrets at rest (D15-R1: a
 * database dump alone yields no working credential). The plaintext stays
 * local to `withPortalAuth`'s verification loop.
 */
export type PublicPartnerRecord = Omit<PartnerRecord, 'secrets'>;

/** What an authed handler receives in addition to the raw request. */
export interface PortalAuth {
  /** Verified partner id (from the signed header). */
  partnerId: string;
  /** The registry record MINUS the plaintext secrets — limits, flags and allowlist for this caller. */
  partner: PublicPartnerRecord;
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
 * True if `pathname` is `p` itself or a path *segment* under it. Plain
 * `startsWith` would let an allowlist entry for `/api/portal/v1/context`
 * also admit `/api/portal/v1/contextzzz` — a different route that merely
 * shares the string prefix.
 */
function endpointAllowed(pathname: string, p: string): boolean {
  if (pathname === p) return true;
  return pathname.startsWith(p.endsWith('/') ? p : `${p}/`);
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
 * Test seam: lets the hermetic auth tests supply injected LimitsDeps (an
 * in-memory bump/clock/env) for checkPartnerLimits, instead of the real
 * Mongo-backed defaults. Production never sets this. Added in Task 7 fix
 * round 1 (I3) — before this seam existed, nothing exercised the
 * withPortalAuth → checkPartnerLimits wiring itself (the 429/402 responses,
 * Retry-After, and the post-allowlist position), only checkPartnerLimits in
 * isolation.
 */
let limitsDepsOverride: LimitsDeps | null = null;
export function __setLimitsDepsOverrideForTests(deps: LimitsDeps | null): void {
  limitsDepsOverride = deps;
}

/**
 * Wrap a Next route handler so it runs only for an authenticated partner.
 *
 * Verifies: required headers present → partner known (registry, with an env
 * fallback) → timestamp fresh and body-bound HMAC signature valid against
 * any of the partner's live secrets → partner kind is 'partner' and status
 * is 'active' → endpoint is on the partner's allowlist. On success calls
 * `handler` with the verified `partnerId`, the `partner` record MINUS its
 * plaintext secrets, and the parsed body. The handler is responsible for scoping all data access to the
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

    // Spec §3: "a read failure is treated as `unknown_partner` (401) rather
    // than failing open." Before this catch, a Mongo blip with MONGODB_URI
    // set threw straight out of getPartner → withPortalAuth → Next, i.e. a
    // 500 the frozen contract has no vocabulary for, on EVERY portal route
    // at once. Logged with its own marker so an infrastructure outage is
    // not misdiagnosed as a partner integration bug — the same rationale
    // registry.ts already applies to per-secret decrypt failures.
    //
    // Deliberately does NOT fall through to `fromEnv` on error: the env
    // fallback grants a full `/api/portal/v1/` allowlist with kind
    // 'partner' / status 'active', so falling through would silently
    // resurrect a SUSPENDED partner for the duration of an outage.
    let partner: PartnerRecord | null;
    try {
      partner = registryOverride
        ? await registryOverride(partnerId)
        : await getPartner(partnerId);
    } catch (err) {
      // Same 401 either way — but NOT the same marker. `getPartner` does not
      // only throw on a Mongo fault: its decrypt loop deliberately re-throws
      // any non-SecretDecryptError out of key resolution (registry.ts), i.e.
      // a missing or malformed PORTAL_SECRET_ENC_KEY at runtime. That is a
      // CONFIGURATION error — the operator must fix the deployed env, not
      // page whoever owns the database — and during the M1c rollout, when
      // the key is brand new, it is the likeliest cause of a throw here.
      // Logging it under the infrastructure marker states the wrong
      // diagnosis at the exact moment someone is relying on it.
      //
      // Discriminator: `resolveKey` (portal/secret-box.ts) throws a plain
      // `Error` with no `code` or subclass to key off, so the message is
      // what the code actually makes available — and both of its
      // env-sourced messages name the variable ("PORTAL_SECRET_ENC_KEY is
      // not set", "PORTAL_SECRET_ENC_KEY must decode to 32 bytes"). A
      // SecretDecryptError never reaches here (registry.ts swallows those
      // per secret), so there is nothing else in the throw set whose
      // message names that variable.
      const message = err instanceof Error ? err.message : String(err);
      const keyFault = message.includes('PORTAL_SECRET_ENC_KEY');
      console.error(
        keyFault
          ? `[portal/auth] secret_key_unavailable partner=${partnerId} — denying as unknown_partner (spec §3); PORTAL_SECRET_ENC_KEY is missing or unusable at runtime, so no partner's secrets can be opened. This is a CONFIGURATION fault in the deployed env, NOT an infrastructure fault — do not investigate the database`
          : `[portal/auth] registry_unavailable partner=${partnerId} — denying as unknown_partner (spec §3); this is an infrastructure fault, not a partner integration problem`,
        err,
      );
      return deny('unknown_partner');
    }

    // Unknown, or known but with no secret we can open: both are
    // indistinguishable to a caller on purpose — we do not confirm that a
    // partner id exists to an unauthenticated request. This ALSO remains
    // the check that stops a 'first-party'/'test' row (secrets: []) — those
    // never reach the kind gate below, so their consequence is 401
    // unknown_partner, not 403.
    if (!partner || partner.secrets.length === 0) return deny('unknown_partner');

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

    // Rotation: any live secret may have signed this request. Try each in
    // stored order and accept the first that verifies. `partner.secrets` is
    // non-empty here (checked above), so the loop always runs at least once
    // and always overwrites `verdict` — the initial value below is never
    // actually observed as a response, it exists only so `verdict` has a
    // value before the loop assigns one. The reported reason is whichever
    // secret was tried LAST, but that is not meaningful variance: a
    // timestamp-related reason is computed before any secret is used (so
    // it's identical across every candidate), and a genuine signature
    // mismatch is always `bad_signature` regardless of which live secret
    // produced it — the contract's vocabulary has no separate
    // "wrong-secret-but-it-rotated" reason to lose by picking last over
    // first.
    let verdict = { ok: false as boolean, reason: 'invalid_signature' as string };
    for (const secret of partner.secrets) {
      const v = verifyPortalSignature(secret, parts, signature);
      if (v.ok) { verdict = { ok: true, reason: '' }; break; }
      verdict = { ok: false, reason: v.reason };
    }
    if (!verdict.ok) return deny(verdict.reason);

    // Only real partners authenticate. 'first-party' rows exist to own a
    // student namespace ('evelyn' for retail /tutor); 'test' rows exist so
    // fixture data has a valid reference. Neither may hold API credentials,
    // even if a secret is added to one by mistake.
    //
    // Checked AFTER the signature, for exactly the reason the allowlist is
    // (see the comment below): returning `403 partner_cannot_authenticate`
    // or `403 partner_suspended` to a caller who cannot sign let anyone who
    // merely knows a partner slug send a garbage signature and read that
    // partner's state off the 403-vs-401 split. In practice only a
    // SUSPENDED row with live secrets changes behaviour here — a
    // 'first-party'/'test' row carries `secrets: []` and already 401s at
    // the empty-secrets guard above, which is the ordering the backfill
    // script's operator warning documents and which is unchanged.
    if (partner.kind !== 'partner') {
      return denyStatus('partner_cannot_authenticate', 403);
    }
    if (partner.status === 'suspended') {
      return denyStatus('partner_suspended', 403);
    }

    // Endpoint allowlist is checked AFTER the signature verifies, so only a
    // caller who already holds a valid secret for this partner can learn
    // which endpoints it may reach. (This was reversed from an earlier
    // version that checked the allowlist first, on the theory that doing so
    // avoided an id-enumeration oracle — it did the opposite: a caller who
    // merely knows a partner id, with no secret at all, could send a
    // garbage signature and use the 403-vs-401 split to map that partner's
    // allowlist without ever authenticating.)
    const allowed = partner.allowedEndpoints.some((p) => endpointAllowed(u.pathname, p));
    if (!allowed) return denyStatus('endpoint_not_allowed', 403);

    // Burst/quota/metering (M1c Task 7). Deliberately AFTER the allowlist
    // check, not before: the existing header → partner (incl. the
    // empty-secrets 401) → signature → kind → status → allowlist order was
    // arrived at over three review rounds
    // (see the comment above) and moving this earlier would reorder it.
    const limitVerdict = limitsDepsOverride
      ? await checkPartnerLimits(partner, u.pathname, limitsDepsOverride)
      : await checkPartnerLimits(partner, u.pathname);
    if (!limitVerdict.ok) {
      const res = NextResponse.json(
        { error: limitVerdict.status === 429 ? 'rate_limited' : 'quota_exceeded', reason: limitVerdict.reason },
        { status: limitVerdict.status },
      );
      if (limitVerdict.retryAfterSec) res.headers.set('Retry-After', String(limitVerdict.retryAfterSec));
      return res;
    }

    let body: unknown;
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: 'bad_request', reason: 'invalid_json' }, { status: 400 });
      }
    }

    // The plaintext HMAC secrets never leave this function — see
    // PublicPartnerRecord. The verification loop above is their whole
    // lifetime.
    const { secrets: _plaintextSecrets, ...partnerForHandler } = partner;
    void _plaintextSecrets;

    return handler(req, { partnerId, partner: partnerForHandler, body, rawBody }, ctx);
  };
}
