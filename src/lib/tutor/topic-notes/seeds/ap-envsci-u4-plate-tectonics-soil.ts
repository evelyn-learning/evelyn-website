/**
 * AP Environmental Science — Unit 4 CED 4.1-4.3: Plate Tectonics and Soil.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.plate-tectonics-soil.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_PLATE_TECTONICS_SOIL: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.plate-tectonics-soil.v1',
  course: 'AP Environmental Science',
  cedUnit: 4,
  cedTopic: '4.1-4.3',
  cedTitle: 'Plate Tectonics and Soil',
  planId: 'evelyn.ap.envsci.plate-tectonics-soil.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.plate-tectonics-soil.v1' }],
  theory: [
    { loId: 'apenvsci.plate-tectonics-soil', content: `PLATE TECTONICS: Earth's crust is broken into ~15 major plates that move on the molten asthenosphere.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: 'THREE BOUNDARY TYPES:' },
    { loId: 'apenvsci.plate-tectonics-soil', content: `  • DIVERGENT: plates move APART. Mid-ocean ridges (Atlantic), continental rifts (East African Rift). New crust forms; volcanism.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `  • CONVERGENT: plates COLLIDE. Three sub-types: 
     - Oceanic-continental: ocean plate subducts under continent → volcanic arc + earthquake + trench (e.g., Andes, Cascades). 
     - Oceanic-oceanic: one subducts → island arc (Japan, Philippines). 
     - Continental-continental: both buckle up → mountains (Himalayas).` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `  • TRANSFORM: plates SLIDE past each other. San Andreas Fault. Earthquakes; minimal vertical displacement.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `HOTSPOTS: stationary mantle plumes; plate moves over them creating chains (Hawaiian Islands, Yellowstone).` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `EARTHQUAKES: occur at plate boundaries (most common at convergent and transform). Magnitude on Richter scale.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `VOLCANOES: occur at boundaries (especially convergent, divergent) and hotspots. Release CO₂, SO₂, ash.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `SOIL FORMATION (CLORPT — Jenny's factors):` },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • CLIMATE — temperature + moisture; affects weathering rate.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • ORGANISMS — plants, animals, microbes contribute organic matter, mix soil.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • RELIEF (topography) — slope affects drainage and erosion.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • PARENT MATERIAL — underlying rock or sediment from which soil forms.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • TIME — soil deepens and matures over millennia.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: 'SOIL HORIZONS (top to bottom):' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • O (organic): leaf litter, organic debris.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • A (topsoil): mixed organic + mineral; biologically active; dark.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • E (eluviation, optional): leached, light-colored layer.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • B (subsoil): accumulation of leached materials (clay, iron).' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • C (parent material): weathered rock fragments.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • R (bedrock): unweathered rock.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: `SOIL TEXTURE: relative proportions of SAND (largest particles, fast drainage, low water/nutrient retention), SILT (medium), CLAY (smallest, holds water and nutrients, can become waterlogged).` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `  • LOAM: balanced ~40% sand, 40% silt, 20% clay. IDEAL for most agriculture — drains well, holds nutrients.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • Sandy soils: drain fast, low fertility.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: '  • Clay soils: hold water but compact, poor aeration.' },
    { loId: 'apenvsci.plate-tectonics-soil', content: `SOIL EROSION: loss of topsoil to wind/water. Major issue in agriculture; topsoil takes ~500 years to form 1 inch but can erode in years if mismanaged.` },
    { loId: 'apenvsci.plate-tectonics-soil', kind: 'definition', title: 'subduction', content: 'one plate sliding under another at convergent boundaries.' },
    { loId: 'apenvsci.plate-tectonics-soil', kind: 'definition', title: 'soil horizon', content: 'distinct layer of soil from surface (O) downward to bedrock (R).' },
    { loId: 'apenvsci.plate-tectonics-soil', kind: 'definition', title: 'loam', content: 'soil texture with balanced sand/silt/clay; ideal for agriculture.' },
  ],
  methods: [
    {
      title: 'Worked boundary',
      steps: [
        `(a) DIVERGENT — North American/Eurasian plates and South American/African plates pulling apart. New crust, volcanism (Iceland sits on it). Mid-ocean ridge.`,
        `(b) CONVERGENT (oceanic-continental) — Nazca plate subducts under South American plate. Andes mountains, volcanic arc, earthquakes.`,
        `(c) TRANSFORM — Pacific plate slides past North American plate. Earthquakes (Loma Prieta 1989, Northridge 1994). No volcanoes.`,
        `(d) CONVERGENT (continental-continental) — Indian plate colliding with Eurasian. Himalayas still rising ~5 mm/year. Earthquakes, no major volcanism.`,
      ],
      example: { problem: `For each location, identify the plate boundary type and predict the dominant landform/hazard: (a) Mid-Atlantic Ridge, (b) Western coast of South America (Andes), (c) San Andreas Fault, (d) Himalayas.`, solution: `(a) Divergent. (b) Convergent oceanic-continental. (c) Transform. (d) Convergent continental-continental.` },
      relatedLoIds: ['apenvsci.plate-tectonics-soil'],
    },
  ],
  pointers: [
    { content: `Three plate boundaries: divergent (apart), convergent (collide), transform (slide).`, kind: 'tip' },
    { content: 'CLORPT factors form soil; horizons O-A-B-C-R.', kind: 'tip' },
    { content: 'Loam (40-40-20 sand-silt-clay) ideal for agriculture.', kind: 'tip' },
    { content: 'Soil erosion: prevent with contour plowing, terraces, cover crops, no-till.', kind: 'tip' },
  ],
};
