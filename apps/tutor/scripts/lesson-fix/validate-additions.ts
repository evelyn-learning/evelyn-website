/**
 * Offline check of the files written for the missing objectives. No
 * database, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/validate-additions.ts [written|final] [NNN ...]
 *
 * Default folder: written/. With pack numbers, only those packs are checked
 * (a writer checking their own files). Writes validation-<folder>.json when
 * all packs are checked. Exit code 1 when any error is found.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ADD_DIR, FINAL_DIR, loadPacks, readVerdictProblem, validateDir, WRITTEN_DIR } from './add-io';

function main(): void {
  const args = process.argv.slice(2);
  const which = args[0] === 'final' ? 'final' : 'written';
  const only = args.filter((a) => /^\d{3}$/.test(a));
  const dir = which === 'final' ? FINAL_DIR : WRITTEN_DIR;
  const packs = loadPacks();
  const subset = only.length ? new Map([...packs].filter(([k]) => only.includes(k))) : packs;
  const results = validateDir(dir, subset).filter((r) => !only.length || only.includes(r.pack));
  const rows = results.map((r) => ({
    pack: r.pack,
    file: r.fileName,
    sha256: r.sha256,
    errors: r.issues.filter((i) => i.level === 'error').length,
    warnings: r.issues.filter((i) => i.level === 'warning').length,
    readerVerdict: which === 'final' && r.sha256 ? (readVerdictProblem(r.pack, r.sha256) ?? 'clean') : undefined,
    issues: r.issues,
  }));
  const errors = rows.reduce((a, r) => a + r.errors, 0);
  const warnings = rows.reduce((a, r) => a + r.warnings, 0);
  if (!only.length) {
    fs.writeFileSync(path.join(ADD_DIR, `validation-${which}.json`), `${JSON.stringify({ generatedAt: new Date().toISOString(), dir, packs: rows.length, errors, warnings, rows }, null, 1)}\n`);
  }
  console.log(`${which}/: packs ${rows.length} · valid ${rows.filter((r) => r.errors === 0).length} · errors ${errors} · warnings ${warnings}`);
  for (const r of rows) {
    for (const i of r.issues) console.log(`  ${i.level.toUpperCase()} ${i.code} pack ${i.pack} ${i.segmentId ? i.segmentId.replace(/^.*\.lo-/, 'lo-') : (i.loId ? i.loId.replace(/^.*\.lo-/, 'lo-') : '')} ${i.field ?? ''}: ${i.message}`);
    if (r.readerVerdict && r.readerVerdict !== 'clean' && r.errors === 0) console.log(`  NOT READ pack ${r.pack}: ${r.readerVerdict}`);
  }
  if (errors > 0) process.exit(1);
}

main();
