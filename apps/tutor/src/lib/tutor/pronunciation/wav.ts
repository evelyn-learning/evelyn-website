// src/lib/tutor/pronunciation/wav.ts
// 16 kHz PCM16 mono → WAV for the vendor uploads. Same RIFF layout as
// scripts/tutor/voice-harness/audio-util.ts `pcm16ToWav` (src/ must not import
// from scripts/, so this is the server-side copy, fixed at 16 kHz).
export const PRON_SAMPLE_RATE = 16000;

export function pcm16ToWav16k(pcm: Buffer): Buffer {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(PRON_SAMPLE_RATE, 24); h.writeUInt32LE(PRON_SAMPLE_RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
