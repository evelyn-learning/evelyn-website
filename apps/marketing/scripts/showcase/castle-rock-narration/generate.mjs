// Records the tutor voice-over for the Castle Rock sample solutions.
//
//   node scripts/showcase/castle-rock-narration/generate.mjs <path-to-env-file> [--force]
//
// Reads narration.json (per item: a teacher voice and one spoken line per
// step; spell units the way they should be said, e.g. "meters") and writes
// public/showcase/castle-rock/audio/<itemId>/step-<n>.mp3. Clips that already
// exist are kept unless --force is passed, so adding an item only records the
// new lines. Needs CARTESIA_API_KEY in the env file.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outRoot = path.resolve(here, "../../../public/showcase/castle-rock/audio");
const [envFile, flag] = process.argv.slice(2);
if (!envFile) throw new Error("usage: generate.mjs <path-to-env-file> [--force]");

const keyLine = fs.readFileSync(envFile, "utf8").split("\n").filter((l) => /^CARTESIA_API_KEY=/.test(l.trim())).pop();
if (!keyLine) throw new Error("CARTESIA_API_KEY not found in " + envFile);
const key = keyLine.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");

// Voice ids are the academy teacher voices (academy apps/api/src/scripts/seed-teachers.ts).
const { voices, items } = JSON.parse(fs.readFileSync(path.join(here, "narration.json"), "utf8"));

let chars = 0;
let made = 0;
for (const [itemId, { voice, lines }] of Object.entries(items)) {
  const voiceId = voices[voice];
  if (!voiceId) throw new Error(`item ${itemId}: unknown voice "${voice}"`);
  fs.mkdirSync(path.join(outRoot, itemId), { recursive: true });
  for (let i = 0; i < lines.length; i++) {
    const file = path.join(outRoot, itemId, `step-${i + 1}.mp3`);
    if (fs.existsSync(file) && flag !== "--force") continue;
    const resp = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: { "X-API-Key": key, "Cartesia-Version": "2026-03-01", "Content-Type": "application/json" },
      body: JSON.stringify({
        model_id: "sonic-3.5",
        transcript: lines[i],
        voice: { mode: "id", id: voiceId },
        language: "en",
        output_format: { container: "mp3", bit_rate: 96000, sample_rate: 44100 },
      }),
    });
    if (!resp.ok) throw new Error(`item ${itemId} step ${i + 1}: ${resp.status} ${(await resp.text()).slice(0, 300)}`);
    fs.writeFileSync(file, Buffer.from(await resp.arrayBuffer()));
    chars += lines[i].length;
    made += 1;
    console.log(`${itemId} step ${i + 1}: ${lines[i].length} characters`);
  }
}
console.log(`recorded ${made} clips, ${chars} characters`);
