/**
 * Grade 6 Science (Earth & Space Science) — Plate Tectonics: Landforms Built
 * by Plate Motion.
 *
 * CONCEPT-LED row for the m6sci fan-out (NGSS MS-ESS2-2). Row 4.3 (types of
 * plate boundaries) classifies convergent, divergent and transform
 * boundaries by the direction plates move; this row classifies the SURFACE
 * PRODUCTS those boundaries build. The skill is the connection, not the
 * vocabulary: given a boundary's direction and the crust each plate carries,
 * predict which of five named landforms results, and given a description of
 * a landform, work backward to the boundary that must have built it.
 *
 * The load-bearing idea is DENSITY. At a convergent boundary, whichever
 * plate is denser is the one that bends down and sinks (subducts); if the
 * two plates are close enough in density that neither can subduct, the
 * collision has nowhere to go but up. That one rule produces three of this
 * row's five landforms once it is crossed with crust type (continental vs.
 * oceanic): continental-continental convergence with no subduction builds
 * fold mountains; oceanic-oceanic convergence with one plate subducting
 * builds a trench where it bends down and a volcanic island arc where
 * melted rock breaks through the plate riding above it. The other two
 * landforms are the divergent mirror of the same crust-type split, where
 * nothing subducts at all: oceanic-oceanic divergence builds a mid-ocean
 * ridge, and continental-continental divergence builds a rift valley.
 *
 * SCOPE GUARD: this plan matches five named landforms — fold mountains,
 * ocean trench, mid-ocean ridge, rift valley, and volcanic island arc — to
 * the plate-boundary direction (convergent or divergent) and crust-density
 * combination (continental-continental or oceanic-oceanic) that builds
 * each one.
 *   - Row 4.3 (types of plate boundaries) owns the classification of
 *     convergent, divergent and transform boundaries by direction of
 *     motion. This plan assumes that classification is already available
 *     and does not re-teach it; the one sentence in keyIdea 1 that names
 *     all three boundary types exists only to rule transform OUT as a
 *     landform-builder for this lesson, since none of the five landforms
 *     here comes from a transform boundary.
 *   - Row 4.2 (Earth's plates and mantle convection) owns mantle convection
 *     as the driver of plate motion. That mechanism is not named anywhere
 *     in this file; plate motion is simply given as a premise in each item.
 *   - VOLCANOES appear in this file only as a landform-BUILDING PROCESS —
 *     melted rock rising above a sinking plate to build a volcanic island
 *     arc — never as a hazard. Eruption danger, monitoring, and the
 *     geographic pattern of past eruptions used to assess risk today belong
 *     to Unit 9 (`mapping-geologic-hazards`) and do not appear here.
 *   - EARTHQUAKES do not appear anywhere in this file, in any framing.
 *     Transform boundaries are named once, for direction of motion only;
 *     nothing about the shaking or hazard a transform boundary produces is
 *     described, because that too belongs to Unit 9.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: density is used only as a
 *     comparison that decides which plate subducts (oceanic crust is
 *     denser than continental crust); density is never computed as mass
 *     divided by volume. No force law, energy value, or heat-transfer
 *     mechanism (conduction, convection, radiation as named modes) appears
 *     anywhere in this file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * boundary in this file is described in words precise enough that the
 * boundary type and crust combination can be inferred from the text alone
 * — direction of motion, what kind of crust each plate carries, and
 * (where it matters) the relative density of the two plates are always
 * stated directly rather than left to a diagram.
 *
 * NOTE ON RATES: this row deliberately makes no arithmetic claim about how
 * fast plates move or how large a landform becomes over time. "Slow" and
 * "over millions of years" are used only as qualitative context, never as
 * a rate multiplied by a duration, to stay clear of the order-of-magnitude
 * trap this wave has already caught elsewhere in unit-4-shaped content.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U4_LANDFORMS_BUILT_BY_PLATE_MOTION: LessonPlan = {
  id: 'evelyn.ms.m6sci.landforms-built-by-plate-motion.v1',
  title: 'Landforms Built by Plate Motion',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.landforms-built-by-plate-motion',
      standard: 'M6SCI-4.4',
      description:
        'Match a named landform (fold mountains, ocean trench, mid-ocean ridge, rift valley, volcanic island arc) to the plate-boundary type and rock-density combination that produces it (shares MS-ESS2-2 with Topic 3: that lesson classifies boundary types, this one classifies their surface products).',
    },
  ],
  prerequisites: ['m6sci.types-of-plate-boundaries'],
  followUps: ['m6sci.relative-dating-and-rock-layers'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from the puzzle that the same kind of event -- two plates meeting -- builds completely different landforms.',
      script:
        'Somewhere on Earth right now, two giant slabs of rock are pushing straight into each other, and the ground between them is being pushed higher every year. Somewhere else, two other giant slabs are also pushing straight into each other -- and the ground there is sinking into one of the deepest trenches on the planet. Same basic event. Two plates meeting head on. Completely opposite result: one place gets taller, the other gets a hole in the ocean floor deep enough to swallow the tallest mountain on Earth with room to spare. That is not a coincidence and it is not random. Something about each collision decides which of those two things happens, and by the end of this lesson you will be able to look at a description of any plate boundary and say exactly which landform it builds.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-landforms',
      kind: 'concept',
      goal: 'Build the density-plus-crust-type rule that predicts which of the five landforms a boundary builds, covering both convergent outcomes and both divergent outcomes.',
      keyIdeas: [
        'TWO DIRECTIONS BUILD LANDFORMS HERE. A convergent boundary pushes two plates together. A divergent boundary pulls two plates apart. A transform boundary slides two plates past each other and does not build any of the landforms in this lesson. Which landform a convergent or divergent boundary builds also depends on what kind of crust each plate carries into it -- continental or oceanic -- and, at a convergent boundary, on which of the two plates is denser.',
        'DENSITY DECIDES WHAT HAPPENS AT A SQUEEZE. Oceanic crust is denser than continental crust. At a convergent boundary, the denser of the two plates is the one that bends downward and sinks beneath the other -- that sinking is called subduction. If neither plate is clearly denser, as when two continental plates collide, neither one can sink.',
        'CONTINENTAL PLUS CONTINENTAL, CONVERGENT, BUILDS FOLD MOUNTAINS. Two plates carrying continental crust are close enough in density that neither can subduct. Pushed together with nowhere to sink, the rock crumples and stacks upward instead. The plate carrying India has been pushing into the plate carrying the rest of Asia this way for a very long time, and the Himalayas are still being pushed higher today by that ongoing collision.',
        'OCEANIC PLUS OCEANIC, CONVERGENT, BUILDS AN OCEAN TRENCH AND A VOLCANIC ISLAND ARC, TOGETHER. Between two slabs of ocean floor, one is always denser than the other. The denser one bends downward and sinks -- that bend is the ocean trench, one of the deepest kinds of place on Earth. As the sinking plate goes deeper, part of it and the rock around it melts, and that melted rock rises up through the plate riding above it and breaks out at the surface as volcanoes. Because the plate on top here is also ocean floor, those volcanoes build up from the sea floor as a curved chain of islands -- a volcanic island arc -- instead of as mountains on a continent. The Mariana Trench, one of the deepest points on Earth, and the Mariana Islands, a volcanic island arc, sit side by side because they are built by this exact pair.',
        'OCEANIC PLUS OCEANIC, DIVERGENT, BUILDS A MID-OCEAN RIDGE. Two ocean-floor plates pulling apart leave a widening gap, and nothing sinks here. Instead, magma rises up to fill the gap and hardens into new ocean-floor rock, building an underwater mountain chain right along the crack -- a mid-ocean ridge. The Mid-Atlantic Ridge runs the length of the Atlantic Ocean and is still adding new ocean floor there today.',
        'CONTINENTAL PLUS CONTINENTAL, DIVERGENT, BUILDS A RIFT VALLEY. Two plates carrying continental crust pulling apart stretch the land between them thin, and that stretched strip drops down into a valley with raised, cracked sides -- a rift valley, like the East African Rift. If a continental rift keeps widening for long enough, the low ground between the two plates can eventually sit below sea level. The Red Sea is a continental rift that widened until ocean water moved in.',
      ],
      vocabulary: [
        { term: 'fold mountains', definition: 'a mountain range built when two plates carrying crust of close to the same density push together and the rock crumples and stacks upward instead of one plate sinking beneath the other.' },
        { term: 'subduction', definition: 'when the denser of two colliding plates bends downward and sinks beneath the other plate.' },
        { term: 'ocean trench', definition: 'a long, deep valley in the ocean floor that marks the place where a denser plate bends downward and begins to subduct.' },
        { term: 'volcanic island arc', definition: 'a curved chain of volcanic islands built above a sinking oceanic plate, where melted rock rises through the plate riding on top and breaks out at the surface.' },
        { term: 'mid-ocean ridge', definition: 'an underwater mountain chain that forms where two ocean-floor plates pull apart and magma rises to fill the gap, hardening into new ocean-floor rock.' },
        { term: 'rift valley', definition: 'a valley with raised, cracked sides that forms where two plates carrying continental crust pull apart and the land between them stretches and drops.' },
      ],
      suggestedTools: ['show_diagram', 'show_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-collision-to-mountains',
      kind: 'worked_example',
      problem:
        'At one plate boundary, two plates are pushing straight into each other. Both plates are carrying continental crust, and that continental crust is close to the same density on both sides. Neither plate is diving beneath the other. What landform does this boundary build?',
      steps: [
        'Start with the direction of motion. Two plates pushing straight into each other is a convergent boundary.',
        'Check the density combo next. Both plates are continental, and their crust is close to the same density on both sides, so there is no clearly denser slab that could sink.',
        'Without a denser plate to sink, the collision cannot subduct. The incoming rock has nowhere to go but up, so both plates crumple and stack, thickening the crust and pushing it upward.',
        'That upward buckling of thick continental rock is a fold mountain range.',
        'Check the answer against a real case. The Himalayas are exactly this setup: the plate carrying India collided with the plate carrying the rest of Asia. Both are continental crust, neither has subducted beneath the other, and the range is still being pushed upward by that ongoing collision today.',
        'Run the two checks a science answer needs, since there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree: the density comparison says neither plate can sink; the direction of motion says the two plates are still pressing together, not sliding apart or past each other; and the real-world case (the Himalayas) shows exactly this outcome happening right now. Three different kinds of evidence, one answer.',
        'Second, change one condition and check that the answer moves. Suppose one of the two plates were carrying dense ocean floor instead of continental crust. The two slabs would no longer be close in density, the denser one could bend down and sink, and the boundary would build a trench instead of fold mountains. The answer moves when the density combo changes, which is how you know density is doing the real work here.',
      ],
      answer:
        'Fold mountains. Continental crust from the two plates is too close in density for either one to subduct, so the collision buckles the rock upward instead of sinking, the way the ongoing India-Asia collision continues to push up the Himalayas.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trench-and-arc',
      kind: 'worked_example',
      problem:
        'A curved chain of active volcanoes rises out of the middle of an ocean, built up island by island. Right alongside it runs one of the deepest trenches on the ocean floor. Both plates on either side of this boundary are made of ocean floor. What kind of boundary produced this pair of landforms, and why do they sit side by side?',
      steps: [
        'A trench and a chain of volcanic islands next to each other is not new crust being added at a widening gap -- it is the result of a squeeze. Start with a convergent boundary.',
        'WRONG: "The trench is just the place where the two plates happen to be farthest apart, like a wide gap between them." CORRECT: "The trench is the place where the denser of the two ocean plates bends sharply downward and begins to sink beneath the other. It is a squeeze point, not a gap."',
        'As the denser plate sinks deeper, part of it and the rock around it melts. That melted rock works its way up through the plate riding on top and breaks out at the surface as volcanoes.',
        'Because both plates here are ocean floor, the plate riding on top is also ocean floor, so the new volcanoes build up from the sea floor as a curved chain of islands -- a volcanic island arc -- rather than as mountains on a continent.',
        'Check the answer against a real case. The Mariana Trench, one of the deepest points on Earth, runs right alongside the Mariana Islands, a volcanic island arc. The trench marks where the denser plate sinks; the islands sit on the plate riding above it.',
        'Run the two checks together. Three clues of different kinds: the stated crust type (both ocean floor) rules out fold mountains, which need continental crust on both sides; the paired trench-and-arc shape rules out a single landform acting alone; and the real-world Mariana example matches the same paired pattern.',
        'Now change one condition. If the two plates were pulling apart instead of pushing together, nothing would be sinking and no melted rock would be rising through an overriding plate. Magma would simply well up into the widening gap and harden into new ocean floor, building a mid-ocean ridge instead of a trench and island arc. The paired trench-and-arc landform only shows up when plates converge, never when they diverge.',
      ],
      answer:
        'A convergent boundary between two ocean-floor plates. The denser plate sinks and forms the trench where it bends downward, and melted rock rising through the plate riding on top breaks out as a curved chain of volcanic islands, forming the arc alongside it.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-ridge-or-valley',
      kind: 'try_yourself',
      problem:
        'Two plates, both made of ocean floor, are slowly pulling apart from each other along a boundary. Magma rises up through the widening gap and hardens into new rock right along the crack. What landform is being built here, and where?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A mid-ocean ridge -- an underwater mountain chain built where two ocean-floor plates pull apart and magma rises to fill the gap, hardening into new ocean-floor rock along the crack.', correct: true },
        { id: 'b', text: 'A trench, because a trench forms when one ocean-floor plate bends downward and sinks beneath the other, and this boundary is between two ocean-floor plates, no matter which way they are moving.' },
        { id: 'c', text: 'A rift valley, because a rift valley forms when the land between two plates stretches and drops as the plates pull apart, and that is what is happening in this description.' },
        { id: 'd', text: 'A volcanic island arc, because a volcanic island arc forms when melted rock rises through the plate above a sinking slab and breaks out as a chain of islands, and that is what is happening here.' },
      ],
      expectedAnswer: 'A mid-ocean ridge -- an underwater mountain chain built where two ocean-floor plates pull apart and magma rises to fill the gap, hardening into new ocean-floor rock along the crack.',
      hints: [
        'Start with what the two plates are made of and which way they are moving. Is anything here described as sinking, or is everything simply moving apart?',
        'A mid-ocean ridge is what forms when ocean floor itself pulls apart and new ocean crust fills the gap. A rift valley is the land version of that same pulling-apart motion, and a trench and an island arc both need a plate sinking. Which crust type and which motion were stated in the problem?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-collision-outcome',
      kind: 'try_yourself',
      problem:
        'Two plates are pushing directly into each other along a boundary. Both plates are carrying continental crust, and that continental crust is close to the same density on both sides, so neither slab can sink beneath the other. What landform does this boundary build?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An ocean trench, because a trench forms when the denser of two colliding plates bends downward and sinks beneath the other, and that is the situation being described here.' },
        { id: 'b', text: 'Fold mountains, because with neither plate able to sink beneath the other, due to their similar density, the incoming rock has nowhere to go but up, and it crumples and stacks into a mountain range.', correct: true },
        { id: 'c', text: 'A mid-ocean ridge, because a mid-ocean ridge forms where two plates pull apart and new rock rises to fill the widening gap, and that is what is happening in this description.' },
        { id: 'd', text: 'A volcanic island arc, because a volcanic island arc forms where melted rock rises through the plate above a sinking ocean-floor slab and breaks out as a chain of islands, and that is what is happening in this description.' },
      ],
      expectedAnswer: 'Fold mountains, because with neither plate able to sink beneath the other, due to their similar density, the incoming rock has nowhere to go but up, and it crumples and stacks into a mountain range.',
      hints: [
        'Check the density clue in the problem first. Is one plate described as denser than the other here, or are the two close to the same density?',
        'If neither plate is able to sink beneath the other, the pushed-together rock still has to go somewhere. Which of these four outcomes does not require one plate diving under the other?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rift-or-ridge',
      kind: 'try_yourself',
      problem:
        'Two plates carrying continental crust are slowly pulling apart from each other along a boundary. The strip of land between them has dropped lower than the ground on either side, and cracks run along both edges of that lowered strip. What landform is this, and what is building it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Fold mountains, because fold mountains form when two plates carrying continental crust collide and neither one can sink beneath the other, and that is the kind of boundary described here.' },
        { id: 'b', text: 'An ocean trench, because a trench forms where the denser of two colliding plates bends downward and sinks beneath the other, and that is the situation being described here.' },
        { id: 'c', text: 'A rift valley, because a rift valley forms when the continental crust between two plates stretches thin and drops down as the plates pull apart, and that is what is happening in this description.', correct: true },
        { id: 'd', text: 'A mid-ocean ridge, because a mid-ocean ridge forms where two ocean-floor plates pull apart and magma hardens into new ocean-floor rock filling the gap, and that is what is happening in this description.' },
      ],
      expectedAnswer: 'A rift valley, because a rift valley forms when the continental crust between two plates stretches thin and drops down as the plates pull apart, and that is what is happening in this description.',
      hints: [
        'Two facts are given here: what kind of crust this is, and which way the two plates are moving. Check both before deciding.',
        'The crust is continental, not ocean floor, and the plates are described as pulling apart, not pushing together. Which landform needs exactly that combination?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-convergent-can-go-either-way',
      kind: 'misconception_check',
      question:
        'A student says: "Pushing two plates together should always push the ground UP, so a deep trench cannot come from squeezing plates together -- it must be a stretched-apart, divergent boundary instead." What is wrong with this reasoning, and what else does it get wrong about how new land forms?',
      commonErrors: [
        {
          answer: 'A trench must come from a divergent boundary, because convergent boundaries only build things upward.',
          misconception:
            'Treating "convergent" as always meaning "the ground goes up" and missing that the density of the two plates, not just the direction of push, decides whether a convergent boundary builds a mountain range or a trench.',
          correctsTo:
            'A convergent boundary can build either outcome, and the density of the two plates decides which one. Two continental plates close in density cannot subduct, so they buckle upward into fold mountains. Two ocean-floor plates are never quite the same density, so the denser one subducts and bends downward -- and that bend is the trench. The direction of push, together, is the same in both cases; the density combo is what changes the result.',
        },
        {
          answer: 'A volcanic island arc sitting next to a trench must mean new crust is being created there, the same way a mid-ocean ridge creates new crust.',
          misconception:
            'Assuming that wherever a new-looking landform, such as a chain of volcanic islands, is being built, new crust must also be forming there, and missing that a subduction zone destroys old crust rather than creating it.',
          correctsTo:
            'New crust is created only at a divergent boundary, where magma rises to fill a widening gap, as at a mid-ocean ridge. At a convergent, ocean-floor boundary, the old, denser plate is being subducted, not created. The volcanic islands built above it are made from melted rock recycled out of the sinking plate and the mantle around it, not from newly created ocean floor.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A convergent boundary pushes plates together; a divergent boundary pulls them apart. A transform boundary slides plates past each other and does not build the landforms in this lesson.',
        'Oceanic crust is denser than continental crust, and at a convergent boundary the denser plate is the one that bends down and subducts.',
        'Continental plus continental, convergent, with neither plate able to subduct, builds fold mountains -- the Himalayas are being pushed up this way right now.',
        'Oceanic plus oceanic, convergent, builds an ocean trench where the denser plate sinks, and a volcanic island arc where melted rock rises through the plate above it -- the Mariana Trench and Mariana Islands are exactly this pair.',
        'Oceanic plus oceanic, divergent, builds a mid-ocean ridge, where magma fills the widening gap and hardens into new ocean floor -- the Mid-Atlantic Ridge is an active example.',
        'Continental plus continental, divergent, builds a rift valley, where the land between the plates stretches and drops -- the East African Rift is one example, and the Red Sea shows what a continental rift can become if it widens far enough.',
        'The direction plates move and the density of the crust each plate carries both matter -- neither one alone predicts the landform.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Landforms Built by Plate Motion' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
