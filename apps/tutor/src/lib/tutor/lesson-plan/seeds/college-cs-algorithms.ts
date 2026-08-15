/**
 * College Intro — Algorithms.
 *
 * Sorting, searching, divide-and-conquer, dynamic programming intro.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_CS_ALGORITHMS: LessonPlan = {
  id: 'evelyn.college.algorithms.v1',
  title: 'Algorithms — sorting, searching, divide-and-conquer, DP',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'cs',
  topic: 'algorithms',
  locale: 'en',
  los: [
    {
      id: 'college.algorithms',
      description: 'Analyze sorting and searching algorithms by Big-O; identify when divide-and-conquer or dynamic programming applies.',
      standard: 'COLLEGE-ALG',
    },
  ],
  prerequisites: ['college.dsa'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame algorithms as the difference between feasible and impossible.',
      script: 'Sort 10 items: any algorithm works. Sort 10 million items: bubble sort takes hours, merge sort takes seconds. Algorithms class teaches you to recognize WHICH problems have efficient solutions and to recognize the TECHNIQUES that produce them. Most efficient code is some variation of three or four ideas.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-techniques',
      kind: 'concept',
      goal: 'Sorting, binary search, divide-and-conquer, DP, greedy.',
      keyIdeas: [
        'BINARY SEARCH: O(log n) on sorted data. Each step halves the range.',
        'BUBBLE SORT: O(n²). MERGE SORT: O(n log n). QUICK SORT: O(n log n) avg, O(n²) worst.',
        'MERGE SORT idea (divide-and-conquer): split in half, sort each half recursively, merge sorted halves.',
        'DIVIDE-AND-CONQUER: split the problem, solve recursively, combine results. Works when splits don\'t share work.',
        'DYNAMIC PROGRAMMING (DP): when subproblems OVERLAP, cache results. Fibonacci recursive is O(2^n); with DP it\'s O(n).',
        'TWO DP styles: top-down (recursion + memoization) and bottom-up (iteration + table).',
        'GREEDY: pick the locally best choice each step. Works when greedy choice is provably optimal (e.g., interval scheduling, Dijkstra).',
        'COMPLEXITY classes: P (poly time), NP (poly time to verify), NP-hard (no known poly algorithm). 3-SAT and TSP are NP-hard.',
      ],
      vocabulary: [
        { term: 'divide-and-conquer', definition: 'split → solve subproblems → combine. Merge sort, quick sort, FFT.' },
        { term: 'dynamic programming', definition: 'cache subproblem results to avoid redundant recomputation.' },
        { term: 'greedy', definition: 'pick the locally best option each step; works only when optimal substructure holds.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mergesort',
      kind: 'worked_example',
      problem: 'Sort [38, 27, 43, 3] using merge sort.',
      steps: [
        'Split: [38, 27] and [43, 3].',
        'Recurse left: [38, 27] → [38] [27] → merge: [27, 38].',
        'Recurse right: [43, 3] → [43] [3] → merge: [3, 43].',
        'Merge [27, 38] + [3, 43]: compare front of each, pick smaller, repeat.',
        '3 < 27 → take 3. 27 < 43 → take 27. 38 < 43 → take 38. 43 left. Result: [3, 27, 38, 43].',
        'O(n log n): n = 4 elements, log₂(4) = 2 levels of recursion, n work per level.',
      ],
      answer: '[3, 27, 38, 43]',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Naive recursive Fibonacci is O(2^n). Why does memoization make it O(n)?',
      expectedAnswer: 'each subproblem fib(k) is computed once, cached, reused — n unique subproblems instead of exponentially many redundant ones',
      responseFormat: 'free',
      hints: [
        'Without caching, fib(5) calls fib(4) and fib(3); fib(4) again calls fib(3); etc.',
        'How many DISTINCT calls are there? Each distinct call costs O(1) given cached subresults.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-greedy-always',
      kind: 'misconception_check',
      question: 'A student says: "Greedy is always faster than DP, so always use greedy." Why is that dangerous?',
      commonErrors: [
        {
          answer: 'because faster',
          misconception: 'Confusing speed with correctness.',
          correctsTo: 'Greedy is faster but only correct when the problem has the GREEDY-CHOICE PROPERTY: locally optimal → globally optimal. For most problems this isn\'t true. Coin change with arbitrary denominations is the classic counterexample: greedy takes the largest coin first; DP gives the optimal solution. Use greedy ONLY when you can PROVE the greedy choice is safe.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Binary search: O(log n) on sorted data.',
        'Merge sort, quicksort: O(n log n) — practical sort speed.',
        'Divide-and-conquer: split, solve, combine.',
        'DP: cache overlapping subproblems.',
        'Greedy: locally best, only when provably optimal.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does P vs NP matter beyond theory?',
      hint: 'If P = NP (no proof either way after 50 years), every problem with a quickly-checkable solution would have a quickly-findable one. Cryptography (RSA assumes factoring is hard), optimization (TSP, scheduling), drug discovery — all rely on certain problems being intractable. A P=NP proof would shake every field that uses public-key crypto.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
