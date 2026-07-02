/**
 * AP Calculus BC — Unit 8 CED 8.13: Arc Length (BC only).
 *
 * Baseline curated from evelyn.ap.calcbc.arc-length.v1 to the gold standard set
 * by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry carries
 * kind+title, methods are humanized with when_to_use + a worked example,
 * pointers are a kind mix (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, a letter, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.arc-length';

export const BASELINE_AP_CALCBC_ARC_LENGTH: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.arc-length.v1',
  course: 'AP Calculus BC',
  cedUnit: 8,
  cedTopic: '8.13',
  cedTitle: 'Arc Length (BC)',
  planId: 'evelyn.ap.calcbc.arc-length.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.arc-length.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Arc length of y = f(x)',
      content:
        'For a smooth curve $y = f(x)$ on $[a,b]$, the arc length is $L = \\int_a^b \\sqrt{1 + [f\'(x)]^2}\\,dx$. Each infinitesimal piece of arc contributes $\\sqrt{1 + (dy/dx)^2}\\,dx$; integrating sums them into the total length of the curve.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Where the formula comes from',
      content:
        'A tiny arc segment is nearly straight, so by the Pythagorean theorem $ds = \\sqrt{dx^2 + dy^2}$. Factor out $dx$: $ds = \\sqrt{1 + (dy/dx)^2}\\,dx$. Summing $ds$ over $[a,b]$ gives $L = \\int_a^b \\sqrt{1 + (dy/dx)^2}\\,dx$ — the arc-length integral is just accumulated $ds$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Arc length of x = g(y)',
      content:
        'When the curve is naturally a function of $y$, integrate in $y$: $L = \\int_c^d \\sqrt{1 + [g\'(y)]^2}\\,dy = \\int_c^d \\sqrt{1 + (dx/dy)^2}\\,dy$. Choose this form when $x = g(y)$ is simpler or when $dy/dx$ is undefined (vertical tangents).',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Parametric arc length (preview)',
      content:
        'For a parametric curve $x(t)$, $y(t)$ on $[\\alpha,\\beta]$, $L = \\int_\\alpha^\\beta \\sqrt{(dx/dt)^2 + (dy/dt)^2}\\,dt$. This general form (revisited in Unit 9) reduces to the $y = f(x)$ formula when $x = t$. It also gives polar arc length after converting $x = r\\cos\\theta$, $y = r\\sin\\theta$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'arc length (one-line)',
      content: '$L = \\int_a^b \\sqrt{1 + [f\'(x)]^2}\\,dx$ — the length of a curve between two points.',
    },
  ],
  methods: [
    {
      title: 'Compute arc length where the integrand simplifies',
      when_to_use:
        'Given $y = f(x)$ (or $x = g(y)$) on an interval and asked for an EXACT arc length; the function is chosen so $(y\')^2 + 1$ collapses to a perfect radicand.',
      steps: [
        'Differentiate to get $f\'(x)$ and square it.',
        'Form $[f\'(x)]^2 + 1$ and simplify — good AP problems make this a clean expression under the root.',
        'Write $L = \\int_a^b \\sqrt{1 + [f\'(x)]^2}\\,dx$.',
        'Evaluate, typically with a $u$-substitution on the radicand.',
      ],
      example: {
        problem: 'Find the arc length of $y = \\tfrac{2}{3}x^{3/2}$ on $[0,3]$.',
        solution:
          '$y\' = x^{1/2}$, so $(y\')^2 + 1 = x + 1$. $L = \\int_0^3 \\sqrt{x + 1}\\,dx$. Let $u = x + 1$ (bounds $u=1$ to $u=4$): $\\int_1^4 \\sqrt{u}\\,du = \\big[\\tfrac{2}{3}u^{3/2}\\big]_1^4 = \\tfrac{2}{3}(8 - 1) = \\tfrac{14}{3}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Set up an arc-length integral that has no elementary antiderivative',
      when_to_use:
        'When asked to SET UP (and possibly numerically evaluate) an arc length whose integrand does not simplify — the common AP free-response task.',
      steps: [
        'Compute $f\'(x)$ and substitute directly into $\\sqrt{1 + [f\'(x)]^2}$.',
        'Write the definite integral with the correct limits — do NOT force an antiderivative.',
        'If a value is required, evaluate numerically (calculator) and report three decimals.',
      ],
      example: {
        problem: 'Set up the arc length of $y = \\sin x$ on $[0,\\pi]$ (do not evaluate by hand).',
        solution:
          '$y\' = \\cos x$, so $L = \\int_0^\\pi \\sqrt{1 + \\cos^2 x}\\,dx$. This has no elementary antiderivative (an elliptic integral); numerically $L \\approx 3.820$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The integrand is $\\sqrt{1 + (y\')^2}$, NOT $\\sqrt{1 + y^2}$ — you square the DERIVATIVE, not the function.', kind: 'common-error' },
    { content: 'Most arc-length integrands have no elementary antiderivative; AP usually asks you to SET UP the integral (and evaluate numerically), so do not waste time hunting for a closed form.', kind: 'gotcha' },
    { content: 'Curves like $y = \\tfrac{2}{3}x^{3/2}$ are chosen precisely because $(y\')^2 + 1$ becomes a perfect expression under the root — look for that structure on no-calculator parts.', kind: 'tip' },
    { content: 'If the curve has a vertical tangent (where $dy/dx$ blows up), switch to the $x = g(y)$ form $\\int \\sqrt{1 + (dx/dy)^2}\\,dy$.', kind: 'edge-case' },
    { content: 'For full credit, state the arc-length integral with correct limits and integrand before evaluating; on FRQs the SETUP carries most of the points.', kind: 'frq-vocab' },
  ],
};
