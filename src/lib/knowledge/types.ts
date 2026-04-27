/**
 * Knowledge Module Types
 *
 * These interfaces define the structure of knowledge modules that can be
 * plugged into the AI tutor. They are designed to be subject-agnostic,
 * working for physics, math, history, languages, and any other subject.
 */

// =============================================================================
// CORE MODULE INTERFACE
// =============================================================================

export type Subject =
  | 'physics'
  | 'math'
  | 'chemistry'
  | 'biology'
  | 'history'
  | 'english'
  | 'languages'
  | 'economics';

export type Level =
  | 'middle-school'
  | 'high-school'
  | 'AP'
  | 'SAT'
  | 'ACT'
  | 'college-intro'
  | 'college-advanced';

/**
 * A Knowledge Module contains everything the tutor needs to teach
 * one topic at one level.
 */
export interface KnowledgeModule {
  // Identity
  id: string; // e.g., 'physics-kinematics-ap'
  subject: Subject;
  topic: string;
  level: Level;
  version: string;

  // Display
  displayName: string; // e.g., "AP Physics 1: Kinematics"
  description: string;
  estimatedHours: number; // How long to master

  // Content
  concepts: Concept[];
  problems: Problem[];
  workedExamples: WorkedExample[];
  misconceptions: Misconception[];
  realWorldConnections: RealWorldExample[];

  // Subject-specific content
  equations?: Equation[]; // For math/science
  vocabulary?: VocabTerm[]; // For languages/history

  // Visuals
  diagramTypes: string[]; // Which diagram plugins this module uses
  defaultDiagrams?: WhiteboardCommand[];

  // AI Behavior
  systemPromptAdditions: string; // Topic-specific instructions

  // Prerequisites
  prerequisites: string[]; // Module IDs that should come first

  // Assessment
  masteryThreshold: number; // 0-100, when is topic "mastered"?
}

// =============================================================================
// CONCEPTS
// =============================================================================

export interface Concept {
  id: string;
  name: string;
  category: 'foundational' | 'core' | 'advanced';

  // Prerequisites within this module
  prerequisiteConcepts: string[];

  // Core content
  definition: {
    formal: string; // Textbook/formal definition
    intuitive: string; // Plain language
    forVoice: string; // Conversational (optimized for speech)
  };

  keyPoints: string[];

  // Symbols and units (for math/science)
  symbols?: ConceptSymbol[];

  // Multiple explanation strategies
  explanations: Explanation[];

  // Connect to real world
  realWorldExamples: RealWorldExample[];

  // What students get wrong
  commonErrors: CommonError[];

  // Practice progression
  practiceProgression: PracticeLevel[];

  // Assessment
  checkQuestions: string[]; // Quick verbal checks
  masteryIndicators: string[]; // Signs they understand

  // Default visuals
  defaultDiagrams?: WhiteboardCommand[];
}

export interface ConceptSymbol {
  symbol: string;
  meaning: string;
  unit: string;
  unitSymbol: string;
}

export interface Explanation {
  id: string;
  approach: 'graphical' | 'algebraic' | 'intuitive' | 'analogy' | 'experimental' | 'step-by-step';
  name: string;
  content: string; // The explanation (voice-ready)
  bestFor: string; // When to use this approach
  whiteboard?: WhiteboardCommand[];
}

export interface RealWorldExample {
  id: string;
  scenario: string;
  connection: string; // How it relates to concept
  difficulty: 'simple' | 'moderate' | 'complex';
  numbers?: Record<string, { value: number; unit: string }>;
  followUpQuestions?: string[];
}

export interface CommonError {
  error: string;
  why: string; // Why students make this error
  detection: string[]; // Phrases/behaviors that indicate this
  correction: string; // How to address it
}

export interface PracticeLevel {
  level: 'recognition' | 'application' | 'analysis' | 'synthesis';
  description: string;
  exampleTask: string;
  successCriteria: string;
}

// =============================================================================
// EQUATIONS (for math/science)
// =============================================================================

export interface Equation {
  id: string;
  name: string;
  latex: string;
  description: string;

  variables: EquationVariable[];

  // When to use
  useWhen: string[];
  limitations: string[];

  // Derivation
  derivation?: {
    steps: string[];
    fromEquations?: string[]; // equation IDs
  };

