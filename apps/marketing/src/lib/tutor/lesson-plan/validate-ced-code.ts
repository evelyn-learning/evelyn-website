/**
 * AP-Statistics CED-code validation.
 *
 * Policy (locked 2026-06-26): `los[].standard` is a REQUIRED, validated
 * companion CED reference on every AP-Stats plan LO. The accepted form is the
 * CED topic-reference style already used across the 48 existing plans:
 *
 *   - single topic   `AP-STATS-1.10`
 *   - topic range    `AP-STATS-1.1-1.4`   (a plan spanning several CED topics)
 *   - FRQ marker     `AP-STATS-1-FRQ`     (a unit FRQ-practice plan)
 *
 * Generated AP-Stats content (bank items, FRQs) is tagged at the MOST SPECIFIC
 * topic level — a single `AP-STATS-<unit>.<topic>` code, never a range — for
 * which `isSingleTopicApStatsCed` is the lint.
 *
 * Skill-code granularity (e.g. `VAR-1.A`) is deliberately NOT used; if it is
 * ever needed it will be added as an additive optional `cedSkillCode` field.
 */

import type { LessonPlan } from './types';

/** Accepts the three CED-reference shapes used by AP-Stats plan LOs. */
export const AP_STATS_CED_REGEX = /^AP-STATS-(?:\d+\.\d+(?:-\d+\.\d+)?|\d+-FRQ)$/;

/** Accepts ONLY a single topic code (for tagging generated content). */
export const AP_STATS_SINGLE_TOPIC_REGEX = /^AP-STATS-\d+\.\d+$/;

export function isValidApStatsCedCode(code: string | undefined | null): boolean {
  return typeof code === 'string' && AP_STATS_CED_REGEX.test(code);
}

/** True only for a single-topic code (not a range, not an FRQ marker). */
export function isSingleTopicApStatsCed(code: string | undefined | null): boolean {
  return typeof code === 'string' && AP_STATS_SINGLE_TOPIC_REGEX.test(code);
}

export interface CedValidationResult {
  ok: boolean;
  errors: string[];
}

/**
 * Validate that every LO of an AP-Stats plan carries a present, well-formed
 * `standard` (CED code). Pure; no I/O.
 */
export function validateApStatsPlanLOs(plan: LessonPlan): CedValidationResult {
  const errors: string[] = [];
  if (!plan.los || plan.los.length === 0) {
    errors.push(`plan ${plan.id}: no LOs`);
    return { ok: false, errors };
  }
  for (const lo of plan.los) {
    if (!lo.standard || !lo.standard.trim()) {
      errors.push(`plan ${plan.id}, LO ${lo.id}: missing standard (CED code)`);
    } else if (!isValidApStatsCedCode(lo.standard)) {
      errors.push(`plan ${plan.id}, LO ${lo.id}: malformed CED code "${lo.standard}"`);
    }
  }
  return { ok: errors.length === 0, errors };
}
