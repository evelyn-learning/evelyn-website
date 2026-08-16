/**
 * Ops: change an EXISTING partner's rate limits (M1c, issue #9).
 *
 * Why this script exists at all. `seed-partner-registry.ts` deliberately
 * never writes `limits` on an existing row — rpm/burst/dailyQuota are
 * operator state, in the same class as `status`, and a routine re-seed must
 * not undo an operator's incident throttle or commercial quota. That
 * partition is correct and stays. Its consequence is that NOTHING in this
 * repo could change an existing partner's limits, and the last rollout step
 * (flipping `PORTAL_LIMITS_MODE` from `report-only` to enforcing) needs
 * exactly that: production measurement puts one partner's polling at 96% of
 * its cap, so the cap must be raised BEFORE enforcement is turned on or the
 * flip becomes an outage. The alternative was hand-editing production Mongo.
 *
 * So this is the narrow counterpart to the seed, not a general partner
 * editor: it writes `limits` and `updatedAt`, and nothing else, ever.
 *
 * Defaults to DRY RUN, matching `seed-partner-registry.ts` and
 * `backfill-partner-namespace.ts`. Nothing is written unless `--write` is
 * passed.
 *
 * NEVER CREATES A ROW. `--partner` naming an id with no `Partner` document
 * aborts non-zero and points at `seed:partner-registry`. There is no upsert
 * anywhere in this file, on purpose: an earlier review round in this
 * milestone caught a script that would have minted a partner row with no
 * `secrets` and no `allowedEndpoints` — a row that wins over the env
 * fallback in `registry.ts` and therefore 401s/403s the partner it was
 * meant to help. A typo'd `--partner crimosra` must be a loud abort, not a
 * new row.
 *
 * PARTIAL UPDATES ARE PRESERVING. `--rpm 900` alone rewrites the whole
 * `limits` subdocument, but it rewrites it from the CURRENT values with rpm
 * replaced — `applyLimitsPatch` merges onto what was read back, never onto
 * defaults. Writing `{ rpm: 900 }` into `$set: { limits: … }` would drop
 * `burst` and `dailyQuota` and let the schema defaults (600/60/null) take
 * over silently, which is how a "raise the cap" run turns into "reset the
 * quota someone negotiated".
 *
 * The two semantics that are easy to get wrong, both read out of
 * `src/lib/tutor/portal/limits.ts` rather than assumed:
 *
 *  - THE EFFECTIVE BURST CAP IS `min` OVER THE POSITIVE VALUES ONLY.
 *    `limits.ts`: `[rpm, burst].filter((n) => n > 0)`, then
 *    `caps.length > 0 ? Math.min(...caps) : 0`, and the block only fires
 *    when `burstCap > 0 && count > burstCap`. So a non-positive field means
 *    "no cap from THIS field", and `rpm: 0, burst: 0` means NO BURST
 *    LIMITING AT ALL — unlimited, not blocked. An operator reaching for
 *    `--rpm 0` to shut a partner off would get the exact opposite of what
 *    they intended, so this script prints the resulting effective cap in
 *    req/min, computed by `effectiveBurstCap` below, which is a
 *    line-for-line mirror of the limiter's own two lines.
 *
 *  - `dailyQuota: 0` BLOCKS EVERY REQUEST. `limits.ts` gates on
 *    `partner.limits.dailyQuota != null` (not `> 0`) and then rejects when
 *    `count > dailyQuota`; the day counter's first bump returns 1, so a
 *    quota of 0 rejects request #1 with 402 `quota_exceeded`. `none`/`null`
 *    is what means "no quota". This is the mirror image of the burst case —
 *    0 is unlimited for burst and total-blackout for quota — which is
 *    exactly why `--daily-quota 0` prints a loud warning instead of being
 *    quietly accepted.
 *
 *  - `dailyQuota` IS PER (partner, endpoint), NOT PER PARTNER. The counter
 *    key in `limits.ts` includes `endpoint`, so a partner's real daily
 *    ceiling is `dailyQuota × (number of allowedEndpoints)`. There is no
 *    partner-wide counter today. Whenever a quota is set, this script
 *    prints that product using the row's actual `allowedEndpoints`, because
 *    "10000/day" is what the operator thinks they typed and it is not what
 *    the limiter enforces.
 *
 * CACHE: the change is NOT immediate. `registry.ts` caches partner records
 * for 60s in the Next server process. This is a separate process, so
 * calling `invalidatePartner` here would clear a Map in a process that
 * serves no traffic — a no-op with respect to the running server, which is
 * why it is not called at all. The running server picks the new limits up
 * within 60s. The output says so; an earlier version of the seed's docs
 * implied immediacy and that was a review finding.
 *
 * Testability shape, mirroring the seed: the decisions live in exported
 * PURE functions (`parseArgs`, `applyLimitsPatch`, `resolveChange`,
 * `effectiveBurstCap`, `buildUpdateSet`) with no DB access, and `main()`
 * takes its DB access as injectable deps. In particular `buildUpdateSet`
 * returns the narrow `UpdateSet` type below, which structurally cannot
 * carry `status`, `secrets`, `allowedEndpoints`, `flagOverrides`,
 * `metering`, `kind` or `name`. A spy on the write dep proves nothing about
 * that boundary — it only shows what this file happens to pass today — so
 * `test-partner-limits-set.ts` asserts on this function's return shape
 * directly, exactly as `test-partner-seed.ts` does for the seed's.
 *
 * Usage:
 *   npm run limits:set-partner -- --partner crimsora --rpm 1200
 *                                                  # dry run, report only
 *   npm run limits:set-partner -- --partner crimsora --rpm 1200 --write
 *   npm run limits:set-partner -- --partner crimsora --daily-quota none --write
 */
