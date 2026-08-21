/**
 * Grade 7 Science — Unit 9 CED 9.3: Cycles of Matter.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.cycles-of-matter.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U9_CYCLES_OF_MATTER: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.cycles-of-matter.v1',
  course: 'Grade 7 Science',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Cycles of Matter',
  planId: 'evelyn.ms.m7sci.cycles-of-matter.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.cycles-of-matter.v1' }],
  theory: [
    { loId: 'm7sci.cycles-of-matter', content: `MATTER CYCLES, ENERGY FLOWS -- this is the one sentence to carry out of this lesson. Energy arrives as sunlight, passes along the food web from producer to consumer to consumer, and leaves as heat. It does not come back around, which is why an ecosystem needs a fresh delivery of sunlight every single day. Matter is different. The carbon, the water and the nitrogen get used, released, and used again, with no end. WRONG: "A food web recycles energy." CORRECT: "A food web passes energy along one way, and matter is what goes around and around."` },
    { loId: 'm7sci.cycles-of-matter', content: `THE WATER CYCLE, WRITTEN AS A SEQUENCE -- water in oceans, lakes and puddles EVAPORATES, which means it turns into water vapor, an invisible gas, and rises into the air. Higher up it is colder, so the vapor CONDENSES back into tiny liquid droplets, and millions of droplets together make a cloud. When the droplets join and grow heavy enough, water falls as PRECIPITATION: rain, snow, sleet or hail. On land, some of that water runs downhill into streams and back toward the ocean, and some soaks into the ground. Living things are part of this loop too. Plant roots take water in from the soil and carry it up to the leaves, and the leaves release it back into the air as vapor, a step called transpiration. Animals drink water and return it in their breath and their waste.` },
    { loId: 'm7sci.cycles-of-matter', content: `THE CARBON CYCLE, WRITTEN AS A SEQUENCE -- photosynthesis REMOVES carbon dioxide from the air, and the plant builds that carbon into sugar, and then into leaves, wood and roots. An animal that eats the plant takes the same carbon into its own body. Three different processes send carbon back to the air as carbon dioxide. Cellular respiration in every living thing, plants included, releases it. Decomposers release it while they break down dead material. And burning releases it, whether the fuel is a log in a campfire or the gasoline in a car.` },
    { loId: 'm7sci.cycles-of-matter', content: `DECOMPOSERS ARE THE HINGE OF EVERY CYCLE -- bacteria and fungi feed on fallen leaves, dead bodies and waste, and while they feed they return the matter inside that dead material to the soil and to the air. Without them, the carbon and the nitrogen inside a dead squirrel would stay locked inside that squirrel, and no plant would ever get those atoms back. Rotting is not just mess and it is not the end of the story. Rotting is the step that closes the loop. An ecosystem that lost its decomposers would run down and stop even with the Sun still shining on it.` },
    { loId: 'm7sci.cycles-of-matter', content: `NITROGEN NEEDS A HELPER -- most of the air around you is nitrogen gas, and every living thing needs nitrogen to build proteins. Here is the strange part. Almost no living thing can use nitrogen in the form it takes in the air, so all that nitrogen is useless to a plant standing in the middle of it. Certain bacteria that live in the soil change nitrogen gas into a form that plant roots can take in. Animals then get their nitrogen by eating plants, or by eating animals that ate plants, and decomposers return it to the soil when something dies.` },
    { loId: 'm7sci.cycles-of-matter', content: `THE ATOMS ARE NOT NEW -- Earth receives fresh energy from the Sun without stopping, but Earth does not receive fresh atoms. The carbon atoms in the breath you just let out have been on this planet for billions of years, and they have already been part of rock, of ocean water, and of other living things many times over. That also settles an older question. A plant takes its carbon from the AIR as carbon dioxide, not from the soil. Soil gives a plant water and minerals, but the carbon that becomes wood arrived through the leaves as a gas.` },
    { loId: 'm7sci.cycles-of-matter', kind: 'definition', title: 'evaporation', content: 'the change of liquid water into water vapor, an invisible gas in the air.' },
    { loId: 'm7sci.cycles-of-matter', kind: 'definition', title: 'condensation', content: `the change of water vapor back into tiny liquid droplets, which is how clouds form.` },
    { loId: 'm7sci.cycles-of-matter', kind: 'definition', title: 'precipitation', content: 'water falling from clouds to the ground as rain, snow, sleet or hail.' },
    { loId: 'm7sci.cycles-of-matter', kind: 'definition', title: 'transpiration', content: 'the release of water vapor from plant leaves into the air.' },
    { loId: 'm7sci.cycles-of-matter', kind: 'definition', title: 'decomposer', content: `a living thing, such as a fungus or a bacterium, that feeds on dead material and returns the matter in it to the soil and the air.` },
    { loId: 'm7sci.cycles-of-matter', kind: 'definition', title: 'cellular respiration', content: `the process in which a living thing releases the energy stored in food and gives off carbon dioxide.` },
  ],
  methods: [
    {
      title: 'Worked trace a water molecule',
      steps: [
        `Start where the problem puts you. The molecule is liquid water in the ocean, and the Sun is shining on the surface.`,
        `Step one, ocean to air, by EVAPORATION. Energy from sunlight gets the molecule moving fast enough to leave the liquid and become water vapor. It is now a gas in the air, and you cannot see it.`,
        `Step two, air to cloud, by CONDENSATION. The vapor rises, and it is colder up there. The molecule slows down and joins a tiny liquid droplet. Millions of those droplets together are a cloud.`,
        `Step three, cloud to ground, by PRECIPITATION. Droplets keep joining until they are heavy enough to fall, and the molecule lands on a grassy field as rain.`,
        `Step four, ground to plant, through the ROOTS. The rain soaks into the soil, and a grass plant pulls the water in through its roots and carries it up the stem to the leaves.`,
        `Step five, plant to air, by TRANSPIRATION. The leaf releases the molecule back into the air as water vapor, and the loop is ready to run again. A different ending was possible at step three: instead of soaking into the soil, the rain could have run downhill into a stream and back to the ocean.`,
        `Now check the whole path for the thing that matters most. At no point was the water molecule made, and at no point was it destroyed. It changed between liquid and gas, and it changed location. That is all a cycle is.`,
      ],
      example: { problem: `A single water molecule sits in the ocean. Trace one path it could take from the ocean, through a plant, and back into the air. Name what is happening at each step.`, solution: `Ocean to air by evaporation, air to cloud by condensation, cloud to ground by precipitation, soil to plant through the roots, and plant back to the air by transpiration. The same molecule keeps moving and changing form, and it is never created and never destroyed.` },
      relatedLoIds: ['m7sci.cycles-of-matter'],
    },
    {
      title: 'Worked forest without decomposers',
      steps: [
        `Start with the job decomposers do. They feed on fallen leaves, dead animals and waste, and while they feed they return the matter inside that dead material to the soil and to the air.`,
        `Ask what stops. Nothing breaks dead material down anymore. Fallen leaves pile up instead of disappearing. Dead animals stay where they fall. The forest floor gets deeper every single year.`,
        `Now follow the matter. The carbon and the nitrogen inside all of that dead material are still in the forest, but they are locked inside it. They sit in a place no plant can reach.`,
        `Ask what the plants lose. Plants take nitrogen and minerals in through their roots from the soil, and that supply normally gets restocked when decomposers break dead material down. With the restocking stopped, the soil runs short and the plants grow poorly. Fewer plants means less food for every animal above them.`,
        `Ask about energy separately, because energy behaves differently. Sunlight keeps arriving the whole time, so energy is not the problem at all. The problem is that matter stopped moving in a loop and started collecting in a dead end.`,
        `WRONG way to describe the result: "The forest runs out of matter." All of the matter is still right there in the pile. CORRECT way: "The matter is trapped in dead material instead of being returned, so the living part of the forest cannot get at it."`,
      ],
      example: { problem: `Imagine every decomposer in a forest disappeared overnight. The Sun keeps shining, the plants keep making food, and the animals keep eating. Predict what happens to that forest over the next several years, and explain why.`, solution: `Dead material piles up and the soil is never restocked, so plants slowly run short of the nitrogen and minerals they take in through their roots, and the whole forest declines. No matter is lost anywhere in this story. It is simply locked inside dead material because the step that returns it is missing, and sunlight keeps arriving the entire time, which shows the trouble is a matter problem and not an energy problem.` },
      relatedLoIds: ['m7sci.cycles-of-matter'],
    },
  ],
  pointers: [
    { content: `Students often say "A food web recycles energy the same way it recycles matter." — Matter and energy behave in opposite ways, and that contrast is the whole point of this lesson. Energy enters as sunlight, gets passed along the food web, and leaves as heat that no plant can capture again. That is exactly why sunlight has to keep arriving. Matter is not lost like that. A carbon atom that a decomposer releases into the air can be taken in by a plant tomorrow, built into a leaf, and eaten again next week. So the sentence is half right, and one swap fixes it: matter goes around and around, and energy gets passed along one way.`, kind: 'common-error' },
    { content: `Students often say "A plant builds brand new atoms in order to grow." — No living thing makes an atom. The atoms in a new leaf were already here, and they have been cycling around this planet for billions of years. A growing plant is collecting atoms and rearranging them: the carbon arrives from the AIR as carbon dioxide, the water comes up through the roots, and minerals come from the soil. When that leaf falls and decomposers break it apart, the same atoms go back out to be used again. Growth is rearrangement, never creation.`, kind: 'common-error' },
    { content: `Matter cycles and gets used over and over. Energy flows one way: in as sunlight, along the food web, out as heat. That is the sentence to keep.`, kind: 'tip' },
    { content: `Water: evaporation into vapor, condensation into clouds, precipitation as rain or snow, then runoff toward the ocean or soaking into the soil. Roots take water in, and leaves release it back as vapor.`, kind: 'tip' },
    { content: `Carbon: photosynthesis removes carbon dioxide from the air, and cellular respiration, decomposers and burning all return it.`, kind: 'tip' },
    { content: `Decomposers are the hinge. Without them, the matter in dead material would stay locked inside it and no plant would ever get those atoms back.`, kind: 'tip' },
    { content: `Nitrogen: most of the air is nitrogen gas, but almost no living thing can use it in that form. Bacteria in the soil change it into a form plant roots can take in.`, kind: 'tip' },
    { content: `Earth gets fresh energy every day but never fresh atoms. The atoms in you have cycled for billions of years, and a plant takes its carbon from the air, not from the soil.`, kind: 'tip' },
    { content: `Never write "a food web recycles energy." Matter cycles; energy flows one way — in as sunlight, out as heat. Swap the two words and the sentence is right: **matter goes around, energy passes along**.`, kind: 'common-error' },
    { content: `A plant's carbon comes from the **AIR**, not the soil. Soil gives water and minerals. So when a tree gains a ton of wood, most of that mass arrived through the leaves as carbon dioxide gas.`, kind: 'gotcha' },
    { content: `No living thing *makes* atoms. Plants collect and rearrange atoms that were already here. Say "the plant built the carbon into sugar," not "the plant made new carbon."`, kind: 'vocab-note' },
    { content: `In a forest with no decomposers, matter is **not lost** — it's locked inside piles of dead leaves and bodies where roots can't reach it. Say "trapped," not "used up" or "gone."`, kind: 'common-error' },
    { content: `Most of the air is nitrogen gas, yet plants standing in it can starve for nitrogen. They can't use that form. Soil bacteria must change it first — so "plenty of nitrogen around" does not mean "plenty of usable nitrogen."`, kind: 'edge-case' },
    { content: `Three things return carbon to the air, not just one: **cellular respiration** (in animals AND plants), **decomposers**, and **burning**. Only photosynthesis removes it.`, kind: 'tip' },
    { content: `Watch the water words: evaporation = liquid → invisible gas; condensation = gas → tiny droplets (clouds); precipitation = droplets falling; transpiration = leaves releasing vapor. Clouds are liquid droplets, not vapor.`, kind: 'vocab-note' },
    { content: `Quick self-check on any cycle answer: could the same atom be used again later? If yes, you're talking about matter. If it leaves as heat and never comes back, you're talking about energy.`, kind: 'tip' },
  ],
};
