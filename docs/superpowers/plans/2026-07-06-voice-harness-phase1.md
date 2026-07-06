# Voice Harness Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the TTS/STT comparison harnesses (`scripts/tutor/voice-harness/`) and the dev-only `/tutor/voice-harness` listening dashboard so the user can pick winning Cartesia voices/accents and an STT engine before any migration.

**Architecture:** Node generation scripts (run with `npx tsx`, dotenv from `.env.local`) fan out authored tutor utterances across TTS providers and stream accent-corpus clips through three STT engines at real-time pace; results land as WAV files + JSON manifests under `artifacts/voice-harness/`. A dev-only Next.js page reads them via a dev-only API route and renders a listening matrix (TTS) and a WER table (STT) with exportable verdicts.

**Tech Stack:** TypeScript via `tsx`, `ws` (new devDependency) for authenticated WebSockets, native `fetch` for HTTP, `dotenv` (existing dep), Next.js app router page + route handler. No test framework — repo idiom is plain assert scripts run with `tsx` (like `scripts/test-*.ts`).

## Global Constraints

- **Zero production-code changes.** Only NEW files, plus `package.json` (scripts + `ws` devDep) and `.gitignore`. Do not touch `useOpenAIRealtime.ts`, `usePerceptionWS.ts`, or any tutor runtime file.
- Spec: `docs/superpowers/specs/2026-07-06-voice-stack-cartesia-design.md`. Round-1 accent keys (use verbatim): `en-us`, `en-gb`, `en-in`, `en-ar-gulf`, `en-nl`, `en-de`.
- Cartesia: header auth `X-API-Key: $CARTESIA_API_KEY` + `Cartesia-Version: 2026-03-01`; WS auth via `api_key` + `cartesia_version` query params. Models pinned: TTS `sonic-3.5`, STT `ink-2`.
- All TTS output saved as **WAV** (Cartesia: `{container:'wav', encoding:'pcm_f32le', sample_rate:24000}`; OpenAI control clips: PCM16 24kHz wrapped in WAV locally).
- STT input to all engines: **PCM16 mono 16kHz**, streamed in 100ms chunks at real-time pace (a `--fast` flag may skip sleeps for smoke tests only — never for reported latency numbers).
- Every utterance passes through the real `rewriteForTTS` from `@/lib/tutor/voice/tts-pronunciation` — but scripts import it by relative path `../../../src/lib/tutor/voice/tts-pronunciation` (scripts are outside the Next alias context).
- Dashboard page and API route return 404 / render "dev only" outside `NODE_ENV === 'development'` (render-harness idiom).
- Keys never reach the browser: audio/manifests are served by the API route from the local filesystem.
- `artifacts/voice-harness/` and corpus audio are gitignored; only code + README + reference-transcript conventions are committed.
- OpenAI STT baseline must replicate production perception config exactly: `transcription: {model:'whisper-1'}`, `turn_detection: {type:'server_vad', threshold:0.8, prefix_padding_ms:500, silence_duration_ms:1500, create_response:false}`.

## File Structure

```
scripts/tutor/voice-harness/
  env.ts                 # dotenv bootstrap + requireKey helper
  types.ts               # manifest/result shapes shared by scripts + dashboard
  utterances.ts          # the 12 authored utterances (raw + rewriteForTTS'd)
  utterances.test.ts     # assert script
  wer.ts                 # normalize + word-level WER
  wer.test.ts
  audio-util.ts          # WAV encode/decode, f32→pcm16, chunking
  audio-util.test.ts
  cartesia-client.ts     # listVoices / localizeVoice / ttsBytes (timed)
  openai-realtime-tts.ts # control clips via Realtime WS out-of-band response.create
  discover-voices.ts     # CLI → artifacts/voice-harness/voices-catalog.json + candidates skeleton
  localize-voices.ts     # CLI → mint en-in variants, append to candidates.json
  tts-generate.ts        # CLI → matrix run → wav + manifest.json
  fetch-corpus.ts        # CLI → validate/resample corpus clips (ffmpeg), build clips index
  stt-clients.ts         # ink2 / deepgram / openai streaming clients (shared shape)
  stt-run.ts             # CLI → accent×engine run → results.json
  corpus/README.md       # sourcing instructions (committed; audio gitignored)
  README.md
src/app/api/tutor/voice-harness/[...path]/route.ts   # dev-only artifact server
src/app/tutor/voice-harness/page.tsx                  # dev-only dashboard
```

Voice-candidate registry (`artifacts/voice-harness/candidates.json`) is DATA produced/edited during runs, not code.

---

### Task 1: Scaffolding, types, utterance set

**Files:**
- Create: `scripts/tutor/voice-harness/env.ts`, `types.ts`, `utterances.ts`, `utterances.test.ts`
- Modify: `package.json` (add `ws` devDep + npm scripts), `.gitignore`

**Interfaces:**
- Produces: `loadEnv()`, `requireKey(name: string): string` (env.ts); `TtsClip`, `TtsManifest`, `SttClipResult`, `SttResults`, `VoiceCandidate`, `AccentKey` (types.ts); `UTTERANCES: Utterance[]` where `Utterance = { id: string; style: string; raw: string; tts: string }` (utterances.ts).

- [ ] **Step 1: Branch + deps**

```bash
git checkout -b voice-harness-phase1
npm install --save-dev ws@^8 @types/ws
```

- [ ] **Step 2: Write `env.ts`**

```typescript
// scripts/tutor/voice-harness/env.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export function requireKey(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in env / .env.local`);
  return v;
}
```

- [ ] **Step 3: Write `types.ts`**

```typescript
// scripts/tutor/voice-harness/types.ts
export type AccentKey = 'en-us' | 'en-gb' | 'en-in' | 'en-ar-gulf' | 'en-nl' | 'en-de';
export const ACCENTS: AccentKey[] = ['en-us', 'en-gb', 'en-in', 'en-ar-gulf', 'en-nl', 'en-de'];

export type TtsProvider = 'cartesia' | 'openai-realtime';
/** How the accent is achieved (spec decision #2). */
export type AccentTechnique = 'native' | 'localize' | 'carryover' | 'clone' | 'control';

export interface VoiceCandidate {
  provider: TtsProvider;
  voiceId: string;
  label: string;            // human label shown in dashboard, e.g. "Katie (en-US)"
  accent: AccentKey;
  technique: AccentTechnique;
  /** Cartesia `language` param for the TTS call. 'en' for native/localize/clone;
   *  ALSO 'en' for carryover voices (we WANT English text through an L1 voice). */
  language: string;
  enabled: boolean;         // curation switch — edit candidates.json by hand
}

export interface TtsClip {
  clipId: string;           // `${voiceKey}__${utteranceId}`
  provider: TtsProvider;
  voiceId: string;
  label: string;
  accent: AccentKey;
  technique: AccentTechnique;
  utteranceId: string;
  file: string;             // relative to the run dir, e.g. "clips/katie__u01.wav"
  ttfaMs: number;           // request-start → first audio byte
  totalMs: number;
  error?: string;
}

export interface TtsManifest {
  runId: string;
  createdAt: string;
  utterances: { id: string; style: string; raw: string; tts: string }[];
  clips: TtsClip[];
}

export type SttEngine = 'ink2' | 'deepgram' | 'openai';

export interface SttClipResult {
  clipId: string;
  accent: AccentKey;
  engine: SttEngine;
  reference: string;
  transcript: string;
  wer: number;              // 0..1+
  finalLatencyMs: number;   // last audio byte sent → final transcript settled
  eventsFile: string;       // raw event log (jsonl), relative to run dir
  error?: string;
}

export interface SttResults {
  runId: string;
  createdAt: string;
  engines: SttEngine[];
  realtimePaced: boolean;
  clips: SttClipResult[];
}
```

- [ ] **Step 4: Write the failing test `utterances.test.ts`**

```typescript
// scripts/tutor/voice-harness/utterances.test.ts
import assert from 'node:assert';
import { UTTERANCES } from './utterances';

const ids = new Set(UTTERANCES.map((u) => u.id));
assert.strictEqual(ids.size, UTTERANCES.length, 'utterance ids must be unique');
assert.ok(UTTERANCES.length >= 12, 'need at least 12 utterances');
for (const u of UTTERANCES) {
  assert.ok(u.tts.length > 0, `${u.id}: empty tts text`);
  assert.ok(!/\\[a-z]+/i.test(u.tts), `${u.id}: LaTeX command survived rewriteForTTS: ${u.tts}`);
  assert.ok(!/\bsin\b|\bcos\b|\bln\b/.test(u.tts), `${u.id}: unexpanded math abbreviation: ${u.tts}`);
}
const styles = new Set(UTTERANCES.map((u) => u.style));
for (const s of ['math', 'alphanumeric', 'encouragement', 'explanation', 'question']) {
  assert.ok(styles.has(s), `missing style: ${s}`);
}
console.log(`OK — ${UTTERANCES.length} utterances validated`);
```

- [ ] **Step 5: Run it — expect FAIL** (`Cannot find module './utterances'`)

```bash
npx tsx scripts/tutor/voice-harness/utterances.test.ts
```

- [ ] **Step 6: Write `utterances.ts`**

```typescript
// scripts/tutor/voice-harness/utterances.ts
// The 12 authored tutor utterances (spec Phase 1). Raw text is what the
// brain would emit; `tts` is what every provider actually receives —
// through the REAL production pronunciation seam.
import { rewriteForTTS } from '../../../src/lib/tutor/voice/tts-pronunciation';

