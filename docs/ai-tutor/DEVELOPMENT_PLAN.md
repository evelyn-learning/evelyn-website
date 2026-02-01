# AI Voice Tutor - Development Plan

## Product Vision

A voice-based AI tutor that delivers seamless, low-latency conversations with an interactive whiteboard for visual explanations. **Subject-agnostic core** with pluggable knowledge bases.

**Starting point:** AP Physics 1 Kinematics (to prove the model)
**End goal:** Any subject, topic, and level

---

## Extensibility Architecture

The tutor is built as a **subject-agnostic engine** that loads knowledge modules dynamically.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CORE TUTOR ENGINE                                │
│           (Voice, Whiteboard, Session, Pedagogy)                     │
│                   Subject-agnostic logic                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ Loads at session start
┌─────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE MODULE INTERFACE                        │
│   interface KnowledgeModule {                                        │
│     subject: string;         // "physics", "math", "chemistry"      │
│     topic: string;           // "kinematics", "algebra", "bonding"  │
│     level: string;           // "AP", "SAT", "high-school"          │
│     concepts: Concept[];                                             │
│     equations: Equation[];                                           │
│     misconceptions: Misconception[];                                 │
│     problems: Problem[];                                             │
│     workedExamples: WorkedExample[];                                 │
│     diagramTypes: DiagramConfig[];    // subject-specific visuals   │
│     systemPromptAdditions: string;    // subject-specific behavior  │
│   }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ Implementations
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌─────────────┐
│   Physics     │ │   Math        │ │  Chemistry    │ │   Future    │
│  Kinematics   │ │  Algebra      │ │   Bonding     │ │   Topics    │
│     (AP)      │ │   (SAT)       │ │    (AP)       │ │             │
└───────────────┘ └───────────────┘ └───────────────┘ └─────────────┘
```

### How It Works

1. **Session Initialization:**
```typescript
// When session starts
const session = await startTutoringSession({
  subject: 'physics',
  topic: 'kinematics',
  level: 'AP',
  studentId: '...',
});

// Core engine loads the appropriate knowledge module
const knowledgeModule = await loadKnowledgeModule('physics', 'kinematics', 'AP');

// Injects into system prompt and makes available to AI
```

2. **Adding New Topics:**
```typescript
// To add "AP Chemistry - Atomic Structure":
// 1. Create knowledge module following the interface
// 2. Register it in the module registry
// 3. Done - core engine handles everything else

registerKnowledgeModule({
  subject: 'chemistry',
  topic: 'atomic-structure',
  level: 'AP',
  concepts: [...],
  // ... rest of module
});
```

3. **Shared vs Subject-Specific:**

| Shared (Core Engine) | Subject-Specific (Knowledge Module) |
|---------------------|-------------------------------------|
| Voice pipeline (STT/TTS) | Concept definitions |
| WebSocket handling | Equations/formulas |
| Session management | Misconceptions |
| Whiteboard canvas | Problem bank |
| Pedagogical state machine | Worked examples |
| Hint progression logic | Diagram types |
| Misconception detection framework | Subject-specific prompts |
| Progress tracking | Assessment criteria |

### Directory Structure (Extensible)

```
/src/lib/
├── tutor/                          # CORE ENGINE (subject-agnostic)
│   ├── engine/
│   │   ├── TutorEngine.ts          # Main orchestrator
│   │   ├── SessionManager.ts
│   │   └── StateManager.ts
│   ├── voice/
│   │   ├── stt.ts                  # Deepgram integration
│   │   ├── tts.ts                  # Cartesia integration
│   │   └── VoiceController.ts
│   ├── whiteboard/
│   │   ├── WhiteboardController.ts
│   │   ├── renderers/              # Shared rendering logic
│   │   │   ├── GraphRenderer.ts
│   │   │   ├── EquationRenderer.ts
│   │   │   └── DiagramRenderer.ts  # Dispatches to subject-specific
│   │   └── types.ts
│   ├── pedagogy/
│   │   ├── SocraticEngine.ts       # Question generation
│   │   ├── HintSystem.ts           # Progressive hints
│   │   ├── MisconceptionDetector.ts
│   │   └── AssessmentTracker.ts
│   └── ai/
│       ├── SystemPromptBuilder.ts  # Combines base + subject-specific
│       ├── ResponseParser.ts       # Extracts whiteboard commands
│       └── ClaudeClient.ts
│
├── knowledge/                       # KNOWLEDGE MODULES (subject-specific)
│   ├── types.ts                     # Shared interfaces (Concept, Problem, etc.)
│   ├── registry.ts                  # Module registration and loading
│   │
│   ├── physics/
│   │   ├── kinematics/
│   │   │   ├── index.ts             # Module entry point
│   │   │   ├── module.ts            # KnowledgeModule implementation
│   │   │   ├── concepts/
│   │   │   ├── equations/
│   │   │   ├── misconceptions/
│   │   │   ├── problems/
│   │   │   ├── diagrams/            # Physics-specific diagrams
│   │   │   └── system-prompt.ts     # Physics-specific AI behavior
│   │   ├── dynamics/                # Future: Forces, Newton's Laws
│   │   ├── energy/                  # Future: Work, Energy, Power
│   │   └── ... (other physics topics)
│   │
│   ├── math/
│   │   ├── algebra/
│   │   ├── geometry/
│   │   ├── calculus/
│   │   └── ...
│   │
│   ├── chemistry/
│   │   ├── atomic-structure/
│   │   ├── bonding/
│   │   └── ...
│   │
│   └── ... (more subjects)
```

### Level Abstraction

Levels modify difficulty and scope within a topic:

```typescript
interface LevelConfig {
  id: string;                    // 'AP', 'SAT', 'high-school', 'middle-school'
  name: string;
  description: string;

  // Difficulty scaling
  maxProblemDifficulty: 1 | 2 | 3 | 4 | 5;
  includesDerivations: boolean;
  mathLevel: 'arithmetic' | 'algebra' | 'trig' | 'calculus';

  // Content scope
  conceptDepth: 'surface' | 'moderate' | 'deep';

  // Assessment alignment
  assessmentStyle: string;       // 'AP Exam', 'SAT', 'State Standards'
  typicalQuestionFormats: string[];
}

