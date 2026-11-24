/**
 * CJK text support for the session PDF (task 32 §A).
 *
 * jsPDF ships Helvetica/Courier only (WinAnsi), so before this module every
 * Japanese gloss, page title and table cell in a bilingual lesson printed as
 * "????" or "[Chinese text]". Here:
 *   - `hasCjk` decides whether a session needs the CJK font at all, so a
 *     Latin-only session never fetches it (the font is ~2.6 MB on the wire;
 *     jsPDF subsets it to the used glyphs when it writes the PDF).
 *   - `pickCjkFont` names the ONE font file a document needs: Noto Sans JP
 *     (kana, JIS kanji), Noto Sans TC (Traditional Chinese, Taiwan) or Noto
 *     Sans SC (Simplified Chinese). The JP file has no 說 嗎 你 这 们 …, so a
 *     Chinese lesson printed in it shows empty boxes.
 *   - `loadCjkFontBase64` fetches that file once per page load (null on any
 *     failure: Node, offline, 404).
 *   - `installCjkFontRouter` is the ONE font picker: it wraps the jsPDF
 *     instance's text / splitTextToSize / getTextWidth so any string that
 *     carries CJK is measured and drawn in the document's CJK font, everything else in
 *     whatever font the call site set (helvetica / courier). Every text sink
 *     in the exporter goes through it without per-site edits.
 *   - `mapNonLatin1Runs` is the sanitiser tail: CJK runs are KEPT when the
 *     font is loaded, and labelled ("[Japanese text]" …) when it is not.
 *
 * Pure apart from the loader + router; no jsPDF runtime import, so the
 * helpers are node-testable (scripts/test-pdf-tutor-session.ts).
 */
import type jsPDF from 'jspdf';
import { lessonLanguageOf } from '../../tutor/voice/lesson-language';

export type CjkFontKey = 'jp' | 'tc' | 'sc';
export interface CjkFontFile { family: string; file: string; url: string }
const fontFile = (family: string): CjkFontFile => ({ family, file: `${family}-Regular-subset.ttf`, url: `/fonts/${family}-Regular-subset.ttf` });
/** One subset file per script (public/fonts/FONTS.md). A document embeds at most one. */
export const CJK_FONTS: Record<CjkFontKey, CjkFontFile> = {
  jp: fontFile('NotoSansJP'),
  tc: fontFile('NotoSansTC'),
  sc: fontFile('NotoSansSC'),
};

export const CJK_FONT_FAMILY = CJK_FONTS.jp.family;
export const CJK_FONT_FILE = CJK_FONTS.jp.file;
export const CJK_FONT_URL = CJK_FONTS.jp.url;

// CJK symbols + punctuation (「」。、), kana, kana extensions, CJK ext-A +
// unified ideographs, half/fullwidth forms.
const CJK_CLASS = '\\u3000-\\u303F\\u3040-\\u30FF\\u31F0-\\u31FF\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uFF00-\\uFFEF';
const CJK_TEST = new RegExp(`[${CJK_CLASS}]`);
// A CJK run, with whitespace-separated runs merged so "概要 まとめ" gets ONE
// label in the no-font fallback, not two.
const CJK_RUN_G = new RegExp(`[${CJK_CLASS}]+(?:\\s+[${CJK_CLASS}]+)*`, 'g');
const OTHER_NON_LATIN1_G = new RegExp(`[^\\u0000-\\u00FF${CJK_CLASS}]+`, 'g');
const KANA_TEST = /[\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F]/;
const HAN_TEST = /[\u3400-\u4DBF\u4E00-\u9FFF]/;

// Script markers for a document whose language nobody named. Each set holds only characters that Japanese
// text does not use, so a kanji-only Japanese string (数学, 練習問題, 時間) matches none and keeps the JP font.
// Checked against the three shipped files: every TRADITIONAL_ONLY character is in the TC file and not the SC
// one, every SIMPLIFIED_ONLY character the reverse, and no CHINESE_EITHER character is in the JP file.
const TRADITIONAL_ONLY = new Set('這說們為麼對驗會來沒讓從兩應樣關嗎妳');
const SIMPLIFIED_ONLY = new Set('这说们时问题为习对错请练联组验边个还让给从见过师进应该样开关两吗');
/** Written the same in both Chinese scripts, absent from Japanese (and from the JP file). */
const CHINESE_EITHER = new Set('你您她吧呢啊哪喔');

