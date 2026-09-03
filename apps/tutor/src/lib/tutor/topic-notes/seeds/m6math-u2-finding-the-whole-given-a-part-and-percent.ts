/**
 * Grade 6 Math — Unit 2 CED 2.3: Finding the Whole Given a Part & Percent.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.finding-the-whole-given-a-part-and-percent.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U2_FINDING_THE_WHOLE_GIVEN_A_PART_AND_PERCENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.finding-the-whole-given-a-part-and-percent.v1',
  course: 'Grade 6 Math',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Finding the Whole Given a Part & Percent',
  planId: 'evelyn.ms.m6math.finding-the-whole-given-a-part-and-percent.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.finding-the-whole-given-a-part-and-percent.v1' }],
  theory: [
    { loId: 'm6math.finding-the-whole-given-a-part-and-percent', kind: 'framework', title: 'The same equation, a different missing piece', content: `THE SAME EQUATION, A DIFFERENT MISSING PIECE — every percent problem connects three numbers: PART equals PERCENT, written as a decimal, times WHOLE. The last lesson used this equation to find the PART. This lesson uses the exact same equation to find the WHOLE instead.` },
    { loId: 'm6math.finding-the-whole-given-a-part-and-percent', kind: 'framework', title: 'Turn the percent into a decimal first', content: `TURN THE PERCENT INTO A DECIMAL FIRST — divide the percent number by 100 before doing anything else. 40% becomes 0.40, 25% becomes 0.25, 60% becomes 0.60. Skipping this step, or moving the decimal point only one place instead of two, is the single most common way to get this kind of problem wrong.` },
    { loId: 'm6math.finding-the-whole-given-a-part-and-percent', kind: 'framework', title: 'Divide to undo a multiplication', content: `DIVIDE TO UNDO A MULTIPLICATION — since PART equals DECIMAL times WHOLE, dividing both sides of that equation by the decimal isolates the WHOLE: WHOLE equals PART divided by DECIMAL. If 4 times 5 equals 20 also means 20 divided by 4 equals 5, this is that same fact family, just with a decimal in place of 4.` },
    { loId: 'm6math.finding-the-whole-given-a-part-and-percent', kind: 'framework', title: 'The whole is always bigger than the part', content: `THE WHOLE IS ALWAYS BIGGER THAN THE PART — a part is never more than 100% of its whole, so as long as the percent is less than 100%, the whole quantity must come out BIGGER than the part you started with. If your answer to a "find the whole" problem is smaller than the part, you divided by the wrong number, or divided the wrong way around.` },
    { loId: 'm6math.finding-the-whole-given-a-part-and-percent', kind: 'framework', title: 'Check by multiplying back', content: `CHECK BY MULTIPLYING BACK — once you have found the whole, multiply it by the decimal. That should return the exact part the problem gave you. If it does not, redo the division instead of trusting the first try.` },
    { loId: 'm6math.finding-the-whole-given-a-part-and-percent', kind: 'definition', title: 'percent', content: 'a rate that compares a number to 100; 40 percent means 40 out of every 100.' },
    { loId: 'm6math.finding-the-whole-given-a-part-and-percent', kind: 'definition', title: 'decimal form', content: `a percent rewritten as a decimal by dividing it by 100, so 40% becomes 0.40 and 60% becomes 0.60.` },
    { loId: 'm6math.finding-the-whole-given-a-part-and-percent', kind: 'definition', title: 'whole', content: `the entire quantity a percent is describing; the part is only a piece of the whole.` },
  ],
  methods: [
    {
      title: 'Worked homeroom vote',
      steps: [
        `Sort out what is known. The part is 12 students, the percent is 40%, and the whole, the total number of students in the homeroom, is missing.`,
        'Turn the percent into a decimal by dividing by 100: 40% becomes 0.40.',
        `Use the equation PART equals DECIMAL times WHOLE, and divide instead of multiply, since the whole is the missing piece: WHOLE equals 12 divided by 0.40.`,
        `Divide: 12 divided by 0.40 equals 30. So there are 30 students in Ms. Kim's homeroom.`,
        `Size check: 30 is bigger than 12, which makes sense, because 12 students are only 40% of the homeroom, not the whole homeroom.`,
        `Check by multiplying back: 0.40 times 30 equals 12, exactly the part the problem gave. The answer holds.`,
      ],
      example: { problem: `40% of the students in Ms. Kim's homeroom voted for the science museum on the class trip survey. That is 12 students. How many students are in Ms. Kim's homeroom in total?`, solution: '30 students' },
      relatedLoIds: ['m6math.finding-the-whole-given-a-part-and-percent'],
    },
    {
      title: 'Worked book pages',
      steps: [
        `Sort out what is known. The part is 15 pages, the percent is 25%, and the whole, the total number of pages in the book, is missing.`,
        'Turn the percent into a decimal: 25% becomes 0.25.',
        `WRONG: dividing 15 by 25, using the percent number itself instead of its decimal form: 15 divided by 25 equals 0.6. That answer is smaller than the part, which is impossible, since 15 pages is only 25% of the book, and the whole book has to be the BIGGER number.`,
        `CORRECT: divide by the decimal, not the raw percent number: 15 divided by 0.25 equals 60. The book has 60 pages.`,
        `Size check: 60 is bigger than 15, which matches the size check rule, since 25% is less than 100%.`,
        `Check by multiplying back: 0.25 times 60 equals 15, exactly the part given in the problem. The answer holds.`,
      ],
      example: { problem: `Mateo read 15 pages of his book last night, and that is 25% of the whole book. How many pages are in the whole book?`, solution: '60 pages' },
      relatedLoIds: ['m6math.finding-the-whole-given-a-part-and-percent'],
    },
  ],
  pointers: [
    { content: `Students often say "$10.80" — Multiplying 18 by 0.6 answers a different question: it finds 60% of $18, not the total price of the game. The part and the percent are known here, and the whole is missing, so divide: 18 divided by 0.6 equals 30. The game costs $30. Check by multiplying back: 0.6 times $30 equals $18, exactly the amount Priya saved, and $30 is bigger than $18, which makes sense since $18 is only part of the price.`, kind: 'common-error' },
    { content: `Students often say "$0.30" — 60% must first become the decimal 0.6, since 60 divided by 100 equals 0.6. Dividing by 60 instead moves the decimal point two extra places and makes the answer far too small: a video game cannot cost $0.30. Divide by the decimal instead: 18 divided by 0.6 equals 30, so the game costs $30.`, kind: 'common-error' },
    { content: `PART equals PERCENT, written as a decimal, times WHOLE — the same equation from the last lesson, now solved for the whole.`, kind: 'tip' },
    { content: `Turn the percent into a decimal first by dividing by 100: 40% becomes 0.40, and 60% becomes 0.60.`, kind: 'tip' },
    { content: `To find the whole, divide the part by the decimal: WHOLE equals PART divided by DECIMAL.`, kind: 'tip' },
    { content: `The whole is always bigger than the part, as long as the percent is less than 100%. A smaller answer means something was divided by the wrong number.`, kind: 'tip' },
    { content: `Check every answer by multiplying it back by the decimal. It should return the exact part the problem gave.`, kind: 'tip' },
    { content: `Convert the percent to decimal FIRST, before you divide. 40% → 0.40 (divide by 100), not 0.4 or 40. Moving the decimal point wrong is the #1 mistake here.`, kind: 'common-error' },
    { content: `Divide the part BY the decimal, not multiply. If 12 is 40% of the whole, divide: 12 ÷ 0.40 = 30. Multiplying is last lesson's move (finding the part), not this one.`, kind: 'common-error' },
    { content: `Your answer MUST be bigger than the part you started with (unless the percent is somehow over 100%, which is rare). Smaller answer? You divided by the wrong number.`, kind: 'tip' },
    { content: `Don't divide by the percent number itself. Divide by its decimal form. Dividing 15 by 25 gives 0.6 (wrong). Dividing 15 by 0.25 gives 60 (right).`, kind: 'gotcha' },
    { content: `Always multiply back to check. Multiply your whole by the decimal. If you get the exact part the problem stated, you're right. If not, redo the division.`, kind: 'tip' },
    { content: `The equation is the same: PART = DECIMAL × WHOLE. Last lesson solved for PART. This lesson solves for WHOLE by dividing: WHOLE = PART ÷ DECIMAL. Same equation, different missing piece.`, kind: 'vocab-note' },
    { content: `If the percent is exactly 100%, the whole equals the part (100% of something is all of it). This is rare, but don't be surprised if your answer matches the part.`, kind: 'edge-case' },
  ],
};