import mongoose from 'mongoose';
import connectDB from '@core/db';
import { PartnerModel } from '@/models/Partner';
import { configureMongooseForOpsScript } from './ops-mongoose';

/** The exact shape of `Partner.limits` (see src/models/Partner.ts). */
export interface PartnerLimits {
  rpm: number;
  burst: number;
  dailyQuota: number | null;
}

/**
 * Only the fields NAMED on the command line appear here. A key being absent
 * is meaningfully different from its value being 0 or null, which is why
 * this is an optional-key patch and not a `Partial<PartnerLimits>` filled
 * with sentinels: `--daily-quota none` must set null, while omitting
 * `--daily-quota` must leave whatever is there alone.
 */
export interface LimitsPatch {
  rpm?: number;
  burst?: number;
  dailyQuota?: number | null;
}

export interface ParsedArgs {
  partnerId: string;
  patch: LimitsPatch;
  write: boolean;
}

export type ParseResult =
  | { ok: true; args: ParsedArgs }
  | { ok: false; error: string };

/**
 * Pure — no DB, no env. Parses and VALIDATES argv (the `--` tail, not the
 * whole `process.argv`). Everything here runs before `main()` opens a
 * connection, so a fat-fingered `--rpm 12O0` costs nothing and cannot
 * half-apply.
 *
 * Numeric rules are deliberately strict: `Number.isInteger` on a value
 * parsed with `Number(...)` rejects NaN, Infinity, `1.5`, `'12O0'` and `''`
 * in one predicate, and negatives are rejected separately so the message
 * can say which mistake was made. 0 IS accepted for every field — it is a
 * legal value with a real meaning for each of them (see the header), and
 * the operator is warned about `--daily-quota 0` rather than blocked, since
 * "block this partner entirely" is a thing an operator may genuinely want.
 */
