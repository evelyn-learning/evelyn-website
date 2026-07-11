import { sanitize as baseSanitize } from './pdf-course-export';
import type jsPDF from 'jspdf';
// SmoothDraw Phase 3 (task 5): flag gate for baking feature-anchored
// tutor notes into item captures. Imported from the tutor hooks module
// (the flag's canonical home since task 2) rather than duplicating a
// process.env read here — whiteboard-capture.ts already establishes the
// precedent of this export module reaching into app/tutor for a flag
// helper (see its `drawOnEnabled` import from useDrawOn.ts).
import { inkNotesEnabled } from '@/app/tutor/hooks/toolDefinitions';

interface TranscriptMessage {
  id: string;
  timestamp: Date;
  role: 'student' | 'tutor' | 'system';
  text: string;
  whiteboardCommands?: WhiteboardCommandData[];
  pedagogicalIntent?: string;
}

interface WhiteboardCommandData {
  action: string;
  [key: string]: unknown;
}

function sanitizeForPDF(text: string): string {
  let s = baseSanitize(text);
  // Normalize Unicode punctuation to ASCII before the Latin-1 strip
  s = s.replace(/[\u2018\u2019\u201A]/g, "'");  // curly single quotes
  s = s.replace(/[\u201C\u201D\u201E]/g, '"');  // curly double quotes
  s = s.replace(/\u2013/g, '-');                 // en-dash
  s = s.replace(/\u2014/g, '--');                // em-dash
  s = s.replace(/\u2026/g, '...');
  s = s.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ');
  s = s.replace(/\uFEFF/g, '');
  s = s.replace(/\*\*(.*?)\*\*/g, '$1');
  s = s.replace(/\*(.*?)\*/g, '$1');
  s = s.replace(/`(.*?)`/g, '$1');
  // Emoji fallback BEFORE the Latin-1 strip \u2014 replaces known emoji with
  // bracketed ASCII (e.g., \uD83C\uDFAC \u2192 [movie]) so titles stay readable. Order
  // matters: variation-selector keys (\uD83C\uDF27\uFE0F) must be tried before bare
  // (\uD83C\uDF27) so the more specific match wins. JS replaceAll handles each
  // string key as a literal substring.
  for (const [emoji, ascii] of Object.entries(EMOJI_FALLBACK_MAP)) {
    if (s.includes(emoji)) s = s.split(emoji).join(ascii);
  }
  // Transliterate Greek, math symbols, etc. before stripping non-Latin-1
  s = s.replace(LATIN_DIACRITIC_REGEX, (ch) => LATIN_DIACRITIC_MAP[ch] || ch);
  s = s.replace(/[^\x00-\xFF]/g, '?');
  return s;
}

// ── Latin Extended diacritics → ASCII transliteration ──
// Maps characters from Latin Extended-A/B, Latin Extended Additional, etc.
// to their closest ASCII equivalents. This prevents mid-word "[non-Latin text]"
// for languages like Serbian, Czech, Polish, Turkish, Vietnamese, Romanian, etc.
const LATIN_DIACRITIC_MAP: Record<string, string> = {
  // Latin Extended-A (U+0100–U+017F)
  'Ā': 'A', 'ā': 'a', 'Ă': 'A', 'ă': 'a', 'Ą': 'A', 'ą': 'a',
  'Ć': 'C', 'ć': 'c', 'Ĉ': 'C', 'ĉ': 'c', 'Ċ': 'C', 'ċ': 'c', 'Č': 'C', 'č': 'c',
  'Ď': 'D', 'ď': 'd', 'Đ': 'Dj', 'đ': 'dj',
  'Ē': 'E', 'ē': 'e', 'Ĕ': 'E', 'ĕ': 'e', 'Ė': 'E', 'ė': 'e', 'Ę': 'E', 'ę': 'e', 'Ě': 'E', 'ě': 'e',
  'Ĝ': 'G', 'ĝ': 'g', 'Ğ': 'G', 'ğ': 'g', 'Ġ': 'G', 'ġ': 'g', 'Ģ': 'G', 'ģ': 'g',
  'Ĥ': 'H', 'ĥ': 'h', 'Ħ': 'H', 'ħ': 'h',
  'Ĩ': 'I', 'ĩ': 'i', 'Ī': 'I', 'ī': 'i', 'Ĭ': 'I', 'ĭ': 'i', 'Į': 'I', 'į': 'i', 'İ': 'I', 'ı': 'i',
  'Ĳ': 'IJ', 'ĳ': 'ij',
  'Ĵ': 'J', 'ĵ': 'j',
  'Ķ': 'K', 'ķ': 'k',
  'Ĺ': 'L', 'ĺ': 'l', 'Ļ': 'L', 'ļ': 'l', 'Ľ': 'L', 'ľ': 'l', 'Ŀ': 'L', 'ŀ': 'l', 'Ł': 'L', 'ł': 'l',
  'Ń': 'N', 'ń': 'n', 'Ņ': 'N', 'ņ': 'n', 'Ň': 'N', 'ň': 'n', 'ŉ': 'n', 'Ŋ': 'N', 'ŋ': 'n',
  'Ō': 'O', 'ō': 'o', 'Ŏ': 'O', 'ŏ': 'o', 'Ő': 'O', 'ő': 'o', 'Œ': 'OE', 'œ': 'oe',
  'Ŕ': 'R', 'ŕ': 'r', 'Ŗ': 'R', 'ŗ': 'r', 'Ř': 'R', 'ř': 'r',
  'Ś': 'S', 'ś': 's', 'Ŝ': 'S', 'ŝ': 's', 'Ş': 'S', 'ş': 's', 'Š': 'S', 'š': 's',
  'Ţ': 'T', 'ţ': 't', 'Ť': 'T', 'ť': 't', 'Ŧ': 'T', 'ŧ': 't',
  'Ũ': 'U', 'ũ': 'u', 'Ū': 'U', 'ū': 'u', 'Ŭ': 'U', 'ŭ': 'u', 'Ů': 'U', 'ů': 'u', 'Ű': 'U', 'ű': 'u', 'Ų': 'U', 'ų': 'u',
  'Ŵ': 'W', 'ŵ': 'w',
  'Ŷ': 'Y', 'ŷ': 'y', 'Ÿ': 'Y',
  'Ź': 'Z', 'ź': 'z', 'Ż': 'Z', 'ż': 'z', 'Ž': 'Z', 'ž': 'z',
  // Latin Extended-B common (U+0180–U+024F)
  'Ơ': 'O', 'ơ': 'o', 'Ư': 'U', 'ư': 'u',  // Vietnamese
  'Ș': 'S', 'ș': 's', 'Ț': 'T', 'ț': 't',  // Romanian
  // Latin Extended Additional — Vietnamese (U+1E00–U+1EFF)
  'Ạ': 'A', 'ạ': 'a', 'Ả': 'A', 'ả': 'a', 'Ấ': 'A', 'ấ': 'a', 'Ầ': 'A', 'ầ': 'a',
  'Ẩ': 'A', 'ẩ': 'a', 'Ẫ': 'A', 'ẫ': 'a', 'Ậ': 'A', 'ậ': 'a', 'Ắ': 'A', 'ắ': 'a',
  'Ằ': 'A', 'ằ': 'a', 'Ẳ': 'A', 'ẳ': 'a', 'Ẵ': 'A', 'ẵ': 'a', 'Ặ': 'A', 'ặ': 'a',
  'Ẹ': 'E', 'ẹ': 'e', 'Ẻ': 'E', 'ẻ': 'e', 'Ẽ': 'E', 'ẽ': 'e', 'Ế': 'E', 'ế': 'e',
  'Ề': 'E', 'ề': 'e', 'Ể': 'E', 'ể': 'e', 'Ễ': 'E', 'ễ': 'e', 'Ệ': 'E', 'ệ': 'e',
  'Ỉ': 'I', 'ỉ': 'i', 'Ị': 'I', 'ị': 'i',
  'Ọ': 'O', 'ọ': 'o', 'Ỏ': 'O', 'ỏ': 'o', 'Ố': 'O', 'ố': 'o', 'Ồ': 'O', 'ồ': 'o',
  'Ổ': 'O', 'ổ': 'o', 'Ỗ': 'O', 'ỗ': 'o', 'Ộ': 'O', 'ộ': 'o', 'Ớ': 'O', 'ớ': 'o',
  'Ờ': 'O', 'ờ': 'o', 'Ở': 'O', 'ở': 'o', 'Ỡ': 'O', 'ỡ': 'o', 'Ợ': 'O', 'ợ': 'o',
  'Ụ': 'U', 'ụ': 'u', 'Ủ': 'U', 'ủ': 'u', 'Ứ': 'U', 'ứ': 'u', 'Ừ': 'U', 'ừ': 'u',
  'Ử': 'U', 'ử': 'u', 'Ữ': 'U', 'ữ': 'u', 'Ự': 'U', 'ự': 'u',
  'Ỳ': 'Y', 'ỳ': 'y', 'Ỵ': 'Y', 'ỵ': 'y', 'Ỷ': 'Y', 'ỷ': 'y', 'Ỹ': 'Y', 'ỹ': 'y',
  // Cyrillic → Latin transliteration (U+0400–U+04FF)
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
  'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
  'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
  'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
  'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  // Serbian Cyrillic extras
  'Ђ': 'Dj', 'ђ': 'dj', 'Ј': 'J', 'ј': 'j', 'Љ': 'Lj', 'љ': 'lj',
  'Њ': 'Nj', 'њ': 'nj', 'Ћ': 'C', 'ћ': 'c', 'Џ': 'Dz', 'џ': 'dz',
  // Ukrainian extras
  'Ґ': 'G', 'ґ': 'g', 'Є': 'Ye', 'є': 'ye', 'І': 'I', 'і': 'i', 'Ї': 'Yi', 'ї': 'yi',
  // Greek letters (U+0370–U+03FF) — common in math/physics
  'Α': 'A', 'Β': 'B', 'Γ': 'Gamma', 'Δ': 'Delta', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': 'Theta',
  'Ι': 'I', 'Κ': 'K', 'Λ': 'Lambda', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'Xi', 'Ο': 'O', 'Π': 'Pi',
  'Ρ': 'Rho', 'Σ': 'Sigma', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'Phi', 'Χ': 'Chi', 'Ψ': 'Psi', 'Ω': 'Omega',
  'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta', 'ε': 'epsilon', 'ζ': 'zeta', 'η': 'eta', 'θ': 'theta',
  'ι': 'iota', 'κ': 'kappa', 'λ': 'lambda', 'μ': 'mu', 'ν': 'nu', 'ξ': 'xi', 'ο': 'o', 'π': 'pi',
  'ρ': 'rho', 'σ': 'sigma', 'ς': 'sigma', 'τ': 'tau', 'υ': 'upsilon', 'φ': 'phi', 'χ': 'chi', 'ψ': 'psi', 'ω': 'omega',
  // Subscript/superscript digits
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁻': '-',
  // Common math symbols
  '×': 'x', '÷': '/', '±': '+/-', '∞': 'inf', '≈': '~=', '≠': '!=', '≤': '<=', '≥': '>=',
  '→': '->', '←': '<-', '⇒': '=>', '∑': 'Sum', '∏': 'Product', '∫': 'Integral',
  '∂': 'd', '∇': 'del', '√': 'sqrt', '∝': ' proportional to ',
  // Geometry relation symbols. Without these, "OA ⊥ OB" sanitized to
  // "OA ? OB" (2026-07-11 user session PDF) via the catch-all non-Latin-1
  // strip below — these live in the map instead so they transliterate to
  // readable words like the other math symbols above.
  '⊥': ' perp ', '∥': ' parallel ', '∠': 'angle ',
  // Unicode minus sign (U+2212). Distinct from ASCII hyphen-minus (U+002D)
  // and from en-dash. Catalog renderers (showProblem, showEquation labels)
  // emit U+2212 in problem text — without this map, "5x − 2y = 8" sanitized
  // to "5x ? 2y = 8" in the 2026-04-29 geometry PDF (page 4 #10).
  '−': '-',
};