export interface Utterance { id: string; style: string; raw: string; tts: string }

const RAW: Omit<Utterance, 'tts'>[] = [
  { id: 'u01', style: 'math', raw: 'So the derivative of x^2 is 2x — watch what happens when we apply the power rule to x^5.' },
  { id: 'u02', style: 'math', raw: 'Remember, sin of \\theta over cos of \\theta gives us tan of \\theta. That identity is doing all the work here.' },
  { id: 'u03', style: 'math', raw: 'Three quarters plus one half — we need a common denominator, so 3/4 becomes 6/8 and 1/2 becomes 4/8, giving 10/8.' },
  { id: 'u04', style: 'math', raw: 'The natural log ln of e^3 is just 3, because ln and the exponential are inverse functions.' },
  { id: 'u05', style: 'alphanumeric', raw: 'Open your notes to equation 4b — the one from March 12th, 2026 — and check line 3 against problem A7.' },
  { id: 'u06', style: 'alphanumeric', raw: 'The velocity is 9.8 meters per second squared times 2.5 seconds, which is 24.5 meters per second.' },
  { id: 'u07', style: 'encouragement', raw: 'Yes! That is exactly right — you spotted the pattern before I even finished drawing it.' },
  { id: 'u08', style: 'encouragement', raw: 'Not quite, but you are close. Look at the second term again — what sign should it have?' },
  { id: 'u09', style: 'explanation', raw: 'Think of a supply curve as a ladder of willingness. At low prices only the most efficient producers show up. As the price climbs, each rung brings in producers with higher costs. That is why the curve slopes upward.' },
  { id: 'u10', style: 'explanation', raw: 'A parabola is the set of every point that is the same distance from the focus as it is from the directrix. Move the focus further from the directrix and the curve opens wider.' },
  { id: 'u11', style: 'question', raw: 'So here is my question for you... if we double the radius, what happens to the area? Take your time.' },
  { id: 'u12', style: 'question', raw: 'Before we move on — can you tell me, in your own words, why the base case matters in recursion?' },
];

export const UTTERANCES: Utterance[] = RAW.map((u) => ({ ...u, tts: rewriteForTTS(u.raw) }));
```

- [ ] **Step 7: Run test — expect PASS.** If a LaTeX/abbreviation assertion fails, adjust the RAW text (not the assertion) so every utterance exercises `rewriteForTTS` correctly.

- [ ] **Step 8: npm scripts + gitignore**

In `package.json` scripts add:

```json
"voice:discover": "npx tsx scripts/tutor/voice-harness/discover-voices.ts",
"voice:localize": "npx tsx scripts/tutor/voice-harness/localize-voices.ts",
"voice:tts": "npx tsx scripts/tutor/voice-harness/tts-generate.ts",
"voice:corpus": "npx tsx scripts/tutor/voice-harness/fetch-corpus.ts",
"voice:stt": "npx tsx scripts/tutor/voice-harness/stt-run.ts",
"test:voice-harness": "npx tsx scripts/tutor/voice-harness/utterances.test.ts && npx tsx scripts/tutor/voice-harness/wer.test.ts && npx tsx scripts/tutor/voice-harness/audio-util.test.ts"
```

In `.gitignore` add (check `artifacts/` isn't already covered; add only what's missing):

```
artifacts/voice-harness/
scripts/tutor/voice-harness/corpus/**/*.wav
scripts/tutor/voice-harness/corpus/**/*.mp3
scripts/tutor/voice-harness/corpus/**/*.flac
```

- [ ] **Step 9: Commit**

```bash
git add scripts/tutor/voice-harness package.json package-lock.json .gitignore
git commit -m "feat(voice-harness): scaffolding, shared types, authored utterance set"
```

---

### Task 2: WER + WAV utilities (pure logic, TDD)

**Files:**
- Create: `scripts/tutor/voice-harness/wer.ts`, `wer.test.ts`, `audio-util.ts`, `audio-util.test.ts`

**Interfaces:**
- Produces: `normalizeForWer(s: string): string[]`; `wordErrorRate(reference: string, hypothesis: string): { wer: number; subs: number; ins: number; dels: number; refLen: number }` (wer.ts). `pcm16ToWav(pcm: Buffer, sampleRate: number): Buffer`; `float32ToPcm16(f32: Float32Array): Buffer`; `wavToPcm16Mono(wav: Buffer): { sampleRate: number; pcm: Buffer }`; `chunkPcm(pcm: Buffer, sampleRate: number, chunkMs: number): Buffer[]` (audio-util.ts).

- [ ] **Step 1: Write failing `wer.test.ts`**

```typescript
// scripts/tutor/voice-harness/wer.test.ts
import assert from 'node:assert';
import { normalizeForWer, wordErrorRate } from './wer';

assert.deepStrictEqual(normalizeForWer('Hello, World!  it’s 3/4.'), ['hello', 'world', "it's", '3/4']);
assert.strictEqual(wordErrorRate('the cat sat', 'the cat sat').wer, 0);
// one substitution over 3 ref words
assert.ok(Math.abs(wordErrorRate('the cat sat', 'the bat sat').wer - 1 / 3) < 1e-9);
// two edits over 4 ref words (a b c d → a x b d) = 0.5
const r = wordErrorRate('a b c d', 'a x b d');
assert.ok(Math.abs(r.wer - 0.5) < 1e-9);
// empty hypothesis = 100% deletions
assert.strictEqual(wordErrorRate('one two', '').wer, 1);
// case/punct insensitivity
assert.strictEqual(wordErrorRate('Hello world.', 'hello world').wer, 0);
console.log('OK — wer');
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module './wer'`)

- [ ] **Step 3: Write `wer.ts`**

```typescript
// scripts/tutor/voice-harness/wer.ts
/** Lowercase, unify apostrophes, strip punctuation (keep intra-word ' and /), split. */
export function normalizeForWer(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/[^a-z0-9'/ ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function wordErrorRate(reference: string, hypothesis: string) {
  const ref = normalizeForWer(reference);
  const hyp = normalizeForWer(hypothesis);
  const m = ref.length, n = hyp.length;
  // Standard word-level Levenshtein with backtrace counts.
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = ref[i - 1] === hyp[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  // Backtrace to split distance into subs/ins/dels.
  let i = m, j = n, subs = 0, ins = 0, dels = 0;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] && ref[i - 1] === hyp[j - 1]) { i--; j--; continue; }
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) { subs++; i--; j--; continue; }
    if (j > 0 && d[i][j] === d[i][j - 1] + 1) { ins++; j--; continue; }
    dels++; i--;
  }
  const wer = m === 0 ? (n === 0 ? 0 : 1) : (subs + ins + dels) / m;
  return { wer, subs, ins, dels, refLen: m };
}
```

- [ ] **Step 4: Run wer test — expect PASS**

- [ ] **Step 5: Write failing `audio-util.test.ts`**

```typescript
// scripts/tutor/voice-harness/audio-util.test.ts
import assert from 'node:assert';
import { pcm16ToWav, float32ToPcm16, wavToPcm16Mono, chunkPcm } from './audio-util';

// f32 → pcm16 round values
const pcm = float32ToPcm16(new Float32Array([0, 0.5, -0.5, 1, -1]));
assert.strictEqual(pcm.length, 10);
assert.strictEqual(pcm.readInt16LE(2), 16383);   // 0.5 → ~0x3FFF
assert.strictEqual(pcm.readInt16LE(6), 32767);   // clamp +1

// wav round-trip
const wav = pcm16ToWav(pcm, 16000);
assert.strictEqual(wav.toString('ascii', 0, 4), 'RIFF');
assert.strictEqual(wav.toString('ascii', 8, 12), 'WAVE');
const back = wavToPcm16Mono(wav);
assert.strictEqual(back.sampleRate, 16000);
assert.ok(back.pcm.equals(pcm));

