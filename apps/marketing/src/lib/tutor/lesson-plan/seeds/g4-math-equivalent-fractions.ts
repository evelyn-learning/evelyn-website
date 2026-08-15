/**
 * G4 — Equivalent fractions and comparing fractions.
 *
 * Multiple fraction names for the same amount (1/2 = 2/4 = 3/6) and
 * how to recognize / generate them. Multiplying or dividing both
 * numerator and denominator by the same number leaves the value
 * unchanged. Used to compare fractions with unlike denominators by
 * finding a common ground.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MATH_EQUIVALENT_FRACTIONS: LessonPlan = {
  id: 'evelyn.g4.math.equivalent-fractions.v1',
  title: 'Equivalent Fractions',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'fractions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.4.nf.a.1',
      description: 'Explain why a/b is equivalent to (n×a)/(n×b) using visual fraction models.',
      standard: 'CCSS.MATH.CONTENT.4.NF.A.1',
    },
    {
      id: 'ccss.math.4.nf.a.2',
      description: 'Compare two fractions with different numerators and denominators.',
      standard: 'CCSS.MATH.CONTENT.4.NF.A.2',
    },
  ],
  prerequisites: ['ccss.math.3.nf.a.1', 'ccss.math.3.nf.a.3'],
  followUps: ['ccss.math.5.nf.a.1'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that two different-looking fractions can name the exact same amount.',
      script: 'Two pizzas, same size. The first is cut into 4 slices and you take 2. The second is cut into 8 slices and you take 4. Did you eat the same amount? Both times you ate half. So 2/4 and 4/8 are the same fraction wearing different clothes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-equivalence',
      kind: 'concept',
      goal: 'Multiplying or dividing top AND bottom by the same number gives an equivalent fraction.',
      keyIdeas: [
        'Two fractions are EQUIVALENT if they name the same amount of a whole.',
        '1/2 = 2/4 = 3/6 = 4/8 — different ways to write "half".',
        'Rule: if you multiply BOTH the numerator AND the denominator by the same number, the fraction\'s VALUE doesn\'t change.',
        'Same rule works in reverse: if you DIVIDE both by the same number (only works when both are evenly divisible), you SIMPLIFY the fraction.',
        '6/8 ÷ 2 on top and bottom = 3/4. Same amount, simpler fraction.',
        'Why does it work? Cutting each piece in half gives you twice as many pieces, but each is half the size — net amount unchanged.',
      ],
      vocabulary: [
        { term: 'equivalent fractions', definition: 'fractions with different numerators and denominators that name the same amount.' },
        { term: 'simplify', definition: 'to write a fraction with the smallest possible numerator and denominator.' },
        { term: 'common factor', definition: 'a number that evenly divides both the numerator and denominator.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-half',
      kind: 'worked_example',
      problem: 'Find three fractions equivalent to 1/2.',
      steps: [
        'Show 1/2 on a fraction bar — half the bar shaded.',
        'Multiply top and bottom by 2: (1×2)/(2×2) = 2/4.',
        'Show 2/4 on a fraction bar — same shaded amount, more cuts.',
        'Multiply by 3: (1×3)/(2×3) = 3/6.',
        'Multiply by 5: (1×5)/(2×5) = 5/10.',
        'All four bars look the same — same shaded amount.',
      ],
      answer: '2/4, 3/6, 5/10 (any equivalent)',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-simplify',
      kind: 'worked_example',
      problem: 'Simplify 12/16.',
      steps: [
        'Find a number that divides BOTH 12 and 16. Try 4: 12÷4 = 3, 16÷4 = 4.',
        'Result: 3/4.',
        'Check: can 3/4 be simplified further? 3 and 4 share no common factor besides 1.',
        '3/4 is the simplest form of 12/16.',
      ],
      answer: '3/4',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which fraction is equivalent to 2/3? (a) 4/6  (b) 3/4  (c) 2/4  (d) 5/6',
      expectedAnswer: '4/6',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4/6', correct: true },
        { id: 'b', text: '3/4' },
        { id: 'c', text: '2/4' },
        { id: 'd', text: '5/6' },
      ],
      hints: [
        'Multiply BOTH top and bottom of 2/3 by the same number — try 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-same',
      kind: 'misconception_check',
      question: 'Sage says "I can ADD the same number to top and bottom and get an equivalent fraction. So 1/2 = 3/4." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing the multiply-both rule with adding the same number to both.',
          correctsTo: 'No. ADDING changes the value. 1/2 = 0.5 but 3/4 = 0.75 — different. Equivalence only works with MULTIPLYING (or dividing) both by the same number.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Equivalent fractions name the same amount.',
        'Multiply (or divide) BOTH top and bottom by the same number — value unchanged.',
        'Adding the same number to both does NOT preserve the value.',
        'Simplest form: top and bottom share no common factor besides 1.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compare 3/5 and 5/8. Which is bigger? (Hint: rewrite both with the same denominator first.)',
      hint: '3/5 = 24/40 (multiply by 8). 5/8 = 25/40 (multiply by 5). 25 > 24, so 5/8 is bigger.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
