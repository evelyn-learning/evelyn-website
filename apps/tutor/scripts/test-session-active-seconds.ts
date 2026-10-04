/**
 * Active seconds of a (possibly resumed) tutor session (2026-10-03).
 *
 * `duration` used to be whatever the LAST page mount measured, so a resumed
 * embed session reported its final sitting only (515 s for a 37-minute
 * session). The pure helpers in lib/tutor/recordings/active-seconds.ts define
 * one figure — the attempts' durations summed, pauses excluded — used by the
 * session-usage route (stored `duration`), the embed's `evelyn:session_ended`
 * message, the partner summary's one-message fallback and the admin/replay
 * tiles. Pinned with the production session's numbers.
 *
 *   npx tsx scripts/test-session-active-seconds.ts
 */
import assert from 'node:assert';
import {
  buildAttemptSpanWrite,
  dedupeAttemptSpans,
  durationBehindSpans,
  endedDurationSeconds,
  parseAttemptSpans,
  planAttemptSave,
  readActiveSecondsField,
  sessionActiveSeconds,
  sumActiveSeconds,
} from '../src/lib/tutor/recordings/active-seconds';
import { resolveSessionSpan } from '../src/lib/tutor/recordings/session-span';
import { summarizeTutorSession } from '../src/lib/tutor/portal/session-summary';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}

const T0 = Date.parse('2026-10-01T15:00:00.000Z');
const at = (sec: number) => new Date(T0 + sec * 1000);
const iso = (sec: number) => at(sec).toISOString();
// The production session: attempt 1 ran 1754 s, the student came back and
// attempt 2 ran 515 s. The doc's `duration` said 515.
/** The three figures every plan answers (the plan also carries write details). */
const core = (p: { seed: unknown; priorActiveSec: number; activeSec: number | null }) => ({ seed: p.seed, priorActiveSec: p.priorActiveSec, activeSec: p.activeSec });
const planCore = (i: Parameters<typeof planAttemptSave>[0]) => core(planAttemptSave(i));
const REAL = [{ startedAt: at(0), duration: 1754 }, { startedAt: at(1761.3), duration: 515 }];

console.log('\nsessionActiveSeconds');

check('resumed session: attempts summed, pause excluded (1754 + 515 = 2269)', () => {
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: REAL, duration: 515 }), 2269);
  // A long pause between sittings changes nothing.
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: [REAL[0], { startedAt: at(86_400), duration: 515 }], duration: 515 }), 2269);
});

check('single attempt: its own duration', () => {
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: [{ startedAt: at(0), duration: 842 }], duration: 842 }), 842);
});

check('no attemptSpans (every session before 2026-10-03): the stored duration, untouched', () => {
  assert.strictEqual(sessionActiveSeconds({ duration: 515 }), 515);
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: [], duration: 515 }), 515);
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: undefined, duration: 0 }), 0);
  assert.strictEqual(sessionActiveSeconds({}), null);
  assert.strictEqual(sessionActiveSeconds({ duration: NaN }), null);
  assert.strictEqual(sessionActiveSeconds(null), null);
});

check('duplicate entries for one startedAt count once (the longest report wins)', () => {
  const dup = [REAL[0], { startedAt: at(1761.3), duration: 300 }, { startedAt: iso(1761.3), duration: 515 }, { startedAt: at(1761.3), duration: 515 }];
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: dup, duration: 515 }), 2269);
  assert.deepStrictEqual(dedupeAttemptSpans(parseAttemptSpans(dup)), [
    { startedAtMs: T0, durationSec: 1754 },
    { startedAtMs: T0 + 1_761_300, durationSec: 515 },
  ]);
});

check('a span still in progress counts what its mount last reported (no endedAt needed)', () => {
  const live = [{ startedAt: at(0), duration: 1754, endedAt: at(1754) }, { startedAt: at(1761.3), duration: 90 }];
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: live, duration: 90 }), 1844);
  // …and grows with the next periodic flush of the same mount.
  live[1] = { startedAt: at(1761.3), duration: 120 };
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: live, duration: 120 }), 1874);
});

