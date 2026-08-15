/**
 * AP Calculus BC — CED Unit 1.10: Exploring Types of Discontinuities.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_DISCONTINUITY_TYPES: LessonPlan = {
  id: 'evelyn.ap.calcbc.discontinuity-types.v1',
  title: 'U1.10 Exploring Types of Discontinuities',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.discontinuity-types',
      description:
        'Classify discontinuities of a function as removable, jump, or infinite (essential), and determine which type a given function has at a given point.',
      standard: 'AP-CALCBC-1.10',
    },
  ],
  prerequisites: ['apcalcbc.squeeze-theorem'],
  followUps: ['apcalcbc.continuity'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame discontinuities as falling into a small number of types.',
      script:
        "Functions can fail to be continuous at a point in only THREE ways: there's a HOLE (removable), a JUMP (one-sided limits disagree), or an EXPLOSION TO INFINITY (asymptote). Recognizing the type tells you (a) whether the limit exists, (b) what to do about it (some are fixable; others aren't). AP exam questions test type-classification reliably.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-types',
      kind: 'concept',
      goal: 'Cover the three types of discontinuity with definitions, graphical signatures, and examples.',
      keyIdeas: [
        'TYPE 1 — REMOVABLE DISCONTINUITY (also called a "HOLE"). The two-sided limit lim_{x→a} f(x) EXISTS, but either f(a) is undefined OR f(a) ≠ the limit value. Visual: a single missing point on the graph (an open circle). Removable because we could "fix" it by redefining f(a) = limit.',
        'EXAMPLE OF REMOVABLE: f(x) = (x²−4)/(x−2). At x = 2: numerator = 0, denominator = 0, so f(2) UNDEFINED. But lim_{x→2} f(x) = 4 (factor and cancel). Removable discontinuity. We could redefine: f̃(x) = f(x) for x ≠ 2, f̃(2) = 4. Then f̃ is continuous.',
        'TYPE 2 — JUMP DISCONTINUITY. The two-sided limit lim_{x→a} f(x) DOES NOT EXIST because the LEFT-SIDED LIMIT and RIGHT-SIDED LIMIT both exist but are UNEQUAL. Visual: the graph has a vertical jump from one y-value to another at x = a.',
        'EXAMPLE OF JUMP: f(x) = -1 for x < 0; f(x) = 1 for x ≥ 0 (signum function). lim_{x→0⁻} f = -1; lim_{x→0⁺} f = 1. They differ → DNE. Jump discontinuity.',
        'TYPE 3 — INFINITE / ESSENTIAL DISCONTINUITY. One or both one-sided limits is INFINITE (function blows up). The function has a vertical asymptote at x = a. Cannot be "removed" by redefinition.',
        'EXAMPLE OF INFINITE: f(x) = 1/x at x = 0. lim_{x→0⁻} f = -∞; lim_{x→0⁺} f = +∞. Both unbounded → DNE finitely. Vertical asymptote at x = 0.',
        'OSCILLATING DISCONTINUITY (sometimes considered a fourth type). A function oscillates without limit, e.g. sin(1/x) at x = 0. Some texts include this under "essential discontinuity"; AP usually treats this as "DNE due to oscillation" without naming a separate type.',
        'CLASSIFICATION ALGORITHM: at x = a, compute (1) one-sided limits, (2) two-sided limit, (3) f(a). If two-sided limit exists but ≠ f(a) (or f(a) undefined): REMOVABLE. If one-sided limits exist but unequal: JUMP. If at least one one-sided limit is infinite: INFINITE.',
      ],
      vocabulary: [
        { term: 'removable discontinuity', definition: 'a hole in the graph where the limit exists but disagrees with (or replaces an undefined) function value.' },
        { term: 'jump discontinuity', definition: 'a discontinuity where one-sided limits exist but disagree.' },
        { term: 'infinite discontinuity', definition: 'a discontinuity where one or both one-sided limits is ±∞ (vertical asymptote).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem:
        'For each function, determine if there is a discontinuity at the indicated x-value, and if so, classify it as removable, jump, or infinite. (a) f(x) = (x² − 9)/(x − 3) at x = 3. (b) f(x) = (x + 2)/(x − 1) at x = 1. (c) f(x) = -2 for x < 5, f(x) = 7 for x ≥ 5, at x = 5.',
      steps: [
        'STEP 1 — (a) Check substitution: (9 − 9)/(3 − 3) = 0/0. f(3) is UNDEFINED. Compute the limit by factoring: (x − 3)(x + 3)/(x − 3) = x + 3 (for x ≠ 3). lim_{x→3} f(x) = 6. Limit EXISTS but f(3) undefined → REMOVABLE DISCONTINUITY at x = 3.',
        'STEP 2 — (b) Check substitution: (1 + 2)/(1 − 1) = 3/0. NOT 0/0; this is finite/0. The limit is INFINITE (function blows up). Specifically, sign analysis: numerator = 3 > 0; denominator approaches 0 from positive side as x → 1⁺ and from negative side as x → 1⁻. So lim_{x→1⁻} = -∞; lim_{x→1⁺} = +∞. INFINITE DISCONTINUITY at x = 1 (vertical asymptote).',
        'STEP 3 — (c) Piecewise. lim_{x→5⁻} f(x) = -2 (left side). lim_{x→5⁺} f(x) = 7 (right side). Both one-sided limits exist but UNEQUAL → JUMP DISCONTINUITY at x = 5.',
        'STEP 4 — INTUITION. Check (1) the limit, (2) the function value. If limit exists ≠ value (or undefined) → REMOVABLE. If one-sided differ → JUMP. If one-sided unbounded → INFINITE. Each type has a distinct signature.',
      ],
      answer: '(a) Removable. (b) Infinite (vertical asymptote). (c) Jump.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem:
        'Classify each discontinuity (removable, jump, or infinite) at the indicated point. (a) f(x) = (x − 2)/(x² − 4) at x = 2. (b) f(x) = 1/x² at x = 0. (c) f(x) = floor(x) [the greatest-integer function] at x = 3.',
      expectedAnswer:
        '(a) Direct sub: 0/0. Factor: (x − 2)/[(x − 2)(x + 2)] = 1/(x + 2). lim → 1/4. f(2) undefined. REMOVABLE. (b) Direct sub: 1/0. lim_{x→0⁺} = +∞; lim_{x→0⁻} = +∞ (both sides go to +∞ since denominator is x²). INFINITE DISCONTINUITY (vertical asymptote at x = 0). (c) floor function: floor(x) = 2 for 2 ≤ x < 3 and = 3 for 3 ≤ x < 4. lim_{x→3⁻} = 2, lim_{x→3⁺} = 3. Different → JUMP discontinuity.',
      responseFormat: 'free',
      hints: [
        'For 0/0: probably removable (factor it).',
        'For finite/0: likely infinite.',
        'For piecewise/floor functions at the break: typically jump.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-types-distinguish',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why is REMOVABLE discontinuity meaningfully different from JUMP and INFINITE discontinuities? What does "removable" mean for a function, and how would you "remove" the discontinuity?',
      expectedAnswer:
        'REMOVABLE means the two-sided limit EXISTS, even though f(a) is undefined or differs from the limit. This is a "fixable" discontinuity: by redefining f̃(a) = lim_{x→a} f(x), we get a NEW function f̃ that is identical to f everywhere except at a, where f̃ now equals the limit. Crucially, f̃ is CONTINUOUS at a. Example: f(x) = (x²−4)/(x−2) has a removable discontinuity at x = 2. Define f̃(2) = 4 (the limit). Now f̃(x) = (x²−4)/(x−2) for x ≠ 2 and f̃(2) = 4 — f̃ is the same as the polynomial x + 2 everywhere, which is continuous. JUMP and INFINITE discontinuities are DIFFERENT in kind: there\'s no single value we could assign to f(a) that would make the function continuous, because the limit ITSELF doesn\'t exist (jump: one-sided limits disagree; infinite: one-sided limits don\'t reach a finite value). These are "essential" — built into the function structure. The concept of "removability" is important because (a) it identifies which discontinuities can be "patched" (relevant to extending function domains, defining derivative limits, etc.) and (b) AP problems often ask students to identify the value at the discontinuity that would make the function continuous — that value is the limit. Strong answers articulate (i) the limit-exists test, (ii) the redefinition procedure, (iii) why jump/infinite cannot be removed.',
      responseFormat: 'frq',
      hints: [
        'When does the limit exist?',
        'When can we redefine f(a) and patch the function?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three types: REMOVABLE (limit exists, f(a) wrong/missing — fixable hole), JUMP (one-sided limits disagree), INFINITE (asymptote).',
        'Removable: the limit exists. Jump and infinite: the two-sided limit DNE.',
        'Removable can be patched by setting f(a) = lim_{x→a} f(x).',
        'Diagnose by computing one-sided limits and comparing to f(a).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.10',
    cedTitle: 'Exploring Types of Discontinuities',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Standard classification of discontinuity types.' },
    ],
  },
};
