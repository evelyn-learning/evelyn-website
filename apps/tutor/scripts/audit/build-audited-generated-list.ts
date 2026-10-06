/**
 * Regenerate src/data/audited-generated-items.json — the allow-list of stored
 * generated practice items (`practice-gen.*` bank rows) that passed an
 * answer-key audit (src/lib/tutor/portal/audited-items.ts). A partner listed
 * in PRACTICE_GEN_AUDITED_ONLY_PARTNERS is served only these generated items.
 *
 * Input: a file of ids —
 *   .csv   with an "id" column (other columns are ignored; quoted cells ok), or
 *   .jsonl with one object per line carrying an "id" field.
 * Every id in the file is listed. To take an item off the list, remove its
 * row and re-run (or withdraw it: an id on the withdrawn list is refused
 * here, so the two lists can never overlap).
 *
 * Reads the input and the withdrawn list, writes one file. No database, no
 * network, no .env.
 *
 *   npx tsx scripts/audit/build-audited-generated-list.ts <ids.csv|ids.jsonl> [--date YYYY-MM-DD] [--source "<label>"] [--out <file>] [--withdrawn <file>]
 *
 * --date defaults to today; --source defaults to "audited generated items <date>";
 * --withdrawn defaults to src/data/withdrawn-practice-items.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseCsv } from './build-withdrawn-list';

export interface AuditedGeneratedList {
  generatedAt: string;
  source: string;
  items: Record<string, 'AUDITED'>;
}

/** The ids of an input file, in file order (validation happens in the builder). */
export function readAuditedIds(text: string, fileName: string): string[] {
  if (/\.jsonl$/i.test(fileName)) {
    return text.split(/\r?\n/).filter((l) => l.trim().length > 0).map((line, n) => {
      let rec: unknown;
      try { rec = JSON.parse(line); } catch { throw new Error(`${fileName} line ${n + 1}: not JSON`); }
      const id = (rec as { id?: unknown } | null)?.id;
      if (typeof id !== 'string') throw new Error(`${fileName} line ${n + 1}: no string "id" field`);
      return id.trim();
    });
  }
  const rows = parseCsv(text);
  const header = rows[0] ?? [];
  const idCol = header.indexOf('id');
  if (idCol < 0) throw new Error(`${fileName}: CSV needs an "id" column; got: ${header.join(', ')}`);
  return rows.slice(1).map((r) => (r[idCol] ?? '').trim());
}

export function buildAuditedGeneratedList(
  ids: readonly string[],
  generatedAt: string,
  source: string,
  withdrawn: ReadonlySet<string>,
): AuditedGeneratedList {
  const seen = new Set<string>();
  for (const [n, id] of ids.entries()) {
    if (!id) throw new Error(`entry ${n + 1}: empty id`);
    // Same predicate as the engine (portal/essay-practice.ts `isGeneratedPracticeItemId`);
    // repeated so this script stays free of the app's import graph.
    if (!id.startsWith('practice-gen.')) throw new Error(`entry ${n + 1}: not a generated practice item id: ${id}`);
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
  const flagNames = new Set(['--date', '--source', '--out', '--withdrawn']);
  const positional = argv.filter((a, i) => !flagNames.has(a) && !flagNames.has(argv[i - 1] ?? ''));
  const inPath = positional[0];
  if (!inPath) {
    console.error('usage: npx tsx scripts/audit/build-audited-generated-list.ts <ids.csv|ids.jsonl> [--date YYYY-MM-DD] [--source "<label>"] [--out <file>] [--withdrawn <file>]');
    process.exit(2);
  }
  const date = flag('--date') ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got ${date}`);
  const source = flag('--source') ?? `audited generated items ${date}`;
  const dataDir = path.join(__dirname, '..', '..', 'src', 'data');
  const out = flag('--out') ?? path.join(dataDir, 'audited-generated-items.json');
  const withdrawnPath = flag('--withdrawn') ?? path.join(dataDir, 'withdrawn-practice-items.json');
  const withdrawn = new Set(Object.keys((JSON.parse(fs.readFileSync(withdrawnPath, 'utf8')) as { items: Record<string, string> }).items));
  const list = buildAuditedGeneratedList(readAuditedIds(fs.readFileSync(inPath, 'utf8'), inPath), date, source, withdrawn);
  fs.writeFileSync(out, JSON.stringify(list, null, 2) + '\n');
  console.log(`wrote ${Object.keys(list.items).length} audited generated ids to ${out}`);
  console.log(`  checked against ${withdrawn.size} withdrawn ids (${withdrawnPath}): no overlap`);
}

if (require.main === module) main();
