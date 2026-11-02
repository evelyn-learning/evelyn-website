// src/lib/tutor/voice/menu-pick.ts
/**
 * Numbered menus the tutor reads out ("1) individual words, 2) a complete
 * sentence, 3) speaking more naturally, or 4) skip and continue?").
 *
 * Task 30 §A1 (GDI run 17, 477–488 s): an answer to a menu is made of the
 * menu's own words, so the self-voice lookback gates read it as echo — the
 * options' words join the pending-answer vocabulary (pending-answer.ts).
 * Task 30 §H (GDI run 17, 1198 s): "Um, the uh sentence." answered the menu
 * and the tutor listed the options a third time — resolveMenuPick names the
 * option the student chose. Pure, generic.
 */

export interface MenuOption { index: number; text: string }

const MENU_OPTION_RE = /\b([1-9])\)\s*([^,;.?]+?)(?=,?\s*(?:or\s+)?\b[1-9]\)|[.?]|$)/g;

/** The numbered options of `text` (≥ 2, else null), in order. */
export function parseMenuOptions(text: string | null | undefined): MenuOption[] | null {
  const t = (text ?? '').replace(/\s+/g, ' ');
  if (!t) return null;
  const out: MenuOption[] = [];
  for (const m of t.matchAll(MENU_OPTION_RE)) {
    const opt = m[2]!.trim();
    if (opt) out.push({ index: Number(m[1]), text: opt });
  }
  return out.length >= 2 ? out : null;
}

/** Lower-case word tokens (letters / digits; an in-word apostrophe kept). */
export function menuWordTokens(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu) ?? []);
}

const MENU_NUMBER_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };
const PICK_FILLER_RE = /\b(?:um+|uh+|er+|ah+|hmm+|the|a|an|please|i['’]d like(?: to)?|i would like(?: to)?|let['’]?s|option|number)\b/gi;
const OPTION_STOP = new Set(['a', 'an', 'the', 'and', 'or', 'to', 'of']);
const fold = (w: string) => (w.length > 3 ? w.replace(/(?<!s)s$/, '') : w);
/**
 * Task 30 §H (GDI run 17, 1198 s: "Um, the uh sentence." answering "1)
 * individual words, 2) a complete sentence, 3) speaking more naturally, or 4)
 * skip and continue" was not recognised and the tutor listed the options a
 * third time): the option the student picked. Fillers stripped (um, uh, the,
 * a, please, I'd like, let's, option, number); a match is the option's digit /
 * number word said alone, or ALL of the student's remaining words found in
 * exactly ONE option's words (singular / plural folded). null when there is no
 * menu (≥ 2 options) in `lastTutorText`, nothing is left, or the pick is
 * ambiguous / unknown. Pure.
 */
export function resolveMenuPick(studentText: string | null | undefined, lastTutorText: string | null | undefined): MenuOption | null {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return null;
  const options = parseMenuOptions(lastTutorText);
  if (!options) return null;
  const words = menuWordTokens(t.replace(PICK_FILLER_RE, ' '));
  if (words.length === 0) return null;
  if (words.length === 1) {
    const n = /^[1-9]$/.test(words[0]!) ? Number(words[0]) : MENU_NUMBER_WORDS[words[0]!];
    if (n) {
      // Fix round 1 (I-4): when the options' own texts hold numbers ("1) 3,
      // 2) 4, 3) 5"), a number is an answer BY CONTENT — the option that
      // contains it (exactly one), else null; the index only when no option
      // text contains a number.
      const numbersOf = (o: MenuOption) => menuWordTokens(o.text)
        .map((w) => (/^\d+$/.test(w) ? Number(w) : MENU_NUMBER_WORDS[w] ?? NaN))
        .filter((x) => Number.isFinite(x));
      if (options.some((o) => numbersOf(o).length > 0)) {
        const hits = options.filter((o) => numbersOf(o).includes(n));
        return hits.length === 1 ? hits[0]! : null;
      }
      return options.find((o) => o.index === n) ?? null;
    }
  }
  const said = words.map(fold);
  const hits = options.filter((o) => {
    const own = new Set(menuWordTokens(o.text).filter((w) => !OPTION_STOP.has(w)).map(fold));
    return said.every((w) => own.has(w));
  });
  return hits.length === 1 ? hits[0]! : null;
}

/** Task 30 §H: the note on the student's turn that picked an option. */
export function menuPickNote(pick: MenuOption): string {
  return `[runtime note — not from the student] The student chose option ${pick.index}: "${pick.text}". Proceed with that option now; do not list the options again. Apply this silently; never mention this note.]`;
}