// Emoji → ASCII fallback. Kept SEPARATE from LATIN_DIACRITIC_MAP because
// most emoji are surrogate pairs (string length 2 in JS) and would corrupt
// the character-class regex that LATIN_DIACRITIC_MAP uses. Applied via
// individual string.replaceAll passes instead. Without this, emoji in
// tutor-supplied titles (e.g., "The Ticket Puzzle 🎬🍿") sanitized to a
// run of '?' marks because each surrogate fell outside Latin-1 (the
// 2026-04-29 geometry PDF page 1 #1 showed "The Ticket Puzzle ????").
// Add new entries as fresh emoji surface in real sessions.
const EMOJI_FALLBACK_MAP: Record<string, string> = {
  '🎬': '[movie]', '🍿': '[popcorn]', '🎟️': '[ticket]', '🎟': '[ticket]', '🎫': '[ticket]',
  '🌧️': '[rain]', '🌧': '[rain]', '☔': '[rain]', '☀️': '[sun]', '☀': '[sun]',
  '🌞': '[sun]', '⛅': '[cloud]',
  '🧬': '[dna]', '🧪': '[test-tube]', '🧫': '[petri]', '🔬': '[microscope]',
  '⚡': '[lightning]', '🔋': '[battery]', '🧲': '[magnet]',
  '📐': '[ruler]', '📏': '[ruler]', '📊': '[chart]', '📈': '[graph-up]', '📉': '[graph-down]',
  '⚖️': '[scales]', '⚖': '[scales]', '⏱️': '[stopwatch]', '⏱': '[stopwatch]', '⏰': '[clock]',
  '🚀': '[rocket]', '🌍': '[earth]', '🌎': '[earth]', '🌏': '[earth]',
  '🔥': '[fire]', '❄️': '[snow]', '❄': '[snow]', '💧': '[water]',
  // Food/objects — observed 2026-04-29 integers-rational session ("Pizza
  // Puzzle 🍕" rendered as "Pizza Puzzle Ø<ßU" because html2canvas had
  // no emoji font and the surrogate pair bytes leaked through as
  // Latin-1). Add common food/animal/object emoji used in puzzles.
  '🍕': '[pizza]', '🍎': '[apple]', '🍊': '[orange]', '🍌': '[banana]', '🍇': '[grapes]',
  '🍓': '[strawberry]', '🍪': '[cookie]', '🍩': '[donut]', '🎂': '[cake]', '🍰': '[cake]',
  '🍞': '[bread]', '🧀': '[cheese]', '🍔': '[burger]', '🌭': '[hotdog]', '🌮': '[taco]',
  '🥕': '[carrot]', '🥦': '[broccoli]', '🌽': '[corn]', '🥚': '[egg]', '🥛': '[milk]',
  '🐶': '[dog]', '🐱': '[cat]', '🐭': '[mouse]', '🐰': '[rabbit]', '🦊': '[fox]',
  '🐻': '[bear]', '🐼': '[panda]', '🐯': '[tiger]', '🦁': '[lion]', '🐮': '[cow]',
  '🐷': '[pig]', '🐸': '[frog]', '🐔': '[chicken]', '🐧': '[penguin]', '🐦': '[bird]',
  '🐟': '[fish]', '🐢': '[turtle]', '🦋': '[butterfly]', '🐝': '[bee]', '🐛': '[bug]',
  '🌳': '[tree]', '🌲': '[tree]', '🌴': '[palm]', '🌵': '[cactus]', '🌷': '[tulip]',
  '🌸': '[blossom]', '🌹': '[rose]', '🌻': '[sunflower]', '🍀': '[clover]', '🍂': '[leaf]',
  '⭐': '[star]', '✨': '[sparkles]', '💫': '[dizzy]', '🌟': '[star]', '🌙': '[moon]',
  '☁️': '[cloud]', '☁': '[cloud]', '⛈️': '[storm]', '⛈': '[storm]', '🌈': '[rainbow]',
  '⛄': '[snowman]', '☃️': '[snowman]', '☃': '[snowman]',
  '🚗': '[car]', '🚌': '[bus]', '✈️': '[plane]', '✈': '[plane]', '🚲': '[bike]',
  '🚂': '[train]', '🚢': '[ship]', '⛵': '[boat]',
  '🏠': '[house]', '🏫': '[school]', '🏥': '[hospital]', '🏦': '[bank]', '🏪': '[shop]',
  '⚽': '[soccer]', '🏀': '[basketball]', '⚾': '[baseball]', '🎾': '[tennis]', '🏈': '[football]',
  '🎯': '[target]', '🎲': '[dice]', '🎮': '[gamepad]', '🧩': '[puzzle]',
  '📚': '[books]', '📖': '[book]', '✏️': '[pencil]', '✏': '[pencil]', '📝': '[memo]',
  '🎨': '[art]', '🎵': '[music]', '🎶': '[music]', '🎤': '[mic]',
  '💡': '[bulb]', '🔑': '[key]', '🔒': '[lock]', '🔓': '[unlock]',
  '❤️': '[heart]', '❤': '[heart]', '💙': '[heart]', '💚': '[heart]', '💛': '[heart]',
  '👍': '[thumbs-up]', '👎': '[thumbs-down]', '👏': '[clap]', '🙌': '[raise]', '🤔': '[think]',
  '😀': '[smile]', '😊': '[smile]', '😄': '[smile]', '😃': '[smile]', '🙂': '[smile]',
  '😎': '[cool]', '🤩': '[wow]', '🎉': '[party]', '🎊': '[party]', '🎁': '[gift]',
  '✓': 'OK', '✔': 'OK', '✗': 'X', '✘': 'X',
};

// Build a regex that matches any character in the map (compiled once)
const LATIN_DIACRITIC_REGEX = new RegExp(
  '[' + Object.keys(LATIN_DIACRITIC_MAP).join('') + ']', 'g'
);

// ── WinAnsi text sanitizer ──
// jsPDF default fonts (Helvetica/Courier) only support WinAnsi (Latin-1).
// Non-Latin scripts (Devanagari, Arabic, CJK) render as "?".
// This function first transliterates Latin Extended and Cyrillic characters
// to ASCII, then replaces remaining non-Latin runs with a bracketed note.
function toWinAnsiSafe(text: string): string {
  // First, normalize common Unicode punctuation to ASCII equivalents
  let normalized = text;
  normalized = normalized.replace(/[\u2018\u2019\u201A]/g, "'");  // curly single quotes → '
  normalized = normalized.replace(/[\u201C\u201D\u201E]/g, '"');  // curly double quotes → "
  normalized = normalized.replace(/\u2013/g, '-');                 // en-dash → -
  normalized = normalized.replace(/\u2014/g, '--');                // em-dash → --
  normalized = normalized.replace(/\u2026/g, '...');               // ellipsis → ...
  normalized = normalized.replace(/\u00A0/g, ' ');                 // non-breaking space → space

  // Transliterate Latin Extended diacritics and Cyrillic to ASCII
  // This preserves readability for Serbian, Czech, Polish, Turkish, Vietnamese, Russian, etc.
  normalized = normalized.replace(LATIN_DIACRITIC_REGEX, (ch) => LATIN_DIACRITIC_MAP[ch] || ch);

  // Combining diacritical marks (U+0300–U+036F). The brain emits "x̄"
  // (x + combining macron, U+0304) as the mean notation in narration; the
  // base letter is Latin-1 but the combining mark is not, so the non-Latin
  // run match below would render "x̄ = 6" as "x[non-Latin text] = 6"
  // (observed 2026-06-16 IB AA session). Verbalize a macron over a letter/
  // digit as "-bar" (mean notation), then strip any remaining combining
  // marks so the base glyph survives cleanly.
  normalized = normalized.replace(/([A-Za-z0-9])\u0304/g, '$1-bar');
  normalized = normalized.replace(/[\u0300-\u036F]/g, '');

  // Match remaining runs of characters outside Latin-1 printable range (U+0020–U+00FF)
  return normalized.replace(
    /[^\u0000-\u00FF]+/g,
    (match) => {
      // Try to detect the script for a useful label
      if (/[\u0900-\u097F]/.test(match)) return '[Hindi speech]';
      if (/[\u0600-\u06FF]/.test(match)) return '[Arabic speech]';
      if (/[\u4E00-\u9FFF]/.test(match)) return '[Chinese text]';
      if (/[\u3040-\u30FF]/.test(match)) return '[Japanese text]';
      if (/[\uAC00-\uD7AF]/.test(match)) return '[Korean text]';
      return '[non-Latin text]';
    }
  );
}

// ── LaTeX → readable text (WinAnsi safe) ──

function latexToReadable(latex: string): string {
  let s = latex;

  // Math functions — convert to readable names BEFORE the catch-all strip
  s = s.replace(/\\sin/g, 'sin');
  s = s.replace(/\\cos/g, 'cos');
  s = s.replace(/\\tan/g, 'tan');
  s = s.replace(/\\cot/g, 'cot');
  s = s.replace(/\\sec/g, 'sec');
  s = s.replace(/\\csc/g, 'csc');
  s = s.replace(/\\arcsin/g, 'arcsin');
  s = s.replace(/\\arccos/g, 'arccos');
  s = s.replace(/\\arctan/g, 'arctan');
  s = s.replace(/\\sinh/g, 'sinh');
  s = s.replace(/\\cosh/g, 'cosh');
  s = s.replace(/\\tanh/g, 'tanh');
  s = s.replace(/\\log/g, 'log');
  s = s.replace(/\\ln/g, 'ln');
  s = s.replace(/\\exp/g, 'exp');
  s = s.replace(/\\lim/g, 'lim');
  s = s.replace(/\\max/g, 'max');
  s = s.replace(/\\min/g, 'min');
  s = s.replace(/\\det/g, 'det');
  s = s.replace(/\\gcd/g, 'gcd');
  s = s.replace(/\\mod/g, 'mod');
  s = s.replace(/\\deg/g, 'deg');

  // Summation and product
  s = s.replace(/\\sum/g, 'Sum');
  s = s.replace(/\\prod/g, 'Prod');
  s = s.replace(/\\int/g, 'Integral');
  s = s.replace(/\\infty/g, 'inf');

  // Binomial coefficient: \binom{n}{k} → C(n,k)
  s = s.replace(/\\binom\{([^}]+)\}\{([^}]+)\}/g, 'C($1,$2)');

  // Square root: \sqrt{x} → sqrt(x)
  s = s.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');

  // Greek letters
  s = s.replace(/\\rho/g, 'rho');
  s = s.replace(/\\alpha/g, 'alpha');
  s = s.replace(/\\beta/g, 'beta');
  s = s.replace(/\\gamma/g, 'gamma');
  s = s.replace(/\\theta/g, 'theta');
  s = s.replace(/\\Delta/g, 'Delta ');
  s = s.replace(/\\delta/g, 'delta');
  s = s.replace(/\\epsilon/g, 'epsilon');
  s = s.replace(/\\lambda/g, 'lambda');
  s = s.replace(/\\mu/g, 'mu');
  s = s.replace(/\\pi/g, 'pi');
  s = s.replace(/\\sigma/g, 'sigma');
  s = s.replace(/\\tau/g, 'tau');
  s = s.replace(/\\phi/g, 'phi');
  s = s.replace(/\\omega/g, 'omega');

  // Common operators — use Latin-1 compatible symbols where possible
  s = s.replace(/\\cdot/g, ' \u00B7 ');   // middle dot ·
  s = s.replace(/\\times/g, ' \u00D7 ');  // multiplication sign ×
  s = s.replace(/\\div/g, ' \u00F7 ');    // division sign ÷
  s = s.replace(/\\pm/g, '\u00B1');        // plus-minus ±
  s = s.replace(/\\mp/g, '-/+');
  s = s.replace(/\\leq/g, '<=');
  s = s.replace(/\\geq/g, '>=');
  s = s.replace(/\\neq/g, '!=');
  s = s.replace(/\\approx/g, '~=');
  s = s.replace(/\\equiv/g, '===');
  s = s.replace(/\\rightarrow/g, ' -> ');
  s = s.replace(/\\leftarrow/g, ' <- ');
  s = s.replace(/\\Rightarrow/g, ' => ');
  s = s.replace(/\\quad/g, '  ');
  s = s.replace(/\\qquad/g, '    ');
  s = s.replace(/\\,/g, ' ');
  s = s.replace(/\\;/g, ' ');
  s = s.replace(/\\!/g, '');
  s = s.replace(/\\left/g, '');
  s = s.replace(/\\right/g, '');

  // Fractions: \frac{a}{b} → (a)/(b)
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
  // Subscripts/superscripts: keep inline
  s = s.replace(/\^{([^}]+)}/g, '^$1');
  s = s.replace(/_{([^}]+)}/g, '_$1');
  // Remove \text{...} wrapper
  s = s.replace(/\\text\{([^}]+)\}/g, '$1');
  // Remove remaining backslash commands (spacing, formatting, etc.)
  s = s.replace(/\\[a-zA-Z]+/g, '');
  // Clean up extra braces and spaces
  s = s.replace(/[{}]/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// ── jsPDF visual drawing helpers ──

function drawArrow(
  pdf: jsPDF, x1: number, y1: number, x2: number, y2: number,
  color: [number, number, number], weight: number = 0.5
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.5) return;

  const ux = dx / len;
  const uy = dy / len;
  const headLen = Math.min(2.5, len * 0.3);

  pdf.setDrawColor(...color);
  pdf.setLineWidth(weight);
  pdf.line(x1, y1, x2, y2);

  // Arrowhead
  pdf.setFillColor(...color);
  const px = x2 - ux * headLen;
  const py = y2 - uy * headLen;
  const perpX = -uy * headLen * 0.4;
  const perpY = ux * headLen * 0.4;
  pdf.triangle(x2, y2, px + perpX, py + perpY, px - perpX, py - perpY, 'F');
}

function drawEquationVisual(
  pdf: jsPDF, latex: string, label: string | undefined,
  x: number, yStart: number, width: number
): number {
  let y = yStart;
  const boxPad = 3;

  const readable = latexToReadable(latex);
  const sanitized = sanitizeForPDF(readable);

  // Measure equation text to determine box height
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  const eqLines = pdf.splitTextToSize(sanitized, width - boxPad * 2 - 4);
  const eqLineCount = Array.isArray(eqLines) ? eqLines.length : 1;
  const boxH = (label ? 8 : 4) + eqLineCount * 5 + 3;

  // Light blue background box
  pdf.setFillColor(239, 246, 255);
  pdf.setDrawColor(191, 219, 254);
  pdf.roundedRect(x, y, width, boxH, 2, 2, 'FD');

  // Label above if present
  if (label) {
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(sanitizeForPDF(label), x + boxPad, y + 4);
  }

  // Equation text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 64, 175);
  const eqY = label ? y + 10.5 : y + 7;
  pdf.text(eqLines, x + boxPad + 2, eqY);

  return y + boxH + 2;
}

