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

/** Authored contract that pins down the EXACT tool emission for a
 *  segment. When set, the orchestrator deep-equals the brain's emitted
 *  params against `params` (for the matching `tool` name) and rejects
 *  via the existing validator-feedback retry loop on mismatch — same
 *  pattern as the show_problem authored-target check. Use this for
 *  segments where determinism matters (test plans, segments with
 *  scripted concrete examples). Leave unset for segments where the
 *  brain has authoring freedom. */
export interface PrescribedRender {
  /** The tool name the brain MUST emit, e.g. "show_diagram",
   *  "show_problem", "show_equation". Match is by exact string. */
  tool: string;
  /** The params object the brain MUST emit verbatim. Deep-equal compared
   *  against the brain's emission. Field order doesn't matter; types
   *  do (string "5" !== number 5). */
  params: Record<string, unknown>;
}

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
  /** Optional authored contract for the SPECIFIC tool emission this
   *  segment requires. When set, the orchestrator's validator rejects
   *  any matching-tool emission whose params differ. Brain corrects via
   *  the existing retry loop. Use for test plans that need a specific
   *  diagram/problem to render. */
  prescribedRender?: PrescribedRender;
  /** Optional list of phrases the brain's narration MUST contain across
   *  this segment's turns. Case-insensitive substring match. After the
   *  brain's first non-trivial turn in the segment (≥3 sentences), any
   *  unmatched phrase triggers a validator-feedback rejection. Use to
   *  pin narrative parameters that prescribedRender can't capture (e.g.
   *  search-target value, example dataset, worked-example operand) —
   *  the brain otherwise drifts to a different example value mid-trace.
   *  Keep phrases short and concrete; long phrases or sentence fragments
   *  false-positive easily. */
  requiredPhrases?: string[];
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
  /** Optional shared stimulus passage this prompt analyzes (passages/store). */
  passageId?: string;
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
/** One scoring criterion of an FRQ rubric (usually one lettered part).
 *  Mirrors `FrqRubric.parts[]` in @evelyn/portal-contract/v1 — kept in-tree
 *  so lesson-plan authoring stays portal-agnostic; structurally identical, so
 *  it flows to the contract type without conversion. */
export interface FrqRubricPart {
  /** Stable id for the criterion, e.g. 'a', 'b', 'c-conclusion'. */
  criterionId: string;
  /** Points this criterion is worth. */
  maxPoints: number;
  /** What a response must show to earn the points. */
  scoringCriteria: string;
  /** Full-credit reference response for this part. */
  modelResponse: string;
}

/** Part-by-part AP-style FRQ rubric. */
export interface FrqRubric {
  parts: FrqRubricPart[];
}

export interface SegmentTryYourself extends SegmentBase {
  kind: 'try_yourself';
  problem: string;
  /** Expected answer. The brain compares student work against this. */
  expectedAnswer?: string;
  /** Optional part-by-part AP rubric. When present on an FRQ, a scored quiz /
   *  practice item is graded criterion-by-criterion for partial credit
   *  (portal/grade-free-response.ts); when absent, FRQ grading falls back to
   *  the single-answer judge. */
  rubric?: FrqRubric;
  /** Optional full-credit reference solution (used by the legacy judge path
   *  and for review display). */
  modelResponse?: string;
  /** Hints to give if the student is stuck (in order of escalating
   *  specificity). */
  hints?: string[];
  /** Format of the expected response. */
  responseFormat?: 'mcq' | 'frq' | 'numeric' | 'free';
  /** When responseFormat === 'mcq', the choices. */
  choices?: Array<{ id: string; text: string; correct?: boolean }>;
  /** Optional shared stimulus passage this prompt analyzes (passages/store). */
  passageId?: string;
  /** Optional MULTI-source packet (Synthesis FRQ): several passages the prompt
   *  synthesizes. Resolved passages are concatenated + labeled Source A/B/C for
   *  the grader. Use instead of (or alongside) passageId for synthesis tasks. */
  passageIds?: string[];
  /** Marks this segment as deliberately off-topic relative to the rest
   *  of the plan. Test plans use this to bait the runtime's relevance
   *  checks. The orchestrator MUST refuse to render an offTopic segment
   *  via passive natural-flow advance (advance_lesson + show_segment_card)
   *  and surface a tool_result error so the brain knows to route around
   *  it instead of treating the bait as a legitimate problem. */
  offTopic?: boolean;
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
  /** Pacing v2 — Phase 4: per-plan pacing-threshold override. When
   *  present, OVERRIDES the gradeProfile defaults at request-payload
   *  assembly time. Lets a partner / curriculum author tune
   *  silentRamp / explicitOffer / inverseStreak per their pedagogy.
   *  E.g. test-prep plans may want explicitOfferStreak=6 (more
   *  drilling before offering a switch); K-2 may want everything at
   *  2 (shorter attention budget). All five fields are required when
   *  the object is present — partial overrides are NOT supported, to
   *  keep the threshold semantics coherent. */
  pacingThresholds?: {
    silentRampStreak: number;
    explicitOfferStreak: number;
    inverseStreak: number;
    checkInMinTurns: number;
    checkInCooldown: number;
  };
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
