/**
 * Word wrap for handwritten board notes (InkNotesOverlay's measureNote).
 *
 * Task 22 §H (GDI run 10, Image 34): a 72-character handwrite ("What is one
 * project you've worked on that you're particularly proud of?") was cut to
 * three lines ending "prou…" — the wrap stopped at 3 lines and chopped the
 * last character of a word. Now: up to NOTE_WRAP_MAX_LINES lines; the caller
 * steps the font down once (NOTE_FONT_STEP) before giving up; when the text
 * still does not fit, the ellipsis replaces the last WHOLE word(s) that do
 * not fit — never a cut inside a word.
 *
 * Pure: the width function is injected (a canvas measureText in the browser,
 * a fake in tests).
 */
export const NOTE_WRAP_MAX_LINES = 4;
/** One font step down when the text does not fit at the normal size. */
export const NOTE_FONT_STEP = 0.85;

export function wrapNoteLines(
  words: readonly string[],
  measure: (s: string) => number,
  maxW: number,
  maxLines: number = NOTE_WRAP_MAX_LINES,
): { lines: string[]; overflow: boolean } {
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const probe = line ? `${line} ${word}` : word;
    if (measure(probe) <= maxW || !line) line = probe;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return { lines, overflow: false };
  const kept = lines.slice(0, maxLines);
  // The last kept line ends in whole words + "…": drop its trailing words
  // until the ellipsis fits (one word always stays).
  const lastWords = kept[maxLines - 1]!.split(' ');
  while (lastWords.length > 1 && measure(`${lastWords.join(' ')}…`) > maxW) lastWords.pop();
  kept[maxLines - 1] = `${lastWords.join(' ')}…`;
  return { lines: kept, overflow: true };
}
