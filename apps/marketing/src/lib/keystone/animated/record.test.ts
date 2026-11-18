import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  CARTESIA_SSE_URL,
  charCount,
  ffmpegAvailable,
  ffmpegEncode,
  parseSse,
  proportionalStarts,
  recordItem,
  speakText,
  startsFromTimestamps,
  stepText,
  tokens,
  voiceIdFor,
  type FetchLike,
  type TimedWord,
  type TimingFile,
} from "./record";

/** Fake timestamps: each word 300 ms, back to back. */
const timed = (text: string, gapAt: Record<number, number> = {}): TimedWord[] => {
  let t = 0;
  return text.split(/\s+/).filter(Boolean).map((w, k) => {
    t += gapAt[k] ?? 0;
    const out = { text: w, startMs: t, endMs: t + 280 };
    t += 300;
    return out;
  });
};

// text helpers
{
  assert.equal(speakText({ say: "v = 8.3 m/s" }), "v = 8.3 m/s");
  assert.equal(speakText({ say: "v = 8.3 m/s", speak: "  v is eight point three meters per second. " }), "v is eight point three meters per second.");
  assert.equal(speakText({ say: "Shown", speak: "  " }), "Shown", "blank speak falls back to say");
  assert.equal(stepText({ lines: [{ say: "One." }, { say: "x", speak: "Two." }] }), "One. Two.");
  assert.equal(charCount("héllo°"), 6);
  assert.deepEqual(tokens("It's 8.3 m/s, South-East!"), ["its", "8", "3", "m", "s", "south", "east"]);
  assert.equal(voiceIdFor("Mr. Joseph"), "7d444628-dd13-442b-b687-71a6baf0c07e");
  assert.equal(voiceIdFor("Ms. Michelle"), "d7bf7d75-64b7-4c1e-86c0-79d647366587");
  assert.throws(() => voiceIdFor("Coach Riley"), /No Cartesia voice id/);
}

// proportional starts
{
  const s = proportionalStarts([{ say: "aaaa" }, { say: "bbbb" }, { say: "cccccccc" }], 1600);
  assert.deepEqual(s, [0, 400, 800]);
}

// alignment: exact words
{
  const lines = [{ say: "Momentum is conserved here." }, { say: "So add the two arrows." }, { say: "The answer is A." }];
  const words = timed(lines.map((l) => l.say).join(" "));
  const r = startsFromTimestamps(lines, words);
  assert.equal(r.method, "aligned");
  assert.deepEqual(r.starts, [0, 1200, 2700]);
}

// alignment: number expanded by the voice, punctuation split differently
{
  const lines = [{ say: "Divide by the mass." }, { say: "The speed is 8.3 m/s." }, { say: "That is answer A." }];
  const spoken = "Divide by the mass. The speed is eight point three meters per second. That is answer A.";
  const r = startsFromTimestamps(lines, timed(spoken));
  assert.equal(r.method, "aligned", r.note);
  assert.deepEqual(r.starts, [0, 1200, 3900]);
}

// alignment: a pause between lines is honoured
{
  const lines = [{ say: "First line now." }, { say: "Second line now." }];
  const r = startsFromTimestamps(lines, timed("First line now. Second line now.", { 3: 900 }));
  assert.deepEqual(r.starts, [0, 1800]);
}

// alignment fails → proportional, with a reason
{
  const lines = [{ say: "Alpha beta gamma." }, { say: "Delta epsilon." }];
  const r = startsFromTimestamps(lines, timed("completely different words were spoken"), 2000);
  assert.equal(r.method, "proportional");
  assert.match(r.note ?? "", /matched/);
  assert.deepEqual(r.starts, proportionalStarts(lines, 2000));
  const empty = startsFromTimestamps(lines, [], 2000);
  assert.equal(empty.method, "proportional");
  assert.match(empty.note ?? "", /no word timestamps/);
  assert.deepEqual(startsFromTimestamps([{ say: "Only." }], []).starts, [0]);
}

