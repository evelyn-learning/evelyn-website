/**
 * Lightweight JS/TS code sandbox using Node's built-in `vm` module.
 *
 * Purpose: run short student / tutor code snippets against tutor-provided
 * test cases so the tutor can verify correctness without the student
 * running anything locally.
 *
 * Safety: `vm.createContext` isolates from the host globals. We still set
 * a CPU timeout via `timeout` option and restrict what we put into the
 * context (no `require`, no `process`, no `fs`, no `fetch`). Memory is
 * the main remaining concern — a small `while(true)` with allocation
 * would still crash the runner; but a 2-second timeout bounds damage.
 *
 * Limitations:
 *   - JavaScript only. Python / other languages → Pyodide microservice (TODO).
 *   - No module imports; student code is self-contained.
 *   - `console.log` is captured and returned, not printed.
 */

import vm from 'vm';

export interface TestCase {
  input?: unknown[];        // Positional args passed to the entry function
  expected?: unknown;       // Expected return value (deep-equality check)
  name?: string;            // Test name for reporting
}

export interface RunResult {
  ok: boolean;              // All tests passed + code didn't throw
  compileError?: string;
  runtimeError?: string;
  tests: Array<{
    name: string;
    input?: unknown[];
    expected?: unknown;
    actual?: unknown;
    passed: boolean;
    error?: string;
  }>;
  stdout: string[];         // Captured console.log lines
  timedOut: boolean;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ao = a as Record<string, unknown>;
    const bo = b as Record<string, unknown>;
    const ak = Object.keys(ao); const bk = Object.keys(bo);
    if (ak.length !== bk.length) return false;
    return ak.every(k => deepEqual(ao[k], bo[k]));
  }
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  return false;
}

/**
 * Run a code snippet with test cases.
 *
 * The snippet must define a function named `entry` (configurable via
 * entryName) OR export a default function. Each test case calls the
 * entry function with its `input` args and checks against `expected`.
 */
export function runJsSandbox(
  code: string,
  tests: TestCase[],
  opts: { entryName?: string; timeoutMs?: number } = {},
): RunResult {
  const entryName = opts.entryName || 'solve';
  const timeoutMs = Math.min(opts.timeoutMs || 2000, 5000);
  const stdout: string[] = [];
  const result: RunResult = {
    ok: false,
    tests: [],
    stdout,
    timedOut: false,
  };

  // Isolated sandbox globals. We allow Math, JSON, Array, Object, etc. —
  // all primitives used in typical algorithm problems. No I/O, no process,
  // no require, no fetch.
  const sandbox: vm.Context = vm.createContext({
    console: {
      log: (...args: unknown[]) => stdout.push(args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')),
      warn: (...args: unknown[]) => stdout.push('[warn] ' + args.map(String).join(' ')),
      error: (...args: unknown[]) => stdout.push('[error] ' + args.map(String).join(' ')),
    },
    Math,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Date,
    RegExp,
    Map,
    Set,
    Symbol,
    Error,
    TypeError,
    RangeError,
    Infinity,
    NaN,
    isNaN,
    isFinite,
    parseInt,
    parseFloat,
    undefined,
  });

  // Compile + run the module body
  try {
    const script = new vm.Script(code, { filename: 'student-code.js' });
    script.runInContext(sandbox, { timeout: timeoutMs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/timed out/i.test(msg)) result.timedOut = true;
    result.compileError = msg;
    return result;
  }

  // Resolve entry function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry = (sandbox as any)[entryName] || (sandbox as any).default || (sandbox as any).main;
  if (typeof entry !== 'function') {
    result.runtimeError = `No entry function named "${entryName}" found in sandbox. Define "function ${entryName}(...) { ... }".`;
    return result;
  }

  let allPassed = true;
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const name = t.name || `test ${i + 1}`;
    const callScript = new vm.Script(`__RES = ${entryName}.apply(null, __IN);`, { filename: `test-${i}.js` });
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sandbox as any).__IN = t.input || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sandbox as any).__RES = undefined;
      callScript.runInContext(sandbox, { timeout: timeoutMs });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actual = (sandbox as any).__RES;
      const passed = deepEqual(actual, t.expected);
      if (!passed) allPassed = false;
      result.tests.push({ name, input: t.input, expected: t.expected, actual, passed });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/timed out/i.test(msg)) result.timedOut = true;
      allPassed = false;
      result.tests.push({ name, input: t.input, expected: t.expected, passed: false, error: msg });
    }
  }

  result.ok = allPassed && !result.timedOut;
  return result;
}
