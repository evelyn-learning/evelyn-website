/**
 * AP Calculus BC — Unit 4 CED 4.1+4.3: Interpreting the Derivative in Context.
 *
 * Baseline curated from evelyn.ap.calcbc.derivative-in-context.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry
 * carries kind+title, methods are humanized with when_to_use + a worked
 * example, pointers are a kind mix (tip / frq-vocab / gotcha / edge-case /
 * common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, \frac, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.derivative-in-context';

export const BASELINE_AP_CALCBC_DERIVATIVE_IN_CONTEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.derivative-in-context.v1',
  course: 'AP Calculus BC',
  cedUnit: 4,
  cedTopic: '4.1-4.3',
  cedTitle: 'Interpreting the Derivative in Context',
  planId: 'evelyn.ap.calcbc.derivative-in-context.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.derivative-in-context.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'The derivative as a rate of change',
      content:
        'In an applied setting, $f\'(a)$ is the INSTANTANEOUS RATE OF CHANGE of the quantity $f$ with respect to its input, evaluated at the input value $a$. If $P(t)$ is a population at time $t$, then $P\'(5)$ is the rate at which the population is changing at the instant $t=5$ — not a total, but a "per-unit-time" rate at one moment.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Units of the derivative',
      content:
        'The derivative carries UNITS: if $f$ is measured in [output unit] and $x$ in [input unit], then $f\'(x)$ has units of [output unit] PER [input unit]. Example: $P(t)$ in millions of people, $t$ in years $\\Rightarrow$ $P\'(t)$ is in millions of people per year. Always attach these units when you interpret a derivative.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The four-part interpretation sentence',
      content:
        'A full-credit interpretation of $f\'(a)=b$ names FOUR things: the quantity, the sign/direction, the magnitude with units, and the moment. Template: "$f\'(a)=b$ means [quantity] is [increasing / decreasing] at a rate of $|b|$ [output unit per input unit] when [input] $=a$." Dropping the units or the direction loses points on AP rubrics.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Marginal quantity',
      content:
        'If $C(q)$ is the total cost of producing $q$ units, then $C\'(q)$ is the MARGINAL COST — the approximate cost of producing the next unit, in dollars per unit. Because $C(q+1)-C(q)\\approx C\'(q)$ for a unit step, the derivative is the formal version of "the cost of one more." The same idea gives marginal revenue, marginal profit, etc.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The second derivative in context',
      content:
        '$f\'\'(a)$ is the rate of change of the RATE $f\'$. For motion it is acceleration; in general it says whether the rate itself is speeding up or slowing down. If $P\'\'>0$, the growth rate is INCREASING (the quantity grows faster and faster); if $P\'\'<0$, the rate is easing off even while $P$ may still be rising.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'instantaneous rate of change (one-line)',
      content:
        '$f\'(a)$ = the rate at which $f$ changes per unit of its input, at the single instant $x=a$; reported with units and a direction.',
    },
  ],
  methods: [
    {
      title: 'Write a full-credit interpretation of a derivative value in context',
      when_to_use:
        'When an FRQ gives a numerical derivative value and asks what it "means in the context of the problem."',
      steps: [
        'IDENTIFY the quantity $f$ measures and its output units; identify the input variable and its units.',
        'FORM the derivative units as [output unit] per [input unit].',
        'READ the SIGN: positive $\\Rightarrow$ increasing, negative $\\Rightarrow$ decreasing.',
        'STATE the moment: "when [input] $=a$."',
        'ASSEMBLE one sentence naming quantity, direction, magnitude-with-units, and moment.',
      ],
      example: {
        problem:
          'A pond holds $W(t)$ gallons of water at time $t$ hours, with $W\'(3)=-20$. Interpret $W\'(3)=-20$ in context.',
        solution:
          'Units of $W\'$ are gallons per hour. The sign is negative, so $W$ is decreasing. Sentence: "When $t=3$ hours, the amount of water in the pond is DECREASING at a rate of 20 gallons per hour." All four pieces (quantity, direction, magnitude+units, moment) are present.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Estimate a nearby value using the derivative (local linear / marginal)',
      when_to_use:
        'When you know $f(a)$ and $f\'(a)$ and are asked to approximate $f$ at a nearby input, or to estimate the cost/effect of "one more."',
      steps: [
        'Write the local-linear estimate $f(a+\\Delta x)\\approx f(a)+f\'(a)\\,\\Delta x$.',
        'Substitute the known $f(a)$, $f\'(a)$, and the small step $\\Delta x$.',
        'Compute; keep units consistent throughout.',
        'For a "marginal / one more unit" question, use $\\Delta x=1$ so the estimate is just $f(a)+f\'(a)$.',
      ],
      example: {
        problem:
          'Total cost satisfies $C(100)=5000$ dollars and $C\'(100)=12$ dollars per widget. Estimate $C(101)$.',
        solution:
          'With $\\Delta q=1$: $C(101)\\approx C(100)+C\'(100)\\cdot 1 = 5000+12 = 5012$ dollars. Interpretation: the 101st widget adds about 12 dollars to total cost.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'A bare number gets little credit: "$f\'(3)=7$" alone is not an interpretation — you must say WHAT is changing, in which DIRECTION, at what RATE with UNITS, and WHEN.', kind: 'frq-vocab' },
    { content: 'Derivative units are ALWAYS output-per-input. If $f$ is in kJ and $x$ in seconds, $f\'$ is in kJ per second (watts) — never the same units as $f$.', kind: 'common-error' },
    { content: 'A negative derivative means the quantity is DECREASING, not "moving in reverse in space" — read it as a signed rate of the quantity itself.', kind: 'gotcha' },
    { content: 'Marginal cost $\\approx C\'(q)$ estimates the NEXT unit, so it is a per-unit rate; do not confuse it with the total $C(q)$ or the average cost $C(q)/q$.', kind: 'tip' },
    { content: 'A quantity can be increasing while its rate decreases: $P\'>0$ with $P\'\'<0$ means still growing, but more slowly each moment — watch the two derivatives separately.', kind: 'edge-case' },
  ],
};
