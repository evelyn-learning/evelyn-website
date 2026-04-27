'use client';

/**
 * CodeRunRenderer — code + per-test pass/fail + captured stdout.
 *
 * The brain emits show_run_code with a snippet and a list of test
 * cases. The canvas case POSTs to /api/tutor/run-code which evaluates
 * in the existing vm sandbox and returns the RunResult. This renderer
 * shows it to the student.
 *
 * Design: code on top in a monospace block, test results below in a
 * compact pass/fail list, stdout (when any) shown collapsed. Failed
 * tests show expected vs actual side-by-side.
 */

import React, { useState } from 'react';
import type { RunResult } from '@/lib/tutor/validation/code-sandbox';

export interface CodeRunRendererProps {
  title?: string;
  code: string;
  language?: string;
  result?: RunResult;
  /** When result is undefined the canvas hasn't fetched yet; show a loader. */
  pending?: boolean;
  error?: string;
}

const fmt = (v: unknown): string => {
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return JSON.stringify(v);
  try { return JSON.stringify(v); } catch { return String(v); }
};

export default function CodeRunRenderer({
  title,
  code,
  language = 'javascript',
  result,
  pending,
  error,
}: CodeRunRendererProps) {
  const [showStdout, setShowStdout] = useState(false);

  const passed = result?.tests.filter((t) => t.passed).length ?? 0;
  const total = result?.tests.length ?? 0;
  const allOk = result?.ok ?? false;
  const compileError = result?.compileError;
  const runtimeError = result?.runtimeError;

  const palette = error || compileError || runtimeError || (result && !allOk)
    ? { tag: 'bg-rose-600', accent: 'text-rose-700', border: 'border-rose-300', bg: 'bg-rose-50' }
    : allOk
    ? { tag: 'bg-emerald-600', accent: 'text-emerald-700', border: 'border-emerald-300', bg: 'bg-emerald-50' }
    : { tag: 'bg-slate-500', accent: 'text-slate-700', border: 'border-slate-300', bg: 'bg-slate-50' };

  return (
    <div className={`code-run-renderer my-2 p-3 rounded-lg border-2 max-w-2xl ${palette.bg} ${palette.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-xs font-bold uppercase tracking-wider ${palette.accent}`}>
          {title || `Code · ${language}`}
        </div>
        {pending ? (
          <span className="text-xs text-slate-600">Running…</span>
        ) : result ? (
          <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded ${palette.tag}`}>
            {compileError ? '✗ compile error'
              : runtimeError ? '✗ runtime error'
              : `${passed}/${total} passed`}
          </span>
        ) : null}
      </div>
      <pre className="bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-x-auto whitespace-pre">
        <code>{code}</code>
      </pre>

      {error && <div className="text-xs text-rose-700 mt-2 font-mono">{error}</div>}
      {compileError && <div className="text-xs text-rose-700 mt-2 font-mono whitespace-pre-wrap">{compileError}</div>}
      {runtimeError && <div className="text-xs text-rose-700 mt-2 font-mono whitespace-pre-wrap">{runtimeError}</div>}

      {result && result.tests.length > 0 && (
        <div className="mt-3 space-y-1">
          {result.tests.map((t, i) => (
            <div key={i} className={`text-xs px-2 py-1 rounded ${t.passed ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              <span className={t.passed ? 'text-emerald-800' : 'text-rose-800'}>
                {t.passed ? '✓' : '✗'} {t.name || `test ${i + 1}`}
              </span>
              {!t.passed && t.error && (
                <div className="ml-5 text-rose-700 font-mono">error: {t.error}</div>
              )}
              {!t.passed && t.expected !== undefined && (
                <div className="ml-5 text-rose-700 font-mono">
                  expected: {fmt(t.expected)}
                </div>
              )}
              {!t.passed && t.actual !== undefined && (
                <div className="ml-5 text-rose-700 font-mono">
                  got:      {fmt(t.actual)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {result && result.stdout.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowStdout((v) => !v)}
            className="text-xs text-slate-600 hover:text-slate-900 underline"
          >
            {showStdout ? 'Hide' : 'Show'} stdout ({result.stdout.length} line{result.stdout.length === 1 ? '' : 's'})
          </button>
          {showStdout && (
            <pre className="bg-slate-100 text-slate-800 text-xs rounded p-2 mt-1 overflow-x-auto whitespace-pre">
              {result.stdout.join('\n')}
            </pre>
          )}
        </div>
      )}

      {result?.timedOut && (
        <div className="text-xs text-amber-700 mt-2">⚠ Execution timed out — code may have an infinite loop or be too slow.</div>
      )}
    </div>
  );
}
