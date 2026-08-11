/**
 * One-time evidence backfill — engine half (learner-model v1, Task 12).
 *
 * Ingests the portal's exported JSONL (apps/api/src/scripts/export-evidence.ts,
 * academy repo — quiz/practice attempts) alongside two engine-local sources,
 * so day-one learner-model estimates aren't built from a cold evidence log:
 *
 *   - MockAttempt.loBreakdown: one coarse per-LO row per completed attempt.
 *     `loBreakdown` is MCQ+FRQ combined — `gradeAndComplete` (mock-exam/
 *     report.ts) has folded successfully-graded FRQ points into it at
 *     grading time since the mock platform launched (pre-existing prod
 *     behavior, not something Task 8 added), so this is already the full
 *     per-attempt signal. `frqGrades` is deliberately NOT walked separately:
 *     doing so would re-derive the same FRQ signal a second time, and at
 *     'mock' source weight (3.0, the estimator's highest) that's a 2-4x
 *     amplification per FRQ-touched LO, not a granularity gain.
 *   - StudentProfile.mastery priors: one low-weight ('diagnostic' source —
 *     the estimator's lowest source weight) prior event per existing mastery
 *     entry, so an LO whose only history predates the evidence log entirely
 *     still seeds a day-one estimate instead of reading as untouched.
 *
 * Idempotent: every row's idempotencyKey is `bf:`-prefixed (distinguishable
 * from the live append points' `mock:<attemptId>:<itemId>` etc. keys) and
 * appendEvidence's insertMany dedupes on it — safe to re-run. That `bf:` vs
 * `mock:` prefix split means the built-in `_id` dedup gives ZERO protection
 * against double-counting a mock attempt that has BOTH a live per-item
 * evidence trail (Task 8's append points, keyed `mock:<attemptId>:<itemId>`)
 * AND this script's own loBreakdown-derived row for the same attempt — e.g.
 * a student who completes a mock in the window between the engine deploy
 * that turned on live mock evidence and the prod run of this backfill. Any
 * MockAttempt with at least one existing `source: 'mock'` EvidenceEvent is
 * therefore excluded from the backfill entirely (see `liveMockAttemptIdsFrom`
 * / the exclusion in `runBackfill`) — it already has real evidence.
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
 *
 * `--student-ids <id1,id2,...>` (I1 fix, optional) scopes the two
 * engine-local sources (MockAttempt, StudentProfile) to the given
 * studentIds only — for a scoped/test/backfill-one-partner run. A real prod
 * run OMITS this flag entirely (the point of the backfill is every student).
 */
import fs from 'node:fs';
import connectDB from '@/lib/db';
import { appendEvidence, type EvidenceInput } from '@/lib/tutor/learner-model/store';
import type { EvidenceSource } from '@/lib/tutor/learner-model/estimator';
import { EvidenceEventModel } from '@/models';
import { MockAttempt } from '@/models/MockAttempt';
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

// --- Source 2: MockAttempt.loBreakdown --------------------------------------

/** Structural subset of IMockAttempt this script reads. */
export interface MockAttemptLike {
  attemptId: string;
  studentId: string;
  status: string;
  completedAt?: Date;
  loBreakdown?: Array<{ loId: string; correct: number; total: number; sectionId?: string }>;
}

/** loBreakdown → one per-LO row per completed attempt (`bf:mock:<attemptId>:
 *  lo:<loId>`). `frqGrades` is intentionally NOT walked here — see the
 *  module doc comment: `gradeAndComplete` already folds successfully-graded
 *  FRQ points into `loBreakdown` at grading time (pre-existing prod
 *  behavior), so a separate frqGrades pass would double-represent the same
 *  signal at the 'mock' source weight. Only `status: 'completed'` attempts
 *  with a `completedAt` are considered (in-progress/expired attempts have no
 *  graded evidence). Pure. */
export function buildMockEvidence(attempts: MockAttemptLike[]): EvidenceInput[] {
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
  }
  return inputs;
}

