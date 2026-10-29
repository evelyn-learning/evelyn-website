// src/lib/tutor/pronunciation/resample.ts
// PCM16 mono resampler for the pronunciation route: the browser's mic tap
// records at 24 kHz, the assessment vendors take 16 kHz. Linear interpolation
// is enough for speech scoring (no anti-alias filter; content above 8 kHz is
// irrelevant to phoneme accuracy). Pure, server-side twin of nothing in
// scripts/ (the voice harness resamples with ffmpeg).

/** Resample little-endian PCM16 mono. Returns a new Buffer of floor(n·to/from) samples. */
export function resamplePcm16(input: Int16Array | Buffer, fromRate: number, toRate: number): Buffer {
  const src = Buffer.isBuffer(input)
    ? (i: number) => input.readInt16LE(i * 2)
    : (i: number) => (input as Int16Array)[i];
  const n = Buffer.isBuffer(input) ? Math.floor(input.length / 2) : input.length;
  const outLen = Math.floor((n * toRate) / fromRate);
  const out = Buffer.alloc(outLen * 2);
  const step = fromRate / toRate;
  for (let i = 0; i < outLen; i++) {
    const pos = i * step;
    const i0 = Math.floor(pos);
    const i1 = Math.min(i0 + 1, n - 1);
    const frac = pos - i0;
    const a = src(i0);
    const v = Math.round(a + (src(i1) - a) * frac);
    out.writeInt16LE(Math.max(-32768, Math.min(32767, v)), i * 2);
  }
  return out;
}
