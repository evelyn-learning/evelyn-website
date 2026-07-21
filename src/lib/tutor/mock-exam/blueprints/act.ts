import type { CurveAnchor, ExamBlueprint } from './types';

// v1 product curves: piecewise-linear anchors approximating released
// enhanced-ACT practice-test curves (1-36 scale). No adaptive routing —
// every section is a single 'default'-variant module.
const ENGLISH_CURVE: CurveAnchor[] = [[0, 1], [13, 13], [25, 19], [33, 23], [41, 28], [46, 32], [49, 35], [50, 36]];
const MATH_CURVE: CurveAnchor[] = [[0, 1], [9, 13], [18, 18], [27, 23], [35, 28], [41, 32], [44, 35], [45, 36]];
const READING_CURVE: CurveAnchor[] = [[0, 1], [9, 14], [18, 20], [25, 25], [30, 29], [34, 33], [36, 36]];
const SCIENCE_CURVE: CurveAnchor[] = [[0, 1], [10, 14], [20, 20], [28, 26], [34, 31], [38, 34], [40, 36]];

const STANDARD_TOOLS = { desmos: false, referenceSheet: false, eliminator: true, highlighter: true };
const MATH_TOOLS = { desmos: true, referenceSheet: false, eliminator: true, highlighter: true };

export const ACT_BLUEPRINT: ExamBlueprint = {
  examKey: 'act',
  examType: 'act',
  label: 'ACT',
  sections: [
    {
      sectionId: 'english', label: 'English',
      tools: STANDARD_TOOLS,
      breakAfterMin: 1,
      modules: [{ moduleId: 'main', label: 'English', questionCount: 50, timeLimitMin: 35 }],
    },
    {
      sectionId: 'math', label: 'Math',
      tools: MATH_TOOLS,
      breakAfterMin: 15,
      modules: [{ moduleId: 'main', label: 'Math', questionCount: 45, timeLimitMin: 50 }],
    },
    {
      sectionId: 'reading', label: 'Reading',
      tools: STANDARD_TOOLS,
      breakAfterMin: 1,
      modules: [{ moduleId: 'main', label: 'Reading', questionCount: 36, timeLimitMin: 40 }],
    },
    {
      sectionId: 'science', label: 'Science',
      tools: STANDARD_TOOLS,
      inComposite: false,
      modules: [{ moduleId: 'main', label: 'Science', questionCount: 40, timeLimitMin: 40 }],
    },
  ],
  scoring: {
    kind: 'act-composite',
    sectionScaledMin: 1, sectionScaledMax: 36, compositeMin: 1, compositeMax: 36,
    curves: {
      english: { default: ENGLISH_CURVE },
      math: { default: MATH_CURVE },
      reading: { default: READING_CURVE },
      science: { default: SCIENCE_CURVE },
    },
  },
};
