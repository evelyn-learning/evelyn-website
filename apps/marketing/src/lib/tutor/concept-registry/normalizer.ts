/**
 * Concept-label normalizer (Phase 3(b) — IMPLEMENTED, async & off the hot path).
 *
 * Brain emits free-form `conceptLabel` strings via `flag_prerequisite_gap`
 * (e.g. "factoring quadratics"). To roll those up across students for the
 * weak-areas surface and cross-plan remediation routing, labels canonicalize
 * to a stable `conceptId`:
 *   1. Embed the incoming label (1536-d, text-embedding-3-small).
 *   2. Cosine-match against the CanonicalConcept registry. If similarity ≥
 *      threshold (default 0.85), return the matched conceptId.
 *   3. Else create a new `status:'auto-generated'` concept and return it.
 *
 * IMPORTANT — this runs ASYNCHRONOUSLY, after the synchronous gap-write
 * commit. It NEVER blocks or alters `recordGap`. It is invoked by the portal
 * session-result emitter (Phase 4), not by the internal commit endpoint.
 *
 * The core (`canonicalizeConceptLabelWith`) is dependency-injected so it is
 * unit-testable without Mongo or OpenAI; `canonicalizeConceptLabel` wires the
 * real registry + embedder and fails soft (returns null) on any error.
 */

export const EMBEDDING_MODEL = 'text-embedding-3-small';
/** Cosine similarity at/above which a label merges into an existing concept. */
export const CONCEPT_MATCH_THRESHOLD = 0.85;

export interface CanonicalizeResult {
  conceptId: string;
  label: string;
  similarity: number;
}

/** Registry row projection the core needs. */
export interface ConceptLite {
  id: string;
  label: string;
  embedding: number[];
}

export interface ConceptRegistry {
  findAll(): Promise<ConceptLite[]>;
  create(input: { id: string; label: string; embedding: number[]; embeddingModel: string }): Promise<ConceptLite>;
}

export interface Embedder {
  embed(text: string): Promise<number[]>;
}

export interface NormalizerDeps {
  registry: ConceptRegistry;
  embedder: Embedder;
  threshold?: number;
  embeddingModel?: string;
}

/** Cosine similarity. Returns 0 for length-mismatch or zero-norm vectors. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** Normalize a label: lowercase, collapse whitespace, trim. */
export function normalizeLabel(s: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Build a stable conceptId from a normalized label. */
export function makeConceptId(label: string): string {
  const slug = normalizeLabel(label)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return `concept:${slug || 'unnamed'}`;
}

/**
 * Dependency-injected canonicalization core. Embeds the label, matches it
 * against the registry by cosine similarity, and either returns the matched
 * concept or creates+returns a new one.
 */
export async function canonicalizeConceptLabelWith(
  rawLabel: string,
  deps: NormalizerDeps,
): Promise<CanonicalizeResult | null> {
  const label = normalizeLabel(rawLabel);
  if (!label) return null;

  const emb = await deps.embedder.embed(rawLabel);
  if (!emb?.length) return null;

  const all = await deps.registry.findAll();
  let best: { c: ConceptLite; sim: number } | null = null;
  for (const c of all) {
    const sim = cosineSimilarity(emb, c.embedding);
    if (!best || sim > best.sim) best = { c, sim };
  }

  const threshold = deps.threshold ?? CONCEPT_MATCH_THRESHOLD;
  if (best && best.sim >= threshold) {
    return { conceptId: best.c.id, label: best.c.label, similarity: best.sim };
  }

  const created = await deps.registry.create({
    id: makeConceptId(label),
    label,
    embedding: emb,
    embeddingModel: deps.embeddingModel ?? EMBEDDING_MODEL,
  });
  return { conceptId: created.id, label: created.label, similarity: 1 };
}

// ---------------------------------------------------------------------------
// Production wiring (Mongo registry + OpenAI embedder). Lazy imports keep the
// core path (and tests) free of Mongo/OpenAI.
// ---------------------------------------------------------------------------

function mongoRegistry(): ConceptRegistry {
  return {
    async findAll() {
      const { CanonicalConceptModel } = await import('@/models/CanonicalConcept');
      const connectDB = (await import('@core/db')).default;
      await connectDB();
      const rows = await CanonicalConceptModel.find({}, { _id: 1, label: 1, embedding: 1 }).lean();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (rows as any[]).map((r) => ({ id: r._id as string, label: r.label as string, embedding: (r.embedding ?? []) as number[] }));
    },
    async create(input) {
      const { CanonicalConceptModel } = await import('@/models/CanonicalConcept');
      const connectDB = (await import('@core/db')).default;
      await connectDB();
      const now = new Date().toISOString();
      await CanonicalConceptModel.findByIdAndUpdate(
        input.id,
        {
          $setOnInsert: {
            _id: input.id,
            label: input.label,
            embedding: input.embedding,
            embeddingModel: input.embeddingModel,
            status: 'auto-generated',
            sessionCount: 0,
            createdAt: now,
          },
          $set: { updatedAt: now },
        },
        { upsert: true, new: true },
      );
      return { id: input.id, label: input.label, embedding: input.embedding };
    },
  };
}

function openaiEmbedder(): Embedder {
  return {
    async embed(text: string) {
      const OpenAI = (await import('openai')).default;
      const apiKey = process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OPENAI_API_KEY missing');
      const client = new OpenAI({ apiKey });
      const res = await client.embeddings.create({ model: EMBEDDING_MODEL, input: text });
      return res.data[0]?.embedding ?? [];
    },
  };
}

/**
 * Production entry point. Wires the Mongo registry + OpenAI embedder and
 * fails soft (returns null) on any error so the async caller never throws.
 */
export async function canonicalizeConceptLabel(rawLabel: string): Promise<CanonicalizeResult | null> {
  try {
    return await canonicalizeConceptLabelWith(rawLabel, {
      registry: mongoRegistry(),
      embedder: openaiEmbedder(),
    });
  } catch (err) {
    console.warn('[concept-normalizer] canonicalize failed:', err);
    return null;
  }
}
