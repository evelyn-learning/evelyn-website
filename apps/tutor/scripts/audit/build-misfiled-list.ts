/**
 * Regenerate src/data/misfiled-practice-items.json — the marks on older
 * practice items that are filed under one objective of a generated-course
 * skill but actually test another objective of the same skill
 * (src/lib/tutor/portal/misfiled-items.ts). A request for ONE objective skips
 * an item marked for a different one and gains the items marked for it; skill
 * practice still uses them all. Nothing is re-filed or deleted.
 *
 * Input: the REVIEWED csv — columns `id`, `filedUnder`, `shouldBe` (other
 * columns are ignored; quoted cells ok):
 *   id         the item id as served: a bank row id
 *              (`practice-gen.<planId>.lo-K.<hash>`) or a lesson step
 *              (`<planId>::<skillPlanId>.lo-K-try…`);
 *   filedUnder the objective the item is filed under — must be the one the id
 *              itself names (a cross-check on the input);
 *   shouldBe   the objective it actually tests, or the word `none` for an
 *              item that tests no objective of its skill (written as null).
 *
 * Refused: an id on the withdrawn list (already never served — withdrawn
 * wins, so the two lists never overlap); a target that is not another
 * objective of the SAME skill; a duplicate; a blank.
 *
 * Reads the input and the withdrawn list, writes one file. No database, no
 * network, no .env.
 *
 *   npx tsx scripts/audit/build-misfiled-list.ts <resolved-ids.csv> [--date YYYY-MM-DD] [--source "<label>"] [--out <file>] [--withdrawn <file>]
 *
 * --date defaults to today; --source defaults to "misfiled practice items <date>";
 * --withdrawn defaults to src/data/withdrawn-practice-items.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseCsv } from './build-withdrawn-list';

export interface MisfiledList {
  generatedAt: string;
  source: string;
  /** item id → the objective LO id it actually tests, or null (none of its skill's). */
  items: Record<string, string | null>;
}

export interface MisfiledRow {
  id: string;
  filedUnder: string;
  shouldBe: string;
}

const PLAN = 'gen-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const BANK_ID = new RegExp(`^practice-gen\\.(${PLAN}\\.lo-\\d+)\\.[^.]+$`);
const STEP_ID = new RegExp(`^${PLAN}::(${PLAN}\\.lo-\\d+)-[^:]+$`);
const OBJECTIVE = new RegExp(`^(${PLAN})\\.lo-\\d+$`);

/**
 * The objective an item is filed under, read off its id: a generated bank
 * row's id embeds its LO; a lesson step's segment id starts with it (for a
 * step of an expanded plan that is the skill plan's objective, not the plan
 * the segment is stored in). Null for any other id shape.
 */
export function filedObjectiveOfItemId(id: string): string | null {
  return BANK_ID.exec(id)?.[1] ?? STEP_ID.exec(id)?.[1] ?? null;
}

/** The rows of the reviewed csv, in file order (validation happens in the builder). */
export function readMisfiledRows(text: string, fileName: string): MisfiledRow[] {
  const rows = parseCsv(text);
  const header = rows[0] ?? [];
  const col = (name: string): number => {
    const i = header.indexOf(name);
    if (i < 0) throw new Error(`${fileName}: CSV needs a "${name}" column; got: ${header.join(', ')}`);
    return i;
  };
  const [idCol, filedCol, shouldCol] = [col('id'), col('filedUnder'), col('shouldBe')];
  return rows.slice(1).map((r) => ({
    id: (r[idCol] ?? '').trim(),
    filedUnder: (r[filedCol] ?? '').trim(),
    shouldBe: (r[shouldCol] ?? '').trim(),
  }));
}

export function buildMisfiledList(
  rows: readonly MisfiledRow[],
  generatedAt: string,
  source: string,
  withdrawn: ReadonlySet<string>,
): MisfiledList {
  const marks = new Map<string, string | null>();
  for (const [n, row] of rows.entries()) {
    const where = `entry ${n + 1}`;
    if (!row.id) throw new Error(`${where}: empty id`);
    if (marks.has(row.id)) throw new Error(`${where}: duplicate id ${row.id}`);
    if (withdrawn.has(row.id)) throw new Error(`${where}: ${row.id} is on the withdrawn list — it is already never served; remove it from the input`);
    const filed = filedObjectiveOfItemId(row.id);
    if (!filed) throw new Error(`${where}: no objective can be read from the id ${row.id} (expected a practice-gen row or a lesson step of a generated course plan)`);
    if (row.filedUnder !== filed) throw new Error(`${where}: filedUnder ${row.filedUnder || '(blank)'} is not the objective the id names (${filed})`);
    if (!row.shouldBe) throw new Error(`${where}: blank shouldBe for ${row.id} — give the objective it tests, or the word "none"`);
    if (row.shouldBe === 'none') {
      marks.set(row.id, null);
      continue;
    }
    const skill = (OBJECTIVE.exec(filed) as RegExpExecArray)[1];
    if (OBJECTIVE.exec(row.shouldBe)?.[1] !== skill) throw new Error(`${where}: target ${row.shouldBe} is not in the same skill as ${row.id} (${skill})`);
    if (row.shouldBe === filed) throw new Error(`${where}: target ${row.shouldBe} is the same as the objective it is filed under (${row.id})`);
    marks.set(row.id, row.shouldBe);
  }
  // Sorted so a regenerated file diffs cleanly.
  const sorted = [...marks.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return { generatedAt, source, items: Object.fromEntries(sorted.map((id) => [id, marks.get(id) as string | null])) };
}

function main(): void {
  const argv = process.argv.slice(2);
  const flag = (name: string): string | undefined => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const flagNames = new Set(['--date', '--source', '--out', '--withdrawn']);
  const positional = argv.filter((a, i) => !flagNames.has(a) && !flagNames.has(argv[i - 1] ?? ''));
  const inPath = positional[0];
  if (!inPath) {
    console.error('usage: npx tsx scripts/audit/build-misfiled-list.ts <resolved-ids.csv> [--date YYYY-MM-DD] [--source "<label>"] [--out <file>] [--withdrawn <file>]');
    process.exit(2);
  }
  const date = flag('--date') ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got ${date}`);
  const source = flag('--source') ?? `misfiled practice items ${date}`;
  const dataDir = path.join(__dirname, '..', '..', 'src', 'data');
  const out = flag('--out') ?? path.join(dataDir, 'misfiled-practice-items.json');
  const withdrawnPath = flag('--withdrawn') ?? path.join(dataDir, 'withdrawn-practice-items.json');
  const withdrawn = new Set(Object.keys((JSON.parse(fs.readFileSync(withdrawnPath, 'utf8')) as { items: Record<string, string> }).items));
  const list = buildMisfiledList(readMisfiledRows(fs.readFileSync(inPath, 'utf8'), inPath), date, source, withdrawn);
  fs.writeFileSync(out, JSON.stringify(list, null, 2) + '\n');
  const targets = Object.values(list.items);
  console.log(`wrote ${targets.length} misfiled marks to ${out} (${targets.filter((t) => t === null).length} marked as testing no objective of their skill)`);
  console.log(`  checked against ${withdrawn.size} withdrawn ids (${withdrawnPath}): no overlap`);
}

if (require.main === module) main();