function drawVectorsDiagram(
  pdf: jsPDF, params: Record<string, unknown>,
  x: number, yStart: number, width: number
): number {
  const vectors = (params.vectors || []) as { magnitude: number; direction: number; label: string; color?: string }[];
  if (vectors.length === 0) return yStart;

  const height = 45;
  const title = (params.title as string) || 'Vector Diagram';

  // Background
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(x, yStart, width, height, 2, 2, 'FD');

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(55, 65, 81);
  pdf.text(sanitizeForPDF(title), x + 4, yStart + 5);

  // Draw area
  const cx = x + width / 2;
  const cy = yStart + height / 2 + 3;
  const maxMag = Math.max(...vectors.map(v => v.magnitude), 1);
  const scale = 14 / maxMag;

  // Axes
  pdf.setDrawColor(200, 210, 220);
  pdf.setLineWidth(0.2);
  pdf.line(cx - 18, cy, cx + 18, cy);
  pdf.line(cx, cy - 15, cx, cy + 15);

  // Origin dot
  pdf.setFillColor(100, 116, 139);
  pdf.circle(cx, cy, 0.5, 'F');

  const colors: [number, number, number][] = [
    [220, 38, 38], [37, 99, 235], [22, 163, 74], [147, 51, 234], [234, 88, 12], [8, 145, 178]
  ];

  vectors.forEach((v, i) => {
    const rad = (v.direction * Math.PI) / 180;
    const dx = Math.cos(rad) * v.magnitude * scale;
    const dy = -Math.sin(rad) * v.magnitude * scale; // PDF y is inverted
    const color = colors[i % colors.length];
    drawArrow(pdf, cx, cy, cx + dx, cy + dy, color, 0.6);

    // Label at tip
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...color);
    const labelX = cx + dx + (dx > 0 ? 1.5 : -1.5);
    const labelY = cy + dy + (dy > 0 ? 2 : -1);
    pdf.text(sanitizeForPDF(v.label), labelX, labelY);
  });

  // Legend below
  let legendY = yStart + height - 4;
  pdf.setFontSize(6);
  let legendX = x + 4;
  vectors.forEach((v, i) => {
    const color = colors[i % colors.length];
    pdf.setFillColor(...color);
    pdf.rect(legendX, legendY - 1.2, 3, 1.5, 'F');
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    const txt = sanitizeForPDF(`${v.label}: ${v.magnitude}${v.direction !== 0 ? ` @ ${v.direction}deg` : ''}`);
    pdf.text(txt, legendX + 4, legendY);
    legendX += pdf.getTextWidth(txt) + 8;
  });

  return yStart + height + 2;
}

function drawFreeBodyDiagram(
  pdf: jsPDF, params: Record<string, unknown>,
  x: number, yStart: number, width: number
): number {
  const forces = (params.forces || []) as { magnitude: number; direction: number; label: string; color?: string }[];
  if (forces.length === 0) return yStart;

  const height = 45;

  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(x, yStart, width, height, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(55, 65, 81);
  pdf.text('Free Body Diagram', x + 4, yStart + 5);

  const cx = x + width / 2;
  const cy = yStart + height / 2 + 3;
  const maxMag = Math.max(...forces.map(f => f.magnitude), 1);
  const scale = 12 / maxMag;

  // Object box
  const boxSize = 6;
  pdf.setFillColor(226, 232, 240);
  pdf.setDrawColor(148, 163, 184);
  pdf.rect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize, 'FD');

  const objLabel = (params.objectLabel as string) || '';
  if (objLabel) {
    pdf.setFontSize(6);
    pdf.setTextColor(100, 116, 139);
    pdf.text(sanitizeForPDF(objLabel), cx - boxSize / 2, cy + boxSize / 2 + 3);
  }

  const defaultColors: Record<string, [number, number, number]> = {
    'W': [220, 38, 38], 'Fg': [220, 38, 38], 'mg': [220, 38, 38],
    'N': [37, 99, 235], 'Fn': [37, 99, 235],
    'Fb': [22, 163, 74], 'B': [22, 163, 74],
    'f': [234, 88, 12], 'Ff': [234, 88, 12],
  };

  forces.forEach(f => {
    const rad = (f.direction * Math.PI) / 180;
    const len = f.magnitude * scale;
    const dx = Math.cos(rad) * len;
    const dy = -Math.sin(rad) * len; // PDF y inverted
    const color = defaultColors[f.label] || [100, 116, 139];

    const startX = cx + Math.cos(rad) * (boxSize / 2 + 0.5);
    const startY = cy - Math.sin(rad) * (boxSize / 2 + 0.5);
    drawArrow(pdf, startX, startY, startX + dx, startY + dy, color, 0.6);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...color);
    const lx = startX + dx + (dx > 0 ? 1 : dx < 0 ? -4 : -1);
    const ly = startY + dy + (dy > 0 ? 3 : dy < 0 ? -1 : 0);
    pdf.text(sanitizeForPDF(`${f.label} (${f.magnitude}N)`), lx, ly);
  });

  return yStart + height + 2;
}

function drawPipeFlowDiagram(
  pdf: jsPDF, params: Record<string, unknown>,
  x: number, yStart: number, width: number
): number {
  const height = 42;
  const title = (params.title as string) || 'Flow Through a Pipe';
  const a1 = (params.wideArea as number) || (params.area1 as number) || 4;
  const a2 = (params.narrowArea as number) || (params.area2 as number) || 2;
  const v1 = (params.wideVelocity as number) || (params.velocity1 as number) || 2;
  const v2 = (params.narrowVelocity as number) || (params.velocity2 as number) || (a1 / a2) * v1;

  // Background
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(x, yStart, width, height, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(55, 65, 81);
  pdf.text(sanitizeForPDF(title), x + 4, yStart + 5);

  const cx = x + width / 2;
  const cy = yStart + height / 2 + 2;
  const wideHalf = Math.sqrt(a1) * 3.5;
  const narrowHalf = Math.sqrt(a2) * 3.5;
  const pipeLen = width * 0.35;

  // Wide section (left)
  const wLeft = cx - pipeLen;
  const wRight = cx - pipeLen * 0.15;
  pdf.setDrawColor(71, 85, 105);
  pdf.setLineWidth(0.6);
  pdf.line(wLeft, cy - wideHalf, wRight, cy - wideHalf); // top
  pdf.line(wLeft, cy + wideHalf, wRight, cy + wideHalf); // bottom
  pdf.line(wLeft, cy - wideHalf, wLeft, cy + wideHalf);  // left cap

  // Narrow section (right)
  const nLeft = cx + pipeLen * 0.15;
  const nRight = cx + pipeLen;
  pdf.line(nLeft, cy - narrowHalf, nRight, cy - narrowHalf); // top
  pdf.line(nLeft, cy + narrowHalf, nRight, cy + narrowHalf); // bottom
  pdf.line(nRight, cy - narrowHalf, nRight, cy + narrowHalf); // right cap

  // Taper
  pdf.line(wRight, cy - wideHalf, nLeft, cy - narrowHalf);
  pdf.line(wRight, cy + wideHalf, nLeft, cy + narrowHalf);

  // Light fill
  pdf.setFillColor(219, 234, 254);
  // Wide section fill
  pdf.rect(wLeft + 0.3, cy - wideHalf + 0.3, wRight - wLeft - 0.6, wideHalf * 2 - 0.6, 'F');
  // Narrow section fill
  pdf.rect(nLeft + 0.3, cy - narrowHalf + 0.3, nRight - nLeft - 0.6, narrowHalf * 2 - 0.6, 'F');

  // Flow arrows — wide section (short, blue)
  const arrowScale = Math.min(8, pipeLen * 0.3) / Math.max(v1, v2, 1);
  const wMid = (wLeft + wRight) / 2;
  drawArrow(pdf, wMid - 2, cy, wMid - 2 + v1 * arrowScale, cy, [37, 99, 235], 0.5);
  drawArrow(pdf, wMid - 2, cy - wideHalf * 0.35, wMid - 2 + v1 * arrowScale, cy - wideHalf * 0.35, [147, 197, 253], 0.3);
  drawArrow(pdf, wMid - 2, cy + wideHalf * 0.35, wMid - 2 + v1 * arrowScale, cy + wideHalf * 0.35, [147, 197, 253], 0.3);

  // Flow arrows — narrow section (long, red)
  const nMid = (nLeft + nRight) / 2;
  drawArrow(pdf, nMid - 2, cy, nMid - 2 + v2 * arrowScale, cy, [220, 38, 38], 0.5);
  drawArrow(pdf, nMid - 2, cy - narrowHalf * 0.3, nMid - 2 + v2 * arrowScale, cy - narrowHalf * 0.3, [252, 165, 165], 0.3);
  drawArrow(pdf, nMid - 2, cy + narrowHalf * 0.3, nMid - 2 + v2 * arrowScale, cy + narrowHalf * 0.3, [252, 165, 165], 0.3);

  // Labels
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(37, 99, 235);
  pdf.text(sanitizeForPDF(`A1=${a1}  v1=${v1} m/s`), wMid - 8, cy - wideHalf - 2);
  pdf.setTextColor(220, 38, 38);
  pdf.text(sanitizeForPDF(`A2=${a2}  v2=${Math.round(v2 * 10) / 10} m/s`), nMid - 8, cy - narrowHalf - 2);

  return yStart + height + 2;
}

async function drawSvgDiagram(
  pdf: jsPDF, svg: string, title: string | undefined,
  x: number, yStart: number, width: number
): Promise<number> {
  let y = yStart;

  // Title
  if (title) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(55, 65, 81);
    pdf.text(sanitizeForPDF(title), x + 4, y + 5);
    y += 7;
  }

  // Rasterize SVG to canvas, then to image for PDF
  try {
    // Sanitize SVG: ensure valid XML, fix common AI-generated issues
    let cleanSvg = svg.trim();
    // Ensure SVG has xmlns
    if (!cleanSvg.includes('xmlns')) {
      cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    // Fix unescaped ampersands in SVG attributes
    cleanSvg = cleanSvg.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g, '&amp;');

    // Use data URL approach (more reliable than Blob URL for SVG rendering)
    const svgBase64 = btoa(unescape(encodeURIComponent(cleanSvg)));
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('SVG load timeout')), 5000);
      img.onload = () => { clearTimeout(timeout); resolve(); };
      img.onerror = () => { clearTimeout(timeout); reject(new Error('SVG load failed')); };
      img.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    const scale = 2; // 2x for crisp rendering
    canvas.width = 400 * scale;
    canvas.height = 300 * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 300);
    ctx.drawImage(img, 0, 0, 400, 300);

    const imgData = canvas.toDataURL('image/png');
    const imgHeight = (width * 300) / 400; // maintain aspect ratio
    pdf.addImage(imgData, 'PNG', x, y, width, imgHeight);
    y += imgHeight + 2;
  } catch (err) {
    console.error('SVG PDF render error:', err);
    // Fallback: just note that SVG couldn't be rendered
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text('[SVG diagram - could not render to PDF]', x + 4, y + 5);
    y += 8;
  }

  return y;
}

// ── Graph renderer ──
// Normalize math expression strings into evaluable JavaScript
// Must match the logic in GraphRenderer.tsx's normalizeMathExpression
function parseFnString(fnStr: string, variable: string = 'x'): (v: number) => number {
  let s = fnStr;
  if (variable === 'x') s = s.replace(/\bt\b/g, 'x');
  s = s.replace(/\^/g, '**');
  s = s.replace(/(?<!Math\.)(?<!\w)(sin|cos|tan|sqrt|abs|log)\b/g, 'Math.$1');
  s = s.replace(/\bpi\b/gi, 'Math.PI');
  s = s.replace(/(?<![a-zA-Z.])e\b/g, 'Math.E');
  // Fix "x2" → "x**2" (digit after variable = exponent)
  s = s.replace(new RegExp(`\\b${variable}(\\d)\\b`, 'g'), `${variable}**$1`);
  // Implicit multiplication: 4x → 4*x, 2Math → 2*Math, )( → )*(
  s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  s = s.replace(/([)])(\d)/g, '$1*$2');
  s = s.replace(/([)])\s*\(/g, '$1*(');
  return (v: number) => {
    try {
      const result = new Function(variable, `"use strict"; return ${s}`)(v) as number;
      return typeof result === 'number' && isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  };
}

// Convert a JS expression to LaTeX for Desmos (same as DesmosGraphRenderer)
function jsToLatexForDesmos(expr: string, variable: string = 'x'): string {
  let s = expr.trim();
  if (/\\(?:frac|sqrt|sin|cos|tan|log|ln)/.test(s)) return s; // Already LaTeX
  s = s.replace(/Math\.sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  s = s.replace(/Math\.sin\(([^)]+)\)/g, '\\sin\\left($1\\right)');
  s = s.replace(/Math\.cos\(([^)]+)\)/g, '\\cos\\left($1\\right)');
  s = s.replace(/Math\.tan\(([^)]+)\)/g, '\\tan\\left($1\\right)');
  s = s.replace(/Math\.log\(([^)]+)\)/g, '\\ln\\left($1\\right)');
  s = s.replace(/Math\.abs\(([^)]+)\)/g, '\\left|$1\\right|');
  s = s.replace(/Math\.PI/g, '\\pi');
  s = s.replace(/Math\.E/g, 'e');
  s = s.replace(/\*\*/g, '^');
  const v = variable;
  s = s.replace(new RegExp(`\\b${v}(\\d)\\b`, 'g'), `${v}^$1`);
  s = s.replace(/(\d)\s*\*\s*([a-zA-Z\\])/g, '$1$2');
  s = s.replace(/\s*\*\s*/g, '');
  return s;
}

