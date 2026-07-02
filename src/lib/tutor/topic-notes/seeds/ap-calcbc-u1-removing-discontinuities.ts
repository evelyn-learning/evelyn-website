/**
 * AP Calculus BC — Unit 1 CED 1.13: Removing a Discontinuity.
 *
 * Hand-curated from the source plan evelyn.ap.calcbc.removing-discontinuities.v1
 * to the gold standard set by seeds/ap-calcbc-u1-defining-limits.ts: every
 * theory entry carries kind+title, methods are humanized with when_to_use + a
 * worked example, pointers are a kind mix (tip / frq-vocab / gotcha / edge-case
 * / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so bounds/values open with a non-digit (\lim, \le, a variable, a minus sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.removing-discontinuities';

export const BASELINE_AP_CALCBC_REMOVING_DISCONTINUITIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.removing-discontinuities.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.13',
  cedTitle: 'Removing a Discontinuity',
  planId: 'evelyn.ap.calcbc.removing-discontinuities.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.removing-discontinuities.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Removability criterion',
      content:
        'A discontinuity at $x=a$ is REMOVABLE if and only if $\\lim_{x\\to a} f(x)$ exists as a finite real number $L$. To remove it, define (or redefine) $f(a)=L$. If the limit does not exist (jump or infinite type), no assignment to $f(a)$ can make $f$ continuous.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'The patched function',
      content:
        'Given a removable discontinuity at $x=a$ with $\\lim_{x\\to a} f(x)=L$, the patched function $\\tilde f$ agrees with $f$ everywhere except $\\tilde f(a)=L$. Then $\\tilde f$ is continuous at $a$: it is defined, its limit exists, and $\\lim_{x\\to a}\\tilde f(x)=\\tilde f(a)$ — all three conditions hold.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The patch value is always the limit',
      content:
        'Whenever a problem asks "what value makes $f$ continuous at $x=a$?", the answer is $\\lim_{x\\to a} f(x)$ — never $f(a)$ before patching. For a $\\tfrac{0}{0}$ rational this is found by factoring and cancelling; for a trig form use a special limit such as $\\lim_{x\\to 0}\\tfrac{\\sin x}{x}=1$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Parameter problems',
      content:
        'A common AP form gives a piecewise function (or an expression with an unknown constant) and asks for the parameter value making $f$ continuous at $x=a$. Set the left-hand limit, the right-hand limit, and $f(a)$ equal, then solve. With two unknowns you generally need continuity at two points, giving a system of equations.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Not every discontinuity is removable',
      content:
        'Removability requires a FINITE two-sided limit. A jump (unequal one-sided limits) and an infinite discontinuity (a vertical asymptote, $\\tfrac{k}{0}$ form) are ESSENTIAL — built into the function — and cannot be patched. Always check the limit exists before claiming a discontinuity is removable.',
    },
  ],
  methods: [
    {
      title: 'Find the value that removes a removable discontinuity',
      when_to_use:
        'When a function has an undefined or unknown value at $x=a$ and you must supply the constant that makes it continuous there.',
      steps: [
        'Confirm the discontinuity is removable: substitute to see a $\\tfrac{0}{0}$ form (or a defined limit), not a $\\tfrac{k}{0}$ blow-up.',
        'Compute $\\lim_{x\\to a} f(x)$ — factor and cancel a rational $\\tfrac{0}{0}$, or apply a special trig limit.',
        'Set the unknown value (or parameter) equal to that limit $L$.',
        'Verify: with $f(a)=L$ the three continuity conditions hold.',
      ],
      example: {
        problem:
          'Let $f(x)=\\dfrac{x^2-1}{x-1}$ for $x\\ne 1$ and $f(x)=c$ for $x=1$. Find $c$ so that $f$ is continuous at $x=1$.',
        solution:
          'Direct substitution gives $\\tfrac{0}{0}$, so factor: $\\tfrac{(x-1)(x+1)}{x-1}=x+1$ for $x\\ne 1$, hence $\\lim_{x\\to 1} f(x)=2$. Continuity needs $f(1)=\\lim_{x\\to 1} f(x)$, so $c=2$. Check: with $c=2$, $f(1)=2$ equals the limit — continuous. Answer: $c=2$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Match one-sided limits to remove a piecewise discontinuity',
      when_to_use:
        'When a piecewise function has an unknown parameter in one branch and must be made continuous at the break.',
      steps: [
        'Compute the left-hand limit at the break using the $x<a$ branch.',
        'Compute the right-hand limit (and $f(a)$) using the $x\\ge a$ branch.',
        'Set left limit $=$ right limit and solve for the parameter.',
      ],
      example: {
        problem:
          'Find $k$ making $f$ continuous at $x=2$, where $f(x)=x^2$ for $x<2$ and $f(x)=kx+1$ for $x\\ge 2$.',
        solution:
          'Left: $\\lim_{x\\to 2^-} x^2=4$. Right and value: $\\lim_{x\\to 2^+}(kx+1)=2k+1=f(2)$. Setting the right value equal to the left limit and solving yields $k=\\tfrac{3}{2}$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The patch value is the LIMIT, not the original $f(a)$ — students often plug the number in before cancelling and get $\\tfrac{0}{0}$.', kind: 'common-error' },
    { content: 'Justify removability on an FRQ by showing the limit exists as a finite number, then stating the patched value $f(a)=\\lim_{x\\to a} f(x)$.', kind: 'frq-vocab' },
    { content: 'A $\\tfrac{k}{0}$ form with $k\\ne 0$ is an infinite discontinuity — do NOT report a "patch value"; it is not removable.', kind: 'gotcha' },
    { content: 'One expression can have TWO discontinuities of different kinds: $\\tfrac{x-4}{x^2-16}$ is removable at $x=4$ (shared factor) but infinite at $x=-4$.', kind: 'edge-case' },
    { content: 'For piecewise parameter problems, match BOTH one-sided limits to the value at the break — matching only one side misses a hidden jump.', kind: 'tip' },
  ],
};
