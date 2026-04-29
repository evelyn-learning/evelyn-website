/**
 * Browser-side Python runtime via Pyodide. Lazy-loaded from the
 * jsdelivr CDN on first use so the ~7MB WASM payload only downloads
 * for sessions that actually run Python. numpy / pandas / sympy are
 * fetched alongside the core runtime — that's another ~5-15 MB total
 * but happens once per session and is cached by the browser.
 *
 * Why browser, not server: a serverless function can't ship a 60-100 MB
 * Pyodide bundle (Vercel's per-function limit is 50 MB unzipped). And a
 * persistent server adds ops surface for what's a per-student demo
 * sandbox — better to spend the student's bandwidth than our compute.
 *
 * Test model: the brain emits Python code that includes pytest-style
 * `test_*` functions inline (e.g., `def test_add(): assert add(2,3) == 5`).
 * The runtime executes the source, discovers every top-level function whose
 * name starts with `test_`, calls each one, captures pass/fail/exception
 * per test. Stdout is redirected to a string buffer and surfaced in the
 * RunResult.
 *
 * The result shape mirrors RunResult from code-sandbox.ts so CodeRunRenderer
 * can display JS and Python results uniformly.
 */
import type { RunResult } from './code-sandbox';

const PYODIDE_VERSION = '0.28.0';
const CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${CDN_BASE}pyodide.js`;

// Packages we pre-load on first Python session. numpy / pandas / sympy
// cover the long tail of math / data-science / symbolic-math lessons
// the brain might want to demo. Each is small (~few MB) but they're
// cached after first download so subsequent sessions are instant.
const PRELOAD_PACKAGES = ['numpy', 'pandas', 'sympy'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyodideInstance = any; // The pyodide.js types are loose; we don't bundle them.

interface PyodideWindow extends Window {
  loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInstance>;
}

/** Singleton Pyodide instance. Resolves to the same loader Promise on
 *  every call so we never load twice within a session. */
let pyodideLoadPromise: Promise<PyodideInstance> | null = null;
/** Optional callback hook for status display ("Loading Python sandbox…"). */
let onLoadStatus: ((status: string) => void) | null = null;

export function setPyodideLoadStatusCallback(cb: ((s: string) => void) | null): void {
  onLoadStatus = cb;
}

async function injectPyodideScript(): Promise<void> {
  if (typeof document === 'undefined') {
    throw new Error('Pyodide can only run in the browser');
  }
  if ((window as PyodideWindow).loadPyodide) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PYODIDE_SCRIPT_URL}"]`);
    if (existing) {
      // Wait for it to finish loading if a prior call kicked it off.
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', (e) => reject(new Error(`pyodide.js script load failed: ${e}`)), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('pyodide.js script load failed'));
    document.head.appendChild(script);
  });
}

async function loadPyodideOnce(): Promise<PyodideInstance> {
  if (pyodideLoadPromise) return pyodideLoadPromise;
  pyodideLoadPromise = (async () => {
    onLoadStatus?.('Loading Python sandbox… (~7 MB, one-time)');
    await injectPyodideScript();
    const w = window as PyodideWindow;
    if (!w.loadPyodide) throw new Error('window.loadPyodide unavailable after script load');
    const py = await w.loadPyodide({ indexURL: CDN_BASE });
    onLoadStatus?.('Loading numpy / pandas / sympy… (one-time)');
    try {
      // Sequential rather than parallel — Pyodide's loadPackage gets
      // grumpy with concurrent calls, and the per-package time is
      // dominated by network so concurrency wouldn't help much anyway.
      for (const pkg of PRELOAD_PACKAGES) {
        await py.loadPackage(pkg);
      }
    } catch (err) {
      // Don't fail the whole load if one optional package can't fetch
      // — the code might not need it. Log and continue.
      console.warn('[python-runtime] preload package(s) failed:', err);
    }
    onLoadStatus?.('Python ready.');
    return py;
  })();
  return pyodideLoadPromise;
}

/** Reset the loader between sessions if needed (e.g., for tests).
 *  Most callers don't need this. */
export function _resetPyodideLoaderForTests(): void {
  pyodideLoadPromise = null;
}

/** Default per-execution timeout. Pyodide runs on the main thread so
 *  a runaway loop locks the UI; cap at 5s. The student can't request
 *  more via the brain's args (we floor it at the runtime). */
