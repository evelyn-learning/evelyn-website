/**
 * Grade 6 Science (Earth & Space Science) — Minerals, Rocks & the Rock
 * Cycle: The Rock Cycle.
 *
 * CONCEPT-LED lesson for the m6sci fan-out (NGSS MS-ESS2-1). The whole
 * lesson is one mental model: melting, cooling, weathering, erosion,
 * deposition, compaction/cementation, and heat-and-pressure are the
 * processes that move a rock from one type to another, and there is no
 * fixed order to that movement -- any of the three rock types can become
 * any other, depending on which process acts on it. Every item traces a
 * chain of NAMED processes acting on a NAMED starting rock and asks what
 * results, or reads a finished chain backward to find the missing step.
 *
 * The two traps it is built to kill are (a) picturing the cycle as one
 * circle that always runs igneous, then sedimentary, then metamorphic, then
 * back to igneous, and (b) treating "erosion" as the word for a rock
 * breaking apart in the first place, when that is weathering's job.
 *
 * SCOPE GUARD: this plan traces what melting, cooling, weathering, erosion,
 * deposition, compaction and cementation, and heat and pressure do to a
 * rock, and treats the rock cycle as having no fixed order, where any of
 * the three rock types can become any other depending on which process
 * acts. Because row 3.3 sits immediately before this one and shares the
 * same standard, the guard states the split explicitly:
 *   - ROW 3.3 (the three rock types) CLASSIFIES a rock as igneous,
 *     sedimentary, or metamorphic from a description of how it formed.
 *     This lesson never asks the student to classify a rock from a
 *     formation description -- every rock's type is given as a stated fact
 *     in the problem itself (for example, "granite, an igneous rock," or
 *     "shale, a sedimentary rock"), and the task is always to predict what
 *     a NAMED process, or chain of processes, does to that given rock, not
 *     to identify what the rock already is. The three rock-type names recur
 *     throughout the file -- as a stated label on a given rock ("granite, an
 *     igneous rock"), in a one-sentence recap of how each type is defined,
 *     and inside general "any rock type" statements about what a process
 *     does. Nowhere in this file is a rock's type left for the student to
 *     work out from a description of how it formed -- no item, hint, or
 *     worked example asks for that classification.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: melting, cooling, and
 *     heat-and-pressure are named as the drivers of the cycle and are
 *     described only by WHAT they do to a rock, never by WHY -- there is no
 *     particle-level or energy-transfer account of why heat softens or
 *     melts a material anywhere in this file, and no temperature, pressure,
 *     or duration-in-years figure is stated. One key idea says outright
 *     that the mechanism behind melting is "a question for a later grade."
 *   - UNIT 4 (plate tectonics) boundary: rock in this file is described as
 *     ending up "buried deep underground" or later "uplifted" without ever
 *     naming plate motion or mantle convection as the cause. WHY rock gets
 *     buried, squeezed, or lifted is Unit 4's job, not this row's.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every rock,
 * every process, and every chain of events in this file is written out in
 * words, and every item is solvable from the text printed inside it. Never
 * write "see the rock-cycle diagram," and never assume the student has a
 * rock sample, a streak plate, or a rock kit in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * the-three-rock-types -> the-rock-cycle -> evidence-for-continental-drift,
 * per the lesson brief and the fan-out contract's chain table.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U3_THE_ROCK_CYCLE: LessonPlan = {
  id: 'evelyn.ms.m6sci.the-rock-cycle.v1',
  title: 'The Rock Cycle',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.the-rock-cycle',
      standard: 'M6SCI-3.4',
      description:
        'Trace a rock-cycle pathway described in words to predict which processes -- melting, cooling, weathering, erosion, deposition, compaction/cementation, or heat and pressure -- could turn a given rock into a different rock type, recognizing that the rock cycle has no fixed order and any rock type can become any other depending on which process acts (NGSS MS-ESS2-1; shares MS-ESS2-1 with the-three-rock-types, which classifies rock types by how they formed, while this lesson models the transformations between them).',
    },
  ],
  prerequisites: ['m6sci.the-three-rock-types'],
  followUps: ['m6sci.evidence-for-continental-drift'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the idea that a rock is not permanent by starting from an ordinary rock the student has probably kept.',
      script:
        'A rock sitting on a windowsill looks like the most permanent thing in the room. Come back in a year and it will look exactly the same. Come back in ten years and it will still look exactly the same. So it is strange to say that the same rock might once have been liquid rock deep underground, or a pile of sand at the bottom of a lake, or a completely different kind of rock entirely -- and that someday, over a very long stretch of time, it could become something else again. Nothing about the rock changed while it sat on the windowsill. What changes it is the same handful of processes acting on it somewhere else. Today we trace those processes, and the biggest surprise is that there is no single path every rock has to follow.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rock-cycle-processes',
      kind: 'concept',
      goal: 'Name the seven processes and what each does to a rock, and install the no-fixed-order rule as the central idea.',
      keyIdeas: [
        'A QUICK REMINDER OF THE THREE ROCK TYPES. The last lesson classified rocks as igneous, sedimentary, or metamorphic by how each one formed: igneous rock forms when melted rock cools and hardens; sedimentary rock forms when loose sediment is compacted and cemented together; metamorphic rock forms when an existing rock is changed by heat and pressure without melting. This lesson does not ask you to classify a rock from a description of how it formed -- that is already done. Instead, every rock in this lesson is given to you by name, and the job is to trace what happens to it next.',
          'THE SEVEN PROCESSES, AND WHAT EACH ONE DOES. MELTING can happen to any rock -- igneous, sedimentary, or metamorphic -- if it gets hot enough to turn to liquid, and the liquid rock is called magma. COOLING turns magma into igneous rock as it hardens. WEATHERING breaks a rock apart into loose pieces, called sediment, using rain, ice, wind, and temperature changes at or near Earth\'s surface -- weathering does not move anything, it only breaks it apart where it sits. EROSION then carries that loose sediment away from where it formed. DEPOSITION is the sediment finally settling somewhere else, often in layers. COMPACTION AND CEMENTATION press deposited sediment together and glue the grains together with minerals, turning loose sediment into solid sedimentary rock. HEAT AND PRESSURE, without melting, changes an existing rock -- of any type -- into metamorphic rock.',
        'THE ROCK CYCLE HAS NO FIXED ORDER. It is tempting to picture the cycle as one circle that always runs igneous, then sedimentary, then metamorphic, then back to igneous again. That picture is wrong. Any of the three rock types can become any other rock type, and there is more than one way to get there. Igneous rock can become sedimentary rock (weathering, erosion, deposition, compaction and cementation), or metamorphic rock (heat and pressure), or melt back into magma and cool into new igneous rock. Sedimentary rock can become metamorphic rock (heat and pressure), melt into magma and cool into igneous rock, or be weathered and eroded all over again into new sediment. Metamorphic rock can become sedimentary rock (weathering, erosion, deposition, compaction and cementation), melt into magma and cool into igneous rock, or undergo still more heat and pressure and become a different metamorphic rock. What decides the outcome is which process acts on the rock, never what type the rock already is.',
        'THE ROUTINE FOR TRACING A CHANGE. Given a rock and a process, or a chain of processes, work through them one at a time: (1) name the process being described, (2) recall what that process does to a rock, regardless of what type it starts as, (3) name the rock or material that results, and (4) if another process follows, repeat starting from that new result. Reading a story backward works the same way in reverse: if you are told the final rock type, ask which process could have produced it, and check that every process needed to get there is actually described in the story.',
        'MELTING AND HEAT-AND-PRESSURE ARE NOT THE SAME PROCESS. Both involve heat, and that is exactly why they get confused. Heat and pressure that changes a rock WITHOUT melting it produces metamorphic rock. Heat that is strong enough to melt a rock completely produces magma, which only becomes a rock again after it cools -- and cooled magma is always igneous rock, never metamorphic. Being heated for a long time does not, by itself, guarantee that a rock has melted: whether a rock melts depends on how hot it actually gets, not simply on how long it is heated, so a rock can be squeezed and heated for millions of years and never cross its melting point. So the question to ask is not simply "was it heated," it is "did it melt." This lesson only needs to know THAT melting, cooling, and heat-and-pressure change rock in these ways -- exactly why heat softens or melts a material, at the level of what is happening inside it, is a question for a later grade.',
      ],
      vocabulary: [
        { term: 'rock cycle', definition: 'the set of processes that can turn any rock type into any other rock type, in no fixed order.' },
        { term: 'weathering', definition: 'the breaking apart of rock into loose sediment where it sits, caused by rain, ice, wind, and temperature changes at or near Earth\'s surface.' },
        { term: 'erosion', definition: 'the carrying away of loose sediment from the place where it formed.' },
        { term: 'deposition', definition: 'the settling of transported sediment in a new location, often in layers.' },
        { term: 'compaction', definition: 'the pressing together of sediment grains, usually by the weight of material deposited above them.' },
        { term: 'cementation', definition: 'the gluing together of sediment grains by minerals that fill the spaces between them, forming solid sedimentary rock.' },
      ],
      suggestedTools: ['show_diagram', 'show_cycle_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-igneous-to-sedimentary',
      kind: 'worked_example',
      problem:
        'A hiker finds a loose chunk of granite, an igneous rock, lying on a mountainside. Over many years, rain, ice, and wind slowly crack the granite apart into pebbles and grains without carrying them anywhere. A mountain stream then picks up those grains and carries them miles downstream, finally dropping them in a thick layer where the stream widens and slows. That layer is later buried under more sediment, squeezed, and the grains are glued together into solid rock. Name each process in the order it happens, and name the final rock type.',
      steps: [
        'Rain, ice, and wind cracking the granite apart where it sits, without moving any of the pieces, is weathering. This turns the solid granite into loose sediment.',
        'The stream carrying those loose grains downstream is erosion.',
        'The grains settling in a thick layer where the stream slows is deposition.',
        'Burial under more sediment presses the grains together, which is compaction, and the minerals that glue the grains into solid rock are cementation. Compaction and cementation together turn loose sediment into sedimentary rock.',
        'Read the chain back: weathering, erosion, deposition, compaction and cementation. The granite -- an igneous rock -- has become a sedimentary rock.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The definition of each named process matches what happened in the story, step for step. The order of events only makes sense one way -- grains cannot be cemented before they are deposited, and cannot be deposited before they are carried away. And the result fits the general rule: any rock, including an igneous rock, can be weathered into sediment, because weathering does not care what type of rock it acts on. Three different kinds of evidence, one answer.',
        'Second, change one condition and check that the answer moves with it. Suppose that instead of being buried and cemented, that same pile of sediment had instead been buried far deeper and subjected to intense heat and pressure without melting. Weathering, erosion, and deposition would still have happened exactly the same way, but the last step would turn the sediment into metamorphic rock instead of sedimentary rock. The starting rock, granite, never decides the ending point. The process that acts last does.',
        'WRONG: "The granite stays igneous no matter what happens to it, because that is the kind of rock it is." CORRECT: "The granite\'s type only tells you where the chain started. Weathering, erosion, deposition, compaction and cementation carried it to a completely different type."',
      ],
      answer:
        'Weathering, then erosion, then deposition, then compaction and cementation. The granite, an igneous rock, becomes a sedimentary rock.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-metamorphic-and-back',
      kind: 'worked_example',
      problem:
        'A rock collector owns a hard, banded rock that she knows started out as shale, a sedimentary rock. She read that deep underground, this shale was squeezed and heated for a very long time, but it never melted. What process changed the shale, what rock type did it become, and could that same rock ever become sedimentary rock again?',
      steps: [
        'The shale was squeezed and heated, but the story is explicit that it never melted. That combination -- heat and pressure acting on an existing rock without melting it -- is exactly the process that produces metamorphic rock.',
        'So the shale, a sedimentary rock, became a metamorphic rock.',
        'Notice what did NOT happen: melting. WRONG: "Heating a rock for a long time always melts it eventually." CORRECT: "A rock can be heated and squeezed for a very long time and still never melt." That distinction changes everything -- if the shale had melted completely, it would have become magma, and cooling that magma would produce igneous rock, not metamorphic rock.',
        'Now the second question: could this metamorphic rock ever become sedimentary rock again? Weathering and erosion do not care what type of rock they are acting on -- they can break apart an igneous rock, a sedimentary rock, or a metamorphic rock equally well. So if this metamorphic rock were later exposed at Earth\'s surface, weathering could break it into loose sediment, erosion could carry that sediment away, and deposition, compaction and cementation could turn it into a brand-new sedimentary rock.',
        'WRONG: "Once a rock becomes metamorphic, the only thing that can happen to it next is melting into magma and cooling into igneous rock." CORRECT: "A metamorphic rock can also be weathered into sediment and become sedimentary rock, or be changed again by more heat and pressure into a different metamorphic rock." Which path happens depends on which process acts on it, not on what type it currently is.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The definition of heat-and-pressure metamorphism matches what the story describes. The explicit absence of melting rules out the igneous path, which is a different kind of check -- ruling a competing answer OUT rather than confirming the chosen one. And the general no-fixed-order rule says any type can reach any other type, which is consistent with shale reaching metamorphic and with a later sedimentary path both being possible. Three different kinds of evidence, one consistent answer.',
        'Second, change one condition and check that the answer moves with it. Suppose the shale had melted completely underground instead of just being squeezed and heated short of melting. Melting turns any rock into magma, and cooling magma turns it into igneous rock. So the exact same starting rock, shale, would end up igneous instead of metamorphic, purely because melting happened instead of stopping short of it. Change that one detail and the destination changes with it.',
      ],
      answer:
        'Heat and pressure, without melting, changed the shale into a metamorphic rock. Yes, that metamorphic rock could later become sedimentary rock if it were exposed at the surface and weathered, eroded, deposited, and then compacted and cemented.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-heat-pressure-underground',
      kind: 'try_yourself',
      problem:
        'A piece of sandstone, a sedimentary rock, ends up buried deep underground, where it is squeezed and heated for millions of years but never melts. Which process is changing the sandstone, and what does it become?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Melting, and it becomes magma, because being buried deep underground for millions of years builds up enough heat over that much time to melt almost any kind of rock completely, no matter how slowly that heat is added.' },
        { id: 'b', text: 'Weathering, and it turns back into loose sediment, because being squeezed on every side by the surrounding rock for millions of years is a strong enough physical force to break even a solid, already-cemented rock apart into separate grains again.' },
        { id: 'c', text: 'Compaction and cementation, and it becomes a new, denser sedimentary rock, because pressing rock together very hard underground for a long enough time is the same kind of squeezing that compaction and cementation apply to loose sediment.' },
        { id: 'd', text: 'Heat and pressure, and it becomes a metamorphic rock, because it was heated and squeezed for a very long time without ever melting, which is exactly the combination that changes an existing rock into a metamorphic rock.', correct: true },
      ],
      expectedAnswer:
        'Heat and pressure, and it becomes a metamorphic rock, because it was heated and squeezed for a very long time without ever melting, which is exactly the combination that changes an existing rock into a metamorphic rock.',
      hints: [
        'Start by checking whether the sandstone actually turns to liquid at any point in this story. If it never melts, you can rule out any answer that depends on melting.',
        'Compaction and cementation only work on loose, unlithified sediment that is still being buried and glued together for the first time. The sandstone here is already a solid rock being squeezed, not loose grains.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-only-one-path-claim',
      kind: 'try_yourself',
      problem:
        'A student claims: "Once a rock becomes a metamorphic rock, the only thing that can happen to it next is melting into magma and then cooling into igneous rock." Which process would prove that claim wrong by turning a metamorphic rock into a different rock type another way?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Weathering and erosion breaking the metamorphic rock down into loose sediment at Earth\'s surface, which deposition, compaction, and cementation could then turn into a brand-new sedimentary rock, without any melting or cooling ever taking place.', correct: true },
        { id: 'b', text: 'Cooling, because a metamorphic rock sitting at Earth\'s surface is no longer being kept hot by burial, and once it stops being heated it will gradually cool down and eventually turn into a sedimentary rock over a long enough stretch of time.' },
        { id: 'c', text: 'Compaction and cementation acting directly on the solid metamorphic rock, because squeezing an existing rock hard enough for a long time seems like the same kind of pressing together that compaction and cementation apply to loose sediment.' },
        { id: 'd', text: 'More heat and pressure, strong enough to completely melt the metamorphic rock, because increasing the same kind of heat and pressure that first created it even further seems like it would simply produce a more intensely metamorphosed version of the same rock.' },
      ],
      expectedAnswer:
        'Weathering and erosion breaking the metamorphic rock down into loose sediment at Earth\'s surface, which deposition, compaction, and cementation could then turn into a brand-new sedimentary rock, without any melting or cooling ever taking place.',
      hints: [
        'The student\'s claim is that a metamorphic rock has exactly one possible next step. To prove that wrong, you only need to find one different, genuinely possible path.',
        'Think about what happens if a metamorphic rock is ever exposed at Earth\'s surface. Which two processes act on any exposed rock, no matter what type it is, breaking it into loose sediment?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-full-chain-uplift',
      kind: 'try_yourself',
      problem:
        'A rock is squeezed and heated deep underground for a long time, but never melts, and becomes a metamorphic rock. Later, very slowly, that same rock is uplifted until it reaches Earth\'s surface, where rain and wind break it apart into loose grains, a river carries those grains away, and drops them in a lake bed, where they are eventually buried and cemented together. What is the final rock type, and which single process would have to be skipped for the rock to remain as loose sediment instead of becoming solid rock again?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The final rock is metamorphic, because that is the rock type produced by the heat and pressure described at the start of the story, and once a rock has become metamorphic nothing further needs to be traced beyond that point.' },
        { id: 'b', text: 'The final rock is sedimentary, and skipping compaction and cementation would leave it as loose sediment instead of solid rock, because compaction and cementation are the steps that finally turn deposited sediment into sedimentary rock.', correct: true },
        { id: 'c', text: 'The final rock is sedimentary, and skipping erosion would leave it as loose sediment, because sediment sitting in a pile still seems like it needs to be heated and pressured somehow before it can finish turning into solid rock.' },
        { id: 'd', text: 'The final rock is igneous, because a rock that has already been changed once by heat and pressure seems primed to melt completely the very next time anything else happens to it, since it was already pushed partway toward that transformation.' },
      ],
      expectedAnswer:
        'The final rock is sedimentary, and skipping compaction and cementation would leave it as loose sediment instead of solid rock, because compaction and cementation are the steps that finally turn deposited sediment into sedimentary rock.',
      hints: [
        'Trace the whole story in order, and notice that it does not stop at the metamorphic stage -- the rock is later uplifted and something new happens to it at the surface.',
        'List the last few things that happen to the rock at the surface: weathering, erosion, deposition, and then one more step. What does that last step do to loose sediment, and what would be left behind if that step never happened?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fixed-loop-and-erosion',
      kind: 'misconception_check',
      question:
        'A student writes: "The rock cycle always goes igneous, then sedimentary, then metamorphic, then back to igneous, in that order every time. Also, erosion is what breaks a rock down into pieces in the first place." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer:
            'The rock cycle always goes igneous, then sedimentary, then metamorphic, then back to igneous, in that order every time.',
          misconception:
            'Remembering the cycle as a single circular diagram with one direction of travel, because a cycle sounds like it should have one repeating loop.',
          correctsTo:
            'The rock cycle has no fixed order and no required starting point. Any of the three rock types can become any other rock type, depending on which process acts on it: heat and pressure can turn sedimentary rock directly into metamorphic rock without ever passing through igneous rock; melting and cooling can turn metamorphic rock directly into igneous rock without passing through sedimentary rock; weathering, erosion, deposition, compaction and cementation can turn igneous rock directly into sedimentary rock. The process decides the path, not a fixed sequence of types.',
        },
        {
          answer: 'Erosion is what breaks a rock down into pieces in the first place.',
          misconception:
            'Treating "erosion" as a catch-all word for anything that wears a rock down, because in everyday speech erosion is often used loosely for wearing away.',
          correctsTo:
            'Weathering is the process that breaks rock apart where it sits, turning solid rock into loose sediment. Erosion is a separate, later process: it carries that already-loosened sediment away to a new location. A rock has to be weathered into pieces before erosion has anything to move.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The rock cycle has no fixed starting point and no fixed order -- any rock type can become any other rock type, depending on which process acts on it.',
        'Melting turns any rock -- igneous, sedimentary, or metamorphic -- into magma.',
        'Cooling turns magma into igneous rock.',
        'Weathering breaks a rock apart where it sits; erosion carries the broken pieces away; deposition drops them somewhere else.',
        'Compaction and cementation turn deposited sediment into sedimentary rock.',
        'Heat and pressure, without melting, turn any existing rock into metamorphic rock.',
        'The process that acts LAST decides the resulting rock type -- the starting rock type does not decide it.',
        'Melting and heat-and-pressure are different processes with different results: melting leads toward igneous rock through cooling, while heat and pressure without melting leads to metamorphic rock.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'The Rock Cycle' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
