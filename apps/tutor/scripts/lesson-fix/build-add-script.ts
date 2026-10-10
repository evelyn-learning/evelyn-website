/**
 * Turn the written files (validated, read clean) into one mongosh script,
 * its data file, the revert script, a build report and the owner's review
 * document. Local files only — this builds the scripts; it never connects
 * to a database and never runs them.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/build-add-script.ts [--allow-partial]
 *
 * A pack is built only when written/NNN.json validates with no error AND
 * read/NNN.json records a "clean" verdict for exactly those bytes. Without
 * --allow-partial the build refuses unless that holds for every pack.
 * The expected stored state is the 10-06 dump with ALL correction sets
 * applied (add-io.ts CORRECTION_FILES). Writes (…/lesson-add-2026-10-12/tooling/):
 *   lesson-additions.data.json
 *   apply-lesson-additions.mongosh.js
 *   revert-lesson-additions.mongosh.js
 *   apply-build-report.json
 *   additions-review.md
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { buildAddData, buildPlanData, type AddData, type AddPack, type AddPlanData } from './add-core';
import { CORRECTION_FILES, DUMP_FILE, loadPacks, loadPreStates, readVerdictProblem, REQUIRES, TOOLING_DIR, validateDir, WRITTEN_DIR } from './add-io';
import { ADD_SCRIPT_NAMES, renderAddScript } from './add-script-template';

export const ADD_DATA_FILE = 'lesson-additions.data.json';
const DATA_DIR = path.resolve(__dirname, '../../src/data');

const SUBJECT_NAMES: Readonly<Record<string, string>> = {
  ALGEBRA_2: 'Algebra 2', AP_BIOLOGY: 'AP Biology', AP_CALCULUS_AB: 'AP Calculus AB', AP_CHEMISTRY: 'AP Chemistry', PHYSICS: 'Physics', PRECALCULUS: 'Precalculus',
};

/** Stored values one plan's two updates change or add. */
export function fieldsChanged(p: AddPlanData): number {
  const k = p.add.los.length;
  // los +k · segments +4k · recap mustRemember +k · pickedLoIds +k · intro goal,
  // recap teacherNote, estimatedMinutes, allowedMaxLOs, addedLoIds.
  return k + p.add.segments.length + k + k + 5;
}

function quote(text: unknown): string {
  return String(text).replace(/\|/g, '\\|');
}

