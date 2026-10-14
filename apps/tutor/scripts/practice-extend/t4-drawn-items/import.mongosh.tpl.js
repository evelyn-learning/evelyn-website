// ⚠️⚠️ DO NOT APPLY UNTIL THE GATED ENGINE IS DEPLOYED. These are DRAWN-answer rows (contract v1.22.0,
// responseFormat 'drawn'). Insert them ONLY AFTER the shared engine (:3007) AND every build that reads this
// bank carries the drawn gate (apps/tutor/src/lib/tutor/portal/drawn-items.ts, PRACTICE_DRAWN_ANSWER_PARTNERS)
// is deployed. (An older build withholds them — their figure has no svg — but do not rely on that alone.)
// Also append final/audited-rows-to-append-t4.csv to the audited list at merge (GAC is audited-only).
//
// Imports the __N__ reviewed T4 drawn practice items (GreenApple 29-Oct release) into `problembanks`.
// INSERT-ONLY: a row whose `id` already exists is skipped, never overwritten.
// Dry run by default (find + countDocuments only); set APPLY=1 to write.
//
//   Dry run:  ROWS=<path>/import-rows-t4.json mongosh --quiet "mongodb://127.0.0.1:2710/evelyn?directConnection=true" import-t4.mongosh.js
//   Apply:    APPLY=1 ROWS=... mongosh --quiet "<uri>/evelyn?directConnection=true" import-t4.mongosh.js
const fs = require('fs');
const rowsPath = process.env.ROWS;
if (!rowsPath) throw new Error('set ROWS to the path of import-rows-t4.json');
if (db.getName() !== 'evelyn') throw new Error(`connected to database "${db.getName()}", expected "evelyn" — put the database name in the URI`);
const rows = JSON.parse(fs.readFileSync(rowsPath, 'utf8'));
if (!Array.isArray(rows) || rows.length !== __N__) throw new Error(`expected __N__ rows, got ${Array.isArray(rows) ? rows.length : typeof rows}`);
const ids = rows.map((r) => r.id);
if (new Set(ids).size !== ids.length) throw new Error('duplicate ids in the input');
for (const r of rows) {
  if (!/^practice-gen\.(?:gen-[0-9a-f-]{36}\.lo-\d+|[a-z0-9]+\.[a-z0-9-]+)\.[a-z0-9]+$/.test(r.id)) throw new Error(`unexpected id ${r.id}`);
  if (!r.id.startsWith(`practice-gen.${r.loId}.`)) throw new Error(`id/loId mismatch ${r.id}`);
  if (!r.problemText || !r.answer || r.responseFormat !== 'drawn') throw new Error(`bad row ${r.id}`);
  if (!r.drawn || !['grid-points', 'grid-line', 'number-line-interval'].includes(r.drawn.kind) || !r.drawn.key || !r.drawn.tolerance) throw new Error(`bad drawn spec ${r.id}`);
  if ('frame' in r.drawn) throw new Error(`a stored drawn spec carries no frame (added at serve time) ${r.id}`);
  if (!r.figure || 'svg' in r.figure || typeof r.figure.alt !== 'string' || !r.figure.alt.trim() || !r.figure.spec || !['coordinate_grid', 'number_line'].includes(r.figure.spec.type)) throw new Error(`a drawn row's figure is { alt, spec } with NO svg ${r.id}`);
}
const existing = new Set(db.problembanks.find({ id: { $in: ids } }, { id: 1 }).toArray().map((d) => d.id));
const now = new Date();
const docs = rows.filter((r) => !existing.has(r.id)).map((r) => ({
  ...r,
  hints: r.hints || [],
  choices: r.choices || [],
  verifiedAt: new Date(r.verifiedAt),
  createdAt: now,
  updatedAt: now,
  __v: 0,
}));
print(`rows in file: ${rows.length} · already present (skipped): ${existing.size} · to insert: ${docs.length}`);
if (existing.size) print(`present ids: ${[...existing].join(', ')}`);
print(`collection count before: ${db.problembanks.countDocuments({})}`);
print(`drawn rows in the collection now: ${db.problembanks.countDocuments({ responseFormat: 'drawn' })}`);
if (process.env.APPLY === '1') {
  if (docs.length) {
    const res = db.problembanks.insertMany(docs, { ordered: true });
    print(`inserted: ${Object.keys(res.insertedIds).length}`);
  }
  print(`collection count after: ${db.problembanks.countDocuments({})}`);
  print(`present now: ${db.problembanks.countDocuments({ id: { $in: ids } })} of ${ids.length}`);
} else {
  print('DRY RUN — nothing written. Set APPLY=1 to insert (only after the gated engine is deployed).');
}
