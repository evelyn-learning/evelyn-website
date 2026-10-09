/**
 * Student erase — hermetic unit tests for the two things that decide WHAT a
 * delete can reach: the partner scoping (which profile ids a caller owns,
 * and the Mongo filters built from them) and the audio-directory path
 * validation.
 *
 * No database, no network: MONGODB_URI is removed before anything is
 * imported, so nothing here can connect anywhere. The filters are evaluated
 * against sample documents with a small matcher that reproduces Mongo's
 * semantics for exactly the operators the erase uses. The audio rules run
 * against a throwaway temp directory.
 *
 * Usage: npx tsx scripts/test-student-erase.ts   (npm run test:student-erase)
 */
import assert from 'node:assert';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// `@core/db` captures MONGODB_URI at module load — clear it first so an
// inherited value can never turn this suite into one that touches a database.
delete process.env.MONGODB_URI;

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.log(`  ✗ ${name} — ${(err as Error).message}`); }
}

type Doc = Record<string, unknown>;
const getPath = (doc: Doc, key: string): unknown =>
  key.split('.').reduce<unknown>((v, k) => (v && typeof v === 'object' ? (v as Doc)[k] : undefined), doc);

/** Mongo match semantics for: equality, `null` (null OR missing), `$in`
 *  (where a `null` member also matches a missing field), `$regex`, `$or`. */
function matches(doc: Doc, filter: Doc): boolean {
  return Object.entries(filter).every(([key, cond]) => {
    if (key === '$or') return (cond as Doc[]).some((f) => matches(doc, f));
    const v = getPath(doc, key);
    if (cond === null) return v === null || v === undefined;
    if (cond && typeof cond === 'object') {
      const c = cond as { $in?: unknown[]; $regex?: string };
      if (c.$in) return c.$in.some((x) => (x === null ? v === null || v === undefined : x === v));
      if (c.$regex) return typeof v === 'string' && new RegExp(c.$regex).test(v);
      throw new Error(`matcher: unsupported operator in ${JSON.stringify(cond)}`);
    }
    return v === cond;
  });
}

