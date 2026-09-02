/**
 * Grade 6 Math — Statistics: Distributions, Center & Spread: Statistical
 * Questions.
 *
 * CONCEPT-LED exemplar-style lesson for the m6math fan-out (unit 10, topic
 * 1). The whole lesson builds one mental model: a statistical question is a
 * question that anticipates variability, meaning you expect the answers to
 * differ before you ever collect them (CCSS 6.SP.A.1). The running example
 * asks two versions of the same question about a class basketball team's
 * heights — one about a single captain, one about every player — because
 * that single sharp contrast fixes the test better than a definition on its
 * own. The failure mode this plan is built to kill is treating "a big group
 * is mentioned" as proof a question is statistical: several items test a
 * question that names a whole group yet still produces only one fixed
 * answer, and one item asks the student to choose the correctly WRITTEN
 * statistical question rather than only classify one that is already
 * written.
 *
 * SCOPE GUARD: This lesson teaches only how to recognize and write a
 * statistical question — one that anticipates variability in the data
 * collected to answer it (6.SP.A.1). It never displays or organizes
 * collected data: building dot plots and histograms is row 10.2, computing
 * mean or median is row 10.3, and describing spread or overall shape is row
 * 10.4, so none of those skills is taught or assessed here. It never reaches
 * into Grade 7: there is no random sampling, no inference from a sample to a
 * larger group, and no comparison between two data sets, and no probability
 * of any kind appears, since Grade 6 has no probability standard. Where an
 * item here asks about a whole group (a class, a grade, a school), that
 * group is always the SAME group whose individual members are being asked
 * the question directly, each contributing their own separate answer —
 * never a sample standing in for a larger population, which is the Grade 7
 * escalation this lesson deliberately avoids.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U10_STATISTICAL_QUESTIONS: LessonPlan = {
  id: 'evelyn.ms.m6math.statistical-questions.v1',
  title: 'Statistical Questions',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.statistical-questions',
      standard: 'M6MATH-10.1',
      description:
        'Recognize and formulate a statistical question as one that anticipates variability in the data collected to answer it (CCSS 6.SP.A.1).',
    },
  ],
  prerequisites: ['m6math.nets-and-surface-area'],
  followUps: ['m6math.dot-plots-and-histograms'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up one sharp contrast between a single-answer question and a many-answer question before any definition is given.',
      script:
        'Picture your class basketball team on picture day. Your coach lines everyone up and asks, "How tall is our team captain?" There is exactly one correct answer: whatever number the tape measure shows for that one person. Now picture the coach asking a different question instead: "How tall are the players on our team?" Ten different players step up to the tape measure, and you get ten numbers that are probably not all the same. Same team, same tape measure, two very different kinds of question. Today you learn how to tell those two kinds apart, and how to write a question of your own that belongs in the second group.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-variability-test',
      kind: 'concept',
      goal: 'Give the student one reliable test for telling a statistical question from a single-answer question, and show that mentioning a group is not enough by itself.',
      keyIdeas: [
        'THE VARIABILITY TEST — a statistical question is a question that anticipates variability, which means you expect the answers to differ before you ever collect them. To test any question, ask yourself: if this question were actually asked and the answers were collected, would they come back the same every time, or would they differ from person to person, object to object, or time to time?',
        'ONE ANSWER MEANS NOT STATISTICAL — "How tall is our team captain?" names one specific person, so it has exactly one correct answer. There is no variability to anticipate, so this is not a statistical question, no matter how it is worded.',
        'MANY DIFFERENT ANSWERS MEANS STATISTICAL — "How tall are the players on our team?" is asked of every player separately, and different players have different heights. Before a single measurement is taken, you already expect the answers to differ. That expectation of different answers is exactly what makes a question statistical.',
        'MENTIONING A GROUP IS NOT ENOUGH BY ITSELF — a question can talk about a huge group of people and still not be statistical, if it only ever produces ONE number for that whole group. "How many students are in my school this year?" mentions every student in the school, but it still has just one correct total. A question becomes statistical only when EACH member of the group can give a separate, possibly different, answer.',
        'WRITE YOUR OWN BY CHANGING WHO THE QUESTION IS ABOUT — to turn a single-answer question into a statistical question, keep the topic the same and change who or what the question reaches, from a single person or a single moment to every member of a group. "How many pets does Mia have?" becomes statistical the moment it becomes "How many pets do the students in my class have?", because now every student can answer with a different number.',
      ],
      vocabulary: [
        { term: 'statistical question', definition: 'a question written so that it anticipates variability, meaning a separate, possibly different, answer is expected from each member of a group, object, or repeated event.' },
        { term: 'variability', definition: 'the amount that the answers to a question differ from one another once they are collected.' },
        { term: 'data', definition: 'the set of answers or measurements collected to answer a question.' },
        { term: 'survey', definition: 'asking the same question of every member of a group and recording each answer separately.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-testing-three-questions',
      kind: 'worked_example',
      problem:
        'A class is planning a trip to the aquarium. Test each of these three questions with the variability test to decide whether it is a statistical question. (a) How many minutes did today\'s bus ride take? (b) How many minutes did the bus ride take on each of the last five class trips? (c) How many gift-shop items did each student in the class buy?',
      steps: [
        'Apply the test to (a) first: only one bus ride happened today, so there is exactly one true number of minutes it took. There is nothing left to vary, so (a) is not a statistical question.',
        'Apply the test to (b): five separate trips are being asked about, and traffic, weather, and the route can all be different on different days. You would expect the five answers to differ from each other, so (b) is a statistical question.',
        'Apply the test to (c): every student in the class is asked separately how many items they personally bought, and different students buy different amounts. You would expect the class\'s answers to differ, so (c) is a statistical question.',
        'WRONG: calling (a) statistical because a whole bus full of students rode on it. CORRECT: a bus full of many students still produces only one number for the length of that one ride, so mentioning many people does not by itself create variability. (a) stays non-statistical.',
        'Check each decision against the test one more time: (a) one ride, one number, no variability expected. (b) five different trips, five possibly different times, variability expected. (c) many students, each with a separate answer, variability expected.',
      ],
      answer: '(a) not statistical; (b) statistical; (c) statistical.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rewriting-into-statistical',
      kind: 'worked_example',
      problem:
        'Zara wants to find out how many books the members of her reading club finish each month. She writes this question first: "How many books did I finish last month?" Explain why this is not yet a statistical question, and rewrite it so that it is.',
      steps: [
        'Apply the variability test to Zara\'s draft: it names only Zara herself and only last month, so it has exactly one correct answer, her own count. There is no variability to anticipate, so the draft is not a statistical question.',
        'To fix it, keep the topic exactly the same, books finished last month, and change WHO the question is asked about: instead of just Zara, ask every member of the reading club.',
        'Rewrite: "How many books did each member of the reading club finish last month?"',
        'WRONG: rewriting it as "How many books are in the school library?" This keeps the word books but changes the topic completely, and a library\'s book count is one fixed number anyway, so it still is not statistical. CORRECT: keep Zara\'s original topic and only change who the question reaches, so every club member can give a separate answer.',
        'Check the rewrite with the test: different club members almost certainly finished different numbers of books last month, so the answers are expected to differ. The rewrite passes the test.',
      ],
      answer:
        '"How many books did each member of the reading club finish last month?" is a statistical question because different members are expected to give different answers.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-homework-question',
      kind: 'try_yourself',
      problem: 'Which of these questions is a statistical question?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How many wheels does a bicycle have?' },
        { id: 'b', text: 'How old is the oldest teacher at our school?' },
        { id: 'c', text: 'How many students are in our school this year?' },
        { id: 'd', text: 'How many minutes does each student in our school spend on homework each night?', correct: true },
      ],
      expectedAnswer: 'How many minutes does each student in our school spend on homework each night?',
      hints: [
        'Apply the variability test to each choice: would you expect the exact same answer every time, or would the answers differ from person to person?',
        'Three of these choices have a fixed answer that can never change, or ask for just ONE particular value about a whole group. Find the one question that lets each person answer separately, with an answer that can differ from everyone else\'s.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-sleep-question',
      kind: 'try_yourself',
      problem:
        'Your friend wants to learn about how many hours of sleep the students in your grade get each night. Which question should your friend write down to collect that information?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How many hours did I sleep last night?' },
        { id: 'b', text: 'How many hours of sleep do the students in my grade get each night?', correct: true },
        { id: 'c', text: 'How many students are in my grade?' },
        { id: 'd', text: 'How many hours are in one night?' },
      ],
      expectedAnswer: 'How many hours of sleep do the students in my grade get each night?',
      hints: [
        'Cross out any choice that only asks about ONE person, or that has an answer that never changes no matter who answers it.',
        'The question your friend needs must let every student in the grade give their own separate answer about their own sleep, not one total for the whole grade.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-count-statistical-questions',
      kind: 'try_yourself',
      problem:
        'Look at these four questions. (1) How many pets does Mia have? (2) How many pets do the students in my class have? (3) How many minutes did it take me to walk to school today? (4) How many minutes does it take each student in my class to walk to school? How many of these four questions are statistical questions? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'Apply the variability test to each question on its own: does it ask about one person on one occasion, or about every member of a group separately?',
        'Questions 1 and 3 each name a single person and a single moment, so each has only one correct answer. Questions 2 and 4 ask about every student in the class, and different students are expected to answer differently.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-group-mentioned-vs-one-answer',
      kind: 'misconception_check',
      question:
        'One student says "How many students are in my school this year?" must be a statistical question because it is about a whole school full of students. Another student says "How tall are the players on the basketball team?" cannot be a statistical question because it is only one question. What went wrong in each case?',
      commonErrors: [
        {
          answer: '"How many students are in my school this year?" is a statistical question because it involves many students.',
          misconception: 'Believing that mentioning a large group automatically makes a question statistical, without checking whether the answers themselves are expected to differ.',
          correctsTo:
            'This question produces exactly ONE number, the total enrollment of the whole school, no matter how many students that number describes. There is nothing left to vary: everyone who answers correctly gives the same total. A question becomes statistical only when each member of the group can give a separate, possibly different, answer, such as "How many siblings does each student in my school have?"',
        },
        {
          answer: '"How tall are the players on the basketball team?" cannot be a statistical question because it is only one question, asked once.',
          misconception: 'Judging whether a question is statistical by how many times it gets asked, instead of by whether the answers it produces are expected to differ.',
          correctsTo:
            'A statistical question is still just one question, asked one time. What makes it statistical is that it anticipates different answers from different players, since each player has a different height. One question can absolutely be statistical, as long as it is written so the answers it collects are expected to vary.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A statistical question anticipates variability: you expect the answers to differ, not to all come back the same.',
        'Test any question by asking: if the answers were actually collected, would they be the same every time, or would they differ?',
        'A question naming ONE person, ONE object, or ONE event on a single occasion usually has just one correct answer, so it is not statistical.',
        'Mentioning a large group is not enough by itself. A question that produces a single count or a single fixed fact about that group is still not statistical.',
        'A statistical question is written so that EACH member of a group can give their own, possibly different, answer.',
        'The set of answers collected to answer a statistical question is called data.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Statistical Questions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
