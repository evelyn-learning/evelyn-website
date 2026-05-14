/**
 * TEST PLAN — G5 earth/space — Phase 4 stress test.
 *
 * Exercises all 6 Phase 4 earth-space kinds:
 *   1. phases_of_moon     (SVG — moon circle + lit/dark halves)
 *   2. solar_system       (SVG — Sun + 8 planets in a row)
 *   3. earth_layers       (SVG — concentric layer circles)
 *   4. eclipse_diagram    (SVG — Sun, Moon, Earth aligned)
 *   5. seasons_diagram    (SVG — orbital ellipse, 4 Earth positions)
 *   6. plate_tectonics    (SVG — two plates + arrows)
 *
 * Each concept segment forces the brain through a tight tool
 * sequence: show_diagram → tutor_scribble → tutor_handwrite, with
 * the scribble target named explicitly so we can verify the
 * resolver lands on the right feature and the strip carries the
 * friendly displayName.
 *
 * Pass criteria per session:
 *   - 6 diagrams render (one per concept segment).
 *   - 6 tutor_scribble calls land on their explicit targets
 *     (small colored ✓ tick on the right feature).
 *   - 6 tutor_handwrite entries appear in the strip.
 *   - No `[VoiceTutor] scribble-reject` warnings for the directed
 *     targets.
 *   - No `[Scribble] resolve-miss` warnings in the dev log.
 *   - Strip entries use the FRIENDLY displayName, not canonical:
 *       "lit side → ..." (NOT "lit-side → ...")
 *       "Earth → ..." (NOT "planet-Earth → ...")
 *       "Outer Core → ..." (NOT "layer-outer-core → ...")
 *       "Moon → ..." (NOT "moon → ..." — same here, fine)
 *       "Summer → ..." (NOT "season-summer → ...")
 *       "Indian → ..." (NOT "plate-a → ...")
 *   - PDF export contains all 6 diagrams + their markings.
 *
 * Run:
 *   1. http://localhost:3001/tutor → Science → 5 → Earth and Space.
 *   2. Pick "[TEST] G5 earth/space — Phase 4 stress test".
 *   3. Hard-refresh (Cmd+Shift+R) before starting.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G5_PHASE4_EARTH_SPACE: LessonPlan = {
  id: 'evelyn.test.g5.earth-space.phase4.v1',
  title: '[TEST] G5 earth/space — Phase 4 stress test',
  curriculum: 'NGSS',
  grade: '3-5',
  subject: 'science',
  topic: 'earth and space',
  locale: 'en',
  los: [
    {
      id: 'test.phase4.earth-space-coverage',
      description:
        'Exercise all 6 Phase 4 earth-space kinds (phases_of_moon, solar_system, earth_layers, eclipse_diagram, seasons_diagram, plate_tectonics) with scribble + handwrite markings per kind.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the cross-kind earth-and-space test session.',
      script:
        "We're going on a tour of Earth and space today — moon phases, our solar system, what's inside our planet, eclipses, the seasons, and the plates beneath us. Ready to explore?",
      estimatedMinutes: 1,
    },

    // ── 1. phases_of_moon ───────────────────────────────────────
    {
      id: 'concept-moon-phases',
      kind: 'concept',
      goal: 'Render phases_of_moon + scribble + handwrite for the first quarter moon.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="phases_of_moon" and params:\n' +
        '   { phase: "first_quarter", title: "First Quarter Moon" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "lit side", color: "#dc2626", label: "half illuminated" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "At first quarter, the right half of the Moon is lit (from Earth\'s view)." }\n\n' +
        '4. Briefly explain that the Moon doesn\'t make its own light — the Sun lights one side, and we see different fractions over the month. Then advance.',
      keyIdeas: [
        'The Moon doesn\'t make its own light — sunlight reflects off it.',
        'First quarter = half the Moon\'s face is lit.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. solar_system ─────────────────────────────────────────
    {
      id: 'concept-solar-system',
      kind: 'concept',
      goal: 'Render solar_system + scribble + handwrite locating Earth.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="solar_system" and params:\n' +
        '   { highlight: ["Earth"], title: "Our Solar System" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Earth", color: "#16a34a", label: "our home" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Earth is the 3rd planet from the Sun." }\n\n' +
        '4. Briefly walk through the inner rocky planets (Mercury → Mars) vs outer gas giants (Jupiter → Neptune), then advance.',
      keyIdeas: [
        'Eight planets orbit our Sun.',
        'Inner four (Mercury, Venus, Earth, Mars) are rocky; outer four (Jupiter, Saturn, Uranus, Neptune) are gas/ice giants.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. earth_layers ─────────────────────────────────────────
    {
      id: 'concept-earth-layers',
      kind: 'concept',
      goal: 'Render earth_layers + scribble + handwrite highlighting the Inner Core.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="earth_layers" and params:\n' +
        '   { title: "Inside the Earth" }\n' +
        '   (Defaults to the 4-layer model: Crust, Mantle, Outer Core, Inner Core.)\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Inner Core", color: "#dc2626", label: "solid iron" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Inner core: solid iron, very hot (~5,400°C), under huge pressure." }\n\n' +
        '4. Briefly compare the solid inner core to the LIQUID outer core, then advance.',
      keyIdeas: [
        'Earth has four main layers: Crust, Mantle, Outer Core, Inner Core.',
        'The inner core is SOLID iron despite being hotter than the molten outer core — because of pressure.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 4. eclipse_diagram ──────────────────────────────────────
    {
      id: 'concept-eclipse',
      kind: 'concept',
      goal: 'Render eclipse_diagram + scribble + handwrite for a solar eclipse.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="eclipse_diagram" and params:\n' +
        '   { type: "solar", title: "Solar Eclipse" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Moon", color: "#3b82f6", label: "blocks the Sun" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Solar eclipse: Moon passes between Sun and Earth, casting a shadow." }\n\n' +
        '4. Briefly contrast solar vs. lunar (Earth between Sun and Moon for lunar), then advance.',
      keyIdeas: [
        'Solar eclipse: Sun – Moon – Earth alignment (Moon in the middle).',
        'Lunar eclipse: Sun – Earth – Moon (Earth in the middle).',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 5. seasons_diagram ──────────────────────────────────────
    {
      id: 'concept-seasons',
      kind: 'concept',
      goal: 'Render seasons_diagram + scribble + handwrite for Summer.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="seasons_diagram" and params:\n' +
        '   { hemisphere: "northern", title: "Seasons (Northern Hemisphere)" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Summer", color: "#dc2626", label: "tilted toward Sun" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Summer: Northern Hemisphere tilts TOWARD the Sun → longer days, more direct sunlight." }\n\n' +
        '4. Briefly explain that seasons come from Earth\'s axial tilt, NOT from how far we are from the Sun. Then advance.',
      keyIdeas: [
        'Seasons are caused by Earth\'s 23.5° axial tilt — not by distance from the Sun.',
        'When a hemisphere tilts toward the Sun, that hemisphere has summer.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 6. plate_tectonics ──────────────────────────────────────
    {
      id: 'concept-plate-tectonics',
      kind: 'concept',
      goal: 'Render plate_tectonics + scribble + handwrite for a convergent boundary.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="plate_tectonics" and params:\n' +
        '   { boundary: "convergent", labels: { left: "Indian", right: "Eurasian" }, title: "Indian × Eurasian — Convergent Boundary" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Indian", color: "#16a34a", label: "moving north" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Indian and Eurasian plates colliding → Himalayas rise here." }\n\n' +
        '4. Briefly explain convergent (collide), divergent (pull apart), and transform (slide past) boundaries. Then advance.',
      keyIdeas: [
        'Convergent boundary: plates collide → mountains or trenches.',
        'The Himalayas are still rising because India is still pushing into Eurasia.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem:
        'When the Northern Hemisphere is tilted AWAY from the Sun, what season is it in the Northern Hemisphere?',
      expectedAnswer: 'winter',
      hints: [
        'Less direct sunlight, shorter days → cold season.',
        'Look back at the seasons diagram — which position has the Northern half pointing away?',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ───────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Moon phases come from sunlight reflecting off the Moon at different angles.',
        '8 planets — 4 rocky inner + 4 gas/ice outer.',
        'Earth has 4 layers: Crust, Mantle, Outer Core (liquid), Inner Core (solid).',
        'Solar eclipse: Moon between Sun & Earth. Lunar eclipse: Earth between Sun & Moon.',
        'Seasons come from axial tilt, not distance from Sun.',
        'Plate boundaries: convergent (collide), divergent (pull apart), transform (slide past).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Test seed for Phase 4 (earth & space). Exercises all 6 Phase 4 kinds with explicit teacherNote directives forcing one tutor_scribble + one tutor_handwrite per diagram.',
  },
};
