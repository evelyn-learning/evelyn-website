/**
 * Prints the level the pipeline would read from each named item's question (pipeline/level.ts). Read-only: the
 * database is opened read-only and nothing is stored. One small model call per item.
 *
 *   KEYSTONE_PIPELINE_LIVE=1 KEYSTONE_MONGODB_URI=<uri> \
 *   npx tsx apps/marketing/scripts/keystone-level.ts --only id,id [--assets-dir <dir>]
 *
 * --assets-dir: local asset folder laid out <dir>/<itemId>/<file>; the script pulls the named items' images from
 * the box into it first (default <tmp>/keystone-pipeline-assets), as keystone-pipeline.ts --pull-assets does.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

process.env.KEYSTONE_READONLY = "1";

const BOX_ASSETS = "root@85.239.239.134:/root/keystone-data/assets";
const SENDABLE = new Set(["png", "jpg", "jpeg", "gif", "webp"]);

async function main() {
  const argv = process.argv.slice(2);
  const arg = (name: string) => { const k = argv.indexOf(name); return k >= 0 ? argv[k + 1] : undefined; };
  const only = (arg("--only") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!only.length) throw new Error("Name the items: --only id,id");
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error("Refusing to run: set KEYSTONE_MONGODB_URI explicitly.");
  if (process.env.KEYSTONE_PIPELINE_LIVE !== "1") throw new Error("Refusing to run: model calls are off (set KEYSTONE_PIPELINE_LIVE=1).");
  const assetsDir = arg("--assets-dir") ?? path.join(tmpdir(), "keystone-pipeline-assets");

  const { closeKs } = await import("../src/lib/keystone/db");
  const { folderAssets, mongoReader } = await import("../src/lib/keystone/pipeline/run");
  const { shownImages } = await import("../src/lib/keystone/pipeline/intake");
  const { levelModel } = await import("../src/lib/keystone/pipeline/level");
  const reader = mongoReader();
  const assets = folderAssets(assetsDir);
  let cost = 0;
  try {
    for (const id of only) {
      if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error(`unexpected item id ${JSON.stringify(id)}`);
      const item = await reader.item(id);
      if (!item) { console.log(`${id}: no such item`); continue; }
      const files = shownImages(item).filter((f) => SENDABLE.has(path.extname(f).slice(1).toLowerCase()));
      if (files.length) {
        const into = path.join(assetsDir, id);
        mkdirSync(into, { recursive: true });
        spawnSync("rsync", ["-a", "--exclude=player/", "--", `${BOX_ASSETS}/${id}/`, `${into}/`], { stdio: ["ignore", "inherit", "inherit"] });
      }
      const images = files.length ? await assets.images(item, files) : [];
      const r = await levelModel(item, images);
      cost += r.cost;
      const was = `${item.course || "–"} (${item.courseSource ?? "no source"})`;
      if ("failed" in r) console.log(`${id}: FAILED ${r.failed}   [on the item: ${was}]`);
      else console.log(`${id}: ${r.level}   — ${r.why}   [on the item: ${was}; subject ${item.subject || "–"}; ${images.length} image(s); ${r.model}]`);
    }
  } finally {
    console.log(`Cost: $${cost.toFixed(4)}`);
    await closeKs();
  }
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
