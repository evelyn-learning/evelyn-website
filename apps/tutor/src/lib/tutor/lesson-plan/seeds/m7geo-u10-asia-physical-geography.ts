/**
 * Grade 7 World Geography — Asia: Physical Geography.
 *
 * The opening row of Unit 10, the final unit (National Geography Standard 4).
 * It is a PHYSICAL row: mountains, plateaus, the monsoon, rivers, deserts,
 * islands and plate boundaries. History, culture, population and economy
 * belong to 10.2 and 10.3 and are deliberately absent here.
 *
 * SCOPE NOTE FOR FUTURE AUTHORS: Russia and Siberia are row 8.4, and the
 * Middle East is row 9.3, even though both sit on the Asian landmass. This
 * file stays in South, East and Southeast Asia so that it does not teach the
 * same ground twice.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters most in this file: Asia is
 * the largest continent, and the single most common error a twelve-year-old
 * brings to it is treating it as ONE PLACE with one climate and one landscape.
 * This file corrects that in the hook, in the first key idea and in the
 * misconception check, on purpose. Do not undo it. Every fact here is pinned
 * to a named part of Asia rather than to the whole continent.
 *
 * There are deliberately NO NUMBERS anywhere in this file: no heights, no
 * lengths, no areas, no rainfall totals, no populations, no island counts. A
 * remembered wrong number is worse than no number. Measured physical
 * superlatives -- largest continent, highest mountain range, highest point on
 * land, longest river in Asia -- are fine and carry no judgment. Judgments
 * about places, statements about what people are like, and territorial or
 * sovereignty claims of any kind are not fine and appear nowhere.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every arrangement of
 * places is described in words inside the item that needs it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U10_ASIA_PHYSICAL_GEOGRAPHY: LessonPlan = {
  id: 'evelyn.ms.m7geo.asia-physical-geography.v1',
  title: 'Asia: Physical Geography',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.asia-physical-geography',
      standard: 'M7GEO-10.1',
      description:
        'Describe the mountains, plateaus, rivers, deserts and islands of South, East and Southeast Asia, and explain how a plate collision, elevation, distance from the ocean and the seasonal reversal of the monsoon shape the physical geography of the largest continent (National Geography Standard 4: the physical and human characteristics of places).',
    },
  ],
  prerequisites: ['m7geo.africa-middle-east-development'],
  followUps: ['m7geo.south-and-east-asia-culture'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Land the size and range of the continent immediately, so that every later fact gets attached to a part of Asia rather than to all of it.',
      script:
        'Imagine two photographs taken on the very same day, and both of them were taken in Asia. In the first one, a mountain slope is buried in snow and the air is so thin and so cold that nobody stays up there for long. In the second one, warm rain is coming down through the leaves of a rainforest, and it has rained every afternoon for weeks. Same continent. Same day. Now hold on to one more thing about that second photograph. The rain there is not random. It arrives at roughly the same time every year, it leaves at roughly the same time, and everyone who farms knows the pattern. By the end of this lesson you will be able to explain both photographs, and you will know why the rain keeps its schedule.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-asia-physical-systems',
      kind: 'concept',
      goal: 'Install the six physical anchors of the row -- scale and variety, the collision that built the Himalayas, the monsoon as a wind reversal, the great rivers, the interior deserts, and the tropical, tectonically active edge.',
      keyIdeas: [
        'ASIA IS THE LARGEST CONTINENT, AND NO SINGLE DESCRIPTION FITS IT. It holds many countries and many languages, and environments that could hardly be more different from one another: a high plateau that is cold and dry all year, tropical rainforest, desert with freezing winters, and broad river plains with rich soil. So whenever you learn a fact in this lesson, attach it to a PART of Asia. Never attach it to the whole continent.',
        'THE HIMALAYAS WERE PUSHED UP WHERE TWO PLATES COLLIDED, AND THEY ARE STILL RISING. Remember from Unit 2 that where two plates push against each other, the crust between them crumples and folds upward. That is exactly what built the Himalayas, the highest mountain range on Earth. The collision never stopped, so the range is still slowly rising today. Mount Everest, the highest point on the land surface of Earth, stands in this range. North of the Himalayas lies the Tibetan Plateau, a vast plateau lifted high above sea level. Air is colder at high elevation, and the mountains block moist air from reaching it, so the plateau is cold and dry -- both of those reasons come straight out of Unit 2.',
        'THE MONSOON IS A SEASONAL WIND REVERSAL, NOT A KIND OF STORM. It is the defining climate system of South and Southeast Asia. In summer the land heats up faster than the ocean does. The warm air over the land rises, and moist air is drawn in from the ocean to replace it, and that ocean air brings heavy rain. In winter the pattern runs backward: the land cools faster than the ocean, and the wind blows off the land instead. Air coming off the land is dry, so the rain stops. The rule to hold on to is that the rain follows the direction the wind comes from. Wind in from the ocean means rain. Wind out off the land means dry.',
        'GREAT RIVERS RISE IN THE MOUNTAINS AND BUILD FLAT, FERTILE PLAINS AND DELTAS. Two things feed them: meltwater from snow and ice high in the mountains, and monsoon rain. In South Asia the Indus, the Ganges and the Brahmaputra all run down out of the mountains, and the Ganges and the Brahmaputra reach the sea together through a vast delta. In China the Yangtze, which is the longest river in Asia, and the Huang He, also called the Yellow River, flow east to the sea. In Southeast Asia the Mekong runs south and reaches the sea through a large delta. A river slows as it crosses flat land, and slowing water drops the sediment it was carrying, which is why the soil of these plains and deltas is so good for farming.',
        'THE INTERIOR HOLDS DESERTS, AND THOSE DESERTS HAVE COLD WINTERS. The Gobi in the north and the Taklamakan to the west of it are dry for two reasons you already know. First, they sit far inland, so air arriving there has already dropped most of its moisture along the way. Second, they lie behind mountains, and mountains force rising air to release its rain on the windward side, leaving dry air to come down the other side -- a rain shadow. Being far from any ocean also means there is no large body of water nearby to even out the temperature, so summers are hot and winters are bitterly cold. A desert is defined by how dry it is, not by how hot it is.',
        'THE SOUTHEASTERN AND EASTERN EDGES ARE TROPICAL AND TECTONICALLY ACTIVE. Southeast Asia is a mix of peninsulas reaching south from the mainland and large archipelagos, which are groups of many islands, and its climate is tropical. Japan, the Philippines and Indonesia sit close to boundaries between tectonic plates, in the belt known as the Ring of Fire, and that is why earthquakes, volcanic eruptions and tsunamis happen there. It is the same plate movement that raised the Himalayas, showing up in a different form at a different kind of boundary.',
      ],
      vocabulary: [
        { term: 'monsoon', definition: 'a wind system that reverses direction between seasons, bringing a wet season and a dry season.' },
        { term: 'plateau', definition: 'a large area of fairly level land raised well above the land or sea around it.' },
        { term: 'delta', definition: 'the flat, fan-shaped area of sediment a river builds where it drops its load and enters the sea.' },
        { term: 'archipelago', definition: 'a group or chain of many islands.' },
        { term: 'rain shadow', definition: 'the dry area on the far side of a mountain range from the wind, where the air has already lost its moisture.' },
        { term: 'Ring of Fire', definition: 'the belt of frequent earthquakes and volcanoes that follows plate boundaries around the edges of the Pacific Ocean.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-monsoon-reversal',
      kind: 'worked_example',
      problem:
        'A farming town sits on the southern coast of Asia, facing the open ocean. Here is what the wind does there across a year.\n\nSummer: the wind blows in from the ocean toward the land.\nWinter: the wind blows out from the land toward the ocean.\n\nWhich season is the wet one, and why? Explain the mechanism, not just the answer.',
      steps: [
        'Start with what is different about land and ocean. Land heats up faster than water when the sun is strong, and it also cools down faster when the sun is weak. Water changes temperature slowly.',
        'Now take summer. The sun is strong, so the land heats up quickly and the air sitting on top of it gets warm. Warm air rises.',
        'When that air rises, something has to move in underneath to take its place. The nearest supply is the air over the ocean, so air is drawn in from the ocean toward the land. That is the summer wind direction given in the problem, and the mechanism explains it.',
        'Ask the key question: what is that incoming air carrying? It has been sitting over open ocean, so it is loaded with moisture. Moist air pushed inland and forced to rise cools down, and cooling moist air releases its water. That is heavy rain. So SUMMER is the wet season.',
        'Now run winter the same way. The sun is weak, the land cools faster than the ocean, and the air over the land is now the cooler, heavier air. It flows outward, off the land and toward the ocean. That is the winter direction given in the problem.',
        'What is that air carrying? It came across land, not ocean, so it is dry. Dry air brings no rain. WINTER is the dry season.',
        'The single sentence worth keeping: the monsoon is a seasonal REVERSAL of the wind, and the rain follows the direction the wind comes from. Wind in from the ocean is wet. Wind out off the land is dry.',
      ],
      answer:
        'Summer is the wet season. The land heats faster than the ocean, warm air rises over the land, and moist air is drawn in from the ocean to replace it, so heavy rain falls. In winter the wind reverses and blows off the land, and land air is dry, so the rain stops. The monsoon is a seasonal wind reversal, and the rain follows the direction the wind comes from.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-why-the-interior-is-dry',
      kind: 'worked_example',
      problem:
        'Two places in Asia, described only by where they sit.\n\nPlace A: on a tropical coast, facing the open ocean, with no mountains between it and the water.\nPlace B: deep in the interior of the continent, a very long way from any ocean in every direction, with a high mountain range standing between it and the nearest sea.\n\nOne of these is a desert with hot summers and freezing winters. Which one, and give both reasons for the dryness and the reason for the temperature swing.',
      steps: [
        'First ask where rain comes from in the first place. Nearly all of it starts as water evaporating from the ocean. So the real question is how much ocean moisture can reach each place.',
        'Place A is right on the ocean with nothing in the way, so moist air reaches it easily. Place A is not the desert.',
        'Reason one for Place B. It is a very long way inland. Air traveling that far over land keeps losing moisture as rain along the route, so by the time it arrives there is little left to fall. That is distance from the ocean doing the work.',
        'Reason two for Place B. A mountain range stands between it and the sea. Air moving toward the mountains is forced upward, cools, and drops its rain on the windward side. The air that comes down the far side is already wrung out. That far side is the rain shadow, and Place B sits in it.',
        'Now the temperature swing, which is a separate question. A large body of water warms and cools slowly, so any place near one has its temperature evened out. Place B has no ocean nearby to do that, so nothing holds the temperature steady: summers get hot and winters get bitterly cold.',
        'WRONG conclusion to avoid: "Place B cannot be a desert, because its winters are freezing." CORRECT: a desert is defined by how DRY it is, not by how hot it is. The Gobi and the Taklamakan are exactly this kind of desert.',
      ],
      answer:
        'Place B is the desert. It is dry for two reasons: it lies very far inland, so air reaching it has already lost most of its moisture, and it sits in the rain shadow behind a mountain range. Its temperatures swing because there is no large body of water nearby to even them out. Deserts are defined by dryness, not by heat.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-monsoon-wet-season',
      kind: 'try_yourself',
      problem:
        'The monsoon of South and Southeast Asia has a wet season and a dry season. Which statement describes the WET season correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The wind blows from the land toward the ocean, so moist air arrives and heavy rain falls.' },
        { id: 'b', text: 'The wind blows from the ocean toward the land, so dry air arrives and little rain falls.' },
        { id: 'c', text: 'The wind blows from the ocean toward the land, so moist air arrives and heavy rain falls.', correct: true },
        { id: 'd', text: 'The wind keeps the same direction all year, and only the temperature changes between the seasons.' }
      ],
      expectedAnswer: 'The wind blows from the ocean toward the land, so moist air arrives and heavy rain falls.',
      hints: [
        'Air picks up moisture over water and loses it over land. Ask of each choice: where has this wind just been?',
        'One choice denies that the wind reverses at all. Check that one against the meaning of the word monsoon before you look at the others.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-still-rising-range',
      kind: 'try_yourself',
      problem:
        'The Himalayas are the highest mountain range on Earth, and they are still slowly rising today. Which explanation fits both of those facts?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Two plates pulled away from each other, and the land between them dropped down and left the peaks standing.' },
        { id: 'b', text: 'Rivers cut deep valleys into flat land, and the ground left standing between the valleys became the range.' },
        { id: 'c', text: 'Two plates collided and crumpled the crust between them upward, and they are still pressing together.', correct: true },
        { id: 'd', text: 'The range was pushed up all at once long ago, and nothing has moved there since.' }
      ],
      expectedAnswer: 'Two plates collided and crumpled the crust between them upward, and they are still pressing together.',
      hints: [
        'Two things need explaining, not one: how the range got so high, and why it is STILL getting higher. Cross out any choice that only explains one of them.',
        'Going back to Unit 2: when two plates push toward each other, what happens to the crust caught in between?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cold-desert',
      kind: 'try_yourself',
      problem:
        'A student reads that a large desert sits deep in the interior of Asia and that its winters are freezing cold. The student says: "That cannot be a desert, because deserts are hot." What is the best response?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A desert is defined by how dry it is, not by how hot it is, so a desert can have freezing winters.', correct: true },
        { id: 'b', text: 'The student is right, and a dry place with cold winters should be called a plateau instead.' },
        { id: 'c', text: 'The student is right, because deserts must be hot all year, so this place is really a grassland.' },
        { id: 'd', text: 'A desert is defined by how dry it is, but only places close to the Equator can be dry enough to count.' }
      ],
      expectedAnswer: 'A desert is defined by how dry it is, not by how hot it is, so a desert can have freezing winters.',
      hints: [
        'Go back to the definition. Which measurement decides whether a place counts as a desert: how much rain it gets, or how warm it gets?',
        'Two of these choices start correctly and then add a condition that is not part of the definition. Read the second half of every choice.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-asia-and-monsoon',
      kind: 'misconception_check',
      question:
        'A student writes: "Asia is hot and rainy, and the monsoon is the big storm that hits it every year." Two separate things have gone wrong there. What are they?',
      commonErrors: [
        {
          answer: 'Asia is hot and rainy.',
          misconception:
            'Treating the largest continent on Earth as a single place with a single climate, usually by taking one region seen in a photograph or a film and stretching it across everything.',
          correctsTo:
            'WRONG: "Asia is hot and rainy." CORRECT: different parts of Asia have completely different climates, and a description has to name the part. Southeast Asia is tropical and wet. The Tibetan Plateau is cold and dry all year because of its elevation. The Gobi and the Taklamakan, deep in the interior, are deserts with freezing winters. The great river plains are flat and fertile. All of that is Asia at the same moment. Pin every claim to a region, never to the continent.',
        },
        {
          answer: 'The monsoon is the big storm that hits Asia every year.',
          misconception:
            'Hearing the word monsoon used for heavy rain and concluding that the monsoon IS the rain, or a single storm, rather than the wind system that causes the rain.',
          correctsTo:
            'WRONG: "The monsoon is a storm." CORRECT: the monsoon is a SEASONAL REVERSAL OF THE WIND, and it has two halves, not one. In summer the wind blows in from the ocean and brings months of rain. In winter the very same system reverses and blows off the land, and those months are dry. The dry season is just as much part of the monsoon as the wet season is. The rain is the result; the wind reversal is the thing itself.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Asia is the largest continent, and no single description fits it. Attach every fact to a part of Asia.',
        'The Himalayas were pushed up where two plates collided, they are still rising, and Mount Everest is the highest point on the land surface of Earth. North of them the Tibetan Plateau is cold and dry because it is so high.',
        'The monsoon is a seasonal reversal of the wind. Wind in from the ocean brings the wet season; wind out off the land brings the dry season.',
        'The Indus, the Ganges and the Brahmaputra in South Asia, the Yangtze and the Huang He in China, and the Mekong in Southeast Asia rise in the mountains, are fed by meltwater and monsoon rain, and build fertile plains and deltas.',
        'The Gobi and the Taklamakan are dry because they are far inland and behind mountains, and their winters are cold. Deserts are defined by dryness, not by heat.',
        'Southeast Asia is tropical, with peninsulas and large archipelagos. Japan, the Philippines and Indonesia sit near plate boundaries, so earthquakes, volcanoes and tsunamis occur there.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Asia: Physical Geography' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
