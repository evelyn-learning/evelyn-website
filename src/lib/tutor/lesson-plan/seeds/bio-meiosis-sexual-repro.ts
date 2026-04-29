/**
 * HS Biology — Meiosis and Sexual Reproduction.
 * NGSS HS-LS3-2: differences between mitosis and meiosis; meiosis
 * generates genetic variation.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_MEIOSIS_SEXUAL_REPRO: LessonPlan = {
  id: 'evelyn.hs.science.biology.meiosis-sexual-repro.v1',
  title: 'Meiosis and Sexual Reproduction',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'genetics', locale: 'en',
  los: [{ id: 'ngss.hs-ls3-2', description: 'Make and defend a claim that inheritable genetic variations may result from new genetic combinations through meiosis.', standard: 'NGSS.HS-LS3-2' }],
  prerequisites: ['hs.bio.cell-cycle-mitosis'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in variation.', script: 'Siblings share parents but look different. Why? Meiosis — the special cell division that makes eggs and sperm — actively SHUFFLES genetic information.', estimatedMinutes: 2 },
    { id: 'concept-meiosis', kind: 'concept', goal: 'Meiosis: 1 cell → 4 daughter cells, each with HALF the chromosomes (haploid). Two divisions: meiosis I + II.', keyIdeas: [
      'Body cells = DIPLOID (2n) — two sets of chromosomes (one from each parent). Humans: 46 chromosomes (23 pairs).',
      'Sex cells (gametes — eggs/sperm) = HAPLOID (n) — one set. Humans: 23 chromosomes.',
      'When egg + sperm fuse → zygote = diploid again (46 chromosomes).',
      'Meiosis = 1 diploid cell → 4 haploid cells via TWO divisions (Meiosis I + II).',
      'Meiosis I: HOMOLOGOUS chromosomes (the matching pairs from each parent) separated.',
      'Meiosis II: sister chromatids separated (similar to mitosis).',
    ], vocabulary: [{ term: 'haploid', definition: 'one set of chromosomes.' }, { term: 'diploid', definition: 'two sets of chromosomes.' }, { term: 'homologous chromosomes', definition: 'matching pair (one from each parent).' }, { term: 'gamete', definition: 'sex cell (egg or sperm).' }], estimatedMinutes: 5 },
    { id: 'concept-variation', kind: 'concept', goal: 'Three sources of variation: crossing over, independent assortment, random fertilization.', keyIdeas: [
      'CROSSING OVER (in prophase I): homologous chromosomes swap segments → new combinations.',
      'INDEPENDENT ASSORTMENT (in metaphase I): each homologous pair lines up randomly → 2²³ = 8.4 million combinations possible per gamete.',
      'RANDOM FERTILIZATION: any sperm × any egg = enormous variation.',
      'Total possibilities for human offspring from one couple: ~70 trillion combinations.',
      'This is why siblings (except identical twins) are genetically unique.',
    ], estimatedMinutes: 4 },
    { id: 'worked-mitosis-vs-meiosis', kind: 'worked_example', problem: 'Compare mitosis and meiosis: starting cells, # divisions, # daughter cells, ploidy of result, genetic identity.', steps: [
      'MITOSIS: 1 diploid cell → 1 division → 2 IDENTICAL diploid cells. For growth/repair.',
      'MEIOSIS: 1 diploid cell → 2 divisions → 4 GENETICALLY UNIQUE haploid cells. For sexual reproduction.',
      'Mitosis preserves; meiosis shuffles.',
    ], answer: 'Mitosis: 2 identical diploid cells. Meiosis: 4 unique haploid gametes.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why is genetic variation important for a species\' long-term survival?', expectedAnswer: 'Variation gives natural selection something to work with. If conditions change (new disease, climate shift, predator), some individuals likely have traits suited to the new conditions. Without variation, all members would respond identically — a single threat could wipe out the species.', responseFormat: 'free', hints: ['What happens if everyone in a population is identical and a new threat appears?', 'Variation = options for natural selection.'], estimatedMinutes: 3 },
    { id: 'misconception-meiosis-just-half-mitosis', kind: 'misconception_check', question: 'A friend says "meiosis is basically half-mitosis." Is meiosis just mitosis with fewer chromosomes at the end?', commonErrors: [{ answer: 'Yes — half-mitosis.', misconception: 'Treating meiosis as a quantitative variant.', correctsTo: 'They\'re fundamentally different. Mitosis = ONE division → identical cells. Meiosis = TWO divisions with crossing over + independent assortment → unique cells. Meiosis actively GENERATES variation; mitosis preserves identity.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Meiosis: diploid → 4 haploid gametes via 2 divisions.', 'Crossing over + independent assortment + random fertilization = enormous variation.', 'Mitosis preserves; meiosis shuffles.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
