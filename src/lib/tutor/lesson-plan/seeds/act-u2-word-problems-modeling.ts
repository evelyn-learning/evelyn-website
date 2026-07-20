/**
 * ACT — Math: Word Problems & Modeling.
 *
 * Word problems are woven through every ACT Math content area — the algebra
 * itself is rarely hard, but turning English into an equation under ~60
 * seconds/question is where points are lost. This lesson drills the
 * translation dictionary, the three classic setups (rate, work, mixture),
 * and the 60-second skip-and-return triage rule for when to cut losses.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_WORD_PROBLEMS_MODELING: LessonPlan = {
  id: 'evelyn.testprep.act.word-problems-modeling.v1',
  title: 'Word Problems & Modeling',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.word-problems-modeling',
      standard: 'ACT-2.12',
      description:
        'Translate ACT word problems into equations — including rate, work, and mixture setups — and apply a 60-second skip-and-return triage strategy to protect pacing.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe word problems as a translation speed test, not an algebra difficulty test, and set the pacing stakes.',
      script:
        'Word problems show up all over ACT Math — dressed up as rate, work, mixture, or plain algebra questions. The algebra underneath is rarely the hard part. At about 60 seconds a question, the real skill is turning English into an equation FAST. Today: a translation dictionary, the three classic setups, and the 60-second rule for when to cut your losses and move on.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-translation-and-setups',
      kind: 'concept',
      goal: 'The phrase-to-symbol dictionary, the reversal trap, the rate/work/mixture setups, and the 60-second triage rule.',
      keyIdeas: [
        'TRANSLATION DICTIONARY: "is / was / equals" → =; "of" → ×; "per," "each," "for every" → a rate (÷); "more than," "increased by," "sum" → +; "less than," "fewer than," "decreased by" → −.',
        'THE REVERSAL TRAP: "A less than B" means B − A, NOT A − B. English word order and algebraic order are flipped — always rewrite the phrase backwards before you write the equation.',
        'DEFINE THE VARIABLE FIRST. Write "let x = ___" in words before touching the equation. Most word-problem misses come from a bad setup, not bad algebra.',
        'RATE: distance = rate × time (d = rt). Moving toward each other → ADD the two rates. Same direction, one catching up to the other → SUBTRACT the rates.',
        'WORK: convert "time to finish alone" into a RATE (job per hour, i.e. 1/time). Combined rate = sum of the individual rates. NEVER average the two times directly.',
        'MIXTURE: total amount of the substance = (amount × concentration) for each part, summed, then divided by the total volume. A straight average of two percentages is a trap unless the volumes happen to be equal.',
        'THE 60-SECOND TRIAGE: if you don\'t see a clear path to an equation within about 60 seconds, mark the question, pick your best guess letter, and move on. Return to it only after finishing the rest of the section — rescuing one hard word problem isn\'t worth three easy questions lost to the clock.',
      ],
      vocabulary: [
        { term: 'rate', definition: 'a ratio of two quantities with different units, e.g. miles per hour or jobs per hour — the backbone of both distance and work problems.' },
        { term: 'combined rate', definition: 'the sum (working together / closing a gap) or difference (catching up) of two individual rates — never the average of two times.' },
        { term: 'concentration', definition: 'the fraction (or percent) of a mixture that is the substance of interest; amount of substance = concentration × volume.' },
        { term: 'triage (60-second rule)', definition: 'the ACT pacing habit of abandoning a question that hasn\'t yielded a clear equation within ~60 seconds, marking it, and returning only after finishing easier questions.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rate-typical',
      kind: 'worked_example',
      problem:
        'Two trains leave stations 300 miles apart at the same time, traveling toward each other. Train A travels at 40 mph and Train B travels at 60 mph. In how many hours will they meet?',
      steps: [
        'Define the variable in words: let t = hours until the trains meet.',
        'Translate "traveling toward each other" — their combined rate closes the gap, so ADD the two rates: 40 + 60 = 100 mph.',
        'Apply d = rt with the COMBINED rate and the FULL 300-mile gap: 300 = 100t.',
        'Solve: t = 300 / 100 = 3.',
      ],
      answer: '3 hours',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-work-trap',
      kind: 'worked_example',
      problem:
        'Pipe A can fill a pool in 4 hours working alone. Pipe B can fill the same pool in 12 hours working alone. If both pipes run together, how long will it take to fill the pool?',
      steps: [
        'TRAP: it\'s tempting to average the two times — (4 + 12) / 2 = 8 hours. This is WRONG; times don\'t average, rates do.',
        'Convert each time to a RATE (pool per hour): Pipe A = 1/4 pool/hr, Pipe B = 1/12 pool/hr.',
        'Add the rates for working together: 1/4 + 1/12 = 3/12 + 1/12 = 4/12 = 1/3 pool/hr.',
        'Take the reciprocal of the combined rate to get time: 1 ÷ (1/3) = 3 hours.',
      ],
      answer: '3 hours (NOT the naive average of 8 hours)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-translation-reversal',
      kind: 'try_yourself',
      problem: 'Six less than four times a number is 18. What is the number?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6', correct: true },
        { id: 'b', text: '-3' },
        { id: 'c', text: '3' },
        { id: 'd', text: '24' },
      ],
      expectedAnswer: '6',
      hints: [
        'Translate right-to-left: "six less than four times a number" = 4x − 6, not 6 − 4x.',
        'Set 4x − 6 = 18 and solve for x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mixture-concentration',
      kind: 'try_yourself',
      problem:
        'A chemist mixes 10 liters of a 20% acid solution with 5 liters of a 50% acid solution. What is the concentration of the resulting 15-liter mixture?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '35%' },
        { id: 'b', text: '30%', correct: true },
        { id: 'c', text: '25%' },
        { id: 'd', text: '45%' },
      ],
      expectedAnswer: '30%',
      hints: [
        'Find the total amount of pure acid first: (10 × 0.20) + (5 × 0.50).',
        'Divide the total acid by the total volume, 15 L — don\'t just average 20% and 50%.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-work-numeric',
      kind: 'try_yourself',
      problem:
        'Type your answer: Ana can complete a landscaping job alone in 6 hours. Working together with Ben, they finish the same job in 4 hours. How many hours would it take Ben to complete the job alone?',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'Combined rate = Ana\'s rate + Ben\'s rate: 1/6 + 1/b = 1/4.',
        'Solve for 1/b, then take the reciprocal to find b.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-less-than-reversal',
      kind: 'misconception_check',
      question: 'A student translates "12 less than a number x" as the equation 12 − x. Where does this go wrong, and what should it be?',
      commonErrors: [
        {
          answer: '12 − x',
          misconception: 'Translating the phrase in the same left-to-right order it\'s read, instead of tracking which quantity is subtracted FROM which.',
          correctsTo:
            '"A less than B" always means B − A. The word order in English (A, then B) is the REVERSE of the algebraic order. So "12 less than x" = x − 12, not 12 − x. Test it by plugging in a number: if x = 20, "12 less than 20" is obviously 8, and 20 − 12 = 8 while 12 − 20 = −8.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Define your variable in words before writing any equation — most word-problem points are lost to bad setup, not bad algebra.',
        '"Less than" / "fewer than" reverses order: "A less than B" = B − A.',
        'Combine WORK RATES (1/time), never average raw times; add or subtract RATES for toward/catching-up rate problems.',
        'The 60-second triage: no clear equation within ~60 seconds means mark it, guess, and come back after the easier questions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.12', cedTitle: 'Word Problems & Modeling' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
