/**
 * "Add objectives" — pure core and local data.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/add-core.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import {
  buildAddData, buildPlanData, estimatedMinutesAfter, expectedAfter, introGoal, isNumberWithUnit, preStateOf, stemSimilarity,
  storedSegment, textSha256, validateWritten, type AddIssue, type AddPack,
} from './add-core';
import { syntheticWritten } from './add-fixtures';
import { applyCorrections, loadDumpPlans, loadExpandedIndex, loadLessonV2, loadPacks, loadPreStates } from './add-io';
import { recapTeacherNote, type LessonSegment } from './core';
import { parseLessonPlan } from '../../src/lib/tutor/lesson-plan/parser';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

type Doc = Record<string, unknown>;
const dump = loadDumpPlans();
const index = loadExpandedIndex();
const lessons = index.map((e) => loadLessonV2(e.pack));
const expanded = lessons.map((l) => dump.get(l.planId) as Doc);
const patched = applyCorrections(new Map(expanded.map((d) => [d._id as string, d])));
const packs = loadPacks();
const pre = loadPreStates();

test('the 45 expanded plans are in the dump, each with 5 objectives of a picker plan that has 6–8', () => {
  assert.equal(expanded.length, 45);
  let missing = 0;
  for (const l of lessons) {
    const doc = dump.get(l.planId) as Doc;
    const picker = dump.get(l.pickerPlanId as string) as Doc;
    const los = doc.los as Array<{ id: string }>;
    const pickerLos = picker.los as Array<{ id: string }>;
    assert.equal(los.length, 5);
    assert.ok(pickerLos.length >= 6 && pickerLos.length <= 8);
    assert.deepEqual(pickerLos.map((x) => x.id), pickerLos.map((_, i) => `${picker._id as string}.lo-${i + 1}`));
    assert.deepEqual(los.map((x) => x.id), pickerLos.slice(0, 5).map((x) => x.id));
    assert.equal((picker.metadata as Doc).pendingPicker, true);
    missing += pickerLos.length - 5;
  }
  assert.equal(missing, 65);
});

test('stored segment shape: built from the teaching fields alone it equals every stored segment of the 45 plans, key order and nulls included', () => {
  let n = 0;
  for (const doc of expanded) {
    for (const seg of doc.segments as Doc[]) {
      if (seg.id === 'intro' || seg.id === 'recap') continue;
      const teaching = Object.fromEntries(Object.entries(seg).filter(([, v]) => v !== null)) as LessonSegment;
      assert.equal(JSON.stringify(storedSegment(teaching)), JSON.stringify(seg), String(seg.id));
      n += 1;
    }
  }
  assert.equal(n, 45 * 20);
  assert.throws(() => storedSegment({ id: 'x', kind: 'recap' }), /no stored shape/);
});

test('the generator formulas reproduce the stored intro goal, recap note and mustRemember of all 45 plans (after the corrections)', () => {
  for (const doc of patched.values()) {
    const p = preStateOf(doc);
    assert.equal(p.introGoal, introGoal(5));
    assert.equal(p.recapTeacherNote, recapTeacherNote(p.los.map((l) => l.description)));
    assert.deepEqual(p.recapMustRemember, p.los.map((l) => l.description));
    assert.deepEqual(p.pickedLoIds, p.los.map((l) => l.id));
    assert.equal(p.allowedMaxLOs, 5);
    assert.equal(p.estimatedMinutes, 30);
    assert.deepEqual(p.segmentIds.length, 22);
  }
  assert.equal(estimatedMinutesAfter(30, 3), 45);
});

test('lessons-v2 is the dump with the committed corrections applied (text and objectives), and differs from the raw dump', () => {
  let changed = 0;
  for (const l of lessons) {
    const p = pre.get(l.planId);
    assert.ok(p);
    assert.equal(p.textSha256, textSha256(l.segments), l.pack);
    assert.deepEqual(p.los, l.objectives);
    if (textSha256((dump.get(l.planId) as Doc).segments as Doc[]) !== p.textSha256) changed += 1;
  }
  assert.ok(changed > 20, `corrections changed ${changed} of the 45`);
});

test('packs: 45 packs, 65 missing objectives numbered 6..8, template ids, practice items attached', () => {
  assert.equal(packs.size, 45);
  let missing = 0;
  let withItems = 0;
  for (const p of packs.values()) {
    const state = pre.get(p.planId);
    assert.ok(state);
    assert.deepEqual(p.existingObjectives, state.los);
    assert.equal(textSha256(p.existingSegments), state.textSha256);
    p.missingObjectives.forEach((m, i) => {
      assert.equal(m.id, `${p.pickerPlanId}.lo-${6 + i}`);
      assert.equal(m.number, 6 + i);
      assert.ok(m.description && m.shortTitle);
      assert.equal(state.availableLOs[5 + i].description, m.description);
      if (m.existingPracticeItems.length) withItems += 1;
      for (const it of m.existingPracticeItems) assert.ok(it.question && it.answer !== undefined && it.source);
    });
    missing += p.missingObjectives.length;
  }
  assert.equal(missing, 65);
  assert.equal(withItems, 63);
});

const pack = packs.get('315') as AddPack; // 3 missing objectives
const codes = (issues: AddIssue[], level: 'error' | 'warning' = 'error'): string[] => [...new Set(issues.filter((i) => i.level === level).map((i) => i.code))].sort();
type Written = { objectives: Array<{ loId: string; check?: string; segments: Array<Record<string, unknown>> }> } & Record<string, unknown>;
function variant(change: (w: Written) => void): AddIssue[] {
  const w = JSON.parse(JSON.stringify(syntheticWritten(pack))) as Written;
  change(w);
  return validateWritten(w, pack).issues;
}

test('validator: a complete synthetic file for every pack passes with no error', () => {
  for (const p of packs.values()) {
    const r = validateWritten(syntheticWritten(p), p);
    assert.deepEqual(r.issues.filter((i) => i.level === 'error'), [], p.pack);
    assert.equal(r.file?.objectives.length, p.missingObjectives.length);
  }
});

test('validator: shape, ids and kinds', () => {
  assert.deepEqual(codes(validateWritten([], pack).issues), ['file_shape']);
  assert.deepEqual(codes(variant((w) => { w.pack = '316'; })), ['wrong_pack']);
  assert.deepEqual(codes(variant((w) => { w.planId = pack.pickerPlanId; })), ['wrong_plan']);
  assert.deepEqual(codes(variant((w) => { w.objectives.pop(); })), ['objective_list']);
  assert.deepEqual(codes(variant((w) => { w.objectives.reverse(); })), ['objective_list']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].loId = `${pack.pickerPlanId}.lo-1`; })), ['objective_list']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments.pop(); })), ['segment_list']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[3].id = `${pack.planId}.lo-6-try`; })), ['segment_id']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[3].id = `${pack.pickerPlanId}.lo-1-try`; })), ['segment_id']);
  assert.deepEqual(codes(variant((w) => { w.objectives[1].segments[2].kind = 'try_yourself'; })), ['segment_kind']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[3].hints = ['Think.']; })), ['extra_field']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].teacherNote = 'x'; })), ['extra_field']);
  assert.deepEqual(codes(variant((w) => { delete w.objectives[0].check; })), ['no_check']);
  assert.equal(validateWritten(syntheticWritten(pack), pack).file?.objectives[0].segments[3].id, `${pack.pickerPlanId}.lo-6-try`);
  assert.equal(variant((w) => { w.objectives[0].segments[3].id = 'x'; }).length > 0 && validateWritten({ ...syntheticWritten(pack), pack: 'x' }, pack).file, null);
});

test('validator: empty fields, counts, white space, markup', () => {
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = ''; })), ['empty_field']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = '   '; })), ['empty_field']);
  assert.deepEqual(codes(variant((w) => { delete w.objectives[0].segments[1].keyIdeas; })), ['empty_field']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[1].keyIdeas = []; })), ['empty_field']);
  assert.deepEqual(codes(variant((w) => { (w.objectives[0].segments[2].steps as string[])[1] = ''; })), ['empty_field']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[3].expectedAnswer = 5; })), ['empty_field']);
  assert.deepEqual(codes(variant((w) => { (w.objectives[0].segments[1].keyIdeas as string[]).pop(); })), ['count']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[2].steps = ['a step', 'b step', 'c step', 'd step', 'e step']; })), ['count']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[2].steps = ['Same step.', 'Same step.', 'Other.']; })), ['duplicate_entry']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = 'Trailing space in this synthetic goal. '; })), ['edge_space']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = 'A line break\nin this synthetic goal text.'; })), ['control_char']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = 'A zero​width space in this synthetic goal.'; })), ['invisible_char']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = 'Use \\frac{1}{2} in this synthetic goal text.'; })), ['markup']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = 'A **bold** word in this synthetic goal text.'; })), ['markup']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = 'An unbalanced { brace in this synthetic goal.'; })), ['unbalanced_markup']);
  assert.deepEqual(codes(variant((w) => { w.objectives[0].segments[0].goal = 'Short.'; }), 'warning'), ['length']);
});

test('validator: the try_yourself — answer leak, unit on a number, long or open key, drawing, figure, repeats', () => {
  const tri = (w: Written, o = 0): Record<string, unknown> => w.objectives[o].segments[3];
  assert.deepEqual(codes(variant((w) => { tri(w).problem = 'Is the answer 600 or 700 metres?'; })), ['answer_in_problem']);
  assert.deepEqual(codes(variant((w) => { tri(w).problem = 'Does it move in or out of the cell here?'; tri(w).expectedAnswer = 'Out'; })), ['answer_in_problem']);
  assert.deepEqual(codes(variant((w) => { tri(w).problem = 'What is 1,600 minus 1,000?'; })), []); // "600" inside "1,600" is not the answer
  assert.deepEqual(codes(variant((w) => { tri(w).expectedAnswer = '600 m'; })), ['numeric_answer_has_unit']);
  assert.deepEqual(codes(variant((w) => { tri(w).expectedAnswer = 'It moves outward because the concentration is higher inside the cell than outside it.'; })), ['long_answer']);
  assert.deepEqual(codes(variant((w) => { tri(w).expectedAnswer = 'Any two of: mass, charge'; })), ['open_answer']);
  assert.deepEqual(codes(variant((w) => { tri(w).problem = 'Sketch the graph of the synthetic function.'; })), ['drawing_task']);
  assert.deepEqual(codes(variant((w) => { tri(w).problem = 'Using the graph shown, find the synthetic midline value.'; })), ['needs_figure']);
  assert.deepEqual(codes(variant((w) => { tri(w).problem = w.objectives[0].segments[2].problem; })), ['try_equals_worked']);
  assert.deepEqual(codes(variant((w) => { tri(w, 1).problem = tri(w, 0).problem; })), ['repeats_lesson_problem']);
  const existingTry = pack.existingSegments.find((s) => s.kind === 'try_yourself') as LessonSegment;
  assert.deepEqual(codes(variant((w) => { tri(w).problem = existingTry.problem; tri(w).expectedAnswer = 'zzz'; })), ['repeats_lesson_problem']);
  const item = pack.missingObjectives[0].existingPracticeItems[0];
  assert.ok(item, 'pack 315 objective 6 has an existing practice item');
  assert.deepEqual(codes(variant((w) => { tri(w).problem = ` ${item.question.toUpperCase()}`.trim(); tri(w).expectedAnswer = 'zzz'; })), ['try_equals_practice_item']);
  // The same stem under ANOTHER objective is not this objective's item.
  assert.deepEqual(codes(variant((w) => { tri(w, 1).problem = item.question; tri(w, 1).expectedAnswer = 'zzz'; })).filter((c) => c === 'try_equals_practice_item'), pack.missingObjectives[1].existingPracticeItems.some((x) => x.question === item.question) ? ['try_equals_practice_item'] : []);
  const near = `${item.question} Explain.`;
  assert.ok(stemSimilarity(item.question, near) >= 0.8);
  assert.deepEqual(codes(variant((w) => { tri(w).problem = near; tri(w).expectedAnswer = 'zzz'; }), 'warning').filter((c) => c === 'try_like_practice_item'), ['try_like_practice_item']);
});

test('number-with-unit detector', () => {
  for (const a of ['325 K', '48 meters', '0.33 seconds', '120°', '120°.', '45%', '6 Ω', '3.0 × 10^8 m/s', '−4 m/s²', '128 N.', '25 °C']) assert.equal(isNumberWithUnit(a), true, a);
  for (const a of ['325', '-12', '13/3', '2 or 3', '2 and 5', 'x = 3', '⟨6, 4⟩', 'NADH', '4 haploid gametes, n=8', 'y = 2', '3x', '1 only', 'f⁻¹(x) = ∛x', '2 × 10^3']) assert.equal(isNumberWithUnit(a), false, a);
});

test('apply data: the document after equals los + 4 segments per objective before recap, recap and metadata by the generator formulas, and still parses as a lesson plan', () => {
  for (const id of ['315', '316', '332']) {
    const p = packs.get(id) as AddPack;
    const state = pre.get(p.planId);
    assert.ok(state);
    const file = validateWritten(syntheticWritten(p), p).file;
    assert.ok(file);
    const plan = buildPlanData(p, state, file);
    const k = p.missingObjectives.length;
    assert.equal(plan.add.segments.length, 4 * k);
    assert.equal(plan.post.allowedMaxLOs, 5 + k);
    assert.equal(plan.post.estimatedMinutes, 30 + 5 * k);
    assert.equal(plan.post.introGoal, introGoal(5 + k));
    const before = patched.get(p.planId) as Doc;
    const after = expectedAfter(before, plan);
    const segs = after.segments as Doc[];
    const los = after.los as Array<{ id: string; description: string }>;
    assert.equal(segs.length, 22 + 4 * k);
    assert.equal(segs[segs.length - 1].id, 'recap');
    assert.deepEqual(segs.map((s) => s.id), ['intro', ...los.flatMap((l) => ['hook', 'concept', 'worked', 'try'].map((x) => `${l.id}-${x}`)), 'recap']);
    assert.deepEqual(segs[segs.length - 1].mustRemember, los.map((l) => l.description));
    assert.equal(segs[segs.length - 1].teacherNote, recapTeacherNote(los.map((l) => l.description)));
    assert.deepEqual((after.metadata as Doc).pickedLoIds, los.map((l) => l.id));
    assert.deepEqual(los.map((l) => l.id), (((after.metadata as Doc).availableLOs) as Array<{ id: string }>).map((a) => a.id));
    // No new step is objective 1, and none is on the picker plan's id.
    for (const s of plan.add.segments) assert.match(s.id as string, new RegExp(`^${p.pickerPlanId}\\.lo-[678]-(hook|concept|worked|try)$`));
    // Existing segments untouched, byte for byte.
    assert.equal(JSON.stringify(segs.slice(1, 21)), JSON.stringify((before.segments as Doc[]).slice(1, 21)));
    // The engine's own parser accepts the document.
    const parsed = parseLessonPlan({ ...after, id: after._id });
    assert.equal(parsed.los.length, 5 + k);
    assert.equal(parsed.segments.length, 22 + 4 * k);
    assert.equal(buildAddData([plan]).counts.segments, 4 * k);
  }
});

test('apply data refuses a pack, stored state and file that do not describe the same plan', () => {
  const state = pre.get(pack.planId);
  assert.ok(state);
  const file = validateWritten(syntheticWritten(pack), pack).file;
  assert.ok(file);
  const raw = preStateOf(dump.get(pack.planId) as Doc); // pack 315 was corrected: the raw dump text differs
  assert.throws(() => buildPlanData(pack, raw, file), /not the stored \(corrected\) text/);
  assert.throws(() => buildPlanData(pack, { ...state, allowedMaxLOs: 6 }, file), /allowedMaxLOs/);
  assert.throws(() => buildPlanData(pack, { ...state, recapTeacherNote: 'x' }, file), /recap note/);
  assert.throws(() => buildPlanData(pack, { ...state, availableLOs: state.availableLOs.slice(0, 7) }, file), /availableLOs|available objectives/);
  assert.throws(() => buildPlanData({ ...pack, grade: '3' }, state, file), /grade/);
  const dupe = { ...pack, missingObjectives: pack.missingObjectives.map((m, i) => (i === 0 ? { ...m, description: pack.existingObjectives[0].description } : m)) };
  assert.throws(() => buildPlanData(dupe, state, file), /availableLOs|share one description/);
});

console.log(`\n${passed} passed`);
