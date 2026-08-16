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
  effectiveBurstCap,
  describeBurstCap,
  buildUpdateSet,
  resolveChange,
  main as limitsMain,
  type PartnerLimits,
  type PartnerSnapshot,
  type LimitsOpsDeps,
  type UpdateSet,
} from './set-partner-limits';
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

await test('buildUpdateSet: the whole limits subdocument is written, not a sparse patch', () => {
  // $set of a partial `limits` object replaces the subdocument and lets the
  // schema defaults (600/60/null) take over the missing keys. All three
  // fields must always be present.
  // dailyQuota: null deliberately — a "drop the empty values" payload
  // builder is the realistic way this goes wrong, and it looks fine until
  // the one field whose legal value is null vanishes and the schema default
  // fills it back in.
  const set = buildUpdateSet({ rpm: 1200, burst: 60, dailyQuota: null }, () => 'TS');
  assert.deepStrictEqual(Object.keys(set.limits).sort(), ['burst', 'dailyQuota', 'rpm']);
});

// --- resolveChange: the two aborts -------------------------------------

const SNAPSHOT: PartnerSnapshot = {
  partnerId: 'crimsora',
  name: 'crimsora',
  kind: 'partner',
  status: 'active',
  limits: { rpm: 600, burst: 60, dailyQuota: null },
  allowedEndpoints: ['/api/portal/v1/'],
};

await test('resolveChange: a partner with NO row is refused as unknown-partner and named seed:partner-registry', () => {
  const r = resolveChange('crimosra', null, { rpm: 1200 });
  assert.strictEqual(r.ok, false);
  assert.strictEqual((r as Extract<typeof r, { ok: false }>).reason, 'unknown-partner');
  assert.match((r as Extract<typeof r, { ok: false }>).message, /NEVER creates one/);
  assert.match((r as Extract<typeof r, { ok: false }>).message, /seed:partner-registry/);
});

await test('resolveChange: requesting the values a partner ALREADY has is refused as a no-op', () => {
  const r = resolveChange('crimsora', SNAPSHOT, { rpm: 600, burst: 60, dailyQuota: null });
  assert.strictEqual(r.ok, false);
  assert.strictEqual((r as Extract<typeof r, { ok: false }>).reason, 'no-op');
  assert.match((r as Extract<typeof r, { ok: false }>).message, /already has exactly these limits/);
});

await test('resolveChange: a no-op is detected across ALL THREE fields, not just rpm', () => {
  const snap: PartnerSnapshot = { ...SNAPSHOT, limits: { rpm: 600, burst: 60, dailyQuota: 10000 } };
  // Same rpm, different burst -> a real change, not a no-op.
  assert.strictEqual(resolveChange('crimsora', snap, { burst: 90 }).ok, true);
  // Same rpm+burst, different quota -> a real change.
  assert.strictEqual(resolveChange('crimsora', snap, { dailyQuota: null }).ok, true);
  // Every field identical -> no-op.
  assert.strictEqual(resolveChange('crimsora', snap, { rpm: 600, burst: 60, dailyQuota: 10000 }).ok, false);
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
  writes: Array<{ partnerId: string; set: UpdateSet }>;
  connected: boolean;
  disconnected: boolean;
  guardAtConnect: boolean | null;
  error?: Error;
}

async function runMain(argv: string[], partner: PartnerSnapshot | null): Promise<FakeRun> {
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
    savePartner: async (partnerId, set) => { run.writes.push({ partnerId, set }); },
    disconnect: async () => { run.disconnected = true; },
    log: (m) => { run.logs += `${m}\n`; },
    fail: (m) => { run.aborted = m; throw new Aborted(m); },
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
  const snap: PartnerSnapshot = { ...SNAPSHOT, limits: { rpm: 600, burst: 60, dailyQuota: 10000 } };
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

await test('main(): a NO-OP request aborts and writes nothing', async () => {
  const run = await runMain(['--partner', 'crimsora', '--rpm', '600', '--write'], SNAPSHOT);
  assert.match(run.aborted ?? '', /already has exactly these limits/);
  assert.strictEqual(run.writes.length, 0, 'a redundant write must not bump updatedAt');
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
  const snap: PartnerSnapshot = { ...SNAPSHOT, limits: { rpm: 600, burst: 0, dailyQuota: null } };
  const run = await runMain(['--partner', 'crimsora', '--rpm', '0'], snap);
  assert.match(run.logs, /NO BURST LIMITING/);
  assert.match(run.logs, /unlimited, not blocked/);
});

await test('main(): --daily-quota 0 prints a LOUD warning that it blocks every request', async () => {
  const run = await runMain(['--partner', 'crimsora', '--daily-quota', '0'], SNAPSHOT);
  assert.match(run.logs, /WARNING: dailyQuota=0 BLOCKS EVERY REQUEST/);
  assert.match(run.logs, /It is not unlimited/);
  assert.match(run.logs, /--daily-quota none/);
});

await test('main(): --daily-quota none prints NO block warning — null is the real "no quota"', async () => {
  const snap: PartnerSnapshot = { ...SNAPSHOT, limits: { rpm: 600, burst: 60, dailyQuota: 10000 } };
  const run = await runMain(['--partner', 'crimsora', '--daily-quota', 'none'], snap);
  assert.ok(!/BLOCKS EVERY REQUEST/.test(run.logs), 'null must not be confused with 0');
  assert.ok(!/PER \(partner, endpoint\)/.test(run.logs), 'there is no quota to explain the fan-out of');
});

await test('main(): a positive quota states the per-endpoint fan-out with the real endpoint count', async () => {
  const snap: PartnerSnapshot = {
    ...SNAPSHOT,
    allowedEndpoints: ['/api/portal/v1/', '/api/portal/v1/practice'],
  };
  const run = await runMain(['--partner', 'crimsora', '--daily-quota', '10000'], snap);
  assert.match(run.logs, /PER \(partner, endpoint\), not per partner/);
  assert.match(run.logs, /10000 x 2 = 20000 requests\/day/);
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

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
