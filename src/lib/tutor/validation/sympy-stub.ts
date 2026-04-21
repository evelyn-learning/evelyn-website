/**
 * SymPy validator — RFC / stub.
 *
 * SymPy is the next validator tier for symbolic math beyond Wolfram:
 * proofs, limits, series expansion, linear algebra without API costs, and
 * offline operation. This file documents the integration options and
 * provides a stub so the dispatcher can route to it when a deployment
 * chooses one.
 *
 * ─── Options ──────────────────────────────────────────────────────
 *
 * Option 1: Pyodide in Node
 *   • Pyodide runs CPython+SymPy in WASM. `pyodide` npm package, ~40 MB.
 *   • Pros: no extra infra, deterministic, offline.
 *   • Cons: cold-start ~2s, memory ~100 MB per process, CPU-only (no JIT).
 *   • Load once per Node process; reuse. Run student-safe — sandbox-by-design.
 *
 * Option 2: FastAPI Python microservice
 *   • Dedicated `pypy-fastapi` service with SymPy installed natively.
 *   • Pros: fast, native SymPy, isolated from Node process memory.
 *   • Cons: extra deployment target, inter-service auth, cache consistency.
 *   • Recommended if Pyodide cold-start becomes a bottleneck.
 *
 * Option 3: Wolfram Cloud / Mathematica API
 *   • Already integrated for numeric math via wolframalpha-short API.
 *   • Pros: same vendor, no new infra.
 *   • Cons: per-call cost, no symbolic-step trace for teaching.
 *
 * ─── Recommendation ──────────────────────────────────────────────
 *   Start with Option 1 (Pyodide). It's the lowest-friction path and
 *   the cold-start penalty is one-time per Node process; subsequent
 *   requests are ~50 ms. Migrate to Option 2 if we see memory pressure
 *   across shared API containers.
 *
 * ─── Stub behavior ───────────────────────────────────────────────
 *   This module returns a structured "not-implemented" response so the
 *   dispatcher can route without crashing. When Pyodide is wired in,
 *   swap the stub for the real evaluator without touching the caller.
 */

export interface SymPyRequest {
  operation: 'simplify' | 'expand' | 'factor' | 'derivative' | 'integral' | 'solve' | 'limit' | 'series';
  expression: string;        // SymPy-style string; e.g. "x**2 + 2*x + 1"
  variable?: string;         // For derivative/integral/solve
  at?: number | string;      // For limit / series (point)
  target?: string;           // For compare-mode: student's answer to check
}

export interface SymPyResponse {
  correct: boolean;
  expected?: string;         // SymPy canonical form of the result
  issues?: string[];
  source: 'sympy' | 'sympy-stub';
}

/**
 * Stub implementation. Swap this for the Pyodide-backed evaluator once
 * the WASM bundle is wired in.
 */
export async function runSymPyStub(req: SymPyRequest): Promise<SymPyResponse> {
  if (!req?.operation || !req?.expression) {
    return {
      correct: false,
      issues: ['SymPy request must include {operation, expression}.'],
      source: 'sympy-stub',
    };
  }
  return {
    correct: false,
    issues: [
      'SymPy evaluator not yet wired. Use /api/tutor/validate-math-wolfram for numeric/graph checks in the meantime.',
      'To enable: install `pyodide`, import SymPy via pyodide.loadPackage("sympy"), and evaluate in a cached runtime.',
    ],
    source: 'sympy-stub',
  };
}
