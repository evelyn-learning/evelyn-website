/**
 * The WRITTEN-items track of the offline practice job: questions that people
 * or agents wrote into local JSON files go through the job's own checks.
 * Entered through practice-extend.ts (`ingest`, `finalize`).
 *
 *   <out>/packs/NNN.json      one skill: its objectives and what they already have
 *   <out>/written/NNN.json    the items written for that skill
 *   <out>/checked/items.jsonl one record per item (append-only; the latest record of an id counts)
 *   <out>/checked/summary.json
 *   <out>/read/batch-XXX.json     items ready for a reader (never rewritten once it exists)
 *   <out>/read/disputed-XXX.json  items the blind solver did not confirm — a reader adjudicates
 *   <out>/read/batches-index.json
 *   <out>/read/*-grades.json      what the readers return                      [finalize]
 *   <out>/final/…                 rows for a later, separate seeding step       [finalize]
 *
 * Local files in, local files out. No database (the import below comes before
 * anything that loads app code) and nothing is seeded. The only provider this
 * file can call is DeepSeek: `loadDeepseekOnly` hands it a client set whose
 * Anthropic side throws, and there is no judge model — where the rules
 * cannot compare a solver's answer with the key, a reader decides.
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { buildSolverPrompt, type SolverView } from '../../src/lib/tutor/portal/key-verify-prompts';
import { BudgetExceeded, simpleHash, type KeyedQuestion } from './core';
import {
  assertLetterPointsAtCorrect,
  coverageAfter,
  finalizeDecision,
  ingestFile,
  judgeSolverReply,
  planBatches,
  statusOf,
  type Defect,
  type IngestStatus,
  type IngestedItem,
  type Pack,
  type ReaderGrade,
  type SolverOutcomeKind,
  type SourceFormat,
} from './ingest-core';
import { callJson, loadDeepseekOnly, type Ledger, type Providers } from './models';
import type { Args, Dump, FigureTools } from './practice-extend';

// ── files ───────────────────────────────────────────────────────────────────

export interface SolverRecord {
  model: string;
  /** Hash of exactly what the solver was shown (question + options in display order). */
  viewHash: string;
  outcome: SolverOutcomeKind;
  method: string;
  reason: string;
  illPosed: boolean;
  illPosedReason: string;
  assumptions: string;
  chosenOption: string;
  answer: string;
  working: string;
  justification: string;
  /** The reply could not be used (cut short, not JSON): counted as undecided. */
  error?: string;
  at: string;
}

export interface ItemRecord {
  id: string;
  pack: string;
  index: number;
  sourceFormat: SourceFormat;
  skillLoId: string;
  subject: string;
  skill: string;
  grade: string;
  objectiveLoId: string;
  objective: string;
  responseFormat: string;
  problemText: string;
  /** Display order (multiple choice), otherwise empty. */
  choices: string[];
  /** Multiple choice: the letter. Otherwise the key. */
  answer: string;
  /** The key in words: for multiple choice the correct option's text. */
  correctText: string;
  hints: string[];
  solutionText: string;
  difficulty: number;
  taskType: string;
  covers: string;
  verified: string;
  rules: { ok: boolean; defects: Defect[] };
  solver?: SolverRecord;
  /** The rules could not compare the solver's answer with the key. */
  needsReaderDecision: boolean;
  status: IngestStatus;
  /** The item is no longer in its written file. */
  superseded?: boolean;
  at: string;
}

interface BatchEntry {
  id: string;
  subject: string;
  skill: string;
  objective: string;
  existingQuestionsOnThisObjective: string[];
  format: string;
  question: string;
  choices: string[] | null;
  key: string;
  hints: string[];
  solution: string;
  note?: string;
}

const DISPUTED_NOTE = 'an independent solver did not reach this key';
const now = (): string => new Date().toISOString();
const packNo = (file: string): string => path.basename(file, '.json');

