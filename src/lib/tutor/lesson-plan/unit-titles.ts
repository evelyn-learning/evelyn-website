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
