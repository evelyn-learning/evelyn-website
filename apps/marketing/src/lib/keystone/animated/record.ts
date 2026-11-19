/**
 * Voice recording for Keystone animated solutions (Task 3 of
 * docs/superpowers/plans/2026-11-18-keystone-animated-solutions.md).
 *
 * One Cartesia request per step: POST /tts/sse with add_timestamps, which
 * returns raw PCM chunks AND word timestamps from the same generation (the
 * timestamps endpoint cannot return mp3: SSE output_format is container "raw"
 * only; checked again 2026-11-18 for the server build: /tts/sse and the
 * WebSocket take container "raw" only, and /tts/bytes, which can return mp3,
 * has no timestamps — so ffmpeg stays). The PCM (s16le, 44.1 kHz mono — the format of the October prototype
 * clips) is encoded to `audio/step-N.mp3` with ffmpeg (96 kbps, as October),
 * and the word stream is aligned to the step's lines to give one start (ms)
 * per line in `timing.json`.
 *
 * Docs read 2026-11-18: https://docs.cartesia.ai/api-reference/tts/sse ,
 * https://docs.cartesia.ai/api-reference/tts/bytes ,
 * https://docs.cartesia.ai/use-the-api/api-conventions
 *   - Cartesia-Version 2026-08-14 (the only value those pages allow; the tutor
 *     still sends 2026-03-01 — override with CARTESIA_VERSION if needed)
 *   - Authorization: Bearer <key> (the tutor sends X-API-Key; docs say Bearer)
 *   - model sonic-3.6 (docs default; also the tutor default, CARTESIA_TTS_MODEL
 *     overrides like the tutor)
 *   - timestamps event: { type:"timestamps", word_timestamps:{ words, start, end } } in SECONDS
 *
 * Nothing here runs the network unless `recordItem` is called with live:true
 * and a fetch; tests pass a fake fetch.
 */
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { appendFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { upgradeRetiredCartesiaVoice } from "@core/voice/cartesia-voice-registry";

export const CARTESIA_SSE_URL = "https://api.cartesia.ai/tts/sse";
export const CARTESIA_VERSION = process.env.CARTESIA_VERSION || "2026-08-14";
export const CARTESIA_MODEL = process.env.CARTESIA_TTS_MODEL || "sonic-3.6";
export const SAMPLE_RATE = 44100;
export const MP3_BITRATE = "96k";

/**
 * Display name (spec.voice) → Cartesia voice id. Same ids as the academy's
 * portal teachers (academy apps/api/src/scripts/seed-teachers.ts), which the
 * October prototypes used (narration.json, per the Castle Rock notes); also
 * listed in apps/tutor/src/lib/tutor/voice/elevenlabs-voice-map.ts and
 * apps/marketing/scripts/promo-academy/v3/vo-script.json (Mr. Joseph).
 */
export const VOICES: Readonly<Record<string, string>> = {
  "Mr. Joseph": "7d444628-dd13-442b-b687-71a6baf0c07e", // Physics, Mathematics
  "Ms. Michelle": "d7bf7d75-64b7-4c1e-86c0-79d647366587", // Biology, Chemistry
};

export interface RecLine { say: string; speak?: string }
export interface RecStep { title?: string; lines: RecLine[] }
export interface RecSpec { itemId?: string; voice: string; steps: RecStep[] }
export interface TimedWord { text: string; startMs: number; endMs: number }
export interface StepTiming {
  file: string;
  durationMs: number;
  starts: number[];
  /** sha256 of model + voice + transcript; unchanged → the step is skipped. */
  hash: string;
  chars: number;
  timing: "aligned" | "proportional";
}
export interface TimingFile {
  model?: string;
  voice?: string;
  voiceId?: string;
  recordedAt?: string;
  /** Index = step - 1. null = that step has not been recorded yet. */
  steps: (StepTiming | null)[];
}

// ---------- pure text helpers ----------

/** The text sent to the voice for one caption line. */
export function speakText(line: RecLine): string {
  const s = (line.speak ?? "").trim();
  return (s || line.say || "").replace(/\s+/g, " ").trim();
}

/** The whole transcript of a step: its lines' speak text, one space apart. */
export function stepText(step: RecStep): string {
  return step.lines.map(speakText).filter(Boolean).join(" ");
}

/** Characters Cartesia bills for a transcript. */
export function charCount(text: string): number {
  return [...text].length;
}

export function voiceIdFor(voice: string): string {
  const id = VOICES[voice];
  if (!id) throw new Error(`No Cartesia voice id for "${voice}" (known: ${Object.keys(VOICES).join(", ")}).`);
  return upgradeRetiredCartesiaVoice(id);
}

export function stepHash(model: string, voiceId: string, transcript: string): string {
  return createHash("sha256").update(`${model}\n${voiceId}\n${transcript}`).digest("hex").slice(0, 16);
}

/** Lower-case alphanumeric tokens; "8.3 m/s," → ["8","3","m","s"], "it's" → ["its"]. */
export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** One start per line, by each line's share of the step's characters. */
export function proportionalStarts(lines: RecLine[], durationMs: number): number[] {
  const lens = lines.map((l) => Math.max(1, charCount(speakText(l))));
  const total = lens.reduce((a, b) => a + b, 0);
  const starts: number[] = [];
  let acc = 0;
  for (const n of lens) {
    starts.push(Math.round((acc / total) * durationMs));
    acc += n;
  }
  return starts;
}

export interface StartsResult { starts: number[]; method: "aligned" | "proportional"; note?: string }

/**
 * One start (ms) per line, by aligning the timestamp word stream to the lines'
 * words (edit-distance alignment, so number expansion — "8.3" spoken as
 * "eight point three" — and punctuation differences only cost a few edits).
 * Falls back to proportional-by-length inside the step when the alignment is
 * poor, and says why in `note`.
 */
export function startsFromTimestamps(lines: RecLine[], words: TimedWord[], durationMs?: number): StartsResult {
  const dur = durationMs ?? (words.length ? words[words.length - 1].endMs : 0);
  const fallback = (note: string): StartsResult => ({ starts: proportionalStarts(lines, dur), method: "proportional", note });
  if (lines.length === 0) return { starts: [], method: "aligned" };
  if (lines.length === 1) return { starts: [0], method: "aligned" };

  const E: { tok: string; line: number }[] = [];
  lines.forEach((l, i) => tokens(speakText(l)).forEach((tok) => E.push({ tok, line: i })));
  const W: { tok: string; startMs: number }[] = [];
  for (const w of words) for (const tok of tokens(w.text)) W.push({ tok, startMs: w.startMs });
  if (!W.length) return fallback("no word timestamps came back");
  if (!E.length) return fallback("the step has no words");

  const n = E.length, m = W.length, cols = m + 1;
  const cost = new Int32Array((n + 1) * cols);
  for (let i = 0; i <= n; i++) cost[i * cols] = i;
  for (let j = 0; j <= m; j++) cost[j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const sub = cost[(i - 1) * cols + j - 1] + (E[i - 1].tok === W[j - 1].tok ? 0 : 1);
      const del = cost[(i - 1) * cols + j] + 1;
      const ins = cost[i * cols + j - 1] + 1;
      cost[i * cols + j] = Math.min(sub, del, ins);
    }
  }
  // Backtrace: E index → W index (match or substitution), -1 when deleted.
  const at = new Array<number>(n).fill(-1);
  const exact = new Array<boolean>(n).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    const here = cost[i * cols + j];
    const same = E[i - 1].tok === W[j - 1].tok;
    if (here === cost[(i - 1) * cols + j - 1] + (same ? 0 : 1)) {
      at[i - 1] = j - 1;
      exact[i - 1] = same;
      i--; j--;
    } else if (here === cost[(i - 1) * cols + j] + 1) {
      i--;
    } else {
      j--;
    }
  }

  const exactCount = exact.filter(Boolean).length;
  if (exactCount / n < 0.6) return fallback(`only ${exactCount} of ${n} words matched the timestamps`);

  const starts: number[] = [0];
  let prevW = -1;
  for (let li = 0; li < lines.length; li++) {
    const idx = E.map((e, k) => (e.line === li ? k : -1)).filter((k) => k >= 0);
    if (!idx.length) return fallback(`line ${li + 1} has no words`);
    if (!idx.some((k) => exact[k])) return fallback(`line ${li + 1} matched no timestamp word`);
    // First word of the line that the voice said; if the opening words were
    // dropped, step back by the number of words skipped (bounded by the
    // previous line's start).
    const firstK = idx.find((k) => at[k] >= 0)!;
    const w = Math.max(prevW + 1, at[firstK] - (firstK - idx[0]));
    if (li > 0) {
      if (w <= prevW || w >= m) return fallback(`line ${li + 1} did not start after line ${li}`);
      starts.push(Math.round(W[w].startMs));
    }
    prevW = w;
  }
  for (let k = 1; k < starts.length; k++) {
    if (starts[k] <= starts[k - 1]) return fallback(`line ${k + 1} starts no later than line ${k}`);
  }
  return { starts, method: "aligned" };
}

