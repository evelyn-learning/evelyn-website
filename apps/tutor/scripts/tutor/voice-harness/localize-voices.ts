// scripts/tutor/voice-harness/localize-voices.ts
// Usage: npm run voice:localize -- <baseVoiceId> <male|female> <label>
// Mints an en-in (Indian English) variant of a base voice and appends it
// to candidates.json. (Dialects us/uk/au/so also accepted via 4th arg.)
import fs from 'node:fs';
import path from 'node:path';
import { cartesiaLocalize } from './cartesia-client';
import type { VoiceCandidate } from './types';

const [baseVoiceId, gender, label, dialectArg] = process.argv.slice(2);
const dialect = (dialectArg ?? 'in') as 'us' | 'uk' | 'au' | 'in' | 'so';
if (!baseVoiceId || !['male', 'female'].includes(gender) || !label) {
  console.error('usage: npm run voice:localize -- <baseVoiceId> <male|female> <label> [dialect=in]');
  process.exit(1);
}

async function main() {
  // Check candidates.json exists BEFORE the paid Cartesia localize call —
  // otherwise a missing file wastes a paid API call before failing anyway.
  const candidatesPath = path.join(process.cwd(), 'artifacts', 'voice-harness', 'candidates.json');
  if (!fs.existsSync(candidatesPath)) {
    console.error('candidates.json not found — run `npm run voice:discover` first');
    process.exit(1);
  }
  const created = await cartesiaLocalize({
    voiceId: baseVoiceId,
    name: `${label} (en-${dialect})`,
    description: `Harness localize variant of ${label} to en-${dialect}`,
    originalSpeakerGender: gender as 'male' | 'female',
    dialect,
  });
  const data = JSON.parse(fs.readFileSync(candidatesPath, 'utf8')) as { voices: VoiceCandidate[] };
  data.voices.push({
    provider: 'cartesia', voiceId: created.id,
    label: `${label} (en-${dialect} localized)`,
    accent: dialect === 'in' ? 'en-in' : dialect === 'uk' ? 'en-gb' : 'en-us',
    technique: 'localize', language: 'en', enabled: true,
  });
  fs.writeFileSync(candidatesPath, JSON.stringify(data, null, 2));
  console.log(`created localized voice ${created.id}, appended to candidates.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
