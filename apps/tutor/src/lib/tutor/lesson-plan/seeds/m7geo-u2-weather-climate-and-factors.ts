/**
 * Grade 7 World Geography — Physical Geography: Weather, Climate & What
 * Controls Them.
 *
 * Concept-led row (National Geography Standard 7). The spine is the single
 * distinction students get wrong more than any other in this unit: WEATHER is
 * the atmosphere right now or over a few days; CLIMATE is the long-term
 * pattern of weather in a place. Everything after that is the geographic
 * content proper -- the five controls on climate: latitude, elevation,
 * distance from water, ocean currents, and mountain barriers.
 *
 * NOTE FOR FUTURE AUTHORS: this file states NO temperature or rainfall
 * figures for any real place, and it stays entirely away from climate-change
 * policy. The row is about what CONTROLS climate. The only real places named
 * are used for physical, long-settled facts -- a mountain that is high enough
 * to be cold at the top, a warm current and a cold current that are in every
 * atlas. Keep it that way; an invented town is always the safer example.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item here is
 * solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U2_WEATHER_CLIMATE_AND_FACTORS: LessonPlan = {
  id: 'evelyn.ms.m7geo.weather-climate-and-factors.v1',
  title: 'Weather, Climate & What Controls Them',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.weather-climate-and-factors',
      standard: 'M7GEO-2.3',
      description:
        'Distinguish weather from climate, and explain how latitude, elevation, distance from water, ocean currents and mountain barriers control the climate of a place (National Geography Standard 7: the physical processes that shape the patterns of Earth surface).',
    },
  ],
  prerequisites: ['m7geo.plate-tectonics-and-natural-hazards'],
  followUps: ['m7geo.climate-zones-and-biomes'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Separate weather from climate using a decision the student has actually made, before any vocabulary arrives.',
      script:
        'Say you are flying somewhere next month to visit family. Two different questions come up, and people mix them together all the time. The first one is what to pack -- shorts or a heavy coat. Nobody can look up next month, so you go by what that place is usually like at that time of year. The second question is what to wear on the morning you land, and for that you check the forecast the night before. The first question is about climate. The second one is about weather. Today we pin down the difference, and then we work out what actually decides why one place is usually hot and another place, at the very same distance from the equator, is not.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-weather-climate-controls',
      kind: 'concept',
      goal: 'Fix the weather/climate distinction, then install the five controls on climate.',
      keyIdeas: [
        'WEATHER IS THE ATMOSPHERE RIGHT NOW OR OVER A FEW DAYS. CLIMATE IS THE LONG-TERM PATTERN OF WEATHER IN A PLACE. Weather is rain this afternoon, wind tonight, snow on Thursday. Climate is what that place is usually like, worked out from many years of weather. The test is one question: HOW LONG A STRETCH OF TIME IS THIS ABOUT? Hours or days means weather. Years, and the usual pattern across the seasons, means climate. A saying that is worth remembering: climate is what you expect, weather is what you get.',
        'BECAUSE CLIMATE IS A LONG-TERM PATTERN, ONE STRANGE DAY OR ONE STRANGE WEEK DOES NOT CHANGE IT. Every place has weather that surprises people. A hot place can have a cold week. A dry place can have a downpour. WRONG: "It snowed here last week, so this place does not really have a warm climate." CORRECT: "It snowed here last week, which was unusual weather for a place with this climate." Climate describes the pattern, and a pattern is bigger than any one week inside it.',
        'CONTROL 1 -- LATITUDE. Sunlight strikes Earth most directly near the equator, and it arrives at a slanting angle near the poles. Light that comes straight down is concentrated on a small patch of ground. The same amount of light coming in at a slant is spread over a wider patch, so it heats that ground less. That is why low latitudes are warmer, on average, than high latitudes. Latitude is the first thing to check about any place, and it is also the reason places far from the equator have big differences between summer and winter.',
        'CONTROL 2 -- ELEVATION. The higher up you go, the colder the air gets. This is why a mountain range can be snowy while the land at its foot is green, and why some mountains that stand close to the equator have snow and ice at the top all year. Mount Kilimanjaro in East Africa is one of them: it sits near the equator, and it is tall enough to be freezing at the summit. Elevation can beat latitude. Two places can share a latitude and have completely different climates because one of them is high in the mountains.',
        'CONTROL 3 -- DISTANCE FROM WATER, AND CONTROL 4 -- OCEAN CURRENTS. Water heats up and cools down more slowly than land does, so a large lake or ocean acts like a brake on temperature. Places on the coast tend to have milder, smaller swings between summer and winter than places far inland, which can be very hot in summer and very cold in winter. Ocean currents matter on top of that, because they carry water of one temperature along a coast: the Gulf Stream carries warm water from the tropical Atlantic northeast toward northwestern Europe, and the cold Peru Current runs north along the western coast of South America. A warm current tends to make the coast it touches milder, and a cold current tends to make it cooler.',
        'CONTROL 5 -- MOUNTAIN BARRIERS AND THE RAIN SHADOW. When wind carrying moist air meets a mountain range, the air has to rise to get over it. Rising air cools, and cool air cannot hold as much water vapor, so the water falls out as rain or snow on the side the wind hits first. That side is the WINDWARD side, and it is usually green and wet. By the time the air comes down the far side -- the LEEWARD side -- most of the moisture is gone. That dry strip of land behind a range is called a RAIN SHADOW, and many deserts sit in one. PUT THE FIVE TOGETHER AND YOU GET THE BIG WARNING OF THIS LESSON: two places at the same latitude do not have to share a climate, because elevation, water, currents and mountains all get a vote.',
      ],
      vocabulary: [
        { term: 'weather', definition: 'the state of the atmosphere in a place right now or over a few days.' },
        { term: 'climate', definition: 'the long-term pattern of weather in a place, worked out over many years.' },
        { term: 'elevation', definition: 'how high a place is above sea level.' },
        { term: 'ocean current', definition: 'a large stream of water moving through the ocean, carrying warm or cold water along coasts.' },
        { term: 'leeward side', definition: 'the side of a mountain range facing away from the wind, which is usually the drier side.' },
        { term: 'rain shadow', definition: 'the dry area on the leeward side of a mountain range, where the air has already lost its moisture.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-weather-climate',
      kind: 'worked_example',
      problem:
        'Sort each of these five statements into WEATHER or CLIMATE, and say how you decided.\n\n1. "A thunderstorm is expected here this evening."\n2. "Summers in this region are hot and dry, and winters are cool and wet, year after year."\n3. "It has rained every day for the past week."\n4. "This part of the coast has mild temperatures all year."\n5. "The temperature dropped fifteen degrees between morning and afternoon."',
      steps: [
        'Do not sort by whether the statement mentions rain, or heat, or wind. Every one of them mentions something like that. Sort by TIME.',
        'Ask the one test question about each statement: how long a stretch of time is this about? Hours or days means weather. Many years and the usual pattern means climate.',
        'Statement 1 is about this evening. That is hours. WEATHER.',
        'Statement 2 says year after year, and it describes the usual pattern of two seasons. That is many years. CLIMATE.',
        'Statement 3 is about the past week. A week feels long, but it is still a short stretch of days, and unusual weeks are exactly what weather does. WEATHER.',
        'Statement 4 says all year, and it describes what this coast is like rather than what happened on some particular day. CLIMATE.',
        'Statement 5 is about one morning and one afternoon. WEATHER.',
        'Look back at statements 3 and 4, because they are the pair students trip on. Both feel like they cover a long time. Only one of them describes a repeating pattern; the other describes one unusual stretch. That is the difference the test question catches.',
      ],
      answer:
        'Weather: statements 1, 3 and 5. Climate: statements 2 and 4. The deciding question is how long a stretch of time the statement covers -- hours or days is weather, the usual pattern across many years is climate.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-mountain-range',
      kind: 'worked_example',
      problem:
        'Use the controls on climate to explain this invented case.\n\n"A long mountain range runs from north to south along a coast. Steady winds blow in off the ocean and hit the western side of the range. Westport sits on the ocean side, at sea level. Dryfield sits on the eastern side of the range, also at sea level, at the same latitude as Westport. High Camp sits partway up the range, well above both towns. Westport is green and rainy. Dryfield is dry. High Camp is cold enough for snow."',
      steps: [
        'Start with what the three places have in common, so you can rule it out. All three are at about the same latitude, so latitude alone cannot explain the differences between them. That is the whole point of the case.',
        'Take Westport first. The wind arrives off the ocean carrying moist air, and Westport is on the side the wind hits first -- the windward side. The air has to rise to cross the range. Rising air cools, cool air cannot hold as much water vapor, and the water falls out as rain. So Westport is green and rainy.',
        'Now Dryfield. By the time that same air comes down the eastern side, it has already dropped most of its moisture on the western side. There is little left to fall. Dryfield sits in the RAIN SHADOW of the range, on the leeward side, and that is why it is dry.',
        'Now High Camp. Nothing about wind explains this one -- it is ELEVATION. Air gets colder the higher you go, so a place partway up the range is colder than either town at sea level, even though all three share a latitude.',
        'WRONG way to explain Dryfield: "Dryfield is dry because it is farther from the equator." It is not farther from the equator; the case says the two towns share a latitude. CORRECT way: "Dryfield is dry because the mountain range takes the moisture out of the air before it gets there."',
        'Say the lesson of the case out loud, because it is the one to carry forward: same latitude, three different climates. Latitude sets a starting point, and elevation, water and mountains change the answer from there.',
      ],
      answer:
        'Westport is wet because it is on the windward side, where moist ocean air is forced up the range and drops its rain. Dryfield is dry because it sits in the rain shadow on the leeward side, where the air has already lost that moisture. High Camp is cold because of its elevation. All three share a latitude, which shows that latitude alone does not decide a climate.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-weather-or-climate',
      kind: 'try_yourself',
      problem:
        'Which of these statements describes CLIMATE rather than weather?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'This region is usually dry in summer and wet in winter, year after year.', correct: true },
        { id: 'b', text: 'Rain is falling right now, and the wind is picking up.' },
        { id: 'c', text: 'Tomorrow will be colder than today, with snow in the afternoon.' },
        { id: 'd', text: 'It has been unusually windy here all week.' }
      ],
      expectedAnswer: 'This region is usually dry in summer and wet in winter, year after year.',
      hints: [
        'Run the test question on each choice: how long a stretch of time is this statement about?',
        'One of these choices describes a pattern that repeats. The other three describe a moment, a forecast, or one unusual week.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-coast-versus-inland',
      kind: 'try_yourself',
      problem:
        'Two towns sit at the same latitude and at the same low elevation. Marrow Bay is on the coast of a large ocean. Kesselton is far inland, near the middle of a wide continent. Which statement is most likely true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two towns must have the same climate, because they are at the same latitude.' },
        { id: 'b', text: 'Kesselton has the milder winters, because land holds on to heat better than water does.' },
        { id: 'c', text: 'Marrow Bay has the more extreme summers and winters, because ocean air changes temperature quickly.' },
        { id: 'd', text: 'Marrow Bay has smaller differences between summer and winter, because a large body of water moderates temperature.', correct: true }
      ],
      expectedAnswer: 'Marrow Bay has smaller differences between summer and winter, because a large body of water moderates temperature.',
      hints: [
        'Latitude is only the first control. Ask which of the other four controls the case is actually testing -- the only difference given is how close each town is to a large body of water.',
        'Water heats up and cools down more slowly than land does. Decide what that slowness does to the temperature of a town sitting right next to it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rain-shadow',
      kind: 'try_yourself',
      problem:
        'Steady winds carry moist air off an ocean toward a long mountain range along the coast. The air rises up the ocean-facing side of the range and drops most of its moisture there. What is the land on the far side of the range most likely to be like, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Wet, because the air picks up new moisture as it comes back down the far side.' },
        { id: 'b', text: 'Dry, because the far side of a range is always at a higher elevation.' },
        { id: 'c', text: 'Wet, because a mountain range traps rain evenly on both of its sides.' },
        { id: 'd', text: 'Dry, because the air already lost most of its moisture climbing the range.', correct: true }
      ],
      expectedAnswer: 'Dry, because the air already lost most of its moisture climbing the range.',
      hints: [
        'Follow the air in order: it arrives moist, it rises, it cools, it rains. Then ask what is left in it when it reaches the other side.',
        'There is a name for the dry strip of land behind a mountain range. Two of these choices give the right answer with the wrong reason attached, so check the reason as carefully as the answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-week-and-sun-distance',
      kind: 'misconception_check',
      question:
        'A student says: "There was a freezing week in that city last winter, so people are wrong when they call its climate mild. And anyway, places near the equator are hot because they are closer to the sun." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'There was a freezing week in that city, so its climate is not really mild.',
          misconception:
            'Treating one stretch of unusual weather as evidence about climate. The student is using a few days to judge a pattern that is measured over many years.',
          correctsTo:
            'Weather is the atmosphere over hours and days; climate is the long-term pattern. A mild climate does not promise that no cold week will ever happen -- it describes what is USUAL, and unusual weeks are part of what weather does everywhere. WRONG: "One freezing week proves the climate is not mild." CORRECT: "One freezing week was unusual weather for a place with a mild climate." To say something about the climate you would need many years of weather, not one week.',
        },
        {
          answer: 'Places near the equator are hot because they are closer to the sun.',
          misconception:
            'Explaining warmth by distance from the sun instead of by the ANGLE at which sunlight arrives. Distance is the intuitive story, and it is the wrong one.',
          correctsTo:
            'It is about angle, not distance. Near the equator, sunlight comes down almost straight, so its energy is concentrated on a small patch of ground. Near the poles the same sunlight arrives at a slant and is spread over a much wider patch, so it heats each piece of that ground less. Two checks make this clear. First, the whole Earth is about the same distance from the sun, and the distance does change slightly through the year, but it is actually a little smaller during winter in the Northern Hemisphere. Second, the top of a tall mountain is closer to the sun than the beach below it, and the mountain top is colder.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Weather is the atmosphere over hours or days. Climate is the long-term pattern of weather in a place. Ask how long a stretch of time the statement covers.',
        'One unusual day or week is weather, and it does not change a climate. Climate is what you expect; weather is what you get.',
        'Latitude: sunlight arrives straight down near the equator and at a slant near the poles, so low latitudes are warmer. It is the angle, not the distance from the sun.',
        'Elevation: the higher up you go, the colder it gets, which is why some mountains near the equator are snow-capped.',
        'Water: large bodies of water moderate temperature, so coasts have milder swings than inland places, and warm or cold ocean currents carry their temperature along a coast.',
        'Mountain barriers: air rising over a range drops its moisture on the windward side and leaves a dry rain shadow on the leeward side.',
        'The big warning: two places at the same latitude can have completely different climates, because elevation, water, currents and mountains all get a vote.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Weather, Climate & What Controls Them' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
