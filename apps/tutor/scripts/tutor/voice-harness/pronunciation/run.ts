// scripts/tutor/voice-harness/pronunciation/run.ts
// Pronunciation bake-off: Azure Pronunciation Assessment vs Speechace on the
// pron-ja corpus (five target words + two sentences, katakana-style and clear).
//
// Usage: npm run voice:pron [-- --vendor azure|speechace] [--clip <id>]
// Keys (apps/tutor/.env.local): AZURE_SPEECH_KEY + AZURE_SPEECH_REGION, SPEECHACE_KEY
// (optional SPEECHACE_HOST for a non-US-West subscription).
// PAID (free-tier quota): one request per clip per vendor — 14 clips × 2 = 28 max.
// Writes artifacts/voice-harness/pron/<runId>/results.json + compare.md.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import '../env'; // loads .env.local
import { wavToPcm16Mono } from '../audio-util';
import { assessAzureRaw } from '../../../../src/lib/tutor/pronunciation/azure';
import { assessSpeechaceRaw } from '../../../../src/lib/tutor/pronunciation/speechace';
import { normalizeAzure, normalizeSpeechace, azureProsodyFlags } from '../../../../src/lib/tutor/pronunciation/normalize';
import type { PronunciationResult, PronunciationVendor } from '../../../../src/lib/tutor/pronunciation/types';

const CORPUS_DIR = path.join(process.cwd(), 'scripts', 'tutor', 'voice-harness', 'corpus', 'pron-ja');
const VENDORS: PronunciationVendor[] = ['azure', 'speechace'];
const KEYS: Record<PronunciationVendor, string[]> = {
  azure: ['AZURE_SPEECH_KEY', 'AZURE_SPEECH_REGION'],
  speechace: ['SPEECHACE_KEY'],
};
/** A word is "flagged" when its score is below this, or the vendor marked an error / wrong stress. */
const FLAG_SCORE = 70;

type Planted = 'th' | 'bv' | 'katakana' | 'none';
interface PronClip { id: string; file: string; referenceText: string; planted: Planted[] }
interface VendorOutcome {
  vendor: PronunciationVendor;
  result?: PronunciationResult;
  prosodyFlags?: string[];
  raw?: unknown;
  error?: string;
}
interface ClipOutcome { clip: PronClip; vendors: VendorOutcome[] }

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

/** 16 kHz PCM16 mono from any WAV: parse directly when already canonical, else ffmpeg. */
function loadPcm16k(file: string): Buffer {
  try {
    const { sampleRate, pcm } = wavToPcm16Mono(fs.readFileSync(file));
    if (sampleRate === 16000) return pcm;
  } catch { /* not mono PCM16 — fall through to ffmpeg */ }
  const out = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', '16000', '-sample_fmt', 's16', '-f', 'wav', 'pipe:1'], { maxBuffer: 64 * 1024 * 1024 });
  return wavToPcm16Mono(out).pcm;
}

const flagged = (r: PronunciationResult) =>
  r.words.filter((w) => w.errorType !== 'none' || w.score < FLAG_SCORE || w.stress === 'wrong');

function worstPhoneme(w: PronunciationResult['words'][number]): string {
  if (!w.phonemes.length) return w.errorType === 'omission' ? '(omitted)' : '—';
  const p = w.phonemes.reduce((a, b) => (b.score < a.score ? b : a));
  return `/${p.ipa}/ ${Math.round(p.score)}`;
}

