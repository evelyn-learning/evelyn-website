// Pure tests for the timed release: the window, the release time and the sample. No database, no network.
// Run: npx tsx src/lib/keystone/pipeline/release.test.ts
import assert from "node:assert/strict";
import { addLocalDays, inWindow, mountain, offsetMinutes, pickSample, releaseAt, requiredSample, sampleNeed, sampleOrder } from "./release";

/** assert.ok with a message always (see run.test.ts). */
const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

const Z = (s: string) => new Date(s);
const iso = (d: Date) => d.toISOString();
const MIN = 60_000;

/** Local wall time in America/Edmonton, "Mon 2026-11-16 10:00". */
const local = (d: Date) => mountain(d);

// --- inWindow: Mon–Fri [08:00, 17:00) America/Edmonton ---
// 2026-11-16 is a Monday; MST is UTC-7.
equal(inWindow(Z("2026-11-16T15:00:00Z")), true, "Mon 08:00 MST is inside");
equal(inWindow(Z("2026-11-16T14:59:59Z")), false, "Mon 07:59:59 is outside");
equal(inWindow(Z("2026-11-16T23:59:00Z")), true, "Mon 16:59 is inside");
equal(inWindow(Z("2026-11-17T00:00:00Z")), false, "Mon 17:00 is outside (window is [08:00, 17:00))");
equal(inWindow(Z("2026-11-21T17:00:00Z")), false, "Sat 10:00 is outside");
equal(inWindow(Z("2026-11-22T17:00:00Z")), false, "Sun 10:00 is outside");
// Summer (MDT, UTC-6): 08:00 local = 14:00Z.
equal(inWindow(Z("2026-07-08T14:00:00Z")), true, "Wed 08:00 MDT is inside");
equal(inWindow(Z("2026-07-08T13:59:00Z")), false, "Wed 07:59 MDT is outside");
equal(local(Z("2026-11-16T17:00:00Z")), "Mon 2026-11-16 10:00", "the local formatter reads Mountain time");

// --- releaseAt (no item id: offset 0, exact times) ---
// received Mon 10:00 MT, passed Mon 12:00 → Wed 10:00 MT, not before
{
  const r = releaseAt(Z("2026-11-16T17:00:00Z"), Z("2026-11-16T19:00:00Z"), false);
  equal(iso(r), "2026-11-18T17:00:00.000Z", `received Mon 10:00, passed Mon 12:00 → Wed 10:00 MT (got ${local(r)})`);
  // with an item id: Wed 10:00 plus 0–90 minutes
  const withId = releaseAt(Z("2026-11-16T17:00:00Z"), Z("2026-11-16T19:00:00Z"), false, "item-1");
  ok(withId.getTime() >= r.getTime() && withId.getTime() <= r.getTime() + 90 * MIN, `per-item offset within 0–90 min (${local(withId)})`);
  equal(withId.getTime() - r.getTime(), offsetMinutes("item-1") * MIN, "the offset is the item's");
}
// received Thu 16:00 MT → Sat 16:00 → moved to Mon 08:00 (weekend skipped)
{
  const r = releaseAt(Z("2026-11-19T23:00:00Z"), Z("2026-11-19T23:30:00Z"), false);
  equal(local(r), "Mon 2026-11-23 08:00", `received Thu 16:00 → Mon 08:00 (got ${local(r)})`);
  ok(inWindow(r), "inside the window");
}
// run late: received 5 days ago, passed today (Mon) 16:30 → 30 min Mon + 3.5 h Tue → Tue 11:30
{
  const r = releaseAt(Z("2026-11-11T17:00:00Z"), Z("2026-11-16T23:30:00Z"), false);
  equal(local(r), "Tue 2026-11-17 11:30", `passed Mon 16:30 → 4 working hours → Tue 11:30 (got ${local(r)})`);
}
// corrected → 1 day
{
  const r = releaseAt(Z("2026-11-16T17:00:00Z"), Z("2026-11-16T17:30:00Z"), true);
  equal(local(r), "Tue 2026-11-17 10:00", `corrected: received Mon 10:00 → Tue 10:00 (got ${local(r)})`);
  const plain = releaseAt(Z("2026-11-16T17:00:00Z"), Z("2026-11-16T17:30:00Z"), false);
  equal(local(plain), "Wed 2026-11-18 10:00", "not corrected: 2 days");
}
// received Friday 16:59 → Sun 16:59 → Mon 08:00; passed at once → 30 s Fri + 3 h 59 m 30 s Mon is later
{
  const r = releaseAt(Z("2026-11-20T23:59:00Z"), Z("2026-11-20T23:59:30Z"), false);
  equal(iso(r), "2026-11-23T18:59:30.000Z", `received and passed Fri 16:59 → Mon 11:59:30 (got ${local(r)})`);
  const early = releaseAt(Z("2026-11-20T23:59:00Z"), Z("2026-11-20T16:00:00Z"), false);
  equal(local(early), "Mon 2026-11-23 08:00", `received Fri 16:59 → Mon 08:00 (got ${local(early)})`);
}
// passedAt on a Saturday: the 4 working hours start Monday 08:00
{
  const r = releaseAt(Z("2026-11-02T17:00:00Z"), Z("2026-11-21T19:00:00Z"), false);
  equal(local(r), "Mon 2026-11-23 12:00", `passed Sat 12:00 → Mon 12:00 (got ${local(r)})`);
}
// exactly 17:00 is outside: received Mon 17:00 → Wed 17:00 → Thu 08:00
{
  const r = releaseAt(Z("2026-11-17T00:00:00Z"), Z("2026-11-16T17:00:00Z"), false);
  equal(local(r), "Thu 2026-11-19 08:00", `Wed 17:00 is outside → Thu 08:00 (got ${local(r)})`);
}
// 4 working hours that end exactly at 17:00 also move to the next morning
{
  const r = releaseAt(Z("2026-11-01T17:00:00Z"), Z("2026-11-16T20:00:00Z"), false);
  equal(local(r), "Tue 2026-11-17 08:00", `passed Mon 13:00 + 4 h = 17:00 → Tue 08:00 (got ${local(r)})`);
}

