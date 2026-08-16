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
 * A mid-loop failure (crash, killed process) leaves a PARTIAL migration:
 * some profiles stamped, some not. That is safe, not a disaster — every
 * check here is re-derived from current DB state on each run, stamped rows
 * report 'already-migrated' and are left alone (see attributeProfile), so
 * simply re-running the script to completion is the recovery.
 *
 * Usage:
 *   MONGODB_URI=... npx ts-node -r tsconfig-paths/register \
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
 *
 * Round-1 review fixes (spec 5, amended): this script must NEVER create a
 * `kind: 'partner'` Partner row. `registry.ts` says plainly: "the registry
 * row WINS once it exists" — a row this script minted with `secrets: []`
 * and `allowedEndpoints: []` would beat the env fallback and 401
 * `unknown_partner` (auth.ts) for that partner's live traffic within one
 * 60s cache TTL, and the documented rollback (drop index, unset two fields)
 * does not undo it. Real partner rows are the seed script's job (Task 9,
 * `npm run seed:partner-registry -- --write`) — if one is missing here, this script aborts and tells
 * the operator to seed first, rather than write a credential-less stand-in.
 * Also: `mongoose.set('autoIndex', false)` runs before `connectDB()` so a
 * plain dry run cannot silently trigger every schema's auto-built indexes —
 * including TutorSession's `{startedAt:1}` TTL index, which deletes rows.
 *
 * Round-2 review fixes:
 *  - The write-gating logic (decideBackfill / executeBackfill below) is
 *    factored out as pure/injectable so the three abort conditions
 *    (ambiguous, unexpected-partners, missing-real-partners) are exercised
 *    directly by hermetic tests — deleting any one of them turns the test
 *    suite red (see test-partner-backfill.ts). Before this round, the tests
 *    only proved the *detectors* returned the right values; nothing proved
 *    main() actually acted on them.
 *  - `mongoose.set('autoCreate', false)` alongside `autoIndex`: the dry run
 *    against real prod data (see task-6-report.md) confirmed Mongoose was
 *    creating an empty `partners` collection on connect even with writes
 *    otherwise fully gated. With this, the only 3 mutating calls in the
 *    file are the true full account of what can write.
 *  - Reporting order: the partner-row plan and the profile-update count are
 *    now printed BEFORE a missing-real-partners abort, not after — on the
 *    first real run the abort used to fire before the operator saw either
 *    number.
 *  - The kind:'test' warning (e.g. for `portalA`) now names the actual
 *    consequence verified against auth.ts's real branch order: a row with
 *    `secrets: []` fails the `partner.secrets.length === 0` check BEFORE
 *    the kind check ever runs, so the outcome is 401 `unknown_partner`, not
 *    403 `partner_cannot_authenticate` — the 403 branch is unreachable with
 *    an empty secrets array. Also names the concrete suites that configure
 *    `PORTAL_PARTNER_SECRETS` for `portalA` and would break if run against
 *    a DB that has been through `--write`.
 */
import mongoose from 'mongoose';
import connectDB from '@core/db';
import { StudentProfileModel } from '@/models/StudentProfile';
import { TutorSession } from '@/models/TutorSession';
import { PartnerModel } from '@/models/Partner';
import { configureMongooseForOpsScript } from './ops-mongoose';

const WRITE = process.argv.includes('--write');
const BUILD_INDEX = process.argv.includes('--build-index');

const TEST_PREFIXES = new Set(['lmtest', 'trial', 'revtest', 'portalA']);

// Suites that configure PORTAL_PARTNER_SECRETS for 'portalA' and would 401
// unknown_partner (see the header note above) if ever pointed at a DB that
// has a portalA Partner row with secrets:[] — i.e. after this script has
// run --write against that DB.
const PORTAL_A_DEPENDENT_SUITES = [
  'test:portal-auth',
  'test:portal-endpoints',
  'test:portal-assessment',
  'test:plan-generate',
  'test:portal-mock',
  'test:learner-model',
];

// Every partnerId this backfill is allowed to observe, measured from
// production (spec §"Measured production state"). Anything else — e.g. a
// stray colon inside an otherwise-unnamespaced _id being misread as a
// prefix — must abort rather than silently mint a fabricated partner and a
// permanent namespace for that student.
export const EXPECTED_PARTNERS = new Set([
  'evelyn',
  'evelyn-marketing',
  'crimsora',
  'academy',
  'lmtest',
  'trial',
  'revtest',
  'portalA',
]);

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

/**
 * Pure — no DB. Returns any observed partnerId NOT in the measured allowlist
 * (sorted, empty when clean). The caller aborts before any write if this is
 * non-empty.
 */
export function findUnexpectedPartners(observed: Iterable<string>): string[] {
  return [...observed].filter((p) => !EXPECTED_PARTNERS.has(p)).sort();
}