/**
 * Task 33 §C (GDI bot run r8, 1153–1220 s: the pronunciation menu — "asked
 * twice without a pick → skip to the summary" in the plan's note — was asked
 * seven times, "どの番号にしますか" ×6). The engine enforces the cap: a menu
 * part (its card offers numbered choices) counts the tutor turns that ask the
 * menu while no option was picked; once MENU_ASK_CAP asks went unpicked, the
 * student's next reply that is not a pick moves the lesson on itself
 * (reason=menu_unpicked). A bare acknowledgement ("OK", "Yes", "OK, thank
 * you", "I understand", はい) is never a pick. Pure, generic.
 */
export const MENU_ASK_CAP = 2;
const MENU_NUMBER_ASK_RE = /\bwhich (?:number|option|one)\b|\b(?:tell me|say|give me|choose|pick)(?: me)? (?:the |a |one )?(?:number|option)\b|\bjust tell me the number\b|番号|何番|どれ(?:か|に)|選んで/i;
const ASK_SHAPE_RE = /[?？]|(?:か|ください|下さい)[。.!！]?\s*$/;
/** The card's option texts (`1) words, 2) …`), each one's content words (≥ 4 letters). */
function optionWords(cardStatement: string): string[][] {
  return (parseMenuOptions(cardStatement) ?? []).map((o) => menuWordTokens(o.text).filter((w) => w.length >= 4));
}
/** True ⇒ `turnText` asks the menu: a sentence that asks (a "?" / a
 *  Japanese ask ending) and asks for a number / option, or the turn names ≥ 2
 *  of the card's options and asks something. Pure. */
export function menuAskedIn(turnText: string | null | undefined, cardStatement: string | null | undefined): boolean {
  const t = (turnText ?? '').replace(/\s+/g, ' ').trim();
  if (!t) return false;
  const sentences = t.split(/(?<=[.!?。！？])\s*/).filter(Boolean);
  if (sentences.some((s) => MENU_NUMBER_ASK_RE.test(s) && (ASK_SHAPE_RE.test(s) || /\b(?:tell me|choose|pick)\b/i.test(s)))) return true;
  const words = new Set(menuWordTokens(t));
  const named = optionWords(cardStatement ?? '').filter((ws) => ws.length > 0 && ws.some((w) => words.has(w))).length;
  return named >= 2 && sentences.some((s) => ASK_SHAPE_RE.test(s));
}
const ACK_WORDS = new Set(['ok', 'okay', 'yes', 'yeah', 'yep', 'sure', 'alright', 'right', 'fine', 'thank', 'thanks', 'you', 'i', 'understand', 'see', 'got', 'it', 'um', 'uh', 'hmm', 'well', 'so', 'はい', 'うん', 'ええ', 'わかりました', '分かりました', 'ありがとうございます', 'ありがとう']);
/** A bare acknowledgement — every word an ack word ("OK, thank you.", "Yes, I understand.", はい). Pure. */
export function isBareAcknowledgement(studentText: string | null | undefined): boolean {
  const words = (studentText ?? '').toLowerCase().replace(/[.,!?。、！？…]+/g, ' ').split(/\s+/).filter(Boolean);
  return words.length > 0 && words.every((w) => ACK_WORDS.has(w));
}
const PICK_NUMBER_RE = /\b[1-9]\b|[1-9１-９]\s*番|\b(?:one|two|three|four|five|first|second|third|fourth|fifth)\b|[二三四]番(?!目)|\bskip\b|スキップ/i;
/** True ⇒ the reply picks (or tries to pick) an option: resolveMenuPick on
 *  the card or the last tutor turn, a number / option word, or "skip". A
 *  bare acknowledgement never is. Pure. */
/**
 * Task 33 fix round 1 (I-1): picks said in Japanese or as an ordinal resolve
 * BEFORE the cap sees them — "単語でお願いします", "一文で", "文で", "自然に",
 * "スキップ", "1番 / ２番 / 三番 / 二番目 / 四つ目", "number two", "the second
 * one", "the sentence one". The option list comes from the card and the
 * tutor's recent turns in the part: the "1) words" shape, and the Japanese
 * "1番は単語、2番は一文…" / "1番の単語か…" shape the tutor reads aloud.
 * Pure, generic (no option word in code).
 */
