/**
 * Grade 7 ELA — Reading Informational Text: Comparing Two Texts on One Topic.
 *
 * Concept-led (CCSS RI.7.9). Two authors write about the same topic and shape
 * it differently, in exactly two ways: they choose different evidence, or they
 * read the same fact differently. The second one is the idea most seventh
 * graders have never been handed — two writers can print the identical fact
 * and draw opposite conclusions from it, and both of them can be accurate.
 *
 * NOTE FOR FUTURE AUTHORS: every text in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question prints BOTH texts inline and must be
 * solvable from those sentences alone. No published work may be quoted or
 * closely paraphrased. Topics are kept at school and neighborhood scale on
 * purpose.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U4_COMPARING_TWO_TEXTS: LessonPlan = {
  id: 'evelyn.ms.m7ela.comparing-two-texts.v1',
  title: 'Comparing Two Texts on One Topic',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.comparing-two-texts',
      standard: 'M7ELA-4.4',
      description:
        'Analyze how two authors writing about the same topic shape their presentations differently, by emphasizing different evidence or by interpreting the same facts differently, and quote the words from each text that show the difference (CCSS RI.7.9).',
    },
  ],
  prerequisites: ['m7ela.tracing-an-argument'],
  followUps: ['m7ela.parts-of-speech'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already compares two accounts of one event, so the lesson only names the moves.',
      script:
        'Your team lost on the last shot of the game Friday night. Later two people in the group chat write about it. The first one writes about the shot that rolled off the rim with no time left. The second one writes about how the team had been losing badly at halftime and came all the way back. Read them one after the other and you get two different feelings about the same game. Now here is the part worth noticing: neither person is lying. They both watched the same game. They picked different parts of it to tell you about. That is what two writers do with one topic, and today we learn how to say exactly what each of them did.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-comparing-two-texts',
      kind: 'concept',
      goal: 'Name the method for comparing two texts and the two ways presentations differ: emphasis and interpretation.',
      keyIdeas: [
        'TWO TEXTS, ONE TOPIC — before you compare anything, check that both texts really are about the same thing. A piece about the new bus route and a piece about the town hiring more drivers sit near each other, but they are not the same topic. If the topics do not match, there is nothing to compare yet. Say the shared topic out loud in one short phrase first.',
        'MAKE TWO LISTS, THEN FIND THE OVERLAP — write down what each text includes. The facts that show up on BOTH lists are the shared ground, and that is where a comparison starts, because shared facts prove the two writers are looking at the same thing. Then look at what is on one list only.',
        'THE FIRST WAY TEXTS DIFFER IS EMPHASIS — the writer chooses which facts to put in front of you. One writer tells you the lunch line moved faster. The other tells you that some students now bring lunch from home. Both of those can be true on the same Friday. Each writer handed you a different fact, and that alone changes the picture you walk away with.',
        'THE SECOND WAY IS INTERPRETATION, AND IT IS THE ONE TO WATCH FOR — two writers can print the exact same fact and draw opposite conclusions from it. The new route adds a stop on Miller Street. One writer calls that a delay, because the bus now reaches school later. The other calls it a win, because students on that side of the creek can finally ride. Same fact. Opposite conclusion. Nobody made anything up.',
        'DIFFERENT DOES NOT MEAN DISHONEST — when two texts disagree, the first question is not who is lying. It is whether they chose different facts or read the same fact differently. Almost every time it is one of those two, and both texts are accurate. Name which one it is, then quote the words from each text that show it.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'the subject both texts are about — the thing they share.' },
        { term: 'emphasis', definition: 'the parts of a topic a writer chooses to put in front of the reader.' },
        { term: 'interpretation', definition: 'what a writer says a fact means.' },
        { term: 'presentation', definition: 'how a writer shapes a topic, through what is included and what it is said to mean.' },
        { term: 'evidence', definition: 'the facts, examples and details a writer prints to support a point.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-different-evidence',
      kind: 'worked_example',
      problem:
        'These two texts are about the same change. Find the shared fact, then say how the presentations differ.\n\nText 1: The cafeteria replaced the Friday pizza with a build-your-own bowl. Students who tried the bowls said they liked choosing their own toppings. The line also moved faster than it used to on pizza days.\n\nText 2: The cafeteria replaced the Friday pizza with a build-your-own bowl. A number of students now bring lunch from home on Fridays. Pizza was the one meal almost everyone in the grade would eat without complaining.',
      steps: [
        'Step one is the topic. Both texts open on the same change: Friday pizza is gone and a build-your-own bowl has taken its place. The topics match, so there is something to compare.',
        'Step two is two lists. Text 1 includes: students who tried the bowls liked choosing toppings, and the line moved faster. Text 2 includes: some students bring lunch from home now, and pizza was the meal almost everyone would eat.',
        'Step three is the overlap. The shared fact is the change itself — the cafeteria replaced the Friday pizza with a build-your-own bowl. Both texts print that sentence, almost word for word.',
        'Step four is the difference. Nothing on one list contradicts anything on the other. Students can like choosing toppings AND some students can start bringing lunch from home. Both texts can be completely accurate.',
        'So the difference is not about facts being wrong. It is emphasis. Text 1 chose evidence about people who tried the new meal. Text 2 chose evidence about the old meal and about people who opted out.',
        'Say it with the words attached: both texts report the same swap, but Text 1 emphasizes that the bowls were popular and that the line "moved faster", while Text 2 emphasizes that some students "bring lunch from home now" and that pizza was the meal "almost everyone in the grade would eat".',
      ],
      answer:
        'Shared fact: the cafeteria replaced the Friday pizza with a build-your-own bowl. The presentations differ by EMPHASIS — Text 1 chooses evidence about students who liked the bowls and a faster line, and Text 2 chooses evidence about students bringing lunch from home and about how popular the old pizza was. Neither text contradicts the other.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-fact-opposite-conclusion',
      kind: 'worked_example',
      problem:
        'Both writers use the same fact. Work out what each one makes of it.\n\nText 1: The new bus route adds a stop on Miller Street. That extra stop means the bus reaches the school later than it used to, and riders now walk through the door as the first bell is ringing.\n\nText 2: The new bus route adds a stop on Miller Street. Students who live on that side of the creek had no way to ride the bus at all before this year, and now they do.',
      steps: [
        'Topic check first. Both texts are about one thing: the new bus route and the stop it adds on Miller Street. Same topic.',
        'Now the overlap, and here it is unusually tight. Both texts print the SAME fact in their first sentence: the new route adds a stop on Miller Street. Neither writer disputes it.',
        'Read what Text 1 does with that fact. It follows the stop straight to a cost — the bus arrives later, and riders are walking in on the bell. Text 1 treats the extra stop as a problem.',
        'Read what Text 2 does with the same fact. It follows the stop to a gain — students across the creek could not ride before and now they can. Text 2 treats the extra stop as a fix.',
        'Test whether one of them has to be wrong. It does not. A stop can add time to the trip AND give new riders a way on. Both sentences can be true on the same morning, so this is not a case of one writer being mistaken.',
        'Name the move: this is INTERPRETATION, not emphasis. The evidence is identical. What changed is the conclusion each writer drew from it. WRONG way to answer: "Text 2 proves Text 1 is wrong." RIGHT way: "Both texts use the same fact, the added Miller Street stop, and draw opposite conclusions from it — Text 1 calls it a delay, Text 2 calls it access."',
      ],
      answer:
        'Both texts use the identical fact — the new route adds a stop on Miller Street — and interpret it in opposite directions. Text 1 reads it as a cost, because the bus "reaches the school later than it used to". Text 2 reads it as a gain, because students across the creek "had no way to ride the bus at all before this year". Neither text is inaccurate.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-shared-fact',
      kind: 'try_yourself',
      problem:
        'Which fact do BOTH texts state?\n\nText 1: Cedar Pond is shallower than it used to be, because mud has built up on the bottom. The town could dig the mud out, but the work would close the walking path for a whole season.\n\nText 2: Mud has built up on the bottom of Cedar Pond, and the water is shallower than it used to be. Digging the mud out would give the ducks and turtles deeper water to come back to.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mud has built up on the bottom of Cedar Pond, so the water is shallower than it used to be.', correct: true },
        { id: 'b', text: 'Digging out the mud would close the walking path for a whole season.' },
        { id: 'c', text: 'Digging out the mud would give the ducks and turtles deeper water.' },
        { id: 'd', text: 'The town has already decided to dig the mud out of Cedar Pond.' },
      ],
      expectedAnswer: 'Mud has built up on the bottom of Cedar Pond, so the water is shallower than it used to be.',
      hints: [
        'Make two lists. Write down what Text 1 says, then what Text 2 says, and look for the line that shows up on both lists.',
        'Three of these choices appear in only one text, or in neither. Only one sentence is printed by both writers.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-same-fact-opposite-conclusion',
      kind: 'try_yourself',
      problem:
        'Read both texts, then choose the statement that describes them best.\n\nText 1: The art room will be shared with the after-school homework club starting Monday. That means the art teacher has to pack every project away by three o\'clock, so nothing large can be left out to dry.\n\nText 2: The art room will be shared with the after-school homework club starting Monday. Students who stay for homework help will sit surrounded by paintings instead of in a bare hallway, and a few of them have already signed up for art class.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both texts report the same change, and each draws an opposite conclusion from it — one calls it a loss for art projects, the other calls it a gain for the homework club.', correct: true },
        { id: 'b', text: 'The two texts describe two different changes that are happening to the art room.' },
        { id: 'c', text: 'One of the two texts must have its facts wrong, because they do not agree.' },
        { id: 'd', text: 'The two texts disagree about whether the art room will be shared at all.' },
      ],
      expectedAnswer: 'Both texts report the same change, and each draws an opposite conclusion from it — one calls it a loss for art projects, the other calls it a gain for the homework club.',
      hints: [
        'Compare the first sentence of each text. Are they reporting the same change, or two different ones?',
        'The facts match. What does not match is what each writer says the change will MEAN.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-they-differ',
      kind: 'try_yourself',
      problem:
        'Why do these two texts leave a reader with such different pictures of the same plan?\n\nText 1: The town wants to turn the gravel lot beside the library into a small skate park. The lot sits empty most days, and the kids who skate use the loading ramp behind the grocery store instead.\n\nText 2: The town wants to turn the gravel lot beside the library into a small skate park. The lot is where the library book sale puts up its tables every summer, and nowhere else on the block is wide enough for them.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each writer chose a different fact about the lot to include, so each one hands the reader a different picture of the same plan.', correct: true },
        { id: 'b', text: 'The first text is about the skate park and the second text is about the library, so they are not really on the same topic.' },
        { id: 'c', text: 'Text 2 proves that Text 1 is wrong when it says the lot sits empty most days.' },
        { id: 'd', text: 'They do not differ, because two texts on the same topic have to reach the same conclusion.' },
      ],
      expectedAnswer: 'Each writer chose a different fact about the lot to include, so each one hands the reader a different picture of the same plan.',
      hints: [
        'Both texts open with the identical plan. So the difference has to come from the sentence that follows it in each one.',
        'Ask what each writer tells you the lot is used for. One says nobody uses it. The other names a use. Neither one repeats the other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-disagree-means-lying',
      kind: 'misconception_check',
      question:
        'Two texts about the new Miller Street bus stop reach opposite conclusions. A student writes that one of the writers must be lying. What went wrong?',
      commonErrors: [
        {
          answer: 'Text 2 must be lying, because it says the new stop is good and Text 1 says it is bad.',
          misconception:
            'Treating any disagreement between two texts as proof that one writer got the facts wrong or made something up.',
          correctsTo:
            'Check the facts before you check the honesty. Both texts print the same fact: the route adds a stop on Miller Street. Neither one denies it. What differs is the conclusion each writer draws from that fact — Text 1 follows it to a later arrival, Text 2 follows it to students who can finally ride. A later bus and new riders can both be true on the same morning, so both texts can be completely accurate. Two writers who disagree have usually either chosen different evidence or read the same evidence differently. Say which of those two it is, and quote the line from each text that shows it.',
        },
        {
          answer: 'Text 1 is the better text, because it is longer and lists more details than Text 2.',
          misconception:
            'Judging texts by length or by the number of details, and thinking that comparing two texts means listing everything in both of them.',
          correctsTo:
            'Length is not a measure of quality, and a comparison is not an inventory. A short text that chooses one sharp piece of evidence can shape a reader more than a long one that piles up details. What a comparison actually needs is three things: the topic both texts share, the facts they both state, and the exact place where they part company. Everything else in the two texts can be left out of your answer.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Check the topic first. If the two texts are not about the same thing, there is nothing to compare yet.',
        'Make two lists, find the facts on BOTH lists, then look at what sits on one list only.',
        'Difference one is EMPHASIS — each writer chooses which facts to put in front of you.',
        'Difference two is INTERPRETATION — two writers can print the exact same fact and draw opposite conclusions from it.',
        'Disagreement is not proof that anyone is lying. Both texts can be accurate. Name the difference and quote the words from each text that show it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Comparing Two Texts on One Topic' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
