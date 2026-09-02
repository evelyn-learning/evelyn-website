/**
 * Topic Taxonomy for AI Voice Tutor
 *
 * Comprehensive subject → level → topic mapping covering K-12,
 * AP/IB, SAT/ACT, and college intro courses.
 */

export interface TutorSubject {
  id: string;
  label: string;
  icon: string; // emoji
}

export interface TutorLevel {
  id: string;
  label: string;
  description: string;
}

/**
 * Adaptive-pacing rollout state per topic.
 *
 *  - 'disabled' (default): brain-gen does not fire for this topic.
 *  - 'shadow': pipeline runs invisibly for telemetry only; student
 *      always sees plan-authored or bank result. Used to validate a
 *      new topic before exposing brain-gen to students.
 *  - 'beta': brain-gen serves student-initiated requests live.
 *      Auto-injection still off.
 *  - 'live': full pipeline including auto-injection enabled.
 *
 * Promotion gates are telemetry-driven (see adaptive-pacing v1 spec):
 *  shadow → beta: ≥100 runs, ≥95% verifier-pass rate
 *  beta → live: ≥50 student-initiated served, <5% dissatisfaction signals
 */
export type BrainGenState = 'disabled' | 'shadow' | 'beta' | 'live';

/**
 * OpenStax-style ingested problem-bank coverage per topic.
 *
 *  - 'none': nothing ingested. Pipeline skips Layer 1 fast-path.
 *  - 'seed': initial batch (≥20 problems).
 *  - 'curated': ≥100 problems, manual spot-check passed.
 *  - 'maintained': quarterly refresh active.
 */
export type BankCoverageState = 'none' | 'seed' | 'curated' | 'maintained';

/**
 * A CONCEPT beneath a topic — the 4th taxonomy level (Step 4, 2026-08-25).
 *
 * Concepts are the unit the tutor actually teaches in a turn, and the unit
 * the portal counts progress against: open containers currently carry zero
 * CourseNode rows, so container progress cannot mean anything until these
 * exist. Authored per-leaf ON DEMAND (starting with leaves that already have
 * lesson plans) — never a big-bang fill.
 *
 * `id` IS A PUBLIC API: it becomes a URL segment on evelyntutor.com, so a
 * rename is a redirect, not an edit.
 *
 * Shape agreed with the evelyntutor.com session 2026-08-25. Note there is NO
 * `published`/`gatePassed` field, deliberately: that verdict belongs to the
 * portal's quality gate, which is a pure function evaluated at render. Storing
 * it here would cache a relation neither side controls and go stale silently
 * the first time the gate is tightened.
 */
export interface TutorConcept {
  /** Stable, URL-safe. Unique within the parent topic. */
  id: string;
  label: string;
  /** Portal gate requires >= 120 chars. */
  definition: string;
  /**
   * At least one. `point` is the scannable headline, `why` is the teaching —
   * the split exists so the gate can test them separately; flattened to one
   * string the check degrades to a length threshold any verbose paraphrase
   * passes. Matches the 865 `sticking` entries already authored in the
   * academy repo's topic briefs.
   *
   * ⚠ The gate rejects a `point` that OPENS with learner framing
   * ("Students misunderstand X"); state the error first.
   */
  misconceptions: { point: string; why: string }[];
  /**
   * At least one. ⚠ The gate cannot tell a strong example from filler and
   * passes both — emit ONE STRONG example rather than padding the array.
   * Weak presence is unenforceable downstream and must be caught here.
   */
  workedExamples: string[];
  /**
   * Spoken/written phrasings that should resolve to this concept. Used by
   * session tagging, NOT by the portal gate — the tutor has to map "the thing
   * about charges falling off with distance squared" onto `coulombs-law`.
   */
  aliases?: string[];
}

export interface TutorTopic {
  id: string;
  label: string;
  /** 4th-level concepts. Absent on the 256 topics that predate Step 4. */
  concepts?: TutorConcept[];
  /** Adaptive-pacing rollout state. Defaults to 'disabled' if unset. */
  brainGen?: BrainGenState;
  /** Problem-bank coverage. Defaults to 'none' if unset. */
  bankCoverage?: BankCoverageState;
}

export interface SessionGoalOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

// ── Subjects ──

