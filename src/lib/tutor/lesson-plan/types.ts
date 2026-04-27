/**
 * Lesson Plan — structured teaching script the brain executes turn-by-turn.
 *
 * A lesson plan is NOT free-form prose. It's an ordered list of *segments*
 * (hook → explain → worked example → try yourself → check → recap →
 * extension). The brain stays Socratic *within* a segment but follows
 * the plan's overall arc, advancing via the `advance_lesson` tool.
 *
 * Authored as YAML/JSON by curriculum / content teams. For B2B partners
 * this is a key surface: their content is ingested in their format,
 * normalized into this shape.
 */

/** Curriculum / standard a plan targets. Free-form so partners can plug
 *  their own ("ACT-PREP", "JEE-MAIN", "STATE-TX-2024"). */
export type CurriculumStandard =
  | 'CCSS'        // US Common Core (math, ELA)
  | 'NGSS'        // US Next Generation Science Standards
  | 'CBSE'        // India CBSE
  | 'NCERT'       // India NCERT
  | 'ICSE'        // India ICSE
  | 'IGCSE'       // Cambridge IGCSE
  | 'IB-MYP'      // International Baccalaureate Middle Years
  | 'IB-DP'       // International Baccalaureate Diploma
  | 'A-LEVEL'     // UK A-Level
  | 'GCSE'        // UK GCSE
  | 'AC'          // Australian Curriculum
  | string;

/** A single learning objective the plan targets. */
export interface LearningObjective {
  /** Stable id, e.g. "ccss.math.5.nf.a.1" or "evelyn.algebra.linear-eq.solve-one-step". */
  id: string;
  /** Human-readable description: "Add and subtract fractions with unlike denominators." */
  description: string;
  /** Optional standard reference if `id` isn't already a standard code. */
  standard?: string;
}

/** Tool ids the brain might invoke during a segment. Free-form because new
 *  tools are added often; this is just a hint to the brain. */
export type SuggestedToolId = string;

/**
 * One teaching beat. The brain executes the segment in order:
 *   - reads `goal` and any provided script/keys
 *   - decides which tool calls to make (suggestedTools is a hint, not a
 *     requirement — the brain is free to use any registered tool)
 *   - stays Socratic, follows pedagogy rules from the system prompt
 *   - emits `advance_lesson({ to: 'next' })` when the segment is complete
 *     OR `advance_lesson({ to: segmentId })` to branch
 */
export type Segment =
  | SegmentHook
  | SegmentConcept
  | SegmentWorkedExample
  | SegmentTryYourself
  | SegmentMisconceptionCheck
  | SegmentRecap
  | SegmentExtension;

interface SegmentBase {
  /** Stable id within the plan, e.g. "concept-1", "try-2". Lets the brain
   *  branch to a specific segment via `advance_lesson({ to })`. */
  id: string;
  /** Optional teacher's note that the BRAIN reads but does NOT speak.
   *  Use it to capture intent the script can't express. */
  teacherNote?: string;
  /** Approximate time budget for this segment, in minutes. Used by the
   *  pedagogy layer to pace the lesson. */
  estimatedMinutes?: number;
}

/** Opening hook — pique curiosity, connect to prior knowledge, real-world
 *  motivation. The brain is told to be brief here (~30 seconds). */
export interface SegmentHook extends SegmentBase {
  kind: 'hook';
  /** What the hook should accomplish, e.g. "Get the student to wonder
   *  why we'd ever need negative numbers." */
  goal: string;
  /** Optional opening line the brain can say verbatim or paraphrase. */
  script?: string;
  /** Optional tool hints. */
  suggestedTools?: SuggestedToolId[];
}

/** Concept teaching — the central explanation. */
export interface SegmentConcept extends SegmentBase {
  kind: 'concept';
  goal: string;
  /** Bullet-list of key ideas the brain MUST cover (not necessarily
   *  verbatim). Order matters when ideas build on each other. */
  keyIdeas: string[];
  /** Vocabulary the brain should explicitly introduce. */
  vocabulary?: Array<{ term: string; definition: string }>;
  /** Tool hints. */
  suggestedTools?: SuggestedToolId[];
  /** Optional reference materials for the brain (image URL, equation
   *  to write, etc.). */
  references?: Array<{ kind: 'image' | 'equation' | 'note'; content: string }>;
}

