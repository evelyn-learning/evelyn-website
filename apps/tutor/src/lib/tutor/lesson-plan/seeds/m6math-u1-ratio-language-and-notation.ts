/**
 * Grade 6 Math — Understanding Ratios & Rates: Ratio Language & Notation.
 *
 * Opens the course. The student has compared quantities informally before
 * ("we have way more red marbles than blue ones") but has no shared way to
 * write that comparison down. This lesson gives them one: a ratio keeps two
 * quantities together instead of collapsing them into a single difference,
 * and that same relationship can be written three ways (a:b, "a to b", a/b)
 * and read aloud with "for every" language (CCSS 6.RP.A.1). It also draws the
 * one distinction that trips students up for the rest of the unit: a
 * part-to-part ratio compares one part to another part, while a part-to-whole
 * ratio compares one part to the total.
 *
 * SCOPE GUARD: Grade 6 topic 1.1 teaches only ratio LANGUAGE AND NOTATION —
 * reading, writing, and interpreting a ratio relationship between two
 * quantities using a:b, "a to b", and a/b, including "for every" language and
 * the part-to-part versus part-to-whole distinction. It never builds a ratio
 * table, tape diagram, or double number line to generate an equivalent ratio
 * (row 1.2), never scales a ratio to solve a missing-value problem or plots
 * ratio pairs on the coordinate plane (row 1.3), and never divides to compute
 * a unit rate a/b for comparing prices (row 1.4). Wherever a part-to-whole
 * ratio needs a total, that total is found by adding the two counts the
 * problem already gives — never by scaling a ratio up or down to find a
 * missing term. No equivalent ratio is generated anywhere in this lesson.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U1_RATIO_LANGUAGE_AND_NOTATION: LessonPlan = {
  id: 'evelyn.ms.m6math.ratio-language-and-notation.v1',
  title: 'Ratio Language & Notation',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.ratio-language-and-notation',
      standard: 'M6MATH-1.1',
      description:
        'Read, write, and interpret ratio language and notation (a:b, a to b, a/b) to describe a relationship between two quantities (CCSS 6.RP.A.1).',
    },
  ],
  prerequisites: [],
  followUps: ['m6math.representing-ratios-with-tables-and-diagrams'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to notice that "more of one thing than another" needs a way to be written down precisely, before any notation is introduced.',
      script:
        'You are making trail mix for a class trip. Your recipe uses 2 cups of peanuts for every 3 cups of raisins. If you just said "there are more raisins than peanuts," that would not be enough information for a friend to make the exact same mix. You need a way to write down both numbers together, in order, so the recipe comes out the same every time. That is exactly what a ratio does. Today we learn how to read it, write it, and say it out loud.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ratio-language-and-notation',
      kind: 'concept',
      goal: 'Build the ratio as a kept-together comparison of two quantities, teach the three equivalent notations, and separate part-to-part ratios from part-to-whole ratios.',
      keyIdeas: [
        'A RATIO KEEPS TWO NUMBERS TOGETHER — a ratio compares two quantities by holding both numbers side by side, in a set order. It does not collapse them into one number the way subtraction does. Saying "raisins minus peanuts is 1" throws away information; saying "2 cups of peanuts to 3 cups of raisins" keeps it.',
        'THREE WAYS TO WRITE THE SAME RATIO — the ratio of 2 to 3 can be written 2:3, or in words as "2 to 3", or as 2/3. All three name the exact same comparison. Which form to use is usually just a matter of what looks cleanest in the sentence you are writing.',
        'ORDER MATTERS — the ratio of peanuts to raisins is 2:3. The ratio of raisins to peanuts is 3:2. These are different comparisons, even though the same two numbers appear. Whatever quantity is named first in the sentence goes first in the ratio.',
        '"FOR EVERY" LANGUAGE TURNS A RATIO INTO A SENTENCE — the ratio 2:3 can be read aloud as "for every 2 cups of peanuts, there are 3 cups of raisins." This is the exact wording CCSS ratio language uses, and it is the clearest way to check that a ratio has been written in the right order.',
        'PART-TO-PART VS PART-TO-WHOLE — a part-to-part ratio compares one part of a group to another part of the same group, such as peanuts to raisins. A part-to-whole ratio compares one part to the total of everything in the group, such as peanuts to the whole batch of trail mix. Both are ratios, and both use the same three notations, but they answer different questions.',
        'A RATIO WRITTEN AS A FRACTION IS NOT ALWAYS "PART OF A WHOLE" — a/b is a valid way to write a ratio, but that does not automatically mean a is part of a whole equal to b. If the ratio 2:3 is peanuts to raisins, writing it as 2/3 still compares peanuts to raisins, not peanuts to the total mix. Always check which two quantities the ratio is actually naming.',
      ],
      vocabulary: [
        { term: 'ratio', definition: 'a comparison of two quantities that keeps both numbers, and their order, together.' },
        { term: 'terms of a ratio', definition: 'the two numbers in a ratio; in 2:3, the terms are 2 and 3.' },
        { term: 'part-to-part ratio', definition: 'a ratio that compares one part of a group to a different part of the same group, such as peanuts to raisins.' },
        { term: 'part-to-whole ratio', definition: 'a ratio that compares one part of a group to the total amount in the whole group, such as peanuts to the whole batch of trail mix.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trail-mix-part-to-part-and-whole',
      kind: 'worked_example',
      problem:
        'A trail mix recipe uses 2 cups of peanuts and 3 cups of raisins, with no other ingredients. Write the ratio of peanuts to raisins in all three notations. Then write the ratio of peanuts to the whole batch of trail mix in all three notations.',
      steps: [
        'Peanuts to raisins compares one part of the mix to a different part, so this is a part-to-part ratio. Peanuts is named first, so its count goes first: 2 to 3, written 2:3, or as a fraction 2/3.',
        'To compare peanuts to the whole batch, first find the whole. The whole batch is every cup in the mix added together: 2 cups of peanuts plus 3 cups of raisins is 2 + 3 = 5 cups in all.',
        'Peanuts to the whole batch is a part-to-whole ratio: 2 cups of peanuts out of 5 cups total, written 2 to 5, or 2:5, or as a fraction 2/5.',
        'Read both answers back as "for every" sentences to check them. "For every 2 cups of peanuts, there are 3 cups of raisins" matches the part-to-part ratio 2:3. "For every 2 cups of peanuts, there are 5 cups of trail mix in all" matches the part-to-whole ratio 2:5.',
      ],
      answer: 'Part-to-part (peanuts to raisins): 2:3, 2 to 3, 2/3. Part-to-whole (peanuts to whole batch): 2:5, 2 to 5, 2/5.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-classroom-lunch-order-matters',
      kind: 'worked_example',
      problem:
        'In Ms. Rivera\'s class, 5 students bring lunch from home and 7 students buy lunch in the cafeteria. Write the ratio of students who bring lunch to students who buy lunch, and read it aloud using "for every" language.',
      steps: [
        'The ratio asked for is "bring lunch to buy lunch," so the bring-lunch count is named first and the buy-lunch count is named second.',
        'There are 5 students who bring lunch and 7 who buy lunch, so the ratio is 5 to 7, written 5:7 or 5/7.',
        'WRONG: writing this ratio as 7:5, because 7 happens to be the bigger, more noticeable number. CORRECT: the order comes from the words in the problem, "bring lunch to buy lunch," not from which number looks bigger, so the ratio stays 5:7.',
        'Read the correct ratio aloud as a check: "for every 5 students who bring lunch, 7 students buy lunch." That sentence matches the order the problem asked for, so 5:7 is confirmed.',
        'If the problem had instead asked for the ratio of students who buy lunch to students who bring lunch, the answer would flip to 7:5, because the words named buy-lunch first. The two ratios describe the same class, but they are not the same ratio.',
      ],
      answer: '5:7 (5 to 7, or 5/7); "for every 5 students who bring lunch, 7 students buy lunch."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fruit-bowl-for-every-language',
      kind: 'try_yourself',
      problem:
        'A fruit bowl has 4 apples and 6 bananas, with no other fruit. Which sentence correctly describes the ratio of apples to bananas using "for every" language?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'For every 4 apples, there are 6 bananas.', correct: true },
        { id: 'b', text: 'For every 6 apples, there are 4 bananas.' },
        { id: 'c', text: 'For every 4 apples, there are 10 bananas.' },
        { id: 'd', text: 'For every 10 apples, there are 6 bananas.' },
      ],
      expectedAnswer: 'For every 4 apples, there are 6 bananas.',
      hints: [
        'Ratio language keeps the two quantities in the order they are named: apples first, then bananas.',
        'The ratio compares apples to bananas directly, 4 to 6. It does not use the total number of pieces of fruit, which would be 4 + 6 = 10, in place of either count.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-garden-part-to-whole',
      kind: 'try_yourself',
      problem:
        'A school garden has 8 tomato plants and 5 pepper plants, with no other plants. Which is the correct part-to-whole ratio of tomato plants to all the plants in the garden?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8:13', correct: true },
        { id: 'b', text: '8:5' },
        { id: 'c', text: '5:13' },
        { id: 'd', text: '13:8' },
      ],
      expectedAnswer: '8:13',
      hints: [
        'A part-to-whole ratio compares one part to the total, not to the other part.',
        'First find the total number of plants: 8 tomato plants plus 5 pepper plants. Then compare tomato plants to that total, in that order.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-gift-basket-whole',
      kind: 'try_yourself',
      problem:
        'A gift basket has 7 candles and 5 soaps, with no other items. You are writing the part-to-whole ratio of candles to all the items in the basket. What is the second term of that ratio, the total number of items in the basket? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'The whole is the total number of items in the basket, both kinds added together.',
        'Add the two given amounts: 7 candles plus 5 soaps.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fraction-meaning-and-order',
      kind: 'misconception_check',
      question:
        'A bin holds 3 basketballs and 5 soccer balls, with no other balls. A student says the ratio of basketballs to soccer balls, written 3:5, means that 3/5 of the balls in the bin are basketballs. Separately, given that a supply box has 4 pencils and 9 pens, and asked to write the ratio of pencils to pens, the same student writes 9:4. What went wrong in each case?',
      commonErrors: [
        {
          answer: '3/5 of the balls in the bin are basketballs.',
          misconception: 'Treating a part-to-part ratio as though it already compares a part to the whole.',
          correctsTo:
            '3:5 compares basketballs to soccer balls only; it does not compare basketballs to the whole bin. The bin holds 3 + 5 = 8 balls in all, so the fraction of the bin that is basketballs is 3/8, not 3/5. The ratio 3:5 is a part-to-part comparison, while 3/8 is the part-to-whole comparison.',
        },
        {
          answer: '9:4',
          misconception: 'Writing the two numbers in the order they come to mind, instead of the order the ratio names.',
          correctsTo:
            'Ratio language names the quantities in a fixed order: "pencils to pens" must list pencils first. The pencil count is 4 and the pen count is 9, so the correct ratio is 4:9. Writing 9:4 instead describes the ratio of pens to pencils, which is a different comparison.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A ratio compares two quantities by keeping both numbers, and their order, together.',
        'The same ratio can be written three ways: a:b, "a to b", or a/b.',
        'Order matters: the ratio of X to Y is not the same as the ratio of Y to X.',
        '"For every" language turns ratio notation into a sentence, such as "for every 2 cups of peanuts, there are 3 cups of raisins."',
        'A part-to-part ratio compares one part to another part; a part-to-whole ratio compares one part to the total of everything in the group.',
        'Writing a ratio as a fraction does not automatically mean "part of a whole" — always check which two quantities the ratio is actually naming.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Ratio Language & Notation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