  // Common mistakes
  commonMistakes: string[];

  // Visual meaning
  graphicalMeaning?: {
    description: string;
    whiteboard: WhiteboardCommand;
  };
}

export interface EquationVariable {
  symbol: string;
  name: string;
  description: string;
  unit: string;
}

// =============================================================================
// VOCABULARY (for languages/history)
// =============================================================================

export interface VocabTerm {
  id: string;
  term: string;
  definition: string;
  context: string;
  examples: string[];
  relatedTerms: string[];
}

// =============================================================================
// MISCONCEPTIONS
// =============================================================================

export interface Misconception {
  id: string;
  name: string;
  relatedConcepts: string[];
  severity: 'minor' | 'moderate' | 'critical';

  // What they believe
  description: string;

  // Where this comes from
  origin: string;

  // Detection patterns
  detectPatterns: {
    verbal: string[]; // Things they might say
    problemSolving: string[]; // Errors in their work
    graphical?: string[]; // Misreadings of graphs
  };

  // Correction strategy
  correction: {
    acknowledge: string; // Validate their thinking first
    conflictQuestion: string; // Socratic question that reveals issue
    conflictExample: string; // Concrete counterexample
    correctExplanation: string;
    whiteboard?: WhiteboardCommand[];
    verificationQuestion: string; // Check if it stuck
  };

  // How persistent
  persistence: 'low' | 'medium' | 'high';

  // Related misconceptions
  relatedMisconceptions?: string[];
}

// =============================================================================
// PROBLEMS
// =============================================================================

export type ProblemType =
  | 'calculation'
  | 'conceptual'
  | 'graphical'
  | 'multi-step'
  | 'multiple-choice'
  | 'free-response'
  | 'analysis'
  | 'estimation';

export type ProblemSource = 'curated' | 'ai-generated' | 'student-provided' | 'pdf-extracted';

export type ProblemFormat =
  | 'multiple-choice'
  | 'grid-in'
  | 'free-response'
  | 'short-answer'
  | 'true-false';

export interface ProblemAnswerChoice {
  letter: string; // "A", "B", "C", "D", "E", "1", "2", ...
  text: string;
}

export interface Problem {
  id: string;
  source: ProblemSource;
  sourceReference?: string; // e.g., "Giancoli Ch.2 #15"

  // Classification
  concepts: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: ProblemType;
  estimatedMinutes: number;

  // The problem
  title?: string;
  statement: string;
  context?: string;
  stimulus?: Stimulus; // For reading passages, images, etc.

  // Presentation format (used when displayed on the whiteboard)
  format?: ProblemFormat;
  answerChoices?: ProblemAnswerChoice[]; // Required when format === 'multiple-choice'
  sourceTag?: string; // Human-readable test/exam tag shown to the student, e.g. "SAT No-Calc", "JEE Main", "GCSE Higher"
  difficultyLabel?: 'easy' | 'medium' | 'hard';

  // Given information (for quantitative problems)
  givenValues?: GivenValue[];
  unknowns?: Unknown[];

  // Diagram
  diagram?: {
    type: string;
    params: Record<string, unknown>;
  };

  // Solution
  solution: ProblemSolution;

  // Progressive hints
  hints: ProblemHint[];

  // Common errors on THIS problem
  problemSpecificErrors?: {
    error: string;
    howToDetect: string;
    feedback: string;
  }[];

  // For follow-up
  variations?: string[]; // Problem IDs
  relatedConcepts?: string[];
  tags: string[];
}

export interface Stimulus {
  type: 'text' | 'image' | 'graph' | 'table' | 'diagram';
  content: string; // Text or URL
  description?: string; // For accessibility
}

export interface GivenValue {
  symbol: string;
  value: number | 'variable';
  unit: string;
  description?: string;
}

export interface Unknown {
  symbol: string;
  description: string;
  unit: string;
}

export interface ProblemSolution {
  approach: string; // Strategy description
  steps: SolutionStep[];
  finalAnswer: Answer;
  alternativeApproaches?: AlternativeApproach[];
  conceptualAnswer?: string; // For conceptual problems
}

