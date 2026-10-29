// src/lib/tutor/pronunciation/normalize.ts
// Pure mappers from each vendor's raw JSON to PronunciationResult. No network
// here, so tests and the bake-off can import them freely.
import type { PronunciationErrorType, PronunciationResult } from './types';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

// ─── Azure ──────────────────────────────────────────────────────────────────
// Two documented shapes, both accepted:
//  - REST short audio (what azure.ts calls): scores sit directly on the node —
//    NBest[0].{AccuracyScore, FluencyScore, ProsodyScore, CompletenessScore,
//    PronScore}, Words[].{Word, AccuracyScore, ErrorType, Feedback.Prosody},
//    Words[].Phonemes[].{Phoneme, AccuracyScore}.
//  - Speech SDK JSON: the same fields wrapped in a `PronunciationAssessment`
//    object on NBest[0], each word and each phoneme.
// With prosody on, ErrorType can also be UnexpectedBreak / MissingBreak /
// Monotone — those are prosody flags (see azureProsodyFlags), not word errors.

/** The node's score fields: its `PronunciationAssessment` wrapper (SDK) or the node itself (REST). */
const azScores = (node: Obj): Obj => (isObj(node.PronunciationAssessment) ? node.PronunciationAssessment : node);

function azureNBest(json: unknown): Obj {
  if (!isObj(json)) throw new Error('azure: response is not a JSON object');
  const status = json.RecognitionStatus;
  if (status !== undefined && status !== 'Success') throw new Error(`azure: RecognitionStatus ${String(status)}`);
  const best = arr(json.NBest)[0];
  if (!isObj(best)) throw new Error('azure: response has no NBest[0]');
  return best;
}

function azureErrorType(v: unknown): PronunciationErrorType {
  switch (v) {
    case 'Mispronunciation': return 'mispronunciation';
    case 'Omission': return 'omission';
    case 'Insertion': return 'insertion';
    default: return 'none';
  }
}

export function normalizeAzure(json: unknown): PronunciationResult {
  const best = azureNBest(json);
  const pa = azScores(best);
  const words = arr(best.Words).filter(isObj).map((w) => {
    const wpa = azScores(w);
    return {
      word: String(w.Word ?? ''),
      score: num(wpa.AccuracyScore) ?? 0,
      errorType: azureErrorType(wpa.ErrorType),
      phonemes: arr(w.Phonemes).filter(isObj).map((p) => ({
        ipa: String(p.Phoneme ?? ''),
        score: num(azScores(p).AccuracyScore) ?? 0,
      })),
    };
  });
  return {
    vendor: 'azure',
    overall: num(pa.PronScore) ?? num(pa.AccuracyScore) ?? 0,
    words,
    prosody: num(pa.ProsodyScore),
    fluency: num(pa.FluencyScore),
    latencyMs: 0,
  };
}

/** Per-word prosody flags ("word: UnexpectedBreak", "word: Monotone"), in word order. */
export function azureProsodyFlags(json: unknown): string[] {
  const out: string[] = [];
  for (const w of arr(azureNBest(json).Words).filter(isObj)) {
    const wpa = azScores(w);
    const prosody = isObj(wpa.Feedback) && isObj(wpa.Feedback.Prosody) ? wpa.Feedback.Prosody : {};
    const types = new Set<string>();
    for (const part of [prosody.Break, prosody.Intonation]) {
      if (isObj(part)) for (const t of arr(part.ErrorTypes)) if (typeof t === 'string' && t !== 'None') types.add(t);
    }
    if (['UnexpectedBreak', 'MissingBreak', 'Monotone'].includes(String(wpa.ErrorType))) types.add(String(wpa.ErrorType));
    for (const t of types) out.push(`${String(w.Word ?? '')}: ${t}`);
  }
  return out;
}

