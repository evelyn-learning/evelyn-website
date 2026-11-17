import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, can } from "@/lib/keystone/config";
import { userFromToken } from "@/lib/keystone/auth";
import { ks } from "@/lib/keystone/db";
import { saveUpload } from "@/lib/keystone/assets";
import { readQtiZip } from "@/lib/keystone/qti";
import { parseCsv, parseXlsx } from "@/lib/keystone/sheet";
import { applySheetRow, ingestQtiItems } from "@/lib/keystone/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 200 * 1024 * 1024;

/** Upload QTI zips and/or a manifest spreadsheet. Every file is kept as received. */
export async function POST(req: NextRequest) {
  const user = await userFromToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user || !can.upload(user.role)) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => typeof f !== "string" && f.size > 0);
  if (!files.length) return NextResponse.json({ error: "Choose a zip or spreadsheet first." }, { status: 400 });

  const { Upload } = await ks();
  const results: { file: string; created: string[]; updated: string[]; messages: string[] }[] = [];

  // Zips first so a spreadsheet in the same upload can flag the new items.
  const ordered = [...files].sort((a, b) => Number(/\.zip$/i.test(b.name)) - Number(/\.zip$/i.test(a.name)));
  for (const f of ordered) {
    const messages: string[] = [];
    let created: string[] = [];
    let updated: string[] = [];
    if (f.size > MAX_BYTES) {
      results.push({ file: f.name, created, updated, messages: ["File is larger than 200 MB; please split it."] });
      continue;
    }
    const buf = new Uint8Array(await f.arrayBuffer());
    const storedAs = await saveUpload(f.name, buf);
    const isZip = /\.zip$/i.test(f.name);
    const upload = await Upload.create({
      filename: f.name,
      storedAs,
      size: f.size,
      kind: isZip ? "qti" : "sheet",
      username: user.username,
      itemIds: [],
      messages: [],
    });
    try {
      if (isZip) {
        const parsed = await readQtiZip(buf);
        messages.push(...parsed.messages);
        if (!parsed.items.length) messages.push("No QTI items (item_<id>_apip.xml) were found in this zip.");
        ({ created, updated } = await ingestQtiItems(parsed.items, user, String(upload._id)));
      } else if (/\.(csv|tsv|txt)$/i.test(f.name) || /\.xlsx$/i.test(f.name)) {
        const rows = /\.xlsx$/i.test(f.name) ? await parseXlsx(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer) : parseCsv(new TextDecoder().decode(buf));
        const missing: string[] = [];
        for (const r of rows) {
          if ((await applySheetRow(r, user)) === "updated") updated.push(r.itemId);
          else missing.push(r.itemId);
        }
        messages.push(`${rows.length} rows read.`);
        if (missing.length) messages.push(`Not yet uploaded as items (rows kept for later): ${missing.join(", ")}`);
      } else {
        messages.push("Unsupported file type. Upload a .zip (QTI export) or a .csv / .xlsx spreadsheet.");
      }
    } catch (e) {
      messages.push(`Could not read this file: ${(e as Error).message}`);
    }
    await Upload.updateOne({ _id: upload._id }, { $set: { itemIds: [...created, ...updated], messages } });
    results.push({ file: f.name, created, updated, messages });
  }
  return NextResponse.json({ results });
}
