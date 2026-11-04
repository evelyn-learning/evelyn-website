/**
 * Pure command → PDF block mapping and layout decisions for the session PDF
 * (task 32 §B–§D). No jsPDF runtime import: node-testable from
 * scripts/test-pdf-tutor-session.ts.
 */

export interface PdfCommand {
  action: string;
  [key: string]: unknown;
}

/** Actions whose own FLAT shape carries a `data` object (showGraph: `{ action, type, data: GraphData }`): a nested
 *  command of these is recognised by its content key (`type`) being absent at the top level. */
const FLAT_DATA_CONTENT_KEY: Readonly<Record<string, string>> = { showGraph: 'type' };

/** Z3 (fix wave 5): a command's fields nested under `data` — the DB shape ({action, data, timestamp,
 *  sourceMessageIndex}) and any shape carrying extra live-only keys beside `data` (id, page, anchorSentence …) —
 *  are flattened: `data` is the source of truth, the extra keys are dropped, timestamp / sourceMessageIndex kept.
 *  The former rule unwrapped only when every key was a DB key, so a nested command with one more key reached the
 *  exporter un-flattened ("Command: showSentence", an empty card). No `data` object (already flat): unchanged. */
export function normalizePdfCommand(rawCmd: PdfCommand): PdfCommand {
  const cmdData = rawCmd.data;
  if (typeof rawCmd.action !== 'string' || !cmdData || typeof cmdData !== 'object' || Array.isArray(cmdData)) return rawCmd;
  const contentKey = FLAT_DATA_CONTENT_KEY[rawCmd.action];
  if (contentKey && rawCmd[contentKey] !== undefined) return rawCmd;
  return {
    ...(cmdData as Record<string, unknown>),
    action: rawCmd.action,
    ...(rawCmd.timestamp ? { timestamp: rawCmd.timestamp } : {}),
    ...(rawCmd.sourceMessageIndex != null ? { sourceMessageIndex: rawCmd.sourceMessageIndex } : {}),
  };
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

/** Height (mm) of a drawn sentence card at a ~162 mm content width
 *  (drawSentenceCard: 3 mm padding top and bottom, 5.6 mm per sentence
 *  line, 3.4 mm label, 1 + 4.2 mm per gloss line, 2 mm gap after). With the
 *  list's badge row (~8 mm) a one-line card costs ≈ 22 mm, plus gloss lines. */
export function estimateSentenceHeight(sentence: string, gloss?: string, label?: string): number {
  const sentenceLines = Math.max(1, Math.ceil(displayUnits(sentence) / 60));
  const glossLines = gloss ? Math.max(1, Math.ceil(displayUnits(gloss) / 90)) : 0;
  return 8 + sentenceLines * 5.6 + (label ? 3.4 : 0) + (glossLines ? 1 + glossLines * 4.2 : 0) + 1;
}

/**
 * Page-break decision before a new whiteboard page group (task 32 §D).
 * Before, every group started a new PDF page, so a two-card Part filled a
 * page with 80 % white. Fix round 1: keeping a whole group together still
 * left mostly blank sheets (run-18 replay, before Part 5), so the group
 * breaks only when its heading plus FIRST item (`firstItemHeight`) does not
 * fit below the cursor; later items paginate one by one (addPageIfNeeded).
 */
export function shouldBreakBeforeGroup(p: { y: number; firstItemHeight: number; pageBottom?: number }): boolean {
  const bottom = p.pageBottom ?? 272;
  return p.y + p.firstItemHeight > bottom;
}

/**
 * One-line badge label: first line only, truncated with "..." to fit
 * `maxWidth` (in the units `measure` returns). Fix round 1: an untitled
 * problem's whole statement used to run past the right margin.
 */
export function fitBadgeLabel(text: string, maxWidth: number, measure: (t: string) => number): string {
  const first = String(text ?? '').split(/\r?\n|\\n/)[0].replace(/\s+/g, ' ').trim();
  if (measure(first) <= maxWidth) return first;
  const ell = '...';
  let lo = 0;
  let hi = first.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measure(first.slice(0, mid).trimEnd() + ell) <= maxWidth) lo = mid; else hi = mid - 1;
  }
  return lo > 0 ? first.slice(0, lo).trimEnd() + ell : ell;
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
