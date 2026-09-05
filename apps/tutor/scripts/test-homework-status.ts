import { computeHomeworkStatus, describeHomework } from '../src/lib/tutor/practice-assign/status';
import type { IPracticeAssignment } from '../src/models';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const t0 = new Date('2026-09-03T10:00:00Z');
const item = (id: string) => ({ id, source: 'bank' as const, problemText: id });
const a: IPracticeAssignment = {
  _id: 'as1', studentId: 's', sessionId: 'sess1', auto: false, assignedAt: t0, createdAt: t0, locator: 'Unit 2 · Practice',
  los: [{ loId: 'lo1', title: 'Fractions', reason: 'r', items: [item('i1'), item('i2'), item('i3'), item('i4')] }],
};
const row = (itemId: string, outcome: number, mins: number) => ({ itemId, outcome, occurredAt: new Date(t0.getTime() + mins * 60_000) });

{ const h = computeHomeworkStatus(a, []); check('no rows → untouched', h.overall === 'untouched' && h.los[0].status === 'untouched' && h.los[0].total === 4); }
{ const h = computeHomeworkStatus(a, [row('i1', 1, 5), row('i2', 0, 6)]); check('2 of 4 → partial, correct 1', h.los[0].status === 'partial' && h.los[0].attempted === 2 && h.los[0].correct === 1 && h.overall === 'partial'); }
{ const h = computeHomeworkStatus(a, [row('i1', 1, 5), row('i2', 1, 6), row('i3', 1, 7), row('i4', 0, 8)]); check('all attempted → done', h.los[0].status === 'done' && h.overall === 'done'); check('lastAttemptAt is the latest row', h.los[0].lastAttemptAt === new Date(t0.getTime() + 8 * 60_000).toISOString()); }
{ const h = computeHomeworkStatus(a, [row('i1', 0, 5), row('i2', 0, 6), row('i3', 1, 7), row('i4', 0, 8)]); check('done but <50% correct → overall weak', h.overall === 'weak'); }
{ const h = computeHomeworkStatus(a, [row('i1', 1, -5)]); check('rows BEFORE assignedAt are ignored', h.overall === 'untouched'); }
{ const h = computeHomeworkStatus(a, [row('i1', 1, 5), row('i1', 0, 9)]); check('same item twice counts once, latest outcome wins', h.los[0].attempted === 1 && h.los[0].correct === 0); }
{ const h = computeHomeworkStatus(a, [row('zzz', 1, 5)]); check('unrelated item ignored', h.overall === 'untouched'); }
check('describeHomework line', /Fractions — 2 of 4 attempted, 1 correct/.test(describeHomework(computeHomeworkStatus(a, [row('i1', 1, 5), row('i2', 0, 6)]))));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
