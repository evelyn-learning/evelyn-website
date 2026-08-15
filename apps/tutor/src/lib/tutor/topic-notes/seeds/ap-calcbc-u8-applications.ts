/**
 * AP Calculus BC — Unit 8 CED 8.1–8.3: Average value, motion from rates,
 * and accumulation applications.
 *
 * Baseline curated from evelyn.ap.calcbc.integral-applications.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry
 * carries kind+title, methods are humanized with when_to_use + a worked
 * example, pointers are a kind mix (tip / frq-vocab / gotcha / edge-case /
 * common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\frac, a letter, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.integral-applications';

export const BASELINE_AP_CALCBC_APPLICATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.integral-applications.v1',
  course: 'AP Calculus BC',
  cedUnit: 8,
  cedTopic: '8.1-8.3',
  cedTitle: 'Applications of Integration',
  planId: 'evelyn.ap.calcbc.integral-applications.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.integral-applications.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Average value of a function',
      content:
        'The AVERAGE VALUE of a continuous $f$ on $[a,b]$ is $f_{\\text{avg}} = \\dfrac{1}{b-a}\\int_a^b f(x)\\,dx$. It is the single constant height whose rectangle over $[a,b]$ has the same area (same total integral) as $f$. Equivalently, $f_{\\text{avg}}\\cdot(b-a) = \\int_a^b f(x)\\,dx$.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Mean Value Theorem for Integrals',
      content:
        'If $f$ is continuous on $[a,b]$, there exists at least one $c$ in $[a,b]$ with $f(c) = f_{\\text{avg}} = \\dfrac{1}{b-a}\\int_a^b f(x)\\,dx$. The function actually ATTAINS its average value somewhere on the interval — this guarantees the average is a real output of $f$, not just an abstraction.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Motion: position, velocity, acceleration',
      content:
        'For a particle on a line, position is $s(t)$, velocity $v(t) = s\'(t)$, and acceleration $a(t) = v\'(t) = s\'\'(t)$. Integration reverses this chain: $\\int v\\,dt$ recovers position (up to a constant), and $\\int a\\,dt$ recovers velocity. The sign of $v$ tells DIRECTION; the sign of $a$ relative to $v$ tells whether the particle speeds up or slows down.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Displacement vs. total distance',
      content:
        'DISPLACEMENT (signed net change in position) from $t=a$ to $t=b$ is $\\int_a^b v(t)\\,dt = s(b) - s(a)$. TOTAL DISTANCE traveled is $\\int_a^b \\lvert v(t)\\rvert\\,dt$. They agree only when $v$ never changes sign; whenever the particle reverses, distance exceeds the magnitude of displacement.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Accumulation from a rate',
      content:
        'If $R(t)$ is a RATE (e.g. gallons per hour), then $\\int_a^b R(t)\\,dt$ is the TOTAL amount accumulated between $t=a$ and $t=b$ (e.g. gallons). More generally the accumulation function $F(x) = \\int_a^x R(t)\\,dt$ tracks the running total. Answers must carry UNITS: rate-units $\\times$ time-units cancel to the accumulated quantity.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'average value (one-line)',
      content: '$f_{\\text{avg}} = \\dfrac{1}{b-a}\\int_a^b f(x)\\,dx$ — the constant with the same integral over $[a,b]$.',
    },
  ],
  methods: [
    {
      title: 'Compute the average value of a function',
      when_to_use:
        'When asked for the average value of $f$ over $[a,b]$, or the average rate/temperature/velocity over an interval.',
      steps: [
        'Write $f_{\\text{avg}} = \\dfrac{1}{b-a}\\int_a^b f(x)\\,dx$ and identify $a$, $b$.',
        'Compute the definite integral $\\int_a^b f(x)\\,dx$ with an antiderivative (or the calculator on a numeric part).',
        'Divide by the interval length $b-a$.',
        'If the problem asks for the $c$ from the MVT for integrals, solve $f(c) = f_{\\text{avg}}$ for $c$ in $[a,b]$.',
      ],
      example: {
        problem: 'Find the average value of $f(x) = x^2 + 1$ on $[0,3]$.',
        solution:
          '$f_{\\text{avg}} = \\dfrac{1}{3-0}\\int_0^3 (x^2 + 1)\\,dx = \\tfrac{1}{3}\\big[\\tfrac{x^3}{3} + x\\big]_0^3 = \\tfrac{1}{3}(9 + 3) = \\tfrac{1}{3}(12) = 4$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find displacement and total distance from a velocity function',
      when_to_use:
        'Given $v(t)$ on $[a,b]$ and asked for net change in position (displacement) and/or the total distance traveled.',
      steps: [
        'DISPLACEMENT: integrate the signed velocity, $\\int_a^b v(t)\\,dt$.',
        'For DISTANCE, first find where $v$ changes sign: solve $v(t) = 0$ on $(a,b)$.',
        'Split $[a,b]$ at those sign changes and integrate $\\lvert v\\rvert$ on each piece (flip the sign of $v$ on intervals where $v < 0$).',
        'Add the non-negative pieces to get $\\int_a^b \\lvert v(t)\\rvert\\,dt$.',
      ],
      example: {
        problem: 'A particle has $v(t) = t^2 - 4$ (m/s) on $[0,3]$. Find (a) the displacement and (b) the total distance.',
        solution:
          '(a) $\\int_0^3 (t^2 - 4)\\,dt = \\big[\\tfrac{t^3}{3} - 4t\\big]_0^3 = 9 - 12 = -3$ m. (b) $v = 0$ at $t = 2$; $v < 0$ on $[0,2]$ and $v > 0$ on $[2,3]$. Distance $= \\int_0^2 (4 - t^2)\\,dt + \\int_2^3 (t^2 - 4)\\,dt = \\tfrac{16}{3} + \\tfrac{7}{3} = \\tfrac{23}{3}$ m.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Interpret and compute an accumulation from a rate',
      when_to_use:
        'When a quantity changes at a given rate $R(t)$ and you need the total accumulated over an interval, or an average rate.',
      steps: [
        'Confirm $R(t)$ is a RATE (per unit time); the accumulated total is $\\int_a^b R(t)\\,dt$.',
        'Evaluate the integral and attach UNITS (rate-units $\\times$ time = total quantity).',
        'For the average rate over $[a,b]$, divide the total by $b-a$: average $= \\dfrac{1}{b-a}\\int_a^b R(t)\\,dt$.',
        'If a starting amount is given, add it: final $=$ initial $+ \\int_a^b R(t)\\,dt$.',
      ],
      example: {
        problem: 'Water flows into a tank at $R(t) = 6t + 2$ (gal/hr) for $t \\in [0,4]$. Find (a) the water added in 4 hours and (b) the average flow rate.',
        solution:
          '(a) $\\int_0^4 (6t + 2)\\,dt = \\big[3t^2 + 2t\\big]_0^4 = 48 + 8 = 56$ gal. (b) average rate $= \\tfrac{1}{4}(56) = 14$ gal/hr.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Total distance is $\\int_a^b \\lvert v\\rvert\\,dt$, NOT $\\lvert\\int_a^b v\\,dt\\rvert$ — the absolute value goes INSIDE the integral. Splitting at sign changes is the only reliable way.', kind: 'common-error' },
    { content: 'Average value carries a $\\dfrac{1}{b-a}$ factor; forgetting to divide by the interval length leaves you with just the integral (the total, not the average).', kind: 'gotcha' },
    { content: 'On accumulation FRQs, always state UNITS and interpret the meaning ("56 gallons of water entered the tank between hours 0 and 4"). Bare numbers lose the interpretation point.', kind: 'frq-vocab' },
    { content: 'Displacement equals total distance only when the particle never reverses (i.e. $v$ keeps one sign on $[a,b]$).', kind: 'edge-case' },
    { content: 'A particle is SPEEDING UP when $v$ and $a$ have the SAME sign, and slowing down when they have opposite signs — do not confuse "$a > 0$" with "speeding up".', kind: 'tip' },
  ],
};
