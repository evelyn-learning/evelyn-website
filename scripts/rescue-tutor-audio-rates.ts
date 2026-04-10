/**
 * Rescue script for tutor session audio captured before the 24kHz/48kHz fix.
 *
 * Background: prior to the resampler fix in `useOpenAIRealtime.ts`, when the
 * browser created an `AudioContext` at the device native rate (typically
 * 48 kHz) instead of the requested 24 kHz, student PCM was written verbatim
 * to disk and the meta sidecar still claimed `sampleRate: 24000`. The replay
 * player decoded those buffers at 24 kHz, so the student track played at
 * half speed and drifted progressively behind tutor + chat.
 *
 * Detection rule: the script reads each session's `duration` field from
 * MongoDB (TutorSession collection) — the source of truth — and computes
 * `expectedSamples24k = duration * 24000`. If actual student samples are
 * >= 1.5 * expectedSamples24k, the student track is almost certainly 48 kHz
 * stored as 24 kHz and should be re-tagged. Comparing tutor vs student
 * sample counts directly is unreliable (e.g. abandoned sessions where tutor
 * finalizes early but the student mic kept ticking).
 *
 * What this does: walks each session dir under TUTOR_AUDIO_DIR, looks up
 * the session in Mongo, and (with --apply) rewrites `student.meta.json` so
 * its `sampleRate` field matches the inferred capture rate. The PCM bytes
 * are never touched. Once the API GET handler reads from meta.json (the
 * companion fix in `session-audio/route.ts`), ReplayPlayer will decode at
 * the corrected rate.
 *
 * Usage on prod (MONGODB_URI must be set, e.g. via .env.local.production):
 *   ssh root@84.247.185.169
 *   cd /path/to/evelynlearning
 *   npx tsx scripts/rescue-tutor-audio-rates.ts            # dry-run report
 *   npx tsx scripts/rescue-tutor-audio-rates.ts --apply    # rewrite meta files
 */

import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

const AUDIO_BASE_DIR = process.env.TUTOR_AUDIO_DIR || '/var/data/evelyn/audio';
const MONGODB_URI = process.env.MONGODB_URI;
const APPLY = process.argv.includes('--apply');
const SAMPLE_RATIO_THRESHOLD = 1.5; // actual / expected above which we conclude 48 kHz capture

interface MetaFile {
  sampleRate?: number;
  channels?: number;
  bitDepth?: number;
  format?: string;
  totalChunks?: number;
  finalizedAt?: string;
}

async function fileSize(p: string): Promise<number | null> {
  try {
    const s = await fs.stat(p);
    return s.size;
  } catch {
    return null;
  }
}

async function readMeta(p: string): Promise<MetaFile | null> {
  try {
    return JSON.parse(await fs.readFile(p, 'utf-8'));
  } catch {
    return null;
  }
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not set — cannot look up session durations');
  }
  await mongoose.connect(MONGODB_URI);
  const TutorSession = mongoose.connection.collection('tutorsessions');

  const entries = await fs.readdir(AUDIO_BASE_DIR, { withFileTypes: true });
  const sessions = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

  console.log(`Scanning ${sessions.length} session dirs in ${AUDIO_BASE_DIR}`);
  console.log(`Mode: ${APPLY ? 'APPLY (will rewrite meta)' : 'DRY RUN'}`);
  console.log();

  let affected = 0;
  let rewritten = 0;
  let skipped = 0;
  let noDb = 0;

  for (const sessionName of sessions) {
    const dir = path.join(AUDIO_BASE_DIR, sessionName);
    const studentPcm = path.join(dir, 'student.pcm16');
    const studentMetaPath = path.join(dir, 'student.meta.json');

    const studentBytes = await fileSize(studentPcm);
    if (studentBytes == null || studentBytes === 0) {
      skipped++;
      continue;
    }

    // The DB stores sessionId with the `session-` prefix matching the dir name.
    const sessionDoc = await TutorSession.findOne(
      { sessionId: sessionName },
      { projection: { duration: 1, startedAt: 1, endedAt: 1, status: 1 } },
    );

    if (!sessionDoc) {
      console.log(`[?] ${sessionName}  no DB record — skipping`);
      noDb++;
      continue;
    }

    // Resolve duration: prefer the explicit field, fall back to start/end delta
    let durationSec: number | null = null;
    if (typeof sessionDoc.duration === 'number' && sessionDoc.duration > 0) {
      durationSec = sessionDoc.duration;
    } else if (sessionDoc.startedAt && sessionDoc.endedAt) {
      durationSec = (new Date(sessionDoc.endedAt).getTime() - new Date(sessionDoc.startedAt).getTime()) / 1000;
    }

    if (!durationSec || durationSec <= 0) {
      console.log(`[?] ${sessionName}  no usable duration in DB — skipping`);
      skipped++;
      continue;
    }

    // pcm16 = 2 bytes per sample, mono
    const studentSamples = studentBytes / 2;
    const expectedSamples24k = durationSec * 24000;
    const ratio = studentSamples / expectedSamples24k;

    if (ratio < SAMPLE_RATIO_THRESHOLD) {
      continue;
    }

    affected++;
    const studentMeta = (await readMeta(studentMetaPath)) ?? {};
    const currentRate = studentMeta.sampleRate ?? 24000;
    // Round to nearest typical capture rate (44100 or 48000). Almost always 48000.
    const inferredRate = Math.abs(ratio - 44100 / 24000) < Math.abs(ratio - 48000 / 24000) ? 44100 : 48000;

    console.log(
      `[!] ${sessionName}  status=${sessionDoc.status}  duration=${durationSec.toFixed(1)}s  ` +
      `student=${studentSamples} expected=${expectedSamples24k.toFixed(0)} ratio=${ratio.toFixed(2)}  ` +
      `meta.sampleRate=${currentRate} -> ${inferredRate}`,
    );

    if (APPLY) {
      const updated: MetaFile = {
        sampleRate: inferredRate,
        channels: studentMeta.channels ?? 1,
        bitDepth: studentMeta.bitDepth ?? 16,
        format: studentMeta.format ?? 'pcm16',
        totalChunks: studentMeta.totalChunks,
        finalizedAt: studentMeta.finalizedAt,
      };
      await fs.writeFile(studentMetaPath, JSON.stringify(updated, null, 2));
      rewritten++;
    }
  }

  console.log();
  console.log(`Done. affected=${affected} rewritten=${rewritten} skipped=${skipped} noDb=${noDb}`);
  if (affected > 0 && !APPLY) {
    console.log('Re-run with --apply to write the corrected meta files.');
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
