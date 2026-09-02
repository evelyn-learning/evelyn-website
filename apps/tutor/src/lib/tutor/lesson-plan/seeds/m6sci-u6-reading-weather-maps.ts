/**
 * Grade 6 Science (Earth & Space Science) — Weather & the Atmosphere:
 * Reading Weather Maps.
 *
 * PROCEDURE-LED (NGSS MS-ESS2-5). One routine runs the whole lesson: gather
 * every reading that applies to a specific city (its own station, plus the
 * nearest front or pressure center and that system's stated direction of
 * travel), read the pressure trend, match the front or center's type to what
 * it usually produces, then combine all of it into one forecast statement for
 * that city over a stated stretch of time. The trap the routine is built to
 * kill is treating a front or a labeled pressure center as relevant just
 * because it appears somewhere on the map, when what actually determines
 * relevance is whether that system is moving toward the city in question.
 *
 * SCOPE GUARD: this plan reads a weather map's fronts, pressure centers, and
 * station readings to describe current conditions and predict short-term
 * local change for one named city over a stated stretch of time (a day, or a
 * day or two) -- never a climate trend, and never a city with no stated
 * connection to any reading in the item.
 *   - THERE IS NO IMAGE, FIGURE, OR DRAWN SYMBOL ANYWHERE IN THIS FILE. Every
 *     front is described as a line with a stated position and a stated
 *     direction of travel; every pressure center is a labeled point at a
 *     stated distance and direction from a city; every station reading is a
 *     stated list of temperature, wind direction, and pressure trend. No item
 *     ever asks what a drawn symbol is called -- the skill this lesson builds
 *     is reading what those stated readings IMPLY, never naming a picture.
 *   - ROW 6.2 (air masses and fronts) owns WHY a cold or warm front produces
 *     the weather it does, reasoned from where each air mass formed and what
 *     temperature and moisture it carries from that origin. This lesson takes
 *     the front-type-to-weather-type relationship as background knowledge
 *     already taught there and only ever APPLIES it while reading a map's
 *     stated readings; it never explains how an air mass gets its temperature
 *     or moisture, and the word "air mass" appears here only in that applied,
 *     already-known sense.
 *   - ROW 6.1 (layers and composition of the atmosphere) owns the troposphere,
 *     stratosphere and the atmosphere's gas percentages. None of that appears
 *     here; a weather map in this lesson never reports an altitude layer or a
 *     gas composition.
 *   - ROW 6.4 (how air-mass interactions produce severe weather) owns
 *     thunderstorms, tornadoes and hurricanes as phenomena explained in their
 *     own right. This lesson uses the plain word "thunderstorms" only as the
 *     general, already-known description of what a cold front's passage can
 *     bring -- the same description row 6.2 relies on -- and never explains
 *     how or why a thunderstorm, tornado or hurricane forms.
 *   - No wind-circulation direction around a pressure center (clockwise or
 *     counterclockwise) is taught anywhere in this file. A low is described
 *     only as usually linked to clouds and a rising chance of precipitation,
 *     and a high only as usually linked to clear, drier weather, with no
 *     physical mechanism attached to either.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. A weather map, station readings, air
 *     masses, fronts and pressure centers carry no biosphere, organism or
 *     ecological content of any kind.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: temperature, wind and pressure are
 *     treated only as reported quantities read off a map. This file contains
 *     no particle-level account of air pressure, no heat-transfer mechanism,
 *     no energy calculation, and no force or motion calculation anywhere.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every map
 * feature in this file -- every front, every pressure center, every station
 * reading -- is written out in words precisely enough to reason from, and
 * every item is solvable entirely from the text printed inside it. Never
 * write "the map shown" or "the symbol above," and never assume the student
 * has seen a real weather map's line-and-symbol conventions.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U6_READING_WEATHER_MAPS: LessonPlan = {
  id: 'evelyn.ms.m6sci.reading-weather-maps.v1',
  title: 'Reading Weather Maps',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.reading-weather-maps',
      standard: 'M6SCI-6.3',
      description:
        "Interpret a weather map's fronts, pressure centers, and symbols to describe current conditions and predict short-term local weather changes (NGSS MS-ESS2-5; shares this standard with the rest of Unit 6 as a coarse split by pedagogical stage).",
    },
  ],
  prerequisites: ['m6sci.air-masses-and-fronts'],
  followUps: ['m6sci.how-air-mass-interactions-produce-severe-weather'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe the weather map as a set of readable clues rather than a picture to wait on.',
      script:
        'You have probably seen a forecaster on the news point at a big map covered in curvy lines, letters, and clusters of little numbers. Most people watching just wait for the forecaster to say the important part out loud. But almost everything the forecaster says is already sitting right there on the map, once you know how to read it -- which way a line is moving, what a rising or falling number means, and which readings actually belong to your own town instead of some other one on the far side of the map. Today you learn to read the clues yourself, without waiting for someone else to say them for you.',
      suggestedTools: ['show_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-the-map',
      kind: 'concept',
      goal: 'Install the reading routine and the direction-matters trap before they are met in an item.',
      keyIdeas: [
        'WHAT THIS LESSON\'S MAP GIVES YOU. A real weather map draws a front as a special line, a pressure center as a circled H or L, and a station as a small cluster of symbols. Every one of those pictures is given to you in this lesson as words instead: a stated position for a front and which way it is moving, a stated label for a pressure center and where it sits, and a listed set of readings for each station -- temperature, wind direction, and whether pressure is rising, falling, or steady. The skill in this lesson is working out what those listed readings mean for what happens next, not naming what a picture is called.',
        'PRESSURE TREND IS A LEADING CLUE, NOT AN INSTANT VERDICT. Falling pressure at a station usually means a low-pressure system is on its way, so clouds and a chance of precipitation usually increase over the following day. Rising pressure usually means a high-pressure system is on its way, so skies usually clear and stay drier. Steady pressure usually means little change is coming soon. None of this says exactly WHEN the change will arrive by itself -- for that you also need a front or pressure center\'s stated position and direction of travel.',
        'A FRONT IS A BOUNDARY, NOT A STORM, AND ITS TYPE DETERMINES WHAT ARRIVES. A front marks where two air masses meet, and the map states which way it is moving. A cold front usually brings a brief period of heavier rain or thunderstorms right as it passes, with wind shifting from a southerly direction toward a northwesterly one, and then cooler, clearer air behind it. A warm front usually brings a longer period of lighter, steadier rain, and then milder air behind it. Neither type is the storm itself -- the front is the boundary, and the weather it produces is what happens as that boundary moves through.',
        'THE ROUTINE: find every reading that applies to your city, note the trend, match the type, then combine. Step one, find the city\'s own station reading and the nearest front or pressure center, plus its stated distance and direction of travel. Step two, note whether pressure is rising, falling, or steady at that station. Step three, if a front or pressure center is approaching, match its type (cold front, warm front, low, high) to what that type usually produces. Step four, put it together into one forecast statement for that specific city over a stated stretch of time -- not for the whole map, and not forever.',
        'THE TRAP: DIRECTION MATTERS AS MUCH AS EXISTENCE. A front already moving AWAY from a city, or a pressure center sitting far off with no connection to that city\'s own trend, tells you almost nothing about that city\'s next day. A front drawn somewhere on the map is only useful to a city\'s forecast if it is heading toward that city; the very same front moving the other way is someone else\'s forecast, not this city\'s.',
      ],
      vocabulary: [
        { term: 'weather map', definition: 'a map that shows current weather readings from many stations at once, along with the position of fronts and pressure centers.' },
        { term: 'station reading', definition: 'the set of weather details reported at one location on a map: temperature, wind direction, and whether pressure is rising, falling, or steady.' },
        { term: 'pressure trend', definition: 'whether a location\'s air pressure is rising, falling, or holding steady, which by itself hints at what kind of system is approaching.' },
        { term: 'front', definition: 'the boundary where two air masses of different temperature and moisture meet, drawn on a map as a line with a stated direction of travel.' },
        { term: 'cold front', definition: 'a front where cold air is replacing warm air, usually producing a brief period of heavier rain or storms, then cooler, clearer weather.' },
        { term: 'warm front', definition: 'a front where warm air is replacing cold air, usually producing a longer period of lighter, steadier rain, then milder weather.' },
        { term: 'pressure center', definition: 'a location labeled high or low on a map where pressure is at a local extreme; a low is usually linked to clouds and a chance of precipitation, and a high is usually linked to clear, drier weather.' },
      ],
      suggestedTools: ['show_table', 'show_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cold-front-approaching',
      kind: 'worked_example',
      problem:
        'A weather map shows two things relevant to Cedar City. First, Cedar City\'s own station reports: pressure falling steadily, wind blowing from the south, temperature 24 degrees Celsius, and skies partly cloudy. Second, a cold front is drawn as a line running north to south about 200 kilometers west of Cedar City, and the front is moving east, toward Cedar City. A second station, in Millridge, sits about 100 kilometers west of that same cold front -- meaning the front has already passed Millridge -- and reports: pressure steady, wind blowing from the northwest, temperature 14 degrees Celsius, and clear skies. Describe what is happening at Cedar City right now, and what is likely to happen there over the next day.',
      steps: [
        'Step 1, gather every reading that applies to Cedar City. That means Cedar City\'s own station (falling pressure, south wind, 24 degrees, partly cloudy) plus the nearest system that could reach it: the cold front, currently 200 kilometers west and moving east, straight toward the city.',
        'Step 2, read the pressure trend. Falling pressure at Cedar City means a system is approaching and clouds or precipitation are becoming more likely soon -- consistent with the front closing in from the west.',
        'Step 3, match the front\'s type to what it usually produces. A cold front usually brings a brief period of heavier rain or thunderstorms right as it passes, with wind shifting from a southerly direction toward a northwesterly one, and then cooler, clearer air behind it.',
        'Step 4, use Millridge as a second, different kind of clue: it sits behind that same front, further along in the very sequence Cedar City is about to go through. Millridge\'s steady pressure, northwest wind, cooler 14-degree temperature, and clear skies are what "after the front" looks like, and they match what step 3 predicts should eventually arrive at Cedar City too.',
        'Put the three kinds of evidence together: the pressure TREND at Cedar City (falling, so change is coming), the front\'s stated TYPE and DIRECTION (cold, moving east, straight toward the city), and Millridge\'s ALREADY-REALIZED example of what comes after a cold front passes. Three different kinds of clue, all agreeing on the same forecast.',
        'WRONG: "Cedar City is fine because there is no front sitting on top of it right now." CORRECT: "Cedar City is not fine for long, because the front is moving toward it and the city\'s own pressure is already falling." A front\'s current position matters less than where it is headed.',
        'Now change one thing, to be sure direction is doing the work it should. If that same cold front were instead moving west, away from Cedar City, the city\'s falling pressure would still deserve attention, but it would not be explained by this particular front -- the front would be heading toward Millridge\'s side of the map instead, and Cedar City\'s forecast would need a different cause than the one in this problem.',
      ],
      answer:
        'Right now, Cedar City sits ahead of an approaching cold front, in milder, more humid air, with pressure already falling. Over the next day, expect a brief period of heavier rain or thunderstorms as the front arrives, with wind shifting from south toward northwest, followed by cooler, clearer weather similar to what Millridge is already reporting behind the same front.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-low-versus-high',
      kind: 'worked_example',
      problem:
        'A weather map shows a low-pressure center, labeled L, about 150 kilometers north of Riverdale, with no front drawn anywhere near either city on the map. Riverdale\'s own station reports: pressure falling, wind from the east, cloudy skies, and a temperature of 20 degrees Celsius. A second city, Sunview, is far from the L and from any front shown on the map; its station reports: pressure rising, wind from the northwest, clear skies, and a temperature of 16 degrees Celsius. Describe what is likely happening at each city, and how their next day or two is likely to differ.',
      steps: [
        'Step 1, gather the readings for each city separately. Riverdale: falling pressure, cloudy, 20 degrees, and a low-pressure center labeled 150 kilometers to its north. Sunview: rising pressure, clear, 16 degrees, and no nearby system at all.',
        'Step 2, read each pressure trend on its own. Riverdale\'s falling pressure means conditions are likely to become more unsettled, not less. Sunview\'s rising pressure means conditions are likely to stay fair or become clearer still.',
        'Step 3, match the pressure center to what it usually produces. A low-pressure center is usually linked to cloudy skies and a rising chance of precipitation, which matches Riverdale\'s own cloudy reading and its nearby labeled L. There is no pressure center anywhere near Sunview, so nothing on the map points Sunview toward that same outcome.',
        'Step 4, combine three different kinds of evidence for Riverdale: the pressure TREND (falling), the LABELED SYSTEM nearby (a low, 150 kilometers off), and the CURRENT READING already agreeing with both (already cloudy). All three point the same way, toward more clouds and a real chance of rain over the next day or two.',
        'WRONG: "Both cities will have similar weather soon, because they are both on the same map." CORRECT: "Riverdale and Sunview are on two different tracks, because their pressure trends and their nearby systems point in opposite directions." Being on the same map does not mean being under the same conditions.',
        'Now change one thing, to check the reasoning still holds. If Riverdale\'s pressure were rising instead of falling, even with that same labeled low still sitting 150 kilometers north, the rising trend would suggest the low is weakening or moving away rather than closing in, and clearer weather would be the better forecast instead.',
      ],
      answer:
        'Riverdale is likely sliding toward more clouds and a real chance of rain over the next day or two, because its pressure is falling and a low-pressure center sits nearby. Sunview is likely to stay clear or even become clearer and drier, because its pressure is rising and no system sits anywhere near it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pressure-trend',
      kind: 'try_yourself',
      problem:
        'A weather station in Pine Grove reports: pressure falling steadily over the past several hours, wind blowing from the southwest, and skies going from clear to increasingly cloudy. No front or pressure center is drawn anywhere near Pine Grove on the map yet. What does this reading most likely mean for Pine Grove over the next day?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing unusual is likely at Pine Grove, because a real change in the weather only becomes likely once a front or a pressure center has actually been drawn close enough to that station to show up on the map.' },
        { id: 'b', text: 'A low-pressure system is probably approaching Pine Grove, so clouds are likely to thicken and a chance of rain is likely to increase over the next day, even before any front or center appears nearby on the map.', correct: true },
        { id: 'c', text: 'A high-pressure system is probably approaching Pine Grove, so the falling pressure actually signals that drier air is on its way and that skies there should clear and stay dry over the next day.' },
        { id: 'd', text: 'Pine Grove must already be in the middle of a storm right now, because pressure only starts falling once a storm has already begun and is actively happening at that very station.' },
      ],
      expectedAnswer:
        'A low-pressure system is probably approaching Pine Grove, so clouds are likely to thicken and a chance of rain is likely to increase over the next day, even before any front or center appears nearby on the map.',
      hints: [
        'A pressure TREND is its own clue, and it can show up before a front or a labeled center is close enough to be drawn on the map yet. Do not wait for a symbol to appear before trusting what the trend already tells you.',
        'Match the direction of the trend to the right kind of system: does pressure usually fall as a low approaches, or as a high approaches? Check which kind of system goes with clouds and rain increasing, not clearing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-front-type',
      kind: 'try_yourself',
      problem:
        'A cold front is drawn on a weather map as a line running north to south, currently about 100 kilometers west of Millbrook, and it is moving east, toward Millbrook. Millbrook\'s own station currently reports mild temperatures, wind from the south, and only a few scattered clouds. Which of these best describes what Millbrook is likely to experience as this front arrives?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A long period of light, steady rain lasting most of a day, followed by warmer temperatures, since that is what a front moving toward a city usually produces.' },
        { id: 'b', text: 'Almost no change at all, because Millbrook\'s own station currently shows nothing unusual happening right there.' },
        { id: 'c', text: 'A relatively brief period of heavier rain or thunderstorms, with the wind shifting toward the northwest, followed by cooler and clearer weather.', correct: true },
        { id: 'd', text: 'Millbrook will stay dry, but temperatures will rise sharply as the front passes, because a front\'s arrival always warms up the air behind it.' },
      ],
      expectedAnswer:
        'A relatively brief period of heavier rain or thunderstorms, with the wind shifting toward the northwest, followed by cooler and clearer weather.',
      hints: [
        'Millbrook\'s own current reading describes conditions right now, before the front arrives -- it does not describe what is coming. Match the TYPE of front to what that type usually produces once it does arrive.',
        'Cold and warm fronts do not produce the same kind of change. One brings a shorter, heavier burst of weather with a wind shift; the other brings a longer, lighter, steadier one. Decide which type this front is before choosing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-direction-matters',
      kind: 'try_yourself',
      problem:
        'A warm front is drawn on a weather map as a line running east to west, currently just south of Lakeside, and it is moving north, away from a second city, Farport, which sits well south of the front. Lakeside\'s own station currently reports pressure falling slowly, wind from the southeast, and a thin layer of high clouds. Farport\'s own station currently reports pressure steady, wind from the south, clear skies, and a warmer temperature than Lakeside\'s. Which statement best compares what is likely coming for each city over the next day?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both cities will soon get the same brief, heavy rain, since they are both fairly close to the same front and a single front is assumed to bring identical weather to every nearby city, no matter which side it sits on.' },
        { id: 'b', text: 'Farport will soon get a longer period of light rain followed by warmer air, while Lakeside, already on the warm side of the front, will stay mild and generally clear, since the closer city to the drawn line is the one about to feel it.' },
        { id: 'c', text: 'Neither city will be affected, because the front\'s line sits south of Lakeside rather than directly over either city right now, and a front only matters once it is drawn right on top of a station.' },
        { id: 'd', text: 'Lakeside will likely get a longer period of lighter rain as the front moves in and then warm up afterward, while Farport, already well inside the warmer air behind the front, is likely to stay mild and settled a while longer.', correct: true },
      ],
      expectedAnswer:
        'Lakeside will likely get a longer period of lighter rain as the front moves in and then warm up afterward, while Farport, already well inside the warmer air behind the front, is likely to stay mild and settled a while longer.',
      hints: [
        'The front is moving north, toward Lakeside and away from Farport. Whichever city the front is heading toward is the one about to feel its passage; the city it is leaving behind is already on the other side of that boundary.',
        'This front is a warm front, not a cold one -- match the type to the longer, lighter kind of change it produces, and remember that the front\'s current position matters less than the direction it is moving.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-front-is-a-storm',
      kind: 'misconception_check',
      question:
        'A student looks at a weather map, sees a cold front drawn near their town, and says: "A front is a storm, and pressure only starts falling once a storm has already begun." Two separate ideas are tangled together here. What is wrong with each one, and what is actually true?',
      commonErrors: [
        {
          answer: 'A front is a storm.',
          misconception:
            'Treating the front itself -- the boundary between two air masses -- as if it were the weather event it produces, because on a map they are drawn in the same place.',
          correctsTo:
            'A front is a boundary between two air masses, not a storm. A cold front usually causes a brief period of heavier rain or thunderstorms right as it passes, and a warm front usually causes a longer period of lighter, steadier rain -- the front is the cause and the boundary; the storm, if there is one, is what that boundary produces as it moves through.',
        },
        {
          answer: 'Pressure only starts falling once a storm has already begun.',
          misconception:
            'Treating a pressure trend as proof that a storm is already underway, rather than as an early clue about what is approaching, because both ideas involve worsening weather and feel like the same thing.',
          correctsTo:
            'Falling pressure is a leading clue that a low-pressure system or a front is approaching, and it often begins well before any rain starts falling. A falling reading means pay attention to what is coming; it does not mean a storm is already there.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A weather map\'s front lines, pressure-center labels, and station readings are given here as words -- the skill is reading what they IMPLY, not naming what a picture is called.',
        'Falling pressure usually means a low is approaching and clouds or rain are becoming more likely soon; rising pressure usually means a high is approaching and skies should clear and stay drier.',
        'A front is a boundary between two air masses, not a storm. A cold front usually brings a brief, heavier burst of rain or storms and then cooler, clearer air; a warm front usually brings a longer, lighter, steadier rain and then milder air.',
        'A pressure center\'s type matters: a low is usually linked to clouds and a rising chance of rain; a high is usually linked to clear, drier weather.',
        'Direction determines relevance. A front or a low is only useful to a city\'s forecast if it is moving toward that city -- the same system moving away, or sitting far off with no connection to that city\'s own trend, tells you almost nothing about what is coming there.',
        'Combine several kinds of evidence -- a station\'s own trend, a system\'s type, its direction of travel, and, where available, an already-realized example elsewhere on the map -- into one forecast for one specific city over a stated stretch of time.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Reading Weather Maps' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
