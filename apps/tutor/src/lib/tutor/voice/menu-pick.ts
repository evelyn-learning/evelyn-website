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