check('malformed span entries are ignored; Dates, ISO strings and epoch ms all parse', () => {
  const raw = [{ startedAt: 'nope', duration: 5 }, { startedAt: at(0), duration: -3 }, null, { startedAt: iso(0), duration: 7 }, { startedAt: T0 + 60_000, duration: 9 }, { startedAt: at(120), duration: '4' }];
  assert.deepStrictEqual(parseAttemptSpans(raw), [{ startedAtMs: T0, durationSec: 7 }, { startedAtMs: T0 + 60_000, durationSec: 9 }]);
  assert.strictEqual(sumActiveSeconds(parseAttemptSpans(raw)), 16);
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: [{ startedAt: 'nope', duration: 5 }], duration: 33 }), 33);
});

console.log('\nplanAttemptSave (session-usage route)');

check('first save of a new session: no prior time, duration = this attempt', () => {
  assert.deepStrictEqual(planCore({ existing: null, attemptStartMs: T0, attemptDurationSec: 30 }), { seed: null, priorActiveSec: 0, activeSec: 30 });
});

check('later save of the same mount: its own span is replaced, not added', () => {
  const existing = { startedAt: at(0), duration: 30, attemptSpans: [{ startedAt: at(0), duration: 30 }] };
  assert.deepStrictEqual(planCore({ existing, attemptStartMs: T0, attemptDurationSec: 60 }), { seed: null, priorActiveSec: 0, activeSec: 60 });
});

check('resumed mount: prior = earlier attempts, stored duration = cumulative (the real case)', () => {
  const existing = { startedAt: at(0), duration: 1754, attemptSpans: [REAL[0]] };
  const start2 = T0 + 1_761_300;
  assert.deepStrictEqual(planCore({ existing, attemptStartMs: start2, attemptDurationSec: 30 }), { seed: null, priorActiveSec: 1754, activeSec: 1784 });
  // Final save of attempt 2, with its span already recorded by earlier flushes.
  const later = { startedAt: at(0), duration: 2239, attemptSpans: [REAL[0], { startedAt: at(1761.3), duration: 485 }] };
  assert.deepStrictEqual(planCore({ existing: later, attemptStartMs: start2, attemptDurationSec: 515 }), { seed: null, priorActiveSec: 1754, activeSec: 2269 });
});

check('a client-supplied total is never trusted: a stale/smaller report cannot shrink earlier attempts', () => {
  const existing = { startedAt: at(0), duration: 2269, attemptSpans: REAL };
  // Attempt 3 reports 10 s; whatever the client believes the total is, the
  // server answers 1754 + 515 + 10.
  assert.deepStrictEqual(planCore({ existing, attemptStartMs: T0 + 9_000_000, attemptDurationSec: 10 }), { seed: null, priorActiveSec: 2269, activeSec: 2279 });
});

check('checkpoint save without a duration: prior is still answered, duration left alone', () => {
  const existing = { startedAt: at(0), duration: 1754, attemptSpans: [REAL[0]] };
  assert.deepStrictEqual(planCore({ existing, attemptStartMs: T0 + 1_761_300, attemptDurationSec: null }), { seed: null, priorActiveSec: 1754, activeSec: null });
  assert.deepStrictEqual(planCore({ existing: null, attemptStartMs: T0, attemptDurationSec: null }), { seed: null, priorActiveSec: 0, activeSec: null });
});

check('pre-field session resumed now: its stored duration seeds the first span instead of being overwritten', () => {
  const legacy = { startedAt: at(0), duration: 1754 };
  const plan = planAttemptSave({ existing: legacy, attemptStartMs: T0 + 1_761_300, attemptDurationSec: 515 });
  assert.deepStrictEqual(core(plan), { seed: { startedAtMs: T0, durationSec: 1754 }, priorActiveSec: 1754, activeSec: 2269 });
});

