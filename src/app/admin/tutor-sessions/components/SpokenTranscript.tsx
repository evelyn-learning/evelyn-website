'use client';

/**
 * Full-transcript panel with a "spoken form" audit toggle.
 *
 * The stored transcript is the WRITTEN/display form (what captions + PDF
 * show). The tutor's audio is that text run through `rewriteForTTS` at
 * speech time — it's never persisted. Because that rewrite is pure and
 * deterministic, we reconstruct exactly what Cartesia was fed by mapping
 * each tutor turn through the same function here. Surfacing the delta lets
 * an admin catch mispronunciations (e.g. "SD" that would voice as "South
 * Dakota") without listening to the whole recording.
 *
 * Only tutor turns are rewritten: student turns are STT (already what was
 * said) and system turns are never spoken.
 */

import { useMemo, useState } from 'react';
import { rewriteForTTS } from '@/lib/tutor/voice/tts-pronunciation';

interface TranscriptEntry {
  role: string;
  text: string;
  timestamp: string;
  pedagogicalIntent?: string;
}

const isTutorTurn = (role: string) => role !== 'student' && role !== 'system';

export default function SpokenTranscript({ transcript }: { transcript: TranscriptEntry[] }) {
  const [showSpoken, setShowSpoken] = useState(false);

  // Precompute the spoken form + whether it differs for every tutor turn.
  const rows = useMemo(
    () =>
      transcript.map((entry) => {
        const spoken = isTutorTurn(entry.role) ? rewriteForTTS(entry.text) : entry.text;
        const differs = isTutorTurn(entry.role) && spoken !== entry.text.trim();
        return { entry, spoken, differs };
      }),
    [transcript],
  );

  const tutorTurns = rows.filter((r) => isTutorTurn(r.entry.role)).length;
  const differing = rows.filter((r) => r.differs).length;

  return (
    <div className="rounded-xl bg-white shadow overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b bg-gray-50">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Full Transcript</h2>
          {tutorTurns > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">
              {differing > 0 ? (
                <>
                  <span className="font-medium text-amber-700">{differing}</span> of {tutorTurns} tutor turns
                  read differently when spoken
                </>
              ) : (
                <>All {tutorTurns} tutor turns are spoken as written</>
              )}
            </p>
          )}
        </div>
        {differing > 0 && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showSpoken}
              onChange={(e) => setShowSpoken(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Show spoken form (TTS)
          </label>
        )}
      </div>
      <div className="px-6 py-4 max-h-[600px] overflow-y-auto space-y-3">
        {rows.length === 0 ? (
          <p className="text-gray-400 text-sm">No transcript entries.</p>
        ) : (
          rows.map(({ entry, spoken, differs }, i) => (
            <div key={i} className={`flex ${entry.role === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-xl px-4 py-2 text-sm ${
                  entry.role === 'student'
                    ? 'bg-blue-500 text-white'
                    : entry.role === 'system'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-medium opacity-70 uppercase">{entry.role}</span>
                  <span className="text-[10px] opacity-50">
                    {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  {differs && (
                    <span
                      className="text-[10px] font-medium rounded bg-amber-100 text-amber-700 px-1"
                      title="Spoken form differs from written text"
                    >
                      🔊 rewritten
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{entry.text}</p>
                {differs && showSpoken && (
                  <div className="mt-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5">
                    <span className="text-[10px] font-medium uppercase text-amber-700">Spoken</span>
                    <p className="whitespace-pre-wrap text-amber-900">{spoken}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