const FONT_OF_LESSON_LANGUAGE: Record<string, CjkFontKey> = { 'zh-TW': 'tc', 'zh-CN': 'sc', ja: 'jp' };

/**
 * The CJK font a document is printed in, or null when its text has no CJK (no font is fetched).
 *
 * `lessonLanguage` is the session's language when the caller knows it: one code or the session's list
 * (`['zh-TW']`, `['en', 'ja']`). The first Chinese or Japanese entry decides. Without one the text decides:
 * kana is Japanese; Traditional-only or Simplified-only characters name their script (the larger count wins,
 * Traditional on a tie); Chinese written the same in both scripts prints in TC; anything else — kanji alone,
 * CJK punctuation alone — keeps the JP font, as before the Chinese files existed.
 */
export function pickCjkFont(text: string, lessonLanguage?: string | readonly string[] | null): CjkFontKey | null {
  if (!hasCjk(text)) return null;
  const codes = typeof lessonLanguage === 'string' ? [lessonLanguage] : Array.isArray(lessonLanguage) ? lessonLanguage : [];
  for (const code of codes) {
    const named = FONT_OF_LESSON_LANGUAGE[lessonLanguageOf(code)?.code ?? ''];
    if (named) return named;
  }
  if (KANA_TEST.test(text)) return 'jp';
  let traditional = 0, simplified = 0, either = 0;
  for (const ch of text) {
    if (TRADITIONAL_ONLY.has(ch)) traditional++;
    else if (SIMPLIFIED_ONLY.has(ch)) simplified++;
    else if (CHINESE_EITHER.has(ch)) either++;
  }
  if (traditional > 0 && traditional >= simplified) return 'tc';
  if (simplified > 0) return 'sc';
  if (either > 0) return 'tc';
  return 'jp';
}

export function hasCjk(text: unknown): boolean {
  if (typeof text === 'string') return CJK_TEST.test(text);
  if (Array.isArray(text)) return text.some((t) => typeof t === 'string' && CJK_TEST.test(t));
  return false;
}

export interface PdfTextContext {
  /** The CJK font is embedded in the PDF being written. */
  cjkFont: boolean;
  /** Session teaching languages (ISO-ish codes: 'en', 'ja', 'zh' …). */
  languages: string[];
}

const DEFAULT_CTX: PdfTextContext = { cjkFont: false, languages: [] };
let currentCtx: PdfTextContext = DEFAULT_CTX;

/** Set by exportTutorSessionPDF for the duration of one export. */
export function setPdfTextContext(ctx: PdfTextContext): void { currentCtx = ctx; }
export function resetPdfTextContext(): void { currentCtx = DEFAULT_CTX; }
export function getPdfTextContext(): PdfTextContext { return currentCtx; }

/**
 * Session languages: explicit when the caller knows them, otherwise inferred
 * from the content — kana anywhere in the session means Japanese is one of
 * the languages (kana is unique to Japanese; a kanji-only word like 仕事 in
 * a session that also has kana is Japanese, not Chinese).
 */
export function inferSessionLanguages(allText: string, explicit?: string[]): string[] {
  if (Array.isArray(explicit) && explicit.length) return explicit.map((l) => String(l).toLowerCase());
  const langs: string[] = [];
  if (KANA_TEST.test(allText)) langs.push('ja');
  if (/[\uAC00-\uD7AF]/.test(allText)) langs.push('ko');
  return langs;
}

const hasLang = (languages: string[], code: string) => languages.some((l) => l === code || l.startsWith(`${code}-`));

/** Bracket label for a CJK run when the CJK font is NOT available. Kana
 *  first (always Japanese), kanji second (by the session's languages). */
export function labelCjkRun(run: string, languages: string[]): string {
  if (KANA_TEST.test(run)) return '[Japanese text]';
  if (HAN_TEST.test(run)) {
    if (hasLang(languages, 'ja')) return '[Japanese text]';
    if (hasLang(languages, 'zh')) return '[Chinese text]';
    if (hasLang(languages, 'ko')) return '[Korean text]';
    return '[Chinese text]';
  }
  // Punctuation / fullwidth forms only (「」, Ａ): Japanese in a ja session.
  return hasLang(languages, 'ja') ? '[Japanese text]' : '[non-Latin text]';
}

