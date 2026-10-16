'use client';

/**
 * Dev-only preview of the thinking cue's stage state (GDI sessions
 * 2026-10-15) — the real SessionStage in 'thinking' with a board on screen,
 * no session, no brain. `?lang=ja` shows the Japanese label; `?state=speaking`
 * shows the same stage with the cue hidden. Disabled outside development.
 */

import React, { useEffect, useState } from 'react';
import SessionStage, { type VoiceState } from '@/app/tutor/components/session/SessionStage';
import { thinkingCueVisible, thinkingCueLabel } from '@/lib/tutor/voice/thinking-cue';

export default function ThinkingCuePreviewPage() {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => { setParams(new URLSearchParams(window.location.search)); }, []);
  if (process.env.NODE_ENV !== 'development') {
    return <div style={{ padding: 24 }}>thinking-cue-preview is dev-only.</div>;
  }
  if (!params) return null;
  const voiceState = (params.get('state') ?? 'thinking') as VoiceState;
  const lang = params.get('lang') === 'ja' ? 'ja' : undefined;
  const text = thinkingCueVisible(true, true, voiceState) ? thinkingCueLabel(lang) : null;
  return (
    <SessionStage
      lessonTitle="Meeting Skills 1 — Scheduling a Meeting"
      hasPlan
      isFreePractice={false}
      started
      voiceState={voiceState}
      thinkingCueText={text}
      liveCaption="Is that polite enough to say to my manager in English?"
      boardEmpty={false}
      board={
        <div style={{ padding: 24, fontFamily: 'system-ui', fontSize: 20, color: '#0f172a' }}>
          <div style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>Proposing a time</div>
          Kim&apos;s message: &quot;Are you free Tuesday morning?&quot;
        </div>
      }
      voiceInput={<div style={{ padding: 8, fontSize: 13, color: '#64748b' }}>(voice dock)</div>}
      transcript={<div />}
      onStudentInput={() => {}}
    />
  );
}
