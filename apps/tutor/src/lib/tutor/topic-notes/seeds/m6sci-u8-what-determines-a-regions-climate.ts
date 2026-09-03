/**
 * Grade 6 Science — Unit 8 CED 8.2: What Determines a Region's Climate.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.what-determines-a-regions-climate.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U8_WHAT_DETERMINES_A_REGIONS_CLIMATE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.what-determines-a-regions-climate.v1',
  course: 'Grade 6 Science',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: `What Determines a Region's Climate`,
  planId: 'evelyn.ms.m6sci.what-determines-a-regions-climate.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.what-determines-a-regions-climate.v1' }],
  theory: [
    { loId: 'm6sci.what-determines-a-regions-climate', content: `CLIMATE COMES FROM MORE THAN ONE THING AT ONCE. Climate is a region's typical weather pattern, averaged over many years -- not what the weather happens to be doing this week or this month; the previous lesson covers that distinction in full. This lesson looks at three factors that combine to explain why one region's typical temperature and precipitation pattern differs from another's: latitude, elevation, and distance from a large body of water.` },
    { loId: 'm6sci.what-determines-a-regions-climate', content: `LATITUDE CHANGES THE ANGLE OF SUNLIGHT, NOT THE DISTANCE TO IT. Close to the equator, the sun sits high overhead for most of the year, so sunlight arrives close to straight down and lands concentrated on a small area of ground. Close to the poles, sunlight arrives at a low, slanting angle, so the same amount of sunlight is spread out over a much larger area of ground and each part of that ground receives less energy. Because of this, regions near the equator typically stay warm all year with only a small difference between their warmest and coldest months, while regions near the poles are typically colder and swing more between summer and winter. The distance from the equator to the poles, measured across Earth's own surface, is only a few thousand kilometers -- far too small to matter next to the enormous distance from Earth to the sun. What changes with latitude is the ANGLE sunlight arrives at, not the distance it has to travel.` },
    { loId: 'm6sci.what-determines-a-regions-climate', content: `ELEVATION: HIGHER UP IS TYPICALLY COOLER. A location that sits at high elevation -- far above sea level, such as up in the mountains -- typically has cooler typical temperatures than a nearby location at low elevation, even when both sit at the same latitude. A mountain town can have snow on the ground while a valley town not far away, at the same latitude, has none. This lesson states that pattern without explaining why elevation cools the air; the physics behind it belongs to a later grade.` },
    { loId: 'm6sci.what-determines-a-regions-climate', content: `DISTANCE FROM A LARGE BODY OF WATER: SMALLER OR BIGGER SWINGS. A large body of water -- an ocean or a large lake -- changes temperature more slowly than land does. A location right next to a large body of water typically has its temperature MODERATED: smaller swings between day and night, and smaller swings between summer and winter, than a location far inland at the same latitude. A location deep in the interior of a continent, far from any large body of water, typically has more extreme swings -- hotter summers and colder winters. This lesson states that pattern too without explaining why water moderates temperature; that explanation also belongs to a later grade.` },
    { loId: 'm6sci.what-determines-a-regions-climate', content: `DISTANCE FROM WATER ALSO SHAPES PRECIPITATION. A large body of water is a nearby source of moisture. Regions near a large body of water generally have more of that moisture available nearby and tend to receive more precipitation. Regions deep in the interior of a continent, far from any large body of water, generally have less moisture available nearby and tend to be drier. A fourth influence on a coastline's climate -- an ocean current carrying warm or cold water along that coast -- is not one of the three factors this lesson covers; that mechanism is the subject of the next lesson.` },
    { loId: 'm6sci.what-determines-a-regions-climate', content: `THE THREE FACTORS COMBINE -- NO SINGLE ONE DECIDES ALONE. A region's typical climate comes from putting latitude, elevation, and distance from a large body of water together, not from checking just one of them. Two regions can sit at the exact same latitude and still end up with very different typical climates if their elevation or their distance from a large body of water is different. Before predicting a region's typical temperature and precipitation pattern, check all three factors.` },
    { loId: 'm6sci.what-determines-a-regions-climate', kind: 'definition', title: 'latitude', content: 'how far north or south of the equator a location sits.' },
    { loId: 'm6sci.what-determines-a-regions-climate', kind: 'definition', title: 'elevation', content: 'how high a location sits above sea level.' },
    { loId: 'm6sci.what-determines-a-regions-climate', kind: 'definition', title: 'precipitation', content: `water that falls from the atmosphere to Earth's surface, such as rain, snow, sleet or hail.` },
    { loId: 'm6sci.what-determines-a-regions-climate', kind: 'definition', title: 'moderate', content: `to keep a location's temperature from swinging as far toward hot or cold extremes as it otherwise would.` },
  ],
  methods: [
    {
      title: 'Worked combining factors coastal region',
      steps: [
        `Apply the latitude factor first. Region A is close to the equator, so sunlight arrives close to straight down for most of the year. That means strong, concentrated heating and a typically warm climate with only a small difference between the warmest and coldest months.`,
        `Apply the elevation factor next. Region A sits at low elevation, so elevation is not pulling the temperature down the way it would in the mountains. There is nothing here to cool the region below what its latitude already predicts.`,
        `Apply the distance-from-water factor last. Region A is right on the coast of a large ocean, so its temperature is moderated -- smaller day-to-night and summer-to-winter swings than an inland location at the same latitude would have -- and the nearby ocean is a source of moisture, so Region A likely receives fairly high precipitation.`,
        `Combine the three. Warm year-round, a small temperature swing between seasons, and fairly high precipitation.`,
        `Check the answer with three clues of a different kind. First, the latitude reasoning: concentrated, close-to-overhead sunlight means strong, steady heating. Second, the water reasoning: a large ocean right at the coast moderates swings and supplies moisture. Third, an outside check: regions around the world that share this exact combination -- close to the equator, low elevation, right on a coast -- are consistently described as warm year-round with plentiful rainfall, which is exactly the pattern the first two clues predicted on their own.`,
        `Now change one condition and check that the answer moves with it. Move this same region far inland, keeping its latitude and elevation exactly the same. It would still get the same strong, direct sunlight, so it would still be warm -- but without an ocean nearby to moderate it or supply moisture, expect a bigger swing between its hottest and coldest times of year, and less precipitation than before. The prediction changed because the evidence changed, which is what shows the reasoning is doing real work.`,
      ],
      example: { problem: `Region A sits close to the equator, at low elevation, right on the coast of a large ocean. Describe its typical temperature pattern and its typical precipitation pattern.`, solution: `Region A would typically be warm all year with only a small swing between its warmest and coldest months, and it would typically receive fairly high precipitation, because its low latitude gives it strong, concentrated sunlight and its coastal location moderates its temperature and supplies nearby moisture.` },
      relatedLoIds: ['m6sci.what-determines-a-regions-climate'],
    },
    {
      title: 'Worked same latitude different elevation and water',
      steps: [
        `Start with what is given as equal: latitude. Region B and Region C receive the same angle of sunlight over the course of a year.`,
        `WRONG: "Since they share the same latitude, Region B and Region C must have similar climates." CORRECT: "Sharing a latitude only means the LATITUDE factor is equal between them. Elevation and distance from water still have to be checked separately, and here both of those are very different."`,
        `Apply the elevation factor. Region C sits high up in the mountains; Region B sits at low elevation. Higher elevation typically means cooler typical temperatures, so Region C would typically be cooler than Region B for this reason alone.`,
        `Apply the distance-from-water factor. Region B sits right next to a large lake, so its temperature is moderated and it has a nearby source of moisture. Region C is far from any large body of water, so it typically has bigger swings between its hottest and coldest times of year, and typically receives less precipitation.`,
        `Combine the two differing factors. Both point the same direction: Region C would typically be colder, would swing more between seasons, and would typically be drier than Region B, even though the two regions share a latitude.`,
        `Check the answer with three clues of a different kind. First, the elevation rule: higher up is typically cooler. Second, the water rule: farther from a large body of water typically means bigger swings and less precipitation. Third, an everyday pattern many people have heard of: a mountain town often gets much colder, snowier winters than a nearby lowland town at a similar latitude, which matches this same reasoning.`,
        `Now change one condition and check that the answer moves with it. Swap which region has which trait, keeping the shared latitude the same: if Region C were instead the low-elevation one next to the large lake, and Region B were instead the high-elevation one far from water, the colder, more variable, drier prediction would now follow Region B instead of Region C. The prediction tracks elevation and distance from water, not something fixed about either region's name.`,
      ],
      example: { problem: `Region B and Region C sit at the exact same latitude. Region B sits at low elevation, right next to a large lake. Region C sits high up in the mountains, far from any large body of water. Compare their typical climates.`, solution: `Even though Region B and Region C share the same latitude, Region C would typically be colder, would swing more between its hottest and coldest times of year, and would typically be drier than Region B, because Region C sits at a much higher elevation and far from any large body of water, while Region B sits at low elevation right next to a large lake.` },
      relatedLoIds: ['m6sci.what-determines-a-regions-climate'],
    },
  ],
  pointers: [
    { content: `Students often say "Region G and Region H are both very close to the equator, so they must have almost the same climate." — Latitude is only one of three factors this lesson covers. Two regions can share the same latitude and still have very different typical climates if their elevation or their distance from a large body of water is different -- for example, one region high in the mountains and far from water, the other at low elevation right on a coast.`, kind: 'common-error' },
    { content: `Students often say "The reason places near the equator are warm is that the equator is closer to the sun than the poles are." — The distance from the equator to the poles, measured across Earth's own surface, is only a few thousand kilometers -- far too small to matter next to the enormous distance from Earth to the sun. What actually differs by latitude is the ANGLE sunlight arrives at: close to straight down and concentrated near the equator, low and spread out over a wider area near the poles. That angle, not distance, is why the equator is typically warmer.`, kind: 'common-error' },
    { content: `Climate is a region's typical weather pattern averaged over many years. Three factors combine to shape it: latitude, elevation, and distance from a large body of water.`, kind: 'tip' },
    { content: `Latitude changes the ANGLE of incoming sunlight, not the distance to the sun. Near the equator, sunlight arrives close to straight down; near the poles, it arrives at a low, slanting angle spread over a wider area.`, kind: 'tip' },
    { content: `Regions near the equator are typically warm year-round with a small seasonal swing. Regions near the poles are typically colder with a bigger seasonal swing.`, kind: 'tip' },
    { content: `Higher elevation typically means cooler typical temperatures than nearby lower elevation, even at the same latitude.`, kind: 'tip' },
    { content: `A large body of water moderates nearby temperature -- smaller day-to-night and summer-to-winter swings -- and is a nearby source of moisture, so coastal regions generally receive more precipitation than regions far inland.`, kind: 'tip' },
    { content: `No one factor decides a region's climate alone. Always check latitude, elevation, and distance from water together before predicting a region's typical temperature and precipitation pattern.`, kind: 'tip' },
    { content: `Same latitude does not mean same climate. Two regions at the same latitude can have very different typical climates if their elevation or distance from water differs.`, kind: 'tip' },
    { content: `Ocean currents also shape a coastline's climate, but that is a different mechanism, covered in the next lesson.`, kind: 'tip' },
    { content: `**Latitude is about ANGLE, not distance to the sun.** The equator is not closer to the sun than the poles. What changes is the ANGLE sunlight hits Earth: straight down near the equator, slanted near the poles. Same sunlight, different spread.`, kind: 'common-error' },
    { content: `**Same latitude ≠ same climate.** Two regions at the equator can have totally different climates if one sits in high mountains and one sits on a coast. Always check all three factors (latitude, elevation, distance from water) before predicting climate.`, kind: 'gotcha' },
    { content: `**'Moderate' means smaller swings, not mild weather.** A moderated climate has smaller day-to-night and summer-to-winter temperature swings. It doesn't mean the place is always pleasant—a coast at the equator is hot and moderated, not cool.`, kind: 'vocab-note' },
    { content: `**Higher elevation = cooler, always.** If two places share the same latitude and distance from water, the one higher up in the mountains is typically colder. No exceptions in this lesson.`, kind: 'tip' },
    { content: `**Water affects both temperature AND precipitation.** A large body of water doesn't just moderate temperature swings—it also adds moisture to the air. Coastal regions are usually both more stable in temperature AND wetter than inland regions at the same latitude.`, kind: 'edge-case' },
    { content: `**Climate ≠ weather.** Climate is what you expect over many years (typical pattern). Weather is what happens this week. Never say 'it snowed in July so the climate is snowy'—one event is not a pattern.`, kind: 'vocab-note' },
    { content: `**The three factors work TOGETHER, not separately.** Don't predict latitude's effect, then elevation's, then water's, and add them up. The three combine at once to shape the actual climate—sometimes one factor reinforces others, sometimes they partly cancel.`, kind: 'common-error' },
  ],
};
