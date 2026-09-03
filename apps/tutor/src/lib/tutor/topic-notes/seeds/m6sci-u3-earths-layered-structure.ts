/**
 * Grade 6 Science — Unit 3 CED 3.1: Earth's Layered Structure.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.earths-layered-structure.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U3_EARTHS_LAYERED_STRUCTURE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.earths-layered-structure.v1',
  course: 'Grade 6 Science',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: `Earth's Layered Structure`,
  planId: 'evelyn.ms.m6sci.earths-layered-structure.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.earths-layered-structure.v1' }],
  theory: [
    { loId: 'm6sci.earths-layered-structure', content: `EARTH IS LAYERED, AND YOU CANNOT DIG TO MOST OF IT. Moving straight down from wherever you are standing, the four layers, in order from the surface to the center, are the CRUST, the MANTLE, the OUTER CORE, and the INNER CORE. Nearly everything scientists know about the three deeper layers comes from measurement, not from digging or seeing them directly.` },
    { loId: 'm6sci.earths-layered-structure', content: `THE CRUST IS THE THINNEST LAYER BY FAR. It ranges from about 5 kilometers thick under the ocean floor to about 70 kilometers thick under the tallest mountain ranges -- a typical continental thickness is closer to 35 kilometers. The crust is solid rock, the same kind of rock a person can pick up and hold. It is the only layer humans have ever physically reached: even the deepest borehole, at about 12 kilometers, only gets partway through the thickest continental crust and nowhere close to the mantle underneath.` },
    { loId: 'm6sci.earths-layered-structure', content: `THE MANTLE IS BY FAR THE THICKEST LAYER. Measured from the surface, it reaches down to about 2,900 kilometers, which alone is close to half of the total distance to Earth's center. The mantle is solid rock -- not a sea of liquid magma -- but it is hot enough and under enough pressure that, over spans of thousands to millions of years, it can flow very slowly, more like extremely stiff putty than like water or lava. A pocket of it can melt into the magma that sometimes reaches the surface, but that melted magma is a small, scattered fraction of the whole mantle, not the whole layer.` },
    { loId: 'm6sci.earths-layered-structure', content: `THE OUTER CORE IS THE ONLY LAYER THAT IS FULLY LIQUID. It runs from about 2,900 kilometers down to about 5,150 kilometers, a thickness of about 2,250 kilometers, made mostly of molten iron and nickel. Liquid means it flows and takes the shape of whatever surrounds it, unlike the mantle's slow, solid flow above it.` },
    { loId: 'm6sci.earths-layered-structure', content: `THE INNER CORE IS SOLID, EVEN THOUGH IT IS THE HOTTEST LAYER OF ALL. It is a ball reaching from about 5,150 kilometers down to Earth's center, at about 6,371 kilometers -- a radius of about 1,221 kilometers -- made of the same iron-nickel material as the outer core. It stays solid despite the extreme heat because the pressure at the center of the planet is great enough to keep that metal from melting. Pressure, not just temperature, decides whether the metal there is solid or liquid.` },
    { loId: 'm6sci.earths-layered-structure', content: `THE LAYERS ADD UP TO THE WHOLE PLANET. Add the top slice, down to about 2,900 kilometers (this covers the crust and the mantle together, since the crust makes up only a few tens of kilometers of that top slice), to the outer core's roughly 2,250 kilometers, to the inner core's roughly 1,221 kilometers, and the total comes to about 6,371 kilometers -- Earth's full depth to the center, checked two different ways and matching. The mantle is the single thickest of the four layers, thicker than the crust, the outer core, or the inner core by itself -- but the outer core and inner core added together, about 3,471 kilometers, actually come to more than the mantle alone.` },
    { loId: 'm6sci.earths-layered-structure', kind: 'definition', title: 'crust', content: `Earth's thin, solid, rocky outer layer, ranging from about 5 kilometers thick under the oceans to about 70 kilometers thick under high mountain ranges.` },
    { loId: 'm6sci.earths-layered-structure', kind: 'definition', title: 'mantle', content: `the thick layer of solid rock beneath the crust, reaching down to about 2,900 kilometers, that can flow very slowly over long spans of time without fully melting.` },
    { loId: 'm6sci.earths-layered-structure', kind: 'definition', title: 'outer core', content: `the layer of molten (liquid) iron and nickel between about 2,900 and about 5,150 kilometers deep.` },
    { loId: 'm6sci.earths-layered-structure', kind: 'definition', title: 'inner core', content: `the solid ball of iron and nickel at Earth's very center, from about 5,150 kilometers deep to about 6,371 kilometers deep, kept solid by extreme pressure despite being the hottest of the four layers.` },
    { loId: 'm6sci.earths-layered-structure', kind: 'definition', title: 'molten', content: `melted into a liquid by heat -- used here for the outer core, which is liquid metal.` },
  ],
  methods: [
    {
      title: 'Worked position to layer',
      steps: [
        `List the layer boundaries in order, straight down from the surface: the crust and mantle together reach down to about 2,900 kilometers; the outer core runs from about 2,900 kilometers to about 5,150 kilometers; the inner core runs from about 5,150 kilometers down to Earth's center, at about 6,371 kilometers.`,
        `Place 3,500 kilometers on that list. It is greater than 2,900 and less than 5,150, so it falls inside the outer core's range -- not the crust-and-mantle slice above it, and not the inner core below it.`,
        `Attach the physical state that goes with that layer. Of the four layers, the outer core is the only one that is entirely liquid, so a sample from 3,500 kilometers should be molten metal, not solid rock.`,
        `WRONG: "a depth of 3,500 kilometers must still be inside the mantle, because the mantle is the biggest layer." CORRECT: "the mantle being the thickest layer only means it covers the most kilometers of depth, from the surface down to about 2,900 kilometers -- past that point, greater depth belongs to the outer core no matter how thick the mantle is."`,
        `Check this three different ways, since there is no arithmetic answer to redo here beyond the boundary numbers themselves. First, by position: 3,500 falls strictly between the outer core's two boundaries, 2,900 and 5,150. Second, by definition: molten iron-nickel material is exactly what the outer core is described as being, so a liquid sample at this depth is expected, not surprising. Third, by an internal-consistency check that does not depend on this one sample at all: add the crust-and-mantle depth of about 2,900 kilometers, the outer core's thickness of about 2,250 kilometers (5,150 minus 2,900), and the inner core's thickness of about 1,221 kilometers (6,371 minus 5,150). The total is exactly 6,371 kilometers -- Earth's full depth to the center, matching.`,
        `Now change the depth and check that the answer moves with it. A sample from about 6,000 kilometers would be past the outer core's lower boundary of 5,150 kilometers, placing it in the inner core instead -- and the expected state flips from liquid back to solid, even though 6,000 kilometers is hotter than 3,500 kilometers, because the inner core stays solid despite the heat, on account of the pressure there.`,
      ],
      example: { problem: `A sample is reported to have come from a depth of about 3,500 kilometers below Earth's surface. Which layer did it come from, and is that layer solid or liquid?`, solution: `The outer core. A depth of 3,500 kilometers falls between the outer core's boundaries of about 2,900 and about 5,150 kilometers, and the outer core is the one layer that is entirely liquid.` },
      relatedLoIds: ['m6sci.earths-layered-structure'],
    },
    {
      title: 'Worked crust thickness',
      steps: [
        `Identify the layer from what the problem describes: solid rock reached directly by drilling from the surface, sitting on top of whatever comes next. That is the crust -- the only layer people drill into directly.`,
        `Compare both numbers to what is known about crust thickness. Oceanic crust runs about 5 to 10 kilometers thick, so needing about 7 kilometers to get through it under the ocean floor fits. Continental crust runs thicker, typically about 25 to 70 kilometers, so needing about 40 kilometers under a mountain range also fits.`,
        `The difference is not a different layer -- it is the same layer, crust, at two different thicknesses. Oceanic crust is consistently thinner than continental crust.`,
        `WRONG: "once a drill breaks through the crust, it should start pulling up liquid magma, because everything beneath the crust is a sea of melted rock." CORRECT: "beneath the crust is the mantle, which is solid rock almost everywhere -- only small, scattered pockets of it are actually melted into magma. A drill that reached the mantle would hit hot solid rock, not a sea of liquid."`,
        `Check the crust answer three different ways. First, by definition: the crust is the layer described as reachable directly by drilling, which matches both projects. Second, by range: both measured depths, 7 kilometers and 40 kilometers, fall inside the known thickness ranges for oceanic and continental crust rather than in the thousands of kilometers that would signal the mantle or deeper. Third, by scale comparison: even the thicker, 40-kilometer reading is a tiny fraction of the mantle's roughly 2,900-kilometer span, so neither reading is close to large enough to already be inside the mantle.`,
        `Now change one condition and check that the answer moves. If a drill somehow reached a depth of 2,000 kilometers, it would no longer be in the crust under any measurement in this lesson -- the crust never gets anywhere near that thick, so at that depth the drill would have to be well into the mantle instead.`,
      ],
      example: { problem: `A drilling project below the ocean floor reaches a new, deeper rock layer after only about 7 kilometers. A separate project drilling down from a mountain range has to go down about 40 kilometers before reaching that same next layer. Both projects are drilling through the same layer of Earth the whole way. Which layer is it, and why does the required depth differ so much between the two locations?`, solution: `Both are drilling through the crust. Oceanic crust (about 5 to 10 kilometers thick) is thinner than continental crust (about 25 to 70 kilometers thick), which is why the ocean-floor project reaches the next layer after only about 7 kilometers while the mountain-range project needs about 40 kilometers.` },
      relatedLoIds: ['m6sci.earths-layered-structure'],
    },
  ],
  pointers: [
    { content: `Students often say "Earth's mantle is basically a giant ocean of melted rock." — The mantle is solid rock almost everywhere. It is hot enough and under enough pressure that, over thousands to millions of years, it can flow very slowly -- more like extremely stiff putty than like water or melted lava. Only small, scattered pockets of it actually melt into the magma that sometimes reaches the surface; the mantle as a whole stays solid.`, kind: 'common-error' },
    { content: `Students often say "The very center of Earth must be the most liquid part of all, since it is the hottest." — The inner core, at Earth's very center, is in fact solid, even though it is the hottest layer of the four. Pressure, not just heat, decides whether the iron-nickel metal there is solid or liquid, and the pressure at the center is great enough to keep it solid despite the extreme heat. The outer core, at a shallower depth and under less pressure, is the layer that is actually liquid.`, kind: 'common-error' },
    { content: `Earth has four layers by composition, in order from the surface to the center: crust, mantle, outer core, inner core.`, kind: 'tip' },
    { content: `The crust is the thinnest layer, solid rock, from about 5 kilometers thick under the ocean to about 70 kilometers thick under mountains.`, kind: 'tip' },
    { content: `The mantle is the thickest layer by far, reaching down to about 2,900 kilometers. It is solid rock that can flow very slowly over long spans of time -- it is not a sea of liquid magma.`, kind: 'tip' },
    { content: `The outer core is the only layer that is entirely liquid -- molten iron and nickel, from about 2,900 to about 5,150 kilometers deep.`, kind: 'tip' },
    { content: `The inner core is solid, from about 5,150 kilometers deep to Earth's center at about 6,371 kilometers, even though it is the hottest layer of all -- the pressure there keeps the iron-nickel metal from melting.`, kind: 'tip' },
    { content: `Temperature alone does not decide solid versus liquid inside Earth; pressure matters too.`, kind: 'tip' },
    { content: `The mantle is the single thickest of Earth's four layers -- thicker than the crust, the outer core, or the inner core by itself -- though the outer core and inner core added together are actually a bit more than the mantle alone.`, kind: 'tip' },
    { content: `The deepest hole anyone has ever drilled reaches only about 12 kilometers, and it did not even reach the bottom of the continental crust it was drilled into.`, kind: 'tip' },
    { content: `Don't say the mantle is 'melted rock' or 'liquid magma.' The mantle is solid rock that flows *extremely slowly* over thousands to millions of years — like stiff putty, not like water or lava. Only tiny scattered pockets of it actually melt.`, kind: 'common-error' },
    { content: `To find which layer a depth belongs to, always check the depth *number* against the layer boundaries first — don't just say 'the mantle is the thickest, so it must be the mantle.' The mantle goes down to about 2,900 km; past that, you're in the outer core, no matter how thick the mantle is.`, kind: 'gotcha' },
    { content: `The inner core is solid *and* the hottest layer — both are true at the same time. Temperature alone doesn't decide solid or liquid; pressure does. The pressure at Earth's center is so enormous it keeps iron-nickel solid even at extreme heat.`, kind: 'vocab-note' },
    { content: `Oceanic crust (∼5–10 km thick) versus continental crust (∼25–70 km thick) — both are the crust, just different thicknesses in different places. Don't treat them as different layers.`, kind: 'edge-case' },
    { content: `Scientists know about Earth's deep layers mostly from *measurement* (like seismic waves), not from digging. The deepest borehole is only about 12 km — it doesn't even reach the bottom of continental crust, let alone touch the mantle.`, kind: 'tip' },
    { content: `The outer core is the *only* layer that is entirely liquid. Crust = solid. Mantle = solid (slow flow). Inner core = solid. Outer core = liquid. If you say any other layer is liquid, check your depth boundaries.`, kind: 'vocab-note' },
    { content: `When a depth lands on a boundary (like exactly 2,900 km or 5,150 km), be careful: use 'about' and check which layer's range includes that depth. A depth of 2,900 km is the *bottom* of the mantle and the *top* of the outer core — context matters.`, kind: 'edge-case' },
  ],
};
