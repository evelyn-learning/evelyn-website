/**
 * Grade 6 Science (Earth & Space Science) — Earth's Plates & Mantle Convection.
 *
 * CONCEPT-LED row for the m6sci fan-out (NGSS DCI ESS2.B), Unit 4 Topic 2. The
 * lesson builds one picture: Earth's rigid outer shell (the lithosphere) is
 * cracked into large plates, those plates rest on the asthenosphere -- solid
 * mantle rock that flows extremely slowly -- and a slow, repeating pattern of
 * motion inside the mantle, called mantle convection, is what carries the
 * plates along. The two traps it is built to kill are (a) picturing the
 * asthenosphere as an ocean of melted rock that the plates float on, and (b)
 * treating "plate" and "continent" as the same object.
 *
 * SCOPE GUARD: this plan describes WHAT moves (the plates), WHAT they move on
 * (the solid, flowing asthenosphere), and NAMES the pattern that moves them
 * (mantle convection, described as a slow circulating pattern of motion, with
 * energy from Earth's interior named as its driver at the Earth-system level
 * only -- the same level of description the fan-out contract's own scope
 * table licenses for "energy"). It never explains WHY the rock moves in that
 * pattern. The specific sentence this file deliberately does not write is the
 * natural next line after "material rises toward the plates, spreads out, and
 * sinks again elsewhere": "Hot rock rises because it is less dense than the
 * cooler rock around it, and sinks again as it cools and becomes denser."
 * That sentence would explain convection as a MECHANISM -- density as the
 * causal driver, which is really a statement about particle behavior and
 * energy transfer -- rather than describing it as an observed pattern of
 * motion, and it appears nowhere in this file, in the concept segment or
 * anywhere else. Also absent for the same reason: conduction, convection and
 * radiation taught as the three modes of heat transfer; any particle-level
 * account of density, expansion or heat flow; and the word "hot" used to
 * explain WHY material moves rather than just to describe the interior. That
 * mechanism is Grade 8 physical science.
 *   - GRADE 6 NEIGHBORS: row 4.1 (evidence for continental drift) is this
 *     row's prerequisite and is treated as already-covered ground -- no
 *     matching coastline, fossil, rock-layer or magnetic-stripe evidence
 *     appears anywhere in this file. Row 4.3 (types of plate boundaries) and
 *     row 4.4 (landforms built by plate motion) are not taught here: this
 *     file never classifies a boundary as convergent, divergent or transform,
 *     and never names a landform a boundary produces (no trench, mid-ocean
 *     ridge, rift valley, fold-mountain range or island arc).
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: covered above -- convection is named
 *     and described as a pattern of motion only, never as a heat-transfer
 *     mechanism, and density never appears as an explanation for anything in
 *     this file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every plate,
 * layer and comparison in this file is written out in words, and every item
 * is solvable from the text printed inside it. Never write "see the diagram
 * above", and never assume the student has a globe, a cross-section, or a
 * rock kit in front of them.
 *
 * NOTE ON ARITHMETIC: this row states a plate speed and a duration together,
 * which is the exact shape of an order-of-magnitude trap seen elsewhere in
 * this wave (a few centimeters a year over millions of years works out to
 * HUNDREDS of kilometers, not thousands). The first worked example writes the
 * multiplication and both unit conversions out in full for that reason.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U4_EARTHS_PLATES_AND_MANTLE_CONVECTION: LessonPlan = {
  id: 'evelyn.ms.m6sci.earths-plates-and-mantle-convection.v1',
  title: "Earth's Plates & Mantle Convection",
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.earths-plates-and-mantle-convection',
      standard: 'M6SCI-4.2',
      description:
        "Describe Earth's lithosphere as broken into plates that move atop the flowing asthenosphere, driven qualitatively by mantle convection, without teaching heat-transfer mechanisms or the physics of convective flow -- those mechanisms are Grade 8 physical science (DCI ESS2.B).",
    },
  ],
  prerequisites: ['m6sci.evidence-for-continental-drift'],
  followUps: ['m6sci.types-of-plate-boundaries'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the idea of an unnoticed slow crack in something the student has actually seen.',
      script:
        'Think about a sidewalk or a driveway that has cracked into separate slabs over the years -- maybe with weeds growing up through one of the cracks, or with one slab sitting a little higher than the slab right next to it. Nobody watched the crack happen. It just happened, slowly, underneath everything else that was going on that day. Something similar is true of the ground under your entire town, and under every ocean on the planet, at the same time. Earth\'s solid outer shell is cracked into enormous slabs, called plates, and every single one of them is resting on something underneath that never actually stops moving -- even though nobody standing on top of it can feel a thing. Today you find out what that something is, and why the plates riding on it never really stop drifting, even a little, even right now.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-plates-and-convection',
      kind: 'concept',
      goal: "Build the plate/asthenosphere/convection picture, and stop exactly at the pattern of motion, not the mechanism behind it.",
      keyIdeas: [
        "EARTH'S OUTER SHELL IS BROKEN INTO PLATES, NOT ONE SOLID PIECE. The lithosphere -- Earth's rigid outer layer, made of the crust plus the topmost part of the mantle -- is cracked into large, irregularly shaped pieces called tectonic plates. The cracks are not neat or evenly spaced the way a jigsaw puzzle is; some plates are enormous and some are much smaller, and the edges between them run in long, curving lines across both land and ocean floor.",
        'PLATES REST ON THE ASTHENOSPHERE, WHICH IS SOLID ROCK, NOT LIQUID. Below the lithosphere sits the asthenosphere, a layer of the mantle that is solid rock but flows extremely slowly -- the way an extremely stiff, cold block of putty can be bent and reshaped over a long enough time without ever melting. The plates ride on top of this slowly flowing layer. WRONG: "The plates float on a sea of liquid magma." CORRECT: "The plates rest on solid rock that flows very slowly." Actual liquid magma exists only in scattered pockets, not as one ocean-sized layer under the whole planet.',
        'A TECTONIC PLATE IS NOT THE SAME THING AS A CONTINENT. A single plate can carry a continent and a stretch of ocean floor together, as one connected slab. The North American Plate, for example, carries the entire continent of North America together with part of the floor of the Atlantic Ocean. Some plates, like the Pacific Plate -- one of the largest plates -- are almost entirely ocean floor, with no full continent riding on them at all. So a plate boundary and a coastline are two completely different lines, and they hardly ever line up.',
        "MANTLE CONVECTION IS THE SLOW, REPEATING PATTERN OF MOTION THAT MOVES THE PLATES. Deep inside the mantle, solid rock shifts in a slow circulating pattern: material moves toward the base of the lithosphere, spreads out sideways for a very long distance, and eventually cycles back down again elsewhere, over spans of millions of years. This pattern, moving underneath the plates, drags the plates above it along -- somewhat the way a slow, thick current moving beneath a raft can carry the raft along with it. Energy from deep inside Earth is what drives this circulating motion, but exactly how that energy moves through the rock is not covered here -- that mechanism belongs to a later grade.",
        'THE MOTION IS EXTREMELY SLOW, BUT IT ADDS UP OVER HUGE AMOUNTS OF TIME. Plates typically move only a few centimeters a year -- roughly the rate an average fingernail grows. Different plates move at different speeds and in different directions, and what happens at the line where two plates meet is a separate topic. Even at only a few centimeters a year, that motion adds up to a real, measurable distance once enough time passes -- which is exactly what the next problem works out.',
      ],
      vocabulary: [
        { term: 'lithosphere', definition: "Earth's rigid outer layer, made of the crust plus the topmost part of the mantle, broken into tectonic plates." },
        { term: 'asthenosphere', definition: 'the layer of the mantle below the lithosphere; solid rock that flows extremely slowly.' },
        { term: 'mantle', definition: 'the thick layer of Earth between the crust and the core.' },
        { term: 'tectonic plate', definition: 'a large slab of lithosphere that moves slowly over the asthenosphere.' },
        { term: 'mantle convection', definition: 'the slow, circulating pattern of motion in the mantle that carries the plates above it along.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-plate-motion-distance',
      kind: 'worked_example',
      problem:
        'Instruments on either side of an ocean basin show that two neighboring plates are spreading apart at about 4 centimeters per year. About how many kilometers wider will the gap between them be after 10 million years?',
      steps: [
        'Write the duration as an ordinary number first, so the multiplication is easy to check: 10 million years = 10,000,000 years.',
        'Multiply the yearly rate by the number of years: 4 cm/year x 10,000,000 years = 40,000,000 cm.',
        'Convert centimeters to meters by dividing by 100, since there are 100 centimeters in a meter: 40,000,000 cm / 100 = 400,000 m.',
        'Convert meters to kilometers by dividing by 1,000, since there are 1,000 meters in a kilometer: 400,000 m / 1,000 = 400 km.',
        'State the result plainly, and name the trap it avoids: 4 cm a year over 10 million years is 400 kilometers -- a distance you could drive across in a day, not "thousands of kilometers." A small yearly number multiplied by a huge number of years is exactly where it is easy to lose track of a zero or two, which is why writing out each conversion step, the way this problem just did, is what catches that.',
        'Before moving on, name what is powering this without overstepping it: the two plates are drifting apart at all because of the same slow circulating pattern described earlier, mantle convection, driven by energy from deep inside Earth. This problem is about how far that slow motion adds up to over time, not about what powers it underneath.',
        'Now run the two checks a science answer needs, since there is no answer key to check against and no shadow diagram to redraw. First, look for clues of DIFFERENT KINDS that agree. A unit check: multiplying centimeters-per-year by years leaves plain centimeters, which is the unit the whole calculation started in, so the conversion direction was right. A scale check: 4 centimeters is about the width of a grape, and 10 million is an enormous number of repetitions, so landing in the hundreds-of-kilometers range -- not meters, and not tens of thousands of kilometers -- is a reasonable place for a huge number of tiny steps to land. An everyday comparison: 400 kilometers is roughly the distance between two cities you might drive between in a single day, not the width of an ocean. Three different kinds of check, one answer.',
        'Second, change one number and confirm the answer moves the way it should. If the same two plates spread apart twice as fast, at 8 centimeters per year, the same 10 million years gives twice the distance: 8 cm/year x 10,000,000 years = 80,000,000 cm = 800,000 m = 800 km. Doubling the rate doubled the distance, which is exactly what a steady yearly rate multiplied by a fixed amount of time should do.',
      ],
      answer:
        'About 400 kilometers wider after 10 million years (4 cm/year x 10,000,000 years = 40,000,000 cm = 400,000 m = 400 km).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-plate-versus-continent',
      kind: 'worked_example',
      problem:
        "A student describes Earth's plates this way: \"North America is a plate, and the plate ends where the continent's coastline meets the ocean.\" Evaluate that description using what a tectonic plate actually is.",
      steps: [
        'Start from the definition, not the mental picture. A tectonic plate is a slab of lithosphere -- Earth\'s rigid outer layer -- not another name for a landmass.',
        'Ask whether a slab of lithosphere has to be made only of continental crust, or whether it can carry both continental crust and ocean floor together. It can carry both, because both kinds of crust simply sit on top of the same rigid slab.',
        "Apply that to North America specifically. The North American Plate carries the entire continent of North America together with a large stretch of the floor of the Atlantic Ocean, as one connected piece of lithosphere. WRONG: \"The plate ends at the coastline, where the continent meets the ocean.\" CORRECT: \"The plate's true edge is far out in the ocean, well past the coastline, where the North American Plate meets its neighboring plate.\"",
        'So the coastline is not a plate boundary at all. It is simply the line where dry land happens to end and ocean water happens to begin, on top of a single plate that keeps going underneath both.',
        'Now run the two checks a science answer needs. First, three clues of different kinds that agree. A definitional clue: the definition of a plate is built on the lithosphere, not on "dry land," so anything resting on that slab is part of the same plate. A comparison clue: the Pacific Plate, one of Earth\'s largest, is almost entirely ocean floor with no full continent riding on it at all -- proof that plates and continents are not matched to each other one for one. A consistency clue: the continent and the neighboring stretch of ocean floor move together, as a single unit, rather than drifting independently of each other -- which is exactly what is expected if they are one connected object and not two separate ones sitting side by side.',
        'Second, change one detail and check the idea still holds up. Suppose a plate really did end at the coastline. Then the ocean floor next to every single coastline on Earth would need its own separate plate, floating independently right up against the edge of the continent\'s plate. That does not match what is actually found: large stretches of ocean floor sit on the very same plate as the continent beside them, moving together as that plate moves.',
      ],
      answer:
        "The description is wrong. A tectonic plate is not the same thing as a continent and does not end at a coastline. The North American Plate carries the whole continent of North America together with part of the floor of the Atlantic Ocean, as one single, connected slab of lithosphere.",
      estimatedMinutes: 4,
    },
    {
      id: 'try-what-plates-rest-on',
      kind: 'try_yourself',
      problem: "Which statement correctly describes what Earth's tectonic plates rest on and move over?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A layer of liquid magma that the plates float across freely, the way a raft floats on a lake.' },
        { id: 'b', text: "Earth's solid inner core, which very slowly changes position over millions of years." },
        { id: 'c', text: 'The asthenosphere, a layer of solid mantle rock that flows extremely slowly beneath the plates.', correct: true },
        { id: 'd', text: 'Open ocean water, which lets whole continents drift freely across the seafloor over time.' },
      ],
      expectedAnswer: 'The asthenosphere, a layer of solid mantle rock that flows extremely slowly beneath the plates.',
      hints: [
        "Start with what 'solid' versus 'liquid' would mean for something plates could rest on. Does 'flows very slowly' have to mean 'melted'?",
        'Whatever the plates rest on has to be able to drag them along steadily for millions of years. Ocean water and the deep inner core do not fit that job -- which layer of the mantle does?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-drives-the-motion',
      kind: 'try_yourself',
      problem: "What best describes mantle convection, the process that drives the slow motion of Earth's plates?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mantle rock heats up until it turns into a gas, and the expanding gas pushes the plates apart from below.' },
        { id: 'b', text: 'Earthquakes shake the plates loose from the mantle beneath them, which is what lets the plates start sliding.' },
        { id: 'c', text: 'Surface currents in the ocean push against the edges of the continents and slowly carry them along.' },
        { id: 'd', text: 'Solid rock deep in the mantle moves in a slow, circulating pattern, and that pattern carries the plates above it along.', correct: true },
      ],
      expectedAnswer: 'Solid rock deep in the mantle moves in a slow, circulating pattern, and that pattern carries the plates above it along.',
      hints: [
        'The correct description only claims what this lesson actually covered: a pattern of motion in solid mantle rock. Rule out any answer that turns the rock into a gas, blames a sudden event, or points to the ocean surface.',
        'Ask which answer describes rock deep inside Earth moving in a slow loop over millions of years -- not something sudden, and not something happening only at the surface.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plate-versus-continent',
      kind: 'try_yourself',
      problem:
        'The North American Plate carries the entire continent of North America. Which additional statement about that same plate is also correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The plate also carries part of the floor of the Atlantic Ocean, as one connected piece of lithosphere.', correct: true },
        { id: 'b', text: "The plate ends exactly at the coastline, where the continent's dry land meets the ocean." },
        { id: 'c', text: 'Only the continental crust belongs to the plate; the nearby ocean floor is not part of any plate at all.' },
        { id: 'd', text: 'The plate is a separate object floating underneath the continent, not attached to it.' },
      ],
      expectedAnswer: 'The plate also carries part of the floor of the Atlantic Ocean, as one connected piece of lithosphere.',
      hints: [
        'Go back to what actually defines a plate: it is a slab of lithosphere, not a name for the land sitting on top of it.',
        'Ask whether a slab of lithosphere has to stop being one connected slab just because dry land turns into ocean floor at the coastline.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-magma-raft-and-plate-equals-continent',
      kind: 'misconception_check',
      question:
        'A student writes: "The plates are like rafts floating on a giant ocean of melted rock, and North America counts as one plate because a plate is just another word for a continent." Two separate things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'The plates are like rafts floating on a giant ocean of melted rock.',
          misconception:
            "Treating the word 'flows' as a synonym for 'melted,' and picturing the layer under the plates as one giant ocean of melted rock because that is the only mental picture of 'something plates float on' that comes easily to mind.",
          correctsTo:
            'The asthenosphere -- the layer the plates rest on -- is solid rock, not melted rock. It flows extremely slowly, the way a very stiff, cold block of putty can bend and reshape over a long enough time without ever melting. Actual liquid magma exists in scattered pockets in the crust and mantle, not as one continuous ocean-sized layer beneath every plate.',
        },
        {
          answer: 'A plate is just another word for a continent.',
          misconception:
            'Assuming the plate and the landmass sitting on top of it are the same object, because the continent is the part a person can see and stand on, so it feels like the whole thing.',
          correctsTo:
            'A plate is a slab of lithosphere, and a single plate can carry a continent and a stretch of ocean floor together as one connected piece. The North American Plate, for instance, carries the entire continent of North America along with part of the floor of the Atlantic Ocean. A plate boundary and a coastline are two different lines, and they rarely match up.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Earth's lithosphere is cracked into large, irregularly shaped pieces called tectonic plates.",
        'Plates rest on the asthenosphere, a layer of SOLID mantle rock that flows extremely slowly -- not a layer of liquid magma.',
        'A tectonic plate is not the same thing as a continent. A single plate can carry a continent and a stretch of ocean floor together.',
        'Mantle convection is the slow, circulating pattern of motion deep in the mantle that carries the plates above it along.',
        'What drives that circulating motion is energy from deep inside Earth; exactly how that energy moves through the rock is a topic for a later grade.',
        'Plates typically move only a few centimeters a year, but that motion adds up to hundreds of kilometers over millions of years.',
        'Different plates move at different speeds and in different directions -- what happens where two plates meet is the next lesson.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: "Earth's Plates & Mantle Convection" },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
