/**
 * Grade 7 Science — Unit 10 CED 10.2: Population Changes & Limiting Factors.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.population-changes-and-limits.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U10_POPULATION_CHANGES_AND_LIMITS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.population-changes-and-limits.v1',
  course: 'Grade 7 Science',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Population Changes & Limiting Factors',
  planId: 'evelyn.ms.m7sci.population-changes-and-limits.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.population-changes-and-limits.v1' }],
  theory: [
    { loId: 'm7sci.population-changes-and-limits', content: `A POPULATION IS ALL THE MEMBERS OF ONE SPECIES LIVING IN ONE PLACE, such as all the frogs in one pond. Its size goes UP when animals are born or move in, and it goes DOWN when animals die or move out. That is the whole rule: a population grows when births plus arrivals are greater than deaths plus departures, it shrinks when deaths plus departures are greater, and it holds steady when the two sides roughly balance.` },
    { loId: 'm7sci.population-changes-and-limits', content: `A LIMITING FACTOR IS ANYTHING IN THE ENVIRONMENT THAT CAPS HOW LARGE A POPULATION CAN GET. Some limiting factors are BIOTIC, which means they involve living things: food, predators, disease, and competition with other species for the same resources. Others are ABIOTIC, which means they are nonliving: temperature, sunlight, how much water is available, and how much space or shelter there is. WRONG: "Only predators limit a population." CORRECT: running out of food, a hard freeze, or a disease can each cap a population just as firmly as a predator can.` },
    { loId: 'm7sci.population-changes-and-limits', content: `CARRYING CAPACITY IS THE POPULATION SIZE AN ENVIRONMENT CAN SUPPORT OVER TIME. It is set by whichever resource runs short first. A meadow with plenty of grass but almost no shelter is capped by the shelter, not the grass. Carrying capacity is not a property of the animal, it is a property of the place.` },
    { loId: 'm7sci.population-changes-and-limits', content: `CARRYING CAPACITY IS NOT A FIXED NUMBER. It moves when the environment moves. A wet year grows more plants, so the same meadow can support more rabbits than it could in a dry year. A pond that loses half its water in a dry summer supports fewer fish than it did before. WRONG: "The carrying capacity of this pond is 40 fish, and that never changes." CORRECT: the carrying capacity of this pond is about 40 fish under the conditions it has right now.` },
    { loId: 'm7sci.population-changes-and-limits', content: `REACHING CARRYING CAPACITY DOES NOT MEAN THE POPULATION STOPS CHANGING. Animals are still being born and still dying every year. What has changed is that the two roughly cancel out, so the count drifts up a little and down a little instead of climbing. Populations FLUCTUATE AROUND their carrying capacity rather than sitting exactly on it. WRONG: "It reached carrying capacity, so the number is frozen." CORRECT: it reached carrying capacity, so the number now wobbles near that level.` },
    { loId: 'm7sci.population-changes-and-limits', content: `HOW TO READ A TREND, one shape at a time. RISING fast means resources are still plentiful and births are outrunning deaths. LEVELING OFF means the population has met a limiting factor and is near carrying capacity. CRASHING, which is a sharp drop, means deaths and departures have suddenly overtaken births -- a resource ran out, a disease swept through, or the weather turned harsh. A crash is NOT extinction. If survivors remain, the population can climb again once conditions improve.` },
    { loId: 'm7sci.population-changes-and-limits', kind: 'definition', title: 'population', content: 'all the members of one species living in the same place at the same time.' },
    { loId: 'm7sci.population-changes-and-limits', kind: 'definition', title: 'limiting factor', content: `anything in the environment that caps how large a population can grow, such as food, space, disease or temperature.` },
    { loId: 'm7sci.population-changes-and-limits', kind: 'definition', title: 'carrying capacity', content: `the population size an environment can support over time, given the resources it has right now.` },
    { loId: 'm7sci.population-changes-and-limits', kind: 'definition', title: 'biotic factor', content: 'a living part of the environment, such as food, predators or disease.' },
    { loId: 'm7sci.population-changes-and-limits', kind: 'definition', title: 'abiotic factor', content: `a nonliving part of the environment, such as temperature, sunlight, water or space.` },
  ],
  methods: [
    {
      title: 'Worked read leveling trend',
      steps: [
        `Look at the changes between years rather than the counts alone. From year 1 to year 2 the count went up by about 25. From year 2 to year 3 it went up by about 35. Those are big jumps, so the population was rising fast.`,
        `Now look at the later changes. From year 3 to year 4 it went up by only about 5. From year 4 to year 5 it went DOWN by about 3. The jumps have shrunk to small wobbles.`,
        `Name the shape. The population rose steeply and then leveled off. That bend is the signature of a population meeting a limiting factor in its environment.`,
        `Say what the shape means about resources. While the count was climbing fast, the pond had food and space to spare. Once it leveled off near 80, something ran short -- insects to eat, room along the bank, or safe places to hide -- so deaths and departures caught up with births and arrivals.`,
        `Estimate the carrying capacity as the level the count settles around, not the level it started at. It settles around 80 to 85, so the carrying capacity of this pond is about 80 frogs.`,
        `Do not mistake the small drop in year 5 for a crash. Going from about 85 to about 82 is a wobble of about 3 frogs. That is exactly what fluctuating around carrying capacity looks like, and it is what tells you frogs are still being born and still dying.`,
      ],
      example: { problem: `Students counted the frogs in the pond behind their school once a year for five years. Year 1: about 20 frogs. Year 2: about 45 frogs. Year 3: about 80 frogs. Year 4: about 85 frogs. Year 5: about 82 frogs. Describe the trend and estimate the carrying capacity of the pond.`, solution: `The population rose quickly for three years, then leveled off. Carrying capacity is about 80 frogs. The small dip in year 5 is normal fluctuation around that level, not a crash.` },
      relatedLoIds: ['m7sci.population-changes-and-limits'],
    },
    {
      title: 'Worked read crash and factor',
      steps: [
        `Read the shape first. Years 1 to 3 climb steeply, from about 30 to about 75 to about 130. Then year 4 drops to about 20. A steep climb followed by a sharp drop is a crash.`,
        `Apply the births-and-deaths rule to the crash year. For the count to fall from about 130 to about 20, deaths and departures during year 4 had to be far greater than births and arrivals.`,
        `Find the cause in the information given. The grain ran out during year 3. Food is the resource these mice depended on, so once it was gone many mice starved or left the barn to look elsewhere.`,
        `Name the limiting factor and sort it. The limiting factor is food supply. Food is a living resource, so it is a BIOTIC factor. Nobody had to add a predator for this to happen.`,
        `Explain the overshoot. About 130 mice was more than the barn could support once the grain was gone, so the population had climbed past its carrying capacity. A population that overshoots does not simply stop -- it falls back hard.`,
        `Check what the crash does NOT mean. About 20 mice are still alive at the end of year 4. The species is not going extinct. If grain is stored in the barn again, this population can grow back.`,
      ],
      example: { problem: `A population of field mice living in a barn was counted each year. Year 1: about 30 mice. Year 2: about 75 mice. Year 3: about 130 mice. Year 4: about 20 mice. The farmer notes that the barn kept a large pile of stored grain, and that the grain was completely eaten up during year 3. Explain what happened and name the limiting factor.`, solution: `The mice grew past what the barn could support, then crashed in year 4 when deaths and departures overtook births. The limiting factor was the food supply, a biotic factor. About 20 mice survived, so the population can recover if food returns.` },
      relatedLoIds: ['m7sci.population-changes-and-limits'],
    },
  ],
  pointers: [
    { content: `Students often say "Once a population reaches carrying capacity the number stays exactly the same." — Rabbits are still being born and still dying every single year at carrying capacity. What changed is that the two sides now roughly balance, so the count drifts up a little and down a little instead of climbing. That is why the record reads about 60, then about 62, then about 58. A population FLUCTUATES AROUND its carrying capacity. The habit that fixes this: after you decide a population has leveled off, expect small wobbles and read them as normal.`, kind: 'common-error' },
    { content: `Students often say "A drop in the count means the species is going extinct." — Going from about 62 to about 58 is a change of about 4 rabbits. That is a wobble, not a crash. Even a real crash, like a beetle count falling from about 150 to about 25, is not extinction, because about 25 beetles are still alive and can rebuild the population once conditions improve. Ask two questions before you say extinct: how large is the drop compared with the numbers involved, and are there survivors left?`, kind: 'common-error' },
    { content: `A population grows when births plus arrivals are greater than deaths plus departures, and shrinks when the opposite is true.`, kind: 'tip' },
    { content: `Limiting factors cap growth. Biotic ones involve living things: food, predators, disease, competition. Abiotic ones are nonliving: temperature, sunlight, water availability, space and shelter.`, kind: 'tip' },
    { content: `Predators are only one limiting factor among many. Running out of food, a harsh winter, or a disease can cap a population just as firmly.`, kind: 'tip' },
    { content: `Carrying capacity is the population size an environment can support over time, and it is a property of the place, not of the animal.`, kind: 'tip' },
    { content: `Carrying capacity is not a fixed number. It rises and falls as the environment changes, such as a wet year growing more plants or a dry summer shrinking a pond.`, kind: 'tip' },
    { content: `Reaching carrying capacity does not freeze the count. Populations fluctuate around it, wobbling up and down by small amounts.`, kind: 'tip' },
    { content: `Read the trend: rising fast means resources are still plentiful, leveling off means a limiting factor has been met, and a sharp crash means deaths and departures suddenly overtook births.`, kind: 'tip' },
    { content: `A crash is not extinction. If survivors remain, the population can grow back once conditions improve.`, kind: 'tip' },
    { content: `A small wobble is not a crash. Ask *how big* the drop is compared to the numbers: 62 → 58 rabbits is normal fluctuation; 130 → 20 mice is a crash. Compare the size of the drop to the size of the population before you name it.`, kind: 'common-error' },
    { content: `Never write "the population stays at exactly 60." At carrying capacity animals are still being born and still dying — the two sides just balance. Say the count *fluctuates around* 60.`, kind: 'vocab-note' },
    { content: `A crash is not extinction. Always check the survivors: if 25 beetles are left, the population can grow back when conditions improve. Only say extinct if the number reaches zero.`, kind: 'common-error' },
    { content: `Don't default to "predators" as the limiting factor. Read the problem for what actually ran short — grain, plants, water, space, shelter — or what changed, like a freeze or a disease. Name the factor the passage gives you.`, kind: 'gotcha' },
    { content: `Food, predators, disease and competition are BIOTIC (they involve living things). Temperature, sunlight, water and space are ABIOTIC. Food trips people up — grain and plants were once alive, so food counts as biotic.`, kind: 'vocab-note' },
    { content: `Carrying capacity can move. If a pond dries up or a wet year grows extra plants, the number the population settles near changes too. Write "about 40 fish under current conditions," not "the carrying capacity is 40, period."`, kind: 'edge-case' },
    { content: `Carrying capacity belongs to the PLACE, not the animal. There's no single "carrying capacity of rabbits" — each meadow has its own. And it's set by whichever resource runs out first, so a meadow full of grass but with no shelter is capped by shelter.`, kind: 'gotcha' },
    { content: `To find carrying capacity from yearly counts, look at the *changes between years*, not the counts alone. When the jumps shrink to small ups and downs, that's the level it settled at — read the plateau, not the starting or highest number.`, kind: 'tip' },
  ],
};
