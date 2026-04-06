'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';
import { WhiteboardCanvas } from '@/app/tutor/components/whiteboard/WhiteboardCanvas';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import ReplayTimeline, { type TimelineEvent } from './ReplayTimeline';

interface TranscriptEntry {
  role: string;
  text: string;
  timestamp: string;
  pedagogicalIntent?: string;
  whiteboardCommands?: Record<string, unknown>[];
}

interface WhiteboardEntry {
  action: string;
  data: Record<string, unknown>;
  timestamp: string;
  sourceMessageIndex?: number;
}

interface DebugEntry {
  type: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

interface ReplayPlayerProps {
  transcript: TranscriptEntry[];
  whiteboardCommands: WhiteboardEntry[];
  debugEvents: DebugEntry[];
  startedAt: string;
  endedAt?: string;
  duration?: number;
  studentName?: string;
  subject?: string;
  topic?: string;
  sessionId?: string;
  hasAudio?: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Decode raw PCM16 ArrayBuffer to AudioBuffer
async function decodePCM16(arrayBuffer: ArrayBuffer, sampleRate: number): Promise<AudioBuffer> {
  const int16 = new Int16Array(arrayBuffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  const audioCtx = new AudioContext({ sampleRate });
  const audioBuffer = audioCtx.createBuffer(1, float32.length, sampleRate);
  audioBuffer.getChannelData(0).set(float32);
  await audioCtx.close();
  return audioBuffer;
}

export default function ReplayPlayer({
  transcript,
  whiteboardCommands,
  debugEvents,
  startedAt,
  endedAt,
  duration,
  studentName,
  subject,
  topic,
  sessionId,
  hasAudio,
}: ReplayPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [visibleTranscriptCount, setVisibleTranscriptCount] = useState(0);
  const [visibleWbCount, setVisibleWbCount] = useState(0);

  // Audio playback state
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [studentMuted, setStudentMuted] = useState(false);
  const [tutorMuted, setTutorMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const studentBufferRef = useRef<AudioBuffer | null>(null);
  const tutorBufferRef = useRef<AudioBuffer | null>(null);
  const studentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const tutorSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const studentGainRef = useRef<GainNode | null>(null);
  const tutorGainRef = useRef<GainNode | null>(null);

  const playingRef = useRef(false);
  const currentTimeMsRef = useRef(0);
  const speedRef = useRef(1);
  const lastFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Store sorted offset arrays in refs so tick doesn't depend on memoized values
  const transcriptOffsetsRef = useRef<number[]>([]);
  const wbOffsetsRef = useRef<number[]>([]);

  const startMs = useMemo(() => new Date(startedAt).getTime(), [startedAt]);
  const totalDurationMs = useMemo(() => {
    if (duration) return duration * 1000;
    if (endedAt) return new Date(endedAt).getTime() - startMs;
    // Fallback: use last event timestamp
    const allTimestamps = [
      ...transcript.map(t => new Date(t.timestamp).getTime()),
      ...whiteboardCommands.map(w => new Date(w.timestamp).getTime()),
      ...debugEvents.map(d => new Date(d.timestamp).getTime()),
    ];
    return allTimestamps.length > 0 ? Math.max(...allTimestamps) - startMs + 2000 : 60000;
  }, [duration, endedAt, startMs, transcript, whiteboardCommands, debugEvents]);

  // Build unified timeline
  const timeline = useMemo<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = [
      ...transcript.map((t, i) => ({
        type: 'transcript' as const,
        offsetMs: new Date(t.timestamp).getTime() - startMs,
        data: { ...t, _index: i },
      })),
      ...whiteboardCommands.map((w, i) => ({
        type: 'whiteboard' as const,
        offsetMs: new Date(w.timestamp).getTime() - startMs,
        data: { ...w, _index: i },
      })),
      ...debugEvents.map(d => ({
        type: 'debug' as const,
        offsetMs: new Date(d.timestamp).getTime() - startMs,
        data: { ...d },
      })),
    ];
    return events.sort((a, b) => a.offsetMs - b.offsetMs);
  }, [transcript, whiteboardCommands, debugEvents, startMs]);

  // Convert stored whiteboard entries back to WhiteboardCommand format
  const wbAsCommands = useMemo<WhiteboardCommand[]>(() => {
    return whiteboardCommands.map(entry => {
      const cmd = { action: entry.action, ...entry.data };
      return cmd as unknown as WhiteboardCommand;
    });
  }, [whiteboardCommands]);

  // Sorted transcript entries for progressive reveal
  const sortedTranscript = useMemo(() => {
    const sorted = [...transcript].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    transcriptOffsetsRef.current = sorted.map(t => new Date(t.timestamp).getTime() - startMs);
    return sorted;
  }, [transcript, startMs]);

  // Build whiteboard commands with timing — derive from transcript if DB timestamps are identical
  const sortedWb = useMemo(() => {
    // Check if stored whiteboard timestamps are actually distinct
    const wbTimes = whiteboardCommands.map(w => new Date(w.timestamp).getTime());
    const allSameTimestamp = wbTimes.length > 1 && new Set(wbTimes).size <= 1;

    if (!allSameTimestamp && whiteboardCommands.length > 0) {
      // Timestamps are distinct — use them directly
      const sorted = [...whiteboardCommands].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      wbOffsetsRef.current = sorted.map(w => new Date(w.timestamp).getTime() - startMs);
      return sorted.map(entry => ({ action: entry.action, ...entry.data } as unknown as WhiteboardCommand));
    }

    // Fallback: derive timing from transcript entries that carry whiteboardCommands
    const derivedCommands: { cmd: WhiteboardCommand; offsetMs: number }[] = [];
    const sortedT = [...transcript].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    for (const t of sortedT) {
      if (t.whiteboardCommands?.length) {
        const offsetMs = new Date(t.timestamp).getTime() - startMs;
        for (const wbCmd of t.whiteboardCommands) {
          derivedCommands.push({
            cmd: wbCmd as unknown as WhiteboardCommand,
            offsetMs,
          });
        }
      }
    }

    // If we got commands from transcript, use those
    if (derivedCommands.length > 0) {
      wbOffsetsRef.current = derivedCommands.map(d => d.offsetMs);
      return derivedCommands.map(d => d.cmd);
    }

    // Last resort: distribute evenly across session
    wbOffsetsRef.current = whiteboardCommands.map((_, i) =>
      Math.round((totalDurationMs * (i + 1)) / (whiteboardCommands.length + 1))
    );
    return whiteboardCommands.map(entry => ({ action: entry.action, ...entry.data } as unknown as WhiteboardCommand));
  }, [whiteboardCommands, transcript, startMs, totalDurationMs]);

  // Apply current time to visible counts using pre-computed offset arrays
  const applyTime = useCallback((timeMs: number) => {
    // Binary-search-like count: how many offsets <= timeMs
    let tCount = 0;
    for (const offset of transcriptOffsetsRef.current) {
      if (offset <= timeMs) tCount++;
      else break;
    }
    setVisibleTranscriptCount(tCount);

    let wCount = 0;
    for (const offset of wbOffsetsRef.current) {
      if (offset <= timeMs) wCount++;
      else break;
    }
    setVisibleWbCount(wCount);
  }, []); // No deps — reads from refs

  // Store totalDurationMs in a ref so tick doesn't need it as a dep
  const totalDurationMsRef = useRef(totalDurationMs);
  totalDurationMsRef.current = totalDurationMs;

  // Animation loop — stable reference, reads everything from refs
  const tick = useCallback((now: number) => {
    if (!playingRef.current) return;

    const delta = now - lastFrameRef.current;
    lastFrameRef.current = now;

    const newTime = Math.min(currentTimeMsRef.current + delta * speedRef.current, totalDurationMsRef.current);
    currentTimeMsRef.current = newTime;
    setCurrentTimeMs(newTime);
    applyTime(newTime);

    if (newTime >= totalDurationMsRef.current) {
      playingRef.current = false;
      setIsPlaying(false);
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [applyTime]); // applyTime has no deps, so tick is stable

  // Audio: load files when modal opens — try regardless of hasAudio flag
  // (flag may not be set due to race condition on session end)
  const loadAudio = useCallback(async () => {
    if (!sessionId || audioLoaded || audioLoading) return;
    setAudioLoading(true);
    try {
      const [studentResp, tutorResp] = await Promise.all([
        fetch(`/api/tutor/session-audio?sessionId=${sessionId}&role=student`),
        fetch(`/api/tutor/session-audio?sessionId=${sessionId}&role=tutor`),
      ]);

      if (studentResp.ok) {
        const buf = await studentResp.arrayBuffer();
        if (buf.byteLength > 0) studentBufferRef.current = await decodePCM16(buf, 24000);
      }
      if (tutorResp.ok) {
        const buf = await tutorResp.arrayBuffer();
        if (buf.byteLength > 0) tutorBufferRef.current = await decodePCM16(buf, 24000);
      }

      setAudioLoaded(true);
    } catch (err) {
      console.error('[ReplayPlayer] Audio load error:', err);
    } finally {
      setAudioLoading(false);
    }
  }, [sessionId, audioLoaded, audioLoading]);

  // Audio: start playback from offset
  const startAudioPlayback = useCallback((offsetMs: number, playbackRate: number) => {
    if (!audioLoaded) return;

    // Create or resume AudioContext
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Create gain nodes if needed
    if (!studentGainRef.current) {
      studentGainRef.current = ctx.createGain();
      studentGainRef.current.connect(ctx.destination);
    }
    if (!tutorGainRef.current) {
      tutorGainRef.current = ctx.createGain();
      tutorGainRef.current.connect(ctx.destination);
    }

    // Apply mute state
    studentGainRef.current.gain.value = studentMuted ? 0 : 1;
    tutorGainRef.current.gain.value = tutorMuted ? 0 : 1;

    const offsetSec = offsetMs / 1000;

    // Stop existing sources
    try { studentSourceRef.current?.stop(); } catch {}
    try { tutorSourceRef.current?.stop(); } catch {}

    // Start student audio
    if (studentBufferRef.current && offsetSec < studentBufferRef.current.duration) {
      const source = ctx.createBufferSource();
      source.buffer = studentBufferRef.current;
      source.playbackRate.value = playbackRate;
      source.connect(studentGainRef.current);
      source.start(0, offsetSec);
      studentSourceRef.current = source;
    }

    // Start tutor audio
    if (tutorBufferRef.current && offsetSec < tutorBufferRef.current.duration) {
      const source = ctx.createBufferSource();
      source.buffer = tutorBufferRef.current;
      source.playbackRate.value = playbackRate;
      source.connect(tutorGainRef.current);
      source.start(0, offsetSec);
      tutorSourceRef.current = source;
    }
  }, [audioLoaded, studentMuted, tutorMuted]);

  // Audio: stop playback
  const stopAudioPlayback = useCallback(() => {
    try { studentSourceRef.current?.stop(); } catch {}
    try { tutorSourceRef.current?.stop(); } catch {}
    studentSourceRef.current = null;
    tutorSourceRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (currentTimeMsRef.current >= totalDurationMs) {
      currentTimeMsRef.current = 0;
      setCurrentTimeMs(0);
      applyTime(0);
    }
    playingRef.current = true;
    setIsPlaying(true);
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    startAudioPlayback(currentTimeMsRef.current, speedRef.current);
  }, [totalDurationMs, tick, applyTime, startAudioPlayback]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    stopAudioPlayback();
  }, [stopAudioPlayback]);

  const reset = useCallback(() => {
    pause();
    currentTimeMsRef.current = 0;
    setCurrentTimeMs(0);
    applyTime(0);
  }, [pause, applyTime]);

  const seek = useCallback((timeMs: number) => {
    const clamped = Math.max(0, Math.min(timeMs, totalDurationMs));
    currentTimeMsRef.current = clamped;
    setCurrentTimeMs(clamped);
    applyTime(clamped);
    // If playing, restart audio from new position
    if (playingRef.current) {
      stopAudioPlayback();
      startAudioPlayback(clamped, speedRef.current);
    }
  }, [totalDurationMs, applyTime, stopAudioPlayback, startAudioPlayback]);

  const changeSpeed = useCallback((newSpeed: number) => {
    speedRef.current = newSpeed;
    setSpeed(newSpeed);
    // Update audio playback rate if playing
    if (studentSourceRef.current) studentSourceRef.current.playbackRate.value = newSpeed;
    if (tutorSourceRef.current) tutorSourceRef.current.playbackRate.value = newSpeed;
  }, []);

  // Update gain when mute toggles
  useEffect(() => {
    if (studentGainRef.current) studentGainRef.current.gain.value = studentMuted ? 0 : 1;
  }, [studentMuted]);
  useEffect(() => {
    if (tutorGainRef.current) tutorGainRef.current.gain.value = tutorMuted ? 0 : 1;
  }, [tutorMuted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try { studentSourceRef.current?.stop(); } catch {}
      try { tutorSourceRef.current?.stop(); } catch {}
      audioCtxRef.current?.close();
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleTranscriptCount]);

  // Visible slices
  const visibleMessages = sortedTranscript.slice(0, visibleTranscriptCount);
  const visibleCommands = sortedWb.slice(0, visibleWbCount);

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); loadAudio(); }}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg"
      >
        <Play className="h-5 w-5" />
        Open Session Replay
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Session Replay</h2>
            <p className="text-xs text-gray-500">
              {studentName || 'Anonymous'} — {subject}/{topic} — {formatTime(totalDurationMs)} total
            </p>
          </div>
          <button onClick={() => { pause(); setIsOpen(false); }} className="p-2 hover:bg-gray-200 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Main content — two panes */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Transcript */}
          <div className="w-1/2 border-r flex flex-col">
            <div className="px-4 py-2 border-b bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Conversation</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {visibleMessages.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-8">Press play to start replay...</p>
              )}
              {visibleMessages.map((entry, i) => (
                <div key={i} className={`flex ${entry.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300 ${
                    entry.role === 'student'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold opacity-60 uppercase">{entry.role}</span>
                      <span className="text-[10px] opacity-40">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{entry.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Right: Whiteboard */}
          <div className="w-1/2 flex flex-col">
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Whiteboard
                <span className="ml-2 text-xs text-gray-400">{visibleWbCount} / {wbAsCommands.length} items</span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {visibleCommands.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No whiteboard content yet...
                </div>
              ) : (
                <WhiteboardCanvas commands={visibleCommands} />
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-t bg-gray-50 space-y-2">
          <ReplayTimeline
            events={timeline}
            totalDurationMs={totalDurationMs}
            currentTimeMs={currentTimeMs}
            onSeek={seek}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={isPlaying ? pause : play}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <button
                onClick={reset}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 4, 8].map(s => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    speed === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Audio mute controls */}
            {audioLoaded && (
              <div className="flex items-center gap-2 border-l pl-3 ml-2">
                <button
                  onClick={() => setStudentMuted(!studentMuted)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    studentMuted ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}
                  title={studentMuted ? 'Unmute student' : 'Mute student'}
                >
                  {studentMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  Student
                </button>
                <button
                  onClick={() => setTutorMuted(!tutorMuted)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    tutorMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title={tutorMuted ? 'Unmute tutor' : 'Mute tutor'}
                >
                  {tutorMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  Tutor
                </button>
              </div>
            )}
            {audioLoading && (
              <span className="text-xs text-gray-400">Loading audio...</span>
            )}

            <div className="text-sm text-gray-500 font-mono">
              {formatTime(currentTimeMs)} / {formatTime(totalDurationMs)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
