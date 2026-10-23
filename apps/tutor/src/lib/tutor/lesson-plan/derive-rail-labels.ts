/**
 * Cache-through Haiku derivation of segment content labels for the agenda
 * rail. Curated plans have no authored labels, so on cache-miss this calls
 * Haiku once per plan (persisted forever under `${planId}::${railLabelsCacheVersion()}`
 * — see LessonPlanRailLabels.ts) and returns null (falling back to stage
 * labels) for atomic lessons or any failure along the way.
 */
import Anthropic from '@anthropic-ai/sdk';
import { getModelClient, resolveModel } from '../ai/model-registry';
import { plangenFastParams } from './plangen-fast';
import { connectDB } from '@core/db';
import { LessonPlanRailLabelsModel, buildRailLabelsId } from '@/models/LessonPlanRailLabels';
import { buildLabelPrompt, parseLabelResponse, RAIL_LABELS_VERSION, type SegmentLabels } from './rail-labels';
import type { LessonPlan } from './types';

/** A bare string (test fakes, legacy) is treated as a complete reply; the
 *  real call returns the stop reason too so a cut-off reply is not cached. */
export type CompleteResult = string | { text: string; stopReason: string | null };
export type CompleteFn = (prompt: string) => Promise<CompleteResult>;

const HAIKU_MODEL_ID = resolveModel('plangen-fast').model;
// Lazy so tsx test scripts can dotenv before first use (see material-extract.ts:97-100).
function getClient(): Anthropic {
  return getModelClient('plangen-fast').client;
}

/** The real model call (exported for the request-shape test). */
export const realComplete: CompleteFn = async (prompt) => {
  const res = await getClient().messages.create(
    {
      model: HAIKU_MODEL_ID,
      ...plangenFastParams(400, 0.1, { model: HAIKU_MODEL_ID }), // Haiku 5.5: no temperature, effort low (plangen-fast.ts)
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    },
    { timeout: 8000, maxRetries: 0 },
  );
  return {
    text: res.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join(''),
    stopReason: res.stop_reason ?? null,
  };
};

/**
 * Cache version for the labels row. Haiku 4.5 keeps the bare
 * RAIL_LABELS_VERSION (rows cached before 2026-10-23 stay valid); any other
 * model appends its id — same rule as generation-cache.ts topicCacheKey — so
 * a model switch, or a rollback to 4.5, re-derives instead of reading the
 * other model's rows. Pure.
 */
export function railLabelsCacheVersion(model: string = HAIKU_MODEL_ID): string {
  return /haiku-4-5/.test(model) ? RAIL_LABELS_VERSION : `${RAIL_LABELS_VERSION}|${model.trim().toLowerCase()}`;
}

/**
 * What to do with one model reply. An empty reply, or one that did not end
 * on 'end_turn' (max_tokens cut, refusal, …), is NOT a verdict: return null
 * and write nothing, so it is never persisted as a permanent atomic:true.
 * Otherwise the parsed labels, and null (atomic / unparseable) is persisted. Pure.
 */
export function railLabelsVerdict(
  result: CompleteResult,
  plan: LessonPlan,
): { labels: SegmentLabels | null; persist: boolean } {
  const text = typeof result === 'string' ? result : result.text;
  const stop = typeof result === 'string' ? 'end_turn' : result.stopReason;
  if (stop !== 'end_turn' || !text.trim()) return { labels: null, persist: false };
  return { labels: parseLabelResponse(text, plan), persist: true };
}

/** Storage seam (tests inject an in-memory store; production uses Mongo). */
export interface RailLabelsStore {
  find(id: string): Promise<{ atomic?: boolean; labels?: unknown } | null>;
  create(row: { _id: string; planId: string; labels: SegmentLabels; atomic: boolean }): Promise<unknown>;
}
const mongoStore: RailLabelsStore = {
  async find(id) {
    await connectDB();
    return LessonPlanRailLabelsModel.findById(id).lean();
  },
  async create(row) {
    await connectDB();
    return LessonPlanRailLabelsModel.create(row);
  },
};

/** Cache-through label derivation. Every failure path returns null (rail falls back to stage labels). */
export async function deriveSegmentLabels(
  plan: LessonPlan,
  complete: CompleteFn = realComplete,
  store: RailLabelsStore = mongoStore,
): Promise<SegmentLabels | null> {
  const id = buildRailLabelsId(plan.id, railLabelsCacheVersion());
  try {
    const cached = await store.find(id);
    if (cached) return cached.atomic ? null : (cached.labels as SegmentLabels);
    const { labels, persist } = railLabelsVerdict(await complete(buildLabelPrompt(plan)), plan);
    if (!persist) return null;
    await store.create({
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
