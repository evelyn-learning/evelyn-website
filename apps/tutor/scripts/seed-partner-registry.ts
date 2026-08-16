/**
 * Seed: create/refresh Partner registry rows from PORTAL_PARTNER_SECRETS
 * (M1c Task 9).
 *
 * This is what unblocks the rest of the rollout. The backfill script
 * (Task 6) refuses to run until every real ('partner'-kind) partner id it
 * observes has a registry row — see backfill-partner-namespace.ts's
 * `missing-real-partners` abort. Run this first (rollout step 2).
 *
 * One `Partner` row is written per entry in the `PORTAL_PARTNER_SECRETS`
 * JSON map (`{"crimsora":"secret-a", ...}`), plus one `evelyn` row with
 * `kind: 'first-party'` and NO secrets — it owns the retail student
 * namespace but can never authenticate as a caller.
 *
 * Idempotent, and safe to re-run:
 *  - A NEW partner is created with `allowedEndpoints: ['/api/portal/v1/']`
 *    (matching `registry.ts`'s `fromEnv` exactly, so a row seeded here
 *    grants identical access to the env fallback it is meant to replace —
 *    a row seeded WITHOUT this returns 403 for every request the partner
 *    makes, per `registry.ts`: `doc.allowedEndpoints ?? []`) and its secret
 *    sealed via `encryptSecret`.
 *  - An EXISTING row only has `name`, `kind` and `updatedAt` refreshed
 *    (`buildUpdateSet` below). Every other field is operator state once a
 *    row exists — a routine re-seed must not undo a deliberate operator
 *    decision:
 *      - `secrets`          — re-running must not clobber a rotated secret.
 *      - `status`           — this is the incident-response lever (suspend
 *        a partner abusing the API, in a billing dispute, or that leaked a
 *        secret). A re-seed silently flipping `suspended` back to `active`
 *        would restore access with no one intending it, and the person who
 *        suspended the partner would have no reason to suspect the seed
 *        undid it.
 *      - `allowedEndpoints` — seeding it IS what stops a brand-new row
 *        403ing every request (`registry.ts`: `doc.allowedEndpoints ??
 *        []`), so CREATE must set it — but overwriting a narrowed
 *        allowlist on re-run would silently re-widen a partner's access
 *        after an operator deliberately restricted it. Same risk, opposite
 *        direction from `secrets`.
 *      - `limits`           — rpm/burst/dailyQuota are exactly the kind of
 *        thing an operator adjusts during an incident (throttle a
 *        partner) or a commercial change (raise a quota). Same risk class
 *        as `status`.
 *      - `flagOverrides`    — the entire point of the D12 hook (Task 8) is
 *        a value an operator sets per partner; the seed has no opinion on
 *        it beyond `{}` at creation.
 *      - `metering`         — plan/billing metadata set out of band; the
 *        seed isn't authoritative for it either.
 *    `name` and `kind` stay seed-authoritative: today the seed is the only
 *    source for either (no admin console exists yet — M1e), so there is no
 *    operator-set value to protect. If M1e ever lets an operator set a
 *    custom display `name` independent of the partnerId slug, or manually
 *    reclassify a partner's `kind`, that assumption should be revisited —
 *    not a decision made here.
 *  - `invalidatePartner` is called after every create AND every update.
 *    `getPartner` caches NEGATIVE lookups too, so a partner seeded after an
 *    earlier failed lookup would otherwise stay 401 `unknown_partner` for
 *    up to the 60s cache TTL (registry.ts). The registry's own comment says
 *    "Call after any admin write" — this is that write.
 *
 * Usage:
 *   PORTAL_PARTNER_SECRETS='{"crimsora":"..."}' PORTAL_SECRET_ENC_KEY=... \
 *     npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/seed-partner-registry.ts
 */
import mongoose from 'mongoose';
import connectDB from '@core/db';
import { PartnerModel } from '@/models/Partner';
import { encryptSecret, type SealedSecret } from '@/lib/tutor/portal/secret-box';
import { invalidatePartner } from '@/lib/tutor/portal/registry';

export const ALLOWED_ENDPOINTS = ['/api/portal/v1/'];
export const DEFAULT_LIMITS = { rpm: 600, burst: 60, dailyQuota: null as number | null };
export const EVELYN_PARTNER_ID = 'evelyn';

export type SeedKind = 'partner' | 'first-party';

export interface SeedEntry {
  partnerId: string;
  kind: SeedKind;
}

export interface SeedPlanRow extends SeedEntry {
  operation: 'create' | 'update';
  /**
   * Only true for a brand-new 'partner' row — a secret must be sealed and
   * written. Never true for 'update': an existing row's `secrets` array is
   * never touched by this script, structurally — nothing downstream of a
   * 'update' row is ever handed a secret to seal.
   */
  sealSecret: boolean;
}

/**
 * Pure — no DB, no crypto. Parses PORTAL_PARTNER_SECRETS into a plain map.
 * Malformed JSON or a non-object value degrades to "no partners configured"
 * rather than throwing, matching registry.ts's `resolveEnvSecret` behavior
 * for the same env var (malformed map -> fall through).
 */
export function parsePartnerSecretsEnv(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'string' && v.length > 0) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Pure — no DB. Builds the full desired-row list: every partner id in the
 * secrets map (sorted, for stable output) as `kind: 'partner'`, plus the
 * fixed `evelyn` first-party row. If the secrets map somehow contains an
 * `evelyn` key (operator error), it is dropped from the partner list — the
 * first-party row always wins and is never sealed with a secret.
 */
