// The daily status email to Praveen (spec §9). Internal: only he reads it, so flags, run results and
// costs are named as they are. Reads the database; writes nothing (the script writes its own heartbeat
// after a successful send). No model is called. No `next/*` imports: this runs from tsx scripts.
//
// The subject alone is the status: "Keystone: N waiting on you, M in review, K approved".

import { OWNER_LABEL, STAGE_LABEL, STAGE_OWNER, STAGES, VERDICTS, type Role, type Stage } from "../config";
import { ks, type BatchDoc, type Flag, type LessonDoc } from "../db";
import { splitNote } from "../note";
import { lastBeat } from "./heartbeat";
import { redact } from "./models";
import { openSuggestions } from "./outbox";
import { addLocalDays, blockedBatches, inWindow, planRelease, type PlanRow } from "./release";

export type Status = {
  byOwner: { owner: string; rows: { label: string; n: number }[] }[];
  waitingOnPraveen: { itemId: string; why: string }[];
  notSolved: { n: number; dueAt: Date }[];
  releasingToday: number;
  castleRockLastDay: { who: string; what: string; itemId: string; note?: string }[];
  sendBacksOurs: { batch: number; total: number; causes: Record<string, number> };
  cost: { yesterday: number; perItem: number };
  failures: string[];
  suggestions: { subject: string; to: string[] }[];
  /** Batches nothing of which can be released (release.ts blockedBatches): batch = its file name, else its id. */
  blocked: { batch: string; why: string; since?: Date }[];
};

/** Why an item is held, in plain words (also used by the queue page). */
export const FLAG_WORDS: Record<Flag, string> = {
  solvers_split: "The two solvers disagreed; a third settled it",
  second_failure: "Failed a check twice",
  written_response: "Written response: no single right wording",
  type_not_supported: "We cannot read this question type yet",
  no_agreement: "No agreed answer",
  key_confirmed_by_reviewer: "Castle Rock confirmed a key we first disagreed with",
  section_title_unset: "No section name yet for this course",
  step_failed: "A check could not run",
  sample: "Random sample",
  unverified_type: "Question type not yet verified end to end",
  answer_to_confirm: "No key supplied: answer to confirm",
};

export const KEYSTONE_URL = "https://keystone.evelynlearning.com";
export const RELEASE_HEARTBEAT = "keystone-release";
export const STATUS_HEARTBEAT = "keystone-status-email";
export const TIMER_LATE_LINE = "The release timer has not run in the last 2 hours";
const FINISHED_GROUP = "Nobody (finished)";
const CASTLE_ROCK_ROLES: Role[] = ["reviewer", "tech"];
const NOTE_MAX = 200;
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export const itemUrl = (itemId: string) => `${KEYSTONE_URL}/item/${encodeURIComponent(itemId)}`;

/** The plain-word reasons of a held item; flags may be missing on older rows. */
export function whyHeld(flags: readonly string[] | undefined | null): string {
  const list = Array.isArray(flags) ? flags : [];
  if (!list.length) return "Held, no reason recorded";
  return list.map((f) => FLAG_WORDS[f as Flag] ?? f).join(". ");
}

/** Why a held item is held: its flags in words, and pipeline.heldWhy (a hold no flag says, e.g. "no release time"). */
export function heldReason(flags: readonly string[] | undefined | null, heldWhy: string | undefined | null): string {
  const list = Array.isArray(flags) ? flags : [];
  const why = (heldWhy ?? "").trim();
  if (!list.length) return why || whyHeld(list);
  return why ? `${whyHeld(list)}. ${why}` : whyHeld(list);
}

/** A note from Castle Rock as one line of plain text, at most 200 characters. */
export function noteText(body: string | undefined | null): string {
  const plain = splitNote(body).plain;
  return plain.length <= NOTE_MAX ? plain : `${plain.slice(0, NOTE_MAX - 1).trimEnd()}…`;
}

// --- Pacific time (America/Los_Angeles) via Intl ---

const PT = "America/Los_Angeles";
const PT_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: PT, hourCycle: "h23", weekday: "short", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
});
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ptParts(d: Date) {
  const p: Record<string, string> = {};
  for (const x of PT_FMT.formatToParts(d)) p[x.type] = x.value;
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second, wd: WEEKDAYS.indexOf(p.weekday) };
}

