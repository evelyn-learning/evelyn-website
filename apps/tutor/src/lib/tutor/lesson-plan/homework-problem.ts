/**
 * The per-open, ONE-problem lesson plan a homework student's session runs on.
 * Minted from the whole-sheet homework-help parent plan plus that problem's
 * build result. `GET /api/tutor/lesson-plans/[id]` serves plan metadata with
 * no auth, so this plan carries `verified: boolean` and the figure — NEVER the
 * answer key, finals, canonical values or candidates (those stay in the
 * homework-build collection).
 */

import { buildRecapSegment } from './generate-from-text';
import { parseLessonPlan } from './parser';
import { LESSON_PLAN_SCHEMA_VERSION } from './types';
import type { LessonPlan } from './types';
import { HOMEWORK_PROBLEM_KIND, type HomeworkProblemMeta } from './homework-problem-meta';
import { homeworkWording } from './homework-wording';

export { HOMEWORK_PROBLEM_KIND, homeworkProblemOf, problemTextForDisplay, type HomeworkProblemMeta } from './homework-problem-meta';

/** Pure: build (and parse) the one-problem plan under `planId`. Does not persist. */
export function buildHomeworkProblemPlan(
  parent: LessonPlan,
  meta: Omit<HomeworkProblemMeta, 'kind'>,
  planId: string,
  /** The language the problem's session is taught in, when the caller knows it and the sheet's plan carries none. */
  opts: { locale?: string } = {},
): LessonPlan {
  // 2026-11-24: the title and the objective in the plan's language (homework-wording.ts); English as before otherwise.
  const locale = opts.locale || parent.locale || 'en';
  const words = homeworkWording(locale);
  const los = [{
    id: `${planId}.lo-1`,
    description: words.problemObjectiveSentence(meta.n),
    shortTitle: words.problemObjective(meta.n),
  }];
  // Parent metadata minus the whole-sheet problem list and its cache key.
  const { problems: _problems, cacheKey: _cacheKey, ...parentMeta } = (parent.metadata ?? {}) as Record<string, unknown>;
  void _problems; void _cacheKey;
  return parseLessonPlan({
    id: planId,
    title: words.problemTitle(meta.n),
    curriculum: parent.curriculum,
    grade: parent.grade,
    subject: parent.subject,
    topic: meta.text.slice(0, 80),
    locale,
    los,
    estimatedMinutes: parent.estimatedMinutes,
    segments: [
      { id: 'problem', kind: 'concept', goal: 'Work this one problem with the student.', keyIdeas: [meta.text] },
      buildRecapSegment(los),
    ],
    prerequisites: [],
    followUps: [],
    schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
    metadata: { ...parentMeta, allowedMaxLOs: 1, ...meta, kind: HOMEWORK_PROBLEM_KIND },
  });
}
