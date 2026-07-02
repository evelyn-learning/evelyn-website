/**
 * AP Calculus BC — Unit 4 CED 4.4+4.5: Related Rates.
 *
 * Baseline curated from evelyn.ap.calcbc.related-rates.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry carries
 * kind+title, methods are humanized with when_to_use + a worked example,
 * pointers are a kind mix (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\frac, a letter, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.related-rates';

export const BASELINE_AP_CALCBC_RELATED_RATES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.related-rates.v1',
  course: 'AP Calculus BC',
  cedUnit: 4,
  cedTopic: '4.4-4.5',
  cedTitle: 'Related Rates',
  planId: 'evelyn.ap.calcbc.related-rates.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.related-rates.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'What a related-rates problem is',
      content:
        'A RELATED-RATES problem gives the rate of change of one quantity and asks for the rate of change of a related quantity at a particular instant. The quantities are linked by an equation, and both change with TIME, so their rates are linked too: knowing one rate and the current geometry pins down the other.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The five-step recipe',
      content:
        'The standard workflow: (1) IDENTIFY the variables and label which rate is known vs. wanted (draw a picture if geometric); (2) WRITE an equation relating the variables; (3) DIFFERENTIATE both sides with respect to time $t$; (4) SUBSTITUTE the known values and rate; (5) SOLVE for the unknown rate. The order matters — steps (3) and (4) must not be swapped.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Differentiating implicitly in time',
      content:
        'Every variable is a function of $t$, so differentiating brings a chain-rule factor: $\\dfrac{d}{dt}\\big[r^2\\big]=2r\\,\\dfrac{dr}{dt}$ and $\\dfrac{d}{dt}\\big[V\\big]=\\dfrac{dV}{dt}$. For a sphere $V=\\tfrac{4}{3}\\pi r^3$ this gives $\\dfrac{dV}{dt}=4\\pi r^2\\,\\dfrac{dr}{dt}$ — a relation among the two rates and the current radius.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Common geometric setups',
      content:
        'Recurring equations to relate the variables: a SPHERE $V=\\tfrac{4}{3}\\pi r^3$; a RIGHT TRIANGLE / sliding ladder $x^2+y^2=L^2$ with $L$ constant $\\Rightarrow x\\,\\dfrac{dx}{dt}+y\\,\\dfrac{dy}{dt}=0$; and SIMILAR TRIANGLES (shadow, cone) giving a proportion you differentiate. For a cone, use the similar-triangle relation to write $V$ in ONE variable before differentiating.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Differentiate first, substitute last',
      content:
        'The values that hold "at this instant" must be substituted AFTER differentiating, never before. If you plug in a value like $x=3$ into the relating equation first, the differentiation loses that variable\'s dependence on $t$ and the resulting rate is wrong. Keep variables symbolic through step (3).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'related rates (one-line)',
      content:
        'a problem where a known rate of change drives, through a relating equation differentiated in $t$, the unknown rate of change of a linked quantity.',
    },
  ],
  methods: [
    {
      title: 'Solve a related-rates problem with the five-step recipe',
      when_to_use:
        'Whenever a rate is given and a different, geometrically or physically linked rate is asked for "at the instant when...".',
      steps: [
        'IDENTIFY variables; note the KNOWN rate and the WANTED rate; sketch the situation.',
        'WRITE one equation relating the variables (geometry formula, Pythagorean relation, or a proportion).',
        'DIFFERENTIATE both sides with respect to $t$, attaching $\\dfrac{d(\\cdot)}{dt}$ to every changing variable.',
        'SUBSTITUTE the instant-specific values and the known rate — only now, after differentiating.',
        'SOLVE for the unknown rate and check units.',
      ],
      example: {
        problem:
          'A spherical balloon is inflated so that its volume increases at a rate of 100 cm$^3$/s. How fast is the radius increasing when $r=5$ cm?',
        solution:
          'Equation $V=\\tfrac{4}{3}\\pi r^3$. Differentiate: $\\dfrac{dV}{dt}=4\\pi r^2\\,\\dfrac{dr}{dt}$. Substitute $\\dfrac{dV}{dt}=100$ and $r=5$: $\\dfrac{dV}{dt}=4\\pi(5)^2\\,\\dfrac{dr}{dt}=100\\pi\\,\\dfrac{dr}{dt}$. Solve: $\\dfrac{dr}{dt}=\\dfrac{100}{100\\pi}=\\dfrac{1}{\\pi}\\approx 0.318$ cm/s. Units: $(\\text{cm}^3/\\text{s})/\\text{cm}^2=\\text{cm/s}$. ✓',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Reduce to one variable with a similar-triangle constraint (cone / shadow)',
      when_to_use:
        'When the relating equation has two geometric variables but a proportion links them, e.g. a draining/filling cone or a shadow from a lamppost.',
      steps: [
        'Write the primary equation (e.g. cone volume $V=\\tfrac{1}{3}\\pi r^2 h$).',
        'Use SIMILAR TRIANGLES to express one variable in terms of the other (e.g. $r=\\tfrac{h}{2}$).',
        'SUBSTITUTE to reduce the equation to a single variable, then differentiate with respect to $t$.',
        'Plug in the instant values and solve for the wanted rate.',
      ],
      example: {
        problem:
          'Water fills a downward cone (height 12 ft, base radius 6 ft) at a rate of 4 ft$^3$/min. How fast is the depth rising when $h=3$ ft?',
        solution:
          'Similar triangles give $r=\\tfrac{h}{2}$, so $V=\\tfrac{1}{3}\\pi\\big(\\tfrac{h}{2}\\big)^2 h=\\dfrac{\\pi h^3}{12}$. Differentiate: $\\dfrac{dV}{dt}=\\dfrac{\\pi h^2}{4}\\,\\dfrac{dh}{dt}$. At $\\dfrac{dV}{dt}=4$, $h=3$: $\\dfrac{9\\pi}{4}\\,\\dfrac{dh}{dt}=4$, so $\\dfrac{dh}{dt}=\\dfrac{16}{9\\pi}\\approx 0.566$ ft/min.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Differentiate FIRST, substitute LAST. Plugging instant values in before differentiating is the single most common related-rates error — it kills the variable\'s time-dependence.', kind: 'common-error' },
    { content: 'Every geometric variable is a function of $t$, so each contributes a $\\dfrac{d(\\cdot)}{dt}$ factor via the chain rule — writing $\\dfrac{d}{dt}\\big[r^2\\big]=2r$ instead of $\\dfrac{d}{dt}\\big[r^2\\big]=2r\\,\\dfrac{dr}{dt}$ is wrong.', kind: 'gotcha' },
    { content: 'On FRQs, label your variables and write the relating EQUATION explicitly before differentiating — readers award setup points for the equation and the $\\dfrac{d}{dt}$ step.', kind: 'frq-vocab' },
    { content: 'A quantity that stays constant (a fixed ladder length or cone dimensions) differentiates to zero; use it to shrink the equation, but keep the moving variables symbolic.', kind: 'edge-case' },
    { content: 'Finish with a UNITS check: the units of your answer should read as [output unit] per unit time — a mismatch usually flags a dropped chain-rule factor.', kind: 'tip' },
  ],
};
