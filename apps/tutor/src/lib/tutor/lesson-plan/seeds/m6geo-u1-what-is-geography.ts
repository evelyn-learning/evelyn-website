/**
 * Grade 6 World Geography — Thinking Like a Geographer & Spatial Skills:
 * What Is Geography?
 *
 * CONCEPT-LED exemplar shape for the m6geo fan-out (National Geography
 * Standard 1). This is the course's opening row: it defines the discipline
 * and names the five organizing ideas -- location, place, region, movement,
 * and human-environment interaction -- that every later row in this course,
 * and Grade 7's own opening unit, build on. The job here is to INTRODUCE each
 * idea with one plain definition and one example, never to develop any of
 * them. Two traps this plan is built to kill: treating geography as
 * memorizing place names, and treating human-environment interaction as
 * meaning only harm to nature.
 *
 * SCOPE GUARD: this row DEFINES geography as the study of Earth's physical
 * and human features and NAMES the five organizing ideas the signed
 * curriculum assigns to this row -- location, place, region, movement, and
 * human-environment interaction -- each with one plain, one-sentence
 * definition and one illustrative example, and goes no further than that for
 * any of the five. It does not distinguish absolute from relative location
 * (Grade 6 row 1.3, `absolute-and-relative-location`), does not develop what
 * makes a specific place unique beyond one illustrative example (Grade 6 row
 * 8.1, `what-makes-a-place-unique`), does not classify regions into formal,
 * functional, or perceptual kinds, and does not name the adapt/modify/depend
 * framework for human-environment interaction -- all three of those are
 * Grade 7 (`m7geo-u1-regions-and-place.ts`, Standard 1.4). It never calls a
 * region "invented" or a "tool, not a natural fact," which is that Grade 7
 * file's own load-bearing idea. Deliberately allowed, because that Grade 7
 * row sits close: naming that geography has two broad branches, physical
 * geography and human geography, since that split is the plain definition of
 * the two terms and not a mechanism; and describing ONE concrete instance of
 * a person's choice shaped by surroundings (thick walls in a cold place) as a
 * single, non-enumerated example, never built into a named typology.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea below is a bare
 * definition plus one example. There is no closed typology beyond the
 * five-idea list itself, which is not a mechanism's categories but the
 * literal content the signed curriculum assigns to this exact row -- and
 * nothing in the file breaks any one of the five down further. Every item
 * asks the student to CLASSIFY a described scenario against these plain
 * definitions, never to recite one from memory.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, 94% at difficulty 4; chance with four choices is 25%). All
 * three items here use the same parallel shape ("<Idea> -- <definition>") for
 * every choice, which is the cheapest known technique for flattening the
 * length spread (evidence base: one item in the procedure-led exemplar), but
 * the shape does not guarantee parity on its own -- see the character counts
 * in the authoring report. No key was built to be the longest choice BECAUSE
 * it is the key. Correct choices sit at ids b, a, and d -- the id set
 * `(1 + 1) mod 4 = 2` requires, omitting c.
 *
 * CHECK-MOVE NOTE: this row's worked examples run a repeatable one-question
 * test (would this be true with no people at all? / which of the five ideas
 * survives elimination?) rather than accumulating three converging clues, so
 * both worked examples close with the PROCEDURE-LED check -- rewind the
 * input and re-apply the same test, then apply it to one new contrasting
 * case -- even though the lesson's narrative register otherwise follows the
 * concept-led exemplar, as the fan-out contract lists "what geography is"
 * under the concept-led column. The contract permits using whichever check
 * fits the row.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U1_WHAT_IS_GEOGRAPHY: LessonPlan = {
  id: 'evelyn.ms.m6geo.what-is-geography.v1',
  title: 'What Is Geography?',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.what-is-geography',
      standard: 'M6GEO-1.1',
      description:
        'Define geography as the study of Earth\'s physical and human features and introduce the five organizing ideas (location, place, region, movement, human-environment interaction) that the rest of this course and Grade 7 both build on (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: [],
  followUps: ['m6geo.mental-maps-and-spatial-thinking'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to notice geography already happening around them, before any vocabulary arrives.',
      script:
        'Open a map in a video game and you can see the whole world you are playing in at once: the mountains, the rivers, the towns, and the roads that connect them. A geographer looks at the real world almost the same way -- not just naming things, but asking where each thing is, what makes it different from the place next door, and how it connects to everywhere else. Every trip you have ever taken, every food you have eaten that came from somewhere far away, and every time someone has said the weather is different across town, geography was already happening around you. Today you find out what geography actually studies, and the five big ideas that geographers use to make sense of any place on Earth, from a school playground to an entire continent.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-geography-and-five-ideas',
      kind: 'concept',
      goal: 'Install the plain definition of geography, its two branches, and one clear definition plus example for each of the five organizing ideas.',
      keyIdeas: [
        'GEOGRAPHY IS THE STUDY OF EARTH\'S SURFACE AND EVERYTHING ON IT. It studies physical features -- land, water, and climate -- and human features -- people, cities, and how people live -- and it studies how the two connect. Geography is not the same thing as memorizing the names of places. Knowing that a mountain range has a name is a fact. Geography asks where that mountain range is, what it is like, and how it affects the people who live near it.',
        'GEOGRAPHY HAS TWO BROAD BRANCHES. PHYSICAL GEOGRAPHY studies Earth\'s natural features: mountains, rivers, oceans, weather and climate, plants and animals. HUMAN GEOGRAPHY studies people: where people live, how people travel, what people build, and how people organize themselves into towns, cities, and countries. Most real geography questions use both branches together.',
        'THE FIRST ORGANIZING IDEA IS LOCATION. Location answers the question of where something is. Every place on Earth has one, whether it is a mountain, a city, or a single school building.',
        'THE SECOND ORGANIZING IDEA IS PLACE. Place is what makes one area different from every other area -- its own mix of physical features and human features. Two areas can be the same kind of thing, such as two towns, and still be very different places from each other.',
        'THE THIRD AND FOURTH ORGANIZING IDEAS ARE REGION AND MOVEMENT. A region is an area that is grouped with other areas because they share something in common. Movement describes people, goods, or ideas traveling from one place to another, connecting places that can be far apart.',
        'THE FIFTH ORGANIZING IDEA IS HUMAN-ENVIRONMENT INTERACTION. This is the set of ways that people and their surroundings affect each other: surroundings can shape a choice people make, and people can also change their surroundings. These five ideas -- location, place, region, movement, and human-environment interaction -- are the toolkit geographers use to study any place, and the rest of this course puts each one to work.',
      ],
      vocabulary: [
        { term: 'geography', definition: 'the study of Earth\'s physical and human features and how they relate to each other.' },
        { term: 'location', definition: 'an answer to the question of where something is.' },
        { term: 'place', definition: 'the physical and human features that make one area different from every other area.' },
        { term: 'region', definition: 'an area that is grouped with other areas because they share something in common.' },
        { term: 'movement', definition: 'people, goods, or ideas traveling from one place to another.' },
        { term: 'human-environment interaction', definition: 'the ways that people and their surroundings affect each other.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-physical-vs-human',
      kind: 'worked_example',
      problem:
        'A student writes in a trip journal: "The mountains were covered in snow. The town built a chairlift to carry skiers up the slope. The air got colder every time we climbed higher. The town holds a ski festival every winter." Sort each sentence into physical geography or human geography, and say what single question tells them apart.',
      steps: [
        'Read the first sentence: "The mountains were covered in snow." Ask one test question: would this still be true if there were no people at all? Snow falls on mountains whether or not anyone is there, so this is a physical geography fact.',
        'Read the second sentence: "The town built a chairlift to carry skiers up the slope." Ask the same question. A chairlift is built by people and does not exist without them, so this is a human geography fact.',
        'Read the third sentence: "The air got colder every time we climbed higher." Air getting colder at higher elevation happens with or without people around, so this is a physical geography fact.',
        'Read the fourth sentence: "The town holds a ski festival every winter." A festival is something people organize, so this is a human geography fact.',
        'Check by rereading the four sentences in reverse order, asking the exact same question each time. The same four answers come out: human, physical, human, physical. The order does not change the test.',
        'Test the same one question on a new sentence that was not in the journal: "A river flows down from the mountain into the valley." Rivers flow downhill with or without people, so this is also a physical geography fact -- the same test sorts a brand-new sentence correctly.',
      ],
      answer:
        'Physical geography: "The mountains were covered in snow" and "The air got colder every time we climbed higher." Human geography: "The town built a chairlift to carry skiers up the slope" and "The town holds a ski festival every winter." The test question that sorts them is: would this still be true if there were no people at all?',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-which-organizing-idea',
      kind: 'worked_example',
      problem:
        'A shipping company loads oranges grown on a farm in one country onto trucks, then a cargo ship, then trucks again, until the oranges reach grocery stores in a country far away. Which one of the five organizing ideas -- location, place, region, movement, or human-environment interaction -- best describes what this scenario is mainly about, and why do the others not fit as well?',
      steps: [
        'Check location first: does the scenario mainly tell you where one exact spot is? No -- it never settles on a single fixed spot, it follows the oranges as they travel, so location is not the best fit.',
        'Check place: does the scenario describe what makes one area different from every other area? No -- it never says what either country or the farm is like, only what happens to the oranges, so place is not the best fit.',
        'Check region: does the scenario group several areas together because they share something? No -- it describes one farm and one path to one set of stores, not a group of areas sharing a trait, so region is not the best fit.',
        'Check human-environment interaction: does the scenario describe surroundings and people affecting each other? No -- nothing says the climate or the land shaped a choice, or that people changed their surroundings, so this is not the best fit either.',
        'Check movement: the scenario is entirely about the oranges traveling from one place to another, through several steps in between. That matches movement exactly.',
        'Check by rereading the scenario backward, starting from the grocery store and tracing back to the farm -- it is still the same single idea, something traveling from one place to another, confirming movement. Then test a new, contrasting case: "A farmer plants orange trees because the soil and warm climate in one valley suit them well." Running the same five checks on this new case points to human-environment interaction instead, showing the test comes out differently on a case built to come out differently.',
      ],
      answer:
        'Movement. The scenario is entirely about oranges traveling from a farm in one country to stores in another, through several steps -- trucks, then a ship, then trucks again. It does not fix one exact spot, describe what makes an area different, group areas together, or describe surroundings and people affecting each other, so the other four ideas do not fit as well.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-place',
      kind: 'try_yourself',
      problem:
        'A geography report describes a made-up town called Elmridge like this: winters there are mild and rainy, most houses have red tile roofs, and a weekend market sells fruit grown nearby. Which organizing idea does this report mainly show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Location -- where an area is positioned compared to other places or lines on Earth.' },
        { id: 'b', text: 'Place -- the physical and human features that make one area different from every other area.', correct: true },
        { id: 'c', text: 'Movement -- people, goods, or ideas traveling from one place to another.' },
        { id: 'd', text: 'Region -- an area that is grouped with other areas because they share something in common.' },
      ],
      expectedAnswer: 'Place -- the physical and human features that make one area different from every other area.',
      hints: [
        'Ask whether the report is telling you what one specific area is like, or where that area sits compared to something else.',
        'The report never says whether Elmridge is north, south, near a coast, or grouped with any other towns -- it only lists what Elmridge itself is like.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-region',
      kind: 'try_yourself',
      problem:
        'A mapmaker shades one area on a map that includes every country in the world where wheat is the main crop farmers grow, even though those countries are scattered across several continents and do not touch each other. Which organizing idea does the shaded area mainly show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Region -- an area that is grouped with other areas because they share something in common.', correct: true },
        { id: 'b', text: 'Location -- where an area is positioned compared to other places or lines on Earth.' },
        { id: 'c', text: 'Movement -- people, goods, or ideas traveling from one place to another.' },
        { id: 'd', text: 'Human-environment interaction -- the ways that people and their surroundings affect each other.' },
      ],
      expectedAnswer: 'Region -- an area that is grouped with other areas because they share something in common.',
      hints: [
        'Ask whether the shaded area is showing one place\'s location, or grouping several separate places together for a reason.',
        'The countries do not touch and are not close to each other, so the shaded area cannot be about where one place sits -- it is about what many scattered places have in common.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-human-environment-interaction',
      kind: 'try_yourself',
      problem:
        'In a made-up village called Coldharbor, winters are long and very cold, so people build their homes with thick walls and small windows to help the homes hold in heat. Which organizing idea does this mainly show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Movement -- people, goods, or ideas traveling from one place to another.' },
        { id: 'b', text: 'Place -- the physical and human features that make one area different from every other area.' },
        { id: 'c', text: 'Region -- an area that is grouped with other areas because they share something in common.' },
        { id: 'd', text: 'Human-environment interaction -- the ways that people and their surroundings affect each other.', correct: true },
      ],
      expectedAnswer: 'Human-environment interaction -- the ways that people and their surroundings affect each other.',
      hints: [
        'Ask whether the sentence is just listing what Coldharbor is like, or explaining why people there do something because of the surroundings.',
        'The word "so" connects the cold winters to the choice to build thick walls -- that connection is the sign of people and surroundings affecting each other, not just a place being described.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-names-and-only-harm',
      kind: 'misconception_check',
      question:
        'A student says: "Geography is basically memorizing place names on a map. And human-environment interaction just means people harming nature." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'Geography is basically memorizing place names on a map.',
          misconception:
            'Confusing the tools of geography, like maps and place names, with the actual study, because naming places is often the most visible part of an early geography class.',
          correctsTo:
            'Maps and place names are tools geography uses, not the subject itself. Geography is the study of Earth\'s physical and human features and how they connect. WRONG: "Geography is memorizing place names." CORRECT: "Geography is studying and explaining Earth\'s physical and human features and how they relate to each other." Knowing the name of a mountain range is a fact. Geography asks where it is, what it is like, and how it affects the people who live near it.',
        },
        {
          answer: 'Human-environment interaction just means people harming nature.',
          misconception:
            'Hearing the word "environment" mostly in news stories about pollution or damage, and assuming the whole idea only points one direction and only means harm.',
          correctsTo:
            'Human-environment interaction describes any way people and their surroundings affect each other, in both directions. Surroundings can shape a choice a person makes, such as building thick walls in a cold place, and people can also change their surroundings. Some of those effects help, some cause harm, and some do both -- but the idea itself is not only about harm. WRONG: "Human-environment interaction only means people harming nature." CORRECT: "Human-environment interaction means people and their surroundings affecting each other, which can happen in many different ways."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Geography is the study of Earth\'s physical features, like land, water, and climate, and human features, like people, cities, and how people live, and how the two connect.',
        'Physical geography studies Earth\'s natural features. Human geography studies people and what people build and do.',
        'Location answers the question of where something is.',
        'Place is what makes one area different from every other area.',
        'Region is an area that is grouped with other areas because they share something in common.',
        'Movement describes people, goods, or ideas traveling from one place to another.',
        'Human-environment interaction describes the ways that people and their surroundings affect each other.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'What Is Geography?' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
