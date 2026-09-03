/**
 * Grade 6 Science — Unit 8 CED 8.1: Weather versus Climate.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.weather-versus-climate.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U8_WEATHER_VERSUS_CLIMATE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.weather-versus-climate.v1',
  course: 'Grade 6 Science',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Weather versus Climate',
  planId: 'evelyn.ms.m6sci.weather-versus-climate.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.weather-versus-climate.v1' }],
  theory: [
    { loId: 'm6sci.weather-versus-climate', content: `WEATHER is the condition of the atmosphere at a particular place at a particular time -- the temperature right now, whether it is raining or snowing right now, how strong the wind is right now, how cloudy the sky is right now. Weather can change from hour to hour and from day to day. "It is 5 degrees Celsius and snowing" is a weather statement: it describes one moment.` },
    { loId: 'm6sci.weather-versus-climate', content: `CLIMATE is the TYPICAL pattern of weather for a region, built by averaging weather over many years -- scientists generally use records covering at least three decades before calling a pattern a region's climate. "Winters here average about 4 degrees Celsius" is a climate statement: it describes a pattern found across many winters, not any single one.` },
    { loId: 'm6sci.weather-versus-climate', content: `THE SAME WORDS, TWO DIFFERENT TIMESCALES. Weather answers "what is happening right now, at this spot?" Climate answers "what usually happens here, once you look across many years?" A single measurement -- one temperature, one storm, one dry week -- can only ever be evidence about weather. To say anything about climate you need many years of records averaged together, because climate is defined as that average, not as any one entry in it.` },
    { loId: 'm6sci.weather-versus-climate', content: `ONE OBSERVATION CAN BE TRUE OF WEATHER AND FALSE OF CLIMATE AT THE SAME TIME, AND THE OTHER WAY AROUND. A desert region can have a climate of very little yearly rainfall and still have one unusual rainy afternoon -- that afternoon is real weather, and it does not erase the region's climate. A region with a climate of mild, wet winters can still have one bitterly cold week -- that week is real weather too, and it does not mean the climate description was wrong. Climate is what is typical over the long run; weather is whatever is actually happening, typical or not.` },
    { loId: 'm6sci.weather-versus-climate', content: `THE TRAP: TREATING ONE DAY AS PROOF OF A PATTERN. WRONG: "It has been unusually hot for the last three days, so this region's climate must be getting warmer." CORRECT: "It has been unusually hot for the last three days; that describes the weather this week, not the region's climate, because climate is only established by comparing many years of averaged records, not a handful of days." A real change in a region's climate is something you could only show by comparing one multi-decade average against a later multi-decade average -- never by pointing at a single event.` },
    { loId: 'm6sci.weather-versus-climate', content: `THE OTHER DIRECTION OF THE TRAP: TREATING A CLIMATE DESCRIPTION AS A FORECAST. Saying a place "has a rainy climate" does not mean it rains there every single day, and saying a place "has a dry climate" does not mean it never rains there. A rainy-climate region still has dry days sometimes; a dry-climate region still has an occasional rainstorm. Climate describes the long-run average, not a guarantee about any one day picked from it.` },
    { loId: 'm6sci.weather-versus-climate', kind: 'definition', title: 'weather', content: `the condition of the atmosphere -- temperature, precipitation, wind, cloudiness -- at a specific place and a specific time.` },
    { loId: 'm6sci.weather-versus-climate', kind: 'definition', title: 'climate', content: `the typical pattern of weather for a region, found by averaging many years -- generally at least three decades -- of weather records.` },
    { loId: 'm6sci.weather-versus-climate', kind: 'definition', title: 'average', content: `a single typical value calculated by combining many individual measurements; climate is an average of many years of weather, not any one of them.` },
    { loId: 'm6sci.weather-versus-climate', kind: 'definition', title: 'region', content: `an area of land, larger than a single point location, whose climate is described as one typical pattern.` },
  ],
  methods: [
    {
      title: 'Worked storm versus desert climate',
      steps: [
        `Sort the two pieces of information by what question each one answers. The 60-year average rainfall and average summer high describe a long-run pattern, so those numbers describe Location A's CLIMATE.`,
        `The storm -- one afternoon, one specific rainfall total, one specific temperature -- describes what the atmosphere did on that single day. That is Location A's WEATHER for that day, not its climate.`,
        `Compare the timescales directly. The climate figures are built from 60 years of records; the storm is one afternoon. One afternoon cannot outweigh 60 years of averaged data, because the average is defined by all of those years together, not by whichever day happened most recently.`,
        `So the storm does not change the climate description. Location A is still correctly described as having a dry, hot climate. The storm is unusual weather for that region -- worth noticing, and even worth recording -- but a single afternoon is not evidence that the long-run average has changed.`,
        `Run the three-clues check, since there is no arithmetic to redo here the way there would be in math. First clue, definitional: climate is defined as a many-year average, and one afternoon is not a many-year average, so by definition the storm cannot be a climate fact. Second clue, the numbers themselves: the storm's single-afternoon total (4 centimeters) is actually larger than the region's typical FULL YEAR of rain (less than 3 centimeters), which is exactly the kind of thing that happens when a single event is unusual -- an unusual event standing out from the pattern is a sign that it is describing weather, not restating the pattern. Third clue, an everyday comparison: one very high test score does not change a whole semester's average grade; you would need many more scores like it before the average itself moved.`,
        `Now the contrasting case. Suppose Location A did not get one afternoon storm like that, but an afternoon storm dropping 4 centimeters of rain every single week, for 60 years straight. That is a different situation entirely: 4 centimeters times 52 weeks in a year is 4 x 52 = 208 centimeters of rain every year, sustained across six decades. A yearly total of 208 centimeters, repeated for 60 years, would actually replace the old climate average with a new one -- Location A would no longer be correctly described as dry. The difference between the two cases is exactly the difference between weather and climate: one storm changes nothing about the average; the same event repeated for decades IS the average.`,
      ],
      example: { problem: `Location A's official weather records, collected over the last 60 years, show an average of less than 3 centimeters of rain per year and summer daytime highs that average above 32 degrees Celsius. One winter afternoon, a rare storm dumps 4 centimeters of rain on Location A in a few hours -- more rain than the region usually gets in an entire year -- and the temperature that day is a chilly 8 degrees Celsius. Does the storm day change how Location A's climate should be described?`, solution: `No. The storm is one day of unusual weather. Location A's climate is still correctly described by its 60-year average: dry, with hot summers. A single event, however large, is not a new climate average -- only a change repeated across many years would be.` },
      relatedLoIds: ['m6sci.weather-versus-climate'],
    },
    {
      title: 'Worked sorting statements',
      steps: [
        `Statement 1 names one specific moment -- "right now" -- and one specific temperature. That is WEATHER: it describes the atmosphere at a single instant, with no averaging involved.`,
        `Statement 2 names a span of 30 years and the word "average." Both signal CLIMATE: the number describes a typical July, built from three decades of Julys, not any one of them.`,
        `Statement 3 names "the last three days" -- a short, specific span, not an average across years. Even though it covers more than one day, three days is nowhere near the decades needed to call something a climate pattern, so this is still WEATHER: a short run of actual conditions.`,
        `Statement 4 says "as long as records go back" and gives an average winter temperature. That is CLIMATE: a pattern established across the full record, not a report of what one particular winter did.`,
        `Notice the two signals that separate the pairs every time: does the statement name a SHORT, SPECIFIC span (right now, three days) or a LONG span described as an AVERAGE (30 years, as long as records go back)? Is the number a single reading or a value calculated by combining many years of readings? Both signals agree on all four statements, which is why the sort is unambiguous.`,
        `WRONG: "Statement 3 covers three days, so it must be at least a little bit about climate." CORRECT: "Three days is a short run of actual weather, however many days it covers. Climate requires the kind of long span -- years, not days -- that lets you calculate a genuine average, and three days is nowhere close to that."`,
        `Now change the input and check that the sort moves with it. Take statement 3 and stretch its span from three days to thirty years, keeping the same idea -- "it has rained on most days for the last 30 years in Location B, in this season" -- and it flips from WEATHER to CLIMATE, because it is now describing a pattern across decades rather than a specific short run. The sort is not fixed to the sentence's subject; it is fixed to the timescale and whether an average was taken.`,
      ],
      example: { problem: `Four statements are made about Location B. (1) "It is 22 degrees Celsius in Location B right now." (2) "Location B's summers are typically warm, with an average July high of about 29 degrees Celsius, based on 30 years of records." (3) "It has rained for the last three days straight in Location B." (4) "Winters in Location B have averaged about 4 degrees Celsius for as long as records go back." Sort each statement as WEATHER or CLIMATE, and say what tells you which is which.`, solution: `Statement 1 is weather (a single moment). Statement 2 is climate (a 30-year average). Statement 3 is weather (a specific three-day span, however unusual). Statement 4 is climate (a long-term average). The sort follows the timescale named in each statement and whether the number is a single reading or a many-year average.` },
      relatedLoIds: ['m6sci.weather-versus-climate'],
    },
  ],
  pointers: [
    { content: `Students often say "It snowed all day in my town yesterday, so our climate must be a snowy, cold climate." — One snowy day is weather -- a description of what the atmosphere did on one specific day. A region's climate is the pattern found across many winters, not one storm. A place with an overall mild climate can still have one unusually snowy day, and a place with a genuinely snowy, cold climate can also have days with no snow at all. To classify the climate, you would need many years of winter records, not yesterday.`, kind: 'common-error' },
    { content: `Students often say "My cousin's town has a rainy climate, but it was not raining when I visited, so she must be wrong." — A rainy climate means that, averaged over many years, the region gets a large amount of rain -- it does not mean it rains there every single day. A region with a rainy climate still has plenty of dry days, and a region with a dry climate still has occasional rainy days. Climate describes the long-run pattern; any single day's weather, including the day of a visit, can differ from that pattern without contradicting it.`, kind: 'common-error' },
    { content: `Weather is the atmosphere's condition at a specific place and time. Climate is a region's typical weather pattern, found by averaging many years -- generally at least three decades -- of records.`, kind: 'tip' },
    { content: `A single observation -- one temperature, one storm, one dry week -- can only ever be evidence about weather. Evidence about climate requires many years of averaged records.`, kind: 'tip' },
    { content: `A region's climate can include days that do not match it: a dry climate can have one rainy day, and a mild climate can have one very cold day, without either climate description being wrong.`, kind: 'tip' },
    { content: `One unusual day never proves a region's climate has changed. Showing a real change would require comparing one multi-decade average against a later multi-decade average.`, kind: 'tip' },
    { content: `A climate description is not a forecast for any single day. "Rainy climate" describes a long-run average, not a guarantee about tomorrow.`, kind: 'tip' },
    { content: `To decide whether a statement is about weather or climate, check its timescale: a short, specific span describes weather; a long span reported as an average describes climate.`, kind: 'tip' },
  ],
};
