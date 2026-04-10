/**
 * Tutor session inspector — produces a complete diagnostic report for one or
 * more sessions: DB record, audio quality stats, sync analysis, transcript,
 * whiteboard, debug events, and a "issues found" summary at the top.
 *
 * Designed to be run on the prod box where both the audio files (under
 * TUTOR_AUDIO_DIR) and the MongoDB live, so a single command produces
 * everything needed to investigate a reported issue end-to-end.
 *
 * Usage examples:
 *   # Specific sessions
 *   npx tsx scripts/inspect-tutor-session.ts session-1775774499203 session-1775775173365
 *
 *   # Most recent N sessions
 *   npx tsx scripts/inspect-tutor-session.ts --recent 5
 *
 *   # All sessions started within the last 2 hours
 *   npx tsx scripts/inspect-tutor-session.ts --since 2h
 *
 *   # Save reports to a directory instead of stdout (one .md per session)
 *   npx tsx scripts/inspect-tutor-session.ts --since 2h --out /tmp/reports
 *
 *   # Extract WAV files for human listening (writes <out>/<sessionId>/{student,tutor}.wav)
 *   npx tsx scripts/inspect-tutor-session.ts session-... --out /tmp/reports --wav
 *
 * Required env: MONGODB_URI. Optional: TUTOR_AUDIO_DIR (defaults /var/data/evelyn/audio).
 */

import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

const AUDIO_BASE_DIR = process.env.TUTOR_AUDIO_DIR || '/var/data/evelyn/audio';
const MONGODB_URI = process.env.MONGODB_URI;
const ASSUMED_RATE = 24000; // What tutor.pcm16 is always at; what we *want* student to be at.
const SILENCE_AMP_THRESHOLD = 200; // |int16| below this counts as silence (~ -44 dBFS)
const MIN_SILENCE_RUN_MS = 500; // only report runs >= this length

// ─────────────────────────────────────────────────────────────────────────────
// Args
// ─────────────────────────────────────────────────────────────────────────────
interface Args {
  sessionIds: string[];
  recent: number | null;
  sinceMs: number | null;
  outDir: string | null;
  writeWav: boolean;
  jsonOnly: boolean;
}

function parseArgs(): Args {
  const args: Args = { sessionIds: [], recent: null, sinceMs: null, outDir: null, writeWav: false, jsonOnly: false };
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a === '--recent') args.recent = parseInt(process.argv[++i], 10);
    else if (a === '--since') args.sinceMs = parseDurationToMs(process.argv[++i]);
    else if (a === '--out') args.outDir = process.argv[++i];
    else if (a === '--wav') args.writeWav = true;
    else if (a === '--json') args.jsonOnly = true;
    else if (a.startsWith('--')) throw new Error(`Unknown flag: ${a}`);
    else args.sessionIds.push(a);
  }
  return args;
}

function parseDurationToMs(s: string): number {
  const m = s.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!m) throw new Error(`Bad duration "${s}" — use e.g. 30m, 2h, 1d`);
  const n = parseInt(m[1], 10);
  const unit = m[2];
  return n * ({ ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 } as Record<string, number>)[unit];
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio analysis
// ─────────────────────────────────────────────────────────────────────────────
interface SilenceRun { startMs: number; durMs: number }
interface AudioStats {
  exists: boolean;
  bytes: number;
  samples: number;
  durationAt24kSec: number;
  durationAt48kSec: number;
  peakInt16: number;
  peakDbfs: number;
  rmsInt16: number;
  rmsDbfs: number;
  silentSamplePct: number;
  longSilenceRuns: SilenceRun[]; // runs >= MIN_SILENCE_RUN_MS, capped to first 10
  longSilenceCount: number;
  clippedSampleCount: number;
  metaSampleRate: number | null;
}

