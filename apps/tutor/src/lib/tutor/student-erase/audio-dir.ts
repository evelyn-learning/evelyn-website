/**
 * Student erase — removal of a session's recorded audio from disk.
 *
 * Audio is written by `src/app/api/tutor/session-audio/route.ts` under
 * `<TUTOR_AUDIO_DIR>/<sessionId>/` (`student.pcm16`, `tutor.pcm16`, the
 * `.meta.json` sidecars). This module is the ONLY place the erase path turns
 * a session id into a path it then deletes recursively, so every rule that
 * keeps that delete inside the audio directory lives here:
 *
 *   1. The session id must already BE the directory name. The audio route
 *      names the directory by stripping every character outside
 *      `[A-Za-z0-9_-]` from the id, so an id carrying any other character
 *      maps onto a directory that a DIFFERENT session id can also map onto
 *      (`a.b` and `ab` share `ab/`). Such an id is refused, never
 *      "sanitized and deleted" — refusing leaves an orphan directory, which
 *      is recoverable; deleting the wrong student's audio is not.
 *   2. The resolved path must be a DIRECT child of the audio directory.
 *   3. The entry itself must be a real directory, not a symlink — a
 *      recursive delete through a link would empty whatever it points at.
 *   4. The audio directory is compared by its REAL path, so a base dir that
 *      is itself reached through a symlink still resolves to one location.
 *
 * All filesystem access goes through an injectable `AudioFs` so the rules
 * are unit-tested against a temp directory and a fake, never the real
 * recordings volume.
 */

import fs from 'fs/promises';
import path from 'path';

/** Same default as the session-audio route — the two must agree, or erase
 *  would look for recordings somewhere they were never written. */
export function audioBaseDir(): string {
  return process.env.TUTOR_AUDIO_DIR || '/var/data/evelyn/audio';
}

/** The audio route's directory-name alphabet. 128 is far above any id the
 *  app mints (`embed-<ms>`, UUIDs, ObjectIds) and keeps a pathological id
 *  from becoming a pathological path. */
const SESSION_DIR_NAME = /^[A-Za-z0-9_-]{1,128}$/;

export function isSafeSessionDirName(sessionId: unknown): sessionId is string {
  return typeof sessionId === 'string' && SESSION_DIR_NAME.test(sessionId);
}

/**
 * The directory a session's audio lives in, or null when the id cannot be
 * trusted to name exactly one direct child of `baseDir`. Pure — touches no
 * disk; the symlink checks happen in `removeSessionAudioDir`.
 */
export function sessionAudioDirPath(baseDir: string, sessionId: unknown): string | null {
  if (!baseDir || !path.isAbsolute(baseDir)) return null;
  if (!isSafeSessionDirName(sessionId)) return null;
  const base = path.resolve(baseDir);
  const candidate = path.resolve(base, sessionId);
  // Belt and braces: the alphabet above already excludes separators and
  // dots, so these can only fail if that regex is ever loosened.
  if (path.dirname(candidate) !== base) return null;
  if (path.basename(candidate) !== sessionId) return null;
  return candidate;
}

export interface AudioFs {
  realpath(p: string): Promise<string>;
  lstat(p: string): Promise<{ isDirectory(): boolean; isSymbolicLink(): boolean }>;
  rm(p: string, opts: { recursive: boolean; force: boolean }): Promise<void>;
}

const nodeFs: AudioFs = {
  realpath: (p) => fs.realpath(p),
  lstat: (p) => fs.lstat(p),
  rm: (p, opts) => fs.rm(p, opts),
};

export type AudioRemoval =
  /** The directory existed and is gone. */
  | 'removed'
  /** Nothing on disk for this session (text session, or already erased). */
  | 'missing'
  /** Refused by a safety rule — nothing was deleted. */
  | 'skipped'
  /** The filesystem refused; the directory may still be there. */
  | 'failed';

const isNotFound = (err: unknown): boolean => (err as { code?: string } | null)?.code === 'ENOENT';

/** Remove one session's audio directory. Never throws. */
export async function removeSessionAudioDir(
  baseDir: string,
  sessionId: unknown,
  io: AudioFs = nodeFs,
): Promise<AudioRemoval> {
  const candidate = sessionAudioDirPath(baseDir, sessionId);
  if (!candidate) return 'skipped';
  try {
    let realBase: string;
    try {
      realBase = await io.realpath(path.resolve(baseDir));
    } catch (err) {
      // No audio directory at all (a deployment that never recorded).
      if (isNotFound(err)) return 'missing';
      throw err;
    }
    const target = path.join(realBase, path.basename(candidate));
    let stat: Awaited<ReturnType<AudioFs['lstat']>>;
    try {
      stat = await io.lstat(target);
    } catch (err) {
      if (isNotFound(err)) return 'missing';
      throw err;
    }
    // lstat does not follow links: a symlink (to a directory or anything
    // else) and a plain file are both "not this session's audio directory".
    if (stat.isSymbolicLink() || !stat.isDirectory()) return 'skipped';
    // A directory's real path is its parent's real path plus its own name;
    // anything else means the entry is not where it claims to be.
    if ((await io.realpath(target)) !== target) return 'skipped';
    await io.rm(target, { recursive: true, force: false });
    return 'removed';
  } catch (err) {
    console.error(`[student-erase] audio removal failed for session ${String(sessionId)}:`, err);
    return 'failed';
  }
}

export interface AudioRemovalSummary {
  removed: number;
  missing: number;
  skipped: number;
  failed: number;
  /** Session ids whose directory could not be removed — the caller keeps
   *  their session documents so a retry still knows which ids to clean. */
  failedSessionIds: string[];
  /** Session ids refused by a safety rule (logged for manual cleanup). */
  skippedSessionIds: string[];
}

/** Remove the audio directories of many sessions, one at a time (a student
 *  has tens of sessions, not thousands; serial keeps disk errors legible). */
export async function removeSessionAudioDirs(
  baseDir: string,
  sessionIds: readonly string[],
  io: AudioFs = nodeFs,
): Promise<AudioRemovalSummary> {
  const out: AudioRemovalSummary = { removed: 0, missing: 0, skipped: 0, failed: 0, failedSessionIds: [], skippedSessionIds: [] };
  for (const sessionId of Array.from(new Set(sessionIds))) {
    const result = await removeSessionAudioDir(baseDir, sessionId, io);
    out[result] += 1;
    if (result === 'failed') out.failedSessionIds.push(sessionId);
    if (result === 'skipped') out.skippedSessionIds.push(sessionId);
  }
  return out;
}
