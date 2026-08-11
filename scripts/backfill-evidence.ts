/**
 * One-time evidence backfill — engine half (learner-model v1, Task 12).
 *
 * Ingests the portal's exported JSONL (apps/api/src/scripts/export-evidence.ts,
 * academy repo — quiz/practice attempts) alongside two engine-local sources,
 * so day-one learner-model estimates aren't built from a cold evidence log:
 *
 *   - MockAttempt (loBreakdown + frqGrades): `loBreakdown` gives one coarse
 *     per-LO row per completed attempt (MCQ, and FRQ contributions already
 *     folded in for attempts graded after the Task-8 fold-in code shipped —
 *     see gradeAndComplete in mock-exam/report.ts); `frqGrades` additionally
 *     gives one finer per-item row per successfully-graded FRQ (loId resolved
 *     via ProblemBank, since frqGrades carries no loId of its own) — this
 *     recovers per-item granularity for older attempts whose loBreakdown
 *     predates that fold-in. Ungraded FRQs (grader failure) are skipped —
 *     not student evidence.
 *   - StudentProfile.mastery priors: one low-weight ('diagnostic' source —
 *     the estimator's lowest source weight) prior event per existing mastery
 *     entry, so an LO whose only history predates the evidence log entirely
 *     still seeds a day-one estimate instead of reading as untouched.
 *
 * Idempotent: every row's idempotencyKey is `bf:`-prefixed (distinguishable
 * from the live append points' `mock:<attemptId>:<itemId>` etc. keys) and
 * appendEvidence's insertMany dedupes on it — safe to re-run.
 *
 * Ordering: the WHOLE evidence set (JSONL + MockAttempt + priors) is sorted
 * oldest-first before being chunked into batches of 500 and appended — Elo
 * is order-sensitive (K-factor shrinks with count as ratings mature), so
 * replaying history out of order would produce different ratings than the
 * real event sequence did.
 *
 * `trial:`-prefixed studentIds are dropped at every source (appendEvidence
 * drops them too, but dry-run counts must match what a real run would write).
 *
 * Run:
 *   MONGODB_URI=... npx tsx scripts/backfill-evidence.ts --dry-run
 *   MONGODB_URI=... npx tsx scripts/backfill-evidence.ts --jsonl /path/to/evidence.jsonl
 *   (omit --jsonl to skip the portal sources — engine-local sources only)
 */
import fs from 'node:fs';
import connectDB from '@/lib/db';
import { appendEvidence, type EvidenceInput } from '@/lib/tutor/learner-model/store';
import type { EvidenceSource } from '@/lib/tutor/learner-model/estimator';
import { MockAttempt } from '@/models/MockAttempt';
import { ProblemBank } from '@/models/ProblemBank';
import { StudentProfileModel } from '@/models/StudentProfile';

const BATCH_SIZE = 500;

function isTrialId(id: string): boolean {
  return id.startsWith('trial:');
}

// --- Source 1: portal JSONL (quiz/practice attempts) -----------------------

/** One line of the portal's export-evidence.ts output — EvidenceInput fields
 *  with `occurredAt` as an ISO string (JSON has no Date type). */
export interface JsonlEvidenceRow {
  idempotencyKey: string;
  studentId: string;
  loId: string;
  source: EvidenceSource;
  itemId?: string;
  sectionId?: string;
  outcome: number;
  pointsAwarded?: number;
  maxPoints?: number;
  occurredAt: string;
}

/** Parses portal-exported JSONL into EvidenceInput[] — pure (the caller reads
 *  the file). Drops blank lines and `trial:` studentIds. */
export function parseJsonlEvidence(raw: string): EvidenceInput[] {
  const inputs: EvidenceInput[] = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const row = JSON.parse(trimmed) as JsonlEvidenceRow;
    if (isTrialId(row.studentId)) continue;
    inputs.push({
      idempotencyKey: row.idempotencyKey,
      studentId: row.studentId,
      loId: row.loId,
      source: row.source,
      itemId: row.itemId,
      sectionId: row.sectionId,
      outcome: row.outcome,
      pointsAwarded: row.pointsAwarded,
      maxPoints: row.maxPoints,
      occurredAt: new Date(row.occurredAt),
    });
  }
  return inputs;
}

// --- Source 2: MockAttempt (loBreakdown + frqGrades) ------------------------

/** Structural subset of IMockAttempt this script reads. */
export interface MockAttemptLike {
  attemptId: string;
  studentId: string;
  status: string;
  completedAt?: Date;
  loBreakdown?: Array<{ loId: string; correct: number; total: number; sectionId?: string }>;
  frqGrades?: Array<{ itemId: string; totalPoints: number; maxPoints: number; ungraded?: boolean }>;
}

/** loBreakdown → one coarse per-LO row (`bf:mock:<attemptId>:lo:<loId>`);
 *  frqGrades → one finer per-item row (`bf:mock:<attemptId>:<itemId>`), loId
 *  resolved via `loIdByItemId` (a ProblemBank lookup the caller builds once
 *  for the whole batch) — items with no bank row are skipped, not invented.
 *  Only `status: 'completed'` attempts with a `completedAt` are considered
 *  (in-progress/expired attempts have no graded evidence). Pure. */
