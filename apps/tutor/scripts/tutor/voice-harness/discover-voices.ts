// scripts/tutor/voice-harness/discover-voices.ts
import fs from 'node:fs';
import path from 'node:path';
import { cartesiaListVoices } from './cartesia-client';
import type { VoiceCandidate } from './types';

const OUT_DIR = path.join(process.cwd(), 'artifacts', 'voice-harness');

/** Doc-recommended starting voices (docs.cartesia.ai, Sonic 3.5 page). */
const PINNED: VoiceCandidate[] = [
  { provider: 'cartesia', voiceId: 'f786b574-daa5-4673-aa0c-cbe3e8534c02', label: 'Katie (en-US)', accent: 'en-us', technique: 'native', language: 'en', enabled: true },
  { provider: 'cartesia', voiceId: 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4', label: 'Skylar (en-US)', accent: 'en-us', technique: 'native', language: 'en', enabled: true },
  { provider: 'cartesia', voiceId: 'a5136bf9-224c-4d76-b823-52bd5efcffcc', label: 'Jameson (en-US)', accent: 'en-us', technique: 'native', language: 'en', enabled: true },
  { provider: 'cartesia', voiceId: '62ae83ad-4f6a-430b-af41-a9bede9286ca', label: 'Gemma (en-GB)', accent: 'en-gb', technique: 'native', language: 'en', enabled: true },
  { provider: 'cartesia', voiceId: 'ef191366-f52f-447a-a398-ed8c0f2943a1', label: 'Archie (en-GB)', accent: 'en-gb', technique: 'native', language: 'en', enabled: true },
];

const CARRYOVER_LANGS: { lang: string; accent: VoiceCandidate['accent'] }[] = [
  { lang: 'hi', accent: 'en-in' },       // second en-in source besides localize
  { lang: 'ar', accent: 'en-ar-gulf' },
  { lang: 'nl', accent: 'en-nl' },
  { lang: 'de', accent: 'en-de' },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const catalog: Record<string, unknown[]> = {};
  const candidates: VoiceCandidate[] = [...PINNED];

  for (const lang of ['en', 'hi', 'ar', 'nl', 'de']) {
    const voices = await cartesiaListVoices(lang);
    catalog[lang] = voices;
    console.log(`${lang}: ${voices.length} voices`);
    const co = CARRYOVER_LANGS.find((c) => c.lang === lang);
    if (co) {
      for (const v of voices) {
        candidates.push({
          provider: 'cartesia', voiceId: v.id,
          label: `${v.name} (${lang}→en carryover)`,
          accent: co.accent, technique: 'carryover',
          language: 'en',   // English transcript through an L1 voice
          enabled: false,   // curate by hand: flip a handful to true
        });
      }
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, 'voices-catalog.json'), JSON.stringify(catalog, null, 2));
  const candidatesPath = path.join(OUT_DIR, 'candidates.json');
  if (fs.existsSync(candidatesPath)) {
    console.log(`candidates.json exists — NOT overwriting (delete it to regenerate)`);
  } else {
    fs.writeFileSync(candidatesPath, JSON.stringify({ voices: candidates }, null, 2));
    console.log(`wrote ${candidatesPath} — edit it: enable 2-3 carryover voices per accent`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
