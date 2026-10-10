/**
 * Local simulation of the GENERATED "add objectives" mongosh scripts (apply
 * + revert): the script text itself is run in a node `vm` against an
 * in-memory copy of the 10-06 dump patched to the post-correction state
 * (the committed corrections data applied in memory). Synthetic writer files
 * for three packs. No mongo, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/add-simulate.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { buildAddData, buildPlanData, expectedAfter, validateWritten, type AddData, type AddPack } from './add-core';
import { syntheticWritten } from './add-fixtures';
import { applyCorrections, CORRECTION_FILES, loadDumpPlans, loadPacks, loadPreStates, REQUIRES, TOOLING_DIR } from './add-io';
import { ADD_SCRIPT_NAMES } from './add-script-template';
import { renderAddScript, type AddDirection } from './add-script-template';
import { makeFakeDb, type FakeDbHandle } from './fake-mongo';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

type Doc = Record<string, unknown>;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-add-sim-'));
let fileNo = 0;
const newPath = (stem: string): string => path.join(tmp, `${stem}-${++fileNo}.json`);

const packs = loadPacks();
const pre = loadPreStates();
const rawDump = loadDumpPlans();
/** Every dumped plan (360), correction sets 1–3 applied: the collection as
 *  stored when the additions run. */
const collection: Doc[] = [...applyCorrections(rawDump).values()];
assert.equal(collection.length, 360);

// 315: three objectives to add (8 after) · 317: one · 332: two.
const PACKS = ['315', '317', '332'];
const chosen = PACKS.map((id) => packs.get(id) as AddPack);
assert.deepEqual(chosen.map((p) => p.missingObjectives.length), [3, 1, 2]);

