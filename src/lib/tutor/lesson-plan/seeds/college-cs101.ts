/**
 * College Intro CS101 — first programming course (Python/Java).
 *
 * Functions, recursion, complexity, problem-solving mindset.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_CS101: LessonPlan = {
  id: 'evelyn.college.cs101.v1',
  title: 'CS101 — functions, recursion, problem decomposition',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'cs',
  topic: 'cs101',
  locale: 'en',
  los: [
    {
      id: 'college.cs101',
      description: 'Decompose problems into functions, write simple recursive solutions, and reason about correctness.',
      standard: 'COLLEGE-CS101',
    },
  ],
  prerequisites: ['cs910.python'],
  followUps: ['college.dsa', 'college.algorithms'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame CS101 as learning to think in steps, not learning a language.',
      script: 'Most CS101 students think the course is about Python or Java. It isn\'t. It\'s about learning to break a problem into pieces small enough that you can KNOW each piece works. The language is a tool. The skill is decomposition + recursion + reasoning about correctness.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-decompose',
      kind: 'concept',
      goal: 'Function decomposition + recursion + base case + inductive thinking.',
      keyIdeas: [
        'A FUNCTION should do ONE thing. If you can\'t describe what it does in one sentence, split it.',
        'COMPOSITION: build big functions from small ones. average(scores) is sum(scores) / len(scores).',
        'RECURSION: a function that calls itself with a smaller version of the problem.',
        'Every recursion needs (a) a BASE CASE that returns directly, and (b) a RECURSIVE CASE that does less work.',
        'Without a base case, you get infinite recursion → stack overflow.',
        'Examples of natural recursion: factorial, fibonacci, tree traversal, file system walk.',
        'Iteration vs recursion: any recursion can be rewritten as iteration with an explicit stack. Some problems FEEL recursive; use that intuition.',
        'CORRECTNESS: argue your recursion is right by induction. Base case correct + assuming smaller cases are right, the recursive case combines them correctly.',
      ],
      vocabulary: [
        { term: 'recursion', definition: 'a function defined in terms of itself, with a base case to terminate.' },
        { term: 'base case', definition: 'the smallest input the recursion handles directly without recursing further.' },
        { term: 'decomposition', definition: 'breaking a problem into smaller named subproblems.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-factorial',
      kind: 'worked_example',
      problem: 'Write factorial(n) recursively.',
      steps: [
        'def factorial(n):',
        '    if n <= 1: return 1   # base case',
        '    return n * factorial(n - 1)   # recursive case',
        '',
        'factorial(5) = 5 * factorial(4) = 5 * 4 * factorial(3) = ... = 5 * 4 * 3 * 2 * 1 = 120',
        '// Inductive argument: factorial(1) = 1 ✓. Assuming factorial(n-1) is correct, n * (n-1)! = n! ✓.',
      ],
      answer: '120 for n=5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Without a base case, what happens when factorial(5) runs?',
      expectedAnswer: 'infinite recursion → RecursionError / stack overflow',
      responseFormat: 'free',
      hints: [
        'Each recursive call adds a stack frame.',
        'The OS gives you a finite call stack.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-recursion-slow',
      kind: 'misconception_check',
      question: 'A student says: "Recursion is always slower than iteration; avoid it." When is this wrong?',
      commonErrors: [
        {
          answer: 'always',
          misconception: 'Treating recursion as a performance problem.',
          correctsTo: 'For naturally recursive structures (trees, graphs, divide-and-conquer like merge sort or quicksort), recursion is CLEARER and often the same speed or faster than the iterative equivalent. Yes, function-call overhead is real, but reading time matters more than call overhead in 95% of code. Use recursion when the problem is recursive; use iteration when it isn\'t.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Functions do ONE thing; compose for bigger.',
        'Recursion: base case + smaller call.',
        'Without base case → stack overflow.',
        'Reason about correctness inductively.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'TAIL recursion (recursive call is the last thing the function does) can be optimized to iteration by the compiler. Why does Python NOT do this?',
      hint: 'Python keeps full stack frames so debuggers can show recursion. Languages used for systems work (Scheme, Haskell, OCaml) optimize tail calls because losing performance there matters more than getting pretty stack traces.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
