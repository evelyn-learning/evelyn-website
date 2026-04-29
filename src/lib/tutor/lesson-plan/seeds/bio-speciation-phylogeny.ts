/**
 * HS Biology — Speciation and Phylogeny.
 * NGSS HS-LS4-5: how environmental conditions can lead to new species.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_SPECIATION_PHYLOGENY: LessonPlan = {
  id: 'evelyn.hs.science.biology.speciation-phylogeny.v1',
  title: 'Speciation and Phylogeny',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'evolution', locale: 'en',
  los: [{ id: 'ngss.hs-ls4-5', description: 'Evaluate the evidence supporting claims that changes in environmental conditions may result in new species.', standard: 'NGSS.HS-LS4-5' }],
  prerequisites: ['hs.bio.natural-selection-evol'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in island biogeography.', script: 'On Madagascar — isolated for 88 million years — 90% of the wildlife exists nowhere else. Lemurs, fossas, baobab trees. Same starting populations as Africa, but isolation produced entirely new species. How?', estimatedMinutes: 2 },
    { id: 'concept-species', kind: 'concept', goal: 'Species = group that interbreeds + produces fertile offspring. Speciation = formation of new species.', keyIdeas: [
      'BIOLOGICAL SPECIES CONCEPT: members interbreed naturally + produce FERTILE offspring.',
      'Reproductive isolation prevents gene flow between species.',
      'TYPES OF ISOLATION:',
      '  · GEOGRAPHIC (allopatric speciation): physical barrier separates a population.',
      '  · BEHAVIORAL: different mating rituals.',
      '  · TEMPORAL: different breeding times.',
      '  · MORPHOLOGICAL: anatomy prevents mating.',
      'Sympatric speciation: new species without geographic separation (e.g., polyploidy in plants).',
    ], vocabulary: [{ term: 'speciation', definition: 'process of new species forming.' }, { term: 'allopatric', definition: 'separated geographically.' }, { term: 'sympatric', definition: 'in the same place.' }], estimatedMinutes: 4 },
    { id: 'concept-phylogeny', kind: 'concept', goal: 'Phylogeny: evolutionary relationships shown as branching trees.', keyIdeas: [
      'PHYLOGENETIC TREE: branching diagram showing how species are related.',
      'Each branching point = COMMON ANCESTOR.',
      'Closer branching = more recent common ancestor.',
      'Built using: morphology, fossils, and (most precisely) DNA sequences.',
      'CLADE: a group containing an ancestor + ALL its descendants.',
      'Tree shows that all life shares a common origin (~3.8 billion years ago).',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'worked-galapagos', kind: 'worked_example', problem: 'Darwin\'s Galápagos finches descended from one mainland species. Today there are 13+ species with different beak shapes. Apply allopatric speciation.', steps: [
      'Original finches blew/floated to the Galápagos islands.',
      'Different islands = different food sources (seeds, insects, cactus, etc.).',
      'Geographic ISOLATION between islands prevented gene flow.',
      'On each island, NATURAL SELECTION favored different beak shapes.',
      'Over many generations, populations diverged genetically + morphologically.',
      'Today: separate species, mostly unable to interbreed.',
      'Allopatric speciation in action.',
    ], answer: 'Geographic isolation + different selective pressures on each island → divergent evolution → 13+ species.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Two populations of squirrels live on opposite rims of the Grand Canyon. Over time they\'ve become genetically distinct but might still produce fertile hybrids if the canyon were filled in. Are they one species or two?', expectedAnswer: 'Hard to call definitively. Under the Biological Species Concept, if they CAN still interbreed and produce fertile offspring, they\'re technically one species — just with two divergent populations. Many biologists call them separate species (Kaibab and Abert squirrels) because of geographic isolation + observable divergence. Real-world cases blur the lines.', responseFormat: 'free', hints: ['BSC requires inability to interbreed.', 'Real cases often have ambiguous boundaries.'], estimatedMinutes: 3 },
    { id: 'misconception-evolution-progress', kind: 'misconception_check', question: 'A friend says "humans are the most evolved species — we\'re the peak of evolution." Right?', commonErrors: [{ answer: 'Yes — humans are peak.', misconception: 'Treating evolution as a directed ladder.', correctsTo: 'Evolution has NO direction or "peak." Every living species is equally evolved — they\'ve all had the same time since the last common ancestor. Humans are well-suited to certain niches; bacteria are spectacularly successful in theirs (they\'re everywhere). The "ladder" metaphor is wrong; "branching tree" is right.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Species = interbreeding group with fertile offspring.', 'Speciation: usually allopatric (geographic isolation).', 'Phylogeny = tree of relationships.', 'No "peak" — evolution branches, doesn\'t rank.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