check('no seed when the doc has no spans because this SAME mount created it (or /tutor kept the original startedAt)', () => {
  // First save landed (duration set), span push not yet / failed.
  assert.deepStrictEqual(planCore({ existing: { startedAt: at(0), duration: 30 }, attemptStartMs: T0, attemptDurationSec: 60 }), { seed: null, priorActiveSec: 0, activeSec: 60 });
  // Retail resume: same startedAt, duration is that page's own wall figure.
  assert.deepStrictEqual(planCore({ existing: { startedAt: iso(0), duration: 5000, attemptSpans: [{ startedAt: at(0), duration: 5000 }] }, attemptStartMs: T0, attemptDurationSec: 5400 }), { seed: null, priorActiveSec: 0, activeSec: 5400 });
  // Nothing to seed from: a checkpoint-only doc with no duration.
  assert.deepStrictEqual(planCore({ existing: { startedAt: at(0) }, attemptStartMs: T0 + 5000, attemptDurationSec: 12 }), { seed: null, priorActiveSec: 0, activeSec: 12 });
});

console.log('\noverlapping attempts (two tabs on one sessionId): wall time covered once');

check('two tabs: A runs 30 min, B opened 1 min later runs 29 min → 30 min, not 59', () => {
  const tabs = [{ startedAt: at(0), duration: 1800 }, { startedAt: at(60), duration: 1740 }];
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: tabs, duration: 3540 }), 1800);
  // B outlives A by a minute: the extra minute counts, the overlap does not.
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: [tabs[0], { startedAt: at(60), duration: 1800 }] }), 1860);
});

check('fully nested span adds nothing', () => {
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: [{ startedAt: at(0), duration: 1800 }, { startedAt: at(300), duration: 600 }] }), 1800);
  // Order in the array is irrelevant.
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: [{ startedAt: at(300), duration: 600 }, { startedAt: at(0), duration: 1800 }] }), 1800);
});

check('touching spans (one ends the instant the next starts) are simply added', () => {
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: [{ startedAt: at(0), duration: 600 }, { startedAt: at(600), duration: 600 }] }), 1200);
});

check('sequential sittings are unaffected: 1754 + 515 = 2269; fractional seconds stay exact', () => {
  assert.strictEqual(sumActiveSeconds(parseAttemptSpans(REAL)), 2269);
  assert.strictEqual(sumActiveSeconds(parseAttemptSpans([{ startedAt: at(0), duration: 515.4 }, { startedAt: at(1000), duration: 0.3 }])), 515.7);
  assert.strictEqual(sumActiveSeconds([]), 0);
});

check('three spans, a chain of overlaps plus a separate sitting', () => {
  const spans = [{ startedAt: at(0), duration: 100 }, { startedAt: at(50), duration: 100 }, { startedAt: at(120), duration: 100 }, { startedAt: at(1000), duration: 40 }];
  assert.strictEqual(sessionActiveSeconds({ attemptSpans: spans }), 220 + 40);
});

console.log('\nplanAttemptSave: overlap, never-decreasing span, seed bound');

check('prior = union of everything − this mount (prior + own never exceeds the union)', () => {
  const doc = { startedAt: at(0), duration: 1800, attemptSpans: [{ startedAt: at(0), duration: 1800 }, { startedAt: at(60), duration: 1710 }] };
  // Tab B (opened at +60 s) saves 1740 s: all of it lies inside A's span, so
  // the only time B does not itself cover is A's first minute.
  assert.deepStrictEqual(planCore({ existing: doc, attemptStartMs: T0 + 60_000, attemptDurationSec: 1740 }), { seed: null, priorActiveSec: 60, activeSec: 1800 });
  // Tab A saves 1800 s: B adds nothing A does not cover.
  assert.deepStrictEqual(planCore({ existing: doc, attemptStartMs: T0, attemptDurationSec: 1800 }), { seed: null, priorActiveSec: 0, activeSec: 1800 });
  // B outlives A: B's own 1800 + A's uncovered first minute.
  assert.deepStrictEqual(planCore({ existing: doc, attemptStartMs: T0 + 60_000, attemptDurationSec: 1800 }), { seed: null, priorActiveSec: 60, activeSec: 1860 });
  // Checkpoint (no duration) from B: prior measured against B's recorded span.
  assert.deepStrictEqual(planCore({ existing: doc, attemptStartMs: T0 + 60_000, attemptDurationSec: null }), { seed: null, priorActiveSec: 90, activeSec: null });
});

