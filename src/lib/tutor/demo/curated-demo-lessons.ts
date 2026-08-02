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

export const CURATED_DEMO_LESSONS: CuratedDemoLesson[] = [
  {
    planId: 'evelyn.g3.math.fractions.intro.v1',
    title: 'Fractions',
    subjectLabel: 'Math',
    levelLabel: 'Grade 3',
    hook: 'Equal parts of a whole, visually',
    tone: 'indigo',
  },
  {
    planId: 'evelyn.g5.science.life.photosynthesis-basics.v1',
    title: 'Photosynthesis',
    subjectLabel: 'Science',
    levelLabel: 'Grade 5',
    hook: 'How plants make their own food',
    tone: 'emerald',
  },
  {
    planId: 'evelyn.hs.science.physics.newtons-second-law.v1',
    title: "Newton's Second Law",
    subjectLabel: 'Physics',
    levelLabel: 'High school',
    hook: 'F = ma on the live whiteboard',
    tone: 'rose',
  },
  {
    planId: 'evelyn.hs.alg1.quadratic-graphs-vertex.v1',
    title: 'Quadratic Graphs',
    subjectLabel: 'Algebra 1',
    levelLabel: 'High school',
    hook: 'Parabolas & vertex form',
    tone: 'indigo',
  },
  {
    planId: 'evelyn.testprep.dsat.linear-equations-one-var.v1',
    title: 'SAT Linear Equations',
    subjectLabel: 'Test prep',
    levelLabel: 'Digital SAT',
    hook: 'Real SAT-style items',
    tone: 'emerald',
  },
  {
    planId: 'evelyn.hs.engl.thesis-statements.v1',
    title: 'Thesis Statements',
    subjectLabel: 'English',
    levelLabel: 'High school',
    hook: 'From claim to defensible thesis',
    tone: 'amber',
  },
  {
    planId: 'evelyn.hs.whist.industrial-revolution.v1',
    title: 'The Industrial Revolution',
    subjectLabel: 'World History',
    levelLabel: 'High school',
    hook: 'Machines, cities, and change',
    tone: 'rose',
  },
];