// Try to render graph via Desmos screenshot (much higher quality)
async function renderGraphWithDesmos(
  graphData: Record<string, unknown>,
): Promise<string | null> {
  if (typeof window === 'undefined' || !window.Desmos) return null;

  try {
    const container = document.createElement('div');
    container.style.width = '500px';
    container.style.height = '400px';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const calculator = window.Desmos.GraphingCalculator(container, {
      expressions: false, settingsMenu: false, zoomButtons: false,
      keypad: false, expressionsTopbar: false, border: false,
      lockViewport: true, links: false, images: false,
      plotImplicits: true, plotInequalities: true,
    });

    const xRange = (graphData.xRange || [-5, 5]) as [number, number];
    const yRange = (graphData.yRange || [-5, 5]) as [number, number];
    calculator.setMathBounds({ left: xRange[0], right: xRange[1], bottom: yRange[0], top: yRange[1] });

    const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];
    let id = 0;

    const fns = (graphData.functions || []) as { fn?: string; latex?: string; color?: string; label?: string; domain?: [number, number] }[];
    for (const fn of fns) {
      const latex = fn.latex || jsToLatexForDesmos(fn.fn || '', 'x');
      let exprLatex = /[=<>]/.test(latex) ? latex : `y = ${latex}`;
      if (fn.domain) exprLatex += ` \\left\\{${fn.domain[0]} \\le x \\le ${fn.domain[1]}\\right\\}`;
      calculator.setExpression({ id: `f${id++}`, latex: exprLatex, color: fn.color || COLORS[id % COLORS.length] });
    }

    const fnsOfY = (graphData.functionsOfY || []) as { fn?: string; latex?: string; color?: string; label?: string; domain?: [number, number] }[];
    for (const fn of fnsOfY) {
      const latex = fn.latex || jsToLatexForDesmos(fn.fn || '', 'y');
      let exprLatex = /[=<>]/.test(latex) ? latex : `x = ${latex}`;
      if (fn.domain) exprLatex += ` \\left\\{${fn.domain[0]} \\le y \\le ${fn.domain[1]}\\right\\}`;
      calculator.setExpression({ id: `f${id++}`, latex: exprLatex, color: fn.color || COLORS[id % COLORS.length] });
    }

    const points = (graphData.points || []) as { x: number; y: number; label?: string; color?: string }[];
    for (const pt of points) {
      calculator.setExpression({
        id: `p${id++}`, latex: `(${pt.x}, ${pt.y})`,
        color: pt.color || '#2563eb', label: pt.label || '', showLabel: !!pt.label, pointSize: 9,
      });
    }

    // Wait for Desmos to finish rendering — use change event with timeout fallback
    await new Promise<void>(resolve => {
      let settled = false;
      const done = () => { if (!settled) { settled = true; resolve(); } };
      // Desmos fires 'change' when expressions are evaluated
      calculator.observeEvent('change', () => {
        // Wait a bit after the last change for rendering to complete
        setTimeout(done, 200);
      });
      // Fallback timeout in case change never fires
      setTimeout(done, 2000);
    });

    const imgData = calculator.screenshot({ width: 500, height: 400, targetPixelRatio: 2 });
    calculator.destroy();
    document.body.removeChild(container);
    return imgData;
  } catch (err) {
    console.error('[PDF] Desmos screenshot failed:', err);
    return null;
  }
}

async function drawGraphVisual(
  pdf: jsPDF, graphData: Record<string, unknown>,
  x: number, yStart: number, width: number
): Promise<number> {
  let y = yStart;
  const title = graphData.title as string | undefined;

  // Try Desmos first for higher quality rendering
  const desmosImage = await renderGraphWithDesmos(graphData);
  if (desmosImage) {
    if (title) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(55, 65, 81);
      pdf.text(sanitizeForPDF(title), x + 4, y + 5);
      y += 7;
    }
    const imgHeight = (width * 400) / 500;
    pdf.addImage(desmosImage, 'PNG', x, y, width, imgHeight);
    return y + imgHeight + 2;
  }

  // Fallback: manual canvas rendering (for when Desmos isn't available)
  const xRange = (graphData.xRange || [-5, 5]) as [number, number];
  const yRange = (graphData.yRange || [-5, 5]) as [number, number];
  const functions = (graphData.functions || []) as { fn?: string; latex?: string; color?: string; label?: string; domain?: [number, number] }[];
  const functionsOfY = (graphData.functionsOfY || []) as { fn?: string; latex?: string; color?: string; label?: string; domain?: [number, number] }[];
  const points = (graphData.points || []) as { x: number; y: number; label?: string; color?: string }[];

  // Rasterize the graph to canvas
  try {
    const canvasW = 500;
    const canvasH = 400;
    const pad = 40; // padding for axis labels
    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasW, canvasH);

    const plotL = pad;
    const plotR = canvasW - 15;
    const plotT = title ? 30 : 10;
    const plotB = canvasH - pad;
    const plotW = plotR - plotL;
    const plotH = plotB - plotT;

    // Map math → pixel
    const toPixelX = (mx: number) => plotL + ((mx - xRange[0]) / (xRange[1] - xRange[0])) * plotW;
    const toPixelY = (my: number) => plotB - ((my - yRange[0]) / (yRange[1] - yRange[0])) * plotH;

    // Title
    if (title) {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, canvasW / 2, 18);
    }

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let gx = Math.ceil(xRange[0]); gx <= xRange[1]; gx++) {
      const px = toPixelX(gx);
      ctx.beginPath(); ctx.moveTo(px, plotT); ctx.lineTo(px, plotB); ctx.stroke();
    }
    for (let gy = Math.ceil(yRange[0]); gy <= yRange[1]; gy++) {
      const py = toPixelY(gy);
      ctx.beginPath(); ctx.moveTo(plotL, py); ctx.lineTo(plotR, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    // X-axis
    if (yRange[0] <= 0 && yRange[1] >= 0) {
      const axisY = toPixelY(0);
      ctx.beginPath(); ctx.moveTo(plotL, axisY); ctx.lineTo(plotR, axisY); ctx.stroke();
    }
    // Y-axis
    if (xRange[0] <= 0 && xRange[1] >= 0) {
      const axisX = toPixelX(0);
      ctx.beginPath(); ctx.moveTo(axisX, plotT); ctx.lineTo(axisX, plotB); ctx.stroke();
    }

    // Axis tick labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    for (let gx = Math.ceil(xRange[0]); gx <= xRange[1]; gx++) {
      if (gx === 0) continue;
      ctx.fillText(String(gx), toPixelX(gx), plotB + 14);
    }
    ctx.textAlign = 'right';
    for (let gy = Math.ceil(yRange[0]); gy <= yRange[1]; gy++) {
      if (gy === 0) continue;
      ctx.fillText(String(gy), plotL - 4, toPixelY(gy) + 4);
    }

    // Plot y=f(x) functions
    const step = (xRange[1] - xRange[0]) / 500;
    for (const fnDef of functions) {
      const evalFn = parseFnString(fnDef.fn || fnDef.latex || 'x', 'x');
      const color = fnDef.color || '#2563eb';
      const domainStart = fnDef.domain?.[0] ?? xRange[0];
      const domainEnd = fnDef.domain?.[1] ?? xRange[1];

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let mx = domainStart; mx <= domainEnd; mx += step) {
        const my = evalFn(mx);
        if (!isFinite(my) || my < yRange[0] - 1 || my > yRange[1] + 1) {
          started = false;
          continue;
        }
        const px = toPixelX(mx);
        const py = toPixelY(my);
        if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
      }
      ctx.stroke();
    }

    // Plot x=f(y) functions (e.g., vertical lines, sideways parabolas)
    const stepY = (yRange[1] - yRange[0]) / 500;
    for (const fnDef of functionsOfY) {
      const evalFn = parseFnString(fnDef.fn || fnDef.latex || 'y', 'y');
      const color = fnDef.color || '#16a34a';
      const domainStart = fnDef.domain?.[0] ?? yRange[0];
      const domainEnd = fnDef.domain?.[1] ?? yRange[1];

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let my = domainStart; my <= domainEnd; my += stepY) {
        const mx = evalFn(my);
        if (!isFinite(mx) || mx < xRange[0] - 1 || mx > xRange[1] + 1) {
          started = false;
          continue;
        }
        const px = toPixelX(mx);
        const py = toPixelY(my);
        if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
      }
      ctx.stroke();
    }

    // Plot points
    for (const pt of points) {
      const px = toPixelX(pt.x);
      const py = toPixelY(pt.y);
      const color = pt.color || '#2563eb';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      if (pt.label) {
        ctx.fillStyle = '#1e293b';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(pt.label, px + 8, py - 4);
      }
    }

    // Legend (bottom)
    const legendItems = [...functions, ...functionsOfY].filter(f => f.label);
    if (legendItems.length > 0) {
      ctx.font = '10px sans-serif';
      let lx = plotL;
      const ly = canvasH - 6;
      for (const item of legendItems) {
        ctx.fillStyle = item.color || '#2563eb';
        ctx.fillRect(lx, ly - 6, 14, 3);
        lx += 18;
        ctx.fillStyle = '#374151';
        ctx.textAlign = 'left';
        const labelText = item.label || item.fn || item.latex || '';
        ctx.fillText(labelText, lx, ly);
        lx += ctx.measureText(labelText).width + 16;
        if (lx > canvasW - 40) { lx = plotL; } // wrap
      }
    }

    // Convert to image and embed in PDF
    const imgData = canvas.toDataURL('image/png');
    const imgHeight = (width * canvasH) / canvasW;
    pdf.addImage(imgData, 'PNG', x, y, width, imgHeight);
    y += imgHeight + 2;
  } catch (err) {
    // Fallback: describe the graph textually
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text(`[Graph: ${title || 'could not render'}]`, x + 4, y + 5);
    y += 8;
  }

  return y;
}

// ── Table renderer ──
function drawTableVisual(
  pdf: jsPDF, headers: string[], rows: string[][],
  x: number, yStart: number, width: number
): number {
  if (!headers?.length) return yStart;
  let y = yStart;
  const colCount = headers.length;
  const colWidth = Math.min(width / colCount, 55);
  const totalTableWidth = colWidth * colCount;
  const cellPad = 2;
  const rowHeight = 7;

  // Header row
  pdf.setFillColor(239, 246, 255);
  pdf.setDrawColor(191, 219, 254);
  pdf.rect(x, y, totalTableWidth, rowHeight, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(30, 64, 175);
  for (let c = 0; c < colCount; c++) {
    const cellX = x + c * colWidth;
    pdf.setDrawColor(191, 219, 254);
    if (c > 0) pdf.line(cellX, y, cellX, y + rowHeight);
    const headerText = sanitizeForPDF(String(headers[c]));
    pdf.text(headerText, cellX + cellPad, y + 5, { maxWidth: colWidth - cellPad * 2 });
  }
  y += rowHeight;

  // Data rows
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(55, 65, 81);
  for (const row of (rows || [])) {
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(x, y, totalTableWidth, rowHeight, 'D');
    for (let c = 0; c < colCount; c++) {
      const cellX = x + c * colWidth;
      if (c > 0) pdf.line(cellX, y, cellX, y + rowHeight);
      const cellVal = c < row.length ? row[c] : '';
      // Convert LaTeX in cell values to readable text
      const readable = latexToReadable(String(cellVal));
      pdf.text(sanitizeForPDF(readable), cellX + cellPad, y + 5, { maxWidth: colWidth - cellPad * 2 });
    }
    y += rowHeight;
  }

  return y + 2;
}

// ── Code renderer ──
function drawCodeVisual(
  pdf: jsPDF, code: string, language: string | undefined, label: string | undefined,
  x: number, yStart: number, width: number
): number {
  let y = yStart;

  // Label
  if (label) {
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(sanitizeForPDF(label + (language ? ` (${language})` : '')), x + 3, y + 4);
    y += 5;
  }

  // Code block background
  const codeLines = String(code).split('\n');
  const lineH = 3.5;
  const blockH = Math.max(codeLines.length * lineH + 6, 10);

  pdf.setFillColor(30, 41, 59); // dark slate
  pdf.roundedRect(x, y, width, blockH, 2, 2, 'F');

  // Code text
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(226, 232, 240); // light gray on dark
  let codeY = y + 5;
  for (const line of codeLines) {
    pdf.text(sanitizeForPDF(line), x + 4, codeY, { maxWidth: width - 8 });
    codeY += lineH;
  }

  return y + blockH + 2;
}

// ── Geometry renderer ──
function drawGeometryVisual(
  pdf: jsPDF, cmd: WhiteboardCommandData,
  x: number, yStart: number, width: number
): number {
  const title = cmd.title as string | undefined;
  const points = (cmd.points || []) as { id: string; x: number; y: number; label?: string }[];
  const segments = (cmd.segments || []) as { from: string; to: string; label?: string }[];
  const angles = (cmd.angles || []) as { vertex: string; label?: string }[];

  if (!points.length) return yStart;

  let y = yStart;
  const height = 60;
  const labelPad = 8; // mm padding for labels inside the drawing area

  // Title
  if (title) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(55, 65, 81);
    pdf.text(sanitizeForPDF(title), x + 4, y + 5);
    y += 7;
  }

  // Map point IDs to positions — scale to fit the box
  // Use math coordinates (y-up): flip y to match the live whiteboard
  const pxValues = points.map(p => p.x);
  const pyValues = points.map(p => p.y);
  const minPx = Math.min(...pxValues);
  const maxPx = Math.max(...pxValues);
  const minPy = Math.min(...pyValues);
  const maxPy = Math.max(...pyValues);
  const rangeX = maxPx - minPx || 1;
  const rangeY = maxPy - minPy || 1;

  const drawWidth = width - labelPad * 2;
  const drawHeight = height - labelPad;
  const offsetX = x + labelPad;
  const offsetY = y + 4;

  const scalePoint = (p: { x: number; y: number }) => ({
    sx: offsetX + ((p.x - minPx) / rangeX) * drawWidth,
    // Flip y: math y-up → PDF y-down (same as live whiteboard)
    sy: offsetY + ((maxPy - p.y) / rangeY) * drawHeight,
  });

  const pointMap = new Map<string, { sx: number; sy: number }>();
  for (const p of points) {
    pointMap.set(p.id, scalePoint(p));
  }

  // Clamp label position within drawing bounds
  const clampX = (lx: number) => Math.max(x + 2, Math.min(lx, x + width - 10));
  const clampY = (ly: number) => Math.max(y + 2, Math.min(ly, y + height - 2));

  // Draw segments
  pdf.setDrawColor(30, 41, 59);
  pdf.setLineWidth(0.4);
  for (const seg of segments) {
    const from = pointMap.get(seg.from);
    const to = pointMap.get(seg.to);
    if (from && to) {
      pdf.line(from.sx, from.sy, to.sx, to.sy);

      // Draw segment label at midpoint, offset perpendicular to segment
      if (seg.label) {
        const midSx = (from.sx + to.sx) / 2;
        const midSy = (from.sy + to.sy) / 2;
        const dx = to.sx - from.sx;
        const dy = to.sy - from.sy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        // Offset perpendicular (to the left of the segment direction)
        const offX = -(dy / len) * 3;
        const offY = (dx / len) * 3;
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(6);
        pdf.setTextColor(100, 116, 139);
        pdf.text(sanitizeForPDF(seg.label), clampX(midSx + offX), clampY(midSy + offY));
      }
    }
  }

  // Draw points and labels
  pdf.setFillColor(37, 99, 235);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  for (const p of points) {
    const sp = pointMap.get(p.id);
    if (!sp) continue;
    pdf.circle(sp.sx, sp.sy, 0.8, 'F');
    if (p.label) {
      // Smart label placement: offset based on position relative to centroid
      const centroidX = offsetX + drawWidth / 2;
      const centroidY = offsetY + drawHeight / 2;
      const dirX = sp.sx - centroidX;
      const dirY = sp.sy - centroidY;
      const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
      // Push label away from centroid
      const labelX = sp.sx + (dirX / dirLen) * 3;
      const labelY = sp.sy + (dirY / dirLen) * 3;
      pdf.setTextColor(37, 99, 235);
      pdf.text(sanitizeForPDF(p.label), clampX(labelX), clampY(labelY));
    }
  }

  // Draw angle labels — offset from vertex in a different direction than vertex label
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(220, 38, 38);
  for (const angle of angles) {
    const vp = pointMap.get(angle.vertex);
    if (!vp || !angle.label) continue;

    // Skip if vertex label already contains the angle info (e.g., "A (90°)")
    const vertexPt = points.find(p => p.id === angle.vertex);
    if (vertexPt?.label && vertexPt.label.includes(angle.label)) continue;

    // Offset angle label inward (toward centroid) to avoid overlapping vertex label
    const centroidX = offsetX + drawWidth / 2;
    const centroidY = offsetY + drawHeight / 2;
    const dirX = centroidX - vp.sx;
    const dirY = centroidY - vp.sy;
    const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    const labelX = vp.sx + (dirX / dirLen) * 4;
    const labelY = vp.sy + (dirY / dirLen) * 4;
    pdf.text(sanitizeForPDF(angle.label), clampX(labelX), clampY(labelY));
  }

  return y + height + 2;
}

