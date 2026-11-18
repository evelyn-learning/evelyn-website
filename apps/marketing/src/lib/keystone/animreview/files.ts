// Where the review's files live (server only). Published versions: DATA_DIR/assets/<itemId>/animated/v<N>/;
// flag pictures: DATA_DIR/animflags/<flagId>/<n>.png.
import path from "node:path";
import { DATA_DIR } from "../assets";
import { isFlagId, isItemId, SHOT_NAME } from "./pure";

/** Folder of one published version. */
export function animatedDir(itemId: string, version: number): string {
  return path.join(DATA_DIR, "assets", itemId, "animated", `v${version}`);
}

/** Absolute path of a file of a published version, or null if the ids are malformed or the path leaves the folder. */
export function animatedFile(itemId: string, version: number, rel: string): string | null {
  if (!isItemId(itemId) || !Number.isInteger(version) || version < 1) return null;
  const root = animatedDir(itemId, version);
  const full = path.resolve(root, rel);
  return full.startsWith(root + path.sep) ? full : null;
}

export function shotFile(flagId: string, file: string): string | null {
  if (!isFlagId(flagId) || !SHOT_NAME.test(file)) return null;
  return path.join(DATA_DIR, "animflags", flagId, file);
}

export function shotDir(flagId: string): string {
  return path.join(DATA_DIR, "animflags", flagId);
}

