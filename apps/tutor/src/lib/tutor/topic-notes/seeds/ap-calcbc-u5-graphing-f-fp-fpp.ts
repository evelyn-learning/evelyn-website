/**
 * AP Calculus BC — Unit 5 CED 5.8+5.9: Connecting f, f', f'' through graphs —
 * reading a function's behavior from the graph of its derivative(s) and
 * sketching f from f' (and f'').
 *
 * Baseline curated from evelyn.ap.calcbc.graphing-f-fp-fpp.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * seeds/ap-calcbc-u3-chain-rule.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, \dfrac, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.graphing-f-fp-fpp';

export const BASELINE_AP_CALCBC_GRAPHING_F_FP_FPP: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.graphing-f-fp-fpp.v1',
  course: 'AP Calculus BC',
  cedUnit: 5,
  cedTopic: '5.8-5.9',
  cedTitle: "Connecting f, f', f'' through Graphs",
  planId: 'evelyn.ap.calcbc.graphing-f-fp-fpp.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.graphing-f-fp-fpp.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading f from the graph of f\'',
      content:
        'From the graph of $f\'$: $f$ is INCREASING where $f\' > 0$ (graph above the axis) and DECREASING where $f\' < 0$ (below the axis). A LOCAL MAX of $f$ occurs where $f\'$ crosses zero from $+$ to $-$; a LOCAL MIN where $f\'$ crosses from $-$ to $+$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Concavity from the graph of f\'',
      content:
        'On the graph of $f\'$, the SLOPE of $f\'$ is $f\'\'$. So $f$ is CONCAVE UP where $f\'$ is INCREASING ($f\'\' > 0$) and CONCAVE DOWN where $f\'$ is decreasing ($f\'\' < 0$). An INFLECTION POINT of $f$ occurs where $f\'$ has a local MAX or MIN (a turning point of $f\'$).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading f from the graph of f\'\'',
      content:
        'From the graph of $f\'\'$ directly: $f$ is CONCAVE UP where $f\'\' > 0$ and CONCAVE DOWN where $f\'\' < 0$. Inflection points of $f$ occur where $f\'\'$ crosses zero with a SIGN CHANGE (a bare touch of the axis with no sign change is not an inflection).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The chain of information: f, f\', f\'\'',
      content:
        'Each derivative encodes the RATE of the one above it. $f\'$ is the slope of $f$; $f\'\'$ is the slope of $f\'$. So the SIGN of $f\'$ gives $f$\'s direction, the SIGN of $f\'\'$ gives $f$\'s curvature, and a turning point of $f\'$ (extremum of the slope) marks an inflection of $f$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Sketching f from f\'',
      content:
        'To sketch $f$ given its derivative $f\'$: use the SIGN of $f\'$ to draw the rising/falling pattern, mark LOCAL EXTREMA where $f\'$ crosses zero with a sign change, use the SLOPE of $f\'$ to decide concavity, and use the $y$-values of $f\'$ to gauge how STEEP $f$ is at each point.',
    },
  ],
  methods: [
    {
      title: 'Extract f\'s behavior from a given graph of f\'',
      when_to_use:
        'On AP-style problems that show the graph of $f\'$ (not $f$) and ask about increasing/decreasing, extrema, concavity, or inflection points of $f$.',
      steps: [
        'CONFIRM which function is graphed — reading $f\'$ as if it were $f$ is the classic error.',
        'Mark where $f\' > 0$ (f increasing) and $f\' < 0$ (f decreasing) by whether the graph is above or below the axis.',
        'Find local extrema of $f$ at the $x$-intercepts of $f\'$ WHERE it changes sign ($+ \\to -$ max, $- \\to +$ min).',
        'Read concavity from the SLOPE of $f\'$: rising $f\'$ means concave up, falling $f\'$ means concave down.',
        'Mark inflection points of $f$ at the turning points (local extrema) of $f\'$.',
      ],
      example: {
        problem:
          'The graph of $f\'$ starts at $f\'(0) = 5$, falls to $f\'(2) = 0$, reaches a minimum $f\'(4) = -3$, then rises back to $f\'(6) = 0$ and keeps rising. Describe $f$.',
        solution:
          '$f\' > 0$ on $(0, 2)$ and $(6, \\infty)$ so $f$ increases there; $f\' < 0$ on $(2, 6)$ so $f$ decreases. At $x = 2$, $f\'$ goes $+ \\to -$: local MAX of $f$; at $x = 6$, $- \\to +$: local MIN. $f\'$ decreases on $(0, 4)$ then increases, so $f$ is concave DOWN on $(0, 4)$, concave UP on $(4, \\infty)$, with an INFLECTION at $x = 4$ (the minimum of $f\'$).',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Translate sign conditions on f\' and f\'\' into a description of f',
      when_to_use:
        'When given sign information (intervals where $f\' > 0$/$< 0$ and $f\'\' > 0$/$< 0$) rather than a picture.',
      steps: [
        'Convert each $f\'$ sign interval into increasing (positive) or decreasing (negative) for $f$.',
        'Locate local extrema at the boundaries where $f\'$ switches sign.',
        'Convert each $f\'\'$ sign interval into concave up (positive) or concave down (negative).',
        'Locate inflection points where $f\'\'$ switches sign.',
      ],
      example: {
        problem:
          'Suppose $f\' > 0$ on $(-\\infty, 0)$ and $(3, \\infty)$, $f\' < 0$ on $(0, 3)$; and $f\'\' > 0$ on $(-\\infty, 1)$ and $(4, \\infty)$, $f\'\' < 0$ on $(1, 4)$. Describe $f$.',
        solution:
          '$f$ increases on $(-\\infty, 0)$ and $(3, \\infty)$, decreases on $(0, 3)$; local MAX at $x = 0$ ($+ \\to -$) and local MIN at $x = 3$ ($- \\to +$). $f$ is concave up on $(-\\infty, 1)$ and $(4, \\infty)$, concave down on $(1, 4)$; inflection points at $x = 1$ and $x = 4$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The single biggest error is treating the graph of $f\'$ as if it were $f$. Read the axis label first and keep straight which function you are looking at.', kind: 'common-error' },
    { content: 'The height ($y$-value) of $f\'$ is the SLOPE of $f$; the slope of $f\'$ is $f\'\'$. Height vs. slope answer different questions — do not confuse them.', kind: 'gotcha' },
    { content: 'An $x$-intercept of $f\'$ gives a local extremum of $f$ ONLY if $f\'$ changes sign there; a touch-and-return (no sign change) does not.', kind: 'edge-case' },
    { content: 'Inflection points of $f$ = turning points of $f\'$ = zeros of $f\'\'$ with a sign change — three equivalent readings that let you cross-check.', kind: 'tip' },
    { content: 'On an FRQ, justify each claim with the derivative\'s behavior ("$f\'$ changes from positive to negative"), not the shape of $f$ you inferred.', kind: 'frq-vocab' },
  ],
};
