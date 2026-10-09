/**
 * Local simulation of the GENERATED mongosh scripts (apply + revert): the
 * script text itself is run in a node `vm` against an in-memory copy of the
 * stored documents built from the local lesson files. No mongo, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/simulate.test.ts
 *
 * Part 1 uses fixture patches over real lessons (every change shape, incl. an
 * appended step). Part 2 runs the REAL patch files end to end when they
 * validate (skipped, and said so, when there are none or they have errors).
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { applyResolved, buildApplyData, recapTeacherNote, validatePatches, type ApplyData, type Lesson, type PatchFile } from './core';
import { makeFakeDb, type FakeDbHandle } from './fake-mongo';
import { LESSON_READ_DIR, loadLessons, loadPatchFiles } from './io';
import { renderScript, type Direction } from './script-template';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

type Doc = Record<string, unknown>;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-fix-sim-'));
let fileNo = 0;
const newPath = (stem: string): string => path.join(tmp, `${stem}-${++fileNo}.json`);

/** A stored document as the collection holds it: the local lesson's segments
 *  plus the null-valued optionals and the fields the local extract left out. */
function storedFromLesson(l: Lesson): Doc {
  return {
    _id: l.planId,
    title: l.title,
    curriculum: 'freestyle',
    los: (l.objectives ?? []).map((o) => ({ ...o })),
    segments: l.segments.map((s) => ({
      id: s.id,
      teacherNote: s.kind === 'recap' ? recapTeacherNote((l.objectives ?? []).map((o) => o.description)) : null,
      estimatedMinutes: null,
      prescribedRender: null,
      requiredPhrases: null,
      ...Object.fromEntries(Object.entries(s).filter(([k]) => k !== 'id')),
      ...(s.kind === 'try_yourself' ? { hints: null, responseFormat: null, choices: null } : {}),
    })),
    metadata: { generatedFromText: true, portalPartnerId: 'greenapple' },
    schemaVersion: 1,
    updatedAt: { $date: '2026-10-02T21:11:07.089Z' },
    __v: 0,
  };
}

interface Built {
  data: ApplyData;
  dataPath: string;
  scripts: Record<Direction, string>;
}

function build(files: PatchFile[], lessons: Map<string, Lesson>, allowErrors = false): Built {
  const v = validatePatches(files, lessons);
  if (!allowErrors) assert.equal(v.ok, true, JSON.stringify(v.issues.filter((i) => i.level === 'error').slice(0, 3)));
  const data = buildApplyData(v.segments, v.objectives);
  const text = `${JSON.stringify(data, null, 1)}\n`;
  const dataPath = newPath('data');
  fs.writeFileSync(dataPath, text);
  const meta = {
    dataSha256: crypto.createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex'),
    dataFileName: 'lesson-corrections.data.json',
    counts: data.counts,
    generatedAt: 'test',
  };
  return { data, dataPath, scripts: { apply: renderScript({ ...meta, direction: 'apply' }), revert: renderScript({ ...meta, direction: 'revert' }) } };
}

interface RunResult {
  out: string[];
  error: Error | null;
}

/** Run a generated script exactly as written, with a fake `db`. */
function run(script: string, handle: FakeDbHandle, env: Record<string, string>): RunResult {
  const out: string[] = [];
  const context = vm.createContext({
    db: handle.db,
    print: (s: unknown) => out.push(String(s)),
    process: { env },
    require: (m: string) => {
      if (m === 'fs') return fs;
      if (m === 'crypto') return crypto;
      if (m === 'path') return path;
      throw new Error(`script required unexpected module ${m}`);
    },
  });
  try {
    vm.runInContext(script, context, { filename: 'generated.mongosh.js' });
    return { out, error: null };
  } catch (err) {
    return { out, error: err as Error };
  }
}

function countsLine(r: RunResult, label: string): string {
  const l = r.out.find((x) => x.startsWith(`${label}: `));
  assert.ok(l, `no "${label}" line in:\n${r.out.join('\n')}`);
  return l as string;
}

/** The documents with the patches applied by the PURE core — the independent
 *  expectation the script's writes are compared against. */
