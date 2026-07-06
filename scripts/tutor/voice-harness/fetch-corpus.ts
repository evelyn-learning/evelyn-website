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