// --- offsets ---
{
  for (const id of ["a", "b", "991401", "x".repeat(40)]) {
    const o = offsetMinutes(id);
    ok(Number.isInteger(o) && o >= 0 && o <= 90, `offset of ${id} in 0–90 (${o})`);
    equal(offsetMinutes(id), o, `offset of ${id} is deterministic`);
  }
  const spread = new Set(Array.from({ length: 200 }, (_, i) => offsetMinutes(`item-${i}`)));
  ok(spread.size > 40, `offsets spread out (${spread.size} distinct of 200)`);
  const findId = (pred: (o: number) => boolean) => {
    for (let i = 0; i < 10_000; i++) if (pred(offsetMinutes(`id-${i}`))) return `id-${i}`;
    throw new Error("no id found");
  };
  // carry over 17:00: base Wed 16:30, offset k ≥ 60 → Thu 08:00 + (k − 30)
  const big = findId((o) => o >= 60);
  const k = offsetMinutes(big);
  const r = releaseAt(Z("2026-11-16T23:30:00Z"), Z("2026-11-16T16:00:00Z"), false, big);
  const thu8 = Z("2026-11-19T15:00:00Z").getTime();
  equal(r.getTime(), thu8 + (k - 30) * MIN, `offset ${k} from Wed 16:30 carries into Thu (got ${local(r)})`);
  ok(inWindow(r), "carried release is inside the window");
  // carry over a Friday 17:00 lands Monday
  const rf = releaseAt(Z("2026-11-18T23:30:00Z"), Z("2026-11-18T16:00:00Z"), false, big);
  equal(rf.getTime(), Z("2026-11-23T15:00:00Z").getTime() + (k - 30) * MIN, `Fri 16:30 + ${k} min carries into Mon (got ${local(rf)})`);
  // an offset that lands exactly on 17:00 is moved to the next morning
  const sixty = findId((o) => o === 60);
  const r60 = releaseAt(Z("2026-11-16T23:00:00Z"), Z("2026-11-16T16:00:00Z"), false, sixty);
  equal(local(r60), "Thu 2026-11-19 08:00", `Wed 16:00 + 60 min = 17:00 → Thu 08:00 (got ${local(r60)})`);
}

