/**
 * Offline check of the FINAL lesson-correction patch files (patches/final/,
 * built by merge-followups.ts) against the local lesson extracts. No database, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/validate-patches.ts
 *
 * Writes (under …/lesson-read-2026-10-10/tooling/):
 *   validation-report.json  — totals, every error / warning, practice impact;
 *   corrections-diff.md     — per subject → lesson → segment: old vs new.
 * Exit code 1 when any error is found.
 */
import fs from 'node:fs';
import path from 'node:path';
import { renderDiffMarkdown } from './core';
import { PATCH_DIR, TOOLING_DIR, assertWritable, validateAll } from './io';

function main(): void {
  assertWritable();
  const result = validateAll();
  const generatedAt = new Date().toISOString();
  fs.mkdirSync(TOOLING_DIR, { recursive: true });
  const report = {
    generatedAt,
    patchDir: PATCH_DIR,
    ok: result.ok,
    totals: result.totals,
    files: result.files,
    issues: result.issues,
    objectives: result.objectives,
    objectiveCopies: result.objectiveCopies,
    practiceImpact: result.practiceImpact,
    derivedNotWritten: result.derivedNotWritten,
  };
  fs.writeFileSync(path.join(TOOLING_DIR, 'validation-report.json'), `${JSON.stringify(report, null, 1)}\n`);
  fs.writeFileSync(path.join(TOOLING_DIR, 'corrections-diff.md'), renderDiffMarkdown(result, generatedAt));

  const t = result.totals;
  const values = result.objectives.length + result.segments.reduce((a, s) => a + s.changes.length, 0);
  console.log(`patch files ${t.files} · patches ${t.patches} · listed changes ${t.changes} · lessons ${t.plans} · segments ${result.segments.length} · objective fields ${result.objectives.length} · stored values to change ${values} · errors ${t.errors} · warnings ${t.warnings}`);
  for (const f of result.files) console.log(`  ${f.file}: ${f.patches} patches, ${f.changes} changes, ${f.skipped} skipped by the writer`);
  for (const i of result.issues.slice(0, 60)) {
    console.log(`  ${i.level.toUpperCase()} ${i.code} ${i.file} lesson ${i.pack ?? '?'} ${i.segmentId ?? ''} ${i.path ?? ''}: ${i.message}`);
  }
  console.log(`report: ${path.join(TOOLING_DIR, 'validation-report.json')}`);
  console.log(`diff:   ${path.join(TOOLING_DIR, 'corrections-diff.md')}`);
  if (t.files === 0) console.log('NOTE: no patch files found.');
  if (!result.ok) process.exit(1);
}

main();
