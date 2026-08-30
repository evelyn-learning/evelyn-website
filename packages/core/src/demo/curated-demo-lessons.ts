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

// Refreshed 2026-08-29: the previous spread had run unchanged for months and
// leaned on equation/text-heavy topics. This one is picked to light up the
// PARAMETRIC RENDERERS in the first minutes — geometry, cell diagrams,
// projectile trajectories + vectors, the unit circle, Punnett squares, Lewis
// structures, maps/timelines — so a first-time visitor SEES the whiteboard
// working, not just hears the voice.
export const CURATED_DEMO_LESSONS: CuratedDemoLesson[] = [
  {
    planId: 'evelyn.g3.math.area-perimeter.v1',
    title: 'Area & Perimeter',
    subjectLabel: 'Math',
    levelLabel: 'Grade 3',
    hook: 'Shapes drawn & measured live',
    tone: 'indigo',
  },
  {
    planId: 'evelyn.g68.science.cell-structure.v1',
    title: 'Inside a Cell',
    subjectLabel: 'Science',
    levelLabel: 'Middle school',
    hook: 'Organelles, drawn & labeled',
    tone: 'emerald',
  },
  {
    planId: 'evelyn.hs.science.physics.kinematics-2d-projectile.v1',
    title: 'Projectile Motion',
    subjectLabel: 'Physics',
    levelLabel: 'High school',
    hook: 'Trajectories, vectors & motion graphs',
    tone: 'rose',
  },
  {
    planId: 'evelyn.ap.precalc.trigonometric-polar.v1',
    title: 'The Unit Circle',
    subjectLabel: 'Precalculus',
    levelLabel: 'AP',
    hook: 'Angles come alive on the circle',
    tone: 'indigo',
  },
  {
    planId: 'evelyn.hs.science.biology.mendelian-genetics.v1',
    title: 'Punnett Squares',
    subjectLabel: 'Biology',
    levelLabel: 'High school',
    hook: 'Cross traits, predict offspring',
    tone: 'emerald',
  },
  {
    planId: 'evelyn.hs.science.chemistry.covalent-bonding-lewis.v1',
    title: 'Molecules & Bonds',
    subjectLabel: 'Chemistry',
    levelLabel: 'High school',
    hook: 'Lewis structures, bond by bond',
    tone: 'amber',
  },
  {
    planId: 'evelyn.g6.ss.ancient-egypt.v1',
    title: 'Ancient Egypt',
    subjectLabel: 'Social Studies',
    levelLabel: 'Grade 6',
    hook: 'Maps, timelines & monuments',
    tone: 'rose',
  },
];
