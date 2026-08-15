'use client';

/**
 * CodeRunDispatcher — runs the brain-supplied code and feeds the result
 * into CodeRunRenderer.
 *
 * Dispatches by language:
 *   - JS (default): fetches /api/tutor/run-code which runs node:vm
 *     server-side. Test shape: {input[], expected, name}.
 *   - Python: loads Pyodide in the BROWSER on first use (one-time
 *     ~7-15 MB download incl. numpy/pandas/sympy, browser-cached).
 *     Test shape: pytest-style `test_*` functions embedded in the
 *     source itself; runtime discovers + runs them.
 *
 * Why the split: a serverless function can't ship a 60-100 MB Pyodide
 * bundle, and JS via Pyodide would forfeit the existing node:vm
 * sandbox + tests. Each language uses its own most natural model.
 */

import React, { useEffect, useState } from 'react';
import CodeRunRenderer from './CodeRunRenderer';
import type { RunResult, TestCase } from '@/lib/tutor/validation/code-sandbox';

export interface CodeRunDispatcherProps {
  title?: string;
  code: string;
  entry?: string;
  language?: string;
  tests?: TestCase[];
  timeoutMs?: number;
}

function isPythonLanguage(language: string | undefined): boolean {
  if (!language) return false;
  const l = language.toLowerCase().trim();
  return l === 'python' || l === 'py' || l === 'python3';
}

export default function CodeRunDispatcher(props: CodeRunDispatcherProps) {
  const [result, setResult] = useState<RunResult | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loadStatus, setLoadStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isPythonLanguage(props.language)) {
          // Browser-side Pyodide path. The first call lazy-loads
          // Pyodide + preloads numpy/pandas/sympy; subsequent calls
          // reuse the cached instance. setPyodideLoadStatusCallback
          // surfaces "Loading Python sandbox…" / "Loading numpy…" so
          // the user sees progress on the cold path.
          const { runPythonSandbox, setPyodideLoadStatusCallback } = await import('@/lib/tutor/validation/python-runtime');
          setPyodideLoadStatusCallback((s) => { if (!cancelled) setLoadStatus(s); });
          const data = await runPythonSandbox(props.code, { timeoutMs: props.timeoutMs });
          setPyodideLoadStatusCallback(null);
          if (!cancelled) {
            setLoadStatus(undefined);
            setResult(data);
          }
          return;
        }
        // JS path (default) — server-side node:vm.
        const res = await fetch('/api/tutor/run-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: props.code,
            entry: props.entry,
            tests: props.tests,
            timeoutMs: props.timeoutMs,
          }),
        });
        if (!res.ok) {
          const errText = await res.text().catch(() => 'request failed');
          if (!cancelled) setError(errText);
          return;
        }
        const data = (await res.json()) as RunResult;
        if (!cancelled) setResult(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => { cancelled = true; };
    // We deliberately don't depend on tests/code references because the
    // brain emits them once and we want exactly one fetch per command.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CodeRunRenderer
      title={props.title}
      code={props.code}
      language={props.language}
      result={result}
      pending={!result && !error}
      error={error}
      loadStatus={loadStatus}
    />
  );
}
