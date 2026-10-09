/**
 * Build patches/final/ — the writers' patch files with the re-check's
 * follow-ups folded in (one final change per field, one patch per segment).
 * Local files only. The writers' files and recheck.json are read, never
 * written; validate-patches.ts and build-apply-script.ts read final/ only.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/merge-followups.ts
 *
 * Writes patches/final/<name>.json for every writer file and
 * tooling/merge-report.json. Exit code 1 when a follow-up could not be folded.
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import type { PatchFile } from './core';
import { FINAL_PATCH_DIR, TOOLING_DIR, WRITER_PATCH_DIR, loadPatchFiles } from './io';
import { mergeFollowUps, type FollowUpPatch } from './merge-core';

const RECHECK = 'recheck.json';

/** Follow-ups that replace the writer's patch outright, with the re-check's
 *  own reason (recheck.json followUps item "validation-304"). */
const REPLACE_EXISTING = [
  {
    planId: 'gen-db288b82-668e-4db1-bd69-0ac385e4ffe7',
    segmentId: 'gen-db288b82-668e-4db1-bd69-0ac385e4ffe7.lo-4-try',
    reason: 'Re-check: "REPLACES the excluded patch (do not apply both)" — the new denominator makes the STORED key −6 correct, so the writer\'s key change (−6 → 6) is dropped.',
  },
];

function main(): void {
  const { files, loadIssues } = loadPatchFiles(WRITER_PATCH_DIR, [RECHECK]);
  if (loadIssues.length) {
    for (const i of loadIssues) console.error(`ERROR ${i.file}: ${i.message}`);
    process.exit(1);
  }
  const recheck = JSON.parse(fs.readFileSync(path.join(WRITER_PATCH_DIR, RECHECK), 'utf8')) as { followUps?: { patches?: FollowUpPatch[] } };
  const followUps = recheck.followUps?.patches ?? [];
  const result = mergeFollowUps(files, followUps, { replaceExisting: REPLACE_EXISTING });

  fs.mkdirSync(FINAL_PATCH_DIR, { recursive: true });
  for (const stale of fs.readdirSync(FINAL_PATCH_DIR).filter((f) => f.endsWith('.json'))) fs.rmSync(path.join(FINAL_PATCH_DIR, stale));
  for (const f of result.files as PatchFile[]) {
    const out = {
      subject: f.subject,
      source: `merged by apps/tutor/scripts/lesson-fix/merge-followups.ts from patches/${f.file} + patches/${RECHECK} (followUps)`,
      patches: f.patches,
      skipped: f.skipped,
    };
    fs.writeFileSync(path.join(FINAL_PATCH_DIR, f.file), `${JSON.stringify(out, null, 1)}\n`);
  }
  fs.mkdirSync(TOOLING_DIR, { recursive: true });
  const before = files.reduce((a, f) => a + f.patches.length, 0);
  const after = result.files.reduce((a, f) => a + f.patches.length, 0);
  const report = {
    generatedAt: new Date().toISOString(),
    writerFiles: files.map((f) => ({ file: f.file, patches: f.patches.length, changes: f.patches.reduce((a, p) => a + p.changes.length, 0) })),
    followUps: followUps.length,
    followUpsMarkedOptional: followUps.filter((f) => f.optional).map((f) => `${f.item} lesson ${f.pack} ${f.segmentId}`),
    patchesBefore: before,
    patchesAfter: after,
    changesAfter: result.files.reduce((a, f) => a + f.patches.reduce((b, p) => b + p.changes.length, 0), 0),
    problems: result.problems,
    notes: result.notes,
  };
  fs.writeFileSync(path.join(TOOLING_DIR, 'merge-report.json'), `${JSON.stringify(report, null, 1)}\n`);
  console.log(`writer files ${files.length} · follow-ups ${followUps.length} · patches ${before} → ${after} · field changes ${report.changesAfter} · problems ${result.problems.length}`);
  const tally = new Map<string, number>();
  for (const n of result.notes) tally.set(n.action, (tally.get(n.action) ?? 0) + 1);
  console.log(`  ${[...tally].map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  for (const p of result.problems) console.log(`  PROBLEM ${p.action} ${p.item} lesson ${p.pack} ${p.segmentId} ${p.path ?? ''}: ${p.detail}`);
  console.log(`final patches: ${FINAL_PATCH_DIR}`);
  if (result.problems.length) process.exit(1);
}

main();
