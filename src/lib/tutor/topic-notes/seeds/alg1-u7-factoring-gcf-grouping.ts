/**
 * Algebra 1 — Unit 7 CED 7.3: Factoring: GCF & Grouping.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.factoring-gcf-grouping.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U7_FACTORING_GCF_GROUPING: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.factoring-gcf-grouping.v1',
  course: 'Algebra 1',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Factoring: GCF & Grouping',
  planId: 'evelyn.hs.alg1.factoring-gcf-grouping.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.factoring-gcf-grouping.v1' }],
  theory: [
    { loId: 'alg1.factoring-gcf-grouping', kind: 'framework', title: 'Factoring is un-distributing', content: `FACTORING IS UN-DISTRIBUTING — you are writing a sum as a PRODUCT. Distributing goes 3x(2x + 5) → 6x² + 15x; factoring goes 6x² + 15x → 3x(2x + 5). Same equation, read right to left.` },
    { loId: 'alg1.factoring-gcf-grouping', kind: 'framework', title: 'Find the GCF in two parts', content: `FIND THE GCF IN TWO PARTS — the coefficient part is the largest integer that divides EVERY coefficient; the variable part is the LOWEST power of each variable that appears in EVERY term. For 12x³ + 18x² − 30x: coefficients 12, 18, 30 share 6, and the lowest power of x is x¹, so the GCF is 6x.` },
    { loId: 'alg1.factoring-gcf-grouping', kind: 'framework', title: 'Divide every term by the GCF', content: `DIVIDE EVERY TERM BY THE GCF — including the term that IS the GCF. 9x² − 12x + 3 has GCF 3, and 3 ÷ 3 = 1, so the answer is 3(3x² − 4x + 1). The 1 must be written; dropping it changes the expression.` },
    { loId: 'alg1.factoring-gcf-grouping', kind: 'framework', title: 'Negative GCF', content: `NEGATIVE GCF — when the leading term is negative, pull the minus out with it and EVERY sign inside flips: −6x² + 15x = −3x(2x − 5). This is optional for most problems but required whenever you want a positive leading coefficient inside.` },
    { loId: 'alg1.factoring-gcf-grouping', content: `FOUR TERMS → GROUPING — split into two pairs, factor the GCF out of each pair, and the two leftover parentheses must MATCH exactly. Then the matching binomial itself is a common factor: x³ + 5x² − 3x − 15 = x²(x + 5) − 3(x + 5) = (x + 5)(x² − 3).` },
    { loId: 'alg1.factoring-gcf-grouping', kind: 'framework', title: 'The match is a sign choice', content: `THE MATCH IS A SIGN CHOICE — if the third term is negative, factor a NEGATIVE out of the second pair so the parentheses line up: 3x³ − 12x² − 2x + 8 = 3x²(x − 4) − 2(x − 4) = (x − 4)(3x² − 2). Factoring out +2 instead would leave (−x + 4) and nothing would match.` },
    { loId: 'alg1.factoring-gcf-grouping', kind: 'framework', title: 'Always check by re-multiplying', content: `ALWAYS CHECK BY RE-MULTIPLYING — distribute your answer back out. If you do not land on the original expression term for term, the factoring is wrong. This check is free and catches every sign slip.` },
    { loId: 'alg1.factoring-gcf-grouping', kind: 'framework', title: 'GCF first, always', content: `GCF FIRST, ALWAYS — take the GCF out before you try anything else. Every later method (trinomials, difference of squares, solving quadratics) is easier on the smaller expression left behind.` },
    { loId: 'alg1.factoring-gcf-grouping', kind: 'definition', title: 'GCF', content: `greatest common factor — the largest coefficient and lowest variable power shared by every term.` },
    { loId: 'alg1.factoring-gcf-grouping', kind: 'definition', title: 'factoring by grouping', content: `splitting four terms into two pairs, factoring each pair, and pulling out the binomial they share.` },
  ],
  methods: [
    {
      title: 'Worked GCF',
      steps: [
        'Coefficient part of the GCF: the largest integer dividing 12, 18, and 30 is 6.',
        `Variable part: every term has an x, and the lowest power present is x¹. So the GCF is 6x.`,
        'Divide each term by 6x: 12x³ ÷ 6x = 2x², 18x² ÷ 6x = 3x, −30x ÷ 6x = −5.',
        'Write the product: 6x(2x² + 3x − 5).',
        'Check by re-multiplying: 6x·2x² = 12x³, 6x·3x = 18x², 6x·(−5) = −30x. ✓',
      ],
      example: { problem: 'Factor completely: 12x³ + 18x² − 30x', solution: '6x(2x² + 3x − 5)' },
      relatedLoIds: ['alg1.factoring-gcf-grouping'],
    },
    {
      title: 'Worked grouping negative',
      steps: [
        `No GCF for all four terms (3, 12, 2, 8 share only 1, and the last term has no x), so go straight to grouping.`,
        'Split into pairs: (3x³ − 12x²) + (−2x + 8).',
        'First pair: GCF 3x² → 3x²(x − 4).',
        `Second pair: the leading term is −2x, so pull out −2, flipping both signs inside: −2(x − 4). Pulling out +2 would give 2(−x + 4), which does NOT match the first parentheses.`,
        `The parentheses match: 3x²(x − 4) − 2(x − 4). Factor out the shared (x − 4): (x − 4)(3x² − 2).`,
        'Check: (x − 4)(3x² − 2) = 3x³ − 2x − 12x² + 8 = 3x³ − 12x² − 2x + 8. ✓',
      ],
      example: { problem: 'Factor by grouping: 3x³ − 12x² − 2x + 8', solution: '(x − 4)(3x² − 2)' },
      relatedLoIds: ['alg1.factoring-gcf-grouping'],
    },
  ],
  pointers: [
    { content: `Dividing a term by the GCF always leaves something: 3 ÷ 3 = 1. The answer is 3(3x² − 4x + 1). Re-multiplying the student version gives 9x² − 12x, which is missing the +3.`, kind: 'common-error' },
    { content: `Every term gets divided by −4x: −4x² ÷ (−4x) = x and 8x ÷ (−4x) = −2, so the answer is −4x(x − 2). Check: −4x(x − 2) = −4x² + 8x. ✓`, kind: 'common-error' },
    { content: `Factoring is un-distributing — turn a sum into a product, then check by multiplying back.`, kind: 'tip' },
    { content: `GCF = largest shared coefficient × lowest shared variable power; take it out FIRST, every time.`, kind: 'tip' },
    { content: 'A term equal to the GCF leaves a 1 behind — never drop it.', kind: 'tip' },
    { content: 'Pulling out a negative GCF flips the sign of EVERY term inside.', kind: 'tip' },
    { content: `Four terms: pair, factor each pair, make the parentheses match (choose a negative if needed), then pull out the shared binomial.`, kind: 'tip' },
    { content: `When a term IS the GCF, it leaves a **1**, not nothing. 9x² − 12x + 3 = 3(3x² − 4x + **1**). Re-multiply your answer: if a term vanished, you dropped a 1.`, kind: 'common-error' },
    { content: `Pulling out a negative GCF flips EVERY sign inside, not just the first. −4x² + 8x = −4x(x − 2), never −4x(x + 2). Divide each term by the full GCF including the minus sign.`, kind: 'common-error' },
    { content: `GCF variable part uses the LOWEST exponent that appears in every term — not the highest, and not the one in the first term. For 6x⁴ + 15x³ − 9x², the GCF is 3x², not 3x⁴.`, kind: 'gotcha' },
    { content: `If a variable is missing from even ONE term, it can't be in the GCF. In 3x³ − 12x² − 2x + 8 the constant 8 has no x, so no x comes out — go straight to grouping.`, kind: 'edge-case' },
    { content: `In grouping, the two parentheses must match EXACTLY, sign for sign. (x − 4) and (−x + 4) do not match — go back and factor a negative out of the second pair instead.`, kind: 'gotcha' },
    { content: `Keep the subtraction sign with the term when you pair up: 3x³ − 12x² − 2x + 8 pairs as (3x³ − 12x²) + (−2x + 8). Writing (−2x − 8) by 'distributing' the minus is a sign trap.`, kind: 'common-error' },
    { content: `"Factor" means write as a PRODUCT. x²(x + 5) − 3(x + 5) is not a finished answer — it's still a difference. One more step gives (x + 5)(x² − 3).`, kind: 'vocab-note' },
    { content: `"Factor completely" means pull the GCF out FIRST, before grouping or any other method. 2x³ + 10x² − 6x − 30 → 2(x³ + 5x² − 3x − 15) → 2(x + 5)(x² − 3).`, kind: 'tip' },
  ],
};
