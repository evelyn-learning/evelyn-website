/**
 * Grade 7 Science (Life Science) — Energy: Where Living Things Get Energy.
 *
 * The opening row of Unit 4 (NGSS MS-LS1-6). It sets the bookkeeping rule that
 * governs the whole unit before photosynthesis (4.2) or cellular respiration
 * (4.3) arrive: energy is never created and never destroyed, only transferred
 * and transformed. Producers capture light energy and store it in the food
 * they MAKE; consumers and decomposers take that stored energy in by eating.
 *
 * The verb discipline here matches the Unit 2 organelles exemplar: a
 * mitochondrion RELEASES energy from food and never makes it, and by the same
 * rule a producer produces FOOD and never energy. Any later row in this unit
 * that says an organism or an organelle makes energy contradicts this file.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item here
 * is solvable from the words printed in it, and every energy pathway is
 * written out in prose. No percentages of energy transfer appear here -- that
 * belongs in Unit 9 and needs care.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U4_ENERGY_FOR_LIVING_THINGS: LessonPlan = {
  id: 'evelyn.ms.m7sci.energy-for-living-things.v1',
  title: 'Where Living Things Get Energy',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.energy-for-living-things',
      standard: 'M7SCI-4.1',
      description:
        'Explain that nearly all energy in living systems can be traced back to sunlight captured by producers, distinguish producers, consumers and decomposers by how each one obtains energy, and use the rule that energy is transferred and transformed rather than created or destroyed (NGSS MS-LS1-6).',
    },
  ],
  prerequisites: ['m7sci.homeostasis'],
  followUps: ['m7sci.photosynthesis'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Trace one ordinary morning backwards to sunlight, and flag the one verb this unit polices.',
      script:
        'You carried your backpack up the stairs this morning. That took energy. Now trace it backwards. The energy came from your breakfast. If breakfast was toast, the bread came from wheat, and the wheat was a plant standing in a field with sunlight falling on it. If breakfast was eggs, the hen ate grain, and the grain was a plant standing in the sun. Push the chain back far enough and almost every bit of energy in almost every living thing on this planet started out as sunlight. Today we follow that path. And we get very careful about one verb, because nothing alive anywhere on that path ever made any energy. Every living thing along the chain only passed energy along or changed the form it was in.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-energy-sources',
      kind: 'concept',
      goal: 'Sunlight as the origin, producer and consumer and decomposer by how each obtains energy, energy stored in chemical bonds, and the conservation rule that governs Unit 4.',
      keyIdeas: [
        'NEARLY ALL ENERGY IN LIVING THINGS STARTS AS SUNLIGHT — light energy leaves the Sun, travels to Earth, and some of it lands on plants, algae and certain bacteria. Those living things capture it. Everything else on the planet is downstream of that catch. We say NEARLY all rather than all because a few bacteria deep in the dark ocean use energy from chemicals coming out of the seafloor instead, but every food chain you will meet in this course starts with light.',
        'A PRODUCER CAPTURES LIGHT AND STORES IT IN FOOD IT MAKES — producers, also called autotrophs, are the living things that make their own food: plants, algae, and some bacteria. Read the job carefully, because the name misleads almost everyone. WRONG: "A producer is called that because it produces energy for everything else." CORRECT: "A producer is called that because it produces FOOD, and the energy packed into that food arrived as sunlight." The producer captured energy that already existed. It did not bring any new energy into the world.',
        'CONSUMERS EAT, AND DECOMPOSERS FEED ON WHAT IS DEAD — a CONSUMER, also called a heterotroph, cannot make its own food, so it obtains energy by eating other living things. You are a consumer, and so is a deer, a spider and a shark. A DECOMPOSER, such as a mushroom or many kinds of bacteria, obtains energy from dead material and waste, breaking it down and using the energy still stored inside it. A fallen log still holds energy from the years the tree spent in the sunlight, and the fungus growing on that log is collecting it.',
        'THE ENERGY IS STORED IN THE CHEMICAL BONDS OF FOOD — food is not just fuel in a vague way. Sugars, fats and proteins are built from atoms held together by chemical bonds, and energy is stored in the way those atoms are arranged. When a cell breaks the food apart, that stored energy is released, and the cell transfers it into a form it can spend right away. Scientists call that spendable form ATP, and one mention of the name is all you need this year. Plants do this too. A plant makes food and then has to break some of it down, exactly like the animal that eats it does.',
        'THE RULE THAT GOVERNS THIS ENTIRE UNIT — energy is never created and never destroyed. It is only TRANSFERRED from one thing to another and TRANSFORMED from one form into another. Follow one chain and watch the transformations: light energy from the Sun becomes chemical energy stored in a leaf, becomes chemical energy in the deer that ate the leaf, becomes motion and warmth when the deer runs. The total never grows and never vanishes. Every sentence you write about energy this unit has to obey that rule, so keep the verbs honest: captured, stored, released, transferred, transformed. Never made.',
        'FOOD AND ENERGY ARE NOT THE SAME THING, AND SOIL IS NOT FOOD — food is matter. It is a substance, it takes up space, and you could weigh it. Energy is not a substance; it is what that matter carries and what gets released when the matter is broken down. That difference is also why the most common plant mistake is wrong. WRONG: "A plant gets its food from the soil." CORRECT: "A plant MAKES its own food, using light energy, and takes water and minerals from the soil." Minerals matter, but they are building materials, not food and not an energy supply.',
      ],
      vocabulary: [
        { term: 'producer', definition: 'a living thing that makes its own food, storing captured light energy in it; also called an autotroph.' },
        { term: 'consumer', definition: 'a living thing that cannot make its own food and obtains energy by eating other living things; also called a heterotroph.' },
        { term: 'decomposer', definition: 'a living thing, such as a fungus or many bacteria, that obtains energy from dead material and waste by breaking it down.' },
        { term: 'chemical energy', definition: 'energy stored in the bonds that hold the atoms of a substance such as food together.' },
        { term: 'energy transformation', definition: 'a change of energy from one form into another, such as light energy becoming chemical energy in a leaf.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-the-chain',
      kind: 'worked_example',
      problem:
        'A cow eats grass in a field. You drink a glass of milk from that cow, then run around the yard. Trace the energy in that run all the way back to where it started, and name the form the energy is in at each step.',
      steps: [
        'Start at the end and work backwards, one transfer at a time. The energy you spend running came from the milk you drank.',
        'The milk came from the cow, so the energy in the milk was chemical energy stored in food the cow had already taken in.',
        'The cow got it by eating grass. The chemical energy stored in the grass was transferred into the cow when the cow ate and digested it.',
        'The grass is a producer. It captured light energy from the Sun and stored that energy in the food it made. Notice the grass did not receive its food from the soil. The soil gave it water and minerals.',
        'So the chain, written out in words, is: light energy from the Sun, to chemical energy stored in the grass, to chemical energy in the cow and in its milk, to chemical energy in you, to the motion of your legs and the warmth of your body.',
        'Now check the chain against the rule. At every arrow the energy was transferred to something new or transformed into a different form. At no arrow did anything bring new energy into existence, and at no arrow did energy simply vanish.',
        'One honest footnote. Even the Sun is not creating energy out of nothing; it is releasing energy that was already stored in its fuel. That is a physics story for another year, but the rule holds there too.',
      ],
      answer:
        'Light energy from the Sun, captured and stored as chemical energy in the grass, transferred as chemical energy to the cow and its milk, transferred to you, and transformed into motion and warmth when you run. Every step is a transfer or a transformation, never a creation.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-the-verb',
      kind: 'worked_example',
      problem:
        'A student writes this sentence in her notebook, and it is WRONG: "Plants make energy from sunlight, and then animals make energy from the plants they eat." Her chain of living things is correct. Explain what is wrong anyway, and rewrite the sentence so it is true.',
      steps: [
        'Check the chain first. Sunlight, then plant, then animal. That order is right, so the problem is not which living thing comes where.',
        'The problem is the verb. Both halves of her sentence say a living thing MAKES energy, and nothing makes energy. Energy cannot be created.',
        'Fix the first half. The plant is a producer, so it captures light energy that already exists and stores that energy in food it makes. It makes FOOD, not energy. Say: "Plants capture light energy from the Sun and store it in the food they make."',
        'Fix the second half. The animal is a consumer. It takes in food that already holds energy, and its cells release that stored energy by breaking the food down. Say: "Animals take in that stored energy by eating the plants, and their cells release it from the food."',
        'Put the halves together: "Plants capture light energy from the Sun and store it in the food they make. Animals take in that stored energy by eating the plants, and their cells release it from the food." Same chain, honest verbs.',
        'One more thing her sentence hides. It sounds as though only the animal breaks food down. The plant does that too. A plant makes food and then breaks some of it back down to run itself, which is why a plant left in a completely dark closet eventually dies even though nothing ate it.',
      ],
      answer:
        'The chain of living things is right but the verb is not, because nothing makes energy. Corrected: plants capture light energy from the Sun and store it in the food they make; animals take in that stored energy by eating the plants, and their cells release it from the food. Plants also break food down, not only animals.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-trace-to-source',
      kind: 'try_yourself',
      problem:
        'A wolf eats a deer. The deer had spent the summer eating leaves. Where did the energy now stored in the wolf originally come from?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'From the Sun, captured by the leaves the deer ate', correct: true },
        { id: 'b', text: 'From the soil, taken up through the roots of the plants the deer ate' },
        { id: 'c', text: 'From the wolf itself, which supplies its own energy as it grows' },
        { id: 'd', text: 'From the water that the deer and the wolf both drank' },
      ],
      expectedAnswer: 'From the Sun, captured by the leaves the deer ate',
      hints: [
        'Keep walking backwards down the chain until you reach something that is not eating anything at all. What is that last thing taking in?',
        'Roots do pull something out of the soil, but water and minerals are building materials rather than an energy supply.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fix-the-sentence',
      kind: 'try_yourself',
      problem:
        'A student writes this sentence, and it is WRONG: "Grass makes energy for the cows that eat it." Which choice repairs the sentence correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Grass takes in its food from the soil, and the cows get that food by eating the grass.' },
        {
          id: 'b',
          text: 'Grass captures light energy from the Sun and stores it in the food it makes, and the cows take in that stored energy by eating the grass.',
          correct: true,
        },
        { id: 'c', text: 'Grass passes sunlight straight into the cows when they eat it.' },
        { id: 'd', text: 'Grass stores energy and never has to break any of it down, because it made the food itself.' },
      ],
      expectedAnswer:
        'Grass captures light energy from the Sun and stores it in the food it makes, and the cows take in that stored energy by eating the grass.',
      hints: [
        'The repaired sentence has to keep the verbs honest. Grass is allowed to capture energy and to store it, and it is allowed to make food.',
        'Three of these choices each contain a different familiar mistake: food coming out of the soil, sunlight itself being handed over, and a producer never needing to break its own food down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mushroom-on-a-log',
      kind: 'try_yourself',
      problem:
        'A mushroom is growing on a fallen log in a shaded part of the woods. How is that mushroom obtaining its energy?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It captures sunlight and makes its own food, the way the tree once did.' },
        { id: 'b', text: 'It breaks down the dead wood and uses the energy still stored in it.', correct: true },
        { id: 'c', text: 'It draws its food up out of the soil underneath the log.' },
        { id: 'd', text: 'It takes in the warmth of the air around the log and uses that as its energy supply.' },
      ],
      expectedAnswer: 'It breaks down the dead wood and uses the energy still stored in it.',
      hints: [
        'Sort the mushroom first. It does not make its own food and it is not eating a living thing, so which of the three groups is left?',
        'The tree spent years in the sunlight before it fell. Ask whether the energy it stored disappeared the moment the tree died.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-producers-and-soil',
      kind: 'misconception_check',
      question:
        'A student writes: "Plants get their food from the soil, and we call them producers because they produce the energy that every other living thing uses." Two separate things have gone wrong in that sentence. Name both.',
      commonErrors: [
        {
          answer: 'Plants get their food from the soil.',
          misconception:
            'Seeing roots pull something up out of the ground and concluding that the something must be food, because food is what animals take in from outside.',
          correctsTo:
            'A plant MAKES its own food. What it takes from the soil is water and minerals, which are building materials rather than food and rather than an energy supply. The check that settles it is mass: a plant grown in a pot gains far more mass than the soil in the pot ever loses, so the new material cannot have come from the soil. Most of it is built from water and from a gas in the air, using light energy. That is the story of the next lesson.',
        },
        {
          answer: 'Producers are called that because they produce energy for everything else.',
          misconception:
            'Reading the word producer as a claim about energy, when it is a claim about food, and forgetting that energy cannot be created by anything.',
          correctsTo:
            'A producer produces FOOD. The energy stored in that food was not brought into existence by the plant; it arrived as sunlight and the plant captured it and stored it. Swap the noun and the sentence becomes true. This is the same rule you met with mitochondria in the cell unit: mitochondria release energy from food and never make it, and producers store captured energy in food and never make it either. Across this whole unit energy is captured, stored, released, transferred and transformed, and it is never manufactured.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Nearly all energy in living things can be traced back to sunlight captured by producers.',
        'Producers capture light energy and store it in food they make; consumers obtain energy by eating; decomposers obtain it from dead material and waste.',
        'A producer produces FOOD. Nothing alive brings new energy into existence.',
        'Energy is stored in the chemical bonds of food and is released when a cell breaks that food down. Plants do this too, not only animals.',
        'The rule for the whole unit: energy is never created and never destroyed, only transferred and transformed.',
        'Soil supplies water and minerals, not food. Food is matter; energy is what that matter carries.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Where Living Things Get Energy' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