function ptOffsetAt(t: number): number {
  const p = ptParts(new Date(t));
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - (t - (((t % 1000) + 1000) % 1000));
}

/** The instant of a Pacific wall time (day overflow normalised). */
function fromPacific(y: number, mo: number, d: number, h = 0, mi = 0): Date {
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  return new Date(wall - ptOffsetAt(wall - ptOffsetAt(wall)));
}

/** "Tue Nov 17, 4:12 pm PT". */
export function pacificTime(d: Date): string {
  const p = ptParts(d);
  const h12 = p.h % 12 === 0 ? 12 : p.h % 12;
  return `${WEEKDAYS[p.wd]} ${MONTHS[p.mo - 1]} ${p.d}, ${h12}:${String(p.mi).padStart(2, "0")} ${p.h < 12 ? "am" : "pm"} PT`;
}

/** The Pacific calendar day containing `d`: [start, end). */
export function pacificDay(d: Date): { start: Date; end: Date } {
  const p = ptParts(d);
  return { start: fromPacific(p.y, p.mo, p.d), end: fromPacific(p.y, p.mo, p.d + 1) };
}

/**
 * Whether a clean solution due at `releaseAt` goes to review before the end of today (Pacific): it is due
 * by then and the release window (Mon–Fri 08:00–17:00 Mountain) is open at some moment between
 * max(now, releaseAt) and the end of the day. Includes items already overdue (e.g. due 16:30 yesterday,
 * released at this morning's opening).
 */
export function goesOutToday(releaseAt: Date, now: Date): boolean {
  const end = pacificDay(now).end.getTime();
  if (releaseAt.getTime() >= end) return false;
  for (let t = Math.max(now.getTime(), releaseAt.getTime()); t < end; t += 15 * 60_000) {
    if (inWindow(new Date(t))) return true;
  }
  return false;
}

/**
 * The release timer is late when it has not beaten in 2 hours while it should be running: `now` is inside
 * the window or within 2 hours after it closed (the window is 9 hours long, so that is
 * inWindow(now) || inWindow(now − 2 h)). Outside that the timer may idle.
 */
export function releaseTimerLate(last: Date | null, now: Date): boolean {
  const due = inWindow(now) || inWindow(new Date(now.getTime() - 2 * HOUR));
  if (!due) return false;
  return !last || now.getTime() - last.getTime() > 2 * HOUR;
}

// --- buildStatus ---

type ItemRow = {
  itemId: string;
  stage: Stage;
  order?: number;
  batchId?: string;
  receivedAt?: Date;
  createdAt?: Date;
  pipeline?: { flags?: string[]; heldFor?: string; heldWhy?: string; releaseAt?: Date };
};

/**
 * Send-backs caused by us, from the lessons (one per send-back, pipeline/run.ts): every cause but "item"
 * (the fault was in the client's item). `batch` = those on items of `latestBatchId`; `total` = all of them;
 * `causes` = the count per cause over the total.
 */
export function countSendBacks(
  lessons: Pick<LessonDoc, "itemId" | "cause">[],
  batchOf: Map<string, string | undefined>,
  latestBatchId: string | undefined,
): Status["sendBacksOurs"] {
  const ours = lessons.filter((l) => l.cause !== "item");
  const causes: Record<string, number> = {};
  for (const l of ours) causes[l.cause] = (causes[l.cause] ?? 0) + 1;
  const batch = latestBatchId ? ours.filter((l) => batchOf.get(l.itemId) === latestBatchId).length : 0;
  return { batch, total: ours.length, causes };
}

/** The lessons, counted per batch: the latest batch by receivedAt. */
export async function sendBacksOurs(items: ItemRow[]): Promise<Status["sendBacksOurs"]> {
  const { Lesson, Batch } = await ks();
  const lessons = await Lesson.find({}, { itemId: 1, cause: 1 }).lean();
  const latest = await Batch.findOne({}, { batchId: 1 }).sort({ receivedAt: -1, _id: -1 }).lean();
  return countSendBacks(lessons, new Map(items.map((i) => [i.itemId, i.batchId])), latest?.batchId);
}

/** The plan states (release.ts planRelease) of an item the release will send to review once its time comes. */
const RELEASES = [/^would release now$/, /^waiting until /, /^due; outside the window/, /^being released by another call$/];

/**
 * How many solutions go to review today: the release plan's rows the release would release (not held as
 * sample, not in a blocked batch, not without a batch, release time or solution row) and due today.
 */