export function parseArgs(argv: string[]): ParseResult {
  let partnerId: string | undefined;
  const patch: LimitsPatch = {};
  let write = false;

  const numeric = (flag: string, raw: string | undefined): number | string => {
    if (raw === undefined) return `${flag} requires a value`;
    const n = Number(raw);
    // `raw.trim() === ''` is checked SEPARATELY from Number.isInteger
    // because `Number('') === 0` — an empty value would otherwise sail
    // through as a perfectly valid 0, which for rpm/burst means "no cap"
    // and for dailyQuota means "block everything". Caught by the suite, not
    // by reading.
    if (raw.trim() === '' || !Number.isInteger(n)) {
      return `${flag} must be a whole number, got ${JSON.stringify(raw)}`;
    }
    if (n < 0) return `${flag} must not be negative, got ${raw}`;
    return n;
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--write':
        write = true;
        break;
      case '--partner': {
        const v = argv[++i];
        if (v === undefined || v.startsWith('--') || v.length === 0) {
          return { ok: false, error: '--partner requires a partner id' };
        }
        partnerId = v;
        break;
      }
      case '--rpm':
      case '--burst': {
        const v = numeric(arg, argv[++i]);
        if (typeof v === 'string') return { ok: false, error: v };
        if (arg === '--rpm') patch.rpm = v;
        else patch.burst = v;
        break;
      }
      case '--daily-quota': {
        const raw = argv[++i];
        // The ONE non-numeric value any of these flags accepts. `none` is
        // how an operator expresses `null` on a command line, and null is
        // what "no quota" is — not 0. See the header.
        if (raw === 'none') {
          patch.dailyQuota = null;
          break;
        }
        const v = numeric(arg, raw);
        if (typeof v === 'string') {
          return {
            ok: false,
            error: `${v} (use \`--daily-quota none\` to remove the quota — 0 means BLOCK EVERY REQUEST, not unlimited)`,
          };
        }
        patch.dailyQuota = v;
        break;
      }
      default:
        return { ok: false, error: `unknown argument ${JSON.stringify(arg)}` };
    }
  }

  if (!partnerId) {
    return { ok: false, error: '--partner <id> is required' };
  }
  if (Object.keys(patch).length === 0) {
    return {
      ok: false,
      error:
        'nothing to change: pass at least one of --rpm <n>, --burst <n>, --daily-quota <n|none>',
    };
  }
  return { ok: true, args: { partnerId, patch, write } };
}

/**
 * Pure — no DB. Merges a patch onto the CURRENT limits. This is the whole
 * "a partial update must not reset the others" guarantee, in one place:
 * `current` is what was read back off the row, and only the keys actually
 * present in `patch` override it. Note the `in` checks — `dailyQuota: null`
 * is a value to apply, not an absent key, and `?? current.x` would get that
 * backwards.
 */
export function applyLimitsPatch(current: PartnerLimits, patch: LimitsPatch): PartnerLimits {
  return {
    rpm: 'rpm' in patch ? (patch.rpm as number) : current.rpm,
    burst: 'burst' in patch ? (patch.burst as number) : current.burst,
    dailyQuota: 'dailyQuota' in patch ? (patch.dailyQuota as number | null) : current.dailyQuota,
  };
}

/**
 * Pure — no DB. A line-for-line mirror of the burst computation in
 * `src/lib/tutor/portal/limits.ts`:
 *
 *   const burstCaps = [partner.limits.rpm, partner.limits.burst].filter((n) => n > 0);
 *   const burstCap = burstCaps.length > 0 ? Math.min(...burstCaps) : 0;
 *
 * Returns 0 for "no burst limiting at all", because that is what 0 means
 * downstream: the limiter's block is gated on `burstCap > 0 && …`. Kept as
 * its own exported function so the suite can pin the counter-intuitive
 * cases (0/0 is unlimited; one positive field wins over a zero one) rather
 * than only checking a printed string.
 */
export function effectiveBurstCap(limits: PartnerLimits): number {
  const caps = [limits.rpm, limits.burst].filter((n) => n > 0);
  return caps.length > 0 ? Math.min(...caps) : 0;
}

export function describeBurstCap(limits: PartnerLimits): string {
  const cap = effectiveBurstCap(limits);
  return cap > 0
    ? `${cap} req/min per (partner, endpoint)`
    : 'NO BURST LIMITING (rpm and burst are both non-positive — this is unlimited, not blocked)';
}

/**
 * The ONLY fields this script may write. Deliberately narrow, and the
 * reason it is a named exported type rather than an inline object literal:
 * `status`, `secrets`, `allowedEndpoints`, `flagOverrides`, `metering`,
 * `kind` and `name` are all operator state or creation-fixed, and a payload
 * of this type structurally cannot carry any of them. Same enforcement
 * mechanism as the seed's `UpdateSet`, for the same reason — `status:
 * 'suspended'` is the incident-response lever and a limits change must
 * never be able to restore access.
 */
