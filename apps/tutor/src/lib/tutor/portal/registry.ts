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
import connectDB from '@core/db';
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
  secrets: Array<{ ciphertext: string; keyVersion: number; label: string }>;
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

function fromEnv(partnerId: string, env: NodeJS.ProcessEnv): PartnerRecord | null {
  const raw = env.PORTAL_PARTNER_SECRETS;
  if (!raw) return null;
  let map: Record<string, string>;
  try { map = JSON.parse(raw) as Record<string, string>; } catch { return null; }
  const secret = map[partnerId];
  if (typeof secret !== 'string' || !secret) return null;
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
      try {
        secrets.push(decryptSecret({ ciphertext: s.ciphertext, keyVersion: s.keyVersion }));
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
      }
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
