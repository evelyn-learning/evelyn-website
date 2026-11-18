// The two scheduled jobs, in one place: the hourly timed release and the daily status email. Used by BOTH the
// scripts (scripts/keystone-release.ts, scripts/keystone-status-email.ts, run by hand with tsx) and the internal
// API routes the server's cron calls (src/app/api/keystone/cron/*), so the two can never drift.
// Internal: only Praveen and the cron log read what these return. No `next/*` imports.

import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { beat, lastBeat } from "./heartbeat";
import { acquireLock, blockedBatches, inWindow, mountain, releaseDueReport, releaseLock, type BlockedBatch } from "./release";
import { STATUS_HEARTBEAT, afterSent, buildStatus, pacificDay, renderStatusEmail, secretsOf, sendStatusEmail, statusSendConfig } from "./status";

export const RELEASE_LOCK = "keystone-release";
export const RELEASE_LOCK_TTL_MS = 30 * 60 * 1000;
export const RELEASE_HEARTBEAT_NAME = "keystone-release";

export type ReleaseJobResult =
  | { status: "busy" }
  | { status: "done"; inWindow: boolean; released: string[]; sampled: string[]; heldUnbatched: string[]; heldNoTime: string[]; blocked: BlockedBatch[] };

/**
 * One writing run of the timed release: takes the job's lock (a second caller finds it held: "busy", nothing
 * done), runs releaseDueReport, releases the lock, records the heartbeat. `log` gets the same lines the script
 * has always printed.
 */
export async function releaseJob(now: Date = new Date(), log: (line: string) => void = () => {}): Promise<ReleaseJobResult> {
  const blockedLine = (b: BlockedBatch) => log(`blocked: batch ${b.batchId}: ${b.why}${b.since ? ` (since ${mountain(b.since)})` : ""}`);
  const owner = randomUUID();
  if (!(await acquireLock(RELEASE_LOCK, owner, new Date(), RELEASE_LOCK_TTL_MS))) {
    log("release: another release run holds the lock; nothing done");
    await beat(RELEASE_HEARTBEAT_NAME);
    return { status: "busy" };
  }
  let out: ReleaseJobResult;
  try {
    const r = await releaseDueReport(now);
    if (r.released.length) log(`released: ${r.released.join(", ")}`);
    if (r.sampled.length) log(`held as sample: ${r.sampled.join(", ")}`);
    if (r.heldUnbatched.length) log(`held as sample (no batch): ${r.heldUnbatched.join(", ")}`);
    if (r.heldNoTime.length) log(`held for Praveen (no release time): ${r.heldNoTime.join(", ")}`);
    // Outside the window nothing is evaluated or written: the recorded blocks are reported instead.
    const open = inWindow(now);
    const blocked = open ? r.blocked : await blockedBatches();
    for (const b of blocked) blockedLine(b);
    log(`release: ${r.released.length} released, ${r.sampled.length + r.heldUnbatched.length} held as sample, ${blocked.length} batch(es) blocked${open ? "" : " (outside the window)"} at ${mountain(now)} Mountain time`);
    out = { status: "done", inWindow: open, released: r.released, sampled: r.sampled, heldUnbatched: r.heldUnbatched, heldNoTime: r.heldNoTime, blocked };
  } finally {
    await releaseLock(RELEASE_LOCK, owner);
  }
  await beat(RELEASE_HEARTBEAT_NAME);
  return out;
}

const PT_HOUR = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hourCycle: "h23", hour: "2-digit" });
/** The hour of the day in Los Angeles (0–23). */
export const pacificHour = (d: Date) => Number(PT_HOUR.format(d)) % 24;

export type StatusJobResult =
  | { status: "printed"; subject: string; text: string }
  | { status: "skipped"; why: string }
  | { status: "sent"; subject: string; to: string[]; id?: string; warning?: string };

/**
 * The daily status email.
 *   print: builds and renders it and returns it. Calls NO write function (buildStatus and renderStatusEmail only
 *     read), sends nothing and records no heartbeat: on the web app's connection, which is not read-only, this is
 *     what keeps a print read-only.
 *   otherwise: the send configuration is checked first (statusSendConfig: refuses a missing value or a sender
 *     outside @evelynlearning.com); with `onlyAtPacificHour` (the cron route: 7) it sends only when it is that hour
 *     in Los Angeles and not already today (the heartbeat of a successful send), so cron can call it at both
 *     14:00 and 15:00 UTC across the clock change; sends through Resend, then records the heartbeat (a failure
 *     there is a warning, never an error: a failing job would get the mail sent twice).
 */
export async function statusEmailJob(opts: {
  now?: Date;
  print?: boolean;
  env?: Record<string, string | undefined>;
  fetchFn?: typeof fetch;
  /** The fetch for the DeepSeek balance read (the status email's API credit section); default the real one. */
  creditFetch?: typeof fetch;
  onlyAtPacificHour?: number;
}): Promise<StatusJobResult> {
  const now = opts.now ?? new Date();
  const env = opts.env ?? process.env;
  if (opts.print) {
    const email = renderStatusEmail(await buildStatus(now, { env, fetchFn: opts.creditFetch }), now);
    return { status: "printed", subject: email.subject, text: email.text };
  }
  // Checked before reading anything: a send that cannot happen does not touch the database.
  const cfg = statusSendConfig(env);
  if (opts.onlyAtPacificHour !== undefined) {
    if (pacificHour(now) !== opts.onlyAtPacificHour) return { status: "skipped", why: `not ${opts.onlyAtPacificHour}:00 in Los Angeles` };
    const last = await lastBeat(STATUS_HEARTBEAT);
    if (last && last.getTime() >= pacificDay(now).start.getTime()) return { status: "skipped", why: "already sent today" };
  }
  const email = renderStatusEmail(await buildStatus(now, { env, fetchFn: opts.creditFetch }), now);
  const res = await sendStatusEmail(email, cfg, opts.fetchFn);
  let warning: string | undefined;
  await afterSent(() => beat(STATUS_HEARTBEAT, now), (w) => { warning = w; }, secretsOf(env));
  return { status: "sent", subject: email.subject, to: cfg.to, ...(res.id ? { id: res.id } : {}), ...(warning ? { warning } : {}) };
}

// --- the cron routes' gate ---

/** The shortest secret the cron routes accept: anything shorter is treated as not configured. */
export const CRON_SECRET_MIN = 24;
export const CRON_HEADER = "x-keystone-cron";

const digest = (s: string) => createHash("sha256").update(s, "utf8").digest();

/**
 * Whether a cron request may run: "unconfigured" when KEYSTONE_CRON_SECRET is unset or shorter than
 * CRON_SECRET_MIN (fail closed), "denied" when the header is missing or wrong (constant-time comparison of
 * digests, so neither the value nor its length leaks), else "ok". No user session is ever consulted.
 */
export function cronGate(headerValue: string | null, secret: string | undefined): "ok" | "denied" | "unconfigured" {
  const s = (secret ?? "").trim();
  if (s.length < CRON_SECRET_MIN) return "unconfigured";
  const given = headerValue ?? "";
  return timingSafeEqual(digest(given), digest(s)) && given.length > 0 ? "ok" : "denied";
}
