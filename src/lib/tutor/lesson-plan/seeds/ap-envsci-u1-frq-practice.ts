/**
 * AP Environmental Science — Unit 1 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_ENVSCI_U1_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.envsci.u1-frq-practice.v1', title: 'U1 FRQ Practice',
  curriculum: 'AP', grade: '11', subject: 'science', topic: 'ap-environmental-science', locale: 'en',
  los: [{ id: 'apenvsci.u1-frq-practice', description: 'Apply Unit 1 ecosystems and energy/cycles concepts in AP-style FRQs.', standard: 'AP-ENVSCI-1-FRQ' }],
  prerequisites: ['apenvsci.food-webs'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 1 FRQs: biome/biogeochem cycle, energy flow + 10% rule, food-web cascade. AP rewards specific examples and quantitative reasoning.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Biomes: climate-defined; know the 7 terrestrial.',
      'Cycles: C (photosynthesis/respiration/combustion), N (fixation/nitrification/denitrification), P (no atmosphere; weathering).',
      'NPP = GPP − R. 10% rule for trophic transfer.',
      'Keystone species, biomagnification (DDT classic example).',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-cycles', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Nitrogen Cycle. A farmer applies excess nitrogen fertilizer that runs off into a nearby lake, causing an algal bloom and fish kill. (a) Name the nitrogen-cycle process by which the fertilizer was originally manufactured (industrial source). (b) Trace the chain of events from fertilizer application to fish kill — describe at least 4 steps. (c) Suggest two practices that would reduce N runoff.',
      expectedAnswer: '(a) HABER-BOSCH process (industrial nitrogen fixation). Uses high temperature and pressure to convert N₂ + H₂ → NH₃ (ammonia), which is then processed into fertilizers. Started early 1900s; doubled global N fixation. (1.5)\n(b) (1) Excess fertilizer (NO₃⁻, NH₄⁺) on field. \n(2) Heavy rain causes RUNOFF — fertilizer washes into streams/ditches. \n(3) Nutrient enters lake → ALGAL BLOOM (nitrogen and phosphorus enrichment fuels rapid algae growth). \n(4) Algae die quickly (light-blocked or short life cycle). \n(5) DECOMPOSERS break down dead algae using DO (dissolved oxygen). \n(6) Lake becomes HYPOXIC — fish suffocate (FISH KILL). EUTROPHICATION. (4)\n(c) Practices: \n• Apply only as much fertilizer as needed (PRECISION AGRICULTURE / soil testing). \n• BUFFER STRIPS (vegetated borders along streams) absorb runoff. \n• COVER CROPS in winter reduce off-season runoff. \n• CONSTRUCTED WETLANDS to filter agricultural drainage. \n• Avoid applying fertilizer before forecasted heavy rain. (2)\nTotal: 7.5 points.',
      responseFormat: 'frq', hints: ['Haber-Bosch; eutrophication chain; specific BMPs.'], estimatedMinutes: 7 },
    { id: 'try-frq-energy', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Productivity / Energy Flow. A grassland ecosystem has GPP = 20,000 kcal/m²/yr and producer respiration = 8,000 kcal/m²/yr. Use the 10% rule (with 10% efficiency) for trophic transfer. (a) Calculate NPP. (b) Calculate energy at primary, secondary, and tertiary consumer levels. (c) Explain WHY only ~10% transfers between levels — describe the 90% loss.',
      expectedAnswer: '(a) NPP = GPP − R = 20,000 − 8,000 = 12,000 kcal/m²/yr. (1.5)\n(b) Primary consumers: 12,000 × 0.10 = 1,200 kcal/m²/yr. \nSecondary consumers: 1,200 × 0.10 = 120 kcal/m²/yr. \nTertiary consumers: 120 × 0.10 = 12 kcal/m²/yr. (3)\n(c) The 90% loss between trophic levels: \n• Most energy is used for METABOLISM/RESPIRATION (cellular work, body heat, movement). \n• Energy is lost as HEAT to the environment (thermodynamics). \n• Some food is UNDIGESTED — passes out as waste; that energy is not assimilated. \n• Some prey die without being eaten (go to decomposers, not predators). \nTransfer is INEFFICIENT — that\'s why food chains are short and apex predators are rare. (2.5)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['NPP first; cascade by 10%; 90% loss reasons.'], estimatedMinutes: 6 },
    { id: 'try-frq-cascade', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Food Web / Trophic Cascade. In Yellowstone National Park, wolves were eradicated in the 1920s. Elk populations grew unchecked, overbrowsing aspen and willow trees. Beavers (which eat willows) declined. Songbirds dependent on riparian vegetation also declined. Wolves were reintroduced in 1995. (a) Identify the keystone species. (b) Explain the trophic cascade BEFORE reintroduction. (c) Predict three changes that occurred AFTER reintroduction. (d) State one limitation or caveat in interpreting this case.',
      expectedAnswer: '(a) WOLVES (top predator; keystone species — disproportionate impact relative to numbers). (1)\n(b) Without wolves: \n• Elk population grew (no predation pressure). \n• Elk overgrazed willows and aspen. \n• Willows declined → beavers lost food/dam materials → beaver populations crashed. \n• Beaver dams disappeared → wetlands disappeared → aquatic species declined. \n• Riparian vegetation (along rivers) lost → songbirds, fish, insects all impacted. (2.5)\n(c) After reintroduction: \n• Elk populations declined (and behavior changed — they avoided open browsing in valleys). \n• Willow and aspen recovered. \n• Beavers returned, dams rebuilt, wetlands re-formed. \n• Riparian habitat improved → songbirds, fish, beavers all rebounded. \n• Carrion from wolf kills supported scavengers (eagles, ravens, bears). (2.5)\n(d) Limitations/caveats: \n• Other variables changed simultaneously (climate, drought patterns, fire policy). Hard to isolate wolf effect. \n• Some studies argue elk decline was as much from harsh winters as from wolf predation. \n• Recovery slower than initial Yellowstone narrative suggested. \n• Local ecology context matters; results may not generalize to all systems. (1.5)\nTotal: 7.5 points.',
      responseFormat: 'frq', hints: ['Keystone, cascade, recovery, scientific caveats.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'AP rubrics reward specific examples (Haber-Bosch, DDT, Yellowstone, Mississippi).',
      'Cycles: identify processes by name; trace step-by-step; suggest mitigation.',
      'Energy: NPP = GPP − R; 10% per trophic level.',
      'Cascades: identify keystone, trace removal effects.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1-FRQ', cedTitle: 'Unit 1 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Env Sci Unit-1 FRQs.' }] },
};