// chunking: 16000 Hz * 0.1 s * 2 bytes = 3200 bytes per 100ms chunk
const big = Buffer.alloc(3200 * 3 + 100);
const chunks = chunkPcm(big, 16000, 100);
assert.strictEqual(chunks.length, 4);
assert.strictEqual(chunks[0].length, 3200);
assert.strictEqual(chunks[3].length, 100);
console.log('OK — audio-util');
```

- [ ] **Step 6: Run — expect FAIL, then write `audio-util.ts`**

```typescript
// scripts/tutor/voice-harness/audio-util.ts
export function float32ToPcm16(f32: Float32Array): Buffer {
  const out = Buffer.alloc(f32.length * 2);
  for (let i = 0; i < f32.length; i++) {
    const v = Math.max(-1, Math.min(1, f32[i]));
    out.writeInt16LE(Math.round(v < 0 ? v * 32768 : v * 32767), i * 2);
  }
  return out;
}

export function pcm16ToWav(pcm: Buffer, sampleRate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);          // fmt chunk size
  header.writeUInt16LE(1, 20);           // PCM
  header.writeUInt16LE(1, 22);           // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // byte rate
  header.writeUInt16LE(2, 32);           // block align
  header.writeUInt16LE(16, 34);          // bits/sample
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/** Parse a mono PCM16 WAV. Throws with a helpful message on anything else
 *  (corpus prep resamples via ffmpeg, so this only sees the canonical format). */
export function wavToPcm16Mono(wav: Buffer): { sampleRate: number; pcm: Buffer } {
  if (wav.toString('ascii', 0, 4) !== 'RIFF' || wav.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('not a RIFF/WAVE file');
  }
  let off = 12;
  let sampleRate = 0, channels = 0, bits = 0, dataStart = -1, dataLen = 0;
  while (off + 8 <= wav.length) {
    const id = wav.toString('ascii', off, off + 4);
    const size = wav.readUInt32LE(off + 4);
    if (id === 'fmt ') {
      channels = wav.readUInt16LE(off + 10);
      sampleRate = wav.readUInt32LE(off + 12);
      bits = wav.readUInt16LE(off + 22);
    } else if (id === 'data') {
      dataStart = off + 8; dataLen = size;
    }
    off += 8 + size + (size % 2);
  }
  if (dataStart < 0) throw new Error('no data chunk');
  if (channels !== 1 || bits !== 16) {
    throw new Error(`expected mono PCM16, got ${channels}ch/${bits}bit — run voice:corpus to resample`);
  }
  return { sampleRate, pcm: wav.subarray(dataStart, dataStart + dataLen) };
}

export function chunkPcm(pcm: Buffer, sampleRate: number, chunkMs: number): Buffer[] {
  const bytesPerChunk = Math.floor((sampleRate * chunkMs) / 1000) * 2;
  const chunks: Buffer[] = [];
  for (let i = 0; i < pcm.length; i += bytesPerChunk) {
    chunks.push(pcm.subarray(i, Math.min(i + bytesPerChunk, pcm.length)));
  }
  return chunks;
}
```

- [ ] **Step 7: Run both tests — PASS. Commit.**

```bash
git add scripts/tutor/voice-harness
git commit -m "feat(voice-harness): WER and WAV utilities with assert tests"
```

---

### Task 3: Cartesia client + voice discovery/localization CLIs

**Files:**
- Create: `scripts/tutor/voice-harness/cartesia-client.ts`, `discover-voices.ts`, `localize-voices.ts`

**Interfaces:**
- Consumes: `requireKey` (env.ts), types.
- Produces: `cartesiaListVoices(language?: string): Promise<CartesiaVoice[]>` where `CartesiaVoice = { id: string; name: string; description: string; language: string }`; `cartesiaTtsBytes(opts: { voiceId: string; transcript: string; language: string }): Promise<{ audio: Buffer; ttfaMs: number; totalMs: number }>` (audio = WAV bytes); `cartesiaLocalize(opts: { voiceId: string; name: string; description: string; originalSpeakerGender: 'male' | 'female'; dialect: 'us' | 'uk' | 'au' | 'in' | 'so' }): Promise<{ id: string }>`.
- Data produced: `artifacts/voice-harness/voices-catalog.json`, `artifacts/voice-harness/candidates.json` (shape `{ voices: VoiceCandidate[] }`).

- [ ] **Step 1: Write `cartesia-client.ts`**

```typescript
// scripts/tutor/voice-harness/cartesia-client.ts
import { requireKey } from './env';

const BASE = 'https://api.cartesia.ai';
const VERSION = '2026-03-01';

function headers(): Record<string, string> {
  return {
    'X-API-Key': requireKey('CARTESIA_API_KEY'),
    'Cartesia-Version': VERSION,
    'Content-Type': 'application/json',
  };
}

export interface CartesiaVoice { id: string; name: string; description: string; language: string }

export async function cartesiaListVoices(language?: string): Promise<CartesiaVoice[]> {
  const out: CartesiaVoice[] = [];
  let startingAfter: string | undefined;
  for (;;) {
    const params = new URLSearchParams({ limit: '100' });
    if (language) params.set('language', language);
    if (startingAfter) params.set('starting_after', startingAfter);
    const resp = await fetch(`${BASE}/voices/?${params}`, { headers: headers() });
    if (!resp.ok) throw new Error(`listVoices ${resp.status}: ${await resp.text()}`);
    const body = await resp.json();
    const page: CartesiaVoice[] = (body.data ?? []).map((v: Record<string, unknown>) => ({
      id: String(v.id), name: String(v.name ?? ''), description: String(v.description ?? ''),
      language: String(v.language ?? ''),
    }));
    out.push(...page);
    if (!body.has_more || page.length === 0) break;
    startingAfter = page[page.length - 1].id;
  }
  return out;
}

