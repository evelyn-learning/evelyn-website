/**
 * Biology — Ecology: Energy Flow: Food Chains, Webs & Pyramids.
 *
 * The concept/process template for the HS Biology fan-out (NGSS HS-LS2-3,
 * HS-LS2-4). Two errors dominate this topic — students reverse the food-chain
 * arrow, and they apply the 10% rule in the wrong direction — so the concept
 * segment is organized around the DIRECTION of energy: which way the arrow
 * points, and how much survives each hop. Energy flowing one way while matter
 * cycles is set up here and paid off in lesson 9.3.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U9_ENERGY_FLOW_FOOD_WEBS: LessonPlan = {
  id: 'evelyn.hs.bio.energy-flow-food-webs.v1',
  title: 'Energy Flow: Food Chains, Webs & Pyramids',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.energy-flow-food-webs',
      standard: 'BIO-9.2',
      description:
        'Trace energy from producers through consumers and decomposers using food chains, food webs and energy pyramids, applying the 10 percent rule to explain why chains are short and top predators are rare (NGSS HS-LS2-3, HS-LS2-4).',
    },
  ],
  prerequisites: ['bio.ecosystems-biomes'],
  followUps: ['bio.biogeochemical-cycles'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame energy loss between feeding levels as the reason big predators are rare and easily lost.',
      script:
        'A single lion may patrol 100 square kilometers, while the zebras it hunts graze in herds on a few fields. That is not a personality difference — it is arithmetic. Almost all of the energy in the grass is gone by the time it reaches the lion, so the land can only afford a few lions. The same arithmetic explains why the pesticide DDT barely bothered insects but nearly wiped out bald eagles, and why bringing wolves back to Yellowstone changed the shape of the rivers. In this lesson you follow the energy from sunlight upward, and you will be able to predict what happens when one species drops out.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trophic-levels-and-ten-percent',
      kind: 'concept',
      goal: 'Feeding roles, trophic levels, arrow direction, food webs, the 10 percent rule and pyramids, and energy flow versus matter cycling.',
      keyIdeas: [
        'PRODUCERS START EVERYTHING — producers (autotrophs) such as grass, trees and algae capture sunlight and build their own food by photosynthesis. Every other organism in an ecosystem is spending energy a producer captured first.',
        'CONSUMERS ARE NUMBERED BY DISTANCE FROM THE PRODUCER — a primary consumer (herbivore) eats producers; a secondary consumer eats primary consumers; a tertiary consumer eats secondary consumers. In grass → grasshopper → frog → snake → hawk, the grasshopper is primary, the frog secondary, the snake tertiary, and the hawk a top predator.',
        'DECOMPOSERS AND DETRITIVORES CLOSE THE LOOP — bacteria and fungi (decomposers) chemically break down dead bodies and waste, while earthworms, dung beetles and crabs (detritivores) physically eat the dead material. They feed at EVERY level, and without them nutrients stay locked inside dead matter and producers starve.',
        'THE ARROW POINTS FROM THE EATEN TO THE EATER — this is the single most reversed detail in ecology. In grass → grasshopper, the arrow means "the grasshopper eats the grass, so energy moves from grass into grasshopper". The arrow follows the ENERGY, not the appetite: it never points at the food.',
        'FOOD WEBS ARE THE REALISTIC PICTURE — a chain shows one path; a web shows all of them overlapping, because most organisms eat several things and are eaten by several things. A hawk that eats snakes, mice and grasshoppers sits at different trophic levels depending on the meal. Remove one species and the effect ripples along every arrow it touched — predators of it decline, and the things it ate boom.',
        'THE 10 PERCENT RULE — only about 10 percent of the energy at one trophic level becomes body tissue at the next. The other roughly 90 percent is lost as heat, spent on moving, breathing and staying alive, or never eaten at all. Going UP a level, divide by 10.',
        'WHY PYRAMIDS AND WHY SHORT CHAINS — stack the levels and you get an energy pyramid: wide at the producers, tiny at the top. After four or five levels there is almost nothing left, so chains are short and top predators are few and need huge territories. A biomass pyramid stacks the total dry mass at each level and a numbers pyramid stacks how many individuals there are; both usually narrow upward for the same reason, though a numbers pyramid can invert when one huge producer, like a single oak tree, feeds thousands of insects.',
        'ENERGY FLOWS, MATTER CYCLES — AND TOXINS CLIMB — energy makes a ONE-WAY trip: in as sunlight, out as heat, never reused. Matter is different: the same carbon and nitrogen atoms are used over and over, which is lesson 9.3. Some toxins do neither — DDT and mercury are stored rather than broken down, so they concentrate at each level (bioaccumulation), which is why top predators like eagles were poisoned while the insects were not.',
      ],
      vocabulary: [
        { term: 'trophic level', definition: 'an organism\'s feeding position in a chain — producer, primary consumer, secondary consumer, and so on.' },
        { term: 'detritivore', definition: 'an animal such as an earthworm or dung beetle that eats dead material and waste, breaking it into smaller pieces.' },
        { term: 'biomass', definition: 'the total mass of living tissue at a trophic level.' },
        { term: 'bioaccumulation', definition: 'the build-up of a stored toxin to higher concentrations at each successive trophic level.' },
      ],
      suggestedTools: ['show_diagram', 'show_concept_map', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ten-percent-savanna',
      kind: 'worked_example',
      problem:
        'On a stretch of savanna the grass stores 100,000 kcal of energy. The chain is grass → zebra → lion. Using the 10 percent rule, how much energy reaches the lions, and what does that mean for how much land a lion needs?',
      steps: [
        'Identify the trophic levels and their order: grass is the producer, the zebra is the primary consumer, the lion is the secondary consumer. Energy moves along the arrows, upward.',
        'Apply the rule for the first hop, grass → zebra: about 10 percent of 100,000 kcal is 10,000 kcal stored in zebra tissue. The missing 90,000 kcal left as heat, powered the zebra\'s movement and breathing, or was in grass no zebra ever ate.',
        'Apply it again for the second hop, zebra → lion: about 10 percent of 10,000 kcal is 1,000 kcal stored in lion tissue.',
        'Compare the ends: 1,000 kcal out of the original 100,000 kcal is 1 percent. Ninety-nine percent of the grass energy never reaches a lion.',
        'Interpret: to collect enough energy to live, a lion must draw on the zebras of a very large area of grass, so lion territories are enormous and lion populations are small — and adding one more level above the lion would leave only about 100 kcal, which is why chains stop here.',
      ],
      answer:
        'About 1,000 kcal reaches the lions — 1 percent of the grass energy. The 10 percent loss at each hop is why a top predator needs a huge territory and why food chains run out after four or five levels.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-web-disruption',
      kind: 'worked_example',
      problem:
        'A kelp-forest food web off the Pacific coast runs like this: kelp → sea urchin → sea otter, and also kelp → snail → rockfish, with rockfish sheltering among the kelp stalks. Hunters remove nearly all the sea otters. Trace the effect through the web.',
      steps: [
        'Start at the removed species and follow the arrow that pointed INTO it. The arrow sea urchin → sea otter means otters ate urchins, so with the otters gone the urchins lose their main predator.',
        'Predict the immediate change: the urchin population grows quickly, because nothing is eating them and their food supply is unchanged.',
        'Follow the arrow that pointed INTO the urchins. The arrow kelp → sea urchin means urchins eat kelp, so a much larger urchin population grazes the kelp down — whole stretches of kelp forest are stripped bare.',
        'Follow the loss of the producer along every other arrow it touched: kelp → snail collapses too, so snails decline, and the rockfish that ate snails and sheltered in the kelp lose both food and habitat and decline as well.',
        'State the general result: removing one consumer changed the abundance of a producer and of species on a completely separate branch of the web, because the arrows connect them all.',
      ],
      answer:
        'Otters gone → urchins boom → kelp is grazed away → snails and rockfish decline with it. Losing one predator can flatten an entire kelp forest, which is why food webs, not single chains, are needed to predict what happens.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-ten-percent',
      kind: 'try_yourself',
      problem:
        'In the food chain grass → grasshopper → frog → snake, the grass stores 10,000 kcal of energy. Using the 10 percent rule, about how much energy is stored in the snakes?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '9,000 kcal' },
        { id: 'b', text: '1,000 kcal' },
        { id: 'c', text: '10 kcal', correct: true },
        { id: 'd', text: '100,000 kcal' },
      ],
      expectedAnswer: '10 kcal',
      hints: [
        'Count the arrows between the grass and the snake — each arrow is one 10 percent hop.',
        'Grass 10,000 kcal → grasshopper 1,000 kcal → frog 100 kcal → snake. Divide by 10 one more time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-arrow-direction',
      kind: 'try_yourself',
      problem:
        'In the food chain grass → grasshopper → frog → snake → hawk, what does the arrow between the grasshopper and the frog tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The frog eats the grasshopper, so energy moves from the grasshopper into the frog', correct: true },
        { id: 'b', text: 'The grasshopper eats the frog, so energy moves from the frog into the grasshopper' },
        { id: 'c', text: 'The grasshopper and the frog compete for the same food, so neither gains energy' },
        { id: 'd', text: 'The arrow points from each predator toward the prey it hunts' },
      ],
      expectedAnswer: 'The frog eats the grasshopper, so energy moves from the grasshopper into the frog',
      hints: [
        'The arrow always follows the energy, not the hunting. Ask which organism ends up with the energy.',
        'Check the first arrow as a test: grass → grasshopper cannot mean the grass eats the grasshopper, so the arrow must run from the eaten to the eater.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-decomposers-removed',
      kind: 'try_yourself',
      problem:
        'A forest food web includes leaves → caterpillar → songbird → hawk, plus fungi and bacteria that break down dead leaves, bodies and droppings. Suppose a soil treatment kills off nearly all of those fungi and bacteria. What happens to the forest over the following years?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing changes, because decomposers are not part of the food web and no living organism eats them' },
        { id: 'b', text: 'The hawks disappear first, because they are at the top of the chain and decomposers were their food source' },
        { id: 'c', text: 'Energy stops flowing into the forest, because decomposers are what capture sunlight for the ecosystem' },
        { id: 'd', text: 'Dead leaves and bodies pile up with their nutrients locked inside, so the trees eventually run short of soil nutrients and the whole web weakens', correct: true },
      ],
      expectedAnswer:
        'Dead leaves and bodies pile up with their nutrients locked inside, so the trees eventually run short of soil nutrients and the whole web weakens',
      hints: [
        'Decomposers are not just tidying up — ask what they RETURN to the soil, and who needs it.',
        'The producers are the trees. If nutrients stay trapped in dead material, the producers suffer first, and everything above them follows.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-energy-recycles',
      kind: 'misconception_check',
      question:
        'A student writes: "Energy is recycled through an ecosystem — the decomposers break down the hawk and send its energy back down to the grass, so the loop closes." What went wrong?',
      commonErrors: [
        {
          answer: 'Decomposers return the hawk\'s energy to the grass, so energy cycles',
          misconception: 'Merging the two separate stories — matter cycling and energy flowing — into one loop, because decomposers really do return something to the soil.',
          correctsTo:
            'What decomposers return is MATTER: carbon, nitrogen and phosphorus atoms that the grass can use again. The energy is not returned — at every step, including decomposition, it leaves as heat and never comes back. That is why an ecosystem needs a constant new supply of sunlight but does not need a new supply of atoms. Energy flows one way through the ecosystem; matter cycles within it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Producers capture sunlight; primary, secondary and tertiary consumers feed at each step above them; decomposers and detritivores break down dead matter at every level.',
        'The arrow points from the eaten TO the eater — grass → grasshopper means the grasshopper eats the grass, and energy moves that way.',
        'A food web is many overlapping chains, so removing one species ripples along every arrow it touched.',
        'The 10 percent rule: about 10 percent of the energy passes to the next level and about 90 percent is lost as heat and life processes — divide by 10 going up. That is why pyramids narrow, chains are short, and top predators are rare.',
        'Energy FLOWS one way (sunlight in, heat out) while matter CYCLES; stored toxins like DDT bioaccumulate and hit the top predators hardest.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Energy Flow: Food Chains, Webs & Pyramids' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
