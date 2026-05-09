/**
 * AP Environmental Science — Unit 8 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_ENVSCI_U8_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.envsci.u8-frq-practice.v1', title: 'U8 FRQ Practice',
  curriculum: 'AP', grade: '11', subject: 'science', topic: 'ap-environmental-science', locale: 'en',
  los: [{ id: 'apenvsci.u8-frq-practice', description: 'Apply Unit 8 pollution concepts to AP-style FRQs.', standard: 'AP-ENVSCI-8-FRQ' }],
  prerequisites: ['apenvsci.solid-waste'], followUps: [], estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Two Unit 8 FRQs: eutrophication + biomagnification.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Water pollution: point/nonpoint; types (pathogens, BOD, nutrients, toxics).',
      'Eutrophication: nutrients → algae → die → decomp → hypoxia.',
      'Thermal pollution: warm water = less DO.',
      'POPs: persistent, bioaccumulative, toxic, transported globally. DDT, PFAS.',
      'Waste hierarchy + RCRA, Superfund.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-eutroph', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Eutrophication. Lake Erie experiences toxic algal blooms each summer, blocking water treatment for cities like Toledo. (a) Identify TWO sources of nutrient pollution in the Lake Erie watershed. (b) Trace the chain of events from nutrient input to fish kill / drinking-water crisis. (c) Suggest THREE management strategies at the SOURCE level.',
      expectedAnswer: '(a) Sources:\n• AGRICULTURAL RUNOFF — fertilizer (N, P) from corn/soy farms in Ohio, Indiana, Michigan watershed. Largest contributor. \n• MUNICIPAL SEWAGE — older treatment plants release N + P. Secondary treatment doesn\'t remove all. \n• URBAN STORMWATER — lawn fertilizer + pet waste. \n• MANURE from confined animal feeding operations (CAFOs). (1.5)\n(b) Chain:\n• Spring rains carry FERTILIZER into tributaries → Lake Erie. \n• Western Lake Erie (shallow, warm) experiences MASSIVE BLOOM of cyanobacteria (Microcystis aeruginosa). \n• Blooms produce TOXIN (microcystin) — toxic to liver. \n• Algae die, decomposers consume oxygen → HYPOXIC ZONES near bottom. \n• Fish kills near bottom; bottom-dwellers most affected. \n• Drinking water from lake intake contaminated with microcystin. \n• 2014: TOLEDO water unsafe for 3 days; 500,000 residents affected. \n• Beach closures during blooms. \n• Cyanobacteria can be fatal to dogs that drink lake water. (3.5)\n(c) Source-level management:\n• PRECISION AGRICULTURE — apply only as much fertilizer as needed; soil testing. \n• COVER CROPS in winter to absorb residual N. \n• BUFFER STRIPS along streams (vegetation absorbs runoff). \n• CONSERVATION TILLAGE / NO-TILL — keeps soil + nutrients on field. \n• BANNING fall fertilizer application. \n• Constructed WETLANDS to filter agricultural drainage. \n• Animal waste management — cover lagoons, prevent runoff. \n• Upgrade SEWAGE TREATMENT to advanced (tertiary) — removes N + P. \n• Banning phosphate detergents (long since done). (3)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['Sources, mechanism, source-level mitigation.'], estimatedMinutes: 6 },
    { id: 'try-frq-biomag', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Biomagnification. PCBs (polychlorinated biphenyls) were used as electrical insulators until banned in 1979. They persist in environment for decades. (a) Identify three characteristics that make PCBs particularly concerning. (b) Trace biomagnification of PCBs through a marine food web (algae → zooplankton → small fish → tuna → whale). (c) Why are top predators like ORCAS particularly at risk? (d) Suggest ONE policy and ONE individual action to reduce exposure.',
      expectedAnswer: '(a) PCB characteristics:\n• PERSISTENT — extremely stable C-Cl bonds; don\'t degrade in environment for decades. Found in soils, sediments, fish today even though banned 45+ years ago. \n• BIOACCUMULATIVE — fat-soluble; stored in fatty tissues; not flushed by liver/kidney. \n• TOXIC — cause cancer, reproductive failure, immune dysfunction, neurological problems. \n• LONG-RANGE TRANSPORT — found in Arctic ecosystems (no local sources); via atmospheric circulation. (2.5)\n(b) Biomagnification trace:\n• Algae absorb PCBs from contaminated water. Concentration: ~0.025 ppm. \n• Zooplankton eat algae. Each eats many algae cells. Concentration: ~0.25 ppm (10× algae). \n• Small fish eat zooplankton. Concentration: ~2.5 ppm (10× zooplankton). \n• Tuna eat small fish (top predator already). Concentration: ~25 ppm. \n• Whales (or dolphins, seals) eat tuna and other large fish. Concentration: ~250 ppm. \n• OVERALL: ~10,000× from algae to whale. \nCharacteristic ratios for actual PCB studies in marine systems. (3)\n(c) Top predators (orcas):\n• Eat MANY prey, accumulating sum of all their PCB. \n• Long lifespans → lifetime accumulation high. \n• High body fat (especially blubber) — PCBs concentrated. \n• REPRODUCTIVE consequences: PCBs transferred to milk → newborn orcas heavily exposed. Many populations declining (e.g., Southern Resident orcas in Pacific NW). (1.5)\n(d) Policy + individual:\n• POLICY: continued strict enforcement of bans; cleanup of legacy contaminated sites; remediation of fish-eating birds\' habitats. STOCKHOLM CONVENTION coordinates internationally. \n• INDIVIDUAL: limit consumption of long-lived large fish (large tuna, swordfish, shark, large striped bass) — eat smaller, shorter-lived fish or vegetarian protein. Pregnant women and children especially careful. (1)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['POP characteristics; biomagnification math; top-predator vulnerability.'], estimatedMinutes: 6 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Eutrophication: chain from nutrients to dead zones.',
      'POPs persist + bioaccumulate + biomagnify.',
      'Top predators most vulnerable to bioaccumulating toxics.',
      'Specific cases: Lake Erie/Toledo, Mississippi/Gulf dead zone, DDT/eagles.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '8', cedTopic: '8-FRQ', cedTitle: 'Unit 8 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Env Sci Unit-8 FRQs.' }] },
};
