/**
 * Are the local lesson files the stored documents? Compares every lesson of
 * the active pass (LESSON_FIX_PASS) with the local dump + the data files
 * already applied to production, field by field: segment ids and order,
 * every field the lesson file holds, objective ids / descriptions / short
 * titles. Local files only.
 *
 *   cd apps/tutor && LESSON_FIX_PASS=2 env -u MONGODB_URI npx tsx scripts/lesson-fix/check-baseline.ts
 *
 * Prints the differences; exit code 1 when there is any.
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { applyDataToDocs, type ApplyData, type Lesson } from './core';
import { APPLIED_DATA_FILES, DUMP_FILE, LESSON_DIR, loadLessons } from './io';

type Doc = { _id: string; los?: Array<Record<string, unknown>>; segments?: Array<Record<string, unknown>> };

/** Differences between one lesson file and its stored document. Pure. */
export function lessonDifferences(lesson: Lesson, doc: Doc | undefined): string[] {
  if (!doc) return ['plan not in the stored documents'];
  const out: string[] = [];
  const ids = (doc.segments ?? []).map((s) => s.id);
  if (JSON.stringify(ids) !== JSON.stringify(lesson.segments.map((s) => s.id))) out.push('segment ids / order differ');
  for (const seg of lesson.segments) {
    const stored = (doc.segments ?? []).find((s) => s.id === seg.id);
    if (!stored) continue;
    for (const [k, v] of Object.entries(seg)) {
      if (JSON.stringify(stored[k]) !== JSON.stringify(v)) out.push(`${seg.id} · ${k}: file ${JSON.stringify(v)} ≠ stored ${JSON.stringify(stored[k])}`);
    }
    for (const [k, v] of Object.entries(stored)) {
      if (v !== null && !(k in seg) && k !== 'teacherNote') out.push(`${seg.id} · ${k}: stored value missing from the file`);
    }
  }
  const los = doc.los ?? [];
  const objectives = lesson.objectives ?? [];
  if (los.length !== objectives.length) out.push(`objective count: file ${objectives.length} ≠ stored ${los.length}`);
  objectives.forEach((o, i) => {
    for (const k of ['id', 'description', 'shortTitle'] as const) {
      if ((los[i]?.[k] ?? undefined) !== (o[k] ?? undefined)) out.push(`objective ${i + 1} · ${k}: file ${JSON.stringify(o[k])} ≠ stored ${JSON.stringify(los[i]?.[k])}`);
    }
  });
  return out;
}

function main(): void {
  const dump = JSON.parse(fs.readFileSync(DUMP_FILE, 'utf8')) as { dumpedAt?: string; plans: Doc[] };
  let docs = dump.plans;
  for (const f of APPLIED_DATA_FILES) docs = applyDataToDocs(docs, JSON.parse(fs.readFileSync(f, 'utf8')) as ApplyData);
  const byId = new Map(docs.map((d) => [d._id, d]));
  const lessons = loadLessons();
  let different = 0;
  let segments = 0;
  for (const [pack, lesson] of lessons) {
    segments += lesson.segments.length;
    const diffs = lessonDifferences(lesson, byId.get(lesson.planId));
    if (diffs.length === 0) continue;
    different += 1;
    for (const d of diffs.slice(0, 8)) console.log(`DIFF lesson ${pack} ${lesson.planId}: ${d}`);
  }
  console.log(`${LESSON_DIR}: ${lessons.size} lessons, ${segments} segments compared with ${path.basename(DUMP_FILE)} (${dump.dumpedAt})` +
    `${APPLIED_DATA_FILES.length ? ` + ${APPLIED_DATA_FILES.map((f) => path.basename(f)).join(' + ')}` : ''} — ${different} lesson(s) differ`);
  if (different) process.exit(1);
}

if (require.main === module) main();
