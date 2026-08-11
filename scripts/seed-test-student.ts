/**
 * seed-test-student.ts — fabricate a realistic learner-model history for ONE
 * designated test student, so the intelligent Overview can be exercised
 * without waiting for real usage.
 *
 * What it writes (all through the real `appendEvidence` pipeline, so
 * projections, review scheduling, and Elo update exactly as live traffic
 * would):
 *   - evidence events spread over --weeks, per-LO trajectories chosen by
 *     --profile (mixed | improving | struggling)
 *   - one synthetic LearnerStateSnapshot dated ~16 days ago so trend arrows
 *     (up/down vs the 14-day-old snapshot) light up
 *
 * What it deliberately does NOT write:
 *   - MockAttempt documents. Seeded 'mock'-source evidence moves estimates
 *     (weight 3.0) but the projection stays basis 'mastery-only' unless the
 *     account has REAL completed mocks — fabricating attempt docs would leak
 *     into the student's visible mock history.
 *
 * Idempotency: every row's _id is prefixed `seed:` — re-runs insert nothing
 * new. --unseed calls deleteLearnerModelData() which wipes ALL learner-model
 * data for the student (seeded AND live) — only point it at a test account.
 *
 * Usage:
 *   MONGODB_URI=... npx tsx scripts/seed-test-student.ts \
 *     --student <engineStudentId> --topic ap-calculus-bc \
 *     [--weeks 6] [--profile mixed] [--dry-run] [--unseed]
 *
 * Find an account's engineStudentId from the portal DB:
 *   db.users.findOne({email: '<email>'}, {engineStudentId: 1})
 */
import { listLessonPlans } from '@/lib/tutor/lesson-plan/store';
import { appendEvidence, deleteLearnerModelData, type EvidenceInput } from '@/lib/tutor/learner-model/store';
import { LearnerStateProjectionModel, LearnerStateSnapshotModel } from '@/models';
import connectDB from '@/lib/db';

type Profile = 'mixed' | 'improving' | 'struggling';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const has = (name: string) => process.argv.includes(`--${name}`);

/** Deterministic per-(student,lo,index) pseudo-random in [0,1) — reruns produce identical rows. */
function det(seed: string): number {
  let h = 2166136261;
  for (const c of seed) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 10000) / 10000;
}

