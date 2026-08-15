/**
 * G1 — Measuring length with units.
 *
 * Comparing lengths, then using non-standard units (paperclips,
 * cubes), then standard units (inches, centimeters).
 */

import type { LessonPlan } from '../types';

export const SEED_G1_MATH_MEASUREMENT_LENGTH: LessonPlan = {
  id: 'evelyn.g1.math.measurement.length.v1',
  title: 'Measuring length',
  curriculum: 'CCSS',
  grade: '1',
  subject: 'math',
  topic: 'measurement',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.1.md.a.2',
      description: 'Express the length of an object as a whole number of length units, by laying multiple copies of a shorter object end-to-end.',
      standard: 'CCSS.MATH.CONTENT.1.MD.A.2',
    },
  ],
  prerequisites: ['ccss.math.k.md.a.1'],
  followUps: ['ccss.math.2.md.a.1'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that to measure something, you need to compare it to something else.',
      script: 'Hold up a pencil. Is it long or short? Compared to what? A finger? A book? Length only makes sense when we compare.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-units',
      kind: 'concept',
      goal: 'A unit is a fixed length we use over and over to measure something else.',
      keyIdeas: [
        'To MEASURE means to find out how long, tall, or wide something is.',
        'We need a UNIT — something with a fixed size that we use as our ruler.',
        'Non-standard units: paperclips, cubes, your hand. (Everyone\'s hand is different though!)',
        'Standard units: INCHES (in) and CENTIMETERS (cm) — fixed everywhere in the world.',
        'To measure with paperclips: lay them end-to-end, no gaps, no overlap, count.',
      ],
      vocabulary: [
        { term: 'unit', definition: 'a fixed length used to measure other things.' },
        { term: 'measure', definition: 'to find out how long something is.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pencil-paperclips',
      kind: 'worked_example',
      problem: 'A pencil is laid out on the desk. We line up paperclips next to it. There are 4 paperclips, end-to-end, with no gaps. How long is the pencil?',
      steps: [
        'Each paperclip is 1 unit.',
        'We laid out 4 paperclips, no gaps, no overlaps.',
        'So the pencil is 4 paperclips long.',
      ],
      answer: '4 paperclips',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A book is laid next to 6 cubes, end-to-end. How long is the book?',
      expectedAnswer: '6',
      responseFormat: 'numeric',
      hints: [
        'Each cube is 1 unit.',
        'Just count the cubes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-gaps',
      kind: 'misconception_check',
      question: 'If I leave gaps between my paperclips, will I get the right length?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Thinking measurement still works with gaps or overlaps.',
          correctsTo: 'No — gaps make the count too small (the gap isn\'t measured), and overlaps make the count too big. Units must be END-TO-END with NO gaps and NO overlaps.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A UNIT is a fixed length used to measure.',
        'Units must lay END-TO-END, no gaps, no overlaps.',
        'Standard units (inches, cm) work the same way everywhere.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might 5 of YOUR hand-lengths be different from 5 of MY hand-lengths?',
      hint: 'Hands are different sizes. That\'s why standard units (like inches) were invented.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
