/**
 * Grade 6 Science — Unit 6 CED 6.3: Reading Weather Maps.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.reading-weather-maps.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U6_READING_WEATHER_MAPS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.reading-weather-maps.v1',
  course: 'Grade 6 Science',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Reading Weather Maps',
  planId: 'evelyn.ms.m6sci.reading-weather-maps.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.reading-weather-maps.v1' }],
  theory: [
    { loId: 'm6sci.reading-weather-maps', content: `WHAT THIS LESSON'S MAP GIVES YOU. A real weather map draws a front as a special line, a pressure center as a circled H or L, and a station as a small cluster of symbols. Every one of those pictures is given to you in this lesson as words instead: a stated position for a front and which way it is moving, a stated label for a pressure center and where it sits, and a listed set of readings for each station -- temperature, wind direction, and whether pressure is rising, falling, or steady. The skill in this lesson is working out what those listed readings mean for what happens next, not naming what a picture is called.` },
    { loId: 'm6sci.reading-weather-maps', content: `PRESSURE TREND IS A LEADING CLUE, NOT AN INSTANT VERDICT. Falling pressure at a station usually means a low-pressure system is on its way, so clouds and a chance of precipitation usually increase over the following day. Rising pressure usually means a high-pressure system is on its way, so skies usually clear and stay drier. Steady pressure usually means little change is coming soon. None of this says exactly WHEN the change will arrive by itself -- for that you also need a front or pressure center's stated position and direction of travel.` },
    { loId: 'm6sci.reading-weather-maps', content: `A FRONT IS A BOUNDARY, NOT A STORM, AND ITS TYPE DETERMINES WHAT ARRIVES. A front marks where two air masses meet, and the map states which way it is moving. A cold front usually brings a brief period of heavier rain or thunderstorms right as it passes, with wind shifting from a southerly direction toward a northwesterly one, and then cooler, clearer air behind it. A warm front usually brings a longer period of lighter, steadier rain, and then milder air behind it. Neither type is the storm itself -- the front is the boundary, and the weather it produces is what happens as that boundary moves through.` },
    { loId: 'm6sci.reading-weather-maps', content: `THE ROUTINE: find every reading that applies to your city, note the trend, match the type, then combine. Step one, find the city's own station reading and the nearest front or pressure center, plus its stated distance and direction of travel. Step two, note whether pressure is rising, falling, or steady at that station. Step three, if a front or pressure center is approaching, match its type (cold front, warm front, low, high) to what that type usually produces. Step four, put it together into one forecast statement for that specific city over a stated stretch of time -- not for the whole map, and not forever.` },
    { loId: 'm6sci.reading-weather-maps', content: `THE TRAP: DIRECTION MATTERS AS MUCH AS EXISTENCE. A front already moving AWAY from a city, or a pressure center sitting far off with no connection to that city's own trend, tells you almost nothing about that city's next day. A front drawn somewhere on the map is only useful to a city's forecast if it is heading toward that city; the very same front moving the other way is someone else's forecast, not this city's.` },
    { loId: 'm6sci.reading-weather-maps', kind: 'definition', title: 'weather map', content: `a map that shows current weather readings from many stations at once, along with the position of fronts and pressure centers.` },
    { loId: 'm6sci.reading-weather-maps', kind: 'definition', title: 'station reading', content: `the set of weather details reported at one location on a map: temperature, wind direction, and whether pressure is rising, falling, or steady.` },
    { loId: 'm6sci.reading-weather-maps', kind: 'definition', title: 'pressure trend', content: `whether a location's air pressure is rising, falling, or holding steady, which by itself hints at what kind of system is approaching.` },
    { loId: 'm6sci.reading-weather-maps', kind: 'definition', title: 'front', content: `the boundary where two air masses of different temperature and moisture meet, drawn on a map as a line with a stated direction of travel.` },
    { loId: 'm6sci.reading-weather-maps', kind: 'definition', title: 'cold front', content: `a front where cold air is replacing warm air, usually producing a brief period of heavier rain or storms, then cooler, clearer weather.` },
    { loId: 'm6sci.reading-weather-maps', kind: 'definition', title: 'warm front', content: `a front where warm air is replacing cold air, usually producing a longer period of lighter, steadier rain, then milder weather.` },
    { loId: 'm6sci.reading-weather-maps', kind: 'definition', title: 'pressure center', content: `a location labeled high or low on a map where pressure is at a local extreme; a low is usually linked to clouds and a chance of precipitation, and a high is usually linked to clear, drier weather.` },
  ],
  methods: [
    {
      title: 'Worked cold front approaching',
      steps: [
        `Step 1, gather every reading that applies to Cedar City. That means Cedar City's own station (falling pressure, south wind, 24 degrees, partly cloudy) plus the nearest system that could reach it: the cold front, currently 200 kilometers west and moving east, straight toward the city.`,
        `Step 2, read the pressure trend. Falling pressure at Cedar City means a system is approaching and clouds or precipitation are becoming more likely soon -- consistent with the front closing in from the west.`,
        `Step 3, match the front's type to what it usually produces. A cold front usually brings a brief period of heavier rain or thunderstorms right as it passes, with wind shifting from a southerly direction toward a northwesterly one, and then cooler, clearer air behind it.`,
        `Step 4, use Millridge as a second, different kind of clue: it sits behind that same front, further along in the very sequence Cedar City is about to go through. Millridge's steady pressure, northwest wind, cooler 14-degree temperature, and clear skies are what "after the front" looks like, and they match what step 3 predicts should eventually arrive at Cedar City too.`,
        `Put the three kinds of evidence together: the pressure TREND at Cedar City (falling, so change is coming), the front's stated TYPE and DIRECTION (cold, moving east, straight toward the city), and Millridge's ALREADY-REALIZED example of what comes after a cold front passes. Three different kinds of clue, all agreeing on the same forecast.`,
        `WRONG: "Cedar City is fine because there is no front sitting on top of it right now." CORRECT: "Cedar City is not fine for long, because the front is moving toward it and the city's own pressure is already falling." A front's current position matters less than where it is headed.`,
        `Now change one thing, to be sure direction is doing the work it should. If that same cold front were instead moving west, away from Cedar City, the city's falling pressure would still deserve attention, but it would not be explained by this particular front -- the front would be heading toward Millridge's side of the map instead, and Cedar City's forecast would need a different cause than the one in this problem.`,
      ],
      example: { problem: `A weather map shows two things relevant to Cedar City. First, Cedar City's own station reports: pressure falling steadily, wind blowing from the south, temperature 24 degrees Celsius, and skies partly cloudy. Second, a cold front is drawn as a line running north to south about 200 kilometers west of Cedar City, and the front is moving east, toward Cedar City. A second station, in Millridge, sits about 100 kilometers west of that same cold front -- meaning the front has already passed Millridge -- and reports: pressure steady, wind blowing from the northwest, temperature 14 degrees Celsius, and clear skies. Describe what is happening at Cedar City right now, and what is likely to happen there over the next day.`, solution: `Right now, Cedar City sits ahead of an approaching cold front, in milder, more humid air, with pressure already falling. Over the next day, expect a brief period of heavier rain or thunderstorms as the front arrives, with wind shifting from south toward northwest, followed by cooler, clearer weather similar to what Millridge is already reporting behind the same front.` },
      relatedLoIds: ['m6sci.reading-weather-maps'],
    },
    {
      title: 'Worked low versus high',
      steps: [
        `Step 1, gather the readings for each city separately. Riverdale: falling pressure, cloudy, 20 degrees, and a low-pressure center labeled 150 kilometers to its north. Sunview: rising pressure, clear, 16 degrees, and no nearby system at all.`,
        `Step 2, read each pressure trend on its own. Riverdale's falling pressure means conditions are likely to become more unsettled, not less. Sunview's rising pressure means conditions are likely to stay fair or become clearer still.`,
        `Step 3, match the pressure center to what it usually produces. A low-pressure center is usually linked to cloudy skies and a rising chance of precipitation, which matches Riverdale's own cloudy reading and its nearby labeled L. There is no pressure center anywhere near Sunview, so nothing on the map points Sunview toward that same outcome.`,
        `Step 4, combine three different kinds of evidence for Riverdale: the pressure TREND (falling), the LABELED SYSTEM nearby (a low, 150 kilometers off), and the CURRENT READING already agreeing with both (already cloudy). All three point the same way, toward more clouds and a real chance of rain over the next day or two.`,
        `WRONG: "Both cities will have similar weather soon, because they are both on the same map." CORRECT: "Riverdale and Sunview are on two different tracks, because their pressure trends and their nearby systems point in opposite directions." Being on the same map does not mean being under the same conditions.`,
        `Now change one thing, to check the reasoning still holds. If Riverdale's pressure were rising instead of falling, even with that same labeled low still sitting 150 kilometers north, the rising trend would suggest the low is weakening or moving away rather than closing in, and clearer weather would be the better forecast instead.`,
      ],
      example: { problem: `A weather map shows a low-pressure center, labeled L, about 150 kilometers north of Riverdale, with no front drawn anywhere near either city on the map. Riverdale's own station reports: pressure falling, wind from the east, cloudy skies, and a temperature of 20 degrees Celsius. A second city, Sunview, is far from the L and from any front shown on the map; its station reports: pressure rising, wind from the northwest, clear skies, and a temperature of 16 degrees Celsius. Describe what is likely happening at each city, and how their next day or two is likely to differ.`, solution: `Riverdale is likely sliding toward more clouds and a real chance of rain over the next day or two, because its pressure is falling and a low-pressure center sits nearby. Sunview is likely to stay clear or even become clearer and drier, because its pressure is rising and no system sits anywhere near it.` },
      relatedLoIds: ['m6sci.reading-weather-maps'],
    },
  ],
  pointers: [
    { content: `Students often say "A front is a storm." — A front is a boundary between two air masses, not a storm. A cold front usually causes a brief period of heavier rain or thunderstorms right as it passes, and a warm front usually causes a longer period of lighter, steadier rain -- the front is the cause and the boundary; the storm, if there is one, is what that boundary produces as it moves through.`, kind: 'common-error' },
    { content: `Students often say "Pressure only starts falling once a storm has already begun." — Falling pressure is a leading clue that a low-pressure system or a front is approaching, and it often begins well before any rain starts falling. A falling reading means pay attention to what is coming; it does not mean a storm is already there.`, kind: 'common-error' },
    { content: `A weather map's front lines, pressure-center labels, and station readings are given here as words -- the skill is reading what they IMPLY, not naming what a picture is called.`, kind: 'tip' },
    { content: `Falling pressure usually means a low is approaching and clouds or rain are becoming more likely soon; rising pressure usually means a high is approaching and skies should clear and stay drier.`, kind: 'tip' },
    { content: `A front is a boundary between two air masses, not a storm. A cold front usually brings a brief, heavier burst of rain or storms and then cooler, clearer air; a warm front usually brings a longer, lighter, steadier rain and then milder air.`, kind: 'tip' },
    { content: `A pressure center's type matters: a low is usually linked to clouds and a rising chance of rain; a high is usually linked to clear, drier weather.`, kind: 'tip' },
    { content: `Direction determines relevance. A front or a low is only useful to a city's forecast if it is moving toward that city -- the same system moving away, or sitting far off with no connection to that city's own trend, tells you almost nothing about what is coming there.`, kind: 'tip' },
    { content: `Combine several kinds of evidence -- a station's own trend, a system's type, its direction of travel, and, where available, an already-realized example elsewhere on the map -- into one forecast for one specific city over a stated stretch of time.`, kind: 'tip' },
    { content: `A front is NOT a storm—it's the boundary where two air masses meet. The storm (rain, thunder) is what the front PRODUCES as it passes through. Don't say "a front hit us"; say "rain arrived because a cold front passed through."`, kind: 'vocab-note' },
    { content: `Falling pressure is a WARNING SIGN, not proof a storm is already happening. It means a low-pressure system or front is probably approaching—but rain may not start for hours or even a day. Always pair pressure trend with distance and direction of the nearest system.`, kind: 'common-error' },
    { content: `Direction is everything. A front or low moving AWAY from your city tells you almost nothing about your forecast—even if it's on the same map. Only systems moving TOWARD your city matter. Always check: is it heading here, or heading away?`, kind: 'gotcha' },
    { content: `Cold fronts bring a BRIEF burst of heavy rain or storms, then cooler and clearer air. Warm fronts bring a LONGER, lighter, steadier rain, then milder air. These two patterns are opposites—don't mix them up when predicting what comes after each type.`, kind: 'vocab-note' },
    { content: `A high-pressure center usually means clear and drier weather is on the way; a low-pressure center usually means clouds and a chance of rain are on the way. The label itself (H or L) tells you the weather tendency—don't ignore it.`, kind: 'tip' },
    { content: `Always make a forecast for ONE city over a SPECIFIC time span (e.g., 'Cedar City over the next day'), not for the whole map or forever. Use that one city's station reading, the nearest system heading toward it, and its direction of travel. Everything else is background noise.`, kind: 'tip' },
    { content: `Don't confuse 'no front or pressure center shown on the map yet' with 'nothing is coming.' Falling pressure at a station is itself a clue that a low or front is probably approaching, even if it hasn't appeared on the map drawing yet.`, kind: 'edge-case' },
    { content: `Use already-realized weather at a station BEHIND a front (like Millridge behind the cold front) as a sneak peek at what the city AHEAD of the front will experience once the front arrives. Same front, same sequence—different timing.`, kind: 'tip' },
  ],
};
