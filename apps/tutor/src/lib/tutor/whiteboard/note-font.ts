/**
 * Shared resolver for the tutor-note handwriting font stack.
 *
 * next/font registers Caveat/Kalam under HASHED family names reachable
 * ONLY via the CSS custom properties `--font-caveat` / `--font-kalam` —
 * a literal 'Caveat' or 'Kalam' family name matches NOTHING the page has
 * loaded, so any surface that can't use `var(...)` falls back to the
 * platform default (serif). CSS `font-family` styles CAN use var() and
 * don't need this; the two surfaces that CANNOT are:
 *
 *   1. Canvas 2D font strings (InkNotesOverlay's measureNote — the canvas
 *      font parser silently rejects var(), see noteFont's history there).
 *   2. SVG font-family attributes on captured/baked markup that gets
 *      serialized OUT of the live DOM before rendering (whiteboard-
 *      capture's note bake — the serialized string is later rasterized
 *      by html-to-image, which resolves families against document fonts,
 *      where only the hashed names exist). 2026-07-11 round 3: baked PDF
 *      notes rendered serif because the bake site used the literal
 *      'Caveat, Kalam, cursive'.
 *
 * Resolution reads the vars off :root once and caches — both call sites
 * run in-browser after the app shell mounted, so the vars are present.
 */
let resolvedFamilies: string | null = null;

/** Returns the resolved handwriting font-family list (hashed next/font
 *  names + 'cursive' fallback), e.g. `"__Caveat_a1b2c3, cursive"`. */
export function resolveNoteFontFamilies(): string {
  if (resolvedFamilies) return resolvedFamilies;
  try {
    const cs = getComputedStyle(document.documentElement);
    const fams = ['--font-caveat', '--font-kalam']
      .map((v) => cs.getPropertyValue(v).trim())
      .filter(Boolean);
    resolvedFamilies = [...fams, 'cursive'].join(', ');
  } catch {
    resolvedFamilies = 'cursive';
  }
  return resolvedFamilies;
}