export const SUBJECTS: TutorSubject[] = [
  { id: 'math', label: 'Mathematics', icon: '📐' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'ela', label: 'English Language Arts', icon: '📖' },
  { id: 'social-studies', label: 'Social Studies & History', icon: '🌍' },
  { id: 'cs', label: 'Computer Science', icon: '💻' },
  { id: 'languages', label: 'World Languages', icon: '🗣️' },
  { id: 'arts', label: 'Arts', icon: '🎨' },
  { id: 'test-prep', label: 'Test Prep', icon: '🎯' },
  { id: 'professional', label: 'Professional Certs', icon: '🏥' },
];

// ── Levels ──

export const LEVELS: TutorLevel[] = [
  { id: 'k-2', label: 'Elementary (K-2)', description: 'Early foundations' },
  { id: '3-5', label: 'Elementary (3-5)', description: 'Building skills' },
  { id: '6-8', label: 'Middle School (6-8)', description: 'Core concepts' },
  { id: '9-10', label: 'High School (9-10)', description: 'Standard courses' },
  { id: '11-12', label: 'High School (11-12)', description: 'Advanced courses' },
  { id: 'gcse', label: 'GCSE', description: 'UK GCSE (Higher / Foundation)' },
  { id: 'ap', label: 'AP / IB', description: 'College-level rigor' },
  { id: 'sat-act', label: 'SAT / ACT', description: 'Standardized test prep' },
  { id: 'iitjee', label: 'IIT JEE', description: 'JEE Main + Advanced (engineering)' },
  { id: 'medical-entrance', label: 'Medical Entrance (NEET)', description: 'NEET UG (Indian medical entrance)' },
  { id: 'graduate', label: 'Graduate Tests', description: 'GRE / GMAT / LSAT / MCAT' },
  { id: 'nursing', label: 'Nursing', description: 'NCLEX-RN / NCLEX-PN' },
  { id: 'college', label: 'College Intro', description: 'Freshman-level' },
];

// ── Goals ──

export const SESSION_GOALS: SessionGoalOption[] = [
  { id: 'practice', label: 'Practice Problems', icon: '📝', description: 'Work through problems with guided feedback' },
  { id: 'homework-help', label: 'Homework Help', icon: '📚', description: 'Step-by-step help on assignments' },
  { id: 'concept-review', label: 'Concept Review', icon: '💡', description: 'Review and understand key ideas' },
  { id: 'test-prep', label: 'Test Prep', icon: '🎯', description: 'Focused exam preparation' },
  { id: 'catch-up', label: 'Catch Up', icon: '🔄', description: 'Fill gaps from missed classes' },
  { id: 'challenge', label: 'Challenge Me', icon: '🚀', description: 'Go beyond with harder problems' },
];

// ── Topic Taxonomy ──
// Map: subjectId → levelId → topics[]

