/**
 * Grade 6 Science (Earth & Space Science) — Human Activity & Earth's
 * Systems: The Carbon Cycle in Rocks, Ocean & Air.
 *
 * CONCEPT-LED row (NGSS ESS2.A, foundational to MS-ESS3-5) for the m6sci
 * fan-out. This lesson builds one picture: carbon moving among three
 * reservoirs -- the atmosphere (as carbon dioxide gas), the ocean (as
 * dissolved carbon), and the geosphere (as carbon locked in rock, mostly
 * carbonate rock such as limestone) -- through named pathways: volcanic
 * outgassing (geosphere to atmosphere), direct gas exchange at the ocean's
 * surface (atmosphere and ocean, both directions), chemical weathering on
 * land (atmosphere to ocean, carried by rivers), carbonate rock forming on
 * the ocean floor (ocean to geosphere), and the very slow return of
 * rock-locked carbon to the atmosphere through plate motion and volcanic
 * activity (geosphere back to atmosphere). Like the rock cycle, this cycle
 * has no dead end and no required starting point -- any reservoir can both
 * receive carbon and give it back, given enough time.
 *
 * The trap this row is built to name and route around is the organism-level
 * carbon cycle -- photosynthesis and respiration -- which is the first
 * explanation most sources reach for and is exactly the sideways step into
 * Grade 7 life science this file must not take.
 *
 * SCOPE GUARD: this plan stays at the geosphere/atmosphere/ocean level of
 * the carbon cycle and nowhere else. Boundaries, stated so a reviewer can
 * check each one:
 *   - GRADE 7 LIFE SCIENCE boundary, the sharpest one in this file. The
 *     sentence this lesson deliberately never writes is: "Living things
 *     take in carbon dioxide and release it again through photosynthesis
 *     and respiration." That is the organism-level carbon cycle, and it is
 *     Grade 7 ecosystem territory. No plant, animal, cell, or living thing
 *     of any kind moves carbon anywhere in this file; every pathway here is
 *     rock, water, and air acting on each other, with no organism as either
 *     source or destination.
 *   - SIBLING ROW 10.2 (the very next lesson, evidence for rising global
 *     temperatures) owns graphed temperature and atmospheric-carbon-dioxide
 *     data over the past century and its connection to human fossil-fuel
 *     use. This file never states a current carbon dioxide level, a warming
 *     trend, a fossil fuel, or any human activity; it traces the natural
 *     cycle only, operating on a geologic timescale, and makes no argument
 *     about the direction or rate of any recent change.
 *   - ROW 10.3 (monitoring and reducing human impact) owns evaluating a
 *     human policy, filter, or mitigation design. Nothing in this file
 *     evaluates one.
 *   - ROW 7.1 (Earth's Four Spheres Interacting) already introduced the
 *     geosphere, hydrosphere, atmosphere, and biosphere generally, and the
 *     three-part "which two spheres, what moved, which direction" template.
 *     This file assumes "geosphere" and "atmosphere" as already-named
 *     places and does not re-teach the four-spheres framework itself. It
 *     also never writes "hydrosphere" -- it writes "ocean," matching this
 *     row's own curriculum scope line, which names the ocean specifically
 *     rather than the broader hydrosphere.
 *   - ROW 7.4 (Weathering, Erosion & Deposition by Water) and UNIT 3's rows
 *     (3.3 the three rock types, 3.4 the rock cycle) already own the
 *     general mechanics of chemical weathering and rock transformation.
 *     This file reuses "chemical weathering" only for its carbon-specific
 *     outcome -- rainwater carrying a small amount of atmospheric carbon
 *     dioxide onto rock, and dissolved carbon ending up carried by a river
 *     -- and never re-teaches the mechanical-versus-chemical distinction or
 *     asks the student to classify a rock by how it formed.
 *   - UNIT 4 (plate tectonics, already taught earlier in this course) is
 *     used only as an established fact: plate motion can carry rock
 *     underground at a plate boundary. This file does not re-teach mantle
 *     convection, boundary types, or why plates move.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: no chemical formula anywhere (no
 *     "CO2," no "CaCO3"), no chemical equation, no atomic-level account of
 *     how carbon and calcium combine, and no heat-transfer mechanism for
 *     why deep rock changes. Every substance is named in words -- "carbon
 *     dioxide," "dissolved carbon," "calcium carbonate" -- and every
 *     process is described by WHAT it does, never by WHY at the particle
 *     level.
 *   - No figure in this file is a precise reservoir size, flux, or
 *     residence time. Every size or duration comparison is qualitative
 *     ("far more carbon is stored in rock than in the ocean and atmosphere
 *     combined," "carbon can stay locked in rock far longer than it stays
 *     in the air or the ocean") because exact figures for these are not on
 *     the contract's safe-figure list and shift with ongoing measurement.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. The cycle is
 * written out as named pathways between named reservoirs, and every item
 * is solvable from the text printed inside it. Never write "see the
 * diagram above."
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U10_THE_CARBON_CYCLE_IN_ROCKS_OCEAN_AND_AIR: LessonPlan = {
  id: 'evelyn.ms.m6sci.the-carbon-cycle-in-rocks-ocean-and-air.v1',
  title: 'The Carbon Cycle in Rocks, Ocean & Air',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.the-carbon-cycle-in-rocks-ocean-and-air',
      standard: 'M6SCI-10.1',
      description:
        'Trace carbon moving between the atmosphere, ocean, and geosphere (as carbon dioxide, dissolved carbon, and carbonate rock), keeping the cycle at the geosphere/atmosphere/ocean level rather than the organism-level carbon cycling covered in Grade 7\'s ecosystems units (DCI ESS2.A, foundational to MS-ESS3-5).',
    },
  ],
  prerequisites: ['m6sci.forecasting-and-preparing-for-weather-hazards'],
  followUps: ['m6sci.evidence-for-rising-global-temperatures'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from something the student has watched happen and reframe it as a reservoir exchange, without naming the ocean yet.',
      script:
        'Crack open a bottle of soda and it fizzes -- tiny bubbles race up through the liquid and pop at the surface, one after another, until the fizzing finally settles down. Nothing was added to that bottle. Gas that had been dissolved in the liquid is simply leaving it and joining the air above. Now picture something enormous built on that exact same idea: an entire ocean, constantly trading gas with the entire atmosphere above it, one tiny exchange at a time, all day, every day. That is one piece of a much bigger picture. Today we trace carbon as it moves between three huge storage places on Earth -- the air, the ocean, and solid rock -- and the biggest surprise is that none of those three places holds onto carbon forever.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-carbon-reservoirs',
      kind: 'concept',
      goal: 'Name the three carbon reservoirs and the pathways that move carbon between them, and install the no-dead-end rule as the central idea.',
      keyIdeas: [
        'CARBON IS STORED IN THREE BIG RESERVOIRS. A RESERVOIR is just a place where something is stored for a while. Carbon on Earth is stored in three huge reservoirs: the ATMOSPHERE, where it exists mostly as carbon dioxide gas; the OCEAN, where a large amount of carbon is dissolved directly in the water; and the GEOSPHERE, where carbon is locked inside solid rock, mostly as carbonate rock such as limestone. Just like a rock moving through the rock cycle, carbon does not sit still in any one reservoir forever -- it is always moving along one pathway or another.',
        'GEOSPHERE TO ATMOSPHERE: VOLCANIC OUTGASSING. Deep inside Earth, some carbon is trapped in rock and in melted rock. When a volcano erupts, it releases gas from deep underground straight into the sky, and carbon dioxide is part of that gas. This pathway, carbon moving from the geosphere into the atmosphere through an eruption, is called VOLCANIC OUTGASSING.',
        'ATMOSPHERE AND OCEAN TRADE GAS DIRECTLY, IN BOTH DIRECTIONS. At the ocean\'s surface, carbon dioxide gas from the air can dissolve directly into the water, the same kind of exchange as the fizz in a soda bottle, just far slower and on a far larger scale. That exchange also runs the other way: dissolved carbon already in the ocean can leave the water and enter the air. Which direction wins at a given place and time depends on conditions there, but the exchange itself is always two-way, never a one-way drain in only one direction.',
        'ATMOSPHERE TO OCEAN BY WAY OF LAND: CHEMICAL WEATHERING AND RIVERS. Rainwater falling through the atmosphere picks up a small amount of carbon dioxide gas on the way down and becomes slightly acidic. That slightly acidic rainwater slowly reacts with rock on land, and the dissolved carbon it picks up does not stay on land -- rivers carry it onward until it eventually reaches the ocean. This pathway starts in the atmosphere and ends in the ocean, even though rock on land is where the reaction actually happens partway through.',
        'OCEAN TO GEOSPHERE: CARBONATE ROCK FORMS ON THE OCEAN FLOOR. Once dissolved carbon and dissolved calcium are both present in ocean water, they can become part of solid calcium carbonate. Over long stretches of time, that solid material can build up on the ocean floor in thick layers and become carbonate rock, such as limestone. That newly formed rock is now carbon stored in the geosphere -- carbon that started the trip as gas in the atmosphere has ended up locked in solid rock.',
        'GEOSPHERE BACK TO ATMOSPHERE, THE SLOW WAY: PLATE MOTION CLOSES THE LOOP. Plate motion can carry carbonate rock down into deeper, hotter parts of Earth at certain plate boundaries. There, heat and pressure can break the rock down and free the carbon it has been holding, and that freed carbon can rise and reach the atmosphere again through a later volcanic eruption -- the same outgassing pathway named above, now running on rock that started out as ocean sediment instead of rock that had been underground all along. No reservoir is a permanent trap. Far more carbon is stored in rock than in the ocean and the atmosphere combined, and carbon can stay locked in rock for a far longer stretch of time than it stays in the air or the ocean -- but even rock eventually lets some of it go.',
      ],
      vocabulary: [
        { term: 'reservoir', definition: 'a place where something, such as carbon, is stored for a while before moving on.' },
        { term: 'volcanic outgassing', definition: 'carbon dioxide and other gases moving from deep underground into the atmosphere through a volcanic eruption.' },
        { term: 'chemical weathering', definition: 'here, rainwater carrying a small amount of atmospheric carbon dioxide reacting slowly with rock on land, producing dissolved carbon that a river can carry away.' },
        { term: 'dissolved carbon', definition: 'carbon that is mixed directly into liquid water rather than existing as a gas or as part of solid rock.' },
        { term: 'carbonate rock', definition: 'solid rock, such as limestone, made mostly of calcium carbonate that has built up and hardened over a long stretch of time.' },
      ],
      suggestedTools: ['show_diagram', 'show_cycle_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-volcano-to-ocean',
      kind: 'worked_example',
      problem:
        'A volcano along a coastline erupts. Among the gases shooting high into the sky is carbon dioxide that had been trapped deep in rock underground. Over the following weeks, some of that same carbon dioxide, now mixed into the air, slowly dissolves into the surface waters of the ocean nearby. Trace which reservoirs the carbon passed through, in order, and name the process that moved it at each step.',
      steps: [
        'Identify the starting reservoir. The problem states the carbon dioxide had been trapped deep in rock underground, so it started in the geosphere.',
        'Name the first move. The volcanic eruption released that trapped gas straight from deep underground into the sky. Carbon moving from the geosphere into the atmosphere through an eruption is volcanic outgassing.',
        'Name the second move. Once the carbon dioxide was mixed into the air, some of it dissolved directly into the ocean\'s surface water. Carbon dioxide gas moving from the atmosphere into the ocean by dissolving directly into it is the direct gas exchange between those two reservoirs.',
        'WRONG: "The carbon dioxide reached the ocean because rainwater carried it there through rock on land." CORRECT: "This story never mentions rain or rock on land -- the gas dissolved directly into the ocean\'s surface water from the air above it. Rainwater carrying dissolved carbon through rock is a different pathway, used when the story actually describes rain falling on land."',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Source: nothing already in the atmosphere produces new carbon dioxide out of nothing, so gas appearing during an eruption has to have come from underground, matching outgassing. Timing: the ocean\'s carbon dioxide rises gradually over the following weeks rather than all at once, matching a slow surface-to-surface gas exchange rather than a sudden dump of liquid. Setting: the volcano sits along a coastline, so the ocean is right there to receive gas mixed into the nearby air, with no long overland trip needed. Three different kinds of evidence, one answer.',
        'Second, change one condition and check that the answer moves with it. Picture the same eruption happening deep inland, hundreds of kilometers from any ocean. The carbon dioxide would still leave the geosphere and enter the atmosphere through outgassing, but reaching the ocean afterward would most plausibly happen by a completely different pathway -- carried down eventually by rain and rivers, rather than dissolving directly from nearby air into nearby water. Move the volcano, and the second half of the story has to change with it.',
      ],
      answer:
        'Geosphere to atmosphere by volcanic outgassing, then atmosphere to ocean by direct gas exchange at the ocean\'s surface.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-limestone-and-the-loop',
      kind: 'worked_example',
      problem:
        'A geologist studies a thick layer of limestone exposed on a mountainside, far from any ocean today. She explains that the calcium carbonate making up this rock originally formed from carbon dissolved in ocean water hundreds of millions of years ago. Explain how carbon that started out as gas in the atmosphere could have ended up locked in that rock, and then explain whether that same carbon is trapped there permanently.',
      steps: [
        'Start at the atmosphere, since that is where the carbon began. Rainwater falling through the atmosphere picked up a small amount of carbon dioxide gas and became slightly acidic; that slightly acidic rainwater reacted slowly with rock on land, and rivers carried the dissolved carbon it picked up out to the ocean. That is the atmosphere-to-ocean pathway by way of land.',
        'Continue at the ocean. Once that dissolved carbon was in the ocean, along with dissolved calcium already there, it became part of solid calcium carbonate, which settled on the ocean floor in thick layers over a very long stretch of time and hardened into limestone. That is the ocean-to-geosphere pathway.',
        'WRONG: "Once carbon becomes part of solid limestone, it is stored there permanently and cannot move again." CORRECT: "No reservoir in this cycle is a permanent trap. Given enough time, carbon locked in rock can be freed again."',
        'Now answer the permanence question directly. Plate motion can carry rock like this down into deeper, hotter parts of Earth at certain plate boundaries. There, heat and pressure can break the rock down and free the carbon it has been holding, and that freed carbon can reach the atmosphere again through a later volcanic eruption -- the exact same outgassing pathway that starts the cycle over, just running now on rock that began as ocean sediment.',
        'Run the two checks. First, three clues of different kinds that agree. Composition: the rock is described as calcium carbonate, which matches what forms specifically from dissolved carbon and calcium in ocean water, not from any other pathway. Setting: limestone exposed on a mountainside, far from any ocean today, fits rock that formed somewhere else and was later moved and lifted -- consistent with a very long history rather than a recent, unmoved deposit. Timing: "hundreds of millions of years" fits the geologic time scale this whole cycle runs on, not a scale of days or years. Three different kinds of evidence, one consistent story.',
        'Second, change one condition and check that the answer moves. Suppose this same limestone were never carried underground by plate motion, and instead stayed sitting exposed at the surface indefinitely. Without heat and pressure acting on it deep underground, that particular slab of rock would not release its carbon through outgassing -- although it could still be weathered at the surface over time, which is a different pathway back toward the ocean. The heat-and-pressure release pathway specifically depends on the rock actually being carried underground; take that condition away, and that particular return path does not happen.',
      ],
      answer:
        'Atmosphere to ocean by chemical weathering and rivers, then ocean to geosphere as the dissolved carbon becomes part of solid calcium carbonate that hardens into limestone. That carbon is not trapped permanently: plate motion can carry the rock underground, where heat and pressure can free the carbon again and return it to the atmosphere through a later eruption.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-outgassing',
      kind: 'try_yourself',
      problem:
        'A volcano along a coast erupts, and among the gases shooting into the sky is carbon dioxide that had been trapped in rock deep underground for a very long time. Which process moved that carbon from the geosphere into the atmosphere?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Chemical weathering, because rainwater falling on the volcano\'s slopes reacted with the rock and released the trapped carbon dioxide directly into the air as a gas.',
        },
        {
          id: 'b',
          text: 'Ocean absorption, because dissolved carbon already sitting in nearby seawater was pulled up out of the ocean and pushed into the erupting volcano\'s plume.',
        },
        {
          id: 'c',
          text: 'Carbonate rock formation, because the heat of the eruption is what finally allows dissolved carbon already in the ocean to turn solid and form new limestone on the nearby seafloor.',
        },
        {
          id: 'd',
          text: 'Volcanic outgassing, because heat deep inside Earth released carbon dioxide that had been locked in rock, sending it up through the eruption and into the atmosphere.',
          correct: true,
        },
      ],
      expectedAnswer:
        'Volcanic outgassing, because heat deep inside Earth released carbon dioxide that had been locked in rock, sending it up through the eruption and into the atmosphere.',
      hints: [
        'Start by locating where the carbon was before the eruption -- deep in solid rock -- and where it ended up -- in the air. Which reservoir did it start in, and which did it end in?',
        'Two of these choices bring the ocean into a story that never mentions the ocean at all. Which process actually explains carbon trapped deep in rock reaching the sky through an eruption?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-weathering-pathway',
      kind: 'try_yourself',
      problem:
        'Rainwater picks up a small amount of carbon dioxide from the air, becomes slightly acidic, and reacts slowly with rock on land. Rivers then carry the dissolved carbon it picked up onward. Which two reservoirs does this particular pathway connect, and in which direction does the carbon move?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'From the atmosphere into the ocean. The dissolved carbon that rainwater picks up from the air is carried by rivers until it eventually reaches the ocean.',
          correct: true,
        },
        {
          id: 'b',
          text: 'From the ocean into the atmosphere. The rivers described are actually carrying carbon-rich seawater back onto the land, where it evaporates into the air.',
        },
        {
          id: 'c',
          text: 'From the geosphere into the atmosphere. The rock being reacted with releases its own stored carbon dioxide as a gas the instant the rainwater touches it.',
        },
        {
          id: 'd',
          text: 'From the atmosphere into the geosphere directly. The rainwater\'s carbon dioxide becomes permanently fused into the rock the moment it makes contact, with nothing left over for a river to carry.',
        },
      ],
      expectedAnswer:
        'From the atmosphere into the ocean. The dissolved carbon that rainwater picks up from the air is carried by rivers until it eventually reaches the ocean.',
      hints: [
        'Follow where the rainwater\'s dissolved carbon actually goes after it reacts with the rock -- the problem states that rivers carry it somewhere. Where do rivers end up?',
        'The carbon in this pathway starts as a gas in the air, not as something already stored in rock or already in the ocean. Which reservoir does it start in, and which one is doing the carrying?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-closing-the-loop',
      kind: 'try_yourself',
      problem:
        'Over hundreds of millions of years, thick layers of carbonate rock built up on an ancient seafloor. Plate motion has since carried that rock down into deeper, hotter parts of Earth at a plate boundary, where rising heat and pressure are slowly changing it. What can eventually happen to the carbon that has been locked in that rock, and how?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Nothing. Once carbon becomes part of solid rock, it stays there permanently and can never reach the atmosphere or the ocean again.',
        },
        {
          id: 'b',
          text: 'The heat and pressure deep underground can break the rock down and free the carbon it holds, which can then reach the surface and enter the atmosphere again through a later volcanic eruption.',
          correct: true,
        },
        {
          id: 'c',
          text: 'The rock can only release its carbon by melting completely and cooling straight back into a brand-new carbonate rock at the surface, with none of the carbon ever actually leaving the geosphere.',
        },
        {
          id: 'd',
          text: 'The carbon can only move into the ocean directly through the solid rock, seeping out as dissolved carbon into deep seawater without ever entering the atmosphere.',
        },
      ],
      expectedAnswer:
        'The heat and pressure deep underground can break the rock down and free the carbon it holds, which can then reach the surface and enter the atmosphere again through a later volcanic eruption.',
      hints: [
        'Look back at how carbon first got into the atmosphere earlier in this lesson -- something happening deep underground pushed it up and out. Could something similar happen again here?',
        'This scenario describes rock heating up at a plate boundary, which is exactly the kind of setting that can lead to melting and eruption elsewhere at the surface. Does the story ever say the carbon must stay in the rock forever?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-way-and-permanent',
      kind: 'misconception_check',
      question:
        'A student writes: "The ocean only ever soaks up carbon dioxide from the air, it never gives any back. And once carbon becomes part of a rock, it is locked away forever." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'The ocean only ever soaks up carbon dioxide from the air, it never gives any back.',
          misconception:
            'Picturing the atmosphere-ocean exchange as a one-way drain into the ocean, because "the ocean absorbs carbon dioxide" is the direction most often mentioned.',
          correctsTo:
            'The exchange at the ocean\'s surface runs both ways, the same way gas can leave a soda bottle instead of staying dissolved. Carbon dioxide gas from the air can dissolve into the ocean, and dissolved carbon already in the ocean can also leave the water and enter the air. Which direction wins at a given place and time depends on conditions there, but the exchange itself is never a one-way drain in only one direction.',
        },
        {
          answer: 'Once carbon becomes part of a rock, it is locked away forever.',
          misconception:
            'Assuming that solid rock is the end of the line for carbon, because rock looks permanent and unchanging on any timescale a person can observe directly.',
          correctsTo:
            'No reservoir in this cycle is a permanent trap. Plate motion can carry carbon-holding rock down into deeper, hotter parts of Earth at certain plate boundaries. There, heat and pressure can break the rock down and free the carbon it has been holding, letting it reach the atmosphere again through a later volcanic eruption. Carbon can stay locked in rock for a far longer stretch of time than it stays in the air or the ocean, but even rock eventually lets some of it go.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Carbon is stored in three reservoirs: the atmosphere (mostly as carbon dioxide gas), the ocean (as dissolved carbon), and the geosphere (locked in rock, mostly carbonate rock such as limestone).',
        'Volcanic outgassing moves carbon from the geosphere into the atmosphere: a volcanic eruption releases carbon dioxide trapped deep underground into the sky.',
        'The atmosphere and the ocean trade carbon dioxide directly at the ocean\'s surface, in both directions -- the same kind of exchange as fizz leaving a soda bottle, just far slower and on a far larger scale.',
        'Chemical weathering moves carbon from the atmosphere to the ocean by way of land: rainwater picks up carbon dioxide, reacts slowly with rock, and rivers carry the dissolved carbon onward to the ocean.',
        'Dissolved carbon in the ocean can become part of solid calcium carbonate, which builds up on the ocean floor and can harden into carbonate rock, such as limestone -- carbon moving from the ocean into the geosphere.',
        'Plate motion can carry carbonate rock underground at a plate boundary, where heat and pressure can free its carbon and return it to the atmosphere through a later eruption -- closing the loop.',
        'No reservoir is a permanent trap for carbon. Far more carbon is stored in rock than in the ocean and atmosphere combined, and it can stay locked in rock far longer than it stays in the air or the ocean, but even rock eventually lets some of it go.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'The Carbon Cycle in Rocks, Ocean & Air' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
