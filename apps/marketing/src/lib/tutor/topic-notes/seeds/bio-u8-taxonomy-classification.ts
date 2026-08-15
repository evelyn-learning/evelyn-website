/**
 * Biology — Unit 8 CED 8.1: Taxonomy & Binomial Nomenclature.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.taxonomy-classification.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U8_TAXONOMY_CLASSIFICATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.taxonomy-classification.v1',
  course: 'Biology',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Taxonomy & Binomial Nomenclature',
  planId: 'evelyn.hs.bio.taxonomy-classification.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.taxonomy-classification.v1' }],
  theory: [
    { loId: 'bio.taxonomy-classification', kind: 'framework', title: 'Why common names fail', content: `WHY COMMON NAMES FAIL — a common name varies by region and by language, and it can point to different animals in different places (a "robin" in Britain is not the same bird as a "robin" in North America). One organism can carry a dozen common names, and one common name can cover a dozen organisms. Science needs exactly one name per species, worldwide.` },
    { loId: 'bio.taxonomy-classification', kind: 'framework', title: 'Binomial nomenclature', content: `BINOMIAL NOMENCLATURE — the system Carolus Linnaeus set up in the 1700s gives every species a two-word Latin name: the GENUS name followed by the SPECIES name (the specific epithet). Humans are Homo sapiens; the domestic dog is Canis familiaris.` },
    { loId: 'bio.taxonomy-classification', kind: 'framework', title: 'The writing rules', content: `THE WRITING RULES — the genus is CAPITALIZED, the species name is lowercase, and BOTH words are italicized in print (or underlined when you write by hand). Homo sapiens is correct; Homo Sapiens, homo sapiens, and sapiens Homo are all wrong. After the first mention the genus may be abbreviated to its initial, as in E. coli.` },
    { loId: 'bio.taxonomy-classification', kind: 'framework', title: 'The hierarchy, top to bottom', content: `THE HIERARCHY, TOP TO BOTTOM — Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species. Each level is called a taxon, and each one nests inside the one above it. Every species is therefore filed at all eight levels at once.` },
    { loId: 'bio.taxonomy-classification', kind: 'framework', title: 'The key inference rule', content: `THE KEY INFERENCE RULE — the LOWER the shared rank, the MORE closely related two organisms are and the FEWER organisms that group contains. Two species in the same Genus are close cousins; two species that share only a Kingdom are barely related. This is the single most tested idea in the unit, and students routinely run it backwards because Kingdom "sounds bigger".` },
    { loId: 'bio.taxonomy-classification', kind: 'framework', title: 'Classification follows evolution, not appearance', content: `CLASSIFICATION FOLLOWS EVOLUTION, NOT APPEARANCE — modern taxonomy groups organisms by shared ancestry, using DNA and protein sequences rather than looks alone. Look-alikes can be distant (a shark and a dolphin both have fins and a streamlined body, but the dolphin is a mammal and the shark is a fish), and unlikely-looking pairs can be close. Because DNA evidence keeps arriving, published classifications get REVISED — that is the system working, not failing.` },
    { loId: 'bio.taxonomy-classification', kind: 'framework', title: 'Dichotomous keys', content: `DICHOTOMOUS KEYS — to identify an unknown organism you walk a key made of numbered steps, each offering exactly two choices ("dichotomous" means split in two). You pick the statement that matches your specimen, follow it to the step it names, and repeat until a step ends in a name instead of another step. Read only the pair you are on; never skip ahead to a name that looks likely.` },
    { loId: 'bio.taxonomy-classification', kind: 'definition', title: 'taxon', content: `any one group in the classification hierarchy, such as the Class Mammalia or the Genus Canis.` },
    { loId: 'bio.taxonomy-classification', kind: 'definition', title: 'binomial nomenclature', content: `the two-word naming system, Genus plus species, that gives each species one unique scientific name.` },
    { loId: 'bio.taxonomy-classification', kind: 'definition', title: 'dichotomous key', content: `a numbered identification tool in which each step offers two choices that lead either to another step or to a name.` },
  ],
  methods: [
    {
      title: 'Worked relatedness from ranks',
      steps: [
        `Compare the wolf and the coyote rank by rank from the top: Domain, Kingdom, Phylum, Class, Order, and Family all match, and so does the Genus — both are Canis. They differ only at the species level.`,
        `Now compare the wolf and the red fox the same way: Domain through Family match, but the Genus differs, Canis versus Vulpes.`,
        `Find the LOWEST rank each pair shares. Wolf and coyote share down to Genus; wolf and fox share only down to Family.`,
        `Apply the rule: the lower the shared rank, the closer the relationship and the smaller the group. Genus is lower than Family, so the wolf-and-coyote pair is the closer one.`,
        `Sanity-check the direction: sharing a Family means all three are dog-like carnivores, which is true but loose. Sharing a Genus is the tighter statement, and only two of the three qualify.`,
      ],
      example: { problem: `Three animals are classified as follows. The gray wolf: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Canidae, Genus Canis, species lupus. The coyote: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Canidae, Genus Canis, species latrans. The red fox: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Canidae, Genus Vulpes, species vulpes. Which two are most closely related, and how do you know?`, solution: `The gray wolf and the coyote — they share every rank down to the Genus Canis, while the red fox (Genus Vulpes) matches only as far down as the Family Canidae.` },
      relatedLoIds: ['bio.taxonomy-classification'],
    },
    {
      title: 'Worked dichotomous key',
      steps: [
        `Start at Step 1 and read only its two choices. The specimen has six legs and one pair of antennae, not eight legs, so the second choice applies and the key sends you to Step 3.`,
        `At Step 3 the two choices are one pair of wings or two pairs. The specimen has two pairs, so this step does not name the animal — it sends you on to Step 4.`,
        `At Step 4 the two choices describe the front wings. The specimen has hard, shell-like front wings meeting in a straight line down the back, which matches the first choice.`,
        `That choice ends in a name rather than another step, so the identification is complete: the specimen is a beetle.`,
        `Notice that you never had to consider spiders or scorpions. The very first step routed you away from that whole branch, which is exactly what a key is for.`,
      ],
      example: { problem: `Use this dichotomous key to identify a specimen. Step 1: if the animal has eight legs and no antennae, go to Step 2; if it has six legs and one pair of antennae, go to Step 3. Step 2: if the body is in two parts with no tail stinger, it is a spider; if the body ends in a segmented tail with a stinger, it is a scorpion. Step 3: if the animal has one pair of wings, it is a fly; if it has two pairs of wings, go to Step 4. Step 4: if the front wings are hard and shell-like and meet in a straight line down the back, it is a beetle; if the wings are thin and covered in tiny scales, it is a butterfly. The specimen has six legs, one pair of antennae, and two pairs of wings, and its front wings are hard and shell-like, meeting in a straight line down its back.`, solution: `A beetle — the path runs Step 1 (six legs, antennae) to Step 3 (two pairs of wings) to Step 4 (hard shell-like front wings).` },
      relatedLoIds: ['bio.taxonomy-classification'],
    },
  ],
  pointers: [
    { content: `The dolphin and the bat both sit in the Class Mammalia — they have hair, they are warm-blooded, and they nurse their young — so they share every rank down to Class. The shark is a fish and matches the dolphin only up at the Phylum Chordata, several rungs higher. The fins and the streamlined shape are an adaptation to swimming that evolved separately, not evidence of kinship. This is exactly why modern classification leans on DNA evidence rather than looks, and why classifications get revised when the DNA disagrees with the appearance.`, kind: 'common-error' },
    { content: `Common names vary by region and language, so science uses one agreed scientific name per species.`, kind: 'tip' },
    { content: `Binomial nomenclature: Genus first and capitalized, species name second and lowercase, both italicized (underlined by hand) — Homo sapiens.`, kind: 'tip' },
    { content: `The hierarchy, top to bottom: Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species.`, kind: 'tip' },
    { content: `The LOWER the shared rank, the MORE closely related the organisms and the FEWER of them in that group.`, kind: 'tip' },
    { content: `Classification tracks evolutionary relatedness shown by DNA, not appearance — so look-alikes can be distant, and classifications get revised as evidence arrives.`, kind: 'tip' },
    { content: `A dichotomous key is walked one numbered step at a time, choosing between exactly two statements until a step gives a name.`, kind: 'tip' },
    { content: `"Lower rank shared = more closely related" runs opposite to how big the word sounds. Sharing a Kingdom is the *weakest* claim; sharing a Genus is the strongest. Order the ranks on paper before you answer.`, kind: 'common-error' },
    { content: `Never call the second word "the species" alone — *sapiens* by itself names nothing. The species is the full two-word name *Homo sapiens*; the second word is the specific epithet and can be reused (e.g., *Vulpes vulpes*).`, kind: 'vocab-note' },
    { content: `Typing: *Apis mellifera*. Handwriting: underline both words separately. Wrong every time: Apis Mellifera, apis mellifera, mellifera Apis. Abbreviate to *A. mellifera* only after you've spelled the genus out once.`, kind: 'gotcha' },
    { content: `Shared traits are not evidence of relatedness if they're adaptations to the same environment. Dolphin + shark share fins but only the Phylum; dolphin + bat share hair, milk, warm blood — all the way down to Class Mammalia.`, kind: 'common-error' },
    { content: `In a dichotomous key, read ONLY the two statements at the step you're on. If a step sends you to Step 4, go there — don't jump to a name that 'looks right.' A step either names the organism or names the next step, never both.`, kind: 'tip' },
    { content: `"Taxon" is any one group at any level — Mammalia, Canidae, and Canis are all taxa. It is not a synonym for "rank" or for "species." The rank is the level; the taxon is the actual named group sitting at it.`, kind: 'vocab-note' },
    { content: `When two organisms match at every rank you're given, don't assume they're the same species — check whether the list stops at Genus. Two species can share all seven ranks above Species and still be different organisms (wolf vs. coyote).`, kind: 'edge-case' },
    { content: `A classification being revised isn't the system failing — it's DNA evidence overruling appearance. Expect textbook groupings to change, and cite shared ancestry, not looks, when you justify a grouping.`, kind: 'tip' },
  ],
};
