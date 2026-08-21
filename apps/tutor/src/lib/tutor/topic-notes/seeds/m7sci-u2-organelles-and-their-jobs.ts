/**
 * Grade 7 Science — Unit 2 CED 2.3: Organelles & Their Jobs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.organelles-and-their-jobs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U2_ORGANELLES_AND_THEIR_JOBS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.organelles-and-their-jobs.v1',
  course: 'Grade 7 Science',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Organelles & Their Jobs',
  planId: 'evelyn.ms.m7sci.organelles-and-their-jobs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.organelles-and-their-jobs.v1' }],
  theory: [
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'framework', title: 'An organelle is a cell part with a job', content: `AN ORGANELLE IS A CELL PART WITH A JOB — the way an organ has a job in a body. You do not learn organelles by memorizing a list. You learn them by asking what would go wrong if that part stopped. That question is also how almost every test of this topic is written.` },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'framework', title: 'The parts every cell has', content: `THE PARTS EVERY CELL HAS — the CELL MEMBRANE is the boundary, and it controls what gets in and out. The NUCLEUS holds the instructions (DNA) and directs the cell. RIBOSOMES build proteins. The CYTOPLASM is the jelly everything sits in. MITOCHONDRIA release the energy stored in food.` },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'framework', title: 'The parts only plant cells have', content: `THE PARTS ONLY PLANT CELLS HAVE — a CELL WALL, which is rigid and gives the plant its shape and support, sitting OUTSIDE the membrane; CHLOROPLASTS, which capture light energy to make food; and one LARGE VACUOLE for storing water. Animal cells have a membrane but no wall, no chloroplasts, and only small vacuoles. So a cell with a wall and chloroplasts is a plant cell, and that is usually the fastest way to tell.` },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'framework', title: 'The big trap', content: `THE BIG TRAP — mitochondria do NOT make energy. Energy cannot be created. The food you eat already holds energy; the mitochondria RELEASE it and move it into a form the cell can spend. WRONG: "Mitochondria make energy for the cell." RIGHT: "Mitochondria release energy from food so the cell can use it." Say released, never made.` },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'framework', title: 'A second trap', content: `A SECOND TRAP — the cell WALL and the cell MEMBRANE are not the same thing, and a plant cell has both. The membrane is thin, flexible and controls what passes through. The wall is rigid, sits outside the membrane, and does not choose what enters. Only plants, fungi and some other organisms have a wall.` },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'framework', title: 'The factory comparison helps, and then it stops helping', content: `THE FACTORY COMPARISON HELPS, AND THEN IT STOPS HELPING — calling the nucleus the manager and the mitochondria the power plant makes the jobs easy to hold onto. But a real cell has no manager and nothing inside it decides anything. The parts work because of chemistry, not because something is in charge. Use the comparison to remember, then drop it when you explain.` },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'definition', title: 'organelle', content: 'a structure inside a cell that carries out a particular job.' },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'definition', title: 'nucleus', content: 'the organelle that holds the cell instructions and directs the cell activities.' },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'definition', title: 'mitochondria', content: 'the organelles that release energy stored in food into a form the cell can use.' },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'definition', title: 'chloroplast', content: 'the plant organelle that captures light energy and uses it to make food.' },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'definition', title: 'cell membrane', content: 'the thin flexible boundary that controls what enters and leaves the cell.' },
    { loId: 'm7sci.organelles-and-their-jobs', kind: 'definition', title: 'cell wall', content: `the rigid layer outside the membrane of a plant cell that provides shape and support.` },
  ],
  methods: [
    {
      title: 'Worked plant or animal',
      steps: [
        'Go through her list one item at a time and ask which cells have that part.',
        `A thin outer boundary is the cell membrane. Every cell has one, so this tells us nothing yet.`,
        `A stiff outer layer OUTSIDE the membrane is the cell wall. Animal cells do not have one. That is the first real clue.`,
        'A nucleus tells us nothing either, because plant and animal cells both have one.',
        `Many small green structures are chloroplasts. They are green because of the pigment that captures light. Animal cells do not have chloroplasts, because animals do not make their own food. Second clue.`,
        `One very large water-filled space is a large central vacuole, which is a plant feature. Animal cells have only small vacuoles. Third clue.`,
        `Three of the five parts are plant-only and none of them is animal-only, so this is a plant cell. Notice the reasoning: the shared parts were useless for deciding, and only the plant-only parts did any work.`,
      ],
      example: { problem: `A student looks at a cell and writes down what she sees: a thin outer boundary, a stiff outer layer outside that boundary, a nucleus, many small green structures, and one very large water-filled space taking up most of the middle. Is this a plant cell or an animal cell, and how do you know?`, solution: `A plant cell. The cell wall, the chloroplasts and the large central vacuole are all plant-only parts; the membrane and nucleus are shared and do not help decide.` },
      relatedLoIds: ['m7sci.organelles-and-their-jobs'],
    },
    {
      title: 'Worked broken organelle',
      steps: [
        `Start with the job. Mitochondria release the energy stored in food into a form the cell can spend.`,
        `Ask what still works. Food can still get in through the membrane. The nucleus still holds the instructions. The ribosomes can still build proteins, in principle.`,
        `Now ask what those working parts need. Building a protein takes energy. Moving materials across the membrane often takes energy. Almost everything a cell does costs energy.`,
        `So the food is still arriving and the instructions are still there, but the cell can no longer get at the energy locked inside the food. The other organelles slow down and then stop, not because they are broken, but because nothing is paying for their work.`,
        `WRONG way to say this: "The cell dies because the mitochondria stopped making energy." That sentence contains the error this lesson is about. RIGHT way: "The cell dies because the energy in its food can no longer be released into a usable form."`,
        `This is why muscle cells, which need a lot of energy, contain far more mitochondria than cells that do less work.`,
      ],
      example: { problem: `In a certain animal cell, the mitochondria stop working, but every other organelle is fine. Predict what happens to the cell and explain why.`, solution: `The cell runs down and dies. Food still enters and the instructions remain, but the energy stored in that food can no longer be released into a form the cell can spend, so every process that costs energy stops.` },
      relatedLoIds: ['m7sci.organelles-and-their-jobs'],
    },
  ],
  pointers: [
    { content: `Students often say "Mitochondria make energy for the cell." — Energy is never created. It is already stored in the food the organism took in, and the mitochondria RELEASE it and transfer it into a form the cell can spend. Swap one word and the sentence becomes true: mitochondria release the energy the cell needs. The habit worth building is that in biology, energy always gets transferred or transformed, never manufactured.`, kind: 'common-error' },
    { content: `Students often say "Plant cells do not need mitochondria because they have chloroplasts." — Plant cells have BOTH, and they need both. Chloroplasts capture light energy and use it to make food. Mitochondria then release the energy from that food so the plant can grow, repair itself and move water. A plant makes its own food and then has to spend it, exactly as an animal spends the food it eats. That is also why a plant kept in complete darkness eventually dies even though it still has chloroplasts.`, kind: 'common-error' },
    { content: 'Learn each organelle by its JOB, then ask what would fail if that part stopped.', kind: 'tip' },
    { content: `Every cell: membrane (boundary and gatekeeper), nucleus (instructions), ribosomes (build proteins), cytoplasm (the jelly), mitochondria (release energy from food).`, kind: 'tip' },
    { content: `Plant cells only: cell wall (rigid support, outside the membrane), chloroplasts (capture light to make food), one large vacuole (water storage).`, kind: 'tip' },
    { content: `Mitochondria RELEASE energy from food. They never make it -- energy cannot be created.`, kind: 'tip' },
    { content: `Plant cells have both chloroplasts and mitochondria, because food still has to be spent after it is made.`, kind: 'tip' },
    { content: `The factory comparison helps you remember, but a real cell has no manager and nothing in it decides anything.`, kind: 'tip' },
    { content: `Never write "mitochondria make energy." Energy can't be created. Write **"mitochondria release the energy stored in food into a form the cell can use."** One word swap — *make* → *release* — is the difference between wrong and right.`, kind: 'common-error' },
    { content: `Plant cells have chloroplasts AND mitochondria. Chloroplasts make the food; mitochondria release the energy from it. A plant in total darkness still dies, because chloroplasts with no light means no food to spend.`, kind: 'gotcha' },
    { content: `Cell wall and cell membrane are two different parts, and a plant cell has both. Membrane = thin, flexible, chooses what passes. Wall = rigid, sits OUTSIDE the membrane, gives shape, chooses nothing. Never use the words as if they mean the same thing.`, kind: 'vocab-note' },
    { content: `When asked "plant or animal?", cross out the shared parts first. Nucleus, membrane, ribosomes, cytoplasm and mitochondria are in both, so they prove nothing. Only cell wall, chloroplasts, and one large central vacuole decide it.`, kind: 'tip' },
    { content: `Vacuole answers need a size word. Animal cells DO have vacuoles — just small ones. The plant clue is **one large central** vacuole, not "has a vacuole."`, kind: 'edge-case' },
    { content: `Cell walls aren't a plant-only invention. Fungi and some other organisms have them too. "Has a wall" narrows it down; "has a wall AND chloroplasts" is what says plant.`, kind: 'edge-case' },
    { content: `Use "the nucleus is the manager" to remember, then drop it when you explain. No organelle decides, wants, or tells anything to happen. Say what a part **does**, not what it "chooses."`, kind: 'gotcha' },
    { content: `If one organelle breaks, don't just say "the cell dies." Trace it: which job stops, and which other jobs needed that job? Mitochondria fail → nothing pays for protein building or moving materials → everything else runs down.`, kind: 'tip' },
  ],
};
