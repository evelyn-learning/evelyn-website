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
 * Defaults to DRY RUN, matching backfill-partner-namespace.ts. Nothing is
 * written unless `--write` is passed. This is a one-shot ops script run
 * against production, not registry.ts's hot auth path — silently degrading
 * a bad `PORTAL_PARTNER_SECRETS` to "seed only evelyn" and exiting 0 would
 * let an operator believe every partner was seeded when none were (round-2
 * review: a forgotten/fat-fingered env, or the repo-root dev `.env.local`
 * sourced by mistake against a prod `MONGODB_URI`, writing DEV secrets into
 * rows that then WIN over the env fallback and 401 both partners within the
 * 60s cache TTL). `checkSecretsEnv` below aborts non-zero before doing
 * anything else — no DB connection is even opened — when the env is
 * missing, unparseable, or parses to zero usable secrets.
 *
 * `checkSecretKeyEnv` is the same gate for `PORTAL_SECRET_ENC_KEY` (M1c
 * final review, A-C1): abort if it is unset or cannot seal-then-open a
 * probe value, and print a FINGERPRINT of it — in DRY RUN too — so the
 * operator can confirm it is the same key the running server holds before
 * writing rows that server could never open.
 *
 * Idempotent, and safe to re-run:
 *  - A NEW partner is created with `allowedEndpoints: ['/api/portal/v1/']`
 *    (== `registry.ts`'s exported `ENV_FALLBACK_ALLOWED_ENDPOINTS`, so a row
 *    seeded here grants identical access to the env fallback it is meant to
 *    replace — a row seeded WITHOUT this returns 403 for every request the
 *    partner makes, per `registry.ts`: `doc.allowedEndpoints ?? []`) and its
 *    secret sealed via `encryptSecret`.
 *  - An EXISTING row only has `name` and `updatedAt` refreshed
 *    (`buildUpdateSet` below). Every other field is either operator state or
 *    fixed at creation — a routine re-seed must not undo either:
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
 *      - `kind`             — round-2 review: NOT seed-authoritative on
 *        update either, even though this script only ever PROPOSES
 *        'partner' or 'first-party' for a row it creates. `portalA` is a
 *        `TEST_PREFIXES` fixture (backfill-partner-namespace.ts) seeded
 *        with `kind: 'test'`. If an operator ever puts `portalA` in this
 *        script's `PORTAL_PARTNER_SECRETS` map (by mistake, or to give it a
 *        real secret), `planSeed` sees the existing row and plans an
 *        'update' with `kind: 'partner'` — writing that on update would
 *        silently reclassify a test fixture as a real partner, defeating
 *        what `Partner.ts` documents `'test'` rows are for. The reverse
 *        direction ('partner' → 'test') is structurally unreachable — this
 *        script never proposes `kind: 'test'` for anything — but the fix is
 *        symmetric: `kind` is written only at creation, full stop.
 *    `name` stays seed-authoritative: today the seed is the only source for
 *    it (no admin console exists yet — M1e), so there is no operator-set
 *    value to protect. If M1e ever lets an operator set a custom display
 *    `name` independent of the partnerId slug, that assumption should be
 *    revisited — not a decision made here.
 *  - `invalidatePartner` is called after every create AND every update (and
 *    only those — a dry run calls neither write dep nor invalidate; see
 *    `executeSeed`'s `write` gate). `getPartner` caches NEGATIVE lookups
 *    too, so a partner seeded after an earlier failed lookup would
 *    otherwise stay 401 `unknown_partner` for up to the 60s cache TTL
 *    (registry.ts). The registry's own comment says "Call after any admin
 *    write" — this is that write.
 *
 * Rotation has NO tooling in M1c: the create/update partition above means
 * nothing in this script can add a second secret to an EXISTING partner (an
 * update never touches `secrets`). The first rotation must be done by hand
 * (direct Mongo write, sealing with `encryptSecret` and appending to the
 * array) until an admin console ships in M1e. Documented in README.md too —
 * recorded here so it is not silently discovered mid-incident.
 *
 * Usage:
 *   PORTAL_PARTNER_SECRETS='{"crimsora":"..."}' PORTAL_SECRET_ENC_KEY=... \
 *     npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/seed-partner-registry.ts                # dry run, report only
 *   ... scripts/seed-partner-registry.ts --write         # apply
 */
import { createHash } from 'node:crypto';
import mongoose from 'mongoose';
import connectDB from '@core/db';
import { PartnerModel } from '@/models/Partner';
import { encryptSecret, decryptSecret, type SealedSecret } from '@/lib/tutor/portal/secret-box';
import {
  invalidatePartner,
  ENV_FALLBACK_ALLOWED_ENDPOINTS,
  ENV_FALLBACK_LIMITS,
} from '@/lib/tutor/portal/registry';
import { configureMongooseForOpsScript } from './ops-mongoose';

const WRITE = process.argv.includes('--write');

// Re-exported, not re-hardcoded: importing the SAME binding registry.ts's
// `fromEnv` uses means these two can never silently drift apart (round-2
// review, I2) — a future narrowing of the env-fallback grant is impossible
// to leave seeded rows unknowingly broader than, because there is only one
// value, not two equal-looking copies.
export const ALLOWED_ENDPOINTS = ENV_FALLBACK_ALLOWED_ENDPOINTS;
export const DEFAULT_LIMITS = ENV_FALLBACK_LIMITS;
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
 * for the same env var (malformed map -> fall through). That degrade is
 * correct for registry.ts's hot auth path (one bad partner must not break
 * every other lookup) and is exactly why `checkSecretsEnv` below exists
 * separately for this script: an ops script must NOT make the same
 * "degrade and continue" choice about its OWN input.
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

