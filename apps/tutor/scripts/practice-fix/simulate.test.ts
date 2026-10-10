/**
 * Local simulation of the GENERATED mongosh scripts (apply + revert): the
 * script text itself is run in a node `vm` against an in-memory copy of the
 * collection built from older-bank-rows.json. No mongo, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/practice-fix/simulate.test.ts
 *
 * Part 1 renders the scripts from the validated fixes.json in memory.
 * Part 2 runs the SHIPPED files in the tooling folder (when they are built)
 * and checks they are what part 1 rendered.
 *
 * The fake `db` is the lesson tooling's (scripts/lesson-fix/fake-mongo.ts),
 * reused by import: its one collection is exposed here as `problembanks`.
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { makeFakeDb } from '../lesson-fix/fake-mongo';
import { applyChanges, buildApplyData, type ApplyData, type BankRow } from './core';
import { DATA_FILE, TOOLING_DIR, loadRows, scriptFile, validateAll } from './io';
import { renderScript, type Direction } from './script-template';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

type Doc = Record<string, unknown>;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'practice-fix-sim-'));
let fileNo = 0;
const newPath = (stem: string): string => path.join(tmp, `${stem}-${++fileNo}.json`);

/** A stored document as the collection holds it: the exported fields plus an
 *  `_id` and the fields the export left out (never to be touched). */
function storedFromRow(r: BankRow, n: number): Doc {
  return {
    _id: `oid-${String(n).padStart(5, '0')}`,
    ...JSON.parse(JSON.stringify(r)),
    license: 'proprietary',
    verifiedAt: '2026-10-05T00:00:00.000Z',
    verifierModel: 'verifier',
    embedding: [0.1, 0.2],
    updatedAt: r.createdAt ?? '2026-10-05T00:00:00.000Z',
    __v: 0,
  };
}

interface Handle {
  db: { getName(): string; problembanks: unknown };
  docs: Doc[];
  writes: Array<{ filter: Record<string, unknown>; update: Record<string, unknown> }>;
  beforeUpdate?: (docs: Doc[]) => void;
}
function fakeDb(name: string, docs: readonly Doc[]): Handle {
  const h = makeFakeDb(name, docs);
  const handle: Handle = {
    db: { getName: h.db.getName, problembanks: h.db.lessonplans },
    docs: h.docs,
    writes: h.writes,
  };
  Object.defineProperty(handle, 'beforeUpdate', { set: (f: (docs: Doc[]) => void) => { h.beforeUpdate = f; }, get: () => h.beforeUpdate });
  return handle;
}

