/**
 * The generated mongosh script, as text. One body serves both directions:
 *   apply  — stored value must equal `old`, becomes `new`;
 *   revert — stored value must equal `new`, becomes `old`.
 *
 * The body is plain JavaScript that runs in mongosh AND in a node `vm` with a
 * fake `db` (scripts/lesson-fix/simulate.test.ts runs the generated file
 * itself, so what is tested is what is shipped). It uses no template literals
 * so it can live inside `String.raw` here.
 */

export type Direction = 'apply' | 'revert';

export interface ScriptMeta {
  direction: Direction;
  /** sha256 of the data file's bytes — the script refuses any other file. */
  dataSha256: string;
  dataFileName: string;
  counts: { plans: number; segments: number; fields: number; objectives: number };
  generatedAt: string;
  /** Patches left out of the data because they failed validation. */
  excludedPatches?: number;
}

const BODY = String.raw`
const fs = require('fs');
const crypto = require('crypto');

const DIRECTION = '__DIRECTION__';
const EXPECTED_SHA256 = '__SHA256__';
const EXPECTED_COUNTS = __COUNTS__;

/* ---------- pure core (no db, no files) ---------- */

// The value a change must currently have, and the value it gets.
function fromOf(c) { return DIRECTION === 'apply' ? c.old : c.new; }
function toOf(c) { return DIRECTION === 'apply' ? c.new : c.old; }

// Classify one change against the stored segment.
// Returns { state: 'change' | 'already' | 'mismatch', why }.
function classifyChange(seg, c) {
  const v = seg[c.field];
  if (c.index === null) {
    if (typeof v !== 'string') return { state: 'mismatch', why: 'stored field is not a string: ' + JSON.stringify(v) };
    if (v === fromOf(c)) return { state: 'change' };
    if (v === toOf(c)) return { state: 'already' };
    return { state: 'mismatch', why: 'stored value differs: ' + JSON.stringify(v) };
  }
  if (!Array.isArray(v)) return { state: 'mismatch', why: 'stored field is not an array: ' + JSON.stringify(v) };
  if (c.append) {
    // Appended element: absent = array ends just before its index; present =
    // it is the element at its index.
    const absent = v.length === c.index;
    const present = v.length > c.index && v[c.index] === c.new;
    if (DIRECTION === 'apply') {
      if (absent) return { state: 'change' };
      if (present) return { state: 'already' };
    } else {
      if (present && v.length === c.index + 1) return { state: 'change' };
      if (absent) return { state: 'already' };
    }
    return { state: 'mismatch', why: 'stored array has ' + v.length + ' element(s); element ' + c.index + ' = ' + JSON.stringify(v[c.index]) };
  }
  if (c.index >= v.length) return { state: 'mismatch', why: 'stored array has only ' + v.length + ' element(s)' };
  if (v[c.index] === fromOf(c)) return { state: 'change' };
  if (v[c.index] === toOf(c)) return { state: 'already' };
  return { state: 'mismatch', why: 'stored value differs: ' + JSON.stringify(v[c.index]) };
}

// Plan the whole run against the stored documents. Writes nothing.
// docsById: { planId: storedDocument }.
function planRun(data, docsById) {
  const mismatches = [];
  const counts = {
    plans: { total: data.plans.length, toChange: 0, alreadyApplied: 0, mismatched: 0 },
    segments: { total: 0, toChange: 0, alreadyApplied: 0, mismatched: 0 },
    fields: { total: 0, toChange: 0, alreadyApplied: 0, mismatched: 0 },
    objectives: { total: 0, toChange: 0, alreadyApplied: 0, mismatched: 0 },
  };
  const updates = [];
  for (const plan of data.plans) {
    const doc = docsById[plan.planId];
    const planState = { change: 0, mismatch: 0 };
    // Two updates per plan at most: element/field sets, then array length
    // changes (MongoDB refuses a $set inside an array and a $push/$pop on the
    // same array in one update).
    const setFilter = { _id: plan.planId };
    const setDoc = {};
    const lenFilter = { _id: plan.planId };
    const pushDoc = {};
    const popDoc = {};
    // Objective descriptions: stored at los.<i>.description, i found by id.
    for (const o of (plan.objectives || [])) {
      counts.objectives.total += 1;
      counts.fields.total += 1;
      let why = null;
      let at = -1;
      if (!doc) why = 'plan not found in the collection';
      else if (!Array.isArray(doc.los)) why = 'stored plan has no los array';
      else {
        const hits = [];
        doc.los.forEach(function (x, i) { if (x && x.id === o.loId) hits.push(i); });
        if (hits.length !== 1) why = 'objective id appears ' + hits.length + ' time(s) in the stored plan';
        else at = hits[0];
      }
      let state = 'mismatch';
      if (!why) {
        const v = doc.los[at].description;
        if (v === fromOf(o)) state = 'change';
        else if (v === toOf(o)) state = 'already';
        else why = 'stored value differs: ' + JSON.stringify(v);
      }
      if (state === 'mismatch') {
        counts.objectives.mismatched += 1; counts.fields.mismatched += 1; planState.mismatch += 1;
        mismatches.push({ pack: plan.pack, planId: plan.planId, segmentId: o.loId, path: 'objective.description', why: why });
      } else if (state === 'already') {
        counts.objectives.alreadyApplied += 1; counts.fields.alreadyApplied += 1;
      } else {
        counts.objectives.toChange += 1; counts.fields.toChange += 1; planState.change += 1;
        setFilter['los.' + at + '.id'] = o.loId;
        setFilter['los.' + at + '.description'] = fromOf(o);
        setDoc['los.' + at + '.description'] = toOf(o);
      }
    }
    for (const s of plan.segments) {
      counts.segments.total += 1;
      counts.fields.total += s.changes.length;
      const segState = { change: 0, mismatch: 0 };
      const fail = function (path, why) {
        mismatches.push({ pack: plan.pack, planId: plan.planId, segmentId: s.segmentId, path: path, why: why });
      };
      let at = -1;
      let problem = null;
      if (!doc) problem = 'plan not found in the collection';
      else if (!Array.isArray(doc.segments)) problem = 'stored plan has no segments array';
      else {
        const hits = [];
        doc.segments.forEach(function (x, i) { if (x && x.id === s.segmentId) hits.push(i); });
        if (hits.length === 0) problem = 'segment id not found in the stored plan';
        else if (hits.length > 1) problem = 'segment id appears ' + hits.length + ' times in the stored plan';
        else if (doc.segments[hits[0]].kind !== s.kind) problem = 'stored segment kind is ' + JSON.stringify(doc.segments[hits[0]].kind) + ', expected ' + s.kind;
        else at = hits[0];
      }
      if (problem) {
        fail('(segment)', problem);
        counts.fields.mismatched += s.changes.length;
        segState.mismatch += 1;
      } else {
        const seg = doc.segments[at];
        const base = 'segments.' + at + '.';
        const pending = [];
        for (const c of s.changes) {
          const path = c.field + (c.index === null ? '' : '[' + (c.append ? '+' : c.index) + ']');
          const r = classifyChange(seg, c);
          if (r.state === 'mismatch') { counts.fields.mismatched += 1; segState.mismatch += 1; fail(path, r.why); }
          else if (r.state === 'already') counts.fields.alreadyApplied += 1;
          else { counts.fields.toChange += 1; segState.change += 1; pending.push(c); }
        }
        if (pending.length > 0) {
          // The filter pins the segment's position AND every value about to
          // be replaced, so a document that changed between the read and the
          // write matches nothing and is left alone.
          setFilter[base + 'id'] = s.segmentId;
          lenFilter[base + 'id'] = s.segmentId;
          const lengthChanged = {};
          for (const c of pending) {
            if (c.index === null) {
              setFilter[base + c.field] = fromOf(c);
              setDoc[base + c.field] = toOf(c);
            } else if (!c.append) {
              setFilter[base + c.field + '.' + c.index] = fromOf(c);
              setDoc[base + c.field + '.' + c.index] = toOf(c);
            } else {
              const arrPath = base + c.field;
              if (!lengthChanged[arrPath]) lengthChanged[arrPath] = [];
              lengthChanged[arrPath].push(c);
            }
          }
          for (const arrPath of Object.keys(lengthChanged)) {
            const list = lengthChanged[arrPath].slice().sort(function (a, b) { return a.index - b.index; });
            if (DIRECTION === 'apply') {
              // Guard: the array still ends where the first new element goes.
              lenFilter[arrPath] = { $size: list[0].index };
              pushDoc[arrPath] = { $each: list.map(function (c) { return c.new; }) };
            } else if (list.length > 1) {
              // A single update can pop one element only. The writers' brief
              // allows one added step; more than one is refused, not guessed.
              segState.mismatch += 1;
              counts.fields.toChange -= list.length;
              counts.fields.mismatched += list.length;
              segState.change -= list.length;
              fail(list[0].field + '[+]', 'revert of more than one appended element in one array is not supported');
            } else {
              lenFilter[arrPath] = { $size: list[0].index + 1 };
              lenFilter[arrPath + '.' + list[0].index] = list[0].new;
              popDoc[arrPath] = 1;
            }
          }
        }
      }
      if (segState.mismatch > 0) { counts.segments.mismatched += 1; planState.mismatch += 1; }
      else if (segState.change > 0) { counts.segments.toChange += 1; planState.change += 1; }
      else counts.segments.alreadyApplied += 1;
    }
    if (planState.mismatch > 0) counts.plans.mismatched += 1;
    else if (planState.change > 0) counts.plans.toChange += 1;
    else counts.plans.alreadyApplied += 1;
    const ops = [];
    if (Object.keys(setDoc).length > 0) ops.push({ filter: setFilter, update: { $set: setDoc } });
    if (Object.keys(pushDoc).length > 0) ops.push({ filter: lenFilter, update: { $push: pushDoc } });
    if (Object.keys(popDoc).length > 0) ops.push({ filter: lenFilter, update: { $pop: popDoc } });
    if (ops.length > 0) updates.push({ planId: plan.planId, pack: plan.pack, ops: ops });
  }
  return { counts: counts, mismatches: mismatches, updates: updates };
}

function line(label, c) {
  return label + ': ' + c.total + ' in the data · to change ' + c.toChange + ' · already ' + (DIRECTION === 'apply' ? 'applied' : 'reverted') + ' ' + c.alreadyApplied + ' · mismatched ' + c.mismatched;
}

function serialise(value) {
  // EJSON (mongosh) keeps dates and other BSON types exactly; plain JSON is
  // the fallback outside mongosh.
  if (typeof EJSON !== 'undefined' && EJSON && typeof EJSON.stringify === 'function') return EJSON.stringify(value, null, 1, { relaxed: false });
  return JSON.stringify(value, null, 1);
}

/* ---------- run ---------- */

const dataPath = process.env.DATA;
if (!dataPath) throw new Error('set DATA to the path of __DATA_FILE__');
if (db.getName() !== 'evelyn') throw new Error('connected to database "' + db.getName() + '", expected "evelyn" — put the database name in the URI');
const dataBytes = fs.readFileSync(dataPath);
const sha = crypto.createHash('sha256').update(dataBytes).digest('hex');
if (sha !== EXPECTED_SHA256) throw new Error('DATA is not the file this script was built with (sha256 ' + sha + ', expected ' + EXPECTED_SHA256 + ') — rebuild both together');
const data = JSON.parse(dataBytes.toString('utf8'));
if (data.formatVersion !== 1 || data.database !== 'evelyn' || data.collection !== 'lessonplans' || !Array.isArray(data.plans)) throw new Error('unexpected data file shape');
if (data.plans.length !== EXPECTED_COUNTS.plans) throw new Error('expected ' + EXPECTED_COUNTS.plans + ' plans in the data, got ' + data.plans.length);
const planIds = data.plans.map(function (p) { return p.planId; });
if (new Set(planIds).size !== planIds.length) throw new Error('duplicate plan ids in the data');
for (const id of planIds) if (!/^gen-[0-9a-f-]{36}$/.test(id)) throw new Error('unexpected plan id ' + id);

const APPLY = process.env.APPLY === '1';
const backupPath = process.env.BACKUP;
if (APPLY && !backupPath) throw new Error('APPLY=1 needs BACKUP=<path of a new file> for the original documents');
if (APPLY && fs.existsSync(backupPath)) throw new Error('BACKUP file already exists: ' + backupPath + ' — name a new file, an earlier backup is never overwritten');

print((DIRECTION === 'apply' ? 'APPLY lesson corrections' : 'REVERT lesson corrections') + ' — ' + (APPLY ? 'WRITING' : 'DRY RUN'));
const stored = db.lessonplans.find({ _id: { $in: planIds } }).toArray();
const docsById = {};
for (const d of stored) docsById[d._id] = d;
const run = planRun(data, docsById);
print(line('plans', run.counts.plans));
print(line('segments', run.counts.segments));
print(line('objective descriptions', run.counts.objectives));
print(line('fields', run.counts.fields));

// Read-only: other stored plans that carry the same objective ids (a plan
// expanded from one of these). They are copies made by a model, not by this
// script; they are listed, never written.
const loIds = [];
for (const p of data.plans) {
  for (const s of p.segments) {
    const m = /^(.*\.lo-\d+)-[a-z0-9]+$/.exec(s.segmentId);
    if (m && loIds.indexOf(m[1]) < 0) loIds.push(m[1]);
  }
  for (const o of (p.objectives || [])) if (loIds.indexOf(o.loId) < 0) loIds.push(o.loId);
}
if (loIds.length > 0) {
  const related = db.lessonplans.find({ 'los.id': { $in: loIds }, _id: { $nin: planIds } }, { _id: 1 }).toArray();
  print('other stored plans sharing these objectives (NOT written): ' + related.length + (related.length ? ' — ' + related.map(function (d) { return d._id; }).join(', ') : ''));
}

if (run.mismatches.length > 0) {
  print('MISMATCHES (' + run.mismatches.length + ') — nothing written:');
  for (const m of run.mismatches) print('  lesson ' + m.pack + ' ' + m.planId + ' ' + m.segmentId + ' ' + m.path + ': ' + m.why);
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
  const check = fs.readFileSync(backupPath, 'utf8');
  if (JSON.parse(check).length !== touched.length) throw new Error('backup file did not read back — nothing written');
  print('backup: ' + touched.length + ' original document(s) → ' + backupPath);
  let plansWritten = 0;
  for (const u of run.updates) {
    for (const op of u.ops) {
      const res = db.lessonplans.updateOne(op.filter, op.update);
      if (res.matchedCount !== 1 || res.modifiedCount !== 1) {
        throw new Error('STOPPED at lesson ' + u.pack + ' ' + u.planId + ': the document changed after it was read (matched ' + res.matchedCount + ', modified ' + res.modifiedCount + '). ' +
          plansWritten + ' plan(s) were fully written before this one; re-run the dry run to see the state. Originals are in ' + backupPath);
      }
    }
    plansWritten += 1;
  }
  print('plans written: ' + plansWritten);
  // Read back: every change must now be in its target state.
  const after = {};
  for (const d of db.lessonplans.find({ _id: { $in: planIds } }).toArray()) after[d._id] = d;
  const verify = planRun(data, after);
  print('after — ' + line('fields', verify.counts.fields));
  if (verify.mismatches.length > 0 || verify.counts.fields.toChange !== 0) throw new Error('read-back check failed: ' + verify.mismatches.length + ' mismatch(es), ' + verify.counts.fields.toChange + ' still to change');
  print('read-back check passed.');
}
`;

