/**
 * Grade 6 Science — Unit 4 CED 4.2: Earth's Plates & Mantle Convection.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.earths-plates-and-mantle-convection.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U4_EARTHS_PLATES_AND_MANTLE_CONVECTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.earths-plates-and-mantle-convection.v1',
  course: 'Grade 6 Science',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: `Earth's Plates & Mantle Convection`,
  planId: 'evelyn.ms.m6sci.earths-plates-and-mantle-convection.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.earths-plates-and-mantle-convection.v1' }],
  theory: [
    { loId: 'm6sci.earths-plates-and-mantle-convection', content: `EARTH'S OUTER SHELL IS BROKEN INTO PLATES, NOT ONE SOLID PIECE. The lithosphere -- Earth's rigid outer layer, made of the crust plus the topmost part of the mantle -- is cracked into large, irregularly shaped pieces called tectonic plates. The cracks are not neat or evenly spaced the way a jigsaw puzzle is; some plates are enormous and some are much smaller, and the edges between them run in long, curving lines across both land and ocean floor.` },
    { loId: 'm6sci.earths-plates-and-mantle-convection', content: `PLATES REST ON THE ASTHENOSPHERE, WHICH IS SOLID ROCK, NOT LIQUID. Below the lithosphere sits the asthenosphere, a layer of the mantle that is solid rock but flows extremely slowly -- the way an extremely stiff, cold block of putty can be bent and reshaped over a long enough time without ever melting. The plates ride on top of this slowly flowing layer. WRONG: "The plates float on a sea of liquid magma." CORRECT: "The plates rest on solid rock that flows very slowly." Actual liquid magma exists only in scattered pockets, not as one ocean-sized layer under the whole planet.` },
    { loId: 'm6sci.earths-plates-and-mantle-convection', content: `A TECTONIC PLATE IS NOT THE SAME THING AS A CONTINENT. A single plate can carry a continent and a stretch of ocean floor together, as one connected slab. The North American Plate, for example, carries the entire continent of North America together with part of the floor of the Atlantic Ocean. Some plates, like the Pacific Plate -- one of the largest plates -- are almost entirely ocean floor, with no full continent riding on them at all. So a plate boundary and a coastline are two completely different lines, and they hardly ever line up.` },
    { loId: 'm6sci.earths-plates-and-mantle-convection', content: `MANTLE CONVECTION IS THE SLOW, REPEATING PATTERN OF MOTION THAT MOVES THE PLATES. Deep inside the mantle, solid rock shifts in a slow circulating pattern: material moves toward the base of the lithosphere, spreads out sideways for a very long distance, and eventually cycles back down again elsewhere, over spans of millions of years. This pattern, moving underneath the plates, drags the plates above it along -- somewhat the way a slow, thick current moving beneath a raft can carry the raft along with it. Energy from deep inside Earth is what drives this circulating motion, but exactly how that energy moves through the rock is not covered here -- that mechanism belongs to a later grade.` },
    { loId: 'm6sci.earths-plates-and-mantle-convection', content: `THE MOTION IS EXTREMELY SLOW, BUT IT ADDS UP OVER HUGE AMOUNTS OF TIME. Plates typically move only a few centimeters a year -- roughly the rate an average fingernail grows. Different plates move at different speeds and in different directions, and what happens at the line where two plates meet is a separate topic. Even at only a few centimeters a year, that motion adds up to a real, measurable distance once enough time passes -- which is exactly what the next problem works out.` },
    { loId: 'm6sci.earths-plates-and-mantle-convection', kind: 'definition', title: 'lithosphere', content: `Earth's rigid outer layer, made of the crust plus the topmost part of the mantle, broken into tectonic plates.` },
    { loId: 'm6sci.earths-plates-and-mantle-convection', kind: 'definition', title: 'asthenosphere', content: `the layer of the mantle below the lithosphere; solid rock that flows extremely slowly.` },
    { loId: 'm6sci.earths-plates-and-mantle-convection', kind: 'definition', title: 'mantle', content: 'the thick layer of Earth between the crust and the core.' },
    { loId: 'm6sci.earths-plates-and-mantle-convection', kind: 'definition', title: 'tectonic plate', content: 'a large slab of lithosphere that moves slowly over the asthenosphere.' },
    { loId: 'm6sci.earths-plates-and-mantle-convection', kind: 'definition', title: 'mantle convection', content: `the slow, circulating pattern of motion in the mantle that carries the plates above it along.` },
  ],
  methods: [
    {
      title: 'Worked plate motion distance',
      steps: [
        `Write the duration as an ordinary number first, so the multiplication is easy to check: 10 million years = 10,000,000 years.`,
        `Multiply the yearly rate by the number of years: 4 cm/year x 10,000,000 years = 40,000,000 cm.`,
        `Convert centimeters to meters by dividing by 100, since there are 100 centimeters in a meter: 40,000,000 cm / 100 = 400,000 m.`,
        `Convert meters to kilometers by dividing by 1,000, since there are 1,000 meters in a kilometer: 400,000 m / 1,000 = 400 km.`,
        `State the result plainly, and name the trap it avoids: 4 cm a year over 10 million years is 400 kilometers -- a distance you could drive across in a day, not "thousands of kilometers." A small yearly number multiplied by a huge number of years is exactly where it is easy to lose track of a zero or two, which is why writing out each conversion step, the way this problem just did, is what catches that.`,
        `Before moving on, name what is powering this without overstepping it: the two plates are drifting apart at all because of the same slow circulating pattern described earlier, mantle convection, driven by energy from deep inside Earth. This problem is about how far that slow motion adds up to over time, not about what powers it underneath.`,
        `Now run the two checks a science answer needs, since there is no answer key to check against and no shadow diagram to redraw. First, look for clues of DIFFERENT KINDS that agree. A unit check: multiplying centimeters-per-year by years leaves plain centimeters, which is the unit the whole calculation started in, so the conversion direction was right. A scale check: 4 centimeters is about the width of a grape, and 10 million is an enormous number of repetitions, so landing in the hundreds-of-kilometers range -- not meters, and not tens of thousands of kilometers -- is a reasonable place for a huge number of tiny steps to land. An everyday comparison: 400 kilometers is roughly the distance between two cities you might drive between in a single day, not the width of an ocean. Three different kinds of check, one answer.`,
        `Second, change one number and confirm the answer moves the way it should. If the same two plates spread apart twice as fast, at 8 centimeters per year, the same 10 million years gives twice the distance: 8 cm/year x 10,000,000 years = 80,000,000 cm = 800,000 m = 800 km. Doubling the rate doubled the distance, which is exactly what a steady yearly rate multiplied by a fixed amount of time should do.`,
      ],
      example: { problem: `Instruments on either side of an ocean basin show that two neighboring plates are spreading apart at about 4 centimeters per year. About how many kilometers wider will the gap between them be after 10 million years?`, solution: `About 400 kilometers wider after 10 million years (4 cm/year x 10,000,000 years = 40,000,000 cm = 400,000 m = 400 km).` },
      relatedLoIds: ['m6sci.earths-plates-and-mantle-convection'],
    },
    {
      title: 'Worked plate versus continent',
      steps: [
        `Start from the definition, not the mental picture. A tectonic plate is a slab of lithosphere -- Earth's rigid outer layer -- not another name for a landmass.`,
        `Ask whether a slab of lithosphere has to be made only of continental crust, or whether it can carry both continental crust and ocean floor together. It can carry both, because both kinds of crust simply sit on top of the same rigid slab.`,
        `Apply that to North America specifically. The North American Plate carries the entire continent of North America together with a large stretch of the floor of the Atlantic Ocean, as one connected piece of lithosphere. WRONG: "The plate ends at the coastline, where the continent meets the ocean." CORRECT: "The plate's true edge is far out in the ocean, well past the coastline, where the North American Plate meets its neighboring plate."`,
        `So the coastline is not a plate boundary at all. It is simply the line where dry land happens to end and ocean water happens to begin, on top of a single plate that keeps going underneath both.`,
        `Now run the two checks a science answer needs. First, three clues of different kinds that agree. A definitional clue: the definition of a plate is built on the lithosphere, not on "dry land," so anything resting on that slab is part of the same plate. A comparison clue: the Pacific Plate, one of Earth's largest, is almost entirely ocean floor with no full continent riding on it at all -- proof that plates and continents are not matched to each other one for one. A consistency clue: the continent and the neighboring stretch of ocean floor move together, as a single unit, rather than drifting independently of each other -- which is exactly what is expected if they are one connected object and not two separate ones sitting side by side.`,
        `Second, change one detail and check the idea still holds up. Suppose a plate really did end at the coastline. Then the ocean floor next to every single coastline on Earth would need its own separate plate, floating independently right up against the edge of the continent's plate. That does not match what is actually found: large stretches of ocean floor sit on the very same plate as the continent beside them, moving together as that plate moves.`,
      ],
      example: { problem: `A student describes Earth's plates this way: "North America is a plate, and the plate ends where the continent's coastline meets the ocean." Evaluate that description using what a tectonic plate actually is.`, solution: `The description is wrong. A tectonic plate is not the same thing as a continent and does not end at a coastline. The North American Plate carries the whole continent of North America together with part of the floor of the Atlantic Ocean, as one single, connected slab of lithosphere.` },
      relatedLoIds: ['m6sci.earths-plates-and-mantle-convection'],
    },
  ],
  pointers: [
    { content: `Students often say "The plates are like rafts floating on a giant ocean of melted rock." — The asthenosphere -- the layer the plates rest on -- is solid rock, not melted rock. It flows extremely slowly, the way a very stiff, cold block of putty can bend and reshape over a long enough time without ever melting. Actual liquid magma exists in scattered pockets in the crust and mantle, not as one continuous ocean-sized layer beneath every plate.`, kind: 'common-error' },
    { content: `Students often say "A plate is just another word for a continent." — A plate is a slab of lithosphere, and a single plate can carry a continent and a stretch of ocean floor together as one connected piece. The North American Plate, for instance, carries the entire continent of North America along with part of the floor of the Atlantic Ocean. A plate boundary and a coastline are two different lines, and they rarely match up.`, kind: 'common-error' },
    { content: `Earth's lithosphere is cracked into large, irregularly shaped pieces called tectonic plates.`, kind: 'tip' },
    { content: `Plates rest on the asthenosphere, a layer of SOLID mantle rock that flows extremely slowly -- not a layer of liquid magma.`, kind: 'tip' },
    { content: `A tectonic plate is not the same thing as a continent. A single plate can carry a continent and a stretch of ocean floor together.`, kind: 'tip' },
    { content: `Mantle convection is the slow, circulating pattern of motion deep in the mantle that carries the plates above it along.`, kind: 'tip' },
    { content: `What drives that circulating motion is energy from deep inside Earth; exactly how that energy moves through the rock is a topic for a later grade.`, kind: 'tip' },
    { content: `Plates typically move only a few centimeters a year, but that motion adds up to hundreds of kilometers over millions of years.`, kind: 'tip' },
    { content: `Different plates move at different speeds and in different directions -- what happens where two plates meet is the next lesson.`, kind: 'tip' },
    { content: `Don't say 'the plates float on liquid magma.' The asthenosphere is SOLID rock that flows slowly—like stiff putty bending over time, not melted rock. Actual magma is only in scattered pockets.`, kind: 'common-error' },
    { content: `Coastlines and plate boundaries are NOT the same line. North America's coastline is on TOP of the North American Plate, but the plate's real edge is far out in the Atlantic Ocean. A continent and ocean floor can sit on one plate together.`, kind: 'gotcha' },
    { content: `When you multiply a tiny yearly rate by millions of years, track every zero carefully. Write out 10 million as 10,000,000 before multiplying, then convert step-by-step (÷100, ÷1000). One lost zero makes your answer wrong by a whole order of magnitude.`, kind: 'tip' },
    { content: `A tectonic plate = a slab of lithosphere, NOT a continent. The Pacific Plate has almost no continent on it—just ocean floor. Plates and continents are separate things that don't line up one-to-one.`, kind: 'vocab-note' },
    { content: `Mantle convection is the MOTION PATTERN itself (solid rock circulating slowly), not the energy or heat that powers it. Say what the pattern does, not what makes it happen—that mechanism is Grade 8 science.`, kind: 'vocab-note' },
    { content: `Few centimeters per year sounds tiny, but 10 million years is enormous. Always check your answer makes sense: 4 cm/year over 10 million years should land in hundreds of kilometers (drivable in a day), not meters or thousands of km.`, kind: 'tip' },
    { content: `The lithosphere includes BOTH the crust AND the topmost part of the mantle—one rigid layer. This is why a plate can carry continental crust (land) and oceanic crust (seafloor) together as one piece.`, kind: 'edge-case' },
  ],
};
