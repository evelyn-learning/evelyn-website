/**
 * Grade 7 World Geography — Human Geography: Urbanization & Settlement Patterns.
 *
 * The closing row of Unit 3 (National Geography Standard 12). It picks up the
 * push/pull framework from 3.3 and asks the next question: when people move,
 * WHERE do they end up, and what shape does a settlement take on the ground?
 *
 * NOTE FOR FUTURE AUTHORS. Two rules govern this file.
 *
 * First, NO STATISTICS. Urbanization is normally taught with percentages and
 * city-population tables, and every one of those numbers moves. This file
 * states no urbanization percentage, no city population, and no claim about
 * which city is largest. Urbanization is taught as a SHARE that rises or
 * falls, argued qualitatively. Do not add a number to "make it concrete".
 *
 * Second, NO RANKING. A big city is not better or worse than a small town,
 * and a dispersed farming settlement is not disorganized. Consequences of
 * rapid growth are stated neutrally, as pressure on housing, water and
 * transport -- never as a verdict on a place or on the people who live there.
 *
 * Every settlement in an item is invented. There are also NO MAPS AND NO
 * IMAGES in this course: every layout is described in words.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U3_URBANIZATION_AND_SETTLEMENT: LessonPlan = {
  id: 'evelyn.ms.m7geo.urbanization-and-settlement.v1',
  title: 'Urbanization & Settlement Patterns',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.urbanization-and-settlement',
      standard: 'M7GEO-3.4',
      description:
        'Define urbanization as the growing share of people who live in cities, identify linear, clustered and dispersed settlement patterns from a written description, and explain why settlements form where they do and what rapid city growth puts pressure on (National Geography Standard 12: the processes, patterns and functions of human settlement).',
    },
  ],
  prerequisites: ['m7geo.migration-push-and-pull'],
  followUps: ['m7geo.what-culture-is'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from a pattern of lights the student has already seen from a car or a plane, before any vocabulary arrives.',
      script:
        'Picture a long drive at night. For a while there is nothing but dark fields, with a single porch light every minute or so. Then the lights start to bunch together. Then they are everywhere at once, a whole floor of them, and you are in a city. Then it thins back out again. People are not spread evenly across the ground, and they never have been. Last lesson you learned why people move. This lesson is about where they end up, and about the shapes those settlements make -- a line, a cluster, or a scatter -- because every one of those shapes has a reason behind it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-urbanization-and-patterns',
      kind: 'concept',
      goal: 'Install urbanization as a SHARE, the three settlement patterns with their causes, the site reasons cities form, and the neutral consequences of rapid growth.',
      keyIdeas: [
        'URBANIZATION IS THE GROWING SHARE OF PEOPLE WHO LIVE IN CITIES AND TOWNS. Read that word SHARE carefully, because it is the whole idea. Urbanization compares the number of people living in urban places to the number of people in the country altogether. A country is urbanizing when that share goes up. It is not a count of city residents, and it is not the size of the built-up area on the ground.',
        'URBANIZATION IS MOSTLY THE PUSH AND PULL OF LAST LESSON, POINTED AT CITIES. Rural-to-urban migration is the main engine: pushes out of the countryside, such as a poor harvest or too few jobs for the young people there, meeting pulls toward the city, such as work, schools, hospitals and family who already made the move. Cities also grow from the children born in them. Both together raise the urban share.',
        'SETTLEMENTS TAKE THREE COMMON SHAPES, AND EACH SHAPE HAS A CAUSE. A LINEAR settlement is strung out in a line, because it follows something long and narrow -- a road, a river, a valley floor or a coast. A CLUSTERED settlement, also called nucleated, is grouped tightly around a center such as a crossroads, a well, a harbor or a market square. A DISPERSED settlement is spread out, with homes far apart, which is typical of farming country where each household needs a lot of land around it.',
        'THE PATTERN IS EXPLAINED BY THE LAND AND THE WORK, NOT BY TIDINESS. Go back to Unit 2 and ask what the physical geography allows. A narrow mountain valley or a strip of dry land beside a river leaves room for a line and nothing else. Flat farmland with water available everywhere lets homes spread apart. A single well, a ford across a river, or a place where four roads meet gives everyone a reason to sit close to one point. Dispersed is not disorganized. It is the pattern that fits the work being done.',
        'CITIES FORM AT SITES THAT SOLVE A PROBLEM. Four reasons cover most of them. WATER, for drinking, for farming the land nearby, and for moving goods. A DEFENSIBLE OR CENTRAL SITE, such as a hilltop, or a spot in the middle of the area it serves. A BREAK-OF-BULK POINT, meaning a place where goods have to change transport and therefore have to be unloaded, counted and handled -- a river mouth where boats meet ocean ships, a mountain pass, the end of a rail line. A RESOURCE worth digging up or processing. It is safe to say that many cities grew where rivers meet the sea, at natural harbors, and at crossroads.',
        'CONCENTRATION IS THE POINT, AND ALSO THE PRESSURE. Putting many people close together concentrates jobs, schools, hospitals, transport and services, which is why cities pull people in the first place. When growth arrives faster than building does, the same concentration strains housing, clean water, sanitation and roads. Neither of those sentences makes a city better or worse than a small town. They are different settlements with different trade-offs, and geographers describe them, not rank them.',
      ],
      vocabulary: [
        { term: 'urbanization', definition: 'the rising share of a population that lives in cities and towns.' },
        { term: 'settlement pattern', definition: 'the shape that homes and buildings make on the ground in a place.' },
        { term: 'linear settlement', definition: 'a settlement strung out in a line along a road, river, valley or coast.' },
        { term: 'clustered settlement', definition: 'a settlement grouped tightly around a central point; also called nucleated.' },
        { term: 'dispersed settlement', definition: 'a settlement whose homes are spread far apart, common in farming areas.' },
        { term: 'break-of-bulk point', definition: 'a place where goods must change from one kind of transport to another.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-share-not-size',
      kind: 'worked_example',
      problem:
        'Two invented countries are described below. Decide which one is urbanizing, and explain the difference. Use no numbers in your answer.\n\nCountry A: over ten years, the number of people living in the countryside stayed about the same, while the number of people living in cities and towns rose.\n\nCountry B: over ten years, its largest city built new neighborhoods outward onto what used to be farmland, so the city covers much more ground. The share of the country that lives in cities is the same as it was ten years ago.',
      steps: [
        'Write down the test before looking at either country. Urbanization asks one question: is the SHARE of people living in urban places going up?',
        'Country A. Rural stayed flat and urban rose. So the whole population is a little larger than before, and almost all of the extra people are in urban places. Urban divided by total has gone up. Country A is urbanizing.',
        'Country B. The city is physically bigger. That is a real change, and it has a name -- the built-up area spread outward -- but the question is about people, not land.',
        'Read Country B again for the share. It says the share of the country living in cities is unchanged. So Country B is not urbanizing, even though its city visibly grew.',
        'WRONG way to say it: "Country B is urbanizing because its city got bigger." CORRECT way: "Country B is not urbanizing. Its city spread out over more land, but the share of people living in urban places did not change."',
        'One more check on Country A, because a share is a fraction and fractions have two ends. The share can also rise when the countryside loses people while the cities hold steady. Either movement raises the urban share, which is exactly why rural-to-urban migration urbanizes a country so quickly: it lowers the bottom of the fraction and raises the top at the same time.',
      ],
      answer:
        'Country A is urbanizing, because urban population rose while rural stayed flat, so the share of people living in cities went up. Country B is not urbanizing. Its city covers more ground, but urbanization is about the share of people who live in urban places, not about how much land a city covers.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-name-the-pattern',
      kind: 'worked_example',
      problem:
        'Name the settlement pattern in each invented description, and give the reason the land or the work produced it.\n\n1. Homes and shops stand in a single row on both sides of one road. The road runs along the floor of a narrow valley with steep slopes on either side.\n\n2. About forty homes stand close together around a square. In the middle of the square is the only well for several miles. Two roads cross at the square.\n\n3. Farmhouses stand roughly a mile apart. Each one sits in the middle of the fields that household works.',
      steps: [
        'Description 1. The homes make a line, so the pattern is LINEAR. Now the cause: the valley is narrow with steep slopes, so the only buildable ground is the strip along the floor. The land left no other option.',
        'Description 2. The homes are grouped tightly around one point, so the pattern is CLUSTERED, which you may also see called nucleated. The cause is doubled here. The well is the only water for miles, and two roads meet at the same spot. Both give every household a reason to sit close to the center.',
        'Description 3. The homes are far apart, so the pattern is DISPERSED. The cause is the work. Each household farms a block of land and lives in the middle of it, so the homes end up as far apart as the fields are wide.',
        'Check yourself on the third one before moving on. Dispersed is not a settlement that failed to organize itself. It is the arrangement that fits farming, and it would be a poor arrangement for people who all needed the same single well.',
        'Notice what decided every answer: the shape came from the physical geography and the work, exactly as in Unit 2. If you can name a pattern but cannot name its cause, you have only done half the question.',
      ],
      answer:
        '1. Linear, because a narrow valley floor leaves only a long strip of buildable ground along the road. 2. Clustered or nucleated, because the single well and the crossroads both pull homes toward one center. 3. Dispersed, because each farming household lives in the middle of the land it works, which spreads the homes apart.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-urbanization-means',
      kind: 'try_yourself',
      problem: 'Which statement best describes what geographers mean by urbanization?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A city is covering more land than it used to cover.' },
        { id: 'b', text: 'The total number of people in a country is rising.' },
        { id: 'c', text: 'The buildings in a city are getting taller.' },
        { id: 'd', text: 'The share of a country that lives in cities and towns is rising.', correct: true }
      ],
      expectedAnswer: 'The share of a country that lives in cities and towns is rising.',
      hints: [
        'Urbanization is about people, and it is a comparison. Ask which choice compares urban people to the whole population.',
        'Two of these choices describe a city changing physically, and one describes population growth for the whole country. None of those three is a share.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-the-pattern',
      kind: 'try_yourself',
      problem:
        'An invented settlement is described this way: nearly every home stands in one long row following the bank of a river, each home close to its neighbors, with no group of homes bunched at any point along it. Which settlement pattern is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Linear, because the homes follow the river in a line', correct: true },
        { id: 'b', text: 'Clustered, because the homes are close to their neighbors' },
        { id: 'c', text: 'Dispersed, because the settlement is out in the countryside' },
        { id: 'd', text: 'It has no pattern, because rural settlements are not planned' }
      ],
      expectedAnswer: 'Linear, because the homes follow the river in a line',
      hints: [
        'Draw the description in your head. Are the homes gathered around one center, scattered across an area, or laid out end to end along something long?',
        'Homes being close together is not enough for clustered. Clustered means grouped around a central point, and the description says no group forms anywhere along the row.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-a-city-here',
      kind: 'try_yourself',
      problem:
        'An invented town grew at the place where a river reaches the sea. Cargo carried downriver on flat riverboats is unloaded there and loaded onto larger ocean ships, and the same happens in reverse for cargo arriving from the sea. Which reason best explains why a town grew at this site?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is a defensible site, because a hilltop is hard for attackers to reach.' },
        { id: 'b', text: 'It sits above a resource, such as a metal or a fuel worth digging up.' },
        { id: 'c', text: 'It sits at the exact geographic center of the country.' },
        { id: 'd', text: 'It is a break-of-bulk point, where goods must change from one kind of transport to another.', correct: true }
      ],
      expectedAnswer: 'It is a break-of-bulk point, where goods must change from one kind of transport to another.',
      hints: [
        'Every choice names a real reason that towns grow somewhere. Only one of them matches what this description actually says is happening.',
        'The description is entirely about cargo moving off one kind of vessel and onto another. There is no hill, no mine and no mention of where the country center is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-versus-share',
      kind: 'misconception_check',
      question:
        'A student writes: "Our country is urbanizing, because our biggest city now covers twice as much land as it did, and that makes it a better place to live than the small towns." Two separate things have gone wrong here. What are they?',
      commonErrors: [
        {
          answer: 'The country is urbanizing because its biggest city now covers twice as much land.',
          misconception:
            'Reading urbanization as physical growth -- a city spreading outward across the ground -- rather than as a share of the population.',
          correctsTo:
            'Urbanization is measured in people, not in land. WRONG: "The city covers more ground, so the country is urbanizing." CORRECT: "The country is urbanizing if a larger share of its people now live in cities and towns." A city can spread outward while the urban share holds steady, and a country can urbanize without any city covering an inch more ground, if people move in and fill the buildings that are already there. Ask the share question every time: out of everybody in the country, are more of them urban than before?',
        },
        {
          answer: 'A bigger city is a better place to live than a small town.',
          misconception:
            'Turning a description of settlement size into a ranking, and treating one kind of settlement as superior to another.',
          correctsTo:
            'Geographers describe settlements; they do not rank them. A large city concentrates jobs, schools, hospitals and transport, and when it grows faster than it can build, that same concentration puts pressure on housing, clean water and roads. A small town has fewer of those services close by and less of that pressure. Those are trade-offs, not scores. WRONG: "Cities are better than small towns." CORRECT: "Cities and small towns offer different things, and which one suits a household depends on what that household needs."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Urbanization is the rising SHARE of people who live in cities and towns. It is not a count, and it is not how much land a city covers.',
        'Rural-to-urban migration drives it: pushes out of the countryside meeting pulls toward the city.',
        'Linear follows something long and narrow. Clustered groups around a center. Dispersed spreads out across farmland.',
        'Every pattern has a cause in the physical geography and the work being done. Dispersed is not disorganized.',
        'Cities form at sites that solve a problem: water, a defensible or central site, a break-of-bulk point, or a resource.',
        'Cities concentrate jobs and services, and fast growth can outrun housing, water and transport. Describe settlements; do not rank them.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Urbanization & Settlement Patterns' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
