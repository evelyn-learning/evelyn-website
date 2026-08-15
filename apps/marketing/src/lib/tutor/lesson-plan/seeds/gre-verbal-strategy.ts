/**
 * GRE — Verbal Reasoning strategy.
 *
 * Three question types: text completion, sentence equivalence,
 * reading comprehension. Strategy + vocab approach.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_VERBAL_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.gre.verbal-strategy.v1',
  title: 'GRE Verbal Reasoning strategy',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'test-prep',
  topic: 'gre-verbal',
  locale: 'en',
  los: [
    {
      id: 'gre.verbal-strategy',
      description: 'Apply effective strategy to GRE verbal section across three question types.',
      standard: 'GRE-VERBAL',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame GRE verbal as vocab-heavy + dense reading.',
      script: 'GRE verbal rewards a strong vocabulary and the ability to read dense academic prose quickly. Three question types, one underlying skill: precise reading.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-types',
      kind: 'concept',
      goal: 'Three question types, time per question, strategy for each.',
      keyIdeas: [
        'FORMAT: 2 verbal sections, ~27 questions each, ~41 minutes per section. ~1.5 min/question.',
        'TEXT COMPLETION: 1-3 blanks. Pick the word(s) that best complete the meaning. Strategy: predict the meaning before looking at choices, then match.',
        'SENTENCE EQUIVALENCE: one sentence with a single blank, six choices, pick TWO that produce equivalent meaning. Both your picks must yield the same overall sentence meaning.',
        'READING COMPREHENSION: short and long passages. Question types: main idea, inference, function, detail, vocabulary-in-context. Read the passage with active goals; refer back for specifics.',
        'VOCABULARY: GRE words tend toward formal academic register. Do NOT memorize 5,000 random words — focus on high-frequency lists and learn words in context.',
        'STRATEGY: predict-then-match for completion items. Eliminate aggressively in MC. For RC, do NOT trust your memory — verify against the passage.',
        'Common traps: a choice that\'s technically true but doesn\'t answer the asked question; a choice with the right vibe but the wrong scope.',
      ],
      vocabulary: [
        { term: 'text completion', definition: 'a GRE question type with one to three blanks to fill.' },
        { term: 'sentence equivalence', definition: 'a GRE question requiring two choices that yield equivalent sentence meaning.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-tc',
      kind: 'worked_example',
      problem: 'Strategy walk-through for a text completion: "The senator\'s speech was ___; he avoided every controversial topic and offered no specific proposals."',
      steps: [
        'Predict from context: the speech avoided controversy and was unspecific. Predict a word like "vague" or "evasive".',
        'Now look at choices. Pick the one closest to your prediction.',
        'Verify by plugging back in: does the sentence make sense?',
        'If two choices feel close, look for the more PRECISE meaning, not just the closest synonym.',
      ],
      answer: 'predict first, then match',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In sentence equivalence, why do you need TWO choices, not one?',
      expectedAnswer: 'both must yield equivalent overall meaning when plugged in; ensures right meaning rather than synonymous-sounding word',
      responseFormat: 'free',
      hints: [
        'The format protects against words that sound similar but mean different things.',
        'If only one choice fits, you might have the wrong meaning entirely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vocab-only',
      kind: 'misconception_check',
      question: 'Is GRE verbal mostly about knowing more vocabulary?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating GRE verbal as a vocabulary test.',
          correctsTo: 'Vocabulary helps a lot — but READING the passage carefully, predicting meaning from context, and avoiding traps matter just as much. Many students with strong vocab still miss verbal questions because they rush the reading.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three question types: text completion, sentence equivalence, RC.',
        'Predict the meaning before looking at choices.',
        'Sentence equivalence requires TWO choices yielding equivalent overall meaning.',
        'Verify RC answers against the passage — don\'t trust memory.',
        'Reading carefully matters as much as vocabulary.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the predict-then-match strategy more reliable than reading all five choices first?',
      hint: 'When you read choices first, the test-makers\' distractors anchor your thinking. Predicting forces you to engage the sentence on its own terms before being influenced by traps.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
