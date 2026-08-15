/**
 * AP Calculus BC — Unit 5 CED 5.1+5.2: Mean Value Theorem and Extreme
 * Value Theorem.
 *
 * Baseline curated from evelyn.ap.calcbc.mvt-evt.v1 to the gold standard set by
 * seeds/ap-calcbc-u1-defining-limits.ts + seeds/ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with
 * when_to_use + a worked example, pointers are a kind mix (tip / frq-vocab /
 * gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, \dfrac, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.mvt-evt';

export const BASELINE_AP_CALCBC_MVT_EVT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.mvt-evt.v1',
  course: 'AP Calculus BC',
  cedUnit: 5,
  cedTopic: '5.1-5.2',
  cedTitle: 'MVT and EVT',
  planId: 'evelyn.ap.calcbc.mvt-evt.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.mvt-evt.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Mean Value Theorem (MVT)',
      content:
        'If $f$ is CONTINUOUS on the closed interval $[a,b]$ AND DIFFERENTIABLE on the open interval $(a,b)$, then there exists at least one $c \\in (a,b)$ such that $f\'(c) = \\dfrac{f(b) - f(a)}{b - a}$. In words: somewhere inside the interval the INSTANTANEOUS rate of change equals the AVERAGE (secant) rate of change over $[a,b]$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Geometric meaning of MVT',
      content:
        'The quotient $\\dfrac{f(b) - f(a)}{b - a}$ is the slope of the SECANT line through $(a, f(a))$ and $(b, f(b))$. MVT guarantees at least one interior point $c$ where the TANGENT line has that same slope — i.e. the tangent at $x = c$ is PARALLEL to the secant.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Rolle\'s Theorem (special case of MVT)',
      content:
        'If $f$ is continuous on $[a,b]$, differentiable on $(a,b)$, AND $f(a) = f(b)$, then there exists $c \\in (a,b)$ with $f\'(c) = 0$. This is MVT with a secant slope of zero: equal endpoints force a horizontal tangent somewhere inside.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Extreme Value Theorem (EVT)',
      content:
        'If $f$ is CONTINUOUS on a CLOSED interval $[a,b]$, then $f$ attains BOTH an absolute maximum and an absolute minimum on $[a,b]$. Each extreme value occurs either at a CRITICAL POINT inside $(a,b)$ or at an ENDPOINT $a$ or $b$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'critical point',
      content:
        'A value $x = c$ in the domain of $f$ where $f\'(c) = 0$ OR $f\'(c)$ does not exist (DNE). Critical points are the only interior locations where a local extremum can occur.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Contrasting the hypotheses',
      content:
        'The two theorems require DIFFERENT amounts of smoothness. MVT needs continuity on $[a,b]$ AND differentiability on $(a,b)$, and concludes a specific tangent slope exists. EVT needs ONLY continuity on $[a,b]$, and concludes absolute extrema exist. A corner (e.g. $y = |x|$) can satisfy EVT but fail MVT.',
    },
  ],
  methods: [
    {
      title: 'Verify MVT applies and find the guaranteed value(s) of c',
      when_to_use:
        'When asked to confirm MVT\'s hypotheses on $[a,b]$ and to produce the interior point(s) $c$ where the tangent slope equals the secant slope.',
      steps: [
        'CHECK HYPOTHESES: confirm $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$ (polynomials, and sums/products of elementary functions on their domains, qualify).',
        'Compute the SECANT SLOPE $\\dfrac{f(b) - f(a)}{b - a}$.',
        'Compute $f\'(x)$ and SET it equal to the secant slope: $f\'(c) = \\dfrac{f(b) - f(a)}{b - a}$.',
        'Solve for $c$ and KEEP only the solutions lying in the open interval $(a,b)$.',
      ],
      example: {
        problem: 'Verify MVT for $f(x) = x^2$ on $[a,b] = [1,4]$ and find $c$.',
        solution:
          '$f$ is a polynomial, so it is continuous on $[1,4]$ and differentiable on $(1,4)$. Secant slope $= \\dfrac{f(4) - f(1)}{4 - 1} = \\dfrac{16 - 1}{3} = 5$. Since $f\'(x) = 2x$, the condition $f\'(c) = 2c = 5$ gives $c = \\tfrac{5}{2} = 2.5 \\in (1,4)$. At $x = 2.5$ the tangent slope equals the secant slope, namely $f\'(2.5) = 5$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find absolute extrema on a closed interval (Candidates Test)',
      when_to_use:
        'When EVT applies ($f$ continuous on $[a,b]$) and you need the absolute max and min on that interval.',
      steps: [
        'Confirm $f$ is continuous on the CLOSED interval $[a,b]$ so EVT guarantees the extrema exist.',
        'Find all CRITICAL POINTS in $(a,b)$: solve $f\'(x) = 0$ and note where $f\'$ DNE.',
        'Evaluate $f$ at every interior critical point AND at both endpoints $a$ and $b$ — these are the "candidates."',
        'The LARGEST candidate value is the absolute max; the SMALLEST is the absolute min (ties are allowed).',
      ],
      example: {
        problem: 'Find the absolute max and min of $f(x) = x^3 - 3x$ on $[-2, 3]$.',
        solution:
          '$f$ is a polynomial, so EVT applies. $f\'(x) = 3x^2 - 3 = 0$ gives $x = \\pm 1$, both interior. Candidates: $f(-2) = -2$, $f(-1) = 2$, $f(1) = -2$, $f(3) = 18$. Absolute MAX $= 18$ at $x = 3$ (endpoint); absolute MIN $= -2$ at $x = -2$ and $x = 1$ (tied).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'MVT and EVT are EXISTENCE theorems: they guarantee a point $c$ (or an extreme value) EXISTS but never that it is unique — there may be several valid $c$.', kind: 'tip' },
    { content: 'On an FRQ, MVT credit requires you to STATE that $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$ before invoking the conclusion.', kind: 'frq-vocab' },
    { content: 'EVT needs a CLOSED, BOUNDED interval and CONTINUITY. On an open interval like $(a,b)$, or with a discontinuity, the max or min may not be attained.', kind: 'edge-case' },
    { content: 'A corner such as $f(x) = |x|$ on $[-1,1]$ is continuous but not differentiable at $x = 0$, so MVT does NOT apply even though EVT does.', kind: 'gotcha' },
    { content: 'Do not forget the ENDPOINTS in the Candidates Test — the absolute extreme is often at $a$ or $b$, not at an interior critical point.', kind: 'common-error' },
  ],
};
