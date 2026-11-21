// Animated solutions built by the server itself: buildQueued() takes the items the owner queued with "Build with
// API credits" (oldest request first) and, one at a time, authors each (model calls), records the voice, builds
// the page, checks it at three screen sizes when a browser is installed, and publishes it as the item's next
// version for the owner's review. Started by the button's server action (after the response) and by the hourly
// cron route as a safety net.
//
// One build at a time across processes (a database lock, renewed between stages). Where each item stands is
// written on the item (item.animate.build) for the owner's list. An item that fails is moved to the by-hand route
// with the reason, so it is never retried in a loop; a build cut short by a server restart is retried once.
// Money: live model calls are lifted for this job only (deps, not KEYSTONE_PIPELINE_LIVE), and a daily cap stops
// new items once reached (buildstate.ts). No `next/*` imports: the tests run it with fakes for model, voice and
// screen check.
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { DATA_DIR } from "../assets";
import { KEYSTONE_DB } from "../config";
import { ks, type AnimateBuild, type ItemDoc } from "../db";
import { animatedDir } from "../animreview/files";
import { planPublish, queuedFor, recordPublish } from "../animreview/store";
import { hasKeyFor, redact } from "../pipeline/models";
import { acquireLock, releaseLock, renewLock } from "../pipeline/release";
import { shownImages } from "../pipeline/intake";
import { authorItem, checkAuthored, pickExamples, type AuthorDeps, type AuthoredFiles } from "./author";
import { readBeside } from "./build";
import { dailyCapUsd, serverBuildOn, spentToday } from "./buildstate";
import { buildToFolder, placeBuilt } from "./output";
import { fakeVoiceFetch, fakeVoiceOn, ffmpegAvailable, recordItem, silentEncode, VOICE_USD_PER_CHAR, type FetchLike } from "./record";
import { screenCheck as realScreenCheck, type ScreenCheck } from "./screencheck";
import { AUTHORABLE_STAGES, authorInputFor, houseRules, loadExamples, readQuestionAssets, safeName, writeSource, writtenFile } from "./source";

export const BUILD_LOCK = "keystone-anim-build";
export const BUILD_LOCK_TTL_MS = 30 * 60 * 1000;
/** The name on the animations row of a version the server built. */
export const BUILT_BY = "pipeline";
export const SCREEN_CHECK_NOT_RUN = "Screen-size check not run";
const HEIGHT = 1100;

type Env = Record<string, string | undefined>;

/** Where the server build keeps its files, under the data folder (outside the deployed app). */
export const buildDirs = (dataDir: string = DATA_DIR) => ({
  /** Finished items the operator syncs from the laptop: <id>/{spec.json, figure.svg, written.md, board.js?}; playbook.md beside them. */
  examples: path.join(dataDir, "animated-examples"),
  /** The source of each item the server authored: <id>/…; a draft that failed its checks is under _failed/<id>/. */
  src: path.join(dataDir, "animated-src"),
  /** The built page of each item before it is published. */
  out: path.join(dataDir, "animated-out"),
  /** The question's own images. */
  assets: path.join(dataDir, "assets"),
});

export type Voice = {
  /** Why the voice cannot be recorded here (no key, no ffmpeg), or null. Asked before any money is spent. */
  ready(): Promise<string | null>;
  /** Records every step of the item in `srcDir` (audio/step-N.mp3 + timing.json). Throws when it cannot. */
  record(srcDir: string, log: (line: string) => void): Promise<{ chars: number; cost: number; notes: string[] }>;
};

export type BuildDeps = {
  now?: () => Date;
  env?: Env;
  /** The model behind authorItem. Default: the real one, with live calls lifted for this job. Tests pass a fake. */
  model?: AuthorDeps["model"];
  voice?: Voice;
  screenCheck?: (outDir: string) => Promise<ScreenCheck>;
  log?: (line: string) => void;
  lockTtlMs?: number;
};

