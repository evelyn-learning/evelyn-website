# AP Environmental Science — ProblemBank authoring spec

Scaffold for the item bank. Fill the empty `u1.json … u9.json` arrays with original
MCQ/numeric items, then seed. Recipe + status: memory `project_problem_bank_seeding`.
Mirrors the ap-macroeconomics / ap-statistics / ap-calculus-bc banks. (This `.md` is
ignored by the seeder — only `*.json` files are loaded.)

## SeedItem schema (each `uN.json` = a JSON **array** of these)
```json
{
  "id": "apenvsci.<lo-slug>.<mcq|numeric>.<NN>",  // stable, globally unique
  "loId": "apenvsci.<lo-slug>",                    // MUST match the LO tables below
  "cedCode": "AP-ENVSCI-<x.y>",                     // from the tables below
  "difficulty": 1,                                  // 1..4
  "responseFormat": "mcq",                          // "mcq" | "numeric"
  "problemText": "…",                               // ≥10 chars; NO $<digit> (see gotcha)
  "choices": ["…","…","…","…"],                     // mcq only: 3–5 options, no letter prefixes
  "answer": "C",                                    // mcq: LETTER A..E (index into choices); numeric: a number string
  "hints": ["…"]                                    // optional, 1–2 short hints
}
```

## Conventions
- **id**: `<loId>.mcq.01`, `<loId>.mcq.02`, `<loId>.numeric.01`, … zero-padded, unique course-wide.
- **Target ≈ 6 items/LO**, difficulty spread 1→4 (roughly 1,2,2,3,3,4).
- **Original content** modeled on the CED topic (license stamped `internal-original` at seed). No transcribed CB questions.
- **AP ES is math-light but computational in places** — include numeric items for: energy/power unit conversions & efficiency, the **10% rule** (energy transfer between trophic levels), **population growth** (growth rate, doubling time via rule of 70), **half-life** of pollutants/radioisotopes, **dilution / concentration** (ppm, mg/L), CO₂/greenhouse math, cost calculations. MCQ elsewhere.
- **Skip the `*-frq-practice` LOs.**
- Text-only (no diagrams): describe any data table inline in `problemText`.
- **KaTeX $-digit trap:** never write `$` directly before a digit. Use `\$50` or "50 dollars"; `$…$` only for real math.

## Validation (seeder is STRICT — one bad item aborts the run)
Per item: unique `id`; `loId`+`cedCode` present; `difficulty` ∈ 1..4; `problemText` ≥10 chars;
mcq → 3–5 `choices` and `answer` a letter within range; numeric → `answer` parses as a number.

## Seed commands
```
npm run seed:problem-bank -- --course=ap-environmental-science --dry-run
npm run seed:problem-bank -- --course=ap-environmental-science --file=u1.json
npm run seed:problem-bank -- --course=ap-environmental-science
```

---

## LO skeleton — author items for every content LO (36 total; skip FRQ)

### Unit 1 — The Living World: Ecosystems (5 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.ecosystems-biomes` | AP-ENVSCI-1.1-1.3 | Ecosystems and Biomes |
| `apenvsci.nitrogen-phosphorus-cycles` | AP-ENVSCI-1.5-1.6 | Nitrogen and Phosphorus Cycles |
| `apenvsci.carbon-water-cycles` | AP-ENVSCI-1.4+1.7 | Carbon and Water Cycles |
| `apenvsci.productivity-energy-flow` | AP-ENVSCI-1.8-1.10 | Productivity and Energy Flow (10% rule) |
| `apenvsci.food-webs` | AP-ENVSCI-1.11 | Food Chains and Webs |

### Unit 2 — The Living World: Biodiversity (3 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.biodiversity-island-biogeo` | AP-ENVSCI-2.1+2.3 | Biodiversity and Island Biogeography |
| `apenvsci.tolerance-adaptations` | AP-ENVSCI-2.4+2.6 | Tolerance and Adaptations |
| `apenvsci.disruptions-succession` | AP-ENVSCI-2.5+2.7 | Disruptions and Succession |