export async function cartesiaTtsBytes(opts: { voiceId: string; transcript: string; language: string }) {
  const started = Date.now();
  const resp = await fetch(`${BASE}/tts/bytes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model_id: 'sonic-3.5',
      transcript: opts.transcript,
      voice: { mode: 'id', id: opts.voiceId },
      language: opts.language,
      output_format: { container: 'wav', encoding: 'pcm_f32le', sample_rate: 24000 },
    }),
  });
  if (!resp.ok || !resp.body) throw new Error(`tts/bytes ${resp.status}: ${await resp.text()}`);
  const reader = resp.body.getReader();
  const parts: Buffer[] = [];
  let ttfaMs = -1;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (ttfaMs < 0) ttfaMs = Date.now() - started;
    parts.push(Buffer.from(value));
  }
  return { audio: Buffer.concat(parts), ttfaMs, totalMs: Date.now() - started };
}

export async function cartesiaLocalize(opts: {
  voiceId: string; name: string; description: string;
  originalSpeakerGender: 'male' | 'female'; dialect: 'us' | 'uk' | 'au' | 'in' | 'so';
}): Promise<{ id: string }> {
  const resp = await fetch(`${BASE}/voices/localize`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      voice_id: opts.voiceId, name: opts.name, description: opts.description,
      language: 'en', original_speaker_gender: opts.originalSpeakerGender,
      dialect: opts.dialect,
    }),
  });
  if (!resp.ok) throw new Error(`localize ${resp.status}: ${await resp.text()}`);
  const body = await resp.json();
  return { id: String(body.id) };
}
```

- [ ] **Step 2: Write `discover-voices.ts`**

Writes the full catalog AND a candidates skeleton: the 5 doc-recommended en voices (IDs from the spec/docs, pinned below) + every `hi`/`ar`/`nl`/`de` voice as a disabled `carryover` candidate for curation.

```typescript
// scripts/tutor/voice-harness/discover-voices.ts
import fs from 'node:fs';
import path from 'node:path';
import { cartesiaListVoices } from './cartesia-client';
import type { VoiceCandidate } from './types';

const OUT_DIR = path.join(process.cwd(), 'artifacts', 'voice-harness');

/** Doc-recommended starting voices (docs.cartesia.ai, Sonic 3.5 page). */
const PINNED: VoiceCandidate[] = [
  { provider: 'cartesia', voiceId: 'f786b574-daa5-4673-aa0c-cbe3e8534c02', label: 'Katie (en-US)', accent: 'en-us', technique: 'native', language: 'en', enabled: true },
  { provider: 'cartesia', voiceId: 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4', label: 'Skylar (en-US)', accent: 'en-us', technique: 'native', language: 'en', enabled: true },
  { provider: 'cartesia', voiceId: 'a5136bf9-224c-4d76-b823-52bd5efcffcc', label: 'Jameson (en-US)', accent: 'en-us', technique: 'native', language: 'en', enabled: true },
  { provider: 'cartesia', voiceId: '62ae83ad-4f6a-430b-af41-a9bede9286ca', label: 'Gemma (en-GB)', accent: 'en-gb', technique: 'native', language: 'en', enabled: true },
  { provider: 'cartesia', voiceId: 'ef191366-f52f-447a-a398-ed8c0f2943a1', label: 'Archie (en-GB)', accent: 'en-gb', technique: 'native', language: 'en', enabled: true },
];

const CARRYOVER_LANGS: { lang: string; accent: VoiceCandidate['accent'] }[] = [
  { lang: 'hi', accent: 'en-in' },       // second en-in source besides localize
  { lang: 'ar', accent: 'en-ar-gulf' },
  { lang: 'nl', accent: 'en-nl' },
  { lang: 'de', accent: 'en-de' },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const catalog: Record<string, unknown[]> = {};
  const candidates: VoiceCandidate[] = [...PINNED];

  for (const lang of ['en', 'hi', 'ar', 'nl', 'de']) {
    const voices = await cartesiaListVoices(lang);
    catalog[lang] = voices;
    console.log(`${lang}: ${voices.length} voices`);
    const co = CARRYOVER_LANGS.find((c) => c.lang === lang);
    if (co) {
      for (const v of voices) {
        candidates.push({
          provider: 'cartesia', voiceId: v.id,
          label: `${v.name} (${lang}→en carryover)`,
          accent: co.accent, technique: 'carryover',
          language: 'en',   // English transcript through an L1 voice
          enabled: false,   // curate by hand: flip a handful to true
        });
      }
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, 'voices-catalog.json'), JSON.stringify(catalog, null, 2));
  const candidatesPath = path.join(OUT_DIR, 'candidates.json');
  if (fs.existsSync(candidatesPath)) {
    console.log(`candidates.json exists — NOT overwriting (delete it to regenerate)`);
  } else {
    fs.writeFileSync(candidatesPath, JSON.stringify({ voices: candidates }, null, 2));
    console.log(`wrote ${candidatesPath} — edit it: enable 2-3 carryover voices per accent`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Write `localize-voices.ts`**

```typescript
// scripts/tutor/voice-harness/localize-voices.ts
// Usage: npm run voice:localize -- <baseVoiceId> <male|female> <label>
// Mints an en-in (Indian English) variant of a base voice and appends it
// to candidates.json. (Dialects us/uk/au/so also accepted via 4th arg.)
import fs from 'node:fs';
import path from 'node:path';
import { cartesiaLocalize } from './cartesia-client';
import type { VoiceCandidate } from './types';

const [baseVoiceId, gender, label, dialectArg] = process.argv.slice(2);
const dialect = (dialectArg ?? 'in') as 'us' | 'uk' | 'au' | 'in' | 'so';
if (!baseVoiceId || !['male', 'female'].includes(gender) || !label) {
  console.error('usage: npm run voice:localize -- <baseVoiceId> <male|female> <label> [dialect=in]');
  process.exit(1);
}

async function main() {
  const created = await cartesiaLocalize({
    voiceId: baseVoiceId,
    name: `${label} (en-${dialect})`,
    description: `Harness localize variant of ${label} to en-${dialect}`,
    originalSpeakerGender: gender as 'male' | 'female',
    dialect,
  });
  const candidatesPath = path.join(process.cwd(), 'artifacts', 'voice-harness', 'candidates.json');
  const data = JSON.parse(fs.readFileSync(candidatesPath, 'utf8')) as { voices: VoiceCandidate[] };
  data.voices.push({
    provider: 'cartesia', voiceId: created.id,
    label: `${label} (en-${dialect} localized)`,
    accent: dialect === 'in' ? 'en-in' : dialect === 'uk' ? 'en-gb' : 'en-us',
    technique: 'localize', language: 'en', enabled: true,
  });
  fs.writeFileSync(candidatesPath, JSON.stringify(data, null, 2));
  console.log(`created localized voice ${created.id}, appended to candidates.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 4: Live-verify discovery** (needs `CARTESIA_API_KEY`; this is a live API smoke, not a unit test)

```bash
npm run voice:discover
```
Expected: per-language voice counts printed; `artifacts/voice-harness/voices-catalog.json` and `candidates.json` created. If the `X-API-Key` header or pagination field names are rejected, fix them against the live error message (the API version header `Cartesia-Version: 2026-03-01` is correct per docs).

- [ ] **Step 5: Commit**

```bash
git add scripts/tutor/voice-harness
git commit -m "feat(voice-harness): Cartesia client + voice discovery/localize CLIs"
```

---

### Task 4: TTS generation (Cartesia matrix + OpenAI Realtime control clips)

**Files:**
- Create: `scripts/tutor/voice-harness/openai-realtime-tts.ts`, `tts-generate.ts`

**Interfaces:**
- Consumes: `cartesiaTtsBytes`, `UTTERANCES`, `pcm16ToWav`, types, `candidates.json`.
- Produces: `openaiRealtimeTts(opts: { voice: string; text: string }): Promise<{ audio: Buffer; ttfaMs: number; totalMs: number }>` (audio = WAV bytes, PCM16@24kHz wrapped); run artifacts `artifacts/voice-harness/tts/<runId>/{manifest.json, clips/*.wav}` matching `TtsManifest`.

- [ ] **Step 1: Write `openai-realtime-tts.ts`** — control clips via the same out-of-band mechanism production uses

```typescript
// scripts/tutor/voice-harness/openai-realtime-tts.ts
// Control clips: the CURRENT production voice path (OpenAI Realtime,
// out-of-band response.create, verbatim readback) driven from Node.
import WebSocket from 'ws';
import { requireKey } from './env';
import { pcm16ToWav } from './audio-util';

const MODEL = process.env.TUTOR_PERCEPTION_MODEL || 'gpt-realtime-2';

export function openaiRealtimeTts(opts: { voice: string; text: string }):
  Promise<{ audio: Buffer; ttfaMs: number; totalMs: number }> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    let ttfaMs = -1;
    const parts: Buffer[] = [];
    const ws = new WebSocket(`wss://api.openai.com/v1/realtime?model=${MODEL}`, {
      headers: { Authorization: `Bearer ${requireKey('OPENAI_API_KEY')}` },
    });
    const timeout = setTimeout(() => { ws.close(); reject(new Error('openai tts timeout (45s)')); }, 45000);

    ws.on('open', () => {
      ws.send(JSON.stringify({
        type: 'session.update',
        session: { type: 'realtime', output_modalities: ['audio'], audio: { output: { voice: opts.voice, format: 'pcm16' } } },
      }));
      ws.send(JSON.stringify({
        type: 'response.create',
        response: {
          conversation: 'none',
          output_modalities: ['audio'],
          instructions:
            'Repeat the following text verbatim, naturally, as a tutor speaking to a student. ' +
            'Do not add or omit anything:\n\n' + opts.text,
        },
      }));
    });
    ws.on('message', (raw) => {
      let msg: { type?: string; delta?: string } = {};
      try { msg = JSON.parse(raw.toString()); } catch { return; }
      if (msg.type === 'response.output_audio.delta' || msg.type === 'response.audio.delta') {
        if (ttfaMs < 0) ttfaMs = Date.now() - started;
        if (msg.delta) parts.push(Buffer.from(msg.delta, 'base64'));
      } else if (msg.type === 'response.done') {
        clearTimeout(timeout);
        ws.close();
        resolve({ audio: pcm16ToWav(Buffer.concat(parts), 24000), ttfaMs, totalMs: Date.now() - started });
      } else if (msg.type === 'error') {
        clearTimeout(timeout);
        ws.close();
        reject(new Error(`openai realtime error: ${raw.toString().slice(0, 300)}`));
      }
    });
    ws.on('error', (e) => { clearTimeout(timeout); reject(e); });
  });
}
```

- [ ] **Step 2: Write `tts-generate.ts`**

```typescript
// scripts/tutor/voice-harness/tts-generate.ts
// Usage: npm run voice:tts [-- --run <runId>] [--provider cartesia|openai-realtime]
//        [--voice <voiceIdSubstr>] [--utterance <id>]
import fs from 'node:fs';
import path from 'node:path';
import { UTTERANCES } from './utterances';
import { cartesiaTtsBytes } from './cartesia-client';
import { openaiRealtimeTts } from './openai-realtime-tts';
import type { TtsClip, TtsManifest, VoiceCandidate } from './types';

/** Control voices = current production teacher voices (DEMO_TEACHERS). */
const CONTROL_VOICES: VoiceCandidate[] = ['coral', 'ash', 'sage', 'ballad'].map((v) => ({
  provider: 'openai-realtime', voiceId: v, label: `${v} (realtime-2 control)`,
  accent: 'en-us', technique: 'control', language: 'en', enabled: true,
}));

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const base = path.join(process.cwd(), 'artifacts', 'voice-harness');
  const runId = arg('run') ?? `run-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const runDir = path.join(base, 'tts', runId);
  fs.mkdirSync(path.join(runDir, 'clips'), { recursive: true });

  const candidates = JSON.parse(fs.readFileSync(path.join(base, 'candidates.json'), 'utf8')) as { voices: VoiceCandidate[] };
  let voices = [...candidates.voices.filter((v) => v.enabled), ...CONTROL_VOICES];
  const pFilter = arg('provider'); if (pFilter) voices = voices.filter((v) => v.provider === pFilter);
  const vFilter = arg('voice'); if (vFilter) voices = voices.filter((v) => v.voiceId.includes(vFilter) || v.label.toLowerCase().includes(vFilter.toLowerCase()));
  let utterances = UTTERANCES;
  const uFilter = arg('utterance'); if (uFilter) utterances = utterances.filter((u) => u.id === uFilter);

  console.log(`run ${runId}: ${voices.length} voices × ${utterances.length} utterances`);
  const clips: TtsClip[] = [];
  for (const voice of voices) {
    const voiceKey = voice.label.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    for (const u of utterances) {
      const clipId = `${voiceKey}__${u.id}`;
      const file = `clips/${clipId}.wav`;
      try {
        const res = voice.provider === 'cartesia'
          ? await cartesiaTtsBytes({ voiceId: voice.voiceId, transcript: u.tts, language: voice.language })
          : await openaiRealtimeTts({ voice: voice.voiceId, text: u.tts });
        fs.writeFileSync(path.join(runDir, file), res.audio);
        clips.push({ clipId, provider: voice.provider, voiceId: voice.voiceId, label: voice.label, accent: voice.accent, technique: voice.technique, utteranceId: u.id, file, ttfaMs: res.ttfaMs, totalMs: res.totalMs });
        console.log(`  ✓ ${clipId} ttfa=${res.ttfaMs}ms total=${res.totalMs}ms`);
      } catch (e) {
        clips.push({ clipId, provider: voice.provider, voiceId: voice.voiceId, label: voice.label, accent: voice.accent, technique: voice.technique, utteranceId: u.id, file, ttfaMs: -1, totalMs: -1, error: String(e) });
        console.error(`  ✗ ${clipId}: ${String(e).slice(0, 200)}`);
      }
    }
  }
  const manifest: TtsManifest = {
    runId, createdAt: new Date().toISOString(),
    utterances: utterances.map((u) => ({ id: u.id, style: u.style, raw: u.raw, tts: u.tts })),
    clips,
  };
  fs.writeFileSync(path.join(runDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`manifest → ${path.join(runDir, 'manifest.json')} (${clips.filter((c) => !c.error).length}/${clips.length} ok)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Live smoke** — one voice, one utterance, both providers:

```bash
npm run voice:tts -- --provider cartesia --voice Katie --utterance u01
npm run voice:tts -- --provider openai-realtime --voice coral --utterance u01
```
Expected: two runs each with 1 clip `✓`, playable WAV files (open in Finder/QuickTime), plausible `ttfa` (Cartesia well under ~500ms; realtime typically higher). If OpenAI event names differ live (`response.output_audio.delta` vs `response.audio.delta` — both handled), or the `session.update` shape errors, adjust against the live error; production's shapes are in `src/app/tutor/hooks/useOpenAIRealtime.ts:1763-1785` for reference.

- [ ] **Step 4: Commit**

```bash
git add scripts/tutor/voice-harness
git commit -m "feat(voice-harness): TTS matrix generator with Cartesia + realtime control clips"
```

---

### Task 5: STT corpus prep

**Files:**
- Create: `scripts/tutor/voice-harness/corpus/README.md`, `scripts/tutor/voice-harness/fetch-corpus.ts`

**Interfaces:**
- Produces: corpus convention consumed by Task 6 — `scripts/tutor/voice-harness/corpus/<accent>/clips.json` with shape `{ clips: { file: string; reference: string; source: string }[] }` plus canonical `*.16k.wav` files (PCM16 mono 16kHz) alongside.

- [ ] **Step 1: Write `corpus/README.md`**

```markdown
# STT Accent Corpus

One directory per accent key: `en-us`, `en-gb`, `en-in`, `en-ar-gulf`, `en-nl`, `en-de`.

Each directory contains:
- source audio files (any format ffmpeg reads) — gitignored
- `clips.json`: `{ "clips": [{ "file": "<name>.16k.wav", "reference": "<exact spoken text>", "source": "<corpus + license note>" }] }`

Target: 10–20 clips per accent, 5–20s each, conversational speech.

## Sourcing (verify license before use; record it in `source`)
- **Mozilla Common Voice** (CC0) — https://commonvoice.mozilla.org/en/datasets — filter by
  self-reported accent (e.g. "India and South Asia", "Germany", "England"). Validated clips
  ship with transcript TSVs; copy sentence text into `reference`.
- **L2-ARCTIC** (non-native English: Hindi, Arabic L1 speakers among others) —
  https://psi.engr.tamu.edu/l2-arctic-corpus/ (free with registration; scripted sentences).
- **VoxPopuli accented English** (CC0, EU Parliament — Dutch- and German-accented English) —
  https://github.com/facebookresearch/voxpopuli (`en_accented` subset with transcripts).
- **EdAcc** (Edinburgh International Accents of English, conversational) — backup;
  check per-file licensing.
- Gulf Arabic English is thinnest in public corpora: Common Voice accent tags + L2-ARCTIC
  Arabic-L1 speakers are the primary sources; top up with consenting self-recordings if needed.

## Workflow
1. Download source clips into the accent directory (any format).
2. Write `clips.json` with references pointing at the INTENDED `.16k.wav` names
   (`<basename>.16k.wav`).
3. Run `npm run voice:corpus` — resamples every listed source file to PCM16 mono 16kHz
   via ffmpeg and validates the result.
```

- [ ] **Step 2: Write `fetch-corpus.ts`** (validation + resample; downloads stay manual per README — public-corpus auth walls make scripted download fragile)

```typescript
// scripts/tutor/voice-harness/fetch-corpus.ts
// Validates corpus layout and resamples sources to canonical PCM16 mono 16kHz
// via ffmpeg. Usage: npm run voice:corpus [-- --accent en-in]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { wavToPcm16Mono } from './audio-util';
import { ACCENTS } from './types';

const CORPUS = path.join(process.cwd(), 'scripts', 'tutor', 'voice-harness', 'corpus');

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function main() {
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); }
  catch { console.error('ffmpeg not found — brew install ffmpeg'); process.exit(1); }

  const only = arg('accent');
  let total = 0, ok = 0;
  for (const accent of ACCENTS) {
    if (only && accent !== only) continue;
    const dir = path.join(CORPUS, accent);
    const clipsPath = path.join(dir, 'clips.json');
    if (!fs.existsSync(clipsPath)) { console.log(`- ${accent}: no clips.json (skipped)`); continue; }
    const { clips } = JSON.parse(fs.readFileSync(clipsPath, 'utf8')) as { clips: { file: string; reference: string; source: string }[] };
    for (const clip of clips) {
      total++;
      if (!clip.file.endsWith('.16k.wav')) { console.error(`  ✗ ${accent}/${clip.file}: file must be named *.16k.wav`); continue; }
      const target = path.join(dir, clip.file);
      if (!fs.existsSync(target)) {
        // find a source with the same basename and any extension
        const base = clip.file.replace(/\.16k\.wav$/, '');
        const src = fs.readdirSync(dir).find((f) => f.startsWith(base + '.') && !f.endsWith('.16k.wav') && f !== 'clips.json');
        if (!src) { console.error(`  ✗ ${accent}/${clip.file}: no source file ${base}.*`); continue; }
        execFileSync('ffmpeg', ['-y', '-i', path.join(dir, src), '-ac', '1', '-ar', '16000', '-sample_fmt', 's16', target], { stdio: 'ignore' });
      }
      try {
        const { sampleRate } = wavToPcm16Mono(fs.readFileSync(target));
        if (sampleRate !== 16000) throw new Error(`sampleRate ${sampleRate}`);
        if (!clip.reference?.trim()) throw new Error('empty reference');
        ok++;
      } catch (e) { console.error(`  ✗ ${accent}/${clip.file}: ${e}`); }
    }
    console.log(`- ${accent}: ${clips.length} clips listed`);
  }
  console.log(`corpus: ${ok}/${total} clips valid`);
  if (ok < total) process.exit(1);
}

main();
```

- [ ] **Step 3: Verify with a synthetic sample** (no download needed): generate one clip from Task 4's output as a fake corpus entry, e.g. copy a Katie WAV into `corpus/en-us/sample1.wav`, add `clips.json` with `file: "sample1.16k.wav"` and the utterance text as reference, run `npm run voice:corpus -- --accent en-us` — expect resample + `1/1 clips valid`. Remove the sample afterward or keep it as a pipeline check (it's gitignored either way).

- [ ] **Step 4: Commit**

```bash
git add scripts/tutor/voice-harness/corpus/README.md scripts/tutor/voice-harness/fetch-corpus.ts
git commit -m "feat(voice-harness): corpus conventions + ffmpeg resample/validate CLI"
```

---

### Task 6: STT streaming clients + runner

**Files:**
- Create: `scripts/tutor/voice-harness/stt-clients.ts`, `stt-run.ts`

**Interfaces:**
- Consumes: `wavToPcm16Mono`, `chunkPcm`, `wordErrorRate`, types, corpus convention from Task 5.
- Produces: `runSttClip(engine: SttEngine, pcm16k: Buffer, opts: { realtimePace: boolean; onEvent: (e: object) => void }): Promise<{ transcript: string; finalLatencyMs: number }>`; run artifacts `artifacts/voice-harness/stt/<runId>/{results.json, events/*.jsonl}` matching `SttResults`.

- [ ] **Step 1: Write `stt-clients.ts`**

All three clients share the same driver contract: open WS → stream 100ms PCM16@16kHz chunks (sleeping 100ms between sends unless `--fast`) → signal end-of-audio → collect events until final transcript settles (2s without new finals, or engine end-signal) → resolve. `finalLatencyMs` = time from last audio chunk sent to the final transcript settling. Every raw event goes to `onEvent` for the jsonl log.

```typescript
// scripts/tutor/voice-harness/stt-clients.ts
import WebSocket from 'ws';
import { requireKey } from './env';
import { chunkPcm } from './audio-util';
import type { SttEngine } from './types';

const SR = 16000;
const CHUNK_MS = 100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface ClipRun { transcript: string; finalLatencyMs: number }
interface Opts { realtimePace: boolean; onEvent: (e: object) => void }

/** Shared skeleton: connect, stream, then wait for finals to settle. */
async function drive(
  ws: WebSocket,
  pcm: Buffer,
  opts: Opts,
  hooks: {
    onOpen?: () => void;
    sendChunk: (chunk: Buffer) => void;
    endOfAudio: () => void;
    /** parse a message; return final-segment text to append, or null */
    onMessage: (msg: Record<string, unknown>, finals: string[]) => void;
  }
): Promise<ClipRun> {
  const finals: string[] = [];
  let lastAudioAt = 0;
  let lastFinalAt = 0;
  let wsError: Error | null = null;
  ws.on('message', (raw) => {
    let msg: Record<string, unknown> = {};
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    opts.onEvent(msg);
    const before = finals.length;
    hooks.onMessage(msg, finals);
    if (finals.length > before) lastFinalAt = Date.now();
  });
  ws.on('error', (e) => { wsError = e as Error; });

  await new Promise<void>((res, rej) => { ws.once('open', () => res()); ws.once('error', rej); });
  hooks.onOpen?.();
  for (const chunk of chunkPcm(pcm, SR, CHUNK_MS)) {
    hooks.sendChunk(chunk);
    if (opts.realtimePace) await sleep(CHUNK_MS);
  }
  lastAudioAt = Date.now();
  hooks.endOfAudio();

  // settle: stop when 2s pass without a new final (or 20s hard cap)
  const deadline = Date.now() + 20000;
  for (;;) {
    if (wsError) throw wsError;
    if (Date.now() > deadline) break;
    if (finals.length > 0 && Date.now() - lastFinalAt > 2000) break;
    if (finals.length === 0 && Date.now() - lastAudioAt > 10000) break;
    await sleep(100);
  }
  try { ws.close(); } catch { /* already closed */ }
  return {
    transcript: finals.join(' ').replace(/\s+/g, ' ').trim(),
    finalLatencyMs: finals.length ? Math.max(0, lastFinalAt - lastAudioAt) : -1,
  };
}

async function ink2(pcm: Buffer, opts: Opts): Promise<ClipRun> {
  const params = new URLSearchParams({
    model: 'ink-2', encoding: 'pcm_s16le', sample_rate: String(SR),
    cartesia_version: '2026-03-01', api_key: requireKey('CARTESIA_API_KEY'),
  });
  const ws = new WebSocket(`wss://api.cartesia.ai/stt/turns/websocket?${params}`);
  return drive(ws, pcm, opts, {
    sendChunk: (c) => ws.send(c),
    endOfAudio: () => ws.send(JSON.stringify({ type: 'finalize' })),
    onMessage: (msg, finals) => {
      // Ink turn lifecycle: accept text from turn.end (authoritative);
      // fall back to any message flagged final with text. VERIFY live via
      // --probe and adjust these two field paths if the shapes differ.
      const t = msg as { type?: string; text?: string; transcript?: string; is_final?: boolean; turn?: { text?: string } };
      if (t.type === 'turn.end') {
        const text = t.turn?.text ?? t.text ?? t.transcript;
        if (text) finals.push(text);
      } else if (t.is_final && (t.text || t.transcript)) {
        finals.push((t.text ?? t.transcript)!);
      }
    },
  });
}

async function deepgram(pcm: Buffer, opts: Opts): Promise<ClipRun> {
  const params = new URLSearchParams({
    model: 'nova-3', encoding: 'linear16', sample_rate: String(SR),
    smart_format: 'true', interim_results: 'true',
  });
  const ws = new WebSocket(`wss://api.deepgram.com/v1/listen?${params}`, {
    headers: { Authorization: `Token ${requireKey('DEEPGRAM_API_KEY')}` },
  });
  return drive(ws, pcm, opts, {
    sendChunk: (c) => ws.send(c),
    endOfAudio: () => ws.send(JSON.stringify({ type: 'CloseStream' })),
    onMessage: (msg, finals) => {
      const m = msg as { type?: string; is_final?: boolean; channel?: { alternatives?: { transcript?: string }[] } };
      if (m.type === 'Results' && m.is_final) {
        const text = m.channel?.alternatives?.[0]?.transcript;
        if (text) finals.push(text);
      }
    },
  });
}

/** Production-identical baseline: whisper-1 transcription + server_vad
 *  (mirrors usePerceptionWS session.update exactly). */
async function openaiStt(pcm: Buffer, opts: Opts): Promise<ClipRun> {
  const model = process.env.TUTOR_PERCEPTION_MODEL || 'gpt-realtime-2';
  const ws = new WebSocket(`wss://api.openai.com/v1/realtime?model=${model}`, {
    headers: { Authorization: `Bearer ${requireKey('OPENAI_API_KEY')}` },
  });
  // server_vad finalizes on trailing silence — append 2s of it so the last
  // utterance closes without manual commit.
  const silence = Buffer.alloc(SR * 2 * 2);
  const padded = Buffer.concat([pcm, silence]);
  return drive(ws, padded, opts, {
    onOpen: () => ws.send(JSON.stringify({
      type: 'session.update',
      session: {
        type: 'realtime',
        audio: { input: {
          transcription: { model: 'whisper-1' },
          turn_detection: { type: 'server_vad', threshold: 0.8, prefix_padding_ms: 500, silence_duration_ms: 1500, create_response: false },
        } },
      },
    })),
    sendChunk: (c) => ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: c.toString('base64') })),
    endOfAudio: () => { /* server_vad finalizes on the appended silence */ },
    onMessage: (msg, finals) => {
      const m = msg as { type?: string; transcript?: string };
      if (m.type === 'conversation.item.input_audio_transcription.completed' && m.transcript) {
        finals.push(m.transcript);
      }
    },
  });
}

