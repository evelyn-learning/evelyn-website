/**
 * Regenerate src/data/audited-lesson-steps.json — the allow-list of lesson
 * practice steps (plan try-yourselves, item id `<planId>::<segmentId>`) of a
 * generated course plan whose answer key passed an audit
 * (src/lib/tutor/portal/audited-items.ts). A partner listed in
 * PRACTICE_GEN_AUDITED_ONLY_PARTNERS is served a generated course plan's step
 * as practice (portal/practice.ts — any objective, objective 1 included, on
 * every path) only when it is listed here.
 *
 * Input: a file of ids —
 *   .json  an array of objects carrying an "id" field (or of bare id strings),
 *   .jsonl one object per line carrying an "id" field, or
 *   .csv   with an "id" column (other columns are ignored; quoted cells ok).
 * `--tier <value>` keeps only the rows whose "tier" field equals <value>
 * (.json / .jsonl / a .csv "tier" column); without it every row is listed.
 * To take a step off the list, remove its row and re-run (or withdraw it: an
 * id on the withdrawn list is refused here, so the two lists never overlap).
 *
 * Every id must be `<gen-plan-id>::<gen-plan-id>.lo-K-…` with K ≥ 1; no
 * duplicates; none on the withdrawn list. The two plan ids are normally the
 * same. They differ for an "expanded" plan E that holds the lesson text for
 * the objectives of picker plan P: the engine emits `E::P.lo-K-try`, and
 * that is the id to list. Both sides must be `gen-` plan ids.
 *
 * Reads the input and the withdrawn list, writes one file. No database, no
 * network, no .env.
 *
 *   npx tsx scripts/audit/build-audited-lesson-steps.ts <ids.json|ids.jsonl|ids.csv> [--tier <value>] [--date YYYY-MM-DD] [--source "<label>"] [--out <file>] [--withdrawn <file>]
 *
 * --date defaults to today; --source defaults to "audited lesson steps <date>";
 * --withdrawn defaults to src/data/withdrawn-practice-items.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseCsv } from './build-withdrawn-list';

export interface AuditedLessonStepList {
  generatedAt: string;
  source: string;
  items: Record<string, 'AUDITED'>;
}

/** `<gen-plan-id>::<gen-plan-id>.lo-K-<suffix>`. Left: the plan that holds
 *  the segment. Right: the plan whose objective the segment belongs to — the
 *  same plan, or the picker plan an expanded plan was built for. */
const STEP_ID_RE = /^(gen-[A-Za-z0-9-]+)::(gen-[A-Za-z0-9-]+)\.lo-([1-9]\d*)-[A-Za-z0-9-]+$/;

/** The objective number K of a lesson-step id, or null when the id is not a
 *  generated-plan lesson step. */
export function lessonStepObjective(id: string): number | null {
  const m = STEP_ID_RE.exec(id);
  return m ? Number(m[3]) : null;
}

/** Is this the step of an expanded plan — held by one generated plan, on an
 *  objective of another (`E::P.lo-K-…`)? False for any other id. */
export function isExpandedPlanStep(id: string): boolean {
  const m = STEP_ID_RE.exec(id);
  return !!m && m[1] !== m[2];
}

/** The ids of an input file, in file order (validation happens in the
 *  builder). `tier` keeps only rows whose "tier" field equals it. */
