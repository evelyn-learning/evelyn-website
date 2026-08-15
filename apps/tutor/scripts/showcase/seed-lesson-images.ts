/**
 * Seed the LessonImage collection with curated educational images.
 *
 * Usage:
 *   npx tsx scripts/showcase/seed-lesson-images.ts
 *
 * Reads image entries from IMAGES array below, generates embeddings for
 * each description, and upserts into MongoDB.
 *
 * To add images:
 *   1. Add an entry to the IMAGES array with url, tags, description, etc.
 *   2. Run this script — it will skip images that already exist (by filename).
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env
import mongoose from 'mongoose';
import OpenAI from 'openai';

// ---------------------------------------------------------------------------
// MongoDB connection
// ---------------------------------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// OpenAI client (for embeddings)
// ---------------------------------------------------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY,
});

// ---------------------------------------------------------------------------
// LessonImage schema (inline to avoid Next.js import issues in scripts)
// ---------------------------------------------------------------------------
const LessonImageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true, trim: true },
    url: { type: String, required: true },
    tags: [{ type: String, index: true }],
    description: { type: String, required: true },
    subject: { type: String, required: true, enum: ['math', 'science', 'ela', 'general'] },
    gradeRange: [{ type: String }],
    standards: [{ type: String }],
    embedding: [{ type: Number }],
    source: { type: String, default: '' },
    license: { type: String, default: 'CC0' },
    altText: { type: String, default: '' },
  },
  { timestamps: true }
);

const LessonImage =
  mongoose.models.LessonImage ||
  mongoose.model('LessonImage', LessonImageSchema);

// ---------------------------------------------------------------------------
// IMAGE DATA — Add your curated images here
// ---------------------------------------------------------------------------
interface ImageEntry {
  filename: string;
  url: string;
  tags: string[];
  description: string;
  subject: 'math' | 'science' | 'ela' | 'general';
  gradeRange: string[];
  standards: string[];
  source: string;
  license: string;
  altText: string;
}

// Helper: construct Wikimedia thumb URL (renders SVG as PNG at given width)
function wikiThumb(hash: string, filename: string, width: number): string {
  const ext = filename.endsWith('.svg') ? '.png' : '';
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash}/${filename}/${width}px-${filename}${ext}`;
}

const IMAGES: ImageEntry[] = [
  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Water Cycle
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'water-cycle-diagram-01',
    url: wikiThumb('a/ae', 'Water_cycle.svg', 800),
    tags: ['water-cycle', 'evaporation', 'condensation', 'precipitation', 'rain-clouds', 'ocean-sun', 'water-vapor'],
    description: 'Labeled diagram showing the complete water cycle including evaporation from oceans, condensation forming clouds, precipitation as rain, and water collection in rivers and groundwater',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['2-ESS2', '5-ESS2'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Water cycle diagram showing evaporation, condensation, precipitation, and collection',
  },
  {
    filename: 'states-of-matter-transitions',
    url: wikiThumb('8/89', 'States_of_matter_En.svg', 734),
    tags: ['solid-liquid-gas', 'states-of-matter', 'ice-water-steam'],
    description: 'Labeled diagram showing solid, liquid, and gas states with particle models and real-world examples, including phase transition labels: melting, evaporation, condensation, freezing, sublimation, deposition',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['2-PS1', '5-PS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'States of matter diagram showing solid, liquid, and gas with transition processes',
  },
  {
    filename: 'solid-liquid-gas-particles',
    url: wikiThumb('1/13', 'Solid_liquid_gas.svg', 500),
    tags: ['solid-liquid-gas', 'states-of-matter', 'properties-of-matter'],
    description: 'Three-panel diagram showing the particle arrangement in solids (tightly packed), liquids (loosely arranged), and gases (spread apart), visual comparison of three states of matter',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['2-PS1', '5-PS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-2.5',
    altText: 'Particles in solid, liquid, and gas states compared side by side',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Solar System & Space
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'solar-system-planets-scale',
    url: wikiThumb('c/cb', 'Planets2013.svg', 1000),
    tags: ['solar-system', 'planets', 'sun'],
    description: 'All eight planets of the solar system shown with sizes proportional to each other: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune with labels',
    subject: 'science',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: ['1-ESS1', '5-ESS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Eight planets of the solar system shown to scale',
  },
  {
    filename: 'solar-system-size-comparison',
    url: wikiThumb('0/00', 'Solar_System_size_to_scale.svg', 1000),
    tags: ['solar-system', 'planets', 'sun'],
    description: 'Planets and dwarf planets of the solar system shown with sizes to scale, with labels for each body, excellent for elementary comparison activities',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['5-ESS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Solar system planets and dwarf planets with sizes to scale',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Plant Life
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'plant-parts-diagram',
    url: wikiThumb('9/98', 'Maize_plant_diagram.svg', 400),
    tags: ['plant-parts', 'roots-stem-leaves', 'flower-diagram'],
    description: 'Labeled diagram of a maize corn plant showing all major parts: roots, stem, leaves, tassel, ear, silk, and husk, ideal for teaching the parts of a plant',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['K-LS1', '1-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Labeled diagram of a corn plant showing roots, stem, leaves, and flower parts',
  },
  {
    filename: 'photosynthesis-overview',
    url: wikiThumb('0/0c', 'Simple_photosynthesis_overview.svg', 800),
    tags: ['photosynthesis', 'plant-parts', 'roots-stem-leaves'],
    description: 'Clean simple diagram showing photosynthesis: sunlight plus water plus carbon dioxide entering a leaf, producing oxygen and glucose, perfect for elementary-level understanding',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-LS1', '5-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Photosynthesis diagram showing sunlight, water, and CO2 producing oxygen and glucose',
  },
  {
    filename: 'flower-cross-section',
    url: wikiThumb('7/7f', 'Mature_flower_diagram.svg', 800),
    tags: ['flower-diagram', 'plant-parts'],
    description: 'Detailed cross-section of a mature flower showing petals, sepals, stamen with anther and filament, pistil with stigma style and ovary, and ovules',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-LS1', '4-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Cross-section of a flower showing petals, stamens, pistil, and ovary',
  },
  {
    filename: 'seed-germination-stages',
    url: wikiThumb('e/e5', 'Germination.svg', 800),
    tags: ['seed-germination', 'plant-life-cycle', 'garden-plants'],
    description: 'Illustration showing the stages of seed germination from dormant seed through root emergence, stem growth, and seedling development with leaves',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['K-LS1', '1-LS1', '2-LS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Stages of seed germination from seed to seedling',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Life Cycles
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'butterfly-life-cycle',
    url: wikiThumb('7/78', 'Butterfly_life_cycle_diagram_in_English.svg', 700),
    tags: ['butterfly-life-cycle', 'caterpillar', 'metamorphosis'],
    description: 'Colorful diagram showing all four stages of the butterfly life cycle: egg, larva caterpillar, pupa chrysalis, and adult butterfly arranged in a circular cycle with arrows',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['1-LS1', '3-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Butterfly life cycle: egg, caterpillar, chrysalis, adult butterfly',
  },
  {
    filename: 'frog-life-stages',
    url: wikiThumb('0/09', 'Greenfrog_life_stages.svg', 800),
    tags: ['frog-life-cycle', 'tadpole', 'metamorphosis'],
    description: 'Diagram showing the life stages of a green frog from eggs through tadpole stages, developing legs, to adult frog, showing metamorphosis process',
    subject: 'science',
    gradeRange: ['1', '2', '3'],
    standards: ['1-LS1', '3-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Frog life cycle from eggs to tadpole to adult frog',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Food Chains & Ecosystems
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'food-chain-diagram',
    url: wikiThumb('7/71', 'FoodChain.svg', 800),
    tags: ['food-chain', 'animal-habitats', 'animal-groups'],
    description: 'Simple clear illustration of a basic food chain showing the flow of energy from sun to producers to primary consumers to secondary consumers, ideal for elementary students',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['2-LS2', '3-LS2', '5-LS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Food chain diagram showing energy flow from producers to consumers',
  },
  {
    filename: 'ecological-pyramid',
    url: wikiThumb('8/86', 'Ecological_pyramid.svg', 800),
    tags: ['food-chain', 'food-web', 'forest-ecosystem'],
    description: 'Energy pyramid diagram showing trophic levels: producers at the base, primary consumers, secondary consumers, and tertiary consumers at the top, shows how energy decreases at each level',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-LS2', '5-LS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Ecological pyramid showing energy decreasing at higher trophic levels',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Earth, Rocks, Volcanoes
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'volcano-cross-section',
    url: wikiThumb('b/be', 'Stratovolcano_cross-section.svg', 800),
    tags: ['volcano', 'rock-types', 'mountain'],
    description: 'Detailed labeled cross-section of a stratovolcano showing the magma chamber, conduit, crater, lava flow, ash cloud, pyroclastic flow, and internal rock layers',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-ESS1', '4-ESS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Cross-section of a volcano showing magma chamber, lava, and ash cloud',
  },
  {
    filename: 'earth-internal-structure',
    url: wikiThumb('d/db', 'Earth_Internal_Structure.svg', 800),
    tags: ['rock-types', 'soil-layers', 'mountain'],
    description: 'Cross-section diagram of Earth showing the crust, mantle, outer core, and inner core with labeled layers and approximate depths, great for teaching about Earth structure',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-ESS1', '4-ESS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-3.0',
    altText: 'Earth cross-section showing crust, mantle, outer core, and inner core',
  },
  {
    filename: 'rock-cycle-diagram',
    url: wikiThumb('c/cb', 'Rock_cycle.svg', 800),
    tags: ['rock-types', 'erosion', 'weathering'],
    description: 'Diagram of the rock cycle showing the relationships between igneous, sedimentary, and metamorphic rocks with arrows indicating weathering, erosion, melting, cooling, and metamorphism processes',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-ESS1', '4-ESS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Rock cycle showing igneous, sedimentary, and metamorphic rock transitions',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Weather
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'cloud-types-diagram',
    url: wikiThumb('5/57', 'Cloud_types_en.svg', 800),
    tags: ['weather-cloudy', 'weather-rainy', 'rain-clouds'],
    description: 'Comprehensive diagram showing all major cloud types: cirrus, cumulus, stratus, cumulonimbus, arranged by altitude with labels and altitude markers, excellent classroom reference',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['K-ESS2', '3-ESS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Cloud types diagram showing cirrus, cumulus, stratus, and other clouds at different altitudes',
  },
  {
    filename: 'tornado-formation-diagram',
    url: wikiThumb('4/43', 'Tornado_Alley_Diagram.svg', 800),
    tags: ['tornado', 'weather-windy', 'weather-map'],
    description: 'Diagram showing how tornadoes form in Tornado Alley, illustrating the collision of warm moist air from the Gulf of Mexico and cold dry air from Canada creating severe weather',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-ESS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Tornado Alley diagram showing warm and cold air masses colliding',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Forces & Simple Machines
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'six-simple-machines',
    url: wikiThumb('f/f9', 'Six_simple_machines.png', 800),
    tags: ['simple-machines', 'lever', 'wheel-axle', 'pulley', 'ramp-incline'],
    description: 'Illustration showing all six types of simple machines: lever, wheel and axle, pulley, inclined plane, wedge, and screw, each clearly labeled',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['K-PS2', '3-PS2', '5-PS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Six simple machines: lever, wheel and axle, pulley, inclined plane, wedge, screw',
  },
  {
    filename: 'lever-first-class',
    url: wikiThumb('0/03', 'LeverFirstClass.svg', 600),
    tags: ['lever', 'simple-machines', 'push-pull'],
    description: 'Clear diagram of a first-class lever showing the fulcrum between the effort and load with arrows indicating force directions, ideal for teaching lever types',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-PS2', '5-PS2'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'First-class lever diagram with fulcrum, effort, and load labeled',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Human Body
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'human-skeleton-labeled',
    url: wikiThumb('c/ca', 'Human_skeleton_front_en.svg', 500),
    tags: ['skeleton', 'muscles'],
    description: 'Full front-view labeled diagram of the human skeleton with all major bones identified: skull, clavicle, sternum, ribs, humerus, radius, ulna, pelvis, femur, tibia, fibula',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Labeled diagram of the human skeleton showing all major bones',
  },
  {
    filename: 'digestive-system-diagram',
    url: wikiThumb('c/c5', 'Digestive_system_diagram_en.svg', 500),
    tags: ['digestive-system', 'heart', 'lungs'],
    description: 'Labeled diagram of the human digestive system showing the mouth, esophagus, stomach, liver, gallbladder, pancreas, small intestine, large intestine, and rectum',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-LS1'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Human digestive system diagram with labeled organs',
  },
  {
    filename: 'human-eye-diagram',
    url: wikiThumb('1/1e', 'Schematic_diagram_of_the_human_eye_en.svg', 800),
    tags: ['five-senses', 'brain'],
    description: 'Cross-section of the human eye with labeled parts including cornea, iris, lens, retina, optic nerve, vitreous humour, useful for teaching the sense of sight',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['1-LS1', '4-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Cross-section diagram of the human eye with labeled parts',
  },
  {
    filename: 'ear-anatomy-diagram',
    url: wikiThumb('4/40', 'Ear-anatomy-text-small-en.svg', 500),
    tags: ['five-senses', 'brain'],
    description: 'Labeled cross-section of the human ear showing the outer ear, ear canal, eardrum, middle ear bones hammer anvil stirrup, cochlea, and auditory nerve, useful for teaching the sense of hearing',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['1-LS1', '4-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Human ear anatomy diagram with outer, middle, and inner ear labeled',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Fractions
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'cake-fractions',
    url: wikiThumb('4/4f', 'Cake_fractions.svg', 800),
    tags: ['fractions', 'equal-parts', 'pie-chart'],
    description: 'Colorful cake diagrams showing different fractions: whole, halves, thirds, quarters, fifths, sixths, with each piece a different color to show equal parts of a whole',
    subject: 'math',
    gradeRange: ['1', '2', '3', '4'],
    standards: ['1.G', '2.G', '3.NF'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Cake diagrams showing fractions from whole to sixths',
  },
  {
    filename: 'three-fourths-fraction',
    url: wikiThumb('f/f6', '3_4_fraction.svg', 400),
    tags: ['fractions', 'fraction-circles', 'equal-parts'],
    description: 'Circle diagram showing three-fourths shaded, representing the fraction 3/4 with clear visual of equal parts',
    subject: 'math',
    gradeRange: ['2', '3', '4'],
    standards: ['3.NF', '4.NF'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Circle showing three-fourths shaded as a fraction',
  },
  {
    filename: 'four-quarters-circle',
    url: wikiThumb('f/ff', 'Four_quarters_circle.svg', 400),
    tags: ['fractions', 'fraction-circles', 'equal-parts', 'pie-chart'],
    description: 'Circle divided into four equal quarters with different colors showing how four quarters make one whole, foundational fraction concept',
    subject: 'math',
    gradeRange: ['1', '2', '3'],
    standards: ['1.G', '2.G', '3.NF'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Circle divided into four equal quarters with different colors',
  },
  {
    filename: 'fraction-bars-complete',
    url: wikiThumb('c/cb', 'Bennett_fraction_bars_complete_deck.svg', 800),
    tags: ['fractions', 'fraction-bars', 'equal-parts'],
    description: 'Complete set of Bennett fraction bars showing whole, halves, thirds, fourths, fifths, sixths, eighths, tenths, and twelfths, color-coded for visual comparison',
    subject: 'math',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['3.NF', '4.NF', '5.NF'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Fraction bars from whole to twelfths arranged for visual comparison',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Number Lines
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'integer-number-line',
    url: wikiThumb('8/83', 'Integers-line.svg', 800),
    tags: ['number-line', 'numbers', 'counting'],
    description: 'Number line showing integers with evenly spaced tick marks and numbers, from negative to positive, used for teaching number concepts and operations',
    subject: 'math',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: ['1.NBT', '2.NBT', '3.NF'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Integer number line with evenly spaced numbers',
  },
  {
    filename: 'number-line-integers-labeled',
    url: wikiThumb('a/ae', 'NumberLineIntegers.svg', 800),
    tags: ['number-line', 'numbers', 'counting-objects'],
    description: 'Clean number line showing labeled integers with clear tick marks, useful for teaching addition, subtraction, and number relationships',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['K.CC', '1.OA', '2.OA'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Number line with labeled integers',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Geometry / Shapes
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'equilateral-triangle',
    url: wikiThumb('b/b6', 'Basic_equilateral_triangle.svg', 400),
    tags: ['triangle', 'shapes-2d'],
    description: 'Basic equilateral triangle shape, clean geometric illustration with three equal sides',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3', '4'],
    standards: ['K.G', '1.G', '2.G', '3.G', '4.G'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Equilateral triangle with three equal sides',
  },
  {
    filename: 'pentagon-shape',
    url: wikiThumb('0/04', 'Pentagon.svg', 400),
    tags: ['shapes-2d'],
    description: 'Regular pentagon with five equal sides, clean geometric shape illustration',
    subject: 'math',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['2.G', '3.G'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Regular pentagon with five equal sides',
  },
  {
    filename: 'hexagon-shape',
    url: wikiThumb('9/99', 'Hexagon.svg', 400),
    tags: ['shapes-2d'],
    description: 'Regular hexagon with six equal sides, clean geometric shape illustration',
    subject: 'math',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['2.G', '3.G'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Regular hexagon with six equal sides',
  },
  {
    filename: 'circle-shape',
    url: wikiThumb('a/a0', 'Circle_-_black_simple.svg', 400),
    tags: ['circle', 'shapes-2d'],
    description: 'Simple black circle shape, clean geometric illustration for teaching circles',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['K.G', '1.G'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Simple black circle',
  },
  {
    filename: 'square-shape',
    url: wikiThumb('d/dd', 'Square_-_black_simple.svg', 400),
    tags: ['square', 'rectangle', 'shapes-2d'],
    description: 'Simple black square shape with four equal sides and right angles, clean geometric illustration',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3', '4'],
    standards: ['K.G', '1.G', '2.G', '3.G'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Simple black square',
  },
  {
    filename: '3d-shapes-isometric',
    url: wikiThumb('6/67', '3D_shapes_in_isometric_projection.svg', 600),
    tags: ['shapes-3d', 'cube', 'sphere', 'cylinder'],
    description: 'Collection of 3D geometric shapes shown in isometric projection including cube, rectangular prism, sphere, cylinder, cone, and pyramid with clear outlines',
    subject: 'math',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: ['1.G', '2.G', '3.G'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: '3D shapes: cube, rectangular prism, sphere, cylinder, cone, pyramid',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Measurement
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'ruler-measurement',
    url: wikiThumb('f/fb', 'Ruler.svg', 800),
    tags: ['ruler', 'measuring-tape'],
    description: 'Detailed ruler illustration with centimeter and millimeter markings, used for teaching measurement concepts and units of length',
    subject: 'math',
    gradeRange: ['1', '2', '3', '4'],
    standards: ['1.MD', '2.MD', '3.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Ruler with centimeter and millimeter markings',
  },
  {
    filename: 'thermometer-cf',
    url: wikiThumb('7/70', 'Thermometer_CF.svg', 300),
    tags: ['thermometer', 'thermometer-weather'],
    description: 'Thermometer showing both Celsius and Fahrenheit scales side by side with clear markings for temperature reading',
    subject: 'math',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['2.MD', '3.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Thermometer with Celsius and Fahrenheit scales',
  },
  {
    filename: 'balance-scale',
    url: wikiThumb('f/f0', 'Balance_scale.svg', 400),
    tags: ['scale-balance', 'measuring-cup'],
    description: 'Simple balance scale illustration showing two pans for weighing and comparing objects, used for teaching weight and measurement concepts',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['K.MD', '1.MD', '2.MD', '3.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Balance scale with two pans for comparing weights',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Money
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'us-penny',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/US_One_Cent_Obv.png',
    tags: ['coins-penny', 'money-counting'],
    description: 'US one cent coin penny showing the obverse face with Abraham Lincoln, used for teaching money identification and counting',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['2.MD'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'US penny showing Abraham Lincoln on the front',
  },
  {
    filename: 'us-nickel',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Jefferson-Nickel-Unc-Obv.jpg',
    tags: ['coins-nickel', 'money-counting'],
    description: 'US five cent coin nickel showing the obverse face with Thomas Jefferson, used for teaching money identification and counting by fives',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['2.MD'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'US nickel showing Thomas Jefferson on the front',
  },
  {
    filename: 'us-dime',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Dime_Obverse_13.png',
    tags: ['coins-dime', 'money-counting'],
    description: 'US ten cent coin dime showing the obverse face with Franklin Roosevelt, used for teaching money identification and counting by tens',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['2.MD'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'US dime showing Franklin Roosevelt on the front',
  },
  {
    filename: 'us-quarter',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/2014_ATB_Quarter_Obv.png',
    tags: ['coins-quarter', 'money-counting'],
    description: 'US twenty-five cent coin quarter showing the obverse face with George Washington, used for teaching money identification and counting by twenty-fives',
    subject: 'math',
    gradeRange: ['1', '2', '3'],
    standards: ['2.MD'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'US quarter showing George Washington on the front',
  },
  {
    filename: 'us-dollar-bill',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/United_States_one_dollar_bill%2C_obverse.jpg',
    tags: ['dollar-bill', 'money-counting'],
    description: 'US one dollar bill showing the obverse face with George Washington, used for teaching paper money and dollar amounts',
    subject: 'math',
    gradeRange: ['1', '2', '3'],
    standards: ['2.MD'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'US one dollar bill front showing George Washington',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Data & Graphing
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'bar-graph-simple',
    url: wikiThumb('b/bd', 'Bar_graph.svg', 600),
    tags: ['bar-graph', 'data-table'],
    description: 'Simple bar graph with colored bars of different heights showing data comparison, used for teaching data representation and graph reading',
    subject: 'math',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: ['1.MD', '2.MD', '3.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Simple bar graph showing data comparison with colored bars',
  },
  {
    filename: 'pie-chart',
    url: wikiThumb('3/39', 'Piechart.svg', 400),
    tags: ['pie-chart', 'fractions', 'data-table'],
    description: 'Colorful pie chart divided into sections showing proportional data, useful for teaching fractions, percentages, and data visualization',
    subject: 'math',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['3.NF', '3.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Pie chart divided into colored sections showing proportional data',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Place Value & Counting
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'hundreds-chart',
    url: wikiThumb('a/a3', 'CountingSquareOrangeOneHundred.svg', 400),
    tags: ['number-chart', 'counting', 'ones-tens-hundreds'],
    description: 'Orange hundred chart grid showing numbers 1 to 100 arranged in rows of 10, used for teaching place value, counting patterns, and skip counting',
    subject: 'math',
    gradeRange: ['K', '1', '2'],
    standards: ['K.CC', '1.NBT', '2.NBT'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Hundred chart showing numbers 1 to 100 in a 10x10 grid',
  },
  {
    filename: 'tally-marks',
    url: wikiThumb('4/44', 'Strichliste10.svg', 300),
    tags: ['tally-marks', 'tally-chart', 'counting-objects'],
    description: 'Tally marks showing groups of five with the fifth mark crossing diagonally, used for teaching counting and data collection',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['K.CC', '1.MD', '2.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Tally marks in groups of five',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Time / Clocks
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'analog-clock-face',
    url: wikiThumb('0/02', 'Analogue_clock_face.svg', 400),
    tags: ['analog-clock', 'clock-hands'],
    description: 'Clear analog clock face with hour and minute markings, numbers 1 through 12 arranged in a circle, used for teaching time-telling concepts',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['1.MD', '2.MD', '3.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Analog clock face with numbers 1 through 12',
  },
  {
    filename: 'clock-three-oclock',
    url: wikiThumb('d/d9', 'Clock_03-00.svg', 300),
    tags: ['analog-clock', 'clock-hands'],
    description: 'Analog clock showing 3:00 with hour hand pointing at 3 and minute hand pointing at 12, for teaching time on the hour',
    subject: 'math',
    gradeRange: ['K', '1', '2'],
    standards: ['1.MD', '2.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Clock showing 3 o\'clock',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Classroom & School
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'classroom-photo',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Classroom.jpg',
    tags: ['classroom-desks', 'whiteboard', 'teacher-students'],
    description: 'Elementary school classroom with desks arranged in rows, whiteboard at front, and educational posters on walls',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Elementary school classroom with desks and whiteboard',
  },
  {
    filename: 'school-bus-icon',
    url: wikiThumb('6/69', 'Big_School_Bus_Icon.svg', 600),
    tags: ['bus-school'],
    description: 'Yellow school bus icon, classic American school bus for transporting students to school',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Yellow school bus icon',
  },
  {
    filename: 'backpack-icon',
    url: wikiThumb('c/cf', 'Backpack.svg', 400),
    tags: ['backpack', 'school-supplies'],
    description: 'Colorful backpack for school, used for carrying books and school supplies',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-4.0',
    altText: 'School backpack',
  },
  {
    filename: 'crayons-box',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Crayola_24pack_2005.jpg',
    tags: ['crayons-drawing', 'school-supplies'],
    description: 'Box of 24 colorful Crayola crayons, standard school art supplies for drawing and coloring',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Box of 24 Crayola crayons',
  },
  {
    filename: 'pencil-icon',
    url: wikiThumb('6/68', 'Pencil.svg', 400),
    tags: ['school-supplies', 'pencil-writing', 'writing-paper'],
    description: 'Simple pencil illustration, standard writing tool used in classrooms for writing and drawing',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-2.5',
    altText: 'Pencil illustration',
  },
  {
    filename: 'playground-photo',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Playground.jpg',
    tags: ['playground'],
    description: 'School playground with play equipment including slides and climbing structures for children recess and outdoor activities',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'School playground with slides and climbing equipment',
  },
  {
    filename: 'children-reading-library',
    url: wikiThumb('3/3b', "Children%27s_Reading_Corner_1_at_Busesa_Community_Library%2C_Busesa%2C_Bugweri_District.jpg", 800),
    tags: ['library', 'book-reading', 'diverse-children'],
    description: 'Diverse group of children sitting together in a library reading corner, engaged in reading books at a community library',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Children reading books together in a library',
  },

  // ═══════════════════════════════════════════════════════════════
  // ELA — Reading, Writing, Alphabet
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'open-book-icon',
    url: wikiThumb('9/92', 'Open_book_nae_02.svg', 600),
    tags: ['book-reading', 'story-map', 'library'],
    description: 'Open book illustration showing pages spread open, used for reading and literacy instruction',
    subject: 'ela',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['RL.K', 'RL.1', 'RL.2', 'RL.3', 'RL.4', 'RL.5'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Open book with pages spread',
  },
  {
    filename: 'alphabet-abc',
    url: wikiThumb('9/90', 'ABC.svg', 600),
    tags: ['alphabet-letters', 'letter-sounds', 'abc-blocks'],
    description: 'Colorful ABC letters representing the alphabet, used for teaching letter recognition and phonics to young learners',
    subject: 'ela',
    gradeRange: ['K', '1'],
    standards: ['RF.K', 'RF.1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Colorful ABC alphabet letters',
  },
  {
    filename: 'letter-a-uppercase-lowercase',
    url: wikiThumb('e/e4', 'Latin_alphabet_Aa.svg', 400),
    tags: ['alphabet-letters', 'letter-tracing', 'letter-sounds'],
    description: 'The letter A shown in both uppercase and lowercase forms, used for teaching letter recognition and writing',
    subject: 'ela',
    gradeRange: ['K', '1'],
    standards: ['RF.K', 'RF.1'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Letter A in uppercase and lowercase',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Food & Nutrition
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'myplate-food-groups',
    url: wikiThumb('a/ad', 'USDA_MyPlate_green.svg', 600),
    tags: ['food-groups', 'food-pyramid', 'healthy-plate', 'fruits-vegetables'],
    description: 'USDA MyPlate diagram showing the five food groups: fruits, vegetables, grains, protein, and dairy, arranged on a plate for healthy eating education',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons / USDA',
    license: 'Public Domain',
    altText: 'USDA MyPlate showing fruits, vegetables, grains, protein, and dairy',
  },
  {
    filename: 'fruits-and-vegetables',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Fruits_and_vegetables.jpg',
    tags: ['fruits-vegetables', 'food-groups', 'healthy-plate'],
    description: 'Colorful assortment of fresh fruits and vegetables including peppers, tomatoes, oranges, bananas, and leafy greens, representing healthy food choices',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Colorful assortment of fresh fruits and vegetables',
  },
  {
    filename: 'pizza-margherita',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
    tags: ['pizza', 'pizza-fractions', 'food-groups'],
    description: 'Whole pizza margherita with tomato sauce and melted cheese, round pizza that can be used for teaching fractions by cutting into equal slices',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Whole round pizza margherita',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Maps & Geography
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'world-map-blank',
    url: wikiThumb('e/ec', 'World_map_blank_without_borders.svg', 1000),
    tags: ['world-map', 'continent', 'ocean-map'],
    description: 'Blank world map showing all continents and oceans without country borders, useful for teaching geography and identifying continents',
    subject: 'general',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Blank world map showing continents',
  },
  {
    filename: 'us-map-blank',
    url: wikiThumb('1/1a', 'Blank_US_Map_%28states_only%29.svg', 1000),
    tags: ['us-map', 'map-key'],
    description: 'Blank map of the United States showing all 50 state boundaries without labels, useful for teaching US geography and state identification',
    subject: 'general',
    gradeRange: ['2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Blank United States map showing state boundaries',
  },
  {
    filename: 'globe-earth',
    url: wikiThumb('b/b1', 'Globe_Atlantic.svg', 600),
    tags: ['globe', 'world-map', 'continent'],
    description: 'Globe showing the Atlantic Ocean with North America, South America, Europe, and Africa visible, for teaching about Earth as a sphere and world geography',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Globe showing Atlantic Ocean and surrounding continents',
  },
  {
    filename: 'compass-rose',
    url: wikiThumb('9/99', 'Compass_rose_simple.svg', 400),
    tags: ['compass-rose', 'map-key'],
    description: 'Simple compass rose showing the four cardinal directions: North, South, East, and West, used for teaching map reading and navigation',
    subject: 'general',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Compass rose showing North, South, East, West',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Seasons & Nature
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'spring-flowers',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Spring_flowers.jpg',
    tags: ['spring-flowers', 'garden-plants'],
    description: 'Colorful spring flowers blooming in a garden, representing the spring season with fresh blossoms and new growth',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-2.0',
    altText: 'Colorful spring flowers in bloom',
  },
  {
    filename: 'sunflower',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg',
    tags: ['sunflower', 'garden-plants', 'spring-flowers'],
    description: 'Bright yellow sunflower in full bloom with large petals radiating from a dark center, representing summer and plant life',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Bright yellow sunflower in full bloom',
  },
  {
    filename: 'fall-leaf-red-oak',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Autumn_Red_Oak_Leaf.jpg',
    tags: ['fall-leaves', 'seasonal-tree'],
    description: 'Red oak leaf in autumn colors showing vibrant red and orange, representing the fall season and changing leaves',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Red autumn oak leaf',
  },
  {
    filename: 'winter-snow-landscape',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Winter_landscape.jpg',
    tags: ['winter-snow', 'seasonal-tree'],
    description: 'Winter landscape covered in white snow with trees and hills, representing the winter season and cold weather',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Snowy winter landscape with trees',
  },
  {
    filename: 'snowflake',
    url: wikiThumb('5/58', 'Snowflake.svg', 400),
    tags: ['winter-snow', 'weather-snowy'],
    description: 'Detailed snowflake crystal pattern with six-fold symmetry, representing winter weather and snow',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Snowflake crystal with six-fold symmetry',
  },
  {
    filename: 'seasons-earth-diagram',
    url: wikiThumb('1/12', 'Seasons.svg', 800),
    tags: ['seasons', 'earth-rotation', 'day-night'],
    description: 'Diagram showing Earth at four positions in its orbit around the Sun, illustrating how the tilt of Earth axis creates the four seasons: spring, summer, fall, winter',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['5-ESS1'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Earth orbit diagram showing how tilt creates four seasons',
  },
  {
    filename: 'rainbow-diagram',
    url: wikiThumb('c/c9', 'Rainbow-diagram-ROYGBIV.svg', 600),
    tags: ['light-energy', 'weather-sunny'],
    description: 'Rainbow diagram showing the visible light spectrum with colors labeled: red, orange, yellow, green, blue, indigo, violet (ROYGBIV)',
    subject: 'science',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: ['1-PS4', '4-PS4'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Rainbow diagram with ROYGBIV colors labeled',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Sports & Exercise
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'soccer-ball',
    url: wikiThumb('6/6e', 'Football_%28soccer_ball%29.svg', 400),
    tags: ['soccer-ball'],
    description: 'Black and white soccer ball (football), standard sports equipment used in team games and exercise',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Black and white soccer ball',
  },
  {
    filename: 'basketball',
    url: wikiThumb('6/6a', 'Basketball.svg', 400),
    tags: ['basketball'],
    description: 'Orange basketball with characteristic curved seam lines, used in team sports and physical education',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Orange basketball',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Transportation
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'bicycle-icon',
    url: wikiThumb('0/00', 'Bicycle-icon.svg', 400),
    tags: ['bicycle'],
    description: 'Simple bicycle icon showing a two-wheeled pedal-powered vehicle, used for teaching about transportation and exercise',
    subject: 'general',
    gradeRange: ['K', '1', '2'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Bicycle icon',
  },
  {
    filename: 'car-icon',
    url: wikiThumb('1/17', 'Car_pictogram.svg', 400),
    tags: ['car-vehicle'],
    description: 'Simple car pictogram showing a passenger automobile, used for teaching about transportation',
    subject: 'general',
    gradeRange: ['K', '1', '2'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Car pictogram',
  },
  {
    filename: 'airplane-icon',
    url: wikiThumb('c/c5', 'Airplane_silhouette.svg', 400),
    tags: ['airplane'],
    description: 'Airplane silhouette showing a commercial passenger aircraft, used for teaching about air transportation',
    subject: 'general',
    gradeRange: ['K', '1', '2'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Airplane silhouette',
  },
  {
    filename: 'train-icon',
    url: wikiThumb('c/c7', 'Train_icon.svg', 400),
    tags: ['train'],
    description: 'Train icon showing a locomotive, used for teaching about rail transportation',
    subject: 'general',
    gradeRange: ['K', '1', '2'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Train locomotive icon',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Community Helpers
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'firefighter-icon',
    url: wikiThumb('7/7e', 'Firefighter_icon.svg', 400),
    tags: ['firefighter'],
    description: 'Firefighter icon showing a fire service worker with helmet, representing community helpers who protect people from fires',
    subject: 'general',
    gradeRange: ['K', '1', '2'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Firefighter icon',
  },
  {
    filename: 'doctor-stethoscope',
    url: wikiThumb('9/93', 'Stethoscope.svg', 400),
    tags: ['doctor-nurse'],
    description: 'Medical stethoscope illustration, the tool used by doctors and nurses to listen to heartbeat and breathing, representing healthcare community helpers',
    subject: 'general',
    gradeRange: ['K', '1', '2'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Medical stethoscope',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Energy (Magnets, Circuits)
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'magnet-field',
    url: wikiThumb('0/0c', 'VFPt_cylindrical_magnet_thumb.svg', 600),
    tags: ['magnet', 'push-pull'],
    description: 'Cylindrical bar magnet with magnetic field lines shown around it, demonstrating how magnets create invisible force fields with north and south poles',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['3-PS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Bar magnet with magnetic field lines',
  },
  {
    filename: 'electric-circuit-simple',
    url: wikiThumb('2/2f', 'Simple-electric-circuit-induced-current.svg', 600),
    tags: ['electrical-circuit', 'battery', 'light-bulb'],
    description: 'Simple electric circuit diagram showing a battery connected to a light bulb with wires, demonstrating how electricity flows in a complete circuit',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-PS3', '5-PS3'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Simple electric circuit with battery and light bulb',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Addition/Subtraction symbols
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'plus-sign',
    url: wikiThumb('f/f9', 'Plus_sign.svg', 300),
    tags: ['addition', 'math-manipulatives'],
    description: 'Plus sign mathematical symbol used for addition, the operation of combining numbers together',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['K.OA', '1.OA', '2.OA'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Plus sign for addition',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Base Ten Blocks / Place Value
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'base-ten-blocks-transparent',
    url: wikiThumb('6/69', 'Base_ten_blocks_%28transparent%29.svg', 800),
    tags: ['base-ten-blocks', 'place-value', 'ones-tens-hundreds', 'math-manipulatives'],
    description: 'SVG diagram of the base ten numeral system represented with blocks: unit cube (ones), ten-rod (tens), hundred-flat (hundreds), thousand-cube, on a transparent background',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3', '4'],
    standards: ['K.CC', '1.NBT', '2.NBT', '3.NBT'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Base ten blocks showing ones cubes, tens rods, hundreds flats, and thousands cube',
  },
  {
    filename: 'dienes-blocks-photo',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Dienes_Material_%28Dyskalkulie%29.jpg',
    tags: ['base-ten-blocks', 'place-value', 'ones-tens-hundreds', 'math-manipulatives'],
    description: 'Photograph of real Dienes blocks (base ten blocks) showing physical ones cubes, tens rods, hundreds flats, and thousands cube used as classroom math manipulatives',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['1.NBT', '2.NBT', '3.NBT'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Physical base ten blocks on a table',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Multiplication & Division
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'array-three-by-four',
    url: wikiThumb('b/b3', 'Three_by_Four.svg', 400),
    tags: ['arrays', 'multiplication', 'counting-objects', 'repeated-addition'],
    description: 'Rectangular array of dots arranged in 3 rows and 4 columns showing that three multiplied by four equals twelve, classic array model for teaching multiplication',
    subject: 'math',
    gradeRange: ['2', '3', '4'],
    standards: ['3.OA', '4.OA'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Array of dots showing 3 times 4 equals 12',
  },
  {
    filename: 'equal-groups-bags-marbles',
    url: wikiThumb('3/36', 'Multiply_4_bags_3_marbles.svg', 600),
    tags: ['equal-groups', 'multiplication', 'repeated-addition', 'counting-objects'],
    description: 'Four bags each containing a red, green, and blue marble showing multiplication as equal groups: 4 groups of 3 equals 12',
    subject: 'math',
    gradeRange: ['2', '3', '4'],
    standards: ['3.OA'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Four bags with 3 marbles each showing equal groups',
  },
  {
    filename: 'repeated-addition',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Multiplication_as_repeated_addition.jpg',
    tags: ['repeated-addition', 'multiplication', 'equal-groups'],
    description: 'Illustration showing multiplication as repeated addition with groups of objects being added together to demonstrate the multiplication concept',
    subject: 'math',
    gradeRange: ['2', '3', '4'],
    standards: ['3.OA'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Multiplication shown as repeated addition of groups',
  },
  {
    filename: 'multiplication-table-grid',
    url: wikiThumb('8/81', 'Tabla_de_muitiplicar_01.svg', 600),
    tags: ['times-table', 'multiplication'],
    description: 'Standard multiplication table grid showing products from 1x1 to 10x10 arranged in a clean table format for learning times tables',
    subject: 'math',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['3.OA', '4.OA'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Multiplication table from 1 to 10',
  },
  {
    filename: 'multiplication-chart-lines',
    url: wikiThumb('5/5a', 'Multiplication_chart.svg', 600),
    tags: ['times-table', 'multiplication'],
    description: 'Line chart showing multiplication of numbers 0 through 10 with colored lines representing each factor, x-axis shows the second factor, y-axis shows the product',
    subject: 'math',
    gradeRange: ['3', '4', '5'],
    standards: ['3.OA', '4.OA'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Multiplication chart with colored lines for each factor',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Number Bonds / Part-Whole
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'number-bond-addition',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Whole-part_model_addition_70_plus_30.jpg',
    tags: ['number-bonds', 'fact-families', 'addition', 'place-value'],
    description: 'Part-whole model (Singapore Math style) showing an addition problem: 70 + 30 = 100, with the whole connected to its two parts, functionally equivalent to number bonds',
    subject: 'math',
    gradeRange: ['1', '2', '3'],
    standards: ['1.OA', '2.OA', '2.NBT'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Part-whole model showing 70 + 30 = 100',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Animals (Mammals, Insects, Birds, Fish)
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'mammal-diversity',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Mammal_Diversity_2011.png',
    tags: ['mammals', 'animal-groups', 'biodiversity'],
    description: 'Photo montage showing mammal diversity including bats, kangaroos, elephants, whales, pandas, zebras, platypus, and many more covering all major mammal orders',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['1-LS1', '3-LS4'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Montage of diverse mammal species',
  },
  {
    filename: 'ant-anatomy-diagram',
    url: wikiThumb('8/8d', 'Scheme_ant_worker_anatomy-en.svg', 800),
    tags: ['insects', 'animal-groups'],
    description: 'Beautifully illustrated diagram of worker ant morphology with English labels for all body parts: head, thorax, abdomen, legs, antennae, mandibles, showing the three main insect body sections',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['1-LS1', '3-LS1'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Labeled diagram of ant anatomy showing head, thorax, and abdomen',
  },
  {
    filename: 'insect-anatomy-diagram',
    url: wikiThumb('f/f2', 'Insect_anatomy_diagram.svg', 600),
    tags: ['insects', 'animal-groups'],
    description: 'SVG anatomic diagram of an insect showing internal and external body parts with numbered labels including head, thorax, abdomen, legs, antennae, wings, and internal organs',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-LS1', '4-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Insect anatomy diagram with labeled parts',
  },
  {
    filename: 'bird-parts-diagram',
    url: wikiThumb('1/1f', 'Bird_parts_-_en.svg', 600),
    tags: ['birds', 'animal-groups'],
    description: 'SVG diagram showing a bird whole external body with English labels covering beak, crown, nape, back, wing, tail, breast, belly, feet, and other features',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['1-LS1', '3-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Bird external anatomy diagram with labeled parts',
  },
  {
    filename: 'fish-anatomy-diagram',
    url: wikiThumb('b/b0', 'Fish-anatomy.svg', 600),
    tags: ['fish', 'animal-groups'],
    description: 'Schematic drawing of the inner anatomy of a teleost fish with numbered labels: liver, stomach, intestine, heart, swim bladder, kidney, and gills',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-LS1', '4-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-2.5',
    altText: 'Fish internal anatomy diagram',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Ecosystems
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'ocean-food-web',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Oceanic_Food_Web.jpg',
    tags: ['ocean-ecosystem', 'food-web', 'biodiversity'],
    description: 'Diagram showing biogeochemical cycling in the ocean illustrating how microorganisms dominate carbon transformations at the base of the food web with particulate material sinking to the deep ocean',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['5-LS2', '5-ESS2'],
    source: 'Wikimedia Commons / DOE',
    license: 'Public Domain',
    altText: 'Ocean food web showing carbon cycling and marine organisms',
  },
  {
    filename: 'desert-ecosystem-diorama',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Milwaukee_Public_Museum_November_2022_104_%28The_Southwest--The_Sonoran_Desert%29.jpg',
    tags: ['desert-ecosystem', 'habitat-diorama', 'animal-habitats'],
    description: 'Photograph of the Sonoran Desert diorama at the Milwaukee Public Museum showing desert habitat with saguaro cacti, desert plants, and typical arid landscape',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['2-LS2', '3-LS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Sonoran desert diorama with cacti and desert landscape',
  },
  {
    filename: 'pond-lake-zones',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Primary_zones_of_a_lake.png',
    tags: ['pond-ecosystem', 'animal-habitats', 'biodiversity'],
    description: 'Diagram showing the three primary zones of a lake: the littoral zone near shore, the open-water photic zone, and the deep-water aphotic zone, clearly labeled for teaching aquatic ecosystems',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-LS2', '5-LS2'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Lake ecosystem diagram showing littoral, photic, and aphotic zones',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Moon Phases & Fossils
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'moon-phases-orbital',
    url: wikiThumb('e/e5', 'Phases-of-the-moon-diagram.svg', 800),
    tags: ['moon-phases', 'earth-rotation'],
    description: 'SVG diagram showing all moon phases as the Moon orbits Earth: new moon, waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, third quarter, waning crescent',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['1-ESS1', '5-ESS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Moon phases diagram showing all eight phases in orbital position',
  },
  {
    filename: 'types-of-fossils',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Types_of_Fossils.jpg',
    tags: ['fossils', 'rock-types'],
    description: 'Infographic illustrating the different types of fossils categorized as body fossils, trace fossils, and geochemical fossils with visual examples and descriptions',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-ESS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Types of fossils infographic showing body, trace, and geochemical fossils',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Teeth / Dental
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'human-tooth-diagram',
    url: wikiThumb('4/43', 'Human_tooth_diagram-en.svg', 500),
    tags: ['teeth-dental', 'five-senses'],
    description: 'Cross-section diagram of a healthy human molar showing enamel, cementum, pulp, dentin, surrounding gum and bone tissues, colorful and clearly labeled',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['1-LS1', '4-LS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Cross-section of a human tooth showing enamel, dentin, and pulp',
  },

  // ═══════════════════════════════════════════════════════════════
  // ELA — Story Structure & Dictionary
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'story-structure-pyramid',
    url: wikiThumb('9/96', "Freytag%27s_Pyramid_with_English_text.svg", 600),
    tags: ['story-map', 'sequencing', 'main-idea'],
    description: 'Freytag Pyramid diagram showing story structure: exposition, rising action, climax, falling action, and denouement, essential for teaching narrative structure',
    subject: 'ela',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['RL.2', 'RL.3', 'RL.4', 'RL.5'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Story structure pyramid showing exposition through denouement',
  },
  {
    filename: 'dictionary-icon',
    url: wikiThumb('0/0c', 'Icon_dictionary.svg', 400),
    tags: ['dictionary', 'vocabulary-cards', 'word-meanings'],
    description: 'Colorful icon of an open dictionary book with magnifying glass, representing vocabulary lookup and word study',
    subject: 'ela',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['L.2', 'L.3', 'L.4', 'L.5'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Dictionary icon with magnifying glass',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Art & Music
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'paint-palette-icon',
    url: wikiThumb('7/7e', 'Artist_Painting_Palette_Flat_Icon_Vector.svg', 400),
    tags: ['paint-palette', 'crayons-drawing'],
    description: 'Colorful flat icon of an artist painting palette with paint dabs in multiple colors and a paintbrush, representing art class and creative activities',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Artist painting palette with colorful paint dabs',
  },
  {
    filename: 'piano-keyboard',
    url: wikiThumb('9/98', 'Piano_Keyboard_Diagram.svg', 800),
    tags: ['piano-keys', 'musical-instruments'],
    description: 'SVG diagram of a piano keyboard showing white and black keys labeled with note names, used for teaching music basics',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Piano keyboard diagram with labeled keys',
  },
  {
    filename: 'drum-set',
    url: wikiThumb('0/0d', 'Drum_set.svg', 600),
    tags: ['drums', 'musical-instruments'],
    description: 'SVG illustration of a complete drum set showing bass drum, snare, toms, hi-hat, cymbals, and drum stool with labeled parts',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-3.0',
    altText: 'Drum set with labeled parts',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Diversity, Family, Teamwork
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'family-icon',
    url: wikiThumb('b/b4', 'Family_Practice_-_The_Noun_Project.svg', 400),
    tags: ['family-types', 'diverse-children', 'helping-others'],
    description: 'Simple icon silhouette of a family with two adults and two children holding hands, from The Noun Project, representing family and community',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons / Noun Project',
    license: 'CC0',
    altText: 'Family silhouette icon with adults and children',
  },
  {
    filename: 'group-work-table',
    url: wikiThumb('f/f4', 'HD%40DH.nrw_3_Strichfiguren_am_Basteltisch.svg', 500),
    tags: ['group-work', 'teamwork', 'classroom-discussion'],
    description: 'Drawing of three stick figures sitting together at a table with paper, pencils, and scissors, representing collaborative group work and classroom activities',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-4.0',
    altText: 'Three stick figures working together at a table',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Sports, Water, Beach
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'swimming-pictogram',
    url: wikiThumb('e/eb', 'Swimming_pictogram.svg', 300),
    tags: ['swimming'],
    description: 'Olympic-style swimming pictogram showing a person swimming, simple black silhouette on white background',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Swimming pictogram',
  },
  {
    filename: 'sailboat-icon',
    url: wikiThumb('d/d8', 'Sailboat_Flat_Icon_Vector.svg', 400),
    tags: ['boat-ship'],
    description: 'Colorful flat vector icon of a sailboat on water, representing boats and water transportation',
    subject: 'general',
    gradeRange: ['K', '1', '2'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Sailboat flat icon',
  },
  {
    filename: 'beach-scene',
    url: wikiThumb('9/95', 'Beach-scene.svg', 800),
    tags: ['summer-beach'],
    description: 'Colorful SVG illustration of a beach scene with ocean waves, sand, palm tree, and sun, representing summer and beach activities',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Beach scene with ocean, sand, and palm tree',
  },
  {
    filename: 'chef-hat-icon',
    url: wikiThumb('3/37', 'Hat_chef_2_in_classic_solid_style.svg', 300),
    tags: ['chef-cook', 'cooking'],
    description: 'Classic white chef hat (toque) icon in solid style, representing cooking, chefs, and food preparation',
    subject: 'general',
    gradeRange: ['K', '1', '2'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'White chef hat icon',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Subtraction & Division Symbols
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'minus-symbol',
    url: wikiThumb('e/ec', 'Minus_symbol.svg', 300),
    tags: ['subtraction', 'math-manipulatives'],
    description: 'Minus sign mathematical symbol used for subtraction, the operation of taking away or finding the difference between numbers',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['K.OA', '1.OA', '2.OA'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Minus sign for subtraction',
  },
  {
    filename: 'division-sign',
    url: wikiThumb('4/4f', 'Division_Sign.svg', 300),
    tags: ['division', 'math-manipulatives'],
    description: 'Division symbol (obelus) used for division, the operation of splitting a number into equal groups or finding how many times one number fits into another',
    subject: 'math',
    gradeRange: ['3', '4', '5'],
    standards: ['3.OA', '4.OA', '5.OA'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Division sign symbol',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Tangram & Pattern Blocks
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'tangram-puzzle',
    url: wikiThumb('3/33', 'Tangram.svg', 400),
    tags: ['tangram', 'pattern-blocks', 'shapes-2d'],
    description: 'Seven-piece Chinese tangram puzzle arranged in a square, classic geometry and spatial reasoning tool for teaching shape composition and decomposition',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['K.G', '1.G', '2.G', '3.G'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Tangram puzzle with seven geometric pieces forming a square',
  },
  {
    filename: 'tangram-diagram',
    url: wikiThumb('e/e9', 'Tangram_diagram.svg', 400),
    tags: ['tangram', 'pattern-blocks', 'shapes-2d'],
    description: 'Diagram of a tangram showing the geometric decomposition of the square into seven pieces: two large triangles, one medium triangle, two small triangles, one square, and one parallelogram',
    subject: 'math',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: ['1.G', '2.G', '3.G'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Tangram diagram showing geometric decomposition',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Digital Clock & Calendar
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'digital-clock-display',
    url: wikiThumb('d/d6', 'DigitalClock.svg', 400),
    tags: ['digital-clock', 'clock-hands', 'elapsed-time'],
    description: 'Digital clock display icon showing time in digital number format, used for teaching time-telling with digital clocks and comparing to analog time',
    subject: 'math',
    gradeRange: ['1', '2', '3'],
    standards: ['1.MD', '2.MD', '3.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-3.0',
    altText: 'Digital clock display',
  },
  {
    filename: 'calendar-flat-icon',
    url: wikiThumb('a/ad', 'Schedule_or_Calendar_Flat_Icon.svg', 400),
    tags: ['calendar', 'calendar-months', 'schedule'],
    description: 'Flat design calendar icon showing a monthly calendar page, used for teaching calendar concepts, days of the week, months, and scheduling',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['K.MD', '1.MD', '2.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Calendar flat icon',
  },

  // ═══════════════════════════════════════════════════════════════
  // MATH — Piggy Bank & Decimals Grid
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'piggy-bank-icon',
    url: wikiThumb('5/5f', 'Piggy_Bank_or_Savings_Flat_Icon_Vector.svg', 400),
    tags: ['piggy-bank', 'money-counting'],
    description: 'Pink piggy bank icon in flat design style, representing saving money and financial literacy, used for teaching money concepts and savings to young students',
    subject: 'math',
    gradeRange: ['K', '1', '2', '3'],
    standards: ['2.MD'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Pink piggy bank savings icon',
  },
  {
    filename: 'hundredths-grid',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/100_grid.PNG',
    tags: ['hundredths-grid', 'decimal-grid', 'decimals'],
    description: '10 by 10 grid of 100 squares used for teaching decimals, percentages, and fractions, visual model where each square represents one hundredth',
    subject: 'math',
    gradeRange: ['3', '4', '5'],
    standards: ['4.NF', '5.NBT'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: '10x10 grid of 100 squares for teaching decimals and percentages',
  },

  // ═══════════════════════════════════════════════════════════════
  // ELA — Punctuation Marks
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'question-mark-icon',
    url: wikiThumb('1/11', 'Blue_question_mark_icon.svg', 300),
    tags: ['punctuation-marks', 'sentence-types'],
    description: 'Blue question mark icon, representing the punctuation mark used at the end of interrogative sentences, for teaching question formation and punctuation rules',
    subject: 'ela',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['L.1', 'L.2'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Blue question mark icon',
  },
  {
    filename: 'exclamation-mark-icon',
    url: wikiThumb('c/c9', 'Exclamation_flat_icon_orange.svg', 300),
    tags: ['punctuation-marks', 'sentence-types'],
    description: 'Orange exclamation mark icon in a circle, representing the punctuation mark used at the end of exclamatory sentences, for teaching emphasis and sentence types',
    subject: 'ela',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['L.1', 'L.2'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Orange exclamation mark icon',
  },
  {
    filename: 'comma-punctuation',
    url: wikiThumb('6/6f', 'Comma.svg', 200),
    tags: ['punctuation-marks', 'capital-letters'],
    description: 'Simple comma punctuation mark, used for teaching comma placement in lists, compound sentences, and other grammar rules',
    subject: 'ela',
    gradeRange: ['1', '2', '3', '4', '5'],
    standards: ['L.1', 'L.2', 'L.3'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Comma punctuation mark',
  },

  // ═══════════════════════════════════════════════════════════════
  // ELA — Parts of Speech & Writing
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'parts-of-speech-chart',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/English_Parts_of_speech.jpg',
    tags: ['parts-of-speech', 'nouns-verbs', 'sentence-types'],
    description: 'English grammar chart showing all parts of speech: nouns, verbs, adjectives, adverbs, prepositions, conjunctions, interjections, and pronouns with color-coded sections',
    subject: 'ela',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['L.2', 'L.3', 'L.4', 'L.5'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'English parts of speech grammar chart',
  },
  {
    filename: 'literature-portal-icon',
    url: wikiThumb('1/1d', 'P_literature.svg', 400),
    tags: ['poetry-book', 'book-reading', 'story-writing'],
    description: 'Open book icon commonly used as a literature portal symbol, representing reading, writing, poetry, and literary study',
    subject: 'ela',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['RL.K', 'RL.1', 'RL.2', 'RL.3', 'RL.4', 'RL.5'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Open book literature icon',
  },
  {
    filename: 'memo-writing-icon',
    url: wikiThumb('1/14', 'Noto_Emoji_Oreo_1f4dd.svg', 300),
    tags: ['writing-paper', 'pencil-writing', 'journal', 'essay-outline'],
    description: 'Memo and writing emoji icon showing a pencil writing on a notepad, representing writing activities including journaling, essay writing, and note-taking',
    subject: 'ela',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['W.K', 'W.1', 'W.2', 'W.3', 'W.4', 'W.5'],
    source: 'Wikimedia Commons / Google Noto',
    license: 'Apache-2.0',
    altText: 'Pencil writing on notepad icon',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Engineering & Design
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'building-brick-svg',
    url: wikiThumb('1/15', 'Building_brick.svg', 400),
    tags: ['building-blocks', 'engineering-process', 'prototype'],
    description: 'SVG illustration of colorful LEGO-style building bricks in perspective, representing construction, building, and hands-on engineering activities for young learners',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['K-ETS1', '2-ETS1', '3-ETS1'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Colorful building bricks in perspective view',
  },
  {
    filename: 'beam-bridge-diagram',
    url: wikiThumb('f/fb', 'BeamBridge-diagram.svg', 600),
    tags: ['bridge-design', 'engineering-process', 'building-blocks'],
    description: 'Clean diagram of a beam bridge showing the simplest bridge type with a horizontal deck supported by abutments, ideal for teaching bridge design and engineering concepts',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['2-ETS1', '3-ETS1', '4-ETS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Beam bridge diagram showing deck and supports',
  },
  {
    filename: 'suspension-bridge-diagram',
    url: wikiThumb('3/38', 'SuspensionBridge-diagram.svg', 600),
    tags: ['bridge-design', 'engineering-process'],
    description: 'Diagram of a suspension bridge with cables and towers, showing an advanced bridge type for comparing engineering designs and discussing forces',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-ETS1', '4-ETS1', '5-ETS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Suspension bridge diagram with cables and towers',
  },
  {
    filename: 'engineering-design-process',
    url: wikiThumb('5/55', 'Engineering_design_process.svg', 600),
    tags: ['engineering-process', 'invention', 'prototype'],
    description: 'Simplified engineering design process diagram showing the iterative steps: ask, imagine, plan, create, improve, used for teaching the design thinking process to students',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-ETS1', '4-ETS1', '5-ETS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-2.0',
    altText: 'Engineering design process flow diagram',
  },
  {
    filename: 'simple-blueprints',
    url: wikiThumb('8/8b', 'Simple_blueprints.svg', 800),
    tags: ['blueprint', 'engineering-process', 'bridge-design'],
    description: 'Classic blue-and-white blueprint layout with grid lines, representing architectural and engineering plans, used for teaching about planning and design documentation',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-ETS1', '4-ETS1', '5-ETS1'],
    source: 'Wikimedia Commons',
    license: 'CC0',
    altText: 'Blueprint layout with grid lines',
  },
  {
    filename: 'light-bulb-invention',
    url: wikiThumb('6/62', 'Incandescent_light_bulb.svg', 400),
    tags: ['invention', 'light-bulb', 'electrical-circuit'],
    description: 'Detailed cross-section diagram of an incandescent light bulb showing all major parts: glass bulb, tungsten filament, contact wires, support wires, screw threads, numbered labels for teaching about inventions and how things work',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-PS3', '4-ETS1'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Cross-section diagram of an incandescent light bulb',
  },

  {
    filename: 'arch-bridge-diagram',
    url: wikiThumb('c/cf', 'ArchBridge-diagram.svg', 600),
    tags: ['bridge-design', 'engineering-process'],
    description: 'Clean diagram of an arch bridge showing the curved structure that transfers weight to the abutments, for comparing bridge types in engineering design lessons',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['2-ETS1', '3-ETS1', '4-ETS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Arch bridge diagram showing curved support structure',
  },
  {
    filename: 'scientific-method-diagram',
    url: wikiThumb('8/82', 'The_Scientific_Method.svg', 600),
    tags: ['engineering-process', 'invention'],
    description: 'Circular diagram showing the steps of the scientific method: ask a question, do research, form hypothesis, test with experiment, analyze data, draw conclusions, communicate results',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-ETS1', '4-ETS1', '5-ETS1'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Scientific method circular flow diagram',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Reptiles, Hurricanes, Energy
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'reptile-montage',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Reptilia.jpg',
    tags: ['reptiles', 'animal-groups', 'biodiversity'],
    description: 'Photo montage of reptile species including European pond turtle, Aesculapian snake, and sand lizard, showing reptile diversity for teaching animal classification',
    subject: 'science',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: ['1-LS1', '3-LS4'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Montage of reptile species: turtle, snake, and lizard',
  },
  {
    filename: 'hurricane-structure',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Hurricane_structure_graphic.jpg',
    tags: ['hurricane', 'tornado', 'weather-windy'],
    description: 'NOAA diagram showing the internal structure of a hurricane with labeled eye, eye wall, rain bands, and wind circulation patterns',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['3-ESS2'],
    source: 'Wikimedia Commons / NOAA',
    license: 'Public Domain',
    altText: 'Hurricane cross-section showing eye and wind patterns',
  },
  {
    filename: 'heat-transfer-campfire',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Heat-transmittance-means2.jpg',
    tags: ['heat-energy', 'light-energy'],
    description: 'Illustration showing four modes of heat transfer from a campfire: conduction, convection, radiation, and advection, with labeled arrows showing how heat moves in different ways',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['4-PS3', '5-PS3'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-4.0',
    altText: 'Campfire showing four modes of heat transfer',
  },
  {
    filename: 'solar-panels-roof',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Solar_panels_on_a_roof.jpg',
    tags: ['solar-panel', 'light-energy', 'electrical-circuit'],
    description: 'Photograph of solar panels installed on a residential roof, converting sunlight into electricity, used for teaching renewable energy and solar power concepts',
    subject: 'science',
    gradeRange: ['2', '3', '4', '5'],
    standards: ['4-PS3', '4-ESS3'],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Solar panels installed on a roof',
  },
  {
    filename: 'sound-wave-diagram',
    url: wikiThumb('5/56', 'Simple_harmonic_motion.svg', 600),
    tags: ['sound-waves', 'light-energy'],
    description: 'Diagram showing simple harmonic wave motion with amplitude and period labeled, representing sound waves and vibrations for teaching about how sound travels',
    subject: 'science',
    gradeRange: ['3', '4', '5'],
    standards: ['1-PS4', '4-PS4'],
    source: 'Wikimedia Commons',
    license: 'CC-BY-SA-3.0',
    altText: 'Sound wave diagram showing amplitude and period',
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL — Sports & Exercise (Running, Gymnastics)
  // ═══════════════════════════════════════════════════════════════
  {
    filename: 'athletics-running-pictogram',
    url: wikiThumb('8/8f', 'Athletics_pictogram.svg', 300),
    tags: ['running-track', 'yoga-stretching', 'jump-rope'],
    description: 'Olympic-style athletics running pictogram showing a figure in running stride, representing track and field, exercise, and physical education',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Running athletics pictogram',
  },
  {
    filename: 'gymnastics-pictogram',
    url: wikiThumb('1/12', 'Gymnastics_%28artistic%29_pictogram.svg', 300),
    tags: ['yoga-stretching', 'jump-rope'],
    description: 'Olympic-style gymnastics pictogram showing a figure performing on a horizontal bar, representing gymnastics, stretching, and physical fitness activities',
    subject: 'general',
    gradeRange: ['K', '1', '2', '3', '4', '5'],
    standards: [],
    source: 'Wikimedia Commons',
    license: 'Public Domain',
    altText: 'Gymnastics pictogram',
  },
];

// ---------------------------------------------------------------------------
// Embed + Upsert
// ---------------------------------------------------------------------------
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function main() {
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(MONGODB_URI!);
  console.log(`Connected. Processing ${IMAGES.length} images...`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const img of IMAGES) {
    try {
      // Check if already exists
      const existing = await LessonImage.findOne({ filename: img.filename });
      if (existing) {
        console.log(`  SKIP: ${img.filename} (already exists)`);
        skipped++;
        continue;
      }

      // Generate embedding from description
      console.log(`  Embedding: ${img.filename}...`);
      const embedding = await generateEmbedding(img.description);

      // Create document
      await LessonImage.create({
        ...img,
        embedding,
      });

      console.log(`  CREATED: ${img.filename} (${img.tags.length} tags, ${embedding.length}d embedding)`);
      created++;

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`  ERROR: ${img.filename}:`, err);
      errors++;
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log(`Total images in DB: ${await LessonImage.countDocuments()}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