export function buildSeedEntries(secretsMap: Record<string, string>): SeedEntry[] {
  const entries: SeedEntry[] = Object.keys(secretsMap)
    .filter((id) => id !== EVELYN_PARTNER_ID)
    .sort()
    .map((partnerId) => ({ partnerId, kind: 'partner' as const }));
  entries.push({ partnerId: EVELYN_PARTNER_ID, kind: 'first-party' });
  return entries;
}

/**
 * Pure — no DB. `existingIds` is the current Partner collection's `_id` set,
 * passed in so this is testable without a database (mirrors Task 6's
 * `planPartnerRows`). A row already present is planned as 'update' with
 * `sealSecret: false` unconditionally — the caller must never seal a secret
 * for an 'update' row, which is what keeps an existing `secrets` array
 * untouched on re-run.
 */
export function planSeed(entries: SeedEntry[], existingIds: Set<string>): SeedPlanRow[] {
  return entries.map((entry) => {
    const exists = existingIds.has(entry.partnerId);
    return {
      ...entry,
      operation: exists ? 'update' : 'create',
      sealSecret: !exists && entry.kind === 'partner',
    };
  });
}

export interface CreateDoc {
  _id: string;
  name: string;
  kind: SeedKind;
  status: 'active';
  secrets: Array<{ ciphertext: string; keyVersion: number; label: string; createdAt: string }>;
  allowedEndpoints: string[];
  limits: typeof DEFAULT_LIMITS;
  flagOverrides: Record<string, never>;
  metering: Record<string, never>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pure — no DB. The full document for a brand-new row. Every field here is
 * written exactly once, at creation — see the header comment for why each
 * of `status`, `secrets`, `allowedEndpoints`, `limits`, `flagOverrides` and
 * `metering` is deliberately NOT in `buildUpdateSet` below.
 */
export function buildCreateDoc(
  row: SeedPlanRow,
  secret: SealedSecret | undefined,
  now: () => string = () => new Date().toISOString(),
): CreateDoc {
  const ts = now();
  return {
    _id: row.partnerId,
    name: row.partnerId,
    kind: row.kind,
    status: 'active',
    secrets: secret
      ? [{ ciphertext: secret.ciphertext, keyVersion: secret.keyVersion, label: 'seed', createdAt: ts }]
      : [],
    allowedEndpoints: ALLOWED_ENDPOINTS,
    limits: DEFAULT_LIMITS,
    flagOverrides: {},
    metering: {},
    createdAt: ts,
    updatedAt: ts,
  };
}

export interface UpdateSet {
  name: string;
  kind: SeedKind;
  updatedAt: string;
}

/**
 * Pure — no DB. The exact `$set` payload for an EXISTING row. Deliberately
 * narrow: `status`, `secrets`, `allowedEndpoints`, `limits`,
 * `flagOverrides` and `metering` are operator state once a row exists and
 * must never appear here — see the header comment for the reasoning per
 * field. This is the one place that ownership boundary is enforced; a spy
 * test on `executeSeed`'s `updatePartner` dep proves nothing about it, so
 * `test-partner-seed.ts` asserts on this function's return shape directly.
 */
export function buildUpdateSet(
  row: SeedPlanRow,
  now: () => string = () => new Date().toISOString(),
): UpdateSet {
  return { name: row.partnerId, kind: row.kind, updatedAt: now() };
}

export interface SeedWriteDeps {
  createPartner(row: SeedPlanRow, secret: SealedSecret | undefined): void | Promise<void>;
  updatePartner(row: SeedPlanRow): void | Promise<void>;
  invalidate(partnerId: string): void;
}

/**
 * Executes a plan. For each row: create XOR update (never both), then
 * ALWAYS invalidate — both branches call `deps.invalidate` before moving to
 * the next row, so a spy test can assert invalidate fires exactly once per
 * planned row regardless of operation. `updatePartner` is never handed a
 * secret — its signature structurally cannot pass one through.
 */
export async function executeSeed(
  plan: SeedPlanRow[],
  secretsMap: Record<string, string>,
  sealSecret: (plaintext: string) => SealedSecret,
  deps: SeedWriteDeps,
): Promise<void> {
  for (const row of plan) {
    if (row.operation === 'create') {
      const secret = row.sealSecret ? sealSecret(secretsMap[row.partnerId]) : undefined;
      await deps.createPartner(row, secret);
    } else {
      await deps.updatePartner(row);
    }
    await deps.invalidate(row.partnerId);
  }
}

async function main() {
  await connectDB();

  const secretsMap = parsePartnerSecretsEnv(process.env.PORTAL_PARTNER_SECRETS);
  const entries = buildSeedEntries(secretsMap);

  const existingDocs = await PartnerModel.find(
    { _id: { $in: entries.map((e) => e.partnerId) } },
    { _id: 1 },
  ).lean();
  const existingIds = new Set(existingDocs.map((d) => d._id as string));

  const plan = planSeed(entries, existingIds);

  console.log(`Seeding ${plan.length} partner row(s):`);
  for (const row of plan) {
    console.log(`  ${row.operation.padEnd(6)} ${row.partnerId.padEnd(20)} kind=${row.kind}`);
  }

  await executeSeed(plan, secretsMap, encryptSecret, {
    createPartner: async (row, secret) => {
      await PartnerModel.create(buildCreateDoc(row, secret));
    },
    updatePartner: async (row) => {
      // buildUpdateSet is deliberately narrow — see the header comment and
      // the function's own doc comment for which fields are operator state
      // and therefore excluded.
      await PartnerModel.updateOne({ _id: row.partnerId }, { $set: buildUpdateSet(row) });
    },
    invalidate: invalidatePartner,
  });

  console.log('\nDone.');
  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