export type SecretsEnvStatus =
  | { ok: true }
  | { ok: false; reason: 'missing' | 'malformed' | 'empty' };

/**
 * Pure — no DB. The operator-mistake gate (round-2 review, I1). Distinct
 * from `parsePartnerSecretsEnv`'s permissive parse: this is what `main()`
 * checks BEFORE opening a DB connection or seeding anything, so a bad env
 * aborts loudly instead of silently seeding only `evelyn` and exiting 0.
 * `reason` is deliberately three-way — `missing` (unset), `malformed`
 * (present but not a JSON object) and `empty` (a valid object with zero
 * usable string secrets, e.g. `'{}'`) get distinct operator-facing messages
 * in `main()` because they're different mistakes to go fix.
 */
export function checkSecretsEnv(raw: string | undefined): SecretsEnvStatus {
  if (!raw) return { ok: false, reason: 'missing' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, reason: 'malformed' };
  }
  if (Object.keys(parsePartnerSecretsEnv(raw)).length === 0) {
    return { ok: false, reason: 'empty' };
  }
  return { ok: true };
}

export type SecretKeyStatus =
  | { ok: true; fingerprint: string }
  | { ok: false; reason: 'missing' | 'unusable'; detail?: string };

/**
 * Pure — no DB. The SECOND operator-mistake gate (M1c final review, A-C1),
 * and the one that can take the live portal API down.
 *
 * A *missing* `PORTAL_SECRET_ENC_KEY` already failed safely by accident:
 * `executeSeed` seals before it writes, so `resolveKey`'s throw preceded the
 * first write. A *wrong but valid* 32-byte key did not. It seals cleanly,
 * writes the rows, exits 0 — and then the SERVER, holding a different key,
 * gets `SecretDecryptError` per secret, which `registry.ts` swallows by
 * design, so the partner resolves with `secrets: []` and `auth.ts` returns
 * 401 unknown_partner. The registry row WINS over the env fallback, so
 * every live partner stops authenticating within one 60s cache TTL.
 *
 * Two defences, neither of which can print a plaintext secret or the key:
 *  - `fingerprint` — sha256 of the base64 env VALUE, first 8 hex chars. The
 *    operator compares it against the deployed server's. This is the only
 *    thing that can catch "right shape, wrong key", so `main()` prints it
 *    in DRY RUN too: catching the mix-up on the dry run, before any row
 *    exists, is the entire point.
 *  - `roundTrip` — seal-then-open a probe value with THIS key (passed
 *    explicitly, not read back out of `process.env`, so the value that gets
 *    fingerprinted is provably the value that gets validated). Catches an
 *    internally inconsistent key — wrong length, not base64, cipher and
 *    decipher disagreeing — before a single row is written. Injectable so
 *    the test suite can drive the failure branch without a real key.
 */
