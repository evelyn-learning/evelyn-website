// scripts/tutor/voice-harness/bilingual-ja.ts
//
// Japanese + English (bilingual tutor) bake-off, no human speaker needed.
//
// LEARNER side: synthesise what a Japanese learner of English says — English
// lines spoken by Japanese-native Cartesia voices with `language:'en'` (the
// voice keeps its native accent, per Cartesia's multilingual-voices doc, so
// this approximates Japanese-accented English), Japanese questions, and mixed
// Japanese/English turns — then stream every clip through each STT config and
// score it against the script.
//
// TUTOR side: synthesise the tutor's Japanese, English and mixed lines with
// candidate bilingual voices, transcribe them back with the best STT config,
// and score the round trip as an intelligibility proxy.
//
// Synthetic speech is cleaner than real learners (no hesitation, no katakana
// English, perfect mic) — treat the numbers as a floor check that rules
// configurations OUT, not as proof that one works with real people.
//
// Usage: npx tsx scripts/tutor/voice-harness/bilingual-ja.ts [--side learner|tutor|both]
// PAID: Cartesia TTS + Ink, Deepgram, OpenAI transcription (a few cents a run).

import fs from 'node:fs';
import path from 'node:path';
import { requireKey } from './env';
import { runSttClip } from './stt-clients';
import type { SttEngine } from './types';

const SR = 16000;
const OUT = path.join(process.cwd(), 'artifacts', 'voice-harness', 'bilingual', new Date().toISOString().replace(/[:.]/g, '-'));

// ── voices ──────────────────────────────────────────────────────────────
const LEARNER_VOICES = [
  { id: 'aa3ccc4a-cfd8-405c-acf5-1873a527b006', label: 'Naoki (ja, m)' },
  { id: '59d4fd2f-f5eb-4410-8105-58db7661144f', label: 'Yuki (ja, f)' },
  { id: 'b8e1169c-f16a-4064-a6e0-95054169e553', label: 'Takashi (ja, m)' },
];
// Candidate TUTOR voices: English-native voices that Cartesia also lists
// under Japanese (multilingual), plus Japanese-native explainer voices.
const TUTOR_VOICES = [
  { id: 'a5136bf9-224c-4d76-b823-52bd5efcffcc', label: 'Jameson (en, multilingual)' },
  { id: '2747b6cf-fa34-460c-97db-267566918881', label: 'Allie (en, multilingual)' },
  { id: 'ec1e269e-9ca0-402f-8a18-58e0e022355a', label: 'Ariana (en, multilingual)' },
  { id: 'ef191366-f52f-447a-a398-ed8c0f2943a1', label: 'Archie (en-GB, multilingual)' },
  { id: 'cb21b4af-0e46-44f7-9128-51be7f898311', label: 'Yuzuki (ja, explainer)' },
  { id: '14c639be-eccb-447c-949e-112bd6dd326a', label: 'Ryota (ja, clear lead)' },
];

// ── scripts (taken from GDI's two sample units) ─────────────────────────
type Kind = 'en' | 'ja' | 'mixed';
interface Line { id: string; kind: Kind; text: string; ttsLanguage: 'en' | 'ja' }

const LEARNER_LINES: Line[] = [
  { id: 'en-free-monday', kind: 'en', ttsLanguage: 'en', text: 'Are you free on Monday at three p.m.?' },
  { id: 'en-busy-then', kind: 'en', ttsLanguage: 'en', text: "Sorry, but I'm busy then." },
  { id: 'en-yes-i-have', kind: 'en', ttsLanguage: 'en', text: 'Yes, I have.' },
  { id: 'en-sounds-good', kind: 'en', ttsLanguage: 'en', text: 'Sounds good.' },
  { id: 'en-discuss', kind: 'en', ttsLanguage: 'en', text: 'Could we meet to discuss the project?' },
  { id: 'en-away', kind: 'en', ttsLanguage: 'en', text: 'Unfortunately, I will be away on business at that time.' },
  { id: 'en-nagara', kind: 'en', ttsLanguage: 'en', text: 'I went to the Nagara River in Gifu with my older sister.' },
  { id: 'en-train-left', kind: 'en', ttsLanguage: 'en', text: 'The train had already left when we arrived at the station.' },
  { id: 'ja-repeat', kind: 'ja', ttsLanguage: 'ja', text: 'すみません、もう一度ゆっくり言ってください。' },
  { id: 'ja-difference', kind: 'ja', ttsLanguage: 'ja', text: '現在完了形と過去形の違いがよくわかりません。' },
  { id: 'ja-polite', kind: 'ja', ttsLanguage: 'ja', text: 'もっと丁寧な言い方はありますか？' },
  { id: 'ja-tuesday', kind: 'ja', ttsLanguage: 'ja', text: '火曜日の午後なら大丈夫です。' },
  { id: 'mx-rearrange', kind: 'mixed', ttsLanguage: 'ja', text: 'rearrangeってどういう意味ですか？' },
  { id: 'mx-does-monday', kind: 'mixed', ttsLanguage: 'ja', text: 'Does Monday work for youは丁寧な言い方ですか？' },
  { id: 'mx-sorry-wait', kind: 'mixed', ttsLanguage: 'ja', text: 'Sorry、ちょっと待ってください。' },
  { id: 'mx-meeting', kind: 'mixed', ttsLanguage: 'ja', text: '明日のmeetingのagendaを作りたいです。' },
];

