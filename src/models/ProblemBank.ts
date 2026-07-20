import mongoose, { Schema, Document } from 'mongoose';

/**
 * ProblemBank — ingested practice-problem corpus for the adaptive-pacing
 * v1 pipeline.
 *
 * Source policy: license-clean content only. Two permitted origins:
 *   1. License-clean external corpora (OpenStax CC-BY 4.0; Wikiversity /
 *      public-domain).
 *   2. ORIGINAL items authored for the bank (license 'internal-original',
 *      source name 'Evelyn (original)') — e.g. the AP Statistics MCQ/numeric
 *      bank seeded from src/data/problem-bank/ via scripts/seed-problem-bank.ts.
 *      These are original AP-style items, NOT copies of copyrighted exam
 *      questions.
 * Still NEVER populated by copy-pasting our lesson-plan try-yourself content —
 * those stay in lesson-plan seeds as the ULTIMATE FALLBACK below the bank.
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
  /** OPTIONAL canonical LO code — the lesson plan's `los[].id`
   *  (e.g. "apstats.normal-distribution"). Added for gap-targeted
   *  practice retrieval (Phase 3(c)). Existing rows lack it and are
   *  still served by the legacy {topic,difficulty} queries. */
  loId?: string;
  /** OPTIONAL topic id companion. Mirrors `topic` for callers that scope
   *  by an explicit topic id; topic-scope retrieval matches either field. */
  topicId?: string;
  /** OPTIONAL CED code (e.g. AP-Stats "AP-STATS-1.10", most-specific topic
   *  level). Tagged on LO-aligned ingested content alongside `loId`. */
  cedCode?: string;
  /** Optional shared stimulus passage this prompt analyzes (passages/store). */
  passageId?: string;
  /** 'mock' rows belong to full-length mock forms and are EXCLUDED from all
   *  practice/tutor/assessment serving. Absent/'practice' = normal bank row. */
  bankScope?: 'practice' | 'mock';
  /** FRQ rubric for mock free-response items (same shape as lesson-plan
   *  FrqRubric / contract FrqRubricSchema). Absent for mcq/numeric. */
  rubric?: {
    parts: Array<{
      criterionId: string;
      maxPoints: number;
      scoringCriteria: string;
      modelResponse: string;
    }>;
  };
  /** Canonical problem statement, ready for show_problem. May
   *  contain LaTeX; markdown allowed. */
  problemText: string;
  /** Reference answer — the value or accepted solution. May be
   *  numeric, expression, free-text. */
  answer: string;
  /** Optional short worked solution (1-3 sentences) the tutor can
   *  reference while walking a student through the problem. Populated
   *  by the runtime brain-gen write-back (2026-07-17) — the generator
   *  produces a teachingAnswer alongside the bare answer; storing it
   *  keeps bank-served rows behaviorally identical to freshly-generated
   *  ones. Additive — pre-existing rows lack it. */
  solutionText?: string;
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
    // Optional LO-alignment fields (Phase 3(c)) — additive, no migration.
    loId: { type: String },
    topicId: { type: String },
    cedCode: { type: String },
    passageId: { type: String, required: false },
    bankScope: { type: String, enum: ['practice', 'mock'] },
    rubric: {
      type: {
        parts: [{
          criterionId: { type: String, required: true },
          maxPoints: { type: Number, required: true },
          scoringCriteria: { type: String, required: true },
          modelResponse: { type: String, required: true },
        }],
      },
      required: false,
      default: undefined,
    },
    problemText: { type: String, required: true },
    answer: { type: String, required: true },
    solutionText: { type: String },
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
// Gap-targeted practice retrieval (Phase 3(c)) — new, additive index.
// Sparse so the existing un-tagged corpus isn't indexed.
ProblemBankSchema.index({ loId: 1, difficulty: 1 }, { sparse: true });
// Mock-form item fetches (Task 2, mock-exams platform) — sparse so the
// existing practice corpus (bankScope absent) isn't indexed.
ProblemBankSchema.index({ bankScope: 1, id: 1 }, { sparse: true });

export const ProblemBank =
  mongoose.models.ProblemBank ||
  mongoose.model<IProblemBank>('ProblemBank', ProblemBankSchema);
