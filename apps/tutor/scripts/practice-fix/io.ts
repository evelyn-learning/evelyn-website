/**
 * Practice-item corrections — local file access only (no database, no
 * network). Shared by validate-fixes.ts, build-apply-script.ts, key-form.ts
 * and the simulation test.
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { validateFixFile, type BankRow, type FixFile, type ValidationResult } from './core';

/** The truth-read folder: export, batches, readers' grades, and the outputs. */
export const READ_DIR = process.env.PRACTICE_FIX_DIR
  ?? '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration/older-items-truth-read-2026-10-17';
export const ROWS_FILE = path.join(READ_DIR, 'older-bank-rows.json');
export const FIXES_FILE = path.join(READ_DIR, 'fixes.json');
export const WITHDRAW_FILE = path.join(READ_DIR, 'withdraw-ids.json');
export const TOOLING_DIR = path.join(READ_DIR, 'tooling');
export const DATA_FILE = 'practice-fixes.data.json';
export const scriptFile = (direction: 'apply' | 'revert'): string => `${direction}-practice-fixes.mongosh.js`;

const readJson = <T,>(file: string): T => JSON.parse(fs.readFileSync(file, 'utf8')) as T;

export interface BatchItem { id: string; subject: string; skill: string; objective: string; format: string }
export interface ReaderGrade { id: string; blindAnswer?: string; agreesWithKey?: boolean; verdict: string; category: string | null; reason: string; edit: unknown; confidence: string }

export function loadRows(): Map<string, BankRow> {
  return new Map(readJson<BankRow[]>(ROWS_FILE).map((r) => [r.id, r]));
}

function loadDir<T extends { id: string }>(dir: string): Map<string, T> {
  const out = new Map<string, T>();
  for (const f of fs.readdirSync(path.join(READ_DIR, dir)).filter((x) => /^batch-\d+\.json$/.test(x)).sort()) {
    for (const x of readJson<T[]>(path.join(READ_DIR, dir, f))) out.set(x.id, x);
  }
  return out;
}
/** The served rows as given to the readers (subject, skill, objective). */
export const loadBatches = (): Map<string, BatchItem> => loadDir<BatchItem>('batches');
export const loadGrades = (): Map<string, ReaderGrade> => loadDir<ReaderGrade>('grades');

export function loadFixFile(): FixFile {
  return readJson<FixFile>(FIXES_FILE);
}

export function loadWithdrawnIds(): Set<string> {
  if (!fs.existsSync(WITHDRAW_FILE)) return new Set();
  const w = readJson<{ ids?: string[] }>(WITHDRAW_FILE);
  return new Set(w.ids ?? []);
}

export interface Loaded {
  rows: Map<string, BankRow>;
  batches: Map<string, BatchItem>;
  file: FixFile;
  withdrawnIds: Set<string>;
  result: ValidationResult;
}

/** Load everything and run the structural + item-rule validation. */
export function validateAll(): Loaded {
  const rows = loadRows();
  const batches = loadBatches();
  const file = loadFixFile();
  const withdrawnIds = loadWithdrawnIds();
  const result = validateFixFile(file, { rows, servedIds: new Set(batches.keys()), withdrawnIds });
  return { rows, batches, file, withdrawnIds, result };
}
