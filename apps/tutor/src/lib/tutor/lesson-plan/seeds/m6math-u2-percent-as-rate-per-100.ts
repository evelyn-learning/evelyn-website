/**
 * Grade 6 Math — Percent & Measurement Conversion: Percent as a Rate per 100.
 *
 * CONCEPT-LED. The opening row of Unit 2, and the whole unit rests on the one
 * idea this lesson installs: a percent is not a special kind of number, it is
 * a fraction that has already agreed to use 100 as its denominator (CCSS
 * 6.RP.A.3c). Once that is solid, sliding between percent, fraction and
 * decimal form is just re-writing the same rate three different ways. Two
 * traps this plan is built to kill: sliding the decimal point only one place
 * instead of two (7% becomes 0.7 instead of 0.07), and treating the percent
 * sign as a label that can be stuck onto a decimal without changing the
 * number (0.5 becomes "0.5%" instead of 50%).
 *
 * SCOPE GUARD: This lesson teaches percent as a rate per 100 and how to
 * convert a percent into its fraction and decimal forms, and back. It never
 * multiplies a percent by a quantity to find a part of that quantity —
 * finding the percent OF a quantity is row 2.2, and finding the whole given a
 * part and a percent is row 2.3; neither computation appears here. It never
 * touches a percent APPLICATION — tax, tip, discount, markup, percent
 * increase or decrease, and simple interest are all Grade 7 (m7math Unit 4)
 * and do not appear. Every percent in this plan converts to a TERMINATING
 * decimal, reached by ratio reasoning (scaling a fraction to a denominator of
 * 100, or sliding the decimal point) rather than long division; the fuller
 * fraction-decimal-percent apparatus, including repeating decimals, is Grade
 * 7 (m7math 1.4) and is not used here.
 *
 * NOTE ON prerequisites/followUps: the fan-out contract for this wave has all
 * 40 rows registered together in one controller commit, so this row's real
 * chain (1.4 -> 2.1 -> 2.2) is populated below even though rows 1.4 and 2.2
 * are authored by sibling agents and do not yet exist on disk.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U2_PERCENT_AS_RATE_PER_100: LessonPlan = {
  id: 'evelyn.ms.m6math.percent-as-rate-per-100.v1',
  title: 'Percent as a Rate per 100',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.percent-as-rate-per-100',
      standard: 'M6MATH-2.1',
      description:
        'Understand percent as a rate per 100, and convert fluently between a percent, its fraction form, and its decimal form (CCSS 6.RP.A.3c).',
    },
  ],
  prerequisites: ['m6math.unit-rates-and-unit-pricing'],
  followUps: ['m6math.finding-the-percent-of-a-quantity'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student notice that a percent already names a fraction, before any rule is taught.',
      script:
        'You are downloading an update for your favorite game. The screen shows a loading bar and the number 60%. What does that 60 actually mean? It does not mean 60 minutes, and it does not mean 60 megabytes. It means the download is 60 out of every 100 equal parts finished. That is what the word percent has meant this whole time: a rate that always compares to 100 equal parts, no matter what is being measured. Today we learn to read a percent that way, and to rewrite it as a fraction or a decimal without losing what it means.',
      suggestedTools: ['show_fraction_bar'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-percent-is-per-hundred',
      kind: 'concept',
      goal: 'Install percent as a fraction over 100, and drill the two-place decimal slide in both directions.',
      keyIdeas: [
        'PERCENT MEANS "PER HUNDRED" — the word percent always compares a number to 100 equal parts. 60% means 60 out of every 100 equal parts, whether those parts are a download bar, a bag of marbles, or a whole class of students.',
        'A PERCENT IS ALREADY A FRACTION OVER 100 — drop the % sign and write the number over 100: 60% = 60/100. The percent sign is just a shortcut for "out of 100"; writing the sign and writing /100 say the exact same thing.',
        'SIMPLIFY THE FRACTION IF ASKED, BUT THE RATE DOES NOT CHANGE — 60/100 simplifies to 3/5 by dividing the top and the bottom by 20, their greatest common factor. 60% and 3/5 name the exact same rate; only the way it is written has changed.',
        'PERCENT TO DECIMAL: DIVIDE BY 100, SO THE POINT SLIDES TWO PLACES LEFT — dividing by 100 always slides a decimal point two places to the left. Write 60% as 60. first so both places are visible, then slide: 60. becomes 0.60, which is written 0.6. A small percent needs a placeholder zero: 7% is 07. first, then 0.07.',
        'DECIMAL TO PERCENT: MULTIPLY BY 100, SO THE POINT SLIDES TWO PLACES RIGHT — the opposite move. 0.6 becomes 60., so 0.6 = 60%. Check every slide against something you already know: half of a whole is 0.5 and 50%, so if a rule ever turns 0.5 into 5%, the slide went the wrong number of places.',
        'A HUNDREDTHS GRID MAKES THE RATE VISIBLE — picture a square split into 100 identical smaller squares. Shading 60 of them shows 60% at a glance, and that same shaded picture is also 60/100 and 0.60 — three names, one picture.',
      ],
      vocabulary: [
        { term: 'percent', definition: 'a rate that always compares a number to 100 equal parts; the % sign is shorthand for "out of 100."' },
        { term: 'equivalent forms', definition: 'a percent, a fraction, and a decimal that name the exact same rate, such as 60%, 3/5, and 0.6.' },
        { term: 'hundredths grid', definition: 'a square split into 100 identical smaller squares, used to picture a percent by shading that many squares.' },
        { term: 'simplest form', definition: 'a fraction written with the smallest possible whole numbers on top and bottom, found by dividing both by their greatest common factor.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-download-bar',
      kind: 'worked_example',
      problem: 'The loading bar for a game update shows 60%. Write 60% as a fraction in simplest form and as a decimal.',
      steps: [
        'Percent means per hundred, so write 60% as a fraction with 100 on the bottom: 60/100.',
        'Find the greatest common factor of 60 and 100 to simplify. Both divide evenly by 20: 60 ÷ 20 = 3, and 100 ÷ 20 = 5. So 60/100 = 3/5.',
        'Check the simplification by scaling back up: 3/5 × 20/20 = 60/100, which matches where you started.',
        'To write 60% as a decimal, divide by 100, sliding the decimal point two places left: 60. becomes 0.60, which is written 0.6.',
        'Check by converting back: 0.6 × 100 = 60, and 60 written with a % sign is 60%. That matches the loading bar you started with.',
      ],
      answer: '3/5 and 0.6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-quarter-of-the-class',
      kind: 'worked_example',
      problem: 'In one class at school, 1/4 of the students play a musical instrument. Write 1/4 as a percent and as a decimal.',
      steps: [
        'To turn a fraction into a percent, look for a number that scales the denominator up to 100. 4 × 25 = 100, so multiply the top and the bottom by 25.',
        '1 × 25 = 25, and 4 × 25 = 100, so 1/4 = 25/100.',
        'A fraction with 100 on the bottom already tells you the percent directly: 25/100 = 25%.',
        'WRONG: writing 1/4 as 1% because the numerator is 1. CORRECT: a percent compares to the whole fraction, not just the top number, so the fraction must be scaled until the denominator is 100 before you can read off the percent. That gives 25%, not 1%.',
        'To find the decimal, divide the percent by 100, sliding the point two places left: 25% becomes 0.25.',
        'Check by scaling back down: 25/100 divided by 25 on top and bottom is 1/4, which is exactly the fraction you started with, and 0.25 × 100 = 25 confirms the percent too.',
      ],
      answer: '25% and 0.25',
      estimatedMinutes: 3,
    },
    {
      id: 'try-simplify-forty-percent',
      kind: 'try_yourself',
      problem: 'Write 40% as a fraction in simplest form.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '40/100' },
        { id: 'b', text: '2/5', correct: true },
        { id: 'c', text: '20/50' },
        { id: 'd', text: '4/5' },
      ],
      expectedAnswer: '2/5',
      hints: [
        'Percent means per hundred, so start by writing 40% as 40/100.',
        'Find the GREATEST common factor of 40 and 100 — it is 20, not 2 or 10 — and divide both the top and the bottom by that same number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-eight-percent-as-decimal',
      kind: 'try_yourself',
      problem: 'Which decimal is equal to 8%?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.8' },
        { id: 'b', text: '0.08', correct: true },
        { id: 'c', text: '8.0' },
        { id: 'd', text: '0.008' },
      ],
      expectedAnswer: '0.08',
      hints: [
        'Percent to decimal means divide by 100, which always slides the decimal point two places, not one.',
        'Write 8% as 08. first so both places are visible, then slide the point two places left: 08. becomes 0.08.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-three-twentieths-as-percent',
      kind: 'try_yourself',
      problem: 'Write 3/20 as a percent. Type just the number, without the percent sign.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        'Look for a number that scales the denominator 20 up to 100. 20 × 5 = 100, so multiply the top and the bottom by 5.',
        '3 × 5 = 15, and 20 × 5 = 100, so 3/20 = 15/100. A fraction over 100 tells you the percent directly.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-decimal-slide-and-percent-label',
      kind: 'misconception_check',
      question:
        'A student is asked to write 7% as a decimal and writes 0.7. Another student is asked to write 0.5 as a percent and writes 0.5%. What went wrong in each case?',
      commonErrors: [
        {
          answer: '0.7',
          misconception: 'Sliding the decimal point only one place instead of two, so the hidden placeholder zero in 07 gets lost.',
          correctsTo:
            'Percent to decimal always divides by 100, which slides the point two places left. Write 7% as 07. first so both places are visible, then slide twice: 07. becomes 0.07. Check the size: 7% is a small slice, much less than one tenth, and 0.07 is small too, while 0.7 is nearly a whole. Whenever the size check fails, the slide went the wrong number of places.',
        },
        {
          answer: '0.5%',
          misconception: 'Treating the percent sign as a label that can be stuck onto a decimal without changing the number, instead of multiplying by 100 first.',
          correctsTo:
            'Decimal to percent means multiply by 100, which slides the point two places right: 0.5 becomes 0.50, then 50., so 0.5 = 50%. The percent sign changes what the digits count, hundredths instead of ones, so it cannot simply be added on. 0.5% would mean only five-tenths of one percent, a much smaller rate than 0.5 itself.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Percent means per hundred: a percent always compares a number to 100 equal parts.',
        'A percent is already a fraction over 100: 60% = 60/100, which simplifies to 3/5.',
        'Percent to decimal: divide by 100 and slide the decimal point two places LEFT, using a placeholder zero for small percents, such as 7% = 0.07.',
        'Decimal to percent: multiply by 100 and slide the decimal point two places RIGHT, so 0.6 = 60%.',
        'To turn a fraction into a percent, scale it so the denominator becomes 100, then read the numerator as the percent: 1/4 = 25/100 = 25%.',
        'A hundredths grid shows all three forms in one picture: shading 60 of 100 squares is 60%, 60/100, and 0.60 at once.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Percent as a Rate per 100' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
