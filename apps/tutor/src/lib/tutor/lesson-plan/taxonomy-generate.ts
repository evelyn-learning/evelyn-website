/**
 * taxonomy-generate — outline materials → DraftTaxonomy (Phase D slice 1).
 * Stateless: extract text (reusing Phase-2 material-extract), one structured
 * LLM pass, normalize/validate. Nothing is persisted engine-side.
 */
import Anthropic from '@anthropic-ai/sdk';
import { getModelClient } from '../ai/model-registry';
import type { DraftTaxonomy, TaxonomyGenerateRequest } from '@evelyn/portal-contract/v1';
import { DraftTaxonomySchema } from '@evelyn/portal-contract/v1';
import { extractMaterials, condenseForPipeline } from './material-extract';

export const TAXONOMY_MODEL_ID = getModelClient('taxonomy').model;
/** The prompt asks for 20-60 LOs, each with a title, a 1-2 sentence
 *  description, prereq ids and an order — a 60-LO outline can run past 8k
 *  tokens of JSON, and a response cut off mid-object fails `JSON.parse` and
 *  surfaces as a bare "taxonomy generation failed". 16k leaves headroom for
 *  the largest taxonomy the contract accepts while staying under the SDK's
 *  non-streaming HTTP timeout (streaming is the answer above ~16k). */
const TAXONOMY_MAX_TOKENS = 16_000;
const OUTLINE_TARGET_CHARS = 12_000;
/** One retry. Every observed failure mode here — an overloaded/rate-limited
 *  API, a truncated response, prose wrapped around the JSON, a section-key
 *  mismatch — is non-deterministic, so a second sample usually succeeds
 *  where the first didn't. */
const TAXONOMY_ATTEMPTS = 2;

export type TaxonomyDraftResult =
  | { ok: true; taxonomy: DraftTaxonomy; generatorOk: boolean }
  | { ok: false; status: 422; code: string; message: string };

const slug = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'x';

/** Contract caps (DraftTaxonomySectionSchema / DraftTaxonomyLoSchema). Every
 *  field is clamped to these rather than left to fail validation: a single
 *  over-long LLM title used to sink the ENTIRE draft to the fallback stub. */
const MAX_TITLE = 200;
const MAX_LO_ID = 120;

/** Trim a slug to `max` chars without leaving a trailing separator (which
 *  would violate the contract's LO_SLUG regex). */
const clampSlug = (s: string, max: number): string =>
  s.slice(0, max).replace(/[.-]+$/, '') || 'x';

/** Return `id` if unused, else the first free `id-2`, `id-3`, ... variant
 *  (clamped to `max`). Registers the winner in `used`.
 *
 *  Duplicate ids are not hypothetical: two outline tasks whose titles slug
 *  identically ("Risk Management" / "Risk management!") produce the same
 *  `<topicKey>.<sectionKey>.<slug>`. Downstream, the portal's materialize()
 *  builds a loId -> node _id map, so two LOs sharing an id get the SAME
 *  ObjectId and insertMany dies on E11000 — with the Course row already
 *  upserted, i.e. an approve that dead-ends. Deduping here, BEFORE prereq
 *  remapping, keeps every remap resolvable. */