export function buildMockEvidence(
  attempts: MockAttemptLike[],
  loIdByItemId: Map<string, string>,
): EvidenceInput[] {
  const inputs: EvidenceInput[] = [];
  for (const a of attempts) {
    if (a.status !== 'completed' || !a.completedAt || isTrialId(a.studentId)) continue;
    const occurredAt = a.completedAt;

    for (const entry of a.loBreakdown ?? []) {
      inputs.push({
        idempotencyKey: `bf:mock:${a.attemptId}:lo:${entry.loId}`,
        studentId: a.studentId,
        loId: entry.loId,
        source: 'mock',
        sectionId: entry.sectionId,
        outcome: entry.total > 0 ? entry.correct / entry.total : 0,
        pointsAwarded: entry.correct,
        maxPoints: entry.total,
        occurredAt,
      });
    }

    for (const g of a.frqGrades ?? []) {
      if (g.ungraded) continue;
      const loId = loIdByItemId.get(g.itemId);
      if (!loId) continue;
      inputs.push({
        idempotencyKey: `bf:mock:${a.attemptId}:${g.itemId}`,
        studentId: a.studentId,
        loId,
        source: 'mock',
        itemId: g.itemId,
        outcome: g.maxPoints > 0 ? g.totalPoints / g.maxPoints : 0,
        pointsAwarded: g.totalPoints,
        maxPoints: g.maxPoints,
        occurredAt,
      });
    }
  }
  return inputs;
}

// --- Source 3: StudentProfile.mastery priors --------------------------------

/** Structural subset of IStudentProfile this script reads. */
export interface StudentProfileLike {
  _id: string;
  mastery?: Record<string, { score: number; lastTouchedAt: string }>;
}

/** One low-weight prior event per existing mastery entry — source
 *  'diagnostic' (tied with 'session' for the estimator's lowest source
 *  weight), outcome = the stored running score, occurredAt = lastTouchedAt.
 *  Keyed `bf:prior:<studentId>:<loId>`. Pure. */
export function buildDiagnosticPriorEvidence(profiles: StudentProfileLike[]): EvidenceInput[] {
  const inputs: EvidenceInput[] = [];
  for (const p of profiles) {
    if (isTrialId(p._id)) continue;
    for (const [loId, entry] of Object.entries(p.mastery ?? {})) {
      inputs.push({
        idempotencyKey: `bf:prior:${p._id}:${loId}`,
        studentId: p._id,
        loId,
        source: 'diagnostic',
        outcome: entry.score,
        occurredAt: new Date(entry.lastTouchedAt),
      });
    }
  }
  return inputs;
}

// --- orchestration -----------------------------------------------------

export interface BackfillCounts {
  assessment: number;
  practice: number;
  mock: number;
  diagnostic: number;
}

function emptyCounts(): BackfillCounts {
  return { assessment: 0, practice: 0, mock: 0, diagnostic: 0 };
}

function countBy(inputs: EvidenceInput[], counts: BackfillCounts): void {
  for (const i of inputs) {
    if (i.source === 'assessment') counts.assessment += 1;
    else if (i.source === 'practice') counts.practice += 1;
    else if (i.source === 'mock') counts.mock += 1;
    else if (i.source === 'diagnostic') counts.diagnostic += 1;
  }
}

export interface RunBackfillOptions {
  jsonlPath?: string;
  dryRun: boolean;
}

/** Collects evidence from every source (portal JSONL when given, MockAttempt,
 *  StudentProfile priors) and — unless `dryRun` — sorts the whole set
 *  oldest-first and appends it in batches of 500 via `appendEvidence`.
 *  Always returns per-source counts (dry-run just skips the writes; the
 *  counts reflect what a real run would write either way). */
export async function runBackfill(opts: RunBackfillOptions): Promise<BackfillCounts> {
  const counts = emptyCounts();
  const allInputs: EvidenceInput[] = [];

  if (opts.jsonlPath) {
    const raw = fs.readFileSync(opts.jsonlPath, 'utf8');
    const jsonlInputs = parseJsonlEvidence(raw);
    countBy(jsonlInputs, counts);
    allInputs.push(...jsonlInputs);
  }

  const mockAttempts = (await MockAttempt.find({ status: 'completed', completedAt: { $exists: true } })
    .lean()) as unknown as MockAttemptLike[];
  const frqItemIds = [
    ...new Set(
      mockAttempts.flatMap((a) => (a.frqGrades ?? []).filter((g) => !g.ungraded).map((g) => g.itemId)),
    ),
  ];
  const bankDocs = frqItemIds.length
    ? ((await ProblemBank.find({ id: { $in: frqItemIds } }).select('id loId').lean()) as unknown as Array<{
        id: string;
        loId?: string;
      }>)
    : [];
  const loIdByItemId = new Map(bankDocs.filter((d) => d.loId).map((d) => [d.id, d.loId as string]));
  const mockInputs = buildMockEvidence(mockAttempts, loIdByItemId);
  countBy(mockInputs, counts);
  allInputs.push(...mockInputs);

  const profiles = (await StudentProfileModel.find({}).lean()) as unknown as StudentProfileLike[];
  const priorInputs = buildDiagnosticPriorEvidence(profiles);
  countBy(priorInputs, counts);
  allInputs.push(...priorInputs);

  if (!opts.dryRun) {
    allInputs.sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
    for (let i = 0; i < allInputs.length; i += BATCH_SIZE) {
      await appendEvidence(allInputs.slice(i, i + BATCH_SIZE));
    }
  }

  return counts;
}

// Run as CLI only when invoked directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  const main = async (): Promise<void> => {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
    const dryRun = process.argv.includes('--dry-run');
    const jsonlIdx = process.argv.indexOf('--jsonl');
    const jsonlPath = jsonlIdx !== -1 ? process.argv[jsonlIdx + 1] : undefined;

    await connectDB();
    const counts = await runBackfill({ jsonlPath, dryRun });

    console.log(
      `[backfill-evidence] ${dryRun ? 'DRY RUN — ' : ''}assessment=${counts.assessment} practice=${counts.practice} ` +
        `mock=${counts.mock} diagnostic=${counts.diagnostic}` +
        (jsonlPath ? ` (jsonl=${jsonlPath})` : ' (no --jsonl — portal sources skipped)'),
    );
    process.exit(0);
  };

  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
