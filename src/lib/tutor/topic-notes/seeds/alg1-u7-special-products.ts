/**
 * Algebra 1 — Unit 7 CED 7.2: Special Products.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.special-products.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U7_SPECIAL_PRODUCTS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.special-products.v1',
  course: 'Algebra 1',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Special Products',
  planId: 'evelyn.hs.alg1.special-products.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.special-products.v1' }],
  theory: [
    { loId: 'alg1.special-products', kind: 'framework', title: 'Square of a sum', content: `SQUARE OF A SUM — (a + b)² = a² + 2ab + b². Squaring means (a + b)(a + b), so FOIL gives a² + ab + ba + b², and the two identical middle terms add to 2ab.` },
    { loId: 'alg1.special-products', kind: 'framework', title: 'Square of a difference', content: `SQUARE OF A DIFFERENCE — (a − b)² = a² − 2ab + b². Same pattern, middle term negative, LAST term still POSITIVE because (−b)(−b) = +b².` },
    { loId: 'alg1.special-products', kind: 'framework', title: 'Difference of squares', content: `DIFFERENCE OF SQUARES — (a + b)(a − b) = a² − b². Here the middle terms are +ab and −ab, so they cancel and no middle term survives.` },
    { loId: 'alg1.special-products', kind: 'framework', title: 'The central error', content: `THE CENTRAL ERROR — (a + b)² is NOT a² + b². Exponents do not distribute over addition. Test it with numbers: (3 + 4)² = 49, but 3² + 4² = 25. The missing 2ab = 24 is the whole gap.` },
    { loId: 'alg1.special-products', kind: 'framework', title: 'Square the whole term', content: `SQUARE THE WHOLE TERM — in (5x)² both parts get squared: 25x², not 5x². The coefficient is inside the square too.` },
    { loId: 'alg1.special-products', kind: 'framework', title: 'Read the shape first', content: `READ THE SHAPE FIRST — same two terms with the SAME sign twice → square pattern (middle term present). Same two terms with OPPOSITE signs → difference of squares (no middle term).` },
    { loId: 'alg1.special-products', kind: 'framework', title: 'Mental math', content: `MENTAL MATH — any product of two numbers equally far from a round number is a difference of squares: 21·19 = 20² − 1² = 399, and 53·47 = 50² − 3² = 2491.` },
    { loId: 'alg1.special-products', kind: 'framework', title: 'The patterns are optional, not magic', content: `THE PATTERNS ARE OPTIONAL, NOT MAGIC — you can always FOIL instead and get the same answer. Use FOIL as your check whenever the pattern feels shaky.` },
    { loId: 'alg1.special-products', kind: 'definition', title: 'special product', content: 'a multiplication pattern common enough to memorize rather than re-derive.' },
    { loId: 'alg1.special-products', kind: 'definition', title: 'difference of squares', content: 'a² − b², the product of a sum and the matching difference.' },
  ],
  methods: [
    {
      title: 'Worked square sum',
      steps: [
        'Match the pattern (a + b)² = a² + 2ab + b², with a = 3x and b = 5.',
        'Square the first term: a² = (3x)² = 9x². Square the coefficient too — not 3x².',
        'Double the product of the terms: 2ab = 2 · 3x · 5 = 30x.',
        'Square the last term: b² = 5² = 25.',
        `Assemble: 9x² + 30x + 25. Check by FOIL: (3x + 5)(3x + 5) = 9x² + 15x + 15x + 25 = 9x² + 30x + 25. ✓`,
      ],
      example: { problem: 'Expand: (3x + 5)²', solution: '9x² + 30x + 25' },
      relatedLoIds: ['alg1.special-products'],
    },
    {
      title: 'Worked square difference trap',
      steps: [
        `The tempting answer squares each term separately: 16x² + 49. Test it at x = 1: the original is (4 − 7)² = (−3)² = 9, but 16 + 49 = 65. Not equal, so that answer is wrong.`,
        'Use the real pattern (a − b)² = a² − 2ab + b², with a = 4x and b = 7.',
        `a² = (4x)² = 16x². The middle term is −2ab = −2 · 4x · 7 = −56x. b² = (−7)(−7) = +49 — the last term stays positive.`,
        `Assemble: 16x² − 56x + 49. Test at x = 1: 16 − 56 + 49 = 9, matching the original. ✓`,
        `The whole difference between the wrong answer and the right one is that −56x middle term.`,
      ],
      example: { problem: 'Expand: (4x − 7)² — and test the tempting answer 16x² + 49 first.', solution: '16x² − 56x + 49' },
      relatedLoIds: ['alg1.special-products'],
    },
  ],
  pointers: [
    { content: `Wrong — the 12x is missing. (x + 6)² means (x + 6)(x + 6) = x² + 6x + 6x + 36 = x² + 12x + 36. Test at x = 1: the original is 7² = 49, and x² + 12x + 36 gives 1 + 12 + 36 = 49, while x² + 36 gives only 37.`, kind: 'common-error' },
    { content: `a² − b² comes from (a + b)(a − b), where the middle terms cancel. Here both factors are (x + 6), so nothing cancels and the middle term survives: x² + 12x + 36.`, kind: 'common-error' },
    { content: `(a + b)² = a² + 2ab + b² and (a − b)² = a² − 2ab + b² — the last term is positive either way.`, kind: 'tip' },
    { content: '(a + b)(a − b) = a² − b² — opposite signs make the middle terms cancel.', kind: 'tip' },
    { content: 'Never write (a + b)² = a² + b². The 2ab middle term is the whole point.', kind: 'tip' },
    { content: 'Square the entire term, coefficient included: (5x)² = 25x².', kind: 'tip' },
    { content: 'Numbers work too: 21·19 = 20² − 1² = 399.', kind: 'tip' },
    { content: `Never write $(a+b)^2 = a^2 + b^2$. Exponents distribute over *products* like $(xy)^2=x^2y^2$, never over sums. Quick check: plug in $x=1$ — if your expansion doesn't match the original, the $2ab$ term is missing.`, kind: 'common-error' },
    { content: `In $(a-b)^2$ only the MIDDLE term is negative — the last term stays positive because $(-b)(-b)=+b^2$. So $(4x-7)^2 = 16x^2 - 56x + 49$, never $\\ldots - 49$.`, kind: 'gotcha' },
    { content: `Square the WHOLE first term, coefficient included: $(3x)^2 = 9x^2$, not $3x^2$. Same for the middle term — $2ab$ multiplies the coefficients too: $2\\cdot 3x\\cdot 5 = 30x$.`, kind: 'common-error' },
    { content: `Read the signs before you pick a pattern: same sign in both factors → square pattern, middle term SURVIVES. Opposite signs → difference of squares, middle terms CANCEL. $(x+6)^2 \\neq x^2 - 36$.`, kind: 'gotcha' },
    { content: `"Difference of squares" means the *answer* is a difference of two squares, $a^2 - b^2$ — the factors are a sum times a difference. Don't call $(a-b)^2$ a difference of squares; that's the square of a difference.`, kind: 'vocab-note' },
    { content: `$a$ and $b$ in the patterns stand for whole terms, not just the letters. In $(5x-4)(5x+4)$, $a=5x$ and $b=4$, so the answer is $25x^2-16$ — not $5x^2-16$ or $25x^2-4$.`, kind: 'tip' },
    { content: `For mental math, the two numbers must be *equally far* from the same round number. $43\\times 37$ works ($40^2-3^2=1591$), but $43\\times 36$ does not — check the gaps match before using the shortcut.`, kind: 'edge-case' },
    { content: `The patterns are shortcuts, not rules you must use. If you're unsure, FOIL it out — $(a+b)(a+b)$ always gives the same answer and doubles as your check on the $2ab$ term.`, kind: 'tip' },
  ],
};
