/**
 * Student profile storage + mutation helpers.
 *
 * Two layers:
 *   - persistence (MongoDB) for retail-logged-in students and B2B
 *     partners with persistent ids.
 *   - in-memory shim for the demo flow where there's no persistent
 *     identity. The shim is keyed by sessionId → ephemeral profile;
 *     the brain still gets a profile to read, but nothing survives
 *     the session.
 *
 * Load semantics: getOrCreate(id) — never returns null. A new profile
 * is empty (no mastery, no gaps, no recent sessions) but valid.
 *
 * Mutation helpers are designed to be called at session END, not
 * mid-turn. Mid-turn updates are accumulated in a SessionAccumulator
 * (lives in the orchestrator) and committed in one shot.
 */

import connectDB from '@/lib/db';
import { StudentProfileModel, toStudentProfile, type IStudentProfileDoc } from '@/models/StudentProfile';
import {
  type StudentProfile,
  type MasteryEntry,
  type GapEntry,
  type SessionMemory,
  STUDENT_PROFILE_SCHEMA_VERSION,
  RECENT_SESSIONS_CAP,
} from './types';

/** Ephemeral fallback when DB is unavailable (demo / unauthenticated). */
const ephemeralStore = new Map<string, StudentProfile>();

function emptyProfile(id: string): StudentProfile {
  const now = new Date().toISOString();
  return {
    id,
    mastery: {},
    gaps: [],
    recentSessions: [],
    preferences: {},
    createdAt: now,
    updatedAt: now,
    schemaVersion: STUDENT_PROFILE_SCHEMA_VERSION,
  };
}

export async function getOrCreateStudentProfile(id: string): Promise<StudentProfile> {
  if (!id) throw new Error('getOrCreateStudentProfile: id is required');
  // DB path — falls back to ephemeral on error.
  try {
    await connectDB();
    const doc = await StudentProfileModel.findById(id);
    if (doc) return toStudentProfile(doc as IStudentProfileDoc);
    const fresh = emptyProfile(id);
    await StudentProfileModel.create({ _id: id, ...fresh });
    return fresh;
  } catch {
    const cached = ephemeralStore.get(id);
    if (cached) return cached;
    const fresh = emptyProfile(id);
    ephemeralStore.set(id, fresh);
    return fresh;
  }
}

export async function getStudentProfile(id: string): Promise<StudentProfile | null> {
  if (!id) return null;
  try {
    await connectDB();
    const doc = await StudentProfileModel.findById(id);
    return doc ? toStudentProfile(doc as IStudentProfileDoc) : null;
  } catch {
    return ephemeralStore.get(id) ?? null;
  }
}

/** Save a profile. Updates `updatedAt` and prunes recentSessions. */
export async function saveStudentProfile(profile: StudentProfile): Promise<StudentProfile> {
  const next: StudentProfile = {
    ...profile,
    recentSessions: profile.recentSessions.slice(-RECENT_SESSIONS_CAP),
    updatedAt: new Date().toISOString(),
    schemaVersion: STUDENT_PROFILE_SCHEMA_VERSION,
  };
  try {
    await connectDB();
    await StudentProfileModel.findByIdAndUpdate(
      next.id,
      { $set: next },
      { upsert: true, new: true },
    );
  } catch {
    ephemeralStore.set(next.id, next);
  }
  return next;
}

/** Apply a list of mastery deltas to a profile. Each delta nudges the
 *  per-LO score toward 1 (for positive) or 0 (for negative), bounded
 *  to [0,1]. Exposures increment by 1 per delta. lastTouchedAt updates
 *  to now. Returns the mutated profile (does not save). */
export function applyMasteryDeltas(
  profile: StudentProfile,
  deltas: Array<{ loId: string; delta: number }>,
): StudentProfile {
  const now = new Date().toISOString();
  const mastery = { ...profile.mastery };
  for (const { loId, delta } of deltas) {
    if (!loId) continue;
    const prev: MasteryEntry = mastery[loId] ?? {
      loId, score: 0.5, exposures: 0, lastTouchedAt: now,
    };
    // Step toward 1 for positive, toward 0 for negative.
    const target = delta >= 0 ? 1 : 0;
    const stepSize = Math.min(1, Math.abs(delta));
    const score = prev.score + (target - prev.score) * stepSize * 0.4;
    mastery[loId] = {
      loId,
      score: Math.max(0, Math.min(1, score)),
      exposures: prev.exposures + 1,
      lastTouchedAt: now,
      confidence: prev.exposures + 1 >= 5 ? 'high' : prev.exposures + 1 >= 2 ? 'medium' : 'low',
    };
  }
  return { ...profile, mastery };
}

/** Append a gap entry. If a gap with the same loId+description already
 *  exists, update its lastSeenAt instead of duplicating. */
export function recordGap(
  profile: StudentProfile,
  gap: Omit<GapEntry, 'id' | 'firstSeenAt' | 'lastSeenAt' | 'status'> & { status?: GapEntry['status'] },
): StudentProfile {
  const now = new Date().toISOString();
  const existing = profile.gaps.find(
    (g) => g.loId === gap.loId && g.description === gap.description && g.status === 'open',
  );
  if (existing) {
    return {
      ...profile,
      gaps: profile.gaps.map((g) => (g === existing ? { ...g, lastSeenAt: now } : g)),
    };
  }
  const newGap: GapEntry = {
    id: `gap_${Math.random().toString(36).slice(2, 10)}`,
    loId: gap.loId,
    description: gap.description,
    status: gap.status ?? 'open',
    firstSeenAt: now,
    lastSeenAt: now,
  };
  return { ...profile, gaps: [...profile.gaps, newGap] };
}

/** Append a session memory entry. */
export function appendSessionMemory(profile: StudentProfile, memory: SessionMemory): StudentProfile {
  return { ...profile, recentSessions: [...profile.recentSessions, memory] };
}
