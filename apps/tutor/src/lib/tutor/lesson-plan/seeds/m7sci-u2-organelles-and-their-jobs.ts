/**
 * Grade 7 Science (Life Science) — Cells: Organelles & Their Jobs.
 *
 * The concept-led exemplar for the m7sci course (NGSS MS-LS1-2). Organelles
 * named by the JOB they do rather than memorized as a list, plus the
 * misconception that outlives every cell unit: that mitochondria MAKE energy.
 * They do not. Energy is not created; it is released from food and moved into
 * a form the cell can spend.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it. If a lesson needs a diagram,
 * a table or a Punnett square, write it out in prose -- never "see the
 * diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U2_ORGANELLES_AND_THEIR_JOBS: LessonPlan = {
  id: 'evelyn.ms.m7sci.organelles-and-their-jobs.v1',
  title: 'Organelles & Their Jobs',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.organelles-and-their-jobs',
      standard: 'M7SCI-2.3',
      description:
        'Identify the major organelles of plant and animal cells by the function each one performs, and explain how a cell part contributes to the whole cell staying alive (NGSS MS-LS1-2).',
    },
  ],
  prerequisites: ['m7sci.plant-and-animal-cells'],
  followUps: ['m7sci.diffusion-and-osmosis'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the idea that one small unit contains everything it needs to run itself.',
      script:
        'Think about everything that has to happen in your kitchen for one dinner to appear. Something stores the food. Something heats it. Something takes out the trash. Somebody keeps the recipes. If any one of those stopped, dinner would still fail even though the other jobs were fine. A cell is smaller than the dot on this letter i, and every one of those jobs is happening inside it right now, in your arm, while you sit there. Today we name the parts that do those jobs, and we say what each one is actually FOR.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-organelles',
      kind: 'concept',
      goal: 'Name each major organelle by function, split plant-only from shared, and kill the "makes energy" error.',
      keyIdeas: [
        'AN ORGANELLE IS A CELL PART WITH A JOB — the way an organ has a job in a body. You do not learn organelles by memorizing a list. You learn them by asking what would go wrong if that part stopped. That question is also how almost every test of this topic is written.',
        'THE PARTS EVERY CELL HAS — the CELL MEMBRANE is the boundary, and it controls what gets in and out. The NUCLEUS holds the instructions (DNA) and directs the cell. RIBOSOMES build proteins. The CYTOPLASM is the jelly everything sits in. MITOCHONDRIA release the energy stored in food.',
        'THE PARTS ONLY PLANT CELLS HAVE — a CELL WALL, which is rigid and gives the plant its shape and support, sitting OUTSIDE the membrane; CHLOROPLASTS, which capture light energy to make food; and one LARGE VACUOLE for storing water. Animal cells have a membrane but no wall, no chloroplasts, and only small vacuoles. So a cell with a wall and chloroplasts is a plant cell, and that is usually the fastest way to tell.',
        'THE BIG TRAP — mitochondria do NOT make energy. Energy cannot be created. The food you eat already holds energy; the mitochondria RELEASE it and move it into a form the cell can spend. WRONG: "Mitochondria make energy for the cell." RIGHT: "Mitochondria release energy from food so the cell can use it." Say released, never made.',
        'A SECOND TRAP — the cell WALL and the cell MEMBRANE are not the same thing, and a plant cell has both. The membrane is thin, flexible and controls what passes through. The wall is rigid, sits outside the membrane, and does not choose what enters. Only plants, fungi and some other organisms have a wall.',
        'THE FACTORY COMPARISON HELPS, AND THEN IT STOPS HELPING — calling the nucleus the manager and the mitochondria the power plant makes the jobs easy to hold onto. But a real cell has no manager and nothing inside it decides anything. The parts work because of chemistry, not because something is in charge. Use the comparison to remember, then drop it when you explain.',
      ],
      vocabulary: [
        { term: 'organelle', definition: 'a structure inside a cell that carries out a particular job.' },
        { term: 'nucleus', definition: 'the organelle that holds the cell instructions and directs the cell activities.' },
        { term: 'mitochondria', definition: 'the organelles that release energy stored in food into a form the cell can use.' },
        { term: 'chloroplast', definition: 'the plant organelle that captures light energy and uses it to make food.' },
        { term: 'cell membrane', definition: 'the thin flexible boundary that controls what enters and leaves the cell.' },
        { term: 'cell wall', definition: 'the rigid layer outside the membrane of a plant cell that provides shape and support.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-plant-or-animal',
      kind: 'worked_example',
      problem:
        'A student looks at a cell and writes down what she sees: a thin outer boundary, a stiff outer layer outside that boundary, a nucleus, many small green structures, and one very large water-filled space taking up most of the middle. Is this a plant cell or an animal cell, and how do you know?',
      steps: [
        'Go through her list one item at a time and ask which cells have that part.',
        'A thin outer boundary is the cell membrane. Every cell has one, so this tells us nothing yet.',
        'A stiff outer layer OUTSIDE the membrane is the cell wall. Animal cells do not have one. That is the first real clue.',
        'A nucleus tells us nothing either, because plant and animal cells both have one.',
        'Many small green structures are chloroplasts. They are green because of the pigment that captures light. Animal cells do not have chloroplasts, because animals do not make their own food. Second clue.',
        'One very large water-filled space is a large central vacuole, which is a plant feature. Animal cells have only small vacuoles. Third clue.',
        'Three of the five parts are plant-only and none of them is animal-only, so this is a plant cell. Notice the reasoning: the shared parts were useless for deciding, and only the plant-only parts did any work.',
      ],
      answer:
        'A plant cell. The cell wall, the chloroplasts and the large central vacuole are all plant-only parts; the membrane and nucleus are shared and do not help decide.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-broken-organelle',
      kind: 'worked_example',
      problem:
        'In a certain animal cell, the mitochondria stop working, but every other organelle is fine. Predict what happens to the cell and explain why.',
      steps: [
        'Start with the job. Mitochondria release the energy stored in food into a form the cell can spend.',
        'Ask what still works. Food can still get in through the membrane. The nucleus still holds the instructions. The ribosomes can still build proteins, in principle.',
        'Now ask what those working parts need. Building a protein takes energy. Moving materials across the membrane often takes energy. Almost everything a cell does costs energy.',
        'So the food is still arriving and the instructions are still there, but the cell can no longer get at the energy locked inside the food. The other organelles slow down and then stop, not because they are broken, but because nothing is paying for their work.',
        'WRONG way to say this: "The cell dies because the mitochondria stopped making energy." That sentence contains the error this lesson is about. RIGHT way: "The cell dies because the energy in its food can no longer be released into a usable form."',
        'This is why muscle cells, which need a lot of energy, contain far more mitochondria than cells that do less work.',
      ],
      answer:
        'The cell runs down and dies. Food still enters and the instructions remain, but the energy stored in that food can no longer be released into a form the cell can spend, so every process that costs energy stops.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-by-job',
      kind: 'try_yourself',
      problem: 'Which cell part controls what enters and leaves the cell?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The cell wall' },
        { id: 'b', text: 'The nucleus' },
        { id: 'c', text: 'The cell membrane', correct: true },
        { id: 'd', text: 'The cytoplasm' },
      ],
      expectedAnswer: 'The cell membrane',
      hints: [
        'The part doing this job has to sit at the cell boundary, and it has to be able to let some things through and stop others.',
        'A plant cell has two layers at its edge. The rigid outer one gives support but does not choose what passes; the thin inner one does the choosing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-energy-language',
      kind: 'try_yourself',
      problem: 'Which sentence describes what mitochondria do most accurately?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They capture light energy and turn it into food.' },
        { id: 'b', text: 'They make new energy for the cell to use.' },
        { id: 'c', text: 'They release energy stored in food into a form the cell can use.', correct: true },
        { id: 'd', text: 'They store the cell supply of water and nutrients.' },
      ],
      expectedAnswer: 'They release energy stored in food into a form the cell can use.',
      hints: [
        'One of these uses a word that breaks a rule about energy. Energy cannot be created out of nothing.',
        'Another one describes a completely different organelle that only plant cells have.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-predict-from-structure',
      kind: 'try_yourself',
      problem:
        'A biologist finds a cell that has a nucleus, a cell membrane, mitochondria and ribosomes, but no cell wall and no chloroplasts. What can she reasonably conclude?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is a plant cell, because it has mitochondria.' },
        { id: 'b', text: 'It cannot be alive, because it has no chloroplasts.' },
        { id: 'c', text: 'It is a plant cell that has not grown its wall yet.' },
        { id: 'd', text: 'It is an animal cell, and it must get its food from outside itself.', correct: true },
      ],
      expectedAnswer: 'It is an animal cell, and it must get its food from outside itself.',
      hints: [
        'Sort the listed parts into shared parts and parts that belong to only one kind of cell. Then look at what is MISSING.',
        'Chloroplasts are what let a cell make its own food from light. A cell without them still needs food, so the food has to come from somewhere else.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mitochondria-make-energy',
      kind: 'misconception_check',
      question:
        'A student writes: "Mitochondria are the powerhouse of the cell because they make the energy the cell needs." What is wrong with that sentence?',
      commonErrors: [
        {
          answer: 'Mitochondria make energy for the cell.',
          misconception:
            'Treating a cell part as a source of new energy, because "powerhouse" sounds like something that generates power from nothing.',
          correctsTo:
            'Energy is never created. It is already stored in the food the organism took in, and the mitochondria RELEASE it and transfer it into a form the cell can spend. Swap one word and the sentence becomes true: mitochondria release the energy the cell needs. The habit worth building is that in biology, energy always gets transferred or transformed, never manufactured.',
        },
        {
          answer: 'Plant cells do not need mitochondria because they have chloroplasts.',
          misconception:
            'Assuming chloroplasts replace mitochondria, because both are described as having something to do with energy.',
          correctsTo:
            'Plant cells have BOTH, and they need both. Chloroplasts capture light energy and use it to make food. Mitochondria then release the energy from that food so the plant can grow, repair itself and move water. A plant makes its own food and then has to spend it, exactly as an animal spends the food it eats. That is also why a plant kept in complete darkness eventually dies even though it still has chloroplasts.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Learn each organelle by its JOB, then ask what would fail if that part stopped.',
        'Every cell: membrane (boundary and gatekeeper), nucleus (instructions), ribosomes (build proteins), cytoplasm (the jelly), mitochondria (release energy from food).',
        'Plant cells only: cell wall (rigid support, outside the membrane), chloroplasts (capture light to make food), one large vacuole (water storage).',
        'Mitochondria RELEASE energy from food. They never make it -- energy cannot be created.',
        'Plant cells have both chloroplasts and mitochondria, because food still has to be spent after it is made.',
        'The factory comparison helps you remember, but a real cell has no manager and nothing in it decides anything.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Organelles & Their Jobs' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