function expectedAfter(docs: Doc[], files: PatchFile[], lessons: Map<string, Lesson>): Doc[] {
  const v = validatePatches(files, lessons);
  const out = JSON.parse(JSON.stringify(docs)) as Doc[];
  for (const s of v.segments) {
    const doc = out.find((d) => d._id === s.planId) as Doc;
    const segs = doc.segments as Array<Record<string, unknown>>;
    const i = segs.findIndex((x) => x.id === s.segmentId);
    segs[i] = applyResolved(segs[i] as never, s.changes);
  }
  for (const o of v.objectives) {
    const doc = out.find((d) => d._id === o.planId) as Doc;
    const lo = (doc.los as Array<{ id: string; description: string }>).find((x) => x.id === o.loId) as { description: string };
    assert.equal(lo.description, o.old);
    lo.description = o.new;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Part 1 — fixture patches over real lessons                          */
/* ------------------------------------------------------------------ */

const allLessons = loadLessons();
const withContent = [...allLessons.values()].filter((l) => l.segments.some((s) => s.kind === 'worked_example'));
assert.ok(withContent.length >= 3, 'need local lessons with content');
const [L1, L2, L3] = withContent;

function seg(l: Lesson, kind: string, nth = 0): Lesson['segments'][number] {
  return l.segments.filter((s) => s.kind === kind)[nth];
}

const OBJ = (L2.objectives ?? [])[1];
assert.ok(OBJ && seg(L2, 'recap') && (seg(L2, 'recap').mustRemember as string[])[1] === OBJ.description, 'fixture lesson needs a recap that copies its objectives');

function fixtureFiles(): PatchFile[] {
  const w = seg(L1, 'worked_example');
  const t = seg(L1, 'try_yourself', 1);
  const c = seg(L1, 'concept', 1);
  const h = seg(L2, 'hook', 1);
  const steps = w.steps as string[];
  return [
    {
      file: 'fixture-a.json',
      subject: 'Fixture A',
      skipped: [],
      patches: [
        { pack: L1.pack, planId: L1.planId, segmentId: w.id, changes: [
          { path: `steps[${steps.length - 1}]`, old: steps[steps.length - 1], new: `${steps[steps.length - 1]} Corrected.` },
          { path: 'steps[+]', old: null, new: 'One more step, added by the fixture.' },
          { path: 'answer', old: w.answer as string, new: `${w.answer as string} corrected` },
        ] },
        { pack: L1.pack, planId: L1.planId, segmentId: t.id, changes: [
          { path: 'problem', old: t.problem as string, new: `${t.problem as string} Show your work.` },
          { path: 'expectedAnswer', old: t.expectedAnswer as string, new: 'fixture-key-zzz' },
        ] },
        { pack: L1.pack, planId: L1.planId, segmentId: c.id, changes: [
          { path: 'keyIdeas[0]', old: (c.keyIdeas as string[])[0], new: 'A corrected key idea from the fixture.' },
        ] },
      ],
    },
    {
      file: 'fixture-b.json',
      subject: 'Fixture B',
      skipped: [],
      patches: [
        { pack: L2.pack, planId: L2.planId, segmentId: h.id, changes: [{ path: 'goal', old: h.goal as string, new: 'A corrected goal from the fixture.' }] },
        // An objective description: also changes recap.mustRemember[1] and recap.teacherNote.
        { pack: L2.pack, planId: L2.planId, segmentId: OBJ.id, changes: [{ path: 'objective.description', old: OBJ.description, new: 'A corrected objective from the fixture.' }] },
      ],
    },
  ];
}

const fixtureDocs = [L1, L2, L3].map(storedFromLesson);
const fx = build(fixtureFiles(), allLessons);
const expected = expectedAfter(fixtureDocs, fixtureFiles(), allLessons);

test('fixture: 2 plans, 5 segments, 10 values (an appended step, an objective description and its two recap copies)', () => {
  assert.deepEqual(fx.data.counts, { plans: 2, segments: 5, fields: 10, objectives: 1 });
  assert.notDeepEqual(expected, fixtureDocs);
});

test('refuses any database but evelyn, a missing DATA, and a data file it was not built with', () => {
  const h = makeFakeDb('greenapple', fixtureDocs);
  assert.match(run(fx.scripts.apply, h, { DATA: fx.dataPath }).error?.message ?? '', /expected "evelyn"/);
  const ok = makeFakeDb('evelyn', fixtureDocs);
  assert.match(run(fx.scripts.apply, ok, {}).error?.message ?? '', /set DATA/);
  const other = newPath('other-data');
  fs.writeFileSync(other, fs.readFileSync(fx.dataPath, 'utf8').replace('fixture-key-zzz', 'fixture-key-yyy'));
  assert.match(run(fx.scripts.apply, ok, { DATA: other, APPLY: '1', BACKUP: newPath('b') }).error?.message ?? '', /not the file this script was built with/);
  assert.equal(h.writes.length + ok.writes.length, 0);
});

test('dry run: counts everything as to-change, writes nothing, makes no backup', () => {
  const h = makeFakeDb('evelyn', fixtureDocs);
  const r = run(fx.scripts.apply, h, { DATA: fx.dataPath });
  assert.equal(r.error, null);
  assert.match(countsLine(r, 'plans'), /2 in the data · to change 2 · already applied 0 · mismatched 0/);
  assert.match(countsLine(r, 'segments'), /5 in the data · to change 5 · already applied 0 · mismatched 0/);
  assert.match(countsLine(r, 'fields'), /10 in the data · to change 10 · already applied 0 · mismatched 0/);
  assert.ok(r.out.some((l) => l.startsWith('DRY RUN')));
  assert.equal(h.writes.length, 0);
  assert.deepEqual(h.docs, fixtureDocs);
});

test('APPLY=1 needs BACKUP, and never overwrites an existing backup file', () => {
  const h = makeFakeDb('evelyn', fixtureDocs);
  assert.match(run(fx.scripts.apply, h, { DATA: fx.dataPath, APPLY: '1' }).error?.message ?? '', /needs BACKUP/);
  const existing = newPath('existing');
  fs.writeFileSync(existing, '[]');
  assert.match(run(fx.scripts.apply, h, { DATA: fx.dataPath, APPLY: '1', BACKUP: existing }).error?.message ?? '', /already exists/);
  assert.equal(fs.readFileSync(existing, 'utf8'), '[]');
  assert.equal(h.writes.length, 0);
});

const applied = makeFakeDb('evelyn', fixtureDocs);
const backupPath = path.join(tmp, 'backup', 'not-yet-a-folder', 'originals.json');

test('apply: backs up the full originals first, then changes exactly the listed fields and nothing else', () => {
  const r = run(fx.scripts.apply, applied, { DATA: fx.dataPath, APPLY: '1', BACKUP: backupPath });
  assert.equal(r.error, null, r.error?.message);
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8')) as Doc[];
  assert.deepEqual(backup, fixtureDocs.filter((d) => d._id === L1.planId || d._id === L2.planId));
  assert.deepEqual(applied.docs, expected);
  // The untouched third plan, every untouched segment, nulls and updatedAt are as they were.
  assert.deepEqual(applied.docs[2], fixtureDocs[2]);
  assert.deepEqual(applied.docs[0].updatedAt, fixtureDocs[0].updatedAt);
  assert.ok(r.out.includes('plans written: 2'));
  assert.ok(r.out.includes('read-back check passed.'));
});

test('apply writes by explicit path only — never a whole document, segment or array', () => {
  for (const w of applied.writes) {
    for (const [op, spec] of Object.entries(w.update as Record<string, Record<string, unknown>>)) {
      assert.ok(['$set', '$push'].includes(op), op);
      for (const [p, v] of Object.entries(spec)) {
        assert.match(p, /^(segments\.\d+\.[A-Za-z]+(\.\d+)?|los\.\d+\.description)$/, p);
        if (op === '$set') assert.equal(typeof v, 'string');
        else assert.ok(Array.isArray((v as { $each: unknown[] }).$each) && (v as { $each: unknown[] }).$each.every((x) => typeof x === 'string'));
      }
    }
    assert.equal(typeof w.filter._id, 'string');
  }
  // 2 plans; the plan with the appended step needs a second update.
  assert.equal(applied.writes.length, 3);
});

test('re-run after apply: everything "already applied", no write, no backup file', () => {
  const again = newPath('backup-again');
  const before = applied.writes.length;
  const r = run(fx.scripts.apply, applied, { DATA: fx.dataPath, APPLY: '1', BACKUP: again });
  assert.equal(r.error, null);
  assert.match(countsLine(r, 'fields'), /to change 0 · already applied 10 · mismatched 0/);
  assert.match(countsLine(r, 'plans'), /to change 0 · already applied 2 · mismatched 0/);
  assert.equal(applied.writes.length, before);
  assert.equal(fs.existsSync(again), false);
  assert.deepEqual(applied.docs, expected);
});

test('a half-applied state finishes: only the fields still at "old" are written', () => {
  const h = makeFakeDb('evelyn', expected);
  // Put one field of one plan back to its old value.
  const doc = h.docs.find((d) => d._id === L2.planId) as Doc;
  const original = fixtureDocs.find((d) => d._id === L2.planId) as Doc;
  doc.segments = JSON.parse(JSON.stringify(original.segments));
  const r = run(fx.scripts.apply, h, { DATA: fx.dataPath, APPLY: '1', BACKUP: newPath('half') });
  assert.match(countsLine(r, 'objective descriptions'), /to change 0 · already applied 1 · mismatched 0/);
  assert.equal(r.error, null);
  assert.match(countsLine(r, 'fields'), /to change 3 · already applied 7 · mismatched 0/);
  assert.equal(h.writes.length, 1);
  assert.deepEqual(h.docs, expected);
});

test('mismatch: ONE stored value that is neither old nor new aborts the whole run before any write', () => {
  const drifted = JSON.parse(JSON.stringify(fixtureDocs)) as Doc[];
  const h0 = seg(L2, 'hook', 1);
  const target = (drifted[1].segments as Array<Record<string, unknown>>).find((s) => s.id === h0.id) as Record<string, unknown>;
  target.goal = `${target.goal as string} (edited by someone else)`;
  const h = makeFakeDb('evelyn', drifted);
  const bk = newPath('never');
  const r = run(fx.scripts.apply, h, { DATA: fx.dataPath, APPLY: '1', BACKUP: bk });
  assert.match(r.error?.message ?? '', /1 stored value\(s\) do not match — aborted before any write/);
  assert.match(countsLine(r, 'fields'), /to change 9 · already applied 0 · mismatched 1/);
  assert.match(countsLine(r, 'plans'), /to change 1 · already applied 0 · mismatched 1/);
  assert.ok(r.out.some((l) => l.includes(h0.id) && l.includes('goal') && l.includes('edited by someone else')));
  assert.equal(h.writes.length, 0);
  assert.deepEqual(h.docs, drifted);
  assert.equal(fs.existsSync(bk), false);
});

test('mismatch: a missing plan, a missing segment, a changed kind and a changed array length are all caught, all listed', () => {
  const broken = JSON.parse(JSON.stringify(fixtureDocs)) as Doc[];
  const segs = broken[0].segments as Array<Record<string, unknown>>;
  const w = seg(L1, 'worked_example');
  const t = seg(L1, 'try_yourself', 1);
  const c = seg(L1, 'concept', 1);
  (segs.find((s) => s.id === w.id) as Record<string, unknown[]>).steps.push('an extra stored step');
  (segs.find((s) => s.id === t.id) as Record<string, unknown>).kind = 'concept';
  segs.splice(segs.findIndex((s) => s.id === c.id), 1);
  const h = makeFakeDb('evelyn', [broken[0], broken[2]]);
  const r = run(fx.scripts.apply, h, { DATA: fx.dataPath });
  assert.match(r.error?.message ?? '', /aborted before any write/);
  const text = r.out.join('\n');
  assert.match(text, /steps\[\+\]: stored array has/);
  assert.match(text, /stored segment kind is "concept", expected try_yourself/);
  assert.match(text, /segment id not found in the stored plan/);
  assert.match(text, /plan not found in the collection/);
  assert.equal(h.writes.length, 0);
});

test('mismatch: an objective description or a recap note that differs in the store aborts the run', () => {
  for (const which of ['los', 'note'] as const) {
    const drifted = JSON.parse(JSON.stringify(fixtureDocs)) as Doc[];
    if (which === 'los') (drifted[1].los as Array<{ description: string }>)[1].description += ' (edited)';
    else ((drifted[1].segments as Array<Record<string, unknown>>).find((x) => x.kind === 'recap') as Record<string, unknown>).teacherNote = 'A hand-written note.';
    const h = makeFakeDb('evelyn', drifted);
    const r = run(fx.scripts.apply, h, { DATA: fx.dataPath, APPLY: '1', BACKUP: newPath('obj') });
    assert.match(r.error?.message ?? '', /1 stored value\(s\) do not match — aborted before any write/);
    assert.ok(r.out.some((l) => l.includes(which === 'los' ? 'objective.description' : 'teacherNote')), r.out.join('\n'));
    assert.equal(h.writes.length, 0);
  }
});

test('a document that changes between the read and the write is left alone and the run stops', () => {
  const h = makeFakeDb('evelyn', fixtureDocs);
  const w = seg(L1, 'worked_example');
  let fired = false;
  h.beforeUpdate = (docs) => {
    if (fired) return;
    fired = true;
    const s = (docs[0].segments as Array<Record<string, unknown>>).find((x) => x.id === w.id) as Record<string, unknown>;
    s.answer = 'rewritten by another writer';
  };
  const r = run(fx.scripts.apply, h, { DATA: fx.dataPath, APPLY: '1', BACKUP: newPath('race') });
  assert.match(r.error?.message ?? '', /STOPPED at lesson .* the document changed after it was read/);
  assert.equal(h.writes.length, 0);
});

test('a segment that moved to another position is found by id, not by its local index', () => {
  const moved = JSON.parse(JSON.stringify(fixtureDocs)) as Doc[];
  const segs = moved[0].segments as Array<Record<string, unknown>>;
  segs.splice(1, 0, { id: 'inserted-by-someone', kind: 'hook', goal: 'An extra stored segment.' });
  const h = makeFakeDb('evelyn', moved);
  const r = run(fx.scripts.apply, h, { DATA: fx.dataPath, APPLY: '1', BACKUP: newPath('moved') });
  assert.equal(r.error, null, r.error?.message);
  const want = expectedAfter(moved, fixtureFiles(), allLessons);
  assert.deepEqual(h.docs, want);
});

test('other stored plans sharing the objectives are listed and never written', () => {
  const clone = { ...JSON.parse(JSON.stringify(fixtureDocs[0])), _id: 'gen-99999999-9999-4999-8999-999999999999' } as Doc;
  const h = makeFakeDb('evelyn', [...fixtureDocs, clone]);
  const r = run(fx.scripts.apply, h, { DATA: fx.dataPath, APPLY: '1', BACKUP: newPath('clone') });
  assert.equal(r.error, null);
  assert.ok(r.out.some((l) => l.startsWith('other stored plans sharing these objectives (NOT written): 1') && l.includes(clone._id as string)));
  assert.deepEqual(h.docs[3], clone);
});

test('revert dry run on applied data: everything to change; on original data: everything already reverted', () => {
  const r = run(fx.scripts.revert, applied, { DATA: fx.dataPath });
  assert.equal(r.error, null);
  assert.match(countsLine(r, 'fields'), /to change 10 · already reverted 0 · mismatched 0/);
  assert.deepEqual(applied.docs, expected);
  const fresh = makeFakeDb('evelyn', fixtureDocs);
  const r2 = run(fx.scripts.revert, fresh, { DATA: fx.dataPath, APPLY: '1', BACKUP: newPath('noop') });
  assert.equal(r2.error, null);
  assert.match(countsLine(r2, 'fields'), /to change 0 · already reverted 10 · mismatched 0/);
  assert.equal(fresh.writes.length, 0);
});

test('revert aborts when a corrected field was edited again afterwards', () => {
  const edited = makeFakeDb('evelyn', expected);
  const t = seg(L1, 'try_yourself', 1);
  ((edited.docs[0].segments as Array<Record<string, unknown>>).find((s) => s.id === t.id) as Record<string, unknown>).expectedAnswer = 'a later edit';
  const r = run(fx.scripts.revert, edited, { DATA: fx.dataPath, APPLY: '1', BACKUP: newPath('rv') });
  assert.match(r.error?.message ?? '', /aborted before any write/);
  assert.equal(edited.writes.length, 0);
});

test('revert: restores exactly the original documents (appended step removed), with its own backup', () => {
  const bk = newPath('revert-backup');
  const r = run(fx.scripts.revert, applied, { DATA: fx.dataPath, APPLY: '1', BACKUP: bk });
  assert.equal(r.error, null, r.error?.message);
  assert.deepEqual(applied.docs, fixtureDocs);
  assert.deepEqual(JSON.parse(fs.readFileSync(bk, 'utf8')), expected.filter((d) => d._id === L1.planId || d._id === L2.planId));
  assert.ok(r.out.includes('read-back check passed.'));
  const again = run(fx.scripts.apply, applied, { DATA: fx.dataPath });
  assert.match(countsLine(again, 'fields'), /to change 10 · already applied 0 · mismatched 0/);
});

/* ------------------------------------------------------------------ */
/* Part 2 — the real patch files, end to end                           */
/* ------------------------------------------------------------------ */

const real = loadPatchFiles();
const realValidation = real.loadIssues.length === 0 ? validatePatches(real.files, allLessons) : null;
if (!realValidation || realValidation.segments.length === 0) {
  console.log(`skip - real patch files: ${real.files.length} file(s) loaded, ${real.loadIssues.length} load error(s), no valid patch to run`);
} else {
  // Patches with a validation error are left out here exactly as the pure
  // core leaves them out; build-apply-script.ts refuses to build at all
  // while any error stands.
  if (!realValidation.ok) console.log(`note - ${realValidation.totals.errors} real patch error(s): simulating the ${realValidation.segments.length} patches that validate`);
  const docs = [...allLessons.values()].map(storedFromLesson);
  const built = build(real.files, allLessons, true);
  const want = expectedAfter(docs, real.files, allLessons);
  const h = makeFakeDb('evelyn', docs);
  test(`final patches over the local lessons (${built.data.counts.plans} plans / ${built.data.counts.segments} segments / ${built.data.counts.fields} values): dry run → apply → re-run → revert`, () => {
    const total = built.data.counts.fields;
    const dry = run(built.scripts.apply, h, { DATA: built.dataPath });
    assert.equal(dry.error, null, dry.error?.message);
    assert.match(countsLine(dry, 'fields'), new RegExp(`${total} in the data · to change ${total} · already applied 0 · mismatched 0`));
    assert.equal(h.writes.length, 0);
    const bk = newPath('real-backup');
    const ap = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: bk });
    assert.equal(ap.error, null, ap.error?.message);
    assert.deepEqual(h.docs, want);
    assert.equal((JSON.parse(fs.readFileSync(bk, 'utf8')) as Doc[]).length, built.data.counts.plans);
    const writes = h.writes.length;
    const re = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('real-again') });
    assert.equal(re.error, null);
    assert.match(countsLine(re, 'fields'), new RegExp(`to change 0 · already applied ${total} · mismatched 0`));
    assert.equal(h.writes.length, writes);
    const rv = run(built.scripts.revert, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('real-revert') });
    assert.equal(rv.error, null, rv.error?.message);
    assert.deepEqual(h.docs, docs);
  });
}

