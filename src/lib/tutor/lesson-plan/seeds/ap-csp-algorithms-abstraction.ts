/**
 * AP Computer Science Principles — Algorithms and abstraction.
 *
 * What an algorithm is, sequencing/selection/iteration, abstraction
 * as the core CS skill, efficiency intuition.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSP_ALGORITHMS_ABSTRACTION: LessonPlan = {
  id: 'evelyn.ap.csp.algorithms-abstraction.v1',
  title: 'Algorithms and abstraction',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-principles',
  locale: 'en',
  los: [
    {
      id: 'apcsp.algorithms',
      description: 'Describe how algorithms work and how abstraction simplifies complexity.',
      standard: 'AP-CSP-AAP-2',
    },
  ],
  prerequisites: ['apcsp.data'],
  followUps: [],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A recipe is an algorithm.',
      script: 'Open a cookbook. The recipe IS an algorithm — a precise sequence of steps that produces a result. Computer science is about writing recipes for COMPUTERS to follow. Same idea, more rigor.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-pillars',
      kind: 'concept',
      goal: 'Algorithm building blocks + abstraction + complexity intuition.',
      keyIdeas: [
        'ALGORITHM: a finite, well-defined sequence of steps that takes input and produces output.',
        'THREE BUILDING BLOCKS:',
        '  SEQUENCE: do step A, then B, then C.',
        '  SELECTION (if/else): if condition, do A; otherwise, do B.',
        '  ITERATION (loops): repeat A while/until condition.',
        'Any algorithm can be expressed using just these three. (Structured-programming theorem.)',
        'ABSTRACTION: hiding details to manage complexity. Driving a car: you use a steering wheel without knowing how the engine works. Programming: you call PRINT without knowing how pixels light up. Levels of abstraction stack: hardware → operating system → applications.',
        'ABSTRACTION enables: REUSE (write a function once, use it many times), modularity (separate concerns), simplicity (only deal with what you need).',
        'EFFICIENCY: how does runtime grow as input grows? CONSTANT (same time always). LINEAR (doubles with input). QUADRATIC (squares — bad for big input). LOGARITHMIC (good — barely grows).',
        'Big-O notation captures this: O(1), O(n), O(n²), O(log n).',
        'BAD ALGORITHM on big data is unusable. Good algorithm matters more than fast hardware as data grows.',
      ],
      vocabulary: [
        { term: 'algorithm', definition: 'a finite, well-defined sequence of steps to solve a problem.' },
        { term: 'abstraction', definition: 'hiding implementation details to manage complexity.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-search',
      kind: 'worked_example',
      problem: 'Compare two ways to find a name in a phone book of 1 million entries: linear search (start at A, check each) vs binary search (open to middle, narrow each step).',
      steps: [
        'LINEAR: worst case checks all 1,000,000 entries. O(n) — linear time.',
        'BINARY: each step halves the remaining list. 1M → 500K → 250K → … → 1.',
        'How many halvings? log₂(1,000,000) ≈ 20. O(log n) — logarithmic time.',
        'Linear: 1,000,000 steps. Binary: 20 steps. Binary is 50,000× faster on this data.',
        'Same answer, vastly better algorithm. This is why algorithm choice matters more than hardware speed.',
      ],
      answer: 'linear: O(n) ≈ 1M steps; binary: O(log n) ≈ 20 steps',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does abstraction make programs EASIER to maintain over time?',
      expectedAnswer: 'changes to internals (hidden behind abstraction) don\'t require changes to all callers',
      responseFormat: 'free',
      hints: [
        'You only need to update the inside of the abstraction.',
        'Code that USES the abstraction doesn\'t care about how it works.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-faster-cpu',
      kind: 'misconception_check',
      question: 'Will a faster CPU always make a slow algorithm acceptable?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Hardware can compensate for any algorithm.',
          correctsTo: 'No — for an O(n²) algorithm on a billion items, even a 100× faster CPU still takes far too long. Algorithm complexity dominates as data grows. A linear algorithm on a slow CPU beats a quadratic one on a supercomputer for big data.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Algorithm: sequence + selection + iteration.',
        'Abstraction: hide details, manage complexity, enable reuse.',
        'Efficiency matters: O(log n) vs O(n) vs O(n²) — huge differences as data grows.',
        'Algorithm choice often beats hardware upgrade.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Google has to search billions of web pages in milliseconds. Why is algorithm efficiency essential to their existence?',
      hint: 'Linear search through billions of pages would take hours. Google indexes content into reverse-lookup structures so a search becomes O(log n) or even O(1) per query. Without this, the search-engine business is impossible.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
