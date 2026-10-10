/**
 * Turn the VALIDATED patches into one self-contained mongosh script, its data
 * file, and the companion revert script. Local files only — this builds the
 * script; it never connects to a database and never runs it.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/build-apply-script.ts
 *
 * Refuses to build when validation has any error — unless run with
 * `--exclude-errored`, which builds from the patches that validate and
 * records every excluded patch in apply-build-report.json and in the script
 * headers (a subset is safe to apply; the excluded patches are simply not
 * in it). Writes (tooling folder):
 *   lesson-corrections.data.json
 *   apply-lesson-corrections.mongosh.js
 *   revert-lesson-corrections.mongosh.js
 *   apply-build-report.json
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { buildApplyData } from './core';
import { APPLIED_DATA_FILES, DATA_FILE, TOOLING_DIR, assertWritable, scriptFile, validateAll } from './io';
import { renderScript } from './script-template';


function main(): void {
  assertWritable();
  const result = validateAll();
  const excludeErrored = process.argv.includes('--exclude-errored');
  const errors = result.issues.filter((i) => i.level === 'error');
  // A file that failed to load, or a bad waiver, is never "excluded": what
  // it would have contained is unknown.
  const unexcludable = errors.filter((i) => !i.segmentId || ['file_parse', 'file_shape', 'bad_waiver', 'stale_waiver', 'duplicate_segment'].includes(i.code));
  if (!result.ok && (!excludeErrored || unexcludable.length > 0)) {
    console.error(`validation has ${result.totals.errors} error(s) — nothing built. Run validate-patches.ts and fix the patch files` +
      (unexcludable.length ? ` (${unexcludable.length} of them cannot be excluded).` : ', add a waiver, or pass --exclude-errored.'));
    process.exit(1);
  }
  const excluded = [...new Map(errors.map((i) => [`${i.planId}::${i.segmentId}`, { pack: i.pack, planId: i.planId, segmentId: i.segmentId, file: i.file, code: i.code, message: i.message }])).values()];
  if (result.segments.length === 0) {
    console.error('no patches — nothing built.');
    process.exit(1);
  }
  const data = buildApplyData(result.segments, result.objectives);
  const dataText = `${JSON.stringify(data, null, 1)}\n`;
  const dataSha256 = crypto.createHash('sha256').update(Buffer.from(dataText, 'utf8')).digest('hex');
  const generatedAt = new Date().toISOString();
  fs.mkdirSync(TOOLING_DIR, { recursive: true });
  fs.writeFileSync(path.join(TOOLING_DIR, DATA_FILE), dataText);
  for (const direction of ['apply', 'revert'] as const) {
    fs.writeFileSync(
      path.join(TOOLING_DIR, scriptFile(direction)),
      renderScript({ direction, scriptName: scriptFile(direction), dataSha256, dataFileName: DATA_FILE, counts: data.counts, generatedAt, excludedPatches: excluded.length }),
    );
  }
  const tryChanged = result.practiceImpact;
  const report = {
    generatedAt,
    dataFile: DATA_FILE,
    scripts: { apply: scriptFile('apply'), revert: scriptFile('revert') },
    baseline: APPLIED_DATA_FILES.length ? `the stored documents AFTER ${APPLIED_DATA_FILES.join(', ')} was applied` : 'the stored documents as first generated',
    dataSha256,
    counts: data.counts,
    patchFiles: result.files,
    warnings: result.totals.warnings,
    excludedPatchesWithErrors: excluded,
    countsBySubject: Object.fromEntries([...new Set([...result.segments.map((s) => s.subject), ...result.objectives.map((o) => o.subject)])].sort().map((subject) => {
      const segs = result.segments.filter((s) => s.subject === subject);
      const objs = result.objectives.filter((o) => o.subject === subject);
      return [subject, { plans: new Set([...segs.map((s) => s.planId), ...objs.map((o) => o.planId)]).size, segments: segs.length, objectives: objs.length, fields: objs.length + segs.reduce((a, s) => a + s.changes.length, 0) }];
    })),
    objectiveFields: result.objectives.map((o) => ({ pack: o.pack, planId: o.planId, loId: o.loId, field: o.field, old: o.old, new: o.new })),
    objectiveCopiesChanged: result.objectiveCopies.filter((c) => c.action !== 'listed'),
    cacheOrVersionBump: 'none needed — no content hash, version or updatedAt gates a cache of these plans (storage-notes.md §b); updatedAt is left untouched',
    notWrittenByTheScript: {
      derivedText: result.derivedNotWritten,
      objectiveCopiesListedNotChanged: result.objectiveCopies.filter((c) => c.action === 'listed'),
      practiceStepsChanged: {
        total: tryChanged.length,
        byStatus: Object.fromEntries((['withdrawn', 'objective-1', 'audited', 'neither'] as const).map((st) => [st, tryChanged.filter((p) => p.status === st).length])),
        inExpandedPlans: {
          total: tryChanged.filter((p) => p.expanded).length,
          withdrawn: tryChanged.filter((p) => p.expanded && p.status === 'withdrawn').map((p) => p.itemId),
          objective1ServedOnBothBuilds: tryChanged.filter((p) => p.expanded && p.status === 'objective-1').map((p) => p.itemId),
          notServedAsPractice: tryChanged.filter((p) => p.expanded && p.status === 'neither').map((p) => p.itemId),
        },
        neither: tryChanged.filter((p) => p.status === 'neither').map((p) => p.itemId),
        withdrawn: tryChanged.filter((p) => p.withdrawn).map((p) => p.itemId),
        onAuditedLessonStepList: tryChanged.filter((p) => p.auditedLessonStep && !p.withdrawn).map((p) => p.itemId),
        objective1ServedOnBothBuilds: tryChanged.filter((p) => p.objective === 1 && !p.withdrawn).map((p) => p.itemId),
      },
      elsewhere: [
        'Portal (academy) copies of practice items already drawn: PracticeSet.items / Quiz.items keep the OLD text and key, and multiple-choice / numeric answers are graded against that copy.',
        'lessonplanraillabels: short per-segment labels derived once per plan and cached by plan id.',
        'Plans expanded from a picker plan (other _id, same objective ids) — listed by the script at run time, never written.',
      ],
    },
  };
  fs.writeFileSync(path.join(TOOLING_DIR, 'apply-build-report.json'), `${JSON.stringify(report, null, 1)}\n`);
  console.log(`built for ${data.counts.plans} plans · ${data.counts.segments} segments · ${data.counts.fields} values, ${data.counts.objectives} of them objective descriptions / short titles (data sha256 ${dataSha256.slice(0, 12)}…)`);
  console.log(`practice steps changed: ${tryChanged.length} ${JSON.stringify(report.notWrittenByTheScript.practiceStepsChanged.byStatus)} · in expanded plans ${report.notWrittenByTheScript.practiceStepsChanged.inExpandedPlans.total}`);
  if (excluded.length) console.log(`EXCLUDED ${excluded.length} patch(es) with validation errors — see apply-build-report.json`);
  console.log(`output: ${TOOLING_DIR}`);
}

if (require.main === module) main();
