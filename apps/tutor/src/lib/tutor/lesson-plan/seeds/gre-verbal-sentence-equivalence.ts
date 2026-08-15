/**
 * GRE Verbal — Sentence Equivalence.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_VERBAL_SENTENCE_EQUIVALENCE: LessonPlan = {
  id: 'evelyn.testprep.gre.verbal.sentence-equiv.v1',
  title: 'GRE Verbal — Sentence Equivalence',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gre-verbal',
  locale: 'en',
  los: [
    {
      id: 'testprep.gre.verbal.sentence-equiv',
      description: 'Drill GRE Sentence Equivalence: choose the TWO words that complete the sentence with the same meaning.',
      standard: 'GRE-VERBAL',
    },
  ],
  prerequisites: ['testprep.gre.verbal.text-completion'],
  followUps: ['testprep.gre.verbal.reading-comp'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Sentence Equivalence is text completion + a synonym test rolled together — and partial credit doesn\'t exist.',
      script: 'You pick TWO of six words that BOTH (a) complete the sentence sensibly AND (b) produce sentences with EQUIVALENT meaning. Get one right? Zero credit. The trick: predict, then look for synonym pairs in the choices.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sentence-equiv',
      kind: 'concept',
      goal: 'Procedure, finding synonym pairs, traps.',
      keyIdeas: [
        'PROCEDURE:',
        '  1. Read the sentence.',
        '  2. Identify trigger words and predict the blank in your own words.',
        '  3. Scan answer choices for two that MATCH your prediction AND mean roughly the same as each other.',
        '  4. Plug both into the sentence to verify both produce sensible, equivalent meanings.',
        'KEY DIFFERENCE from Text Completion: you must find a SYNONYM PAIR among the choices.',
        'STRATEGY: scan for synonym pairs first IF you don\'t have a strong prediction. Two words that mean the same thing are often the answer (as long as they fit the blank).',
        'COMMON TRAP STRUCTURE:',
        '  Two synonyms exist but don\'t fit the sentence — distractor pair.',
        '  Two synonyms exist that fit the BLANK but differ in CONNOTATION (positive/negative).',
        '  An ALMOST-synonym pair where one word is slightly off in meaning.',
        '  The CORRECT pair is sometimes less obvious than a tempting wrong pair.',
        'NO PARTIAL CREDIT — you need both right or neither.',
      ],
      vocabulary: [
        { term: 'synonym pair', definition: 'two words with similar meaning; in Sentence Equivalence, the goal is to find the pair that ALSO fits the sentence sensibly.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'The lecturer\'s _____ presentation lost the audience\'s attention within minutes. Choices: (A) tedious (B) eloquent (C) prolix (D) succinct (E) terse (F) inspiring.',
      steps: [
        'Trigger: "lost the audience\'s attention" — implies a NEGATIVE quality.',
        'Predict: long, boring, dull.',
        'Scan for synonym pairs:',
        '  (A) tedious + (C) prolix = both mean "boringly long-winded." MATCH.',
        '  (D) succinct + (E) terse = both mean "brief" — but a brief presentation wouldn\'t lose attention; this is the wrong direction.',
        '  (B) eloquent + (F) inspiring = positive — wrong direction.',
        'Answer: (A) and (C). Both produce: "tedious/prolix presentation lost the audience\'s attention" — sensible and equivalent.',
      ],
      answer: '(A) tedious AND (C) prolix',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Despite his _____ political views, the diplomat was known for his ability to find common ground. Choices: (A) extreme (B) entrenched (C) flexible (D) pragmatic (E) adamant (F) yielding.',
      expectedAnswer: '(A) extreme + (E) adamant. Both mean "rigid/strong" — fits "Despite" contrast with "find common ground." (B) entrenched is close but more about being fixed in position; A and E are stronger pair. (C, D, F) all suggest flexibility — wrong direction.',
      responseFormat: 'free',
      hints: [
        '"Despite" signals contrast with "common ground" (compromise).',
        'The blank should describe RIGID views.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-just-fit',
      kind: 'misconception_check',
      question: 'A student picks two words that BOTH fit the blank but mean different things. Why is this a wrong answer?',
      commonErrors: [
        {
          answer: 'Picks two words that fit but mean differently',
          misconception: 'Forgetting the second criterion: the two completed sentences must have EQUIVALENT meaning.',
          correctsTo: 'GRE Sentence Equivalence requires BOTH (a) sensible completion AND (b) equivalent meaning across the two completions. If one word means "annoyed" and the other means "delighted," even if both could grammatically fit, the sentences mean different things — not equivalent. Always check: do my two chosen words produce roughly the same sentence?',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Predict in plain English first.',
        'Find a SYNONYM PAIR that fits the prediction.',
        'Verify both completed sentences mean the same.',
        'No partial credit — both must be right.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
