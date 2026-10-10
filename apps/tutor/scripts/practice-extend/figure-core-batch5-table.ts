/**
 * Batch 5, part "table" (data_table): the TEXT transcription and the
 * deterministic checkers. Conventions: figure-core-batch4-kit.ts.
 *
 * A table is transcribed row by row, each cell under its column header; a
 * cell left out is a blank — it has no value in the spec, so nothing can
 * leak. Only the HEADERS are listed as printed labels (an alt text names
 * what the table is about, not its numbers — that is where the answers are).
 *
 * What a table SETTLES: a printed cell; a "?" cell that a printed total (or
 * the parts of a total) fixes; sums, relative frequencies and conditional
 * probabilities of a two-way table (counted from the cells, checked against
 * the printed totals); rates of change between two rows; whether a column
 * grows by a constant difference or a constant ratio; reaction orders and a
 * rate constant by the method of initial rates.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { tableModel, type TableCell, type TableModel } from '../../src/lib/tutor/practice-figure/kinds/data-table';
import { BLANK, approx, fail, fmt, isNum, label, modelOf, num, pick, text, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
const model = (spec: PracticeFigureSpec): TableModel => modelOf(spec, tableModel);
const cellText = (c: TableCell): string => (c.kind === 'blank' ? BLANK : c.kind === 'empty' ? '(empty)' : `"${c.text}"`);
const colName = (m: TableModel, j: number): string => (m.columns[j].text ? `"${m.columns[j].text}"` : `column ${j + 1}`);
const rowName = (m: TableModel, i: number): string => (m.rowHeaders ? `"${(m.rows[i][0] as { text: string }).text}"` : `row ${i + 1}`);

function describe(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  if (spec.type !== 'data_table') return '';
  const m = model(spec);
  if (m.title) printed.push(`title: "${m.title}"`);
  if (m.columnGroup) printed.push(`heading over the data columns: "${m.columnGroup}"`);
  m.columns.forEach((c) => { if (c.text) printed.push(`column header: "${c.text}"`); });
  if (m.rowHeaders) m.rows.forEach((row) => printed.push(`row name: "${(row[0] as { text: string }).text}"`));
  const blanks = m.rows.flat().filter((c) => c.kind === 'blank').length;
  out.push(`A table with ${m.columns.length} columns and ${m.rows.length} rows under a header row${m.rowHeaders ? '; the first column names the rows' : ''}${m.totalsRow ? '; the last row holds totals (set bold under a heavier rule)' : ''}${m.totalsColumn ? '; the last column holds totals (set bold after a heavier rule)' : ''}.`);
  if (m.columnGroup) out.push(`The heading "${m.columnGroup}" spans the data columns.`);
  out.push(`Column headers, left to right: ${m.columns.map((c) => (c.text ? `"${c.text}"` : '(an empty corner)')).join(', ')}.`);
  out.push('Rows, top to bottom, each cell under its column header:');
  m.rows.forEach((row, i) => out.push(`  ${row.map((c, j) => `${m.columns[j].text || 'row name'}: ${cellText(c)}`).join('; ')}${m.totalsRow && i === m.rows.length - 1 ? '  (the totals row)' : ''}`));
  if (blanks > 0) out.push(`${blanks === 1 ? 'One cell is' : `${blanks} cells are`} left out and shown as a "?" box; no value is printed there.`);
  return `a table with ${WORDS[m.columns.length]} columns and ${WORDS[m.rows.length]} ${m.rows.length === 1 ? 'row' : 'rows'} under a header row`;
}

// ── arguments ───────────────────────────────────────────────────────────────

/** A column, by its header as printed ("[A] (M)"), its header without the unit, or its 0-based index. */
function colArg(m: TableModel, a: P, k: string): number {
  const v = a[k];
  if (isNum(v) && Number.isInteger(v) && v >= 0 && v < m.columns.length) return v;
  if (typeof v === 'string') {
    const s = v.trim();
    const hit = m.columns.map((c, j) => (c.text === s || c.header === s ? j : -1)).filter((j) => j >= 0);
    if (hit.length === 1) return hit[0];
  }
  return fail(`derivation argument "${k}" must be the header (or 0-based index) of exactly one column — ${m.columns.map((c) => `"${c.text}"`).join(', ')}`);
}
/** A row, by its name in the first column (a table with row names) or its 0-based index (top row under the header = 0). */
function rowArg(m: TableModel, a: P, k: string): number {
  const v = a[k];
  if (isNum(v) && Number.isInteger(v) && v >= 0 && v < m.rows.length) return v;
  if (typeof v === 'string' && m.rowHeaders) {
    const hit = m.rows.map((row, i) => ((row[0] as { text: string }).text === v.trim() ? i : -1)).filter((i) => i >= 0);
    if (hit.length === 1) return hit[0];
  }
  return fail(`derivation argument "${k}" must be ${m.rowHeaders ? `the name of a row (${m.rows.map((_, i) => rowName(m, i)).join(', ')}) or ` : ''}the 0-based index of a row (0 to ${m.rows.length - 1})`);
}
/** The number a cell prints; a blank, an empty cell or a text is refused in words. */
function numberAt(m: TableModel, i: number, j: number): number {
  const c = m.rows[i][j];
  const where = `the cell in ${rowName(m, i)} under ${colName(m, j)}`;
  if (c.kind === 'blank') return fail(`${where} is left out on the figure (a "?" box) — it cannot be read; use table_missing_cell when a printed total fixes it`);
  if (c.kind === 'empty') return fail(`${where} is empty`);
  if (c.value === undefined) return fail(`${where} is a text ("${c.text}"), not a number`);
  return c.value;
}
/** The data rows / columns of the table: without the row names and without the totals. */
const dataRows = (m: TableModel): number[] => m.rows.map((_, i) => i).filter((i) => !(m.totalsRow && i === m.rows.length - 1));
const dataCols = (m: TableModel): number[] => m.columns.map((_, j) => j).filter((j) => !(m.rowHeaders && j === 0) && !(m.totalsColumn && j === m.columns.length - 1));
const isTotalRow = (m: TableModel, i: number): boolean => m.totalsRow && i === m.rows.length - 1;
const isTotalCol = (m: TableModel, j: number): boolean => m.totalsColumn && j === m.columns.length - 1;
const sum = (xs: number[]): number => xs.reduce((t, v) => t + v, 0);
const close = (a: number, b: number): boolean => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/** Exact when it terminates within four decimals or is a ratio of small whole numbers (a key written as a fraction then matches); else rounded. */
function ratioValue(v: number): ReturnType<typeof num> {
  if (Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-7) return num(Math.round(v * 1e4) / 1e4);
  for (let den = 2; den <= 2000; den++) if (Math.abs(v * den - Math.round(v * den)) < 1e-9) return num(v);
  return approx(v);
}

