import type { ExamBlueprint } from './types';

/**
 * CPHQ (Certified Professional in Healthcare Quality) demo mock exam
 * (Option A, 2026-08-12). Single MCQ section, scaled-sections 0-100
 * (percent-style score) — mirrors the HS_BLUEPRINTS pattern in hs.ts
 * exactly (same shape/scoring kind), since that is the only existing
 * single-section-MCQ, non-adaptive blueprint template in this file.
 *
 * examType 'ap' is a deliberate choice, not a default: it's the contract's
 * generic timed-section conduct bucket used by every non-AP HS course
 * (hs-chemistry) already live in prod, so it's the best-tested "no special
 * exam chrome" path available. Neither 'digital-sat' nor 'act' fit (both
 * drive exam-specific UI/tooling for those specific tests), and 'fixture'
 * is reserved for internal e2e/dev fixtures, not real student-facing
 * exams. See hs.ts's own comment for the same tradeoff note (the "chem
 * mock displayed an 'ap' examType question" history) — revisit the label
 * if/when a dedicated professional-cert examType bucket is added.
 */
const CPHQ_TOOLS = { desmos: false, referenceSheet: false, eliminator: true, highlighter: true };

export const CPHQ_BLUEPRINT: ExamBlueprint = {
  examKey: 'cphq',
  examType: 'ap',
  label: 'CPHQ Practice Exam',
  sections: [
    {
      sectionId: 'mcq',
      label: 'Multiple Choice',
      tools: CPHQ_TOOLS,
      modules: [{ moduleId: 'main', label: 'Multiple Choice', questionCount: 30, timeLimitMin: 60 }],
    },
  ],
  scoring: {
    kind: 'scaled-sections',
    sectionScaledMin: 0,
    sectionScaledMax: 100,
    compositeMin: 0,
    compositeMax: 100,
    curves: { mcq: { default: [[0, 0], [30, 100]] } },
  },
};
