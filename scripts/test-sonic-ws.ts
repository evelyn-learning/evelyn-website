/**
 * Tests for src/lib/tutor/voice/sonic-ws.ts — the pure core of the Cartesia
 * TTS WebSocket transport (Task 3.1, humanlike-latency plan).
 *
 * Frame shapes mirror docs.cartesia.ai/api-reference/tts/tts.md (fetched
 * 2026-07-22) and the live spike run (scripts/spike-cartesia-ws-tts.ts):
 *   chunk       {type:'chunk', context_id, data:<b64 pcm_f32le>, done:false}
 *   timestamps  {type:'timestamps', context_id, word_timestamps:{words,start,end}}
 *   done        {type:'done', context_id, done:true}
 *   error       {type:'error', context_id, message}
 *
 * Run: npm run test:sonic-ws
 */

import {
  base64ToFloat32,
  SonicContextDemux,
  wordIndexAt,
} from '../apps/marketing/src/lib/tutor/voice/sonic-ws';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

function b64Of(samples: number[]): string {
  return Buffer.from(new Float32Array(samples).buffer).toString('base64');
}

interface Collected {
  chunks: Float32Array[];
  words: string[];
  starts: number[];
  done: number;
  errors: string[];
}
interface Handlers {
  onChunk(chunk: Float32Array): void;
  onWords(words: string[], startSec: number[]): void;
  onDone(): void;
  onError(message: string): void;
}
function collector(): { c: Collected; handlers: Handlers } {
  const c: Collected = { chunks: [], words: [], starts: [], done: 0, errors: [] };
  return {
    c,
    handlers: {
      onChunk: (chunk) => c.chunks.push(chunk),
      onWords: (words, starts) => { c.words.push(...words); c.starts.push(...starts); },
      onDone: () => c.done++,
      onError: (m) => c.errors.push(m),
    },
  };
}

function main() {
  // ── base64ToFloat32 ──────────────────────────────────────────────────
  const src = [0, 0.25, -0.5, 1, -1];
  const rt = base64ToFloat32(b64Of(src));
  check('b64-roundtrip', rt.length === 5 && src.every((v, i) => rt[i] === Math.fround(v)));
  check('b64-empty', base64ToFloat32('').length === 0);

  // ── demux: routing ───────────────────────────────────────────────────
  const demux = new SonicContextDemux();
  const a = collector();
  const b = collector();
  demux.register('ctx-a', a.handlers);
  demux.register('ctx-b', b.handlers);

  check('routed-a', demux.handleFrame({ type: 'chunk', context_id: 'ctx-a', data: b64Of([0.1, 0.2]), done: false }));
  check('routed-b', demux.handleFrame({ type: 'chunk', context_id: 'ctx-b', data: b64Of([0.3]), done: false }));
  check('a-got-chunk', a.c.chunks.length === 1 && a.c.chunks[0].length === 2);
  check('b-got-chunk', b.c.chunks.length === 1 && b.c.chunks[0].length === 1);
  check('b-isolated', b.c.chunks[0][0] === Math.fround(0.3));

  // Unknown/stale context → dropped, returns false, nothing delivered.
  check('unknown-dropped', !demux.handleFrame({ type: 'chunk', context_id: 'ctx-gone', data: b64Of([1]), done: false }));

  // Timestamps accumulate across MULTIPLE frames (the live spike delivered
  // 15 words over 12 frames).
  demux.handleFrame({ type: 'timestamps', context_id: 'ctx-a', word_timestamps: { words: ['The', 'slope'], start: [0.04, 0.3], end: [0.2, 0.6] } });
  demux.handleFrame({ type: 'timestamps', context_id: 'ctx-a', word_timestamps: { words: ['is'], start: [0.7], end: [0.8] } });
  check('words-accumulate', a.c.words.join(' ') === 'The slope is' && a.c.starts.length === 3 && a.c.starts[2] === 0.7);

  // done → onDone fires once and the context auto-unregisters.
  demux.handleFrame({ type: 'done', context_id: 'ctx-a', done: true });
  check('done-fired', a.c.done === 1);
  check('done-unregisters', !demux.handleFrame({ type: 'chunk', context_id: 'ctx-a', data: b64Of([1]), done: false }));
  check('done-idempotent', !demux.handleFrame({ type: 'done', context_id: 'ctx-a', done: true }) && a.c.done === 1);

  // error → onError + unregister; ctx-b unaffected throughout.
  demux.handleFrame({ type: 'error', context_id: 'ctx-b', message: 'boom' });
  check('error-fired', b.c.errors.length === 1 && b.c.errors[0] === 'boom');
  check('error-unregisters', !demux.handleFrame({ type: 'chunk', context_id: 'ctx-b', data: b64Of([1]), done: false }));

  // Malformed frames never throw, never deliver.
  const m = collector();
  demux.register('ctx-m', m.handlers);
  check('no-type', !demux.handleFrame({ context_id: 'ctx-m' }));
  check('no-context', !demux.handleFrame({ type: 'chunk', data: b64Of([1]) }));
  check('bad-b64-safe', (() => { try { demux.handleFrame({ type: 'chunk', context_id: 'ctx-m', data: '!!!not-base64!!!', done: false }); return true; } catch { return false; } })());
  check('malformed-timestamps-safe', (() => { try { return !demux.handleFrame({ type: 'timestamps', context_id: 'ctx-m', word_timestamps: undefined }); } catch { return false; } })());
  check('m-clean', m.c.chunks.length === 0 && m.c.errors.length === 0);

  // unregister stops delivery (cancel path — kill/supersede).
  const u = collector();
  demux.register('ctx-u', u.handlers);
  demux.unregister('ctx-u');
  check('unregistered-dropped', !demux.handleFrame({ type: 'chunk', context_id: 'ctx-u', data: b64Of([1]), done: false }));

  // flush_done is a recognized no-op (routed, not an error, no delivery).
  const f = collector();
  demux.register('ctx-f', f.handlers);
  check('flush-done-routed', demux.handleFrame({ type: 'flush_done', context_id: 'ctx-f', flush_done: true, flush_id: 1 }));
  check('flush-done-noop', f.c.done === 0 && f.c.chunks.length === 0);

  // ── wordIndexAt (word clock advance) ─────────────────────────────────
  const starts = [0.04, 0.12, 0.6, 0.76, 1.0, 1.32];
  check('clock-before-first', wordIndexAt(starts, 0.0, -1) === -1);
  check('clock-first', wordIndexAt(starts, 0.04, -1) === 0);   // boundary inclusive
  check('clock-mid', wordIndexAt(starts, 0.7, -1) === 2);
  check('clock-advance', wordIndexAt(starts, 1.5, 2) === 5);
  check('clock-monotonic', wordIndexAt(starts, 0.05, 3) === 3); // never regresses below fromIdx
  check('clock-end', wordIndexAt(starts, 99, -1) === 5);
  check('clock-empty', wordIndexAt([], 1, -1) === -1);

  if (failures > 0) {
    console.error(`\n${failures} failure(s)`);
    process.exit(1);
  }
  console.log('\nAll sonic-ws tests passed.');
}

main();