/**
 * The counts of a two-way table, from its data cells; every printed total is
 * checked against them (a table whose totals disagree with its cells settles
 * nothing). A cell left out is filled in when a printed total fixes it.
 */
function twoWay(m: TableModel): { rows: number[]; cols: number[]; at: (i: number, j: number) => number; rowTotal: (i: number) => number; colTotal: (j: number) => number; grand: number } {
  if (!m.rowHeaders) fail('a two-way table needs row names (rowHeaders: true)');
  const rows = dataRows(m);
  const cols = dataCols(m);
  if (rows.length < 2 || cols.length < 2) fail('a two-way table needs at least two data rows and two data columns');
  const at = (i: number, j: number): number => (m.rows[i][j].kind === 'blank' ? solveBlank(m, i, j) : numberAt(m, i, j));
  const rowTotal = (i: number): number => sum(cols.map((j) => at(i, j)));
  const colTotal = (j: number): number => sum(rows.map((i) => at(i, j)));
  const grand = sum(rows.map(rowTotal));
  const printedTotal = (i: number, j: number, want: number, what: string): void => {
    const c = m.rows[i][j];
    if (c.kind === 'value' && c.value !== undefined && !close(c.value, want)) fail(`the printed total of ${what} (${c.text}) is not the sum of its cells (${fmt(want)}) — the table contradicts itself`);
  };
  if (m.totalsColumn) rows.forEach((i) => printedTotal(i, m.columns.length - 1, rowTotal(i), rowName(m, i)));
  if (m.totalsRow) cols.forEach((j) => printedTotal(m.rows.length - 1, j, colTotal(j), colName(m, j)));
  if (m.totalsRow && m.totalsColumn) printedTotal(m.rows.length - 1, m.columns.length - 1, grand, 'the whole table');
  if (!(grand > 0)) fail('the counts of the table add up to nothing');
  return { rows, cols, at, rowTotal, colTotal, grand };
}

