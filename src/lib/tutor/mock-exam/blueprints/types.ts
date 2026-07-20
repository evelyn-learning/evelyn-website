import type { MockToolPolicy } from '@evelyn/portal-contract/v1';

/** [rawScore, scaledScore] anchor; scoring interpolates linearly between anchors. */
export type CurveAnchor = [number, number];

export interface BlueprintModule {
  moduleId: string;                 // 'm1' | 'm2-easy' | 'm2-hard' | 'main' | 'frq'
  label: string;                    // 'Module 1'
  questionCount: number;
  timeLimitMin: number;
  variant?: 'easy' | 'hard';        // set only on adaptive second-stage modules
}

export interface BlueprintSection {
  sectionId: string;                // 'rw' | 'math' | 'english' | 'mcq' | 'frq' ...
  label: string;                    // 'Reading & Writing'
  modules: BlueprintModule[];
  /** When set: after the module with fromModuleId completes, serve the
   *  'hard' variant iff rawCorrect/questionCount >= thresholdFraction. */
  adaptive?: { fromModuleId: string; thresholdFraction: number };
  tools: MockToolPolicy;
  /** Minutes of break AFTER this section; omit for none. Break = save/exit point. */
  breakAfterMin?: number;
  /** Counts toward the composite (enhanced-ACT Science sets false). Default true. */
  inComposite?: boolean;
}

export interface ScoringSpec {
  kind: 'scaled-sections' | 'act-composite' | 'ap-composite';
  sectionScaledMin: number;
  sectionScaledMax: number;
  compositeMin: number;
  compositeMax: number;
  /** sectionId -> variantKey ('default' | 'easy' | 'hard') -> anchors.
   *  For adaptive sections the variant key matches the served m2 variant. */
  curves: Record<string, Record<string, CurveAnchor[]>>;
  /** ap-composite only. Weights are fractions summing to 1; cutPoints are the
   *  minimum weighted-composite FRACTIONS for scores 2,3,4,5. */
  ap?: { mcqWeight: number; frqWeight: number; cutPoints: [number, number, number, number] };
}

export interface ExamBlueprint {
  /** Registry key AND MockForm.examKey: 'digital-sat' | 'act' | 'ap-statistics' | ... | 'fixture' */
  examKey: string;
  /** Contract MockExamType bucket for UI conduct: 'digital-sat' | 'act' | 'ap' | 'fixture' */
  examType: 'digital-sat' | 'act' | 'ap' | 'fixture';
  label: string;
  sections: BlueprintSection[];
  scoring: ScoringSpec;
}
