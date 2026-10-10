/**
 * Turn the VALIDATED practice-item fixes into one self-contained mongosh
 * script, its data file, and the companion revert script. Local files only —
 * this builds the script; it never connects to a database and never runs it.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/practice-fix/build-apply-script.ts
 *
 * Refuses to build when validation (structure, item rules, or the product's
 * grading of a corrected row) has any error. Writes (tooling folder):
 *   practice-fixes.data.json
 *   apply-practice-fixes.mongosh.js
 *   revert-practice-fixes.mongosh.js
 *   build-report.json
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { buildApplyData } from './core';
import { gradeResolved } from './grading';
import { DATA_FILE, TOOLING_DIR, scriptFile, validateAll } from './io';
import { renderScript } from './script-template';

async function main(): Promise<void> {
  const { result, file } = validateAll();
  if (!result.ok) {
    console.error(`validation has ${result.totals.errors} error(s) — nothing built. Run validate-fixes.ts and correct fixes.json.`);
    process.exit(1);
  }
  const failed = (await gradeResolved(result.resolved)).filter((g) => !g.ok);
  if (failed.length > 0) {
    console.error(`${failed.length} corrected row(s) fail the product's grading — nothing built: ${failed.map((g) => `…${g.suffix}`).join(', ')}`);
    process.exit(1);
  }
  if (result.resolved.length === 0) {
    console.error('no fixes — nothing built.');
    process.exit(1);
  }
  const data = buildApplyData(result.resolved);
  const dataText = `${JSON.stringify(data, null, 1)}\n`;
  const dataSha256 = crypto.createHash('sha256').update(Buffer.from(dataText, 'utf8')).digest('hex');
  const generatedAt = new Date().toISOString();
  fs.mkdirSync(TOOLING_DIR, { recursive: true });
  fs.writeFileSync(path.join(TOOLING_DIR, DATA_FILE), dataText);
  for (const direction of ['apply', 'revert'] as const) {
    fs.writeFileSync(path.join(TOOLING_DIR, scriptFile(direction)), renderScript({ direction, scriptName: scriptFile(direction), dataSha256, dataFileName: DATA_FILE, counts: data.counts, generatedAt }));
  }
  const res = result.resolved;
  const tally = <K extends string>(key: (r: (typeof res)[number]) => K): Record<string, { rows: number; fields: number }> => {
    const o: Record<string, { rows: number; fields: number }> = {};
    for (const r of res) { const k = (o[key(r)] ??= { rows: 0, fields: 0 }); k.rows += 1; k.fields += r.item.changes.length; }
    return Object.fromEntries(Object.entries(o).sort());
  };
  const report = {
    generatedAt,
    dataFile: DATA_FILE,
    scripts: { apply: scriptFile('apply'), revert: scriptFile('revert') },
    baseline: 'the stored rows as exported to older-bank-rows.json (2026-10-10); the dry run compares every `old` with the collection',
    dataSha256,
    counts: data.counts,
    countsByKind: tally((r) => r.item.kind),
    countsBySubject: tally((r) => r.item.subject),
    fieldsByField: result.totals.byField,
    keyChanges: res.filter((r) => r.item.keyChanged).map((r) => {
      const c = r.item.changes.find((x) => x.field === 'answer') as { old: string; new: string };
      return { id: r.item.id, subject: r.item.subject, format: r.item.format, old: c.old, new: c.new, working: r.item.working };
    }),
    warnings: result.totals.warnings,
    borderlineHintsListedNotChanged: file.borderlineHints?.length ?? 0,
    updatedAt: 'left untouched, as the lesson-corrections script does for lesson plans. Checked 2026-10-10: nothing reads `updatedAt` on problembanks and no cache is keyed on it or on a content hash — the engine reads rows with a plain find on every request (src/lib/tutor/portal/adapters.ts safeBankQuery / findOne by id; src/lib/tutor/voice/problem-generator.ts queryBank; src/lib/tutor/mock-exam/service.ts). mongosh updateOne does not bump Mongoose timestamps by itself.',
    notWrittenByTheScript: [
      'Portal (academy) copies of items already drawn: PracticeSet.items / Quiz.items keep the OLD text and key; multiple-choice and numeric answers are graded by the portal against that copy. Free-text answers are graded by the engine, which re-reads the row: NEW key against the OLD question the student still sees.',
      '`embedding` (when a row has one) was computed from the old problemText; `verifiedAt` / `verifierModel` record the check of the OLD answer. Neither is changed.',
      'The lists compiled into each build and keyed by row id (src/data/withdrawn-practice-items.json and the audited list): a corrected row keeps its id, so a verdict given on the old text still applies to it until the list is rebuilt.',
      'Rows on the withdraw list (withdraw-ids.json) are not corrected.',
    ],
  };
  fs.writeFileSync(path.join(TOOLING_DIR, 'build-report.json'), `${JSON.stringify(report, null, 1)}\n`);
  console.log(`built for ${data.counts.rows} rows · ${data.counts.fields} field values · ${data.counts.keyChanges} answer key(s) (data sha256 ${dataSha256.slice(0, 12)}…)`);
  console.log(`by kind: ${Object.entries(report.countsByKind).map(([k, v]) => `${k} ${v.rows}/${v.fields}`).join(' · ')}`);
  console.log(`output: ${TOOLING_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