export function goingOutToday(rows: Pick<PlanRow, "releaseAt" | "state">[], now: Date): number {
  return rows.filter((r) => r.releaseAt && RELEASES.some((re) => re.test(r.state)) && goesOutToday(new Date(r.releaseAt), now)).length;
}

// --- secrets in printed errors ---

/** The Resend key values in `env` (the ones this job holds). */
export function secretsOf(env: Record<string, string | undefined>): string[] {
  return [env.KEYSTONE_RESEND_API_KEY, env.RESEND_API_KEY].map((k) => (k ?? "").trim()).filter(Boolean);
}

/** `text` with every given key replaced by "[key]", then the model-key scrub (models.ts redact: model keys, Bearer, sk-…). */
export function scrubSecrets(text: string, keys: readonly string[]): string {
  let out = String(text);
  for (const k of keys) if (k) out = out.split(k).join("[key]");
  return redact(out);
}

/**
 * After the mail went out: records the heartbeat. A failure here is a warning, never an error: the mail was
 * sent, and a failing exit would make cron (or a person) send it again.
 */
export async function afterSent(beatFn: () => Promise<void>, warn: (line: string) => void, keys: readonly string[]): Promise<void> {
  try {
    await beatFn();
  } catch (e) {
    warn(`warning: the status email was sent, but its heartbeat could not be recorded: ${scrubSecrets(e instanceof Error ? e.message : String(e), keys)}`);
  }
}

