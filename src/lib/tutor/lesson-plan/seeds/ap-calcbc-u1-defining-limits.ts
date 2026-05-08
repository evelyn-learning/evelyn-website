/**
 * AP Calculus BC — CED Unit 1.2: Defining Limits and Using Limit Notation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_DEFINING_LIMITS: LessonPlan = {
  id: 'evelyn.ap.calcbc.defining-limits.v1',
  title: 'U1.2 Defining Limits and Using Limit Notation',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.defining-limits',
      description:
        'State the informal definition of a limit, use limit notation correctly (lim_{x→a} f(x) = L, including one-sided variants), and identify when a limit exists vs does not exist.',
      standard: 'AP-CALCBC-1.2',
    },
  ],
  prerequisites: ['apcalcbc.introducing-calculus'],
  followUps: ['apcalcbc.limits-graphs-tables'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the limit notion feel like a precise question, not vague intuition.',
      script:
        "What is a limit, exactly? It's not \"the value the function reaches\" — limits often exist where the function isn't even DEFINED. It's the value the function APPROACHES as x gets arbitrarily close to a target — without ever needing x to equal the target. Today we make that precise and learn the notation.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-limit-def',
      kind: 'concept',
      goal: 'Cover informal limit definition, notation including one-sided limits, and when limits fail to exist.',
      keyIdeas: [
        'INFORMAL DEFINITION: lim_{x→a} f(x) = L means as x gets arbitrarily close to a (from either side, but not equal to a), f(x) gets arbitrarily close to L. Notice: the value of f at x = a doesn\'t affect the limit. f(a) might be different, undefined, or equal to L — none changes lim_{x→a} f(x).',
        'NOTATION: lim_{x→a} f(x) = L. Read "limit as x approaches a of f of x equals L". Sometimes written x → a^- (left-hand limit) or x → a^+ (right-hand limit).',
        'TWO-SIDED LIMIT EXISTS ⟺ both one-sided limits exist AND are equal. lim_{x→a} f(x) = L if and only if lim_{x→a^-} f(x) = L AND lim_{x→a^+} f(x) = L.',
        'LIMIT DOES NOT EXIST (DNE) when: (a) one-sided limits exist but are unequal (e.g. step function jump). (b) one or both one-sided limits are infinite (e.g. 1/x at x=0). (c) function oscillates without settling (e.g. sin(1/x) at x=0).',
        'INFINITE LIMITS: when f(x) grows without bound near x = a, we write lim_{x→a} f(x) = ∞ (or −∞). This DOES specify behavior, but the limit technically DOES NOT EXIST as a finite real number. AP convention: writing "= ∞" describes the behavior; "DNE" is also correct.',
        'KEY DISTINCTION: lim_{x→a} f(x) is about the BEHAVIOR NEAR a, NOT the value AT a. f(2) = 100 is irrelevant to lim_{x→2} f(x) if the function approaches some other value as x approaches 2.',
      ],
      vocabulary: [
        { term: 'limit', definition: 'the value that f(x) approaches as x approaches a (without necessarily reaching it).' },
        { term: 'one-sided limit', definition: 'the limit as x approaches a from only the left (x → a⁻) or only the right (x → a⁺).' },
        { term: 'DNE', definition: 'does not exist — used when no single value L satisfies the limit definition.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-piecewise',
      kind: 'worked_example',
      problem:
        'Let f(x) = x + 1 for x < 2; f(x) = 5 for x = 2; f(x) = x + 1 for x > 2. Compute (a) lim_{x→2⁻} f(x), (b) lim_{x→2⁺} f(x), (c) lim_{x→2} f(x), and (d) f(2). Comment on the relationship between (c) and (d).',
      steps: [
        'STEP 1 — LEFT-SIDED LIMIT. As x approaches 2 from the left (x < 2), f(x) = x + 1. As x → 2⁻, x + 1 → 3. So lim_{x→2⁻} f(x) = 3.',
        'STEP 2 — RIGHT-SIDED LIMIT. As x → 2⁺, f(x) = x + 1, same formula. So lim_{x→2⁺} f(x) = 3.',
        'STEP 3 — TWO-SIDED LIMIT. Both one-sided limits = 3. They\'re equal. lim_{x→2} f(x) = 3.',
        'STEP 4 — VALUE AT x = 2. f(2) = 5 (by the piecewise definition).',
        'STEP 5 — RELATIONSHIP. lim_{x→2} f(x) = 3 ≠ f(2) = 5. The limit and the function value at the same point can DIFFER. The limit cares about BEHAVIOR NEAR 2, not VALUE AT 2.',
        'STEP 6 — INTERPRET. This is a "removable discontinuity" at x = 2 (we\'ll formalize this in Unit 1.10). The function jumps to 5 at exactly x = 2 but the limit is 3. The limit "doesn\'t see" that single weird value.',
      ],
      answer: '(a) 3, (b) 3, (c) 3, (d) 5. Limit ≠ function value: limits care about NEAR, not AT.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-define',
      kind: 'try_yourself',
      problem:
        'In your own words, explain why the value of f(a) is IRRELEVANT when computing lim_{x→a} f(x). Use a specific example.',
      expectedAnswer:
        'A limit asks: "what value does f(x) approach as x gets close to a, WITHOUT requiring x to equal a?" The phrase "approaches a" means we examine x at values arbitrarily close to a but not equal to a. So whatever f does AT exactly x = a — f(a) might be defined or undefined, equal to the limit or not — it doesn\'t enter the calculation. Example: f(x) = (x²-4)/(x-2). At x = 2, this is 0/0 — UNDEFINED. But for x ≠ 2, f(x) = (x-2)(x+2)/(x-2) = x + 2, which approaches 4 as x → 2. So lim_{x→2} f(x) = 4, even though f(2) is undefined. Strong answers: cite the "approaching but not reaching" framing AND a concrete example where f(a) and the limit differ.',
      responseFormat: 'free',
      hints: [
        '"Approaches" means "gets close to without necessarily reaching".',
        'Try the example (x²-4)/(x-2) at x=2.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-piecewise',
      kind: 'try_yourself',
      problem:
        'Let g(x) = 2x for x < 1, g(x) = 7 for x = 1, g(x) = 3x − 1 for x > 1. (a) Compute lim_{x→1⁻} g(x). (b) Compute lim_{x→1⁺} g(x). (c) Does lim_{x→1} g(x) exist? If yes, what is it? (d) What is g(1)?',
      expectedAnswer:
        '(a) lim_{x→1⁻} g(x) = 2(1) = 2. (b) lim_{x→1⁺} g(x) = 3(1) − 1 = 2. (c) Both one-sided limits = 2. They are EQUAL → two-sided limit EXISTS and = 2. (d) g(1) = 7 (by piecewise rule). Note: lim_{x→1} g(x) = 2 ≠ g(1) = 7. Removable discontinuity at x = 1.',
      responseFormat: 'numeric',
      hints: [
        'Use the appropriate piecewise formula for each side.',
        'Two-sided limit exists when both one-sided limits agree.',
        'g(1) is from the "x = 1" branch.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-dne',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Identify THREE distinct ways a limit can fail to exist. For each, give a brief example or scenario.',
      expectedAnswer:
        'THREE WAYS a limit can fail to exist (the canonical list): (1) UNEQUAL ONE-SIDED LIMITS — e.g. step function f(x) = 0 for x < 0, f(x) = 1 for x ≥ 0. lim_{x→0⁻} f = 0; lim_{x→0⁺} f = 1; they disagree → lim_{x→0} f DNE. Often called a "jump discontinuity". (2) INFINITE LIMITS — e.g. f(x) = 1/x as x → 0. The function grows without bound (positive on right, negative on left). The limit is not a finite real number; AP convention says DNE (or write ±∞ to describe behavior). Often called a "vertical asymptote at x = 0". (3) OSCILLATION — e.g. f(x) = sin(1/x) as x → 0. The function oscillates infinitely many times between -1 and 1 in any interval near 0; never settles to a single value. lim_{x→0} f DNE. Strong answers: name each way distinctly + give a SPECIFIC example for each.',
      responseFormat: 'frq',
      hints: [
        'Three categories: jump (one-sided disagree), infinity, oscillation.',
        'For each, an example function exhibiting that behavior.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-limit-equals-value',
      kind: 'misconception_check',
      question:
        "A student says: 'If lim_{x→2} f(x) = 7, then f(2) must equal 7.' Is this right?",
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Conflating the limit (behavior NEAR x = 2) with the function value AT x = 2.',
          correctsTo:
            'NOT NECESSARILY. The limit tells you what f(x) approaches as x → 2, NOT what f(2) equals. f(2) could be 7 (in which case f is "continuous at 2"), but f(2) could also be a different number (5, 100, anything) or even UNDEFINED — none of which changes the limit. The limit and the function value are TWO SEPARATE QUESTIONS. Continuity is the special case where lim_{x→a} f(x) = f(a). When that equality fails, the function has a discontinuity at a even though the limit may exist. AP frequently tests this distinction; treating limit-equals-value as automatic is a common point-loser.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'lim_{x→a} f(x) = L: f(x) approaches L as x approaches a (NOT equals).',
        'Two-sided limit exists ⟺ both one-sided limits exist AND are equal.',
        'Limit ≠ function value in general. f(a) is irrelevant to the limit.',
        'DNE three ways: unequal one-sided, infinite, oscillating.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.2',
    cedTitle: 'Defining Limits and Using Limit Notation',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Larson Ch 1 — informal limit definition; canonical across all AP calc texts.' },
    ],
  },
};