export interface SolutionStep {
  stepNumber: number;
  description: string; // What we're doing
  explanation?: string; // Why we're doing it
  equation?: string; // LaTeX
  substitution?: string; // LaTeX with numbers
  result?: string; // LaTeX result
  whiteboard?: WhiteboardCommand;
}

export interface Answer {
  value?: number;
  unit?: string;
  text?: string; // For non-numeric answers
  significantFigures?: number;
  acceptableRange?: [number, number]; // For estimation problems
}

export interface AlternativeApproach {
  name: string;
  description: string;
  steps: SolutionStep[];
}

export interface ProblemHint {
  level: 1 | 2 | 3; // 1 = gentle nudge, 3 = nearly gives it away
  hint: string;
  whiteboard?: WhiteboardCommand;
}

// =============================================================================
// WORKED EXAMPLES
// =============================================================================

export interface WorkedExample {
  id: string;
  title: string;
  concepts: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;

  // The problem
  problem: {
    statement: string;
    givenValues: GivenValue[];
    find: string;
  };

  // Step-by-step walkthrough with teaching notes
  walkthrough: WorkedExampleStep[];

  // Wrap up
  keyTakeaways: string[];
  practiceNow?: string; // Problem ID to try next
}

export interface WorkedExampleStep {
  step: number;
  tutorSays: string; // What to say out loud
  tutorDoes?: WhiteboardCommand; // What to show
  checkQuestion?: string; // Optional understanding check
  commonStumble?: string; // Where students often get lost here
}

// =============================================================================
// WHITEBOARD COMMANDS
// =============================================================================

export type Point = { x: number; y: number };

export type GraphType = 'position-time' | 'velocity-time' | 'acceleration-time' | 'generic-xy';

export interface GraphData {
  title?: string;
  xLabel: string;
  yLabel: string;
  xRange: [number, number];
  yRange: [number, number];
  functions?: GraphFunction[];
  functionsOfY?: GraphFunctionOfY[];
  points?: GraphPoint[];
  annotations?: GraphAnnotation[];
  shadedRegion?: ShadedRegion;
}

export interface GraphFunction {
  fn?: string; // Legacy JS expression: "2*t + 5" or "-4.9*t^2 + 20*t"
  latex?: string; // LaTeX expression: "2t + 5" (preferred, used by Desmos)
  color?: string;
  label?: string;
  domain?: [number, number];
}

export interface GraphFunctionOfY {
  fn?: string; // Legacy JS expression: "y**3" or "3*y - 2"
  latex?: string; // LaTeX expression (preferred, used by Desmos)
  color?: string;
  label?: string;
  domain?: [number, number]; // y-domain
}

export interface ShadedRegion {
  axis: 'x' | 'y'; // which variable to integrate over
  between: [string, string]; // two function expressions (e.g. ["3*y - 2", "y**3"])
  from: number; // lower bound
  to: number; // upper bound
  color?: string;
  opacity?: number;
}

export interface GraphPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface GraphAnnotation {
  type: 'slope' | 'area' | 'tangent' | 'secant' | 'point-label';
  from?: number;
  to?: number;
  at?: number;
  label?: string;
  color?: string;
}

// ── Structured Math Diagram Types ──

export interface NumberLinePoint {
  value: number;
  label?: string;
  color?: string;
  style?: 'filled' | 'open';
}

export interface NumberLineInterval {
  from: number;
  to: number;
  fromInclusive?: boolean;
  toInclusive?: boolean;
  color?: string;
  label?: string;
}

export interface NumberLineSegment {
  from: number;
  to: number;
  label?: string;
  color?: string;
  arc?: boolean;
}

export interface GeometryPoint {
  id: string;
  x: number;
  y: number;
  /** Display name only — e.g. "A", "O", "P_1". Do NOT embed coordinates here;
   *  set `showCoords: true` and the renderer will append "(x, y)" derived from
   *  the actual numeric x/y. This avoids "label says (3,6) but point is at
   *  (3,7)" drift, which the LLM gets wrong with high frequency. */
  label?: string;
  /** When true, the renderer appends a `(x, y)` tuple to the label using the
   *  actual numeric coordinates. */
  showCoords?: boolean;
  color?: string;
}