export async function buildStatus(now: Date): Promise<Status> {
  const { Item, Solution, Activity, Run, User, Batch } = await ks();
  const items = (await Item.find({}, { itemId: 1, stage: 1, order: 1, batchId: 1, receivedAt: 1, createdAt: 1, pipeline: 1 }).lean()) as unknown as ItemRow[];

  // counts by whose move it is
  const count = new Map<Stage, number>();
  for (const i of items) count.set(i.stage, (count.get(i.stage) ?? 0) + 1);
  const owners: (Role | null)[] = ["evelyn", "reviewer", "tech", null];
  const byOwner = owners.map((role) => ({
    owner: role ? OWNER_LABEL[role] : FINISHED_GROUP,
    rows: STAGES.filter((s) => STAGE_OWNER[s] === role).map((s) => ({ label: STAGE_LABEL[s], n: count.get(s) ?? 0 })),
  }));

  const byOrder = (a: ItemRow, b: ItemRow) => (a.order ?? 0) - (b.order ?? 0) || a.itemId.localeCompare(b.itemId);
  const waitingOnPraveen = items
    .filter((i) => i.pipeline?.heldFor === "praveen")
    .sort(byOrder)
    .map((i) => ({ itemId: i.itemId, why: heldReason(i.pipeline?.flags, i.pipeline?.heldWhy) }));

  // received, or drafting with no solution written: grouped by when their 2 days are up
  const drafting = items.filter((i) => i.stage === "drafting").map((i) => i.itemId);
  const withSolution = new Set<string>(drafting.length ? await Solution.distinct("itemId", { itemId: { $in: drafting } }) : []);
  const due = new Map<number, number>();
  for (const i of items) {
    if (i.stage !== "received" && !(i.stage === "drafting" && !withSolution.has(i.itemId))) continue;
    const from = i.receivedAt ?? i.createdAt;
    if (!from) continue;
    const at = addLocalDays(new Date(from), 2).getTime();
    due.set(at, (due.get(at) ?? 0) + 1);
  }
  const notSolved = [...due.entries()].sort((a, b) => a[0] - b[0]).map(([at, n]) => ({ n, dueAt: new Date(at) }));

  // what the release would release (its own read-only plan: the sample it would hold and blocked batches left out), due today
  const releasingToday = goingOutToday((await planRelease(now)).rows, now);

  // Castle Rock in the last day: their verdicts and notes
  const castleRockUsers = (await User.find({ role: { $in: CASTLE_ROCK_ROLES } }, { username: 1 }).lean()).map((u) => u.username);
  const dayAgo = new Date(now.getTime() - DAY);
  const acts = await Activity.find({
    createdAt: { $gt: dayAgo, $lte: now },
    type: { $in: ["verdict", "comment"] },
    $or: [{ role: { $in: CASTLE_ROCK_ROLES } }, { username: { $in: castleRockUsers } }],
  })
    .sort({ createdAt: -1, _id: -1 })
    .lean();
  const castleRockLastDay = acts.map((a) => {
    const what = a.type === "comment" ? "commented on" : a.verdict && a.verdict in VERDICTS ? VERDICTS[a.verdict].verb : `gave the verdict "${a.verdict ?? "?"}" on`;
    const note = a.body ? noteText(a.body) : "";
    return { who: a.name || a.username, what, itemId: a.itemId, ...(note ? { note } : {}) };
  });

  // cost: real runs only; yesterday by each step's time (Pacific day)
  const runs = await Run.find({ dryRun: { $ne: true } }, { itemId: 1, startedAt: 1, cost: 1, "steps.at": 1, "steps.cost": 1 }).lean();
  const today = pacificDay(now);
  const yesterday = pacificDay(new Date(today.start.getTime() - 1));
  const inYesterday = (d?: Date) => !!d && new Date(d) >= yesterday.start && new Date(d) < yesterday.end;
  let costYesterday = 0;
  let costTotal = 0;
  for (const r of runs) {
    const steps = Array.isArray(r.steps) ? (r.steps as { at?: Date; cost?: number }[]) : [];
    costTotal += r.cost || 0;
    if (steps.length) for (const s of steps) costYesterday += inYesterday(s.at) ? s.cost || 0 : 0;
    else if (inYesterday(r.startedAt)) costYesterday += r.cost || 0;
  }
  const runItems = new Set(runs.map((r) => r.itemId)).size;
  const cost = { yesterday: costYesterday, perItem: runItems ? costTotal / runItems : 0 };

  // failures
  const failures: string[] = [];
  const failed = await Run.find(
    { dryRun: { $ne: true }, result: "failed", $or: [{ finishedAt: { $gt: dayAgo } }, { finishedAt: { $exists: false }, startedAt: { $gt: dayAgo } }] },
    { itemId: 1, startedAt: 1, finishedAt: 1, error: 1 },
  )
    .sort({ startedAt: 1 })
    .lean();
  for (const r of failed) {
    const at = r.finishedAt ?? r.startedAt;
    failures.push(`Run failed on item ${r.itemId}${at ? ` (${pacificTime(new Date(at))})` : ""}: ${(r.error || "no error recorded").slice(0, NOTE_MAX)}`);
  }
  const stopped = await Run.find(
    { dryRun: { $ne: true }, result: { $exists: false }, finishedAt: { $exists: false }, startedAt: { $gt: dayAgo, $lte: new Date(now.getTime() - 2 * HOUR) } },
    { itemId: 1, startedAt: 1 },
  )
    .sort({ startedAt: 1 })
    .lean();
  for (const r of stopped) failures.push(`Run on item ${r.itemId} started ${pacificTime(new Date(r.startedAt))} and never finished`);
  if (releaseTimerLate(await lastBeat(RELEASE_HEARTBEAT), now)) failures.push(TIMER_LATE_LINE);

  const suggestions = (await openSuggestions()).map((s) => ({ subject: s.subject, to: [...(s.to ?? [])] }));

  const blockedRows = await blockedBatches();
  const files = new Map(
    (await Batch.find({ batchId: { $in: blockedRows.map((b) => b.batchId) } }, { batchId: 1, filename: 1 }).lean<Pick<BatchDoc, "batchId" | "filename">[]>()).map((b) => [b.batchId, b.filename]),
  );
  const blocked = blockedRows.map((b) => ({ batch: files.get(b.batchId) || b.batchId, why: b.why, ...(b.since ? { since: new Date(b.since) } : {}) }));

  return {
    byOwner,
    waitingOnPraveen,
    notSolved,
    releasingToday,
    castleRockLastDay,
    sendBacksOurs: await sendBacksOurs(items),
    cost,
    failures,
    suggestions,
    blocked,
  };
}