### Unit 3 — Populations (4 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.survivorship-r-k` | AP-ENVSCI-3.1-3.3 | Survivorship and Life History (r/K) |
| `apenvsci.carrying-capacity-growth` | AP-ENVSCI-3.4-3.5 | Carrying Capacity and Growth |
| `apenvsci.age-structure-fertility` | AP-ENVSCI-3.6-3.7 | Age Structure and Fertility |
| `apenvsci.demographic-transition` | AP-ENVSCI-3.8-3.9 | Demographic Transition |

### Unit 4 — Earth Systems and Resources (4 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.plate-tectonics-soil` | AP-ENVSCI-4.1-4.3 | Plate Tectonics and Soil |
| `apenvsci.atmosphere-wind` | AP-ENVSCI-4.4-4.5 | Atmosphere and Wind |
| `apenvsci.watersheds-solar` | AP-ENVSCI-4.6-4.7 | Watersheds and Solar Radiation |
| `apenvsci.climate-enso` | AP-ENVSCI-4.8-4.9 | Climate and ENSO |

### Unit 5 — Land and Water Use (4 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.agriculture` | AP-ENVSCI-5.3-5.7+5.14-5.16 | Agriculture and Food Production |
| `apenvsci.commons-fishing-footprint` | AP-ENVSCI-5.1+5.8+5.11+5.12 | Commons, Fishing, Footprint |
| `apenvsci.forestry-mining` | AP-ENVSCI-5.2+5.9+5.17 | Forestry and Mining |
| `apenvsci.urbanization-water` | AP-ENVSCI-5.10+5.13 | Urbanization and Stormwater |

### Unit 6 — Energy Resources and Consumption (4 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.energy-overview-fossil` | AP-ENVSCI-6.1-6.5 | Energy Overview and Fossil Fuels |
| `apenvsci.nuclear-biomass` | AP-ENVSCI-6.6-6.7 | Nuclear and Biomass |
| `apenvsci.renewables` | AP-ENVSCI-6.8-6.12 | Renewable Energy |
| `apenvsci.energy-conservation` | AP-ENVSCI-6.13 | Energy Conservation |

### Unit 7 — Atmospheric Pollution (4 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.air-pollution-sources` | AP-ENVSCI-7.1+7.4+7.5 | Air Pollution Sources |
| `apenvsci.smog-inversion` | AP-ENVSCI-7.2-7.3 | Smog and Inversion |
| `apenvsci.air-quality-mitigation` | AP-ENVSCI-7.6+7.8 | Air Quality Mitigation |
| `apenvsci.acid-rain` | AP-ENVSCI-7.7 | Acid Rain |

### Unit 8 — Aquatic and Terrestrial Pollution (4 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.water-pollution-sources` | AP-ENVSCI-8.1+8.2+8.4 | Water Pollution Sources |
| `apenvsci.toxics-pops-biomag` | AP-ENVSCI-8.3+8.7+8.8 | Toxics, POPs, Biomagnification |
| `apenvsci.eutrophication-thermal` | AP-ENVSCI-8.5-8.6 | Eutrophication and Thermal Pollution |
| `apenvsci.solid-waste` | AP-ENVSCI-8.9-8.10 | Solid Waste |

### Unit 9 — Global Change (4 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apenvsci.ozone` | AP-ENVSCI-9.1-9.2 | Stratospheric Ozone |
| `apenvsci.greenhouse-climate` | AP-ENVSCI-9.3-9.5 | Greenhouse Effect and Climate Change |
| `apenvsci.ocean-changes` | AP-ENVSCI-9.6-9.7 | Ocean Warming and Acidification |
| `apenvsci.biodiversity-threats` | AP-ENVSCI-9.8-9.10 | Biodiversity Threats (HIPPCO) |
