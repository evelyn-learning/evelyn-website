/**
 * AP Environmental Science — Unit 7 CED 7.7: Acid Rain.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.acid-rain.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_ACID_RAIN: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.acid-rain.v1',
  course: 'AP Environmental Science',
  cedUnit: 7,
  cedTopic: '7.7',
  cedTitle: 'Acid Rain',
  planId: 'evelyn.ap.envsci.acid-rain.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.acid-rain.v1' }],
  theory: [
    { loId: 'apenvsci.acid-rain', content: `ACID RAIN: precipitation with pH below normal (~5.6). Often pH 4-5 in affected areas; sometimes pH 3.` },
    { loId: 'apenvsci.acid-rain', content: 'CHEMISTRY:' },
    { loId: 'apenvsci.acid-rain', content: `  • SO₂ (sulfur dioxide) + H₂O + O₂ → H₂SO₄ (sulfuric acid). Mostly from coal-fired power plants.` },
    { loId: 'apenvsci.acid-rain', content: `  • NOx (nitrogen oxides) + H₂O + O₂ → HNO₃ (nitric acid). From motor vehicles, power plants.` },
    { loId: 'apenvsci.acid-rain', content: '  • Acids dissolve in clouds → fall as acid rain, snow, fog.' },
    { loId: 'apenvsci.acid-rain', content: `TRANSPORT: acids travel HUNDREDS of miles downwind before falling. Famous case: midwestern coal plants → Adirondacks (NY) and Appalachians acid rain damage.` },
    { loId: 'apenvsci.acid-rain', content: 'IMPACTS:' },
    { loId: 'apenvsci.acid-rain', content: `  • LAKES/STREAMS: lower pH harms aquatic life. Fish (especially eggs, fry) die. Many Adirondack lakes became too acidic for fish in 1980s.` },
    { loId: 'apenvsci.acid-rain', content: `  • FORESTS: leaches calcium and magnesium from soil; leaves brown; trees weakened. Spruces and pines particularly vulnerable.` },
    { loId: 'apenvsci.acid-rain', content: '  • SOIL: leaches nutrients (Ca, Mg, K); mobilizes toxic aluminum.' },
    { loId: 'apenvsci.acid-rain', content: `  • BUILDINGS/MONUMENTS: acid dissolves limestone, marble, concrete, metals. Greek and Roman monuments degrading; Statue of Liberty corroded.` },
    { loId: 'apenvsci.acid-rain', content: `  • HUMAN HEALTH: respiratory problems (especially asthma). Acidic particulates cause lung disease.` },
    { loId: 'apenvsci.acid-rain', content: `  • DRINKING WATER: acidic water dissolves lead, copper from pipes (e.g., Flint Michigan situation aggravated by acidic water).` },
    { loId: 'apenvsci.acid-rain', content: `MEASURING: pH scale (0-14, 7 neutral). Each unit = 10x more acidic. pH 4 is 1000× more acidic than pH 7.` },
    { loId: 'apenvsci.acid-rain', content: 'CONTROL via 1990 Clean Air Act AMENDMENTS:' },
    { loId: 'apenvsci.acid-rain', content: '  • Mandated SO₂ EMISSION REDUCTIONS via cap-and-trade.' },
    { loId: 'apenvsci.acid-rain', content: '  • Power plants given pollution PERMITS; could trade.' },
    { loId: 'apenvsci.acid-rain', content: '  • Total cap REDUCED over time.' },
    { loId: 'apenvsci.acid-rain', content: '  • Incentivized cheapest reductions (scrubbers + switch to low-sulfur coal).' },
    { loId: 'apenvsci.acid-rain', content: `  • RESULT: SO₂ EMISSIONS dropped >70% from 1990 → 2018. Acid rain pH normalized in many areas. Cited as the most successful environmental regulation.` },
    { loId: 'apenvsci.acid-rain', content: 'TECHNICAL CONTROLS:' },
    { loId: 'apenvsci.acid-rain', content: '  • SCRUBBERS on power plants — react SO₂ with calcium carbonate to form gypsum.' },
    { loId: 'apenvsci.acid-rain', content: '  • LOW-SULFUR coal use.' },
    { loId: 'apenvsci.acid-rain', content: '  • SWITCH FROM COAL to natural gas/renewables.' },
    { loId: 'apenvsci.acid-rain', content: '  • CATALYTIC CONVERTERS in cars reduce NOx.' },
    { loId: 'apenvsci.acid-rain', content: `INTERNATIONAL: acid rain is transboundary. US-Canada Air Quality Agreement (1991) coordinates. Europe also addressed via EU regulations.` },
    { loId: 'apenvsci.acid-rain', kind: 'definition', title: 'acid rain', content: 'precipitation with pH < 5.6 due to atmospheric SO₂ and NOx.' },
    { loId: 'apenvsci.acid-rain', kind: 'definition', title: 'cap-and-trade', content: 'regulatory tool: total emissions capped, polluters trade permits.' },
    { loId: 'apenvsci.acid-rain', kind: 'definition', title: 'scrubber', content: 'pollution control device that removes SO₂ from power-plant exhaust.' },
  ],
  methods: [
    {
      title: 'Worked chemistry',
      steps: [
        `STEP 1 — Coal contains SULFUR. When burned, S → SO₂ (gas) released from smokestack.`,
        `STEP 2 — High temperatures of combustion also produce NOx (NO₂, NO from atmospheric N₂ + O₂).`,
        `STEP 3 — SO₂ and NOx rise on hot exhaust + are carried EASTWARD by prevailing westerly winds.`,
        'STEP 4 — In atmosphere, SO₂ + H₂O + O₂ → H₂SO₄ (sulfuric acid).',
        'STEP 5 — NOx + H₂O + O₂ → HNO₃ (nitric acid).',
        'STEP 6 — Acid droplets dissolve in clouds.',
        'STEP 7 — Days later: clouds release rain over Vermont. pH 4-5.',
        'STEP 8 — Acid enters lake; pH drops; fish populations decline.',
        `STEP 9 — Soils acidified; calcium and magnesium leached from forest floor; trees weakened.`,
        `STEP 10 — Vermont didn't emit the SO₂ but bears the consequences. CLASSIC TRANSBOUNDARY POLLUTION.`,
      ],
      example: { problem: `Trace the chemistry from a Midwestern coal-fired power plant to acid rain falling on a Vermont lake.`, solution: `Coal → SO₂/NOx → eastward transport → acid rain in Vermont (lake + forest damage).` },
      relatedLoIds: ['apenvsci.acid-rain'],
    },
  ],
  pointers: [
    { content: 'Acid rain: SO₂ → H₂SO₄, NOx → HNO₃. pH < 5.6.', kind: 'tip' },
    { content: 'Sources: coal-fired power plants (SO₂); cars (NOx).', kind: 'tip' },
    { content: 'Impacts: fish kills, forest decline, soil leaching, monument damage.', kind: 'tip' },
    { content: 'Solution: 1990 Clean Air Act + cap-and-trade reduced SO₂ ~70%.', kind: 'tip' },
    { content: 'Transboundary problem; US-Canada coordination.', kind: 'tip' },
  ],
};
