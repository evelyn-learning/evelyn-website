// scripts/tutor/voice-harness/stt-clients.ts
import WebSocket from 'ws';
import { requireKey } from './env';
import { chunkPcm } from './audio-util';
import type { SttEngine } from './types';

const SR = 16000;
const CHUNK_MS = 100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** One-shot linear-interpolation PCM16 mono resampler (whole-buffer, no
 *  streaming carry state needed — the corpus clips are short). Used only to
 *  match OpenAI Realtime's implicit 24kHz input contract; see openaiStt. */
function resamplePcm16(pcm: Buffer, fromRate: number, toRate: number): Buffer {
  if (fromRate === toRate) return pcm;
  const inSamples = pcm.length / 2;
  const ratio = fromRate / toRate;
  const outSamples = Math.max(0, Math.floor((inSamples - 1) / ratio) + 1);
  const out = Buffer.alloc(outSamples * 2);
  for (let i = 0; i < outSamples; i++) {
    const srcIdx = i * ratio;
    const i0 = Math.floor(srcIdx);
    const frac = srcIdx - i0;
    const s0 = pcm.readInt16LE(i0 * 2);
    const s1 = i0 + 1 < inSamples ? pcm.readInt16LE((i0 + 1) * 2) : s0;
    const v = Math.round(s0 * (1 - frac) + s1 * frac);
    out.writeInt16LE(Math.max(-32768, Math.min(32767, v)), i * 2);
  }
  return out;
}

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
    /** actual sample rate of `pcm` as passed to this drive() call — defaults
     *  to the corpus rate (SR=16000). Only openai overrides this: it resamples
     *  to 24kHz first (see openaiStt), so chunking must use 24000 too or the
     *  100ms real-time pacing drifts (see comment there). */
    sampleRate?: number;
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
  for (const chunk of chunkPcm(pcm, hooks.sampleRate ?? SR, CHUNK_MS)) {
    hooks.sendChunk(chunk);
    if (opts.realtimePace) await sleep(CHUNK_MS);
  }
  lastAudioAt = Date.now();
  hooks.endOfAudio();

  // settle: stop when 2s pass without a new final (or 20s hard cap)
  //
  // FIX (observed live via Deepgram --probe, 2026-07-06): a multi-utterance
  // clip can emit an is_final segment for utterance 1 mid-stream (well
  // before all audio is sent), leaving lastFinalAt stale by the time the
  // send loop finishes. The original `Date.now() - lastFinalAt > 2000` check
  // then fires on the very first settle-loop tick — before Deepgram has even
  // seen CloseStream, let alone finalized utterance 2 — truncating the
  // transcript and reporting a bogus ~0ms latency. Anchoring the "quiet
  // since" reference to whichever is later, lastFinalAt or lastAudioAt, gives
  // the engine the full 2s grace period *after audio actually finished
  // sending* before we give up, while still cutting short cleanly on clips
  // that already finalized everything mid-stream.
  const deadline = Date.now() + 20000;
  for (;;) {
    if (wsError) throw wsError;
    if (Date.now() > deadline) break;
    if (finals.length > 0 && Date.now() - Math.max(lastFinalAt, lastAudioAt) > 2000) break;
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
  // OBSERVED LIVE (--probe, 2026-07-06): events are {type:"connected"},
  // {type:"turn.start", turn_id}, then a stream of {type:"turn.update",
  // turn_id, transcript} where `transcript` is the CUMULATIVE text for the
  // turn so far (strictly growing, never rewritten in this session) — there
  // is no separate "text"/"turn.text" field and no "turn.end" event at all.
  // The turn is finalized by sending {type:"done"} (the {type:"finalize"}
  // guess was rejected with a 400 "Unrecognized message type ... Expected
  // one of: done, close, config"). After the update stream, the server also
  // sends {type:"turn.eager_end"} then {type:"turn.end"} (both carry the
  // same full cumulative `transcript` as the preceding turn.update in the
  // observed session — turn.end is the authoritative close-out per docs).
  // Since `drive()`'s settle timer keys off `finals.length` growing, and its
  // final transcript is `finals.join(' ')`, we push the *incremental delta*
  // on every update/eager_end/end (not the full cumulative string) — this
  // keeps the settle timer advancing on every message AND reconstructs the
  // correct full sentence when joined. Processing turn.end through the same
  // delta path is a no-op when it repeats the last turn.update, but picks up
  // any late revision if the server ever sends one.
  const prevByTurn = new Map<string, string>();
  return drive(ws, pcm, opts, {
    sendChunk: (c) => ws.send(c),
    endOfAudio: () => ws.send(JSON.stringify({ type: 'done' })),
    onMessage: (msg, finals) => {
      const t = msg as { type?: string; turn_id?: string; transcript?: string };
      if (
        (t.type === 'turn.update' || t.type === 'turn.eager_end' || t.type === 'turn.end') &&
        t.turn_id && typeof t.transcript === 'string'
      ) {
        const prev = prevByTurn.get(t.turn_id) ?? '';
        const delta = t.transcript.startsWith(prev) ? t.transcript.slice(prev.length).trim() : t.transcript;
        prevByTurn.set(t.turn_id, t.transcript);
        if (delta) finals.push(delta);
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
  // OBSERVED LIVE (--probe, 2026-07-06): sending our 16kHz corpus audio as-is
  // produced `input_audio_buffer.speech_started` (VAD detected voice energy)
  // but NO speech_stopped / transcription.completed ever arrived — the
  // session hung until the 10s no-progress timeout. Root cause: this
  // session.update (copied verbatim from the production usePerceptionWS.ts
  // session.update) never sends an explicit audio input format — production
  // (usePerceptionWS.ts PERCEPTION_SAMPLE_RATE=24000) always feeds 24kHz
  // PCM16, so 24kHz is the implicit contract for gpt-realtime-2's audio
  // input. Our 16kHz clip played back at that implicit 24kHz rate is
  // pitch/speed-shifted enough that the VAD onset still fires (energy-based)
  // but silence detection / whisper transcription never completes cleanly.
  // Fix: resample 16kHz -> 24kHz before sending, matching production exactly.
  const OPENAI_SR = 24000;
  const pcm24 = resamplePcm16(pcm, SR, OPENAI_SR);
  // server_vad finalizes on trailing silence — append 2s of it so the last
  // utterance closes without manual commit.
  const silence = Buffer.alloc(OPENAI_SR * 2 * 2);
  const padded = Buffer.concat([pcm24, silence]);
  return drive(ws, padded, opts, {
    sampleRate: OPENAI_SR,
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