function vendorCells(o: VendorOutcome | undefined) {
  if (!o) return { overall: '—', flagged: '—', worst: '—', prosody: '—', latency: '—' };
  if (!o.result) return { overall: `error: ${(o.error ?? '').slice(0, 60).replace(/\|/g, '/')}`, flagged: '—', worst: '—', prosody: '—', latency: '—' };
  const r = o.result;
  const fw = flagged(r);
  const prosody = r.vendor === 'azure'
    ? [r.prosody !== undefined ? `prosody ${Math.round(r.prosody)}` : '', ...(o.prosodyFlags ?? [])].filter(Boolean).join('; ')
    : r.words.filter((w) => w.stress === 'wrong').map((w) => `${w.word}: stress wrong`).join('; ');
  return {
    overall: String(Math.round(r.overall)),
    flagged: fw.length ? fw.map((w) => `${w.word} (${Math.round(w.score)}${w.errorType !== 'none' ? `, ${w.errorType}` : ''})`).join(', ') : 'none',
    worst: fw.length ? fw.map((w) => `${w.word} ${worstPhoneme(w)}`).join(', ') : '—',
    prosody: prosody || '—',
    latency: String(r.latencyMs),
  };
}

// Which flagged phonemes count as "caught" for each planted error class.
const TH_IPA = new Set(['θ', 'ð']);
const BV_IPA = new Set(['b', 'v']);
function caught(o: VendorOutcome | undefined, planted: Planted): boolean | null {
  if (!o?.result) return null;
  const fw = flagged(o.result);
  const weak = (ipaSet: Set<string>) => fw.some((w) => w.phonemes.some((p) => ipaSet.has(p.ipa) && p.score < FLAG_SCORE));
  switch (planted) {
    case 'th': return weak(TH_IPA);
    case 'bv': return weak(BV_IPA);
    // katakana-style: extra/epenthetic vowels and flat stress → a flagged word, a stress error, or a prosody flag
    case 'katakana': return fw.length > 0 || (o.prosodyFlags?.length ?? 0) > 0;
    case 'none': return fw.length === 0; // "caught" = correctly left a clear clip unflagged
  }
}

function compareMd(runId: string, outcomes: ClipOutcome[], vendors: PronunciationVendor[]): string {
  const L: string[] = [`# Pronunciation bake-off — ${runId}`, '',
    `Vendors: ${vendors.join(', ')}. A word is flagged when the vendor marked an error, wrong stress, or scored it below ${FLAG_SCORE}.`, ''];
  for (const { clip, vendors: vs } of outcomes) {
    const az = vendorCells(vs.find((v) => v.vendor === 'azure'));
    const sa = vendorCells(vs.find((v) => v.vendor === 'speechace'));
    L.push(`## ${clip.id}`, '', `Reference: "${clip.referenceText}" · planted: ${clip.planted.join(', ')}`, '',
      '| | Azure | Speechace |', '|---|---|---|',
      `| overall | ${az.overall} | ${sa.overall} |`,
      `| flagged words | ${az.flagged} | ${sa.flagged} |`,
      `| worst phoneme per flagged word (IPA, score) | ${az.worst} | ${sa.worst} |`,
      `| prosody / stress flags | ${az.prosody} | ${sa.prosody} |`,
      `| latency ms | ${az.latency} | ${sa.latency} |`, '');
  }
  L.push('## What each vendor caught of the planted errors', '',
    '"none" rows count clear clips correctly left unflagged.', '',
    '| planted | clips | Azure caught | Speechace caught |', '|---|---|---|---|');
  for (const p of ['th', 'bv', 'katakana', 'none'] as Planted[]) {
    const withP = outcomes.filter((o) => o.clip.planted.includes(p));
    if (!withP.length) continue;
    const tally = (v: PronunciationVendor) => {
      const r = withP.map((o) => caught(o.vendors.find((x) => x.vendor === v), p)).filter((x): x is boolean => x !== null);
      return r.length ? `${r.filter(Boolean).length}/${r.length}` : '—';
    };
    L.push(`| ${p} | ${withP.length} | ${tally('azure')} | ${tally('speechace')} |`);
  }
  L.push('');
  return L.join('\n');
}

