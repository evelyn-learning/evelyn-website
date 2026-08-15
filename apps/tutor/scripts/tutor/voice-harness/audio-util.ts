// scripts/tutor/voice-harness/audio-util.ts
export function float32ToPcm16(f32: Float32Array): Buffer {
  const out = Buffer.alloc(f32.length * 2);
  for (let i = 0; i < f32.length; i++) {
    const v = Math.max(-1, Math.min(1, f32[i]));
    out.writeInt16LE(Math.trunc(v < 0 ? v * 32768 : v * 32767), i * 2);
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
