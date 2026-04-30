/**
 * ACT — Math: 60 questions, 60 minutes.
 *
 * Wider content than SAT (covers more trig, more geometry, some
 * matrices, complex numbers). All multiple choice (5 options
 * instead of SAT\'s 4). Calculator allowed throughout. The strategy:
 * fast pattern recognition + plug-in numbers when stuck + skip
 * hard ones early.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_MATH: LessonPlan = {
  id: 'evelyn.testprep.act.math.v1',
  title: 'ACT Math: Strategy and Content',
  curriculum: 'ACT',
  grade: '11',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.math',
      description: 'Apply algebra, geometry, trig, and strategic test-taking to ACT Math.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Highlight ACT Math\'s key differences from SAT Math.',
      script: 'ACT Math has 60 questions in 60 minutes — that\'s 1 minute per question. Wider content than SAT (more trig, more advanced topics) but generally easier difficulty per question. Five answer choices (not four). Calculator allowed the whole time. Different test, slightly different game.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-act-math',
      kind: 'concept',
      goal: 'Content distribution + question difficulty pattern + strategies.',
      keyIdeas: [
        'CONTENT BREAKDOWN (rough):',
        '  Pre-Algebra (~25%): basic operations, fractions, percentages, ratios.',
        '  Elementary Algebra (~15%): linear equations, exponents, simplifying expressions.',
        '  Intermediate Algebra (~15%): quadratics, systems, functions, logs.',
        '  Coordinate Geometry (~15%): graphs, slope, distance/midpoint formulas.',
        '  Plane Geometry (~25%): triangles, circles, polygons, area/perimeter, similar/congruent.',
        '  Trigonometry (~5%): SOH-CAH-TOA, identities, basic equations.',
        'DIFFICULTY: questions roughly progress from EASIER (1-30) to HARDER (31-60). Bank the early ones.',
        'KEY STRATEGIES:',
        '  PLUG IN NUMBERS: when a problem has variables in answer choices, pick a simple number for the variable, compute both the question and each choice, see which match.',
        '  WORK BACKWARDS: when answer choices are concrete numbers, plug each into the question — start with the middle choice (often C or 3rd of 5).',
        '  USE THE CALCULATOR LIBERALLY (it\'s allowed throughout — unlike SAT).',
        '  KNOW YOUR FORMULAS: ACT doesn\'t give you a formula sheet (unlike SAT). Memorize: area, volume, distance, midpoint, slope, quadratic formula, special triangles, basic trig.',
        '  GUESS LETTER consistency: if running out of time, guess the SAME letter for all remaining (e.g., "C") — random guessing has positive expected value (no penalty).',
        'SPECIAL TRIANGLES (memorize):',
        '  30-60-90: sides 1 : √3 : 2.',
        '  45-45-90: sides 1 : 1 : √2.',
        '  Pythagorean triples: 3-4-5, 5-12-13, 8-15-17.',
        'TRIG: SOH-CAH-TOA basics, unit circle for common angles, basic identities.',
      ],
      vocabulary: [
        { term: 'plug-in numbers', definition: 'pick a simple value for variables to test answer choices.' },
        { term: 'work backwards', definition: 'plug answer choices into the question to find which works.' },
        { term: 'SOH-CAH-TOA', definition: 'mnemonic for sin/cos/tan in right triangles.' },
      ],
      suggestedTools: ['show_table', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-plug-in',
      kind: 'worked_example',
      problem: 'If x = 3y + 1, what does x - 1 equal? (a) 3y (b) 3y - 1 (c) 3y + 1 (d) 3y + 2 (e) 6y',
      steps: [
        'Method 1 — algebra: x - 1 = (3y + 1) - 1 = 3y. Answer (a).',
        'Method 2 — plug in: let y = 2. Then x = 3(2) + 1 = 7. x - 1 = 6.',
        'Check each choice with y = 2: (a) 3(2) = 6 ✓. (b) 5. (c) 7. (d) 8. (e) 12. Only (a) matches.',
        'Either method works. Plug-in is faster when algebra is messy.',
      ],
      answer: '(a) 3y',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-work-backwards',
      kind: 'worked_example',
      problem: 'For what value of x does x² - 3x = 10? (a) 2 (b) 3 (c) 5 (d) 7 (e) 10',
      steps: [
        'Algebra: x² - 3x - 10 = 0 → (x - 5)(x + 2) = 0 → x = 5 or -2. Answer (c).',
        'Working backwards (when factoring stalls): plug in (c) 5: 25 - 15 = 10. ✓',
        'Plug in (a) 2: 4 - 6 = -2. ✗',
        'Plug in (d) 7: 49 - 21 = 28. ✗',
        'Working backwards is fast when you have specific numbers to test.',
      ],
      answer: '(c) 5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a 30-60-90 triangle, the shorter leg is 4. What is the hypotenuse?',
      expectedAnswer: '8',
      responseFormat: 'numeric',
      hints: [
        '30-60-90 sides: 1 : √3 : 2.',
        'Shorter leg corresponds to 1; hypotenuse to 2. So hypotenuse = 2 × 4 = 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-formula-given',
      kind: 'misconception_check',
      question: 'Reza expects a formula sheet at the start of ACT Math like SAT has. Does ACT provide one?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Carrying SAT habits into ACT.',
          correctsTo: 'No. ACT does NOT provide a formula sheet (SAT does). You MUST memorize: area/volume formulas, distance/midpoint, slope, quadratic formula, special triangle ratios, basic trig identities. This is one of the biggest day-of differences between the two tests.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '60 questions / 60 minutes. ~1 min/Q.',
        'Difficulty roughly progresses easy → hard. Bank early.',
        'No formula sheet — memorize.',
        'Calculator allowed entire section.',
        'Strategies: plug-in numbers, work backwards, eliminate, guess if needed (no penalty).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'You\'re halfway through ACT Math (~30 questions in) but you\'ve only done 25. What do you do?',
      hint: 'You\'re behind pace. Pick up speed: skip anything that looks long, guess on visibly hard questions, focus on early questions you might still bank. Better to bank 5 easy questions than spend 5 minutes on one stumper.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