function build(list: AddPack[]): { data: AddData; dataPath: string; scripts: Record<AddDirection, string> } {
  const plans = list.map((p) => {
    const file = validateWritten(syntheticWritten(p), p).file;
    assert.ok(file);
    const state = pre.get(p.planId);
    assert.ok(state);
    return buildPlanData(p, state, file);
  });
  const data = buildAddData(plans, REQUIRES);
  const text = `${JSON.stringify(data, null, 1)}\n`;
  const dataPath = newPath('data');
  fs.writeFileSync(dataPath, text);
  const meta = { dataSha256: crypto.createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex'), dataFileName: 'lesson-additions.data.json', counts: data.counts, generatedAt: 'test' };
  return { data, dataPath, scripts: { apply: renderAddScript({ ...meta, direction: 'apply' }), revert: renderAddScript({ ...meta, direction: 'revert' }) } };
}

interface RunResult { out: string[]; error: Error | null }

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

const built = build(chosen);
const ids = chosen.map((p) => p.planId);
const byId = (docs: Doc[], id: string): Doc => docs.find((d) => d._id === id) as Doc;
const expected = (): Doc[] => collection.map((d) => {
  const plan = built.data.plans.find((p) => p.planId === d._id);
  return plan ? expectedAfter(d, plan) : (JSON.parse(JSON.stringify(d)) as Doc);
});
const plansLine = (r: RunResult): string => r.out.find((l) => l.startsWith('plans: ') || l.startsWith('after — plans: ')) as string;
const fresh = (): FakeDbHandle => makeFakeDb('evelyn', collection);
const applied = (): FakeDbHandle => {
  const h = fresh();
  const r = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.equal(r.error, null, r.error?.message);
  h.writes.length = 0;
  return h;
};

test('guards: database name, data file identity, backup rules', () => {
  const wrongDb = run(built.scripts.apply, makeFakeDb('evelyn_staging', collection), { DATA: built.dataPath });
  assert.match(String(wrongDb.error?.message), /expected "evelyn"/);
  assert.match(String(run(built.scripts.apply, fresh(), {}).error?.message), /set DATA/);
  const other = newPath('other');
  fs.writeFileSync(other, fs.readFileSync(built.dataPath, 'utf8').replace('Synthetic hook', 'Synthetic  hook'));
  assert.match(String(run(built.scripts.apply, fresh(), { DATA: other }).error?.message), /not the file this script was built with/);
  const h = fresh();
  assert.match(String(run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1' }).error?.message), /needs BACKUP/);
  const existing = newPath('existing');
  fs.writeFileSync(existing, '[]');
  assert.match(String(run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: existing }).error?.message), /already exists/);
  assert.equal(h.writes.length, 0);
});

test('dry run: reports 3 plans / 6 objectives / 24 segments to add, the picker check, and writes nothing', () => {
  const h = fresh();
  const r = run(built.scripts.apply, h, { DATA: built.dataPath });
  assert.equal(r.error, null, r.error?.message);
  assert.match(r.out[0], /DRY RUN/);
  assert.match(plansLine(r), /3 in the data · to change 3 · already applied 0 · mismatched 0 — objectives to add 6, segments 24/);
  assert.ok(r.out.includes('picker plans (read only): 3 of 3 list the added objectives exactly as the data'));
  assert.ok(r.out.includes('other stored plans carrying these objectives (NOT written): 0'));
  assert.ok(!r.out.some((l) => l.startsWith('NOTE')));
  assert.equal(h.writes.length, 0);
  assert.deepEqual(h.docs, collection);
});

test('apply: documents equal the independent expectation; only targeted operators; full-document backup; read-back passes', () => {
  const h = fresh();
  const backup = newPath('backup');
  const r = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: backup });
  assert.equal(r.error, null, r.error?.message);
  assert.ok(r.out.includes('plans written: 3'));
  assert.ok(r.out.includes('read-back check passed.'));
  assert.deepEqual(h.docs, expected());
  // Key order too: what a later reader of the document sees.
  for (const id of ids) assert.equal(JSON.stringify(byId(h.docs, id)), JSON.stringify(byId(expected(), id)));
  assert.deepEqual(JSON.parse(fs.readFileSync(backup, 'utf8')), ids.map((id) => byId(collection, id)));
  assert.equal(h.writes.length, 6); // two updates per plan
  for (const w of h.writes) {
    assert.ok(ids.includes(w.filter._id as string));
    for (const [op, spec] of Object.entries(w.update)) {
      assert.ok(['$set', '$push'].includes(op), op);
      for (const p of Object.keys(spec as Doc)) {
        // Never a whole document, never `segments` or `los` by $set, never updatedAt.
        if (op === '$set') assert.match(p, /^(segments\.\d+\.(goal|teacherNote)|estimatedMinutes|metadata\.(allowedMaxLOs|addedLoIds))$/);
        else assert.match(p, /^(los|segments|segments\.\d+\.mustRemember|metadata\.pickedLoIds)$/);
      }
    }
  }
  const segPush = h.writes.filter((w) => (w.update.$push as Doc | undefined)?.segments);
  assert.equal(segPush.length, 3);
  for (const w of segPush) assert.equal(((w.update.$push as Doc).segments as Doc).$position, 21);
  // Head first, segments second — the only in-between state is "objectives listed, segments absent".
  assert.ok((h.writes[0].update.$push as Doc).los && (h.writes[1].update.$push as Doc).segments);
  const d = byId(h.docs, ids[0]);
  assert.equal((d.los as unknown[]).length, 8);
  assert.equal((d.segments as unknown[]).length, 34);
  assert.equal(d.estimatedMinutes, 45);
  assert.deepEqual(d.updatedAt, byId(collection, ids[0]).updatedAt);
});

test('re-run after apply: everything already applied, no write, no backup file', () => {
  const h = applied();
  const backup = newPath('backup');
  const r = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: backup });
  assert.equal(r.error, null, r.error?.message);
  assert.match(plansLine(r), /to change 0 · already applied 3 · mismatched 0/);
  assert.ok(r.out.includes('Nothing to change — no backup written, nothing written.'));
  assert.equal(h.writes.length, 0);
  assert.equal(fs.existsSync(backup), false);
});