function uniqueId(id: string, used: Set<string>, max: number): string {
  if (!used.has(id)) {
    used.add(id);
    return id;
  }
  for (let n = 2; ; n++) {
    const suffix = `-${n}`;
    const candidate = clampSlug(id.slice(0, max - suffix.length), max) + suffix;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
}

/** Coerce a raw LLM taxonomy into contract shape: slugify keys, rewrite loIds
 *  to `<topicKey>.<sectionKey>.<slug>`, dedup colliding section keys and
 *  loIds with ordinal suffixes, truncate titles to the contract's 200-char
 *  cap, remap prereq refs through the rewrite, drop dangling/self prereqs,
 *  normalize weights to sum 100, re-issue suggestedOrder 1..n. Returns null
 *  when the result can't satisfy the schema. */
export function normalizeRawTaxonomy(raw: unknown, topicKey: string): DraftTaxonomy | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as { title?: unknown; sections?: unknown; los?: unknown };
  if (typeof r.title !== 'string' || !Array.isArray(r.sections) || !Array.isArray(r.los)) return null;

  // Section keys are deduped the same way loIds are. An LO can only name a
  // section by slug, so LOs pointing at a collided key all land in the FIRST
  // section that claimed it (the `-2` section keeps its published weight but
  // may end up with no LOs) — unavoidable, since the collision destroyed the
  // only signal that could tell them apart, and strictly better than two
  // sections sharing a key.
  const usedSectionKeys = new Set<string>();
  const sections = r.sections
    .filter((s): s is { key?: string; title?: string; weightPct?: number } => !!s && typeof s === 'object')
    .map((s) => ({
      rawKey: slug(String(s.key ?? s.title ?? '')),
      titleKey: slug(String(s.title ?? '')),
      key: slug(String(s.key ?? s.title ?? '')),
      title: String(s.title ?? '').trim().slice(0, MAX_TITLE),
      weightPct: Number(s.weightPct) || 0,
    }))
    .filter((s) => s.title)
    // Contract cap (DraftTaxonomySchema.sections.max(20)). Clamping beats
    // failing the whole draft: the operator can delete what they don't want,
    // but they can't recover a taxonomy that never came back.
    .slice(0, 20)
    .map((s) => ({ ...s, key: uniqueId(s.key, usedSectionKeys, 40) }));
  if (sections.length === 0) return null;
  const totalW = sections.reduce((a, s) => a + s.weightPct, 0);
  for (const s of sections) s.weightPct = totalW > 0 ? Math.round((s.weightPct / totalW) * 1000) / 10 : Math.round(1000 / sections.length) / 10;

  // An LO names its section however the model felt like naming it, and it is
  // NOT reliably the section's own `key`: the same outline re-run can come
  // back with sectionKey: "Quality Leadership and Integration" (the title)
  // where the section declared key: "quality-leadership". Matching on the key
  // alone dropped every such LO at the filter below, leaving `los` empty,
  // which fails the schema's `.min(1)` and surfaced to the operator as an
  // unexplained "taxonomy generation failed" — on a PDF that had worked
  // minutes earlier. Accept the declared key, the raw pre-dedup key, and the
  // slugified title as aliases for the same section. First alias wins, so a
  // collision resolves to the earlier section (same rule `uniqueId` documents).
  const sectionKeyByAlias = new Map<string, string>();
  for (const s of sections) {
    for (const alias of [s.key, s.rawKey, s.titleKey]) {
      if (alias && !sectionKeyByAlias.has(alias)) sectionKeyByAlias.set(alias, s.key);
    }
  }
  const idMap = new Map<string, string>(); // raw loId → rewritten loId
  const usedLoIds = new Set<string>();
  const los = r.los
    .filter((l): l is Record<string, unknown> => !!l && typeof l === 'object')
    .map((l) => ({
      raw: l,
      title: String(l.title ?? '').trim().slice(0, MAX_TITLE),
      description: String(l.description ?? '').trim().slice(0, 1000),
      sectionKey: sectionKeyByAlias.get(slug(String(l.sectionKey ?? ''))) ?? '',
    }))
    // Drop unusable rows BEFORE ids are allocated, so a discarded LO never
    // burns the un-suffixed id its kept neighbour should get.
    .filter((l) => l.title && l.description && l.sectionKey)
    // Contract cap (DraftTaxonomySchema.los.max(120)) — clamped, not failed,
    // for the same reason the section list is.
    .slice(0, 120)
    .map((l) => {
      const loId = uniqueId(
        clampSlug(`${topicKey}.${l.sectionKey}.${slug(String(l.raw.title ?? l.raw.loId ?? ''))}`, MAX_LO_ID),
        usedLoIds,
        MAX_LO_ID,
      );
      // First raw id wins: a model that emitted the same raw loId twice has
      // already made its prereq references ambiguous, and remapping to the
      // later one would silently re-point the earlier LO's edges.
      const rawId = String(l.raw.loId ?? '');
      if (rawId && !idMap.has(rawId)) idMap.set(rawId, loId);
      return {
        loId,
        title: l.title,
        description: l.description,
        sectionKey: l.sectionKey,
        rawPrereqs: Array.isArray(l.raw.prerequisiteLoIds) ? l.raw.prerequisiteLoIds.map(String) : [],
        suggestedOrder: Number(l.raw.suggestedOrder) || 0,
      };
    });

  const finalIds = new Set(los.map((l) => l.loId));
  const normalized = los.map((l, i) => ({
    loId: l.loId, title: l.title, description: l.description, sectionKey: l.sectionKey,
    prerequisiteLoIds: [...new Set(l.rawPrereqs.map((p) => idMap.get(p) ?? p))]
      .filter((p) => finalIds.has(p) && p !== l.loId).slice(0, 8),
    suggestedOrder: i + 1,
  }));

  // A blank title is not worth discarding a whole valid LO graph over — the
  // operator renames the course in the console anyway.
  const title = r.title.trim() || topicKey.toUpperCase();
  const parsed = DraftTaxonomySchema.safeParse({
    title,
    // `rawKey`/`titleKey` are alias-resolution scratch, not contract fields.
    sections: sections.map((s) => ({ key: s.key, title: s.title, weightPct: s.weightPct })),
    los: normalized,
  });
  if (!parsed.success) {
    // Previously this returned null silently and the operator saw only
    // "generation failed (generatorOk:false)" with nothing to act on.
    console.error(
      `[taxonomy-generate] normalize rejected for topicKey=${topicKey}: ` +
        `${sections.length} sections, ${normalized.length} LOs — ` +
        JSON.stringify(parsed.error.issues.slice(0, 5)),
    );
    return null;
  }
  return parsed.data;
}

