/**
 * Grade 7 World Geography — Culture: Cultural Change & Globalization.
 *
 * The closing row of Unit 4 (National Geography Standard 10). Teaches the
 * pair of ideas that make cultural change readable: convergence and
 * divergence run at the same time, and the cultural landscape is where you
 * see the result.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters: globalization is argued
 * about by adults every day, and the audience is twelve. This file states
 * NO verdict on whether globalization is good or bad. The disagreement is
 * taught as a disagreement -- "some people say ... others say ..." -- and
 * the student is told explicitly that the lesson does not settle it. There
 * are no trade-policy claims, no immigration politics, no ranking of
 * cultures, no characterizing of any people, and no invented statistics of
 * any kind. Keep it that way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is
 * solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U4_CULTURAL_CHANGE_AND_GLOBALIZATION: LessonPlan = {
  id: 'evelyn.ms.m7geo.cultural-change-and-globalization.v1',
  title: 'Cultural Change & Globalization',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.cultural-change-and-globalization',
      standard: 'M7GEO-4.4',
      description:
        'Explain how globalization spreads cultural traits between places, distinguish cultural convergence from cultural divergence and local adaptation, read the cultural landscape of a place as evidence of connection, and describe the disagreement people have about globalization and local culture without taking a side (National Geography Standard 10: the characteristics, distribution and complexity of Earth cultural mosaics).',
    },
  ],
  prerequisites: ['m7geo.world-religions'],
  followUps: ['m7geo.economic-systems'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from what the student ate and listened to yesterday, so cultural travel is obvious before any vocabulary arrives.',
      script:
        'Think about yesterday. What did you eat, and what were you listening to while you ate it? There is a good chance that at least one of those things started somewhere far away. Pizza is tied to Italy. Sushi is tied to Japan. Tea has been grown in Asia for a very long time, and now people drink it in almost every country there is. The song in your headphones may have been recorded in a language you do not speak. None of that happened by accident, and none of it happened overnight. Today we look at how things like these travel between places, what happens to them after they arrive, and why people argue about it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cultural-change',
      kind: 'concept',
      goal: 'Install globalization, convergence and divergence together, the cultural landscape, the two-way flow, and the disagreement -- stated as a disagreement.',
      keyIdeas: [
        'GLOBALIZATION MEANS PLACES ARE MORE CONNECTED THAN THEY USED TO BE. Trade, travel, migration and communication tie far-apart places together, and they do it faster every decade. A cargo ship, an airplane, a phone call and a video posted online all do the same basic job: they shorten the distance between one place and another. When distance gets shorter, cultural traits travel further and faster. Food, music, sports, clothing, words and holidays all move this way.',
        'CULTURAL CHANGE IS NOT NEW. This one matters, because it is easy to imagine that culture used to sit still and only recently started moving. It never sat still. Traders on the Silk Roads carried silk, spices and ideas between Asia, the Middle East, North Africa and Europe long before anyone had an engine. Every culture on Earth has borrowed things and passed things along. What globalization changed is the SPEED and the REACH, not the fact that cultures change.',
        'CONVERGENCE AND DIVERGENCE HAPPEN AT THE SAME TIME. Cultural convergence is places becoming more alike in some ways: the same sport played in both, the same song popular in both. Cultural divergence, also called local adaptation, is what happens when a trait arrives somewhere and gets changed to fit local tastes. A restaurant chain from one country opens in another and puts a dish on the menu that it sells nowhere else. Both things are true in the same moment. Convergence in one detail and divergence in another is the normal result, not a contradiction.',
        'THE CULTURAL LANDSCAPE IS WHAT CULTURE LOOKS LIKE ON THE GROUND. It is the visible imprint of culture on a place: the shop signs and which language they are in, the style of the buildings, what is for sale in the market, what is celebrated in the street and when. You cannot see a belief or a value, but you can see the building it meets in and the food it puts on a table. Reading the cultural landscape is how a geographer studies culture without asking anybody a single question.',
        'INFLUENCE DOES NOT FLOW IN ONE DIRECTION, AND BORROWING IS NOT LOSING. It is tempting to picture a few large countries sending traits outward and everyone else only receiving them. That is not what actually happens. Reggae came out of Jamaica and is played worldwide. Films made in Nigeria have audiences far beyond it. Popular music from South Korea fills concert halls on several continents. Animation from Japan is watched in dozens of languages. And a place that takes up an outside trait does not thereby delete its own: a kitchen that starts using a new spice still cooks its old dishes.',
        'PEOPLE DISAGREE ABOUT WHAT ALL THIS ADDS UP TO, AND THIS LESSON DOES NOT SETTLE IT. Some people say that when a widely-spread trait arrives, local traits get used less, and they point to a language, a craft or a neighborhood shop that fewer people use now. Other people say that cultures have always adapted what arrives and have always sent their own traits outward, and they point to local versions of global things and to traits that traveled from small places to enormous audiences. Those are things people say, and thoughtful people land on different sides. Notice also that no country holds one single culture. Any country contains many languages, foods and ways of living, and people inside a place disagree with each other about change just as much as people outside it do. Your job in geography is to describe accurately what is happening in a particular place, not to announce whether globalization is good or bad.',
      ],
      vocabulary: [
        { term: 'globalization', definition: 'the increasing connection of places through trade, travel, migration and communication.' },
        { term: 'cultural trait', definition: 'a single piece of a culture, such as a food, a game, a word, a style of dress or a holiday.' },
        { term: 'cultural convergence', definition: 'places becoming more alike in some ways as they share traits.' },
        { term: 'cultural divergence', definition: 'a trait being changed to fit local tastes after it arrives in a new place; also called local adaptation.' },
        { term: 'cultural landscape', definition: 'the visible imprint of culture on a place -- signs, buildings, what is sold, what is celebrated.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-chain-menu',
      kind: 'worked_example',
      problem:
        'Explain what is happening in this case, using BOTH cultural convergence and cultural divergence.\n\n"A restaurant chain that started in one country now has restaurants in many countries. In a country where rice is the everyday grain and strongly spiced food is popular, the chain keeps its logo, its fries and its paper cups, and it adds a spiced rice bowl that it sells nowhere else. A student looks at this and says, \'This is just convergence. Everywhere is turning into the same place.\'"',
      steps: [
        'Start by listing what is the SAME in both countries. The logo, the fries, the paper cups, the way you stand in line and order. Those details traveled unchanged.',
        'Name that part. Two places now share traits they did not share before. That is CULTURAL CONVERGENCE, and the student is right about it as far as it goes.',
        'Now list what is DIFFERENT. The spiced rice bowl is on one menu only. It was built for local tastes, out of a grain and a set of flavors that were already common there.',
        'Name that part. A trait arrived and was changed to fit the place it landed in. That is CULTURAL DIVERGENCE, also called local adaptation.',
        'Put the two together. It is the same chain, and it is not the same menu. WRONG: "It is either convergence or divergence." CORRECT: "It is convergence in some details and divergence in others, in the same restaurant on the same afternoon."',
        'Last, notice what this case does NOT tell you. It does not tell you whether anything in that town was lost or gained. To know that you would have to look at everything else being cooked and sold there, and people who look at the same town often reach different conclusions.',
      ],
      answer:
        'Both are happening at once. The shared logo, fries and cups are cultural convergence, because the two places now share traits. The spiced rice bowl sold in only one country is cultural divergence, or local adaptation, because a trait was changed to fit local tastes. The case by itself does not show that anything was lost.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-read-the-landscape',
      kind: 'worked_example',
      problem:
        'Sort these notes into (1) parts of the cultural landscape and (2) physical features. Then say what the cultural landscape is evidence of, and what it is not evidence of.\n\n"A geographer walks through a neighborhood in a port city and writes down what she can see: a row of shop signs written in two languages; a bakery selling both a bread common in the country she is standing in and a pastry the baker says his grandmother used to make in another country; a hill rising behind the last street; a soccer game on a field beside the school; a yard stacked with shipping containers near the water; the river mouth where the port sits."',
      steps: [
        'Use one test for every note: did people make, arrange or choose this, or was it here before anybody arrived? Made or arranged means cultural.',
        'The hill and the river mouth were here before the city was. Those are PHYSICAL FEATURES, not part of the cultural landscape.',
        'The two-language signs, the bakery and what it sells, the soccer game and the container yard were all built, arranged or chosen by people. Those are the CULTURAL LANDSCAPE.',
        'Now read them. Signs in two languages suggest that more than one language group lives or shops here. A bakery selling breads with two different origins shows a trait that arrived from elsewhere sitting on the shelf beside a local one. A container yard is the machinery of long-distance trade, in plain view.',
        'Say what this is evidence of. It is evidence of CONNECTION: goods, people and traits have moved between this place and other places.',
        'Now be careful about what it is not evidence of. WRONG: "There are traits from elsewhere here, so the local culture has been replaced." CORRECT: "There are traits here from more than one place." That sentence describes what is present. Whether it counts as a loss or a gain is exactly the argument people have, and one shop window does not settle it.',
      ],
      answer:
        'Cultural landscape: the two-language shop signs, the bakery and what it sells, the soccer game, the container yard. Physical features: the hill and the river mouth. The cultural landscape is evidence that this place is connected to other places, with traits from more than one place in use side by side. It is not by itself evidence that anything local has disappeared.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-convergence-or-divergence',
      kind: 'try_yourself',
      problem:
        'A style of music that began in one country becomes popular in many others. In one of those countries, musicians start performing that style in their own language and add instruments used in the traditional music of their region. Which term best describes what those musicians did?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cultural divergence, because the trait was changed to fit the place it arrived in', correct: true },
        { id: 'b', text: 'Cultural convergence, because the two countries are now alike in every way' },
        { id: 'c', text: 'Migration, because a cultural trait moved from one country to another' },
        { id: 'd', text: 'Cultural landscape, because the music can be heard in the streets' }
      ],
      expectedAnswer: 'Cultural divergence, because the trait was changed to fit the place it arrived in',
      hints: [
        'Ask what happened to the trait AFTER it arrived. Did it stay exactly as it was, or did the musicians change it?',
        'Two of these terms name something else entirely. One names the movement of people, and one names the visible imprint of culture on a place.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cultural-landscape',
      kind: 'try_yourself',
      problem:
        'A visitor walks through a town and writes several short notes. Which ONE of these notes describes part of the CULTURAL LANDSCAPE?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The shop signs, which are written in two languages', correct: true },
        { id: 'b', text: 'The hills that rise behind the town' },
        { id: 'c', text: 'The river that curves along the edge of town' },
        { id: 'd', text: 'The afternoon turning hot and cloudless' }
      ],
      expectedAnswer: 'The shop signs, which are written in two languages',
      hints: [
        'The cultural landscape is the part of a place that people made, arranged or chose. Which of these did somebody put there?',
        'Hills and rivers were there before the town was. Weather is not built by anybody either.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-way-flow',
      kind: 'try_yourself',
      problem:
        'Cooks in one country begin using a spice that first came from far away, and they use it in dishes their families have cooked for generations. Around the same time, a dish from that same country becomes popular in restaurants in other countries. Which statement best describes what is happening?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The country has lost its own food culture, because a culture that adopts an outside trait gives up its own' },
        { id: 'b', text: 'This kind of change only became possible after airplanes and the internet were invented' },
        { id: 'c', text: 'Cultural traits are moving in both directions, and taking up an outside trait does not erase the traits a place already had', correct: true },
        { id: 'd', text: 'Cultural influence moves in one direction only, outward from a few countries to everybody else' }
      ],
      expectedAnswer: 'Cultural traits are moving in both directions, and taking up an outside trait does not erase the traits a place already had',
      hints: [
        'Count the directions in the case. Something came in, and something went out. Which choice accounts for both?',
        'Remember that traders were already moving spices and ideas across continents long before engines existed. That rules one choice out on its own.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-everywhere-identical',
      kind: 'misconception_check',
      question:
        'A student writes: "Globalization means every place on Earth is turning into the same place, so a culture that takes something from outside has already lost its own." What needs correcting?',
      commonErrors: [
        {
          answer: 'Globalization means every place is turning into the same place.',
          misconception:
            'Seeing only convergence. The student notices what is now shared between two places, treats that as the whole story, and stops looking for what is different.',
          correctsTo:
            'Convergence is real, and so is divergence, and they run at the same time. The same restaurant chain operates in two countries and sells a different menu in each. The same sport is played in both places and is followed with different songs and different rituals in each. Look at the cultural landscape and the differences are obvious: the signs are in different languages, the buildings are built for different climates out of different materials, the market sells different things, and the holidays on the calendar are not the same. Places are sharing more traits than before. WRONG: "Everywhere is becoming identical." CORRECT: "Places are becoming more alike in some traits while staying different, or becoming more different, in others."',
        },
        {
          answer: 'If a place adopts something from another culture, it has lost its own culture.',
          misconception:
            'Treating a culture as a container with limited room, so anything added must push something out. It also assumes cultural change is new, when cultures have borrowed and adapted for as long as people have traveled.',
          correctsTo:
            'Cultures have always borrowed. Goods and ideas moved along the Silk Roads between Asia, the Middle East, North Africa and Europe centuries before any engine existed, and every culture alive today holds traits that arrived from somewhere else. Adding is not the same as replacing: a kitchen that starts using a new spice still cooks its old dishes. Influence also runs outward, not only inward, and traits from smaller places reach enormous audiences all the time. Some people do worry that local traits get used less as widely-spread ones arrive; other people answer that local cultures adapt what arrives and send their own traits out in return. That is a genuine disagreement, and geography asks you to describe what is actually present in a place rather than to declare the argument over.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Globalization means places are more connected through trade, travel, migration and communication, so cultural traits travel further and faster than before.',
        'Cultural change is not new. Cultures have borrowed and adapted for as long as people have traveled. Globalization changed the speed and the reach, not the fact of change.',
        'Cultural convergence (places becoming more alike in some ways) and cultural divergence, or local adaptation (a trait changed to fit local tastes), happen at the same time.',
        'The cultural landscape is the visible imprint of culture on a place: signs, buildings, what is sold, what is celebrated. It is what a geographer reads.',
        'Influence does not flow in one direction, and borrowing is not losing. A place that adopts an outside trait keeps the traits it already had.',
        'People genuinely disagree about what globalization does to local culture, and this lesson does not settle it. Describe what is happening in a place. Do not hand in a verdict.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Cultural Change & Globalization' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