const TOPIC_MAP: Record<string, Record<string, TutorTopic[]>> = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MATHEMATICS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  math: {
    'k-2': [
      { id: 'counting', label: 'Counting & Number Sense' },
      { id: 'addition-subtraction', label: 'Addition & Subtraction' },
      { id: 'shapes-patterns', label: 'Shapes & Patterns' },
      { id: 'measurement-time', label: 'Measurement & Time' },
      { id: 'place-value', label: 'Place Value' },
    ],
    '3-5': [
      { id: 'multiplication-division', label: 'Multiplication & Division' },
      { id: 'fractions-decimals', label: 'Fractions & Decimals' },
      { id: 'geometry-basics', label: 'Geometry Basics' },
      { id: 'measurement-data', label: 'Measurement & Data' },
      { id: 'order-of-operations', label: 'Order of Operations' },
      { id: 'word-problems', label: 'Word Problems' },
    ],
    '6-8': [
      { id: 'pre-algebra', label: 'Pre-Algebra' },
      { id: 'ratios-proportions', label: 'Ratios & Proportions' },
      { id: 'integers-rational', label: 'Integers & Rational Numbers' },
      { id: 'expressions-equations', label: 'Expressions & Equations' },
      { id: 'geometry-angles', label: 'Geometry & Angles' },
      { id: 'statistics-probability', label: 'Statistics & Probability' },
      { id: 'coordinate-plane', label: 'Coordinate Plane' },
      { id: 'grade-7-math', label: 'Grade 7 Math' },
      { id: 'grade-6-math', label: 'Grade 6 Math' },
      { id: 'grade-8-math', label: 'Grade 8 Math' },
    ],
    '9-10': [
      { id: 'algebra-1', label: 'Algebra 1' },
      { id: 'geometry', label: 'Geometry' },
      { id: 'algebra-2', label: 'Algebra 2' },
      { id: 'linear-functions', label: 'Linear Functions' },
      { id: 'quadratic-equations', label: 'Quadratic Equations' },
      { id: 'systems-of-equations', label: 'Systems of Equations' },
      { id: 'polynomials', label: 'Polynomials' },
    ],
    '11-12': [
      { id: 'trigonometry', label: 'Trigonometry' },
      { id: 'pre-calculus', label: 'Pre-Calculus' },
      { id: 'intro-calculus', label: 'Intro to Calculus' },
      { id: 'sequences-series', label: 'Sequences & Series' },
      { id: 'logarithms-exponentials', label: 'Logarithms & Exponentials' },
      { id: 'matrices', label: 'Matrices' },
      { id: 'statistics', label: 'Statistics' },
    ],
    gcse: [
      { id: 'gcse-math', label: 'GCSE Maths (Higher / Foundation)' },
    ],
    ap: [
      { id: 'ap-precalculus', label: 'AP Precalculus' },
      { id: 'ap-calculus-ab', label: 'AP Calculus AB', brainGen: 'shadow', bankCoverage: 'none' },
      { id: 'ap-calculus-bc', label: 'AP Calculus BC' },
      { id: 'ap-statistics', label: 'AP Statistics' },
      { id: 'ib-math-analysis', label: 'IB Math Analysis' },
      { id: 'ib-math-applications', label: 'IB Math Applications' },
    ],
    college: [
      { id: 'calculus-1', label: 'Calculus I' },
      { id: 'calculus-2', label: 'Calculus II' },
      { id: 'linear-algebra', label: 'Linear Algebra' },
      { id: 'discrete-math', label: 'Discrete Math' },
      { id: 'intro-statistics', label: 'Intro Statistics' },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SCIENCE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  science: {
    'k-2': [
      { id: 'living-things', label: 'Living Things' },
      { id: 'weather-seasons', label: 'Weather & Seasons' },
      { id: 'earth-space', label: 'Earth & Space' },
      { id: 'matter-materials', label: 'Matter & Materials' },
      { id: 'animals-habitats', label: 'Animals & Habitats' },
      { id: 'physical-science', label: 'Physical Science' },
    ],
    '3-5': [
      { id: 'life-cycles', label: 'Life Cycles' },
      { id: 'ecosystems', label: 'Ecosystems' },
      { id: 'forces-motion', label: 'Forces & Motion' },
      { id: 'earth-science', label: 'Earth Science' },
      { id: 'water-cycle', label: 'Water Cycle' },
      { id: 'light-sound', label: 'Light & Sound' },
      { id: 'simple-machines', label: 'Simple Machines' },
      { id: 'physical-science', label: 'Physical Science' },
    ],
    '6-8': [
      { id: 'cell-biology', label: 'Cell Biology' },
      { id: 'human-body', label: 'Human Body Systems' },
      { id: 'chemistry-basics', label: 'Chemistry Basics' },
      { id: 'physics-basics', label: 'Physics Basics' },
      { id: 'earth-space-science', label: 'Earth & Space Science' },
      { id: 'genetics', label: 'Genetics' },
      { id: 'ecology', label: 'Ecology' },
      { id: 'physical-science', label: 'Physical Science' },
      { id: 'grade-7-life-science', label: 'Grade 7 Science (Life Science)' },
      { id: 'grade-6-earth-space-science', label: 'Grade 6 Science (Earth & Space Science)' },
      { id: 'grade-8-physical-science', label: 'Grade 8 Science (Physical Science)' },
    ],
    '9-10': [
      { id: 'biology', label: 'Biology' },
      { id: 'chemistry', label: 'Chemistry' },
      { id: 'earth-science-hs', label: 'Earth Science' },
      { id: 'physical-science', label: 'Physical Science' },
      { id: 'anatomy-physiology', label: 'Anatomy & Physiology' },
    ],
    '11-12': [
      { id: 'physics', label: 'Physics' },
      { id: 'chemistry-advanced', label: 'Chemistry (Advanced)' },
      { id: 'biology-advanced', label: 'Biology (Advanced)' },
      { id: 'environmental-science', label: 'Environmental Science' },
      { id: 'astronomy', label: 'Astronomy' },
    ],
    ap: [
      { id: 'ap-biology', label: 'AP Biology' },
      { id: 'ap-chemistry', label: 'AP Chemistry', brainGen: 'shadow', bankCoverage: 'none' },
      {
        id: 'ap-physics-1',
        label: 'AP Physics 1',
        brainGen: 'shadow',
        bankCoverage: 'none',
        // Step 4 VERTICAL SLICE (2026-08-25) — first leaf authored, deliberately
        // 4 concepts rather than the eventual 15-25. Proves the pipe end to end;
        // the rest are authored on demand, per-leaf, never a big-bang fill.
        concepts: [
          {
            id: 'newtons-second-law',
            label: "Newton's Second Law",
            definition:
              'The acceleration of an object is proportional to the net force acting on it and inversely proportional to its mass, so a = F_net / m. The relationship is a statement about the VECTOR SUM of every force, which is why it is only usable once a free-body diagram is complete.',
            misconceptions: [
              {
                point: 'Applying F = ma to a single force rather than to the net force',
                why: 'Problems are introduced with one obvious push or pull, so the equation gets attached to "the force" instead of to the sum of all of them. It breaks the moment friction, tension, or a second contact force enters, and the error is invisible because the arithmetic still works.',
              },
              {
                point: 'Treating mass and weight as interchangeable quantities',
                why: 'Both are called "how heavy" in ordinary speech and share units in casual use. Mass is invariant while weight is a force that depends on local g, so the two diverge immediately in elevator, incline, and off-Earth problems.',
              },
            ],
            workedExamples: [
              'A 4.0 kg block is pulled right by a 20 N force while friction opposes it with 8.0 N. Net force is 20 - 8 = 12 N to the right, so a = 12 / 4.0 = 3.0 m/s^2 to the right. Note the single force never appears in the answer.',
            ],
            aliases: ['f equals ma', 'newton second law', 'net force and acceleration', 'force mass acceleration'],
          },
          {
            id: 'free-body-diagrams',
            label: 'Free-Body Diagrams',
            definition:
              'A free-body diagram isolates one object and draws every force acting ON it as a vector from a single point, excluding forces the object exerts on anything else. It is the step that converts a physical situation into the vector sum Newton\u2019s second law needs.',
            misconceptions: [
              {
                point: 'Drawing forces the object exerts on other objects',
                why: 'Third-law pairs are taught together, so both arrows feel like they belong in the same picture. Only forces acting ON the isolated body enter its diagram, and including the reaction force double-counts the interaction and produces a net force of zero for everything.',
              },
            ],
            workedExamples: [
              'A book rests on a table. The diagram carries exactly two arrows: gravity pulling down (mg) and the normal force pushing up (N). The book pushing DOWN on the table is real but belongs on the table\u2019s diagram, not the book\u2019s.',
            ],
            aliases: ['fbd', 'force diagram', 'drawing forces on an object', 'isolating the body'],
          },
          {
            id: 'conservation-of-energy',
            label: 'Conservation of Energy',
            definition:
              'In an isolated system the total mechanical energy stays constant, so kinetic and potential energy trade off without loss. Where non-conservative forces such as friction act, the missing mechanical energy has been converted to thermal energy rather than destroyed.',
            misconceptions: [
              {
                point: 'Assuming mechanical energy is conserved when friction is present',
                why: 'The phrase "energy is always conserved" is true of TOTAL energy but not of the mechanical energy the usual equations track. Friction moves energy into heat, so KE + PE at the start no longer equals KE + PE at the end, and the discrepancy is the work done against friction.',
              },
            ],
            workedExamples: [
              'A 2.0 kg ball dropped from 5.0 m has PE = mgh = 2.0 * 9.8 * 5.0 = 98 J at the top and no kinetic energy. Just before impact all 98 J is kinetic, so v = sqrt(2 * 98 / 2.0) = 9.9 m/s, independent of mass in the final expression.',
            ],
            aliases: ['energy conservation', 'kinetic and potential energy', 'mechanical energy', 'ke plus pe'],
          },
          {
            id: 'centripetal-force',
            label: 'Centripetal Force',
            definition:
              'An object moving on a circular path accelerates toward the centre with a = v^2 / r, so a net inward force of mv^2 / r is required. Centripetal force is a ROLE played by a real force such as tension, gravity, or friction, not an extra force of its own.',
            misconceptions: [
              {
                point: 'Adding centripetal force as a separate arrow on the diagram',
                why: 'The name sounds like a distinct force in the way gravity and tension are, so it gets drawn alongside them. It is a role filled by forces already present, and adding it double-counts the inward pull, typically doubling the computed acceleration.',
              },
              {
                point: 'Invoking centrifugal force to explain the outward push',
                why: 'The outward feeling in a turning car is real to the passenger, which makes an outward force seem obvious. In the ground frame no such force exists; the sensation is inertia carrying the body straight while the car turns beneath it.',
              },
            ],
            workedExamples: [
              'A 0.50 kg ball on a 1.2 m string swings at 3.0 m/s. Required centripetal force is mv^2 / r = 0.50 * 9.0 / 1.2 = 3.75 N, and that force IS the string tension \u2014 nothing new is added to the diagram.',
            ],
            aliases: ['circular motion force', 'centripetal acceleration', 'force toward the center', 'v squared over r'],
          },
        ],
      },
      { id: 'ap-physics-2', label: 'AP Physics 2' },
      { id: 'ap-physics-c-mech', label: 'AP Physics C: Mechanics' },
      { id: 'ap-physics-c-em', label: 'AP Physics C: E&M' },
      { id: 'ap-environmental', label: 'AP Environmental Science' },
      { id: 'ib-biology', label: 'IB Biology' },
      { id: 'ib-chemistry', label: 'IB Chemistry' },
      { id: 'ib-physics', label: 'IB Physics' },
    ],
    college: [
      { id: 'general-chemistry', label: 'General Chemistry' },
      { id: 'general-physics', label: 'General Physics' },
      { id: 'organic-chemistry', label: 'Organic Chemistry' },
      { id: 'intro-biology', label: 'Intro Biology' },
      { id: 'biochemistry', label: 'Biochemistry' },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ENGLISH LANGUAGE ARTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ela: {
    'k-2': [
      { id: 'phonics-reading', label: 'Phonics & Reading' },
      { id: 'sight-words', label: 'Sight Words' },
      { id: 'basic-writing', label: 'Basic Writing' },
      { id: 'vocabulary-building', label: 'Vocabulary Building' },
      { id: 'listening-comprehension', label: 'Listening & Comprehension' },
    ],
    '3-5': [
      { id: 'reading-comprehension', label: 'Reading Comprehension' },
      { id: 'grammar-punctuation', label: 'Grammar & Punctuation' },
      { id: 'paragraph-writing', label: 'Paragraph Writing' },
      { id: 'vocabulary', label: 'Vocabulary' },
      { id: 'spelling', label: 'Spelling' },
      { id: 'book-reports', label: 'Book Reports' },
    ],
    '6-8': [
      { id: 'literary-analysis', label: 'Literary Analysis' },
      { id: 'essay-writing', label: 'Essay Writing' },
      { id: 'grammar-mechanics', label: 'Grammar & Mechanics' },
      { id: 'vocabulary-context', label: 'Vocabulary in Context' },
      { id: 'poetry', label: 'Poetry' },
      { id: 'narrative-writing', label: 'Narrative Writing' },
      { id: 'research-skills', label: 'Research Skills' },
      { id: 'grade-7-ela', label: 'Grade 7 English Language Arts' },
      { id: 'grade-6-ela', label: 'Grade 6 English Language Arts' },
      { id: 'grade-8-ela', label: 'Grade 8 English Language Arts' },
    ],
    '9-10': [
      { id: 'literature-fiction', label: 'Literature (Fiction)' },
      { id: 'literature-nonfiction', label: 'Literature (Nonfiction)' },
      { id: 'persuasive-writing', label: 'Persuasive Writing' },
      { id: 'research-papers', label: 'Research Papers' },
      { id: 'rhetoric-argument', label: 'Rhetoric & Argument' },
      { id: 'vocabulary-sat', label: 'Vocabulary (SAT-level)' },
      { id: 'hs-english', label: 'HS English' },
    ],
    '11-12': [
      { id: 'american-literature', label: 'American Literature' },
      { id: 'british-literature', label: 'British Literature' },
      { id: 'world-literature', label: 'World Literature' },
      { id: 'advanced-composition', label: 'Advanced Composition' },
      { id: 'critical-analysis', label: 'Critical Analysis' },
      { id: 'college-essays', label: 'College Application Essays' },
    ],
    ap: [
      { id: 'ap-english-lang', label: 'AP English Language & Composition' },
      { id: 'ap-english-lit', label: 'AP English Literature & Composition' },
      { id: 'ib-english-a', label: 'IB English A' },
    ],
    college: [
      { id: 'college-writing', label: 'College Writing' },
      { id: 'intro-literature', label: 'Intro to Literature' },
      { id: 'academic-research', label: 'Academic Research & Citation' },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SOCIAL STUDIES & HISTORY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'social-studies': {
    'k-2': [
      { id: 'community-helpers', label: 'Community & Helpers' },
      { id: 'maps-globes', label: 'Maps & Globes' },
      { id: 'holidays-traditions', label: 'Holidays & Traditions' },
      { id: 'rules-citizenship', label: 'Rules & Citizenship' },
    ],
    '3-5': [
      { id: 'us-geography', label: 'US Geography' },
      { id: 'early-american-history', label: 'Early American History' },
      { id: 'world-cultures', label: 'World Cultures' },
      { id: 'government-basics', label: 'Government Basics' },
      { id: 'economics-basics', label: 'Economics Basics' },
      { id: 'native-americans', label: 'Native Americans' },
    ],
    '6-8': [
      { id: 'ancient-civilizations', label: 'Ancient Civilizations' },
      { id: 'us-history-to-1877', label: 'US History (to 1877)' },
      { id: 'us-history-1877-present', label: 'US History (1877–Present)' },
      { id: 'world-geography', label: 'World Geography' },
      { id: 'civics-government', label: 'Civics & Government' },
      { id: 'economics-ms', label: 'Economics' },
      { id: 'grade-7-world-geography', label: 'Grade 7 World Geography' },
      { id: 'grade-6-world-geography', label: 'Grade 6 World Geography' },
      { id: 'grade-8-world-geography', label: 'Grade 8 World Geography' },
    ],
    '9-10': [
      { id: 'world-history', label: 'World History' },
      { id: 'us-history', label: 'US History' },
      { id: 'government-politics', label: 'Government & Politics' },
      { id: 'economics', label: 'Economics' },
      { id: 'geography', label: 'Geography' },
    ],
    '11-12': [
      { id: 'us-history-advanced', label: 'US History (Advanced)' },
      { id: 'world-history', label: 'World History' },
      { id: 'european-history', label: 'European History' },
      { id: 'economics', label: 'Economics' },
      { id: 'government-politics', label: 'Government & Politics' },
      { id: 'psychology', label: 'Psychology' },
      { id: 'sociology', label: 'Sociology' },
      { id: 'philosophy', label: 'Philosophy' },
    ],
    ap: [
      { id: 'ap-us-history', label: 'AP US History' },
      { id: 'ap-world-history', label: 'AP World History' },
      { id: 'ap-european-history', label: 'AP European History' },
      { id: 'ap-government', label: 'AP Government & Politics' },
      { id: 'ap-macroeconomics', label: 'AP Macroeconomics' },
      { id: 'ap-microeconomics', label: 'AP Microeconomics' },
      { id: 'ap-psychology', label: 'AP Psychology' },
      { id: 'ap-human-geography', label: 'AP Human Geography' },
      { id: 'ap-research', label: 'AP Research (Capstone)' },
      { id: 'ib-history', label: 'IB History' },
    ],
    college: [
      { id: 'western-civilization', label: 'Western Civilization' },
      { id: 'american-government', label: 'American Government' },
      { id: 'intro-psychology', label: 'Intro Psychology' },
      { id: 'intro-economics', label: 'Intro Economics' },
      { id: 'intro-sociology', label: 'Intro Sociology' },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COMPUTER SCIENCE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  cs: {
    '6-8': [
      { id: 'intro-coding', label: 'Intro to Coding' },
      { id: 'scratch-block', label: 'Scratch & Block Programming' },
      { id: 'web-basics', label: 'Web Basics (HTML/CSS)' },
      { id: 'digital-literacy', label: 'Digital Literacy' },
    ],
    '9-10': [
      { id: 'intro-python', label: 'Intro to Programming (Python)' },
      { id: 'web-development', label: 'Web Development' },
      { id: 'data-databases', label: 'Data & Databases' },
      { id: 'cybersecurity', label: 'Cybersecurity Basics' },
    ],
    '11-12': [
      { id: 'data-structures', label: 'Data Structures & Algorithms' },
      { id: 'oop', label: 'Object-Oriented Programming' },
      { id: 'mobile-development', label: 'Mobile App Development' },
    ],
    ap: [
      { id: 'ap-cs-a', label: 'AP Computer Science A (Java)' },
      { id: 'ap-cs-principles', label: 'AP Computer Science Principles' },
      { id: 'ib-cs', label: 'IB Computer Science' },
    ],
    college: [
      { id: 'cs101', label: 'CS101 (Python/Java)' },
      { id: 'college-data-structures', label: 'Data Structures' },
      { id: 'algorithms', label: 'Algorithms' },
      { id: 'discrete-math-cs', label: 'Discrete Mathematics' },
      { id: 'intro-ai', label: 'Intro to AI' },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WORLD LANGUAGES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  languages: {
    '3-5': [
      { id: 'spanish-beginner', label: 'Spanish (Beginner)' },
      { id: 'french-beginner', label: 'French (Beginner)' },
      { id: 'mandarin-beginner', label: 'Mandarin (Beginner)' },
    ],
    '6-8': [
      { id: 'spanish-1', label: 'Spanish I' },
      { id: 'spanish-2', label: 'Spanish II' },
      { id: 'french-1', label: 'French I' },
      { id: 'french-2', label: 'French II' },
      { id: 'mandarin-1', label: 'Mandarin I' },
    ],
    '9-10': [
      { id: 'spanish-1-3', label: 'Spanish I–III' },
      { id: 'french-1-3', label: 'French I–III' },
      { id: 'mandarin-1-2', label: 'Mandarin I–II' },
      { id: 'german-1-2', label: 'German I–II' },
      { id: 'japanese-1-2', label: 'Japanese I–II' },
    ],
    '11-12': [
      { id: 'spanish-4-plus', label: 'Spanish IV+' },
      { id: 'french-4-plus', label: 'French IV+' },
      { id: 'mandarin-3-plus', label: 'Mandarin III+' },
    ],
    ap: [
      { id: 'ap-spanish-lang', label: 'AP Spanish Language' },
      { id: 'ap-spanish-lit', label: 'AP Spanish Literature' },
      { id: 'ap-french-lang', label: 'AP French Language' },
      { id: 'ap-chinese-lang', label: 'AP Chinese Language' },
      { id: 'ib-spanish', label: 'IB Spanish' },
      { id: 'ib-french', label: 'IB French' },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ARTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  arts: {
    '11-12': [
      { id: 'music-theory', label: 'Music Theory' },
      { id: 'art-history', label: 'Art History' },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST PREP (standalone)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'test-prep': {
    'sat-act': [
      { id: 'digital-sat', label: 'Digital SAT (full course)' },
      { id: 'act', label: 'ACT (full course)' },
      { id: 'sat-strategy', label: 'Digital SAT Strategy & Format' },
      { id: 'sat-math', label: 'SAT Math' },
      { id: 'sat-reading-writing', label: 'SAT Reading & Writing' },
      { id: 'act-math', label: 'ACT Math' },
      { id: 'act-english', label: 'ACT English' },
      { id: 'act-reading', label: 'ACT Reading' },
      { id: 'act-science', label: 'ACT Science' },
      { id: 'ssat-isee', label: 'SSAT / ISEE' },
    ],
    ap: [
      { id: 'ap-test-strategy', label: 'AP Exam Strategy' },
    ],
    iitjee: [
      { id: 'jee-main', label: 'JEE Main' },
      { id: 'jee-advanced', label: 'JEE Advanced' },
      { id: 'jee-physics', label: 'JEE Physics' },
      { id: 'jee-chemistry', label: 'JEE Chemistry' },
      { id: 'jee-math', label: 'JEE Math' },
    ],
    'medical-entrance': [
      { id: 'neet-ug', label: 'NEET UG' },
      { id: 'neet-biology', label: 'NEET Biology' },
      { id: 'neet-physics', label: 'NEET Physics' },
      { id: 'neet-chemistry', label: 'NEET Chemistry' },
    ],
    graduate: [
      { id: 'gre-quant', label: 'GRE Quant' },
      { id: 'gre-verbal', label: 'GRE Verbal' },
      { id: 'gre-aw', label: 'GRE Analytical Writing' },
      { id: 'gre-math-subject', label: 'GRE Math Subject Test' },
      { id: 'gre-physics-subject', label: 'GRE Physics Subject Test' },
      { id: 'gmat-quant', label: 'GMAT Quant' },
      { id: 'gmat-verbal', label: 'GMAT Verbal' },
      { id: 'lsat', label: 'LSAT' },
      { id: 'mcat', label: 'MCAT' },
      { id: 'mcat-chem-phys', label: 'MCAT Chem/Phys' },
      { id: 'mcat-bio-biochem', label: 'MCAT Bio/Biochem' },
      { id: 'mcat-psych-soc', label: 'MCAT Psych/Soc' },
      { id: 'mcat-cars', label: 'MCAT CARS' },
    ],
    nursing: [
      { id: 'nclex-rn', label: 'NCLEX-RN' },
      { id: 'nclex-pn', label: 'NCLEX-PN' },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROFESSIONAL CERTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  professional: {
    college: [
      { id: 'cphq', label: 'CPHQ (Healthcare Quality)', brainGen: 'live' },
      // Demo alias: second white-label ingestion of the same NAHQ outline
      // (client demo runs a fresh CPHQ2 build alongside the seeded CPHQ).
      { id: 'cphq2', label: 'CPHQ (Healthcare Quality) II', brainGen: 'live' },
    ],
  },
};

// ── Lookup helpers ──

/** Get available levels for a given subject */
export function getLevelsForSubject(subjectId: string): TutorLevel[] {
  const subjectMap = TOPIC_MAP[subjectId];
  if (!subjectMap) return [];
  return LEVELS.filter((l) => l.id in subjectMap);
}

/** Get available topics for a given subject + level */
export function getTopicsForSubjectLevel(subjectId: string, levelId: string): TutorTopic[] {
  return TOPIC_MAP[subjectId]?.[levelId] ?? [];
}

/** Get display label for a subject ID */
export function getSubjectLabel(subjectId: string): string {
  return SUBJECTS.find((s) => s.id === subjectId)?.label ?? subjectId;
}

/** Get display label for a level ID */
export function getLevelLabel(levelId: string): string {
  return LEVELS.find((l) => l.id === levelId)?.label ?? levelId;
}

/** Get display label for a topic ID within a subject + level */
export function getTopicLabel(subjectId: string, levelId: string, topicId: string): string {
  const topics = getTopicsForSubjectLevel(subjectId, levelId);
  return topics.find((t) => t.id === topicId)?.label ?? topicId;
}

/** Find a topic by id across all subject/level cells. Topic ids are
 *  globally unique by convention; first hit wins. Returns undefined
 *  if not found. Used by adaptive-pacing pipeline to read brainGen
 *  + bankCoverage fields. */
export function getTopicById(topicId: string): TutorTopic | undefined {
  for (const subjectMap of Object.values(TOPIC_MAP)) {
    for (const topicList of Object.values(subjectMap)) {
      const hit = topicList.find((t) => t.id === topicId);
      if (hit) return hit;
    }
  }
  return undefined;
}

/** Build a display name for a session, e.g. "AP Physics 1" */
export function buildDisplayName(subjectId: string, levelId: string, topicId: string): string {
  const topicLabel = getTopicLabel(subjectId, levelId, topicId);
  const levelLabel = getLevelLabel(levelId);
  // For AP/IB topics, the topic label already includes the prefix
  if (topicLabel.startsWith('AP ') || topicLabel.startsWith('IB ') || topicLabel.startsWith('SAT ') || topicLabel.startsWith('ACT ')) {
    return topicLabel;
  }
  return `${topicLabel} (${levelLabel})`;
}