export function renderScript(meta: ScriptMeta): string {
  const verb = meta.direction === 'apply' ? 'Applies' : 'REVERTS';
  const self = meta.direction === 'apply' ? 'apply-lesson-corrections.mongosh.js' : 'revert-lesson-corrections.mongosh.js';
  const header = [
    `// ${verb} the reviewed lesson-text corrections ${meta.direction === 'apply' ? 'to' : 'in'} the \`lessonplans\` collection (db \`evelyn\`).`,
    `// Generated ${meta.generatedAt} by apps/tutor/scripts/lesson-fix/build-apply-script.ts — do not edit; rebuild.`,
    `// Data: ${meta.dataFileName} (sha256 ${meta.dataSha256}) — ${meta.counts.plans} plans, ${meta.counts.segments} segments, ${meta.counts.fields} values (${meta.counts.objectives} of them objective descriptions).`,
    ...(meta.excludedPatches ? [`// INCOMPLETE: ${meta.excludedPatches} patch(es) failed validation and are NOT in the data — see apply-build-report.json.`] : []),
    '//',
    meta.direction === 'apply'
      ? '// For every field: the stored value must equal the patch\'s `old` exactly, and becomes `new`.'
      : '// For every field: the stored value must equal the patch\'s `new` exactly, and becomes `old` again.',
    '// A field already in its target state is counted, not an error (re-runnable).',
    '// ANY other stored value aborts the whole run before the first write.',
    '// Writes only the listed fields, by explicit path (`segments.<i>.<field>[.<j>]`, `i` found by segment id in the stored document;',
    '// `los.<i>.description`, `i` found by objective id);',
    '// never replaces a document, a segment or an array. Does not touch `updatedAt` or any other field.',
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
