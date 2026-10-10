/**
 * The generated mongosh script, as text. One body serves both directions:
 *   apply  — stored value must equal `old`, becomes `new`;
 *   revert — stored value must equal `new`, becomes `old`.
 *
 * Same discipline as the lesson-corrections script
 * (scripts/lesson-fix/script-template.ts), for rows of `problembanks`
 * identified by their `id` field. The body is plain JavaScript that runs in
 * mongosh AND in a node `vm` with a fake `db` (simulate.test.ts runs the
 * generated file itself, so what is tested is what is shipped). It uses no
 * template literals so it can live inside `String.raw` here.
 */

export type Direction = 'apply' | 'revert';

export interface ScriptMeta {
  direction: Direction;
  /** File name of the script itself (for the usage lines). */
  scriptName: string;
  /** sha256 of the data file's bytes — the script refuses any other file. */
  dataSha256: string;
  dataFileName: string;
  counts: { rows: number; fields: number; keyChanges: number };
  generatedAt: string;
}

const BODY = String.raw`
const fs = require('fs');
const crypto = require('crypto');

const DIRECTION = '__DIRECTION__';
const EXPECTED_SHA256 = '__SHA256__';
const EXPECTED_COUNTS = __COUNTS__;
const SCALARS = ['problemText', 'answer', 'solutionText'];
const ARRAYS = ['hints', 'choices'];

/* ---------- pure core (no db, no files) ---------- */

// The value a change must currently have, and the value it gets.
function fromOf(c) { return DIRECTION === 'apply' ? c.old : c.new; }
function toOf(c) { return DIRECTION === 'apply' ? c.new : c.old; }

// Classify one change against the stored row.
// Returns { state: 'change' | 'already' | 'mismatch', why }.
function classifyChange(doc, c) {
  const v = doc[c.field];
  if (c.index === null) {
    if (typeof v !== 'string') return { state: 'mismatch', why: 'stored field is not a string: ' + JSON.stringify(v) };
    if (v === fromOf(c)) return { state: 'change' };
    if (v === toOf(c)) return { state: 'already' };
    return { state: 'mismatch', why: 'stored value differs: ' + JSON.stringify(v) };
  }
  if (!Array.isArray(v)) return { state: 'mismatch', why: 'stored field is not an array: ' + JSON.stringify(v) };
  if (c.index >= v.length) return { state: 'mismatch', why: 'stored array has only ' + v.length + ' element(s)' };
  if (v[c.index] === fromOf(c)) return { state: 'change' };
  if (v[c.index] === toOf(c)) return { state: 'already' };
  return { state: 'mismatch', why: 'stored value differs: ' + JSON.stringify(v[c.index]) };
}

// Plan the whole run against the stored rows. Writes nothing.
// docsById: { rowId: [storedDocuments with that id] }.
function planRun(data, docsById) {
  const mismatches = [];
  const counts = {
    rows: { total: data.rows.length, toChange: 0, alreadyApplied: 0, mismatched: 0 },
    fields: { total: 0, toChange: 0, alreadyApplied: 0, mismatched: 0 },
    keys: { total: 0, toChange: 0, alreadyApplied: 0, mismatched: 0 },
  };
  const updates = [];
  for (const row of data.rows) {
    counts.fields.total += row.changes.length;
    const keyChange = row.changes.filter(function (c) { return c.field === 'answer'; })[0] || null;
    if (keyChange) counts.keys.total += 1;
    const found = docsById[row.id] || [];
    const fail = function (path, why) { mismatches.push({ id: row.id, path: path, why: why }); };
    let problem = null;
    if (found.length === 0) problem = 'row not found in the collection';
    else if (found.length > 1) problem = 'id appears ' + found.length + ' times in the collection';
    const doc = problem ? null : found[0];
    if (doc) {
      // The arrays must still have the length they had at export: an element
      // is changed by its position, so nothing may have moved.
      for (const a of ARRAYS) {
        const touches = row.changes.some(function (c) { return c.field === a; });
        if (touches && (!Array.isArray(doc[a]) || doc[a].length !== row.arrayLengths[a])) {
          problem = 'stored ' + a + ' has ' + (Array.isArray(doc[a]) ? doc[a].length : 'no') + ' element(s), expected ' + row.arrayLengths[a];
        }
      }
    }
    if (problem) {
      fail('(row)', problem);
      counts.rows.mismatched += 1;
      counts.fields.mismatched += row.changes.length;
      if (keyChange) counts.keys.mismatched += 1;
      continue;
    }
    // The filter pins the document AND every value about to be replaced, so
    // a row that changed between the read and the write matches nothing.
    const filter = { _id: doc._id, id: row.id };
    const setDoc = {};
    let bad = 0;
    for (const c of row.changes) {
      const scalar = SCALARS.indexOf(c.field) >= 0 && c.index === null;
      const element = ARRAYS.indexOf(c.field) >= 0 && typeof c.index === 'number' && c.index >= 0 && Math.floor(c.index) === c.index;
      const path = c.field + (c.index === null ? '' : '[' + c.index + ']');
      const r = scalar || element ? classifyChange(doc, c) : { state: 'mismatch', why: 'the data names a field this script does not write' };
      if (r.state === 'mismatch') { counts.fields.mismatched += 1; bad += 1; fail(path, r.why); if (c === keyChange) counts.keys.mismatched += 1; }
      else if (r.state === 'already') { counts.fields.alreadyApplied += 1; if (c === keyChange) counts.keys.alreadyApplied += 1; }
      else {
        counts.fields.toChange += 1;
        if (c === keyChange) counts.keys.toChange += 1;
        const mongoPath = c.index === null ? c.field : c.field + '.' + c.index;
        filter[mongoPath] = fromOf(c);
        setDoc[mongoPath] = toOf(c);
        if (c.index !== null) filter[c.field] = { $size: row.arrayLengths[c.field] };
      }
    }
    if (bad > 0) counts.rows.mismatched += 1;
    else if (Object.keys(setDoc).length > 0) { counts.rows.toChange += 1; updates.push({ id: row.id, _id: doc._id, filter: filter, update: { $set: setDoc } }); }
    else counts.rows.alreadyApplied += 1;
  }
  return { counts: counts, mismatches: mismatches, updates: updates };
}

function line(label, c) {
  return label + ': ' + c.total + ' in the data · to change ' + c.toChange + ' · already ' + (DIRECTION === 'apply' ? 'applied' : 'reverted') + ' ' + c.alreadyApplied + ' · mismatched ' + c.mismatched;
}

function serialise(value) {
  // EJSON (mongosh) keeps ObjectIds, dates and other BSON types exactly;
  // plain JSON is the fallback outside mongosh.
  if (typeof EJSON !== 'undefined' && EJSON && typeof EJSON.stringify === 'function') return EJSON.stringify(value, null, 1, { relaxed: false });
  return JSON.stringify(value, null, 1);
}

function group(docs) {
  const byId = {};
  for (const d of docs) { if (!byId[d.id]) byId[d.id] = []; byId[d.id].push(d); }
  return byId;
}

/* ---------- run ---------- */

const dataPath = process.env.DATA;
if (!dataPath) throw new Error('set DATA to the path of __DATA_FILE__');
if (db.getName() !== 'evelyn') throw new Error('connected to database "' + db.getName() + '", expected "evelyn" — put the database name in the URI');
const dataBytes = fs.readFileSync(dataPath);
const sha = crypto.createHash('sha256').update(dataBytes).digest('hex');
if (sha !== EXPECTED_SHA256) throw new Error('DATA is not the file this script was built with (sha256 ' + sha + ', expected ' + EXPECTED_SHA256 + ') — rebuild both together');
const data = JSON.parse(dataBytes.toString('utf8'));
if (data.formatVersion !== 1 || data.database !== 'evelyn' || data.collection !== 'problembanks' || !Array.isArray(data.rows)) throw new Error('unexpected data file shape');
if (data.rows.length !== EXPECTED_COUNTS.rows) throw new Error('expected ' + EXPECTED_COUNTS.rows + ' rows in the data, got ' + data.rows.length);
const rowIds = data.rows.map(function (r) { return r.id; });
if (new Set(rowIds).size !== rowIds.length) throw new Error('duplicate row ids in the data');
for (const id of rowIds) if (!/^practice-gen\.gen-[0-9a-f-]{36}\.lo-\d+\.[a-z0-9]+$/.test(id)) throw new Error('unexpected row id ' + id);

const APPLY = process.env.APPLY === '1';
const backupPath = process.env.BACKUP;
if (APPLY && !backupPath) throw new Error('APPLY=1 needs BACKUP=<path of a new file> for the original documents');
if (APPLY && fs.existsSync(backupPath)) throw new Error('BACKUP file already exists: ' + backupPath + ' — name a new file, an earlier backup is never overwritten');

print((DIRECTION === 'apply' ? 'APPLY practice-item fixes' : 'REVERT practice-item fixes') + ' — ' + (APPLY ? 'WRITING' : 'DRY RUN'));
const docsById = group(db.problembanks.find({ id: { $in: rowIds } }).toArray());
const run = planRun(data, docsById);
print(line('rows', run.counts.rows));
print(line('fields', run.counts.fields));
print(line('answer keys', run.counts.keys));

if (run.mismatches.length > 0) {
  print('MISMATCHES (' + run.mismatches.length + ') — nothing written:');
  for (const m of run.mismatches) print('  row ' + m.id + ' ' + m.path + ': ' + m.why);
  throw new Error(run.mismatches.length + ' stored value(s) do not match — aborted before any write');
}

if (!APPLY) {
  print('DRY RUN — nothing written. Set APPLY=1 and BACKUP=<new file> to write.');
} else if (run.updates.length === 0) {
  print('Nothing to change — no backup written, nothing written.');
} else {
  const touched = run.updates.map(function (u) { return docsById[u.id][0]; });
  fs.mkdirSync(require('path').dirname(backupPath), { recursive: true });
  fs.writeFileSync(backupPath, serialise(touched), { flag: 'wx' });
  const check = fs.readFileSync(backupPath, 'utf8');
  if (JSON.parse(check).length !== touched.length) throw new Error('backup file did not read back — nothing written');
  print('backup: ' + touched.length + ' original document(s) → ' + backupPath);
  let rowsWritten = 0;
  for (const u of run.updates) {
    const res = db.problembanks.updateOne(u.filter, u.update);
    if (res.matchedCount !== 1 || res.modifiedCount !== 1) {
      throw new Error('STOPPED at row ' + u.id + ': the document changed after it was read (matched ' + res.matchedCount + ', modified ' + res.modifiedCount + '). ' +
        rowsWritten + ' row(s) were written before this one; re-run the dry run to see the state. Originals are in ' + backupPath);
    }
    rowsWritten += 1;
  }
  print('rows written: ' + rowsWritten);
  // Read back: every change must now be in its target state.
  const verify = planRun(data, group(db.problembanks.find({ id: { $in: rowIds } }).toArray()));
  print('after — ' + line('fields', verify.counts.fields));
  if (verify.mismatches.length > 0 || verify.counts.fields.toChange !== 0) throw new Error('read-back check failed: ' + verify.mismatches.length + ' mismatch(es), ' + verify.counts.fields.toChange + ' still to change');
  print('read-back check passed.');
}
`;

