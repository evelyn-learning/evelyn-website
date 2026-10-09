/**
 * Student erase — integration test against a THROWAWAY LOCAL mongod.
 *
 * ⚠️ This suite runs DELETE code. On a developer laptop `127.0.0.1:2710` is
 * an SSH tunnel to the PRODUCTION database and `.env.local` points
 * MONGODB_URI at it. So this script:
 *   • never reads MONGODB_URI from the environment or any .env file — it
 *     builds its own URI and overwrites the variable before anything that
 *     could connect is imported;
 *   • refuses to run (throws) unless that URI is 127.0.0.1:27017 and the
 *     database name starts with `evelyn_erase_test_`, and refuses port 2710
 *     outright;
 *   • SKIPS cleanly (exit 0, with a message) when no local mongod is
 *     listening — it never falls back to another database;
 *   • drops its database at the end, after re-checking the name.
 *
 * What it proves: with two partners that use the SAME student id, erasing
 * partner A's student through the real route removes that student's rows in
 * every per-student collection and that student's audio directories, and
 * leaves partner B's student, partner A's other student, an unattributed
 * session and all shared content untouched.
 *
 * Usage: npx tsx scripts/test-student-erase-db.ts   (npm run test:student-erase-db)
 */
import assert from 'node:assert';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

const LOCAL_HOST = '127.0.0.1';
const LOCAL_PORT = 27017;
const DB_PREFIX = 'evelyn_erase_test_';

/** Throws unless `uri` is the local throwaway database. Note the port test
 *  is on the parsed port: the STRING ":27017" contains ":2710". */
function assertThrowawayUri(uri: string): string {
  const m = /^mongodb:\/\/([^/:@]+):(\d+)\/([^/?]+)$/.exec(uri);
  if (!m) throw new Error(`student-erase test: refusing to run — unrecognised MONGODB_URI shape`);
  const [, host, port, dbName] = m;
  if (port === '2710' || /:2710(?!\d)/.test(uri)) throw new Error('student-erase test: refusing to run — port 2710 is the production tunnel');
  if (host !== LOCAL_HOST || Number(port) !== LOCAL_PORT) throw new Error(`student-erase test: refusing to run — only ${LOCAL_HOST}:${LOCAL_PORT} is allowed`);
  if (!dbName.startsWith(DB_PREFIX)) throw new Error(`student-erase test: refusing to run — database name must start with ${DB_PREFIX}`);
  return dbName;
}

const TEST_URI = `mongodb://${LOCAL_HOST}:${LOCAL_PORT}/${DB_PREFIX}${randomBytes(6).toString('hex')}`;
const TEST_DB = assertThrowawayUri(TEST_URI);
// Overwrite, never inherit: `@core/db` captures this at module load, and
// every import that can reach it below is a dynamic import AFTER this line.
process.env.MONGODB_URI = TEST_URI;
process.env.PORTAL_IDENTITY_RESOLUTION = 'on';

function localMongodListening(): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host: LOCAL_HOST, port: LOCAL_PORT });
    const done = (ok: boolean) => { socket.destroy(); resolve(ok); };
    socket.setTimeout(1500, () => done(false));
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
  });
}

let passed = 0, failed = 0;
async function test(name: string, fn: () => Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.log(`  ✗ ${name} — ${(err as Error).message}`); }
}

