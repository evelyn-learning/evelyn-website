/**
 * Grade 6 Math — Unit 7 CED 7.4: Equivalent Expressions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.equivalent-expressions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U7_EQUIVALENT_EXPRESSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.equivalent-expressions.v1',
  course: 'Grade 6 Math',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Equivalent Expressions',
  planId: 'evelyn.ms.m6math.equivalent-expressions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.equivalent-expressions.v1' }],
  theory: [
    { loId: 'm6math.equivalent-expressions', kind: 'framework', title: 'Equivalent expressions give the same value for every number', content: `EQUIVALENT EXPRESSIONS GIVE THE SAME VALUE FOR EVERY NUMBER — two expressions are equivalent when substituting the same whole number for the variable into each one always produces the same result. 3(x + 2) and 3x + 6 are equivalent because they agree at x = 1, at x = 5, and at every other whole number you try.` },
    { loId: 'm6math.equivalent-expressions', content: `THE DISTRIBUTIVE PROPERTY REACHES VARIABLES THE SAME WAY IT REACHED WHOLE NUMBERS — a(b + c) = ab + ac works exactly like the whole-number distributing from the last lesson, except now one of the terms inside the parentheses can hold a variable. Multiply the outside number by EVERY term inside, then add the two products: 4(x + 3) = 4 × x + 4 × 3 = 4x + 12.` },
    { loId: 'm6math.equivalent-expressions', kind: 'framework', title: 'The same move also runs backward', content: `THE SAME MOVE ALSO RUNS BACKWARD — row 4.4 pulled a common factor out of a sum of two whole numbers, such as 24 + 36 = 12 × (2 + 3). That exact move works on a sum with a variable term too: find the greatest common factor of the terms in 4x + 12, which is 4, then divide each term by it to see what belongs inside the parentheses, 4x + 12 = 4(x + 3). Forward multiplies out; backward divides out; both directions land on equivalent expressions.` },
    { loId: 'm6math.equivalent-expressions', kind: 'framework', title: 'A variable term and a constant are never like terms', content: `A VARIABLE TERM AND A CONSTANT ARE NEVER LIKE TERMS — like terms are terms that carry the exact same variable, such as 5x and 2x. A term with a variable, like 5x, and a plain number, like 5, are not like terms, even though they share the digit 5, and they can never be combined into one term.` },
    { loId: 'm6math.equivalent-expressions', kind: 'framework', title: 'Combine like terms, then distribute-first for longer expressions', content: `COMBINE LIKE TERMS, THEN DISTRIBUTE-FIRST FOR LONGER EXPRESSIONS — when two terms share the same variable, add their coefficients and keep the variable: 2x + 5x = 7x. Plain numbers combine the same way with other plain numbers: 6 + 9 = 15. When a product is hiding inside a longer expression, such as 2(x + 3) + 4x, distribute that product first, then combine whatever like terms result: 2x + 6 + 4x = 6x + 6.` },
    { loId: 'm6math.equivalent-expressions', kind: 'framework', title: 'Check equivalence by testing a whole number', content: `CHECK EQUIVALENCE BY TESTING A WHOLE NUMBER — to test whether two expressions, expanded or factored, are truly equivalent, pick a whole number, substitute it into each one, and compare the results. Testing one number is a check, not a full proof, but it catches almost every distributing, factoring, or combining mistake a sixth grader makes.` },
    { loId: 'm6math.equivalent-expressions', kind: 'definition', title: 'equivalent expressions', content: `two expressions that produce the same value for every whole number substituted in for the variable.` },
    { loId: 'm6math.equivalent-expressions', kind: 'definition', title: 'distributive property', content: `a rule that multiplies a number outside parentheses by every term inside, turning a(b + c) into ab + ac — and, run backward, turns ab + ac back into a(b + c).` },
    { loId: 'm6math.equivalent-expressions', kind: 'definition', title: 'greatest common factor (GCF)', content: `the biggest whole number that divides every term of an expression evenly; dividing each term by it is how a sum is factored back into a product.` },
    { loId: 'm6math.equivalent-expressions', kind: 'definition', title: 'like terms', content: `terms that carry the exact same variable; only like terms can be combined by adding their coefficients.` },
    { loId: 'm6math.equivalent-expressions', kind: 'definition', title: 'coefficient', content: 'the whole number multiplied by a variable in a term, such as the 5 in 5x.' },
  ],
  methods: [
    {
      title: 'Worked gym rows distribute and factor back',
      steps: [
        `One full row-plus-extra is (r + 3) chairs, and there are 4 identical rows, so the total is 4(r + 3).`,
        `Apply the distributive property: multiply the 4 by EACH term inside the parentheses. 4 × r = 4r, and 4 × 3 = 12.`,
        `So 4(r + 3) = 4r + 12. These two expressions describe the exact same pile of chairs, just written two different ways — they are equivalent expressions.`,
        `Now run the same move backward, the way row 4.4 pulled a common factor out of a sum of two whole numbers. Start from 4r + 12. The greatest common factor of 4r and 12 is 4, because 4 is the biggest whole number that divides both terms evenly.`,
        `Divide each term by that common factor: 4r ÷ 4 = r, and 12 ÷ 4 = 3. Write the factored form: 4r + 12 = 4(r + 3). That is exactly the expression this problem started with, so the forward move and the backward move undo each other.`,
        `Check by substituting a number for r. Let r = 5. Original: 4(5 + 3) = 4(8) = 32. Expanded: 4(5) + 12 = 20 + 12 = 32. Every form of the expression gives 32, so they all check out as equivalent.`,
      ],
      example: { problem: `The gym is set up with 4 rows of chairs for an assembly. Every row holds the same number of chairs, r, plus 3 extra chairs pulled from the closet and set at the end of that row. Write the total number of chairs as a distributed expression, and then show that the same move works in reverse.`, solution: '4r + 12, which factors back to 4(r + 3)' },
      relatedLoIds: ['m6math.equivalent-expressions'],
    },
    {
      title: 'Worked pencil boxes distribute then combine',
      steps: [
        `The first order is 3 boxes of (p + 4) pencils each, which is the expression 3(p + 4). The second order is 2 more boxes of p pencils each, which is 2p. The total is 3(p + 4) + 2p.`,
        `Distribute the 3 across BOTH terms inside the parentheses: 3 × p + 3 × 4 = 3p + 12.`,
        `WRONG: multiplying the 3 by only the p and leaving the 4 alone, giving 3p + 4. CORRECT: the 3 must multiply every term inside the parentheses, so the constant 4 becomes 12, not 4.`,
        'The total so far is 3p + 12 + 2p.',
        `Combine like terms. 3p and 2p share the same variable, so add their coefficients: 3p + 2p = 5p. The 12 has no other constant to combine with, so it stays exactly as it is: 5p + 12.`,
        `Check by substituting p = 6. Original: 3(6 + 4) + 2(6) = 3(10) + 12 = 30 + 12 = 42. Simplified: 5(6) + 12 = 30 + 12 = 42. Both give 42, so the two expressions are equivalent.`,
      ],
      example: { problem: `A teacher orders 3 boxes of pencils. Each box holds p pencils plus 4 loose pencils tucked inside on top. The teacher also orders 2 more boxes that hold exactly p pencils each, with no extras. Write the total number of pencils as one combined, simplified expression.`, solution: '5p + 12' },
      relatedLoIds: ['m6math.equivalent-expressions'],
    },
  ],
  pointers: [
    { content: `Students often say "6n + 3" — The 4 must multiply EVERY term inside the parentheses: 4(n + 3) = 4n + 12, not 4n + 3. Adding the 2n gives 4n + 12 + 2n, and combining the like terms 4n and 2n gives 6n + 12, not 6n + 3. Check by substituting n = 1: the original is 4(1 + 3) + 2(1) = 4(4) + 2 = 16 + 2 = 18, and 6(1) + 12 = 6 + 12 = 18, which matches. 6(1) + 3 = 9 does not.`, kind: 'common-error' },
    { content: `Students often say "6n" — Distributing gives 4n + 12, and adding 2n gives 4n + 12 + 2n. The like terms 4n and 2n combine into 6n, but the 12 still has to be written down; it stays as a separate addend even with nothing to combine into. The correct simplified expression is 6n + 12, not 6n. Check by substituting n = 1: the original is 4(1 + 3) + 2(1) = 18, and 6(1) + 12 = 18, which matches, while 6(1) = 6 does not.`, kind: 'common-error' },
    { content: `Equivalent expressions give the same value for every whole number substituted for the variable.`, kind: 'tip' },
    { content: `The distributive property reaches variables the same way it reached whole numbers: a(b + c) = ab + ac, multiplying the outside number by every term inside.`, kind: 'tip' },
    { content: `The distributive property also runs backward: divide every term of a sum by their greatest common factor to write it as that factor times a smaller sum — the same pull-out move from row 4.4, now applied to a sum with a variable term.`, kind: 'tip' },
    { content: `A variable term and a constant are never like terms, even when they share a digit; only terms with the exact same variable can be combined.`, kind: 'tip' },
    { content: `Combine like terms by adding their coefficients and keeping the variable; when a product is hiding inside a longer expression, distribute first, then combine.`, kind: 'tip' },
    { content: `Check that two expressions — expanded or factored — are equivalent by substituting a whole number into each one and comparing the results.`, kind: 'tip' },
  ],
};
