/**
 * The product's grading, reached by IMPORT — nothing is copied.
 *
 * `scripts/practice-extend/grader-test.ts` holds the offline harness around
 * the product's real graders (the academy card + stored grade for mcq and
 * numeric, the engine's gradeFreeResponse for free text, with the model judge
 * replaced by a stub that records "deferred"), and the generators of the
 * equivalent / wrong submissions a student could type. It is a CLI: it keeps
 * those functions private and runs `main()` when loaded. This module loads
 * that file as it is and, at compile time only, swaps its final "run the CLI"
 * line for an export of the functions — so the code that runs here is that
 * file's code, byte for byte, and a change there is a change here. If the
 * file's last line ever changes shape the load fails loudly (no fallback).
 *
 * Loading it also installs that file's guards: any socket or fetch throws,
 * and a model API key in the environment is refused.
 */
import '../lib/no-db-env';
import Module from 'node:module';
import path from 'node:path';
import type { BankRow } from './core';

export type { BankRow };
export type Outcome = 'accepted' | 'rejected' | 'deferred' | 'blocked';
export interface Sub { cls: 'key' | 'equiv' | 'wrong' | 'info'; kind: string; text: string }
export interface ReaderGrade { id: string; reason?: string }

interface Internals {
  stemPlaces(stem: string): number | null;
  stemSigFigs(stem: string): number | null;
  stemUnit(stem: string): string | null;
  grade(r: BankRow, text: string): Promise<{ outcome: Outcome; stored?: Outcome }>;
  numericSubs(r: BankRow, grades: ReaderGrade[]): Sub[];
  mcqSubs(r: BankRow): Sub[];
  freeSubs(r: BankRow, grades: ReaderGrade[]): Sub[];
  formContradictions(r: BankRow): Array<{ kind: string; detail: string; harmful: boolean }>;
  guard: { sockets: number; fetches: number; judgeStubCalls: number };
}

const GRADER_TEST = path.resolve(__dirname, '../practice-extend/grader-test.ts');
// The transpiled form of the file's last statement (the loader strips
// whitespace): main().then(() => process.exit(…), (e) => { console.error(e); process.exit(1); });
const RUN_LINE = /main\(\)\s*\.then\(\s*\(\)\s*=>\s*process\.exit\(process\.exitCode\s*\?\?\s*0\)\s*,\s*\(?e\)?\s*=>\s*\{\s*console\.error\(e\);\s*process\.exit\(1\);?\s*\}\s*\);/;
const EXPORT_LINE = 'module.exports.__internals = { grade, numericSubs, mcqSubs, freeSubs, formContradictions, guard };';

function loadInternals(): Internals {
  type Compile = (this: unknown, content: string, filename: string) => unknown;
  const proto = Module.prototype as unknown as { _compile: Compile };
  const original = proto._compile;
  let swapped = false;
  proto._compile = function patched(content: string, filename: string): unknown {
    if (filename !== GRADER_TEST) return original.call(this, content, filename);
    if (content.split(RUN_LINE).length !== 2) throw new Error('practice-fix: grader-test.ts no longer ends with its `main().then(…)` line — update product-grader.ts');
    swapped = true;
    return original.call(this, content.replace(RUN_LINE, EXPORT_LINE), filename);
  };
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(GRADER_TEST) as { __internals?: Internals } & Pick<Internals, 'stemPlaces' | 'stemSigFigs' | 'stemUnit'>;
    if (!swapped || !mod.__internals) throw new Error('practice-fix: grader-test.ts was loaded without the export swap (already loaded elsewhere?)');
    for (const k of ['grade', 'numericSubs', 'mcqSubs', 'freeSubs', 'formContradictions'] as const) {
      if (typeof mod.__internals[k] !== 'function') throw new Error(`practice-fix: grader-test.ts has no function ${k}`);
    }
    return { ...mod.__internals, stemPlaces: mod.stemPlaces, stemSigFigs: mod.stemSigFigs, stemUnit: mod.stemUnit };
  } finally {
    proto._compile = original;
  }
}

const internals = loadInternals();
export const grade = internals.grade;
export const numericSubs = internals.numericSubs;
export const mcqSubs = internals.mcqSubs;
export const freeSubs = internals.freeSubs;
export const formContradictions = internals.formContradictions;
export const networkGuard = internals.guard;
export const stemPlaces = internals.stemPlaces;
export const stemSigFigs = internals.stemSigFigs;
export const stemUnit = internals.stemUnit;
