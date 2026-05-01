import mongoose, { Schema, Document } from 'mongoose';

/**
 * ProblemBank — ingested practice-problem corpus for the adaptive-pacing
 * v1 pipeline.
 *
 * Source policy: ONLY scraped from license-clean external corpora
 * (OpenStax CC-BY 4.0 first; Wikiversity / public-domain later). Never
 * populated with our internally-authored try-yourself content — those
 * stay in lesson-plan seeds and serve as the ULTIMATE FALLBACK below
 * the bank in the pipeline.
 *
 * Layered usage in the runtime pipeline:
 *   Layer 1 (fast-path, ~50ms): student-initiated "another one" →
 *     queryBank(topic, difficulty, excludeIds).
 *   Layer 3 (fallback after brain-gen retry): same query as Layer 1.
 *
 * Verification: every ingested problem must pass an independent
 * Sonnet 4.6 fresh-context solve at ingest time before storage.
 * `verifiedAt` records when this passed.
 */
export interface IProblemBank extends Document {
  /** Stable id, e.g. "openstax.calc1.derivatives.0042". */
  id: string;
  /** Topic id from topic-taxonomy.ts (e.g. "ap-calculus-ab"). */
  topic: string;
  /** Optional finer-grained subtopic — typically a unit/chapter
   *  string within the topic (e.g. "chain-rule"). Free-form for
   *  v1; will be promoted to a controlled vocab during the audit
   *  phase. */
  subtopic?: string;
  /** Difficulty bucket on a 4-point anchored-relative scale: 1
   *  (easier than the typical authored try-yourself for this LO)
   *  through 4 (extension-grade). Calibrated at ingest time by
   *  the verifier. */
  difficulty: 1 | 2 | 3 | 4;
  /** Canonical problem statement, ready for show_problem. May
   *  contain LaTeX; markdown allowed. */
  problemText: string;
  /** Reference answer — the value or accepted solution. May be
   *  numeric, expression, free-text. */
  answer: string;
  /** Optional ordered hints, mirrors SegmentTryYourself.hints[]. */
  hints?: string[];
  /** Response format expected from student. */
  responseFormat?: 'mcq' | 'frq' | 'numeric' | 'free';
  /** When responseFormat is 'mcq', the choice list. */
  choices?: string[];
  /** Source attribution for license compliance + provenance. */
  source: {
    name: string;
    url?: string;
    citation?: string;
  };
  /** License string (e.g. "CC-BY-4.0"). Enforced allowlist at
   *  ingestion time — non-allowlisted sources are rejected. */
  license: string;
  /** OpenAI text-embedding-3-small (1536-dim) for similarity
   *  search and semantic dedup. */
  embedding?: number[];
  /** Timestamp the verifier confirmed the answer. Required —
   *  unverified problems are not eligible for runtime serving. */
  verifiedAt: Date;
  /** Verifier model that signed off (e.g. "claude-sonnet-4-6"). */
  verifierModel: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemBankSchema = new Schema<IProblemBank>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    topic: { type: String, required: true, index: true },
    subtopic: { type: String, index: true },
    difficulty: { type: Number, required: true, enum: [1, 2, 3, 4] },
    problemText: { type: String, required: true },
    answer: { type: String, required: true },
    hints: [{ type: String }],
    responseFormat: { type: String, enum: ['mcq', 'frq', 'numeric', 'free'] },
    choices: [{ type: String }],
    source: {
      name: { type: String, required: true },
      url: { type: String },
      citation: { type: String },
    },
    license: { type: String, required: true },
    embedding: [{ type: Number }],
    verifiedAt: { type: Date, required: true },
    verifierModel: { type: String, required: true },
  },
  { timestamps: true }
);

// Hot path: pipeline Layer 1/3 query is (topic, difficulty) with id-NOT-IN.
ProblemBankSchema.index({ topic: 1, difficulty: 1 });
ProblemBankSchema.index({ topic: 1, subtopic: 1, difficulty: 1 });

export const ProblemBank =
  mongoose.models.ProblemBank ||
  mongoose.model<IProblemBank>('ProblemBank', ProblemBankSchema);