/**
 * Sanitiser tail for every character outside Latin-1. CJK runs are kept
 * verbatim when `ctx.cjkFont` (the router draws them in Noto Sans JP) and
 * labelled otherwise; every other non-Latin-1 run goes to `other` (the
 * caller's existing behaviour: '?' per char, or a script label).
 */
export function mapNonLatin1Runs(s: string, ctx: PdfTextContext, other: (run: string) => string): string {
  let out = s;
  if (!ctx.cjkFont) out = out.replace(CJK_RUN_G, (run) => labelCjkRun(run, ctx.languages));
  return out.replace(OTHER_NON_LATIN1_G, other);
}

/** The font a string is drawn in: the document's CJK family when it carries
 *  CJK and the font is loaded (Regular only — no bold/italic cut is shipped),
 *  else the call site's own family/style. */
export function pickPdfFont(text: unknown, family: string, style: string, cjkAvailable: boolean, cjkFamily: string = CJK_FONT_FAMILY): { family: string; style: string } {
  if (cjkAvailable && hasCjk(text)) return { family: cjkFamily, style: 'normal' };
  return { family, style };
}

const cachedFontBase64 = new Map<string, string>();

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return btoa(bin);
}

/** Fetch one CJK font file as base64 (cached per file). Null on any failure
 *  — the exporter then keeps the bracket-label fallback. */
export async function loadCjkFontBase64(url: string = CJK_FONT_URL): Promise<string | null> {
  const cached = cachedFontBase64.get(url);
  if (cached) return cached;
  try {
    if (typeof fetch !== 'function') return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    const b64 = arrayBufferToBase64(await res.arrayBuffer());
    if (!b64) return null;
    cachedFontBase64.set(url, b64);
    return b64;
  } catch {
    return null;
  }
}

/** Register the font on one jsPDF instance. Every style maps to the same
 *  Regular file so a stray setFont(CJK, 'bold') never throws. */
export function registerCjkFont(pdf: jsPDF, base64: string, font: CjkFontKey = 'jp'): void {
  const { file, family } = CJK_FONTS[font];
  pdf.addFileToVFS(file, base64);
  for (const style of ['normal', 'bold', 'italic', 'bolditalic']) {
    pdf.addFont(file, family, style);
  }
}

/**
 * Route every string that carries CJK through the document's CJK font, on this
 * instance only. Lines produced by a CJK-measured splitTextToSize are
 * remembered so a wrapped line that happens to hold only Latin text is
 * still drawn in the font it was measured with (no overflow).
 */
export function installCjkFontRouter(pdf: jsPDF, font: CjkFontKey = 'jp'): void {
  const cjkFamily = CJK_FONTS[font].family;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = pdf as any;
  const measuredInCjk = new Set<string>();
  const needsCjk = (t: unknown) => hasCjk(t)
    || (typeof t === 'string' && measuredInCjk.has(t))
    || (Array.isArray(t) && t.some((l) => typeof l === 'string' && measuredInCjk.has(l)));
  const withCjk = <T>(t: unknown, fn: () => T): T => {
    if (!needsCjk(t)) return fn();
    const prev = pdf.getFont();
    const pick = pickPdfFont('一', prev.fontName, prev.fontStyle, true, cjkFamily);
    pdf.setFont(pick.family, pick.style);
    try { return fn(); } finally { pdf.setFont(prev.fontName, prev.fontStyle); }
  };
  const origText = p.text.bind(pdf);
  const origSplit = p.splitTextToSize.bind(pdf);
  const origWidth = p.getTextWidth.bind(pdf);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p.text = (text: any, ...rest: any[]) => withCjk(text, () => origText(text, ...rest));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p.splitTextToSize = (text: any, ...rest: any[]) => withCjk(text, () => {
    const lines = origSplit(text, ...rest);
    if (hasCjk(text) && Array.isArray(lines)) for (const l of lines) if (typeof l === 'string') measuredInCjk.add(l);
    return lines;
  });
  p.getTextWidth = (text: string) => withCjk(text, () => origWidth(text));
}
