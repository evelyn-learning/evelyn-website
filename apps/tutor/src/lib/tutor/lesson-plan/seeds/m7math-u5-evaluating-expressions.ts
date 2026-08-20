/**
 * Grade 7 Math — Expressions: Evaluating Expressions.
 *
 * Substitution, then order of operations (CCSS 6.EE.A.2, 7.EE.A.2). The whole
 * lesson turns on one habit: a substituted number goes inside parentheses. That
 * is what keeps (−4)² = 16 from collapsing into −4² = −16, and it is also what
 * makes 14 − (−6) readable. Two-variable expressions come in at the end, since
 * the next lesson checks its simplifications by substituting.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U5_EVALUATING_EXPRESSIONS: LessonPlan = {
  id: 'evelyn.ms.m7math.evaluating-expressions.v1',
  title: 'Evaluating Expressions',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.evaluating-expressions',
      standard: 'M7MATH-5.2',
      description:
        'Evaluate one- and two-variable algebraic expressions by substituting given rational values in parentheses and then applying the order of operations, including negative values raised to a power (CCSS 6.EE.A.2, 7.EE.A.2).',
    },
  ],
  prerequisites: ['m7math.writing-algebraic-expressions'],
  followUps: ['m7math.combining-like-terms'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show substitution as the moment a general expression turns into a real number you can act on.',
      script:
        'The pizza place charges 9 dollars for a plain pizza and 2 dollars for each topping. Last lesson you learned to write that as 9 + 2t. Very nice, but nobody at the counter cares about 9 + 2t. They care about tonight: three toppings, so what do we owe? You put a 3 where the t was and finish the arithmetic. 9 + 2(3) = 9 + 6 = 15 dollars. That swap has a name, and it is the entire lesson. Today we substitute numbers for letters. We also handle the one spot where it reliably goes wrong, which is when the number going in is negative.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-substitute-then-compute',
      kind: 'concept',
      goal: 'Establish substitute-then-compute, the parentheses habit, the squared-negative trap, and two-variable bookkeeping.',
      keyIdeas: [
        'EVALUATE MEANS TWO JOBS IN ORDER — first SUBSTITUTE, which is swapping the given number in for every copy of the letter, and only then COMPUTE. Do not start the arithmetic while letters are still standing. Finish the swap for the whole expression, write the new line down, then work.',
        'WRAP THE SUBSTITUTED NUMBER IN PARENTHESES — every time, not just when it feels risky. In 3x with x = 5 write 3(5), which is 15. If x = −4, write 3(−4), which is −12. Writing 3 − 4 instead turns a multiplication into a subtraction and quietly gives you −1. The parentheses are what keep the number and the operation from blurring together.',
        'THE SQUARED-NEGATIVE TRAP — this is the big one. If x = −4, then x² means (−4)², which is (−4) times (−4) = 16, because a negative times a negative is positive. Written without the parentheses it becomes −4², which means take 4² = 16 and THEN make it negative, giving −16. Same digits, opposite answers. So (−4)² = 16 and −4² = −16, and the parentheses habit is what gets you the right one.',
        'ORDER OF OPERATIONS RUNS THE REST — once every letter is a number, work in the usual order: parentheses first, then exponents, then multiplying and dividing from left to right, then adding and subtracting from left to right. A coefficient always means multiply, so 5n with n = 3 is 5 times 3 = 15, never the two digits pushed together.',
        'TWO VARIABLES, TWO SWAPS — when an expression has more than one letter, substitute both before you compute, and keep straight which number belongs to which letter. If a = 7 and b = −2, then 2a − 3b becomes 2(7) − 3(−2). Swapping the two values by accident is one of the most common ways to lose a correct method.',
        'SUBTRACTING A NEGATIVE STILL ADDS — after substituting you will often meet something like 14 − (−6). That is 14 + 6 = 20. The parentheses make the two signs sit side by side where you can see them instead of hiding one inside the other.',
      ],
      vocabulary: [
        { term: 'substitute', definition: 'to replace a variable with a given number, written inside parentheses: replacing x with −4 gives (−4).' },
        { term: 'evaluate', definition: 'to substitute the given values and then compute, so the expression becomes a single number.' },
        { term: 'order of operations', definition: 'the agreed order for computing: parentheses, exponents, multiply and divide left to right, add and subtract left to right.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-negative-squared',
      kind: 'worked_example',
      problem: 'Evaluate 3x² − 5 when x = −4.',
      steps: [
        'Substitute first, and put the −4 in parentheses: 3(−4)² − 5. Nothing has been computed yet; the letter is simply gone.',
        'Order of operations says exponents before multiplying, so square first: (−4)² means (−4) times (−4), which is 16. A negative times a negative is positive.',
        'Now multiply: 3 times 16 = 48. The expression is 48 − 5.',
        'Subtract: 48 − 5 = 43.',
        'Look hard at that second step. WRONG answer to avoid: −53, which is what you get from writing −4² = −16, then 3(−16) = −48, then −48 − 5 = −53. RIGHT answer: 43. The parentheses around the −4 are the whole difference.',
        'The rule to keep: (−4)² = 16, because the parentheses say the negative is part of what gets squared. But −4² = −16, because there the squaring happens first and the minus sign waits outside.',
      ],
      answer: '43',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-variables',
      kind: 'worked_example',
      problem: 'Evaluate 2a − 3b when a = 7 and b = −2.',
      steps: [
        'Write down which number belongs to which letter before you touch the expression: a is 7, b is −2. Mixing these up is the easiest way to lose a problem you actually know how to do.',
        'Substitute both, each in parentheses: 2(7) − 3(−2).',
        'Multiply left to right. 2(7) = 14. Then 3(−2) = −6, so the expression reads 14 − (−6).',
        'Subtracting a negative adds: 14 − (−6) = 14 + 6 = 20.',
        'WRONG answer to avoid: 8, which comes from writing 14 − 6 and letting the negative on b disappear. RIGHT answer: 20. The b value was negative, and that minus sign has to survive the trip.',
        'Quick sense check by swapping nothing and rereading: 2a is 14, and we are taking away 3b, which is a negative six. Taking away something negative makes the total bigger, so an answer above 14 is exactly what we should expect.',
      ],
      answer: '20',
      estimatedMinutes: 3,
    },
    {
      id: 'try-square-a-negative',
      kind: 'try_yourself',
      problem: 'Evaluate x² + 2x when x = −5.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '15', correct: true },
        { id: 'b', text: '−35' },
        { id: 'c', text: '35' },
        { id: 'd', text: '−15' },
      ],
      expectedAnswer: '15',
      hints: [
        'Substitute with parentheses in both places first: (−5)² + 2(−5). Do not compute anything until the swap is done.',
        '(−5)² is (−5) times (−5). And 2(−5) is negative, so the second piece pulls the total back down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-variables',
      kind: 'try_yourself',
      problem: 'Evaluate 5m − 2n when m = 3 and n = −4.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '23', correct: true },
        { id: 'b', text: '7' },
        { id: 'c', text: '−26' },
        { id: 'd', text: '−52' },
      ],
      expectedAnswer: '23',
      hints: [
        'Write down m = 3 and n = −4 first, then substitute both: 5(3) − 2(−4).',
        '2(−4) is −8, so the expression becomes 15 − (−8). Subtracting a negative adds.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-evaluate',
      kind: 'try_yourself',
      problem: 'Evaluate 2y² − 7 when y = −3. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '11',
      hints: [
        'Substitute with parentheses: 2(−3)² − 7. The parentheses mean the negative is part of what gets squared.',
        'Exponent before multiplication. Square the −3 first, then multiply that result by 2, and subtract 7 last.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-squared',
      kind: 'misconception_check',
      question: 'A student evaluates x² when x = −6 and writes −36. A second student writes −12. What went wrong in each case?',
      commonErrors: [
        {
          answer: '−36',
          misconception: 'Substituting without parentheses, so −6² got computed instead of (−6)². That writes the squaring as happening to the 6 alone, with the minus sign sitting outside and waiting.',
          correctsTo: 'Substitute in parentheses: x² with x = −6 is (−6)², which is (−6) times (−6) = 36. A negative times a negative is positive. Compare the two forms carefully: (−6)² = 36, while −6² = −36. Only the first one is what x² asks for when x is −6.',
        },
        {
          answer: '−12',
          misconception: 'Reading the exponent 2 as an instruction to multiply by 2, so x² was treated as 2x and (−6) times 2 gave −12.',
          correctsTo: 'An exponent counts copies of the base being multiplied, so x² means x times x, not x times 2. With x = −6 that is (−6)(−6) = 36. It is worth checking with a friendly number too: with x = 5, x² = 25 while 2x = 10, so the two are clearly not the same instruction.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Evaluate means substitute first, compute second. Finish every swap before any arithmetic.',
        'Put every substituted number in parentheses: x = −4 in 3x gives 3(−4) = −12.',
        'Parentheses decide the squared-negative case: (−4)² = 16, but −4² = −16.',
        'After substituting, follow the order of operations: parentheses, exponents, multiply and divide, add and subtract.',
        'With two variables, write down which number belongs to which letter, then substitute both: 2a − 3b at a = 7, b = −2 is 2(7) − 3(−2) = 20.',
        'Substituting is also how you check yourself later — put the same number into two expressions and see whether they agree.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Evaluating Expressions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
