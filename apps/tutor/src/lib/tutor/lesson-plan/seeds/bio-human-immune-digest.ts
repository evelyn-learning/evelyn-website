/**
 * HS Biology — Human Immune and Digestive Systems.
 * NGSS HS-LS1-2: hierarchical body systems.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_HUMAN_IMMUNE_DIGEST: LessonPlan = {
  id: 'evelyn.hs.science.biology.human-immune-digest.v1',
  title: 'Human Immune and Digestive Systems',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'human-body', locale: 'en',
  los: [{ id: 'ngss.hs-ls1-2', description: 'Develop and use a model to illustrate the hierarchical organization of interacting systems that provide specific functions within multicellular organisms.', standard: 'NGSS.HS-LS1-2' }],
  prerequisites: ['hs.bio.cell-theory-structure'], followUps: [], estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Two systems facing the outside world.', script: 'Every meal, you ingest billions of bacteria — most harmless, some dangerous. Your digestive system extracts nutrients from food while your immune system stops invaders. Both deal with the outside world entering your body — and they coordinate.', estimatedMinutes: 2 },
    { id: 'concept-digestion', kind: 'concept', goal: 'Digestion breaks food into absorbable molecules and absorbs them into blood.', keyIdeas: [
      'PURPOSE: break large food molecules → small ones cells can absorb.',
      'PATH: mouth → esophagus → stomach → small intestine → large intestine → out.',
      'MOUTH: chewing (mechanical) + saliva (amylase enzyme — starts breaking starch).',
      'STOMACH: acid (HCl, pH ~2) kills microbes + denatures proteins. Pepsin enzyme breaks proteins.',
      'SMALL INTESTINE: most digestion + absorption. Pancreas adds enzymes; liver/gallbladder add bile (emulsifies fat).',
      '  · Lined with VILLI (finger-like) and MICROVILLI → huge surface area for absorption.',
      'LARGE INTESTINE: absorbs water + houses gut microbiome (trillions of helpful bacteria).',
      'NUTRIENTS absorbed → enter blood → liver processes → distributed to cells.',
    ], vocabulary: [{ term: 'enzyme', definition: 'protein that speeds up reactions.' }, { term: 'villi', definition: 'finger-like projections in small intestine that increase absorption.' }, { term: 'microbiome', definition: 'community of microorganisms in the gut.' }], estimatedMinutes: 5 },
    { id: 'concept-immune', kind: 'concept', goal: 'Immune system distinguishes self from non-self and destroys threats.', keyIdeas: [
      'TWO BRANCHES:',
      'INNATE (born with it): fast, non-specific.',
      '  · Skin/mucus: barriers.',
      '  · Stomach acid: kills swallowed microbes.',
      '  · Phagocytes (macrophages, neutrophils): eat invaders.',
      '  · Inflammation: redness/swelling brings immune cells fast.',
      'ADAPTIVE (learned): slow, specific, has MEMORY.',
      '  · B CELLS: make ANTIBODIES that tag invaders.',
      '  · T CELLS: kill infected cells; coordinate response.',
      '  · MEMORY CELLS: remember past invaders → next time, response is fast.',
      'VACCINES train adaptive immunity using harmless versions of pathogens.',
      'AUTOIMMUNE diseases = immune system mistakenly attacking self.',
    ], estimatedMinutes: 5 },
    { id: 'worked-cold-fight', kind: 'worked_example', problem: 'Walk through what happens from the moment a cold virus enters your nose until you recover.', steps: [
      'Day 0: Virus enters nose, slips past mucus. Infects nasal cells.',
      'Innate: infected cells release ALARM signals → inflammation, runny nose, stuffy.',
      'Phagocytes arrive → eat free virus particles. Fever raises body temp (slows virus).',
      'Day 2-3: Adaptive ramps up. B CELLS that recognize this virus multiply → produce antibodies.',
      'Antibodies tag virus particles. T CELLS kill infected cells.',
      'Day 5-7: Antibodies overwhelm virus. Symptoms fade.',
      'Day 10+: MEMORY B + T cells stay around. Next time this exact virus appears → response is days faster.',
    ], answer: 'Innate fights immediately (symptoms = response, not the virus itself). Adaptive takes ~5 days but creates lasting memory.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why does the small intestine have villi and microvilli (folds upon folds)?', expectedAnswer: 'To MAXIMIZE SURFACE AREA for nutrient absorption. Smooth tube would absorb very little. With villi + microvilli, the small intestine has ~250 m² of absorbing surface (size of a tennis court) packed into a few meters of tube. More surface = more absorption per second = enough nutrients for the body.', responseFormat: 'free', hints: ['What\'s the geometric trick?', 'Surface area vs volume.'], estimatedMinutes: 3 },
    { id: 'misconception-antibiotics-virus', kind: 'misconception_check', question: 'A friend has a cold and asks the doctor for antibiotics. Why won\'t that work?', commonErrors: [{ answer: 'Antibiotics work for any infection.', misconception: 'Confusing bacteria with viruses.', correctsTo: 'ANTIBIOTICS only kill BACTERIA (target their cell walls or ribosomes). Cold and flu are caused by VIRUSES — completely different. Antibiotics do nothing to viruses. Worse: unnecessary antibiotic use breeds RESISTANT bacteria, a global health threat. Use antivirals or just rest.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Digestion: enzymes break food → absorbed in small intestine via villi.', 'Innate immunity: fast, non-specific, no memory.', 'Adaptive immunity: slow, specific, has memory (basis of vaccines).', 'Antibiotics target bacteria, not viruses.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
