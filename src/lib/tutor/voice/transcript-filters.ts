/**
 * Shared transcript filters for voice tutor engines.
 * Handles Whisper hallucination noise, profanity misrecognition, and duplicate detection.
 */

// Whisper commonly misrecognizes ambient sounds as profanity.
// These replacements map to acoustically similar, context-appropriate words.
const PROFANITY_REPLACEMENTS: Record<string, string> = {
  'condom': 'continuity',
  'condoms': 'continuity',
  'penis': 'Venus',
  'vagina': 'Regina',
  'cock': 'caulk',
  'cum': 'come',
  'shit': 'shift',
  'ass': 'gas',
  'damn': 'dam',
  'hell': 'held',
  'dick': 'thick',
  'bitch': 'pitch',
  'fuck': 'flux',
  'fucking': 'fluxing',
  'bastard': 'bustard',
  'crap': 'clap',
  'piss': 'psi',
  'whore': 'war',
  'slut': 'slot',
  'porn': 'born',
};

/**
 * Replace Whisper profanity misrecognitions with context-appropriate alternatives.
 */
export function filterTranscriptText(text: string): string {
  let filtered = text;
  for (const [bad, replacement] of Object.entries(PROFANITY_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${bad}\\b`, 'gi');
    filtered = filtered.replace(regex, replacement);
  }
  return filtered;
}

// Whisper hallucinations / background noise artifacts to ignore entirely.
// These are commonly produced when there's silence, background chatter, or ambient noise.
const NOISE_PATTERNS = new Set([
  'bye', 'bye bye', 'bye-bye', 'bye guys',
  'goodbye', 'good bye',
  'thank you', 'thanks',
  'you', 'the', 'a', 'i', 'um', 'uh', 'hmm', 'huh', 'oh',
  'so', 'and', 'but', 'like', 'well', 'right',
  'hello', 'hi', 'hey',
  // Common Whisper hallucinations on silence
  'thank you for watching', 'thanks for watching',
  'subscribe', 'like and subscribe',
  'music', 'applause', 'laughter',
]);

/**
 * Check if a transcript is noise/hallucination that should be discarded.
 */
export function isNoiseTranscript(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[.,!?;:]+/g, '').trim();
  // Exact match with known noise
  if (NOISE_PATTERNS.has(normalized)) return true;
  // Repeated words like "bye bye" or "hello hello hello" (2-3 identical words)
  const words = normalized.split(/\s+/);
  if (words.length >= 2 && words.length <= 3 && new Set(words).size === 1) return true;
  // Single word under 4 characters
  if (words.length === 1 && normalized.length < 4) return true;
  // Whisper hallucination: text is predominantly non-Latin script (Arabic, CJK, Devanagari, etc.)
  // This happens when Whisper processes background noise and outputs random foreign text.
  // Only filter if the session language is expected to be English/Latin.
  const nonLatinChars = normalized.replace(/[\u0000-\u024F\u1E00-\u1EFF\s\d.,!?;:'"()\-+*/=]/g, '');
  if (nonLatinChars.length > normalized.length * 0.5 && normalized.length > 3) return true;
  return false;
}

// Multi-language greeting patterns that indicate context loss mid-session
const CONTEXT_LOSS_PATTERNS = [
  // English
  /\b(welcome|nice to meet|how can i help|what brings you|what would you like to learn|shall we begin|let me introduce)\b/i,
  // German
  /\b(willkommen|freut mich|wie kann ich|was m[oö]chtest du lernen)\b/i,
  // Spanish
  /\b(bienvenido|mucho gusto|c[oó]mo puedo ayudar|qu[eé] te gustar[ií]a aprender)\b/i,
  // French
  /\b(bienvenue|enchant[eé]|comment puis-je|qu'est-ce que tu veux apprendre)\b/i,
  // Italian
  /\b(benvenuto|piacere|come posso aiutar|cosa vorresti imparare)\b/i,
  // Portuguese
  /\b(bem-vindo|prazer|como posso ajudar|o que voc[eê] gostaria de aprender)\b/i,
  // Russian (transliterated)
  /\b(dobro pozhalovat|zdravstvuyte|kak ya mogu pomoch)\b/i,
  // Japanese (transliterated)
  /\b(yokoso|hajimemashite|nani wo benkyou)\b/i,
  // Korean (transliterated)
  /\b(hwangyeong|mannaseo bangapseumnida)\b/i,
  // Mandarin (transliterated)
  /\b(huanying|ni hao|wo neng bang ni)\b/i,
];

/**
 * Check if a tutor response looks like a fresh greeting mid-session (context loss).
 */
export function isContextLossGreeting(text: string): boolean {
  return CONTEXT_LOSS_PATTERNS.some(p => p.test(text));
}

/**
 * Check if a tutor response is a duplicate of recent messages.
 * Returns true if the text matches any of the recent tutor messages.
 */
export function isDuplicateResponse(text: string, recentTutorMessages: string[]): boolean {
  const cleanText = text.trim().toLowerCase();
  return recentTutorMessages.some(m => {
    const cleanRecent = m.trim().toLowerCase();
    return cleanText === cleanRecent || cleanRecent.includes(cleanText) || cleanText.includes(cleanRecent);
  });
}
