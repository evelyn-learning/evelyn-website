/**
 * AP Calculus BC — CED Unit 4.1+4.3: Interpreting the Derivative in
 * Context (combined: meaning + non-motion rates).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U4_DERIVATIVE_CONTEXT: LessonPlan = {
  id: 'evelyn.ap.calcbc.derivative-in-context.v1',
  title: 'U4.1 Interpreting the Derivative in Context',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.derivative-in-context',
      description:
        'Interpret f\'(a) in real-world contexts (rates of change with units), explain its meaning in a sentence, and apply it to non-motion contexts (population, temperature, cost, etc.).',
      standard: 'AP-CALCBC-4.1-4.3',
    },
  ],
  prerequisites: ['apcalcbc.higher-order-derivatives'],
  followUps: ['apcalcbc.straight-line-motion'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect derivatives to ordinary, real-world rate-of-change language.',
      script:
        "If P(t) is population in year t, then P\\'(5) is the rate at which the population is changing in year 5 — in PEOPLE PER YEAR. The derivative carries UNITS, and on AP exam questions you must say what its NUMERICAL VALUE MEANS in context. \"f\\'(3) = 7\" alone gets few points; \"f\\'(3) = 7 means the temperature is rising at 7 degrees per minute when t = 3 minutes\" gets full credit.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-meaning',
      kind: 'concept',
      goal: 'Cover units of derivatives + interpretation conventions + sample contexts.',
      keyIdeas: [
        'UNITS OF f\'(a). If f has units of [output unit] and x has units of [input unit], then f\'(x) has units of [output unit] PER [input unit]. Example: P(t) in millions of people, t in years → P\'(t) in millions of people per year.',
        'INTERPRETATION SENTENCE TEMPLATE: "f\'(a) = b means [output quantity] is [increasing/decreasing] at a rate of |b| [output unit per input unit] when [input variable] = a." All four pieces (variable, value, sign-direction, units) are required for full credit on AP rubrics.',
        'EXAMPLE — population: P(5) = 1000 (people), P\'(5) = 25 (people/year). Interpretation: "When t = 5 years, the population is 1000 people and is increasing at a rate of 25 people per year."',
        'EXAMPLE — cost: C(q) = total cost of producing q units (dollars). C\'(q) is MARGINAL COST (dollars per unit) — approximate cost of producing the next unit.',
        'EXAMPLE — temperature: T(t) (degrees, t in hours). T\'(t) = degrees per hour, the heating/cooling rate.',
        'NEGATIVE DERIVATIVES indicate the quantity is DECREASING. f\'(a) = -3 with units feet/second means the height is dropping at 3 ft/s.',
        'SECOND DERIVATIVE in context. f\'\'(a) is the rate of change of f\' — i.e., the ACCELERATION (for motion) or "rate of change of the rate of change". If P\'\' is positive, the rate of change is INCREASING (population is growing faster and faster).',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-context',
      kind: 'worked_example',
      problem:
        'A pond contains W(t) gallons of water at time t hours. Suppose W(3) = 1500 gallons and W\'(3) = -20 gallons per hour. (a) What does W\'(3) = -20 mean in context? (b) Approximately how much water is in the pond at t = 3.5 hours?',
      steps: [
        'STEP 1 — INTERPRET W\'(3) = -20. At t = 3 hours, the water in the pond is DECREASING at a rate of 20 gallons per hour.',
        'STEP 2 — APPROXIMATE W(3.5). Using the derivative as a slope, change in water ≈ W\'(3) × Δt = -20 × 0.5 = -10 gallons. So W(3.5) ≈ W(3) + ΔW = 1500 + (-10) = 1490 gallons.',
        'STEP 3 — INTERPRETATION: in 30 minutes (Δt = 0.5 h), the pond loses about 10 gallons at the current rate of decline. Linear approximation accurate for small Δt.',
      ],
      answer: '(a) W is decreasing 20 gallons/hour at t = 3 h. (b) W(3.5) ≈ 1490 gallons.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-units',
      kind: 'try_yourself',
      problem:
        'For each scenario, state the units of f\'(t). (a) f(t) = bacterial count in millions, t in hours. (b) f(x) = energy used in kJ, x in seconds. (c) f(p) = quantity demanded in units, p in dollars per item.',
      expectedAnswer:
        '(a) f\'(t) units: millions of bacteria per hour. (b) f\'(x) units: kJ per second (= watts). (c) f\'(p) units: units per (dollar per item) = units per dollar (with items understood). This is the "rate of change of demand with respect to price".',
      responseFormat: 'free',
      hints: ['Output units / input units.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interpret',
      kind: 'try_yourself',
      problem:
        'Let H(t) = height in meters of a balloon t seconds after launch. H(10) = 50, H\'(10) = 4, H\'\'(10) = -0.5. Interpret each in context.',
      expectedAnswer:
        'H(10) = 50: at t = 10 seconds, the balloon is 50 meters above the ground.\nH\'(10) = 4: at t = 10 seconds, the balloon is RISING at a rate of 4 meters per second.\nH\'\'(10) = -0.5: at t = 10 seconds, the balloon\'s rate of rise is DECREASING at 0.5 meters per second per second (i.e., the balloon is decelerating — the rise rate is slowing down).',
      responseFormat: 'free',
      hints: ['Each derivative tells us about a different "rate of rate".'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-marginal-cost',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. C(q) is the total cost in dollars of producing q widgets. (a) State and interpret the units of C\'(q). (b) Explain what "marginal cost" means and how it relates to the derivative. (c) If C(100) = 5000 and C\'(100) = 12, estimate C(101).',
      expectedAnswer:
        '(a) C\'(q) units: dollars per widget. Tells you the rate at which total cost is increasing as widgets produced increases.\n(b) MARGINAL COST is informally the cost of producing ONE MORE unit at production level q. Mathematically, marginal cost ≈ C\'(q) — the derivative is the formal version. The connection: C(q+1) − C(q) ≈ C\'(q)·1 = C\'(q) for small Δq, so the derivative approximates the cost of one more unit.\n(c) C(101) ≈ C(100) + C\'(100)·(101 − 100) = 5000 + 12·1 = $5012. Interpretation: producing the 101st widget adds about $12 to total cost.',
      responseFormat: 'frq',
      hints: ['Marginal = "cost of one more". Linearization with Δq = 1.'],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Derivative units = output units / input units.',
        'Always interpret with units AND direction (increasing/decreasing).',
        'Marginal X = derivative of total X with respect to quantity.',
        'Second derivative = rate of change of the rate.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.1-4.3',
    cedTitle: 'Interpreting the Derivative in Context',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '3', note: 'Standard contextual interpretation.' }],
  },
};