export function renderScript(meta: ScriptMeta): string {
  const verb = meta.direction === 'apply' ? 'Applies' : 'REVERTS';
  const header = [
    `// ${verb} the reviewed practice-item fixes ${meta.direction === 'apply' ? 'to' : 'in'} the \`problembanks\` collection (db \`evelyn\`).`,
    `// Generated ${meta.generatedAt} by apps/tutor/scripts/practice-fix/build-apply-script.ts — do not edit; rebuild.`,
    `// Data: ${meta.dataFileName} (sha256 ${meta.dataSha256}) — ${meta.counts.rows} rows, ${meta.counts.fields} field values, ${meta.counts.keyChanges} of them answer keys.`,
    '//',
    meta.direction === 'apply'
      ? '// For every field: the stored value must equal the fix\'s `old` exactly, and becomes `new`.'
      : '// For every field: the stored value must equal the fix\'s `new` exactly, and becomes `old` again.',
    '// A field already in its target state is counted, not an error (re-runnable).',
    '// ANY other stored value — or a missing row, a duplicated id, an array of another length — aborts the whole run before the first write.',
    '// A row is found by its `id` field (exactly one document must have it). Writes only the listed fields, by explicit path',
    '// (`problemText`, `answer`, `solutionText`, `hints.<i>`, `choices.<i>`); never replaces a document or an array, never adds or removes an element.',
    '// Does not touch `updatedAt` or any other field (nothing reads `updatedAt` on these rows; see build-report.json).',
    '// Dry run by default. APPLY=1 writes, after saving the full original documents to BACKUP (a NEW file).',
    '//',
    `//   Dry run:  DATA=<path>/${meta.dataFileName} mongosh --quiet "<uri>/evelyn?directConnection=true" ${meta.scriptName}`,
    `//   Write:    APPLY=1 BACKUP=<new file>.json DATA=<path>/${meta.dataFileName} mongosh --quiet "<uri>/evelyn?directConnection=true" ${meta.scriptName}`,
  ].join('\n');
  const body = BODY
    .replace('__DIRECTION__', meta.direction)
    .replace('__SHA256__', meta.dataSha256)
    .replace('__COUNTS__', JSON.stringify(meta.counts))
    .replace('__DATA_FILE__', meta.dataFileName);
  return `${header}\n${body}`;
}
