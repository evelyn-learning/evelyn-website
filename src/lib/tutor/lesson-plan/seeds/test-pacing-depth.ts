/**
 * [TEST] Pacing v2 — pace-bias depth (ELA grades 6-8).
 *
 * Drives the brain-affirmation regex code path (no Wolfram for ELA).
 * Each segment has multiple short comprehension checks the brain
 * verifies through its own affirmation/correction language ("exactly",
 * "that's right" / "not quite", "let's check"). The streak counter
 * ticks up on each affirmation, building a verifiable Phase 1 signal
 * for non-math subjects.
 *
 * Phase 1 expectation: server log shows
 *   [pacing] streak-correct seg=try-grammar-1 count=1 → 2 → 3
 *   driven by brain-affirmation regex matches (no Wolfram involvement).
 *
 * Phase 3 will use this plan for pace-bias depth testing — a tester
 * clicks Slow down → brain shifts to slower, deeper teaching style;
 * Speed up → tighter explanations.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_PACING_DEPTH: LessonPlan = {
  id: 'evelyn.test.pacing.depth.v1',
  title: '[TEST] Pacing v2 — pace-bias depth (ELA)',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'ela',
  topic: 'grammar',
  locale: 'en',
  los: [
    {
      id: 'evelyn.test.pacing.parts-of-speech',
      description: 'Identify parts of speech in context — nouns, verbs, adjectives, adverbs.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the test plan: short comprehension checks where streak signal can build via brain-affirmation regex.',
      script: 'We\'ll go through several short identification questions about parts of speech. Quick one-word answers are fine.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-parts-of-speech',
      kind: 'concept',
      goal: 'Refresh the four most common parts of speech.',
      keyIdeas: [
        'NOUN: a person, place, thing, or idea (e.g., "river", "happiness").',
        'VERB: an action or state (e.g., "run", "is").',
        'ADJECTIVE: describes a noun (e.g., "tall", "blue").',
        'ADVERB: modifies a verb, adjective, or other adverb — often ends in -ly (e.g., "quickly", "very").',
      ],
      vocabulary: [
        { term: 'noun', definition: 'a word for a person, place, thing, or idea.' },
        { term: 'verb', definition: 'a word for an action or state.' },
        { term: 'adjective', definition: 'a word that describes a noun.' },
        { term: 'adverb', definition: 'a word that modifies a verb, adjective, or another adverb.' },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-grammar-1',
      kind: 'try_yourself',
      problem: 'In the sentence "The dog ran quickly across the yard," which word is the adverb?',
      expectedAnswer: 'quickly',
      responseFormat: 'free',
      hints: ['An adverb modifies a verb.', 'Look for a word that tells HOW the dog ran.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-grammar-2',
      kind: 'try_yourself',
      problem: 'In "A loud crash startled the cat," which word is the adjective?',
      expectedAnswer: 'loud',
      responseFormat: 'free',
      hints: ['An adjective describes a noun.', 'Which word tells WHAT KIND OF crash?'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-grammar-3',
      kind: 'try_yourself',
      problem: 'In "She wrote a letter yesterday," which word is the verb?',
      expectedAnswer: 'wrote',
      responseFormat: 'free',
      hints: ['A verb is the action word.', 'What did she DO?'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-grammar-4',
      kind: 'try_yourself',
      problem: 'In "The teacher praised the student warmly," which word is the adverb?',
      expectedAnswer: 'warmly',
      responseFormat: 'free',
      hints: ['Look for the -ly ending — a clue (not a guarantee) for adverbs.', 'How did the teacher praise?'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-grammar-5',
      kind: 'try_yourself',
      problem: 'In "Curiosity is a powerful feeling," which word is a noun (besides "feeling")?',
      expectedAnswer: 'curiosity',
      responseFormat: 'free',
      hints: ['Nouns include IDEAS, not just objects.', 'Which word names an idea or quality?'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-grammar-6',
      kind: 'try_yourself',
      problem: 'In "The bright stars twinkled above," which word is the adjective?',
      expectedAnswer: 'bright',
      responseFormat: 'free',
      hints: ['Which word describes "stars"?'],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Noun = person/place/thing/idea.',
        'Verb = action or state.',
        'Adjective = describes a noun.',
        'Adverb = modifies a verb (or adjective/other adverb).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
