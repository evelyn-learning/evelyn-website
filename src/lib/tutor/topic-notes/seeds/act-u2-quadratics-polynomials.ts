/**
 * ACT — Unit 2 CED 2.4: Quadratics & Polynomials.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.quadratics-polynomials.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_QUADRATICS_POLYNOMIALS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.quadratics-polynomials.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Quadratics & Polynomials',
  planId: 'evelyn.testprep.act.quadratics-polynomials.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.quadratics-polynomials.v1' }],
  theory: [
    { loId: 'act.quadratics-polynomials', content: `FACTORING x² + bx + c: find two numbers that multiply to c and add to b, then write (x + p)(x + q). Example: x² - 2x - 15 needs two numbers multiplying to -15, adding to -2 → -5 and 3.` },
    { loId: 'act.quadratics-polynomials', content: `FOIL is the reverse check: (x + p)(x + q) = x² + (p + q)x + pq — First, Outer, Inner, Last. Use it to verify a factoring by re-expanding.` },
    { loId: 'act.quadratics-polynomials', content: `ZERO PRODUCT PROPERTY: if (x - a)(x - b) = 0, then x = a or x = b. This ONLY works when one side of the equation is exactly 0.` },
    { loId: 'act.quadratics-polynomials', kind: 'framework', title: 'Trap', content: `TRAP — NOT SET TO ZERO FIRST: ACT loves equations like x² + 4x = 21. You cannot factor and split at 21 — you MUST move everything to one side first: x² + 4x - 21 = 0, THEN factor and use the zero product property.` },
    { loId: 'act.quadratics-polynomials', content: `DIFFERENCE OF SQUARES: a² - b² = (a - b)(a + b). Recognize it instantly — ACT disguises it as things like x² - 49 or 4x² - 9.` },
    { loId: 'act.quadratics-polynomials', kind: 'framework', title: 'Trap', content: `TRAP — SQUARING A BINOMIAL ≠ DIFFERENCE OF SQUARES: (x - b)² = x² - 2bx + b², NOT x² - b². Students confuse this with the difference-of-squares pattern and drop the middle term.` },
    { loId: 'act.quadratics-polynomials', content: `QUADRATIC FORMULA FALLBACK: x = (-b ± √(b² - 4ac)) / (2a). Use it when a quadratic does not factor with nice integers.` },
    { loId: 'act.quadratics-polynomials', content: `THE DISCRIMINANT (b² - 4ac) tells you how many real solutions without fully solving: positive → two real solutions, zero → one repeated solution, negative → no real solutions.` },
    { loId: 'act.quadratics-polynomials', kind: 'definition', title: 'zero product property', content: `if a product of factors equals 0, at least one of the factors must equal 0 — only valid when the product is set equal to 0.` },
    { loId: 'act.quadratics-polynomials', kind: 'definition', title: 'discriminant', content: `the quantity b² - 4ac inside the quadratic formula's square root; its sign tells you how many real solutions the quadratic has.` },
    { loId: 'act.quadratics-polynomials', kind: 'definition', title: 'FOIL', content: 'First, Outer, Inner, Last — the order for multiplying two binomials together.' },
    { loId: 'act.quadratics-polynomials', kind: 'definition', title: 'like terms', content: `terms with the same variable raised to the same power (e.g., 3x² and -5x², but not 3x² and 3x), which can be combined by adding coefficients.` },
  ],
  methods: [
    {
      title: 'Worked basic factoring',
      steps: [
        'The equation is already set to 0, so we can factor directly.',
        `Find two numbers that multiply to -15 and add to -2: -5 and 3 (check: -5 × 3 = -15, -5 + 3 = -2).`,
        'Factor: (x - 5)(x + 3) = 0.',
        'Apply the zero product property: x - 5 = 0 or x + 3 = 0, so x = 5 or x = -3.',
      ],
      example: { problem: 'Solve for x: x² - 2x - 15 = 0.', solution: 'x = 5 or x = -3' },
      relatedLoIds: ['act.quadratics-polynomials'],
    },
    {
      title: 'Worked not zeroed trap',
      steps: [
        `TRAP: a student might rewrite the left side as x(x + 4) = 21 and then set x = 21 and x + 4 = 21. This is WRONG — the zero product property only works when the product equals 0, not 21.`,
        `Correct move: move 21 to the left side first, so the equation equals 0: x² + 4x - 21 = 0.`,
        `Find two numbers that multiply to -21 and add to 4: 7 and -3 (check: 7 × -3 = -21, 7 + (-3) = 4).`,
        'Factor: (x + 7)(x - 3) = 0. Zero product property: x = -7 or x = 3.',
      ],
      example: { problem: 'Solve for x: x² + 4x = 21.', solution: 'x = -7 or x = 3' },
      relatedLoIds: ['act.quadratics-polynomials'],
    },
  ],
  pointers: [
    { content: `(x - 5)² means (x - 5)(x - 5). FOIL it out: x² - 5x - 5x + 25 = x² - 10x + 25. The shortcut x² - 25 only applies to the DIFFERENT expression (x - 5)(x + 5) — always check whether you're squaring a binomial or multiplying conjugates.`, kind: 'common-error' },
    { content: `Factor x² + bx + c by finding two numbers that multiply to c and add to b; check your work with FOIL.`, kind: 'tip' },
    { content: `The zero product property only works once the equation is set equal to 0 — move all terms to one side FIRST.`, kind: 'tip' },
    { content: `Recognize a² - b² = (a - b)(a + b) instantly, and don't confuse it with (a ± b)², which has a middle term.`, kind: 'tip' },
    { content: `When factoring stalls, use the quadratic formula; the discriminant (b² - 4ac) tells you how many real solutions exist before you even finish solving.`, kind: 'tip' },
    { content: `Sign flip on the roots: factoring to $(x-5)(x+3)=0$ gives $x=5$ and $x=-3$, NOT $-5$ and $3$. The ACT always stocks the answer choices with the factor numbers themselves. Read off the roots by setting each factor to zero, never by copying the numbers inside.`, kind: 'common-error' },
    { content: `When one root is given ("one solution is $x=8$"), skip factoring: the two roots multiply to $c$ and add to $-b$. For $x^2-5x-24$: $8 \\cdot ? = -24 \\Rightarrow ?=-3$. Faster than re-factoring the whole trinomial.`, kind: 'tip' },
    { content: `Watch for a leading coefficient: $2x^2+5x-3$ does NOT factor as (x+p)(x+q). Either factor out a common number first (if one exists) or go straight to the quadratic formula — don't force the multiply-to-c/add-to-b trick where $a \\neq 1$.`, kind: 'edge-case' },
    { content: `"How many real solutions?" or "for what value of $k$ does the equation have exactly one solution?" = discriminant question. Don't solve; just compute $b^2-4ac$ and set it $>0$, $=0$, or $<0$. Exactly one solution means $b^2-4ac=0$.`, kind: 'vocab-note' },
    { content: `Difference of squares needs BOTH terms to be perfect squares AND a minus sign. $x^2+49$ does not factor over the reals; $4x^2-9=(2x-3)(2x+3)$ does — take the square root of the coefficient too, not just the variable.`, kind: 'gotcha' },
    { content: `In the quadratic formula, $-b$ means the opposite of $b$ including its sign: if $b=-6$, then $-b=+6$. Also divide the ENTIRE numerator by $2a$, not just the radical part.`, kind: 'common-error' },
    { content: `If a quadratic has no constant term ($x^2-7x=0$), factor out the $x$: $x(x-7)=0 \\Rightarrow x=0$ or $x=7$. Never divide both sides by $x$ — that silently deletes the solution $x=0$.`, kind: 'edge-case' },
    { content: `Before grinding through algebra on a multiple-choice quadratic, plug the answer choices back into the original equation. One substitution usually eliminates three options faster than factoring does.`, kind: 'tip' },
  ],
};
