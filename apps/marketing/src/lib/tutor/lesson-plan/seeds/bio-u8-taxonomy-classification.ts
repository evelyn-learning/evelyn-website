/**
 * Biology — Classification: Taxonomy & Binomial Nomenclature.
 *
 * The naming-and-hierarchy template for the HS Biology fan-out (NGSS HS-LS4-1).
 * Almost every error here is a rank-direction error — students read "shares a
 * higher rank" as "more closely related" — or a look-alike error, so the
 * concept segment is organized around the ladder and what each rung implies.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U8_TAXONOMY_CLASSIFICATION: LessonPlan = {
  id: 'evelyn.hs.bio.taxonomy-classification.v1',
  title: 'Taxonomy & Binomial Nomenclature',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.taxonomy-classification',
      standard: 'BIO-8.1',
      description:
        'Classify organisms using binomial nomenclature and the Domain-to-Species hierarchy, and infer relative evolutionary relatedness from the lowest rank two organisms share (NGSS HS-LS4-1).',
    },
  ],
  prerequisites: ['bio.speciation'],
  followUps: ['bio.phylogenetics-cladograms'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a universal naming system as a practical necessity, not a filing habit.',
      script:
        'Drive along one coastline and the same fish is called a rockfish in one town, a rock cod two towns over, and a Pacific snapper at the third market — three names, one animal, and a fishery inspector who cannot tell whether the catch limit was broken. Meanwhile a doctor with a sick patient has to know exactly which bacterium is growing in the culture, because one species is harmless and its look-alike neighbor is deadly. Biology solved this with a two-word name every scientist on Earth agrees on, and a ladder of groups that tells you how closely any two living things are related. By the end of this lesson you will read that ladder and write those names correctly.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-naming-and-hierarchy',
      kind: 'concept',
      goal: 'Why common names fail, how binomial names are written, the eight ranks, and what a shared rank tells you.',
      keyIdeas: [
        'WHY COMMON NAMES FAIL — a common name varies by region and by language, and it can point to different animals in different places (a "robin" in Britain is not the same bird as a "robin" in North America). One organism can carry a dozen common names, and one common name can cover a dozen organisms. Science needs exactly one name per species, worldwide.',
        'BINOMIAL NOMENCLATURE — the system Carolus Linnaeus set up in the 1700s gives every species a two-word Latin name: the GENUS name followed by the SPECIES name (the specific epithet). Humans are Homo sapiens; the domestic dog is Canis familiaris.',
        'THE WRITING RULES — the genus is CAPITALIZED, the species name is lowercase, and BOTH words are italicized in print (or underlined when you write by hand). Homo sapiens is correct; Homo Sapiens, homo sapiens, and sapiens Homo are all wrong. After the first mention the genus may be abbreviated to its initial, as in E. coli.',
        'THE HIERARCHY, TOP TO BOTTOM — Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species. Each level is called a taxon, and each one nests inside the one above it. Every species is therefore filed at all eight levels at once.',
        'THE KEY INFERENCE RULE — the LOWER the shared rank, the MORE closely related two organisms are and the FEWER organisms that group contains. Two species in the same Genus are close cousins; two species that share only a Kingdom are barely related. This is the single most tested idea in the unit, and students routinely run it backwards because Kingdom "sounds bigger".',
        'CLASSIFICATION FOLLOWS EVOLUTION, NOT APPEARANCE — modern taxonomy groups organisms by shared ancestry, using DNA and protein sequences rather than looks alone. Look-alikes can be distant (a shark and a dolphin both have fins and a streamlined body, but the dolphin is a mammal and the shark is a fish), and unlikely-looking pairs can be close. Because DNA evidence keeps arriving, published classifications get REVISED — that is the system working, not failing.',
        'DICHOTOMOUS KEYS — to identify an unknown organism you walk a key made of numbered steps, each offering exactly two choices ("dichotomous" means split in two). You pick the statement that matches your specimen, follow it to the step it names, and repeat until a step ends in a name instead of another step. Read only the pair you are on; never skip ahead to a name that looks likely.',
      ],
      vocabulary: [
        { term: 'taxon', definition: 'any one group in the classification hierarchy, such as the Class Mammalia or the Genus Canis.' },
        { term: 'binomial nomenclature', definition: 'the two-word naming system, Genus plus species, that gives each species one unique scientific name.' },
        { term: 'dichotomous key', definition: 'a numbered identification tool in which each step offers two choices that lead either to another step or to a name.' },
      ],
      suggestedTools: ['show_diagram', 'show_table', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-relatedness-from-ranks',
      kind: 'worked_example',
      problem:
        'Three animals are classified as follows. The gray wolf: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Canidae, Genus Canis, species lupus. The coyote: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Canidae, Genus Canis, species latrans. The red fox: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Canidae, Genus Vulpes, species vulpes. Which two are most closely related, and how do you know?',
      steps: [
        'Compare the wolf and the coyote rank by rank from the top: Domain, Kingdom, Phylum, Class, Order, and Family all match, and so does the Genus — both are Canis. They differ only at the species level.',
        'Now compare the wolf and the red fox the same way: Domain through Family match, but the Genus differs, Canis versus Vulpes.',
        'Find the LOWEST rank each pair shares. Wolf and coyote share down to Genus; wolf and fox share only down to Family.',
        'Apply the rule: the lower the shared rank, the closer the relationship and the smaller the group. Genus is lower than Family, so the wolf-and-coyote pair is the closer one.',
        'Sanity-check the direction: sharing a Family means all three are dog-like carnivores, which is true but loose. Sharing a Genus is the tighter statement, and only two of the three qualify.',
      ],
      answer:
        'The gray wolf and the coyote — they share every rank down to the Genus Canis, while the red fox (Genus Vulpes) matches only as far down as the Family Canidae.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dichotomous-key',
      kind: 'worked_example',
      problem:
        'Use this dichotomous key to identify a specimen. Step 1: if the animal has eight legs and no antennae, go to Step 2; if it has six legs and one pair of antennae, go to Step 3. Step 2: if the body is in two parts with no tail stinger, it is a spider; if the body ends in a segmented tail with a stinger, it is a scorpion. Step 3: if the animal has one pair of wings, it is a fly; if it has two pairs of wings, go to Step 4. Step 4: if the front wings are hard and shell-like and meet in a straight line down the back, it is a beetle; if the wings are thin and covered in tiny scales, it is a butterfly. The specimen has six legs, one pair of antennae, and two pairs of wings, and its front wings are hard and shell-like, meeting in a straight line down its back.',
      steps: [
        'Start at Step 1 and read only its two choices. The specimen has six legs and one pair of antennae, not eight legs, so the second choice applies and the key sends you to Step 3.',
        'At Step 3 the two choices are one pair of wings or two pairs. The specimen has two pairs, so this step does not name the animal — it sends you on to Step 4.',
        'At Step 4 the two choices describe the front wings. The specimen has hard, shell-like front wings meeting in a straight line down the back, which matches the first choice.',
        'That choice ends in a name rather than another step, so the identification is complete: the specimen is a beetle.',
        'Notice that you never had to consider spiders or scorpions. The very first step routed you away from that whole branch, which is exactly what a key is for.',
      ],
      answer: 'A beetle — the path runs Step 1 (six legs, antennae) to Step 3 (two pairs of wings) to Step 4 (hard shell-like front wings).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-shared-rank',
      kind: 'try_yourself',
      problem:
        'A lion is classified in Class Mammalia, Order Carnivora, Family Felidae, Genus Panthera, species leo. A tiger is in Class Mammalia, Order Carnivora, Family Felidae, Genus Panthera, species tigris. A house cat is in Class Mammalia, Order Carnivora, Family Felidae, Genus Felis, species catus. A gray wolf is in Class Mammalia, Order Carnivora, Family Canidae, Genus Canis, species lupus. Which pair is most closely related?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The house cat and the gray wolf, because they share the Order Carnivora' },
        { id: 'b', text: 'The lion and the tiger, because they share the Genus Panthera', correct: true },
        { id: 'c', text: 'The lion and the house cat, because both are cats and look alike' },
        { id: 'd', text: 'All four are equally related, because they all share the Class Mammalia' },
      ],
      expectedAnswer: 'The lion and the tiger, because they share the Genus Panthera',
      hints: [
        'For each pair, find the LOWEST rank the two organisms have in common.',
        'Genus sits below Family, which sits below Order — and the lower the shared rank, the closer the relationship.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-writing-the-name',
      kind: 'try_yourself',
      problem:
        'A student is writing the scientific name of the honey bee in a typed lab report. The genus is Apis and the species name is mellifera. Which version follows the rules of binomial nomenclature?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Apis Mellifera, with both words capitalized and italicized' },
        { id: 'b', text: 'apis mellifera, with both words lowercase and italicized' },
        { id: 'c', text: 'Mellifera apis, with the species name first and the genus second' },
        { id: 'd', text: 'Apis mellifera, with the genus capitalized, the species name lowercase, and both words italicized', correct: true },
      ],
      expectedAnswer: 'Apis mellifera, with the genus capitalized, the species name lowercase, and both words italicized',
      hints: [
        'Three things are being tested at once: word order, capitalization, and formatting.',
        'The genus always comes first and is the only word capitalized; the species name stays lowercase, and both are italicized when typed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-dichotomous-key',
      kind: 'try_yourself',
      problem:
        'Use this leaf key. Step 1: if the leaf edge is smooth and unbroken, go to Step 2; if the leaf edge is lobed, go to Step 3. Step 2: if the leaf is much longer than it is wide, it is a magnolia; if the leaf is about as wide as it is long, it is a redbud. Step 3: if the lobes are rounded and their tips have no bristles, it is a white oak; if the lobes are pointed and each tip ends in a small bristle, it is a red oak. Your leaf has a lobed edge, and each lobe comes to a point that ends in a small bristle. What is it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A magnolia' },
        { id: 'b', text: 'A white oak' },
        { id: 'c', text: 'A red oak', correct: true },
        { id: 'd', text: 'A redbud' },
      ],
      expectedAnswer: 'A red oak',
      hints: [
        'Start at Step 1 and answer only that one question: is the edge smooth, or is it lobed?',
        'A lobed edge sends you to Step 3, where the two choices differ by whether the lobe tips are rounded or pointed with a bristle.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-looks-mean-relatedness',
      kind: 'misconception_check',
      question:
        'A student says: "A dolphin and a shark both have fins, smooth skin and the same torpedo shape, and they both live in the ocean — so they must be closely related. A dolphin and a bat could not possibly be close." What went wrong?',
      commonErrors: [
        {
          answer: 'The dolphin is most closely related to the shark',
          misconception: 'Classifying by outward appearance and habitat instead of by shared ancestry, so unrelated organisms shaped alike by similar environments get filed together.',
          correctsTo:
            'The dolphin and the bat both sit in the Class Mammalia — they have hair, they are warm-blooded, and they nurse their young — so they share every rank down to Class. The shark is a fish and matches the dolphin only up at the Phylum Chordata, several rungs higher. The fins and the streamlined shape are an adaptation to swimming that evolved separately, not evidence of kinship. This is exactly why modern classification leans on DNA evidence rather than looks, and why classifications get revised when the DNA disagrees with the appearance.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Common names vary by region and language, so science uses one agreed scientific name per species.',
        'Binomial nomenclature: Genus first and capitalized, species name second and lowercase, both italicized (underlined by hand) — Homo sapiens.',
        'The hierarchy, top to bottom: Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species.',
        'The LOWER the shared rank, the MORE closely related the organisms and the FEWER of them in that group.',
        'Classification tracks evolutionary relatedness shown by DNA, not appearance — so look-alikes can be distant, and classifications get revised as evidence arrives.',
        'A dichotomous key is walked one numbered step at a time, choosing between exactly two statements until a step gives a name.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Taxonomy & Binomial Nomenclature' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