// ---------- Cartesia SSE ----------

export function ttsRequestBody(transcript: string, voiceId: string, model = CARTESIA_MODEL) {
  return {
    model_id: model,
    transcript,
    voice: { id: voiceId },
    language: "en",
    output_format: { container: "raw", encoding: "pcm_s16le", sample_rate: SAMPLE_RATE },
    add_timestamps: true,
  };
}

/** Parses an SSE body: audio chunks concatenated, timestamp events merged. Throws on an error event. */
export function parseSse(body: string): { pcm: Buffer; words: TimedWord[] } {
  const parts: Buffer[] = [];
  const words: TimedWord[] = [];
  let done = false;
  for (const block of body.split(/\r?\n\r?\n/)) {
    const data = block
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).replace(/^ /, ""))
      .join("\n");
    if (!data.trim()) continue;
    let ev: Record<string, unknown>;
    try {
      ev = JSON.parse(data);
    } catch {
      continue;
    }
    const type = ev.type as string | undefined;
    if (type === "error" || (typeof ev.status_code === "number" && ev.status_code >= 400)) {
      throw new Error(`Cartesia error: ${String(ev.title ?? "")} ${String(ev.message ?? ev.error ?? "")}`.trim());
    }
    if (type === "chunk" && typeof ev.data === "string") parts.push(Buffer.from(ev.data, "base64"));
    if (type === "timestamps" && ev.word_timestamps) {
      const wt = ev.word_timestamps as { words: string[]; start: number[]; end: number[] };
      wt.words.forEach((text, k) => words.push({ text, startMs: wt.start[k] * 1000, endMs: wt.end[k] * 1000 }));
    }
    if (type === "done" || ev.done === true) done = true;
  }
  if (!done) throw new Error("Cartesia stream ended without a done event");
  return { pcm: Buffer.concat(parts), words };
}

