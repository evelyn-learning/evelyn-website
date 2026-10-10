/**
 * Offline check of the files written for the missing objectives (written/),
 * with each pack's reader verdict (read/NNN.json must be `clean` for the
 * exact bytes of the written file). No database, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/validate-additions.ts [NNN ...]
 *
 * With pack numbers, only those packs are checked (a writer checking their
 * own files) and no report is written. Otherwise writes
 * tooling/validation-report.json. Exit code 1 when any error is found or,
 * for a full run, any pack is not read clean.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadPacks, readVerdictProblem, TOOLING_DIR, validateDir, WRITTEN_DIR } from './add-io';

function main(): void {
  const only = process.argv.slice(2).filter((a) => /^\d{3}$/.test(a));
  const packs = loadPacks();
  const subset = only.length ? new Map([...packs].filter(([k]) => only.includes(k))) : packs;
  const results = validateDir(WRITTEN_DIR, subset).filter((r) => !only.length || only.includes(r.pack));
  const rows = results.map((r) => ({
    pack: r.pack,
    file: r.fileName,
    sha256: r.sha256,
    errors: r.issues.filter((i) => i.level === 'error').length,
    warnings: r.issues.filter((i) => i.level === 'warning').length,
    readerVerdict: r.sha256 ? (readVerdictProblem(r.pack, r.sha256) ?? 'clean') : 'no file',
    issues: r.issues,
  }));
  const errors = rows.reduce((a, r) => a + r.errors, 0);
  const warnings = rows.reduce((a, r) => a + r.warnings, 0);
  const readClean = rows.filter((r) => r.readerVerdict === 'clean').length;
  if (!only.length) {
    fs.mkdirSync(TOOLING_DIR, { recursive: true });
    fs.writeFileSync(path.join(TOOLING_DIR, 'validation-report.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), dir: WRITTEN_DIR, packs: rows.length, errors, warnings, readClean, rows }, null, 1)}\n`);
  }
  console.log(`written/: packs ${rows.length} · valid ${rows.filter((r) => r.errors === 0).length} · read clean (hash match) ${readClean} · errors ${errors} · warnings ${warnings}`);
  for (const r of rows) {
    for (const i of r.issues) console.log(`  ${i.level.toUpperCase()} ${i.code} pack ${i.pack} ${i.segmentId ? i.segmentId.replace(/^.*\.lo-/, 'lo-') : (i.loId ? i.loId.replace(/^.*\.lo-/, 'lo-') : '')} ${i.field ?? ''}: ${i.message}`);
    if (r.readerVerdict !== 'clean') console.log(`  NOT READ pack ${r.pack}: ${r.readerVerdict}`);
  }
  if (errors > 0 || (!only.length && readClean !== rows.length)) process.exit(1);
}

main();