// Same topic, different levels
const kinematicsAP: KnowledgeModule = {
  subject: 'physics',
  topic: 'kinematics',
  level: 'AP',
  // Includes calculus-based derivations, harder problems
  ...
};

const kinematicsHighSchool: KnowledgeModule = {
  subject: 'physics',
  topic: 'kinematics',
  level: 'high-school',
  // Algebra-only, conceptual focus, simpler problems
  ...
};
```

### Adding a New Subject: Checklist

To add a completely new subject (e.g., "History - AP US History"):

- [ ] Create directory: `/src/lib/knowledge/history/us-history/`
- [ ] Implement `KnowledgeModule` interface in `module.ts`
- [ ] Define concepts specific to the subject
- [ ] Create problem/question bank
- [ ] Define subject-specific "misconceptions" (historical misunderstandings)
- [ ] Create diagram types if applicable (timelines, maps)
- [ ] Write subject-specific system prompt additions
- [ ] Register module in `/src/lib/knowledge/registry.ts`
- [ ] Add any new whiteboard diagram components needed
- [ ] Test with real students

### Whiteboard Extensibility

The whiteboard has a **plugin system** for subject-specific visuals:

```typescript
// Core whiteboard supports these universally:
type CoreDiagramType = 'graph' | 'equation' | 'table' | 'text-annotation';

// Subjects register their own diagram types:
interface DiagramPlugin {
  type: string;                          // 'projectile-motion', 'circuit', 'molecule'
  component: React.ComponentType<any>;   // React component to render it
  configSchema: ZodSchema;               // Validation for params
}

// Physics registers:
registerDiagramPlugin({
  type: 'projectile-motion',
  component: ProjectileMotionDiagram,
  configSchema: projectileMotionSchema,
});

// Chemistry might register:
registerDiagramPlugin({
  type: 'molecular-structure',
  component: MolecularStructureDiagram,
  configSchema: molecularStructureSchema,
});
```

---

## Scope (MVP)

| In Scope | Out of Scope (for now) |
|----------|------------------------|
| Voice conversation (STT + TTS) | Avatar/animation |
| Interactive whiteboard | Video |
| AP Physics 1 Kinematics only | Other subjects/topics |
| 30-minute sessions | Unlimited sessions |
| Practice problems (books/homework/AI-generated) | Formal assessments |
| Concept explanation with multiple approaches | Progress dashboards |
| Examples and worked solutions | Parent/teacher reports |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Student Interface                            │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐ │
│  │   Voice Controls        │  │   Interactive Whiteboard     │ │
│  │   (Mic + Speaker)       │  │   (Graphs/Diagrams/Equations)│ │
│  └─────────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↕ WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                    Real-Time Voice Pipeline                      │
│  ┌───────────┐    ┌───────────┐    ┌───────────────────────┐   │
│  │ Deepgram  │───►│  Claude   │───►│  Cartesia/ElevenLabs  │   │
│  │   STT     │    │  Sonnet   │    │        TTS            │   │
│  │ (streaming)│    │           │    │    (streaming)        │   │
│  └───────────┘    └───────────┘    └───────────────────────┘   │
│        ↑                │                     │                 │
│        │                ▼                     ▼                 │
│   Student Audio    Whiteboard Commands    Tutor Audio           │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      Knowledge Layer                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Kinematics Knowledge Base                       ││
│  │  Concepts │ Equations │ Misconceptions │ Problems │ Diagrams ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer (MongoDB)                          │
│        Sessions │ Transcripts │ Problem Bank │ Progress          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Decisions

### Voice Pipeline (Optimized for <1s Latency)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **STT** | Deepgram Nova-2 | Streaming, 300ms latency, excellent accuracy |
| **LLM** | Claude claude-sonnet-4-20250514 | Already integrated, fast, great reasoning |
| **TTS** | Cartesia Sonic | 100ms latency, streaming, natural voice |
| **Transport** | WebSocket (Socket.io) | Real-time bidirectional, works with Next.js |

**Latency Budget:**
```
Student stops speaking     →  0ms
Voice Activity Detection   →  +200ms (detect end of speech)
STT processing            →  +300ms (streaming, final transcript)
Claude response           →  +500ms (first token)
TTS streaming             →  +100ms (first audio chunk)
─────────────────────────────────────
Total time to first audio →  ~1.1 seconds
```

### Whiteboard

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Canvas** | tldraw or Excalidraw | Open source, React-native, AI can control |
| **Graphs** | Mafs | Beautiful math graphs, React components |
| **Equations** | KaTeX | Fast LaTeX rendering |
| **Diagrams** | Custom SVG components | Optimized for physics (vectors, projectiles) |

### Backend

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Framework** | Next.js API Routes + Socket.io | Consistent with existing stack |
| **Database** | MongoDB (existing) | Session storage, problem bank |
| **State** | Zustand | Lightweight, works with React |

---

## Whiteboard Specification

### AI-Controllable Actions

The tutor AI will output structured commands to control the whiteboard:

```typescript
type WhiteboardCommand =
  | { action: 'clear' }
  | { action: 'showEquation'; latex: string; label?: string }
  | { action: 'showGraph'; type: GraphType; data: GraphData }
  | { action: 'showDiagram'; type: DiagramType; params: DiagramParams }
  | { action: 'drawVector'; from: Point; to: Point; label?: string; color?: string }
  | { action: 'annotate'; text: string; position: Point }
  | { action: 'highlight'; elementId: string }
  | { action: 'showProblem'; problem: Problem }
  | { action: 'showSolution'; steps: SolutionStep[] }
  | { action: 'showWorkedExample'; example: WorkedExample };

type GraphType =
  | 'position-time'
  | 'velocity-time'
  | 'acceleration-time';

type DiagramType =
  | 'projectile-motion'
  | 'free-fall'
  | 'vector-addition'
  | 'reference-frame'
  | 'free-body-simple';  // for context

interface GraphData {
  title?: string;
  xLabel: string;
  yLabel: string;
  xRange: [number, number];
  yRange: [number, number];
  functions?: Array<{
    fn: string;  // e.g., "2*t + 5" or "0.5*9.8*t^2"
    color?: string;
    label?: string;
  }>;
  points?: Array<{
    x: number;
    y: number;
    label?: string;
  }>;
  annotations?: Array<{
    type: 'slope' | 'area' | 'tangent';
    at: number;
    label?: string;
  }>;
}