const KANJI_DIGIT: Record<string, number> = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
const digitOf = (c: string): number => KANJI_DIGIT[c] ?? Number(String.fromCharCode(c.charCodeAt(0) >= 0xff10 ? c.charCodeAt(0) - 0xfee0 : c.charCodeAt(0)));
const JA_OPTION_RE = /([1-9１-９一二三四五六七八九])\s*番(?:目)?\s*(?:は|の|が|：|:)?\s*([^、。,，か]+?)\s*(?=です|か|、|。|,|，|$)/g;
/** The "N番は X" options of a Japanese menu reading (≥ 2, else null). */
export function parseJapaneseMenuOptions(text: string | null | undefined): MenuOption[] | null {
  const out = new Map<number, string>();
  for (const m of (text ?? '').matchAll(JA_OPTION_RE)) {
    const n = digitOf(m[1]!);
    const opt = m[2]!.trim();
    if (n && opt && !out.has(n)) out.set(n, opt);
  }
  return out.size >= 2 ? [...out.entries()].sort((a, b) => a[0] - b[0]).map(([index, text]) => ({ index, text })) : null;
}
const JA_PICK_PARTICLES_RE = /(?:で|を|に|が|は)?(?:お願い(?:します|いたします)?|がいいです|にします|でいいです|をやりたい(?:です)?|を練習したい(?:です)?|練習(?:したい)?(?:です)?|したいです|します|ください|です)?[。.!！]*$/;
const ORDINAL_NUM_RE = /^(?:number\s+)?(one|two|three|four|five|first|second|third|fourth|fifth|[1-9])(?:\s+one)?$/i;
const JA_NUM_PICK_RE = /^([1-9１-９一二三四五六七八九])\s*(?:番(?:目)?|つ目)(?:の(?:もの|やつ))?/;
export function resolveMenuPickLoose(studentText: string | null | undefined, sources: ReadonlyArray<string | null | undefined>): MenuOption | null {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t) || isBareAcknowledgement(t)) return null;
  const srcs = sources.filter((x): x is string => typeof x === 'string' && x.trim() !== '');
  for (const src of srcs) { const p = resolveMenuPick(t, src); if (p) return p; }
  const optionsFrom = (): MenuOption[] | null => {
    for (const src of srcs) { const o = parseMenuOptions(src) ?? parseJapaneseMenuOptions(src); if (o) return o; }
    return null;
  };
  const byIndex = (n: number): MenuOption | null => {
    const opts = optionsFrom();
    return opts?.find((o) => o.index === n) ?? (n >= 1 && n <= 9 && !opts ? { index: n, text: '' } : null);
  };
  // English ordinal / "<option word> one": "the second one", "number two", "the sentence one"
  const en = menuWordTokens(t.replace(PICK_FILLER_RE, ' ')).join(' ');
  const om = ORDINAL_NUM_RE.exec(en);
  if (om) {
    const w = om[1]!.toLowerCase();
    const n = /^[1-9]$/.test(w) ? Number(w) : MENU_NUMBER_WORDS[w];
    if (n) return byIndex(n);
  }
  if (/\s+one$/i.test(en)) {
    const stripped = en.replace(/\s+one$/i, '');
    for (const src of srcs) { const p = resolveMenuPick(stripped, src); if (p) return p; }
  }
  // Japanese number: 1番 / ２番 / 三番 / 二番目 / 四つ目
  const core = t.replace(/^(?:えっと|ええと|あの|じゃあ|では|じゃ)[、,\s]*/, '').trim();
  const jm = JA_NUM_PICK_RE.exec(core);
  if (jm) return byIndex(digitOf(jm[1]!));
  // Japanese option noun: the reply's core (particles / politeness out) shares
  // its text with exactly ONE option of a Japanese menu reading.
  const noun = core.replace(JA_PICK_PARTICLES_RE, '').trim();
  if (noun && /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(noun)) {
    for (const src of srcs) {
      const opts = parseJapaneseMenuOptions(src);
      if (!opts) continue;
      const hits = opts.filter((o) => o.text.includes(noun) || noun.includes(o.text));
      if (hits.length === 1) return hits[0]!;
    }
  }
  return null;
}
export function menuReplyIsPick(studentText: string | null | undefined, cardStatement: string | null | undefined, lastTutorText?: string | null, partTutorTurns?: ReadonlyArray<string | null | undefined>): boolean {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t) || isBareAcknowledgement(t)) return false;
  if (resolveMenuPickLoose(t, [cardStatement, lastTutorText, ...(partTutorTurns ?? [])])) return true;
  if (PICK_NUMBER_RE.test(t)) return true;
  const words = new Set(menuWordTokens(t).map(fold));
  return optionWords(cardStatement ?? '').some((ws) => ws.some((w) => words.has(fold(w))));
}
/** The decision on a student turn in a menu part: 'advance' once `asks`
 *  unpicked menu asks reached the cap and this reply is no pick. Pure. */
export function menuAskCapDecision(input: { menuPart: boolean; picked: boolean; asks: number; replyIsPick: boolean; studentTurn: boolean; cap?: number }): 'advance' | 'wait' {
  if (!input.menuPart || input.picked || !input.studentTurn || input.replyIsPick) return 'wait';
  return input.asks >= (input.cap ?? MENU_ASK_CAP) ? 'advance' : 'wait';
}
/** The advance lead (fixedScriptAdvancedNote) of a menu_unpicked advance. */
export function menuUnpickedLead(from: string, next: string): string {
  return `The student did not pick an option of the "${from}" menu after it was asked twice, so we are skipping the practice today, and the lesson pointer has ALREADY moved to "${next}". Say in one short sentence that we are skipping the practice today; do not list the options again.`;
}
