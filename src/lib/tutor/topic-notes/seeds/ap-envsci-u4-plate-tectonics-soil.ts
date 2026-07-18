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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.plate-tectonics-soil.v1' }],
  theory: [
    { loId: 'apenvsci.plate-tectonics-soil', content: `PLATE TECTONICS: Earth's crust is broken into roughly 15 major plates that ride on the molten ASTHENOSPHERE. Plate motion is slow (centimeters per year) but relentless — it builds mountains, opens oceans, and concentrates earthquakes and volcanoes along plate BOUNDARIES.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `DIVERGENT boundaries: plates move APART. New crust forms as magma rises to fill the gap; volcanism is common. Examples: MID-OCEAN RIDGES (Mid-Atlantic Ridge — Iceland sits on it) and CONTINENTAL RIFTS (East African Rift).` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `CONVERGENT boundaries: plates COLLIDE. Three sub-types — memorize all three: (a) OCEANIC-CONTINENTAL: the denser ocean plate SUBDUCTS under the continent → deep trench + volcanic arc + earthquakes (Andes, Cascades). (b) OCEANIC-OCEANIC: one plate subducts → ISLAND ARC (Japan, Philippines). (c) CONTINENTAL-CONTINENTAL: neither subducts easily; both buckle upward → high MOUNTAINS with earthquakes but no major volcanism (Himalayas).` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `TRANSFORM boundaries: plates SLIDE past each other horizontally. Frequent EARTHQUAKES, minimal vertical displacement, NO volcanoes. Classic example: the San Andreas Fault (Pacific plate sliding past North American plate).` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `HOTSPOTS: stationary mantle plumes NOT tied to a plate boundary. As the plate moves over a fixed hotspot, a CHAIN of volcanoes forms — the oldest islands sit farthest from the active plume. Examples: Hawaiian Islands, Yellowstone. EARTHQUAKES cluster at convergent and transform boundaries; VOLCANOES cluster at convergent and divergent boundaries plus hotspots, releasing CO2, SO2, and ash.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `SOIL FORMATION — the CLORPT factors (Jenny's five soil-forming factors): CLIMATE (temperature + moisture set the weathering rate), ORGANISMS (plants, animals, microbes add organic matter and mix the soil), RELIEF (slope controls drainage and erosion), PARENT MATERIAL (the underlying rock or sediment the soil forms from), and TIME (soil deepens and matures over MILLENNIA).` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `SOIL HORIZONS, top to bottom: O (ORGANIC — leaf litter and debris), A (TOPSOIL — mixed organic + mineral, biologically active, dark), E (ELUVIATION, optional — leached, light-colored), B (SUBSOIL — accumulation zone for leached clay and iron), C (PARENT MATERIAL — weathered rock fragments), R (BEDROCK — unweathered rock). Know the order O-A-E-B-C-R cold.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `SOIL TEXTURE = relative proportions of SAND (largest particles — fast drainage, LOW water and nutrient retention), SILT (medium), and CLAY (smallest — holds water and nutrients tightly, but compacts and can become WATERLOGGED with poor aeration). Sandy soils drain fast but are infertile; clay soils hold water but suffocate roots.` },
    { loId: 'apenvsci.plate-tectonics-soil', content: `SOIL EROSION: loss of topsoil to wind and water — a major agricultural problem because topsoil takes on the order of 500 YEARS to form one inch yet can erode in a few years of mismanagement. Countermeasures: CONTOUR PLOWING (rows act as small dams), TERRACING (reduces effective slope), COVER CROPS (roots hold soil, canopy blocks raindrop impact), NO-TILL farming (residue left on surface), and WINDBREAKS (tree rows perpendicular to prevailing wind).` },
    { loId: 'apenvsci.plate-tectonics-soil', kind: 'definition', title: 'subduction', content: `one plate sliding beneath another at a convergent boundary; the melting slab feeds volcanic arcs.` },
    { loId: 'apenvsci.plate-tectonics-soil', kind: 'definition', title: 'soil horizon', content: `a distinct soil layer, from the organic O horizon at the surface down to R (bedrock).` },
    { loId: 'apenvsci.plate-tectonics-soil', kind: 'definition', title: 'loam', content: `soil with a balanced texture — roughly 40% sand, 40% silt, 20% clay. IDEAL for agriculture: drains well AND holds nutrients.` },
  ],
  methods: [
    {
      title: 'Identify a plate boundary from a location',
      steps: [
        `STEP 1 — Ask: are the plates MOVING APART, COLLIDING, or SLIDING past each other? That single question picks divergent, convergent, or transform.`,
        `STEP 2 — If CONVERGENT, classify the sub-type by the crust involved: oceanic-continental (subduction → trench + volcanic arc), oceanic-oceanic (subduction → island arc), or continental-continental (no subduction → mountains, no major volcanism).`,
        `STEP 3 — Predict the LANDFORM: divergent → mid-ocean ridge or rift valley; convergent → trench, volcanic arc, or mountain range; transform → fault line with offset features.`,
        `STEP 4 — Predict the HAZARDS: earthquakes at convergent and transform; volcanoes at convergent and divergent (and hotspots); tsunamis when a subduction-zone quake displaces the seafloor.`,
        `STEP 5 — Sanity-check against known examples: Mid-Atlantic Ridge (divergent), Andes (oceanic-continental convergent), Japan (oceanic-oceanic convergent), Himalayas (continental-continental convergent), San Andreas (transform).`,
      ],
      example: {
        problem: `For each location, identify the plate boundary type and predict the dominant landform or hazard: (a) Mid-Atlantic Ridge, (b) western coast of South America (Andes), (c) San Andreas Fault, (d) Himalayas.`,
        solution: `(a) DIVERGENT — plates pulling apart; new crust and volcanism along a mid-ocean ridge. (b) CONVERGENT oceanic-continental — Nazca plate subducts under South America; volcanic arc + earthquakes. (c) TRANSFORM — Pacific slides past North American plate; earthquakes, no volcanoes. (d) CONVERGENT continental-continental — India colliding with Eurasia; mountains still rising, earthquakes, no major volcanism.`,
      },
      relatedLoIds: ['apenvsci.plate-tectonics-soil'],
    },
    {
      title: 'Analyze a soil for agricultural suitability',
      steps: [
        `STEP 1 — Determine TEXTURE from the sand/silt/clay proportions. Near 40-40-20 = loam (ideal). Sand-dominated = fast drainage, low fertility. Clay-dominated = high retention, poor aeration.`,
        `STEP 2 — Check the HORIZONS: a thick, dark A horizon signals abundant organic matter and biological activity — good fertility.`,
        `STEP 3 — Run the CLORPT factors for the site: warm + moist climate, abundant organisms, gentle relief, favorable parent material, and long formation time all point toward richer soil.`,
        `STEP 4 — Assess EROSION risk from slope and cover, then prescribe fixes: contour plowing, terracing, cover crops, no-till, windbreaks.`,
      ],
      relatedLoIds: ['apenvsci.plate-tectonics-soil'],
    },
  ],
  pointers: [
    { content: 'Three boundaries: DIVERGENT (apart), CONVERGENT (collide), TRANSFORM (slide). Transform = quakes, NO volcanoes.', kind: 'tip' },
    { content: 'Convergent has 3 sub-types — FRQs love oceanic-continental (subduction → trench + volcanic arc, e.g. Andes).', kind: 'tip' },
    { content: 'Hotspots are NOT boundaries: fixed plume + moving plate = island chain (Hawaii).', kind: 'tip' },
    { content: 'CLORPT = CLimate, Organisms, Relief, Parent material, Time — the five soil-forming factors.', kind: 'tip' },
    { content: 'Horizons top-down: O-A-E-B-C-R. A = topsoil, the biologically active layer worth protecting.', kind: 'tip' },
    { content: 'Loam ~40-40-20 sand-silt-clay is ideal; 1 inch of topsoil takes ~500 years to form.', kind: 'tip' },
  ],
};