check('a mount\'s span never shrinks: an out-of-order (older) save keeps the stored figure', () => {
  const doc = { startedAt: at(0), duration: 120, attemptSpans: [{ startedAt: at(0), duration: 120 }] };
  const stale = planAttemptSave({ existing: doc, attemptStartMs: T0, attemptDurationSec: 90 });
  assert.deepStrictEqual([stale.ownDurationSec, stale.activeSec, stale.ownRecorded], [120, 120, true]);
  // …also with an earlier sitting in front of it.
  const two = { startedAt: at(0), duration: 2269, attemptSpans: REAL };
  const stale2 = planAttemptSave({ existing: two, attemptStartMs: T0 + 1_761_300, attemptDurationSec: 485 });
  assert.deepStrictEqual([stale2.ownDurationSec, stale2.priorActiveSec, stale2.activeSec], [515, 1754, 2269]);
});

check('seed is bounded by the wall time before this mount: it can never contain this mount\'s own seconds', () => {
  // A stored duration larger than the gap between the session start and this
  // mount's start cannot all be earlier sittings — capped at the gap.
  const p = planAttemptSave({ existing: { startedAt: at(0), duration: 5000 }, attemptStartMs: T0 + 1_761_300, attemptDurationSec: 30 });
  assert.deepStrictEqual(core(p), { seed: { startedAtMs: T0, durationSec: 1761.3 }, priorActiveSec: 1761.3, activeSec: 1791.3 });
});

// --- The route's ONE atomic write, replayed against an in-memory document ---
// A tiny interpreter for exactly the operators buildAttemptSpanWrite emits
// (the filter guard, $max, $set, $push/$each), so the save sequences below
// exercise the real plan + the real write description, not a re-implementation.
type Doc = { startedAt: Date; duration?: number; attemptSpans?: Array<{ startedAt: Date; duration: number; endedAt?: Date }> };
const clone = (d: Doc | null): Doc | null => (d ? { ...d, attemptSpans: d.attemptSpans?.map((s) => ({ ...s })) } : null);
type Save = { startSec: number; dur: number; ended?: boolean };
/** Read → plan → write description (what one POST computes before writing). */
function prepare(read: Doc | null, s: Save) {
  const startMs = T0 + s.startSec * 1000;
  const plan = planAttemptSave({ existing: read, attemptStartMs: startMs, attemptDurationSec: s.dur });
  const write = buildAttemptSpanWrite({ plan, attemptStartMs: startMs, endedAtMs: s.ended ? startMs + s.dur * 1000 : null, docExists: !!read });
  assert.ok(write, 'a save with a duration always describes a span write');
  return { plan, write: write!, startMs };
}
/** Applies the write to the CURRENT document. false = the filter matched nothing (route re-reads and re-plans). */
function apply(db: { doc: Doc | null }, w: ReturnType<typeof prepare>['write'], startSec: number): boolean {
  let doc = db.doc;
  let idx = -1;
  for (const [k, v] of Object.entries(w.filter)) {
    const m = /^attemptSpans\.(\d+)$/.exec(k);
    if (m) {
      assert.deepStrictEqual(v, { $exists: false });
      if ((doc?.attemptSpans?.length ?? 0) > Number(m[1])) doc = null; // guard failed
    } else if (k === 'attemptSpans.startedAt') {
      idx = doc?.attemptSpans?.findIndex((s) => s.startedAt.getTime() === (v as Date).getTime()) ?? -1;
      if (idx < 0) doc = null;
    } else assert.fail(`unexpected filter key ${k}`);
  }
  if (!doc) {
    if (db.doc || !w.upsert) return false; // existing doc that did not match (unique sessionId ⇒ no second doc)
    doc = { startedAt: at(startSec) };
  }
  for (const [k, v] of Object.entries(w.max)) {
    if (k === 'duration') doc.duration = Math.max(doc.duration ?? -Infinity, v);
    else if (k === 'attemptSpans.$.duration') doc.attemptSpans![idx].duration = Math.max(doc.attemptSpans![idx].duration, v);
    else assert.fail(`unexpected $max key ${k}`);
  }
  for (const [k, v] of Object.entries(w.set)) {
    if (k === 'attemptSpans.$.endedAt') doc.attemptSpans![idx].endedAt = v as Date;
    else assert.fail(`unexpected $set key ${k}`);
  }
  if (w.push) doc.attemptSpans = [...(doc.attemptSpans ?? []), ...w.push.attemptSpans.$each.map((s) => ({ ...s }))];
  db.doc = doc;
  return true;
}
/** One whole POST: read, plan, write; on a guard miss re-read and re-plan (as the route does). */
function save(db: { doc: Doc | null }, s: Save) {
  for (let i = 0; i < 3; i++) {
    const p = prepare(clone(db.doc), s);
    if (apply(db, p.write, s.startSec)) return p.plan;
  }
  throw new Error('save did not converge');
}
const spansOf = (db: { doc: Doc | null }) => (db.doc?.attemptSpans ?? []).map((s) => [(s.startedAt.getTime() - T0) / 1000, s.duration]);

