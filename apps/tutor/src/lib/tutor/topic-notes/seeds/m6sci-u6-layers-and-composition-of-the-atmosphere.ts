/**
 * Grade 6 Science — Unit 6 CED 6.1: Layers & Composition of the Atmosphere.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.layers-and-composition-of-the-atmosphere.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U6_LAYERS_AND_COMPOSITION_OF_THE_ATMOSPHERE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.layers-and-composition-of-the-atmosphere.v1',
  course: 'Grade 6 Science',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Layers & Composition of the Atmosphere',
  planId: 'evelyn.ms.m6sci.layers-and-composition-of-the-atmosphere.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.layers-and-composition-of-the-atmosphere.v1' }],
  theory: [
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', content: `GRAVITY HOLDS THE WHOLE BLANKET IN PLACE, AND IT IS LAYERED. Earth's atmosphere is a thin layer of gases held against the surface by gravity -- the same pull that keeps the Moon in its orbit, just acting on gas instead of rock. Scientists divide it into four layers, named troposphere, stratosphere, mesosphere and thermosphere, in that order from the ground outward. Each layer is identified by its approximate altitude range and by which direction temperature trends as you climb through it.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', content: `TROPOSPHERE -- FROM THE GROUND TO ABOUT 12 KILOMETERS. This is the layer of weather, clouds, and the air people and animals breathe; it holds almost all of the atmosphere's water vapor. Through it, temperature falls steadily the higher you go. It is not exactly 12 kilometers everywhere -- it is thinner over the poles, at around 8 kilometers, and thicker over the equator, at around 16 kilometers, with 12 kilometers used as a typical value for the whole planet.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', content: `STRATOSPHERE -- FROM ABOUT 12 TO ABOUT 50 KILOMETERS. Here the trend flips: temperature rises the higher you go, the opposite of the troposphere just below it. This layer contains ozone that absorbs incoming ultraviolet radiation from the sun, and that absorption is why temperature rises with altitude here. Commercial airplanes cruise near the bottom of this layer.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', content: `MESOSPHERE -- FROM ABOUT 50 TO ABOUT 85 KILOMETERS. The trend flips again here: temperature falls with altitude, and it keeps falling until this layer reaches the coldest part of the entire atmosphere, near its top.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', content: `THERMOSPHERE -- FROM ABOUT 85 KILOMETERS OUTWARD, WITH NO SINGLE SHARP TOP. The trend flips one more time: temperature rises again, and by the measure scientists use for temperature, this is the hottest of the four layers. It reaches out hundreds of kilometers and gradually thins into space with no exact edge. The International Space Station orbits inside this layer, at around 400 kilometers up.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', content: `COMPOSITION -- WHAT THE AIR IS ACTUALLY MADE OF. By volume, dry air is about 78 percent nitrogen and about 21 percent oxygen -- those two gases alone add up to about 99 percent of the air (78 + 21 = 99). The remaining roughly 1 percent is a mix of other gases, mostly argon, with carbon dioxide making up only a small part of that last one percent.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', kind: 'definition', title: 'atmosphere', content: 'the whole blanket of gases surrounding Earth, held in place by gravity.' },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', kind: 'definition', title: 'troposphere', content: `the lowest layer of the atmosphere, reaching from the ground to about 12 kilometers, where temperature falls with altitude and almost all weather happens.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', kind: 'definition', title: 'stratosphere', content: `the layer above the troposphere, from about 12 to about 50 kilometers, where temperature rises with altitude.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', kind: 'definition', title: 'mesosphere', content: `the layer above the stratosphere, from about 50 to about 85 kilometers, where temperature falls with altitude again, reaching the coldest part of the atmosphere near its top.` },
    { loId: 'm6sci.layers-and-composition-of-the-atmosphere', kind: 'definition', title: 'thermosphere', content: `the outermost of the four layers covered here, beginning around 85 kilometers and reaching hundreds of kilometers outward, where temperature rises again and reaches its highest values.` },
  ],
  methods: [
    {
      title: 'Worked altitude to layer',
      steps: [
        `Start with the four altitude ranges from the concept: troposphere from the ground to about 12 kilometers, stratosphere from about 12 to about 50 kilometers, mesosphere from about 50 to about 85 kilometers, and thermosphere from about 85 kilometers outward.`,
        `5 kilometers up falls inside the troposphere's range (0 to about 12 kilometers). In the troposphere, temperature falls with altitude, so it is trending colder at this point.`,
        `30 kilometers up falls inside the stratosphere's range (about 12 to about 50 kilometers). In the stratosphere, temperature rises with altitude, so it is trending warmer at this point -- the opposite trend from the layer just below it.`,
        `70 kilometers up falls inside the mesosphere's range (about 50 to about 85 kilometers). In the mesosphere, temperature falls again with altitude, so it is trending colder at this point.`,
        `Check this three ways, using different kinds of evidence each time. First, altitude: each of the three numbers (5, 30, 70) sits cleanly inside one range and not near a boundary, so there is no ambiguity about which layer it belongs to. Second, the trend pattern: the three trends line up as colder, warmer, colder, which matches the down-up-down-up pattern across the four layers, not a random mix. Third, order: 5 is less than 30 is less than 70, and troposphere-stratosphere-mesosphere is the correct order outward from the ground, so the layers named do not skip or reverse.`,
        `Now change one number and see if the answer moves. If the third reading had been taken at 90 kilometers instead of 70, it would fall in the thermosphere's range instead of the mesosphere's, and the trend at that point would be warmer, not colder -- the answer changes because the evidence changed.`,
      ],
      example: { problem: `A science rocket launches straight up from the ground. Using altitude alone, name which of the four layers it is passing through at each of these three moments, and say whether the temperature there is trending colder or warmer as the rocket climbs: 5 kilometers up, 30 kilometers up, and 70 kilometers up.`, solution: `5 kilometers: troposphere, trending colder. 30 kilometers: stratosphere, trending warmer. 70 kilometers: mesosphere, trending colder.` },
      relatedLoIds: ['m6sci.layers-and-composition-of-the-atmosphere'],
    },
    {
      title: 'Worked trend to boundary',
      steps: [
        `Start with the layer below the switch. Temperature was falling steadily from the ground up to about 12 kilometers, and that falling trend is exactly what defines the troposphere.`,
        `WRONG: "The rocket keeps climbing, so the air must keep getting colder no matter what." CORRECT: temperature trends are tied to which layer the rocket is in, not simply to altitude increasing forever. The troposphere gets colder with height, but the layer directly above it gets warmer with height instead.`,
        `Now use the trend reversal itself as the clue for the boundary. A switch from a falling trend to a rising trend, at about 12 kilometers, is exactly the pattern that marks the top of the troposphere and the start of the stratosphere.`,
        `So the rocket is about to enter the stratosphere, where temperature rises with altitude instead of falling.`,
        `Check this three ways, using different kinds of evidence each time. First, altitude: about 12 kilometers matches the troposphere's known upper range. Second, trend: the falling-to-rising switch is the specific signature of this particular boundary, not any of the other three. Third, order: the troposphere is the layer closest to the ground, so the very first boundary a rocket crosses on the way up has to be this one, not a higher one.`,
        `Now change which kind of switch happens, and see if the answer moves. Suppose instead the rocket's readings had been rising steadily up to about 50 kilometers, then started falling from that point onward. That is the opposite type of switch, at a different altitude, and it marks a different boundary altogether: the top of the stratosphere and the start of the mesosphere.`,
      ],
      example: { problem: `Scientists tracking a research rocket's instruments see the temperature falling steadily the entire way up from the ground. At an altitude of about 12 kilometers, the falling stops, and from that point on the temperature starts rising steadily as the rocket keeps climbing. Which two layers meet at this point, and which one is the rocket about to enter?`, solution: `The troposphere and the stratosphere meet here, and the rocket is about to enter the stratosphere. The falling-to-rising switch at about 12 kilometers matches the boundary between these two specific layers, not any other boundary in the atmosphere.` },
      relatedLoIds: ['m6sci.layers-and-composition-of-the-atmosphere'],
    },
  ],
  pointers: [
    { content: `Students often say "The air we breathe is mostly oxygen." — Nitrogen is actually the most abundant gas in dry air, at about 78 percent. Oxygen is second, at about 21 percent. Together those two make up about 99 percent of the air, with the remaining roughly 1 percent being a mix of other gases, mostly argon, with carbon dioxide making up only a small part of that last 1 percent. Oxygen matters enormously for breathing, but mattering to us is not the same as being the most common gas in the air.`, kind: 'common-error' },
    { content: `Students often say "The atmosphere just keeps getting colder in a straight line, all the way to space." — Temperature does not fall the whole way up. It falls through the troposphere (the ground up to about 12 kilometers), then rises through the stratosphere (about 12 to about 50 kilometers), then falls again through the mesosphere (about 50 to about 85 kilometers), then rises again through the thermosphere (from about 85 kilometers outward). The pattern goes down, up, down, up across the four layers, not down the whole way.`, kind: 'common-error' },
    { content: `The atmosphere is a thin blanket of gases held to Earth by gravity, divided into four layers by altitude and temperature trend: troposphere, stratosphere, mesosphere, thermosphere, in that order outward from the ground.`, kind: 'tip' },
    { content: `The troposphere reaches from the ground up to about 12 kilometers (thinner over the poles, thicker over the equator), and temperature falls steadily with altitude through it. This is the layer with weather and the air we breathe.`, kind: 'tip' },
    { content: `The stratosphere runs from about 12 to about 50 kilometers. It contains ozone that absorbs incoming ultraviolet radiation from the sun, which is why temperature rises with altitude through it -- the opposite trend from the troposphere below it.`, kind: 'tip' },
    { content: `The mesosphere runs from about 50 to about 85 kilometers, where temperature falls again, reaching the coldest part of the whole atmosphere near its top.`, kind: 'tip' },
    { content: `The thermosphere begins around 85 kilometers and stretches outward hundreds of kilometers with no single sharp top; temperature rises again there, and it is the hottest of the four layers. The International Space Station orbits inside it.`, kind: 'tip' },
    { content: `Layer boundaries are not sharp lines. They are transition zones, and the exact altitude of each one shifts depending on latitude and other conditions.`, kind: 'tip' },
    { content: `By volume, dry air is about 78 percent nitrogen and about 21 percent oxygen -- those two gases alone make up about 99 percent of the air. The remaining roughly 1 percent is a mix of other gases, mostly argon, with carbon dioxide only a small part of that last 1 percent.`, kind: 'tip' },
    { content: `Temperature does not fall in a straight line all the way up. It goes down, up, down, up across the four layers, not down the whole way to space.`, kind: 'tip' },
  ],
};
