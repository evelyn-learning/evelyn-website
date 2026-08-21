/**
 * Grade 7 Science (Life Science) -- Ecosystems: Cycles of Matter.
 *
 * The mirror image of 9.2 (NGSS MS-LS2-3). Lesson 9.2 established that energy
 * FLOWS one way along a food web and leaves as heat; this lesson establishes
 * the contrast that matter CYCLES -- the same atoms, used over and over. The
 * headline sentence is "matter cycles, energy flows", and it is stated in the
 * concept, tested in an item, and repeated in the recap.
 *
 * Decomposers carry unusual weight here on purpose. They are the step that
 * closes every loop, and they are the step students most often dismiss as
 * "just rotting".
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Both cycles
 * are written out as sequences of steps in words. Nothing here asks a student
 * to look at a diagram, and no percentages or invented figures appear.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U9_CYCLES_OF_MATTER: LessonPlan = {
  id: 'evelyn.ms.m7sci.cycles-of-matter.v1',
  title: 'Cycles of Matter',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.cycles-of-matter',
      standard: 'M7SCI-9.3',
      description:
        'Describe how water, carbon and nitrogen move in cycles between the living and non-living parts of an ecosystem, and explain why matter is used over and over while energy flows one way through a food web and leaves as heat (NGSS MS-LS2-3).',
    },
  ],
  prerequisites: ['m7sci.food-chains-and-food-webs'],
  followUps: ['m7sci.biomes-and-habitats'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make matter feel reused rather than consumed, and set up the contrast with the one-way energy flow of the last lesson.',
      script:
        'Go outside after a rainstorm and find a puddle. Come back two days later and the puddle is gone. Ask where the water went, and most people say it dried up, as if it stopped existing. It did not. Every drop is still on this planet, and some of it is probably inside a cloud over somebody else right now. Here is the harder part to believe. The water in that puddle may have rained on a dinosaur, sat in an ocean, and traveled up through the roots of a tree, and it will keep going around long after today. The same is true of the carbon in your last meal. Today we follow matter around its loops, and we find out why matter behaves so differently from energy.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cycles-of-matter',
      kind: 'concept',
      goal: 'Establish "matter cycles, energy flows", walk the water and carbon cycles as spoken sequences, give decomposers full weight, and add nitrogen briefly.',
      keyIdeas: [
        'MATTER CYCLES, ENERGY FLOWS -- this is the one sentence to carry out of this lesson. Energy arrives as sunlight, passes along the food web from producer to consumer to consumer, and leaves as heat. It does not come back around, which is why an ecosystem needs a fresh delivery of sunlight every single day. Matter is different. The carbon, the water and the nitrogen get used, released, and used again, with no end. WRONG: "A food web recycles energy." CORRECT: "A food web passes energy along one way, and matter is what goes around and around."',
        'THE WATER CYCLE, WRITTEN AS A SEQUENCE -- water in oceans, lakes and puddles EVAPORATES, which means it turns into water vapor, an invisible gas, and rises into the air. Higher up it is colder, so the vapor CONDENSES back into tiny liquid droplets, and millions of droplets together make a cloud. When the droplets join and grow heavy enough, water falls as PRECIPITATION: rain, snow, sleet or hail. On land, some of that water runs downhill into streams and back toward the ocean, and some soaks into the ground. Living things are part of this loop too. Plant roots take water in from the soil and carry it up to the leaves, and the leaves release it back into the air as vapor, a step called transpiration. Animals drink water and return it in their breath and their waste.',
        'THE CARBON CYCLE, WRITTEN AS A SEQUENCE -- photosynthesis REMOVES carbon dioxide from the air, and the plant builds that carbon into sugar, and then into leaves, wood and roots. An animal that eats the plant takes the same carbon into its own body. Three different processes send carbon back to the air as carbon dioxide. Cellular respiration in every living thing, plants included, releases it. Decomposers release it while they break down dead material. And burning releases it, whether the fuel is a log in a campfire or the gasoline in a car.',
        'DECOMPOSERS ARE THE HINGE OF EVERY CYCLE -- bacteria and fungi feed on fallen leaves, dead bodies and waste, and while they feed they return the matter inside that dead material to the soil and to the air. Without them, the carbon and the nitrogen inside a dead squirrel would stay locked inside that squirrel, and no plant would ever get those atoms back. Rotting is not just mess and it is not the end of the story. Rotting is the step that closes the loop. An ecosystem that lost its decomposers would run down and stop even with the Sun still shining on it.',
        'NITROGEN NEEDS A HELPER -- most of the air around you is nitrogen gas, and every living thing needs nitrogen to build proteins. Here is the strange part. Almost no living thing can use nitrogen in the form it takes in the air, so all that nitrogen is useless to a plant standing in the middle of it. Certain bacteria that live in the soil change nitrogen gas into a form that plant roots can take in. Animals then get their nitrogen by eating plants, or by eating animals that ate plants, and decomposers return it to the soil when something dies.',
        'THE ATOMS ARE NOT NEW -- Earth receives fresh energy from the Sun without stopping, but Earth does not receive fresh atoms. The carbon atoms in the breath you just let out have been on this planet for billions of years, and they have already been part of rock, of ocean water, and of other living things many times over. That also settles an older question. A plant takes its carbon from the AIR as carbon dioxide, not from the soil. Soil gives a plant water and minerals, but the carbon that becomes wood arrived through the leaves as a gas.',
      ],
      vocabulary: [
        { term: 'evaporation', definition: 'the change of liquid water into water vapor, an invisible gas in the air.' },
        { term: 'condensation', definition: 'the change of water vapor back into tiny liquid droplets, which is how clouds form.' },
        { term: 'precipitation', definition: 'water falling from clouds to the ground as rain, snow, sleet or hail.' },
        { term: 'transpiration', definition: 'the release of water vapor from plant leaves into the air.' },
        { term: 'decomposer', definition: 'a living thing, such as a fungus or a bacterium, that feeds on dead material and returns the matter in it to the soil and the air.' },
        { term: 'cellular respiration', definition: 'the process in which a living thing releases the energy stored in food and gives off carbon dioxide.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-a-water-molecule',
      kind: 'worked_example',
      problem:
        'A single water molecule sits in the ocean. Trace one path it could take from the ocean, through a plant, and back into the air. Name what is happening at each step.',
      steps: [
        'Start where the problem puts you. The molecule is liquid water in the ocean, and the Sun is shining on the surface.',
        'Step one, ocean to air, by EVAPORATION. Energy from sunlight gets the molecule moving fast enough to leave the liquid and become water vapor. It is now a gas in the air, and you cannot see it.',
        'Step two, air to cloud, by CONDENSATION. The vapor rises, and it is colder up there. The molecule slows down and joins a tiny liquid droplet. Millions of those droplets together are a cloud.',
        'Step three, cloud to ground, by PRECIPITATION. Droplets keep joining until they are heavy enough to fall, and the molecule lands on a grassy field as rain.',
        'Step four, ground to plant, through the ROOTS. The rain soaks into the soil, and a grass plant pulls the water in through its roots and carries it up the stem to the leaves.',
        'Step five, plant to air, by TRANSPIRATION. The leaf releases the molecule back into the air as water vapor, and the loop is ready to run again. A different ending was possible at step three: instead of soaking into the soil, the rain could have run downhill into a stream and back to the ocean.',
        'Now check the whole path for the thing that matters most. At no point was the water molecule made, and at no point was it destroyed. It changed between liquid and gas, and it changed location. That is all a cycle is.',
      ],
      answer:
        'Ocean to air by evaporation, air to cloud by condensation, cloud to ground by precipitation, soil to plant through the roots, and plant back to the air by transpiration. The same molecule keeps moving and changing form, and it is never created and never destroyed.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-forest-without-decomposers',
      kind: 'worked_example',
      problem:
        'Imagine every decomposer in a forest disappeared overnight. The Sun keeps shining, the plants keep making food, and the animals keep eating. Predict what happens to that forest over the next several years, and explain why.',
      steps: [
        'Start with the job decomposers do. They feed on fallen leaves, dead animals and waste, and while they feed they return the matter inside that dead material to the soil and to the air.',
        'Ask what stops. Nothing breaks dead material down anymore. Fallen leaves pile up instead of disappearing. Dead animals stay where they fall. The forest floor gets deeper every single year.',
        'Now follow the matter. The carbon and the nitrogen inside all of that dead material are still in the forest, but they are locked inside it. They sit in a place no plant can reach.',
        'Ask what the plants lose. Plants take nitrogen and minerals in through their roots from the soil, and that supply normally gets restocked when decomposers break dead material down. With the restocking stopped, the soil runs short and the plants grow poorly. Fewer plants means less food for every animal above them.',
        'Ask about energy separately, because energy behaves differently. Sunlight keeps arriving the whole time, so energy is not the problem at all. The problem is that matter stopped moving in a loop and started collecting in a dead end.',
        'WRONG way to describe the result: "The forest runs out of matter." All of the matter is still right there in the pile. CORRECT way: "The matter is trapped in dead material instead of being returned, so the living part of the forest cannot get at it."',
      ],
      answer:
        'Dead material piles up and the soil is never restocked, so plants slowly run short of the nitrogen and minerals they take in through their roots, and the whole forest declines. No matter is lost anywhere in this story. It is simply locked inside dead material because the step that returns it is missing, and sunlight keeps arriving the entire time, which shows the trouble is a matter problem and not an energy problem.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-matter-cycles-energy-flows',
      kind: 'try_yourself',
      problem: 'Which statement describes how matter and energy move through an ecosystem?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Matter cycles and gets used again and again; energy flows one way, entering as sunlight and leaving as heat.', correct: true },
        { id: 'b', text: 'Energy cycles and gets used again and again; matter flows one way and is used up.' },
        { id: 'c', text: 'Both matter and energy cycle, so an ecosystem needs no fresh sunlight and no fresh atoms.' },
        { id: 'd', text: 'Both matter and energy flow one way, so an ecosystem needs a delivery of new atoms to keep going.' },
      ],
      expectedAnswer: 'Matter cycles and gets used again and again; energy flows one way, entering as sunlight and leaving as heat.',
      hints: [
        'Ask which one an ecosystem needs delivered fresh every day. Anything that truly went around in a loop would not need a delivery at all.',
        'Heat that leaves a food web never returns to the plants. Now ask whether the same is true of a carbon atom that a decomposer releases into the air.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-carbon-removed-from-air',
      kind: 'try_yourself',
      problem: 'Which process REMOVES carbon dioxide from the air?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Photosynthesis in a plant', correct: true },
        { id: 'b', text: 'Cellular respiration in an animal' },
        { id: 'c', text: 'Decomposers breaking down a dead log' },
        { id: 'd', text: 'Gasoline burning in a car engine' },
      ],
      expectedAnswer: 'Photosynthesis in a plant',
      hints: [
        'Three of these four send carbon back into the air as carbon dioxide. Only one takes carbon out of the air.',
        'Ask which process builds carbon into a sugar. That is the doorway carbon uses to get into living things in the first place.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-leaf-litter-decomposers',
      kind: 'try_yourself',
      problem:
        'Every autumn a forest drops a thick layer of leaves onto the ground, and yet the forest floor does not get deeper year after year. Which statement best explains this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Decomposers break the fallen leaves down, and the matter in them returns to the soil and the air, where living things can use it again.', correct: true },
        { id: 'b', text: 'The matter in the leaves is destroyed as they rot, so it stops existing.' },
        { id: 'c', text: 'The leaves rot, but rotting is only decay and is not part of any cycle, so the matter stays shut inside the leaves.' },
        { id: 'd', text: 'The trees pull the carbon in the fallen leaves back up through their roots out of the soil.' },
      ],
      expectedAnswer: 'Decomposers break the fallen leaves down, and the matter in them returns to the soil and the air, where living things can use it again.',
      hints: [
        'The leaves do not disappear on their own. Something is feeding on them, and anything that feeds on something returns matter while it does so.',
        'One choice claims matter can be destroyed, which never happens. Another sends carbon into a tree through its roots, when a tree takes its carbon in from the air.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-energy-recycled-and-new-atoms',
      kind: 'misconception_check',
      question:
        'A student writes: "A food web recycles energy the same way it recycles matter, and every spring a plant builds brand new atoms to grow with." Two separate things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'A food web recycles energy the same way it recycles matter.',
          misconception:
            'Hearing that ecosystems recycle and then applying it to everything in the ecosystem, energy included.',
          correctsTo:
            'Matter and energy behave in opposite ways, and that contrast is the whole point of this lesson. Energy enters as sunlight, gets passed along the food web, and leaves as heat that no plant can capture again. That is exactly why sunlight has to keep arriving. Matter is not lost like that. A carbon atom that a decomposer releases into the air can be taken in by a plant tomorrow, built into a leaf, and eaten again next week. So the sentence is half right, and one swap fixes it: matter goes around and around, and energy gets passed along one way.',
        },
        {
          answer: 'A plant builds brand new atoms in order to grow.',
          misconception:
            'Assuming that because a plant gains mass without anything visible going into it, the material inside it must be newly made.',
          correctsTo:
            'No living thing makes an atom. The atoms in a new leaf were already here, and they have been cycling around this planet for billions of years. A growing plant is collecting atoms and rearranging them: the carbon arrives from the AIR as carbon dioxide, the water comes up through the roots, and minerals come from the soil. When that leaf falls and decomposers break it apart, the same atoms go back out to be used again. Growth is rearrangement, never creation.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Matter cycles and gets used over and over. Energy flows one way: in as sunlight, along the food web, out as heat. That is the sentence to keep.',
        'Water: evaporation into vapor, condensation into clouds, precipitation as rain or snow, then runoff toward the ocean or soaking into the soil. Roots take water in, and leaves release it back as vapor.',
        'Carbon: photosynthesis removes carbon dioxide from the air, and cellular respiration, decomposers and burning all return it.',
        'Decomposers are the hinge. Without them, the matter in dead material would stay locked inside it and no plant would ever get those atoms back.',
        'Nitrogen: most of the air is nitrogen gas, but almost no living thing can use it in that form. Bacteria in the soil change it into a form plant roots can take in.',
        'Earth gets fresh energy every day but never fresh atoms. The atoms in you have cycled for billions of years, and a plant takes its carbon from the air, not from the soil.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Cycles of Matter' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
