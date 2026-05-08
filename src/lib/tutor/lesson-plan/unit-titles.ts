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
  // Add additional courses as they ship per project_ap_plans_initiative.md:
  //   'ap-calculus-bc': { '1': 'Limits and Continuity', ... }
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
