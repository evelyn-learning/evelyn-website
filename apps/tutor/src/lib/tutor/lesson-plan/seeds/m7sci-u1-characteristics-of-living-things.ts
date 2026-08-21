/**
 * Grade 7 Science (Life Science) -- Unit 1: What Makes Something Alive.
 *
 * The opening plan of the m7sci course (NGSS MS-LS1-1). The skill is not
 * reciting the characteristics of life; it is applying the WHOLE list to a
 * hard case. Almost every wrong answer here comes from testing one item and
 * stopping: a river moves, a crystal grows, a fire spreads and eats fuel.
 * The reverse error matters just as much -- a dry seed does nothing visible
 * for a year and is fully alive.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U1_CHARACTERISTICS_OF_LIVING_THINGS: LessonPlan = {
  id: 'evelyn.ms.m7sci.characteristics-of-living-things.v1',
  title: 'What Makes Something Alive',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.characteristics-of-living-things',
      standard: 'M7SCI-1.1',
      description:
        'Use the characteristics shared by all living things -- made of cells, obtains and uses energy, grows and develops, reproduces, responds to stimuli, and maintains internal balance -- to decide whether something is alive, and explain why one characteristic on its own is never enough (NGSS MS-LS1-1).',
    },
  ],
  prerequisites: [],
  followUps: ['m7sci.scientific-investigation'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "is it alive?" is a real decision that a feeling cannot settle.',
      script:
        'Walk out to the pond behind the school and point at four things: a frog, the water moving over the rocks, a patch of green scum on the surface, and a stick. Most people would sort those in about one second. Now try it on harder ones. Is a dry bean seed in a kitchen drawer alive? Is the mold growing on old bread alive? Is a campfire alive, when it grows, eats wood and puts out smoke? You cannot settle these by how they look or by whether they move. You need a list of tests that works on anything, and you need to run the whole list. Today we build that list.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-characteristics-of-life',
      kind: 'concept',
      goal: 'Build the full checklist, separate response from homeostasis, place adaptation at the population level, and set up the dormancy and virus edge cases.',
      keyIdeas: [
        'LIFE IS A CHECKLIST, NOT A SINGLE TEST -- this is the whole lesson. No single item proves something is alive. A river moves. A crystal in salty water gets bigger. A fire grows, uses fuel and gives off waste. Each of those copies ONE item and fails the rest. So the question is never "does it move?" It is "which items on the list does this thing fail?" Something is alive only if it does essentially ALL of them.',
        'MADE OF CELLS, AND USES ENERGY -- every living thing is one cell or is built from cells. Cells are the smallest pieces that count as alive, and nothing that lacks them is alive. Living things also take in energy and materials and use them: a plant captures light energy and makes its own food, an animal eats food that another living thing made. Then both of them release the energy stored in that food to run their bodies. Energy is not created by anything alive. It is taken in, stored, and released.',
        'GROWS AND DEVELOPS, AND REPRODUCES -- living things get bigger from the INSIDE, by making more cells, and they change form on a schedule: a seed becomes a seedling and then a tree, a tadpole becomes a frog. That is different from a crystal or an icicle, which only piles more material onto its outside. Living things also reproduce, passing instructions to offspring so the young resemble the parents. Read that one carefully: reproducing is something a KIND of living thing does. A single bee that never lays an egg is still alive.',
        'RESPONDS TO STIMULI, AND KEEPS AN INTERNAL BALANCE -- these two sound alike and are not the same. RESPONDING means reacting to something outside: a plant leans toward the window, you yank your hand off a hot pan, a worm crawls away from light. HOMEOSTASIS is the bigger claim -- holding conditions INSIDE the body steady while the outside changes. Your inside temperature stays close to 98.6 degrees Fahrenheit whether you are in a cold gym or a hot parking lot, because you shiver or you sweat. Reacting is the outside test. Holding steady inside is the harder one.',
        'POPULATIONS ADAPT OVER GENERATIONS -- over long stretches of time, a group of one kind of living thing can change, because individuals born with helpful inherited traits tend to survive and leave more offspring, and those traits become more common in the group. Say that at the right level. An individual does NOT adapt during its own life, and no living thing grows a trait because it needs one or wants one. WRONG: "The rabbits grew thicker fur because the winters got colder." CORRECT: "Rabbits that were already born with thicker fur survived the cold winters more often, so over many generations thick fur became common in that population."',
        'THE HARD CASES ARE THE POINT -- a dry seed and a hibernating ground squirrel look like they are doing nothing. They are DORMANT, which means slowed almost to a stop, not dead. They are still made of cells, still using a trickle of energy, and still ready to grow. Viruses are the genuinely hard one, and scientists disagree about them: a virus has no cells of its own and cannot make copies of itself unless it gets inside a living cell and uses that cell. Because of that, most scientists file viruses as not living, but the argument is real and it is fine to know that it is unsettled.',
      ],
      vocabulary: [
        { term: 'organism', definition: 'any individual living thing, from a single bacterium to a whale.' },
        { term: 'cell', definition: 'the smallest unit that counts as living; every organism is one cell or is built from cells.' },
        { term: 'stimulus', definition: 'a change outside or inside an organism that the organism reacts to, such as light, heat or touch.' },
        { term: 'homeostasis', definition: 'holding conditions inside the body steady, such as temperature or water, while outside conditions change.' },
        { term: 'dormant', definition: 'alive but slowed almost to a stop, like a dry seed or a hibernating animal, and able to become active again.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-campfire',
      kind: 'worked_example',
      problem:
        'A campfire grows when you add wood, uses up fuel and oxygen, gives off heat, smoke and ash, spreads to a second log nearby, and flares up when the wind blows on it. A student says that is energy use, growth, reproduction and response, so the fire is alive. Decide whether the fire is alive and say exactly which tests it fails.',
      steps: [
        'Do not argue with the four things the student noticed. A fire really does get bigger, really does use fuel, really does spread, and really does react to wind. Arguing about those is a dead end.',
        'Instead, run the tests the student skipped. Start with cells. Take any piece of the flame and there are no cells in it, because a flame is hot glowing gas, not a body built from cells. That is a hard fail on the first item.',
        'Check growth the careful way. A living thing gets bigger by making more cells inside itself. A fire gets bigger only when someone hands it more fuel from outside. Same word, different process.',
        'Check reproduction. When a fire spreads to the next log, nothing is passed on. There are no instructions, no offspring, and the second flame is not a young version of the first one. Spreading is not reproducing.',
        'Check internal balance. A fire holds nothing steady. Take away the wood and it goes out immediately. A living thing works to keep its inside conditions in range.',
        'Count it up: the fire imitates energy use, size increase and reaction, and it fails cells, real growth, reproduction and internal balance. Failing that much of the list settles it.',
      ],
      answer:
        'The fire is not alive. It has no cells, it gets bigger only from fuel added outside instead of by making cells, it does not reproduce because spreading passes on no instructions, and it keeps nothing about itself steady. Imitating three items on the list does not outweigh failing the rest.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-seed-and-stream',
      kind: 'worked_example',
      problem:
        'Two things sit in front of you. One is a dry bean seed that has been in a drawer for a year and has not moved or changed at all. The other is the stream behind the school, which moves all day, carries sand along, gets wider after rain and narrower in summer. Which one is alive, and how do you defend the call?',
      steps: [
        'Notice the trap first. The stream is the one that moves and changes, and the seed is the one that does nothing. If movement decided this, the stream would win. Movement is not on the checklist as a test all by itself.',
        'Run the list on the stream. Is it made of cells? No, it is water, sand and dissolved minerals. Does it take in food and release the energy stored in it? No. Does it get bigger by making cells? No -- it gets wider only because more rain fell into it. Does it produce offspring that resemble it? No. Does it hold its own conditions steady? No, it goes up and down with the weather. The stream fails every item.',
        'Now run the same list on the seed. Made of cells? Yes -- inside it is a tiny young plant made of cells, packed with stored food.',
        'Does it use energy? Yes, but very slowly. The seed is dormant, which means its activity is slowed almost to a stop, not switched off.',
        'Can it grow and develop? Yes. Give it water, warmth and air and it will grow roots and leaves and become a bean plant, which means the instructions inside it are intact.',
        'Does it come from reproduction and can it reproduce as a kind? Yes -- a parent bean plant made it, and it will make seeds of its own.',
        'So the seed passes and the stream fails, which is the opposite of what activity alone suggested. That is why the checklist exists.',
      ],
      answer:
        'The seed is alive and the stream is not. The seed is made of cells, uses energy slowly while dormant, and will grow and develop into a bean plant. The stream moves and changes size, but it has no cells, no energy use of its own, no growth by cell division and no offspring. Being still is not the same as being dead.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-river-movement',
      kind: 'try_yourself',
      problem:
        'A student argues that a river is alive because it moves on its own, carries material along and gets bigger and smaller through the year. What is the best reason a scientist would say the river is not alive?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The river does not really move, because gravity is what moves it rather than the river itself' },
        { id: 'b', text: 'The river is not alive because nothing that lacks a brain can be counted as living' },
        { id: 'c', text: 'The river is not alive because it never gets bigger, since a change in width is not real growth' },
        { id: 'd', text: 'Movement is not a test for life by itself, and the river has no cells, uses no food for energy and produces no offspring', correct: true },
      ],
      expectedAnswer: 'Movement is not a test for life by itself, and the river has no cells, uses no food for energy and produces no offspring',
      hints: [
        'Do not spend your effort arguing about the one thing the student got right. Ask which items on the checklist the river never even attempts.',
        'Start every hard case with the first item on the list: is this thing made of cells?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-crystal-growth',
      kind: 'try_yourself',
      problem:
        'A salt crystal hanging in a jar of salty water gets steadily larger week after week. A bean seedling in a pot also gets larger week after week. Which statement gives the real difference between the two kinds of getting larger?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The seedling grows because it takes in water, and the crystal does not take in anything' },
        { id: 'b', text: 'The seedling grows faster than the crystal, and living things always grow faster than nonliving things' },
        { id: 'c', text: 'The crystal is not really getting larger, because its shape stays the same the whole time' },
        { id: 'd', text: 'The seedling grows because it makes more cells inside itself, while the crystal only collects more material onto its outside', correct: true },
      ],
      expectedAnswer: 'The seedling grows because it makes more cells inside itself, while the crystal only collects more material onto its outside',
      hints: [
        'Both things really do get bigger, so the answer cannot be that one of them is not growing. Ask WHERE the new material ends up.',
        'Think about what a living thing is built from. If something gets bigger by adding more of that building unit, that is growth in the biological sense.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-response-vs-homeostasis',
      kind: 'try_yourself',
      problem:
        'A student walks out of a warm classroom into freezing air. Within a minute the student is shivering, and a thermometer shows that the temperature inside the student is still close to 98.6 degrees Fahrenheit. Which characteristic of living things does the steady inside temperature show best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Growth and development, because shivering uses energy that would otherwise be spent making new cells' },
        { id: 'b', text: 'Response to stimuli only, because shivering is just a reaction to cold air and nothing inside is being held steady' },
        { id: 'c', text: 'Maintaining internal balance, because a condition inside the body is being held steady while the outside changes', correct: true },
        { id: 'd', text: 'Made of cells, because only something built from cells is able to feel cold' },
      ],
      expectedAnswer: 'Maintaining internal balance, because a condition inside the body is being held steady while the outside changes',
      hints: [
        'Compare the two temperatures in the problem. The outside temperature dropped a great deal. What did the inside temperature do?',
        'Reacting to something outside is one characteristic. Holding the inside steady while the outside swings is the stronger, more specific one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fire-and-dormancy',
      kind: 'misconception_check',
      question:
        'A student writes: "A fire is alive, because it grows, it eats fuel and it makes more fires. A seed in a packet is not alive, because it just sits there and does nothing." Both halves of that are wrong. Explain each one.',
      commonErrors: [
        {
          answer: 'A fire is alive because it grows, uses fuel and spreads.',
          misconception:
            'Checking two or three items on the list, finding matches, and stopping there instead of running the rest of the list.',
          correctsTo:
            'A fire copies a few items and fails the ones that matter most. It is not made of cells, so it fails the first test outright. It gets bigger only when fuel is added from outside, while a living thing gets bigger by making more cells inside itself. When a fire spreads, nothing is passed on to the new flame, so that is not reproduction. And it keeps nothing about itself steady. WRONG: "It grows and uses fuel, so it is alive." CORRECT: "It imitates a few items and fails cells, real growth, reproduction and internal balance, so it is not alive."',
        },
        {
          answer: 'A seed is not alive because it is not doing anything.',
          misconception:
            'Using visible activity as the test for life, so that anything still or quiet gets counted as nonliving.',
          correctsTo:
            'Being still is not being dead. A dry seed is DORMANT: it is made of cells, it holds a tiny young plant with intact instructions, and it uses a small trickle of energy while it waits. Add water, warmth and air and it grows into a plant, which nothing dead can do. The same goes for a hibernating ground squirrel and for a tree in winter with no leaves. Activity is a clue, never the test -- run the whole checklist instead.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The checklist: made of cells, obtains and uses energy, grows and develops, reproduces, responds to stimuli, keeps an internal balance, and adapts as a population over generations.',
        'Something is alive only if it does essentially ALL of these. One match proves nothing, so hunt for the items a thing FAILS.',
        'Moving is not a test for life -- a river moves and is not alive, and an oak tree stays put and is.',
        'Living things grow from the inside by making more cells. A crystal or an icicle only piles material onto its outside.',
        'Responding means reacting to something outside. Keeping an internal balance means holding conditions inside steady while the outside changes.',
        'Populations adapt over generations because helpful inherited traits become more common. No individual adapts during its own life, and nothing grows a trait because it needs one.',
        'A dormant seed or a hibernating animal is alive, just slowed almost to a stop. Viruses are a genuinely unsettled case, because they have no cells of their own and cannot copy themselves without a host cell.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'What Makes Something Alive' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
