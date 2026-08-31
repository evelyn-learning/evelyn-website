/**
 * Cache-through Haiku derivation of segment content labels for the agenda
 * rail. Curated plans have no authored labels, so on cache-miss this calls
 * Haiku once per plan (persisted forever under `${planId}::${RAIL_LABELS_VERSION}`
 * — see LessonPlanRailLabels.ts) and returns null (falling back to stage
 * labels) for atomic lessons or any failure along the way.
 */
import Anthropic from '@anthropic-ai/sdk';
import { getModelClient, resolveModel } from '../ai/model-registry';
import { connectDB } from '@core/db';
import { LessonPlanRailLabelsModel, buildRailLabelsId } from '@/models/LessonPlanRailLabels';
import { buildLabelPrompt, parseLabelResponse, RAIL_LABELS_VERSION, type SegmentLabels } from './rail-labels';
import type { LessonPlan } from './types';

export type CompleteFn = (prompt: string) => Promise<string>;

const HAIKU_MODEL_ID = resolveModel('plangen-fast').model;
// Lazy so tsx test scripts can dotenv before first use (see material-extract.ts:97-100).
function getClient(): Anthropic {
  return getModelClient('plangen-fast').client;
}

const realComplete: CompleteFn = async (prompt) => {
  const res = await getClient().messages.create(
    {
      model: HAIKU_MODEL_ID,
      max_tokens: 400,
      temperature: 0.1,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    },
    { timeout: 8000, maxRetries: 0 },
  );
  return res.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('');
};

/** Cache-through label derivation. Every failure path returns null (rail falls back to stage labels). */
export async function deriveSegmentLabels(
  plan: LessonPlan,
  complete: CompleteFn = realComplete,
): Promise<SegmentLabels | null> {
  const id = buildRailLabelsId(plan.id, RAIL_LABELS_VERSION);
  try {
    await connectDB();
    const cached = await LessonPlanRailLabelsModel.findById(id).lean();
    if (cached) return cached.atomic ? null : (cached.labels as SegmentLabels);
    const raw = await complete(buildLabelPrompt(plan));
    const labels = parseLabelResponse(raw, plan);
    await LessonPlanRailLabelsModel.create({
      _id: id,
      planId: plan.id,
      labels: labels ?? {},
      atomic: labels === null,
    });
    return labels;
  } catch {
    return null;
  }
}
