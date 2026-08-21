/**
 * Grade 7 Science — Unit 9 CED 9.2: Food Chains, Food Webs & Energy Flow.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.food-chains-and-food-webs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U9_FOOD_CHAINS_AND_FOOD_WEBS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.food-chains-and-food-webs.v1',
  course: 'Grade 7 Science',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Food Chains, Food Webs & Energy Flow',
  planId: 'evelyn.ms.m7sci.food-chains-and-food-webs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.food-chains-and-food-webs.v1' }],
  theory: [
    { loId: 'm7sci.food-chains-and-food-webs', content: `PRODUCERS START EVERY FOOD CHAIN. A producer, such as grass, a tree, or pond algae, makes its own food using sunlight. Nothing else in the ecosystem can do that. Every animal in the pond or the meadow is living on energy that a producer captured first, which is why a food chain always begins with a producer and never with an animal.` },
    { loId: 'm7sci.food-chains-and-food-webs', content: `CONSUMERS EAT OTHER LIVING THINGS, AND THEY COME IN THREE KINDS. A herbivore eats only producers, like a grasshopper or a cow. A carnivore eats only other animals, like a snake or a hawk. An omnivore eats both, like a bear or a person. Their position in the chain has a name too: the producer is the first trophic level, the herbivore that eats it is the second, the animal that eats the herbivore is the third, and so on. A trophic level is just a feeding step, counted up from the producer.` },
    { loId: 'm7sci.food-chains-and-food-webs', content: `DECOMPOSERS ARE PART OF THE WEB, NOT AN EXTRA. Bacteria and fungi break down dead leaves, dead bodies, and animal waste, and they do it at every level of the web. This is not tidying up. What they release goes back into the soil and the water, where producers can use it again. Kill the decomposers and dead material piles up with everything useful still locked inside it, so the producers run short and the entire web weakens from the bottom.` },
    { loId: 'm7sci.food-chains-and-food-webs', content: `THE ARROW POINTS FROM THE EATEN TO THE EATER. Say it out loud, because this is the rule this lesson exists for. In grass to grasshopper, the arrow starts at the grass and its point touches the grasshopper, because the grasshopper eats the grass and the energy moves out of the grass and into the grasshopper. The arrow follows the ENERGY. It does not point at the food, and it does not show who is hunting. WRONG: an arrow from the frog to the grasshopper it just ate. CORRECT: grasshopper to frog. Here is the ten-second check that never fails: the first arrow in any chain starts at a plant or at algae, and a plant cannot eat anything. If your chain starts at a predator, every arrow in it is backwards.` },
    { loId: 'm7sci.food-chains-and-food-webs', content: `A CHAIN IS ONE PATHWAY, A WEB IS MANY OF THEM, AND THE WEB IS THE REALISTIC PICTURE. A food chain follows a single route, such as grass to grasshopper, grasshopper to frog, frog to snake. But most organisms eat several different things and are eaten by several different things. A food web shows all of those routes overlapping at once: grass to grasshopper and grass to mouse, grasshopper to frog, frog to snake, and mouse to snake as well. Because everything is connected, removing one species does not just affect the species next to it. The change travels along every arrow that species touched.` },
    { loId: 'm7sci.food-chains-and-food-webs', content: `ENERGY GETS SMALLER AT EVERY STEP, AND IT LEAVES AS HEAT. Only a small fraction of the energy at one level ends up stored in the bodies of the level above. Most of it is spent moving, breathing, and growing, and it escapes as heat, and some of the food is never eaten at all. That is why food chains are short, usually four or five steps, and why there are far fewer top predators than there is grass. It also means energy FLOWS one way through an ecosystem: it comes in as sunlight and it leaves as heat, exactly as you saw in Unit 4. Energy is not recycled. Matter is a different story, and that is the next lesson.` },
    { loId: 'm7sci.food-chains-and-food-webs', kind: 'definition', title: 'producer', content: 'an organism such as grass or algae that makes its own food using sunlight.' },
    { loId: 'm7sci.food-chains-and-food-webs', kind: 'definition', title: 'consumer', content: 'an organism that gets energy by eating other living things.' },
    { loId: 'm7sci.food-chains-and-food-webs', kind: 'definition', title: 'decomposer', content: `a bacterium or fungus that breaks down dead material and waste and returns what it contains to the soil and water.` },
    { loId: 'm7sci.food-chains-and-food-webs', kind: 'definition', title: 'trophic level', content: 'a feeding step in a food chain, counted upward from the producer.' },
    { loId: 'm7sci.food-chains-and-food-webs', kind: 'definition', title: 'food web', content: `many food chains shown together, because most organisms eat and are eaten by more than one thing.` },
  ],
  methods: [
    {
      title: 'Worked build the chain',
      steps: [
        `Find the producer first, because a food chain always starts there. Grass makes its own food from sunlight, so grass is the producer and grass goes at the front.`,
        `Ask who eats the grass. The grasshopper does. So the energy moves out of the grass and into the grasshopper, and the first link is grass to grasshopper. The arrow starts at the grass. It does not point back at the grass, because the grass is not eating anything.`,
        `Ask who eats the grasshopper. The frog does. The energy moves from the grasshopper into the frog, so the next link is grasshopper to frog.`,
        `Ask who eats the frog. The snake does. The energy moves from the frog into the snake, so the last link is frog to snake.`,
        `Put it together: grass to grasshopper, grasshopper to frog, frog to snake. Now check it the fast way. The chain begins at a plant, and a plant cannot eat, so the arrows are running the right direction.`,
        `Name the roles. Grass is the producer and the first trophic level. The grasshopper is a herbivore, the second level. The frog is a carnivore, the third level. The snake is a carnivore at the fourth level, and nothing in this field eats the snake, so it is the top predator. Notice that the grass has by far the most energy in it and the snake has the least, because energy is lost at every one of those three steps.`,
      ],
      example: { problem: `A field survey reports the following. Grass grows all over the field. Grasshoppers eat the grass. Frogs eat the grasshoppers. Snakes eat the frogs. Write this as a food chain with the arrows pointing the correct way, and name the role of each organism.`, solution: `grass to grasshopper, grasshopper to frog, frog to snake. Grass is the producer, the grasshopper is a herbivore, the frog is a carnivore that eats the herbivore, and the snake is the top predator. Every arrow runs from the organism being eaten to the organism eating it.` },
      relatedLoIds: ['m7sci.food-chains-and-food-webs'],
    },
    {
      title: 'Worked web removal',
      steps: [
        `Start at the frogs and find every arrow that touches them. There are two: grasshopper to frog, and frog to snake.`,
        `Read the arrow grasshopper to frog. It runs from the grasshopper to the frog, which means the frog was eating grasshoppers. With the frogs gone, the grasshoppers lose their predator, so the grasshopper population grows.`,
        `Follow that forward along the arrow grass to grasshopper. More grasshoppers means more grass is eaten, so the grass in the meadow is grazed down. A change three steps away from the frogs has reached the producer.`,
        `Now read the other arrow, frog to snake. It runs from the frog to the snake, which means the snake was eating frogs. The snakes have lost one of their two foods.`,
        `Check what the snakes have left. The web still has mouse to snake, so the snakes eat more mice instead, and the mouse population drops. The mice were also eating grass, so this pulls on the grass a second time.`,
        `Finally follow snake to hawk. That arrow runs from the snake to the hawk, so hawks eat snakes. If the snakes cannot get enough food after losing the frogs, the hawks have less to eat as well.`,
        `State the lesson. Losing the frogs changed the grasshoppers, the grass, the mice, the snakes, and the hawks. In a real ecosystem the effect does not stop at the neighbors, because the arrows connect everything.`,
      ],
      example: { problem: `A meadow food web runs like this: grass to grasshopper, grass to mouse, grasshopper to frog, frog to snake, mouse to snake, snake to hawk. Fungi and bacteria break down every one of these organisms after it dies. A disease wipes out all the frogs. Trace what happens through the web.`, solution: `Grasshoppers increase because their predator is gone, so the grass gets grazed down. Snakes switch to mice, so mice decline and the grass is pushed a second time. Hawks lose food if the snakes decline. One missing species changes the whole web, not just the species beside it.` },
      relatedLoIds: ['m7sci.food-chains-and-food-webs'],
    },
  ],
  pointers: [
    { content: `Students often say "heron to sunfish, sunfish to mayfly larva, mayfly larva to algae" — The arrow follows the ENERGY, so it runs from the organism that is eaten to the organism that eats it. The correct chain is algae to mayfly larva, mayfly larva to sunfish, sunfish to heron. Here is the check that catches this every time: a food chain must begin with a producer, and a producer cannot eat anything. This chain began with a heron, so the arrows had to be backwards. If it helps, read each arrow as the words "gives its energy to" instead of "eats".`, kind: 'common-error' },
    { content: `Students often say "When the heron dies, its energy goes back to the algae, so the food chain is really a circle." — What decomposers return is MATTER, the material that the algae can build with again. The energy is not returned. At every step, including decomposition, energy leaves as heat and does not come back. That is why an ecosystem needs a fresh supply of sunlight every single day. Energy flows one way through an ecosystem. Matter cycles within it, and that is the next lesson.`, kind: 'common-error' },
    { content: `THE ARROW POINTS FROM THE EATEN TO THE EATER. In grass to grasshopper, the grasshopper eats the grass and the energy moves that way.`, kind: 'tip' },
    { content: `Check any chain in ten seconds: it must start at a producer, and a producer cannot eat anything. A chain that starts at a predator is backwards.`, kind: 'tip' },
    { content: `Producers make their own food from sunlight. Consumers are herbivores, carnivores, or omnivores. A trophic level is a feeding step counted up from the producer.`, kind: 'tip' },
    { content: `Decomposers are part of the web and work at every level, returning what dead material contains to the soil so producers can use it again.`, kind: 'tip' },
    { content: `A food chain is one pathway. A food web is many overlapping chains, and it is the realistic picture.`, kind: 'tip' },
    { content: `Remove one species and the change travels along every arrow it touched, not just to its neighbors.`, kind: 'tip' },
    { content: `Only a small fraction of the energy passes to the next level. The rest is used up and lost as heat, which is why chains are short and top predators are few.`, kind: 'tip' },
    { content: 'Energy FLOWS one way, in as sunlight and out as heat. Energy is not recycled.', kind: 'tip' },
    { content: `Read every arrow as "gives its energy to," never as "eats." Grass → grasshopper means the grasshopper ate the grass. If you read arrows as the word "eats," you will draw every single one backwards.`, kind: 'common-error' },
    { content: `Ten-second check on any chain you write: does it start at a plant, algae, or other producer? A producer cannot eat anything. A chain that starts at a hawk, snake, or heron is backwards from end to end.`, kind: 'tip' },
    { content: `Don't say producers "make energy" or that energy is "recycled." Producers capture sunlight energy and store it in food. Energy flows one way: in as sunlight, out as heat. Only MATTER cycles — that's the next lesson.`, kind: 'vocab-note' },
    { content: `Decomposers are not a footnote at the end of the chain. Fungi and bacteria break down dead things at EVERY level — dead grass, dead frogs, droppings. Include them in the web, not off to the side.`, kind: 'gotcha' },
    { content: `When a species is removed, follow BOTH kinds of arrows: the ones pointing in (what it ate) and the ones pointing out (what ate it). Stopping at one side loses half the answer.`, kind: 'common-error' },
    { content: `Effects don't stop at the neighbors. Lose the frogs and the grass can change three arrows later. Keep tracing until the trail runs out or loops back to the producers.`, kind: 'gotcha' },
    { content: `There are few top predators because little energy is left, not because they are "stronger" or "eat less." Most energy at each step is spent moving and breathing and escapes as heat.`, kind: 'common-error' },
    { content: `An omnivore like a bear or a person sits at more than one trophic level at once — second level when eating berries, third when eating fish. Trophic level describes the meal, not the animal for life.`, kind: 'edge-case' },
  ],
};
