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

  const candidatesPath = path.join(base, 'candidates.json');
  if (!fs.existsSync(candidatesPath)) {
    console.error('candidates.json not found — run `npm run voice:discover` first');
    process.exit(1);
  }
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8')) as { voices: VoiceCandidate[] };
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
