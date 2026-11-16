// Manifest spreadsheet (CSV or XLSX): one row per item with item ID, subject,
// course and a showcase flag. Headers are matched loosely.

export type SheetRow = { itemId: string; subject?: string; course?: string; showcase?: boolean };

function pick(headers: string[], ...words: string[]): number {
  return headers.findIndex((h) => words.some((w) => h.toLowerCase().replace(/[^a-z]/g, "").includes(w)));
}

function toRows(table: string[][]): SheetRow[] {
  if (!table.length) return [];
  const headers = table[0].map((h) => String(h ?? ""));
  const iId = pick(headers, "itemid", "item", "id");
  if (iId < 0) throw new Error("No item ID column found in the spreadsheet.");
  const iSub = pick(headers, "subject");
  const iCourse = pick(headers, "course");
  const iShow = pick(headers, "showcase");
  const yes = (v: string) => /^(y|yes|true|1|x|✓)$/i.test(v.trim());
  return table
    .slice(1)
    .map((r) => ({
      itemId: String(r[iId] ?? "").trim().replace(/\.0$/, ""),
      subject: iSub >= 0 ? String(r[iSub] ?? "").trim() || undefined : undefined,
      course: iCourse >= 0 ? String(r[iCourse] ?? "").trim() || undefined : undefined,
      showcase: iShow >= 0 ? yes(String(r[iShow] ?? "")) : undefined,
    }))
    .filter((r) => /^\d+$/.test(r.itemId));
}

export function parseCsv(text: string): SheetRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === "," || c === "\t") row.push(cell), (cell = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell), rows.push(row), (row = []), (cell = "");
    } else cell += c;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  return toRows(rows.filter((r) => r.some((c) => c.trim())));
}

export async function parseXlsx(data: ArrayBuffer): Promise<SheetRow[]> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(data);
  const ws = wb.worksheets[0];
  const table: string[][] = [];
  ws.eachRow((r) => {
    const vals = (r.values as unknown[]).slice(1).map((v) => {
      if (v && typeof v === "object" && "text" in (v as object)) return String((v as { text: string }).text);
      if (v && typeof v === "object" && "result" in (v as object)) return String((v as { result: unknown }).result);
      return v == null ? "" : String(v);
    });
    table.push(vals);
  });
  return toRows(table);
}
