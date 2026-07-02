/**
 * AP Calculus BC — Unit 1 CED 1.6: Determining Limits Using Algebraic
 * Manipulation.
 *
 * Baseline curated from evelyn.ap.calcbc.limits-algebraic-manipulation.v1 to
 * the standard set by seeds/ap-calcbc-u1-defining-limits.ts: theory entries
 * carry kind+title, methods have when_to_use + a worked example (factor,
 * conjugate, common denominator, trig identity), pointers mix kinds.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe
 * renderer), so values open with a non-digit (\lim, a variable, =, an
 * operator, or a backslash macro).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.limits-algebraic-manipulation';

export const BASELINE_AP_CALCBC_LIMITS_ALGEBRAIC_MANIPULATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.limits-algebraic-manipulation.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.6',
  cedTitle: 'Determining Limits Using Algebraic Manipulation',
  planId: 'evelyn.ap.calcbc.limits-algebraic-manipulation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.limits-algebraic-manipulation.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'General strategy for 0/0',
      content:
        'When direct substitution yields $\\tfrac{0}{0}$, the function is not truly undefined at the limit — it just hides a common factor that makes both numerator and denominator zero at $x=a$. The plan: perform an algebraic move that CANCELS the offending factor, then direct-substitute into the simplified expression.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Technique 1 — Factoring',
      content:
        'When numerator and denominator share a polynomial factor (usually $(x-a)$ for a limit at $x=a$), factor both and cancel it. Example: $\\tfrac{x^{2}-4}{x-2} = \\tfrac{(x-2)(x+2)}{x-2} = x+2$ for $x\\ne 2$, so $\\lim_{x\\to 2}\\tfrac{x^{2}-4}{x-2} = 2+2 = 4$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Technique 2 — Conjugate',
      content:
        'When a difference of square roots appears (like $\\sqrt{x}-2$), multiply numerator and denominator by the CONJUGATE $(\\sqrt{x}+2)$. The product is a difference of squares that clears the radical. Example: $\\lim_{x\\to 4}\\tfrac{\\sqrt{x}-2}{x-4} = \\lim_{x\\to 4}\\tfrac{x-4}{(x-4)(\\sqrt{x}+2)} = \\lim_{x\\to 4}\\tfrac{1}{\\sqrt{x}+2} = \\tfrac{1}{4}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Technique 3 — Common denominator',
      content:
        'When the limit numerator itself contains small fractions (a complex fraction), combine them over a common denominator first, then simplify. Example: $\\lim_{x\\to 2}\\tfrac{\\frac{1}{x}-\\frac{1}{2}}{x-2}$: the top is $\\tfrac{2-x}{2x}$, so the whole is $\\tfrac{2-x}{2x(x-2)} = \\tfrac{-(x-2)}{2x(x-2)} = \\tfrac{-1}{2x}$, giving $\\lim = -\\tfrac{1}{4}$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Technique 4 — Special trig limits',
      content:
        'Two identities to memorize: $\\lim_{x\\to 0}\\tfrac{\\sin(x)}{x} = 1$ and $\\lim_{x\\to 0}\\tfrac{1-\\cos(x)}{x} = 0$ (equivalently $\\lim_{x\\to 0}\\tfrac{\\cos(x)-1}{x} = 0$). Both are $\\tfrac{0}{0}$ under substitution, so they are NOT substitution results — they are proved geometrically via the squeeze theorem (Topic 1.8). To use them, manipulate to expose $\\tfrac{\\sin(u)}{u}$ where $u\\to 0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Selecting the technique by the offending factor',
      content:
        'Diagnose $\\tfrac{0}{0}$ by what causes it: polynomial roots $\\Rightarrow$ FACTOR; a square root $\\Rightarrow$ CONJUGATE; a fraction-inside-a-fraction $\\Rightarrow$ COMMON DENOMINATOR; $\\sin$ or $\\cos$ in the numerator $\\Rightarrow$ SPECIAL TRIG LIMITS. AP items are typed to each move, so recognize the pattern by inspection.',
    },
  ],
  methods: [
    {
      title: 'Resolve a 0/0 limit by factoring and canceling',
      when_to_use:
        'When direct substitution gives $\\tfrac{0}{0}$ and the expression is a ratio of polynomials — the numerator and denominator share a $(x-a)$ factor.',
      steps: [
        'Direct-substitute to confirm the form is $\\tfrac{0}{0}$ (indeterminate).',
        'Factor the numerator and the denominator completely.',
        'Cancel the common factor, noting the simplified form is valid for $x\\ne a$.',
        'Direct-substitute $x=a$ into the simplified expression to get the limit.',
      ],
      example: {
        problem: 'Compute $\\lim_{x\\to 3}\\tfrac{x^{2}-9}{x^{2}-5x+6}$.',
        solution:
          'Substitution gives $\\tfrac{9-9}{9-15+6} = \\tfrac{0}{0}$. Factor: numerator $x^{2}-9 = (x-3)(x+3)$, denominator $x^{2}-5x+6 = (x-2)(x-3)$. Cancel $(x-3)$: $\\tfrac{x+3}{x-2}$ for $x\\ne 3$. Substitute: $\\tfrac{3+3}{3-2} = \\tfrac{6}{1} = 6$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Resolve a 0/0 limit involving sin or cos',
      when_to_use:
        'When substitution gives $\\tfrac{0}{0}$ and a $\\sin$ or $\\cos$ sits in the numerator — rewrite to expose $\\tfrac{\\sin(u)}{u}\\to 1$ or $\\tfrac{1-\\cos(u)}{u}\\to 0$.',
      steps: [
        'Confirm $\\tfrac{0}{0}$ by substitution.',
        'Multiply/divide to build the exact argument inside the sine into the denominator, e.g. turn $\\tfrac{\\sin(5x)}{2x}$ into $\\tfrac{5}{2}\\cdot\\tfrac{\\sin(5x)}{5x}$.',
        'Apply the identity: as $x\\to 0$, the inner argument $\\to 0$, so $\\tfrac{\\sin(5x)}{5x}\\to 1$.',
        'Multiply by the leftover constant to finish.',
      ],
      example: {
        problem: 'Compute $\\lim_{x\\to 0}\\tfrac{\\sin(5x)}{2x}$.',
        solution:
          'Substitution gives $\\tfrac{\\sin(0)}{0} = \\tfrac{0}{0}$. Rewrite: $\\tfrac{\\sin(5x)}{2x} = \\tfrac{5}{2}\\cdot\\tfrac{\\sin(5x)}{5x}$. As $x\\to 0$, $(5x)\\to 0$, so $\\tfrac{\\sin(5x)}{5x}\\to 1$. Thus $\\lim = \\tfrac{5}{2}\\cdot 1 = \\tfrac{5}{2}$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Canceling a factor finds the LIMIT but does NOT make the original function defined at $x=a$. The original $\\tfrac{x^{2}-4}{x-2}$ still has a hole at $x=2$; the simplified $x+2$ is a different function that merely agrees for $x\\ne 2$.', kind: 'common-error' },
    { content: 'On an FRQ, write the cancellation with the caveat "for $x\\ne a$" — it signals you know the simplified expression is only equal away from the point.', kind: 'frq-vocab' },
    { content: 'The conjugate of $\\sqrt{x}-3$ is $\\sqrt{x}+3$; the product is $x-9$ (difference of squares). Multiply BOTH numerator and denominator by it, never just one.', kind: 'tip' },
    { content: 'For $\\lim_{x\\to 0}\\tfrac{1-\\cos(x)}{x^{2}}$, multiply by $\\tfrac{1+\\cos(x)}{1+\\cos(x)}$ to get $\\tfrac{\\sin^{2}(x)}{x^{2}(1+\\cos(x))} = \\left(\\tfrac{\\sin(x)}{x}\\right)^{2}\\tfrac{1}{1+\\cos(x)}\\to \\tfrac{1}{2}$.', kind: 'edge-case' },
    { content: 'The special trig limits only apply as the argument $\\to 0$. $\\tfrac{\\sin(3x)}{3x}\\to 1$ works because $(3x)\\to 0$; do not apply the identity when the argument approaches anything other than $=0$.', kind: 'gotcha' },
  ],
};
