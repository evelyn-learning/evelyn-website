/**
 * AP Environmental Science — Unit 2 CED 2.5+2.7: Disruptions and Succession.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.disruptions-succession.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_DISRUPTIONS_SUCCESSION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.disruptions-succession.v1',
  course: 'AP Environmental Science',
  cedUnit: 2,
  cedTopic: '2.5+2.7',
  cedTitle: 'Disruptions and Succession',
  planId: 'evelyn.ap.envsci.disruptions-succession.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.disruptions-succession.v1' }],
  theory: [
    { loId: 'apenvsci.disruptions-succession', content: `DISTURBANCE: an event that disrupts an ecosystem, removes biomass, or alters availability of resources.` },
    { loId: 'apenvsci.disruptions-succession', content: 'NATURAL DISTURBANCES:' },
    { loId: 'apenvsci.disruptions-succession', content: `  • FIRE: removes overstory; releases nutrients; some species require fire to germinate (jack pine cones open in heat). DROUGHT increases fire risk.` },
    { loId: 'apenvsci.disruptions-succession', content: `  • FLOODS: deposit sediments; transport nutrients; create new habitat in wetlands.` },
    { loId: 'apenvsci.disruptions-succession', content: '  • HURRICANES / TROPICAL STORMS: snap canopy trees; reset coastal ecosystems.' },
    { loId: 'apenvsci.disruptions-succession', content: `  • VOLCANIC ERUPTIONS: bury everything in lava/ash; create entirely new substrate.` },
    { loId: 'apenvsci.disruptions-succession', content: '  • EARTHQUAKES, LANDSLIDES: remove soil; expose new substrate.' },
    { loId: 'apenvsci.disruptions-succession', content: '  • PEST OUTBREAKS, DISEASE: locally eliminate dominant species.' },
    { loId: 'apenvsci.disruptions-succession', content: 'HUMAN DISTURBANCES: deforestation, urbanization, mining, dam construction, war.' },
    { loId: 'apenvsci.disruptions-succession', content: `ECOLOGICAL SUCCESSION: predictable sequence of community changes after disturbance.` },
    { loId: 'apenvsci.disruptions-succession', content: `PRIMARY SUCCESSION: starts with NO SOIL — bare rock or new substrate (post-volcanic, retreated glacier, new island).` },
    { loId: 'apenvsci.disruptions-succession', content: `  • PIONEER SPECIES: lichens (acid breaks down rock, creates first soil), mosses, then small plants.` },
    { loId: 'apenvsci.disruptions-succession', content: '  • Slow process: hundreds to thousands of years to reach climax.' },
    { loId: 'apenvsci.disruptions-succession', content: `SECONDARY SUCCESSION: starts with SOIL ALREADY PRESENT (post-fire, abandoned farmland, post-flood).` },
    { loId: 'apenvsci.disruptions-succession', content: '  • Pioneer species: fast-growing herbs, weeds, grasses.' },
    { loId: 'apenvsci.disruptions-succession', content: '  • Faster: decades to centuries to reach climax.' },
    { loId: 'apenvsci.disruptions-succession', content: `TYPICAL TERRESTRIAL SUCCESSION SEQUENCE (e.g., abandoned field): 
  bare ground → annual weeds → perennial grasses → shrubs → fast-growing trees (pines, birch) → slower-growing climax forest (oak, maple, hickory).` },
    { loId: 'apenvsci.disruptions-succession', content: `CLIMAX COMMUNITY: relatively stable, mature community in equilibrium. Specific to the region (climax in temperate east US ≠ climax in desert).` },
    { loId: 'apenvsci.disruptions-succession', content: 'r-SELECTED vs K-SELECTED species:' },
    { loId: 'apenvsci.disruptions-succession', content: `  • r-SELECTED (pioneers): many small offspring, fast growth, short lives, high dispersal. Weeds, insects, mice. Dominate early succession.` },
    { loId: 'apenvsci.disruptions-succession', content: `  • K-SELECTED (late succession): few large offspring, slow growth, long-lived. Trees, large mammals. Dominate climax communities.` },
    { loId: 'apenvsci.disruptions-succession', content: `CONCEPT TENSION (modern view): "climax community" oversimplifies. Many ecosystems are NEVER in true equilibrium — disturbance is recurring. The PATCH MOSAIC or DISTURBANCE REGIME view says ecosystems have a mix of successional stages at any time.` },
    { loId: 'apenvsci.disruptions-succession', kind: 'definition', title: 'primary succession', content: 'colonization of bare substrate (no soil); slow.' },
    { loId: 'apenvsci.disruptions-succession', kind: 'definition', title: 'secondary succession', content: 'recovery on existing soil; fast.' },
    { loId: 'apenvsci.disruptions-succession', kind: 'definition', title: 'pioneer species', content: 'first colonizers — lichens (primary) or weeds/grasses (secondary).' },
    { loId: 'apenvsci.disruptions-succession', kind: 'definition', title: 'climax community', content: 'mature, stable end-stage of succession (idealized).' },
  ],
  methods: [
    {
      title: 'Worked classify',
      steps: [
        `STEP 1 — (a) Volcanic eruption obliterates soil → starts on lava → PRIMARY succession. Pioneer = lichens.`,
        `STEP 2 — (b) Fire kills above-ground vegetation but soil remains → SECONDARY succession. Pioneer = grasses/weeds.`,
        `STEP 3 — (c) Tilled soil is intact → SECONDARY succession. Pioneer = annual weeds (ragweed, foxtail).`,
      ],
      example: { problem: `For each scenario, identify whether it would lead to PRIMARY or SECONDARY succession: (a) Mount St. Helens eruption (1980) — lava and ash buried the area. (b) A wildfire burns through Yellowstone's forests (1988). (c) An abandoned cornfield in Iowa.`, solution: '(a) Primary. (b) Secondary. (c) Secondary.' },
      relatedLoIds: ['apenvsci.disruptions-succession'],
    },
  ],
  pointers: [
    { content: 'Disturbance is normal; some ecosystems require it (fire-adapted forests).', kind: 'tip' },
    { content: 'Primary: bare substrate; lichens; very slow.', kind: 'tip' },
    { content: 'Secondary: soil intact; weeds first; faster.', kind: 'tip' },
    { content: 'Pioneer (r-selected) → climax (K-selected) species over time.', kind: 'tip' },
  ],
};
