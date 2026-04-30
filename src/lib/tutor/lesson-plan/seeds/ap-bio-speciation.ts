/**
 * AP Biology — Speciation.
 *
 * How new species form: allopatric vs sympatric, reproductive
 * isolation, adaptive radiation.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_SPECIATION: LessonPlan = {
  id: 'evelyn.ap.bio.speciation.v1',
  title: 'Speciation: how new species arise',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'ap-biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.speciation',
      description: 'Distinguish allopatric and sympatric speciation and identify reproductive isolation mechanisms.',
      standard: 'AP-BIO-EVO-3',
    },
  ],
  prerequisites: ['apbio.evolution-evidence', 'apbio.hardy-weinberg'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame speciation as the birth of new types of life.',
      script: 'Every species on Earth descends from earlier species that gradually split into new lines. Lions and tigers shared an ancestor 3 million years ago. Humans and chimps about 7 million. SPECIATION — the splitting itself — is how diversity arises.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mechanisms',
      kind: 'concept',
      goal: 'Definition + isolation types + speciation modes + adaptive radiation.',
      keyIdeas: [
        'BIOLOGICAL SPECIES: a population whose members can interbreed and produce VIABLE, FERTILE offspring. Members of different species cannot (or only rarely).',
        'SPECIATION: a single ancestral species splitting into two reproductively isolated species.',
        'PREZYGOTIC ISOLATION (before fertilization): habitat (don\'t meet), temporal (mate at different times), behavioral (different courtship), mechanical (anatomy mismatch), gametic (sperm and egg can\'t fuse).',
        'POSTZYGOTIC ISOLATION (after fertilization): hybrid inviability (zygote dies), hybrid sterility (mule is sterile), hybrid breakdown (F2 generation weak).',
        'ALLOPATRIC SPECIATION ("different homeland"): geographic separation. Mountain rises, river forms, populations isolated, drift apart genetically. Most common mode.',
        'SYMPATRIC SPECIATION ("same homeland"): species splits without geographic barrier. Less common. Mechanisms: polyploidy in plants, exploitation of new niche, sexual selection.',
        'ADAPTIVE RADIATION: rapid speciation when ancestor lineage colonizes a new environment with many open niches. Darwin\'s finches in Galápagos. Cichlid fish in African rift lakes. Hawaiian honeycreepers.',
        'PUNCTUATED EQUILIBRIUM (Eldredge & Gould): species change in BURSTS during/around speciation, then remain relatively stable for millions of years. Contrasts with smooth gradualism.',
      ],
      vocabulary: [
        { term: 'reproductive isolation', definition: 'mechanisms that prevent interbreeding between species.' },
        { term: 'allopatric speciation', definition: 'speciation due to geographic separation.' },
        { term: 'adaptive radiation', definition: 'rapid speciation into many forms occupying different niches.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-finches',
      kind: 'worked_example',
      problem: 'How did Darwin\'s finches diversify into 14+ species on the Galápagos Islands?',
      steps: [
        '~3 million years ago, a small group of finches arrived from mainland South America.',
        'Galápagos islands had many empty NICHES (no competitors): seed eaters, insect eaters, cactus specialists, vampire-like blood feeders.',
        'Different islands had different food sources. Populations isolated on each island adapted to local resources.',
        'Beak shapes diverged: thick for cracking seeds, thin for probing flowers, sharp for insects.',
        'Over generations, the populations became reproductively isolated — different beaks → different feeding niches → different mate preferences.',
        'Result: ADAPTIVE RADIATION into 14+ distinct species, each specialized.',
      ],
      answer: 'allopatric speciation + adaptive radiation into open niches; beak shape divergence',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A horse and donkey can mate to produce a MULE. Why are mules considered evidence that horse and donkey are SEPARATE species?',
      expectedAnswer: 'mules are sterile — postzygotic isolation; species require viable AND fertile offspring',
      responseFormat: 'free',
      hints: [
        'Biological species concept requires fertile hybrids.',
        'Mules are healthy but cannot reproduce.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-quick-speciation',
      kind: 'misconception_check',
      question: 'Does speciation usually happen in a few generations?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Underestimating timescales.',
          correctsTo: 'Usually NOT. Most speciation takes thousands to millions of generations. EXCEPTIONS: polyploidy in plants (instant), some rapid sympatric splits via behavior/sexual selection. Most adaptive radiations span hundreds of thousands of years even when "fast".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Biological species: interbreeding produces viable, fertile offspring.',
        'Speciation = splitting via reproductive isolation.',
        'Pre-zygotic (before fertilization) and post-zygotic (after) isolation.',
        'Allopatric (geographic) is most common; sympatric (same area) less so.',
        'Adaptive radiation: rapid speciation into open niches.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How can SEXUAL SELECTION drive sympatric speciation?',
      hint: 'If two groups develop different mate preferences (different songs, colors, dances), they can stop interbreeding even living in the same area. Female cichlid fish in Lake Victoria preferring different colored males drove rapid sympatric speciation.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