export type BuildReport =
  /** KEYSTONE_ANIM_SERVER_BUILD=off: nothing looked at. */
  | { status: "off" }
  /** Another build holds the lock: what is queued waits for it. */
  | { status: "busy" }
  | { status: "done"; built: string[]; failed: { itemId: string; reason: string }[]; capReached: boolean; waiting: string[] };

/** The real voice, or the silent stand-in when the test switch is on AND the database is a `_smoke` one. */
export function defaultVoice(env: Env = process.env, dbName: string = KEYSTONE_DB): Voice {
  if (fakeVoiceOn(env, dbName)) {
    return {
      ready: async () => null,
      record: async (srcDir, log) => {
        const r = await recordItem(srcDir, { live: true, force: true, apiKey: "stand-in", fetch: fakeVoiceFetch(), encode: silentEncode, log });
        return { chars: r.charsBilled, cost: 0, notes: ["Silent stand-in voice (test run)", ...r.notes] };
      },
    };
  }
  return {
    ready: async () => {
      if (!env.CARTESIA_API_KEY) return "The voice key is not set on the server (CARTESIA_API_KEY).";
      if (!(await ffmpegAvailable())) return "ffmpeg is not installed on the server (it turns the recorded voice into mp3 clips).";
      return null;
    },
    record: async (srcDir, log) => {
      const r = await recordItem(srcDir, { live: true, apiKey: env.CARTESIA_API_KEY, fetch: globalThis.fetch as unknown as FetchLike, log });
      return { chars: r.charsBilled, cost: r.charsBilled * VOICE_USD_PER_CHAR, notes: r.notes };
    },
  };
}

class BuildFailure extends Error {}
/** The item is no longer ours to build (the owner changed the choice, or the lock was lost): stop without a verdict. */
class Dropped extends Error {}

