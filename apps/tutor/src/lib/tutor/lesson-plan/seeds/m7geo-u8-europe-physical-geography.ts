/**
 * Grade 7 World Geography — Europe & Russia: Physical Geography.
 *
 * The opening row of Unit 8 (National Geography Standard 4). It does the same
 * job for Europe and Russia that 7.1 did for Latin America: take the tools
 * built in Units 1 and 2 -- location, landforms, and the controls on climate
 * -- and point them at one region. It is a PHYSICAL row: coastlines,
 * peninsulas, plains, mountains, rivers and climate. History, culture,
 * politics and current events belong to 8.2, 8.3 and 8.4 and are deliberately
 * absent here. The Europe/Asia boundary is taught as a CONVENTION OF
 * DEFINITION -- one landmass, one agreed line -- and never as a political
 * matter.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters: every claim in this file is
 * about a real place, on a page a twelve-year-old will read. The claims were
 * chosen because they are long-settled physical facts -- the Alps run across
 * southern Europe, the Rhine flows north to the North Sea, the Danube flows
 * east to the Black Sea, the Volga is the longest river in Europe. There are
 * deliberately NO NUMBERS anywhere in this file: no lengths, no heights, no
 * areas, no populations, no temperatures, no counts of time zones. A
 * remembered wrong number is worse than no number. If you extend this file,
 * extend it with facts of the same kind, and drop anything you cannot
 * confirm.
 *
 * The file also says nothing about what the people of the region are like,
 * and ranks no place against another. Measured physical superlatives (longest
 * river in Europe, largest country by area) are fine. Judgements about places
 * are not. Keep it that way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every arrangement of
 * places is described in words inside the item that needs it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U8_EUROPE_PHYSICAL_GEOGRAPHY: LessonPlan = {
  id: 'evelyn.ms.m7geo.europe-physical-geography.v1',
  title: 'Europe & Russia: Physical Geography',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.europe-physical-geography',
      standard: 'M7GEO-8.1',
      description:
        'Describe the coastline, peninsulas, plains, mountain ranges and major rivers of Europe and Russia, and explain how nearness to the sea, a warm ocean current and distance inland produce the different climates found across the region (National Geography Standard 4: the physical and human characteristics of places).',
    },
  ],
  prerequisites: ['m7geo.latin-america-environment-issues'],
  followUps: ['m7geo.europe-history-and-culture'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with a weather puzzle a twelve-year-old can feel, and with the one shape fact that runs the whole lesson.',
      script:
        'Here is a puzzle to start with. Two harbor towns sit the same distance north of the Equator. One of them freezes over every winter and the boats stay stuck for months. The other one never freezes at all, and fishing boats go out in January. Same distance north. Completely different winter. Something other than latitude is doing the work, and by the end of this lesson you will be able to name it. The answer starts with the shape of the land. Europe is a strange shape. It is jagged, full of arms of land poking out into water, and almost nowhere in the western part of it is far from the sea. That shape changes the weather, and it changes what people can reach. Let us look at the region.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-europe-physical',
      kind: 'concept',
      goal: 'Lay out the shape, the plain, the mountains, the rivers and the climates, and teach the Europe/Asia line as a convention.',
      keyIdeas: [
        'EUROPE IS A PENINSULA OF PENINSULAS. A peninsula is a piece of land with water on most sides. Europe itself sticks out from the western end of a huge landmass, and then smaller peninsulas stick out from Europe. The large ones to know are the Scandinavian Peninsula in the north, the Iberian Peninsula in the southwest, the Italian Peninsula reaching south into the Mediterranean, and the Balkan Peninsula in the southeast. The seas around them are the Mediterranean Sea to the south, the North Sea and the Baltic Sea in the north, and the Black Sea in the southeast. Because the coastline bends in and out so much, no part of western Europe is very far from the sea. Hold on to that single fact. It explains an enormous amount about this region.',
        'THE NORTH IS FLAT -- THE NORTH EUROPEAN PLAIN. Across the northern part of Europe, starting at the Atlantic coast and running eastward, lies a wide belt of low, flat land called the North European Plain. Much of its soil is fertile, so a great deal of the farming in Europe happens there. Flat land with few natural barriers is also easy to cross, which matters for roads, railroads and rivers.',
        'THE MOUNTAINS SIT MOSTLY IN THE SOUTH AND THE EAST, AND ONE RANGE DOES AN UNUSUAL JOB. The Alps curve across the south-center of Europe and separate the Italian Peninsula from the land to the north. The Pyrenees stand between the Iberian Peninsula and the rest of Europe. The Carpathians curve through central and eastern Europe. And the Ural Mountains run north to south through Russia. That last range is the one usually named as the dividing line between Europe and Asia, so it is worth a careful look. THE LINE BETWEEN EUROPE AND ASIA IS A CONVENTION, NOT A WALL. Europe and Asia sit on one single, unbroken landmass, sometimes called Eurasia. No ocean divides them. So geographers agreed on a line, and the line most often used runs along the Ural Mountains. Agreeing on a line is exactly what a CONVENTION is: a rule people settled on because it is useful, not a fact the land forced on them. This is why Russia is described as spanning two continents. Notice what this does NOT mean. It does not mean the Urals are a barrier nothing crosses, and it does not mean that two continents must always be separated by water. RUSSIA IS THE LARGEST COUNTRY IN THE WORLD BY AREA, it stretches so far from west to east that it covers many time zones, and the Ural convention places part of it in Europe and the much larger part in Asia.',
        'THREE RIVERS TO KNOW, AND WHY RIVERS MATTER HERE. The Rhine flows north and empties into the North Sea. The Danube flows east, passing through many countries, and empties into the Black Sea. The Volga is the longest river in Europe; it flows through Russia and empties into the Caspian Sea, which is ringed by land and has no natural outlet to the ocean. Many of these rivers are navigable, meaning boats can travel on them. Put navigable rivers together with that deeply indented coastline and you get a region where goods can reach a very large amount of land by water. That is the access advantage you met in Unit 5 when you studied trade.',
        'CLIMATE -- AND THE ANSWER TO THE HARBOR PUZZLE. Much of northwestern Europe is far milder than its latitude alone would predict, and there are two Unit 2 controls behind it. First, a warm ocean current called the North Atlantic Drift flows toward northwestern Europe. Second, the prevailing winds here blow from the west, off the ocean and onto the land, so they carry that milder ocean air inland. Southern Europe has a Mediterranean climate: hot dry summers and mild wet winters. Now travel east, away from the ocean. The ocean influence fades, and the climate becomes continental, which means the gap between summer and winter temperatures grows larger. Keep going east into Siberia and it becomes subarctic: long, very cold winters and short summers. So this region is not one climate. It holds mild coasts, dry summers in the south, and deep cold in the north and east.',
        'SIBERIA IS THE COLD, FORESTED EAST. Siberia is the name for the huge part of Russia that lies east of the Ural Mountains. Much of it is cold and thinly settled, and much of it is covered by taiga, a vast forest of evergreen trees. Over large areas the ground stays frozen all year long, even in summer. Frozen ground like that is called permafrost, and building on it is difficult, because heat from a building can thaw the ground underneath.',
      ],
      vocabulary: [
        { term: 'peninsula', definition: 'a piece of land with water on most of its sides.' },
        { term: 'plain', definition: 'a large area of flat or gently rolling land.' },
        { term: 'convention', definition: 'a rule or line that people agreed on because it is useful, rather than one the land itself creates.' },
        { term: 'navigable river', definition: 'a river deep enough and wide enough for boats to travel on.' },
        { term: 'ocean current', definition: 'a stream of water moving through the ocean, which can carry warm or cold water far from where it started.' },
        { term: 'continental climate', definition: 'the climate of places far from the ocean, with a large gap between summer and winter temperatures.' },
        { term: 'taiga', definition: 'the wide belt of evergreen forest that grows across the cold northern parts of the region.' },
        { term: 'permafrost', definition: 'ground that stays frozen all through the year, including the summer.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-europe-asia-boundary',
      kind: 'worked_example',
      problem:
        'A student asks: "If Europe and Asia are two different continents, where is the gap between them? Every other continent I can find has water around it." Answer the question, and explain what geographers mean when they call the Europe and Asia boundary a convention.',
      steps: [
        'Take the student question seriously first, because the reasoning behind it is good. The student has noticed a real pattern: for most continents, you can point at an ocean and say the land stops here.',
        'Now check whether the pattern holds for Europe and Asia. Go looking for the water between them. There is none. Europe and Asia sit on one continuous piece of land, with no ocean crossing it. Geographers sometimes call that whole landmass Eurasia for exactly this reason.',
        'So the honest answer to where is the gap is that there is no gap in the land. If we still want two names, the line has to come from somewhere other than the land.',
        'That somewhere is agreement. People who make maps settled on a line, and the one most often used follows the Ural Mountains, which run north to south through Russia. A line people agreed on because it is useful is called a CONVENTION.',
        'Test the idea by asking what would happen if everyone agreed on a different line. The rocks would not move. No river would change course. Only the labels would change. That is the tell for a convention: the thing it describes does not depend on it.',
        'Now say clearly what this does not mean, because this is where students overcorrect. WRONG: "Since it is only a convention, Europe is not real." CORRECT: "Europe is a real region with a shape, a coastline and climates you can measure. What is agreed on is where to draw its eastern edge." Conventions are useful, not fake.',
        'One more thing follows from all of this. Because the agreed line runs through Russia, Russia is described as lying in both Europe and Asia at once. That sounds strange only until you remember there is no break in the land for it to sit on one side of.',
      ],
      answer:
        'There is no water gap, because Europe and Asia are one continuous landmass. The boundary between them is a convention, which means a line people agreed on because it is useful, and the line most often used follows the Ural Mountains. Changing the agreed line would change the labels and nothing about the land, and the agreed line is why Russia is described as spanning two continents.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-mild-northwest',
      kind: 'worked_example',
      problem:
        'Solve the puzzle from the start of the lesson using the controls on climate from Unit 2.\n\n"Two harbor towns lie at the same latitude, far north of the Equator. Westport sits on the northwestern coast of Europe, facing the open Atlantic Ocean. Deepland sits far inland, deep inside the continent, with no ocean anywhere near it. Westport harbor stays free of ice all winter. Deepland freezes hard every winter and swings to real heat in summer. Explain both towns."',
      steps: [
        'Start with what the two towns share, so you can rule it out. Same latitude, both far north of the Equator. The sun reaches them at about the same angle through the year. So latitude cannot be what separates them.',
        'Now find what is different: Westport is on the coast facing an ocean, and Deepland is far from any ocean. The difference is nearness to water, which is Unit 2 territory.',
        'Explain Westport with two controls working together. First, a warm ocean current, the North Atlantic Drift, flows toward northwestern Europe. Second, the prevailing winds in this part of the world blow from the west, which means off the ocean and onto the land. So milder ocean air is delivered inland instead of staying out at sea. Both parts are needed. A warm current with the wind blowing the other way would leave far less of the warmth on the land.',
        'Explain Deepland with the same idea turned off. No ocean is near it, so nothing there is holding the temperature steady. Land heats quickly and cools quickly, so an inland place swings hard: cold winters, warm summers. That large summer-to-winter gap is what continental means.',
        'Say what the pair proves about latitude. WRONG: "Westport must be closer to the Equator than Deepland, because it is warmer." The case says the two towns share a latitude, so that cannot be it. CORRECT: "Westport is milder because a warm current plus onshore westerly winds bring ocean air over it, while Deepland is far from the ocean and swings between extremes."',
        'Carry the general rule forward, because it works all across this region. Latitude sets the starting point for a climate. Nearness to the ocean, and what the ocean and the wind are doing, can move the answer a long way from that starting point.',
      ],
      answer:
        'Latitude is the same for both towns, so it explains neither. Westport stays mild because the North Atlantic Drift, a warm ocean current, reaches northwestern Europe and the prevailing westerly winds blow that milder ocean air onto the land. Deepland is far from any ocean, so nothing steadies its temperature and it swings between a cold winter and a warm summer, which is a continental climate.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-boundary-convention',
      kind: 'try_yourself',
      problem:
        'Geographers say the boundary between Europe and Asia is a convention. What does that mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The line was measured with instruments, so it is exact down to the meter.' },
        {
          id: 'b',
          text: 'People agreed on a line, because the land itself continues with no break between them.',
          correct: true,
        },
        { id: 'c', text: 'The line is a border between two countries, so it changes when countries change.' },
        { id: 'd', text: 'The line is drawn wherever one ocean meets another ocean.' }
      ],
      expectedAnswer: 'People agreed on a line, because the land itself continues with no break between them.',
      hints: [
        'A convention is something people settled on because it is useful. Ask which choice describes an agreement rather than a measurement or a barrier.',
        'Two of these confuse a boundary between continents with something else: a border between countries, and a meeting of oceans. A continent boundary is neither of those.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mild-port',
      kind: 'try_yourself',
      problem:
        'A port on the northwestern coast of Europe stays free of ice all winter. Another place at the same latitude, far inland, freezes for months. Which explanation fits best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The port lies much closer to the Equator than the inland place.' },
        { id: 'b', text: 'The port sits at a much higher elevation, and air gets warmer as you climb.' },
        { id: 'c', text: 'The port is farther from the ocean, and land holds its heat better than water does.' },
        {
          id: 'd',
          text: 'A warm ocean current reaches the coast, and winds off the ocean carry that milder air onto the land.',
          correct: true,
        }
      ],
      expectedAnswer:
        'A warm ocean current reaches the coast, and winds off the ocean carry that milder air onto the land.',
      hints: [
        'Read the stem again for the fact it hands you on purpose: the two places share a latitude. So cross out any answer whose reason is about being closer to the Equator.',
        'Check the remaining reasons against Unit 2. Does air get warmer or colder as elevation rises? And is the port near the ocean or far from it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-danube-mouth',
      kind: 'try_yourself',
      problem:
        'The Danube River flows east across Europe, passing through many countries on the way. Into which sea does it empty?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Black Sea', correct: true },
        { id: 'b', text: 'The North Sea' },
        { id: 'c', text: 'The Baltic Sea' },
        { id: 'd', text: 'The Caspian Sea' }
      ],
      expectedAnswer: 'The Black Sea',
      hints: [
        'Use the direction the stem gives you. The Danube flows EAST, so rule out the seas that lie to the north of the continent.',
        'Sort the three rivers from the lesson by where each one ends: the Rhine flows north to the North Sea, and the Volga ends in the Caspian Sea. That leaves one sea for the Danube.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mild-means-south',
      kind: 'misconception_check',
      question:
        'A student writes two sentences about the region: "Northwestern Europe has mild winters, so it must be pretty far south." and "That means Europe and Russia have a mild climate." What is wrong with each one?',
      commonErrors: [
        {
          answer: 'Northwestern Europe has mild winters, so it must be pretty far south.',
          misconception:
            'Reading temperature backward into latitude, and treating latitude as the only control on climate. The student knows that lower latitudes are generally warmer, and assumes any mild place must therefore be a southern one.',
          correctsTo:
            'Northwestern Europe lies well north, and it is still mild. Two Unit 2 controls explain that. A warm ocean current, the North Atlantic Drift, flows toward the northwestern coast, and the prevailing winds there blow from the west, off the ocean, so they carry that milder air onto the land. WRONG: "It is mild, so it must be far south." CORRECT: "It is mild for its latitude, because a warm current and onshore westerly winds bring ocean air over it." Latitude sets the starting point for a climate. It does not get the last word.',
        },
        {
          answer: 'That means Europe and Russia have a mild climate.',
          misconception:
            'Stretching one true fact about one corner of a region across the whole region, as if a region can only have one climate.',
          correctsTo:
            'The mildness belongs to the northwest, near the ocean, and it fades as you travel east. Southern Europe has a Mediterranean climate instead, with hot dry summers and mild wet winters. Farther east the climate becomes continental, meaning the gap between summer and winter grows larger, and in Siberia it becomes subarctic, with long, very cold winters and permafrost over large areas. WRONG: "Europe and Russia are mild." CORRECT: "This region holds mild ocean coasts, dry summers in the south, and deep cold in the north and east, because nearness to the ocean changes as you move across it." A region this large never has one climate.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Europe is a peninsula of peninsulas with a deeply indented coastline, so no part of western Europe is very far from the sea. Peninsulas to know: Scandinavian, Iberian, Italian, Balkan. Seas to know: Mediterranean, North, Baltic, Black.',
        'The North European Plain is a belt of low, flat, fertile land running across the north from the Atlantic eastward.',
        'Mountains: the Alps across the south-center, the Pyrenees between the Iberian Peninsula and the rest of Europe, the Carpathians in the east, and the Ural Mountains running north to south through Russia.',
        'The Europe and Asia boundary is a CONVENTION -- one unbroken landmass, one agreed line, most often drawn along the Urals. It is why Russia is described as spanning two continents.',
        'Rivers: the Rhine flows north to the North Sea, the Danube flows east to the Black Sea, and the Volga, the longest river in Europe, flows to the Caspian Sea. Navigable rivers plus an indented coast give the region unusual access by water.',
        'Northwestern Europe is milder than its latitude alone would predict, because of the warm North Atlantic Drift plus prevailing winds blowing off the ocean.',
        'Southern Europe has a Mediterranean climate of hot dry summers and mild wet winters. Moving east, away from the ocean, the climate turns continental, with a larger summer-to-winter gap, and then subarctic.',
        'Russia is the largest country in the world by area and covers many time zones. Much of Siberia is cold and thinly settled, covered by taiga forest, with permafrost over large areas.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Europe & Russia: Physical Geography' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
