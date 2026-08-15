/**
 * IB DP Math AA — Binomial Theorem.
 * Pascal's triangle, nCr notation, expansion of (a + b)^n, finding
 * specific terms.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_BINOMIAL_THEOREM: LessonPlan = {
  id: 'evelyn.ibdp.aa.binomial-theorem.v1',
  title: 'IB DP Math AA — Binomial Theorem',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.binomial-theorem',
      description: 'Expand (a + b)^n using nCr notation; identify and compute the coefficient of a specific term in an expansion.',
      standard: 'IB-DP-MATH-AA-1.9',
    },
  ],
  prerequisites: ['ibdp.aa.exp-logs'],
  followUps: ['ibdp.aa.functions-inverses'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The binomial theorem turns a "find the coefficient of x⁵ in (2 + 3x)¹²" problem from impossible to one-line.',
      script: 'Without the theorem, expanding (2 + 3x)¹² by hand would take an hour. With it, you write down a single term using nCr and the answer drops out. Today we drill the formula plus a critical IB exam pattern: extracting just one specific term.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-binomial',
      kind: 'concept',
      goal: 'nCr formula, the binomial theorem statement, single-term extraction.',
      keyIdeas: [
        'BINOMIAL COEFFICIENT: nCr (also written as "n choose r" or C(n, r)) = n! / [r!(n − r)!]. Counts ways to choose r objects from n.',
        'PASCAL\'S TRIANGLE: each row gives nCr for r = 0, 1, …, n. Each entry = sum of two above. Symmetric: nCr = nC(n−r).',
        'BINOMIAL THEOREM: (a + b)^n = Σ from r=0 to n of nCr · a^(n−r) · b^r.',
        'GENERAL TERM (often examined): T_(r+1) = nCr · a^(n−r) · b^r. The (r+1)-th term — IB papers often phrase as "find the term containing x⁵".',
        'HOW TO FIND A SPECIFIC TERM: set the exponent of the variable equal to the target, solve for r, plug back into the general term.',
        'COEFFICIENT vs TERM: term includes the variable (e.g. 60x⁵); coefficient is just the number (60).',
        'CONSTANT TERM: occurs when the variable\'s exponent is zero. Solve "n − r times power of x in a, plus r times power of x in b, equals zero" for r.',
        'FACTORIAL ARITHMETIC: 5! = 120; 0! = 1 (by convention).',
      ],
      vocabulary: [
        { term: 'binomial coefficient', definition: 'nCr = n!/[r!(n−r)!]; counts subsets of size r in a set of size n.' },
        { term: 'general term', definition: 'T_(r+1) = nCr · a^(n−r) · b^r — the formula for the (r+1)-th term in an expansion.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-specific-term',
      kind: 'worked_example',
      problem: 'Find the term containing x⁴ in the expansion of (2 + 3x)⁹.',
      steps: [
        'General term: T_(r+1) = 9Cr · 2^(9−r) · (3x)^r.',
        'We want the power of x to be 4. The x comes from (3x)^r = 3^r · x^r. Set r = 4.',
        'T_5 = 9C4 · 2^5 · 3^4 · x^4.',
        'Compute: 9C4 = 9!/(4!·5!) = 126. 2^5 = 32. 3^4 = 81.',
        'Coefficient = 126 · 32 · 81 = 126 · 2592 = 326 592.',
        'Term: 326 592 · x⁴.',
      ],
      answer: '326 592 x⁴',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the constant term in the expansion of (x + 2/x)⁶.',
      expectedAnswer: '160',
      responseFormat: 'numeric',
      hints: [
        'General term: T_(r+1) = 6Cr · x^(6−r) · (2/x)^r = 6Cr · 2^r · x^(6−2r).',
        'Constant term means power of x is 0. Set 6 − 2r = 0 → r = 3.',
        'T_4 = 6C3 · 2³ = 20 · 8.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-coefficient',
      kind: 'misconception_check',
      question: 'A student wants the coefficient of x³ in (1 + 2x)⁵. They write 5C3 = 10 and stop. What\'s missing?',
      commonErrors: [
        {
          answer: 'Coefficient is 10',
          misconception: 'Forgetting to include the b coefficient (2 in this case) raised to the power r.',
          correctsTo: 'General term: 5Cr · 1^(5−r) · (2x)^r = 5Cr · 2^r · x^r. For x³: r = 3 → 5C3 · 2³ = 10 · 8 = 80. Always include BOTH the binomial coefficient AND the powers of any non-x constants. (1 + 2x)⁵ ≠ (1 + x)⁵ — the 2 multiplies the x and gets raised with it.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'nCr = n!/[r!(n − r)!]. Pascal\'s triangle gives the same numbers.',
        'General term T_(r+1) = nCr · a^(n−r) · b^r.',
        'Find specific term: set exponent of the variable to the target, solve for r, substitute back.',
        'Coefficient = number; term = number · variable. Always include constants (like 2, 3) raised to r.',
        '0! = 1 by convention.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In the expansion of (1 + ax)⁸, the coefficient of x³ is 56 times the coefficient of x. Find a.',
      hint: 'Coeff of x: 8C1 · a = 8a. Coeff of x³: 8C3 · a³ = 56a³. Equation: 56a³ = 56·(8a) → 56a³ = 448a → a² = 8 → a = ±2√2. Both are valid algebraically; the question wording often asks for positive only.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
