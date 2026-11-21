// Owner review of animated solutions: the parts with no database, no Next and no node import (limits,
// input checks, labels, the screenshot crop). Safe to import from client components; file paths are in files.ts.
import type { AnimationStatus, AnimFlagStatus } from "../db";
import type { Role } from "../config";

export const SHOT_NAME = /^[1-9]\d?\.png$/;
export const ANIMATED_ROUTE = "/api/keystone/animated";
export const MAX_SHOT_BYTES = 4 * 1024 * 1024;
export const MAX_SHOTS = 8;
export const MAX_COMMENT = 4000;
export const MAX_REPLY = 2000;

export const ANIMATION_STATUSES: AnimationStatus[] = ["review", "fixing", "accepted", "released"];
export const FLAG_STATUSES: AnimFlagStatus[] = ["open", "fixed", "confirmed", "reopened"];
export const ANIMATION_STATUS_LABEL: Record<AnimationStatus, string> = {
  review: "To review",
  fixing: "Flags open",
  accepted: "Accepted",
  released: "Released",
};

/** The owner sees every version; anyone else only a released one. */
export function canSeeAnimation(role: Role | undefined, status: AnimationStatus | undefined): boolean {
  return role === "evelyn" || status === "released";
}

/** Castle Rock's roles. A flag belongs to their side when one of them raised it; a flag with no role is the owner's. */
export const isCastleRock = (role: unknown): role is "reviewer" | "tech" => role === "reviewer" || role === "tech";

/** Which side a flag belongs to, from the role stored with it (none stored = raised before Castle Rock had the tool = owner). */
export const flagSide = (createdByRole: unknown): "castle-rock" | "owner" => (isCastleRock(createdByRole) ? "castle-rock" : "owner");

/**
 * Whether a viewer may see a flag (its comment, reply and pictures): the owner sees every flag, a Castle Rock
 * user only flags raised by Castle Rock, anyone else none.
 */
export function canSeeFlag(role: Role | undefined, createdByRole: unknown): boolean {
  if (role === "evelyn") return true;
  return isCastleRock(role) && isCastleRock(createdByRole);
}

/** "Julie May · Castle Rock" for the owner's lists; an owner flag is labelled with the name only. */
export function raisedBy(f: { createdBy: string; createdByName?: string | null; createdByRole?: unknown }): string {
  const name = f.createdByName || f.createdBy || "?";
  return isCastleRock(f.createdByRole) ? `${name} · Castle Rock` : name;
}

/** First `max` characters of a comment on one line, with … when cut (status email, lists). */
export function excerpt(comment: string, max = 120): string {
  const one = String(comment ?? "").replace(/\s+/g, " ").trim();
  return one.length > max ? `${one.slice(0, max)}…` : one;
}

export const isItemId = (s: unknown): s is string => typeof s === "string" && /^\d{1,12}$/.test(s);
export const isFlagId = (s: unknown): s is string => typeof s === "string" && /^[0-9a-f]{24}$/.test(s);
export const parseVersion = (s: unknown): number | null => {
  const t = String(s ?? "").replace(/^v/, "");
  if (!/^\d{1,4}$/.test(t)) return null;
  const n = Number(t);
  return n >= 1 ? n : null;
};

export function animatedUrl(itemId: string, version: number, entry = "solution.html"): string {
  return `${ANIMATED_ROUTE}/${itemId}/${version}/${entry.split("/").map(encodeURIComponent).join("/")}`;
}

export const shotUrl = (flagId: string, file: string) => `${ANIMATED_ROUTE}/shot/${flagId}/${file}`;

const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
export function isPng(b: Uint8Array): boolean {
  return b.length > PNG_SIG.length && PNG_SIG.every((v, i) => b[i] === v);
}

/** Checks a batch of shots for a flag that already holds `have`. Returns the error to show, or null. */
export function shotsProblem(shots: Uint8Array[], have = 0): string | null {
  if (have + shots.length > MAX_SHOTS) return `At most ${MAX_SHOTS} pictures per flag.`;
  for (const s of shots) {
    if (s.length > MAX_SHOT_BYTES) return "A picture is larger than 4 MB.";
    if (!isPng(s)) return "Pictures must be PNG.";
  }
  return null;
}

/** Player position as recorded with a flag: whole non-negative numbers, or null when unknown. */
export function cleanPosition(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n < 1e8 ? Math.floor(n) : null;
}

export function cleanComment(v: unknown, max = MAX_COMMENT): string {
  return String(v ?? "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

/** "1:05" from milliseconds; "–" when unknown. */
export function clock(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return "–";
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** "Step 2 · line 3" (1-based for people; the player reports 0-based step and line). */
export function where(step: number | null | undefined, line: number | null | undefined): string {
  if (step === null || step === undefined) return "Step unknown";
  return `Step ${step + 1}${line === null || line === undefined ? "" : ` · line ${line + 1}`}`;
}

export type Rect = { left: number; top: number; width: number; height: number };

/**
 * The part of a captured tab frame that shows the iframe. The frame covers the page's viewport
 * (innerWidth × innerHeight CSS px) at videoWidth × videoHeight device px; the rect is the iframe's
 * getBoundingClientRect(). Clamped to the frame; null when nothing of the iframe is on screen.
 */
export function cropRect(rect: Rect, viewport: { width: number; height: number }, video: { width: number; height: number }): { sx: number; sy: number; sw: number; sh: number } | null {
  if (viewport.width <= 0 || viewport.height <= 0 || video.width <= 0 || video.height <= 0) return null;
  const kx = video.width / viewport.width;
  const ky = video.height / viewport.height;
  const x0 = Math.max(0, Math.round(rect.left * kx));
  const y0 = Math.max(0, Math.round(rect.top * ky));
  const x1 = Math.min(video.width, Math.round((rect.left + rect.width) * kx));
  const y1 = Math.min(video.height, Math.round((rect.top + rect.height) * ky));
  if (x1 - x0 < 2 || y1 - y0 < 2) return null;
  return { sx: x0, sy: y0, sw: x1 - x0, sh: y1 - y0 };
}

/** --reply "flagId=text" arguments of the publish script. */
export function parseReplies(args: string[]): { replies: Record<string, string>; errors: string[] } {
  const replies: Record<string, string> = {};
  const errors: string[] = [];
  for (const a of args) {
    const i = a.indexOf("=");
    const id = i > 0 ? a.slice(0, i).trim() : "";
    if (!isFlagId(id)) {
      errors.push(`--reply "${a.slice(0, 40)}": expected flagId=text`);
      continue;
    }
    replies[id] = cleanComment(a.slice(i + 1), MAX_REPLY);
  }
  return { replies, errors };
}
