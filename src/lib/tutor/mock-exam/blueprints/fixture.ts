import type { ExamBlueprint } from './types';

const ALL_TOOLS = { desmos: true, referenceSheet: true, eliminator: true, highlighter: true };

/** 2-section micro-exam for tests/e2e: sec1 = adaptive MCQ (2 + 1), sec2 = 1 FRQ. */
export const FIXTURE_BLUEPRINT: ExamBlueprint = {
  examKey: 'fixture',
  examType: 'fixture',
  label: 'Fixture Exam',
  sections: [
    {
      sectionId: 'sec1', label: 'Section 1', tools: ALL_TOOLS,
      adaptive: { fromModuleId: 'm1', thresholdFraction: 0.5 },
      breakAfterMin: 1,
      modules: [
        { moduleId: 'm1', label: 'Module 1', questionCount: 2, timeLimitMin: 4 },
        { moduleId: 'm2-easy', label: 'Module 2', questionCount: 1, timeLimitMin: 4, variant: 'easy' },
        { moduleId: 'm2-hard', label: 'Module 2', questionCount: 1, timeLimitMin: 4, variant: 'hard' },
      ],
    },
    {
      sectionId: 'sec2', label: 'Section 2', tools: ALL_TOOLS,
      modules: [{ moduleId: 'frq', label: 'Free Response', questionCount: 1, timeLimitMin: 4 }],
    },
  ],
  scoring: {
    kind: 'scaled-sections',
    sectionScaledMin: 10, sectionScaledMax: 40, compositeMin: 20, compositeMax: 80,
    curves: {
      sec1: {
        easy: [[0, 10], [3, 30]],
        hard: [[0, 16], [3, 40]],
      },
      sec2: {
        default: [[0, 10], [4, 40]],   // FRQ raw = rubric points (max 4 in fixture data)
      },
    },
  },
};
