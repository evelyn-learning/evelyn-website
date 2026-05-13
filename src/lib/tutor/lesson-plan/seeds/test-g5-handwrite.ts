/**
 * TEST PLAN — G5 Science — Plant Needs (handwrite exercise).
 *
 * QA harness for Phase 1' of the whiteboard markup initiative
 * (audit memory: project_tutor_whiteboard_markup_audit.md). This plan
 * is intentionally designed to invite MULTIPLE tutor_handwrite calls
 * — both anchored (`near`) and margin-slotted (`margin`) variants —
 * so we can verify the new tool fires, lands visually, and round-
 * trips through the PDF export.
 *
 * The concept segment renders a small comparison_table (re-using
 * Phase 1's verified renderer), then directs the brain via teacherNote
 * to handwrite at specific moments:
 *   1. Right after the table renders → margin: "top" — "Key idea: …"
 *   2. When the student names a plant need → near: "<need> column",
 *      position: "above" — short affirmation.
 *   3. During recap → margin: "bottom" — formula-style summary.
 *
 * How to run:
 *   1. http://localhost:3001/tutor → Science → 5 → Life Science
 *   2. Pick "[TEST] G5 Science — Plant Needs (handwrite)".
 *   3. Start session.
 *   4. Whiteboard expectations:
 *      a. Comparison table renders (4 items × 2 attributes).
 *      b. Within 1-2 turns of the table appearing, a handwriting-
 *         font note appears at the top of the page ("Key idea: ...").
 *      c. When you name a plant need, a handwriting note appears
 *         ABOVE the matching column with an affirmation.
 *      d. At recap, a bottom-margin note appears with the summary.
 *   5. Server log expectations:
 *      a. `tool-call tutor_handwrite { ... }` appears 2-3+ times.
 *      b. NO `handwrite-reject (silent drop)` lines for the margin
 *         calls (they have no `near` to resolve).
 *      c. NO scribble silent-drops cascading from missed handwrites.
 *   6. End session → export PDF. The handwrites appear as
 *      soft-cream bordered boxes with italic amber text + a
 *      "↳ near X" / "↳ margin Y" anchor hint underneath.
 *
 * Pass criteria:
 *   - At least 2 tutor_handwrite calls land visually (live WB).
 *   - At least 1 margin handwrite + 1 anchored handwrite among them.
 *   - Comparison-table dedup still fires correctly (no blank pages).
 *   - No regression on Phase 1's existing comparison_table behavior.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G5_HANDWRITE: LessonPlan = {
  id: 'evelyn.test.g5.science.handwrite.v1',
  title: '[TEST] G5 Science — Plant Needs (handwrite)',
  curriculum: 'NGSS',
  grade: '5',
  subject: 'science',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'test.handwrite.plant-needs',
      description: 'Identify the four things plants need to grow (sunlight, water, soil, air) and use a comparison table + margin notes to anchor the memory.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 6,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open the question of what plants need to survive.',
      script:
        "Plants are everywhere — but they can't move to find food. So how do they survive? Let's find out what plants actually need to grow.",
      estimatedMinutes: 1,
    },

    {
      id: 'concept-plant-needs',
      kind: 'concept',
      goal: 'Render a comparison table of plant needs AND use tutor_handwrite to anchor the takeaway with margin and column-level notes.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. First, emit ONE show_diagram with type="comparison_table" and params:\n' +
        '   { items: ["Sunlight", "Water", "Soil", "Air"], ' +
        'attributes: ["Why plants need it", "Source"], ' +
        'cells: [' +
        '["Energy for food-making", "Helps move nutrients", "Holds roots + minerals", "Provides CO₂ and O₂"], ' +
        '["The sun", "Rain, ground", "Earth", "Atmosphere"]' +
        '], title: "What plants need to grow" }.\n' +
        '   cells is [attributes.length=2][items.length=4] — outer = rows = attributes, inner = columns = items.\n\n' +
        '2. IMMEDIATELY after the table renders (same turn or the next), emit ONE tutor_handwrite call:\n' +
        '   { text: "Key idea: plants need ALL 4 to grow!", margin: "top" }\n' +
        '   This puts a handwriting-font note across the top of the page.\n\n' +
        '3. Ask the student to name ONE thing plants need. After they answer (the answer will be one of Sunlight / Water / Soil / Air), ' +
        'emit a SECOND tutor_handwrite call anchored to that column:\n' +
        '   { text: "great answer!", near: "<their-answer> column", position: "above" }\n' +
        '   (e.g. near: "Sunlight column" if they said sunlight.)\n\n' +
        '4. Briefly explain why that need matters using the table\'s row content, then advance to the try-yourself.\n\n' +
        'IMPORTANT — keep handwrite text ≤ 80 characters. Do not pass both `near` and `margin` on the same call. ' +
        'Do not re-emit the show_diagram once it is on the board (Rule 13).',
      keyIdeas: [
        'Plants need four things: sunlight, water, soil, and air.',
        'Each of the four serves a distinct role — sunlight for energy, water for transport, soil for anchoring + minerals, air for CO₂.',
        'Removing any one stops growth.',
      ],
      vocabulary: [
        { term: 'photosynthesis', definition: 'The process plants use to turn sunlight + water + CO₂ into food.' },
        { term: 'nutrient', definition: 'A substance plants need to grow, taken from soil.' },
      ],
      suggestedTools: ['show_diagram', 'tutor_handwrite'],
      estimatedMinutes: 3,
    },

    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem: 'A scientist puts a plant in a sealed jar with soil and water, but blocks all sunlight. What will happen, and why?',
      expectedAnswer: 'The plant will die (or stop growing) because it cannot make food without sunlight (no photosynthesis).',
      hints: [
        'Look at the table — which plant need was removed?',
        'Sunlight is the energy source for making food. No sunlight → no food.',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Plants need: sunlight, water, soil, air.',
        'Sunlight provides energy; water transports nutrients; soil anchors + supplies minerals; air supplies CO₂.',
        'Remove any one and growth stops.',
      ],
      teacherNote:
        'TOOL SEQUENCE for recap:\n' +
        '1. Speak the three mustRemember lines briefly.\n' +
        '2. Emit ONE final tutor_handwrite to leave the takeaway as a teacher\'s margin note:\n' +
        '   { text: "Sunlight + Water + Soil + Air = Growth", margin: "bottom" }\n' +
        '3. Then close out the segment normally.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Test seed exercising tutor_handwrite (Phase 1\' of the whiteboard markup initiative). ' +
      'Combines a comparison_table render with explicit handwrite directives across the concept + recap segments ' +
      'so the brain emits at least 2 handwrite calls per session (1 margin + 1 anchored).',
  },
};
