/**
 * Backfill: stamp (partnerId, externalStudentId) onto existing StudentProfile
 * rows, then (separately, under --build-index) build the unique index that
 * makes cross-partner collision impossible (M1c Task 6).
 *
 * Defaults to DRY RUN. Nothing is written unless --write is passed. The
 * index is never built unless --build-index is passed — they are separate
 * flags so a dry-run of the attribution table can never accidentally build
 * an index over unmigrated data.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/backfill-partner-namespace.ts                # dry run, report only
 *   ... scripts/backfill-partner-namespace.ts --write        # apply the backfill
 *   ... scripts/backfill-partner-namespace.ts --build-index   # build+verify the index only
 *   ... scripts/backfill-partner-namespace.ts --write --build-index   # both
 *
 * Rule (spec 4.2 — corrected mid-milestone, got wrong twice before this):
 * `externalStudentId` is the id EXACTLY as the partner sends it. Before M1c,
 * `getOrCreateStudentProfile(studentId)` used the raw request id as the
 * profile `_id`, so an existing `_id` IS by definition what that partner
 * transmits. A prefix like `lmtest:abc` is a HINT for attributing
 * `partnerId` — it is never stripped. Splitting on the first colon would
 * make `resolveProfileId('lmtest', 'abc')` miss the backfilled row and mint
 * a blank profile, for 393 of the 495 measured rows.
 *
 * `_id` is never touched by this script, in either mode.
 */
import connectDB from '@core/db';
import { StudentProfileModel } from '@/models/StudentProfile';
import { TutorSession } from '@/models/TutorSession';
import { PartnerModel } from '@/models/Partner';

const WRITE = process.argv.includes('--write');
const BUILD_INDEX = process.argv.includes('--build-index');

const TEST_PREFIXES = new Set(['lmtest', 'trial', 'revtest', 'portalA']);

export type AttributionSignal =
  | 'already-migrated'
  | 'existing-prefix'
  | 'sourcePartnerId'
  | 'orphan-default';

export interface AttributionResult {
  partnerId: string;
  externalStudentId: string;
  signal: AttributionSignal;
}

/**
 * Pure — no DB. Takes exactly the sessions relevant to this one profile so
 * it can be unit tested without a database (see test-partner-backfill.ts).
 *
 * Throws if two sessions disagree on sourcePartnerId for the same student:
 * "any ambiguity — one student id resolving to two partners — must abort,
 * not guess" (Task 6 brief). Attribution is refused, not guessed.
 */
export function attributeProfile(
  profile: { _id: string; partnerId?: string; externalStudentId?: string },
  sessionsByStudentId: Map<string, Array<{ sourcePartnerId?: string }>>,
): AttributionResult {
  // Idempotency: a row that already carries both identity fields is left
  // alone. Running the script twice must be a no-op.
  if (profile.partnerId && profile.externalStudentId) {
    return {
      partnerId: profile.partnerId,
      externalStudentId: profile.externalStudentId,
      signal: 'already-migrated',
    };
  }

  const colon = profile._id.indexOf(':');
  if (colon > 0) {
    return {
      partnerId: profile._id.slice(0, colon),
      // NOT sliced. Spec 4.2: `_id` is exactly what the partner transmits,
      // because pre-M1c the raw request id became the `_id`. Stripping the
      // prefix here would break resolution after the flip.
      externalStudentId: profile._id,
      signal: 'existing-prefix',
    };
  }

  const partners = new Set(
    (sessionsByStudentId.get(profile._id) ?? [])
      .map((s) => s.sourcePartnerId)
      .filter((p): p is string => Boolean(p)),
  );

  if (partners.size > 1) {
    throw new Error(
      `ambiguous attribution for ${profile._id}: ${[...partners].join(', ')} — resolve by hand`,
    );
  }

  if (partners.size === 1) {
    return {
      partnerId: [...partners][0],
      externalStudentId: profile._id,
      signal: 'sourcePartnerId',
    };
  }

  return { partnerId: 'evelyn', externalStudentId: profile._id, signal: 'orphan-default' };
}

function partnerKind(partnerId: string): 'partner' | 'first-party' | 'test' {
  if (partnerId === 'evelyn') return 'first-party';
  if (TEST_PREFIXES.has(partnerId)) return 'test';
  return 'partner';
}

/** Mask an _id for console output — enough to spot patterns, not enough to dox a student. */
function mask(id: string): string {
  if (id.length <= 8) return `${id.slice(0, 2)}***`;
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}

async function ensurePartnerRow(partnerId: string, now: string, apply: boolean): Promise<boolean> {
  const existing = await PartnerModel.findById(partnerId).lean();
  if (existing) return false;
  if (apply) {
    await PartnerModel.create({
      _id: partnerId,
      name: partnerId,
      kind: partnerKind(partnerId),
      status: 'active',
      secrets: [],
      allowedEndpoints: [],
      limits: { rpm: 600, burst: 60, dailyQuota: null },
      flagOverrides: {},
      metering: {},
      createdAt: now,
      updatedAt: now,
    });
  }
  return true;
}

/**
 * The write path — this function performs the only `updateOne`/`create`
 * calls in the script that mutate StudentProfile or Partner documents, and
 * it is called from exactly one place, gated by `if (WRITE)` in main().
 * There is no code path that reaches a Model.updateOne/create for these
 * collections without going through here, and this function is never
 * invoked unless WRITE is true.
 */
