/**
 * Grades K-2 ELA — Sentence Structure (Subject + Predicate).
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_SENTENCE_STRUCTURE: LessonPlan = {
  id: 'evelyn.k2.ela.sentence-structure.v1',
  title: 'K-2 ELA — Sentence Structure',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.sentence-structure',
      description: 'Recognise that a complete sentence has a subject (who/what) and a predicate (what they do); write simple complete sentences.',
      standard: 'CCSS.ELA-LITERACY.L.1.1',
    },
  ],
  prerequisites: [],
  followUps: ['k2.ela.story-elements'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A complete sentence has TWO important parts — a doer and an action. Once you know the recipe, you can write sentences forever.',
      script: '"The dog runs." Two simple parts: "the dog" (the doer) and "runs" (what the doer does). Together, they make a complete idea. Today we learn the recipe.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-sentence',
      kind: 'concept',
      goal: 'Subject + predicate + complete sentences vs fragments.',
      keyIdeas: [
        'SENTENCE: a complete idea. It tells WHO/WHAT and WHAT they do (or are).',
        'SUBJECT: who or what the sentence is about. The DOER. "The cat", "Maya", "The bus".',
        'PREDICATE: what the subject DOES or IS. The ACTION (or being). "ran", "is happy", "ate cookies".',
        'TWO TESTS: 1) Does it have a who/what? 2) Does it have an action or being? If yes to both = complete sentence.',
        'CAPITAL letter at the start. PUNCTUATION at the end (period, question mark, exclamation point).',
        'FRAGMENT: not a complete sentence. Missing the subject OR the action. "The big dog." (no action) or "Ran fast." (no subject).',
        'KIDS BUILD: subject + predicate. "Mom drives." "Birds sing." "I am hungry."',
        'PRACTICE: combine subjects with predicates. SUBJECTS: dogs, cats, my friend, the teacher. PREDICATES: run fast, are happy, jump high, sleep.',
      ],
      vocabulary: [
        { term: 'sentence', definition: 'a complete idea telling who/what and what they do.' },
        { term: 'subject', definition: 'the who or what the sentence is about — the doer.' },
        { term: 'predicate', definition: 'what the subject does or is — the action.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-build',
      kind: 'worked_example',
      problem: 'Build a complete sentence: combine the subject "the puppy" with the predicate "barks loudly".',
      steps: [
        'Subject: "the puppy" (the doer).',
        'Predicate: "barks loudly" (what the puppy does).',
        'Combine: "The puppy barks loudly."',
        'CHECK: Capital letter at start ✓. End mark ✓ (period). Has subject ✓. Has predicate ✓. COMPLETE SENTENCE.',
      ],
      answer: '"The puppy barks loudly."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is "Cooked dinner" a complete sentence? Why or why not?',
      expectedAnswer: 'No. It\'s missing the SUBJECT (who cooked dinner?). Add a subject: "Mom cooked dinner."',
      responseFormat: 'free',
      hints: [
        'Does it tell who?',
        'It tells the action, but who did the action?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fragment',
      kind: 'misconception_check',
      question: 'Is "The little brown bunny." a complete sentence?',
      commonErrors: [
        {
          answer: 'Yes — it has a subject',
          misconception: 'Thinking having a subject is enough.',
          correctsTo: 'No — this is a FRAGMENT. It tells WHO ("the little brown bunny") but not what the bunny does or is. To make it complete: "The little brown bunny hops fast." or "The little brown bunny is fluffy." Subject AND predicate are both required.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sentence = complete idea.',
        'Has SUBJECT (who/what) and PREDICATE (action).',
        'Capital letter at start. End punctuation.',
        'Fragment = missing subject OR predicate.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Can a sentence have more than one subject?',
      hint: 'Yes. "Mom AND Dad cook dinner." — two subjects (Mom, Dad), one predicate. They share the action. This is called a COMPOUND SUBJECT. Same idea with predicates: "I run AND jump." (Compound predicate.) Sentences can have multiple subjects, multiple predicates, or both.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