(async () => {
  const { ownedProfileIds, usesBareIdNamespace, buildEraseFilters, sessionDeleteFilter, classifyHomeworkPlan } = await import('../src/lib/tutor/student-erase/erase');
  const { generatedPlanMetadata } = await import('../src/lib/tutor/lesson-plan/plan-generate-contract');
  const { isSafeSessionDirName, sessionAudioDirPath, removeSessionAudioDir, removeSessionAudioDirs } = await import('../src/lib/tutor/student-erase/audio-dir');
  const { deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');

  const A = { partnerId: 'partnerA', externalStudentId: 'stu005' };

  console.log('\nownedProfileIds — which profile ids a caller may erase:\n');

  await test('resolution ON: only the surrogate of the caller\'s (partner, student) pair', () => {
    assert.deepStrictEqual(
      ownedProfileIds({ identity: A, surrogateIds: ['uuid-a'], bareProfile: null, bareNamespace: false }),
      ['uuid-a'],
    );
  });
  await test('resolution ON: a profile stored under the bare id is NOT owned, even unstamped', () => {
    assert.deepStrictEqual(
      ownedProfileIds({ identity: A, surrogateIds: ['uuid-a'], bareProfile: {}, bareNamespace: false }),
      ['uuid-a'],
    );
  });
  await test('resolution ON, unknown student: nothing is owned', () => {
    assert.deepStrictEqual(ownedProfileIds({ identity: A, surrogateIds: [], bareProfile: null, bareNamespace: false }), []);
  });
  await test('bare-id namespace: the bare id is owned when no profile is stored under it', () => {
    assert.deepStrictEqual(ownedProfileIds({ identity: A, surrogateIds: [], bareProfile: null, bareNamespace: true }), ['stu005']);
  });
  await test('bare-id namespace: an unstamped bare profile is owned (today\'s behaviour, kept)', () => {
    assert.deepStrictEqual(ownedProfileIds({ identity: A, surrogateIds: [], bareProfile: { partnerId: null }, bareNamespace: true }), ['stu005']);
  });
  await test('bare-id namespace: a bare profile stamped as ANOTHER partner\'s is never owned', () => {
    assert.deepStrictEqual(
      ownedProfileIds({ identity: A, surrogateIds: [], bareProfile: { partnerId: 'partnerB', externalStudentId: 'stu005' }, bareNamespace: true }),
      [],
    );
  });
  await test('bare-id namespace: a bare profile stamped as the caller\'s but for a different student is not owned', () => {
    assert.deepStrictEqual(
      ownedProfileIds({ identity: A, surrogateIds: [], bareProfile: { partnerId: 'partnerA', externalStudentId: 'someone-else' }, bareNamespace: true }),
      [],
    );
  });
  await test('a backfilled profile (stamped, _id = bare id) is owned once, not twice', () => {
    assert.deepStrictEqual(
      ownedProfileIds({ identity: A, surrogateIds: ['stu005'], bareProfile: { partnerId: 'partnerA', externalStudentId: 'stu005' }, bareNamespace: true }),
      ['stu005'],
    );
  });
  await test('usesBareIdNamespace: trial ids always, everyone while resolution is off', () => {
    assert.strictEqual(usesBareIdNamespace('trial:abc', true), true);
    assert.strictEqual(usesBareIdNamespace('stu005', true), false);
    assert.strictEqual(usesBareIdNamespace('stu005', false), true);
  });

  console.log('\nbuildEraseFilters — every delete is scoped to the caller:\n');

  const f = buildEraseFilters({ identity: A, ownedIds: ['uuid-a'], linkedSessionIds: ['sess-linked'] });

  await test('profiles: the owned id, and never a row stamped with another partner', () => {
    assert.ok(matches({ _id: 'uuid-a', partnerId: 'partnerA' }, f.profiles));
    assert.ok(matches({ _id: 'uuid-a' }, f.profiles), 'unstamped legacy row under an owned id');
    assert.ok(!matches({ _id: 'uuid-a', partnerId: 'partnerB' }, f.profiles));
    assert.ok(!matches({ _id: 'uuid-b', partnerId: 'partnerA' }, f.profiles));
    assert.ok(!matches({ _id: 'stu005', partnerId: 'partnerB', externalStudentId: 'stu005' }, f.profiles), 'same external id, other partner');
  });
  await test('evidence / homework: owned id AND (caller\'s partner OR unstamped)', () => {
    assert.ok(matches({ studentId: 'uuid-a', partnerId: 'partnerA' }, f.byStudentIdAndPartner));
    assert.ok(matches({ studentId: 'uuid-a' }, f.byStudentIdAndPartner));
    assert.ok(!matches({ studentId: 'uuid-a', partnerId: 'partnerB' }, f.byStudentIdAndPartner));
    assert.ok(!matches({ studentId: 'stu005', partnerId: 'partnerA' }, f.byStudentIdAndPartner), 'the bare id is not owned here');
  });
  await test('partner-less stores are matched by owned ids only — never the bare id on its own', () => {
    assert.deepStrictEqual(f.byStudentId, { studentId: { $in: ['uuid-a'] } });
  });
  await test('sessions: ALWAYS require sourcePartnerId = caller', () => {
    assert.ok(matches({ sessionId: 's1', studentId: 'stu005', sourcePartnerId: 'partnerA' }, f.sessions));
    assert.ok(!matches({ sessionId: 's2', studentId: 'stu005', sourcePartnerId: 'partnerB' }, f.sessions), 'another partner\'s student with the same id');
    assert.ok(!matches({ sessionId: 's3', studentId: 'stu005' }, f.sessions), 'no partner stamp → not provably the caller\'s');
    assert.ok(!matches({ sessionId: 's4', studentId: 'stu006', sourcePartnerId: 'partnerA' }, f.sessions), 'the caller\'s OTHER student');
  });
  await test('sessions: a profile-linked session is included only when it has no student id of its own', () => {
    assert.ok(matches({ sessionId: 'sess-linked', sourcePartnerId: 'partnerA' }, f.sessions));
    assert.ok(!matches({ sessionId: 'sess-linked', studentId: 'stu006', sourcePartnerId: 'partnerA' }, f.sessions));
    assert.ok(!matches({ sessionId: 'sess-linked', sourcePartnerId: 'partnerB' }, f.sessions));
    assert.ok(!matches({ sessionId: 'sess-linked' }, f.sessions));
  });
  await test('sessions: with nothing linked there is no empty `$in` branch', () => {
    const g = buildEraseFilters({ identity: A, ownedIds: [] });
    assert.strictEqual((g.sessions.$or as unknown[]).length, 1);
    assert.ok(matches({ studentId: 'stu005', sourcePartnerId: 'partnerA' }, g.sessions));
  });
  await test('the second-stage session delete is still partner-scoped', () => {
    assert.deepStrictEqual(sessionDeleteFilter('partnerA', ['s1', 's2']), { sessionId: { $in: ['s1', 's2'] }, sourcePartnerId: 'partnerA' });
  });
  await test('generation counters: this student\'s keys only (regex metacharacters in an id are literal)', () => {
    assert.ok(matches({ scopeKey: 'stu005::lo.1' }, f.practiceGenCounters));
    assert.ok(matches({ scopeKey: 'uuid-a::lo.1' }, f.practiceGenCounters));
    assert.ok(!matches({ scopeKey: 'stu0055::lo.1' }, f.practiceGenCounters));
    assert.ok(!matches({ scopeKey: 'xstu005::lo.1' }, f.practiceGenCounters));
    assert.ok(!matches({ scopeKey: 'global' }, f.practiceGenCounters), 'the deployment-wide cap row is shared');
    const dotted = buildEraseFilters({ identity: { partnerId: 'partnerA', externalStudentId: 'a.b' }, ownedIds: [] });
    assert.ok(matches({ scopeKey: 'a.b::lo' }, dotted.practiceGenCounters));
    assert.ok(!matches({ scopeKey: 'axb::lo' }, dotted.practiceGenCounters));
  });
  await test('review plans: this student AND this partner; other plans never match', () => {
    assert.ok(matches({ metadata: { reviewPlan: true, studentId: 'stu005', partnerId: 'partnerA' } }, f.reviewPlans));
    assert.ok(!matches({ metadata: { reviewPlan: true, studentId: 'stu005', partnerId: 'partnerB' } }, f.reviewPlans));
    assert.ok(!matches({ metadata: { reviewPlan: true, studentId: 'stu005' } }, f.reviewPlans), 'a plan with no partner stamp cannot be attributed');
    assert.ok(!matches({ metadata: { generatedFromText: true, portalPartnerId: 'partnerA' } }, f.reviewPlans), 'shared generated plan');
    assert.ok(!matches({ metadata: {} }, f.reviewPlans), 'curated plan');
  });
  await test('deleteLearnerModelData with no ids returns zeros without touching the database', async () => {
    // MONGODB_URI is unset, so reaching connectDB() would throw.
    assert.deepStrictEqual(await deleteLearnerModelData([]), { evidenceEvents: 0, learnerStateProjections: 0, learnerStateSnapshots: 0, eloRatings: 0 });
  });

  console.log('\nclassifyHomeworkPlan — which plans go with the student:\n');

  const ctx = { partnerId: 'partnerA', ownedIds: ['uuid-a'], referencedElsewhere: new Set<string>() };
  const hw = (extra: Record<string, unknown> = {}) => ({ kind: 'homework-help', generatedFromText: true, portalPartnerId: 'partnerA', problems: [{ n: 1, text: 'x' }], ...extra });

  await test('a homework plan of the calling partner that nobody else references is deleted (no student id needed)', () => {
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: hw() }, ctx), 'delete');
  });
  await test('the same plan referenced by a surviving session / homework row is kept', () => {
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: hw() }, { ...ctx, referencedElsewhere: new Set(['gen-1']) }), 'sharedWithOtherStudent');
  });
  await test('a homework plan stamped with ANOTHER student is kept; stamped with this one is deleted', () => {
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: hw({ ownerStudentId: 'uuid-z' }) }, ctx), 'sharedWithOtherStudent');
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: hw({ ownerStudentId: 'uuid-a' }) }, ctx), 'delete');
  });
  await test('another partner\'s homework plan — or one with no partner stamp — is kept', () => {
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: hw({ portalPartnerId: 'partnerB' }) }, ctx), 'otherPartner');
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: hw({ portalPartnerId: undefined }) }, ctx), 'otherPartner');
  });
  await test('a generated-course / cached topic plan is never a per-student plan', () => {
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: { generatedFromText: true, generatorOk: true, portalPartnerId: 'partnerA', cacheKey: 'k' } }, ctx), 'notPerStudent');
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: { generatedFromText: true, portalPartnerId: 'partnerA', ownerStudentId: 'uuid-a' } }, ctx), 'notPerStudent', 'an owner stamp alone does not make a plan per-student');
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: null }, ctx), 'notPerStudent');
  });
  await test('a materials plan is deleted only with this student\'s owner stamp', () => {
    const m = (extra: Record<string, unknown> = {}) => ({ generatedFromText: true, sourceKind: 'materials', portalPartnerId: 'partnerA', ...extra });
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: m() }, ctx), 'unattributedMaterials');
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: m({ ownerStudentId: 'uuid-a' }) }, ctx), 'delete');
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: m({ ownerStudentId: 'uuid-z' }) }, ctx), 'sharedWithOtherStudent');
    assert.strictEqual(classifyHomeworkPlan({ _id: 'gen-1', metadata: m({ ownerStudentId: 'uuid-a', portalPartnerId: 'partnerB' }) }, ctx), 'otherPartner');
  });
  await test('only `gen-` ids are candidates — never a curated, review or freestyle plan, whatever its metadata says', () => {
    for (const id of ['evelyn.ap.stats.normal-distribution.v1', 'rev-123', 'freestyle-abc', 'freestyle-fallback-abc', 'xgen-1', '']) {
      assert.strictEqual(classifyHomeworkPlan({ _id: id, metadata: hw({ ownerStudentId: 'uuid-a' }) }, ctx), 'notPerStudent', id);
    }
  });
  await test('creation stamps the owner only when one is given (shared plans stay unstamped)', () => {
    const plan = { metadata: { kind: 'homework-help' } } as never;
    const base = { generatorOk: true, portalPartnerId: 'partnerA', sessionMinutes: 30 };
    assert.strictEqual(generatedPlanMetadata(plan, { ...base, ownerStudentId: 'uuid-a' }).ownerStudentId, 'uuid-a');
    assert.ok(!('ownerStudentId' in generatedPlanMetadata(plan, base)));
  });

  console.log('\nAudio directory — path validation:\n');

  const BASE = '/var/data/evelyn/audio';
  await test('ids the app mints are accepted and map to a direct child', () => {
    for (const id of ['embed-1759900000000', '3f2c9a1e-7b1d-4c55-9d2e-1a2b3c4d5e6f', '66f0c1e2a3b4c5d6e7f80912', 'sess_01']) {
      assert.strictEqual(sessionAudioDirPath(BASE, id), `${BASE}/${id}`);
    }
  });
  await test('traversal, separators, dots and absolute paths are refused', () => {
    for (const id of ['..', '.', '../other', '../../etc', 'a/b', 'a\\b', '/etc/passwd', '/var/data/evelyn/audio/x', 'a..b', 'x/../y', '%2e%2e', 'sess 1', 'sess\n1', 'sess\0', '~', '*']) {
      assert.strictEqual(isSafeSessionDirName(id), false, `must refuse ${JSON.stringify(id)}`);
      assert.strictEqual(sessionAudioDirPath(BASE, id), null, `must refuse ${JSON.stringify(id)}`);
    }
  });
  await test('empty, over-long and non-string ids are refused', () => {
    for (const id of ['', 'a'.repeat(129), undefined, null, 42, ['a'], { toString: () => 'a' }]) {
      assert.strictEqual(sessionAudioDirPath(BASE, id), null);
    }
  });
  await test('a missing or relative base directory is refused', () => {
    assert.strictEqual(sessionAudioDirPath('', 'sess1'), null);
    assert.strictEqual(sessionAudioDirPath('relative/audio', 'sess1'), null);
  });

  console.log('\nAudio directory — removal against a temp directory:\n');

  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'evelyn-erase-unit-'));
  try {
    const audio = path.join(root, 'audio');
    const outside = path.join(root, 'outside');
    await fs.mkdir(path.join(audio, 'sess-a'), { recursive: true });
    await fs.writeFile(path.join(audio, 'sess-a', 'student.pcm16'), 'pcm');
    await fs.mkdir(path.join(audio, 'sess-b'), { recursive: true });
    await fs.writeFile(path.join(audio, 'sess-b', 'tutor.pcm16'), 'pcm');
    await fs.mkdir(outside, { recursive: true });
    await fs.writeFile(path.join(outside, 'keep.txt'), 'keep');
    await fs.writeFile(path.join(audio, 'plainfile'), 'not a dir');
    await fs.symlink(outside, path.join(audio, 'link-out'));
    await fs.symlink(path.join(audio, 'sess-b'), path.join(audio, 'link-in'));
    const exists = (p: string) => fs.stat(p).then(() => true, () => false);

    await test('removes exactly the named session directory', async () => {
      assert.strictEqual(await removeSessionAudioDir(audio, 'sess-a'), 'removed');
      assert.strictEqual(await exists(path.join(audio, 'sess-a')), false);
      assert.strictEqual(await exists(path.join(audio, 'sess-b', 'tutor.pcm16')), true);
    });
    await test('idempotent: a directory that is already gone is "missing", not an error', async () => {
      assert.strictEqual(await removeSessionAudioDir(audio, 'sess-a'), 'missing');
      assert.strictEqual(await removeSessionAudioDir(audio, 'never-existed'), 'missing');
    });
    await test('a traversal id deletes nothing', async () => {
      assert.strictEqual(await removeSessionAudioDir(audio, '../outside'), 'skipped');
      assert.strictEqual(await removeSessionAudioDir(audio, '..'), 'skipped');
      assert.strictEqual(await removeSessionAudioDir(audio, outside), 'skipped');
      assert.strictEqual(await exists(path.join(outside, 'keep.txt')), true);
      assert.strictEqual(await exists(audio), true);
    });
    await test('a symlink out of the audio directory is not followed', async () => {
      assert.strictEqual(await removeSessionAudioDir(audio, 'link-out'), 'skipped');
      assert.strictEqual(await exists(path.join(outside, 'keep.txt')), true);
    });
    await test('a symlink to ANOTHER session\'s directory is not followed', async () => {
      assert.strictEqual(await removeSessionAudioDir(audio, 'link-in'), 'skipped');
      assert.strictEqual(await exists(path.join(audio, 'sess-b', 'tutor.pcm16')), true);
    });
    await test('a plain file where a directory is expected is left alone', async () => {
      assert.strictEqual(await removeSessionAudioDir(audio, 'plainfile'), 'skipped');
      assert.strictEqual(await exists(path.join(audio, 'plainfile')), true);
    });
    await test('a base directory reached through a symlink still resolves to one place', async () => {
      const viaLink = path.join(root, 'audio-link');
      await fs.symlink(audio, viaLink);
      await fs.mkdir(path.join(audio, 'sess-c'));
      assert.strictEqual(await removeSessionAudioDir(viaLink, 'sess-c'), 'removed');
      assert.strictEqual(await exists(path.join(audio, 'sess-c')), false);
    });
    await test('no audio directory at all is "missing"', async () => {
      assert.strictEqual(await removeSessionAudioDir(path.join(root, 'no-such-dir'), 'sess-a'), 'missing');
    });
    await test('a filesystem error is reported as "failed" and never thrown', async () => {
      const realError = console.error;
      console.error = () => {};
      try {
        const io = {
          realpath: async (p: string) => p,
          lstat: async () => ({ isDirectory: () => true, isSymbolicLink: () => false }),
          rm: async () => { throw Object.assign(new Error('EACCES'), { code: 'EACCES' }); },
        };
        assert.strictEqual(await removeSessionAudioDir('/audio', 'sess-x', io), 'failed');
        const summary = await removeSessionAudioDirs('/audio', ['sess-x', 'sess-x', '../bad'], io);
        assert.deepStrictEqual(
          { removed: summary.removed, missing: summary.missing, skipped: summary.skipped, failed: summary.failed },
          { removed: 0, missing: 0, skipped: 1, failed: 1 },
          'duplicates are attempted once',
        );
        assert.deepStrictEqual(summary.failedSessionIds, ['sess-x']);
        assert.deepStrictEqual(summary.skippedSessionIds, ['../bad']);
      } finally {
        console.error = realError;
      }
    });
    await test('rm is only ever called on a direct child of the real base directory', async () => {
      const calls: string[] = [];
      const io = {
        realpath: async (p: string) => p,
        lstat: async () => ({ isDirectory: () => true, isSymbolicLink: () => false }),
        rm: async (p: string) => { calls.push(p); },
      };
      for (const id of ['ok-1', '../x', '/abs', 'a/b', '..', 'ok_2']) await removeSessionAudioDir('/audio', id, io);
      assert.deepStrictEqual(calls, ['/audio/ok-1', '/audio/ok_2']);
    });
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
