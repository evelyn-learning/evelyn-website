import type { CurveAnchor, ExamBlueprint } from './types';

/**
 * All 9 AP-course blueprints. Section = separately-timed exam part (the
 * service serves exactly one module per non-adaptive section, so every real
 * timed part gets its own section). Composite = ap-composite weighted
 * MCQ/FRQ fractions -> 1-5 cut points; per-section "scaled" is a 1-5
 * subscore derived from the same cut fractions (display only).
 * v1 approximations: FRQ tasks weight by rubric points (not official task
 * weights); no LEQ/SAQ prompt choice; referenceSheet false (SAT-sheet only).
 */

const NO_CALC = { desmos: false, referenceSheet: false, eliminator: true, highlighter: true };
const CALC = { desmos: true, referenceSheet: false, eliminator: true, highlighter: true };

/** 1-5 section curve from the composite cut fractions: raw 0 -> 1, each cut
 *  fraction of rawMax -> that score, rawMax -> 5. X-collisions from rounding
 *  on small rawMax are bumped up to keep anchors strictly increasing. */
export function apSectionCurve(rawMax: number, cutPoints: [number, number, number, number]): CurveAnchor[] {
  const anchors: CurveAnchor[] = [[0, 1]];
  cutPoints.forEach((c, i) => {
    let x = Math.round(c * rawMax);
    if (x <= anchors[anchors.length - 1][0]) x = anchors[anchors.length - 1][0] + 1;
    anchors.push([x, i + 2]);
  });
  const last = anchors[anchors.length - 1];
  if (last[0] < rawMax) anchors.push([rawMax, 5]);
  else last[0] = rawMax; // cut-5 landed on rawMax; cap there
  return anchors;
}

type SectionSpec = {
  sectionId: string;
  label: string;
  count: number;
  min: number;
  tools: typeof NO_CALC;
  breakAfterMin?: number;
  /** FRQ sections: raw max = locked rubric point total, not question count. */
  rawMax?: number;
};

function apBlueprint(cfg: {
  examKey: string;
  label: string;
  sections: SectionSpec[];
  mcqWeight: number;
  cutPoints: [number, number, number, number];
}): ExamBlueprint {
  return {
    examKey: cfg.examKey,
    examType: 'ap',
    label: cfg.label,
    sections: cfg.sections.map((s) => ({
      sectionId: s.sectionId,
      label: s.label,
      tools: s.tools,
      ...(s.breakAfterMin ? { breakAfterMin: s.breakAfterMin } : {}),
      modules: [{ moduleId: 'main', label: s.label, questionCount: s.count, timeLimitMin: s.min }],
    })),
    scoring: {
      kind: 'ap-composite',
      sectionScaledMin: 1,
      sectionScaledMax: 5,
      compositeMin: 1,
      compositeMax: 5,
      curves: Object.fromEntries(
        cfg.sections.map((s) => [s.sectionId, { default: apSectionCurve(s.rawMax ?? s.count, cfg.cutPoints) }])
      ),
      ap: {
        mcqWeight: cfg.mcqWeight,
        frqWeight: 1 - cfg.mcqWeight,
        cutPoints: cfg.cutPoints,
      },
    },
  };
}

export const AP_BLUEPRINTS: ExamBlueprint[] = [
  apBlueprint({
    examKey: 'ap-statistics', label: 'AP Statistics',
    mcqWeight: 0.5, cutPoints: [0.25, 0.39, 0.53, 0.67],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 40, min: 90, tools: CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 6, min: 90, tools: CALC, rawMax: 24 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-calculus-bc', label: 'AP Calculus BC',
    mcqWeight: 0.5, cutPoints: [0.25, 0.36, 0.49, 0.63],
    sections: [
      { sectionId: 'mcq-nocalc', label: 'Section I, Part A: MCQ (No Calculator)', count: 30, min: 60, tools: NO_CALC },
      { sectionId: 'mcq-calc', label: 'Section I, Part B: MCQ (Calculator)', count: 15, min: 45, tools: CALC, breakAfterMin: 10 },
      { sectionId: 'frq-calc', label: 'Section II, Part A: FRQ (Calculator)', count: 2, min: 30, tools: CALC, rawMax: 18 },
      { sectionId: 'frq-nocalc', label: 'Section II, Part B: FRQ (No Calculator)', count: 4, min: 60, tools: NO_CALC, rawMax: 36 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-macroeconomics', label: 'AP Macroeconomics',
    mcqWeight: 2 / 3, cutPoints: [0.29, 0.44, 0.57, 0.71],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 60, min: 70, tools: CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 3, min: 60, tools: CALC, rawMax: 20 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-psychology', label: 'AP Psychology',
    mcqWeight: 2 / 3, cutPoints: [0.31, 0.45, 0.6, 0.73],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 75, min: 90, tools: NO_CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: AAQ + EBQ', count: 2, min: 70, tools: NO_CALC, rawMax: 14 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-environmental-science', label: 'AP Environmental Science',
    mcqWeight: 0.6, cutPoints: [0.31, 0.45, 0.58, 0.72],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 80, min: 90, tools: CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 3, min: 70, tools: CALC, rawMax: 30 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-english-language', label: 'AP English Language and Composition',
    mcqWeight: 0.45, cutPoints: [0.36, 0.5, 0.62, 0.74],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 45, min: 60, tools: NO_CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 3, min: 135, tools: NO_CALC, rawMax: 18 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-us-history', label: 'AP U.S. History',
    mcqWeight: 0.4, cutPoints: [0.28, 0.42, 0.55, 0.68],
    sections: [
      { sectionId: 'mcq', label: 'Section I, Part A: Multiple Choice', count: 55, min: 55, tools: NO_CALC },
      { sectionId: 'saq', label: 'Section I, Part B: Short Answer', count: 3, min: 40, tools: NO_CALC, breakAfterMin: 10, rawMax: 9 },
      { sectionId: 'dbq', label: 'Section II: Document-Based Question', count: 1, min: 60, tools: NO_CALC, rawMax: 7 },
      { sectionId: 'leq', label: 'Section II: Long Essay', count: 1, min: 40, tools: NO_CALC, rawMax: 6 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-world-history', label: 'AP World History: Modern',
    mcqWeight: 0.4, cutPoints: [0.28, 0.42, 0.56, 0.7],
    sections: [
      { sectionId: 'mcq', label: 'Section I, Part A: Multiple Choice', count: 55, min: 55, tools: NO_CALC },
      { sectionId: 'saq', label: 'Section I, Part B: Short Answer', count: 3, min: 40, tools: NO_CALC, breakAfterMin: 10, rawMax: 9 },
      { sectionId: 'dbq', label: 'Section II: Document-Based Question', count: 1, min: 60, tools: NO_CALC, rawMax: 7 },
      { sectionId: 'leq', label: 'Section II: Long Essay', count: 1, min: 40, tools: NO_CALC, rawMax: 6 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-us-government', label: 'AP U.S. Government and Politics',
    mcqWeight: 0.5, cutPoints: [0.31, 0.44, 0.59, 0.73],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 55, min: 80, tools: NO_CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 4, min: 100, tools: NO_CALC, rawMax: 17 },
    ],
  }),
];
