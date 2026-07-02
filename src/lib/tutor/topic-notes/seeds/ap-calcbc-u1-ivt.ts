/**
 * AP Calculus BC — Unit 1 CED 1.16: Working with the Intermediate Value
 * Theorem (IVT).
 *
 * Hand-curated baseline mined from evelyn.ap.calcbc.intermediate-value-theorem.v1,
 * following the calibration set by seeds/ap-calcbc-u1-defining-limits.ts: every
 * theory entry carries kind+title, methods are humanized with when_to_use + a
 * worked example, pointers are a kind mix (tip / frq-vocab / gotcha /
 * edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so values open with a non-digit (a variable, \le, f(c), etc.).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.intermediate-value-theorem';

export const BASELINE_AP_CALCBC_IVT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.intermediate-value-theorem.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.16',
  cedTitle: 'Working with the Intermediate Value Theorem (IVT)',
  planId: 'evelyn.ap.calcbc.intermediate-value-theorem.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.intermediate-value-theorem.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Intermediate Value Theorem (statement + hypotheses)',
      content:
        'If $f$ is CONTINUOUS on the closed interval $[a,b]$, and $N$ is any value between $f(a)$ and $f(b)$, then there EXISTS at least one $c$ in $(a,b)$ such that $f(c)=N$. The two hypotheses are load-bearing: (i) $f$ is continuous on the CLOSED interval $[a,b]$ (endpoints included), and (ii) $N$ lies between $f(a)$ and $f(b)$, i.e. $\\min(f(a),f(b)) \\le N \\le \\max(f(a),f(b))$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'What IVT means in words',
      content:
        'A continuous function "fills in" every $y$-value between its endpoint values — it cannot skip any. If you move continuously from height $f(a)$ to height $f(b)$, you must pass through every height in between. IVT is a "no skipping values" theorem.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Root existence (the flagship application)',
      content:
        'To show $f$ has a zero in $(a,b)$, apply IVT with $N=0$: verify (i) $f$ is continuous on $[a,b]$, and (ii) $f(a)$ and $f(b)$ have OPPOSITE SIGNS (one positive, one negative). Then $N=0$ lies between $f(a)$ and $f(b)$, so there exists $c$ in $(a,b)$ with $f(c)=0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Solution & fixed-point existence (reduce to a root)',
      content:
        'To show $g(x)=h(x)$ has a solution in $(a,b)$, set $f(x)=g(x)-h(x)$ and prove $f$ has a root — the crossing point is where $g=h$. To show a FIXED POINT $f(x)=x$ exists, apply the same idea to $g(x)=f(x)-x$ and find a zero of $g$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'What IVT does and does NOT give',
      content:
        'IVT is an EXISTENCE statement: it guarantees at least one $c$ with $f(c)=N$, but it does NOT locate $c$ (no value), and it does NOT claim $c$ is unique — there may be several. It is a "yes, there is at least one" theorem, never a "here is where it is" theorem.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'continuous on a closed interval',
      content:
        '$f$ is continuous on $[a,b]$ when it is continuous at every interior point and one-sided continuous at each endpoint (continuous from the right at $a$, from the left at $b$). This is the precise hypothesis IVT requires.',
    },
  ],
  methods: [
    {
      title: 'Prove a root/solution exists on an interval with IVT',
      when_to_use:
        'When asked to show $f$ has a zero, or that $g(x)=h(x)$ has a solution, on a given interval $(a,b)$ — and you are NOT asked to find its value.',
      steps: [
        'If the prompt is an equation, rewrite it as $f(x)=0$ (e.g. $g(x)=h(x)$ becomes $f(x)=g(x)-h(x)$).',
        'STATE that $f$ is continuous on $[a,b]$, and say WHY (polynomial, sum/difference of continuous functions, etc.) — this invokes IVT.',
        'Evaluate the endpoints $f(a)$ and $f(b)$ and note their signs.',
        'Check that the target value $N$ (usually $N=0$) lies between $f(a)$ and $f(b)$ — for a root, confirm $f(a)$ and $f(b)$ have opposite signs.',
        'Conclude by IVT: there exists $c$ in $(a,b)$ with $f(c)=N$. State the conclusion in the problem\'s own terms.',
      ],
      example: {
        problem:
          'Use the IVT to show that $f(x)=x^3+x-3$ has a root in the interval $(1,2)$.',
        solution:
          '$f$ is a polynomial, so it is continuous on $[1,2]$. Endpoints: $f(1)=1+1-3=-1<0$ and $f(2)=8+2-3=7>0$. Since $N=0$ lies between $f(1)=-1$ and $f(2)=7$ and $f$ is continuous on $[1,2]$, by IVT there exists $c$ in $(1,2)$ with $f(c)=0$. So $f$ has at least one root in $(1,2)$. IVT gives existence only — not the value of $c$, and not uniqueness.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'On an FRQ you MUST explicitly state "$f$ is continuous on $[a,b]$" (and why) to invoke IVT — a bare sign check earns no credit without the continuity claim.', kind: 'frq-vocab' },
    { content: 'IVT proves EXISTENCE only. Do not claim $c$ is unique or state its value — writing "$f(c)=0$ for exactly one $c$" is a common over-conclusion.', kind: 'common-error' },
    { content: 'Continuity on the CLOSED interval $[a,b]$ is essential: a discontinuous function can jump over the value $N$, so IVT does not apply.', kind: 'gotcha' },
    { content: 'If $f(a)$ and $f(b)$ have the SAME sign, IVT proves nothing about a root — there may still be one, but you cannot conclude it. Try a sub-interval where $f$ changes sign.', kind: 'edge-case' },
    { content: 'The conclusion $c$ lives in the OPEN interval $(a,b)$, while continuity is required on the CLOSED interval $[a,b]$ — keep the brackets straight.', kind: 'tip' },
  ],
};