export function checkSecretKeyEnv(
  raw: string | undefined,
  roundTrip: (probe: string, key: Buffer) => string = (probe, key) =>
    decryptSecret(encryptSecret(probe, key), key),
): SecretKeyStatus {
  if (!raw) return { ok: false, reason: 'missing' };
  const fingerprint = createHash('sha256').update(raw).digest('hex').slice(0, 8);
  const probe = `seed-roundtrip-probe-${fingerprint}`;
  try {
    if (roundTrip(probe, Buffer.from(raw, 'base64')) !== probe) {
      return {
        ok: false,
        reason: 'unusable',
        detail: 'sealing a probe value and opening it again did not return it unchanged',
      };
    }
  } catch (err) {
    return { ok: false, reason: 'unusable', detail: (err as Error).message };
  }
  return { ok: true, fingerprint };
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
  limits: { rpm: number; burst: number; dailyQuota: number | null };
  flagOverrides: Record<string, never>;
  metering: Record<string, never>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pure — no DB. The full document for a brand-new row. Every field here is
 * written exactly once, at creation — see the header comment for why each
 * of `status`, `secrets`, `allowedEndpoints`, `limits`, `flagOverrides`,
 * `metering` and `kind` is deliberately NOT in `buildUpdateSet` below.
 * `allowedEndpoints`/`limits` are copied BY VALUE (`[...]` / `{...}`), not
 * handed out as the shared `ALLOWED_ENDPOINTS`/`DEFAULT_LIMITS` module
 * references — every created doc gets its own array/object so nothing
 * downstream can mutate one partner's grant through another's.
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
    allowedEndpoints: [...ALLOWED_ENDPOINTS],
    limits: { ...DEFAULT_LIMITS },
    flagOverrides: {},
    metering: {},
    createdAt: ts,
    updatedAt: ts,
  };
}

export interface UpdateSet {
  name: string;
  updatedAt: string;
}

/**
 * Pure — no DB. The exact `$set` payload for an EXISTING row. Deliberately
 * narrow: `status`, `secrets`, `allowedEndpoints`, `limits`,
 * `flagOverrides`, `metering` AND `kind` are either operator state or fixed
 * at creation, and must never appear here — see the header comment for the
 * reasoning per field. This is the one place that ownership boundary is
 * enforced; a spy test on `executeSeed`'s `updatePartner` dep proves
 * nothing about it, so `test-partner-seed.ts` asserts on this function's
 * return shape directly.
 */
export function buildUpdateSet(
  row: SeedPlanRow,
  now: () => string = () => new Date().toISOString(),
): UpdateSet {
  return { name: row.partnerId, updatedAt: now() };
}

export interface SeedWriteDeps {
  createPartner(row: SeedPlanRow, secret: SealedSecret | undefined): void | Promise<void>;
  updatePartner(row: SeedPlanRow): void | Promise<void>;
  invalidate(partnerId: string): void;
}

/**
 * Executes a plan. `write=false` (the default — see `main()`'s `WRITE`)
 * calls NONE of the deps, for any row, structurally: the loop body is
 * unreachable when `write` is false. This is what makes dry-run safe, and
 * is asserted directly by a spy test with zero calls, not just implied by
 * `main()` never being invoked with `--write`.
 *
 * When `write` is true: for each row, create XOR update (never both), then
 * ALWAYS invalidate — both branches call `deps.invalidate` before moving to
 * the next row, so a spy test can assert invalidate fires exactly once per
 * planned row regardless of operation. `updatePartner` is never handed a
 * secret — its signature structurally cannot pass one through.
 */
