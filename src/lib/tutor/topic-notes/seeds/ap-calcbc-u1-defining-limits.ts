/**
 * AP Calculus BC — Unit 1 CED 1.2: Defining Limits and Using Limit Notation.
 *
 * CALIBRATION baseline for AP Calc BC notes (the gold reference the fan-out
 * follows). Hand-curated from the source plan evelyn.ap.calcbc.defining-limits.v1
 * to the standard set by seeds/ap-macro-u4-loanable-funds.ts + the six
 * ap-stats-u1-*.ts files: every theory entry carries kind+title, methods are
 * humanized with when_to_use + a worked example, pointers are a kind mix
 * (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so bounds/values open with a non-digit (\lim, \le, a variable).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.defining-limits';

export const BASELINE_AP_CALCBC_DEFINING_LIMITS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.defining-limits.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Defining Limits and Using Limit Notation',
  planId: 'evelyn.ap.calcbc.defining-limits.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.defining-limits.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Informal definition of a limit',
      content:
        '$\\lim_{x\\to a} f(x) = L$ means: as $x$ gets arbitrarily close to $a$ (from either side, but $x \\ne a$), $f(x)$ gets arbitrarily close to $L$. The limit describes the behavior of $f$ NEAR $a$ — the value $f(a)$ itself is irrelevant and may be different, equal, or undefined.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Limit notation & one-sided limits',
      content:
        'Read $\\lim_{x\\to a} f(x) = L$ as "the limit as $x$ approaches $a$ of $f(x)$ equals $L$." The one-sided limits are $\\lim_{x\\to a^-} f(x)$ (from the LEFT, $x < a$) and $\\lim_{x\\to a^+} f(x)$ (from the RIGHT, $x > a$).',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Existence criterion',
      content:
        'A two-sided limit exists iff both one-sided limits exist AND agree: $\\lim_{x\\to a} f(x) = L \\iff \\lim_{x\\to a^-} f(x) = L \\text{ and } \\lim_{x\\to a^+} f(x) = L$. If the two sides disagree, the two-sided limit does not exist.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When a limit does not exist (DNE)',
      content:
        'A limit DNE when: (a) the one-sided limits are unequal — a JUMP, e.g. a step function; (b) the function grows without bound near $a$ — an INFINITE limit, e.g. $\\tfrac{1}{x}$ at $x=0$; (c) the function OSCILLATES without settling, e.g. $\\sin\\!\\left(\\tfrac{1}{x}\\right)$ as $x\\to 0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Infinite limits',
      content:
        'When $f(x)$ increases without bound near $a$ we write $\\lim_{x\\to a} f(x) = \\infty$ (or $-\\infty$). This DESCRIBES the behavior, but a limit of $\\infty$ is not a finite real number, so the limit technically does not exist. AP convention: "$=\\infty$" and "DNE" are both acceptable for this case.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'one-sided limit',
      content: 'the limit of $f(x)$ as $x$ approaches $a$ from only the left ($x\\to a^-$) or only the right ($x\\to a^+$).',
    },
  ],
  methods: [
    {
      title: 'Evaluate a limit at a point from a piecewise rule or a graph',
      when_to_use:
        'When asked for a one- or two-sided limit at $x=a$, or to decide whether $\\lim_{x\\to a} f(x)$ exists, given a piecewise formula or a graph.',
      steps: [
        'Find the LEFT-hand limit: use the branch/behavior for $x < a$ and let $x\\to a^-$.',
        'Find the RIGHT-hand limit: use the branch/behavior for $x > a$ and let $x\\to a^+$.',
        'If the two one-sided limits are equal, that common value is $\\lim_{x\\to a} f(x)$; if they differ, the two-sided limit DNE.',
        'Read $f(a)$ SEPARATELY from the definition/graph — do not assume it equals the limit.',
        'State the limit(s); if asked, compare the limit to $f(a)$ to classify the point (continuous, removable, jump).',
      ],
      example: {
        problem:
          'Let $f(x) = x + 1$ for $x < 2$, $f(2) = 5$, and $f(x) = x + 1$ for $x > 2$. Find $\\lim_{x\\to 2^-} f(x)$, $\\lim_{x\\to 2^+} f(x)$, $\\lim_{x\\to 2} f(x)$, and $f(2)$.',
        solution:
          'Left: as $x\\to 2^-$, $f(x)=x+1\\to 3$. Right: as $x\\to 2^+$, $f(x)=x+1\\to 3$. Both sides agree, so $\\lim_{x\\to 2} f(x)=3$. But $f(2)=5$ by definition. So $\\lim_{x\\to 2} f(x)=3 \\ne f(2)=5$ — the limit "does not see" the single reassigned value (a removable discontinuity, formalized in 1.10).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The limit is about behavior NEAR $a$, not the value AT $a$: $\\lim_{x\\to a} f(x)$ can differ from $f(a)$, and $f(a)$ may be undefined.', kind: 'common-error' },
    { content: 'To justify a two-sided limit on an FRQ, show BOTH one-sided limits and state that they are equal.', kind: 'frq-vocab' },
    { content: 'Writing "$=\\infty$" describes unbounded growth but the limit does not exist as a finite number — say which the prompt wants.', kind: 'gotcha' },
    { content: 'A limit can exist where the function is undefined (e.g. a hole): existence of the limit ≠ the point being in the domain.', kind: 'edge-case' },
    { content: 'Always check BOTH sides before claiming a two-sided limit — a jump hides when you only look at one side.', kind: 'tip' },
  ],
};
