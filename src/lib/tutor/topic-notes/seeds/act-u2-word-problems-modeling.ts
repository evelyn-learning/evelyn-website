/**
 * ACT — Unit 2 CED 2.12: Word Problems & Modeling.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.word-problems-modeling.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_WORD_PROBLEMS_MODELING: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.word-problems-modeling.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.12',
  cedTitle: 'Word Problems & Modeling',
  planId: 'evelyn.testprep.act.word-problems-modeling.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.word-problems-modeling.v1' }],
  theory: [
    { loId: 'act.word-problems-modeling', content: `TRANSLATION DICTIONARY: "is / was / equals" → =; "of" → ×; "per," "each," "for every" → a rate (÷); "more than," "increased by," "sum" → +; "less than," "fewer than," "decreased by" → −.` },
    { loId: 'act.word-problems-modeling', content: `THE REVERSAL TRAP: "A less than B" means B − A, NOT A − B. English word order and algebraic order are flipped — always rewrite the phrase backwards before you write the equation.` },
    { loId: 'act.word-problems-modeling', content: `DEFINE THE VARIABLE FIRST. Write "let x = ___" in words before touching the equation. Most word-problem misses come from a bad setup, not bad algebra.` },
    { loId: 'act.word-problems-modeling', content: `RATE: distance = rate × time (d = rt). Moving toward each other → ADD the two rates. Same direction, one catching up to the other → SUBTRACT the rates.` },
    { loId: 'act.word-problems-modeling', content: `WORK: convert "time to finish alone" into a RATE (job per hour, i.e. 1/time). Combined rate = sum of the individual rates. NEVER average the two times directly.` },
    { loId: 'act.word-problems-modeling', content: `MIXTURE: total amount of the substance = (amount × concentration) for each part, summed, then divided by the total volume. A straight average of two percentages is a trap unless the volumes happen to be equal.` },
    { loId: 'act.word-problems-modeling', content: `THE 60-SECOND TRIAGE: if you don't see a clear path to an equation within about 60 seconds, mark the question, pick your best guess letter, and move on. Return to it only after finishing the rest of the section — rescuing one hard word problem isn't worth three easy questions lost to the clock.` },
    { loId: 'act.word-problems-modeling', kind: 'definition', title: 'rate', content: `a ratio of two quantities with different units, e.g. miles per hour or jobs per hour — the backbone of both distance and work problems.` },
    { loId: 'act.word-problems-modeling', kind: 'definition', title: 'combined rate', content: `the sum (working together / closing a gap) or difference (catching up) of two individual rates — never the average of two times.` },
    { loId: 'act.word-problems-modeling', kind: 'definition', title: 'concentration', content: `the fraction (or percent) of a mixture that is the substance of interest; amount of substance = concentration × volume.` },
    { loId: 'act.word-problems-modeling', kind: 'definition', title: 'triage (60-second rule)', content: `the ACT pacing habit of abandoning a question that hasn't yielded a clear equation within ~60 seconds, marking it, and returning only after finishing easier questions.` },
  ],
  methods: [
    {
      title: 'Worked rate typical',
      steps: [
        'Define the variable in words: let t = hours until the trains meet.',
        `Translate "traveling toward each other" — their combined rate closes the gap, so ADD the two rates: 40 + 60 = 100 mph.`,
        'Apply d = rt with the COMBINED rate and the FULL 300-mile gap: 300 = 100t.',
        'Solve: t = 300 / 100 = 3.',
      ],
      example: { problem: `Two trains leave stations 300 miles apart at the same time, traveling toward each other. Train A travels at 40 mph and Train B travels at 60 mph. In how many hours will they meet?`, solution: '3 hours' },
      relatedLoIds: ['act.word-problems-modeling'],
    },
    {
      title: 'Worked work trap',
      steps: [
        `TRAP: it's tempting to average the two times — (4 + 12) / 2 = 8 hours. This is WRONG; times don't average, rates do.`,
        `Convert each time to a RATE (pool per hour): Pipe A = 1/4 pool/hr, Pipe B = 1/12 pool/hr.`,
        `Add the rates for working together: 1/4 + 1/12 = 3/12 + 1/12 = 4/12 = 1/3 pool/hr.`,
        'Take the reciprocal of the combined rate to get time: 1 ÷ (1/3) = 3 hours.',
      ],
      example: { problem: `Pipe A can fill a pool in 4 hours working alone. Pipe B can fill the same pool in 12 hours working alone. If both pipes run together, how long will it take to fill the pool?`, solution: '3 hours (NOT the naive average of 8 hours)' },
      relatedLoIds: ['act.word-problems-modeling'],
    },
  ],
  pointers: [
    { content: `"A less than B" always means B − A. The word order in English (A, then B) is the REVERSE of the algebraic order. So "12 less than x" = x − 12, not 12 − x. Test it by plugging in a number: if x = 20, "12 less than 20" is obviously 8, and 20 − 12 = 8 while 12 − 20 = −8.`, kind: 'common-error' },
    { content: `Define your variable in words before writing any equation — most word-problem points are lost to bad setup, not bad algebra.`, kind: 'tip' },
    { content: '"Less than" / "fewer than" reverses order: "A less than B" = B − A.', kind: 'tip' },
    { content: `Combine WORK RATES (1/time), never average raw times; add or subtract RATES for toward/catching-up rate problems.`, kind: 'tip' },
    { content: `The 60-second triage: no clear equation within ~60 seconds means mark it, guess, and come back after the easier questions.`, kind: 'tip' },
    { content: `**Answer the question asked.** ACT word problems love solving for x but asking for "2x + 5," "the larger number," or "Ben's time alone." Circle the final phrase before you start, and re-read it after you solve. The value of x is almost always a wrong answer choice.`, kind: 'gotcha' },
    { content: `"Less than" reverses order, but "less" / "is less than" does NOT. "5 less than x" = x − 5; "x is less than 5" = x < 5. Also "decreased by 5" = x − 5 in reading order. Only the *than* comparison phrases flip.`, kind: 'vocab-note' },
    { content: `Check units before plugging into d = rt. If the rate is in mph and the time is given in minutes (or "90 minutes," "40 seconds"), convert first. The ACT plants the unconverted answer as a choice.`, kind: 'common-error' },
    { content: `In work problems, "together in 4 hours" is a rate too: 1/4 job/hr. Set 1/6 + 1/B = 1/4 and solve for 1/B, then flip. Don't subtract times (6 − 4 = 2 is a trap answer).`, kind: 'edge-case' },
    { content: `Mixture: pure water is 0% and pure acid is 100% — they still count as terms in the equation. "How much pure water must be added?" → 0·x in the numerator but x still increases the total volume in the denominator.`, kind: 'edge-case' },
    { content: `Backsolving beats algebra on many word problems: plug answer choices (start with B or C, since choices are ordered) into the sentence itself. If setup hasn't clicked in 30 seconds and the choices are plain numbers, test them.`, kind: 'tip' },
    { content: `When you triage, always fill in a bubble immediately — the ACT has no wrong-answer penalty and blanks left for "later" get forgotten. Use one consistent guess letter so a skipped question never shifts your grid.`, kind: 'tip' },
    { content: `"Consecutive integers" = x, x+1, x+2; "consecutive EVEN (or odd) integers" = x, x+2, x+4 — not x, x+1. Same +2 spacing for both even and odd.`, kind: 'vocab-note' },
  ],
};
