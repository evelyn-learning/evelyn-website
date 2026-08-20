/**
 * Grade 7 Math — Unit 6 CED 6.3: Equations from Word Problems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.writing-equations-from-word-problems.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U6_WRITING_EQUATIONS_FROM_WORD_PROBLEMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.writing-equations-from-word-problems.v1',
  course: 'Grade 7 Math',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Equations from Word Problems',
  planId: 'evelyn.ms.m7math.writing-equations-from-word-problems.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.writing-equations-from-word-problems.v1' }],
  theory: [
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'framework', title: 'Step one is always the same', content: `STEP ONE IS ALWAYS THE SAME — write down what the variable stands for, in words, with units. Not "let g = games" but "let g = the number of games bowled". A variable with no definition is where most word-problem mistakes are born, because halfway through you forget whether it meant games or dollars.` },
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'framework', title: 'Find the word that means equals', content: `FIND THE WORD THAT MEANS EQUALS — words like is, was, costs, totals, in all, and altogether are the equals sign in disguise. Whatever comes before it goes on the left, whatever comes after it goes on the right.` },
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'framework', title: 'Most situations have the same shape', content: `MOST SITUATIONS HAVE THE SAME SHAPE — one fixed amount that happens once, plus a rate times a quantity. Shoes cost 5 once, games cost 3 each, so the total is 5 + 3g. The word each or per tells you which number is the coefficient, and the one-time number is the constant.` },
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'framework', title: 'The reversal trap', content: `THE REVERSAL TRAP — the phrases less than and subtracted from flip the order you read them in. "7 less than twice a number is 15" means you start at twice the number and take 7 away, so it is 2n − 7 = 15, NOT 7 − 2n = 15. Test any phrase with a friendly number: 7 less than 20 is 13, and 20 − 7 = 13, so the big quantity goes first. More than does not flip, because addition can be written either way.` },
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'framework', title: 'Solve, then answer the question that was asked', content: `SOLVE, THEN ANSWER THE QUESTION THAT WAS ASKED — the number you get is not the answer by itself. Put the units back on it and read the question again. Five games, or six months, or 12 dollars. If the question asked something different from what the variable stands for, there is still one more step to do.` },
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'framework', title: 'Make the answer make sense', content: `MAKE THE ANSWER MAKE SENSE — you cannot hire 3.45 buses or buy 2.7 packs. When the thing being counted comes in whole pieces and everyone has to fit, round UP to the next whole number, even when the decimal is small. Then ask yourself whether the size of the answer is believable at all.` },
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'definition', title: 'define the variable', content: 'writing in words, with units, exactly what quantity the letter stands for.' },
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'definition', title: 'constant', content: 'the one-time amount in a situation, which does not change with the variable.' },
    { loId: 'm7math.writing-equations-from-word-problems', kind: 'definition', title: 'rate', content: `an amount per one unit of something, such as 3 dollars per game; it becomes the coefficient.` },
  ],
  methods: [
    {
      title: 'Worked fixed plus rate',
      steps: [
        `Define the variable: let h = the number of hours Maya rented skates. Write that down before touching any numbers.`,
        `Sort the numbers. The 5 dollars happens once no matter what, so it is the constant. The 3 dollars happens every hour, so it is the rate and it multiplies h, giving 3h.`,
        `Find the equals. The words "in all" mean the two parts together came to 20, so the equation is 5 + 3h = 20.`,
        `Solve it as a two-step equation. Subtract 5 from both sides: 3h = 15. Divide both sides by 3: h = 5.`,
        'Check in the original equation: 5 + 3(5) = 5 + 15 = 20. Both sides are 20.',
        `Interpret the answer. The question asked for hours, and h stands for hours, so Maya rented skates for 5 hours. Sanity check: 5 hours of skates is 15 dollars, plus the 5 dollar entry, which is the 20 she spent.`,
      ],
      example: { problem: `A skate park charges 5 dollars to get in, plus 3 dollars for every hour you rent skates. Maya spent 20 dollars in all. How many hours did she rent skates?`, solution: '5 + 3h = 20, so h = 5 hours' },
      relatedLoIds: ['m7math.writing-equations-from-word-problems'],
    },
    {
      title: 'Worked reversal trap',
      steps: [
        'Define the variable: let n = the unknown number.',
        'Build the inside piece first. "Twice a number" is 2n.',
        `Now apply "7 less than". This phrase REVERSES the reading order: you begin with 2n and take 7 off it, giving 2n − 7. The word "is" supplies the equals sign, so the equation is 2n − 7 = 15.`,
        `WRONG equation to avoid: 7 − 2n = 15, which reads the words straight left to right. Test the reversal with a plain number: 7 less than 20 means 13, and 20 − 7 = 13, not 7 − 20. The bigger quantity comes first.`,
        'Solve 2n − 7 = 15. Add 7 to both sides: 2n = 22. Divide both sides by 2: n = 11.',
        `Check in words, not just in symbols: twice 11 is 22, and 7 less than 22 is 15. That matches the sentence exactly. The wrong equation would have given n = −4, and twice −4 is −8, with 7 less being −15, which does not match.`,
      ],
      example: { problem: 'Write an equation and solve: 7 less than twice a number is 15.', solution: '2n − 7 = 15, so n = 11' },
      relatedLoIds: ['m7math.writing-equations-from-word-problems'],
    },
  ],
  pointers: [
    { content: `Students often say "4 − 2n = 10, so n = −3" — Start with twice the number, 2n, and take 4 off it: 2n − 4 = 10. Add 4 to both sides to get 2n = 14, then divide by 2 to get n = 7. Read it back: twice 7 is 14, and 4 less than 14 is 10, which matches the sentence. Read the wrong version back and it fails: twice −3 is −6, and 4 less than −6 is −10, not 10.`, kind: 'common-error' },
    { content: `Students often say "3.45 buses" — Buses come in whole numbers, and the 18 students left over after three buses still need a ride. Round UP to 4 buses. The rule is not ordinary rounding: any leftover at all, even 0.1 of a bus, means one more whole bus.`, kind: 'common-error' },
    { content: 'Define the variable in writing, with units, before you write any equation.', kind: 'tip' },
    { content: `Words like is, costs, and in all are the equals sign; the one-time amount is the constant and the per-something amount is the coefficient.`, kind: 'tip' },
    { content: `"Less than" reverses the order: 7 less than twice a number is 2n − 7, never 7 − 2n.`, kind: 'tip' },
    { content: `Solve, then put the units back on and answer the question that was actually asked.`, kind: 'tip' },
    { content: `Make the answer make sense in the story, and round up whenever the leftover still needs a whole one.`, kind: 'tip' },
    { content: `"Less than" and "subtracted from" flip the order; "more than" and "added to" do not. Test with a friendly number: 7 less than 20 is 13, so it's 20 − 7. Write 2n − 7, never 7 − 2n.`, kind: 'common-error' },
    { content: `Define the variable with units, not just a letter. "Let g = games" is too vague — write "let g = the number of games bowled". Halfway through you'll forget whether g meant games or dollars.`, kind: 'vocab-note' },
    { content: `The number with **each** or **per** is the coefficient (it multiplies the variable). The one-time fee is the constant, sitting alone. Don't swap them: 5 entry + 3 per hour is 5 + 3h, not 3 + 5h.`, kind: 'gotcha' },
    { content: `x = 5 is not a finished answer. Put the units back and reread the question: "5 hours". If the question asks something different from what your variable stands for, there's one more step to do.`, kind: 'tip' },
    { content: `When you're counting whole things (buses, packs, boxes), round UP for any leftover — 3.45 buses means 4 buses, even 3.1 means 4. This is not normal rounding; the leftover students still need a ride.`, kind: 'edge-case' },
    { content: `Check by reading the sentence back in words, not just plugging into your own equation. If your equation was wrong, plugging in still "works". Twice 11 is 22, and 7 less than 22 is 15 — matches.`, kind: 'tip' },
    { content: `Words like is, was, costs, totals, in all, and altogether are the equals sign. Everything before that word goes on the left side, everything after goes on the right.`, kind: 'vocab-note' },
    { content: `A negative or wildly huge answer in a real-world story is a warning sign. You can't rent −4 hours of skates or pay for 900 months. Go back and check whether you flipped a subtraction.`, kind: 'edge-case' },
  ],
};
