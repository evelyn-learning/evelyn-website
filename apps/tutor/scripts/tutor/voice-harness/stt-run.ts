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
  const engines = arg('engine') ? [arg('engine') as SttEngine] : ENGINES;
  const accentArg = arg('accent');
  if (accentArg && !ACCENTS.includes(accentArg as (typeof ACCENTS)[number])) {
    console.error(`Unknown --accent "${accentArg}". Valid accents: ${ACCENTS.join(', ')}`);
    process.exit(1);
  }
  const accents = accentArg ? [accentArg] : ACCENTS;
  const runId = `run-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const runDir = path.join(process.cwd(), 'artifacts', 'voice-harness', 'stt', runId);
  fs.mkdirSync(path.join(runDir, 'events'), { recursive: true });
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
