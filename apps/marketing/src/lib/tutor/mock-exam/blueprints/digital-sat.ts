import type { CurveAnchor, ExamBlueprint } from './types';

// v1 product curves: piecewise-linear anchors approximating released Bluebook
// practice-test curves. Variant-aware: the hard-m2 path can reach 800; the
// easy-m2 path caps below the section max, mirroring the real test's routing.
const RW_CURVES: Record<string, CurveAnchor[]> = {
  easy: [[0, 200], [10, 300], [20, 400], [35, 500], [54, 650]],
  hard: [[0, 260], [10, 350], [20, 460], [30, 560], [40, 650], [48, 720], [54, 800]],
};
const MATH_CURVES: Record<string, CurveAnchor[]> = {
  easy: [[0, 200], [8, 300], [16, 400], [28, 510], [44, 650]],
  hard: [[0, 260], [8, 360], [16, 470], [26, 570], [34, 660], [40, 730], [44, 800]],
};

export const DIGITAL_SAT_BLUEPRINT: ExamBlueprint = {
  examKey: 'digital-sat',
  examType: 'digital-sat',
  label: 'Digital SAT',
  sections: [
    {
      sectionId: 'rw', label: 'Reading & Writing',
      tools: { desmos: false, referenceSheet: false, eliminator: true, highlighter: true },
      adaptive: { fromModuleId: 'm1', thresholdFraction: 0.6 },
      breakAfterMin: 10,
      modules: [
        { moduleId: 'm1', label: 'Module 1', questionCount: 27, timeLimitMin: 32 },
        { moduleId: 'm2-easy', label: 'Module 2', questionCount: 27, timeLimitMin: 32, variant: 'easy' },
        { moduleId: 'm2-hard', label: 'Module 2', questionCount: 27, timeLimitMin: 32, variant: 'hard' },
      ],
    },
    {
      sectionId: 'math', label: 'Math',
      tools: { desmos: true, referenceSheet: true, eliminator: true, highlighter: true },
      adaptive: { fromModuleId: 'm1', thresholdFraction: 0.6 },
      modules: [
        { moduleId: 'm1', label: 'Module 1', questionCount: 22, timeLimitMin: 35 },
        { moduleId: 'm2-easy', label: 'Module 2', questionCount: 22, timeLimitMin: 35, variant: 'easy' },
        { moduleId: 'm2-hard', label: 'Module 2', questionCount: 22, timeLimitMin: 35, variant: 'hard' },
      ],
    },
  ],
  scoring: {
    kind: 'scaled-sections',
    sectionScaledMin: 200, sectionScaledMax: 800, compositeMin: 400, compositeMax: 1600,
    curves: { rw: RW_CURVES, math: MATH_CURVES },
  },
};