/** Is this batch entry the item as it is stored now? A written file can be
 *  edited after a batch went out; the batch file itself is never rewritten. */
function entryMatches(e: BatchEntry, r: ItemRecord): boolean {
  return (
    e.question === r.problemText && e.key === r.answer && e.solution === r.solutionText &&
    JSON.stringify(e.choices ?? []) === JSON.stringify(r.responseFormat === 'mcq' ? r.choices : []) && JSON.stringify(e.hints) === JSON.stringify(r.hints)
  );
}

/** Has the written item changed since it was stored (same objective and
 *  question text, so the same id, but other options, key, hints or solution)? */
function writtenChanged(r: ItemRecord, it: IngestedItem): boolean {
  return (
    r.responseFormat !== it.responseFormat || r.correctText !== it.correctText || r.solutionText !== it.solutionText ||
    JSON.stringify(r.hints) !== JSON.stringify(it.hints) || [...r.choices].sort().join('\u0000') !== [...it.choices].sort().join('\u0000')
  );
}

function latestRecords(file: string, t: FigureTools): Map<string, ItemRecord> {
  const m = new Map<string, ItemRecord>();
  for (const r of t.readJsonl<ItemRecord>(file)) m.set(r.id, r);
  return m;
}

function readPack(dir: string, no: string, t: FigureTools): Pack | null {
  const f = path.join(dir, 'packs', `${no}.json`);
  return fs.existsSync(f) ? t.readJson<Pack>(f) : null;
}

/** Batch files of one kind, in order, with their entries. */
function batchFiles(readDir: string, kind: 'batch' | 'disputed', t: FigureTools): Array<{ name: string; n: number; entries: BatchEntry[] }> {
  if (!fs.existsSync(readDir)) return [];
  const re = new RegExp(`^${kind}-(\\d{3,})\\.json$`);
  return fs
    .readdirSync(readDir)
    .map((name) => ({ name, m: name.match(re) }))
    .filter((x) => x.m)
    .map((x) => ({ name: x.name, n: Number(x.m![1]), entries: t.readJson<BatchEntry[]>(path.join(readDir, x.name)) }))
    .sort((a, b) => a.n - b.n);
}

// ── stage: ingest ───────────────────────────────────────────────────────────

function recordOf(no: string, pack: Pack, it: IngestedItem, solver: SolverRecord | undefined): ItemRecord | null {
  const status = statusOf(it.defects, solver?.outcome);
  if (!status) return null;
  const rec: ItemRecord = {
    id: it.id, pack: no, index: it.index, sourceFormat: it.sourceFormat,
    skillLoId: pack.skillLoId, subject: pack.subject, skill: pack.skill, grade: pack.grade ?? '',
    objectiveLoId: it.objectiveLoId, objective: pack.objectives.find((o) => o.objectiveLoId === it.objectiveLoId)?.description ?? '',
    responseFormat: it.responseFormat, problemText: it.problemText, choices: it.choices, answer: it.answer, correctText: it.correctText,
    hints: it.hints, solutionText: it.solutionText, difficulty: it.difficulty, taskType: it.taskType, covers: it.covers, verified: it.verified,
    rules: { ok: it.defects.length === 0, defects: it.defects },
    ...(solver ? { solver } : {}),
    needsReaderDecision: status === 'ready_for_read' && solver?.outcome === 'undecided',
    status,
    at: now(),
  };
  if (rec.rules.ok) assertLetterPointsAtCorrect(rec);
  return rec;
}

const questionOf = (it: IngestedItem): KeyedQuestion => ({ format: it.responseFormat, question: it.problemText, key: it.answer, choices: it.choices });

/** What the solver is shown: the question and, for multiple choice, the
 *  options in display order. `SolverView` has no field for a key, a hint or
 *  a solution. */
