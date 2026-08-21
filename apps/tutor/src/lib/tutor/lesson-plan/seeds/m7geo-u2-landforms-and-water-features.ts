/**
 * Grade 7 World Geography — Physical Geography: Landforms & Water Features.
 *
 * Concept-led (National Geography Standard 7). Teaches the VOCABULARY OF THE
 * PHYSICAL WORLD by definition -- what makes a thing a plateau rather than a
 * plain, an isthmus rather than a peninsula -- plus the two processes that
 * build and wear those features down (erosion and deposition), and then the
 * payoff: landforms are most of the reason people live where they live.
 *
 * NOTE FOR FUTURE AUTHORS: every feature here is defined by its properties,
 * never by a list of famous examples. A student who memorizes "the Andes are
 * mountains" cannot name a landform they have not met before; a student who
 * knows what a mountain IS can name any of them. Keep the definitions first
 * and the real places as anchors only.
 *
 * Real places named in this file are deliberately few, physical, and
 * long-settled: the five named ocean basins, the Nile flowing north to the
 * Mediterranean Sea, the Mississippi flowing south, the Amazon flowing east
 * across Brazil, the Andes down western South America, the Isthmus of Panama,
 * the Strait of Gibraltar. No heights, no lengths, no areas -- there are no
 * invented statistics in this course.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every arrangement of
 * land and water is described in words inside the item itself.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U2_LANDFORMS_AND_WATER_FEATURES: LessonPlan = {
  id: 'evelyn.ms.m7geo.landforms-and-water-features.v1',
  title: 'Landforms & Water Features',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.landforms-and-water-features',
      standard: 'M7GEO-2.1',
      description:
        'Identify the major landforms and water features by the characteristics that define them rather than by example, describe how erosion and deposition build them up and wear them down, and use them to explain where people settle (National Geography Standard 7: the physical processes that shape the patterns of Earth surface).',
    },
  ],
  prerequisites: ['m7geo.regions-and-place'],
  followUps: ['m7geo.plate-tectonics-and-natural-hazards'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the shape of the ground feel like something the student has already noticed, before any vocabulary arrives.',
      script:
        'Think about the last long drive you took, or the map screen in a game you play. The ground is never a blank flat sheet. There is a ridge the road has to curve around. There is a river the road crosses on a bridge. There is a lake the road bends away from, and then a stretch so flat and open that you can see all the way to the edge of the sky. All of those shapes have names, and today you get the names. But here is the part that surprises people. Those shapes are not scenery. They are most of the reason a town sits where it sits, and a road runs where it runs, and a farm is planted where it is planted. Learn the shapes, and you can start to explain where people live.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-landforms-and-water',
      kind: 'concept',
      goal: 'Install the landform and water-feature definitions, the erosion/deposition pair, and the settlement payoff.',
      keyIdeas: [
        'A LANDFORM IS A NATURAL SHAPE OF THE LAND, AND EVERY ONE OF THEM IS DEFINED BY WHAT IT IS LIKE, NOT BY A FAMOUS EXAMPLE. Two questions name almost any landform you meet. How high does this stand compared with the land immediately around it? And how flat is the top? Memorizing examples only lets you name the places on the list. Knowing the definitions lets you name a landform you have never heard of before.',
        'THE HIGH-AND-LOW FAMILY. A MOUNTAIN rises high and steeply above the land around it and usually narrows toward a peak. A HILL also rises above its surroundings, but not as far, with gentler and more rounded slopes. A PLATEAU is high land with a mostly flat top, so it is high like a mountain and flat like a plain, and its edges often drop away steeply. A PLAIN is a large area that is flat or gently rolling, with very little change in elevation across it. A VALLEY is the low, stretched-out ground between higher land, and very often a river runs along the bottom of it. A CANYON is a valley that is deep and narrow with steep rock walls, cut down into the land by a river.',
        'WHERE LAND AND WATER MEET, THE DEFINITION IS ABOUT HOW MUCH WATER TOUCHES THE LAND. An ISLAND is land with water on every side. A PENINSULA is land with water on most sides but still joined to a larger landmass. An ISTHMUS is a narrow strip of land that joins two larger land areas, with water on both sides of the strip -- the Isthmus of Panama joins North America to South America, and a canal was cut across it so that ships would not have to sail around a whole continent. A DELTA belongs to a different kind of definition: it is flat land built where a river reaches the sea or a lake, made out of the sand and mud the river drops there, and usually split by many channels.',
        'WATER FEATURES SORT BY SIZE, BY SALT, AND BY HOW ENCLOSED THEY ARE. The OCEANS are the largest bodies of salt water; geographers usually name five, the Pacific, Atlantic, Indian, Southern and Arctic, although all of them connect into one body of water. A SEA is smaller salt water, usually partly wrapped by land and joined to an ocean. A GULF is a large part of an ocean or sea that reaches into the land, often through a narrower opening, and a BAY is a smaller inlet where the coastline curves inward. A RIVER is fresh water flowing downhill in a channel, and a TRIBUTARY is a smaller river or stream that flows into a larger river instead of reaching the sea on its own. A LAKE has land all the way around it. A STRAIT is a narrow channel of water joining two larger bodies of water, with land on both sides, such as the Strait of Gibraltar between southern Europe and northern Africa, which connects the Atlantic Ocean to the Mediterranean Sea.',
        'EROSION TAKES MATERIAL AWAY AND DEPOSITION PUTS IT DOWN, AND BETWEEN THEM THEY BUILD EVERYTHING ON THIS LIST. Moving water, wind and ice pick up rock and soil and carry it off. That is EROSION, and it is how a river cuts a valley and then deepens it into a canyon. Wherever the moving water slows down, it drops what it was carrying. That is DEPOSITION, and it is how a river spreads flat soil across a floodplain and builds a delta at its mouth. Nothing here is finished. The land is being taken apart in one place and rebuilt in another right now, only slowly enough that a single human lifetime does not show it.',
        'LANDFORMS EXPLAIN WHERE PEOPLE LIVE, AND THIS IS THE WHOLE POINT OF LEARNING THEM. Plains and river valleys offer flat ground, deep soil and fresh water, so that is where the farms and the crowded cities are. In Egypt most people live in a narrow band along the Nile River and the delta at its mouth, with desert on either side. Mountains do the opposite: steep slopes are hard to farm, hard to build on and hard to cross, so fewer people live there, and a long range like the Andes down the western side of South America both separates the places on either side of it and shelters the valleys behind it. Rivers carry boats, goods and drinking water, so towns line them. And a strait or an isthmus is a narrow gap that traffic has to squeeze through, so ports, roads and money collect there. When you wonder why a city is where it is, look at the land first.',
      ],
      vocabulary: [
        { term: 'landform', definition: 'a natural shape of the land surface, such as a mountain, plateau, plain or valley.' },
        { term: 'plateau', definition: 'an area of high land with a mostly flat top, often with steep edges.' },
        { term: 'peninsula', definition: 'land with water on most sides that is still joined to a larger landmass.' },
        { term: 'isthmus', definition: 'a narrow strip of land joining two larger land areas, with water on both sides.' },
        { term: 'strait', definition: 'a narrow channel of water joining two larger bodies of water, with land on both sides.' },
        { term: 'delta', definition: 'flat land built at the mouth of a river out of the sand and mud the river drops there.' },
        { term: 'tributary', definition: 'a smaller river or stream that flows into a larger river.' },
        { term: 'erosion', definition: 'the carrying away of rock and soil by moving water, wind or ice.' },
        { term: 'deposition', definition: 'the dropping of carried rock and soil where the water, wind or ice slows down.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-features',
      kind: 'worked_example',
      problem:
        'Name each of the three features described below. There is no map and no picture -- everything you need is in the words.\n\n"A country has a long, steep mountain range down its eastern side. West of that range the land drops away and becomes flat and open for a very long distance, with almost no change in elevation anywhere across it. A river begins high in the mountains and runs west over that flat ground. Near the coast the river slows, splits into many channels, and drops the sand it has been carrying, building new flat land where it meets the sea. South of there, a narrow arm of the country reaches out into the sea, with water on its east, west and south sides, still joined to the mainland at its northern end."\n\nName (1) the flat open land west of the range, (2) the new flat land the river builds at the sea, and (3) the narrow arm of the country.',
      steps: [
        'Do not try to work out which real country this is. It is invented. These questions always ask the same thing: match the description against a definition.',
        'Feature 1. The words are flat, open, very large, almost no change in elevation. That is a PLAIN. Check the near miss before moving on: a plateau is also flat on top, but a plateau must stand HIGH above the land around it, and nothing here says it does. Flat alone is a plain. Flat and high is a plateau.',
        'Feature 2. The clue words are "drops the sand it has been carrying," "splits into many channels," and "where it meets the sea." Land built at the mouth of a river out of material the river laid down is a DELTA. Deposition made it, which is why it is new and flat.',
        'Feature 3. Water on three sides, still attached on the fourth. That is a PENINSULA. Check the near misses: with water on every side it would be an ISLAND, and if it were a narrow strip joining two larger land areas with water on both sides it would be an ISTHMUS. The difference is only how much water touches it and what it connects.',
        'One more thing worth noticing on the way out. The river runs WEST. The high ground in this description is in the east, so west is the downhill direction here. Rivers do not follow a compass; they follow the slope.',
      ],
      answer:
        '(1) a plain, because it is very large and flat with almost no change in elevation and is not described as standing high above the surrounding land; (2) a delta, because it is new flat land built at the mouth of the river out of sand the river dropped; (3) a peninsula, because it has water on three sides and is still joined to the mainland on the fourth.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-mountain-or-hill',
      kind: 'worked_example',
      problem:
        'A student writes: "A landform is a mountain if it is more than one thousand feet above sea level. Below that number it is only a hill." Explain what is wrong with that rule and give a better one.',
      steps: [
        'Test the rule against a situation. Picture a broad, flat area of high ground, and on top of it a gentle rounded rise. That rise can easily sit far above sea level and still look and behave exactly like a hill, because it barely lifts above the ground it stands on.',
        'Now flip the test. Picture a bare rock face that climbs steeply straight up from a low coastline to a sharp peak. Everyone who sees it calls it a mountain, and the reason has nothing to do with a number.',
        'So the measurement in the rule is the wrong measurement. Height above SEA LEVEL is not what your eyes are judging. What matters is how far the land rises above the ground immediately around it, which geographers call its prominence, and how steep the slopes are.',
        'There is also no worldwide rule to appeal to. Different countries and different books have used different cutoff numbers over the years, and no single official number governs them all. Mountain and hill are descriptive words, not measured categories.',
        'WRONG: "Anything above one thousand feet is a mountain." CORRECT: "A mountain rises high and steeply above the land around it and usually narrows to a peak. A hill rises less far, with gentler and more rounded slopes. It is a comparison with the neighboring land, not a number."',
        'Hold onto that idea, because plateau and plain work the same way. A plateau is not high in absolute terms; it is high compared with the country around it.',
      ],
      answer:
        'There is no official worldwide height cutoff, and height above sea level is the wrong measure anyway. Mountain and hill describe how far the land rises above the ground immediately around it and how steep its slopes are. A rounded rise on top of high ground is still a hill, and a steep sharp peak rising from a low coast is still a mountain.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-plateau',
      kind: 'try_yourself',
      problem:
        'A large area of land is flat on top, with almost no change in elevation across it. It stands well above the lower country all around it, and its edges drop away steeply. What is this landform called?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A plain' },
        { id: 'b', text: 'A plateau', correct: true },
        { id: 'c', text: 'A valley' },
        { id: 'd', text: 'A canyon' }
      ],
      expectedAnswer: 'A plateau',
      hints: [
        'Two facts are given: the top is flat, and the whole thing stands high above the land around it. Find the one word that requires BOTH.',
        'A plain is flat but is not described as standing high above its surroundings. A valley and a canyon are both LOW ground between higher land, which is the opposite of what is described.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-isthmus',
      kind: 'try_yourself',
      problem:
        'A narrow strip of land joins two large landmasses together. There is open ocean on one side of the strip and open ocean on the other side. What is the narrow strip called?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A strait' },
        { id: 'b', text: 'A peninsula' },
        { id: 'c', text: 'A delta' },
        { id: 'd', text: 'An isthmus', correct: true }
      ],
      expectedAnswer: 'An isthmus',
      hints: [
        'A strait and an isthmus are mirror images of each other. One is narrow WATER between two larger bodies of water. The other is narrow LAND between two larger land areas. Ask which one is narrow in this description.',
        'The strip here is land, and it JOINS two landmasses rather than reaching out from one of them into the water, so peninsula does not fit either.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-where-people-live',
      kind: 'try_yourself',
      problem:
        'A country has a wide, flat river valley running through its middle and a high, steep mountain range along one edge. Where would you expect to find most of the farms and the largest towns, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'On the mountain slopes, because higher ground is easier to build on' },
        { id: 'b', text: 'Spread evenly across the country, because landforms do not affect where people settle' },
        { id: 'c', text: 'In the river valley, because it has flat land, deep soil and fresh water', correct: true },
        { id: 'd', text: 'Far away from the river, because flooding makes river valleys useless for farming' }
      ],
      expectedAnswer: 'In the river valley, because it has flat land, deep soil and fresh water',
      hints: [
        'Ask the land the questions a farmer and a builder would ask. Is it flat enough to plow and to build on? Is the soil deep? Is there fresh water? Can goods move through easily?',
        'Steep slopes fail nearly all of those tests. And a river that floods also drops fresh soil when it slows down, which is why valley farmland is usually the best farmland a country has.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rivers-and-deltas',
      kind: 'misconception_check',
      question:
        'A student says: "Rivers flow south, so on any map the river has to be heading toward the bottom of the page. Also, a delta and a peninsula are the same thing, since both are just land sticking out into the water." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'Rivers flow south, so a river always heads toward the bottom of a map.',
          misconception:
            'Turning a compass direction into a rule for river flow. It usually starts because the first rivers a student learned about happened to run south, and because "down" on a page feels like it must mean downhill.',
          correctsTo:
            'Rivers flow DOWNHILL, from higher ground toward lower ground, and downhill can point in any compass direction at all. The Nile flows NORTH through Egypt and empties into the Mediterranean Sea. The Mississippi River flows SOUTH through the middle of the United States. The Amazon flows EAST across Brazil to the Atlantic Ocean. Three rivers, three different directions. And down on a map simply means south. A map is a flat picture of the ground from above; it does not show elevation by which edge of the paper is nearer your lap. To predict which way a river runs, find the high ground and the low ground, not the compass.',
        },
        {
          answer: 'A delta and a peninsula are the same thing, because both are land next to water.',
          misconception:
            'Sorting features by what they look like from far away instead of by what defines them. Both are land near water, so the student files them together.',
          correctsTo:
            'They are defined by completely different questions. A PENINSULA is defined by how much water surrounds it: water on most sides, still joined to a larger landmass. It can be made of any kind of rock and can be extremely old. A DELTA is defined by WHERE it sits and HOW it was built: flat, new land at the mouth of a river, made out of the sand and mud the river dropped when it slowed down, and usually split into many channels. A peninsula is a shape. A delta is a shape plus a builder, and that builder is deposition. WRONG: "A delta is land sticking out into the sea." CORRECT: "A delta is land the river itself built at its own mouth." The Nile builds a delta where it reaches the Mediterranean Sea.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Landforms are named by their definitions -- how far they rise above the land around them, and how flat the top is -- never by a list of famous examples.',
        'Mountain and hill are a comparison, not a height number. Prominence above the surrounding land and steepness decide it, and no official worldwide cutoff exists.',
        'Island, peninsula and isthmus differ only in how much water touches the land and what it connects. A strait is narrow water between two larger waters; an isthmus is narrow land between two larger lands.',
        'Erosion carries rock and soil away and cuts valleys and canyons. Deposition drops it again and builds floodplains and deltas. Landforms change constantly, just slowly.',
        'Rivers flow downhill, which can be any direction on the compass. The Nile flows north, the Mississippi flows south, the Amazon flows east.',
        'Landforms explain where people live. Plains and river valleys hold the farms and the cities, mountains isolate and shelter, rivers carry trade and drinking water, and a strait or an isthmus concentrates traffic into a narrow gap.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Landforms & Water Features' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