/** The value a "?" cell must have: from the printed total of its row or of its column (or, for a total, from its parts). Both ways must agree. */
function solveBlank(m: TableModel, i: number, j: number): number {
  if (m.rows[i][j].kind !== 'blank') return fail(`the cell in ${rowName(m, i)} under ${colName(m, j)} is not left out — read it with table_cell`);
  if (m.rowHeaders && j === 0) return fail('a row name cannot be solved for');
  const found: number[] = [];
  const tryLine = (cells: Array<[number, number]>, total: [number, number] | null, selfIsTotal: boolean): void => {
    // `cells`: the parts of the line; `total`: where its total is printed.
    const others = cells.filter(([a, b]) => !(a === i && b === j));
    if (others.some(([a, b]) => m.rows[a][b].kind !== 'value' || (m.rows[a][b] as { value?: number }).value === undefined)) return;
    const parts = sum(others.map(([a, b]) => numberAt(m, a, b)));
    if (selfIsTotal) { found.push(parts); return; }
    if (!total) return;
    const t = m.rows[total[0]][total[1]];
    if (t.kind !== 'value' || t.value === undefined) return;
    found.push(t.value - parts);
  };
  const rows = dataRows(m);
  const cols = dataCols(m);
  const lastRow = m.rows.length - 1;
  const lastCol = m.columns.length - 1;
  // Along its row.
  if (isTotalCol(m, j)) tryLine(cols.map((b) => [i, b]), null, true);
  else if (m.totalsColumn) tryLine(cols.map((b) => [i, b]), [i, lastCol], false);
  // Along its column.
  if (isTotalRow(m, i)) tryLine(rows.map((a) => [a, j]), null, true);
  else if (m.totalsRow) tryLine(rows.map((a) => [a, j]), [lastRow, j], false);
  if (found.length === 0) return fail(`nothing printed on the table fixes the cell in ${rowName(m, i)} under ${colName(m, j)} — it needs a totals row or a totals column with every other cell of that line printed`);
  if (found.some((v) => !close(v, found[0]))) return fail(`the row total and the column total give different values for the cell left out (${found.map(fmt).join(' and ')}) — the table contradicts itself`);
  return Number(found[0].toPrecision(12));
}

/** The x and y columns of a checker that follows one column against another, with the rows in which both are printed numbers. */
function xyOf(m: TableModel, a: P): { x: number[]; y: number[]; jx: number; jy: number } {
  const jx = colArg(m, a, 'x');
  const jy = colArg(m, a, 'y');
  if (jx === jy) fail('x and y are the same column');
  const rows = dataRows(m);
  return { x: rows.map((i) => numberAt(m, i, jx)), y: rows.map((i) => numberAt(m, i, jy)), jx, jy };
}
function evenSteps(x: number[], what: string): number {
  if (x.length < 3) fail(`${what} needs at least three rows`);
  const d = x[1] - x[0];
  if (d === 0 || x.slice(1).some((v, k) => !close(v - x[k], d))) fail(`${what} needs equal steps in the x column`);
  return d;
}

