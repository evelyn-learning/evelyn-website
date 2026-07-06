/**
 * AP Environmental Science — Unit 7 CED 7.1+7.4+7.5: Air Pollution Sources.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.air-pollution-sources.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_AIR_POLLUTION_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.air-pollution-sources.v1',
  course: 'AP Environmental Science',
  cedUnit: 7,
  cedTopic: '7.1+7.4+7.5',
  cedTitle: 'Air Pollution Sources',
  planId: 'evelyn.ap.envsci.air-pollution-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.air-pollution-sources.v1' }],
  theory: [
    { loId: 'apenvsci.air-pollution-sources', content: 'POLLUTANT CLASSIFICATIONS:' },
    { loId: 'apenvsci.air-pollution-sources', content: `  • PRIMARY POLLUTANTS: emitted directly into atmosphere (CO, SO₂, NOx, particulates, VOCs).` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • SECONDARY POLLUTANTS: form in atmosphere from primary pollutants (ozone O₃, photochemical smog, acid rain).` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • POINT SOURCES: identifiable, fixed location (smokestacks, factories, power plants). Easy to regulate.` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • NONPOINT SOURCES: diffuse, hard to identify (cars, lawn mowers, agriculture). Harder to regulate.` },
    { loId: 'apenvsci.air-pollution-sources', content: 'EPA CRITERIA POLLUTANTS (memorize 6 — set under Clean Air Act):' },
    { loId: 'apenvsci.air-pollution-sources', content: `  • CARBON MONOXIDE (CO): from incomplete combustion. Primary, point + nonpoint. Binds hemoglobin → asphyxiation. Major source: motor vehicles.` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • LEAD (Pb): from leaded gasoline (mostly phased out), batteries. Primary. Cumulative neurotoxin, developmental effects in children.` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • NITROGEN OXIDES (NOx — NO + NO₂): from high-temp combustion. Primary. Contributes to smog, acid rain. Major from cars, power plants.` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • SULFUR DIOXIDE (SO₂): from coal/oil combustion + smelting. Primary. Major source: coal-fired power plants. Causes acid rain.` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • PARTICULATE MATTER (PM): tiny particles. PM10 (≤10μm) and PM2.5 (≤2.5μm). PM2.5 most dangerous — penetrates deep into lungs. Sources: combustion, dust, fires, industry.` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • OZONE (O₃, ground-level): SECONDARY pollutant — forms when NOx + VOCs react in sunlight. NOT to be confused with stratospheric ozone (which protects). Ground ozone harmful.` },
    { loId: 'apenvsci.air-pollution-sources', content: '  • These 6 are SUBJECT TO NATIONAL AMBIENT AIR QUALITY STANDARDS (NAAQS).' },
    { loId: 'apenvsci.air-pollution-sources', content: 'OTHER MAJOR OUTDOOR POLLUTANTS:' },
    { loId: 'apenvsci.air-pollution-sources', content: `  • VOCs (volatile organic compounds): solvents, gasoline, paints. Primary. React with NOx to form ozone.` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • CO₂: greenhouse gas. Not regulated as criteria pollutant historically; now under EPA endangerment finding.` },
    { loId: 'apenvsci.air-pollution-sources', content: `  • Methane (CH₄): from landfills, agriculture, gas leaks. Potent greenhouse gas.` },
    { loId: 'apenvsci.air-pollution-sources', content: 'INDOOR AIR POLLUTANTS:' },
    { loId: 'apenvsci.air-pollution-sources', content: `  • RADON: radioactive gas from rock/soil decay; seeps into basements. #2 cause of lung cancer (after smoking) in US.` },
    { loId: 'apenvsci.air-pollution-sources', content: '  • CARBON MONOXIDE: from gas appliances, heaters, garages.' },
    { loId: 'apenvsci.air-pollution-sources', content: '  • TOBACCO SMOKE: secondhand smoke contains thousands of chemicals.' },
    { loId: 'apenvsci.air-pollution-sources', content: '  • VOCs: paints, cleaners, furniture, carpets, air fresheners.' },
    { loId: 'apenvsci.air-pollution-sources', content: '  • MOLD/MILDEW: especially in damp basements/bathrooms.' },
    { loId: 'apenvsci.air-pollution-sources', content: '  • COMBUSTION: stoves, fireplaces, candles release particulates and CO.' },
    { loId: 'apenvsci.air-pollution-sources', content: '  • ASBESTOS: old building materials. Lung cancer when inhaled.' },
    { loId: 'apenvsci.air-pollution-sources', content: '  • LEAD: old paint, water pipes, dust.' },
    { loId: 'apenvsci.air-pollution-sources', content: '  • FORMALDEHYDE: from pressed wood (particle board), insulation.' },
    { loId: 'apenvsci.air-pollution-sources', content: `WHY INDOOR AIR IS WORSE: 
  • Indoor pollutant concentrations often 2-5× outdoor.
  • Most people spend ~90% of time indoors.
  • Many homes have poor ventilation.` },
    { loId: 'apenvsci.air-pollution-sources', kind: 'definition', title: 'primary pollutant', content: 'directly emitted into atmosphere.' },
    { loId: 'apenvsci.air-pollution-sources', kind: 'definition', title: 'secondary pollutant', content: 'formed in atmosphere from primary pollutants.' },
    { loId: 'apenvsci.air-pollution-sources', kind: 'definition', title: 'criteria pollutants', content: 'six EPA-regulated outdoor pollutants under NAAQS.' },
  ],
  methods: [
    {
      title: 'Worked classify',
      steps: [
        `(a) SO₂: PRIMARY (emitted directly), POINT source (single power plant). Criteria pollutant.`,
        `(b) Ozone: SECONDARY (formed when NOx + VOCs + sunlight react). One of the 6 criteria pollutants.`,
        `(c) Acid rain: SECONDARY (forms when SO₂ and NOx react with water in atmosphere → H₂SO₄ and HNO₃).`,
        `(d) Exhaust: PRIMARY pollutants (CO, NOx, particulates), NONPOINT source (many cars, diffuse).`,
      ],
      example: { problem: `Classify each pollutant: (a) Sulfur dioxide from a power plant. (b) Ground-level ozone. (c) Acid rain falling on a forest. (d) Exhaust from rush-hour traffic.`, solution: '(a) primary/point. (b) secondary. (c) secondary. (d) primary/nonpoint.' },
      relatedLoIds: ['apenvsci.air-pollution-sources'],
    },
  ],
  pointers: [
    { content: 'Primary (emitted directly) vs secondary (forms in atmosphere).', kind: 'tip' },
    { content: 'Point (factory) vs nonpoint (cars, agriculture).', kind: 'tip' },
    { content: '6 criteria pollutants: CO, Pb, NOx, SO₂, PM, O₃ (only secondary).', kind: 'tip' },
    { content: 'Indoor pollutants often 2-5× outdoor concentration; spend 90% of time indoors.', kind: 'tip' },
  ],
};