export interface GeometrySegment {
  from: string;
  to: string;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  /** Free-form label, e.g. "chord AB", "altitude h", "side a". Do NOT write
   *  the numeric length here — set `showLength: true` and the renderer will
   *  compute it from the endpoints. */
  label?: string;
  /** When true, the renderer appends/uses the actual computed segment length
   *  (e.g. "4.47" or "√20") instead of trusting LLM arithmetic. */
  showLength?: boolean;
  tickMarks?: number;
}

export interface GeometryPolygon {
  vertices: string[];
  fill?: string;
  stroke?: string;
  label?: string;
}

export interface GeometryCircle {
  center: string;
  radius: number;
  style?: 'solid' | 'dashed';
  color?: string;
  label?: string;
}

export interface GeometryAngle {
  vertex: string;
  from: string;
  to: string;
  label?: string;
  style?: 'arc' | 'square';
  color?: string;
}

export interface GeometryArc {
  center: string;
  radius: number;
  startAngle: number;
  endAngle: number;
  color?: string;
  label?: string;
}

/**
 * Conic section — ellipse, parabola, or hyperbola — as a renderable
 * primitive. Stored in canonical form with center/vertex + semi-axes
 * + rotation (radians, CCW). The renderer samples the curve into an
 * SVG path. Foci, vertices, directrices, and asymptotes are NOT stored
 * here — they're emitted as separate points / segments / lines by the
 * solver when the brain asks for them, so they pick up labels and
 * styling like any other point.
 */
export interface GeometryConic {
  type: 'ellipse' | 'parabola' | 'hyperbola';
  /** Point id for the center (ellipse, hyperbola) or vertex (parabola). */
  center: string;
  /** Semi-major / semi-minor for ellipse and hyperbola; `a` is the
   *  focal-vertex distance (focal length) for a parabola, `b` unused. */
  a: number;
  b?: number;
  /** Rotation in radians, CCW from the canonical orientation
   *  (major axis along +x for ellipse/hyperbola; opens along +x for
   *  parabola). */
  rotation?: number;
  color?: string;
  label?: string;
  /** Style options for the rendered curve. */
  style?: 'solid' | 'dashed';
}

export interface UnitCircleHighlight {
  angle: number;
  color?: string;
  showTriangle?: boolean;
  showCoords?: boolean;
  label?: string;
}

export interface TreeNode {
  label: string;
  value?: string;
  color?: string;
  children?: Array<{
    label: string;
    probability?: string;
    node: TreeNode;
  }>;
}

export interface VennRegion {
  value?: string;
  highlight?: boolean;
  items?: string[];
}

export interface BoxPlotData {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
  color?: string;
}

export interface PieSlice {
  label: string;
  value: number;
  color?: string;
}

