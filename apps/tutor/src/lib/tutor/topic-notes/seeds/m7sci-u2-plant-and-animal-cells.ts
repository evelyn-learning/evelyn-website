/**
 * Grade 7 Science — Unit 2 CED 2.2: Plant Cells & Animal Cells.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.plant-and-animal-cells.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U2_PLANT_AND_ANIMAL_CELLS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.plant-and-animal-cells.v1',
  course: 'Grade 7 Science',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Plant Cells & Animal Cells',
  planId: 'evelyn.ms.m7sci.plant-and-animal-cells.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.plant-and-animal-cells.v1' }],
  theory: [
    { loId: 'm7sci.plant-and-animal-cells', kind: 'framework', title: 'Most of the list is shared', content: `MOST OF THE LIST IS SHARED — plant cells and animal cells both have a CELL MEMBRANE around the outside, a NUCLEUS holding the instructions, CYTOPLASM filling the inside, MITOCHONDRIA that release the energy stored in food, and RIBOSOMES that build proteins. Both kinds also have vacuoles for storage. That is a lot of sameness, and it is the first thing to notice.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'framework', title: 'The plant-only list is short', content: `THE PLANT-ONLY LIST IS SHORT — three things. A CELL WALL, a rigid layer sitting OUTSIDE the membrane that gives support. CHLOROPLASTS, the green parts that capture light energy and use it to make food. And ONE LARGE CENTRAL VACUOLE, a single big water-filled space taking up much of the middle. Animal cells have none of those three. Animal cells do have vacuoles, but only small ones, so it is the SIZE and the single large one that mark a plant.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'framework', title: 'The decision procedure, and this is the real skill', content: `THE DECISION PROCEDURE, AND THIS IS THE REAL SKILL — when you are asked which kind of cell a description shows, go down the list of parts and cross off everything that is shared. A nucleus tells you nothing. A membrane tells you nothing. Mitochondria tell you nothing. Only the plant-only parts can decide it: find a wall, chloroplasts or one large central vacuole and you have a plant cell; find none of the three and you have an animal cell. Shared parts are never evidence.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'framework', title: 'A plant cell has both a wall and a membrane', content: `A PLANT CELL HAS BOTH A WALL AND A MEMBRANE — these are two different layers, not two names for one thing. The membrane is thin, flexible, and controls what enters and leaves. The wall is rigid, sits outside the membrane, and does not choose what passes through. WRONG: "A plant cell has a wall instead of a membrane." CORRECT: "A plant cell has a membrane, and a wall outside it." An animal cell has the membrane and stops there.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'framework', title: 'Plant cells have mitochondria too', content: `PLANT CELLS HAVE MITOCHONDRIA TOO — chloroplasts do not replace them. Chloroplasts capture light and make food; mitochondria then release the energy from that food so the plant can grow and repair itself. A plant makes its own food and still has to spend it, the same way you spend the food you eat. So mitochondria are useless as evidence, because both kinds of cell have them.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'framework', title: 'A wider picture, briefly', content: `A WIDER PICTURE, BRIEFLY — plant and animal cells are both EUKARYOTIC, meaning their DNA is kept inside a nucleus. Bacteria are PROKARYOTIC: they have DNA, ribosomes, a membrane and usually a wall, but no nucleus at all, so their DNA sits loose in the cytoplasm. That matters here for one reason. A cell wall does not prove plant. Bacteria have walls, and they are not plants.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'definition', title: 'cell membrane', content: `the thin flexible boundary, found in every cell, that controls what enters and leaves.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'definition', title: 'cell wall', content: `the rigid layer outside the membrane of a plant cell that gives shape and support.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'definition', title: 'chloroplast', content: 'the green plant-only part that captures light energy and uses it to make food.' },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'definition', title: 'central vacuole', content: `the single large water-filled space that fills much of a plant cell; animal cells have only small vacuoles.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'definition', title: 'eukaryotic', content: `describing a cell that keeps its DNA inside a nucleus; plant and animal cells are both eukaryotic.` },
    { loId: 'm7sci.plant-and-animal-cells', kind: 'definition', title: 'prokaryotic', content: `describing a cell with no nucleus, so its DNA sits loose in the cytoplasm; bacteria are prokaryotic.` },
  ],
  methods: [
    {
      title: 'Worked cross off the shared parts',
      steps: [
        `Take the list one item at a time and label each part shared or plant-only. That labeling IS the method.`,
        `A thin outer boundary is the cell membrane. Every cell has one, so cross it off. It decides nothing.`,
        'A nucleus is in both plant and animal cells. Cross it off.',
        'Jelly filling the inside is cytoplasm, in both. Cross it off.',
        `Many small oval structures scattered through the jelly are mitochondria, which both kinds have. Cross that off too, even though it feels like a clue. It is not one.`,
        `Several small storage bubbles are small vacuoles. Animal cells do have these, so this is not evidence either. Only ONE LARGE central vacuole would have pointed to a plant.`,
        `Every single item on her list got crossed off, which means nothing she saw could decide it. So look at what is ABSENT: no stiff outer layer means no cell wall, and nothing green means no chloroplasts. Two of the three plant-only parts are missing.`,
        `That absence is the evidence. This is an animal cell, which fits, since she took it from her own cheek.`,
      ],
      example: { problem: `A student scrapes a few cells from the inside of her cheek and writes down everything she can see: a thin outer boundary, a nucleus near the middle, jelly filling the inside, many small oval structures scattered through the jelly, and several small storage bubbles. She sees no stiff outer layer and nothing green. Which kind of cell is this, and which observation actually decided it?`, solution: `An animal cell. None of the parts she listed could decide it, because all of them are shared; the missing cell wall and missing chloroplasts are what settled the question.` },
      relatedLoIds: ['m7sci.plant-and-animal-cells'],
    },
    {
      title: 'Worked wall versus membrane',
      steps: [
        `Start with the part that is correct, because there is one. Cell walls really do give a plant its stiffness. Rigid walls stacked side by side let a celery stalk stand up with no bones in it at all.`,
        `Now test the jump to animals. Animal cells have a membrane and no wall. Your arm holds its shape for completely different reasons: bones inside it, and tough connective tissue holding cells together. The support is built at the body level, not at the edge of each cell.`,
        `Check why that matters. A wall is rigid, so a walled cell cannot change shape much. Your white blood cells squeeze through narrow gaps to reach a cut, and your muscle cells change length when you move. Walls would make both impossible.`,
        `Now the second claim, that a wall replaces a membrane. This one is wrong in a different way. A plant cell has BOTH. The wall is outside; the membrane is just inside it, against the wall.`,
        `Ask what each layer does, and it becomes obvious why one cannot replace the other. The wall is rigid and lets water and small particles pass straight through without choosing. The membrane is the part that controls what actually gets in and out. A cell with only a wall would have no control over its own contents.`,
        `WRONG: "Animal cells have cell walls, and plant cells have a wall instead of a membrane." CORRECT: "Animal cells have a membrane only. Plant cells have a membrane too, with a rigid wall outside it."`,
      ],
      example: { problem: `A student argues: "A celery stalk stands up straight because of its cell walls. My arm holds its shape too, so animal cells must have cell walls as well. And since a plant cell has a wall on the outside, it does not need a membrane." Sort out what is right and what is wrong here.`, solution: `The celery claim is right, but both jumps are wrong. Animal cells have no cell wall, only a membrane, and an arm gets its shape from bones and connective tissue. A plant cell has a membrane AND a wall, with the wall outside; the wall supports, while the membrane controls what enters and leaves.` },
      relatedLoIds: ['m7sci.plant-and-animal-cells'],
    },
  ],
  pointers: [
    { content: `Students often say "A plant cell has a wall and an animal cell has a membrane instead." — They are two different layers with two different jobs, and a plant cell has both. The membrane is thin and flexible and controls what enters and leaves the cell. The wall is rigid, sits OUTSIDE the membrane, and gives support without choosing what passes through. WRONG: "a wall instead of a membrane." CORRECT: "a membrane, with a wall outside it." An animal cell is the one that has only the membrane. Said properly: the difference is that plants ADD a wall, not that they swap one layer for another.`, kind: 'common-error' },
    { content: `Students often say "Plant cells are square and animal cells are round." — Shape is not the test, and it varies enormously. Animal cells come in wildly different shapes: a nerve cell is long and stringy, a red blood cell is a flat disc, a muscle cell is a fiber. Plant cells vary too, and many are nowhere near square. The rigid wall does TEND to make plant cells more regular, because a wall holds its form while a bare membrane can be pushed around, but that is a tendency and not a rule. Decide by the parts you can see, not by the outline.`, kind: 'common-error' },
    { content: `Shared by both: cell membrane, nucleus, cytoplasm, mitochondria, ribosomes, and vacuoles for storage.`, kind: 'tip' },
    { content: `Plant cells only: a cell wall outside the membrane, chloroplasts, and one large central vacuole. Animal cells have small vacuoles, not one large one.`, kind: 'tip' },
    { content: `The procedure: cross off every shared part, because shared parts are never evidence. Only the plant-only parts decide it.`, kind: 'tip' },
    { content: `A plant cell has BOTH a wall and a membrane. The wall supports; the membrane controls what enters and leaves. An animal cell has the membrane only.`, kind: 'tip' },
    { content: `Plant cells have mitochondria as well as chloroplasts, because food still has to be spent after it is made.`, kind: 'tip' },
    { content: `A wall alone does not prove plant -- bacteria have walls, and bacteria are prokaryotic, with no nucleus at all.`, kind: 'tip' },
    { content: `Never write "a plant cell has a wall instead of a membrane." Say: "a membrane, with a wall outside it." Plants ADD a layer; they don't swap one. Animal cells are the ones with the membrane only.`, kind: 'common-error' },
    { content: `Shared parts are never evidence. A nucleus, membrane, cytoplasm, mitochondria or ribosomes in a description tell you nothing about plant vs animal. Cross them off before you decide.`, kind: 'tip' },
    { content: `Mitochondria are NOT animal-only. Plant cells have them too. Chloroplasts make the food; mitochondria release the energy from it. Both jobs have to happen in a plant.`, kind: 'gotcha' },
    { content: `"It has vacuoles" does not mean plant. Animal cells have small vacuoles too. Only ONE LARGE central vacuole filling much of the cell points to a plant. Watch for the words *one* and *large*.`, kind: 'edge-case' },
    { content: `A cell wall by itself does not prove plant. Bacteria usually have walls too. If a description says wall but NO nucleus, it's a prokaryote, not a plant or animal cell at all.`, kind: 'edge-case' },
    { content: `Don't decide by shape. "Square = plant, round = animal" is a drawing habit, not a rule. Nerve cells are stringy, red blood cells are flat discs, muscle cells are fibers. Judge by the parts, not the outline.`, kind: 'gotcha' },
    { content: `Absence counts as evidence. If nothing in the list can decide it, say what's MISSING: no wall, nothing green, no one big vacuole → animal cell. Write that missing part down as your reason.`, kind: 'tip' },
    { content: `Keep the two layers' jobs straight: the **wall** is rigid and lets things pass without choosing; the **membrane** controls what enters and leaves. A cell with only a wall could not control its own insides.`, kind: 'vocab-note' },
  ],
};
