/**
 * Grade 7 World Geography — Latin America: Environment & Change.
 *
 * The row that CLOSES Unit 7 (National Geography Standard 14). Its job is the
 * general principle first: people modify the physical environment everywhere,
 * and every modification produces effects the people who made it did not
 * choose. Latin America is the case study, not the accused.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters more here than anywhere else
 * in the course:
 *
 *   1. THIS FILE HANDS DOWN NO VERDICT. It never says whether land should or
 *      should not be cleared, never names a government, law, treaty, company
 *      or leader, and never blames a country. It teaches students to state
 *      both sides of a trade-off and to name who gains and who bears the
 *      cost -- and then to stop. Deciding is a separate question that people
 *      who agree on all the geography still answer differently.
 *   2. THERE ARE NO NUMBERS. No areas, no rates, no species counts, no
 *      percentages. Every claim here is a qualitative, well-established one:
 *      rainforest soils are thin because the nutrients are held in the living
 *      plants; forests return large amounts of moisture to the air. A
 *      remembered wrong number is worse than no number.
 *   3. NOBODY IS A VILLAIN AND NOBODY IS A SYMBOL. Farmers, ranchers, miners
 *      and loggers are people making a living, and are described that way.
 *      Indigenous peoples of the Amazon are stated as living there today with
 *      a direct stake in what happens -- named as present, never spoken for,
 *      never used as decoration.
 *   4. Climate appears only where it belongs, inside the water-cycle and
 *      habitat points. This row is not a climate-policy lesson.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U7_LATIN_AMERICA_ENVIRONMENT_ISSUES: LessonPlan = {
  id: 'evelyn.ms.m7geo.latin-america-environment-issues.v1',
  title: 'Latin America: Environment & Change',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.latin-america-environment-issues',
      standard: 'M7GEO-7.4',
      description:
        'Explain how people modify the physical environment, using Latin America as the case: describe why land is cleared, terraced, irrigated and mined, trace the effects that follow -- including habitat loss, thin and quickly exhausted soils, and changes to the water cycle -- and state the trade-off in a modification by naming both what is gained and what is given up, and who gains and who bears the cost (National Geography Standard 14: how human actions modify the physical environment).',
    },
  ],
  prerequisites: ['m7geo.latin-america-economy-and-cities'],
  followUps: ['m7geo.europe-physical-geography'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Establish that modification is ordinary and everywhere, before any region is named, so the region is never the accusation.',
      script:
        'Look out of the nearest window and try to find one thing people did not change. The street was flattened and paved. The field was drained, or watered, or fenced. The trees along the sidewalk were planted in a line, which is not how trees grow on their own. Somewhere upstream a river was dammed so the taps in your building would run. People change the physical environment everywhere they live, and they always have. That is not a crime and it is not news. What is interesting to a geographer is the second part: every one of those changes also did something nobody planned. This lesson follows that idea into one region, Latin America, where some of the changes are very large.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-modification-and-trade-offs',
      kind: 'concept',
      goal: 'Install Standard 14 as a general principle, then the Amazon case, the thin-soil surprise, the long history of modification, and the trade-off frame that stops short of a verdict.',
      keyIdeas: [
        'PEOPLE MODIFY THE PHYSICAL ENVIRONMENT EVERYWHERE, AND ALWAYS HAVE. To modify means to change something that was already there. Farms replace whatever grew on the land before. Roads cut through hills. Dams hold back rivers. Cities cover ground with hard surfaces that water cannot soak into. Mines open the rock. This happens on every inhabited continent, in higher-income countries and in lower-income ones alike. Studying modification is not the same as accusing anybody of anything.',
        'EVERY MODIFICATION HAS EFFECTS NOBODY CHOSE. There is the effect people were aiming at -- the intended effect -- and then there are the others, the unintended effects. A road is built to carry goods to market, and that is the intended effect. But the road also lets people and machines reach land that was almost impossible to reach before, and so more change follows the road. Geographers look for the second kind, because the second kind is the part people are usually surprised by.',
        'IN THE AMAZON, THE LARGEST MODIFICATION IS THE CLEARING OF FOREST. The Amazon rainforest spreads across parts of several South American countries. Forest there is cleared chiefly for cattle pasture, for cropland, for logging, for roads, and for mining. The effects that follow are well established: plants and animals lose the habitat they live in, and some live nowhere else; the soil that is left behind turns out to be thin and is exhausted quickly; and the water cycle over the region is disturbed, because the forest itself was returning enormous amounts of moisture to the air. Many indigenous peoples live in the Amazon today. The forest is not empty land, and the people who live there have a direct stake in what happens to it.',
        'THE SOIL SURPRISE -- A LUSH FOREST DOES NOT MEAN RICH GROUND. This is the fact that catches almost everyone out. In a tropical rainforest, most of the nutrients are not in the soil at all. They are locked up in the living plants. Leaves and wood fall, the heat and the wet rot them fast, and the roots take the nutrients straight back up before they can build a deep layer underneath. So the ground beneath a rainforest is usually a thin store, not a rich one. Cut the forest down and you have carried the nutrients away with the trees. Land cleared that way often grows crops well for a short time and then poorly, which is one reason clearing does not stop where it started.',
        'MODIFICATION IS NOT NEW AND IT IS NOT ALWAYS DAMAGE. High in the Andes, farmers have cut terraces into steep slopes for centuries -- flat steps carved into a hillside so that soil and water stay put instead of washing downhill. That is a modification, an old one, and it holds a mountainside together rather than wearing it away. In dry regions, irrigation carries water to fields that would otherwise grow little. Mining takes metals out of the rock. And where cities grow quickly, as they have across the region, more people need clean water and more vehicles and workshops put more into the air. Different modifications, different effects. The word modification does not tell you whether an effect is good or bad.',
        'THE HONEST FRAME IS A TRADE-OFF, AND YOU DO NOT ANNOUNCE A WINNER. Clearing land produces real food, real jobs and real income for real families. It also costs forest, soil and species. Both of those sentences are true at the same time, and a good answer contains both. Then go one step further and ask two questions: who gains, and who bears the cost? Often the answer is different people, or the same people at different times -- a gain now and a cost later. Sorting that out is geography. Deciding what ought to be done about it is a different question, and people who agree on every fact in this lesson still disagree about the answer. Your job here is the first question.',
      ],
      vocabulary: [
        { term: 'modify', definition: 'to change something that was already there. A dam, a farm, a road and a mine are all modifications of the physical environment.' },
        { term: 'unintended effect', definition: 'a result of a change that the people who made the change were not aiming at.' },
        { term: 'deforestation', definition: 'the clearing of forest so the land can be used for something else.' },
        { term: 'habitat', definition: 'the kind of place a particular plant or animal lives in and depends on.' },
        { term: 'terrace', definition: 'a flat step cut into a steep slope so that soil and water stay on the hillside instead of washing down it.' },
        { term: 'trade-off', definition: 'a situation in which getting one thing means giving up another, so both sides have to be stated.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-thin-soil',
      kind: 'worked_example',
      problem:
        'A student writes: "The Amazon rainforest grows some of the biggest, thickest plant life on Earth. So the soil under it must be some of the richest farmland anywhere. Once it is cleared, it should grow crops for a very long time." Explain, step by step, why the second and third sentences do not follow from the first.',
      steps: [
        'Start by agreeing with the part that is true. The first sentence is correct: the forest really is enormously productive. The mistake is in the word "so" -- the student has assumed that growth above the ground proves wealth below it.',
        'Ask the key question instead: WHERE ARE THE NUTRIENTS ACTUALLY STORED? In a tropical rainforest, the answer is the living plants. The trunks, branches, leaves and roots hold the store.',
        'Now follow what happens when a leaf falls. It lands in a place that is hot and wet all year. It rots quickly, and the roots waiting just under the surface take the nutrients back up almost at once.',
        'That is the whole loop, and notice what it never does: it never leaves much behind. Nutrients cycle from plant to ground and back to plant so fast that a deep, rich layer never builds up. The soil is a thin passageway, not a warehouse.',
        'So when the forest is cut and hauled away, the store goes with it. What is left is the thin layer, now with no canopy above it and heavy rain falling directly onto it.',
        'That explains the pattern people actually see: the land grows crops well for a short time, and then poorly. WRONG: "Rainforest soil is rich because rainforests are lush." CORRECT: "Rainforest soil is thin because the nutrients are held in the plants, not in the ground -- so removing the plants removes the store."',
        'One more consequence follows from this, and it is worth naming. Because cleared land is productive only briefly, clearing tends not to stop at the first patch. That is an unintended effect of the first clearing, not a separate decision.',
      ],
      answer:
        'The lushness of a rainforest is evidence about the plants, not about the ground. Most of the nutrients are held in the living plants and are recycled straight back into them, so the soil underneath stays thin. Clearing the forest removes the store of nutrients along with the trees, which is why cleared land often produces well for a short time and then poorly.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-state-the-trade-off',
      kind: 'worked_example',
      problem:
        'A stretch of forest beside a newly built road is cleared and turned into cattle pasture. Write the geographer\'s answer: separate the intended effect from the unintended effects, then state the trade-off and say who gains and who bears the cost. Do not say whether the clearing should have happened.',
      steps: [
        'First, name the intended effect. Somebody cleared this land in order to raise cattle on it, which produces meat to sell and work for the people who run the pasture. That is the aim, and it is a real one -- families earn a living from it.',
        'Second, list the effects that were not the aim. The plants and animals that lived in that stretch of forest lose their habitat. The thin soil is now exposed to the sun and to heavy rain. The trees that used to lift water into the air over that patch are gone, so less moisture is returned there. And the road that made the clearing possible is still there, so other people can reach the area too.',
        'Third, write the trade-off as one sentence with both halves in it: this clearing produces food, work and income, and it costs forest, habitat and soil.',
        'Fourth, ask who gains. The people running the pasture, the workers they hire, the businesses that buy and move the meat, and the customers who eat it -- and some of those people live far away from the forest.',
        'Fifth, ask who bears the cost. The people who live in and depend on that forest, including indigenous peoples whose homes are there; anyone downwind or downstream who is affected by changes in moisture and runoff; and, in the long run, whoever tries to farm that thin soil after it is spent. Notice that the gains and the costs land on different people, and at different times -- much of the gain arrives now, and much of the cost arrives later.',
        'Now stop. WRONG kind of ending: an answer that announces which side wins -- that the clearing was simply right, or simply wrong. That is a verdict, and a verdict is not a description of what follows from what. CORRECT kind of ending: both halves stated, and the gainers and the cost-bearers named. Two people can read this exact answer, agree with every line of it, and still want different things done. That disagreement is real, and it is not settled by geography.',
      ],
      answer:
        'Intended effect: pasture for cattle, producing meat, work and income. Unintended effects: loss of habitat for the plants and animals that lived there, thin soil left exposed to sun and rain, less moisture returned to the air over that land, and easier access for others along the road. The trade-off is food, work and income gained against forest, habitat and soil given up. The gains go mostly to the people raising, moving and buying the cattle, some of them far away; the costs fall mostly on the people who live in and depend on the forest, and on whoever uses the land later. A geographic answer states both sides and stops there.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-thin-soil-cause',
      kind: 'try_yourself',
      problem:
        'A patch of tropical rainforest is cleared and planted with crops. The ground produces well for the first couple of seasons and then produces poorly. Which explanation best fits what happened?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Most of the nutrients were held in the living forest plants, so clearing them carried away the store the crops were living on.', correct: true },
        { id: 'b', text: 'The soil was rich and deep, and the crops slowly used up nutrients that had built up over centuries.' },
        { id: 'c', text: 'Removing the trees made the area colder, and the cold stopped the crops from growing.' },
        { id: 'd', text: 'Rainforest land is always too steep to farm, whatever the soil beneath it is like.' }
      ],
      expectedAnswer: 'Most of the nutrients were held in the living forest plants, so clearing them carried away the store the crops were living on.',
      hints: [
        'Ask the question from the worked example: in a tropical rainforest, where are the nutrients actually kept -- in the ground, or in the plants?',
        'One choice assumes a lush forest proves rich soil. That is the exact trap. Which choice explains the good-then-poor pattern without assuming it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-water-cycle-cause',
      kind: 'try_yourself',
      problem:
        'Forests return large amounts of moisture to the air above them, because trees draw water up from the ground and release it from their leaves. A wide area of forest is removed. Which effect follows most directly from that one fact?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing about the moisture in the air changes, because only oceans put water into the air.' },
        { id: 'b', text: 'The bare ground releases moisture at exactly the same rate the forest did, so the total stays the same.' },
        { id: 'c', text: 'Less moisture rises from that area into the air, so less is available to fall back on it as rain.', correct: true },
        { id: 'd', text: 'The area turns into a desert straight away, with no rain of any kind ever again.' }
      ],
      expectedAnswer: 'Less moisture rises from that area into the air, so less is available to fall back on it as rain.',
      hints: [
        'You are given one fact and asked what follows from it alone. The fact is that the trees were putting moisture into the air. Take the trees away and ask what happens to that moisture.',
        'Two of the wrong choices claim nothing changes at all, and one claims the change is instant and total. A direct effect is usually neither of those.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-intended-or-unintended',
      kind: 'try_yourself',
      problem:
        'A road is built through a forested area so that goods can be carried to market more easily. Which of these is best described as an UNINTENDED effect of building the road?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'People and machines can now reach forest that was almost impossible to get to, and clearing spreads along the road.', correct: true },
        { id: 'b', text: 'Goods reach the market in less time than they used to.' },
        { id: 'c', text: 'The journey between two towns becomes shorter.' },
        { id: 'd', text: 'Trucks begin using the road instead of the slower river route.' }
      ],
      expectedAnswer: 'People and machines can now reach forest that was almost impossible to get to, and clearing spreads along the road.',
      hints: [
        'An intended effect is the one the builders were aiming at. Read the problem again: what was the road built FOR?',
        'Three of these choices are things the builders wanted or expected. Only one is a change that follows from the road without anybody having planned it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-verdict-not-explanation',
      kind: 'misconception_check',
      question:
        'A student is asked to explain what happens when rainforest is cleared for farmland, and writes only: "Cutting down the rainforest is a terrible thing and the people doing it should stop." What is wrong with that as a geography answer?',
      commonErrors: [
        {
          answer: 'Cutting down the rainforest is a terrible thing and the people doing it should stop.',
          misconception:
            'Replacing an explanation with a verdict. The sentence announces a judgement and blames a group of people, but it does not say what is cleared, why anybody clears it, or what follows from the clearing. Nothing in it can be checked, and nothing in it explains anything.',
          correctsTo:
            'A geographic answer traces causes and effects, and then names the trade-off. It says WHY land is cleared -- for pasture, cropland, logging, roads or mining, which produce food, work and income for real families. It says WHAT FOLLOWS -- habitat lost, thin soil exposed and quickly exhausted, less moisture returned to the air. It says WHO GAINS and WHO BEARS THE COST, and notices that these are often different people, and often at different times. WRONG: "This is terrible and should stop." CORRECT: "Clearing produces food, work and income, and it costs forest, habitat and soil; the gains and the costs fall on different people." Whether it should stop is a separate question. People who agree on every fact above still answer that question differently, and a geography answer is not the place to settle it.',
        },
        {
          answer: 'People started changing the environment only recently, so any modification is a modern problem.',
          misconception:
            'Treating modification itself as new and as automatically harmful, instead of as something people have always done with a range of effects.',
          correctsTo:
            'Modification is as old as settlement. Farmers in the Andes have been cutting terraces into steep slopes for centuries, and those terraces hold soil and water on the mountainside instead of letting it wash away. Irrigation, drainage and dams are old too. WRONG: "Modifying the environment is a modern thing and modifying is the same as damaging." CORRECT: "People have modified environments for a very long time; what changes from case to case is the scale of the change and the effects that follow, so you have to work out the effects each time rather than assume them."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'People modify the physical environment everywhere they live, and always have. Modification is not by itself the same thing as damage.',
        'Every modification has an intended effect and unintended effects. The unintended ones are what a geographer goes looking for.',
        'In the Amazon, forest is cleared chiefly for pasture, cropland, logging, roads and mining. What follows: habitat and species lost, thin soil quickly exhausted, and less moisture returned to the air.',
        'A lush rainforest does not mean rich ground. Most of the nutrients are in the living plants, so clearing the forest carries the store away.',
        'Many indigenous peoples live in the Amazon today. It is not empty land, and the people who live there have a direct stake in what happens to it.',
        'State the trade-off with both halves in it, then name who gains and who bears the cost -- and stop there. Deciding what should be done is a different question, and geography does not settle it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Latin America: Environment & Change' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
