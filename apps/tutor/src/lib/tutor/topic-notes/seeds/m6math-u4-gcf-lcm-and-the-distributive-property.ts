/**
 * Grade 6 Math — Unit 4 CED 4.4: GCF, LCM & the Distributive Property.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.gcf-lcm-and-the-distributive-property.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U4_GCF_LCM_AND_THE_DISTRIBUTIVE_PROPERTY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.gcf-lcm-and-the-distributive-property.v1',
  course: 'Grade 6 Math',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'GCF, LCM & the Distributive Property',
  planId: 'evelyn.ms.m6math.gcf-lcm-and-the-distributive-property.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.gcf-lcm-and-the-distributive-property.v1' }],
  theory: [
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'framework', title: 'Factors go down, multiples go up', content: `FACTORS GO DOWN, MULTIPLES GO UP — a factor of a number divides it evenly, with nothing left over. The factors of 12 are 1, 2, 3, 4, 6, and 12. A multiple of a number is what you get by multiplying it by a whole number. The multiples of 12 go up forever: 12, 24, 36, and so on. Factors are smaller than or equal to the number; multiples are the number or bigger.` },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'framework', title: 'A common factor is shared by both numbers', content: `A COMMON FACTOR IS SHARED BY BOTH NUMBERS — list the factors of each number, then look for the ones that show up on both lists. The GREATEST COMMON FACTOR, or GCF, is the biggest number on that shared list. Finding a GCF means searching DOWN through factors for the biggest match.` },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'framework', title: 'A common multiple is shared too', content: `A COMMON MULTIPLE IS SHARED TOO — list the multiples of each number, then look for the ones that show up on both lists. The LEAST COMMON MULTIPLE, or LCM, is the smallest number on that shared list. Finding an LCM means searching UP through multiples for the smallest match.` },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'framework', title: 'GCF and LCM are one question, two directions', content: `GCF AND LCM ARE ONE QUESTION, TWO DIRECTIONS — both start the same way, by listing and comparing. GCF looks down among shared factors for the biggest one. LCM looks up among shared multiples for the smallest one. Mixing up which direction the question wants is the single most common slip, so before answering, say out loud whether the problem needs the biggest shared factor or the smallest shared multiple.` },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'framework', title: 'A common factor can be pulled out of a sum', content: `A COMMON FACTOR CAN BE PULLED OUT OF A SUM — if two whole numbers share a common factor, the distributive property lets you rewrite their sum as that factor times a sum of two smaller whole numbers. Divide each original number by the common factor to find what goes inside the parentheses. Using the GREATEST common factor gives the smallest possible numbers inside the parentheses.` },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'framework', title: 'Check by going backward', content: `CHECK BY GOING BACKWARD — after pulling a factor out, multiply it back through the parentheses; you should land exactly back on the original sum. After finding an LCM, divide it by both original numbers; both divisions should come out even, with no remainder.` },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'definition', title: 'factor', content: 'a whole number that divides another number evenly, with nothing left over.' },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'definition', title: 'multiple', content: `the result of multiplying a whole number by another whole number; the multiples of 12 are 12, 24, 36, and so on.` },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'definition', title: 'greatest common factor (GCF)', content: 'the biggest whole number that is a factor of two given numbers.' },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'definition', title: 'least common multiple (LCM)', content: `the smallest whole number, other than zero, that is a multiple of two given numbers.` },
    { loId: 'm6math.gcf-lcm-and-the-distributive-property', kind: 'definition', title: 'distributive property', content: `a rule that lets a common factor be pulled out of a sum, rewriting the sum as that factor times a sum of smaller whole numbers.` },
  ],
  methods: [
    {
      title: 'Worked goodie bags GCF',
      steps: [
        'List the factors of 24: 1, 2, 3, 4, 6, 8, 12, 24.',
        'List the factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.',
        `Find the numbers that appear on both lists: 1, 2, 3, 4, 6, and 12. The greatest one is 12, so GCF(24, 36) = 12. The greatest number of identical bags is 12.`,
        `Divide each original number by the GCF to find what goes in each bag: 24 ÷ 12 = 2 chocolate bars, and 36 ÷ 12 = 3 stickers.`,
        `Write the sum using the distributive property: 24 + 36 = 12 × 2 + 12 × 3 = 12 × (2 + 3).`,
        `Check by multiplying back: 12 × (2 + 3) = 12 × 5 = 60, and 24 + 36 = 60. The two sides match.`,
        `Read the answer back into the story: 12 bags, each holding 2 chocolate bars and 3 stickers, uses every item with nothing left over.`,
      ],
      example: { problem: `You have 24 mini chocolate bars and 36 stickers for goodie bags. Find the greatest number of identical bags you can make with nothing left over, and use the distributive property to show how many of each item goes in a bag.`, solution: '12 bags; 24 + 36 = 12 × (2 + 3)' },
      relatedLoIds: ['m6math.gcf-lcm-and-the-distributive-property'],
    },
    {
      title: 'Worked buses LCM',
      steps: [
        `This question asks when two repeating events line up again, so it needs a common MULTIPLE, not a common factor.`,
        'List multiples of 8: 8, 16, 24, 32, 40, 48.',
        'List multiples of 12: 12, 24, 36, 48.',
        'Find the smallest number that appears on both lists: 24. So LCM(8, 12) = 24.',
        `WRONG: listing the shared FACTORS of 8 and 12 instead (1, 2, 4) and picking the greatest one, 4. That is the GCF, and it answers a different question: it does not tell you when the buses meet again. CORRECT: the buses meeting again is a shared multiple question, so the answer comes from the multiples lists, which give 24.`,
        `Check by dividing the answer by both original numbers: 24 ÷ 8 = 3, and 24 ÷ 12 = 2. Both divisions come out even, with no remainder, so 24 is really a common multiple of both.`,
      ],
      example: { problem: `Bus A stops at your corner every 8 minutes. Bus B stops at the same corner every 12 minutes. Both buses just stopped there together. In how many minutes will they stop there together again?`, solution: '24 minutes' },
      relatedLoIds: ['m6math.gcf-lcm-and-the-distributive-property'],
    },
  ],
  pointers: [
    { content: `Students often say "2 (given as the LCM of 4 and 6)" — The question asked for a common multiple, so the search should go through multiples, not factors. Multiples of 4: 4, 8, 12, 16. Multiples of 6: 6, 12, 18. The smallest number on both lists is 12, so LCM(4, 6) = 12, not 2. The number 2 is the GCF of 4 and 6, which answers a different question.`, kind: 'common-error' },
    { content: `Students often say "12 (given as the GCF of 4 and 6)" — The question asked for a common factor, so the search should go through factors, not multiples. Factors of 4: 1, 2, 4. Factors of 6: 1, 2, 3, 6. The numbers on both lists are 1 and 2, and the greatest is 2, so GCF(4, 6) = 2, not 12. The number 12 is the LCM of 4 and 6, which answers a different question.`, kind: 'common-error' },
    { content: `A factor divides a number evenly with nothing left over; a multiple is the number multiplied by a whole number.`, kind: 'tip' },
    { content: `The greatest common factor (GCF) of two numbers is the biggest number that is a factor of both.`, kind: 'tip' },
    { content: `The least common multiple (LCM) of two numbers is the smallest number that is a multiple of both.`, kind: 'tip' },
    { content: `GCF and LCM are the same search run in opposite directions: GCF looks down through shared factors, LCM looks up through shared multiples. Say out loud which direction a problem needs before answering.`, kind: 'tip' },
    { content: `The distributive property lets a common factor be pulled out of a sum: 24 + 36 = 12 × (2 + 3), because dividing each number by 12 gives the numbers inside the parentheses.`, kind: 'tip' },
    { content: `Check a distributive rewrite by multiplying back out, and check an LCM by dividing it by both original numbers; every division should come out even.`, kind: 'tip' },
    { content: `Say out loud: "Am I looking for the biggest shared factor or the smallest shared multiple?" before you start. GCF and LCM are opposites — mixing them up is the #1 slip on this topic.`, kind: 'gotcha' },
    { content: `Factors go DOWN (they're ≤ the number). Multiples go UP (they're ≥ the number). If your list is getting bigger, you're listing multiples, not factors.`, kind: 'vocab-note' },
    { content: `When you pull out a common factor using the distributive property, always divide each original number by that factor to find what goes inside the parentheses. Don't guess.`, kind: 'common-error' },
    { content: `To find the LCM, you need the smallest number on the multiples lists, not the biggest. Stop searching as soon as you see a number that appears on both lists.`, kind: 'edge-case' },
    { content: `After you write a distributive rewrite like 24 + 36 = 12 × (2 + 3), multiply back out: 12 × 5 = 60, and check that it matches the original sum. No match = wrong answer.`, kind: 'tip' },
    { content: `The GCF is always ≤ the smaller original number. If your GCF is bigger than both numbers, it's wrong — you probably found an LCM by mistake.`, kind: 'common-error' },
    { content: `Don't skip 1 when you list factors — 1 is always a factor of every number, and it's always a common factor. It just won't be the GCF unless the two numbers share no other factors.`, kind: 'edge-case' },
    { content: `When checking an LCM, divide it by each original number. If even one division has a remainder, it's not a common multiple — your LCM is wrong.`, kind: 'tip' },
  ],
};
