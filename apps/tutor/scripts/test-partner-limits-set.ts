/**
 * Limits-edit ops script decision-logic tests (M1c, issue #9).
 *
 * Run: `npm run test:partner-limits-set`
 *
 * Hermetic, and therefore inside the `test:all` oracle
 * (`scripts/run-all-tests.mjs` auto-discovers every `test:*` entry that is
 * not in its EXCLUDE set). Two kinds of test here:
 *
 *  - Pure functions — `parseArgs`, `applyLimitsPatch`, `effectiveBurstCap`,
 *    `buildUpdateSet`, `resolveChange` take everything as arguments, so no
 *    DB is involved.
 *  - `main()` driven with FAKE deps. `main()` takes its DB access as an
 *    injected `LimitsOpsDeps`, so the abort paths, the dry-run "writes
 *    nothing" guarantee and the ordering of
 *    `configureMongooseForOpsScript()` against `connect()` are all
 *    observable without a database. The seed suite learned this the hard
 *    way: a well-tested pure gate proved nothing about whether `main()`
 *    acted on it, and three mutations shipped green.
 *
 * Every assertion here was mutation-checked: the implementation was
 * mutated in a type-valid way, this suite was confirmed RED, and the
 * mutation reverted. See .superpowers/sdd/limits-edit-path/report.md.
 */
import assert from 'node:assert';
import mongoose from 'mongoose';
import {
  parseArgs,
  applyLimitsPatch,
  sameLimits,
  effectiveBurstCap,
  describeBurstCap,
  buildUpdateSet,
  resolveChange,
  resolveBaseline,
  buildCasFilter,
  makeDbDeps,
  PARTNER_READ_PROJECTION,
  main as limitsMain,
  type LimitsBaseline,
  type LimitsView,
  type PartnerLimits,
  type PartnerSnapshot,
  type PartnerStore,
  type RawPartnerDoc,
  type StoredLimits,
  type UpdateOutcome,
  type LimitsOpsDeps,
  type UpdateSet,
} from './set-partner-limits';
import { ENV_FALLBACK_LIMITS } from '@/lib/tutor/portal/registry';
import { opsMongooseConfigured } from './ops-mongoose';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

function parsedOk(argv: string[]) {
  const r = parseArgs(argv);
  assert.strictEqual(r.ok, true, `expected parse to succeed, got: ${r.ok ? '' : r.error}`);
  return (r as Extract<typeof r, { ok: true }>).args;
}

function parseError(argv: string[]): string {
  const r = parseArgs(argv);
  assert.strictEqual(r.ok, false, 'expected parse to FAIL');
  return (r as Extract<typeof r, { ok: false }>).error;
}

