/**
 * Pure command → PDF block mapping and layout decisions for the session PDF
 * (task 32 §B–§D). No jsPDF runtime import: node-testable from
 * scripts/test-pdf-tutor-session.ts.
 */

export interface PdfCommand {
  action: string;
  [key: string]: unknown;
}

/** DB format nests a command's fields under `data` ({action, data, timestamp,
 *  sourceMessageIndex}); live format has them flat. Flatten the DB shape. */
export function normalizePdfCommand(rawCmd: PdfCommand): PdfCommand {
  const cmdData = rawCmd.data as Record<string, unknown> | undefined;
  const dbOnlyKeys = new Set(['action', 'data', 'timestamp', 'sourceMessageIndex']);
  const hasOnlyDbKeys = Object.keys(rawCmd).every((k) => dbOnlyKeys.has(k));
  return (hasOnlyDbKeys && cmdData && typeof cmdData === 'object' && !Array.isArray(cmdData))
    ? { ...cmdData, action: rawCmd.action }
    : rawCmd;
}

/** Engine-side commands with no board render of their own: navigation,
 *  page bookkeeping, rollback, lesson-state tools. Skipped silently in both
 *  the Whiteboard Content list and the transcript's inline figures (they
 *  used to reach the captured-renderer fallback and print an
 *  "Unknown command type" card). */
export const ENGINE_ONLY_PDF_ACTIONS: ReadonlySet<string> = new Set([
  'scrollTo', 'goToPage', 'openPage', 'newPage', 'clear', 'pulse',
  'removeItem', 'removeItems', 'reviseItems', 'scribble', 'highlight',
  'advanceLesson', 'markSegmentComplete', 'proposePlanSwap', 'confirmPlanLos',
  'recordGap', 'flagPrerequisiteGap',
  'expandTopicNotesTheory', 'addTopicNotesMethod', 'addTopicNotesPointer',
]);

/** Non-`show*` actions the board renders (CommandRenderer cases + the
 *  exporter's own handwrite/link branches). */
const RENDERED_VERB_ACTIONS: ReadonlySet<string> = new Set(['handwrite', 'annotate', 'drawVector']);

export interface SentenceSegment { text: string; emphasis: boolean }

export type PdfBlock =
  | { kind: 'skip' }
  | { kind: 'render' }
  | { kind: 'unknown'; action: string }
  | {
      kind: 'sentence';
      sentence: string;
      label?: string;
      gloss?: string;
      segments: SentenceSegment[];
      /** 0-based positions (among word tokens) of the emphasised words. */
      emphasisIdx: number[];
    };

