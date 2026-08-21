/**
 * Grade 7 Science (Life Science) — Heredity: Mutations & Variation.
 *
 * The bridge row from heredity into evolution (NGSS MS-LS3-1). The spine is
 * the three-way split: a mutation can be harmful, helpful, or neutral, and
 * MOST ARE NEUTRAL. Everything else hangs off that.
 *
 * The one sentence this lesson exists to protect is accuracy rule 3: a
 * mutation is never acquired because an organism could use it. The change
 * happens first, by chance, and the environment then determines whether it
 * helps, hurts, or makes no difference. Nothing in this file may say that an
 * organism developed a mutation for a reason, and every need-driven phrasing
 * that appears is quoted inside an explicit WRONG label and corrected on the
 * next line.
 *
 * Tone is deliberately matter-of-fact. No science-fiction framing of the word
 * mutant, and no invented numbers for how often mutations happen.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every item is
 * solvable from the words printed inside it. Never write "see the diagram".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U6_MUTATIONS_AND_VARIATION: LessonPlan = {
  id: 'evelyn.ms.m7sci.mutations-and-variation.v1',
  title: 'Mutations & Variation',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.mutations-and-variation',
      standard: 'M7SCI-6.4',
      description:
        'Explain that a mutation is a change in the DNA sequence which may change the protein a cell builds and may therefore affect the structure and function of the organism, and classify a described mutation as harmful, helpful, or neutral while recognizing that most mutations are neutral (NGSS MS-LS3-1).',
    },
  ],
  prerequisites: ['m7sci.punnett-squares'],
  followUps: ['m7sci.fossils-and-the-fossil-record'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a mutation as an ordinary copying slip whose effect is usually nothing at all.',
      script:
        'Copy out the words of a long song by hand and you will get a few letters wrong. Most of the time nobody notices, because the line still reads fine. Once in a while you change a word and the line stops making sense. Very rarely you change a word and the new line is better than the old one. Every cell in your body copies its whole set of DNA instructions before it divides, and that set is far longer than any song. So the copy comes out slightly different sometimes. We call one of those differences a mutation. Today we work out what a mutation actually does, and why the honest answer, most of the time, is nothing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mutations',
      kind: 'concept',
      goal: 'Define mutation, trace DNA to protein to organism, install the harmful-helpful-neutral split, kill the need-driven story, and separate inherited from not.',
      keyIdeas: [
        'A MUTATION IS A CHANGE IN THE DNA SEQUENCE. DNA is the instruction set inside your cells, written as an extremely long line of chemical letters. A mutation is a spot where those letters differ from the ones the parent cell carried. Mutations start in two ways. The first is a copying error: a cell copies all of its DNA before it divides, and a copy that long sometimes comes out slightly wrong. The second is an outside factor, such as strong ultraviolet light from the sun, X-rays, or chemicals in tobacco smoke.',
        'WHY A CHANGED LETTER CAN MATTER. A stretch of DNA is an instruction for building a protein, and proteins do the real work in a body. They build structures, carry oxygen, break down food, and give hair and skin their color. If a mutation changes the instruction, the protein may come out different, and a different protein may then change a structure or a function of the organism. Notice the word MAY, both times. A change in the DNA does not have to reach a protein, and a changed protein does not have to change anything a person would notice.',
        'THREE POSSIBLE OUTCOMES, AND MOST ARE NEUTRAL. A mutation can be HARMFUL, leaving the organism worse off. It can be HELPFUL, leaving it better off where it lives. Or it can be NEUTRAL, making no real difference at all. Neutral is by far the most common outcome, for two reasons: the change often lands in a stretch of DNA that is not an instruction for any protein, and even when it does hit an instruction the protein often still works the same. Most mutations are also invisible. Nothing about the organism looks different from the outside.',
        'THE ENVIRONMENT DECIDES WHETHER A CHANGE HELPS. THE ORGANISM DOES NOT. This is the hardest idea here and the one most often gotten wrong. Mutations happen by chance while DNA is copied or damaged, and they turn up whether or not anything could use them. WRONG: "The mice turned pale because they needed camouflage on the sand." CORRECT: "A chance change made one mouse pale, and because the sand is pale, that color turned out to help." The same pale coat that helps on pale sand hurts on dark rock. Harmful and helpful are not labels a mutation carries around with it; they depend on where the organism happens to live.',
        'ONLY SOME MUTATIONS ARE INHERITED. A mutation is copied into every cell that grows from the cell that carried it, and into no other cell. A mutation in a skin cell on your arm goes into the new skin cells that replace it, and it stops there. It never reaches your children. A mutation is passed on only when it is in the cells that make sex cells, the eggs and the sperm, because those are the only cells a whole new organism grows from. So damage done by the sun to a skin cell is real, and it is still not something a child can inherit.',
        'MUTATION IS THE ULTIMATE SOURCE OF NEW VARIATION. Members of a species differ from one another because they carry different versions of genes. Sexual reproduction shuffles versions that already exist, the way shuffling rearranges cards a deck already holds. Shuffling never invents a new card. Mutation is the only thing that makes a brand-new version in the first place, which means every version of every gene in every living thing began as a mutation. Hold onto that, because the next unit is about fossils and evolution, and variation is the raw material all of it works on.',
      ],
      vocabulary: [
        { term: 'mutation', definition: 'a change in the sequence of DNA in a cell.' },
        { term: 'protein', definition: 'a molecule built from a DNA instruction that does a job in the body, such as carrying oxygen or coloring hair.' },
        { term: 'neutral mutation', definition: 'a change in DNA that makes no real difference to the organism; this is the most common kind.' },
        { term: 'inherited mutation', definition: 'a mutation in an egg cell or a sperm cell, which can therefore appear in the offspring.' },
        { term: 'variation', definition: 'the differences among individual members of the same species.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-three-mutations',
      kind: 'worked_example',
      problem:
        'Three separate mutations appear in three different mice living on pale desert sand. Mutation 1 lands in a stretch of DNA that is not an instruction for any protein. Mutation 2 changes the protein that colors the fur, and the coat of that mouse comes out much paler than usual. Mutation 3 changes a protein that breaks down food, and the changed protein does that job badly. Label each one harmful, helpful, or neutral, and say what your label depends on.',
      steps: [
        'Work every one of these the same way. Ask two questions in order: does the change reach a protein, and if it does, what does that protein do for the organism?',
        'Mutation 1 never reaches a protein. The stretch of DNA it landed in is not an instruction for building one, so no protein comes out different and nothing about the mouse changes. Label it NEUTRAL. This is the most common outcome of all.',
        'Mutation 3 does reach a protein, and the changed protein does its job badly. Breaking down food matters every day of the life of that mouse, so this mouse gets less out of what it eats than the others do. It is worse off. Label it HARMFUL.',
        'Mutation 2 also reaches a protein, and this one shows: the coat is pale. Now ask where the mouse is. It is on pale sand, where a pale mouse is harder for a hawk overhead to pick out. Here the change HELPS.',
        'Now move that same mouse to a field of dark volcanic rock and change nothing whatever about its DNA. The pale coat now stands out sharply against the dark rock, and the very same mutation is HARMFUL. The label flipped while the mutation stayed exactly the same.',
        'WRONG way to tell the story of mutation 2: "The mouse turned pale because the sand was pale." CORRECT way: "A chance copying error turned the mouse pale, and the pale sand is what made that color worth having." The change always comes first. The surroundings only settle what it is worth.',
      ],
      answer:
        'Mutation 1 is neutral, because it never reaches a protein. Mutation 3 is harmful, because a protein that breaks down food now works badly. Mutation 2 is helpful on pale sand and would be harmful on dark rock. Harmful, helpful and neutral are not fixed labels: for anything that shows on the outside, the environment settles which one applies.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-inherited-or-not',
      kind: 'worked_example',
      problem:
        'A cat spends years lying in strong sunlight, and ultraviolet light causes a mutation in one skin cell on its back. In the same year, a copying error causes a mutation in one of the cells inside that cat which make egg cells. The cat later has kittens. Which of the two mutations, if either, can appear in the kittens?',
      steps: [
        'Ask one question about each mutation: which cells are going to end up carrying it?',
        'The first mutation is in one skin cell. When that cell divides, the new skin cells it makes carry the change as well. Every other cell in the cat grew from somewhere else, so the change stays inside that one small patch of skin.',
        'Now think about where a kitten comes from. A kitten grows from exactly two cells: one egg cell from the mother and one sperm cell from the father. So the only mutations a kitten can inherit are ones already sitting in an egg cell or a sperm cell.',
        'The second mutation is in a cell that makes egg cells. If the egg cell it produces is the one that becomes a kitten, then every single cell in that kitten carries the change, because the whole kitten grew out of that one cell.',
        'WRONG: "The sun damaged the DNA of the cat, so the kittens carry the damage too." CORRECT: "The sun damaged one skin cell of the cat, and nothing that happens to a skin cell can reach an egg cell."',
        'The same rule covers everything else that happens during a life. A cat that loses part of an ear in a fight does not have kittens with short ears. Changing a body part does not change the instructions stored in the egg cells.',
      ],
      answer:
        'Only the mutation in the cell that makes egg cells can appear in the kittens. A kitten grows from one egg cell and one sperm cell, so a mutation is inherited only when it sits in those cells; the skin mutation is copied into new skin cells and goes no further.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-most-are-neutral',
      kind: 'try_yourself',
      problem: 'Which statement about mutations is the most accurate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Every mutation is harmful, because any change to DNA damages the organism.' },
        { id: 'b', text: 'Most mutations are neutral and make no real difference to the organism.', correct: true },
        { id: 'c', text: 'Every mutation produces a change you can see from the outside.' },
        { id: 'd', text: 'Mutations happen only in organisms exposed to chemicals or radiation.' },
      ],
      expectedAnswer: 'Most mutations are neutral and make no real difference to the organism.',
      hints: [
        'Two of these say EVERY mutation does something. Ask yourself what happens when a change lands in a stretch of DNA that is not an instruction for any protein.',
        'One choice forgets the more ordinary cause of mutations, which has nothing to do with anything outside the organism at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-chance-not-demand',
      kind: 'try_yourself',
      problem:
        'A dish holds many bacteria. In one of them, a mutation changes a protein, and the changed protein is not affected by a certain medicine. The medicine is then added to the dish. Which statement describes what happened correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bacterium sensed the medicine and changed its own DNA on purpose.' },
        { id: 'b', text: 'The medicine taught the other bacteria how to build the changed protein.' },
        { id: 'c', text: 'The change was already there before the medicine arrived, and the medicine then left that bacterium growing while the others stopped.', correct: true },
        { id: 'd', text: 'The change must be helpful everywhere, because it turned out helpful in this dish.' },
      ],
      expectedAnswer: 'The change was already there before the medicine arrived, and the medicine then left that bacterium growing while the others stopped.',
      hints: [
        'Put the two events in order. Read the problem again and note which one is described as happening first.',
        'Remember that a mutation cannot be requested and cannot be handed from one organism to another. Also remember that helpful is a judgement about a place, not a property of the change itself.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-is-inherited',
      kind: 'try_yourself',
      problem:
        'A dog has a mutation in one skin cell on its back, caused by strong sunlight. A second dog has a mutation in one of the cells that make its egg cells, caused by a copying error. Which mutation can show up in puppies?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Only the mutation in the cell that makes egg cells.', correct: true },
        { id: 'b', text: 'Only the skin mutation, because something outside the body caused it.' },
        { id: 'c', text: 'Both of them, because a mutation in any body cell is passed to offspring.' },
        { id: 'd', text: 'Neither of them, because a mutation that appears during a life is never passed on.' },
      ],
      expectedAnswer: 'Only the mutation in the cell that makes egg cells.',
      hints: [
        'A puppy grows from two cells and two cells only. Ask which of these two mutations is sitting in one of them.',
        'A mutation in a skin cell is copied into the new skin cells that replace it, and no further than that.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mutations-on-demand',
      kind: 'misconception_check',
      question:
        'A student writes: "Mutations are mistakes, so they are always bad. And an animal develops the mutation it could use -- a rabbit living in the snow will grow white fur because the snow is white." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'All mutations are harmful, because a mutation is a mistake in the DNA.',
          misconception:
            'Reading "different from the usual sequence" as "damaged", because almost every mutation a student has heard named is either a disease or a movie monster.',
          correctsTo:
            'Most mutations are NEUTRAL. Many land in stretches of DNA that are not instructions for any protein, and many of the rest change a protein so slightly that it still does its job. Some mutations are harmful, and a few turn out helpful. You are carrying mutations right now and cannot tell, and so is everyone you know. Two habits fix this. Expect neutral first. And drop the movie meaning of the word mutant: a mutation is a changed sequence of DNA, and nothing about that is dramatic.',
        },
        {
          answer: 'An organism develops the mutation that would help it, so a rabbit in the snow grows white fur.',
          misconception:
            'Believing the surroundings can order a change into the DNA, because helpful traits and the places where they help do turn up together so often.',
          correctsTo:
            'Mutations happen by chance while DNA is copied or damaged, and they turn up whether or not anything could use them. The order of events never changes: the mutation happens FIRST, and the environment afterwards determines whether it helps, hurts, or makes no difference. In snowy country, chance changes to fur color keep appearing in rabbits, most of them making no difference at all. A paler rabbit is harder for a fox to spot against snow, so paler rabbits leave more offspring, and over many generations more of the population is pale. WRONG: "The rabbit turned white to survive the winter." CORRECT: "A chance change turned one rabbit white, and the snow is what made white worth having." No organism can order up a mutation, and wanting one has no effect whatever.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A mutation is a change in the DNA sequence, caused either by a copying error when a cell divides or by an outside factor such as ultraviolet light, X-rays or chemicals.',
        'A mutation MAY change the protein built from that stretch of DNA, and a changed protein MAY then change a structure or a function of the organism. Neither step is guaranteed.',
        'Three outcomes are possible -- harmful, helpful, neutral -- and MOST MUTATIONS ARE NEUTRAL. Most of them are invisible from the outside as well.',
        'Mutations happen by chance and never arrive on demand. The change comes first; the environment afterwards determines whether it helps, hurts, or makes no difference, and the same change can help in one place and hurt in another.',
        'A mutation is inherited only when it is in the cells that make eggs or sperm. A change in a skin cell is copied into new skin cells and stops there.',
        'Mutation is the only source of brand-new versions of genes, and therefore the ultimate source of variation -- the raw material that the next unit, on fossils and evolution, is entirely about.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Mutations & Variation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