interface RunResult { out: string[]; error: Error | null }
/** Run a generated script exactly as written, with a fake `db`. */
function run(script: string, handle: Handle, env: Record<string, string>): RunResult {
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
const lineOf = (r: RunResult, label: string): string => {
  const l = r.out.find((x) => x.startsWith(`${label}: `));
  assert.ok(l, `no "${label}" line in:\n${r.out.join('\n')}\n${r.error ?? ''}`);
  return l as string;
};

/* ---------- build from the validated fixes ---------- */

const loaded = validateAll();
assert.equal(loaded.result.ok, true, `fixes.json does not validate: ${JSON.stringify(loaded.result.issues.filter((i) => i.level === 'error').slice(0, 3))}`);
const data: ApplyData = buildApplyData(loaded.result.resolved);
const dataText = `${JSON.stringify(data, null, 1)}\n`;
const dataPath = newPath('data');
fs.writeFileSync(dataPath, dataText);
const meta = { dataSha256: crypto.createHash('sha256').update(Buffer.from(dataText, 'utf8')).digest('hex'), dataFileName: DATA_FILE, counts: data.counts, generatedAt: 'test' };
const scripts: Record<Direction, string> = {
  apply: renderScript({ ...meta, direction: 'apply', scriptName: scriptFile('apply') }),
  revert: renderScript({ ...meta, direction: 'revert', scriptName: scriptFile('revert') }),
};

const exported = [...loadRows().values()];
const original: Doc[] = exported.map(storedFromRow);
const N = data.counts;
const fixById = new Map(data.rows.map((r) => [r.id, r]));
/** The collection with the fixes applied by the PURE core — the independent
 *  expectation the script's writes are compared against. */
const expected: Doc[] = original.map((d) => (fixById.has(d.id as string) ? applyChanges(d, fixById.get(d.id as string)!.changes) : d));
const A = (label: string, total: number, toChange: number, already: number, mismatched: number, word = 'applied'): string =>
  `${label}: ${total} in the data · to change ${toChange} · already ${word} ${already} · mismatched ${mismatched}`;

console.log(`collection: ${original.length} rows · fixes: ${N.rows} rows, ${N.fields} field values, ${N.keyChanges} answer keys`);
let summary: string[] = [];

test('the expectation differs from the original in exactly the listed fields', () => {
  let fields = 0;
  original.forEach((o, i) => {
    const e = expected[i];
    for (const k of Object.keys(o)) {
      if (JSON.stringify(o[k]) === JSON.stringify(e[k])) continue;
      const fix = fixById.get(o.id as string);
      assert.ok(fix, `row ${String(o.id)} differs but has no fix`);
      const listed = fix.changes.filter((c) => c.field === k);
      assert.ok(listed.length > 0, `row ${String(o.id)} field ${k} differs but is not listed`);
      if (Array.isArray(o[k])) {
        (o[k] as string[]).forEach((v, j) => { if (v !== (e[k] as string[])[j]) { assert.ok(listed.some((c) => c.index === j)); fields += 1; } });
        assert.equal((o[k] as string[]).length, (e[k] as string[]).length);
      } else fields += 1;
    }
  });
  assert.equal(fields, N.fields);
});

test('refuses any database but evelyn', () => {
  for (const name of ['greenapple', 'evelyn_test', 'test', 'admin']) {
    const h = fakeDb(name, original);
    const r = run(scripts.apply, h, { DATA: dataPath, APPLY: '1', BACKUP: newPath('b') });
    assert.match(String(r.error), /expected "evelyn"/);
    assert.equal(h.writes.length, 0);
  }
});

test('refuses a data file that is not the one it was built with; needs DATA', () => {
  const other = newPath('data');
  fs.writeFileSync(other, dataText.replace('"new": "', '"new": " '));
  const h = fakeDb('evelyn', original);
  assert.match(String(run(scripts.apply, h, { DATA: other }).error), /not the file this script was built with/);
  assert.match(String(run(scripts.apply, h, {}).error), /set DATA/);
  assert.equal(h.writes.length, 0);
});

test('dry run (the default): counts everything, writes nothing', () => {
  const h = fakeDb('evelyn', original);
  const r = run(scripts.apply, h, { DATA: dataPath });
  assert.equal(r.error, null, String(r.error));
  assert.equal(r.out[0], 'APPLY practice-item fixes — DRY RUN');
  assert.equal(lineOf(r, 'rows'), A('rows', N.rows, N.rows, 0, 0));
  assert.equal(lineOf(r, 'fields'), A('fields', N.fields, N.fields, 0, 0));
  assert.equal(lineOf(r, 'answer keys'), A('answer keys', N.keyChanges, N.keyChanges, 0, 0));
  assert.ok(r.out.includes('DRY RUN — nothing written. Set APPLY=1 and BACKUP=<new file> to write.'));
  assert.equal(h.writes.length, 0);
  assert.deepEqual(h.docs, original);
  summary.push(`dry run:        ${lineOf(r, 'rows')} | ${lineOf(r, 'fields')} | writes ${h.writes.length}`);
  // APPLY must be exactly "1"
  for (const v of ['true', 'yes', '0', '']) {
    const r2 = run(scripts.apply, h, { DATA: dataPath, APPLY: v, BACKUP: newPath('b') });
    assert.equal(r2.error, null);
    assert.equal(h.writes.length, 0);
  }
});

test('APPLY=1 needs BACKUP, and never overwrites an existing file', () => {
  const h = fakeDb('evelyn', original);
  assert.match(String(run(scripts.apply, h, { DATA: dataPath, APPLY: '1' }).error), /needs BACKUP/);
  const existing = newPath('backup');
  fs.writeFileSync(existing, 'earlier backup');
  assert.match(String(run(scripts.apply, h, { DATA: dataPath, APPLY: '1', BACKUP: existing }).error), /already exists/);
  assert.equal(fs.readFileSync(existing, 'utf8'), 'earlier backup');
  assert.equal(h.writes.length, 0);
});

const live = fakeDb('evelyn', original);
const backupPath = path.join(tmp, 'nested', 'dir', 'backup.json');

test('apply: backs up the full originals, writes only the listed fields, reads back', () => {
  const r = run(scripts.apply, live, { DATA: dataPath, APPLY: '1', BACKUP: backupPath });
  assert.equal(r.error, null, `${String(r.error)}\n${r.out.join('\n')}`);
  assert.equal(r.out[0], 'APPLY practice-item fixes — WRITING');
  assert.ok(r.out.includes(`backup: ${N.rows} original document(s) → ${backupPath}`));
  assert.ok(r.out.includes(`rows written: ${N.rows}`));
  assert.ok(r.out.includes(`after — ${A('fields', N.fields, 0, N.fields, 0)}`));
  assert.ok(r.out.includes('read-back check passed.'));
  // the backup holds the complete original documents of exactly the touched rows
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8')) as Doc[];
  assert.deepEqual(backup.map((d) => d.id).sort(), [...fixById.keys()].sort());
  for (const b of backup) assert.deepEqual(b, original.find((o) => o.id === b.id));
  // the collection is exactly the pure core's expectation (so: untouched rows
  // identical, and in touched rows nothing but the listed fields changed —
  // updatedAt, embedding, verifiedAt included)
  assert.deepEqual(live.docs, expected);
  assert.equal(live.writes.length, N.rows);
  for (const w of live.writes) {
    assert.deepEqual(Object.keys(w.update), ['$set']);
    const set = (w.update as { $set: Record<string, unknown> }).$set;
    for (const p of Object.keys(set)) assert.match(p, /^(problemText|answer|solutionText|hints\.\d+|choices\.\d+)$/);
    assert.ok('_id' in w.filter && 'id' in w.filter);
    for (const p of Object.keys(set)) assert.ok(p in w.filter, `write of ${p} is not guarded by its old value`);
  }
  assert.equal(live.writes.reduce((a, w) => a + Object.keys((w.update as { $set: object }).$set).length, 0), N.fields);
  summary.push(`apply:          rows written ${N.rows} · field values ${N.fields} · backup ${backup.length} full documents · read-back passed`);
});

test('idempotent: a second run finds everything already applied and writes nothing', () => {
  const before = live.writes.length;
  const dry = run(scripts.apply, live, { DATA: dataPath });
  assert.equal(dry.error, null);
  assert.equal(lineOf(dry, 'rows'), A('rows', N.rows, 0, N.rows, 0));
  assert.equal(lineOf(dry, 'fields'), A('fields', N.fields, 0, N.fields, 0));
  const second = newPath('backup-second');
  const r = run(scripts.apply, live, { DATA: dataPath, APPLY: '1', BACKUP: second });
  assert.equal(r.error, null);
  assert.ok(r.out.includes('Nothing to change — no backup written, nothing written.'));
  assert.equal(fs.existsSync(second), false);
  assert.equal(live.writes.length, before);
  assert.deepEqual(live.docs, expected);
  summary.push(`re-run:         ${lineOf(dry, 'rows')} | no backup written, writes 0`);
});

test('a half-applied collection is finished, not refused', () => {
  const half = original.map((d, i) => (fixById.has(d.id as string) && i % 2 === 0 ? applyChanges(d, fixById.get(d.id as string)!.changes) : d));
  const done = half.filter((d, i) => JSON.stringify(d) !== JSON.stringify(original[i])).length;
  assert.ok(done > 0 && done < N.rows);
  const h = fakeDb('evelyn', half);
  const r = run(scripts.apply, h, { DATA: dataPath, APPLY: '1', BACKUP: newPath('b') });
  assert.equal(r.error, null, String(r.error));
  assert.equal(lineOf(r, 'rows'), A('rows', N.rows, N.rows - done, done, 0));
  assert.equal(h.writes.length, N.rows - done);
  assert.deepEqual(h.docs, expected);
});

test('mismatch: ALL are collected first and nothing is written', () => {
  const docs = JSON.parse(JSON.stringify(original)) as Doc[];
  const targets = data.rows.filter((r) => r.changes.some((c) => c.field === 'hints')).slice(0, 2);
  const t3 = data.rows.find((r) => r.changes.some((c) => c.field === 'problemText') && !targets.includes(r))!;
  const t4 = data.rows.find((r) => !targets.includes(r) && r !== t3)!;
  const t5 = data.rows.find((r) => !targets.includes(r) && r !== t3 && r !== t4 && r.changes.some((c) => c.field === 'hints'))!;
  const doc = (id: string): Doc => docs.find((d) => d.id === id) as Doc;
  for (const t of targets) { const c = t.changes.find((x) => x.field === 'hints')!; (doc(t.id).hints as string[])[c.index as number] += ' (edited since)'; }
  doc(t3.id).problemText = `${String(doc(t3.id).problemText)} `; // one trailing space
  docs.splice(docs.indexOf(doc(t4.id)), 1); // row deleted
  (doc(t5.id).hints as string[]).unshift('a hint inserted at the front'); // every index moved
  const h = fakeDb('evelyn', docs);
  const snapshot = JSON.parse(JSON.stringify(h.docs));
  const r = run(scripts.apply, h, { DATA: dataPath, APPLY: '1', BACKUP: newPath('never') });
  assert.match(String(r.error), /5 stored value\(s\) do not match — aborted before any write/);
  assert.ok(r.out.includes('MISMATCHES (5) — nothing written:'));
  for (const t of [...targets, t3, t4, t5]) assert.ok(r.out.some((l) => l.includes(`row ${t.id} `)), `mismatch for ${t.id} not listed`);
  assert.ok(r.out.some((l) => l.includes(t4.id) && l.includes('row not found in the collection')));
  assert.ok(r.out.some((l) => l.includes(t5.id) && /stored hints has \d+ element\(s\), expected \d+/.test(l)));
  assert.equal(lineOf(r, 'rows'), A('rows', N.rows, N.rows - 5, 0, 5));
  assert.equal(h.writes.length, 0);
  assert.deepEqual(h.docs, snapshot);
  assert.equal(fs.readdirSync(tmp).some((f) => f.startsWith('never')), false);
  summary.push(`mismatch abort: 5 rows altered (2 hints edited, 1 stem edited, 1 row deleted, 1 hint inserted) → ${lineOf(r, 'rows')} | writes ${h.writes.length}, no backup`);
});

test('a duplicated id or a non-string value is a mismatch, never a guess', () => {
  const docs = JSON.parse(JSON.stringify(original)) as Doc[];
  const t = data.rows[0];
  docs.push({ ...(docs.find((d) => d.id === t.id) as Doc), _id: 'oid-dup' });
  const t2 = data.rows.find((r) => r.changes.some((c) => c.field === 'solutionText'))!;
  (docs.find((d) => d.id === t2.id) as Doc).solutionText = null;
  const h = fakeDb('evelyn', docs);
  const r = run(scripts.apply, h, { DATA: dataPath, APPLY: '1', BACKUP: newPath('never2') });
  assert.match(String(r.error), /aborted before any write/);
  assert.ok(r.out.some((l) => l.includes(t.id) && l.includes('id appears 2 times')));
  assert.ok(r.out.some((l) => l.includes(t2.id) && l.includes('stored field is not a string')));
  assert.equal(h.writes.length, 0);
});

test('a row that changes between the read and the write stops the run', () => {
  const h = fakeDb('evelyn', original);
  const third = data.rows[2];
  let calls = 0;
  h.beforeUpdate = (docs) => {
    calls += 1;
    if (calls === 3) {
      const d = docs.find((x) => x.id === third.id) as Doc;
      const c = third.changes[0];
      if (c.index === null) d[c.field] = 'changed by someone else';
      else (d[c.field] as string[])[c.index] = 'changed by someone else';
    }
  };
  const r = run(scripts.apply, h, { DATA: dataPath, APPLY: '1', BACKUP: newPath('b') });
  assert.match(String(r.error), new RegExp(`STOPPED at row ${third.id.replace(/\./g, '\\.')}: the document changed after it was read \\(matched 0, modified 0\\)\\. 2 row\\(s\\) were written`));
  assert.equal(h.writes.length, 2);
});

test('revert: dry run, then restores the original collection exactly; re-runnable', () => {
  const dry = run(scripts.revert, live, { DATA: dataPath });
  assert.equal(dry.error, null);
  assert.equal(dry.out[0], 'REVERT practice-item fixes — DRY RUN');
  assert.equal(lineOf(dry, 'rows'), A('rows', N.rows, N.rows, 0, 0, 'reverted'));
  assert.deepEqual(live.docs, expected);
  const rb = newPath('revert-backup');
  const r = run(scripts.revert, live, { DATA: dataPath, APPLY: '1', BACKUP: rb });
  assert.equal(r.error, null, String(r.error));
  assert.ok(r.out.includes('read-back check passed.'));
  assert.deepEqual(live.docs, original);
  // the revert's own backup holds the documents as they were with the fixes
  assert.deepEqual((JSON.parse(fs.readFileSync(rb, 'utf8')) as Doc[]).length, N.rows);
  const again = run(scripts.revert, live, { DATA: dataPath });
  assert.equal(lineOf(again, 'rows'), A('rows', N.rows, 0, N.rows, 0, 'reverted'));
  // revert on a collection the fixes were never applied to: nothing to do
  const fresh = fakeDb('evelyn', original);
  const r2 = run(scripts.revert, fresh, { DATA: dataPath, APPLY: '1', BACKUP: newPath('b') });
  assert.ok(r2.out.includes('Nothing to change — no backup written, nothing written.'));
  assert.equal(fresh.writes.length, 0);
  summary.push(`revert:         ${lineOf(dry, 'rows')} → collection equals the original export again (${original.length} rows compared)`);
});

/* ---------- Part 2 — the shipped files ---------- */

const shippedData = path.join(TOOLING_DIR, DATA_FILE);
if (fs.existsSync(shippedData) && fs.existsSync(path.join(TOOLING_DIR, scriptFile('apply')))) {
  test('shipped files: same data and script bodies as rendered here; apply + revert round trip', () => {
    assert.equal(fs.readFileSync(shippedData, 'utf8'), dataText, 'shipped data file is stale — rebuild');
    const body = (s: string): string => s.split('\n').filter((l) => !l.startsWith('// Generated ')).join('\n');
    for (const d of ['apply', 'revert'] as const) assert.equal(body(fs.readFileSync(path.join(TOOLING_DIR, scriptFile(d)), 'utf8')), body(scripts[d]), `shipped ${d} script is stale — rebuild`);
    const h = fakeDb('evelyn', original);
    const shippedApply = fs.readFileSync(path.join(TOOLING_DIR, scriptFile('apply')), 'utf8');
    const shippedRevert = fs.readFileSync(path.join(TOOLING_DIR, scriptFile('revert')), 'utf8');
    assert.equal(run(shippedApply, h, { DATA: shippedData }).error, null);
    assert.equal(h.writes.length, 0);
    const r = run(shippedApply, h, { DATA: shippedData, APPLY: '1', BACKUP: newPath('shipped') });
    assert.equal(r.error, null, String(r.error));
    assert.deepEqual(h.docs, expected);
    assert.equal(run(shippedRevert, h, { DATA: shippedData, APPLY: '1', BACKUP: newPath('shipped-revert') }).error, null);
    assert.deepEqual(h.docs, original);
    summary.push('shipped files:  identical to this render; dry run, apply, revert round trip passed');
  });
} else {
  console.log('SKIPPED part 2 — the tooling folder has no built scripts yet (run build-apply-script.ts).');
  summary.push('shipped files:  NOT BUILT — part 2 skipped');
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${passed} tests passed`);
console.log('simulation summary:');
for (const s of summary) console.log(`  ${s}`);