// --- clock changes ---
// March 2027: clocks go forward Sun 2027-03-14. Received Fri 03-12 10:00 MST (17:00Z) → Sun 10:00 MDT → Mon 08:00 MDT = 14:00Z.
{
  const r = releaseAt(Z("2027-03-12T17:00:00Z"), Z("2027-03-12T18:00:00Z"), false);
  equal(iso(r), "2027-03-15T14:00:00.000Z", `March: Mon 08:00 MDT is 14:00Z (got ${iso(r)} = ${local(r)})`);
  // received Sun 01:30 MST (before the change at 02:00) → Tue 01:30 MDT → Tue 08:00 MDT
  const t = releaseAt(Z("2027-03-14T08:30:00Z"), Z("2027-03-14T09:00:00Z"), false);
  equal(local(t), "Tue 2027-03-16 08:00", `March: received Sun 01:30 → Tue 08:00 (got ${local(t)})`);
  equal(iso(t), "2027-03-16T14:00:00.000Z", "Tue 08:00 MDT is 14:00Z");
  // received Mon 03-15 10:00 MDT → Wed 10:00 MDT = 16:00Z (same wall time, two calendar days)
  const w = releaseAt(Z("2027-03-15T16:00:00Z"), Z("2027-03-15T17:00:00Z"), false);
  equal(iso(w), "2027-03-17T16:00:00.000Z", "after the change: Wed 10:00 MDT");
  // received Fri 03-12 10:00 MST, "+2 days" across the change is the same local wall time (not +48 h)
  const thu = releaseAt(Z("2027-03-11T17:00:00Z"), Z("2027-03-11T17:30:00Z"), false);
  equal(local(thu), "Mon 2027-03-15 08:00", "Thu 10:00 → Sat → Mon 08:00");
}
// November 2026: clocks go back Sun 2026-11-01. Received Fri 10-30 10:00 MDT (16:00Z) → Sun 10:00 MST → Mon 08:00 MST = 15:00Z.
{
  const r = releaseAt(Z("2026-10-30T16:00:00Z"), Z("2026-10-30T17:00:00Z"), false);
  equal(iso(r), "2026-11-02T15:00:00.000Z", `November: Mon 08:00 MST is 15:00Z (got ${iso(r)} = ${local(r)})`);
  // "+2 days" is the same wall time two calendar days later: Sat 10-31 10:00 MDT → Mon 11-02 10:00 MST = 17:00Z (+48 h would give 16:00Z)
  equal(iso(addLocalDays(Z("2026-10-31T16:00:00Z"), 2)), "2026-11-02T17:00:00.000Z", "November: Sat 10:00 MDT + 2 days = Mon 10:00 MST");
  // March: Sat 2027-03-13 10:00 MST → Mon 03-15 10:00 MDT = 16:00Z (+48 h would give 17:00Z)
  equal(iso(addLocalDays(Z("2027-03-13T17:00:00Z"), 2)), "2027-03-15T16:00:00.000Z", "March: Sat 10:00 MST + 2 days = Mon 10:00 MDT");
  // received Sat 10-31 10:00 MDT, passed Sat → the 4 working hours (Mon 12:00 MST) are later than Mon 10:00
  const m = releaseAt(Z("2026-10-31T16:00:00Z"), Z("2026-10-31T16:30:00Z"), false);
  equal(local(m), "Mon 2026-11-02 12:00", `November: Mon 12:00 MST (got ${local(m)})`);
  // received Sun 11-01 15:00 MST → Tue 15:00
  const t = releaseAt(Z("2026-11-01T22:00:00Z"), Z("2026-11-01T22:30:00Z"), false);
  equal(local(t), "Tue 2026-11-03 15:00", "November: Tue 15:00");
  // working hours across the change: passed Fri 10-30 15:00 MDT → 2 h Fri + 2 h Mon → Mon 10:00 MST
  const wh = releaseAt(Z("2026-10-01T16:00:00Z"), Z("2026-10-30T21:00:00Z"), false);
  equal(local(wh), "Mon 2026-11-02 10:00", `working hours carry across the change (got ${local(wh)})`);
}
// A release time is never outside the window, for many arrival times through both changes.
{
  let start = Z("2026-10-25T00:00:00Z").getTime();
  for (let i = 0; i < 24 * 20; i++) {
    const rec = new Date(start + i * 37 * MIN);
    const r = releaseAt(rec, new Date(rec.getTime() + 13 * MIN), i % 3 === 0, `id-${i}`);
    ok(inWindow(r), `release ${local(r)} for arrival ${local(rec)} is inside the window`);
    ok(r.getTime() >= rec.getTime() + (i % 3 === 0 ? 20 : 44) * 60 * MIN, `release ${local(r)} is at least a day after ${local(rec)}`);
  }
  start = Z("2027-03-07T00:00:00Z").getTime();
  for (let i = 0; i < 24 * 20; i++) {
    const rec = new Date(start + i * 37 * MIN);
    const r = releaseAt(rec, rec, false, `m-${i}`);
    ok(inWindow(r), `March: release ${local(r)} for arrival ${local(rec)} is inside the window`);
  }
}