export function renderReview(data: AddData, packs: Map<string, AddPack>, generatedAt: string): string {
  const out: string[] = [];
  out.push('# Lesson additions — what will be stored', '');
  out.push(`Generated ${generatedAt} from the written files (each read clean; hash-matched). ${data.counts.plans} lessons · ${data.counts.objectives} new objectives · ${data.counts.segments} new segments · ${data.plans.reduce((a, p) => a + fieldsChanged(p), 0)} stored values added or changed.`, '');
  out.push(`Expected stored state before the run: ${data.requires}.`, '');
  out.push('Per lesson: the plan-level fields that change, then each new objective with its four segments exactly as they will be stored (fields the generator leaves empty are stored as null and not shown).', '');
  const subjects = [...new Set(data.plans.map((p) => p.subject))].sort();
  for (const subject of subjects) {
    const plans = data.plans.filter((p) => p.subject === subject);
    out.push(`## ${SUBJECT_NAMES[subject] ?? subject} — ${plans.length} lessons, ${plans.reduce((a, p) => a + p.add.los.length, 0)} new objectives`, '');
    for (const p of plans) {
      const pack = packs.get(p.pack) as AddPack;
      const n0 = p.pre.los.length;
      const n = n0 + p.add.los.length;
      out.push(`### Lesson ${p.pack} — ${pack.title}`, '');
      out.push(`Plan \`${p.planId}\` (objective ids from \`${p.pickerPlanId}\`).`, '');
      out.push('| Field | Before | After |', '|---|---|---|');
      out.push(`| objectives (\`los\`) | ${n0} | ${n}: adds ${p.add.los.map((l, i) => `${n0 + i + 1}. ${quote(l.description)} — short title "${quote(l.shortTitle)}"`).join('; ')} |`);
      out.push(`| segments | ${p.pre.segmentIds.length} | ${p.pre.segmentIds.length + p.add.segments.length} (4 per new objective, inserted before the recap) |`);
      out.push(`| intro goal | ${quote(p.pre.introGoal)} | ${quote(p.post.introGoal)} |`);
      out.push(`| recap \`mustRemember\` | ${n0} lines | ${n} lines: adds ${p.add.los.map((l) => `"${quote(l.description)}"`).join('; ')} |`);
      out.push(`| recap \`teacherNote\` | ${quote(p.pre.recapTeacherNote)} | ${quote(p.post.recapTeacherNote)} |`);
      out.push(`| \`estimatedMinutes\` | ${p.pre.estimatedMinutes} | ${p.post.estimatedMinutes} |`);
      out.push(`| \`metadata.pickedLoIds\` | ${n0} ids | ${n} ids (adds lo-${n0 + 1}${n > n0 + 1 ? `…lo-${n}` : ''}) |`);
      out.push(`| \`metadata.allowedMaxLOs\` | ${p.pre.allowedMaxLOs} | ${p.post.allowedMaxLOs} |`);
      out.push(`| \`metadata.addedLoIds\` | absent | the ${p.add.los.length} new id(s) |`, '');
      p.add.los.forEach((lo, i) => {
        const [hook, concept, worked, tri] = p.add.segments.slice(4 * i, 4 * i + 4);
        out.push(`#### Objective ${n0 + i + 1}: ${lo.description}`, '');
        out.push(`- **Hook** — ${hook.goal as string}`);
        out.push(`- **Concept** — ${concept.goal as string}`);
        for (const idea of concept.keyIdeas as string[]) out.push(`  - ${idea}`);
        out.push(`- **Worked example** — ${worked.problem as string}`);
        (worked.steps as string[]).forEach((s, j) => out.push(`  ${j + 1}. ${s}`));
        out.push(`  - Answer: ${worked.answer as string}`);
        out.push(`- **Try yourself** — ${tri.problem as string}`);
        out.push(`  - Expected answer: ${tri.expectedAnswer as string}`);
        out.push(`  - Step id: \`${p.planId}::${tri.id as string}\``, '');
      });
    }
  }
  return `${out.join('\n')}\n`;
}

