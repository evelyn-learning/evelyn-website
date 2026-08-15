/**
 * HS Biology — Cell Membrane and Transport.
 * NGSS HS-LS1-2: phospholipid bilayer; passive vs active transport.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_CELL_MEMBRANE_TRANSPORT: LessonPlan = {
  id: 'evelyn.hs.science.biology.cell-membrane-transport.v1',
  title: 'Cell Membrane and Transport',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'cell-biology', locale: 'en',
  los: [{ id: 'ngss.hs-ls1-2', description: 'Develop and use a model to illustrate the hierarchical organization of interacting systems.', standard: 'NGSS.HS-LS1-2' }],
  prerequisites: ['ngss.ms-ls1-2'], followUps: [], estimatedMinutes: 25,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in the gatekeeping role.', script: 'Every cell in your body decides what gets in and what stays out — sugar, oxygen, sodium ions, water. The cell membrane isn\'t just a wrapper; it\'s an intelligent gatekeeper. How does it work?', estimatedMinutes: 2 },
    { id: 'concept-bilayer', kind: 'concept', goal: 'Phospholipid bilayer with embedded proteins. Hydrophilic heads outside, hydrophobic tails inside.', keyIdeas: [
      'PHOSPHOLIPID has two parts: HEAD (hydrophilic — water-loving) and TAILS (hydrophobic — water-fearing).',
      'Phospholipids form a BILAYER: heads face the watery cytoplasm + outside; tails point inward, away from water.',
      'Embedded PROTEINS act as channels, pumps, and receptors.',
      'CHOLESTEROL adds fluidity control.',
      'GLYCOPROTEINS on the surface help with cell-cell recognition.',
      'Membrane is FLUID and SELECTIVELY PERMEABLE — small nonpolar molecules pass freely; ions and large polar molecules need transport proteins.',
    ], vocabulary: [{ term: 'phospholipid bilayer', definition: 'two layers of phospholipids forming the membrane.' }, { term: 'selectively permeable', definition: 'lets some things through, blocks others.' }], estimatedMinutes: 5 },
    { id: 'concept-transport-types', kind: 'concept', goal: 'Passive (no energy) vs active (uses ATP).', keyIdeas: [
      'PASSIVE TRANSPORT (no ATP):',
      '  · DIFFUSION: small nonpolar molecules (O₂, CO₂) cross directly down concentration gradient.',
      '  · FACILITATED DIFFUSION: ions/polar molecules use protein channels — still down gradient.',
      '  · OSMOSIS: water moves through aquaporins toward higher solute concentration.',
      'ACTIVE TRANSPORT (needs ATP):',
      '  · PUMP PROTEINS push molecules AGAINST concentration gradient (e.g., sodium-potassium pump in nerve cells).',
      '  · ENDOCYTOSIS: cell engulfs a particle (phagocytosis = "cell eating").',
      '  · EXOCYTOSIS: cell ejects materials (insulin secretion, neurotransmitter release).',
    ], vocabulary: [{ term: 'diffusion', definition: 'movement from high to low concentration.' }, { term: 'osmosis', definition: 'diffusion of water across a membrane.' }, { term: 'active transport', definition: 'uses energy to pump against gradient.' }], estimatedMinutes: 5 },
    { id: 'worked-osmosis', kind: 'worked_example', problem: 'You put a red blood cell in PURE WATER. What happens, and why?', steps: [
      'Inside the cell: ~0.9% salt concentration. Outside (pure water): 0% salt.',
      'Water OUTSIDE has LESS solute, INSIDE has MORE solute.',
      'OSMOSIS: water moves from low-solute side (outside) to high-solute side (inside).',
      'Water rushes INTO the cell.',
      'Cell SWELLS and eventually BURSTS (lysis). Red blood cells in pure water hemolyze.',
    ], answer: 'Water rushes IN by osmosis → cell swells → bursts.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A nerve cell uses sodium-potassium pumps to keep Na⁺ low inside and K⁺ high inside (the opposite of outside). Why does this need ATP — couldn\'t the cell just let ions diffuse?', expectedAnswer: 'The pump moves ions AGAINST their concentration gradient (Na⁺ from low to high outside; K⁺ from low to high inside). Movement against the natural gradient REQUIRES energy. Diffusion alone would equalize the concentrations, destroying the gradient the cell needs for nerve signaling.', responseFormat: 'free', hints: ['Diffusion goes high to low — the cell wants the OPPOSITE.', 'Going against the gradient needs energy.'], estimatedMinutes: 3 },
    { id: 'misconception-membrane-static', kind: 'misconception_check', question: 'A friend says "the cell membrane is like a hard shell — fixed in place." Right?', commonErrors: [{ answer: 'Yes — fixed.', misconception: 'Treating membrane as rigid wall.', correctsTo: 'Membranes are FLUID — phospholipids constantly drift around within their layer. Proteins also move. The "fluid mosaic model" describes this. Without fluidity, the membrane would crack instead of flex.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Phospholipid bilayer: hydrophilic heads out, hydrophobic tails in.', 'Selectively permeable.', 'Passive transport (no ATP) follows gradient.', 'Active transport (ATP) goes against gradient.', 'Osmosis = water flow toward higher solute concentration.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
