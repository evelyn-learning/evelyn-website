// scripts/tutor/voice-harness/openai-realtime-tts.ts
// Control clips: the CURRENT production voice path (OpenAI Realtime,
// out-of-band response.create, verbatim readback) driven from Node.
import WebSocket from 'ws';
import { requireKey } from './env';
import { pcm16ToWav } from './audio-util';

const MODEL = process.env.TUTOR_PERCEPTION_MODEL || 'gpt-realtime-2';

export function openaiRealtimeTts(opts: { voice: string; text: string }):
  Promise<{ audio: Buffer; ttfaMs: number; totalMs: number }> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    let ttfaMs = -1;
    const parts: Buffer[] = [];
    const ws = new WebSocket(`wss://api.openai.com/v1/realtime?model=${MODEL}`, {
      headers: { Authorization: `Bearer ${requireKey('OPENAI_API_KEY')}` },
    });
    const timeout = setTimeout(() => { ws.close(); reject(new Error('openai tts timeout (45s)')); }, 45000);

    ws.on('open', () => {
      ws.send(JSON.stringify({
        type: 'session.update',
        session: { type: 'realtime', output_modalities: ['audio'], audio: { output: { voice: opts.voice, format: { type: 'audio/pcm', rate: 24000 } } } },
      }));
      ws.send(JSON.stringify({
        type: 'response.create',
        response: {
          conversation: 'none',
          output_modalities: ['audio'],
          instructions:
            'Repeat the following text verbatim, naturally, as a tutor speaking to a student. ' +
            'Do not add or omit anything:\n\n' + opts.text,
        },
      }));
    });
    ws.on('message', (raw) => {
      let msg: { type?: string; delta?: string } = {};
      try { msg = JSON.parse(raw.toString()); } catch { return; }
      if (msg.type === 'response.output_audio.delta' || msg.type === 'response.audio.delta') {
        if (ttfaMs < 0) ttfaMs = Date.now() - started;
        if (msg.delta) parts.push(Buffer.from(msg.delta, 'base64'));
      } else if (msg.type === 'response.done') {
        clearTimeout(timeout);
        ws.close();
        resolve({ audio: pcm16ToWav(Buffer.concat(parts), 24000), ttfaMs, totalMs: Date.now() - started });
      } else if (msg.type === 'error') {
        clearTimeout(timeout);
        ws.close();
        reject(new Error(`openai realtime error: ${raw.toString().slice(0, 300)}`));
      }
    });
    ws.on('error', (e) => { clearTimeout(timeout); reject(e); });
  });
}
