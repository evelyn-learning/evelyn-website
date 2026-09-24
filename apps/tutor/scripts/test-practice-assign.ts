/** Spec §C.3 — pure homework resolver over injected PracticeSources. Usage: npx tsx scripts/test-practice-assign.ts */
import { resolveAssignmentItems, difficultyForBand, ASSIGN_TUNING } from '../src/lib/tutor/practice-assign/resolve';
import { courseIdFilter, openAssignmentsQuery, mergeDraftLos, finalizePatch, draftStatusClause, summarizeAssignmentLos, sessionScopeFilter, shouldFinalizeDraftOnEmit } from '../src/lib/tutor/practice-assign/store';
import { capForPartner } from '../src/lib/tutor/practice-assign/assign';
import { topUpPractice } from '../src/lib/tutor/practice-assign/top-up';
import { shouldCreateDraftOnEmit, draftLoIdsForEmit, homeworkAnchorItems, createDraftOnEmit } from '../src/lib/tutor/practice-assign/emit-draft';
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

  // summarizeAssignmentLos — the shape assignPractice's `alreadyAssigned`
  // branch must build from the EXISTING persisted record (rec.los), not
  // from freshly re-resolved items that were never written.
  const losWithItems: IPracticeAssignmentLo[] = [
    { loId: 'a', title: 'Alpha', reason: 'r', items: [{ id: 'a-1' }, { id: 'a-2' }] as never },
    { loId: 'b', title: 'Beta', reason: 'r', items: [] },
  ];
  check(
    'summarizeAssignmentLos — maps loId/title/count from items.length',
    JSON.stringify(summarizeAssignmentLos(losWithItems)) === JSON.stringify([{ loId: 'a', title: 'Alpha', count: 2 }, { loId: 'b', title: 'Beta', count: 0 }]),
  );
  check('summarizeAssignmentLos — empty in, empty out', summarizeAssignmentLos([]).length === 0);

  // Fix round 1 (Important — ownership check) — sessionScopeFilter is the
  // single filter-shape builder every sessionId-keyed store function now
  // routes through, so an authenticated caller can never read/promote a
  // DIFFERENT student's record by sessionId alone.
  check('sessionScopeFilter — no studentId ⇒ sessionId-only clause', JSON.stringify(sessionScopeFilter('sess-1')) === JSON.stringify({ sessionId: 'sess-1' }));
  check('sessionScopeFilter — studentId supplied ⇒ scoped clause', JSON.stringify(sessionScopeFilter('sess-1', 'stu-1')) === JSON.stringify({ sessionId: 'sess-1', studentId: 'stu-1' }));
  check('sessionScopeFilter — omits the studentId KEY entirely when absent (not studentId: undefined)', !('studentId' in sessionScopeFilter('sess-1')));
}

