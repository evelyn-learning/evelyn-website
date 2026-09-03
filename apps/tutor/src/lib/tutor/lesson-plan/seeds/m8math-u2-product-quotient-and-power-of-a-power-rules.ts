/**
 * Grade 8 Math — Integer Exponents & Scientific Notation: Product, Quotient &
 * Power-of-a-Power Rules.
 *
 * PROCEDURE-LED. The student already reads 2³ as 2 × 2 × 2 and can evaluate
 * it; what is new is that three rules for combining powers of the SAME base
 * fall straight out of that expanded form (CCSS 8.EE.A.1): multiply powers by
 * adding the exponents, divide powers by subtracting them, raise a power to a
 * power by multiplying them. The concept segment is an ordered recipe: expand,
 * count the factors, write the count as the new exponent, and check the
 * result by working out both sides as plain numbers. Both worked examples run
 * one rule at a time and end with a value check. Three traps this plan is
 * built to kill: multiplying the bases (3² × 3⁵ = 9⁷), multiplying the
 * exponents when the rule says add ((3²)⁴ looks like 3² × 3⁴ but is not), and
 * reaching for a rule when the bases are different (2³ × 5² has no shortcut;
 * it is just 8 × 25).
 *
 * SCOPE GUARD: Grade 8 row 2.1 derives aᵐ·aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ and
 * (aᵐ)ⁿ = aᵐⁿ from expanded form with numerical bases and at most a single
 * variable base, and writes equivalent expressions with positive exponents
 * only. Assumes `m6math` row 7.1 (numerical expressions with exponents).
 * Withholds: zero and negative exponents (row 2.2); power of a
 * product/quotient (ab)ⁿ, (a/b)ⁿ and multi-variable monomials such as (2x³y)²
 * → Algebra 1 `alg1-u6-exponent-rules.ts` (which cites 8.EE.A.1 as HS
 * review). Concretely: every exponent in the lesson body beneath this comment
 * is a positive whole number (the m and n in the LO description stand for
 * such numbers), and every quotient keeps the larger exponent in the
 * numerator, so no subtraction of exponents ever reaches zero or goes
 * negative; the zero and negative exponents named in this paragraph are the
 * boundary, and neither is written, evaluated or explained in the body. Every
 * rule is applied to base 2, 3, 5 or 10 (base 5 appears because the
 * curriculum row's own example is 5⁶ ÷ 5² = 5⁴) or to the single variable x;
 * any other base (4⁸, 9⁷) appears only inside a wrong answer being refuted or
 * inside a value check such as 9⁴ = 6561. No expression ever carries two
 * variables, and no expression is ever rewritten as (ab)ⁿ or (a/b)ⁿ. Wherever
 * two different bases sit side by side it is always 2³ × 5², placed there to
 * say that NO rule applies, and it is always resolved by computing 8 × 25 =
 * 200, never by combining the bases. Sideways: the plan
 * never writes a number in a × 10ⁿ form (rows 2.3-2.4). Below: evaluating
 * 2³ = 8 or 3⁴ = 81 is Grade 6 ground, recalled in a clause and used in every
 * check, never re-taught. Salvaged from `g8-math-exponents-scientific-notation.ts`:
 * the three-rule list and the 2³ × 2² = 2⁵ = 32 check pattern only; its zero
 * and negative exponent bullets belong to row 2.2, its scientific notation to
 * rows 2.3-2.4, and neither was carried.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U2_PRODUCT_QUOTIENT_AND_POWER_OF_A_POWER_RULES: LessonPlan = {
  id: 'evelyn.ms.m8math.product-quotient-and-power-of-a-power-rules.v1',
  title: 'Product, Quotient & Power-of-a-Power Rules',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.product-quotient-and-power-of-a-power-rules',
      standard: 'M8MATH-2.1',
      description:
        'Derive aᵐ·aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ and (aᵐ)ⁿ = aᵐⁿ from expanded form with numerical bases (2, 3, 10) and at most a single variable base; write equivalent expressions (3² × 3⁵ = 3⁷; 5⁶ ÷ 5² = 5⁴; (2³)² = 2⁶); positive exponents only (CCSS 8.EE.A.1).',
    },
  ],
  prerequisites: ['m8math.estimating-and-locating-irrational-numbers'],
  followUps: ['m8math.zero-and-negative-exponents'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a product of two powers of the same base in a real count, so the student sees that adding the exponents is just counting the factors.',
      script:
        'Your friend posts a skate clip and sends it to 2 people. Each of those 2 sends it to 2 more, and so on, so every round of forwarding doubles the number of people who have it. After 3 rounds that is 2 × 2 × 2, which you already know how to write: 2³, or 8 people. Now the clip keeps going for 5 more rounds, which is 5 more doublings, 2⁵ of them, so the total is 2³ × 2⁵. You could work that out as 8 × 32 and get 256. But look at what the exponents are counting: 3 doublings, then 5 more doublings, is 8 doublings in a row, and 2⁸ is 256. Same base, add the exponents, and the answer falls out without multiplying anything. Today you learn that shortcut and two others like it, and you learn exactly why each one works, so you never have to guess which exponents to add and which to multiply.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-expand-count-rewrite',
      kind: 'concept',
      goal: 'Derive the product, quotient and power-of-a-power rules from expanded form, one at a time, each with a value check, and fix the base as the thing that never changes.',
      keyIdeas: [
        'THE EXPONENT COUNTS THE FACTORS — 2³ means 2 × 2 × 2, three factors of 2, and you already evaluate it as 8. Writing a power out as its list of factors is called expanded form, and it is the tool that proves every rule in this lesson. When you are unsure which rule applies, expand and count.',
        'PRODUCT RULE: SAME BASE, MULTIPLY, ADD THE EXPONENTS — 3² × 3⁵ expands to (3 × 3) × (3 × 3 × 3 × 3 × 3), which is seven factors of 3 in a row, so 3² × 3⁵ = 3⁷. Two factors plus five factors is seven factors, and that is all "add the exponents" means. Check with values: 9 × 243 = 2187, and 3⁷ = 2187. The same count works in base 10: 10⁴ × 10³ is four zeros followed by three more, 10⁷.',
        'QUOTIENT RULE: SAME BASE, DIVIDE, SUBTRACT THE EXPONENTS — 5⁶ ÷ 5² is six factors of 5 on top and two factors of 5 underneath. Each 5 underneath cancels one 5 on top, so two pairs cancel and four factors of 5 are left: 5⁶ ÷ 5² = 5⁴. Six factors minus two factors is four factors. Check with values: 15625 ÷ 25 = 625, and 5⁴ = 625. In this lesson the bigger exponent is always on top, so the subtraction always leaves a positive count.',
        'POWER OF A POWER: MULTIPLY THE EXPONENTS — (2³)² means 2³ used as a factor twice: 2³ × 2³. That is (2 × 2 × 2) × (2 × 2 × 2), two groups of three factors, six factors of 2 in all, so (2³)² = 2⁶. Two groups of three is 2 × 3 = 6, which is why this rule multiplies. Check with values: 2³ = 8, 8² = 64, and 2⁶ = 64.',
        'THE BASE NEVER CHANGES, AND THE BASES MUST MATCH — in every rule the base stays exactly what it was: 3² × 3⁵ is 3⁷, not 9⁷, because expanded form is a row of 3s and nothing in it is a 9. And the rules only work when both powers have the SAME base, because only then are all the factors alike. 2³ × 5² is 8 × 25, which is 200, and there is no shortcut for it; the 2s and the 5s cannot be counted together.',
        'A VARIABLE BASE WORKS THE SAME WAY — x stands for one number, so x⁴ × x³ is four factors of x followed by three more, seven factors, x⁷. Check by choosing a value: if x = 2, then 16 × 8 = 128, and 2⁷ = 128. Expand and count works whether the base is 2, 10, or x.',
      ],
      vocabulary: [
        { term: 'base', definition: 'the number being multiplied by itself, the 3 in 3⁵.' },
        { term: 'exponent', definition: 'the count of how many times the base is used as a factor, the 5 in 3⁵.' },
        { term: 'power', definition: 'a base with an exponent, such as 3⁵ or x⁴, read "3 to the fifth" or "x to the fourth".' },
        { term: 'expanded form', definition: 'a power written out as its list of factors: 3⁵ = 3 × 3 × 3 × 3 × 3.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-product-then-quotient',
      kind: 'worked_example',
      problem: 'Write (2⁴ × 2³) ÷ 2⁵ as a single power of 2, then check the answer with values.',
      steps: [
        'Every power here has base 2, so the rules apply. Work the parentheses first. Inside them, 2⁴ × 2³ is a product of powers with the same base: four factors of 2 followed by three more, seven factors, so 2⁴ × 2³ = 2⁷.',
        'Now the expression is 2⁷ ÷ 2⁵, a quotient of powers with the same base. Seven factors of 2 on top, five underneath, five pairs cancel, two factors are left: 2⁷ ÷ 2⁵ = 2². Subtract the exponents, 7 - 5 = 2.',
        'The single power is 2², which equals 4.',
        'Check with values from the original expression: 2⁴ = 16, 2³ = 8, and 16 × 8 = 128. Then 2⁵ = 32, and 128 ÷ 32 = 4. The value check gives 4, and 2² is 4, so the rules did exactly what the arithmetic did.',
        'Notice that you never needed the value 128 to get the answer. The exponents did the counting: 4 + 3 = 7 factors, then 7 - 5 = 2 factors. The value check is there to catch a slip, not to find the answer.',
      ],
      answer: '2² (which is 4)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-power-of-a-power',
      kind: 'worked_example',
      problem: 'Write (3²)⁴ as a single power of 3. Then compare it with 3² × 3⁴, which looks almost the same.',
      steps: [
        'Read the outer exponent for what it counts: (3²)⁴ means 3² used as a factor four times, 3² × 3² × 3² × 3².',
        'Expand each 3²: (3 × 3) × (3 × 3) × (3 × 3) × (3 × 3). That is four groups of two factors, eight factors of 3 in all, so (3²)⁴ = 3⁸. Four groups of two is 2 × 4 = 8, which is why a power of a power multiplies the exponents.',
        'WRONG: (3²)⁴ = 3⁶, from adding 2 + 4 because the two exponents are sitting next to each other. CORRECT: (3²)⁴ = 3⁸. Adding is the product rule, and a product rule needs two powers being multiplied, not one power inside parentheses with an exponent outside.',
        'Check with values: 3² = 9, and 9⁴ = 9 × 9 × 9 × 9 = 81 × 81 = 6561. Then 3⁸ = 3⁴ × 3⁴ = 81 × 81 = 6561. Both roads give 6561, so 3⁸ is right. The wrong answer 3⁶ is 729, nowhere near it.',
        'Now the look-alike, 3² × 3⁴. This time there are two separate powers being multiplied, two factors of 3 followed by four more, six factors, so 3² × 3⁴ = 3⁶. Check with values: 9 × 81 = 729, and 3⁶ = 729.',
        'Same digits, different structure, different rule. An exponent outside parentheses multiplies the exponents; a multiplication sign between two powers adds them. When in doubt, expand and count the factors.',
      ],
      answer: '(3²)⁴ = 3⁸ (which is 6561), while 3² × 3⁴ = 3⁶ (which is 729)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-product-same-base',
      kind: 'try_yourself',
      problem: 'Which expression is equivalent to 2⁵ × 2³?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4⁸' },
        { id: 'b', text: '2¹⁵' },
        { id: 'c', text: '4¹⁵' },
        { id: 'd', text: '2⁸', correct: true },
      ],
      expectedAnswer: '2⁸',
      hints: [
        'Both powers have the same base, 2, and they are being multiplied. Expand them: five factors of 2 followed by three factors of 2. How many factors of 2 is that in a row?',
        'The base stays 2, because expanded form is a row of 2s and nothing in it is a 4. Counting the factors adds the exponents, 5 + 3. Check with values: 32 × 8 = 256, and see which choice equals 256.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-quotient-variable-base',
      kind: 'try_yourself',
      problem: 'Which expression is equivalent to x⁹ ÷ x³?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x³' },
        { id: 'b', text: 'x⁶', correct: true },
        { id: 'c', text: 'x¹²' },
        { id: 'd', text: 'x²⁷' },
      ],
      expectedAnswer: 'x⁶',
      hints: [
        'Nine factors of x on top, three factors of x underneath. Each x underneath cancels one x on top. How many factors of x are left?',
        'Dividing powers with the same base subtracts the exponents, 9 - 3. It does not divide them, add them, or multiply them. Check by choosing x = 2: 512 ÷ 8 = 64, and 64 is 2 to which power?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-two-rules',
      kind: 'try_yourself',
      problem:
        'Write (2⁴)³ ÷ 2⁵ as a single power of 2. What is the exponent on the 2? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'Work the parentheses first. (2⁴)³ is 2⁴ used as a factor three times, so multiply the exponents to write it as one power of 2.',
        'That gives 2¹² ÷ 2⁵, a quotient with the same base, so subtract the exponents. Check with values: 2¹² = 4096, 2⁵ = 32, and 4096 ÷ 32 = 128, which is 2 to your answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-multiply-bases-and-mixed-bases',
      kind: 'misconception_check',
      question:
        'Dev simplifies 3² × 3⁵ and writes 9⁷. Lena simplifies 2³ × 5² and writes 10⁵. Expand each product into its factors and check each claim with values. What went wrong in each case?',
      commonErrors: [
        {
          answer: '3² × 3⁵ = 9⁷',
          misconception: 'Adding the exponents correctly but also multiplying the bases, as if the rule changed both parts of the power.',
          correctsTo:
            'The exponents were added correctly, 2 + 5 = 7, but the base never changes. Expanded form is (3 × 3) × (3 × 3 × 3 × 3 × 3), a row of seven 3s, and nothing in that row is a 9. So 3² × 3⁵ = 3⁷, which is 2187. The value check exposes 9⁷: it equals 4,782,969, while 9 × 243 is 2187. Only the count of factors changes; the base is what is being counted.',
        },
        {
          answer: '2³ × 5² = 10⁵',
          misconception: 'Applying the product rule to two powers with DIFFERENT bases, multiplying the 2 and the 5 and adding the exponents.',
          correctsTo:
            'The product rule needs the same base on both powers, because the rule is just counting factors that are all alike. Here the factors are 2 × 2 × 2 × 5 × 5, three 2s and two 5s, and there is no way to count them as one kind. So there is no shortcut: 2³ = 8, 5² = 25, and 8 × 25 = 200. The claim 10⁵ is 100,000, which is nowhere near 200. When the bases differ, evaluate each power and multiply the values.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The exponent counts the factors. Expanded form, a power written as its row of factors, proves every rule and settles every doubt.',
        'Same base, multiply: ADD the exponents. 3² × 3⁵ = 3⁷.',
        'Same base, divide: SUBTRACT the exponents. 5⁶ ÷ 5² = 5⁴.',
        'Power of a power: MULTIPLY the exponents. (2³)² = 2⁶.',
        'The base never changes, and the rules only apply when the bases match. 3² × 3⁵ is 3⁷, never 9⁷; 2³ × 5² has no rule, it is just 8 × 25 = 200.',
        'Check with values: work out the original expression and the single power as plain numbers, and they must match. A variable base such as x works the same way, and choosing a value for x lets you check it too.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Product, Quotient & Power-of-a-Power Rules' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