interface SolutionStep {
  explanation: string;  // spoken/shown text
  equation?: string;    // LaTeX
  substitution?: string; // LaTeX with numbers plugged in
  result?: string;      // LaTeX result
  diagram?: DiagramType;
}
```

### Pre-built Diagram Components

1. **Projectile Motion**
   - Trajectory arc with velocity vectors
   - Decomposed Vx and Vy
   - Height and range markers
   - Configurable: initial velocity, angle, height

2. **Free Fall**
   - Object at various positions
   - Velocity vectors growing
   - Time markers
   - Configurable: initial height, initial velocity

3. **Vector Addition**
   - Multiple vectors
   - Resultant with parallelogram/triangle method
   - Component breakdown
   - Configurable: any set of vectors

4. **Position-Time / Velocity-Time / Acceleration-Time Graphs**
   - Interactive with Mafs
   - Show relationships (derivative/integral)
   - Highlight slope = velocity, area = displacement

5. **Reference Frames**
   - Two coordinate systems
   - Object positions in each
   - Relative velocity visualization

---

## Knowledge Base Design

### Core Types (Subject-Agnostic)

These interfaces work for ANY subject - physics, math, history, languages:

```typescript
// /src/lib/knowledge/types.ts

/**
 * A Knowledge Module represents everything the tutor needs
 * to teach one topic at one level.
 */
interface KnowledgeModule {
  // Identity
  id: string;                    // 'physics-kinematics-ap'
  subject: Subject;
  topic: string;
  level: Level;
  version: string;               // For updates

  // Display
  displayName: string;           // "AP Physics 1: Kinematics"
  description: string;
  estimatedHours: number;        // How long to master

  // Content
  concepts: Concept[];
  problems: Problem[];
  workedExamples: WorkedExample[];

  // Subject-specific
  equations?: Equation[];        // For math/science
  vocabulary?: VocabTerm[];      // For languages/history
  misconceptions: Misconception[];
  realWorldConnections: RealWorldExample[];

  // Visuals
  diagramTypes: string[];        // What diagrams this topic can use
  defaultDiagrams?: DiagramConfig[];

  // AI Behavior
  systemPromptAdditions: string; // Topic-specific instructions

  // Prerequisites
  prerequisites: string[];       // Module IDs that should come first

  // Assessment
  masteryThreshold: number;      // 0-100, when is topic "mastered"?
}

type Subject = 'physics' | 'math' | 'chemistry' | 'biology' |
               'history' | 'english' | 'languages' | 'economics';

type Level = 'middle-school' | 'high-school' | 'AP' | 'SAT' |
             'ACT' | 'college-intro' | 'college-advanced';
```

### Concept Schema (Universal)

Works for "velocity" in physics OR "manifest destiny" in history:

```typescript
interface Concept {
  id: string;
  name: string;
  category: 'foundational' | 'core' | 'advanced';

  // Prerequisites within this module
  prerequisiteConcepts: string[];

  // Core content
  definition: {
    formal: string;           // Textbook/formal definition
    intuitive: string;        // Plain language
    forVoice: string;         // Conversational (optimized for speech)
  };

  keyPoints: string[];

  // Multiple explanation strategies
  explanations: Explanation[];

  // Connect to real world
  realWorldExamples: RealWorldExample[];

  // What students get wrong
  commonErrors: CommonError[];

  // Assessment
  checkQuestions: string[];      // Quick verbal checks
  masteryIndicators: string[];   // Signs they understand
}

interface Explanation {
  id: string;
  approach: string;              // 'visual', 'verbal', 'analogy', 'step-by-step'
  name: string;
  content: string;               // The explanation (voice-ready)
  bestFor: string;               // When to use this approach
  whiteboard?: WhiteboardCommand[];
}
```

### Problem Schema (Universal)

Works for physics calculations OR reading comprehension questions:

```typescript
interface Problem {
  id: string;
  type: ProblemType;
  concepts: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;

  // The problem
  statement: string;
  context?: string;
  stimulus?: Stimulus;           // For reading passages, images, etc.

  // For quantitative problems
  givenValues?: GivenValue[];
  unknowns?: Unknown[];

  // Solution
  solution: Solution;
  hints: Hint[];

  // Metadata
  source?: string;
  estimatedMinutes: number;
  tags: string[];
}

type ProblemType =
  | 'calculation'               // Solve for X
  | 'conceptual'                // Explain why
  | 'graphical'                 // Interpret/create graph
  | 'multi-step'                // Complex problem
  | 'multiple-choice'           // Select answer
  | 'free-response'             // Open ended
  | 'analysis';                 // Analyze given information

interface Stimulus {
  type: 'text' | 'image' | 'graph' | 'table' | 'diagram';
  content: string;               // Text or URL
  description?: string;          // For accessibility
}

interface Solution {
  approach: string;              // Strategy description
  steps: SolutionStep[];
  finalAnswer: Answer;
  alternativeApproaches?: AlternativeApproach[];
}
```

### Module Structure

```
/src/lib/knowledge/
├── types.ts                     # Universal interfaces (above)
├── registry.ts                  # Module registration
├── loader.ts                    # Dynamic module loading
│
├── physics/
│   ├── kinematics/
│   │   ├── index.ts             # Exports the module
│   │   ├── module.ts            # KnowledgeModule implementation
│   │   ├── concepts/
│   │   │   ├── position-displacement.ts
│   │   │   ├── velocity-speed.ts
│   │   │   └── ...
│   │   ├── problems/
│   │   │   ├── bank.ts          # Curated problems
│   │   │   └── generator.ts     # AI generation prompts
│   │   ├── misconceptions.ts
│   │   ├── worked-examples.ts
│   │   ├── diagrams.ts          # Diagram configurations
│   │   └── prompt-additions.ts  # Topic-specific AI behavior
│   │
│   ├── dynamics/                # Future
│   └── energy/                  # Future
│
├── math/
│   ├── algebra/                 # Future
│   └── geometry/                # Future
│
└── _template/                   # Template for new modules
    ├── index.ts
    ├── module.ts
    └── README.md                # How to create a module
```

### Concept Schema

```typescript
interface Concept {
  id: string;
  name: string;
  category: 'foundational' | 'core' | 'advanced';

  // Prerequisites (must understand these first)
  prerequisites: string[];  // concept IDs