console.log('\nsave sequences (seed + span + duration land in ONE guarded write)');

check('the write is one operation: seed, this mount\'s span and `duration` travel together', () => {
  const { write } = prepare({ startedAt: at(0), duration: 1754 }, { startSec: 1761.3, dur: 30 });
  assert.deepStrictEqual(write, {
    filter: { 'attemptSpans.0': { $exists: false } },
    set: {},
    max: { duration: 1784 },
    push: { attemptSpans: { $each: [{ startedAt: at(0), duration: 1754 }, { startedAt: at(1761.3), duration: 30 }] } },
    upsert: false,
  });
  // Once the span is recorded: positional update, guarded on the span being there.
  const later = prepare({ startedAt: at(0), duration: 1784, attemptSpans: [{ startedAt: at(0), duration: 1754 }, { startedAt: at(1761.3), duration: 30 }] }, { startSec: 1761.3, dur: 60, ended: true });
  assert.deepStrictEqual(later.write, {
    filter: { 'attemptSpans.startedAt': at(1761.3) },
    set: { 'attemptSpans.$.endedAt': at(1821.3) },
    max: { 'attemptSpans.$.duration': 60, duration: 1814 },
    push: null,
    upsert: false,
  });
  // Brand-new session: the only case that may insert.
  const first = prepare(null, { startSec: 0, dur: 30 });
  assert.deepStrictEqual([first.write.upsert, first.write.filter], [true, { 'attemptSpans.0': { $exists: false } }]);
  // No duration on the save (checkpoint) → no span write at all.
  const cp = planAttemptSave({ existing: null, attemptStartMs: T0, attemptDurationSec: null });
  assert.strictEqual(buildAttemptSpanWrite({ plan: cp, attemptStartMs: T0, endedAtMs: null, docExists: false }), null);
});

check('pre-spans doc, repeated saves of the same mount: grows only by the mount\'s own duration', () => {
  const db = { doc: { startedAt: at(0), duration: 1754 } as Doc | null };
  const seen: Array<number | undefined> = [];
  for (const dur of [30, 60, 60, 60, 90]) { save(db, { startSec: 1761.3, dur }); seen.push(db.doc!.duration); }
  assert.deepStrictEqual(seen, [1784, 1814, 1814, 1814, 1844]);
  assert.deepStrictEqual(spansOf(db), [[0, 1754], [1761.3, 90]]);
  assert.strictEqual(sessionActiveSeconds(db.doc), 1844);
});

check('write failed, then retried: nothing half-landed, so the retry seeds from the ORIGINAL duration', () => {
  const db = { doc: { startedAt: at(0), duration: 1754 } as Doc | null };
  // Save 1: the update throws → the document is untouched (single write: no
  // cumulative `duration` without its spans can exist).
  prepare(clone(db.doc), { startSec: 1761.3, dur: 30 });
  assert.deepStrictEqual(db.doc, { startedAt: at(0), duration: 1754 });
  // Saves 2, 3 (30 s apart) succeed.
  save(db, { startSec: 1761.3, dur: 60 });
  assert.strictEqual(db.doc!.duration, 1814);
  save(db, { startSec: 1761.3, dur: 90 });
  assert.strictEqual(db.doc!.duration, 1844);
  assert.deepStrictEqual(spansOf(db), [[0, 1754], [1761.3, 90]]);
});

