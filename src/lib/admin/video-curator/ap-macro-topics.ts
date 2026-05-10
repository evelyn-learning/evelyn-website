/**
 * Derive the canonical AP Macro CED-topic list from the lesson-plan seeds.
 *
 * Source of truth: SEED_PLANS in `src/lib/tutor/lesson-plan/store.ts`. Each
 * AP Macro plan carries `metadata.{cedUnit,cedTopic,cedTitle}` populated by
 * the AP Plans Initiative. We filter for `topic === 'ap-macroeconomics'`,
 * skip FRQ-practice plans (they aren't single-concept), and surface the LO
 * + concept keyIdeas so the curator endpoint can brief the LLM richly.
 */

import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import type { LessonPlan, Segment } from '@/lib/tutor/lesson-plan/types';
import type { CedTopic } from './types';

function pickConceptKeyIdeas(plan: LessonPlan): string[] {
  const concept = plan.segments.find((s: Segment) => s.kind === 'concept');
  if (!concept || concept.kind !== 'concept') return [];
  return concept.keyIdeas ?? [];
}

export function listApMacroTopics(): CedTopic[] {
  const out: CedTopic[] = [];
  for (const plan of SEED_PLANS) {
    if (plan.topic !== 'ap-macroeconomics') continue;
    if (plan.id.includes('frq-practice')) continue;
    const md = plan.metadata as
      | { cedUnit?: string; cedTopic?: string; cedTitle?: string }
      | undefined;
    if (!md?.cedUnit || !md.cedTopic || !md.cedTitle) continue;
    const lo = plan.los[0];
    out.push({
      conceptId: `ap-macro-${md.cedTopic}`,
      cedUnit: md.cedUnit,
      cedTopic: md.cedTopic,
      cedTitle: md.cedTitle,
      planId: plan.id,
      planTitle: plan.title,
      loDescription: lo?.description ?? '',
      conceptKeyIdeas: pickConceptKeyIdeas(plan),
    });
  }
  out.sort((a, b) => {
    if (a.cedUnit !== b.cedUnit) return Number(a.cedUnit) - Number(b.cedUnit);
    return a.cedTopic.localeCompare(b.cedTopic, undefined, { numeric: true });
  });
  return out;
}

export function getApMacroTopic(conceptId: string): CedTopic | undefined {
  return listApMacroTopics().find((t) => t.conceptId === conceptId);
}
