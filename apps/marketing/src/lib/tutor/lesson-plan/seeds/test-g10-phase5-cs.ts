/**
 * TEST PLAN — G10 CS — Phase 5 stress test.
 *
 * Exercises all 5 Phase 5 CS kinds:
 *   1. flowchart_simple   (SVG — node boxes + edges)
 *   2. state_machine      (SVG — state circles + transitions)
 *   3. binary_tree        (SVG — node circles + edges)
 *   4. truth_table        (HTML — table headers + rows)
 *   5. logic_gate         (SVG — gate body + input/output lines)
 *
 * Pass criteria per session:
 *   - 5 diagrams render (one per concept segment).
 *   - 5 tutor_scribble calls land on their explicit targets.
 *   - 5 tutor_handwrite entries appear in the strip.
 *   - No `[VoiceTutor] scribble-reject` warnings for the directed targets.
 *   - No `[Scribble] resolve-miss` warnings in the dev log.
 *   - Strip entries use the FRIENDLY displayName, not canonical:
 *       "x > 0? → ..." (NOT "node-n → ...")
 *       "Idle → ..." (NOT "state-q0 → ...")
 *       "5 → root of the tree" (NOT "node-root → ...")
 *       "A AND B → ..." (NOT "output-a-and-b → ...")
 *       "NAND → ..." (NOT "gate-body → ...")
 *   - PDF export contains all 5 diagrams + their markings.
 *   - Brain emits `show_diagram(type: "flowchart_simple")` — NOT the
 *     legacy `show_flowchart` tool. Verifying the deprecation
 *     pointer works.
 *
 * Run:
 *   1. http://localhost:3001/tutor → CS → 10 → Computer Science.
 *   2. Pick "[TEST] G10 CS — Phase 5 stress test".
 *   3. Hard-refresh (Cmd+Shift+R) before starting.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G10_PHASE5_CS: LessonPlan = {
  id: 'evelyn.test.g10.cs.phase5.v1',
  title: '[TEST] G10 CS — Phase 5 stress test',
  curriculum: 'AP CSA',
  grade: '9-12',
  subject: 'cs',
  topic: 'computer science',
  locale: 'en',
  los: [
    {
      id: 'test.phase5.cs-coverage',
      description:
        'Exercise all 5 Phase 5 CS kinds (flowchart_simple, state_machine, binary_tree, truth_table, logic_gate) with scribble + handwrite markings per kind.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the cross-kind CS test session.',
      script:
        "We're going to look at five tools computer scientists use to describe code: flowcharts, state machines, trees, truth tables, and logic gates. Ready?",
      estimatedMinutes: 1,
    },

    // ── 1. flowchart_simple ────────────────────────────────────────
    {
      id: 'concept-flowchart',
      kind: 'concept',
      goal: 'Render a flowchart_simple + scribble + handwrite on the decision node.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Use show_diagram with type="flowchart_simple" and params:\n' +
        '   { nodes: [\n' +
        '       { id: "s", type: "start", text: "Start" },\n' +
        '       { id: "n", type: "decision", text: "x > 0?" },\n' +
        '       { id: "p", type: "process", text: "Print positive" },\n' +
        '       { id: "e", type: "end", text: "End" }\n' +
        '     ],\n' +
        '     edges: [\n' +
        '       { from: "s", to: "n" },\n' +
        '       { from: "n", to: "p", label: "yes" },\n' +
        '       { from: "n", to: "e", label: "no" },\n' +
        '       { from: "p", to: "e" }\n' +
        '     ],\n' +
        '     title: "Sign Check" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "x > 0?", color: "#dc2626", label: "branch point" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Diamond = decision; both branches must be labeled (yes/no)." }\n\n' +
        '4. Briefly walk through how decisions split control flow, then advance.\n\n' +
        'IMPORTANT: Use show_diagram(type: "flowchart_simple"), NOT the legacy show_flowchart tool.',
      keyIdeas: [
        'Diamond shape = decision node (a branch in the flow).',
        'Decision outgoing edges should be labeled (yes/no, true/false).',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. state_machine ───────────────────────────────────────────
    {
      id: 'concept-state-machine',
      kind: 'concept',
      goal: 'Render a state_machine + scribble + handwrite on the accept state.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Use show_diagram with type="state_machine" and params:\n' +
        '   { states: [\n' +
        '       { id: "q0", label: "Idle", isStart: true },\n' +
        '       { id: "q1", label: "Working" },\n' +
        '       { id: "q2", label: "Done", isAccept: true }\n' +
        '     ],\n' +
        '     transitions: [\n' +
        '       { from: "q0", to: "q1", label: "start" },\n' +
        '       { from: "q1", to: "q1", label: "tick" },\n' +
        '       { from: "q1", to: "q2", label: "finish" }\n' +
        '     ],\n' +
        '     title: "Job Worker FSM" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Done", color: "#16a34a", label: "accept state" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Double-circled state = accept (machine halts here)." }\n\n' +
        '4. Briefly explain start, transitions, and accept, then advance.',
      keyIdeas: [
        'Start state = where the machine begins (arrow with no source).',
        'Accept state (double circle) = the machine halts successfully here.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. binary_tree ─────────────────────────────────────────────
    {
      id: 'concept-binary-tree',
      kind: 'concept',
      goal: 'Render a binary_tree + scribble + handwrite on the root.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Use show_diagram with type="binary_tree" and params:\n' +
        '   { root: {\n' +
        '       value: "5",\n' +
        '       left: { value: "3", left: { value: "1" }, right: { value: "4" } },\n' +
        '       right: { value: "8", right: { value: "9" } }\n' +
        '     },\n' +
        '     title: "Sample BST" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "5", color: "#dc2626", label: "root" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "BST property: left subtree < node < right subtree." }\n\n' +
        '4. Briefly walk through the BST invariant, then advance.',
      keyIdeas: [
        'Root = the topmost node.',
        'BST: left descendants are smaller, right descendants are larger.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 4. truth_table ─────────────────────────────────────────────
    {
      id: 'concept-truth-table',
      kind: 'concept',
      goal: 'Render a truth_table + scribble + handwrite on the output column.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Use show_diagram with type="truth_table" and params:\n' +
        '   { inputs: ["A", "B"],\n' +
        '     outputColumns: [\n' +
        '       { label: "A AND B", values: [false, false, false, true] }\n' +
        '     ],\n' +
        '     title: "Truth Table — AND" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "A AND B", color: "#3b82f6", label: "only 1 when both inputs are 1" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "AND output = 1 only on the last row (both inputs 1)." }\n\n' +
        '4. Briefly explain the AND truth table, then advance.',
      keyIdeas: [
        '2 inputs → 4 rows (2^n combinations).',
        'AND output is 1 only when ALL inputs are 1.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 5. logic_gate ──────────────────────────────────────────────
    {
      id: 'concept-logic-gate',
      kind: 'concept',
      goal: 'Render a logic_gate + scribble + handwrite on the gate body.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Use show_diagram with type="logic_gate" and params:\n' +
        '   { gate: "NAND", inputs: ["A", "B"], output: "Q", title: "NAND Gate" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "NAND", color: "#dc2626", label: "universal gate" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "NAND is universal — any boolean function can be built from NAND gates alone." }\n\n' +
        '4. Briefly explain NAND universality, then advance.',
      keyIdeas: [
        'NAND = NOT AND. Output is 0 only when ALL inputs are 1.',
        'NAND is a universal gate — sufficient to build any boolean function.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ───────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem:
        'In a truth table for the OR of two inputs (A OR B), how many rows show output = 1?',
      expectedAnswer: '3',
      hints: [
        'OR is true when AT LEAST ONE input is 1.',
        'List the four rows: 00, 01, 10, 11. How many are NOT 00?',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ──────────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Flowchart diamond = decision; label both outgoing edges.',
        'State machine: start (arrow-in), accept (double circle).',
        'BST: left < node < right.',
        'Truth table: 2^n rows for n inputs.',
        'NAND is universal — any boolean function can be built from NAND.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Test seed for Phase 5 (CS). Exercises all 5 Phase 5 kinds with explicit teacherNote directives forcing one tutor_scribble + one tutor_handwrite per diagram. Also verifies that the brain prefers show_diagram(type: "flowchart_simple") over the deprecated show_flowchart tool.',
  },
};
