/**
 * Grade 7 Science (Life Science) — Cells: Plant Cells & Animal Cells.
 *
 * The comparison lesson (NGSS MS-LS1-2). The content is a short list, but the
 * REASONING MOVE is the point: the parts the two cell types share cannot
 * decide anything, so only the plant-only parts do any work. Students who
 * never learn that keep answering "plant, because it has mitochondria".
 *
 * Deliberately does NOT re-teach the full organelle catalogue — that is the
 * next lesson, m7sci.organelles-and-their-jobs. Here each part is named only
 * as far as the comparison needs it.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it. A cell is described by
 * listing the parts an observer can see -- never "look at the diagram".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U2_PLANT_AND_ANIMAL_CELLS: LessonPlan = {
  id: 'evelyn.ms.m7sci.plant-and-animal-cells.v1',
  title: 'Plant Cells & Animal Cells',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.plant-and-animal-cells',
      standard: 'M7SCI-2.2',
      description:
        'Compare plant cells and animal cells by the parts they share and the parts only plants have, and decide which kind of cell a description shows by using the plant-only parts as the evidence (NGSS MS-LS1-2).',
    },
  ],
  prerequisites: ['m7sci.cell-theory-and-microscopes'],
  followUps: ['m7sci.organelles-and-their-jobs'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the comparison with a difference the student can see from across the room.',
      script:
        'There is a plant sitting on a windowsill somewhere near you. It has not eaten anything in its whole life. Water, light, air, and that is the entire menu. You cannot do that. Lock yourself in a sunny room with a glass of water for a week and you will not be fine. You and that plant are both built out of cells, and most of the parts inside those cells are exactly the same parts. So the difference has to come from a short list of things the plant cell has and yours does not. Today we find that short list, and we learn how to use it to tell one kind of cell from the other.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-plant-vs-animal',
      kind: 'concept',
      goal: 'Separate shared parts from plant-only parts, install the decision procedure, and clear the wall-versus-membrane and mitochondria confusions.',
      keyIdeas: [
        'MOST OF THE LIST IS SHARED — plant cells and animal cells both have a CELL MEMBRANE around the outside, a NUCLEUS holding the instructions, CYTOPLASM filling the inside, MITOCHONDRIA that release the energy stored in food, and RIBOSOMES that build proteins. Both kinds also have vacuoles for storage. That is a lot of sameness, and it is the first thing to notice.',
        'THE PLANT-ONLY LIST IS SHORT — three things. A CELL WALL, a rigid layer sitting OUTSIDE the membrane that gives support. CHLOROPLASTS, the green parts that capture light energy and use it to make food. And ONE LARGE CENTRAL VACUOLE, a single big water-filled space taking up much of the middle. Animal cells have none of those three. Animal cells do have vacuoles, but only small ones, so it is the SIZE and the single large one that mark a plant.',
        'THE DECISION PROCEDURE, AND THIS IS THE REAL SKILL — when you are asked which kind of cell a description shows, go down the list of parts and cross off everything that is shared. A nucleus tells you nothing. A membrane tells you nothing. Mitochondria tell you nothing. Only the plant-only parts can decide it: find a wall, chloroplasts or one large central vacuole and you have a plant cell; find none of the three and you have an animal cell. Shared parts are never evidence.',
        'A PLANT CELL HAS BOTH A WALL AND A MEMBRANE — these are two different layers, not two names for one thing. The membrane is thin, flexible, and controls what enters and leaves. The wall is rigid, sits outside the membrane, and does not choose what passes through. WRONG: "A plant cell has a wall instead of a membrane." CORRECT: "A plant cell has a membrane, and a wall outside it." An animal cell has the membrane and stops there.',
        'PLANT CELLS HAVE MITOCHONDRIA TOO — chloroplasts do not replace them. Chloroplasts capture light and make food; mitochondria then release the energy from that food so the plant can grow and repair itself. A plant makes its own food and still has to spend it, the same way you spend the food you eat. So mitochondria are useless as evidence, because both kinds of cell have them.',
        'A WIDER PICTURE, BRIEFLY — plant and animal cells are both EUKARYOTIC, meaning their DNA is kept inside a nucleus. Bacteria are PROKARYOTIC: they have DNA, ribosomes, a membrane and usually a wall, but no nucleus at all, so their DNA sits loose in the cytoplasm. That matters here for one reason. A cell wall does not prove plant. Bacteria have walls, and they are not plants.',
      ],
      vocabulary: [
        { term: 'cell membrane', definition: 'the thin flexible boundary, found in every cell, that controls what enters and leaves.' },
        { term: 'cell wall', definition: 'the rigid layer outside the membrane of a plant cell that gives shape and support.' },
        { term: 'chloroplast', definition: 'the green plant-only part that captures light energy and uses it to make food.' },
        { term: 'central vacuole', definition: 'the single large water-filled space that fills much of a plant cell; animal cells have only small vacuoles.' },
        { term: 'eukaryotic', definition: 'describing a cell that keeps its DNA inside a nucleus; plant and animal cells are both eukaryotic.' },
        { term: 'prokaryotic', definition: 'describing a cell with no nucleus, so its DNA sits loose in the cytoplasm; bacteria are prokaryotic.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cross-off-the-shared-parts',
      kind: 'worked_example',
      problem:
        'A student scrapes a few cells from the inside of her cheek and writes down everything she can see: a thin outer boundary, a nucleus near the middle, jelly filling the inside, many small oval structures scattered through the jelly, and several small storage bubbles. She sees no stiff outer layer and nothing green. Which kind of cell is this, and which observation actually decided it?',
      steps: [
        'Take the list one item at a time and label each part shared or plant-only. That labeling IS the method.',
        'A thin outer boundary is the cell membrane. Every cell has one, so cross it off. It decides nothing.',
        'A nucleus is in both plant and animal cells. Cross it off.',
        'Jelly filling the inside is cytoplasm, in both. Cross it off.',
        'Many small oval structures scattered through the jelly are mitochondria, which both kinds have. Cross that off too, even though it feels like a clue. It is not one.',
        'Several small storage bubbles are small vacuoles. Animal cells do have these, so this is not evidence either. Only ONE LARGE central vacuole would have pointed to a plant.',
        'Every single item on her list got crossed off, which means nothing she saw could decide it. So look at what is ABSENT: no stiff outer layer means no cell wall, and nothing green means no chloroplasts. Two of the three plant-only parts are missing.',
        'That absence is the evidence. This is an animal cell, which fits, since she took it from her own cheek.',
      ],
      answer:
        'An animal cell. None of the parts she listed could decide it, because all of them are shared; the missing cell wall and missing chloroplasts are what settled the question.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-wall-versus-membrane',
      kind: 'worked_example',
      problem:
        'A student argues: "A celery stalk stands up straight because of its cell walls. My arm holds its shape too, so animal cells must have cell walls as well. And since a plant cell has a wall on the outside, it does not need a membrane." Sort out what is right and what is wrong here.',
      steps: [
        'Start with the part that is correct, because there is one. Cell walls really do give a plant its stiffness. Rigid walls stacked side by side let a celery stalk stand up with no bones in it at all.',
        'Now test the jump to animals. Animal cells have a membrane and no wall. Your arm holds its shape for completely different reasons: bones inside it, and tough connective tissue holding cells together. The support is built at the body level, not at the edge of each cell.',
        'Check why that matters. A wall is rigid, so a walled cell cannot change shape much. Your white blood cells squeeze through narrow gaps to reach a cut, and your muscle cells change length when you move. Walls would make both impossible.',
        'Now the second claim, that a wall replaces a membrane. This one is wrong in a different way. A plant cell has BOTH. The wall is outside; the membrane is just inside it, against the wall.',
        'Ask what each layer does, and it becomes obvious why one cannot replace the other. The wall is rigid and lets water and small particles pass straight through without choosing. The membrane is the part that controls what actually gets in and out. A cell with only a wall would have no control over its own contents.',
        'WRONG: "Animal cells have cell walls, and plant cells have a wall instead of a membrane." CORRECT: "Animal cells have a membrane only. Plant cells have a membrane too, with a rigid wall outside it."',
      ],
      answer:
        'The celery claim is right, but both jumps are wrong. Animal cells have no cell wall, only a membrane, and an arm gets its shape from bones and connective tissue. A plant cell has a membrane AND a wall, with the wall outside; the wall supports, while the membrane controls what enters and leaves.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-shared-part',
      kind: 'try_yourself',
      problem: 'Which cell part is found in BOTH plant cells and animal cells?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Chloroplasts' },
        { id: 'b', text: 'A cell wall' },
        { id: 'c', text: 'Mitochondria', correct: true },
        { id: 'd', text: 'One large central vacuole' },
      ],
      expectedAnswer: 'Mitochondria',
      hints: [
        'Three of these four are on the short plant-only list. Recall that list before you choose.',
        'A plant makes its own food, but it still has to release the energy from that food in order to grow, so it needs the same part you use for the food you eat.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-decides-it',
      kind: 'try_yourself',
      problem:
        'You are told only one fact about a cell. Which single fact, on its own, is enough to tell you it is a plant cell?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It has a nucleus.' },
        { id: 'b', text: 'It has a cell membrane around the outside.' },
        { id: 'c', text: 'It contains mitochondria.' },
        { id: 'd', text: 'It contains chloroplasts.', correct: true },
      ],
      expectedAnswer: 'It contains chloroplasts.',
      hints: [
        'Ask each option the same question: would an animal cell ALSO have this? If yes, the fact cannot decide anything.',
        'Only a part on the plant-only list can settle it. Three of these four are shared by both kinds of cell.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-wall-does-not-prove-plant',
      kind: 'try_yourself',
      problem:
        'A scientist describes a cell she is studying: it has DNA, ribosomes, a cell membrane and a cell wall, but no nucleus, no chloroplasts and no mitochondria. What is the best conclusion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is a plant cell, because a cell wall means plant.' },
        { id: 'b', text: 'It is an animal cell, because it has no chloroplasts.' },
        { id: 'c', text: 'It is not a plant or animal cell at all; with no nucleus it is a prokaryotic cell, such as a bacterium.', correct: true },
        { id: 'd', text: 'It cannot be a real cell, because a cell with no nucleus could not hold DNA.' },
      ],
      expectedAnswer: 'It is not a plant or animal cell at all; with no nucleus it is a prokaryotic cell, such as a bacterium.',
      hints: [
        'Plant cells and animal cells are both eukaryotic, which means both of them keep their DNA in a nucleus. This cell has no nucleus.',
        'A cell wall is not proof of a plant. Bacteria usually have a wall too, and having no nucleus does not mean having no DNA.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-walls-and-shapes',
      kind: 'misconception_check',
      question:
        'A student writes: "You can tell them apart easily. Plant cells are the square ones with a cell wall, and animal cells are the round ones with a membrane instead of a wall." What is wrong with that?',
      commonErrors: [
        {
          answer: 'A plant cell has a wall and an animal cell has a membrane instead.',
          misconception:
            'Treating the wall and the membrane as two versions of the same layer, so that having one means not having the other.',
          correctsTo:
            'They are two different layers with two different jobs, and a plant cell has both. The membrane is thin and flexible and controls what enters and leaves the cell. The wall is rigid, sits OUTSIDE the membrane, and gives support without choosing what passes through. WRONG: "a wall instead of a membrane." CORRECT: "a membrane, with a wall outside it." An animal cell is the one that has only the membrane. Said properly: the difference is that plants ADD a wall, not that they swap one layer for another.',
        },
        {
          answer: 'Plant cells are square and animal cells are round.',
          misconception:
            'Turning the two tidy drawings from a textbook into a rule about shape, because a drawn plant cell is usually a neat rectangle and a drawn animal cell is usually a blob.',
          correctsTo:
            'Shape is not the test, and it varies enormously. Animal cells come in wildly different shapes: a nerve cell is long and stringy, a red blood cell is a flat disc, a muscle cell is a fiber. Plant cells vary too, and many are nowhere near square. The rigid wall does TEND to make plant cells more regular, because a wall holds its form while a bare membrane can be pushed around, but that is a tendency and not a rule. Decide by the parts you can see, not by the outline.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Shared by both: cell membrane, nucleus, cytoplasm, mitochondria, ribosomes, and vacuoles for storage.',
        'Plant cells only: a cell wall outside the membrane, chloroplasts, and one large central vacuole. Animal cells have small vacuoles, not one large one.',
        'The procedure: cross off every shared part, because shared parts are never evidence. Only the plant-only parts decide it.',
        'A plant cell has BOTH a wall and a membrane. The wall supports; the membrane controls what enters and leaves. An animal cell has the membrane only.',
        'Plant cells have mitochondria as well as chloroplasts, because food still has to be spent after it is made.',
        'A wall alone does not prove plant -- bacteria have walls, and bacteria are prokaryotic, with no nucleus at all.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Plant Cells & Animal Cells' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
