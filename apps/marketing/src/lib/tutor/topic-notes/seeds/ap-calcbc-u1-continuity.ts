/**
 * AP Calculus BC — Unit 1 CED 1.11–1.12: Defining Continuity at a Point
 * and Confirming Continuity over an Interval.
 *
 * Hand-curated from the source plan evelyn.ap.calcbc.continuity.v1 to the
 * gold standard set by seeds/ap-calcbc-u1-defining-limits.ts: every theory
 * entry carries kind+title, methods are humanized with when_to_use + a worked
 * example, pointers are a kind mix (tip / frq-vocab / gotcha / edge-case /
 * common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so bounds/values open with a non-digit (\lim, \le, a variable, a minus sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.continuity';

export const BASELINE_AP_CALCBC_CONTINUITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.continuity.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.11',
  cedTitle: 'Defining Continuity at a Point and Over an Interval',
  planId: 'evelyn.ap.calcbc.continuity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.continuity.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Continuity at a point — the three conditions',
      content:
        'A function $f$ is continuous at $x=a$ iff ALL THREE hold: (1) $f(a)$ is defined; (2) $\\lim_{x\\to a} f(x)$ exists as a finite number; (3) $\\lim_{x\\to a} f(x) = f(a)$. Condition (3) actually implies (1) and (2), but checking all three in order localizes exactly what breaks. If any one fails, $f$ is discontinuous at $a$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Which condition fails → which discontinuity',
      content:
        'The three conditions map to failure types. (1) $f(a)$ undefined → typically a removable hole or an infinite discontinuity. (2) $\\lim_{x\\to a} f(x)$ does not exist → a jump (one-sided limits disagree) or oscillation. (3) limit exists but $\\lim_{x\\to a} f(x) \\ne f(a)$ → a removable discontinuity (the value is "misplaced").',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Continuity over an interval',
      content:
        '$f$ is continuous on an OPEN interval $(a,b)$ if it is continuous at every point of $(a,b)$. On a CLOSED interval $[a,b]$: continuous at every interior point, AND right-continuous at the left endpoint ($\\lim_{x\\to a^+} f(x) = f(a)$), AND left-continuous at the right endpoint ($\\lim_{x\\to b^-} f(x) = f(b)$). Endpoints only require the one-sided limit that points INTO the interval.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Standard continuous families',
      content:
        'These are continuous wherever they are defined: polynomials (all of $\\mathbb{R}$); rational functions (where the denominator $\\ne 0$); $\\sin x$ and $\\cos x$ (all of $\\mathbb{R}$); $\\tan x,\\ \\sec x,\\ \\csc x,\\ \\cot x$ (where their denominator $\\ne 0$); $e^x$ (all of $\\mathbb{R}$); $\\ln x$ (on $(0,\\infty)$); $\\sqrt{x}$ (on $[0,\\infty)$).',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Operations preserving continuity',
      content:
        'If $f$ and $g$ are continuous at $a$, then so are $f\\pm g$, $f\\cdot g$, and $f/g$ (provided $g(a)\\ne 0$). Composition: $g\\big(f(x)\\big)$ is continuous at $a$ if $f$ is continuous at $a$ and $g$ is continuous at $f(a)$. This lets you certify large expressions as continuous without an $\\varepsilon$-$\\delta$ argument.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Piecewise functions & break points',
      content:
        'For a piecewise $f$, the only places continuity can fail are the BREAK POINTS where the formula changes. At each break $x=a$, compute the left-hand limit, the right-hand limit, and $f(a)$, then verify all three conditions. Away from breaks each branch is a standard continuous family, so it is automatically continuous.',
    },
  ],
  methods: [
    {
      title: 'Make a piecewise function continuous at a break point',
      when_to_use:
        'When a piecewise $f$ contains an unknown constant and you must choose it so $f$ is continuous at the break $x=a$ (a very common AP form).',
      steps: [
        'Identify the break point $x=a$ where the formula changes.',
        'Compute the LEFT limit $\\lim_{x\\to a^-} f(x)$ using the branch for $x<a$.',
        'Compute the RIGHT limit $\\lim_{x\\to a^+} f(x)$ using the branch for $x>a$.',
        'Write $f(a)$ using whichever branch owns the point $x=a$.',
        'Continuity requires left limit $=$ right limit $= f(a)$; set them equal and solve for the unknown. If the equation is a contradiction, NO value works.',
      ],
      example: {
        problem:
          'Let $f(x)=x+1$ for $x<2$, $f(x)=c$ for $x=2$, and $f(x)=3x-3$ for $x>2$. Find $c$ so that $f$ is continuous at $x=2$.',
        solution:
          'Left: as $x\\to 2^-$, $x+1\\to 3$. Right: as $x\\to 2^+$, $f(x)=3x-3\\to 3$. The one-sided limits agree, so $\\lim_{x\\to 2} f(x)=3$. Continuity condition (3) needs $f(2)=\\lim_{x\\to 2} f(x)$, i.e. $c=3$. Check: with $c=3$, $f(2)=3$ and the limit is $L=3$ — all three conditions hold. Answer: $c=3$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find the largest interval on which a function is continuous',
      when_to_use:
        'When asked for the domain of continuity of a standard-family function (rational, root, log, trig).',
      steps: [
        'Recognize the family; for standard families the continuity domain equals the domain where the function is defined.',
        'Solve the defining condition: denominator $\\ne 0$ (rational/trig), radicand $\\ge 0$ (even root), argument $>0$ (logarithm).',
        'For a closed endpoint (e.g. an even root), confirm one-sided continuity at that endpoint before including it.',
        'Write the answer in interval notation, splitting at every excluded point.',
      ],
      example: {
        problem:
          'Give the largest interval(s) on which $g(x)=\\sqrt{x-5}$ is continuous.',
        solution:
          'The radicand needs $x-5\\ge 0$, so $x\\ge 5$. At the endpoint, $\\lim_{x\\to 5^+}\\sqrt{x-5}=0=\\sqrt{0}=g(5)$, so $g$ is right-continuous there and the endpoint is included. Continuous on $[5,\\infty)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Continuity is more than "the limit exists" — you also need $f(a)$ defined AND equal to that limit. A hole has a limit but is not continuous.', kind: 'common-error' },
    { content: 'To justify continuity on an FRQ, explicitly state all three: $f(a)$ is defined, $\\lim_{x\\to a} f(x)$ exists, and the two are equal.', kind: 'frq-vocab' },
    { content: 'A closed-interval endpoint only needs the ONE-sided limit that points into the interval — do not demand a two-sided limit at $x=a$ or $x=b$.', kind: 'gotcha' },
    { content: 'Some piecewise setups have NO parameter value that works: if matching the one-sided limits forces a contradiction (like $a=a+2$), report that continuity is impossible.', kind: 'edge-case' },
    { content: 'Check continuity only at break points and family-exclusion points — the rest of a standard function is continuous for free.', kind: 'tip' },
  ],
};
