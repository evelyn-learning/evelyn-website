/**
 * Grade 6 Science (Earth & Space Science) — Minerals, Rocks & the Rock Cycle:
 * Earth's Layered Structure.
 *
 * CONCEPT-LED fan-out row for m6sci (DCI ESS2.A, foundational to MS-ESS2-1).
 * The student cannot see a cross-section of Earth, so the whole lesson is
 * built from numbers a student can place on a mental number line running from
 * the surface (0 kilometers) to the center (about 6,371 kilometers): where
 * each of the four layers starts and ends, how thick each one is, and
 * whether it is solid, liquid, or solid-but-slow-flowing at that depth.
 * Every comparison is written out in words and digits rather than left to an
 * assumed picture.
 *
 * SCOPE GUARD: this plan identifies Earth's four layers by COMPOSITION --
 * crust, mantle, outer core, inner core -- and states each one's relative
 * position, thickness, and physical state (solid; liquid/molten; or solid
 * but able to flow very slowly, in the mantle's case). It does NOT introduce
 * Earth's MECHANICAL layers. The words "lithosphere," "asthenosphere,"
 * "plate," "plate boundary," and "convection" appear nowhere in this file;
 * describing the lithosphere as broken into moving plates riding on a
 * flowing asthenosphere is row 4.2 (Earth's Plates & Mantle Convection), and
 * the plate-boundary and landform rows that follow it in Unit 4. This row
 * and row 4.2 describe different cuts of the same planet, and conflating
 * them -- treating "mantle" and "asthenosphere" as the same word, or
 * treating this row's crust/mantle boundary as a plate boundary -- is the
 * specific error this guard exists to block.
 *   - MINERALS AND ROCKS: how to identify a mineral, or classify a rock as
 *     igneous, sedimentary, or metamorphic, is rows 3.2 through 3.4. This
 *     file states only that the crust is solid rock; it does not name a rock
 *     type or a mineral property.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this file states, as bare facts,
 *     that the outer core is liquid and that the inner core is solid despite
 *     being the hottest layer of the four because of the pressure there. It
 *     does not explain heat transfer (conduction, convection, radiation),
 *     the particle or kinetic theory of matter, or WHY Earth's layers
 *     separated by density or composition in the first place -- those
 *     mechanisms belong to Grade 8 physical science and appear nowhere here.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * boundary and every comparison in this file is written out as a number or a
 * described relationship, never as "the diagram above" or "the cross-section
 * shown." The two worked examples deliberately run the position-to-layer
 * direction and the layer-to-thickness direction, so a student can reason
 * from either a depth or a description to the layer it belongs to.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U3_EARTHS_LAYERED_STRUCTURE: LessonPlan = {
  id: 'evelyn.ms.m6sci.earths-layered-structure.v1',
  title: 'Earth\'s Layered Structure',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.earths-layered-structure',
      standard: 'M6SCI-3.1',
      description:
        'Identify Earth\'s crust, mantle, outer core, and inner core by relative position, thickness, and physical state (solid vs. molten/plastic) (DCI ESS2.A, foundational to MS-ESS2-1; no PE names Earth\'s internal layering directly).',
    },
  ],
  prerequisites: ['m6sci.solar-and-lunar-eclipses'],
  followUps: ['m6sci.identifying-minerals-by-their-properties'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the scale problem: no one has ever reached most of what this lesson describes.',
      script:
        'Think about the ground under your feet right now. People have tried to dig straight down into it. The deepest hole anyone has ever drilled reaches about 12 kilometers -- a project that took years to finish. Twelve kilometers sounds enormous, farther than most people will ever travel underground in their whole life. But Earth\'s full depth, from the surface all the way to the very center, is about 6,371 kilometers. That means the deepest hole ever drilled did not even reach the bottom of the crust it was drilled into, let alone anywhere close to the center. So how does anyone know what is down there, thousands of kilometers past where any drill has ever reached? Today we build the picture of what those deeper layers actually are -- how far down each one goes, how thick it is, and whether it is solid rock, something that flows very slowly, or fully liquid.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-earths-layers',
      kind: 'concept',
      goal: 'Build the crust/mantle/outer-core/inner-core model by position, thickness, and physical state, and correct the two errors that come from confusing heat with liquid.',
      keyIdeas: [
        'EARTH IS LAYERED, AND YOU CANNOT DIG TO MOST OF IT. Moving straight down from wherever you are standing, the four layers, in order from the surface to the center, are the CRUST, the MANTLE, the OUTER CORE, and the INNER CORE. Nearly everything scientists know about the three deeper layers comes from measurement, not from digging or seeing them directly.',
        'THE CRUST IS THE THINNEST LAYER BY FAR. It ranges from about 5 kilometers thick under the ocean floor to about 70 kilometers thick under the tallest mountain ranges -- a typical continental thickness is closer to 35 kilometers. The crust is solid rock, the same kind of rock a person can pick up and hold. It is the only layer humans have ever physically reached: even the deepest borehole, at about 12 kilometers, only gets partway through the thickest continental crust and nowhere close to the mantle underneath.',
        'THE MANTLE IS BY FAR THE THICKEST LAYER. Measured from the surface, it reaches down to about 2,900 kilometers, which alone is close to half of the total distance to Earth\'s center. The mantle is solid rock -- not a sea of liquid magma -- but it is hot enough and under enough pressure that, over spans of thousands to millions of years, it can flow very slowly, more like extremely stiff putty than like water or lava. A pocket of it can melt into the magma that sometimes reaches the surface, but that melted magma is a small, scattered fraction of the whole mantle, not the whole layer.',
        'THE OUTER CORE IS THE ONLY LAYER THAT IS FULLY LIQUID. It runs from about 2,900 kilometers down to about 5,150 kilometers, a thickness of about 2,250 kilometers, made mostly of molten iron and nickel. Liquid means it flows and takes the shape of whatever surrounds it, unlike the mantle\'s slow, solid flow above it.',
        'THE INNER CORE IS SOLID, EVEN THOUGH IT IS THE HOTTEST LAYER OF ALL. It is a ball reaching from about 5,150 kilometers down to Earth\'s center, at about 6,371 kilometers -- a radius of about 1,221 kilometers -- made of the same iron-nickel material as the outer core. It stays solid despite the extreme heat because the pressure at the center of the planet is great enough to keep that metal from melting. Pressure, not just temperature, decides whether the metal there is solid or liquid.',
        'THE LAYERS ADD UP TO THE WHOLE PLANET. Add the top slice, down to about 2,900 kilometers (this covers the crust and the mantle together, since the crust makes up only a few tens of kilometers of that top slice), to the outer core\'s roughly 2,250 kilometers, to the inner core\'s roughly 1,221 kilometers, and the total comes to about 6,371 kilometers -- Earth\'s full depth to the center, checked two different ways and matching. The mantle is the single thickest of the four layers, thicker than the crust, the outer core, or the inner core by itself -- but the outer core and inner core added together, about 3,471 kilometers, actually come to more than the mantle alone.',
      ],
      vocabulary: [
        { term: 'crust', definition: 'Earth\'s thin, solid, rocky outer layer, ranging from about 5 kilometers thick under the oceans to about 70 kilometers thick under high mountain ranges.' },
        { term: 'mantle', definition: 'the thick layer of solid rock beneath the crust, reaching down to about 2,900 kilometers, that can flow very slowly over long spans of time without fully melting.' },
        { term: 'outer core', definition: 'the layer of molten (liquid) iron and nickel between about 2,900 and about 5,150 kilometers deep.' },
        { term: 'inner core', definition: 'the solid ball of iron and nickel at Earth\'s very center, from about 5,150 kilometers deep to about 6,371 kilometers deep, kept solid by extreme pressure despite being the hottest of the four layers.' },
        { term: 'molten', definition: 'melted into a liquid by heat -- used here for the outer core, which is liquid metal.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-position-to-layer',
      kind: 'worked_example',
      problem:
        'A sample is reported to have come from a depth of about 3,500 kilometers below Earth\'s surface. Which layer did it come from, and is that layer solid or liquid?',
      steps: [
        'List the layer boundaries in order, straight down from the surface: the crust and mantle together reach down to about 2,900 kilometers; the outer core runs from about 2,900 kilometers to about 5,150 kilometers; the inner core runs from about 5,150 kilometers down to Earth\'s center, at about 6,371 kilometers.',
        'Place 3,500 kilometers on that list. It is greater than 2,900 and less than 5,150, so it falls inside the outer core\'s range -- not the crust-and-mantle slice above it, and not the inner core below it.',
        'Attach the physical state that goes with that layer. Of the four layers, the outer core is the only one that is entirely liquid, so a sample from 3,500 kilometers should be molten metal, not solid rock.',
        'WRONG: "a depth of 3,500 kilometers must still be inside the mantle, because the mantle is the biggest layer." CORRECT: "the mantle being the thickest layer only means it covers the most kilometers of depth, from the surface down to about 2,900 kilometers -- past that point, greater depth belongs to the outer core no matter how thick the mantle is."',
        'Check this three different ways, since there is no arithmetic answer to redo here beyond the boundary numbers themselves. First, by position: 3,500 falls strictly between the outer core\'s two boundaries, 2,900 and 5,150. Second, by definition: molten iron-nickel material is exactly what the outer core is described as being, so a liquid sample at this depth is expected, not surprising. Third, by an internal-consistency check that does not depend on this one sample at all: add the crust-and-mantle depth of about 2,900 kilometers, the outer core\'s thickness of about 2,250 kilometers (5,150 minus 2,900), and the inner core\'s thickness of about 1,221 kilometers (6,371 minus 5,150). The total is exactly 6,371 kilometers -- Earth\'s full depth to the center, matching.',
        'Now change the depth and check that the answer moves with it. A sample from about 6,000 kilometers would be past the outer core\'s lower boundary of 5,150 kilometers, placing it in the inner core instead -- and the expected state flips from liquid back to solid, even though 6,000 kilometers is hotter than 3,500 kilometers, because the inner core stays solid despite the heat, on account of the pressure there.',
      ],
      answer:
        'The outer core. A depth of 3,500 kilometers falls between the outer core\'s boundaries of about 2,900 and about 5,150 kilometers, and the outer core is the one layer that is entirely liquid.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-crust-thickness',
      kind: 'worked_example',
      problem:
        'A drilling project below the ocean floor reaches a new, deeper rock layer after only about 7 kilometers. A separate project drilling down from a mountain range has to go down about 40 kilometers before reaching that same next layer. Both projects are drilling through the same layer of Earth the whole way. Which layer is it, and why does the required depth differ so much between the two locations?',
      steps: [
        'Identify the layer from what the problem describes: solid rock reached directly by drilling from the surface, sitting on top of whatever comes next. That is the crust -- the only layer people drill into directly.',
        'Compare both numbers to what is known about crust thickness. Oceanic crust runs about 5 to 10 kilometers thick, so needing about 7 kilometers to get through it under the ocean floor fits. Continental crust runs thicker, typically about 25 to 70 kilometers, so needing about 40 kilometers under a mountain range also fits.',
        'The difference is not a different layer -- it is the same layer, crust, at two different thicknesses. Oceanic crust is consistently thinner than continental crust.',
        'WRONG: "once a drill breaks through the crust, it should start pulling up liquid magma, because everything beneath the crust is a sea of melted rock." CORRECT: "beneath the crust is the mantle, which is solid rock almost everywhere -- only small, scattered pockets of it are actually melted into magma. A drill that reached the mantle would hit hot solid rock, not a sea of liquid."',
        'Check the crust answer three different ways. First, by definition: the crust is the layer described as reachable directly by drilling, which matches both projects. Second, by range: both measured depths, 7 kilometers and 40 kilometers, fall inside the known thickness ranges for oceanic and continental crust rather than in the thousands of kilometers that would signal the mantle or deeper. Third, by scale comparison: even the thicker, 40-kilometer reading is a tiny fraction of the mantle\'s roughly 2,900-kilometer span, so neither reading is close to large enough to already be inside the mantle.',
        'Now change one condition and check that the answer moves. If a drill somehow reached a depth of 2,000 kilometers, it would no longer be in the crust under any measurement in this lesson -- the crust never gets anywhere near that thick, so at that depth the drill would have to be well into the mantle instead.',
      ],
      answer:
        'Both are drilling through the crust. Oceanic crust (about 5 to 10 kilometers thick) is thinner than continental crust (about 25 to 70 kilometers thick), which is why the ocean-floor project reaches the next layer after only about 7 kilometers while the mountain-range project needs about 40 kilometers.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-order-of-layers',
      kind: 'try_yourself',
      problem: 'Starting at Earth\'s surface and moving straight down to the center, what is the correct order of Earth\'s four layers?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Crust, then mantle, then outer core, then inner core -- each layer sits farther from the surface and closer to the center than the one before it, ending at Earth\'s very middle.', correct: true },
        { id: 'b', text: 'Crust, then outer core, then mantle, then inner core -- because a liquid layer is pictured sitting right beneath the thin solid crust, before reaching the much thicker mantle underneath.' },
        { id: 'c', text: 'Mantle, then crust, then inner core, then outer core -- because the mantle is mistaken for the surface layer people live on, and the hottest layer is placed at the very center before a cooler one around it.' },
        { id: 'd', text: 'Crust, then mantle, then inner core, then outer core -- because the word inner sounds like it should be the layer closer to the surface, and outer sounds like it should be farther away.' },
      ],
      expectedAnswer: 'Crust, then mantle, then outer core, then inner core -- each layer sits farther from the surface and closer to the center than the one before it, ending at Earth\'s very middle.',
      hints: [
        'Start from the surface and go straight down. Which layer is a person literally standing on and able to dig into first?',
        'Of the two core layers, one is liquid and sits closer to the mantle, and one is solid and sits at the very center. Which name, inner or outer, goes with the one that is farther out, next to the mantle?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-liquid-layer',
      kind: 'try_yourself',
      problem: 'Which of Earth\'s four layers is entirely liquid, and how does that compare to the physical state of the other three?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mantle is entirely liquid, because it sits closest to the extreme heat of the outer core, and this lesson describes the mantle as a layer that can flow, which sounds like something only a liquid is able to do.' },
        { id: 'b', text: 'The outer core is entirely liquid; the crust and mantle are solid rock, though the mantle can flow very slowly over long spans of time, and the inner core is solid despite being the hottest layer, because the pressure there is great enough to keep the metal from melting.', correct: true },
        { id: 'c', text: 'The inner core is entirely liquid, because it is the single hottest of the four layers, and in everyday experience it is heat alone that melts a solid into a liquid, the same way heat melts ice or melts metal in a furnace.' },
        { id: 'd', text: 'Both the outer core and the inner core are entirely liquid, because they are made of the exact same iron-nickel material and sit right next to each other, so whatever state one of them is in, the other should logically match.' },
      ],
      expectedAnswer: 'The outer core is entirely liquid; the crust and mantle are solid rock, though the mantle can flow very slowly over long spans of time, and the inner core is solid despite being the hottest layer, because the pressure there is great enough to keep the metal from melting.',
      hints: [
        'Of the four layers, only one is described as entirely liquid. Start by ruling out the two layers this lesson calls solid rock.',
        'Being hot is not the same as being melted. What does this lesson say keeps the hottest layer of all from melting?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-depth-and-state',
      kind: 'try_yourself',
      problem:
        'A field report describes a sample as: "liquid, iron-rich material, collected from a depth of about 6,000 kilometers below Earth\'s surface." What is wrong with this description?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing is wrong; a depth of about 6,000 kilometers falls within the outer core, which is described as liquid.' },
        { id: 'b', text: 'Nothing is wrong; a depth of about 6,000 kilometers falls within the mantle, since the mantle is the thickest layer and is assumed to reach farther down than any of the other three.' },
        { id: 'c', text: 'The sample should be solid, not liquid; a depth of about 6,000 kilometers falls within the inner core, which stays solid because of the pressure there, unlike the liquid outer core above it.', correct: true },
        { id: 'd', text: 'Nothing is wrong; the deeper any part of Earth is, the more liquid it becomes, so the deepest samples should always be liquid.' },
      ],
      expectedAnswer: 'The sample should be solid, not liquid; a depth of about 6,000 kilometers falls within the inner core, which stays solid because of the pressure there, unlike the liquid outer core above it.',
      hints: [
        'List the two boundary numbers for the outer core: where it starts and where it ends. Is 6,000 kilometers inside that range, or past it?',
        'The mantle\'s thickness and the mantle\'s ending depth are two different numbers. Being the thickest layer does not mean it reaches the farthest down -- something else fills the space beyond it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mantle-and-core-heat',
      kind: 'misconception_check',
      question:
        'A student says: "Earth\'s mantle is basically a giant ocean of melted rock, and the very center of Earth must be the most liquid part of all, since it is the hottest." Two different things are wrong with that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Earth\'s mantle is basically a giant ocean of melted rock.',
          misconception:
            'Treating the mantle\'s slow, putty-like flow as the same thing as being liquid, and assuming that because the mantle is very hot, it must be melted through and through, like lava.',
          correctsTo:
            'The mantle is solid rock almost everywhere. It is hot enough and under enough pressure that, over thousands to millions of years, it can flow very slowly -- more like extremely stiff putty than like water or melted lava. Only small, scattered pockets of it actually melt into the magma that sometimes reaches the surface; the mantle as a whole stays solid.',
        },
        {
          answer: 'The very center of Earth must be the most liquid part of all, since it is the hottest.',
          misconception:
            'Assuming that temperature alone decides whether something is solid or liquid, so the hottest layer is expected to be the most melted.',
          correctsTo:
            'The inner core, at Earth\'s very center, is in fact solid, even though it is the hottest layer of the four. Pressure, not just heat, decides whether the iron-nickel metal there is solid or liquid, and the pressure at the center is great enough to keep it solid despite the extreme heat. The outer core, at a shallower depth and under less pressure, is the layer that is actually liquid.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Earth has four layers by composition, in order from the surface to the center: crust, mantle, outer core, inner core.',
        'The crust is the thinnest layer, solid rock, from about 5 kilometers thick under the ocean to about 70 kilometers thick under mountains.',
        'The mantle is the thickest layer by far, reaching down to about 2,900 kilometers. It is solid rock that can flow very slowly over long spans of time -- it is not a sea of liquid magma.',
        'The outer core is the only layer that is entirely liquid -- molten iron and nickel, from about 2,900 to about 5,150 kilometers deep.',
        'The inner core is solid, from about 5,150 kilometers deep to Earth\'s center at about 6,371 kilometers, even though it is the hottest layer of all -- the pressure there keeps the iron-nickel metal from melting.',
        'Temperature alone does not decide solid versus liquid inside Earth; pressure matters too.',
        'The mantle is the single thickest of Earth\'s four layers -- thicker than the crust, the outer core, or the inner core by itself -- though the outer core and inner core added together are actually a bit more than the mantle alone.',
        'The deepest hole anyone has ever drilled reaches only about 12 kilometers, and it did not even reach the bottom of the continental crust it was drilled into.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Earth\'s Layered Structure' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