/* ------------------------------------------------------------------ */
/* Part 3 — the real patches against a real dump of the stored plans   */
/* ------------------------------------------------------------------ */

// A read-only export of the stored documents taken on 2026-10-06 (local
// file). It proves the path mapping on the REAL stored shape; it does not
// prove the collection still holds these values today — the dry run does.
const DUMP = process.env.LESSON_DUMP ?? path.join(LESSON_READ_DIR, '../audited-list-2026-10-06/work/prod-dump.json');
if (!fs.existsSync(DUMP) || !realValidation || realValidation.segments.length === 0) {
  console.log('skip - stored-shape run: no local dump of the stored plans, or no valid patches');
} else {
  const dump = JSON.parse(fs.readFileSync(DUMP, 'utf8')) as { dumpedAt?: string; plans: Doc[] };
  const built = build(real.files, allLessons, true);
  const h = makeFakeDb('evelyn', dump.plans);
  const c = built.data.counts;
  const total = c.fields;
  const lines: string[] = [];
  const keep = (label: string, r: RunResult): void => { lines.push(`  ${label}: ${countsLine(r, 'plans')} | ${countsLine(r, 'fields')}`); };
  test(`final patches against the stored documents as dumped ${dump.dumpedAt ?? '?'} (${dump.plans.length} plans; ${c.plans} plans / ${c.segments} segments / ${total} values, ${c.objectives} objective descriptions)`, () => {
    assert.equal(realValidation.ok, true, 'the final patches must validate with no error');
    const dry = run(built.scripts.apply, h, { DATA: built.dataPath });
    assert.equal(dry.error, null, `${dry.error?.message}\n${dry.out.slice(0, 12).join('\n')}`);
    assert.match(countsLine(dry, 'fields'), new RegExp(`${total} in the data · to change ${total} · already applied 0 · mismatched 0`));
    assert.equal(h.writes.length, 0);
    keep('dry run ', dry);
    const ap = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('dump-backup') });
    assert.equal(ap.error, null, ap.error?.message);
    assert.ok(ap.out.includes(`plans written: ${c.plans}`) && ap.out.includes('read-back check passed.'));
    assert.deepEqual(h.docs, expectedAfter(dump.plans, real.files, allLessons));
    const untouched = (docs: Doc[]): Doc[] => docs.filter((d) => !built.data.plans.some((p) => p.planId === d._id));
    assert.deepEqual(untouched(h.docs), untouched(dump.plans));
    lines.push(`  apply   : ${ap.out.filter((l) => l.startsWith('plans written') || l.startsWith('after') || l.startsWith('read-back')).join(' | ')}`);
    const writes = h.writes.length;
    const re = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('dump-again') });
    assert.equal(re.error, null);
    assert.match(countsLine(re, 'fields'), new RegExp(`to change 0 · already applied ${total} · mismatched 0`));
    assert.equal(h.writes.length, writes);
    keep('re-run  ', re);
    const rv = run(built.scripts.revert, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('dump-revert') });
    assert.equal(rv.error, null, rv.error?.message);
    assert.deepEqual(h.docs, dump.plans);
    keep('revert  ', rv);
  });
  test('stored-shape run: one drifted stored value (a try_yourself key in an expanded plan) aborts everything before any write', () => {
    const drift = JSON.parse(JSON.stringify(dump.plans)) as Doc[];
    const target = [...built.data.plans].reverse().find((p) => p.segments.some((x) => x.kind === 'try_yourself' && x.changes.some((ch) => ch.index === null)));
    assert.ok(target);
    const tSeg = (target as ApplyData['plans'][number]).segments.find((x) => x.kind === 'try_yourself' && x.changes.some((ch) => ch.index === null)) as ApplyData['plans'][number]['segments'][number];
    const field = (tSeg.changes.find((ch) => ch.index === null) as { field: string }).field;
    const doc = drift.find((d) => d._id === (target as { planId: string }).planId) as Doc;
    ((doc.segments as Array<Record<string, unknown>>).find((x) => x.id === tSeg.segmentId) as Record<string, unknown>)[field] = 'changed in the store since the read';
    const hd = makeFakeDb('evelyn', drift);
    const bk = newPath('dump-never');
    const r = run(built.scripts.apply, hd, { DATA: built.dataPath, APPLY: '1', BACKUP: bk });
    assert.match(r.error?.message ?? '', /1 stored value\(s\) do not match — aborted before any write/);
    assert.match(countsLine(r, 'fields'), new RegExp(`to change ${total - 1} · already applied 0 · mismatched 1`));
    assert.equal(hd.writes.length, 0);
    assert.equal(fs.existsSync(bk), false);
    assert.deepEqual(hd.docs, drift);
    lines.push(`  mismatch: ${countsLine(r, 'fields')} | ${r.error?.message}`);
  });
  console.log(`stored-shape simulation (dump ${dump.dumpedAt}):\n${lines.join('\n')}`);
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${passed} tests passed`);
