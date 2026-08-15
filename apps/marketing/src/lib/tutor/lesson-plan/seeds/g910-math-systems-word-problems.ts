/**
 * Grades 9-10 Math — Systems of Equations: Word Problems.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_SYSTEMS_WORD_PROBLEMS: LessonPlan = {
  id: 'evelyn.g910.math.systems.word-problems.v1',
  title: 'Systems of Equations — Word Problems',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'systems-of-equations',
  locale: 'en',
  los: [
    {
      id: 'g910.math.systems.word-problems',
      description: 'Translate real-world scenarios into systems of two linear equations and solve using substitution or elimination.',
      standard: 'CCSS.MATH.CONTENT.HSA.CED.A.3',
    },
  ],
  prerequisites: ['g910.math.systems.elimination'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Most "systems" problems in real life don\'t arrive as equations — they arrive as paragraphs.',
      script: 'A coffee shop sells lattes for $4 and pastries for $3. On a busy morning, they sold 50 items totaling $170. How many of each? You have two unknowns and two pieces of information — that\'s a system. The hard part isn\'t solving; it\'s translating.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-translation',
      kind: 'concept',
      goal: 'Naming variables, building equations from constraints, choosing method, interpreting answers.',
      keyIdeas: [
        'STEP 1 — DEFINE variables explicitly with units. "Let x = number of lattes, y = number of pastries." Naming gets you halfway.',
        'STEP 2 — IDENTIFY two distinct constraints. Each constraint becomes one equation. Common pairs: total count + total cost; total weight + total mixture; total time + total distance; ages now + ages in the future.',
        'STEP 3 — TRANSLATE each constraint:',
        '  "Total of 50 items" → x + y = 50.',
        '  "Total cost $170" → 4x + 3y = 170.',
        'STEP 4 — SOLVE using whichever method is easier (substitution if one equation is solved for a variable; elimination if neither is).',
        'STEP 5 — INTERPRET the answer in context. "x = 20 means 20 lattes" not just "x = 20." Check that values make sense (no negative people, no fractional lattes if not allowed).',
        'COMMON STRUCTURES:',
        '  MIXTURE: "x mL of 30% solution + y mL of 60% solution = z mL of 50% solution" → x + y = z, 0.30x + 0.60y = 0.50z.',
        '  AGE: "Sara is twice as old as Tom NOW; in 5 years she\'ll be 1.5× his age" → s = 2t, s + 5 = 1.5(t + 5).',
        '  RATE: "Boat goes upstream 30 km in 5 hours, downstream 30 km in 3 hours" → (b − c) = 6, (b + c) = 10, where b = boat speed, c = current.',
      ],
      vocabulary: [
        { term: 'constraint', definition: 'a piece of information from the problem that limits the values the variables can take; each becomes one equation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A coffee shop sells lattes for $4 and pastries for $3. They sold 50 items for a total of $170. How many of each were sold?',
      steps: [
        'Define: x = lattes, y = pastries.',
        'Constraint 1 (total items): x + y = 50.',
        'Constraint 2 (total dollars): 4x + 3y = 170.',
        'Solve by substitution. From eq 1: y = 50 − x.',
        'Plug into eq 2: 4x + 3(50 − x) = 170 ⟹ 4x + 150 − 3x = 170 ⟹ x = 20.',
        'Back-substitute: y = 50 − 20 = 30.',
        'INTERPRET: 20 lattes and 30 pastries.',
        'Check: 20 + 30 = 50 ✓; 4(20) + 3(30) = 80 + 90 = 170 ✓.',
      ],
      answer: '20 lattes, 30 pastries',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A chemistry teacher mixes a 20% acid solution with a 50% acid solution to make 60 mL of a 30% solution. How much of each solution?',
      expectedAnswer: 'Let x = mL of 20%, y = mL of 50%. x + y = 60. 0.20x + 0.50y = 0.30(60) = 18. From eq 1: y = 60 − x. Substitute: 0.20x + 0.50(60 − x) = 18 ⟹ 0.20x + 30 − 0.50x = 18 ⟹ −0.30x = −12 ⟹ x = 40 mL. So y = 20 mL. Answer: 40 mL of 20% solution + 20 mL of 50% solution.',
      responseFormat: 'free',
      hints: [
        'Define variables for the volumes of each solution.',
        'One equation tracks total volume; the other tracks total acid.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-units',
      kind: 'misconception_check',
      question: 'A student writes the mixture problem as 20x + 50y = 30(60), forgetting the percent conversion. Why is this wrong?',
      commonErrors: [
        {
          answer: 'Treats 20% as the number 20',
          misconception: 'Mixing percent values (20) with decimal coefficients (0.20).',
          correctsTo: 'Inside an equation, "20%" means the multiplier 0.20. The coefficient 20 in front of x would mean each mL of the first solution contributes 20 units of acid — wildly wrong since solutions are at most 100% acid. The fix: ALWAYS convert percent to decimal before plugging in. 20% → 0.20, 50% → 0.50, 30% → 0.30. (Alternatively, multiply the entire equation through by 100 to clear decimals — but be consistent.)',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Define variables FIRST, with units.',
        'Each constraint = one equation.',
        'Convert percentages to decimals before plugging in.',
        'Interpret the answer in problem context — check it makes sense.',
        'Verify in both original (worded) constraints.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