// --- rendering ---

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const money = (n: number) => `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const nameOf = (to: string) => to.charAt(0).toUpperCase() + to.slice(1);
const countOf = (s: Status, stage: Stage) => s.byOwner.flatMap((g) => g.rows).find((r) => r.label === STAGE_LABEL[stage])?.n ?? 0;

export function renderStatusEmail(s: Status, now: Date): { subject: string; html: string; text: string } {
  const subject = `Keystone: ${s.waitingOnPraveen.length} waiting on you, ${countOf(s, "in_review")} in review, ${countOf(s, "approved")} approved`;
  const when = pacificTime(now);
  const t: string[] = [`Keystone status, ${when}`, ""];
  const h: string[] = [];
  const H3 = `style="font-size:15px;margin:18px 0 6px"`;
  const UL = `style="margin:0;padding-left:20px"`;
  const link = (itemId: string) => `<a href="${esc(itemUrl(itemId))}" style="color:#1a56db">${esc(itemId)}</a>`;
  const list = (rows: string[], none: string) => (rows.length ? `<ul ${UL}>${rows.map((r) => `<li style="margin:2px 0">${r}</li>`).join("")}</ul>` : `<p style="margin:0;color:#666">${none}</p>`);

  if (s.failures.length) {
    t.push(`FAILURES (${s.failures.length})`, ...s.failures.map((f) => `- ${f}`), "");
    h.push(
      `<div style="background:#fdecec;border:1px solid #f3b4b4;padding:8px 12px;margin:0 0 12px"><strong style="color:#a11">Failures (${s.failures.length})</strong>${list(s.failures.map(esc), "")}</div>`,
    );
  }

  if (s.blocked.length) {
    const line = (b: Status["blocked"][number]) => `${b.batch}: ${b.why}${b.since ? ` (since ${pacificTime(b.since)})` : ""}`;
    t.push(`BLOCKED BATCHES (${s.blocked.length}): nothing of these is released`, ...s.blocked.map((b) => `- ${line(b)}`), "");
    h.push(`<h3 ${H3}>Blocked batches (${s.blocked.length})</h3><p style="margin:0 0 4px;color:#555">Nothing of these is released.</p>`, list(s.blocked.map((b) => esc(line(b))), ""));
  }

  t.push(`WAITING ON YOU (${s.waitingOnPraveen.length})`);
  t.push(...(s.waitingOnPraveen.length ? s.waitingOnPraveen.flatMap((w) => [`- ${w.itemId}: ${w.why}`, `  ${itemUrl(w.itemId)}`]) : ["- nothing"]), "");
  h.push(`<h3 ${H3}>Waiting on you (${s.waitingOnPraveen.length})</h3>`, list(s.waitingOnPraveen.map((w) => `${link(w.itemId)}: ${esc(w.why)}`), "Nothing."));

  const going = `${plural(s.releasingToday, "solution")} to Castle Rock's review`;
  t.push(`GOING OUT TODAY: ${going}`, "");
  h.push(`<h3 ${H3}>Going out today</h3><p style="margin:0">${esc(going)}</p>`);

  const notSolvedN = s.notSolved.reduce((a, g) => a + g.n, 0);
  const dueLine = (g: Status["notSolved"][number]) => `${plural(g.n, "item")}: 2 days up ${pacificTime(g.dueAt)}${g.dueAt.getTime() <= now.getTime() ? " (overdue)" : ""}`;
  t.push(`NOT SOLVED YET (${notSolvedN})`, ...(s.notSolved.length ? s.notSolved.map((g) => `- ${dueLine(g)}`) : ["- none"]), "");
  h.push(`<h3 ${H3}>Not solved yet (${notSolvedN})</h3>`, list(s.notSolved.map((g) => esc(dueLine(g))), "None."));

  t.push("BY OWNER", ...s.byOwner.map((g) => `${g.owner}: ${g.rows.map((r) => `${r.label} ${r.n}`).join(", ")}`), "");
  h.push(
    `<h3 ${H3}>By owner</h3><table style="border-collapse:collapse;font-size:14px">${s.byOwner
      .map(
        (g) =>
          `<tr><td style="padding:2px 12px 2px 0;vertical-align:top;font-weight:600">${esc(g.owner)}</td><td style="padding:2px 0">${g.rows.map((r) => `${esc(r.label)} <strong>${r.n}</strong>`).join(" &middot; ")}</td></tr>`,
      )
      .join("")}</table>`,
  );

  const crLine = (r: Status["castleRockLastDay"][number]) => `${r.who} ${r.what} ${r.itemId}`;
  t.push(
    `CASTLE ROCK, LAST 24 HOURS (${s.castleRockLastDay.length})`,
    ...(s.castleRockLastDay.length ? s.castleRockLastDay.flatMap((r) => [`- ${crLine(r)}${r.note ? `: "${r.note}"` : ""}`, `  ${itemUrl(r.itemId)}`]) : ["- nothing"]),
    "",
  );
  h.push(
    `<h3 ${H3}>Castle Rock, last 24 hours (${s.castleRockLastDay.length})</h3>`,
    list(
      s.castleRockLastDay.map((r) => `${esc(r.who)} ${esc(r.what)} ${link(r.itemId)}${r.note ? `: <span style="color:#444">&ldquo;${esc(r.note)}&rdquo;</span>` : ""}`),
      "Nothing.",
    ),
  );

  const causes = Object.entries(s.sendBacksOurs.causes).map(([k, n]) => `${k} ${n}`).join(", ");
  const sb = `${s.sendBacksOurs.batch} this batch, ${s.sendBacksOurs.total} in total${causes ? ` (${causes})` : ""}`;
  t.push(`SEND-BACKS CAUSED BY US: ${sb}`, "");
  h.push(`<h3 ${H3}>Send-backs caused by us</h3><p style="margin:0">${esc(sb)}</p>`);

  const sugLine = (g: Status["suggestions"][number]) => `To ${g.to.map(nameOf).join(", ")}: ${g.subject}`;
  t.push(`SUGGESTED EMAILS TO DRAFT (${s.suggestions.length})`, ...(s.suggestions.length ? s.suggestions.map((g) => `- ${sugLine(g)}`) : ["- none"]), "");
  h.push(`<h3 ${H3}>Suggested emails to draft (${s.suggestions.length})</h3>`, list(s.suggestions.map((g) => esc(sugLine(g))), "None."));

  const cost = `yesterday ${money(s.cost.yesterday)}, per item so far ${money(s.cost.perItem)}`;
  t.push(`COST: ${cost}`);
  h.push(`<h3 ${H3}>Cost</h3><p style="margin:0">${esc(cost)}</p>`);

  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.45;color:#111;max-width:640px"><p style="margin:0 0 12px;color:#555">Keystone status, ${esc(when)}</p>${h.join("")}</div>`;
  return { subject, html, text: t.join("\n") };
}