async function main() {
  const studentId = arg('student');
  const topic = arg('topic') ?? 'ap-calculus-bc';
  const weeks = Math.max(1, Number(arg('weeks') ?? 6));
  const profile = (arg('profile') ?? 'mixed') as Profile;
  const dryRun = has('dry-run');

  if (!studentId) throw new Error('--student <engineStudentId> is required');
  if (studentId.startsWith('trial:')) throw new Error('trial: students are excluded from the learner model');

  await connectDB();

  if (has('unseed')) {
    const deleted = await deleteLearnerModelData(studentId);
    console.log(`[seed-test-student] UNSEED (full learner-model wipe for ${studentId}):`, deleted);
    process.exit(0);
  }

  const plans = await listLessonPlans({ topic });
  const los = [...new Map(
    plans.flatMap((p) => p.los ?? []).map((lo) => [lo.id, lo]),
  ).values()];
  if (los.length === 0) throw new Error(`no curated LOs found for topic '${topic}'`);

  // Trajectory assignment. mixed: ~30% strong, ~30% improving, ~25% weak,
  // ~15% untouched (renders as 'not started' cells).
  const now = Date.now();
  const dayMs = 86400000;
  const inputs: EvidenceInput[] = [];
  let strong = 0, improving = 0, weak = 0, untouched = 0, reviewBait = 0;

  los.forEach((lo, idx) => {
    const r = det(`${studentId}|${lo.id}`);
    let kind: 'strong' | 'improving' | 'weak' | 'skip';
    if (profile === 'improving') kind = r < 0.15 ? 'skip' : 'improving';
    else if (profile === 'struggling') kind = r < 0.15 ? 'skip' : r < 0.75 ? 'weak' : 'improving';
    else kind = r < 0.3 ? 'strong' : r < 0.6 ? 'improving' : r < 0.85 ? 'weak' : 'skip';

    if (kind === 'skip') { untouched++; return; }

    // 4-8 events per touched LO, oldest → newest across the window.
    const n = 4 + Math.floor(det(`n|${lo.id}`) * 5);
    // A slice of strong LOs stops getting evidence early → their reviewDueAt
    // (last success + doubling half-life) lands in the past → review-due rows.
    const stale = kind === 'strong' && det(`stale|${lo.id}`) < 0.35;
    if (stale) reviewBait++;
    const windowDays = weeks * 7;
    const lastDay = stale ? Math.min(windowDays - 1, 20) : 1 + Math.floor(det(`last|${lo.id}`) * 3);

    for (let i = 0; i < n; i++) {
      const frac = n === 1 ? 1 : i / (n - 1); // 0 oldest → 1 newest
      const ageDays = windowDays - frac * (windowDays - lastDay);
      const noise = (det(`o|${lo.id}|${i}`) - 0.5) * 0.2;
      let p: number; // success probability at this point in the trajectory
      if (kind === 'strong') p = 0.85 + noise;
      else if (kind === 'weak') p = 0.3 + noise;
      else p = 0.3 + frac * 0.6 + noise; // improving: 0.3 → 0.9
      const correct = det(`hit|${lo.id}|${i}`) < Math.max(0.05, Math.min(0.95, p));

      const source: EvidenceInput['source'] =
        i % 3 === 0 ? 'practice' : i % 3 === 1 ? 'session' : 'assessment';
      inputs.push({
        idempotencyKey: `seed:${studentId}:${lo.id}:${i}`,
        studentId,
        loId: lo.id,
        source,
        sessionId: `seed-${lo.id}-${i}`,
        itemId: source === 'practice' ? `seed-item-${lo.id}-${i}` : undefined,
        outcome: source === 'session' ? (correct ? 1 : 0.5) : correct ? 1 : 0,
        difficulty: source === 'practice' ? 1 + Math.floor(det(`d|${lo.id}|${i}`) * 4) : undefined,
        occurredAt: new Date(now - ageDays * dayMs),
        subject: topic,
      });
    }
    if (kind === 'strong') strong++; else if (kind === 'weak') weak++; else improving++;
  });

  console.log(
    `[seed-test-student] topic=${topic} los=${los.length} → strong=${strong} improving=${improving} ` +
    `weak=${weak} untouched=${untouched} (review-bait among strong: ${reviewBait}); events=${inputs.length}` +
    (dryRun ? ' [DRY RUN — nothing written]' : ''),
  );
  if (dryRun) process.exit(0);

  for (let i = 0; i < inputs.length; i += 500) {
    await appendEvidence(inputs.slice(i, i + 500));
  }

  // Backdated snapshot (~16 days) so trendOf() has a prior: improving LOs get a
  // LOWER past estimate (→ trend up), weak LOs a slightly higher one (→ down/flat).
  const snapDate = new Date(now - 16 * dayMs).toISOString().slice(0, 10);
  const projections = await LearnerStateProjectionModel.find({ studentId }).lean();
  const snapLos = projections
    .filter((p) => typeof p.estimate === 'number')
    .map((p) => {
      const cur = p.estimate as number;
      const r = det(`snap|${p.loId}`);
      const past = cur >= 0.7 ? cur - 0.02 : cur >= 0.45 ? Math.max(0.05, cur - 0.2) : Math.min(0.95, cur + 0.1 * r);
      return { loId: p.loId, estimate: Math.max(0, Math.min(1, past)) };
    });
  await LearnerStateSnapshotModel.findOneAndUpdate(
    { studentId, date: snapDate },
    { $set: { studentId, date: snapDate, los: snapLos } },
    { upsert: true },
  );

  const due = await LearnerStateProjectionModel.countDocuments({ studentId, reviewDueAt: { $lte: new Date() } });
  console.log(
    `[seed-test-student] wrote evidence + snapshot(${snapDate}, ${snapLos.length} los); ` +
    `projections=${projections.length} reviewDueNow=${due}`,
  );
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