// Final-review fix wave (GreenApple) — capForPartner is the pure integer≥1
// gate in front of the practice_assign_cap flag override. Only an integer
// ≥ 1 (number or numeric string) may take effect; a boolean, 0/""/false, or
// a fraction falls back to ASSIGN_TUNING.cap (8). A valid override above
// ASSIGN_TUNING.cap is clamped DOWN here (not raised) — the observable
// total must never exceed 8.
{
  check('capForPartner — null partner → default cap (8)', capForPartner(null) === ASSIGN_TUNING.cap, String(capForPartner(null)));
  check('capForPartner — numeric override 3 → 3', capForPartner({ flagOverrides: { practice_assign_cap: 3 } }) === 3);
  check('capForPartner — numeric-string override "3" → 3', capForPartner({ flagOverrides: { practice_assign_cap: '3' } }) === 3);
  check('capForPartner — boolean true is REJECTED (not coerced to 1) → default cap', capForPartner({ flagOverrides: { practice_assign_cap: true } }) === ASSIGN_TUNING.cap);
  check('capForPartner — boolean false is REJECTED → default cap', capForPartner({ flagOverrides: { practice_assign_cap: false } }) === ASSIGN_TUNING.cap);
  check('capForPartner — 0 is REJECTED (homework must not silently go to 0) → default cap', capForPartner({ flagOverrides: { practice_assign_cap: 0 } }) === ASSIGN_TUNING.cap);
  check('capForPartner — empty string is REJECTED → default cap', capForPartner({ flagOverrides: { practice_assign_cap: '' } }) === ASSIGN_TUNING.cap);
  check('capForPartner — fractional 2.5 is REJECTED (not floored/rounded) → default cap', capForPartner({ flagOverrides: { practice_assign_cap: 2.5 } }) === ASSIGN_TUNING.cap);
  check('capForPartner — 999 is clamped DOWN to ASSIGN_TUNING.cap (never raised)', capForPartner({ flagOverrides: { practice_assign_cap: 999 } }) === ASSIGN_TUNING.cap, String(capForPartner({ flagOverrides: { practice_assign_cap: 999 } })));
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

  // Task 12 — partner-level practice cap (GreenApple = 3). `cap` may only
  // LOWER ASSIGN_TUNING.cap, never raise it.
  const out6 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }, { loId: 'B', title: 'Beta' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c', cap: 3 }, sources);
  check('cap:3 — total across LOs is capped at 3, not ASSIGN_TUNING.cap', out6.reduce((n, o) => n + o.items.length, 0) === 3, JSON.stringify(out6.map((o) => o.items.length)));

  const out7 = await resolveAssignmentItems({ los: [{ loId: 'A', title: 'Alpha' }, { loId: 'B', title: 'Beta' }], band: 'steady', seenItemIds: [], studentId: 's', courseId: 'c', cap: 999 }, sources);
  check('cap higher than ASSIGN_TUNING.cap cannot raise it (lower-only clamp)', out7.reduce((n, o) => n + o.items.length, 0) === ASSIGN_TUNING.cap, String(out7.reduce((n, o) => n + o.items.length, 0)));

  // Round 3 — a terminal 'completed' portal emit (academy idle sweep) finalizes
  // the session's draft; checkpoints and aborts never do; kill switch honoured.
  check('emit finalize: completed finalizes', shouldFinalizeDraftOnEmit('completed', undefined));
  check('emit finalize: in_progress checkpoint never finalizes', !shouldFinalizeDraftOnEmit('in_progress', undefined));
  check('emit finalize: aborted never finalizes', !shouldFinalizeDraftOnEmit('aborted', undefined));
  check('emit finalize: SESSION_RESULT_FINALIZE_DRAFT=off disables', !shouldFinalizeDraftOnEmit('completed', 'off'));
  {
    const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'src/lib/tutor/portal/session-result.ts'), 'utf8') as string;
    const gate = src.indexOf('shouldFinalizeDraftOnEmit(req.status)');
    const echo = src.indexOf('const rawAssignment = await findAssignmentBySession(');
    check('wiring: session-result finalizes before the assignment echo', gate > 0 && echo > gate);
  }

  // Round 4 (E3) — end-of-session drafts (host names where practice lands) + generation top-up.
  check('emit draft: completed + plan + locator creates', shouldCreateDraftOnEmit({ status: 'completed', lessonPlanId: 'p', practiceLocator: 'My Homework Help · Practice' }, undefined));
  check('emit draft: no locator (every other host) never creates', !shouldCreateDraftOnEmit({ status: 'completed', lessonPlanId: 'p' }, undefined));
  check('emit draft: no plan never creates', !shouldCreateDraftOnEmit({ status: 'completed', practiceLocator: 'x' }, undefined));
  check('emit draft: a checkpoint never creates', !shouldCreateDraftOnEmit({ status: 'in_progress', lessonPlanId: 'p', practiceLocator: 'x' }, undefined));
  check('emit draft: SESSION_RESULT_DRAFT=off disables', !shouldCreateDraftOnEmit({ status: 'completed', lessonPlanId: 'p', practiceLocator: 'x' }, 'off'));
  const plan3 = { id: 'gen-1', los: [{ id: 'gen-1.lo-1' }, { id: 'gen-1.lo-2' }, { id: 'gen-1.lo-3' }] };
  check('emit LOs: touched ∩ plan (no prereq:) first', JSON.stringify(draftLoIdsForEmit(plan3, ['gen-1.lo-3', 'other', 'prereq:x'])) === '["gen-1.lo-3"]');
  check('emit LOs: nothing touched → the first two plan LOs', JSON.stringify(draftLoIdsForEmit(plan3, [])) === '["gen-1.lo-1","gen-1.lo-2"]');
  const hwPlan = { id: 'gen-hw', los: [{ id: 'gen-hw.homework-lo-1' }], metadata: { kind: 'homework-help', problems: [{ n: 1, text: 'Solve 2x + 3 = 7' }, { n: 2, text: 'Solve 5x = 20' }] } };
  check('emit LOs: a homework plan → its wrapper LO', JSON.stringify(draftLoIdsForEmit(hwPlan, [])) === '["gen-hw.homework-lo-1"]');
  const hwAnchors = homeworkAnchorItems(hwPlan);
  check('homework anchors: the worksheet problems, as plan-try-yourself anchors', hwAnchors.length === 2 && hwAnchors[0]?.problemText === 'Solve 2x + 3 = 7' && hwAnchors[0]?.source === 'plan-try-yourself');
  {
    const calls: Array<{ shortfall: number; anchors: number }> = [];
    let k = 0;
    const gen = async (o: { shortfall: number; anchorItems: unknown[] }) => {
      calls.push({ shortfall: o.shortfall, anchors: o.anchorItems.length });
      return Array.from({ length: Math.min(2, o.shortfall) }, () => ({ id: `g${++k}`, source: 'bank' as const, problemText: `gen ${k}` }));
    };
    const out = await topUpPractice([], [{ loId: 'gen-hw.homework-lo-1', title: 'HW' }], { studentId: 's', topic: 't', anchorsFor: () => hwAnchors }, gen as never);
    check('top-up: an empty bank → 3 generated items in 2 calls', out.length === 1 && out[0]?.items.length === 3 && calls.length === 2, JSON.stringify(calls));
    check('top-up: the first call asks for 3 and carries the worksheet anchors', calls[0]?.shortfall === 3 && calls[0]?.anchors === 2);
    const full = [{ loId: 'A', title: 'A', items: [1, 2, 3].map((i) => ({ id: `b${i}`, source: 'bank' as const, problemText: 'q' })) }];
    let genCalls = 0;
    await topUpPractice(full, [{ loId: 'A', title: 'A' }], { studentId: 's', topic: 't', anchorsFor: () => [] }, (async () => { genCalls++; return []; }) as never);
    check('top-up: a full bank never generates', genCalls === 0);
    const off = await topUpPractice([], [{ loId: 'A', title: 'A' }], { studentId: 's', topic: 't', anchorsFor: () => [] }, (async () => []) as never);
    check('top-up: generator returns [] (PRACTICE_GEN off / over cap) → nothing, no throw', off.length === 0);
  }
  {
    const req = { sessionId: 's1', studentId: 'ext', courseId: 'open:math:9-10', status: 'completed', lessonPlanId: 'gen-hw', losTouched: [], masteryDeltas: [], gaps: [], notesTouched: [], practiceLocator: 'My Homework Help · Practice' } as never;
    const captured: { input?: Record<string, unknown> } = {};
    const deps = {
      findAssignment: async () => null,
      getPlan: async () => hwPlan,
      assign: async (i: Record<string, unknown>) => { captured.input = i; return { assignmentId: 'a', assigned: [], status: 'draft' as const }; },
    };
    check('createDraftOnEmit: creates a draft', (await createDraftOnEmit(req, { profileId: 'p', partnerId: 'greenapple' }, deps as never)) === 'created');
    check('createDraftOnEmit: draft carries locator, session_end trigger, top-up, the wrapper LO', captured.input?.locator === 'My Homework Help · Practice' && captured.input?.trigger === 'session_end' && captured.input?.status === 'draft' && !!captured.input?.topUp && JSON.stringify(captured.input?.loIds) === '["gen-hw.homework-lo-1"]');
    check('createDraftOnEmit: an existing assignment is left alone', (await createDraftOnEmit(req, { profileId: 'p', partnerId: 'g' }, { ...deps, findAssignment: async () => ({ _id: 'x' }) } as never)) === 'exists');
    check('createDraftOnEmit: an unknown plan does nothing', (await createDraftOnEmit(req, { profileId: 'p', partnerId: 'g' }, { ...deps, getPlan: async () => null } as never)) === 'no_plan');
  }
  {
    const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'src/lib/tutor/portal/session-result.ts'), 'utf8') as string;
    const create = src.indexOf('if (shouldCreateDraftOnEmit(req)) {');
    const finalize = src.indexOf('shouldFinalizeDraftOnEmit(req.status)');
    const echo = src.indexOf('const rawAssignment = await findAssignmentBySession(');
    check('wiring: create → finalize → echo, in that order', create > 0 && finalize > create && echo > finalize);
    check('wiring: finalize stamps the emit locator', src.includes("...(req.practiceLocator ? { locator: req.practiceLocator } : {})"));
    const assignSrc = require('fs').readFileSync(require('path').join(__dirname, '..', 'src/lib/tutor/practice-assign/assign.ts'), 'utf8') as string;
    check('wiring: assignPractice tops up before its empty check', assignSrc.indexOf('if (input.topUp)') > 0 && assignSrc.indexOf('if (input.topUp)') < assignSrc.indexOf('if (los.length === 0) return null;'));
  }
  console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
