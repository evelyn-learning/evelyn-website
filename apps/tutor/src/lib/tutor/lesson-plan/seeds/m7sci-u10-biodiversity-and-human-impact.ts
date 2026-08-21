/**
 * Grade 7 Science (Life Science) — Ecosystems: Biodiversity & Human Impact.
 *
 * The FINAL row of the m7sci course (NGSS MS-LS2-5). Biodiversity is the
 * variety of life in an ecosystem, and the standard asks students to EVALUATE
 * COMPETING DESIGN SOLUTIONS for maintaining it -- so the closing skill of the
 * course is weighing trade-offs rather than picking a slogan.
 *
 * TONE NOTE FOR FUTURE AUTHORS: this row is written for twelve-year-olds and
 * is deliberately factual and constructive. It states mechanisms and costs and
 * leaves the judging to the student. It contains no invented statistics -- no
 * extinction rates, no species counts, no percentages -- and it takes no
 * political position on any current policy. Keep it that way.
 *
 * There are no images in this course. Every item here is solvable from the
 * words printed in it; the food webs are written out as arrows in prose.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U10_BIODIVERSITY_AND_HUMAN_IMPACT: LessonPlan = {
  id: 'evelyn.ms.m7sci.biodiversity-and-human-impact.v1',
  title: 'Biodiversity & Human Impact',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.biodiversity-and-human-impact',
      standard: 'M7SCI-10.4',
      description:
        'Explain what biodiversity is and how human activity can raise or lower it, and evaluate competing design solutions for maintaining biodiversity and ecosystem services by comparing them on effectiveness, cost and side effects (NGSS MS-LS2-5).',
    },
  ],
  prerequisites: ['m7sci.ecosystem-disruption'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor biodiversity in a patch of ground the student walks past every day, and set up trade-offs as the real skill.',
      script:
        'Picture the strip of weedy ground along the edge of a school field. Most people walk past it without looking. Crouch down and it turns out to be crowded. Different grasses. Clover. Ants, beetles, a spider, worms under the surface, molds and bacteria in the soil that you cannot see at all. That mix of different living things is what scientists call biodiversity. Now suppose the school wants to pave that strip for more parking, and someone else wants to plant it with flowers instead. Both plans help somebody, and both plans cost something. Today we look at why the variety matters, at how people raise it and lower it, and at how to compare two plans fairly instead of just picking the one that sounds nicer.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-biodiversity',
      kind: 'concept',
      goal: 'Define biodiversity broadly, connect it to recovery and to ecosystem services, list human impacts factually, and teach evaluating solutions on criteria.',
      keyIdeas: [
        'BIODIVERSITY IS THE VARIETY OF LIFE IN AN AREA -- not the head count, and not only the animals. It includes plants, fungi, and microorganisms in the soil, and it also includes the variety WITHIN a single species, because individuals of one species carry different versions of genes. WRONG: "Biodiversity means an area has lots of animals." CORRECT: "Biodiversity means an area has many different kinds of living things, and variety inside each kind."',
        'MORE VARIETY GENERALLY MEANS BETTER RECOVERY FROM DISRUPTION. Think about the food webs from the last lesson. If hawks eat only rabbits, then a rabbit disease cuts the one pathway energy takes to the hawks. If hawks also eat mice and grasshoppers, energy can still reach them by another pathway while the rabbits come back. More species means more pathways, and more pathways means fewer single points of failure. This is a tendency, not a guarantee -- some disruptions are large enough to hurt a varied ecosystem too.',
        'ECOSYSTEM SERVICES ARE THE USEFUL WORK ECOSYSTEMS DO FOR PEOPLE. Insects and other animals pollinate many of the crops we eat. Plant roots and wetlands slow water down so soil stays put and less mud and waste reaches streams. Fungi, bacteria and worms break down dead material and rebuild soil. Nobody pays for that work, which is exactly why it is easy to forget it is happening.',
        'THE MAIN WAYS HUMAN ACTIVITY LOWERS BIODIVERSITY, stated plainly: HABITAT LOSS, when land is converted to another use; FRAGMENTATION, when a remaining habitat is cut into pieces too small or too separated for populations to move between; POLLUTION entering air, water and soil; OVER-HARVESTING, when a population is taken faster than it replaces itself; INTRODUCED SPECIES, which can outcompete or eat local species that never faced them before; and a CHANGING CLIMATE, which shifts the conditions a species is suited to. Notice that none of these say people are separate from nature. People live in ecosystems and depend on the same services.',
        'THERE ARE ALSO DESIGN SOLUTIONS, AND EACH ONE COSTS SOMETHING. PROTECTED AREAS keep habitat intact but limit other uses of that land. WILDLIFE CORRIDORS are strips of habitat, or bridges and tunnels at a road, that reconnect fragments so populations can move again. RESTORATION puts a damaged habitat back, which is slow and takes ongoing work. REGULATED HARVESTING sets limits and seasons so a population is not taken faster than it replaces itself. CAPTIVE BREEDING raises animals in human care to release later, which is expensive and helps one species at a time.',
        'EVALUATING COMPETING SOLUTIONS IS THE ACTUAL SKILL HERE. Compare candidate plans on the same three questions. EFFECTIVENESS: how much of the problem does it actually fix, and how do we measure that? COST: money, land, and the work needed to keep it going year after year. SIDE EFFECTS: who else is affected, and what does the plan prevent people from doing? A plan that scores well on all three rarely exists. WRONG: "One of these is obviously the best plan." CORRECT: "Plan A protects more habitat but costs more upkeep, and Plan B is cheaper but only helps one species." Saying the trade-off out loud IS the answer scientists are looking for.',
      ],
      vocabulary: [
        { term: 'biodiversity', definition: 'the variety of different living things in an area, including the variety within a single species.' },
        { term: 'habitat fragmentation', definition: 'the breaking of a habitat into smaller separated pieces that populations cannot easily move between.' },
        { term: 'ecosystem services', definition: 'the useful work an ecosystem does for people, such as pollination, cleaner water and soil building.' },
        { term: 'wildlife corridor', definition: 'a strip of habitat, bridge or tunnel that reconnects separated pieces of habitat so animals can move between them.' },
        { term: 'restoration', definition: 'the work of returning a damaged habitat to a condition where its native species can live there again.' },
        { term: 'trade-off', definition: 'the cost or downside that comes with a solution, accepted in exchange for the benefit it gives.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fragmentation-corridor',
      kind: 'worked_example',
      problem:
        'A forest is cut in half by a wide new road. No trees were removed except along the road itself, so almost all of the forest is still there. Explain why the animal populations can still be harmed, and explain how a wildlife corridor would help and what it would cost.',
      steps: [
        'Start by naming what actually changed. The total amount of forest barely changed. What changed is that one forest became two smaller pieces with a dangerous gap between them.',
        'Ask what a population needs space for. Animals move to find food when a patch runs low, to find mates, and to leave an area when conditions there turn bad.',
        'A smaller piece holds a smaller population. A smaller population also carries less variety within the species, because there are fewer individuals holding different versions of genes. That is biodiversity lost at the level inside a species, even before any species disappears.',
        'Now add the road itself. Animals that try to cross are struck by vehicles, so the gap is not just empty, it removes individuals. Many animals will not cross at all, so the two populations stop mixing.',
        'The design solution is a corridor. A tunnel under the road, or a planted bridge over it, gives the animals a safe way across. The two pieces then function more like one larger habitat again, and the populations mix.',
        'Name the costs honestly, because that is part of the answer. A crossing structure is expensive to build. It uses land. It has to be placed where the animals already travel or they will ignore it, which means somebody has to study their movements first. And it does not undo the trees lost along the roadside.',
        'WRONG way to state this: "The road destroyed the forest." CORRECT way: "The road fragmented the forest, and fragmentation reduced population size and stopped populations from mixing, even though most trees remain."',
      ],
      answer:
        'Fragmentation harms populations even when little habitat is removed, because each remaining piece supports a smaller population with less variety within the species, and the road blocks or kills animals that try to cross. A corridor such as a tunnel or planted overpass reconnects the pieces so populations can mix again, at the cost of money, land, and study to place it where animals actually travel.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-compare-two-plans',
      kind: 'worked_example',
      problem:
        'A creek behind a school has fewer fish than it used to. Two plans are proposed. PLAN A: fence off the whole creek bank and allow nobody to enter. PLAN B: plant native trees and shrubs along the banks, and set a limit on how many fish may be taken per day. Compare the two plans on effectiveness, cost and side effects, and say what you would recommend and why.',
      steps: [
        'Set up the comparison first. Three questions, asked of both plans, in the same order: how well does it fix the problem, what does it cost, and who else does it affect.',
        'EFFECTIVENESS of Plan A. Fencing stops trampling of the bank and stops fishing entirely, so it addresses two causes at once. But it does nothing about mud and warm water, because a bare bank still lets soil wash in and still gets full sun.',
        'EFFECTIVENESS of Plan B. Roots hold the soil, so less mud washes into the water. Shade lowers the water temperature, and cooler water holds more dissolved oxygen, which fish need. The catch limit slows over-harvesting without ending fishing. This addresses more of the causes, but it works slowly, because the trees have to grow.',
        'COST of Plan A. A fence costs money once and then needs repair. Nobody has to keep working on it every week.',
        'COST of Plan B. Plants cost money, young plants need watering and weeding for the first years, and the catch limit only works if somebody checks it. Plan B costs less to start and more to keep going.',
        'SIDE EFFECTS of Plan A. It shuts people out of a place they use. That is a real cost to the community, and shut-out projects are also the ones people are most likely to ignore or undo later.',
        'SIDE EFFECTS of Plan B. People keep using the creek, so the plan needs their cooperation to work. Planting also changes what the bank looks like, and native species have to be chosen carefully so an introduced species is not the thing that gets planted.',
        'Now make a recommendation and attach the reason to the criteria, not to a feeling. Plan B addresses more of the causes and keeps people connected to the creek, so it is the stronger plan here, but only if the school accepts the ongoing work of watering, weeding and checking the limit. If no one can commit to that work, Plan B fails and the honest comparison changes.',
        'Notice what a good evaluation is NOT. It is not "protecting nature always means keeping people out," and it is not picking the cheaper plan without asking whether it works. It is also not claiming one plan is perfect. Every plan on this list gave something up.',
      ],
      answer:
        'Plan B is the stronger recommendation, because it addresses more causes at once -- roots reduce mud, shade cools the water so it holds more oxygen, and the catch limit slows over-harvesting -- and it does not shut the community out of the creek. Its trade-off is real, though: it works slowly and needs years of watering, weeding and checking, while Plan A costs less effort to maintain but leaves the mud and warm water untouched.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-biodiversity-means',
      kind: 'try_yourself',
      problem: 'Which statement best describes what biodiversity means?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The number of animals living in an area.' },
        { id: 'b', text: 'The number of large animals in an area that people can easily see.' },
        { id: 'c', text: 'The total number of individual organisms in an area, no matter what kinds they are.' },
        { id: 'd', text: 'The variety of different living things in an area, including plants, fungi and microorganisms, and the variety within a single species.', correct: true },
      ],
      expectedAnswer: 'The variety of different living things in an area, including plants, fungi and microorganisms, and the variety within a single species.',
      hints: [
        'Biodiversity is about VARIETY, not about how many individuals there are. A field with ten thousand plants that are all the same grass has very low biodiversity.',
        'Ask whether the statement leaves anything out. Most of the living things in a patch of soil are not animals, and not one of them is easy to see.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-recovery-pathways',
      kind: 'try_yourself',
      problem:
        'In Meadow A the food web is: grass to rabbit, rabbit to hawk. In Meadow B the food web is: grass to rabbit, grass to mouse, grass to grasshopper, rabbit to hawk, mouse to hawk, grasshopper to hawk. A disease removes most of the rabbits from both meadows. Which meadow is more likely to keep its hawk population, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both meadows are affected the same way, because the loss of one species never changes an ecosystem.' },
        { id: 'b', text: 'Meadow A, because having fewer kinds of animals means the hawks there face less competition.' },
        { id: 'c', text: 'Meadow B, because an ecosystem with more species cannot be reached by a disease.' },
        { id: 'd', text: 'Meadow B, because its hawks have other prey, so energy can still reach them along another pathway while the rabbits recover.', correct: true },
      ],
      expectedAnswer: 'Meadow B, because its hawks have other prey, so energy can still reach them along another pathway while the rabbits recover.',
      hints: [
        'Trace the arrows and remember which way they point. An arrow points from the organism that is eaten to the organism that eats it, so it shows where the energy goes.',
        'Count how many separate pathways lead to the hawks in each meadow, then remove the rabbit pathway from both and see what is left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate-solutions',
      kind: 'try_yourself',
      problem:
        'A class compares two plans for helping the pollinators near their school. PLAN A: plant a wide strip of native flowers along the edge of the field. PLAN B: hang sugar-water feeders that one volunteer refills every week. Which statement is the strongest evaluation of the two plans?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Plan B is better, because it costs less money to set up than planting a strip of flowers.' },
        { id: 'b', text: 'Plan A is better, because plans that use native plants are always the right choice.' },
        { id: 'c', text: 'Plan A is better, because the flowers return each year and feed many kinds of pollinators without weekly work, though the strip does use field space and takes a season to establish.', correct: true },
        { id: 'd', text: 'Neither plan is worth trying, because people have already changed the area too much for anything to help.' },
      ],
      expectedAnswer: 'Plan A is better, because the flowers return each year and feed many kinds of pollinators without weekly work, though the strip does use field space and takes a season to establish.',
      hints: [
        'A strong evaluation compares the plans on all three questions -- effectiveness, cost and side effects -- rather than on only one of them.',
        'Ask what happens to each plan in the second year. One of them depends on a single person continuing to do a weekly job forever.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-species-and-one-best-plan',
      kind: 'misconception_check',
      question:
        'A student writes: "Losing one small species out of a whole meadow does not really matter, and anyway the answer is obvious -- just make the meadow a protected area." What is wrong with each half of that sentence?',
      commonErrors: [
        {
          answer: 'Losing one small species does not matter to the ecosystem.',
          misconception:
            'Picturing an ecosystem as a list of separate creatures, so removing one line from the list seems to leave the rest unchanged.',
          correctsTo:
            'An ecosystem is a set of connections, not a list. Every species sits on one or more pathways through the food web, and some species carry connections that little else carries -- the one insect that pollinates a particular plant, or the fungus that breaks down a particular kind of dead wood. Removing a species removes its pathways, and the species that depended on those pathways feel it next. The honest version is not "everything collapses" and not "nothing happens" either. It is: the fewer pathways an ecosystem has left, the less room it has to absorb the next disruption.',
        },
        {
          answer: 'There is one obviously best solution, so no comparison is needed.',
          misconception:
            'Treating a design problem like a question with a single right answer, so the first reasonable plan sounds like the only plan.',
          correctsTo:
            'Every solution gives something up, so the work is comparing, not guessing. Judge each candidate plan on the same three criteria: effectiveness, cost including the work of keeping it going, and side effects on everyone involved. A protected area does keep habitat intact, and that is a real strength -- but it limits other uses of the land, it does not by itself repair habitat that is already damaged, and it does not help species whose problem lies outside its fence. A corridor, a restoration project or a harvest limit might fit the specific problem better. Stating the trade-off is not dodging the question. It IS the answer.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Biodiversity is the VARIETY of living things in an area -- plants, fungi and microorganisms included -- plus the variety within a single species. It is not a head count of animals.',
        'More variety generally means better recovery, because more species means more pathways through the food web and fewer single points of failure.',
        'Ecosystem services are the useful work ecosystems do for people: pollination, cleaner water, and soil building.',
        'Human activity lowers biodiversity mainly through habitat loss, fragmentation, pollution, over-harvesting, introduced species and a changing climate.',
        'Design solutions include protected areas, wildlife corridors, restoration, regulated harvesting and captive breeding -- and every one of them costs something.',
        'Compare competing solutions on the same three questions: effectiveness, cost including ongoing work, and side effects. Naming the trade-off out loud is the answer, not a way around it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Biodiversity & Human Impact' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
