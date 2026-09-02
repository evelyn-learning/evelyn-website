/**
 * Grade 6 Math — Expressions & Exponents: Equivalent Expressions.
 *
 * PROCEDURE-LED fan-out row for m6math. Row 7.3 named the parts of an
 * expression; this lesson uses those parts to rewrite an expression into an
 * equivalent form three ways — distributing a whole number across a sum
 * that contains a variable, running that exact same move BACKWARD to pull a
 * numeric greatest common factor back out of a sum that contains a
 * variable, and combining like terms — then proves each rewrite is correct
 * by substituting a whole number into both forms (CCSS 6.EE.A.3/A.4, whose
 * own illustrative examples include the backward pull-out: 24x + 18y =
 * 6(4x + 3y)). Two traps this plan is built to kill: distributing the
 * outside number into only ONE of the terms inside the parentheses, and
 * treating a constant term as if it had nothing left to combine with and
 * could simply be dropped.
 *
 * SCOPE GUARD: this lesson generates and identifies equivalent expressions
 * with the algebraic distributive property, run in BOTH directions, and
 * with combining like terms (CCSS 6.EE.A.3/A.4). Forward, a(b + c) = ab +
 * ac. Backward, a sum such as 4x + 12 is rewritten as a product by dividing
 * every term by their greatest common factor — the exact pull-out move row
 * 4.4 already taught on a sum of two whole numbers, now applied to a sum
 * that contains a variable term. Every coefficient and constant in this
 * file, in both directions, is a nonnegative whole number — no negative or
 * rational coefficient ever appears, because that escalation, not factoring
 * itself, is what belongs to Grade 7. This lesson also does not translate a
 * word phrase into an expression or evaluate one for a given value (row
 * 7.2's skill), and it does not teach naming the parts of an expression —
 * term, factor, coefficient (row 7.3's skill); those words are used here
 * only as background tools a student already has, never as new content.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U7_EQUIVALENT_EXPRESSIONS: LessonPlan = {
  id: 'evelyn.ms.m6math.equivalent-expressions.v1',
  title: 'Equivalent Expressions',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.equivalent-expressions',
      standard: 'M6MATH-7.4',
      description:
        'Apply properties of operations (distributive property, combining like terms) to generate and identify equivalent expressions with nonnegative whole-number coefficients (CCSS 6.EE.A.3, 6.EE.A.4).',
    },
  ],
  prerequisites: ['m6math.parts-of-an-expression'],
  followUps: ['m6math.what-it-means-to-solve-an-equation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student see one total described two different, equally true, ways before any rule is named.',
      script:
        'Picture the gym set up for a school assembly. Every row of chairs holds the same number of seats. Call that number r. The setup crew arranges 4 rows, and each row also gets 3 extra chairs pulled from the closet and placed at the end. You could describe the total as 4 times one full row-plus-extra, written 4(r + 3). Or you could describe it as four separate row counts plus all the extra chairs added up, written 4r + 12. Both descriptions count the exact same pile of chairs. Today you learn two tools that turn one of those descriptions into the other: the distributive property, and combining like terms. You will also learn how to prove that two expressions are really describing the same thing.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distribute-and-combine',
      kind: 'concept',
      goal: 'Install the algebraic form of the distributive property, the rule for combining like terms, and the substitution check that proves two expressions are equivalent.',
      keyIdeas: [
        'EQUIVALENT EXPRESSIONS GIVE THE SAME VALUE FOR EVERY NUMBER — two expressions are equivalent when substituting the same whole number for the variable into each one always produces the same result. 3(x + 2) and 3x + 6 are equivalent because they agree at x = 1, at x = 5, and at every other whole number you try.',
        'THE DISTRIBUTIVE PROPERTY REACHES VARIABLES THE SAME WAY IT REACHED WHOLE NUMBERS — a(b + c) = ab + ac works exactly like the whole-number distributing from the last lesson, except now one of the terms inside the parentheses can hold a variable. Multiply the outside number by EVERY term inside, then add the two products: 4(x + 3) = 4 × x + 4 × 3 = 4x + 12.',
        'THE SAME MOVE ALSO RUNS BACKWARD — row 4.4 pulled a common factor out of a sum of two whole numbers, such as 24 + 36 = 12 × (2 + 3). That exact move works on a sum with a variable term too: find the greatest common factor of the terms in 4x + 12, which is 4, then divide each term by it to see what belongs inside the parentheses, 4x + 12 = 4(x + 3). Forward multiplies out; backward divides out; both directions land on equivalent expressions.',
        'A VARIABLE TERM AND A CONSTANT ARE NEVER LIKE TERMS — like terms are terms that carry the exact same variable, such as 5x and 2x. A term with a variable, like 5x, and a plain number, like 5, are not like terms, even though they share the digit 5, and they can never be combined into one term.',
        'COMBINE LIKE TERMS, THEN DISTRIBUTE-FIRST FOR LONGER EXPRESSIONS — when two terms share the same variable, add their coefficients and keep the variable: 2x + 5x = 7x. Plain numbers combine the same way with other plain numbers: 6 + 9 = 15. When a product is hiding inside a longer expression, such as 2(x + 3) + 4x, distribute that product first, then combine whatever like terms result: 2x + 6 + 4x = 6x + 6.',
        'CHECK EQUIVALENCE BY TESTING A WHOLE NUMBER — to test whether two expressions, expanded or factored, are truly equivalent, pick a whole number, substitute it into each one, and compare the results. Testing one number is a check, not a full proof, but it catches almost every distributing, factoring, or combining mistake a sixth grader makes.',
      ],
      vocabulary: [
        { term: 'equivalent expressions', definition: 'two expressions that produce the same value for every whole number substituted in for the variable.' },
        { term: 'distributive property', definition: 'a rule that multiplies a number outside parentheses by every term inside, turning a(b + c) into ab + ac — and, run backward, turns ab + ac back into a(b + c).' },
        { term: 'greatest common factor (GCF)', definition: 'the biggest whole number that divides every term of an expression evenly; dividing each term by it is how a sum is factored back into a product.' },
        { term: 'like terms', definition: 'terms that carry the exact same variable; only like terms can be combined by adding their coefficients.' },
        { term: 'coefficient', definition: 'the whole number multiplied by a variable in a term, such as the 5 in 5x.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-gym-rows-distribute-and-factor-back',
      kind: 'worked_example',
      problem:
        'The gym is set up with 4 rows of chairs for an assembly. Every row holds the same number of chairs, r, plus 3 extra chairs pulled from the closet and set at the end of that row. Write the total number of chairs as a distributed expression, and then show that the same move works in reverse.',
      steps: [
        'One full row-plus-extra is (r + 3) chairs, and there are 4 identical rows, so the total is 4(r + 3).',
        'Apply the distributive property: multiply the 4 by EACH term inside the parentheses. 4 × r = 4r, and 4 × 3 = 12.',
        'So 4(r + 3) = 4r + 12. These two expressions describe the exact same pile of chairs, just written two different ways — they are equivalent expressions.',
        'Now run the same move backward, the way row 4.4 pulled a common factor out of a sum of two whole numbers. Start from 4r + 12. The greatest common factor of 4r and 12 is 4, because 4 is the biggest whole number that divides both terms evenly.',
        'Divide each term by that common factor: 4r ÷ 4 = r, and 12 ÷ 4 = 3. Write the factored form: 4r + 12 = 4(r + 3). That is exactly the expression this problem started with, so the forward move and the backward move undo each other.',
        'Check by substituting a number for r. Let r = 5. Original: 4(5 + 3) = 4(8) = 32. Expanded: 4(5) + 12 = 20 + 12 = 32. Every form of the expression gives 32, so they all check out as equivalent.',
      ],
      answer: '4r + 12, which factors back to 4(r + 3)',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-pencil-boxes-distribute-then-combine',
      kind: 'worked_example',
      problem:
        'A teacher orders 3 boxes of pencils. Each box holds p pencils plus 4 loose pencils tucked inside on top. The teacher also orders 2 more boxes that hold exactly p pencils each, with no extras. Write the total number of pencils as one combined, simplified expression.',
      steps: [
        'The first order is 3 boxes of (p + 4) pencils each, which is the expression 3(p + 4). The second order is 2 more boxes of p pencils each, which is 2p. The total is 3(p + 4) + 2p.',
        'Distribute the 3 across BOTH terms inside the parentheses: 3 × p + 3 × 4 = 3p + 12.',
        'WRONG: multiplying the 3 by only the p and leaving the 4 alone, giving 3p + 4. CORRECT: the 3 must multiply every term inside the parentheses, so the constant 4 becomes 12, not 4.',
        'The total so far is 3p + 12 + 2p.',
        'Combine like terms. 3p and 2p share the same variable, so add their coefficients: 3p + 2p = 5p. The 12 has no other constant to combine with, so it stays exactly as it is: 5p + 12.',
        'Check by substituting p = 6. Original: 3(6 + 4) + 2(6) = 3(10) + 12 = 30 + 12 = 42. Simplified: 5(6) + 12 = 30 + 12 = 42. Both give 42, so the two expressions are equivalent.',
      ],
      answer: '5p + 12',
      estimatedMinutes: 3,
    },
    {
      id: 'try-distribute-five-y-plus-three',
      kind: 'try_yourself',
      problem: 'Which expression is equivalent to 5(y + 3)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5y + 3' },
        { id: 'b', text: 'y + 15' },
        { id: 'c', text: '8y' },
        { id: 'd', text: '5y + 15', correct: true },
      ],
      expectedAnswer: '5y + 15',
      hints: [
        'Distribute the 5 across BOTH terms inside the parentheses: multiply the 5 by y, and multiply the 5 by 3.',
        '5 × y = 5y and 5 × 3 = 15. Add those two products together to get the equivalent expression.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-equivalent-three-x-plus-two-plus-x',
      kind: 'try_yourself',
      problem: 'Which expression is equivalent to 3(x + 2) + x?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4x + 2' },
        { id: 'b', text: '4x + 6', correct: true },
        { id: 'c', text: '3x + 6 + x' },
        { id: 'd', text: '10x' },
      ],
      expectedAnswer: '4x + 6',
      hints: [
        'Distribute the 3 first: 3(x + 2) = 3x + 6. Do not forget to multiply the 3 by both terms inside the parentheses.',
        'Now combine the like terms. 3x and x share the same variable, so add their coefficients: 3x + x = 4x. The 6 has no other constant to combine with, so it stays.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-gcf-of-6x-and-15',
      kind: 'try_yourself',
      problem:
        'Jonah wants to rewrite 6x + 15 as a product, the same backward move from this lesson. The number he needs to pull out is the greatest common factor of 6x and 15. What is that number? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'List the factors of 6 and the factors of 15, then find the greatest number that appears on both lists — the same method row 4.4 used to find a GCF.',
        'The factors of 6 are 1, 2, 3, 6. The factors of 15 are 1, 3, 5, 15. Compare the two lists to find the biggest match.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-partial-distribute-and-dropped-constant',
      kind: 'misconception_check',
      question:
        'One student simplifies 4(n + 3) + 2n and writes 6n + 3. Another student simplifies the same expression and writes 6n, leaving out a term completely. What went wrong in each case?',
      commonErrors: [
        {
          answer: '6n + 3',
          misconception:
            'Distributing the 4 into only the first term inside the parentheses, n, and leaving the second term, 3, unchanged instead of multiplying it too.',
          correctsTo:
            'The 4 must multiply EVERY term inside the parentheses: 4(n + 3) = 4n + 12, not 4n + 3. Adding the 2n gives 4n + 12 + 2n, and combining the like terms 4n and 2n gives 6n + 12, not 6n + 3. Check by substituting n = 1: the original is 4(1 + 3) + 2(1) = 4(4) + 2 = 16 + 2 = 18, and 6(1) + 12 = 6 + 12 = 18, which matches. 6(1) + 3 = 9 does not.',
        },
        {
          answer: '6n',
          misconception:
            'Combining the like terms correctly to get 6n, then dropping the constant term 12 entirely, as if a term with nothing left to combine with simply disappears.',
          correctsTo:
            'Distributing gives 4n + 12, and adding 2n gives 4n + 12 + 2n. The like terms 4n and 2n combine into 6n, but the 12 still has to be written down; it stays as a separate addend even with nothing to combine into. The correct simplified expression is 6n + 12, not 6n. Check by substituting n = 1: the original is 4(1 + 3) + 2(1) = 18, and 6(1) + 12 = 18, which matches, while 6(1) = 6 does not.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Equivalent expressions give the same value for every whole number substituted for the variable.',
        'The distributive property reaches variables the same way it reached whole numbers: a(b + c) = ab + ac, multiplying the outside number by every term inside.',
        'The distributive property also runs backward: divide every term of a sum by their greatest common factor to write it as that factor times a smaller sum — the same pull-out move from row 4.4, now applied to a sum with a variable term.',
        'A variable term and a constant are never like terms, even when they share a digit; only terms with the exact same variable can be combined.',
        'Combine like terms by adding their coefficients and keeping the variable; when a product is hiding inside a longer expression, distribute first, then combine.',
        'Check that two expressions — expanded or factored — are equivalent by substituting a whole number into each one and comparing the results.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Equivalent Expressions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
