/**
 * Grade 6 Science — Unit 7 CED 7.3: The Water Cycle: Groundwater & Runoff.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.the-water-cycle-groundwater-and-runoff.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U7_THE_WATER_CYCLE_GROUNDWATER_AND_RUNOFF: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.the-water-cycle-groundwater-and-runoff.v1',
  course: 'Grade 6 Science',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'The Water Cycle: Groundwater & Runoff',
  planId: 'evelyn.ms.m6sci.the-water-cycle-groundwater-and-runoff.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.the-water-cycle-groundwater-and-runoff.v1' }],
  theory: [
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', content: `THREE PATHS FOR WATER THAT REACHES THE SURFACE. Once precipitation lands, it takes one of three paths. It can flow across the surface as runoff. It can soak into the ground as infiltration. Or, once it has soaked in, it can be taken up by the roots of a plant growing in the soil above. Which path a given amount of rain takes depends mainly on what kind of ground it lands on and how fast the rain is falling.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', content: `RUNOFF: WATER FLOWING OVER THE SURFACE. When rain falls faster than the ground beneath it can absorb it, or when it lands on ground that blocks infiltration, the extra water flows downhill across the surface. This flowing water is runoff. Runoff gathers into small channels, those channels join into streams, streams join into rivers, and the water eventually reaches a lake or the ocean -- rejoining a body of water where evaporation can start the atmospheric half of the cycle over again.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', content: `INFILTRATION DEPENDS ON WHAT THE GROUND IS MADE OF. Loose ground made of sand or gravel lets rainwater soak in quickly -- a puddle sitting on sand can vanish underground within minutes. Packed clay, or solid rock with no cracks running through it, lets very little water soak through, so water sitting on top of it either stays there or has to run off instead. Ground that lets water soak through easily is called permeable. Ground that blocks water, or lets very little through, is called impermeable. This is why the same rainstorm can leave one patch of ground already dry while a patch right next to it stays a puddle for days: the ground itself is different from one patch to the next.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', content: `BELOW THE SURFACE: THE WATER TABLE SPLITS TWO ZONES. Water that infiltrates keeps moving downward. Close to the surface, the small spaces between grains of soil and cracks in rock hold a mixture of air and water -- picture a sponge that is damp but not fully soaked. Farther down, every one of those spaces is completely filled with water, with no air left in them at all -- a fully soaked sponge. The boundary between these two zones is the water table. Above the water table, spaces hold air and water together. Below the water table, in what is called the saturated zone, every space is filled with water.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', content: `AQUIFERS, WELLS AND RECHARGE. A body of permeable underground rock or sediment that holds enough water in its saturated zone to supply a well is called an aquifer. A well has to be drilled down past the water table, into the saturated zone, before it reaches any water to draw up -- a well that stops above the water table comes up dry. Aquifers are refilled by recharge: rain and melted snow that infiltrate and seep down, adding water to the saturated zone and raising the water table. If water is pumped out of an aquifer faster than recharge can replace it, the water table drops, and wells that once reached water can run dry.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', content: `PLANT UPTAKE: A THIRD DESTINATION FOR INFILTRATED WATER. Not all infiltrated water reaches the saturated zone. Some of it, still close to the surface, is taken up by the roots of a plant growing there. That water does not leave the water cycle. Much of it later passes back into the atmosphere as water vapor, released from the plant in a process called transpiration -- rejoining the same atmospheric pathway of rising, cooling and falling again that the last lesson already built.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', kind: 'definition', title: 'runoff', content: 'water flowing across the surface of the land instead of soaking into the ground.' },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', kind: 'definition', title: 'infiltration', content: 'water soaking down into the ground from the surface.' },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', kind: 'definition', title: 'water table', content: `the underground boundary where the spaces in soil and rock change from holding a mix of air and water above it to being completely filled with water below it.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', kind: 'definition', title: 'saturated zone', content: `the underground zone below the water table, where every open space in the soil or rock is filled with water.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', kind: 'definition', title: 'aquifer', content: `a body of permeable underground rock or sediment whose saturated zone holds enough water to supply a well.` },
    { loId: 'm6sci.the-water-cycle-groundwater-and-runoff', kind: 'definition', title: 'transpiration', content: `water vapor released into the atmosphere from a plant, after the plant took up water from the soil through its roots.` },
  ],
  methods: [
    {
      title: 'Worked runoff vs infiltration',
      steps: [
        `Start with the parking lot. Pavement is a packed, sealed material built specifically to keep water from soaking through it, so it is impermeable -- almost none of the rain can infiltrate.`,
        `With infiltration blocked, the rain on the parking lot has nowhere to go but the surface itself. Once it exceeds any low spots, it starts flowing downhill across the pavement -- that is runoff, which is exactly why parking lots are built with a slope and storm drains at the bottom of it.`,
        `Now the plowed field. Loosened, dug-up soil is permeable: the storm's rain has open ground to soak into, so much more of it infiltrates rather than pooling on top.`,
        `WRONG: "the rain on the parking lot must be soaking in slowly, we just cannot see it happening." CORRECT: "pavement is deliberately sealed so that essentially none of the rain infiltrates at all -- that is why cities build storm drains to carry the runoff away, rather than counting on the pavement to absorb it."`,
        `Check the answer with three different kinds of clues. First, by material: pavement is a sealed, impermeable surface by design, and loosened soil is permeable by comparison -- that alone predicts more runoff from the lot and more infiltration into the field. Second, by everyday observation: puddles are a familiar sight on parking lots after a storm, flowing toward drains, while a freshly plowed field rarely puddles the same way. Third, by engineering: parking lots are built with a deliberate slope specifically because their designers expect rain to run off rather than soak in -- nobody grades a field that way.`,
        `Now change one condition and check that the answer moves with it. Suppose the field had not been plowed in years and had become packed hard by foot traffic instead, closer to the pavement's own behavior. Less of the rain would infiltrate than in the freshly plowed case, and more of it would show up as runoff -- the surface material changed, and the split between runoff and infiltration changed right along with it.`,
      ],
      example: { problem: `A heavy, sudden storm drops the same amount of rain on two surfaces at once: a large paved parking lot, and an open dirt field next to it that was plowed the week before. Trace what happens to the rain on each surface, and explain why the two surfaces behave so differently.`, solution: `Almost all the rain on the parking lot becomes runoff, because the sealed, impermeable pavement blocks infiltration; on the plowed field, much more of the same rain infiltrates, because the loosened, permeable soil has open ground for it to soak into.` },
      relatedLoIds: ['m6sci.the-water-cycle-groundwater-and-runoff'],
    },
    {
      title: 'Worked water table and wells',
      steps: [
        `Recall the definition: the water table is the top of the saturated zone, and a well only reaches water once it passes below that boundary.`,
        `Compare the well's depth to the water table's depth before the drought: the well reaches 40 meters, and the water table sits at 12 meters. Since 40 is greater than 12, the bottom of the well lies well below the water table, inside the saturated zone.`,
        `Find the margin: 40 meters minus 12 meters equals 28 meters. The well reaches 28 meters below the water table.`,
        `WRONG: "any well that is drilled deep enough always finds water eventually, since water is everywhere underground." CORRECT: "a well finds water only once it passes below the water table into the saturated zone -- a well that stops above that boundary, in the zone where air is still mixed among the soil, comes up dry no matter how deep it seemed."`,
        `Now the drought scenario. The well itself is still 40 meters deep -- nobody re-drilled it. Only the water table moved, dropping from 12 meters to 25 meters. New margin: 40 meters minus 25 meters equals 15 meters. The well still reaches 15 meters below the water table, so it still finds water, but with a much smaller margin than the 28 meters it started with.`,
        `Check both answers with three different kinds of clues. First, definitional: in both cases the well's depth (40 meters) is compared against the water table's depth, and staying below it is what keeps the well wet. Second, arithmetic consistency: both subtractions (40 minus 12, and 40 minus 25) give a positive number, confirming the well still passes the water table in both cases. Third, a contrasting comparison: a shallower well drilled to only 20 meters would already be dry after the drought, since 20 meters is above the 25-meter water table -- showing the same well is not automatically safe from a dropping water table forever.`,
        `Now change one more condition and check that the answer moves. If pumping without adequate recharge dropped the water table all the way to 45 meters, the 40-meter well would then sit above the water table entirely, and it would run dry -- the well did not change, but a water table that drops far enough can turn a working well into a dry one.`,
      ],
      example: { problem: `A town drills a well 40 meters deep. Local records show the water table under the town sits 12 meters below the surface. Does the well reach water, and if so, how far below the water table does it reach? Then, a drought season passes with heavy pumping and little recharge, and the water table drops to 25 meters. Does the well still reach water, and by how much less of a margin?`, solution: `Yes before the drought: the 40-meter well reaches 28 meters below the 12-meter water table. Yes after the drought too, but with a smaller margin: the water table drops to 25 meters, leaving the same 40-meter well only 15 meters below it.` },
      relatedLoIds: ['m6sci.the-water-cycle-groundwater-and-runoff'],
    },
  ],
  pointers: [
    { content: `Students often say "Groundwater is basically a hidden river or lake flowing through empty caves under the ground." — Below the water table, in the saturated zone, water does not sit in open caves. It fills the small spaces between grains of soil and cracks in rock -- the same spaces that hold a mix of air and water above the water table and are completely filled with water below it. An aquifer is that saturated, permeable rock or sediment itself, not a hollow tunnel running through it. Open underground caves with flowing water do exist in a few places, but they are a rare exception, not what groundwater generally looks like.`, kind: 'common-error' },
    { content: `Students often say "Once rain soaks into the soil, that water is gone from the water cycle for good." — Infiltrated water stays part of the water cycle. It can be taken up by a plant's roots and later released back into the atmosphere as water vapor through transpiration. It can also be pumped up through a well, or reach the saturated zone and stay stored there until recharge and use change how much is there. Nothing that infiltrates leaves the water cycle -- it only moves into a different part of the same cycle.`, kind: 'common-error' },
    { content: `Once precipitation reaches the surface, it takes one of three paths: flowing across the surface as runoff, soaking into the ground as infiltration, or, once underground, being taken up by a plant's roots.`, kind: 'tip' },
    { content: `Runoff happens when rain falls faster than the ground can absorb it, or lands on ground that blocks infiltration; runoff gathers into streams, then rivers, and reaches a lake or the ocean.`, kind: 'tip' },
    { content: `Permeable ground, like sand and gravel, lets water soak through quickly. Impermeable ground, like packed clay or solid, uncracked rock, blocks water or lets very little through.`, kind: 'tip' },
    { content: `The water table is the underground boundary where soil and rock spaces stop holding a mix of air and water and start being completely filled with water -- the zone below it is the saturated zone.`, kind: 'tip' },
    { content: `An aquifer is a body of permeable rock or sediment whose saturated zone holds enough water to supply a well; a well must reach below the water table to draw up any water.`, kind: 'tip' },
    { content: `Recharge is infiltrating rain and melted snow adding water to the saturated zone, raising the water table; pumping water out faster than recharge replaces it lowers the water table and can dry up a well.`, kind: 'tip' },
    { content: `Some infiltrated water is taken up by plant roots. That water does not leave the water cycle -- much of it later returns to the atmosphere as water vapor through transpiration.`, kind: 'tip' },
    { content: `Groundwater fills the small spaces between grains of soil and cracks in rock -- it is not flowing through open underground rivers or caves.`, kind: 'tip' },
    { content: `Don't say water 'disappears' when it infiltrates. Infiltration is a PATH, not an exit from the water cycle. That water either reaches an aquifer, gets taken up by plant roots, or flows underground to a stream.`, kind: 'common-error' },
    { content: `A well comes up DRY if it stops ABOVE the water table, even if it's very deep. The well must pass below the water table into the saturated zone to reach water.`, kind: 'gotcha' },
    { content: `Permeable vs. impermeable describes the GROUND, not the water. Permeable ground LET water through; impermeable ground BLOCKS it. Don't mix them up.`, kind: 'vocab-note' },
    { content: `Groundwater is NOT hidden rivers in caves. Below the water table, water fills tiny spaces between soil grains and cracks in rock—like a fully soaked sponge, not a tunnel.`, kind: 'edge-case' },
    { content: `When the water table DROPS (drought, heavy pumping), a well that used to reach water can run dry. The well didn't move—the water table did.`, kind: 'common-error' },
    { content: `Transpiration is water vapor leaving a PLANT going into the AIR, not water in the soil. Once a plant takes up infiltrated water, transpiration sends much of it back to the atmosphere.`, kind: 'vocab-note' },
    { content: `Same rainstorm, different ground = different amounts of runoff vs. infiltration. Sandy soil near clay soil: one puddle dries, one stays wet. Check what the ground is made of first.`, kind: 'tip' },
    { content: `Recharge means water seeping DOWN into the aquifer, raising the water table. If pumping removes MORE water than recharge adds, the water table DROPS and wells can fail.`, kind: 'vocab-note' },
  ],
};