/** A solved example walked through end-to-end. The brain narrates each
 *  step, optionally pausing to ask the student to predict the next move. */
export interface SegmentWorkedExample extends SegmentBase {
  kind: 'worked_example';
  problem: string;
  /** Steps in order. Each is a one-line description; the brain expands
   *  during narration. */
  steps: string[];
  /** Final answer (used for the brain to verify its narration ends in
   *  the right place). */
  answer?: string;
}

/** Hand-off problem for the student. The brain gives the question, waits
 *  for student work, then validates. */
export interface SegmentTryYourself extends SegmentBase {
  kind: 'try_yourself';
  problem: string;
  /** Expected answer. The brain compares student work against this. */
  expectedAnswer?: string;
  /** Hints to give if the student is stuck (in order of escalating
   *  specificity). */
  hints?: string[];
  /** Format of the expected response. */
  responseFormat?: 'mcq' | 'frq' | 'numeric' | 'free';
  /** When responseFormat === 'mcq', the choices. */
  choices?: Array<{ id: string; text: string; correct?: boolean }>;
}

/** A "watch out for" check — the brain poses a distractor problem
 *  designed to surface a common misconception, then teaches around it. */
export interface SegmentMisconceptionCheck extends SegmentBase {
  kind: 'misconception_check';
  question: string;
  /** Common wrong answers and what the underlying misconception is. */
  commonErrors: Array<{ answer: string; misconception: string; correctsTo: string }>;
}

/** End-of-lesson recap. The brain summarizes the must-remember points. */
export interface SegmentRecap extends SegmentBase {
  kind: 'recap';
  mustRemember: string[];
}

/** Optional extension — for students who finish early or want more
 *  challenge. The brain only enters this if the student requests it
 *  or `advance_lesson` explicitly branches in. */
export interface SegmentExtension extends SegmentBase {
  kind: 'extension';
  advancedQuestion: string;
  hint?: string;
}

/** Top-level lesson plan. */
export interface LessonPlan {
  /** Stable plan id, e.g. "evelyn.g6.math.fractions.add-unlike-denoms.v1". */
  id: string;
  /** Human-readable title shown in dropdowns / headers. */
  title: string;
  /** Curriculum tag — drives filtering by partner / locale. */
  curriculum: CurriculumStandard;
  /** Grade band this plan targets. */
  grade: string;
  /** Subject from the existing taxonomy ("math" | "science" | …). */
  subject: string;
  /** Topic id from the existing taxonomy if the plan slots into one. */
  topic?: string;
  /** Locale, ISO-639-1 + optional region: "en", "en-US", "hi-IN", etc. */
  locale?: string;
  /** One or more LOs the plan targets. */
  los: LearningObjective[];
  /** Total time budget, minutes. Sum of segment minutes is a sanity check. */
  estimatedMinutes: number;
  /** Ordered teaching segments. */
  segments: Segment[];
  /** LO ids the student should already know before starting this plan. */
  prerequisites?: string[];
  /** LO ids the student is ready for after mastering this plan. */
  followUps?: string[];
  /** Author / source attribution (esp. for B2B-supplied plans). */
  source?: { author?: string; org?: string; license?: string };
  /** Schema version. Bump when the type shape changes incompatibly. */
  schemaVersion: number;
  /** Free-form metadata for partners to attach things we don't model. */
  metadata?: Record<string, unknown>;
}

export const LESSON_PLAN_SCHEMA_VERSION = 1;

/** Util: returns the segment with id, or undefined. */
export function getSegment(plan: LessonPlan, segmentId: string): Segment | undefined {
  return plan.segments.find((s) => s.id === segmentId);
}

/** Util: returns the next segment after the given id, or undefined if
 *  the given id is the last one or not found. */
export function getNextSegment(plan: LessonPlan, currentSegmentId: string): Segment | undefined {
  const idx = plan.segments.findIndex((s) => s.id === currentSegmentId);
  if (idx < 0 || idx >= plan.segments.length - 1) return undefined;
  return plan.segments[idx + 1];
}