async function analyzeAudio(filePath: string, metaPath: string): Promise<AudioStats> {
  let buf: Buffer;
  try {
    buf = await fs.readFile(filePath);
  } catch {
    return {
      exists: false, bytes: 0, samples: 0, durationAt24kSec: 0, durationAt48kSec: 0,
      peakInt16: 0, peakDbfs: -Infinity, rmsInt16: 0, rmsDbfs: -Infinity, silentSamplePct: 0,
      longSilenceRuns: [], longSilenceCount: 0, clippedSampleCount: 0, metaSampleRate: null,
    };
  }

  const samples = buf.length / 2;
  const i16 = new Int16Array(buf.buffer, buf.byteOffset, samples);

  let peak = 0, sumSq = 0, silent = 0, clipped = 0;
  const runs: SilenceRun[] = [];
  let inRun = false, runStart = 0;
  const minRunSamples = (MIN_SILENCE_RUN_MS / 1000) * ASSUMED_RATE;

  for (let i = 0; i < samples; i++) {
    const v = i16[i];
    const a = v < 0 ? -v : v;
    if (a > peak) peak = a;
    sumSq += v * v;
    if (a >= 32767) clipped++;
    if (a < SILENCE_AMP_THRESHOLD) {
      if (!inRun) { inRun = true; runStart = i; }
      silent++;
    } else if (inRun) {
      const len = i - runStart;
      if (len >= minRunSamples) runs.push({ startMs: Math.floor((runStart / ASSUMED_RATE) * 1000), durMs: Math.floor((len / ASSUMED_RATE) * 1000) });
      inRun = false;
    }
  }
  if (inRun) {
    const len = samples - runStart;
    if (len >= minRunSamples) runs.push({ startMs: Math.floor((runStart / ASSUMED_RATE) * 1000), durMs: Math.floor((len / ASSUMED_RATE) * 1000) });
  }

  const rms = Math.sqrt(sumSq / samples);
  const peakDbfs = peak > 0 ? 20 * Math.log10(peak / 32768) : -Infinity;
  const rmsDbfs = rms > 0 ? 20 * Math.log10(rms / 32768) : -Infinity;

  let metaSampleRate: number | null = null;
  try {
    const meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
    if (typeof meta.sampleRate === 'number') metaSampleRate = meta.sampleRate;
  } catch { /* meta absent — abandoned session */ }

  return {
    exists: true,
    bytes: buf.length,
    samples,
    durationAt24kSec: samples / 24000,
    durationAt48kSec: samples / 48000,
    peakInt16: peak,
    peakDbfs,
    rmsInt16: rms,
    rmsDbfs,
    silentSamplePct: (silent / samples) * 100,
    longSilenceRuns: runs.slice(0, 10),
    longSilenceCount: runs.length,
    clippedSampleCount: clipped,
    metaSampleRate,
  };
}

// Write a tiny WAV header in front of pcm16 data and dump to disk so a human
// can actually listen. Mono, 16-bit, default 24 kHz.
async function writeWavFile(srcPath: string, dstPath: string, sampleRate: number) {
  const pcm = await fs.readFile(srcPath);
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcm.length;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20);  // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  await fs.writeFile(dstPath, Buffer.concat([header, pcm]));
}

// ─────────────────────────────────────────────────────────────────────────────
// Issue detection — pure rules over the gathered data
// ─────────────────────────────────────────────────────────────────────────────
interface SessionDoc {
  sessionId: string;
  studentName?: string;
  subject: string;
  topic: string;
  level: string;
  sessionGoal?: string;
  inputMode?: string;
  voiceEngine?: string;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  messageCount?: number;
  whiteboardItemCount?: number;
  transcript?: Array<{ role: string; text: string; timestamp: Date; pedagogicalIntent?: string }>;
  whiteboardCommands?: Array<{ action: string; data: Record<string, unknown>; timestamp: Date; sourceMessageIndex?: number }>;
  debugEvents?: Array<{ type: string; message: string; timestamp: Date }>;
  estimatedCost?: number;
  status?: string;
  hasAudio?: boolean;
}

