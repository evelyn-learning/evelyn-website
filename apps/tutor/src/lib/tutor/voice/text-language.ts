/**
 * 2026-10-16 (GAC v12–v14, Praveen: typed sessions follow the student's
 * language). The <text_mode> language rule sits at the end of a long prompt
 * whose core still says "one language per session" (for speech), and in the
 * live runs a student writing whole messages in Chinese was answered in
 * English. This reads the student's typed message and, when it is plainly
 * written in another language, puts a one-line reminder next to it.
 *
 * Scripts are read from Unicode ranges; Latin-script languages from a few
 * very common function words. Maths, symbols, problem labels and a single
 * foreign word never count. No model call.
 */

const SCRIPTS: ReadonlyArray<[RegExp, string]> = [
  [/[぀-ヿ]/g, 'Japanese'],
  [/[가-힯]/g, 'Korean'],
  [/[一-鿿]/g, 'Chinese'],
  [/[؀-ۿݐ-ݿ]/g, 'Arabic-script (Arabic, Urdu or Persian — reply in the one the student used)'],
  [/[ऀ-ॿ]/g, 'Devanagari (Hindi or Marathi — reply in the one the student used)'],
  [/[ঀ-৿]/g, 'Bengali'],
  [/[਀-੿]/g, 'Punjabi'],
  [/[઀-૿]/g, 'Gujarati'],
  [/[஀-௿]/g, 'Tamil'],
  [/[ఀ-౿]/g, 'Telugu'],
  [/[ಀ-೿]/g, 'Kannada'],
  [/[ഀ-ൿ]/g, 'Malayalam'],
  [/[฀-๿]/g, 'Thai'],
  [/[֐-׿]/g, 'Hebrew'],
  [/[Ͱ-Ͽ]/g, 'Greek'],
  [/[Ѐ-ӿ]/g, 'Cyrillic-script (Russian or Ukrainian — reply in the one the student used)'],
];

// Common function words; two distinct hits in one message name the language.
const LATIN: ReadonlyArray<[string, RegExp]> = [
  ['Spanish', /\b(?:el|la|los|las|es|que|por|para|con|una?|del|como|pero|porque|cuando|está|estoy|tengo|puedes|ayuda|gracias|hola|entiendo|qué|cómo|sí|también|ya)\b/gi],
  ['Portuguese', /\b(?:o|os|as|não|você|obrigad[oa]|com|uma?|para|porque|quando|está|estou|tenho|pode|ajuda|olá|entendo|também|é|isso)\b/gi],
  ['French', /\b(?:le|la|les|est|que|pour|avec|une?|des|du|comme|mais|parce|quand|je|suis|j'ai|peux|aide|merci|bonjour|comprends|aussi|c'est|oui)\b/gi],
  ['German', /\b(?:der|die|das|ist|und|nicht|ich|bin|habe|mit|für|ein|eine|wie|aber|weil|wenn|kannst|hilfe|danke|hallo|verstehe|auch|ja)\b/gi],
  ['Italian', /\b(?:il|lo|gli|è|che|per|con|una?|della|come|ma|perché|quando|sono|ho|puoi|aiuto|grazie|ciao|capisco|anche|sì)\b/gi],
  ['Vietnamese', /\b(?:là|của|và|không|tôi|bạn|có|được|này|cho|với|một|như|nhưng|vì|khi|giúp|cảm ơn|xin chào|hiểu)\b/gi],
  ['Indonesian or Malay', /\b(?:yang|dan|tidak|saya|anda|ada|ini|itu|untuk|dengan|seperti|tetapi|karena|kapan|bisa|tolong|terima kasih|halo|mengerti|juga)\b/gi],
  ['Turkish', /\b(?:ve|bir|bu|için|ile|değil|ben|sen|var|yok|nasıl|ama|çünkü|ne zaman|yardım|teşekkürler|merhaba|anlamadım|anladım|da|de)\b/gi],
  ['Swahili', /\b(?:na|ya|wa|kwa|ni|si|mimi|wewe|hii|hiyo|kama|lakini|kwa sababu|lini|saidia|asante|habari|naelewa|pia)\b/gi],
];

const ENGLISH = /\b(?:the|is|are|and|i|you|it|what|how|why|this|that|to|of|in|for|with|my|do|does|can|so|was|but|not|help|thanks?)\b/gi;

/** The language a typed message is plainly written in, when it is not
 *  English; null for English, maths, a label or too little text to tell. */
export function nonEnglishLanguageOf(text: string): string | null {
  const t = String(text ?? '').replace(/\$[^$]*\$|\\[a-z]+|[0-9^_=+*/()[\]{}<>≤≥.,:;!?'"`~|\\-]/gi, ' ');
  const letters = (t.match(/\p{L}/gu) ?? []).length;
  if (letters < 2) return null;
  let best: [string, number] | null = null;
  for (const [re, name] of SCRIPTS) {
    const n = (t.match(re) ?? []).length;
    if (n >= 2 && n / letters >= 0.3 && (!best || n > best[1])) best = [name, n];
  }
  // Japanese text mixes kana with Chinese characters: kana present ⇒ Japanese.
  if (best && /^Chinese$/.test(best[0]) && /[぀-ヿ]/.test(t)) best = ['Japanese', best[1]];
  if (best) return best[0];
  const words = t.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length < 3) return null;
  const english = new Set((t.match(ENGLISH) ?? []).map((w) => w.toLowerCase())).size;
  let latin: [string, number] | null = null;
  for (const [name, re] of LATIN) {
    const n = new Set((t.match(re) ?? []).map((w) => w.toLowerCase())).size;
    if (n >= 2 && n > english && (!latin || n > latin[1])) latin = [name, n];
  }
  return latin ? latin[0] : null;
}

/** The reminder put next to a typed message written in another language. */
export function formatStudentLanguageBlock(text: string): string {
  const lang = nonEnglishLanguageOf(text);
  if (!lang) return '';
  return '<student_language>\n'
    + `This message is written in ${lang}. This is a typed session: reply in that language (the <text_mode> language rule — Rule 5 is for spoken sessions and does not apply). Keep math, symbols, units and problem labels as written, and give each key subject term once with its English term in brackets. A "Session languages" section in this session's prompt, if there is one, decides instead.\n`
    + '</student_language>\n\n';
}
