'use client';

/**
 * Dev-only whiteboard BOARD preview (session-quality D, 2026-07-08).
 *
 * Sibling of /tutor/render-harness, but mounts the FULL WhiteboardCanvas
 * with an arbitrary COMMAND SEQUENCE (the harness drives a single tool
 * call) — pages, tables, equations, scribbles, exactly as a live session
 * board composes them. Built for marketing captures (the crimsora hero
 * screenshot renders a real session's stored whiteboardCommands) and
 * handy for eyeballing any recorded board without admin/replay chrome.
 *
 *   /tutor/board-preview#<base64-json>
 *     where json = Array<{ action: string; data?: object }>  (the stored
 *     TutorSession.whiteboardCommands entry shape; `data` is flattened
 *     back onto the command like the admin ReplayPlayer does).
 *
 * Disabled outside development.
 */

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { WhiteboardCanvas } from '@/app/tutor/components/whiteboard/WhiteboardCanvas';
import type { WhiteboardCommand } from '@core/knowledge/types';

function parseHash(): WhiteboardCommand[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.location.hash.slice(1);
    if (!raw) return [];
    // atob yields Latin-1 code units — decode the byte string as UTF-8 so
    // multi-byte chars (em-dashes in equation labels) survive.
    const utf8 = new TextDecoder().decode(Uint8Array.from(atob(raw), (c) => c.charCodeAt(0)));
    const entries = JSON.parse(utf8) as Array<{ action: string; data?: Record<string, unknown> }>;
    return entries
      .filter((e) => e && typeof e.action === 'string')
      .map((e) => ({ action: e.action, ...(e.data ?? {}) }) as unknown as WhiteboardCommand);
  } catch (err) {
    console.error('[board-preview] bad hash payload:', err);
    return [];
  }
}

export default function BoardPreviewPage() {
  const [commands, setCommands] = useState<WhiteboardCommand[]>([]);
  useEffect(() => {
    const apply = () => setCommands(parseHash());
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return <div style={{ padding: 24 }}>board-preview is dev-only.</div>;
  }

  return (
    <div data-harness="board-preview" style={{ width: '100vw', height: '100vh', background: '#fff', overflow: 'hidden' }}>
      {/* Desmos primary renderer, same as the tutor page / render-harness. */}
      <Script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=47658ec5a4894397ae1e1a46a6174a9a" strategy="afterInteractive" />
      {commands.length === 0 ? (
        <div style={{ padding: 24, fontFamily: 'monospace', color: '#6b7280' }}>
          No commands — pass #&lt;base64 JSON array of {'{action, data}'}&gt;.
        </div>
      ) : (
        <WhiteboardCanvas commands={commands} />
      )}
    </div>
  );
}