  // Core content
  definition: {
    formal: string;      // Textbook definition
    intuitive: string;   // Plain English
    forStudent: string;  // How tutor should explain verbally
  };

  // Key points student must understand
  keyPoints: string[];

  // Multiple explanation approaches
  explanations: {
    approach: string;    // e.g., "graphical", "algebraic", "intuitive"
    explanation: string;
    bestFor: string;     // When to use this approach
    whiteboard?: WhiteboardCommand[];  // Visual aids
  }[];

  // Real-world connections
  realWorldExamples: {
    scenario: string;    // e.g., "Car braking at a red light"
    connection: string;  // How it relates to concept
    numbers?: {          // Concrete values for calculation
      [key: string]: number;
    };
  }[];

  // Common mistakes
  commonErrors: {
    error: string;
    why: string;         // Why students make this error
    correction: string;  // How to address it
  }[];

  // Practice progression
  practiceProgression: {
    level: 'recognition' | 'application' | 'analysis' | 'synthesis';
    description: string;
    exampleProblem: string;
  }[];

  // Assessment
  masteryIndicators: string[];  // Signs student understands
  checkQuestions: string[];     // Quick verbal checks
}
```

### Misconception Schema

```typescript
interface Misconception {
  id: string;
  name: string;                    // e.g., "Velocity equals speed"
  relatedConcepts: string[];       // concept IDs

  // Detection
  description: string;             // What the misconception is
  detectPatterns: {
    verbal: string[];              // Phrases that indicate this
    problemSolving: string[];      // Errors in work that indicate this
    graphical: string[];           // Graph interpretation errors
  };

  // Correction strategy
  correction: {
    // Step 1: Acknowledge their thinking
    acknowledge: string;

    // Step 2: Create cognitive conflict
    conflictQuestion: string;      // Question that reveals the issue
    conflictExample: string;       // Concrete counterexample

    // Step 3: Build correct understanding
    correctExplanation: string;
    whiteboard?: WhiteboardCommand[];

    // Step 4: Verify correction
    verificationQuestion: string;
  };

  // Why this misconception forms
  origin: string;

  // How persistent (affects how often to re-check)
  persistence: 'low' | 'medium' | 'high';
}
```

### Problem Schema

```typescript
interface Problem {
  id: string;
  source: 'curated' | 'ai-generated' | 'student-provided';
  sourceReference?: string;        // Book, page, problem number

  // Classification
  concepts: string[];              // concept IDs tested
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: 'conceptual' | 'calculation' | 'graphical' | 'multi-step';

  // Problem content
  statement: string;
  givenValues: {
    symbol: string;
    value: number;
    unit: string;
  }[];
  unknowns: string[];              // What to find
  diagram?: DiagramType;
  diagramParams?: Record<string, any>;

  // Solution
  solution: {
    approach: string;              // Strategy description
    steps: SolutionStep[];
    answer: {
      value: number;
      unit: string;
      significantFigures?: number;
    };
    alternativeApproaches?: string[];
  };

  // Hints (progressive)
  hints: {
    level: 1 | 2 | 3;              // Increasingly specific
    hint: string;
    whiteboard?: WhiteboardCommand;
  }[];

  // Common errors on this specific problem
  commonErrors: {
    error: string;
    howToDetect: string;
    feedback: string;
  }[];

  // Follow-up
  variations: string[];            // Problem IDs of similar problems
  relatedConcepts: string[];       // For deeper exploration
}
```

### Curated Content Requirements

**Minimum content for MVP:**

| Category | Quantity | Notes |
|----------|----------|-------|
| Concepts | 7 (full coverage) | All kinematics topics |
| Equations | 5 (kinematic) + supporting | With derivations |
| Misconceptions | 15-20 | Most common ones |
| Curated Problems | 50 | 10 per difficulty level |
| Worked Examples | 15 | 2-3 per concept |
| Real-world Analogies | 20 | Sports, vehicles, everyday |
| Explanation Approaches | 3 per concept | Minimum alternatives |

---

## AI Tutor System Prompt

```typescript
const TUTOR_SYSTEM_PROMPT = `You are an expert AP Physics 1 tutor specializing in Kinematics. You conduct voice conversations with students to help them practice, understand concepts, and solve problems.

## Your Personality
- Warm, patient, encouraging but not over-the-top
- Curious about how the student thinks
- Genuinely excited about physics
- Speaks naturally, conversationally (this is voice, not text)

## Core Teaching Principles

### 1. Socratic Method First
- Ask guiding questions instead of giving answers
- Help students discover solutions themselves
- Only explain directly when they're truly stuck after 2-3 attempts

### 2. Diagnose Before Teaching
- When a student struggles, figure out WHY
- Is it a conceptual gap? Misconception? Math error?
- Tailor your help to the actual problem

### 3. Multiple Approaches
- If one explanation doesn't land, try another
- Options: graphical, algebraic, intuitive, analogy-based
- Ask: "Would it help to see this on a graph?" or "Let me try explaining it differently..."

### 4. Make It Concrete
- Use real-world examples: cars, sports, falling objects
- Give specific numbers when helpful
- Draw diagrams on the whiteboard

### 5. Check Understanding
- Don't assume they got it
- Ask them to explain back: "So in your own words, why does that happen?"
- Have them try a similar problem

## Session Flow

1. **Opening** (first 1-2 exchanges)
   - Greet warmly
   - Ask what they want to work on today
   - Options: stuck on homework, want to practice, need concept review

2. **Assessment** (next 2-3 exchanges)
   - If homework: have them read the problem, ask what they've tried
   - If practice: gauge their comfort level, start appropriately
   - If concept: ask what they already know about it

3. **Working Phase** (bulk of session)
   - Guide through problems using Socratic questioning
   - Use whiteboard liberally for visuals
   - Celebrate small wins: "Exactly right!" "Good thinking!"
   - If stuck: provide hints progressively, not answers immediately

4. **Wrap-up** (last 2-3 min)
   - Summarize what we covered
   - Highlight what they did well
   - Suggest what to practice next

## Voice-Specific Guidelines

- Keep responses SHORT: 1-3 sentences typically
- Use natural speech: contractions, casual phrasing
- Avoid jargon dumps; introduce terms gradually
- Signal visual actions: "Let me show you on the whiteboard..."
- Pause naturally: "So... what do you think happens next?"
- Don't list things verbally; show lists on whiteboard instead

## Whiteboard Usage

You can control the whiteboard by including commands in your response. Format:

\`\`\`whiteboard
{ "action": "showGraph", "type": "velocity-time", "data": {...} }
\`\`\`

Use the whiteboard for:
- Showing equations (always when doing calculations)
- Graphs (position-time, velocity-time, acceleration-time)
- Diagrams (projectile paths, vectors, free-body diagrams)
- Problem statements and given values
- Step-by-step solutions
- Worked examples

Never describe a diagram in words when you can show it.

## Problem-Solving Guidance

When student is solving a problem:

1. First, make sure they understand what's being asked
   - "What are we trying to find here?"
   - "What information do we have?"

2. Guide toward strategy selection
   - "Which kinematic equation might help here?"
   - "What do we know about the acceleration in this case?"

3. Let them do the math
   - Don't calculate for them unless demonstrating
   - If they get stuck on algebra, point to the issue

4. Verify the answer makes sense
   - "Does that number seem reasonable?"
   - "What would happen if [edge case]?"

## Handling Misconceptions

When you detect a misconception:

1. DON'T say "That's wrong" or "No"
2. Instead: "Interesting thought. Let me ask you something..."
3. Create conflict: "What would happen if [counterexample]?"
4. Guide to correct understanding
5. Verify: "So now, how would you explain..."

## Content Boundaries

- Stay focused on AP Physics 1 Kinematics
- If asked about other topics: "Great question! That's actually [topic], which we can explore another time. For now, let's stay focused on kinematics."
- If asked non-physics questions: Redirect kindly

## Current Session Context
Student: {{studentName}}
Session Goal: {{sessionGoal}}
Time Remaining: {{timeRemaining}}
Previous Topics: {{previousTopics}}
Known Misconceptions: {{knownMisconceptions}}
`;
```

---

## Data Models

```typescript
// MongoDB Collections

