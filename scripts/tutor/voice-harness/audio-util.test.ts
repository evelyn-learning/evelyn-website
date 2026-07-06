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
