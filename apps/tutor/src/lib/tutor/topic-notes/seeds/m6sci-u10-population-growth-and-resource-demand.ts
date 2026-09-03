/**
 * Grade 6 Science — Unit 10 CED 10.4: Population Growth & Resource Demand.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.population-growth-and-resource-demand.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U10_POPULATION_GROWTH_AND_RESOURCE_DEMAND: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.population-growth-and-resource-demand.v1',
  course: 'Grade 6 Science',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Population Growth & Resource Demand',
  planId: 'evelyn.ms.m6sci.population-growth-and-resource-demand.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.population-growth-and-resource-demand.v1' }],
  theory: [
    { loId: 'm6sci.population-growth-and-resource-demand', content: `TOTAL DEMAND IS POPULATION MULTIPLIED BY PER-PERSON USE. If a resource is used by a group of people, the total amount used equals the number of people using it multiplied by how much each person uses on average. This is the same multiplication as figuring out how many total slices a family eats: four people eating two slices each is eight slices, and six people eating two slices each is twelve slices, even though nobody's own appetite changed at all.` },
    { loId: 'm6sci.population-growth-and-resource-demand', content: `POPULATION GROWTH ALONE INCREASES TOTAL DEMAND, EVEN WHEN NO PERSON CHANGES A HABIT. Suppose a town has 2,000 people, and each person uses about 100 liters of water per day for drinking, washing and cooking. The town's total daily water use is 2,000 times 100, or 200,000 liters per day. If that town grows to 3,000 people over the next twenty years, and each person is still using the same 100 liters per day, the total is now 3,000 times 100, or 300,000 liters per day. The per-person rate never moved. The total rose anyway, by 100,000 liters per day, purely because there are more people multiplying that same rate.` },
    { loId: 'm6sci.population-growth-and-resource-demand', content: `PER-PERSON USE CAN CHANGE TOO, AND THE TOTAL DEPENDS ON BOTH NUMBERS TOGETHER, NOT ON EITHER ONE ALONE. Per-person use can rise or fall for reasons that have nothing to do with population -- new appliances, a conservation program, a change in habits. When BOTH numbers change at once, you cannot tell which way the total moved just by noticing which single number went up or down. A large increase in population can outweigh a small decrease in per-person use, so the total still climbs; but a large enough decrease in per-person use can outweigh a growing population, so the total can still fall. The only way to know is to multiply both current numbers and compare the product with the old one.` },
    { loId: 'm6sci.population-growth-and-resource-demand', content: `RISING TOTAL DEMAND CAN PUSH A RESOURCE PAST WHAT NATURE REPLACES. An earlier lesson explained that pumping water from an underground aquifer counts as a renewable use only when the pumping rate does not outrun the rate the aquifer recharges from rain and snowmelt -- a comparison between two rates, not a fact about water itself. Population growth is one of the things that can change which side of that comparison a town is on: as a town's population grows, its total water use (population times per-person rate) climbs, and if that climbing total eventually outruns the aquifer's fixed recharge rate, the very same aquifer that was being used renewably starts being used nonrenewably -- not because the aquifer changed, but because the total demand pulling on it did.` },
    { loId: 'm6sci.population-growth-and-resource-demand', content: `THE SAME MULTIPLICATION EXPLAINS A FOOTPRINT, NOT ONLY A RESOURCE PEOPLE DRAW FROM. Population growth also increases the demand people place on natural systems that absorb or receive human activity, such as the amount of waste sent to a landfill. If a town of 2,000 people each sends about 1 kilogram of trash to the landfill per day, the landfill receives about 2,000 kilograms per day, since 2,000 times 1 is 2,000. If that same town grows to 3,000 people, with each person still sending about 1 kilogram per day, the landfill now receives about 3,000 kilograms per day, since 3,000 times 1 is 3,000. It is the identical multiplication as the water example, applied to a system that receives something from people rather than a resource that supplies something to them.` },
    { loId: 'm6sci.population-growth-and-resource-demand', kind: 'definition', title: 'population growth', content: 'an increase over time in the number of people living in a place.' },
    { loId: 'm6sci.population-growth-and-resource-demand', kind: 'definition', title: 'per-person use', content: 'the average amount of a resource that one person uses in a given amount of time.' },
    { loId: 'm6sci.population-growth-and-resource-demand', kind: 'definition', title: 'total demand', content: `the full amount of a resource a whole population uses, found by multiplying the number of people by the per-person use.` },
    { loId: 'm6sci.population-growth-and-resource-demand', kind: 'definition', title: 'human footprint', content: `the total effect that a population's resource use and waste have on a natural system, which grows the same way total demand grows.` },
    { loId: 'm6sci.population-growth-and-resource-demand', kind: 'definition', title: 'recharge', content: `the natural process by which rain and melting snow soak into the ground and refill an aquifer, at a rate that does not depend on how fast people are pumping.` },
  ],
  methods: [
    {
      title: 'Worked population grows rate fixed',
      steps: [
        `Write down what total daily water use means here: the number of people multiplied by how much each person uses per day.`,
        `Compute the starting total. 2,000 people times 100 liters per person per day: 2,000 x 100 = 200,000 liters per day.`,
        `Compute the total twenty years later. 3,000 people times 100 liters per person per day: 3,000 x 100 = 300,000 liters per day.`,
        `Compare the two totals. 300,000 minus 200,000 equals 100,000, so total water use rose by 100,000 liters per day, even though the per-person rate never changed.`,
        `WRONG: "Each person is using the same amount as before, so the town's total water use has not changed." CORRECT: "Each person's rate is unchanged, but there are now 1,000 more people using that same rate, so the total, which is the product of the two, has gone up."`,
        `Now run the two checks a science answer needs, because there is no picture to check this against. First, look for clues of DIFFERENT KINDS that agree. The direct arithmetic gives 200,000 rising to 300,000. The multiplication rule gives the same direction on its own: multiplying a fixed positive rate by a bigger population can never produce a smaller product. The household-scale pattern from the start of the lesson -- more people, same per-person habit, more total used -- points the same way at a much smaller scale. Three different kinds of reasoning, one answer.`,
        `Second, change one thing about the setup and check that the answer moves the way it should. Suppose the town had SHRUNK instead, from 2,000 people down to 1,500 people, with per-person use still 100 liters per day. The new total would be 1,500 x 100 = 150,000 liters per day, which is LOWER than the original 200,000. So it is the change in population, not something about water itself, that decides which way the total moves.`,
      ],
      example: { problem: `A town has 2,000 people, and each person uses about 100 liters of water per day. Over the next twenty years, the town's population grows to 3,000 people, and each person continues to use about 100 liters per day, the same rate as twenty years earlier. Find the town's total daily water use at the start and now, and explain what changed.`, solution: `The town's total daily water use rose from 200,000 liters per day to 300,000 liters per day, an increase of 100,000 liters per day, purely because the population grew while the per-person rate stayed the same.` },
      relatedLoIds: ['m6sci.population-growth-and-resource-demand'],
    },
    {
      title: 'Worked both factors change',
      steps: [
        `Use the same rule: total demand equals population times per-person use. Compute the new total: 4,500 people x 90 liters per person per day. 4,500 x 90 = 4,500 x 9 x 10 = 40,500 x 10 = 405,000 liters per day.`,
        `Compare the new total with the old one. 405,000 minus 300,000 equals 105,000, so total water use rose by 105,000 liters per day, even though the per-person rate FELL.`,
        `WRONG: "Per-person use dropped, so the total must have dropped too." CORRECT: "Total demand depends on both numbers multiplied together. Population grew by 1,500 people, a 50 percent increase from 3,000 (1,500 divided by 3,000 equals 0.50). Per-person use fell by only 10 liters, a 10 percent decrease from 100 (10 divided by 100 equals 0.10). The 50 percent increase in population is far larger than the 10 percent decrease in per-person use, so the product still rises."`,
        `Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The direct arithmetic gives 300,000 rising to 405,000. The percentage comparison gives the same direction on its own: a 50 percent increase in one factor is much bigger than a 10 percent decrease in the other, so the product should rise, and it does. The pattern from the previous worked example -- population growth pushes the total up when the per-person rate is unchanged or only slightly reduced -- also points the same way. Three different kinds of reasoning, one answer.`,
        `Second, change one thing about the setup and check that the answer moves the way it should, or does not, depending on how much it changes. Suppose per-person use had instead fallen much further, all the way to 60 liters per day, while population still grew from 3,000 to 4,500. The new total would be 4,500 x 60 = 4,500 x 6 x 10 = 27,000 x 10 = 270,000 liters per day, which IS lower than the original 300,000. So whether total demand rises or falls depends on the SIZE of both changes together, not on which direction population happened to move.`,
      ],
      example: { problem: `Ten years after reaching 3,000 people and 300,000 liters per day, the same town installs low-flow fixtures, and per-person water use drops from 100 liters per day to 90 liters per day. Over those same ten years, the town's population grows further, from 3,000 to 4,500 people. Find the new total daily water use and compare it with the 300,000 liters per day the town used before the fixtures were installed.`, solution: `The new total is 405,000 liters per day, up from 300,000 liters per day: the 50 percent growth in population outweighed the 10 percent drop in per-person use. If per-person use had instead fallen much further, to 60 liters per day, the total would have fallen too, to 270,000 liters per day, showing that the outcome depends on the size of both changes together, not on the direction of either one alone.` },
      relatedLoIds: ['m6sci.population-growth-and-resource-demand'],
    },
  ],
  pointers: [
    { content: `Students often say "Per-person use fell, so total use must have fallen too." — Total use is the product of population and per-person use, so a drop in per-person use lowers the total only if population has not grown enough to outweigh it. If the population grew by a large amount while per-person use fell by only a little, the total can still rise. The fact about per-person use, on its own, does not decide the answer -- only multiplying both current numbers together and comparing that product with the old total decides which way the total moved.`, kind: 'common-error' },
    { content: `Students often say "The statement must be false, because population always wins." — Whether the total rises or falls depends on the SIZE of both changes together, not simply on which direction population moved. If per-person use had fallen by a large enough amount, the total could fall even with a growing population, which is the exact reverse of the first mistake. Only computing both totals and comparing them -- never assuming from the direction of either number alone -- tells you which way the statement should actually go.`, kind: 'common-error' },
    { content: `Total demand on a resource equals the number of people using it multiplied by how much each person uses: population times per-person rate.`, kind: 'tip' },
    { content: `Population growth alone increases total demand, even when every person's own habits stay exactly the same.`, kind: 'tip' },
    { content: `Per-person use can rise or fall too, and the direction of the total depends on the SIZE of both changes together, never on either number by itself.`, kind: 'tip' },
    { content: `A large enough population increase can outweigh a drop in per-person use, and a large enough drop in per-person use can outweigh a population increase -- only multiplying both current numbers and comparing the result tells you which one wins.`, kind: 'tip' },
    { content: `Rising total demand can push a resource past what nature replaces, turning a renewable use into a nonrenewable one over time, even though the resource itself has not changed.`, kind: 'tip' },
    { content: `The same multiplication -- population times a per-person amount -- explains a growing footprint on a natural system, such as waste reaching a landfill, not only a resource people draw from.`, kind: 'tip' },
    { content: `This is the final lesson of Grade 6 Science. Every unit in this course has asked you to reason carefully from stated evidence to a claim about the physical world -- this lesson closes the course by applying that same discipline to the biggest system of all: a growing number of people.`, kind: 'tip' },
  ],
};
