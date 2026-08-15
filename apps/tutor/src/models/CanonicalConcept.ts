/**
 * MongoDB model for CanonicalConcept — the concept registry that backs
 * prerequisite-gap canonicalization (Phase 3(b)).
 *
 * Brain-emitted free-form `conceptLabel`s (e.g. "factoring quadratics",
 * "factoring polynomials") are rolled up to a stable `conceptId` by the
 * async normalizer (`src/lib/tutor/concept-registry/normalizer.ts`) using
 * 1536-d embedding cosine similarity. This is a NEW collection — additive,
 * no migration, no impact on existing collections.
 */

import mongoose, { Schema } from 'mongoose';

export interface ICanonicalConcept {
  /** Stable concept id, e.g. "concept:factoring-quadratics". */
  _id: string;
  /** Canonical (normalized) label. */
  label: string;
  /** Raw labels that have mapped to this concept (for review/debug). */
  aliases: string[];
  /** 1536-d embedding (OpenAI text-embedding-3-small) of the canonical label. */
  embedding: number[];
  /** Embedding model that produced `embedding`. */
  embeddingModel: string;
  /** Lifecycle: auto-created stubs await human review. */
  status: 'auto-generated' | 'reviewed';
  /** Distinct sessions that have emitted a label mapping here. Drives the
   *  "surface for review after ≥5 sessions" admin queue (future). */
  sessionCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ICanonicalConceptDoc =
  mongoose.Document<string, object, ICanonicalConcept> & ICanonicalConcept;

const CanonicalConceptSchema = new Schema<ICanonicalConcept>(
  {
    _id: { type: String, required: true },
    label: { type: String, required: true, index: true },
    aliases: { type: [String], default: [] },
    embedding: { type: [Number], default: [] },
    embeddingModel: { type: String, required: true },
    status: { type: String, enum: ['auto-generated', 'reviewed'], default: 'auto-generated' },
    sessionCount: { type: Number, default: 0 },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    _id: false,
    toJSON: {
      transform(_doc, ret) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = ret as any;
        r.id = r._id;
        delete r._id;
        delete r.__v;
        return r;
      },
    },
  },
);

export const CanonicalConceptModel =
  (mongoose.models.CanonicalConcept as mongoose.Model<ICanonicalConcept>) ||
  mongoose.model<ICanonicalConcept>('CanonicalConcept', CanonicalConceptSchema);
