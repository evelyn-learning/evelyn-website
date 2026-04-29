/**
 * G3 — Fractions Intro (unit fractions, parts of a whole, number line).
 *
 * Builds the "fraction = equal parts of a whole" mental model. Anchors
 * on UNIT FRACTIONS first (1/2, 1/3, 1/4) before composing larger ones
 * (3/4 = 1/4 + 1/4 + 1/4). Connects area model (pizza slices), set
 * model (counters), and number-line model — same fraction, three
 * pictures.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_FRACTIONS_INTRO: LessonPlan = {
  id: 'evelyn.g3.math.fractions.intro.v1',
  title: 'Fractions: Equal Parts of a Whole',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'fractions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.nf.a.1',
      description: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts.',
      standard: 'CCSS.MATH.CONTENT.3.NF.A.1',
    },
    {
      id: 'ccss.math.3.nf.a.2',
      description: 'Represent a fraction on a number line.',
      standard: 'CCSS.MATH.CONTENT.3.NF.A.2',
    },
  ],
  prerequisites: ['ccss.math.2.g.a.3'],
  followUps: ['ccss.math.3.nf.a.3', 'ccss.math.4.nf.a.1'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a familiar sharing scene — a pizza — to introduce parts of a whole.',
      script: 'You order a pizza and cut it into 4 equal slices. You eat one slice. How would we describe how much of the pizza you ate? Not 1, not 0 — somewhere in between. That\'s where fractions come in.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-unit-fractions',
      kind: 'concept',
      goal: 'A fraction names equal parts of a whole. The denominator is the number of equal parts; the numerator is how many of those parts you have.',
      keyIdeas: [
        'A fraction has two numbers separated by a line: numerator on top, denominator on bottom.',
        'The DENOMINATOR (bottom) tells you how many equal pieces the whole is cut into.',
        'The NUMERATOR (top) tells you how many of those pieces you\'re talking about.',
        'A UNIT FRACTION has a 1 on top: 1/2, 1/3, 1/4. It\'s ONE equal part of the whole.',
        'Bigger fractions are made of unit fractions: 3/4 = 1/4 + 1/4 + 1/4.',
        'The pieces have to be EQUAL — three uneven slices of pizza aren\'t thirds.',
      ],
      vocabulary: [
        { term: 'fraction', definition: 'a number that names equal parts of a whole.' },
        { term: 'numerator', definition: 'the top number — how many parts.' },
        { term: 'denominator', definition: 'the bottom number — how many equal parts in the whole.' },
        { term: 'unit fraction', definition: 'a fraction with 1 on top, like 1/4.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_equation', 'show_number_line'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-three-fourths',
      kind: 'worked_example',
      problem: 'Show 3/4 of a pizza three different ways.',
      steps: [
        'Use show_fraction_bar to display a circle cut into 4 equal slices, with 3 shaded.',
        'Read it aloud: "Three out of four equal pieces — three-fourths."',
        'Show it as repeated unit fractions: 3/4 = 1/4 + 1/4 + 1/4.',
        'Use show_number_line from 0 to 1 with 4 equal tick marks. Mark 3/4 at the third tick.',
        'Connect: same fraction, three pictures, all naming the same amount.',
      ],
      answer: '3/4',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A chocolate bar has 6 equal squares. You eat 2 of them. What fraction of the bar did you eat?',
      expectedAnswer: '2/6',
      responseFormat: 'free',
      hints: [
        'How many equal pieces is the whole cut into? That\'s the bottom.',
        'How many did you eat? That\'s the top.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-equal-parts',
      kind: 'misconception_check',
      question: 'Sam cuts a sandwich into 4 pieces, but two pieces are big and two are small. He says he ate "one fourth" of the sandwich. Is he right?',
      commonErrors: [
        {
          answer: 'yes — there are 4 pieces',
          misconception: 'Counting pieces without checking that they\'re equal.',
          correctsTo: 'No. Fractions only work when the pieces are EQUAL. Four pieces of different sizes aren\'t fourths — they\'re just four pieces.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A fraction names equal parts of a whole.',
        'Numerator (top) = how many parts. Denominator (bottom) = total equal parts.',
        'Unit fractions like 1/3 are the building blocks; 2/3 is two of them.',
        'Pieces must be equal for the fraction to make sense.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two pizzas are the same size. The first is cut into 8 equal slices, the second into 4. You eat one slice from each. Which slice was bigger?',
      hint: 'Picture 1/8 vs 1/4. Same whole, different number of cuts. The bigger denominator means more cuts and SMALLER pieces.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
