/**
 * Grade 6 Science (Earth & Space Science) — Climate & the Ocean's Role: What
 * Determines a Region's Climate.
 *
 * CONCEPT-LED row (NGSS MS-ESS2-6) for the m6sci fan-out. The picture this
 * lesson builds is one region's climate as the COMBINATION of three factors
 * -- latitude, elevation, and distance from a large body of water -- rather
 * than any single one of them read in isolation. The lesson opens each
 * factor as its own pattern, then spends both worked examples and the
 * hardest try_yourself item forcing the student to hold two or three of
 * those factors in mind at once, because "same latitude, so same climate" is
 * the single most natural wrong shortcut at this age.
 *
 * SCOPE GUARD: this plan covers exactly the three factors named in its
 * curriculum row -- latitude, elevation, and distance from a large body of
 * water -- and how they combine to shape a region's typical temperature and
 * precipitation pattern. Boundaries, stated so a reviewer can check each one:
 *   - ROW 8.1 (weather-versus-climate, the prerequisite) owns the full
 *     weather-versus-climate distinction and its own worked examples. This
 *     plan assumes that distinction and recaps the definition of climate in
 *     one sentence in the first keyIdea; it does not re-teach or re-argue
 *     the distinction, and no "a day that could be true of one but not the
 *     other" example appears here.
 *   - ROW 8.3 (how-ocean-currents-move-heat-around-the-globe, the immediate
 *     followUp) owns ocean currents specifically. No named current (warm or
 *     cold), no current's origin, and no coastline-by-current example
 *     appears anywhere in this file. Ocean currents are named exactly once,
 *     in keyIdea 5, as a single bounding sentence stating that a current is
 *     a different influence on coastal climate covered in the next lesson --
 *     the mechanism itself is never described.
 *   - ROW 8.4 (reading-climate-graphs) owns reading a climatograph. No
 *     monthly temperature/precipitation data table and no graph-reading task
 *     appears in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: the curriculum row itself notes that
 *     this lesson covers the same climate factors as Grade 7's biome unit
 *     "from the physical-geography side, deliberately without the word
 *     'biome'." The words "biome," "habitat" and "niche," and any
 *     classification of a region by the species that live there, appear
 *     nowhere in this file.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: two of the three factors carry a
 *     mechanism this plan deliberately never writes. WHY higher elevation is
 *     typically cooler (air pressure and the behavior of expanding air) and
 *     WHY a large body of water moderates nearby temperature (its heat
 *     capacity) are both Grade 8 physical-science explanations. This file
 *     states each as a PATTERN only -- "higher elevation typically means
 *     cooler," "a large body of water moderates nearby temperature" -- and
 *     says once, in keyIdeas 3 and 4, that the explanation belongs to a
 *     later grade. The sentence never written is any version of "elevation
 *     cools the air because lower air pressure lets it expand and cool" or
 *     "water resists temperature change because it has a high heat
 *     capacity." Also never written: a rain-shadow or orographic-
 *     precipitation explanation of how a mountain range blocks moisture --
 *     that is a distinct causal mechanism beyond the three named factors,
 *     and this file ties precipitation only to distance from a large body of
 *     water, never to elevation or to mountains blocking moisture.
 *   - No precisely-specified real location is used as an example anywhere in
 *     this file. Every example region is a generic, unnamed "Region" or
 *     "Location," because a real named place would add its own checkable
 *     factual claim on top of the three this lesson is built to teach.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. No map, table
 * or diagram is attached to this file; the whiteboard tool hints below are
 * suggestions to the live tutor only. Every location described in this file
 * is described fully in words, and every item is answerable from the text
 * printed inside it. Never write "see the map above."
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U8_WHAT_DETERMINES_A_REGIONS_CLIMATE: LessonPlan = {
  id: 'evelyn.ms.m6sci.what-determines-a-regions-climate.v1',
  title: 'What Determines a Region\'s Climate',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.what-determines-a-regions-climate',
      standard: 'M6SCI-8.2',
      description:
        'Explain how latitude, elevation, and distance from a large body of water combine to determine a region\'s typical temperature and precipitation pattern, without naming or classifying biomes -- biome classification by resident species is Grade 7 life science (NGSS MS-ESS2-6).',
    },
  ],
  prerequisites: ['m6sci.weather-versus-climate'],
  followUps: ['m6sci.how-ocean-currents-move-heat-around-the-globe'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from a situation an eleven- or twelve-year-old can picture, where a single number (distance from the equator) fails to predict what actually happens.',
      script:
        'Your cousin moves from a beach town to a small town high up in the mountains. The two towns sit at almost exactly the same distance from the equator. She packs like she is heading somewhere similar. She is wrong twice. The mountain town gets cold enough for real snow in the winter, something the beach town never sees. And even in summer, a warm afternoon there can turn into a genuinely cold night, a much bigger swing than she is used to. Same distance from the equator. Completely different climate. So distance from the equator cannot be the whole story -- something else is doing real work here. Today we find out what that something else is, and by the end you will be able to look at a description of a place and predict, roughly, what its typical weather pattern looks like.',
      suggestedTools: ['show_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-climate-factors',
      kind: 'concept',
      goal: 'Build the three factors -- latitude, elevation, distance from a large body of water -- as patterns that combine, without explaining the Grade 8 mechanism behind any of them.',
      keyIdeas: [
        'CLIMATE COMES FROM MORE THAN ONE THING AT ONCE. Climate is a region\'s typical weather pattern, averaged over many years -- not what the weather happens to be doing this week or this month; the previous lesson covers that distinction in full. This lesson looks at three factors that combine to explain why one region\'s typical temperature and precipitation pattern differs from another\'s: latitude, elevation, and distance from a large body of water.',
        'LATITUDE CHANGES THE ANGLE OF SUNLIGHT, NOT THE DISTANCE TO IT. Close to the equator, the sun sits high overhead for most of the year, so sunlight arrives close to straight down and lands concentrated on a small area of ground. Close to the poles, sunlight arrives at a low, slanting angle, so the same amount of sunlight is spread out over a much larger area of ground and each part of that ground receives less energy. Because of this, regions near the equator typically stay warm all year with only a small difference between their warmest and coldest months, while regions near the poles are typically colder and swing more between summer and winter. The distance from the equator to the poles, measured across Earth\'s own surface, is only a few thousand kilometers -- far too small to matter next to the enormous distance from Earth to the sun. What changes with latitude is the ANGLE sunlight arrives at, not the distance it has to travel.',
        'ELEVATION: HIGHER UP IS TYPICALLY COOLER. A location that sits at high elevation -- far above sea level, such as up in the mountains -- typically has cooler typical temperatures than a nearby location at low elevation, even when both sit at the same latitude. A mountain town can have snow on the ground while a valley town not far away, at the same latitude, has none. This lesson states that pattern without explaining why elevation cools the air; the physics behind it belongs to a later grade.',
        'DISTANCE FROM A LARGE BODY OF WATER: SMALLER OR BIGGER SWINGS. A large body of water -- an ocean or a large lake -- changes temperature more slowly than land does. A location right next to a large body of water typically has its temperature MODERATED: smaller swings between day and night, and smaller swings between summer and winter, than a location far inland at the same latitude. A location deep in the interior of a continent, far from any large body of water, typically has more extreme swings -- hotter summers and colder winters. This lesson states that pattern too without explaining why water moderates temperature; that explanation also belongs to a later grade.',
        'DISTANCE FROM WATER ALSO SHAPES PRECIPITATION. A large body of water is a nearby source of moisture. Regions near a large body of water generally have more of that moisture available nearby and tend to receive more precipitation. Regions deep in the interior of a continent, far from any large body of water, generally have less moisture available nearby and tend to be drier. A fourth influence on a coastline\'s climate -- an ocean current carrying warm or cold water along that coast -- is not one of the three factors this lesson covers; that mechanism is the subject of the next lesson.',
        'THE THREE FACTORS COMBINE -- NO SINGLE ONE DECIDES ALONE. A region\'s typical climate comes from putting latitude, elevation, and distance from a large body of water together, not from checking just one of them. Two regions can sit at the exact same latitude and still end up with very different typical climates if their elevation or their distance from a large body of water is different. Before predicting a region\'s typical temperature and precipitation pattern, check all three factors.',
      ],
      vocabulary: [
        { term: 'latitude', definition: 'how far north or south of the equator a location sits.' },
        { term: 'elevation', definition: 'how high a location sits above sea level.' },
        { term: 'precipitation', definition: 'water that falls from the atmosphere to Earth\'s surface, such as rain, snow, sleet or hail.' },
        { term: 'moderate', definition: 'to keep a location\'s temperature from swinging as far toward hot or cold extremes as it otherwise would.' },
      ],
      suggestedTools: ['show_map', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-combining-factors-coastal-region',
      kind: 'worked_example',
      problem:
        'Region A sits close to the equator, at low elevation, right on the coast of a large ocean. Describe its typical temperature pattern and its typical precipitation pattern.',
      steps: [
        'Apply the latitude factor first. Region A is close to the equator, so sunlight arrives close to straight down for most of the year. That means strong, concentrated heating and a typically warm climate with only a small difference between the warmest and coldest months.',
        'Apply the elevation factor next. Region A sits at low elevation, so elevation is not pulling the temperature down the way it would in the mountains. There is nothing here to cool the region below what its latitude already predicts.',
        'Apply the distance-from-water factor last. Region A is right on the coast of a large ocean, so its temperature is moderated -- smaller day-to-night and summer-to-winter swings than an inland location at the same latitude would have -- and the nearby ocean is a source of moisture, so Region A likely receives fairly high precipitation.',
        'Combine the three. Warm year-round, a small temperature swing between seasons, and fairly high precipitation.',
        'Check the answer with three clues of a different kind. First, the latitude reasoning: concentrated, close-to-overhead sunlight means strong, steady heating. Second, the water reasoning: a large ocean right at the coast moderates swings and supplies moisture. Third, an outside check: regions around the world that share this exact combination -- close to the equator, low elevation, right on a coast -- are consistently described as warm year-round with plentiful rainfall, which is exactly the pattern the first two clues predicted on their own.',
        'Now change one condition and check that the answer moves with it. Move this same region far inland, keeping its latitude and elevation exactly the same. It would still get the same strong, direct sunlight, so it would still be warm -- but without an ocean nearby to moderate it or supply moisture, expect a bigger swing between its hottest and coldest times of year, and less precipitation than before. The prediction changed because the evidence changed, which is what shows the reasoning is doing real work.',
      ],
      answer:
        'Region A would typically be warm all year with only a small swing between its warmest and coldest months, and it would typically receive fairly high precipitation, because its low latitude gives it strong, concentrated sunlight and its coastal location moderates its temperature and supplies nearby moisture.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-latitude-different-elevation-and-water',
      kind: 'worked_example',
      problem:
        'Region B and Region C sit at the exact same latitude. Region B sits at low elevation, right next to a large lake. Region C sits high up in the mountains, far from any large body of water. Compare their typical climates.',
      steps: [
        'Start with what is given as equal: latitude. Region B and Region C receive the same angle of sunlight over the course of a year.',
        'WRONG: "Since they share the same latitude, Region B and Region C must have similar climates." CORRECT: "Sharing a latitude only means the LATITUDE factor is equal between them. Elevation and distance from water still have to be checked separately, and here both of those are very different."',
        'Apply the elevation factor. Region C sits high up in the mountains; Region B sits at low elevation. Higher elevation typically means cooler typical temperatures, so Region C would typically be cooler than Region B for this reason alone.',
        'Apply the distance-from-water factor. Region B sits right next to a large lake, so its temperature is moderated and it has a nearby source of moisture. Region C is far from any large body of water, so it typically has bigger swings between its hottest and coldest times of year, and typically receives less precipitation.',
        'Combine the two differing factors. Both point the same direction: Region C would typically be colder, would swing more between seasons, and would typically be drier than Region B, even though the two regions share a latitude.',
        'Check the answer with three clues of a different kind. First, the elevation rule: higher up is typically cooler. Second, the water rule: farther from a large body of water typically means bigger swings and less precipitation. Third, an everyday pattern many people have heard of: a mountain town often gets much colder, snowier winters than a nearby lowland town at a similar latitude, which matches this same reasoning.',
        'Now change one condition and check that the answer moves with it. Swap which region has which trait, keeping the shared latitude the same: if Region C were instead the low-elevation one next to the large lake, and Region B were instead the high-elevation one far from water, the colder, more variable, drier prediction would now follow Region B instead of Region C. The prediction tracks elevation and distance from water, not something fixed about either region\'s name.',
      ],
      answer:
        'Even though Region B and Region C share the same latitude, Region C would typically be colder, would swing more between its hottest and coldest times of year, and would typically be drier than Region B, because Region C sits at a much higher elevation and far from any large body of water, while Region B sits at low elevation right next to a large lake.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-latitude-and-angle',
      kind: 'try_yourself',
      problem:
        'Location A and Location B sit at the same elevation and are both located right on the coast of the same large ocean -- so elevation and distance from water are the same for both. Location A is much closer to the equator than Location B. Which factor still differs between them, and what typical difference in climate would you expect?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Elevation is still the difference here -- Location B must actually sit at a different elevation than Location A, and that difference is what would explain any temperature difference between them.',
        },
        {
          id: 'b',
          text: 'Nothing would differ between them, since both are coastal at the same elevation, and being near the ocean is what mainly decides a location\'s typical temperature and precipitation pattern.',
        },
        {
          id: 'c',
          text: 'Latitude is still the difference -- Location A, closer to the equator, receives more direct, concentrated sunlight throughout the year and would typically be warmer than Location B, with a smaller difference between its warmest and coldest months.',
          correct: true,
        },
        {
          id: 'd',
          text: 'Latitude is still the difference -- Location A, closer to the equator, would typically be warmer than Location B because being closer to the equator puts it physically closer to the sun, and that shorter distance lets more of the sun\'s energy reach the surface.',
        },
      ],
      expectedAnswer:
        'Latitude is still the difference -- Location A, closer to the equator, receives more direct, concentrated sunlight throughout the year and would typically be warmer than Location B, with a smaller difference between its warmest and coldest months.',
      hints: [
        'Start with what the problem tells you is exactly equal for both locations -- elevation and distance from water. That should tell you the remaining difference has to come from somewhere else.',
        'Think about what changes about the sun\'s ANGLE, not the sun\'s DISTANCE, as you move from near the equator toward the poles.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-elevation-pattern',
      kind: 'try_yourself',
      problem:
        'Location C and Location D sit at the same latitude and are both far from any large body of water. Location C sits in a low valley at sea level. Location D sits high up in the mountains. Which location would typically have cooler temperatures, and why?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Location C, because "sea level" means Location C sits right at the edge of the ocean, and it is the nearby water -- not the elevation -- that would keep Location C cooler than Location D.',
        },
        {
          id: 'b',
          text: 'Neither location would typically be much cooler than the other, since the sun strikes both locations at the same angle at this shared latitude, and elevation does not change how warm or cool a place typically is.',
        },
        {
          id: 'c',
          text: 'Location D, because higher elevation typically means warmer typical temperatures, and Location D sits much higher up than Location C.',
        },
        {
          id: 'd',
          text: 'Location D, because higher elevation typically means cooler typical temperatures, even when latitude and distance from water are the same for both places.',
          correct: true,
        },
      ],
      expectedAnswer:
        'Location D, because higher elevation typically means cooler typical temperatures, even when latitude and distance from water are the same for both places.',
      hints: [
        'Underline what the problem says is the same for both locations, and what is different. The different part is which factor is doing the work here.',
        '"Sea level" describes how high up a place sits, not how close it is to open water. Re-read what the problem already told you about distance from water for both locations.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-combining-three-factors',
      kind: 'try_yourself',
      problem:
        'Region E sits at a high mountain elevation, close to the equator, right on the coast of a large ocean. Region F sits at low elevation, at the same low latitude as Region E, but far inland, hundreds of kilometers from any large body of water. Based on the three factors from this lesson, which statement best compares their typical climates?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Region F would typically have bigger swings between its hottest and coldest times of year and would typically be drier than Region E, because Region F lacks a nearby large body of water to moderate its temperature and add moisture to the air, even though both regions get the same strong, direct sunlight from being close to the equator.',
          correct: true,
        },
        {
          id: 'b',
          text: 'Region E and Region F would have about the same typical climate, because both sit at the same low latitude, and latitude is the strongest of the three factors, so it overrides the other two, even though their elevation and distance from water are very different.',
        },
        {
          id: 'c',
          text: 'Region E would typically be warmer overall than Region F, because being on the coast lets the nearby ocean add extra warmth on top of the warmth Region E already gets from being close to the equator, even though Region F sits at the same low latitude and would be expected to get just as much direct sunlight.',
        },
        {
          id: 'd',
          text: 'Region F would typically be warmer overall than Region E, because higher elevation usually means warmer typical temperatures, and Region E sits much higher up than Region F, even though both regions share the same low latitude.',
        },
      ],
      expectedAnswer:
        'Region F would typically have bigger swings between its hottest and coldest times of year and would typically be drier than Region E, because Region F lacks a nearby large body of water to moderate its temperature and add moisture to the air, even though both regions get the same strong, direct sunlight from being close to the equator.',
      hints: [
        'List what is the SAME between Region E and Region F, and what is DIFFERENT, one factor at a time: latitude, elevation, distance from water.',
        'A large body of water does not simply add heat. Think about what "moderate" means for both hot and cold extremes, and about where nearby moisture would come from.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-latitude-and-distance-to-sun',
      kind: 'misconception_check',
      question:
        'A student says: "Region G and Region H are both very close to the equator, so they must have almost the same climate. Also, the reason places near the equator are warm is that the equator is closer to the sun than the poles are." Two different things are wrong with that. What are they?',
      commonErrors: [
        {
          answer: 'Region G and Region H are both very close to the equator, so they must have almost the same climate.',
          misconception:
            'Treating latitude as the only factor that decides climate, so that matching latitude alone is assumed to guarantee a matching climate.',
          correctsTo:
            'Latitude is only one of three factors this lesson covers. Two regions can share the same latitude and still have very different typical climates if their elevation or their distance from a large body of water is different -- for example, one region high in the mountains and far from water, the other at low elevation right on a coast.',
        },
        {
          answer: 'The reason places near the equator are warm is that the equator is closer to the sun than the poles are.',
          misconception:
            'Confusing latitude, a position on Earth\'s own surface, with distance from Earth to the sun.',
          correctsTo:
            'The distance from the equator to the poles, measured across Earth\'s own surface, is only a few thousand kilometers -- far too small to matter next to the enormous distance from Earth to the sun. What actually differs by latitude is the ANGLE sunlight arrives at: close to straight down and concentrated near the equator, low and spread out over a wider area near the poles. That angle, not distance, is why the equator is typically warmer.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Climate is a region\'s typical weather pattern averaged over many years. Three factors combine to shape it: latitude, elevation, and distance from a large body of water.',
        'Latitude changes the ANGLE of incoming sunlight, not the distance to the sun. Near the equator, sunlight arrives close to straight down; near the poles, it arrives at a low, slanting angle spread over a wider area.',
        'Regions near the equator are typically warm year-round with a small seasonal swing. Regions near the poles are typically colder with a bigger seasonal swing.',
        'Higher elevation typically means cooler typical temperatures than nearby lower elevation, even at the same latitude.',
        'A large body of water moderates nearby temperature -- smaller day-to-night and summer-to-winter swings -- and is a nearby source of moisture, so coastal regions generally receive more precipitation than regions far inland.',
        'No one factor decides a region\'s climate alone. Always check latitude, elevation, and distance from water together before predicting a region\'s typical temperature and precipitation pattern.',
        'Same latitude does not mean same climate. Two regions at the same latitude can have very different typical climates if their elevation or distance from water differs.',
        'Ocean currents also shape a coastline\'s climate, but that is a different mechanism, covered in the next lesson.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'What Determines a Region\'s Climate' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
