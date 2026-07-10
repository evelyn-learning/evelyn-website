/**
 * AP Environmental Science — Unit 9 CED 9.1-9.2: Stratospheric Ozone.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.ozone.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_OZONE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.ozone.v1',
  course: 'AP Environmental Science',
  cedUnit: 9,
  cedTopic: '9.1-9.2',
  cedTitle: 'Stratospheric Ozone',
  planId: 'evelyn.ap.envsci.ozone.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.ozone.v1' }],
  theory: [
    { loId: 'apenvsci.ozone', content: `TWO OZONES, SAME MOLECULE (O3), OPPOSITE ROLES depending on ALTITUDE. STRATOSPHERIC ozone (15-35 km) is "GOOD" — it absorbs UV-B and UV-C radiation, shielding life from DNA damage, skin cancer, cataracts, and ecosystem harm. TROPOSPHERIC ozone (ground level) is "BAD" — a secondary pollutant and component of PHOTOCHEMICAL SMOG that damages lungs, irritates eyes, and harms crops. The AP trap: do NOT confuse them. About 90% of atmospheric ozone sits in the stratosphere.` },
    { loId: 'apenvsci.ozone', kind: 'definition', title: 'stratospheric ozone', content: `the "GOOD" ozone at 15-35 km altitude that absorbs UV radiation and protects life on Earth's surface.` },
    { loId: 'apenvsci.ozone', content: `NATURAL OZONE-OXYGEN CYCLE (how good ozone forms and is destroyed naturally): UV light splits O2 into 2 free O atoms. Each O atom combines with an O2 molecule to form O3. UV also splits O3 back into O2 + O, so ozone is CONTINUOUSLY created and destroyed. Net steady-state concentration is roughly 10 ppm in the stratosphere. This natural cycle is BALANCED — CFCs are what tip it toward destruction.` },
    { loId: 'apenvsci.ozone', kind: 'definition', title: 'CFC (chlorofluorocarbon)', content: `a stable, human-made compound (refrigerants, propellants, solvents from the 1930s) that rises intact to the stratosphere and releases ozone-destroying chlorine; banned by the Montreal Protocol.` },
    { loId: 'apenvsci.ozone', content: `WHY CFCs ARE SO DANGEROUS: they are CHEMICALLY STABLE in the lower atmosphere, so they do NOT break down at ground level. Instead they slowly drift UPWARD over ~5-10 years until they reach the stratosphere, where INTENSE UV light finally cracks them apart and frees chlorine atoms. Other ozone-depleting substances: HALONS (release bromine, Br), nitrous oxide, methyl bromide, methyl chloroform.` },
    { loId: 'apenvsci.ozone', content: `THE CATALYTIC CHLORINE CYCLE (memorize both steps): STEP 1: Cl + O3 → ClO + O2 (one ozone destroyed). STEP 2: ClO + O → Cl + O2 (the chlorine atom is REGENERATED). Because the Cl is handed back at the end, it is a CATALYST — it is NOT consumed. One single Cl atom destroys roughly 100,000 O3 molecules over its ~100-year stratospheric lifetime. This is why a small mass of CFCs does enormous damage.` },
    { loId: 'apenvsci.ozone', kind: 'definition', title: 'catalyst (chlorine)', content: `a substance that speeds a reaction without being used up; one Cl atom cycles repeatedly, destroying ~100,000 ozone molecules.` },
    { loId: 'apenvsci.ozone', content: `THE ANTARCTIC OZONE HOLE: discovered in 1985 by the British Antarctic Survey. It forms in the ANTARCTIC SPRING (September-October). The recipe: extreme cold + POLAR STRATOSPHERIC CLOUDS + isolation inside the POLAR VORTEX create ideal surfaces for chlorine chemistry. The hole grew to ~30 million square km by the late 1990s. CONSEQUENCES: more UV at the surface → higher skin-cancer rates in the Southern Hemisphere, PHYTOPLANKTON damage that cascades through Antarctic food webs, and harm to crops and marine life.` },
    { loId: 'apenvsci.ozone', content: `THE MONTREAL PROTOCOL (1987) — the most successful environmental treaty in history. It PHASES OUT ozone-depleting substances and achieved UNIVERSAL RATIFICATION (all 197 nations — the only UN treaty ever to do so). CFCs were banned by 2010 in developed countries and 2030 in developing countries. RESULTS: CFC emissions fell more than 99% from peak, stratospheric chlorine is now declining, the ozone layer is HEALING, and full recovery is expected by ~2070. The Antarctic hole is already smaller than its peak.` },
    { loId: 'apenvsci.ozone', content: `THE REPLACEMENT LADDER (each generation fixed the last problem but created a new one): CFCs → HCFCs (hydrochlorofluorocarbons, LESS ozone-depleting, a transitional bridge, now phasing out) → HFCs (hydrofluorocarbons, ZERO ozone depletion BUT potent greenhouse gases, 1,000-3,000x CO2) → HFOs (hydrofluoroolefins, low on BOTH ozone and climate impact). The 2016 KIGALI AMENDMENT uses the proven Montreal framework to phase DOWN climate-warming HFCs, extending an ozone treaty to fight climate change (estimated to avoid ~0.5°C of warming by 2100).` },
    { loId: 'apenvsci.ozone', content: `WHY MONTREAL SUCCEEDED WHERE PARIS STRUGGLES (a classic AP comparison): Montreal targeted a SMALL, BOUNDED set of substances (~100), affordable SUBSTITUTES existed, the science was clear, the threat was VISIBLE (skin cancer, the dramatic hole image), industry found market opportunity in alternatives, and TRADE PENALTIES enforced compliance. The Paris Agreement on climate is far HARDER: it spans every economic sector, substitutes are less mature, and enforcement is voluntary with no penalties. Lesson: international cooperation works best on SOLVABLE, BOUNDED problems.` },
  ],
  methods: [
    {
      title: 'Trace a CFC molecule from your refrigerator to ozone destruction',
      when_to_use: `When an FRQ asks you to explain the full mechanism by which a stable CFC ends up depleting stratospheric ozone.`,
      steps: [
        `STEP 1 — RELEASE: a CFC (e.g. CFCl3, "Freon-11") leaks from a refrigerator or escapes during disposal.`,
        `STEP 2 — SLOW RISE: the CFC is STABLE in the lower atmosphere, so it does not decay. It drifts upward with air currents, taking ~5-10 YEARS to reach the stratosphere.`,
        `STEP 3 — UV EXPOSURE: at 15-35 km the UV light is intense enough to break chemical bonds.`,
        `STEP 4 — CHLORINE RELEASED: UV breaks the carbon-chlorine bond, freeing a chlorine atom (CFCl3 + UV → CFCl2 + Cl).`,
        `STEP 5 — OZONE DESTROYED: Cl + O3 → ClO + O2. One ozone molecule is gone.`,
        `STEP 6 — CHLORINE REGENERATED: ClO + O → Cl + O2. The catalyst is handed back, ready to strike again.`,
        `STEP 7 — CATALYTIC REPEAT: that same Cl atom destroys ~100,000 O3 molecules over its ~100-year lifetime before removal.`,
      ],
      example: {
        problem: `Trace the chemistry: how does a CFC molecule (e.g., CFCl3, "Freon-11") in your refrigerator end up destroying stratospheric ozone?`,
        solution: `CFC leaks → rises intact over 5-10 years to the stratosphere → UV releases a Cl atom → Cl + O3 → ClO + O2 destroys ozone, then ClO + O → Cl + O2 regenerates the chlorine → one Cl catalytically destroys ~100,000 ozone molecules.`,
      },
      relatedLoIds: ['apenvsci.ozone'],
    },
  ],
  pointers: [
    { content: `Stratospheric O3 = GOOD (blocks UV); tropospheric O3 = BAD (smog). Same molecule, altitude decides.`, kind: 'tip' },
    { content: `CFCs are dangerous BECAUSE they are stable — they survive to reach the stratosphere intact.`, kind: 'tip' },
    { content: `Chlorine is a CATALYST: regenerated each cycle, so 1 Cl destroys ~100,000 O3 molecules.`, kind: 'tip' },
    { content: `Montreal Protocol (1987): universal ratification, CFCs down 99%+, ozone healing by ~2070.`, kind: 'tip' },
    { content: `Ladder: CFCs → HCFCs → HFCs (no ozone harm but strong GHG) → HFOs. Kigali phases down HFCs.`, kind: 'tip' },
    { content: `Montreal beat Paris because it was bounded, had substitutes, clear science, and trade penalties.`, kind: 'tip' },
  ],
};
