import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@core/db';
import { TutorSession } from '@/models';
import { verifyReplayTokenAsync } from '@/lib/tutor/portal/replay-token';
import { resolveAudioFinalize } from '@/lib/tutor/recordings/finalize-audio';
import {
  createKeyedSerializer,
  nextAttemptAnchors,
  parseAttemptAnchors,
  saneAnchorParams,
  type AttemptAnchor,
} from '@/lib/tutor/recordings/attempt-anchors';

const AUDIO_BASE_DIR = process.env.TUTOR_AUDIO_DIR || '/var/data/evelyn/audio';

function sanitizeSessionId(id: string): string {
  // Only allow alphanumeric, dashes, underscores
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

function validateRole(role: string): role is 'student' | 'tutor' {
  return role === 'student' || role === 'tutor';
}

// Sidecar base fields. Capture always stores 24 kHz mono PCM16.
const META_BASE = { sampleRate: 24000, channels: 1, bitDepth: 16, format: 'pcm16' } as const;

async function readMeta(metaPath: string): Promise<Record<string, unknown>> {
  try {
    const parsed = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {}; // absent (not finalized, pre-anchor recording) or unreadable
  }
}

// Write-then-rename so a reader (replay GET, a concurrent finalize) never
// sees a half-written sidecar.
async function writeMetaAtomic(metaPath: string, meta: Record<string, unknown>): Promise<void> {
  const tmp = `${metaPath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(meta, null, 2));
  await fs.rename(tmp, metaPath);
}

// One writer at a time per track (`sessionDir` + role) for everything that
// reads the file size or read-modify-writes the sidecar: a chunk POST and a
// finalize for the same track used to interleave and drop each other's
// sidecar fields (`attempts` vs `finalizedAt`/`totalChunks`). In-process is
// enough — the tutor app runs as a single Node process under pm2.
const withTrackLock = createKeyedSerializer();
const trackLockKey = (sessionDir: string, role: string): string => `${sessionDir}\0${role}`;

function finiteParam(raw: string | null): number | null {
  if (raw === null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

// POST: Receive audio chunk and append to file.
//
// Request format: raw PCM16 bytes in the request body (Content-Type
// application/octet-stream), with metadata in the URL query string:
//   ?sessionId=<id>&role=student|tutor&chunkIndex=<n>&finalize=<bool>
//   [&attemptStartMs=<epoch ms>&attemptBytesBefore=<n>]  (per-attempt anchor,
//   2026-10-03 — see lib/tutor/recordings/attempt-anchors.ts; absent from
//   clients running JS cached from before that change)
//
// Switched from base64-in-JSON after the 2026-04-24 regression where
// long-session flushes hit the 10MB middleware JSON-body cap ("Unterminated
// string in JSON at position 10436608"). Raw binary is ~25% smaller than
// base64 AND skips the JSON parser, so a single request no longer holds
// the entire payload as a string in memory during parse.
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const role = searchParams.get('role');
    const chunkIndexStr = searchParams.get('chunkIndex');
    const finalize = searchParams.get('finalize') === 'true';

    if (!sessionId || !role || !validateRole(role)) {
      return NextResponse.json({ error: 'Invalid sessionId or role' }, { status: 400 });
    }

    const chunkIndex = chunkIndexStr ? Number.parseInt(chunkIndexStr, 10) : 0;
    const safeId = sanitizeSessionId(sessionId);
    const sessionDir = path.join(AUDIO_BASE_DIR, safeId);

    // Ensure directory exists
    await fs.mkdir(sessionDir, { recursive: true });

    if (finalize) {
      // 2026-08-17 triage: the unload beacon finalizes even for sessions
      // that never uploaded a chunk (dead pre-start sessions) — writing the
      // meta sidecar and setting hasAudio for a track with no bytes is what
      // produced the admin "audio-flag-drift" class. Decide from what's
      // actually on disk (rule + tests: recordings/finalize-audio.ts).
      // Under the track lock: the sidecar read-modify-write below must not
      // interleave with a chunk POST's (which would lose its anchor, or this
      // finalize's fields).
      const { writeMeta, markHasAudio } = await withTrackLock(trackLockKey(sessionDir, role), async () => {
        const pcmBytes = await fs
          .stat(path.join(sessionDir, `${role}.pcm16`))
          .then((s) => s.size)
          .catch(() => null);
        const decision = resolveAudioFinalize({ pcmBytes });

        if (decision.writeMeta) {
          const metaPath = path.join(sessionDir, `${role}.meta.json`);
          // Carry the attempt anchors over: the sidecar may already exist (it
          // is now written when an attempt's first chunk lands), and a resumed
          // session finalizes once per attempt.
          const attempts = parseAttemptAnchors((await readMeta(metaPath)).attempts);
          const meta = {
            ...META_BASE,
            totalChunks: chunkIndex,
            finalizedAt: new Date().toISOString(),
            ...(attempts.length > 0 ? { attempts } : {}),
          };
          await writeMetaAtomic(metaPath, meta);
        }
        return decision;
      });

      if (markHasAudio) {
        try {
          await connectDB();
          await TutorSession.updateOne(
            { sessionId: safeId },
            { $set: { hasAudio: true } }
          );
        } catch (dbErr) {
          console.error('[session-audio] Failed to update hasAudio:', dbErr);
        }
      }

      return NextResponse.json({ success: true, finalized: writeMeta, empty: !writeMeta });
    }

    // Read raw PCM16 bytes from the body stream. Empty body → skip (the
    // client sometimes sends an empty final chunk just before finalize).
    const arrayBuffer = await request.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(sessionDir, `${role}.pcm16`);

    // Per-attempt anchor: where this recording attempt begins in the file and
    // which wall-clock origin its audio is aligned to. A resumed mount
    // restarts its sample counter at 0 and we append at the existing end of
    // file, so without this the replay cannot place attempt 2+ (or know that
    // only the gap BETWEEN attempts is collapsed). Recorded BEFORE the append
    // so the offset is the true start; best-effort — a failed sidecar write
    // must never cost the audio, and the next chunk re-derives the anchor.
    //
    // The whole "measure file → update sidecar → append" runs under the track
    // lock, so a concurrent chunk cannot measure the same pre-append size and
    // a concurrent finalize cannot overwrite the sidecar in between.
    await withTrackLock(trackLockKey(sessionDir, role), async () => {
      try {
        const fileBytes = await fs.stat(filePath).then((s) => s.size).catch(() => 0);
        // The params come from an unauthenticated request: out-of-bounds
        // values are treated as absent (old-client path), never recorded.
        const params = saneAnchorParams({
          attemptStartMs: finiteParam(searchParams.get('attemptStartMs')),
          attemptBytesBefore: finiteParam(searchParams.get('attemptBytesBefore')),
          fileBytes,
          nowMs: Date.now(),
        });
        if (params) {
          const metaPath = path.join(sessionDir, `${role}.meta.json`);
          const meta = await readMeta(metaPath);
          const anchors: AttemptAnchor[] = parseAttemptAnchors(meta.attempts);
          const next = nextAttemptAnchors(anchors, { ...params, fileBytes });
          if (next) await writeMetaAtomic(metaPath, { ...META_BASE, ...meta, attempts: next });
        }
      } catch (anchorErr) {
        console.error('[session-audio] Failed to record attempt anchor:', anchorErr);
      }

      // Append to file (creates if doesn't exist)
      await fs.appendFile(filePath, buffer);
    });

    // Mark hasAudio as soon as audio exists, not only on finalize — sessions
    // that never finalize (tab killed, laptop sleep) used to leave their
    // audio on disk but invisible to the admin UI (2026-07-13: a 47-minute
    // session had 259MB of audio and hasAudio:false). Chunks flush every
    // ~30s: the first two chunks cover the insert race where chunk 0 lands
    // before the TutorSession doc exists; the modulo re-set is a backstop.
    if (chunkIndex < 2 || chunkIndex % 10 === 0) {
      try {
        await connectDB();
        await TutorSession.updateOne(
          { sessionId: safeId },
          { $set: { hasAudio: true } }
        );
      } catch (dbErr) {
        console.error('[session-audio] Failed to update hasAudio:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      chunkIndex,
      bytesWritten: buffer.length,
    });
  } catch (error) {
    console.error('[session-audio] POST error:', error);
    return NextResponse.json({ error: 'Failed to save audio chunk' }, { status: 500 });
  }
}

// GET: Stream audio file for replay playback.
//
// AUTH (added with the student replay surface — this route previously served
// any sessionId to anyone): callers must be EITHER an admin (NextAuth
// session cookie — the admin replay pages) OR present a signed replay token
// whose session_id matches AND whose student_id owns the stored session.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const role = searchParams.get('role');

  if (!sessionId || !role || !validateRole(role)) {
    return NextResponse.json({ error: 'Missing sessionId or role parameter' }, { status: 400 });
  }

  const adminSession = await getServerSession(authOptions);
  if (!adminSession) {
    const verdict = await verifyReplayTokenAsync(searchParams.get('token'));
    if (!verdict.ok) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    if (verdict.payload.session_id !== sessionId) {
      return NextResponse.json({ error: 'token does not match session' }, { status: 403 });
    }
    await connectDB();
    const owned = await TutorSession.findOne({ sessionId }).select('studentId').lean<{ studentId?: string } | null>();
    if (!owned?.studentId || owned.studentId !== verdict.payload.student_id) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  const safeId = sanitizeSessionId(sessionId);
  const filePath = path.join(AUDIO_BASE_DIR, safeId, `${role}.pcm16`);
  const metaPath = path.join(AUDIO_BASE_DIR, safeId, `${role}.meta.json`);

  try {
    const stat = await fs.stat(filePath);
    const fileBuffer = await fs.readFile(filePath);

    // Pull the actual sample rate from the sidecar meta file if present.
    // Capture always stores at 24 kHz today, but the client must trust metadata
    // rather than hardcode — if capture rate ever changes, replay will follow.
    let sampleRate = '24000';
    // Per-attempt anchors for the replay's wall→audio map; absent on
    // recordings made before 2026-10-03 (the replay derives or falls back).
    let attemptsHeader: string | null = null;
    try {
      const meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
      if (typeof meta.sampleRate === 'number' && meta.sampleRate > 0) {
        sampleRate = String(meta.sampleRate);
      }
      const attempts = parseAttemptAnchors(meta.attempts);
      if (attempts.length > 0) attemptsHeader = JSON.stringify(attempts);
    } catch {
      // No meta file (session abandoned before finalize) — fall back to 24000
    }

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': String(stat.size),
        'X-Sample-Rate': sampleRate,
        'X-Channels': '1',
        'X-Bit-Depth': '16',
        ...(attemptsHeader ? { 'X-Audio-Attempts': attemptsHeader } : {}),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
  }
}
