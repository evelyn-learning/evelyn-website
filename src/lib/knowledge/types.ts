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
  fn: string; // e.g., "2*t + 5" or "-4.9*t^2 + 20*t"
  color?: string;
  label?: string;
  domain?: [number, number];
}

export interface GraphFunctionOfY {
  fn: string; // x as function of y, e.g., "y**3" or "3*y - 2"
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
  label?: string;
  color?: string;
}

export interface GeometrySegment {
  from: string;
  to: string;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  label?: string;
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
  | { action: 'showGeometry'; title?: string; points: GeometryPoint[]; segments?: GeometrySegment[]; polygons?: GeometryPolygon[]; circles?: GeometryCircle[]; arcs?: GeometryArc[]; angles?: GeometryAngle[]; showGrid?: boolean; showAxes?: boolean; viewRange?: { x: [number, number]; y: [number, number] } }
  | { action: 'showUnitCircle'; title?: string; highlightAngles?: UnitCircleHighlight[]; showAllStandard?: boolean; showRadians?: boolean; showDegrees?: boolean; showArc?: { from: number; to: number; color?: string; label?: string } }
  | { action: 'showFractionBar'; title?: string; items: Array<{ numerator: number; denominator: number; label?: string; highlightColor?: string; style?: 'bar' | 'circle' | 'grid' }>; layout?: 'vertical' | 'horizontal'; showComparison?: boolean }
  | { action: 'showTree'; title?: string; type?: 'probability' | 'factor' | 'decision' | 'generic'; root: TreeNode; showLeafProbabilities?: boolean; direction?: 'top-down' | 'left-right' }
  | { action: 'showVennDiagram'; title?: string; sets: Array<{ label: string; color?: string }>; regions: Record<string, VennRegion>; universalLabel?: string }
  | { action: 'showMatrix'; title?: string; rows: string[][]; brackets?: 'square' | 'round' | 'pipes' | 'double-pipes'; augmented?: number; rowLabels?: string[]; colLabels?: string[]; rowOperations?: Array<{ description: string; targetRow: number }>; resultMatrix?: { rows: string[][]; brackets?: 'square' | 'round' | 'pipes' | 'double-pipes' }; operatorSymbol?: string }
  | { action: 'showStats'; title?: string; type: 'histogram' | 'boxplot' | 'dotplot' | 'bar' | 'pie'; data?: number[]; binWidth?: number; xLabel?: string; yLabel?: string; boxplot?: { datasets: BoxPlotData[]; showValues?: boolean }; bar?: { categories: string[]; values: number[]; colors?: string[] }; pie?: { slices: PieSlice[]; showPercentages?: boolean } };

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
