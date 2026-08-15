/**
 * AP Calculus BC — Unit 5 CED 5.6+5.7: Concavity and the Second Derivative
 * Test — using the sign of f'' to determine concavity and inflection points,
 * and classifying local extrema with the Second Derivative Test.
 *
 * Baseline curated from evelyn.ap.calcbc.concavity-second-derivative.v1 to the
 * gold standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * seeds/ap-calcbc-u3-chain-rule.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, \dfrac, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.concavity-second-derivative';

export const BASELINE_AP_CALCBC_CONCAVITY_SECOND_DERIVATIVE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.concavity-second-derivative.v1',
  course: 'AP Calculus BC',
  cedUnit: 5,
  cedTopic: '5.6-5.7',
  cedTitle: 'Concavity and Second Derivative Test',
  planId: 'evelyn.ap.calcbc.concavity-second-derivative.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.concavity-second-derivative.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Concavity test',
      content:
        'On an interval where $f\'\'(x) > 0$, the graph of $f$ is CONCAVE UP; on an interval where $f\'\'(x) < 0$, it is CONCAVE DOWN. Equivalently, $f$ is concave up exactly where its slope $f\'$ is INCREASING, and concave down where $f\'$ is decreasing.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Geometric picture of concavity',
      content:
        'Concave UP ($f\'\' > 0$): the curve bends like a cup and tangent lines lie BELOW the graph — it "smiles." Concave DOWN ($f\'\' < 0$): the curve bends like a cap and tangent lines lie ABOVE the graph — it "frowns."',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'inflection point',
      content:
        'A point $x = c$ where $f$ CHANGES concavity, i.e. where $f\'\'$ CHANGES SIGN. It requires both that $f\'\'(c) = 0$ or $f\'\'(c)$ DNE, AND that $f\'\'$ actually switches sign across $c$. A zero of $f\'\'$ alone is not enough.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Second Derivative Test for local extrema',
      content:
        'At a critical point $c$ with $f\'(c) = 0$: if $f\'\'(c) > 0$ the graph is concave up there, so $f$ has a LOCAL MIN; if $f\'\'(c) < 0$ it is concave down, so $f$ has a LOCAL MAX; if $f\'\'(c) = 0$ the test is INCONCLUSIVE — fall back to the First Derivative Test.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'A zero of f\'\' need not be an inflection point',
      content:
        'For $f(x) = x^4$, $f\'\'(x) = 12x^2$, which is zero at $x = 0$ but never negative, so $f\'\'$ does not change sign — there is NO inflection point at the origin (the curve stays concave up). The sign CHANGE, not the zero, defines an inflection.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When to prefer each test',
      content:
        'The Second Derivative Test is FASTER when $f\'\'$ is easy to evaluate and nonzero at the critical point. But the First Derivative Test ALWAYS works and is required whenever $f\'\'(c) = 0$ (inconclusive) or $f\'\'$ is hard to compute.',
    },
  ],
  methods: [
    {
      title: 'Find concavity intervals and inflection points',
      when_to_use:
        'When asked where $f$ is concave up or down, or to locate its inflection points.',
      steps: [
        'Compute $f\'\'(x)$.',
        'Find candidate inflection locations: solve $f\'\'(x) = 0$ and note where $f\'\'$ DNE.',
        'Sign-test $f\'\'$ on each interval between those candidates: $f\'\' > 0 \\Rightarrow$ concave up, $f\'\' < 0 \\Rightarrow$ concave down.',
        'Declare an INFLECTION POINT only where $f\'\'$ actually CHANGES sign; find its $y$-value from $f$.',
      ],
      example: {
        problem: 'Find the concavity and inflection point of $f(x) = x^3 - 3x^2 + 4$.',
        solution:
          '$f\'\'(x) = 6x - 6 = 6(x - 1)$. So $f\'\' < 0$ on $(-\\infty, 1)$ (concave DOWN) and $f\'\' > 0$ on $(1, \\infty)$ (concave UP). The sign changes at $x = 1$, giving an INFLECTION POINT at $(1, 2)$ since $f(1) = 2$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Classify critical points with the Second Derivative Test',
      when_to_use:
        'When $f\'(c) = 0$ and $f\'\'$ is convenient to evaluate — a quick alternative to the First Derivative Test.',
      steps: [
        'Find the critical points by solving $f\'(x) = 0$.',
        'Compute $f\'\'(x)$ and evaluate it at each critical point.',
        'Read the sign: $f\'\'(c) > 0 \\Rightarrow$ local MIN, $f\'\'(c) < 0 \\Rightarrow$ local MAX.',
        'If $f\'\'(c) = 0$, the test is INCONCLUSIVE — switch to the First Derivative Test (sign change of $f\'$).',
      ],
      example: {
        problem: 'Classify the critical points of $f(x) = -x^3 + 12x - 1$ using the Second Derivative Test.',
        solution:
          '$f\'(x) = -3x^2 + 12 = -3(x - 2)(x + 2)$, so the critical points are $x = \\pm 2$. Then $f\'\'(x) = -6x$: $f\'\'(2) = -12 < 0$, a local MAX with $f(2) = 15$; $f\'\'(-2) = 12 > 0$, a local MIN with $f(-2) = -17$. (Note $f\'\'(x) = 0$ at $x = 0$ gives an inflection point.)',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'An inflection point needs $f\'\'$ to CHANGE sign — verify the change; a mere zero of $f\'\'$ (as in $x^4$ at $x = 0$) does not qualify.', kind: 'common-error' },
    { content: 'If $f\'\'(c) = 0$, the Second Derivative Test says NOTHING — do not conclude "inflection" or "neither"; use the First Derivative Test instead.', kind: 'gotcha' },
    { content: 'Concave up means $f\'$ is INCREASING (slopes getting larger), concave down means $f\'$ is decreasing — a useful cross-check on graphical FRQs.', kind: 'tip' },
    { content: 'Report an inflection point as an ordered pair or an $x$-value with justification "$f\'\'$ changes sign here" — bare "$f\'\' = 0$" earns no credit.', kind: 'frq-vocab' },
    { content: 'Inflection points can occur where $f\'\'$ DNE (e.g. a vertical tangent), not only where $f\'\' = 0$ — check those locations too.', kind: 'edge-case' },
  ],
};