// 2026-07-11 user round (stream-order caption fix): a note-caption line — a
// colored dot + wrapped text — is now painted from TWO call sites: the
// handwrite's own walk position (true margin notes, or stamped notes whose
// target never appears in this export) AND, new in this round, right after
// a stamped note's TARGET item when the bake attempt there didn't succeed
// (see the export loop's `unbakedNotes` block). Both need byte-identical
// styling, so the paint logic is factored here; `displayText` arrives fully
// formed (suffix decision lives in each caller — see the honesty rule in
// the handwrite branch below) so this stays a pure paint routine.
function drawNoteCaptionLine(pdf: jsPDF, displayText: string, colorHex: string, x: number, y: number, width: number): number {
  const safeColorHex = (typeof colorHex === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(colorHex)) ? colorHex : '#a16207';
  const parsedColor = ((): [number, number, number] => {
    const h = safeColorHex.replace('#', '');
    const n = h.length === 3
      ? [h[0] + h[0], h[1] + h[1], h[2] + h[2]]
      : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
    return [parseInt(n[0], 16), parseInt(n[1], 16), parseInt(n[2], 16)];
  })();
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const sanitized = sanitizeForPDF(displayText);
  const wrapped = pdf.splitTextToSize(sanitized, width - 6);
  const wrappedLines = Array.isArray(wrapped) ? wrapped.length : 1;
  // Color dot.
  pdf.setFillColor(...parsedColor);
  pdf.circle(x + 1.8, y + 2.4, 1.1, 'F');
  pdf.setTextColor(...parsedColor);
  pdf.text(wrapped, x + 5.5, y + 3);
  return y + wrappedLines * 4.4 + 2;
}

// Draw a visual representation of a whiteboard command. Returns new y position.
// scribbles is an optional list of annotation commands targeting THIS item
// (their targetItemIndex matches the 1-indexed position on screen). When
// the fallback captured-SVG path runs, overlays are baked into the SVG.
async function drawWhiteboardVisual(
  pdf: jsPDF, rawCmd: WhiteboardCommandData,
  x: number, y: number, width: number,
  scribbles?: Array<{ shape: 'tick' | 'highlight' | 'circle' | 'underline' | 'arrow' | 'box'; region?: { x: number; y: number; w?: number; h?: number }; targetFeature?: string; color?: string; label?: string }>,
  // SmoothDraw P3 (task 5): feature-anchored tutor notes targeting THIS
  // item, resolved by the export loop's pre-pass (notesByTargetId) —
  // only ever populated when inkNotesEnabled().
  inkNotes?: Array<{ text: string; color?: string; targetFeature?: string }>,
  // Out-param: overlayScribbles' `bakedTexts` for THIS item's inkNotes
  // land here so the export loop can mark the SOURCE handwrite command
  // (`__pdfNoteBaked`) to skip its own caption line later in the walk.
  // An out-param rather than widening this function's `Promise<number>`
  // return — that return value is read as a plain cursor position at
  // ~15 call sites throughout this file, none of which care about
  // baked notes; threading a second return value through all of them
  // for one call site's benefit isn't the minimal change.
  bakedNoteTextsOut?: string[],
): Promise<number> {
  // Normalize: DB format nests command properties under 'data' (e.g., { action: 'showEquation', data: { latex: '...' } }),
  // while live format has them flat (e.g., { action: 'showEquation', latex: '...' }). Flatten for consistent access.
  // Only flatten when the command has ONLY action+data+timestamp+sourceMessageIndex keys (DB format),
  // not when it already has content keys at the top level (live format).
  const cmdData = rawCmd.data as Record<string, unknown> | undefined;
  const dbOnlyKeys = new Set(['action', 'data', 'timestamp', 'sourceMessageIndex']);
  const hasOnlyDbKeys = Object.keys(rawCmd).every(k => dbOnlyKeys.has(k));
  const cmd: WhiteboardCommandData = (hasOnlyDbKeys && cmdData && typeof cmdData === 'object' && !Array.isArray(cmdData))
    ? { ...cmdData, action: rawCmd.action }
    : rawCmd;

  if (cmd.action === 'showEquation' && cmd.latex) {
    // Try rendering the actual KaTeX output first (html2canvas → PNG).
    // This preserves every LaTeX command — \cdot, \frac, \parallel,
    // \circ, etc. — exactly as the student sees it. The legacy text path
    // (drawEquationVisual) reduces LaTeX to ASCII via latexToReadable +
    // sanitize, which produced output like "F_ = 200 x sin(30^) = 200 x
    // (1)/(2)" in the 2026-04-23 session. Falls back to that legacy path
    // when the browser isn't available or capture returns null.
    try {
      const { captureCommandRaster } = await import('./whiteboard-capture');
      const raster = await captureCommandRaster(cmd as unknown as import('@/lib/knowledge/types').WhiteboardCommand);
      if (raster && raster.dataUrl) {
        const heightMm = (raster.heightPx / raster.widthPx) * width;
        // Light blue box behind the image to match drawEquationVisual's look.
        // The captured image already contains the EquationRenderer's own label
        // header (see EquationRenderer.tsx:127), so we DON'T draw a separate
        // label band here — that was producing the duplicate "Starting point /
        // Starting point" stack visible in the 2026-04-28 trig session export.
        const boxPad = 3;
        const boxH = heightMm + boxPad * 2;
        pdf.setFillColor(239, 246, 255);
        pdf.setDrawColor(191, 219, 254);
        pdf.roundedRect(x, y, width, boxH, 2, 2, 'FD');
        pdf.addImage(raster.dataUrl, 'PNG', x + boxPad, y + boxPad, width - boxPad * 2, heightMm);
        return y + boxH + 2;
      }
    } catch (err) {
      console.warn('[pdf-tutor-session] Equation raster capture failed, using legacy path:', err);
    }
    return drawEquationVisual(pdf, String(cmd.latex), cmd.label as string | undefined, x, y, width);
  }

  if (cmd.action === 'showSvgDiagram' && cmd.svg) {
    return drawSvgDiagram(pdf, String(cmd.svg), cmd.title as string | undefined, x, y, width);
  }

  if (cmd.action === 'showGraph' && cmd.data) {
    const graphData = cmd.data as Record<string, unknown>;
    return drawGraphVisual(pdf, graphData, x, y, width);
  }

  if (cmd.action === 'handwrite' && cmd.text) {
    // Post-redesign (2026-05-13): handwrites are strip entries — a
    // simple colored bullet + line of text. No box, no border, no
    // anchor hint. Matches the live AnnotationStrip styling.
    //
    // SmoothDraw P3 (task 5): a note the export loop already baked into
    // its target item's captured SVG (see the fallback branch below +
    // overlayScribbles) doesn't need this line too — the item's own
    // numbered badge above still reads "Handwrite: <text>"
    // (describeWhiteboardCommand), so the note's content survives in
    // the list even with the caption line skipped.
    //
    // 2026-07-11 user round (defect: ALL notes fell to caption lines, no
    // bakes) — the OLD comment here said this only worked cleanly when the
    // target item appears BEFORE the handwrite in the stream, and accepted
    // a "harmless double-appearance" otherwise. In the user's real session
    // the target routinely came AFTER, so __pdfNoteBaked was never set by
    // the time THIS position was reached and every stamped note printed
    // its (wrongly-suffixed) caption here regardless of what the target's
    // render did later. Fix: the pre-pass below (notesByTargetId) now also
    // stamps `__pdfNoteDeferred` on every handwrite whose target exists
    // ANYWHERE in this export — suppress the in-place caption unconditionally
    // when either flag is set; resolution (bake, or an honest fallback
    // caption printed right after the target item) happens in the export
    // loop when the TARGET's render is processed, independent of stream
    // order. See the loop's `unbakedNotes` block.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rc = rawCmd as any;
    if (inkNotesEnabled() && (rc.__pdfNoteBaked || rc.__pdfNoteDeferred)) {
      return y;
    }
    const text = String(cmd.text);
    const colorHex = typeof cmd.color === 'string' ? cmd.color : '#a16207';
    // Suffix honesty (2026-07-11 user round): '→ margin note' asserts the
    // note never had a target — true only when NO target stamp exists at
    // all (this branch is only reached, with a stamp present, when the
    // stamped target isn't in this export at all — see notesByTargetId's
    // existence guard). A stamped-but-unresolved note is not that; no
    // suffix. '→' (not the brief's literal '↳' — jsPDF's helvetica is
    // WinAnsi-only and doesn't have that glyph) round-trips through
    // sanitizeForPDF's LATIN_DIACRITIC_MAP to '->', so no raw non-Latin-1
    // byte reaches the PDF text stream.
    const hasTargetStamp = typeof rc.targetId === 'string' && rc.targetId && typeof rc.targetFeature === 'string' && rc.targetFeature;
    const displayText = (inkNotesEnabled() && !hasTargetStamp) ? `${text} → margin note` : text;
    return drawNoteCaptionLine(pdf, displayText, colorHex, x, y, width);
  }

  if (cmd.action === 'showTable' && cmd.headers) {
    return drawTableVisual(
      pdf, cmd.headers as string[], (cmd.rows || []) as string[][],
      x, y, width
    );
  }

  if (cmd.action === 'showCode' && cmd.code) {
    return drawCodeVisual(
      pdf, String(cmd.code), cmd.language as string | undefined,
      cmd.label as string | undefined, x, y, width
    );
  }

  if (cmd.action === 'showGeometry' && cmd.points) {
    // Try the capture path first — GeometryRenderer's SVG is the source
    // of truth for what the student saw, and it handles polygons,
    // circles, arcs, conics, axes/grid that drawGeometryVisual ignores
    // entirely. The 2026-04-28 trig session export had a "Right Triangle
    // Trig" geometry where only the three vertex labels rendered (no
    // edges); the capture path fixes that without us re-deriving the
    // segment-drawing logic in jsPDF. Falls back to drawGeometryVisual
    // when capture returns null (no DOM, off-screen render failed, etc.).
    try {
      const { captureCommandSvg, captureCommandRaster, drawCapturedSvg, overlayScribbles, svgContainsExoticGlyphs } = await import('./whiteboard-capture');
      const whiteboardCmd = cmd as unknown as import('@/lib/knowledge/types').WhiteboardCommand;
      let svgString = await captureCommandSvg(whiteboardCmd);
      if (svgString) {
        // Geometry diagrams routinely contain π, √, Greek letters in
        // angle labels — same exotic-glyph check the generic fallback
        // uses, so unit-circle-style labeling routes through raster.
        // 2026-07-11 round 3: note-carrying geometry MUST rasterize —
        // round 2 baked notes into the SVG and handed it to svg2pdf, whose
        // WinAnsi built-in fonts have no Caveat (serif output) and no √/²
        // (user PDF: `√45` → `"45`). captureCommandRaster bakes both
        // overlays into the mounted SVG and rasterizes IN THE BROWSER
        // (loaded webfonts + full Unicode). localBaked propagates to
        // bakedNoteTextsOut only when the raster actually landed, so a
        // raster failure keeps the caption rescue honest.
        const geoExotic = svgContainsExoticGlyphs(svgString);
        if (geoExotic || (inkNotes && inkNotes.length > 0)) {
          const localBaked: string[] = [];
          const raster = await captureCommandRaster(whiteboardCmd, scribbles, inkNotes, localBaked);
          if (raster && raster.dataUrl) {
            if (bakedNoteTextsOut && localBaked.length > 0) bakedNoteTextsOut.push(...localBaked);
            const heightMm = (raster.heightPx / raster.widthPx) * width;
            pdf.addImage(raster.dataUrl, 'PNG', x, y, width, heightMm);
            return y + heightMm + 2;
          }
          // Raster failed → notes stay unbaked (captions rescue below).
          // Non-exotic SVG may still embed as vector; exotic must NOT
          // (svg2pdf mangles the glyphs — pre-round-3 behavior kept).
        }
        if (!geoExotic) {
          // Vector embed: scribble ticks/highlights only (pure paths —
          // the 2026-07-11 follow-up's flagship-target fix, svg2pdf-safe).
          if (scribbles && scribbles.length > 0) {
            svgString = overlayScribbles(svgString, scribbles).svg;
          }
          const consumed = await drawCapturedSvg(pdf, svgString, x, y, width);
          if (consumed > 0) return y + consumed + 2;
        }
      }
    } catch (err) {
      console.warn('[pdf-tutor-session] Geometry capture failed, using legacy text path:', err);
    }
    // Legacy jsPDF text path — no SVG to bake into; stamped notes fall to
    // the export loop's after-figure caption fallback (no content loss).
    return drawGeometryVisual(pdf, cmd, x, y, width);
  }

  if (cmd.action === 'showDiagram') {
    const params = (cmd.params || {}) as Record<string, unknown>;
    const type = cmd.type as string;

    if (type === 'pipe-flow' || type === 'fluid-flow' || type === 'continuity') {
      return drawPipeFlowDiagram(pdf, params, x, y, width);
    }
    if (type === 'free-body') {
      return drawFreeBodyDiagram(pdf, params, x, y, width);
    }
    if (type === 'vectors' || type === 'velocity' || type === 'vector-addition') {
      return drawVectorsDiagram(pdf, params, x, y, width);
    }
  }

  // Fallback for any whiteboard command that lacks a native jsPDF drawer
  // (primarily the 17 Tier-1 structured renderers: show_free_body_diagram,
  // show_motion_diagram, show_pedigree, show_ray_diagram, etc.): re-mount
  // the React CommandRenderer off-screen, capture its SVG output, and
  // embed as vector via svg2pdf. Works identically for current and past
  // sessions because we re-render from the command data each time.
  //
  // Two embed modes:
  //   1. SVG embed (vector) via svg2pdf — default. Crisp + searchable.
  //   2. Raster via html2canvas → PNG — used when the renderer mixes
  //      emoji / exotic unicode into SVG text that svg2pdf can't render
  //      (see RASTER_PREFERRED_ACTIONS). html2canvas uses browser fonts,
  //      which include emoji.
  try {
    const {
      captureCommandSvg,
      captureCommandRaster,
      drawCapturedSvg,
      overlayScribbles,
      RASTER_PREFERRED_ACTIONS,
      svgContainsExoticGlyphs,
    } = await import('./whiteboard-capture');
    const whiteboardCmd = cmd as unknown as import('@/lib/knowledge/types').WhiteboardCommand;
    const prefersRaster = RASTER_PREFERRED_ACTIONS.has(String(cmd.action));

    // 2026-07-11 round 3: any raster capture may also bake notes now (the
    // raster path is the ONLY note-safe pipeline — svg2pdf's WinAnsi fonts
    // rendered baked notes serif and mangled √/²; see overlayScribbles'
    // routing doc in whiteboard-capture.ts). Shared embed helper so every
    // raster site propagates localBaked → bakedNoteTextsOut only on an
    // ACTUALLY-landed raster (a failed raster must leave notes unbaked so
    // the export loop's after-figure caption rescue stays honest).
    const tryRaster = async (): Promise<number | null> => {
      const localBaked: string[] = [];
      const raster = await captureCommandRaster(whiteboardCmd, scribbles, inkNotes, localBaked);
      if (raster && raster.dataUrl) {
        if (bakedNoteTextsOut && localBaked.length > 0) bakedNoteTextsOut.push(...localBaked);
        const heightMm = (raster.heightPx / raster.widthPx) * width;
        pdf.addImage(raster.dataUrl, 'PNG', x, y, width, heightMm);
        return y + heightMm + 2;
      }
      return null;
    };

    // Fast-path: known raster-preferred action — skip the SVG probe.
    if (prefersRaster) {
      const r = await tryRaster();
      if (r !== null) return r;
    }

    // SVG path (default) — probe for exotic glyphs AFTER we have the SVG so
    // we catch emoji that slipped into tutor-provided labels even on
    // renderers not in the static allowlist.
    let svgString = await captureCommandSvg(whiteboardCmd);
    if (svgString) {
      // Exotic glyphs OR pending notes both force raster (round 3): the
      // vector embed can't render either faithfully.
      if (svgContainsExoticGlyphs(svgString) || (inkNotes && inkNotes.length > 0)) {
        const r = await tryRaster();
        if (r !== null) return r;
      }
      // Vector embed: scribble ticks/highlights only (pure paths,
      // svg2pdf-safe). Notes reaching here mean the raster attempt above
      // failed — they stay unbaked and the caption rescue covers them.
      if (scribbles && scribbles.length > 0) {
        svgString = overlayScribbles(svgString, scribbles).svg;
      }
      const consumed = await drawCapturedSvg(pdf, svgString, x, y, width);
      if (consumed > 0) return y + consumed + 2;
    }
    // No SVG captured — likely an HTML-only renderer (comparison_table,
    // organizers, KWL chart, Frayer model, etc.). Fall back to raster
    // via html2canvas so we still get a visual instead of a label-only
    // card. Observed 2026-04-29 grammar-mechanics session: a comparison
    // table command rendered as just "Diagram: comparison_table -
    // Present vs. Past Tense" with no visual underneath.
    const r = await tryRaster();
    if (r !== null) return r;
  } catch (err) {
    console.warn('[pdf-tutor-session] Whiteboard capture fallback failed:', err);
  }

  return y; // No visual drawn — caller falls back to its existing text label.
}