// 1. Tutoring Sessions
interface TutoringSession {
  _id: ObjectId;

  // Session metadata
  studentId: string;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds: number;
  status: 'active' | 'completed' | 'abandoned';

  // Content
  subject: 'physics';
  topic: 'kinematics';
  level: 'AP';

  // Student's initial goal
  sessionGoal?: string;  // "homework help", "practice", "concept review"
  specificTopic?: string;  // "projectile motion", etc.

  // Conversation
  transcript: TranscriptEntry[];

  // Learning data
  problemsAttempted: {
    problemId: string;
    startedAt: Date;
    completedAt?: Date;
    hintsUsed: number;
    correct: boolean;
    studentWork?: string;  // their verbal explanation
  }[];

  conceptsTouched: string[];
  misconceptionsDetected: string[];
  misconceptionsAddressed: string[];

  // Metrics
  metrics: {
    studentSpeakingTime: number;   // seconds
    tutorSpeakingTime: number;
    questionsAskedByTutor: number;
    hintsGiven: number;
    diagramsShown: number;
    problemsCompleted: number;
  };
}

interface TranscriptEntry {
  timestamp: Date;
  role: 'student' | 'tutor';

  // Content
  text: string;
  audioUrl?: string;  // stored recording

  // For tutor messages
  whiteboardCommands?: WhiteboardCommand[];
  pedagogicalIntent?: 'greeting' | 'question' | 'hint' | 'explanation' |
                      'encouragement' | 'correction' | 'summary';

  // For student messages
  sttConfidence?: number;
  detectedIntent?: 'answer' | 'question' | 'confusion' | 'agreement';
}

// 2. Problem Bank (in addition to hardcoded knowledge base)
interface StoredProblem {
  _id: ObjectId;

  // Same as Problem schema above
  // ...

  // Usage tracking
  timesUsed: number;
  successRate: number;
  averageHints: number;

  // Source tracking
  createdAt: Date;
  createdBy: 'system' | 'ai' | 'admin';
}

// 3. Student Profiles (for returning students)
interface StudentProfile {
  _id: ObjectId;

  // Identity
  studentId: string;
  name?: string;

  // Kinematics progress
  progress: {
    conceptMastery: {
      [conceptId: string]: {
        level: 0 | 1 | 2 | 3 | 4;  // 0=unknown, 4=mastered
        lastAssessed: Date;
        problemsCorrect: number;
        problemsAttempted: number;
      };
    };

    persistentMisconceptions: string[];  // misconception IDs

    problemsCompleted: number;
    totalSessionTime: number;  // seconds
    sessionsCompleted: number;
  };

  // Preferences (learned over time)
  preferences: {
    pace: 'slow' | 'medium' | 'fast';
    preferredExamples: string[];  // "sports", "cars", etc.
    needsMoreEncouragement: boolean;
  };

  // History
  lastSessionAt: Date;
  sessionHistory: ObjectId[];  // session IDs
}
```

---

## API Endpoints

```typescript
// WebSocket Events (Socket.io)

// Client → Server
interface ClientEvents {
  // Session management
  'session:start': { studentId?: string; goal?: string };
  'session:end': {};

  // Voice
  'audio:chunk': { data: ArrayBuffer; isFinal: boolean };
  'audio:cancel': {};  // interrupt current playback

  // Whiteboard
  'whiteboard:studentDraw': { strokes: Stroke[] };

  // Problems
  'problem:submit': { problemId: string; answer: string };
  'problem:requestHint': { problemId: string };
  'problem:skip': { problemId: string };
}

// Server → Client
interface ServerEvents {
  // Session
  'session:started': { sessionId: string };
  'session:ended': { summary: SessionSummary };

  // Voice
  'transcript:partial': { text: string };           // streaming STT
  'transcript:final': { text: string };             // final STT
  'audio:chunk': { data: ArrayBuffer };             // streaming TTS
  'audio:end': {};

  // Tutor response
  'tutor:thinking': {};                             // show thinking indicator
  'tutor:message': { text: string; whiteboard?: WhiteboardCommand[] };

  // Whiteboard
  'whiteboard:command': { command: WhiteboardCommand };
  'whiteboard:clear': {};

  // Problems
  'problem:show': { problem: Problem };
  'problem:feedback': { correct: boolean; feedback: string };
  'problem:hint': { hint: string; whiteboard?: WhiteboardCommand };
}

