/**
 * AP Biology — Cell signaling.
 *
 * How cells communicate: ligand binds receptor → signal transduction
 * → cellular response. Three stages, types of receptors, second
 * messengers.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_CELL_SIGNALING: LessonPlan = {
  id: 'evelyn.ap.bio.cell-signaling.v1',
  title: 'Cell signaling: how cells communicate',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.cell-signaling',
      description: 'Explain how cells communicate using cell-surface receptors and signal transduction pathways.',
      standard: 'AP-BIO-IST-3',
    },
  ],
  prerequisites: ['apbio.cell-membrane'],
  followUps: ['apbio.gene-expression'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame signaling as the language of multicellular life.',
      script: 'Your trillion cells aren\'t just sitting there — they\'re constantly TALKING. Hormone arrives, cell responds. Insect bites you, immune cells coordinate. Without cell signaling, multicellular life wouldn\'t exist. It\'s the language of bodies.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-stages',
      kind: 'concept',
      goal: 'Three stages of signaling + receptor types + amplification.',
      keyIdeas: [
        'STAGE 1 — RECEPTION: a signal molecule (LIGAND) binds a specific RECEPTOR. Like a key in a lock — only matching shape fits.',
        'STAGE 2 — TRANSDUCTION: the binding triggers a cascade INSIDE the cell. Often a series of phosphorylations (kinases). Adds amplification — one ligand → many activated proteins.',
        'STAGE 3 — RESPONSE: a change in cell behavior — gene expression, protein activity, ion flow, etc.',
        'RECEPTOR TYPES: 1) G-protein-coupled receptors (GPCRs — most common, ~800 in humans). 2) Receptor tyrosine kinases (RTKs — growth factors). 3) Ion channel receptors (open/close to let ions through). 4) Intracellular receptors (steroid hormones cross the membrane).',
        'SECOND MESSENGERS: small molecules that spread the signal inside. cAMP, Ca²⁺, IP₃. Allow rapid amplification.',
        'TERMINATION: signals must end. Phosphatases remove phosphates; receptors get internalized. Without termination, response is uncontrolled — basis of many cancers.',
      ],
      vocabulary: [
        { term: 'ligand', definition: 'a molecule that binds a receptor to trigger a signal.' },
        { term: 'transduction', definition: 'converting a signal from one form to another inside the cell.' },
        { term: 'second messenger', definition: 'a small molecule (cAMP, Ca²⁺) that spreads a signal inside the cell.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-epinephrine',
      kind: 'worked_example',
      problem: 'Trace what happens in a liver cell when epinephrine (adrenaline) binds its receptor.',
      steps: [
        'RECEPTION: epinephrine binds a GPCR on the liver cell membrane.',
        'TRANSDUCTION: GPCR activates a G-protein → activates adenylyl cyclase → makes cAMP (second messenger).',
        'cAMP activates protein kinase A (PKA) → phosphorylates phosphorylase kinase → activates glycogen phosphorylase.',
        'RESPONSE: glycogen phosphorylase breaks down glycogen → releases glucose into the blood.',
        'AMPLIFICATION: one epinephrine molecule → ~100 G-proteins → ~10,000 cAMPs → ~1,000,000 glucose molecules. Massive cascade.',
        'BIOLOGICAL MEANING: fight-or-flight response — adrenaline mobilizes glucose for energy.',
      ],
      answer: 'GPCR → cAMP → PKA → glycogen breakdown → glucose released',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why do steroid hormones (like estrogen) use INTRACELLULAR receptors instead of cell-surface ones?',
      expectedAnswer: 'they\'re lipid-soluble and can cross the membrane',
      responseFormat: 'free',
      hints: [
        'Steroid hormones are made of lipids.',
        'What kind of molecule can pass through a phospholipid bilayer easily?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-signal-direct',
      kind: 'misconception_check',
      question: 'Does the original ligand enter the cell and directly cause the response?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the ligand as the agent of cell response.',
          correctsTo: 'No — for surface receptors, the LIGAND stays OUTSIDE. The signal is RELAYED through transduction proteins inside. The ligand is just the trigger; the cell\'s own machinery does the work.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three stages: reception, transduction, response.',
        'Cell-surface receptors (GPCRs, RTKs) for water-soluble signals.',
        'Intracellular receptors for lipid-soluble signals (steroids).',
        'Second messengers (cAMP, Ca²⁺) amplify and spread the signal.',
        'Termination is critical — runaway signaling causes disease.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Many cancers involve receptors that signal CONTINUOUSLY without a ligand. Why does this drive uncontrolled growth?',
      hint: 'A constantly-on growth signal tells the cell to divide constantly. Mutations in EGFR (epidermal growth factor receptor) drive many breast and lung cancers. Targeted therapies (Herceptin) block this signaling.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
