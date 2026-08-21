/**
 * Grade 7 World Geography — Culture: What Culture Is & How It Spreads.
 *
 * Concept-led, modeled on m7geo-u3-migration-push-and-pull.ts (National
 * Geography Standard 10). Teaches the ANALYTICAL FRAMEWORK -- culture,
 * cultural trait, cultural region, cultural diffusion -- and nothing else.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters most in this unit: this is
 * the most sensitive row in the course. The rules ARE the content here.
 * Cultures are DESCRIBED, never ranked. There is no scale in this file on
 * which one way of life scores higher than another, and the vocabulary that
 * implies such a scale is kept out of the file entirely, including out of
 * this comment. The people of a country or a region are never
 * characterized by a trait or a temperament. No group is a monolith: the file
 * says out loud, more than once, that every country contains many cultures.
 * Practices are described factually, from the outside, the way the people who
 * keep them would describe them.
 *
 * Every case in an item is an invented community -- a made-up town, a made-up
 * cook -- never a real named group. There are no invented statistics and no
 * contested political claims anywhere in the file. Keep it that way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U4_WHAT_CULTURE_IS: LessonPlan = {
  id: 'evelyn.ms.m7geo.what-culture-is.v1',
  title: 'What Culture Is & How It Spreads',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.what-culture-is',
      standard: 'M7GEO-4.1',
      description:
        'Define culture as the shared way of life of a group, identify cultural traits and cultural regions, and explain how traits spread through cultural diffusion by people moving, by trade and contact, and by communication and media (National Geography Standard 10: the characteristics, distribution and complexity of the cultural mosaics of Earth).',
    },
  ],
  prerequisites: ['m7geo.urbanization-and-settlement'],
  followUps: ['m7geo.language-families-and-diffusion'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from the ordinary day the student just had, so that culture is obviously about everybody rather than about other people somewhere else.',
      script:
        'Think about yesterday. What did you eat? What music was playing? How did you greet the first person you saw? What game were you playing, and what were the rules? None of that came from nowhere. Somebody taught you every bit of it, usually without either of you noticing that it was a lesson. And a lot of it traveled a long way to reach you. Soccer is played in almost every country in the world, and it did not start in all of them. Today we give a name to that shared way of life, and we work out how the pieces of it move from place to place.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-what-culture-is',
      kind: 'concept',
      goal: 'Install culture, cultural trait, cultural region and cultural diffusion, plus the two rules that govern how geographers talk about all of them: culture is learned and changing, and cultures are described rather than ranked.',
      keyIdeas: [
        'CULTURE IS THE SHARED WAY OF LIFE OF A GROUP OF PEOPLE. It includes language, beliefs, food, music, dress, customs, technology, and the way people organize family and work. Culture is not any one of those things by itself. It is all of them together, and it covers ordinary Tuesdays just as much as it covers festivals.',
        'A CULTURAL TRAIT IS ONE SINGLE ELEMENT OF A CULTURE -- one greeting, one dish, one instrument, one game, one way of building a house. Traits are the pieces. A whole culture is thousands of traits at once, which is exactly why no short list of traits ever describes a group of people completely.',
        'CULTURE IS LEARNED, SHARED, AND ALWAYS CHANGING. It is learned from the people around you rather than inherited in your body: a baby who grows up in any community learns the language and the customs of that community. It is shared, because a habit that only one person has is not culture. And it changes constantly, in every group, everywhere. A culture that changes is not a culture that is disappearing.',
        'A CULTURAL REGION IS AN AREA WHERE A TRAIT, OR A SET OF TRAITS, IS COMMON -- an area where the same language is spoken, or the same festival is held, or the same food is everyday food. Cultural regions almost never line up with country borders. Every country contains many cultures, many languages and many ways of living, and the edge of a cultural region is usually a wide blurry zone rather than a line. Treating a whole country, or a whole continent, as one single culture is the fastest way to be wrong about it.',
        'CULTURAL DIFFUSION IS THE SPREAD OF A CULTURAL TRAIT FROM ONE PLACE TO ANOTHER, and it happens in three main ways. PEOPLE MOVING carry traits with them to wherever they settle. TRADE AND CONTACT bring people together, and traits get picked up. COMMUNICATION AND MEDIA send a trait to people who have never met anybody from the place it started. Keep two of those apart: a trait that travels because the person who practices it travels is moving person to person along a route, while a trait that somebody adopts after contact spreads without that somebody going anywhere at all.',
        'GEOGRAPHERS DESCRIBE CULTURES; THEY DO NOT RANK THEM. There is no scale on which one way of life scores higher than another. Every human group has technology, history, art and knowledge: a phone is technology, and so is a fish trap, a calendar, a canoe, and a way of finding water in a dry place. It is also not possible to describe what the people of a country are like, because a country holds far too many different people for that sentence to mean anything. Describe what people do, the way the people who do it would describe it, and leave the scoring out.',
      ],
      vocabulary: [
        {
          term: 'culture',
          definition:
            'the shared way of life of a group of people, including language, beliefs, food, music, dress, customs and technology.',
        },
        {
          term: 'cultural trait',
          definition: 'a single element of a culture, such as one dish, one greeting or one style of music.',
        },
        {
          term: 'cultural region',
          definition: 'an area in which one cultural trait, or a set of traits, is common.',
        },
        {
          term: 'cultural diffusion',
          definition: 'the spread of a cultural trait from one place or group to another.',
        },
        {
          term: 'custom',
          definition: 'a way of doing something that a group repeats and teaches to the people who come after them.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-traits-in-a-community',
      kind: 'worked_example',
      problem:
        'Read this description of an invented town and list its cultural traits. Then explain why two of the details are NOT cultural traits.\n\n"Marisol Bay sits where a wide river meets the sea. About half of the families there speak two languages at home. Every spring the town holds a boat festival, with a style of drumming that older neighbors teach to the children. Many residents have dark hair. The most common evening meal is a rice and fish stew. The hills behind the town are steep and rocky."',
      steps: [
        'Run one test question on every detail: did people LEARN this from other people, and do they SHARE it? If both answers are yes, it is a cultural trait.',
        'Half of the families speak two languages at home. Language is learned from other people and shared with them. That is a cultural trait.',
        'The spring boat festival, and the drumming style that older neighbors teach to the children, are both learned and shared. The description even says who does the teaching. Those are cultural traits -- a custom and a style of music.',
        'The rice and fish stew is food, which is a cultural trait. The river and the sea explain why fish is available, but the recipe and the habit of eating it in the evening are things people learned from each other.',
        'Now the two that are not cultural traits. "Many residents have dark hair" describes bodies that people are born with. Hair color is inherited biologically, and nobody learns it, so it is not part of a culture. "The hills behind the town are steep and rocky" describes landforms -- the physical environment of the place, not a way of life.',
        'WRONG way to say it: "Dark hair is part of the culture of Marisol Bay." CORRECT way: "Speaking two languages, the spring boat festival, the drumming style and the rice and fish stew are cultural traits of Marisol Bay. Hair color is inherited, and the hills are landforms."',
      ],
      answer:
        'Cultural traits: speaking two languages at home, the spring boat festival, the drumming style taught by older neighbors, and the rice and fish stew eaten in the evening. Not cultural traits: dark hair, which is inherited biologically rather than learned, and the steep rocky hills, which are part of the physical environment.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-how-a-trait-spreads',
      kind: 'worked_example',
      problem:
        'A cook in the invented town of Kestrel Hollow bakes a flatbread with pumpkin seeds pressed into the top of it. Twenty years later the same flatbread is being baked in three other invented towns. Here is how it reached each one. Say how each town got it.\n\nTown 1: A family from Kestrel Hollow moved there, kept baking the flatbread, and neighbors asked for the recipe.\nTown 2: Traders carry sacks of pumpkin seeds along the road between the two towns. A baker who tasted the flatbread at a roadside market started baking it at home.\nTown 3: Somebody in Kestrel Hollow posted a video of the recipe, and a bakery on the far side of the country began selling it.',
      steps: [
        'Start by naming what all three have in common. A cultural trait -- one recipe -- moved from the place it started to a new place. All three are cultural diffusion. The question is HOW.',
        'Town 1: the trait moved because the PEOPLE moved. A family changed where they live and carried the recipe along with them. That is diffusion by people moving.',
        'Town 2: nobody moved house. The two towns were already in contact along a trade road, the baker met the trait at a market, and then ADOPTED it. That is diffusion through trade and contact.',
        'Hold those two apart, because they are easy to blur. In Town 1 the trait rode along with a person who moved away for good. In Town 2 the baker stayed exactly where the baker already lived, and picked up the trait after contact with people from somewhere else.',
        'Town 3: no one moved and no goods traveled. The recipe spread through communication and media. Notice what that allows: media can jump straight over every town in between, which is why a bakery on the far side of the country got it before the next town over might have.',
        'One more thing to expect. A trait usually changes as it spreads. If a town with no pumpkin seeds bakes the same flatbread with sunflower seeds instead, that is still diffusion, and neither version is the wrong one.',
      ],
      answer:
        'All three are cultural diffusion. Town 1 shows a trait spreading because people moved and carried it with them. Town 2 shows a trait being adopted after contact along a trade route, with the baker staying put. Town 3 shows a trait spreading through communication and media, which can jump over the places in between.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cultural-trait',
      kind: 'try_yourself',
      problem:
        'In the invented village of Halden Ford, which one of these is a CULTURAL TRAIT?\n\nAll four statements about Halden Ford are true.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The natural eye color of the people who live there' },
        {
          id: 'b',
          text: 'A style of drumming that families teach the children before the harvest festival',
          correct: true,
        },
        { id: 'c', text: 'The height of the mountains that stand behind the village' },
        { id: 'd', text: 'The number of days it rains there in a normal year' }
      ],
      expectedAnswer: 'A style of drumming that families teach the children before the harvest festival',
      hints: [
        'Run the test question on each choice: is this something people LEARNED from other people and SHARE with them?',
        'One of these choices is about bodies people are born with. Two are about the physical environment of the place. Only one is something taught.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-diffusion',
      kind: 'try_yourself',
      problem:
        'A card game invented in the town of Alder Creek is played only there. Then several families from Alder Creek move to the town of Fenwick, and within a few years many people in Fenwick play the game too. Which statement describes this best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A game is not part of culture, so nothing cultural has spread.' },
        {
          id: 'b',
          text: 'Cultural diffusion, because a trait spread when people carried it to a new place.',
          correct: true,
        },
        { id: 'c', text: 'A cultural region, because the two towns are near each other.' },
        { id: 'd', text: 'Alder Creek is losing its culture, because the game is no longer only theirs.' }
      ],
      expectedAnswer: 'Cultural diffusion, because a trait spread when people carried it to a new place.',
      hints: [
        'Diffusion is the spread of a cultural trait from one place to another. Ask first whether a trait spread, and then ask how it traveled.',
        'Check the other choices against the concept. Games are cultural traits. A cultural region is an area, not an event. And a trait spreading somewhere new does not remove it from the place it started.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-not-a-monolith',
      kind: 'try_yourself',
      problem:
        'A student writes: "Everyone who lives in the same country shares one single culture." Which response corrects that best?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Every country contains many cultures, because language, food, customs and ways of living vary from place to place inside it.',
          correct: true,
        },
        { id: 'b', text: 'That is right, because each country has one government.' },
        { id: 'c', text: 'That is right for small countries, and wrong only for large ones.' },
        { id: 'd', text: 'A country has one culture whenever it has one official language.' }
      ],
      expectedAnswer:
        'Every country contains many cultures, because language, food, customs and ways of living vary from place to place inside it.',
      hints: [
        'Cultural regions and country borders are drawn by different things. A border is a political line; a cultural region is an area where traits are common.',
        'Two of the wrong choices try to save the idea by adding a condition -- the size of the country, or the number of official languages. Ask whether either condition would actually make everybody inside a border live the same way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-culture-change',
      kind: 'misconception_check',
      question:
        'A student writes: "When people in a place start listening to music from other countries, that culture is disappearing." What is wrong with that, and what would be a better way to describe what is happening?',
      commonErrors: [
        {
          answer: 'When people in a place start listening to music from other countries, that culture is disappearing.',
          misconception:
            'Treating culture as a fixed object that can only be kept or lost, so that any change reads as decline. Underneath it is the idea that a culture was finished at some point in the past and every new trait chips a piece off it.',
          correctsTo:
            'Culture is always changing, in every group, everywhere, and it always has been. Taking on a new trait is diffusion, which is normal and universal -- and the same place is sending its own traits outward at the same time, to people who will also add them to what they already do. A culture is what people actually do now, not a list from an earlier year, so a place that borrows a style of music and keeps its own language, food and festivals has changed rather than vanished. Better wording: "Music from other places has spread here, and people have added it to what they already listen to."',
        },
        {
          answer: 'People inherit their culture from their parents, the same way they inherit eye color.',
          misconception:
            'Confusing culture with biology, because both seem to arrive from a family. This is the error that leads people to believe a group is born a certain way.',
          correctsTo:
            'Culture is LEARNED, not inherited in the body. Eye color arrives through biology and nothing anyone does changes it. Language, food, customs and beliefs arrive through teaching, copying and daily life, which is why a child who grows up in a community learns the culture of that community whoever the parents are, and why anybody can learn a new language or a new custom at any age. Families usually do teach their children their own culture, so it can look inherited -- but the mechanism is teaching, not biology.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Culture is the shared way of life of a group: language, beliefs, food, music, dress, customs, technology, and how people organize family and work.',
        'A cultural trait is one single element of a culture. A whole culture is thousands of traits at once.',
        'Culture is learned from other people, not inherited in the body, and a person learns whatever culture they grow up in.',
        'Every country contains many cultures. Cultural regions have blurry edges and do not follow country borders.',
        'Cultural diffusion is the spread of a trait -- by people moving, by trade and contact, and by communication and media. A trait carried by someone who moves is not the same as a trait adopted after contact by someone who stayed.',
        'Culture changes everywhere, all the time. Change is normal rather than a loss, and geographers describe cultures instead of ranking them.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'What Culture Is & How It Spreads' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
