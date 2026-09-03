/**
 * Unit titles for grouped catalog rendering.
 *
 * The setup-picker dropdown (and any other catalog UI) groups plans by
 * their CED unit, with a header like "UNIT 1 — BASIC ECONOMIC CONCEPTS".
 * The unit number lives on each plan as `metadata.cedUnit`; the title
 * mapping lives here.
 *
 * Keyed by the plan's `topic` field (e.g. 'ap-macroeconomics'). When a
 * topic is added (or a partner course is ingested), append a unit-title
 * map here. When a plan has no `cedUnit` (or its topic isn't mapped),
 * the renderer falls back to flat or topic-grouped display.
 */

export const UNIT_TITLES: Record<string, Record<string, string>> = {
  'ap-macroeconomics': {
    '1': 'Basic Economic Concepts',
    '2': 'Economic Indicators and the Business Cycle',
    '3': 'National Income and Price Determination',
    '4': 'Financial Sector',
    '5': 'Long-Run Consequences of Stabilization Policies',
    '6': 'Open Economy — International Trade and Finance',
  },
  'ap-calculus-bc': {
    '1': 'Limits and Continuity',
    '2': 'Differentiation: Definition and Fundamental Properties',
    '3': 'Differentiation: Composite, Implicit, and Inverse Functions',
    '4': 'Contextual Applications of Differentiation',
    '5': 'Analytical Applications of Differentiation',
    '6': 'Integration and Accumulation of Change',
    '7': 'Differential Equations',
    '8': 'Applications of Integration',
    '9': 'Parametric Equations, Polar Coordinates, and Vector-Valued Functions',
    '10': 'Infinite Sequences and Series',
  },
  'digital-sat': {
    '1': 'Math — Algebra',
    '2': 'Math — Advanced Math',
    '3': 'Math — Problem-Solving and Data Analysis',
    '4': 'Math — Geometry and Trigonometry',
    '5': 'Reading & Writing — Information and Ideas',
    '6': 'Reading & Writing — Craft and Structure',
    '7': 'Reading & Writing — Expression of Ideas',
    '8': 'Reading & Writing — Standard English Conventions',
  },
  act: {
    '1': 'English',
    '2': 'Math',
    '3': 'Reading',
    '4': 'Science',
  },
  'algebra-1': {
    '1': 'Foundations & Expressions',
    '2': 'Linear Equations',
    '3': 'Linear Inequalities',
    '4': 'Linear Functions & Graphs',
    '5': 'Systems of Equations & Inequalities',
    '6': 'Exponents & Exponential Functions',
    '7': 'Polynomials & Factoring',
    '8': 'Quadratic Functions & Equations',
    '9': 'Radicals & Rational Expressions',
    '10': 'Data & Sequences',
  },
  'grade-6-math': {
    '1': 'Understanding Ratios & Rates',
    '2': 'Percent & Measurement Conversion',
    '3': 'Dividing Fractions',
    '4': 'Multi-Digit & Decimal Operations',
    '5': 'Negative Numbers & Absolute Value',
    '6': 'The Coordinate Plane',
    '7': 'Expressions & Exponents',
    '8': 'Equations, Inequalities & Relationships',
    '9': 'Area, Surface Area & Volume',
    '10': 'Statistics: Distributions, Center & Spread',
  },
  'grade-7-math': {
    '1': 'Rational Numbers',
    '2': 'Operations with Rational Numbers',
    '3': 'Ratios & Proportional Relationships',
    '4': 'Percent & Applications',
    '5': 'Algebraic Expressions',
    '6': 'Equations & Inequalities',
    '7': 'Geometry: Angles & Figures',
    '8': 'Area, Surface Area & Volume',
    '9': 'Statistics & Sampling',
    '10': 'Probability',
  },
  'grade-7-ela': {
    '1': 'Reading Literature: Plot & Character',
    '2': 'Theme, Point of View & Figurative Language',
    '3': 'Reading Informational Texts',
    '4': "Central Idea, Structure & Author's Purpose",
    '5': 'Grammar & Usage',
    '6': 'Sentence Structure & Punctuation',
    '7': 'Vocabulary in Context & Word Study',
    '8': 'Argument Writing',
    '9': 'Informative & Narrative Writing',
    '10': 'Research & Citation',
  },
  'grade-7-life-science': {
    '1': 'Characteristics of Life & Scientific Investigation',
    '2': 'Cells & Cell Processes',
    '3': 'Body Organization & Human Systems',
    '4': 'Photosynthesis & Cellular Respiration',
    '5': 'Growth, Development & Reproduction',
    '6': 'Heredity & Genetics',
    '7': 'Natural Selection & Evolution',
    '8': 'Classification & Diversity of Life',
    '9': 'Ecosystems: Matter & Energy',
    '10': 'Ecosystem Dynamics & Human Impact',
  },
  'grade-7-world-geography': {
    '1': 'Geography Tools: Maps, Globes & Regions',
    '2': 'Physical Geography: Landforms, Climate & Biomes',
    '3': 'Human Geography: Population & Migration',
    '4': 'Culture, Language & Religion',
    '5': 'Economics & Development',
    '6': 'Government & Citizenship in a Global World',
    '7': 'Latin America',
    '8': 'Europe & Russia',
    '9': 'Africa & the Middle East',
    '10': 'Asia & Oceania',
  },
  'grade-6-ela': {
    '1': 'Reading Literature: Plot, Character & Structure',
    '2': 'Theme, Point of View & Figurative Language',
    '3': 'Reading Informational Texts: Central Idea & Text Features',
    '4': "Text Structure, Author's Purpose & Comparing Accounts",
    '5': 'Grammar: Pronoun Precision & Standard English',
    '6': 'Sentence Fluency, Style & Punctuation',
    '7': 'Vocabulary in Context & Word Study',
    '8': 'Argument Writing: Claims, Reasons & Evidence',
    '9': 'Informative & Narrative Writing',
    '10': 'Research & Citation',
  },
  'grade-6-earth-space-science': {
    '1': "Earth's Place in the Solar System",
    '2': 'The Earth-Sun-Moon System',
    '3': 'Minerals, Rocks & the Rock Cycle',
    '4': 'Plate Tectonics',
    '5': "Earth's History in the Rock Record",
    '6': 'Weather & the Atmosphere',
    '7': "Water on Earth & Earth's Systems Interacting",
    '8': "Climate & the Ocean's Role",
    '9': "Earth's Resources & Natural Hazards",
    '10': "Human Activity & Earth's Systems",
  },
  'grade-6-world-geography': {
    '1': 'Thinking Like a Geographer & Spatial Skills',
    '2': 'Reading & Using Maps',
    '3': "Earth's Physical Structure",
    '4': 'Landforms & Water on Earth',
    '5': 'Weather, Climate & Ecosystems',
    '6': 'Natural Resources & Human Adaptation',
    '7': 'Geographic Technology & Data Skills',
    '8': 'Place & Perception',
    '9': "The World's Regions: Names & Locations",
    '10': 'Applying Geography to the World Today',
  },
  'grade-8-math': {
    '1': 'Real Numbers: Rational, Irrational & Roots',
    '2': 'Integer Exponents & Scientific Notation',
    '3': 'Proportional Relationships & Slope',
    '4': 'Linear Equations in One Variable',
    '5': 'Systems of Linear Equations',
    '6': 'Functions & Volume',
    '7': 'Linear Functions as Models',
    '8': 'Transformations, Congruence & Similarity',
    '9': 'Angles & the Pythagorean Theorem',
    '10': 'Bivariate Data: Scatter Plots & Two-Way Tables',
  },
  'grade-8-ela': {
    '1': 'Reading Literature: Evidence, Dialogue & Structure',
    '2': 'Theme, Dramatic Irony & Allusion',
    '3': 'Reading Informational Texts: Central Idea, Connections & Paragraph Structure',
    '4': "Author's Response, Sound Reasoning & Conflicting Texts",
    '5': 'Grammar: Verbals, Voice & Mood',
    '6': 'Sentence Style & Punctuation: Shifts, Effects & Breaks',
    '7': 'Vocabulary in Context & Word Study',
    '8': 'Argument Writing: Distinguishing, Rebutting & Formal Style',
    '9': 'Informative & Narrative Writing',
    '10': 'Research & Citation',
  },
  'grade-8-physical-science': {
    '1': 'Describing Motion',
    '2': "Forces & Newton's Laws",
    '3': 'Gravity, Electric & Magnetic Forces, and Fields',
    '4': 'Energy: Kinetic, Potential & Conservation',
    '5': 'Thermal Energy & Heat',
    '6': 'The Particle Model of Matter',
    '7': 'Atoms, Elements & the Periodic Table',
    '8': 'Chemical Reactions',
    '9': 'Waves & Their Properties',
    '10': 'Light, Sound & Information',
  },
  'grade-8-world-geography': {
    '1': 'Geographic Data & Spatial Analysis',
    '2': 'GIS & Geospatial Reasoning',
    '3': 'North America: Physical Systems',
    '4': 'North America: People, Cities & Economy',
    '5': 'Population & Migration at Scale',
    '6': 'Resources, Energy & Sustainability',
    '7': 'Climate Risk, Hazards & Resilience',
    '8': 'Globalization, Trade Networks & Development',
    '9': 'Geopolitics, Borders & Cooperation',
    '10': 'Capstone: Geographic Decisions',
  },
  geometry: {
    '1': 'Foundations of Geometry',
    '2': 'Reasoning & Proof',
    '3': 'Parallel & Perpendicular Lines',
    '4': 'Transformations & Congruence',
    '5': 'Triangles',
    '6': 'Similarity',
    '7': 'Right Triangles & Trigonometry',
    '8': 'Quadrilaterals & Polygons',
    '9': 'Circles',
    '10': 'Area, Surface Area & Volume',
  },
  biology: {
    '1': 'Science of Life & Biochemistry',
    '2': 'Cells',
    '3': 'Cell Energy',
    '4': 'Cell Growth & Division',
    '5': 'Mendelian Genetics',
    '6': 'DNA & Biotechnology',
    '7': 'Evolution',
    '8': 'Classification & Diversity',
    '9': 'Ecology',
    '10': 'Human Body Systems',
  },
  chemistry: {
    '1': 'Matter & Measurement',
    '2': 'Atomic Structure',
    '3': 'The Periodic Table',
    '4': 'Bonding',
    '5': 'Reactions & Equations',
    '6': 'The Mole & Stoichiometry',
    '7': 'States of Matter & Gases',
    '8': 'Solutions',
    '9': 'Thermochemistry, Kinetics & Equilibrium',
    '10': 'Acids, Bases & Nuclear Chemistry',
  },
  'hs-english': {
    '1': 'Grammar & Usage',
    '2': 'Sentence Structure',
    '3': 'Punctuation',
    '4': 'Word Choice & Tone',
    '5': 'Rhetoric & Argument',
    '6': 'Reading Literature',
    '7': 'Reading Nonfiction',
    '8': 'Poetry & Figurative Language',
    '9': 'Writing Craft',
    '10': 'Research & Citation',
  },
  'world-history': {
    '1': 'Origins of Civilization',
    '2': 'Classical Empires & Belief Systems',
    '3': 'The Islamic World & East Asia',
    '4': 'Byzantium & Medieval Europe',
    '5': 'Africa & the Americas',
    '6': 'Renaissance, Reformation & Exploration',
    '7': 'Enlightenment & Revolutions',
    '8': 'Industry, Nationalism & Empire',
    '9': 'The World Wars',
    '10': 'The Cold War & Globalization',
  },
  // Add additional courses as they ship per project_ap_plans_initiative.md:
  //   'ap-statistics': { '1': 'Exploring One-Variable Data', ... }
  //   etc.
};

