/**
 * Partner lookup with an in-process TTL cache (M1c Task 2).
 *
 * Why a cache: withPortalAuth runs on every authenticated request, including
 * the hot path of a live voice session. Reading Mongo per request would put a
 * network round-trip in front of every partner call for data that changes
 * perhaps monthly.
 *
 * Why an env fallback: rollout step 1 seeds the collection while
 * PORTAL_PARTNER_SECRETS is still authoritative. The registry row WINS once it
 * exists, so the switchover is per-partner and reversible by deleting a row.
 * Remove the fallback at rollout step 5.
 */
import connectDB, { isDBConfigured } from '@core/db';
import { PartnerModel } from '@/models/Partner';
import { decryptSecret, SecretDecryptError } from './secret-box';

export type PartnerKind = 'partner' | 'first-party' | 'test';
export type PartnerStatus = 'active' | 'suspended';

/**
 * Exactly the fields the registry reads. Deliberately narrower than IPartner
 * so a test fixture does not have to invent name/createdAt/updatedAt/metering
 * or cast through `unknown`.
 */
export interface RawPartnerDoc {
  kind: PartnerKind;
  status: PartnerStatus;
  secrets: Array<{ ciphertext: string; keyVersion: number; label: string; expiresAt?: string }>;
  allowedEndpoints?: string[];
  limits?: { rpm: number; burst: number; dailyQuota: number | null };
  flagOverrides?: Record<string, boolean | string>;
}

export interface PartnerRecord {
  partnerId: string;
  kind: PartnerKind;
  status: PartnerStatus;
  /** Decrypted, in stored order. Every entry is a candidate for HMAC verification. */
  secrets: string[];
  allowedEndpoints: string[];
  limits: { rpm: number; burst: number; dailyQuota: number | null };
  flagOverrides: Record<string, boolean | string>;
}

export interface RegistryDeps {
  findPartner(id: string): Promise<RawPartnerDoc | null>;
  now(): number;
  env: NodeJS.ProcessEnv;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { at: number; value: PartnerRecord | null }>();

const defaultDeps: RegistryDeps = {
  async findPartner(id) {
    // No DB configured at all (a hermetic env-only test, or rollout step 1
    // before this app has ever been pointed at Mongo) is treated as "no
    // row" — falls through to fromEnv below — not as an error. A real
    // outage with MONGODB_URI actually set still throws out of connectDB()
    // uncaught, same as everywhere else in the app; this only short-
    // circuits the "no DB at all" case, it does not add error-swallowing
    // for a misconfigured-but-present DB.
    if (!isDBConfigured()) return null;
    await connectDB();
    return PartnerModel.findById(id).lean<RawPartnerDoc>().exec();
  },
  now: () => Date.now(),
  env: process.env,
};

/** Drop a partner from the cache. Call after any admin write. */
export function invalidatePartner(partnerId: string): void {
  cache.delete(partnerId);
}

/**
 * Two env configuration modes, checked in order — mirrors the retired
 * `getPartnerSecret` (auth.ts) exactly, so a partner configured either way
 * keeps authenticating through the wrapper when its registry row is absent
 * (rollout step 1):
 *   1. JSON map      — PORTAL_PARTNER_SECRETS='{"portalA":"secret-a"}'
 *   2. Single default — PORTAL_PARTNER_ID + PORTAL_API_SECRET
 */
function resolveEnvSecret(partnerId: string, env: NodeJS.ProcessEnv): string | null {
  const mapRaw = env.PORTAL_PARTNER_SECRETS;
  if (mapRaw) {
    try {
      const map = JSON.parse(mapRaw) as Record<string, string>;
      const secret = map[partnerId];
      if (typeof secret === 'string' && secret.length > 0) return secret;
    } catch {
      // Malformed map env → fall through to single-default mode.
    }
  }
  const defaultPartner = env.PORTAL_PARTNER_ID;
  const defaultSecret = env.PORTAL_API_SECRET;
  if (defaultPartner && defaultSecret && partnerId === defaultPartner) {
    return defaultSecret;
  }
  return null;
}

function fromEnv(partnerId: string, env: NodeJS.ProcessEnv): PartnerRecord | null {
  const secret = resolveEnvSecret(partnerId, env);
  if (!secret) return null;
  return {
    partnerId,
    kind: 'partner',
    status: 'active',
    secrets: [secret],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 60, dailyQuota: null },
    flagOverrides: {},
  };
}

export async function getPartner(
  partnerId: string,
  deps: RegistryDeps = defaultDeps,
): Promise<PartnerRecord | null> {
  if (!partnerId) return null;

  const hit = cache.get(partnerId);
  if (hit && deps.now() - hit.at < CACHE_TTL_MS) return hit.value;

  let value: PartnerRecord | null = null;
  const doc = await deps.findPartner(partnerId);

  if (doc) {
    const secrets: string[] = [];
    for (const s of doc.secrets ?? []) {
      let plaintext: string;
      try {
        plaintext = decryptSecret({ ciphertext: s.ciphertext, keyVersion: s.keyVersion });
      } catch (err) {
        // Only a bad *ciphertext* (SecretDecryptError) is swallowed here — one
        // unopenable secret must not lock a partner out, e.g. a half-finished
        // key rotation should not take the partner down. A misconfigured
        // *key* (plain Error, see secret-box's resolveKey) is deliberately
        // NOT caught: it would otherwise silently reduce every partner to
        // zero secrets instead of failing loudly.
        if (!(err instanceof SecretDecryptError)) throw err;
        console.error(
          `[portal/registry] secret label=${s.label} for partner=${partnerId} failed to decrypt`,
        );
        continue;
      }
      // A secret that decrypts to '' would authenticate anyone who merely
      // guesses it's blank: HMAC with an empty key is legal crypto, so an
      // empty string is not "no secret" — it's a universal one. Both env-
      // fallback paths already require length > 0 (see resolveEnvSecret);
      // this is the one place every consumer of PartnerRecord.secrets gets
      // the same guarantee, not just withPortalAuth.
      if (!plaintext) {
        console.error(
          `[portal/registry] secret label=${s.label} for partner=${partnerId} decrypts to the empty string — dropped`,
        );
        continue;
      }
      // A rotated-out secret can sit in the array until an operator removes
      // it; expiresAt lets a compromised/retired secret stop authenticating
      // immediately without waiting on that cleanup.
      if (s.expiresAt && Date.parse(s.expiresAt) <= deps.now()) continue;
      secrets.push(plaintext);
    }
    value = {
      partnerId,
      kind: doc.kind,
      status: doc.status,
      secrets,
      allowedEndpoints: doc.allowedEndpoints ?? [],
      limits: doc.limits ?? { rpm: 600, burst: 60, dailyQuota: null },
      flagOverrides: doc.flagOverrides ?? {},
    };
  } else {
    value = fromEnv(partnerId, deps.env);
  }

  cache.set(partnerId, { at: deps.now(), value });
  return value;
}