function solverPromptOf(it: IngestedItem) {
  const view: SolverView = { format: it.responseFormat, question: it.problemText, options: it.choices.map((text, i) => ({ letter: 'ABCD'[i], text })) };
  const prompt = buildSolverPrompt(view);
  return { prompt, viewHash: simpleHash(`${prompt.system}\u0000${prompt.user}`) };
}

async function solveOnce(p: Providers, ledger: Ledger, it: IngestedItem): Promise<SolverRecord> {
  const { prompt, viewHash } = solverPromptOf(it);
  const str = (v: unknown) => (v == null ? '' : String(v)).trim();
  const empty = { model: p.models.deepseek, viewHash, illPosed: false, illPosedReason: '', assumptions: '', chosenOption: '', answer: '', working: '', justification: '' };
  let r: Record<string, unknown>;
  try {
    r = await callJson(p, ledger, {
      provider: 'deepseek', model: p.models.deepseek, system: prompt.system, user: prompt.user, schema: prompt.schema,
      maxTokens: 4000, stage: 'ingest', purpose: 'solve-deepseek', ref: it.id,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    // A reply that was cut short or was not JSON is a result of its own: no
    // verdict from the solver, so a reader decides. Anything else (the
    // budget, the network) leaves the item for the next run.
    if (e instanceof BudgetExceeded || !/not a JSON object|truncated at max_tokens/.test(message)) throw e;
    return { ...empty, outcome: 'undecided', method: 'none', reason: 'the solver gave no usable reply', error: message.slice(0, 200), at: now() };
  }
  const reply = {
    illPosed: r.ill_posed === true || r.ill_posed === 'true',
    illPosedReason: str(r.ill_posed_reason),
    assumptions: str(r.assumptions).replace(/^(?:none|n\/a|no(?:ne)?\s+(?:needed|required|made)|no\s+assumptions?(?:\s+\w+)*)\.?$/i, ''),
    chosenOption: str(r.chosen_option),
    answer: str(r.final_answer),
  };
  const j = judgeSolverReply(questionOf(it), it.correctText, reply);
  return { ...empty, ...reply, working: str(r.working), justification: str(r.justification), outcome: j.outcome, method: j.method, reason: j.reason, at: now() };
}

async function stageIngest(a: Args, t: FigureTools): Promise<void> {
  const dir = a.out;
  const writtenDir = path.join(dir, 'written');
  const checkedDir = path.join(dir, 'checked');
  const itemsFile = path.join(checkedDir, 'items.jsonl');
  if (!fs.existsSync(writtenDir)) throw new Error(`${writtenDir} does not exist`);
  fs.mkdirSync(checkedDir, { recursive: true });

  const stored = latestRecords(itemsFile, t);
  const files = fs.readdirSync(writtenDir).filter((f) => /^\d{3}\.json$/.test(f)).sort();
  const skippedFiles: Array<{ file: string; reason: string }> = [];
  const todo: Array<{ no: string; pack: Pack; it: IngestedItem }> = [];
  /** Packs with an item that still waits for its solve: not batched yet. */
  const waiting = new Map<string, number>();
  let seenItems = 0;
  let newRejected = 0;
  let reused = 0;
  let withdrawn = 0;
  let edited = 0;
  let filesWithNew = 0;

  for (const f of files) {
    const no = packNo(f);
    let written: { skillLoId?: unknown; items?: unknown };
    try {
      written = t.readJson<{ skillLoId?: unknown; items?: unknown }>(path.join(writtenDir, f));
    } catch (e) {
      skippedFiles.push({ file: f, reason: `not readable as JSON (${(e instanceof Error ? e.message : String(e)).slice(0, 80)})` });
      continue;
    }
    const pack = readPack(dir, no, t);
    if (!pack) { skippedFiles.push({ file: f, reason: 'no pack with this number' }); continue; }
    if (written.skillLoId !== pack.skillLoId) { skippedFiles.push({ file: f, reason: 'skillLoId is not the pack’s' }); continue; }
    if (!Array.isArray(written.items)) { skippedFiles.push({ file: f, reason: 'no items array' }); continue; }

    const mine = [...stored.values()].filter((r) => r.pack === no && !r.superseded);
    // Stored multiple-choice items keep their display order (a reader may
    // already hold it) and count towards the spread of letters.
    const prior = new Map(mine.filter((r) => r.responseFormat === 'mcq' && r.rules.ok).map((r) => [r.id, { answer: r.answer, choices: r.choices }]));
    const results = ingestFile(pack, written.items, prior);
    seenItems += results.length;
    const ids = new Set(results.map((r) => r.id));
    for (const r of mine) {
      if (ids.has(r.id)) continue;
      const gone: ItemRecord = { ...r, superseded: true, at: now() };
      t.appendJsonl(itemsFile, gone);
      stored.set(r.id, gone);
      withdrawn++;
    }
    let fresh = 0;
    for (const it of results) {
      const have = stored.get(it.id);
      if (have && !have.superseded && !a.force && !writtenChanged(have, it)) continue;
      if (have && !have.superseded && writtenChanged(have, it)) edited++;
      fresh++;
      if (it.defects.length > 0) {
        const rec = recordOf(no, pack, it, undefined)!;
        t.appendJsonl(itemsFile, rec);
        stored.set(rec.id, rec);
        newRejected++;
        continue;
      }
      // A stored solve is still valid when the solver would be shown exactly the same thing.
      if (have?.solver && !have.solver.error && have.solver.viewHash === solverPromptOf(it).viewHash) {
        const j = judgeSolverReply(questionOf(it), it.correctText, have.solver);
        const rec = recordOf(no, pack, it, { ...have.solver, outcome: j.outcome, method: j.method, reason: j.reason })!;
        t.appendJsonl(itemsFile, rec);
        stored.set(rec.id, rec);
        reused++;
        continue;
      }
      todo.push({ no, pack, it });
      waiting.set(no, (waiting.get(no) ?? 0) + 1);
    }
    if (fresh > 0) filesWithNew++;
  }

  const solveNow = a.limit !== undefined ? todo.slice(0, a.limit) : todo;
  console.log(`ingest: ${files.length} written file(s), ${seenItems} item(s) · ${filesWithNew} file(s) with new items · ${newRejected} new item(s) rejected by rule · ${reused} stored solve(s) reused · ${solveNow.length} to solve${todo.length > solveNow.length ? ` (${todo.length - solveNow.length} left for a later run: --limit)` : ''}${withdrawn ? ` · ${withdrawn} stored item(s) no longer in their file` : ''}${edited ? ` · ${edited} stored item(s) edited in their file since (checked again)` : ''}`);
  for (const s of skippedFiles) console.error(`  SKIPPED  ${s.file}: ${s.reason}`);

  let failed = 0;
  if (solveNow.length > 0) {
    const providers = loadDeepseekOnly();
    const ledger = t.openLedger(a);
    let n = 0;
    const { budgetStop } = await t.pool(solveNow, a.concurrency, async (w) => {
      let solver: SolverRecord;
      try {
        solver = await solveOnce(providers, ledger, w.it);
      } catch (e) {
        if (e instanceof BudgetExceeded) throw e;
        failed++;
        console.error(`  FAILED   ${w.it.id}  ${(e instanceof Error ? e.message : String(e)).slice(0, 140)}`);
        return;
      }
      const rec = recordOf(w.no, w.pack, w.it, solver)!;
      t.appendJsonl(itemsFile, rec);
      stored.set(rec.id, rec);
      waiting.set(w.no, (waiting.get(w.no) ?? 1) - 1);
      if (++n % 25 === 0 || n === solveNow.length) console.log(`  ${n}/${solveNow.length} · ledger $${ledger.budget.spentUsd.toFixed(4)}`);
    });
    if (failed > 0) console.error(`ingest: ${failed} solve(s) failed and were left for a re-run`);
    t.finish('ingest', ledger, budgetStop);
  }

  const held = new Set([...waiting.entries()].filter(([, n]) => n > 0).map(([no]) => no));
  const written = writeBatches(dir, stored, held, t);
  writeIngestSummary(a, dir, stored, { files: files.length, skippedFiles, heldBackPacks: [...held].sort(), newBatches: written }, t);
}

/** New batch files for items no batch holds yet. Existing files are never
 *  touched; the index is rebuilt from the files. */
function writeBatches(dir: string, stored: Map<string, ItemRecord>, held: Set<string>, t: FigureTools): string[] {
  const readDir = path.join(dir, 'read');
  fs.mkdirSync(readDir, { recursive: true });
  const created: string[] = [];
  const packs = new Map<string, Pack | null>();
  const existingOf = (r: ItemRecord): string[] => {
    if (!packs.has(r.pack)) packs.set(r.pack, readPack(dir, r.pack, t));
    return (packs.get(r.pack)?.objectives.find((o) => o.objectiveLoId === r.objectiveLoId)?.existingItems ?? []).map((e) => e.question);
  };
  for (const kind of ['batch', 'disputed'] as const) {
    const have = batchFiles(readDir, kind, t);
    // An item counts as issued only while a batch holds it AS IT IS NOW; one that
    // was edited in its written file since goes out again, in a new batch.
    const inBatch = new Set(have.flatMap((b) => b.entries.filter((e) => stored.has(e.id) && entryMatches(e, stored.get(e.id)!)).map((e) => e.id)));
    const wanted = [...stored.values()]
      .filter((r) => !r.superseded && !held.has(r.pack) && !inBatch.has(r.id))
      .filter((r) => (kind === 'batch' ? r.status === 'ready_for_read' : r.status === 'solver_disagrees' || r.status === 'solver_ill_posed'))
      .sort((x, y) => x.pack.localeCompare(y.pack) || x.index - y.index);
    let n = have.reduce((m, b) => Math.max(m, b.n), 0);
    for (const b of planBatches(wanted)) {
      const entries: BatchEntry[] = b.items.map((r) => {
        assertLetterPointsAtCorrect(r);
        // No solver result in here: the readers solve blind.
        return {
          id: r.id, subject: r.subject, skill: r.skill, objective: r.objective, existingQuestionsOnThisObjective: existingOf(r),
          format: r.responseFormat, question: r.problemText, choices: r.responseFormat === 'mcq' ? r.choices : null, key: r.answer,
          hints: r.hints, solution: r.solutionText, ...(kind === 'disputed' ? { note: DISPUTED_NOTE } : {}),
        };
      });
      const name = `${kind}-${String(++n).padStart(3, '0')}.json`;
      fs.writeFileSync(path.join(readDir, name), JSON.stringify(entries, null, 1), { flag: 'wx' }); // wx: fails rather than overwrite
      created.push(name);
    }
  }
  const index = (['batch', 'disputed'] as const).flatMap((kind) =>
    batchFiles(readDir, kind, t).map((b) => ({
      batch: b.name,
      kind: kind === 'batch' ? 'read' : 'disputed',
      subject: [...new Set(b.entries.map((e) => e.subject))].join(', '),
      items: b.entries.length,
      // entries whose item was edited or withdrawn in its written file after the batch went out
      outOfDate: b.entries.filter((e) => !stored.has(e.id) || stored.get(e.id)!.superseded || !entryMatches(e, stored.get(e.id)!)).length,
      packs: [...new Set(b.entries.map((e) => stored.get(e.id)?.pack ?? '?'))].sort(),
      gradesFile: b.name.replace(/\.json$/, '-grades.json'),
      graded: fs.existsSync(path.join(readDir, b.name.replace(/\.json$/, '-grades.json'))),
    })),
  );
  fs.writeFileSync(path.join(readDir, 'batches-index.json'), JSON.stringify(index, null, 1));
  return created;
}

function writeIngestSummary(a: Args, dir: string, stored: Map<string, ItemRecord>, run: { files: number; skippedFiles: Array<{ file: string; reason: string }>; heldBackPacks: string[]; newBatches: string[] }, t: FigureTools): void {
  const recs = [...stored.values()].filter((r) => !r.superseded);
  const solved = recs.filter((r) => r.solver);
  const bySubject: Record<string, Record<string, number>> = {};
  for (const r of recs) {
    const row = (bySubject[r.subject] ??= { items: 0 });
    row.items++;
    row[r.status] = (row[r.status] ?? 0) + 1;
  }
  const ledgerFile = a.ledger ?? path.join(dir, 'ledger.jsonl');
  const ledger = t.ledgerTotals(ledgerFile, ['ingest']);
  const perSolve = ledger.calls > 0 ? ledger.totalUsd / ledger.calls : 0;
  const index = fs.existsSync(path.join(dir, 'read', 'batches-index.json')) ? t.readJson<Array<{ batch: string; kind: string; subject: string; items: number }>>(path.join(dir, 'read', 'batches-index.json')) : [];
  const summary = {
    at: now(),
    writtenFiles: run.files,
    skippedFiles: run.skippedFiles,
    packsStored: new Set(recs.map((r) => r.pack)).size,
    items: recs.length,
    bySourceFormat: t.countBy(recs, (r) => r.sourceFormat),
    byFormat: t.countBy(recs, (r) => r.responseFormat),
    byStatus: t.countBy(recs, (r) => r.status),
    bySubject: Object.fromEntries(Object.entries(bySubject).sort()),
    // items per rule (an item that breaks one rule several times counts once)
    ruleRejectionsByRule: t.countBy(recs.flatMap((r) => [...new Set(r.rules.defects.map((d) => d.rule))]), (rule) => rule),
    solver: {
      solved: solved.length,
      byOutcome: t.countBy(solved, (r) => r.solver!.outcome),
      byOutcomeAndFormat: t.countBy(solved, (r) => `${r.solver!.outcome}:${r.responseFormat}`),
      notedAnAssumption: solved.filter((r) => r.solver!.assumptions !== '').length,
      unusableReplies: solved.filter((r) => r.solver!.error).length,
    },
    needsReaderDecision: recs.filter((r) => r.needsReaderDecision).length,
    correctLetterSpread: t.countBy(recs.filter((r) => r.responseFormat === 'mcq' && r.rules.ok), (r) => r.answer),
    withdrawnFromTheirFile: [...stored.values()].filter((r) => r.superseded).length,
    heldBackPacks: run.heldBackPacks,
    batches: index,
    newBatchesThisRun: run.newBatches,
    ledger: { file: ledgerFile, ingestUsd: ledger.totalUsd, calls: ledger.calls, usdPerCall: Math.round(perSolve * 1e6) / 1e6, wholeLedgerUsd: t.ledgerTotals(ledgerFile).totalUsd, byProvider: t.ledgerTotals(ledgerFile).byProvider },
  };
  fs.writeFileSync(path.join(dir, 'checked', 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ items: summary.items, bySourceFormat: summary.bySourceFormat, byStatus: summary.byStatus, ruleRejectionsByRule: summary.ruleRejectionsByRule, solver: summary.solver.byOutcome, needsReaderDecision: summary.needsReaderDecision, heldBackPacks: summary.heldBackPacks, newBatches: run.newBatches, ledger: { ingestUsd: summary.ledger.ingestUsd, calls: summary.ledger.calls, usdPerCall: summary.ledger.usdPerCall } }, null, 1));
}

// ── stage: finalize ─────────────────────────────────────────────────────────

function stageFinalize(a: Args, t: FigureTools): void {
  const dir = a.out;
  const readDir = path.join(dir, 'read');
  const dump = t.readJson<Dump>(t.need(a.dump, '--dump'));
  const plans = new Map(dump.plans.map((p) => [p._id, p]));
  const bankIds = new Set(dump.bank.map((b) => b.id));
  const stored = latestRecords(path.join(dir, 'checked', 'items.jsonl'), t);

  // What each reader was actually shown, by batch file.
  const shown = new Map<string, Array<{ batch: string; entry: BatchEntry }>>();
  for (const kind of ['batch', 'disputed'] as const) {
    for (const b of batchFiles(readDir, kind, t)) for (const e of b.entries) shown.set(e.id, [...(shown.get(e.id) ?? []), { batch: b.name, entry: e }]);
  }
  // Grades, by item. A grade counts only when the reader was shown the item
  // as it is stored now: the entry of the batch the grades file belongs to
  // (batch-007-grades.json → batch-007.json) — or, for a grades file of another
  // name, the item's one and only batch entry — has to match the stored item.
  const grades = new Map<string, Array<ReaderGrade & { file: string; at: string }>>();
  const ignored: Array<{ file: string; id: string; reason: string }> = [];
  const gradeFiles = fs.existsSync(readDir) ? fs.readdirSync(readDir).filter((f) => /-grades\.json$/.test(f)).sort() : [];
  const unmatched: Array<{ file: string; id: string }> = [];
  for (const f of gradeFiles) {
    const full = path.join(readDir, f);
    const list = t.readJson<unknown>(full);
    if (!Array.isArray(list)) throw new Error(`${f} is not an array of grades`);
    const at = fs.statSync(full).mtime.toISOString();
    for (const g of list as ReaderGrade[]) {
      const id = String(g?.id ?? '');
      if (!stored.has(id)) { unmatched.push({ file: f, id }); continue; }
      const entries = shown.get(id) ?? [];
      const own = entries.find((x) => x.batch === f.replace(/-grades\.json$/, '.json'));
      const entry = own ?? (entries.length === 1 ? entries[0] : undefined);
      if (!entry) { ignored.push({ file: f, id, reason: entries.length === 0 ? 'the item is in no batch' : 'the item is in several batches and the grades file names none of them' }); continue; }
      if (!entryMatches(entry.entry, stored.get(id)!)) { ignored.push({ file: f, id, reason: `the item was edited after ${entry.batch} went out — the grade is for the older version` }); continue; }
      grades.set(id, [...(grades.get(id) ?? []), { ...g, id, file: f, at }]);
    }
  }
  const rows: Array<Record<string, unknown>> = [];
  const dropped: Array<Record<string, unknown>> = [];
  const rewrite: Array<Record<string, unknown>> = [];
  const awaiting: Array<{ id: string; pack: string; status: string }> = [];
  const basisCount: Record<string, number> = {};
  for (const r of stored.values()) {
    const mine = grades.get(r.id) ?? [];
    const d0 = finalizeDecision({ status: r.status, solverOutcome: r.solver?.outcome, format: r.responseFormat, choices: r.choices, key: r.answer, question: r.problemText, superseded: r.superseded }, mine);
    const d: typeof d0 = d0.action === 'export' && bankIds.has(r.id) ? { action: 'drop', reason: 'id_already_in_bank' } : d0;
    const about = { id: r.id, pack: r.pack, subject: r.subject, skill: r.skill, objectiveLoId: r.objectiveLoId, status: r.status, solver: r.solver?.outcome ?? null };
    const reader = mine.map((g) => ({ file: g.file, blindAnswer: g.blindAnswer ?? '', agreesWithKey: g.agreesWithKey ?? null, grade: g.grade ?? '', reason: g.reason ?? '', ...(g.correctedKey ? { correctedKey: g.correctedKey } : {}) }));
    if (d.action === 'rewrite') {
      rewrite.push({ ...about, question: r.problemText, choices: r.choices, key: r.answer, keyText: r.correctText, reader });
      continue;
    }
    if (d.action === 'drop') {
      if (d.reason === 'no_reader_grade') awaiting.push({ id: r.id, pack: r.pack, status: r.status });
      else dropped.push({ ...about, reason: d.reason, ...(r.rules.ok ? {} : { rules: r.rules.defects.map((x) => x.rule) }), reader });
      continue;
    }
    assertLetterPointsAtCorrect(r);
    basisCount[d.basis] = (basisCount[d.basis] ?? 0) + 1;
    const plan = plans.get(r.objectiveLoId.replace(/\.lo-\d+$/, ''));
    const lo = plan?.los.find((l) => l.id === r.objectiveLoId);
    const model = r.solver?.model ?? 'deepseek';
    rows.push({
      id: r.id,
      topic: plan?.topic ?? r.skill,
      topicId: plan?.topic ?? r.skill,
      loId: r.objectiveLoId,
      subtopic: lo?.shortTitle ?? '',
      difficulty: r.difficulty,
      problemText: r.problemText,
      answer: r.answer,
      solutionText: r.solutionText,
      hints: r.hints,
      responseFormat: r.responseFormat,
      choices: r.responseFormat === 'mcq' ? r.choices : [],
      source: { name: `Evelyn (${t.JOB_NAME})` },
      license: 'internal-original',
      verifiedAt: mine.map((g) => g.at).sort().pop(),
      verifierModel:
        d.basis === 'solver_and_reader'
          ? `${model} (blind solve) + reader`
          : d.basis === 'reader_decided'
            ? `${model} (blind solve; answer compared by the reader) + reader`
            : `reader (blind answer matches the key; ${model} blind solve did not reach it)`,
    });
  }

  const out = path.join(dir, 'final');
  fs.mkdirSync(out, { recursive: true });
  const write = (name: string, v: unknown) => fs.writeFileSync(path.join(out, name), JSON.stringify(v, null, 2));
  write('problem-bank-rows.json', rows);
  write('audited-item-ids.json', rows.map((r) => r.id));
  write('dropped.json', { total: dropped.length, byReason: t.countBy(dropped, (x) => String(x.reason)), items: dropped, awaitingAReaderGrade: { total: awaiting.length, byStatus: t.countBy(awaiting, (x) => x.status), ids: awaiting.map((x) => x.id) }, gradesForUnknownIds: unmatched, gradesNotCounted: ignored });
  write('rewrite-list.json', rewrite);
  const exportedByObjective = new Map<string, number>();
  for (const r of rows) exportedByObjective.set(String(r.loId), (exportedByObjective.get(String(r.loId)) ?? 0) + 1);
  const packs = fs.readdirSync(path.join(dir, 'packs')).filter((f) => /^\d{3}\.json$/.test(f)).sort().map((f) => ({ pack: packNo(f), ...t.readJson<Pack>(path.join(dir, 'packs', f)) }));
  const coverage = coverageAfter(packs, exportedByObjective);
  write('coverage-after.json', coverage);
  const summary = {
    at: now(), gradeFiles, itemsChecked: stored.size, graded: grades.size, exported: rows.length, exportedOn: basisCount,
    exportedBySubject: t.countBy(rows, (r) => String(stored.get(String(r.id))!.subject)),
    forRewrite: rewrite.length, dropped: dropped.length, droppedByReason: t.countBy(dropped, (x) => String(x.reason)),
    awaitingAReaderGrade: awaiting.length, gradesForUnknownIds: unmatched.length, gradesNotCounted: ignored.length,
    coverage: { target: coverage.target, all: coverage.all, textOnly: coverage.textOnly },
  };
  write('finalize-summary.json', summary);
  console.log(JSON.stringify(summary, null, 1));
  console.log(`finalize: ${rows.length} row(s) → ${out} (nothing was seeded)`);
}

export async function runIngestStage(a: Args, t: FigureTools): Promise<void> {
  if (a.stage === 'ingest') return stageIngest(a, t);
  if (a.stage === 'finalize') return stageFinalize(a, t);
  throw new Error(`unknown stage "${a.stage}"`);
}
