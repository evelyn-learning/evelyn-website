/**
 * How the local lesson files will differ once the active pass's data file is
 * applied: counts of segment fields and objective fields that change, per
 * kind, so the next lesson set (lessons-v3) can be built and checked the
 * same way. Local files only.
 *
 *   cd apps/tutor && LESSON_FIX_PASS=2 env -u MONGODB_URI npx tsx scripts/lesson-fix/next-lessons-check.ts
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { applyDataToDocs, type ApplyData } from './core';
import { DATA_FILE, LESSON_DIR, TOOLING_DIR, loadLessons } from './io';

function main(): void {
  const data = JSON.parse(fs.readFileSync(path.join(TOOLING_DIR, DATA_FILE), 'utf8')) as ApplyData;
  const lessons = loadLessons();
  // teacherNote is stored only (not in the lesson files): leave it out of the
  // in-memory apply and count it separately.
  const local: ApplyData = {
    ...data,
    plans: data.plans.map((p) => ({ ...p, segments: p.segments.map((s) => ({ ...s, changes: s.changes.filter((c) => c.field !== 'teacherNote') })) })),
  };
  const before = [...lessons.values()].map((l) => ({ _id: l.planId, los: l.objectives ?? [], segments: l.segments }));
  const after = applyDataToDocs(before, local);
  let segmentFields = 0;
  let arrayElements = 0;
  let segmentsTouched = 0;
  let objectiveFields = 0;
  const lessonsTouched = new Set<string>();
  const byField: Record<string, number> = {};
  before.forEach((b, i) => {
    const a = after[i];
    b.segments.forEach((seg, k) => {
      let touched = false;
      for (const key of new Set([...Object.keys(seg), ...Object.keys(a.segments[k])])) {
        const x = (seg as Record<string, unknown>)[key];
        const y = (a.segments[k] as Record<string, unknown>)[key];
        if (JSON.stringify(x) === JSON.stringify(y)) continue;
        touched = true;
        segmentFields += 1;
        byField[key] = (byField[key] ?? 0) + 1;
        if (Array.isArray(x) && Array.isArray(y)) {
          for (let j = 0; j < Math.max(x.length, y.length); j += 1) if (x[j] !== y[j]) arrayElements += 1;
        } else arrayElements += 1;
      }
      if (touched) { segmentsTouched += 1; lessonsTouched.add(b._id); }
    });
    b.los.forEach((lo, k) => {
      for (const key of ['description', 'shortTitle'] as const) {
        if (lo[key] !== (a.los[k] as Record<string, unknown>)[key]) { objectiveFields += 1; lessonsTouched.add(b._id); }
      }
    });
  });
  const storedOnly = data.plans.reduce((n, p) => n + p.segments.reduce((m, s) => m + s.changes.filter((c) => c.field === 'teacherNote').length, 0), 0);
  const report = {
    generatedAt: new Date().toISOString(),
    from: LESSON_DIR,
    dataFile: path.join(TOOLING_DIR, DATA_FILE),
    dataCounts: data.counts,
    lessonsThatChange: lessonsTouched.size,
    segmentsThatChange: segmentsTouched,
    segmentFieldsThatDiffer: segmentFields,
    segmentFieldsThatDifferByField: byField,
    changedValuesInsideThoseFields: arrayElements,
    objectiveFieldsThatDiffer: objectiveFields,
    storedOnlyValuesNotInLessonFiles: { 'recap.teacherNote': storedOnly },
    check: `${arrayElements} + ${objectiveFields} + ${storedOnly} = ${arrayElements + objectiveFields + storedOnly} must equal dataCounts.fields (${data.counts.fields})`,
    consistent: arrayElements + objectiveFields + storedOnly === data.counts.fields,
    note: 'A segment field is one top-level field of a segment (an array such as steps counts once however many of its elements change); "changedValuesInsideThoseFields" counts each changed array element or scalar, which is what the data file counts.',
  };
  fs.writeFileSync(path.join(TOOLING_DIR, 'lessons-v3-check.json'), `${JSON.stringify(report, null, 1)}\n`);
  console.log(JSON.stringify(report, null, 1));
  if (!report.consistent) process.exit(1);
}

main();