export type WhiteboardCommand =
  | { action: 'clear' }
  | { action: 'newPage'; title?: string }
  | { action: 'goToPage'; title: string }
  | {
      // Annotate an EXISTING whiteboard item — the tutor equivalent of a
      // real teacher circling, underlining, or pointing at something
      // already on the board. Renders as an SVG overlay on top of the
      // target item; does NOT redraw it.
      //
      // Tutor-facing addressing: a single `target` string naming the
      // feature. The handler resolves `target` against the session's
      // WhiteboardCatalog and stamps `targetId` + `targetFeature` on
      // this command before it reaches the renderer — all the other
      // fields below are populated by the resolver, not the tutor.
      //
      // Renderer convention (unchanged): feat() emits attributes of the
      // form <g data-feature="object" data-feature-cx="0.25" ...> on
      // every labeled element, and the overlay looks up the resolved
      // `targetFeature` directly against those attributes.
      action: 'scribble';
      /**
       * TUTOR-SUPPLIED: a natural-language or canonical name for the
       * feature to mark (e.g. "point-a", "vertex A", "the object").
       * The resolver maps this to targetId + targetFeature.
       */
      target?: string;
      /** Resolver output — id of the item owning the matched feature. */
      targetId?: string;
      /** Resolver output — canonical data-feature name (e.g. "point-a"). */
      targetFeature?: string;
      /** Resolver output — 1-indexed item position for overlay routing. */
      targetItemIndex?: number;
      /** Resolver output — title of the page holding the target item. */
      targetPageTitle?: string;
      /** Resolver output — 0-indexed page holding the target item. */
      targetPageIndex?: number;
      shape: 'circle' | 'underline' | 'arrow' | 'box' | 'highlight';
      color?: string;
      /** Optional callout text drawn near the mark. */
      label?: string;
    }
  | {
      // Bring an item into view so the tutor can reference it without
      // redrawing. Tutor passes a single `target` string — same shape as
      // tutor_scribble. The handler resolves it via the WhiteboardCatalog
      // and stamps the resolved page + item onto the command. Reserved
      // values "top" / "bottom" scroll the current page edges.
      action: 'scrollTo';
      /** Tutor-supplied: feature name OR "top" / "bottom". */
      target: string;
      /** Resolver output — id of the item to focus. */
      targetId?: string;
      /** Resolver output — canonical feature name to bring into view. */
      targetFeature?: string;
      /** Resolver output — 1-indexed item position. */
      itemIndex?: number;
      /** Resolver output — 0-indexed page. */
      pageIndex?: number;
      /** Resolver output — title of the page (when titled). */
      pageTitle?: string;
    }
  | { action: 'showEquation'; latex: string; label?: string; highlight?: string[] }
  | { action: 'showGraph'; type: GraphType; data: GraphData }
  | { action: 'showDiagram'; type: string; params: Record<string, unknown> }
  | { action: 'drawVector'; from: Point; to: Point; label?: string; color?: string }
  | { action: 'annotate'; text: string; position: Point; style?: 'normal' | 'highlight' | 'warning' }
  | { action: 'highlight'; elementId: string; color?: string }
  | { action: 'showProblem'; problem: Partial<Problem> }
  | { action: 'showSolution'; steps: SolutionStep[] }
  | { action: 'showWorkedExample'; example: Partial<WorkedExample> }
  | { action: 'showTable'; headers: string[]; rows: string[][] }
  | { action: 'showImage'; url: string; alt: string }
  | { action: 'showSvgDiagram'; svg: string; title?: string; description?: string }
  | { action: 'showCode'; code: string; language?: string; label?: string }
  // ── New structured math diagram tools ──
  | { action: 'showNumberLine'; title?: string; min: number; max: number; step?: number; points?: NumberLinePoint[]; intervals?: NumberLineInterval[]; segments?: NumberLineSegment[]; fractionTicks?: { denominator: number; showLabels?: boolean } }
  | { action: 'showGeometry'; title?: string; points: GeometryPoint[]; segments?: GeometrySegment[]; polygons?: GeometryPolygon[]; circles?: GeometryCircle[]; arcs?: GeometryArc[]; angles?: GeometryAngle[]; conics?: GeometryConic[]; showGrid?: boolean; showAxes?: boolean; viewRange?: { x: [number, number]; y: [number, number] } }
  | { action: 'showGeometryConstructed'; title?: string; given?: unknown[]; steps?: unknown[]; display?: Record<string, unknown> }
  | { action: 'advanceLesson'; to: string; reason?: string }
  | { action: 'markSegmentComplete'; segmentId: string; masteryDelta?: number; notes?: string }
  | {
      action: 'showTryYourself';
      problem: string;
      expectedAnswer?: string;
      responseFormat?: 'mcq' | 'frq' | 'numeric';
      choices?: Array<{ id: string; text: string; correct?: boolean }>;
      hints?: string[];
      title?: string;
    }
  | { action: 'showUnitCircle'; title?: string; highlightAngles?: UnitCircleHighlight[]; showAllStandard?: boolean; showRadians?: boolean; showDegrees?: boolean; showArc?: { from: number; to: number; color?: string; label?: string } }
  | { action: 'showFractionBar'; title?: string; items: Array<{ numerator: number; denominator: number; label?: string; highlightColor?: string; style?: 'bar' | 'circle' | 'grid' }>; layout?: 'vertical' | 'horizontal'; showComparison?: boolean }
  | { action: 'showTree'; title?: string; type?: 'probability' | 'factor' | 'decision' | 'generic'; root: TreeNode; showLeafProbabilities?: boolean; direction?: 'top-down' | 'left-right' }
  | { action: 'showVennDiagram'; title?: string; sets: Array<{ label: string; color?: string }>; regions: Record<string, VennRegion>; universalLabel?: string }
  | { action: 'showMatrix'; title?: string; rows: string[][]; brackets?: 'square' | 'round' | 'pipes' | 'double-pipes'; augmented?: number; rowLabels?: string[]; colLabels?: string[]; rowOperations?: Array<{ description: string; targetRow: number }>; resultMatrix?: { rows: string[][]; brackets?: 'square' | 'round' | 'pipes' | 'double-pipes' }; operatorSymbol?: string }
  | { action: 'showStats'; title?: string; type: 'histogram' | 'boxplot' | 'dotplot' | 'bar' | 'pie' | 'distribution'; data?: number[]; binWidth?: number; xLabel?: string; yLabel?: string; boxplot?: { datasets: BoxPlotData[]; showValues?: boolean }; bar?: { categories: string[]; values: number[]; colors?: string[] }; pie?: { slices: PieSlice[]; showPercentages?: boolean }; distribution?: { family: 'normal' | 't' | 'chi-square' | 'F'; params?: { mean?: number; sd?: number; df?: number; df1?: number; df2?: number }; shade?: { type: 'less' | 'greater' | 'between' | 'outside'; a?: number; b?: number; color?: string }; xRange?: [number, number]; showMean?: boolean; probabilityLabel?: string } }
  | { action: 'showMolecule'; smiles: string; title?: string; description?: string; interactive?: boolean }
  | { action: 'showTimeline'; title?: string; events: Array<{ date: string; title: string; description?: string; category?: string; color?: string }>; orientation?: 'horizontal' | 'vertical' }
  | { action: 'showMap'; title?: string; background?: 'blank' | 'world' | 'north-america' | 'south-america' | 'europe' | 'asia' | 'africa' | 'australia' | 'usa' | 'india' | 'china' | 'middle-east' | 'mediterranean'; pins?: Array<{ lat?: number; lon?: number; x?: number; y?: number; label: string; color?: string }>; regions?: Array<{ points?: string; path?: string; label?: string; color?: string }>; caption?: string }
  | { action: 'showCircuit'; title?: string; nodes?: Array<{ id: string; x: number; y: number }>; components: Array<{ type: 'resistor' | 'capacitor' | 'inductor' | 'battery' | 'wire' | 'switch-open' | 'switch-closed' | 'bulb' | 'voltmeter' | 'ammeter' | 'galvanometer' | 'ground'; from: string; to: string; value?: string; unit?: string; label?: string }>; showNodes?: boolean }
  | { action: 'showLewis'; title?: string; atoms: Array<{ id: string; element: string; x: number; y: number; lonePairs?: number; formalCharge?: number }>; bonds?: Array<{ from: string; to: string; order: 1 | 2 | 3; style?: 'solid' | 'dashed' | 'wedge' | 'dash-wedge' }>; formula?: string; geometry?: string }
  | { action: 'showPeriodicTable'; title?: string; highlight?: Array<{ symbol: string; color?: string; note?: string }>; highlightGroup?: number; highlightPeriod?: number; highlightCategory?: 'alkali' | 'alkaline-earth' | 'transition' | 'post-transition' | 'metalloid' | 'reactive-nonmetal' | 'halogen' | 'noble-gas' | 'lanthanide' | 'actinide'; showMass?: boolean }
  | { action: 'showAnnotatedPassage'; title?: string; source?: string; passage?: string; lines?: string[]; startLineNumber?: number; highlights?: Array<{ line: number; text: string; color?: string; note?: string }>; marginNotes?: Array<{ line: number; text: string }> }
  | { action: 'showCallStack'; title?: string; frames: Array<{ function: string; args?: Record<string, string | number>; locals?: Record<string, string | number>; currentLine?: number; returnValue?: string | number; highlight?: boolean }>; finalReturn?: string | number }
  | { action: 'showFlowchart'; title?: string; nodes: Array<{ id: string; type: 'start' | 'end' | 'process' | 'decision' | 'io'; label: string; x?: number; y?: number }>; edges?: Array<{ from: string; to: string; label?: string }>; layout?: 'top-down' | 'left-right' }
  | { action: 'showManipulative'; title?: string; type: 'base-10' | 'ten-frame' | 'area-model'; base10?: { ones?: number; tens?: number; hundreds?: number; thousands?: number; showTotal?: boolean }; tenFrame?: { count: number; color?: string; label?: string }; areaModel?: { rows: number[]; cols: number[]; showProducts?: boolean; showSum?: boolean; rowLabel?: string; colLabel?: string } }
  | { action: 'showPunnett'; title?: string; trait?: string; parent1: string; parent2: string; showPhenotypeRatio?: boolean }
  | {
      action: 'showCollision';
      title?: string;
      dimension?: '1D' | '2D';
      type?: 'elastic' | 'inelastic' | 'perfectly-inelastic';
      before: Array<{ label?: string; mass?: number; velocity?: number; vx?: number; vy?: number; color?: string }>;
      after: Array<{ label?: string; mass?: number; velocity?: number; vx?: number; vy?: number; color?: string }>;
      notes?: string;
      momentumAnnotation?: string;
    }
  | {
      action: 'showEnergyBars';
      title?: string;
      positions: Array<{ label: string; ke?: number; pe?: number; spring?: number; thermal?: number }>;
      yAxisLabel?: string;
      showTotalLine?: boolean;
      notes?: string;
    }
  | {
      action: 'showFreeBodyDiagram';
      title?: string;
      object: { shape?: 'box' | 'circle' | 'person'; label?: string; mass?: string };
      surface?: { type: 'horizontal' | 'inclined' | 'vertical' | 'none'; angle?: number; friction?: boolean };
      forces: Array<{
        name: string;
        magnitude?: string;
        direction:
          | 'up' | 'down' | 'left' | 'right'
          | 'up-left' | 'up-right' | 'down-left' | 'down-right'
          | 'normal' | 'up-slope' | 'down-slope' | 'into-surface'
          | number;
        color?: string;
        scale?: number;
      }>;
      notes?: string;
    }
  | {
      action: 'showReactionCoordinate';
      title?: string;
      reactants_energy?: number;
      products_energy: number;
      activation_energies: number[];
      curve_labels?: string[];
      reactant_label?: string;
      product_label?: string;
      units?: string;
    }
  | {
      action: 'showCoordinatePlane';
      title?: string;
      xRange?: [number, number];
      yRange?: [number, number];
      xLabel?: string;
      yLabel?: string;
      points?: Array<{ x: number; y: number; label?: string; color?: string }>;
      segments?: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; label?: string; color?: string; dashed?: boolean; arrow?: boolean }>;
      vectors?: Array<{ from?: { x: number; y: number }; to: { x: number; y: number }; label?: string; color?: string }>;
      showGrid?: boolean;
      notes?: string;
    }
  | {
      action: 'showScatterPlot';
      title?: string;
      xLabel?: string;
      yLabel?: string;
      points: Array<{ x: number; y: number; label?: string; color?: string; series?: string }>;
      xRange?: [number, number];
      yRange?: [number, number];
      showTrendLine?: boolean;
      trendLineEquation?: string;
      notes?: string;
    }
  | {
      action: 'showCycleDiagram';
      title?: string;
      stages: Array<{ label: string; description?: string; color?: string; icon?: string }>;
      clockwise?: boolean;
      notes?: string;
    }
  | {
      action: 'showConceptMap';
      title?: string;
      nodes: Array<{ id: string; label: string; x?: number; y?: number; color?: string; level?: number }>;
      edges?: Array<{ from: string; to: string; label?: string; directed?: boolean; color?: string }>;
      notes?: string;
    }
  | {
      action: 'showMotionDiagram';
      title?: string;
      timeLabel?: string;
      series: Array<{ kind: 'position' | 'velocity' | 'acceleration'; points: Array<{ t: number; value: number }>; label?: string; color?: string; yLabel?: string }>;
      notes?: string;
    }
  | {
      action: 'showProjectileMotion';
      title?: string;
      v0: number;
      angle: number;
      y0?: number;
      g?: number;
      showComponents?: boolean;
      sampleCount?: number;
      speedUnit?: string;
      distanceUnit?: string;
      notes?: string;
    }
  | {
      action: 'showSimpleMachine';
      title?: string;
      type: 'lever' | 'pulley' | 'inclined-plane' | 'wedge';
      variant?: 'class-1' | 'class-2' | 'class-3' | 'fixed' | 'movable' | 'compound';
      effort?: number;
      load?: number;
      effortArm?: number;
      loadArm?: number;
      angle?: number;
      length?: number;
      height?: number;
      ropes?: number;
      unit?: string;
      notes?: string;
    }
  | {
      action: 'showPendulum';
      title?: string;
      length: number;
      amplitude: number;
      mass?: number;
      g?: number;
      showArc?: boolean;
      notes?: string;
    }
  | {
      action: 'showSpringMass';
      title?: string;
      /** Chain mode: left-to-right list of wall / spring / mass elements.
       *  When present, takes priority over k/mass/displacement below. */
      elements?: Array<{
        type: 'wall' | 'spring' | 'mass';
        k?: number;
        mass?: number;
        displacement?: number;
        naturalLength?: number;
        label?: string;
      }>;
      // Legacy single-mass fields (still supported for backward compat).
      k?: number;
      mass?: number;
      displacement?: number;
      naturalLength?: number;
      orientation?: 'horizontal' | 'vertical';
      notes?: string;
    }
  | {
      action: 'showRayDiagram';
      title?: string;
      type: 'converging' | 'diverging' | 'concave-mirror' | 'convex-mirror';
      focalLength: number;
      objectDistance: number;
      objectHeight?: number;
      showLabels?: boolean;
      notes?: string;
    }
  | {
      action: 'showWave';
      title?: string;
      wave: { amplitude: number; wavelength: number; phase?: number; color?: string; label?: string };
      secondary?: { amplitude: number; wavelength: number; phase?: number; color?: string; label?: string };
      showSuperposition?: boolean;
      frequency?: number;
      showAnnotations?: boolean;
      xLabel?: string;
      notes?: string;
    }
  | {
      action: 'showVector';
      title?: string;
      vectors: Array<{ magnitude: number; direction: number; label?: string; color?: string }>;
      layout?: 'from-origin' | 'tip-to-tail';
      showResultant?: boolean;
      resultantLabel?: string;
      showComponents?: boolean;
      showAxes?: boolean;
      notes?: string;
    }
  | {
      action: 'showOrbitalDiagram';
      title?: string;
      element?: string;
      configuration?: Array<{ subshell: string; electrons: number }>;
      condensed?: boolean;
      notes?: string;
    }
  | {
      action: 'showPedigree';
      title?: string;
      individuals: Array<{ id: string; sex: 'male' | 'female' | 'unknown'; status?: 'unaffected' | 'affected' | 'carrier' | 'deceased'; label?: string; generation: number; position: number }>;
      marriages?: Array<{ pair: [string, string]; consanguineous?: boolean }>;
      children?: Array<{ parents: [string, string]; childId: string }>;
      legend?: Array<'unaffected' | 'affected' | 'carrier' | 'deceased'>;
      notes?: string;
    }
  | {
      action: 'showCellDiagram';
      title?: string;
      type: 'animal' | 'plant';
      highlight?: Array<{ organelle: string; note?: string; color?: string }>;
      notes?: string;
    }
  | {
      action: 'showDna';
      title?: string;
      mode?: 'helix' | 'base-pairs';
      sequence?: string;
      complement?: string;
      mrna?: string;
      rungs?: number;
      notes?: string;
    }
  | {
      action: 'showFoodWeb';
      title?: string;
      species: Array<{ id: string; label: string; level: number; color?: string; icon?: string }>;
      edges: Array<{ from: string; to: string }>;
      showLevelLabels?: boolean;
      notes?: string;
    };

// =============================================================================
// STUDENT PROGRESS
// =============================================================================

export interface ConceptMastery {
  conceptId: string;
  level: 0 | 1 | 2 | 3 | 4;
  // 0 = not assessed
  // 1 = recognition (can identify concept)
  // 2 = comprehension (can explain it)
  // 3 = application (can use in problems)
  // 4 = mastery (can teach it, handle edge cases)
  lastAssessed: Date;
  problemsCorrect: number;
  problemsAttempted: number;
  evidenceNotes?: string[];
}

export interface StudentModuleProgress {
  moduleId: string;
  conceptMastery: Record<string, ConceptMastery>;
  identifiedMisconceptions: string[];
  correctedMisconceptions: string[];
  problemsAttempted: number;
  problemsCorrect: number;
  averageHintsUsed: number;
  totalTimeSpent: number; // seconds
  sessionsCompleted: number;
  lastSessionAt: Date;
}
