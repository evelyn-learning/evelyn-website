/**
 * Grade 6 Science (Earth & Space Science) — Earth's Resources & Natural
 * Hazards: Renewable & Nonrenewable Resources.
 *
 * CONCEPT-LED fan-out row for m6sci Unit 9, Topic 1 (NGSS MS-ESS3-1). The
 * whole lesson is one comparison, applied to five named resources: is the
 * resource being replaced by nature about as fast as, or faster than, people
 * are using it? Fossil fuels and mineral ore fail that test because they form
 * over spans of time far longer than any human use rate. Solar energy passes
 * it automatically, because the sun's supply rate does not depend on how much
 * of it people capture. Groundwater and timber are the genuinely interesting
 * cases: the identical resource can sit on either side of the line depending
 * only on how fast it is drawn down relative to how fast it recharges or
 * regrows, which is what makes the rate framing the actual content of the
 * lesson rather than a label to memorize.
 *
 * The two traps this row is built to kill are (a) treating "renewable" and
 * "nonrenewable" as a fixed list of resources sorted by what they are made
 * of, rather than a rate comparison that can, for some resources, come out
 * differently depending on how they are used, and (b) treating "renewable"
 * as a synonym for "unlimited" or "cannot run out" -- a renewable resource
 * used faster than it is replaced behaves exactly like a nonrenewable one for
 * as long as that overuse continues.
 *
 * Register note: resource facts and reserve figures are politically
 * contested and frequently misstated, so this file states no reserve
 * tonnage, no exact percentage of any energy mix, and no current-year
 * statistic anywhere -- every comparison is qualitative (a rate faster than,
 * or about the same as, another rate), and every named number is small,
 * invented for the scenario, and used only to compare two rates against each
 * other, never as a real-world figure. The register throughout is
 * descriptive, not advocating: the lesson explains how the classification
 * works and never tells the student what a person, a company or a country
 * ought to do about it.
 *
 * SCOPE GUARD: this plan classifies a named resource as renewable or
 * nonrenewable by comparing its replacement rate with its use rate, and does
 * nothing else. Because the rest of Unit 9 sits very close, the guard states
 * what is deliberately EXCLUDED and also what is deliberately ALLOWED at
 * that edge, and why:
 *   - ROW 9.2 (how geologic processes distribute resources unevenly) owns
 *     WHY a fossil-fuel reserve or an ore deposit occurs in one place and not
 *     another, and the geologic process (ancient sedimentation, past
 *     volcanic activity) that formed it there. This file states only THAT
 *     fossil fuels and mineral ore form underground over an enormous span of
 *     geologic time -- the fact its classification depends on -- and never
 *     explains where a deposit forms, why it sits where it does, or the
 *     process that put it there. That reasoning is row 9.2's, not this row's.
 *   - ROWS 9.3 (mapping geologic hazards) and 9.4 (forecasting and preparing
 *     for weather hazards) are not touched at all: no earthquake, volcano,
 *     tsunami, hurricane, tornado or flood appears anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: this row never frames a resource
 *     ecologically. There is no food chain, food web, ecosystem, habitat,
 *     biodiversity, population (human or otherwise), or living-thing-as-
 *     organism content anywhere in this file. Timber is discussed strictly
 *     as a harvested material and a regrowth rate, never as habitat or as
 *     part of a forest ecosystem, and no tree, plant or organism is treated
 *     as a living thing with needs of its own.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: solar energy appears only as a
 *     named, continuously supplied driver, exactly as the fan-out contract's
 *     Content-scope table allows. No joule, no watt, no kinetic or potential
 *     energy, no conservation-of-energy law, and no calculation of any kind
 *     appears anywhere in this file. Every rate comparison in this lesson is
 *     qualitative -- faster than, slower than, about the same as -- and
 *     never a computed number.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * scenario in this file is written out in words, and every item is solvable
 * from the text printed inside it. Never write "see the diagram above", and
 * never assume the student has seen a real mine, a real aquifer or a real
 * logging operation.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 8.4 (reading-climate-graphs) -> 9.1 (this row) -> 9.2
 * (how-geologic-processes-distribute-resources-unevenly). Both neighboring
 * rows are authored elsewhere in this same fan-out batch and are registered
 * together with this file, so both arrays below are populated with the real
 * loIds rather than left empty.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U9_RENEWABLE_AND_NONRENEWABLE_RESOURCES: LessonPlan = {
  id: 'evelyn.ms.m6sci.renewable-and-nonrenewable-resources.v1',
  title: 'Renewable & Nonrenewable Resources',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.renewable-and-nonrenewable-resources',
      standard: 'M6SCI-9.1',
      description:
        'Classify a named Earth resource (fossil fuel, mineral ore, groundwater, timber, solar energy) as renewable or nonrenewable based on the rate it can be replaced compared to the rate it is used (NGSS MS-ESS3-1).',
    },
  ],
  prerequisites: ['m6sci.reading-climate-graphs'],
  followUps: ['m6sci.how-geologic-processes-distribute-resources-unevenly'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the rate comparison in something the student already does without thinking about it.',
      script:
        'Think about your phone battery. You use it all day, and at night you plug it in, and by morning it is full again. Now think about a candle. You light it, it burns down, and no matter how long you wait afterward, it does not grow back. Both of those things got used up. But something about how fast each one comes back is completely different, and that difference -- not what the thing is made of -- is what decides whether we call a resource renewable or nonrenewable. Today we apply that one idea to five real resources people use every day: fossil fuels, mineral ore, groundwater, timber and sunlight. Two of them will surprise you, because the same resource can land on either side of the line depending on how fast it is used.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rate-comparison',
      kind: 'concept',
      goal: 'Install the rate-comparison definition, sort the five named resources against it, and kill the "renewable means unlimited" error.',
      keyIdeas: [
        'RENEWABLE AND NONRENEWABLE ARE A RATE COMPARISON, NOT A LIST TO MEMORIZE. A resource is RENEWABLE if nature replaces it about as fast as, or faster than, people use it. A resource is NONRENEWABLE if nature replaces it far more slowly than people use it -- so much more slowly that, for any span of time that matters to people, what gets used is not getting replaced. Nothing about what a resource is made of decides this by itself. What decides it is always a comparison between two speeds: the replacement rate and the use rate.',
        'FOSSIL FUELS AND MINERAL ORE ARE NONRENEWABLE, BECAUSE OF HOW SLOWLY THEY FORM. A fossil fuel such as coal or oil forms underground from buried material, under heat and pressure, over an enormous span of geologic time. A mineral ore, such as a copper deposit, forms underground as mineral-rich fluids slowly deposit minerals in rock over a similarly enormous span of time. In both cases, the formation rate is nowhere close to the rate at which mines and wells remove the resource, so a deposit that gets used is not being replaced on any timescale that matters to the people using it. That is what makes both of them nonrenewable, not the fact that they come from underground.',
        'SOLAR ENERGY IS RENEWABLE NO MATTER HOW FAST IT IS USED. The sun keeps supplying sunlight to Earth at about the same rate whether people capture a little of it or a lot of it. Capturing more sunlight today does not reduce how much arrives tomorrow, because the supply is not a stored amount that people are drawing down -- it keeps arriving on its own. That makes solar energy renewable regardless of use rate, which is different from every other resource in this lesson. Notice, too, that this classification is about the SUNLIGHT, not about the solar panels that capture it: a panel wearing out or a shortage of panels says nothing about whether sunlight itself is being used up, because it is not.',
        'GROUNDWATER AND TIMBER ARE THE INTERESTING EDGE CASES, BECAUSE THE SAME RESOURCE CAN GO EITHER WAY. An underground water supply, called an aquifer, recharges as rain and melting snow soak into the ground -- a natural process that happens whether or not anyone is pumping. If people pump water out at about the same rate the aquifer recharges, the water level holds steady and the resource is being used renewably. If people pump much faster than the recharge rate, the water level drops year after year, and that same water is being used up faster than nature replaces it -- behaving exactly like a nonrenewable resource for as long as the overpumping continues. Timber works the same way: if trees are cut at about the same rate new ones grow to replace them, timber is renewable; if a forest is cut far faster than it can regrow, the wood is being used up faster than nature replaces it, even though trees are, in general, capable of growing back.',
        'RENEWABLE DOES NOT MEAN UNLIMITED, AND IT DOES NOT MEAN CLEAN. A renewable resource can still run low, and even run out for a while, if it is used faster than it is replaced -- an overpumped aquifer and an overcut forest are proof of that. "Renewable" is a statement about a rate, not a promise that a resource can never be reduced or that using it causes no other effects. Keep those two ideas -- rate of replacement, and everything else about a resource -- separate in your head, because mixing them together is the single most common mistake on this topic.',
      ],
      vocabulary: [
        { term: 'renewable resource', definition: 'a resource that nature replaces about as fast as, or faster than, people are using it.' },
        { term: 'nonrenewable resource', definition: 'a resource that nature replaces far more slowly than people are using it, so that what is used is effectively not replaced on a timescale that matters to people.' },
        { term: 'fossil fuel', definition: 'a fuel such as coal, oil or natural gas that forms underground from buried material over an enormous span of geologic time.' },
        { term: 'mineral ore', definition: 'rock containing a mineral, such as copper, that formed underground as mineral-rich fluids deposited it in cracks in the surrounding rock over an enormous span of geologic time.' },
        { term: 'aquifer', definition: 'an underground layer of rock or soil that holds groundwater and can supply it through a well.' },
        { term: 'recharge', definition: 'the natural process by which rain and melting snow soak into the ground and refill an aquifer.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-solar-and-coal',
      kind: 'worked_example',
      problem:
        'A power company gets some of its electricity from a solar farm on a hillside, and some from a power plant that burns coal mined from underground several states away. Classify each energy source as renewable or nonrenewable and explain why.',
      steps: [
        'Start with what supplies each source. The solar farm receives sunlight arriving from the sun. The coal plant burns coal that formed underground from buried material, under heat and pressure, over an enormous span of geologic time.',
        'Apply the rate comparison to sunlight first. The sun supplies sunlight to Earth at about the same rate no matter how much any solar farm captures today, because the supply is not a stored amount being drawn down -- it keeps arriving on its own. Since the supply rate does not depend on the use rate at all, sunlight is renewable.',
        'Apply the same comparison to coal. Coal formation is still happening somewhere underground, but at a pace measured over an enormous span of geologic time, while mines remove coal on a pace measured in years. The removal rate is so much faster than the formation rate that the coal being mined and burned today is not being replaced on any timescale that matters to people. That makes coal nonrenewable.',
        'WRONG: "Coal is renewable, because new coal is still forming somewhere underground right now." CORRECT: "Coal formation has not stopped, but it is so much slower than the rate coal is mined and burned that, for any span of time that matters to people, the coal being used is not being replaced." Coal being renewable in principle, over a span of time far longer than any human plan, is not the same as coal being renewable in practice.',
        'Now run the two checks a science answer needs, because there is no arithmetic to redo here. First, look for clues of DIFFERENT KINDS that agree. The mechanism says sunlight is a continuously arriving supply while coal is a one-time deposit accumulated in the past. The rate comparison says the solar supply rate does not depend on use at all, while the coal removal rate vastly exceeds its formation rate. The classification rule, applied to both in the same way, gives a different answer for each -- which is exactly what should happen when two resources behave differently. Three different kinds of reasoning, one consistent pair of answers.',
        'Second, change one thing about the setup and check that the answer moves the way it should, or does not move when it should not. Suppose solar panel factories could not build panels fast enough to meet a sudden jump in demand. Does that change whether sunlight itself is renewable? No -- the classification is about the resource, sunlight, and the sun keeps supplying it at the same rate regardless of how much equipment exists to capture it. A shortage of panels is a shortage of equipment, not a sign that sunlight is being used up. That confirms the classification is tracking the resource, not the technology built around it.',
      ],
      answer:
        'Sunlight is renewable, because the sun supplies it at about the same rate no matter how much is captured. Coal is nonrenewable, because it forms far more slowly underground than the rate at which it is mined and burned.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-groundwater-two-years',
      kind: 'worked_example',
      problem:
        'A town gets all of its water from an aquifer that naturally recharges from rain each year. In Year One, the town pumps water out at about the same rate the aquifer recharges, and the water level stays about the same. In Year Two, a new factory opens and the town pumps much faster than the aquifer can recharge, and the water level drops noticeably by the end of the year. Classify the town\'s water use in each year, and explain.',
      steps: [
        'Identify the mechanism first. The aquifer recharges as rain soaks into the ground -- a process that happens on its own, whether or not anyone is pumping. Pumping removes water from the same aquifer.',
        'Compare the two rates in Year One. Pumping happens at about the same rate as recharge, so water is being replaced about as fast as it is used. That is a renewable pattern of use.',
        'Compare the two rates in Year Two. Pumping happens much faster than recharge, so water is being removed faster than nature replaces it. The water level drops as a direct result. That is a nonrenewable pattern of use, for as long as it continues.',
        'WRONG: "Groundwater is always renewable, because it comes from rain." CORRECT: "Groundwater is renewable only when it is pumped no faster than it recharges. Pumped faster than that, the same water is used up just like a nonrenewable resource, even though rain keeps falling on the same schedule as before."',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The mechanism says recharge from rainfall runs independently of pumping. The rate comparison says Year One is pump-about-equals-recharge and Year Two is pump-far-exceeds-recharge. The observable evidence -- the water level holding steady in Year One and dropping in Year Two -- is a physical result that matches what the rate comparison predicts in both years. Three different kinds of reasoning landing on the same two answers.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Suppose the factory closed after Year Two and pumping fell back to the Year One rate. Would the water level recover? Yes, given enough time, because recharge would once again keep pace with the reduced pumping -- the aquifer is not gone, it was only being drawn down faster than it was being replaced. Compare that with the coal in the worked example before this one: no amount of waiting brings back coal that has already been mined and burned, on any timescale a person could wait for. That contrast is the whole point of calling groundwater a resource whose classification depends on the rate of use, while coal\'s classification does not depend on the rate at all.',
      ],
      answer:
        'In Year One, the town\'s water use is renewable, because pumping is matched to the recharge rate. In Year Two, the same aquifer is being used nonrenewably, because pumping far exceeds the recharge rate and the water level is dropping as a result.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-timber-harvest-rate',
      kind: 'try_yourself',
      problem:
        'A logging company cuts trees for lumber from a forest, and replants so that new trees grow to replace the ones cut at about the same rate the company is cutting them. How should the timber from that forest be classified?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nonrenewable, because once a specific tree is cut down, that exact tree can never grow back in its place.' },
        { id: 'b', text: 'Renewable, because wood can always be replaced by a different material, such as plastic or metal, whenever the forest runs low.' },
        { id: 'c', text: 'Renewable, because the forest is growing new trees to replace the old ones at about the same rate the company is cutting them.', correct: true },
        { id: 'd', text: 'Nonrenewable, because the resource being counted is the finished lumber, and a board that has already been cut never grows back on its own.' },
      ],
      expectedAnswer: 'Renewable, because the forest is growing new trees to replace the old ones at about the same rate the company is cutting them.',
      hints: [
        'The classification is not about whether one particular tree comes back. It is about whether the forest as a whole is being restocked about as fast as trees are being removed from it.',
        'Compare the cutting rate to the regrowth rate described in the problem. The problem tells you those two rates directly -- use that comparison rather than a rule about any single tree or any single board.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-copper-ore-formation',
      kind: 'try_yourself',
      problem:
        'A copper ore deposit formed underground over an enormous span of geologic time, as copper-rich fluids slowly deposited minerals into cracks in the surrounding rock. A mining company now removes a large amount of that ore every year. How should this copper ore be classified?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Renewable, because a mining company can simply open a new mine somewhere else once one deposit runs low.' },
        { id: 'b', text: 'Renewable, because copper that has already been mined can be recycled and reused many times after it is first extracted.' },
        { id: 'c', text: 'Nonrenewable, but only because mining copper ore is costly, not because of how slowly the ore itself forms.' },
        { id: 'd', text: 'Nonrenewable, because the ore forms underground far more slowly than the rate at which the mining company is removing it.', correct: true },
      ],
      expectedAnswer: 'Nonrenewable, because the ore forms underground far more slowly than the rate at which the mining company is removing it.',
      hints: [
        'Finding more of a resource somewhere else, or being able to reuse what has already been taken out, tells you something about supply and recycling -- neither one is the rate comparison this lesson is built on.',
        'Go back to the two rates that decide the classification: how fast the ore forms underground, and how fast it is being mined. Which of those two rates does the problem tell you is enormous, and which does it tell you is happening every year?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-solar-classification',
      kind: 'try_yourself',
      problem:
        'A solar panel installer explains that today\'s solar panels capture only a small share of the sunlight that reaches them, and that even if every solar panel on Earth ran at once, together they could use only a small share of the sunlight arriving at the planet. Based on the rate at which sunlight arrives, how should solar energy be classified?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Renewable, because the sun keeps supplying sunlight at about the same rate no matter how much of it people capture and use.', correct: true },
        { id: 'b', text: 'Nonrenewable, because most of the sunlight that reaches Earth is never captured or used by any solar panel at all.' },
        { id: 'c', text: 'Renewable, because worn-out solar panels can be manufactured again and installed to replace the ones that fail.' },
        { id: 'd', text: 'It cannot be classified without knowing exactly how many solar panels are currently operating on Earth.' },
      ],
      expectedAnswer: 'Renewable, because the sun keeps supplying sunlight at about the same rate no matter how much of it people capture and use.',
      hints: [
        'The classification is about the sunlight arriving from the sun, not about the panels that capture a share of it or how many of them exist.',
        'Ask the rate-comparison question directly: does capturing more sunlight today reduce how much sunlight arrives tomorrow? If not, what does that tell you about how the supply rate relates to the use rate?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-renewable-means-unlimited',
      kind: 'misconception_check',
      question:
        'A student writes: "Groundwater is renewable, so this town can pump as much as it wants and never run out. Timber is renewable too, so cutting down this whole forest right now is fine, because the trees will grow back." Two separate mistakes are being made. What are they?',
      commonErrors: [
        {
          answer: 'Groundwater is renewable, so this town can pump as much as it wants and never run out.',
          misconception:
            'Treating "renewable" as a synonym for "unlimited", rather than as a comparison between the rate a resource is replaced and the rate it is used.',
          correctsTo:
            'Renewable means a resource can be replaced about as fast as it is used -- it is not a promise that there is no limit. If a town pumps groundwater much faster than rain and snowmelt can refill the aquifer, the water level drops just as it would for a nonrenewable resource, even though rain keeps falling on the same schedule as before. A renewable resource can still be used up faster than it is replaced.',
        },
        {
          answer: 'Cutting down this whole forest right now is fine, because the trees will grow back.',
          misconception:
            'Assuming that because a resource is CAPABLE of regrowing, any rate of harvesting it must count as renewable -- when the classification depends on comparing the actual harvest rate with the actual regrowth rate, not on whether regrowth is possible in principle.',
          correctsTo:
            'Timber behaves as a renewable resource only when trees are cut at about the same rate new ones grow to replace them. Cutting down an entire forest at once removes trees far faster than new ones can grow back, so that harvest is using timber up faster than nature is replacing it -- a nonrenewable pattern of use for as long as it takes the forest to recover, even though trees are, in general, capable of regrowing.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Renewable and nonrenewable are a comparison between two rates: how fast a resource is replaced, and how fast it is used. They are not a fixed list sorted by what a resource is made of.',
        'Fossil fuels and mineral ore are nonrenewable, because they form underground over an enormous span of geologic time -- far slower than the rate at which they are removed and used.',
        'Solar energy is renewable no matter how fast it is used, because the sun keeps supplying sunlight at about the same rate regardless of how much of it people capture.',
        'Groundwater is renewable when it is pumped no faster than the aquifer recharges, and behaves like a nonrenewable resource when it is pumped much faster than that.',
        'Timber is renewable when trees are cut at about the same rate new ones grow to replace them, and behaves like a nonrenewable resource when a forest is cut far faster than it can regrow.',
        'Renewable does not mean unlimited and does not mean clean. A renewable resource can still run low, or run out for a while, if it is used faster than it is replaced.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Renewable & Nonrenewable Resources' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
