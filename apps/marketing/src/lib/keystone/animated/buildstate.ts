// The server build of animated solutions: its two safety switches and today's spend, apart from the job itself
// (serverbuild.ts) so the owner's pages and the status email can read them without loading the job.
// Both switches are read from the environment at call time. No `next/*` imports.
import { ks } from "../db";
import { pacificDay } from "../pipeline/status";

/** "off" makes the "Build with API credits" button only mark the item (the build then runs from the laptop, as before). Default: on. */
export const SERVER_BUILD_ENV = "KEYSTONE_ANIM_SERVER_BUILD";
/** Dollars the server build may spend per day (Pacific): model calls + voice. Default 15. */
export const DAILY_CAP_ENV = "KEYSTONE_ANIM_DAILY_CAP_USD";
export const DEFAULT_DAILY_CAP_USD = 15;

type Env = Record<string, string | undefined>;

export function serverBuildOn(env: Env = process.env): boolean {
  return (env[SERVER_BUILD_ENV] ?? "").trim().toLowerCase() !== "off";
}

/** The daily cap in dollars; anything that is not a number of zero or more counts as the default. */
export function dailyCapUsd(env: Env = process.env): number {
  const raw = (env[DAILY_CAP_ENV] ?? "").trim();
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_DAILY_CAP_USD;
}

/** Dollars the server build has spent since the start of today (Pacific), from the build records. */
export async function spentToday(now: Date = new Date()): Promise<number> {
  const { AnimBuild } = await ks();
  const rows = await AnimBuild.find({ startedAt: { $gte: pacificDay(now).start } }).select("cost").lean();
  return rows.reduce((s, r) => s + (r.cost || 0), 0);
}

export type BuildBudget = { on: boolean; cap: number; spent: number; capReached: boolean };

export async function buildBudget(now: Date = new Date(), env: Env = process.env): Promise<BuildBudget> {
  const cap = dailyCapUsd(env);
  const spent = await spentToday(now);
  return { on: serverBuildOn(env), cap, spent, capReached: spent >= cap };
}
