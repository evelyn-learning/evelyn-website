/**
 * HS Biology — Biotechnology and Ethics.
 * NGSS HS-LS3-1: DNA technology, CRISPR, GMOs.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_BIOTECH_ETHICS: LessonPlan = {
  id: 'evelyn.hs.science.biology.biotech-ethics.v1',
  title: 'Biotechnology and Bioethics',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'biotechnology', locale: 'en',
  los: [{ id: 'ngss.hs-ls3-1', description: 'Ask questions to clarify relationships about the role of DNA and chromosomes in coding the instructions for characteristic traits.', standard: 'NGSS.HS-LS3-1' }],
  prerequisites: ['hs.bio.dna-structure-replication', 'hs.bio.protein-synthesis'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in CRISPR.', script: 'In 2020, scientists used CRISPR to edit DNA inside a living person — and cured them of sickle cell disease. The same tool could also engineer "designer babies." Biotechnology gives us power that biology has never had. The ethics are still catching up.', estimatedMinutes: 2 },
    { id: 'concept-tools', kind: 'concept', goal: 'Modern biotechnology = tools to read, copy, edit, and engineer DNA.', keyIdeas: [
      'PCR (Polymerase Chain Reaction): copies DNA exponentially. Used in COVID tests, forensics, ancestry kits.',
      'GEL ELECTROPHORESIS: separates DNA fragments by size. Identifies people, paternity, criminals.',
      'DNA SEQUENCING: reads the order of bases. Whole human genome now takes ~1 day, ~$200 (vs $3 billion in 2003).',
      'GENETIC ENGINEERING: insert genes from one organism into another. (Insulin made by bacteria with the human insulin gene.)',
      'CRISPR-Cas9: precision DNA editor. Cuts at a specific spot — cell repairs (often imperfectly) → gene knocked out OR replaced.',
      'CLONING: making genetic copies (Dolly the sheep, 1996). Used in research; rare for whole organisms.',
    ], vocabulary: [{ term: 'PCR', definition: 'method to copy DNA exponentially.' }, { term: 'CRISPR', definition: 'precise DNA editing tool.' }, { term: 'GMO', definition: 'genetically modified organism.' }], estimatedMinutes: 5 },
    { id: 'concept-applications', kind: 'concept', goal: 'Biotech applications: medicine, agriculture, forensics, research.', keyIdeas: [
      'MEDICINE:',
      '  · Insulin, growth hormone, vaccines made by engineered bacteria/yeast.',
      '  · Gene therapy: fix bad genes (sickle cell, some cancers, blindness).',
      '  · Personalized medicine: drugs matched to your genome.',
      'AGRICULTURE (GMOs):',
      '  · Bt corn: makes its own insecticide (less spraying).',
      '  · Golden rice: makes vitamin A (prevents blindness in poor regions).',
      '  · Drought-resistant crops.',
      'FORENSICS: DNA fingerprints from crime scenes.',
      'RESEARCH: model organisms with disease genes inserted to study cures.',
      'EMERGING: lab-grown meat, gene-edited crops, synthetic biology.',
    ], estimatedMinutes: 4 },
    { id: 'worked-crispr', kind: 'worked_example', problem: 'Walk through how CRISPR could be used to cure sickle cell disease.', steps: [
      'Sickle cell = single point mutation in HBB gene → misshapen red blood cells.',
      'Take patient\'s bone marrow cells (where blood cells are made).',
      'Use CRISPR to find the exact mutation site in the HBB gene.',
      'Cas9 enzyme CUTS the DNA at that spot.',
      'Provide a healthy DNA template → cell repairs the cut using the template.',
      'Now the gene is FIXED. Re-infuse cells into patient.',
      'New blood cells made = healthy. Patient cured.',
      '(2023: FDA approved this exact treatment, "Casgevy.")',
    ], answer: 'CRISPR cuts at the bad spot, cell repairs using a healthy template, fixed cells produce healthy blood. First FDA-approved CRISPR therapy was for sickle cell.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Editing a person\'s OWN cells (somatic) is widely accepted; editing EMBRYOS (germline) is mostly banned. Why the difference?', expectedAnswer: 'Somatic edits affect ONLY that person — change dies with them. Germline edits affect EVERY future descendant — permanent change to the human gene pool. Risks: unforeseen side effects passed down forever; eugenics concerns ("designer babies"); inequality if only rich can afford. Most countries ban germline editing in humans for now.', responseFormat: 'free', hints: ['Whose DNA gets changed permanently?', 'What are the long-term consequences?'], estimatedMinutes: 3 },
    { id: 'misconception-gmo-dangerous', kind: 'misconception_check', question: 'A friend says "GMO foods are dangerous to eat." Right?', commonErrors: [{ answer: 'Yes — GMOs are dangerous.', misconception: 'Equating "GMO" with toxic.', correctsTo: 'Decades of studies + every major scientific body (WHO, AAAS, EU Commission) conclude GMO foods are AS SAFE as conventional. Real concerns are different: corporate control of seeds, pesticide use patterns, ecological effects of widespread monocultures. The food itself is safe; the system around it deserves scrutiny.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['PCR copies DNA, sequencing reads it, CRISPR edits it.', 'Biotech is in medicine, agriculture, forensics, research.', 'Somatic gene therapy = accepted; germline editing = mostly banned.', 'Ethical questions matter as much as technical ones.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
