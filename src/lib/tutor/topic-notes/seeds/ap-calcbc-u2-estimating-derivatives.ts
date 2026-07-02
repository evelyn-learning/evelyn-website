/**
 * AP Calculus BC — Unit 2 CED 2.3: Estimating Derivatives of a Function at
 * a Point (numerically from tables, graphically from tangent slope).
 *
 * Curated from evelyn.ap.calcbc.estimating-derivatives.v1 to the gold standard
 * of seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every $...$ opens with
 * a non-digit.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.estimating-derivatives';

export const BASELINE_AP_CALCBC_ESTIMATING_DERIVATIVES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.estimating-derivatives.v1',
  course: 'AP Calculus BC',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Estimating Derivatives at a Point',
  planId: 'evelyn.ap.calcbc.estimating-derivatives.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.estimating-derivatives.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Why estimate — data without a formula',
      content:
        'When you have $f$-values at discrete inputs (a table) but no formula, you cannot take a limit. Instead you APPROXIMATE $f\'(a)$ with a difference quotient built from the data points you have. The AP exam tests this constantly ("here is a table; estimate $f\'(a)$").',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Forward difference quotient',
      content:
        'Using a point AFTER $a$: $f\'(a) \\approx \\dfrac{f(a+h)-f(a)}{h}$. One-sided; use when data only extends to the right of $a$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Backward difference quotient',
      content:
        'Using a point BEFORE $a$: $f\'(a) \\approx \\dfrac{f(a)-f(a-h)}{h}$. One-sided; use when data only extends to the left of $a$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Symmetric (centered) difference quotient',
      content:
        'Using points on BOTH sides: $f\'(a) \\approx \\dfrac{f(a+h)-f(a-h)}{2h}$. It equals the average of the forward and backward estimates and is generally the most accurate — error is $O(h^2)$ versus $O(h)$ for the one-sided forms. AP convention: prefer this when the table gives equally-spaced points on both sides of $a$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Graphical estimation',
      content:
        'From a graph, sketch (or picture) the tangent line at $(a, f(a))$, pick two clear points on that tangent, and compute rise over run. The tangent slope IS $f\'(a)$; do not read two curve points as if the secant equals the tangent.',
    },
  ],
  methods: [
    {
      title: 'Estimate f\'(a) from a table of values',
      when_to_use:
        'When given a table of $(x, f(x))$ pairs and asked to approximate the derivative at some listed input $a$.',
      steps: [
        'Check which data are available around $a$: points on both sides, or only one side.',
        'If both sides at equal spacing exist, use the symmetric form $\\dfrac{f(a+h)-f(a-h)}{2h}$ (most accurate).',
        'If only one side exists, use forward $\\dfrac{f(a+h)-f(a)}{h}$ or backward $\\dfrac{f(a)-f(a-h)}{h}$ as appropriate.',
        'Compute the difference quotient with the ACTUAL spacing from the table (the denominator is the true $x$-gap, not a guessed $h$).',
        'Attach units: units of $f$ per unit of $x$.',
      ],
      example: {
        problem:
          'A table gives $g(1.0)=4.0$, $g(1.2)=4.36$, $g(1.4)=4.84$. Estimate $g\'(1.2)$.',
        solution:
          'Both sides of $x=1.2$ are available, so use the symmetric form: $g\'(1.2) \\approx \\dfrac{g(1.4)-g(1.0)}{1.4-1.0} = \\dfrac{4.84-4.0}{0.4} = \\dfrac{0.84}{0.4} = 2.1$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Prefer the SYMMETRIC difference quotient whenever equally-spaced points sit on both sides of $a$ — its curvature errors cancel, giving $O(h^2)$ accuracy.', kind: 'tip' },
    { content: 'The denominator is the real $x$-gap between the points you use. For a symmetric estimate it spans BOTH steps (the full width, not a single $h$) — a common place to drop a factor of two.', kind: 'common-error' },
    { content: 'At the FIRST or LAST table entry you have data on only one side, so you must use a one-sided (forward or backward) estimate — symmetric is not available.', kind: 'edge-case' },
    { content: 'On the graph, use the TANGENT line\'s slope, not the slope between two points on the curve (that is a secant, which only approximates).', kind: 'gotcha' },
    { content: 'FRQ language: an estimate of $f\'(a)$ from a table is an "approximation of the instantaneous rate of change of $f$ at $x=a$"; always state units.', kind: 'frq-vocab' },
  ],
};
