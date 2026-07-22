/**
 * Spike — Task 3.1 of docs/superpowers/plans/2026-07-20-tutor-humanlike-latency-sync.md
 *
 * Validates on OUR Cartesia plan/token (not just the docs) that:
 *   1. An access token minted with a `tts` grant (the browser flow —
 *      cartesia-token/route.ts today mints only `stt`) is accepted by the
 *      TTS WebSocket via the `access_token` query param.
 *   2. `wss://api.cartesia.ai/tts/websocket` + `add_timestamps: true`
 *      returns word-timestamp frames ({type:'timestamps', word_timestamps:
 *      {words[], start[], end[]}}) alongside pcm_f32le audio chunks
 *      ({type:'chunk', data:<base64>}) for sonic-3.5.
 *
 * Frame shapes verified against docs.cartesia.ai/api-reference/tts/tts.md
 * (fetched live 2026-07-22). Exit 0 with a PASS summary, exit 1 on any
 * missing piece — per plan, a FAIL here means STOP Task 3.1 and fall back
 * to Task 3.2's estimator-only mode.
 *
 * Run: npx tsx scripts/spike-cartesia-ws-tts.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import WebSocket from 'ws';
import { CARTESIA_DEFAULT_VOICE_ID } from '../src/lib/tutor/voice/cartesia-voice-registry';

const CARTESIA_VERSION = '2026-03-01';
const TRANSCRIPT =
  'The derivative of x squared is two x, so the slope at three equals six.';

function loadApiKey(): string {
  if (process.env.CARTESIA_API_KEY) return process.env.CARTESIA_API_KEY;
  const envPath = join(__dirname, '..', '.env.local');
  const line = readFileSync(envPath, 'utf8')
    .split('\n')
    .find((l) => l.startsWith('CARTESIA_API_KEY='));
  if (!line) throw new Error('CARTESIA_API_KEY not found in env or .env.local');
  return line.slice('CARTESIA_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
}

async function mintTtsToken(apiKey: string): Promise<string> {
  // Mirrors cartesia-token/route.ts but with the `tts` grant Task 3.1 needs.
  const res = await fetch('https://api.cartesia.ai/access-token', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Cartesia-Version': CARTESIA_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ grants: { tts: true }, expires_in: 300 }),
  });
  if (!res.ok) {
    throw new Error(`access-token mint failed: ${res.status} ${await res.text()}`);
  }
  const { token } = (await res.json()) as { token: string };
  return token;
}

interface WordTimestamps {
  words: string[];
  start: number[];
  end: number[];
}

async function runSpike(): Promise<void> {
  const apiKey = loadApiKey();
  console.log('[spike] minting access token with { tts: true } grant…');
  const token = await mintTtsToken(apiKey);
  console.log('[spike] token minted OK — tts grant accepted by /access-token');

  const url =
    `wss://api.cartesia.ai/tts/websocket` +
    `?cartesia_version=${CARTESIA_VERSION}&access_token=${encodeURIComponent(token)}`;

  const ws = new WebSocket(url);

  let audioChunks = 0;
  let audioBytes = 0;
  const wordFrames: WordTimestamps[] = [];
  const otherFrames: string[] = [];
  let sawDone = false;

  const finished = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('timed out after 20s without a done frame')),
      20_000
    );

    ws.on('open', () => {
      console.log('[spike] WS open — access_token query-param auth accepted');
      ws.send(
        JSON.stringify({
          model_id: 'sonic-3.5',
          transcript: TRANSCRIPT,
          voice: { mode: 'id', id: CARTESIA_DEFAULT_VOICE_ID },
          output_format: { container: 'raw', encoding: 'pcm_f32le', sample_rate: 24000 },
          context_id: 'spike-turn-0:0',
          add_timestamps: true,
          continue: false,
        })
      );
    });

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString()) as Record<string, unknown>;
      switch (msg.type) {
        case 'chunk': {
          audioChunks += 1;
          audioBytes += Buffer.from(msg.data as string, 'base64').length;
          break;
        }
        case 'timestamps': {
          wordFrames.push(msg.word_timestamps as WordTimestamps);
          break;
        }
        case 'done': {
          sawDone = true;
          clearTimeout(timeout);
          ws.close();
          resolve();
          break;
        }
        case 'error': {
          clearTimeout(timeout);
          ws.close();
          reject(new Error(`error frame: ${JSON.stringify(msg)}`));
          break;
        }
        default:
          otherFrames.push(String(msg.type));
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  await finished;

  const words = wordFrames.flatMap((f) => f.words);
  const starts = wordFrames.flatMap((f) => f.start);
  const monotonic = starts.every((s, i) => i === 0 || s >= starts[i - 1]);
  const audioSec = audioBytes / 4 / 24000; // float32 @ 24 kHz

  console.log('\n[spike] ---- results ----');
  console.log(`audio: ${audioChunks} chunks, ${audioBytes} bytes (${audioSec.toFixed(2)}s @ f32/24k)`);
  console.log(`timestamps frames: ${wordFrames.length}, total words: ${words.length}`);
  console.log(`word starts monotonic: ${monotonic}`);
  console.log(`done frame: ${sawDone}${otherFrames.length ? `, other frames: ${otherFrames.join(',')}` : ''}`);
  console.log(
    `first words: ${words
      .slice(0, 6)
      .map((w, i) => `${w}@${starts[i]?.toFixed(2)}s`)
      .join(' ')}`
  );

  const transcriptWordCount = TRANSCRIPT.split(/\s+/).length;
  const pass =
    sawDone &&
    audioChunks > 0 &&
    audioSec > 1 &&
    words.length >= transcriptWordCount - 2 && // minor tokenization drift tolerated
    starts.length === words.length &&
    monotonic;

  if (!pass) {
    console.error('\n[spike] FAIL — word timestamps NOT usable on this plan/token.');
    console.error('Per plan: STOP Task 3.1, fall back to Task 3.2 estimator-only mode.');
    process.exit(1);
  }
  console.log('\n[spike] PASS — WS TTS + word timestamps validated on our token.');
}

runSpike().catch((err) => {
  console.error('[spike] FAIL:', err);
  process.exit(1);
});
