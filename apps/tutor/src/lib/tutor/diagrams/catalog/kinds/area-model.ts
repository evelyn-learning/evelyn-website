/** area_model — solver. Decompose a rectangle into sub-rectangles for
 *  multiplication or distribution. rows/cols are arrays of side-lengths
 *  (e.g. [10, 3] for a 13-wide bar split as 10 + 3). */

export interface AreaModelFigure {
  rows: number[];
  cols: number[];
  cellLabels?: string[][];
  /** Optional header text per row / column (e.g. "x", "+2"). When absent the
   *  numeric side-lengths are shown. */
  rowLabels?: string[];
  colLabels?: string[];
  showProducts: boolean;
  title?: string;
}

export function solveAreaModel(params: Record<string, unknown>): AreaModelFigure {
  const rows = Array.isArray(params.rows) ? params.rows : null;
  const cols = Array.isArray(params.cols) ? params.cols : null;
  if (!rows || rows.length === 0) {
    throw new Error('area_model: rows must be a non-empty array of side-lengths');
  }
  if (!cols || cols.length === 0) {
    throw new Error('area_model: cols must be a non-empty array of side-lengths');
  }
  const r = rows.map((v, i) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) {
      throw new Error(`area_model: rows[${i}] must be a positive number`);
    }
    return v;
  });
  const c = cols.map((v, i) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) {
      throw new Error(`area_model: cols[${i}] must be a positive number`);
    }
    return v;
  });
  let cellLabels: string[][] | undefined;
  if (Array.isArray(params.cellLabels)) {
    const cl = params.cellLabels as unknown[][];
    if (cl.length !== r.length || cl.some((row) => !Array.isArray(row) || row.length !== c.length)) {
      throw new Error(`area_model: cellLabels must be a ${r.length}×${c.length} matrix`);
    }
    cellLabels = cl.map((row) => row.map((v) => String(v ?? '')));
  }
  const headerList = (v: unknown, n: number, name: string): string[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    if (v.length !== n) {
      throw new Error(`area_model: ${name} must have ${n} entries (one per ${name === 'rowLabels' ? 'row' : 'column'})`);
    }
    return v.map((x) => String(x ?? ''));
  };
  const rowLabels = headerList(params.rowLabels, r.length, 'rowLabels');
  const colLabels = headerList(params.colLabels, c.length, 'colLabels');
  return {
    rows: r,
    cols: c,
    cellLabels,
    rowLabels,
    colLabels,
    showProducts: params.showProducts !== false,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}
