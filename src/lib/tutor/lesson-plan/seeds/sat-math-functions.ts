/**
 * SAT Math — Function Notation, Domain, Range, Composite Functions.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_FUNCTIONS: LessonPlan = {
  id: 'evelyn.testprep.sat-math.functions.v1',
  title: 'SAT Math — Function Notation, Domain, Composite Functions',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.functions', description: 'Use function notation, find domain/range, compute composite functions on SAT.', standard: 'CCSS.MATH.HSF.IF' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Function notation appears in nearly every SAT — and is often the only "trick" in an algebra question.', script: 'f(x) is just a recipe. Plug in a number, get a number out. Composite f(g(x)) means apply g first, then f. Today: notation + key SAT patterns.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Function notation, evaluation, domain/range, composition, inverse.', keyIdeas: [
      'FUNCTION NOTATION: f(x) means "the function f applied to x."',
      '  f(x) = 2x + 1 says "function f takes x, doubles it, adds 1."',
      '  f(3) means "plug in 3 for x." f(3) = 2(3) + 1 = 7.',
      'Variables are placeholders. f(a) = 2a + 1. f(x + 5) = 2(x + 5) + 1 = 2x + 11.',
      'DOMAIN: set of all valid inputs. SAT focuses on:',
      '  Division by 0 EXCLUDED. f(x) = 1/(x − 3): exclude x = 3.',
      '  Square root of negative EXCLUDED (real-only). g(x) = √(x − 2): require x ≥ 2.',
      'RANGE: set of all output values. Often harder; consider min/max + behaviour.',
      'COMPOSITE FUNCTION: f(g(x)) means "apply g first, then f."',
      '  Notation: (f ∘ g)(x) = f(g(x)).',
      '  Order matters: f(g(x)) ≠ g(f(x)) in general.',
      'COMPUTING f(g(x)):',
      '  Compute g(x) first.',
      '  Plug that result into f.',
      'INVERSE FUNCTION f⁻¹(x): undoes f.',
      '  f(f⁻¹(x)) = x. f⁻¹(f(x)) = x.',
      '  To find: write y = f(x). Swap x and y. Solve for y.',
      '  Example: f(x) = 2x + 1. Swap: x = 2y + 1. Solve: y = (x − 1)/2 = f⁻¹(x).',
      'NOTATION pitfall: f⁻¹(x) ≠ 1/f(x). The −1 superscript means INVERSE FUNCTION, not reciprocal.',
      'GRAPH: f(x) is a function ⟺ each x has at most one y (vertical-line test).',
      'TRANSFORMATIONS: f(x − a) shifts RIGHT a units. f(x) + b shifts UP b units. −f(x) reflects across x-axis. f(−x) reflects across y-axis.',
    ], vocabulary: [{ term: 'composite function', definition: '(f ∘ g)(x) = f(g(x)) — apply inner function g first, then outer f.' }, { term: 'inverse function', definition: 'f⁻¹ undoes f; obtained by swapping x and y in y = f(x), then solving for y.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Given f(x) = 3x − 4 and g(x) = x² + 1, find f(g(2)).', steps: [
      'Compute g(2) first: g(2) = 2² + 1 = 5.',
      'Then f(g(2)) = f(5) = 3(5) − 4 = 11.',
      'Note: g(f(2)) is different. f(2) = 3(2) − 4 = 2. g(2) = 5. So g(f(2)) = 5. Different result.',
    ], answer: 'f(g(2)) = 11', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Find the domain of h(x) = 1/(x² − 9).', expectedAnswer: 'Domain excludes values that make denominator = 0. x² − 9 = 0 → x² = 9 → x = ±3. Exclude x = 3 and x = −3. Domain: all real x EXCEPT x = ±3.', responseFormat: 'free', hints: ['Find what makes denominator zero.', 'Exclude those x-values.'], estimatedMinutes: 3 },
    { id: 'misconception-inverse-notation', kind: 'misconception_check', question: 'A student computes f⁻¹(x) by writing 1/f(x). Why is this wrong?', commonErrors: [{ answer: 'f⁻¹(x) = 1/f(x)', misconception: 'Confusing inverse function with reciprocal.', correctsTo: 'f⁻¹(x) is the INVERSE FUNCTION (undoes f). 1/f(x) is the RECIPROCAL of f(x). DIFFERENT things. Example: f(x) = 2x + 1. Inverse: f⁻¹(x) = (x − 1)/2. Reciprocal: 1/f(x) = 1/(2x + 1). The notation "−1" superscript on a function means INVERSE, not reciprocal. (Unfortunate notation, but that\'s how it works.)' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['f(x) is a recipe; plug in to evaluate.', 'Composite: f(g(x)) means do g first, then f.', 'Inverse: swap x and y, solve. f⁻¹ ≠ 1/f.', 'Domain excludes division by 0 + square root of negative.', 'f(x − a) shifts RIGHT; f(x) + b shifts UP.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
