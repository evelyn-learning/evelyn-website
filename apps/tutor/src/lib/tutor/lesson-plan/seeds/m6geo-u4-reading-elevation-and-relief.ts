/**
 * Grade 6 World Geography — Landforms & Water on Earth: Reading Elevation &
 * Relief.
 *
 * PROCEDURE-LED row for the m6geo fan-out (National Geography Standard 1).
 * The student has a repeatable two-question routine to run, not a single
 * mental model: for each described place, answer the elevation question,
 * then answer the relief question, and only compare after both facts are
 * known for both places. The trap this plan is built to kill is assuming
 * elevation and relief move together -- that a place described as high
 * above sea level must also be described as rugged, or that a place close
 * to sea level must be flat. A flat place can be high. A rugged place can
 * be low. Every example and item below is an invented, described place: no
 * real place's elevation is ever asserted, because an elevation figure for
 * a real place is a checkable claim this row does not need to make.
 *
 * THE PROCEDURE, in the order it is always run:
 *   1. For each place, answer the elevation question: how high does it sit
 *      above sea level?
 *   2. For each place, answer the relief question: does its height change a
 *      little (low relief) or a lot (high relief) across the area?
 *   Only compare the two places after both questions are answered for each
 *   one, and never assume one answer decides the other.
 *
 * SCOPE GUARD: this row defines elevation as how high a point of land sits
 * above sea level, defines relief as how much that height changes across an
 * area, and requires comparing two described places using both terms
 * correctly. It never says that elevation changes temperature or climate --
 * the "higher up, colder air" control on climate, and the other four
 * controls it sits alongside, are Grade 7
 * (`m7geo-u2-weather-climate-and-factors.ts`) and must not appear here.
 * Sideways, this row picks up exactly where Grade 6 row 2.2
 * (`types-of-maps`) stopped: that row names elevation as the one thing a
 * physical map's colors stand for, without comparing the elevation of two
 * real places; this row supplies the comparison, still without a map on
 * screen and still without a real place. This row also does not define or
 * name any specific landform (mountain, plain, plateau, hill, valley --
 * Grade 6 row 4.1) or any water feature (river, lake, sea, gulf, strait --
 * Grade 6 row 4.3); every place here is described only by its elevation and
 * its relief, never classified into a landform or water-feature category.
 * What IS deliberately allowed, because it is the whole point of this row:
 * naming that a described place's elevation and its relief can point the
 * same way or opposite ways, and that the only way to know which is to
 * check each fact on its own every time.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every item below is answered by
 * IDENTIFY or CLASSIFY -- read a plain-language description, extract the
 * elevation fact and the relief fact, and compare. Nothing here explains
 * WHY elevation and relief can move independently, and nothing here
 * introduces a named, closed list of categories. If a sentence you write
 * for your own row would sit comfortably in the Grade 7 file on the same
 * subject, it is over the ceiling.
 *
 * THE STUDENT CANNOT SEE A MAP. Every place in this file is described in
 * words -- an elevation above sea level and a plain description of how much
 * the land's height changes nearby -- printed inside the item itself.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). Every distractor below states a full, nameable
 * wrong reason rather than a short wrong label, and no key was built to be
 * the longest choice BECAUSE it is the key -- see the character counts in
 * the report. Zero is NOT the target; a course-wide zero is the same tell
 * inverted. The three keys sit at ids b, c and d, which is the id set
 * `(4 + 4) mod 4 = 0` requires, omitting a.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U4_READING_ELEVATION_AND_RELIEF: LessonPlan = {
  id: 'evelyn.ms.m6geo.reading-elevation-and-relief.v1',
  title: 'Reading Elevation & Relief',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.reading-elevation-and-relief',
      standard: 'M6GEO-4.4',
      description:
        "Read a plain-language description of a place's elevation and relief and compare two described places using both terms correctly, without the elevation-changes-climate link, which is part of Grade 7's climate-controls lesson (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).",
    },
  ],
  prerequisites: ['m6geo.major-water-feature-vocabulary'],
  followUps: ['m6geo.weather-vs-climate'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "how high" and "how much the height changes" are two different feelings on the same drive, before any vocabulary arrives.',
      script:
        'A car dashboard sometimes shows a small number for how high the car sits above sea level. On a long family trip, the number climbs for an hour as the road heads up into higher country, and then it almost stops changing for the rest of the drive, mile after mile, even on a road far higher than any hill back home. Later on the same trip, the family turns onto a short road near a beach town that stays low the whole way -- the number on the dashboard barely moves. And yet the ride feels nothing like the flat stretch from before. The road tips up steeply, drops into a dip, climbs again, and dips again, over and over, all within a few minutes. Same trip. Two completely different feelings on the road. Today you learn the two separate facts that explain both parts of that drive.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-elevation-and-relief-are-different-questions',
      kind: 'concept',
      goal: 'Install elevation and relief as two separate facts about a place, each answering a different question, and the two-question routine for comparing two places.',
      keyIdeas: [
        'ELEVATION IS HOW HIGH A POINT OF LAND SITS ABOVE SEA LEVEL. Sea level -- the height of the ocean surface -- is the shared starting line that every elevation is measured up from. A place can sit close to sea level or far above it, and a plain-language description usually just says which.',
        'RELIEF IS A DIFFERENT QUESTION: HOW MUCH DOES THE HEIGHT CHANGE ACROSS AN AREA? Relief asks about the rise and fall of the land near a place, from its lowest nearby point to its highest, not about how high the place sits overall. An area where the height barely changes has LOW RELIEF. An area where the height changes by a large amount over a short distance has HIGH RELIEF.',
        'A PLACE CAN SIT HIGH ABOVE SEA LEVEL AND STILL HAVE LOW RELIEF. Sunridge Flats sits at about 2,000 meters above sea level, and for miles around it the ground stays nearly the same height. It is high in elevation and low in relief at the same time.',
        'A PLACE CAN SIT LOW, CLOSE TO SEA LEVEL, AND STILL HAVE HIGH RELIEF. Cove Hollow sits at about 20 meters above sea level, and right around it steep hills rise beside sudden dips, changing height sharply within a short walk. It is low in elevation and high in relief at the same time.',
        "TO COMPARE TWO PLACES, ANSWER BOTH QUESTIONS FOR EACH PLACE ON ITS OWN, THEN COMPARE. Find the elevation of place one, then the elevation of place two, and compare those. Separately, find the relief of place one, then the relief of place two, and compare those. Never use one place's elevation to guess its own relief, and never use one place's answer to guess the other place's answer.",
      ],
      vocabulary: [
        { term: 'elevation', definition: 'how high a point of land sits above sea level.' },
        { term: 'sea level', definition: "the height of the ocean's surface, used as the shared starting point that elevation is measured up from." },
        { term: 'relief', definition: "how much the height of the land changes across an area, from its lowest nearby point to its highest." },
        { term: 'low relief', definition: 'land whose height stays nearly the same across an area, with few large changes.' },
        { term: 'high relief', definition: "land whose height changes by a large amount over a short distance, with sharp rises and drops." },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-two-questions-on-two-towns',
      kind: 'worked_example',
      problem:
        'Two towns are described. Farview sits about 1,850 meters above sea level. Around Farview, the land barely changes height, staying nearly level for a long stretch in every direction. Tumble Creek sits about 60 meters above sea level, not far above the coastline nearby. Around Tumble Creek, the ground rises and falls sharply, with steep banks right next to sudden drops. Which town has the higher elevation, and which town has the higher relief?',
      steps: [
        'Answer the elevation question for each town first, before touching relief at all. Farview sits about 1,850 meters above sea level. Tumble Creek sits about 60 meters above sea level. 1,850 is far greater than 60, so Farview has the higher elevation.',
        'Now answer the relief question for each town, starting fresh -- do not carry over anything from the elevation answer. Around Farview, the land barely changes height, which is low relief. Around Tumble Creek, the ground rises and falls sharply, which is high relief.',
        'Put the two answers together in the order the question asked. Farview has the higher elevation. Tumble Creek has the higher relief.',
        'Check the answer by rereading each description again, this time starting from the relief sentence and working back up to the elevation sentence, to confirm neither answer changes when read in the other order.',
        'Test the same two questions on a pair that comes out differently, so the routine is not overlearned as always running the same way. Take two high lookouts that sit at almost the same elevation, both far above sea level. One is built where the ground stays broad and nearly level. The other is built where several ridges bunch together and the ground climbs and drops sharply within a few steps. Running the same two questions on this new pair gives one high-elevation place with low relief and one high-elevation place with high relief, even though both start from a similar elevation. The routine has to be run fresh on every place -- one place never tells you the answer for another.',
      ],
      answer:
        'Farview has the higher elevation, at about 1,850 meters above sea level, compared with about 60 meters for Tumble Creek. Tumble Creek has the higher relief, because its ground rises and falls sharply nearby, while the land around Farview barely changes height.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-elevation-does-not-decide-relief',
      kind: 'worked_example',
      problem:
        'A student looks at two other towns and says: "Highbank sits high above sea level, so it must be the one with more rise and fall in its land. And Shoreflat sits low, close to sea level, so it must be the flatter of the two." Highbank is described as sitting about 2,200 meters above sea level, where the ground stays almost level for a long stretch. Shoreflat is described as sitting about 15 meters above sea level, where the ground climbs and dips sharply within a short distance. Both of the student\'s sentences are wrong. Correct each one.',
      steps: [
        'Take the two sentences apart first. Each one is a separate claim about a separate town, so each needs its own correction.',
        'Test the Highbank sentence. WRONG: "Highbank sits high above sea level, so it must be the one with more rise and fall." The description says the ground around Highbank stays almost level for a long stretch, which is low relief, not high relief. CORRECT: "Highbank has a high elevation and a low relief."',
        'Test the Shoreflat sentence. WRONG: "Shoreflat sits low, so it must be the flatter of the two." The description says the ground around Shoreflat climbs and dips sharply within a short distance, which is high relief, not low relief. CORRECT: "Shoreflat has a low elevation and a high relief."',
        'Name the mistake behind both wrong sentences in one line: assuming that knowing a place\'s elevation tells you its relief too. The two facts answer two separate questions, and one never decides the other.',
        'Finish with a contrasting case so the idea is not overlearned the other way -- as though the two facts must always point opposite ways instead. Picture two more towns: one sits high above sea level, and its ground also climbs and dips sharply. The other sits low, close to sea level, and its ground also stays almost level. Running the same two questions on this new pair gives a high-elevation town with high relief and a low-elevation town with low relief, the opposite pattern from Highbank and Shoreflat. Sometimes the two facts point the same way, and sometimes they point opposite ways. The only way to know is to check each fact on its own, every time.',
      ],
      answer:
        'Both sentences are wrong. Highbank has a high elevation but a low relief, because its ground stays almost level. Shoreflat has a low elevation but a high relief, because its ground climbs and dips sharply. Elevation and relief are two separate facts, and neither one decides the other.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-one-place',
      kind: 'try_yourself',
      problem:
        "A geography report describes a town this way: \"The town sits low, close to sea level. Right next to the town, the land rises and falls sharply, with steep hills beside sudden dips.\" Which best describes the town's elevation and relief?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Low elevation and low relief, since a town described as close to sea level is almost always flat as well.' },
        { id: 'b', text: 'Low elevation and high relief, since the town is described as close to sea level, and its land rises and falls sharply nearby.', correct: true },
        { id: 'c', text: 'High elevation and low relief, since steep hills are usually found far above sea level rather than close to it.' },
        { id: 'd', text: 'High elevation and high relief, since a place\'s height above sea level and how sharply that height changes always rise together.' },
      ],
      expectedAnswer:
        'Low elevation and high relief, since the town is described as close to sea level, and its land rises and falls sharply nearby.',
      hints: [
        'Look for two separate facts in the description: how high the town sits, and how much its height changes nearby. Answer each one on its own.',
        'The town is described as close to sea level, which rules out a high-elevation answer, and it is described as rising and falling sharply nearby, which rules out a low-relief answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-compare-elevation-only',
      kind: 'try_yourself',
      problem:
        'Cedar Hollow sits about 40 meters above sea level, and the land around it changes very little in height for a long stretch. Windgap sits about 1,600 meters above sea level, and the land around it also changes very little in height for a long stretch. Which town has the higher elevation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cedar Hollow, because a name that mentions a hollow suggests a place set low down in the land.' },
        { id: 'b', text: 'Neither can be said to have the higher elevation, since the two towns are described as having the same relief.' },
        { id: 'c', text: 'Windgap, because it sits at a much greater height above sea level than Cedar Hollow does.', correct: true },
        { id: 'd', text: 'Cedar Hollow, because a place with low relief like this is usually the one that sits at the lower elevation.' },
      ],
      expectedAnswer: 'Windgap, because it sits at a much greater height above sea level than Cedar Hollow does.',
      hints: [
        'Elevation asks how high above sea level a place sits. Compare the two sea-level numbers given for that fact and ignore everything else.',
        'Relief tells you how much a place\'s height changes nearby, not how high it sits, so the fact that both towns share the same relief does not settle the elevation question either way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-compare-both-facts-at-once',
      kind: 'try_yourself',
      problem:
        'Ridgeline sits about 2,500 meters above sea level, and the land around it stays nearly the same height for a long stretch in every direction. Saltmarsh sits about 10 meters above sea level, and the land around it rises and dips sharply from one spot to the next. Which statement about the two places is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Saltmarsh has the higher elevation, because a place described as rising and dipping sharply nearby is usually found far above sea level.' },
        { id: 'b', text: 'Ridgeline has the higher elevation, and Ridgeline also has the higher relief, because sitting far above sea level usually brings more rise and fall nearby too.' },
        { id: 'c', text: 'Both places have about the same relief, because relief always matches how high a place sits above sea level.' },
        {
          id: 'd',
          text: 'Ridgeline has the higher elevation, and Saltmarsh has the higher relief, since each fact comes from checking every place\'s own description rather than assuming one fact from the other.',
          correct: true,
        },
      ],
      expectedAnswer:
        'Ridgeline has the higher elevation, and Saltmarsh has the higher relief, since each fact comes from checking every place\'s own description rather than assuming one fact from the other.',
      hints: [
        'Answer the elevation question for each place first, using only the two sea-level numbers, then answer the relief question for each place using only the rise-and-fall description.',
        'A place\'s elevation does not decide its relief, and its relief does not decide its elevation -- check the two facts about each place on their own before comparing them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-elevation-and-relief-move-together',
      kind: 'misconception_check',
      question:
        'A student says: "The higher a place sits above sea level, the more its height changes across the area. And if two places are both described as having a lot of rise and fall in the land, they must sit at about the same elevation." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'The higher a place sits above sea level, the more its height changes across the area.',
          misconception:
            'Treating elevation and relief as though they always move together, because both facts describe the shape of the land, instead of checking each one separately.',
          correctsTo:
            'Elevation and relief answer two different questions. Elevation asks how high a place sits above sea level. Relief asks how much that height changes across the area, from its lowest nearby point to its highest. A place can sit high above sea level and still have low relief, if its ground barely changes height. A place can sit low, close to sea level, and still have high relief, if its ground rises and falls sharply over a short distance. WRONG: "a higher elevation always means a higher relief." CORRECT: "elevation and relief have to be checked separately, because one does not decide the other."',
        },
        {
          answer: 'If two places are both described as having a lot of rise and fall in the land, they must sit at about the same elevation.',
          misconception:
            'Assuming that because two places share one fact -- high relief -- they must share the other fact, elevation, too.',
          correctsTo:
            'Two places can both have high relief while sitting at very different elevations. One place with a lot of rise and fall in its land might sit only a little above sea level, while another place with just as much rise and fall might sit far above sea level. Sharing a relief description never tells you whether two places share an elevation. WRONG: "the same relief means the same elevation." CORRECT: "read the elevation and the relief of each place on its own, even when the places sound alike in one way."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Elevation is how high a point of land sits above sea level.',
        "Relief is how much that height changes across an area, from its lowest nearby point to its highest -- a different question from elevation.",
        'A place can sit high above sea level and still have low relief, if its ground barely changes height.',
        'A place can sit low, close to sea level, and still have high relief, if its ground rises and falls sharply over a short distance.',
        'To compare two places, answer the elevation question for each one first, then the relief question for each one, and never assume that one answer decides the other.',
        'Two places can share an elevation and still have very different relief, and two places can share a relief description and still sit at very different elevations.',
        'Sometimes elevation and relief point the same way for a place, and sometimes they point opposite ways -- the only way to know is to check each one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Reading Elevation & Relief' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
