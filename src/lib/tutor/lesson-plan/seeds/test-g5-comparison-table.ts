/**
 * TEST PLAN — G5 Science — States of Matter Comparison.
 *
 * QA harness, not production content. Single-purpose: verify the
 * `show_diagram(type="comparison_table")` schema fix landed 2026-05-12
 * (paramSchema row/column orientation tightening in catalog/manifest.ts
 * + sharpened solver error messages in
 * catalog/kinds/advanced-math-ela-social.ts).
 *
 * Designed to invite:
 *   - show_diagram with type="comparison_table", 3 items × 4 attributes.
 *     Cell shape is cells[attributeIndex][itemIndex]. The teacherNote
 *     spells out the exact params so the brain emits a correct call on
 *     the first attempt — no rejection round-trip, no fallback to
 *     show_table.
 *
 * How to run:
 *   1. http://localhost:3001/tutor → Science → 5 → Physical Science
 *   2. Pick "[TEST] G5 Science — States of Matter Comparison".
 *   3. Start session. Watch the whiteboard for the comparison grid.
 *   4. Server log should show NO `comparison_table: cells[N] must have M
 *      entries` rejection. The diagram should render with 3 columns
 *      (Solid / Liquid / Gas) and 4 rows (Shape / Volume / Compressibility
 *      / Particle motion).
 *   5. End session and export the PDF — verify tutor messages appear in
 *      the transcript count (PDF exporter claude-brain fix landed
 *      2026-05-12).
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G5_COMPARISON_TABLE: LessonPlan = {
  id: 'evelyn.test.g5.science.comparison-table.v1',
  title: '[TEST] G5 Science — States of Matter Comparison',
  curriculum: 'NGSS',
  grade: '5',
  subject: 'science',
  topic: 'physical-science',
  locale: 'en',
  los: [
    {
      id: 'test.diagrams.comparison-table',
      description: 'Use a 3 × 4 comparison grid to contrast solids, liquids, and gases on shape, volume, compressibility, and particle motion.',
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
      goal: 'Frame the comparison.',
      script: "Let's line up solids, liquids, and gases side by side so we can see exactly how each one behaves.",
      estimatedMinutes: 1,
    },

    {
      id: 'concept-comparison',
      kind: 'concept',
      goal: 'Show a 3-state × 4-attribute comparison grid for states of matter.',
      teacherNote:
        'EMIT EXACTLY ONE show_diagram with type="comparison_table". Do NOT call show_table — use show_diagram with the comparison_table kind. params shape: ' +
        '{ items: ["Solid", "Liquid", "Gas"], ' +
        'attributes: ["Shape", "Volume", "Compressibility", "Particle motion"], ' +
        'cells: [' +
        '["Definite", "Takes container shape", "Fills container"], ' +
        '["Definite", "Definite", "Fills container"], ' +
        '["Nearly none", "Slight", "High"], ' +
        '["Vibrate in place", "Slide past each other", "Move freely at high speed"]' +
        '], title: "States of Matter — Side-by-Side" }. ' +
        'cells is shaped [attributes.length=4][items.length=3] — outer rows = attributes (row labels), inner columns = items (column headers). ' +
        'After the table renders, read it briefly out loud row by row, then ask the student to predict ONE missing cell without looking back.',
      keyIdeas: [
        'A comparison table lines each item up in a column and each attribute in a row.',
        'Solids hold their shape because particles only vibrate in place.',
        'Liquids keep volume but take the shape of their container — particles slide past each other.',
        'Gases expand to fill any container because particles move freely and are spread far apart.',
      ],
      vocabulary: [
        { term: 'solid', definition: 'Matter with a definite shape and a definite volume.' },
        { term: 'liquid', definition: 'Matter with a definite volume but no definite shape.' },
        { term: 'gas', definition: 'Matter with neither a definite shape nor a definite volume.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 3,
    },

    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem: 'Which state of matter has a definite VOLUME but takes the SHAPE of its container?',
      expectedAnswer: 'liquid',
      hints: ['Look at the Volume row of the comparison table.', 'Solids keep their shape, gases fill the container — what is in between?'],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solid: definite shape, definite volume, particles vibrate.',
        'Liquid: container shape, definite volume, particles slide.',
        'Gas: no fixed shape or volume, particles fly freely.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose: 'Test seed exercising show_diagram(comparison_table) — verifies the 2026-05-12 schema-docstring fix lets the brain emit a correct call on the first attempt.',
  },
};