/** The order with respect to one concentration, by the method of initial rates: every pair of rows in which only that concentration changes must give the same whole (or half) number. */
function orderOf(m: TableModel, jRate: number, jConc: number, others: number[]): number {
  const rows = dataRows(m);
  const orders: number[] = [];
  for (let a = 0; a < rows.length; a++) {
    for (let b = a + 1; b < rows.length; b++) {
      const [ia, ib] = [rows[a], rows[b]];
      const ca = numberAt(m, ia, jConc);
      const cb = numberAt(m, ib, jConc);
      if (close(ca, cb) || !others.every((j) => close(numberAt(m, ia, j), numberAt(m, ib, j)))) continue;
      const ra = numberAt(m, ia, jRate);
      const rb = numberAt(m, ib, jRate);
      if (!(ca > 0 && cb > 0 && ra > 0 && rb > 0)) fail('concentrations and rates must be greater than 0');
      orders.push(Math.log(rb / ra) / Math.log(cb / ca));
    }
  }
  if (orders.length === 0) return fail(`no two rows change ${colName(m, jConc)} alone while the other concentrations stay the same — its order cannot be isolated`);
  const snapped = orders.map((o) => Math.round(o * 2) / 2);
  if (orders.some((o, k) => Math.abs(o - snapped[k]) > 0.03)) return fail(`the rates do not give a whole (or half) order for ${colName(m, jConc)} (${orders.map((o) => o.toFixed(2)).join(', ')})`);
  if (snapped.some((o) => o !== snapped[0])) return fail(`different pairs of rows give different orders for ${colName(m, jConc)} (${[...new Set(snapped)].join(', ')})`);
  return Object.is(snapped[0], -0) ? 0 : snapped[0];
}
function concColumns(m: TableModel, a: P, jRate: number): number[] {
  const list = a.concentrations;
  if (Array.isArray(list)) {
    const cols = list.map((c) => colArg(m, { c }, 'c'));
    if (new Set(cols).size !== cols.length || cols.includes(jRate)) fail('derivation argument "concentrations" lists a column twice, or lists the rate column');
    if (cols.length === 0) fail('derivation argument "concentrations" is empty');
    return cols;
  }
  if (list !== undefined) fail('derivation argument "concentrations" must be a list of column headers (or indices)');
  // Every numeric data column but the rate and a first column that only numbers the experiments.
  const cols = dataCols(m).filter((j) => j !== jRate && m.columns[j].numeric && !(j === 0 && /^(?:exp|trial|run|#)/i.test(m.columns[0].header)));
  if (cols.length === 0) fail('the table has no concentration column');
  return cols;
}

const checkers: Record<string, Batch4CheckerDef> = {
  table_cell: {
    kinds: ['data_table'], args: '{ row: name or index, column: header or index }', returns: 'what one cell prints — a number, or its text (a cell left out as "?" is refused)',
    run: (s, a) => {
      const m = model(s);
      const i = rowArg(m, a, 'row');
      const j = colArg(m, a, 'column');
      const c = m.rows[i][j];
      if (c.kind === 'value' && c.value === undefined) return text(c.text);
      return num(numberAt(m, i, j));
    },
  },
  table_missing_cell: {
    kinds: ['data_table'], args: '{ row?: name or index, column?: header or index — may be left out when exactly one cell is a "?" }', returns: 'the value of a cell left out as "?", from the printed total of its row or column (or, for a total, from its parts); refused when no printed total fixes it',
    run: (s, a) => {
      const m = model(s);
      if (a.row === undefined && a.column === undefined) {
        const blanks = m.rows.flatMap((row, i) => row.map((c, j) => (c.kind === 'blank' ? [i, j] : null))).filter((x): x is number[] => x !== null);
        if (blanks.length !== 1) return fail(`the table has ${blanks.length} cells left out — name one with the derivation arguments "row" and "column"`);
        return num(solveBlank(m, blanks[0][0], blanks[0][1]));
      }
      return num(solveBlank(m, rowArg(m, a, 'row'), colArg(m, a, 'column')));
    },
  },
  table_total: {
    kinds: ['data_table'], args: '{ row: name or index } or { column: header or index } or {} (the whole table: needs row names)', returns: 'the sum of the data cells of one row or one column (totals and row names apart), or of the whole table',
    run: (s, a) => {
      const m = model(s);
      if (a.row !== undefined && a.column !== undefined) return fail('give "row" or "column", not both');
      if (a.row !== undefined) {
        const i = rowArg(m, a, 'row');
        return isTotalRow(m, i) ? fail('that row IS the totals row — name a data row, or leave row and column out for the whole table') : num(sum(dataCols(m).map((j) => numberAt(m, i, j))));
      }
      if (a.column !== undefined) {
        const j = colArg(m, a, 'column');
        if (isTotalCol(m, j) || (m.rowHeaders && j === 0)) return fail('that column holds the totals or the row names — name a data column');
        return num(sum(dataRows(m).map((i) => numberAt(m, i, j))));
      }
      return num(twoWay(m).grand);
    },
  },
  table_relative_frequency: {
    kinds: ['data_table'], args: '{ row?: name, column?: header, givenRow?: name, givenColumn?: header }', returns: 'two-way table: a joint relative frequency (row and column), a marginal one (row or column alone), or a conditional one — P(column | givenRow) or P(row | givenColumn) — as a fraction of the counts',
    run: (s, a) => {
      const m = model(s);
      const t = twoWay(m);
      const dataRow = (k: string): number => { const i = rowArg(m, a, k); return t.rows.includes(i) ? i : fail(`derivation argument "${k}" must name a data row, not the totals`); };
      const dataCol = (k: string): number => { const j = colArg(m, a, k); return t.cols.includes(j) ? j : fail(`derivation argument "${k}" must name a data column, not the totals or the row names`); };
      const has = (k: string): boolean => a[k] !== undefined;
      if (has('givenRow') && has('givenColumn')) return fail('give one condition: givenRow or givenColumn');
      if (has('givenRow')) {
        if (has('row') || !has('column')) return fail('with givenRow, name the column whose share of that row is wanted (and no row)');
        const i = dataRow('givenRow');
        return t.rowTotal(i) > 0 ? ratioValue(t.at(i, dataCol('column')) / t.rowTotal(i)) : fail('that row has a total of 0');
      }
      if (has('givenColumn')) {
        if (has('column') || !has('row')) return fail('with givenColumn, name the row whose share of that column is wanted (and no column)');
        const j = dataCol('givenColumn');
        return t.colTotal(j) > 0 ? ratioValue(t.at(dataRow('row'), j) / t.colTotal(j)) : fail('that column has a total of 0');
      }
      if (has('row') && has('column')) return ratioValue(t.at(dataRow('row'), dataCol('column')) / t.grand);
      if (has('row')) return ratioValue(t.rowTotal(dataRow('row')) / t.grand);
      if (has('column')) return ratioValue(t.colTotal(dataCol('column')) / t.grand);
      return fail('name a row, a column, or both (with givenRow / givenColumn for a conditional relative frequency)');
    },
  },
  table_average_rate: {
    kinds: ['data_table'], args: '{ x: column, y: column, from: row, to: row }', returns: 'the average rate of change of the y column against the x column between two rows: (y₂ − y₁) ÷ (x₂ − x₁), signed',
    run: (s, a) => {
      const m = model(s);
      const jx = colArg(m, a, 'x');
      const jy = colArg(m, a, 'y');
      const i0 = rowArg(m, a, 'from');
      const i1 = rowArg(m, a, 'to');
      if (jx === jy) return fail('x and y are the same column');
      const dx = numberAt(m, i1, jx) - numberAt(m, i0, jx);
      if (i0 === i1 || dx === 0) return fail('the two rows must have different values in the x column');
      return ratioValue((numberAt(m, i1, jy) - numberAt(m, i0, jy)) / dx);
    },
  },
  table_pattern: {
    kinds: ['data_table'], args: '{ x: column, y: column }', returns: 'the NAME of the growth of the y column over equal steps of x: "linear" (a constant difference), "exponential" (a constant ratio) or "neither"',
    run: (s, a) => {
      const m = model(s);
      const { x, y } = xyOf(m, a);
      evenSteps(x, 'table_pattern');
      const d = y.slice(1).map((v, k) => v - y[k]);
      const linear = d.every((v) => close(v, d[0]));
      if (linear && d[0] === 0) return fail('the y column never changes — it is constant, which is both and neither');
      const ratio = y.every((v) => v !== 0) ? y.slice(1).map((v, k) => v / y[k]) : [];
      const exponential = ratio.length > 0 && ratio.every((v) => close(v, ratio[0])) && ratio[0] > 0 && !close(ratio[0], 1);
      return label(linear ? 'linear' : exponential ? 'exponential' : 'neither');
    },
  },
  table_slope: {
    kinds: ['data_table'], args: '{ x: column, y: column }', returns: 'the constant rate of change Δy ÷ Δx of the y column against the x column (refused unless it is the same between every two neighbouring rows)',
    run: (s, a) => {
      const m = model(s);
      const { x, y } = xyOf(m, a);
      if (x.length < 2) return fail('table_slope needs at least two rows');
      const slopes = x.slice(1).map((v, k) => (v === x[k] ? fail('two neighbouring rows have the same x') : (y[k + 1] - y[k]) / (v - x[k])));
      if (slopes.some((v) => !close(v, slopes[0]))) return fail('the rate of change is not constant from row to row — the table is not linear');
      return ratioValue(slopes[0]);
    },
  },
  table_common_ratio: {
    kinds: ['data_table'], args: '{ x: column, y: column }', returns: 'the constant factor by which the y column is multiplied for each step of the x column (refused unless x goes in equal steps and the ratio is constant)',
    run: (s, a) => {
      const m = model(s);
      const { x, y } = xyOf(m, a);
      evenSteps(x, 'table_common_ratio');
      if (y.some((v) => v === 0)) return fail('a y value of 0 has no ratio');
      const ratio = y.slice(1).map((v, k) => v / y[k]);
      if (ratio.some((v) => !close(v, ratio[0]))) return fail('the ratio of neighbouring y values is not constant — the table is not exponential');
      return ratioValue(ratio[0]);
    },
  },
  table_lookup: {
    kinds: ['data_table'], args: '{ where: column, equals: number or text, find: column }', returns: 'the cell of the "find" column in the one row whose "where" column prints that value (a table of values read forwards or backwards)',
    run: (s, a) => {
      const m = model(s);
      const jw = colArg(m, a, 'where');
      const jf = colArg(m, a, 'find');
      const want = a.equals;
      if (!isNum(want) && typeof want !== 'string') return fail('derivation argument "equals" must be a number or a text printed in the "where" column');
      const hits = m.rows.map((row, i) => i).filter((i) => {
        const c = m.rows[i][jw];
        return c.kind === 'value' && (isNum(want) ? c.value !== undefined && close(c.value, want) : c.text === want.trim());
      });
      if (hits.length !== 1) return fail(`${hits.length === 0 ? 'no row' : 'more than one row'} has ${isNum(want) ? fmt(want) : `"${want}"`} under ${colName(m, jw)}`);
      const c = m.rows[hits[0]][jf];
      if (c.kind === 'value' && c.value === undefined) return text(c.text);
      return num(numberAt(m, hits[0], jf));
    },
  },
  table_extreme: {
    kinds: ['data_table'], args: '{ column: header or index, which: largest | smallest }', returns: 'the NAME of the data row with the greatest or least value in that column (a table with row names; a tie is refused)',
    run: (s, a) => {
      const m = model(s);
      if (!m.rowHeaders) return fail('table_extreme names a row — the table needs row names (rowHeaders: true)');
      const j = colArg(m, a, 'column');
      const sign = pick(a, 'which', ['largest', 'smallest'] as const) === 'largest' ? 1 : -1;
      const rows = dataRows(m);
      const vals = rows.map((i) => sign * numberAt(m, i, j));
      const best = Math.max(...vals);
      const hit = rows.filter((_, k) => close(vals[k], best));
      if (hit.length !== 1) return fail('two rows tie for that extreme');
      return label((m.rows[hit[0]][0] as { text: string }).text);
    },
  },
  table_reaction_order: {
    kinds: ['data_table'], args: '{ rate: column, concentration: column, concentrations?: list of all concentration columns (default: every numeric column but the rate and an experiment-number column) }', returns: 'the order of the reaction with respect to one concentration, by the method of initial rates: from rows in which only that concentration changes (refused when it cannot be isolated or is not a whole or half number)',
    run: (s, a) => {
      const m = model(s);
      const jRate = colArg(m, a, 'rate');
      const jConc = colArg(m, a, 'concentration');
      const all = concColumns(m, a, jRate);
      if (!all.includes(jConc)) return fail('derivation argument "concentration" is not one of the concentration columns');
      return num(orderOf(m, jRate, jConc, all.filter((j) => j !== jConc)));
    },
  },
  table_rate_constant: {
    kinds: ['data_table'], args: '{ rate: column, concentrations?: list of the concentration columns }', returns: 'the rate constant k = rate ÷ Π[X]^order, with the orders found by the method of initial rates; every row must give the same k to within 2 % (a rounded value, in the units of the table)',
    run: (s, a) => {
      const m = model(s);
      const jRate = colArg(m, a, 'rate');
      const all = concColumns(m, a, jRate);
      const orders = all.map((j) => orderOf(m, jRate, j, all.filter((o) => o !== j)));
      const ks = dataRows(m).map((i) => numberAt(m, i, jRate) / all.reduce((t, j, k) => t * numberAt(m, i, j) ** orders[k], 1));
      const mean = sum(ks) / ks.length;
      if (ks.some((k) => Math.abs(k - mean) > 0.02 * Math.abs(mean))) return fail(`the rows give different rate constants (${ks.map((k) => k.toPrecision(3)).join(', ')}) — the data do not fit one rate law`);
      // A k every row agrees on exactly is exact; else the mean, rounded.
      return ks.every((k) => close(Number(k.toPrecision(9)), Number(ks[0].toPrecision(9)))) ? ratioValue(Number(ks[0].toPrecision(9))) : approx(mean);
    },
  },
  table_overall_order: {
    kinds: ['data_table'], args: '{ rate: column, concentrations?: list of the concentration columns }', returns: 'the overall order of the reaction: the sum of the orders with respect to each concentration column',
    run: (s, a) => {
      const m = model(s);
      const jRate = colArg(m, a, 'rate');
      const all = concColumns(m, a, jRate);
      return num(sum(all.map((j) => orderOf(m, jRate, j, all.filter((o) => o !== j)))));
    },
  },
};

export const PART: Batch4Part = { kinds: ['data_table'], describe, checkers };
