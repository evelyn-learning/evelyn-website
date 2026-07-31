import type { ExamBlueprint } from './types';

/**
 * HS-core full-length practice exams (user-added scope 2026-07-31).
 * Single MCQ section, scaled-sections 0-100 (percent-style score).
 * examType 'ap' = the contract's generic timed-section conduct bucket;
 * revisit the display label when HS mocks ship.
 */
const CALC = { desmos: true, referenceSheet: false, eliminator: true, highlighter: true };

export const HS_BLUEPRINTS: ExamBlueprint[] = [
  {
    examKey: 'hs-chemistry',
    examType: 'ap',
    label: 'Chemistry Practice Final',
    sections: [
      {
        sectionId: 'mcq',
        label: 'Multiple Choice',
        tools: CALC,
        modules: [{ moduleId: 'main', label: 'Multiple Choice', questionCount: 60, timeLimitMin: 90 }],
      },
    ],
    scoring: {
      kind: 'scaled-sections',
      sectionScaledMin: 0,
      sectionScaledMax: 100,
      compositeMin: 0,
      compositeMax: 100,
      curves: { mcq: { default: [[0, 0], [60, 100]] } },
    },
  },
];