export async function executeSeed(
  plan: SeedPlanRow[],
  secretsMap: Record<string, string>,
  sealSecret: (plaintext: string) => SealedSecret,
  write: boolean,
  deps: SeedWriteDeps,
): Promise<void> {
  if (!write) return;
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

function describeSecretsEnvError(reason: 'missing' | 'malformed' | 'empty'): string {
  switch (reason) {
    case 'missing':
      return (
        'PORTAL_PARTNER_SECRETS is not set. Nothing would be seeded but evelyn — ' +
        'aborting rather than doing that silently. Set it to a JSON map of ' +
        '{"partnerId":"secret", ...} for every real partner before running this script.'
      );
    case 'malformed':
      return (
        'PORTAL_PARTNER_SECRETS is set but is not a valid JSON object (e.g. bad JSON, ' +
        'or a JSON array/string/number instead of a map). Aborting before any write — ' +
        'fix the env value and re-run.'
      );
    case 'empty':
      return (
        'PORTAL_PARTNER_SECRETS parses to zero usable secrets (empty object, or every ' +
        'value non-string/empty). Aborting — this is almost always a fat-fingered or ' +
        'wrong env, not an intentional "seed evelyn only" run.'
      );
  }
}

export function describeSecretKeyError(reason: 'missing' | 'unusable', detail?: string): string {
  if (reason === 'missing') {
    return (
      'PORTAL_SECRET_ENC_KEY is not set. Partner secrets cannot be sealed without it, and once ' +
      'sealed rows exist the RUNNING SERVER needs the SAME key on every request. Aborting before ' +
      'any DB connection. Generate one with `openssl rand -base64 32`, put it in the server env ' +
      'FIRST, then export the identical value here and re-run the dry run to compare fingerprints.'
    );
  }
  return (
    'PORTAL_SECRET_ENC_KEY is set but unusable: ' +
    `${detail ?? 'unknown error'}. It must decode from base64 to exactly 32 bytes. Aborting before ` +
    'any DB connection — a key that cannot round-trip here would seal rows the server can never open.'
  );
}

/**
 * M1c final review (reviewer B finding 7): exported so the suite can drive
 * it directly and assert that main() ACTS on the gates, rather than trusting
 * that a well-tested pure detector is wired up. Deleting either abort, or
 * the `configureMongooseForOpsScript()` call, previously left every suite
 * green.
 */
export async function main() {
  // Must run before connectDB() — see ops-mongoose.ts for the full reason
  // (TutorSession's TTL index deletes rows; a dry run must have no side
  // effects). Only PartnerModel is imported by this file today, so this is
  // harmless right now, but it re-arms the moment anything in this file's
  // import graph pulls in TutorSession.
  configureMongooseForOpsScript();

  const raw = process.env.PORTAL_PARTNER_SECRETS;
  const envStatus = checkSecretsEnv(raw);
  if (!envStatus.ok) {
    console.error(describeSecretsEnvError(envStatus.reason));
    process.exit(1);
  }

  // A-C1: before any DB connection, and BEFORE the dry-run report, so the
  // fingerprint is the first thing the operator sees on a dry run.
  const keyStatus = checkSecretKeyEnv(process.env.PORTAL_SECRET_ENC_KEY);
  if (!keyStatus.ok) {
    console.error(describeSecretKeyError(keyStatus.reason, keyStatus.detail));
    process.exit(1);
  }
  console.log(
    `PORTAL_SECRET_ENC_KEY fingerprint: ${keyStatus.fingerprint} ` +
      '(sha256 of the base64 env value, first 8 hex chars — NOT the key). ' +
      'This MUST equal the fingerprint of the key the running engine has. If it does not, every ' +
      'row this script writes becomes unopenable and every partner 401s within 60s (registry.ts ' +
      'cache TTL). Verify BEFORE passing --write.',
  );

  await connectDB();

  const secretsMap = parsePartnerSecretsEnv(raw);
  const entries = buildSeedEntries(secretsMap);

  const existingDocs = await PartnerModel.find(
    { _id: { $in: entries.map((e) => e.partnerId) } },
    { _id: 1 },
  ).lean();
  const existingIds = new Set(existingDocs.map((d) => d._id as string));

  const plan = planSeed(entries, existingIds);

  console.log(`Mode: ${WRITE ? 'WRITE' : 'dry-run'} — ${plan.length} partner row(s):`);
  for (const row of plan) {
    const label = WRITE ? row.operation : `would ${row.operation}`;
    console.log(`  ${label.padEnd(13)} ${row.partnerId.padEnd(20)} kind=${row.kind}`);
  }
  if (!WRITE) {
    console.log(
      '\n(dry run — pass --write to apply. Undo for any row this creates: delete it from the ' +
        "`partners` collection — the PORTAL_PARTNER_SECRETS env fallback resumes automatically " +
        'within 60s, registry.ts\'s cache TTL.)',
    );
  }

  await executeSeed(plan, secretsMap, encryptSecret, WRITE, {
    createPartner: async (row, secret) => {
      await PartnerModel.create(buildCreateDoc(row, secret));
    },
    updatePartner: async (row) => {
      // buildUpdateSet is deliberately narrow — see the header comment and
      // the function's own doc comment for which fields are excluded and
      // why.
      await PartnerModel.updateOne({ _id: row.partnerId }, { $set: buildUpdateSet(row) });
    },
    invalidate: invalidatePartner,
  });

  if (WRITE) console.log('\nDone.');
  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