const TUTOR_LINES: Line[] = [
  { id: 't-en-roleplay', kind: 'en', ttsLanguage: 'en', text: "Hi, it's Kim. Do you have time to rehearse my presentation for the managers' meeting?" },
  { id: 't-en-feedback', kind: 'en', ttsLanguage: 'en', text: 'Nice. That works for me is a natural way to accept. Now try declining politely.' },
  { id: 't-ja-explain', kind: 'ja', ttsLanguage: 'ja', text: '現在完了形は、過去の経験が今につながっているときに使います。' },
  { id: 't-ja-encourage', kind: 'ja', ttsLanguage: 'ja', text: 'いいですね。では、もう一度英語で言ってみましょう。' },
  { id: 't-mx-polite', kind: 'mixed', ttsLanguage: 'ja', text: 'Could we meetは、Can we meetよりも丁寧な言い方です。' },
  { id: 't-mx-busy', kind: 'mixed', ttsLanguage: 'ja', text: '断るときは、Sorry, but I am busy thenのあとに別の時間を提案しましょう。' },
];

// ── STT configurations under test ───────────────────────────────────────
interface SttConfig { key: string; engine: SttEngine; language?: string }
const STT_CONFIGS: SttConfig[] = [
  { key: 'ink2 (no language = prod today)', engine: 'ink2' },
  { key: 'ink2 en', engine: 'ink2', language: 'en' },
  { key: 'ink2 ja', engine: 'ink2', language: 'ja' },
  { key: 'deepgram multi', engine: 'deepgram', language: 'multi' },
  { key: 'deepgram ja', engine: 'deepgram', language: 'ja' },
  { key: 'openai whisper auto', engine: 'openai' },
];

// ── TTS ─────────────────────────────────────────────────────────────────
async function tts(voiceId: string, text: string, language: string): Promise<Buffer> {
  const resp = await fetch('https://api.cartesia.ai/tts/bytes', {
    method: 'POST',
    headers: {
      'X-API-Key': requireKey('CARTESIA_API_KEY'),
      'Cartesia-Version': '2026-03-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: 'sonic-3.6',
      transcript: text,
      voice: { mode: 'id', id: voiceId },
      language,
      output_format: { container: 'raw', encoding: 'pcm_s16le', sample_rate: SR },
    }),
  });
  if (!resp.ok) throw new Error(`tts ${resp.status}: ${await resp.text()}`);
  // 600 ms of leading/trailing silence so turn detectors see a clean utterance.
  const pad = Buffer.alloc(Math.round(SR * 0.6) * 2);
  return Buffer.concat([pad, Buffer.from(await resp.arrayBuffer()), pad]);
}

