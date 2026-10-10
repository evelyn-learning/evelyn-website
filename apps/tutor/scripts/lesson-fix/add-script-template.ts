/**
 * The generated "add objectives" mongosh script, as text. One body serves
 * both directions (apply / revert). Plain JavaScript that runs in mongosh AND
 * in a node `vm` with a fake `db` (add-simulate.test.ts runs the generated
 * file itself). No template literals, so it can live inside `String.raw`.
 *
 * Per plan the stored document is in one of three states:
 *   before   — head and segments as the data's `pre`;
 *   halfway  — head (los, intro goal, recap, estimatedMinutes, metadata)
 *              already extended, the new segments not yet inserted;
 *   after    — both.
 * MongoDB refuses one update that both inserts into `segments` and sets a
 * field inside a segment, so a plan takes two updates. Apply writes the head
 * first and the segments second; revert removes the segments first and
 * restores the head second — so the only state a reader can ever see between
 * the two is "halfway" (objectives listed, their segments absent), never
 * segments that belong to no objective. Any other stored state is a mismatch
 * and aborts the whole run before the first write.
 */

export type AddDirection = 'apply' | 'revert';

export interface AddScriptMeta {
  direction: AddDirection;
  dataSha256: string;
  dataFileName: string;
  counts: { plans: number; objectives: number; segments: number };
  generatedAt: string;
  /** Packs left out of the data (not written, not read clean, or invalid). */
  excludedPacks?: string[];
}