async function main() {
  const vendorArg = arg('vendor');
  if (vendorArg && !VENDORS.includes(vendorArg as PronunciationVendor)) {
    console.error(`Unknown --vendor "${vendorArg}". Valid: ${VENDORS.join(', ')}`);
    process.exit(1);
  }
  const vendors = vendorArg ? [vendorArg as PronunciationVendor] : VENDORS;
  const clipArg = arg('clip');

  const problems: string[] = [];
  const missingKeys = vendors.flatMap((v) => KEYS[v]).filter((k) => !process.env[k]);
  if (missingKeys.length) {
    problems.push(`missing ${missingKeys.join(' / ')} — add to apps/tutor/.env.local (never commit keys)`);
  }

  const clipsPath = path.join(CORPUS_DIR, 'clips.json');
  const all = (JSON.parse(fs.readFileSync(clipsPath, 'utf8')) as { clips: PronClip[] }).clips;
  const selected = clipArg ? all.filter((c) => c.id === clipArg) : all;
  if (clipArg && !selected.length) problems.push(`unknown --clip "${clipArg}". Ids: ${all.map((c) => c.id).join(', ')}`);
  const present = selected.filter((c) => {
    const ok = fs.existsSync(path.join(CORPUS_DIR, c.file));
    if (!ok) console.log(`- ${c.id}: ${c.file} not recorded yet, skipped`);
    return ok;
  });
  if (selected.length && !present.length) {
    problems.push(`no clips recorded — put 16 kHz mono WAVs named as in clips.json into ${CORPUS_DIR}/ (see README.md there)`);
  }
  if (problems.length) {
    for (const p of problems) console.error(`voice:pron: ${p}`);
    process.exit(1);
  }

  const runId = `run-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const runDir = path.join(process.cwd(), 'artifacts', 'voice-harness', 'pron', runId);
  fs.mkdirSync(runDir, { recursive: true });

  const outcomes: ClipOutcome[] = [];
  for (const clip of present) {
    const pcm = loadPcm16k(path.join(CORPUS_DIR, clip.file));
    const vs: VendorOutcome[] = [];
    for (const vendor of vendors) {
      try {
        if (vendor === 'azure') {
          const { json, latencyMs } = await assessAzureRaw(pcm, clip.referenceText, {
            key: process.env.AZURE_SPEECH_KEY!, region: process.env.AZURE_SPEECH_REGION!,
          });
          vs.push({ vendor, raw: json, result: { ...normalizeAzure(json), latencyMs }, prosodyFlags: azureProsodyFlags(json) });
        } else {
          const { json, latencyMs } = await assessSpeechaceRaw(pcm, clip.referenceText, {
            key: process.env.SPEECHACE_KEY!, host: process.env.SPEECHACE_HOST || undefined,
          });
          let result: PronunciationResult | undefined;
          let error: string | undefined;
          try { result = { ...normalizeSpeechace(json), latencyMs }; } catch (e) { error = String(e); }
          vs.push({ vendor, raw: json, result, error });
        }
        const last = vs[vs.length - 1];
        console.log(last.result
          ? `  ${vendor.padEnd(9)} ${clip.id} overall=${Math.round(last.result.overall)} flagged=${flagged(last.result).map((w) => w.word).join(',') || '-'} lat=${last.result.latencyMs}ms`
          : `  ${vendor.padEnd(9)} ${clip.id} ✗ ${last.error?.slice(0, 160)}`);
      } catch (e) {
        vs.push({ vendor, error: String(e) });
        console.error(`  ${vendor.padEnd(9)} ${clip.id} ✗ ${String(e).slice(0, 160)}`);
      }
    }
    outcomes.push({ clip, vendors: vs });
  }

  fs.writeFileSync(path.join(runDir, 'results.json'), JSON.stringify({ runId, createdAt: new Date().toISOString(), vendors, clips: outcomes }, null, 2));
  fs.writeFileSync(path.join(runDir, 'compare.md'), compareMd(runId, outcomes, vendors));
  console.log(`results → ${path.join(runDir, 'results.json')}`);
  console.log(`compare → ${path.join(runDir, 'compare.md')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
