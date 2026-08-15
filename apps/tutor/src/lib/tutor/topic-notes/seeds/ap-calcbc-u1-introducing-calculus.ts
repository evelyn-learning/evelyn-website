/**
 * AP Calculus BC — Unit 1 CED 1.1: Introducing Calculus — Can Change
 * Occur at an Instant?
 *
 * Baseline notes for the course's opening conceptual topic. Hand-curated
 * from the source plan evelyn.ap.calcbc.introducing-calculus.v1 to the
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts (the calibration
 * reference): every theory entry carries kind+title, methods are humanized
 * with when_to_use + a worked example, pointers are a kind mix
 * (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe
 * renderer), so values/bounds open with a non-digit (\lim, a variable).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.introducing-calculus';

export const BASELINE_AP_CALCBC_INTRODUCING_CALCULUS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.introducing-calculus.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Introducing Calculus: Can Change Occur at an Instant?',
  planId: 'evelyn.ap.calcbc.introducing-calculus.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.introducing-calculus.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Average rate of change (the difference quotient)',
      content:
        'The average rate of change of $f$ over the interval $[a,b]$ is the difference quotient $\\dfrac{f(b)-f(a)}{b-a}$. Geometrically it is the slope of the SECANT line through $(a,f(a))$ and $(b,f(b))$. It is well-defined whenever $b\\ne a$, and it summarizes the whole interval, not any single instant.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Instantaneous rate of change',
      content:
        'The instantaneous rate of change of $f$ at $x=a$ is the rate "at this exact moment." Writing the interval as $[a,a+h]$, the average rate is $\\dfrac{f(a+h)-f(a)}{h}$; the instantaneous rate is what this approaches as the interval shrinks: $\\lim_{h\\to 0}\\dfrac{f(a+h)-f(a)}{h}$. This is the derivative $f\'(a)$, defined formally in Unit 2.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why the naive ratio fails: the 0/0 problem',
      content:
        'You cannot get the instantaneous rate by simply setting $h=0$: both the numerator $f(a+h)-f(a)$ and the denominator $h$ go to zero, giving the INDETERMINATE form $\\tfrac{0}{0}$, which has no single value. The fix is a LIMIT — shrink $h$ toward zero WITHOUT reaching it and watch what the ratio approaches. Approaching is not the same as substituting.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Secant approaches tangent',
      content:
        'As the interval $[a,b]$ shrinks to the single point $x=a$, the SECANT line through $(a,f(a))$ and $(b,f(b))$ rotates toward the TANGENT line at $(a,f(a))$. So the instantaneous rate of change is the SLOPE OF THE TANGENT at that point — the geometric meaning of the derivative.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'What calculus is, and why limits come first',
      content:
        'Calculus is the mathematics of change, built on two tools: DIFFERENTIATION (rate of change at a point — derivatives, Units 2–5) and INTEGRATION (accumulated total change — integrals, Units 6–8). Both rest on the limit. Because the $\\tfrac{0}{0}$ problem cannot be resolved by ordinary algebra, Unit 1 develops the limit rigorously before anything else.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'tangent line',
      content: 'the line that touches a curve at a single point and shares the curve\'s direction there; its slope equals the instantaneous rate of change at that point.',
    },
  ],
  methods: [
    {
      title: 'Estimate an instantaneous rate by shrinking the interval',
      when_to_use:
        'When you are given a position/quantity function $f$ and asked for the rate at a single instant $x=a$, and you want a numerical estimate before (or instead of) using derivative rules.',
      steps: [
        'Write the average-rate (difference-quotient) formula $\\dfrac{f(b)-f(a)}{b-a}$ over an interval starting at $x=a$.',
        'Compute the average rate over a WIDE interval, then over progressively narrower intervals whose left endpoint stays at $x=a$ (e.g. $[a,a+1]$, then $[a,a+0.1]$, then $[a,a+0.01]$).',
        'List the resulting averages in order and watch the trend — the value they converge toward is your estimate of the instantaneous rate.',
        'State the estimate, and (if possible) confirm it against the derivative $f\'(a)$ from Unit 2.',
        'Note that setting the interval length to zero gives $\\tfrac{0}{0}$, so the estimate comes from the LIMIT of the trend, never from direct substitution.',
      ],
      example: {
        problem:
          'A ball dropped from rest has position $s(t)=4.9\\,t^2$ meters below the release point at time $t$ seconds. Estimate the instantaneous velocity at $t=1$ by computing average velocities over shrinking intervals.',
        solution:
          'Over $[1,2]$: $\\dfrac{s(2)-s(1)}{2-1}=\\dfrac{19.6-4.9}{1}=14.7$ m/s. Over $[1,1.1]$: $\\dfrac{5.929-4.9}{0.1}=10.29$ m/s. Over $[1,1.01]$: $\\dfrac{4.99849-4.9}{0.01}=9.849$ m/s. The averages 14.7, 10.29, 9.849, … converge toward about 9.8 m/s, so the instantaneous velocity at $t=1$ is about 9.8 m/s. (Unit 2 gives $s\'(t)=9.8\\,t$, so $s\'(1)=9.8$ m/s — the numerical limit matches.)',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Average rate uses an INTERVAL $[a,b]$; instantaneous rate uses a single point $x=a$. A speedometer reads instantaneous speed; "60 miles in one hour" is an average.', kind: 'tip' },
    { content: 'On an FRQ, "average rate of change of $f$ on $[a,b]$" means exactly $\\dfrac{f(b)-f(a)}{b-a}$ — the secant slope — while "rate of change at $x=a$" means the derivative $f\'(a)$.', kind: 'frq-vocab' },
    { content: 'You cannot find an instantaneous rate by setting the interval length to zero: that gives the indeterminate form $\\tfrac{0}{0}$, not zero. The rate comes from the LIMIT of the difference quotient.', kind: 'common-error' },
    { content: '"$\\tfrac{0}{0}$ means the rate is zero" is wrong — $\\tfrac{0}{0}$ is indeterminate, and motion genuinely exists at an instant even though no time elapses there. This is the whole reason limits were invented.', kind: 'gotcha' },
    { content: 'A limit can pin down a definite instantaneous rate even where direct substitution is undefined — the ratio approaches a value without the expression ever being evaluated at $h=0$.', kind: 'edge-case' },
  ],
};