/** Estimate the vertical space (in mm) that drawWhiteboardVisual will
 *  consume for a given command. Used to decide whether the next render
 *  fits on the current PDF page or needs a fresh page. Without this,
 *  inline transcript renders use a fixed 20mm reservation that's way
 *  too small for graphs/circles/geometry — the 2026-04-29 geometry PDF
 *  page 6 showed the "Two Equations, Two Lines" graph clipped at the
 *  page bottom because only 20mm was reserved before an 85mm graph.
 *  Estimates are intentionally on the generous side: a slightly-too-
 *  large reservation just creates an early page break (cosmetic), but
 *  a too-small one chops the bottom off the figure (broken). */
function estimateCommandHeight(rawCmd: WhiteboardCommandData): number {
  const cmdData = rawCmd.data as Record<string, unknown> | undefined;
  const dbOnlyKeys = new Set(['action', 'data', 'timestamp', 'sourceMessageIndex']);
  const hasOnlyDbKeys = Object.keys(rawCmd).every(k => dbOnlyKeys.has(k));
  const cmd: WhiteboardCommandData = (hasOnlyDbKeys && cmdData && typeof cmdData === 'object' && !Array.isArray(cmdData))
    ? { ...cmdData, action: rawCmd.action }
    : rawCmd;
  const action = String(cmd.action || '');
  // Tall visuals (graphs, full SVG diagrams, geometry, unit circles).
  if (action === 'showGraph' || action === 'showSvgDiagram'
      || action === 'showGeometry' || action === 'showGeometryConstructed'
      || action === 'showUnitCircle' || action === 'showSpecialTriangles'
      || action === 'showCircuit' || action === 'showLewis'
      || action === 'showFreeBodyDiagram' || action === 'showCollision'
      || action === 'showEnergyBars' || action === 'showSpringMass'
      || action === 'showReactionCoordinate' || action === 'showPedigree'
      || action === 'showFlowchart' || action === 'showCoordinatePlane'
      || action === 'showScatterPlot' || action === 'showCycleDiagram'
      || action === 'showConceptMap' || action === 'showMotionDiagram'
      || action === 'showProjectileMotion' || action === 'showRayDiagram'
      || action === 'showWave' || action === 'showVector'
      || action === 'showOrbitalDiagram' || action === 'showDiagram'
      || action === 'showTree' || action === 'showManipulative') {
    return 90;
  }
  if (action === 'showEquation') return 35;
  if (action === 'showProblem') return 30;
  if (action === 'handwrite') return 18;
  if (action === 'showTable') return 60;
  if (action === 'showCode') return 50;
  // Generic safe default — covers everything else with room to spare.
  return 40;
}