(async () => {

// --- parseArgs: validation, all of it before any DB connection -----------

await test('parseArgs: --partner plus one numeric flag is the minimum viable invocation', () => {
  const args = parsedOk(['--partner', 'crimsora', '--rpm', '1200']);
  assert.strictEqual(args.partnerId, 'crimsora');
  assert.deepStrictEqual(args.patch, { rpm: 1200 });
  assert.strictEqual(args.write, false, 'dry run is the default — --write must be opt-in');
});

await test('parseArgs: --write is what turns a dry run into a write', () => {
  assert.strictEqual(parsedOk(['--partner', 'crimsora', '--rpm', '1200', '--write']).write, true);
});

await test('parseArgs: all three fields can be set in one run, and --daily-quota none means null', () => {
  const args = parsedOk([
    '--partner', 'crimsora', '--rpm', '1200', '--burst', '90', '--daily-quota', 'none',
  ]);
  assert.deepStrictEqual(args.patch, { rpm: 1200, burst: 90, dailyQuota: null });
});

await test('parseArgs: --daily-quota 0 parses to 0, NOT to null — they mean opposite things', () => {
  // 0 = block every request; null = no quota. Collapsing them would make
  // `--daily-quota 0` silently unlimited, the exact inversion the warning
  // in main() exists to prevent.
  assert.deepStrictEqual(parsedOk(['--partner', 'p', '--daily-quota', '0']).patch, { dailyQuota: 0 });
});

await test('parseArgs: a missing --partner is rejected', () => {
  assert.match(parseError(['--rpm', '10']), /--partner <id> is required/);
});

await test('parseArgs: --partner with no field flags is rejected (nothing to change)', () => {
  assert.match(parseError(['--partner', 'crimsora']), /at least one of --rpm/);
  // --write alone must not count as "a change was requested".
  assert.match(parseError(['--partner', 'crimsora', '--write']), /at least one of --rpm/);
});

await test('parseArgs: non-integer input is rejected', () => {
  assert.match(parseError(['--partner', 'p', '--rpm', '1.5']), /--rpm must be a whole number/);
  assert.match(parseError(['--partner', 'p', '--burst', '12O0']), /--burst must be a whole number/);
});

await test('parseArgs: NaN and empty-string input are rejected, not coerced to 0', () => {
  // Number('') === 0, so an empty value would sail through a naive parse
  // and set the field to 0 — which for burst means "unlimited" and for
  // dailyQuota means "block everything". Both are catastrophic defaults for
  // a typo.
  assert.match(parseError(['--partner', 'p', '--rpm', 'abc']), /must be a whole number/);
  assert.match(parseError(['--partner', 'p', '--rpm', '']), /must be a whole number/);
});

await test('parseArgs: negative input is rejected with its own message', () => {
  assert.match(parseError(['--partner', 'p', '--rpm', '-1']), /--rpm must not be negative/);
  assert.match(parseError(['--partner', 'p', '--daily-quota', '-5']), /must not be negative/);
});

await test('parseArgs: a bad --daily-quota value points at `none` and says 0 is not unlimited', () => {
  const err = parseError(['--partner', 'p', '--daily-quota', 'unlimited']);
  assert.match(err, /--daily-quota none/);
  assert.match(err, /0 means BLOCK EVERY REQUEST, not unlimited/);
});

await test('parseArgs: an unknown argument is rejected rather than ignored', () => {
  // A typo'd flag silently ignored would produce a run that reports success
  // while changing something other than what was asked.
  assert.match(parseError(['--partner', 'p', '--rmp', '900']), /unknown argument "--rmp"/);
});

await test('parseArgs: exponent and hex notation are rejected, not silently converted', () => {
  // Number('1e3') === 1000 and Number('0x10') === 16, and both pass
  // Number.isInteger — so a validator built on Number.isInteger alone is
  // looser than the "whole number" message it prints. `--rpm 1e3` is a typo,
  // not an intent, and accepting it sets a cap the operator never typed.
  assert.match(parseError(['--partner', 'p', '--rpm', '1e3']), /--rpm must be a whole number/);
  assert.match(parseError(['--partner', 'p', '--burst', '0x10']), /--burst must be a whole number/);
  assert.match(parseError(['--partner', 'p', '--daily-quota', '1_000']), /must be a whole number/);
  // …and a plain digit string still parses, so the gate is not over-tight.
  assert.deepStrictEqual(parsedOk(['--partner', 'p', '--rpm', '1200']).patch, { rpm: 1200 });
  // Surrounding whitespace IS accepted, deliberately: the trim runs before
  // the regex, a padded value out of a shell variable is unambiguous, and
  // the comment above the gate says so. Pinned so code and comment cannot
  // drift apart again.
  assert.deepStrictEqual(parsedOk(['--partner', 'p', '--rpm', '  900  ']).patch, { rpm: 900 });
  // But padding is the ONLY thing tolerated — an inner space is not a number.
  assert.match(parseError(['--partner', 'p', '--rpm', '9 00']), /--rpm must be a whole number/);
});

await test('parseArgs: a REPEATED flag is rejected rather than last-won', () => {
  // `--rpm 900 --rpm 90` applying 90 is the same class of typo as `--rmp
  // 900`, with a worse outcome: it reports success having applied a number
  // the operator did not mean to be final.
  assert.match(parseError(['--partner', 'p', '--rpm', '900', '--rpm', '90']), /--rpm was given more than once/);
  assert.match(parseError(['--partner', 'a', '--partner', 'b', '--rpm', '9']), /--partner was given more than once/);
  assert.match(
    parseError(['--partner', 'p', '--daily-quota', '10', '--daily-quota', 'none']),
    /--daily-quota was given more than once/,
  );
  // Distinct flags are of course still fine.
  assert.deepStrictEqual(
    parsedOk(['--partner', 'p', '--rpm', '900', '--burst', '90']).patch,
    { rpm: 900, burst: 90 },
  );
});

await test('parseArgs: a flag whose value is missing or is another flag is rejected', () => {
  assert.match(parseError(['--partner', '--rpm', '900']), /--partner requires a partner id/);
  assert.match(parseError(['--partner', 'p', '--rpm']), /--rpm requires a value/);
});

// --- applyLimitsPatch: the "partial update preserves the rest" guarantee --

const CURRENT: PartnerLimits = { rpm: 600, burst: 60, dailyQuota: 10000 };

await test('applyLimitsPatch: a single-field patch leaves the other two EXACTLY as they were', () => {
  assert.deepStrictEqual(applyLimitsPatch(CURRENT, { rpm: 1200 }), {
    rpm: 1200, burst: 60, dailyQuota: 10000,
  });
  assert.deepStrictEqual(applyLimitsPatch(CURRENT, { burst: 90 }), {
    rpm: 600, burst: 90, dailyQuota: 10000,
  });
  assert.deepStrictEqual(applyLimitsPatch(CURRENT, { dailyQuota: null }), {
    rpm: 600, burst: 60, dailyQuota: null,
  });
});

await test('applyLimitsPatch: an explicit dailyQuota: null is APPLIED, not treated as "absent"', () => {
  // `patch.dailyQuota ?? current.dailyQuota` would keep 10000 here and make
  // `--daily-quota none` a silent no-op.
  assert.strictEqual(applyLimitsPatch(CURRENT, { dailyQuota: null }).dailyQuota, null);
});

await test('applyLimitsPatch: an explicit 0 is applied, not swallowed as falsy', () => {
  assert.strictEqual(applyLimitsPatch(CURRENT, { rpm: 0 }).rpm, 0);
  assert.strictEqual(applyLimitsPatch(CURRENT, { dailyQuota: 0 }).dailyQuota, 0);
});

await test('applyLimitsPatch: an empty patch is the identity — no defaults leak in', () => {
  assert.deepStrictEqual(applyLimitsPatch({ rpm: 7, burst: 3, dailyQuota: 1 }, {}), {
    rpm: 7, burst: 3, dailyQuota: 1,
  });
});

// --- effectiveBurstCap: mirrors limits.ts, including the 0 == unlimited case

await test('effectiveBurstCap: the cap is the MIN of the positive values', () => {
  assert.strictEqual(effectiveBurstCap({ rpm: 600, burst: 60, dailyQuota: null }), 60);
  assert.strictEqual(effectiveBurstCap({ rpm: 30, burst: 60, dailyQuota: null }), 30);
});

await test('effectiveBurstCap: a non-positive field contributes NO cap — the positive one wins', () => {
  // filter(n => n > 0) before the min. A plain Math.min(rpm, burst) would
  // return 0 here and report "unlimited" for a partner that is genuinely
  // capped at 60.
  assert.strictEqual(effectiveBurstCap({ rpm: 0, burst: 60, dailyQuota: null }), 60);
  assert.strictEqual(effectiveBurstCap({ rpm: 600, burst: 0, dailyQuota: null }), 600);
});

await test('effectiveBurstCap: rpm 0 AND burst 0 is 0, which downstream means NO burst limiting', () => {
  // limits.ts blocks only when `burstCap > 0 && count > burstCap`, so 0 is
  // unlimited, not blocked. This is the single most invertible semantic in
  // the file.
  assert.strictEqual(effectiveBurstCap({ rpm: 0, burst: 0, dailyQuota: null }), 0);
  assert.match(describeBurstCap({ rpm: 0, burst: 0, dailyQuota: null }), /NO BURST LIMITING/);
  assert.match(describeBurstCap({ rpm: 0, burst: 0, dailyQuota: null }), /unlimited, not blocked/);
});

await test('describeBurstCap: a real cap is reported in req/min per (partner, endpoint)', () => {
  assert.strictEqual(
    describeBurstCap({ rpm: 600, burst: 60, dailyQuota: null }),
    '60 req/min per (partner, endpoint)',
  );
});

// --- buildUpdateSet: the ownership boundary, asserted on the payload -----

await test('buildUpdateSet: the $set payload carries EXACTLY limits and updatedAt, nothing else', () => {
  // Asserted on the returned object's own keys rather than via a spy on the
  // write dep: a spy only shows what this file happens to pass today, while
  // this pins the boundary itself. `status` slipping in here would let a
  // limits change un-suspend a partner.
  const set = buildUpdateSet({ rpm: 1200, burst: 90, dailyQuota: null }, () => 'TS');
  assert.deepStrictEqual(Object.keys(set).sort(), ['limits', 'updatedAt']);
  assert.deepStrictEqual(set, { limits: { rpm: 1200, burst: 90, dailyQuota: null }, updatedAt: 'TS' });
});

await test('buildUpdateSet: limits is a COPY — mutating the payload cannot reach the caller object', () => {
  const next: PartnerLimits = { rpm: 1200, burst: 90, dailyQuota: null };
  const set = buildUpdateSet(next, () => 'TS');
  set.limits.rpm = 1;
  assert.strictEqual(next.rpm, 1200);
});

await test('buildUpdateSet: a COMPLETE value writes the whole subdocument, not a sparse patch', () => {
  // $set of a partial `limits` object replaces the subdocument, so a payload
  // builder that drops "empty" values would silently unset a field.
  // dailyQuota: null deliberately — that is the field whose legal value is
  // falsy, and a "drop the empty values" builder looks fine until it vanishes.
  const set = buildUpdateSet({ rpm: 1200, burst: 60, dailyQuota: null }, () => 'TS');
  assert.deepStrictEqual(Object.keys(set.limits).sort(), ['burst', 'dailyQuota', 'rpm']);
});

await test('buildUpdateSet: an UNSET field is not materialised, and no key is ever written as undefined', () => {
  // A partial row must stay partial: writing `burst` here would give the
  // limiter a cap the row never had. `$set` replaces the subdocument, so the
  // keys present in the payload are exactly the keys the row ends up with.
  const set = buildUpdateSet({ rpm: 1200 }, () => 'TS');
  assert.deepStrictEqual(Object.keys(set.limits), ['rpm']);
  assert.ok(!('burst' in set.limits), 'an unset burst must not appear at all, not even as undefined');
  assert.ok(!Object.values(set.limits).includes(undefined as never));
});

// --- resolveBaseline: the row shapes, derived the way the READER derives them

await test('resolveBaseline: an ABSENT subdocument gets the REGISTRY\'s whole-subdocument fallback', () => {
  // registry.ts:221 is `doc.limits ?? { ...ENV_FALLBACK_LIMITS }`, so that is
  // what the limiter enforces on a row with no `limits`. A 0/0 fallback would
  // report "no burst limiting" for a partner capped at 60/min and, on a --rpm
  // run, would WRITE burst: 0 — removing a live cap as enforcement goes on.
  const r = resolveBaseline(null);
  assert.strictEqual(r.ok, true);
  const ok = r as Extract<typeof r, { ok: true }>;
  assert.strictEqual(ok.kind, 'env-fallback');
  // Compared against the imported binding, not a copy of its values: a
  // hardcoded second copy is what desynced in the first place.
  assert.deepStrictEqual(ok.limits, { ...ENV_FALLBACK_LIMITS });
  assert.deepStrictEqual(ok.unsetFields, [], 'a substituted field is not an unset one');
  assert.deepStrictEqual(resolveBaseline(undefined), r, 'undefined and null are the same absence');
});

await test('resolveBaseline: a PARTIAL subdocument keeps its missing fields UNSET — the fallback does not fire', () => {
  // THE REGRESSION THIS TEST EXISTS FOR. `??` is on the whole subdocument, so
  // a partial one is passed through as-is and a missing `burst` is
  // `undefined` to limits.ts. Filling it with 60 reports a cap of 60 for a
  // partner running at 600 and turns `--rpm 1200` into a 600 -> 60 CUT.
  const r = resolveBaseline({ rpm: 600 });
  assert.strictEqual(r.ok, true);
  const ok = r as Extract<typeof r, { ok: true }>;
  assert.strictEqual(ok.kind, 'partial');
  assert.strictEqual(ok.limits.burst, undefined, 'an unset burst must NOT become the fallback 60');
  assert.deepStrictEqual(ok.limits, { rpm: 600 }, 'exactly what is stored, nothing added');
  assert.deepStrictEqual(ok.unsetFields, ['burst', 'dailyQuota']);
  // And the cap the limiter would compute is the stored rpm, not 60.
  assert.strictEqual(effectiveBurstCap(ok.limits), 600);
});

await test('resolveBaseline: a COMPLETE subdocument is complete — nothing unset, nothing substituted', () => {
  const ok = resolveBaseline({ rpm: 1200, burst: 90, dailyQuota: 10000 }) as
    Extract<LimitsBaseline, { ok: true }>;
  assert.strictEqual(ok.kind, 'complete');
  assert.deepStrictEqual(ok.limits, { rpm: 1200, burst: 90, dailyQuota: 10000 });
  assert.deepStrictEqual(ok.unsetFields, []);
});

await test('resolveBaseline: a STORED dailyQuota null is a value, not an unset field', () => {
  // null means "no quota" and is the seeded value; calling it unset would
  // print a degenerate-row banner on every normal row.
  const ok = resolveBaseline({ rpm: 600, burst: 60, dailyQuota: null }) as
    Extract<LimitsBaseline, { ok: true }>;
  assert.strictEqual(ok.kind, 'complete');
  assert.strictEqual(ok.limits.dailyQuota, null);
  assert.deepStrictEqual(ok.unsetFields, []);
});

await test('resolveBaseline: an EMPTY stored subdocument is partial, not an absent one', () => {
  // `{} ?? fallback` is `{}` — the registry does NOT substitute here, so
  // neither may this script: the row genuinely has no caps.
  const ok = resolveBaseline({}) as Extract<LimitsBaseline, { ok: true }>;
  assert.strictEqual(ok.kind, 'partial');
  assert.deepStrictEqual(ok.limits, {});
  assert.deepStrictEqual(ok.unsetFields, ['rpm', 'burst', 'dailyQuota']);
  assert.strictEqual(effectiveBurstCap(ok.limits), 0, 'no stored field means no cap, not the fallback');
});

await test('resolveBaseline: a stored field of the WRONG type is refused, never coerced', () => {
  const bad = resolveBaseline({ rpm: 'lots' as unknown as number, burst: 60, dailyQuota: null });
  assert.strictEqual(bad.ok, false);
  assert.deepStrictEqual((bad as Extract<typeof bad, { ok: false }>).invalidFields, ['rpm="lots"']);
  // NaN is a number and would sail through a typeof check alone.
  assert.strictEqual(resolveBaseline({ rpm: 600, burst: Number.NaN }).ok, false, 'NaN is not a usable cap');
  // A null rpm is not "unset" — it is a stored value of the wrong type.
  assert.strictEqual(resolveBaseline({ rpm: null, burst: 60 }).ok, false, 'null is legal ONLY for dailyQuota');
});

// --- the unset semantics, mirrored from limits.ts ------------------------

await test('effectiveBurstCap: an UNSET field contributes no cap, exactly as limits.ts drops it', () => {
  // limits.ts: [rpm, burst].filter(n => n > 0) — `undefined > 0` is false, so
  // a missing field simply is not a cap. Substituting one changes the answer.
  assert.strictEqual(effectiveBurstCap({ rpm: 600 }), 600, 'no burst stored -> rpm is the only cap');
  assert.strictEqual(effectiveBurstCap({ burst: 60 }), 60);
  assert.strictEqual(effectiveBurstCap({}), 0, 'nothing stored -> no burst limiting at all');
});

await test('applyLimitsPatch: an unnamed UNSET field stays unset — a raise must not materialise a cap', () => {
  const after = applyLimitsPatch({ rpm: 600 }, { rpm: 1200 });
  assert.deepStrictEqual(after, { rpm: 1200 });
  assert.ok(!('burst' in after), '--rpm must not invent a burst the row never had');
  assert.strictEqual(effectiveBurstCap(after), 1200, 'the cap goes 600 -> 1200, not 600 -> 60');
  // Naming it explicitly IS how an operator sets it.
  assert.deepStrictEqual(applyLimitsPatch({ rpm: 600 }, { burst: 90 }), { rpm: 600, burst: 90 });
});

await test('sameLimits: unset and set are different states, both directions', () => {
  assert.strictEqual(sameLimits({ rpm: 600 }, { rpm: 600 }), true);
  assert.strictEqual(sameLimits({ rpm: 600 }, { rpm: 600, burst: 60 }), false);
  assert.strictEqual(sameLimits({ rpm: 600, burst: 60 }, { rpm: 600 }), false);
  // null is a value, and it is not the same as unset.
  assert.strictEqual(sameLimits({ dailyQuota: null }, {}), false);
  assert.strictEqual(sameLimits({}, {}), true);
});

// --- buildCasFilter: the compare-and-set baseline ------------------------

await test('buildCasFilter: every limits sub-field is matched EXACTLY as it was read', () => {
  assert.deepStrictEqual(buildCasFilter('crimsora', { rpm: 600, burst: 60, dailyQuota: null }), {
    _id: 'crimsora',
    'limits.rpm': 600,
    'limits.burst': 60,
    'limits.dailyQuota': null,
  });
});

await test('buildCasFilter: a field the row did NOT have is matched as absent, not as its fallback', () => {
  // Matching a substituted 60 would never match the row (it has no
  // limits.burst), turning every fallback-row write into a false conflict;
  // matching null would also match a row that stores an explicit null.
  assert.deepStrictEqual(buildCasFilter('crimsora', { rpm: 900 }), {
    _id: 'crimsora',
    'limits.rpm': 900,
    'limits.burst': { $exists: false },
    'limits.dailyQuota': { $exists: false },
  });
  assert.deepStrictEqual(buildCasFilter('crimsora', null), {
    _id: 'crimsora',
    'limits.rpm': { $exists: false },
    'limits.burst': { $exists: false },
    'limits.dailyQuota': { $exists: false },
  });
});

// --- resolveChange: the two aborts -------------------------------------

const SNAPSHOT: PartnerSnapshot = {
  partnerId: 'crimsora',
  name: 'crimsora',
  kind: 'partner',
  status: 'active',
  limits: { rpm: 600, burst: 60, dailyQuota: null },
  baselineKind: 'complete',
  unsetFields: [],
  storedLimits: { rpm: 600, burst: 60, dailyQuota: null },
  allowedEndpoints: ['/api/portal/v1/'],
};

/** A snapshot of a row that stores exactly these limits. */
function snapWith(limits: PartnerLimits): PartnerSnapshot {
  return { ...SNAPSHOT, limits, storedLimits: { ...limits } };
}

/** A snapshot of a row storing a PARTIAL subdocument — the NB1 shape. */
function partialSnap(stored: StoredLimits): PartnerSnapshot {
  const ok = resolveBaseline(stored) as Extract<LimitsBaseline, { ok: true }>;
  return {
    ...SNAPSHOT,
    limits: ok.limits,
    baselineKind: ok.kind,
    unsetFields: ok.unsetFields,
    storedLimits: stored,
  };
}

/** A snapshot of a row with NO `limits` subdocument at all — the C1 shape. */
const FALLBACK_SNAP: PartnerSnapshot = {
  ...SNAPSHOT,
  limits: { ...ENV_FALLBACK_LIMITS },
  baselineKind: 'env-fallback',
  unsetFields: [],
  storedLimits: null,
};

await test('resolveChange: a partner with NO row is refused as unknown-partner and named seed:partner-registry', () => {
  const r = resolveChange('crimosra', null, { rpm: 1200 });
  assert.strictEqual(r.ok, false);
  assert.strictEqual((r as Extract<typeof r, { ok: false }>).reason, 'unknown-partner');
  assert.match((r as Extract<typeof r, { ok: false }>).message, /NEVER creates one/);
  assert.match((r as Extract<typeof r, { ok: false }>).message, /seed:partner-registry/);
});

/** The `noop` flag of an `ok` resolution. */
function noopOf(r: ReturnType<typeof resolveChange>): boolean {
  assert.strictEqual(r.ok, true, 'expected a resolution, not a refusal');
  return (r as Extract<typeof r, { ok: true }>).noop;
}

await test('resolveChange: requesting the values a partner ALREADY stores is a no-op', () => {
  const r = resolveChange('crimsora', SNAPSHOT, { rpm: 600, burst: 60, dailyQuota: null });
  assert.strictEqual(noopOf(r), true);
  assert.match(
    (r as Extract<typeof r, { ok: true }>).message ?? '',
    /already stores exactly these limits/,
  );
});

await test('resolveChange: a no-op is detected across ALL THREE fields, not just rpm', () => {
  const snap: PartnerSnapshot = snapWith({ rpm: 600, burst: 60, dailyQuota: 10000 });
  // Same rpm, different burst -> a real change, not a no-op.
  assert.strictEqual(noopOf(resolveChange('crimsora', snap, { burst: 90 })), false);
  // Same rpm+burst, different quota -> a real change.
  assert.strictEqual(noopOf(resolveChange('crimsora', snap, { dailyQuota: null })), false);
  // Every field identical -> no-op.
  assert.strictEqual(
    noopOf(resolveChange('crimsora', snap, { rpm: 600, burst: 60, dailyQuota: 10000 })),
    true,
  );
});

await test('resolveChange: the no-op comparison is against STORED state, not against substituted values', () => {
  // On a row with no `limits`, `--rpm 600` MATERIALISES the fallback: the
  // effective limits do not move, but the row goes from storing nothing to
  // storing 600/60/none. Calling that "already has these limits" was a false
  // statement about stored state on the likeliest re-run path.
  const r = resolveChange('crimsora', FALLBACK_SNAP, {
    rpm: ENV_FALLBACK_LIMITS.rpm,
    burst: ENV_FALLBACK_LIMITS.burst,
    dailyQuota: ENV_FALLBACK_LIMITS.dailyQuota,
  });
  assert.strictEqual(noopOf(r), false, 'writing the fallback into an empty row IS a change');
  // A partial row is still compared field for field, unset included.
  const partial = partialSnap({ rpm: 600 });
  assert.strictEqual(noopOf(resolveChange('crimsora', partial, { rpm: 600 })), true);
  assert.strictEqual(
    noopOf(resolveChange('crimsora', partial, { burst: 60 })), false,
    'setting a field that was unset is a change, even to the fallback value',
  );
});

await test('resolveChange: a real change returns before/after, with after MERGED onto before', () => {
  const r = resolveChange('crimsora', SNAPSHOT, { rpm: 1200 });
  assert.strictEqual(r.ok, true);
  const okR = r as Extract<typeof r, { ok: true }>;
  assert.deepStrictEqual(okR.before, { rpm: 600, burst: 60, dailyQuota: null });
  assert.deepStrictEqual(okR.after, { rpm: 1200, burst: 60, dailyQuota: null });
});

// --- main(): does it ACT on all of the above? ---------------------------

class Aborted extends Error {}

interface FakeRun {
  logs: string;
  aborted?: string;
  /** The code `fail()` was called with — `undefined` means it was never called. */
  exitCode?: number;
  writes: Array<{ partnerId: string; set: UpdateSet; expected: StoredLimits | null }>;
  connected: boolean;
  disconnected: boolean;
  guardAtConnect: boolean | null;
  error?: Error;
}

async function runMain(argv: string[], partner: PartnerSnapshot | null): Promise<FakeRun> {
  return runMainWith(argv, partner, {});
}

async function runMainWith(
  argv: string[],
  partner: PartnerSnapshot | null,
  overrides: Partial<LimitsOpsDeps>,
): Promise<FakeRun> {
  const run: FakeRun = {
    logs: '', writes: [], connected: false, disconnected: false, guardAtConnect: null,
  };
  const deps: LimitsOpsDeps = {
    connect: async () => {
      run.connected = true;
      // Sampled AT the connection attempt: this is the only moment the
      // ordering of configureMongooseForOpsScript() actually matters.
      run.guardAtConnect = opsMongooseConfigured();
    },
    loadPartner: async () => partner,
    savePartner: async (partnerId, set, expected) => { run.writes.push({ partnerId, set, expected }); },
    disconnect: async () => { run.disconnected = true; },
    log: (m) => { run.logs += `${m}\n`; },
    fail: (m, code = 1) => { run.aborted = m; run.exitCode = code; throw new Aborted(m); },
    ...overrides,
  };
  try {
    await limitsMain(argv, deps);
  } catch (e) {
    if (!(e instanceof Aborted)) run.error = e as Error;
  }
  return run;
}

await test('main(): a DRY RUN writes NOTHING, and says so', async () => {
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200'], SNAPSHOT);
  assert.strictEqual(run.aborted, undefined, `unexpected abort: ${run.aborted}`);
  assert.strictEqual(run.writes.length, 0, 'a run without --write must call savePartner zero times');
  assert.match(run.logs, /Mode: dry-run/);
  assert.match(run.logs, /nothing was written/);
});

await test('main(): --write calls savePartner exactly once, with the narrow $set payload', async () => {
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200', '--write'], SNAPSHOT);
  assert.strictEqual(run.writes.length, 1);
  assert.strictEqual(run.writes[0].partnerId, 'crimsora');
  assert.deepStrictEqual(Object.keys(run.writes[0].set).sort(), ['limits', 'updatedAt']);
  assert.deepStrictEqual(run.writes[0].set.limits, { rpm: 1200, burst: 60, dailyQuota: null });
  assert.match(run.logs, /Mode: WRITE/);
});

await test('main(): --write on a PARTIAL update preserves the unnamed fields in the written payload', async () => {
  const snap: PartnerSnapshot = snapWith({ rpm: 600, burst: 60, dailyQuota: 10000 });
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200', '--write'], snap);
  assert.deepStrictEqual(
    run.writes[0].set.limits,
    { rpm: 1200, burst: 60, dailyQuota: 10000 },
    'burst and dailyQuota must survive an rpm-only run — this is the whole point of issue #9',
  );
});

await test('main(): an UNKNOWN partner aborts and writes nothing — no upsert, ever', async () => {
  const run = await runMain(['--partner', 'crimosra', '--rpm', '1200', '--write'], null);
  assert.ok(run.aborted, 'main() must abort on a missing row, not create one');
  assert.match(run.aborted ?? '', /seed:partner-registry/);
  assert.strictEqual(run.writes.length, 0, 'a missing row must never be written to');
  assert.strictEqual(run.disconnected, true, 'the connection must still be closed on the abort path');
});

await test('main(): a NO-OP writes nothing, says so, and exits 0 — a satisfied postcondition is not a failure', async () => {
  // "already applied" is the most likely outcome of re-running a rollout
  // step, or of verifying yesterday's raise. Exiting non-zero for it aborts
  // any `set -e` runbook and is indistinguishable from the code that means
  // "this partner does not exist". Visibility is the message's job.
  const run = await runMain(['--partner', 'crimsora', '--rpm', '600', '--write'], SNAPSHOT);
  assert.strictEqual(run.aborted, undefined, 'a no-op must NOT go through the failure path');
  assert.strictEqual(run.exitCode, undefined, 'a no-op must not set a non-zero exit code');
  assert.match(run.logs, /already stores exactly these limits/, 'and it must still say so, loudly');
  assert.strictEqual(run.writes.length, 0, 'a redundant write must not bump updatedAt');
  assert.strictEqual(run.disconnected, true, 'the connection must still be closed');
});

await test('main(): an unknown partner exits NON-ZERO — the failure path is still a failure', async () => {
  // The counterpart to the no-op's exit 0: these two must not share a code.
  const run = await runMain(['--partner', 'crimosra', '--rpm', '1200', '--write'], null);
  assert.strictEqual(run.exitCode, 1);
});

await test('main(): invalid input aborts BEFORE connecting to the DB', async () => {
  const run = await runMain(['--partner', 'crimsora', '--rpm', '-1', '--write'], SNAPSHOT);
  assert.match(run.aborted ?? '', /must not be negative/);
  assert.strictEqual(run.connected, false, 'validation must precede any DB connection');
  assert.strictEqual(run.writes.length, 0);
});

await test('main(): prints before -> after', async () => {
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200'], SNAPSHOT);
  assert.match(run.logs, /before: rpm=600 burst=60 dailyQuota=none/);
  assert.match(run.logs, /after:  rpm=1200 burst=60 dailyQuota=none/);
});

await test('main(): prints the resulting EFFECTIVE burst cap, computed the way limits.ts computes it', async () => {
  const run = await runMain(['--partner', 'crimsora', '--rpm', '30'], SNAPSHOT);
  // rpm=30, burst=60 -> min of the positives = 30.
  assert.match(run.logs, /effective burst cap after this change: 30 req\/min per \(partner, endpoint\)/);
});

await test('main(): rpm 0 + burst 0 is reported as NO burst limiting, not as a block', async () => {
  const snap: PartnerSnapshot = snapWith({ rpm: 600, burst: 0, dailyQuota: null });
  const run = await runMain(['--partner', 'crimsora', '--rpm', '0'], snap);
  assert.match(run.logs, /NO BURST LIMITING/);
  assert.match(run.logs, /unlimited, not blocked/);
});

await test('main(): a resulting cap of 0 gets the SAME loud banner as dailyQuota=0, and names status suspended', async () => {
  // The inverse of the quota trap and the more dangerous half: an operator
  // reaching for "shut this partner off" receives UNLIMITED, at the moment
  // enforcement goes live. It must not be reported as an ordinary cap line.
  const snap: PartnerSnapshot = snapWith({ rpm: 600, burst: 0, dailyQuota: null });
  const run = await runMain(['--partner', 'crimsora', '--rpm', '0'], snap);
  assert.match(run.logs, /\*\*\* WARNING: rpm=0 and burst=0 is NO BURST LIMITING AT ALL/);
  assert.match(run.logs, /CANNOT block a partner/);
  assert.match(run.logs, /status: 'suspended'/);
});

await test('main(): a run that leaves a POSITIVE cap prints no such banner', async () => {
  // The banner must be tied to the resulting cap, not printed on every run.
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200'], SNAPSHOT);
  assert.ok(!/NO BURST LIMITING AT ALL/.test(run.logs), 'rpm=1200 burst=60 is capped at 60');
  assert.ok(!/CANNOT block a partner/.test(run.logs));
});

await test('main(): --daily-quota 0 prints a LOUD warning that it blocks every request', async () => {
  const run = await runMain(['--partner', 'crimsora', '--daily-quota', '0'], SNAPSHOT);
  assert.match(run.logs, /WARNING: dailyQuota=0 BLOCKS EVERY REQUEST/);
  assert.match(run.logs, /It is not unlimited/);
  assert.match(run.logs, /--daily-quota none/);
});

await test('main(): --daily-quota none prints NO block warning — null is the real "no quota"', async () => {
  const snap: PartnerSnapshot = snapWith({ rpm: 600, burst: 60, dailyQuota: 10000 });
  const run = await runMain(['--partner', 'crimsora', '--daily-quota', 'none'], snap);
  assert.ok(!/BLOCKS EVERY REQUEST/.test(run.logs), 'null must not be confused with 0');
  assert.ok(!/PER \(partner, endpoint\)/.test(run.logs), 'there is no quota to explain the fan-out of');
});

await test('main(): a positive quota explains the fan-out by PATH, and prints NO multiplier it cannot justify', async () => {
  // auth.ts:280 passes u.pathname to checkPartnerLimits; allowedEndpoints
  // holds PREFIXES matched with startsWith. Multiplying by
  // allowedEndpoints.length told a typical single-prefix partner
  // "10000 x 1 = 10000 requests/day, not 10000" — a sentence that
  // contradicts itself and understates the truth by the ~23 routes under the
  // prefix. The fan-out is real; the number is not computable from the row.
  const snap: PartnerSnapshot = { ...SNAPSHOT, allowedEndpoints: ['/api/portal/v1/'] };
  const run = await runMain(['--partner', 'crimsora', '--daily-quota', '10000'], snap);
  assert.match(run.logs, /PER \(partner, endpoint\), not per partner/);
  assert.match(run.logs, /CONCRETE REQUEST PATH/);
  assert.match(run.logs, /u\.pathname/);
  assert.match(run.logs, /PREFIXES matched with startsWith/);
  assert.match(run.logs, /distinct PATHS this partner actually calls/);
  assert.ok(
    !/10000 x 1 =/.test(run.logs),
    'the allowedEndpoints.length product is wrong and must not be printed',
  );
  assert.ok(!/= \d+ requests\/day/.test(run.logs), 'no computed daily ceiling may be asserted at all');
});

await test('main(): a successful WRITE states the 60s cache delay rather than implying immediacy', async () => {
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200', '--write'], SNAPSHOT);
  assert.match(run.logs, /does NOT see this immediately/);
  assert.match(run.logs, /60s/);
});

await test('main(): autoIndex and autoCreate are BOTH off by the time connect() is called', async () => {
  // Re-armed first, then asserted on the state sampled INSIDE the fake
  // connect(): a dry run must never build TutorSession's TTL index (which
  // deletes rows) or create a collection. Deleting the guard from the two
  // sibling ops scripts left every suite green once already.
  mongoose.set('autoIndex', true);
  mongoose.set('autoCreate', true);
  assert.strictEqual(opsMongooseConfigured(), false, 'sanity: the guard is genuinely re-armed');
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200'], SNAPSHOT);
  assert.strictEqual(run.connected, true, 'sanity: connect() was reached');
  assert.strictEqual(
    run.guardAtConnect, true,
    'configureMongooseForOpsScript() must run BEFORE connect(), not after',
  );
});

await test('main(): a row with NO limits says the values are the ENV FALLBACK, not stored ones', async () => {
  // The one number the operator sizes the enforcement flip against: on this
  // row the limiter really is running 600/60, but the row holds nothing, and
  // applying the change materialises those values.
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200'], FALLBACK_SNAP);
  assert.match(run.logs, /stores NO `limits` subdocument at all/);
  assert.match(
    run.logs,
    new RegExp(
      `ENV_FALLBACK_LIMITS \\(rpm=${ENV_FALLBACK_LIMITS.rpm} burst=${ENV_FALLBACK_LIMITS.burst} ` +
        `dailyQuota=${ENV_FALLBACK_LIMITS.dailyQuota ?? 'none'}\\)`,
    ),
    'the banner must quote the imported binding\'s values, not a restatement of them',
  );
  assert.match(run.logs, /NOT stored values/);
  assert.match(run.logs, /writes them into the row/);
  assert.match(run.logs, /before: rpm=600 burst=60 dailyQuota=none/, 'the live values, from the fallback');
});

await test('main(): a PARTIAL row reports its unset fields as unset — and a raise does not become a cut', async () => {
  // NB1, the regression this whole shape exists to pin. registry.ts falls
  // back on the WHOLE subdocument, so `{rpm:600}` reaches the limiter with
  // burst undefined: the live cap is 600, not 60. Filling burst from the
  // fallback reported 60 and made `--rpm 1200` a 600 -> 60 CUT.
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200', '--write'], partialSnap({ rpm: 600 }));
  assert.match(run.logs, /before: rpm=600 burst=unset dailyQuota=unset/);
  assert.match(run.logs, /stores `limits` but NOT burst, dailyQuota/);
  assert.match(run.logs, /env fallback does NOT\n {2}apply to a partial subdocument/);
  assert.match(run.logs, /would CUT the effective cap/);
  assert.match(run.logs, /after:  rpm=1200 burst=unset dailyQuota=unset/);
  assert.match(
    run.logs, /effective burst cap after this change: 1200 req\/min/,
    'the cap must go 600 -> 1200; reporting 60 here is the regression',
  );
  assert.deepStrictEqual(
    run.writes[0].set.limits, { rpm: 1200 },
    'and the write must not materialise burst — that is what cut the cap',
  );
});

await test('main(): a fully-stored row prints NEITHER degenerate-row banner', async () => {
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200'], SNAPSHOT);
  assert.ok(!/ENV_FALLBACK_LIMITS/.test(run.logs), 'nothing was substituted, so nothing may be claimed');
  assert.ok(!/but NOT/.test(run.logs), 'nothing is unset either');
  assert.ok(!/unset/.test(run.logs), 'and no field may print as unset');
});

await test('main(): the degenerate-row banner prints even when the run is a NO-OP', async () => {
  // NB2: the no-op check used to return before the banner, so the likeliest
  // re-run path onto a degenerate row was also the one path that suppressed
  // the warning about it. `--rpm 600` on a row storing only `{rpm: 600}` is
  // exactly that path: nothing to write, and everything to warn about.
  const run = await runMain(['--partner', 'crimsora', '--rpm', '600', '--write'], partialSnap({ rpm: 600 }));
  assert.match(run.logs, /before: rpm=600 burst=unset dailyQuota=unset/);
  assert.match(
    run.logs, /stores `limits` but NOT burst, dailyQuota/,
    'the banner must print BEFORE the no-op return, not be skipped by it',
  );
  assert.match(run.logs, /already stores exactly these limits \(rpm=600 burst=unset dailyQuota=unset\)/);
  assert.strictEqual(run.writes.length, 0, 'still a no-op: nothing is written');
  assert.strictEqual(run.exitCode, undefined, 'and still exit 0');
});

await test('main(): re-typing the fallback values on a limits-less row is a WRITE, not a no-op', async () => {
  // The row stores nothing; "already stores exactly these limits" would be a
  // false statement about stored state, and it suppressed the banner too.
  const run = await runMain(
    ['--partner', 'crimsora', '--rpm', '600', '--burst', '60', '--daily-quota', 'none', '--write'],
    FALLBACK_SNAP,
  );
  assert.ok(!/already stores/.test(run.logs), 'a row that stores nothing has nothing "already"');
  assert.match(run.logs, /stores NO `limits` subdocument at all/, 'and the banner must print');
  assert.strictEqual(run.writes.length, 1, 'materialising the fallback is a real write');
  assert.deepStrictEqual(run.writes[0].set.limits, { rpm: 600, burst: 60, dailyQuota: null });
});

await test('main(): the write carries the STORED limits as its compare-and-set baseline', async () => {
  // Not the effective limits: a substituted value was never in the row, and a
  // CAS on it would never match. What was read is what must be matched.
  const run = await runMain(['--partner', 'crimsora', '--rpm', '1200', '--write'], partialSnap({ rpm: 600 }));
  assert.strictEqual(run.writes.length, 1);
  assert.deepStrictEqual(run.writes[0].expected, { rpm: 600 });
  // A limits-less row must be matched as storing nothing at all.
  const fb = await runMain(['--partner', 'crimsora', '--rpm', '1200', '--write'], FALLBACK_SNAP);
  assert.strictEqual(fb.writes[0].expected, null);
  // And on a normal row it is the full stored subdocument.
  const plain = await runMain(['--partner', 'crimsora', '--rpm', '1200', '--write'], SNAPSHOT);
  assert.deepStrictEqual(plain.writes[0].expected, { rpm: 600, burst: 60, dailyQuota: null });
});

await test('main(): an error on the DB path is reported through fail(), not as a raw throw', async () => {
  // `NOTHING WAS WRITTEN` and `stores unusable limits` are the two loudest
  // failures this script has; reaching the require.main tail printed them as
  // a stack trace.
  const run = await runMainWith(
    ['--partner', 'crimsora', '--rpm', '1200', '--write'],
    SNAPSHOT,
    { savePartner: async () => { throw new Error('NOTHING WAS WRITTEN: the update matched 0 rows'); } },
  );
  assert.match(run.aborted ?? '', /Writing partner "crimsora" failed: NOTHING WAS WRITTEN/);
  assert.strictEqual(run.exitCode, 1);
  assert.strictEqual(run.error, undefined, 'it must not escape as an unhandled throw');
  assert.strictEqual(run.disconnected, true, 'and the connection must still be closed');

  const read = await runMainWith(
    ['--partner', 'crimsora', '--rpm', '1200'],
    SNAPSHOT,
    { loadPartner: async () => { throw new Error('stores unusable limits (rpm="lots")'); } },
  );
  assert.match(read.aborted ?? '', /Reading partner "crimsora" failed: stores unusable limits/);
  assert.strictEqual(read.error, undefined);

  // The connection itself is the first thing that goes wrong on a new box.
  const conn = await runMainWith(
    ['--partner', 'crimsora', '--rpm', '1200'],
    SNAPSHOT,
    { connect: async () => { throw new Error('MONGODB_URI not configured'); } },
  );
  assert.match(conn.aborted ?? '', /Connecting to MongoDB failed: MONGODB_URI not configured/);
  assert.strictEqual(conn.error, undefined);
});

// --- makeDbDeps: the DB-facing behaviour, driven through a fake store ----
// Everything that used to be inline in `defaultDeps` lives here now, because
// that is where every finding of the first review round was: the projection,
// the fallback handling, the match-count check and the compare-and-set were
// executed by no test and reached by no mutation. Only the four lines that
// call mongoose itself remain untested.

interface FakeStore extends PartnerStore {
  reads: Array<{ partnerId: string; projection: string }>;
  updates: Array<{ filter: Record<string, unknown>; set: UpdateSet }>;
}

function fakeStore(doc: RawPartnerDoc | null, outcome: UpdateOutcome = { matchedCount: 1, modifiedCount: 1 }): FakeStore {
  const store: FakeStore = {
    reads: [],
    updates: [],
    findPartner: async (partnerId, projection) => {
      store.reads.push({ partnerId, projection });
      return doc;
    },
    updatePartner: async (filter, set) => {
      store.updates.push({ filter, set });
      return outcome;
    },
  };
  return store;
}

const SET: UpdateSet = { limits: { rpm: 1200, burst: 60, dailyQuota: null }, updatedAt: 'TS' };

await test('makeDbDeps.loadPartner: reads with a PROJECTION that excludes secrets', async () => {
  // Sealed ciphertexts have no business in an ops process: the top-level
  // handler prints whole error objects, and any future console.log(doc)
  // would put partner secrets in an ops log.
  const store = fakeStore({ name: 'n', kind: 'partner', status: 'active', limits: { rpm: 600, burst: 60, dailyQuota: null } });
  await makeDbDeps(store).loadPartner('crimsora');
  assert.strictEqual(store.reads.length, 1);
  assert.strictEqual(store.reads[0].partnerId, 'crimsora');
  assert.strictEqual(store.reads[0].projection, PARTNER_READ_PROJECTION);
  assert.ok(!/secret/i.test(PARTNER_READ_PROJECTION), 'the projection must never name secrets');
  for (const field of ['limits', 'allowedEndpoints', 'kind', 'status', 'name']) {
    assert.ok(PARTNER_READ_PROJECTION.split(' ').includes(field), `the projection must include ${field}`);
  }
});

await test('makeDbDeps.loadPartner: a missing document is null — never a synthesised row', async () => {
  const store = fakeStore(null);
  assert.strictEqual(await makeDbDeps(store).loadPartner('crimosra'), null);
});

await test('makeDbDeps.loadPartner: a row with NO limits reports the registry fallback AND flags it', async () => {
  const store = fakeStore({ name: 'n', kind: 'partner', status: 'active', allowedEndpoints: ['/api/portal/v1/'] });
  const snap = await makeDbDeps(store).loadPartner('crimsora');
  assert.ok(snap);
  assert.strictEqual(snap.baselineKind, 'env-fallback');
  assert.deepStrictEqual(snap.limits, { ...ENV_FALLBACK_LIMITS });
  assert.strictEqual(snap.storedLimits, null, 'the CAS baseline must record that nothing was stored');
  assert.deepStrictEqual(snap.unsetFields, [], 'substituted is not the same as unset');
});

await test('makeDbDeps.loadPartner: a PARTIAL limits row keeps its unset fields unset', async () => {
  // The end-to-end version of NB1: what the dep hands `main` is what gets
  // printed and written, so the fallback must not be filled in here either.
  const store = fakeStore({ name: 'n', kind: 'partner', status: 'active', limits: { rpm: 600 } });
  const snap = await makeDbDeps(store).loadPartner('crimsora');
  assert.ok(snap);
  assert.strictEqual(snap.baselineKind, 'partial');
  assert.strictEqual(snap.limits.burst, undefined, 'an unset burst must not become the fallback 60');
  assert.deepStrictEqual(snap.unsetFields, ['burst', 'dailyQuota']);
  assert.deepStrictEqual(snap.storedLimits, { rpm: 600 });
  assert.strictEqual(effectiveBurstCap(snap.limits), 600, 'the live cap is rpm, not the fallback burst');
});

await test('makeDbDeps.loadPartner: an unusable stored value THROWS instead of being coerced', async () => {
  const store = fakeStore({
    name: 'n', kind: 'partner', status: 'active',
    limits: { rpm: 'lots' as unknown as number, burst: 60, dailyQuota: null },
  });
  await assert.rejects(
    () => makeDbDeps(store).loadPartner('crimsora'),
    /stores unusable limits \(rpm="lots"\)/,
  );
});

await test('makeDbDeps.savePartner: the update is a COMPARE-AND-SET on the limits that were read', async () => {
  const store = fakeStore(null);
  await makeDbDeps(store).savePartner('crimsora', SET, { rpm: 600, burst: 60, dailyQuota: null });
  assert.strictEqual(store.updates.length, 1);
  assert.deepStrictEqual(store.updates[0].filter, {
    _id: 'crimsora',
    'limits.rpm': 600,
    'limits.burst': 60,
    'limits.dailyQuota': null,
  });
  assert.deepStrictEqual(store.updates[0].set, SET, 'and the payload is still only limits + updatedAt');
});

await test('makeDbDeps.savePartner: a write that matched NO row throws — it can never print Done.', async () => {
  // The row was deleted, re-seeded under another _id, or its limits moved
  // between the read and the write. Reporting success here writes a raise
  // into the runbook that did not happen, right before the enforcement flip
  // that depends on it.
  const store = fakeStore(null, { matchedCount: 0, modifiedCount: 0 });
  await assert.rejects(
    () => makeDbDeps(store).savePartner('crimsora', SET, { rpm: 600, burst: 60, dailyQuota: null }),
    /NOTHING WAS WRITTEN: the update matched 0 rows for "crimsora"/,
  );
});

await test('makeDbDeps.savePartner: matched-but-not-modified also throws, rather than reporting success', async () => {
  const store = fakeStore(null, { matchedCount: 1, modifiedCount: 0 });
  await assert.rejects(
    () => makeDbDeps(store).savePartner('crimsora', SET, null),
    /modified 0 rows/,
  );
});

await test('makeDbDeps.savePartner: a clean 1/1 write resolves', async () => {
  // The counterweight to the two throws above: the happy path must not be
  // collateral damage of the guard.
  await makeDbDeps(fakeStore(null)).savePartner('crimsora', SET, null);
});

await test('makeDbDeps: loadPartner + savePartner round-trip on a fallback row matches the row as ABSENT', async () => {
  // End to end through both deps: what the read observed (no limits at all)
  // is what the write conditions on, so the CAS neither false-conflicts on a
  // fallback row nor matches a row someone has since populated.
  const store = fakeStore({ name: 'n', kind: 'partner', status: 'active' });
  const deps = makeDbDeps(store);
  const snap = await deps.loadPartner('crimsora');
  await deps.savePartner('crimsora', SET, snap!.storedLimits);
  assert.deepStrictEqual(store.updates[0].filter, {
    _id: 'crimsora',
    'limits.rpm': { $exists: false },
    'limits.burst': { $exists: false },
    'limits.dailyQuota': { $exists: false },
  });
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
