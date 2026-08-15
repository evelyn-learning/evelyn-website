/**
 * AP Environmental Science — Unit 5 CED 5.2+5.9+5.17: Forestry and Mining.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.forestry-mining.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_FORESTRY_MINING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.forestry-mining.v1',
  course: 'AP Environmental Science',
  cedUnit: 5,
  cedTopic: '5.2+5.9+5.17',
  cedTitle: 'Forestry and Mining',
  planId: 'evelyn.ap.envsci.forestry-mining.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.forestry-mining.v1' }],
  theory: [
    { loId: 'apenvsci.forestry-mining', kind: 'definition', title: 'clearcutting', content: `harvesting ALL trees in an area at once. PRO — efficient, cheap, and the site regenerates as a single even-aged stand. CON — massive soil erosion, sediment pollution of streams, habitat destruction, and carbon release. It is the cheapest method but the most ecologically damaging.` },
    { loId: 'apenvsci.forestry-mining', content: `FORESTRY METHODS beyond clearcutting. SELECTIVE CUTTING — harvest only specific trees, leaving most standing; preserves the canopy, reduces erosion, and maintains habitat, but costs more per board-foot. SHELTERWOOD CUTTING — a staged harvest that leaves shelter trees to protect seedlings, then removes them in a second cut. SEED-TREE CUTTING — most trees are taken but a few are left standing for natural reseeding.` },
    { loId: 'apenvsci.forestry-mining', content: `IMPACTS OF DEFORESTATION (especially clearcutting): CARBON RELEASE (lost storage plus decomposition), SOIL EROSION (no roots to hold soil), HABITAT LOSS and biodiversity decline, a DISRUPTED WATER CYCLE (transpiration falls, runoff rises), and loss of ECOSYSTEM SERVICES such as flood control and water purification.` },
    { loId: 'apenvsci.forestry-mining', content: `SUSTAINABLE FORESTRY practices: selective cutting paired with REPLANTING, third-party CERTIFICATION (FSC — Forest Stewardship Council), maintaining wildlife CORRIDORS, matching harvest rate to forest growth rate (never cut faster than regrowth), and PRESERVING OLD-GROWTH ecosystems that cannot be replaced on human timescales.` },
    { loId: 'apenvsci.forestry-mining', content: `SURFACE MINING (for shallow ore). STRIP MINING — rips off the surface in long strips (Appalachian coal). OPEN-PIT — huge excavated pits (copper at Bingham Canyon, Utah). MOUNTAINTOP REMOVAL — blasts off mountain peaks and dumps debris into adjacent valleys as VALLEY FILLS; catastrophically destructive. PLACER MINING — sluicing stream sediments for gold, which erodes and contaminates streams.` },
    { loId: 'apenvsci.forestry-mining', content: `SUBSURFACE MINING (for deeper ore). SHAFT MINING is vertical; DRIFT MINING drives horizontally into hillsides. It is more expensive but causes LESS surface destruction than surface methods — the trade is worker danger: cave-ins, black lung, and methane explosions.` },
    { loId: 'apenvsci.forestry-mining', kind: 'definition', title: 'acid mine drainage', content: `when exposed SULFIDE ores (e.g. pyrite, FeS2) contact water and oxygen they react to form SULFURIC ACID, dropping stream pH to about 2 to 4. The acid kills aquatic life and dissolves heavy metals from surrounding rock. It persists for CENTURIES and is the signature water pollutant of mining.` },
    { loId: 'apenvsci.forestry-mining', content: `MINING IMPACTS beyond acid drainage: SURFACE DESTRUCTION and slope failures, HEAVY-METAL CONTAMINATION (lead, arsenic, mercury) leaching from tailings, DUST and particulates, OVERBURDEN waste piles, and WATER POLLUTION from tailings ponds and leaking processing chemicals (cyanide used in gold extraction).` },
    { loId: 'apenvsci.forestry-mining', kind: 'definition', title: 'reclamation', content: `restoring mined or clearcut land to a stable, productive post-disturbance state. Required for coal under the US Surface Mining Control and Reclamation Act of 1977. Practices: regrade slopes, restore topsoil, replant native vegetation, and monitor water. REALITY — it rarely rebuilds the pre-disturbance ecosystem; partial recovery is the best outcome.` },
    { loId: 'apenvsci.forestry-mining', content: `MOUNTAINTOP-REMOVAL CASE (Appalachia): peaks blasted off with debris in valley fills that permanently alter watersheds; roughly 2,000 miles of streams buried; acid mine drainage downstream; community health harms (silica dust causing silicosis, contaminated well water); carbon emissions from burning the coal; and hardwood forest loss that takes decades to recover.` },
    { loId: 'apenvsci.forestry-mining', content: `TROPICAL DEFORESTATION drivers and fixes worth memorizing. DRIVERS: agricultural expansion (cattle, palm oil, soy) is the number-one cause, plus illegal logging, mining and infrastructure, fuelwood demand, and fire. INTERVENTIONS: demand-side certification (FSC), payments for forest carbon (REDD+), strong Indigenous property rights, satellite enforcement, protected areas, and reforestation.` },
    { loId: 'apenvsci.forestry-mining', content: `WHY OLD-GROWTH IS SPECIAL: mature forests store the most carbon, host the most biodiversity, and provide complex multi-story habitat. Once cleared they do NOT return on human timescales, so their protection is prioritized over that of young or replanted stands.` },
  ],
  methods: [
    {
      title: 'Enumerate the impacts of mountaintop-removal mining',
      when_to_use: `When asked to identify environmental and social impacts of a proposed surface-mining operation.`,
      steps: [
        `STEP 1 — TOPOGRAPHIC DESTRUCTION: peaks blasted off and debris dumped into adjacent valleys as valley fills, permanently altering watersheds.`,
        `STEP 2 — STREAM BURIAL: headwater streams buried under valley fills, destroying aquatic ecosystems.`,
        `STEP 3 — ACID MINE DRAINAGE: exposed sulfide ores form sulfuric acid that kills downstream fish and contaminates drinking water.`,
        `STEP 4 — HUMAN HEALTH: airborne silica dust (silicosis), contaminated well water, and elevated rates of cancer, birth defects, and chronic illness in local communities.`,
        `STEP 5 — CLIMATE plus FOREST LOSS: the extracted coal is burned (carbon emissions), and the temperate hardwoods are clear-cut first, taking decades to recover.`,
      ],
      example: { problem: `A company proposes mountaintop-removal mining for coal in Appalachia. Identify five environmental and social impacts.`, solution: `Topographic destruction with valley fills, stream burial, acid mine drainage, community health harms from dust and contaminated water, and climate emissions from the coal — with reclamation rarely restoring the native forest.` },
      relatedLoIds: ['apenvsci.forestry-mining'],
    },
    {
      title: 'Trace acid mine drainage chemistry and pick a remediation',
      when_to_use: `When asked how acid drainage forms and how to treat it.`,
      steps: [
        `STEP 1 — EXPOSURE: mining exposes pyrite (FeS2) to oxygen and water.`,
        `STEP 2 — REACTION: pyrite plus oxygen plus water yields sulfuric acid (H2SO4) plus iron compounds, dropping pH to about 2 to 4.`,
        `STEP 3 — METAL MOBILIZATION: the acidic water dissolves heavy metals (Fe, Al, Mn, Pb) from surrounding rock.`,
        `STEP 4 — STREAM IMPACT: acid plus heavy metals enter the stream and kill acid-sensitive fish such as trout; iron precipitates as orange "yellow boy" on the streambed.`,
        `STEP 5 — REMEDIATE: passive treatment with alkaline limestone or dolomite, constructed wetlands, active lime dosing with settling ponds, or prevention by sealing the mine and not disturbing sulfide-rich rock.`,
      ],
      example: { problem: `Acid mine drainage from an abandoned mine kills trout downstream. Trace the chemistry and suggest one remediation.`, solution: `Pyrite oxidizes to sulfuric acid, drops pH to 2 to 4, dissolves heavy metals, and kills trout; treat with limestone buffering or a constructed wetland.` },
      relatedLoIds: ['apenvsci.forestry-mining'],
    },
  ],
  pointers: [
    { content: 'Clearcut = cheap but erosion + habitat loss; selective = pricier but keeps canopy.', kind: 'tip' },
    { content: 'Surface mining: strip, open-pit, mountaintop removal, placer. Subsurface: shaft, drift.', kind: 'tip' },
    { content: 'Acid mine drainage: pyrite + O2 + water = sulfuric acid; persists for centuries.', kind: 'tip' },
    { content: 'Reclamation is legally required for coal but rarely restores the native ecosystem.', kind: 'tip' },
    { content: 'Old-growth forest is not replaceable on human timescales — prioritize its protection.', kind: 'tip' },
    { content: 'Tropical deforestation driver #1 is agricultural expansion (cattle, palm, soy).', kind: 'tip' },
  ],
};
