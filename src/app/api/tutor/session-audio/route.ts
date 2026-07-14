import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { TutorSession } from '@/models';
import { verifyReplayToken } from '@/lib/tutor/portal/replay-token';

const AUDIO_BASE_DIR = process.env.TUTOR_AUDIO_DIR || '/var/data/evelyn/audio';

function sanitizeSessionId(id: string): string {
  // Only allow alphanumeric, dashes, underscores
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

function validateRole(role: string): role is 'student' | 'tutor' {
  return role === 'student' || role === 'tutor';
}

// POST: Receive audio chunk and append to file.
//
// Request format: raw PCM16 bytes in the request body (Content-Type
// application/octet-stream), with metadata in the URL query string:
//   ?sessionId=<id>&role=student|tutor&chunkIndex=<n>&finalize=<bool>
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
      // Write metadata file
      const meta = {
        sampleRate: 24000,
        channels: 1,
        bitDepth: 16,
        format: 'pcm16',
        totalChunks: chunkIndex,
        finalizedAt: new Date().toISOString(),
      };
      await fs.writeFile(
        path.join(sessionDir, `${role}.meta.json`),
        JSON.stringify(meta, null, 2)
      );

      // Update session in DB to mark hasAudio
      try {
        await connectDB();
        await TutorSession.updateOne(
          { sessionId: safeId },
          { $set: { hasAudio: true } }
        );
      } catch (dbErr) {
        console.error('[session-audio] Failed to update hasAudio:', dbErr);
      }

      return NextResponse.json({ success: true, finalized: true });
    }

    // Read raw PCM16 bytes from the body stream. Empty body → skip (the
    // client sometimes sends an empty final chunk just before finalize).
    const arrayBuffer = await request.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(sessionDir, `${role}.pcm16`);

    // Append to file (creates if doesn't exist)
    await fs.appendFile(filePath, buffer);

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
    const verdict = verifyReplayToken(searchParams.get('token'));
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
    try {
      const meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
      if (typeof meta.sampleRate === 'number' && meta.sampleRate > 0) {
        sampleRate = String(meta.sampleRate);
      }
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
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
  }
}
