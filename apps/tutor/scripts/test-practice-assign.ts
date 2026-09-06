/** Spec §C.3 — pure homework resolver over injected PracticeSources. Usage: npx tsx scripts/test-practice-assign.ts */
import { resolveAssignmentItems, difficultyForBand, ASSIGN_TUNING } from '../src/lib/tutor/practice-assign/resolve';
import { courseIdFilter, openAssignmentsQuery, mergeDraftLos, finalizePatch, draftStatusClause } from '../src/lib/tutor/practice-assign/store';
import type { PracticeSources, BankLite } from '../src/lib/tutor/portal/practice';
import type { IPracticeAssignment, IPracticeAssignmentLo } from '../src/models';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }

const bank = (loId: string, n: number, difficulty: 1 | 2 | 3 | 4 = 2): BankLite[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${loId}-b${i}`, problemText: `q${i}`, answer: `${i}`, difficulty, loId }));
const sources: PracticeSources = {
  async plansForLoId() { return []; },
  async plansForTopic() { return []; },
  async bankForLoId(loId, difficulty) { return bank(loId, 6).filter((b) => difficulty === undefined || b.difficulty === difficulty); },
  async bankForTopic() { return []; },
};

check('band → difficulty', difficultyForBand('building') === 1 && difficultyForBand('steady') === 2 && difficultyForBand('strong') === 3);

// Fix round 1 (Critical C1 / Important I2) — courseId wildcard semantics for
// the assigned-practice read. Neither author path stamps `courseId` on
// every PracticeAssignment yet, so a strict-equals filter would hide every
// unstamped record from a caller that (like the academy BFF) always sends
// one. Evaluates the EXACT `$or` clause findOpenAssignments/the
// assigned-practice route send to Mongo against representative documents,
// replicating Mongo's own `$exists`/equality semantics for these three
// clause shapes — no live DB connection required.
{
  function matchesOrClause(doc: { courseId?: string }, or: Array<Record<string, unknown>>): boolean {
    return or.some((clause) => {
      const v = clause.courseId;
      if (v && typeof v === 'object' && '$exists' in (v as object)) {
        const wantsAbsent = (v as { $exists: boolean }).$exists === false;
        return wantsAbsent ? doc.courseId === undefined : doc.courseId !== undefined;
      }
      return doc.courseId === v;
    });
  }
  check('courseIdFilter — no clause when courseId omitted', courseIdFilter(undefined) === undefined);
  const clause = courseIdFilter('B');
  const or = clause?.$or ?? [];
  check('courseIdFilter — an UNSTAMPED assignment matches any requested courseId', matchesOrClause({}, or));
  check('courseIdFilter — an empty-string-stamped assignment matches any requested courseId', matchesOrClause({ courseId: '' }, or));
  check('courseIdFilter — an assignment stamped for the SAME course matches', matchesOrClause({ courseId: 'B' }, or));
  check('courseIdFilter — an assignment stamped for a DIFFERENT course does not match', !matchesOrClause({ courseId: 'A' }, or));
}

// Fix round 2 (Critical C1) — `ignoreAcknowledged` must drop the
// `acknowledgedAt: { $exists: false }` clause from findOpenAssignments'
// query, while leaving the window/locator/courseId/studentId clauses
// untouched. This is the option the assigned-practice route's DEFAULT
// (non-includeAcknowledged) path now passes, so an acknowledged-but-
// untouched assignment still shows up on the student's Practice tab.
{
  const withDefault = openAssignmentsQuery('s1', { withinDays: 21, requireLocator: true, courseId: 'c1' });
  const withIgnore = openAssignmentsQuery('s1', { withinDays: 21, requireLocator: true, courseId: 'c1', ignoreAcknowledged: true });
  check('default query includes the acknowledgedAt clause', 'acknowledgedAt' in withDefault);
  check('ignoreAcknowledged:true drops the acknowledgedAt clause', !('acknowledgedAt' in withIgnore));
  check('ignoreAcknowledged leaves studentId untouched', withIgnore.studentId === 's1' && withDefault.studentId === 's1');
  check('ignoreAcknowledged leaves the window clause untouched', JSON.stringify(withIgnore.assignedAt) === JSON.stringify(withDefault.assignedAt));
  check('ignoreAcknowledged leaves the locator clause untouched', JSON.stringify(withIgnore.locator) === JSON.stringify(withDefault.locator));
  check('ignoreAcknowledged leaves the courseId clause untouched', JSON.stringify(withIgnore.$or) === JSON.stringify(withDefault.$or));
  check('ignoreAcknowledged omitted (falsy) behaves like false', 'acknowledgedAt' in openAssignmentsQuery('s1', {}));
}

// Task 10 — homework draft lifecycle. Open reads exclude drafts;
// mergeDraftLos/finalizePatch are pure and unit-testable without Mongo.
{
  check('draftStatusClause — excludes drafts', JSON.stringify(draftStatusClause()) === JSON.stringify({ status: { $ne: 'draft' } }));
  check('openAssignmentsQuery — status clause excludes drafts', JSON.stringify(openAssignmentsQuery('s1').status) === JSON.stringify({ $ne: 'draft' }));

  // matches() reuses the same shape the assigned-practice route's
  // `includeAcknowledged` branch and findOpenAssignments both send to
  // Mongo — a status-less doc is a LEGACY assigned record and must still
  // match; a status:'draft' doc must not.
  function matchesStatusClause(doc: { status?: string }, clause: { status: { $ne: string } }): boolean {
    return doc.status !== clause.status.$ne;
  }
  const clause = openAssignmentsQuery('s1');
  check('a status:"draft" doc does NOT match openAssignmentsQuery', !matchesStatusClause({ status: 'draft' }, clause as { status: { $ne: string } }));
  check('a status-less legacy doc DOES match openAssignmentsQuery', matchesStatusClause({}, clause as { status: { $ne: string } }));

  const lo = (id: string): IPracticeAssignmentLo => ({ loId: id, title: id, reason: 'r', items: [] });
  check(
    'mergeDraftLos — keeps earlier LOs, caps at 2, dedups by loId (existing a, incoming a+b → a,b)',
    JSON.stringify(mergeDraftLos([lo('a')], [lo('a'), lo('b')]).map((l) => l.loId)) === JSON.stringify(['a', 'b']),
  );
  check(
    'mergeDraftLos — already at cap: new LOs dropped (existing a,b, incoming c → a,b)',
    JSON.stringify(mergeDraftLos([lo('a'), lo('b')], [lo('c')]).map((l) => l.loId)) === JSON.stringify(['a', 'b']),
  );

  // finalizePatch promotes + stamps + applies the brain's reason to every LO
  const rec = {
    _id: 'x',
    studentId: 's1',
    sessionId: 'sess',
    los: [lo('a')],
    status: 'draft',
    draftedAt: new Date(0),
    auto: true,
    assignedAt: new Date(0),
    createdAt: new Date(0),
  } as unknown as IPracticeAssignment;
  const now = new Date('2026-09-07T10:00:00Z');
  const patch = finalizePatch(rec, { reason: 'This tripped you up twice today.', nextTimeIntent: 'start with a warm-up', locator: 'Unit 2 · Practice', source: 'close_tool', now });
  check('finalizePatch — status promoted to assigned', patch.status === 'assigned');
  check('finalizePatch — finalizeSource stamped', patch.finalizeSource === 'close_tool');
  check('finalizePatch — assignedAt stamped to now', patch.assignedAt?.toISOString() === now.toISOString());
  check('finalizePatch — finalizedAt stamped to now', patch.finalizedAt?.toISOString() === now.toISOString());
  check('finalizePatch — reason applied to every LO', patch.los?.[0].reason === 'This tripped you up twice today.');
  check('finalizePatch — locator carried', patch.locator === 'Unit 2 · Practice');
  check('finalizePatch — no reason ⇒ the draft\'s default reason survives', finalizePatch(rec, { source: 'end', now }).los?.[0].reason === 'r');
}

(async () => {
  const out = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  check('one LO → perLo items', out.length === 1 && out[0].items.length === ASSIGN_TUNING.perLo, JSON.stringify(out.map((o) => o.items.length)));
  check('title carried', out[0].title === 'Alpha');

  const out2 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }, { loId: 'B', title: 'Beta' }, { loId: 'C', title: 'Gamma' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  const total = out2.reduce((n, o) => n + o.items.length, 0);
  check('three LOs capped at ASSIGN_TUNING.cap total', total === ASSIGN_TUNING.cap, String(total));
  check('first LO keeps its full share (weakest-first order preserved)', out2[0].items.length === ASSIGN_TUNING.perLo);

  const out3 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'steady', seenItemIds: ['A-b0', 'A-b1', 'A-b2', 'A-b3', 'A-b4'], studentId: 's', courseId: 'c' }, sources);
  check('seen items excluded (only 1 unseen left)', out3[0].items.length === 1 && out3[0].items[0].id === 'A-b5', JSON.stringify(out3[0].items.map((i) => i.id)));

  const out4 = await resolveAssignmentItems({ los: [{ loId: 'Z', title: 'Zeta' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c' }, { ...sources, async bankForLoId() { return []; } });
  check('LO with no items is dropped', out4.length === 0);

  // difficulty passthrough: a 'strong' band asks for 3; our stub bank is all 2 → falls back to any difficulty
  const out5 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }], band: 'strong', seenItemIds: [], studentId: 's', courseId: 'c' }, sources);
  check('difficulty miss falls back to unfiltered retrieval', out5.length === 1 && out5[0].items.length === ASSIGN_TUNING.perLo);

  console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
