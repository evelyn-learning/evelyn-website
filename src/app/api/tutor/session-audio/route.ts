import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { connectDB } from '@/lib/db';
import { TutorSession } from '@/models';

const AUDIO_BASE_DIR = process.env.TUTOR_AUDIO_DIR || '/var/data/evelyn/audio';

function sanitizeSessionId(id: string): string {
  // Only allow alphanumeric, dashes, underscores
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

function validateRole(role: string): role is 'student' | 'tutor' {
  return role === 'student' || role === 'tutor';
}

// POST: Receive audio chunk and append to file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, role, chunkIndex, audio, finalize } = body;

    if (!sessionId || !role || !validateRole(role)) {
      return NextResponse.json({ error: 'Invalid sessionId or role' }, { status: 400 });
    }

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

    // Decode base64 audio and append to file
    if (!audio) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const binaryString = Buffer.from(audio, 'base64');
    const filePath = path.join(sessionDir, `${role}.pcm16`);

    // Append to file (creates if doesn't exist)
    await fs.appendFile(filePath, binaryString);

    return NextResponse.json({
      success: true,
      chunkIndex,
      bytesWritten: binaryString.length,
    });
  } catch (error) {
    console.error('[session-audio] POST error:', error);
    return NextResponse.json({ error: 'Failed to save audio chunk' }, { status: 500 });
  }
}

// GET: Stream audio file for replay playback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const role = searchParams.get('role');

  if (!sessionId || !role || !validateRole(role)) {
    return NextResponse.json({ error: 'Missing sessionId or role parameter' }, { status: 400 });
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