test('mismatch in ONE plan aborts everything before any write (each guarded field)', () => {
  const cases: Array<[string, (d: Doc) => void, RegExp]> = [
    ['objective description', (d) => { (d.los as Array<{ description: string }>)[2].description += ' (edited)'; }, /los: stored value differs/],
    ['objective removed', (d) => { (d.los as unknown[]).pop(); }, /los: stored value differs/],
    ['segment order', (d) => { const s = d.segments as Doc[]; [s[3], s[4]] = [s[4], s[3]]; }, /segment ids are neither/],
    ['segment missing', (d) => { (d.segments as Doc[]).splice(5, 1); }, /segment ids are neither/],
    ['segment kind', (d) => { (d.segments as Doc[])[4].kind = 'concept'; }, /segment kinds differ/],
    ['recap note', (d) => { const s = d.segments as Doc[]; s[s.length - 1].teacherNote = 'Recap.'; }, /segments\[recap\]\.teacherNote: stored value differs/],
    ['recap mustRemember', (d) => { const s = d.segments as Doc[]; (s[s.length - 1].mustRemember as string[])[0] = 'x'; }, /segments\[recap\]\.mustRemember: stored value differs/],
    ['intro goal', (d) => { (d.segments as Doc[])[0].goal = 'Hello.'; }, /segments\[intro\]\.goal: stored value differs/],
    ['estimatedMinutes', (d) => { d.estimatedMinutes = 25; }, /estimatedMinutes: stored value differs/],
    ['pickedLoIds', (d) => { ((d.metadata as Doc).pickedLoIds as string[]).reverse(); }, /metadata\.pickedLoIds: stored value differs/],
    ['allowedMaxLOs', (d) => { (d.metadata as Doc).allowedMaxLOs = 6; }, /metadata\.allowedMaxLOs: stored value differs/],
    ['availableLOs', (d) => { ((d.metadata as Doc).availableLOs as Array<{ description: string }>)[5].description = 'x'; }, /metadata\.availableLOs: stored list of available objectives differs/],
    ['became a picker plan', (d) => { (d.metadata as Doc).pendingPicker = true; }, /is a picker plan/],
    ['no recap at the end', (d) => { (d.segments as Doc[]).push({ id: 'extra', kind: 'hook', goal: 'x' }); }, /does not start with intro and end with recap/],
    ['new segments present but head not extended', (d) => {
      const plan = built.data.plans.find((p) => p.planId === d._id);
      assert.ok(plan);
      (d.segments as Doc[]).splice(21, 0, ...(JSON.parse(JSON.stringify(plan.add.segments)) as Doc[]));
    }, /not a state this script produces/],
  ];
  for (const [name, mutate, re] of cases) {
    const h = fresh();
    mutate(byId(h.docs, ids[1]));
    const snapshot = JSON.parse(JSON.stringify(h.docs)) as Doc[];
    const backup = newPath('backup');
    const r = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: backup });
    assert.match(String(r.error?.message), /aborted before any write/, name);
    assert.ok(r.out.some((l) => re.test(l)), `${name}: ${r.out.filter((l) => l.startsWith('  lesson')).join(' | ')}`);
    assert.match(plansLine(r), /mismatched 1/, name);
    assert.equal(h.writes.length, 0, name);
    assert.deepEqual(h.docs, snapshot, name);
    assert.equal(fs.existsSync(backup), false, name);
  }
});

