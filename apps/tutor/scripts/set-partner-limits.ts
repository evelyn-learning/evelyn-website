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
 * THE TWO DEGENERATE ROW SHAPES ARE HANDLED THE WAY THE READER HANDLES
 * THEM, WHICH IS NOT THE SAME WAY FOR BOTH. `registry.ts:221` is
 * `limits: doc.limits ?? { ...ENV_FALLBACK_LIMITS }` — a WHOLE-SUBDOCUMENT
 * fallback. It fires only when `limits` is entirely absent. So:
 *
 *  - `limits` ABSENT — the limiter runs on `ENV_FALLBACK_LIMITS`. This
 *    script substitutes the same values, from the imported binding rather
 *    than a restatement of it (a second hardcoded copy is exactly how the
 *    two desynced once already: the fallback here read `{rpm: 0, burst: 0}`,
 *    i.e. "no burst limiting", the semantic inverse of the live 60/min).
 *    A run on such a row materialises those values into the document, which
 *    preserves the cap the partner is actually running under.
 *
 *  - `limits` PRESENT BUT PARTIAL — the fallback does NOT fire. The limiter
 *    uses the subdocument as-is, and a missing field is `undefined`:
 *    `[rpm, burst].filter((n) => n > 0)` drops it (so it contributes NO
 *    cap), and `dailyQuota != null` is false (so there is no quota). An
 *    unset field is therefore NOT the fallback value and must not be filled
 *    with it — doing that on `{ rpm: 600 }` reports a cap of 60 for a
 *    partner running at 600 and makes `--rpm 1200` write `burst: 60`,
 *    CUTTING the effective cap 600 -> 60 with a command whose whole purpose
 *    is raising it. This script keeps unset fields unset, excludes them from
 *    the cap exactly as `limits.ts` does, and writes a subdocument that is
 *    still missing them.
 *
 * Either shape is CALLED OUT in the printed `before:` block, with different
 * wording, because "substituting the env fallback" and "these fields are
 * unset and contribute no cap" are different statements. The banner prints
 * before any no-op return, so it cannot be suppressed by the most likely
 * re-run path.
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
 * A limits value in which a field may be UNSET, i.e. `undefined`.
 *
 * This is the type the whole reporting and merging path runs on, because it
 * is the shape the LIMITER sees: a partial row reaches `limits.ts` with
 * `undefined` in the missing slots, and every predicate there quietly drops
 * them (`undefined > 0` is false; `undefined != null` is false). Modelling
 * unset as "the fallback value" instead would be a lie in the one direction
 * that costs a live cap — see the header.
 */
export type LimitsView = { [K in LimitsField]?: PartnerLimits[K] };

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
    // (16), `0b11` and — because `Number('') === 0` — the empty string,
    // which for rpm/burst means "no cap" and for dailyQuota means "block
    // everything". A rate-limit flag has no use for exponent or hex
    // notation, and `--rpm 1e3` is far likelier a typo than an intent, so
    // the regex is the validator and Number() is only the conversion.
    // Surrounding whitespace IS accepted (`--rpm ' 900 '` is 900): the trim
    // runs first, and a padded value from a shell variable is unambiguous.
    // Everything the regex then sees must be digits.
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
 *
 * An UNSET field stays unset unless the patch names it. A field the row does
 * not store contributes no cap to the live limiter, so materialising one
 * here — with the fallback value or with anything else — would change the
 * effective limits behind an operator who only asked to change `rpm`.
 */
export function applyLimitsPatch(current: LimitsView, patch: LimitsPatch): LimitsView {
  const out: LimitsView = {};
  const rpm = 'rpm' in patch ? patch.rpm : current.rpm;
  if (rpm !== undefined) out.rpm = rpm;
  const burst = 'burst' in patch ? patch.burst : current.burst;
  if (burst !== undefined) out.burst = burst;
  const dailyQuota = 'dailyQuota' in patch ? patch.dailyQuota : current.dailyQuota;
  if (dailyQuota !== undefined) out.dailyQuota = dailyQuota;
  return out;
}

/**
 * Pure — no DB. True when two limits values are the same, INCLUDING which
 * fields are unset: `{ rpm: 600 }` and `{ rpm: 600, burst: 60 }` are
 * different states even though the stored one is a subset.
 */