export interface PartnerRowPlan {
  /** Rows this script may safely create itself — never 'partner' kind. */
  toCreate: Array<{ partnerId: string; kind: 'first-party' | 'test' }>;
  /**
   * Real ('partner'-kind) ids observed with no existing registry row. The
   * caller MUST abort before any write when this is non-empty — creating
   * one here would mint a credential-less row that 401s that partner's live
   * traffic. Seeding is the seed script's job (`npm run seed:partner-registry -- --write`).
   */
  missingReal: string[];
}

/**
 * Pure — no DB. `existingIds` is the current Partner collection's _id set,
 * passed in so this is testable without a database. Never proposes creating
 * a `kind: 'partner'` row, structurally: the only two kinds in `toCreate`'s
 * type are 'first-party' | 'test'.
 */
export function planPartnerRows(
  observed: Iterable<string>,
  existingIds: Set<string>,
): PartnerRowPlan {
  const toCreate: PartnerRowPlan['toCreate'] = [];
  const missingReal: string[] = [];
  for (const partnerId of observed) {
    if (existingIds.has(partnerId)) continue;
    const kind = partnerKind(partnerId);
    if (kind === 'partner') {
      missingReal.push(partnerId);
    } else {
      toCreate.push({ partnerId, kind });
    }
  }
  missingReal.sort();
  return { toCreate, missingReal };
}

export interface AttributionSummary {
  ambiguous: Array<{ id: string; error: string }>;
  partnersObserved: Set<string>;
}

export type BackfillDecision =
  | { abort: true; reason: 'ambiguous'; detail: Array<{ id: string; error: string }> }
  | { abort: true; reason: 'unexpected-partners'; detail: string[] }
  | { abort: true; reason: 'missing-real-partners'; detail: string[]; partnerPlan: PartnerRowPlan }
  | { abort: false; partnerPlan: PartnerRowPlan };

/**
 * Pure — no DB. The single place all three abort conditions are decided,
 * in priority order: ambiguous attribution first (nothing else can be
 * trusted if this fired), then the allowlist, then the partner-row plan.
 * `missing-real-partners` still carries the full `partnerPlan` (not just
 * the missing ids) so the caller can report what it WOULD have created
 * before reporting what blocked it — round-2 fix: the abort must be the
 * last thing printed, not the first.
 */
export function decideBackfill(
  summary: AttributionSummary,
  existingPartnerIds: Set<string>,
): BackfillDecision {
  if (summary.ambiguous.length > 0) {
    return { abort: true, reason: 'ambiguous', detail: summary.ambiguous };
  }
  const unexpected = findUnexpectedPartners(summary.partnersObserved);
  if (unexpected.length > 0) {
    return { abort: true, reason: 'unexpected-partners', detail: unexpected };
  }
  const partnerPlan = planPartnerRows(summary.partnersObserved, existingPartnerIds);
  if (partnerPlan.missingReal.length > 0) {
    return { abort: true, reason: 'missing-real-partners', detail: partnerPlan.missingReal, partnerPlan };
  }
  return { abort: false, partnerPlan };
}

export interface BackfillWriteDeps {
  createPartnerRow: (row: { partnerId: string; kind: 'first-party' | 'test' }) => void | Promise<void>;
  writeProfile: (id: string, result: AttributionResult) => void | Promise<void>;
}

/**
 * Executes a decision. If `decision.abort` is true, or `write` is false,
 * NEITHER dep is ever called — this is the one function in the file that
 * is allowed to invoke the write deps, and it only does so past both gates.
 * Pure aside from calling the injected deps, so a test can supply spies and
 * assert zero calls happened on an abort — proving the abort actually
 * blocks writes, not just that the detector returned the right value.
 * Deleting either gate (`if (decision.abort) return`, `if (!write) return`)
 * makes a spy-count assertion in test-partner-backfill.ts fail.
 */
export async function executeBackfill(
  decision: BackfillDecision,
  toApply: Array<{ _id: string; result: AttributionResult }>,
  write: boolean,
  deps: BackfillWriteDeps,
): Promise<void> {
  if (decision.abort) return;
  if (!write) return;
  for (const row of decision.partnerPlan.toCreate) {
    await deps.createPartnerRow(row);
  }
  for (const { _id, result } of toApply) {
    await deps.writeProfile(_id, result);
  }
}

/** Mask an _id for console output — enough to spot patterns, not enough to dox a student. */
function mask(id: string): string {
  if (id.length <= 8) return `${id.slice(0, 2)}***`;
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}

/**
 * M1c final review (reviewer B finding 7): exported so the suite can call it
 * and assert on the observable state it leaves behind. Deleting the
 * autoIndex/autoCreate guards below previously left every suite green.
 */
