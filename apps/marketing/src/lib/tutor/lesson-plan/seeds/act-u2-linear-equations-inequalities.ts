/**
 * ACT — Math / Linear Equations & Inequalities: multi-step solving under
 * time pressure.
 *
 * One of the highest-frequency ACT Math topics — roughly 8–10 of the 60
 * questions touch linear equations or inequalities in some form. The
 * algebra itself is rarely hard; points are lost to distribution sign
 * errors and forgotten inequality flips. Calculator allowed, ~60 seconds
 * per question. All stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_LINEAR_EQUATIONS_INEQUALITIES: LessonPlan = {
  id: 'evelyn.testprep.act.linear-equations-inequalities.v1',
  title: 'Linear Equations & Inequalities',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.linear-equations-inequalities',
      standard: 'ACT-2.2',
      description:
        'Solve multi-step linear equations and inequalities — including variables on both sides, distribution, and fractions or decimals — and translate inequality phrases into correct symbolic form.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame linear equations/inequalities as a high-frequency, fast-point ACT Math skill and preview the sign-flip trap.',
      script:
        'Linear equations and inequalities show up in something like 8 to 10 of the 60 ACT Math questions — one of the highest-yield topics on the whole test. At about 60 seconds a question, the algebra itself is usually simple; what costs students points is a distribution sign error or a forgotten inequality flip. Today we drill the setup that avoids both.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-linear-solving',
      kind: 'concept',
      goal: 'The isolate-the-variable method for equations AND inequalities, plus the named traps that eat points.',
      keyIdeas: [
        'PACE: these are usually early, "bankable" questions — solve fast, check fast, move on.',
        'ISOLATE THE VARIABLE: distribute first, combine like terms on each side, then move all variable terms to one side and all constants to the other.',
        'CLEAR FRACTIONS/DECIMALS EARLY: multiply the whole equation by the LCD (or by 10, 100…) before isolating — this avoids messy fraction arithmetic mid-solve.',
        'INEQUALITIES SOLVE LIKE EQUATIONS — with ONE extra rule: multiplying or dividing both sides by a NEGATIVE number flips the inequality sign.',
        'TRANSLATING PHRASES: "at least" → ≥, "at most" / "no more than" → ≤, "more than" → >, "fewer than" / "less than" → <, "no less than" → ≥.',
        'TRAP — DISTRIBUTING A NEGATIVE: -(2x - 5) = -2x + 5, NOT -2x - 5. This single sign slip is one of the most common ACT algebra mistakes.',
        'TRAP — VARIABLE ON BOTH SIDES: move all variable terms to one side BEFORE combining constants; don\'t accidentally combine a variable term with a constant.',
        'CHECK BY SUBSTITUTION: plug your solution back into the ORIGINAL equation or inequality — costs 10 seconds and catches sign errors before you bubble the wrong answer.',
      ],
      vocabulary: [
        { term: 'coefficient', definition: 'the number multiplying a variable, e.g. the 3 in 3x.' },
        { term: 'compound inequality', definition: 'two inequalities joined by "and" that the variable must satisfy simultaneously, e.g. -2 < x ≤ 5.' },
        { term: 'literal equation', definition: 'an equation with multiple variables, solved for one variable in terms of the others (e.g. solve d = rt for t).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-multistep-equation',
      kind: 'worked_example',
      problem: 'Solve for x: 3(x - 4) + 5 = 2x + 7',
      steps: [
        'Distribute the 3: 3x - 12 + 5 = 2x + 7, which simplifies to 3x - 7 = 2x + 7.',
        'Move variable terms to one side: subtract 2x from both sides → x - 7 = 7.',
        'Move constants to the other side: add 7 to both sides → x = 14.',
        'Check in the ORIGINAL equation: 3(14 - 4) + 5 = 3(10) + 5 = 35, and 2(14) + 7 = 28 + 7 = 35. ✓',
      ],
      answer: 'x = 14',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-inequality-flip',
      kind: 'worked_example',
      problem: 'Solve for x: -4(x + 2) ≥ x - 17',
      steps: [
        'Distribute the negative carefully: -4(x + 2) = -4x - 8, so the inequality is -4x - 8 ≥ x - 17.',
        'Move variable terms to one side: subtract x from both sides → -5x - 8 ≥ -17.',
        'Move constants: add 8 to both sides → -5x ≥ -9.',
        'Divide both sides by -5 — a NEGATIVE number, so FLIP the inequality: x ≤ 9/5.',
        'Check with a value that should work, x = 0: -4(0 + 2) = -8, and 0 - 17 = -17. Is -8 ≥ -17? Yes. ✓ And a value that should fail, x = 2: -4(4) = -16 vs 2 - 17 = -15; -16 ≥ -15 is false, correctly excluded since 2 > 9/5.',
      ],
      answer: 'x ≤ 9/5 (i.e., x ≤ 1.8)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-both-sides',
      kind: 'try_yourself',
      problem: 'Solve for x: 5x - 3 = 2x + 12',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3' },
        { id: 'b', text: '5', correct: true },
        { id: 'c', text: '9' },
        { id: 'd', text: '15' },
      ],
      expectedAnswer: '5',
      hints: ['Move the variable terms to one side first: subtract 2x from both sides.', 'That leaves 3x - 3 = 12, so 3x = 15.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-inequality-flip',
      kind: 'try_yourself',
      problem: 'Which value of x satisfies -3x + 7 > 22?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '-6', correct: true },
        { id: 'b', text: '-4' },
        { id: 'c', text: '0' },
        { id: 'd', text: '5' },
      ],
      expectedAnswer: '-6',
      hints: ['Subtract 7 from both sides: -3x > 15.', 'Dividing by a negative number flips the inequality sign: x < -5. Only one choice is less than -5.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-word-problem',
      kind: 'try_yourself',
      problem: 'Type your answer: A rental car costs $35 plus $0.20 per mile driven. If Maria\'s total cost was $63, how many miles did she drive?',
      responseFormat: 'numeric',
      expectedAnswer: '140 miles (35 + 0.20m = 63 → 0.20m = 28 → m = 140)',
      hints: ['Set up the equation: 35 + 0.20m = 63.', 'Subtract 35 from both sides, then divide by 0.20.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flip-forgotten',
      kind: 'misconception_check',
      question: 'A student solves -2x < 8 by dividing both sides by -2 and writing x < -4. What went wrong?',
      commonErrors: [
        {
          answer: 'x < -4',
          misconception: 'Forgetting to flip the inequality sign when dividing by a negative number.',
          correctsTo:
            'Dividing (or multiplying) both sides of an inequality by a NEGATIVE number flips the direction of the inequality. -2x < 8 → divide by -2 AND flip the sign → x > -4.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Distribute first, then combine like terms on each side before isolating the variable.',
        'Clear fractions/decimals early by multiplying the whole equation by the LCD or a power of 10.',
        'Multiplying or dividing an inequality by a NEGATIVE number flips the sign — the #1 ACT trap here.',
        'Translate phrases carefully: "at least" = ≥, "at most/no more than" = ≤, "more than" = >, "fewer/less than" = <.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Linear Equations & Inequalities' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