function stripFences(s: string): string {
  return s.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

const SYSTEM = `You convert a certification/exam CONTENT OUTLINE into a learning-objective graph for an adaptive tutor.
Return ONLY JSON: {"title": string, "sections": [{"key","title","weightPct"}], "los": [{"loId","title","description","sectionKey","prerequisiteLoIds","suggestedOrder"}]}.
Rules: sections mirror the outline's top-level domains and their published weights (percent). Each LO must be ONE teachable lesson objective (~30 min), not a whole domain — split broad outline tasks. 20-60 LOs total. description: 1-2 sentences of what the learner can do afterward. Every LO's sectionKey must be copied verbatim from one of the section "key" values you emitted above — not the section's title. prerequisiteLoIds: only true hard prerequisites within this outline (sparse is correct). suggestedOrder: global teaching order.`;

/** One sample from the model: either a validated taxonomy, or the reason this
 *  attempt is unusable. The reason is for the server log — it is what tells
 *  an operator staring at "taxonomy generation failed" whether to retry, trim
 *  the PDF, or change the guidance. */
type DraftAttempt = { ok: true; taxonomy: DraftTaxonomy } | { ok: false; reason: string };

async function attemptDraft(
  anthropic: Anthropic,
  outlineText: string,
  guidance: string | undefined,
  topicKey: string,
): Promise<DraftAttempt> {
  let msg: Anthropic.Message;
  try {
    msg = await anthropic.messages.create({
      model: TAXONOMY_MODEL_ID,
      max_tokens: TAXONOMY_MAX_TOKENS,
      system: SYSTEM,
      messages: [{ role: 'user', content: `OUTLINE:\n${outlineText}\n\nOPERATOR GUIDANCE:\n${guidance ?? '(none)'}` }],
    });
  } catch (err) {
    // Transient API conditions land here — 429 rate limit, 529 overloaded,
    // socket timeouts. This is the branch that made the same PDF succeed on
    // one click and fail on the next.
    return { ok: false, reason: `LLM call failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  if (msg.stop_reason === 'max_tokens') {
    return {
      ok: false,
      reason: `model hit the ${TAXONOMY_MAX_TOKENS}-token output cap; the JSON is truncated mid-object`,
    };
  }

  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  let raw: unknown;
  try {
    raw = JSON.parse(stripFences(text));
  } catch {
    return { ok: false, reason: `model output was not valid JSON (${text.length} chars, begins ${JSON.stringify(text.slice(0, 120))})` };
  }

  const taxonomy = normalizeRawTaxonomy(raw, topicKey);
  // normalizeRawTaxonomy has already logged the specific schema issues.
  if (!taxonomy) return { ok: false, reason: 'normalized taxonomy failed contract validation' };
  return { ok: true, taxonomy };
}

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

  const anthropic = getModelClient('taxonomy').client;
  let lastReason = 'no attempt ran';

  for (let attempt = 1; attempt <= TAXONOMY_ATTEMPTS; attempt++) {
    let result: DraftAttempt;
    try {
      result = await attemptDraft(anthropic, outlineText, req.guidance, topicKey);
    } catch (err) {
      // attemptDraft catches its own expected failures; anything reaching
      // here is a bug in it, and must still not take the request down.
      result = { ok: false, reason: `unexpected: ${err instanceof Error ? err.stack ?? err.message : String(err)}` };
    }

    if (result.ok) {
      if (attempt > 1) {
        // eslint-disable-next-line no-console
        console.warn(`[taxonomy-generate] topicKey=${topicKey} recovered on attempt ${attempt}/${TAXONOMY_ATTEMPTS}`);
      }
      return { ok: true, taxonomy: result.taxonomy, generatorOk: true };
    }

    lastReason = result.reason;
    // eslint-disable-next-line no-console
    console.error(
      `[taxonomy-generate] attempt ${attempt}/${TAXONOMY_ATTEMPTS} failed ` +
        `(topicKey=${topicKey}, model=${TAXONOMY_MODEL_ID}, outline=${outlineText.length} chars): ${lastReason}`,
    );
  }

  // eslint-disable-next-line no-console
  console.error(`[taxonomy-generate] topicKey=${topicKey} exhausted ${TAXONOMY_ATTEMPTS} attempts; last reason: ${lastReason}`);
  return { ok: true, taxonomy: fallback, generatorOk: false };
}
