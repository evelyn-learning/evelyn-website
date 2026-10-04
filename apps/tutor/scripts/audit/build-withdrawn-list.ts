/**
 * Regenerate src/data/withdrawn-practice-items.json from an answer-key audit's
 * `flagged.csv` (written by audit-answer-keys.ts; columns: id, course, source,
 * format, question, stored_key, blind_answer, tiebreak_answer, verdict, reason).
 *
 * Every row of the CSV is withdrawn: the engine stops SERVING those ids
 * (src/lib/tutor/portal/withdrawn-items.ts) while answers to already-issued
 * ids keep grading. To put an item back, remove its row from the CSV (or fix
 * the item and re-audit) and re-run this script.
 *
 * Reads one file, writes one file. No database, no network, no .env.
 *
 *   npx tsx scripts/audit/build-withdrawn-list.ts <flagged.csv> [--date YYYY-MM-DD] [--source "<label>"] [--out <file>]
 *
 * --date defaults to today; --source defaults to "answer-key audit <date>".
 */
import fs from 'node:fs';
import path from 'node:path';

/** RFC-4180 parse (quoted cells, doubled quotes, newlines inside quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      rows.push(row); row = [];
    } else cell += ch;
  }
  if (cell.length > 0 || row.length > 0) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.length > 0));
}

export interface WithdrawnList {
  generatedAt: string;
  source: string;
  items: Record<string, string>;
}

export function buildWithdrawnList(csvText: string, generatedAt: string, source: string): WithdrawnList {
  const rows = parseCsv(csvText);
  const header = rows[0] ?? [];
  const idCol = header.indexOf('id');
  const verdictCol = header.indexOf('verdict');
  if (idCol < 0 || verdictCol < 0) throw new Error(`CSV needs "id" and "verdict" columns; got: ${header.join(', ')}`);
  const entries: Array<[string, string]> = [];
  const seen = new Set<string>();
  for (const [n, r] of rows.slice(1).entries()) {
    const id = (r[idCol] ?? '').trim();
    const verdict = (r[verdictCol] ?? '').trim();
    if (!id) throw new Error(`row ${n + 2}: empty id`);
    if (!/^[A-Z_]+$/.test(verdict)) throw new Error(`row ${n + 2} (${id}): unexpected verdict ${JSON.stringify(verdict)}`);
    if (seen.has(id)) throw new Error(`row ${n + 2}: duplicate id ${id}`);
    seen.add(id);
    entries.push([id, verdict]);
  }
  // Sorted so a regenerated file diffs cleanly.
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return { generatedAt, source, items: Object.fromEntries(entries) };
}

function main(): void {
  const argv = process.argv.slice(2);
  const flag = (name: string): string | undefined => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const flagNames = new Set(['--date', '--source', '--out']);
  const positional = argv.filter((a, i) => !flagNames.has(a) && !flagNames.has(argv[i - 1] ?? ''));
  const csvPath = positional[0];
  if (!csvPath) {
    console.error('usage: npx tsx scripts/audit/build-withdrawn-list.ts <flagged.csv> [--date YYYY-MM-DD] [--source "<label>"] [--out <file>]');
    process.exit(2);
  }
  const date = flag('--date') ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got ${date}`);
  const source = flag('--source') ?? `answer-key audit ${date}`;
  const out = flag('--out') ?? path.join(__dirname, '..', '..', 'src', 'data', 'withdrawn-practice-items.json');
  const list = buildWithdrawnList(fs.readFileSync(csvPath, 'utf8'), date, source);
  fs.writeFileSync(out, JSON.stringify(list, null, 2) + '\n');
  const byVerdict: Record<string, number> = {};
  for (const v of Object.values(list.items)) byVerdict[v] = (byVerdict[v] ?? 0) + 1;
  const planItems = Object.keys(list.items).filter((id) => id.includes('::')).length;
  console.log(`wrote ${Object.keys(list.items).length} withdrawn ids to ${out}`);
  console.log(`  plan try-yourselves: ${planItems}, bank rows: ${Object.keys(list.items).length - planItems}`);
  console.log(`  by verdict: ${JSON.stringify(byVerdict)}`);
}

if (require.main === module) main();
