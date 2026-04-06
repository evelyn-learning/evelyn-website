'use client';

import { useCallback, useRef } from 'react';
import { MicOff, Upload, AlertTriangle } from 'lucide-react';

export interface TimelineEvent {
  type: 'transcript' | 'whiteboard' | 'debug';
  offsetMs: number;
  data: {
    role?: string;
    type?: string;
    message?: string;
    [key: string]: unknown;
  };
}

interface ReplayTimelineProps {
  events: TimelineEvent[];
  totalDurationMs: number;
  currentTimeMs: number;
  onSeek: (timeMs: number) => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ReplayTimeline({ events, totalDurationMs, currentTimeMs, onSeek }: ReplayTimelineProps) {
  const barRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || totalDurationMs <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * totalDurationMs);
  }, [totalDurationMs, onSeek]);

  const handleDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 || !barRef.current || totalDurationMs <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * totalDurationMs);
  }, [totalDurationMs, onSeek]);

  const progressPct = totalDurationMs > 0 ? (currentTimeMs / totalDurationMs) * 100 : 0;

  // Collect debug event markers
  const debugMarkers = events.filter(e => e.type === 'debug' && totalDurationMs > 0);

  // Build conversation segments (student/tutor speaking blocks)
  const transcriptEvents = events.filter(e => e.type === 'transcript');
  const segments: { start: number; end: number; role: string }[] = [];
  for (let i = 0; i < transcriptEvents.length; i++) {
    const ev = transcriptEvents[i];
    const nextEv = transcriptEvents[i + 1];
    const endMs = nextEv ? nextEv.offsetMs : totalDurationMs;
    segments.push({ start: ev.offsetMs, end: endMs, role: ev.data.role as string });
  }

  return (
    <div className="space-y-1">
      {/* Time display */}
      <div className="flex justify-between text-[11px] text-gray-400 font-mono px-0.5">
        <span>{formatTime(currentTimeMs)}</span>
        <span>{formatTime(totalDurationMs)}</span>
      </div>

      {/* Timeline bar */}
      <div
        ref={barRef}
        className="relative h-6 bg-gray-200 rounded-full cursor-pointer select-none overflow-hidden"
        onClick={handleClick}
        onMouseMove={handleDrag}
      >
        {/* Conversation segments */}
        {segments.map((seg, i) => {
          const leftPct = (seg.start / totalDurationMs) * 100;
          const widthPct = ((seg.end - seg.start) / totalDurationMs) * 100;
          return (
            <div
              key={i}
              className={`absolute top-0 h-full ${
                seg.role === 'student' ? 'bg-blue-100' : seg.role === 'tutor' ? 'bg-gray-300' : 'bg-yellow-100'
              }`}
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            />
          );
        })}

        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-500/30 rounded-l-full transition-[width] duration-75"
          style={{ width: `${progressPct}%` }}
        />

        {/* Debug event markers */}
        {debugMarkers.map((ev, i) => {
          const leftPct = (ev.offsetMs / totalDurationMs) * 100;
          const debugType = ev.data.type as string;
          const isMute = debugType === 'mic_mute' || debugType === 'mic_unmute';
          const isUpload = debugType === 'image_upload';
          const isError = debugType === 'error' || debugType === 'tool_call_error';

          return (
            <div
              key={`debug-${i}`}
              className="absolute top-0.5 -translate-x-1/2 group"
              style={{ left: `${leftPct}%` }}
              title={`${debugType}: ${ev.data.message || ''}`}
            >
              <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                isError ? 'bg-red-400' : isMute ? 'bg-orange-400' : isUpload ? 'bg-green-400' : 'bg-gray-400'
              }`}>
                {isMute && <MicOff className="w-2 h-2 text-white" />}
                {isUpload && <Upload className="w-2 h-2 text-white" />}
                {isError && <AlertTriangle className="w-2 h-2 text-white" />}
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                {debugType}: {(ev.data.message as string || '').slice(0, 60)}
              </div>
            </div>
          );
        })}

        {/* Playhead */}
        <div
          className="absolute top-0 h-full w-0.5 bg-blue-600 transition-[left] duration-75"
          style={{ left: `${progressPct}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[10px] text-gray-400 px-0.5">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-100 border border-blue-200" /> Student</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gray-300" /> Tutor</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Mic event</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Upload</span>
      </div>
    </div>
  );
}