export async function main() {
  // Must run before connectDB() — see ops-mongoose.ts for the full reason
  // (TutorSession's TTL index DELETES sessions older than 180 days; an empty
  // `partners` collection was observed appearing from a plain dry run before
  // this guard existed). A "dry run" must do neither.
  configureMongooseForOpsScript();
  await connectDB();

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

  console.log(
    `Mode: profiles/partners=${WRITE ? 'WRITE' : 'dry-run'}, index=${BUILD_INDEX ? 'BUILD' : 'skip'} — ${profiles.length} profiles`,
  );
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

  const existingPartnerDocs = await PartnerModel.find({}, { _id: 1 }).lean();
  const existingPartnerIds = new Set(existingPartnerDocs.map((d) => d._id as string));

  const decision = decideBackfill({ ambiguous, partnersObserved }, existingPartnerIds);

  if (decision.abort && decision.reason === 'ambiguous') {
    console.error(
      `\n${decision.detail.length} profile(s) have ambiguous partner attribution. Aborting — resolve by hand before running --write.`,
    );
    await mongooseDisconnectSafely();
    process.exit(1);
  }

  if (decision.abort && decision.reason === 'unexpected-partners') {
    console.error(
      `\nUnexpected partner id(s) observed (not in the measured allowlist): ${decision.detail.join(', ')}. ` +
        'This could be a stray colon in an otherwise-unnamespaced _id fabricating a partner. Aborting before any write.',
    );
    await mongooseDisconnectSafely();
    process.exit(1);
  }

  // From here, `decision` is either a clean plan or 'missing-real-partners'
  // — both variants carry a `partnerPlan`, so the report below (what WOULD
  // be created, how many profiles WOULD be updated) prints regardless of
  // whether we're about to abort. Round-2 fix: the abort must be the LAST
  // thing that happens, so an operator's first run always sees the full
  // picture, not just an error naming what's missing.
  const { partnerPlan } = decision;

  console.log(`\nPartner rows ${WRITE ? 'to create' : 'that would be created'}: ${partnerPlan.toCreate.length}`);
  for (const { partnerId, kind } of partnerPlan.toCreate) {
    console.log(`  ${WRITE ? 'creating' : 'would create'} Partner row: ${partnerId} (${kind})`);
    if (kind === 'test') {
      console.log(
        `    NOTE: ${partnerId} is kind:'test' with secrets:[]. auth.ts checks ` +
          '`!partner || partner.secrets.length === 0` BEFORE the kind check, so the consequence ' +
          'is 401 unknown_partner — NOT 403 partner_cannot_authenticate, which is unreachable ' +
          'with an empty secrets array. The registry row wins over the env fallback once it ' +
          `exists (registry.ts), so anything still authenticating as ${partnerId} via ` +
          'PORTAL_PARTNER_SECRETS breaks the moment this row is created.',
      );
      if (partnerId === 'portalA') {
        console.log(
          '    portalA is the id used in the documented PORTAL_PARTNER_SECRETS example, and these ' +
            `suites configure it that way: ${PORTAL_A_DEPENDENT_SUITES.join(', ')}. ` +
            'They only break if MONGODB_URI ever points them at a DB this script has --write-run ' +
            "against — none of the suites above set MONGODB_URI themselves, so today's CI is safe; " +
            'this is a warning for whoever next points a suite at a migrated DB.',
        );
      }
    }
  }

  console.log(
    `\n${toApply.length} profile(s) ${WRITE ? 'staged for update' : 'would be updated (pass --write to apply)'}.`,
  );

  if (decision.abort) {
    // Only 'missing-real-partners' can still be true here.
    console.error(
      `\nMissing Partner row(s) for real partner id(s): ${decision.detail.join(', ')}. ` +
        "This script never creates 'kind: partner' rows — a credential-less row would win over the " +
        "env fallback (registry.ts: \"the registry row WINS once it exists\") and 401 unknown_partner " +
        "for that partner's live traffic. Run the seed script (`npm run seed:partner-registry -- --write`) to create these with " +
        'real secrets first, then re-run. Aborting before any write.',
    );
    await mongooseDisconnectSafely();
    process.exit(1);
  }

  await executeBackfill(decision, toApply, WRITE, {
    createPartnerRow: async (row) => {
      const now = new Date().toISOString();
      await PartnerModel.create({
        _id: row.partnerId,
        name: row.partnerId,
        kind: row.kind,
        status: 'active',
        secrets: [],
        allowedEndpoints: [],
        limits: { rpm: 600, burst: 60, dailyQuota: null },
        flagOverrides: {},
        metering: {},
        createdAt: now,
        updatedAt: now,
      });
    },
    writeProfile: async (id, result) => {
      await StudentProfileModel.updateOne(
        { _id: id },
        { $set: { partnerId: result.partnerId, externalStudentId: result.externalStudentId } },
      );
    },
  });

  if (WRITE) {
    console.log(`\nApplied ${toApply.length} profile update(s), created ${partnerPlan.toCreate.length} partner row(s).`);
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
  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
