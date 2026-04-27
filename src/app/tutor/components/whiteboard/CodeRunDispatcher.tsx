'use client';

/**
 * CodeRunDispatcher — fetches /api/tutor/run-code with the
 * brain-supplied code + tests and feeds the result into
 * CodeRunRenderer. Lives separately because the whiteboard canvas
 * dispatch (server-rendered? no — but typed as pure render) prefers
 * not to kick off async fetches inline.
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

export default function CodeRunDispatcher(props: CodeRunDispatcherProps) {
  const [result, setResult] = useState<RunResult | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
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
    />
  );
}