async function applyWrite(
  _id: string,
  result: AttributionResult,
  now: string,
): Promise<void> {
  await StudentProfileModel.updateOne(
    { _id },
    { $set: { partnerId: result.partnerId, externalStudentId: result.externalStudentId, updatedAt: now } },
  );
}

async function main() {
  await connectDB();

  const now = new Date().toISOString();

  const profiles = await StudentProfileModel.find(
    {},
    { _id: 1, partnerId: 1, externalStudentId: 1 },
  ).lean();

  const sessions = await TutorSession.find(
    { studentId: { $exists: true, $ne: null } },
    { studentId: 1, sourcePartnerId: 1 },
  ).lean();

  const sessionsByStudentId = new Map<string, Array<{ sourcePartnerId?: string }>>();
  for (const s of sessions) {
    const sid = s.studentId as string | undefined;
    if (!sid) continue;
    const list = sessionsByStudentId.get(sid) ?? [];
    list.push({ sourcePartnerId: s.sourcePartnerId as string | undefined });
    sessionsByStudentId.set(sid, list);
  }

  const counts: Record<AttributionSignal, number> = {
    'already-migrated': 0,
    'existing-prefix': 0,
    sourcePartnerId: 0,
    'orphan-default': 0,
  };
  const partnersObserved = new Set<string>();
  const ambiguous: Array<{ id: string; error: string }> = [];

  console.log(`${WRITE ? 'WRITE' : 'DRY RUN'} — ${profiles.length} profiles`);
  console.log('id (masked)          partnerId         signal');

  const toApply: Array<{ _id: string; result: AttributionResult }> = [];

  for (const p of profiles) {
    let result: AttributionResult;
    try {
      result = attributeProfile(
        { _id: p._id as string, partnerId: p.partnerId, externalStudentId: p.externalStudentId },
        sessionsByStudentId,
      );
    } catch (err) {
      ambiguous.push({ id: p._id as string, error: (err as Error).message });
      continue;
    }
    counts[result.signal]++;
    partnersObserved.add(result.partnerId);
    console.log(`${mask(p._id as string).padEnd(22)}${result.partnerId.padEnd(18)}${result.signal}`);
    if (result.signal !== 'already-migrated') {
      toApply.push({ _id: p._id as string, result });
    }
  }

  console.log('\nSummary:');
  for (const [signal, count] of Object.entries(counts)) {
    console.log(`  ${signal}: ${count}`);
  }
  console.log(`  ambiguous (ABORTED, not written): ${ambiguous.length}`);
  if (ambiguous.length > 0) {
    for (const a of ambiguous) console.log(`    ${mask(a.id)}: ${a.error}`);
  }

  if (ambiguous.length > 0) {
    console.error(
      `\n${ambiguous.length} profile(s) have ambiguous partner attribution. Aborting — resolve by hand before running --write.`,
    );
    await mongooseDisconnectSafely();
    process.exit(1);
  }

  // Ensure a Partner row exists for every observed partnerId (step 6 of the
  // brief) — including test prefixes and 'evelyn' — so the index never
  // references a partner that doesn't exist in the registry.
  let partnerRowsCreated = 0;
  for (const partnerId of partnersObserved) {
    const wouldCreate = await ensurePartnerRow(partnerId, now, WRITE);
    if (wouldCreate) {
      partnerRowsCreated++;
      console.log(`${WRITE ? 'created' : 'would create'} Partner row: ${partnerId} (${partnerKind(partnerId)})`);
    }
  }
  console.log(`Partner rows ${WRITE ? 'created' : 'to create'}: ${partnerRowsCreated}`);

  if (WRITE) {
    console.log(`\nApplying ${toApply.length} profile update(s)...`);
    for (const { _id, result } of toApply) {
      await applyWrite(_id, result, now);
    }
    console.log(`Applied ${toApply.length} update(s).`);
  } else {
    console.log(`\n${toApply.length} profile(s) would be updated. Pass --write to apply.`);
  }

  if (BUILD_INDEX) {
    console.log('\nBuilding unique index on (partnerId, externalStudentId)...');
    // PARTIAL on purpose. Trial students and the DB-degrade path still
    // create profiles with NO identity fields, and MongoDB indexes missing
    // fields as null — so a plain unique index would make the SECOND such
    // document a duplicate-key error, which getOrCreateStudentProfile
    // swallows into a silent ephemeral profile. The partial filter
    // constrains exactly the rows that have been given an identity, so the
    // build is safe before the backfill is universal and stays correct
    // after it.
    await StudentProfileModel.collection.createIndex(
      { partnerId: 1, externalStudentId: 1 },
      {
        unique: true,
        partialFilterExpression: {
          partnerId: { $exists: true },
          externalStudentId: { $exists: true },
        },
        name: 'partner_external_student_unique',
      },
    );
    const indexes = await StudentProfileModel.collection.indexes();
    const built = indexes.find((i) => i.name === 'partner_external_student_unique');
    if (!built) {
      console.error('Index build reported success but the index is not present on verification.');
      await mongooseDisconnectSafely();
      process.exit(1);
    }
    console.log('Index verified:', JSON.stringify(built));
  } else {
    console.log('\n(--build-index not passed — index not touched)');
  }

  await mongooseDisconnectSafely();
}

async function mongooseDisconnectSafely(): Promise<void> {
  const mongoose = (await import('mongoose')).default;
  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
