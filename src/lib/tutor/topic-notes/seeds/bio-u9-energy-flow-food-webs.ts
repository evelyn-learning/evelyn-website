/**
 * Biology — Unit 9 CED 9.2: Energy Flow: Food Chains, Webs & Pyramids.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.energy-flow-food-webs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U9_ENERGY_FLOW_FOOD_WEBS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.energy-flow-food-webs.v1',
  course: 'Biology',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Energy Flow: Food Chains, Webs & Pyramids',
  planId: 'evelyn.hs.bio.energy-flow-food-webs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.energy-flow-food-webs.v1' }],
  theory: [
    { loId: 'bio.energy-flow-food-webs', kind: 'framework', title: 'Producers start everything', content: `PRODUCERS START EVERYTHING — producers (autotrophs) such as grass, trees and algae capture sunlight and build their own food by photosynthesis. Every other organism in an ecosystem is spending energy a producer captured first.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'framework', title: 'Consumers are numbered by distance from the producer', content: `CONSUMERS ARE NUMBERED BY DISTANCE FROM THE PRODUCER — a primary consumer (herbivore) eats producers; a secondary consumer eats primary consumers; a tertiary consumer eats secondary consumers. In grass → grasshopper → frog → snake → hawk, the grasshopper is primary, the frog secondary, the snake tertiary, and the hawk a top predator.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'framework', title: 'Decomposers and detritivores close the loop', content: `DECOMPOSERS AND DETRITIVORES CLOSE THE LOOP — bacteria and fungi (decomposers) chemically break down dead bodies and waste, while earthworms, dung beetles and crabs (detritivores) physically eat the dead material. They feed at EVERY level, and without them nutrients stay locked inside dead matter and producers starve.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'framework', title: 'The arrow points from the eaten to the eater', content: `THE ARROW POINTS FROM THE EATEN TO THE EATER — this is the single most reversed detail in ecology. In grass → grasshopper, the arrow means "the grasshopper eats the grass, so energy moves from grass into grasshopper". The arrow follows the ENERGY, not the appetite: it never points at the food.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'framework', title: 'Food webs are the realistic picture', content: `FOOD WEBS ARE THE REALISTIC PICTURE — a chain shows one path; a web shows all of them overlapping, because most organisms eat several things and are eaten by several things. A hawk that eats snakes, mice and grasshoppers sits at different trophic levels depending on the meal. Remove one species and the effect ripples along every arrow it touched — predators of it decline, and the things it ate boom.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'framework', title: 'The 10 percent rule', content: `THE 10 PERCENT RULE — only about 10 percent of the energy at one trophic level becomes body tissue at the next. The other roughly 90 percent is lost as heat, spent on moving, breathing and staying alive, or never eaten at all. Going UP a level, divide by 10.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'framework', title: 'Why pyramids and why short chains', content: `WHY PYRAMIDS AND WHY SHORT CHAINS — stack the levels and you get an energy pyramid: wide at the producers, tiny at the top. After four or five levels there is almost nothing left, so chains are short and top predators are few and need huge territories. A biomass pyramid stacks the total dry mass at each level and a numbers pyramid stacks how many individuals there are; both usually narrow upward for the same reason, though a numbers pyramid can invert when one huge producer, like a single oak tree, feeds thousands of insects.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'framework', title: 'Energy flows, matter cycles', content: `ENERGY FLOWS, MATTER CYCLES — AND TOXINS CLIMB — energy makes a ONE-WAY trip: in as sunlight, out as heat, never reused. Matter is different: the same carbon and nitrogen atoms are used over and over, which is lesson 9.3. Some toxins do neither — DDT and mercury are stored rather than broken down, so they concentrate at each level (bioaccumulation), which is why top predators like eagles were poisoned while the insects were not.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'definition', title: 'trophic level', content: `an organism's feeding position in a chain — producer, primary consumer, secondary consumer, and so on.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'definition', title: 'detritivore', content: `an animal such as an earthworm or dung beetle that eats dead material and waste, breaking it into smaller pieces.` },
    { loId: 'bio.energy-flow-food-webs', kind: 'definition', title: 'biomass', content: 'the total mass of living tissue at a trophic level.' },
    { loId: 'bio.energy-flow-food-webs', kind: 'definition', title: 'bioaccumulation', content: `the build-up of a stored toxin to higher concentrations at each successive trophic level.` },
  ],
  methods: [
    {
      title: 'Worked ten percent savanna',
      steps: [
        `Identify the trophic levels and their order: grass is the producer, the zebra is the primary consumer, the lion is the secondary consumer. Energy moves along the arrows, upward.`,
        `Apply the rule for the first hop, grass → zebra: about 10 percent of 100,000 kcal is 10,000 kcal stored in zebra tissue. The missing 90,000 kcal left as heat, powered the zebra's movement and breathing, or was in grass no zebra ever ate.`,
        `Apply it again for the second hop, zebra → lion: about 10 percent of 10,000 kcal is 1,000 kcal stored in lion tissue.`,
        `Compare the ends: 1,000 kcal out of the original 100,000 kcal is 1 percent. Ninety-nine percent of the grass energy never reaches a lion.`,
        `Interpret: to collect enough energy to live, a lion must draw on the zebras of a very large area of grass, so lion territories are enormous and lion populations are small — and adding one more level above the lion would leave only about 100 kcal, which is why chains stop here.`,
      ],
      example: { problem: `On a stretch of savanna the grass stores 100,000 kcal of energy. The chain is grass → zebra → lion. Using the 10 percent rule, how much energy reaches the lions, and what does that mean for how much land a lion needs?`, solution: `About 1,000 kcal reaches the lions — 1 percent of the grass energy. The 10 percent loss at each hop is why a top predator needs a huge territory and why food chains run out after four or five levels.` },
      relatedLoIds: ['bio.energy-flow-food-webs'],
    },
    {
      title: 'Worked web disruption',
      steps: [
        `Start at the removed species and follow the arrow that pointed INTO it. The arrow sea urchin → sea otter means otters ate urchins, so with the otters gone the urchins lose their main predator.`,
        `Predict the immediate change: the urchin population grows quickly, because nothing is eating them and their food supply is unchanged.`,
        `Follow the arrow that pointed INTO the urchins. The arrow kelp → sea urchin means urchins eat kelp, so a much larger urchin population grazes the kelp down — whole stretches of kelp forest are stripped bare.`,
        `Follow the loss of the producer along every other arrow it touched: kelp → snail collapses too, so snails decline, and the rockfish that ate snails and sheltered in the kelp lose both food and habitat and decline as well.`,
        `State the general result: removing one consumer changed the abundance of a producer and of species on a completely separate branch of the web, because the arrows connect them all.`,
      ],
      example: { problem: `A kelp-forest food web off the Pacific coast runs like this: kelp → sea urchin → sea otter, and also kelp → snail → rockfish, with rockfish sheltering among the kelp stalks. Hunters remove nearly all the sea otters. Trace the effect through the web.`, solution: `Otters gone → urchins boom → kelp is grazed away → snails and rockfish decline with it. Losing one predator can flatten an entire kelp forest, which is why food webs, not single chains, are needed to predict what happens.` },
      relatedLoIds: ['bio.energy-flow-food-webs'],
    },
  ],
  pointers: [
    { content: `What decomposers return is MATTER: carbon, nitrogen and phosphorus atoms that the grass can use again. The energy is not returned — at every step, including decomposition, it leaves as heat and never comes back. That is why an ecosystem needs a constant new supply of sunlight but does not need a new supply of atoms. Energy flows one way through the ecosystem; matter cycles within it.`, kind: 'common-error' },
    { content: `Producers capture sunlight; primary, secondary and tertiary consumers feed at each step above them; decomposers and detritivores break down dead matter at every level.`, kind: 'tip' },
    { content: `The arrow points from the eaten TO the eater — grass → grasshopper means the grasshopper eats the grass, and energy moves that way.`, kind: 'tip' },
    { content: `A food web is many overlapping chains, so removing one species ripples along every arrow it touched.`, kind: 'tip' },
    { content: `The 10 percent rule: about 10 percent of the energy passes to the next level and about 90 percent is lost as heat and life processes — divide by 10 going up. That is why pyramids narrow, chains are short, and top predators are rare.`, kind: 'tip' },
    { content: `Energy FLOWS one way (sunlight in, heat out) while matter CYCLES; stored toxins like DDT bioaccumulate and hit the top predators hardest.`, kind: 'tip' },
    { content: `Arrow direction: it always points from the eaten TO the eater. Write "grass → grasshopper" and read it as "energy moves into the grasshopper." If you drew the arrow toward the food, you reversed the whole web.`, kind: 'common-error' },
    { content: `Count trophic levels from the producer, not from the top. In grass → grasshopper → frog → snake, the snake is the TERTIARY consumer (4th level), so energy is divided by 10 three times — not four. Count the arrows (hops), not the organisms.`, kind: 'gotcha' },
    { content: `Decomposers return MATTER, not energy. Saying "decomposers recycle energy back to the plants" is wrong — energy leaves as heat at every step, including decomposition. Say "energy flows one way; matter cycles."`, kind: 'common-error' },
    { content: `Don't call every dead-matter feeder a decomposer. Decomposers (bacteria, fungi) break material down chemically; detritivores (earthworms, dung beetles, crabs) physically eat it. Both feed at every trophic level, not just at the top.`, kind: 'vocab-note' },
    { content: `The lost ~90% isn't just "waste heat." Credit-worthy answers name the routes: cellular respiration/heat, movement and life processes, undigested material in feces, and biomass never eaten at all.`, kind: 'tip' },
    { content: `A numbers pyramid can be inverted — one oak tree feeding thousands of insects — but an ENERGY pyramid never can. Check which pyramid (energy, biomass, or numbers) a question is asking about before claiming it must narrow upward.`, kind: 'edge-case' },
    { content: `In a web, one organism can occupy different trophic levels depending on the meal — a hawk eating a grasshopper is a secondary consumer, but eating a snake it's a quaternary one. Don't assign a species one fixed number.`, kind: 'edge-case' },
    { content: `Bioaccumulation runs opposite to energy: energy shrinks going up, stored toxins like DDT and mercury concentrate going up. That's why eagles were poisoned while the insects that carried the DDT were fine.`, kind: 'gotcha' },
  ],
};
