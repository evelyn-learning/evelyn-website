/**
 * Grade 7 Math — Statistics & Sampling: Comparing Two Populations.
 *
 * The payoff of the unit (CCSS 7.SP.B.3, 7.SP.B.4). Two groups are compared by
 * centers AND spread together: a difference in means counts as meaningful only
 * when it is large relative to the MAD of the groups. Deliberately informal —
 * no significance testing, no p-values, no formulas beyond dividing the gap by
 * the MAD. The two traps named here are bigger-mean-therefore-better, and
 * turning a statement about groups into a statement about every individual.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U9_COMPARING_TWO_POPULATIONS: LessonPlan = {
  id: 'evelyn.ms.m7math.comparing-two-populations.v1',
  title: 'Comparing Two Populations',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.comparing-two-populations',
      standard: 'M7MATH-9.4',
      description:
        'Compare two data sets informally using their measures of center together with their variability, judging a difference in means as meaningful only when it is large relative to the mean absolute deviation (CCSS 7.SP.B.3, 7.SP.B.4).',
    },
  ],
  prerequisites: ['m7math.measures-of-center-and-variability'],
  followUps: ['m7math.probability-of-simple-events'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the same size gap can be huge or meaningless depending on how much the data bounces.',
      script:
        'Two pizza places both promise fast delivery. Place A takes 22 minutes on average and Place B takes 32. Ten minutes is a lot of hungry waiting, and every single order you have ever placed backs that up. Now think about two basketball players. One averages 20 points a game and the other averages 22. Two points sounds like a real difference until you notice that both players swing wildly, scoring anywhere from 12 to 32 depending on the night. Two points disappears into that bouncing. Same idea both times: whether a gap matters depends on how much the numbers wobble on their own. Today we make that comparison with actual numbers.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-comparing-with-spread',
      kind: 'concept',
      goal: 'Build the informal grade-7 comparison: gap between means measured in MADs, plus overlap.',
      keyIdeas: [
        'COMPARE THE CENTERS FIRST — find the mean of each data set and subtract the smaller from the larger. That gap is the raw difference, and it is only half the story. A gap of 2 means nothing on its own until you know what a normal amount of wobble looks like in these groups.',
        'THE MAD IS THE MEASURING STICK — the mean absolute deviation says how far a typical value sits from its own group mean. If a group has a MAD of 5, then values bouncing 5 away from the mean are completely ordinary inside that group. So the MAD tells you how big a gap has to be before it stands out.',
        'DIVIDE THE GAP BY THE MAD — take the difference between the two means and divide it by the MAD. That answers the real question: how many typical wobbles apart are these two groups? A gap of 10 with a MAD of 2 gives 10 divided by 2, which is 5, so the groups sit 5 wobbles apart. A gap of 2 with a MAD of 5 gives 0.4, so the groups sit less than half a wobble apart.',
        'THE INFORMAL RULE — if the gap is about 2 MADs or more, the difference is meaningful and you will be able to see it in the data. If the gap is around 1 MAD or less, the two groups overlap so much that the difference is not convincing. In between, be cautious and say so. Use the same measures and the same units on both sets, or the comparison is meaningless.',
        'LOOK FOR OVERLAP AS A CHECK — line up the two sets of values and see how much they share. When groups are truly far apart, the highest value in one group can sit below the lowest value in the other. When the difference is weak, the two lists are tangled together. Overlap and the MAD calculation should agree; if they disagree, recheck the arithmetic.',
        'WHAT WE ARE NOT CLAIMING — this is an informal comparison, not a proof. It does not say WHY the groups differ, and it never says that every member of the higher group beats every member of the lower group. Group means describe groups. Individuals still overlap.',
      ],
      vocabulary: [
        { term: 'variability', definition: 'how spread out the values in a data set are, measured here by the mean absolute deviation.' },
        { term: 'overlap', definition: 'the range of values that both data sets share; heavy overlap means the groups are hard to tell apart.' },
      ],
      suggestedTools: ['show_table', 'show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pizza-delivery-meaningful',
      kind: 'worked_example',
      problem:
        'Six delivery times from Place A, in minutes: 18, 20, 22, 22, 24, 26. Six delivery times from Place B, in minutes: 28, 30, 32, 32, 34, 36. Compare the two places using center and spread.',
      steps: [
        'Mean for Place A: 18 plus 20 is 38, plus 22 is 60, plus 22 is 82, plus 24 is 106, plus 26 is 132. The sum is 132, and 132 divided by 6 is 22 minutes.',
        'MAD for Place A: distances from 22 are 4, 2, 0, 0, 2, 4. Those add to 12, and 12 divided by 6 is 2. So the MAD for Place A is 2 minutes.',
        'Mean for Place B: 28 plus 30 is 58, plus 32 is 90, plus 32 is 122, plus 34 is 156, plus 36 is 192. The sum is 192, and 192 divided by 6 is 32 minutes.',
        'MAD for Place B: distances from 32 are 4, 2, 0, 0, 2, 4. Those add to 12, and 12 divided by 6 is 2. The MAD for Place B is also 2 minutes.',
        'Gap between the centers: 32 minus 22 is 10 minutes. Now measure that gap in MADs: 10 divided by 2 is 5. The two groups sit 5 typical wobbles apart, far more than the 2 MADs we look for.',
        'Check with overlap. The slowest order from Place A took 26 minutes, and the fastest order from Place B took 28 minutes. The two lists do not overlap at all, which matches the calculation.',
        'So the difference is meaningful. Place A really is faster, by about 10 minutes, and that gap is 5 times the size of the ordinary wobble at either place.',
      ],
      answer:
        'Place A mean 22 minutes with MAD 2; Place B mean 32 minutes with MAD 2. The 10-minute gap is 5 MADs, so the difference is meaningful.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-players-not-meaningful',
      kind: 'worked_example',
      problem:
        'Points scored by Player A in six games: 12, 15, 18, 21, 24, 30. Points scored by Player B in six games: 14, 17, 20, 23, 26, 32. Is Player B really the higher scorer?',
      steps: [
        'Mean for Player A: 12 plus 15 is 27, plus 18 is 45, plus 21 is 66, plus 24 is 90, plus 30 is 120. The sum is 120, and 120 divided by 6 is 20 points.',
        'MAD for Player A: distances from 20 are 8, 5, 2, 1, 4, 10. Those add to 30, and 30 divided by 6 is 5. The MAD for Player A is 5 points.',
        'Mean for Player B: 14 plus 17 is 31, plus 20 is 51, plus 23 is 74, plus 26 is 100, plus 32 is 132. The sum is 132, and 132 divided by 6 is 22 points.',
        'MAD for Player B: distances from 22 are 8, 5, 2, 1, 4, 10. Those add to 30, and 30 divided by 6 is 5. The MAD for Player B is also 5 points.',
        'Gap between the centers: 22 minus 20 is 2 points. Measure it in MADs: 2 divided by 5 is 0.4. The two means sit less than half a typical wobble apart.',
        'Check with overlap. Player A scored from 12 to 30 and Player B scored from 14 to 32. Those ranges sit almost on top of each other, and Player A scored 30 in one game while Player B scored only 14 in another. Heavy overlap, exactly as the 0.4 predicted.',
        'So the honest conclusion is that these two players are about the same. WRONG answer to avoid: Player B is the better scorer because 22 is greater than 20. RIGHT answer: the 2-point gap is small compared with the 5-point wobble each player already has, so the data do not show a real difference.',
      ],
      answer:
        'Player A mean 20 with MAD 5; Player B mean 22 with MAD 5. The 2-point gap is only 0.4 of a MAD, so the difference is not meaningful.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-meaningful-difference',
      kind: 'try_yourself',
      problem:
        'Team Red does a mean of 30 sit-ups with a MAD of 2. Team Blue does a mean of 38 sit-ups with a MAD of 2. Which statement is best supported by these numbers?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The 8 sit-up gap is about 4 times the MAD of 2, so Team Blue really does do more sit-ups', correct: true },
        { id: 'b', text: 'The 8 sit-up gap is too small to mean anything' },
        { id: 'c', text: 'The two teams cannot be compared, because their MADs are the same' },
        { id: 'd', text: 'Every member of Team Blue does more sit-ups than every member of Team Red' },
      ],
      expectedAnswer: 'The 8 sit-up gap is about 4 times the MAD of 2, so Team Blue really does do more sit-ups',
      hints: [
        'Subtract the two means, then divide that gap by the MAD.',
        'A gap of about 2 MADs or more counts as meaningful. Here the gap is 8 and the MAD is 2, so how many MADs is that?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-weak-difference',
      kind: 'try_yourself',
      problem:
        'Group chat A sends a mean of 40 messages a day with a MAD of 12. Group chat B sends a mean of 45 messages a day with a MAD of 12. Which statement is best supported?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Group B clearly sends more messages, because 45 is greater than 40' },
        { id: 'b', text: 'The 5-message gap is less than half of the MAD of 12, so the two groups are about the same', correct: true },
        { id: 'c', text: 'The MADs are equal, so the two groups must send exactly the same number of messages' },
        { id: 'd', text: 'The gap of 5 is larger than the MAD of 12, so the difference is a big one' },
      ],
      expectedAnswer: 'The 5-message gap is less than half of the MAD of 12, so the two groups are about the same',
      hints: [
        'Find the gap between the means, then compare it with the MAD before you decide anything.',
        'The gap is 5 and the MAD is 12. Is 5 bigger or smaller than one whole wobble of 12?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-mads-apart',
      kind: 'try_yourself',
      problem:
        'The Owls score a mean of 24 points per game with a MAD of 3. The Hawks score a mean of 33 points per game with a MAD of 3. How many MADs apart are the two means? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'First find the gap between the two means by subtracting.',
        'The gap is 33 minus 24. Divide that gap by the MAD of 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-mean-wins',
      kind: 'misconception_check',
      question:
        'Class A has a mean spelling score of 82 and Class B has a mean of 80. Both classes have a MAD of 9. A student says Class A is better at spelling. What went wrong?',
      commonErrors: [
        {
          answer: 'Class A is better at spelling, because 82 is greater than 80.',
          misconception:
            'Comparing the two centers and stopping there, so the spread never gets used and any gap at all counts as a real difference.',
          correctsTo:
            'Look at the gap next to the wobble. The gap is 82 minus 80, which is 2. The MAD is 9, so a typical student is already 9 points away from their own class mean. Divide: 2 divided by 9 is about 0.2, so the two class means sit about one fifth of a wobble apart. That is far below the 2 MADs a meaningful difference needs. These two classes are about the same at spelling.',
        },
        {
          answer: 'Class A has the higher mean, so every student in Class A scored higher than every student in Class B.',
          misconception:
            'Turning a statement about group averages into a statement about every individual, as if a mean applied to each person separately.',
          correctsTo:
            'A mean describes a whole group, not any one member. With a MAD of 9 in both classes, plenty of Class B students scored above plenty of Class A students, and the two lists of scores overlap heavily. Even when a difference IS meaningful, such as a gap of 5 MADs, the correct sentence is about the groups on average, never about every single person.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Compare two data sets with center AND spread together. The gap between the means alone never settles the question.',
        'Measure the gap in MADs: subtract the two means, then divide by the MAD.',
        'A gap of about 2 MADs or more is a meaningful difference; a gap of about 1 MAD or less means the groups overlap too much to tell apart.',
        'Overlap is the visual check. Far-apart groups barely share values; weakly different groups have tangled lists.',
        'This comparison is informal. It describes groups on average, and it never claims that every member of one group beats every member of the other.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Comparing Two Populations' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