const BODY = String.raw`
const fs = require('fs');
const crypto = require('crypto');

const DIRECTION = '__DIRECTION__';
const EXPECTED_SHA256 = '__SHA256__';
const EXPECTED_COUNTS = __COUNTS__;
const TEXT_FIELDS = ['goal', 'keyIdeas', 'problem', 'steps', 'answer', 'expectedAnswer'];
let REQUIRES = '';

/* ---------- pure core (no db, no files) ---------- */

// Deep equality, object key order aside (BSON documents keep insertion order;
// the comparison must not depend on it).
function same(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!same(a[i], b[i])) return false;
    return true;
  }
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  if (ka.length !== kb.length) return false;
  for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i] || !same(a[ka[i]], b[ka[i]])) return false;
  return true;
}

function show(v) {
  const s = JSON.stringify(v);
  return s === undefined ? 'undefined' : (s.length > 160 ? s.slice(0, 160) + '…' : s);
}

function canonSegment(s) {
  return [s.id, s.kind].concat(TEXT_FIELDS.map(function (f) { return s[f] === undefined ? null : s[f]; }));
}
// intro and recap are rewritten by this script and guarded value by value.
function isTeaching(s) { return s.id !== 'intro' && s.id !== 'recap'; }
function textSha(segments) {
  return crypto.createHash('sha256').update(JSON.stringify(segments.filter(isTeaching).map(canonSegment)), 'utf8').digest('hex');
}
function segmentSha(s) {
  return crypto.createHash('sha256').update(JSON.stringify(canonSegment(s)), 'utf8').digest('hex');
}

// What the head of the document must hold before and after.
function headValues(p, which) {
  const after = which === 'post';
  const los = after ? p.pre.los.concat(p.add.los) : p.pre.los;
  return {
    'los': los,
    'segments[intro].goal': after ? p.post.introGoal : p.pre.introGoal,
    'segments[recap].mustRemember': after ? p.pre.recapMustRemember.concat(p.add.los.map(function (l) { return l.description; })) : p.pre.recapMustRemember,
    'segments[recap].teacherNote': after ? p.post.recapTeacherNote : p.pre.recapTeacherNote,
    'estimatedMinutes': after ? p.post.estimatedMinutes : p.pre.estimatedMinutes,
    'metadata.pickedLoIds': after ? p.pre.pickedLoIds.concat(p.add.los.map(function (l) { return l.id; })) : p.pre.pickedLoIds,
    'metadata.allowedMaxLOs': after ? p.post.allowedMaxLOs : p.pre.allowedMaxLOs,
    'metadata.addedLoIds': after ? p.add.los.map(function (l) { return l.id; }) : undefined,
  };
}

function headStored(doc) {
  const segs = doc.segments;
  const recap = segs[segs.length - 1];
  const meta = doc.metadata || {};
  return {
    'los': (doc.los || []).map(function (l) { return { id: l.id, description: l.description, shortTitle: l.shortTitle }; }),
    'segments[intro].goal': segs[0].goal,
    'segments[recap].mustRemember': recap.mustRemember,
    'segments[recap].teacherNote': recap.teacherNote,
    'estimatedMinutes': doc.estimatedMinutes,
    'metadata.pickedLoIds': meta.pickedLoIds,
    'metadata.allowedMaxLOs': meta.allowedMaxLOs,
    'metadata.addedLoIds': meta.addedLoIds === null ? undefined : meta.addedLoIds,
  };
}

function eqHead(a, b) { return (a === undefined && b === undefined) || (a !== undefined && b !== undefined && same(a, b)); }

// Classify one stored document. Returns { head, segs, problems[], notes[] }
// with head / segs each 'pre' | 'post' | null (null = neither).
function classify(doc, p) {
  const problems = [];
  const notes = [];
  if (!doc) return { head: null, segs: null, problems: [['(plan)', 'plan not found in the collection']], notes: notes };
  const segs = doc.segments;
  if (!Array.isArray(segs) || segs.length < 2 || !Array.isArray(doc.los) || !doc.metadata) return { head: null, segs: null, problems: [['(plan)', 'stored plan has no segments, los or metadata']], notes: notes };
  if (segs[0].id !== 'intro' || segs[segs.length - 1].id !== 'recap' || segs[segs.length - 1].kind !== 'recap') problems.push(['segments', 'stored plan does not start with intro and end with recap']);
  if (doc.metadata.pendingPicker === true) problems.push(['metadata.pendingPicker', 'stored plan is a picker plan']);
  const avail = (doc.metadata.availableLOs || []).map(function (a) { return { id: a.id, description: a.description }; });
  if (!same(avail, p.pre.availableLOs)) problems.push(['metadata.availableLOs', 'stored list of available objectives differs: ' + show(avail)]);
  if (problems.length) return { head: null, segs: null, problems: problems, notes: notes };

  // Segments: id + kind order, and the new segments value for value.
  const ids = segs.map(function (s) { return s.id; });
  const kinds = segs.map(function (s) { return s.kind; });
  const cut = p.pre.segmentIds.length - 1;
  const newIds = p.add.segments.map(function (s) { return s.id; });
  const postIds = p.pre.segmentIds.slice(0, cut).concat(newIds, ['recap']);
  let segState = null;
  if (same(ids, p.pre.segmentIds)) {
    if (same(kinds, p.pre.segmentKinds)) segState = 'pre';
    else problems.push(['segments', 'stored segment kinds differ: ' + show(kinds)]);
  } else if (same(ids, postIds)) {
    segState = 'post';
    for (let i = 0; i < p.add.segments.length; i++) {
      if (!same(segs[cut + i], p.add.segments[i])) { segState = null; problems.push([newIds[i], 'stored new segment differs from the data: ' + show(segs[cut + i])]); }
    }
    if (!same(kinds.slice(0, cut), p.pre.segmentKinds.slice(0, cut))) { segState = null; problems.push(['segments', 'stored segment kinds differ']); }
  } else {
    problems.push(['segments', 'stored segment ids are neither the expected before nor after order: ' + show(ids)]);
  }

  // Head: every field in its before value, or every field in its after value.
  const stored = headStored(doc);
  const pre = headValues(p, 'pre');
  const post = headValues(p, 'post');
  const keys = Object.keys(pre);
  let headState = null;
  if (keys.every(function (k) { return eqHead(stored[k], pre[k]); })) headState = 'pre';
  else if (keys.every(function (k) { return eqHead(stored[k], post[k]); })) headState = 'post';
  else {
    const want = DIRECTION === 'apply' ? pre : post;
    for (const k of keys) if (!eqHead(stored[k], want[k]) && !(eqHead(stored[k], pre[k]) && eqHead(pre[k], post[k]))) problems.push([k, 'stored value differs: ' + show(stored[k])]);
    if (problems.length === 0) problems.push(['(head)', 'stored fields are a mix of before and after values']);
  }
  if (headState === 'pre' && segState === 'post') problems.push(['(plan)', 'new segments are stored but the objective list is not extended — not a state this script produces']);

  // Existing teaching text. Before anything of this plan is written (apply,
  // plan untouched) it must be the expected text — the additions were written
  // and read against it, and a pending correction set must go in first. Once
  // the plan is partly or fully extended, or on a revert, a later correction
  // of existing text must not block the run: it is reported, not refused.
  const existing = segState === 'post' ? segs.slice(0, cut).concat([segs[segs.length - 1]]) : segs;
  if (segState && textSha(existing) !== p.pre.textSha256) {
    const differing = [];
    existing.forEach(function (s, i) { if (isTeaching(s) && segmentSha(s) !== p.pre.segmentTextSha256[i]) differing.push(String(s.id).replace(/^.*\.lo-/, 'lo-')); });
    const what = 'stored teaching text of ' + differing.length + ' existing segment(s) is not the expected text (' + differing.join(', ') + ')';
    if (DIRECTION === 'apply' && headState === 'pre' && segState === 'pre' && problems.length === 0) problems.push(['(existing text)', what + ' — this script needs ' + REQUIRES]);
    else notes.push(what);
  }
  return { head: problems.length ? null : headState, segs: problems.length ? null : segState, problems: problems, notes: notes };
}

// Plan the whole run against the stored documents. Writes nothing.
function planRun(data, docsById) {
  const counts = { total: data.plans.length, toChange: 0, halfway: 0, already: 0, mismatched: 0, objectivesToChange: 0, segmentsToChange: 0 };
  const mismatches = [];
  const notes = [];
  const updates = [];
  const target = DIRECTION === 'apply' ? 'post' : 'pre';
  for (const p of data.plans) {
    const c = classify(docsById[p.planId], p);
    for (const n of c.notes) notes.push({ pack: p.pack, planId: p.planId, note: n });
    if (c.problems.length) {
      counts.mismatched += 1;
      for (const m of c.problems) mismatches.push({ pack: p.pack, planId: p.planId, path: m[0], why: m[1] });
      continue;
    }
    if (c.head === target && c.segs === target) { counts.already += 1; continue; }
    const n0 = p.pre.los.length;
    const k = p.add.los.length;
    const cut = p.pre.segmentIds.length - 1;        // index of recap before the insert
    const m = p.add.segments.length;
    const newLoIds = p.add.los.map(function (l) { return l.id; });
    const newDescriptions = p.add.los.map(function (l) { return l.description; });
    const newSegIds = p.add.segments.map(function (s) { return s.id; });
    const ops = [];
    const headFilter = function (from) {
      // Pins every value about to be replaced and the positions written to:
      // a document that changed after it was read matches nothing.
      const f = { _id: p.planId, segments: { $size: cut + 1 }, 'segments.0.id': 'intro' };
      f['segments.' + cut + '.id'] = 'recap';
      f['segments.0.goal'] = from === 'pre' ? p.pre.introGoal : p.post.introGoal;
      f['segments.' + cut + '.teacherNote'] = from === 'pre' ? p.pre.recapTeacherNote : p.post.recapTeacherNote;
      f['segments.' + cut + '.mustRemember'] = { $size: from === 'pre' ? n0 : n0 + k };
      f.los = { $size: from === 'pre' ? n0 : n0 + k };
      f['los.' + (n0 - 1) + '.id'] = p.pre.los[n0 - 1].id;
      f.estimatedMinutes = from === 'pre' ? p.pre.estimatedMinutes : p.post.estimatedMinutes;
      f['metadata.allowedMaxLOs'] = from === 'pre' ? p.pre.allowedMaxLOs : p.post.allowedMaxLOs;
      f['metadata.pickedLoIds'] = { $size: from === 'pre' ? n0 : n0 + k };
      return f;
    };
    if (DIRECTION === 'apply') {
      if (c.head === 'pre') {
        const set = { 'segments.0.goal': p.post.introGoal, estimatedMinutes: p.post.estimatedMinutes, 'metadata.allowedMaxLOs': p.post.allowedMaxLOs, 'metadata.addedLoIds': newLoIds };
        set['segments.' + cut + '.teacherNote'] = p.post.recapTeacherNote;
        const push = { los: { $each: p.add.los }, 'metadata.pickedLoIds': { $each: newLoIds } };
        push['segments.' + cut + '.mustRemember'] = { $each: newDescriptions };
        ops.push({ filter: headFilter('pre'), update: { $set: set, $push: push } });
      } else counts.halfway += 1;
      const f = { _id: p.planId, segments: { $size: cut + 1 }, los: { $size: n0 + k } };
      f['segments.' + (cut - 1) + '.id'] = p.pre.segmentIds[cut - 1];
      f['segments.' + cut + '.id'] = 'recap';
      ops.push({ filter: f, update: { $push: { segments: { $each: p.add.segments, $position: cut } } } });
    } else {
      if (c.segs === 'post') {
        const f = { _id: p.planId, segments: { $size: cut + 1 + m } };
        f['segments.' + cut + '.id'] = newSegIds[0];
        f['segments.' + (cut + m - 1) + '.id'] = newSegIds[m - 1];
        f['segments.' + (cut + m) + '.id'] = 'recap';
        ops.push({ filter: f, update: { $pull: { segments: { id: { $in: newSegIds } } } } });
      } else counts.halfway += 1;
      const set = { 'segments.0.goal': p.pre.introGoal, estimatedMinutes: p.pre.estimatedMinutes, 'metadata.allowedMaxLOs': p.pre.allowedMaxLOs };
      set['segments.' + cut + '.teacherNote'] = p.pre.recapTeacherNote;
      const pull = { los: { id: { $in: newLoIds } }, 'metadata.pickedLoIds': { $in: newLoIds } };
      pull['segments.' + cut + '.mustRemember'] = { $in: newDescriptions };
      ops.push({ filter: headFilter('post'), update: { $set: set, $pull: pull, $unset: { 'metadata.addedLoIds': '' } } });
    }
    counts.toChange += 1;
    counts.objectivesToChange += k;
    counts.segmentsToChange += m;
    updates.push({ planId: p.planId, pack: p.pack, ops: ops });
  }
  return { counts: counts, mismatches: mismatches, notes: notes, updates: updates };
}

function serialise(value) {
  if (typeof EJSON !== 'undefined' && EJSON && typeof EJSON.stringify === 'function') return EJSON.stringify(value, null, 1, { relaxed: false });
  return JSON.stringify(value, null, 1);
}

function line(c) {
  return 'plans: ' + c.total + ' in the data · to change ' + c.toChange + (c.halfway ? ' (' + c.halfway + ' of them half-written by an interrupted run)' : '') +
    ' · already ' + (DIRECTION === 'apply' ? 'applied' : 'reverted') + ' ' + c.already + ' · mismatched ' + c.mismatched +
    ' — objectives to ' + (DIRECTION === 'apply' ? 'add ' : 'remove ') + c.objectivesToChange + ', segments ' + c.segmentsToChange;
}

/* ---------- run ---------- */

const dataPath = process.env.DATA;
if (!dataPath) throw new Error('set DATA to the path of __DATA_FILE__');
if (db.getName() !== 'evelyn') throw new Error('connected to database "' + db.getName() + '", expected "evelyn" — put the database name in the URI');
const dataBytes = fs.readFileSync(dataPath);
const sha = crypto.createHash('sha256').update(dataBytes).digest('hex');
if (sha !== EXPECTED_SHA256) throw new Error('DATA is not the file this script was built with (sha256 ' + sha + ', expected ' + EXPECTED_SHA256 + ') — rebuild both together');
const data = JSON.parse(dataBytes.toString('utf8'));
REQUIRES = String(data.requires);
if (data.formatVersion !== 1 || data.kind !== 'lesson-additions' || data.database !== 'evelyn' || data.collection !== 'lessonplans' || !Array.isArray(data.plans)) throw new Error('unexpected data file shape');
if (data.plans.length !== EXPECTED_COUNTS.plans) throw new Error('expected ' + EXPECTED_COUNTS.plans + ' plans in the data, got ' + data.plans.length);
const planIds = data.plans.map(function (p) { return p.planId; });
const pickerIds = data.plans.map(function (p) { return p.pickerPlanId; });
if (new Set(planIds.concat(pickerIds)).size !== planIds.length * 2) throw new Error('duplicate plan ids in the data');
for (const id of planIds.concat(pickerIds)) if (!/^gen-[0-9a-f-]{36}$/.test(id)) throw new Error('unexpected plan id ' + id);

const APPLY = process.env.APPLY === '1';
const backupPath = process.env.BACKUP;
if (APPLY && !backupPath) throw new Error('APPLY=1 needs BACKUP=<path of a new file> for the original documents');
if (APPLY && fs.existsSync(backupPath)) throw new Error('BACKUP file already exists: ' + backupPath + ' — name a new file, an earlier backup is never overwritten');

print((DIRECTION === 'apply' ? 'ADD lesson objectives' : 'REMOVE the added lesson objectives') + ' — ' + (APPLY ? 'WRITING' : 'DRY RUN'));
const docsById = {};
for (const d of db.lessonplans.find({ _id: { $in: planIds } }).toArray()) docsById[d._id] = d;
const run = planRun(data, docsById);
print(line(run.counts));
for (const n of run.notes) print('NOTE lesson ' + n.pack + ' ' + n.planId + ': ' + n.note);

// Read-only: the picker plans the objectives come from must still describe
// them as the data does (never written).
const pickers = {};
for (const d of db.lessonplans.find({ _id: { $in: pickerIds } }).toArray()) pickers[d._id] = d;
let pickerOk = 0;
for (const p of data.plans) {
  const pk = pickers[p.pickerPlanId];
  const want = p.pre.los.concat(p.add.los).map(function (l) { return l.id; });
  if (!pk || !Array.isArray(pk.los)) run.mismatches.push({ pack: p.pack, planId: p.pickerPlanId, path: '(picker plan)', why: 'picker plan not found in the collection' });
  else if (!same(pk.los.map(function (l) { return l.id; }), want)) run.mismatches.push({ pack: p.pack, planId: p.pickerPlanId, path: '(picker plan) los', why: 'picker plan lists other objectives: ' + show(pk.los.map(function (l) { return l.id; })) });
  else {
    const n0 = p.pre.los.length;
    let ok = true;
    p.add.los.forEach(function (l, i) {
      const s = pk.los[n0 + i];
      if (s.description !== l.description || s.shortTitle !== l.shortTitle) { ok = false; run.mismatches.push({ pack: p.pack, planId: p.pickerPlanId, path: '(picker plan) ' + l.id, why: 'picker plan words this objective differently: ' + show(s) }); }
    });
    if (ok) pickerOk += 1;
  }
}
print('picker plans (read only): ' + pickerOk + ' of ' + data.plans.length + ' list the added objectives exactly as the data');

// Read-only: any other stored plan that carries the added objective ids.
const addedLoIds = [];
for (const p of data.plans) for (const l of p.add.los) addedLoIds.push(l.id);
const related = db.lessonplans.find({ 'los.id': { $in: addedLoIds }, _id: { $nin: planIds.concat(pickerIds) } }, { _id: 1 }).toArray();
print('other stored plans carrying these objectives (NOT written): ' + related.length + (related.length ? ' — ' + related.map(function (d) { return d._id; }).join(', ') : ''));

if (run.mismatches.length > 0) {
  print('MISMATCHES (' + run.mismatches.length + ') — nothing written:');
  for (const m of run.mismatches) print('  lesson ' + m.pack + ' ' + m.planId + ' ' + m.path + ': ' + m.why);
  const textOnly = run.mismatches.filter(function (m) { return m.path === '(existing text)'; }).length;
  if (textOnly > 0) print('LIKELY CAUSE for ' + textOnly + ' of them: an earlier correction set is not applied yet. This script needs ' + REQUIRES + '.');
  throw new Error(run.mismatches.length + ' stored value(s) do not match — aborted before any write');
}

if (!APPLY) {
  print('DRY RUN — nothing written. Set APPLY=1 and BACKUP=<new file> to write.');
} else if (run.updates.length === 0) {
  print('Nothing to change — no backup written, nothing written.');
} else {
  const touched = run.updates.map(function (u) { return docsById[u.planId]; });
  fs.mkdirSync(require('path').dirname(backupPath), { recursive: true });
  fs.writeFileSync(backupPath, serialise(touched), { flag: 'wx' });
  if (JSON.parse(fs.readFileSync(backupPath, 'utf8')).length !== touched.length) throw new Error('backup file did not read back — nothing written');
  print('backup: ' + touched.length + ' original document(s) → ' + backupPath);
  let plansWritten = 0;
  for (const u of run.updates) {
    for (const op of u.ops) {
      const res = db.lessonplans.updateOne(op.filter, op.update);
      if (res.matchedCount !== 1 || res.modifiedCount !== 1) {
        throw new Error('STOPPED at lesson ' + u.pack + ' ' + u.planId + ': the document changed after it was read (matched ' + res.matchedCount + ', modified ' + res.modifiedCount + '). ' +
          plansWritten + ' plan(s) were fully written before this one; re-run the dry run to see the state (a half-written plan is completed by a re-run). Originals are in ' + backupPath);
      }
    }
    plansWritten += 1;
  }
  print('plans written: ' + plansWritten);
  const after = {};
  for (const d of db.lessonplans.find({ _id: { $in: planIds } }).toArray()) after[d._id] = d;
  const verify = planRun(data, after);
  print('after — ' + line(verify.counts));
  if (verify.mismatches.length > 0 || verify.counts.toChange !== 0 || verify.counts.already !== data.plans.length) throw new Error('read-back check failed: ' + verify.mismatches.length + ' mismatch(es), ' + verify.counts.toChange + ' still to change');
  print('read-back check passed.');
}
`;