export interface UpdateSet {
  limits: PartnerLimits;
  updatedAt: string;
}

/**
 * Pure — no DB. The exact `$set` payload. Copies `limits` BY VALUE so
 * nothing downstream can mutate the caller's object through the payload
 * (the seed's `buildCreateDoc` does the same for the same reason).
 */
export function buildUpdateSet(
  next: PartnerLimits,
  now: () => string = () => new Date().toISOString(),
): UpdateSet {
  return { limits: { ...next }, updatedAt: now() };
}

export interface PartnerSnapshot {
  partnerId: string;
  name: string;
  kind: string;
  status: string;
  limits: PartnerLimits;
  allowedEndpoints: string[];
}

export type ChangeResolution =
  | { ok: true; before: PartnerLimits; after: PartnerLimits }
  | { ok: false; reason: 'unknown-partner' | 'no-op'; message: string };

/**
 * Pure — no DB. Turns "the row we read (or didn't)" plus "what was asked"
 * into either a before/after pair or a refusal. Both refusals are here, not
 * inline in `main()`, so the suite can drive them without a database:
 *
 *  - `unknown-partner` — `existing === null`. This is the no-upsert
 *    guarantee expressed as a value: there is no branch anywhere that turns
 *    a missing row into a written one.
 *  - `no-op` — the requested values already ARE the current ones. Worth an
 *    abort rather than a redundant write: on a rollout step an operator
 *    needs to know whether their change landed or whether they are looking
 *    at a stale terminal, and "0 fields differ" is the signal for that.
 *    It also keeps `updatedAt` honest as "when limits last actually moved".
 */
export function resolveChange(
  partnerId: string,
  existing: PartnerSnapshot | null,
  patch: LimitsPatch,
): ChangeResolution {
  if (!existing) {
    return {
      ok: false,
      reason: 'unknown-partner',
      message:
        `No Partner row for "${partnerId}". This script NEVER creates one — a missing row here ` +
        `is either a typo in --partner or a partner that was never seeded. Check the id, and if ` +
        `it is genuinely new, create it with \`npm run seed:partner-registry\` (which seals its ` +
        `secret and grants its endpoints); then re-run this to set limits.`,
    };
  }
  const before = existing.limits;
  const after = applyLimitsPatch(before, patch);
  if (before.rpm === after.rpm && before.burst === after.burst && before.dailyQuota === after.dailyQuota) {
    return {
      ok: false,
      reason: 'no-op',
      message:
        `"${partnerId}" already has exactly these limits (rpm=${before.rpm}, burst=${before.burst}, ` +
        `dailyQuota=${before.dailyQuota ?? 'none'}). Nothing to do — no write, no updatedAt bump.`,
    };
  }
  return { ok: true, before, after };
}

function fmt(limits: PartnerLimits): string {
  return `rpm=${limits.rpm} burst=${limits.burst} dailyQuota=${limits.dailyQuota ?? 'none'}`;
}

export interface LimitsOpsDeps {
  connect(): Promise<void>;
  loadPartner(partnerId: string): Promise<PartnerSnapshot | null>;
  /** Writes `$set` on an EXISTING row. Never an upsert — see the header. */
  savePartner(partnerId: string, set: UpdateSet): Promise<void>;
  disconnect(): Promise<void>;
  log(msg: string): void;
  fail(msg: string): never;
}

const defaultDeps: LimitsOpsDeps = {
  connect: async () => {
    await connectDB();
  },
  loadPartner: async (partnerId) => {
    const doc = await PartnerModel.findById(partnerId).lean();
    if (!doc) return null;
    return {
      partnerId,
      name: doc.name,
      kind: doc.kind,
      status: doc.status,
      // `?? ` mirrors registry.ts's own `doc.limits ?? …` tolerance for a
      // row written before the field existed; the shape is otherwise
      // schema-guaranteed.
      limits: doc.limits ?? { rpm: 0, burst: 0, dailyQuota: null },
      allowedEndpoints: doc.allowedEndpoints ?? [],
    };
  },
  savePartner: async (partnerId, set) => {
    // No upsert. `updateOne` with a non-matching filter is a no-op by
    // default, and `resolveChange` has already proven the row exists.
    await PartnerModel.updateOne({ _id: partnerId }, { $set: set });
  },
  disconnect: async () => {
    await mongoose.disconnect();
  },
  log: (msg) => console.log(msg),
  fail: (msg) => {
    console.error(msg);
    process.exit(1);
  },
};

