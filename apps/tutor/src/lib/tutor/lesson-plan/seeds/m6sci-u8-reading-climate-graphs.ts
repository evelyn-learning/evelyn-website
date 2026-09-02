/**
 * Grade 6 Science (Earth & Space Science) — Climate & the Ocean's Role:
 * Reading Climate Graphs.
 *
 * PROCEDURE-LED (NGSS MS-ESS2-6). One routine runs the whole lesson: read a
 * climatograph's twelve monthly temperature averages and twelve monthly
 * precipitation averages, find the warmest and coldest month to compute the
 * annual temperature range, use which calendar months are warm and which are
 * cool to name the hemisphere, scan the precipitation numbers for a real wet
 * season and/or dry season, add all twelve precipitation numbers for the
 * annual total, then combine all of it into one climate-pattern statement --
 * and repeat the same routine on a second location to compare the two. The
 * trap the routine is built to kill is treating one month's number, in
 * either column, as if it were the whole climate pattern by itself.
 *
 * SCOPE GUARD: this plan reads a climatograph's monthly temperature and
 * precipitation averages to compute an annual temperature range and an
 * annual precipitation total, identify a location's hemisphere from which
 * calendar months are its warm season, identify whether it has a real wet
 * season and/or dry season, and compare that whole pattern against a second
 * location's graph -- never reading a single value off one column as if it
 * were the whole answer.
 *   - THERE IS NO IMAGE, GRAPH, OR PLOTTED LINE ANYWHERE IN THIS FILE. Every
 *     climatograph in this plan is written out as two twelve-number lists in
 *     the running text -- a monthly average temperature in degrees Celsius
 *     and a monthly average precipitation in millimeters, January through
 *     December, in that stated order -- and every item is solvable entirely
 *     from the numbers printed inside it. No item ever asks what a plotted
 *     line or a bar's height looks like; the skill is working out what the
 *     stated numbers IMPLY, never reading a shape off a picture.
 *   - Every location in this file is an invented, unnamed "Location" (A
 *     through F) with data invented for this lesson. No real city, region or
 *     weather station is named anywhere, so no figure in this file is a
 *     checkable claim about the real world -- only the arithmetic performed
 *     on the invented numbers is checkable, and that arithmetic is shown in
 *     full everywhere it is used.
 *   - ROW 8.1 (weather versus climate) already established that climate is
 *     a multi-decade average pattern, distinct from a single day's weather.
 *     This lesson takes that distinction as given and works only with
 *     already-averaged climatograph data; it never discusses a single day's
 *     weather or a single storm.
 *   - ROW 8.2 (what determines a region's climate) owns WHY a location has
 *     the pattern it does -- latitude, elevation, and distance from a large
 *     body of water. This lesson takes the resulting pattern as already-
 *     graphed data and only reads, classifies, and compares it; it never
 *     explains latitude, elevation, or ocean distance as a cause, and the
 *     word "biome" never appears anywhere in this file, matching row 8.2's
 *     own exclusion of that word.
 *   - ROW 8.3 (ocean currents) owns how a NAMED current changes a
 *     coastline's climate. This lesson never names a real ocean current and
 *     never traces one along a coastline.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. No location in this file is classified by
 *     its resident species, and no habitat, ecosystem, or biome vocabulary
 *     appears anywhere.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: temperature and precipitation are
 *     treated only as reported monthly averages to be compared, ranged, and
 *     summed. This file contains no particle-level or heat-transfer account
 *     of why a location has the temperature or precipitation it does, and no
 *     force, energy, or motion calculation anywhere.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * climatograph in this file is written out as two stated twelve-number
 * lists with their units named, and every item is solvable entirely from
 * the text printed inside it. Never write "the graph shown" or "the line
 * above," and never assume the student has seen a real climatograph's axes
 * or plotted shape.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U8_READING_CLIMATE_GRAPHS: LessonPlan = {
  id: 'evelyn.ms.m6sci.reading-climate-graphs.v1',
  title: 'Reading Climate Graphs',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.reading-climate-graphs',
      standard: 'M6SCI-8.4',
      description:
        "Read a climatograph (monthly temperature and precipitation averages) to classify a location's climate pattern and compare it against a second location's graph (NGSS MS-ESS2-6; shares this standard with the rest of Unit 8 as a coarse split by pedagogical stage).",
    },
  ],
  prerequisites: ['m6sci.how-ocean-currents-move-heat-around-the-globe'],
  followUps: ['m6sci.renewable-and-nonrenewable-resources'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe a climatograph as a full year of numbers to read, not a picture to wait on.',
      script:
        'Think about your own town across an entire year, not just today. Some months are hot, some are cold, some bring plenty of rain, and some barely bring any. If you wrote down the average temperature and the average rainfall for every single month, built up from years and years of weather at that same place, and then lined all twelve months up side by side, you would have exactly what scientists call a climatograph -- a full year of typical numbers for one place, instead of a picture of one day. Today you learn to read that whole year of numbers at once, find the pattern hiding inside it, and use it to compare one place against another.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-the-climatograph',
      kind: 'concept',
      goal: 'Install the routine for reading a climatograph and the one-month trap before either is met in an item.',
      keyIdeas: [
        'WHAT A CLIMATOGRAPH GIVES YOU. A climatograph for one location is two lists of twelve numbers, one for each month of the year: a monthly average temperature in degrees Celsius, and a monthly average precipitation in millimeters. Every number is an average built up from many years of weather at that location, so it shows the location\'s typical pattern, not what happened on any single day or in any single year. Reading a climatograph means reading all twenty-four numbers together, not picking out one and stopping there.',
        'FINDING THE ANNUAL TEMPERATURE RANGE AND THE HEMISPHERE. Find the single warmest month and the single coldest month; the annual temperature range is the warmest month\'s average minus the coldest month\'s average. Then look at WHICH months those are on the calendar. If the warmest months fall around June, July and August, and the coolest months fall around December, January and February, that is the seasonal pattern of a Northern Hemisphere location. If it is the other way around -- warmest around December, January and February, coolest around June, July and August -- that is the seasonal pattern of a Southern Hemisphere location, because the two hemispheres experience opposite seasons at the same point in the calendar.',
        'FINDING A WET SEASON AND A DRY SEASON. Compare the twelve monthly precipitation numbers against each other. A real wet season is a stretch of months that is clearly higher than the rest of the year, and a real dry season is a stretch that is clearly lower. If every month sits in roughly the same range as every other month, the location does not have a strongly marked wet or dry season -- it is either wet all year, dry all year, or somewhere in between, depending on the general level of all twelve numbers.',
        'THE ANNUAL TOTAL IS A SUM, NOT A GUESS. Adding all twelve monthly precipitation numbers gives the annual total, and that total can tell a different story than any single month does. For example, if three months out of twelve carry 420 millimeters out of a full year\'s total of 569 millimeters, that is more than seventy percent of the entire year\'s rain arriving in just one quarter of the months -- a real wet season, not just one wetter month sitting among eleven ordinary ones.',
        'THE ROUTINE, IN ORDER. (1) Read the twelve temperature numbers and the twelve precipitation numbers, noting the units. (2) Find the warmest and coldest months and compute the annual temperature range. (3) Use which calendar months are warm and which are cool to name the hemisphere. (4) Scan the precipitation numbers for a wet season and a dry season, or decide there is not a strongly marked one. (5) Add all twelve precipitation numbers for the annual total. (6) Combine all of it into one climate-pattern statement for that location -- never from a single month by itself.',
        'THE TRAP: ONE MONTH IS NEVER THE WHOLE PATTERN. A single warm month, cold month, wet month or dry month proves nothing about a location\'s overall climate by itself. The pattern only appears once that month is compared against the other eleven, which is exactly what makes this different from simply reading one value off an axis.',
      ],
      vocabulary: [
        { term: 'climatograph', definition: "a record of one location's typical monthly average temperature and monthly average precipitation, built up from many years of weather at that location." },
        { term: 'annual temperature range', definition: "the difference between a location's warmest monthly average temperature and its coolest monthly average temperature over the year." },
        { term: 'wet season', definition: "a stretch of months when a location's precipitation is clearly higher than during the rest of its year." },
        { term: 'dry season', definition: "a stretch of months when a location's precipitation is clearly lower than during the rest of its year." },
        { term: 'annual precipitation total', definition: "the sum of a location's twelve monthly average precipitation numbers, giving the typical amount of precipitation the location receives across a whole year." },
        { term: 'seasonal pattern', definition: "which calendar months are the warm season and which are the cool season for a location, used to tell whether that location is in the Northern or Southern Hemisphere." },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-single-location-pattern',
      kind: 'worked_example',
      problem:
        "Location A's monthly average temperature in degrees Celsius, January through December, is: 8, 9, 11, 14, 18, 22, 25, 24, 21, 16, 12, 9. Location A's monthly average precipitation in millimeters, over the same twelve months in the same order, is: 90, 80, 60, 30, 15, 5, 2, 3, 10, 40, 70, 85. Describe Location A's climate pattern: its annual temperature range, its hemisphere, its wet and dry season, and its annual precipitation total.",
      steps: [
        'Step 1, find the warmest and coldest months. Reading down the temperature list, the warmest month is July at 25 degrees Celsius, and the coldest month is January at 8 degrees Celsius. The annual temperature range is 25 minus 8, which is 17 degrees Celsius.',
        "Step 2, use the warm and cool months to name the hemisphere. Location A's warmest months are June, July and August, and its coolest months are December, January and February. That is the calendar pattern of a Northern Hemisphere location, where summer falls in June through August.",
        'Step 3, look for a wet season and a dry season. The precipitation numbers are highest in December, January and February (85, 90 and 80 millimeters) and lowest in June, July and August (5, 2 and 3 millimeters). That is a clearly wetter winter and a clearly drier summer -- a real wet season and a real dry season, not just numbers that wobble a little from month to month.',
        'Step 4, add all twelve precipitation numbers for the annual total. 90 + 80 + 60 + 30 + 15 + 5 + 2 + 3 + 10 + 40 + 70 + 85 = 490 millimeters for the year.',
        'Now check the answer the way a science answer has to be checked, since there is no equation to work backward through. Three different kinds of clues agree here: the CALENDAR position of the warm and cool months (June-August warm, December-February cool) says Northern Hemisphere; the PRECIPITATION pattern (wettest in winter, driest in summer) says a wet-winter, dry-summer climate; and the SIZE of the range (17 degrees Celsius) says a moderate, not extreme, seasonal swing. Three different kinds of evidence, one answer.',
        "Now change one thing to be sure the hemisphere reading is doing real work. If Location A's warmest months had instead been December, January and February, with June, July and August the coolest, every step of the routine above would point to the Southern Hemisphere instead -- the numbers would not have to change in size, only in which calendar months carried them.",
        "WRONG: \"Location A is a wet climate because January's precipitation, 90 millimeters, is a big number.\" CORRECT: \"Location A has a wet winter and a dry summer -- one large monthly number does not make a whole climate wet, and one small monthly number does not make it dry, without comparing every month.\"",
      ],
      answer:
        'Location A has a moderate annual temperature range of 17 degrees Celsius, with warm summers (June-August) and cool winters (December-February), which is the seasonal pattern of the Northern Hemisphere. It has a clear wet season in winter (December-February) and a clear dry season in summer (June-August), and it receives 490 millimeters of precipitation over the year.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-comparing-two-locations',
      kind: 'worked_example',
      problem:
        "Location A has an annual temperature range of 17 degrees Celsius, a warm season in June, July and August, a cool season in December, January and February, and 490 millimeters of precipitation for the year, as found in the previous problem. Location B's monthly average temperature in degrees Celsius, January through December, is: 33, 32, 28, 22, 16, 12, 11, 14, 19, 24, 29, 32. Location B's monthly average precipitation in millimeters, over the same twelve months in the same order, is: 3, 4, 3, 2, 4, 5, 4, 3, 2, 2, 3, 4. Compare Location A and Location B: which hemisphere is each in, and how does their overall wetness compare?",
      steps: [
        "Step 1, find Location B's warmest and coldest months. The warmest month is January at 33 degrees Celsius, and the coldest month is July at 11 degrees Celsius. The annual temperature range is 33 minus 11, which is 22 degrees Celsius.",
        "Step 2, use Location B's warm and cool months to name its hemisphere. Location B's warmest months are December, January and February, and its coolest months are June, July and August. That is the reverse of Location A's pattern, so Location B is in the Southern Hemisphere, where summer falls in December through February.",
        'Step 3, add Location B\'s twelve precipitation numbers for its annual total. 3 + 4 + 3 + 2 + 4 + 5 + 4 + 3 + 2 + 2 + 3 + 4 = 39 millimeters for the year.',
        "Step 4, compare the two totals directly. Location A receives 490 millimeters a year; Location B receives only 39 millimeters. 490 divided by 39 is about 12.6, so Location A is more than twelve times as wet as Location B. Location B's monthly numbers also never rise far above single digits in any month, so it has no real wet season at all -- it is dry nearly all year, unlike Location A, which has one clearly wet season and one clearly dry season within an otherwise moderate climate.",
        'Three different kinds of clues separate these two locations: the CALENDAR pattern (opposite hemispheres), the TOTAL precipitation (490 versus 39 millimeters), and the SHAPE of the precipitation across the year (Location A swings sharply between its wet and dry season; Location B stays low in every single month).',
        "Now change one thing to check the comparison is doing real work. If Location B's precipitation numbers were instead 90, 80, 60, 30, 15, 5, 2, 3, 10, 40, 70 and 85 -- the same twelve numbers as Location A -- the two locations would no longer differ in wetness at all, only in which hemisphere they sit in. The hemisphere difference and the wetness difference are two separate facts, each carried by its own set of numbers.",
        'WRONG: "Location B must be in the Northern Hemisphere too, because most locations people learn about first are in the Northern Hemisphere." CORRECT: "Location B\'s own warm and cool months point to the Southern Hemisphere, and that reading comes from Location B\'s own numbers, never from an assumption about which hemisphere is more familiar."',
      ],
      answer:
        'Location A is in the Northern Hemisphere with a moderate 17-degree-Celsius range and a clear wet-winter, dry-summer pattern totaling 490 millimeters a year. Location B is in the Southern Hemisphere, with a larger 22-degree-Celsius range and almost no precipitation in any month, totaling only 39 millimeters a year and showing no real wet season at all.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-hemisphere-from-pattern',
      kind: 'try_yourself',
      problem:
        "Location C's monthly average temperature in degrees Celsius, January through December, is: 27, 26, 23, 19, 14, 10, 9, 11, 15, 19, 23, 26. Which hemisphere is Location C most likely in, based on this pattern?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Southern Hemisphere, because its warmest months fall in December, January and February and its coolest months fall in June, July and August, the reverse of the calendar pattern a Northern Hemisphere location shows.', correct: true },
        { id: 'b', text: 'Northern Hemisphere, because December, January and February are the winter months on a Northern Hemisphere calendar, so a location that reports mild or warm readings in exactly those three months is assumed to simply be having an unusually warm winter rather than showing a different hemisphere\'s seasonal pattern.' },
        { id: 'c', text: "It cannot be determined from monthly temperatures alone, because working out a hemisphere is assumed to require knowing the location's exact latitude in degrees from the equator, not just comparing which of its own months are warmer or cooler than the rest." },
        { id: 'd', text: 'Southern Hemisphere, because its coldest month drops to only nine degrees Celsius, and a reading that cold by itself is treated as enough to place a location in the Southern Hemisphere.' },
      ],
      expectedAnswer:
        'Southern Hemisphere, because its warmest months fall in December, January and February and its coolest months fall in June, July and August, the reverse of the calendar pattern a Northern Hemisphere location shows.',
      hints: [
        'A location\'s own warmest and coolest months tell you its hemisphere -- compare them to the calendar pattern where summer falls in June, July and August (Northern Hemisphere) versus December, January and February (Southern Hemisphere).',
        "Read Location C's own numbers rather than assuming a default. Which months in the list are the highest, and which are the lowest -- and which hemisphere's calendar do those months match?",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classifying-the-pattern',
      kind: 'try_yourself',
      problem:
        "Location D's monthly average temperature in degrees Celsius, January through December, is: 27, 28, 29, 29, 28, 26, 25, 25, 26, 27, 27, 27. Location D's monthly average precipitation in millimeters, over the same twelve months in the same order, is: 5, 4, 6, 8, 40, 130, 150, 140, 60, 15, 6, 5. Which statement best classifies Location D's climate pattern?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A climate with four distinct seasons, because its monthly temperature numbers are not identical to each other and rise and fall a little across the year.' },
        { id: 'b', text: 'A warm climate with almost no temperature season at all, but a sharply wetter season from June through August and a much drier stretch during the rest of the year.', correct: true },
        { id: 'c', text: 'A dry climate all year, because a full six of its twelve months average under ten millimeters of precipitation, and that is treated as enough evidence to call the whole climate dry regardless of what the other six months show.' },
        { id: 'd', text: "It cannot be classified as wet or dry, because its precipitation numbers swing too widely from one month to the next to support any single conclusion about the whole year." },
      ],
      expectedAnswer:
        'A warm climate with almost no temperature season at all, but a sharply wetter season from June through August and a much drier stretch during the rest of the year.',
      hints: [
        'Look at how much the twelve temperature numbers actually change across the year before deciding whether a location has strong seasons in the temperature sense -- a four-degree swing is very different from a swing of twenty degrees or more.',
        'For precipitation, ask whether a few months carry far more rain than the rest, not just whether the numbers are unequal. Compare the wettest stretch of months against the ordinary months around it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-comparing-two-new-locations',
      kind: 'try_yourself',
      problem:
        "Location E's monthly average temperature in degrees Celsius, January through December, is: -8, -5, 2, 10, 17, 22, 25, 24, 18, 10, 2, -5. Location E's monthly average precipitation in millimeters, over the same twelve months in the same order, is: 40, 35, 45, 55, 70, 80, 75, 70, 60, 50, 45, 40. Location F's monthly average temperature in degrees Celsius, January through December, is: 19, 18, 17, 15, 13, 11, 10, 11, 13, 15, 16, 17. Location F's monthly average precipitation in millimeters, over the same twelve months in the same order, is: 70, 65, 75, 80, 85, 90, 95, 90, 85, 80, 75, 70. Which statement best compares the two locations' climate patterns?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "Both locations are in the Northern Hemisphere, because Location E's coldest month happens to be January and Location F's warmest month also happens to be January, and a shared calendar month is treated as proof of a shared hemisphere no matter whether that month is warm for one location and cold for the other." },
        { id: 'b', text: "Location E has the larger annual temperature range and Location F has the smaller one, and both locations are also said to have a clearly marked wet season and a clearly marked dry season, because in each list of twelve monthly precipitation numbers no two months read exactly the same amount." },
        { id: 'c', text: "Location E has a much larger annual temperature range and no strongly marked wet or dry season, Location F has a small annual temperature range and stays mild all year with no strongly marked dry season either, and the two locations are in opposite hemispheres, since Location E's coldest months are Location F's warmest months.", correct: true },
        { id: 'd', text: "Location F must receive less total precipitation over the year than Location E, because Location F's twelve monthly precipitation numbers stay closer to each other in size, and numbers that stay close together in size are assumed to add up to a smaller yearly total than numbers that vary more widely from month to month, even without actually adding either location's twelve numbers together to check." },
      ],
      expectedAnswer:
        "Location E has a much larger annual temperature range and no strongly marked wet or dry season, Location F has a small annual temperature range and stays mild all year with no strongly marked dry season either, and the two locations are in opposite hemispheres, since Location E's coldest months are Location F's warmest months.",
      hints: [
        "Work out each location's own warm and cool months separately before comparing them to each other -- a calendar month by itself, like January, tells you nothing until you know whether it is that location's warm season or its cool season.",
        "Compare the two annual temperature ranges to each other, and separately check whether either location has a stretch of months clearly wetter or drier than the rest -- a small temperature range and a low or high precipitation total are two separate facts about a location, not one fact that implies the other.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-month-is-the-pattern',
      kind: 'misconception_check',
      question:
        'A student looks at a climatograph and says: "Location A\'s January precipitation is 90 millimeters, so it is a warm-winter, wet climate all around -- January is a winter month, so warm readings in January mean an unusually warm winter." Two separate errors are tangled together here. What is wrong with each one, and what is actually true?',
      commonErrors: [
        {
          answer: 'A single very warm or very wet month proves the whole climate is warm or wet.',
          misconception:
            "Judging a location's whole-year pattern from one data point instead of comparing it against the other eleven months of the same list.",
          correctsTo:
            "A climate pattern is only visible once a month is compared against the other eleven -- the annual temperature range, the hemisphere, the wet and dry season, and the annual total are all found by looking at all twelve numbers together, never by reading a single value and stopping there.",
        },
        {
          answer: 'January is a winter month, so any location with a warm January must be having an unusually warm winter.',
          misconception:
            "Assuming the Northern Hemisphere's calendar labels for the seasons apply everywhere, rather than reading a location's own warm and cool months to determine its hemisphere.",
          correctsTo:
            "January is only a winter month for a location in the Northern Hemisphere. A location where January is one of the warmest months on its own list is showing the seasonal pattern of the Southern Hemisphere, since the two hemispheres have opposite seasons at the same point in the calendar -- the hemisphere is read from the location's own numbers, never assumed from the calendar label alone.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A climatograph is two lists of twelve numbers for one location -- monthly average temperature in degrees Celsius and monthly average precipitation in millimeters -- and reading it means using all twenty-four numbers together, never just one.',
        "The annual temperature range is the warmest month's average minus the coldest month's average.",
        'Which calendar months are warm and which are cool tells you the hemisphere: warm in June-August and cool in December-February means Northern Hemisphere; the reverse means Southern Hemisphere.',
        'A real wet season or dry season is a stretch of months clearly higher or lower than the rest of the year, not just numbers that are not perfectly equal to each other.',
        'The annual precipitation total is the sum of all twelve monthly precipitation numbers, and it can tell a different story than any single month does.',
        'One month is never the whole pattern. Compare every month against the other eleven before naming a climate pattern or comparing two locations.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Reading Climate Graphs' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
