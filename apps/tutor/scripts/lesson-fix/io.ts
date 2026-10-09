/**
 * Lesson-correction tooling — local file access only (no database, no
 * network). Shared by validate-patches.ts and build-apply-script.ts.
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import {
  patchFileShapeProblems,
  validateWithWaivers,
  type Issue,
  type Lesson,
  type PatchFile,
  type ValidationResult,
  type Waiver,
} from './core';

export const LESSON_READ_DIR = process.env.LESSON_READ_DIR
  ?? '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration/lesson-read-2026-10-10';
/** The writers' files and recheck.json — read by merge-followups.ts only. */
export const WRITER_PATCH_DIR = path.join(LESSON_READ_DIR, 'patches');
/** The merged, final patches — the ONLY folder validation and the apply build read. */
export const FINAL_PATCH_DIR = path.join(WRITER_PATCH_DIR, 'final');
export const PATCH_DIR = FINAL_PATCH_DIR;
export const LESSON_DIR = path.join(LESSON_READ_DIR, 'lessons');
export const TOOLING_DIR = path.join(LESSON_READ_DIR, 'tooling');
const DATA_DIR = path.resolve(__dirname, '../../src/data');

export function loadLessons(dir: string = LESSON_DIR): Map<string, Lesson> {
  const out = new Map<string, Lesson>();
  for (const name of fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f)).sort()) {
    const lesson = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')) as Lesson;
    out.set(name.replace(/\.json$/, ''), lesson);
  }
  return out;
}

/** Every `*.json` in the patch folder. A file that does not parse or has the
 *  wrong shape becomes an error issue, never a silent skip. */
export function loadPatchFiles(dir: string = PATCH_DIR, skip: readonly string[] = []): { files: PatchFile[]; loadIssues: Issue[] } {
  const files: PatchFile[] = [];
  const loadIssues: Issue[] = [];
  if (!fs.existsSync(dir)) return { files, loadIssues };
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !skip.includes(f)).sort()) {
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
    } catch (err) {
      loadIssues.push({ level: 'error', code: 'file_parse', file: name, message: `does not parse: ${(err as Error).message}` });
      continue;
    }
    const problems = patchFileShapeProblems(raw);
    if (problems.length) {
      loadIssues.push({ level: 'error', code: 'file_shape', file: name, message: problems.join('; ') });
      continue;
    }
    const r = raw as { subject: string; patches: PatchFile['patches']; skipped?: unknown[] };
    files.push({ file: name, subject: r.subject, patches: r.patches, skipped: r.skipped ?? [] });
  }
  return { files, loadIssues };
}

function idSet(file: string): Set<string> {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8')) as { items: Record<string, string> };
  return new Set(Object.keys(raw.items));
}

export const WAIVER_FILE = path.join(TOOLING_DIR, 'validation-waivers.json');

/** The owner's waivers, when the file exists: `[{planId, segmentId, code,
 *  reason}]`. This tooling never writes that file. */
export function loadWaivers(file: string = WAIVER_FILE): Waiver[] {
  if (!fs.existsSync(file)) return [];
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown;
  if (!Array.isArray(raw)) throw new Error(`${file} must be a JSON array`);
  return raw as Waiver[];
}

/** Load everything and validate. `ok` is false when any file failed to load. */
export function validateAll(): ValidationResult {
  const lessons = loadLessons();
  const { files, loadIssues } = loadPatchFiles();
  const result = validateWithWaivers(files, lessons, loadWaivers(), {
    withdrawn: idSet('withdrawn-practice-items.json'),
    auditedLessonSteps: idSet('audited-lesson-steps.json'),
  });
  if (loadIssues.length === 0) return result;
  return {
    ...result,
    ok: false,
    issues: [...loadIssues, ...result.issues],
    totals: { ...result.totals, files: result.totals.files + loadIssues.length, errors: result.totals.errors + loadIssues.length },
  };
}
