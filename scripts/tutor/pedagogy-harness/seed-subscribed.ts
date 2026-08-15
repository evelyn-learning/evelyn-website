/// <reference types="node" />
/**
 * Task H2 — seed the engine's Mongo with StudentProfiles for the SUBSCRIBED
 * pedagogy-harness personas, so `/tutor?studentId=pedagogy-<id>` sessions
 * (driven via run-harness.ts) load a real cross-session profile block
 * (mastery, gaps, prior sessions) matching each fixture.
 *
 * Usage:
 *   npm run test:pedagogy-seed              # upsert all 6 (idempotent)
 *   npm run test:pedagogy-seed -- --cleanup # delete EXACTLY those 6 ids
 *
 * SAFETY (the dev MONGODB_URI may be a tunnel to production):
 *   - refuses to run without MONGODB_URI;
 *   - every id it writes/deletes is namespaced `pedagogy-<personaId>` and
 *     asserted to carry that prefix before any DB call;
 *   - cleanup deletes by EXACT id list ($in), never by pattern/prefix query;
 *   - upserts go through the engine's own store (saveStudentProfile), and
 *     a connect is forced FIRST via connectDB — the store's silent
 *     ephemeral-Map fallback (its behavior when the DB is down) can then
 *     never masquerade as a successful seed.
 *
 * Prior sessions: the fixtures ship `recentSessions: []`, but the whole
 * point of these personas is the RETURNING-student journey — so this seed
 * synthesizes one SessionMemory per persona (from the fixture's own
 * mastery/topic data) so the profile block's "prior sessions" section
 * renders and OpeningSignals.hasPriorSessions resolves true.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env

import * as path from 'path';
import { fileURLToPath } from 'url';
import { loadPersona, PERSONA_IDS, type Persona } from './fixtures/personas';

// Type-only (erased at runtime — safe to import statically).
import type { StudentProfile, SessionMemory } from '../../../src/lib/tutor/student-profile/types';

// The DB modules are loaded DYNAMICALLY inside main(): src/lib/db captures
// process.env.MONGODB_URI in a module-level const, and static imports are
// hoisted ABOVE the dotenv.config() calls — a static import would freeze
// MONGODB_URI as undefined before .env.local was read (observed on the
// first run of this script: "MONGODB_URI not configured" despite dotenv
// reporting 66 injected vars).
async function loadDbModules() {
  const [{ connectDB }, { StudentProfileModel }, { saveStudentProfile }, mongoose] = await Promise.all([
    import('@core/db'),
    import('../../../src/models/StudentProfile'),
    import('../../../src/lib/tutor/student-profile/store'),
    import('mongoose'),
  ]);
  return { connectDB, StudentProfileModel, saveStudentProfile, mongoose: mongoose.default };
}

const NAMESPACE_PREFIX = 'pedagogy-';

/** The 6 subscribed personas (mode check re-asserted at load time below). */
const SUBSCRIBED_IDS = ['priya', 'noah', 'zoe', 'kai', 'diego', 'ravi'] as const;

function namespacedId(personaId: string): string {
  const id = `${NAMESPACE_PREFIX}${personaId}`;
  // Belt-and-suspenders: nothing without the namespace ever reaches the DB.
  if (!id.startsWith(NAMESPACE_PREFIX)) throw new Error(`refusing non-namespaced id "${id}"`);
  return id;
}

/** Build the engine StudentProfile to upsert: the fixture's `profile`
 *  re-keyed to the namespaced id, plus one synthesized prior-session
 *  memory (see header). Deterministic — re-runs upsert the same doc.
 *
 *  noah (the subscribed-NEW persona) carries no engine profile fixture on
 *  purpose — his journey is "first session ever" — so he seeds an EMPTY
 *  profile (name/grade/preferences from studentContext) with ZERO prior
 *  sessions, keeping OpeningSignals.hasPriorSessions=false for him. */
