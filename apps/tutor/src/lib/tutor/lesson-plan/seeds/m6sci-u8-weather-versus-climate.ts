/**
 * Grade 6 Science (Earth & Space Science) — Climate & the Ocean's Role:
 * Weather versus Climate.
 *
 * CONCEPT-LED fan-out row for m6sci (DCI ESS2.D, foundational to
 * MS-ESS2-6). The whole lesson turns on one distinction: WEATHER is the
 * atmosphere's state at a place right now, and CLIMATE is the typical
 * pattern of that state for a region, built by averaging weather over many
 * years. The two worked examples both take a single reported observation
 * and ask which of the two it is evidence about, because that is exactly
 * where an eleven- or twelve-year-old's confusion lives: a student who can
 * define both words cleanly will still call a single hot day "proof" that a
 * place's climate has changed.
 *
 * SCOPE GUARD: this plan teaches the weather/climate distinction by
 * timescale and aggregation, and gives examples that are true of one but
 * not the other. It does not explain WHY a region has the climate it has,
 * and it does not read or classify a climate graph.
 *   - ROW 8.2 (what determines a region's climate) owns latitude, elevation
 *     and distance from water as causes of a climate pattern. None of those
 *     three factors is named or explained anywhere in this file; this
 *     lesson only ever describes climate as "the region's typical pattern",
 *     never why that pattern exists.
 *   - ROW 8.3 (ocean currents) and ROW 8.4 (climate graphs) are not
 *     touched. No named current appears, and no climatograph -- no monthly
 *     temperature/precipitation table -- is read or built in this file.
 *   - UNIT 6 owns weather itself: air masses, fronts, weather maps and
 *     severe weather. This file uses only the plain, everyday sense of
 *     weather (today's temperature, rain, snow, wind) to build the
 *     definition; it never explains WHY a day's weather is what it is, and
 *     the words "front," "air mass," and "pressure" appear nowhere here.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this file makes no claim about the
 *     physics of heat transfer, energy, or particle behavior -- climate and
 *     weather are both described only as observed and averaged conditions.
 *   - This row deliberately does NOT discuss global warming, the greenhouse
 *     effect, or evidence for a global temperature trend. That content
 *     belongs to row 10.2 (evidence for rising global temperatures), and
 *     this row's own scope line in the curriculum table does not call for
 *     it. What this file DOES teach -- because it is the actual point of
 *     THIS row, not a detour toward row 10.2 -- is the general, non-global
 *     principle that one unusual day or event is weather, not climate, and
 *     that detecting a real change in a REGION's climate requires looking
 *     at many years of averaged records, not a single observation. No
 *     global temperature record, no carbon dioxide, and no human cause is
 *     named anywhere in this file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * location and record in this file is invented and described in words as
 * "Location A" / "Location B" / etc., and every item is solvable from the
 * text printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U8_WEATHER_VERSUS_CLIMATE: LessonPlan = {
  id: 'evelyn.ms.m6sci.weather-versus-climate.v1',
  title: 'Weather versus Climate',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.weather-versus-climate',
      standard: 'M6SCI-8.1',
      description:
        'Distinguish weather (a location\'s short-term atmospheric conditions) from climate (a region\'s typical weather pattern averaged over decades), and give an example that could be true of one but not the other (DCI ESS2.D, foundational to MS-ESS2-6).',
    },
  ],
  prerequisites: ['m6sci.weathering-erosion-and-deposition-by-water'],
  followUps: ['m6sci.what-determines-a-regions-climate'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Surface the everyday confusion between a single day and a place\'s general pattern before naming either word.',
      script:
        'Picture a field trip that gets rained out. Everybody is disappointed, and someone says, "great, it always rains here." Now picture the exact same kid, three weeks later, complaining that it has not rained in ages and the ground is bone dry. Both comments came out of the same mouth about the same town. Something is off, and it is not the town -- it is mixing up two different questions. One question is: what is the atmosphere doing right now, today, at this spot? The other question is: what does this place usually do, once you look at years and years of days like today? Today we pin down exactly what separates those two questions, and by the end you will be able to take one reported observation and say precisely which question it answers.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-weather-vs-climate',
      kind: 'concept',
      goal: 'Define weather and climate by timescale and aggregation, and establish that one observation can answer only one of the two questions.',
      keyIdeas: [
        'WEATHER is the condition of the atmosphere at a particular place at a particular time -- the temperature right now, whether it is raining or snowing right now, how strong the wind is right now, how cloudy the sky is right now. Weather can change from hour to hour and from day to day. "It is 5 degrees Celsius and snowing" is a weather statement: it describes one moment.',
        'CLIMATE is the TYPICAL pattern of weather for a region, built by averaging weather over many years -- scientists generally use records covering at least three decades before calling a pattern a region\'s climate. "Winters here average about 4 degrees Celsius" is a climate statement: it describes a pattern found across many winters, not any single one.',
        'THE SAME WORDS, TWO DIFFERENT TIMESCALES. Weather answers "what is happening right now, at this spot?" Climate answers "what usually happens here, once you look across many years?" A single measurement -- one temperature, one storm, one dry week -- can only ever be evidence about weather. To say anything about climate you need many years of records averaged together, because climate is defined as that average, not as any one entry in it.',
        'ONE OBSERVATION CAN BE TRUE OF WEATHER AND FALSE OF CLIMATE AT THE SAME TIME, AND THE OTHER WAY AROUND. A desert region can have a climate of very little yearly rainfall and still have one unusual rainy afternoon -- that afternoon is real weather, and it does not erase the region\'s climate. A region with a climate of mild, wet winters can still have one bitterly cold week -- that week is real weather too, and it does not mean the climate description was wrong. Climate is what is typical over the long run; weather is whatever is actually happening, typical or not.',
        'THE TRAP: TREATING ONE DAY AS PROOF OF A PATTERN. WRONG: "It has been unusually hot for the last three days, so this region\'s climate must be getting warmer." CORRECT: "It has been unusually hot for the last three days; that describes the weather this week, not the region\'s climate, because climate is only established by comparing many years of averaged records, not a handful of days." A real change in a region\'s climate is something you could only show by comparing one multi-decade average against a later multi-decade average -- never by pointing at a single event.',
        'THE OTHER DIRECTION OF THE TRAP: TREATING A CLIMATE DESCRIPTION AS A FORECAST. Saying a place "has a rainy climate" does not mean it rains there every single day, and saying a place "has a dry climate" does not mean it never rains there. A rainy-climate region still has dry days sometimes; a dry-climate region still has an occasional rainstorm. Climate describes the long-run average, not a guarantee about any one day picked from it.',
      ],
      vocabulary: [
        { term: 'weather', definition: 'the condition of the atmosphere -- temperature, precipitation, wind, cloudiness -- at a specific place and a specific time.' },
        { term: 'climate', definition: 'the typical pattern of weather for a region, found by averaging many years -- generally at least three decades -- of weather records.' },
        { term: 'average', definition: 'a single typical value calculated by combining many individual measurements; climate is an average of many years of weather, not any one of them.' },
        { term: 'region', definition: 'an area of land, larger than a single point location, whose climate is described as one typical pattern.' },
      ],
      suggestedTools: ['show_table', 'show_timeline'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-storm-versus-desert-climate',
      kind: 'worked_example',
      problem:
        'Location A\'s official weather records, collected over the last 60 years, show an average of less than 3 centimeters of rain per year and summer daytime highs that average above 32 degrees Celsius. One winter afternoon, a rare storm dumps 4 centimeters of rain on Location A in a few hours -- more rain than the region usually gets in an entire year -- and the temperature that day is a chilly 8 degrees Celsius. Does the storm day change how Location A\'s climate should be described?',
      steps: [
        'Sort the two pieces of information by what question each one answers. The 60-year average rainfall and average summer high describe a long-run pattern, so those numbers describe Location A\'s CLIMATE.',
        'The storm -- one afternoon, one specific rainfall total, one specific temperature -- describes what the atmosphere did on that single day. That is Location A\'s WEATHER for that day, not its climate.',
        'Compare the timescales directly. The climate figures are built from 60 years of records; the storm is one afternoon. One afternoon cannot outweigh 60 years of averaged data, because the average is defined by all of those years together, not by whichever day happened most recently.',
        'So the storm does not change the climate description. Location A is still correctly described as having a dry, hot climate. The storm is unusual weather for that region -- worth noticing, and even worth recording -- but a single afternoon is not evidence that the long-run average has changed.',
        'Run the three-clues check, since there is no arithmetic to redo here the way there would be in math. First clue, definitional: climate is defined as a many-year average, and one afternoon is not a many-year average, so by definition the storm cannot be a climate fact. Second clue, the numbers themselves: the storm\'s single-afternoon total (4 centimeters) is actually larger than the region\'s typical FULL YEAR of rain (less than 3 centimeters), which is exactly the kind of thing that happens when a single event is unusual -- an unusual event standing out from the pattern is a sign that it is describing weather, not restating the pattern. Third clue, an everyday comparison: one very high test score does not change a whole semester\'s average grade; you would need many more scores like it before the average itself moved.',
        'Now the contrasting case. Suppose Location A did not get one afternoon storm like that, but an afternoon storm dropping 4 centimeters of rain every single week, for 60 years straight. That is a different situation entirely: 4 centimeters times 52 weeks in a year is 4 x 52 = 208 centimeters of rain every year, sustained across six decades. A yearly total of 208 centimeters, repeated for 60 years, would actually replace the old climate average with a new one -- Location A would no longer be correctly described as dry. The difference between the two cases is exactly the difference between weather and climate: one storm changes nothing about the average; the same event repeated for decades IS the average.',
      ],
      answer:
        'No. The storm is one day of unusual weather. Location A\'s climate is still correctly described by its 60-year average: dry, with hot summers. A single event, however large, is not a new climate average -- only a change repeated across many years would be.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sorting-statements',
      kind: 'worked_example',
      problem:
        'Four statements are made about Location B. (1) "It is 22 degrees Celsius in Location B right now." (2) "Location B\'s summers are typically warm, with an average July high of about 29 degrees Celsius, based on 30 years of records." (3) "It has rained for the last three days straight in Location B." (4) "Winters in Location B have averaged about 4 degrees Celsius for as long as records go back." Sort each statement as WEATHER or CLIMATE, and say what tells you which is which.',
      steps: [
        'Statement 1 names one specific moment -- "right now" -- and one specific temperature. That is WEATHER: it describes the atmosphere at a single instant, with no averaging involved.',
        'Statement 2 names a span of 30 years and the word "average." Both signal CLIMATE: the number describes a typical July, built from three decades of Julys, not any one of them.',
        'Statement 3 names "the last three days" -- a short, specific span, not an average across years. Even though it covers more than one day, three days is nowhere near the decades needed to call something a climate pattern, so this is still WEATHER: a short run of actual conditions.',
        'Statement 4 says "as long as records go back" and gives an average winter temperature. That is CLIMATE: a pattern established across the full record, not a report of what one particular winter did.',
        'Notice the two signals that separate the pairs every time: does the statement name a SHORT, SPECIFIC span (right now, three days) or a LONG span described as an AVERAGE (30 years, as long as records go back)? Is the number a single reading or a value calculated by combining many years of readings? Both signals agree on all four statements, which is why the sort is unambiguous.',
        'WRONG: "Statement 3 covers three days, so it must be at least a little bit about climate." CORRECT: "Three days is a short run of actual weather, however many days it covers. Climate requires the kind of long span -- years, not days -- that lets you calculate a genuine average, and three days is nowhere close to that."',
        'Now change the input and check that the sort moves with it. Take statement 3 and stretch its span from three days to thirty years, keeping the same idea -- "it has rained on most days for the last 30 years in Location B, in this season" -- and it flips from WEATHER to CLIMATE, because it is now describing a pattern across decades rather than a specific short run. The sort is not fixed to the sentence\'s subject; it is fixed to the timescale and whether an average was taken.',
      ],
      answer:
        'Statement 1 is weather (a single moment). Statement 2 is climate (a 30-year average). Statement 3 is weather (a specific three-day span, however unusual). Statement 4 is climate (a long-term average). The sort follows the timescale named in each statement and whether the number is a single reading or a many-year average.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-single-moment-report',
      kind: 'try_yourself',
      problem:
        'A weather reporter says: "Right now, it is 5 degrees Celsius and snowing in Location C." What kind of statement is this, and why?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A climate statement, because it gives an exact temperature, and climate is described using exact numbers rather than vague ones.',
        },
        {
          id: 'b',
          text: 'A weather statement, because it describes the atmosphere in Location C at a single moment in time, with no averaging across years involved.',
          correct: true,
        },
        {
          id: 'c',
          text: 'A climate statement, because it is winter, and cold, snowy conditions are exactly what winter weather is expected to look like there.',
        },
        {
          id: 'd',
          text: 'Neither one, because a single reported temperature is not enough information to classify as weather or climate at all.',
        },
      ],
      expectedAnswer:
        'A weather statement, because it describes the atmosphere in Location C at a single moment in time, with no averaging across years involved.',
      hints: [
        'Ask what span of time the statement covers. Does "right now" describe one moment, or a pattern built from many years?',
        'A statement does not need years of averaged records behind it to count as weather -- one moment of actual atmospheric conditions is exactly what a weather report is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-evidence-answers-the-question',
      kind: 'try_yourself',
      problem:
        'A student wants to know whether Location D generally has a rainy climate or a dry climate. Which piece of information would actually answer that question?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'How much rain fell in Location D yesterday, since yesterday is the most recent and most reliable day of data available.',
        },
        {
          id: 'b',
          text: 'A video someone recorded of a heavy rainstorm in Location D last month, since seeing the rain firsthand is stronger evidence than a written record.',
        },
        {
          id: 'c',
          text: 'The average yearly rainfall in Location D, calculated from many years of records, since that average is what a region\'s climate actually is.',
          correct: true,
        },
        {
          id: 'd',
          text: 'A forecast of whether it will rain in Location D tomorrow, since a forecast is based on current atmospheric patterns moving toward the region.',
        },
      ],
      expectedAnswer:
        'The average yearly rainfall in Location D, calculated from many years of records, since that average is what a region\'s climate actually is.',
      hints: [
        'Yesterday\'s rain, one video of one storm, and tomorrow\'s forecast all describe a single day or a short span. Does any of them involve averaging across years?',
        'Climate is defined as a long-run average. Look for the one choice that is actually built by combining many years of records rather than reporting or predicting a single day.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-hot-day-versus-the-record',
      kind: 'try_yourself',
      problem:
        'Location E\'s official climate record, built from 40 years of data, shows an average July high of about 27 degrees Celsius. This July, one particular day reaches 38 degrees Celsius, well above that average. A month later, the region\'s official 40-year climate record is checked again and still shows the same 27-degree average July high. What can correctly be said about Location E?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The single hot day proves that Location E\'s climate has already become warmer than the 40-year record shows, and the record needs updating right away.',
        },
        {
          id: 'b',
          text: 'Because one day was so far above the average, the 40-year record must have been calculated incorrectly and should be thrown out and remeasured.',
        },
        {
          id: 'c',
          text: 'Because this one day was so much hotter than usual, next July\'s average high in Location E will also come in above 27 degrees Celsius.',
        },
        {
          id: 'd',
          text: 'The single hot day was an unusual instance of weather; Location E\'s climate is still correctly described by the unchanged 40-year average.',
          correct: true,
        },
      ],
      expectedAnswer:
        'The single hot day was an unusual instance of weather; Location E\'s climate is still correctly described by the unchanged 40-year average.',
      hints: [
        'The climate record was checked again after the hot day and came back the same number. What does that tell you about whether one day can move a 40-year average?',
        'A single day standing out from a long-term average is itself the definition of unusual weather -- it does not mean the average it stands out from is wrong or that it predicts what next year\'s average will be.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-event-versus-the-pattern',
      kind: 'misconception_check',
      question:
        'Two students make claims. Student one says: "It snowed all day in my town yesterday, so our climate must be a snowy, cold climate." Student two says: "My cousin says her town has a rainy climate, but it was not raining at all when I visited, so she must be wrong." What is wrong with each claim?',
      commonErrors: [
        {
          answer: 'It snowed all day in my town yesterday, so our climate must be a snowy, cold climate.',
          misconception:
            'Treating a single day\'s weather event as proof of the region\'s climate classification, because one dramatic day feels like strong enough evidence on its own.',
          correctsTo:
            'One snowy day is weather -- a description of what the atmosphere did on one specific day. A region\'s climate is the pattern found across many winters, not one storm. A place with an overall mild climate can still have one unusually snowy day, and a place with a genuinely snowy, cold climate can also have days with no snow at all. To classify the climate, you would need many years of winter records, not yesterday.',
        },
        {
          answer: 'My cousin\'s town has a rainy climate, but it was not raining when I visited, so she must be wrong.',
          misconception:
            'Expecting a climate description to match the weather on any single day, as if "rainy climate" meant "raining every day."',
          correctsTo:
            'A rainy climate means that, averaged over many years, the region gets a large amount of rain -- it does not mean it rains there every single day. A region with a rainy climate still has plenty of dry days, and a region with a dry climate still has occasional rainy days. Climate describes the long-run pattern; any single day\'s weather, including the day of a visit, can differ from that pattern without contradicting it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Weather is the atmosphere\'s condition at a specific place and time. Climate is a region\'s typical weather pattern, found by averaging many years -- generally at least three decades -- of records.',
        'A single observation -- one temperature, one storm, one dry week -- can only ever be evidence about weather. Evidence about climate requires many years of averaged records.',
        'A region\'s climate can include days that do not match it: a dry climate can have one rainy day, and a mild climate can have one very cold day, without either climate description being wrong.',
        'One unusual day never proves a region\'s climate has changed. Showing a real change would require comparing one multi-decade average against a later multi-decade average.',
        'A climate description is not a forecast for any single day. "Rainy climate" describes a long-run average, not a guarantee about tomorrow.',
        'To decide whether a statement is about weather or climate, check its timescale: a short, specific span describes weather; a long span reported as an average describes climate.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Weather versus Climate' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
