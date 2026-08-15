/**
 * AP Environmental Science — Unit 2 CED 2.5+2.7: Disruptions and Succession.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.disruptions-succession.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.disruptions-succession.v1' }],
  theory: [
    { loId: 'apenvsci.disruptions-succession', content: `DISTURBANCE is an event that disrupts an ecosystem — removing biomass or altering resource availability. Disturbances LOOK destructive, but many ecosystems EVOLVED with regular disturbance, and recovery follows a predictable path called succession.` },
    { loId: 'apenvsci.disruptions-succession', content: `NATURAL DISTURBANCES: FIRE (removes overstory, releases nutrients; some seeds need heat to germinate; drought raises fire risk). FLOODS (deposit sediment, move nutrients, build wetland habitat). HURRICANES / TROPICAL STORMS (snap canopy trees, reset coastal systems). VOLCANIC ERUPTIONS (bury land in lava/ash, creating brand-new substrate with NO soil). EARTHQUAKES and LANDSLIDES (strip soil, expose new substrate). PEST OUTBREAKS and DISEASE (locally wipe out a dominant species).` },
    { loId: 'apenvsci.disruptions-succession', content: `HUMAN DISTURBANCES: deforestation, urbanization, mining, dam construction, and war. These often differ from natural disturbance in frequency and intensity, which can push ecosystems past their recovery capacity.` },
    { loId: 'apenvsci.disruptions-succession', content: `ECOLOGICAL SUCCESSION is the PREDICTABLE sequence of community changes after a disturbance. AP requires distinguishing PRIMARY from SECONDARY succession — the split hinges on ONE question: is SOIL already present?` },
    { loId: 'apenvsci.disruptions-succession', content: `PRIMARY SUCCESSION starts with NO SOIL — bare rock or new substrate (post-volcanic lava, retreated glacier, brand-new island). PIONEER SPECIES are LICHENS (their acids break down rock and create the first soil), then mosses, then small plants. It is SLOW — hundreds to thousands of years to reach climax.` },
    { loId: 'apenvsci.disruptions-succession', content: `SECONDARY SUCCESSION starts with SOIL ALREADY PRESENT (post-fire, abandoned farmland, post-flood). Pioneer species are fast-growing HERBS, WEEDS, and GRASSES. It is FASTER — decades to centuries to reach climax — because the soil and seed bank survive.` },
    { loId: 'apenvsci.disruptions-succession', content: `TYPICAL TERRESTRIAL SEQUENCE (e.g. an abandoned field): bare ground → annual weeds → perennial grasses → shrubs → fast-growing trees (pines, birch) → slower-growing climax forest (oak, maple, hickory). Early fast species are shaded out by the later climax trees.` },
    { loId: 'apenvsci.disruptions-succession', content: `CLIMAX COMMUNITY: a relatively stable, mature community roughly in equilibrium. It is REGION-SPECIFIC — the climax of the temperate eastern US (deciduous forest) is nothing like a desert climax; it is the idealized end-stage of succession. MODERN CAVEAT: "climax" oversimplifies — because disturbance recurs, many ecosystems are NEVER in true equilibrium, and the PATCH MOSAIC / disturbance-regime view holds that a landscape carries a MIX of successional stages at once.` },
    { loId: 'apenvsci.disruptions-succession', content: `r-SELECTED (pioneers): many small offspring, fast growth, short lives, high dispersal — weeds, insects, mice. They DOMINATE EARLY succession. K-SELECTED (late succession): few large offspring, slow growth, long lives — trees, large mammals. They DOMINATE CLIMAX communities.` },
    { loId: 'apenvsci.disruptions-succession', kind: 'definition', title: 'primary succession', content: `colonization of bare substrate with NO soil (post-volcanic, post-glacial); very slow; lichens are pioneers.` },
    { loId: 'apenvsci.disruptions-succession', kind: 'definition', title: 'secondary succession', content: `recovery on EXISTING soil (post-fire, abandoned farm); faster; weeds and grasses are pioneers.` },
    { loId: 'apenvsci.disruptions-succession', kind: 'definition', title: 'pioneer species', content: `the first colonizers after disturbance — lichens in primary succession, weeds/grasses in secondary.` },
  ],
  methods: [
    {
      title: 'Classify a disturbance as primary or secondary succession',
      when_to_use: `When a scenario describes a disturbance and asks which type of succession follows.`,
      steps: [
        `STEP 1 — Ask the ONE decisive question: after the event, is SOIL still present?`,
        `STEP 2 — If NO soil remains (bare rock, lava, fresh substrate) → PRIMARY succession; pioneers are lichens.`,
        `STEP 3 — If SOIL survives (roots, seed bank intact) → SECONDARY succession; pioneers are weeds/grasses.`,
        `STEP 4 — State the consequence: primary is very slow (centuries+); secondary is faster (decades to ~century).`,
      ],
      example: {
        problem: `Classify each: (a) Mount St. Helens (1980) buried the area in lava and ash. (b) A wildfire burns through Yellowstone forest (1988). (c) An abandoned Iowa cornfield.`,
        solution: `(a) PRIMARY — soil obliterated, starts on lava; pioneers are lichens. (b) SECONDARY — soil survives the fire; pioneers are grasses/weeds. (c) SECONDARY — tilled soil is intact; pioneers are annual weeds.`,
      },
      relatedLoIds: ['apenvsci.disruptions-succession'],
    },
    {
      title: 'Predict a terrestrial successional sequence over time',
      when_to_use: `When asked to forecast how a disturbed site (e.g. an abandoned farm) will change over decades.`,
      steps: [
        `STEP 1 — Fix the starting point: bare or recently tilled SOIL means secondary succession.`,
        `STEP 2 — Years 1 to 3: fast-growing ANNUAL WEEDS (ragweed, foxtail) colonize first — the r-selected pioneers.`,
        `STEP 3 — Years 3 to 15: perennial GRASSES, herbs, then SHRUBS (sumac, dogwood) take over.`,
        `STEP 4 — Years 15 to 50: FAST-GROWING TREES (pines, birch, aspen) form a young forest.`,
        `STEP 5 — Years 50 to 150+: SLOW-GROWING CLIMAX species (oak, hickory, maple) dominate; early pines are shaded out. End state = the region's climax community.`,
      ],
      example: {
        problem: `An abandoned Pennsylvania farm — predict the successional sequence over 100 years.`,
        solution: `Bare soil → annual weeds (years 1-3) → perennial grasses and shrubs (years 3-15) → fast-growing pines/birch (years 15-50) → oak-hickory-maple climax forest (years 50-150+). Climax = temperate deciduous forest for that region.`,
      },
      relatedLoIds: ['apenvsci.disruptions-succession'],
    },
  ],
  pointers: [
    { content: `Disturbance is NORMAL; some ecosystems (fire-adapted forests) actually require it.`, kind: 'tip' },
    { content: `Primary vs secondary hinges on ONE thing: is SOIL present? No soil = primary.`, kind: 'tip' },
    { content: `Primary pioneers = LICHENS (break down rock); secondary pioneers = weeds/grasses.`, kind: 'tip' },
    { content: `Primary is very slow (centuries+); secondary is faster because soil and seeds survive.`, kind: 'tip' },
    { content: `Succession runs r-selected pioneers → K-selected climax species over time.`, kind: 'tip' },
    { content: `Modern view: "climax" is idealized; real landscapes are a patch mosaic of stages.`, kind: 'tip' },
  ],
};
