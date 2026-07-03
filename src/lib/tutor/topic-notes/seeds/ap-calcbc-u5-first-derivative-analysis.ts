/**
 * AP Calculus BC — Unit 5 CED 5.3+5.4+5.5: First Derivative Analysis —
 * increasing/decreasing intervals, the First Derivative Test for local
 * extrema, and absolute extrema via the Candidates Test.
 *
 * Baseline curated from evelyn.ap.calcbc.first-derivative-analysis.v1 to the
 * gold standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * seeds/ap-calcbc-u3-chain-rule.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, \dfrac, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.first-derivative-analysis';

export const BASELINE_AP_CALCBC_FIRST_DERIVATIVE_ANALYSIS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.first-derivative-analysis.v1',
  course: 'AP Calculus BC',
  cedUnit: 5,
  cedTopic: '5.3-5.5',
  cedTitle: 'First Derivative Analysis',
  planId: 'evelyn.ap.calcbc.first-derivative-analysis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.first-derivative-analysis.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Increasing / Decreasing Test',
      content:
        'On an interval where $f\'(x) > 0$, the function $f$ is INCREASING; on an interval where $f\'(x) < 0$, $f$ is DECREASING. The SIGN of the derivative controls the direction of $f$. (Strictly monotone provided $f\' > 0$, or $f\' < 0$, except possibly at isolated points.)',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'First Derivative Test for local extrema',
      content:
        'At a critical point $x = c$ (where $f\'(c) = 0$ or $f\'(c)$ DNE): if $f\'$ changes from POSITIVE to NEGATIVE across $c$, then $f$ has a LOCAL MAX at $c$; if $f\'$ changes from NEGATIVE to POSITIVE, then $f$ has a LOCAL MIN; if $f\'$ does NOT change sign, then $c$ is neither a max nor a min.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'critical point',
      content:
        'A value $x = c$ in the domain of $f$ where $f\'(c) = 0$ OR $f\'(c)$ does not exist. Critical points are the CANDIDATES for local extrema, but not every critical point is an extremum.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'local vs. absolute extremum',
      content:
        'A LOCAL (relative) extremum is the max or min of $f$ over some open interval AROUND the point — it is about neighborhood behavior. An ABSOLUTE (global) extremum is the max or min over a WHOLE specified interval. A local extreme may or may not also be the absolute one.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Candidates Test for absolute extrema on [a, b]',
      content:
        'By EVT, a continuous $f$ on $[a,b]$ attains its absolute max and min at a critical point in $(a,b)$ or at an endpoint. Evaluate $f$ at every interior critical point AND at $a$ and $b$; the LARGEST value is the absolute max and the SMALLEST is the absolute min.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Critical point does NOT imply extremum',
      content:
        'A horizontal tangent is necessary but not sufficient for a local extremum. For $f(x) = x^3$, $f\'(x) = 3x^2$ so $f\'(0) = 0$, yet $f\' = 3x^2 \\ge 0$ on both sides — no sign change, so $x = 0$ is NOT an extremum (it is an inflection point with a horizontal tangent).',
    },
  ],
  methods: [
    {
      title: 'Find intervals of increase/decrease and classify local extrema',
      when_to_use:
        'When asked where $f$ is increasing or decreasing, or to locate and classify its local maxima and minima.',
      steps: [
        'Compute $f\'(x)$ and find all CRITICAL POINTS: solve $f\'(x) = 0$ and note where $f\'$ DNE.',
        'Place the critical points on a number line, splitting the domain into open test intervals.',
        'Pick a TEST VALUE in each interval and record the SIGN of $f\'$ there: $f\' > 0 \\Rightarrow$ increasing, $f\' < 0 \\Rightarrow$ decreasing.',
        'Apply the FIRST DERIVATIVE TEST at each critical point: sign $+ \\to -$ is a local MAX, $- \\to +$ is a local MIN, no change is neither.',
        'If asked for the extreme VALUES, substitute the critical $x$ back into $f$ (not $f\'$).',
      ],
      example: {
        problem: 'Analyze $f(x) = x^3 - 6x^2 + 9x + 1$ for increase/decrease and local extrema.',
        solution:
          '$f\'(x) = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$, so the critical points are $x = 1$ and $x = 3$. Sign of $f\'$: positive on $(-\\infty, 1)$, negative on $(1, 3)$, positive on $(3, \\infty)$. Thus $f$ increases on $(-\\infty, 1)$ and $(3, \\infty)$, decreases on $(1, 3)$. At $x = 1$: $+ \\to -$, local MAX with $f(1) = 5$; at $x = 3$: $- \\to +$, local MIN with $f(3) = 1$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find absolute extrema on a closed interval (Candidates Test)',
      when_to_use:
        'When $f$ is continuous on $[a,b]$ and you need the absolute (global) max and min over that interval.',
      steps: [
        'Find the critical points of $f$ that lie inside $(a,b)$.',
        'Evaluate $f$ at each of those critical points AND at both endpoints $a$ and $b$.',
        'Compare the values: the LARGEST is the absolute max, the SMALLEST is the absolute min.',
      ],
      example: {
        problem: 'Find the absolute extrema of $f(x) = x^4 - 8x^2 + 1$ on $[-3, 2]$.',
        solution:
          '$f\'(x) = 4x^3 - 16x = 4x(x - 2)(x + 2)$, so the critical points are $x = -2, 0, 2$ (all in the interval). Candidates: $f(-3) = 10$, $f(-2) = -15$, $f(0) = 1$, $f(2) = -15$. Absolute MAX $= 10$ at $x = -3$; absolute MIN $= -15$ at $x = -2$ and $x = 2$ (tied).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'A critical point is only a CANDIDATE. Always confirm a sign change of $f\'$ before calling it a max or a min.', kind: 'common-error' },
    { content: 'To justify a local max on an FRQ, state that $f\'$ changes from POSITIVE to NEGATIVE at the point — reading the sign chart is the argument the readers want.', kind: 'frq-vocab' },
    { content: 'Include points where $f\'$ DNE (corners, cusps, vertical tangents) as critical points, not just where $f\' = 0$.', kind: 'edge-case' },
    { content: 'Report extreme VALUES by plugging into $f$, and report LOCATIONS as $x$-values — mixing them up loses points.', kind: 'gotcha' },
    { content: 'Build a sign chart of $f\'$ once and read BOTH the monotonicity and the extrema off it — one diagram answers the whole problem.', kind: 'tip' },
  ],
};
