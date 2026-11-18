// The daily status email to Praveen (spec §9). Internal: only he reads it, so flags, run results and
// costs are named as they are. Reads the database; writes nothing (the script writes its own heartbeat
// after a successful send). No model is called. No `next/*` imports: this runs from tsx scripts.
//
// The subject alone is the status: "Keystone: N waiting on you, M in review, K approved".

import { OWNER_LABEL, STAGE_LABEL, STAGE_OWNER, STAGES, VERDICTS, type Role, type Stage } from "../config";
import { ks, type BatchDoc, type Flag, type ItemDoc, type LessonDoc, type RunDoc } from "../db";
import { splitNote } from "../note";
import { lastBeat } from "./heartbeat";
import { needsOwner } from "./holds";
import { ownWriteState } from "./ownwrite";
import { redact, vendorOfModel } from "./models";
import type { Vendor } from "./types";
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
  /** Always four rows (Anthropic, OpenAI, DeepSeek, Gemini). Only DeepSeek can report a live balance; the rest are estimates. */
  credit: CreditRow[];
  /** About the section as a whole (e.g. steps whose model id is unknown, left out of every vendor's spend). */
  creditNote?: string;
};

export type CreditRow = {
  vendor: Vendor;
  label: string;
  live?: { amount: number; currency: string };
  start?: { amount: number; since: Date };
  spentSince: number;
  estimatedLeft?: number;
  spentYesterday: number;
  note?: string;
  low: boolean;
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
  owner_sent_back: "Sent back by you",
  owner_rewrite: "Rewritten after your note",
  question_resent: "The question was re-sent after our solution went out",
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
  return [env.KEYSTONE_RESEND_API_KEY, env.RESEND_API_KEY, env.SMTP_PASS, env.KEYSTONE_CRON_SECRET].map((k) => (k ?? "").trim()).filter(Boolean);
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

// --- API credit ---

export const CREDIT_VENDORS: { vendor: Vendor; label: string; env: string }[] = [
  { vendor: "anthropic", label: "Anthropic", env: "KEYSTONE_CREDIT_ANTHROPIC" },
  { vendor: "openai", label: "OpenAI", env: "KEYSTONE_CREDIT_OPENAI" },
  { vendor: "deepseek", label: "DeepSeek", env: "KEYSTONE_CREDIT_DEEPSEEK" },
  { vendor: "gemini", label: "Gemini", env: "KEYSTONE_CREDIT_GEMINI" },
];
export const DEEPSEEK_BALANCE_URL = "https://api.deepseek.com/user/balance";
export const DEEPSEEK_TIMEOUT_MS = 10_000;
export const CREDIT_FOOTNOTE =
  "Only DeepSeek reports a live balance. The others are estimates: the starting amount you gave minus what Keystone's recorded runs spent. Dry runs and anything else using the same keys are not counted, so the real balance can be lower.";
const LOW_ABSOLUTE = 2;
const LOW_FRACTION = 0.2;

/** A starting credit `<amount>@<YYYY-MM-DD>` (the balance reported on that Pacific day). Unset: undefined; malformed: { bad: true }. */
export function parseCredit(raw: string | undefined | null): { amount: number; since: Date } | { bad: true } | undefined {
  if (raw === undefined || raw === null || raw.trim() === "") return undefined;
  const m = /^(\d{1,9}(?:\.\d{1,4})?)@(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return { bad: true };
  const [y, mo, d] = [+m[2], +m[3], +m[4]];
  const since = fromPacific(y, mo, d);
  const back = ptParts(since);
  if (back.y !== y || back.mo !== mo || back.d !== d) return { bad: true }; // a day that does not exist (2026-02-31, month 13)
  return { amount: Number(m[1]), since };
}

type StepLike = { at?: Date; cost?: number; model?: string; output?: { solves?: Record<string, { cost?: number; model?: string } | undefined> } | null };
export type CreditRun = { startedAt?: Date; cost?: number; steps?: StepLike[] };

/**
 * One step's cost split by vendor. A solve step records several models in one comma-joined `model` and one total
 * cost: its output keeps each call's own cost and model, which are used when present; without them a multi-model
 * step is split evenly between its models. A cost with no model, or a model no spec knows, is `undefined`.
 */
export function stepShares(step: StepLike): { vendor?: Vendor; cost: number }[] {
  const total = step.cost || 0;
  if (!(total > 0)) return [];
  const calls = Object.values(step.output?.solves ?? {}).filter((c): c is { cost?: number; model?: string } => !!c && typeof c === "object" && (c.cost || 0) > 0);
  if (calls.length && calls.every((c) => typeof c.model === "string" && c.model)) {
    return calls.map((c) => ({ vendor: vendorOfModel(c.model!), cost: c.cost || 0 }));
  }
  const models = (step.model ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  if (!models.length) return [{ cost: total }];
  return models.map((m) => ({ vendor: vendorOfModel(m), cost: total / models.length }));
}

/** Spend per vendor from the (non-dry) runs: since each vendor's start (all time when none), and in `yesterday`. */
export function spendByVendor(
  runs: CreditRun[],
  since: Partial<Record<Vendor, Date>>,
  yesterday: { start: Date; end: Date },
): { spent: Record<Vendor, { since: number; yesterday: number }>; unknownSteps: number } {
  const spent = Object.fromEntries(CREDIT_VENDORS.map((v) => [v.vendor, { since: 0, yesterday: 0 }])) as Record<Vendor, { since: number; yesterday: number }>;
  let unknownSteps = 0;
  for (const r of runs) {
    const steps: StepLike[] = Array.isArray(r.steps) && r.steps.length ? r.steps : [{ at: r.startedAt, cost: r.cost }];
    for (const st of steps) {
      const at = st.at ? new Date(st.at) : r.startedAt ? new Date(r.startedAt) : undefined;
      const shares = stepShares(st);
      if (shares.some((x) => !x.vendor)) unknownSteps++;
      for (const x of shares) {
        if (!x.vendor) continue;
        const from = since[x.vendor];
        if (!from || (at && at >= from)) spent[x.vendor].since += x.cost;
        if (at && at >= yesterday.start && at < yesterday.end) spent[x.vendor].yesterday += x.cost;
      }
    }
  }
  return { spent, unknownSteps };
}

/**
 * Whether a vendor's credit is low: the live balance (else the estimate) is below 20% of the starting amount or below 2
 * (units of its currency), or DeepSeek says its account is not available. The 20% test is made only when the figure is
 * in the starting amount's currency (the start is in dollars). Nothing known: not low.
 */
export function creditLow(a: { live?: { amount: number; currency: string }; start?: { amount: number }; estimatedLeft?: number; unavailable?: boolean }): boolean {
  if (a.unavailable) return true;
  const left = a.live ? a.live.amount : a.estimatedLeft;
  if (left === undefined || !Number.isFinite(left)) return false;
  if (left < LOW_ABSOLUTE) return true;
  const sameCurrency = !a.live || a.live.currency.toUpperCase() === "USD";
  return !!a.start && sameCurrency && left < LOW_FRACTION * a.start.amount;
}

/** DeepSeek's balance reply as a live amount: the USD entry if present, else the first. Throws when the body is not the documented shape. */
export function parseDeepseekBalance(body: unknown): { live?: { amount: number; currency: string }; available: boolean } {
  const b = body as { is_available?: unknown; balance_infos?: unknown } | null;
  if (!b || typeof b !== "object" || typeof b.is_available !== "boolean" || !Array.isArray(b.balance_infos)) throw new Error("unreadable reply");
  const infos = (b.balance_infos as unknown[]).map((x) => {
    const e = x as { currency?: unknown; total_balance?: unknown } | null;
    const amount = Number(e?.total_balance);
    if (!e || typeof e.currency !== "string" || !e.currency || typeof e.total_balance !== "string" || !e.total_balance.trim() || !Number.isFinite(amount)) throw new Error("unreadable reply");
    return { amount, currency: e.currency };
  });
  const pick = infos.find((i) => i.currency.toUpperCase() === "USD") ?? infos[0];
  if (!pick && b.is_available) throw new Error("unreadable reply");
  return { ...(pick ? { live: pick } : {}), available: b.is_available };
}

/** GET the DeepSeek balance (a read) with a 10-second timeout. Throws on any failure; the message never holds the key. */
export async function fetchDeepseekBalance(key: string, fetchFn: typeof fetch = fetch, timeoutMs = DEEPSEEK_TIMEOUT_MS) {
  const ctl = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { ctl.abort(); reject(new Error("timed out")); }, timeoutMs);
  });
  try {
    const work = (async () => {
      const res = await fetchFn(DEEPSEEK_BALANCE_URL, { method: "GET", headers: { Authorization: `Bearer ${key}`, Accept: "application/json" }, signal: ctl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let body: unknown;
      try { body = JSON.parse(await res.text()); } catch { throw new Error("unreadable reply"); }
      return parseDeepseekBalance(body);
    })();
    work.catch(() => {}); // a late failure after the timeout is not an unhandled rejection
    return await Promise.race([work, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** The four credit rows (and a note on the whole section) from the runs. Never throws: a failed balance call is a note on its row. */
export async function buildCredit(
  runs: CreditRun[],
  yesterday: { start: Date; end: Date },
  env: Record<string, string | undefined>,
  fetchFn: typeof fetch = fetch,
  timeoutMs: number = DEEPSEEK_TIMEOUT_MS,
): Promise<{ credit: CreditRow[]; creditNote?: string }> {
  const parsed = CREDIT_VENDORS.map((v) => ({ v, p: parseCredit(env[v.env]) }));
  const since: Partial<Record<Vendor, Date>> = {};
  for (const { v, p } of parsed) if (p && "since" in p) since[v.vendor] = p.since;
  const { spent, unknownSteps } = spendByVendor(runs, since, yesterday);

  let deepseek: Awaited<ReturnType<typeof fetchDeepseekBalance>> | undefined;
  let deepseekNote: string | undefined;
  const dsKey = (env.DEEPSEEK_API_KEY ?? "").trim();
  if (dsKey) {
    try {
      deepseek = await fetchDeepseekBalance(dsKey, fetchFn, timeoutMs);
    } catch (e) {
      deepseekNote = `balance check failed (${scrubSecrets(e instanceof Error ? e.message : String(e), [dsKey]).slice(0, 80)})`;
    }
  }

  const credit = parsed.map(({ v, p }): CreditRow => {
    const start = p && "since" in p ? { amount: p.amount, since: p.since } : undefined;
    const notes: string[] = [];
    if (p && "bad" in p) notes.push(`${v.env} ignored: it must read <amount>@<YYYY-MM-DD>`);
    const live = v.vendor === "deepseek" ? deepseek?.live : undefined;
    if (v.vendor === "deepseek" && deepseekNote) notes.push(deepseekNote);
    const spentSince = spent[v.vendor].since;
    const estimatedLeft = start ? start.amount - spentSince : undefined;
    const low = creditLow({ live, start, estimatedLeft, unavailable: v.vendor === "deepseek" && deepseek?.available === false });
    return {
      vendor: v.vendor, label: v.label, ...(live ? { live } : {}), ...(start ? { start } : {}), spentSince, ...(estimatedLeft !== undefined ? { estimatedLeft } : {}),
      spentYesterday: spent[v.vendor].yesterday, ...(notes.length ? { note: notes.join(". ") } : {}), low,
    };
  });
  return { credit, ...(unknownSteps ? { creditNote: `${plural(unknownSteps, "step")} with an unknown model id not counted` } : {}) };
}

export async function buildStatus(now: Date, opts: { env?: Record<string, string | undefined>; fetchFn?: typeof fetch; deepseekTimeoutMs?: number } = {}): Promise<Status> {
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
    .filter(needsOwner) // pipeline/holds.ts: the queue's two held sections and the top bar count the same items
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
  const creditRuns = (await Run.find(
    { dryRun: { $ne: true } },
    {
      startedAt: 1, cost: 1, "steps.at": 1, "steps.cost": 1, "steps.model": 1,
      ...Object.fromEntries(["solver1", "solver2", "solver3", "compare"].flatMap((k) => [[`steps.output.solves.${k}.cost`, 1], [`steps.output.solves.${k}.model`, 1]])),
    },
  ).lean()) as unknown as CreditRun[];
  const { credit, creditNote } = await buildCredit(creditRuns, yesterday, opts.env ?? process.env, opts.fetchFn, opts.deepseekTimeoutMs);
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
    { itemId: 1, runId: 1, startedAt: 1, intent: 1 },
  )
    .sort({ startedAt: 1 })
    .lean();
  // An unfinished run whose own final write landed (its intent is what the item shows now, by the run's own test)
  // only missed its bookkeeping (the next run finishes it): not a failure.
  const stoppedItems = stopped.length
    ? new Map((await Item.find({ itemId: { $in: stopped.map((r) => r.itemId) } }, { itemId: 1, stage: 1, version: 1, pipeline: 1 }).lean<ItemDoc[]>()).map((i) => [i.itemId, i]))
    : new Map<string, ItemDoc>();
  for (const r of stopped) {
    const cur = stoppedItems.get(r.itemId);
    const intent = (r as RunDoc).intent;
    if (cur && intent) {
      const sol = intent.writing === "ready" || intent.writing === "held" ? await Solution.findOne({ itemId: r.itemId, version: intent.toVersion }, { runId: 1 }).lean() : null;
      if (ownWriteState(r as RunDoc, cur, sol?.runId) === "landed") continue;
    }
    failures.push(`Run on item ${r.itemId} started ${pacificTime(new Date(r.startedAt))} and never finished`);
  }
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
    credit,
    ...(creditNote ? { creditNote } : {}),
  };
}

// --- rendering ---

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const money = (n: number) => `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const nameOf = (to: string) => to.charAt(0).toUpperCase() + to.slice(1);
const pacificDate = (d: Date) => { const p = ptParts(d); return `${MONTHS[p.mo - 1]} ${p.d}`; };
const amountOf = (n: number, currency: string) => (currency.toUpperCase() === "USD" ? money(n) : `${(Number.isFinite(n) ? n : 0).toFixed(2)} ${currency}`);

/** One vendor's credit line, in plain words (no LOW prefix). */
export function creditLine(c: CreditRow): string {
  const since = c.start ? `since ${pacificDate(c.start.since)}` : "in total";
  let line: string;
  if (c.live) line = `${c.label}: ${amountOf(c.live.amount, c.live.currency)} balance (live); Keystone spent ${money(c.spentSince)} ${since}; ${money(c.spentYesterday)} yesterday`;
  else if (c.start) line = `${c.label}: about ${money(Math.max(0, c.estimatedLeft ?? 0))} left (started ${money(c.start.amount)} on ${pacificDate(c.start.since)}; Keystone has spent ${money(c.spentSince)} since; ${money(c.spentYesterday)} yesterday)`;
  else line = `${c.label}: no starting balance on file; Keystone has spent ${money(c.spentSince)} in total; ${money(c.spentYesterday)} yesterday`;
  return `${c.low ? "LOW \u2014 " : ""}${line}${c.note ? `. Note: ${c.note}` : ""}`;
}
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

  const credit = Array.isArray(s.credit) ? s.credit : [];
  const lowVendors = credit.filter((c) => c.low).map((c) => c.label);
  const failures = lowVendors.length ? [...s.failures, `API credit is low: ${lowVendors.join(", ")}`] : s.failures;
  if (failures.length) {
    t.push(`FAILURES (${failures.length})`, ...failures.map((f) => `- ${f}`), "");
    h.push(
      `<div style="background:#fdecec;border:1px solid #f3b4b4;padding:8px 12px;margin:0 0 12px"><strong style="color:#a11">Failures (${failures.length})</strong>${list(failures.map(esc), "")}</div>`,
    );
  }

  if (s.blocked.length) {
    const line = (b: Status["blocked"][number]) => `${b.batch}: ${b.why}${b.since ? ` (since ${pacificTime(b.since)})` : ""}`;
    t.push(`BLOCKED BATCHES (${s.blocked.length}): nothing of these is released`, ...s.blocked.map((b) => `- ${line(b)}`), "");
    h.push(`<h3 ${H3}>Blocked batches (${s.blocked.length})</h3><p style="margin:0 0 4px;color:#555">Nothing of these is released.</p>`, list(s.blocked.map((b) => esc(line(b))), ""));
  }

  if (credit.length) {
    t.push("API CREDIT", ...credit.map((c) => `- ${creditLine(c)}`), ...(s.creditNote ? [`- ${s.creditNote}`] : []), CREDIT_FOOTNOTE, "");
    h.push(
      `<h3 ${H3}>API credit</h3>`,
      list([...credit.map((c) => (c.low ? `<strong style="color:#a11">${esc(creditLine(c))}</strong>` : esc(creditLine(c)))), ...(s.creditNote ? [esc(s.creditNote)] : [])], ""),
      `<p style="margin:6px 0 0;color:#555">${esc(CREDIT_FOOTNOTE)}</p>`,
    );
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

/** `key` set: Resend. `key` empty with `smtp` set: the app's own SMTP account (the one its other mail uses). */
export type SendConfig = { from: string; to: string[]; key: string; smtp?: { host: string; port: number; user: string; pass: string } };
type Env = Record<string, string | undefined>;

/** The send configuration from the environment; refuses a missing value or a sender outside @evelynlearning.com. Never echoes the key. */
export function statusSendConfig(env: Env): SendConfig {
  const to = (env.KEYSTONE_STATUS_TO ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const from = (env.KEYSTONE_STATUS_FROM ?? "").trim();
  const key = (env.KEYSTONE_RESEND_API_KEY || env.RESEND_API_KEY || "").trim();
  // No Resend key: fall back to the app's SMTP account when it is fully configured.
  const smtp = !key && env.SMTP_USER?.trim() && env.SMTP_PASS?.trim()
    ? { host: (env.SMTP_HOST || "smtp.gmail.com").trim(), port: parseInt(env.SMTP_PORT || "587", 10) || 587, user: env.SMTP_USER.trim(), pass: env.SMTP_PASS.trim() }
    : undefined;
  const missing = [!to.length && "KEYSTONE_STATUS_TO", !from && "KEYSTONE_STATUS_FROM", !key && !smtp && "KEYSTONE_RESEND_API_KEY (or RESEND_API_KEY), or SMTP_USER and SMTP_PASS"].filter(Boolean);
  if (missing.length) throw new Error(`Refusing to send: not set: ${missing.join(", ")}.`);
  const addr = /^[^<>]*<([^<>]+)>$/.exec(from)?.[1]?.trim() ?? from;
  if (!/^[^@\s<>]+@evelynlearning\.com$/i.test(addr)) {
    throw new Error(`Refusing to send: KEYSTONE_STATUS_FROM must be an @evelynlearning.com address (got "${from}"); the two Resend accounts must not be mixed.`);
  }
  return { from, to, key, ...(smtp ? { smtp } : {}) };
}

/** Sends through the app's SMTP account. Throws with the server's message (never the password). */
async function sendBySmtp(msg: { subject: string; html: string; text: string }, cfg: SendConfig): Promise<{ id?: string }> {
  const smtp = cfg.smtp!;
  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({ host: smtp.host, port: smtp.port, secure: smtp.port === 465, auth: { user: smtp.user, pass: smtp.pass } });
    const info = await transporter.sendMail({ from: cfg.from, to: cfg.to, subject: msg.subject, html: msg.html, text: msg.text });
    return { id: info.messageId };
  } catch (e) {
    throw new Error(`The mail server refused the email: ${scrubSecrets(e instanceof Error ? e.message : String(e), [smtp.pass]).slice(0, 300)}`);
  }
}

/** POSTs the email to Resend. Throws on a refusal with the HTTP status and Resend's message (never the key). */
export async function sendStatusEmail(msg: { subject: string; html: string; text: string }, cfg: SendConfig, fetchFn: typeof fetch = fetch): Promise<{ id?: string }> {
  if (!cfg.key && cfg.smtp) return sendBySmtp(msg, cfg);
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
