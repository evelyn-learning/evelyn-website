/**
 * Grade 6 Science — Unit 3 CED 3.4: The Rock Cycle.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.the-rock-cycle.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U3_THE_ROCK_CYCLE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.the-rock-cycle.v1',
  course: 'Grade 6 Science',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'The Rock Cycle',
  planId: 'evelyn.ms.m6sci.the-rock-cycle.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.the-rock-cycle.v1' }],
  theory: [
    { loId: 'm6sci.the-rock-cycle', content: `A QUICK REMINDER OF THE THREE ROCK TYPES. The last lesson classified rocks as igneous, sedimentary, or metamorphic by how each one formed: igneous rock forms when melted rock cools and hardens; sedimentary rock forms when loose sediment is compacted and cemented together; metamorphic rock forms when an existing rock is changed by heat and pressure without melting. This lesson does not ask you to classify a rock from a description of how it formed -- that is already done. Instead, every rock in this lesson is given to you by name, and the job is to trace what happens to it next.` },
    { loId: 'm6sci.the-rock-cycle', content: `THE SEVEN PROCESSES, AND WHAT EACH ONE DOES. MELTING can happen to any rock -- igneous, sedimentary, or metamorphic -- if it gets hot enough to turn to liquid, and the liquid rock is called magma. COOLING turns magma into igneous rock as it hardens. WEATHERING breaks a rock apart into loose pieces, called sediment, using rain, ice, wind, and temperature changes at or near Earth's surface -- weathering does not move anything, it only breaks it apart where it sits. EROSION then carries that loose sediment away from where it formed. DEPOSITION is the sediment finally settling somewhere else, often in layers. COMPACTION AND CEMENTATION press deposited sediment together and glue the grains together with minerals, turning loose sediment into solid sedimentary rock. HEAT AND PRESSURE, without melting, changes an existing rock -- of any type -- into metamorphic rock.` },
    { loId: 'm6sci.the-rock-cycle', content: `THE ROCK CYCLE HAS NO FIXED ORDER. It is tempting to picture the cycle as one circle that always runs igneous, then sedimentary, then metamorphic, then back to igneous again. That picture is wrong. Any of the three rock types can become any other rock type, and there is more than one way to get there. Igneous rock can become sedimentary rock (weathering, erosion, deposition, compaction and cementation), or metamorphic rock (heat and pressure), or melt back into magma and cool into new igneous rock. Sedimentary rock can become metamorphic rock (heat and pressure), melt into magma and cool into igneous rock, or be weathered and eroded all over again into new sediment. Metamorphic rock can become sedimentary rock (weathering, erosion, deposition, compaction and cementation), melt into magma and cool into igneous rock, or undergo still more heat and pressure and become a different metamorphic rock. What decides the outcome is which process acts on the rock, never what type the rock already is.` },
    { loId: 'm6sci.the-rock-cycle', content: `THE ROUTINE FOR TRACING A CHANGE. Given a rock and a process, or a chain of processes, work through them one at a time: (1) name the process being described, (2) recall what that process does to a rock, regardless of what type it starts as, (3) name the rock or material that results, and (4) if another process follows, repeat starting from that new result. Reading a story backward works the same way in reverse: if you are told the final rock type, ask which process could have produced it, and check that every process needed to get there is actually described in the story.` },
    { loId: 'm6sci.the-rock-cycle', content: `MELTING AND HEAT-AND-PRESSURE ARE NOT THE SAME PROCESS. Both involve heat, and that is exactly why they get confused. Heat and pressure that changes a rock WITHOUT melting it produces metamorphic rock. Heat that is strong enough to melt a rock completely produces magma, which only becomes a rock again after it cools -- and cooled magma is always igneous rock, never metamorphic. Being heated for a long time does not, by itself, guarantee that a rock has melted: whether a rock melts depends on how hot it actually gets, not simply on how long it is heated, so a rock can be squeezed and heated for millions of years and never cross its melting point. So the question to ask is not simply "was it heated," it is "did it melt." This lesson only needs to know THAT melting, cooling, and heat-and-pressure change rock in these ways -- exactly why heat softens or melts a material, at the level of what is happening inside it, is a question for a later grade.` },
    { loId: 'm6sci.the-rock-cycle', kind: 'definition', title: 'rock cycle', content: `the set of processes that can turn any rock type into any other rock type, in no fixed order.` },
    { loId: 'm6sci.the-rock-cycle', kind: 'definition', title: 'weathering', content: `the breaking apart of rock into loose sediment where it sits, caused by rain, ice, wind, and temperature changes at or near Earth's surface.` },
    { loId: 'm6sci.the-rock-cycle', kind: 'definition', title: 'erosion', content: 'the carrying away of loose sediment from the place where it formed.' },
    { loId: 'm6sci.the-rock-cycle', kind: 'definition', title: 'deposition', content: 'the settling of transported sediment in a new location, often in layers.' },
    { loId: 'm6sci.the-rock-cycle', kind: 'definition', title: 'compaction', content: `the pressing together of sediment grains, usually by the weight of material deposited above them.` },
    { loId: 'm6sci.the-rock-cycle', kind: 'definition', title: 'cementation', content: `the gluing together of sediment grains by minerals that fill the spaces between them, forming solid sedimentary rock.` },
  ],
  methods: [
    {
      title: 'Worked igneous to sedimentary',
      steps: [
        `Rain, ice, and wind cracking the granite apart where it sits, without moving any of the pieces, is weathering. This turns the solid granite into loose sediment.`,
        'The stream carrying those loose grains downstream is erosion.',
        'The grains settling in a thick layer where the stream slows is deposition.',
        `Burial under more sediment presses the grains together, which is compaction, and the minerals that glue the grains into solid rock are cementation. Compaction and cementation together turn loose sediment into sedimentary rock.`,
        `Read the chain back: weathering, erosion, deposition, compaction and cementation. The granite -- an igneous rock -- has become a sedimentary rock.`,
        `Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The definition of each named process matches what happened in the story, step for step. The order of events only makes sense one way -- grains cannot be cemented before they are deposited, and cannot be deposited before they are carried away. And the result fits the general rule: any rock, including an igneous rock, can be weathered into sediment, because weathering does not care what type of rock it acts on. Three different kinds of evidence, one answer.`,
        `Second, change one condition and check that the answer moves with it. Suppose that instead of being buried and cemented, that same pile of sediment had instead been buried far deeper and subjected to intense heat and pressure without melting. Weathering, erosion, and deposition would still have happened exactly the same way, but the last step would turn the sediment into metamorphic rock instead of sedimentary rock. The starting rock, granite, never decides the ending point. The process that acts last does.`,
        `WRONG: "The granite stays igneous no matter what happens to it, because that is the kind of rock it is." CORRECT: "The granite's type only tells you where the chain started. Weathering, erosion, deposition, compaction and cementation carried it to a completely different type."`,
      ],
      example: { problem: `A hiker finds a loose chunk of granite, an igneous rock, lying on a mountainside. Over many years, rain, ice, and wind slowly crack the granite apart into pebbles and grains without carrying them anywhere. A mountain stream then picks up those grains and carries them miles downstream, finally dropping them in a thick layer where the stream widens and slows. That layer is later buried under more sediment, squeezed, and the grains are glued together into solid rock. Name each process in the order it happens, and name the final rock type.`, solution: `Weathering, then erosion, then deposition, then compaction and cementation. The granite, an igneous rock, becomes a sedimentary rock.` },
      relatedLoIds: ['m6sci.the-rock-cycle'],
    },
    {
      title: 'Worked metamorphic and back',
      steps: [
        `The shale was squeezed and heated, but the story is explicit that it never melted. That combination -- heat and pressure acting on an existing rock without melting it -- is exactly the process that produces metamorphic rock.`,
        'So the shale, a sedimentary rock, became a metamorphic rock.',
        `Notice what did NOT happen: melting. WRONG: "Heating a rock for a long time always melts it eventually." CORRECT: "A rock can be heated and squeezed for a very long time and still never melt." That distinction changes everything -- if the shale had melted completely, it would have become magma, and cooling that magma would produce igneous rock, not metamorphic rock.`,
        `Now the second question: could this metamorphic rock ever become sedimentary rock again? Weathering and erosion do not care what type of rock they are acting on -- they can break apart an igneous rock, a sedimentary rock, or a metamorphic rock equally well. So if this metamorphic rock were later exposed at Earth's surface, weathering could break it into loose sediment, erosion could carry that sediment away, and deposition, compaction and cementation could turn it into a brand-new sedimentary rock.`,
        `WRONG: "Once a rock becomes metamorphic, the only thing that can happen to it next is melting into magma and cooling into igneous rock." CORRECT: "A metamorphic rock can also be weathered into sediment and become sedimentary rock, or be changed again by more heat and pressure into a different metamorphic rock." Which path happens depends on which process acts on it, not on what type it currently is.`,
        `Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The definition of heat-and-pressure metamorphism matches what the story describes. The explicit absence of melting rules out the igneous path, which is a different kind of check -- ruling a competing answer OUT rather than confirming the chosen one. And the general no-fixed-order rule says any type can reach any other type, which is consistent with shale reaching metamorphic and with a later sedimentary path both being possible. Three different kinds of evidence, one consistent answer.`,
        `Second, change one condition and check that the answer moves with it. Suppose the shale had melted completely underground instead of just being squeezed and heated short of melting. Melting turns any rock into magma, and cooling magma turns it into igneous rock. So the exact same starting rock, shale, would end up igneous instead of metamorphic, purely because melting happened instead of stopping short of it. Change that one detail and the destination changes with it.`,
      ],
      example: { problem: `A rock collector owns a hard, banded rock that she knows started out as shale, a sedimentary rock. She read that deep underground, this shale was squeezed and heated for a very long time, but it never melted. What process changed the shale, what rock type did it become, and could that same rock ever become sedimentary rock again?`, solution: `Heat and pressure, without melting, changed the shale into a metamorphic rock. Yes, that metamorphic rock could later become sedimentary rock if it were exposed at the surface and weathered, eroded, deposited, and then compacted and cemented.` },
      relatedLoIds: ['m6sci.the-rock-cycle'],
    },
  ],
  pointers: [
    { content: `Students often say "The rock cycle always goes igneous, then sedimentary, then metamorphic, then back to igneous, in that order every time." — The rock cycle has no fixed order and no required starting point. Any of the three rock types can become any other rock type, depending on which process acts on it: heat and pressure can turn sedimentary rock directly into metamorphic rock without ever passing through igneous rock; melting and cooling can turn metamorphic rock directly into igneous rock without passing through sedimentary rock; weathering, erosion, deposition, compaction and cementation can turn igneous rock directly into sedimentary rock. The process decides the path, not a fixed sequence of types.`, kind: 'common-error' },
    { content: `Students often say "Erosion is what breaks a rock down into pieces in the first place." — Weathering is the process that breaks rock apart where it sits, turning solid rock into loose sediment. Erosion is a separate, later process: it carries that already-loosened sediment away to a new location. A rock has to be weathered into pieces before erosion has anything to move.`, kind: 'common-error' },
    { content: `The rock cycle has no fixed starting point and no fixed order -- any rock type can become any other rock type, depending on which process acts on it.`, kind: 'tip' },
    { content: 'Melting turns any rock -- igneous, sedimentary, or metamorphic -- into magma.', kind: 'tip' },
    { content: 'Cooling turns magma into igneous rock.', kind: 'tip' },
    { content: `Weathering breaks a rock apart where it sits; erosion carries the broken pieces away; deposition drops them somewhere else.`, kind: 'tip' },
    { content: 'Compaction and cementation turn deposited sediment into sedimentary rock.', kind: 'tip' },
    { content: `Heat and pressure, without melting, turn any existing rock into metamorphic rock.`, kind: 'tip' },
    { content: `The process that acts LAST decides the resulting rock type -- the starting rock type does not decide it.`, kind: 'tip' },
    { content: `Melting and heat-and-pressure are different processes with different results: melting leads toward igneous rock through cooling, while heat and pressure without melting leads to metamorphic rock.`, kind: 'tip' },
    { content: `Don't confuse weathering with erosion. Weathering breaks rock apart *where it sits*; erosion *carries* the broken pieces away. Weathering happens first, erosion second.`, kind: 'common-error' },
    { content: `Melting and heat-and-pressure are NOT the same thing. Ask: "Did it melt completely?" If yes, it becomes igneous rock when cooled. If no (just squeezed and heated short of melting), it becomes metamorphic rock. Long heating alone doesn't guarantee melting.`, kind: 'gotcha' },
    { content: `The rock cycle has NO fixed order and NO required starting point. Any rock type can become any other — igneous to sedimentary, sedimentary to igneous, metamorphic to sedimentary, etc. The *process* that acts decides where it goes, not what type it currently is.`, kind: 'common-error' },
    { content: `Before you name the final rock type, always identify the *last* process in the chain. That last process determines the result — not the starting rock type. Change the last process, and the rock type changes with it.`, kind: 'tip' },
    { content: `Compaction and cementation are two separate steps that usually happen together. Compaction = pressure presses grains together. Cementation = minerals glue them. You need *both* to turn loose sediment into solid sedimentary rock.`, kind: 'vocab-note' },
    { content: `Weathering doesn't require movement — it's the breaking itself. Rain, ice, wind, and temperature changes crack rock *in place*. Only after weathering loosens pieces does erosion have something to move.`, kind: 'edge-case' },
    { content: `When tracing a rock-cycle pathway, work through *one process at a time* in order, naming what each one does to the material. Don't skip steps or jump to the final answer. The intermediate steps prove you understand what each process actually does.`, kind: 'tip' },
  ],
};
