/**
 * AP Environmental Science — Unit 8 CED 8.3+8.7+8.8: Toxics, POPs, Biomagnification.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.toxics-pops-biomag.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_TOXICS_POPS_BIOMAG: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.toxics-pops-biomag.v1',
  course: 'AP Environmental Science',
  cedUnit: 8,
  cedTopic: '8.3+8.7+8.8',
  cedTitle: 'Toxics, POPs, Biomagnification',
  planId: 'evelyn.ap.envsci.toxics-pops-biomag.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.toxics-pops-biomag.v1' }],
  theory: [
    { loId: 'apenvsci.toxics-pops-biomag', content: `ENDOCRINE DISRUPTORS are chemicals that interfere with hormone systems by binding hormone receptors to either MIMIC or BLOCK natural hormones. Key examples: BPA (bisphenol A) in plastics binds estrogen receptors; PHTHALATES in PVC and cosmetics reduce sperm count; DDT mimics estrogen; ATRAZINE (herbicide) feminizes male frogs; PCBs disrupt thyroid and reproduction; plus organophosphate pesticides and excreted pharmaceuticals.` },
    { loId: 'apenvsci.toxics-pops-biomag', content: `HEALTH EFFECTS of endocrine disruptors: REPRODUCTIVE problems (fertility, hormonal imbalance), DEVELOPMENTAL effects in fetuses and children, increased CANCER risk (estrogen-sensitive tumors), and metabolic disorders. Critically, LOW-DOSE effects can occur at concentrations FAR BELOW classical toxicity thresholds because these chemicals disrupt developmental signaling rather than acting as simple poisons.` },
    { loId: 'apenvsci.toxics-pops-biomag', content: `DOSE-RESPONSE RELATIONSHIP: for most toxics, the biological effect increases with dose, and the standard summary statistic is the LD50 — the dose that is LETHAL to 50% of a test population. A LOWER LD50 means a MORE TOXIC substance (less is needed to kill half the group). Endocrine disruptors are notable exceptions: their dose-response can be NON-MONOTONIC, causing harm at tiny doses that a simple LD50 curve would miss.` },
    { loId: 'apenvsci.toxics-pops-biomag', content: `PERSISTENT ORGANIC POLLUTANTS (POPs) share four defining traits — remember PBT plus transport: PERSISTENT (do not break down readily), BIOACCUMULATIVE (accumulate in fat tissues), TOXIC, and subject to LONG-RANGE TRANSPORT (carried globally, found even in Arctic ice and polar wildlife). Banning a POP does not erase the legacy already spread through soils, sediments, and bodies.` },
    { loId: 'apenvsci.toxics-pops-biomag', content: `POP EXAMPLES: DDT (US-banned 1972), PCBs (US-banned 1979), DIOXINS (byproducts of combustion and paper bleaching), FURANS, the banned pesticides ALDRIN/DIELDRIN/ENDRIN, hexachlorobenzene, and the modern additions PFAS/PFOA ("forever chemicals"). The STOCKHOLM CONVENTION (2001) restricted the initial "dirty dozen" and now covers 30+ chemicals; in the US, the Toxic Substances Control Act (TSCA) regulates toxic chemicals.` },
    { loId: 'apenvsci.toxics-pops-biomag', content: `BIOACCUMULATION vs BIOMAGNIFICATION — the classic AP distinction. BIOACCUMULATION happens WITHIN a SINGLE ORGANISM: concentration builds up in its body over its lifetime. BIOMAGNIFICATION happens ACROSS TROPHIC LEVELS: concentration INCREASES at HIGHER levels because each predator eats many contaminated prey and retains the toxin.` },
    { loId: 'apenvsci.toxics-pops-biomag', content: `CLASSIC DDT BIOMAGNIFICATION cascade: algae 0.04 ppm → zooplankton 0.4 ppm → small fish 4 ppm → larger fish 40 ppm → fish-eating birds 400 ppm — a ROUGHLY 10,000-FOLD increase from the base of the food chain to the top predator. TRAITS THAT PROMOTE this: FAT-SOLUBLE (LIPOPHILIC) so the toxin is stored in fat instead of flushed by liver or kidney; PERSISTENT so it does not degrade; and a LOW EXCRETION RATE so the body retains it for years. Water-soluble, quickly-excreted compounds do NOT biomagnify.` },
    { loId: 'apenvsci.toxics-pops-biomag', content: `HISTORIC CASE — DDT: an agricultural pesticide used heavily in the 1940s-60s, it caused EGGSHELL THINNING in raptors by interfering with calcium metabolism, pushing bald eagles, ospreys, and peregrine falcons toward extinction. Rachel Carson's "Silent Spring" (1962) raised awareness; DDT was banned in the US in 1972; bird populations recovered and the bald eagle was delisted in 2007.` },
    { loId: 'apenvsci.toxics-pops-biomag', content: `HISTORIC CASE — MERCURY in tuna: coal burning emits mercury that deposits from the atmosphere into oceans and accumulates up the food chain, so TUNA, SWORDFISH, and SHARK carry the highest concentrations. EPA and FDA advise pregnant women and children to limit consumption because mercury causes NEUROLOGICAL DAMAGE, especially in the developing fetus.` },
    { loId: 'apenvsci.toxics-pops-biomag', kind: 'definition', title: 'endocrine disruptor', content: `a chemical that interferes with hormone systems by mimicking or blocking natural hormones, harmful even at low doses.` },
    { loId: 'apenvsci.toxics-pops-biomag', kind: 'definition', title: 'persistent organic pollutant (POP)', content: `a long-lasting, bioaccumulative, toxic chemical subject to long-range global transport (PBT + transport).` },
    { loId: 'apenvsci.toxics-pops-biomag', kind: 'definition', title: 'biomagnification', content: `the increase of a toxin's concentration at higher trophic levels as predators consume many contaminated prey.` },
  ],
  methods: [
    {
      title: 'Compute biomagnification through trophic levels',
      when_to_use: `When given a base concentration and a per-level magnification factor and asked for concentrations up the food chain and why the toxin magnifies.`,
      steps: [
        `STEP 1 — IDENTIFY the base concentration (usually in the producer, e.g. algae) and the per-level MAGNIFICATION FACTOR.`,
        `STEP 2 — MULTIPLY successively: each higher trophic level equals the level below times the magnification factor.`,
        `STEP 3 — COMPARE top to bottom by multiplying the per-level factors together for the TOTAL magnification (a 10x factor across 4 steps gives 10,000x).`,
        `STEP 4 — JUSTIFY using the traits: the toxin is LIPOPHILIC, PERSISTENT, and slowly excreted, so predators eating many prey accumulate the SUM and top predators carry the highest load.`,
      ],
      example: {
        problem: `A pesticide enters a lake at 0.04 ppm in algae. The biomagnification factor between trophic levels is 10x. Compute the concentration at each higher level and identify what enables the magnification.`,
        solution: `Algae 0.04 ppm → zooplankton 0.4 ppm → small fish 4 ppm → large fish 40 ppm → fish-eating bird 400 ppm, a 10,000x total increase. It magnifies because the pesticide is fat-soluble (lipophilic), persistent, and poorly excreted, so it accumulates and concentrates up the chain.`,
      },
      relatedLoIds: ['apenvsci.toxics-pops-biomag'],
    },
  ],
  pointers: [
    { content: `Bioaccumulation = buildup within ONE organism; biomagnification = increase ACROSS trophic levels. Don't swap them.`, kind: 'tip' },
    { content: `POPs = Persistent, Bioaccumulative, Toxic + long-range transport. Banning them doesn't remove the legacy.`, kind: 'tip' },
    { content: `To biomagnify a toxin must be fat-soluble, persistent, and slowly excreted. Water-soluble compounds don't.`, kind: 'tip' },
    { content: `LD50 = dose lethal to 50% of a test population; a LOWER LD50 means MORE toxic.`, kind: 'tip' },
    { content: `DDT thinned raptor eggshells (banned 1972); mercury biomagnifies in tuna/swordfish/shark — a fetal neurotoxin.`, kind: 'tip' },
    { content: `Endocrine disruptors (BPA, phthalates, atrazine) harm at LOW doses far below classic toxicity thresholds.`, kind: 'tip' },
  ],
};
