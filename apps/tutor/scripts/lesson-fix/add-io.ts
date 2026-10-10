/**
 * "Add objectives" — local file access only (no database, no network).
 */
import '../lib/no-db-env';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { ApplyData, Lesson } from './core';
import { preStateOf, validateWritten, type AddIssue, type AddPack, type PracticeItemRef, type PreState, type WrittenFile } from './add-core';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
export const ADD_DIR = process.env.LESSON_ADD_DIR ?? path.join(INTEGRATION, 'lesson-add-2026-10-12');
export const PACK_DIR = path.join(ADD_DIR, 'packs');
/** Writers' output. */
export const WRITTEN_DIR = path.join(ADD_DIR, 'written');
/** Readers' verdicts, one per pack, naming the sha256 of the file read. */
export const READ_DIR = path.join(ADD_DIR, 'read');
/** The files after the read — the ONLY folder the apply build reads. */
export const FINAL_DIR = path.join(ADD_DIR, 'final');

export const DUMP_FILE = path.join(INTEGRATION, 'audited-list-2026-10-06/work/prod-dump.json');
export const CORRECTIONS_FILE = path.join(INTEGRATION, 'lesson-read-2026-10-10/tooling/lesson-corrections.data.json');
export const LESSONS_V2_DIR = path.join(INTEGRATION, 'lesson-read-2026-10-10/lessons-v2');
export const EXPANDED_INDEX = path.join(INTEGRATION, 'lesson-read-2026-10-10/expanded-45-index.json');
const PRACTICE_PACK_DIRS = [
  path.join(INTEGRATION, 'practice-depth-2026-10-10/packs'),
  path.join(INTEGRATION, 'practice-topup-2026-10-11/packs'),
];
const PRACTICE_ROW_FILES = [
  path.join(INTEGRATION, 'practice-depth-2026-10-10/final/problem-bank-rows.v2.json'),
  path.join(INTEGRATION, 'practice-topup-2026-10-11/final/problem-bank-rows.json'),
];

type Doc = Record<string, unknown>;

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

/** The 10-06 dump's plans by id. */
export function loadDumpPlans(): Map<string, Doc> {
  const dump = readJson<{ plans: Doc[] }>(DUMP_FILE);
  return new Map(dump.plans.map((p) => [p._id as string, p]));
}

/** Apply the committed corrections data to dumped documents IN MEMORY — the
 *  stored state after the 10-11 corrections. Every `old` must match. */
export function applyCorrections(docs: Map<string, Doc>, data: ApplyData = readJson<ApplyData>(CORRECTIONS_FILE)): Map<string, Doc> {
  const out = new Map<string, Doc>();
  for (const [id, d] of docs) out.set(id, JSON.parse(JSON.stringify(d)) as Doc);
  for (const plan of data.plans) {
    const doc = out.get(plan.planId);
    if (!doc) continue;
    for (const o of plan.objectives) {
      const lo = (doc.los as Array<{ id: string; description: string }>).find((l) => l.id === o.loId);
      if (!lo || lo.description !== o.old) throw new Error(`corrections: ${plan.planId} ${o.loId} description is not the expected old value`);
      lo.description = o.new;
    }
    for (const s of plan.segments) {
      const seg = (doc.segments as Doc[]).find((x) => x.id === s.segmentId);
      if (!seg) throw new Error(`corrections: ${plan.planId} has no segment ${s.segmentId}`);
      for (const c of s.changes) {
        if (c.index === null) {
          if (seg[c.field] !== c.old) throw new Error(`corrections: ${s.segmentId} ${c.field} is not the expected old value`);
          seg[c.field] = c.new;
        } else {
          const arr = seg[c.field] as string[];
          if (c.append) {
            if (arr.length !== c.index) throw new Error(`corrections: ${s.segmentId} ${c.field} length is not ${c.index}`);
            arr.push(c.new);
          } else {
            if (arr[c.index] !== c.old) throw new Error(`corrections: ${s.segmentId} ${c.field}[${c.index}] is not the expected old value`);
            arr[c.index] = c.new;
          }
        }
      }
    }
  }
  return out;
}

export interface ExpandedEntry {
  pack: string;
  pickerPack: string;
  subject: string;
}

export function loadExpandedIndex(): ExpandedEntry[] {
  return readJson<ExpandedEntry[]>(EXPANDED_INDEX);
}

export function loadLessonV2(pack: string): Lesson & { grade?: string } {
  return readJson<Lesson & { grade?: string }>(path.join(LESSONS_V2_DIR, `${pack}.json`));
}

/** Practice items already written for each objective id, from the two local
 *  practice runs (pack listings + the rows exported for import). */
