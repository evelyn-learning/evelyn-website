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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.acid-rain.v1' }],
  theory: [
    { loId: 'apenvsci.acid-rain', content: `ACID RAIN: precipitation with pH BELOW the normal ~5.6 (normal rain is slightly acidic because dissolved CO₂ forms weak carbonic acid). In affected areas acid rain is typically pH 4-5, sometimes as low as pH 3. Falls as rain, snow, or fog.` },
    { loId: 'apenvsci.acid-rain', content: `THE TWO ACIDS (memorize the chemistry): SO₂ + H₂O + O₂ → H₂SO₄ (SULFURIC ACID), mostly from COAL-FIRED POWER PLANTS. NOx + H₂O + O₂ → HNO₃ (NITRIC ACID), from MOTOR VEHICLES and power plants. The acids dissolve in cloud droplets and fall as acidic precipitation.` },
    { loId: 'apenvsci.acid-rain', content: `TRANSBOUNDARY TRANSPORT: SO₂ and NOx rise on hot exhaust and travel HUNDREDS of miles on prevailing westerly winds before falling. Classic case: Midwestern coal plants → acid rain in the ADIRONDACKS (NY) and Appalachians. The region harmed did NOT emit the pollution — the core policy problem.` },
    { loId: 'apenvsci.acid-rain', content: `AQUATIC IMPACTS: low pH kills fish, hitting EGGS AND FRY hardest — most species cannot reproduce below about pH 5. Low pH also MOBILIZES TOXIC ALUMINUM from sediments, adding a second stress. Many Adirondack lakes became too acidic for fish in the 1980s.` },
    { loId: 'apenvsci.acid-rain', content: `FOREST AND SOIL IMPACTS: acid LEACHES calcium, magnesium, and potassium — essential nutrients — out of the soil, and MOBILIZES TOXIC ALUMINUM that damages roots. Trees suffer nutrient deficiency: leaves brown, growth stunts, and weakened trees succumb to cold and pests. Spruces and pines are particularly vulnerable.` },
    { loId: 'apenvsci.acid-rain', content: `STRUCTURES AND HEALTH: acid dissolves LIMESTONE and MARBLE (both calcium carbonate, CaCO₃), plus concrete and metals — Greek and Roman monuments and the Statue of Liberty show the damage. Human health: acidic particulates cause respiratory problems, especially asthma. Acidic water also dissolves LEAD and COPPER from pipes into drinking water.` },
    { loId: 'apenvsci.acid-rain', content: `pH IS LOGARITHMIC: the scale runs 0-14 with 7 neutral, and each unit is a factor of 10 in acidity. So pH 4 rain is 10 × 10 × 10 = 1000× more acidic than neutral pH 7. AP frequently tests this multiplication.` },
    { loId: 'apenvsci.acid-rain', content: `1990 CLEAN AIR ACT AMENDMENTS — CAP-AND-TRADE for SO₂: a national emissions CAP was set and tightened over time; power plants received tradable PERMITS. Plants with cheap fixes (scrubbers, low-sulfur coal) cut more and SOLD spare permits; plants facing expensive fixes BOUGHT permits. The market found the CHEAPEST total reduction.` },
    { loId: 'apenvsci.acid-rain', content: `RESULT: SO₂ emissions dropped more than 70% from 1990 to 2018, at far lower cost than predicted, and rain pH normalized in many regions — widely cited as the MOST SUCCESSFUL environmental regulation. It worked because SO₂ is easy to MONITOR, sources are identifiable, and market incentives beat one-size-fits-all mandates.` },
    { loId: 'apenvsci.acid-rain', content: `TECHNICAL CONTROLS: SCRUBBERS on power plants react SO₂ with calcium carbonate to form gypsum; LOW-SULFUR COAL; SWITCHING from coal to natural gas or renewables; CATALYTIC CONVERTERS on cars reduce NOx. International: acid rain crosses borders — the US-Canada Air Quality Agreement (1991) coordinates reductions; Europe acted via EU regulation.` },
    { loId: 'apenvsci.acid-rain', kind: 'definition', title: 'acid rain', content: `precipitation with pH below ~5.6 caused by atmospheric SO₂ and NOx forming sulfuric and nitric acids.` },
    { loId: 'apenvsci.acid-rain', kind: 'definition', title: 'cap-and-trade', content: `regulatory tool: total emissions capped and declining; polluters hold and trade permits, finding the cheapest reductions.` },
    { loId: 'apenvsci.acid-rain', kind: 'definition', title: 'scrubber', content: `pollution-control device that removes SO₂ from power-plant exhaust by reacting it with calcium carbonate to form gypsum.` },
  ],
  methods: [
    {
      title: 'Trace acid rain from source to impact',
      when_to_use: 'FRQ asking you to connect an emission source to downwind ecological damage.',
      steps: [
        `STEP 1 — SOURCE: name the emissions. Coal contains sulfur; burning releases SO₂. High combustion temperatures also force atmospheric N₂ + O₂ into NOx.`,
        `STEP 2 — TRANSPORT: gases rise on hot exhaust and ride prevailing WESTERLY winds hundreds of miles downwind.`,
        `STEP 3 — ATMOSPHERIC CHEMISTRY: SO₂ + H₂O + O₂ → H₂SO₄; NOx + H₂O + O₂ → HNO₃. The acids dissolve in cloud droplets.`,
        `STEP 4 — DEPOSITION: acid falls as rain/snow/fog, typically pH 4-5, over the downwind region.`,
        `STEP 5 — IMPACT: lake pH drops → fish eggs and fry die; soil loses calcium and magnesium and releases toxic aluminum → forests weaken.`,
        `STEP 6 — POLICY ANGLE: the receiving region did not emit the pollution — TRANSBOUNDARY pollution requires federal or international regulation (1990 CAA cap-and-trade, US-Canada agreement).`,
      ],
      example: {
        problem: `Trace the chemistry from a Midwestern coal-fired power plant to acid rain falling on a Vermont lake.`,
        solution: `Burning sulfur-containing coal releases SO₂; combustion heat also makes NOx. Westerlies carry both east. In the atmosphere SO₂ → H₂SO₄ and NOx → HNO₃; the acids dissolve in clouds and fall on Vermont at pH 4-5. Lake pH drops and fish decline; soils lose Ca/Mg and trees weaken. Vermont bears the cost of emissions it never produced — classic transboundary pollution.`,
      },
      relatedLoIds: ['apenvsci.acid-rain'],
    },
  ],
  pointers: [
    { content: 'Two acids, two sources: SO₂ → H₂SO₄ (coal plants); NOx → HNO₃ (vehicles).', kind: 'tip' },
    { content: 'Normal rain is already pH ~5.6 (CO₂ → carbonic acid). Acid rain is BELOW that.', kind: 'tip' },
    { content: 'pH is log base 10: pH 4 rain is 1000× more acidic than neutral pH 7.', kind: 'tip' },
    { content: 'Low pH mobilizes toxic ALUMINUM — the hidden second punch in lakes and soils.', kind: 'tip' },
    { content: 'Marble/limestone = CaCO₃; acid dissolves it — why monuments and gravestones crumble.', kind: 'tip' },
    { content: '1990 CAA cap-and-trade cut SO₂ >70% — the go-to FRQ example of market-based regulation.', kind: 'tip' },
  ],
};
