// scripts/tutor/voice-harness/cartesia-client.ts
import { requireKey } from './env';

const BASE = 'https://api.cartesia.ai';
const VERSION = '2026-03-01';

function headers(): Record<string, string> {
  return {
    'X-API-Key': requireKey('CARTESIA_API_KEY'),
    'Cartesia-Version': VERSION,
    'Content-Type': 'application/json',
  };
}

export interface CartesiaVoice { id: string; name: string; description: string; language: string }

export async function cartesiaListVoices(language?: string): Promise<CartesiaVoice[]> {
  const out: CartesiaVoice[] = [];
  let startingAfter: string | undefined;
  for (;;) {
    const params = new URLSearchParams({ limit: '100' });
    if (language) params.set('language', language);
    if (startingAfter) params.set('starting_after', startingAfter);
    const resp = await fetch(`${BASE}/voices/?${params}`, { headers: headers() });
    if (!resp.ok) throw new Error(`listVoices ${resp.status}: ${await resp.text()}`);
    const body = await resp.json();
    const page: CartesiaVoice[] = (body.data ?? []).map((v: Record<string, unknown>) => ({
      id: String(v.id), name: String(v.name ?? ''), description: String(v.description ?? ''),
      language: String(v.language ?? ''),
    }));
    out.push(...page);
    if (!body.has_more || page.length === 0) break;
    startingAfter = page[page.length - 1].id;
  }
  return out;
}

export async function cartesiaTtsBytes(opts: { voiceId: string; transcript: string; language: string }) {
  const started = Date.now();
  const resp = await fetch(`${BASE}/tts/bytes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model_id: 'sonic-3.5',
      transcript: opts.transcript,
      voice: { mode: 'id', id: opts.voiceId },
      language: opts.language,
      output_format: { container: 'wav', encoding: 'pcm_f32le', sample_rate: 24000 },
    }),
  });
  if (!resp.ok || !resp.body) throw new Error(`tts/bytes ${resp.status}: ${await resp.text()}`);
  const reader = resp.body.getReader();
  const parts: Buffer[] = [];
  let ttfaMs = -1;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (ttfaMs < 0) ttfaMs = Date.now() - started;
    parts.push(Buffer.from(value));
  }
  return { audio: Buffer.concat(parts), ttfaMs, totalMs: Date.now() - started };
}

export async function cartesiaLocalize(opts: {
  voiceId: string; name: string; description: string;
  originalSpeakerGender: 'male' | 'female'; dialect: 'us' | 'uk' | 'au' | 'in' | 'so';
}): Promise<{ id: string }> {
  const resp = await fetch(`${BASE}/voices/localize`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      voice_id: opts.voiceId, name: opts.name, description: opts.description,
      language: 'en', original_speaker_gender: opts.originalSpeakerGender,
      dialect: opts.dialect,
    }),
  });
  if (!resp.ok) throw new Error(`localize ${resp.status}: ${await resp.text()}`);
  const body = await resp.json();
  return { id: String(body.id) };
}
