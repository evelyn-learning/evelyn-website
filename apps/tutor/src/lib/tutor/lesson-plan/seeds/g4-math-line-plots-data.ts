/**
 * G4 — Line plots and reading data displays.
 *
 * Reading and creating line plots, bar graphs, picture graphs.
 * Identifying scale, labels, title.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MATH_LINE_PLOTS_DATA: LessonPlan = {
  id: 'evelyn.g4.math.data.line-plots.v1',
  title: 'Line plots and reading data displays',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'data',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.4.md.b.4',
      description: 'Make a line plot to display a data set of measurements in fractions of a unit.',
      standard: 'CCSS.MATH.CONTENT.4.MD.B.4',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.math.5.md.b.2'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a data display vs raw numbers.',
      script: 'Twenty kids tell you their shoe sizes. You can WRITE all twenty numbers — or you can MAKE A GRAPH that shows them all at once. Graphs let you SEE patterns instantly.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-line-plot',
      kind: 'concept',
      goal: 'Line plot structure + how to read three common displays.',
      keyIdeas: [
        'A LINE PLOT (sometimes called a dot plot) is a number line with X\'s or dots above each value showing how many times it appears.',
        'PARTS of any data display: TITLE (what it\'s about), AXIS LABELS (what each axis represents), SCALE (the spacing of numbers), DATA (the dots/bars).',
        'BAR GRAPH: bars\' heights show counts. Easy to compare categories.',
        'PICTURE GRAPH (pictograph): each picture stands for a number (e.g., one apple = 5 students). Read the KEY for the value of each picture.',
        'TO READ: 1) Find the title. 2) Check axis labels. 3) Read the scale carefully. 4) Match data to the values.',
      ],
      vocabulary: [
        { term: 'line plot', definition: 'a number line with dots showing how often each value appears.' },
        { term: 'scale', definition: 'the values shown along an axis.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-line-plot',
      kind: 'worked_example',
      problem: 'Eight students measured their pencils to the nearest 1/2 inch and got: 5, 6, 6.5, 6, 6.5, 7, 7, 7.5. Make a line plot.',
      steps: [
        'Number line: mark 5, 5.5, 6, 6.5, 7, 7.5, 8.',
        'Place an X above each value for each measurement.',
        'Above 5: one X. Above 6: two X\'s. Above 6.5: two X\'s. Above 7: two X\'s. Above 7.5: one X.',
        'Title: "Pencil lengths in inches".',
        'Now we can see at a glance: 6, 6.5, and 7 inches are tied for most common.',
      ],
      answer: 'line plot with X\'s at each value',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A pictograph uses 🍎 = 4 students. If a row shows 3 apples, how many students does it represent?',
      expectedAnswer: '12',
      responseFormat: 'numeric',
      hints: [
        'Each apple = 4. Three apples = 4 × 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skip-key',
      kind: 'misconception_check',
      question: 'In a pictograph, can you just COUNT the pictures to get the answer?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Ignoring the key in a pictograph.',
          correctsTo: 'No — each picture might equal 5 or 10 or 100 of something. Always check the KEY first. 3 apples might mean 3 students or 30, depending on the key.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Line plot: number line with dots at each value.',
        'Always check: title, labels, scale, key (for pictographs).',
        'Bar graph: heights show counts.',
        'Pictograph: each picture = some value (per the key).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a pictograph SHOW only part of a picture (a half-apple)?',
      hint: 'When the count isn\'t an exact multiple of the key. If 🍎 = 4 and you have 6 students, you\'d show 1.5 apples (1 full + 1 half).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
