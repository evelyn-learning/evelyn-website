/**
 * Turn the files in final/ (written, read clean, validated) into one mongosh
 * script, its data file and the revert script. Local files only — this
 * builds the scripts; it never connects to a database and never runs them.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/build-add-script.ts [--allow-partial]
 *
 * A pack is built only when its final/NNN.json validates with no error AND
 * read/NNN.json records a "clean" verdict for exactly those bytes. Without
 * --allow-partial the build refuses unless that holds for every pack; with
 * it, the packs that qualify are built and the rest are named in the report
 * and in the script headers. Writes (…/lesson-add-2026-10-12/):
 *   lesson-additions.data.json
 *   apply-lesson-additions.mongosh.js
 *   revert-lesson-additions.mongosh.js
 *   add-build-report.json
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { buildAddData, buildPlanData, type AddPlanData } from './add-core';
import { ADD_DIR, FINAL_DIR, loadPacks, loadPreStates, readVerdictProblem, validateDir } from './add-io';
import { ADD_SCRIPT_NAMES, renderAddScript } from './add-script-template';

export const ADD_DATA_FILE = 'lesson-additions.data.json';

function main(): void {
  const allowPartial = process.argv.includes('--allow-partial');
  const packs = loadPacks();
  const pre = loadPreStates();
  const plans: AddPlanData[] = [];
  const excluded: Array<{ pack: string; why: string }> = [];
  for (const r of validateDir(FINAL_DIR, packs)) {
    const pack = packs.get(r.pack);
    const errors = r.issues.filter((i) => i.level === 'error');
    if (!pack || !r.file || errors.length) {
      excluded.push({ pack: r.pack, why: errors.map((e) => `${e.code}: ${e.message}`).join('; ') || 'not valid' });
      continue;
    }
    const unread = readVerdictProblem(r.pack, r.sha256);
    if (unread) { excluded.push({ pack: r.pack, why: unread }); continue; }
    const state = pre.get(pack.planId);
    if (!state) throw new Error(`pack ${r.pack}: no stored state for ${pack.planId}`);
    plans.push(buildPlanData(pack, state, r.file));
  }
  if (plans.length === 0 || (excluded.length > 0 && !allowPartial)) {
    console.error(`${excluded.length} of ${packs.size} pack(s) cannot be built — nothing written${plans.length ? ' (pass --allow-partial to build the others)' : ''}:`);
    for (const e of excluded.slice(0, 50)) console.error(`  pack ${e.pack}: ${e.why}`);
    process.exit(1);
  }
  const data = buildAddData(plans);
  const dataText = `${JSON.stringify(data, null, 1)}\n`;
  const dataSha256 = crypto.createHash('sha256').update(Buffer.from(dataText, 'utf8')).digest('hex');
  const generatedAt = new Date().toISOString();
  fs.writeFileSync(path.join(ADD_DIR, ADD_DATA_FILE), dataText);
  for (const direction of ['apply', 'revert'] as const) {
    fs.writeFileSync(path.join(ADD_DIR, ADD_SCRIPT_NAMES[direction]), renderAddScript({ direction, dataSha256, dataFileName: ADD_DATA_FILE, counts: data.counts, generatedAt, excludedPacks: excluded.map((e) => e.pack) }));
  }
  const subjects = [...new Set(data.plans.map((p) => p.subject))].sort();
  const report = {
    generatedAt,
    dataFile: ADD_DATA_FILE,
    dataSha256,
    counts: data.counts,
    excludedPacks: excluded,
    countsBySubject: Object.fromEntries(subjects.map((s) => {
      const ps = data.plans.filter((p) => p.subject === s);
      return [s, { plans: ps.length, objectives: ps.reduce((a, p) => a + p.add.los.length, 0), segments: ps.reduce((a, p) => a + p.add.segments.length, 0) }];
    })),
    plans: data.plans.map((p) => ({
      pack: p.pack,
      planId: p.planId,
      objectivesAfter: p.post.allowedMaxLOs,
      estimatedMinutesAfter: p.post.estimatedMinutes,
      addedLoIds: p.add.los.map((l) => l.id),
    })),
    newPracticeStepIds: data.plans.flatMap((p) => p.add.segments.filter((s) => s.kind === 'try_yourself').map((s) => `${p.planId}::${s.id as string}`)),
    notWrittenByTheScript: [
      'updatedAt, the picker plans, any existing teaching text.',
      'src/data/withdrawn-practice-items.json — the only list that keeps one of the new steps out of practice (it also hides the step\'s key from the tutor in a session).',
      'src/data/audited-lesson-steps.json — has no effect on these steps on either build (design.md §5).',
    ],
  };
  fs.writeFileSync(path.join(ADD_DIR, 'add-build-report.json'), `${JSON.stringify(report, null, 1)}\n`);
  console.log(`built for ${data.counts.plans} plans · ${data.counts.objectives} objectives · ${data.counts.segments} segments (data sha256 ${dataSha256.slice(0, 12)}…)`);
  if (excluded.length) console.log(`EXCLUDED ${excluded.length} pack(s) — see add-build-report.json`);
  console.log(`output: ${ADD_DIR}`);
}

if (require.main === module) main();