// ─── Speechace ──────────────────────────────────────────────────────────────
// Score Text v9: { status, text_score: { word_score_list: [{ word, quality_score,
// quality_class, phone_score_list: [{ phone (ARPAbet, lower-case), stress_level,
// quality_score, sound_most_like }], syllable_score_list: [{ letters,
// stress_level (expected), predicted_stress_level, stress_score }] }],
// speechace_score: { pronunciation, fluency? } } }

/** Word score below which a word with no quality_class counts as mispronounced. */
const SPEECHACE_WORD_FAIL = 70;
/** Syllable stress_score below which the word's lexical stress counts as wrong. */
const SPEECHACE_STRESS_FAIL = 60;

const ARPA_IPA: Record<string, string> = {
  aa: 'ɑ', ae: 'æ', ao: 'ɔ', aw: 'aʊ', ay: 'aɪ', b: 'b', ch: 'tʃ', d: 'd', dh: 'ð',
  eh: 'ɛ', ey: 'eɪ', f: 'f', g: 'ɡ', hh: 'h', ih: 'ɪ', iy: 'i', jh: 'dʒ', k: 'k',
  l: 'l', m: 'm', n: 'n', ng: 'ŋ', ow: 'oʊ', oy: 'ɔɪ', p: 'p', r: 'ɹ', s: 's',
  sh: 'ʃ', t: 't', th: 'θ', uh: 'ʊ', uw: 'u', v: 'v', w: 'w', y: 'j', z: 'z', zh: 'ʒ',
};

/** ARPAbet phone (Speechace lower-case, optional stress digit) → IPA. Unknown phones pass through. */
export function arpabetToIpa(phone: string, stressLevel?: number | null): string {
  const m = /^([a-z]+)([012])?$/i.exec(phone.trim());
  if (!m) return phone;
  const base = m[1].toLowerCase();
  const stress = m[2] !== undefined ? Number(m[2]) : stressLevel;
  if (base === 'ah') return stress === 0 ? 'ə' : 'ʌ';
  if (base === 'er') return stress === 0 ? 'ɚ' : 'ɝ';
  return ARPA_IPA[base] ?? phone;
}

export function normalizeSpeechace(json: unknown): PronunciationResult {
  if (!isObj(json)) throw new Error('speechace: response is not a JSON object');
  if (json.status !== 'success') {
    throw new Error(`speechace: status ${String(json.status)} — ${String(json.short_message ?? '')} ${String(json.detail_message ?? '')}`.trim());
  }
  const ts = isObj(json.text_score) ? json.text_score : {};
  const sc = isObj(ts.speechace_score) ? ts.speechace_score : {};
  const words = arr(ts.word_score_list).filter(isObj).map((w) => {
    const score = num(w.quality_score) ?? 0;
    const cls = w.quality_class;
    const failed = typeof cls === 'string' ? cls !== 'pass' : score < SPEECHACE_WORD_FAIL;
    const syllables = arr(w.syllable_score_list).filter(isObj);
    let stress: 'ok' | 'wrong' | undefined;
    if (syllables.length > 1) {
      const wrong = syllables.some((s) =>
        (num(s.stress_score) ?? 100) < SPEECHACE_STRESS_FAIL ||
        (s.stress_level === 1 && s.predicted_stress_level === 0));
      stress = wrong ? 'wrong' : 'ok';
    }
    return {
      word: String(w.word ?? ''),
      score,
      errorType: (failed ? 'mispronunciation' : 'none') as PronunciationErrorType,
      phonemes: arr(w.phone_score_list).filter(isObj).map((p) => ({
        ipa: arpabetToIpa(String(p.phone ?? ''), num(p.stress_level) ?? null),
        score: num(p.quality_score) ?? 0,
      })),
      ...(stress ? { stress } : {}),
    };
  });
  return {
    vendor: 'speechace',
    overall: num(sc.pronunciation) ?? 0,
    words,
    fluency: num(sc.fluency),
    latencyMs: 0,
  };
}