/**
 * Exported and dep-injected for the same reason the seed's `main()` is
 * exported: a well-tested pure `resolveChange` proves nothing about whether
 * `main()` ACTS on it. The suite drives this with fake deps to assert that
 * an unknown partner aborts before any write, that a dry run calls
 * `savePartner` zero times, and that `configureMongooseForOpsScript()` has
 * genuinely taken effect by the time `connect()` is called.
 */
export async function main(
  argv: string[] = process.argv.slice(2),
  deps: LimitsOpsDeps = defaultDeps,
): Promise<void> {
  const parsed = parseArgs(argv);
  if (!parsed.ok) {
    // Before any DB connection, by construction: parseArgs is pure and this
    // branch returns without reaching deps.connect().
    deps.fail(
      `${parsed.error}\n\n` +
        'Usage: npm run limits:set-partner -- --partner <id> [--rpm <n>] [--burst <n>] ' +
        '[--daily-quota <n|none>] [--write]',
    );
    return;
  }
  const { partnerId, patch, write } = parsed.args;

  // Must run before connect() — see ops-mongoose.ts. Mongoose 8 builds
  // every declared index on connect, including TutorSession's TTL index,
  // which DELETES rows, and creates missing collections. A dry run must do
  // neither. This bit this milestone already (an empty `partners`
  // collection appeared on prod from a plain dry run).
  configureMongooseForOpsScript();
  await deps.connect();

  try {
    const existing = await deps.loadPartner(partnerId);
    const resolution = resolveChange(partnerId, existing, patch);
    if (!resolution.ok) {
      deps.fail(resolution.message);
      return;
    }
    const { before, after } = resolution;
    const row = existing as PartnerSnapshot;

    deps.log(`Mode: ${write ? 'WRITE' : 'dry-run'} — partner "${partnerId}" (kind=${row.kind}, status=${row.status})`);
    deps.log(`  before: ${fmt(before)}`);
    deps.log(`  after:  ${fmt(after)}`);
    deps.log(`  effective burst cap after this change: ${describeBurstCap(after)}`);

    if (after.dailyQuota === 0) {
      deps.log(
        '\n  *** WARNING: dailyQuota=0 BLOCKS EVERY REQUEST. It is not unlimited. ***\n' +
          '  limits.ts gates on `dailyQuota != null` (not `> 0`) and rejects when count > quota; the\n' +
          "  first request of the day counts 1 > 0, so this partner gets 402 quota_exceeded on request\n" +
          '  #1 of every day. If you meant "no quota", pass `--daily-quota none`.',
      );
    } else if (after.dailyQuota != null) {
      const n = row.allowedEndpoints.length;
      deps.log(
        `\n  NOTE: dailyQuota is enforced PER (partner, endpoint), not per partner. With ` +
          `${n} allowed endpoint(s) (${row.allowedEndpoints.join(', ') || 'none'}), this partner's real ` +
          `daily ceiling is ${after.dailyQuota} x ${n} = ${after.dailyQuota * n} requests/day, not ` +
          `${after.dailyQuota}. There is no partner-wide counter today.`,
      );
    }

    if (write) {
      await deps.savePartner(partnerId, buildUpdateSet(after));
      deps.log('\nDone. Only `limits` and `updatedAt` were written.');
      deps.log(
        'The running server does NOT see this immediately: registry.ts caches partner records for ' +
          '60s per server process, and this is a separate process, so invalidatePartner() here would ' +
          'clear a cache nothing reads. Expect the new limits to take effect within 60s.',
      );
    } else {
      deps.log('\n(dry run — nothing was written. Pass --write to apply.)');
    }
  } finally {
    await deps.disconnect();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
