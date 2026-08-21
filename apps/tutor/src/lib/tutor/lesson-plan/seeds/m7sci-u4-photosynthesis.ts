/**
 * Grade 7 Science (Life Science) — Energy: Photosynthesis.
 *
 * Concept-led, built on the m7sci exemplar shape (NGSS MS-LS1-6). The
 * bookkeeping is the whole lesson: light energy is CAPTURED and STORED in
 * sugar, never created, and the atoms that become the sugar arrive from
 * carbon dioxide in the air and from water -- not from the soil, and not
 * from the light. The single idea this lesson exists to plant is that a tree
 * is built mostly out of air and water.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course, and this
 * lesson deliberately uses the WORD equation only. Do not add a balanced
 * chemical formula here; that belongs to the high-school course.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U4_PHOTOSYNTHESIS: LessonPlan = {
  id: 'evelyn.ms.m7sci.photosynthesis.v1',
  title: 'Photosynthesis',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.photosynthesis',
      standard: 'M7SCI-4.2',
      description:
        'Describe photosynthesis as the process in which a plant uses light energy to build sugar from carbon dioxide and water, name the inputs and outputs in words, and explain that the matter making up a plant comes mostly from the air and from water rather than from the soil (NGSS MS-LS1-6).',
    },
  ],
  prerequisites: ['m7sci.energy-for-living-things'],
  followUps: ['m7sci.cellular-respiration'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the question of where the material in a growing plant actually comes from.',
      script:
        'Picture the biggest tree you have ever stood next to. Now picture the seed it grew from, small enough to sit on your fingernail. All that wood came from somewhere. Most people say the soil, because that is where the roots are. But if you dig around a big old tree, the ground is not sunken in like a scooped-out bowl. The soil is basically still there. So where did the tree come from? The answer is going to sound strange the first time you hear it, and then it is going to make sense. Most of that tree came out of the air.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-photosynthesis',
      kind: 'concept',
      goal: 'Give the word equation, the location, and the two ideas students almost always get wrong: where the matter comes from and what light is for.',
      keyIdeas: [
        'WHAT PHOTOSYNTHESIS IS — a plant does not eat. It builds its own food. Photosynthesis is the process in which a plant uses light energy to build a sugar called glucose out of carbon dioxide and water. Here is the whole thing as a word equation: carbon dioxide + water + light energy → glucose + oxygen. The things on the left are the inputs. The things on the right are the outputs. Carbon dioxide comes in from the air, water comes up from the roots, and light comes from the sun.',
        'WHERE IT HAPPENS — inside the CHLOROPLASTS, the organelles found in plant cells and not in animal cells. Inside a chloroplast sits a green pigment called CHLOROPHYLL, and chlorophyll is the part that actually captures the light. Chlorophyll is why leaves look green. Photosynthesis happens mostly in leaves because that is where most of the chloroplasts are, but it happens in any green part of the plant, including a green stem. Green means chloroplasts.',
        'THE BIG ONE: A TREE IS BUILT MOSTLY OUT OF AIR AND WATER — the carbon in glucose came from carbon dioxide gas that drifted in through tiny holes in the leaves. Sugar becomes wood, bark, roots and leaves, so the mass of the tree came in through the air and up from the water, not from the soil. WRONG: "A plant gets its food from the soil." CORRECT: "A plant builds its own food out of carbon dioxide and water, using light energy." Plants do take in some minerals from the soil, and those matter, but they are a tiny part of a plant, more like vitamins than like meals.',
        'LIGHT IS THE ENERGY, NOT THE INGREDIENT — this is the piece almost everyone slides past. Light is not a material that gets built into the sugar. There are no light atoms in glucose. Every atom in the sugar arrived as carbon dioxide or as water. What the light does is supply the ENERGY for the building, and that energy ends up stored in the sugar. Notice the words carefully: the energy is captured and stored, never created. The plant does not make energy. The plant captures energy that was already streaming out of the sun and locks it into a molecule where it can be kept.',
        'OXYGEN IS A PRODUCT — oxygen gas is released as a product of photosynthesis and leaves through the same tiny holes the carbon dioxide came in through. Almost all of the oxygen in the air you are breathing right now was released by plants and by other organisms that photosynthesize.',
        'PLANTS RESPIRE TOO — a plant does not take in carbon dioxide and give out oxygen INSTEAD of breathing. Every plant cell carries out cellular respiration, all the time, day and night, to release the energy stored in the sugar it built. That is the next lesson. For now, hold onto this: photosynthesis STORES energy in sugar, and respiration RELEASES it again. A plant does both.',
      ],
      vocabulary: [
        { term: 'photosynthesis', definition: 'the process in which a plant uses light energy to build sugar from carbon dioxide and water.' },
        { term: 'chloroplast', definition: 'the plant cell organelle in which photosynthesis takes place.' },
        { term: 'chlorophyll', definition: 'the green pigment inside a chloroplast that captures light energy.' },
        { term: 'glucose', definition: 'the sugar a plant builds during photosynthesis, which stores the captured energy.' },
        { term: 'input', definition: 'a substance or form of energy that goes into a process.' },
        { term: 'output', definition: 'a substance that comes out of a process.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-where-the-mass-came-from',
      kind: 'worked_example',
      problem:
        'A gardener plants a small tree seedling in a large pot. She dries the soil first and weighs it, and she weighs the seedling. Years later the tree is far heavier than the seedling was. She takes the tree out, dries the soil again and weighs it. The soil weighs very slightly less than it did at the start, nowhere near enough to account for the tree. Where did the material in the tree come from? She watered the tree the whole time and never added fertilizer.',
      steps: [
        'List the only ways material could get into the tree: through the roots from the soil, through the roots from the water, or through the leaves from the air. There is nowhere else.',
        'Check the soil. The measurement says the soil barely changed. So the soil cannot be the source of most of the tree. That is the point of drying and weighing it twice.',
        'Check the water. Water definitely went in, and water is one of the two inputs to photosynthesis, so some of the material in the tree did arrive that way.',
        'Check the air. Carbon dioxide is the other input, and it enters through tiny holes in the leaves. Carbon dioxide gas is easy to forget because you cannot see it going in, but gas has mass just like anything else.',
        'Now follow what photosynthesis does with those two inputs: carbon dioxide + water + light energy → glucose + oxygen. The glucose is built out of the carbon dioxide and the water, and the plant turns that sugar into wood, bark, leaves and roots.',
        'WRONG way to finish this: "The tree is heavier because the sunlight got built into it." Light carries energy, and that energy is now stored in the tree, but light is not a material. The atoms came from carbon dioxide and water.',
        'So the answer is that the tree was built mostly out of carbon dioxide from the air and out of water, and the small drop in soil mass was the minerals the plant took up, which are only a tiny part of it.',
      ],
      answer:
        'Mostly from carbon dioxide in the air and from water. The soil barely lost any mass, so it cannot be the source; the plant used light energy to build the carbon dioxide and water into sugar, and the sugar became the wood and leaves of the tree.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-plant-in-the-dark',
      kind: 'worked_example',
      problem:
        'A healthy houseplant is moved into a dark closet. It is watered normally and the closet has ordinary air, so it has water and carbon dioxide the whole time. After a few weeks the plant is pale, thin and dying. Explain why, and say what is happening inside its cells while it sits in the dark.',
      steps: [
        'Check the inputs one at a time against the word equation: carbon dioxide + water + light energy → glucose + oxygen. Carbon dioxide is present. Water is present. Light energy is missing.',
        'All three inputs are needed. With no light there is no energy to power the building, so the chloroplasts stop producing glucose. The plant has stopped making new food.',
        'Ask the next question, which is the one people skip: is the plant using food while it sits there? Yes. Every cell in that plant is carrying out cellular respiration the entire time, releasing the energy stored in sugar so the plant can stay alive, move water and repair itself.',
        'So food is going out and no food is coming in. The plant lives on the sugar and starch it stored earlier, and when that store runs low it weakens and dies.',
        'The pale color has a related cause: without light the plant stops maintaining its chlorophyll, and chlorophyll is what makes leaves green.',
        'WRONG way to say this: "The plant died because it could not breathe in the closet." The closet had air, and the plant was respiring the whole time. CORRECT: "The plant died because it could not capture light energy, so it could not build new food while it kept on spending its stored food."',
      ],
      answer:
        'Light energy is one of the required inputs, so in the dark photosynthesis stops and no new glucose is built. Meanwhile the plant cells keep carrying out cellular respiration and keep spending stored sugar, so the plant uses up its food store and dies.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-inputs-and-outputs',
      kind: 'try_yourself',
      problem: 'Which list correctly gives the inputs and the outputs of photosynthesis?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Inputs: carbon dioxide, water and light energy. Outputs: glucose and oxygen.', correct: true },
        { id: 'b', text: 'Inputs: glucose and oxygen. Outputs: carbon dioxide, water and light energy.' },
        { id: 'c', text: 'Inputs: food from the soil and water. Outputs: glucose and carbon dioxide.' },
        { id: 'd', text: 'Inputs: oxygen, water and minerals. Outputs: glucose and light energy.' },
      ],
      expectedAnswer: 'Inputs: carbon dioxide, water and light energy. Outputs: glucose and oxygen.',
      hints: [
        'Say the word equation to yourself. Whatever sits on the left of the arrow went in, and whatever sits on the right came out.',
        'One of these choices has the whole equation running backward, and one of them has the plant giving out light, which nothing in this lesson does.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-source-of-mass',
      kind: 'try_yourself',
      problem:
        'An oak grows from a small seedling into a huge tree over many years. Where does most of the material in all that new wood come from?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mostly from soil pulled up through the roots.' },
        { id: 'b', text: 'Mostly from carbon dioxide taken in from the air, together with water.', correct: true },
        { id: 'c', text: 'Mostly from the sunlight that the leaves absorbed over the years.' },
        { id: 'd', text: 'Mostly from minerals in the soil, which the roots build directly into wood.' },
      ],
      expectedAnswer: 'Mostly from carbon dioxide taken in from the air, together with water.',
      hints: [
        'The ground under an old tree is not scooped out into a hollow. If the soil is still there, the tree cannot be made of it.',
        'Two of these choices point at the soil, and one of them treats light as if it were a material. Ask which choice names things that are actually built into the sugar.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plant-at-night',
      kind: 'try_yourself',
      problem: 'Which statement about a leafy green plant at night is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Photosynthesis stops because there is no light, and the plant cells carry out cellular respiration.', correct: true },
        { id: 'b', text: 'The plant carries out photosynthesis at night and cellular respiration during the day.' },
        { id: 'c', text: 'The plant never carries out cellular respiration, because that is something only animals do.' },
        { id: 'd', text: 'Everything inside the plant stops until the sun comes up again.' },
      ],
      expectedAnswer: 'Photosynthesis stops because there is no light, and the plant cells carry out cellular respiration.',
      hints: [
        'Check the inputs first. Which one of the three inputs to photosynthesis is missing after sunset?',
        'A plant builds its own food, and then it still has to spend that food to stay alive. Spending stored food is cellular respiration, and it does not switch off.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-soil-and-breathing',
      kind: 'misconception_check',
      question:
        'A student writes: "Plants get their food from the soil through their roots, and instead of breathing they take in carbon dioxide and give out oxygen." Two separate things are wrong. What are they?',
      commonErrors: [
        {
          answer: 'Plants get their food from the soil.',
          misconception:
            'Assuming that because the roots are in the soil and because we add plant food to soil, the soil must be where the plant material comes from.',
          correctsTo:
            'A plant builds its own food. Photosynthesis puts together carbon dioxide from the air and water, using light energy, to make glucose, and that sugar becomes the stem, the leaves and the wood. Most of the mass of a tree came in through the air as carbon dioxide gas. Plants do take up minerals from the soil through their roots, and a plant grows poorly without them, but minerals are a tiny fraction of a plant. Think of them as vitamins rather than as meals. The test you can run in your head: if plants were made of soil, the ground under an old forest would be a deep hollow, and it is not.',
        },
        {
          answer: 'Plants take in carbon dioxide and give out oxygen instead of breathing.',
          misconception:
            'Treating photosynthesis as the plant version of breathing, so that photosynthesis and respiration look like opposite processes done by opposite kinds of living things.',
          correctsTo:
            'Plants carry out cellular respiration too, in every cell, all the time, day and night. Photosynthesis and cellular respiration are not opposites and they are not a choice between two teams. Photosynthesis STORES energy from light in sugar. Cellular respiration RELEASES the energy from that sugar so the cell can use it. A plant does both, because building food is pointless unless you can then spend it. During the day a healthy plant photosynthesizes faster than it respires, which is why it gives out oxygen overall. At night only the respiration continues. The next lesson takes this apart in detail.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The word equation: carbon dioxide + water + light energy → glucose + oxygen.',
        'It happens in the chloroplasts, and the green pigment chlorophyll is what captures the light.',
        'Most of a plant is built out of carbon dioxide from the AIR and out of water -- not out of soil.',
        'Light supplies the ENERGY, not the atoms. Every atom in the sugar arrived as carbon dioxide or water.',
        'Energy is captured and stored in the sugar, never created.',
        'Plants carry out cellular respiration as well, all the time, day and night.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Photosynthesis' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
