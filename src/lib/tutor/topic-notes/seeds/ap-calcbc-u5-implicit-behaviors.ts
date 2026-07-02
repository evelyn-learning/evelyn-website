/**
 * AP Calculus BC — Unit 5 CED 5.12: Exploring behaviors of implicit relations —
 * using implicit differentiation to locate horizontal/vertical tangents and
 * determine concavity for curves that are not functions.
 *
 * Baseline curated from evelyn.ap.calcbc.implicit-behaviors.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * seeds/ap-calcbc-u3-chain-rule.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, \dfrac, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.implicit-behaviors';

export const BASELINE_AP_CALCBC_IMPLICIT_BEHAVIORS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.implicit-behaviors.v1',
  course: 'AP Calculus BC',
  cedUnit: 5,
  cedTopic: '5.12',
  cedTitle: 'Exploring Behaviors of Implicit Relations',
  planId: 'evelyn.ap.calcbc.implicit-behaviors.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.implicit-behaviors.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Setup: the derivative is a fraction in x and y',
      content:
        'An implicit relation such as $x^2 + y^2 = 25$ or $x^2 + xy + y^2 = 7$ defines a curve where $y$ is not a single function of $x$. Implicit differentiation yields $\\dfrac{dy}{dx}$ as a FRACTION $\\dfrac{N(x,y)}{D(x,y)}$ in both variables, which is the key to reading off tangent behavior.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Horizontal tangent condition',
      content:
        'A HORIZONTAL tangent occurs where $\\dfrac{dy}{dx} = 0$. A fraction is zero exactly when its NUMERATOR is zero (with denominator nonzero): set $N(x,y) = 0$, combine with the original relation, and solve for the point(s) where the tangent is flat.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Vertical tangent condition',
      content:
        'A VERTICAL tangent occurs where $\\dfrac{dy}{dx}$ is UNDEFINED. A fraction is undefined when its DENOMINATOR is zero (with numerator nonzero): set $D(x,y) = 0$, combine with the original relation, and solve for the point(s) where the curve runs straight up and down.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The 0/0 indeterminate case',
      content:
        'If the numerator AND denominator are both zero at a point, $\\dfrac{dy}{dx}$ is indeterminate there — the point may be a crossing, cusp, or corner, and is NOT automatically a horizontal or vertical tangent. AP problems usually avoid it, but a $\\tfrac{0}{0}$ reading must be flagged, not assumed.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Concavity via the second derivative',
      content:
        'Differentiate $\\dfrac{dy}{dx} = \\dfrac{N}{D}$ AGAIN with respect to $x$ (quotient rule), then SUBSTITUTE the first derivative $y\' = \\dfrac{N}{D}$ wherever $y\'$ appears, and simplify — often using the original relation. Then $\\dfrac{d^2y}{dx^2} > 0$ means CONCAVE UP at the point and $< 0$ means CONCAVE DOWN, exactly as for functions.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The key substitution step',
      content:
        'The most error-prone move in second-derivative work is forgetting that $y$ depends on $x$. After the quotient rule, EVERY $y\'$ must be replaced by $\\dfrac{N}{D}$ before you evaluate, or the concavity answer will be wrong.',
    },
  ],
  methods: [
    {
      title: 'Locate horizontal and vertical tangents of an implicit curve',
      when_to_use:
        'When asked where an implicit relation has a flat (horizontal) or vertical tangent.',
      steps: [
        'Differentiate the relation implicitly and solve for $\\dfrac{dy}{dx} = \\dfrac{N(x,y)}{D(x,y)}$.',
        'HORIZONTAL tangents: set the NUMERATOR $N = 0$; VERTICAL tangents: set the DENOMINATOR $D = 0$.',
        'Substitute that condition back into the ORIGINAL relation to solve for the actual point(s).',
        'Confirm the OTHER part of the fraction is nonzero there (avoid the $\\tfrac{0}{0}$ trap) before declaring the tangent.',
      ],
      example: {
        problem: 'For the circle $x^2 + y^2 = 25$, find every point with a VERTICAL tangent.',
        solution:
          'Implicit differentiation gives $\\tfrac{d}{dx}(x^2 + y^2) = 2x + 2y\\,y\' = 0$, so $y\' = -\\dfrac{x}{y}$. Vertical tangent where the denominator $y = 0$ (numerator $-x \\ne 0$). Substituting $y = 0$ into $x^2 + y^2 = 25$ gives $x^2 = 25$, so $x = \\pm 5$. Vertical tangents at $(5, 0)$ and $(-5, 0)$ — the leftmost and rightmost points of the circle.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Determine concavity of an implicit relation',
      when_to_use:
        'When asked for $\\dfrac{d^2y}{dx^2}$ or the concavity of an implicit curve at a point.',
      steps: [
        'Compute $y\' = \\dfrac{N}{D}$ by implicit differentiation.',
        'Differentiate $y\'$ AGAIN with the quotient rule to get $\\dfrac{d^2y}{dx^2}$ in terms of $x$, $y$, and $y\'$.',
        'SUBSTITUTE $y\' = \\dfrac{N}{D}$ everywhere it appears, then simplify — use the original relation to collapse terms.',
        'Evaluate at the point; the SIGN gives the concavity (positive $\\Rightarrow$ up, negative $\\Rightarrow$ down).',
      ],
      example: {
        problem: 'For $x^2 + y^2 = 25$ with $y\' = -\\dfrac{x}{y}$, find $\\dfrac{d^2y}{dx^2}$ and the concavity at $(3, 4)$.',
        solution:
          'Quotient rule: $\\dfrac{d^2y}{dx^2} = -\\dfrac{y - x\\,y\'}{y^2}$. Substitute $y\' = -\\dfrac{x}{y}$: $-\\dfrac{y + x^2/y}{y^2} = -\\dfrac{x^2 + y^2}{y^3}$. Using $x^2 + y^2 = 25$: $\\dfrac{d^2y}{dx^2} = -\\dfrac{25}{y^3}$. At $(3, 4)$ this is $-\\dfrac{25}{64} < 0$, so the curve is CONCAVE DOWN there — matching the domed upper half of the circle.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Horizontal tangent = numerator zero; vertical tangent = denominator zero. Keep the two conditions straight — swapping them is the classic mistake.', kind: 'common-error' },
    { content: 'After setting $N = 0$ or $D = 0$, you must substitute back into the ORIGINAL relation to get the actual point — the condition alone is not a coordinate.', kind: 'frq-vocab' },
    { content: 'If numerator and denominator are BOTH zero, the slope is $\\tfrac{0}{0}$ — indeterminate. Do not label it horizontal or vertical without further analysis.', kind: 'edge-case' },
    { content: 'When finding $\\dfrac{d^2y}{dx^2}$, replace EVERY $y\'$ with $\\dfrac{N}{D}$ before simplifying — dropping this substitution is the #1 second-derivative error.', kind: 'gotcha' },
    { content: 'Simplify the second derivative with the original equation (e.g. replace $x^2 + y^2$ by the constant the relation supplies) — it collapses the algebra and makes the sign obvious.', kind: 'tip' },
  ],
};