test('mismatch: plan missing; picker plan missing or worded differently (read only) — nothing written', () => {
  const gone = makeFakeDb('evelyn', collection.filter((d) => d._id !== ids[2]));
  const r1 = run(built.scripts.apply, gone, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.ok(r1.out.some((l) => /plan not found in the collection/.test(l)));
  assert.equal(gone.writes.length, 0);
  const noPicker = makeFakeDb('evelyn', collection.filter((d) => d._id !== chosen[0].pickerPlanId));
  const r2 = run(built.scripts.apply, noPicker, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.ok(r2.out.some((l) => /picker plan not found/.test(l)));
  assert.equal(noPicker.writes.length, 0);
  const reworded = fresh();
  (byId(reworded.docs, chosen[0].pickerPlanId).los as Array<{ description: string }>)[6].description = 'Reworded.';
  const r3 = run(built.scripts.apply, reworded, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.ok(r3.out.some((l) => /picker plan words this objective differently/.test(l)));
  assert.match(String(r3.error?.message), /aborted before any write/);
  assert.equal(reworded.writes.length, 0);
});

test('existing teaching text that is not the expected text aborts the apply before any write, naming the segments (uncorrected dump)', () => {
  // The raw 10-06 dump: structure identical, corrected fields differ.
  const h = makeFakeDb('evelyn', [...rawDump.values()]);
  const r = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.match(String(r.error?.message), /aborted before any write/);
  assert.ok(r.out.some((l) => /lesson 315 .*\(existing text\): stored teaching text of \d+ existing segment\(s\) is not the expected text \(lo-[^)]*\) — this script needs the lesson corrections sets 1–3 applied first/.test(l)), r.out.join('\n'));
  assert.ok(r.out.some((l) => l.startsWith('LIKELY CAUSE')));
  assert.equal(h.writes.length, 0);
});

test('a document changed between the read and the write is not written; the run stops and says where', () => {
  const h = fresh();
  let calls = 0;
  h.beforeUpdate = (docs) => {
    calls += 1;
    if (calls === 3) (byId(docs, ids[1]).los as Array<{ id: string }>).push({ id: 'someone-else' });
  };
  const r = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.match(String(r.error?.message), /STOPPED at lesson 317 .*changed after it was read.*1 plan\(s\) were fully written/);
  assert.equal(h.writes.length, 2);
  assert.equal(JSON.stringify(byId(h.docs, ids[0])), JSON.stringify(byId(expected(), ids[0])));
  assert.deepEqual(byId(h.docs, ids[2]), byId(collection, ids[2]));
});

test('interrupted between a plan\'s two updates: the re-run sees it half-written and completes it; revert also accepts that state', () => {
  const h = fresh();
  let calls = 0;
  h.beforeUpdate = () => {
    calls += 1;
    if (calls === 2) throw new Error('connection lost');
  };
  const r = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.match(String(r.error?.message), /connection lost/);
  const half = byId(h.docs, ids[0]);
  assert.equal((half.los as unknown[]).length, 8);
  assert.equal((half.segments as unknown[]).length, 22);
  h.beforeUpdate = undefined;
  const halfDocs = JSON.parse(JSON.stringify(h.docs)) as Doc[];

  const dry = run(built.scripts.apply, h, { DATA: built.dataPath });
  assert.match(plansLine(dry), /to change 3 \(1 of them half-written by an interrupted run\) · already applied 0 · mismatched 0/);
  const again = run(built.scripts.apply, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.equal(again.error, null, again.error?.message);
  assert.deepEqual(h.docs, expected());

  const h2 = makeFakeDb('evelyn', halfDocs);
  const rev = run(built.scripts.revert, h2, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.equal(rev.error, null, rev.error?.message);
  assert.match(plansLine(rev), /to change 1 \(1 of them half-written/);
  assert.equal(JSON.stringify(h2.docs), JSON.stringify(collection));
});

test('revert: dry run writes nothing; apply restores every document exactly; re-run is a no-op', () => {
  const h = applied();
  const dry = run(built.scripts.revert, h, { DATA: built.dataPath });
  assert.equal(dry.error, null, dry.error?.message);
  assert.match(plansLine(dry), /to change 3 · already reverted 0 · mismatched 0 — objectives to remove 6, segments 24/);
  assert.equal(h.writes.length, 0);
  const backup = newPath('backup');
  const r = run(built.scripts.revert, h, { DATA: built.dataPath, APPLY: '1', BACKUP: backup });
  assert.equal(r.error, null, r.error?.message);
  assert.ok(r.out.includes('read-back check passed.'));
  assert.equal(JSON.stringify(h.docs), JSON.stringify(collection)); // exact, key order included
  assert.deepEqual(JSON.parse(fs.readFileSync(backup, 'utf8')), ids.map((id) => byId(expected(), id)));
  for (const w of h.writes) for (const op of Object.keys(w.update)) assert.ok(['$set', '$pull', '$unset'].includes(op), op);
  // Segments out first, head second.
  assert.ok((h.writes[0].update.$pull as Doc).segments && (h.writes[1].update.$pull as Doc).los);
  h.writes.length = 0;
  const again = run(built.scripts.revert, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.match(plansLine(again), /to change 0 · already reverted 3/);
  assert.equal(h.writes.length, 0);
});

test('revert refuses when an added segment was edited after the apply; apply then also reports it', () => {
  const h = applied();
  (byId(h.docs, ids[0]).segments as Doc[])[22].goal = 'Edited by hand.';
  const snapshot = JSON.parse(JSON.stringify(h.docs)) as Doc[];
  const r = run(built.scripts.revert, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.match(String(r.error?.message), /aborted before any write/);
  assert.ok(r.out.some((l) => /stored new segment differs from the data/.test(l)));
  assert.deepEqual(h.docs, snapshot);
  assert.match(String(run(built.scripts.apply, h, { DATA: built.dataPath }).error?.message), /aborted before any write/);
});

test('a corrected existing segment after the apply does not block the revert (existing text is never part of the guard)', () => {
  const h = applied();
  (byId(h.docs, ids[0]).segments as Doc[])[2].goal = 'Corrected later.';
  const r = run(built.scripts.revert, h, { DATA: built.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.equal(r.error, null, r.error?.message);
  assert.ok(r.out.some((l) => /^NOTE lesson 315 .*1 existing segment\(s\) is not the expected text \(lo-1-concept\)/.test(l)));
  assert.equal((byId(h.docs, ids[0]).segments as Doc[])[2].goal, 'Corrected later.');
  assert.equal((byId(h.docs, ids[0]).segments as Doc[]).length, 22);
});

test('all 45 packs at once (synthetic text): apply then revert returns the collection exactly', () => {
  const all = build([...packs.values()]);
  assert.deepEqual(all.data.counts, { plans: 45, objectives: 65, segments: 260 });
  const h = fresh();
  const a = run(all.scripts.apply, h, { DATA: all.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.equal(a.error, null, a.error?.message);
  assert.equal(h.writes.length, 90);
  const counts = h.docs.filter((d) => all.data.plans.some((p) => p.planId === d._id)).map((d) => (d.los as unknown[]).length);
  assert.deepEqual([6, 7, 8].map((n) => counts.filter((c) => c === n).length), [31, 8, 6]);
  const r = run(all.scripts.revert, h, { DATA: all.dataPath, APPLY: '1', BACKUP: newPath('backup') });
  assert.equal(r.error, null, r.error?.message);
  assert.equal(JSON.stringify(h.docs), JSON.stringify(collection));
});

/* ------------------------------------------------------------------ */
/* Part 2 — the BUILT files in tooling/ (the real written text)        */
/* ------------------------------------------------------------------ */

const realData = path.join(TOOLING_DIR, 'lesson-additions.data.json');
if (!fs.existsSync(realData)) {
  console.log('skip - part 2: no built files in tooling/ (run build-add-script.ts)');
} else {
  const real = JSON.parse(fs.readFileSync(realData, 'utf8')) as AddData;
  const scripts = { apply: fs.readFileSync(path.join(TOOLING_DIR, ADD_SCRIPT_NAMES.apply), 'utf8'), revert: fs.readFileSync(path.join(TOOLING_DIR, ADD_SCRIPT_NAMES.revert), 'utf8') };
  const realIds = real.plans.map((p) => p.planId);
  const realExpected = collection.map((d) => {
    const plan = real.plans.find((p) => p.planId === d._id);
    return plan ? expectedAfter(d, plan) : (JSON.parse(JSON.stringify(d)) as Doc);
  });
  const n = real.counts;

  test(`built files: dry run against dump + sets 1–3 — ${n.plans} plans, ${n.objectives} objectives, ${n.segments} segments to add, no mismatch, no note, nothing written`, () => {
    const h = fresh();
    const r = run(scripts.apply, h, { DATA: realData });
    assert.equal(r.error, null, `${r.error?.message}\n${r.out.join('\n')}`);
    assert.ok(plansLine(r).includes(`${n.plans} in the data · to change ${n.plans} · already applied 0 · mismatched 0 — objectives to add ${n.objectives}, segments ${n.segments}`), plansLine(r));
    assert.ok(r.out.includes(`picker plans (read only): ${n.plans} of ${n.plans} list the added objectives exactly as the data`));
    assert.ok(r.out.includes('other stored plans carrying these objectives (NOT written): 0'));
    assert.ok(!r.out.some((l) => l.startsWith('NOTE')));
    assert.equal(h.writes.length, 0);
    console.log(`     ${plansLine(r)}`);
  });

  test('built files: BEFORE set 3 is applied (dump + sets 1–2) the apply aborts before any write and says which set is missing', () => {
    const before3 = [...applyCorrections(rawDump, CORRECTION_FILES.slice(0, 2)).values()];
    const h = makeFakeDb('evelyn', before3);
    const backup = newPath('backup');
    const r = run(scripts.apply, h, { DATA: realData, APPLY: '1', BACKUP: backup });
    assert.match(String(r.error?.message), /6 stored value\(s\) do not match — aborted before any write/);
    const lines = r.out.filter((l) => l.startsWith('  lesson'));
    assert.deepEqual(lines.map((l) => l.slice(9, 12)), ['323', '339', '344', '353', '354', '358']);
    for (const l of lines) assert.match(l, /\(existing text\): stored teaching text of \d existing segment\(s\) is not the expected text \(lo-.*\) — this script needs the lesson corrections sets 1–3 applied first \(the last one: .*lesson-corrections-3\.data\.json\)/);
    assert.ok(r.out.some((l) => /^LIKELY CAUSE for 6 of them: an earlier correction set is not applied yet/.test(l)));
    assert.ok(plansLine(r).includes('to change 39 · already applied 0 · mismatched 6'), plansLine(r));
    assert.equal(h.writes.length, 0);
    assert.deepEqual(h.docs, before3);
    assert.equal(fs.existsSync(backup), false);
    console.log(`     ${plansLine(r)}`);
    console.log(`     ${lines[0].trim().slice(0, 230)}…`);
    console.log(`     ${r.error?.message}`);
  });

  test('built files: also aborts on the raw dump and on dump + set 1 only', () => {
    for (const files of [[], CORRECTION_FILES.slice(0, 1)]) {
      const h = makeFakeDb('evelyn', [...applyCorrections(rawDump, files).values()]);
      const r = run(scripts.apply, h, { DATA: realData, APPLY: '1', BACKUP: newPath('backup') });
      assert.match(String(r.error?.message), /aborted before any write/);
      assert.equal(h.writes.length, 0);
    }
  });

  test('built files: apply = independent expectation (key order too); re-run no-op; interrupted run completed by re-run; revert exact', () => {
    const h = fresh();
    const backup = newPath('backup');
    const a = run(scripts.apply, h, { DATA: realData, APPLY: '1', BACKUP: backup });
    assert.equal(a.error, null, a.error?.message);
    assert.ok(a.out.includes(`plans written: ${n.plans}`) && a.out.includes('read-back check passed.'));
    assert.equal(JSON.stringify(h.docs), JSON.stringify(realExpected));
    assert.equal(h.writes.length, 2 * n.plans);
    assert.deepEqual(JSON.parse(fs.readFileSync(backup, 'utf8')), realIds.map((id) => byId(collection, id)));
    const untouched = h.docs.filter((d) => !realIds.includes(d._id as string));
    assert.equal(JSON.stringify(untouched), JSON.stringify(collection.filter((d) => !realIds.includes(d._id as string))));
    console.log(`     ${a.out.find((l) => l.startsWith('after — ')) as string}`);

    h.writes.length = 0;
    const again = run(scripts.apply, h, { DATA: realData, APPLY: '1', BACKUP: newPath('backup') });
    assert.ok(plansLine(again).includes(`to change 0 · already applied ${n.plans} · mismatched 0`));
    assert.equal(h.writes.length, 0);
    console.log(`     re-run: ${plansLine(again)}`);

    // Interrupted after 7 updates: three plans done, the fourth half-written.
    const h2 = fresh();
    let calls = 0;
    h2.beforeUpdate = () => { calls += 1; if (calls === 8) throw new Error('connection lost'); };
    const cut = run(scripts.apply, h2, { DATA: realData, APPLY: '1', BACKUP: newPath('backup') });
    assert.match(String(cut.error?.message), /connection lost/);
    h2.beforeUpdate = undefined;
    const dry = run(scripts.apply, h2, { DATA: realData });
    assert.ok(plansLine(dry).includes(`to change ${n.plans - 3} (1 of them half-written by an interrupted run) · already applied 3 · mismatched 0`), plansLine(dry));
    console.log(`     interrupted, then dry run: ${plansLine(dry)}`);
    const done = run(scripts.apply, h2, { DATA: realData, APPLY: '1', BACKUP: newPath('backup') });
    assert.equal(done.error, null, done.error?.message);
    assert.equal(JSON.stringify(h2.docs), JSON.stringify(realExpected));

    h.writes.length = 0;
    const rev = run(scripts.revert, h, { DATA: realData, APPLY: '1', BACKUP: newPath('backup') });
    assert.equal(rev.error, null, rev.error?.message);
    assert.equal(JSON.stringify(h.docs), JSON.stringify(collection));
    console.log(`     revert: ${plansLine(rev)} → collection identical to before`);
  });

  test('built files: a mismatch in one plan (objective reworded) aborts all of them', () => {
    const h = fresh();
    (byId(h.docs, realIds[10]).los as Array<{ description: string }>)[0].description += '!';
    const r = run(scripts.apply, h, { DATA: realData, APPLY: '1', BACKUP: newPath('backup') });
    assert.match(String(r.error?.message), /aborted before any write/);
    assert.equal(h.writes.length, 0);
  });
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${passed} passed`);
