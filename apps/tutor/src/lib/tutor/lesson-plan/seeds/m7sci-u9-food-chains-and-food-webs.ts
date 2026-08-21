/**
 * Grade 7 Science (Life Science) — Ecosystems: Food Chains, Food Webs & Energy Flow.
 *
 * Row 9.2 (NGSS MS-LS2-3). The whole lesson is organized around ONE detail:
 * a food-chain arrow points from the organism that is EATEN to the organism
 * that EATS it, because the arrow follows the energy. Reversing it is the most
 * common error in the topic, so it is stated in the hook, made a key idea,
 * worked twice, tested as its own MCQ, and corrected again in the
 * misconception check.
 *
 * The second thread is that energy gets smaller at every step and leaves as
 * heat, which is why chains are short and top predators are few. No fixed
 * transfer percentage is quoted anywhere in this file: that familiar figure is
 * a rough teaching rule rather than a measured constant, so every statement
 * here says "only a small fraction" instead.
 * Matter cycling is row 9.3 and is only pointed at, never taught.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every chain and
 * every web in this file is written out in words, with the word "to" standing
 * in for the arrow, always running from the eaten to the eater. Never write
 * "look at the food web above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U9_FOOD_CHAINS_AND_FOOD_WEBS: LessonPlan = {
  id: 'evelyn.ms.m7sci.food-chains-and-food-webs.v1',
  title: 'Food Chains, Food Webs & Energy Flow',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.food-chains-and-food-webs',
      standard: 'M7SCI-9.2',
      description:
        'Trace energy from producers through consumers and decomposers using food chains and food webs, pointing every arrow from the organism that is eaten to the organism that eats it, and explain why the energy available gets smaller at each step (NGSS MS-LS2-3).',
    },
  ],
  prerequisites: ['m7sci.ecosystem-organization'],
  followUps: ['m7sci.cycles-of-matter'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with a familiar pond and put the arrow-direction question on the table immediately.',
      script:
        'Picture the pond behind a school. A heron stands in the shallow water and swallows a small fish. That fish had spent the morning eating tiny water insects. Those insects had been eating green algae. And the algae had been sitting in the sunlight, making its own food. So the heron is running on sunlight that took three steps to get to it. Scientists write that path down with arrows, and the arrows are the part that almost everybody gets backwards on the first try. Today you will learn exactly which way an arrow points, why the energy shrinks at every step, and why a pond can hold thousands of algae but only one heron.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-food-chains-webs-energy',
      kind: 'concept',
      goal: 'Install feeding roles, trophic levels, the arrow-direction rule, chains versus webs, and one-way energy flow.',
      keyIdeas: [
        'PRODUCERS START EVERY FOOD CHAIN. A producer, such as grass, a tree, or pond algae, makes its own food using sunlight. Nothing else in the ecosystem can do that. Every animal in the pond or the meadow is living on energy that a producer captured first, which is why a food chain always begins with a producer and never with an animal.',
        'CONSUMERS EAT OTHER LIVING THINGS, AND THEY COME IN THREE KINDS. A herbivore eats only producers, like a grasshopper or a cow. A carnivore eats only other animals, like a snake or a hawk. An omnivore eats both, like a bear or a person. Their position in the chain has a name too: the producer is the first trophic level, the herbivore that eats it is the second, the animal that eats the herbivore is the third, and so on. A trophic level is just a feeding step, counted up from the producer.',
        'DECOMPOSERS ARE PART OF THE WEB, NOT AN EXTRA. Bacteria and fungi break down dead leaves, dead bodies, and animal waste, and they do it at every level of the web. This is not tidying up. What they release goes back into the soil and the water, where producers can use it again. Kill the decomposers and dead material piles up with everything useful still locked inside it, so the producers run short and the entire web weakens from the bottom.',
        'THE ARROW POINTS FROM THE EATEN TO THE EATER. Say it out loud, because this is the rule this lesson exists for. In grass to grasshopper, the arrow starts at the grass and its point touches the grasshopper, because the grasshopper eats the grass and the energy moves out of the grass and into the grasshopper. The arrow follows the ENERGY. It does not point at the food, and it does not show who is hunting. WRONG: an arrow from the frog to the grasshopper it just ate. CORRECT: grasshopper to frog. Here is the ten-second check that never fails: the first arrow in any chain starts at a plant or at algae, and a plant cannot eat anything. If your chain starts at a predator, every arrow in it is backwards.',
        'A CHAIN IS ONE PATHWAY, A WEB IS MANY OF THEM, AND THE WEB IS THE REALISTIC PICTURE. A food chain follows a single route, such as grass to grasshopper, grasshopper to frog, frog to snake. But most organisms eat several different things and are eaten by several different things. A food web shows all of those routes overlapping at once: grass to grasshopper and grass to mouse, grasshopper to frog, frog to snake, and mouse to snake as well. Because everything is connected, removing one species does not just affect the species next to it. The change travels along every arrow that species touched.',
        'ENERGY GETS SMALLER AT EVERY STEP, AND IT LEAVES AS HEAT. Only a small fraction of the energy at one level ends up stored in the bodies of the level above. Most of it is spent moving, breathing, and growing, and it escapes as heat, and some of the food is never eaten at all. That is why food chains are short, usually four or five steps, and why there are far fewer top predators than there is grass. It also means energy FLOWS one way through an ecosystem: it comes in as sunlight and it leaves as heat, exactly as you saw in Unit 4. Energy is not recycled. Matter is a different story, and that is the next lesson.',
      ],
      vocabulary: [
        { term: 'producer', definition: 'an organism such as grass or algae that makes its own food using sunlight.' },
        { term: 'consumer', definition: 'an organism that gets energy by eating other living things.' },
        { term: 'decomposer', definition: 'a bacterium or fungus that breaks down dead material and waste and returns what it contains to the soil and water.' },
        { term: 'trophic level', definition: 'a feeding step in a food chain, counted upward from the producer.' },
        { term: 'food web', definition: 'many food chains shown together, because most organisms eat and are eaten by more than one thing.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-the-chain',
      kind: 'worked_example',
      problem:
        'A field survey reports the following. Grass grows all over the field. Grasshoppers eat the grass. Frogs eat the grasshoppers. Snakes eat the frogs. Write this as a food chain with the arrows pointing the correct way, and name the role of each organism.',
      steps: [
        'Find the producer first, because a food chain always starts there. Grass makes its own food from sunlight, so grass is the producer and grass goes at the front.',
        'Ask who eats the grass. The grasshopper does. So the energy moves out of the grass and into the grasshopper, and the first link is grass to grasshopper. The arrow starts at the grass. It does not point back at the grass, because the grass is not eating anything.',
        'Ask who eats the grasshopper. The frog does. The energy moves from the grasshopper into the frog, so the next link is grasshopper to frog.',
        'Ask who eats the frog. The snake does. The energy moves from the frog into the snake, so the last link is frog to snake.',
        'Put it together: grass to grasshopper, grasshopper to frog, frog to snake. Now check it the fast way. The chain begins at a plant, and a plant cannot eat, so the arrows are running the right direction.',
        'Name the roles. Grass is the producer and the first trophic level. The grasshopper is a herbivore, the second level. The frog is a carnivore, the third level. The snake is a carnivore at the fourth level, and nothing in this field eats the snake, so it is the top predator. Notice that the grass has by far the most energy in it and the snake has the least, because energy is lost at every one of those three steps.',
      ],
      answer:
        'grass to grasshopper, grasshopper to frog, frog to snake. Grass is the producer, the grasshopper is a herbivore, the frog is a carnivore that eats the herbivore, and the snake is the top predator. Every arrow runs from the organism being eaten to the organism eating it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-web-removal',
      kind: 'worked_example',
      problem:
        'A meadow food web runs like this: grass to grasshopper, grass to mouse, grasshopper to frog, frog to snake, mouse to snake, snake to hawk. Fungi and bacteria break down every one of these organisms after it dies. A disease wipes out all the frogs. Trace what happens through the web.',
      steps: [
        'Start at the frogs and find every arrow that touches them. There are two: grasshopper to frog, and frog to snake.',
        'Read the arrow grasshopper to frog. It runs from the grasshopper to the frog, which means the frog was eating grasshoppers. With the frogs gone, the grasshoppers lose their predator, so the grasshopper population grows.',
        'Follow that forward along the arrow grass to grasshopper. More grasshoppers means more grass is eaten, so the grass in the meadow is grazed down. A change three steps away from the frogs has reached the producer.',
        'Now read the other arrow, frog to snake. It runs from the frog to the snake, which means the snake was eating frogs. The snakes have lost one of their two foods.',
        'Check what the snakes have left. The web still has mouse to snake, so the snakes eat more mice instead, and the mouse population drops. The mice were also eating grass, so this pulls on the grass a second time.',
        'Finally follow snake to hawk. That arrow runs from the snake to the hawk, so hawks eat snakes. If the snakes cannot get enough food after losing the frogs, the hawks have less to eat as well.',
        'State the lesson. Losing the frogs changed the grasshoppers, the grass, the mice, the snakes, and the hawks. In a real ecosystem the effect does not stop at the neighbors, because the arrows connect everything.',
      ],
      answer:
        'Grasshoppers increase because their predator is gone, so the grass gets grazed down. Snakes switch to mice, so mice decline and the grass is pushed a second time. Hawks lose food if the snakes decline. One missing species changes the whole web, not just the species beside it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-arrow-direction',
      kind: 'try_yourself',
      problem:
        'A pond food chain is written like this: algae to mayfly larva, mayfly larva to sunfish, sunfish to heron. What does the arrow between the sunfish and the heron tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The heron eats the sunfish, so energy moves from the sunfish into the heron.', correct: true },
        { id: 'b', text: 'The sunfish eats the heron, so energy moves from the heron into the sunfish.' },
        { id: 'c', text: 'The heron and the sunfish hunt the same food, so the arrow shows that they compete.' },
        { id: 'd', text: 'The heron returns some of its energy to the sunfish when the heron dies.' },
      ],
      expectedAnswer: 'The heron eats the sunfish, so energy moves from the sunfish into the heron.',
      hints: [
        'The arrow follows the energy, not the hunting. Ask which organism ends up with the energy inside it.',
        'Test the rule on the first arrow. Algae to mayfly larva cannot mean the algae eats the larva, so an arrow must run from the eaten to the eater.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-energy-shrinks',
      kind: 'try_yourself',
      problem:
        'A meadow has the food chain grass to grasshopper, grasshopper to frog, frog to snake. The meadow holds an enormous amount of grass, plenty of grasshoppers, a fair number of frogs, and only two or three snakes. Which statement best explains why the snakes are so few?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Only a small fraction of the energy at each step is stored in the level above it, so very little is left to support snakes.', correct: true },
        { id: 'b', text: 'The snake is at the top of the chain, so the most energy of all is available to it.' },
        { id: 'c', text: 'Energy is recycled back down to the grass at each step, so it never reaches the snakes.' },
        { id: 'd', text: 'Snakes are simply bigger than grasshoppers, so a meadow has room for fewer of them.' },
      ],
      expectedAnswer: 'Only a small fraction of the energy at each step is stored in the level above it, so very little is left to support snakes.',
      hints: [
        'Think about what happens to the energy a grasshopper eats. How much of it ends up stored in the grasshopper body, and where does the rest go?',
        'Count the steps from the grass to the snake. Energy is lost at every single one of them, and it leaves as heat.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-decomposers',
      kind: 'try_yourself',
      problem:
        'A forest food web includes leaves to caterpillar, caterpillar to songbird, songbird to hawk. Fungi and bacteria in the soil break down the dead leaves, the dead animals, and the droppings. A chemical spill kills nearly all of those fungi and bacteria. What happens to the forest over the next several years?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing changes, because decomposers are not really part of the food web.' },
        { id: 'b', text: 'The hawks are hurt first, because they are at the top and the decomposers were their main food.' },
        { id: 'c', text: 'Dead leaves and bodies pile up with everything useful locked inside them, so the trees run short and the whole web weakens.', correct: true },
        { id: 'd', text: 'Energy stops entering the forest, because the decomposers are what capture sunlight for the ecosystem.' },
      ],
      expectedAnswer: 'Dead leaves and bodies pile up with everything useful locked inside them, so the trees run short and the whole web weakens.',
      hints: [
        'Decomposers are not just cleaning up. Ask what they put back into the soil, and ask who needs it.',
        'The producers here are the trees. If the producers are in trouble, what happens to everything that depends on them?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-arrow-reversed',
      kind: 'misconception_check',
      question:
        'A student writes a pond food chain as heron to sunfish, sunfish to mayfly larva, mayfly larva to algae. He explains that each arrow shows what that animal eats. What went wrong?',
      commonErrors: [
        {
          answer: 'heron to sunfish, sunfish to mayfly larva, mayfly larva to algae',
          misconception:
            'Reading the arrow as the word "eats" and pointing it from the eater toward its food. Every arrow in the chain is reversed.',
          correctsTo:
            'The arrow follows the ENERGY, so it runs from the organism that is eaten to the organism that eats it. The correct chain is algae to mayfly larva, mayfly larva to sunfish, sunfish to heron. Here is the check that catches this every time: a food chain must begin with a producer, and a producer cannot eat anything. This chain began with a heron, so the arrows had to be backwards. If it helps, read each arrow as the words "gives its energy to" instead of "eats".',
        },
        {
          answer: 'When the heron dies, its energy goes back to the algae, so the food chain is really a circle.',
          misconception:
            'Turning energy flow into a loop, because decomposers really do return something to the soil.',
          correctsTo:
            'What decomposers return is MATTER, the material that the algae can build with again. The energy is not returned. At every step, including decomposition, energy leaves as heat and does not come back. That is why an ecosystem needs a fresh supply of sunlight every single day. Energy flows one way through an ecosystem. Matter cycles within it, and that is the next lesson.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'THE ARROW POINTS FROM THE EATEN TO THE EATER. In grass to grasshopper, the grasshopper eats the grass and the energy moves that way.',
        'Check any chain in ten seconds: it must start at a producer, and a producer cannot eat anything. A chain that starts at a predator is backwards.',
        'Producers make their own food from sunlight. Consumers are herbivores, carnivores, or omnivores. A trophic level is a feeding step counted up from the producer.',
        'Decomposers are part of the web and work at every level, returning what dead material contains to the soil so producers can use it again.',
        'A food chain is one pathway. A food web is many overlapping chains, and it is the realistic picture.',
        'Remove one species and the change travels along every arrow it touched, not just to its neighbors.',
        'Only a small fraction of the energy passes to the next level. The rest is used up and lost as heat, which is why chains are short and top predators are few.',
        'Energy FLOWS one way, in as sunlight and out as heat. Energy is not recycled.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Food Chains, Food Webs & Energy Flow' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