export type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string }) => Promise<{
  ok: boolean;
  status: number;
  text(): Promise<string>;
}>;

export async function synthesize(fetchImpl: FetchLike, apiKey: string, transcript: string, voiceId: string, model = CARTESIA_MODEL) {
  const res = await fetchImpl(CARTESIA_SSE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Cartesia-Version": CARTESIA_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ttsRequestBody(transcript, voiceId, model)),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Cartesia HTTP ${res.status}: ${text.slice(0, 300)}`);
  const out = parseSse(text);
  if (!out.pcm.length) throw new Error("Cartesia returned no audio");
  return out;
}

export function pcmDurationMs(pcm: Buffer): number {
  return Math.round((pcm.length / 2 / SAMPLE_RATE) * 1000);
}

export type Encoder = (pcm: Buffer, outFile: string) => Promise<void>;

/** s16le mono PCM → mp3 via ffmpeg. */
export const ffmpegEncode: Encoder = (pcm, outFile) =>
  new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "s16le", "-ar", String(SAMPLE_RATE), "-ac", "1", "-i", "pipe:0", "-codec:a", "libmp3lame", "-b:a", MP3_BITRATE, outFile], { stdio: ["pipe", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}: ${err.trim()}`))));
    p.stdin.end(pcm);
  });

export const FFMPEG_MISSING = "ffmpeg is not installed; it encodes the clips to mp3 (brew install ffmpeg).";

export function ffmpegAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const p = spawn("ffmpeg", ["-hide_banner", "-version"], { stdio: "ignore" });
    p.on("error", () => resolve(false));
    p.on("close", (code) => resolve(code === 0));
  });
}

// ---------- the stand-in voice (tests and local trial runs only) ----------

/** What a character sent to the voice costs, in dollars (the rate the daily spend cap counts with). */
export const VOICE_USD_PER_CHAR = 0.00005;

/** The switch for the stand-in voice. Honoured only on a database whose name ends in `_smoke`. */
export const FAKE_VOICE_ENV = "KEYSTONE_ANIM_FAKE_VOICE";

/**
 * Whether the stand-in voice is on: KEYSTONE_ANIM_FAKE_VOICE=1 AND the database name ends in `_smoke`. The second
 * condition is what makes it impossible to switch on in production by accident: production's database is
 * castle_rock_review, and a stray variable there changes nothing.
 */
export function fakeVoiceOn(env: Record<string, string | undefined>, dbName: string): boolean {
  return env[FAKE_VOICE_ENV] === "1" && /_smoke$/.test(dbName);
}

/** One silent MPEG-1 Layer III frame: 64 kbps, 44.1 kHz, mono; empty side information decodes to silence. */
const SILENT_FRAME = (() => {
  const f = Buffer.alloc(208);
  f.set([0xff, 0xfb, 0x50, 0xc0]);
  return f;
})();
const FRAME_MS = (1152 / SAMPLE_RATE) * 1000;

/** A silent mp3 of about `durationMs`. */
export function silentMp3(durationMs: number): Buffer {
  const n = Math.max(2, Math.ceil(durationMs / FRAME_MS));
  return Buffer.concat(Array.from({ length: n }, () => SILENT_FRAME));
}

/** An encoder that needs no ffmpeg: a silent mp3 as long as the PCM it is given. */
export const silentEncode: Encoder = async (pcm, outFile) => {
  await writeFile(outFile, silentMp3(pcmDurationMs(pcm)));
};

/**
 * A fetch that answers like Cartesia's SSE endpoint without the network: silence as long as the transcript would
 * take at `msPerChar`, and one timestamp per word spread evenly over it. With silentEncode it takes recordItem
 * through its real path (alignment, timing.json, the log) at no cost.
 */
export function fakeVoiceFetch(msPerChar = 30): FetchLike {
  return async (_url, init) => {
    const transcript = String((JSON.parse(init.body) as { transcript?: string }).transcript ?? "");
    const words = transcript.split(/\s+/).filter(Boolean);
    const durationMs = Math.max(600, charCount(transcript) * msPerChar);
    const per = durationMs / 1000 / Math.max(1, words.length);
    const pcm = Buffer.alloc(Math.round((durationMs / 1000) * SAMPLE_RATE) * 2);
    const events = [
      { type: "timestamps", word_timestamps: { words, start: words.map((_, k) => k * per), end: words.map((_, k) => (k + 0.9) * per) } },
      { type: "chunk", data: pcm.toString("base64") },
      { type: "done", done: true },
    ];
    const body = events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("");
    return { ok: true, status: 200, text: async () => body };
  };
}

// ---------- item ----------

export interface RecordOptions {
  live?: boolean;
  /** 1-based; only this step. */
  step?: number;
  force?: boolean;
  apiKey?: string;
  fetch?: FetchLike;
  encode?: Encoder;
  log?: (line: string) => void;
  now?: () => Date;
}

export interface StepPlan { step: number; title: string; text: string; chars: number; status: "new" | "changed" | "unchanged"; file: string }
export interface RecordResult { itemId: string; voice: string; voiceId: string; plan: StepPlan[]; recorded: number[]; charsBilled: number; notes: string[] }

async function exists(f: string) {
  try { await stat(f); return true; } catch { return false; }
}

async function readTiming(file: string): Promise<TimingFile | null> {
  try {
    const t = JSON.parse(await readFile(file, "utf8")) as TimingFile;
    return Array.isArray(t.steps) ? t : null;
  } catch {
    return null;
  }
}

/** Preview (default) or record (live) one item's steps. */
export async function recordItem(srcDir: string, opts: RecordOptions = {}): Promise<RecordResult> {
  const log = opts.log ?? ((l: string) => console.log(l));
  const spec = JSON.parse(await readFile(path.join(srcDir, "spec.json"), "utf8")) as RecSpec;
  const itemId = spec.itemId ?? path.basename(srcDir);
  if (!Array.isArray(spec.steps) || !spec.steps.length) throw new Error("spec.json has no steps");
  const voiceId = voiceIdFor(spec.voice);
  const model = CARTESIA_MODEL;
  if (opts.step !== undefined && (!Number.isInteger(opts.step) || opts.step < 1 || opts.step > spec.steps.length)) {
    throw new Error(`--step must be 1..${spec.steps.length}`);
  }
  const timingFile = path.join(srcDir, "timing.json");
  const timing: TimingFile = (await readTiming(timingFile)) ?? { steps: [] };

  const plan: StepPlan[] = [];
  for (let k = 0; k < spec.steps.length; k++) {
    const st = spec.steps[k];
    st.lines.forEach((l, li) => {
      if (!speakText(l)) throw new Error(`step ${k + 1} line ${li + 1} has no text`);
    });
    const text = stepText(st);
    const file = `audio/step-${k + 1}.mp3`;
    const prev = timing.steps[k];
    const same = !!prev && prev.hash === stepHash(model, voiceId, text) && prev.starts?.length === st.lines.length && (await exists(path.join(srcDir, file)));
    plan.push({ step: k + 1, title: st.title ?? "", text, chars: charCount(text), status: !prev ? "new" : same ? "unchanged" : "changed", file });
  }
  const chosen = plan.filter((p) => (opts.step ? p.step === opts.step : true) && (opts.force || p.status !== "unchanged"));

  log(`Item ${itemId} — voice ${spec.voice} (${voiceId}), model ${model}`);
  for (const p of plan) {
    const doing = chosen.includes(p);
    log(`\nStep ${p.step}: ${p.title} — ${p.chars} chars — ${p.status}${doing ? ` → ${opts.live ? "recording" : "would record"} ${p.file}` : " (skipped)"}`);
    log(`  ${p.text}`);
  }
  const wouldBill = chosen.reduce((a, p) => a + p.chars, 0);
  log(`\nTotal ${plan.reduce((a, p) => a + p.chars, 0)} chars in the item; ${chosen.length} step(s), ${wouldBill} chars ${opts.live ? "to record" : "would be billed"}.`);

  const result: RecordResult = { itemId, voice: spec.voice, voiceId, plan, recorded: [], charsBilled: 0, notes: [] };
  if (!opts.live || !chosen.length) return result;

  if (!opts.apiKey) throw new Error("CARTESIA_API_KEY is not set in the environment; export it and run again (the key is never printed).");
  if (!opts.fetch) throw new Error("no fetch available");
  const encode = opts.encode ?? ffmpegEncode;
  if (!opts.encode && !(await ffmpegAvailable())) throw new Error(FFMPEG_MISSING);

  await mkdir(path.join(srcDir, "audio"), { recursive: true });
  const now = opts.now ?? (() => new Date());
  const billed: { step: number; chars: number }[] = [];
  try {
    for (const p of chosen) {
      const st = spec.steps[p.step - 1];
      const { pcm, words } = await synthesize(opts.fetch, opts.apiKey, p.text, voiceId, model);
      billed.push({ step: p.step, chars: p.chars });
      result.charsBilled += p.chars;
      await encode(pcm, path.join(srcDir, p.file));
      const durationMs = pcmDurationMs(pcm);
      const s = startsFromTimestamps(st.lines, words, durationMs);
      if (s.note) {
        const note = `step ${p.step}: proportional timing (${s.note})`;
        result.notes.push(note);
        log(`  ⚠ ${note}`);
      }
      // Pad holes so the array index stays step - 1.
      while (timing.steps.length < p.step - 1) timing.steps.push(null);
      timing.steps[p.step - 1] = { file: p.file, durationMs, starts: s.starts, hash: stepHash(model, voiceId, p.text), chars: p.chars, timing: s.method };
      timing.steps.length = Math.min(timing.steps.length, spec.steps.length);
      Object.assign(timing, { model, voice: spec.voice, voiceId, recordedAt: now().toISOString() });
      await writeFile(timingFile, JSON.stringify(timing, null, 2) + "\n");
      result.recorded.push(p.step);
      log(`  ✓ step ${p.step}: ${p.file} ${durationMs} ms, starts ${s.starts.join(", ")}`);
    }
  } finally {
    if (billed.length) {
      const entry = { at: now().toISOString(), itemId, voice: spec.voice, voiceId, model, steps: billed, chars: result.charsBilled };
      await appendFile(path.join(srcDir, "recording-log.jsonl"), JSON.stringify(entry) + "\n");
    }
  }
  return result;
}
