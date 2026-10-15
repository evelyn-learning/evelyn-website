/**
 * Records one short sample per partner voice code into public/voice-samples/
 * for the voices docs page. Re-run only when VOICE_CODES changes (each run
 * costs a little speech synthesis). Skips codes that already have a file
 * unless FORCE=1.
 *
 * Run (from apps/tutor): npx tsx scripts/voice-samples/generate-voice-samples.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { VOICE_CODES } from '../../../../packages/core/src/voice/voice-codes';

const env = readFileSync(join(__dirname, '../../../../.env.local.production'), 'utf8');
const key = env.match(/^CARTESIA_API_KEY=(.*)$/m)?.[1]?.trim();
if (!key) throw new Error('CARTESIA_API_KEY missing');
const MODEL = 'sonic-3.6'; // = CARTESIA_TTS_MODEL default in prod
const LINES = {
  teacher: "Hi! I'm your tutor. Let's figure this one out together. What do you notice about the first number?",
  character: "Whoa, did you see that? Let's work out what the odds really were. Ready? Tell me your best guess!",
};
const outDir = join(__dirname, '../../public/voice-samples');

(async () => {
  let made = 0;
  for (const v of VOICE_CODES) {
    const out = join(outDir, `${v.code}.mp3`);
    if (existsSync(out) && process.env.FORCE !== '1') continue;
    const res = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: { 'X-API-Key': key, 'Cartesia-Version': '2026-03-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model_id: MODEL,
        transcript: LINES[v.group],
        voice: { mode: 'id', id: v.voiceId },
        language: 'en',
        output_format: { container: 'mp3', sample_rate: 44100, bit_rate: 128000 },
      }),
    });
    if (!res.ok) { console.log(`FAIL ${v.code}: ${res.status} ${(await res.text()).slice(0, 200)}`); continue; }
    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    made++;
    console.log(`ok   ${v.code}`);
  }
  console.log(`${made} sample(s) recorded`);
})();
