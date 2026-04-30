/**
 * GMAT — Quantitative Reasoning strategy.
 *
 * Problem solving and data sufficiency. The data sufficiency
 * format is unique to GMAT and worth extra prep.
 */

import type { LessonPlan } from '../types';

export const SEED_GMAT_QUANT_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.gmat.quant-strategy.v1',
  title: 'GMAT Quantitative: problem solving + data sufficiency',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'gmat.quant-strategy',
      description: 'Apply effective strategy to GMAT quant problem-solving and data-sufficiency questions.',
      standard: 'GMAT-QUANT',
    },
  ],
  prerequisites: ['ccss.math.hsa-rei.b.4'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Highlight data sufficiency as the GMAT-unique skill.',
      script: 'Most quant tests ask "what\'s the answer?" GMAT also asks "do you have ENOUGH information to find the answer?" Data sufficiency tests reasoning about information, not just calculation. It rewards a different skill.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format-tactics',
      kind: 'concept',
      goal: 'Format + DS scoring rules + tactics.',
      keyIdeas: [
        'FORMAT: ~31 questions in 62 minutes. Mixed problem-solving (PS) and data-sufficiency (DS).',
        'PROBLEM SOLVING: standard 5-choice multiple choice. Plug in answer choices when algebra is messy.',
        'DATA SUFFICIENCY: a question + two statements. Pick: A (statement 1 alone), B (statement 2 alone), C (both together), D (each alone), E (neither, even together).',
        'DS process: 1) read the question. 2) evaluate statement 1 alone — sufficient or not. 3) evaluate statement 2 alone — sufficient or not. 4) only combine if BOTH alone insufficient.',
        'KEY DS trap: you do not need to solve the problem — only determine if it CAN be solved. Many students burn time computing.',
        'COMMON DS trick: a statement looks like it gives info but actually doesn\'t (e.g., "x + y = 10" doesn\'t pin down x or y individually).',
        'TIME: ~2 min/question average. Easy questions and hard ones are worth equally — don\'t spend 4 minutes on one.',
        'CALCULATOR: NOT allowed in quant section. Mental math + scratchwork only.',
      ],
      vocabulary: [
        { term: 'data sufficiency', definition: 'a GMAT question type asking whether given statements are sufficient to answer.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ds',
      kind: 'worked_example',
      problem: 'DS: Is x > 0? (1) x² > 0. (2) x³ > 0.',
      steps: [
        'Question: is x > 0?',
        'Statement 1: x² > 0. True for any nonzero x — including negatives. So x could be 5 OR -5. Insufficient.',
        'Statement 2: x³ > 0. Cubes preserve sign. x³ > 0 means x > 0. Sufficient!',
        'Pick B (statement 2 alone is sufficient).',
        'Note: we never had to compute a value. We just decided about sufficiency.',
      ],
      answer: 'B',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In DS, when do you combine statements?',
      expectedAnswer: 'only when each statement alone is insufficient',
      responseFormat: 'free',
      hints: [
        'If either alone works, you don\'t need to combine.',
        'Combination is a fallback, not a default.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ds-solve',
      kind: 'misconception_check',
      question: 'In DS, do you need to fully solve the problem and find the answer?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating DS as a normal solve.',
          correctsTo: 'No — you only need to determine if the statements are SUFFICIENT to find the answer. Solving wastes time. Recognize sufficiency without computing the actual value.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PS: standard MC. DS: judge sufficiency, don\'t fully solve.',
        'DS process: each statement alone first; combine only if both alone insufficient.',
        'No calculator. Plan time.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does GMAT include DS? What real-world skill does it test?',
      hint: 'Business decision-making often hinges on whether you have enough information to act, not on the exact answer. DS tests that judgment.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
