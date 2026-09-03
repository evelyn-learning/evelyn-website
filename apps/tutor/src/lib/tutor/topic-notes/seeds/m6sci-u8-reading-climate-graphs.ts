/**
 * Grade 6 Science — Unit 8 CED 8.4: Reading Climate Graphs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.reading-climate-graphs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U8_READING_CLIMATE_GRAPHS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.reading-climate-graphs.v1',
  course: 'Grade 6 Science',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Reading Climate Graphs',
  planId: 'evelyn.ms.m6sci.reading-climate-graphs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.reading-climate-graphs.v1' }],
  theory: [
    { loId: 'm6sci.reading-climate-graphs', content: `WHAT A CLIMATOGRAPH GIVES YOU. A climatograph for one location is two lists of twelve numbers, one for each month of the year: a monthly average temperature in degrees Celsius, and a monthly average precipitation in millimeters. Every number is an average built up from many years of weather at that location, so it shows the location's typical pattern, not what happened on any single day or in any single year. Reading a climatograph means reading all twenty-four numbers together, not picking out one and stopping there.` },
    { loId: 'm6sci.reading-climate-graphs', content: `FINDING THE ANNUAL TEMPERATURE RANGE AND THE HEMISPHERE. Find the single warmest month and the single coldest month; the annual temperature range is the warmest month's average minus the coldest month's average. Then look at WHICH months those are on the calendar. If the warmest months fall around June, July and August, and the coolest months fall around December, January and February, that is the seasonal pattern of a Northern Hemisphere location. If it is the other way around -- warmest around December, January and February, coolest around June, July and August -- that is the seasonal pattern of a Southern Hemisphere location, because the two hemispheres experience opposite seasons at the same point in the calendar.` },
    { loId: 'm6sci.reading-climate-graphs', content: `FINDING A WET SEASON AND A DRY SEASON. Compare the twelve monthly precipitation numbers against each other. A real wet season is a stretch of months that is clearly higher than the rest of the year, and a real dry season is a stretch that is clearly lower. If every month sits in roughly the same range as every other month, the location does not have a strongly marked wet or dry season -- it is either wet all year, dry all year, or somewhere in between, depending on the general level of all twelve numbers.` },
    { loId: 'm6sci.reading-climate-graphs', content: `THE ANNUAL TOTAL IS A SUM, NOT A GUESS. Adding all twelve monthly precipitation numbers gives the annual total, and that total can tell a different story than any single month does. For example, if three months out of twelve carry 420 millimeters out of a full year's total of 569 millimeters, that is more than seventy percent of the entire year's rain arriving in just one quarter of the months -- a real wet season, not just one wetter month sitting among eleven ordinary ones.` },
    { loId: 'm6sci.reading-climate-graphs', content: `THE ROUTINE, IN ORDER. (1) Read the twelve temperature numbers and the twelve precipitation numbers, noting the units. (2) Find the warmest and coldest months and compute the annual temperature range. (3) Use which calendar months are warm and which are cool to name the hemisphere. (4) Scan the precipitation numbers for a wet season and a dry season, or decide there is not a strongly marked one. (5) Add all twelve precipitation numbers for the annual total. (6) Combine all of it into one climate-pattern statement for that location -- never from a single month by itself.` },
    { loId: 'm6sci.reading-climate-graphs', content: `THE TRAP: ONE MONTH IS NEVER THE WHOLE PATTERN. A single warm month, cold month, wet month or dry month proves nothing about a location's overall climate by itself. The pattern only appears once that month is compared against the other eleven, which is exactly what makes this different from simply reading one value off an axis.` },
    { loId: 'm6sci.reading-climate-graphs', kind: 'definition', title: 'climatograph', content: `a record of one location's typical monthly average temperature and monthly average precipitation, built up from many years of weather at that location.` },
    { loId: 'm6sci.reading-climate-graphs', kind: 'definition', title: 'annual temperature range', content: `the difference between a location's warmest monthly average temperature and its coolest monthly average temperature over the year.` },
    { loId: 'm6sci.reading-climate-graphs', kind: 'definition', title: 'wet season', content: `a stretch of months when a location's precipitation is clearly higher than during the rest of its year.` },
    { loId: 'm6sci.reading-climate-graphs', kind: 'definition', title: 'dry season', content: `a stretch of months when a location's precipitation is clearly lower than during the rest of its year.` },
    { loId: 'm6sci.reading-climate-graphs', kind: 'definition', title: 'annual precipitation total', content: `the sum of a location's twelve monthly average precipitation numbers, giving the typical amount of precipitation the location receives across a whole year.` },
    { loId: 'm6sci.reading-climate-graphs', kind: 'definition', title: 'seasonal pattern', content: `which calendar months are the warm season and which are the cool season for a location, used to tell whether that location is in the Northern or Southern Hemisphere.` },
  ],
  methods: [
    {
      title: 'Worked single location pattern',
      steps: [
        `Step 1, find the warmest and coldest months. Reading down the temperature list, the warmest month is July at 25 degrees Celsius, and the coldest month is January at 8 degrees Celsius. The annual temperature range is 25 minus 8, which is 17 degrees Celsius.`,
        `Step 2, use the warm and cool months to name the hemisphere. Location A's warmest months are June, July and August, and its coolest months are December, January and February. That is the calendar pattern of a Northern Hemisphere location, where summer falls in June through August.`,
        `Step 3, look for a wet season and a dry season. The precipitation numbers are highest in December, January and February (85, 90 and 80 millimeters) and lowest in June, July and August (5, 2 and 3 millimeters). That is a clearly wetter winter and a clearly drier summer -- a real wet season and a real dry season, not just numbers that wobble a little from month to month.`,
        `Step 4, add all twelve precipitation numbers for the annual total. 90 + 80 + 60 + 30 + 15 + 5 + 2 + 3 + 10 + 40 + 70 + 85 = 490 millimeters for the year.`,
        `Now check the answer the way a science answer has to be checked, since there is no equation to work backward through. Three different kinds of clues agree here: the CALENDAR position of the warm and cool months (June-August warm, December-February cool) says Northern Hemisphere; the PRECIPITATION pattern (wettest in winter, driest in summer) says a wet-winter, dry-summer climate; and the SIZE of the range (17 degrees Celsius) says a moderate, not extreme, seasonal swing. Three different kinds of evidence, one answer.`,
        `Now change one thing to be sure the hemisphere reading is doing real work. If Location A's warmest months had instead been December, January and February, with June, July and August the coolest, every step of the routine above would point to the Southern Hemisphere instead -- the numbers would not have to change in size, only in which calendar months carried them.`,
        `WRONG: "Location A is a wet climate because January's precipitation, 90 millimeters, is a big number." CORRECT: "Location A has a wet winter and a dry summer -- one large monthly number does not make a whole climate wet, and one small monthly number does not make it dry, without comparing every month."`,
      ],
      example: { problem: `Location A's monthly average temperature in degrees Celsius, January through December, is: 8, 9, 11, 14, 18, 22, 25, 24, 21, 16, 12, 9. Location A's monthly average precipitation in millimeters, over the same twelve months in the same order, is: 90, 80, 60, 30, 15, 5, 2, 3, 10, 40, 70, 85. Describe Location A's climate pattern: its annual temperature range, its hemisphere, its wet and dry season, and its annual precipitation total.`, solution: `Location A has a moderate annual temperature range of 17 degrees Celsius, with warm summers (June-August) and cool winters (December-February), which is the seasonal pattern of the Northern Hemisphere. It has a clear wet season in winter (December-February) and a clear dry season in summer (June-August), and it receives 490 millimeters of precipitation over the year.` },
      relatedLoIds: ['m6sci.reading-climate-graphs'],
    },
    {
      title: 'Worked comparing two locations',
      steps: [
        `Step 1, find Location B's warmest and coldest months. The warmest month is January at 33 degrees Celsius, and the coldest month is July at 11 degrees Celsius. The annual temperature range is 33 minus 11, which is 22 degrees Celsius.`,
        `Step 2, use Location B's warm and cool months to name its hemisphere. Location B's warmest months are December, January and February, and its coolest months are June, July and August. That is the reverse of Location A's pattern, so Location B is in the Southern Hemisphere, where summer falls in December through February.`,
        `Step 3, add Location B's twelve precipitation numbers for its annual total. 3 + 4 + 3 + 2 + 4 + 5 + 4 + 3 + 2 + 2 + 3 + 4 = 39 millimeters for the year.`,
        `Step 4, compare the two totals directly. Location A receives 490 millimeters a year; Location B receives only 39 millimeters. 490 divided by 39 is about 12.6, so Location A is more than twelve times as wet as Location B. Location B's monthly numbers also never rise far above single digits in any month, so it has no real wet season at all -- it is dry nearly all year, unlike Location A, which has one clearly wet season and one clearly dry season within an otherwise moderate climate.`,
        `Three different kinds of clues separate these two locations: the CALENDAR pattern (opposite hemispheres), the TOTAL precipitation (490 versus 39 millimeters), and the SHAPE of the precipitation across the year (Location A swings sharply between its wet and dry season; Location B stays low in every single month).`,
        `Now change one thing to check the comparison is doing real work. If Location B's precipitation numbers were instead 90, 80, 60, 30, 15, 5, 2, 3, 10, 40, 70 and 85 -- the same twelve numbers as Location A -- the two locations would no longer differ in wetness at all, only in which hemisphere they sit in. The hemisphere difference and the wetness difference are two separate facts, each carried by its own set of numbers.`,
        `WRONG: "Location B must be in the Northern Hemisphere too, because most locations people learn about first are in the Northern Hemisphere." CORRECT: "Location B's own warm and cool months point to the Southern Hemisphere, and that reading comes from Location B's own numbers, never from an assumption about which hemisphere is more familiar."`,
      ],
      example: { problem: `Location A has an annual temperature range of 17 degrees Celsius, a warm season in June, July and August, a cool season in December, January and February, and 490 millimeters of precipitation for the year, as found in the previous problem. Location B's monthly average temperature in degrees Celsius, January through December, is: 33, 32, 28, 22, 16, 12, 11, 14, 19, 24, 29, 32. Location B's monthly average precipitation in millimeters, over the same twelve months in the same order, is: 3, 4, 3, 2, 4, 5, 4, 3, 2, 2, 3, 4. Compare Location A and Location B: which hemisphere is each in, and how does their overall wetness compare?`, solution: `Location A is in the Northern Hemisphere with a moderate 17-degree-Celsius range and a clear wet-winter, dry-summer pattern totaling 490 millimeters a year. Location B is in the Southern Hemisphere, with a larger 22-degree-Celsius range and almost no precipitation in any month, totaling only 39 millimeters a year and showing no real wet season at all.` },
      relatedLoIds: ['m6sci.reading-climate-graphs'],
    },
  ],
  pointers: [
    { content: `Students often say "A single very warm or very wet month proves the whole climate is warm or wet." — A climate pattern is only visible once a month is compared against the other eleven -- the annual temperature range, the hemisphere, the wet and dry season, and the annual total are all found by looking at all twelve numbers together, never by reading a single value and stopping there.`, kind: 'common-error' },
    { content: `Students often say "January is a winter month, so any location with a warm January must be having an unusually warm winter." — January is only a winter month for a location in the Northern Hemisphere. A location where January is one of the warmest months on its own list is showing the seasonal pattern of the Southern Hemisphere, since the two hemispheres have opposite seasons at the same point in the calendar -- the hemisphere is read from the location's own numbers, never assumed from the calendar label alone.`, kind: 'common-error' },
    { content: `A climatograph is two lists of twelve numbers for one location -- monthly average temperature in degrees Celsius and monthly average precipitation in millimeters -- and reading it means using all twenty-four numbers together, never just one.`, kind: 'tip' },
    { content: `The annual temperature range is the warmest month's average minus the coldest month's average.`, kind: 'tip' },
    { content: `Which calendar months are warm and which are cool tells you the hemisphere: warm in June-August and cool in December-February means Northern Hemisphere; the reverse means Southern Hemisphere.`, kind: 'tip' },
    { content: `A real wet season or dry season is a stretch of months clearly higher or lower than the rest of the year, not just numbers that are not perfectly equal to each other.`, kind: 'tip' },
    { content: `The annual precipitation total is the sum of all twelve monthly precipitation numbers, and it can tell a different story than any single month does.`, kind: 'tip' },
    { content: `One month is never the whole pattern. Compare every month against the other eleven before naming a climate pattern or comparing two locations.`, kind: 'tip' },
  ],
};
