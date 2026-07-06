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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.ozone.v1' }],
  theory: [
    { loId: 'apenvsci.ozone', content: 'TWO OZONES — opposite roles:' },
    { loId: 'apenvsci.ozone', content: `  • STRATOSPHERIC OZONE (15-35 km altitude): "GOOD" ozone. Absorbs UV-B and UV-C radiation. Protects life on Earth from DNA damage, skin cancer, cataracts, ecosystem damage.` },
    { loId: 'apenvsci.ozone', content: `  • TROPOSPHERIC OZONE (ground-level): "BAD" ozone. Component of photochemical smog. Damages lungs, irritates eyes, harms vegetation.` },
    { loId: 'apenvsci.ozone', content: '  • SAME molecule (O₃) — different effects depending on location.' },
    { loId: 'apenvsci.ozone', content: 'OZONE FORMATION (in stratosphere):' },
    { loId: 'apenvsci.ozone', content: '  • UV light splits O₂ → 2 O atoms.' },
    { loId: 'apenvsci.ozone', content: '  • O atom + O₂ → O₃ (ozone).' },
    { loId: 'apenvsci.ozone', content: `  • OZONE-OXYGEN CYCLE continuously creates and destroys ozone naturally; net concentration ~10 ppm in stratosphere.` },
    { loId: 'apenvsci.ozone', content: 'OZONE DEPLETION:' },
    { loId: 'apenvsci.ozone', content: `  • CFCs (chlorofluorocarbons) — used as refrigerants, propellants, solvents from 1930s. Stable in atmosphere; rise to stratosphere over years.` },
    { loId: 'apenvsci.ozone', content: '  • UV light splits CFCs → release CHLORINE atoms.' },
    { loId: 'apenvsci.ozone', content: '  • Cl + O₃ → ClO + O₂. Ozone destroyed.' },
    { loId: 'apenvsci.ozone', content: '  • ClO + O₃ → Cl + 2O₂. Cl atom released to destroy MORE ozone.' },
    { loId: 'apenvsci.ozone', content: `  • CATALYTIC: one Cl atom destroys ~100,000 O₃ molecules over ~100 years before being removed.` },
    { loId: 'apenvsci.ozone', content: `  • Other ozone-depleting substances: HALONS (Br), nitrous oxide, methyl bromide, methyl chloroform.` },
    { loId: 'apenvsci.ozone', content: 'ANTARCTIC OZONE HOLE:' },
    { loId: 'apenvsci.ozone', content: '  • Discovered 1985 by British Antarctic Survey.' },
    { loId: 'apenvsci.ozone', content: '  • Forms in spring (Sept-Oct) over Antarctic.' },
    { loId: 'apenvsci.ozone', content: `  • Polar stratospheric clouds + extreme cold + isolation of polar vortex create perfect conditions for chlorine chemistry.` },
    { loId: 'apenvsci.ozone', content: '  • Hole grew to ~30 million sq km in late 1990s.' },
    { loId: 'apenvsci.ozone', content: `  • CONSEQUENCES: 
     - Increased UV reaching surface.
     - Skin cancer rates higher in S. Hemisphere.
     - Phytoplankton damage in Antarctic Ocean → cascade through food web.
     - Damage to crops, marine life.` },
    { loId: 'apenvsci.ozone', content: 'MONTREAL PROTOCOL (1987):' },
    { loId: 'apenvsci.ozone', content: '  • International treaty to PHASE OUT ozone-depleting substances.' },
    { loId: 'apenvsci.ozone', content: `  • RATIFIED BY 197 NATIONS — universal ratification (only treaty in UN history).` },
    { loId: 'apenvsci.ozone', content: '  • Banned CFCs by 2010 (developed countries) / 2030 (developing).' },
    { loId: 'apenvsci.ozone', content: `  • REPLACED CFCs WITH:
     - HCFCs (hydrochlorofluorocarbons) — less ozone-depleting; phase-out underway.
     - HFCs (hydrofluorocarbons) — no ozone depletion BUT potent greenhouse gas.
     - Newer alternatives (HFOs) reduce both impacts.` },
    { loId: 'apenvsci.ozone', content: `  • RESULTS:
     - CFC emissions dropped >99% from peak.
     - Stratospheric chlorine levels declining.
     - OZONE LAYER HEALING; expected full recovery by 2070.
     - Antarctic hole already smaller in 2020s than peak.` },
    { loId: 'apenvsci.ozone', content: 'WHY MONTREAL SUCCEEDED (compared to Paris Agreement on climate):' },
    { loId: 'apenvsci.ozone', content: '  • Smaller number of substances to regulate.' },
    { loId: 'apenvsci.ozone', content: '  • Substitutes were available (industrial chemists found alternatives).' },
    { loId: 'apenvsci.ozone', content: '  • Strong scientific consensus + visible threat (skin cancer).' },
    { loId: 'apenvsci.ozone', content: '  • Industry initially resisted but eventually saw market opportunities.' },
    { loId: 'apenvsci.ozone', content: '  • Trade penalties for non-compliant nations.' },
    { loId: 'apenvsci.ozone', content: '  • Periodic strengthening (London, Copenhagen, Kigali Amendments).' },
    { loId: 'apenvsci.ozone', kind: 'definition', title: 'CFC', content: 'chlorofluorocarbon — ozone-depleting substance, banned.' },
    { loId: 'apenvsci.ozone', kind: 'definition', title: 'Montreal Protocol', content: '1987 treaty phasing out ozone-depleting substances; universal ratification.' },
    { loId: 'apenvsci.ozone', kind: 'definition', title: 'stratospheric ozone', content: '"good" ozone protecting life from UV radiation.' },
  ],
  methods: [
    {
      title: 'Worked cycle',
      steps: [
        'STEP 1 — CFC LEAKS or is released during refrigerator disposal.',
        `STEP 2 — CFC is STABLE in lower atmosphere (won't decay quickly). Slowly rises with air currents — takes ~5-10 YEARS to reach stratosphere.`,
        'STEP 3 — In stratosphere (15-35 km), UV light is intense.',
        'STEP 4 — UV BREAKS the C-Cl bond: CFCl₃ + UV → CFCl₂• + Cl•',
        'STEP 5 — Free Cl atom: Cl + O₃ → ClO + O₂. ONE OZONE DESTROYED.',
        `STEP 6 — ClO + O (single atom from another O₂ split) → Cl + O₂. CHLORINE REGENERATED.`,
        'STEP 7 — That same Cl atom can destroy MORE OZONE — net catalysis.',
        `STEP 8 — One Cl atom destroys ~100,000 O₃ molecules over its ~100-year stratospheric lifetime.`,
        `CONCLUSION: stable CFC in your refrigerator → catalytic stratospheric chlorine cycle → massive ozone depletion. Why CFCs were banned despite seeming safe.`,
      ],
      example: { problem: `Trace the chemistry: how does a CFC molecule (e.g., CFCl₃, "Freon-11") in your refrigerator end up destroying stratospheric ozone?`, solution: `CFC → rises to stratosphere → UV releases Cl → catalytic cycle destroys ~100,000 ozone molecules per Cl.` },
      relatedLoIds: ['apenvsci.ozone'],
    },
  ],
  pointers: [
    { content: 'Two ozones: stratospheric (good, blocks UV) vs tropospheric (bad, smog).', kind: 'tip' },
    { content: 'CFCs broken by UV in stratosphere release catalytic Cl atoms.', kind: 'tip' },
    { content: 'One Cl destroys ~100,000 ozone molecules over its lifetime.', kind: 'tip' },
    { content: 'Montreal Protocol (1987): universal ratification, >99% reduction in CFCs.', kind: 'tip' },
    { content: 'Kigali Amendment extends to phase down HFCs (climate-relevant).', kind: 'tip' },
  ],
};
