/**
 * Which secrets may verify a partner's EMBED or REPLAY token.
 *
 * WHY THIS EXISTS — a measured production outage, not a tidy-up.
 *
 * `withPortalAuth` resolves a partner through the M1c registry (`getPartner`,
 * with an env fallback). The two token verifiers did not: `embed-token.ts` and
 * `replay-token.ts` both called `getPartnerSecret` (auth.ts), which reads
 * `process.env.PORTAL_PARTNER_SECRETS` ONLY and has never consulted the
 * registry. `registry.ts`'s own header calls that out and defers the migration
 * of "those three callers" to a later milestone. This is that migration.
 *
 * The consequence, measured on prod 2026-08-26 from
 * /var/log/nginx/access.log, decoding `partner_id` out of each request's embed
 * token — statuses on `/api/tutor/session-usage`:
 *
 *     1061  401  partner=evelyntutor        <- every authenticated call
 *        3  200  partner=crimsora           <- control
 *       18  200  partner=evelyn-marketing   <- control
 *      192  200  partner=NO-TOKEN           <- retail path, never affected
 *
 * `evelyntutor` was created as a REGISTRY row (`evelyn.partners`, kind
 * 'partner', status 'active', 1 secret) and was never added to the env map,
 * which still lists only academy / crimsora / evelyn-marketing. So the portal
 * v1 API authenticated it fine while every embed-token-gated engine route
 * (session-usage, student-profile, topic-notes, mock-review-context) and the
 * student replay surface rejected it with `unknown partner` — silently, for
 * the whole brand. Sessions ran; their telemetry went nowhere.
 *
 * SEMANTICS ARE COPIED FROM `withPortalAuth`, DELIBERATELY, not invented here:
 * two auth paths that disagree about which secrets are live for a partner is
 * the bug class this module exists to close, so where the two could differ
 * they must not.
 *   - A registry read that THROWS denies (empty list). It does NOT fall
 *     through to the env map: the env fallback manufactures a row with kind
 *     'partner' / status 'active', so falling through would silently
 *     resurrect a SUSPENDED partner for the duration of an outage. This is
 *     the one behaviour here that is stricter than what the token verifiers
 *     did before, and it is stricter in the same direction, for the same
 *     reason, as the route auth that already ships.
 *   - A non-'active' partner yields no secrets.
 *   - `getPartner` already applies the env fallback when there is no row, so
 *     an env-configured partner keeps working with no change at all.
 *
 * Returning a LIST, not one secret, is also `withPortalAuth`'s shape: a
 * registry row can hold several live secrets mid-rotation and every one is a
 * candidate. The previous env-only helper could only ever express one, so a
 * key rotation would have broken embeds even for a partner that was in the
 * map.
 */

import { getPartnerSecret } from './auth';
import { getPartner, type PartnerRecord } from './registry';

/**
 * Kill switch. Default ON (`!== 'off'`) per the standing rule — R49 shipped
 * two severe fixes dark and production kept the bugs after a deploy that
 * contained their fix. Set `TUTOR_PARTNER_REGISTRY_TOKENS=off` to fall back
 * to the pre-fix env-only lookup for every token, which is exactly today's
 * production behaviour and therefore a safe revert without a redeploy.
 */
export function registryTokenSecretsEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.TUTOR_PARTNER_REGISTRY_TOKENS !== 'off';
}

export interface PartnerTokenSecretDeps {
  /** Injectable so the tests need no Mongo. Production uses the real registry. */
  getPartner: (id: string) => Promise<PartnerRecord | null>;
  /** Injectable so a test can flip the kill switch without touching process.env. */
  env: NodeJS.ProcessEnv;
}

const defaultDeps: PartnerTokenSecretDeps = {
  getPartner: (id) => getPartner(id),
  env: process.env,
};

/**
 * Test seam, mirroring `auth.ts`'s `__setRegistryOverrideForTests`.
 * Production never sets this.
 *
 * It exists because the async verifiers are called by route handlers that pass
 * no deps — so without a seam the only way to exercise them would be against a
 * real Mongo, and the one case worth testing (a partner present in the
 * registry and absent from the env map) is precisely the one an env-only
 * harness cannot construct.
 */
let depsOverride: PartnerTokenSecretDeps | null = null;
export function __setPartnerTokenSecretDepsForTests(deps: PartnerTokenSecretDeps | null): void {
  depsOverride = deps;
}

/** The pre-fix path, kept whole: env map, then the single-default pair. */
function envOnlySecrets(partnerId: string): string[] {
  const secret = getPartnerSecret(partnerId);
  return secret ? [secret] : [];
}

/**
 * Every secret that may currently verify a token claiming `partnerId`.
 * Empty means "reject" — the caller must not distinguish an unknown partner
 * from a known one with no usable secret, same as `withPortalAuth`.
 *
 * Never throws: a registry fault is logged and denied, so a token verifier
 * stays a total function on its input.
 */
export async function resolvePartnerTokenSecrets(
  partnerId: string,
  explicitDeps?: PartnerTokenSecretDeps,
): Promise<string[]> {
  const deps = explicitDeps ?? depsOverride ?? defaultDeps;
  if (!partnerId) return [];
  if (!registryTokenSecretsEnabled(deps.env)) return envOnlySecrets(partnerId);

  let partner: PartnerRecord | null;
  try {
    partner = await deps.getPartner(partnerId);
  } catch (err) {
    // Marker split copied from withPortalAuth: `getPartner` throws on a Mongo
    // fault AND on an unusable PORTAL_SECRET_ENC_KEY, and telling an operator
    // to investigate the database when the deployed env is what is broken
    // states the wrong diagnosis at the moment someone is relying on it.
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      message.includes('PORTAL_SECRET_ENC_KEY')
        ? `[portal/token-secrets] secret_key_unavailable partner=${partnerId} — denying; PORTAL_SECRET_ENC_KEY is missing or unusable at runtime. CONFIGURATION fault in the deployed env, NOT the database`
        : `[portal/token-secrets] registry_unavailable partner=${partnerId} — denying; infrastructure fault, not a partner integration problem`,
      err,
    );
    return [];
  }

  if (!partner) return [];
  // A suspended partner's tokens stop verifying immediately, without waiting
  // for anyone to also remove it from the env map.
  if (partner.status !== 'active') return [];
  return partner.secrets;
}
