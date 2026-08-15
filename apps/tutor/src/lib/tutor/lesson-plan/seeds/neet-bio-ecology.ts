/**
 * NEET Biology — Ecology and Environment.
 *
 * Class 12 NCERT Unit 10 — populations, ecosystems, biodiversity,
 * environmental issues. ~6-8 NEET questions per sitting; relatively
 * easier marks once memorized.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_BIO_ECOLOGY: LessonPlan = {
  id: 'evelyn.testprep.neet.bio.ecology.v1',
  title: 'NEET Biology — Ecology and Ecosystems',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-biology',
  locale: 'en',
  los: [
    {
      id: 'neet.bio.ecology',
      description: 'Recall NEET-level facts about population growth models, community interactions, ecosystem productivity + energy flow, biodiversity, and environmental issues from NCERT Class 12 Unit 10.',
      standard: 'NEET-BIO-ECO',
    },
  ],
  prerequisites: ['neet.bio-genetics'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Ecology is high-yield, low-difficulty NEET territory.',
      script: 'Ecology and ecosystems give you 6-8 NEET questions per year, mostly on memorized facts: who eats whom, energy pyramids, what makes an r-selected species, what hot-spots are. The math is simple (just exponential vs logistic equations). Master the vocabulary and the key numbers — energy transfer efficiency, biodiversity hotspots count — and you bank these marks fast.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-population',
      kind: 'concept',
      goal: 'Population growth + community interactions.',
      keyIdeas: [
        'POPULATION ATTRIBUTES: birth rate, death rate, sex ratio, age distribution. POPULATION DENSITY changes by 4 processes: natality + immigration ↑ ; mortality + emigration ↓.',
        'EXPONENTIAL GROWTH: dN/dt = rN. J-shaped curve. Unrestricted resources. r = intrinsic rate of increase = b − d.',
        'LOGISTIC GROWTH: dN/dt = rN((K − N)/K). S-shaped (sigmoid) curve. K = carrying capacity. Limited resources.',
        'r-SELECTED species: high r, small body, short life, many offspring, low parental care (insects, weeds).',
        'K-SELECTED species: low r, large body, long life, few offspring, high parental care (whales, elephants, humans).',
        'COMMUNITY INTERACTIONS by sign on each species: MUTUALISM (+/+, e.g., lichens, mycorrhizae), COMMENSALISM (+/0, e.g., barnacles on whales), AMENSALISM (−/0, e.g., antibiotic-producing fungi), PREDATION (+/−), PARASITISM (+/−), COMPETITION (−/−).',
        'GAUSE\'S COMPETITIVE EXCLUSION PRINCIPLE: two species competing for the same resource cannot coexist; one excludes the other unless they NICHE-PARTITION.',
      ],
      vocabulary: [
        { term: 'carrying capacity (K)', definition: 'the maximum population size an environment can sustain indefinitely; the asymptote of logistic growth.' },
        { term: 'mutualism', definition: 'a symbiotic interaction in which both species benefit (+/+).' },
        { term: 'r-selection', definition: 'a life-history strategy emphasizing high reproductive rate and low parental investment.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-ecosystems',
      kind: 'concept',
      goal: 'Productivity, food webs, biogeochemical cycles, biodiversity.',
      keyIdeas: [
        'GROSS PRIMARY PRODUCTIVITY (GPP): total photosynthesis. NET PRIMARY PRODUCTIVITY (NPP) = GPP − respiration. NPP is what\'s available to consumers.',
        'OCEANS contribute ~55% of total NPP globally; terrestrial ecosystems ~45%.',
        'TROPHIC LEVELS: producers (1) → primary consumers / herbivores (2) → secondary consumers / carnivores (3) → tertiary (4). Decomposers parallel.',
        '10% LAW (Lindeman): only ~10% of energy passes from one trophic level to the next. Rest lost as heat and metabolism.',
        'PYRAMIDS of NUMBER, BIOMASS, ENERGY. Pyramid of energy is ALWAYS upright (10% law). Pyramids of number and biomass can be inverted (e.g., one tree supporting many insects = inverted number pyramid).',
        'BIOGEOCHEMICAL CYCLES: nitrogen (N₂ fixation by bacteria — Rhizobium symbiotic, Azotobacter free-living; nitrification → nitrate; denitrification returns N₂), carbon (photosynthesis ↔ respiration; ~1% of total C is in biota; rest in oceans/sediments/atmosphere), phosphorus (sedimentary, no atmospheric phase), water.',
        'BIODIVERSITY HOTSPOTS: 36 globally (originally 25 by Norman Myers, expanded). India has 4: Western Ghats, Eastern Himalayas (Indo-Burma), Sundalands (Nicobar islands), Himalaya.',
        'IUCN RED LIST CATEGORIES: Extinct → Extinct in Wild → Critically Endangered → Endangered → Vulnerable → Near Threatened → Least Concern. CR/EN/VU are the 3 "Threatened" categories.',
        'EVIL QUARTET (causes of biodiversity loss): Habitat loss + Over-exploitation + Alien species + Co-extinction.',
      ],
      vocabulary: [
        { term: 'NPP', definition: 'Net Primary Productivity — gross photosynthesis minus producer respiration; the energy available to consumers.' },
        { term: 'trophic level', definition: 'a step in a food chain (producers, primary consumers, secondary consumers, etc.).' },
        { term: 'biodiversity hotspot', definition: 'a region with high endemic species diversity AND significant habitat loss; 36 globally.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A grass field produces 1000 kcal/m² of grass per year (NPP). If a herbivore population eats 200 kcal/m² and a carnivore eats the herbivores, roughly how much energy reaches the carnivore (per m² per year)?',
      expectedAnswer: '~20 kcal/m². Apply the 10% law: ~10% of the herbivore\'s energy intake (200 kcal) passes to the carnivore = 20 kcal. The other 90% is lost to herbivore respiration, heat, and unconsumed parts.',
      responseFormat: 'numeric',
      hints: [
        '10% of 200 kcal.',
        'Energy lost as heat at each trophic transfer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pyramid-inverted',
      kind: 'misconception_check',
      question: 'Pyramids of number, biomass, and energy are all always upright (broader at the base). True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating all ecological pyramids as identical.',
          correctsTo: 'False. Pyramid of ENERGY is always upright (10% law forces it). Pyramid of BIOMASS can be inverted in aquatic ecosystems (phytoplankton biomass at any moment is small but turnover is fast, supporting larger zooplankton biomass). Pyramid of NUMBER can be inverted with parasitic chains (one tree supports many insects, each supporting many parasites). The energy pyramid is the only one that\'s NEVER inverted.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Logistic growth: dN/dt = rN((K−N)/K). r-selected vs K-selected.',
        'Community interactions: +/+ mutualism, +/0 commensalism, +/− predation/parasitism, −/− competition.',
        '10% law: ~10% energy transfer per trophic level. Energy pyramid always upright.',
        'India\'s 4 biodiversity hotspots: Western Ghats, Eastern Himalayas, Sundalands, Himalaya.',
        'Evil quartet: habitat loss, over-exploitation, alien species, co-extinction.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is biodiversity GENERALLY higher in tropical regions than in temperate or polar?',
      hint: 'Multiple hypotheses NEET expects: (1) speciation has had longer time in stable tropical climates (no glaciation disruption). (2) more sunlight + warmth → higher productivity → more niches → more species. (3) less seasonal variability → species can specialize on narrow niches. (4) more constant temperatures → narrower thermal tolerance specialization. NEET typically wants the productivity / time / specialization combo.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
