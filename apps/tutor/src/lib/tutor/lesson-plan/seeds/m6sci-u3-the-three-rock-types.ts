/**
 * Grade 6 Science (Earth & Space Science) — Minerals, Rocks & the Rock
 * Cycle: The Three Rock Types.
 *
 * CONCEPT-LED plan for the m6sci fan-out (NGSS MS-ESS2-1). The student has
 * no procedure to run here beyond a three-way sort: read how a rock is
 * described as having formed -- melted and cooled, pressed together from
 * sediment, or changed by heat and pressure without melting -- and match
 * that process to its family. Where a description instead gives the
 * rock's look (crystal size, layering, banding), the plan teaches how to
 * translate that look back to the process before answering.
 *
 * The trap this file is built to kill is treating "banded" or "striped" as
 * a single look. Sedimentary layering (deposited material, sometimes
 * holding grains or fossils) and metamorphic foliation (squeezed mineral
 * bands, no deposited grains) both read as "stripes" in words, and the
 * concept segment, both worked examples and the try_yourself items all
 * drill the same question: what is actually doing the striping.
 *
 * SCOPE GUARD: this plan classifies a rock into igneous, sedimentary, or
 * metamorphic FROM A DESCRIPTION OF HOW IT FORMED (or of the texture that
 * formation produced), and stops there.
 *   - ROW 3.4 (the rock cycle) owns the TRANSFORMATIONS between the three
 *     families -- melting, weathering, erosion, deposition, and heat and
 *     pressure as connections in a cycle. This file names ONE formation
 *     process per family and never draws a cycle, an arrow between
 *     families, or a claim that a given rock will or could later become a
 *     different type. "An existing rock" is named as the metamorphic
 *     starting material because the definition requires it, but no rock
 *     in this file is shown converting into another type; that
 *     conversion, and the fact that the cycle has no fixed order, is 3.4.
 *   - ROW 3.2 (identifying minerals) owns hardness, streak, luster and
 *     cleavage as tests performed on a single mineral grain. This file
 *     never uses those tests; it classifies whole rocks by formation
 *     process, and a rock (built of many minerals) is distinguished from
 *     a single mineral only in passing, matching row 3.2's own scope.
 *   - ROW 7.4 (weathering, erosion and deposition) owns HOW sediment gets
 *     made and moved. This file states that sediment is loose material --
 *     sand, mud, or shell and coral fragments -- without explaining the
 *     weathering or erosion process that produced or transported it.
 *   - UNIT 5 (relative and absolute dating) owns AGE. This file uses
 *     qualitative duration language ("thousands of years" of slow cooling
 *     versus "hours or minutes" of fast cooling) only to contrast cooling
 *     rates as a texture clue, and never converts that language into a
 *     specific age, a range of years, or a dating method -- no numeral
 *     count of years and no radiometric, carbon-14, or superposition
 *     reasoning appears anywhere in this file. The misconception check
 *     states directly that neither crystal size nor banding gives an age,
 *     and that age does not decide which of the three families a rock
 *     belongs to.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears. Shell and coral fragments are named
 *     only as an inert source material for sedimentary rock, never as
 *     living organisms, cells, or evidence of how a species changed.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this file states THAT cooling
 *     rate changes crystal size and THAT heat and pressure reorganize
 *     minerals, because the classification test needs both facts. It
 *     never explains WHY in particle or energy terms -- no heat-transfer
 *     mechanism (conduction, convection, radiation), no particle model of
 *     melting, no mineral chemistry or chemical equation, appears
 *     anywhere in this file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every rock
 * in this file is described in words precisely enough to classify from
 * the text alone. Never write "see the rock in the photo", and never
 * assume the student has a rock sample, a hand lens, or a streak plate in
 * front of them.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 3.2 -> 3.3 -> 3.4,
 * all three authored in the same 40-row batch as this file, so both
 * arrays are populated with their real loIds per the fan-out contract.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U3_THE_THREE_ROCK_TYPES: LessonPlan = {
  id: 'evelyn.ms.m6sci.the-three-rock-types.v1',
  title: 'The Three Rock Types',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.the-three-rock-types',
      standard: 'M6SCI-3.3',
      description:
        'Classify a rock as igneous, sedimentary, or metamorphic from a description of how it formed -- cooled from magma or lava, compacted and cemented from sediment, or an existing rock altered by heat and pressure without melting (NGSS MS-ESS2-1).',
    },
  ],
  prerequisites: ['m6sci.identifying-minerals-by-their-properties'],
  followUps: ['m6sci.the-rock-cycle'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the three-family idea in a shelf rock or rock-collection scene the student can picture without a photo.',
      script:
        'Somebody in your family, or a friend of yours, probably keeps a rock on a windowsill or a shelf just because they liked how it looked. Maybe it is gray with big sparkly crystals in it. Maybe it has thin stripes running through it like a stack of pancakes. Maybe it is dull and gritty, like hardened sand. None of those rocks got picked at random off a shelf labeled rocks. Every single one has a story about how it was actually made. Some were once melted rock that cooled solid. Some were once loose grains of sand and mud, pressed together over a very long time. Some were once a completely different rock that got squeezed and heated deep underground until it changed into something new. Today you learn to read that story from how a rock is described, without ever touching it.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-rock-types',
      kind: 'concept',
      goal: 'Build the three formation processes, tie each to its telltale texture, and kill the trap of treating every kind of stripe the same way.',
      keyIdeas: [
        'THREE ROCK FAMILIES, SORTED BY HOW THEY FORMED -- geologists put every rock into one of three groups based on the process that made it, not on color or size alone: igneous rock cooled from melted rock, sedimentary rock was pressed together from loose sediment, and metamorphic rock was changed by heat and pressure while staying solid. Two rocks that look nothing alike can belong to the same family, and two rocks that look similar can belong to different families, so the process named in a description is what actually decides the answer.',
        'IGNEOUS ROCK FORMS BY COOLING -- melted rock is called magma while it is still underground, and lava once it reaches the surface, whether through a volcano or a crack in the ground. When magma or lava cools and hardens, its minerals lock together into crystals, and the crystal size records how fast that cooling happened. Magma trapped underground cools slowly, often over thousands of years, which gives the crystals time to grow large enough to see and tell apart with your eyes -- granite forms this way. Lava exposed at the surface cools in hours or even minutes, which does not give crystals time to grow, so they come out tiny, sometimes too small to see without help -- basalt forms this way.',
        'SEDIMENTARY ROCK FORMS BY PRESSING SEDIMENT TOGETHER -- sediment is loose material: grains of sand, flecks of mud, or the broken shells and skeletons of ocean animals. Sediment settles out in flat layers, one on top of another, and over a very long time the weight of the layers above squeezes the ones below (compaction) while dissolved minerals seep in and glue the grains together (cementation). Unlike igneous rock, no new crystals grow during this process -- the grains keep their original shape and are simply pressed and glued in place. The clearest clue in a description is visible LAYERING, separate bands stacked on top of each other, often holding visible grains or fossils. Sandstone is cemented sand grains; limestone is often the compacted, cemented remains of shells and coral.',
        'METAMORPHIC ROCK FORMS WITHOUT FULLY MELTING -- take an existing rock, igneous, sedimentary, or even another metamorphic rock, and put it under intense heat and pressure deep underground, and its minerals can reorganize into a new pattern while the rock stays solid the entire time. That staying-solid detail is what separates metamorphic rock from igneous rock: igneous rock forms from a full melt that cools again, while metamorphic rock never fully melts. The reorganizing often lines minerals up into bands of alternating light and dark stripes, called FOLIATION, or squeezes the crystals into a hard, tightly interlocked texture. Marble forms this way from limestone; slate forms this way from shale.',
        'THE TRAP -- STRIPES ARE NOT ALL THE SAME STRIPES. A description of bands or stripes running through a rock can come from two completely different processes, and mixing them up is the easiest mistake on this topic. Flat, parallel layers of different deposited materials, sometimes holding grains or fossils, points to sedimentary layering. Wavy, streaky bands of alternating light and dark minerals, with no grains, fossils, or deposited layers, points to metamorphic foliation. Read for what is actually doing the striping, separate deposited layers or squeezed mineral bands, before deciding.',
        'THE THREE-CLUE TEST -- when a description states how a rock formed, match the process directly to the family: melted-and-cooled is igneous; sediment pressed and cemented in layers is sedimentary; an existing rock changed by heat and pressure without melting is metamorphic. When a description instead gives you what the rock looks like, translate the look back to a process before choosing: large, individually visible crystals usually point to slow-cooled igneous rock; visible layering, grains, or fossils usually point to sedimentary rock; squeezed, aligned mineral bands with no sediment layers usually point to metamorphic rock. A rock is not metamorphic just because it is old, sits underground, or contains shell fragments -- call it metamorphic only when heat and pressure changing an existing rock is actually part of the description.',
      ],
      vocabulary: [
        { term: 'igneous rock', definition: 'rock that forms when magma or lava cools and hardens into a solid.' },
        { term: 'magma', definition: 'melted rock while it is still underground.' },
        { term: 'lava', definition: 'melted rock once it reaches the surface, through a volcano or a crack in the ground.' },
        { term: 'sedimentary rock', definition: 'rock that forms when layers of sediment are compacted and cemented together.' },
        { term: 'sediment', definition: 'loose material such as grains of sand, mud, or the remains of shells and other once-living things.' },
        { term: 'metamorphic rock', definition: 'rock that forms when an existing rock is changed by heat and pressure without completely melting.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-igneous-from-formation',
      kind: 'worked_example',
      problem:
        'A rock sample is described this way: it formed when melted rock reached Earth\'s surface through a volcano, then cooled and hardened within a few hours. The crystals in the sample are too small to see or pick out individually, even with a hand lens. What type of rock is this, and why?',
      steps: [
        'Identify the process first. The description says "melted rock" that "cooled and hardened." That is the defining process of igneous rock, whether the melt was magma trapped underground or lava at the surface.',
        'Identify which stage of the process this is. The melted rock "reached Earth\'s surface through a volcano," so it is lava, not magma still underground.',
        'Use the cooling-rate clue to check the texture. Lava exposed at the surface cools in hours or even minutes, and fast cooling does not give minerals time to grow into large crystals. The description says the crystals are too small to pick out individually, which is exactly what fast surface cooling predicts.',
        'WRONG: "It has crystals, so it must be igneous, and that is all the evidence we need." CORRECT: "It is igneous because it formed from melted rock that cooled and hardened -- the tiny crystal size is a second piece of evidence that agrees with that process, not the reason on its own."',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The process word says melted rock that cooled. The location clue says it reached the surface through a volcano, so it is lava. The predicted texture says fast surface cooling should leave tiny crystals, and the description confirms tiny crystals. Three different kinds of evidence, one answer.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Suppose the same melted rock had stayed trapped deep underground and cooled over thousands of years instead of reaching the surface. It would still be igneous, because it still cooled from a melt -- but the crystals would come out large, not small, because the cooling would be slow. The family stays the same while the texture changes with where the cooling happens, which shows that texture is a clue about the process, not the deciding fact by itself.',
      ],
      answer:
        'Igneous rock. It formed from lava that reached Earth\'s surface and cooled quickly, which hardened it into rock with crystals too small to see individually -- similar to basalt.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-metamorphic-from-existing-rock',
      kind: 'worked_example',
      problem:
        'A geologist describes a rock sample this way: it started out as shale, a sedimentary rock made from layers of compacted, cemented mud. Then, deep underground, heat and intense pressure changed it without ever fully melting it. The sample now shows tightly packed, shiny mineral flakes lined up in flat bands, and it splits easily into thin, smooth sheets. What type of rock is the sample now, and what type of rock was it before the change?',
      steps: [
        'Identify the process first. The description says heat and intense pressure changed an already-existing rock "without ever fully melting it." That is exactly the metamorphic process: an existing solid rock is reorganized by heat and pressure while it stays solid.',
        'Identify the parent rock. Before the change, the sample is named directly: it started as shale, which is a sedimentary rock made from compacted, cemented layers of mud.',
        'Read the new texture as a metamorphic clue, not a sedimentary one. The changed rock now has mineral flakes lined up in flat bands and splits into thin sheets. That lined-up mineral banding is called foliation, produced by the squeezing, and it is easy to mistake for the original mud layers -- but the process described, heat and pressure acting on an existing solid rock, is what actually decides the family, not the fact that the rock still looks banded.',
        'WRONG: "It still splits into flat sheets, so it must still be the same sedimentary rock." CORRECT: "The flat sheets changed from deposited mud layers into squeezed, aligned mineral flakes once heat and pressure acted on the rock without melting it, so the rock is now metamorphic even though it still looks layered."',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The stated process says heat and pressure with no melting. The stated starting material says an existing solid rock, shale, not loose sediment or melted rock. The resulting texture says tightly packed, aligned mineral flakes splitting into sheets, which is the classic look this kind of change produces. Three different kinds of evidence, one answer.',
        'Second, change one thing about the setup and check that the answer moves with it. Suppose the description had said the mud layers were simply buried under more layers, with no mention of heat -- that squeezing alone, called compaction, keeps the rock sedimentary. It is the addition of heat together with pressure, changing an already-solid rock, that moves it into the metamorphic family.',
      ],
      answer:
        'Metamorphic rock. It started as shale, a sedimentary rock made from compacted mud layers, and heat and intense pressure changed it into a rock with aligned mineral bands that split into thin sheets, without ever melting it. This description matches slate.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-igneous-crystal-size',
      kind: 'try_yourself',
      problem:
        'A rock sample is described as having formed when magma cooled and hardened very slowly, deep underground, over thousands of years. The crystals in the sample are large enough to see and tell apart from each other with your eyes. What type of rock is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sedimentary rock, because a very long time spent underground is what produces crystals large enough to see with your eyes.' },
        { id: 'b', text: 'Metamorphic rock, because a very long time under heat and pressure is what produces crystals large enough to see with your eyes.' },
        { id: 'c', text: 'Igneous rock, because it formed from magma that cooled and hardened, and slow cooling underground produced the large crystals.', correct: true },
        { id: 'd', text: 'Sedimentary rock, because the crystals grew large while layers of sediment were pressed together over thousands of years.' },
      ],
      expectedAnswer: 'Igneous rock, because it formed from magma that cooled and hardened, and slow cooling underground produced the large crystals.',
      hints: [
        'Look for the process word first. Does the description say the material melted and then cooled, or does it say sediment piled up in layers?',
        'Now use the crystal-size clue to check your answer. Underground cooling that takes thousands of years should leave large individual crystals, not the kind of texture you would expect from pressed-together grains.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sedimentary-layers-and-shells',
      kind: 'try_yourself',
      problem:
        'A rock sample is described as being made of visible sand grains cemented tightly together, arranged in flat layers stacked one on top of another. Small fragments of broken seashell are scattered through one of the layers. What type of rock is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Metamorphic rock, because the layers were squeezed together by heat and pressure until they hardened into flat bands.' },
        { id: 'b', text: 'Igneous rock, because the sand grains are actually small mineral crystals that cooled quickly from melted lava.' },
        { id: 'c', text: 'Metamorphic rock, because the seashell fragments were changed by heat and pressure into a new mineral pattern.' },
        { id: 'd', text: 'Sedimentary rock, because it is made of cemented sand grains stacked in layers, with shell fragments preserved as sediment.', correct: true },
      ],
      expectedAnswer: 'Sedimentary rock, because it is made of cemented sand grains stacked in layers, with shell fragments preserved as sediment.',
      hints: [
        'Start with what the sample is made of. Is it built from grains that have been pressed and glued together, or does the description mention any melting or squeezing by heat?',
        'The seashell fragments point the same direction as the sand grains and the layering. Ask what kind of rock preserves pieces of once-living material sitting inside a layer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-stripes-are-not-all-the-same',
      kind: 'try_yourself',
      problem:
        'Two rock samples are described. Sample X has flat bands of different colored sediment stacked on top of each other, with small pebbles visible inside one band. Sample Y has wavy, shiny mineral bands squeezed tightly together, with no pebbles and no layers of different sediment anywhere in it. Which sample is the metamorphic rock?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sample Y, because its bands are made of squeezed minerals with no sediment grains or deposited layers, which points to heat and pressure rather than settling.', correct: true },
        { id: 'b', text: 'Sample X, because any rock with bands of different colors running through it has been changed by heat and pressure underground, no matter what else is mixed in with those bands.' },
        { id: 'c', text: 'Both samples, because a rock only shows a banded pattern like this after intense heat and pressure act on it, regardless of what else appears inside the bands.' },
        { id: 'd', text: 'Neither sample, because heat and pressure completely erase a rock\'s banded pattern instead of creating a new one of its own.' },
      ],
      expectedAnswer: 'Sample Y, because its bands are made of squeezed minerals with no sediment grains or deposited layers, which points to heat and pressure rather than settling.',
      hints: [
        'Look at what kind of material is doing the striping in each sample. Does one of them contain pebbles or pieces of different sediment sitting inside a layer?',
        'Heat and pressure squeezing an existing rock can line up minerals into new bands of their own. Ask which sample\'s bands are made of squeezed minerals, and which one\'s bands are just deposited material.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-crystal-size-is-not-age',
      kind: 'misconception_check',
      question:
        'A student looks at a description of a rock with big, easy-to-see crystals and says: "This rock has big crystals, so it must be very old, and it must be igneous because old rocks always cooled from magma." Two separate things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Big crystals mean the rock is very old.',
          misconception:
            'Confusing crystal size, which records how slowly the rock cooled, with the rock\'s age, which is a completely separate question answered by a different method.',
          correctsTo:
            'Crystal size tells you about the COOLING RATE, not the age. Magma that cools slowly underground grows large crystals whether that happened a short time ago or a very long time ago, so a rock could be young and coarse-crystaled, or old and fine-crystaled. Working out an actual age uses a different method entirely, taught in a later lesson, and it is never read off crystal size.',
        },
        {
          answer: 'Old rocks always cooled from magma, so being old proves a rock is igneous.',
          misconception:
            'Assuming rock type is decided by how long ago a rock formed, rather than by which process formed it.',
          correctsTo:
            'Age has nothing to do with which of the three families a rock belongs to. A rock formed a very long time ago could be igneous, sedimentary, or metamorphic, and so could a rock formed recently. What sorts a rock into a family is the process that made it -- cooling from a melt, sediment pressed together, or an existing rock changed by heat and pressure -- never how much time has passed.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rocks are sorted into three families by the PROCESS that formed them: igneous, sedimentary, or metamorphic.',
        'Igneous rock forms when magma (underground) or lava (surface) cools and hardens. Slow cooling underground gives large crystals; fast cooling at the surface gives small ones.',
        'Sedimentary rock forms when sediment -- loose grains, mud, or shell and coral fragments -- settles in layers and is compacted and cemented together. No new crystals grow in this process.',
        'Metamorphic rock forms when an existing rock, of any of the three families, is changed by heat and pressure without fully melting.',
        'Stripes can come from two different processes: deposited sediment layers (sedimentary) or squeezed mineral bands, called foliation (metamorphic). Check for pebbles, grains, or fossils to tell them apart.',
        'Crystal size and banding are clues about the FORMATION PROCESS, never clues about a rock\'s age.',
        'Granite and basalt are igneous; sandstone and limestone are sedimentary; marble and slate are metamorphic.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'The Three Rock Types' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