function wav(pcm: Buffer): Buffer {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

// ── scoring: mixed error rate ───────────────────────────────────────────
// Latin words count as one token each, every CJK/kana character as one token,
// after NFKC folding, lower-casing and dropping punctuation. Japanese scored
// by character is the standard CER convention; English by word is WER.
export function tokens(s: string): string[] {
  const t = s.normalize('NFKC').toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\p{L}\p{N}'\s]/gu, ' ');
  const out: string[] = [];
  for (const m of t.matchAll(/[a-z0-9']+|\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|ー/gu)) out.push(m[0]);
  return out;
}
export function errorRate(ref: string, hyp: string): number {
  const r = tokens(ref), h = tokens(hyp);
  if (r.length === 0) return h.length ? 1 : 0;
  const d = Array.from({ length: r.length + 1 }, (_, i) => [i, ...Array(h.length).fill(0)]);
  for (let j = 1; j <= h.length; j++) d[0][j] = j;
  for (let i = 1; i <= r.length; i++) for (let j = 1; j <= h.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (r[i - 1] === h[j - 1] ? 0 : 1));
  }
  return d[r.length][h.length] / r.length;
}

interface Row { side: string; voice: string; line: string; kind: Kind; stt: string; ref: string; hyp: string; err: number; ms: number }

async function transcribe(pcm: Buffer, cfg: SttConfig, evLog: string) {
  const events: object[] = [];
  try {
    const r = await runSttClip(cfg.engine, pcm, { realtimePace: false, language: cfg.language, onEvent: (e) => events.push(e) });
    return { hyp: r.transcript, ms: r.finalLatencyMs };
  } catch (e) {
    return { hyp: `ERROR: ${(e as Error).message}`, ms: -1 };
  } finally {
    fs.writeFileSync(evLog, events.map((e) => JSON.stringify(e)).join('\n'));
  }
}

async function runSide(side: 'learner' | 'tutor', rows: Row[]) {
  const voices = side === 'learner' ? LEARNER_VOICES : TUTOR_VOICES;
  const lines = side === 'learner' ? LEARNER_LINES : TUTOR_LINES;
  // Tutor round trip: only the configs that can hear Japanese at all.
  const configs = side === 'learner' ? STT_CONFIGS : STT_CONFIGS.filter((c) => c.language === 'ja' || c.language === 'multi' || c.engine === 'openai');
  for (const v of voices) {
    for (const line of lines) {
      const base = `${side}__${v.label.split(' ')[0]}__${line.id}`;
      let pcm: Buffer;
      try { pcm = await tts(v.id, line.text, line.ttsLanguage); } catch (e) {
        console.log(`TTS FAIL ${base}: ${(e as Error).message}`); continue;
      }
      fs.writeFileSync(path.join(OUT, 'clips', `${base}.wav`), wav(pcm));
      await Promise.all(configs.map(async (cfg) => {
        const { hyp, ms } = await transcribe(pcm, cfg, path.join(OUT, 'events', `${base}__${cfg.key.replace(/\W+/g, '_')}.jsonl`));
        rows.push({ side, voice: v.label, line: line.id, kind: line.kind, stt: cfg.key, ref: line.text, hyp, err: errorRate(line.text, hyp), ms });
      }));
      process.stdout.write('.');
    }
  }
  process.stdout.write('\n');
}

function summary(rows: Row[]) {
  const out: string[] = [];
  for (const side of ['learner', 'tutor']) {
    const sr = rows.filter((r) => r.side === side);
    if (!sr.length) continue;
    out.push(`\n## ${side.toUpperCase()} — mean error rate by STT config × utterance kind (lower is better)\n`);
    out.push('| STT config | en | ja | mixed | all |');
    out.push('|---|---|---|---|---|');
    for (const key of [...new Set(sr.map((r) => r.stt))]) {
      const m = (k?: Kind) => {
        const xs = sr.filter((r) => r.stt === key && (!k || r.kind === k)).map((r) => r.err);
        return xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2) : '–';
      };
      out.push(`| ${key} | ${m('en')} | ${m('ja')} | ${m('mixed')} | ${m()} |`);
    }
    if (side === 'tutor') {
      out.push('\n### Tutor voices — mean round-trip error (best config per clip)\n');
      out.push('| voice | en | ja | mixed |');
      out.push('|---|---|---|---|');
      for (const v of [...new Set(sr.map((r) => r.voice))]) {
        const best = (k: Kind) => {
          const byLine = new Map<string, number>();
          for (const r of sr.filter((x) => x.voice === v && x.kind === k)) byLine.set(r.line, Math.min(byLine.get(r.line) ?? 9, r.err));
          const xs = [...byLine.values()];
          return xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2) : '–';
        };
        out.push(`| ${v} | ${best('en')} | ${best('ja')} | ${best('mixed')} |`);
      }
    }
  }
  return out.join('\n');
}

async function main() {
  const sideArg = process.argv.includes('--side') ? process.argv[process.argv.indexOf('--side') + 1] : 'both';
  fs.mkdirSync(path.join(OUT, 'clips'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'events'), { recursive: true });
  const rows: Row[] = [];
  if (sideArg !== 'tutor') await runSide('learner', rows);
  if (sideArg !== 'learner') await runSide('tutor', rows);
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(rows, null, 2));
  const md = summary(rows);
  fs.writeFileSync(path.join(OUT, 'summary.md'), md);
  console.log(md);
  console.log(`\nwrote ${OUT}`);
}

if (process.argv[1]?.endsWith('bilingual-ja.ts')) main().catch((e) => { console.error(e); process.exit(1); });
