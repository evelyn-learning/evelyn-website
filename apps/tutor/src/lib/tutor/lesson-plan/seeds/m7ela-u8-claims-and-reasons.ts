/**
 * Grade 7 ELA — Argument Writing: Claims & Reasons.
 *
 * The WRITING side of argument (CCSS W.7.1a). Unit 4.3 taught the student to
 * trace and grade somebody else's argument; this row turns them around and
 * makes them build one. Two jobs only: write a claim that is a debatable
 * position stated in one sentence, and stack distinct reasons under it.
 * Evidence is deliberately NOT taught here — it is the next row (8.2) — so
 * every item stays on the claim/reason layer.
 *
 * NOTE FOR FUTURE AUTHORS: the three try_yourself items are all
 * revision-choice MCQs (four candidate claims, or four candidate reasons,
 * one clearly best). There is no free response anywhere in this course.
 * Every distractor is a named student error: the fact written as a claim,
 * the question, the bare topic with no position, the reason that only
 * restates the claim, and the reason that is really a single example. All
 * subjects are school and neighborhood scale, and no statistic is invented
 * anywhere in this file.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U8_CLAIMS_AND_REASONS: LessonPlan = {
  id: 'evelyn.ms.m7ela.claims-and-reasons.v1',
  title: 'Claims & Reasons',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.claims-and-reasons',
      standard: 'M7ELA-8.1',
      description:
        'Write an argument by stating a claim that is a debatable position in one sentence, testing it against the fact, the question and the bare topic, and supporting it with two or three distinct reasons that each answer why rather than restating the claim or shrinking into a single example (CCSS W.7.1a).',
    },
  ],
  prerequisites: ['m7ela.commonly-confused-words'],
  followUps: ['m7ela.evidence-and-elaboration'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show why a real suggestion gets ignored, and name the two parts that would have made it land.',
      script:
        'There is a suggestion box outside the main office. Somebody drops in a folded note that says "Lunch." That is the whole note. Nothing happens, and nothing was ever going to happen, because that note never said what it wanted. Now picture a second note. "Our school should make lunch thirty minutes instead of twenty, because the line eats half of it and because nobody has time to walk to the field and back." That note names a position, and it gives two reasons. Somebody can actually say yes to it, or argue with it. Last time you graded an argument that somebody else wrote. Today you are the one writing, and you build the top two floors: the claim, and the reasons that hold it up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-claims-and-reasons',
      kind: 'concept',
      goal: 'Install the one-sentence claim, the debatability test, the three things a claim is not, and the rule that reasons must be distinct.',
      keyIdeas: [
        'A CLAIM IS A POSITION, WRITTEN AS ONE SENTENCE. It says what you want the reader to agree to. Most good claims at your scale use the word should: "Our school should let students keep water bottles in class." One sentence is not a style rule, it is a test. If you cannot squeeze your position into one sentence, you have not decided what your position is yet.',
        'THE DEBATABILITY TEST DECIDES EVERYTHING — could a reasonable person disagree with this sentence? Say your claim out loud, then try to say the opposite out loud. If the opposite is something a sensible person could argue, you have a claim. If the opposite sounds ridiculous or impossible, you do not.',
        'THREE THINGS THAT LOOK LIKE CLAIMS AND ARE NOT. A FACT is checkable, so nobody can disagree: "Our school starts at 7:20" is a fact, and "Our school should start later" is the claim hiding behind it. A QUESTION asks instead of answers: "Should our school start later?" is where you begin, not what you write. A TOPIC names the subject and takes no side: "Start times" and "The school start time is an important issue" both leave the reader asking, well, what about them? Every one of these can be turned into a claim by picking a side and saying should.',
        'A REASON ANSWERS THE QUESTION WHY. Put the word because after your claim and finish the sentence: "Our school should start later BECAUSE the earliest bus riders leave home in the dark." Anything that finishes that sentence is a reason. Anything that does not finish it is something else. Two or three reasons is the normal number for a piece of writing this size.',
        'EACH REASON IS A SEPARATE PILLAR, AND PILLARS CANNOT STAND IN THE SAME SPOT. Two reasons that say the same thing in different words are one reason wearing two hats. Test any pair by asking whether one could be true while the other is false. "Students are tired" and "students do not get enough sleep" fail that test, so they are one pillar. Three strong distinct reasons beat six overlapping ones every time, and a reader notices padding immediately.',
        'TWO TRAPS TO CHECK FOR BEFORE YOU MOVE ON. First, a reason is not the claim reworded: "Our school should start later because classes should not begin so early" says nothing new, it just walks in a circle. Second, a reason is not a single example: "because my friend Dario fell asleep in first period on Tuesday" is one story. The reason underneath it is "because riders on the early bus arrive too tired to follow the first lesson," and Dario belongs in the next layer down, which is evidence.',
      ],
      vocabulary: [
        { term: 'claim', definition: 'the position an argument asks the reader to agree with, stated in one sentence that a reasonable person could disagree with.' },
        { term: 'debatable', definition: 'able to be argued both ways, so that the opposite of the sentence is something a sensible person could hold.' },
        { term: 'reason', definition: 'a statement that answers why the claim should be accepted; it finishes the sentence "claim, because ...".' },
        { term: 'distinct reasons', definition: 'reasons that make genuinely different points, so that one could be true while another is false.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-topic-to-claim',
      kind: 'worked_example',
      problem:
        'You have been handed the topic "phones in class" and told to write an argument. Turn it into a claim.',
      steps: [
        'Notice what you have been given. "Phones in class" is a topic. It names the subject and takes no side, so there is nothing yet for anyone to agree or disagree with.',
        'Turn the topic into a question first, because that is easier: "Should students be allowed to use phones during class?" This is still not the claim. A question asks. A claim answers.',
        'Answer your own question and write the answer as one sentence with should in it: "Students should be allowed to keep phones in their bags during class instead of handing them in at the door."',
        'Run the debatability test. Say the opposite: "Students should hand phones in at the door." A sensible person could absolutely argue that, and plenty of teachers would. The claim passes.',
        'Compare a version that fails the test. WRONG as a claim: "Many students bring phones to school." That is a fact, and its opposite is simply false, so nobody can take the other side. CORRECT as a claim: the should sentence from step three.',
        'Check the length. One sentence, one position. If your sentence had to add "and also uniforms should change," you would be carrying two claims, and each one needs its own argument.',
      ],
      answer:
        'Claim: "Students should be allowed to keep phones in their bags during class instead of handing them in at the door." It is one sentence, it takes a side, and a reasonable person could argue the opposite.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-prune-the-reasons',
      kind: 'worked_example',
      problem:
        'Claim: "Our school should make lunch thirty minutes long instead of twenty." A student drafted four reasons. Which ones survive? (1) Because the lunch line takes so long that students with late lunch barely have time to eat. (2) Because twenty minutes is not enough time for lunch. (3) Because students never get outside during the school day, and the field is a five-minute walk each way. (4) Because on Monday Priya only got through half her sandwich before the bell.',
      steps: [
        'Test each one by putting it after the claim with because. All four finish the sentence, so all four are at least aimed at the right target. Now sort them.',
        'Reason 1 stands. It names a specific cause, the line, and a reasonable person could dispute it, which is exactly what a pillar should look like.',
        'Reason 2 is the claim reworded. "Twenty minutes is not enough time for lunch" is the same sentence as "lunch should be thirty minutes" with the words moved around. It walks in a circle and adds no new ground. Cut it.',
        'Reason 3 stands, and it is genuinely distinct from reason 1. Run the pillar test: the line could be short and the field could still be too far to reach. One can be true while the other is false, so these are two pillars, not one.',
        'Reason 4 is one example, not a reason. Priya and her sandwich are proof you could use later, under reason 1, when you get to evidence. A single Monday cannot hold up the whole claim by itself.',
        'Count what is left. Two distinct reasons, each doing work the other does not do. Two real pillars beat four items where two of them are a mirror and a story.',
      ],
      answer:
        'Reasons 1 and 3 survive. Reason 2 only restates the claim, and reason 4 is a single example, which belongs under reason 1 as evidence rather than standing as a reason of its own.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-the-claim',
      kind: 'try_yourself',
      problem:
        'You are writing an argument about Wheeler Park, the small park behind the library. Which sentence is a claim you could build that argument on?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Wheeler Park has two basketball courts and a long strip of empty pavement near the gate.' },
        { id: 'b', text: 'Should the town build a skate ramp at Wheeler Park?' },
        { id: 'c', text: 'The town should build a skate ramp on the empty pavement at Wheeler Park.', correct: true },
        { id: 'd', text: 'Skate ramps at Wheeler Park are an interesting thing for the town to think about.' },
      ],
      expectedAnswer: 'The town should build a skate ramp on the empty pavement at Wheeler Park.',
      hints: [
        'Run the debatability test on each one. Say the opposite out loud. Which sentence has an opposite that a reasonable person could actually argue?',
        'One choice is a checkable fact, one is a question rather than an answer, and one names the topic without taking any side at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pick-the-reason',
      kind: 'try_yourself',
      problem:
        'Claim: "Our school should start classes at 8:30 instead of 7:20." Which choice is the strongest reason to put under that claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because classes at our school should not begin as early as they do now.' },
        { id: 'b', text: 'Because riders on the first bus leave home before sunrise and arrive too tired to follow the first lesson.', correct: true },
        { id: 'c', text: 'Because last Tuesday my friend Dario fell asleep at his desk during first period.' },
        { id: 'd', text: 'Because the start of the school day is an important part of student life.' },
      ],
      expectedAnswer: 'Because riders on the first bus leave home before sunrise and arrive too tired to follow the first lesson.',
      hints: [
        'A reason has to add something the claim did not already say. Read each choice right after the claim and ask what new ground it covers.',
        'One choice is the claim reworded, one is a single example that belongs lower down as evidence, and one names the topic without giving any why.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-second-pillar',
      kind: 'try_yourself',
      problem:
        'Claim: "Our school should plant a vegetable garden behind the gym." The first reason is already written: "Because science classes could run their own growing experiments outdoors instead of only reading about plants." Which choice works as a genuinely distinct second reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because a garden would give science students a place to test things outside rather than learning about plants from a book.' },
        { id: 'b', text: 'Because the cafeteria could cut what it spends on salad greens by using what the garden produces in the fall.', correct: true },
        { id: 'c', text: 'Because Mr. Alvarez brought tomato seedlings to class last spring and everyone wanted to keep them.' },
        { id: 'd', text: 'Because planting a vegetable garden behind the gym would be a good thing for our school to do.' },
      ],
      expectedAnswer: 'Because the cafeteria could cut what it spends on salad greens by using what the garden produces in the fall.',
      hints: [
        'Run the pillar test against reason one: could one of them be true while the other is false? If not, you have written the same reason twice.',
        'One choice is reason one in new words, one is a single example rather than a reason, and one only says the claim again.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-feelings-and-counting',
      kind: 'misconception_check',
      question:
        'A student says: "My claim is that homework should be limited to thirty minutes a night, because I feel really strongly about it. And I put six reasons under it, so my argument is stronger than anyone else in the class." What has gone wrong here?',
      commonErrors: [
        {
          answer: 'A claim is whatever you feel strongly about.',
          misconception:
            'Treating the strength of a feeling as the thing that makes a sentence a claim. Feeling strongly is why the student picked the subject, so it feels like the qualification.',
          correctsTo:
            'How strongly you feel decides nothing. The debatability test decides it: could a reasonable person disagree with this exact sentence? Run that test here. "Homework should be limited to thirty minutes a night" has an opposite that plenty of people would argue, so it does pass, but it passes because it is a debatable position, not because the writer cares about it. A student who feels just as strongly and writes "Homework takes a long time" has written a fact, and no amount of feeling turns it into a claim.',
        },
        {
          answer: 'Six reasons must be stronger than three reasons.',
          misconception:
            'Counting reasons instead of checking whether they are distinct. Six items look like more work, so they feel like a better argument.',
          correctsTo:
            'Reasons are pillars, and pillars only help if they stand in different places. Ask of any two whether one could be true while the other is false. If six reasons collapse into "homework takes too long," said six ways, the student has one pillar and five echoes, and a reader hears the padding. Three strong distinct reasons hold up more than six overlapping ones.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A claim is a position stated in one sentence, and at your scale it usually contains the word should.',
        'Run the debatability test every time: say the opposite out loud, and ask whether a reasonable person could argue it.',
        'A fact, a question and a bare topic are the three things that look like claims and are not. Pick a side and say should to turn any of them into one.',
        'A reason answers why. It has to finish the sentence "claim, because ...".',
        'Reasons are separate pillars. If one could not be true while another is false, you have written the same reason twice.',
        'A reason is not the claim reworded, and a reason is not a single example. Three strong distinct reasons beat six overlapping ones.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Claims & Reasons' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