export function runSttClip(engine: SttEngine, pcm16k: Buffer, opts: Opts): Promise<ClipRun> {
  if (engine === 'ink2') return ink2(pcm16k, opts);
  if (engine === 'deepgram') return deepgram(pcm16k, opts);
  return openaiStt(pcm16k, opts);
}
```

- [ ] **Step 2: Write `stt-run.ts`**

```typescript
// scripts/tutor/voice-harness/stt-run.ts
// Usage: npm run voice:stt [-- --engine ink2|deepgram|openai] [--accent en-in]
//        [--fast] [--probe]   (--probe: first clip only, prints raw events)
import fs from 'node:fs';
import path from 'node:path';
import { wavToPcm16Mono } from './audio-util';
import { wordErrorRate } from './wer';
import { runSttClip } from './stt-clients';
import { ACCENTS, type SttClipResult, type SttEngine, type SttResults } from './types';

const CORPUS = path.join(process.cwd(), 'scripts', 'tutor', 'voice-harness', 'corpus');
const ENGINES: SttEngine[] = ['ink2', 'deepgram', 'openai'];

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

async function main() {
  const runId = `run-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const runDir = path.join(process.cwd(), 'artifacts', 'voice-harness', 'stt', runId);
  fs.mkdirSync(path.join(runDir, 'events'), { recursive: true });
  const engines = arg('engine') ? [arg('engine') as SttEngine] : ENGINES;
  const accents = arg('accent') ? [arg('accent')!] : ACCENTS;
  const realtimePace = !flag('fast');
  const probe = flag('probe');

  const clips: SttClipResult[] = [];
  for (const accent of accents) {
    const clipsPath = path.join(CORPUS, accent, 'clips.json');
    if (!fs.existsSync(clipsPath)) { console.log(`- ${accent}: no corpus, skipped`); continue; }
    const list = (JSON.parse(fs.readFileSync(clipsPath, 'utf8')) as { clips: { file: string; reference: string }[] }).clips;
    for (const clip of probe ? list.slice(0, 1) : list) {
      const { sampleRate, pcm } = wavToPcm16Mono(fs.readFileSync(path.join(CORPUS, accent, clip.file)));
      if (sampleRate !== 16000) throw new Error(`${clip.file}: not 16kHz — run voice:corpus first`);
      for (const engine of engines) {
        const clipId = `${accent}__${clip.file.replace(/\.16k\.wav$/, '')}`;
        const eventsFile = `events/${clipId}__${engine}.jsonl`;
        const eventsStream = fs.createWriteStream(path.join(runDir, eventsFile));
        try {
          const res = await runSttClip(engine, pcm, {
            realtimePace,
            onEvent: (e) => {
              eventsStream.write(JSON.stringify(e) + '\n');
              if (probe) console.log(`[${engine}]`, JSON.stringify(e).slice(0, 240));
            },
          });
          const { wer } = wordErrorRate(clip.reference, res.transcript);
          clips.push({ clipId, accent: accent as SttClipResult['accent'], engine, reference: clip.reference, transcript: res.transcript, wer, finalLatencyMs: res.finalLatencyMs, eventsFile });
          console.log(`  ${engine.padEnd(8)} ${clipId} wer=${(wer * 100).toFixed(1)}% lat=${res.finalLatencyMs}ms`);
        } catch (e) {
          clips.push({ clipId, accent: accent as SttClipResult['accent'], engine, reference: clip.reference, transcript: '', wer: 1, finalLatencyMs: -1, eventsFile, error: String(e) });
          console.error(`  ${engine.padEnd(8)} ${clipId} ✗ ${String(e).slice(0, 160)}`);
        } finally { eventsStream.end(); }
      }
    }
  }
  const results: SttResults = { runId, createdAt: new Date().toISOString(), engines, realtimePaced: realtimePace, clips };
  fs.writeFileSync(path.join(runDir, 'results.json'), JSON.stringify(results, null, 2));
  console.log(`results → ${path.join(runDir, 'results.json')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Probe-verify event shapes live** (mandatory before the full run — the Ink 2 message field names in `stt-clients.ts` are written defensively and MUST be confirmed):

```bash
npm run voice:stt -- --engine ink2 --accent en-us --probe
```
Expected: raw Ink events print (look for the turn lifecycle + transcript fields); if field paths differ, fix the `onMessage` extraction in `stt-clients.ts` to match reality, re-run, confirm a non-empty transcript with plausible WER. Repeat `--probe` for `deepgram` and `openai`.

- [ ] **Step 4: Commit**

```bash
git add scripts/tutor/voice-harness
git commit -m "feat(voice-harness): streaming STT clients (ink2/deepgram/openai) + WER runner"
```

---

### Task 7: Dev-only artifact API route

**Files:**
- Create: `src/app/api/tutor/voice-harness/[...path]/route.ts`

**Interfaces:**
- Produces: `GET /api/tutor/voice-harness/index` → `{ tts: string[]; stt: string[] }` (run ids, newest first); `GET /api/tutor/voice-harness/tts/<runId>/manifest.json`, `/stt/<runId>/results.json` → JSON; `GET /api/tutor/voice-harness/tts/<runId>/clips/<file>.wav` → `audio/wav`. 404 outside development, 403 on path escape.

- [ ] **Step 1: Write the route**

```typescript
// src/app/api/tutor/voice-harness/[...path]/route.ts
// Dev-only file server for voice-harness artifacts (see render-harness idiom).
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const BASE = path.join(process.cwd(), 'artifacts', 'voice-harness');

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'dev only' }, { status: 404 });
  }
  const { path: segs } = await params;

  if (segs.length === 1 && segs[0] === 'index') {
    const list = (kind: string) => {
      const dir = path.join(BASE, kind);
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir).filter((d) => d.startsWith('run-')).sort().reverse();
    };
    return NextResponse.json({ tts: list('tts'), stt: list('stt') });
  }

  const target = path.normalize(path.join(BASE, ...segs));
  if (!target.startsWith(BASE + path.sep)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const buf = fs.readFileSync(target);
  const type = target.endsWith('.json') ? 'application/json'
    : target.endsWith('.wav') ? 'audio/wav'
    : target.endsWith('.jsonl') ? 'text/plain'
    : 'application/octet-stream';
  return new NextResponse(new Uint8Array(buf), { headers: { 'Content-Type': type, 'Cache-Control': 'no-store' } });
}
```

Note: match the repo's route-handler `params` convention — if other `[...slug]` routes in `src/app/api` type `params` as a plain object (not a Promise), copy that convention instead (Next version dictates it; check a neighbor route first).

- [ ] **Step 2: Verify** with dev server running (`npm run dev`, port 3006):

```bash
curl -s http://localhost:3006/api/tutor/voice-harness/index
curl -s http://localhost:3006/api/tutor/voice-harness/tts/<runId-from-task4>/manifest.json | head -c 400
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3006/api/tutor/voice-harness/tts/<runId>/clips/<clipId>.wav
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3006/api/tutor/voice-harness/..%2f..%2fpackage.json"
```
Expected: run list JSON; manifest JSON; `200 audio/wav`; `403` (or `404`) for the traversal attempt.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/tutor/voice-harness
git commit -m "feat(voice-harness): dev-only artifact API route"
```

---

### Task 8: Listening dashboard page

**Files:**
- Create: `src/app/tutor/voice-harness/page.tsx`

**Interfaces:**
- Consumes: the API route from Task 7; `TtsManifest` / `SttResults` shapes (duplicate the minimal interfaces locally — the page cannot import from `scripts/`).

- [ ] **Step 1: Write the page** (`'use client'`, dev-guarded, no external deps, inline styles consistent with a dev tool)

```tsx
// src/app/tutor/voice-harness/page.tsx
'use client';

/**
 * Dev-only voice harness dashboard (spec Phase 1).
 * TTS tab: utterance × voice listening matrix (grouped by accent) with
 * TTFA chips and pass/maybe/fail verdicts (localStorage) + JSON export.
 * STT tab: accent × engine WER table with per-clip transcript vs reference.
 * Disabled outside development.
 */

import React, { useEffect, useMemo, useState } from 'react';

const API = '/api/tutor/voice-harness';

interface TtsClip { clipId: string; label: string; accent: string; technique: string; utteranceId: string; file: string; ttfaMs: number; totalMs: number; error?: string }
interface TtsManifest { runId: string; utterances: { id: string; style: string; tts: string }[]; clips: TtsClip[] }
interface SttClip { clipId: string; accent: string; engine: string; reference: string; transcript: string; wer: number; finalLatencyMs: number; error?: string }
interface SttResults { runId: string; engines: string[]; clips: SttClip[] }

type Verdict = 'pass' | 'maybe' | 'fail' | '';

export default function VoiceHarnessPage() {
  const [runs, setRuns] = useState<{ tts: string[]; stt: string[] }>({ tts: [], stt: [] });
  const [tab, setTab] = useState<'tts' | 'stt'>('tts');
  const [ttsRun, setTtsRun] = useState('');
  const [sttRun, setSttRun] = useState('');
  const [manifest, setManifest] = useState<TtsManifest | null>(null);
  const [stt, setStt] = useState<SttResults | null>(null);
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/index`).then((r) => r.json()).then((d) => {
      setRuns(d);
      if (d.tts?.[0]) setTtsRun(d.tts[0]);
      if (d.stt?.[0]) setSttRun(d.stt[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!ttsRun) return;
    fetch(`${API}/tts/${ttsRun}/manifest.json`).then((r) => r.json()).then(setManifest).catch(() => setManifest(null));
    try { setVerdicts(JSON.parse(localStorage.getItem(`voiceHarnessVerdicts:${ttsRun}`) ?? '{}')); } catch { setVerdicts({}); }
  }, [ttsRun]);

  useEffect(() => {
    if (!sttRun) return;
    fetch(`${API}/stt/${sttRun}/results.json`).then((r) => r.json()).then(setStt).catch(() => setStt(null));
  }, [sttRun]);

  const setVerdict = (voiceLabel: string, v: Verdict) => {
    const next = { ...verdicts, [voiceLabel]: v };
    setVerdicts(next);
    localStorage.setItem(`voiceHarnessVerdicts:${ttsRun}`, JSON.stringify(next));
  };

  const voices = useMemo(() => {
    if (!manifest) return [];
    const seen = new Map<string, TtsClip>();
    for (const c of manifest.clips) if (!seen.has(c.label)) seen.set(c.label, c);
    return [...seen.values()].sort((a, b) => a.accent.localeCompare(b.accent) || a.label.localeCompare(b.label));
  }, [manifest]);

  const sttTable = useMemo(() => {
    if (!stt) return [];
    const byAccent = new Map<string, Map<string, { wer: number[]; lat: number[] }>>();
    for (const c of stt.clips) {
      if (!byAccent.has(c.accent)) byAccent.set(c.accent, new Map());
      const m = byAccent.get(c.accent)!;
      if (!m.has(c.engine)) m.set(c.engine, { wer: [], lat: [] });
      m.get(c.engine)!.wer.push(c.wer);
      if (c.finalLatencyMs >= 0) m.get(c.engine)!.lat.push(c.finalLatencyMs);
    }
    const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
    return [...byAccent.entries()].map(([accent, m]) => ({
      accent,
      cells: [...m.entries()].map(([engine, v]) => ({ engine, wer: avg(v.wer), lat: avg(v.lat) })),
    }));
  }, [stt]);

  if (process.env.NODE_ENV !== 'development') {
    return <div style={{ padding: 40, fontFamily: 'monospace' }}>voice-harness is dev-only.</div>;
  }

  const cellStyle: React.CSSProperties = { border: '1px solid #ddd', padding: 6, verticalAlign: 'top', fontSize: 13 };

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 1400, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20 }}>Voice Harness</h1>
      <div style={{ margin: '12px 0' }}>
        <button onClick={() => setTab('tts')} style={{ fontWeight: tab === 'tts' ? 700 : 400, marginRight: 12 }}>TTS listening</button>
        <button onClick={() => setTab('stt')} style={{ fontWeight: tab === 'stt' ? 700 : 400 }}>STT results</button>
      </div>

      {tab === 'tts' && (
        <>
          <div style={{ marginBottom: 12 }}>
            run:{' '}
            <select value={ttsRun} onChange={(e) => setTtsRun(e.target.value)}>
              {runs.tts.map((r) => <option key={r}>{r}</option>)}
            </select>{' '}
            <button onClick={() => {
              const blob = new Blob([JSON.stringify({ run: ttsRun, verdicts }, null, 2)], { type: 'application/json' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `voice-verdicts-${ttsRun}.json`;
              a.click();
            }}>export verdicts</button>
          </div>
          {manifest && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={cellStyle}>utterance</th>
                    {voices.map((v) => (
                      <th key={v.label} style={cellStyle}>
                        <div>{v.label}</div>
                        <div style={{ color: '#666', fontWeight: 400 }}>{v.accent} · {v.technique}</div>
                        <select value={verdicts[v.label] ?? ''} onChange={(e) => setVerdict(v.label, e.target.value as Verdict)}>
                          <option value="">—</option><option value="pass">pass</option>
                          <option value="maybe">maybe</option><option value="fail">fail</option>
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {manifest.utterances.map((u) => (
                    <tr key={u.id}>
                      <td style={{ ...cellStyle, maxWidth: 260 }}>
                        <b>{u.id}</b> <span style={{ color: '#666' }}>({u.style})</span>
                        <div style={{ color: '#444' }}>{u.tts}</div>
                      </td>
                      {voices.map((v) => {
                        const clip = manifest.clips.find((c) => c.label === v.label && c.utteranceId === u.id);
                        return (
                          <td key={v.label + u.id} style={cellStyle}>
                            {clip && !clip.error ? (
                              <>
                                <audio controls preload="none" style={{ width: 170 }}
                                  src={`${API}/tts/${ttsRun}/${clip.file}`} />
                                <div style={{ color: '#666' }}>ttfa {clip.ttfaMs}ms</div>
                              </>
                            ) : <span style={{ color: '#c00' }}>{clip?.error ? 'error' : '—'}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'stt' && (
        <>
          <div style={{ marginBottom: 12 }}>
            run:{' '}
            <select value={sttRun} onChange={(e) => setSttRun(e.target.value)}>
              {runs.stt.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          {stt && (
            <>
              <table style={{ borderCollapse: 'collapse', marginBottom: 20 }}>
                <thead>
                  <tr><th style={cellStyle}>accent</th>{stt.engines.map((e) => <th key={e} style={cellStyle}>{e}</th>)}</tr>
                </thead>
                <tbody>
                  {sttTable.map((row) => (
                    <tr key={row.accent}>
                      <td style={cellStyle}><b>{row.accent}</b></td>
                      {stt.engines.map((e) => {
                        const c = row.cells.find((x) => x.engine === e);
                        return (
                          <td key={e} style={cellStyle}>
                            {c && !Number.isNaN(c.wer) ? `${(c.wer * 100).toFixed(1)}% WER · ${Number.isNaN(c.lat) ? '—' : Math.round(c.lat) + 'ms'}` : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3 style={{ fontSize: 15 }}>Per-clip transcripts</h3>
              {stt.clips.map((c) => (
                <div key={c.clipId + c.engine} style={{ borderTop: '1px solid #eee', padding: '6px 0' }}>
                  <div style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === c.clipId + c.engine ? null : c.clipId + c.engine)}>
                    <b>{c.clipId}</b> · {c.engine} · {(c.wer * 100).toFixed(1)}% {c.error ? '· ERROR' : ''}
                  </div>
                  {expanded === c.clipId + c.engine && (
                    <div style={{ fontSize: 13, paddingLeft: 12 }}>
                      <div><span style={{ color: '#666' }}>ref:</span> {c.reference}</div>
                      <div><span style={{ color: '#666' }}>hyp:</span> {c.transcript || <i>(empty)</i>}</div>
                      {c.error && <div style={{ color: '#c00' }}>{c.error}</div>}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser** — with a Task-4 TTS run and (if corpus exists) a Task-6 STT run present: open `http://localhost:3006/tutor/voice-harness`, confirm: run selector populated, matrix renders, clips PLAY audibly, TTFA chips show, verdict select persists across reload, export downloads JSON; STT tab shows the WER table and per-clip expansion.

- [ ] **Step 3: Type-check the project**

```bash
npx tsc --noEmit
```
Expected: 0 new errors (scripts/ is outside the main tsconfig — IDE noise there is acceptable per repo precedent; the page + route must be clean).

- [ ] **Step 4: Commit**

```bash
git add src/app/tutor/voice-harness
git commit -m "feat(voice-harness): dev-only TTS listening matrix + STT results dashboard"
```

---

### Task 9: README + full-pipeline verification

**Files:**
- Create: `scripts/tutor/voice-harness/README.md`

- [ ] **Step 1: Write README** — document: purpose (spec Phase 1 link), the 5 npm scripts with their flags, the candidates.json curation step (enable 2–3 carryover voices per gap accent from the catalog, then `voice:localize` for en-in variants of the shortlisted en base voices), corpus workflow (points to corpus/README.md), dashboard URL, and the exit criteria from the spec (base voice per teacher, pass/fail per accent×technique, STT verdict per accent).

- [ ] **Step 2: Full pipeline run** (the real deliverable):

```bash
npm run test:voice-harness          # unit gates green
npm run voice:discover              # catalog + candidates
# hand-curate candidates.json; then localize shortlisted voices, e.g.:
npm run voice:localize -- f786b574-daa5-4673-aa0c-cbe3e8534c02 female Katie
npm run voice:tts                   # full matrix
# populate corpus per corpus/README.md, then:
npm run voice:corpus
npm run voice:stt -- --probe        # verify event shapes per engine first
npm run voice:stt                   # full run, real-time paced
```
Expected: TTS manifest with ≥95% clips ok; STT results across all populated accents × 3 engines; dashboard renders both.

- [ ] **Step 3: Commit + report**

```bash
git add scripts/tutor/voice-harness/README.md
git commit -m "docs(voice-harness): README + pipeline runbook"
```

Report to the user: dashboard URL, what to listen for (per-accent candidates vs control), and that their verdict export drives Phase 2 voice selection.

---

## Self-Review Notes (already applied)

- **Spec coverage:** authored utterances through real `rewriteForTTS` (Task 1); Cartesia matrix incl. localize + carryover + realtime control (Tasks 3–4); TTFA/latency measurement (Tasks 3–4, 6); 6-accent corpus + 3-engine streaming STT with WER + turn events (Tasks 5–6); dev-only dashboard with playback, latency chips, verdict export, WER table, transcript diffs (Tasks 7–8); keys server-side; artifacts gitignored (Task 1). Instant-clone candidates are supported by the `technique: 'clone'` type and candidates.json (add entries by hand when clips are sourced) — no dedicated task, per spec ("when/if sourced").
- **Known live-verification points (not placeholders — explicit steps):** Ink 2 message field names (Task 6 Step 3 probe), OpenAI realtime session.update/event names (Task 4 Step 3), Cartesia pagination/header names (Task 3 Step 4). Each has a designated verify-and-fix step against live responses.
- **Type consistency:** `TtsManifest`/`SttResults` defined once in `types.ts`; the dashboard duplicates trimmed local interfaces (structural subset) because app code can't import from `scripts/` — field names checked to match.
