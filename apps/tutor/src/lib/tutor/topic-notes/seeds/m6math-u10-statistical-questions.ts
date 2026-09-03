/**
 * Grade 6 Math — Unit 10 CED 10.1: Statistical Questions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.statistical-questions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U10_STATISTICAL_QUESTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.statistical-questions.v1',
  course: 'Grade 6 Math',
  cedUnit: 10,
  cedTopic: '10.1',
  cedTitle: 'Statistical Questions',
  planId: 'evelyn.ms.m6math.statistical-questions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.statistical-questions.v1' }],
  theory: [
    { loId: 'm6math.statistical-questions', kind: 'framework', title: 'The variability test', content: `THE VARIABILITY TEST — a statistical question is a question that anticipates variability, which means you expect the answers to differ before you ever collect them. To test any question, ask yourself: if this question were actually asked and the answers were collected, would they come back the same every time, or would they differ from person to person, object to object, or time to time?` },
    { loId: 'm6math.statistical-questions', kind: 'framework', title: 'One answer means not statistical', content: `ONE ANSWER MEANS NOT STATISTICAL — "How tall is our team captain?" names one specific person, so it has exactly one correct answer. There is no variability to anticipate, so this is not a statistical question, no matter how it is worded.` },
    { loId: 'm6math.statistical-questions', kind: 'framework', title: 'Many different answers means statistical', content: `MANY DIFFERENT ANSWERS MEANS STATISTICAL — "How tall are the players on our team?" is asked of every player separately, and different players have different heights. Before a single measurement is taken, you already expect the answers to differ. That expectation of different answers is exactly what makes a question statistical.` },
    { loId: 'm6math.statistical-questions', kind: 'framework', title: 'Mentioning a group is not enough by itself', content: `MENTIONING A GROUP IS NOT ENOUGH BY ITSELF — a question can talk about a huge group of people and still not be statistical, if it only ever produces ONE number for that whole group. "How many students are in my school this year?" mentions every student in the school, but it still has just one correct total. A question becomes statistical only when EACH member of the group can give a separate, possibly different, answer.` },
    { loId: 'm6math.statistical-questions', kind: 'framework', title: 'Write your own by changing who the question is about', content: `WRITE YOUR OWN BY CHANGING WHO THE QUESTION IS ABOUT — to turn a single-answer question into a statistical question, keep the topic the same and change who or what the question reaches, from a single person or a single moment to every member of a group. "How many pets does Mia have?" becomes statistical the moment it becomes "How many pets do the students in my class have?", because now every student can answer with a different number.` },
    { loId: 'm6math.statistical-questions', kind: 'definition', title: 'statistical question', content: `a question written so that it anticipates variability, meaning a separate, possibly different, answer is expected from each member of a group, object, or repeated event.` },
    { loId: 'm6math.statistical-questions', kind: 'definition', title: 'variability', content: `the amount that the answers to a question differ from one another once they are collected.` },
    { loId: 'm6math.statistical-questions', kind: 'definition', title: 'data', content: 'the set of answers or measurements collected to answer a question.' },
    { loId: 'm6math.statistical-questions', kind: 'definition', title: 'survey', content: `asking the same question of every member of a group and recording each answer separately.` },
  ],
  methods: [
    {
      title: 'Worked testing three questions',
      steps: [
        `Apply the test to (a) first: only one bus ride happened today, so there is exactly one true number of minutes it took. There is nothing left to vary, so (a) is not a statistical question.`,
        `Apply the test to (b): five separate trips are being asked about, and traffic, weather, and the route can all be different on different days. You would expect the five answers to differ from each other, so (b) is a statistical question.`,
        `Apply the test to (c): every student in the class is asked separately how many items they personally bought, and different students buy different amounts. You would expect the class's answers to differ, so (c) is a statistical question.`,
        `WRONG: calling (a) statistical because a whole bus full of students rode on it. CORRECT: a bus full of many students still produces only one number for the length of that one ride, so mentioning many people does not by itself create variability. (a) stays non-statistical.`,
        `Check each decision against the test one more time: (a) one ride, one number, no variability expected. (b) five different trips, five possibly different times, variability expected. (c) many students, each with a separate answer, variability expected.`,
      ],
      example: { problem: `A class is planning a trip to the aquarium. Test each of these three questions with the variability test to decide whether it is a statistical question. (a) How many minutes did today's bus ride take? (b) How many minutes did the bus ride take on each of the last five class trips? (c) How many gift-shop items did each student in the class buy?`, solution: '(a) not statistical; (b) statistical; (c) statistical.' },
      relatedLoIds: ['m6math.statistical-questions'],
    },
    {
      title: 'Worked rewriting into statistical',
      steps: [
        `Apply the variability test to Zara's draft: it names only Zara herself and only last month, so it has exactly one correct answer, her own count. There is no variability to anticipate, so the draft is not a statistical question.`,
        `To fix it, keep the topic exactly the same, books finished last month, and change WHO the question is asked about: instead of just Zara, ask every member of the reading club.`,
        'Rewrite: "How many books did each member of the reading club finish last month?"',
        `WRONG: rewriting it as "How many books are in the school library?" This keeps the word books but changes the topic completely, and a library's book count is one fixed number anyway, so it still is not statistical. CORRECT: keep Zara's original topic and only change who the question reaches, so every club member can give a separate answer.`,
        `Check the rewrite with the test: different club members almost certainly finished different numbers of books last month, so the answers are expected to differ. The rewrite passes the test.`,
      ],
      example: { problem: `Zara wants to find out how many books the members of her reading club finish each month. She writes this question first: "How many books did I finish last month?" Explain why this is not yet a statistical question, and rewrite it so that it is.`, solution: `"How many books did each member of the reading club finish last month?" is a statistical question because different members are expected to give different answers.` },
      relatedLoIds: ['m6math.statistical-questions'],
    },
  ],
  pointers: [
    { content: `Students often say ""How many students are in my school this year?" is a statistical question because it involves many students." — This question produces exactly ONE number, the total enrollment of the whole school, no matter how many students that number describes. There is nothing left to vary: everyone who answers correctly gives the same total. A question becomes statistical only when each member of the group can give a separate, possibly different, answer, such as "How many siblings does each student in my school have?"`, kind: 'common-error' },
    { content: `Students often say ""How tall are the players on the basketball team?" cannot be a statistical question because it is only one question, asked once." — A statistical question is still just one question, asked one time. What makes it statistical is that it anticipates different answers from different players, since each player has a different height. One question can absolutely be statistical, as long as it is written so the answers it collects are expected to vary.`, kind: 'common-error' },
    { content: `A statistical question anticipates variability: you expect the answers to differ, not to all come back the same.`, kind: 'tip' },
    { content: `Test any question by asking: if the answers were actually collected, would they be the same every time, or would they differ?`, kind: 'tip' },
    { content: `A question naming ONE person, ONE object, or ONE event on a single occasion usually has just one correct answer, so it is not statistical.`, kind: 'tip' },
    { content: `Mentioning a large group is not enough by itself. A question that produces a single count or a single fixed fact about that group is still not statistical.`, kind: 'tip' },
    { content: `A statistical question is written so that EACH member of a group can give their own, possibly different, answer.`, kind: 'tip' },
    { content: 'The set of answers collected to answer a statistical question is called data.', kind: 'tip' },
  ],
};
