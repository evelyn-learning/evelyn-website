/**
 * Grade 6 Science (Earth & Space Science) — Water on Earth & Earth's Systems
 * Interacting: Earth's Four Spheres Interacting.
 *
 * CONCEPT-LED row (NGSS MS-ESS2-1) for the m6sci fan-out. This lesson
 * introduces Earth as one system built from four interacting parts -- the
 * geosphere, hydrosphere, atmosphere, and biosphere -- and teaches the one
 * skill the whole row is built around: naming a specific interaction between
 * two of them by stating which two spheres, what is moving (matter or
 * energy), and in which direction. It shares MS-ESS2-1 with Unit 3's
 * rock-type rows (those model the rock cycle specifically; this row models
 * systems-level interaction generally) and is the entry point the two
 * water-cycle lessons that follow (7.2, 7.3) build on.
 *
 * SCOPE GUARD: this plan teaches the four-spheres framework and the skill of
 * tracing ONE concrete interaction in a described scene. It does not teach
 * the detailed mechanism of any single cycle. Boundaries, stated so a
 * reviewer can check each one:
 *   - UNIT 3's rock-type rows (3.3, 3.4) own the rock cycle itself. This plan
 *     uses a river carrying sediment as one interaction example, sharing
 *     MS-ESS2-1 with those rows by design, but it never names igneous,
 *     sedimentary, or metamorphic rock, and it never walks through a
 *     transformation between rock types. That is Unit 3's job.
 *   - ROWS 7.2 and 7.3 (the next two lessons) own the water cycle. This
 *     plan's own explanation states, once, that water moves between the
 *     hydrosphere and the atmosphere and back, because that is the shared
 *     vocabulary those two lessons are built on, and it never names the sun
 *     as an energy source driving that movement. Two other places float a
 *     water-cycle process word, and both do it only to rule the word out as
 *     the answer: one wrong try_yourself choice offers "evaporates" as a
 *     false explanation for wildfire smoke, and one WRONG-labeled sentence
 *     in a worked example offers "condensed" as a false explanation for a
 *     volcanic ash cloud, immediately replaced by the CORRECT sentence's
 *     geosphere-based explanation -- exactly the way the concept-led
 *     exemplar names "eclipse" only to rule it out. Neither occurrence
 *     explains how evaporation or condensation actually works, and
 *     "precipitation", "infiltration", "runoff", and "groundwater" appear
 *     nowhere in this file's own authored prose. (The `followUps` array
 *     separately spells the next lesson's own slug,
 *     `the-water-cycle-evaporation-condensation-precipitation`; that is a
 *     machine id, not taught content.)
 *   - UNIT 6, and specifically row 6.4 (this row's prerequisite), owns
 *     air-mass interactions and severe weather. This plan's atmosphere
 *     examples -- a volcano's ash reaching the sky, a wildfire's smoke
 *     rising into the air -- trace matter entering the atmosphere from
 *     another sphere; they never describe a front, an air mass, or a storm
 *     system.
 *   - GRADE 7 LIFE SCIENCE boundary, the sharpest one in this course: the
 *     biosphere IS one of the four spheres taught here, and living things
 *     appear in every interaction example that needs one (a growing root, a
 *     burning forest). This plan describes only the PHYSICAL, Earth-system-
 *     level fact of what a living thing does to another sphere -- a root
 *     pushes with physical force; burning plant matter releases gas and ash.
 *     The sentence this file deliberately never writes is any sentence about
 *     how a root takes in water and nutrients, how a plant makes its own
 *     food, or how any organism's body works inside -- no cell, no
 *     photosynthesis, no respiration, no growth process appears anywhere in
 *     this file, and the misconception check says this limit out loud.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: energy is named only as a plain
 *     driver -- something inside Earth powers a volcano -- with no
 *     heat-transfer mechanism (conduction, convection, radiation), no
 *     particle-level account of a phase change, and no force calculation
 *     anywhere in this file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every scene
 * used to teach or test an interaction is written out in words precisely
 * enough to reason from. Never write "see the diagram above."
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U7_EARTHS_FOUR_SPHERES_INTERACTING: LessonPlan = {
  id: 'evelyn.ms.m6sci.earths-four-spheres-interacting.v1',
  title: "Earth's Four Spheres Interacting",
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.earths-four-spheres-interacting',
      standard: 'M6SCI-7.1',
      description:
        'Identify the geosphere, hydrosphere, atmosphere, and biosphere in a described scenario and trace one example of matter or energy moving between two of them (shares MS-ESS2-1 with Unit 3\'s rock-type topics: those lessons model the rock cycle specifically, this one models systems-level interaction generally, as the entry point to the water-cycle topics that follow) (NGSS MS-ESS2-1).',
    },
  ],
  prerequisites: ['m6sci.how-air-mass-interactions-produce-severe-weather'],
  followUps: ['m6sci.the-water-cycle-evaporation-condensation-precipitation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from something the student may have noticed and never had to explain, using it to introduce the idea of two Earth "parts" trading material.',
      script:
        'The creek behind a house is usually clear enough that you can see the rocks sitting on the bottom. Then a heavy rainstorm rolls through, and by the next morning the same creek has turned a muddy tan-brown -- you cannot see the bottom at all. A day or two later, once the rain is long gone, the creek runs clear again. Nothing new was poured into that creek. So where did the color come from, and where did it go? The answer involves two of Earth\'s big four "systems" trading material with each other, and today we build the picture that lets you spot a trade like that anywhere -- which two systems are involved, what is actually moving between them, and which direction it is going.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-spheres',
      kind: 'concept',
      goal: 'Introduce the four spheres, give the three-part template for naming a specific interaction, and warn that naming all four spheres present in a scene is not the same as describing one.',
      keyIdeas: [
        'EARTH IS ONE SYSTEM MADE OF FOUR PARTS. Scientists group everything on and around Earth into four "spheres." The word does not mean a ball shape here -- it means a whole share of Earth\'s stuff. The GEOSPHERE is all of Earth\'s solid, rocky material: the crust, the mantle, the core, mountains, soil, and the ocean floor. The HYDROSPHERE is all of Earth\'s water: oceans, lakes, rivers, and ice. The ATMOSPHERE is the layer of gases surrounding Earth, mostly nitrogen and oxygen -- the air. The BIOSPHERE is every living thing on Earth and the places those living things live: plants, animals, and every other organism, on land, in water, and in the air.',
        'NOTHING STAYS INSIDE JUST ONE SPHERE. The four spheres are not separate boxes. Matter -- like water, soil, or gas -- and energy are constantly crossing from one sphere into another. A scene that looks like it is just about rock, or just about water, is usually also about at least one other sphere the moment something moves.',
        'NAMING AN INTERACTION TAKES THREE PARTS. It is not enough to notice that a sphere is present. To describe an actual interaction, state: (1) WHICH TWO spheres are involved, (2) WHAT is moving between them -- name the matter or the energy specifically, and (3) WHICH DIRECTION it is moving, from which sphere into which.',
        'A FEW INTERACTIONS TO RECOGNIZE, WITHOUT GOING DEEP INTO ANY ONE OF THEM. Rainwater running across land can pick up loose soil and carry it into a river -- geosphere material moving into the hydrosphere. A volcano can send hot gas and rock particles up out of Earth\'s interior into the sky -- geosphere material and energy moving into the atmosphere. Water moves between the hydrosphere and the atmosphere and back again, a pathway the next two lessons trace step by step. Each of these is one sentence here on purpose -- the full mechanism behind any one of them belongs to a different lesson.',
        'THE BIOSPHERE IS A FULL PARTICIPANT, NOT A SEPARATE CATEGORY. Living things exchange matter and energy with the other three spheres exactly the way those three exchange it with each other. A growing tree root can push with enough physical force to crack solid rock -- the biosphere acting on the geosphere. A fire burning through a forest releases gas and ash from burning plant matter into the surrounding air -- the biosphere acting on the atmosphere. This lesson only traces that a living thing can be one end of an interaction like this; it does not explain how a root or any other living thing works on the inside.',
        'LISTING ALL FOUR SPHERES IS NOT THE SAME AS DESCRIBING AN INTERACTION. Almost any real scene will contain some rock or soil, some water, some air, and some living thing. Pointing that out proves the scene has all four spheres in it; it proves nothing about whether any of them exchanged something. The actual question is always: what specific thing moved, and between which two?',
      ],
      vocabulary: [
        { term: 'geosphere', definition: "all of Earth's solid and rocky material -- the crust, the mantle, the core, mountains, soil, and the ocean floor." },
        { term: 'hydrosphere', definition: "all of Earth's water in every place it is found -- oceans, lakes, rivers, and ice." },
        { term: 'atmosphere', definition: 'the layer of gases surrounding Earth, mostly nitrogen and oxygen.' },
        { term: 'biosphere', definition: 'all living things on Earth, and the places they live.' },
        { term: 'interaction', definition: 'a specific instance of matter or energy moving from one of Earth\'s spheres into another; naming one means saying which two spheres, what moved, and in which direction.' },
      ],
      suggestedTools: ['show_diagram', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-creek-after-the-storm',
      kind: 'worked_example',
      problem:
        'A creek is normally clear enough to see the rocks on its bottom. After a heavy rainstorm, it turns muddy brown, and stays that way until a day or two after the rain stops. Identify which two spheres are interacting, name what is moving, and state the direction.',
      steps: [
        'Identify the two things the scene is actually about: the creek itself, which is water -- part of the hydrosphere -- and the brown color, which comes from something added to that water.',
        "Name what the added material actually is. Loose soil sitting on slopes and yards near the creek is part of the geosphere -- Earth's solid material.",
        'Connect the two. Heavy rain speeds up the water running across the land near the creek, and that faster-moving water picks up loose soil and carries it down into the creek.',
        'State the interaction in the three-part form: the geosphere and the hydrosphere are interacting; loose soil (matter) is moving; the direction is from the land\'s surface into the creek\'s water.',
        'WRONG: "The creek turns brown because rain chemically changes the color of the water." CORRECT: "The creek turns brown because the water is carrying a different material -- soil -- that was not there before. The water itself has not turned into something new."',
        'Check the answer with three clues of different kinds. Timing: the creek turns brown while the rain is heaviest and the water rushing across the land is fastest, and clears again once both slow down, matching a process tied to how much water is moving across the land. Appearance: the color is a dirt tan-brown, matching soil, not any color clean water turns on its own. Everyday experience: a fast-moving stream is well known to carry along grit that still water leaves alone, so a storm speeding up the creek fits a sediment-carrying explanation.',
        "Now change one condition and check the answer moves with it. Picture the same storm falling on a stretch of creek lined entirely with solid bedrock, with no loose soil anywhere nearby. The same heavy rain would fall, but there would be little loose geosphere material for the water to pick up, so the creek would likely stay far clearer even during the storm. The interaction depends on the geosphere actually supplying loose matter, not on rain falling by itself.",
      ],
      answer:
        "The geosphere and the hydrosphere are interacting. Rain speeds up water running across nearby land, and that faster water picks up loose soil and carries it into the creek -- matter moving from the land's surface into the creek's water.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-volcano-ash-cloud',
      kind: 'worked_example',
      problem:
        'A volcano along a coastline erupts. Thick clouds of ash and gas shoot high into the sky and stay visible from satellites in space for several days afterward. Identify which two spheres are interacting, name what is moving, and state the direction.',
      steps: [
        "Locate the source. The erupting volcano is solid Earth material, and the hot gas and rock particles it is releasing come from inside Earth -- all of that is part of the geosphere.",
        'Locate the destination. The clouds of ash and gas are rising into the layer of air surrounding Earth -- the atmosphere.',
        'Name what is moving. Fine rock and mineral particles (ash) and gases released from inside Earth are the matter moving; the eruption also releases a burst of energy that drives that matter upward forcefully.',
        'State the interaction in the three-part form: the geosphere and the atmosphere are interacting; ash, gas, and energy are moving; the direction is from inside Earth out into the surrounding air.',
        'WRONG: "The ash cloud is mostly water vapor that condensed the moment the volcano got hot." CORRECT: "The ash cloud is mostly fine rock and mineral particles blasted out of the volcano, along with gases released from inside Earth -- solid Earth material entering the air, not water changing form."',
        'Check the answer with three clues of different kinds. Source: nothing already in the atmosphere produces ash -- ash and volcanic gas can only have come from inside the erupting volcano, part of the geosphere. Appearance: the description is a thick, dense-looking cloud rather than the thin white of an ordinary weather cloud, matching a cloud full of rock particles. Duration: the cloud stays visible from satellites for several days, matching an eruption that keeps supplying new material rather than one brief burst.',
        'Now change one condition and check the answer moves. Picture the same volcano instead sending its melted rock down its outer slope as a slow-moving flow that cools and hardens into new solid rock on the ground. That material never leaves the geosphere at all -- it changes from one geosphere material into another. Only when the eruption sends material upward into the air does the interaction become geosphere-to-atmosphere; the same volcano can produce a geosphere-only event or a geosphere-atmosphere interaction, depending on which way the material goes.',
      ],
      answer:
        'The geosphere and the atmosphere are interacting. Ash, gas, and energy released from inside the erupting volcano move up out of the solid Earth and into the surrounding air.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-root-in-the-sidewalk',
      kind: 'try_yourself',
      problem:
        "A young tree's root grows inside a narrow crack in a sidewalk. Over several years, as the root grows thicker, it pushes outward until a chunk of the concrete breaks free. Which two spheres are interacting in this scene, and what is actually moving between them?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The biosphere and the geosphere. The growing root, part of a living thing, pushes outward with enough physical force to break apart the concrete, which is part of the geosphere.', correct: true },
        { id: 'b', text: 'The geosphere and the hydrosphere. Water trapped in the crack froze at some point, and the ice expanding cracked the concrete from below, as ice is known to crack sidewalks apart in a hard freeze.' },
        { id: 'c', text: 'All four spheres, since the sidewalk sits on soil under open air that receives rain, near a tree that is growing, so naming every sphere already shows they are interacting.' },
        { id: 'd', text: "The biosphere and the geosphere, but what actually broke the concrete was trapped air pressure building up inside the crack, not the physical force of the root's own growth." },
      ],
      expectedAnswer:
        'The biosphere and the geosphere. The growing root, part of a living thing, pushes outward with enough physical force to break apart the concrete, which is part of the geosphere.',
      hints: [
        'Every one of the four spheres is almost always present somewhere in a real scene. That is not what the question is asking. Look for the one thing in this description that is actually pushing on something else.',
        'The scene names exactly one thing that grew thicker over several years and pushed outward. What is that thing, and which sphere is it part of?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-wildfire-smoke',
      kind: 'try_yourself',
      problem:
        'A wildfire burns through a dry forest for several days. Thick smoke and ash rise from the burning trees and drift high into the sky above the forest. Which two spheres are interacting, and in which direction is matter moving?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The atmosphere and the hydrosphere. Heat from the fire evaporates moisture already sitting in the air, and that rising moisture is the gray-white cloud people see over the forest.' },
        { id: 'b', text: 'The biosphere and the atmosphere. The trees and other plants burning are part of the biosphere, and the gases and ash particles produced move upward from the forest into the surrounding air.', correct: true },
        { id: 'c', text: 'The biosphere and the hydrosphere. The fire dries up nearby streams, and the visible cloud in the sky is that missing stream water rising into the air, since a fire burning for several days is well known to dry out the land around it quickly.' },
        { id: 'd', text: 'All four spheres, since the fire needs rock and soil to burn on, living trees as fuel, air to keep it burning, and nearby water to eventually put it out, so a scene touching every sphere already counts as an interaction between them.' },
      ],
      expectedAnswer:
        'The biosphere and the atmosphere. The trees and other plants burning are part of the biosphere, and the gases and ash particles produced move upward from the forest into the surrounding air.',
      hints: [
        'Smoke and ash are not the same thing as a weather cloud made of water. What is actually on fire in this scene, and which sphere does burning plant matter belong to?',
        'The question asks which two spheres are exchanging material right now, in this scene -- not everything a fire might eventually affect. What is leaving the forest and entering the air at this moment?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lake-and-humid-air',
      kind: 'try_yourself',
      problem:
        'A weather station next to a large lake records that the air in the nearby town holds noticeably more moisture than the air in a similar town far from any lake or ocean. Which two spheres are interacting here, and in which direction is matter moving?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "The atmosphere and the geosphere. Moisture stored inside the rock and soil of the lakebed seeps directly upward into the air above the town, as water is known to seep up through cracks in stone." },
        { id: 'b', text: 'The hydrosphere and the atmosphere, but the moisture is moving from the air into the lake, which is why the lake stays full even in a dry year.' },
        { id: 'c', text: "The hydrosphere and the atmosphere. Water moving out of the lake and into the surrounding air is what makes the nearby town's air hold more moisture than a town far from any lake.", correct: true },
        { id: 'd', text: 'All four spheres, since the town needs air to breathe, rests on solid ground, sits near a lake, and has people and plants living there, so naming every sphere already shows an interaction.' },
      ],
      expectedAnswer:
        "The hydrosphere and the atmosphere. Water moving out of the lake and into the surrounding air is what makes the nearby town's air hold more moisture than a town far from any lake.",
      hints: [
        'Two of these choices name the same pair of spheres but disagree about which way the water is moving. Read the scene again: is the water leaving the lake or entering it?',
        'The town with more moisture in its air is the one next to the lake, not the one far away. Which sphere is gaining water, and which one is supplying it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-boxes-and-the-biosphere',
      kind: 'misconception_check',
      question:
        'A student summarizes the lesson this way: "The four spheres are geosphere, hydrosphere, atmosphere, and biosphere. They are basically four separate boxes, and the biosphere is really its own thing since it is about living things, not the other three." Two different things are wrong in that summary. What are they?',
      commonErrors: [
        {
          answer: 'The four spheres are basically four separate boxes.',
          misconception:
            'Treating identification of the four spheres in a scene as the same thing as describing an interaction between them, rather than recognizing that matter and energy constantly cross from one sphere into another.',
          correctsTo:
            'The four spheres are not separate boxes -- they constantly exchange matter and energy. Naming that geosphere, hydrosphere, atmosphere, and biosphere are all present in a scene does not, by itself, describe an interaction. An interaction has to name which two spheres are actually exchanging something, what specifically is moving, and which direction it is moving in -- for example, rushing rainwater (hydrosphere) picking up loose soil (geosphere) and carrying it into a creek.',
        },
        {
          answer: 'The biosphere is really its own thing since it is about living things, not the other three.',
          misconception:
            'Treating the biosphere as separate from the exchanges the other three spheres take part in, rather than as a fourth full participant in the same kind of interaction.',
          correctsTo:
            "The biosphere exchanges matter and energy with the other three spheres exactly the way they exchange it with each other. A growing root, part of the biosphere, can push hard enough to crack solid rock, part of the geosphere. A burning forest, part of the biosphere, releases gas and ash into the atmosphere. This lesson only traces that a living thing can be one end of an interaction like this -- it does not explain how a root takes in water, how a plant makes its own food, or how any living thing's body works inside. That is a topic for a different grade.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Earth is one system made of four spheres: the geosphere (solid Earth), the hydrosphere (all of Earth's water), the atmosphere (the layer of air), and the biosphere (all living things and the places they live).",
        'Matter and energy do not stay inside one sphere. They are always moving between spheres.',
        'Naming an interaction takes three parts: which two spheres, what is moving (matter or energy, named specifically), and in which direction.',
        'A growing root can push with enough physical force to crack solid rock -- the biosphere acting on the geosphere.',
        "A volcano can send ash, gas, and energy up out of the geosphere and into the atmosphere; the same volcano sending melted rock down its slope to harden stays entirely within the geosphere -- it depends on which way the material goes.",
        'A burning forest releases gas and ash from the biosphere into the atmosphere.',
        'Water moves between the hydrosphere and the atmosphere and back -- the next two lessons trace exactly how.',
        'Naming all four spheres present in a scene is not the same as describing an interaction. An interaction needs a specific thing moving in a specific direction between two of them.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: "Earth's Four Spheres Interacting" },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
