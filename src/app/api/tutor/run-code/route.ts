/**
 * POST /api/tutor/run-code
 *   Run JavaScript snippets in the existing vm-based sandbox against
 *   tutor-provided test cases. Returns pass/fail per test + captured
 *   stdout. Server-side because the sandbox uses node:vm; can't run
 *   in the browser.
 *
 * Body:
 *   { code: string, entry?: string, tests?: TestCase[], timeoutMs?: number }
 *
 * The brain calls show_run_code (tool) which dispatches to
 * showRunCode action; the canvas case POSTs here, then renders the
 * RunResult via CodeRunRenderer. The execution itself is sync from
 * the canvas's perspective; the actual eval is bounded by `timeoutMs`
 * (default 2000) inside vm.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runJsSandbox, type TestCase, type RunResult } from '@/lib/tutor/validation/code-sandbox';

interface RunCodeBody {
  code: string;
  entry?: string;
  tests?: TestCase[];
  timeoutMs?: number;
}

export async function POST(req: NextRequest) {
  let body: RunCodeBody;
  try {
    body = (await req.json()) as RunCodeBody;
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  if (typeof body.code !== 'string' || !body.code.trim()) {
    return NextResponse.json({ error: 'code required' }, { status: 400 });
  }
  // Cap timeout so the brain can't request a 5-minute eval.
  const timeoutMs = Math.min(5000, Math.max(50, body.timeoutMs ?? 2000));
  const result: RunResult = runJsSandbox(body.code, body.tests ?? [], {
    entryName: body.entry,
    timeoutMs,
  });
  return NextResponse.json(result);
}