export function loadPracticeItems(): { byLo: Map<string, PracticeItemRef[]>; figureDependent: Set<string> } {
  const byLo = new Map<string, PracticeItemRef[]>();
  const figureDependent = new Set<string>();
  const seen = new Set<string>();
  const push = (loId: string, item: PracticeItemRef): void => {
    const key = `${loId}\u0000${item.question.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()}`;
    if (seen.has(key)) return;
    seen.add(key);
    byLo.set(loId, [...(byLo.get(loId) ?? []), item]);
  };
  for (const dir of PRACTICE_PACK_DIRS) {
    const run = path.basename(path.dirname(dir));
    for (const name of fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f)).sort()) {
      const p = readJson<{ objectives: Array<{ objectiveLoId: string; figureDependent?: boolean; existingItems?: Array<{ question: string; answer: string; hasFigure?: boolean }> }> }>(path.join(dir, name));
      for (const o of p.objectives) {
        if (o.figureDependent) figureDependent.add(o.objectiveLoId);
        for (const it of o.existingItems ?? []) {
          push(o.objectiveLoId, { question: it.question, answer: it.answer, source: `${run}/packs/${name}${it.hasFigure ? ' (item has a figure)' : ''}` });
        }
      }
    }
  }
  for (const file of PRACTICE_ROW_FILES) {
    const rel = path.relative(INTEGRATION, file);
    for (const r of readJson<Array<{ loId: string; problemText: string; answer: string; responseFormat?: string; choices?: string[] | null }>>(file)) {
      const letter = /^[A-D]$/.test(r.answer) && Array.isArray(r.choices) ? r.choices[r.answer.charCodeAt(0) - 65] : undefined;
      push(r.loId, { question: r.problemText, answer: letter ?? r.answer, responseFormat: r.responseFormat, source: rel });
    }
  }
  return { byLo, figureDependent };
}

export function loadPacks(dir: string = PACK_DIR): Map<string, AddPack> {
  const out = new Map<string, AddPack>();
  for (const name of fs.readdirSync(dir).filter((f) => /^\d{3}\.json$/.test(f)).sort()) {
    const p = readJson<AddPack>(path.join(dir, name));
    out.set(p.pack, p);
  }
  return out;
}

/** Stored pre-state of the 45 plans: the dump with the corrections applied. */
export function loadPreStates(): Map<string, PreState> {
  const ids = new Set(loadExpandedIndex().map((e) => loadLessonV2(e.pack).planId));
  const patched = applyCorrections(new Map([...loadDumpPlans()].filter(([id]) => ids.has(id))));
  return new Map([...patched].map(([id, d]) => [id, preStateOf(d)]));
}

export interface ReadVerdict {
  pack: string;
  fileSha256: string;
  verdict: 'clean' | 'findings';
  findings?: unknown[];
}

export interface LoadedWritten {
  pack: string;
  fileName: string;
  sha256: string;
  issues: AddIssue[];
  file: WrittenFile | null;
}

/** Validate every pack's file in `dir`. A pack with no file is reported as
 *  `missing`, never skipped silently. */
export function validateDir(dir: string, packs: Map<string, AddPack> = loadPacks()): LoadedWritten[] {
  const out: LoadedWritten[] = [];
  for (const pack of packs.values()) {
    const fileName = `${pack.pack}.json`;
    const full = path.join(dir, fileName);
    if (!fs.existsSync(full)) {
      out.push({ pack: pack.pack, fileName, sha256: '', file: null, issues: [{ level: 'error', code: 'missing', pack: pack.pack, message: `no file ${full}` }] });
      continue;
    }
    const bytes = fs.readFileSync(full);
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    let raw: unknown;
    try {
      raw = JSON.parse(bytes.toString('utf8'));
    } catch (err) {
      out.push({ pack: pack.pack, fileName, sha256, file: null, issues: [{ level: 'error', code: 'file_parse', pack: pack.pack, message: `does not parse: ${(err as Error).message}` }] });
      continue;
    }
    out.push({ pack: pack.pack, fileName, sha256, ...validateWritten(raw, pack) });
  }
  if (fs.existsSync(dir)) {
    for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const pack = name.replace(/\.json$/, '');
      if (!packs.has(pack)) out.push({ pack, fileName: name, sha256: '', file: null, issues: [{ level: 'error', code: 'unknown_pack', pack, message: `${name} is not one of the ${packs.size} packs` }] });
    }
  }
  return out;
}

/** The reader's verdict for a pack, or the reason there is none that counts. */
export function readVerdictProblem(pack: string, sha256: string, dir: string = READ_DIR): string | null {
  const full = path.join(dir, `${pack}.json`);
  if (!fs.existsSync(full)) return `no reader verdict ${full}`;
  let v: ReadVerdict;
  try {
    v = readJson<ReadVerdict>(full);
  } catch (err) {
    return `reader verdict does not parse: ${(err as Error).message}`;
  }
  if (v.pack !== pack) return `reader verdict names pack ${JSON.stringify(v.pack)}`;
  if (v.fileSha256 !== sha256) return 'the reader read a different version of this file (sha256 differs) — it must be read again';
  if (v.verdict !== 'clean') return `reader verdict is ${JSON.stringify(v.verdict)}, not "clean"`;
  if (Array.isArray(v.findings) && v.findings.length > 0) return 'reader verdict is "clean" but lists findings';
  return null;
}
