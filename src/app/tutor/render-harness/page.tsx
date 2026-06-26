'use client';

/**
 * Dev-only whiteboard render harness.
 *
 * Drives a SINGLE whiteboard tool deterministically — no brain, no session.
 * Reads a raw tool-call fixture from the URL hash, runs it through the real
 * validate→convert seam (processToolCall), and mounts the REAL CommandRenderer.
 *
 *   /tutor/render-harness#<base64-json>   where json = { tool, args }
 *
 * Exposes window.__renderResult = { rejected, reason?, action?, error? } once
 * settled, for the Playwright runner to read. Also human-inspectable: open the
 * URL and eyeball any tool's output.
 *
 * Disabled outside development.
 */

import React from 'react';
import Script from 'next/script';
import { CommandRenderer, WhiteboardCallbackContext } from '@/app/tutor/components/whiteboard/WhiteboardCanvas';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import { processToolCall } from '@/lib/tutor/whiteboard/process-tool-call';

type RenderResult = {
  rejected: boolean;
  reason?: string;
  action?: string;
  error?: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __renderResult: RenderResult | undefined;
}

function setResult(r: RenderResult) {
  if (typeof window !== 'undefined') window.__renderResult = r;
}

/** Catches render-time throws so the harness can report them instead of a blank page. */
class RenderErrorBoundary extends React.Component<
  { action?: string; children: React.ReactNode },
  { error: string | null }
> {
  constructor(props: { action?: string; children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err: unknown) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
  componentDidCatch(err: unknown) {
    setResult({ rejected: false, action: this.props.action, error: err instanceof Error ? err.message : String(err) });
  }
  render() {
    if (this.state.error) {
      return (
        <div data-harness="render-error" style={{ color: '#b91c1c', padding: 16, fontFamily: 'monospace' }}>
          RENDER ERROR: {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}

function decodeFixture(): { tool: string; args: Record<string, unknown> } | { _error: string } {
  try {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
    if (!hash) return { _error: 'no fixture in URL hash' };
    const json = decodeURIComponent(escape(atob(hash)));
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed.tool !== 'string') return { _error: 'fixture must be { tool, args }' };
    return { tool: parsed.tool, args: (parsed.args ?? {}) as Record<string, unknown> };
  } catch (e) {
    return { _error: e instanceof Error ? e.message : String(e) };
  }
}

export default function RenderHarnessPage() {
  const [command, setCommand] = React.useState<WhiteboardCommand | null>(null);
  const [panel, setPanel] = React.useState<{ kind: 'rejected' | 'error' | 'empty'; text: string } | null>(null);

  React.useEffect(() => {
    function run() {
      // Clear so the runner's `waitFor __renderResult !== undefined` blocks
      // until THIS fixture settles (hash-only nav doesn't remount the page).
      if (typeof window !== 'undefined') window.__renderResult = undefined;
      setCommand(null);
      setPanel(null);
      if (process.env.NODE_ENV === 'production') {
        setResult({ rejected: false, error: 'disabled in production' });
        setPanel({ kind: 'error', text: 'render-harness disabled in production' });
        return;
      }
      const fx = decodeFixture();
      if ('_error' in fx) {
        setResult({ rejected: false, error: fx._error });
        setPanel({ kind: 'empty', text: fx._error });
        return;
      }
      const result = processToolCall(fx.tool, fx.args);
      if (!result.ok) {
        setResult({ rejected: true, reason: result.reason, action: undefined });
        setPanel({ kind: 'rejected', text: result.reason });
        return;
      }
      // Settle the deterministic result; the error boundary may overwrite it
      // if the renderer throws during mount.
      setResult({ rejected: false, action: result.command.action, error: null });
      setCommand(result.command as unknown as WhiteboardCommand);
    }
    run();
    window.addEventListener('hashchange', run);
    return () => window.removeEventListener('hashchange', run);
  }, []);

  return (
    <WhiteboardCallbackContext.Provider value={{}}>
      {/* Load Desmos so graph fixtures render via DesmosGraphRenderer (the
          production primary), not the Mafs fallback. Same key as the tutor page. */}
      <Script
        src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=47658ec5a4894397ae1e1a46a6174a9a"
        strategy="afterInteractive"
      />
      <div data-harness="root" style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
        {panel && (
          <div
            data-harness={panel.kind}
            style={{
              padding: 16,
              fontFamily: 'monospace',
              fontSize: 13,
              color: panel.kind === 'rejected' ? '#92400e' : '#6b7280',
              background: panel.kind === 'rejected' ? '#fef3c7' : '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
            }}
          >
            {panel.kind === 'rejected' ? 'TOOL REJECTED: ' : ''}
            {panel.text}
          </div>
        )}
        {command && (
          <RenderErrorBoundary action={command.action}>
            <div data-harness="render">
              <CommandRenderer command={command} />
            </div>
          </RenderErrorBoundary>
        )}
      </div>
    </WhiteboardCallbackContext.Provider>
  );
}
