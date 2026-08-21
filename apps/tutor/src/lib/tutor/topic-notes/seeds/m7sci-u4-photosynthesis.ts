/**
 * Grade 7 Science — Unit 4 CED 4.2: Photosynthesis.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.photosynthesis.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U4_PHOTOSYNTHESIS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.photosynthesis.v1',
  course: 'Grade 7 Science',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Photosynthesis',
  planId: 'evelyn.ms.m7sci.photosynthesis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.photosynthesis.v1' }],
  theory: [
    { loId: 'm7sci.photosynthesis', kind: 'framework', title: 'What photosynthesis is', content: `WHAT PHOTOSYNTHESIS IS — a plant does not eat. It builds its own food. Photosynthesis is the process in which a plant uses light energy to build a sugar called glucose out of carbon dioxide and water. Here is the whole thing as a word equation: carbon dioxide + water + light energy → glucose + oxygen. The things on the left are the inputs. The things on the right are the outputs. Carbon dioxide comes in from the air, water comes up from the roots, and light comes from the sun.` },
    { loId: 'm7sci.photosynthesis', kind: 'framework', title: 'Where it happens', content: `WHERE IT HAPPENS — inside the CHLOROPLASTS, the organelles found in plant cells and not in animal cells. Inside a chloroplast sits a green pigment called CHLOROPHYLL, and chlorophyll is the part that actually captures the light. Chlorophyll is why leaves look green. Photosynthesis happens mostly in leaves because that is where most of the chloroplasts are, but it happens in any green part of the plant, including a green stem. Green means chloroplasts.` },
    { loId: 'm7sci.photosynthesis', content: `THE BIG ONE: A TREE IS BUILT MOSTLY OUT OF AIR AND WATER — the carbon in glucose came from carbon dioxide gas that drifted in through tiny holes in the leaves. Sugar becomes wood, bark, roots and leaves, so the mass of the tree came in through the air and up from the water, not from the soil. WRONG: "A plant gets its food from the soil." CORRECT: "A plant builds its own food out of carbon dioxide and water, using light energy." Plants do take in some minerals from the soil, and those matter, but they are a tiny part of a plant, more like vitamins than like meals.` },
    { loId: 'm7sci.photosynthesis', kind: 'framework', title: 'Light is the energy, not the ingredient', content: `LIGHT IS THE ENERGY, NOT THE INGREDIENT — this is the piece almost everyone slides past. Light is not a material that gets built into the sugar. There are no light atoms in glucose. Every atom in the sugar arrived as carbon dioxide or as water. What the light does is supply the ENERGY for the building, and that energy ends up stored in the sugar. Notice the words carefully: the energy is captured and stored, never created. The plant does not make energy. The plant captures energy that was already streaming out of the sun and locks it into a molecule where it can be kept.` },
    { loId: 'm7sci.photosynthesis', kind: 'framework', title: 'Oxygen is a product', content: `OXYGEN IS A PRODUCT — oxygen gas is released as a product of photosynthesis and leaves through the same tiny holes the carbon dioxide came in through. Almost all of the oxygen in the air you are breathing right now was released by plants and by other organisms that photosynthesize.` },
    { loId: 'm7sci.photosynthesis', kind: 'framework', title: 'Plants respire too', content: `PLANTS RESPIRE TOO — a plant does not take in carbon dioxide and give out oxygen INSTEAD of breathing. Every plant cell carries out cellular respiration, all the time, day and night, to release the energy stored in the sugar it built. That is the next lesson. For now, hold onto this: photosynthesis STORES energy in sugar, and respiration RELEASES it again. A plant does both.` },
    { loId: 'm7sci.photosynthesis', kind: 'definition', title: 'photosynthesis', content: `the process in which a plant uses light energy to build sugar from carbon dioxide and water.` },
    { loId: 'm7sci.photosynthesis', kind: 'definition', title: 'chloroplast', content: 'the plant cell organelle in which photosynthesis takes place.' },
    { loId: 'm7sci.photosynthesis', kind: 'definition', title: 'chlorophyll', content: 'the green pigment inside a chloroplast that captures light energy.' },
    { loId: 'm7sci.photosynthesis', kind: 'definition', title: 'glucose', content: `the sugar a plant builds during photosynthesis, which stores the captured energy.` },
    { loId: 'm7sci.photosynthesis', kind: 'definition', title: 'input', content: 'a substance or form of energy that goes into a process.' },
    { loId: 'm7sci.photosynthesis', kind: 'definition', title: 'output', content: 'a substance that comes out of a process.' },
  ],
  methods: [
    {
      title: 'Worked where the mass came from',
      steps: [
        `List the only ways material could get into the tree: through the roots from the soil, through the roots from the water, or through the leaves from the air. There is nowhere else.`,
        `Check the soil. The measurement says the soil barely changed. So the soil cannot be the source of most of the tree. That is the point of drying and weighing it twice.`,
        `Check the water. Water definitely went in, and water is one of the two inputs to photosynthesis, so some of the material in the tree did arrive that way.`,
        `Check the air. Carbon dioxide is the other input, and it enters through tiny holes in the leaves. Carbon dioxide gas is easy to forget because you cannot see it going in, but gas has mass just like anything else.`,
        `Now follow what photosynthesis does with those two inputs: carbon dioxide + water + light energy → glucose + oxygen. The glucose is built out of the carbon dioxide and the water, and the plant turns that sugar into wood, bark, leaves and roots.`,
        `WRONG way to finish this: "The tree is heavier because the sunlight got built into it." Light carries energy, and that energy is now stored in the tree, but light is not a material. The atoms came from carbon dioxide and water.`,
        `So the answer is that the tree was built mostly out of carbon dioxide from the air and out of water, and the small drop in soil mass was the minerals the plant took up, which are only a tiny part of it.`,
      ],
      example: { problem: `A gardener plants a small tree seedling in a large pot. She dries the soil first and weighs it, and she weighs the seedling. Years later the tree is far heavier than the seedling was. She takes the tree out, dries the soil again and weighs it. The soil weighs very slightly less than it did at the start, nowhere near enough to account for the tree. Where did the material in the tree come from? She watered the tree the whole time and never added fertilizer.`, solution: `Mostly from carbon dioxide in the air and from water. The soil barely lost any mass, so it cannot be the source; the plant used light energy to build the carbon dioxide and water into sugar, and the sugar became the wood and leaves of the tree.` },
      relatedLoIds: ['m7sci.photosynthesis'],
    },
    {
      title: 'Worked plant in the dark',
      steps: [
        `Check the inputs one at a time against the word equation: carbon dioxide + water + light energy → glucose + oxygen. Carbon dioxide is present. Water is present. Light energy is missing.`,
        `All three inputs are needed. With no light there is no energy to power the building, so the chloroplasts stop producing glucose. The plant has stopped making new food.`,
        `Ask the next question, which is the one people skip: is the plant using food while it sits there? Yes. Every cell in that plant is carrying out cellular respiration the entire time, releasing the energy stored in sugar so the plant can stay alive, move water and repair itself.`,
        `So food is going out and no food is coming in. The plant lives on the sugar and starch it stored earlier, and when that store runs low it weakens and dies.`,
        `The pale color has a related cause: without light the plant stops maintaining its chlorophyll, and chlorophyll is what makes leaves green.`,
        `WRONG way to say this: "The plant died because it could not breathe in the closet." The closet had air, and the plant was respiring the whole time. CORRECT: "The plant died because it could not capture light energy, so it could not build new food while it kept on spending its stored food."`,
      ],
      example: { problem: `A healthy houseplant is moved into a dark closet. It is watered normally and the closet has ordinary air, so it has water and carbon dioxide the whole time. After a few weeks the plant is pale, thin and dying. Explain why, and say what is happening inside its cells while it sits in the dark.`, solution: `Light energy is one of the required inputs, so in the dark photosynthesis stops and no new glucose is built. Meanwhile the plant cells keep carrying out cellular respiration and keep spending stored sugar, so the plant uses up its food store and dies.` },
      relatedLoIds: ['m7sci.photosynthesis'],
    },
  ],
  pointers: [
    { content: `Students often say "Plants get their food from the soil." — A plant builds its own food. Photosynthesis puts together carbon dioxide from the air and water, using light energy, to make glucose, and that sugar becomes the stem, the leaves and the wood. Most of the mass of a tree came in through the air as carbon dioxide gas. Plants do take up minerals from the soil through their roots, and a plant grows poorly without them, but minerals are a tiny fraction of a plant. Think of them as vitamins rather than as meals. The test you can run in your head: if plants were made of soil, the ground under an old forest would be a deep hollow, and it is not.`, kind: 'common-error' },
    { content: `Students often say "Plants take in carbon dioxide and give out oxygen instead of breathing." — Plants carry out cellular respiration too, in every cell, all the time, day and night. Photosynthesis and cellular respiration are not opposites and they are not a choice between two teams. Photosynthesis STORES energy from light in sugar. Cellular respiration RELEASES the energy from that sugar so the cell can use it. A plant does both, because building food is pointless unless you can then spend it. During the day a healthy plant photosynthesizes faster than it respires, which is why it gives out oxygen overall. At night only the respiration continues. The next lesson takes this apart in detail.`, kind: 'common-error' },
    { content: 'The word equation: carbon dioxide + water + light energy → glucose + oxygen.', kind: 'tip' },
    { content: `It happens in the chloroplasts, and the green pigment chlorophyll is what captures the light.`, kind: 'tip' },
    { content: `Most of a plant is built out of carbon dioxide from the AIR and out of water -- not out of soil.`, kind: 'tip' },
    { content: `Light supplies the ENERGY, not the atoms. Every atom in the sugar arrived as carbon dioxide or water.`, kind: 'tip' },
    { content: 'Energy is captured and stored in the sugar, never created.', kind: 'tip' },
    { content: 'Plants carry out cellular respiration as well, all the time, day and night.', kind: 'tip' },
    { content: `Don't write "the plant makes energy." It captures light energy and stores it in glucose. Say "builds sugar" or "stores energy," never "makes energy" or "creates energy."`, kind: 'vocab-note' },
    { content: `Light energy is an input, but it is NOT a material. There are no light atoms in glucose. Every atom in the sugar came from carbon dioxide or water. So don't answer "the tree is heavy because sunlight went into it."`, kind: 'common-error' },
    { content: `"Plant food" from the store is not food. Food for a plant is the glucose it builds itself. Soil minerals are more like vitamins — real but tiny. If plants were made of soil, the ground under an old forest would be a deep pit.`, kind: 'common-error' },
    { content: `Chloroplast vs. chlorophyll: the chloroplast is the organelle (the room), chlorophyll is the green pigment inside it that catches the light. Two different words, one letter apart — check which one your sentence needs.`, kind: 'vocab-note' },
    { content: `Photosynthesis isn't only in leaves. Any green part — a green stem, an unripe fruit — has chloroplasts and does it too. Green means chloroplasts. Roots and brown bark do not photosynthesize.`, kind: 'edge-case' },
    { content: `A plant in the dark does not stop living — it stops FEEDING. Its cells keep respiring and spending stored sugar the whole time. Don't say it "couldn't breathe"; there was plenty of air.`, kind: 'gotcha' },
    { content: `Photosynthesis and respiration are not opposite teams. Plants do BOTH, day and night. During the day photosynthesis runs faster, so oxygen goes out overall; at night only respiration continues.`, kind: 'gotcha' },
    { content: `Quick self-check on the equation: 3 things go in (carbon dioxide, water, light energy), 2 come out (glucose, oxygen). Oxygen is an OUTPUT, never an input. Writing oxygen on the left is the most common slip.`, kind: 'tip' },
  ],
};