/** Attempt ids that already have LIVE per-item mock evidence — Task 8's
 *  append points key these `mock:<attemptId>:<itemId>`, disjoint from this
 *  script's own `bf:mock:...` keys, so `appendEvidence`'s `_id` dedup gives
 *  no protection against re-deriving the same signal from `loBreakdown` for
 *  an attempt that already has real evidence. Takes the raw `_id` strings of
 *  every `EvidenceEvent` with `source: 'mock'`; parses the attemptId as
 *  everything between the `mock:` prefix and the LAST `:` (item ids carry no
 *  colons, attempt ids — crypto.randomUUID() — don't either, but splitting
 *  on the last separator is robust either way). Pure. */
export function liveMockAttemptIdsFrom(liveMockEvidenceIds: string[]): Set<string> {
  const ids = new Set<string>();
  for (const id of liveMockEvidenceIds) {
    if (!id.startsWith('mock:')) continue;
    const rest = id.slice('mock:'.length);
    const sep = rest.lastIndexOf(':');
    if (sep === -1) continue;
    ids.add(rest.slice(0, sep));
  }
  return ids;
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
  /** I1 fix — scope the two engine-local sources (MockAttempt, StudentProfile)
   *  to these studentIds only. Tests MUST pass their fixture ids here: an
   *  unscoped `dryRun: false` run walks EVERY MockAttempt + StudentProfile in
   *  the configured DB and writes `bf:`-prefixed rows for every one of
   *  them — fine (idempotent) against a real prod DB run once, but ran
   *  against a shared dev DB from a test suite it silently backfilled evidence
   *  for real students that were never meant to be touched. Omit for a real
   *  prod run (the whole point is to backfill every student). */
  studentIds?: string[];
}

/** Collects evidence from every source (portal JSONL when given, MockAttempt,
 *  StudentProfile priors) and — unless `dryRun` — sorts the whole set
 *  oldest-first and appends it in batches of 500 via `appendEvidence`.
 *  Always returns per-source counts (dry-run just skips the writes; the
 *  counts reflect what a real run would write either way). */
export async function runBackfill(opts: RunBackfillOptions): Promise<BackfillCounts> {
  const counts = emptyCounts();
  const allInputs: EvidenceInput[] = [];
  const studentIdFilter = opts.studentIds && opts.studentIds.length > 0 ? { $in: opts.studentIds } : undefined;

  if (opts.jsonlPath) {
    const raw = fs.readFileSync(opts.jsonlPath, 'utf8');
    const jsonlInputs = parseJsonlEvidence(raw);
    countBy(jsonlInputs, counts);
    allInputs.push(...jsonlInputs);
  }

  const liveMockQuery: Record<string, unknown> = { source: 'mock' };
  if (studentIdFilter) liveMockQuery.studentId = studentIdFilter;
  const liveMockDocs = await EvidenceEventModel.find(liveMockQuery).select('_id').lean();
  const liveMockAttemptIds = liveMockAttemptIdsFrom(liveMockDocs.map((d) => String(d._id)));

  const mockAttemptQuery: Record<string, unknown> = { status: 'completed', completedAt: { $exists: true } };
  if (studentIdFilter) mockAttemptQuery.studentId = studentIdFilter;
  const mockAttemptsAll = (await MockAttempt.find(mockAttemptQuery).lean()) as unknown as MockAttemptLike[];
  const mockAttempts = mockAttemptsAll.filter((a) => !liveMockAttemptIds.has(a.attemptId));
  const mockInputs = buildMockEvidence(mockAttempts);
  countBy(mockInputs, counts);
  allInputs.push(...mockInputs);

  const profileQuery: Record<string, unknown> = studentIdFilter ? { _id: studentIdFilter } : {};
  const profiles = (await StudentProfileModel.find(profileQuery).lean()) as unknown as StudentProfileLike[];
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
    const studentIdsIdx = process.argv.indexOf('--student-ids');
    const studentIds =
      studentIdsIdx !== -1
        ? process.argv[studentIdsIdx + 1]?.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;

    await connectDB();
    const counts = await runBackfill({ jsonlPath, dryRun, studentIds });

    console.log(
      `[backfill-evidence] ${dryRun ? 'DRY RUN — ' : ''}assessment=${counts.assessment} practice=${counts.practice} ` +
        `mock=${counts.mock} diagnostic=${counts.diagnostic}` +
        (jsonlPath ? ` (jsonl=${jsonlPath})` : ' (no --jsonl — portal sources skipped)') +
        (studentIds ? ` (scoped to ${studentIds.length} studentIds)` : ''),
    );
    process.exit(0);
  };

  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
