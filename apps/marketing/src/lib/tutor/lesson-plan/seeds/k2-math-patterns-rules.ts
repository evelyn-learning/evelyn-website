/**
 * K-2 Math — Patterns: Repeating and Growing.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_MATH_PATTERNS_RULES: LessonPlan = {
  id: 'evelyn.k2.math.patterns-rules.v1',
  title: 'K-2 Math — Patterns: Repeating and Growing',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'math',
  topic: 'shapes-patterns',
  locale: 'en',
  los: [{ id: 'k2.math.patterns-rules', description: 'Identify, extend, and describe repeating and growing patterns.', standard: 'CCSS.MATH.CONTENT.K.OA.A / 2.OA.C' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Patterns are how we predict what\'s next — in math, music, and life.', script: 'Look at the wall. Stripes? That\'s a pattern. Listen to a song. The chorus repeats? That\'s a pattern too. Today: how to spot a pattern, name its rule, and figure out what comes next.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Repeating vs growing patterns, finding the rule, extending.', keyIdeas: [
      'A PATTERN is something that repeats or grows by a RULE.',
      'REPEATING pattern: a UNIT repeats over and over.',
      '  ABABAB: unit is "AB."',
      '  Red-Blue-Red-Blue: unit is "Red-Blue."',
      '  ABCABCABC: unit is "ABC."',
      'To EXTEND a repeating pattern: find the unit, then keep going.',
      'GROWING pattern: each step gets bigger by a rule.',
      '  1, 3, 5, 7, ...: rule is "add 2."',
      '  2, 4, 8, 16, ...: rule is "double" (multiply by 2).',
      '  1, 4, 9, 16, ...: rule is "square numbers" (1², 2², 3², 4²).',
      'To CONTINUE a growing pattern: find the rule, apply it.',
      'Patterns are NOT random — they always follow a rule. Your job: find the rule.',
    ], vocabulary: [{ term: 'pattern', definition: 'something that repeats or grows by a rule.' }, { term: 'rule', definition: 'the formula or principle that tells you what comes next in a pattern.' }], estimatedMinutes: 4 },
    { id: 'worked', kind: 'worked_example', problem: 'What comes next: 5, 10, 15, 20, ___?', steps: [
      'Find the rule. From 5 to 10 is +5. From 10 to 15 is +5. From 15 to 20 is +5.',
      'Rule: ADD 5 each time.',
      'Apply to 20: 20 + 5 = 25.',
      'Answer: 25. (You can keep going: 30, 35, 40...)',
    ], answer: '25 (rule: +5 each step)', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'What comes next: square, circle, triangle, square, circle, triangle, ___?', expectedAnswer: 'Find the unit: "square, circle, triangle" — three shapes. After "triangle" the unit restarts. So next is SQUARE.', responseFormat: 'free', hints: ['Find the repeating unit (which group of items is repeating?).', 'After the unit ends, it starts again.'], estimatedMinutes: 3 },
    { id: 'misconception-rule', kind: 'misconception_check', question: 'A student sees 2, 4, 6, 10 and assumes the rule is "+2." What\'s wrong?', commonErrors: [{ answer: 'Assumes +2 from first two terms', misconception: 'Checking only one or two steps to find the rule.', correctsTo: 'Always check MULTIPLE steps to confirm the rule. Here: 2 → 4 is +2. 4 → 6 is +2. But 6 → 10 is +4. The rule isn\'t simply "+2." Maybe the pattern is "+2, +2, +4, +4, ...?" Or maybe it\'s skip-counting differently. Check at least 3 steps before committing to a rule.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Repeating pattern: find the unit; it repeats.', 'Growing pattern: find the rule (add, multiply, etc.).', 'Always check 3+ steps to confirm a rule.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
