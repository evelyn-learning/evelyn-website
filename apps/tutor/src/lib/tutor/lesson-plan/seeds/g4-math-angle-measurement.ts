/**
 * G4 — Angle measurement.
 *
 * Reading a protractor, classifying angles (acute, right, obtuse,
 * straight). Building toward G5 coordinate plane and HS geometry.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MATH_ANGLE_MEASUREMENT: LessonPlan = {
  id: 'evelyn.g4.math.geometry.angle-measurement.v1',
  title: 'Measuring angles with a protractor',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.4.md.c.6',
      description: 'Measure angles in whole-number degrees using a protractor.',
      standard: 'CCSS.MATH.CONTENT.4.MD.C.6',
    },
    {
      id: 'ccss.math.4.g.a.1',
      description: 'Classify angles as acute, right, obtuse.',
      standard: 'CCSS.MATH.CONTENT.4.G.A.1',
    },
  ],
  prerequisites: ['ccss.math.4.g.a.1'],
  followUps: ['ccss.math.4.md.c.7'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a real-world angle.',
      script: 'Open a book a little. Now open it more. The angle between the covers is GROWING. We measure that opening in DEGREES. A book lying flat is 180°. A book closed is 0°.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-classify',
      kind: 'concept',
      goal: 'Four angle classifications + how to use a protractor.',
      keyIdeas: [
        'A DEGREE is the unit for measuring angles. A full circle is 360°.',
        'ACUTE angle: less than 90°. (Sharp like a slice of pizza.)',
        'RIGHT angle: exactly 90°. (Corner of a piece of paper.)',
        'OBTUSE angle: greater than 90° but less than 180°.',
        'STRAIGHT angle: exactly 180°. (A flat line.)',
        'PROTRACTOR: the half-circle tool with degree marks 0° to 180°. To use: 1) place the center on the angle\'s VERTEX, 2) line up one ray with the 0° line, 3) read where the other ray crosses the scale.',
      ],
      vocabulary: [
        { term: 'angle', definition: 'the opening between two rays meeting at a point.' },
        { term: 'degree', definition: 'the unit for measuring angles. Full circle = 360°.' },
        { term: 'vertex', definition: 'the point where two rays meet to form an angle.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify-angle',
      kind: 'worked_example',
      problem: 'You measure an angle with a protractor and read 135°. Classify it.',
      steps: [
        '135° is BIGGER than 90° but SMALLER than 180°.',
        'That fits "obtuse".',
        'So this angle is OBTUSE.',
      ],
      answer: 'obtuse',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'An angle measures 45°. Is it acute, right, obtuse, or straight?',
      expectedAnswer: 'acute',
      responseFormat: 'free',
      hints: [
        '45° is less than 90°. What classification is less than 90°?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-protractor-scale',
      kind: 'misconception_check',
      question: 'A protractor has TWO scales (one going 0-180 left-to-right, the other going 180-0). Does it matter which one you read?',
      commonErrors: [
        {
          answer: 'no',
          misconception: 'Reading whichever scale is convenient.',
          correctsTo: 'Yes — you must use the scale that starts at 0 on YOUR ray. Otherwise you\'ll get the SUPPLEMENT of the angle (180 minus the real measurement). Always check: does my ray line up with the 0 on this scale?',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Acute < 90°, Right = 90°, Obtuse > 90° but < 180°, Straight = 180°.',
        'Place protractor center on vertex; line one ray with 0°; read where the other ray crosses.',
        'Use the scale that has 0 on YOUR ray.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A REFLEX angle is greater than 180°. How could you measure one with a protractor that only goes to 180°?',
      hint: 'Measure the smaller angle on the other side, then subtract from 360°.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
