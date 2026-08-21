/**
 * Grade 7 Science (Life Science) — Evolution: Natural Selection.
 *
 * Procedure-led, built on the Punnett-squares exemplar. The procedure here is
 * a four-step REASONING chain the student can run on any population:
 *   (1) the variation is already there, and it arose regardless of need;
 *   (2) more offspring are produced than survive, so there is competition;
 *   (3) individuals whose traits fit the CURRENT conditions survive and
 *       reproduce more often;
 *   (4) those traits become more common in the POPULATION over GENERATIONS.
 *
 * This is the highest-risk row in the course. The error it exists to kill is
 * the Lamarckian one: that an individual changes to suit its environment, or
 * that a trait appears because it was needed. Every segment is written so that
 * nothing outside a clearly labeled WRONG example ever says an organism
 * adapted, developed, grew or acquired a trait during its own life.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every item is
 * solvable from the words printed inside it. No statistics are invented, and
 * no example claims a measured rate or count.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U7_NATURAL_SELECTION: LessonPlan = {
  id: 'evelyn.ms.m7sci.natural-selection.v1',
  title: 'Natural Selection',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.natural-selection',
      standard: 'M7SCI-7.3',
      description:
        'Explain how natural selection changes a population over generations by running a four-step chain -- variation is already present in the population, more offspring are produced than survive, individuals whose traits fit the current conditions survive and reproduce more often, and those traits become more common in the population -- and correct the idea that an individual changes to suit its surroundings or gains a trait because it needs one (NGSS MS-LS4-4).',
    },
  ],
  prerequisites: ['m7sci.evidence-for-common-ancestry'],
  followUps: ['m7sci.adaptation-and-artificial-selection'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with a change the student has actually seen, and make clear the change happened to a group rather than to any one animal.',
      script:
        'Last summer the ant spray under the kitchen sink wiped out the trail of ants in an afternoon. This summer you spray the same stuff on the same trail and the ants barely slow down. The can did not get weaker, and no ant sat down and decided to toughen up. Something happened to the ant POPULATION instead, and it happened in about a year. Today you get the four steps that explain it. Once you have those four steps you can run them on beetles, on mice, on bacteria, on anything alive.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-steps',
      kind: 'concept',
      goal: 'Install the four-step chain, then spend real time on the Lamarckian error, on what is random and what is not, and on the fact that evolution has no goal.',
      keyIdeas: [
        'STEP 1 -- THE VARIATION IS ALREADY THERE. Before anything filters a population, it already contains individuals that differ: different colors, different sizes, different speeds. Those differences come from MUTATION, which is a random change in DNA, and from sexual reproduction shuffling alleles from two parents. Here is the part that matters most: variation arises regardless of need. A beetle is not born dark because dark would be useful. It is born dark, and whether that helps is decided later by the conditions it happens to live in.',
        'STEP 2 -- MORE OFFSPRING ARE PRODUCED THAN SURVIVE. A frog lays hundreds of eggs. A maple tree drops thousands of seeds. A pond or a field can only hold so many adults, so most of those young never reach adulthood. That gap is where competition comes from. There is not enough food, space, water and safety to go around, and every individual in the population is reaching for the same limited supply.',
        'STEP 3 -- INDIVIDUALS WHOSE TRAITS FIT THE CURRENT CONDITIONS SURVIVE AND REPRODUCE MORE OFTEN. This is the filter, and it is the whole engine. It does not judge who is best in general, only what works HERE and NOW. Fit does not mean strongest. Being smaller, quieter, duller in color or better hidden is very often the trait that fits, and a trait that fits in one place can be a disadvantage in the next valley over. Survival of the fittest really means survival of whatever happens to suit the current conditions.',
        'STEP 4 -- THOSE TRAITS BECOME MORE COMMON IN THE POPULATION OVER GENERATIONS. Nothing changes inside any one organism. What changes is the MIX. If dark beetles reproduce more often than pale ones, the next generation holds a larger share of dark beetles, and the generation after that a larger share still. A population can evolve. An individual cannot. Only a group has a share, and the share is the thing that shifts.',
        'THE ERROR THIS LESSON EXISTS TO KILL. WRONG: "The giraffes stretched their necks to reach higher leaves, and their offspring had longer necks." CORRECT: "Some giraffes already had longer necks. In a place where the high leaves mattered, those individuals survived and reproduced more often, so long necks became more common over generations." Stretching, exercising or trying hard changes one body during one life. It does not change the genes that body passes on. Watch for the giveaway phrases in your own writing -- "so that they could survive", "because they needed to", "the animal developed a thicker coat", "the insects adapted to the spray" -- and rewrite every one of them the same way: the variation existed, the conditions filtered it, the survivors reproduced.',
        'WHAT IS RANDOM, WHAT IS NOT, AND WHAT IS NOT AIMED ANYWHERE. The variation is random: mutations happen by chance and never arrive on order. The survival is NOT random: the conditions do a consistent job of filtering, which is why the outcome is predictable. And there is no goal anywhere in this process. Evolution is not aiming at anything, no organism wants to change, and no species is higher, better or more advanced than another. A trait spreads only because it fit the conditions at that time, and when the conditions change, the very same trait can stop helping.',
      ],
      vocabulary: [
        { term: 'variation', definition: 'the differences between individuals in a population, such as color, size or speed.' },
        { term: 'population', definition: 'all the individuals of one species living in the same area; the population is the thing that evolves.' },
        {
          term: 'natural selection',
          definition:
            'the process in which individuals whose traits fit the current conditions survive and reproduce more often, so those traits become more common in the population over generations.',
        },
        { term: 'generation', definition: 'one round of parents and the offspring they produce; changes from natural selection show up across many generations.' },
        { term: 'fitness', definition: 'in biology, how well an individual survives and reproduces in its current conditions -- not how strong or how large it is.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-four-steps',
      kind: 'worked_example',
      problem:
        'A population of beetles lives on tree bark. Most of the beetles are pale gray and a few are dark brown, and beetle color is passed from parent to offspring. The trees these beetles live on have dark bark, and birds hunt the beetles by sight. Run the four steps of natural selection and predict what the population looks like after many generations.',
      steps: [
        'Step 1, the variation is already there. The population already holds pale gray beetles and dark brown beetles. That difference came from mutation and from sexual reproduction mixing alleles, and it was there before any bird arrived. The dark bark did not create the dark beetles.',
        'Step 2, more offspring are produced than survive. Beetles lay far more eggs than the trees can ever feed and shelter, so most of the young beetles will never live long enough to reproduce. That means the beetles are in competition.',
        'Step 3, some traits fit the current conditions better. On dark bark, a dark brown beetle is hard for a bird to see, and a pale gray beetle stands out. Dark beetles are eaten less often, so more of them survive to reproduce.',
        'Step 4, the trait becomes more common in the population over generations. No beetle ever changes color. Each generation, dark parents leave a larger share of the offspring, so the share of dark beetles in the population climbs generation after generation.',
        'State the result in population words: after many generations, most of the beetles on those trees are dark brown. The change is a change in the mix of the population, not a change inside any single beetle.',
        'One last check, because this is where the meaning of fit gets clear. If these same beetles lived on pale bark instead, the same four steps would push the population the other way and pale gray would become common. Fit means fit for THESE conditions, never better in general.',
      ],
      answer:
        'All four steps hold, so after many generations most of the beetles in the population are dark brown. No individual beetle ever changed color -- dark beetles were already present, birds removed the pale ones more often, and the share of dark beetles in the population rose over generations.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-the-sentence',
      kind: 'worked_example',
      problem:
        'A farmer sprays a pesticide on a field of insects. The first year, the spray clears out almost all of them. A few years later the same spray barely works. A student writes: "The insects got used to the pesticide and toughened up so that they could survive it." Explain what is wrong with that sentence, then write a correct one.',
      steps: [
        'Name the mistake before anything else. The sentence has the insects gaining a trait because they needed it. Need does not hand out traits. An insect is born with its genes and dies with the same genes, so no insect can rewrite itself partway through its life to beat a chemical.',
        'Go to step 1 and ask where the variation actually came from. In a large field population, a few insects already carried a version of a gene that the pesticide does not affect. That version arose by chance mutation, before the farmer ever bought the spray, and it arose whether or not it was ever going to be useful.',
        'Now steps 2 and 3. The spray is a filter, not a designer. It killed the insects that did not carry that version and left the few that did. Those survivors were the ones that went on to reproduce.',
        'Now step 4. Because only the survivors had offspring, the next generation started out with a much larger share of insects carrying that version of the gene. Repeat that for a few seasons and the version is common through the whole field population.',
        'Write the correct sentence: "A few insects already carried a version of a gene that the pesticide does not affect. The spray killed the others, so the survivors produced the next generation, and over several generations that version became common in the population."',
        'Compare the two sentences and notice the habit. In the correct one, the population changes and the individuals do not, and the word needed never causes anything.',
      ],
      answer:
        'The insects did not toughen up, and nothing happened because it was needed. A few insects already carried a version of a gene that the pesticide does not affect; the spray removed the rest; the survivors reproduced, so that version became common in the POPULATION over several generations.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-mice-on-dark-rock',
      kind: 'try_yourself',
      problem:
        'A population of mice lives on pale sand. Most of the mice have pale fur and a few have dark fur, and fur color is inherited. A patch of dark volcanic rock spreads across part of the area, and owls hunt the mice by sight. After many generations, most of the mice living on the dark rock have dark fur. Which statement explains this correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mice on the dark rock darkened their fur to match it, and their pups were born dark' },
        {
          id: 'b',
          text: 'Dark-furred mice were already present. On the dark rock they were harder for owls to see, so they survived and reproduced more often, and dark fur became more common over generations',
          correct: true,
        },
        { id: 'c', text: 'The mice needed darker fur to hide on the dark rock, so the population began producing dark pups' },
        { id: 'd', text: 'The dark rock caused mutations that gave the mice exactly the fur color they required' },
      ],
      expectedAnswer:
        'Dark-furred mice were already present. On the dark rock they were harder for owls to see, so they survived and reproduced more often, and dark fur became more common over generations',
      hints: [
        'Read the second sentence of the problem again. Dark-furred mice were in the population BEFORE the dark rock spread. What does that tell you about where the dark fur came from?',
        'No mouse changes its fur color during its life, and needing something never produces it. Look for the choice in which only the SHARE of dark mice in the population changes, across generations.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-fittest-means',
      kind: 'try_yourself',
      problem:
        'In a lizard population, some lizards are large and brightly colored and some are small and dull brown. Hawks hunt the area by sight. Over many generations the small dull lizards become more common. A classmate says this cannot be right, because survival of the fittest means the strongest survive. What does fittest actually mean here?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The strongest and largest individuals, because they win fights over territory' },
        {
          id: 'b',
          text: 'The individuals whose traits fit the current conditions, which here means being hard for hawks to spot',
          correct: true,
        },
        { id: 'c', text: 'The individuals that live the longest, whether or not they ever reproduce' },
        { id: 'd', text: 'The individuals that are the most advanced, since evolution works toward better animals' },
      ],
      expectedAnswer: 'The individuals whose traits fit the current conditions, which here means being hard for hawks to spot',
      hints: [
        'Ask what the hawks are actually doing. They hunt by sight, so which lizards do they find first?',
        'Fit is measured against the conditions the population is living in right now, not against strength, not against lifespan, and not against some ranking of better and worse animals.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-random-or-not',
      kind: 'try_yourself',
      problem:
        'A patient takes an antibiotic. Most of the bacteria causing the infection die, but a few that already carried a version of a gene the drug does not affect survive and reproduce, and the infection comes back. A student says natural selection is completely random. Which statement about randomness is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is all random: which bacteria carried the version and which ones survived were both matters of chance' },
        { id: 'b', text: 'None of it is random: the bacteria produced the version of the gene they needed in order to survive the drug' },
        {
          id: 'c',
          text: 'The version of the gene appeared by chance, but survival was not random -- the drug removed the bacteria without it and left the ones that had it',
          correct: true,
        },
        { id: 'd', text: 'The drug caused the version of the gene to appear, and then which bacteria survived was random' },
      ],
      expectedAnswer:
        'The version of the gene appeared by chance, but survival was not random -- the drug removed the bacteria without it and left the ones that had it',
      hints: [
        'Split the question in two. First ask how the version of the gene got into the population, then ask what decided which bacteria lived.',
        'Mutations happen by chance and never arrive on order. The drug, on the other hand, filters in a completely consistent way -- and something consistent is not random.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-lamarck-and-ladder',
      kind: 'misconception_check',
      question:
        'A student writes: "The giraffes stretched their necks to reach higher leaves, and their offspring had longer necks." What is wrong with that sentence, and how should it be written instead?',
      commonErrors: [
        {
          answer: 'The giraffes stretched their necks to reach higher leaves, and their offspring had longer necks.',
          misconception:
            'Letting an individual do the evolving, and letting need hand out the trait. Stretching happens to one animal during one life. It does not change the genes that animal passes on, and no amount of reaching for leaves instructs the next generation to be born taller. This is the same mistake as "the insects toughened up because they needed to" and "the mouse grew thicker fur when the winter got cold".',
          correctsTo:
            'Say it this way instead: "Some giraffes already had longer necks. In a place where the high leaves mattered, those individuals survived and reproduced more often, so long necks became more common over generations." Run the four steps to check it. The variation was already there and came from mutation and sexual reproduction. More young were born than the land could feed. The longer-necked individuals reached food the others could not and left more offspring. So the SHARE of long-necked giraffes in the POPULATION rose, generation after generation. The habit that fixes this permanently: whenever you catch yourself writing that an animal changed, stop and ask which individuals were already different, and which ones left more offspring.',
        },
        {
          answer: 'Evolution has been making animals better and better, so a giraffe is more evolved than a beetle.',
          misconception:
            'Treating evolution as a ladder with a goal at the top, and treating some living things as higher or more advanced than others.',
          correctsTo:
            'Evolution has no goal and no direction. Nothing is aiming at better, and there is no top of any ladder. A trait becomes common only because it fit the conditions at that time, and if the conditions change, that same trait can stop helping and become rare again. Beetles and giraffes are both alive right now, which means both of their lines have been shaped by exactly the same stretch of time and exactly as many generations of filtering. Neither one is more evolved than the other.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Step 1: the variation is already in the population, from mutation and sexual reproduction, and it arises regardless of need.',
        'Step 2: more offspring are produced than survive, so individuals are in competition.',
        'Step 3: individuals whose traits fit the CURRENT conditions survive and reproduce more often.',
        'Step 4: those traits become more common in the POPULATION over GENERATIONS.',
        'POPULATIONS evolve; individuals do not. What shifts is the share of a trait in the group, never something inside one organism.',
        'Fit means suited to the current conditions -- often smaller, quieter or better hidden, not strongest.',
        'The variation is random; the survival is not. Evolution has no goal, and no species is higher or more advanced than another.',
        'WRONG: "The giraffes stretched their necks and their offspring had longer necks." CORRECT: some giraffes already had longer necks, those individuals reproduced more often, and long necks became more common over generations.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Natural Selection' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
