/**
 * Grade 7 World Geography — Economics: Natural Resources & Economic Activity.
 *
 * Concept-led row (National Geography Standard 16). Two ideas carry the
 * lesson: a resource is only a resource when people have a use for it AND a
 * way to obtain it, and renewable does NOT mean unlimited -- a renewable
 * resource used faster than it replaces itself still runs short.
 *
 * NOTE FOR FUTURE AUTHORS: the four levels of economic activity are
 * CATEGORIES, NOT A LADDER. Nothing in this file describes quaternary work as
 * more advanced than primary work, or a place with many farms as behind a
 * place with many offices. That framing ranks countries and, by implication,
 * the people in them. Keep it out.
 *
 * There are no reserve figures, production rankings or "largest producer"
 * claims here, because those change and cannot be kept true. Real-place
 * claims are limited to long-settled physical facts. Energy and climate
 * policy debates are out of scope for a twelve-year-old geography row.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U5_RESOURCES_AND_ECONOMIC_ACTIVITY: LessonPlan = {
  id: 'evelyn.ms.m7geo.resources-and-economic-activity.v1',
  title: 'Natural Resources & Economic Activity',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.resources-and-economic-activity',
      standard: 'M7GEO-5.2',
      description:
        'Sort natural resources into renewable and nonrenewable, explain why a renewable resource can still be used up, and classify work into primary, secondary, tertiary and quaternary economic activity (National Geography Standard 16: the changing meaning, use, distribution and importance of resources).',
    },
  ],
  prerequisites: ['m7geo.economic-systems'],
  followUps: ['m7geo.levels-of-development'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student tracing an everyday object back through the natural world and the work that moved it, before any vocabulary.',
      script:
        'Look at whatever is nearest to you right now. A pencil, a water bottle, the shoes you walked in with. Every single one of those started as something in the natural world. A tree. Oil pumped out of the ground. Metal dug out of rock. Then somebody grew it or dug it, somebody else turned it into a thing, somebody drove it to a store, and somebody sold it to you. Geographers study that whole chain, because where each step happens is not random. It depends on what a place has, and on what people know how to do with it. Today we follow the chain.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-resources-and-activity',
      kind: 'concept',
      goal: 'Install the definition of a resource as use-dependent, the renewable and nonrenewable sort, the rate idea, the four levels of activity as categories, and the changing-mix idea.',
      keyIdeas: [
        'A NATURAL RESOURCE IS SOMETHING FROM THE NATURAL WORLD THAT PEOPLE USE. Soil, fresh water, forests, fish, wind, sunlight, coal, oil, iron ore, copper ore. Places do not all hold the same ones. A desert region such as the Sahara in North Africa has very little fresh water at the surface. The Andes, the mountain chain running down the western side of South America, hold large mineral deposits, including copper ore.',
        'SOMETHING IS A RESOURCE ONLY WHEN PEOPLE HAVE A USE FOR IT AND A WAY TO GET IT. This is the idea that surprises people. Petroleum sat under the ground for a very long time while people walked around above it and did nothing with it, because nobody had built an engine that ran on it. Ordinary sand was just sand until people learned how to pull silicon out of it and make computer chips. The rock did not change. The use changed. So the list of what counts as a resource is different in every century, which is exactly what National Geography Standard 16 means by the changing meaning of resources.',
        'RENEWABLE RESOURCES REPLACE THEMSELVES; NONRENEWABLE RESOURCES DO NOT. Trees, fish, fresh water in a river, wind and sunlight are renewable, because nature keeps producing more of them on a timescale people live on. Coal, oil, natural gas and metal ores are nonrenewable, because they formed over millions of years and are not being remade at any speed that matters to us. Recycling a metal can stretch how far a supply goes, but it does not make new ore.',
        'RENEWABLE DOES NOT MEAN UNLIMITED, AND THIS IS THE MOST IMPORTANT IDEA IN THE LESSON. Picture a bucket with a slow tap running into it. If you scoop out less than the tap puts in, the bucket stays full forever. If you scoop faster, the bucket empties no matter how renewable the water is. A forest cut faster than it grows back gets smaller. Fish caught faster than they breed get scarcer. Groundwater pumped faster than rain soaks down to refill it drops lower every year. WRONG: renewable means it can never run out. CORRECT: renewable means it is replaced, and whether it lasts depends on the rate people use it.',
        'WORK COMES IN FOUR LEVELS OF ECONOMIC ACTIVITY. PRIMARY activity takes resources from the earth: farming, fishing, forestry, mining. SECONDARY activity makes things out of them: a factory turning milk into cheese, a mill turning logs into boards, a plant refining oil. TERTIARY activity is services, which means doing something for people rather than making an object: shops, buses and trucks, hospitals, teaching, repair. QUATERNARY activity works with information: research, design, data, and managing large organizations. THESE ARE CATEGORIES, NOT A LADDER. Quaternary is not the top and primary is not the bottom. Nobody eats research, and nobody designs software while starving, so an economy needs all four and each one depends on the others.',
        'THE MIX OF THE FOUR LEVELS IN A PLACE REFLECTS ITS RESOURCES, ITS WORKFORCE AND ITS HISTORY, AND THE MIX CHANGES OVER TIME. A region with deep soil and steady rain will have more farming in it than a region of bare rock. A town that grew up around a mill keeps some of that work long after the mill changes hands. Over decades the mix shifts, as machines take over jobs people used to do by hand and as new kinds of work appear. One more warning: having a lot of a valuable resource does not automatically make a place wealthy. It matters whether the resource is processed nearby or shipped away raw, whether its price swings up and down, and what else the economy does.',
      ],
      vocabulary: [
        { term: 'natural resource', definition: 'something from the natural world that people have a use for and a way to obtain.' },
        { term: 'renewable resource', definition: 'a resource nature replaces on a timescale people live on, such as trees, fish or fresh water.' },
        { term: 'nonrenewable resource', definition: 'a resource that is not replaced at any useful speed once it is used, such as coal, oil or metal ore.' },
        { term: 'primary activity', definition: 'work that takes resources from the earth, such as farming, fishing, forestry or mining.' },
        { term: 'secondary activity', definition: 'work that makes or processes things out of resources, such as manufacturing.' },
        { term: 'tertiary activity', definition: 'work that provides a service to people, such as transport, shops, healthcare or teaching.' },
        { term: 'quaternary activity', definition: 'work with information, such as research, design, data and managing organizations.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-four-levels',
      kind: 'worked_example',
      problem:
        'Sort each job in this coastal town into primary, secondary, tertiary or quaternary activity.\n\n"Boats bring in fish every morning. A plant beside the dock cleans the fish and freezes them into packs. A trucking company carries the packs to stores inland. A small office counts how many fish are in the bay each year and advises the boat owners on how much they can safely catch."',
      steps: [
        'Use one test question on each job: what is happening to the fish at this step?',
        'The boats take the fish out of the natural world. Nothing has been made yet, nothing has been sold yet. Taking a resource from the earth or the sea is PRIMARY activity.',
        'The plant cleans and freezes the fish into packs. The fish went in as a catch and came out as a product. Changing a resource into a thing is SECONDARY activity.',
        'The trucking company does not make anything. It moves what already exists, for somebody else. Doing something for people rather than producing an object is TERTIARY activity.',
        'The office produces neither fish nor freight. It produces a count and a piece of advice, which is information. That is QUATERNARY activity.',
        'Now the part students skip. The office is not the best job in the town and the boats are not the least important. Take away the boats and the plant has nothing to freeze. Take away the office and the bay can get overfished. These are four different kinds of work, not four rungs of a ladder.',
        'Notice one more thing. The office exists because fish are renewable but not unlimited. Somebody has to know how fast the fish replace themselves, or the town loses the resource it is built on.',
      ],
      answer:
        'Boats bringing in fish: primary. The plant cleaning and freezing the fish: secondary. The trucking company carrying packs to stores: tertiary. The office counting fish and advising the boats: quaternary. The four are categories of work, not a ranking, and the town needs all of them.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-renewable-rate',
      kind: 'worked_example',
      problem:
        'Say whether each resource is renewable or nonrenewable, then answer the harder question: which of them can run short?\n\n"Resource A: coal dug out of a seam under a hillside.\nResource B: groundwater pumped from wells in a dry region, refilled only by rain that soaks slowly down through the soil."',
      steps: [
        'Start with the definition, not with a feeling. Renewable means nature replaces it on a timescale people live on.',
        'Coal formed over millions of years from buried plant material. Nothing is making a useful amount of new coal while we watch. Coal is NONRENEWABLE.',
        'Groundwater is refilled by rain, and rain keeps falling. Water underground is RENEWABLE.',
        'Now the harder question, and the whole point of the lesson. Coal can obviously run short, because a seam holds only what it holds.',
        'But groundwater can run short too. Ask about the rate: in a dry region the rain that soaks down is slow, so the tap running into the bucket is a trickle. If the wells pump faster than the trickle refills it, the water level drops year after year and eventually the wells reach dry ground.',
        'WRONG way to say it: "Resource B is renewable, so it cannot run out." CORRECT way: "Resource B is renewable, so it is being replaced, but it will still run short if it is used faster than it is replaced."',
        'That is the difference between the two words people mix up. Renewable is about being REPLACED. Unlimited would mean no amount of use could ever reduce it, and no real resource works that way.',
      ],
      answer:
        'Coal is nonrenewable. Groundwater is renewable. Both can run short. Coal runs short because there is a fixed amount in the seam. Groundwater runs short whenever it is pumped faster than rain refills it, because renewable describes how a resource is replaced, not how much of it there is.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-renewable-not-unlimited',
      kind: 'try_yourself',
      problem:
        'Read the case, then choose the correct statement.\n\n"Boats have fished the same bay for many years. Lately they catch more fish each year than are born in the bay that year."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Fish are a renewable resource, so the number of fish in the bay cannot fall.' },
        { id: 'b', text: 'Fish are a renewable resource, but their number can still fall when they are caught faster than they replace themselves.', correct: true },
        { id: 'c', text: 'Fish are a nonrenewable resource, because a fish that has been caught is gone for good.' },
        { id: 'd', text: 'Fish stop being a natural resource as soon as people catch too many of them.' }
      ],
      expectedAnswer:
        'Fish are a renewable resource, but their number can still fall when they are caught faster than they replace themselves.',
      hints: [
        'Renewable tells you a resource is being replaced. It does not tell you how fast. Compare the two rates in the case: how fast fish are caught, and how fast new fish are born.',
        'Think about the bucket with the slow tap. The water is renewable, and the bucket still empties if you scoop faster than the tap fills it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-secondary',
      kind: 'try_yourself',
      problem: 'Which of these is a SECONDARY economic activity?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cutting logs in a forest' },
        { id: 'b', text: 'Driving a delivery van from a warehouse to a supermarket' },
        { id: 'c', text: 'Turning milk from a dairy farm into cheese at a factory', correct: true },
        { id: 'd', text: 'Designing software that keeps track of shipments' }
      ],
      expectedAnswer: 'Turning milk from a dairy farm into cheese at a factory',
      hints: [
        'Secondary activity makes or changes something. Ask of each choice: does a material go in one way and come out as a different thing?',
        'Check what the other three are doing. One takes a resource straight from the natural world, one moves something that already exists, and one produces information.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-makes-a-resource',
      kind: 'try_yourself',
      problem:
        'Read the case, then choose the best explanation.\n\n"A heavy gray metal sits in the rock under a hill. For hundreds of years nobody uses it for anything. Then people invent a machine that needs that metal, and a method for digging it out at a reasonable cost. Mines open on the hill."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The metal became a resource, because a material counts as a resource once people have a use for it and a way to obtain it.', correct: true },
        { id: 'b', text: 'The metal was a resource the whole time, because everything found in nature is a natural resource.' },
        { id: 'c', text: 'The metal became a renewable resource, because people can now produce more of it whenever they need it.' },
        { id: 'd', text: 'The metal stopped being a natural resource once it was dug up and put into machines.' }
      ],
      expectedAnswer:
        'The metal became a resource, because a material counts as a resource once people have a use for it and a way to obtain it.',
      hints: [
        'Nothing about the rock itself changed during those hundreds of years. Something about the people changed. Which choice puts the change in the right place?',
        'Remember petroleum before engines existed, and sand before computer chips. The material was already there; the use and the means were not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ladder-and-riches',
      kind: 'misconception_check',
      question:
        'A student writes: "Places with mostly primary activity are behind, and they need to move up to quaternary activity like the rich places did. Anyway, any place with a lot of oil and minerals must be rich already." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'Quaternary activity is more advanced than primary activity, so a place with many farms and mines is behind.',
          misconception:
            'Reading the four levels as a ladder of progress rather than as four categories of work. The words primary, secondary, tertiary and quaternary sound like an order, so students turn them into a ranking of places and, without meaning to, of the people who live there.',
          correctsTo:
            'The four levels answer the question WHAT KIND of work is this, not HOW GOOD is it. Every economy contains all four, and each one depends on the others: quaternary researchers still eat food that primary farming produced, and factories still need the ore that mining brings up. The mix in any place reflects what resources it has, what its workforce does, and how the place developed, and that mix shifts over time. Describe the mix. Do not score it, and never describe one place or its people as ahead of or behind another.',
        },
        {
          answer: 'A place with a lot of oil and minerals must be a rich place.',
          misconception:
            'Treating natural resources as the same thing as wealth, so that a map of deposits reads like a map of incomes.',
          correctsTo:
            'Resources are one input among several, not a guarantee. What happens next matters: whether the resource is processed nearby or shipped out raw, whether its price rises and falls sharply from year to year, how the money that comes in is used, and what else the economy does. The reverse is also true, so do not flip the error over: places with very few natural resources are not doomed, because a workforce, a location on a trade route and services can carry an economy too.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A natural resource is something from the natural world that people have both a use for and a way to obtain. Petroleum was not a resource before engines existed.',
        'Renewable resources are replaced by nature on a human timescale. Nonrenewable resources, such as coal, oil and metal ore, are not.',
        'Renewable does not mean unlimited. A forest, a fish stock or an underground water supply runs short whenever it is used faster than it replaces itself.',
        'Primary takes from the earth. Secondary makes things. Tertiary provides services. Quaternary works with information.',
        'The four levels are categories, not a ladder. No level is more advanced than another, and every economy needs all four.',
        'The mix of the four in a place reflects its resources, its workforce and its history, and the mix changes over time. Many resources do not automatically mean much wealth.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Natural Resources & Economic Activity' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
