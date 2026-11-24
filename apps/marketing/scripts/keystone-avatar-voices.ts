/**
 * Avatar samples (Castle Rock, November 2026): records ONE animated solution in
 * several voices so the same explanation can be heard in different accents.
 *
 *   npx tsx apps/marketing/scripts/keystone-avatar-voices.ts <animated-src>/<itemId> <outDir> [--live] [--only key,key]
 *
 * Without --live it prints what would be recorded and the characters billed.
 * With --live: one Cartesia request per step per voice. Writes
 *   <outDir>/audio/<key>/step-N.mp3
 *   <outDir>/voices.json   per voice: name, accent, per step { durationMs, starts, words }
 * `words` (word, start ms, end ms) is what the drawn teacher's mouth is timed from.
 * A voice whose transcript is unchanged is skipped. Key: CARTESIA_API_KEY.
 * This is a samples script; the Keystone build does not use it.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CARTESIA_MODEL, charCount, ffmpegEncode, pcmDurationMs, startsFromTimestamps, stepHash, stepText, synthesize,
  type FetchLike, type RecSpec,
} from "../src/lib/keystone/animated/record";

/** Cartesia library voices, picked 2026-11-20 by their listed native accent. */
export const SAMPLE_VOICES = [
  { key: "us-f", name: "Clara", accent: "American", gender: "female", id: "01eaafa9-308a-4276-a017-6ab0cf061b1f" },
  { key: "us-m", name: "Joseph", accent: "American", gender: "male", id: "7d444628-dd13-442b-b687-71a6baf0c07e" },
  { key: "ca-f", name: "Bronwen", accent: "Canadian", gender: "female", id: "f4c33650-23a7-43bd-8199-1af16815e58a" },
  { key: "ca-m", name: "Declan", accent: "Canadian", gender: "male", id: "ca6e2abc-f3e6-4f62-9625-92fada58eb9b" },
  { key: "gb-f", name: "Courtney", accent: "British", gender: "female", id: "16a4052e-1f11-47ac-95f5-9330bee062f9" },
  { key: "gb-m", name: "Clive", accent: "British", gender: "male", id: "b24f41fd-00a3-4cd8-992a-a0c9f13f3ef1" },
] as const;

interface StepOut { file: string; durationMs: number; starts: number[]; hash: string; words: [string, number, number][] }
interface VoiceOut { key: string; name: string; accent: string; gender: string; voiceId: string; model: string; steps: StepOut[] }

async function main() {
  const args = process.argv.slice(2);
  const pos = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--only");
  const [srcDir, outDir] = pos;
  if (!srcDir || !outDir) throw new Error("Usage: keystone-avatar-voices.ts <animated-src>/<itemId> <outDir> [--live] [--only key,key]");
  const live = args.includes("--live");
  const oi = args.indexOf("--only");
  const only = oi >= 0 ? args[oi + 1].split(",") : null;
  const spec = JSON.parse(await readFile(path.join(srcDir, "spec.json"), "utf8")) as RecSpec;
  const texts = spec.steps.map(stepText);
  const perVoice = texts.reduce((a, t) => a + charCount(t), 0);
  const voices = SAMPLE_VOICES.filter((v) => !only || only.includes(v.key));

  const file = path.join(outDir, "voices.json");
  let all: Record<string, VoiceOut> = {};
  try { all = JSON.parse(await readFile(file, "utf8")); } catch { /* first run */ }

  let billed = 0;
  for (const v of voices) {
    const prev = all[v.key];
    const same = !!prev && prev.steps.length === texts.length && texts.every((t, k) => prev.steps[k]?.hash === stepHash(CARTESIA_MODEL, v.id, t));
    console.log(`${v.key}  ${v.name} (${v.accent}, ${v.gender}) — ${perVoice} chars — ${same ? "unchanged, skipped" : live ? "recording" : "would record"}`);
    if (same || !live) { if (!same) billed += perVoice; continue; }
    const key = process.env.CARTESIA_API_KEY;
    if (!key) throw new Error("CARTESIA_API_KEY is not set.");
    await mkdir(path.join(outDir, "audio", v.key), { recursive: true });
    const steps: StepOut[] = [];
    for (let k = 0; k < texts.length; k++) {
      const { pcm, words } = await synthesize(globalThis.fetch as unknown as FetchLike, key, texts[k], v.id, CARTESIA_MODEL);
      billed += charCount(texts[k]);
      const rel = `audio/${v.key}/step-${k + 1}.mp3`;
      await ffmpegEncode(pcm, path.join(outDir, rel));
      const durationMs = pcmDurationMs(pcm);
      const s = startsFromTimestamps(spec.steps[k].lines, words, durationMs);
      if (s.note) console.log(`  ⚠ step ${k + 1}: ${s.note}`);
      steps.push({ file: rel, durationMs, starts: s.starts, hash: stepHash(CARTESIA_MODEL, v.id, texts[k]), words: words.map((w) => [w.text, Math.round(w.startMs), Math.round(w.endMs)]) });
      console.log(`  ✓ step ${k + 1}: ${durationMs} ms, ${words.length} words`);
    }
    all[v.key] = { key: v.key, name: v.name, accent: v.accent, gender: v.gender, voiceId: v.id, model: CARTESIA_MODEL, steps };
    await writeFile(file, JSON.stringify(all, null, 1) + "\n");
  }
  console.log(`\n${live ? "Billed" : "Would bill"} ${billed} characters.`);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