// --- sending (Resend REST) ---

export type SendConfig = { from: string; to: string[]; key: string };
type Env = Record<string, string | undefined>;

/** The send configuration from the environment; refuses a missing value or a sender outside @evelynlearning.com. Never echoes the key. */
export function statusSendConfig(env: Env): SendConfig {
  const to = (env.KEYSTONE_STATUS_TO ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const from = (env.KEYSTONE_STATUS_FROM ?? "").trim();
  const key = (env.KEYSTONE_RESEND_API_KEY || env.RESEND_API_KEY || "").trim();
  const missing = [!to.length && "KEYSTONE_STATUS_TO", !from && "KEYSTONE_STATUS_FROM", !key && "KEYSTONE_RESEND_API_KEY (or RESEND_API_KEY)"].filter(Boolean);
  if (missing.length) throw new Error(`Refusing to send: not set: ${missing.join(", ")}.`);
  const addr = /^[^<>]*<([^<>]+)>$/.exec(from)?.[1]?.trim() ?? from;
  if (!/^[^@\s<>]+@evelynlearning\.com$/i.test(addr)) {
    throw new Error(`Refusing to send: KEYSTONE_STATUS_FROM must be an @evelynlearning.com address (got "${from}"); the two Resend accounts must not be mixed.`);
  }
  return { from, to, key };
}

/** POSTs the email to Resend. Throws on a refusal with the HTTP status and Resend's message (never the key). */
export async function sendStatusEmail(msg: { subject: string; html: string; text: string }, cfg: SendConfig, fetchFn: typeof fetch = fetch): Promise<{ id?: string }> {
  let res: Response;
  try {
    res = await fetchFn("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: cfg.from, to: cfg.to, subject: msg.subject, html: msg.html, text: msg.text }),
    });
  } catch (e) {
    throw new Error(`Resend could not be reached: ${scrubSecrets(e instanceof Error ? e.message : String(e), [cfg.key]).slice(0, 300)}`);
  }
  const body = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`Resend refused the email: HTTP ${res.status} ${scrubSecrets(body, [cfg.key]).slice(0, 300)}`);
  try {
    return { id: (JSON.parse(body) as { id?: string }).id };
  } catch {
    return {};
  }
}
