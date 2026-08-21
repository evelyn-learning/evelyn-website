/**
 * Grade 7 Science (Life Science) — Heredity & Evolution: Adaptation &
 * Artificial Selection.
 *
 * The lesson that finishes what natural selection started (NGSS MS-LS4-5 and
 * MS-LS4-6). One error swallows this whole topic: letting an INDIVIDUAL adapt
 * during its own life, or letting a trait show up because it was needed. Both
 * are handled head-on, and artificial selection is taught as the same machine
 * with a human doing the filtering instead of the environment.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item here
 * is solvable from the words printed in it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U7_ADAPTATION_AND_ARTIFICIAL_SELECTION: LessonPlan = {
  id: 'evelyn.ms.m7sci.adaptation-and-artificial-selection.v1',
  title: 'Adaptation & Artificial Selection',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.adaptation-and-artificial-selection',
      standard: 'M7SCI-7.4',
      description:
        'Explain that an adaptation is an inherited trait that became common in a population over generations because the individuals carrying it survived and reproduced more often, and describe how people use artificial selection to influence the inherited traits of dogs, crops and farm animals (NGSS MS-LS4-5 and MS-LS4-6).',
    },
  ],
  prerequisites: ['m7sci.natural-selection'],
  followUps: ['m7sci.classifying-living-things'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with two dogs that look nothing alike, and put the human choosing in plain view.',
      script:
        'Picture a chihuahua standing next to a great dane at the park. Same kind of animal. Both of them came from wolves. Nobody waved a wand over a wolf and turned it into a lap dog, and no wolf ever decided to become one. People simply chose, over and over across many generations of dogs, which dogs would have puppies. That is one whole half of today. The other half is the same thing happening with nobody choosing at all, out in a field, to a population of mice.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-adaptation-and-selection',
      kind: 'concept',
      goal: 'Define adaptation at the population level, kill the individual-adapts and need-causes-traits errors, and show artificial selection as the same mechanism with a human filter.',
      keyIdeas: [
        'WHAT AN ADAPTATION IS — an adaptation is an inherited trait that became common in a population because the individuals carrying it survived and reproduced more often under those conditions. Every part of that sentence is doing work. The trait is INHERITED, so it is passed down. It is common in a POPULATION, not present in one animal. And it got that way across many GENERATIONS.',
        'THE ERROR ALMOST EVERYONE MAKES ONCE — an individual does not adapt during its own life. In everyday speech we say a person adapted to a new school, and that loose meaning sneaks into science and ruins it. WRONG: "The mice adapted to the pale sand by turning a lighter color." CORRECT: "Some mice were already lighter. On pale sand they were harder for owls to see, so they raised more young, and over generations light fur became common in that population." In the first sentence an animal changes. In the second a population changes. Only the second one is adaptation.',
        'TRAITS DO NOT APPEAR BECAUSE THEY ARE NEEDED — this is the same error wearing a different coat. Needing something cannot produce it. The inherited differences come first, by chance, and the conditions then act like a filter on differences that already exist. WRONG: "The plants grew deeper roots because the soil was dry." CORRECT: "Some plants already had deeper roots. In dry soil those plants lived to make seeds more often, so deep roots became common in the population."',
        'ARTIFICIAL SELECTION IS THE SAME MACHINE WITH A PERSON AT THE CONTROLS — in artificial selection, also called selective breeding, people choose which individuals get to reproduce. Everything else is identical: inherited differences already exist, something filters them, and the ones that pass the filter have the offspring. Dogs came from wolves this way. Corn came from a wild grass called teosinte. Most of the fruits, vegetables and farm animals you have ever eaten are the result of people repeating that choice season after season. Notice what people did NOT do. Nobody invented floppy ears or short legs. Those differences turned up among the animals first, and breeders bred from the ones that showed them.',
        'THE ONLY REAL DIFFERENCE IS THE FILTER — in natural selection the filter is the environment: cold, drought, disease, and animals that hunt you. In artificial selection the filter is human preference: sweeter, bigger, calmer, easier to harvest. Same process, different filter. Artificial selection is worth studying for a second reason too. A breeder can push a population a long way within a human lifetime, which makes it something people can actually watch happening, and that is strong evidence that choosing who reproduces really does reshape a population.',
        'ADAPTED DOES NOT MEAN PERFECT, AND IT DOES NOT MEAN BETTER — an adaptation only had to work better than the other versions that happened to be present at the time. It is not the best possible design, and nothing is aiming at one. It also only suits particular conditions. Thick fur is an advantage in a cold place and a serious problem in a hot one. There is no more advanced organism and no trait that is better everywhere.',
      ],
      vocabulary: [
        { term: 'adaptation', definition: 'an inherited trait that became common in a population because the individuals that had it survived and reproduced more often.' },
        { term: 'variation', definition: 'the inherited differences between individuals in a population, such as fur color, beak size or root depth.' },
        { term: 'population', definition: 'all the individuals of one kind of living thing in one area, which is the only thing that can adapt.' },
        { term: 'natural selection', definition: 'the process in which the environment filters inherited variation, so helpful variants become more common over generations.' },
        { term: 'artificial selection', definition: 'selective breeding, in which people rather than the environment choose which individuals reproduce.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-an-adaptation',
      kind: 'worked_example',
      problem:
        'A population of mice lives on dark soil, and most of them have dark fur. Pale sand blows in from a nearby beach until the ground where they live is pale. Owls hunt these mice by sight. After many generations, most of the mice in that population have pale fur. Explain how that happened, without ever saying that a mouse adapted.',
      steps: [
        'Start with what was already there. In the original population the mice were not all identical. A few were paler than the rest, and fur color is inherited, so a pale mouse tends to have pale pups. That variation was present before any sand arrived.',
        'Add the new conditions. On pale sand a dark mouse stands out and a pale mouse blends in. Owls hunting by sight catch the mice they can see.',
        'Follow the surviving and the reproducing. Pale mice get caught less often, so more of them live long enough to have pups, and they have more pups over their lives than dark mice do.',
        'Now count across one generation. Because pale parents leave more pups, a larger share of the next generation is pale. Repeat that generation after generation and the share of pale mice keeps climbing.',
        'Notice what never happened. No mouse changed color. Every mouse lived and died with the fur it was born with. What changed is the mix of the population.',
        'WRONG: "The mice adapted to the sand by turning pale." CORRECT: "Pale fur became common in the population because pale mice survived and reproduced more often on pale sand." Pale fur is now an adaptation in that population, and saying so is a statement about the population, never about one mouse.',
      ],
      answer:
        'Pale mice were already present through inherited variation. On pale sand they were harder for owls to see, so they survived and reproduced more often, and the share of pale mice rose generation after generation until pale fur was common. No individual mouse ever changed color.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gardener-selects-corn',
      kind: 'worked_example',
      problem:
        'A gardener grows a large patch of corn. Some ears taste sweeter than others, and sweetness is inherited. Every year the gardener tastes the crop, saves seed only from the sweetest plants, and sows that seed the next spring. After many years almost every ear in the patch is sweet. Explain what the gardener did, and name what is playing the part the owls played for the mice.',
      steps: [
        'Check the starting point. The sweetness differences were in the patch before the gardener did anything. Sweetness varied from plant to plant, and it is inherited, so a sweet plant tends to give sweet offspring.',
        'Identify the filter. The gardener decides which plants reproduce, by saving their seed. Plants that are not sweet are simply never sown again. Human preference is doing the job the owls did for the mice.',
        'Follow the generations. Each spring the new patch grows from sweet parents only, so it starts out sweeter than the patch before it. Repeat, and the sweetness of the patch keeps rising.',
        'Name the process. This is artificial selection, also called selective breeding. The mechanism matches natural selection step for step: inherited variation, a filter, and different amounts of reproduction.',
        'Say what the gardener did NOT do. The gardener did not invent sweetness and did not put it into the corn. The gardener chose among differences that were already there. If no plant in that patch had ever been sweeter than the others, no amount of choosing would have produced a sweet ear.',
        'One more thing worth noticing. Sweet corn is what the gardener wants, not necessarily what helps corn survive on its own. A trait can spread because people prefer it even when it would be no help at all in a field with no people in it.',
      ],
      answer:
        'The gardener carried out artificial selection. Inherited sweetness differences already existed in the patch, and the gardener acted as the filter by letting only the sweetest plants reproduce, so sweetness became common over many generations. Human preference is playing the part the owls played, and the gardener selected among existing variation rather than creating it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-population-not-individual',
      kind: 'try_yourself',
      problem:
        'On an island, a population of finches eats seeds. Beak size is inherited and differs from bird to bird. A long dry spell leaves mostly large, hard seeds, which only birds with deep, strong beaks can crack open. After many generations, deep beaks are much more common in that population. Which statement explains this correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each finch strengthened its own beak by cracking hard seeds, and its chicks hatched with stronger beaks.' },
        { id: 'b', text: 'Some finches already had deeper beaks, those birds fed well on the large seeds and raised more chicks, so deep beaks became more common over generations.', correct: true },
        { id: 'c', text: 'The finches needed deeper beaks to reach the food, so the population produced deeper beaks.' },
        { id: 'd', text: 'The dry spell turned the finches into a more advanced kind of bird than the finches on rainier islands.' },
      ],
      expectedAnswer:
        'Some finches already had deeper beaks, those birds fed well on the large seeds and raised more chicks, so deep beaks became more common over generations.',
      hints: [
        'Ask when the deep beaks first showed up. Were they in the population before the dry spell, or did the dry spell make them?',
        'A beak does not change size during the life of one bird. Look for the choice in which the only thing that changes is the mix of birds in the population.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-artificial-selection',
      kind: 'try_yourself',
      problem:
        'Dog breeds as different as a great dane and a chihuahua all came from wolves, through people breeding dogs for the traits they wanted. Which statement about that is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'People chose which dogs would have puppies, generation after generation, so traits that already varied among dogs became common in particular breeds.', correct: true },
        { id: 'b', text: 'People created brand new traits that had never appeared in any wolf or dog, and put them into the puppies.' },
        { id: 'c', text: 'The wolves changed themselves during their lifetimes to become smaller and friendlier so that people would feed them.' },
        { id: 'd', text: 'The breeds show that dogs are further along in evolution than wolves are.' },
      ],
      expectedAnswer:
        'People chose which dogs would have puppies, generation after generation, so traits that already varied among dogs became common in particular breeds.',
      hints: [
        'Breeding can only work on differences that are already present in the animals being bred.',
        'Ask what a breeder actually controls. A breeder does not build a puppy. A breeder decides which adults become parents.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-responding-versus-adapting',
      kind: 'try_yourself',
      problem:
        'In November a student notices that the family dog has grown a thicker coat than it had in the summer. The student says the dog has adapted to winter. Is that the right use of the word adaptation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Yes, because the dog changed in a way that helps it survive the cold, and any helpful change is an adaptation.' },
        { id: 'b', text: 'Yes, and any puppies the dog has next spring will be born with thicker coats because of this winter.' },
        { id: 'c', text: 'No. The dog is responding to cold weather within its own life. An adaptation is an inherited trait that became common in a population across generations.', correct: true },
        { id: 'd', text: 'No, because a thick coat can never be an adaptation for any animal, since a thick coat is a disadvantage in hot weather.' },
      ],
      expectedAnswer:
        'No. The dog is responding to cold weather within its own life. An adaptation is an inherited trait that became common in a population across generations.',
      hints: [
        'Two questions decide whether the word fits: how many organisms are involved, and how many generations.',
        'Growing a thicker coat in winter is like sweating on a hot day. It is something a body does during one life, and the weather does not write it into the next generation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-individuals-adapt-and-breeders-create',
      kind: 'misconception_check',
      question:
        'A student writes: "Over the winter the deer in the woods adapted by growing thicker coats. That is the same thing dog breeders did, except that breeders gave dogs brand new traits no animal had before." Two separate things in that are wrong. What are they?',
      commonErrors: [
        {
          answer: 'The deer adapted over the winter by growing thicker coats.',
          misconception:
            'Letting one animal adapt during its own life, because in everyday speech the word adapt just means to get used to something.',
          correctsTo:
            'A deer growing a thicker coat as the days get colder is RESPONDING, in the same way that you shiver. Nothing about its genes changed, and its fawns will not be born with thicker coats because of that winter. An adaptation is an inherited trait that became common in a population over generations, because the individuals that had it survived and reproduced more often. Here is the part worth holding onto: the ABILITY to thicken a coat as the days shorten IS an adaptation in that deer population, and it became common across generations. Growing the coat is the response. The inherited ability to do it is the adaptation.',
        },
        {
          answer: 'Dog breeders gave dogs brand new traits that no animal had before.',
          misconception:
            'Thinking a breeder creates traits, because the results look designed and look nothing like a wolf.',
          correctsTo:
            'A breeder chooses parents. That is the whole job. Short legs, floppy ears and curly coats turned up as inherited differences among dogs first, and breeders bred from the animals that showed them, over and over, until those differences were everywhere in a breed. Artificial selection picks from variation that already exists rather than conjuring a trait out of nothing. That is exactly why it counts as the same process as natural selection, with human preference doing the filtering instead of the environment.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An adaptation is an inherited trait that became common in a POPULATION over GENERATIONS, because the individuals that had it survived and reproduced more often.',
        'No individual adapts during its own life. Growing a thicker coat in winter is responding, not adapting.',
        'Traits never appear because they are needed. The inherited variation comes first, and the conditions filter it.',
        'Artificial selection is the same process with people choosing which individuals reproduce: wolves to dogs, teosinte to corn, and most crops and farm animals.',
        'The only real difference is the filter. Natural selection is filtered by the environment; artificial selection is filtered by human preference.',
        'Adapted does not mean perfect or better. A trait only had to work better than the other versions present, and a trait that helps in one place can be a burden in another.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Adaptation & Artificial Selection' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
