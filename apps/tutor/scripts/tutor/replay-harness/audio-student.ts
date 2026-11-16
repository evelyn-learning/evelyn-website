/**
 * Replay harness — the audio student (Task 6d).
 *
 * Plays a REAL learner's recorded turns (./cut-clips.ts made them from the session
 * recording) into the v2 voice client through a fake microphone. The learner's words
 * stay fixed; per tutor turn a model picks the ONE clip whose words best answer the
 * tutor's latest turn, keeping roughly the real order. A clip is used once, except a
 * short acknowledgement ("Yes.", "I'm ready.") which may come back. When nothing fits
 * the closest clip is played and the pick is marked misfit.
 *
 * Also here: the page-side init script (the fake microphone, the playback clock) as a
 * string — tsx wraps named functions in a helper the page does not have.
 */
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { loadApiKey } from '../../tutor-e2e/llm';
import { SCRIPTED_STUDENT_MODEL_ID, type CompleteFn } from './scripted-student';

export type AudioClip = { n: number; text: string; sec: number; words: number; wps: number; check: string };
export type ClipPick = { n: number; fit: 'ok' | 'misfit'; why: string } | { end: true; why: string };

/** Clips a replay may play: an "empty" cut (no speech found at that time) is left out. */
export function loadClips(dir: string): AudioClip[] {
  const all = JSON.parse(fs.readFileSync(path.join(dir, 'clips.json'), 'utf8')) as AudioClip[];
  return all.filter((c) => c.check !== 'empty' && fs.existsSync(clipPath(dir, c.n)));
}
export const clipPath = (dir: string, n: number) => path.join(dir, 'clips', `${String(n).padStart(2, '0')}.wav`);

