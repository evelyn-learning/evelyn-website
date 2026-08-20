/**
 * Grade 7 Math — Unit 10 CED 10.4: Compound Events & Counting Outcomes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.compound-events.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U10_COMPOUND_EVENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.compound-events.v1',
  course: 'Grade 7 Math',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Compound Events & Counting Outcomes',
  planId: 'evelyn.ms.m7math.compound-events.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.compound-events.v1' }],
  theory: [
    { loId: 'm7math.compound-events', kind: 'framework', title: 'A compound event is two things at once', content: `A COMPOUND EVENT IS TWO THINGS AT ONCE — flipping a coin AND spinning a spinner, or drawing two marbles. The probability rule has not changed at all: it is still favorable outcomes over total outcomes. What is harder is counting them, because now every first outcome pairs with every second one.` },
    { loId: 'm7math.compound-events', kind: 'framework', title: 'Three ways to list the sample space', content: `THREE WAYS TO LIST THE SAMPLE SPACE — an ORGANIZED LIST goes in strict order so nothing is missed: heads-red, heads-blue, heads-green, tails-red, tails-blue, tails-green. A TABLE puts the first event down the side and the second across the top, so two number cubes make a table with 6 rows and 6 columns, and each of the 36 cells holds one pair such as row 4 column 3. A TREE DIAGRAM starts with one branch per first outcome, then splits EACH of those into one branch per second outcome; reading a path from start to tip gives one outcome, and there is one path per outcome.` },
    { loId: 'm7math.compound-events', kind: 'framework', title: 'The counting principle multiplies the options', content: `THE COUNTING PRINCIPLE MULTIPLIES THE OPTIONS — you do not have to write out every path to know how many there are. Two coin sides times three spinner sections is 6 outcomes. Six cube faces times six cube faces is 36 outcomes. Three shirts times four pairs of shorts is 12 outfits. Multiply the number of choices at each stage.` },
    { loId: 'm7math.compound-events', kind: 'framework', title: 'For independent events, multiply the probabilities', content: `FOR INDEPENDENT EVENTS, MULTIPLY THE PROBABILITIES — two events are independent when the first does not change the second. A coin flip cannot affect a spinner, so P(heads and green) = P(heads) times P(green) = 1/2 times 1/3 = 1/6. That agrees with the list, which had 6 outcomes and one of them was heads-green. Two different routes, one answer.` },
    { loId: 'm7math.compound-events', kind: 'framework', title: 'With replacement keeps everything the same', content: `WITH REPLACEMENT KEEPS EVERYTHING THE SAME — if you draw a marble, look at it, and put it BACK before drawing again, the bag is identical for the second draw. The two draws are independent and the fractions are identical: from 5 red in 8 marbles, P(red then red) = 5/8 times 5/8 = 25/64.` },
    { loId: 'm7math.compound-events', kind: 'framework', title: 'Without replacement changes both numbers', content: `WITHOUT REPLACEMENT CHANGES BOTH NUMBERS — if you keep the first marble out, the second draw happens in a smaller bag. Take a red one out of 5 red in 8 and only 4 red remain out of 7 marbles, so P(red then red) = 5/8 times 4/7 = 20/56 = 5/14. Notice that the top AND the bottom went down by one. Dropping only the numerator, or only the denominator, is the classic slip. These events are DEPENDENT, because the first draw genuinely changed the second.` },
    { loId: 'm7math.compound-events', kind: 'definition', title: 'compound event', content: `an event made of two or more simpler events happening together or one after the other.` },
    { loId: 'm7math.compound-events', kind: 'definition', title: 'tree diagram', content: `a branching list of a sample space: one branch per first outcome, each splitting into the possible second outcomes.` },
    { loId: 'm7math.compound-events', kind: 'definition', title: 'independent events', content: `events where the first one does not change the probability of the second, so the probabilities multiply.` },
    { loId: 'm7math.compound-events', kind: 'definition', title: 'without replacement', content: `drawing again without putting the first item back, so one fewer item is available on the second draw.` },
  ],
  methods: [
    {
      title: 'Worked coin and spinner tree',
      steps: [
        `Build the tree in words. Start with two branches for the coin: heads and tails. Split the heads branch into three branches, red, blue and green. Split the tails branch into the same three. Six paths in total.`,
        `Read the paths off in order, which is also the organized list: heads-red, heads-blue, heads-green, tails-red, tails-blue, tails-green. Six outcomes, and they are all equally likely because the coin is fair and the sections are equal.`,
        `Check that count with the counting principle: 2 coin outcomes times 3 spinner outcomes is 6. It matches the list, so nothing was missed.`,
        `Count the favorable outcomes. Exactly one path is heads-green, so P(heads and green) = 1/6.`,
        `Check by multiplying instead. The coin cannot affect the spinner, so these are independent: P(heads) times P(green) = 1/2 times 1/3 = 1/6. Same answer, so both methods hold.`,
        `One more from the same list: P(tails and not red) counts tails-blue and tails-green, which is 2 out of 6, so 1/3.`,
      ],
      example: { problem: `A coin is flipped and a spinner with 3 equal sections (red, blue, green) is spun. Find P(heads and green).`, solution: `P(heads and green) = 1/6, from 1 favorable path out of 6, and also from 1/2 times 1/3` },
      relatedLoIds: ['m7math.compound-events'],
    },
    {
      title: 'Worked with and without replacement',
      steps: [
        `Set up the bag: 5 + 3 = 8 marbles, so P(red) on the first draw is 5/8 either way. The first draw is the same in both stories.`,
        `WITH replacement: the marble goes back, so the second draw faces the same 5 red out of 8. Multiply: 5/8 times 5/8 = 25/64. As a decimal that is about 0.391, or about 39.1 percent.`,
        `WITHOUT replacement: the red marble stays out. Now 4 red marbles remain and only 7 marbles are left in the bag, so the second probability is 4/7.`,
        `Multiply: 5/8 times 4/7 = 20/56. Divide top and bottom by 4 to get 5/14, which is about 0.357, or about 35.7 percent.`,
        `Compare the two answers. Without replacement is smaller, and that makes sense: you used up one of the red marbles, so red is a little harder to hit the second time.`,
        `Name the slip to avoid. WRONG answer to avoid: 5/8 times 4/8 = 20/64 = 5/16, which drops a red marble from the top but forgets that the bag also got smaller. RIGHT answer: 5/8 times 4/7 = 5/14. If the marble is gone, it is gone from BOTH numbers.`,
      ],
      example: { problem: `A bag holds 5 red marbles and 3 blue marbles. Two marbles are drawn. Find P(both red) when the first marble IS put back, and when it is NOT put back.`, solution: `With replacement, 25/64 which is about 0.391; without replacement, 5/14 which is about 0.357` },
      relatedLoIds: ['m7math.compound-events'],
    },
  ],
  pointers: [
    { content: `Students often say "25/64" — The first marble never came back, so the second draw happens in a changed bag: 4 red marbles left out of 7 marbles left. The correct work is 5/8 times 4/7 = 20/56 = 5/14, which is about 0.357. Compare it with the with-replacement answer 25/64, about 0.391, and notice the without-replacement answer is smaller, exactly as it should be.`, kind: 'common-error' },
    { content: `Students often say "5/16, from 5/8 times 4/8" — A marble that is out of the bag is missing from the total as well as from its own color. If 4 red remain, then 4 red plus 3 blue is 7 marbles, so the second fraction is 4/7 and never 4/8. WRONG answer to avoid: 5/16. RIGHT answer: 5/14.`, kind: 'common-error' },
    { content: `A compound event still uses favorable over total; the work is in counting the sample space with an organized list, a table or a tree diagram.`, kind: 'tip' },
    { content: `The counting principle multiplies the choices at each stage: 6 faces times 6 faces is 36 outcomes, and 3 breads times 4 fillings times 2 sauces is 24 sandwiches.`, kind: 'tip' },
    { content: `Independent events multiply their probabilities: P(heads and green) = 1/2 times 1/3 = 1/6, which matches the list.`, kind: 'tip' },
    { content: `With replacement, the bag resets and both fractions stay the same: 5/8 times 5/8 = 25/64.`, kind: 'tip' },
    { content: `Without replacement, the numerator AND the denominator both drop: 5/8 times 4/7 = 5/14, never 4/8.`, kind: 'tip' },
    { content: `That is the end of Grade 7 Math. You began the year putting integers on a number line, and you are finishing it able to count every way something can happen and put a number on the chance of it. Well done.`, kind: 'tip' },
    { content: `Without replacement: BOTH numbers drop. 5 red of 8 → 4 red of **7**, never 4/8. If a marble is out of the bag, it's missing from the total too.`, kind: 'common-error' },
    { content: `Read the words "put it back" or "keeps it out" before you compute. Same bag, same numbers = with replacement. Missing item = without. The two setups give different answers (25/64 vs 5/14).`, kind: 'gotcha' },
    { content: `Add outcomes, don't add probabilities' denominators. For sandwiches it's 3 × 4 × 2 = 24, not 3 + 4 + 2 = 9. The counting principle MULTIPLIES the choices at each stage.`, kind: 'common-error' },
    { content: `"Independent" doesn't mean "unrelated topics" — it means the first event doesn't change the second's probability. A coin and a spinner are independent; two draws without replacement are DEPENDENT.`, kind: 'vocab-note' },
    { content: `On a two-cube table, count CELLS, not numbers. Sum of 7 happens in 6 cells (1-6, 2-5, 3-4, 4-3, 5-2, 6-1) out of 36, so 6/36 = 1/6. (4,3) and (3,4) are two different outcomes.`, kind: 'gotcha' },
    { content: `In a tree diagram, every first branch must split into ALL the second outcomes — heads gets red/blue/green and so does tails. Then check: number of paths should equal the counting-principle product.`, kind: 'tip' },
    { content: `Sanity check: without replacement should come out SMALLER than with replacement when you want the same color twice (5/14 ≈ 0.357 < 25/64 ≈ 0.391). If yours came out bigger, recheck the second fraction.`, kind: 'tip' },
    { content: `Watch questions that say the first draw already happened: "you drew green and kept it out — P(next is green)?" That's just ONE fraction (3/9 = 1/3), not a product. Don't multiply by the first draw again.`, kind: 'edge-case' },
  ],
};