// REST Endpoints

// Session management
POST   /api/tutor/session/start
POST   /api/tutor/session/end
GET    /api/tutor/session/:id

// Problems
GET    /api/tutor/problems?concept=X&difficulty=Y
POST   /api/tutor/problems/generate  // AI generation

// Student
GET    /api/tutor/student/:id/progress
```

---

## Development Phases

### Phase 1: Core Engine Foundation (Week 1-2)

**Goal:** Subject-agnostic voice + whiteboard engine working

- [ ] Set up WebSocket infrastructure (Socket.io)
- [ ] Integrate Deepgram STT (streaming)
- [ ] Integrate Cartesia TTS (streaming)
- [ ] Create voice UI component with controls
- [ ] Claude integration with streaming
- [ ] Session management (start, end, persist)
- [ ] **Knowledge module loader** (loads module based on subject/topic/level)
- [ ] **System prompt builder** (combines base + module-specific)
- [ ] End-to-end voice conversation

**Deliverable:** Core engine that can load any module and converse

### Phase 2: Whiteboard Engine (Week 2-3)

**Goal:** Extensible whiteboard with plugin architecture

- [ ] Set up tldraw/Excalidraw as base canvas
- [ ] Implement **diagram plugin system** for subject-specific visuals
- [ ] Build core renderers:
  - [ ] Graph renderer (Mafs-based, works for any x-y data)
  - [ ] Equation renderer (KaTeX)
  - [ ] Table renderer
  - [ ] Annotation/highlight system
- [ ] Create whiteboard command parser (AI output → actions)
- [ ] Build command dispatch system

**Deliverable:** Whiteboard engine that any module can extend

### Phase 3: Pedagogy Engine (Week 3-4)

**Goal:** Reusable tutoring intelligence

- [ ] Implement session state machine (greeting → assess → teach → wrap-up)
- [ ] Build **Socratic question generator** (uses concept data)
- [ ] Implement **hint progression system** (level 1 → 2 → 3)
- [ ] Build **misconception detector** (matches transcript to patterns)
- [ ] Create **multi-approach selector** (switches explanation style)
- [ ] Implement **mastery tracker** (per-concept progress)
- [ ] Build session summary generator

**Deliverable:** Pedagogy engine that works with any knowledge module

### Phase 4: First Module - Physics Kinematics (Week 4-5)

**Goal:** Prove the system with deep kinematics content

- [ ] Create knowledge module structure for kinematics
- [ ] Write all 7 concept entries (with multiple explanations each)
- [ ] Write 15-20 misconception entries with detection patterns
- [ ] Create 50 curated problems (10 per difficulty level)
- [ ] Write 15 worked examples
- [ ] Create real-world analogy bank (20+ scenarios)
- [ ] Build kinematics-specific diagram components:
  - [ ] Projectile motion
  - [ ] Free fall
  - [ ] Vector addition
  - [ ] x-t / v-t / a-t graph relationships
- [ ] Write physics-specific system prompt additions
- [ ] Register module in registry

**Deliverable:** Fully functional kinematics tutor

### Phase 5: Integration & Testing (Week 5-6)

**Goal:** Polish and validate

- [ ] Latency optimization (<1.5s target)
- [ ] Error handling and graceful recovery
- [ ] Audio quality tuning
- [ ] UI polish and responsiveness
- [ ] **Test with 5-10 real students**
- [ ] Collect feedback, identify gaps
- [ ] Iterate on weak areas
- [ ] Write module creation documentation

**Deliverable:** Production-ready tutor for kinematics

---

## Adding Future Modules (Post-MVP)

Once the core engine is stable, adding new topics follows this pattern:

### Module Creation Workflow

```bash
# 1. Copy template
cp -r src/lib/knowledge/_template src/lib/knowledge/physics/dynamics

