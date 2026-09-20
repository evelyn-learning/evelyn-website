/**
 * Grade 8 Math — Unit 5 CED 5.4: Systems Word Problems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.systems-word-problems.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U5_SYSTEMS_WORD_PROBLEMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.systems-word-problems.v1',
  course: 'Grade 8 Math',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Systems Word Problems',
  planId: 'evelyn.ms.m8math.systems-word-problems.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.systems-word-problems.v1' }],
  theory: [
    { loId: 'm8math.systems-word-problems', kind: 'framework', title: 'Name the unknowns first, with units', content: `NAME THE UNKNOWNS FIRST, WITH UNITS — before any equation, write one sentence that says what each letter stands for: let x be the gigabytes used in a month and y the monthly cost in dollars; let a be the number of adult tickets and c the number of child tickets. A system built on unnamed letters is where most wrong equations come from, because you cannot tell whether the 20 belongs with the x or with the y.` },
    { loId: 'm8math.systems-word-problems', kind: 'framework', title: 'Every fact becomes one equation', content: `EVERY FACT BECOMES ONE EQUATION — two unknowns need two facts, and each fact becomes exactly one equation. Two phone plans are two facts, one per plan. A ticket sale that reports how many tickets AND how much money came in is two facts, one about the count and one about the money. If you find yourself squeezing both facts into one equation, or using the same total twice, stop and separate them.` },
    { loId: 'm8math.systems-word-problems', kind: 'framework', title: 'Pattern one, two plans', content: `PATTERN ONE, TWO PLANS — a plan that charges $20 a month plus $2 per gigabyte costs y = 20 + 2x: the dollars paid once stand alone, and the dollars paid per gigabyte multiply x, exactly the way you already write an equation from a word problem. A second plan gives a second equation, y = 10 + 4x. Both are already solved for y, which is the friendliest form a system can take.` },
    { loId: 'm8math.systems-word-problems', kind: 'framework', title: 'Pattern two, a count and a total cost', content: `PATTERN TWO, A COUNT AND A TOTAL COST — if 120 tickets were sold and a of them were adult, then the rest, 120 - a, were child tickets, so write the count fact as c = 120 - a. The money fact multiplies each count by its own price and adds: 8a + 5c = 750 when adult tickets are $8 and child tickets are $5 and $750 came in. Keep the two totals straight: 120 is a number of tickets and belongs in the count fact, 750 is dollars and belongs in the money fact.` },
    { loId: 'm8math.systems-word-problems', kind: 'framework', title: 'Solve with the moves you already own', content: `SOLVE WITH THE MOVES YOU ALREADY OWN — when both equations are solved for y, set the two right sides equal, 20 + 2x = 10 + 4x, and finish it as an equation with x on both sides. When one equation is solved for a letter, drop it into the other one, 8a + 5(120 - a) = 750, and distribute. Or graph both lines and read where they cross, which gives an estimate when the crossing is not on a grid point and the exact pair when it is. Then put your first answer back into the easier equation to find the second coordinate.` },
    { loId: 'm8math.systems-word-problems', kind: 'framework', title: 'The pair is two answers, each with a unit, and both get checked', content: `THE PAIR IS TWO ANSWERS, EACH WITH A UNIT, AND BOTH GET CHECKED — (5, 30) is not the answer; "at 5 gigabytes both plans cost $30" is. Put the pair into BOTH original equations and make sure each one comes out true, then ask whether it makes sense in the story: a ticket count must be a whole number and cannot be negative. A count like 21.4 tickets is not a strange answer, it is a signal that one of the equations was built wrong.` },
    { loId: 'm8math.systems-word-problems', kind: 'definition', title: 'defining the variables', content: `the sentence that says what each letter stands for, with its unit, written before any equation.` },
    { loId: 'm8math.systems-word-problems', kind: 'definition', title: 'system of equations', content: `two equations about the same two unknowns that must both be true at once; its solution is the one pair that satisfies both.` },
    { loId: 'm8math.systems-word-problems', kind: 'definition', title: 'interpret', content: `say what a number means in the story, with its unit: x = 5 becomes 5 gigabytes, not just 5.` },
  ],
  methods: [
    {
      title: 'Worked two phone plans',
      steps: [
        `Name the unknowns. Let x be the gigabytes used in a month and y the monthly cost in dollars. Both plans use the same x and the same y, which is what makes this a system.`,
        `Translate each plan into one equation. Plan A: the $20 is paid once and the $2 is paid for every gigabyte, so y = 20 + 2x. Plan B: y = 10 + 4x. Both equations are already solved for y.`,
        `Solve. The two costs are equal at the crossing, so set the right sides equal: 20 + 2x = 10 + 4x. Subtract 2x from both sides: 20 = 10 + 2x. Subtract 10 from both sides: 10 = 2x. Divide by 2: x = 5.`,
        `Find the second coordinate by putting x = 5 into Plan A: y = 20 + 2(5) = 20 + 10 = 30. The pair is (5, 30).`,
        `Check in BOTH equations. Plan A: 20 + 2(5) = 30. Plan B: 10 + 4(5) = 10 + 20 = 30. Both give 30, so the pair is right.`,
        `Interpret with units: at 5 gigabytes a month, both plans cost exactly $30. On a graph with gigabytes across and dollars up, Plan B starts lower, at 10, but climbs faster, 4 per gigabyte, so its line starts below Plan A and crosses it at (5, 30).`,
        `Answer the last question by reading the graph on the left of the crossing. At 2 gigabytes, Plan A costs 20 + 2(2) = 24 and Plan B costs 10 + 4(2) = 18, so Plan B is cheaper for a light data user. At 8 gigabytes, Plan A is 20 + 16 = 36 and Plan B is 10 + 32 = 42, so the lines have switched and Plan A is cheaper for a heavy user.`,
      ],
      example: { problem: `Plan A costs $20 a month plus $2 per gigabyte of data. Plan B costs $10 a month plus $4 per gigabyte. At how many gigabytes do the two plans cost the same, and what is that cost? Which plan is cheaper for someone who uses less data than that?`, solution: `The plans cost the same, $30, at 5 gigabytes; below 5 gigabytes Plan B is cheaper, and above it Plan A is cheaper` },
      relatedLoIds: ['m8math.systems-word-problems'],
    },
    {
      title: 'Worked school play tickets',
      steps: [
        `Name the unknowns. Let a be the number of adult tickets and c the number of child tickets.`,
        `Translate the count fact. All 120 tickets are either adult or child, so if a of them are adult, the rest are child: c = 120 - a. This equation is already solved for c, so it is ready to drop into the other one.`,
        `Translate the money fact. Each adult ticket brings in $8 and each child ticket brings in $5, so 8a + 5c = 750. Notice which total went where: 120 tickets in the count fact, 750 dollars in the money fact.`,
        'Substitute the count fact into the money fact: 8a + 5(120 - a) = 750.',
        `WRONG: writing 5(120 - a) as 600 - a, which gives 8a + 600 - a = 750, then 7a = 150 and a = 150 ÷ 7, about 21.4 adult tickets. A ticket count that is not a whole number is the story telling you an equation was built wrong. CORRECT: the 5 multiplies BOTH parts of the bracket, so 5(120 - a) = 600 - 5a.`,
        `Now the equation is 8a + 600 - 5a = 750, which collects to 3a + 600 = 750. Subtract 600 from both sides: 3a = 150. Divide by 3: a = 50.`,
        'Find the second unknown from the count fact: c = 120 - 50 = 70.',
        `Check in BOTH facts. Count: 50 + 70 = 120. Money: 8(50) + 5(70) = 400 + 350 = 750. Both facts hold, both counts are whole and positive, so the pair makes sense.`,
        'Interpret with units: 50 adult tickets and 70 child tickets were sold.',
      ],
      example: { problem: `The school play sold adult tickets for $8 and child tickets for $5. In total 120 tickets were sold and $750 was collected. How many adult tickets and how many child tickets were sold?`, solution: '50 adult tickets and 70 child tickets' },
      relatedLoIds: ['m8math.systems-word-problems'],
    },
  ],
  pointers: [
    { content: `Students often say "The plans cost $5." — Theo defined x as gigabytes, so x = 5 means 5 gigabytes, not $5. The story asked for a pair: put x = 5 back into Plan A, y = 20 + 2(5) = 30, and check it in Plan B, 10 + 4(5) = 30. The interpreted answer is that at 5 gigabytes a month both plans cost $30. A bare number is never the answer to a word problem; a sentence with two units is.`, kind: 'common-error' },
    { content: `Students often say "y = 20x + 2 and y = 10x + 4, so x = 0.2" — The amount that repeats for every gigabyte is the one that multiplies x, and the amount paid once stands alone, so Plan A is y = 20 + 2x and Plan B is y = 10 + 4x. Nia can catch the swap by reading her own equation back into the story: y = 20x + 2 says the plan charges $20 for every gigabyte and $2 a month, which is not what the sentence said. With the correct equations, 20 + 2x = 10 + 4x gives x = 5 and y = 30: both plans cost $30 at 5 gigabytes.`, kind: 'common-error' },
    { content: `Name the unknowns first, with units, in one sentence: let x be the gigabytes and y the cost in dollars.`, kind: 'tip' },
    { content: `Two unknowns need two facts, and each fact becomes exactly one equation. Never squeeze two facts into one equation or use the same total twice.`, kind: 'tip' },
    { content: `Two plans: cost = the amount paid once + the per-unit rate × the amount, so y = 20 + 2x. A count and a total cost: c = 120 - a for the count, and each price times its own count for the money.`, kind: 'tip' },
    { content: `Solve with the moves you already own: set two solved-for-y sides equal, drop a solved-for-one-letter equation into the other, or graph both lines and read the crossing. Then find the second coordinate.`, kind: 'tip' },
    { content: `The answer is a pair with two units, checked in BOTH original facts and against sense: a ticket count that is not a whole number means an equation was built wrong.`, kind: 'tip' },
    { content: `Write "let x = ..." and "let y = ..." with units before you write any equation. If you skip this, you'll build the wrong equations because you won't know which number belongs with which letter.`, kind: 'common-error' },
    { content: `A count fact and a money fact are TWO separate equations. Don't squeeze both into one. If you have "120 tickets sold for $750," write two equations: one about 120 tickets, one about $750.`, kind: 'gotcha' },
    { content: `When you substitute, the multiplier goes around BOTH terms in the bracket: 5(120 − a) = 600 − 5a, not 600 − a. Forgetting to distribute the 5 to the −a term gives you a fractional ticket count, which signals the equation is wrong.`, kind: 'common-error' },
    { content: `The rate that repeats for every unit goes next to the variable: y = 20 + 2x means $20 once and $2 for each x. If you write y = 20x + 2, you're saying $20 per unit and $2 once, which flips the story.`, kind: 'vocab-note' },
    { content: `After you solve for one unknown, plug it back into one of the ORIGINAL equations to find the other. Don't just stop at x = 5; you need both numbers and both units in your answer.`, kind: 'common-error' },
    { content: `Check your answer in BOTH original equations, not just one. If it satisfies only one, you built the system wrong.`, kind: 'tip' },
    { content: `If your answer is a ticket count that is not a whole number, or a count that is negative, stop. The equations are wrong, not the story. Go back and reread the problem.`, kind: 'edge-case' },
    { content: `When two equations are solved for the same letter (both solved for y), set the right sides equal: 20 + 2x = 10 + 4x. This is the fastest path to the solution.`, kind: 'tip' },
  ],
};