interface Issue { severity: 'error' | 'warn' | 'info'; tag: string; message: string }

function detectIssues(doc: SessionDoc, student: AudioStats, tutor: AudioStats): Issue[] {
  const issues: Issue[] = [];
  const durationSec = doc.duration ?? (doc.startedAt && doc.endedAt ? (new Date(doc.endedAt).getTime() - new Date(doc.startedAt).getTime()) / 1000 : null);

  // ── Audio integrity ────────────────────────────────────────────────
  if (doc.inputMode === 'voice' || doc.voiceEngine) {
    if (!student.exists) issues.push({ severity: 'error', tag: 'audio-missing-student', message: 'Voice session has no student.pcm16 file' });
    if (!tutor.exists) issues.push({ severity: 'error', tag: 'audio-missing-tutor', message: 'Voice session has no tutor.pcm16 file' });
  }

  // 48 kHz capture stored as 24 kHz: track is much longer than the session duration
  if (student.exists && durationSec) {
    const expectedSamples = durationSec * 24000;
    const ratio = student.samples / expectedSamples;
    if (ratio >= 1.5) {
      issues.push({
        severity: 'error',
        tag: 'audio-rate-mismatch',
        message: `Student track is ${ratio.toFixed(2)}× expected length — likely captured at 48 kHz but stored as 24 kHz. Run scripts/rescue-tutor-audio-rates.ts --apply.`,
      });
    } else if (ratio < 0.6 && doc.status === 'completed') {
      issues.push({
        severity: 'warn',
        tag: 'audio-truncated',
        message: `Student track covers only ${(ratio * 100).toFixed(0)}% of session duration — recording may have stopped early or chunks were lost.`,
      });
    }
  }

  // Silent track (mic captured but all zeros). Use RMS rather than peak — a
  // single sporadic noise sample can push peak above the threshold while the
  // overall signal is still flat zero (e.g. peak -43 dBFS, RMS -90 dBFS).
  if (student.exists && student.rmsDbfs < -75) {
    const transcribedStudentLines = (doc.transcript ?? []).filter(t => t.role === 'student').length;
    const note = transcribedStudentLines > 0
      ? ` But the transcript contains ${transcribedStudentLines} student turn(s), so OpenAI received audio over the WebSocket — only the recorder tap missed it. Likely the ScriptProcessor branch is reading zeros while the WS branch isn't.`
      : '';
    issues.push({
      severity: 'error',
      tag: 'mic-silent',
      message: `Student track is effectively silent (RMS ${student.rmsDbfs.toFixed(1)} dBFS, peak ${student.peakDbfs.toFixed(1)} dBFS).${note}`,
    });
  }

  // Tutor track tiny relative to session (response barely captured)
  if (tutor.exists && durationSec && tutor.samples / 24000 < durationSec * 0.3) {
    issues.push({
      severity: 'warn',
      tag: 'tutor-track-short',
      message: `Tutor track covers only ${((tutor.samples / 24000 / durationSec) * 100).toFixed(0)}% of session duration.`,
    });
  }

  // hasAudio flag drift
  if (doc.hasAudio === true && (!student.exists || !tutor.exists)) {
    issues.push({ severity: 'warn', tag: 'audio-flag-drift', message: 'DB.hasAudio=true but audio files are missing on disk' });
  }
  if (doc.hasAudio === false && student.exists && tutor.exists) {
    issues.push({ severity: 'info', tag: 'audio-flag-drift', message: 'Audio files exist on disk but DB.hasAudio=false (finalize call may have failed)' });
  }

  // Encoding asymmetry — clipping at -32768 specifically
  if (student.exists && student.peakInt16 === 32768) {
    issues.push({ severity: 'info', tag: 'audio-clipping', message: `Student track hits int16 floor (-32768) — known asymmetric-encoding artifact in float32ToPCM16` });
  }

  // ── Transcript / sync ──────────────────────────────────────────────
  if (doc.transcript && doc.transcript.length > 0 && doc.startedAt) {
    const startMs = new Date(doc.startedAt).getTime();
    const offsets = doc.transcript.map(t => new Date(t.timestamp).getTime() - startMs);
    const lastOffsetMs = Math.max(...offsets);
    if (durationSec && lastOffsetMs > durationSec * 1000 + 5000) {
      issues.push({
        severity: 'warn',
        tag: 'transcript-overhang',
        message: `Last transcript entry at ${(lastOffsetMs / 1000).toFixed(1)}s but session duration is ${durationSec.toFixed(1)}s.`,
      });
    }
    const negOffsets = offsets.filter(o => o < 0);
    if (negOffsets.length > 0) {
      issues.push({ severity: 'warn', tag: 'transcript-pre-start', message: `${negOffsets.length} transcript entries timestamped before session.startedAt` });
    }
  }

  // ── Whiteboard ─────────────────────────────────────────────────────
  if (doc.whiteboardCommands && doc.whiteboardCommands.length > 1) {
    const wbTimestamps = doc.whiteboardCommands.map(w => new Date(w.timestamp).getTime());
    const distinct = new Set(wbTimestamps);
    if (distinct.size <= 1) {
      issues.push({ severity: 'warn', tag: 'whiteboard-flat-timestamps', message: 'All whiteboard commands share one timestamp — replay timing will fall back to even distribution' });
    }
    const withoutSourceIndex = doc.whiteboardCommands.filter(w => w.sourceMessageIndex == null).length;
    if (withoutSourceIndex > 0) {
      issues.push({ severity: 'info', tag: 'whiteboard-no-source-index', message: `${withoutSourceIndex}/${doc.whiteboardCommands.length} whiteboard commands lack sourceMessageIndex` });
    }
  }

  // ── Errors recorded by client ──────────────────────────────────────
  if (doc.debugEvents) {
    const errorEvents = doc.debugEvents.filter(d => d.type === 'error');
    if (errorEvents.length > 0) {
      issues.push({ severity: 'warn', tag: 'client-errors', message: `${errorEvents.length} client-side error(s) logged: ${errorEvents.slice(0, 3).map(e => e.message).join(' | ')}` });
    }
    // Only match the explicit silent-mic warning emitted by useOpenAIRealtime —
    // not normal mic_mute / mic_unmute lifecycle events.
    const micWarnings = doc.debugEvents.filter(d => d.type === 'MicSilentWarning');
    if (micWarnings.length > 0) {
      issues.push({ severity: 'warn', tag: 'mic-warning-logged', message: `Client logged mic warning: ${micWarnings[0].message}` });
    }
  }

  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Report formatting
// ─────────────────────────────────────────────────────────────────────────────
function fmtTime(d?: Date) { return d ? new Date(d).toISOString() : 'n/a'; }
function fmtSec(s?: number | null) { if (s == null) return 'n/a'; const m = Math.floor(s / 60); const r = Math.floor(s % 60); return `${m}:${String(r).padStart(2, '0')}`; }
function fmtBytes(n: number) { return n >= 1e6 ? (n / 1e6).toFixed(2) + ' MB' : (n / 1e3).toFixed(1) + ' KB'; }

function renderAudioBlock(label: string, s: AudioStats, durationSec: number | null): string {
  if (!s.exists) return `### ${label}\n  *(file missing)*\n`;
  const expectedSamples24k = durationSec ? durationSec * 24000 : null;
  const ratio = expectedSamples24k ? s.samples / expectedSamples24k : null;
  return [
    `### ${label}`,
    `  bytes:        ${fmtBytes(s.bytes)} (${s.bytes.toLocaleString()})`,
    `  samples:      ${s.samples.toLocaleString()}`,
    `  duration:     ${s.durationAt24kSec.toFixed(1)}s @24kHz  (${s.durationAt48kSec.toFixed(1)}s @48kHz)`,
    expectedSamples24k != null ? `  vs session:   ratio ${ratio!.toFixed(2)}× of expected ${(expectedSamples24k).toLocaleString()} samples` : '',
    `  peak:         ${s.peakInt16} (${s.peakDbfs.toFixed(1)} dBFS)${s.clippedSampleCount > 0 ? `   clipped=${s.clippedSampleCount}` : ''}`,
    `  rms:          ${s.rmsInt16.toFixed(0)} (${s.rmsDbfs.toFixed(1)} dBFS)`,
    `  silent:       ${s.silentSamplePct.toFixed(1)}% of samples below ${SILENCE_AMP_THRESHOLD}/32768`,
    `  silence runs: ${s.longSilenceCount} runs ≥${MIN_SILENCE_RUN_MS}ms${s.longSilenceCount > 0 ? `\n                first: ${s.longSilenceRuns.map(r => `${(r.startMs / 1000).toFixed(1)}s+${(r.durMs / 1000).toFixed(1)}s`).join(', ')}` : ''}`,
    `  meta.sampleRate: ${s.metaSampleRate ?? '(no meta file)'}`,
    '',
  ].filter(Boolean).join('\n');
}

function renderReport(doc: SessionDoc, student: AudioStats, tutor: AudioStats, issues: Issue[]): string {
  const out: string[] = [];
  const durationSec = doc.duration ?? (doc.startedAt && doc.endedAt ? (new Date(doc.endedAt).getTime() - new Date(doc.startedAt).getTime()) / 1000 : null);

  out.push(`# Session ${doc.sessionId}`);
  out.push('');

  // Issues block at the top
  if (issues.length === 0) {
    out.push('## Issues found: ✅ none');
  } else {
    out.push(`## Issues found: ${issues.length}`);
    for (const i of issues) {
      const icon = i.severity === 'error' ? '❌' : i.severity === 'warn' ? '⚠️' : 'ℹ️';
      out.push(`- ${icon} **[${i.tag}]** ${i.message}`);
    }
  }
  out.push('');

  // Metadata
  out.push('## Metadata');
  out.push('```');
  out.push(`student:     ${doc.studentName ?? 'anonymous'}`);
  out.push(`subject:     ${doc.subject} / ${doc.topic}  (level ${doc.level})`);
  out.push(`mode:        ${doc.inputMode}${doc.voiceEngine ? ` (${doc.voiceEngine})` : ''}`);
  out.push(`status:      ${doc.status}`);
  out.push(`startedAt:   ${fmtTime(doc.startedAt)}`);
  out.push(`endedAt:     ${fmtTime(doc.endedAt)}`);
  out.push(`duration:    ${fmtSec(durationSec)}  (${durationSec?.toFixed(1) ?? '?'}s)`);
  out.push(`messages:    ${doc.messageCount ?? doc.transcript?.length ?? 0}`);
  out.push(`whiteboard:  ${doc.whiteboardItemCount ?? doc.whiteboardCommands?.length ?? 0} items`);
  out.push(`cost:        $${(doc.estimatedCost ?? 0).toFixed(3)}`);
  out.push(`hasAudio:    ${doc.hasAudio ?? false}`);
  out.push('```');
  out.push('');

  // Audio
  out.push('## Audio quality');
  out.push(renderAudioBlock('student.pcm16', student, durationSec));
  out.push(renderAudioBlock('tutor.pcm16', tutor, durationSec));

  // Sync analysis cross-check
  if (student.exists && tutor.exists && durationSec) {
    const studentDur = student.samples / 24000;
    const tutorDur = tutor.samples / 24000;
    out.push('## Sync cross-check');
    out.push('```');
    out.push(`session duration:  ${durationSec.toFixed(2)}s`);
    out.push(`student @24kHz:    ${studentDur.toFixed(2)}s   delta ${(studentDur - durationSec).toFixed(2)}s`);
    out.push(`tutor   @24kHz:    ${tutorDur.toFixed(2)}s   delta ${(tutorDur - durationSec).toFixed(2)}s`);
    out.push(`student / tutor:   ${(studentDur / tutorDur).toFixed(2)}×`);
    out.push('```');
    out.push('');
  }

  // Transcript summary
  if (doc.transcript && doc.transcript.length > 0) {
    const startMs = doc.startedAt ? new Date(doc.startedAt).getTime() : 0;
    const byRole: Record<string, number> = {};
    let totalChars = 0;
    for (const t of doc.transcript) {
      byRole[t.role] = (byRole[t.role] ?? 0) + 1;
      totalChars += t.text.length;
    }
    out.push(`## Transcript (${doc.transcript.length} entries, ${totalChars} chars)`);
    out.push('```');
    out.push(`by role: ${Object.entries(byRole).map(([k, v]) => `${k}=${v}`).join('  ')}`);
    out.push('```');
    out.push('');
    out.push('<details><summary>Full transcript with offsets</summary>');
    out.push('');
    out.push('```');
    for (const t of doc.transcript) {
      const offsetSec = ((new Date(t.timestamp).getTime() - startMs) / 1000).toFixed(1);
      const text = t.text.length > 240 ? t.text.slice(0, 237) + '...' : t.text;
      out.push(`[${offsetSec.padStart(6)}s ${t.role.padEnd(7)}] ${text}`);
    }
    out.push('```');
    out.push('');
    out.push('</details>');
    out.push('');
  }

  // Whiteboard summary
  if (doc.whiteboardCommands && doc.whiteboardCommands.length > 0) {
    const startMs = doc.startedAt ? new Date(doc.startedAt).getTime() : 0;
    const byAction: Record<string, number> = {};
    for (const w of doc.whiteboardCommands) byAction[w.action] = (byAction[w.action] ?? 0) + 1;
    out.push(`## Whiteboard (${doc.whiteboardCommands.length} commands)`);
    out.push('```');
    out.push(`by action: ${Object.entries(byAction).map(([k, v]) => `${k}=${v}`).join('  ')}`);
    out.push('```');
    out.push('');
    out.push('<details><summary>Commands timeline</summary>');
    out.push('');
    out.push('```');
    for (const w of doc.whiteboardCommands) {
      const offsetSec = ((new Date(w.timestamp).getTime() - startMs) / 1000).toFixed(1);
      const dataPreview = JSON.stringify(w.data).slice(0, 120);
      out.push(`[${offsetSec.padStart(6)}s] ${w.action.padEnd(16)} src=${w.sourceMessageIndex ?? '-'}  ${dataPreview}`);
    }
    out.push('```');
    out.push('');
    out.push('</details>');
    out.push('');
  }

  // Debug events
  if (doc.debugEvents && doc.debugEvents.length > 0) {
    const startMs = doc.startedAt ? new Date(doc.startedAt).getTime() : 0;
    const byType: Record<string, number> = {};
    for (const d of doc.debugEvents) byType[d.type] = (byType[d.type] ?? 0) + 1;
    out.push(`## Debug events (${doc.debugEvents.length})`);
    out.push('```');
    out.push(`by type: ${Object.entries(byType).map(([k, v]) => `${k}=${v}`).join('  ')}`);
    out.push('```');
    out.push('');
    out.push('<details><summary>Timeline</summary>');
    out.push('');
    out.push('```');
    for (const d of doc.debugEvents) {
      const offsetSec = ((new Date(d.timestamp).getTime() - startMs) / 1000).toFixed(1);
      out.push(`[${offsetSec.padStart(6)}s ${d.type.padEnd(22)}] ${d.message}`);
    }
    out.push('```');
    out.push('');
    out.push('</details>');
    out.push('');
  }

  return out.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');
  const args = parseArgs();

  await mongoose.connect(MONGODB_URI);
  const TutorSession = mongoose.connection.collection('tutorsessions');

  // Resolve session list
  let sessionIds: string[] = args.sessionIds;
  if (args.recent != null) {
    const docs = await TutorSession.find({}, { projection: { sessionId: 1 } }).sort({ startedAt: -1 }).limit(args.recent).toArray();
    sessionIds = docs.map(d => d.sessionId);
  } else if (args.sinceMs != null) {
    const since = new Date(Date.now() - args.sinceMs);
    const docs = await TutorSession.find({ startedAt: { $gte: since } }, { projection: { sessionId: 1 } }).sort({ startedAt: -1 }).toArray();
    sessionIds = docs.map(d => d.sessionId);
  }

  if (sessionIds.length === 0) {
    console.error('No sessions to inspect. Pass session IDs or --recent N or --since 2h.');
    process.exit(1);
  }

  if (args.outDir) await fs.mkdir(args.outDir, { recursive: true });

  // Build a top-level "fleet summary" of issues across all sessions
  const fleetIssues: Array<{ sessionId: string; issues: Issue[] }> = [];

  for (const sessionId of sessionIds) {
    const doc = await TutorSession.findOne({ sessionId }) as SessionDoc | null;
    if (!doc) {
      console.error(`(skip) ${sessionId} not found in DB`);
      continue;
    }
    const dir = path.join(AUDIO_BASE_DIR, sessionId);
    const [studentStats, tutorStats] = await Promise.all([
      analyzeAudio(path.join(dir, 'student.pcm16'), path.join(dir, 'student.meta.json')),
      analyzeAudio(path.join(dir, 'tutor.pcm16'), path.join(dir, 'tutor.meta.json')),
    ]);
    const issues = detectIssues(doc, studentStats, tutorStats);
    fleetIssues.push({ sessionId, issues });

    if (args.jsonOnly) {
      const payload = { doc, student: studentStats, tutor: tutorStats, issues };
      const json = JSON.stringify(payload, null, 2);
      if (args.outDir) await fs.writeFile(path.join(args.outDir, `${sessionId}.json`), json);
      else console.log(json);
    } else {
      const report = renderReport(doc, studentStats, tutorStats, issues);
      if (args.outDir) {
        await fs.writeFile(path.join(args.outDir, `${sessionId}.md`), report);
      } else {
        console.log(report);
        console.log('\n' + '─'.repeat(80) + '\n');
      }
    }

    if (args.writeWav && args.outDir) {
      const sessionOut = path.join(args.outDir, sessionId);
      await fs.mkdir(sessionOut, { recursive: true });
      if (studentStats.exists) {
        const rate = studentStats.metaSampleRate ?? 24000;
        await writeWavFile(path.join(dir, 'student.pcm16'), path.join(sessionOut, 'student.wav'), rate);
      }
      if (tutorStats.exists) {
        const rate = tutorStats.metaSampleRate ?? 24000;
        await writeWavFile(path.join(dir, 'tutor.pcm16'), path.join(sessionOut, 'tutor.wav'), rate);
      }
    }
  }

  // Fleet summary printed last so it's visible regardless of long per-session output
  console.error('\n=== Fleet summary ===');
  for (const { sessionId, issues } of fleetIssues) {
    if (issues.length === 0) {
      console.error(`  ✅ ${sessionId}  clean`);
    } else {
      const errs = issues.filter(i => i.severity === 'error').length;
      const warns = issues.filter(i => i.severity === 'warn').length;
      console.error(`  ${errs > 0 ? '❌' : '⚠️'} ${sessionId}  ${errs} error(s), ${warns} warning(s):  ${issues.map(i => i.tag).join(', ')}`);
    }
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