/** A short acknowledgement may be played more than once. */
export const isShortAck = (text: string) => text.split(/\s+/).filter(Boolean).length <= 3 && /^(oh,?\s*)?(yes|yeah|okay|ok|i'?m ready|ready|sure|thank you|no)\b/i.test(text.trim());

export function buildPickPrompt(who: string, clips: AudioClip[], used: number[], history: Array<{ role: 'tutor' | 'student'; text: string }>, tutorSaid: string): string {
  const next = clips.find((c) => !used.includes(c.n));
  const list = clips.map((c) => {
    const reuse = used.includes(c.n) ? (isShortAck(c.text) ? ' (used; a short ack, may repeat)' : ' (USED — do not pick)') : '';
    return `  #${c.n}${reuse}: ${c.text}`;
  }).join('\n');
  const recent = history.slice(-6).map((t) => `${t.role === 'tutor' ? 'TUTOR' : 'LEARNER'}: ${t.text.slice(0, 500)}`).join('\n');
  return [
    `You replay a real English learner (${who}) against a tutor whose questions may differ from the real session. The learner can only say one of the lines they really recorded, listed below in the real order.`,
    'Pick the ONE line the learner plays next, in reply to the tutor\'s latest turn.',
    'Rules:',
    '- Prefer the line that best answers or reacts to what the tutor just said or asked (same question, same sentence to repeat, a request to stop or move on, a "please repeat" when the tutor is long or unclear).',
    `- Keep roughly the real order: among lines that fit about equally well, take the earliest unused one${next ? ` (the earliest unused is #${next.n})` : ''}. Do not skip far ahead unless the tutor has moved there.`,
    '- A line marked USED is never picked. A used short ack may be picked again.',
    '- A retry after a correction: pick the learner\'s next attempt at that sentence if one exists.',
    '- If no line fits, pick the closest anyway and set "fit":"misfit".',
    '- Return {"end":true} only when the tutor has closed the session (said goodbye) and the learner has nothing left to say, or every line that could still fit is used.',
    '',
    'The learner\'s recorded lines:',
    list,
    '',
    'Recent session:',
    recent || '(start)',
    '',
    `TUTOR (latest): ${tutorSaid.slice(0, 1500)}`,
    '',
    'Reply with ONE line of JSON and nothing else: {"n":<line number>,"fit":"ok"|"misfit","why":"<a few words>"} or {"end":true,"why":"<a few words>"}.',
  ].join('\n');
}

export function parsePick(raw: string, clips: AudioClip[], used: number[]): ClipPick {
  const m = raw.match(/\{[\s\S]*\}/);
  try {
    const o = JSON.parse(m ? m[0] : raw) as { n?: unknown; fit?: unknown; why?: unknown; end?: unknown };
    const why = typeof o.why === 'string' ? o.why.slice(0, 120) : '';
    if (o.end === true) return { end: true, why };
    const n = Number(o.n);
    const clip = clips.find((c) => c.n === n);
    if (clip && (!used.includes(n) || isShortAck(clip.text))) return { n, fit: o.fit === 'misfit' ? 'misfit' : 'ok', why };
    // A used or unknown line: the earliest unused one, marked misfit.
    const next = clips.find((c) => !used.includes(c.n));
    return next ? { n: next.n, fit: 'misfit', why: `picked #${String(o.n)} (used or unknown) → earliest unused` } : { end: true, why: 'no lines left' };
  } catch {
    const next = clips.find((c) => !used.includes(c.n));
    return next ? { n: next.n, fit: 'misfit', why: 'unreadable pick → earliest unused' } : { end: true, why: 'no lines left' };
  }
}

let client: Anthropic | null = null;
const haiku: CompleteFn = async (system, messages) => {
  if (!client) client = new Anthropic({ apiKey: loadApiKey() });
  const msg = await client.messages.create({ model: SCRIPTED_STUDENT_MODEL_ID, max_tokens: 200, temperature: 0, system, messages });
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim();
};

export async function pickClip(who: string, clips: AudioClip[], used: number[], history: Array<{ role: 'tutor' | 'student'; text: string }>, tutorSaid: string, opts?: { complete?: CompleteFn }): Promise<ClipPick> {
  if (!clips.some((c) => !used.includes(c.n) || isShortAck(c.text))) return { end: true, why: 'no lines left' };
  const complete = opts?.complete ?? haiku;
  const raw = await complete('You choose which recorded line a replayed learner says next. Answer with JSON only.', [{ role: 'user', content: buildPickPrompt(who, clips, used, history, tutorSaid) }]);
  return parsePick(raw, clips, used);
}

/** The 16-bit samples of a mono 24 kHz WAV written by cut-clips.ts, base64 (for page.evaluate). */
export function clipPcmBase64(file: string): { b64: string; sec: number } {
  const buf = fs.readFileSync(file);
  const pcm = buf.subarray(44);
  return { b64: pcm.toString('base64'), sec: pcm.length / 2 / 24000 };
}

/**
 * Page init script: getUserMedia returns a track from a WebAudio graph the harness feeds
 * (a -61 dBFS noise floor (near the real recordings' -59 to -65), and a clip at real time when window.__mic.play(b64) is called),
 * and window.__play.end (ms, Date.now clock) is when the last scheduled tutor buffer ends.
 */
export const FAKE_MIC_INIT = `
(function () {
  var state = { ctx: null, dest: null, playingUntil: 0, plays: 0, gum: 0 };
  window.__mic = state;
  window.__play = { end: 0, buffers: 0 };
  function ensure() {
    if (state.ctx) return state;
    var C = window.AudioContext || window.webkitAudioContext;
    var ctx = new C({ sampleRate: 24000 });
    ctx.__harnessMic = true;
    var dest = ctx.createMediaStreamDestination();
    var noise = ctx.createBuffer(1, 48000, 24000); var d = noise.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.0015;
    var src = ctx.createBufferSource(); src.buffer = noise; src.loop = true; src.connect(dest); src.__harness = true; src.start();
    state.ctx = ctx; state.dest = dest;
    return state;
  }
  state.play = function (b64) {
    var s = ensure(); if (s.ctx.state !== 'running') s.ctx.resume();
    var bin = atob(b64); var n = bin.length >> 1; var buf = s.ctx.createBuffer(1, n, 24000); var ch = buf.getChannelData(0);
    for (var i = 0; i < n; i++) { var v = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8); if (v >= 32768) v -= 65536; ch[i] = v / 32768; }
    var node = s.ctx.createBufferSource(); node.buffer = buf; node.__harness = true; node.connect(s.dest); node.start();
    s.plays += 1; s.playingUntil = Date.now() + buf.duration * 1000;
    return buf.duration;
  };
  // Every socket the page opens, with its open and close time (the recogniser's minutes come from these).
  window.__ws = [];
  var W = window.WebSocket;
  var Wrapped = function (url, protocols) {
    var ws = protocols === undefined ? new W(url) : new W(url, protocols);
    var rec = { u: String(url).replace(/[?].*/, ''), t0: Date.now(), t1: 0 };
    window.__ws.push(rec);
    ws.addEventListener('close', function () { rec.t1 = Date.now(); });
    return ws;
  };
  Wrapped.prototype = W.prototype; Wrapped.CONNECTING = 0; Wrapped.OPEN = 1; Wrapped.CLOSING = 2; Wrapped.CLOSED = 3;
  window.WebSocket = Wrapped;
  var md = navigator.mediaDevices;
  if (md && md.getUserMedia) {
    var orig = md.getUserMedia.bind(md);
    md.getUserMedia = function (c) {
      if (c && c.video) return orig(c);
      var s = ensure(); if (s.ctx.state !== 'running') s.ctx.resume();
      s.gum += 1;
      return Promise.resolve(new MediaStream([s.dest.stream.getAudioTracks()[0].clone()]));
    };
  }
  var start = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (when) {
    try {
      if (!this.__harness && this.buffer && !(this.context && this.context.__harnessMic)) {
        var c = this.context; var at = Math.max(when || 0, c.currentTime);
        var end = Date.now() + ((at - c.currentTime) + this.buffer.duration / (this.playbackRate.value || 1)) * 1000;
        if (end > window.__play.end) window.__play.end = end;
        window.__play.buffers += 1;
      }
    } catch (e) {}
    return start.apply(this, arguments);
  };
})();
`;

/** Silent stand-in for a TTS reply: zero Float32 samples at 24 kHz, about as long as the words would take. */
export function silentTtsBody(text: string, secPerWord = 0.42): Buffer {
  const words = text.split(/\s+/).filter(Boolean).length || 1;
  return Buffer.alloc(Math.max(2400, Math.round(words * secPerWord * 24000)) * 4);
}
