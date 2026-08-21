/**
 * Grade 7 Science — Unit 7 CED 7.3: Natural Selection.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.natural-selection.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U7_NATURAL_SELECTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.natural-selection.v1',
  course: 'Grade 7 Science',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Natural Selection',
  planId: 'evelyn.ms.m7sci.natural-selection.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.natural-selection.v1' }],
  theory: [
    { loId: 'm7sci.natural-selection', content: `STEP 1 -- THE VARIATION IS ALREADY THERE. Before anything filters a population, it already contains individuals that differ: different colors, different sizes, different speeds. Those differences come from MUTATION, which is a random change in DNA, and from sexual reproduction shuffling alleles from two parents. Here is the part that matters most: variation arises regardless of need. A beetle is not born dark because dark would be useful. It is born dark, and whether that helps is decided later by the conditions it happens to live in.` },
    { loId: 'm7sci.natural-selection', content: `STEP 2 -- MORE OFFSPRING ARE PRODUCED THAN SURVIVE. A frog lays hundreds of eggs. A maple tree drops thousands of seeds. A pond or a field can only hold so many adults, so most of those young never reach adulthood. That gap is where competition comes from. There is not enough food, space, water and safety to go around, and every individual in the population is reaching for the same limited supply.` },
    { loId: 'm7sci.natural-selection', content: `STEP 3 -- INDIVIDUALS WHOSE TRAITS FIT THE CURRENT CONDITIONS SURVIVE AND REPRODUCE MORE OFTEN. This is the filter, and it is the whole engine. It does not judge who is best in general, only what works HERE and NOW. Fit does not mean strongest. Being smaller, quieter, duller in color or better hidden is very often the trait that fits, and a trait that fits in one place can be a disadvantage in the next valley over. Survival of the fittest really means survival of whatever happens to suit the current conditions.` },
    { loId: 'm7sci.natural-selection', content: `STEP 4 -- THOSE TRAITS BECOME MORE COMMON IN THE POPULATION OVER GENERATIONS. Nothing changes inside any one organism. What changes is the MIX. If dark beetles reproduce more often than pale ones, the next generation holds a larger share of dark beetles, and the generation after that a larger share still. A population can evolve. An individual cannot. Only a group has a share, and the share is the thing that shifts.` },
    { loId: 'm7sci.natural-selection', content: `THE ERROR THIS LESSON EXISTS TO KILL. WRONG: "The giraffes stretched their necks to reach higher leaves, and their offspring had longer necks." CORRECT: "Some giraffes already had longer necks. In a place where the high leaves mattered, those individuals survived and reproduced more often, so long necks became more common over generations." Stretching, exercising or trying hard changes one body during one life. It does not change the genes that body passes on. Watch for the giveaway phrases in your own writing -- "so that they could survive", "because they needed to", "the animal developed a thicker coat", "the insects adapted to the spray" -- and rewrite every one of them the same way: the variation existed, the conditions filtered it, the survivors reproduced.` },
    { loId: 'm7sci.natural-selection', content: `WHAT IS RANDOM, WHAT IS NOT, AND WHAT IS NOT AIMED ANYWHERE. The variation is random: mutations happen by chance and never arrive on order. The survival is NOT random: the conditions do a consistent job of filtering, which is why the outcome is predictable. And there is no goal anywhere in this process. Evolution is not aiming at anything, no organism wants to change, and no species is higher, better or more advanced than another. A trait spreads only because it fit the conditions at that time, and when the conditions change, the very same trait can stop helping.` },
    { loId: 'm7sci.natural-selection', kind: 'definition', title: 'variation', content: `the differences between individuals in a population, such as color, size or speed.` },
    { loId: 'm7sci.natural-selection', kind: 'definition', title: 'population', content: `all the individuals of one species living in the same area; the population is the thing that evolves.` },
    { loId: 'm7sci.natural-selection', kind: 'definition', title: 'natural selection', content: `the process in which individuals whose traits fit the current conditions survive and reproduce more often, so those traits become more common in the population over generations.` },
    { loId: 'm7sci.natural-selection', kind: 'definition', title: 'generation', content: `one round of parents and the offspring they produce; changes from natural selection show up across many generations.` },
    { loId: 'm7sci.natural-selection', kind: 'definition', title: 'fitness', content: `in biology, how well an individual survives and reproduces in its current conditions -- not how strong or how large it is.` },
  ],
  methods: [
    {
      title: 'Worked run the four steps',
      steps: [
        `Step 1, the variation is already there. The population already holds pale gray beetles and dark brown beetles. That difference came from mutation and from sexual reproduction mixing alleles, and it was there before any bird arrived. The dark bark did not create the dark beetles.`,
        `Step 2, more offspring are produced than survive. Beetles lay far more eggs than the trees can ever feed and shelter, so most of the young beetles will never live long enough to reproduce. That means the beetles are in competition.`,
        `Step 3, some traits fit the current conditions better. On dark bark, a dark brown beetle is hard for a bird to see, and a pale gray beetle stands out. Dark beetles are eaten less often, so more of them survive to reproduce.`,
        `Step 4, the trait becomes more common in the population over generations. No beetle ever changes color. Each generation, dark parents leave a larger share of the offspring, so the share of dark beetles in the population climbs generation after generation.`,
        `State the result in population words: after many generations, most of the beetles on those trees are dark brown. The change is a change in the mix of the population, not a change inside any single beetle.`,
        `One last check, because this is where the meaning of fit gets clear. If these same beetles lived on pale bark instead, the same four steps would push the population the other way and pale gray would become common. Fit means fit for THESE conditions, never better in general.`,
      ],
      example: { problem: `A population of beetles lives on tree bark. Most of the beetles are pale gray and a few are dark brown, and beetle color is passed from parent to offspring. The trees these beetles live on have dark bark, and birds hunt the beetles by sight. Run the four steps of natural selection and predict what the population looks like after many generations.`, solution: `All four steps hold, so after many generations most of the beetles in the population are dark brown. No individual beetle ever changed color -- dark beetles were already present, birds removed the pale ones more often, and the share of dark beetles in the population rose over generations.` },
      relatedLoIds: ['m7sci.natural-selection'],
    },
    {
      title: 'Worked fix the sentence',
      steps: [
        `Name the mistake before anything else. The sentence has the insects gaining a trait because they needed it. Need does not hand out traits. An insect is born with its genes and dies with the same genes, so no insect can rewrite itself partway through its life to beat a chemical.`,
        `Go to step 1 and ask where the variation actually came from. In a large field population, a few insects already carried a version of a gene that the pesticide does not affect. That version arose by chance mutation, before the farmer ever bought the spray, and it arose whether or not it was ever going to be useful.`,
        `Now steps 2 and 3. The spray is a filter, not a designer. It killed the insects that did not carry that version and left the few that did. Those survivors were the ones that went on to reproduce.`,
        `Now step 4. Because only the survivors had offspring, the next generation started out with a much larger share of insects carrying that version of the gene. Repeat that for a few seasons and the version is common through the whole field population.`,
        `Write the correct sentence: "A few insects already carried a version of a gene that the pesticide does not affect. The spray killed the others, so the survivors produced the next generation, and over several generations that version became common in the population."`,
        `Compare the two sentences and notice the habit. In the correct one, the population changes and the individuals do not, and the word needed never causes anything.`,
      ],
      example: { problem: `A farmer sprays a pesticide on a field of insects. The first year, the spray clears out almost all of them. A few years later the same spray barely works. A student writes: "The insects got used to the pesticide and toughened up so that they could survive it." Explain what is wrong with that sentence, then write a correct one.`, solution: `The insects did not toughen up, and nothing happened because it was needed. A few insects already carried a version of a gene that the pesticide does not affect; the spray removed the rest; the survivors reproduced, so that version became common in the POPULATION over several generations.` },
      relatedLoIds: ['m7sci.natural-selection'],
    },
  ],
  pointers: [
    { content: `Students often say "The giraffes stretched their necks to reach higher leaves, and their offspring had longer necks." — Say it this way instead: "Some giraffes already had longer necks. In a place where the high leaves mattered, those individuals survived and reproduced more often, so long necks became more common over generations." Run the four steps to check it. The variation was already there and came from mutation and sexual reproduction. More young were born than the land could feed. The longer-necked individuals reached food the others could not and left more offspring. So the SHARE of long-necked giraffes in the POPULATION rose, generation after generation. The habit that fixes this permanently: whenever you catch yourself writing that an animal changed, stop and ask which individuals were already different, and which ones left more offspring.`, kind: 'common-error' },
    { content: `Students often say "Evolution has been making animals better and better, so a giraffe is more evolved than a beetle." — Evolution has no goal and no direction. Nothing is aiming at better, and there is no top of any ladder. A trait becomes common only because it fit the conditions at that time, and if the conditions change, that same trait can stop helping and become rare again. Beetles and giraffes are both alive right now, which means both of their lines have been shaped by exactly the same stretch of time and exactly as many generations of filtering. Neither one is more evolved than the other.`, kind: 'common-error' },
    { content: `Step 1: the variation is already in the population, from mutation and sexual reproduction, and it arises regardless of need.`, kind: 'tip' },
    { content: `Step 2: more offspring are produced than survive, so individuals are in competition.`, kind: 'tip' },
    { content: `Step 3: individuals whose traits fit the CURRENT conditions survive and reproduce more often.`, kind: 'tip' },
    { content: 'Step 4: those traits become more common in the POPULATION over GENERATIONS.', kind: 'tip' },
    { content: `POPULATIONS evolve; individuals do not. What shifts is the share of a trait in the group, never something inside one organism.`, kind: 'tip' },
    { content: `Fit means suited to the current conditions -- often smaller, quieter or better hidden, not strongest.`, kind: 'tip' },
    { content: `The variation is random; the survival is not. Evolution has no goal, and no species is higher or more advanced than another.`, kind: 'tip' },
    { content: `WRONG: "The giraffes stretched their necks and their offspring had longer necks." CORRECT: some giraffes already had longer necks, those individuals reproduced more often, and long necks became more common over generations.`, kind: 'tip' },
    { content: `Never write that an animal "adapted to" or "developed" a trait during its life. Ban these phrases: *so that they could survive*, *because they needed to*, *got used to*, *toughened up*. Rewrite every one as: the variation was already there, the conditions filtered it, the survivors reproduced.`, kind: 'common-error' },
    { content: `Say the POPULATION changed, not the organism. "The beetles turned dark" is wrong; "the share of dark beetles rose" is right. No beetle ever changed color. If your sentence has one animal doing the evolving, it's wrong.`, kind: 'vocab-note' },
    { content: `"Fittest" does not mean strongest, biggest, or fastest. Fitness means how well an individual survives and reproduces **in its current conditions**. Small, dull, quiet and well-hidden are often the fittest traits.`, kind: 'vocab-note' },
    { content: `Half of natural selection is random and half is not. The mutation is random — it shows up by chance, before it is ever useful. The survival is NOT random — the conditions filter the same way every time. Don't call the whole process random or the whole process purposeful.`, kind: 'gotcha' },
    { content: `A trait that fits here can be a disadvantage next valley over. Dark beetles win on dark bark and lose on pale bark. When you name a trait as helpful, always name the conditions in the same sentence.`, kind: 'edge-case' },
    { content: `Evolution is not a ladder. No living species is higher, better, or more evolved than another. A giraffe and a beetle are both here now, so both lines have had exactly the same amount of time and the same number of generations of filtering.`, kind: 'common-error' },
    { content: `Natural selection needs many generations, so it only works on inherited traits. A dog that gets strong from running or a person with a scar passes on none of that. Before you run the four steps, check the problem says the trait is inherited.`, kind: 'tip' },
    { content: `Pesticides and antibiotics don't create resistant bugs — they remove the ones without resistance. The resistant version existed by chance before the spray or the drug arrived. Say the drug filtered, never that the drug caused the change.`, kind: 'gotcha' },
  ],
};