check('even a doc that somehow holds a cumulative duration and no spans cannot snowball (seed capped at the gap)', () => {
  // The state the old two-step write could leave behind: duration = D + own, no spans.
  let stored = 1784;
  for (const dur of [60, 90, 120, 150]) {
    const p = planAttemptSave({ existing: { startedAt: at(0), duration: stored }, attemptStartMs: T0 + 1_761_300, attemptDurationSec: dur });
    assert.ok(p.activeSec! <= 1761.3 + dur, `bounded by wall time (${p.activeSec})`);
    stored = p.activeSec!; // worst case: duration lands again without spans
  }
  assert.strictEqual(stored, 1761.3 + 150);
});

check('two concurrent saves of the same mount on a pre-spans doc: seeded once, own counted once', () => {
  const db = { doc: { startedAt: at(0), duration: 1754 } as Doc | null };
  const snapshot = clone(db.doc);
  const x = prepare(snapshot, { startSec: 1761.3, dur: 30 });
  const y = prepare(snapshot, { startSec: 1761.3, dur: 30 }); // read before X's write
  assert.strictEqual(apply(db, x.write, 1761.3), true);
  assert.strictEqual(apply(db, y.write, 1761.3), false, 'Y\'s stale plan must not land');
  save(db, { startSec: 1761.3, dur: 30 }); // Y re-reads and re-plans
  assert.strictEqual(db.doc!.duration, 1784);
  assert.deepStrictEqual(spansOf(db), [[0, 1754], [1761.3, 30]]);
});

check('two concurrent FIRST saves of a brand-new session: one span, not two', () => {
  const db = { doc: null as Doc | null };
  const x = prepare(null, { startSec: 0, dur: 30 });
  const y = prepare(null, { startSec: 0, dur: 30 });
  assert.strictEqual(apply(db, x.write, 0), true);
  assert.strictEqual(apply(db, y.write, 0), false);
  save(db, { startSec: 0, dur: 30 });
  assert.deepStrictEqual([db.doc!.duration, spansOf(db)], [30, [[0, 30]]]);
});

check('two interleaved mounts on a pre-spans doc (stale reads both ways): one seed, union stored', () => {
  const db = { doc: { startedAt: at(0), duration: 1000 } as Doc | null };
  // Tabs A (+2000 s) and B (+2060 s) both read the doc before either wrote.
  const snapshot = clone(db.doc);
  const a = prepare(snapshot, { startSec: 2000, dur: 90 });
  const b = prepare(snapshot, { startSec: 2060, dur: 30 });
  assert.strictEqual(apply(db, a.write, 2000), true);
  assert.strictEqual(apply(db, b.write, 2060), false, 'B planned without A\'s span — must re-read');
  const bPlan = save(db, { startSec: 2060, dur: 30 });
  assert.deepStrictEqual(core(bPlan), { seed: null, priorActiveSec: 1060, activeSec: 1090 });
  assert.deepStrictEqual(spansOf(db), [[0, 1000], [2000, 90], [2060, 30]]);
  // They keep saving every 30 s, interleaved, B once out of order.
  save(db, { startSec: 2000, dur: 120 });
  save(db, { startSec: 2060, dur: 60 });
  save(db, { startSec: 2060, dur: 90 });
  save(db, { startSec: 2060, dur: 60 }); // late arrival of an older save
  save(db, { startSec: 2000, dur: 150 });
  assert.deepStrictEqual(spansOf(db), [[0, 1000], [2000, 150], [2060, 90]]);
  // 1000 (seed) + wall 2000…2150 covered by A and/or B = 150.
  assert.strictEqual(db.doc!.duration, 1150);
  assert.strictEqual(sessionActiveSeconds(db.doc), 1150);
});

