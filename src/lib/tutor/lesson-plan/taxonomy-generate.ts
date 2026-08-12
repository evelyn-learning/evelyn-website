/**
 * taxonomy-generate — outline materials → DraftTaxonomy (Phase D slice 1).
 * Stateless: extract text (reusing Phase-2 material-extract), one structured
 * LLM pass, normalize/validate. Nothing is persisted engine-side.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { DraftTaxonomy, TaxonomyGenerateRequest } from '@evelyn/portal-contract/v1';
import { DraftTaxonomySchema } from '@evelyn/portal-contract/v1';
import { extractMaterials, condenseForPipeline } from './material-extract';

export const TAXONOMY_MODEL_ID = process.env.TAXONOMY_MODEL || 'claude-sonnet-5';
const TAXONOMY_MAX_TOKENS = 8192;
const OUTLINE_TARGET_CHARS = 12_000;

export type TaxonomyDraftResult =
  | { ok: true; taxonomy: DraftTaxonomy; generatorOk: boolean }
  | { ok: false; status: 422; code: string; message: string };

const slug = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'x';

/** Coerce a raw LLM taxonomy into contract shape: slugify keys, rewrite loIds
 *  to `<topicKey>.<sectionKey>.<slug>`, remap prereq refs through the rewrite,
 *  drop dangling/self prereqs, normalize weights to sum 100, re-issue
 *  suggestedOrder 1..n. Returns null when the result can't satisfy the schema. */
export function normalizeRawTaxonomy(raw: unknown, topicKey: string): DraftTaxonomy | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as { title?: unknown; sections?: unknown; los?: unknown };
  if (typeof r.title !== 'string' || !Array.isArray(r.sections) || !Array.isArray(r.los)) return null;

  const sections = r.sections
    .filter((s): s is { key?: string; title?: string; weightPct?: number } => !!s && typeof s === 'object')
    .map((s) => ({ key: slug(String(s.key ?? s.title ?? '')), title: String(s.title ?? '').trim(), weightPct: Number(s.weightPct) || 0 }))
    .filter((s) => s.title);
  const totalW = sections.reduce((a, s) => a + s.weightPct, 0);
  for (const s of sections) s.weightPct = totalW > 0 ? Math.round((s.weightPct / totalW) * 1000) / 10 : Math.round(1000 / sections.length) / 10;

  const sectionKeys = new Set(sections.map((s) => s.key));
  const idMap = new Map<string, string>(); // raw loId → rewritten loId
  const los = r.los
    .filter((l): l is Record<string, unknown> => !!l && typeof l === 'object')
    .map((l) => {
      const sectionKey = slug(String(l.sectionKey ?? ''));
      const loId = `${topicKey}.${sectionKey}.${slug(String(l.title ?? l.loId ?? ''))}`;
      idMap.set(String(l.loId ?? ''), loId);
      return {
        loId, title: String(l.title ?? '').trim(),
        description: String(l.description ?? '').trim().slice(0, 1000),
        sectionKey,
        rawPrereqs: Array.isArray(l.prerequisiteLoIds) ? l.prerequisiteLoIds.map(String) : [],
        suggestedOrder: Number(l.suggestedOrder) || 0,
      };
    })
    .filter((l) => l.title && l.description && sectionKeys.has(l.sectionKey));

  const finalIds = new Set(los.map((l) => l.loId));
  const normalized = los.map((l, i) => ({
    loId: l.loId, title: l.title, description: l.description, sectionKey: l.sectionKey,
    prerequisiteLoIds: [...new Set(l.rawPrereqs.map((p) => idMap.get(p) ?? p))]
      .filter((p) => finalIds.has(p) && p !== l.loId).slice(0, 8),
    suggestedOrder: i + 1,
  }));

  const parsed = DraftTaxonomySchema.safeParse({ title: r.title.trim(), sections, los: normalized });
  return parsed.success ? parsed.data : null;
}

function stripFences(s: string): string {
  return s.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

const SYSTEM = `You convert a certification/exam CONTENT OUTLINE into a learning-objective graph for an adaptive tutor.
Return ONLY JSON: {"title": string, "sections": [{"key","title","weightPct"}], "los": [{"loId","title","description","sectionKey","prerequisiteLoIds","suggestedOrder"}]}.
Rules: sections mirror the outline's top-level domains and their published weights (percent). Each LO must be ONE teachable lesson objective (~30 min), not a whole domain — split broad outline tasks. 20-60 LOs total. description: 1-2 sentences of what the learner can do afterward. prerequisiteLoIds: only true hard prerequisites within this outline (sparse is correct). suggestedOrder: global teaching order.`;

export async function draftTaxonomyFromOutline(req: TaxonomyGenerateRequest): Promise<TaxonomyDraftResult> {
  const extracted = await extractMaterials(req.materials);
  if (!extracted.ok) return { ok: false, status: 422, code: extracted.code, message: extracted.message };

  const outlineText = extracted.combinedText.length > OUTLINE_TARGET_CHARS
    ? await condenseForPipeline(extracted.combinedText, { targetChars: OUTLINE_TARGET_CHARS })
    : extracted.combinedText;

  const topicKey = req.topicKey ?? slug(outlineText.slice(0, 80));
  const fallback: DraftTaxonomy = {
    title: topicKey.toUpperCase(),
    sections: [{ key: 'main', title: 'Outline', weightPct: 100 }],
    los: [{ loId: `${topicKey}.main.overview`, title: 'Overview', description: 'Placeholder — drafting failed.', sectionKey: 'main', prerequisiteLoIds: [], suggestedOrder: 1 }],
  };

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: TAXONOMY_MODEL_ID, max_tokens: TAXONOMY_MAX_TOKENS, system: SYSTEM,
      messages: [{ role: 'user', content: `OUTLINE:\n${outlineText}\n\nOPERATOR GUIDANCE:\n${req.guidance ?? '(none)'}` }],
    });
    const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    const taxonomy = normalizeRawTaxonomy(JSON.parse(stripFences(text)), topicKey);
    if (!taxonomy) return { ok: true, taxonomy: fallback, generatorOk: false };
    return { ok: true, taxonomy, generatorOk: true };
  } catch {
    return { ok: true, taxonomy: fallback, generatorOk: false };
  }
}