const short = (s: string, n = 220) => {
  const t = redact(s).replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

type Authored = { solutionVersion: number; cost: number; corrections: number; at: string };

/** A source folder this job authored earlier for the same solution version, still passing today's checks: reused, not paid for twice. */
function reusable(srcDir: string, solutionVersion: number, check: (files: { spec: unknown; svg: string; boardJs?: string }) => string[]): { corrections: number } | null {
  try {
    const mark = JSON.parse(readFileSync(path.join(srcDir, "authored.json"), "utf8")) as Authored;
    if (mark.solutionVersion !== solutionVersion) return null;
    const spec = JSON.parse(readFileSync(path.join(srcDir, "spec.json"), "utf8")) as unknown;
    const svg = readFileSync(path.join(srcDir, "figure.svg"), "utf8");
    const boardJs = existsSync(path.join(srcDir, "board.js")) ? readFileSync(path.join(srcDir, "board.js"), "utf8") : undefined;
    return check({ spec, svg, boardJs }).length ? null : { corrections: mark.corrections || 0 };
  } catch {
    return null;
  }
}

/**
 * Builds what is queued. Never throws for an item's problem (the item is failed with the reason); the report says
 * what happened. Safe to call at any time and from several places: a call that finds a build running returns
 * "busy" and the running build picks up what was queued meanwhile.
 */
export async function buildQueued(deps: BuildDeps = {}, round = 0): Promise<BuildReport> {
  const env = deps.env ?? process.env;
  if (!serverBuildOn(env)) return { status: "off" };
  const now = deps.now ?? (() => new Date());
  const log = deps.log ?? ((line: string) => console.log(`[keystone animated build] ${line}`));
  const ttl = deps.lockTtlMs ?? BUILD_LOCK_TTL_MS;
  const owner = randomUUID();
  if (!(await acquireLock(BUILD_LOCK, owner, now(), ttl))) {
    log("another build holds the lock; what is queued waits for it");
    return { status: "busy" };
  }

  const built: string[] = [];
  const failed: { itemId: string; reason: string }[] = [];
  let waiting: string[] = [];
  let capReached = false;
  try {
    const seen = new Set<string>();
    const cap = dailyCapUsd(env);
    for (;;) {
      // Read again after every item: a second press while this runs only queues, and is picked up here.
      const next = (await queuedFor("api")).filter((id) => !seen.has(id));
      if (!next.length) break;
      const spent = await spentToday(now());
      if (spent >= cap) {
        capReached = true;
        waiting = next;
        log(`daily cap reached ($${spent.toFixed(2)} of $${cap}): ${next.length} item(s) stay queued`);
        break;
      }
      const itemId = next[0];
      seen.add(itemId);
      const r = await buildOne(itemId, { ...deps, env, now, log, ttl, owner });
      if (r.result === "built") built.push(itemId);
      else if (r.result === "failed") failed.push({ itemId, reason: r.reason });
    }
  } finally {
    await releaseLock(BUILD_LOCK, owner);
  }
  // An item queued between the last read and the release would otherwise wait for the hourly safety net.
  if (!capReached && round < 2 && built.length + failed.length > 0 && (await pendingFresh()).length) {
    const more = await buildQueued(deps, round + 1);
    if (more.status === "done") return { status: "done", built: [...built, ...more.built], failed: [...failed, ...more.failed], capReached: more.capReached, waiting: more.waiting };
  }
  return { status: "done", built, failed, capReached, waiting };
}

/** Queued items no build has started on. */
async function pendingFresh(): Promise<string[]> {
  const ids = await queuedFor("api");
  if (!ids.length) return [];
  const { Item } = await ks();
  const rows = await Item.find({ itemId: { $in: ids } }).select("itemId animate").lean();
  return rows.filter((i) => i.animate?.build?.state !== "building").map((i) => i.itemId);
}

type OneCtx = BuildDeps & { env: Env; now: () => Date; log: (line: string) => void; ttl: number; owner: string };
type OneResult = { result: "built" } | { result: "failed"; reason: string } | { result: "skipped" };

async function buildOne(itemId: string, ctx: OneCtx): Promise<OneResult> {
  const { Item, Solution, Animation, AnimBuild } = await ks();
  const { now, log, env } = ctx;
  const item = await Item.findOne({ itemId }).lean<ItemDoc>();
  if (!item || item.animate?.route !== "api") return { result: "skipped" };
  const prev: AnimateBuild | undefined = item.animate.build;
  const startedAt = now();
  let cost = 0;
  let modelCost = 0;
  let voiceChars = 0;
  let corrections = 0;
  const total = () => (prev?.cost ?? 0) + cost;

  /** Failed: the reason on the item, the item moved to the by-hand route (only while it is still queued for the API). */
  const fail = async (reason: string, row?: { _id: unknown }): Promise<OneResult> => {
    const why = short(reason);
    log(`item ${itemId}: FAILED: ${why}`);
    const finishedAt = now();
    await Item.updateOne(
      { itemId, "animate.route": "api" },
      { $set: { "animate.route": "hand", "animate.build": { state: "failed", startedAt: prev?.state === "building" ? prev.startedAt ?? startedAt : startedAt, finishedAt, failure: why, cost: total(), corrections, attempts: prev?.attempts ?? 1 } } },
    );
    if (row) await AnimBuild.updateOne({ _id: row._id }, { $set: { finishedAt, result: "failed", failure: why, cost, modelCost, voiceChars, corrections } });
    return { result: "failed", reason: why };
  };

  // A build cut short (the server restarted while it ran) is retried once; one that is still inside the lock's
  // lifetime may be running elsewhere and is left alone.
  let attempts = 1;
  if (prev?.state === "building") {
    const age = startedAt.getTime() - new Date(prev.startedAt ?? 0).getTime();
    if (age < ctx.ttl) return { result: "skipped" };
    if ((prev.attempts ?? 1) >= 2) return fail("The build was interrupted twice (the server restarted while it ran).");
    attempts = (prev.attempts ?? 1) + 1;
    log(`item ${itemId}: the last build was interrupted; trying once more`);
  }

  const claimed = await Item.updateOne({ itemId, "animate.route": "api" }, { $set: { "animate.build": { state: "building", startedAt, attempts, cost: prev?.cost ?? 0 } } });
  if (!claimed.matchedCount) return { result: "skipped" };
  const row = await AnimBuild.create({ itemId, startedAt, cost: 0 });
  const spend = () => AnimBuild.updateOne({ _id: row._id }, { $set: { cost, modelCost, voiceChars, corrections } });
  /** Between stages: keep the lock, and stop if it is no longer ours. */
  const keep = async () => {
    if (!(await renewLock(BUILD_LOCK, ctx.owner, now(), ctx.ttl))) throw new Dropped("the build lock was lost");
  };
  log(`item ${itemId}: building (attempt ${attempts})`);

  try {
    const dirs = buildDirs();
    if (!AUTHORABLE_STAGES.includes(item.stage)) throw new BuildFailure(`The item is at stage "${item.stage}": only a written solution that is ready, in review or approved is animated.`);
    const sol = await Solution.findOne({ itemId }).sort({ version: -1 }).lean<{ version: number; sections: { kind: string; md: string }[] }>();
    if (!sol?.sections?.length) throw new BuildFailure("The item has no written solution.");
    if (!item.evelynAnswer?.trim()) throw new BuildFailure("The item has no approved answer.");

    // Everything that can be known before money is spent.
    const itemAssets = path.join(dirs.assets, safeName(itemId));
    const { assets, missing } = readQuestionAssets(itemAssets, shownImages(item));
    if (missing.length) throw new BuildFailure(`The question's image(s) could not be read on the server: ${missing.join(", ")}.`);
    const sections = sol.sections.map((s) => ({ kind: s.kind, md: s.md }));
    const input = authorInputFor(item, sections, assets);
    const examples = loadExamples(dirs.examples);
    if (!pickExamples(input, examples).length) throw new BuildFailure(`There are no finished examples on the server to author from (${dirs.examples} is ${examples.length ? "without a usable example" : "empty or missing"}). Sync the examples folder, then queue the item again.`);
    const voice = ctx.voice ?? defaultVoice(env);
    const notReady = await voice.ready();
    if (notReady) throw new BuildFailure(notReady);
    if (!ctx.model && !hasKeyFor("animator", env)) throw new BuildFailure("The model key is not set on the server (ANTHROPIC_API_KEY).");

    // --- author (or take up the source an interrupted build already paid for) ---
    const srcDir = path.join(dirs.src, safeName(itemId));
    const authorDeps: AuthorDeps = { guide: readBeside("AUTHORING.md"), rules: houseRules(path.join(dirs.examples, "playbook.md"), { wholeWithoutParts: true }), examples, model: ctx.model, modelDeps: { fetch: globalThis.fetch }, playerJs: readBeside("player.js"), playerCss: readBeside("player.css") };
    const again = reusable(srcDir, sol.version, (files) => checkAuthored(input, files, authorDeps).findings);
    if (again) {
      corrections = again.corrections;
      log(`item ${itemId}: source already authored for solution v${sol.version}; not authored again`);
    } else {
      const r = await authorItem(input, authorDeps);
      modelCost = r.cost;
      cost += r.cost;
      corrections = r.corrections;
      await spend();
      const written = writtenFile(item, sol.version, sections);
      if (r.result === "failed") {
        const draft = path.join(dirs.src, "_failed", safeName(itemId));
        if (r.files) writeSource(draft, r.files as AuthoredFiles, written, assets, itemAssets, { clean: true });
        mkdirSync(draft, { recursive: true });
        writeFileSync(path.join(draft, "findings.txt"), `${r.findings.join("\n")}\n`);
        const more = r.findings.length > 1 ? ` (and ${r.findings.length - 1} more)` : "";
        throw new BuildFailure(r.calls.length > 1 ? `The author's work still failed its checks after one correction: ${short(r.findings[0] ?? "", 130)}${more}` : `The author could not be reached or gave no usable reply: ${short(r.findings[0] ?? "", 130)}`);
      }
      writeSource(srcDir, r.files!, written, assets, itemAssets, { clean: true });
      writeFileSync(path.join(srcDir, "authored.json"), `${JSON.stringify({ solutionVersion: sol.version, cost: r.cost, corrections: r.corrections, at: now().toISOString() } satisfies Authored)}\n`);
      log(`item ${itemId}: authored (${r.result}, $${r.cost.toFixed(2)})`);
    }
    await keep();

    // --- voice ---
    let voiceNotes: string[] = [];
    try {
      const v = await voice.record(srcDir, () => {});
      voiceChars = v.chars;
      cost += v.cost;
      voiceNotes = v.notes;
      await spend();
    } catch (e) {
      throw new BuildFailure(`The voice could not be recorded: ${(e as Error).message}`);
    }
    await keep();

    // --- build ---
    const outDir = path.join(dirs.out, safeName(itemId));
    rmSync(outDir, { recursive: true, force: true });
    const b = buildToFolder(srcDir, outDir);
    if (b.failures.length) throw new BuildFailure(`The built page failed its checks: ${short(b.failures[0], 130)}${b.failures.length > 1 ? ` (and ${b.failures.length - 1} more)` : ""}`);
    if (b.clips !== b.spec.steps.length) throw new BuildFailure(`Only ${b.clips} of ${b.spec.steps.length} voice clips were recorded.`);

    // --- screen check: must pass when there is a browser; without one the version says so ---
    const check = await (ctx.screenCheck ?? ((dir: string) => realScreenCheck(dir)))(outDir);
    if (check.status === "failed") throw new BuildFailure(`The screen-size check found ${check.fails.length} problem(s): ${short(check.fails[0] ?? "", 130)}`);
    if (check.status === "unavailable") log(`item ${itemId}: screen-size check not run (${check.why})`);
    await keep();

    // --- publish for the owner's review ---
    const still = await Item.findOne({ itemId }).select("animate").lean();
    if (still?.animate?.route !== "api" || (await Animation.exists({ itemId }))) throw new Dropped("the owner changed the choice, or the item got an animation meanwhile");
    const plan = await planPublish({ itemId, addresses: [], replies: {} });
    if (plan.errors.length) throw new BuildFailure(`The version could not be published: ${plan.errors.join("; ")}`);
    const dest = animatedDir(itemId, plan.version);
    await rm(dest, { recursive: true, force: true }); // never a row for it (checked above): what an interrupted publish left
    await placeBuilt(outDir, dest);
    const notes = ["Built with API credits", ...(check.status === "unavailable" ? [SCREEN_CHECK_NOT_RUN] : []), ...voiceNotes].join(". ");
    const pub = await recordPublish({ itemId, height: HEIGHT, voice: b.spec.voice, notes, addresses: [], replies: {}, createdBy: BUILT_BY }, plan.version).catch((e) => ({ error: (e as Error).message }));
    if ("error" in pub) {
      await rm(dest, { recursive: true, force: true });
      throw new BuildFailure(`The version could not be published: ${pub.error}`);
    }
    const finishedAt = now();
    await Item.updateOne({ itemId }, { $set: { "animate.build": { state: "built", startedAt, finishedAt, cost: total(), corrections, attempts } } });
    await AnimBuild.updateOne({ _id: row._id }, { $set: { finishedAt, result: "built", cost, modelCost, voiceChars, corrections, version: plan.version } });
    log(`item ${itemId}: built and published as v${plan.version} ($${cost.toFixed(2)}, ${Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000)} s)`);
    return { result: "built" };
  } catch (e) {
    if (e instanceof Dropped) {
      log(`item ${itemId}: stopped (${e.message})`);
      await AnimBuild.updateOne({ _id: row._id }, { $set: { finishedAt: now(), result: "dropped", failure: short(e.message), cost, modelCost, voiceChars, corrections } });
      return { result: "skipped" };
    }
    return fail(e instanceof BuildFailure ? e.message : `The build stopped on an error: ${(e as Error).message}`, row);
  }
}
