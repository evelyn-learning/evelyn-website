/**
 * Shared transcript filters for voice tutor engines.
 * Handles Whisper hallucination noise, profanity misrecognition, and duplicate detection.
 */

// Tokens that are either (a) Whisper misrecognitions of ambient sounds, or
// (b) genuine profanity from a frustrated student. Either way we no longer
// silently rewrite them — both cases are better handled by flagging the
// utterance as 'uncertain' so the tutor asks for clarification. Previous
// versions rewrote these to acoustically-similar academic-sounding words
// (e.g. "fuck" → "flux", "shit" → "shift"), which caused the tutor to
// receive quietly-edited text and respond to a word the student never said.
const PROFANITY_SIGNAL_TOKENS = new Set<string>([
  'condom', 'condoms',
  'penis', 'vagina',
  'cock', 'cum',
  'shit', 'ass', 'damn', 'hell', 'dick', 'bitch',
  'fuck', 'fucking',
  'bastard', 'crap', 'piss',
  'whore', 'slut', 'porn',
]);

/**
 * Regex built from PROFANITY_SIGNAL_TOKENS that also matches stretched
 * emphatic forms: "fuuuck", "shiiit", "daaamn". Each letter is allowed to
 * repeat 1+ times so `fuck` → /\bf+u+c+k+\b/, catching emphatic spellings
 * without needing a separate entry for every variant.
 */
const PROFANITY_SIGNAL_REGEX = new RegExp(
  `\\b(${Array.from(PROFANITY_SIGNAL_TOKENS)
    .map((t) => t.split('').map((c) => (/[a-z]/i.test(c) ? `${c}+` : c)).join(''))
    .join('|')})\\b`,
  'i',
);

/**
 * Does this transcript contain a token that signals likely misrecognition
 * OR genuine frustration? Either case should be routed to 'uncertain' so the
 * tutor can ask rather than silently receive rewritten text.
 */
function hasProfanitySignal(text: string): boolean {
  return PROFANITY_SIGNAL_REGEX.test(text);
}

// Common Whisper spelling errors that leak into tutoring transcripts.
// Stick to HIGH-CONFIDENCE corrections — never map a real word to a different
// real word. Prefer tokens that aren't English words at all (misspellings
// like "knoe", "whaty", "defiantly", "youre") so we never clobber valid
// utterances. Each entry maps a lowercase misspelling → correct form.
const WHISPER_SPELLCHECK: Record<string, string> = {
  knoe: 'know',
  konw: 'know',
  wht: 'what',
  whaty: 'what',
  yess: 'yes',
  yepp: 'yep',
  okk: 'ok',
  okkk: 'ok',
  okey: 'okay',
  alot: 'a lot',
  thier: 'their',
  recieve: 'receive',
  seperately: 'separately',
  seperate: 'separate',
  definately: 'definitely',
  defiantly: 'definitely',
  exsample: 'example',
  excample: 'example',
  wont: "won't",
  dont: "don't",
  cant: "can't",
  isnt: "isn't",
  arent: "aren't",
  wasnt: "wasn't",
  werent: "weren't",
  doesnt: "doesn't",
  didnt: "didn't",
  wouldnt: "wouldn't",
  shouldnt: "shouldn't",
  couldnt: "couldn't",
  youre: "you're",
  theyre: "they're",
  whats: "what's",
  thats: "that's",
  lets: "let's",
  // Transcription artifacts where Whisper drops/replaces letters
  hte: 'the',
  teh: 'the',
  nad: 'and',
  ot: 'to',
  adn: 'and',
};

/**
 * Apply a small spellcheck pass for high-frequency Whisper misspellings so
 * downstream validators (genetics/blood-type/math) see clean tokens.
 *
 * Previously also rewrote profanity-like tokens ("fuck" → "flux") but that
 * mangled the meaning of legitimate student frustration AND hid Whisper
 * misrecognition. Those tokens are now handled by classifyTranscript which
 * returns 'uncertain' instead, so the tutor asks for clarification.
 */