// --- pickSample: ceil(10%), at least 3, at most all; deterministic per seed; order-independent ---
{
  const ids = (n: number) => Array.from({ length: n }, (_, i) => `q${String(i).padStart(3, "0")}`);
  deepEqual(pickSample([], "b"), [], "0 ids → none");
  equal(pickSample(ids(1), "b").length, 1, "1 → 1");
  equal(pickSample(ids(2), "b").length, 2, "2 → 2");
  equal(pickSample(ids(3), "b").length, 3, "3 → 3");
  equal(pickSample(ids(12), "b").length, 3, "12 → 3");
  equal(pickSample(ids(30), "b").length, 3, "30 → 3");
  equal(pickSample(ids(31), "b").length, 4, "31 → 4");
  equal(pickSample(ids(100), "b").length, 10, "100 → 10");
  deepEqual(pickSample(ids(100), "batch-x"), pickSample(ids(100), "batch-x"), "same seed → same ids");
  deepEqual(pickSample([...ids(100)].reverse(), "batch-x"), pickSample(ids(100), "batch-x"), "stable under input order");
  ok(pickSample(ids(100), "batch-x").join() !== pickSample(ids(100), "batch-y").join(), "another seed picks others");
  const s = pickSample(ids(100), "batch-x");
  ok(s.every((id) => ids(100).includes(id)) && new Set(s).size === s.length, "picks distinct ids of the batch");
  equal(pickSample(["a", "a", "b"], "z").length, 2, "duplicates count once");
}

// --- the sample invariant, n = 0…120 ---
{
  for (let n = 0; n <= 120; n++) {
    const want = n === 0 ? 0 : Math.min(n, Math.max(3, Math.ceil(n / 10)));
    equal(requiredSample(n), want, `requiredSample(${n})`);
    ok(requiredSample(n) <= n, `never more than all (${n})`);
    ok(n === 0 || requiredSample(n) >= Math.min(3, n), `at least 3 or all (${n})`);
    ok(requiredSample(n) * 10 >= n, `at least 10% (${n})`);
    if (n > 0) ok(requiredSample(n) >= requiredSample(n - 1), `monotonic in n (${n})`);
    // every way of splitting n into clean / held / released: the top-up brings h to the requirement exactly
    for (const sampled of [0, 1, 3, 5]) {
      for (const timerReleased of [0, 7, 30]) {
        const cleanCount = n - sampled - timerReleased;
        if (cleanCount < 0) continue;
        const clean = Array.from({ length: cleanCount }, (_, i) => `c${i}`);
        const need = sampleNeed({ clean, sampled, timerReleased }, "b");
        equal(need.n, n, `n counts clean + sampled + released (${n})`);
        const after = sampled + need.topUp.length;
        ok(after >= Math.min(need.required, sampled + cleanCount), `top-up reaches the requirement when there are enough clean items (n ${n}, h ${sampled}, r ${timerReleased})`);
        ok(need.topUp.length === Math.min(cleanCount, Math.max(0, need.required - sampled)), `holds no more than needed (n ${n}, h ${sampled})`);
        deepEqual(need.topUp, sampleOrder(clean, "b").slice(0, need.topUp.length), "top-up follows the sample order");
      }
    }
  }
  // the brief's late arrivals: 9 processed (3 held, 6 released) + 1 → n 10, still 3: nothing more held
  equal(sampleNeed({ clean: ["late"], sampled: 3, timerReleased: 6 }, "b").topUp.length, 0, "batch of 9 + 1 late: released");
  // 30 processed (3 held, 27 released) + 1 → n 31 → 4 required: the late arrival is held
  deepEqual(sampleNeed({ clean: ["late"], sampled: 3, timerReleased: 27 }, "b").topUp, ["late"], "batch of 30 + 1 late: the arrival is held");
  // all at item_data when first looked at: nothing to sample; when 10 return clean: 3 held
  equal(sampleNeed({ clean: [], sampled: 0, timerReleased: 0 }, "b").required, 0, "nothing eligible yet: nothing required");
  equal(sampleNeed({ clean: Array.from({ length: 10 }, (_, i) => `r${i}`), sampled: 0, timerReleased: 0 }, "b").topUp.length, 3, "10 return clean: 3 held");
  deepEqual(sampleOrder(["a", "b", "c"], "s"), sampleOrder(["c", "a", "b"], "s"), "sample order independent of input order");
}

console.log("release.test ok");
