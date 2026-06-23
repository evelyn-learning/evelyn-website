/**
 * resolvePlanCell — map a lesson plan to the taxonomy (subject, level, topic)
 * CELL that the structured picker would surface it under.
 *
 * Why this exists: a plan stores raw (subject, grade, topic) tags that are
 * deliberately loose — e.g. a JEE plan is tagged subject:'sci', grade:'11',
 * topic:'jee-physics'. The drilldown picker finds it fine because
 * listLessonPlans() expands the level via gradesInBand() and bridges topics
 * via TOPIC_ALIASES, plus a special test-prep topic-cross-match. But the
 * quick-search → auto-fill path used to GUESS the picker cell from the grade
 * alone (gradeToBand), which lands in the wrong cell and blanks the Topic
 * dropdown.
 *
 * This resolver instead asks: "which taxonomy cell would surface this plan?"
 * by reproducing listLessonPlans()'s match predicate over every cell, then
 * picking the most descriptive matching cell. The reused matchers
 * (gradeMatches/subjectMatches/topicMatches) are the SAME ones the drilldown
 * uses, so search-select and drilldown agree by construction.
 *
 * Returns null for plans whose topic lives in no cell (true orphans) — the
 * caller degrades gracefully (raw tags, same as the old behaviour).
 */
import { SUBJECTS, getLevelsForSubject, getTopicsForSubjectLevel } from '@/lib/tutor/topic-taxonomy';
import { gradeMatches, subjectMatches, topicMatches } from './store';

export interface ResolvedCell {
  subject: string;
  level: string;
  topic: string;
}

// Prefer specialized levels over generic K-12 bands when both match — a JEE
// plan should read "IIT JEE", an AP plan "AP / IB", not "High School (11-12)".
// Lower rank = more preferred.
const LEVEL_RANK: Record<string, number> = {
  college: 0,
  graduate: 1,
  nursing: 2,
  'medical-entrance': 3,
  iitjee: 4,
  'sat-act': 5,
  ap: 6,
  '11-12': 7,
  '9-10': 8,
  '6-8': 9,
  '3-5': 10,
  'k-2': 11,
};

export function resolvePlanCell(plan: {
  subject: string;
  grade: string;
  topic?: string;
}): ResolvedCell | null {
  if (!plan.topic) return null; // open-conversation plan — nothing to place

  let best: { cell: ResolvedCell; score: number } | null = null;

  for (const subj of SUBJECTS) {
    const S = subj.id;
    for (const lvl of getLevelsForSubject(S)) {
      const L = lvl.id;
      if (!gradeMatches(L, plan.grade)) continue;
      for (const t of getTopicsForSubjectLevel(S, L)) {
        const T = t.id;
        if (!topicMatches(T, plan.topic)) continue;
        // Mirror listLessonPlans()'s subjectOk, including the test-prep
        // topic-cross-match (test-prep plans are often tagged with their
        // underlying subject, e.g. 'sci' for JEE physics).
        const subjectOk =
          S === 'test-prep'
            ? plan.subject === 'test-prep' || plan.topic === 'test-prep' || topicMatches(T, plan.topic)
            : subjectMatches(S, plan.subject);
        if (!subjectOk) continue;

        let score = 0;
        if (plan.topic === T) score += 1000; // exact topic id beats an alias hit
        if (S !== 'test-prep') score += 100; // prefer the plan's native subject
        score += 20 - (LEVEL_RANK[L] ?? 15); // prefer specialized levels

        if (!best || score > best.score) best = { cell: { subject: S, level: L, topic: T }, score };
      }
    }
  }

  return best?.cell ?? null;
}