export function filterTranscriptText(text: string): string {
  let filtered = text;
  for (const [bad, good] of Object.entries(WHISPER_SPELLCHECK)) {
    const regex = new RegExp(`\\b${bad}\\b`, 'gi');
    filtered = filtered.replace(regex, (match) => {
      // Preserve the case of the first character when the match is title-cased.
      if (match[0] === match[0].toUpperCase() && match.slice(1) === match.slice(1).toLowerCase()) {
        return good[0].toUpperCase() + good.slice(1);
      }
      return good;
    });
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

// Longer Whisper hallucinations — typically YouTube video outros or subtitle
// watermarks the model has seen enough in training data to emit on
// silent/ambient audio. Observed in the real 2026-04-22 Dutch student
// session; the bank covers common variants across languages so minor
// rewordings ("…next video" vs "…next one") still catch.
const NOISE_REGEXES: RegExp[] = [
  // ── Subscribe / like / comment prompts ─────────────────────────────────
  // English
  /\bplease (subscribe|like|comment|share)\b/i,
  /\b(don'?t forget to|remember to|make sure to) (subscribe|like|comment|share)\b/i,
  /\bsubscribe to (my|our|the) channel\b/i,
  /\bhit the (bell|like|subscribe) (icon|button)\b/i,
  /\bfeel free to (comment|like|share|subscribe)\b/i,
  /\bsmash that like button\b/i,
  // Dutch — from the 2026-04-22 session
  /\babonneer je (op|dan op) (mijn|onze|het) kana+al\b/i,
  /\bvergeet niet te (abonneren|liken|reageren)\b/i,
  // German
  /\babonniert (den|unseren|meinen) kanal\b/i,
  /\bvergesst nicht zu abonnieren\b/i,
  // Spanish
  /\bsuscr[ií]banse (al|a mi|a nuestro) canal\b/i,
  /\bno olvides (suscribirte|darle like)\b/i,
  // French
  /\b(abonnez-vous|abonne-toi)\b/i,
  /\bn'oublie(z)? pas de (vous )?abonner\b/i,
  // Portuguese
  /\b(se inscrevam|inscreva-se) no (meu|nosso|canal)\b/i,

  // ── Sign-off / outro hallucinations ────────────────────────────────────
  /\bi'?ll see you (guys |all )?in the next (one|video|episode)\b/i,
  /\bsee you (next time|in the next)\b/i,
  /\bthanks? for watching\b/i,
  /\bthank you (all |so much )?for watching\b/i,
  /\buntil next time\b/i,

  // ── Subtitle watermarks ────────────────────────────────────────────────
  /\bsous-?titr(es|age)\b.*\bamara\.org\b/i,
  /\bsous-?titr(es|age)\b.*(r[eé]alis[eé]s?|par la communaut[eé])\b/i,
  /\btranscri(ption|bed) by\b.*\.(org|com|net)\b/i,
  /\bsubtitles? by\b.*\.(org|com|net)\b/i,
  /\bcaptioned? by\b.*\.(org|com|net)\b/i,

  // ── Broadcast register (TV, radio, ads) — when audio picks up the room ─
  // Advertising tells
  /\bbrought to you by\b/i,
  /\bsponsored by\b/i,
  /\bfor (just |only )?\$\d/i,              // "for just $19.99"
  /\bcall (now|today|1[- ]?8\d\d)\b/i,      // "call now", "call 1-800..."
  /\bvisit (us at |our website )?www\./i,
  /\bterms and conditions apply\b/i,
  /\blimited time offer\b/i,
  /\border (now|today)\b/i,
  // News / weather anchor register
  /\b(breaking|this just in|coming up|stay tuned|we'?ll be right back)\b/i,
  /\band now (the|for) (weather|sports|news|traffic)\b/i,
  /\b(good morning|good evening|good afternoon) (everyone|folks|america|everybody)\b/i,
  // Song-lyric / jingle hallucinations (Whisper often emits "♪")
  /♪|♫|🎵|🎶/,
  /\[(music|applause|laughter|cheering|singing|instrumental)\]/i,
  // Generic URLs and phone numbers appearing in speech — almost always TV
  /\bhttps?:\/\//i,
  /\bwww\.[a-z0-9-]+\.(com|org|net|co)\b/i,
  /\b\d{3}[- ]\d{3}[- ]\d{4}\b/,            // NANP phone
  /\b1[- ]?8\d\d[- ]?[a-z0-9]{3,}\b/i,      // 1-800 vanity
];

/**
 * Mostly-single-character "phonetic garbage" — when Whisper transcribes
 * non-speech audio as a stream of single letters separated by spaces.
 * Example from the 2026-04-22 session:
 *   "c o u b e very s i c t i c w a t w a t s i c t i c f u i t f r u f i i"
 * Requires enough length AND a high proportion of 1-char tokens so we
 * don't false-flag short legitimate utterances like "2 + y = 8".
 */
function isPhoneticGarbage(text: string): boolean {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length < 6) return false;
  const singleCharLetterTokens = tokens.filter((t) => t.length === 1 && /[a-zA-Z]/.test(t)).length;
  // ≥60% of tokens single-letter → garbage.
  return singleCharLetterTokens >= Math.ceil(tokens.length * 0.6);
}

/**
 * Stutter from audio glitches: "f-f-f-f-f-f-ck" or a single word repeated
 * four or more times in a row ("wacht wacht wacht wacht"). Neither form is
 * recoverable speech.
 */
function isStutter(text: string): boolean {
  // Three or more occurrences of "X-" (single letter + hyphen).
  if (/(?:[a-zA-Z]-){3,}/i.test(text)) return true;
  // Same word four or more times consecutively.
  const tokens = text.toLowerCase().replace(/[.,!?;:]+/g, '').trim().split(/\s+/).filter(Boolean);
  if (tokens.length >= 4) {
    for (let i = 0; i <= tokens.length - 4; i++) {
      if (tokens[i] === tokens[i + 1] && tokens[i] === tokens[i + 2] && tokens[i] === tokens[i + 3]) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if a transcript is noise/hallucination that should be discarded.
 */
export function isNoiseTranscript(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[.,!?;:]+/g, '').trim();
  // Exact match with known noise
  if (NOISE_PATTERNS.has(normalized)) return true;
  // Longer subscribe/outro/subtitle hallucinations
  if (NOISE_REGEXES.some((re) => re.test(text))) return true;
  // Repeated words like "bye bye" or "hello hello hello" (2-3 identical words)
  const words = normalized.split(/\s+/);
  if (words.length >= 2 && words.length <= 3 && new Set(words).size === 1) return true;
  // Single word under 4 characters
  if (words.length === 1 && normalized.length < 4) return true;
  // Phonetic garbage — mostly single letters separated by spaces
  if (isPhoneticGarbage(normalized)) return true;
  // Stutter — "f-f-f-f-ck" or "wacht wacht wacht wacht"
  if (isStutter(text)) return true;
  // Whisper hallucination: text is predominantly non-Latin script (Arabic, CJK, Devanagari, etc.)
  // This happens when Whisper processes background noise and outputs random foreign text.
  // Only filter if the session language is expected to be English/Latin.
  const nonLatinChars = normalized.replace(/[\u0000-\u024F\u1E00-\u1EFF\s\d.,!?;:'"()\-+*/=]/g, '');
  if (nonLatinChars.length > normalized.length * 0.5 && normalized.length > 3) return true;
  return false;
}

/** 3-way verdict for how the tutor should treat an incoming transcript. */
export type TranscriptClassification = 'clean' | 'uncertain' | 'noise';

/**
 * Classify an incoming student utterance:
 *   - 'noise'     → discard silently. Whisper hallucinations, YouTube
 *                   outros, TV/ad register, ambient-audio phonetic garbage.
 *   - 'uncertain' → forward to the tutor but WRAPPED so the model knows the
 *                   words may be wrong and should ask for clarification
 *                   rather than guessing. Currently triggered by: profanity
 *                   tokens (likely Whisper misrecognition OR real student
 *                   frustration — both warrant confirmation).
 *   - 'clean'     → forward verbatim (after the normal spellcheck pass).
 *
 * `isNoiseTranscript` remains exported for backward compatibility and
 * returns true iff this classifier returns 'noise'.
 */
export function classifyTranscript(text: string): TranscriptClassification {
  if (isNoiseTranscript(text)) return 'noise';
  if (hasProfanitySignal(text)) return 'uncertain';
  return 'clean';
}

/**
 * Wrap an 'uncertain' transcript so the tutor's system prompt can see that
 * the audio was unclear and instruct the model to ask for clarification.
 * Only the WRAPPED form should be forwarded to the model; never the raw
 * text when classification is 'uncertain'.
 */
export function wrapUncertainTranscript(text: string): string {
  return `[the student's audio was unclear; they may have said: "${text.trim()}"]`;
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
