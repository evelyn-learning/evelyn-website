/**
 * AP Calculus BC — Unit 3 CED 3.2: Implicit Differentiation.
 *
 * Baseline curated from evelyn.ap.calcbc.implicit-differentiation.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every span opens with a
 * non-digit.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.implicit-differentiation';

export const BASELINE_AP_CALCBC_IMPLICIT_DIFFERENTIATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.implicit-differentiation.v1',
  course: 'AP Calculus BC',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Implicit Differentiation',
  planId: 'evelyn.ap.calcbc.implicit-differentiation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.implicit-differentiation.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Implicit equations',
      content:
        'An IMPLICIT equation relates $x$ and $y$ without expressing $y$ as a function of $x$ — e.g. $x^2 + y^2 = 25$, $\\sin(xy)=1$, $x^2y^3 + xy = 4$. Such curves still have tangent lines and slopes, so $\\dfrac{dy}{dx}$ exists even though we cannot (or would rather not) solve for $y$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Key insight: y is a function of x',
      content:
        'Even without $y=f(x)$ explicitly, the equation defines $y$ as an (implicit) function of $x$ locally. So we may differentiate EVERY term with respect to $x$, applying the chain rule wherever $y$ appears — because $y$ depends on $x$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The implicit differentiation procedure',
      content:
        'To find $\\dfrac{dy}{dx}$: (1) DIFFERENTIATE both sides with respect to $x$. (2) Wherever $y$ appears, treat it as a function of $x$ and apply the chain rule (multiply by $\\dfrac{dy}{dx}$). (3) COLLECT all $\\dfrac{dy}{dx}$ terms on one side and everything else on the other. (4) SOLVE for $\\dfrac{dy}{dx}$ — the result usually depends on BOTH $x$ and $y$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Key differentiation moves',
      content:
        'The core moves, each an application of the chain and product rules with $y=y(x)$: $\\dfrac{d}{dx}[y] = \\dfrac{dy}{dx}$; $\\dfrac{d}{dx}[y^2] = 2y\\,\\dfrac{dy}{dx}$; more generally $\\dfrac{d}{dx}[y^n] = n\\,y^{n-1}\\,\\dfrac{dy}{dx}$; and $\\dfrac{d}{dx}[xy] = y + x\\,\\dfrac{dy}{dx}$ (product rule). Combining: $\\dfrac{d}{dx}[\\sin(xy)] = \\cos(xy)\\big(y + x\\,\\dfrac{dy}{dx}\\big)$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Evaluating dy/dx at a point',
      content:
        'Because $\\dfrac{dy}{dx}$ depends on both $x$ and $y$, evaluate it by substituting BOTH coordinates of a point that lies ON the curve. Always confirm the point satisfies the original equation before using it — an off-curve point gives a meaningless slope.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'implicit differentiation',
      content: 'differentiating an equation in $x$ and $y$ with respect to $x$, treating $y$ as an implicit function of $x$.',
    },
  ],
  methods: [
    {
      title: 'Find dy/dx by implicit differentiation',
      when_to_use:
        'When an equation relates $x$ and $y$ but $y$ cannot be isolated cleanly, and you need the slope $\\dfrac{dy}{dx}$.',
      steps: [
        'Differentiate BOTH sides of the equation with respect to $x$.',
        'On every $y$-term, apply the chain rule: append a factor of $\\dfrac{dy}{dx}$; on mixed $xy$-terms use the product rule.',
        'Gather all $\\dfrac{dy}{dx}$ terms on one side, everything else on the other.',
        'Factor out $\\dfrac{dy}{dx}$ and divide to isolate it.',
      ],
      example: {
        problem: 'Find $\\dfrac{dy}{dx}$ for the unit circle $x^2 + y^2 = 1$, then the slope at $(3/5,\\,4/5)$.',
        solution:
          'Differentiate: $\\dfrac{d}{dx}[x^2+y^2]=2x + 2y\\,\\dfrac{dy}{dx} = 0$. Solve: $\\dfrac{dy}{dx} = -\\dfrac{x}{y}$. At $(3/5,4/5)$: $\\dfrac{dy}{dx} = -\\dfrac{3/5}{4/5} = -\\dfrac{3}{4}$. Check the point is on the curve: $(3/5)^2+(4/5)^2 = 9/25+16/25 = 1$. ✓',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find the tangent line to an implicit curve at a point',
      when_to_use:
        'AP-style requests for the tangent (or normal) line to a curve given by an implicit equation at a stated point.',
      steps: [
        'VERIFY the point satisfies the original equation (confirm it lies on the curve).',
        'Differentiate implicitly to get an expression for $\\dfrac{dy}{dx}$.',
        'Substitute the point BEFORE fully solving when possible — it is often algebraically cleaner.',
        'Use point-slope form $y - y_0 = m\\,(x - x_0)$ with $m = \\dfrac{dy}{dx}$ at the point.',
      ],
      example: {
        problem: 'Tangent line to $x^2 + xy + y^2 = 7$ at $(1,\\,2)$.',
        solution:
          'Check: $x^2+xy+y^2 = 1+2+4 = 7$. ✓ Differentiate: $\\dfrac{d}{dx}\\big[x^2+xy+y^2\\big] = 2x + (y + x\\,\\dfrac{dy}{dx}) + 2y\\,\\dfrac{dy}{dx} = 0$. Substituting $x=1,\\,y=2$ gives $\\dfrac{dy}{dx} = -\\dfrac{4}{5}$. Line: $y - 2 = -\\dfrac{4}{5}(x-1)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Every time you differentiate a $y$-term you MUST attach $\\dfrac{dy}{dx}$ — omitting it is the defining implicit-differentiation error.', kind: 'common-error' },
    { content: 'Terms mixing $x$ and $y$ (like $xy$ or $x^2y^3$) need the PRODUCT rule together with the chain rule, not just one of them.', kind: 'gotcha' },
    { content: 'For tangent-line FRQs, verify the point is on the curve and substitute it before solving for $\\dfrac{dy}{dx}$ — cleaner arithmetic and it earns the setup point.', kind: 'frq-vocab' },
    { content: 'The result $\\dfrac{dy}{dx}$ normally depends on BOTH $x$ and $y$; a slope in terms of $x$ alone usually signals a dropped $\\dfrac{dy}{dx}$ factor.', kind: 'tip' },
    { content: 'A vertical tangent occurs where the denominator of $\\dfrac{dy}{dx}$ is zero (numerator nonzero); a horizontal tangent where the numerator is zero (denominator nonzero).', kind: 'edge-case' },
  ],
};