check('two RECORDED mounts saving at the same moment: `$max` keeps a stale total; durationBehindSpans repairs it (real-MongoDB finding)', () => {
  const db = { doc: null as Doc | null };
  save(db, { startSec: 0, dur: 100 });
  save(db, { startSec: 1000, dur: 50 });
  assert.strictEqual(db.doc!.duration, 150);
  assert.strictEqual(durationBehindSpans(db.doc), null, 'in step: nothing to repair');
  // Both read the same snapshot, then both write (neither guard can miss:
  // each matches its own recorded span).
  const snapshot = clone(db.doc);
  const a = prepare(snapshot, { startSec: 0, dur: 130 });
  const b = prepare(snapshot, { startSec: 1000, dur: 70 });
  assert.strictEqual(apply(db, a.write, 0), true);
  const afterA = clone(db.doc);
  assert.strictEqual(apply(db, b.write, 1000), true);
  assert.deepStrictEqual(spansOf(db), [[0, 130], [1000, 70]]);
  assert.strictEqual(db.doc!.duration, 180, 'max(130 + 50, 100 + 70): both totals were built on the other mount\'s old figure');
  // The route reconciles from the document each write returned. The LAST
  // writer's post-image holds every span → the true union, whatever order
  // the two reconciles land in ($max).
  assert.strictEqual(durationBehindSpans(afterA), null, 'A\'s post-image: 180 stored, spans 130 + 50');
  assert.strictEqual(durationBehindSpans(db.doc), 200);
  // …and the response is planned from the post-image too.
  const fresh = planAttemptSave({ existing: db.doc, attemptStartMs: T0 + 1_000_000, attemptDurationSec: 70 });
  assert.deepStrictEqual([fresh.priorActiveSec, fresh.activeSec, fresh.ownRecorded], [130, 200, true]);
});

check('durationBehindSpans only ever raises, and never invents a figure', () => {
  assert.strictEqual(durationBehindSpans(null), null);
  assert.strictEqual(durationBehindSpans({ duration: 500 }), null, 'no spans → nothing to compare');
  assert.strictEqual(durationBehindSpans({ duration: 500, attemptSpans: [] }), null);
  assert.strictEqual(durationBehindSpans({ duration: 500, attemptSpans: [{ startedAt: at(0), duration: 200 }, { startedAt: at(200), duration: 60 }] }), null, 'stored above the union (capped seed): left alone');
  assert.strictEqual(durationBehindSpans({ duration: 260, attemptSpans: [{ startedAt: at(0), duration: 200 }, { startedAt: at(200), duration: 60 }] }), null);
  assert.strictEqual(durationBehindSpans({ attemptSpans: [{ startedAt: at(0), duration: 30 }] }), 30, 'spans but no duration');
  assert.strictEqual(durationBehindSpans({ duration: 100, attemptSpans: [{ startedAt: at(0), duration: 100 }, { startedAt: at(40), duration: 100 }] }), 140, 'overlap: union, not sum');
});

check('the two-tab session end to end: stored duration ≈ 30 min; each tab\'s ended figure ≤ the union', () => {
  const db = { doc: null as Doc | null };
  let priorA = 0, priorB = 0;
  for (let t = 30; t <= 1800; t += 30) {
    priorA = save(db, { startSec: 0, dur: t }).priorActiveSec;
    if (t > 60) priorB = save(db, { startSec: 60, dur: t - 60 }).priorActiveSec;
  }
  assert.strictEqual(db.doc!.duration, 1800);
  assert.strictEqual(endedDurationSeconds(1800, priorA), 1800);
  assert.strictEqual(endedDurationSeconds(1740, priorB), 1800);
});

check('`duration` never decreases across saves of one mount', () => {
  const db = { doc: null as Doc | null };
  const seen: number[] = [];
  for (const dur of [30, 90, 60, 120, 90]) { save(db, { startSec: 0, dur }); seen.push(db.doc!.duration!); }
  assert.deepStrictEqual(seen, [30, 90, 90, 120, 120]);
  assert.deepStrictEqual(spansOf(db), [[0, 120]]);
});

console.log('\nembed client (evelyn:session_ended duration)');

check('ended duration = this mount + last known prior total, whole seconds', () => {
  assert.strictEqual(endedDurationSeconds(515, 1754), 2269);
  assert.strictEqual(endedDurationSeconds(515.4, 0), 515);
  // Prior total never arrived (request failed): this mount only, as before.
  assert.strictEqual(endedDurationSeconds(515, null), 515);
  assert.strictEqual(endedDurationSeconds(515, NaN), 515);
  assert.strictEqual(endedDurationSeconds(515, -20), 515);
});

check('server field is read defensively', () => {
  assert.strictEqual(readActiveSecondsField(1754), 1754);
  assert.strictEqual(readActiveSecondsField(0), 0);
  for (const bad of [undefined, null, '1754', NaN, -1, Infinity, {}]) assert.strictEqual(readActiveSecondsField(bad), null);
});