export function buildSeedProfile(persona: Persona): StudentProfile {
  const id = namespacedId(persona.id);
  const fx = persona.profile as StudentProfile | undefined;

  if (!fx) {
    const ctx = persona.studentContext as
      | { profile?: { name?: string; grade?: string }; preferences?: StudentProfile['preferences'] }
      | undefined;
    const now = new Date().toISOString();
    return {
      id,
      name: ctx?.profile?.name,
      grade: ctx?.profile?.grade,
      mastery: {},
      gaps: [],
      recentSessions: [],
      preferences: ctx?.preferences ?? {},
      createdAt: now,
      updatedAt: now,
      schemaVersion: 1,
    };
  }

  const losTouched = Object.keys(fx.mastery ?? {});
  const priorSession: SessionMemory = {
    // diego's fixture gap cites sessionId "s-diego-diag-1" — reuse the cited
    // id so gap.sessionIds stays consistent with the session memory.
    sessionId: persona.id === 'diego' ? 's-diego-diag-1' : `pedagogy-seed-${persona.id}-1`,
    endedAt: fx.updatedAt,
    grade: fx.grade,
    topic: persona.simProfile.topic,
    losTouched,
    summary: `Worked on ${persona.simProfile.topic}. ${persona.simProfile.actualLevel}.`,
    durationMinutes: 25,
  };

  return {
    ...fx,
    id,
    recentSessions: [priorSession],
  };
}

async function main(): Promise<void> {
  const cleanup = process.argv.includes('--cleanup');

  if (!process.env.MONGODB_URI) {
    console.error(
      '[pedagogy-seed] REFUSING to run: MONGODB_URI is not set (checked .env.local / .env). ' +
        'This script must talk to the same DB the dev server uses.',
    );
    process.exit(1);
  }

  const { connectDB, StudentProfileModel, saveStudentProfile, mongoose } = await loadDbModules();

  // Fail loudly if the DB is unreachable — otherwise saveStudentProfile's
  // ephemeral-Map fallback would swallow every write.
  await connectDB();

  const ids = SUBSCRIBED_IDS.map((pid) => namespacedId(pid));

  if (cleanup) {
    for (const id of ids) {
      if (!id.startsWith(NAMESPACE_PREFIX)) throw new Error(`refusing to delete non-namespaced id "${id}"`);
    }
    const res = await StudentProfileModel.deleteMany({ _id: { $in: ids } });
    console.log(`[pedagogy-seed] cleanup: deleted ${res.deletedCount}/${ids.length} namespaced profiles`);
    console.log(`[pedagogy-seed] ids: ${ids.join(', ')}`);
    await mongoose.disconnect();
    return;
  }

  const rows: Array<{ personaId: string; studentId: string; priorSessions: number }> = [];
  for (const personaId of SUBSCRIBED_IDS) {
    const persona = loadPersona(personaId);
    if (persona.mode !== 'subscribed') throw new Error(`persona "${personaId}" is not subscribed — refusing to seed`);
    const profile = buildSeedProfile(persona);
    await saveStudentProfile(profile);
    // Read back through the model so the summary reflects what actually
    // landed in Mongo (not the store's ephemeral fallback).
    const doc = await StudentProfileModel.findById(profile.id).lean();
    if (!doc) throw new Error(`seed verification failed: ${profile.id} not found after upsert`);
    rows.push({
      personaId,
      studentId: profile.id,
      priorSessions: Array.isArray(doc.recentSessions) ? doc.recentSessions.length : 0,
    });
  }

  console.log('\n[pedagogy-seed] seeded subscribed personas (idempotent upserts):\n');
  console.log('  persona | studentId        | prior sessions');
  console.log('  --------|------------------|---------------');
  for (const r of rows) {
    console.log(`  ${r.personaId.padEnd(7)} | ${r.studentId.padEnd(16)} | ${r.priorSessions}`);
  }
  console.log('\n  cleanup: npm run test:pedagogy-seed -- --cleanup');
  await mongoose.disconnect();
}

// personas index sanity — every subscribed id here must be a real fixture.
for (const pid of SUBSCRIBED_IDS) {
  if (!(PERSONA_IDS as readonly string[]).includes(pid)) {
    throw new Error(`seed-subscribed: "${pid}" is not a known persona id`);
  }
}

// Run only when invoked directly (same isMainModule pattern as cli.ts) —
// buildSeedProfile is imported by the driver unit tests, which must never
// touch the DB.
const isMainModule = (() => {
  try {
    return !!process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
  } catch {
    return false;
  }
})();

if (isMainModule) {
  main().catch((err) => {
    console.error('[pedagogy-seed] FAIL:', err);
    process.exit(1);
  });
}
