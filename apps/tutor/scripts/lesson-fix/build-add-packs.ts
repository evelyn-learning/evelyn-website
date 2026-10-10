/**
 * Build the writers' input for the missing objectives of the 45 expanded
 * plans: one pack per plan, an index, and the measured text conventions.
 * Local files only — no database, no network.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/lesson-fix/build-add-packs.ts
 *
 * Writes …/lesson-add-2026-10-12/packs/{NNN.json,index.json} and
 * …/lesson-add-2026-10-12/conventions.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { isNumberWithUnit, preStateOf, SEGMENT_KINDS, SEGMENT_SUFFIXES, TEACHING_FIELDS, textSha256, type AddPack, type MissingObjective } from './add-core';
import { ADD_DIR, applyCorrections, LESSONS_V2_DIR, loadDumpPlans, loadExpandedIndex, loadLessonV2, loadPracticeItems, PACK_DIR, WRITTEN_DIR } from './add-io';
import { containsAnswerVerbatim, markupStyleOf, type Lesson, type LessonSegment } from './core';

type Doc = Record<string, unknown>;

function quantiles(xs: number[]): { min: number; p5: number; median: number; p95: number; max: number } {
  const s = [...xs].sort((a, b) => a - b);
  const at = (q: number): number => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  return { min: s[0], p5: at(0.05), median: at(0.5), p95: at(0.95), max: s[s.length - 1] };
}

/** Lengths, counts and notation of the stored teaching text of `lessons`. */
export function measure(lessons: ReadonlyArray<{ segments: LessonSegment[] }>): Record<string, unknown> {
  const chars: Record<string, number[]> = {};
  const counts: Record<string, Record<number, number>> = { keyIdeas: {}, steps: {} };
  const notation: Record<string, number> = {};
  const marks: Array<[string, RegExp]> = [
    ['superscript digits (x², 10⁻³)', /[²³⁰-⁹⁻⁺]/], ['subscript digits (H₂O)', /[₀-₉]/], ['caret powers (x^2)', /\^/], ['√', /√/], ['sqrt(', /sqrt\(/],
    ['× (multiplication sign)', /×/], ['· (middle dot)', /·/], ['* (asterisk)', /\*/], ['− (U+2212 minus)', /−/], ['π', /π/], ['→', /→/], ['≈', /≈/], ['°', /°/], ['$ (currency)', /\$/],
  ];
  let segments = 0;
  let tries = 0;
  let bareNumber = 0;
  let numberWithUnit = 0;
  let answerInProblem = 0;
  let lineBreaks = 0;
  const styles: Record<string, number> = {};
  const answerWords: number[] = [];
  for (const l of lessons) {
    for (const s of l.segments) {
      if (s.id === 'intro' || s.id === 'recap' || !TEACHING_FIELDS[s.kind]) continue;
      segments += 1;
      const texts: string[] = [];
      for (const [f, isArray] of TEACHING_FIELDS[s.kind]) {
        const key = `${s.kind}.${f}`;
        const vals = isArray ? (s[f] as string[]) : [s[f] as string];
        if (isArray) counts[f][vals.length] = (counts[f][vals.length] ?? 0) + 1;
        (chars[key] ??= []).push(...vals.map((v) => v.length));
        texts.push(...vals);
      }
      const all = texts.join(' ');
      if (/[\n\r\t]/.test(all)) lineBreaks += 1;
      for (const [name, re] of marks) if (re.test(all)) notation[name] = (notation[name] ?? 0) + 1;
      for (const st of markupStyleOf(all)) styles[st] = (styles[st] ?? 0) + 1;
      if (s.kind === 'try_yourself') {
        tries += 1;
        const ea = (s.expectedAnswer as string).trim();
        answerWords.push(ea.split(/\s+/).length);
        if (/^[-−+]?\d[\d,]*(\.\d+)?(\/\d+)?$/.test(ea)) bareNumber += 1;
        else if (isNumberWithUnit(ea)) numberWithUnit += 1;
        if (containsAnswerVerbatim(s.problem as string, ea)) answerInProblem += 1;
      }
    }
  }
  return {
    lessons: lessons.length,
    segments,
    characters: Object.fromEntries(Object.entries(chars).map(([k, v]) => [k, quantiles(v)])),
    entriesPerSegment: counts,
    segmentsUsingNotation: notation,
    segmentsWithLatexOrMarkdown: styles,
    segmentsWithLineBreakOrTab: lineBreaks,
    tryYourself: { total: tries, expectedAnswerWords: quantiles(answerWords), bareNumber, numberWithUnit, expectedAnswerAppearsInProblem: answerInProblem },
  };
}

function main(): void {
  const index = loadExpandedIndex();
  const dump = loadDumpPlans();
  const practice = loadPracticeItems();
  const lessons = index.map((e) => loadLessonV2(e.pack));
  const patched = applyCorrections(new Map(lessons.map((l) => [l.planId, dump.get(l.planId) as Doc])));
  fs.mkdirSync(PACK_DIR, { recursive: true });
  const rows: Array<Record<string, unknown>> = [];
  for (const lesson of lessons) {
    const stored = patched.get(lesson.planId) as Doc;
    const picker = dump.get(lesson.pickerPlanId as string) as Doc;
    if (!stored || !picker) throw new Error(`pack ${lesson.pack}: plan or picker plan not in the dump`);
    const pre = preStateOf(stored);
    // The local lesson text must be the stored text after the corrections.
    if (pre.textSha256 !== textSha256(lesson.segments)) throw new Error(`pack ${lesson.pack}: lessons-v2 text differs from the dump with the corrections applied`);
    if (JSON.stringify(pre.los) !== JSON.stringify(lesson.objectives)) throw new Error(`pack ${lesson.pack}: lessons-v2 objectives differ from the stored objectives`);
    const pickerLos = picker.los as Array<{ id: string; description: string; shortTitle: string }>;
    const n0 = pre.los.length;
    if (JSON.stringify(pickerLos.slice(0, n0).map((l) => l.id)) !== JSON.stringify(pre.los.map((l) => l.id))) throw new Error(`pack ${lesson.pack}: picker objectives do not start with the plan's`);
    const missing: MissingObjective[] = pickerLos.slice(n0).map((l, i) => ({
      id: l.id,
      number: n0 + i + 1,
      description: l.description,
      shortTitle: l.shortTitle,
      figureDependent: practice.figureDependent.has(l.id),
      existingPracticeItems: practice.byLo.get(l.id) ?? [],
    }));
    const pack: AddPack & Record<string, unknown> = {
      pack: lesson.pack,
      planId: lesson.planId,
      pickerPack: lesson.pickerPack as string,
      pickerPlanId: lesson.pickerPlanId as string,
      subject: lesson.subject as string,
      title: lesson.title as string,
      topic: stored.topic as string,
      grade: stored.grade as string,
      existingObjectives: pre.los,
      existingSegments: lesson.segments,
      missingObjectives: missing,
      thisLessonMeasures: measure([lesson as Lesson]),
      outputPath: path.join(WRITTEN_DIR, `${lesson.pack}.json`),
      outputTemplate: {
        pack: lesson.pack,
        planId: lesson.planId,
        pickerPlanId: lesson.pickerPlanId,
        objectives: missing.map((m) => ({
          loId: m.id,
          segments: SEGMENT_SUFFIXES.map((suffix, i) => ({
            id: `${m.id}-${suffix}`,
            kind: SEGMENT_KINDS[i],
            ...Object.fromEntries(TEACHING_FIELDS[SEGMENT_KINDS[i]].map(([f, isArray]) => [f, isArray ? [] : ''])),
          })),
          check: '',
        })),
      },
    };
    fs.writeFileSync(path.join(PACK_DIR, `${lesson.pack}.json`), `${JSON.stringify(pack, null, 1)}\n`);
    rows.push({
      pack: lesson.pack,
      subject: lesson.subject,
      title: lesson.title,
      planId: lesson.planId,
      pickerPlanId: lesson.pickerPlanId,
      missingObjectives: missing.length,
      figureDependent: missing.filter((m) => m.figureDependent).length,
      existingPracticeItems: missing.map((m) => m.existingPracticeItems.length),
    });
  }
  fs.writeFileSync(path.join(PACK_DIR, 'index.json'), `${JSON.stringify(rows, null, 1)}\n`);

  const allWithText = fs.readdirSync(LESSONS_V2_DIR).filter((f) => /^\d+\.json$/.test(f)).sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(LESSONS_V2_DIR, f), 'utf8')) as Lesson)
    .filter((l) => l.segments.some((s) => s.kind === 'worked_example'));
  const subjects = [...new Set(lessons.map((l) => l.subject as string))].sort();
  const conventions = {
    source: `${LESSONS_V2_DIR} (stored text after the 10-11 corrections)`,
    allLessonsWithText: measure(allWithText),
    the45ExpandedPlans: measure(lessons as Lesson[]),
    bySubjectOfThe45: Object.fromEntries(subjects.map((s) => [s, measure(lessons.filter((l) => l.subject === s) as Lesson[])])),
  };
  fs.writeFileSync(path.join(ADD_DIR, 'conventions.json'), `${JSON.stringify(conventions, null, 1)}\n`);

  const bySubject = subjects.map((s) => {
    const r = rows.filter((x) => x.subject === s);
    const counts = r.flatMap((x) => x.existingPracticeItems as number[]);
    return `  ${s}: ${r.length} plans · ${counts.length} missing objectives · with practice items ${counts.filter((c) => c > 0).length} (items ${counts.reduce((a, b) => a + b, 0)}) · figure-dependent ${r.reduce((a, x) => a + (x.figureDependent as number), 0)}`;
  });
  console.log(`packs ${rows.length} · missing objectives ${rows.reduce((a, r) => a + (r.missingObjectives as number), 0)}`);
  console.log(bySubject.join('\n'));
  console.log(`output: ${PACK_DIR}`);
}

if (require.main === module) main();