console.log('\nreaders when `duration` is cumulative');

check('resolveSessionSpan: still resumed, wall end from the spans, with duration = 2269', () => {
  const s = resolveSessionSpan({ startedAtMs: T0, durationSec: 2269, attemptSpans: REAL, itemOffsetsMs: [0, 1_700_000, 2_270_000] });
  assert.deepStrictEqual(s, { resumed: true, attemptCount: 2, wallSpanSec: 2276.3, activeSec: 2269, source: 'attempt-spans' });
  // Identical to the answer with the old last-attempt-only value.
  assert.deepStrictEqual(resolveSessionSpan({ startedAtMs: T0, durationSec: 515, attemptSpans: REAL, itemOffsetsMs: [0, 1_700_000, 2_270_000] }), s);
});

check('resolveSessionSpan: duplicate span entries do not inflate the active span or the attempt count', () => {
  const s = resolveSessionSpan({ startedAtMs: T0, durationSec: 2269, attemptSpans: [...REAL, REAL[1]] });
  assert.deepStrictEqual([s.resumed, s.attemptCount, s.activeSec], [true, 2, 2269]);
});

check('resolveSessionSpan: a long pause is not hidden by a cumulative duration (no inference from duration alone)', () => {
  // 10 min + 10 min with a 3 h pause; cumulative duration 1200 s. Items of
  // the second sitting sit hours past 1200 s — still resolved from the spans.
  const spans = [{ startedAt: at(0), duration: 600 }, { startedAt: at(11_400), duration: 600 }];
  const s = resolveSessionSpan({ startedAtMs: T0, durationSec: 1200, attemptSpans: spans, itemOffsetsMs: [0, 590_000, 11_990_000] });
  assert.deepStrictEqual(s, { resumed: true, attemptCount: 2, wallSpanSec: 12_000, activeSec: 1200, source: 'attempt-spans' });
});

check('resolveSessionSpan: single recorded attempt is not called resumed', () => {
  const s = resolveSessionSpan({ startedAtMs: T0, durationSec: 842, attemptSpans: [{ startedAt: at(0), duration: 842 }], itemOffsetsMs: [0, 800_000] });
  assert.deepStrictEqual(s, { resumed: false, attemptCount: 1, wallSpanSec: 842, activeSec: 842, source: 'attempt-spans' });
});

console.log('\npartner summary durationSec');

check('one-message fallback uses the cumulative figure', () => {
  const one = [{ role: 'tutor', timestamp: iso(5) }];
  // Spans on the doc but `duration` still last-attempt-only (written before this fix).
  assert.strictEqual(summarizeTutorSession({ sessionId: 'a', status: 'completed', startedAt: at(0), duration: 515, attemptSpans: REAL, transcript: one }).durationSec, 2269);
  // New writes: duration already cumulative, with or without the spans projected.
  assert.strictEqual(summarizeTutorSession({ sessionId: 'a', status: 'completed', startedAt: at(0), duration: 2269, transcript: one }).durationSec, 2269);
  // Legacy doc: stored duration.
  assert.strictEqual(summarizeTutorSession({ sessionId: 'a', status: 'completed', startedAt: at(0), duration: 515, transcript: one }).durationSec, 515);
});

check('≥2 messages: transcript active seconds, unchanged (every sitting counts; the pause counts up to the 10-minute cap)', () => {
  const t = [{ role: 'tutor', timestamp: iso(0) }, { role: 'student', timestamp: iso(1700) }, { role: 'tutor', timestamp: iso(1700 + 7200) }, { role: 'student', timestamp: iso(1700 + 7200 + 500) }];
  const s = summarizeTutorSession({ sessionId: 'a', status: 'completed', startedAt: at(0), duration: 2269, attemptSpans: REAL, transcript: t });
  assert.strictEqual(s.durationSec, 600 + 600 + 500);
});

check('no transcript: still no durationSec at all', () => {
  assert.ok(!('durationSec' in summarizeTutorSession({ sessionId: 'a', status: 'abandoned', startedAt: at(0), duration: 2269, attemptSpans: REAL, transcript: [] })));
});

console.log(`\n${passed} passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
