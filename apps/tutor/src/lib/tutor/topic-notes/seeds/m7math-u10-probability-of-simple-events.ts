/**
 * Grade 7 Math — Unit 10 CED 10.1: Probability of Simple Events.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.probability-of-simple-events.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U10_PROBABILITY_OF_SIMPLE_EVENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.probability-of-simple-events.v1',
  course: 'Grade 7 Math',
  cedUnit: 10,
  cedTopic: '10.1',
  cedTitle: 'Probability of Simple Events',
  planId: 'evelyn.ms.m7math.probability-of-simple-events.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.probability-of-simple-events.v1' }],
  theory: [
    { loId: 'm7math.probability-of-simple-events', kind: 'framework', title: 'Probability counts outcomes', content: `PROBABILITY COUNTS OUTCOMES — an outcome is one thing that can happen, and the sample space is the full list of them. An event is the group of outcomes you care about. When every outcome is equally likely, P(event) = number of favorable outcomes divided by number of total outcomes. On a fair number cube the sample space is 1, 2, 3, 4, 5, 6, so P(rolling a 4) = 1/6.` },
    { loId: 'm7math.probability-of-simple-events', kind: 'framework', title: 'The scale runs from 0 to 1', content: `THE SCALE RUNS FROM 0 TO 1 — a probability can never be negative and can never be bigger than 1, because the favorable outcomes are always part of the total. P = 0 means impossible, like rolling a 9 on a number cube. P = 1 means certain, like rolling a number less than 7. P = 1/2 means the event happens about half the time. If your answer comes out as 5/3 or as −0.2, you have made a mistake somewhere, no exceptions.` },
    { loId: 'm7math.probability-of-simple-events', kind: 'framework', title: 'The denominator is the total, not the leftovers', content: `THE DENOMINATOR IS THE TOTAL, NOT THE LEFTOVERS — in a bag of 3 red and 5 blue counters, P(red) = 3/8, because there are 8 counters in all. Writing 3/5 compares red to blue instead of red to everything. Always count the whole sample space for the bottom number.` },
    { loId: 'm7math.probability-of-simple-events', kind: 'framework', title: 'One probability, three outfits', content: `ONE PROBABILITY, THREE OUTFITS — the same number can be written as a fraction, a decimal or a percent, exactly the way you converted them back in Unit 1.4. Divide the fraction to get the decimal, then multiply by 100 to get the percent: 1/4 = 0.25 = 25 percent. Keep the fraction in lowest terms, and pick whichever form makes the answer easiest to talk about.` },
    { loId: 'm7math.probability-of-simple-events', kind: 'framework', title: 'The complement is everything else', content: `THE COMPLEMENT IS EVERYTHING ELSE — the complement of an event is the event NOT happening, and together they cover the whole sample space. So P(not A) = 1 − P(A). If P(rain) = 0.3, then P(no rain) = 1 − 0.3 = 0.7. This is a shortcut worth having: counting what you do not want is often faster than counting what you do.` },
    { loId: 'm7math.probability-of-simple-events', kind: 'framework', title: 'Equally likely is a condition, not a freebie', content: `EQUALLY LIKELY IS A CONDITION, NOT A FREEBIE — the favorable-over-total formula only works when each outcome has the same chance. Six equal sections on a spinner qualifies. A spinner with one huge section and one sliver does not, even though it still has two outcomes. Check for equal chances BEFORE you divide.` },
    { loId: 'm7math.probability-of-simple-events', kind: 'definition', title: 'outcome', content: 'one single result that a chance experiment can produce, such as landing on blue.' },
    { loId: 'm7math.probability-of-simple-events', kind: 'definition', title: 'sample space', content: 'the list of every possible outcome of the experiment.' },
    { loId: 'm7math.probability-of-simple-events', kind: 'definition', title: 'event', content: `the outcome or group of outcomes you are asking about, such as rolling an even number.` },
    { loId: 'm7math.probability-of-simple-events', kind: 'definition', title: 'complement', content: `the event not happening; its probability is 1 minus the probability of the event.` },
  ],
  methods: [
    {
      title: 'Worked spinner three forms',
      steps: [
        `Check the sample space first. The sections are equal in size, so every section is equally likely, and 3 + 2 + 2 + 1 = 8 sections in all. The total is 8.`,
        `Count the favorable outcomes. Two of the sections are green, so the favorable count is 2.`,
        `Divide: P(green) = 2/8. In lowest terms that is 1/4, because 2 and 8 share a factor of 2.`,
        'Turn the fraction into a decimal by dividing: 1 divided by 4 is 0.25.',
        `Turn the decimal into a percent by multiplying by 100: 0.25 becomes 25 percent. So P(green) = 1/4 = 0.25 = 25 percent, three names for one number.`,
        `Sanity check the scale. 1/4 sits between 0 and 1, and green really does cover a quarter of the spinner, so the answer is believable.`,
      ],
      example: { problem: `A spinner is split into 8 equal sections: 3 red, 2 blue, 2 green, 1 yellow. Find P(green) as a fraction, a decimal and a percent.`, solution: 'P(green) = 1/4 = 0.25 = 25 percent' },
      relatedLoIds: ['m7math.probability-of-simple-events'],
    },
    {
      title: 'Worked complement marbles',
      steps: [
        `Total outcomes: 8 + 7 + 5 = 20 marbles, and each marble is equally likely to be picked.`,
        `P(red) = 8/20. Divide top and bottom by 4 to get 2/5. As a decimal, 2 divided by 5 is 0.4, which is 40 percent.`,
        `Now the complement. P(not red) = 1 − P(red) = 1 − 2/5 = 3/5, which is 0.6, or 60 percent.`,
        `Check it the long way by counting instead. Not red means blue or green: 7 + 5 = 12 marbles, so 12/20 = 3/5. Same answer, so the complement rule did its job.`,
        `Check the two probabilities add up: 0.4 + 0.6 = 1. An event and its complement always add to 1, because between them they cover every marble in the bag.`,
      ],
      example: { problem: `A bag holds 20 marbles: 8 red, 7 blue and 5 green. One marble is picked without looking. Find P(red) and P(not red).`, solution: 'P(red) = 2/5 = 0.4 = 40 percent; P(not red) = 3/5 = 0.6 = 60 percent' },
      relatedLoIds: ['m7math.probability-of-simple-events'],
    },
  ],
  pointers: [
    { content: `Students often say "1/2" — Count the equal sections instead. There are 8 equally likely sections and 3 of them are red, so P(red) = 3/8 = 0.375, which is 37.5 percent. That is less than half. WRONG answer to avoid: 1/2. RIGHT answer: 3/8. Red and not-red are two outcomes, but they are not the same size, so the formula must count sections, not possibilities.`, kind: 'common-error' },
    { content: `Students often say "3/5" — The denominator is always the total sample space. There are 8 sections in all, not 5, so P(red) = 3/8 and not 3/5. A quick guard: the numerator must be part of the denominator, so 5 can never be the bottom number when 3 red plus 5 other makes 8.`, kind: 'common-error' },
    { content: `When outcomes are equally likely, P(event) = favorable outcomes divided by total outcomes.`, kind: 'tip' },
    { content: `The denominator is the whole sample space, so 3 red out of 3 red and 5 blue gives 3/8, never 3/5.`, kind: 'tip' },
    { content: `Probability never leaves the 0-to-1 scale: 0 is impossible, 1 is certain, and 5/3 or −0.2 means a mistake.`, kind: 'tip' },
    { content: `The same probability has three forms, just like Unit 1.4: 1/4 = 0.25 = 25 percent.`, kind: 'tip' },
    { content: 'The complement rule says P(not A) = 1 − P(A), and the two always add up to 1.', kind: 'tip' },
    { content: `The bottom number is the TOTAL, not the leftovers. With 3 red and 5 blue, P(red) = 3/8, never 3/5. Quick guard: the numerator must be counted inside the denominator.`, kind: 'common-error' },
    { content: `Two possible results does NOT mean 50-50. "It lands on red or it doesn't" only splits evenly if both sides are the same size. On an 8-section spinner with 3 red, P(red) = 3/8, not 1/2.`, kind: 'gotcha' },
    { content: `Check "equally likely" BEFORE you divide. Equal-size spinner sections, fair cube faces, identical marbles: fine. One giant section and one sliver: the favorable-over-total formula does not apply.`, kind: 'edge-case' },
    { content: `Answers must land between 0 and 1 (or 0% and 100%). If you get 5/3, 1.4, or −0.2, stop and recount — you probably used the wrong total or subtracted backwards.`, kind: 'tip' },
    { content: `Use the words precisely: an **outcome** is one single result, the **sample space** is the full list, and an **event** is the group you're asking about. "Rolling an even number" is one event made of three outcomes.`, kind: 'vocab-note' },
    { content: `For the complement, subtract from 1 — not from the total count. If P(red) = 8/20, then P(not red) = 1 − 8/20, not 20 − 8. Check: P(A) + P(not A) must equal 1.`, kind: 'common-error' },
    { content: `Match the form the question asks for. "As a decimal" means 0.6, not 3/5 or 60%. Divide top by bottom for the decimal, then multiply by 100 for the percent — and keep the % sign.`, kind: 'tip' },
    { content: `P = 0 means impossible (rolling a 9 on a number cube) and P = 1 means certain (rolling less than 7). Neither is a mistake — but P(getting one of something) is only 1 if that outcome covers the whole sample space.`, kind: 'edge-case' },
  ],
};