# 2. Fill in module.ts with subject matter
# 3. Write concepts (most time-intensive)
# 4. Curate problems from textbooks + generate with AI
# 5. Document misconceptions from teaching experience
# 6. Create any new diagram components needed
# 7. Register in registry.ts
# 8. Test with students
```

### Estimated Effort Per Module

| Component | Hours | Notes |
|-----------|-------|-------|
| Concept writing (7-10 concepts) | 8-12 | Deep expertise needed |
| Problem curation (50 problems) | 6-10 | Can use AI assistance |
| Misconceptions (15-20) | 4-6 | Requires teaching experience |
| Worked examples (15) | 4-6 | Step-by-step walkthroughs |
| Diagram components | 4-8 | If new visuals needed |
| Testing & iteration | 8-12 | Student testing crucial |
| **Total per module** | **34-54 hours** | ~1-2 weeks |

### Scaling Strategy

1. **Phase 1 (MVP):** Physics Kinematics only
2. **Phase 2:** Complete AP Physics 1 (add Dynamics, Energy, Momentum, Rotation, Waves)
3. **Phase 3:** Expand to SAT Math (Algebra, Geometry, Data Analysis)
4. **Phase 4:** Add AP Chemistry, AP Calculus
5. **Phase 5:** Expand to other standardized tests (ACT, GRE)

### Quality Gates for New Modules

Before a module goes live:
- [ ] All concepts have 3+ explanation approaches
- [ ] 80%+ of common misconceptions documented
- [ ] Minimum 50 curated problems with solutions
- [ ] Tested with 5+ real students
- [ ] Student satisfaction >4.0/5
- [ ] Misconception detection accuracy >70%

---

## File Structure

```
/src/
├── app/
│   ├── tutor/
│   │   ├── page.tsx                    # Landing/selection page
│   │   ├── [subject]/
│   │   │   └── [topic]/
│   │   │       └── page.tsx            # Dynamic tutor session page
│   │   ├── layout.tsx
│   │   └── components/
│   │       ├── VoiceInterface.tsx      # Mic controls, audio playback
│   │       ├── Whiteboard.tsx          # Main whiteboard container
│   │       ├── SessionControls.tsx     # Timer, end session, settings
│   │       ├── TranscriptView.tsx      # Live transcript sidebar
│   │       └── TopicSelector.tsx       # Subject/topic/level picker
│   └── api/
│       └── tutor/
│           ├── socket/
│           │   └── route.ts            # WebSocket handler
│           ├── session/
│           │   ├── route.ts            # Start/end session
│           │   └── [id]/route.ts       # Get session details
│           ├── modules/
│           │   └── route.ts            # List available modules
│           └── problems/
│               ├── route.ts            # Get problems
│               └── generate/route.ts   # AI problem generation
│
├── lib/
│   ├── tutor/                          # === CORE ENGINE (subject-agnostic) ===
│   │   ├── engine/
│   │   │   ├── TutorEngine.ts          # Main orchestrator
│   │   │   ├── ModuleLoader.ts         # Loads knowledge modules
│   │   │   └── types.ts
│   │   ├── voice/
│   │   │   ├── DeepgramSTT.ts          # Speech-to-text
│   │   │   ├── CartesiaTTS.ts          # Text-to-speech
│   │   │   ├── VoiceController.ts      # Coordinates STT+TTS
│   │   │   └── audio-utils.ts
│   │   ├── whiteboard/
│   │   │   ├── WhiteboardController.ts # Manages whiteboard state
│   │   │   ├── CommandDispatcher.ts    # Routes commands to renderers
│   │   │   ├── DiagramRegistry.ts      # Plugin system for diagrams
│   │   │   └── types.ts
│   │   ├── ai/
│   │   │   ├── ClaudeClient.ts         # Claude API wrapper
│   │   │   ├── SystemPromptBuilder.ts  # Combines base + module prompts
│   │   │   ├── ResponseParser.ts       # Extracts whiteboard commands
│   │   │   └── base-prompt.ts          # Core tutor personality
│   │   ├── session/
│   │   │   ├── SessionManager.ts       # Create, persist, resume sessions
│   │   │   ├── StateMachine.ts         # Session flow states
│   │   │   └── TranscriptManager.ts    # Store conversation
│   │   └── pedagogy/
│   │       ├── SocraticEngine.ts       # Generates guiding questions
│   │       ├── HintSystem.ts           # Progressive hint delivery
│   │       ├── MisconceptionDetector.ts # Pattern matching on transcript
│   │       ├── ExplanationSelector.ts  # Picks best explanation approach
│   │       └── MasteryTracker.ts       # Per-concept progress
│   │
│   ├── knowledge/                       # === KNOWLEDGE MODULES ===
│   │   ├── types.ts                     # Shared interfaces
│   │   ├── registry.ts                  # Module registration
│   │   ├── loader.ts                    # Dynamic loading
│   │   │
│   │   ├── physics/
│   │   │   ├── kinematics/              # First module (MVP)
│   │   │   │   ├── index.ts
│   │   │   │   ├── module.ts            # KnowledgeModule implementation
│   │   │   │   ├── concepts/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── position-displacement.ts
│   │   │   │   │   ├── velocity-speed.ts
│   │   │   │   │   ├── acceleration.ts
│   │   │   │   │   ├── kinematic-equations.ts
│   │   │   │   │   ├── free-fall.ts
│   │   │   │   │   ├── projectile-motion.ts
│   │   │   │   │   └── relative-motion.ts
│   │   │   │   ├── problems/
│   │   │   │   │   ├── bank.ts          # Curated problems
│   │   │   │   │   └── generator.ts     # AI generation config
│   │   │   │   ├── misconceptions.ts
│   │   │   │   ├── worked-examples.ts
│   │   │   │   ├── diagrams.ts
│   │   │   │   └── prompt-additions.ts
│   │   │   │
│   │   │   ├── dynamics/                # Future
│   │   │   └── energy/                  # Future
│   │   │
│   │   ├── math/                        # Future
│   │   ├── chemistry/                   # Future
│   │   │
│   │   └── _template/                   # Template for new modules
│   │       ├── index.ts
│   │       ├── module.ts
│   │       ├── concepts/
│   │       ├── problems/
│   │       └── README.md
│   │
│   └── models/                          # MongoDB schemas
│       ├── session.ts
│       ├── student.ts
│       └── problem.ts
│
├── components/
│   └── whiteboard/
│       ├── WhiteboardCanvas.tsx         # Main canvas component
│       ├── renderers/                   # Core renderers
│       │   ├── GraphRenderer.tsx        # Mafs-based graphs
│       │   ├── EquationRenderer.tsx     # KaTeX equations
│       │   ├── TableRenderer.tsx
│       │   └── AnnotationRenderer.tsx
│       ├── diagrams/                    # Subject-specific (plugin)
│       │   ├── index.ts                 # Registry
│       │   └── physics/
│       │       ├── ProjectileMotion.tsx
│       │       ├── FreeFall.tsx
│       │       ├── VectorAddition.tsx
│       │       └── KinematicGraphs.tsx
│       └── controls/
│           ├── ZoomControls.tsx
│           └── ClearButton.tsx
│
└── hooks/
    ├── useVoice.ts                      # Voice recording/playback
    ├── useWhiteboard.ts                 # Whiteboard state
    ├── useTutorSession.ts               # Session lifecycle
    └── useKnowledgeModule.ts            # Load current module
```

## Module Template

To create a new module, copy `_template` and fill in:

```typescript
// /src/lib/knowledge/_template/module.ts

import type { KnowledgeModule } from '../types';

