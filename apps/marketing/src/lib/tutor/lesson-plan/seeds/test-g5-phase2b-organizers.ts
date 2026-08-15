/**
 * TEST PLAN — G5 mixed-subject — Phase 2b SVG Organizer Coverage.
 *
 * Companion to test-g5-phase2a-organizers. Exercises all 6 Phase 2b
 * kinds — five SVG-coordinate renderers + one HTML-grid renderer —
 * with explicit teacherNote directives forcing the brain to emit
 * tutor_scribble + tutor_handwrite against each kind's sub-features.
 *
 * Verifies that:
 *   - Each kind renders with data-feature + data-feature-cx/cy/w/h
 *     (SVG mode) or data-feature + data-feature-label (HTML mode).
 *   - tutor_scribble target strings (`tier-N`, `subject`, `verb`,
 *     `event-N`, `stage-N`, `part-N`) resolve and land visually.
 *   - tutor_handwrite text appears in the annotation strip.
 *   - The strip composes "{feature} → {label}" using the friendly
 *     display name from data-feature-label.
 *
 * Kinds covered (in segment order):
 *   1. hierarchy_pyramid   — concept-pyramid    (ecosystem trophic levels)
 *   2. sentence_diagram    — concept-sentence   (ELA grammar)
 *   3. historical_timeline — concept-timeline   (US milestones)
 *   4. water_cycle         — concept-cycle      (earth science)
 *   5. body_system         — concept-body       (biology)
 *
 * life_cycle / rock_cycle share the cycle_stages renderer with
 * water_cycle, so we exercise the renderer once via water_cycle.
 *
 * How to run:
 *   1. http://localhost:3001/tutor → pick this plan.
 *   2. Hard-refresh (Cmd+Shift+R) before starting.
 *   3. Each concept segment renders one organizer + a scribble +
 *      a handwrite. Watch live WB to confirm both land.
 *
 * Pass criteria (per session):
 *   - 5 organizers render (one per concept segment).
 *   - At least 5 tutor_scribble calls land visually (1 per kind).
 *   - At least 5 tutor_handwrite calls appear in the strip.
 *   - No `[VoiceTutor] scribble-reject` warnings for directed targets.
 *   - No `[Scribble] resolve-miss` warnings in the dev log.
 *   - PDF export contains all 5 organizers + their markings.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G5_PHASE2B_ORGANIZERS: LessonPlan = {
  id: 'evelyn.test.g5.mixed.phase2b.v1',
  title: '[TEST] G5 Mixed — Phase 2b SVG Organizer Coverage',
  curriculum: 'NGSS',
  grade: '5',
  subject: 'science',
  topic: 'mixed-organizers',
  locale: 'en',
  los: [
    {
      id: 'test.phase2b.svg-organizer-coverage',
      description:
        'Exercise all 5 Phase 2b organizer kinds (hierarchy_pyramid, sentence_diagram, historical_timeline, water_cycle, body_system) with scribble + handwrite markings on each.',
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
      goal: 'Set up the cross-subject organizer test.',
      script:
        "We're going to look at five different ways to organize ideas — pyramids, sentence trees, timelines, cycles, and body systems. Each one helps you see information differently.",
      estimatedMinutes: 1,
    },

    // ── 1. hierarchy_pyramid ──────────────────────────────────────
    {
      id: 'concept-pyramid',
      kind: 'concept',
      goal: 'Render a hierarchy_pyramid for an ecosystem + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="hierarchy_pyramid" and params:\n' +
        '   { tiers: [' +
        '{ label: "Producers" }, ' +
        '{ label: "Primary Consumers" }, ' +
        '{ label: "Secondary Consumers" }, ' +
        '{ label: "Apex Predators" }' +
        '], baseFirst: true, title: "Energy Pyramid" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Producers", color: "#16a34a", label: "base of the food chain" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Energy decreases as you go up the pyramid." }\n\n' +
        '4. Briefly explain how energy moves up trophic levels, then advance.',
      keyIdeas: [
        'Producers (plants) form the base of the energy pyramid.',
        'Energy is lost as heat at each level; only ~10% transfers up.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. sentence_diagram ──────────────────────────────────────
    {
      id: 'concept-sentence',
      kind: 'concept',
      goal: 'Render a sentence_diagram + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="sentence_diagram" and params:\n' +
        '   { subject: "dog", verb: "chased", object: "ball", ' +
        'modifiers: [' +
        '{ attachTo: "subject", word: "the" }, ' +
        '{ attachTo: "verb", word: "quickly" }, ' +
        '{ attachTo: "object", word: "red" }' +
        '], title: "The dog chased the red ball" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "verb", color: "#3b82f6", label: "the action" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Modifiers hang below the word they describe." }\n\n' +
        '4. Briefly explain subject-verb-object structure, then advance.',
      keyIdeas: [
        'Every complete sentence has a subject and a verb.',
        'Modifiers describe nouns or verbs and attach to the word they modify.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. historical_timeline ───────────────────────────────────
    {
      id: 'concept-timeline',
      kind: 'concept',
      goal: 'Render a historical_timeline + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="historical_timeline" and params:\n' +
        '   { events: [' +
        '{ date: "1776", label: "Declaration of Independence" }, ' +
        '{ date: "1865", label: "Civil War ends" }, ' +
        '{ date: "1920", label: "Women gain vote" }, ' +
        '{ date: "1969", label: "Moon landing" }' +
        '], title: "US Milestones" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "event-1", color: "#dc2626", label: "the start of a nation" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Each circle marks an event on the timeline." }\n\n' +
        '4. Briefly walk through one event, then advance.',
      keyIdeas: [
        'Timelines show events in chronological order.',
        'Spacing between events shows how much time passed.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 4. water_cycle ───────────────────────────────────────────
    {
      id: 'concept-cycle',
      kind: 'concept',
      goal: 'Render water_cycle + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="water_cycle" and params:\n' +
        '   { stages: [' +
        '{ label: "Evaporation" }, ' +
        '{ label: "Condensation" }, ' +
        '{ label: "Precipitation" }, ' +
        '{ label: "Collection" }' +
        '], title: "Water Cycle" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Precipitation", color: "#0ea5e9", label: "rain & snow" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "The water cycle has no real beginning or end." }\n\n' +
        '4. Briefly walk through one full loop, then advance.',
      keyIdeas: [
        'Water moves between liquid, vapor, and ice forms.',
        'Energy from the sun drives evaporation.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 5. body_system ───────────────────────────────────────────
    {
      id: 'concept-body',
      kind: 'concept',
      goal: 'Render body_system + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="body_system" and params:\n' +
        '   { system: "digestive", title: "The Digestive System", ' +
        'parts: [' +
        '{ label: "Mouth", description: "Where digestion begins — chewing + saliva." }, ' +
        '{ label: "Stomach", description: "Acid breaks food into a thick liquid." }, ' +
        '{ label: "Small Intestine", description: "Most nutrients absorbed here." }, ' +
        '{ label: "Large Intestine", description: "Absorbs water; forms waste." }' +
        '] }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Small Intestine", color: "#16a34a", label: "main absorption site" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Food takes about 24 hours to travel through the whole system." }\n\n' +
        '4. Briefly walk through the journey of a bite of food, then advance.',
      keyIdeas: [
        'The digestive system breaks food into nutrients the body can absorb.',
        'Each organ has a specific role in the process.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem: 'In the water cycle, what process turns water vapor in clouds back into liquid water?',
      expectedAnswer: 'Condensation',
      hints: [
        'Look at the water cycle diagram on a previous page.',
        'It is the OPPOSITE of evaporation.',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ───────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A pyramid shows a hierarchy with the base = largest tier.',
        'A sentence diagram shows subject + verb + object + modifiers.',
        'A timeline orders events chronologically.',
        'A cycle has no beginning or end.',
        'A body system is a set of parts that work together.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Test seed for Phase 2b (SVG-coordinate organizer fan-out). Exercises all 5 Phase 2b kinds (hierarchy_pyramid, sentence_diagram, historical_timeline, water_cycle, body_system) with explicit teacherNote directives forcing one tutor_scribble + one tutor_handwrite per organizer.',
  },
};
