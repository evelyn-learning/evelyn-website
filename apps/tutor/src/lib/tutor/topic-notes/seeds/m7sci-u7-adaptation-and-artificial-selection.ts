/**
 * Grade 7 Science — Unit 7 CED 7.4: Adaptation & Artificial Selection.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.adaptation-and-artificial-selection.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U7_ADAPTATION_AND_ARTIFICIAL_SELECTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.adaptation-and-artificial-selection.v1',
  course: 'Grade 7 Science',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Adaptation & Artificial Selection',
  planId: 'evelyn.ms.m7sci.adaptation-and-artificial-selection.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.adaptation-and-artificial-selection.v1' }],
  theory: [
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'framework', title: 'What an adaptation is', content: `WHAT AN ADAPTATION IS — an adaptation is an inherited trait that became common in a population because the individuals carrying it survived and reproduced more often under those conditions. Every part of that sentence is doing work. The trait is INHERITED, so it is passed down. It is common in a POPULATION, not present in one animal. And it got that way across many GENERATIONS.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'framework', title: 'The error almost everyone makes once', content: `THE ERROR ALMOST EVERYONE MAKES ONCE — an individual does not adapt during its own life. In everyday speech we say a person adapted to a new school, and that loose meaning sneaks into science and ruins it. WRONG: "The mice adapted to the pale sand by turning a lighter color." CORRECT: "Some mice were already lighter. On pale sand they were harder for owls to see, so they raised more young, and over generations light fur became common in that population." In the first sentence an animal changes. In the second a population changes. Only the second one is adaptation.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'framework', title: 'Traits do not appear because they are needed', content: `TRAITS DO NOT APPEAR BECAUSE THEY ARE NEEDED — this is the same error wearing a different coat. Needing something cannot produce it. The inherited differences come first, by chance, and the conditions then act like a filter on differences that already exist. WRONG: "The plants grew deeper roots because the soil was dry." CORRECT: "Some plants already had deeper roots. In dry soil those plants lived to make seeds more often, so deep roots became common in the population."` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'framework', title: 'Artificial selection is the same machine with a person at the controls', content: `ARTIFICIAL SELECTION IS THE SAME MACHINE WITH A PERSON AT THE CONTROLS — in artificial selection, also called selective breeding, people choose which individuals get to reproduce. Everything else is identical: inherited differences already exist, something filters them, and the ones that pass the filter have the offspring. Dogs came from wolves this way. Corn came from a wild grass called teosinte. Most of the fruits, vegetables and farm animals you have ever eaten are the result of people repeating that choice season after season. Notice what people did NOT do. Nobody invented floppy ears or short legs. Those differences turned up among the animals first, and breeders bred from the ones that showed them.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'framework', title: 'The only real difference is the filter', content: `THE ONLY REAL DIFFERENCE IS THE FILTER — in natural selection the filter is the environment: cold, drought, disease, and animals that hunt you. In artificial selection the filter is human preference: sweeter, bigger, calmer, easier to harvest. Same process, different filter. Artificial selection is worth studying for a second reason too. A breeder can push a population a long way within a human lifetime, which makes it something people can actually watch happening, and that is strong evidence that choosing who reproduces really does reshape a population.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'framework', title: 'Adapted does not mean perfect, and it does not mean better', content: `ADAPTED DOES NOT MEAN PERFECT, AND IT DOES NOT MEAN BETTER — an adaptation only had to work better than the other versions that happened to be present at the time. It is not the best possible design, and nothing is aiming at one. It also only suits particular conditions. Thick fur is an advantage in a cold place and a serious problem in a hot one. There is no more advanced organism and no trait that is better everywhere.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'definition', title: 'adaptation', content: `an inherited trait that became common in a population because the individuals that had it survived and reproduced more often.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'definition', title: 'variation', content: `the inherited differences between individuals in a population, such as fur color, beak size or root depth.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'definition', title: 'population', content: `all the individuals of one kind of living thing in one area, which is the only thing that can adapt.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'definition', title: 'natural selection', content: `the process in which the environment filters inherited variation, so helpful variants become more common over generations.` },
    { loId: 'm7sci.adaptation-and-artificial-selection', kind: 'definition', title: 'artificial selection', content: `selective breeding, in which people rather than the environment choose which individuals reproduce.` },
  ],
  methods: [
    {
      title: 'Worked trace an adaptation',
      steps: [
        `Start with what was already there. In the original population the mice were not all identical. A few were paler than the rest, and fur color is inherited, so a pale mouse tends to have pale pups. That variation was present before any sand arrived.`,
        `Add the new conditions. On pale sand a dark mouse stands out and a pale mouse blends in. Owls hunting by sight catch the mice they can see.`,
        `Follow the surviving and the reproducing. Pale mice get caught less often, so more of them live long enough to have pups, and they have more pups over their lives than dark mice do.`,
        `Now count across one generation. Because pale parents leave more pups, a larger share of the next generation is pale. Repeat that generation after generation and the share of pale mice keeps climbing.`,
        `Notice what never happened. No mouse changed color. Every mouse lived and died with the fur it was born with. What changed is the mix of the population.`,
        `WRONG: "The mice adapted to the sand by turning pale." CORRECT: "Pale fur became common in the population because pale mice survived and reproduced more often on pale sand." Pale fur is now an adaptation in that population, and saying so is a statement about the population, never about one mouse.`,
      ],
      example: { problem: `A population of mice lives on dark soil, and most of them have dark fur. Pale sand blows in from a nearby beach until the ground where they live is pale. Owls hunt these mice by sight. After many generations, most of the mice in that population have pale fur. Explain how that happened, without ever saying that a mouse adapted.`, solution: `Pale mice were already present through inherited variation. On pale sand they were harder for owls to see, so they survived and reproduced more often, and the share of pale mice rose generation after generation until pale fur was common. No individual mouse ever changed color.` },
      relatedLoIds: ['m7sci.adaptation-and-artificial-selection'],
    },
    {
      title: 'Worked gardener selects corn',
      steps: [
        `Check the starting point. The sweetness differences were in the patch before the gardener did anything. Sweetness varied from plant to plant, and it is inherited, so a sweet plant tends to give sweet offspring.`,
        `Identify the filter. The gardener decides which plants reproduce, by saving their seed. Plants that are not sweet are simply never sown again. Human preference is doing the job the owls did for the mice.`,
        `Follow the generations. Each spring the new patch grows from sweet parents only, so it starts out sweeter than the patch before it. Repeat, and the sweetness of the patch keeps rising.`,
        `Name the process. This is artificial selection, also called selective breeding. The mechanism matches natural selection step for step: inherited variation, a filter, and different amounts of reproduction.`,
        `Say what the gardener did NOT do. The gardener did not invent sweetness and did not put it into the corn. The gardener chose among differences that were already there. If no plant in that patch had ever been sweeter than the others, no amount of choosing would have produced a sweet ear.`,
        `One more thing worth noticing. Sweet corn is what the gardener wants, not necessarily what helps corn survive on its own. A trait can spread because people prefer it even when it would be no help at all in a field with no people in it.`,
      ],
      example: { problem: `A gardener grows a large patch of corn. Some ears taste sweeter than others, and sweetness is inherited. Every year the gardener tastes the crop, saves seed only from the sweetest plants, and sows that seed the next spring. After many years almost every ear in the patch is sweet. Explain what the gardener did, and name what is playing the part the owls played for the mice.`, solution: `The gardener carried out artificial selection. Inherited sweetness differences already existed in the patch, and the gardener acted as the filter by letting only the sweetest plants reproduce, so sweetness became common over many generations. Human preference is playing the part the owls played, and the gardener selected among existing variation rather than creating it.` },
      relatedLoIds: ['m7sci.adaptation-and-artificial-selection'],
    },
  ],
  pointers: [
    { content: `Students often say "The deer adapted over the winter by growing thicker coats." — A deer growing a thicker coat as the days get colder is RESPONDING, in the same way that you shiver. Nothing about its genes changed, and its fawns will not be born with thicker coats because of that winter. An adaptation is an inherited trait that became common in a population over generations, because the individuals that had it survived and reproduced more often. Here is the part worth holding onto: the ABILITY to thicken a coat as the days shorten IS an adaptation in that deer population, and it became common across generations. Growing the coat is the response. The inherited ability to do it is the adaptation.`, kind: 'common-error' },
    { content: `Students often say "Dog breeders gave dogs brand new traits that no animal had before." — A breeder chooses parents. That is the whole job. Short legs, floppy ears and curly coats turned up as inherited differences among dogs first, and breeders bred from the animals that showed them, over and over, until those differences were everywhere in a breed. Artificial selection picks from variation that already exists rather than conjuring a trait out of nothing. That is exactly why it counts as the same process as natural selection, with human preference doing the filtering instead of the environment.`, kind: 'common-error' },
    { content: `An adaptation is an inherited trait that became common in a POPULATION over GENERATIONS, because the individuals that had it survived and reproduced more often.`, kind: 'tip' },
    { content: `No individual adapts during its own life. Growing a thicker coat in winter is responding, not adapting.`, kind: 'tip' },
    { content: `Traits never appear because they are needed. The inherited variation comes first, and the conditions filter it.`, kind: 'tip' },
    { content: `Artificial selection is the same process with people choosing which individuals reproduce: wolves to dogs, teosinte to corn, and most crops and farm animals.`, kind: 'tip' },
    { content: `The only real difference is the filter. Natural selection is filtered by the environment; artificial selection is filtered by human preference.`, kind: 'tip' },
    { content: `Adapted does not mean perfect or better. A trait only had to work better than the other versions present, and a trait that helps in one place can be a burden in another.`, kind: 'tip' },
    { content: `Never write "the animal adapted." Individuals don't adapt — populations do, over generations. If your sentence has one organism changing, rewrite it: "Some already had ___, they survived and reproduced more, so ___ became common."`, kind: 'common-error' },
    { content: `Cut the word "because it needed to" out of every answer. Traits don't show up on demand. The variation is already there by chance, and the conditions just filter it. "Plants grew deeper roots because the soil was dry" is wrong every time.`, kind: 'common-error' },
    { content: `Responding ≠ adapting. A dog's winter coat, a tan, shivering, or getting stronger from exercise all happen inside one life and are NOT passed to offspring. But the inherited *ability* to thicken a coat when days shorten IS an adaptation in that population.`, kind: 'vocab-note' },
    { content: `Breeders choose parents; they don't invent traits. Floppy ears, short legs and sweet corn already existed as inherited differences. If a trait never appeared in the group, no amount of selecting could produce it.`, kind: 'common-error' },
    { content: `Natural and artificial selection are the same machine — only the filter changes. Environment (owls, drought, cold) vs. human preference (sweeter, calmer, bigger). When you name the process, name the filter too.`, kind: 'tip' },
    { content: `A trait can spread through artificial selection even if it would hurt the organism in the wild. Sweet corn, giant meaty turkeys and squashed-face dogs suit people, not survival. "Selected for" doesn't mean "good for the animal."`, kind: 'edge-case' },
    { content: `Adapted doesn't mean perfect or advanced. A trait only had to beat the other versions that happened to be around. Thick fur wins in the cold and kills in the heat — no trait is better everywhere, and no species is "more evolved."`, kind: 'gotcha' },
    { content: `Your explanation isn't finished until you mention reproduction. Surviving alone changes nothing — the trait spreads only because those individuals left MORE offspring. Say "survived and reproduced more often," not just "survived."`, kind: 'tip' },
  ],
};
