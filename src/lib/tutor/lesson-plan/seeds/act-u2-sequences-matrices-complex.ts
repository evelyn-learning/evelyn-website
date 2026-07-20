/**
 * ACT — Math: Sequences, Matrices & Complex Numbers.
 *
 * The ACT's "grab-bag" advanced-topics cluster, usually concentrated in the
 * back third of the test (questions ~40–60): arithmetic/geometric sequences,
 * 2×2 matrix addition & scalar multiplication, and i² = −1 arithmetic. Each
 * looks unfamiliar but is really "apply one formula correctly" — fast points
 * once the pattern is locked in. Calculator allowed, ~60 sec/question pace.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_SEQUENCES_MATRICES_COMPLEX: LessonPlan = {
  id: 'evelyn.testprep.act.sequences-matrices-complex.v1',
  title: 'Sequences, Matrices & Complex Numbers',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.sequences-matrices-complex',
      standard: 'ACT-2.11',
      description:
        'Apply arithmetic and geometric sequence formulas, add and scalar-multiply 2×2 matrices, and simplify expressions using i² = −1.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe sequences/matrices/complex numbers as fast, formula-driven points rather than an unfamiliar wall — building confidence for the back third of the test.',
      script:
        'The last stretch of ACT Math — roughly questions 40 through 60 — throws a grab-bag of "advanced" topics at you: sequences, matrices, complex numbers. Usually 5 to 8 questions out of the 60 total. They look scary because they\'re unfamiliar, but each one is really just "apply one formula correctly," and takes under a minute once you know the pattern. Today we lock in three formulas: arithmetic/geometric sequences, 2×2 matrix addition and scalar multiplication, and i² = −1.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-grab-bag-formulas',
      kind: 'concept',
      goal: 'The three formulas and their signature traps: off-by-one in sequences, partial scaling in matrices, sign flips in complex arithmetic.',
      keyIdeas: [
        'ARITHMETIC SEQUENCES: each term adds a fixed common difference d. Formula: a_n = a_1 + (n − 1)d.',
        'GEOMETRIC SEQUENCES: each term is multiplied by a fixed common ratio r. Formula: a_n = a_1 · r^(n − 1).',
        'TRAP — OFF-BY-ONE: the exponent/multiplier is (n − 1), never n. The "5th term" has only 4 differences or ratios applied. When in doubt, list the first few terms by hand — it\'s slower per term but safer under pressure.',
        '2×2 MATRIX ADDITION/SUBTRACTION: combine corresponding entries only — same position, same operation. Matrices must be the same size.',
        'SCALAR MULTIPLICATION: multiply EVERY entry by the scalar, not just one row or one entry.',
        'TRAP — PARTIAL SCALING: applying the scalar to only one row, or scaling after adding instead of before. 2A + B is NOT the same as 2(A + B).',
        'i² = −1 is the entire content of "imaginary numbers" on the ACT. Treat i like a variable — FOIL/distribute normally — then substitute i² = −1 at the very end.',
        'TRAP — SIGN FLIP: a term like −8i² becomes +8, not −8, once you substitute. This sign flip is the single most common complex-number error on the ACT.',
      ],
      vocabulary: [
        { term: 'common difference', definition: 'the fixed amount added each step in an arithmetic sequence (d).' },
        { term: 'common ratio', definition: 'the fixed amount each term is multiplied by in a geometric sequence (r).' },
        { term: 'imaginary unit', definition: 'i, defined by i² = −1; treated as a variable until the final simplification step.' },
        { term: 'scalar', definition: 'a single number that multiplies every entry of a matrix.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-arithmetic-sequence',
      kind: 'worked_example',
      problem:
        'An arithmetic sequence has a first term of 7 and a common difference of 4. What is the 10th term?',
      steps: [
        'Identify the pieces: a_1 = 7, d = 4, n = 10.',
        'Apply the formula: a_n = a_1 + (n − 1)d.',
        'Compute the exponent term first: n − 1 = 9, so a_10 = 7 + 9(4).',
        '9 × 4 = 36, so a_10 = 7 + 36 = 43.',
      ],
      answer: '43',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-complex-multiplication-trap',
      kind: 'worked_example',
      problem: 'Simplify (3 + 2i)(1 − 4i).',
      steps: [
        'FOIL it exactly like a binomial: (3)(1) + (3)(−4i) + (2i)(1) + (2i)(−4i).',
        'Multiply each piece: 3 − 12i + 2i − 8i².',
        'Combine the imaginary terms first, leaving the i² term alone for now: 3 − 10i − 8i².',
        'TRAP: substitute i² = −1 carefully — −8i² becomes −8(−1) = +8, not −8.',
        'Combine real parts: 3 + 8 = 11, so the answer is 11 − 10i.',
      ],
      answer: '11 - 10i',
      estimatedMinutes: 3,
    },
    {
      id: 'try-geometric-sequence',
      kind: 'try_yourself',
      problem:
        'A geometric sequence has a first term of 2 and a common ratio of 3. What is the 5th term?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '14' },
        { id: 'b', text: '54' },
        { id: 'c', text: '486' },
        { id: 'd', text: '162', correct: true },
      ],
      expectedAnswer: '162',
      hints: [
        'Use a_n = a_1 · r^(n − 1), not r^n — the exponent is one less than the term number.',
        'List it out if needed: 2, 6, 18, 54, 162 — that\'s already 5 terms.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-matrix-scalar-addition',
      kind: 'try_yourself',
      problem:
        'Matrix A has Row 1: 2, −1 and Row 2: 3, 5. Matrix B has Row 1: 4, 0 and Row 2: −2, 6. What is 2A + B?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Row 1: 6, −1 — Row 2: 1, 11' },
        { id: 'b', text: 'Row 1: 8, −2 — Row 2: 4, 16', correct: true },
        { id: 'c', text: 'Row 1: 12, −2 — Row 2: 2, 22' },
        { id: 'd', text: 'Row 1: 8, −2 — Row 2: 8, 16' },
      ],
      expectedAnswer: 'Row 1: 8, −2 — Row 2: 4, 16',
      hints: [
        'Scale A first — multiply every entry of A by 2 — then add B entry-by-entry. Don\'t add first and scale second.',
        'Check the second row separately: 2(3) + (−2) = 4, and 2(5) + 6 = 16.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-complex-numeric',
      kind: 'try_yourself',
      problem: 'Type your answer: If i² = −1, what is the value of 3i² + 7?',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Substitute i² = −1 first: 3i² becomes 3(−1).',
        '3(−1) + 7 = −3 + 7.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-partial-scalar',
      kind: 'misconception_check',
      question:
        'A student computes 3 × [Row 1: 1, 2 — Row 2: 3, 4] by multiplying only the first row, getting [Row 1: 3, 6 — Row 2: 3, 4]. What went wrong?',
      commonErrors: [
        {
          answer: 'Row 1: 3, 6 — Row 2: 3, 4',
          misconception: 'Applying the scalar to only one row instead of every entry in the matrix.',
          correctsTo: 'Multiply EVERY entry by the scalar: Row 1: 3, 6 — Row 2: 9, 12.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'a_n = a_1 + (n − 1)d for arithmetic sequences; a_n = a_1 · r^(n − 1) for geometric — always (n − 1), never n.',
        'Add/subtract matrices entry-by-entry; scalar multiplication scales EVERY entry, and scaling happens before adding.',
        'i² = −1 — treat i like a variable, FOIL normally, then substitute at the very end and watch the sign flip.',
        'These grab-bag topics are fast, guaranteed points once you know the formula — don\'t let unfamiliarity cost you time.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.11', cedTitle: 'Sequences, Matrices & Complex Numbers' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