// Word tokens exactly as the live SentenceCard splits them
// (WhiteboardCanvas.tsx): letters/digits with inner apostrophes.
const WORD_SPLIT = /([\p{L}\p{N}]+(?:['\u2019][\p{L}\p{N}]+)*)/u;
const normWord = (w: string) => w.toLowerCase().replace(/\u2019/g, "'");

/** Mirror of the live SentenceCard's emphasis rule: a word is marked when it
 *  is in `emphasis`; when `emphasisAt` is given, only at those positions. */
export function sentenceSegments(sentence: string, emphasis?: unknown, emphasisAt?: unknown): { segments: SentenceSegment[]; emphasisIdx: number[] } {
  const marked = new Set((Array.isArray(emphasis) ? emphasis : [])
    .filter((w): w is string => typeof w === 'string')
    .map((w) => normWord(w.trim())).filter(Boolean));
  const at = Array.isArray(emphasisAt) && emphasisAt.length ? new Set(emphasisAt.map(Number)) : null;
  const parts = (sentence ?? '').split(WORD_SPLIT);
  const segments: SentenceSegment[] = [];
  const emphasisIdx: number[] = [];
  parts.forEach((part, i) => {
    if (!part) return;
    const isWord = i % 2 === 1;
    const wordIdx = (i - 1) / 2;
    const emph = isWord && marked.has(normWord(part)) && (!at || at.has(wordIdx));
    if (emph) emphasisIdx.push(wordIdx);
    const last = segments[segments.length - 1];
    if (last && last.emphasis === emph) last.text += part;
    else segments.push({ text: part, emphasis: emph });
  });
  return { segments, emphasisIdx };
}

/** Command → what the PDF draws for it. */
export function commandToPdfBlock(rawCmd: PdfCommand, opts: { linksEnabled?: boolean } = {}): PdfBlock {
  const cmd = normalizePdfCommand(rawCmd);
  const action = String(cmd.action || '');
  if (ENGINE_ONLY_PDF_ACTIONS.has(action)) return { kind: 'skip' };
  if (action === 'link') return opts.linksEnabled ? { kind: 'render' } : { kind: 'skip' };
  if (action === 'showSentence') {
    const sentence = typeof cmd.sentence === 'string' ? cmd.sentence : '';
    if (!sentence.trim()) return { kind: 'skip' };
    const { segments, emphasisIdx } = sentenceSegments(sentence, cmd.emphasis, cmd.emphasisAt);
    const label = typeof cmd.label === 'string' && cmd.label.trim() ? cmd.label.trim() : undefined;
    const gloss = typeof cmd.gloss === 'string' && cmd.gloss.trim() ? cmd.gloss.trim() : undefined;
    return { kind: 'sentence', sentence, label, gloss, segments, emphasisIdx };
  }
  if (action.startsWith('show') || RENDERED_VERB_ACTIONS.has(action)) return { kind: 'render' };
  return { kind: 'unknown', action: action || '(no action)' };
}

/** The handwrite caption text. Task 32 §C: no "→ margin note" suffix — in
 *  a language lesson the note IS the question or model sentence. */
export function handwriteCaptionText(rawCmd: PdfCommand): string {
  const cmd = normalizePdfCommand(rawCmd);
  return typeof cmd.text === 'string' ? cmd.text : '';
}

/** Stable id of a board command (stamped `id`, either shape). */
export function pdfCommandId(rawCmd: PdfCommand): string | undefined {
  const cmd = normalizePdfCommand(rawCmd);
  return typeof cmd.id === 'string' && cmd.id ? cmd.id : undefined;
}

/** Rough display width of a string in "Latin character" units: CJK and
 *  fullwidth characters count double. */
function displayUnits(s: string): number {
  let n = 0;
  for (const ch of s) n += /[\u3000-\u9FFF\uFF00-\uFFEF]/.test(ch) ? 2 : 1;
  return n;
}

/** Height (mm) of a sentence card at a ~162 mm content width: ≈ 22 for
 *  label + one sentence line + padding, plus wrapped sentence/gloss lines. */
export function estimateSentenceHeight(sentence: string, gloss?: string, label?: string): number {
  const sentenceLines = Math.max(1, Math.ceil(displayUnits(sentence) / 60));
  const glossLines = gloss ? Math.max(1, Math.ceil(displayUnits(gloss) / 95)) : 0;
  return 16 + (label ? 3.5 : 0) + sentenceLines * 6 + glossLines * 4.2;
}

/**
 * Page-break decision before a new whiteboard page group (task 32 §D).
 * Before, every group started a new PDF page, so a two-card Part filled a
 * page with 80 % white. Now:
 *   - the group fits below the cursor → no break (heading + rule, continue);
 *   - it does not fit but fits on a fresh page → break (keep it together);
 *   - it is taller than a page anyway → break only if its first item would
 *     not fit below the cursor.
 */
export function shouldBreakBeforeGroup(p: { y: number; groupHeight: number; firstItemHeight: number; pageTop?: number; pageBottom?: number }): boolean {
  const top = p.pageTop ?? 20;
  const bottom = p.pageBottom ?? 272;
  if (p.y + p.groupHeight <= bottom) return false;
  if (p.groupHeight <= bottom - top) return true;
  return p.y + p.firstItemHeight > bottom;
}

/** One placed token of a laid-out sentence card. */
export interface PlacedToken { text: string; emphasis: boolean; x: number }

/**
 * Greedy word wrap of a sentence's segments with mixed weights. `measure`
 * returns a token's width in the target font (bold when emphasised).
 * Whitespace never starts a line; a token wider than the line (a long CJK
 * run with no spaces) is broken by `splitLong`.
 */
export function layoutSentenceTokens(
  segments: SentenceSegment[],
  maxWidth: number,
  measure: (text: string, emphasis: boolean) => number,
  splitLong: (text: string, emphasis: boolean, width: number) => string[],
): PlacedToken[][] {
  const lines: PlacedToken[][] = [[]];
  let x = 0;
  const newLine = () => { lines.push([]); x = 0; };
  for (const seg of segments) {
    for (const piece of seg.text.split(/(\s+)/)) {
      if (!piece) continue;
      if (/^\s+$/.test(piece)) {
        if (x === 0) continue;
        x += measure(' ', seg.emphasis);
        continue;
      }
      const w = measure(piece, seg.emphasis);
      if (x > 0 && x + w > maxWidth) newLine();
      if (w > maxWidth) {
        const subs = splitLong(piece, seg.emphasis, maxWidth - x);
        subs.forEach((sub, k) => {
          if (k > 0) newLine();
          lines[lines.length - 1].push({ text: sub, emphasis: seg.emphasis, x });
          x += measure(sub, seg.emphasis);
        });
        continue;
      }
      lines[lines.length - 1].push({ text: piece, emphasis: seg.emphasis, x });
      x += w;
    }
  }
  return lines.filter((l, i) => l.length > 0 || i === 0);
}
