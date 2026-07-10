/**
 * AP Environmental Science — Unit 9 CED 9.6-9.7: Ocean Warming and Acidification.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.ocean-changes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_OCEAN_CHANGES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.ocean-changes.v1',
  course: 'AP Environmental Science',
  cedUnit: 9,
  cedTopic: '9.6-9.7',
  cedTitle: 'Ocean Warming and Acidification',
  planId: 'evelyn.ap.envsci.ocean-changes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.ocean-changes.v1' }],
  theory: [
    { loId: 'apenvsci.ocean-changes', content: `OCEANS ARE THE PLANET'S CLIMATE BUFFER: they have absorbed ~90% of the excess HEAT from human-caused warming since 1970 and ~30% of human CO2 EMISSIONS. Without this buffering, atmospheric warming would be far worse. But absorption is NOT free — it drives two damaging processes at once: ocean WARMING and ocean ACIDIFICATION. This is the core tension of the topic.` },
    { loId: 'apenvsci.ocean-changes', content: `OCEAN WARMING AND ITS CONSEQUENCES: the top 700 m of ocean has warmed ~0.6°C since 1969, with heat slowly reaching deeper layers. Effects: THERMAL EXPANSION (warm water expands) drives ~50% of sea-level rise; warmer water holds LESS DISSOLVED OXYGEN, expanding low-oxygen DEAD ZONES; CORAL BLEACHING as heat-stressed corals expel their algae; poleward SPECIES RANGE SHIFTS; more intense HURRICANES (warm water = more energy); and FISHERY DECLINES, especially for cold-water species.` },
    { loId: 'apenvsci.ocean-changes', kind: 'definition', title: 'thermal expansion', content: `the increase in volume of water as it warms; it accounts for roughly 50% of observed sea-level rise, alongside land-ice melt.` },
    { loId: 'apenvsci.ocean-changes', kind: 'definition', title: 'coral bleaching', content: `heat-stressed corals EXPEL their symbiotic algae (zooxanthellae), losing both color and their main energy source; prolonged bleaching leads to coral death.` },
    { loId: 'apenvsci.ocean-changes', content: `THE CORAL-BLEACHING MECHANISM: corals live in symbiosis with ZOOXANTHELLAE (algae) that photosynthesize and feed them. When sea temperature runs ~1°C+ above normal for weeks, corals expel the algae — turning WHITE (bleached) and losing their food supply. Bleached corals can survive only ~2-4 weeks of heat; if cooling returns the algae can recolonize, but PROLONGED heat (2-3+ months) starves and kills them. Bleaching is a warning sign, not always instant death — but repeated events prevent recovery.` },
    { loId: 'apenvsci.ocean-changes', content: `WHY REEFS MATTER SO MUCH: coral reefs cover ~1% of the ocean by area yet support ~25% of all marine species — a staggering biodiversity concentration. Mass bleaching events are rising in frequency and severity: 1998 (with ENSO), 2010, the 2014-17 three-year global event, and 2023-25 (the worst on record). The Great Barrier Reef has lost ~50% of its corals in 30 years and Caribbean coral is down ~80% since the 1970s.` },
    { loId: 'apenvsci.ocean-changes', kind: 'definition', title: 'ocean acidification', content: `the drop in ocean pH as absorbed CO2 forms carbonic acid, releasing hydrogen ions and reducing the carbonate available to shell-building organisms.` },
    { loId: 'apenvsci.ocean-changes', content: `THE ACIDIFICATION CHEMISTRY (memorize the sequence): CO2 + H2O → H2CO3 (carbonic acid). The carbonic acid then dissociates: H2CO3 → H+ + HCO3-. The extra HYDROGEN IONS (H+) LOWER the pH, making the ocean more acidic. Ocean pH has fallen from ~8.2 (pre-industrial) to ~8.1 (2020) — and because pH is LOGARITHMIC, that 0.1-unit drop is a ~30% INCREASE in H+ concentration. Projected to fall another 0.3-0.4 units by 2100.` },
    { loId: 'apenvsci.ocean-changes', content: `WHY ACIDIFICATION HARMS SHELL-BUILDERS: shells and coral skeletons are made of CALCIUM CARBONATE (CaCO3), which requires CARBONATE IONS (CO3 2-). The extra H+ from acidification grabs those carbonate ions: H+ + CO3 2- → HCO3-. That leaves LESS carbonate available for building shells, so organisms struggle to grow them. Below about pH 7.8, EXISTING SHELLS begin to DISSOLVE. Vulnerable groups: corals, oysters, clams, mussels, scallops, sea urchins, and planktonic foraminifera and PTEROPODS at the base of marine food webs. The Pacific Northwest oyster industry collapsed in 2007 from acidified upwelled water.` },
    { loId: 'apenvsci.ocean-changes', content: `COMPOUNDING STRESSORS: reefs and marine ecosystems rarely face one problem alone — WARMING, ACIDIFICATION, reduced dissolved OXYGEN, and SEA-LEVEL RISE hit simultaneously and multiply each other's damage. Some organisms (certain coral species, microbes) can adapt, but the RATE of change now exceeds the pace of adaptation. Because oceans absorb both the heat and the CO2, cutting CO2 emissions is the single biggest lever for BOTH warming and acidification.` },
  ],
  methods: [
    {
      title: 'Trace a coral reef from heat stress to collapse',
      when_to_use: `When asked to explain the timeline of what happens to a reef after a marine heat wave.`,
      steps: [
        `STEP 1 — HEAT SPIKE: sea-surface temperature rises ~1°C+ above normal for weeks.`,
        `STEP 2 — BLEACHING: corals expel their zooxanthellae, turning white and losing their food source.`,
        `STEP 3 — SHORT WINDOW: bleached corals survive only ~2-4 weeks; if cooling returns, algae may recolonize.`,
        `STEP 4 — STARVATION: prolonged heat (2-3+ months) starves, weakens, and kills the corals.`,
        `STEP 5 — DIE-OFF: months later, 10-50% of corals in the affected reef are dead.`,
        `STEP 6 — HABITAT LOSS: without coral structure, reef fish lose habitat and populations crash; some species go locally extinct.`,
        `STEP 7 — ALGAL SHIFT: algae outcompete the dying corals, and the reef can flip to an ALGAL-DOMINATED state.`,
        `STEP 8 — RECOVERY OR COLLAPSE: recovery over decades is possible only if temperatures normalize and no further bleaching occurs; with continued warming and repeated bleaching the reef COLLAPSES and cannot recover, losing coastal protection, fisheries, and tourism.`,
      ],
      example: {
        problem: `A coral reef ecosystem experiences heat stress that causes bleaching. Trace what happens to the reef over months to years.`,
        solution: `Heat spike → corals expel algae and bleach → short survival window → prolonged heat kills corals → 10-50% die-off → reef fish lose habitat and decline → algae take over → reef recovers only if cooling returns, otherwise collapses under repeated bleaching.`,
      },
      relatedLoIds: ['apenvsci.ocean-changes'],
    },
  ],
  pointers: [
    { content: `Oceans buffer climate: ~90% of excess heat and ~30% of CO2 absorbed — at the cost of warming + acid.`, kind: 'tip' },
    { content: `Thermal expansion of warming water drives ~50% of sea-level rise (ice melt is the rest).`, kind: 'tip' },
    { content: `Bleaching = corals EXPEL symbiotic algae under heat; reversible if cooling returns quickly.`, kind: 'tip' },
    { content: `Acidification chemistry: CO2 + H2O → H2CO3 → H+ + HCO3-; more H+ means lower pH.`, kind: 'tip' },
    { content: `Extra H+ steals carbonate (CO3 2-), so shell-builders (CaCO3) can't grow; below pH 7.8 shells dissolve.`, kind: 'tip' },
    { content: `pH is logarithmic: a 0.1-unit drop (8.2 to 8.1) is a ~30% rise in H+ concentration.`, kind: 'tip' },
  ],
};
