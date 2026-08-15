/**
 * AP Calculus BC — Unit 7 CED 7.9: Logistic Models with Differential
 * Equations (BC only).
 *
 * Baseline curated from evelyn.ap.calcbc.logistic-models.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts and
 * seeds/ap-calcbc-u3-chain-rule.ts: every theory entry carries kind+title,
 * methods are humanized with when_to_use + a worked example, pointers are a
 * kind mix (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe
 * renderer), so any span opens with a non-digit (\dfrac, a letter, a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.logistic-models';

export const BASELINE_AP_CALCBC_LOGISTIC_MODELS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.logistic-models.v1',
  course: 'AP Calculus BC',
  cedUnit: 7,
  cedTopic: '7.9',
  cedTitle: 'Logistic Models (BC)',
  planId: 'evelyn.ap.calcbc.logistic-models.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.logistic-models.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The logistic differential equation',
      content:
        'Bounded growth is modeled by $\\dfrac{dP}{dt} = kP(M - P)$, equivalently $\\dfrac{dP}{dt} = kP\\left(1 - \\dfrac{P}{M}\\right)$, where $M$ is the CARRYING CAPACITY. The factor $\\left(1 - \\dfrac{P}{M}\\right)$ shrinks toward zero as $P$ nears $M$, throttling the growth.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Equilibrium solutions',
      content:
        'Setting $\\dfrac{dP}{dt} = 0$ gives two constant (equilibrium) solutions: $P = 0$ (trivial) and $P = M$ (the carrying capacity). $P = M$ is a stable attractor — solutions on either side move toward it.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Growth behavior across regimes',
      content:
        'When $P$ is small ($P \\ll M$) the model behaves almost exponentially, $\\dfrac{dP}{dt} \\approx kMP$. As $P \\to M$ the rate $\\to 0$ and growth stalls. If $P > M$ the rate is negative, so an overshoot DECREASES back toward $M$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Inflection point and maximum growth rate',
      content:
        'The population grows FASTEST at $P = \\dfrac{M}{2}$ — the INFLECTION point of the S-curve, where $\\dfrac{d^{2}P}{dt^{2}} = 0$. Growth accelerates (concave up) below $\\tfrac{M}{2}$ and decelerates (concave down) above it. The maximum rate is $\\dfrac{dP}{dt}\\Big|_{P = M/2} = k\\left(\\dfrac{M}{2}\\right)\\left(\\dfrac{M}{2}\\right) = \\dfrac{kM^{2}}{4}$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The S-shaped solution curve',
      content:
        'The explicit solution (rarely required to derive on the exam) is $P(t) = \\dfrac{M}{1 + A e^{-kMt}}$ with $A = \\dfrac{M - P_0}{P_0}$. Its graph is the characteristic SIGMOID: low and accelerating, an inflection at $P = \\tfrac{M}{2}$, then a decelerating approach to the horizontal asymptote $P = M$ from below.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'logistic model (one-line)',
      content: '$\\dfrac{dP}{dt} = kP\\left(1 - \\dfrac{P}{M}\\right)$: capacity $M$, fastest growth at $P = \\tfrac{M}{2}$, S-curve toward $M$.',
    },
  ],
  methods: [
    {
      title: 'Extract carrying capacity, inflection, and max rate from a logistic DE',
      when_to_use:
        'When a logistic DE is given and the question asks for capacity, when growth is fastest, or the maximum rate.',
      steps: [
        'Match the form to $kP(M - P)$ or $kP\\left(1 - \\dfrac{P}{M}\\right)$ to read off $M$ (and $k$).',
        'CARRYING CAPACITY is $M$ — the nonzero equilibrium where $\\dfrac{dP}{dt} = 0$.',
        'FASTEST GROWTH (inflection) is at $P = \\dfrac{M}{2}$.',
        'MAXIMUM RATE is $\\dfrac{kM^{2}}{4}$; for any other $P$, just evaluate $kP(M - P)$.',
      ],
      example: {
        problem: 'For $\\dfrac{dP}{dt} = 0.02\\,P(500 - P)$ with $P(0) = 50$, find (a) the carrying capacity, (b) where growth is fastest, (c) the maximum rate.',
        solution:
          '(a) Carrying capacity $M = 500$. (b) Fastest growth at $P = \\dfrac{M}{2} = 250$. (c) Maximum rate $\\dfrac{kM^{2}}{4} = \\dfrac{0.02\\,(500)^{2}}{4} = 1250$ per unit time.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Compare logistic and exponential models',
      when_to_use:
        'On synthesis prompts asking when the two models agree, when they diverge, or which is realistic.',
      steps: [
        'For SMALL $P$ ($P \\ll M$) the factor $\\left(1 - \\dfrac{P}{M}\\right) \\approx 1$, so logistic $\\approx$ exponential — early growth looks the same.',
        'As $P \\to M$ the logistic rate $\\to 0$ while the exponential keeps climbing — the curves DIVERGE.',
        'Choose logistic when a resource ceiling (space, food) bounds the quantity; choose exponential only while resources are effectively unlimited.',
      ],
      example: {
        problem: 'For a bacterial colony in a petri dish, when does exponential growth approximate logistic, and which is ultimately realistic?',
        solution:
          'While the colony is small relative to capacity, $\\left(1 - \\dfrac{P}{M}\\right) \\approx 1$ and exponential is a fine approximation. But nutrients, space, and waste impose a carrying capacity, so long-run behavior is LOGISTIC — the colony levels off at $M$ rather than growing without bound.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Fastest growth is at HALF the carrying capacity, $P = \\dfrac{M}{2}$ — the inflection point — not at $P = M$ (where the rate is zero).', kind: 'common-error' },
    { content: 'Read $M$ carefully by form: in $kP(M - P)$ it is the subtracted constant; in $kP\\left(1 - \\dfrac{P}{M}\\right)$ it is the denominator inside the parentheses.', kind: 'gotcha' },
    { content: 'The maximum rate $\\dfrac{kM^{2}}{4}$ follows from evaluating $kP(M - P)$ at $P = \\dfrac{M}{2}$ — a quick FRQ shortcut worth memorizing.', kind: 'frq-vocab' },
    { content: 'You rarely need the explicit $P(t) = \\dfrac{M}{1 + Ae^{-kMt}}$ — most BC questions probe capacity, the inflection at $\\tfrac{M}{2}$, and $\\lim_{t\\to\\infty} P = M$.', kind: 'tip' },
    { content: 'If $P_0 > M$, growth is negative and $P$ DECREASES toward $M$ — the S-curve shape assumes the population starts below capacity.', kind: 'edge-case' },
  ],
};
