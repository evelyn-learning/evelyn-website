/**
 * AP CSA — Recursion.
 *
 * Recursive methods, base case + recursive case, tracing, common patterns.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSA_RECURSION: LessonPlan = {
  id: 'evelyn.ap.csa.recursion.v1',
  title: 'Recursion in Java',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'cs',
  topic: 'computer science',
  locale: 'en',
  los: [
    {
      id: 'apcsa.recursion',
      description: 'Trace and write recursive methods that solve problems by reducing them to smaller subproblems.',
      standard: 'AP-CSA-10',
    },
  ],
  prerequisites: ['apcsa.methods', 'apcsa.control-flow'],
  followUps: ['apcsa.sorting'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Recursion as solving by self-reference.',
      script: 'Imagine asking the person behind you in line for the total number of people in line. They ask the person behind them. Eventually you reach the last person — they answer 1. Each person adds 1 and passes it back. That\'s recursion: solve by delegating to a smaller version of yourself, until you hit a case so small you can answer directly.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-anatomy',
      kind: 'concept',
      goal: 'Base case + recursive case structure.',
      keyIdeas: [
        'Every recursive method has TWO parts: a BASE CASE (no recursion, returns directly) and a RECURSIVE CASE (calls itself with a smaller / simpler argument).',
        'Without a base case → infinite recursion → StackOverflowError. The recursive call must always shrink toward the base case.',
        'CALL STACK: each recursive call adds a frame. Java pops them off as each return resolves. Pictures help — draw the stack on paper.',
        'CLASSIC PATTERNS: factorial (n! = n · (n−1)!, base 0! = 1). Fibonacci. Sum of array. Reversing a string. Tree traversal.',
        'TAIL RECURSION (recursive call is the LAST statement) is conceptually cleanest — Java doesn\'t optimize it, but the structure is easy to convert to iteration mentally.',
        'AP CSA TIP: practice TRACING. Given a method, plug in arguments by hand and follow the calls. Most exam questions test tracing, not writing.',
      ],
      vocabulary: [
        { term: 'base case', definition: 'the simplest input handled directly without further recursion.' },
        { term: 'call stack', definition: 'the runtime stack of method invocations awaiting return.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-factorial',
      kind: 'worked_example',
      problem: 'Write factorial(n) recursively, then trace factorial(4).',
      steps: [
        'Method: public static int factorial(int n) { if (n <= 1) return 1; return n * factorial(n − 1); }',
        'Base case: n <= 1 returns 1.',
        'Recursive case: n * factorial(n−1).',
        'Trace factorial(4): calls 4 * factorial(3) → 4 * 3 * factorial(2) → 4 * 3 * 2 * factorial(1).',
        'factorial(1) hits base case → returns 1. Stack unwinds: 2*1 = 2 → 3*2 = 6 → 4*6 = 24.',
        'Final answer: factorial(4) = 24.',
      ],
      answer: '24 (with the trace stack 4 → 3 → 2 → 1 → unwind)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Trace this method: int mystery(int n) { if (n == 0) return 0; return n + mystery(n − 1); } What does mystery(5) return?',
      expectedAnswer: '15',
      responseFormat: 'numeric',
      hints: [
        'Sum: 5 + mystery(4) = 5 + 4 + mystery(3) = ...',
        'It computes 5+4+3+2+1+0.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-base-case',
      kind: 'misconception_check',
      question: 'A recursive method has the recursive call \"return n + recurse(n);\" (no decrement). What happens when you call it with n = 5?',
      commonErrors: [
        {
          answer: 'returns 5+5+5+5+... infinitely',
          misconception: 'Thinking the program just \"keeps adding\".',
          correctsTo: 'StackOverflowError. The recursive call doesn\'t shrink the argument, so the base case is never reached. Each call piles a frame on the stack until Java\'s stack is exhausted (~10,000 frames). The KEY rule of recursion: the recursive call MUST move toward the base case.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Recursion = base case + recursive case that shrinks.',
        'Missing base case OR non-shrinking recursive call → StackOverflowError.',
        'Trace by hand: write the call stack, unwind on return.',
        'Tracing is the bulk of CSA exam recursion questions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is naive recursive Fibonacci so slow? What\'s the time complexity?',
      hint: 'Each call makes TWO recursive calls — call tree is exponential. T(n) = T(n−1) + T(n−2) ≈ 1.6^n. Fixed by memoization or iteration. AP doesn\'t require Big-O but the intuition matters.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