function describeWhiteboardCommand(rawCmd: WhiteboardCommandData): string {
  // Normalize DB format (nested data) to flat format
  const cmdData = rawCmd.data as Record<string, unknown> | undefined;
  const dbOnlyKeys = new Set(['action', 'data', 'timestamp', 'sourceMessageIndex']);
  const hasOnlyDbKeys = Object.keys(rawCmd).every(k => dbOnlyKeys.has(k));
  const cmd: WhiteboardCommandData = (hasOnlyDbKeys && cmdData && typeof cmdData === 'object' && !Array.isArray(cmdData))
    ? { ...cmdData, action: rawCmd.action }
    : rawCmd;

  switch (cmd.action) {
    case 'showEquation':
      return `Equation${cmd.label ? `: ${cmd.label}` : ''}`;
    case 'showGraph':
      return `Graph: ${cmd.type || 'chart'}${(cmd.data as { title?: string })?.title ? ` - ${(cmd.data as { title?: string }).title}` : ''}`;
    case 'showDiagram': {
      const params = (cmd.params || {}) as Record<string, unknown>;
      return `Diagram: ${cmd.type || 'diagram'}${params.title ? ` - ${params.title}` : ''}`;
    }
    case 'drawVector':
      return `Vector: ${cmd.label || 'unlabeled'}`;
    case 'annotate':
      return `Note: ${cmd.text || ''}`;
    case 'handwrite':
      return `Handwrite: ${cmd.text || ''}`;
    case 'showProblem': {
      const prob = (cmd.problem || {}) as Record<string, unknown>;
      return `Problem: ${prob.title || prob.statement || 'untitled'}`;
    }
    case 'showSolution':
      return `Solution: ${Array.isArray(cmd.steps) ? `${cmd.steps.length} steps` : 'steps'}`;
    case 'showTable':
      return `Table: ${Array.isArray(cmd.headers) ? cmd.headers.join(', ') : 'data'}`;
    case 'showSvgDiagram':
      return `Diagram: ${cmd.title || 'custom diagram'}`;
    case 'showCode':
      return `Code${cmd.label ? `: ${cmd.label}` : ''}${cmd.language ? ` (${cmd.language})` : ''}`;
    case 'showGeometry':
      return `Geometry: ${cmd.title || 'figure'}`;
    case 'showFreeBodyDiagram':
      return `Free Body Diagram${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showEnergyBars':
      return `Energy Bar Chart${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showCollision':
      return `Collision Diagram${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showReactionCoordinate':
      return `Reaction Coordinate${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showCoordinatePlane':
      return `Coordinate Plane${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showScatterPlot':
      return `Scatter Plot${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showCycleDiagram':
      return `Cycle Diagram${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showConceptMap':
      return `Concept Map${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showMotionDiagram':
      return `Motion Diagram${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showProjectileMotion':
      return `Projectile Motion${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showSimpleMachine':
      return `Simple Machine${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showPendulum':
      return `Pendulum${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showSpringMass':
      return `Spring-Mass System${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showRayDiagram':
      return `Ray Diagram${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showWave':
      return `Wave${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showVector':
      return `Vector Diagram${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showOrbitalDiagram':
      return `Orbital Diagram${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showPedigree':
      return `Pedigree${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showCellDiagram':
      return `Cell Diagram${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showDna':
      return `DNA${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showFoodWeb':
      return `Food Web${cmd.title ? `: ${cmd.title}` : ''}`;
    case 'showWorkedExample':
      return `Worked Example`;
    default:
      return `Command: ${cmd.action}`;
  }
}

export async function exportTutorSessionPDF(
  transcript: TranscriptMessage[],
  whiteboardCommands: WhiteboardCommandData[],
  topicName: string,
  sessionGoal: string,
  studentName?: string,
  options?: { includeDebugData?: boolean; subject?: string; level?: string }
): Promise<void> {
  const includeDebug = options?.includeDebugData ?? false;
  const { default: jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const textAreaWidth = contentWidth - 8;
  let y = 0;
  const LINE_HEIGHT = 4.5;

  // Merge whiteboard commands: combine the top-level array with any commands
  // embedded in transcript entries (validation-pass commands may only exist there)
  const transcriptCommands = transcript.flatMap(m => m.whiteboardCommands || []);
  const allWhiteboardCommands = whiteboardCommands.length > 0
    ? whiteboardCommands
    : transcriptCommands;
  // Deduplicate by action+JSON content
  const seen = new Set<string>();
  const dedupedAll = allWhiteboardCommands.filter(cmd => {
    const key = JSON.stringify(cmd);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Stale-stamp pre-pass: __pdfNoteBaked is written onto the LIVE command
  // objects (same refs held by React state — see the mutation note near
  // its write site below), so a stamp from an EARLIER export survives on
  // the object across a second export call within the same session. If
  // the second export's own notesByTargetId pre-pass doesn't re-bake that
  // note (e.g. evolve-in-place changed the target item so the feature no
  // longer resolves), the stale `true` still suppresses the handwrite's
  // caption line — the note silently vanishes from that PDF even though
  // it was never baked into THIS export's render. Clear every stamp
  // before this export does any marking of its own.
  for (const cmd of dedupedAll) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (cmd as any).__pdfNoteBaked;
    // 2026-07-11 user round: __pdfNoteDeferred is the companion stamp (see
    // notesByTargetId's pre-pass below) that suppresses a stamped note's
    // in-place caption while its target's render is pending resolution in
    // THIS walk — same staleness risk as __pdfNoteBaked above, so it gets
    // the same start-of-export clear.
    delete (cmd as any).__pdfNoteDeferred;
  }

  // Rollback pre-pass: a 'removeItems' command lists the stamped ids of
  // renders the orchestrator pulled off the live board after a killed
  // brain attempt. The parent whiteboardCommands array is append-only,
  // so those orphaned renders are still here — drop them (by stamped
  // `id`) so the PDF matches what the student actually saw. Without
  // this the export shows the ghost figure the kill removed (the
  // 2026-05-15 two-contradictory-BSTs report).
  const pdfRemovedIds = new Set<string>();
  for (const cmd of dedupedAll) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((cmd as any).action === 'removeItems' && Array.isArray((cmd as any).ids)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const id of (cmd as any).ids) pdfRemovedIds.add(id);
    }
  }

  // Page-grouping pre-walk: assign each content command the whiteboard PAGE it
  // belongs to by walking the newPage markers in order. The runtime owns
  // pagination (page-grouping.ts), and its newPage boundaries flow through in
  // the command stream — so the PDF's Whiteboard Content section can group
  // items under page headers, matching what the student saw on screen (rather
  // than dumping all items flat, which diverged from the live board).
  {
    let curPage: string | undefined;
    for (const cmd of dedupedAll) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = cmd as any;
      if (c.action === 'newPage') {
        curPage = String(c.title || '').trim() || undefined;
      } else {
        c.__pdfPageTitle = curPage;
      }
    }
  }

  // Meta-commands don't render as their own whiteboard items — split them
  // out so the numbered list in the PDF only contains real content, and
  // bake scribble overlays onto their target item's captured SVG below.
  // scrollTo / newPage / clear / goToPage / removeItems have no PDF
  // representation; discard.
  const META_PDF_ACTIONS = new Set(['scribble', 'scrollTo', 'newPage', 'clear', 'goToPage', 'removeItems', 'reviseItems']);
  // Two lookup paths for matching scribbles to target items:
  //   - byId keyed on the stamped id ("showSpringMass-1") — preferred
  //   - byIndex keyed on the 1-indexed PDF item position — fallback for
  //     older scribbles emitted before targetId was available, OR when
  //     the tutor didn't use targetId
  type ScribbleShape = { shape: 'tick' | 'highlight' | 'circle' | 'underline' | 'arrow' | 'box'; region?: { x: number; y: number; w?: number; h?: number }; targetFeature?: string; color?: string; label?: string };
  const scribblesByTargetId = new Map<string, ScribbleShape[]>();
  const scribblesByIndex = new Map<number, ScribbleShape[]>();
  const dedupedCommands = dedupedAll.filter((cmd) => {
    const action = cmd.action;
    if (action === 'scribble') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const s = cmd as any;
      // Post-redesign vocabulary is `tick` + `highlight`. Legacy
      // shapes are accepted and will remap to `tick` in the renderer.
      if (!['tick','highlight','circle','underline','arrow','box'].includes(s.shape)) return false;
      const shape: ScribbleShape = {
        shape: s.shape,
        region: s.region,
        targetFeature: typeof s.targetFeature === 'string' ? s.targetFeature : undefined,
        color: s.color,
        label: s.label,
      };
      if (typeof s.targetId === 'string' && s.targetId) {
        const list = scribblesByTargetId.get(s.targetId) || [];
        list.push(shape);
        scribblesByTargetId.set(s.targetId, list);
      } else if (Number.isFinite(Number(s.targetItemIndex)) && Number(s.targetItemIndex) >= 1) {
        const idx = Number(s.targetItemIndex);
        const list = scribblesByIndex.get(idx) || [];
        list.push(shape);
        scribblesByIndex.set(idx, list);
      }
      return false;
    }
    if (META_PDF_ACTIONS.has(String(action))) return false;
    // Drop renders rolled back by a killed attempt (matched on the
    // stamped command id collected in the pre-pass above).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cmdId = (cmd as any).id;
    if (typeof cmdId === 'string' && pdfRemovedIds.has(cmdId)) return false;
    // Drop showEquation cards whose latex payload is empty/missing —
    // they render as label-only blanks ("sin 30° confirmed" with no
    // formula) in the Whiteboard Content section, which looks broken.
    // Observed 2026-04-29 trig session: brain emitted two-stage
    // equations (label-first, then a corrected version with full
    // latex) and JSON-key dedup kept both. The corrected version still
    // renders inline in the conversation transcript via msg.whiteboardCommands,
    // so dropping the empty placeholder here loses nothing the student saw.
    // DB format nests latex under data; check both shapes.
    if (action === 'showEquation') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = cmd as any;
      const latex = (typeof c.latex === 'string' ? c.latex : c.data?.latex) ?? '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const label = (c.label ?? c.data?.label ?? '');
      if (typeof latex !== 'string' || latex.trim().length === 0) {
        console.log(`[pdf-tutor-session] dropping empty showEquation: label="${label || '(no label)'}", keys=[${Object.keys(c).join(',')}]`);
        return false;
      }
      // Drop placeholder-latex cards. Observed 2026-04-29 pre-algebra
      // session: a sibling equation card had latex="The equation" (a
      // literal placeholder) — KaTeX can't parse English as latex,
      // falls back to textContent (EquationRenderer.tsx:92), and the
      // captured raster shows the label twice with no math.
      // Heuristic: latex must contain at least one of =, +, -, *, /, ^,
      // _, \, (, ), {, }, digits. (Earlier version also dropped when
      // latex === label, but that mis-fires when the brain echoes a
      // real equation as both fields, e.g. latex="x = 5"/label="x = 5".)
      const trimmedLatex = latex.trim();
      const trimmedLabel = String(label).trim();
      const hasMath = /[=+\-*/^_\\(){}\[\]0-9]/.test(trimmedLatex);
      if (!hasMath) {
        console.log(`[pdf-tutor-session] dropping placeholder showEquation: latex="${trimmedLatex}", label="${trimmedLabel}"`);
        return false;
      }
    }
    return true;
  });
  // Diagnostic: log how many showEquation entries survived the
  // filter and what their labels are. If the PDF still shows empty
  // cards, the survivors here will tell us which equations have
  // non-empty latex but render blank (or whether the empties are
  // coming through a path that bypasses this filter entirely).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const survivingEquations = dedupedCommands.filter((c: any) => c.action === 'showEquation');
  console.log(`[pdf-tutor-session] surviving equations: ${survivingEquations.length}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    survivingEquations.map((c: any) => {
      const latex = (typeof c.latex === 'string' ? c.latex : c.data?.latex) ?? '';
      const label = c.label ?? c.data?.label ?? '(no label)';
      return `${label} (latex: ${latex.length} chars: "${latex.slice(0, 60)}…")`;
    }));

  // SmoothDraw P3 (task 5): pre-pass mapping each resolved `handwrite`
  // note to the item it targets, mirroring the scribble pre-pass above
  // (scribblesByTargetId) — EXCEPT a handwrite is a real content item
  // with its own numbered entry in the list below (unlike `scribble`,
  // which is a pure meta-action filtered out of dedupedCommands
  // entirely). So this pass reads `targetId`/`targetFeature` without
  // removing anything from dedupedCommands; the handwrite's own render
  // (drawWhiteboardVisual's `handwrite` branch) decides at ITS turn
  // whether to skip the caption line, based on whether the target
  // item's render (elsewhere in this same walk) actually baked it —
  // see `notesByTargetId` below, `itemInkNotes`, and `__pdfNoteBaked`.
  //
  // 2026-07-11 user round (stream-order fix): the ORIGINAL version of this
  // pre-pass only worked cleanly when the target item appeared BEFORE the
  // handwrite that references it in dedupedCommands, and fell back to a
  // "harmless double-appearance" caption otherwise. In the user's real
  // session that fallback fired for EVERY note — brain ordering routinely
  // puts the annotating handwrite before the figure it targets — so every
  // note fell to its in-place caption and NONE baked, even though most
  // targets did eventually render. Fix: existence, not stream position,
  // now decides fate. `existingIds` is every id that WILL render as an
  // item in this export, regardless of walk order; a note whose targetId
  // is in that set gets `__pdfNoteDeferred` stamped onto its source
  // handwrite command (suppressing its in-place caption unconditionally —
  // see the handwrite branch in drawWhiteboardVisual above), and its fate
  // (baked, or an honest fallback caption) is decided in the export loop
  // when the TARGET's render is processed — which may come before or
  // after this handwrite's own position. A note whose target does NOT
  // exist anywhere in this export is left alone entirely (no stamp, no
  // entry in the map below) and keeps its normal in-place caption — spec
  // (b)'s "notes whose target does not exist keep their in-place caption".
  type PdfNoteEntry = { text: string; color?: string; targetFeature: string; sourceCmd: WhiteboardCommandData };
  const notesByTargetId = new Map<string, PdfNoteEntry[]>();
  if (inkNotesEnabled()) {
    const existingIds = new Set<string>();
    for (const cmd of dedupedCommands) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = (cmd as any).id;
      if (typeof id === 'string' && id) existingIds.add(id);
    }
    for (const cmd of dedupedCommands) {
      if (cmd.action !== 'handwrite') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = cmd as any;
      const targetId = typeof c.targetId === 'string' ? c.targetId : undefined;
      const targetFeature = typeof c.targetFeature === 'string' ? c.targetFeature : undefined;
      // Both fields are stamped together (or not at all) by the near-
      // resolution block in VoiceTutorRealtime.tsx — no partial state.
      if (!targetId || !targetFeature) continue;
      const text = typeof c.text === 'string' ? c.text : '';
      if (!text.trim()) continue;
      if (!existingIds.has(targetId)) continue; // target not in this export → plain margin note (spec b)
      const list = notesByTargetId.get(targetId) || [];
      list.push({ text, color: typeof c.color === 'string' ? c.color : undefined, targetFeature, sourceCmd: cmd });
      notesByTargetId.set(targetId, list);
      c.__pdfNoteDeferred = true;
    }
  }

  const addPageIfNeeded = (space: number) => {
    if (y + space > 272) { pdf.addPage(); y = 20; }
  };

  const drawWrappedText = (
    text: string, x: number, maxWidth: number,
    opts: { size?: number; style?: string; color?: [number, number, number]; lineHeight?: number } = {}
  ) => {
    const { size = 9, style = 'normal', color = [74, 85, 104], lineHeight = LINE_HEIGHT } = opts;
    pdf.setFont('helvetica', style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    const safe = sanitizeForPDF(text);
    const lines: string[] = pdf.splitTextToSize(safe, maxWidth);
    for (const line of lines) {
      addPageIfNeeded(lineHeight + 1);
      pdf.text(line, x, y);
      y += lineHeight;
    }
  };

  // ── Header ──
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 38, 'F');
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 35, pageWidth, 3, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AI Tutor Session', margin, 16);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generated by Evelyn Learning', margin, 24);
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(sanitizeForPDF(dateStr), margin, 30);
  y = 48;

  // ── Session Info ──
  const subjectLabel = options?.subject ? options.subject.charAt(0).toUpperCase() + options.subject.slice(1) : '';
  const levelLabel = options?.level || '';
  const subjectLine = subjectLabel
    ? `Subject: ${subjectLabel}${levelLabel ? ` | Level: ${levelLabel}` : ''}`
    : levelLabel ? `Level: ${levelLabel}` : '';
  if (subjectLine) {
    drawWrappedText(subjectLine, margin, contentWidth, { size: 11, style: 'bold', color: [26, 32, 44], lineHeight: 6 });
  }
  drawWrappedText(`Topic: ${topicName}`, margin, contentWidth, { size: subjectLine ? 10 : 11, style: subjectLine ? 'normal' : 'bold', color: subjectLine ? [55, 65, 81] : [26, 32, 44], lineHeight: 6 });
  const goalLabel = sessionGoal === 'homework-help' ? 'Homework Help' : sessionGoal === 'concept-review' ? 'Concept Review' : sessionGoal === 'test-prep' ? 'Test Prep' : sessionGoal === 'explain' ? 'Explain' : sessionGoal === 'test' ? 'Test' : 'Practice';
  drawWrappedText(`Goal: ${goalLabel}${studentName ? ` | Student: ${studentName}` : ''}`, margin, contentWidth, { size: 10, color: [100, 116, 139], lineHeight: 6 });
  const studentMessages = transcript.filter(m => m.role === 'student').length;
  const tutorMessages = transcript.filter(m => m.role === 'tutor').length;
  drawWrappedText(`Messages: ${studentMessages} student, ${tutorMessages} tutor | Whiteboard items: ${dedupedCommands.length}`, margin, contentWidth, { size: 10, color: [100, 116, 139], lineHeight: 6 });
  y += 4;

  // ── Whiteboard Content (visual) ──
  if (dedupedCommands.length > 0) {
    addPageIfNeeded(14);
    drawWrappedText('Whiteboard Content', margin, contentWidth, { size: 12, style: 'bold', color: [26, 32, 44], lineHeight: 8 });

    // Track whiteboard page groups so each page (per the runtime's page model)
    // gets its own header + starts on a fresh PDF page — mirroring the on-
    // screen pagination instead of a flat item dump.
    let pdfGroupTitle: string | undefined;
    let pdfGroupNum = 0;
    let pdfGroupStarted = false;

    for (let i = 0; i < dedupedCommands.length; i++) {
      const cmd = dedupedCommands[i];

      // New whiteboard page? Emit a page header (and a fresh PDF page for every
      // group after the first) so the export reads page-by-page like the board.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const thisGroupTitle = (cmd as any).__pdfPageTitle as string | undefined;
      if (!pdfGroupStarted || thisGroupTitle !== pdfGroupTitle) {
        pdfGroupStarted = true;
        pdfGroupTitle = thisGroupTitle;
        pdfGroupNum += 1;
        if (pdfGroupNum > 1) { pdf.addPage(); y = 20; }
        else { y += 2; }
        drawWrappedText(
          `Page ${pdfGroupNum}: ${thisGroupTitle || 'Untitled'}`,
          margin, contentWidth,
          { size: 10, style: 'bold', color: [59, 130, 246], lineHeight: 7 },
        );
      }

      // Check if this command has a visual renderer and estimate height.
      // For actions with native drawers we know the shape; everything else
      // falls through to the captured-SVG fallback which targets the
      // shared 520×360 DIAGRAM_VIEWBOX (aspect ≈ 0.69) — at contentWidth
      // ~170mm that's ~118mm tall, so we reserve 125mm to avoid a page
      // break mid-SVG. If the captured SVG ends up smaller the remaining
      // space is reclaimed by the next item.
      const nativeDrawerActions = new Set([
        'showEquation', 'showSvgDiagram', 'showGraph', 'showTable',
        'showCode', 'showGeometry', 'showProblem',
      ]);
      const nativeDrawerDiagramTypes = new Set([
        'pipe-flow', 'fluid-flow', 'continuity', 'free-body',
        'vectors', 'velocity', 'vector-addition',
      ]);
      const visualHeight = (cmd.action === 'showEquation') ? 18 :
        (cmd.action === 'showSvgDiagram') ? 100 :
        (cmd.action === 'showGraph') ? 110 :
        (cmd.action === 'showTable') ? Math.min(10 + ((cmd.rows as unknown[])?.length || 0) * 7, 80) :
        (cmd.action === 'showCode') ? Math.min(10 + (String(cmd.code || '').split('\n').length) * 3.5 + 6, 60) :
        (cmd.action === 'showGeometry') ? 70 :
        (cmd.action === 'showDiagram' && nativeDrawerDiagramTypes.has(cmd.type as string)) ? 50 :
        nativeDrawerActions.has(String(cmd.action)) ? 0 :
        125; // captured-SVG fallback reservation

      addPageIfNeeded(visualHeight + 14);

      // Command number badge + description
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      const badgeText = `#${i + 1}`;
      const badgeW = pdf.getTextWidth(badgeText) + 6;
      pdf.setFillColor(59, 130, 246);
      pdf.roundedRect(margin, y - 3, badgeW, 4.5, 1, 1, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.text(badgeText, margin + 3, y);

      // Description text next to badge
      const desc = describeWhiteboardCommand(cmd);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(59, 130, 246);
      pdf.text(sanitizeForPDF(desc), margin + badgeW + 3, y);
      y += 5;

      // Visual rendering — also bake in any scribble annotations targeting
      // this item so the PDF matches what the student saw on screen.
      // Try ID-based lookup first (preferred), fall back to 1-indexed
      // position within the PDF list.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const thisId = (cmd as any).id as string | undefined;
      const itemScribbles = [
        ...(thisId ? (scribblesByTargetId.get(thisId) || []) : []),
        ...(scribblesByIndex.get(i + 1) || []),
      ];
      // SmoothDraw P3: notes targeting THIS item, sourced from the
      // notesByTargetId pre-pass above. bakedNoteTexts collects what
      // overlayScribbles actually managed to bake (feature match found)
      // so the corresponding handwrite command's OWN list entry can
      // skip its caption line when its turn comes later in this walk.
      const itemNoteEntries = thisId ? (notesByTargetId.get(thisId) || []) : [];
      // 2026-07-11 round 2: labeled scribbles join the note bake. Live,
      // a scribble label flows through InkNotesOverlay identically to a
      // handwrite note, but the PDF only ever gave it the strip-mirror
      // caption line (user session: "point-a -> the far corner" as a
      // caption while the live board showed the label beside the corner).
      // Eligibility mirrors overlayScribbles' own requirement: a
      // targetFeature to resolve against (labels without one keep their
      // strip line as before). Scribbles have no walk position of their
      // own (filtered out of dedupedCommands), so no __pdfNoteDeferred
      // machinery is needed — the strip-mirror block below IS their
      // caption fallback, and it now skips the ones that baked.
      const bakeableScribbleLabels = itemScribbles.filter((s) => s.label && s.label.trim() && s.targetFeature);
      const itemInkNotes = (itemNoteEntries.length > 0 || bakeableScribbleLabels.length > 0)
        ? [
            ...itemNoteEntries.map((n) => ({ text: n.text, color: n.color, targetFeature: n.targetFeature })),
            ...bakeableScribbleLabels.map((s) => ({ text: s.label as string, color: s.color, targetFeature: s.targetFeature })),
          ]
        : undefined;
      const bakedNoteTexts: string[] = [];
      const newY = await drawWhiteboardVisual(
        pdf, cmd, margin + 4, y, contentWidth - 8,
        itemScribbles.length > 0 ? itemScribbles : undefined,
        itemInkNotes,
        bakedNoteTexts,
      );
      // 2026-07-11 user round: tracks which of itemNoteEntries actually got
      // baked this pass, so the unbaked remainder (below) each get an
      // honest fallback caption printed right here — immediately after the
      // item they targeted — rather than silently vanishing (their
      // in-place caption at the handwrite's own position was suppressed by
      // __pdfNoteDeferred in the pre-pass, regardless of stream order).
      const bakedEntries = new Set<PdfNoteEntry>();
      // 2026-07-11 round 2: baked scribble labels, consumed from the same
      // multiset AFTER the handwrite entries (handwrites first keeps the
      // pre-existing marking behavior byte-identical when no scribble
      // labels are in play). A scribble in this set skips its strip-mirror
      // caption line below.
      const bakedScribbleLabels = new Set<ScribbleShape>();
      if (bakedNoteTexts.length > 0) {
        // Text-match scoped to THIS item's own note list (see
        // overlayScribbles' doc comment on why text rather than a
        // synthetic id) — mark the source handwrite command so its own
        // render, later in this same loop, skips the caption line.
        //
        // Consumed as a MULTISET (each baked text is spent on exactly
        // ONE source command), not a membership test. A plain
        // `.includes()` would mark EVERY command sharing the text — so
        // if two identical-text notes co-target this item and only one
        // resolved to a feature, the unresolved one would lose its
        // caption line too: silent content loss. Splicing each match
        // out keeps marked-command count == actually-baked count.
        const remainingBaked = [...bakedNoteTexts];
        for (const entry of itemNoteEntries) {
          const idx = remainingBaked.indexOf(entry.text);
          if (idx >= 0) {
            remainingBaked.splice(idx, 1);
            // Mutates the live command object (same ref held by React
            // state) — consistent with the pre-existing __pdfPageTitle
            // stamping in the page-grouping pre-walk above.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (entry.sourceCmd as any).__pdfNoteBaked = true;
            bakedEntries.add(entry);
          }
        }
        for (const s of bakeableScribbleLabels) {
          const idx = remainingBaked.indexOf(s.label as string);
          if (idx >= 0) {
            remainingBaked.splice(idx, 1);
            bakedScribbleLabels.add(s);
          }
        }
      }
      if (newY > y) {
        y = newY;
      } else {
        // No visual renderer — fall back to text description
        if (cmd.action === 'showDiagram') {
          const params = (cmd.params || {}) as Record<string, unknown>;
          if (params.description) {
            drawWrappedText(String(params.description), margin + 8, textAreaWidth - 4, { size: 8, style: 'italic', color: [100, 116, 139] });
          }
          if (params.forces && Array.isArray(params.forces)) {
            const forceDescs = (params.forces as { magnitude?: number; direction?: number; label?: string }[])
              .map(f => `${f.label || '?'}: ${f.magnitude || '?'}N @ ${f.direction || '?'}deg`)
              .join(', ');
            drawWrappedText(`Forces: ${forceDescs}`, margin + 8, textAreaWidth - 4, { size: 8, style: 'italic', color: [100, 116, 139] });
          }
          if (params.vectors && Array.isArray(params.vectors)) {
            const vecDescs = (params.vectors as { magnitude?: number; direction?: number; label?: string }[])
              .map(v => `${v.label || '?'}: ${v.magnitude || '?'} @ ${v.direction || '?'}deg`)
              .join(', ');
            drawWrappedText(`Vectors: ${vecDescs}`, margin + 8, textAreaWidth - 4, { size: 8, style: 'italic', color: [100, 116, 139] });
          }
        }
        if (cmd.action === 'showProblem' && cmd.problem) {
          const prob = cmd.problem as Record<string, unknown>;
          if (prob.statement) {
            drawWrappedText(String(prob.statement), margin + 8, textAreaWidth - 4, { size: 8, color: [55, 65, 81] });
          }
        }
      }

      // 2026-07-11 user round — deferred-caption fallback: every entry in
      // itemNoteEntries that did NOT bake (feature resolution failed, or
      // this item's action has no bake path at all) still needs its
      // content to survive somewhere — print it now, right after the item
      // it targeted (y is already resolved to this item's true bottom
      // here, past the if/else above). No "→ margin note" suffix (spec:
      // that phrase is reserved for notes with NO target stamp — see the
      // honesty comment in the handwrite branch of drawWhiteboardVisual);
      // this note DID have a real target, it just didn't render there.
      const unbakedNotes = itemNoteEntries.filter((n) => !bakedEntries.has(n));
      if (unbakedNotes.length > 0) {
        addPageIfNeeded(unbakedNotes.length * 8 + 2);
        for (const n of unbakedNotes) {
          y = drawNoteCaptionLine(pdf, n.text, n.color || '#a16207', margin + 4, y, contentWidth - 8);
        }
      }

      // Post-redesign annotation strip mirror: for any scribble on this
      // item that carries a label, emit a single colored-bullet line.
      // 2026-07-11 round 2: labels CAN now paint on the diagram itself
      // (bakeableScribbleLabels above) — a label that baked skips its
      // mirror line here; this block remains the caption fallback for
      // labels with no targetFeature or whose feature didn't resolve.
      const labelledScribbles = itemScribbles.filter((s) => s.label && s.label.trim() && !bakedScribbleLabels.has(s));
      if (labelledScribbles.length > 0) {
        addPageIfNeeded(labelledScribbles.length * 5 + 2);
        for (const s of labelledScribbles) {
          const colorHex = (s.color && /^#[0-9a-fA-F]{3,8}$/.test(s.color)) ? s.color : '#3b82f6';
          const parsed = ((): [number, number, number] => {
            const h = colorHex.replace('#', '');
            const n = h.length === 3
              ? [h[0] + h[0], h[1] + h[1], h[2] + h[2]]
              : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
            return [parseInt(n[0], 16), parseInt(n[1], 16), parseInt(n[2], 16)];
          })();
          pdf.setFillColor(...parsed);
          pdf.circle(margin + 5.8, y + 1.6, 1.0, 'F');
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(...parsed);
          const featureName = s.targetFeature || 'feature';
          const line = `${featureName} → ${s.label}`;
          const wrapped = pdf.splitTextToSize(sanitizeForPDF(line), contentWidth - 18);
          pdf.text(wrapped, margin + 9.5, y + 2.4);
          const lines = Array.isArray(wrapped) ? wrapped.length : 1;
          y += lines * 4.4 + 1;
        }
        y += 1;
      }

      y += 3;
    }
    y += 4;
  }

  // ── Transcript ──
  addPageIfNeeded(10);
  drawWrappedText('Conversation Transcript', margin, contentWidth, { size: 12, style: 'bold', color: [26, 32, 44], lineHeight: 8 });

  for (const msg of transcript) {
    if (msg.role === 'system') continue;
    addPageIfNeeded(14);

    const isStudent = msg.role === 'student';
    const label = isStudent ? 'STUDENT' : 'TUTOR';
    const labelColor: [number, number, number] = isStudent ? [59, 130, 246] : [147, 51, 234];

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    const badgeW = pdf.getTextWidth(label) + 6;
    pdf.setFillColor(...labelColor);
    pdf.roundedRect(margin, y - 3, badgeW, 4.5, 1, 1, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(label, margin + 3, y);

    const ts = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
    const timeStr = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(timeStr, margin + badgeW + 4, y);
    y += 5;

    drawWrappedText(toWinAnsiSafe(msg.text), margin + 4, textAreaWidth, { size: 9, color: [55, 65, 81] });

    if (msg.pedagogicalIntent && includeDebug) {
      drawWrappedText(`[${msg.pedagogicalIntent}]`, margin + 4, textAreaWidth, { size: 7, style: 'italic', color: [156, 163, 175] });
    }

    // Inline whiteboard visuals for commands attached to this message.
    // Filter out state-side-effect commands (advance_lesson, mark_segment_
    // complete, record_gap, topic-notes overlays) — these are bookkeeping
    // tools that have no whiteboard render. The live orchestrator filters
    // them at VoiceTutorRealtime.tsx:3455 before reaching the renderer,
    // but the PDF reads commands straight from the DB and so needs its
    // own filter — without it, captureCommandRaster mounts CommandRenderer
    // for these and the default case prints "Unknown command type" in
    // the PDF (observed 2026-05-13 session).
    const META_PDF_BOOKKEEPING = new Set([
      'advanceLesson', 'markSegmentComplete', 'proposePlanSwap',
      'confirmPlanLos', 'recordGap', 'flagPrerequisiteGap',
      'expandTopicNotesTheory', 'addTopicNotesMethod', 'addTopicNotesPointer',
      // Nav + annotation commands have no standalone inline render — the live
      // canvas handles them, and scribbles already render as annotations ON
      // their target item elsewhere in the PDF. Without these, the transcript-
      // inline renderer hits its default case and prints "Unknown command type"
      // cards (observed 2026-06-22 ear-test: 9 such cards from the [scrollTo,
      // scrollTo, scribble] triples that the auto-scroll-before-scribble path
      // emits). Board-anchored speech's extra scribbling made the gap loud.
      'scrollTo', 'goToPage', 'openPage', 'scribble', 'highlight',
    ]);
    if (msg.whiteboardCommands && msg.whiteboardCommands.length > 0) {
      for (const cmd of msg.whiteboardCommands) {
        if (META_PDF_BOOKKEEPING.has(String(cmd.action))) continue;
        // Reserve enough room for the *actual* command type — graphs/
        // diagrams/circles need ~85mm, equations ~30mm. The prior
        // hard-coded 20mm reservation let the 2026-04-29 geometry
        // session's graph spill off the bottom of page 6.
        addPageIfNeeded(estimateCommandHeight(cmd));
        const newY = await drawWhiteboardVisual(pdf, cmd, margin + 4, y, textAreaWidth);
        if (newY > y) {
          y = newY;
        } else {
          const cmdDesc = describeWhiteboardCommand(cmd);
          drawWrappedText(`[Whiteboard] ${cmdDesc}`, margin + 4, textAreaWidth, { size: 8, style: 'italic', color: [59, 130, 246] });
        }
      }
    }

    y += 3;
  }

  // ── Footer ──
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, 282, pageWidth - margin, 282);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text('Generated by Evelyn Learning -- AI Voice Tutor', margin, 287);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 22, 287);
  }

  const safeTopicName = topicName.replace(/[^a-zA-Z0-9]+/g, '_');
  const filename = `Tutor_Session_${safeTopicName}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}
