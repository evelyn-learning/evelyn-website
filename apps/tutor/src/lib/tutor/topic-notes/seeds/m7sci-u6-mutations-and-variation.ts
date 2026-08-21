/**
 * Grade 7 Science — Unit 6 CED 6.4: Mutations & Variation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.mutations-and-variation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U6_MUTATIONS_AND_VARIATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.mutations-and-variation.v1',
  course: 'Grade 7 Science',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Mutations & Variation',
  planId: 'evelyn.ms.m7sci.mutations-and-variation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.mutations-and-variation.v1' }],
  theory: [
    { loId: 'm7sci.mutations-and-variation', content: `A MUTATION IS A CHANGE IN THE DNA SEQUENCE. DNA is the instruction set inside your cells, written as an extremely long line of chemical letters. A mutation is a spot where those letters differ from the ones the parent cell carried. Mutations start in two ways. The first is a copying error: a cell copies all of its DNA before it divides, and a copy that long sometimes comes out slightly wrong. The second is an outside factor, such as strong ultraviolet light from the sun, X-rays, or chemicals in tobacco smoke.` },
    { loId: 'm7sci.mutations-and-variation', content: `WHY A CHANGED LETTER CAN MATTER. A stretch of DNA is an instruction for building a protein, and proteins do the real work in a body. They build structures, carry oxygen, break down food, and give hair and skin their color. If a mutation changes the instruction, the protein may come out different, and a different protein may then change a structure or a function of the organism. Notice the word MAY, both times. A change in the DNA does not have to reach a protein, and a changed protein does not have to change anything a person would notice.` },
    { loId: 'm7sci.mutations-and-variation', content: `THREE POSSIBLE OUTCOMES, AND MOST ARE NEUTRAL. A mutation can be HARMFUL, leaving the organism worse off. It can be HELPFUL, leaving it better off where it lives. Or it can be NEUTRAL, making no real difference at all. Neutral is by far the most common outcome, for two reasons: the change often lands in a stretch of DNA that is not an instruction for any protein, and even when it does hit an instruction the protein often still works the same. Most mutations are also invisible. Nothing about the organism looks different from the outside.` },
    { loId: 'm7sci.mutations-and-variation', content: `THE ENVIRONMENT DECIDES WHETHER A CHANGE HELPS. THE ORGANISM DOES NOT. This is the hardest idea here and the one most often gotten wrong. Mutations happen by chance while DNA is copied or damaged, and they turn up whether or not anything could use them. WRONG: "The mice turned pale because they needed camouflage on the sand." CORRECT: "A chance change made one mouse pale, and because the sand is pale, that color turned out to help." The same pale coat that helps on pale sand hurts on dark rock. Harmful and helpful are not labels a mutation carries around with it; they depend on where the organism happens to live.` },
    { loId: 'm7sci.mutations-and-variation', content: `ONLY SOME MUTATIONS ARE INHERITED. A mutation is copied into every cell that grows from the cell that carried it, and into no other cell. A mutation in a skin cell on your arm goes into the new skin cells that replace it, and it stops there. It never reaches your children. A mutation is passed on only when it is in the cells that make sex cells, the eggs and the sperm, because those are the only cells a whole new organism grows from. So damage done by the sun to a skin cell is real, and it is still not something a child can inherit.` },
    { loId: 'm7sci.mutations-and-variation', content: `MUTATION IS THE ULTIMATE SOURCE OF NEW VARIATION. Members of a species differ from one another because they carry different versions of genes. Sexual reproduction shuffles versions that already exist, the way shuffling rearranges cards a deck already holds. Shuffling never invents a new card. Mutation is the only thing that makes a brand-new version in the first place, which means every version of every gene in every living thing began as a mutation. Hold onto that, because the next unit is about fossils and evolution, and variation is the raw material all of it works on.` },
    { loId: 'm7sci.mutations-and-variation', kind: 'definition', title: 'mutation', content: 'a change in the sequence of DNA in a cell.' },
    { loId: 'm7sci.mutations-and-variation', kind: 'definition', title: 'protein', content: `a molecule built from a DNA instruction that does a job in the body, such as carrying oxygen or coloring hair.` },
    { loId: 'm7sci.mutations-and-variation', kind: 'definition', title: 'neutral mutation', content: `a change in DNA that makes no real difference to the organism; this is the most common kind.` },
    { loId: 'm7sci.mutations-and-variation', kind: 'definition', title: 'inherited mutation', content: `a mutation in an egg cell or a sperm cell, which can therefore appear in the offspring.` },
    { loId: 'm7sci.mutations-and-variation', kind: 'definition', title: 'variation', content: 'the differences among individual members of the same species.' },
  ],
  methods: [
    {
      title: 'Worked classify three mutations',
      steps: [
        `Work every one of these the same way. Ask two questions in order: does the change reach a protein, and if it does, what does that protein do for the organism?`,
        `Mutation 1 never reaches a protein. The stretch of DNA it landed in is not an instruction for building one, so no protein comes out different and nothing about the mouse changes. Label it NEUTRAL. This is the most common outcome of all.`,
        `Mutation 3 does reach a protein, and the changed protein does its job badly. Breaking down food matters every day of the life of that mouse, so this mouse gets less out of what it eats than the others do. It is worse off. Label it HARMFUL.`,
        `Mutation 2 also reaches a protein, and this one shows: the coat is pale. Now ask where the mouse is. It is on pale sand, where a pale mouse is harder for a hawk overhead to pick out. Here the change HELPS.`,
        `Now move that same mouse to a field of dark volcanic rock and change nothing whatever about its DNA. The pale coat now stands out sharply against the dark rock, and the very same mutation is HARMFUL. The label flipped while the mutation stayed exactly the same.`,
        `WRONG way to tell the story of mutation 2: "The mouse turned pale because the sand was pale." CORRECT way: "A chance copying error turned the mouse pale, and the pale sand is what made that color worth having." The change always comes first. The surroundings only settle what it is worth.`,
      ],
      example: { problem: `Three separate mutations appear in three different mice living on pale desert sand. Mutation 1 lands in a stretch of DNA that is not an instruction for any protein. Mutation 2 changes the protein that colors the fur, and the coat of that mouse comes out much paler than usual. Mutation 3 changes a protein that breaks down food, and the changed protein does that job badly. Label each one harmful, helpful, or neutral, and say what your label depends on.`, solution: `Mutation 1 is neutral, because it never reaches a protein. Mutation 3 is harmful, because a protein that breaks down food now works badly. Mutation 2 is helpful on pale sand and would be harmful on dark rock. Harmful, helpful and neutral are not fixed labels: for anything that shows on the outside, the environment settles which one applies.` },
      relatedLoIds: ['m7sci.mutations-and-variation'],
    },
    {
      title: 'Worked inherited or not',
      steps: [
        `Ask one question about each mutation: which cells are going to end up carrying it?`,
        `The first mutation is in one skin cell. When that cell divides, the new skin cells it makes carry the change as well. Every other cell in the cat grew from somewhere else, so the change stays inside that one small patch of skin.`,
        `Now think about where a kitten comes from. A kitten grows from exactly two cells: one egg cell from the mother and one sperm cell from the father. So the only mutations a kitten can inherit are ones already sitting in an egg cell or a sperm cell.`,
        `The second mutation is in a cell that makes egg cells. If the egg cell it produces is the one that becomes a kitten, then every single cell in that kitten carries the change, because the whole kitten grew out of that one cell.`,
        `WRONG: "The sun damaged the DNA of the cat, so the kittens carry the damage too." CORRECT: "The sun damaged one skin cell of the cat, and nothing that happens to a skin cell can reach an egg cell."`,
        `The same rule covers everything else that happens during a life. A cat that loses part of an ear in a fight does not have kittens with short ears. Changing a body part does not change the instructions stored in the egg cells.`,
      ],
      example: { problem: `A cat spends years lying in strong sunlight, and ultraviolet light causes a mutation in one skin cell on its back. In the same year, a copying error causes a mutation in one of the cells inside that cat which make egg cells. The cat later has kittens. Which of the two mutations, if either, can appear in the kittens?`, solution: `Only the mutation in the cell that makes egg cells can appear in the kittens. A kitten grows from one egg cell and one sperm cell, so a mutation is inherited only when it sits in those cells; the skin mutation is copied into new skin cells and goes no further.` },
      relatedLoIds: ['m7sci.mutations-and-variation'],
    },
  ],
  pointers: [
    { content: `Students often say "All mutations are harmful, because a mutation is a mistake in the DNA." — Most mutations are NEUTRAL. Many land in stretches of DNA that are not instructions for any protein, and many of the rest change a protein so slightly that it still does its job. Some mutations are harmful, and a few turn out helpful. You are carrying mutations right now and cannot tell, and so is everyone you know. Two habits fix this. Expect neutral first. And drop the movie meaning of the word mutant: a mutation is a changed sequence of DNA, and nothing about that is dramatic.`, kind: 'common-error' },
    { content: `Students often say "An organism develops the mutation that would help it, so a rabbit in the snow grows white fur." — Mutations happen by chance while DNA is copied or damaged, and they turn up whether or not anything could use them. The order of events never changes: the mutation happens FIRST, and the environment afterwards determines whether it helps, hurts, or makes no difference. In snowy country, chance changes to fur color keep appearing in rabbits, most of them making no difference at all. A paler rabbit is harder for a fox to spot against snow, so paler rabbits leave more offspring, and over many generations more of the population is pale. WRONG: "The rabbit turned white to survive the winter." CORRECT: "A chance change turned one rabbit white, and the snow is what made white worth having." No organism can order up a mutation, and wanting one has no effect whatever.`, kind: 'common-error' },
    { content: `A mutation is a change in the DNA sequence, caused either by a copying error when a cell divides or by an outside factor such as ultraviolet light, X-rays or chemicals.`, kind: 'tip' },
    { content: `A mutation MAY change the protein built from that stretch of DNA, and a changed protein MAY then change a structure or a function of the organism. Neither step is guaranteed.`, kind: 'tip' },
    { content: `Three outcomes are possible -- harmful, helpful, neutral -- and MOST MUTATIONS ARE NEUTRAL. Most of them are invisible from the outside as well.`, kind: 'tip' },
    { content: `Mutations happen by chance and never arrive on demand. The change comes first; the environment afterwards determines whether it helps, hurts, or makes no difference, and the same change can help in one place and hurt in another.`, kind: 'tip' },
    { content: `A mutation is inherited only when it is in the cells that make eggs or sperm. A change in a skin cell is copied into new skin cells and stops there.`, kind: 'tip' },
    { content: `Mutation is the only source of brand-new versions of genes, and therefore the ultimate source of variation -- the raw material that the next unit, on fossils and evolution, is entirely about.`, kind: 'tip' },
    { content: `Never write that an organism "developed" or "grew" a mutation because it needed one. Say the change came first by chance, then the surroundings decided its value. Rewrite "the rabbit turned white for the snow" as "a chance change turned it white, and snow made white worth having."`, kind: 'common-error' },
    { content: `Don't treat "harmful" and "helpful" as permanent labels stuck to a mutation. The same pale-fur mutation helps on pale sand and hurts on dark rock, with zero change to the DNA. If a question doesn't say where the organism lives, say the label depends on the environment.`, kind: 'gotcha' },
    { content: `"Mutation" does not mean "damage" or "disease." It only means the DNA sequence is different from the parent cell's. Guess NEUTRAL first — you are carrying mutations right now and can't tell.`, kind: 'vocab-note' },
    { content: `The lesson says a mutation MAY change a protein and that MAY change the organism. Keep both maybes. Many mutations land in DNA that isn't an instruction for any protein, and many changed proteins still do their job fine.`, kind: 'gotcha' },
    { content: `Before labeling a mutation, ask two questions in this order: (1) Does it reach a protein? (2) If yes, what job does that protein do here? Skipping step 1 makes you label every mutation as harmful or helpful when neutral is the usual answer.`, kind: 'tip' },
    { content: `A mutation in a skin, muscle, or eye cell is copied only into new cells of that same patch. It can never reach eggs or sperm, so it can't be inherited. Sunburn damage to a parent's skin does not show up in their children.`, kind: 'common-error' },
    { content: `Body changes that aren't in the DNA at all — a torn ear, big muscles, a haircut — are not mutations and are never inherited. A mutation must be a change in the DNA sequence itself.`, kind: 'edge-case' },
    { content: `Sexual reproduction shuffles gene versions that already exist; it never invents a new one. Only mutation makes a brand-new version. If a question asks where NEW variation comes from, the answer is mutation, not reproduction.`, kind: 'vocab-note' },
  ],
};
