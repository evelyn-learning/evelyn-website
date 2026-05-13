/**
 * TEST PLAN — G10 chem/bio — Phase 3 stress test.
 *
 * Exercises all 4 Phase 3 chem/bio kinds:
 *   1. electron_configuration  (HTML mode — notation spans)
 *   2. orbital_diagram         (HTML mode — shell rows)
 *   3. periodic_table_highlight (SVG mode — highlighted cells)
 *   4. punnett_square          (SVG mode — cells + gametes + parents)
 *
 * Each concept segment forces the brain through a tight tool
 * sequence: show_diagram → tutor_scribble → tutor_handwrite, with
 * the scribble target named explicitly so we can verify the
 * resolver lands on the right feature and the strip carries the
 * friendly displayName.
 *
 * Pass criteria per session:
 *   - 4 diagrams render (one per concept segment).
 *   - 4 tutor_scribble calls land on their explicit targets
 *     (small blue/colored ✓ tick on the right feature).
 *   - 4 tutor_handwrite entries appear in the strip.
 *   - No `[VoiceTutor] scribble-reject` warnings for the directed
 *     targets.
 *   - No `[Scribble] resolve-miss` warnings in the dev log.
 *   - Strip entries use the FRIENDLY displayName, not canonical:
 *       "1s (2e⁻) → 2 electrons" (NOT "subshell-1 → ...")
 *       "2p shell → Hund's rule" (NOT "shell-3 → ...")
 *       "Na (sodium) → group 1 alkali metal" (NOT "element-Na → ...")
 *       "Bb → heterozygous" (NOT "cell-r1-c2 → ...")
 *   - PDF export contains all 4 diagrams + their markings.
 *
 * Run:
 *   1. http://localhost:3001/tutor → Science → 10 → Chemistry.
 *   2. Pick "[TEST] G10 chem/bio — Phase 3 stress test".
 *   3. Hard-refresh (Cmd+Shift+R) before starting.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G10_PHASE3_CHEMBIO: LessonPlan = {
  id: 'evelyn.test.g10.chembio.phase3.v1',
  title: '[TEST] G10 chem/bio — Phase 3 stress test',
  curriculum: 'NGSS',
  grade: '9-12',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'test.phase3.chembio-coverage',
      description:
        'Exercise all 4 Phase 3 chem/bio kinds (electron_configuration, orbital_diagram, periodic_table_highlight, punnett_square) with scribble + handwrite markings per kind.',
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
      goal: 'Set up the cross-kind chem/bio test session.',
      script:
        "We're going to look at four different ways chemists and biologists organize information — electron configurations, orbital diagrams, the periodic table, and Punnett squares. Ready to dig in?",
      estimatedMinutes: 1,
    },

    // ── 1. electron_configuration ────────────────────────────────
    {
      id: 'concept-electron-config',
      kind: 'concept',
      goal: 'Render an electron_configuration diagram + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="electron_configuration" and params:\n' +
        '   { element: "C", title: "Carbon — Electron Configuration" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "2p", color: "#dc2626", label: "valence subshell" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Carbon has 4 valence electrons — 2 in 2s, 2 in 2p." }\n\n' +
        '4. Briefly walk the student through the 1s² 2s² 2p² filling, then advance.',
      keyIdeas: [
        'Electrons fill subshells in order: 1s, 2s, 2p, 3s, 3p, 4s ...',
        'Superscript = electron count in that subshell.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. orbital_diagram ───────────────────────────────────────
    {
      id: 'concept-orbital-diagram',
      kind: 'concept',
      goal: 'Render an orbital_diagram + scribble + handwrite for Hund\'s rule.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="orbital_diagram" and params:\n' +
        '   { element: "N", title: "Nitrogen — Orbital Diagram" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "2p", color: "#3b82f6", label: "Hund\'s rule — all three boxes singly occupied" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Nitrogen has 3 unpaired electrons in 2p — maximum spin." }\n\n' +
        '4. Briefly explain Hund\'s rule (singly occupy each degenerate orbital before pairing), then advance.',
      keyIdeas: [
        'Hund\'s rule: fill orbitals singly with parallel spins before pairing.',
        'Half-filled subshells (like 2p³, 3d⁵) are extra stable.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. periodic_table_highlight ──────────────────────────────
    {
      id: 'concept-periodic-table',
      kind: 'concept',
      goal: 'Render a periodic_table_highlight + scribble + handwrite for group 1.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="periodic_table_highlight" and params:\n' +
        '   { highlights: [' +
        '{ element: "Li", color: "#fbbf24", label: "lithium" }, ' +
        '{ element: "Na", color: "#fbbf24", label: "sodium" }, ' +
        '{ element: "K", color: "#fbbf24", label: "potassium" }' +
        '], title: "Group 1 Alkali Metals" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Na", color: "#dc2626", label: "most common in nature" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Alkali metals all have ONE valence electron — that\'s why they react alike." }\n\n' +
        '4. Briefly explain why group-1 elements share chemistry, then advance.',
      keyIdeas: [
        'Group number → number of valence electrons.',
        'Same group = similar chemistry because of valence electron count.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 4. punnett_square ────────────────────────────────────────
    {
      id: 'concept-punnett',
      kind: 'concept',
      goal: 'Render a punnett_square + scribble + handwrite for a monohybrid cross.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="punnett_square" and params:\n' +
        '   { parentA: "Bb", parentB: "Bb", title: "Brown × Brown (Bb × Bb)" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "bb", color: "#16a34a", label: "the only recessive phenotype" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Bb × Bb gives a 3:1 ratio — 1 BB : 2 Bb : 1 bb." }\n\n' +
        '4. Briefly walk the student through the 3:1 phenotypic ratio, then advance.',
      keyIdeas: [
        'A monohybrid Bb × Bb cross gives a 3:1 phenotypic ratio.',
        'bb is the only homozygous recessive cell in the square.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem:
        'In a Punnett square for Tt × Tt (where T = tall, t = short), what fraction of offspring will be SHORT?',
      expectedAnswer: '1/4',
      hints: [
        'Look back at the Bb × Bb square — same shape.',
        'Short means homozygous recessive (tt). Count how many of the four cells are tt.',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ───────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Electron configurations fill 1s → 2s → 2p → 3s → 3p → 4s ...',
        'Hund\'s rule: fill orbitals singly before pairing.',
        'Group number predicts valence electron count.',
        'Bb × Bb yields a 3:1 phenotypic ratio.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Test seed for Phase 3 (chem/bio remaining). Exercises all 4 Phase 3 kinds with explicit teacherNote directives forcing one tutor_scribble + one tutor_handwrite per diagram.',
  },
};
