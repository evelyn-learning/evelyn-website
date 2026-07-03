/**
 * AP Calculus BC — Unit 1 CED 1.8: Determining Limits Using the Squeeze
 * Theorem.
 *
 * Hand-curated baseline mined from evelyn.ap.calcbc.squeeze-theorem.v1,
 * following the calibration set by seeds/ap-calcbc-u1-defining-limits.ts: every
 * theory entry carries kind+title, methods are humanized with when_to_use + a
 * worked example, pointers are a kind mix (tip / frq-vocab / gotcha /
 * edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so values open with a non-digit (a variable, \le, \lim, etc.).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.squeeze-theorem';

export const BASELINE_AP_CALCBC_SQUEEZE_THEOREM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.squeeze-theorem.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.8',
  cedTitle: 'Determining Limits Using the Squeeze Theorem',
  planId: 'evelyn.ap.calcbc.squeeze-theorem.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.squeeze-theorem.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Squeeze Theorem (statement + hypotheses)',
      content:
        'Suppose $g(x) \\le f(x) \\le h(x)$ for all $x$ near $a$ (except possibly at $a$ itself), AND $\\lim_{x\\to a} g(x) = \\lim_{x\\to a} h(x) = L$. Then $\\lim_{x\\to a} f(x) = L$. Both hypotheses matter: the trapping inequality must hold near $a$, and the two bounding limits must BOTH exist and equal the SAME value $L$. Also called the "Sandwich Theorem."',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Intuition — the squeeze',
      content:
        'If two functions both approach $L$ from above and below, anything trapped between them is forced to approach $L$ too. As the outer bounds close in on $L$, the middle function has nowhere else to go.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When to reach for it',
      content:
        'Use the Squeeze Theorem on functions that OSCILLATE without an obvious form — typically $\\sin\\!\\left(\\tfrac{1}{x}\\right)$, $\\cos\\!\\left(\\tfrac{1}{x}\\right)$, or similar expressions that misbehave near the target. Direct substitution fails (the argument blows up) and factoring/conjugates/trig identities do not apply.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The bounding property',
      content:
        'The engine of most squeeze problems: $\\left|\\sin(\\text{anything})\\right| \\le 1$ and $\\left|\\cos(\\text{anything})\\right| \\le 1$, ALWAYS, regardless of the argument. Multiplying these bounds by a factor that goes to zero traps the whole expression: $-|x| \\le x\\sin\\!\\left(\\tfrac{1}{x}\\right) \\le |x|$, and both $\\pm|x|\\to 0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Second use — proving the special trig limit',
      content:
        'The foundational limit $\\lim_{x\\to 0} \\tfrac{\\sin x}{x} = 1$ is PROVED by squeezing: geometric area bounds give $\\cos x \\le \\tfrac{\\sin x}{x} \\le 1$ for $x$ near $x=0$, and both bounds approach the value $L=1$. AP does not require the proof, but knowing it explains where the limit comes from.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'bounded function',
      content:
        'a function whose values stay within fixed limits — e.g. $\\sin$ and $\\cos$ are bounded because their outputs never leave $[-1,1]$. Boundedness of a wild factor is the signal that the Squeeze Theorem may apply.',
    },
  ],
  methods: [
    {
      title: 'Evaluate an oscillating limit with the Squeeze Theorem',
      when_to_use:
        'When a limit involves $\\sin$ or $\\cos$ of an argument that blows up near the target (e.g. $\\sin\\!\\left(\\tfrac{1}{x}\\right)$), so direct substitution and algebra fail but a bounded factor is present.',
      steps: [
        'RECOGNIZE the bounded factor: identify the $\\sin$/$\\cos$ piece that stays within $[-1,1]$.',
        'BOUND the expression: replace the bounded factor by $\\pm 1$ to write $g(x) \\le f(x) \\le h(x)$ (multiply the inequality by the remaining factor, keeping sign direction — use $|\\cdot|$ to stay safe).',
        'CHECK the bounding limits: confirm $\\lim_{x\\to a} g(x)$ and $\\lim_{x\\to a} h(x)$ both exist and equal the SAME value $L$.',
        'CONCLUDE by the Squeeze Theorem: since $f$ is trapped between $g$ and $h$ and both approach $L$, $\\lim_{x\\to a} f(x)=L$.',
      ],
      example: {
        problem:
          'Compute $\\lim_{x\\to 0} x^2 \\sin\\!\\left(\\tfrac{1}{x}\\right)$, where $\\sin\\!\\left(\\tfrac{1}{x}\\right)$ oscillates wildly as $x\\to 0$.',
        solution:
          'Since $-1 \\le \\sin\\!\\left(\\tfrac{1}{x}\\right) \\le 1$ for all $x\\ne 0$, multiply by $x^2 \\ge 0$: $-x^2 \\le x^2\\sin\\!\\left(\\tfrac{1}{x}\\right) \\le x^2$. Now $\\lim_{x\\to 0} x^2 = 0$ and $\\lim_{x\\to 0} (-x^2) = 0$ — both bounds approach the same value. By the Squeeze Theorem, $\\lim_{x\\to 0} x^2\\sin\\!\\left(\\tfrac{1}{x}\\right)=0$. The oscillation does not matter because $x^2\\to 0$ crushes the bounded factor.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The squeeze only works if BOTH bounds approach the SAME limit. $-1 \\le \\sin\\!\\left(\\tfrac{1}{x}\\right) \\le 1$ does NOT squeeze — the bounds disagree, so $\\lim_{x\\to 0}\\sin\\!\\left(\\tfrac{1}{x}\\right)$ DNE.', kind: 'common-error' },
    { content: 'On an FRQ, explicitly write the trapping inequality $g(x)\\le f(x)\\le h(x)$ AND show $\\lim g = \\lim h = L$ before stating the conclusion — that chain is what earns the points.', kind: 'frq-vocab' },
    { content: 'When multiplying an inequality by a factor that can be negative, use absolute values ($-|x|\\le x\\cos\\!\\left(\\tfrac{1}{x}\\right)\\le |x|$) so the inequality direction stays valid on both sides of $a$.', kind: 'gotcha' },
    { content: 'Squeeze can be "available but unnecessary": for $\\lim_{x\\to 0} x\\sin x$, direct substitution already gives $x\\sin x\\to 0$ — reach for the simplest tool first.', kind: 'edge-case' },
    { content: 'The signal to try squeezing is a $\\sin$ or $\\cos$ of an unfriendly argument multiplied by something heading to zero — spot the bounded factor first.', kind: 'tip' },
  ],
};