export const ADD_SCRIPT_NAMES: Readonly<Record<AddDirection, string>> = {
  apply: 'apply-lesson-additions.mongosh.js',
  revert: 'revert-lesson-additions.mongosh.js',
};

export function renderAddScript(meta: AddScriptMeta): string {
  const self = ADD_SCRIPT_NAMES[meta.direction];
  const apply = meta.direction === 'apply';
  const header = [
    `// ${apply ? 'ADDS the reviewed teaching text for the objectives that had none to' : 'REMOVES the added objectives again from'} the \`lessonplans\` collection (db \`evelyn\`).`,
    `// Generated ${meta.generatedAt} by apps/tutor/scripts/lesson-fix/build-add-script.ts — do not edit; rebuild.`,
    `// Data: ${meta.dataFileName} (sha256 ${meta.dataSha256}) — ${meta.counts.plans} plans, ${meta.counts.objectives} objectives, ${meta.counts.segments} segments.`,
    ...(meta.excludedPacks?.length ? [`// INCOMPLETE: ${meta.excludedPacks.length} pack(s) are NOT in the data (${meta.excludedPacks.join(', ')}) — see add-build-report.json.`] : []),
    '//',
    '// Per plan, before any write: the stored objectives (id, description, shortTitle), the segment ids and kinds in order,',
    '// the intro goal, recap mustRemember + teacherNote, estimatedMinutes, metadata.pickedLoIds / allowedMaxLOs / availableLOs',
    '// must equal the expected state exactly, and the picker plan (read only) must list the added objectives as the data does.',
    ...(apply ? ['// The EXISTING teaching text must also be the expected text (per-segment fingerprint): every earlier correction set must be applied first.'] : []),
    '// ANY other stored value aborts the whole run before the first write. A plan already in its target state is counted, not an error.',
    apply
      ? '// Writes, by explicit path only: $push los; $push segments {$each, $position: <index of recap>}; $push recap mustRemember and'
      : '// Writes, by explicit path only: $pull the added segments by id; $pull the added los, recap mustRemember entries and',
    apply
      ? '// metadata.pickedLoIds; $set intro goal, recap teacherNote, estimatedMinutes, metadata.allowedMaxLOs, metadata.addedLoIds.'
      : '// metadata.pickedLoIds; $set intro goal, recap teacherNote, estimatedMinutes, metadata.allowedMaxLOs back; $unset metadata.addedLoIds.',
    '// Never replaces a document, a segment or an array. Does not touch `updatedAt`, the picker plan or any existing teaching text.',
    '// Two updates per plan (see add-script-template.ts); a run interrupted between them is completed by a re-run.',
    '// Dry run by default. APPLY=1 writes, after saving the full original documents to BACKUP (a NEW file).',
    '//',
    `//   Dry run:  DATA=<path>/${meta.dataFileName} mongosh --quiet "<uri>/evelyn?directConnection=true" ${self}`,
    `//   Write:    APPLY=1 BACKUP=<new file>.json DATA=<path>/${meta.dataFileName} mongosh --quiet "<uri>/evelyn?directConnection=true" ${self}`,
  ].join('\n');
  const body = BODY
    .replace('__DIRECTION__', meta.direction)
    .replace('__SHA256__', meta.dataSha256)
    .replace('__COUNTS__', JSON.stringify(meta.counts))
    .replace('__DATA_FILE__', meta.dataFileName);
  return `${header}\n${body}`;
}
