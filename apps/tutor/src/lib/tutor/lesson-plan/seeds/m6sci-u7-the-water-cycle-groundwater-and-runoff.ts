/**
 * Grade 6 Science (Earth & Space Science) — Water on Earth & Earth's Systems
 * Interacting: The Water Cycle: Groundwater & Runoff.
 *
 * CONCEPT-LED row (NGSS MS-ESS2-4) for the m6sci fan-out. This is the
 * SURFACE/SUBSURFACE half of the water cycle. Row 7.2 (The Water Cycle:
 * Evaporation, Condensation & Precipitation) stops the instant precipitation
 * reaches Earth's surface. This plan picks up at exactly that instant and
 * follows the water down three possible paths: flowing across the surface as
 * runoff, soaking into the ground as infiltration and moving through the
 * water table into the saturated zone and an aquifer, or being taken up by a
 * plant's roots and eventually returned to the atmosphere as water vapor
 * through transpiration.
 *
 * SCOPE GUARD: this plan covers what happens to precipitation from the
 * moment it lands -- runoff, infiltration, the water table, aquifers,
 * recharge and plant uptake -- and stops before the water changes anything
 * about the land it moves across or through. Boundaries, stated so a
 * reviewer can check each one:
 *   - ROW 7.2 (the prerequisite, immediately before this one) owns
 *     evaporation, condensation and precipitation -- the atmospheric half of
 *     the cycle. This plan assumes precipitation has already happened and
 *     never re-teaches how a cloud forms or why rain falls; it treats
 *     "rain falling on the ground" as its starting point, handed off exactly
 *     where row 7.2's own doc comment says its pathway stops.
 *   - ROW 7.4 (the very next lesson, Weathering, Erosion & Deposition by
 *     Water) owns what moving water DOES to rock -- breaking it apart,
 *     carrying it away, and dropping it to build new landforms. This plan
 *     tracks only where the water itself goes, never what it picks up,
 *     carries, or drops along the way. The words "weathering," "erosion,"
 *     "deposition," and "landform" appear nowhere in this file's teaching
 *     content -- the sole exception is the required `followUps` entry,
 *     which cites row 7.4's real LO id, m6sci.weathering-erosion-and-
 *     deposition-by-water, verbatim, as the fan-out contract's chain rule
 *     requires. "Sediment" DOES appear a few times in this file, but only
 *     as a plain material noun describing what an aquifer is made of
 *     ("permeable underground rock or sediment") -- never as part of a
 *     weathering, erosion, or deposition process, which stays row 7.4's.
 *   - ROW 7.1 (Earth's Four Spheres Interacting) already introduces the
 *     hydrosphere, atmosphere and biosphere as three of Earth's four spheres.
 *     This plan assumes that introduction and does not re-teach it.
 *   - ROW 9.1 (Renewable & Nonrenewable Resources) owns classifying
 *     groundwater, or any resource, as renewable or nonrenewable. This plan
 *     states that recharge can be slower than pumping, because that fact is
 *     required to explain why a water table drops, but it never uses the
 *     word "renewable" and never classifies groundwater by that framework.
 *   - PERMEABILITY boundary, stated as its own item because it is the one
 *     most likely to drift toward Grade 8: this plan describes ONLY the
 *     observable outcome -- sand and gravel let rain soak through quickly;
 *     packed clay and solid, uncracked rock block it or let very little
 *     through. It never explains WHY, and the sentence it deliberately does
 *     not write is: "water moves faster through permeable ground because the
 *     gaps between its grains are wider than through impermeable ground,
 *     where the grains are packed too tightly or too fine for water to pass
 *     between them." That grain-scale, material-physics account of why
 *     permeability differs is Grade 8 physical science and appears nowhere
 *     in this file. Describing the underground water table itself still
 *     requires saying that the spaces in soil and rock hold air and water
 *     above it and only water below it -- that is a description of WHERE
 *     water sits, not an explanation of WHY one material passes water and
 *     another does not, and it is the minimum needed to define the water
 *     table at all.
 *   - GRADE 8 PHYSICAL SCIENCE boundary, beyond permeability: no rate of
 *     flow is calculated, no volume of water is computed from a flow rate,
 *     and no force, pressure, or particle-level account of matter appears
 *     anywhere in this file. Depths in the worked examples and try_yourself
 *     items are subtracted from one another (simple, small, invented
 *     numbers, not real measured sites), never turned into a rate over time.
 *   - GRADE 7 LIFE SCIENCE boundary: plant uptake is explicitly this row's
 *     to teach, per the curriculum's own scope line, but it is taught at the
 *     Earth-systems level only -- water moves from soil into a plant and,
 *     eventually, from the plant back into the atmosphere as water vapor,
 *     which is the water-cycle vocabulary term "transpiration." Nothing here
 *     describes root structure, a cell, a vascular tissue, or photosynthesis;
 *     the plant appears only as one more reservoir the water passes through
 *     on its way back into the atmospheric half of the cycle that row 7.2
 *     already built.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. The
 * underground structure this lesson describes -- the water table, the
 * saturated zone, an aquifer -- is normally taught from a cutaway diagram
 * nobody in this course can see. Every position and boundary below is
 * written out in words precise enough to reason from, following the same
 * discipline the Earth's-layered-structure row (3.1) uses for the planet's
 * interior: name the zones, name what separates them, and never write "see
 * the cross-section below."
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U7_THE_WATER_CYCLE_GROUNDWATER_AND_RUNOFF: LessonPlan = {
  id: 'evelyn.ms.m6sci.the-water-cycle-groundwater-and-runoff.v1',
  title: 'The Water Cycle: Groundwater & Runoff',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.the-water-cycle-groundwater-and-runoff',
      standard: 'M6SCI-7.3',
      description:
        'Model how precipitation becomes surface runoff, infiltrates into groundwater, or is taken up by plants, in the surface/subsurface portion of the water cycle (shares MS-ESS2-4 with Topic 2 as a coarse split between the atmospheric and surface/subsurface halves of the cycle).',
    },
  ],
  prerequisites: ['m6sci.the-water-cycle-evaporation-condensation-precipitation'],
  followUps: ['m6sci.weathering-erosion-and-deposition-by-water'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from something the student has watched happen and set up the handoff from row 7.2.',
      script:
        'Think about the last really heavy rain you sat through. Some of that water is gone within an hour: it soaks straight down into a patch of yard and disappears from view. Some of it does something completely different: it runs downhill along a sidewalk, into a gutter, and vanishes down a street drain. And a low spot in a yard might stay a mud puddle for two whole days after the rain has stopped, long after every other patch of ground around it has already dried out. Same rainstorm, same water falling from the sky, three different things happening to it once it lands. The last lesson stopped at exactly that moment -- rain leaving the cloud and reaching the ground. This lesson picks up right there and follows the water three different ways: across the surface, down into the ground, and even up into a plant.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-groundwater-and-runoff',
      kind: 'concept',
      goal: 'Build the three-path model for water that has already reached the surface -- runoff, infiltration to the water table and an aquifer, and plant uptake -- entirely in words.',
      keyIdeas: [
        'THREE PATHS FOR WATER THAT REACHES THE SURFACE. Once precipitation lands, it takes one of three paths. It can flow across the surface as runoff. It can soak into the ground as infiltration. Or, once it has soaked in, it can be taken up by the roots of a plant growing in the soil above. Which path a given amount of rain takes depends mainly on what kind of ground it lands on and how fast the rain is falling.',
        'RUNOFF: WATER FLOWING OVER THE SURFACE. When rain falls faster than the ground beneath it can absorb it, or when it lands on ground that blocks infiltration, the extra water flows downhill across the surface. This flowing water is runoff. Runoff gathers into small channels, those channels join into streams, streams join into rivers, and the water eventually reaches a lake or the ocean -- rejoining a body of water where evaporation can start the atmospheric half of the cycle over again.',
        'INFILTRATION DEPENDS ON WHAT THE GROUND IS MADE OF. Loose ground made of sand or gravel lets rainwater soak in quickly -- a puddle sitting on sand can vanish underground within minutes. Packed clay, or solid rock with no cracks running through it, lets very little water soak through, so water sitting on top of it either stays there or has to run off instead. Ground that lets water soak through easily is called permeable. Ground that blocks water, or lets very little through, is called impermeable. This is why the same rainstorm can leave one patch of ground already dry while a patch right next to it stays a puddle for days: the ground itself is different from one patch to the next.',
        'BELOW THE SURFACE: THE WATER TABLE SPLITS TWO ZONES. Water that infiltrates keeps moving downward. Close to the surface, the small spaces between grains of soil and cracks in rock hold a mixture of air and water -- picture a sponge that is damp but not fully soaked. Farther down, every one of those spaces is completely filled with water, with no air left in them at all -- a fully soaked sponge. The boundary between these two zones is the water table. Above the water table, spaces hold air and water together. Below the water table, in what is called the saturated zone, every space is filled with water.',
        'AQUIFERS, WELLS AND RECHARGE. A body of permeable underground rock or sediment that holds enough water in its saturated zone to supply a well is called an aquifer. A well has to be drilled down past the water table, into the saturated zone, before it reaches any water to draw up -- a well that stops above the water table comes up dry. Aquifers are refilled by recharge: rain and melted snow that infiltrate and seep down, adding water to the saturated zone and raising the water table. If water is pumped out of an aquifer faster than recharge can replace it, the water table drops, and wells that once reached water can run dry.',
        'PLANT UPTAKE: A THIRD DESTINATION FOR INFILTRATED WATER. Not all infiltrated water reaches the saturated zone. Some of it, still close to the surface, is taken up by the roots of a plant growing there. That water does not leave the water cycle. Much of it later passes back into the atmosphere as water vapor, released from the plant in a process called transpiration -- rejoining the same atmospheric pathway of rising, cooling and falling again that the last lesson already built.',
      ],
      vocabulary: [
        { term: 'runoff', definition: 'water flowing across the surface of the land instead of soaking into the ground.' },
        { term: 'infiltration', definition: 'water soaking down into the ground from the surface.' },
        { term: 'water table', definition: 'the underground boundary where the spaces in soil and rock change from holding a mix of air and water above it to being completely filled with water below it.' },
        { term: 'saturated zone', definition: 'the underground zone below the water table, where every open space in the soil or rock is filled with water.' },
        { term: 'aquifer', definition: 'a body of permeable underground rock or sediment whose saturated zone holds enough water to supply a well.' },
        { term: 'transpiration', definition: 'water vapor released into the atmosphere from a plant, after the plant took up water from the soil through its roots.' },
      ],
      suggestedTools: ['show_diagram', 'show_cycle_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-runoff-vs-infiltration',
      kind: 'worked_example',
      problem:
        'A heavy, sudden storm drops the same amount of rain on two surfaces at once: a large paved parking lot, and an open dirt field next to it that was plowed the week before. Trace what happens to the rain on each surface, and explain why the two surfaces behave so differently.',
      steps: [
        'Start with the parking lot. Pavement is a packed, sealed material built specifically to keep water from soaking through it, so it is impermeable -- almost none of the rain can infiltrate.',
        'With infiltration blocked, the rain on the parking lot has nowhere to go but the surface itself. Once it exceeds any low spots, it starts flowing downhill across the pavement -- that is runoff, which is exactly why parking lots are built with a slope and storm drains at the bottom of it.',
        'Now the plowed field. Loosened, dug-up soil is permeable: the storm\'s rain has open ground to soak into, so much more of it infiltrates rather than pooling on top.',
        'WRONG: "the rain on the parking lot must be soaking in slowly, we just cannot see it happening." CORRECT: "pavement is deliberately sealed so that essentially none of the rain infiltrates at all -- that is why cities build storm drains to carry the runoff away, rather than counting on the pavement to absorb it."',
        'Check the answer with three different kinds of clues. First, by material: pavement is a sealed, impermeable surface by design, and loosened soil is permeable by comparison -- that alone predicts more runoff from the lot and more infiltration into the field. Second, by everyday observation: puddles are a familiar sight on parking lots after a storm, flowing toward drains, while a freshly plowed field rarely puddles the same way. Third, by engineering: parking lots are built with a deliberate slope specifically because their designers expect rain to run off rather than soak in -- nobody grades a field that way.',
        'Now change one condition and check that the answer moves with it. Suppose the field had not been plowed in years and had become packed hard by foot traffic instead, closer to the pavement\'s own behavior. Less of the rain would infiltrate than in the freshly plowed case, and more of it would show up as runoff -- the surface material changed, and the split between runoff and infiltration changed right along with it.',
      ],
      answer:
        'Almost all the rain on the parking lot becomes runoff, because the sealed, impermeable pavement blocks infiltration; on the plowed field, much more of the same rain infiltrates, because the loosened, permeable soil has open ground for it to soak into.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-water-table-and-wells',
      kind: 'worked_example',
      problem:
        'A town drills a well 40 meters deep. Local records show the water table under the town sits 12 meters below the surface. Does the well reach water, and if so, how far below the water table does it reach? Then, a drought season passes with heavy pumping and little recharge, and the water table drops to 25 meters. Does the well still reach water, and by how much less of a margin?',
      steps: [
        'Recall the definition: the water table is the top of the saturated zone, and a well only reaches water once it passes below that boundary.',
        'Compare the well\'s depth to the water table\'s depth before the drought: the well reaches 40 meters, and the water table sits at 12 meters. Since 40 is greater than 12, the bottom of the well lies well below the water table, inside the saturated zone.',
        'Find the margin: 40 meters minus 12 meters equals 28 meters. The well reaches 28 meters below the water table.',
        'WRONG: "any well that is drilled deep enough always finds water eventually, since water is everywhere underground." CORRECT: "a well finds water only once it passes below the water table into the saturated zone -- a well that stops above that boundary, in the zone where air is still mixed among the soil, comes up dry no matter how deep it seemed."',
        'Now the drought scenario. The well itself is still 40 meters deep -- nobody re-drilled it. Only the water table moved, dropping from 12 meters to 25 meters. New margin: 40 meters minus 25 meters equals 15 meters. The well still reaches 15 meters below the water table, so it still finds water, but with a much smaller margin than the 28 meters it started with.',
        'Check both answers with three different kinds of clues. First, definitional: in both cases the well\'s depth (40 meters) is compared against the water table\'s depth, and staying below it is what keeps the well wet. Second, arithmetic consistency: both subtractions (40 minus 12, and 40 minus 25) give a positive number, confirming the well still passes the water table in both cases. Third, a contrasting comparison: a shallower well drilled to only 20 meters would already be dry after the drought, since 20 meters is above the 25-meter water table -- showing the same well is not automatically safe from a dropping water table forever.',
        'Now change one more condition and check that the answer moves. If pumping without adequate recharge dropped the water table all the way to 45 meters, the 40-meter well would then sit above the water table entirely, and it would run dry -- the well did not change, but a water table that drops far enough can turn a working well into a dry one.',
      ],
      answer:
        'Yes before the drought: the 40-meter well reaches 28 meters below the 12-meter water table. Yes after the drought too, but with a smaller margin: the water table drops to 25 meters, leaving the same 40-meter well only 15 meters below it.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-runoff-on-pavement',
      kind: 'try_yourself',
      problem:
        'A sudden downpour falls on a large parking lot. Almost none of the rain soaks into the pavement. What happens to that rainwater instead?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It slowly seeps straight down through the pavement itself, the same way it would through sand, and eventually reaches the saturated zone below.' },
        { id: 'b', text: 'It evaporates directly off the hot pavement before it has a chance to soak in, run off, or do anything else with the rest of the storm.' },
        { id: 'c', text: 'It flows across the surface of the parking lot as runoff, because the packed, sealed pavement blocks the rain from soaking in at all.', correct: true },
        { id: 'd', text: 'It is drawn underground by plant roots growing through cracks in the pavement, the same way roots take up water from soil in a garden.' },
      ],
      expectedAnswer: 'It flows across the surface of the parking lot as runoff, because the packed, sealed pavement blocks the rain from soaking in at all.',
      hints: [
        'Pavement is built from packed, sealed material specifically so that very little water can pass through it. Start by ruling out any path that assumes the rain soaks straight through it.',
        'With soaking-in ruled out, and with far more water falling than could evaporate away in the moment, ask where the leftover water has to go: does it stay in place, or does it move somewhere across the surface?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-naming-the-water-table',
      kind: 'try_yourself',
      problem:
        'A hole is dug straight down from the surface. In the upper part, the spaces between soil grains hold a mix of air and water. Farther down, every space between grains is completely filled with water, with no air left at all. What is the name for the boundary between these two zones, and which zone lies below it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The boundary is called an aquifer, borrowing that word for anything underground, and the zone below it is called recharge -- though recharge actually names the refilling process, not a zone.' },
        { id: 'b', text: 'The boundary is called the crust, matching the term for Earth\'s outermost rock layer, and the zone below it is the mantle, going deeper toward the center.' },
        { id: 'c', text: 'The boundary is called runoff, mixing up the earlier water-cycle term for water flowing over the surface with a completely different underground boundary, and infiltration is the zone below it.' },
        { id: 'd', text: 'The boundary is called the water table, and the zone below it is the saturated zone, where every space between soil and rock particles is completely filled with water.', correct: true },
      ],
      expectedAnswer: 'The boundary is called the water table, and the zone below it is the saturated zone, where every space between soil and rock particles is completely filled with water.',
      hints: [
        'One of these zones still has some air mixed in with the water, and the other has every space completely full of water. The boundary this question asks about sits between them.',
        'Two of these choices reuse a word from a different part of this course, or a different part of the water cycle, and apply it to a boundary it does not actually name. Rule those out first.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-well-depth-vs-water-table',
      kind: 'try_yourself',
      problem:
        'A well is drilled to a depth of 18 meters below the surface. Records show the water table in that area sits at a depth of 22 meters below the surface. Does the well reach water, and why or why not?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No, the well stops at 18 meters, which is shallower than the 22-meter water table, so it never reaches the saturated zone and comes up dry.', correct: true },
        { id: 'b', text: 'Yes, because any well drilled underground eventually strikes some amount of groundwater, no matter how its depth compares with the water table.' },
        { id: 'c', text: 'No, because 18 meters is deeper than the 22-meter water table, so the well has already passed all the way through the saturated zone and out the other side.' },
        { id: 'd', text: 'Yes, because the well passes through solid rock on its way down, and all underground rock holds some water regardless of its depth or the water table.' },
      ],
      expectedAnswer: 'No, the well stops at 18 meters, which is shallower than the 22-meter water table, so it never reaches the saturated zone and comes up dry.',
      hints: [
        'Compare the two numbers directly: is 18 meters a smaller number or a larger number than 22 meters? A smaller number means the well stops closer to the surface.',
        'A well only reaches water once it passes below the water table into the saturated zone. If a well stops above that boundary, it stays in the zone where some spaces still hold air instead of water.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-underground-rivers-and-disappearing-water',
      kind: 'misconception_check',
      question:
        'A student says: "Groundwater is basically a hidden river or lake flowing through empty caves under the ground, and once rain soaks into the soil, that water is gone from the water cycle for good." Two different things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Groundwater is basically a hidden river or lake flowing through empty caves under the ground.',
          misconception:
            'Picturing underground water the same way surface water looks -- an open river or lake -- because that is the only shape moving water takes in everyday experience above ground.',
          correctsTo:
            'Below the water table, in the saturated zone, water does not sit in open caves. It fills the small spaces between grains of soil and cracks in rock -- the same spaces that hold a mix of air and water above the water table and are completely filled with water below it. An aquifer is that saturated, permeable rock or sediment itself, not a hollow tunnel running through it. Open underground caves with flowing water do exist in a few places, but they are a rare exception, not what groundwater generally looks like.',
        },
        {
          answer: 'Once rain soaks into the soil, that water is gone from the water cycle for good.',
          misconception:
            'Treating infiltration as an ending point, the same way row 7.2\'s pathway seemed to end once precipitation reached the surface.',
          correctsTo:
            'Infiltrated water stays part of the water cycle. It can be taken up by a plant\'s roots and later released back into the atmosphere as water vapor through transpiration. It can also be pumped up through a well, or reach the saturated zone and stay stored there until recharge and use change how much is there. Nothing that infiltrates leaves the water cycle -- it only moves into a different part of the same cycle.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Once precipitation reaches the surface, it takes one of three paths: flowing across the surface as runoff, soaking into the ground as infiltration, or, once underground, being taken up by a plant\'s roots.',
        'Runoff happens when rain falls faster than the ground can absorb it, or lands on ground that blocks infiltration; runoff gathers into streams, then rivers, and reaches a lake or the ocean.',
        'Permeable ground, like sand and gravel, lets water soak through quickly. Impermeable ground, like packed clay or solid, uncracked rock, blocks water or lets very little through.',
        'The water table is the underground boundary where soil and rock spaces stop holding a mix of air and water and start being completely filled with water -- the zone below it is the saturated zone.',
        'An aquifer is a body of permeable rock or sediment whose saturated zone holds enough water to supply a well; a well must reach below the water table to draw up any water.',
        'Recharge is infiltrating rain and melted snow adding water to the saturated zone, raising the water table; pumping water out faster than recharge replaces it lowers the water table and can dry up a well.',
        'Some infiltrated water is taken up by plant roots. That water does not leave the water cycle -- much of it later returns to the atmosphere as water vapor through transpiration.',
        'Groundwater fills the small spaces between grains of soil and cracks in rock -- it is not flowing through open underground rivers or caves.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'The Water Cycle: Groundwater & Runoff' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
