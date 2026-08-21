/**
 * Grade 7 ELA — Reading Informational Text: Central Idea & Supporting Details.
 *
 * The informational-text counterpart to theme (CCSS RI.7.2). The central idea
 * is the most important POINT the whole text makes, written as a complete
 * sentence; supporting details are the facts, examples and reasons that back
 * it up. The lesson teaches one test — a candidate idea has to cover the WHOLE
 * text, and every supporting detail has to fit under it — and names the four
 * errors that break these questions: handing back the topic word, crowning the
 * first sentence, crowning the most surprising detail, and accepting a true
 * detail that props up some other point.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences printed
 * inside it, and no published work may be quoted or closely paraphrased. The
 * excerpts also carry NO invented statistics: every claim is general and true.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U3_CENTRAL_IDEA_AND_SUPPORTING_DETAILS: LessonPlan = {
  id: 'evelyn.ms.m7ela.central-idea-and-supporting-details.v1',
  title: 'Central Idea & Supporting Details',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.central-idea-and-supporting-details',
      standard: 'M7ELA-3.1',
      description:
        'Determine the central idea of an informational text, state it as a complete sentence that covers the whole text rather than the topic or one striking detail, and identify the facts, examples and reasons that support it (CCSS RI.7.2).',
    },
  ],
  prerequisites: ['m7ela.tone-mood-and-word-choice'],
  followUps: ['m7ela.summarizing-informational-text'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already states central ideas out loud, so the lesson only names a move they own.',
      script:
        'A friend misses practice and asks you what the coach said. You do not repeat the whole twenty minutes. You give one sentence: we are switching the warm-up because too many people are pulling muscles. That sentence is the point. Everything else the coach said — the drills, the story about last season, the bit about water bottles — was there to back it up. That is exactly what a nonfiction writer does. One point runs the whole text, and the facts and examples are hired to hold it up. Today we name that point, we name the details doing the holding, and we practice a test that catches the answers that only look right.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-central-idea',
      kind: 'concept',
      goal: 'Define central idea as topic plus point, define supporting detail, install the whole-text test, and name the first-sentence and surprising-detail traps.',
      keyIdeas: [
        'THE TOPIC IS A WORD. THE CENTRAL IDEA IS A SENTENCE. The topic is what the text is about, and you could write it on a folder tab: bees, sleep, city buses. The central idea is the most important POINT the text makes about that topic: bees do more for our food crops than most people realize. If your answer has no verb doing real work, you have handed back the topic and stopped early.',
        'SUPPORTING DETAILS ARE THE FACTS, EXAMPLES AND REASONS THAT BACK THE POINT UP. Each one has a job. It gives an example of the idea, it explains how the idea works, or it shows that the idea is true. A detail that does none of those three jobs is not supporting THIS idea, however interesting it is.',
        'THE WHOLE-TEXT TEST — this is the test the questions are built on. A candidate central idea has to cover the WHOLE text, not one paragraph and not one sentence. Say your candidate out loud, then walk back through the text sentence by sentence and ask what job each sentence does for it. If several sentences have nothing to do with your candidate, your candidate is a detail wearing a crown.',
        'THE FIRST SENTENCE IS OFTEN A HOOK, NOT THE POINT. Writers open with a common belief, a surprise or a scene, and then turn against it. Watch for the turn words: but, however, yet, in fact. What comes AFTER the turn is usually the real point, and the opening was the thing being corrected. So never take sentence one on trust. Test it like every other sentence.',
        'THE MOST SURPRISING DETAIL IS ALMOST NEVER THE CENTRAL IDEA. The strangest fact in a text pulls your eye, but interesting is not the same as important. Ask what the surprising fact was put there to PROVE. Whatever it proves is the central idea, and the fact is a supporting detail doing its job.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'what a text is about, said in a word or two — not yet a point.' },
        { term: 'central idea', definition: 'the most important point the whole text makes about its topic, written as a complete sentence.' },
        { term: 'supporting detail', definition: 'a fact, example or reason whose job is to back up the central idea.' },
        { term: 'informational text', definition: 'writing whose job is to explain something true, such as an article, a notice or a field guide entry.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-whole-text-test',
      kind: 'worked_example',
      problem:
        'Find the central idea of this paragraph, and show how you tested it.\n\n"Not every bird flies south for the winter. The birds that leave are mostly following food, not running from the cold, because insects and soft fruit disappear once the freeze arrives. Birds that can switch to seeds, nuts or the insects tucked under tree bark often stay in one place all year."',
      steps: [
        'Name the topic first, in a word or two: birds and winter. That is a folder tab. There is no point in it yet, so it cannot be the answer.',
        'Now ask what the paragraph SAYS about that topic. Sentence 2 gives a reason — the birds that leave are chasing food, not fleeing cold. Sentence 3 gives the flip side — birds that can find winter food stay.',
        'Draft a candidate sentence: birds migrate to follow their food, which is why the birds that can change what they eat are able to stay put.',
        'Run the whole-text test. Sentence 1 sets up the surprise that not all birds go. Sentence 2 states the reason. Sentence 3 shows the other half of the same reason. All three sentences work for the candidate, so the scope is right.',
        'Now test a weaker candidate so you can see it fail: "Insects and soft fruit disappear in winter." That is true, and it is one clause of one sentence. Sentences 1 and 3 do nothing for it, so it is a supporting detail, not the point.',
        'Test one more: "Birds are interesting animals." Every sentence in the paragraph is about birds, so it passes the first glance, but that sentence would fit a thousand other paragraphs. It is too big to be THIS text\'s point.',
      ],
      answer:
        'Central idea: birds migrate to follow food rather than to escape the cold, which is why birds that can switch to seeds and bark insects stay all year. Supporting details: insects and soft fruit vanish in the freeze, and some birds can change what they eat.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-hook-versus-point',
      kind: 'worked_example',
      problem:
        'A student says the central idea of this paragraph is "Staying up late is bad for you." Explain what went wrong, and give the real central idea.\n\n"Everybody already knows that staying up late leaves you tired. But being tired is not the biggest cost. While you sleep, your brain goes back over what you practiced during the day and files it away, which is why a piece of music or a skateboard trick you kept fumbling at night can feel easier the next morning."',
      steps: [
        'Look at where the student got that answer. It is sentence one, almost word for word. That is the first-sentence trap: taking the opening line on trust because it came first.',
        'Find the turn word. Sentence 2 starts with "But". A "but" tells you the writer is about to push back on what was just said, so sentence 1 is the setup being corrected, not the point.',
        'Read what comes after the turn. Sentence 3 says the brain goes back over the day\'s practice while you sleep and files it away, and it gives an everyday example of that happening.',
        'Draft the candidate: sleep is when your brain stores what you practiced, so sleep is part of learning a skill and not just a rest from being tired.',
        'Run the whole-text test on it. Sentence 1 sets up the common belief, sentence 2 says that belief is not the biggest part, and sentence 3 states the real point and gives the example. Every sentence has a job under the candidate, so it holds.',
        'WRONG answer: "Staying up late is bad for you." It covers only the hook, and it is the very idea the writer says is not the main cost. CORRECT answer: sleep is when your brain files away what you practiced, so it helps a new skill stick.',
      ],
      answer:
        'The student crowned the hook. The word "But" at the start of sentence 2 signals the turn, and the real central idea is that sleep is when the brain stores what you practiced, so it is part of learning a skill rather than only a cure for tiredness.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-idea-not-topic',
      kind: 'try_yourself',
      problem:
        'Read the paragraph, then choose the best statement of its central idea.\n\n"Gears do not make a rider stronger. They change how hard each push of the pedals feels by trading speed for force. In a low gear the back wheel turns less for every turn of the pedals, so a steep hill takes less force and you climb it slowly. In a high gear the wheel turns more for each pedal stroke, so you go faster on flat ground but each push is harder."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Bicycle gears.' },
        { id: 'b', text: 'Gears let a rider trade speed for force, so a hill can be climbed slowly with less effort and flat ground can be ridden fast.', correct: true },
        { id: 'c', text: 'Gears do not make a rider stronger.' },
        { id: 'd', text: 'In a low gear the back wheel turns less for every turn of the pedals.' },
      ],
      expectedAnswer: 'Gears let a rider trade speed for force, so a hill can be climbed slowly with less effort and flat ground can be ridden fast.',
      hints: [
        'A central idea is a complete sentence with a point in it, not a folder tab. One choice here is only the topic.',
        'Run the whole-text test. Walk through all four sentences and ask which choice every single one of them is working for.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-detail-supports',
      kind: 'try_yourself',
      problem:
        'An article has this central idea: sleep is when your brain stores what you learned during the day. Which detail actually SUPPORTS that idea?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some people remember their dreams and some people almost never do.' },
        { id: 'b', text: 'Middle schoolers need more sleep each night than adults do.' },
        { id: 'c', text: 'A bedroom that is dark and cool makes falling asleep easier.' },
        { id: 'd', text: 'People who practice something new and then sleep usually do it better the next day than people who stay up instead.', correct: true },
      ],
      expectedAnswer: 'People who practice something new and then sleep usually do it better the next day than people who stay up instead.',
      hints: [
        'Every choice here is true. That is the trap. A true fact is only a supporting detail if it backs up THIS point.',
        'The point is about sleep and learning. Ask which choice says anything at all about learning; the other three are about how much sleep you need, how to fall asleep, and dreams.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-whole-text-coverage',
      kind: 'try_yourself',
      problem:
        'Read the paragraph, then choose the statement that covers the whole thing.\n\n"A public library does not fill its shelves at random. Librarians watch which titles have the longest waiting lists, read reviews of new books, and take requests straight from the people who walk in, then spend a fixed budget once a year. Some libraries also take donated books, but usually only the ones that match what their readers are already asking for."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some libraries accept donated books from the public.' },
        { id: 'b', text: 'A library picks its new books on purpose, using what its readers ask for and the money it has to spend.', correct: true },
        { id: 'c', text: 'Libraries spend a fixed budget on books once a year.' },
        { id: 'd', text: 'The only thing a library considers is which books have the longest waiting lists.' },
      ],
      expectedAnswer: 'A library picks its new books on purpose, using what its readers ask for and the money it has to spend.',
      hints: [
        'Three of these choices are lifted out of a single part of the paragraph. Check each one against sentence 1 AND sentence 2 AND sentence 3.',
        'One choice adds the word "only", which the paragraph never says — it lists waiting lists, reviews and requests together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-and-surprise',
      kind: 'misconception_check',
      question:
        'A paragraph explains that bees pollinate a huge share of the fruits and vegetables people eat, that a single hive visits an enormous number of flowers, and that farmers now rent hives and drive them to their fields. One student says the central idea is "bees". Another says it is "farmers rent hives and drive them to their fields". What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The central idea is bees.',
          misconception:
            'Handing back the topic instead of the point. "Bees" is what the paragraph is about, so it feels right, but it says nothing the paragraph claims.',
          correctsTo:
            'A topic is a word you could write on a folder tab. A central idea is a complete sentence with a point in it. Ask what the paragraph SAYS about bees, and the answer arrives: bees do far more for the food we eat than most people realize. Notice that this sentence has a verb doing real work, and that every sentence in the paragraph is backing it up.',
        },
        {
          answer: 'The central idea is that farmers rent hives and drive them to their fields.',
          misconception:
            'Crowning the most surprising detail. Trucking beehives across the country is the strangest fact in the paragraph, so it grabs the eye, but interesting is not the same as important.',
          correctsTo:
            'Run the whole-text test. The sentence about renting hives covers one sentence of three, and the pollination sentence does no work for it. Then ask the real question: what was that surprising fact put there to PROVE? It is there to show how much farmers depend on bees, which means it is evidence for the central idea, not the central idea itself.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The topic is a word. The central idea is a complete sentence stating the most important point the text makes about that topic.',
        'Supporting details are the facts, examples and reasons that back the point up. Each one gives an example, explains how it works, or shows it is true.',
        'The whole-text test: your candidate has to cover EVERY sentence, not one paragraph and not one line.',
        'The first sentence is often a hook. Look for but, however, yet or in fact, because the real point usually comes after the turn.',
        'The most surprising detail is almost never the central idea. Ask what it was put there to prove.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Central Idea & Supporting Details' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
