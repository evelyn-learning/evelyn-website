/**
 * AP Calculus BC — Unit 7 CED 7.8: Exponential Models with Differential
 * Equations.
 *
 * Baseline curated from evelyn.ap.calcbc.exponential-models.v1 to the gold
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

const LO = 'apcalcbc.exponential-models';

export const BASELINE_AP_CALCBC_EXPONENTIAL_MODELS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.exponential-models.v1',
  course: 'AP Calculus BC',
  cedUnit: 7,
  cedTopic: '7.8',
  cedTitle: 'Exponential Models',
  planId: 'evelyn.ap.calcbc.exponential-models.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.exponential-models.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The exponential model dy/dt = ky',
      content:
        'When a quantity changes at a rate PROPORTIONAL to its current amount, $\\dfrac{dy}{dt} = ky$. Separating variables gives the solution $y = y_0\\,e^{kt}$, where $y_0$ is the value at $t = 0$. Here $k > 0$ is GROWTH and $k < 0$ is DECAY.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Doubling time and half-life',
      content:
        'For growth, the DOUBLING TIME solves $y_0 e^{kT} = 2y_0$, i.e. $e^{kT} = 2$, giving $T = \\dfrac{\\ln 2}{k}$. For decay, the HALF-LIFE solves $e^{kT} = \\tfrac{1}{2}$, giving $T = \\dfrac{\\ln 2}{|k|}$. Both depend only on the rate constant, never on the starting amount.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: "Newton's law of cooling",
      content:
        'An object\'s temperature changes proportionally to its gap from the surroundings: $\\dfrac{dT}{dt} = -k\\,(T - T_{\\text{amb}})$. The solution is $T(t) = T_{\\text{amb}} + (T_0 - T_{\\text{amb}})\\,e^{-kt}$, which decays toward the ambient temperature $T_{\\text{amb}}$ as $t \\to \\infty$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Continuous compound interest',
      content:
        'A balance earning interest continuously satisfies $\\dfrac{dB}{dt} = rB$, so $B(t) = B_0\\,e^{rt}$, with $r$ the continuous rate and $B_0$ the initial balance. It is the same $\\dfrac{dy}{dt} = ky$ template with $k = r$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The defining property',
      content:
        'The signature of exponential behavior is that the RATE of change is proportional to the CURRENT VALUE ($\\dfrac{dy}{dt} \\propto y$). Recognizing this phrasing in a word problem is the trigger to reach for $y = y_0 e^{kt}$ rather than a polynomial or logistic model.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'exponential model (one-line)',
      content: '$\\dfrac{dy}{dt} = ky \\;\\Rightarrow\\; y = y_0\\,e^{kt}$; growth if $k > 0$, decay if $k < 0$.',
    },
  ],
  methods: [
    {
      title: 'Solve a growth/decay problem and find half-life or doubling time',
      when_to_use:
        'When a quantity grows or decays proportionally to its size and you must find the model, a future value, or a half-life/doubling time.',
      steps: [
        'Write the model $y = y_0\\,e^{kt}$, reading $y_0$ from the initial condition and $k$ from the given rate.',
        'For a future value, substitute $t$; for the rate constant, substitute a known $(t, y)$ pair and solve with a logarithm.',
        'For DOUBLING time set $y = 2y_0$; for HALF-LIFE set $y = \\tfrac{1}{2}y_0$.',
        'Cancel $y_0$, take $\\ln$, and solve: $T = \\dfrac{\\ln 2}{|k|}$.',
      ],
      example: {
        problem: 'A sample decays by $\\dfrac{dm}{dt} = -0.05m$ (years), starting at $m_0 = 200$ g. Find $m(t)$ and the half-life.',
        solution:
          'Model: $m(t) = 200\\,e^{-0.05t}$. Half-life: set $m(T) = 100$, so $e^{-0.05T} = \\tfrac{1}{2} \\Rightarrow -0.05T = -\\ln 2 \\Rightarrow T = \\dfrac{\\ln 2}{0.05} \\approx 13.86$ years.',
      },
      relatedLoIds: [LO],
    },
    {
      title: "Apply Newton's law of cooling",
      when_to_use:
        'When an object heats or cools toward a fixed ambient temperature and a rate or future temperature is wanted.',
      steps: [
        'Write $T(t) = T_{\\text{amb}} + (T_0 - T_{\\text{amb}})\\,e^{-kt}$ using the ambient and initial temperatures.',
        'Substitute a known later temperature to solve for $k$ (isolate the exponential, then take $\\ln$).',
        'Use the completed model to predict temperature at any $t$, or invert to find the time to reach a target.',
        'Sanity-check: as $t \\to \\infty$, $T \\to T_{\\text{amb}}$.',
      ],
      example: {
        problem: 'Coffee at 90°C sits in a 25°C room and cools to 70°C after 5 min. Find $k$, then $T(15)$.',
        solution:
          'Model: $T(t) = 25 + 65\\,e^{-kt}$. At $t = 5$, $T(5) = 70$, so $e^{-5k} = \\tfrac{45}{65} \\Rightarrow k \\approx 0.0735$. Then $T(15) = 25 + 65\\,e^{-15(0.0735)} \\approx 46.6°$C.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Doubling time and half-life are INDEPENDENT of the starting amount — $y_0$ cancels. A colony of hundreds and one of millions double in the same time at equal $k$.', kind: 'tip' },
    { content: 'Newton\'s cooling model is $T_{\\text{amb}} + (T_0 - T_{\\text{amb}})e^{-kt}$, NOT $T_0 e^{-kt}$: the exponential decays the GAP from ambient, and $T$ levels off at $T_{\\text{amb}}$, not at zero.', kind: 'common-error' },
    { content: 'Match rate to $y = y_0 e^{kt}$ only when the rate is proportional to the AMOUNT present. "Rate proportional to a difference" is Newton cooling; "proportional to amount and remaining room" is logistic.', kind: 'frq-vocab' },
    { content: 'Keep the sign of $k$ straight: growth uses $+k$, decay uses $-k$ (or a positive $k$ with a leading minus). Half-life uses $|k|$.', kind: 'gotcha' },
    { content: 'Exponential growth has NO upper bound — it is only realistic while resources are unlimited. Once a ceiling matters, switch to the logistic model.', kind: 'edge-case' },
  ],
};
