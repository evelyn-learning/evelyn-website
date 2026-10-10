/**
 * Tests for scripts/lesson-fix/core.ts (pure — no files, no network, no DB).
 * Run from apps/tutor:  env -u MONGODB_URI npx tsx scripts/lesson-fix/core.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import {
  buildApplyData,
  containsAnswerVerbatim,
  objectiveNumberOf,
  parsePath,
  recapTeacherNote,
  patchFileShapeProblems,
  renderDiffMarkdown,
  unbalancedMarkup,
  validatePatches,
  validateWithWaivers,
  applyDataToDocs,
  type Change,
  type LessonSegment,
  type Lesson,
  type PatchFile,
} from './core';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const PLAN = 'gen-00000000-0000-4000-8000-000000000001';
function lesson(): Lesson {
  return {
    pack: '007',
    planId: PLAN,
    subject: 'ALGEBRA_2',
    title: 'Sample lesson',
    objectives: [{ id: `${PLAN}.lo-1`, description: 'Find slope.', shortTitle: 'Slope' }, { id: `${PLAN}.lo-2`, description: 'Solve equations.' }],
    segments: [
      { id: 'intro', kind: 'hook', goal: 'Say hello.' },
      { id: `${PLAN}.lo-1-concept`, kind: 'concept', goal: 'Teach slope.', keyIdeas: ['Slope is rise over run.', 'A flat line has slope 0.'] },
      { id: `${PLAN}.lo-1-worked`, kind: 'worked_example', problem: 'Find the slope through (0,0) and (2,6).', steps: ['Rise is 6.', 'Run is 2.', 'Slope is 6/2 = 4.'], answer: '4' },
      { id: `${PLAN}.lo-1-try`, kind: 'try_yourself', problem: 'Find the slope through (1,1) and (3,9).', expectedAnswer: '5' },
      { id: `${PLAN}.lo-2-try`, kind: 'try_yourself', problem: 'Solve x + 1 = 8.', expectedAnswer: '7' },
      { id: 'recap', kind: 'recap', mustRemember: ['Find slope.', 'Solve equations.'] },
    ],
  };
}
const lessons = (): Map<string, Lesson> => new Map([['007', lesson()]]);
function file(changesBySegment: Record<string, Change[]>, name = 'a.json'): PatchFile {
  return {
    file: name,
    subject: 'Algebra 2',
    skipped: [],
    patches: Object.entries(changesBySegment).map(([segmentId, changes]) => ({ pack: '007', planId: PLAN, segmentId, changes })),
  };
}
const codes = (r: ReturnType<typeof validatePatches>, level = 'error'): string[] => r.issues.filter((i) => i.level === level).map((i) => i.code);
const WORKED = `${PLAN}.lo-1-worked`;
const TRY1 = `${PLAN}.lo-1-try`;
const TRY2 = `${PLAN}.lo-2-try`;

test('parsePath accepts field, field[i], field[+] and nothing else', () => {
  assert.deepEqual(parsePath('goal'), { field: 'goal', index: null });
  assert.deepEqual(parsePath('steps[2]'), { field: 'steps', index: 2 });
  assert.deepEqual(parsePath('steps[+]'), { field: 'steps', index: '+' });
  for (const bad of ['', 'steps[]', 'steps[-1]', 'a.b', 'steps[1][2]', ' goal', 'segments.3.goal', 3, null]) assert.equal(parsePath(bad), null);
});

test('a correct patch validates and resolves to stored-relative changes', () => {
  const r = validatePatches([file({ [WORKED]: [
    { path: 'steps[2]', old: 'Slope is 6/2 = 4.', new: 'Slope is 6/2 = 3.' },
    { path: 'answer', old: '4', new: '3' },
  ] })], lessons());
  assert.equal(r.ok, true);
  assert.deepEqual(r.totals, { files: 1, patches: 1, changes: 2, plans: 1, errors: 0, warnings: 0 });
  assert.deepEqual(r.segments[0].changes, [
    { field: 'steps', index: 2, append: false, old: 'Slope is 6/2 = 4.', new: 'Slope is 6/2 = 3.' },
    { field: 'answer', index: null, append: false, old: '4', new: '3' },
  ]);
});

test('old must match exactly — a fragment, a case change or a trailing space fails', () => {
  for (const old of ['Slope is 6/2', 'slope is 6/2 = 4.', 'Slope is 6/2 = 4. ']) {
    const r = validatePatches([file({ [WORKED]: [{ path: 'steps[2]', old, new: 'Slope is 3.' }] })], lessons());
    assert.deepEqual(codes(r), ['old_mismatch']);
    assert.equal(r.segments.length, 0);
  }
});

test('invalid paths, unknown fields, out-of-range indexes and structural fields are errors', () => {
  const cases: Array<[Change, string]> = [
    [{ path: 'steps.2', old: 'x', new: 'y' }, 'bad_path'],
    [{ path: 'hints[0]', old: 'x', new: 'y' }, 'path_not_array'],
    [{ path: 'steps[3]', old: 'x', new: 'y' }, 'index_out_of_range'],
    [{ path: 'steps', old: 'x', new: 'y' }, 'path_not_string'],
    [{ path: 'problem[0]', old: 'x', new: 'y' }, 'path_not_array'],
    [{ path: 'id', old: WORKED, new: 'other' }, 'forbidden_field'],
    [{ path: 'kind', old: 'worked_example', new: 'hook' }, 'forbidden_field'],
    [{ path: 'answer', old: '4', new: '4' }, 'no_op'],
    [{ path: 'answer', old: '4', new: '  ' }, 'empty_new'],
    [{ path: 'answer', old: null, new: '3' }, 'old_not_string'],
  ];
  for (const [change, code] of cases) {
    assert.deepEqual(codes(validatePatches([file({ [WORKED]: [change] })], lessons())), [code], JSON.stringify(change));
  }
});

test('unknown lesson, wrong plan, unknown segment and empty patches are errors', () => {
  const base = file({ [WORKED]: [{ path: 'answer', old: '4', new: '3' }] });
  assert.deepEqual(codes(validatePatches([{ ...base, patches: [{ ...base.patches[0], pack: '999' }] }], lessons())), ['unknown_pack']);
  assert.deepEqual(codes(validatePatches([{ ...base, patches: [{ ...base.patches[0], planId: 'gen-x' }] }], lessons())), ['plan_mismatch']);
  assert.deepEqual(codes(validatePatches([{ ...base, patches: [{ ...base.patches[0], segmentId: 'nope' }] }], lessons())), ['unknown_segment']);
  assert.deepEqual(codes(validatePatches([{ ...base, patches: [{ ...base.patches[0], changes: [] }] }], lessons())), ['no_changes']);
});

test('one patch per segment across ALL files; a path may be listed once', () => {
  const a = file({ [WORKED]: [{ path: 'answer', old: '4', new: '3' }] }, 'a.json');
  const b = file({ [WORKED]: [{ path: 'problem', old: 'Find the slope through (0,0) and (2,6).', new: 'Find the slope of the line through (0,0) and (2,6).' }] }, 'b.json');
  const r = validatePatches([a, b], lessons());
  assert.deepEqual(codes(r), ['duplicate_segment']);
  assert.equal(r.issues[0].file, 'b.json');
  const twice = validatePatches([file({ [WORKED]: [{ path: 'answer', old: '4', new: '3' }, { path: 'answer', old: '4', new: '2' }] })], lessons());
  assert.deepEqual(codes(twice), ['duplicate_path']);
});

test('append: old must be null, index is the array length, a second append follows it', () => {
  const r = validatePatches([file({ [WORKED]: [
    { path: 'steps[+]', old: null, new: 'Check: 3 × 2 = 6.' },
    { path: 'steps[+]', old: null, new: 'So the slope is 3.' },
    { path: 'answer', old: '4', new: '3' },
  ] })], lessons());
  assert.equal(r.ok, true);
  assert.deepEqual(r.segments[0].changes.map((c) => [c.field, c.index, c.append]), [['steps', 3, true], ['steps', 4, true], ['answer', null, false]]);
  assert.deepEqual(codes(validatePatches([file({ [WORKED]: [{ path: 'steps[+]', old: 'x', new: 'y' }] })], lessons())), ['append_old']);
  const other = validatePatches([file({ [`${PLAN}.lo-1-concept`]: [{ path: 'keyIdeas[+]', old: null, new: 'A steep line has a large slope.' }] })], lessons());
  assert.equal(other.ok, true);
  assert.deepEqual(codes(other, 'warning'), ['append_field']);
});

test('control characters, new line breaks, edge spaces and invisible characters are errors', () => {
  const mk = (n: string) => validatePatches([file({ [WORKED]: [{ path: 'answer', old: '4', new: n }] })], lessons());
  assert.deepEqual(codes(mk('3\u0007')), ['control_char']);
  assert.deepEqual(codes(mk('3\nor 4')), ['line_break']);
  assert.deepEqual(codes(mk('3 ')), ['edge_space']);
  assert.deepEqual(codes(mk('3​')), ['invisible_char']);
});

test('unbalanced markup: hard markers are errors, brackets a warning, pre-existing imbalance is not blamed', () => {
  assert.deepEqual(unbalancedMarkup('f(x) = [0, 5)'), { hard: [], soft: ['( )', '[ ]'] });
  assert.deepEqual(unbalancedMarkup('**bold and `code').hard, ['**', '`']);
  const mk = (n: string) => validatePatches([file({ [WORKED]: [{ path: 'answer', old: '4', new: n }] })], lessons());
  assert.deepEqual(codes(mk('**3')), ['unbalanced_markup']);
  assert.deepEqual(codes(mk('{3')), ['unbalanced_markup']);
  const interval = mk('[3, 4)');
  assert.equal(interval.ok, true);
  assert.deepEqual(codes(interval, 'warning'), ['unbalanced_brackets']);
  const latex = mk('\\frac{6}{2}');
  assert.equal(latex.ok, true);
  assert.deepEqual(codes(latex, 'warning'), ['new_markup_style']);
});

test('containsAnswerVerbatim matches whole runs only', () => {
  assert.equal(containsAnswerVerbatim('The answer is 12 metres.', '12'), true);
  assert.equal(containsAnswerVerbatim('Compute 312 + 1.', '12'), false);
  assert.equal(containsAnswerVerbatim('Compute 12.5 + 1.', '12'), false);
  assert.equal(containsAnswerVerbatim('Is it 12?', '12'), true);
  assert.equal(containsAnswerVerbatim('Factor  X² − 9 fully', 'x² − 9'), true);
  assert.equal(containsAnswerVerbatim('explain mitosis', 'tos'), false);
  assert.equal(containsAnswerVerbatim('anything', ''), false);
});

test('a patch that puts the expected answer into its own problem is an error; a pre-existing leak is a warning', () => {
  const leak = validatePatches([file({ [TRY2]: [{ path: 'problem', old: 'Solve x + 1 = 8.', new: 'Solve x + 1 = 8, so x = 7.' }] })], lessons());
  assert.deepEqual(codes(leak), ['answer_in_problem']);
  const viaAnswer = validatePatches([file({ [TRY2]: [{ path: 'expectedAnswer', old: '7', new: '8' }] })], lessons());
  assert.deepEqual(codes(viaAnswer), ['answer_in_problem']);
  const ls = lessons();
  (ls.get('007') as Lesson).segments[4].problem = 'Solve x + 1 = 8 (hint: 7).';
  const existing = validatePatches([file({ [TRY2]: [{ path: 'problem', old: 'Solve x + 1 = 8 (hint: 7).', new: 'Solve x + 1 = 8 (the hint is 7).' }] })], ls);
  assert.equal(existing.ok, true);
  assert.deepEqual(codes(existing, 'warning'), ['answer_in_problem_existing']);
  const fine = validatePatches([file({ [TRY1]: [{ path: 'expectedAnswer', old: '5', new: '4' }] })], lessons());
  assert.equal(fine.ok, true);
});

test('practice impact: objective 1, audited list, withdrawn list, and neither', () => {
  const f = file({
    [TRY1]: [{ path: 'expectedAnswer', old: '5', new: '4' }],
    [TRY2]: [{ path: 'problem', old: 'Solve x + 1 = 8.', new: 'Solve x + 2 = 9.' }],
  });
  const plain = validatePatches([f], lessons());
  assert.deepEqual(plain.practiceImpact.map((p) => [p.objective, p.withdrawn, p.auditedLessonStep, p.changedFields]), [[1, false, false, ['expectedAnswer']], [2, false, false, ['problem']]]);
  assert.match(plain.practiceImpact[0].note, /BOTH builds/);
  assert.match(plain.practiceImpact[1].note, /not on the audited list/);
  const listed = validatePatches([f], lessons(), { withdrawn: new Set([`${PLAN}::${TRY1}`]), auditedLessonSteps: new Set([`${PLAN}::${TRY2}`]) });
  assert.match(listed.practiceImpact[0].note, /withdrawn list/);
  assert.match(listed.practiceImpact[1].note, /Re-audit/);
  assert.equal(objectiveNumberOf('recap'), null);
});

test('a recap line changed with no objective change is allowed but its untouched copies are reported', () => {
  const r = validatePatches([file({ recap: [{ path: 'mustRemember[0]', old: 'Find slope.', new: 'Find the slope of a line.' }] })], lessons());
  assert.equal(r.ok, true);
  assert.deepEqual(codes(r, 'warning'), ['recap_copies']);
  assert.equal(r.derivedNotWritten.length, 1);
});

const LO1 = `${PLAN}.lo-1`;
const NOTE = (a: string) => `Recap the 2 learning objectives covered (${a}; Solve equations.). Have the student state one takeaway per LO in their own words, celebrate their progress, and close the session.`;

test('recapTeacherNote reproduces the generator wording', () => {
  assert.equal(recapTeacherNote(['Find slope.', 'Solve equations.']), NOTE('Find slope.'));
  assert.match(recapTeacherNote(['Only one.']), /^Recap the 1 learning objective covered \(Only one\.\)\. Have/);
});

test('an objective change resolves to los + its recap copies (mustRemember and teacherNote)', () => {
  const r = validatePatches([file({ [LO1]: [{ path: 'objective.description', old: 'Find slope.', new: 'Find the slope of a line.' }] })], lessons());
  assert.equal(r.ok, true);
  assert.deepEqual(codes(r, 'warning'), []);
  assert.deepEqual(r.objectives.map((o) => [o.loId, o.field, o.old, o.new]), [[LO1, 'description', 'Find slope.', 'Find the slope of a line.']]);
  assert.equal(r.segments.length, 1);
  assert.equal(r.segments[0].segmentId, 'recap');
  assert.deepEqual(r.segments[0].changes, [
    { field: 'mustRemember', index: 0, append: false, old: 'Find slope.', new: 'Find the slope of a line.', derived: LO1 },
    { field: 'teacherNote', index: null, append: false, old: NOTE('Find slope.'), new: NOTE('Find the slope of a line.'), derived: LO1 },
  ]);
  assert.deepEqual(r.objectiveCopies.map((c) => [c.where, c.action]), [['recap.mustRemember[0]', 'changed'], ['recap.teacherNote', 'changed'], ['los[].shortTitle', 'listed']]);
  const data = buildApplyData(r.segments, r.objectives);
  assert.deepEqual(data.counts, { plans: 1, segments: 1, fields: 3, objectives: 1 });
  assert.deepEqual(data.plans[0].objectives, [{ loId: LO1, field: 'description', old: 'Find slope.', new: 'Find the slope of a line.' }]);
  assert.match(renderDiffMarkdown(r, 'now'), /#### objective lo-1 — description/);
});

test('a recap copy a patch already words the same is not doubled; a different wording is kept and listed', () => {
  const same = validatePatches([file({
    recap: [{ path: 'mustRemember[0]', old: 'Find slope.', new: 'Find the slope of a line.' }],
    [LO1]: [{ path: 'objective.description', old: 'Find slope.', new: 'Find the slope of a line.' }],
  })], lessons());
  assert.equal(same.ok, true);
  assert.deepEqual(codes(same, 'warning'), []);
  assert.deepEqual(same.segments[0].changes.map((c) => c.field), ['mustRemember', 'teacherNote']);
  assert.equal(same.objectiveCopies[0].action, 'already-in-patch');
  const differs = validatePatches([file({
    [LO1]: [{ path: 'objective.description', old: 'Find slope.', new: 'Find the slope of a line.' }],
    recap: [{ path: 'mustRemember[0]', old: 'Find slope.', new: 'Slope of a line.' }],
  })], lessons());
  assert.equal(differs.ok, true);
  assert.deepEqual(codes(differs, 'warning'), ['objective_copy_differs']);
  assert.equal(differs.segments[0].changes.find((c) => c.field === 'mustRemember')?.new, 'Slope of a line.');
  assert.equal(differs.objectiveCopies[0].action, 'listed');
});

test('objective patches: wrong old, unknown id, a second change and a no-op are errors', () => {
  const mk = (segmentId: string, changes: Change[]) => codes(validatePatches([file({ [segmentId]: changes })], lessons()));
  assert.deepEqual(mk(LO1, [{ path: 'objective.description', old: 'Find slopes.', new: 'x' }]), ['old_mismatch']);
  assert.deepEqual(mk(`${PLAN}.lo-9`, [{ path: 'objective.description', old: 'Find slope.', new: 'x' }]), ['unknown_objective']);
  assert.deepEqual(mk(LO1, [{ path: 'objective.description', old: 'Find slope.', new: 'x' }, { path: 'goal', old: 'a', new: 'b' }]), ['objective_shape']);
  assert.deepEqual(mk(LO1, [{ path: 'objective.description', old: 'Find slope.', new: 'Find slope.' }]), ['no_op']);
});

test('expanded plans: status by the expanded plan id; objective 2+ steps are served on neither build', () => {
  const ls = lessons();
  (ls.get('007') as Lesson).pickerPlanId = 'gen-picker';
  const r = validatePatches([file({
    [TRY1]: [{ path: 'expectedAnswer', old: '5', new: '4' }],
    [TRY2]: [{ path: 'problem', old: 'Solve x + 1 = 8.', new: 'Solve x + 2 = 9.' }],
  })], ls, { auditedLessonSteps: new Set([`gen-picker::${TRY2}`]) });
  assert.deepEqual(r.practiceImpact.map((p) => [p.status, p.expanded]), [['objective-1', true], ['neither', true]]);
  assert.match(r.practiceImpact[1].note, /expanded plan: not served as practice on either build/);
  assert.equal(r.segments[0].subject, 'Algebra 2');
});

test('patchFileShapeProblems names what is missing', () => {
  assert.deepEqual(patchFileShapeProblems({ subject: 'X', patches: [], skipped: [] }), []);
  assert.deepEqual(patchFileShapeProblems([]), ['not a JSON object']);
  assert.deepEqual(patchFileShapeProblems({ patches: {} }), ['missing "subject"', '"patches" is not an array']);
});

test('buildApplyData groups by plan, counts, and puts appends last', () => {
  const r = validatePatches([file({
    [WORKED]: [{ path: 'steps[+]', old: null, new: 'Check it.' }, { path: 'steps[2]', old: 'Slope is 6/2 = 4.', new: 'Slope is 6/2 = 3.' }, { path: 'answer', old: '4', new: '3' }],
    [TRY1]: [{ path: 'expectedAnswer', old: '5', new: '4' }],
  })], lessons());
  const data = buildApplyData(r.segments);
  assert.deepEqual(data.counts, { plans: 1, segments: 2, fields: 4, objectives: 0 });
  assert.deepEqual(data.plans[0].segments[0].changes.map((c) => c.append), [false, false, true]);
  assert.equal(data.plans[0].segments[0].kind, 'worked_example');
});

test('the review document shows old and new for every field, grouped by subject and lesson', () => {
  const r = validatePatches([file({ [WORKED]: [{ path: 'answer', old: '4', new: '3' }, { path: 'steps[+]', old: null, new: 'Check ``` it ```.' }] })], lessons());
  const md = renderDiffMarkdown(r, '2026-10-09T00:00:00.000Z');
  assert.match(md, /## Algebra 2\n/);
  assert.match(md, /### Lesson 007 — Sample lesson/);
  assert.match(md, /#### lo-1-worked \(worked_example\)/);
  assert.match(md, /\| Algebra 2 \| 1 \| 0 \| 1 \| 0 \| 2 \|/);
  assert.match(md, /## Practice steps whose question or answer changes/);
  assert.match(md, /\*\*answer\*\*\n\nOld:\n\n```text\n4\n```\n\nNew:\n\n```text\n3\n```/);
  assert.match(md, /Added:\n\n````text\nCheck ``` it ```\.\n````/);
});

test('waivers: only a wording judgement can be waived, with a reason; stale or bad waivers are errors', () => {
  const leak = file({ [TRY2]: [{ path: 'expectedAnswer', old: '7', new: '8' }] });
  const w = { planId: PLAN, segmentId: TRY2, code: 'answer_in_problem', reason: 'The 8 in the stem is the right-hand side, not a give-away.' };
  const waived = validateWithWaivers([leak], lessons(), [w]);
  assert.equal(waived.ok, true);
  assert.deepEqual(codes(waived, 'warning'), ['answer_in_problem_waived']);
  assert.equal(waived.segments.length, 1);
  assert.deepEqual(codes(validateWithWaivers([leak], lessons(), [{ ...w, reason: 'ok' }])).sort(), ['answer_in_problem', 'bad_waiver']);
  assert.deepEqual(codes(validateWithWaivers([leak], lessons(), [{ ...w, segmentId: TRY1 }])).sort(), ['answer_in_problem', 'stale_waiver']);
  const wrongOld = file({ [TRY2]: [{ path: 'expectedAnswer', old: '6', new: '9' }] });
  assert.deepEqual(codes(validateWithWaivers([wrongOld], lessons(), [{ ...w, code: 'old_mismatch' }])).sort(), ['bad_waiver', 'old_mismatch']);
});

test('objective.shortTitle: verified like any field, alone or with the description, never copied into the recap', () => {
  const alone = validatePatches([file({ [LO1]: [{ path: 'objective.shortTitle', old: 'Slope', new: 'Slope of a line' }] })], lessons());
  assert.equal(alone.ok, true);
  assert.deepEqual(alone.objectives.map((o) => [o.field, o.old, o.new]), [['shortTitle', 'Slope', 'Slope of a line']]);
  assert.equal(alone.segments.length, 0);
  assert.deepEqual(alone.objectiveCopies.map((c) => [c.where, c.action]), [['los[].shortTitle', 'changed']]);
  assert.deepEqual(buildApplyData(alone.segments, alone.objectives).counts, { plans: 1, segments: 0, fields: 1, objectives: 1 });
  const both = validatePatches([file({ [LO1]: [
    { path: 'objective.description', old: 'Find slope.', new: 'Find the slope of a line.' },
    { path: 'objective.shortTitle', old: 'Slope', new: 'Slope of a line' },
  ] })], lessons());
  assert.equal(both.ok, true);
  assert.deepEqual(both.objectives.map((o) => o.field), ['description', 'shortTitle']);
  assert.ok(!both.objectiveCopies.some((c) => c.action === 'listed' && c.where === 'los[].shortTitle'));
  const mk = (changes: Change[], seg = LO1) => codes(validatePatches([file({ [seg]: changes })], lessons()));
  assert.deepEqual(mk([{ path: 'objective.shortTitle', old: 'Slopes', new: 'x' }]), ['old_mismatch']);
  assert.deepEqual(mk([{ path: 'objective.shortTitle', old: 'x', new: 'y' }], `${PLAN}.lo-2`), ['old_mismatch']);
  assert.deepEqual(mk([{ path: 'objective.shortTitle', old: 'Slope', new: 'a' }, { path: 'objective.shortTitle', old: 'Slope', new: 'b' }]), ['objective_shape']);
});

test('other places that quote an old objective description (a picker list, a note) are listed, not written', () => {
  const ls = lessons();
  (ls.get('007') as Lesson).segments.splice(1, 0, {
    id: 'pick-los', kind: 'concept', goal: 'Pick.', keyIdeas: [`${LO1}: Find slope.`], references: [{ kind: 'note', content: `1\t${LO1}\tFind slope.` }],
  });
  const r = validatePatches([file({ [LO1]: [{ path: 'objective.description', old: 'Find slope.', new: 'Find the slope of a line.' }] })], ls);
  assert.equal(r.ok, true);
  const listed = r.objectiveCopies.filter((c) => c.action === 'listed').map((c) => c.where);
  assert.deepEqual(listed, ['los[].shortTitle', 'segment pick-los · keyIdeas[0]', 'segment pick-los · references[0].content', 'metadata.availableLOs']);
  assert.ok(!r.segments.some((x) => x.segmentId === 'pick-los'));
});

test('applyDataToDocs applies a data file in memory and refuses a value that is not the old one', () => {
  const r = validatePatches([file({
    [WORKED]: [{ path: 'steps[2]', old: 'Slope is 6/2 = 4.', new: 'Slope is 6/2 = 3.' }, { path: 'steps[+]', old: null, new: 'Check.' }, { path: 'answer', old: '4', new: '3' }],
    [LO1]: [{ path: 'objective.shortTitle', old: 'Slope', new: 'Slope of a line' }],
  })], lessons());
  const data = buildApplyData(r.segments, r.objectives);
  const l = lesson();
  const docs = [{ _id: PLAN, los: l.objectives, segments: l.segments }];
  const out = applyDataToDocs(docs, data);
  assert.deepEqual((out[0].segments as LessonSegment[])[2].steps, ['Rise is 6.', 'Run is 2.', 'Slope is 6/2 = 3.', 'Check.']);
  assert.equal((out[0].los as Array<{ shortTitle?: string }>)[0].shortTitle, 'Slope of a line');
  assert.equal((docs[0].segments as LessonSegment[])[2].answer, '4');
  assert.throws(() => applyDataToDocs(out, data), /not the expected old value/);
});

console.log(`\n${passed} tests passed`);
