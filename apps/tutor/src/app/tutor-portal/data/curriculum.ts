export interface Subject {
  id: string;
  name: string;
  gradeRange: string;
  exampleTopics: string;
}

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', gradeRange: 'K through College', exampleTopics: 'Counting, fractions, algebra, geometry, trigonometry, calculus, linear algebra, discrete math' },
  { id: 'science', name: 'Science', gradeRange: 'K through College', exampleTopics: 'Forces & motion, energy, waves, electricity, chemistry (basic to organic), biology, earth & space' },
  { id: 'ela', name: 'English Language Arts', gradeRange: 'K through College', exampleTopics: 'Reading comprehension, grammar, writing, vocabulary' },
  { id: 'social-studies', name: 'Social Studies & History', gradeRange: 'K through College', exampleTopics: 'World history, geography, civics' },
  { id: 'cs', name: 'Computer Science', gradeRange: 'Grades 9 through College', exampleTopics: 'Programming fundamentals, data structures, algorithms' },
  { id: 'world-languages', name: 'World Languages', gradeRange: 'Grades 9 through College', exampleTopics: 'Language instruction and practice' },
  { id: 'test-prep', name: 'Test Prep', gradeRange: 'SAT / ACT', exampleTopics: 'Standardized test preparation' },
];

export const gradeLevels = [
  'K-2', '3-5', '6-8', '9-10', '11-12', 'AP/IB', 'SAT/ACT', 'College Intro',
] as const;

export interface SupportedCurriculum {
  region: string;
  curricula: string;
}

export const supportedCurricula: SupportedCurriculum[] = [
  { region: 'Algeria', curricula: 'BAC (Baccalauréat)' },
  { region: 'Brazil', curricula: 'ENEM, Vestibular' },
  { region: 'Egypt', curricula: 'Thanaweya Amma' },
  { region: 'France', curricula: 'Baccalauréat Général, BTS' },
  { region: 'Germany', curricula: 'Abitur' },
  { region: 'Gulf States (UAE, KSA, Qatar)', curricula: 'National MOE curricula, EmSAT' },
  { region: 'India', curricula: 'CBSE, ICSE, JEE, NEET' },
  { region: 'Morocco', curricula: 'Baccalauréat Marocain' },
  { region: 'Nigeria', curricula: 'WAEC, NECO, JAMB' },
  { region: 'Pakistan', curricula: 'FSc, MDCAT, ECAT' },
  { region: 'South Korea', curricula: 'CSAT (Suneung)' },
  { region: 'Southeast Asia', curricula: 'SPM (Malaysia), O/A Levels (Singapore)' },
  { region: 'Turkey', curricula: 'YKS (TYT/AYT)' },
  { region: 'United Kingdom', curricula: 'GCSE, A-Levels, Scottish Highers' },
  { region: 'United States', curricula: 'Common Core, AP, SAT/ACT' },
];

/**
 * Lesson plans in the catalogue, as a floor for "N+" on the pages (2026-11-24: was `topicCount = 200`, while
 * the catalogue held over two thousand plans and another page said "1,000+").
 *
 * Counted 2026-11-24: SEED_PLANS in src/lib/tutor/lesson-plan/store.ts holds 2,172 plans whose title does not
 * start with "[TEST]" (2,195 with the test plans). A constant, not an import: importing the store would put
 * every plan into the portal home's bundle. scripts/test-portal-seo.ts fails if the catalogue ever holds fewer
 * plans than this.
 */
export const lessonPlanCountFloor = 2100;
export const subjectCount = subjects.length;
