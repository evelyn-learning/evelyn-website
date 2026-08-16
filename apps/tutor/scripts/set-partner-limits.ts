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
 *  - `dailyQuota` IS PER (partner, endpoint), NOT PER PARTNER — and
 *    `endpoint` is the CONCRETE REQUEST PATH, not an allowlist entry.
 *    `auth.ts:280` calls `checkPartnerLimits(partner, u.pathname)`, while
 *    `allowedEndpoints` holds PREFIXES matched with `startsWith`. The
 *    standard row's allowlist is the single prefix `/api/portal/v1/`, and
 *    there are 23 concrete route files under it today. So the real daily
 *    ceiling is `dailyQuota × (number of distinct PATHS the partner calls)`,
 *    which is bounded by the routes under the prefixes and is NOT
 *    `allowedEndpoints.length` — an earlier version of this script printed
 *    that product and told a typical partner their ceiling was
 *    "10000 x 1 = 10000 requests/day, not 10000", a sentence that
 *    contradicts itself and understates the truth by roughly 23x. This
 *    script now states the fan-out qualitatively and prints no multiplier
 *    it cannot justify from the row.
 *
 * A ROW WITH NO (OR PARTIAL) `limits` IS FILLED FROM THE READER'S OWN
 * FALLBACK. `registry.ts:221` substitutes `ENV_FALLBACK_LIMITS` when
 * `doc.limits` is absent, so THAT — not 0/0 — is what the running limiter
 * enforces on such a row. This script imports that same binding rather than
 * restating its values (a second hardcoded copy is exactly how the two
 * desynced: the original fallback here was `{rpm: 0, burst: 0}`, i.e. "no
 * burst limiting", the semantic inverse of the live 60/min). Any field taken
 * from the fallback is CALLED OUT in the printed `before:` block, because it
 * is a substituted value and not a stored one — and a `--rpm`-only run on
 * such a row materialises the substituted fields into the document.
 *
 * THE WRITE IS A COMPARE-AND-SET. `savePartner` filters on the exact
 * `limits` sub-fields that were read (`$exists: false` for the ones the row
 * did not have), and requires `matchedCount === 1`. Two overlapping runs — or
 * this script racing any other writer of `limits` — cannot silently
 * last-write-win, and a write that matched nothing can no longer print
 * `Done.`
 *
 * EXIT CODES. 1 = validation failure, unknown partner, or a write that did
 * not land. 0 = success AND no-op. A no-op is a satisfied postcondition, not
 * a failure ("already applied" is the most likely outcome of re-running a
 * rollout step), and exiting non-zero for it would abort any `set -e` runbook
 * and collide with the code that means "this partner does not exist".
 * Visibility comes from the message, which is unchanged.
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
import { ENV_FALLBACK_LIMITS } from '@/lib/tutor/portal/registry';
import { configureMongooseForOpsScript } from './ops-mongoose';

/** The exact shape of `Partner.limits` (see src/models/Partner.ts). */
export interface PartnerLimits {
  rpm: number;
  burst: number;
  dailyQuota: number | null;
}

export type LimitsField = 'rpm' | 'burst' | 'dailyQuota';

/** Iteration order for every per-field walk below. */
export const LIMITS_FIELDS: readonly LimitsField[] = ['rpm', 'burst', 'dailyQuota'] as const;

/**
 * What a row LITERALLY stores under `limits`. Every key optional, because
 * `registry.ts`'s own doc type declares `limits?:` and `.lean()` applies no
 * schema defaults — so both "no `limits` at all" and "`{ rpm: 600 }` and
 * nothing else" are shapes a real document can have. `PartnerLimits` is the
 * *effective* shape; this is the *stored* one, and the two are deliberately
 * different types so a partial row cannot be passed where a complete one is
 * required.
 */
export type StoredLimits = { [K in LimitsField]?: PartnerLimits[K] | null };

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
 * Numeric rules are deliberately strict: a `/^-?\d+$/` gate rejects NaN,
 * Infinity, `1.5`, `'12O0'`, `''`, `1e3` and `0x10` before `Number()` is
 * ever called, and negatives are rejected separately so the message can say
 * which mistake was made. Repeated flags are rejected rather than last-won.
 * 0 IS accepted for every field — it is a
 * legal value with a real meaning for each of them (see the header), and
 * the operator is warned about `--daily-quota 0` rather than blocked, since
 * "block this partner entirely" is a thing an operator may genuinely want.
 */
export function parseArgs(argv: string[]): ParseResult {
  let partnerId: string | undefined;
  const patch: LimitsPatch = {};
  let write = false;
  const seen = new Set<string>();

  const numeric = (flag: string, raw: string | undefined): number | string => {
    if (raw === undefined) return `${flag} requires a value`;
    // DIGITS ONLY, checked BEFORE Number(). `Number.isInteger(Number(x))` is
    // looser than the message it prints: it accepts `1e3` (1000), `0x10`
    // (16), `0b11`, `' 12 '` and — because `Number('') === 0` — the empty
    // string, which for rpm/burst means "no cap" and for dailyQuota means
    // "block everything". A rate-limit flag has no use for exponent or hex
    // notation, and `--rpm 1e3` is far likelier a typo than an intent, so
    // the regex is the validator and Number() is only the conversion.
    const t = raw.trim();
    if (!/^-?\d+$/.test(t)) {
      return `${flag} must be a whole number, got ${JSON.stringify(raw)}`;
    }
    const n = Number(t);
    if (!Number.isSafeInteger(n)) {
      return `${flag} must be a whole number within the safe integer range, got ${JSON.stringify(raw)}`;
    }
    if (n < 0) return `${flag} must not be negative, got ${raw}`;
    return n;
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    // A REPEATED FLAG IS REJECTED, not last-won. `--rpm 900 --rpm 90`
    // silently applies 90 under a last-wins parse — the same class of typo
    // as `--rmp 900`, which is (rightly) rejected below, and with a worse
    // outcome: it reports success having applied a number the operator did
    // not mean to be final.
    if (seen.has(arg)) {
      return {
        ok: false,
        error: `${arg} was given more than once — remove the duplicate (a repeated flag would silently last-win)`,
      };
    }
    seen.add(arg);
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
  /**
   * EFFECTIVE limits: the stored values, with any absent field filled from
   * `ENV_FALLBACK_LIMITS` — i.e. what the running limiter is enforcing right
   * now, which is the only thing an operator can size a change against.
   */
  limits: PartnerLimits;
  /**
   * What the row LITERALLY stores. The compare-and-set baseline, and the
   * reason a fallback-filled `limits` cannot be mistaken for stored state.
   */
  storedLimits: StoredLimits | null;
  /** Which of `limits`'s fields came from the fallback rather than the row. */
  fallbackFields: LimitsField[];
  allowedEndpoints: string[];
}

export type StoredLimitsResolution =
  | { ok: true; limits: PartnerLimits; fallbackFields: LimitsField[] }
  | { ok: false; invalidFields: string[] };

/**
 * Pure — no DB. Turns a stored (possibly absent, possibly partial) `limits`
 * subdocument into the EFFECTIVE limits, plus the list of fields that had to
 * be substituted.
 *
 * The substitution source is `registry.ts`'s own `ENV_FALLBACK_LIMITS`
 * BINDING, imported rather than copied. This function exists because the
 * copy was wrong: it read `{ rpm: 0, burst: 0, dailyQuota: null }` under a
 * comment claiming it mirrored the registry, while the registry substitutes
 * `{ rpm: 600, burst: 60, dailyQuota: null }`. 0 means "no cap" downstream,
 * so the copy reported "no burst limiting" for a partner the limiter was
 * capping at 60/min, and a `--rpm 1200` run on such a row would have written
 * `burst: 0` — removing a live cap in the same change that turns enforcement
 * on. Importing the binding makes the two agree by construction.
 *
 * A field that is PRESENT but not a usable value (a string, NaN, a null rpm)
 * is NOT coerced and NOT silently replaced: it comes back as `invalidFields`
 * and the caller refuses. Coercing would print `burst=undefined` and write a
 * subdocument that mongoose casts back down to a partial one.
 */
export function resolveStoredLimits(
  stored: StoredLimits | null | undefined,
): StoredLimitsResolution {
  const fallbackFields: LimitsField[] = [];
  const invalidFields: string[] = [];
  const out: Record<string, number | null> = {};

  for (const key of LIMITS_FIELDS) {
    const v = stored == null ? undefined : (stored as Record<string, unknown>)[key];
    if (v === undefined) {
      // Absent — including "the whole subdocument is absent". This is the
      // case registry.ts substitutes for, so substitute the same thing.
      fallbackFields.push(key);
      out[key] = ENV_FALLBACK_LIMITS[key];
      continue;
    }
    if (key === 'dailyQuota' && v === null) {
      // A STORED null is a value ("no quota"), not an absent field.
      out[key] = null;
      continue;
    }
    if (typeof v === 'number' && Number.isFinite(v)) {
      out[key] = v;
      continue;
    }
    invalidFields.push(`${key}=${JSON.stringify(v)}`);
  }

  if (invalidFields.length > 0) return { ok: false, invalidFields };
  return { ok: true, limits: out as unknown as PartnerLimits, fallbackFields };
}

/**
 * Pure — no DB. The compare-and-set filter: `_id` plus every `limits`
 * sub-field EXACTLY as it was read, so a write only lands on the same row
 * state the before/after report was computed from.
 *
 * Dotted sub-field paths, not the whole subdocument, because a field the row
 * did not have must be matched as ABSENT — `{ 'limits.burst': 60 }` would
 * not match a row with no `limits.burst`, and matching it as `null` would
 * also match a row that stores an explicit null. `$exists: false` says
 * exactly what was observed.
 *
 * Without this, two overlapping runs (two operators, or this script racing a
 * future admin UI) clobber each other's fields and BOTH print `Done.`
 */
export function buildCasFilter(
  partnerId: string,
  stored: StoredLimits | null | undefined,
): Record<string, unknown> {
  const filter: Record<string, unknown> = { _id: partnerId };
  for (const key of LIMITS_FIELDS) {
    const v = stored == null ? undefined : (stored as Record<string, unknown>)[key];
    filter[`limits.${key}`] = v === undefined ? { $exists: false } : v;
  }
  return filter;
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
  /**
   * Writes `$set` on an EXISTING row, conditional on `expected` — the
   * `limits` the read observed — still being what the row holds. Never an
   * upsert; see the header.
   */
  savePartner(partnerId: string, set: UpdateSet, expected: StoredLimits | null): Promise<void>;
  disconnect(): Promise<void>;
  log(msg: string): void;
  /** Reports and aborts. Exit code 1 unless a caller passes another. */
  fail(msg: string, exitCode?: number): never;
}

/**
 * Exactly the fields this script reads, as a mongoose projection. Secrets
 * are sealed, not plaintext, but there is no reason to pull partner
 * ciphertexts into an ops process — and the top-level error handler and any
 * future `console.log(doc)` would put them in an ops log.
 */
export const PARTNER_READ_PROJECTION = 'name kind status limits allowedEndpoints';

/** What the projected read returns. Every field optional: it is a raw doc. */
export interface RawPartnerDoc {
  name?: string;
  kind?: string;
  status?: string;
  limits?: StoredLimits | null;
  allowedEndpoints?: string[];
}

export interface UpdateOutcome {
  matchedCount: number;
  modifiedCount: number;
}

/**
 * The two database operations, behind an interface. This exists so the
 * behaviour that used to live inline in `defaultDeps` — the fallback
 * handling, the projection, the match-count check and the compare-and-set —
 * is drivable by the suite. That region was where every finding of the first
 * review round lived, precisely because dependency injection had moved it
 * outside the tests: the only untested lines left are the four that call
 * mongoose itself.
 */
export interface PartnerStore {
  findPartner(partnerId: string, projection: string): Promise<RawPartnerDoc | null>;
  updatePartner(filter: Record<string, unknown>, set: UpdateSet): Promise<UpdateOutcome>;
}

export function makeDbDeps(store: PartnerStore): Pick<LimitsOpsDeps, 'loadPartner' | 'savePartner'> {
  return {
    loadPartner: async (partnerId) => {
      const doc = await store.findPartner(partnerId, PARTNER_READ_PROJECTION);
      if (!doc) return null;
      const resolved = resolveStoredLimits(doc.limits);
      if (!resolved.ok) {
        throw new Error(
          `Partner "${partnerId}" stores unusable limits (${resolved.invalidFields.join(', ')}). ` +
            `Refusing to guess what the limiter is enforcing: fix the row before changing its limits.`,
        );
      }
      return {
        partnerId,
        name: doc.name ?? '(unnamed)',
        kind: doc.kind ?? '(unknown)',
        status: doc.status ?? '(unknown)',
        limits: resolved.limits,
        storedLimits: doc.limits ?? null,
        fallbackFields: resolved.fallbackFields,
        allowedEndpoints: doc.allowedEndpoints ?? [],
      };
    },
    savePartner: async (partnerId, set, expected) => {
      // No upsert: `updateOne` creates nothing without one, and the filter
      // is a compare-and-set on the values the read observed.
      const res = await store.updatePartner(buildCasFilter(partnerId, expected), set);
      if (res.matchedCount !== 1) {
        throw new Error(
          `NOTHING WAS WRITTEN: the update matched ${res.matchedCount} rows for "${partnerId}". ` +
            `Either the row was deleted or re-seeded, or its \`limits\` changed between this ` +
            `script's read and its write (another operator, or another tool). Re-run to see the ` +
            `current values before deciding what to apply.`,
        );
      }
      if (res.modifiedCount !== 1) {
        throw new Error(
          `NOTHING WAS WRITTEN: the update matched "${partnerId}" but modified ` +
            `${res.modifiedCount} rows. Treat the change as NOT applied and re-run to confirm.`,
        );
      }
    },
  };
}

const mongoStore: PartnerStore = {
  findPartner: async (partnerId, projection) =>
    (await PartnerModel.findById(partnerId)
      .select(projection)
      .lean()) as RawPartnerDoc | null,
  updatePartner: async (filter, set) => {
    const res = await PartnerModel.updateOne(filter, { $set: set });
    return { matchedCount: res.matchedCount, modifiedCount: res.modifiedCount };
  },
};

/** Thrown by `fail()` so the `finally` still disconnects. See `main`'s tail. */
class OpsAbort extends Error {}

const defaultDeps: LimitsOpsDeps = {
  connect: async () => {
    await connectDB();
  },
  ...makeDbDeps(mongoStore),
  disconnect: async () => {
    await mongoose.disconnect();
  },
  log: (msg) => console.log(msg),
  fail: (msg, exitCode = 1) => {
    console.error(msg);
    // `process.exitCode` + throw, NOT `process.exit()`: an immediate exit
    // skips the `finally` that closes the connection, and can truncate the
    // abort message when stderr is a pipe (`npm run … 2>&1 | tee ops.log`),
    // because Node's pipe writes are async. Throwing unwinds through the
    // `finally` and lets the process end naturally with the code set.
    process.exitCode = exitCode;
    throw new OpsAbort(msg);
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
      if (resolution.reason === 'no-op') {
        // EXIT 0. The requested state and the actual state agree — a
        // satisfied postcondition, not a failure, and the most likely
        // outcome of re-running a rollout step or verifying yesterday's
        // raise. Exiting non-zero here would abort any `set -e` runbook and
        // would be indistinguishable from "this partner does not exist".
        // The message is unchanged; visibility comes from it, not from the
        // exit code.
        deps.log(resolution.message);
        return;
      }
      deps.fail(resolution.message);
      return;
    }
    const { before, after } = resolution;
    const row = existing as PartnerSnapshot;

    deps.log(`Mode: ${write ? 'WRITE' : 'dry-run'} — partner "${partnerId}" (kind=${row.kind}, status=${row.status})`);
    deps.log(`  before: ${fmt(before)}`);
    if (row.fallbackFields.length > 0) {
      deps.log(
        `  *** the row does NOT store ${row.fallbackFields.join(', ')} — the value(s) shown above for ` +
          `${row.fallbackFields.length === 1 ? 'that field' : 'those fields'} are\n` +
          `  registry.ts's ENV_FALLBACK_LIMITS (rpm=${ENV_FALLBACK_LIMITS.rpm} burst=${ENV_FALLBACK_LIMITS.burst} ` +
          `dailyQuota=${ENV_FALLBACK_LIMITS.dailyQuota ?? 'none'}), which is what the RUNNING limiter\n` +
          `  substitutes for a missing field — NOT stored values. Applying this change writes them into the row. ***`,
      );
    }
    deps.log(`  after:  ${fmt(after)}`);
    deps.log(`  effective burst cap after this change: ${describeBurstCap(after)}`);

    if (effectiveBurstCap(after) === 0) {
      // The inverse of the dailyQuota=0 trap, and the more dangerous half:
      // an operator reaching for "shut this partner off" gets UNLIMITED.
      deps.log(
        '\n  *** WARNING: rpm=0 and burst=0 is NO BURST LIMITING AT ALL — unlimited, not blocked. ***\n' +
          '  limits.ts takes the min over the POSITIVE values only and blocks only when\n' +
          '  `burstCap > 0 && count > burstCap`, so zeroing both fields removes every per-minute cap this\n' +
          '  partner has. This script CANNOT block a partner: that lever is `status: \'suspended\'` and it\n' +
          '  lives in a different tool. To tighten a cap, pass a small POSITIVE --rpm/--burst instead.',
      );
    }

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
        `\n  NOTE: dailyQuota is enforced PER (partner, endpoint), not per partner — and \`endpoint\` is the\n` +
          `  CONCRETE REQUEST PATH: auth.ts passes u.pathname to checkPartnerLimits, while allowedEndpoints\n` +
          `  holds PREFIXES matched with startsWith. This row allows ${n} prefix(es) ` +
          `(${row.allowedEndpoints.join(', ') || 'none'}), and a\n` +
          `  single prefix covers many concrete routes, so the real daily ceiling is ${after.dailyQuota} x (the number\n` +
          `  of distinct PATHS this partner actually calls) — strictly more than ${after.dailyQuota}, and not a number\n` +
          `  this script can compute from the row. There is no partner-wide counter today.`,
      );
    }

    if (write) {
      await deps.savePartner(partnerId, buildUpdateSet(after), row.storedLimits);
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
  main().catch((err: unknown) => {
    // OpsAbort has already been reported by fail(), which also set the exit
    // code. Anything else is unexpected: report it and set 1. No
    // process.exit() here either — letting the event loop drain is what
    // makes a piped stderr write survive.
    if (err instanceof OpsAbort) return;
    console.error(err instanceof Error ? (err.stack ?? err.message) : err);
    process.exitCode = 1;
  });
}