// SSE parsing
const sse = (events: object[]) => events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("");
{
  const pcm = Buffer.alloc(8, 1);
  const body = sse([
    { type: "chunk", done: false, data: pcm.subarray(0, 4).toString("base64") },
    { type: "timestamps", done: false, word_timestamps: { words: ["Hello"], start: [0], end: [0.4] } },
    { type: "chunk", done: false, data: pcm.subarray(4).toString("base64") },
    { type: "timestamps", done: false, word_timestamps: { words: ["world"], start: [0.5], end: [0.9] } },
    { type: "done", done: true },
  ]);
  const out = parseSse(body);
  assert.equal(out.pcm.length, 8);
  assert.deepEqual(out.words.map((w) => [w.text, w.startMs]), [["Hello", 0], ["world", 500]]);
  assert.throws(() => parseSse(sse([{ type: "error", title: "Bad", message: "voice not found", status_code: 400 }])), /voice not found/);
  assert.throws(() => parseSse(sse([{ type: "chunk", data: "AAAA" }])), /without a done/);
}

// recordItem: preview, live (fake fetch + fake encoder), skip, --step, --force, log
async function main() {
  const dir = await mkdtemp(path.join(tmpdir(), "ks-record-"));
  const src = path.join(dir, "999001");
  await mkdir(src);
  const spec = {
    itemId: "999001",
    voice: "Mr. Joseph",
    steps: [
      { title: "One", lines: [{ say: "Start here now." }, { say: "Then go on." }] },
      { title: "Two", lines: [{ say: "v = 8.3 m/s", speak: "The speed is eight point three meters per second." }, { say: "Done." }] },
    ],
  };
  await writeFile(path.join(src, "spec.json"), JSON.stringify(spec));

  const calls: { url: string; headers: Record<string, string>; body: Record<string, unknown> }[] = [];
  const fakeFetch: FetchLike = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, headers: init.headers, body });
    const words = timed(body.transcript as string);
    const pcm = Buffer.alloc(44100 * 2 * 3); // 3 s of silence
    return {
      ok: true,
      status: 200,
      text: async () => sse([
        { type: "chunk", data: pcm.toString("base64") },
        { type: "timestamps", word_timestamps: { words: words.map((w) => w.text), start: words.map((w) => w.startMs / 1000), end: words.map((w) => w.endMs / 1000) } },
        { type: "done", done: true },
      ]),
    };
  };
  const encoded: string[] = [];
  const fakeEncode = async (pcm: Buffer, out: string) => { encoded.push(out); await writeFile(out, pcm.subarray(0, 16)); };
  const quiet = () => {};
  const now = () => new Date("2026-11-18T12:00:00Z");

  // preview: no call, nothing written
  const pv = await recordItem(src, { fetch: fakeFetch, log: quiet });
  assert.equal(calls.length, 0);
  assert.deepEqual(pv.plan.map((p) => [p.step, p.status, p.chars]), [[1, "new", 27], [2, "new", 55]]);
  await assert.rejects(stat(path.join(src, "timing.json")));

  // live without a key → clear message, no call
  await assert.rejects(recordItem(src, { live: true, fetch: fakeFetch, encode: fakeEncode, log: quiet }), /CARTESIA_API_KEY/);
  assert.equal(calls.length, 0);

  // live
  const r1 = await recordItem(src, { live: true, apiKey: "sk_test", fetch: fakeFetch, encode: fakeEncode, log: quiet, now });
  assert.deepEqual(r1.recorded, [1, 2]);
  assert.equal(r1.charsBilled, 82);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, CARTESIA_SSE_URL);
  assert.equal(calls[0].headers.Authorization, "Bearer sk_test");
  assert.ok(calls[0].headers["Cartesia-Version"]);
  assert.equal(calls[0].body.add_timestamps, true);
  assert.deepEqual(calls[0].body.voice, { id: "7d444628-dd13-442b-b687-71a6baf0c07e" });
  assert.deepEqual(calls[0].body.output_format, { container: "raw", encoding: "pcm_s16le", sample_rate: 44100 });
  assert.equal(calls[1].body.transcript, "The speed is eight point three meters per second. Done.");
  const t1 = JSON.parse(await readFile(path.join(src, "timing.json"), "utf8")) as TimingFile;
  assert.equal(t1.steps.length, 2);
  assert.deepEqual(t1.steps[0], { file: "audio/step-1.mp3", durationMs: 3000, starts: [0, 900], hash: t1.steps[0]!.hash, chars: 27, timing: "aligned" });
  assert.deepEqual(t1.steps[1]!.starts, [0, 2700]);
  assert.ok(encoded[0].endsWith(path.join("audio", "step-1.mp3")));
  const log1 = (await readFile(path.join(src, "recording-log.jsonl"), "utf8")).trim().split("\n").map((l) => JSON.parse(l));
  assert.equal(log1.length, 1);
  assert.equal(log1[0].chars, 82);
  assert.equal(log1[0].itemId, "999001");

  // unchanged → no call, no log line
  const r2 = await recordItem(src, { live: true, apiKey: "sk_test", fetch: fakeFetch, encode: fakeEncode, log: quiet, now });
  assert.deepEqual(r2.recorded, []);
  assert.equal(calls.length, 2);

  // change step 2's text → only step 2 is re-recorded
  spec.steps[1].lines[1].say = "Done, that is it.";
  await writeFile(path.join(src, "spec.json"), JSON.stringify(spec));
  const r3 = await recordItem(src, { live: true, apiKey: "sk_test", fetch: fakeFetch, encode: fakeEncode, log: quiet, now });
  assert.deepEqual(r3.recorded, [2]);
  assert.equal(r3.plan[0].status, "unchanged");
  assert.equal(r3.plan[1].status, "changed");

  // --step 1 --force re-records step 1 only
  const r4 = await recordItem(src, { live: true, step: 1, force: true, apiKey: "sk_test", fetch: fakeFetch, encode: fakeEncode, log: quiet, now });
  assert.deepEqual(r4.recorded, [1]);
  assert.equal(calls.length, 4);
  await assert.rejects(recordItem(src, { step: 3, log: quiet }), /--step must be 1..2/);
  const log4 = (await readFile(path.join(src, "recording-log.jsonl"), "utf8")).trim().split("\n");
  assert.equal(log4.length, 3);

  // missing audio file → re-recorded even though the hash matches
  await rm(path.join(src, "audio", "step-2.mp3"));
  const pv2 = await recordItem(src, { log: quiet });
  assert.equal(pv2.plan[1].status, "changed");

  // a fresh item recorded with --step 2 only → step 1 slot is null
  const src2 = path.join(dir, "999002");
  await mkdir(src2);
  await writeFile(path.join(src2, "spec.json"), JSON.stringify({ ...spec, itemId: "999002", voice: "Ms. Michelle" }));
  await recordItem(src2, { live: true, step: 2, apiKey: "sk_test", fetch: fakeFetch, encode: fakeEncode, log: quiet, now });
  const t2 = JSON.parse(await readFile(path.join(src2, "timing.json"), "utf8")) as TimingFile;
  assert.equal(t2.steps[0], null);
  assert.equal(t2.steps[1]!.file, "audio/step-2.mp3");
  assert.equal(t2.voiceId, "d7bf7d75-64b7-4c1e-86c0-79d647366587");

  // HTTP error surfaces, nothing billed is logged for it
  const failing: FetchLike = async () => ({ ok: false, status: 401, text: async () => "unauthorized" });
  await assert.rejects(recordItem(src, { live: true, force: true, apiKey: "sk_test", fetch: failing, encode: fakeEncode, log: quiet }), /HTTP 401/);

  // the real encoder (local ffmpeg, no network) produces an mp3
  if (await ffmpegAvailable()) {
    const out = path.join(dir, "silence.mp3");
    await ffmpegEncode(Buffer.alloc(44100 * 2), out);
    const head = (await readFile(out)).subarray(0, 3);
    assert.ok(head.toString("latin1") === "ID3" || head[0] === 0xff, "mp3 header");
  }

  await rm(dir, { recursive: true, force: true });
  console.log("record.test.ts ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
