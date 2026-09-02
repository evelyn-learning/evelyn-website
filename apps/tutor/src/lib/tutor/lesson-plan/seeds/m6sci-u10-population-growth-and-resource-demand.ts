/**
 * Grade 6 Science (Earth & Space Science) — Human Activity & Earth's
 * Systems: Population Growth & Resource Demand.
 *
 * PROCEDURE-LED fan-out row for m6sci Unit 10, Topic 4 (NGSS MS-ESS3-4), and
 * the FINAL lesson of the course. One routine runs the whole lesson: total
 * demand on a resource or system equals the number of people using it
 * multiplied by how much each person uses, so the same arithmetic move --
 * population times per-person rate -- explains why demand rises even when
 * nobody's individual habits change, and why the direction the total moves
 * depends on the SIZE of both numbers together, never on either one alone.
 * Every worked example and try_yourself in this file runs that same
 * multiplication, because getting the multiplication right is the actual
 * skill this row teaches, not a detail underneath it.
 *
 * The two traps this row is built to kill are (a) assuming that because
 * per-person use has not changed, total use has not changed either -- which
 * drops the population factor out of the arithmetic entirely -- and (b)
 * assuming that a falling per-person number always means a falling total,
 * which drops the population factor the other way. Both worked examples and
 * the misconception check compute both totals by hand rather than reasoning
 * from the direction of a single number.
 *
 * Register note: this row invents every population figure and every
 * per-person rate. Real population and consumption statistics move
 * constantly and are frequently misstated, and the reasoning being taught
 * here -- how the multiplication works -- does not depend on the figures
 * being real. Every number in this file is small, round, clearly
 * illustrative, and attached to an unnamed town rather than a real place.
 * The register throughout is descriptive: this file explains why demand
 * grows and never says what should be done about it, and it never suggests
 * that any population, place or level of consumption is excessive,
 * blameworthy, or something that should not exist.
 *
 * SCOPE GUARD: this plan uses population and per-person consumption figures
 * to compute and compare total demand on a resource, or total footprint on a
 * natural system, before and after population growth, and does nothing past
 * that arithmetic and the comparisons it supports. Because the rest of
 * Units 9-10 sit close by, the guard states what is deliberately EXCLUDED
 * and what is deliberately ALLOWED at that edge, and why:
 *   - ROW 9.1 (renewable & nonrenewable resources) owns the rate-comparison
 *     classification of a resource -- whether its replacement rate keeps up
 *     with its use rate -- including the aquifer/recharge example this file
 *     borrows vocabulary from. This file states that rate-comparison rule in
 *     one bridging sentence (in one key idea and echoed in one hint) purely
 *     as a recap of a fact the student already met, and then spends its own
 *     content on something row 9.1 does not: showing that a rising TOTAL
 *     demand (population times per-person use) can push a town's use rate
 *     past that fixed replacement rate over time. It never RE-DERIVES why a
 *     resource counts as renewable, never repeats row 9.1's worked examples,
 *     and classifies no resource other than the single aquifer already used
 *     as row 9.1's own example -- fossil fuels, mineral ore, timber and solar
 *     energy, row 9.1's other four resources, are not mentioned anywhere in
 *     this file.
 *   - ROW 9.2 (how geologic processes distribute resources unevenly) is not
 *     touched: no ore deposit, fossil-fuel reserve, or the geologic process
 *     that formed an aquifer is discussed anywhere in this file.
 *   - ROWS 9.3-9.4 (mapping geologic hazards; forecasting weather hazards)
 *     are not touched: no earthquake, volcano, tsunami, hurricane, tornado
 *     or flood appears anywhere in this file.
 *   - ROWS 10.1-10.2 (the carbon cycle; evidence for rising global
 *     temperatures) are not touched: no carbon dioxide, temperature graph,
 *     or greenhouse effect appears anywhere in this file.
 *   - ROW 10.3 (monitoring & reducing human impact) owns evaluating a
 *     proposed design or policy solution. This file never asks the student
 *     to propose, evaluate, rank or recommend a solution, a filter, a
 *     treatment step, a conservation program or a policy -- every question
 *     in this file asks the student to compute or compare a total, never to
 *     decide what a town, a company or a person should do.
 *   - GRADE 7 LIFE SCIENCE boundary: this file never frames population,
 *     resource use, or human impact ecologically. The words "food web",
 *     "food chain", "ecosystem", "habitat", "biodiversity" and "carrying
 *     capacity" appear nowhere in this file, and "population" is used only
 *     for HUMAN population, exactly as the fan-out contract's Content-scope
 *     table specifies for this row. "Population" here names a plain count of
 *     people multiplied against a rate; it is never a species count, a
 *     growth curve, or a limiting-factor argument the way an ecology unit
 *     would use the word.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: every quantity in this file is a
 *     count of people, a rate stated in a plain unit (liters per day,
 *     kilograms per day), or the product of the two. There is no rate LAW,
 *     no unit of energy, no force, and no computed density anywhere in this
 *     file.
 *   - This row makes no claim about which population, place, or level of
 *     consumption is desirable, excessive, or blameworthy. It teaches the
 *     arithmetic of demand growth and nothing about how people ought to
 *     live, and no real country, city or group is named anywhere in it.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every town,
 * population figure and rate in this file is written out in words, and
 * every item is solvable from the numbers printed inside it. Never write
 * "see the table above", and never assume the student has seen a real water
 * bill, a real utility report, or a real census figure.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 10.3 (monitoring-and-reducing-human-impact-on-earth-systems) -> 10.4 (this
 * row), and this is the LAST row of the course, so followUps stays empty by
 * design -- not a lint artifact, the actual end of the chain.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U10_POPULATION_GROWTH_AND_RESOURCE_DEMAND: LessonPlan = {
  id: 'evelyn.ms.m6sci.population-growth-and-resource-demand.v1',
  title: 'Population Growth & Resource Demand',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.population-growth-and-resource-demand',
      standard: 'M6SCI-10.4',
      description:
        'Use population and per-person consumption data to explain how human population growth increases the demand placed on a named natural resource or the human footprint on a natural system (NGSS MS-ESS3-4).',
    },
  ],
  prerequisites: ['m6sci.monitoring-and-reducing-human-impact-on-earth-systems'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the population-times-rate idea in a household scale the student already understands.',
      script:
        'Picture your kitchen at home, with one full pack of paper towels sitting on the counter. Your family goes through it in about two weeks. Now imagine three cousins move in for the summer, so the house suddenly has twice as many people in it. Nobody is being wasteful. Nobody is using paper towels any faster, per person, than before. And yet that same pack is gone in about a week instead of two. Nothing changed about how each person uses paper towels. What changed is how many people were multiplying that same habit. Today we take that exact idea -- more people, same habits per person, more total used -- and apply it to something a whole town depends on: water. By the end, you will be able to explain, using two plain numbers, why a growing population increases the demand on a resource even when not one single person changes a habit.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-demand-is-a-product',
      kind: 'concept',
      goal: 'Install total-demand-as-a-product, show that both factors matter, and connect rising demand to a resource\'s replacement rate without re-teaching the classification rule.',
      keyIdeas: [
        'TOTAL DEMAND IS POPULATION MULTIPLIED BY PER-PERSON USE. If a resource is used by a group of people, the total amount used equals the number of people using it multiplied by how much each person uses on average. This is the same multiplication as figuring out how many total slices a family eats: four people eating two slices each is eight slices, and six people eating two slices each is twelve slices, even though nobody\'s own appetite changed at all.',
        'POPULATION GROWTH ALONE INCREASES TOTAL DEMAND, EVEN WHEN NO PERSON CHANGES A HABIT. Suppose a town has 2,000 people, and each person uses about 100 liters of water per day for drinking, washing and cooking. The town\'s total daily water use is 2,000 times 100, or 200,000 liters per day. If that town grows to 3,000 people over the next twenty years, and each person is still using the same 100 liters per day, the total is now 3,000 times 100, or 300,000 liters per day. The per-person rate never moved. The total rose anyway, by 100,000 liters per day, purely because there are more people multiplying that same rate.',
        'PER-PERSON USE CAN CHANGE TOO, AND THE TOTAL DEPENDS ON BOTH NUMBERS TOGETHER, NOT ON EITHER ONE ALONE. Per-person use can rise or fall for reasons that have nothing to do with population -- new appliances, a conservation program, a change in habits. When BOTH numbers change at once, you cannot tell which way the total moved just by noticing which single number went up or down. A large increase in population can outweigh a small decrease in per-person use, so the total still climbs; but a large enough decrease in per-person use can outweigh a growing population, so the total can still fall. The only way to know is to multiply both current numbers and compare the product with the old one.',
        'RISING TOTAL DEMAND CAN PUSH A RESOURCE PAST WHAT NATURE REPLACES. An earlier lesson explained that pumping water from an underground aquifer counts as a renewable use only when the pumping rate does not outrun the rate the aquifer recharges from rain and snowmelt -- a comparison between two rates, not a fact about water itself. Population growth is one of the things that can change which side of that comparison a town is on: as a town\'s population grows, its total water use (population times per-person rate) climbs, and if that climbing total eventually outruns the aquifer\'s fixed recharge rate, the very same aquifer that was being used renewably starts being used nonrenewably -- not because the aquifer changed, but because the total demand pulling on it did.',
        'THE SAME MULTIPLICATION EXPLAINS A FOOTPRINT, NOT ONLY A RESOURCE PEOPLE DRAW FROM. Population growth also increases the demand people place on natural systems that absorb or receive human activity, such as the amount of waste sent to a landfill. If a town of 2,000 people each sends about 1 kilogram of trash to the landfill per day, the landfill receives about 2,000 kilograms per day, since 2,000 times 1 is 2,000. If that same town grows to 3,000 people, with each person still sending about 1 kilogram per day, the landfill now receives about 3,000 kilograms per day, since 3,000 times 1 is 3,000. It is the identical multiplication as the water example, applied to a system that receives something from people rather than a resource that supplies something to them.',
      ],
      vocabulary: [
        { term: 'population growth', definition: 'an increase over time in the number of people living in a place.' },
        { term: 'per-person use', definition: 'the average amount of a resource that one person uses in a given amount of time.' },
        { term: 'total demand', definition: 'the full amount of a resource a whole population uses, found by multiplying the number of people by the per-person use.' },
        { term: 'human footprint', definition: 'the total effect that a population\'s resource use and waste have on a natural system, which grows the same way total demand grows.' },
        { term: 'recharge', definition: 'the natural process by which rain and melting snow soak into the ground and refill an aquifer, at a rate that does not depend on how fast people are pumping.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-population-grows-rate-fixed',
      kind: 'worked_example',
      problem:
        'A town has 2,000 people, and each person uses about 100 liters of water per day. Over the next twenty years, the town\'s population grows to 3,000 people, and each person continues to use about 100 liters per day, the same rate as twenty years earlier. Find the town\'s total daily water use at the start and now, and explain what changed.',
      steps: [
        'Write down what total daily water use means here: the number of people multiplied by how much each person uses per day.',
        'Compute the starting total. 2,000 people times 100 liters per person per day: 2,000 x 100 = 200,000 liters per day.',
        'Compute the total twenty years later. 3,000 people times 100 liters per person per day: 3,000 x 100 = 300,000 liters per day.',
        'Compare the two totals. 300,000 minus 200,000 equals 100,000, so total water use rose by 100,000 liters per day, even though the per-person rate never changed.',
        'WRONG: "Each person is using the same amount as before, so the town\'s total water use has not changed." CORRECT: "Each person\'s rate is unchanged, but there are now 1,000 more people using that same rate, so the total, which is the product of the two, has gone up."',
        'Now run the two checks a science answer needs, because there is no picture to check this against. First, look for clues of DIFFERENT KINDS that agree. The direct arithmetic gives 200,000 rising to 300,000. The multiplication rule gives the same direction on its own: multiplying a fixed positive rate by a bigger population can never produce a smaller product. The household-scale pattern from the start of the lesson -- more people, same per-person habit, more total used -- points the same way at a much smaller scale. Three different kinds of reasoning, one answer.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Suppose the town had SHRUNK instead, from 2,000 people down to 1,500 people, with per-person use still 100 liters per day. The new total would be 1,500 x 100 = 150,000 liters per day, which is LOWER than the original 200,000. So it is the change in population, not something about water itself, that decides which way the total moves.',
      ],
      answer:
        'The town\'s total daily water use rose from 200,000 liters per day to 300,000 liters per day, an increase of 100,000 liters per day, purely because the population grew while the per-person rate stayed the same.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-both-factors-change',
      kind: 'worked_example',
      problem:
        'Ten years after reaching 3,000 people and 300,000 liters per day, the same town installs low-flow fixtures, and per-person water use drops from 100 liters per day to 90 liters per day. Over those same ten years, the town\'s population grows further, from 3,000 to 4,500 people. Find the new total daily water use and compare it with the 300,000 liters per day the town used before the fixtures were installed.',
      steps: [
        'Use the same rule: total demand equals population times per-person use. Compute the new total: 4,500 people x 90 liters per person per day. 4,500 x 90 = 4,500 x 9 x 10 = 40,500 x 10 = 405,000 liters per day.',
        'Compare the new total with the old one. 405,000 minus 300,000 equals 105,000, so total water use rose by 105,000 liters per day, even though the per-person rate FELL.',
        'WRONG: "Per-person use dropped, so the total must have dropped too." CORRECT: "Total demand depends on both numbers multiplied together. Population grew by 1,500 people, a 50 percent increase from 3,000 (1,500 divided by 3,000 equals 0.50). Per-person use fell by only 10 liters, a 10 percent decrease from 100 (10 divided by 100 equals 0.10). The 50 percent increase in population is far larger than the 10 percent decrease in per-person use, so the product still rises."',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The direct arithmetic gives 300,000 rising to 405,000. The percentage comparison gives the same direction on its own: a 50 percent increase in one factor is much bigger than a 10 percent decrease in the other, so the product should rise, and it does. The pattern from the previous worked example -- population growth pushes the total up when the per-person rate is unchanged or only slightly reduced -- also points the same way. Three different kinds of reasoning, one answer.',
        'Second, change one thing about the setup and check that the answer moves the way it should, or does not, depending on how much it changes. Suppose per-person use had instead fallen much further, all the way to 60 liters per day, while population still grew from 3,000 to 4,500. The new total would be 4,500 x 60 = 4,500 x 6 x 10 = 27,000 x 10 = 270,000 liters per day, which IS lower than the original 300,000. So whether total demand rises or falls depends on the SIZE of both changes together, not on which direction population happened to move.',
      ],
      answer:
        'The new total is 405,000 liters per day, up from 300,000 liters per day: the 50 percent growth in population outweighed the 10 percent drop in per-person use. If per-person use had instead fallen much further, to 60 liters per day, the total would have fallen too, to 270,000 liters per day, showing that the outcome depends on the size of both changes together, not on the direction of either one alone.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-population-alone',
      kind: 'try_yourself',
      problem:
        'A town\'s population grows from 2,000 people to 3,000 people over twenty years. Each person continues to use about 100 liters of water per day, no more and no less than before. What happens to the town\'s total daily water use?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'It stays the same, because each person is using exactly the same amount of water per day as before, and a student looking only at that unchanged rate, without multiplying by how many people there now are, would conclude nothing has changed.',
        },
        {
          id: 'b',
          text: 'It falls, because a bigger population sharing the same water supply means each person receives a smaller share of it, so the amount used in total cannot possibly have gone up.',
        },
        {
          id: 'c',
          text: 'It rises, because the same per-person amount is now being multiplied by a larger number of people; multiplying a fixed positive rate by a bigger population can only increase the product, even though nothing changed for any one person.',
          correct: true,
        },
        {
          id: 'd',
          text: 'It cannot be determined, because the problem does not say whether the town\'s water treatment plant can supply more water, even though the population and rate figures given are enough to compute the total directly.',
        },
      ],
      expectedAnswer:
        'It rises, because the same per-person amount is now being multiplied by a larger number of people; multiplying a fixed positive rate by a bigger population can only increase the product, even though nothing changed for any one person.',
      hints: [
        'Start with what stays fixed in this problem: the amount each person uses. Has that number changed at all?',
        'Total use is the population number multiplied by the per-person number. If one of those two numbers gets bigger and the other stays exactly the same, what happens to the product?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-factors-population-wins',
      kind: 'try_yourself',
      problem:
        'In a different town, per-person water use drops from 80 liters per day to 75 liters per day over ten years, because of new low-flow fixtures. Over that same ten years, the town\'s population grows from 4,000 people to 5,000 people. What happens to the town\'s total daily water use?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'It falls, because the per-person amount decreased, and a student reasoning from that single number alone, without checking how much the population grew over the same ten years, would conclude the total demand must have gone down as well.',
        },
        {
          id: 'b',
          text: 'It stays about the same, because the drop in per-person use and the rise in population happen to cancel each other out exactly, the way a student might assume two opposite changes must always balance without multiplying either pair of numbers out.',
        },
        {
          id: 'c',
          text: 'It cannot be worked out without knowing the exact brand or number of low-flow fixtures the town installed, as if that detail, rather than the population and per-person numbers already given, decided the size of the total.',
        },
        {
          id: 'd',
          text: 'It rises, because the population growth from 4,000 to 5,000 outweighs the drop in per-person use from 80 to 75 liters per day, so multiplying the two current numbers together still gives a bigger total than before, even though the rate fell.',
          correct: true,
        },
      ],
      expectedAnswer:
        'It rises, because the population growth from 4,000 to 5,000 outweighs the drop in per-person use from 80 to 75 liters per day, so multiplying the two current numbers together still gives a bigger total than before, even though the rate fell.',
      hints: [
        'Do not decide from the direction of only one number. Write out both totals: population multiplied by per-person use, at the start and again ten years later.',
        'Compare how much bigger the population got with how much smaller the per-person amount got. A big jump in one number can outweigh a small drop in the other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-demand-and-recharge',
      kind: 'try_yourself',
      problem:
        'A town\'s water comes from an aquifer that recharges from rain and snowmelt at a steady rate that has not changed in decades. As the town\'s population has grown, its total water use, found by multiplying population by per-person use, has climbed every year, while the aquifer\'s recharge rate has stayed exactly the same. What does this pattern mean for whether the aquifer is being used renewably?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'If total water use keeps climbing while the recharge rate stays fixed, total use will eventually exceed the recharge rate, and pumping that used to be renewable will become nonrenewable, even though the aquifer itself has not changed, only the demand on it has.',
          correct: true,
        },
        {
          id: 'b',
          text: 'Nothing changes, because groundwater is a renewable resource, and a student who treats renewable as a fixed label attached to groundwater itself, rather than as a comparison between two rates, would conclude that no amount of pumping could ever change its status.',
        },
        {
          id: 'c',
          text: 'The classification depends only on the size of the population, so a bigger population always means the water use is nonrenewable, treating population size alone as the deciding factor and ignoring both the per-person rate and the recharge rate entirely.',
        },
        {
          id: 'd',
          text: 'The classification cannot change over time once it has been decided for a resource, because a student might assume renewable or nonrenewable is a permanent label fixed at the start rather than an ongoing comparison that can flip as either rate changes.',
        },
      ],
      expectedAnswer:
        'If total water use keeps climbing while the recharge rate stays fixed, total use will eventually exceed the recharge rate, and pumping that used to be renewable will become nonrenewable, even though the aquifer itself has not changed, only the demand on it has.',
      hints: [
        'Recall what decided whether a resource counted as renewable in the earlier lesson: how its use rate compares with its replacement rate, not some fact about the resource itself.',
        'One side of that comparison, the total use, is climbing every year in this problem. The other side, the recharge rate, is not moving at all. Think about what has to happen to which side is bigger if that keeps up.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-factor-decides-it',
      kind: 'misconception_check',
      question:
        'A student says: "A city\'s population grew a lot this year, but the news says each resident is using less water than last year because of a new conservation program, so the city\'s total water use must have gone down." Is that reasoning solid, and could the statement still turn out to be true?',
      commonErrors: [
        {
          answer: 'Per-person use fell, so total use must have fallen too.',
          misconception:
            'Assuming that a change in one factor -- per-person use -- decides the direction of the total by itself, without checking the size of the change in the other factor, population.',
          correctsTo:
            'Total use is the product of population and per-person use, so a drop in per-person use lowers the total only if population has not grown enough to outweigh it. If the population grew by a large amount while per-person use fell by only a little, the total can still rise. The fact about per-person use, on its own, does not decide the answer -- only multiplying both current numbers together and comparing that product with the old total decides which way the total moved.',
        },
        {
          answer: 'The statement must be false, because population always wins.',
          misconception:
            'Overcorrecting to assume population growth always outweighs a drop in per-person use, when a large enough drop in per-person use can still bring the total down even while population is growing.',
          correctsTo:
            'Whether the total rises or falls depends on the SIZE of both changes together, not simply on which direction population moved. If per-person use had fallen by a large enough amount, the total could fall even with a growing population, which is the exact reverse of the first mistake. Only computing both totals and comparing them -- never assuming from the direction of either number alone -- tells you which way the statement should actually go.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Total demand on a resource equals the number of people using it multiplied by how much each person uses: population times per-person rate.',
        'Population growth alone increases total demand, even when every person\'s own habits stay exactly the same.',
        'Per-person use can rise or fall too, and the direction of the total depends on the SIZE of both changes together, never on either number by itself.',
        'A large enough population increase can outweigh a drop in per-person use, and a large enough drop in per-person use can outweigh a population increase -- only multiplying both current numbers and comparing the result tells you which one wins.',
        'Rising total demand can push a resource past what nature replaces, turning a renewable use into a nonrenewable one over time, even though the resource itself has not changed.',
        'The same multiplication -- population times a per-person amount -- explains a growing footprint on a natural system, such as waste reaching a landfill, not only a resource people draw from.',
        'This is the final lesson of Grade 6 Science. Every unit in this course has asked you to reason carefully from stated evidence to a claim about the physical world -- this lesson closes the course by applying that same discipline to the biggest system of all: a growing number of people.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Population Growth & Resource Demand' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