export function readLessonStepIds(text: string, fileName: string, tier?: string): string[] {
  const fromRecord = (rec: unknown, where: string): string | null => {
    if (typeof rec === 'string') {
      if (tier !== undefined) throw new Error(`${where}: --tier needs objects with a "tier" field, got a bare id`);
      return rec.trim();
    }
    const r = rec as { id?: unknown; tier?: unknown } | null;
    if (typeof r?.id !== 'string') throw new Error(`${where}: no string "id" field`);
    if (tier !== undefined && r.tier !== tier) return null;
    return r.id.trim();
  };
  if (/\.jsonl$/i.test(fileName)) {
    return text.split(/\r?\n/).filter((l) => l.trim().length > 0).flatMap((line, n) => {
      let rec: unknown;
      try { rec = JSON.parse(line); } catch { throw new Error(`${fileName} line ${n + 1}: not JSON`); }
      const id = fromRecord(rec, `${fileName} line ${n + 1}`);
      return id === null ? [] : [id];
    });
  }
  if (/\.json$/i.test(fileName)) {
    let recs: unknown;
    try { recs = JSON.parse(text); } catch { throw new Error(`${fileName}: not JSON`); }
    if (!Array.isArray(recs)) throw new Error(`${fileName}: expected a JSON array`);
    return recs.flatMap((rec, n) => {
      const id = fromRecord(rec, `${fileName} entry ${n + 1}`);
      return id === null ? [] : [id];
    });
  }
  const rows = parseCsv(text);
  const header = rows[0] ?? [];
  const idCol = header.indexOf('id');
  if (idCol < 0) throw new Error(`${fileName}: CSV needs an "id" column; got: ${header.join(', ')}`);
  const tierCol = header.indexOf('tier');
  if (tier !== undefined && tierCol < 0) throw new Error(`${fileName}: --tier needs a "tier" column; got: ${header.join(', ')}`);
  return rows.slice(1).filter((r) => tier === undefined || (r[tierCol] ?? '').trim() === tier).map((r) => (r[idCol] ?? '').trim());
}

export function buildAuditedLessonStepList(
  ids: readonly string[],
  generatedAt: string,
  source: string,
  withdrawn: ReadonlySet<string>,
): AuditedLessonStepList {
  const seen = new Set<string>();
  for (const [n, id] of ids.entries()) {
    if (!id) throw new Error(`entry ${n + 1}: empty id`);
    const k = lessonStepObjective(id);
    if (k === null) throw new Error(`entry ${n + 1}: not a generated-plan lesson step id (<gen-plan-id>::<gen-plan-id>.lo-K-…): ${id}`);
    if (seen.has(id)) throw new Error(`entry ${n + 1}: duplicate id ${id}`);
    if (withdrawn.has(id)) throw new Error(`entry ${n + 1}: ${id} is on the withdrawn list — withdrawn wins; remove it from the input`);
    seen.add(id);
  }
  // Sorted so a regenerated file diffs cleanly.
  const sorted = [...seen].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return { generatedAt, source, items: Object.fromEntries(sorted.map((id) => [id, 'AUDITED' as const])) };
}

function main(): void {
  const argv = process.argv.slice(2);
  const flag = (name: string): string | undefined => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const flagNames = new Set(['--tier', '--date', '--source', '--out', '--withdrawn']);
  const positional = argv.filter((a, i) => !flagNames.has(a) && !flagNames.has(argv[i - 1] ?? ''));
  const inPath = positional[0];
  if (!inPath) {
    console.error('usage: npx tsx scripts/audit/build-audited-lesson-steps.ts <ids.json|ids.jsonl|ids.csv> [--tier <value>] [--date YYYY-MM-DD] [--source "<label>"] [--out <file>] [--withdrawn <file>]');
    process.exit(2);
  }
  const date = flag('--date') ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got ${date}`);
  const tier = flag('--tier');
  const source = flag('--source') ?? `audited lesson steps ${date}`;
  const dataDir = path.join(__dirname, '..', '..', 'src', 'data');
  const out = flag('--out') ?? path.join(dataDir, 'audited-lesson-steps.json');
  const withdrawnPath = flag('--withdrawn') ?? path.join(dataDir, 'withdrawn-practice-items.json');
  const withdrawn = new Set(Object.keys((JSON.parse(fs.readFileSync(withdrawnPath, 'utf8')) as { items: Record<string, string> }).items));
  const list = buildAuditedLessonStepList(readLessonStepIds(fs.readFileSync(inPath, 'utf8'), inPath, tier), date, source, withdrawn);
  fs.writeFileSync(out, JSON.stringify(list, null, 2) + '\n');
  console.log(`wrote ${Object.keys(list.items).length} audited lesson-step ids to ${out}${tier ? ` (tier=${tier})` : ''}`);
  const ids = Object.keys(list.items);
  console.log(`  objective-1 steps: ${ids.filter((id) => lessonStepObjective(id) === 1).length} · expanded-plan steps (E::P.lo-K-…): ${ids.filter(isExpandedPlanStep).length}`);
  console.log(`  checked against ${withdrawn.size} withdrawn ids (${withdrawnPath}): no overlap`);
}

if (require.main === module) main();