(async () => {
  // The guard itself — pure, runs even when the database is unavailable.
  console.log('\nThrowaway-database guard:\n');
  await test('refuses the production tunnel port, a foreign host, and a non-test database name', async () => {
    assert.throws(() => assertThrowawayUri('mongodb://127.0.0.1:2710/evelyn_erase_test_x'), /2710/);
    assert.throws(() => assertThrowawayUri('mongodb://user:pw@127.0.0.1:2710/evelyn'), /refusing/);
    assert.throws(() => assertThrowawayUri('mongodb://10.0.0.5:27017/evelyn_erase_test_x'), /only 127\.0\.0\.1/);
    assert.throws(() => assertThrowawayUri('mongodb://127.0.0.1:27017/evelyn'), /must start with/);
    assert.throws(() => assertThrowawayUri('mongodb://127.0.0.1:27017/evelyn_erase_test_x?authSource=admin'), /refusing/);
    assert.strictEqual(assertThrowawayUri('mongodb://127.0.0.1:27017/evelyn_erase_test_abc'), 'evelyn_erase_test_abc');
  });

  if (!(await localMongodListening())) {
    console.log(`\nSKIP — no local mongod on ${LOCAL_HOST}:${LOCAL_PORT}; the integration half of this suite did not run (it never uses any other database).`);
    console.log(`\n${passed} passed, ${failed} failed (integration skipped)\n`);
    process.exit(failed > 0 ? 1 : 0);
  }

  const mongoose = (await import('mongoose')).default;
  const { default: connectDB } = await import('@core/db');
  const { signPortalRequest } = await import('@evelyn/portal-contract/auth');
  const { StudentEraseResponseSchema } = await import('@evelyn/portal-contract/v1');
  const { __setRegistryOverrideForTests, __setLimitsDepsOverrideForTests } = await import('../src/lib/tutor/portal/auth');
  const { POST: erasePOST } = await import('../src/app/api/portal/v1/student-erase/route');
  const { eraseStudentData } = await import('../src/lib/tutor/student-erase/erase');
  const {
    EvidenceEventModel, LearnerStateProjectionModel, LearnerStateSnapshotModel, EloRatingModel,
    PracticeAssignmentModel, TutorSession, MockAttempt,
  } = await import('../src/models');
  const { StudentProfileModel } = await import('../src/models/StudentProfile');
  const { StudentTopicNotesModel } = await import('../src/models/StudentTopicNotes');
  const { PracticeGenCounter } = await import('../src/models/PracticeGenCounter');
  const { LessonPlanModel } = await import('../src/models/LessonPlan');
  const { ProblemBank } = await import('../src/models/ProblemBank');

  await connectDB();
  assert.strictEqual(mongoose.connection.name, TEST_DB, 'connected to something other than the throwaway database');
  assert.strictEqual(mongoose.connection.port, LOCAL_PORT);

  // Two partners, authenticated for real through withPortalAuth; the
  // registry and the limiter are in-memory so nothing else is written.
  const SECRETS: Record<string, string> = { partnerA: 'secret-a', partnerB: 'secret-b' };
  __setRegistryOverrideForTests(async (id) =>
    SECRETS[id]
      ? { partnerId: id, kind: 'partner', status: 'active', secrets: [SECRETS[id]], allowedEndpoints: ['/api/portal/v1/'], limits: { rpm: 1000, burst: 1000, dailyQuota: null }, flagOverrides: {} }
      : null,
  );
  __setLimitsDepsOverrideForTests({ bump: async () => 1, now: () => Date.now(), env: {} as NodeJS.ProcessEnv });

  const audioRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'evelyn-erase-db-'));
  process.env.TUTOR_AUDIO_DIR = audioRoot;

  async function erase(partnerId: string, studentId: string) {
    const body = JSON.stringify({ studentId });
    const timestamp = String(Date.now());
    const urlPath = '/api/portal/v1/student-erase';
    const res = await erasePOST(
      new Request(`https://engine.test${urlPath}`, {
        method: 'POST',
        body,
        headers: {
          'x-evelyn-partner': partnerId,
          'x-evelyn-timestamp': timestamp,
          'x-evelyn-signature': signPortalRequest(SECRETS[partnerId], { method: 'POST', path: urlPath, timestamp, body }),
        },
      }) as never,
      undefined as never,
    );
    return { status: res.status, json: await res.json() };
  }

  // ── Seed ────────────────────────────────────────────────────────────────
  // The SAME external id under both partners is the whole point.
  const SHARED = 'stu005';
  const A = 'profile-a-uuid';   // partnerA / stu005   ← the target
  const B = 'profile-b-uuid';   // partnerB / stu005
  const A2 = 'profile-a2-uuid'; // partnerA / stu006
  const now = new Date();
  const iso = now.toISOString();
  // Raw driver inserts: the seed must look like stored documents, not pass
  // through each schema's required-field validation.
  const raw = (m: { collection: { insertMany(docs: object[]): Promise<unknown> } }, docs: object[]) => m.collection.insertMany(docs);

  const profile = (_id: string, partnerId: string, externalStudentId: string, sessions: string[], planId?: string) => ({
    _id, partnerId, externalStudentId, name: `Student ${_id}`, mastery: {}, preferences: { interests: ['x'] },
    gaps: [{ id: 'g1', kind: 'lo', loId: 'lo.1', status: 'candidate', sessionIds: sessions.slice(0, 1), evidence: { signals: [], observation: 'o', studentQuotes: ['q'] }, firstSeenAt: iso, lastSeenAt: iso }],
    recentSessions: sessions.map((sessionId) => ({ sessionId, endedAt: iso, losTouched: [], summary: 's', ...(planId ? { lessonPlanId: planId } : {}) })),
    createdAt: iso, updatedAt: iso, schemaVersion: 1,
  });
  const session = (sessionId: string, studentId: string | undefined, sourcePartnerId: string | undefined, extra: object = {}) => ({
    sessionId, ...(studentId ? { studentId } : {}), ...(sourcePartnerId ? { sourcePartnerId } : {}),
    subject: 'math', topic: 't', level: 'g8', sessionGoal: 'practice', inputMode: 'voice', startedAt: now,
    transcript: [{ role: 'student', text: 'hello', timestamp: now }], studentEmail: 'x@example.test', clientIp: '203.0.113.9', ...extra,
  });
  const perStudent = (id: string, partnerId: string) => ({
    evidence: { studentId: id, partnerId, loId: 'lo.1', source: 'practice', outcome: 1, occurredAt: now, createdAt: now },
    projection: { _id: `${id}|lo.1`, studentId: id, loId: 'lo.1' },
    snapshot: { studentId: id, date: '2026-10-08', los: [] },
    elo: { _id: `student:${id}|math`, rating: 1500 },
    notes: { _id: `${id}::base.1`, studentId: id, baselineId: 'base.1', theoryOverlays: [], methodsAdds: [], pointersAdds: [], createdAt: iso, updatedAt: iso, schemaVersion: 1 },
    assignment: { _id: `pa-${id}`, studentId: id, partnerId, sessionId: `hw-${id}`, lessonPlanId: 'gen-course', los: [], auto: false, assignedAt: now, createdAt: now },
    mock: { attemptId: `att-${id}`, studentId: id, formId: 'f1', examKey: 'sat', status: 'completed', cursor: { sectionIdx: 0, moduleIdx: 0 }, isRetake: false, startedAt: now },
  });
  const rows = [perStudent(A, 'partnerA'), perStudent(B, 'partnerB'), perStudent(A2, 'partnerA')];

  await raw(StudentProfileModel, [
    profile(A, 'partnerA', SHARED, ['sessA1', 'sessA2'], 'gen-homework-bx'), // names another partner's homework plan
    profile(B, 'partnerB', SHARED, ['sessB1']),
    profile(A2, 'partnerA', 'stu006', ['sessA3']),
  ]);
  await raw(EvidenceEventModel, rows.map((r) => r.evidence));
  await raw(LearnerStateProjectionModel, rows.map((r) => r.projection));
  await raw(LearnerStateSnapshotModel, rows.map((r) => r.snapshot));
  await raw(EloRatingModel, [...rows.map((r) => r.elo), { _id: 'item:shared-item', rating: 1500 }]);
  await raw(StudentTopicNotesModel, rows.map((r) => r.notes));
  await raw(PracticeAssignmentModel, rows.map((r) => r.assignment));
  await raw(MockAttempt, rows.map((r) => r.mock));
  await raw(PracticeGenCounter, [
    { scopeKey: `${SHARED}::lo.1`, day: '2026-10-08', count: 3 },
    { scopeKey: 'stu006::lo.1', day: '2026-10-08', count: 2 },
    { scopeKey: 'global', day: '2026-10-08', count: 5 },
  ]);
  await raw(TutorSession, [
    session('sessA1', SHARED, 'partnerA', { lessonProgress: { lessonPlanId: 'gen-homework-a', currentSegmentId: '', completedSegmentIds: [] } }),
    // student id never arrived; linked from A's profile. Ran on a homework
    // plan A's OTHER student also ran on; a top-level `lessonPlanId` (not in
    // the schema, but present on stored rows) names a legacy materials plan.
    session('sessA2', undefined, 'partnerA', { lessonPlanId: 'gen-materials-legacy', lessonProgress: { lessonPlanId: 'gen-homework-shared', currentSegmentId: '', completedSegmentIds: [] } }),
    session('sessB1', SHARED, 'partnerB', { lessonProgress: { lessonPlanId: 'gen-homework-b', currentSegmentId: '', completedSegmentIds: [] } }), // the OTHER partner's stu005
    session('sessR', SHARED, undefined),               // same id, no partner stamp (retail)
    session('sessA3', 'stu006', 'partnerA', { lessonProgress: { lessonPlanId: 'gen-homework-shared', currentSegmentId: '', completedSegmentIds: [] } }), // partner A's other student
    session(`hw-${B}`, undefined, 'partnerB'),         // linked only from B's homework
  ]);
  const plan = (_id: string, metadata: object) => ({ _id, title: _id, curriculum: 'x', grade: '8', subject: 'math', los: [], estimatedMinutes: 10, segments: [], schemaVersion: 1, metadata });
  await raw(LessonPlanModel, [
    plan('rev-a', { reviewPlan: true, studentId: SHARED, partnerId: 'partnerA' }),
    plan('rev-b', { reviewPlan: true, studentId: SHARED, partnerId: 'partnerB' }),
    plan('rev-legacy', { reviewPlan: true, studentId: SHARED }),
    // The real production shape: no student id anywhere on the plan.
    plan('gen-homework-a', { kind: 'homework-help', generatedFromText: true, portalPartnerId: 'partnerA', problems: [{ n: 1, text: 'typed by the student' }] }),
    plan('gen-homework-stamped', { kind: 'homework-help', portalPartnerId: 'partnerA', ownerStudentId: A, problems: [{ n: 1, text: 'no session ever ran' }] }),
    plan('gen-homework-shared', { kind: 'homework-help', portalPartnerId: 'partnerA', problems: [{ n: 1, text: 'also run by stu006' }] }),
    plan('gen-homework-b', { kind: 'homework-help', portalPartnerId: 'partnerB', problems: [{ n: 1, text: 'partner B student' }] }),
    plan('gen-homework-bx', { kind: 'homework-help', portalPartnerId: 'partnerB', problems: [{ n: 1, text: 'partner B, named by A' }] }),
    plan('gen-materials-legacy', { generatedFromText: true, sourceKind: 'materials', portalPartnerId: 'partnerA' }),
    plan('gen-course', { generatedFromText: true, generatorOk: true, portalPartnerId: 'partnerA', cacheKey: 'k' }), // shared generated-course plan
    plan('curated-plan', {}),
  ]);
  const bankRow = (id: string, loId: string) => ({ id, loId, topic: 't', difficulty: 2, problemText: 'q', answer: 'a', license: 'internal-original', source: { name: 'x' } });
  await raw(ProblemBank, [
    bankRow('practice-gen.gen-homework-a.homework-lo-1.h1', 'gen-homework-a.homework-lo-1'), // variant of A's typed problem
    bankRow('practice-gen.gen-homework-b.homework-lo-1.h1', 'gen-homework-b.homework-lo-1'),
    bankRow('practice-gen.lo.shared.h1', 'lo.shared'),
    bankRow('curated-item', 'gen-homework-a.homework-lo-1'), // not a runtime-generated row
  ]);
  const audioSessions = ['sessA1', 'sessA2', 'sessB1', 'sessR', 'sessA3'];
  for (const id of audioSessions) {
    await fs.mkdir(path.join(audioRoot, id));
    await fs.writeFile(path.join(audioRoot, id, 'student.pcm16'), 'pcm');
  }
  const hasAudio = (id: string) => fs.stat(path.join(audioRoot, id)).then(() => true, () => false);
  const ids = async (m: { find(f: object): { lean(): Promise<unknown[]> } }, field: string) =>
    ((await m.find({}).lean()) as Array<Record<string, unknown>>).map((d) => String(d[field])).sort();

  try {
    console.log('\nErase partner A\'s "stu005" through the route (partner B has a "stu005" too):\n');

    const first = await erase('partnerA', SHARED);

    await test('200, contract-conformant, with a per-collection count for everything removed', async () => {
      assert.strictEqual(first.status, 200, JSON.stringify(first.json));
      StudentEraseResponseSchema.parse(first.json);
      assert.deepStrictEqual(first.json.deleted, {
        evidenceEvents: 1, learnerStateProjections: 1, learnerStateSnapshots: 1, eloRatings: 1,
        studentProfiles: 1, tutorSessions: 2, studentTopicNotes: 1, practiceAssignments: 1, mockAttempts: 1,
        practiceGenCounters: 1, reviewPlans: 1, homeworkPlans: 2, homeworkPracticeItems: 1, audioDirs: 2,
      });
      assert.deepStrictEqual(first.json.audio, { removed: 2, missing: 0, skipped: 0, failed: 0 });
    });
    await test('homework plans: the student\'s own are deleted — session-linked (no student id on the plan) and owner-stamped', async () => {
      assert.strictEqual(await LessonPlanModel.findById('gen-homework-a').lean(), null);
      assert.strictEqual(await LessonPlanModel.findById('gen-homework-stamped').lean(), null);
    });
    await test('homework plans: one another student\'s session also ran on is kept', async () => {
      assert.ok(await LessonPlanModel.findById('gen-homework-shared').lean());
    });
    await test('homework plans: another partner\'s are kept — B\'s own, and one A\'s profile merely names', async () => {
      assert.ok(await LessonPlanModel.findById('gen-homework-b').lean());
      assert.ok(await LessonPlanModel.findById('gen-homework-bx').lean());
    });
    await test('a generated-course plan and an unattributed materials plan are kept', async () => {
      assert.ok(await LessonPlanModel.findById('gen-course').lean());
      assert.ok(await LessonPlanModel.findById('gen-materials-legacy').lean());
    });
    await test('every plan that was skipped is counted by reason (the course plan is not homework, so not counted)', async () => {
      assert.deepStrictEqual(first.json.retained, {
        homeworkPlans: 3,
        homeworkPlanReasons: { sharedWithOtherStudent: 1, otherPartner: 1, unattributedMaterials: 1 },
      });
    });
    await test('practice items generated from the deleted plan\'s own LOs go with it; nothing else in the bank does', async () => {
      assert.deepStrictEqual(await ids(ProblemBank, 'id'), ['curated-item', 'practice-gen.gen-homework-b.homework-lo-1.h1', 'practice-gen.lo.shared.h1'].sort());
    });
    await test('profiles: only A\'s is gone', async () => {
      assert.deepStrictEqual(await ids(StudentProfileModel, '_id'), [A2, B].sort());
    });
    await test('learner model: only A\'s rows are gone; the shared Elo item row survives', async () => {
      assert.deepStrictEqual(await ids(EvidenceEventModel, 'studentId'), [A2, B].sort());
      assert.deepStrictEqual(await ids(LearnerStateProjectionModel, 'studentId'), [A2, B].sort());
      assert.deepStrictEqual(await ids(LearnerStateSnapshotModel, 'studentId'), [A2, B].sort());
      assert.deepStrictEqual(await ids(EloRatingModel, '_id'), ['item:shared-item', `student:${A2}|math`, `student:${B}|math`].sort());
    });
    await test('topic notes, homework, mock attempts: only A\'s are gone', async () => {
      assert.deepStrictEqual(await ids(StudentTopicNotesModel, 'studentId'), [A2, B].sort());
      assert.deepStrictEqual(await ids(PracticeAssignmentModel, 'studentId'), [A2, B].sort());
      assert.deepStrictEqual(await ids(MockAttempt, 'studentId'), [A2, B].sort());
    });
    await test('sessions: A\'s two are gone; B\'s "stu005", the unstamped one and A\'s other student survive', async () => {
      assert.deepStrictEqual(await ids(TutorSession, 'sessionId'), [`hw-${B}`, 'sessA3', 'sessB1', 'sessR'].sort());
    });
    await test('audio: exactly the erased sessions\' directories are gone', async () => {
      assert.deepStrictEqual(
        Object.fromEntries(await Promise.all(audioSessions.map(async (id) => [id, await hasAudio(id)]))),
        { sessA1: false, sessA2: false, sessB1: true, sessR: true, sessA3: true },
      );
    });
    await test('lesson plans: only A\'s review plan is gone; B\'s, the unattributed one and curated content stay', async () => {
      assert.deepStrictEqual(await ids(LessonPlanModel, '_id'), ['curated-plan', 'gen-course', 'gen-homework-b', 'gen-homework-bx', 'gen-homework-shared', 'gen-materials-legacy', 'rev-b', 'rev-legacy'].sort());
    });
    await test('generation counters: the deployment-wide row and the other student\'s row stay', async () => {
      assert.deepStrictEqual(await ids(PracticeGenCounter, 'scopeKey'), ['global', 'stu006::lo.1']);
    });

    console.log('\nIdempotency and unknown students:\n');

    await test('a second erase is a 200 with all-zero counts', async () => {
      const again = await erase('partnerA', SHARED);
      assert.strictEqual(again.status, 200);
      assert.ok(Object.values(again.json.deleted as Record<string, number>).every((n) => n === 0), JSON.stringify(again.json.deleted));
      assert.deepStrictEqual(again.json.audio, { removed: 0, missing: 0, skipped: 0, failed: 0 });
    });
    await test('erasing an unknown student deletes nothing and does NOT mint a profile', async () => {
      const before = await StudentProfileModel.countDocuments({});
      const res = await erase('partnerA', 'never-seen');
      assert.strictEqual(res.status, 200);
      assert.ok(Object.values(res.json.deleted as Record<string, number>).every((n) => n === 0));
      assert.strictEqual(await StudentProfileModel.countDocuments({}), before);
    });
    await test('partner B\'s student is still fully intact after all of the above', async () => {
      assert.ok(await StudentProfileModel.findById(B).lean());
      assert.strictEqual(await EvidenceEventModel.countDocuments({ studentId: B }), 1);
      assert.strictEqual(await TutorSession.countDocuments({ sourcePartnerId: 'partnerB' }), 2);
      assert.strictEqual(await hasAudio('sessB1'), true);
    });

    console.log('\nBare-id namespace (identity resolution off):\n');

    await raw(StudentProfileModel, [
      { _id: 'legacy-free', name: 'L', mastery: {}, gaps: [], recentSessions: [], preferences: {}, createdAt: iso, updatedAt: iso, schemaVersion: 1 },
      { _id: 'legacy-taken', partnerId: 'partnerB', externalStudentId: 'legacy-taken', name: 'T', mastery: {}, gaps: [], recentSessions: [], preferences: {}, createdAt: iso, updatedAt: iso, schemaVersion: 1 },
    ]);
    await raw(EvidenceEventModel, [
      { studentId: 'legacy-free', loId: 'lo.1', source: 'practice', outcome: 1, occurredAt: now, createdAt: now },
      { studentId: 'legacy-free', partnerId: 'partnerB', loId: 'lo.1', source: 'practice', outcome: 1, occurredAt: now, createdAt: now },
      { studentId: 'legacy-taken', partnerId: 'partnerB', loId: 'lo.1', source: 'practice', outcome: 1, occurredAt: now, createdAt: now },
    ]);
    await test('an unstamped bare-id profile is erased; evidence stamped with another partner is not', async () => {
      const res = await eraseStudentData({ partnerId: 'partnerA', externalStudentId: 'legacy-free' }, { resolutionEnabled: false, audioDir: audioRoot });
      assert.strictEqual(res.deleted.studentProfiles, 1);
      assert.strictEqual(res.deleted.evidenceEvents, 1);
      assert.strictEqual(await EvidenceEventModel.countDocuments({ studentId: 'legacy-free', partnerId: 'partnerB' }), 1);
    });
    await test('a bare-id profile stamped as another partner\'s is untouched', async () => {
      const res = await eraseStudentData({ partnerId: 'partnerA', externalStudentId: 'legacy-taken' }, { resolutionEnabled: false, audioDir: audioRoot });
      assert.ok(Object.values(res.deleted).every((n) => n === 0), JSON.stringify(res.deleted));
      assert.ok(await StudentProfileModel.findById('legacy-taken').lean());
      assert.strictEqual(await EvidenceEventModel.countDocuments({ studentId: 'legacy-taken' }), 1);
    });

    console.log('\nAudio that cannot be removed:\n');

    await test('route answers 500 erase_incomplete, keeps that session document, and a retry finishes the erase', async () => {
      // A read-only audio directory makes the real `rm` fail (EACCES) — the
      // route's own filesystem path, no fake. Root ignores the mode bits.
      if (process.getuid?.() === 0) { console.log('    (running as root — cannot make a directory undeletable; not exercised)'); return; }
      const realError = console.error;
      console.error = () => {};
      let blocked;
      await fs.chmod(audioRoot, 0o555);
      try {
        blocked = await erase('partnerA', 'stu006');
      } finally {
        await fs.chmod(audioRoot, 0o755);
        console.error = realError;
      }
      assert.strictEqual(blocked.status, 500, JSON.stringify(blocked.json));
      assert.strictEqual(blocked.json.error, 'erase_incomplete');
      assert.deepStrictEqual(blocked.json.audio, { removed: 0, missing: 0, skipped: 0, failed: 1 });
      assert.strictEqual(blocked.json.deleted.tutorSessions, 0);
      assert.strictEqual(blocked.json.deleted.studentProfiles, 1, 'everything else is still erased');
      assert.strictEqual(await TutorSession.countDocuments({ sessionId: 'sessA3' }), 1);
      assert.strictEqual(await hasAudio('sessA3'), true);

      const retry = await erase('partnerA', 'stu006');
      assert.strictEqual(retry.status, 200);
      assert.strictEqual(retry.json.deleted.tutorSessions, 1);
      assert.strictEqual(retry.json.deleted.audioDirs, 1);
      // The plan both of partner A's students ran on: kept while a session
      // still pointed at it, deleted with the last student who used it.
      assert.strictEqual(blocked.json.deleted.homeworkPlans, 0);
      assert.strictEqual(retry.json.deleted.homeworkPlans, 1);
      assert.strictEqual(await LessonPlanModel.findById('gen-homework-shared').lean(), null);
      assert.ok(await LessonPlanModel.findById('gen-course').lean(), 'the shared course plan outlives every student');
      assert.strictEqual(await hasAudio('sessA3'), false);
    });
  } finally {
    // Drop ONLY the throwaway database — re-checked by name at the point of
    // the drop, not trusted from the top of the file.
    try {
      if (mongoose.connection.name.startsWith(DB_PREFIX) && mongoose.connection.port === LOCAL_PORT) {
        // Let every model's background index build settle first: one still
        // in flight after the drop silently re-creates the database.
        await Promise.all(Object.values(mongoose.models).map((m) => m.init().catch(() => undefined)));
        await mongoose.connection.dropDatabase();
        const left = await mongoose.connection.db!.listCollections().toArray();
        if (left.length > 0) { console.error(`throwaway database ${TEST_DB} was not fully dropped`); failed++; }
      } else {
        console.error(`NOT dropping database ${mongoose.connection.name} — not the throwaway database`);
        failed++;
      }
    } finally {
      await mongoose.disconnect();
      await fs.rm(audioRoot, { recursive: true, force: true });
    }
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
