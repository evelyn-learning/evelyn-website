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

export { HOMEWORK_PROBLEM_KIND, homeworkProblemOf, problemTextForDisplay, type HomeworkProblemMeta } from './homework-problem-meta';

/** Pure: build (and parse) the one-problem plan under `planId`. Does not persist. */
export function buildHomeworkProblemPlan(
  parent: LessonPlan,
  meta: Omit<HomeworkProblemMeta, 'kind'>,
  planId: string,
): LessonPlan {
  const los = [{
    id: `${planId}.lo-1`,
    description: `Work problem ${meta.n}.`,
    shortTitle: `Work problem ${meta.n}`,
  }];
  // Parent metadata minus the whole-sheet problem list and its cache key.
  const { problems: _problems, cacheKey: _cacheKey, ...parentMeta } = (parent.metadata ?? {}) as Record<string, unknown>;
  void _problems; void _cacheKey;
  return parseLessonPlan({
    id: planId,
    title: `Problem ${meta.n}`,
    curriculum: parent.curriculum,
    grade: parent.grade,
    subject: parent.subject,
    topic: meta.text.slice(0, 80),
    locale: parent.locale ?? 'en',
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
