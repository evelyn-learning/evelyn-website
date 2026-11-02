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
    if (n) return options.find((o) => o.index === n) ?? null;
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
