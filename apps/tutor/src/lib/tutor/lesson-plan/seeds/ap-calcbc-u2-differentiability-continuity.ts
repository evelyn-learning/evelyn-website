/**
 * AP Calculus BC — CED Unit 2.4: Connecting Differentiability and
 * Continuity.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U2_DIFFERENTIABILITY_CONTINUITY: LessonPlan = {
  id: 'evelyn.ap.calcbc.differentiability-continuity.v1',
  title: 'U2.4 Connecting Differentiability and Continuity',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.differentiability-continuity',
      description:
        'Prove and apply: differentiable at a ⟹ continuous at a. Recognize that the converse fails — continuous functions need not be differentiable. Identify the three failure modes: corner, cusp, vertical tangent.',
      standard: 'AP-CALCBC-2.4',
    },
  ],
  prerequisites: ['apcalcbc.derivative-definition'],
  followUps: ['apcalcbc.power-rule'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the relationship: differentiability is STRONGER than continuity.',
      script:
        "Differentiable functions are continuous — but not all continuous functions are differentiable. Differentiability is the STRONGER property. Three classic failure modes — corners, cusps, vertical tangents — show how a function can be continuous yet have no well-defined slope at a point. AP exam testing here is reliable.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-relationship',
      kind: 'concept',
      goal: 'Cover the implication, three failure modes, and why each fails.',
      keyIdeas: [
        'KEY THEOREM: If f is DIFFERENTIABLE at a, then f is CONTINUOUS at a. Differentiability is a stronger condition.',
        'CONVERSE FAILS. Continuity at a does NOT imply differentiability. Some continuous functions still fail to have a derivative at certain points.',
        'THREE FAILURE MODES (continuous but NOT differentiable):',
        '(1) CORNER. The graph has a sharp turn — left-side and right-side slopes differ. Example: f(x) = |x| at x = 0. f is continuous (limit = value = 0), but f\'(0) DNE because left slope = -1 and right slope = +1 (the secant slopes don\'t agree as h → 0).',
        '(2) CUSP. Graph comes to a point with both slopes diverging in opposite directions (typically toward ±∞). Example: f(x) = x^(2/3) at x = 0. Continuous, but tangent slope DNE — left side and right side both head to ±∞.',
        '(3) VERTICAL TANGENT. The tangent line at a is vertical (infinite slope). Example: f(x) = x^(1/3) at x = 0. f is continuous; the tangent at x = 0 is the y-axis (vertical line). The derivative limit is +∞, which doesn\'t exist as a finite real.',
        'OPERATIONAL TEST. f differentiable at a ⟺ lim_{h→0} [f(a+h) − f(a)]/h EXISTS as a finite real. Failures correspond to: (i) one-sided limits exist but disagree (corner), (ii) limit is ±∞ (vertical tangent or cusp), (iii) limit oscillates (rare in AP).',
        'PROOF SKETCH (differentiable → continuous): if f\'(a) exists (finite), then f(a+h) = f(a) + f\'(a)·h + (small terms). As h → 0, f(a+h) → f(a). That\'s exactly the continuity condition.',
      ],
      vocabulary: [
        { term: 'corner', definition: 'a point where left-side and right-side derivatives disagree; differentiability fails.' },
        { term: 'cusp', definition: 'a sharp point where both side derivatives diverge to infinity in opposite directions.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-corner',
      kind: 'worked_example',
      problem:
        'Show that f(x) = |x| is continuous at x = 0 but not differentiable at x = 0.',
      steps: [
        'STEP 1 — CONTINUITY at x = 0. f(0) = 0. lim_{x→0⁻} |x| = 0; lim_{x→0⁺} |x| = 0. Both limits = 0 = f(0). All 3 continuity conditions hold. ✓',
        'STEP 2 — DIFFERENTIABILITY at x = 0. Compute f\'(0) using h-form. lim_{h→0} [|0+h| − |0|]/h = lim_{h→0} |h|/h.',
        'STEP 3 — ONE-SIDED LIMITS. As h → 0⁺ (h > 0): |h| = h, so |h|/h = 1. As h → 0⁻ (h < 0): |h| = -h, so |h|/h = -1.',
        'STEP 4 — CONCLUSION. Right-hand limit = +1; left-hand limit = -1. They\'re UNEQUAL → lim DNE. f\'(0) DNE. f is NOT differentiable at x = 0 — a CORNER.',
        'STEP 5 — KEY POINT. f is continuous at x = 0 but not differentiable. Continuity is necessary but NOT sufficient for differentiability.',
      ],
      answer: 'Continuous (limit = value = 0); not differentiable (left slope -1, right slope +1, derivative limit DNE).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem:
        'For each function and point, identify whether the function is (i) continuous and (ii) differentiable. If not differentiable, classify the failure (corner, cusp, vertical tangent, discontinuity). (a) f(x) = |x − 3| at x = 3. (b) f(x) = x^(2/3) at x = 0. (c) f(x) = x^(1/3) at x = 0. (d) f(x) = 1/x at x = 0.',
      expectedAnswer:
        '(a) Continuous (it\'s |·| shifted; continuous everywhere). NOT differentiable at x = 3: left slope = -1, right slope = +1. CORNER. (b) Continuous (x^(2/3) is defined and continuous at 0; (0)^(2/3) = 0). NOT differentiable: derivative is (2/3)x^(-1/3), which → ±∞ as x → 0. CUSP (the function comes to a sharp point at the origin and the side slopes diverge in opposite directions). (c) Continuous. NOT differentiable: derivative (1/3)x^(-2/3) → +∞ as x → 0 (from BOTH sides — squared exponent means same sign). VERTICAL TANGENT (the tangent line at x = 0 is the y-axis). (d) NOT continuous at x = 0 (function is undefined there; vertical asymptote). Differentiability question doesn\'t apply (continuity is required first). DISCONTINUITY (infinite type).',
      responseFormat: 'free',
      hints: [
        'Always check continuity first. If discontinuous, differentiability auto-fails.',
        'Corners: one-sided slopes disagree.',
        'Cusps: both slopes diverge to ±∞ in opposite directions.',
        'Vertical tangent: derivative is ±∞ from both sides.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-piecewise-diff',
      kind: 'try_yourself',
      problem:
        'Determine the value of constant k for which f(x) is BOTH continuous AND differentiable at x = 1, given f(x) = x² for x ≤ 1 and f(x) = kx for x > 1.',
      expectedAnswer:
        'CONTINUITY at x = 1: lim_{x→1⁻} f = 1² = 1; lim_{x→1⁺} f = k·1 = k; f(1) = 1 (using x ≤ 1 branch). For continuity: 1 = k → k = 1. DIFFERENTIABILITY at x = 1: f\'(x) = 2x for x < 1; f\'(x) = k for x > 1. Left-side derivative at x = 1: 2(1) = 2. Right-side derivative at x = 1: k. For differentiability (slopes match): 2 = k → k = 2. CONTRADICTION: continuity requires k = 1, differentiability requires k = 2. NO single value of k makes f BOTH continuous and differentiable at x = 1. (The function as defined cannot be made smooth at x = 1 with this form.)',
      responseFormat: 'free',
      hints: [
        'Continuity: match values. Differentiability: match slopes.',
        'When the two requirements conflict, no single parameter works.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-direction',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. State the two implications precisely: "If f is differentiable at a, then ___" and "If f is continuous at a, then ___". For each, justify with a one-sentence proof or counterexample.',
      expectedAnswer:
        'IMPLICATION 1 (true): "If f is differentiable at a, then f is continuous at a." Justification: f\'(a) exists ⟹ lim_{x→a} f(x) = f(a) (the difference quotient\'s existence as a finite limit forces f(x) − f(a) → 0 as x → a). The implication is one-directional. IMPLICATION 2 (FALSE): "If f is continuous at a, then f is differentiable at a." Counterexample: f(x) = |x| at a = 0. f is continuous (limit = value = 0) but not differentiable (one-sided slopes disagree). The converse fails. Strong answers: (i) state both correctly, (ii) note the one-way nature, (iii) provide a continuity-without-differentiability counterexample.',
      responseFormat: 'frq',
      hints: ['One direction is true; the other has |x| as a counterexample.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'DIFFERENTIABLE at a ⟹ CONTINUOUS at a. Stronger property.',
        'Converse FAILS. Three failure modes: CORNER (one-sided slopes disagree), CUSP (both diverge oppositely), VERTICAL TANGENT (slope = ±∞).',
        'Operational test: f\'(a) exists ⟺ lim_{h→0} [f(a+h)−f(a)]/h is a finite real number.',
        'Always check continuity first. If discontinuous, automatically not differentiable.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.4',
    cedTitle: 'Connecting Differentiability and Continuity',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '2', note: 'Standard differentiability vs continuity treatment.' }],
  },
};
