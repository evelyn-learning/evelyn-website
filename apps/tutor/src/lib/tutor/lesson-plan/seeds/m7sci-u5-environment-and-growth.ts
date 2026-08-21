/**
 * Grade 7 Science (Life Science) — Growth & Reproduction: How Environment
 * Affects Growth.
 *
 * NGSS MS-LS1-5. The spine is the INTERACTION: genes set a range of possible
 * outcomes, and the environment decides where inside that range an organism
 * actually lands. Neither factor works alone.
 *
 * The load-bearing correction here is accuracy rule 3 in miniature: a trait an
 * organism picks up during its own life is NOT passed to its offspring. A
 * plant stunted by drought does not have stunted seeds. This row is where that
 * gets fixed, before Unit 7 has to build natural selection on top of it.
 * Nothing in this file may suggest an individual adapts during its lifetime,
 * or that need, effort or wanting produces a trait.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item here
 * is solvable from the words printed in it. Comparisons and measurements are
 * written out in prose -- never "see the diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U5_ENVIRONMENT_AND_GROWTH: LessonPlan = {
  id: 'evelyn.ms.m7sci.environment-and-growth.v1',
  title: 'How Environment Affects Growth',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.environment-and-growth',
      standard: 'M7SCI-5.4',
      description:
        'Explain how genetic factors and environmental factors together influence the growth of organisms, and distinguish a trait an organism inherits from a result of the conditions it grew up in (NGSS MS-LS1-5).',
    },
  ],
  prerequisites: ['m7sci.plant-reproduction-and-pollination'],
  followUps: ['m7sci.genes-chromosomes-and-dna'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the puzzle of two organisms with the same instructions turning out different.',
      script:
        'Here is something you can actually do at home. Take one plant and cut two small pieces off it. Put one piece in a jar of water on a sunny windowsill. Put the other piece in a jar of water in a dark closet. Wait a month. The two pieces came off the SAME plant, so they carry the same instructions. And yet the windowsill piece is bushy and dark green, and the closet piece is stringy and pale. Same instructions, different results. Today we work out exactly who did what -- how much of an organism comes from the instructions it was born with, and how much comes from where it grew up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-genes-and-environment',
      kind: 'concept',
      goal: 'Establish genes as a range and environment as the position inside it, and separate inherited traits from results of growing conditions.',
      keyIdeas: [
        'TWO THINGS SHAPE EVERY ORGANISM. The GENETIC factors are the instructions an organism inherited from its parents. The ENVIRONMENTAL factors are the conditions it actually grew up in -- how much light, how much water, how much food, how crowded it was, how warm it was. Growth is never the work of just one of these. The question is never genes or environment. It is always how much each one contributed.',
        'THE RULE WORTH MEMORIZING: GENES SET THE RANGE, THE ENVIRONMENT SETS WHERE IN THAT RANGE. The instructions in a sunflower seed make a sunflower and nothing else, and they fix roughly how tall that sunflower could possibly get. Inside that range there is room. A sunflower with good soil, water and full sun lands near the tall end. The same kind of seed in poor dry soil and shade lands near the short end. Neither one broke its instructions. They landed in different places inside the same set of possibilities.',
        'THE CLEANEST EVIDENCE IS TWO ORGANISMS WITH THE SAME INSTRUCTIONS. Two cuttings from one plant carry the same genes, so any difference between them has to come from the conditions. Two puppies from one litter do not have identical genes, but they are close relatives, so a big size difference between a well-fed puppy and a poorly fed one still points at the food rather than at the instructions. Scientists lean on comparisons like these because they hold one factor steady and let the other one vary. That is the fair test from Unit 1, used on a living thing.',
        'A TRAIT AN ORGANISM PICKS UP DURING ITS LIFE IS NOT PASSED ON. This is the big one. A tomato plant that stayed small because its soil was dry does not have small seeds and does not produce small offspring. Plant those seeds in good soil and they grow to full size. Drought changed how that one plant turned out; it did not rewrite the instructions inside the seeds. WRONG: "The plant got short in the drought, so its babies will be short." CORRECT: "The plant got short in the drought, and its offspring will grow to whatever size their own inherited instructions and their own conditions allow."',
        'GENETIC DOES NOT MEAN UNCHANGEABLE. People hear that height is genetic and conclude that nothing else matters, which is not what the word means. Genetic means the instructions came from the parents. Those instructions still leave room, and the conditions still decide where inside that room an organism ends up. Height, leaf color and body size are all genetic AND all sensitive to conditions at the same time.',
        'HOW THIS SOUNDS WHEN SAID CARELESSLY. Watch out for sentences that make an organism sound like it is choosing. A crowded tree does not decide to grow tall to reach the light, and a plant does not try to make bigger leaves because it needs them. What happens is plainer than that: in dim light a stem simply grows longer and thinner and its leaves stay pale, because that is how the instructions play out under those conditions. No wanting, no effort, no deciding -- just instructions running in a particular set of surroundings.',
      ],
      vocabulary: [
        { term: 'genetic factor', definition: 'an influence on an organism that comes from the instructions it inherited from its parents.' },
        { term: 'environmental factor', definition: 'an influence on an organism that comes from its surroundings, such as light, water, food, temperature or crowding.' },
        { term: 'trait', definition: 'a characteristic of an organism, such as height, leaf color or body size.' },
        { term: 'inherited trait', definition: 'a characteristic an organism receives through the instructions passed down from its parents.' },
        { term: 'acquired trait', definition: 'a characteristic an organism ends up with because of what happened to it during its own life, which is not passed to its offspring.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-trees',
      kind: 'worked_example',
      problem:
        'Two young trees of the same kind grew from seeds that came off one parent tree. One seed landed in the middle of a crowded forest and grew into a tall, thin tree with branches only near the top. The other landed in an open field and grew into a shorter, wider tree with branches all the way down its trunk. Explain the difference without saying that either tree tried to do anything.',
      steps: [
        'Start by asking what is the same. Both seeds came off the same parent tree and both trees are the same kind, so their inherited instructions are similar. That means the instructions cannot be the main explanation for the difference.',
        'Now ask what is different. One tree grew surrounded by other trees. The other grew alone. The obvious environmental difference is light: in the forest, the light comes mostly from straight above, because neighboring trees block the sides. In the open field, light arrives from every direction all day.',
        'Connect the condition to the growth. A stem that receives light mainly from above grows longer and puts its leaves up high, where the light is, and the lower branches that sit in shade do not thrive. A tree lit from all sides has no reason for its lower branches to fail, so it keeps them and spreads out.',
        'WRONG way to say this: "The forest tree stretched itself taller in order to reach the sunlight." That sentence gives the tree a goal and makes it sound like effort produced the height. CORRECT way: "In shaded conditions the stem grows longer and thinner and the shaded lower branches die back." Same facts, no wanting.',
        'Name the range. Both trees stayed inside what their instructions allow for that kind of tree. Neither one became a different species, and neither one grew a shape that its instructions do not permit. The conditions picked a spot inside the range.',
        'Last check: is anything here inherited? No. If the tall thin forest tree drops a seed into an open field, that seed grows into a broad tree. The shape was a result of where it grew, not something passed down.',
      ],
      answer:
        'Their inherited instructions are similar, so the difference comes from their conditions. Crowding left the forest tree with light mainly from above, so its stem grew long and its shaded lower branches died back; the open-field tree received light from all sides and kept its lower branches, so it grew shorter and wider. Both results sit inside the range those instructions allow, and neither shape is passed to the next generation.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-stunted-parent',
      kind: 'worked_example',
      problem:
        'A gardener grows two bean plants from seeds out of the same packet. Plant A gets watered every day and reaches about 40 cm. Plant B is forgotten and watered rarely, and it reaches only about 15 cm. Both plants still make seeds. The gardener collects seeds from the small plant B and plants them the next spring in well-watered soil. How tall should those new plants grow, and why?',
      steps: [
        'Separate the two questions. Question one is why plant B stayed small. Question two is what its seeds will do. They have different answers, and mixing them up is the mistake this example exists to catch.',
        'Question one. The two plants came from one packet, so their inherited instructions are similar. The difference in their conditions is water, and water is what a plant needs to grow. Rarely watering plant B kept it near the short end of its range. Its small size is a result of its growing conditions.',
        'Question two. Ask what actually goes into a seed. A seed carries a copy of the instructions from the parent plant. It does not carry a record of the hard year that plant had. Drought changed how plant B turned out during its own life. It did not edit the instructions that got packed into the seeds.',
        'So the new plants start with instructions like plant A and plant B both started with. Give them plenty of water and they should grow to roughly the size plant A reached, near 40 cm, not the 15 cm their parent managed.',
        'WRONG: "The seeds came from a small plant, so they will grow into small plants." That is the acquired-trait trap. It sounds fair, and it is false. CORRECT: "A trait an organism picks up during its own life is not passed to its offspring. The seeds carry inherited instructions, not a record of a bad year."',
        'A quick way to test yourself on any claim like this: ask whether the change happened to the INSTRUCTIONS or only to the ONE ORGANISM. Drought, hunger, crowding and injury happen to the one organism. They do not reach into the instructions that get handed down.',
        'One honest limit, so you are not surprised later. Sometimes a parent under stress makes fewer or smaller seeds, so its offspring may start off with a smaller food supply. That is a head start question, not an inheritance question -- the instructions inside the seed are still the instructions.',
      ],
      answer:
        'They should grow to roughly the size plant A reached, near 40 cm, as long as they get enough water. Plant B stayed small because of its own dry conditions, and a trait an organism picks up during its life is not passed to its offspring. The seeds carry the inherited instructions, not a record of the poor growing season that plant had.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identical-cuttings',
      kind: 'try_yourself',
      problem:
        'Two cuttings are taken from one houseplant, so they carry the same instructions. One cutting is kept on a bright windowsill and one is kept in a dim corner. After six weeks the windowsill cutting is bushy with broad dark green leaves, and the dim-corner cutting is long, thin and pale. What is the best explanation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two cuttings must have different genes, because they turned out different.' },
        { id: 'b', text: 'Their genes are the same, so the difference comes from the different amounts of light they received.', correct: true },
        { id: 'c', text: 'The dim-corner cutting stretched itself out on purpose to try to reach the light.' },
        { id: 'd', text: 'The dim-corner cutting changed its genes so that it would suit the dark.' },
      ],
      expectedAnswer: 'Their genes are the same, so the difference comes from the different amounts of light they received.',
      hints: [
        'Both pieces were cut off one plant. Write down what is the same about them and what is different, and see which list can possibly explain the result.',
        'Three of these choices break a rule from the lesson: one ignores where the cuttings came from, one gives a plant a goal, and one has an organism editing its own instructions to suit its surroundings.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rabbit-offspring',
      kind: 'try_yourself',
      problem:
        'Two rabbits come from the same litter. One is given plenty of food and grows large. The other is given very little food and stays small. Later, the large rabbit has babies of its own, and those babies are raised on a normal amount of food. What is the best prediction about the size of the babies?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They will be large, because their parent grew large after eating extra food.' },
        { id: 'b', text: 'Their size will depend on the genes they inherited and the food they get, because the extra food their parent ate is not passed on.', correct: true },
        { id: 'c', text: 'They will be exactly the same size as their parent, because body size is set only by genes.' },
        { id: 'd', text: 'They will be large only if they are fed extra food, because extra food changes the genes of an animal.' },
      ],
      expectedAnswer: 'Their size will depend on the genes they inherited and the food they get, because the extra food their parent ate is not passed on.',
      hints: [
        'Ask the test question from the second worked example: did the extra food change the instructions the parent passes on, or did it only change how that one rabbit turned out?',
        'The right answer has to keep both factors in play. Any choice that hands the whole result to genes alone, or to food alone, is leaving half the story out.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-range-statement',
      kind: 'try_yourself',
      problem: 'Which statement best describes how genetic factors and environmental factors together influence how tall an organism grows?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Genes set a range of possible heights, and conditions such as food, water and light decide where inside that range the organism ends up.', correct: true },
        { id: 'b', text: 'Genes fix the height exactly, and no growing conditions can change it.' },
        { id: 'c', text: 'Growing conditions decide the height completely, and inherited instructions have nothing to do with it.' },
        { id: 'd', text: 'Whichever factor is stronger takes over completely, and the other factor then has no effect at all.' },
      ],
      expectedAnswer: 'Genes set a range of possible heights, and conditions such as food, water and light decide where inside that range the organism ends up.',
      hints: [
        'The lesson answer to genes or environment was never one of the two. Look for the choice where both are still doing a job.',
        'One choice sounds like a compromise but is really the same either-or mistake in disguise, because it still ends with one factor doing all the work.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-acquired-and-fixed',
      kind: 'misconception_check',
      question:
        'A student writes: "Height is a genetic trait, so how you treat a plant cannot change it. And anyway, a plant that grew short in dry soil will have short offspring." Two separate things have gone wrong in those sentences. Name them both.',
      commonErrors: [
        {
          answer: 'Height is genetic, so growing conditions cannot change it.',
          misconception:
            'Reading the word genetic as meaning fixed and unchangeable, so that once a trait is called genetic the environment is assumed to be irrelevant.',
          correctsTo:
            'Genetic means the instructions came from the parents. It does not mean the outcome is locked. Those instructions set a RANGE, and the conditions decide where inside that range the organism lands. A trait can be genetic and still be strongly affected by water, light or food -- height is exactly that kind of trait. Two cuttings off one plant have identical instructions and still end up different sizes, which would be impossible if genetic meant unchangeable.',
        },
        {
          answer: 'A plant that grew short because of dry soil will have short offspring.',
          misconception:
            'Believing that a trait an organism picks up during its own life gets passed to its offspring, because the change feels like it became part of the plant.',
          correctsTo:
            'It does not get passed on. Drought changed how that one plant turned out; it did not rewrite the instructions packed into its seeds. Plant those seeds in good soil and they grow to full size. The useful test is to ask whether something changed the INSTRUCTIONS or only the ONE ORGANISM: drought, hunger, crowding and injury change the one organism only. Hold on to this one, because a later unit builds on it -- populations do change over many generations, but never by an individual passing on something it picked up during its own life.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Growth comes from genetic factors and environmental factors TOGETHER. The question is never one or the other.',
        'Genes set the range of what is possible; the environment sets where inside that range an organism actually lands.',
        'Two cuttings from one plant carry the same instructions, so any difference between them has to come from their conditions.',
        'A trait an organism picks up during its own life is NOT passed to its offspring. A plant stunted by drought does not have stunted offspring.',
        'Genetic does not mean unchangeable. It means the instructions came from the parents, and those instructions leave room.',
        'Never say an organism stretched, tried or decided. Instructions play out under conditions -- no wanting, no effort, no deciding.',
        'Next question: those instructions keep doing all this work, so where in a living thing are they actually kept? That is where the next unit starts.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'How Environment Affects Growth' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
