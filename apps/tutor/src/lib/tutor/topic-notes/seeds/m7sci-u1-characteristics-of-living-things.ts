/**
 * Grade 7 Science — Unit 1 CED 1.1: What Makes Something Alive.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.characteristics-of-living-things.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U1_CHARACTERISTICS_OF_LIVING_THINGS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.characteristics-of-living-things.v1',
  course: 'Grade 7 Science',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'What Makes Something Alive',
  planId: 'evelyn.ms.m7sci.characteristics-of-living-things.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.characteristics-of-living-things.v1' }],
  theory: [
    { loId: 'm7sci.characteristics-of-living-things', content: `LIFE IS A CHECKLIST, NOT A SINGLE TEST -- this is the whole lesson. No single item proves something is alive. A river moves. A crystal in salty water gets bigger. A fire grows, uses fuel and gives off waste. Each of those copies ONE item and fails the rest. So the question is never "does it move?" It is "which items on the list does this thing fail?" Something is alive only if it does essentially ALL of them.` },
    { loId: 'm7sci.characteristics-of-living-things', content: `MADE OF CELLS, AND USES ENERGY -- every living thing is one cell or is built from cells. Cells are the smallest pieces that count as alive, and nothing that lacks them is alive. Living things also take in energy and materials and use them: a plant captures light energy and makes its own food, an animal eats food that another living thing made. Then both of them release the energy stored in that food to run their bodies. Energy is not created by anything alive. It is taken in, stored, and released.` },
    { loId: 'm7sci.characteristics-of-living-things', content: `GROWS AND DEVELOPS, AND REPRODUCES -- living things get bigger from the INSIDE, by making more cells, and they change form on a schedule: a seed becomes a seedling and then a tree, a tadpole becomes a frog. That is different from a crystal or an icicle, which only piles more material onto its outside. Living things also reproduce, passing instructions to offspring so the young resemble the parents. Read that one carefully: reproducing is something a KIND of living thing does. A single bee that never lays an egg is still alive.` },
    { loId: 'm7sci.characteristics-of-living-things', content: `RESPONDS TO STIMULI, AND KEEPS AN INTERNAL BALANCE -- these two sound alike and are not the same. RESPONDING means reacting to something outside: a plant leans toward the window, you yank your hand off a hot pan, a worm crawls away from light. HOMEOSTASIS is the bigger claim -- holding conditions INSIDE the body steady while the outside changes. Your inside temperature stays close to 98.6 degrees Fahrenheit whether you are in a cold gym or a hot parking lot, because you shiver or you sweat. Reacting is the outside test. Holding steady inside is the harder one.` },
    { loId: 'm7sci.characteristics-of-living-things', content: `POPULATIONS ADAPT OVER GENERATIONS -- over long stretches of time, a group of one kind of living thing can change, because individuals born with helpful inherited traits tend to survive and leave more offspring, and those traits become more common in the group. Say that at the right level. An individual does NOT adapt during its own life, and no living thing grows a trait because it needs one or wants one. WRONG: "The rabbits grew thicker fur because the winters got colder." CORRECT: "Rabbits that were already born with thicker fur survived the cold winters more often, so over many generations thick fur became common in that population."` },
    { loId: 'm7sci.characteristics-of-living-things', content: `THE HARD CASES ARE THE POINT -- a dry seed and a hibernating ground squirrel look like they are doing nothing. They are DORMANT, which means slowed almost to a stop, not dead. They are still made of cells, still using a trickle of energy, and still ready to grow. Viruses are the genuinely hard one, and scientists disagree about them: a virus has no cells of its own and cannot make copies of itself unless it gets inside a living cell and uses that cell. Because of that, most scientists file viruses as not living, but the argument is real and it is fine to know that it is unsettled.` },
    { loId: 'm7sci.characteristics-of-living-things', kind: 'definition', title: 'organism', content: 'any individual living thing, from a single bacterium to a whale.' },
    { loId: 'm7sci.characteristics-of-living-things', kind: 'definition', title: 'cell', content: `the smallest unit that counts as living; every organism is one cell or is built from cells.` },
    { loId: 'm7sci.characteristics-of-living-things', kind: 'definition', title: 'stimulus', content: `a change outside or inside an organism that the organism reacts to, such as light, heat or touch.` },
    { loId: 'm7sci.characteristics-of-living-things', kind: 'definition', title: 'homeostasis', content: `holding conditions inside the body steady, such as temperature or water, while outside conditions change.` },
    { loId: 'm7sci.characteristics-of-living-things', kind: 'definition', title: 'dormant', content: `alive but slowed almost to a stop, like a dry seed or a hibernating animal, and able to become active again.` },
  ],
  methods: [
    {
      title: 'Worked campfire',
      steps: [
        `Do not argue with the four things the student noticed. A fire really does get bigger, really does use fuel, really does spread, and really does react to wind. Arguing about those is a dead end.`,
        `Instead, run the tests the student skipped. Start with cells. Take any piece of the flame and there are no cells in it, because a flame is hot glowing gas, not a body built from cells. That is a hard fail on the first item.`,
        `Check growth the careful way. A living thing gets bigger by making more cells inside itself. A fire gets bigger only when someone hands it more fuel from outside. Same word, different process.`,
        `Check reproduction. When a fire spreads to the next log, nothing is passed on. There are no instructions, no offspring, and the second flame is not a young version of the first one. Spreading is not reproducing.`,
        `Check internal balance. A fire holds nothing steady. Take away the wood and it goes out immediately. A living thing works to keep its inside conditions in range.`,
        `Count it up: the fire imitates energy use, size increase and reaction, and it fails cells, real growth, reproduction and internal balance. Failing that much of the list settles it.`,
      ],
      example: { problem: `A campfire grows when you add wood, uses up fuel and oxygen, gives off heat, smoke and ash, spreads to a second log nearby, and flares up when the wind blows on it. A student says that is energy use, growth, reproduction and response, so the fire is alive. Decide whether the fire is alive and say exactly which tests it fails.`, solution: `The fire is not alive. It has no cells, it gets bigger only from fuel added outside instead of by making cells, it does not reproduce because spreading passes on no instructions, and it keeps nothing about itself steady. Imitating three items on the list does not outweigh failing the rest.` },
      relatedLoIds: ['m7sci.characteristics-of-living-things'],
    },
    {
      title: 'Worked seed and stream',
      steps: [
        `Notice the trap first. The stream is the one that moves and changes, and the seed is the one that does nothing. If movement decided this, the stream would win. Movement is not on the checklist as a test all by itself.`,
        `Run the list on the stream. Is it made of cells? No, it is water, sand and dissolved minerals. Does it take in food and release the energy stored in it? No. Does it get bigger by making cells? No -- it gets wider only because more rain fell into it. Does it produce offspring that resemble it? No. Does it hold its own conditions steady? No, it goes up and down with the weather. The stream fails every item.`,
        `Now run the same list on the seed. Made of cells? Yes -- inside it is a tiny young plant made of cells, packed with stored food.`,
        `Does it use energy? Yes, but very slowly. The seed is dormant, which means its activity is slowed almost to a stop, not switched off.`,
        `Can it grow and develop? Yes. Give it water, warmth and air and it will grow roots and leaves and become a bean plant, which means the instructions inside it are intact.`,
        `Does it come from reproduction and can it reproduce as a kind? Yes -- a parent bean plant made it, and it will make seeds of its own.`,
        `So the seed passes and the stream fails, which is the opposite of what activity alone suggested. That is why the checklist exists.`,
      ],
      example: { problem: `Two things sit in front of you. One is a dry bean seed that has been in a drawer for a year and has not moved or changed at all. The other is the stream behind the school, which moves all day, carries sand along, gets wider after rain and narrower in summer. Which one is alive, and how do you defend the call?`, solution: `The seed is alive and the stream is not. The seed is made of cells, uses energy slowly while dormant, and will grow and develop into a bean plant. The stream moves and changes size, but it has no cells, no energy use of its own, no growth by cell division and no offspring. Being still is not the same as being dead.` },
      relatedLoIds: ['m7sci.characteristics-of-living-things'],
    },
  ],
  pointers: [
    { content: `Students often say "A fire is alive because it grows, uses fuel and spreads." — A fire copies a few items and fails the ones that matter most. It is not made of cells, so it fails the first test outright. It gets bigger only when fuel is added from outside, while a living thing gets bigger by making more cells inside itself. When a fire spreads, nothing is passed on to the new flame, so that is not reproduction. And it keeps nothing about itself steady. WRONG: "It grows and uses fuel, so it is alive." CORRECT: "It imitates a few items and fails cells, real growth, reproduction and internal balance, so it is not alive."`, kind: 'common-error' },
    { content: `Students often say "A seed is not alive because it is not doing anything." — Being still is not being dead. A dry seed is DORMANT: it is made of cells, it holds a tiny young plant with intact instructions, and it uses a small trickle of energy while it waits. Add water, warmth and air and it grows into a plant, which nothing dead can do. The same goes for a hibernating ground squirrel and for a tree in winter with no leaves. Activity is a clue, never the test -- run the whole checklist instead.`, kind: 'common-error' },
    { content: `The checklist: made of cells, obtains and uses energy, grows and develops, reproduces, responds to stimuli, keeps an internal balance, and adapts as a population over generations.`, kind: 'tip' },
    { content: `Something is alive only if it does essentially ALL of these. One match proves nothing, so hunt for the items a thing FAILS.`, kind: 'tip' },
    { content: `Moving is not a test for life -- a river moves and is not alive, and an oak tree stays put and is.`, kind: 'tip' },
    { content: `Living things grow from the inside by making more cells. A crystal or an icicle only piles material onto its outside.`, kind: 'tip' },
    { content: `Responding means reacting to something outside. Keeping an internal balance means holding conditions inside steady while the outside changes.`, kind: 'tip' },
    { content: `Populations adapt over generations because helpful inherited traits become more common. No individual adapts during its own life, and nothing grows a trait because it needs one.`, kind: 'tip' },
    { content: `A dormant seed or a hibernating animal is alive, just slowed almost to a stop. Viruses are a genuinely unsettled case, because they have no cells of their own and cannot copy themselves without a host cell.`, kind: 'tip' },
    { content: `When you decide something is nonliving, name the items it FAILS, not the ones it matches. "The fire grows and uses fuel" is not an answer. "No cells, no reproduction, no internal balance" is.`, kind: 'tip' },
    { content: `Don't use "grows" loosely. Living things grow from the inside by making more cells. A crystal, an icicle, or a fire only gets bigger by piling on material from outside. Say which kind of getting bigger you mean.`, kind: 'vocab-note' },
    { content: `Moving is not on the checklist. A river moves all day and is not alive; an oak tree never moves from its spot and is. Never write "it's alive because it moves" or "it's dead because it's still."`, kind: 'common-error' },
    { content: `Responding and homeostasis are not the same. Shivering when cold air hits you = responding to a stimulus. Your inside staying near 98.6°F while the gym is freezing = homeostasis. Outside reaction vs. inside steadiness.`, kind: 'vocab-note' },
    { content: `Living things don't MAKE energy. They take it in (light or food), store it, and release it. Write "releases the energy stored in food," never "produces energy."`, kind: 'vocab-note' },
    { content: `Dormant is not dead. A dry seed in a drawer and a hibernating squirrel still have cells, still use a trickle of energy, and can start up again. Add water and warmth to a seed and it grows — nothing dead does that.`, kind: 'edge-case' },
    { content: `Say adaptation at the population level. WRONG: "The rabbits grew thicker fur because winters got colder." CORRECT: "Rabbits born with thicker fur survived more often, so thick fur became common over generations." No animal grows a trait because it needs one.`, kind: 'common-error' },
    { content: `Reproduction is a test for a KIND of organism, not for one individual. A worker bee that never lays an egg, a mule, and an elderly person are all alive. Don't cross a thing off the list for that.`, kind: 'edge-case' },
  ],
};