const DEFAULT_TIMEOUT_MS = 5000;

/**
 * The Python harness we wrap around the brain-supplied source. It:
 *  1. Captures stdout into a buffer (redirect sys.stdout).
 *  2. Executes the source in a fresh module-like namespace.
 *  3. Discovers every top-level callable named `test_*`.
 *  4. Runs each in a try/except, recording pass/fail + the exception
 *     message + first AssertionError-relevant frame for context.
 *  5. Returns a JSON-serializable dict matching the RunResult shape.
 */
const PYTHON_HARNESS = `
import sys, io, json, traceback
def __evelyn_run(source: str):
    captured = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = captured
    ns = {}
    compile_err = None
    runtime_err = None
    try:
        exec(compile(source, "<student>", "exec"), ns)
    except SyntaxError as e:
        compile_err = f"SyntaxError: {e.msg} (line {e.lineno})"
    except Exception:
        runtime_err = traceback.format_exc()
    finally:
        sys.stdout = old_stdout
    if compile_err:
        return {"ok": False, "compileError": compile_err, "tests": [], "stdout": captured.getvalue().splitlines(), "timedOut": False}
    test_names = [k for k, v in ns.items() if k.startswith("test_") and callable(v)]
    test_names.sort()
    tests = []
    for name in test_names:
        sys.stdout = io.StringIO()  # per-test stdout would be nice but harness keeps simple
        try:
            ns[name]()
            tests.append({"name": name, "passed": True})
        except AssertionError as e:
            tests.append({"name": name, "passed": False, "error": f"AssertionError: {e}" if str(e) else "AssertionError"})
        except Exception as e:
            tests.append({"name": name, "passed": False, "error": f"{type(e).__name__}: {e}"})
        finally:
            sys.stdout = old_stdout
    all_passed = all(t["passed"] for t in tests)
    return {
        "ok": all_passed and not runtime_err,
        "runtimeError": runtime_err,
        "tests": tests,
        "stdout": captured.getvalue().splitlines(),
        "timedOut": False,
    }
__evelyn_run
`.trim();

/**
 * Run a Python snippet via Pyodide and return a RunResult. The snippet
 * may include pytest-style `test_*` functions; the runtime discovers
 * and executes them, recording pass/fail per test.
 */
export async function runPythonSandbox(
  code: string,
  opts: { timeoutMs?: number } = {},
): Promise<RunResult> {
  const timeoutMs = Math.min(15000, Math.max(50, opts.timeoutMs ?? DEFAULT_TIMEOUT_MS));
  let py: PyodideInstance;
  try {
    py = await loadPyodideOnce();
  } catch (err) {
    return {
      ok: false,
      runtimeError: `Pyodide failed to load: ${(err as Error).message}`,
      tests: [],
      stdout: [],
      timedOut: false,
    };
  }
  // Build the runner: harness pythonn → Python function we invoke with the user's source.
  // Use Promise.race for the timeout — Pyodide is sync-on-the-main-thread, so this
  // doesn't actually CANCEL the execution, it just stops us waiting on it. A runaway
  // loop will still freeze the UI until it returns; we accept that as the cost of
  // not running in a Web Worker (deferred — a worker would re-load Pyodide and add
  // ~7MB of extra memory + complicate package loading).
  try {
    const runner = py.runPython(PYTHON_HARNESS);
    const resultPromise = (async () => {
      // pyodide returns PyProxy for dicts; we toJs() them into plain objects.
      const pyResult = runner(code);
      const jsResult = pyResult.toJs({ dict_converter: Object.fromEntries });
      pyResult.destroy?.();
      return jsResult as RunResult;
    })();
    const timeoutPromise = new Promise<RunResult>((resolve) => {
      setTimeout(() => {
        resolve({
          ok: false,
          runtimeError: `Execution timed out after ${timeoutMs}ms`,
          tests: [],
          stdout: [],
          timedOut: true,
        });
      }, timeoutMs);
    });
    return await Promise.race([resultPromise, timeoutPromise]);
  } catch (err) {
    return {
      ok: false,
      runtimeError: (err as Error).message,
      tests: [],
      stdout: [],
      timedOut: false,
    };
  }
}
