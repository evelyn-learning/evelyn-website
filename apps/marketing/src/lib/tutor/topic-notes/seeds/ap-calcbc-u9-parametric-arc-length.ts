/**
 * AP Calculus BC — Unit 9 CED 9.3: Arc Length of Parametric Curves.
 *
 * Baseline curated from evelyn.ap.calcbc.parametric-arc-length.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * ap-calcbc-u3-chain-rule.ts: every theory entry carries kind+title, methods
 * are humanized with when_to_use + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, L, a letter, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.parametric-arc-length';

export const BASELINE_AP_CALCBC_PARAMETRIC_ARC_LENGTH: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.parametric-arc-length.v1',
  course: 'AP Calculus BC',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Parametric Arc Length',
  planId: 'evelyn.ap.calcbc.parametric-arc-length.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.parametric-arc-length.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Parametric arc length',
      content:
        'The length of the parametric curve $x = f(t),\\ y = g(t)$ from $t = \\alpha$ to $t = \\beta$ is $L = \\displaystyle\\int_\\alpha^\\beta \\sqrt{\\left(\\dfrac{dx}{dt}\\right)^2 + \\left(\\dfrac{dy}{dt}\\right)^2}\\,dt$. The integrand is the SPEED of the point tracing the curve.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Where the formula comes from',
      content:
        'From $ds^2 = dx^2 + dy^2$, factor out $dt^2$: $ds = \\sqrt{(dx/dt)^2 + (dy/dt)^2}\\,dt$. Summing $ds$ over the curve gives the integral. Geometrically, each infinitesimal step has horizontal part $\\dfrac{dx}{dt}\\,dt$ and vertical part $\\dfrac{dy}{dt}\\,dt$; the hypotenuse is $ds$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Connection to the $y = f(x)$ formula',
      content:
        'If $x = t$ and $y = f(t)$, then $\\dfrac{dx}{dt} = 1$ and $\\dfrac{dy}{dt} = f\'(t)$, so $L = \\displaystyle\\int \\sqrt{1 + \\big(f\'(t)\\big)^2}\\,dt$ — exactly the Unit 8 single-variable arc-length formula. Parametric arc length GENERALIZES it to curves that are not graphs of a function.',
    },
    {
      loId: LO,
      kind: 'edge-case',
      title: 'Circular motion simplifies via the Pythagorean identity',
      content:
        'For $x = a\\cos t,\\ y = a\\sin t$, $\\left(\\dfrac{dx}{dt}\\right)^2 + \\left(\\dfrac{dy}{dt}\\right)^2 = a^2\\sin^2 t + a^2\\cos^2 t = a^2$, so $\\sqrt{\\cdot} = |a|$ is constant. The arc length is just $|a|\\cdot(\\beta - \\alpha)$ — no hard integral.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'parametric arc length (one-line)',
      content: '$L = \\displaystyle\\int_\\alpha^\\beta \\sqrt{(dx/dt)^2 + (dy/dt)^2}\\,dt$ — integrate the speed of the tracing point.',
    },
  ],
  methods: [
    {
      title: 'Compute the arc length of a parametric curve',
      when_to_use:
        'Given $x(t)$, $y(t)$ and endpoints $t = \\alpha$, $t = \\beta$, and asked for the length of the curve.',
      steps: [
        'Compute $\\dfrac{dx}{dt}$ and $\\dfrac{dy}{dt}$.',
        'Form $\\left(\\dfrac{dx}{dt}\\right)^2 + \\left(\\dfrac{dy}{dt}\\right)^2$ and SIMPLIFY (factor, use $\\sin^2 + \\cos^2 = 1$).',
        'Take the square root; watch the sign so the radical is nonnegative on $[\\alpha, \\beta]$.',
        'Integrate from $\\alpha$ to $\\beta$; use a $u$-substitution if the radical hides a perfect setup.',
        'If the integral has no elementary antiderivative, leave it in setup form or evaluate numerically on a calculator.',
      ],
      example: {
        problem: 'Find the arc length of $x = 3t^2$, $y = 2t^3$ from $t = 0$ to $t = 1$.',
        solution:
          '$\\dfrac{dx}{dt} = 6t$, $\\dfrac{dy}{dt} = 6t^2$, so $(dx/dt)^2 + (dy/dt)^2 = 36t^2 + 36t^4 = 36t^2(1 + t^2)$ and $\\sqrt{\\cdot} = 6t\\sqrt{1 + t^2}$ for $t \\ge 0$. Then $L = \\displaystyle\\int_0^1 6t\\sqrt{1 + t^2}\\,dt$; with $u = 1 + t^2$, $\\tfrac{1}{2}\\,du = t\\,dt$, giving $\\displaystyle\\int_1^2 3\\sqrt{u}\\,du = 2\\big(2^{3/2} - 1\\big) = 4\\sqrt{2} - 2$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Set up (but not evaluate) an arc-length integral',
      when_to_use:
        'AP problems that ask only to SET UP the integral, or where the antiderivative is non-elementary.',
      steps: [
        'Differentiate to get $\\dfrac{dx}{dt}$ and $\\dfrac{dy}{dt}$.',
        'Substitute directly into $L = \\displaystyle\\int_\\alpha^\\beta \\sqrt{(dx/dt)^2 + (dy/dt)^2}\\,dt$.',
        'Simplify the radicand only as far as is clean; keep the exact limits $\\alpha$ and $\\beta$.',
        'Stop — write the integral. Do not force an antiderivative that does not exist.',
      ],
      example: {
        problem: 'Set up the arc length of $x = t^2$, $y = \\ln t$ from $t = 1$ to $t = e$.',
        solution:
          '$\\dfrac{dx}{dt} = 2t$, $\\dfrac{dy}{dt} = \\dfrac{1}{t}$, so $(dx/dt)^2 + (dy/dt)^2 = 4t^2 + \\dfrac{1}{t^2} = \\dfrac{4t^4 + 1}{t^2}$ and $\\sqrt{\\cdot} = \\dfrac{\\sqrt{4t^4 + 1}}{t}$ for $t > 0$. Thus $L = \\displaystyle\\int_1^e \\dfrac{\\sqrt{4t^4 + 1}}{t}\\,dt$ (leave unevaluated).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Square the DERIVATIVES $\\dfrac{dx}{dt}$ and $\\dfrac{dy}{dt}$, not $x$ and $y$ — a frequent slip when the integrand is written out.', kind: 'common-error' },
    { content: 'When you take $\\sqrt{(dx/dt)^2 + (dy/dt)^2}$, keep the radical $\\ge 0$: if a coefficient-times-$t$ factor can go negative on the interval, wrap it in absolute values, e.g. write $|6t|$.', kind: 'gotcha' },
    { content: 'On the AP exam, "set up an integral for the length" wants the full $\\int_\\alpha^\\beta \\sqrt{\\cdots}\\,dt$ with correct limits — a bare formula with no bounds loses the point.', kind: 'frq-vocab' },
    { content: 'Total distance traveled by a 2D particle equals the arc length of its path: $\\displaystyle\\int_\\alpha^\\beta |v(t)|\\,dt$ uses the same integrand (the speed).', kind: 'tip' },
    { content: 'If the same physical curve is retraced (parameter covers it twice), the arc-length integral counts the length TWICE — check the parameter range matches one pass.', kind: 'edge-case' },
  ],
};