export function sameLimits(a: LimitsView, b: LimitsView): boolean {
  return LIMITS_FIELDS.every((key) => a[key] === b[key]);
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
 *
 * An UNSET field drops out of the filter for free — `undefined > 0` is
 * false — which is precisely what happens to a partial row inside
 * `limits.ts`. The `typeof` guard is there for the type, not for the
 * semantics: it must not change which values survive the filter.
 */
export function effectiveBurstCap(limits: LimitsView): number {
  const caps = [limits.rpm, limits.burst].filter((n): n is number => typeof n === 'number' && n > 0);
  return caps.length > 0 ? Math.min(...caps) : 0;
}

export function describeBurstCap(limits: LimitsView): string {
  const cap = effectiveBurstCap(limits);
  return cap > 0
    ? `${cap} req/min per (partner, endpoint)`
    : 'NO BURST LIMITING (neither rpm nor burst is a positive number — this is unlimited, not blocked)';
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
  limits: LimitsView;
  updatedAt: string;
}

/**
 * Pure — no DB. The exact `$set` payload. Copies `limits` BY VALUE so
 * nothing downstream can mutate the caller's object through the payload
 * (the seed's `buildCreateDoc` does the same for the same reason).
 *
 * Only DEFINED fields are copied, and a key is never written as
 * `undefined`. `$set` on `limits` replaces the whole subdocument, so the
 * keys present here are exactly the keys the row ends up with: a complete
 * value writes three, and a partial one deliberately writes fewer, leaving
 * the unset fields unset rather than materialising a cap the row never had.
 */
export function buildUpdateSet(
  next: LimitsView,
  now: () => string = () => new Date().toISOString(),
): UpdateSet {
  const limits: LimitsView = {};
  if (next.rpm !== undefined) limits.rpm = next.rpm;
  if (next.burst !== undefined) limits.burst = next.burst;
  if (next.dailyQuota !== undefined) limits.dailyQuota = next.dailyQuota;
  return { limits, updatedAt: now() };
}

export interface PartnerSnapshot {
  partnerId: string;
  name: string;
  kind: string;
  status: string;
  /**
   * What the RUNNING LIMITER sees today, derived exactly as `registry.ts`
   * derives it: the stored subdocument, or `ENV_FALLBACK_LIMITS` if there is
   * no subdocument at all. A partial subdocument keeps its unset fields
   * unset, because that is what reaches `limits.ts`.
   */
  limits: LimitsView;
  /** How `limits` above was arrived at. Drives which banner is printed. */
  baselineKind: LimitsBaselineKind;
  /** Fields the row does not store. Non-empty only for a PARTIAL row. */
  unsetFields: LimitsField[];
  /**
   * What the row LITERALLY stores. The compare-and-set baseline, and the
   * reason substituted values cannot be mistaken for stored state.
   */
  storedLimits: StoredLimits | null;
  allowedEndpoints: string[];
}

/**
 * - `complete`     — all three fields stored. The ordinary row.
 * - `env-fallback` — no `limits` subdocument at all; `registry.ts:221`
 *                    substitutes `ENV_FALLBACK_LIMITS` wholesale.
 * - `partial`      — a subdocument missing at least one field. The fallback
 *                    does NOT fire; the missing fields are `undefined` to the
 *                    limiter and contribute nothing.
 */
export type LimitsBaselineKind = 'complete' | 'env-fallback' | 'partial';

export type LimitsBaseline =
  | { ok: true; kind: LimitsBaselineKind; limits: LimitsView; unsetFields: LimitsField[] }
  | { ok: false; invalidFields: string[] };

/**
 * Pure — no DB. Turns a stored (possibly absent, possibly partial) `limits`
 * subdocument into what the LIMITER is enforcing, deriving it the way
 * `registry.ts` + `limits.ts` derive it rather than approximating:
 *
 *   registry.ts:221   limits: doc.limits ?? { ...ENV_FALLBACK_LIMITS }
 *
 * The `??` is on the WHOLE subdocument. So the fallback is substituted only
 * when nothing is stored; a partial subdocument is passed through as-is and
 * its missing fields simply do not participate. Substituting PER FIELD looks
 * like the same thing and is not: on `{ rpm: 600 }` it reports a cap of 60
 * for a partner running uncapped-by-burst at 600, and turns `--rpm 1200`
 * into a 600 -> 60 cut. That is a regression this file shipped once.
 *
 * The substitution source is the imported `ENV_FALLBACK_LIMITS` BINDING, not
 * a restatement of its values: the first version of this fallback read
 * `{ rpm: 0, burst: 0 }` — "no burst limiting", the semantic inverse of the
 * live 60/min — under a comment claiming it mirrored the registry.
 *
 * A field that is PRESENT but not a usable value (a string, NaN, a null rpm)
 * is NOT coerced and NOT silently replaced: it comes back as `invalidFields`
 * and the caller refuses. Coercing would print `burst=undefined` and write a
 * subdocument that mongoose casts back down to a partial one.
 */
export function resolveBaseline(stored: StoredLimits | null | undefined): LimitsBaseline {
  if (stored == null) {
    return { ok: true, kind: 'env-fallback', limits: { ...ENV_FALLBACK_LIMITS }, unsetFields: [] };
  }

  const unsetFields: LimitsField[] = [];
  const invalidFields: string[] = [];
  const limits: LimitsView = {};

  for (const key of LIMITS_FIELDS) {
    const v = (stored as Record<string, unknown>)[key];
    if (v === undefined) {
      // Unset, NOT substituted: `undefined > 0` is false in limits.ts's
      // filter and `undefined != null` is false in its quota gate, so this
      // field contributes nothing to the live limits.
      unsetFields.push(key);
      continue;
    }
    if (key === 'dailyQuota' && v === null) {
      // A STORED null is a value ("no quota"), not an unset field.
      limits.dailyQuota = null;
      continue;
    }
    if (typeof v === 'number' && Number.isFinite(v)) {
      if (key === 'rpm') limits.rpm = v;
      else if (key === 'burst') limits.burst = v;
      else limits.dailyQuota = v;
      continue;
    }
    invalidFields.push(`${key}=${JSON.stringify(v)}`);
  }

  if (invalidFields.length > 0) return { ok: false, invalidFields };
  return {
    ok: true,
    kind: unsetFields.length > 0 ? 'partial' : 'complete',
    limits,
    unsetFields,
  };
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
  | { ok: false; reason: 'unknown-partner'; message: string }
  | { ok: true; before: LimitsView; after: LimitsView; noop: boolean; message: string | null };

/**
 * Pure — no DB. Turns "the row we read (or didn't)" plus "what was asked"
 * into a before/after pair, a no-op verdict, or the one refusal:
 *
 *  - `unknown-partner` — `existing === null`. This is the no-upsert
 *    guarantee expressed as a value: there is no branch anywhere that turns
 *    a missing row into a written one.
 *  - `noop: true` — the write would leave the STORED subdocument exactly as
 *    it is. Worth reporting rather than performing: on a rollout step an
 *    operator needs to know whether their change landed or whether they are
 *    looking at a stale terminal, and it keeps `updatedAt` honest as "when
 *    limits last actually moved". It is not a refusal — `main` prints the
 *    full before/after report first and exits 0.
 *
 * The no-op comparison is against `storedLimits`, NOT against the effective
 * limits. On a row with no `limits` subdocument the effective values are
 * substituted, so `--rpm 600` there does change the row — it materialises
 * the fallback — and calling that "already has exactly these limits" was a
 * false statement about stored state on the most likely re-run path.
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
  const stored = storedView(existing);
  if (sameLimits(after, stored)) {
    return {
      ok: true,
      before,
      after,
      noop: true,
      message:
        `"${partnerId}" already stores exactly these limits (${fmt(stored)}). Nothing to do — ` +
        `no write, no updatedAt bump.`,
    };
  }
  return { ok: true, before, after, noop: false, message: null };
}

/**
 * The STORED fields as a `LimitsView`. For a `complete` or `partial` row
 * that is `existing.limits` itself (both are derived from stored values
 * only); an `env-fallback` row stores nothing, so its view is empty — which
 * is exactly what makes materialising the fallback a real change rather than
 * a no-op.
 */
function storedView(existing: PartnerSnapshot): LimitsView {
  return existing.baselineKind === 'env-fallback' ? {} : existing.limits;
}

function show(v: number | null | undefined): string {
  if (v === undefined) return 'unset';
  if (v === null) return 'none';
  return String(v);
}

function fmt(limits: LimitsView): string {
  return `rpm=${show(limits.rpm)} burst=${show(limits.burst)} dailyQuota=${show(limits.dailyQuota)}`;
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
      const baseline = resolveBaseline(doc.limits);
      if (!baseline.ok) {
        throw new Error(
          `Partner "${partnerId}" stores unusable limits (${baseline.invalidFields.join(', ')}). ` +
            `Refusing to guess what the limiter is enforcing: fix the row before changing its limits.`,
        );
      }
      return {
        partnerId,
        name: doc.name ?? '(unnamed)',
        kind: doc.kind ?? '(unknown)',
        status: doc.status ?? '(unknown)',
        limits: baseline.limits,
        baselineKind: baseline.kind,
        unsetFields: baseline.unsetFields,
        storedLimits: doc.limits ?? null,
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
 * Runs a database call and routes any failure through `deps.fail`, so the
 * two loudest failures this script can produce — `NOTHING WAS WRITTEN` and
 * `stores unusable limits` — reach the operator as the clean one-line abort
 * `fail()` prints, rather than as a raw stack trace from the `require.main`
 * tail. The exit code and the `finally` disconnect are unchanged; only the
 * output is. Nothing it wraps calls `fail()` itself — `connect`,
 * `loadPartner` and `savePartner` report by throwing — so there is no
 * already-reported case to special-case here.
 */
async function tryDb<T>(deps: LimitsOpsDeps, what: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    deps.fail(`${what} failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

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
  await tryDb(deps, 'Connecting to MongoDB', () => deps.connect());

  try {
    const existing = await tryDb(deps, `Reading partner "${partnerId}"`, () =>
      deps.loadPartner(partnerId),
    );
    const resolution = resolveChange(partnerId, existing, patch);
    if (!resolution.ok) {
      deps.fail(resolution.message);
      return;
    }
    const { before, after, noop } = resolution;
    const row = existing as PartnerSnapshot;

    deps.log(`Mode: ${write ? 'WRITE' : 'dry-run'} — partner "${partnerId}" (kind=${row.kind}, status=${row.status})`);
    deps.log(`  before: ${fmt(before)}`);
    // Printed BEFORE any no-op return: a re-run is the likeliest path onto a
    // degenerate row, and it is the path that most needs the warning.
    if (row.baselineKind === 'env-fallback') {
      deps.log(
        `  *** the row stores NO \`limits\` subdocument at all. The values above are registry.ts's\n` +
          `  ENV_FALLBACK_LIMITS (${fmt(ENV_FALLBACK_LIMITS)}) — what the RUNNING limiter substitutes for a\n` +
          `  missing subdocument (\`doc.limits ?? { ...ENV_FALLBACK_LIMITS }\`), NOT stored values.\n` +
          `  Applying this change writes them into the row. ***`,
      );
    } else if (row.baselineKind === 'partial') {
      deps.log(
        `  *** the row stores \`limits\` but NOT ${row.unsetFields.join(', ')}. The env fallback does NOT\n` +
          `  apply to a partial subdocument — registry.ts falls back on the WHOLE subdocument — so ${row.unsetFields.length === 1 ? 'that' : 'those'}\n` +
          `  field(s) reach the limiter as \`undefined\`: they contribute NO cap (\`undefined > 0\` is false)\n` +
          `  and no quota (\`undefined != null\` is false). This script leaves them unset; filling them\n` +
          `  would CUT the effective cap. Name one explicitly (--burst <n>) if you want it set. ***`,
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

    if (noop) {
      // EXIT 0, and only after the full report above — a satisfied
      // postcondition is not a failure, and it is the most likely outcome of
      // re-running a rollout step or verifying yesterday's raise. Exiting
      // non-zero would abort any `set -e` runbook and be indistinguishable
      // from "this partner does not exist". Visibility comes from the
      // message, not from the exit code.
      deps.log(`\n${resolution.message}`);
      return;
    }

    if (write) {
      await tryDb(deps, `Writing partner "${partnerId}"`, () =>
        deps.savePartner(partnerId, buildUpdateSet(after), row.storedLimits),
      );
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
