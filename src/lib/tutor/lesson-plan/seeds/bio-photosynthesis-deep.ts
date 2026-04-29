/**
 * HS Biology — Photosynthesis (Light-Dependent + Calvin Cycle).
 * NGSS HS-LS1-5: photosynthesis transforms light energy into chemical
 * energy stored in sugar molecules.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_PHOTOSYNTHESIS_DEEP: LessonPlan = {
  id: 'evelyn.hs.science.biology.photosynthesis-deep.v1',
  title: 'Photosynthesis: Light + Calvin Cycle',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'cell-biology', locale: 'en',
  los: [{ id: 'ngss.hs-ls1-5', description: 'Use a model to illustrate how photosynthesis transforms light energy into stored chemical energy.', standard: 'NGSS.HS-LS1-5' }],
  prerequisites: ['ngss.5-ls1-1'], followUps: [], estimatedMinutes: 25,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in scale.', script: 'Plants harvest energy from sunlight at unimaginable scale — the entire planet\'s biosphere runs on it. The chemistry happens in two stages, both inside chloroplasts.', estimatedMinutes: 2 },
    { id: 'concept-overall', kind: 'concept', goal: 'Overall: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Two stages: light-dependent + light-independent (Calvin cycle).', keyIdeas: [
      'Overall: 6CO₂ + 6H₂O + light energy → glucose (C₆H₁₂O₆) + 6O₂.',
      'Reverse of cellular respiration.',
      'Happens in CHLOROPLASTS (in plant + algal cells).',
      'Two stages:',
      '  · LIGHT-DEPENDENT REACTIONS — in thylakoid membranes. Captures light, splits water, produces ATP + NADPH, releases O₂.',
      '  · LIGHT-INDEPENDENT (CALVIN CYCLE) — in stroma. Uses ATP + NADPH to fix CO₂ into glucose.',
      'Color light matters: chlorophyll absorbs red + blue wavelengths well; reflects green (why plants look green).',
    ], vocabulary: [{ term: 'thylakoid', definition: 'membrane stacks inside chloroplast where light reactions happen.' }, { term: 'stroma', definition: 'fluid inside chloroplast where Calvin cycle runs.' }, { term: 'chlorophyll', definition: 'green pigment that absorbs light.' }], suggestedTools: ['show_balanced_equation'], estimatedMinutes: 5 },
    { id: 'concept-light-reactions', kind: 'concept', goal: 'Light reactions: split water, generate ATP + NADPH.', keyIdeas: [
      'PHOTOSYSTEM II absorbs light → energizes electrons.',
      'Water (H₂O) is SPLIT to replace those electrons → releases O₂ as byproduct.',
      'Energized electrons travel through ELECTRON TRANSPORT CHAIN → drives H⁺ pumping.',
      'H⁺ flows back through ATP SYNTHASE → makes ATP.',
      'PHOTOSYSTEM I re-energizes electrons → reduces NADP⁺ to NADPH.',
      'Outputs: ATP, NADPH (energy carriers for Calvin), O₂ (byproduct).',
    ], estimatedMinutes: 4 },
    { id: 'concept-calvin', kind: 'concept', goal: 'Calvin cycle: fix CO₂ into sugar using ATP + NADPH.', keyIdeas: [
      'Doesn\'t directly need light — needs ATP + NADPH from light reactions.',
      'CO₂ enters; combines with RuBP (5-carbon molecule) catalyzed by RUBISCO.',
      '6 CO₂ + RuBP cycles → eventually produces 1 glucose (6 carbons).',
      'Uses 18 ATP + 12 NADPH per glucose.',
      'Some intermediates regenerate RuBP to keep the cycle going.',
      'Glucose is then used for energy or stored as STARCH.',
    ], vocabulary: [{ term: 'RUBISCO', definition: 'enzyme that fixes CO₂ in Calvin cycle.' }, { term: 'carbon fixation', definition: 'incorporating CO₂ into organic molecules.' }], estimatedMinutes: 5 },
    { id: 'worked-trace', kind: 'worked_example', problem: 'Trace the journey of one CO₂ molecule from atmosphere to glucose.', steps: [
      '1. CO₂ enters leaf through STOMATA (tiny pores).',
      '2. Diffuses into mesophyll cells, then into chloroplast STROMA.',
      '3. RUBISCO catalyzes: CO₂ + RuBP → unstable 6C → splits to 2 × 3C molecules (3-PGA).',
      '4. ATP + NADPH (from light reactions) reduce 3-PGA → G3P (3-carbon sugar).',
      '5. Most G3P recycles to regenerate RuBP for the next cycle.',
      '6. Some G3P combines (every ~6 cycles) to form glucose (6C).',
      'Result: original CO₂ carbon now part of a glucose molecule.',
    ], answer: 'CO₂ → fixed by RUBISCO with RuBP → reduced via ATP/NADPH → G3P → glucose. The carbon from air becomes plant body.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'On a CLOUDY day, plants photosynthesize less. Which stage is directly affected, and how does that affect the other?', expectedAnswer: 'LIGHT-DEPENDENT reactions slow (less light → less ATP/NADPH made). Then CALVIN CYCLE slows because it depends on ATP + NADPH from the light reactions. Both stages are coupled.', responseFormat: 'free', hints: ['Which stage uses light directly?', 'Calvin cycle needs ATP/NADPH — where does it get them?'], estimatedMinutes: 3 },
    { id: 'misconception-calvin-no-light', kind: 'misconception_check', question: 'A friend says "Calvin cycle is also called \'dark reactions\' — does it actually happen at NIGHT?" Right?', commonErrors: [{ answer: 'Yes — at night.', misconception: 'Mistaking "light-independent" for "happens in dark".', correctsTo: 'Calvin cycle doesn\'t directly USE light — but it requires ATP + NADPH from the light reactions. At night, those run out, so Calvin cycle effectively halts. Best to call it "light-INDEPENDENT" not "dark" — it usually happens IN DAYLIGHT alongside light reactions.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Two stages: light-dependent (thylakoid) + Calvin (stroma).', 'Light reactions: split water, make ATP + NADPH, release O₂.', 'Calvin cycle: fix CO₂ into glucose using ATP + NADPH.', 'Both happen in chloroplasts in daylight.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
