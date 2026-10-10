/**
 * Offline check of the practice-item corrections (fixes.json) against the
 * exported rows and the product's grading. No database, no network, no model.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/practice-fix/validate-fixes.ts
 *
 * Checks: every `old` equals the exported row's current value; no change
 * equal to its old; the item rules on the row as it would be stored (mcq
 * options distinct with the key one of them, numeric key a bare number, the
 * key not printed in the stem or a hint, no hint that spells out the final
 * arithmetic, nothing that names an option by position); and the product's
 * own grading of the corrected row (key and equivalent forms accepted, wrong
 * answers — including the OLD key where the key changed — rejected).
 *
 * Writes (…/older-items-truth-read-2026-10-17/tooling/):
 *   validation-report.json  — totals, every error / warning, grading per row;
 *   fixes-diff.md           — summary table, then per item old → new.
 * Exit code 1 when any error is found.
 */
import fs from 'node:fs';
import path from 'node:path';
import { renderDiffMarkdown } from './core';
import { gradeResolved, gradingLines } from './grading';
import { FIXES_FILE, ROWS_FILE, TOOLING_DIR, WITHDRAW_FILE, validateAll } from './io';
import { networkGuard } from './product-grader';

async function main(): Promise<void> {
  const { result, file, withdrawnIds, rows, batches } = validateAll();
  const graded = await gradeResolved(result.resolved);
  const gradingFailures = graded.filter((g) => !g.ok);
  const ok = result.ok && gradingFailures.length === 0;
  const generatedAt = new Date().toISOString();
  const outcomes: Record<string, number> = {};
  for (const g of graded) for (const s of g.subs) outcomes[`${g.format}:${s.cls}:${s.outcome}`] = (outcomes[`${g.format}:${s.cls}:${s.outcome}`] ?? 0) + 1;
  const count = (list: Array<{ code: string }>): Record<string, number> => Object.fromEntries(Object.entries(list.reduce<Record<string, number>>((a, i) => { a[i.code] = (a[i.code] ?? 0) + 1; return a; }, {})).sort());
  const report = {
    generatedAt,
    inputs: { rows: ROWS_FILE, fixes: FIXES_FILE, withdraw: WITHDRAW_FILE },
    ok,
    exportedRows: rows.size,
    servedRows: batches.size,
    withdrawnIds: withdrawnIds.size,
    totals: result.totals,
    borderlineHintsListedNotChanged: file.borderlineHints?.length ?? 0,
    errorsByCode: count(result.issues.filter((i) => i.level === 'error')),
    warningsByCode: count(result.issues.filter((i) => i.level === 'warning')),
    grading: {
      rowsGraded: graded.length,
      rowsFailed: gradingFailures.length,
      rowsWhoseKeyOnlyTheJudgeDecides: graded.filter((g) => g.judgeOnly).map((g) => g.suffix),
      submissions: graded.reduce((a, g) => a + g.subs.length, 0),
      submissionsByFormatClassOutcome: Object.fromEntries(Object.entries(outcomes).sort()),
      failures: gradingFailures.map((g) => ({ id: g.id, problems: g.problems })),
      networkGuard,
    },
    issues: result.issues,
    gradedRows: graded,
  };
  fs.mkdirSync(TOOLING_DIR, { recursive: true });
  fs.writeFileSync(path.join(TOOLING_DIR, 'validation-report.json'), `${JSON.stringify(report, null, 1)}\n`);
  fs.writeFileSync(path.join(TOOLING_DIR, 'fixes-diff.md'), renderDiffMarkdown(result, generatedAt, gradingLines(graded)));

  const t = result.totals;
  console.log(`items ${t.items} · rows that validate ${t.rows} · field values ${t.fields} · key changes ${t.keyChanges} · errors ${t.errors} · warnings ${t.warnings}`);
  console.log(`by kind: ${Object.entries(t.byKind).map(([k, v]) => `${k} ${v.rows} rows / ${v.fields} fields`).join(' · ')} · by field: ${Object.entries(t.byField).sort().map(([k, v]) => `${k} ${v}`).join(', ')}`);
  console.log(`grading: ${graded.length} rows, ${report.grading.submissions} submissions, ${gradingFailures.length} row(s) failed, ${report.grading.rowsWhoseKeyOnlyTheJudgeDecides.length} text key(s) left to the model judge · network guard ${JSON.stringify(networkGuard)}`);
  for (const i of result.issues.filter((x) => x.level === 'error').slice(0, 60)) console.log(`  ERROR ${i.code} …${i.suffix} ${i.path ?? ''}: ${i.message}`);
  for (const g of gradingFailures) console.log(`  GRADING …${g.suffix}: ${g.problems.join('; ')}`);
  console.log(`warnings: ${JSON.stringify(report.warningsByCode)}`);
  console.log(`report: ${path.join(TOOLING_DIR, 'validation-report.json')}`);
  console.log(`diff:   ${path.join(TOOLING_DIR, 'fixes-diff.md')}`);
  if (!ok) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
