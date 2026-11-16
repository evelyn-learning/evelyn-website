import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

// Files live outside the deployed app directory so a deploy never touches
// them: KEYSTONE_DATA_DIR, else ~/keystone-data (/root/keystone-data on the box).
//   assets/<itemId>/<file>   images used by questions and solutions
//   uploads/<stamp>-<name>   every uploaded zip / spreadsheet, kept as received

export const DATA_DIR = process.env.KEYSTONE_DATA_DIR || path.join(homedir(), "keystone-data");
export const ASSET_ROUTE = "/api/keystone/asset";

const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, "_");

export function assetUrl(itemId: string, file: string) {
  return `${ASSET_ROUTE}/${safe(itemId)}/${safe(file)}`;
}

export async function saveAsset(itemId: string, file: string, data: Uint8Array): Promise<string> {
  const dir = path.join(DATA_DIR, "assets", safe(itemId));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safe(file)), data);
  return assetUrl(itemId, file);
}

export async function readAsset(itemId: string, file: string): Promise<Buffer | null> {
  try {
    return await readFile(path.join(DATA_DIR, "assets", safe(itemId), safe(file)));
  } catch {
    return null;
  }
}

export async function saveUpload(name: string, data: Uint8Array): Promise<string> {
  const dir = path.join(DATA_DIR, "uploads");
  await mkdir(dir, { recursive: true });
  const stored = `${new Date().toISOString().replace(/[:.]/g, "-")}-${safe(name)}`;
  await writeFile(path.join(dir, stored), data);
  return stored;
}

export const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
};
