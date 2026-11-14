/**
 * Curated flagship demo lessons — the hand-picked spread shown as one-tap
 * tiles on the /tutor lobby and as chips on the /products/voice-tutor live
 * demo. Chosen to demonstrate breadth (elementary → HS → test prep) and the
 * whiteboard-heavy lessons that demo best.
 *
 * Every planId MUST exist in SEED_PLANS and resolve to a non-orphan taxonomy
 * cell (tile clicks drive the subject/level/topic cascade through
 * handleSearchSelect). Guarded by scripts/test-curated-demo-lessons.ts
 * (npm run test:curated-demo) — run it after renaming or removing seeds.
 */

export interface CuratedDemoLesson {
  planId: string;
  /** Display title for the tile/chip (scannable; may differ from plan title). */
  title: string;
  subjectLabel: string;
  levelLabel: string;
  /** One-line hook shown on the lobby tile. */
  hook: string;
  /** Accent bucket for the subject dot / eyebrow. */
  tone: 'indigo' | 'emerald' | 'amber' | 'rose';
}

// 2026-11-13 (Praveen): replaced with the twelve agreed for the v2 tutor; after each was run once, three thin
// plans were swapped for richer ones (circuits → forces, cell structure → plant & animal cells, states of matter →
// changes of state) (figures
// reworked 11-11..11-13). He dislikes projectile motion and Punnett squares as
// demos, so both are out. Index 0 is the widget's default-selected chip.
export const CURATED_DEMO_LESSONS: CuratedDemoLesson[] = [
  {
    planId: 'evelyn.ap.physics2.optics.v1',
    title: 'Why a Pencil Looks Bent',
    subjectLabel: 'Physics',
    levelLabel: 'AP',
    hook: 'Refraction drawn ray by ray',
    tone: 'rose',
  },
  {
    planId: 'evelyn.ms.m8math.the-pythagorean-theorem-and-its-converse.v1',
    title: 'The Pythagorean Theorem',
    subjectLabel: 'Math',
    levelLabel: 'Grade 8',
    hook: 'Right triangles, squares on every side',
    tone: 'indigo',
  },
  {
    planId: 'evelyn.ms.m8sci.forces-and-net-force.v1',
    title: 'Forces & Net Force',
    subjectLabel: 'Physics',
    levelLabel: 'Grade 8',
    hook: 'Tug-of-war, drawn as force arrows',
    tone: 'amber',
  },
  {
    planId: 'evelyn.g6.science.physics.density-buoyancy.v1',
    title: 'Why Things Float',
    subjectLabel: 'Science',
    levelLabel: 'Grade 6',
    hook: 'Density & buoyancy, pictured',
    tone: 'rose',
  },
  {
    planId: 'evelyn.ms.m7sci.plant-and-animal-cells.v1',
    title: 'Plant & Animal Cells',
    subjectLabel: 'Biology',
    levelLabel: 'Grade 7',
    hook: 'Organelles, drawn & labeled',
    tone: 'emerald',
  },
  {
    planId: 'evelyn.g11.ss.econ.supply-demand.v1',
    title: 'Supply & Demand',
    subjectLabel: 'Economics',
    levelLabel: 'High school',
    hook: 'Curves shift, prices move',
    tone: 'amber',
  },
  {
    planId: 'evelyn.g4.math.equivalent-fractions.v1',
    title: 'Equivalent Fractions',
    subjectLabel: 'Math',
    levelLabel: 'Grade 4',
    hook: 'Same amount, different pieces',
    tone: 'indigo',
  },
  {
    planId: 'evelyn.hs.alg1.quadratic-graphs-vertex.v1',
    title: 'Quadratic Graphs',
    subjectLabel: 'Algebra',
    levelLabel: 'High school',
    hook: 'Parabolas & the vertex, live',
    tone: 'indigo',
  },
  {
    planId: 'evelyn.ms.m6sci.phases-of-the-moon.v1',
    title: 'Phases of the Moon',
    subjectLabel: 'Science',
    levelLabel: 'Grade 6',
    hook: 'Sun, Earth & Moon on the board',
    tone: 'emerald',
  },
  {
    planId: 'evelyn.ms.m8sci.changes-of-state-and-thermal-energy.v1',
    title: 'Changes of State',
    subjectLabel: 'Science',
    levelLabel: 'Grade 8',
    hook: 'Heating curves & moving particles',
    tone: 'emerald',
  },
  {
    planId: 'evelyn.ap.world.unit2-networks.v1',
    title: 'The Silk Roads',
    subjectLabel: 'World History',
    levelLabel: 'AP',
    hook: 'Routes, goods & ideas on the map',
    tone: 'rose',
  },
  {
    planId: 'evelyn.g7.math.probability.intro.v1',
    title: 'Probability',
    subjectLabel: 'Math',
    levelLabel: 'Grade 7',
    hook: 'Chances, trees & outcomes',
    tone: 'indigo',
  },
];