/** The new practice-step ids against everything local that could collide. */
function stepIdChecks(data: AddData): Record<string, unknown> {
  const dump = JSON.parse(fs.readFileSync(DUMP_FILE, 'utf8')) as { plans: Array<{ _id: string; segments: Array<{ id: string }> }>; bank: Array<{ id: string }> };
  const idsOf = (file: string): Set<string> => new Set(Object.keys((JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8')) as { items: Record<string, unknown> }).items));
  const withdrawn = idsOf('withdrawn-practice-items.json');
  const auditedSteps = idsOf('audited-lesson-steps.json');
  const segmentIds = new Set<string>();
  const stepIds = new Set<string>();
  for (const p of dump.plans) for (const s of p.segments) { segmentIds.add(s.id); stepIds.add(`${p._id}::${s.id}`); }
  const bankIds = new Set(dump.bank.map((b) => b.id));
  const newSegments = data.plans.flatMap((p) => p.add.segments.map((s) => ({ planId: p.planId, id: s.id as string, kind: s.kind as string })));
  const newSteps = newSegments.filter((s) => s.kind === 'try_yourself').map((s) => `${s.planId}::${s.id}`);
  const all = newSegments.map((s) => `${s.planId}::${s.id}`);
  return {
    newTryYourselfStepIds: newSteps,
    count: newSteps.length,
    distinct: new Set(all).size === all.length,
    onWithdrawnList: newSteps.filter((id) => withdrawn.has(id)),
    onAuditedLessonStepList: newSteps.filter((id) => auditedSteps.has(id)),
    newSegmentIdAlreadyInAnyDumpedPlan: newSegments.filter((s) => segmentIds.has(s.id)).map((s) => s.id),
    newStepIdAlreadyInAnyDumpedPlan: all.filter((id) => stepIds.has(id)),
    equalToABankRowId: [...newSteps, ...newSegments.map((s) => s.id)].filter((id) => bankIds.has(id)),
    objectiveNumbers: [...new Set(newSegments.map((s) => Number(/\.lo-(\d+)-/.exec(s.id)?.[1])))].sort(),
    checkedAgainst: { dumpedPlans: dump.plans.length, dumpedSegments: stepIds.size, dumpedBankRows: bankIds.size, withdrawnList: withdrawn.size, auditedLessonStepList: auditedSteps.size },
  };
}

function main(): void {
  const allowPartial = process.argv.includes('--allow-partial');
  const packs = loadPacks();
  const pre = loadPreStates();
  const plans: AddPlanData[] = [];
  const excluded: Array<{ pack: string; why: string }> = [];
  let warnings = 0;
  for (const r of validateDir(WRITTEN_DIR, packs)) {
    const pack = packs.get(r.pack);
    const errors = r.issues.filter((i) => i.level === 'error');
    warnings += r.issues.length - errors.length;
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
  const data = buildAddData(plans, REQUIRES);
  const dataText = `${JSON.stringify(data, null, 1)}\n`;
  const dataSha256 = crypto.createHash('sha256').update(Buffer.from(dataText, 'utf8')).digest('hex');
  const generatedAt = new Date().toISOString();
  fs.mkdirSync(TOOLING_DIR, { recursive: true });
  fs.writeFileSync(path.join(TOOLING_DIR, ADD_DATA_FILE), dataText);
  for (const direction of ['apply', 'revert'] as const) {
    fs.writeFileSync(path.join(TOOLING_DIR, ADD_SCRIPT_NAMES[direction]), renderAddScript({ direction, dataSha256, dataFileName: ADD_DATA_FILE, counts: data.counts, generatedAt, excludedPacks: excluded.map((e) => e.pack) }));
  }
  fs.writeFileSync(path.join(TOOLING_DIR, 'additions-review.md'), renderReview(data, packs, generatedAt));
  const subjects = [...new Set(data.plans.map((p) => p.subject))].sort();
  const steps = stepIdChecks(data);
  const report = {
    generatedAt,
    dataFile: ADD_DATA_FILE,
    dataSha256,
    expectedStoredState: { dump: DUMP_FILE, thenApplied: CORRECTION_FILES },
    counts: { ...data.counts, storedValuesAddedOrChanged: data.plans.reduce((a, p) => a + fieldsChanged(p), 0), updatesPerPlan: 2 },
    validationWarnings: warnings,
    excludedPacks: excluded,
    countsBySubject: Object.fromEntries(subjects.map((s) => {
      const ps = data.plans.filter((p) => p.subject === s);
      return [s, { plans: ps.length, objectives: ps.reduce((a, p) => a + p.add.los.length, 0), segments: ps.reduce((a, p) => a + p.add.segments.length, 0), storedValues: ps.reduce((a, p) => a + fieldsChanged(p), 0) }];
    })),
    plans: data.plans.map((p) => ({
      pack: p.pack,
      planId: p.planId,
      objectivesAfter: p.post.allowedMaxLOs,
      estimatedMinutesAfter: p.post.estimatedMinutes,
      addedLoIds: p.add.los.map((l) => l.id),
    })),
    stepIdChecks: steps,
    notWrittenByTheScript: [
      'updatedAt, the picker plans, metadata.availableLOs / sessionMinutes, any existing teaching text.',
      'src/data/withdrawn-practice-items.json — the only list that keeps one of the new steps out of practice (it also hides the step\'s key from the tutor in a session).',
      'src/data/audited-lesson-steps.json — has no effect on these steps on either build (design.md §5).',
    ],
  };
  fs.writeFileSync(path.join(TOOLING_DIR, 'apply-build-report.json'), `${JSON.stringify(report, null, 1)}\n`);
  console.log(`built for ${data.counts.plans} plans · ${data.counts.objectives} objectives · ${data.counts.segments} segments · ${report.counts.storedValuesAddedOrChanged} stored values (data sha256 ${dataSha256.slice(0, 12)}…) · validation warnings ${warnings}`);
  console.log(`step ids: ${String(steps.count)} new try_yourself · withdrawn ${(steps.onWithdrawnList as string[]).length} · on audited list ${(steps.onAuditedLessonStepList as string[]).length} · segment-id collisions ${(steps.newSegmentIdAlreadyInAnyDumpedPlan as string[]).length} · bank-id collisions ${(steps.equalToABankRowId as string[]).length} · distinct ${String(steps.distinct)}`);
  if (excluded.length) console.log(`EXCLUDED ${excluded.length} pack(s) — see apply-build-report.json`);
  console.log(`output: ${TOOLING_DIR}`);
}

if (require.main === module) main();
