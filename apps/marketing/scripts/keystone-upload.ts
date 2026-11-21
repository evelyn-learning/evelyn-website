/**
 * Loads QTI zips into Keystone from the command line: the same steps as the
 * site's Upload page (file kept as received, upload row, items added or
 * refreshed), for packages that reached us by email rather than the site.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:2710 KEYSTONE_DATA_DIR=<local dir> \
 *   npx tsx apps/marketing/scripts/keystone-upload.ts <Item123.zip> [more.zip …]
 *
 * Then rsync <local dir>/ to the box's /root/keystone-data/ (no --delete):
 * images and the kept zips live on disk, not in the database.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { closeKs, ks } from "../src/lib/keystone/db";
import { saveUpload } from "../src/lib/keystone/assets";
import { readQtiZip } from "../src/lib/keystone/qti";
import { ingestQtiItems, type Actor } from "../src/lib/keystone/store";
import { KEYSTONE_DB } from "../src/lib/keystone/config";

const EVELYN: Actor = { username: "praveen", name: "Evelyn Learning", role: "evelyn" };

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error(`Set KEYSTONE_MONGODB_URI explicitly (database is always ${KEYSTONE_DB}).`);
  if (!process.env.KEYSTONE_DATA_DIR) throw new Error("Set KEYSTONE_DATA_DIR explicitly (a local folder to rsync to the box afterwards).");
  const files = process.argv.slice(2);
  if (!files.length) throw new Error("Usage: keystone-upload.ts <zip> [more.zip …]");
  const { Upload } = await ks();
  for (const file of files) {
    const buf = new Uint8Array(await readFile(file));
    const parsed = await readQtiZip(buf);
    if (!parsed.items.length) throw new Error(`${file}: no QTI items (item_<id>_apip.xml) found`);
    const name = path.basename(file);
    const upload = await Upload.create({
      filename: name,
      storedAs: await saveUpload(name, buf),
      size: buf.byteLength,
      kind: "qti",
      username: EVELYN.username,
      itemIds: [],
      messages: [],
    });
    const { created, updated } = await ingestQtiItems(parsed.items, EVELYN, String(upload._id));
    await Upload.updateOne({ _id: upload._id }, { $set: { itemIds: [...created, ...updated], messages: parsed.messages } });
    console.log(`${name}: created [${created}] refreshed [${updated}]${parsed.messages.length ? " — " + parsed.messages.join("; ") : ""}`);
  }
  await closeKs();
}

main().catch(async (e) => {
  console.error((e as Error).message);
  await closeKs();
  process.exit(1);
});
