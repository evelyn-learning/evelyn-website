/**
 * AP Environmental Science — Unit 9 CED 9.3-9.5: Greenhouse Effect and Climate Change.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.greenhouse-climate.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_GREENHOUSE_CLIMATE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.greenhouse-climate.v1',
  course: 'AP Environmental Science',
  cedUnit: 9,
  cedTopic: '9.3-9.5',
  cedTitle: 'Greenhouse Effect and Climate Change',
  planId: 'evelyn.ap.envsci.greenhouse-climate.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.greenhouse-climate.v1' }],
  theory: [
    { loId: 'apenvsci.greenhouse-climate', kind: 'definition', title: 'greenhouse effect', content: `the NATURAL process by which greenhouse gases (GHGs) absorb INFRARED radiation emitted by Earth's surface and re-emit it in all directions — including back down — warming the surface.` },
    { loId: 'apenvsci.greenhouse-climate', content: `NATURAL vs ENHANCED greenhouse effect (key AP distinction): WITHOUT any greenhouse effect Earth would average about -18°C — frozen and uninhabitable. WITH the natural greenhouse effect Earth averages about +15°C — habitable. The PROBLEM is not the greenhouse effect itself; it is that human emissions ENHANCE it, pushing temperatures higher than the natural baseline.` },
    { loId: 'apenvsci.greenhouse-climate', content: `THE ENERGY-BALANCE MECHANISM (why more CO2 warms Earth): the Sun sends SHORT-wavelength UV and visible light, most of which passes through the atmosphere and is absorbed by the surface. The warmed surface re-radiates energy as LONGER-wavelength INFRARED. GHGs absorb that infrared and re-emit it in all directions, sending roughly half back down. Add more CO2 → more absorption and re-emission → the surface must warm until outgoing infrared again balances incoming energy, so equilibrium settles at a HIGHER temperature.` },
    { loId: 'apenvsci.greenhouse-climate', content: `THE MAJOR GREENHOUSE GASES (memorize sources and lifetimes): CARBON DIOXIDE (CO2) — #1 by volume, from FOSSIL-FUEL COMBUSTION and deforestation; lifetime of centuries to millennia; rose from ~280 ppm pre-industrial to ~420 ppm today. METHANE (CH4) — from cattle, rice paddies, manure, landfills, fossil-fuel/fracking leaks, and wetlands; ~10-year lifetime but ~25-30x more potent than CO2 over 100 years. NITROUS OXIDE (N2O) — from fertilizer breakdown and combustion; ~300x more potent per molecule. FLUORINATED gases (HFCs, PFCs, SF6) — industrial, thousands of times more potent but in tiny volumes. WATER VAPOR (H2O) — natural, not directly emitted but amplified as a FEEDBACK.` },
    { loId: 'apenvsci.greenhouse-climate', kind: 'definition', title: 'GWP (global warming potential)', content: `a comparative measure of how much heat a gas traps relative to CO2 (= 1) over a set period, usually 100 years. CH4 ≈ 25-30, N2O ≈ 273, HFC-134a ≈ 1,300, SF6 ≈ 22,800.` },
    { loId: 'apenvsci.greenhouse-climate', content: `POTENCY vs CONTRIBUTION — do not confuse the two. A gas can be extremely POTENT per molecule yet contribute little total warming because it is emitted in small amounts. By lifecycle CONTRIBUTION to current warming: CO2 ~76%, CH4 ~16%, N2O ~6%, fluorinated gases ~2%. CO2 dominates by sheer volume even though methane and N2O have far higher GWP. This is why CO2 reduction is the primary lever, while methane cuts offer high leverage per ton.` },
    { loId: 'apenvsci.greenhouse-climate', content: `EVIDENCE OF CLIMATE CHANGE (independent lines that CONVERGE): global temperature ~1.2°C above pre-industrial, with 9 of the 10 warmest years since 2014; Arctic sea ice declining ~13% per decade; Greenland and Antarctic ice sheets losing mass (Greenland ~280 Gt/year); SEA-LEVEL RISE ~21 cm since 1880 and accelerating to ~3.4 mm/year (thermal expansion + ice melt); ocean top 700 m absorbing 90% of excess heat; ocean pH down 0.1 unit (~30% more acidic); glacier retreat; permafrost thaw; more intense hurricanes, fires, droughts, and downpours; poleward and upslope range shifts; and widespread coral bleaching.` },
    { loId: 'apenvsci.greenhouse-climate', content: `POSITIVE FEEDBACK LOOPS amplify warming (FRQ favorite): ALBEDO feedback — melting ice exposes dark ocean/land that absorbs more sunlight → more melt. WATER-VAPOR feedback — a warmer atmosphere holds more water vapor, itself a GHG → more warming. PERMAFROST-METHANE feedback — thawing permafrost lets microbes release methane → more warming. FOREST DIEBACK — heat and drought kill trees, releasing carbon and cutting photosynthesis. Each loop reinforces itself, making warming harder to stop.` },
    { loId: 'apenvsci.greenhouse-climate', kind: 'definition', title: 'tipping point', content: `a threshold beyond which change becomes abrupt and self-sustaining — e.g. permafrost thaw, Greenland/West Antarctic ice-sheet collapse, Amazon dieback, or AMOC (Atlantic overturning circulation) slowdown.` },
    { loId: 'apenvsci.greenhouse-climate', content: `PROJECTED IMPACTS (IPCC) by 2100: 1.5-4°C+ of warming depending on the emissions pathway, an additional 0.4-1.2 m of sea-level rise, severe water and food-security stress, climate refugees from coastal and arid regions, mass-extinction risk for many species, and health harms from heat waves and expanding disease ranges.` },
    { loId: 'apenvsci.greenhouse-climate', content: `WARMING IS "LOCKED IN" (why urgency matters): even if ALL emissions stopped today, temperatures would NOT stabilize immediately. CO2 already emitted persists for centuries; oceans keep releasing stored heat; ice sheets and permafrost respond over decades. Roughly 0.5°C of additional warming is committed. True stabilization requires NET-ZERO — or even NEGATIVE — emissions, meaning removals (forests, direct air capture) balance or exceed what we still emit. That is what "carbon neutrality" means, and most nations target it around 2050-2070.` },
  ],
  methods: [
    {
      title: 'Convert emissions to CO2-equivalent using GWP',
      when_to_use: `When a problem gives you masses of different GHGs and asks for total climate impact in CO2-equivalents.`,
      steps: [
        `STEP 1 — IDENTIFY each gas and its GWP (CO2 = 1; use the methane/N2O GWP given in the problem).`,
        `STEP 2 — For EACH gas, multiply its mass by its GWP: CO2-equivalent = mass × GWP.`,
        `STEP 3 — CO2 itself has GWP = 1, so its CO2-equivalent equals its mass.`,
        `STEP 4 — SUM the CO2-equivalents of all gases for total emissions.`,
        `STEP 5 — INTERPRET: compare each gas's share of CO2-eq to its share of mass to see why a low-mass gas like methane can dominate the climate impact.`,
      ],
      example: {
        problem: `A farm releases 1 ton of methane and 100 tons of CO2 per year. Methane GWP = 28 (over 100 years). (a) Compute the CO2-equivalent of the methane. (b) Total emissions in CO2-equivalents.`,
        solution: `(a) 1 ton CH4 × 28 = 28 tons CO2-eq. (b) 28 + 100 = 128 tons CO2-eq. Methane is 28% of the climate impact despite being only 1% of the mass — which is why capping methane leaks is high-leverage.`,
      },
      relatedLoIds: ['apenvsci.greenhouse-climate'],
    },
  ],
  pointers: [
    { content: `Greenhouse effect is NATURAL and necessary (+15°C vs -18°C); the problem is humans ENHANCING it.`, kind: 'tip' },
    { content: `Sun sends short-wave in; surface re-emits INFRARED; GHGs absorb IR and send half back down.`, kind: 'tip' },
    { content: `GWP ranks potency vs CO2=1: CH4 ~28, N2O ~273, SF6 ~22,800. CO2-eq = mass × GWP.`, kind: 'tip' },
    { content: `Potency is not contribution: CO2 causes ~76% of warming by sheer volume despite GWP of 1.`, kind: 'tip' },
    { content: `Positive feedbacks (albedo, water vapor, permafrost methane) amplify warming — cite two on FRQs.`, kind: 'tip' },
    { content: `~0.5°C is locked in; stabilizing needs NET-ZERO, not just zero new emissions.`, kind: 'tip' },
  ],
};
