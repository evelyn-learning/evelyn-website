/**
 * AP Calculus BC — Unit 6 CED 6.1–6.3: Riemann Sums and Definite Integral
 * Notation.
 *
 * Baseline curated from evelyn.ap.calcbc.riemann-sums.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with
 * when_to_use + a worked example, pointers are a kind mix (tip / frq-vocab /
 * gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, \Delta, \sum, a letter, "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.riemann-sums';

export const BASELINE_AP_CALCBC_RIEMANN_SUMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.riemann-sums.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.1-6.3',
  cedTitle: 'Riemann Sums and Definite Integral Notation',
  planId: 'evelyn.ap.calcbc.riemann-sums.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.riemann-sums.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Riemann sum and the subinterval width',
      content:
        'To approximate the area under $f$ on $[a,b]$, cut the interval into $n$ equal subintervals of width $\\Delta x = \\dfrac{b-a}{n}$, build one rectangle per subinterval, and add their areas: $\\displaystyle\\sum_{i=1}^{n} f(x_i^{*})\\,\\Delta x$, where $x_i^{*}$ is a sample point inside the $i$-th subinterval.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing the sample points: LRAM, RRAM, MRAM',
      content:
        'The rule differs only in WHERE the rectangle height is read. LRAM uses the LEFT endpoint $x_{i-1}$; RRAM uses the RIGHT endpoint $x_i$; MRAM uses the MIDPOINT $\\tfrac{x_{i-1}+x_i}{2}$ and is usually the most accurate of the three.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The trapezoidal rule',
      content:
        'Trapezoids replace flat-topped rectangles with slanted chords: $T_n = \\dfrac{\\Delta x}{2}\\big[f(x_0) + 2f(x_1) + 2f(x_2) + \\cdots + 2f(x_{n-1}) + f(x_n)\\big]$. The interior heights are doubled because each is shared by two adjacent trapezoids; equivalently $T_n = \\tfrac{1}{2}(\\text{LRAM} + \\text{RRAM})$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The definite integral as a limit of Riemann sums',
      content:
        'Letting the partition get infinitely fine gives the exact area: $\\displaystyle\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty}\\sum_{i=1}^{n} f(x_i^{*})\\,\\Delta x$. This LIMIT is the definition of the definite integral — the Riemann sum made perfect.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Integral notation and signed area',
      content:
        'In $\\displaystyle\\int_a^b f(x)\\,dx$: $\\int$ is the integral sign, $a$ and $b$ are the lower/upper LIMITS, $f(x)$ is the INTEGRAND, and $dx$ names the variable of integration. Geometrically it is SIGNED area: regions above the $x$-axis count positive, regions below count negative.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Over- vs under-estimation from shape',
      content:
        'Monotonicity fixes LRAM vs RRAM; concavity fixes MRAM vs trapezoidal. For INCREASING $f$: LRAM underestimates, RRAM overestimates (decreasing $f$ reverses them). For CONCAVE-UP $f$: the trapezoidal rule OVERestimates (chords sit above the curve) and MRAM UNDERestimates; concave-down reverses both.',
    },
  ],
  methods: [
    {
      title: 'Approximate a definite integral with a Riemann sum',
      when_to_use:
        'When asked to estimate $\\displaystyle\\int_a^b f(x)\\,dx$ using LRAM, RRAM, MRAM, or the trapezoidal rule with a given $n$ (from a formula, a graph, or a table of values).',
      steps: [
        'Compute the width $\\Delta x = \\dfrac{b-a}{n}$ and list the grid points $x_0, x_1, \\ldots, x_n$.',
        'Pick the sample point per subinterval: LEFT ($x_{i-1}$), RIGHT ($x_i$), or MIDPOINT — matching the requested rule.',
        'Evaluate $f$ at each sample point to get the rectangle heights.',
        'Multiply the sum of heights by $\\Delta x$ (for trapezoidal, use $\\tfrac{\\Delta x}{2}$ and double the interior heights).',
        'If asked, compare to the exact value to state whether the estimate is an over- or under-approximation.',
      ],
      example: {
        problem:
          'Approximate $\\displaystyle\\int_0^4 x^2\\,dx$ with $n=4$ using LRAM, RRAM, and MRAM.',
        solution:
          'Here $\\Delta x = \\dfrac{4-0}{4} = 1$ with grid $x = 0,1,2,3,4$. LRAM uses left heights $f(0),f(1),f(2),f(3)$: $= 0+1+4+9 = 14$. RRAM uses right heights $f(1),f(2),f(3),f(4)$: $= 1+4+9+16 = 30$. MRAM uses midpoints $x = 0.5,1.5,2.5,3.5$: $= 0.25+2.25+6.25+12.25 = 21$. The exact value is $\\tfrac{64}{3}\\approx 21.33$, so LRAM under-, RRAM over-, and MRAM is closest.',
      },
      diagram: {
        type: 'riemann_sum',
        params: {
          curve: [
            [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4],
            [2.5, 6.25], [3, 9], [3.5, 12.25], [4, 16],
          ],
          rectangles: [[0, 1, 0], [1, 1, 1], [2, 1, 4], [3, 1, 9]],
          xMin: 0, xMax: 4, yMin: 0, yMax: 16,
          method: 'left', n: 4,
          exprLabel: 'f(x) = x^2',
          approxArea: 14, exactArea: 21.333,
          title: 'LRAM approximation of the integral of x^2 on [0, 4], n = 4',
        },
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide whether an estimate is an over- or under-approximation',
      when_to_use:
        'AP-style questions that give the sign of $f\'$ (increasing/decreasing) and $f\'\'$ (concavity) and ask you to rank the estimates or classify one as over/under.',
      steps: [
        'Determine whether $f$ is increasing or decreasing on the interval — this settles LRAM vs RRAM.',
        'Determine the concavity of $f$ — this settles MRAM (tangent-like) vs trapezoidal (chord-based).',
        'Apply the rules: increasing ⇒ LRAM under, RRAM over; concave-up ⇒ trapezoidal over, MRAM under.',
        'Order the estimates and the exact value accordingly, justifying each comparison with the shape argument.',
      ],
      example: {
        problem:
          'For $f(x)=x^2$ on $[0,4]$ (increasing, concave up), order LRAM, MRAM, exact, trapezoidal, and RRAM.',
        solution:
          'Increasing ⇒ LRAM is smallest, RRAM largest. Concave up ⇒ MRAM under and trapezoidal over the exact value. So $\\text{LRAM}(14) < \\text{MRAM}(21) < \\text{exact}\\,(21.33) < \\text{trap}\\,(22) < \\text{RRAM}(30)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Multiply by $\\Delta x$ exactly once — a Riemann sum is (sum of heights)$\\times\\Delta x$, not the sum of heights alone.', kind: 'common-error' },
    { content: 'On the trapezoidal rule, DOUBLE every interior height but never the two endpoints $f(a)$ and $f(b)$ — forgetting the factor of 2 is the classic slip.', kind: 'gotcha' },
    { content: 'For a table with UNEQUAL subinterval widths, do not use $\\Delta x = \\tfrac{b-a}{n}$ — sum each trapezoid $\\tfrac{x_i - x_{i-1}}{2}\\,[f(x_{i-1})+f(x_i)]$ separately.', kind: 'edge-case' },
    { content: 'To justify "overestimate" on an FRQ, cite the SHAPE: e.g. "$f$ is increasing, so each left rectangle lies below the curve," not just the numeric comparison.', kind: 'frq-vocab' },
    { content: 'MRAM with $n$ midpoints usually beats LRAM/RRAM with the same $n$; when accuracy matters and you may choose, prefer midpoint or trapezoidal.', kind: 'tip' },
  ],
};
