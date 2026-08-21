/**
 * Grade 7 World Geography — Latin America: Physical Geography.
 *
 * The FIRST regional row of the course (National Geography Standard 4). Its
 * job is to take the tools built in Units 1 and 2 -- location, landforms,
 * plate boundaries, and the five controls on climate -- and point them at one
 * region. It is a PHYSICAL row: landforms, rivers, climate and hazards.
 * History and culture belong to 7.2 and are deliberately absent here.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters: every claim in this file is
 * about a real place, on a page a twelve-year-old will read. The claims here
 * were chosen because they are long-settled physical facts -- the Andes run
 * down the western side of South America, the Amazon flows east across Brazil
 * to the Atlantic, the Atacama is one of the driest places on Earth. There
 * are deliberately NO NUMBERS anywhere in this file: no lengths, no heights,
 * no areas, no rainfall totals, no populations. A remembered wrong number is
 * worse than no number. If you extend this file, extend it with facts of the
 * same kind, and drop anything you cannot confirm.
 *
 * The file also says nothing about what the people of the region are like,
 * and ranks no place against another. Physical superlatives that are measured
 * (longest continental range, largest tropical rainforest) are fine.
 * Judgements about places are not. Keep it that way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every arrangement of
 * places is described in words inside the item that needs it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U7_LATIN_AMERICA_PHYSICAL_GEOGRAPHY: LessonPlan = {
  id: 'evelyn.ms.m7geo.latin-america-physical-geography.v1',
  title: 'Latin America: Physical Geography',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.latin-america-physical-geography',
      standard: 'M7GEO-7.1',
      description:
        'Describe the major landforms, rivers and climates of Latin America, and explain how latitude, elevation, mountain barriers, ocean currents and plate boundaries produce the wide range of physical conditions found in one region (National Geography Standard 4: the physical and human characteristics of places).',
    },
  ],
  prerequisites: ['m7geo.international-cooperation'],
  followUps: ['m7geo.latin-america-history-and-culture'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the range of physical conditions inside a single region feel surprising, before any place names arrive.',
      script:
        'Try packing one suitcase for this trip. First you land on a warm island where it rains most afternoons. Then you fly to a town so high in the mountains that you want a jacket after dark. Then you drive to a desert where rain almost never falls at all. And you never leave one region of the world. You could really do that trip. The region is Latin America, and this lesson is about the reason one region can hold a steamy rainforest, a snowy mountain, wide grasslands and one of the driest deserts on Earth all at the same time. Everything you need to explain it, you already learned in Unit 2.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-latin-america-physical',
      kind: 'concept',
      goal: 'Lay out what the region is made of physically, then explain its variety using the Unit 2 controls on climate and the Unit 2 plate boundaries.',
      keyIdeas: [
        'WHAT THE REGION IS, PHYSICALLY. Latin America is the name geographers use for Mexico, Central America, the Caribbean islands, and the whole of South America taken together. Central America is an isthmus -- a narrow strip of land joining the two larger continents -- and the Caribbean islands lie in and around the Caribbean Sea to its east. The Pacific Ocean is on the western side of the region and the Atlantic Ocean is on the eastern side. This region holds many countries, and inside those countries there are many landscapes and many climates. It is never one single place. Where the name itself comes from is the next lesson, not this one.',
        'LOCATION FIRST -- THE REGION COVERS AN ENORMOUS RANGE OF LATITUDE. Northern Mexico sits well north of the Equator. The Equator itself crosses the northern part of South America. The far southern end of South America reaches a long way south of the Equator, where the land is cool and windy and there are glaciers in the mountains. Remember Control 1 from Unit 2: latitude is the first thing to check about any place. When a region spans that much latitude, it cannot have one climate.',
        'THE ANDES RUN DOWN THE WESTERN SIDE. The Andes are a mountain range that runs from north to south along the western side of South America, close to the Pacific coast, for almost the whole length of the continent. They are the longest continental mountain range on Earth. A range that long and that high acts as a wall: it separates the narrow western coast from the wide lands to its east, and it decides where the rain falls.',
        'THE AMAZON DRAINS THE EAST. The Amazon River begins high in the Andes and flows east, across Brazil, all the way to the Atlantic Ocean. The wide, low, hot land it drains is the Amazon Basin, and it holds the largest tropical rainforest on Earth. It sits near the Equator, so it is warm and wet through the whole year rather than switching between a hot season and a cold one. Farther south lie the Pampas, wide grasslands with deep, fertile soil that makes good farmland.',
        'ELEVATION CHANGES THE CLIMATE INSIDE ONE LATITUDE. This is Control 2 from Unit 2, and Latin America is the clearest place on Earth to see it. Air gets colder the higher you go. So a highland town and a lowland town can share a latitude, sit close together, and still have completely different climates: hot in the lowlands, mild partway up, cold near the top. Geographers call those bands vertical climate zones. Some peaks in the Andes stay snow-covered all year even though they stand close to the Equator. Never answer a question about temperature in this region with latitude alone -- always ask how high the place is.',
        'DRY EDGES, WET EDGES, AND RESTLESS EDGES. The Atacama Desert, in northern Chile on the Pacific side, is one of the driest places on Earth, and two Unit 2 controls explain it: the Andes stand to its east and take the moisture out of air arriving from that direction, so the desert sits in a rain shadow, and the cold Peru Current runs north along the coast to its west, and air over cold water carries less rain onto the land. Meanwhile much of Central America and the Caribbean is tropical -- warm all year, with a wet season -- and hurricanes form over the warm ocean and can strike the Caribbean islands in the late summer and fall. And because the western edge of South America and parts of Central America sit where tectonic plates meet, earthquakes and volcanoes happen there. That plate boundary is what pushed the Andes up in the first place.',
      ],
      vocabulary: [
        { term: 'isthmus', definition: 'a narrow strip of land that connects two larger areas of land.' },
        { term: 'basin', definition: 'the whole area of land that drains into one river and the streams that feed it.' },
        { term: 'highlands', definition: 'land that sits high above sea level, such as a plateau or a mountain area.' },
        { term: 'lowlands', definition: 'land that sits close to sea level.' },
        {
          term: 'vertical climate zones',
          definition: 'the bands of different climate you pass through as you climb a mountain, hot at the bottom and cold at the top.',
        },
        {
          term: 'rain shadow',
          definition: 'the dry area on the far side of a mountain range, where the air has already dropped its moisture.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-towns-one-latitude',
      kind: 'worked_example',
      problem:
        'Explain this case using the controls on climate from Unit 2.\n\n"Two towns lie in the same South American country, at almost the same latitude, not far from the Equator. Rio Llano sits on a flat coastal plain just above sea level, and it is hot every month of the year. Monte Alto sits high in the Andes, and it is cool every month of the year -- people there wear jackets in the evening. Why are the two towns so different, and what does that tell you about latitude?"',
      steps: [
        'Start with what the two towns share, so you can rule it out. They are in the same country, at almost the same latitude, close to the Equator. So latitude cannot be the thing that separates them. That is the whole design of the case.',
        'Now find the one thing that is different. Rio Llano is just above sea level. Monte Alto is high in the mountains. The difference is ELEVATION, which is Control 2 from Unit 2.',
        'Say what elevation does. Air gets colder the higher you go. Monte Alto is far above Rio Llano, so its air is colder, even though the sun reaches both towns at nearly the same angle.',
        'Name the pattern. Those bands of climate stacked up a mountainside are the vertical climate zones from the concept: hot lowlands at the bottom, milder land partway up, cold air near the top. In this region you find them again and again, because the Andes are so long and so high.',
        'Notice the second clue in the case: BOTH towns are described month after month, not season by season. Close to the Equator the angle of the sun changes little across the year, so neither town swings much between summer and winter. In this region the big temperature change is up and down, not season to season.',
        'WRONG way to explain Monte Alto: "Monte Alto is cooler because it is farther from the Equator." The case says the two towns share a latitude, so that cannot be it. CORRECT way: "Monte Alto is cooler because it sits at a much higher elevation, and air temperature falls as elevation rises."',
        'Now state what the case teaches about latitude, which is the part to carry forward: latitude sets the starting point for a climate, and elevation can change the answer completely. Two places at the same latitude in Latin America do not have to share a climate.',
      ],
      answer:
        'Elevation explains the difference. Rio Llano sits just above sea level, so it is hot; Monte Alto sits high in the Andes, and air gets colder as elevation rises, so it is cool all year. Because the two towns share a latitude, the case shows that latitude alone does not decide a climate -- elevation gets a vote, and near the Equator it is often the deciding one.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-why-atacama-is-dry',
      kind: 'worked_example',
      problem:
        'The Atacama Desert lies in northern Chile, on the Pacific side of South America. It is one of the driest places on Earth. Using the controls on climate from Unit 2, give TWO separate reasons for that dryness, and then say why "it must be very hot there" is not one of them.',
      steps: [
        'Set the scene in words before reasoning about it. The desert has the Andes standing to its east, and it has the Pacific Ocean to its west. So two of the five controls are in play at once: a mountain barrier on one side, an ocean current on the other.',
        'REASON ONE -- the rain shadow. Air arriving from the east has to rise over the Andes to reach the desert. Rising air cools, cool air cannot hold as much water vapor, and the moisture falls out on the eastern side of the range. What comes down the western side is dry air. The desert sits in the rain shadow of the Andes.',
        'REASON TWO -- the cold current. The cold Peru Current runs north along this coast. Air sitting over cold water does not carry much moisture inland and does not rise easily, so very little rain reaches the coast from the ocean side either.',
        'Put the two together to see why the dryness is so extreme. Most deserts have one main reason. This one is blocked from the east by a mountain wall and given little from the west by a cold current, so both directions are shut at once.',
        'Now handle the third part of the question. A desert is defined by how little precipitation it gets, not by how hot it is. WRONG: "The Atacama is dry because it is so hot." CORRECT: "The Atacama is dry because moist air is blocked by the Andes on one side and held back by a cold ocean current on the other." Heat is not the definition, and it is not the cause.',
      ],
      answer:
        'Reason one: the Andes stand to the east, so air arriving from that direction drops its moisture on the far side of the range and the desert sits in a rain shadow. Reason two: the cold Peru Current runs along the coast to the west, and air over cold water brings little rain onto the land. Heat is not a reason, because a desert is defined by how little precipitation falls, not by temperature.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-drive-up-the-mountain',
      kind: 'try_yourself',
      problem:
        'A traveler starts in a hot lowland town close to the Equator and drives up into the mountains. The road keeps her at about the same latitude the whole way. What will most likely happen to the temperature, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It will get warmer, because the mountaintop is closer to the sun.' },
        { id: 'b', text: 'It will get colder, because she is moving away from the Equator.' },
        { id: 'c', text: 'It will get colder, because air temperature falls as elevation rises.', correct: true },
        { id: 'd', text: 'It will stay about the same, because latitude alone decides temperature.' }
      ],
      expectedAnswer: 'It will get colder, because air temperature falls as elevation rises.',
      hints: [
        'Read the stem again for the fact it hands you on purpose: her latitude does not change. So cross out any answer whose reason is about latitude or distance from the Equator.',
        'Two answers say it gets colder, and only one of them gives a reason that matches the stem. Ask which control from Unit 2 is actually changing on this drive.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-the-shaking',
      kind: 'try_yourself',
      problem:
        'Earthquakes and volcanic eruptions happen along the western edge of South America and in parts of Central America. Which statement best explains why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Those areas lie close to the Equator, where the ground is warmer.' },
        { id: 'b', text: 'Heavy rain wears away the rock there, which makes the ground shake.' },
        { id: 'c', text: 'Those areas sit near a boundary where tectonic plates meet.', correct: true },
        { id: 'd', text: 'Those areas sit at a high elevation, where the air is thin.' }
      ],
      expectedAnswer: 'Those areas sit near a boundary where tectonic plates meet.',
      hints: [
        'Go back to Unit 2. Earthquakes and volcanoes are not spread evenly over the world. They cluster in long lines. What is under those lines?',
        'Three of these choices name something true about mountains or the tropics but have nothing to do with the crust moving. Pick the one about the crust.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-not-all-hot',
      kind: 'try_yourself',
      problem:
        'A student writes: "Latin America is near the Equator, so the whole region must be hot." Which piece of evidence best shows that the student is wrong?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Amazon Basin is warm and wet through the whole year.' },
        {
          id: 'b',
          text: 'The region reaches far south of the Equator, and it also has highlands that stay cool even near the Equator.',
          correct: true,
        },
        { id: 'c', text: 'Hurricanes can strike Caribbean islands in the late summer and fall.' },
        { id: 'd', text: 'The Amazon River flows east across Brazil to the Atlantic Ocean.' }
      ],
      expectedAnswer:
        'The region reaches far south of the Equator, and it also has highlands that stay cool even near the Equator.',
      hints: [
        'Every one of these four statements is true. The question is not which is true -- it is which one argues against the student.',
        'The student made a claim about temperature everywhere in the region. Look for the choice that names somewhere in the region that is NOT hot.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-hot-and-far-from-water',
      kind: 'misconception_check',
      question:
        'A student is describing Latin America and writes two sentences: "The whole region is hot, because it is in the tropics." and "The Atacama Desert is dry because it is far from any ocean." What is wrong with each one?',
      commonErrors: [
        {
          answer: 'The whole region is hot, because it is in the tropics.',
          misconception:
            'Treating a whole region as one climate, and using latitude as the only control. The student has taken one true fact -- that part of the region lies in the tropics -- and stretched it over every country, every elevation and every latitude in the region.',
          correctsTo:
            'Two things break the claim. First, latitude: the region stretches from well north of the Equator to far south of it, and its far southern end is cool and windy with glaciers in the mountains. Second, elevation: highland towns in the Andes are cool all year even when they sit close to the Equator, and some peaks stay snow-covered. WRONG: "Latin America is hot." CORRECT: "Latin America contains tropical lowlands, cool highlands, dry deserts, grasslands and cold southern latitudes, because latitude and elevation both get a vote." A region this large never has one climate.',
        },
        {
          answer: 'The Atacama Desert is dry because it is far from any ocean.',
          misconception:
            'Assuming that nearness to an ocean guarantees rain, so dryness must mean distance from water. It is a reasonable rule of thumb that happens to be exactly backward here.',
          correctsTo:
            'The Atacama sits right on the Pacific coast, so distance from the ocean cannot be the reason. WRONG: "It is dry because there is no ocean nearby." CORRECT: "It is dry because the Andes block moist air arriving from the east, putting the desert in a rain shadow, and because the cold Peru Current along the coast means the air over the water carries little rain inland." Being near an ocean does not promise rain -- what matters is whether the air over that water is warm enough and rising.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Latin America means Mexico, Central America, the Caribbean islands and South America together -- many countries, many landscapes, never one single place.',
        'The Andes run north to south down the western side of South America and are the longest continental mountain range on Earth.',
        'The Amazon River begins in the Andes and flows east across Brazil to the Atlantic Ocean; the basin around it holds the largest tropical rainforest on Earth.',
        'The Atacama Desert in northern Chile is one of the driest places on Earth, for two reasons at once: a rain shadow behind the Andes, and the cold Peru Current along the coast.',
        'The Pampas are wide grasslands in the south with deep, fertile soil that makes good farmland.',
        'Elevation changes climate inside one latitude: a hot lowland and a cool highland can sit side by side. Never explain temperature in this region with latitude alone.',
        'Much of Central America and the Caribbean is tropical, and hurricanes can strike the islands in the late summer and fall. Where plates meet, along western South America and in parts of Central America, earthquakes and volcanoes happen.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Latin America: Physical Geography' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