export const module: KnowledgeModule = {
  // === IDENTITY ===
  id: 'subject-topic-level',           // e.g., 'physics-kinematics-ap'
  subject: 'physics',
  topic: 'kinematics',
  level: 'AP',
  version: '1.0.0',

  // === DISPLAY ===
  displayName: 'AP Physics 1: Kinematics',
  description: 'Motion in one and two dimensions...',
  estimatedHours: 10,

  // === CONTENT (import from subdirectories) ===
  concepts: [],                         // From ./concepts
  problems: [],                         // From ./problems
  workedExamples: [],
  equations: [],                        // Optional, for math/science
  misconceptions: [],
  realWorldConnections: [],

  // === VISUALS ===
  diagramTypes: [                       // Which diagram plugins to use
    'graph',                            // Built-in
    'equation',                         // Built-in
    'projectile-motion',                // Physics-specific
  ],

  // === AI BEHAVIOR ===
  systemPromptAdditions: `
    You are teaching kinematics. Key points:
    - Always clarify velocity vs speed distinction
    - Use car/sports examples when possible
    - Draw graphs to show relationships between x, v, a
  `,

  // === PREREQUISITES ===
  prerequisites: [],                    // Other module IDs

  // === ASSESSMENT ===
  masteryThreshold: 75,                 // 75% to consider mastered
};
```

---

## Cost Estimate (Per Session)

Assuming 30-minute session:

| Component | Usage | Cost |
|-----------|-------|------|
| Deepgram STT | 30 min | $0.13 |
| Cartesia TTS | ~5000 chars | $0.08 |
| Claude Sonnet | ~15K tokens | $0.15 |
| **Total** | | **~$0.36/session** |

Much cheaper than the avatar version! Can sustain at scale.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Voice latency (end of speech → first audio) | <1.5 seconds |
| Session completion rate | >80% |
| Student satisfaction (post-session) | >4.2/5 |
| Problem success rate (with hints) | >70% |
| Misconception correction rate | >60% |
| Return session rate | >40% |

---

## Decisions Made

| Question | Decision |
|----------|----------|
| **Voice selection** | Let student choose (offer male/female options) |
| **Problem sources** | Curated PDFs + photo upload of homework + AI generated (photo upload from day 1) |
| **Session recording** | Transcripts only (no audio storage) |
| **Module authoring** | In-house |
| **Interruption handling** | Yes - student can interrupt tutor mid-sentence |
| **Offline fallback** | Yes - text fallback when voice APIs fail |
| **Progress carry-over** | Yes - progress carries between levels (high-school → AP) |

---

## Next Steps

1. **Confirm tech stack:**
   - [ ] Sign up for Deepgram API (STT)
   - [ ] Sign up for Cartesia API (TTS) - or ElevenLabs as backup
   - [ ] Evaluate tldraw vs Excalidraw for whiteboard
   - [ ] Confirm Socket.io for WebSocket

2. **Set up development environment:**
   - [ ] Create API keys and add to env
   - [ ] Set up basic project structure
   - [ ] Create placeholder components

3. **Begin Phase 1 (Core Engine):**
   - [ ] Start with voice pipeline (most critical for latency)
   - [ ] Basic WebSocket setup
   - [ ] Simple Claude conversation loop

4. **Parallel: Knowledge base groundwork:**
   - [ ] Define final TypeScript interfaces
   - [ ] Create module template
   - [ ] Start drafting kinematics concept content (can be done by subject expert)

---

## Summary

### What We're Building

A **voice-first AI tutor** with an interactive whiteboard, designed to be:
- **Low-latency:** <1.5s from student speech to tutor response
- **Pedagogically sound:** Socratic method, misconception detection, adaptive explanations
- **Extensible:** Any subject, topic, or level can be added via knowledge modules

### Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| No avatar (for now) | Voice + whiteboard only | Focus on tutoring quality, add visual later |
| Subject-agnostic core | Pluggable knowledge modules | Build once, extend forever |
| Claude for AI | claude-sonnet-4-20250514 | Fast, great reasoning, already integrated |
| Streaming everything | STT, TTS, LLM all streaming | Minimizes perceived latency |
| Whiteboard plugins | Diagram components per subject | Physics diagrams ≠ chemistry diagrams |

### MVP Scope

- **1 subject:** Physics
- **1 topic:** Kinematics
- **1 level:** AP
- **Session length:** 30 minutes
- **Features:** Voice conversation, whiteboard, practice problems, concept explanations

### Success Criteria

| Metric | Target |
|--------|--------|
| End-to-end latency | <1.5 seconds |
| Session completion | >80% |
| Student satisfaction | >4.2/5 |
| Would use again | >75% |

### Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Core Engine | 2 weeks | Voice + whiteboard working |
| Whiteboard Engine | 1 week | Extensible diagram system |
| Pedagogy Engine | 1 week | Tutoring intelligence |
| Kinematics Module | 1-2 weeks | First complete module |
| Testing & Polish | 1 week | Production ready |
| **Total** | **6-8 weeks** | MVP launch |

---

## Appendix: Example Session Flow

```
[Session Start]
TUTOR: Hey! Welcome to our kinematics session. What would you like to
       work on today - do you have a specific problem you're stuck on,
       or would you like to practice something?

STUDENT: I have this homework problem I don't understand.

TUTOR: Sure, go ahead and read it to me.

STUDENT: A ball is thrown upward with an initial velocity of 20 meters
         per second. How high does it go?

TUTOR: Okay, good problem. Let me put that on the board.
       [WHITEBOARD: Shows problem statement and given values]
       So we know v₀ = 20 m/s upward. What are we trying to find?

STUDENT: The maximum height.

TUTOR: Right. And here's a key question - at the very top of its path,
       at maximum height, what's the ball's velocity at that instant?

STUDENT: Um... zero?

TUTOR: Exactly! Why is it zero at the top?

STUDENT: Because it stops before coming back down?

TUTOR: Perfect intuition. It's momentarily at rest before reversing.
       So now we know v = 0 at the top. What about acceleration -
       what's pulling on the ball the whole time?

STUDENT: Gravity... so 9.8?

TUTOR: Right, and which direction?

STUDENT: Down... so negative?

TUTOR: Exactly. a = -9.8 m/s². Now, we have v₀, v, and a.
       [WHITEBOARD: Shows v₀ = 20 m/s, v = 0, a = -9.8 m/s²]
       Which kinematic equation relates these to displacement?

STUDENT: The one with v squared?

TUTOR: Yes! Let me show it.
       [WHITEBOARD: Shows v² = v₀² + 2aΔx]
       Can you plug in our values?

STUDENT: 0 equals 20 squared plus 2 times negative 9.8 times delta x?

TUTOR: Perfect setup. Solve for Δx.

STUDENT: So... 400 equals 19.6 times delta x... delta x is about 20.4 meters?

TUTOR: Excellent! 20.4 meters.
       [WHITEBOARD: Shows complete solution]
       Does that seem reasonable for a ball thrown up at 20 m/s?

STUDENT: I guess? It's like a 6-story building?

TUTOR: Good instinct to check! About 7 stories actually - each floor is
       roughly 3 meters. That's a pretty strong throw but plausible.
       Want to try a similar problem on your own?

STUDENT: Sure.

TUTOR: Okay, this time the ball is thrown at 15 m/s. How high does it go?
       [WHITEBOARD: Shows new problem]
       Same approach - what do you know and what's the velocity at the top?

[Session continues...]
```