export interface PlanForGrouping {
  topic?: string;
  metadata?: { cedUnit?: unknown; cedTopic?: unknown; cedTitle?: unknown };
}

/** Group key for catalog rendering. AP-style plans group by cedUnit; the
 *  fallback is just the topic (so non-AP plans collapse to their topic). */
export function unitKey(plan: PlanForGrouping): string {
  const md = plan.metadata;
  if (md && typeof md.cedUnit === 'string' && md.cedUnit) return md.cedUnit;
  return plan.topic ?? '__';
}

/** Display label for the group header. AP-style plans render as
 *  "UNIT N — TITLE" when the title is mapped; otherwise just "UNIT N".
 *  Non-AP plans render as the kebab-cased topic with capitals. */
export function unitLabel(plan: PlanForGrouping, fallbackTopicLabel?: string): string {
  const md = plan.metadata;
  const cedUnit = md && typeof md.cedUnit === 'string' ? md.cedUnit : '';
  if (cedUnit && plan.topic) {
    const map = UNIT_TITLES[plan.topic];
    const title = map?.[cedUnit];
    if (title) return `UNIT ${cedUnit} — ${title.toUpperCase()}`;
    return `UNIT ${cedUnit}`;
  }
  if (fallbackTopicLabel) return fallbackTopicLabel.toUpperCase();
  if (plan.topic) return plan.topic.replace(/-/g, ' ').toUpperCase();
  return '';
}
